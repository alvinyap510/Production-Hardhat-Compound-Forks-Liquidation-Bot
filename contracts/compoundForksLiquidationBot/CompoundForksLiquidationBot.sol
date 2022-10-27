// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

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

import {Withdrawable} from "./Withdrawable.sol";
import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";

contract CompoundForksLiquidationBot is
    FlashLoanReceiverBase,
    IUniswapV2Callee,
    Withdrawable
{
    using SafeMath for uint256;
    event Log(string message, uint val);

    //Contract Global Variables
    address payable public CONTRACT_OWNER;
    IUniswapV2Router public ROUTER;
    address public WETH;
    address public FACTORY;

    // ILendingPoolAddressesProvider public ADDRESSES_PROVIDER; => Declared on inheritance
    // ILendingPool public LENDING_POOL; => Declared on inheritance

    //Liquidate Variables Storage
    Comptroller public COMPTROLLER;
    address public BORROWER_TO_BE_LIQUIDATED;
    address public FLASH_LOAN_TOKEN;
    uint256 public FLASH_LOAN_AMOUNT;
    address public CTOKEN_REPAY;
    address public CTOKEN_COLLATERAL_TO_SEIZE;
    IERC20 public SEIZED_COLLATERAL;
    bool public IS_BORROWING_ETHER;
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

    /*
    function withdraw(address _assetAddress) public onlyOwner; => Inheritance from Withdrawable.sol
    */

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

    //Call flash loan from Aave V2

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

    //This function is called by Aave LendingPool after FlashLoan
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

        /*
        IERC20 tokenToRepay = IERC20(FLASH_LOAN_TOKEN);
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);

        tokenToRepay.approve(address(CToken), FLASH_LOAN_AMOUNT);

        CToken.liquidateBorrow(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_AMOUNT,
            CToken
        );
        */

        //@Author
        //Call _liquidate
        // require(
        //     BORROWER_TO_BE_LIQUIDATED ==
        //         0xf4d50e97Ee3cbC375F0cE5c8d1bdf1CCA5DEde19,
        //     "Borrower"
        // );
        // require(address(FLASH_LOAN_TOKEN) == WETH, "Token address");
        // require(
        //     CTOKEN_REPAY == 0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92,
        //     "C Address"
        // );
        // require(FLASH_LOAN_AMOUNT == 300000000000000000, "FLASH_LOAN_AMOUNT");
        // require(
        //     CTOKEN_COLLATERAL_TO_SEIZE ==
        //         0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46,
        //     "Strike"
        // );

        _liquidate(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_TOKEN,
            CTOKEN_REPAY,
            FLASH_LOAN_AMOUNT,
            CTOKEN_COLLATERAL_TO_SEIZE
        );

        //@Author
        //Redeem underlying Asset
        /*
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
        */
        _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

        //@Auhthor
        //Swap back to flash loan token to repay
        uint256 _balanceWETH = IERC20(WETH).balanceOf(address(this));

        IERC20 _seizedAsset;
        if (_balanceWETH > 0) {
            //@Author
            //Means seized WETH
            _seizedAsset = IERC20(WETH);
        } else {
            //@Author
            //Means not seized WETH
            address _underlyingAsset = ISErc20Delegator(
                CTOKEN_COLLATERAL_TO_SEIZE
            ).underlying();
            _seizedAsset = IERC20(_underlyingAsset);
        }
        SEIZED_COLLATERAL = _seizedAsset;

        //@Author
        //If seizedAsset != Flash loan asset => swap to flashToken
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
        // IERC20 repayToken = IERC20(_repayTokenAddress);
        // ISErc20Delegator repayCToken = ISErc20Delegator(_repayCTokenAddress);
        // repayToken.transferFrom(msg.sender, address(this), _repayAmount);
        // repayToken.approve(address(_repayCTokenAddress), _repayAmount);

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

        /*
        IERC20 tokenToRepay = IERC20(FLASH_LOAN_TOKEN);
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);

        tokenToRepay.approve(address(CToken), FLASH_LOAN_AMOUNT);

        CToken.liquidateBorrow(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_AMOUNT,
            CToken
        );
        */

        //@Author
        //Call _liquidate
        _liquidate(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_TOKEN,
            CTOKEN_REPAY,
            FLASH_LOAN_AMOUNT,
            CTOKEN_COLLATERAL_TO_SEIZE
        );

        //@Author
        //Redeem underlying Asset
        /*
        ISErc20Delegator CToken = ISErc20Delegator(CTOKEN_COLLATERAL_TO_SEIZE);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
        */
        _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

        //@Auhthor
        //Swap back to flash loan token to repay
        uint256 _balanceWETH = IERC20(WETH).balanceOf(address(this));

        IERC20 _seizedAsset;

        if (_balanceWETH > 0) {
            //@Author
            //Means seized WETH
            _seizedAsset = IERC20(WETH);
        } else {
            //@Author
            //Means not seized WETH
            address _underlyingAsset = ISErc20Delegator(
                CTOKEN_COLLATERAL_TO_SEIZE
            ).underlying();
            _seizedAsset = IERC20(_underlyingAsset);
        }
        SEIZED_COLLATERAL = _seizedAsset;

        //@Author
        //If seizedAsset != Flash loan asset => swap to flashToken
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
        //@Author
        // _flashLoanMode 0 = Aave FlashLoan
        // _flashLoanMode 1 = Uniswap FlashLoan
        // If flash loan source unknown, function reverts
        require(
            _flashLoanMode == 0 || _flashLoanMode == 1,
            "Flash loan source unknown"
        );
        //@Author
        // Require valid bribe amount
        require(_bribe >= 0 && _bribe <= 100, "Invalid bribe");

        //@Author
        // Store the starting balance of owner to compare
        uint256 ownerStartingEthBalance = CONTRACT_OWNER.balance;

        //@Author
        //Assigning global variables
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

        //@Author
        //Get token to flash loan, amount & C Token
        FLASH_LOAN_TOKEN = _flashLoanToken;
        FLASH_LOAN_AMOUNT = _flashLoanAmount;
        CTOKEN_COLLATERAL_TO_SEIZE = _cTokenCollateralToSeize;
        CTOKEN_REPAY = _cTokenRepay;
        IS_SEIZING_CETHER = _isSeizingCEther;
        if (_flashLoanToken == WETH) IS_BORROWING_ETHER = true;
        else IS_BORROWING_ETHER = false;

        if (_flashLoanMode == 0) {
            aaveV2FlashLoanCall(_flashLoanToken, _flashLoanAmount);
        } else if (_flashLoanMode == 1) {
            uniswapV2FlashLoanCall(_flashLoanToken, _flashLoanAmount);
        }

        //@Author
        //Swap profit back to ETH
        if (address(SEIZED_COLLATERAL) != WETH) {
            uint256 _profitToConvert = SEIZED_COLLATERAL.balanceOf(
                address(this)
            );
            uint256 _amountMinOut = _getAmountOutMin(
                address(SEIZED_COLLATERAL),
                WETH,
                _profitToConvert
            );
            _swap(
                address(SEIZED_COLLATERAL),
                WETH,
                _profitToConvert,
                _amountMinOut,
                address(this)
            );
        }
        //@Author
        //Withdraw ETH from WETH
        IWETH WETH_INTERACT = IWETH(WETH);
        uint256 _amountWethToWithdraw = IERC20(WETH).balanceOf(address(this));
        WETH_INTERACT.withdraw(_amountWethToWithdraw);

        //@Author
        // Bribing Flashbots
        //

        // @Author
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
        IERC20 repayToken = IERC20(_repayTokenAddress);
        ISErc20Delegator repayCToken = ISErc20Delegator(_repayCTokenAddress);
        repayToken.approve(address(_repayCTokenAddress), _repayAmount);

        // require(
        //     repayCToken.liquidateBorrow(
        //         _borrower,
        //         _repayAmount,
        //         STokenInterface(_cTokenCollateralToSeize)
        //     ) == 0,
        //     "liquidate failed"
        // );
        repayCToken.liquidateBorrow(
            _borrower,
            _repayAmount,
            STokenInterface(_cTokenCollateralToSeize)
        );
    }

    function _withdrawCToken(address _cTokenAddress) internal {
        ISErc20Delegator CToken = ISErc20Delegator(_cTokenAddress);
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);
    }

    /* Uncallable code => To lookin
    function _getCToken(address _underlyingAsset)
        public
        view
        returns (address)
    {
        address[] memory allMarkets = COMPTROLLER.getAllMarkets();
        for (uint i = 0; i < allMarkets.length; i++) {
            if (
                _underlyingAsset == ISErc20Delegator(allMarkets[i]).underlying()
            ) {
                return allMarkets[i];
            }
        }
        return address(0);
    }
    */

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
        //@Author
        //New version Router => Change Code

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
