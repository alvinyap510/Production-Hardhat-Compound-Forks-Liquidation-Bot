// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

/********************/
/* Flashloan Source */
/********************/
/*

Aave LendingPoolAddressesProvider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
Aave LendingPool: 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
USDT: 0xdAC17F958D2ee523a2206206994597C13D831ec7
USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

*/

/********************/
/* Target: Strike Finance */
/********************/

/*

Target Liquidate Account 1: 0xd026bFdB74fe1bAF1E1F1058f0d008cD1EEEd8B5 (USDC)
Target Liquidate Account 2: 0xee2826453A4Fd5AfeB7ceffeEF3fFA2320081268 (USDT)

Strke USDC - sUSDC: 0x3774E825d567125988Fb293e926064B6FAa71DAB
Strke USDT - sUSDT: 0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5

*/

/********************/
/* Code References */
/********************/

/*
Uniswap Flash Loan
Github: https://github.com/t4sk/defi-by-example/blob/main/contracts/TestUniswapFlashSwap.sol

Aave Flash Loan
Github:

Compound Liquidation
Github: https://github.com/t4sk/defi-by-example/blob/main/contracts/TestCompoundLiquidate.sol

Uniswap Swap
Github: https://github.com/t4sk/defi-by-example/blob/main/contracts/interfaces/Uniswap.sol

Flash Bot Reference:

*/

import {ISErc20Delegator} from "../interfaces/ISErc20Delegator.sol";
import {STokenInterface} from "../interfaces/STokenInterfaces.sol";
import {IUniswapV2Callee} from "../interfaces/IUniswapV2Callee.sol";
import "../interfaces/Uniswap.sol";
import "../interfaces/CompoundInterfaces.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/CEtherInterface.sol";
import "../interfaces/CTokenInterfaces.sol";

import {Withdrawable} from "./misc/Withdrawable.sol";
import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";

// FlashLoanReceiverBase
// IUniswapV2Callee
// Withdrawable
// Ownable => Inherited from Withdrawable
contract CompoundForksLiquidator is
    FlashLoanReceiverBase,
    IUniswapV2Callee,
    Withdrawable
{
    using SafeMath for uint256;
    event Log(string message, uint val);

    /*** CONSTANT VARIABLES ***/
    address payable public CONTRACT_OWNER;
    IUniswapV2Router public ROUTER;
    address public WETH;
    address public FACTORY;

    /*** INHERITED VARIABLES ***/

    // ILendingPoolAddressesProvider public ADDRESSES_PROVIDER; => Declared on inheritance
    // ILendingPool public LENDING_POOL; => Declared on inheritance

    /***  VARIABLES UPDATED ON LIQUIDATION CALL ***/
    // Declared here instead of inside function to avoid stack too flow / too many local variables error
    Comptroller public COMPTROLLER;
    address public BORROWER_TO_BE_LIQUIDATED;
    address public FLASH_LOAN_TOKEN;
    uint256 public FLASH_LOAN_AMOUNT;
    address public CTOKEN_REPAY;
    address public CTOKEN_COLLATERAL_TO_SEIZE;
    IERC20 public SEIZED_COLLATERAL;
    bool public IS_REPAYING_ETHER;
    bool public IS_SEIZING_CETHER;

    constructor(
        ILendingPoolAddressesProvider _addressProvider,
        IUniswapV2Router _UNISWAP_V2_ROUTER,
        address _WETH,
        address _FACTORY
    ) FlashLoanReceiverBase(_addressProvider) {
        CONTRACT_OWNER = payable(msg.sender);
        ROUTER = _UNISWAP_V2_ROUTER;
        WETH = _WETH;
        FACTORY = _FACTORY;
    }

    /*** FUNCTIONS ***/

    /***  HELPER FUNCTIONS ***/

    // To withdraw ERCO20 tokens from this contract by onwer
    // function withdraw(address _assetAddress) public onlyOwner; => Inheritance from Withdrawable.sol

    //To approve other contracts to pull tokens in case code goes wrong
    function approveToken(
        address _tokenAddress,
        address _spenderAddress,
        uint256 _amount
    ) external onlyOwner {
        IERC20 token;
        token = IERC20(_tokenAddress);
        token.approve(_spenderAddress, _amount);
    }

    /***  FLASHLOAN FUNCTIONS ***/

    //Using AaveV2 as FlashLoan source
    function aaveV2FlashLoanCall(
        address _flashLoanToken,
        uint256 _flashLoanAmount
    ) public {
        address receiverAddress = address(this);

        address[] memory assets = new address[](1);
        assets[0] = _flashLoanToken;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashLoanAmount;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    //Called by AaveV2 LendingPool to callback flashloan + interest
    //Actually executes custom logics of this contract and do the liquidation flow
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        /********************/
        /* Custom Logic Goes Here */
        /********************/

        //Call _liquidate
        _liquidate(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_TOKEN,
            CTOKEN_REPAY,
            FLASH_LOAN_AMOUNT,
            CTOKEN_COLLATERAL_TO_SEIZE
        );

        //Redeem underlying Asset
        /*
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
        */
        _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

        //Swap back to flash loan token to repay
        //Different flow on either seizing Ether or other ERC20 Tokens
        IERC20 _seizedAsset;

        if (IS_SEIZING_CETHER) {
            //If seized asset is Ether, redeposit ether back as WETH
            require(address(this).balance != 0, "Why contract ether is 0?");
            _seizedAsset = IERC20(WETH);
            IWETH(WETH).deposit{value: address(this).balance}();
            require(
                address(this).balance == 0,
                "Not successfully rewrap as Weth"
            );
        } else {
            //Seizing normal ERC20 Collateral
            address _underlyingAsset = ISErc20Delegator(
                CTOKEN_COLLATERAL_TO_SEIZE
            ).underlying();
            _seizedAsset = IERC20(_underlyingAsset);
        }
        SEIZED_COLLATERAL = _seizedAsset;
        require(_seizedAsset.balanceOf(address(this)) != 0, "Here");

        //If seizedAsset != flashloan borrowed assets => swap back to flashloan borrowed assets
        if (address(_seizedAsset) != FLASH_LOAN_TOKEN) {
            uint256 _amountIn = _seizedAsset.balanceOf(address(this));
            uint256 _amountMinOut = _getAmountOutMin(
                address(_seizedAsset),
                FLASH_LOAN_TOKEN,
                _amountIn
            );
            _swap(
                address(_seizedAsset),
                FLASH_LOAN_TOKEN,
                _amountIn,
                _amountMinOut,
                address(this)
            );
        }

        /********************/
        /* Custom Logic Ends Here */
        /********************/

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint i = 0; i < assets.length; i++) {
            uint amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

    //Using UniswapV2 forks as FlashLoan source
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
                0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,
                WETH
            );
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
        }
    }

    //This function is called by Uniswap pair contract after flashloan
    function uniswapV2Call(
        address _sender,
        uint _amount0,
        uint _amount1,
        bytes calldata _data
    ) external override {
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
        //Call _liquidate
        _liquidate(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_TOKEN,
            CTOKEN_REPAY,
            FLASH_LOAN_AMOUNT,
            CTOKEN_COLLATERAL_TO_SEIZE
        );

        //Redeem underlying Asset
        /*
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
        */
        _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

        //Swap back to flash loan token to repay
        //Different flow on either seizing Ether or other ERC20 Tokens
        IERC20 _seizedAsset;

        if (IS_SEIZING_CETHER) {
            //If seized asset is Ether, redeposit ether back as WETH
            require(address(this).balance != 0, "Why contract ether is 0?");
            _seizedAsset = IERC20(WETH);
            IWETH(WETH).deposit{value: address(this).balance}();
            require(
                address(this).balance == 0,
                "Not successfully rewrap as Weth"
            );
        } else {
            //Seizing normal ERC20 Collateral
            address _underlyingAsset = ISErc20Delegator(
                CTOKEN_COLLATERAL_TO_SEIZE
            ).underlying();
            _seizedAsset = IERC20(_underlyingAsset);
        }
        SEIZED_COLLATERAL = _seizedAsset;
        require(_seizedAsset.balanceOf(address(this)) != 0, "Here");

        //If seizedAsset != flashloan borrowed assets => swap back to flashloan borrowed assets
        if (address(_seizedAsset) != FLASH_LOAN_TOKEN) {
            uint256 _amountIn = _seizedAsset.balanceOf(address(this));
            uint256 _amountMinOut = _getAmountOutMin(
                address(_seizedAsset),
                FLASH_LOAN_TOKEN,
                _amountIn
            );
            _swap(
                address(_seizedAsset),
                FLASH_LOAN_TOKEN,
                _amountIn,
                _amountMinOut,
                address(this)
            );
        }

        /********************/
        /* Custom Logic Ends Here */
        /********************/
        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }

    /*** MAIN LIQUIDATION FUNCTION ***/

    function flashLiquidate(
        uint _flashLoanMode,
        uint _bribe,
        address _comptroller,
        address _borrowerToBeLiquidated,
        address _flashLoanToken,
        uint256 _flashLoanAmount,
        address _cTokenRepay,
        address _cTokenCollateralToSeize,
        bool _isSeizingCEther
    ) public onlyOwner {
        // _flashLoanMode 0 = Aave FlashLoan
        // _flashLoanMode 1 = Uniswap FlashLoan
        require(
            _flashLoanMode == 0 || _flashLoanMode == 1,
            "Flash loan source unknown"
        );
        // Require valid bribe amount
        require(_bribe >= 0 && _bribe <= 100, "Invalid bribe");

        // Store the starting balance of owner to compare
        uint256 ownerStartingEthBalance = CONTRACT_OWNER.balance;
        require(ownerStartingEthBalance != 0, "Why owner has 0 ether?");

        //Reassigning global variables
        COMPTROLLER = Comptroller(_comptroller);
        BORROWER_TO_BE_LIQUIDATED = _borrowerToBeLiquidated;

        //@Author
        //Problematic code => To relook in
        /*
        //Update State of Liquidity by calling any function;
        uint256 _tempStore = COMPTROLLER.getAllMarkets();
        ISErc20Delegator _randomToken = ISErc20Delegator(_tempStore[0]);
        _randomToken.borrowBalanceCurrent(
            0x00
        */

        //@Author
        // Require shortfall > 0, else unliquidable
        /*
        (uint error, uint liquidity, uint shortfall) = COMPTROLLER
            .getAccountLiquidity(_borrowerToBeLiquidated);
        require(shortfall > 0, "Cannot liquidate");
        */

        //Get token to flash loan, amount & C Token
        FLASH_LOAN_TOKEN = _flashLoanToken;
        FLASH_LOAN_AMOUNT = _flashLoanAmount;
        CTOKEN_COLLATERAL_TO_SEIZE = _cTokenCollateralToSeize;
        CTOKEN_REPAY = _cTokenRepay;
        IS_SEIZING_CETHER = _isSeizingCEther;
        if (_flashLoanToken == WETH) IS_REPAYING_ETHER = true;
        else IS_REPAYING_ETHER = false;

        if (_flashLoanMode == 0) {
            aaveV2FlashLoanCall(_flashLoanToken, _flashLoanAmount);
        } else if (_flashLoanMode == 1) {
            uniswapV2FlashLoanCall(_flashLoanToken, _flashLoanAmount);
        }

        //Swap profit back to ETH
        if (address(SEIZED_COLLATERAL) != WETH) {
            uint256 _profitToConvert = SEIZED_COLLATERAL.balanceOf(
                address(this)
            );
            _fastSwap(address(SEIZED_COLLATERAL), WETH, _profitToConvert);
        }

        //Withdraw ETH from WETH
        IWETH WETH_INTERACT = IWETH(WETH);
        uint256 _amountWethToWithdraw = IERC20(WETH).balanceOf(address(this));
        WETH_INTERACT.withdraw(_amountWethToWithdraw);

        // Bribing Flashbots

        // Transfer Ether to Owner
        CONTRACT_OWNER.transfer(address(this).balance);

        //Check the ending balance of owner
        require(
            CONTRACT_OWNER.balance > ownerStartingEthBalance,
            "Losing liquidation, REVERT!"
        );
    }

    function _liquidate(
        address _borrower,
        address _repayTokenAddress,
        address _repayCTokenAddress,
        uint256 _repayAmount,
        address _cTokenCollateralToSeize
    ) internal {
        //@Author
        //Update Borrow State
        // CTokenInterface(CTOKEN_COLLATERAL_TO_SEIZE).totalBorrowsCurrent();
        // (, , uint shortfall) = COMPTROLLER.getAccountLiquidity(_borrower);
        // require(shortfall > 0, "Cannot enter liquidate");

        //Store Opening CToken Balance
        uint256 openingCTokenBalance = IERC20(_cTokenCollateralToSeize)
            .balanceOf(_borrower);

        //If not repaying ether, follow normal liquidation procedure
        if (!IS_REPAYING_ETHER) {
            IERC20 repayToken = IERC20(_repayTokenAddress);
            require(
                repayToken.balanceOf(address(this)) != 0,
                "Why contract no flashloan token after flashLoan?"
            );
            CErc20 repayCToken = CErc20(_repayCTokenAddress);
            repayToken.approve(address(_repayCTokenAddress), _repayAmount);

            require(
                repayCToken.liquidateBorrow(
                    _borrower,
                    _repayAmount,
                    _cTokenCollateralToSeize
                ) == 0,
                "repay CToken failed"
            );
            // repayCToken.liquidateBorrow(
            //     _borrower,
            //     _repayAmount,
            //     STokenInterface(_cTokenCollateralToSeize)
            // );
        } else {
            //Withdraw WETH as Ether first
            IWETH WETH_INTERACT = IWETH(WETH);
            require(
                IERC20(WETH).balanceOf(address(this)) != 0,
                "Why contract no WETH after flashLoan?"
            );
            uint256 _amountWethToWithdraw = WETH_INTERACT.balanceOf(
                address(this)
            );
            WETH_INTERACT.withdraw(_amountWethToWithdraw);
            uint256 openingEthOfContractBeforeLiquidation = address(this)
                .balance;
            uint256 openingEthOfCEtherContract = _repayCTokenAddress.balance;
            require(
                IERC20(WETH).balanceOf(address(this)) == 0,
                "Why not successfully unwrap WETH to Ether?"
            );
            require(
                address(this).balance != 0,
                "Why dont have ether after unwrap?"
            );
            //Repaying ether requires special CEther Interface
            CEther repayCEther = CEther(_repayCTokenAddress);
            repayCEther.liquidateBorrow{value: _repayAmount}(
                _borrower,
                CTokenInterface(_cTokenCollateralToSeize)
            );
            // require(
            //     _repayCTokenAddress.balance == openingEthOfCEtherContract,
            //     "Value got to transferred?"
            // );
            require(
                IERC20(_cTokenCollateralToSeize).balanceOf(_borrower) <
                    openingCTokenBalance,
                "cToken Balance of borrower still the same?"
            );
            require(
                address(this).balance == 0,
                "Why this contract still got Ether?"
            );
        }
    }

    function _withdrawCToken(address _cTokenAddress) internal {
        ISErc20Delegator CToken = ISErc20Delegator(_cTokenAddress);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
    }

    function _fastSwap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn
    ) internal {
        uint256 _amountOutMin = _getAmountOutMin(
            _tokenIn,
            _tokenOut,
            _amountIn
        );
        _swap(_tokenIn, _tokenOut, _amountIn, _amountOutMin, address(this));
    }

    function _getAmountOutMin(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn
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
        // New version Router => Change Code

        uint[] memory amountOutMins = IUniswapV2Router(ROUTER).getAmountsOut(
            _amountIn,
            path
        );

        return amountOutMins[path.length - 1];
    }

    function _swap(
        address _tokenIn,
        address _tokenOut,
        uint _amountIn,
        uint _amountOutMin,
        address _to
    ) internal {
        IERC20(_tokenIn).approve(address(ROUTER), _amountIn);

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

        IUniswapV2Router(ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    receive() external payable {}
}
