// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

interface IPriceFeed {
    function getUnderlyingPrice(address cToken) external view returns (uint);
}
