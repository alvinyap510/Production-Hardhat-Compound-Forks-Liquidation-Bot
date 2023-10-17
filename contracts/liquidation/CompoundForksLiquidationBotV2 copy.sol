// // SPDX-License-Identifier: agpl-3.0
// pragma solidity 0.8.17;

// /********************/
// /* Flashloan Source */
// /********************/

// import {ISErc20Delegator} from "../interfaces/ISErc20Delegator.sol";
// import {STokenInterface} from "../interfaces/STokenInterfaces.sol";
// import {IUniswapV2Callee} from "../interfaces/IUniswapV2Callee.sol";
// import "../interfaces/Uniswap.sol";
// import "../interfaces/CompoundInterfaces.sol";
// import "../interfaces/IWETH.sol";
// import "../interfaces/CEtherInterface.sol";
// import "../interfaces/CTokenInterfaces.sol";
// import "../interfaces/IPriceFeed.sol";

// import {Withdrawable} from "./Withdrawable.sol";
// import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
// import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
// import {SafeMath} from "./Libraries.sol";

// // FlashLoanReceiverBase,
// // IUniswapV2Callee,
// contract CompoundForksLiquidationBotV2 is
//     Withdrawable,
//     FlashLoanReceiverBase,
//     IUniswapV2Callee
// {
//     using SafeMath for uint256;
//     event Log(string message, uint val);

//     //Contract Global Variables
//     address payable public CONTRACT_OWNER;
//     address public ROUTER;
//     address public WETH;
//     address public FACTORY;

//     // ILendingPoolAddressesProvider public ADDRESSES_PROVIDER; => Declared on inheritance
//     // ILendingPool public LENDING_POOL; => Declared on inheritance

//     //Liquidate Variables Storage
//     Comptroller public COMPTROLLER;
//     IPriceFeed public PRICE_FEED;
//     address public BORROWER_TO_BE_LIQUIDATED;
//     uint32 public BRIBE;
//     address public CTOKEN_REPAY;
//     address public CTOKEN_COLLATERAL_TO_SEIZE;
//     address public FLASH_LOAN_TOKEN;
//     uint256 public FLASH_LOAN_AMOUNT;
//     uint32 public FLASH_LOAN_MODE;
//     IERC20 public SEIZED_ASSET;

//     // ILendingPoolAddressesProvider public ADDRESSES_PROVIDER; => Declared on inheritance
//     // ILendingPool public LENDING_POOL; => Declared on inheritance

//     // IERC20 public SEIZED_COLLATERAL;
//     // bool public IS_REPAYING_ETHER;
//     // bool public IS_SEIZING_CETHER;

//     constructor(
//         ILendingPoolAddressesProvider _addressProvider,
//         address _weth,
//         address _router
//     ) FlashLoanReceiverBase(_addressProvider) {
//         CONTRACT_OWNER = payable(msg.sender);
//         WETH = _weth;
//         ROUTER = _router;
//         FACTORY = IUniswapV2Router(_router).factory();
//     }

//     /********************/
//     /* Main Liquidate Bot Body */
//     /********************/

//     function flashLiquidate(
//         address _comptroller,
//         address _borrowerToLiquidate,
//         uint32 _bribePercentage
//     )
//         public
//         onlyOwner
//         returns (
//             address,
//             uint256,
//             uint256,
//             address,
//             uint256,
//             uint256,
//             address,
//             uint256,
//             uint32
//         )
//     {
//         //@Check bribe percentage

//         require(
//             _bribePercentage >= 0 && _bribePercentage <= 100,
//             "Invalid bribe percentage!"
//         );

//         //@Store owner starting Ether balance

//         uint256 ownerStartingEthBalance = CONTRACT_OWNER.balance;

//         //@Create Comptroller
//         COMPTROLLER = Comptroller(_comptroller);
//         PRICE_FEED = IPriceFeed(COMPTROLLER.oracle());
//         BORROWER_TO_BE_LIQUIDATED = _borrowerToLiquidate;
//         BRIBE = _bribePercentage;

//         require(
//             COMPTROLLER.isComptroller() == true,
//             "Invalid comptroller address!"
//         );

//         //@Update State

//         (
//             address _highestDebtToRepay,
//             uint256 _debtAmountInToken,
//             uint256 _debtAmountUSD,
//             address _highestCollateralToSeize,
//             uint256 _collateralAmountInToken,
//             uint256 _collateralAmountUSD
//         ) = _updateAccountState(_comptroller, _borrowerToLiquidate);

//         //@Check Shortfall

//         (, , uint shortfall) = COMPTROLLER.getAccountLiquidity(
//             _borrowerToLiquidate
//         );
//         require(shortfall > 0, "Account not in shortfall");

//         //@Determining repaying CToken

//         CTOKEN_REPAY = _highestDebtToRepay;
//         CTOKEN_COLLATERAL_TO_SEIZE = _highestCollateralToSeize;
//         if (CTOKEN_REPAY.balance != 0) {
//             //@Repaying Ether
//             FLASH_LOAN_TOKEN = WETH;
//         } else {
//             //@Not repaying ether
//             FLASH_LOAN_TOKEN = CTokenInterface(CTOKEN_REPAY).underlying();
//         }

//         //@Get_flash_loan_amount

//         if (_collateralAmountUSD > _debtAmountUSD.div(2)) {
//             FLASH_LOAN_AMOUNT = _debtAmountInToken.div(2) - 1;
//         } else {
//             FLASH_LOAN_AMOUNT = _debtAmountInToken
//                 .div(2)
//                 .mul(99)
//                 .div(100)
//                 .mul(_collateralAmountUSD)
//                 .div(_debtAmountUSD);
//         }

//         //@Determine Flash Loan Source
//         //0 == Aave, 1 == UniswapV2, 2 == Aave then 1inch swap

//         FLASH_LOAN_MODE = _getFlashloanSource(
//             FLASH_LOAN_TOKEN,
//             address(LENDING_POOL),
//             FACTORY
//         );

//         //@Execute based on Flash Loan Mode

//         if (FLASH_LOAN_MODE == 0) {
//             aaveV2FlashLoanCall(FLASH_LOAN_TOKEN, FLASH_LOAN_AMOUNT);
//         } else if (FLASH_LOAN_MODE == 1) {
//             uniswapV2FlashLoanCall(FLASH_LOAN_TOKEN, FLASH_LOAN_AMOUNT);
//         } else {
//             aaveV2FlashLoanCall(WETH, FLASH_LOAN_AMOUNT);
//         }

//         //@Swap profit back to WETH

//         if (address(SEIZED_ASSET) != WETH) {
//             uint256 _profitToConvert = SEIZED_ASSET.balanceOf(address(this));
//             _fastSwap(address(SEIZED_ASSET), WETH, _profitToConvert, ROUTER);
//         }

//         //@Withdraw WETH as Ether

//         IWETH WETH_INTERACT = IWETH(WETH);
//         uint256 _amountWethToWithdraw = IERC20(WETH).balanceOf(address(this));
//         WETH_INTERACT.withdraw(_amountWethToWithdraw);

//         //@Transfer profit to contract owner

//         CONTRACT_OWNER.transfer(address(this).balance);

//         //@Compare owner Ether balance to make sure liquidation is profitable

//         require(
//             CONTRACT_OWNER.balance > ownerStartingEthBalance,
//             "Losing liquidation, REVERT!"
//         );

//         return (
//             _highestDebtToRepay,
//             _debtAmountInToken,
//             _debtAmountUSD,
//             _highestCollateralToSeize,
//             _collateralAmountInToken,
//             _collateralAmountUSD,
//             FLASH_LOAN_TOKEN,
//             FLASH_LOAN_AMOUNT,
//             FLASH_LOAN_MODE
//         );
//     }

//     /********************/
//     /* Sub Functions of Updating State & Calculate Account Dent + Collateral Info */
//     /********************/

//     //@Author

//     function _updateAccountState(address _comptroller, address _borrower)
//         public
//         onlyOwner
//         returns (
//             address,
//             uint256,
//             uint256,
//             address,
//             uint256,
//             uint256
//         )
//     {
//         address _highestDebtToRepay;
//         uint256 _highestDebtToRepayInToken = 0;
//         uint256 _highestDebtToRepayValueUSD = 0;
//         address _highestColleteralToSeize;
//         uint256 _highestCollateralToSeizeInToken = 0;
//         uint256 _highestCollateralToSeizeValueUSD = 0;

//         Comptroller comptroller = Comptroller(_comptroller);
//         IPriceFeed priceFeed = IPriceFeed(comptroller.oracle());
//         address[] memory _assetList = comptroller.getAssetsIn(_borrower);
//         for (uint32 i = 0; i < _assetList.length; i++) {
//             //@Update state of _assetList[i]
//             getSupplyBalance(_assetList[i]);

//             //@Get CToken's Underlying asset price via oracle
//             uint256 _currentDebtUnderlyingAmountInToken = _getDebtUnderlyingAmountInToken(
//                     _assetList[i],
//                     _borrower
//                 );
//             uint256 _currentDebtUsdValue = _currentDebtUnderlyingAmountInToken
//                 .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
//                 .div(1e36);
//             if (_currentDebtUsdValue > _highestDebtToRepayValueUSD) {
//                 _highestDebtToRepay = _assetList[i];
//                 _highestDebtToRepayInToken = _currentDebtUnderlyingAmountInToken;
//                 _highestDebtToRepayValueUSD = _currentDebtUsdValue;
//             }
//             uint256 _currentCollateralUnderlyingAmountInToken = _getCollateralUnderlyingAmountInToken(
//                     _assetList[i],
//                     _borrower
//                 );
//             uint256 _currentCollateralUsdValue = _currentCollateralUnderlyingAmountInToken
//                     .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
//                     .div(1e36);
//             if (
//                 _currentCollateralUsdValue > _highestCollateralToSeizeValueUSD
//             ) {
//                 _highestColleteralToSeize = _assetList[i];
//                 _highestCollateralToSeizeInToken = _currentCollateralUnderlyingAmountInToken;
//                 _highestCollateralToSeizeValueUSD = _currentCollateralUsdValue;
//             }
//         }

//         return (
//             _highestDebtToRepay,
//             _highestDebtToRepayInToken,
//             _highestDebtToRepayValueUSD,
//             _highestColleteralToSeize,
//             _highestCollateralToSeizeInToken,
//             _highestCollateralToSeizeValueUSD
//         );
//     }

//     //@Author
//     //Sub function to get the total supplied asset amount of the underlying token
//     function _getCollateralUnderlyingAmountInToken(
//         address _CTokenAddress,
//         address _borrower
//     ) public view onlyOwner returns (uint256) {
//         (, uint256 _CTokenAmount, , uint256 _exchangeRate) = CTokenInterface(
//             _CTokenAddress
//         ).getAccountSnapshot(_borrower);
//         return _CTokenAmount.mul(_exchangeRate).div(1e18);
//     }

//     //@Author
//     //Sub function to get the total borrowed debt of the underlying token
//     function _getDebtUnderlyingAmountInToken(
//         address _CTokenAddress,
//         address _borrower
//     ) public view onlyOwner returns (uint256) {
//         (, , uint256 _debt, ) = CTokenInterface(_CTokenAddress)
//             .getAccountSnapshot(_borrower);
//         return _debt;
//     }

//     //@Author
//     //Sub function to get USD Value of the total underlying asset
//     function _getUsdValueOfAsset(
//         address _CTokenAddress,
//         address _priceFeed,
//         uint256 _amount
//     ) public view returns (uint256) {
//         IPriceFeed priceFeed = IPriceFeed(_priceFeed);
//         return
//             _amount.mul(priceFeed.getUnderlyingPrice(_CTokenAddress)).div(1e36);
//     }

//     //@Author
//     //Function to update CToken's borrowing state
//     function getSupplyBalance(address _cTokenCollateral)
//         public
//         onlyOwner
//         returns (uint)
//     {
//         return CErc20(_cTokenCollateral).balanceOfUnderlying(address(this));
//     }

//     function getHealthFactor(address _comptroller, address _borrower)
//         public
//         view
//         onlyOwner
//         returns (uint256)
//     {
//         uint256 _accountTotalCollateralFactoredInUsd = 0;
//         uint256 _accountTotalDebtInUsd = 0;
//         Comptroller comptroller = Comptroller(_comptroller);
//         IPriceFeed priceFeed = IPriceFeed(comptroller.oracle());
//         address[] memory _assetList = comptroller.getAssetsIn(_borrower);
//         for (uint32 i = 0; i < _assetList.length; i++) {
//             //@Calculate Collateral
//             uint256 _currentCollateralUnderlyingAmountInToken = _getCollateralUnderlyingAmountInToken(
//                     _assetList[i],
//                     _borrower
//                 );
//             uint256 _currentCollateralUsdValue = _currentCollateralUnderlyingAmountInToken
//                     .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
//                     .div(1e36);
//             (, uint256 collateralFactor, ) = comptroller.markets(_assetList[i]);
//             _accountTotalCollateralFactoredInUsd += _currentCollateralUsdValue
//                 .mul(collateralFactor)
//                 .div(1e18);
//             //@Calculate Debt
//             uint256 _currentDebtUnderlyingAmountInToken = _getDebtUnderlyingAmountInToken(
//                     _assetList[i],
//                     _borrower
//                 );
//             uint256 _currentDebtUsdValue = _currentDebtUnderlyingAmountInToken
//                 .mul(priceFeed.getUnderlyingPrice(_assetList[i]))
//                 .div(1e36);
//             _accountTotalDebtInUsd += _currentDebtUsdValue;
//         }
//         return
//             _accountTotalCollateralFactoredInUsd.mul(1e6).div(
//                 _accountTotalDebtInUsd
//             );
//     }

//     /********************/
//     /* Liquidate Functions */
//     /********************/

//     function _liquidate(
//         address _borrower,
//         address _repayTokenAddress,
//         address _repayCTokenAddress,
//         uint256 _repayAmount,
//         address _cTokenCollateralToSeize
//     ) internal {
//         //@Author
//         if (_repayCTokenAddress.balance == 0) {
//             //@Not repaying Eth
//             IERC20 repayToken = IERC20(_repayTokenAddress);
//             CErc20 repayCToken = CErc20(_repayCTokenAddress);
//             repayToken.approve(address(_repayCTokenAddress), _repayAmount);

//             require(
//                 repayCToken.liquidateBorrow(
//                     _borrower,
//                     _repayAmount,
//                     _cTokenCollateralToSeize
//                 ) == 0,
//                 "repay CToken failed"
//             );
//         } else {
//             //@Repaying Eth
//             //@Withdraw WETH as Ether first
//             IWETH WETH_INTERACT = IWETH(WETH);
//             uint256 _amountWethToWithdraw = WETH_INTERACT.balanceOf(
//                 address(this)
//             );
//             WETH_INTERACT.withdraw(_amountWethToWithdraw);

//             //@Author
//             //Repaying ether requires special CEther Interface
//             CEther repayCEther = CEther(_repayCTokenAddress);
//             repayCEther.liquidateBorrow{value: _repayAmount}(
//                 _borrower,
//                 CTokenInterface(_cTokenCollateralToSeize)
//             );
//         }
//     }

//     function _withdrawCToken(address _cTokenAddress) internal {
//         ISErc20Delegator CToken = ISErc20Delegator(_cTokenAddress);
//         uint256 redeemAmount = CToken.balanceOf(address(this));
//         CToken.redeem(redeemAmount);
//     }

//     /********************/
//     /* Sub Functions Determining Flash Loan Source */
//     /********************/

//     function _getFlashloanSource(
//         address _tokenAddress,
//         address _lendingPool,
//         address _factory
//     ) public onlyOwner returns (uint32) {
//         //@Check Supported by LendingPool

//         ILendingPool lendingPool = ILendingPool(_lendingPool);
//         address[] memory _reservesList = lendingPool.getReservesList();
//         for (uint32 i = 0; i < _reservesList.length; i++) {
//             if (_reservesList[i] == _tokenAddress) return 0;
//         }

//         //@Check Supported by UniswapV2
//         address pair = IUniswapV2Factory(_factory).getPair(_tokenAddress, WETH);
//         if (pair != address(0)) {
//             if (IERC20(_tokenAddress).balanceOf(pair) < FLASH_LOAN_AMOUNT) {
//                 FLASH_LOAN_AMOUNT = IERC20(_tokenAddress).balanceOf(pair);
//             }
//             return 1;
//         }

//         //@Use Aave Weth flash loan + 1inch Combo
//         return 2;
//     }

//     // /********************/
//     // /* Uniswap & Forks Related Swap Functions */
//     // /********************/

//     //@Author
//     function _fastSwap(
//         address _tokenIn,
//         address _tokenOut,
//         uint _amountIn,
//         address _router
//     ) internal {
//         uint256 _amountOutMin = _getAmountOutMin(
//             _tokenIn,
//             _tokenOut,
//             _amountIn,
//             _router
//         );
//         _swap(
//             _tokenIn,
//             _tokenOut,
//             _amountIn,
//             _amountOutMin,
//             address(this),
//             _router
//         );
//     }

//     //@Author
//     function _getAmountOutMin(
//         address _tokenIn,
//         address _tokenOut,
//         uint _amountIn,
//         address _router
//     ) internal view returns (uint) {
//         address[] memory path;
//         if (_tokenIn == WETH || _tokenOut == WETH) {
//             path = new address[](2);
//             path[0] = _tokenIn;
//             path[1] = _tokenOut;
//         } else {
//             path = new address[](3);
//             path[0] = _tokenIn;
//             path[1] = WETH;
//             path[2] = _tokenOut;
//         }

//         // same length as path
//         //@Author
//         //New version Router => Change Code

//         uint[] memory amountOutMins = IUniswapV2Router(_router).getAmountsOut(
//             _amountIn,
//             path
//         );

//         return amountOutMins[path.length - 1];
//     }

//     //@Author
//     //Done
//     function _swap(
//         address _tokenIn,
//         address _tokenOut,
//         uint _amountIn,
//         uint _amountOutMin,
//         address _to,
//         address _router
//     ) internal {
//         IERC20(_tokenIn).approve(address(_router), _amountIn);

//         address[] memory path;
//         if (_tokenIn == WETH || _tokenOut == WETH) {
//             path = new address[](2);
//             path[0] = _tokenIn;
//             path[1] = _tokenOut;
//         } else {
//             path = new address[](3);
//             path[0] = _tokenIn;
//             path[1] = WETH;
//             path[2] = _tokenOut;
//         }

//         IUniswapV2Router(_router).swapExactTokensForTokens(
//             _amountIn,
//             _amountOutMin,
//             path,
//             _to,
//             block.timestamp
//         );
//     }

//     /********************/
//     /* Aave Flash Loan Call */
//     /********************/

//     //@Call Aave V2 FlashLoanCall
//     function aaveV2FlashLoanCall(
//         address _flashLoanToken,
//         uint256 _flashLoanAmount
//     ) public {
//         address receiverAddress = address(this);

//         address[] memory assets = new address[](1);
//         assets[0] = _flashLoanToken;

//         uint256[] memory amounts = new uint256[](1);
//         amounts[0] = _flashLoanAmount;

//         // 0 = no debt, 1 = stable, 2 = variable
//         uint256[] memory modes = new uint256[](1);
//         modes[0] = 0;

//         address onBehalfOf = address(this);
//         bytes memory params = "";
//         uint16 referralCode = 0;

//         LENDING_POOL.flashLoan(
//             receiverAddress,
//             assets,
//             amounts,
//             modes,
//             onBehalfOf,
//             params,
//             referralCode
//         );
//     }

//     //This function is called by Aave LendingPool after FlashLoan
//     function executeOperation(
//         address[] calldata assets,
//         uint256[] calldata amounts,
//         uint256[] calldata premiums,
//         address initiator,
//         bytes calldata params
//     ) external override returns (bool) {
//         /********************/
//         /* Custom Logic Goes Here */
//         /********************/
//         //@Call Liquidation
//         _liquidate(
//             BORROWER_TO_BE_LIQUIDATED,
//             FLASH_LOAN_TOKEN,
//             CTOKEN_REPAY,
//             FLASH_LOAN_AMOUNT,
//             CTOKEN_COLLATERAL_TO_SEIZE
//         );

//         //@Withdraw from CToken Seized
//         _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

//         //@Determine & Check Seized Asset
//         if (CTOKEN_COLLATERAL_TO_SEIZE.balance != 0) {
//             //@Seized Ether
//             SEIZED_ASSET = IERC20(WETH);
//             //@Redeposit Ether as WETH
//             IWETH(WETH).deposit{value: address(this).balance}();
//         } else {
//             SEIZED_ASSET = IERC20(
//                 CTokenInterface(CTOKEN_COLLATERAL_TO_SEIZE).underlying()
//             );
//         }
//         require(
//             SEIZED_ASSET.balanceOf(address(this)) != 0,
//             "ERROR! No seized asset in contract!"
//         );
//         if (address(SEIZED_ASSET) != FLASH_LOAN_TOKEN) {
//             uint256 _amountIn = SEIZED_ASSET.balanceOf(address(this));
//             _fastSwap(
//                 address(SEIZED_ASSET),
//                 FLASH_LOAN_TOKEN,
//                 _amountIn,
//                 ROUTER
//             );
//         }
//         /********************/
//         /* Custom Logic Ends Here */
//         /********************/
//         for (uint i = 0; i < assets.length; i++) {
//             uint amountOwing = amounts[i].add(premiums[i]);
//             IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
//         }

//         return true;
//     }

//     /********************/
//     /* UniswapV2 Flash Loan Call */
//     /********************/

//     function uniswapV2FlashLoanCall(
//         address _flashLoanToken,
//         uint _flashLoanAmount
//     ) public onlyOwner {
//         if (_flashLoanToken != WETH) {
//             address pair = IUniswapV2Factory(FACTORY).getPair(
//                 _flashLoanToken,
//                 WETH
//             );
//             require(pair != address(0), "!pair");

//             address token0 = IUniswapV2Pair(pair).token0();
//             address token1 = IUniswapV2Pair(pair).token1();
//             uint amount0Out = _flashLoanToken == token0 ? _flashLoanAmount : 0;
//             uint amount1Out = _flashLoanToken == token1 ? _flashLoanAmount : 0;

//             // need to pass some data to trigger uniswapV2Call
//             bytes memory data = abi.encode(_flashLoanToken, _flashLoanAmount);

//             IUniswapV2Pair(pair).swap(
//                 amount0Out,
//                 amount1Out,
//                 address(this),
//                 data
//             );
//         } else {
//             address pair = IUniswapV2Factory(FACTORY).getPair(
//                 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,
//                 WETH
//             );
//             address token0 = IUniswapV2Pair(pair).token0();
//             address token1 = IUniswapV2Pair(pair).token1();
//             uint amount0Out = _flashLoanToken == token0 ? _flashLoanAmount : 0;
//             uint amount1Out = _flashLoanToken == token1 ? _flashLoanAmount : 0;
//             // need to pass some data to trigger uniswapV2Call
//             bytes memory data = abi.encode(_flashLoanToken, _flashLoanAmount);
//             IUniswapV2Pair(pair).swap(
//                 amount0Out,
//                 amount1Out,
//                 address(this),
//                 data
//             );
//         }
//     }

//     //This function is called by Uniswap pair contract after flashloan
//     function uniswapV2Call(
//         address _sender,
//         uint _amount0,
//         uint _amount1,
//         bytes calldata _data
//     ) external override {
//         address token0 = IUniswapV2Pair(msg.sender).token0();
//         address token1 = IUniswapV2Pair(msg.sender).token1();
//         address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
//         require(msg.sender == pair, "!pair");
//         require(_sender == address(this), "!sender");

//         (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));

//         // about 0.3%
//         uint fee = ((amount * 3) / 997) + 1;
//         uint amountToRepay = amount + fee;
//         /********************/
//         /* Custom Logic Goes Here */
//         /********************/
//         //@Call Liquidation
//         //@Call Liquidation
//         _liquidate(
//             BORROWER_TO_BE_LIQUIDATED,
//             FLASH_LOAN_TOKEN,
//             CTOKEN_REPAY,
//             FLASH_LOAN_AMOUNT,
//             CTOKEN_COLLATERAL_TO_SEIZE
//         );

//         //@Withdraw from CToken Seized
//         _withdrawCToken(CTOKEN_COLLATERAL_TO_SEIZE);

//         //@Determine & Check Seized Asset
//         if (CTOKEN_COLLATERAL_TO_SEIZE.balance != 0) {
//             //@Seized Ether
//             SEIZED_ASSET = IERC20(WETH);
//             //@Redeposit Ether as WETH
//             IWETH(WETH).deposit{value: address(this).balance}();
//         } else {
//             SEIZED_ASSET = IERC20(
//                 CTokenInterface(CTOKEN_COLLATERAL_TO_SEIZE).underlying()
//             );
//         }
//         require(
//             SEIZED_ASSET.balanceOf(address(this)) != 0,
//             "ERROR! No seized asset in contract!"
//         );
//         if (address(SEIZED_ASSET) != FLASH_LOAN_TOKEN) {
//             uint256 _amountIn = SEIZED_ASSET.balanceOf(address(this));
//             _fastSwap(
//                 address(SEIZED_ASSET),
//                 FLASH_LOAN_TOKEN,
//                 _amountIn,
//                 ROUTER
//             );
//         }
//         /********************/
//         /* Custom Logic Ends Here */
//         /********************/

//         IERC20(tokenBorrow).transfer(pair, amountToRepay);
//     }

//     /********************/
//     /* Miscellaneous */
//     /********************/
//     function updateRouter(address _router) external onlyOwner {
//         ROUTER = _router;
//         FACTORY = IUniswapV2Router(_router).factory();
//     }

//     function updateLendingPoolAddressesProvider(address _addressProvider)
//         external
//         onlyOwner
//     {
//         ADDRESSES_PROVIDER = ILendingPoolAddressesProvider(_addressProvider);
//         LENDING_POOL = ILendingPool(ADDRESSES_PROVIDER.getLendingPool());
//     }

//     //@Author
//     //Function to withdraw in case mistake is made
//     function approveToken(
//         address _tokenAddress,
//         address _spenderAddress,
//         uint256 _amount
//     ) external onlyOwner {
//         IERC20 token;
//         token = IERC20(_tokenAddress);
//         token.approve(_spenderAddress, _amount);
//     }

//     //@Author
//     //Function to make this contract able to accept funds
//     receive() external payable {}
// }
