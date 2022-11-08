// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

/********************/
/* Flashloan Source */
/********************/

import {ISErc20Delegator} from "../../../interfaces/ISErc20Delegator.sol";
import {STokenInterface} from "../../../interfaces/STokenInterfaces.sol";
import {IUniswapV2Callee} from "../../../interfaces/IUniswapV2Callee.sol";
import "../../../interfaces/Uniswap.sol";
import "../../../interfaces/CompoundInterfaces.sol";
import "../../../interfaces/IWETH.sol";
import "../../../interfaces/CEtherInterface.sol";
import "../../../interfaces/CTokenInterfaces.sol";
import "../../../interfaces/IPriceFeed.sol";
import "../../../interfaces/OneInchRouterInterface.sol";
import "../../../interfaces/ICurveFiBusdPool.sol";
import "../../../openzeppelin/token/ERC20/utils/SafeERC20.sol";

import {Withdrawable} from "../../Withdrawable.sol";
import {FlashLoanReceiverBase} from "../../FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider} from "../../Interfaces.sol";
import {SafeMath} from "../../Libraries.sol";

// FlashLoanReceiverBase,
// IUniswapV2Callee,
contract CompoundForksLiquidationBotV2TectonicSpecialized is
    Withdrawable,
    IUniswapV2Callee
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    event Log(string message, uint val);

    uint256 public constant MAX_INT =
        115792089237316195423570985008687907853269984665640564039457584007913129639935;
    uint256 public constant GWEI = 1e9;

    //Contract Global Variables
    address payable public CONTRACT_OWNER;
    address public ROUTER;
    address public WETH;
    address public FACTORY;
    address public USDC_ADDRESS = 0xc21223249CA28397B4B6541dfFaEcC539BfF0c59;

    //Liquidate Variables Storage
    Comptroller public COMPTROLLER;
    IPriceFeed public PRICE_FEED;
    address public BORROWER_TO_BE_LIQUIDATED;
    uint32 public BRIBE;
    address public CTOKEN_REPAY;
    address public CTOKEN_COLLATERAL_TO_SEIZE;
    address public FLASH_LOAN_TOKEN;
    uint256 public FLASH_LOAN_AMOUNT;
    uint32 public FLASH_LOAN_MODE;
    IERC20 public SEIZED_ASSET;

    constructor(address _weth, address _router) {
        CONTRACT_OWNER = payable(msg.sender);
        WETH = _weth;
        ROUTER = _router;
        FACTORY = IUniswapV2Router(_router).factory();
    }

    /********************/
    /* Main Liquidate Bot Body */
    /********************/

    //@Author manual function

    function flashLiquidate(
        address _comptroller,
        address _borrowerToLiquidate,
        uint32 _bribePercentage
    )
        public
        onlyOwner
        returns (
            address,
            uint256,
            uint256,
            address,
            uint256,
            uint256,
            address,
            uint256,
            uint32,
            uint256
        )
    {
        //@Check bribe percentage

        require(
            _bribePercentage >= 0 && _bribePercentage <= 100,
            "Invalid bribe percentage!"
        );

        //@Store owner starting Ether balance

        uint256 ownerStartingEthBalance = CONTRACT_OWNER.balance;
        uint256 beginningGas = gasleft();

        //@Create Comptroller
        COMPTROLLER = Comptroller(_comptroller);
        PRICE_FEED = IPriceFeed(COMPTROLLER.oracle());
        BORROWER_TO_BE_LIQUIDATED = _borrowerToLiquidate;
        BRIBE = _bribePercentage;

        //###Modity Tectonic Core
        require(
            COMPTROLLER.isTectonicCore() == true,
            "Invalid comptroller address!"
        );

        //@Update State

        (
            address _highestDebtToRepay,
            uint256 _debtAmountInToken,
            uint256 _debtAmountUSD,
            address _highestCollateralToSeize,
            uint256 _collateralAmountInToken,
            uint256 _collateralAmountUSD,
            uint256 _totalDebtUSD,
            uint256 _totalCollateralUSD
        ) = _updateAccountState(_comptroller, _borrowerToLiquidate);

        //@Check Shortfall

        (, , uint shortfall) = COMPTROLLER.getAccountLiquidity(
            _borrowerToLiquidate
        );
        require(shortfall > 0, "Account not in shortfall");

        //@Determining repaying CToken

        CTOKEN_REPAY = _highestDebtToRepay;
        CTOKEN_COLLATERAL_TO_SEIZE = _highestCollateralToSeize;
        if (CTOKEN_REPAY.balance != 0) {
            //@Repaying Ether
            FLASH_LOAN_TOKEN = WETH;
        } else {
            //@Not repaying ether
            FLASH_LOAN_TOKEN = CTokenInterface(CTOKEN_REPAY).underlying();
        }

        //@Get_flash_loan_amount

        if (_collateralAmountUSD > _debtAmountUSD.div(2)) {
            FLASH_LOAN_AMOUNT = _debtAmountInToken.div(2) - 1;
        } else {
            FLASH_LOAN_AMOUNT = _debtAmountInToken
                .div(2)
                .mul(99)
                .div(100)
                .mul(_collateralAmountUSD)
                .div(_debtAmountUSD);
        }

        //@Determine Flash Loan Source
        //0 == Aave, 1 == UniswapV2, 2 == Aave then 1inch swap

        FLASH_LOAN_MODE = _getFlashloanSource(FLASH_LOAN_TOKEN, FACTORY);

        //@Execute based on Flash Loan Mode

        if (FLASH_LOAN_MODE == 1) {
            uniswapV2FlashLoanCall(FLASH_LOAN_TOKEN, FLASH_LOAN_AMOUNT);
        }

        //@Swap profit back to WETH

        if (FLASH_LOAN_TOKEN != WETH) {
            uint256 _profitToConvert = IERC20(FLASH_LOAN_TOKEN).balanceOf(
                address(this)
            );
            _fastSwap(FLASH_LOAN_TOKEN, WETH, _profitToConvert, ROUTER);
        }

        //@Withdraw WETH as Ether

        IWETH WETH_INTERACT = IWETH(WETH);
        uint256 _amountWethToWithdraw = IERC20(WETH).balanceOf(address(this));
        WETH_INTERACT.withdraw(_amountWethToWithdraw);

        //@Bribe flashbots miners
        uint256 _profit = address(this).balance;
        uint256 _profitToBribe = _profit.mul(_bribePercentage).div(100);
        block.coinbase.transfer(_profitToBribe);

        //@Transfer profit to contract owner

        CONTRACT_OWNER.transfer(address(this).balance);

        //@Compare owner Ether balance to make sure liquidation is profitable
        uint256 endingGas = gasleft();
        uint256 usedGas = beginningGas - endingGas;
        uint256 gasCost = usedGas.mul(tx.gasprice);

        /*
        require(
            CONTRACT_OWNER.balance > ownerStartingEthBalance,
            "Losing liquidation, REVERT!"
        );
        */

        return (
            _highestDebtToRepay,
            _debtAmountInToken,
            _debtAmountUSD,
            _highestCollateralToSeize,
            _collateralAmountInToken,
            _collateralAmountUSD,
            FLASH_LOAN_TOKEN,
            FLASH_LOAN_AMOUNT,
            FLASH_LOAN_MODE,
            gasCost
        );
    }

    /********************/
    /* Sub Functions of Updating State & Calculate Account Dent + Collateral Info */
    /********************/

    //@Author

    function _updateAccountState(address _comptroller, address _borrower)
        public
        onlyOwner
        returns (
            address,
            uint256,
            uint256,
            address,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        address _highestDebtToRepay;
        uint256 _highestDebtToRepayInToken = 0;
        uint256 _highestDebtToRepayValueUSD = 0;

        address _highestColleteralToSeize;
        uint256 _highestCollateralToSeizeInToken = 0;
        uint256 _highestCollateralToSeizeValueUSD = 0;
        uint256 _totalDebtUSD = 0;
        uint256 _totalCollateralUSD = 0;

        Comptroller comptroller = Comptroller(_comptroller);
        IPriceFeed priceFeed = IPriceFeed(comptroller.oracle());
        address[] memory _assetList = comptroller.getAssetsIn(_borrower);
        for (uint32 i = 0; i < _assetList.length; i++) {
            //@Update state of _assetList[i]
            getSupplyBalance(_assetList[i]);

            //@Get CToken's Underlying asset price via oracle
            uint256 _currentDebtUnderlyingAmountInToken = _getDebtUnderlyingAmountInToken(
                    _assetList[i],
                    _borrower
                );
            uint256 _currentDebtUsdValue = _currentDebtUnderlyingAmountInToken
                .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
                .div(1e36);
            _totalDebtUSD += _currentDebtUsdValue;
            if (_currentDebtUsdValue > _highestDebtToRepayValueUSD) {
                _highestDebtToRepay = _assetList[i];
                _highestDebtToRepayInToken = _currentDebtUnderlyingAmountInToken;
                _highestDebtToRepayValueUSD = _currentDebtUsdValue;
            }
            uint256 _currentCollateralUnderlyingAmountInToken = _getCollateralUnderlyingAmountInToken(
                    _assetList[i],
                    _borrower
                );
            uint256 _currentCollateralUsdValue = _currentCollateralUnderlyingAmountInToken
                    .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
                    .div(1e36);
            _totalCollateralUSD += _currentCollateralUsdValue;
            if (
                _currentCollateralUsdValue > _highestCollateralToSeizeValueUSD
            ) {
                _highestColleteralToSeize = _assetList[i];
                _highestCollateralToSeizeInToken = _currentCollateralUnderlyingAmountInToken;
                _highestCollateralToSeizeValueUSD = _currentCollateralUsdValue;
            }
        }

        return (
            _highestDebtToRepay,
            _highestDebtToRepayInToken,
            _highestDebtToRepayValueUSD,
            _highestColleteralToSeize,
            _highestCollateralToSeizeInToken,
            _highestCollateralToSeizeValueUSD,
            _totalDebtUSD,
            _totalCollateralUSD
        );
    }

    //@Author
    //Sub function to get the total supplied asset amount of the underlying token
    function _getCollateralUnderlyingAmountInToken(
        address _CTokenAddress,
        address _borrower
    ) public view onlyOwner returns (uint256) {
        (, uint256 _CTokenAmount, , uint256 _exchangeRate) = CTokenInterface(
            _CTokenAddress
        ).getAccountSnapshot(_borrower);
        return _CTokenAmount.mul(_exchangeRate).div(1e18);
    }

    //@Author
    //Sub function to get the total borrowed debt of the underlying token
    function _getDebtUnderlyingAmountInToken(
        address _CTokenAddress,
        address _borrower
    ) public view onlyOwner returns (uint256) {
        (, , uint256 _debt, ) = CTokenInterface(_CTokenAddress)
            .getAccountSnapshot(_borrower);
        return _debt;
    }

    //@Author
    //Sub function to get USD Value of the total underlying asset
    function _getUsdValueOfAsset(
        address _CTokenAddress,
        address _priceFeed,
        uint256 _amount
    ) public view returns (uint256) {
        IPriceFeed priceFeed = IPriceFeed(_priceFeed);
        return
            _amount.mul(priceFeed.getUnderlyingPrice(_CTokenAddress)).div(1e36);
    }

    //@Author
    //Function to update CToken's borrowing state
    function getSupplyBalance(address _cTokenCollateral)
        public
        onlyOwner
        returns (uint)
    {
        return CErc20(_cTokenCollateral).balanceOfUnderlying(address(this));
    }

    function getHealthFactor(address _comptroller, address _borrower)
        public
        view
        onlyOwner
        returns (uint256)
    {
        uint256 _accountTotalCollateralFactoredInUsd = 0;
        uint256 _accountTotalDebtInUsd = 1;
        Comptroller comptroller = Comptroller(_comptroller);
        IPriceFeed priceFeed = IPriceFeed(comptroller.oracle());
        address[] memory _assetList = comptroller.getAssetsIn(_borrower);
        for (uint32 i = 0; i < _assetList.length; i++) {
            //@Calculate Collateral
            uint256 _currentCollateralUnderlyingAmountInToken = _getCollateralUnderlyingAmountInToken(
                    _assetList[i],
                    _borrower
                );
            uint256 _currentCollateralUsdValue = _currentCollateralUnderlyingAmountInToken
                    .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
                    .div(1e36);
            (, uint256 collateralFactor, ) = comptroller.markets(_assetList[i]);
            _accountTotalCollateralFactoredInUsd += _currentCollateralUsdValue
                .mul(collateralFactor)
                .div(1e18);
            //@Calculate Debt
            uint256 _currentDebtUnderlyingAmountInToken = _getDebtUnderlyingAmountInToken(
                    _assetList[i],
                    _borrower
                );
            uint256 _currentDebtUsdValue = _currentDebtUnderlyingAmountInToken
                .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
                .div(1e36);
            _accountTotalDebtInUsd += _currentDebtUsdValue;
        }
        return
            _accountTotalCollateralFactoredInUsd.mul(1e6).div(
                _accountTotalDebtInUsd
            );
    }

    /********************/
    /* Liquidate Functions */
    /********************/

    function _liquidate(
        address _borrower,
        address _repayTokenAddress,
        address _repayCTokenAddress,
        uint256 _repayAmount,
        address _cTokenCollateralToSeize
    ) public {
        //@Author
        if (_repayCTokenAddress.balance == 0) {
            //@Not repaying Eth
            IERC20 repayToken = IERC20(_repayTokenAddress);
            CErc20 repayCToken = CErc20(_repayCTokenAddress);

            repayToken.safeApprove(_repayCTokenAddress, _repayAmount);
            //USDT before here
            require(
                repayToken.allowance(address(this), _repayCTokenAddress) ==
                    _repayAmount,
                "Failed to approve token spending"
            );

            require(
                repayCToken.liquidateBorrow(
                    _borrower,
                    _repayAmount,
                    _cTokenCollateralToSeize
                ) == 0,
                "repay CToken failed"
            );
            require(
                repayToken.balanceOf(address(this)) == 0,
                "Flash loan token not utilized by _liquidate"
            );
        } else {
            //@Repaying Eth
            //@Withdraw WETH as Ether first
            IWETH WETH_INTERACT = IWETH(WETH);
            uint256 _amountWethToWithdraw = WETH_INTERACT.balanceOf(
                address(this)
            );
            WETH_INTERACT.withdraw(_amountWethToWithdraw);

            //@Author
            //Repaying ether requires special CEther Interface
            CEther repayCEther = CEther(_repayCTokenAddress);
            repayCEther.liquidateBorrow{value: _repayAmount}(
                _borrower,
                CTokenInterface(_cTokenCollateralToSeize)
            );
        }
    }

    function _withdrawCToken(address _cTokenAddress) internal {
        ISErc20Delegator CToken = ISErc20Delegator(_cTokenAddress);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
    }

    /********************/
    /* Sub Functions Determining Flash Loan Source */
    /********************/

    //###Modity FlashLoanSource
    function _getFlashloanSource(address _tokenAddress, address _factory)
        public
        onlyOwner
        returns (uint32)
    {
        //@Check Supported by UniswapV2
        address pair = IUniswapV2Factory(_factory).getPair(_tokenAddress, WETH);
        if (pair != address(0)) {
            if (IERC20(_tokenAddress).balanceOf(pair) < FLASH_LOAN_AMOUNT) {
                FLASH_LOAN_AMOUNT = IERC20(_tokenAddress).balanceOf(pair);
            }
            return 1;
        }
        //@Switch
        return 1;
    }

    // /********************/
    // /* Uniswap & Forks Related Swap Functions */
    // /********************/

    //@Author
    function _checkWethPairLiquidity(
        address _tokenAddress,
        uint256 _amount,
        uint256 _factor
    ) internal view returns (uint32) {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenAddress, WETH);
        if (pair == address(0)) return 1;
        if (IERC20(_tokenAddress).balanceOf(pair) < _amount.mul(_factor))
            return 2;
        return 0;
    }

    //@Author
    function _fastSwap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        address _router
    ) internal {
        uint256 _amountOutMin = _getAmountOutMin(
            _tokenIn,
            _tokenOut,
            _amountIn,
            _router
        );
        _swap(
            _tokenIn,
            _tokenOut,
            _amountIn,
            _amountOutMin,
            address(this),
            _router
        );
    }

    //@Author
    function _getAmountOutMin(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        address _router
    ) internal view returns (uint) {
        address[] memory path;
        if (_tokenIn == WETH || _tokenOut == WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }

        // same length as path
        //@Author
        //New version Router => Change Code

        uint[] memory amountOutMins = IUniswapV2Router(_router).getAmountsOut(
            _amountIn,
            path
        );

        return amountOutMins[path.length - 1];
    }

    //@Author
    //Done
    function _swap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        uint _amountOutMin,
        address _to,
        address _router
    ) internal {
        IERC20(_tokenIn).safeApprove(address(_router), _amountIn);

        address[] memory path;
        if (_tokenIn == WETH || _tokenOut == WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }

        IUniswapV2Router(_router).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    /********************/
    /* UniswapV2 Flash Loan Call */
    /********************/

    function uniswapV2FlashLoanCall(
        address _flashLoanToken,
        uint _flashLoanAmount
    ) public onlyOwner {
        if (_flashLoanToken != WETH) {
            address pair = IUniswapV2Factory(FACTORY).getPair(
                _flashLoanToken,
                WETH
            );
            require(pair != address(0), "!pair");

            address token0 = IUniswapV2Pair(pair).token0();
            address token1 = IUniswapV2Pair(pair).token1();
            uint amount0Out = _flashLoanToken == token0 ? _flashLoanAmount : 0;
            uint amount1Out = _flashLoanToken == token1 ? _flashLoanAmount : 0;

            // need to pass some data to trigger uniswapV2Call
            bytes memory data = abi.encode(_flashLoanToken, _flashLoanAmount);

            IUniswapV2Pair(pair).swap(
                amount0Out,
                amount1Out,
                address(this),
                data
            );
        } else {
            address pair = IUniswapV2Factory(FACTORY).getPair(
                USDC_ADDRESS,
                WETH
            );
            address token0 = IUniswapV2Pair(pair).token0();
            address token1 = IUniswapV2Pair(pair).token1();
            uint amount0Out = _flashLoanToken == token0 ? _flashLoanAmount : 0;
            uint amount1Out = _flashLoanToken == token1 ? _flashLoanAmount : 0;
            // need to pass some data to trigger uniswapV2Call
            bytes memory data = abi.encode(_flashLoanToken, _flashLoanAmount);
            // FLASH_LOAN_AMOUNT == 1000 * 1e18;
            // bytes memory data = abi.encode(_flashLoanToken, FLASH_LOAN_AMOUNT);
            IUniswapV2Pair(pair).swap(
                amount0Out,
                amount1Out,
                address(this),
                data
            );
        }
        require(
            IERC20(FLASH_LOAN_TOKEN).balanceOf(address(this)) != 0,
            "Uniswap Flash Loan Unsuccessful"
        );
    }

    //@Just to get rid of error
    function uniswapV2Call(
        address _sender,
        uint _amount0,
        uint _amount1,
        bytes calldata _data
    ) external override {}

    //This function is called by Uniswap pair contract after flashloan
    function vvsCall(
        address _sender,
        uint _amount0,
        uint _amount1,
        bytes calldata _data
    ) external {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "!pair");
        require(_sender == address(this), "!sender");

        (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));
        // about 0.3%
        uint fee = ((amount * 3) / 997) + 1;
        uint amountToRepay = amount + fee;
        /********************/
        /* Custom Logic Goes Here */
        /********************/
        require(
            IERC20(FLASH_LOAN_TOKEN).balanceOf(address(this)) != 0,
            "Uniswap Flash Loan Unsuccessful"
        );

        //@Call Liquidation
        _liquidate(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_TOKEN,
            CTOKEN_REPAY,
            FLASH_LOAN_AMOUNT,
            CTOKEN_COLLATERAL_TO_SEIZE
        );

        require(
            IERC20(FLASH_LOAN_TOKEN).balanceOf(address(this)) == 0,
            "_liquidate unsuccessful"
        );

        //@Withdraw from CToken Seized
        _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);
        require(
            CTokenInterface(CTOKEN_COLLATERAL_TO_SEIZE).balanceOf(
                address(this)
            ) == 0,
            "Uncessfull redeeming CToken"
        );

        //@Determine & Check Seized Asset
        if (CTOKEN_COLLATERAL_TO_SEIZE.balance != 0) {
            //@Seized Ether
            SEIZED_ASSET = IERC20(WETH);
            //@Redeposit Ether as WETH
            IWETH(WETH).deposit{value: address(this).balance}();
        } else {
            SEIZED_ASSET = IERC20(
                CTokenInterface(CTOKEN_COLLATERAL_TO_SEIZE).underlying()
            );
        }
        require(
            SEIZED_ASSET.balanceOf(address(this)) != 0,
            "ERROR! No seized asset in contract!"
        );

        if (address(SEIZED_ASSET) != FLASH_LOAN_TOKEN) {
            //@Swap back to FLASH_LOAN_TOKAN
            uint256 _amountIn = SEIZED_ASSET.balanceOf(address(this));
            _fastSwap(
                address(SEIZED_ASSET),
                FLASH_LOAN_TOKEN,
                _amountIn,
                ROUTER
            );
        }
        uint256 amountOfSeizedAsset = IERC20(address(SEIZED_ASSET)).balanceOf(
            address(this)
        );
        uint256 amountOfBorrowedToken = IERC20(address(FLASH_LOAN_TOKEN))
            .balanceOf(address(this));
        require(amountOfSeizedAsset == 0, "Here");
        require(amountOfBorrowedToken != 0, "Here2");
        require(amountOfBorrowedToken > amountToRepay, "Here3");

        /********************/
        /* Custom Logic Ends Here */
        /********************/

        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }

    /********************/
    /* Miscellaneous */
    /********************/
    function updateRouter(address _router) external onlyOwner {
        ROUTER = _router;
        FACTORY = IUniswapV2Router(_router).factory();
    }

    //@Author
    //Function to withdraw in case mistake is made
    function approveToken(
        address _tokenAddress,
        address _spenderAddress,
        uint256 _amount
    ) external onlyOwner {
        IERC20 token;
        token = IERC20(_tokenAddress);
        token.safeApprove(_spenderAddress, _amount);
    }

    //@Author
    //Function to make this contract able to accept funds
    receive() external payable {}
}
