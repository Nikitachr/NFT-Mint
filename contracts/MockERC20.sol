// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name_, string memory symbol_, uint256 initialBalance_) ERC20(name_, symbol_) {
        _mint(msg.sender, initialBalance_);
    }
}
