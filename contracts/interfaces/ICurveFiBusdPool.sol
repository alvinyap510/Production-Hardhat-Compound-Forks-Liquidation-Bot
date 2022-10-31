// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

interface ICurveFiBusdPool {
    function exchange_underlying(
        int128 i,
        int128 j,
        uint256 dx,
        uint256 min_dy
    ) external returns (uint256);
}
