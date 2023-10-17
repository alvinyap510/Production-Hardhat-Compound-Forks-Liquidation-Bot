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

import {Withdrawable} from "./Withdrawable.sol";
import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";

contract MirrorCompoundForksLiquidationBot is
    FlashLoanReceiverBase,
    IUniswapV2Callee,
    Withdrawable
{
    using SafeMath for uint256;
    event Log(string message, uint val);

    //Contract Global Variables
    address payable CONTRACT_OWNER;
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

        IERC20 tokenToRepay = IERC20(FLASH_LOAN_TOKEN);
        ISErc20Delegator CToken = ISErc20Delegator(FLASH_LOAN_TOKEN);

        tokenToRepay.approve(address(CToken), FLASH_LOAN_AMOUNT);

        CToken.liquidateBorrow(
            BORROWER_TO_BE_LIQUIDATED,
            FLASH_LOAN_AMOUNT,
            CToken
        );
        uint256 redeemAmount = CToken.balanceOf(address(this));
        CToken.redeem(redeemAmount);

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

        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
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

        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }

    function flashLiquidate(
        uint _flashLoanMode,
        uint _bribe,
        address _comptroller,
        address _borrowerToBeLiquidated,
        address _flashLoanToken,
        uint256 _flashLoanAmount
    ) public onlyOwner {
        // _flashLoanMode 0 = Aave FlashLoan
        // _flashLoanMode 1 = Uniswap FlashLoan
        // If flash loan source unknown, function reverts
        require(
            _flashLoanMode == 0 || _flashLoanMode == 1,
            "Flash loan source unknown"
        );
        // Require valid bribe amount
        require(_bribe >= 0 && _bribe <= 100, "Invalid bribe");

        // Store the starting balance of owner to compare
        uint256 ownerStartingEthBalance = CONTRACT_OWNER.balance;

        //Assigning global variables
        COMPTROLLER = Comptroller(_comptroller);
        BORROWER_TO_BE_LIQUIDATED = _borrowerToBeLiquidated;

        //Update State of Liquidity by calling any function;
        address[] memory _tempStore = COMPTROLLER.getAllMarkets();
        ISErc20Delegator _randomToken = ISErc20Delegator(_tempStore[0]);
        uint256 _tempTemp = _randomToken.borrowBalanceCurrent(address(0));

        // Require shortfall > 0, else unliquidable
        // (uint error, uint liquidity, uint shortfall) = COMPTROLLER
        //     .getAccountLiquidity(_borrowerToBeLiquidated);
        // require(shortfall > 0, "Cannot liquidate");
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
        repayToken.transferFrom(msg.sender, address(this), _repayAmount);
        repayToken.approve(address(_repayCTokenAddress), _repayAmount);

        require(
            repayCToken.liquidateBorrow(
                _borrower,
                _repayAmount,
                STokenInterface(_cTokenCollateralToSeize)
            ) == 0,
            "liquidate failed"
        );
    }

    // function _getBorrowBalance(address _comptroller) public returns (uint) {
    //     // return cTokenBorrow.borrowBalanceCurrent(address(this));
    //     COMPTROLLER = Comptroller(_comptroller);
    //     address[] memory _tempStore = COMPTROLLER.getAllMarkets();
    //     ISErc20Delegator _randomToken = ISErc20Delegator(_tempStore[0]);
    //     return _randomToken.borrowBalanceCurrent(address(this));
    // }

    function _getBorrowBalance(address _comptroller) public returns (address) {
        // return cTokenBorrow.borrowBalanceCurrent(address(this));
        COMPTROLLER = Comptroller(_comptroller);
        address[] memory _tempStore = COMPTROLLER.getAllMarkets();
        return _tempStore[0];
        // ISErc20Delegator _randomToken = ISErc20Delegator(_tempStore[0]);
        // return _randomToken.borrowBalanceCurrent(address(this));
    }
}
