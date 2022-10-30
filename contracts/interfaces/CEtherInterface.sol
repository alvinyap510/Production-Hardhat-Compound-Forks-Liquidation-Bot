// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import {CTokenInterface} from "./CTokenInterfaces.sol";

abstract contract CEther is CTokenInterface {
    function redeem(uint redeemTokens) external virtual returns (uint);

    function liquidateBorrow(address borrower, CTokenInterface cTokenCollateral)
        external
        payable
        virtual;
}
