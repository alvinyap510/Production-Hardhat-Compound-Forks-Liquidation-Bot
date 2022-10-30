// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

/********************/
/* Flashloan Source */
/********************/

import {ISErc20Delegator} from "../interfaces/ISErc20Delegator.sol";
import {STokenInterface} from "../interfaces/STokenInterfaces.sol";
import {IUniswapV2Callee} from "../interfaces/IUniswapV2Callee.sol";
import "../interfaces/Uniswap.sol";
import "../interfaces/CompoundInterfaces.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/CEtherInterface.sol";
import "../interfaces/CTokenInterfaces.sol";
import "../interfaces/IPriceFeed.sol";

import {Withdrawable} from "./Withdrawable.sol";
import {FlashLoanReceiverBase} from "./FlashLoanReceiverBase.sol";
import {ILendingPool, ILendingPoolAddressesProvider, IERC20} from "./Interfaces.sol";
import {SafeMath} from "./Libraries.sol";

// FlashLoanReceiverBase,
// IUniswapV2Callee,
contract CompoundForksLiquidationBotV2 is Withdrawable {
    using SafeMath for uint256;
    event Log(string message, uint val);

    //Contract Global Variables
    // address payable public CONTRACT_OWNER;
    // IUniswapV2Router public ROUTER;
    // address public WETH;
    // address public FACTORY;

    // ILendingPoolAddressesProvider public ADDRESSES_PROVIDER; => Declared on inheritance
    // ILendingPool public LENDING_POOL; => Declared on inheritance

    //Liquidate Variables Storage
    address public WETH;
    Comptroller public COMPTROLLER;
    IPriceFeed public PRICE_FEED;
    address public BORROWER_TO_BE_LIQUIDATED;
    uint32 public BRIBE;
    address public CTOKEN_REPAY;
    address public CTOKEN_COLLATERAL_TO_SEIZE;
    address public FLASH_LOAN_TOKEN;
    uint256 public FLASH_LOAN_AMOUNT;
    uint32 public FLASH_LOAN_MODE;

    // IERC20 public SEIZED_COLLATERAL;
    // bool public IS_REPAYING_ETHER;
    // bool public IS_SEIZING_CETHER;

    // constructor(
    //     ILendingPoolAddressesProvider _addressProvider,
    //     IUniswapV2Router _UNISWAP_V2_ROUTER,
    //     address _WETH,
    //     address _FACTORY
    // ) FlashLoanReceiverBase(_addressProvider) {
    //     CONTRACT_OWNER = payable(msg.sender);
    //     ROUTER = _UNISWAP_V2_ROUTER;
    //     WETH = _WETH;
    //     FACTORY = _FACTORY;
    // }

    /********************/
    /* Main Liquidate Bot Body */
    /********************/

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
            uint256
        )
    {
        //@Check bribe percentage
        require(
            _bribePercentage >= 0 && _bribePercentage <= 100,
            "Invalid bribe percentage!"
        );

        //@Create Comptroller
        COMPTROLLER = Comptroller(_comptroller);
        PRICE_FEED = IPriceFeed(COMPTROLLER.oracle());
        BORROWER_TO_BE_LIQUIDATED = _borrowerToLiquidate;
        BRIBE = _bribePercentage;

        require(
            COMPTROLLER.isComptroller() == true,
            "Invalid comptroller address!"
        );

        //@Update State
        (
            address _highestDebtToRepay,
            uint256 _debtAmountInToken,
            uint256 _debtAmountUSD,
            address _highestCollateralToSeize,
            uint256 _collateralAmountInToken,
            uint256 _collateralAmountUSD
        ) = _updateAccountState(_comptroller, _borrowerToLiquidate);

        CTOKEN_REPAY = _highestDebtToRepay;
        CTOKEN_COLLATERAL_TO_SEIZE = _highestCollateralToSeize;
        FLASH_LOAN_TOKEN = CTokenInterface(CTOKEN_REPAY).underlying();

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
        FLASH_LOAN_MODE = _getFlashloanSource(FLASH_LOAN_TOKEN);

        /*
        //@Check Shortfall
        (, , uint shortfall) = COMPTROLLER.getAccountLiquidity(
            _borrowerToLiquidate
        );
        require(shortfall > 0, "Account not in shortfall");
        */

        return (
            _highestDebtToRepay,
            _debtAmountInToken,
            _debtAmountUSD,
            _highestCollateralToSeize,
            _collateralAmountInToken,
            _collateralAmountUSD,
            FLASH_LOAN_TOKEN,
            FLASH_LOAN_AMOUNT
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
            uint256
        )
    {
        address _highestDebtToRepay;
        uint256 _highestDebtToRepayInToken = 0;
        uint256 _highestDebtToRepayValueUSD = 0;
        address _highestColleteralToSeize;
        uint256 _highestCollateralToSeizeInToken = 0;
        uint256 _highestCollateralToSeizeValueUSD = 0;

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
            if (
                _currentCollateralUsdValue > _highestCollateralToSeizeValueUSD
            ) {
                _highestColleteralToSeize = _assetList[i];
                _highestCollateralToSeizeInToken = _currentCollateralUnderlyingAmountInToken;
                _highestCollateralToSeizeValueUSD = _currentCollateralUsdValue;
            }
        }

        // _highestDebtToRepayValueUSD = _getCollateralUnderlyingAmountInToken(
        //     _assetList[0],
        //     _borrower
        // );
        return (
            _highestDebtToRepay,
            _highestDebtToRepayInToken,
            _highestDebtToRepayValueUSD,
            _highestColleteralToSeize,
            _highestCollateralToSeizeInToken,
            _highestCollateralToSeizeValueUSD
        );
    }

    //@Author
    //Sub function to get highest debt
    // function _getHighestDebt(address _comptroller, address _borrower)
    //     public
    //     view
    //     returns (
    //         address,
    //         uint256,
    //         uint256
    //     )
    // {
    //     address _highestDebtCToken;
    //     uint256 _highestDebtInUnderlytingTokens;
    //     uint256 _highestDebtInUSD = 0;

    //     Comptroller comptroller = Comptroller(_comptroller);
    //     IPriceFeed priceFeed = IPriceFeed(comptroller.oracle());
    //     address[] memory _assetList = comptroller.getAssetsIn(_borrower);
    //     for (uint32 i = 0; i < _assetList.length; i++) {
    //         uint256 _currentDebtInUnderlytingTokens = _getDebtUnderlyingAmountInToken(
    //                 _assetList[i],
    //                 _borrower
    //             );
    //         uint256 _currentDebtInUSD = _getUsdValueOfAsset(
    //             _assetList[i],
    //             address(priceFeed),
    //             _currentDebtInUnderlytingTokens
    //         );
    //         if (_currentDebtInUSD > _highestDebtInUSD) {
    //             _highestDebtCToken = _assetList[i];
    //             _highestDebtInUnderlytingTokens = _currentDebtInUnderlytingTokens;
    //             _highestDebtInUSD = _currentDebtInUSD;
    //         }
    //     }
    //     return (
    //         _highestDebtCToken,
    //         _highestDebtInUnderlytingTokens,
    //         _highestDebtInUSD
    //     );
    // }

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

    /********************/
    /* Sub Functions Determining Flash Loan Source */
    /********************/

    function _getFlashloanSource(address _tokenAddress)
        public
        onlyOwner
        returns (uint32)
    {}

    // /********************/
    // /* Uniswap & Forks Related Swap Functions */
    // /********************/

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
        IERC20(_tokenIn).approve(address(_router), _amountIn);

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
    /* Miscellaneous */
    /********************/

    //@Author
    //Function to withdraw in case mistake is made
    function approveToken(
        address _tokenAddress,
        address _spenderAddress,
        uint256 _amount
    ) external onlyOwner {
        IERC20 token;
        token = IERC20(_tokenAddress);
        token.approve(_spenderAddress, _amount);
    }

    //@Author
    //Function to make this contract able to accept funds
    receive() external payable {}
}
