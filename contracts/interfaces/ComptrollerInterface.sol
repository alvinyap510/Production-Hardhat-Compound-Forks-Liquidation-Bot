// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.17;

abstract contract ComptrollerInterface {
    /// @notice Indicator that this is a Comptroller contract (for inspection)
    bool public constant isComptroller = true;

    /*** Assets You Are In ***/

    function enterMarkets(address[] calldata sTokens)
        external
        virtual
        returns (uint[] memory);

    function exitMarket(address sToken) external virtual returns (uint);

    /*** Policy Hooks ***/

    function mintAllowed(
        address sToken,
        address minter,
        uint mintAmount
    ) external virtual returns (uint);

    function mintVerify(
        address sToken,
        address minter,
        uint mintAmount,
        uint mintTokens
    ) external virtual;

    function redeemAllowed(
        address sToken,
        address redeemer,
        uint redeemTokens
    ) external virtual returns (uint);

    function redeemVerify(
        address sToken,
        address redeemer,
        uint redeemAmount,
        uint redeemTokens
    ) external virtual;

    function borrowAllowed(
        address sToken,
        address borrower,
        uint borrowAmount
    ) external virtual returns (uint);

    function borrowVerify(
        address sToken,
        address borrower,
        uint borrowAmount
    ) external virtual;

    function repayBorrowAllowed(
        address sToken,
        address payer,
        address borrower,
        uint repayAmount
    ) external virtual returns (uint);

    function repayBorrowVerify(
        address sToken,
        address payer,
        address borrower,
        uint repayAmount,
        uint borrowerIndex
    ) external virtual;

    function liquidateBorrowAllowed(
        address sTokenBorrowed,
        address sTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount
    ) external virtual returns (uint);

    function liquidateBorrowVerify(
        address sTokenBorrowed,
        address sTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount,
        uint seizeTokens
    ) external virtual;

    function seizeAllowed(
        address sTokenCollateral,
        address sTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens
    ) external virtual returns (uint);

    function seizeVerify(
        address sTokenCollateral,
        address sTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens
    ) external virtual;

    function transferAllowed(
        address sToken,
        address src,
        address dst,
        uint transferTokens
    ) external virtual returns (uint);

    function transferVerify(
        address sToken,
        address src,
        address dst,
        uint transferTokens
    ) external virtual;

    /*** Liquidity/Liquidation Calculations ***/

    function liquidateCalculateSeizeTokens(
        address sTokenBorrowed,
        address sTokenCollateral,
        uint repayAmount
    ) external view virtual returns (uint, uint);
}

interface IComptroller {
    /*** Reserve Info ***/
    function reserveGuardian() external view returns (address payable);

    function reserveAddress() external view returns (address payable);
}
