// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

/*
    AaveV2 flashloan caller inherits this to interact with LendingPool.
*/

import {IFlashLoanReceiver, ILendingPoolAddressesProvider, ILendingPool, IERC20} from "./Interfaces.sol";

import {SafeERC20, SafeMath} from "./Libraries.sol";

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    ILendingPoolAddressesProvider public ADDRESSES_PROVIDER;
    ILendingPool public LENDING_POOL;

    constructor(ILendingPoolAddressesProvider provider) {
        ADDRESSES_PROVIDER = provider;
        LENDING_POOL = ILendingPool(provider.getLendingPool());
    }
}
