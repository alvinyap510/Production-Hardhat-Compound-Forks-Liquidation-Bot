// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import "../openzeppelin/token/ERC20/IERC20.sol";

interface OneInchRouterInterface {
    function clipperSwap(
        IERC20 srcToken,
        IERC20 dstToken,
        uint256 amount,
        uint256 minReturn
    ) external payable returns (uint256 returnAmount);

    function clipperSwapTo(
        address payable recipient,
        IERC20 srcToken,
        IERC20 dstToken,
        uint256 amount,
        uint256 minReturn
    ) external payable returns (uint256 returnAmount);
}
