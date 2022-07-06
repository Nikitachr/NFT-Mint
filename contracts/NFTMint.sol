// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMint is ERC721A, Ownable {

    uint256 public constant price = 10 ether;
    uint256 public constant USDTPrice = 10 ether;
    IERC20 public immutable USDT;
    string private baseURI = "test";

    constructor(string memory name_, string memory symbol_, IERC20 USDT_) ERC721A(name_, symbol_) {
        USDT = IERC20(USDT_);
    }

    function mintForAvax(uint256 quantity) external payable {
        require(msg.value == price * quantity, "wrong value");
        _mint(msg.sender, quantity);
    }

    function mintForUSDT(uint256 quantity) external {
        uint256 amount = USDTPrice * quantity;
        require(USDT.allowance(msg.sender, address(this)) >= amount, "check your allowance");
        bool success = USDT.transferFrom(msg.sender, address(this), amount);
        require(success, "something went wrong");
        _mint(msg.sender, quantity);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory uri) external onlyOwner {
        baseURI = uri;
    }

}
