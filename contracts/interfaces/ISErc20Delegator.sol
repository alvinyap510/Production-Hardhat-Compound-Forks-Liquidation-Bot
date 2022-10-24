// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

import "./STokenInterfaces.sol";

/**
 * @title Strike's SErc20Delegator Contract
 * @notice STokens which wrap an EIP-20 underlying and delegate to an implementation
 * @author Strike
 */
abstract contract ISErc20Delegator is
    STokenInterface,
    SErc20Interface,
    SDelegatorInterface
{

}
