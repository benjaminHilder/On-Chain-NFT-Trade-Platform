pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 

contract MyToken is ERC721 {
    uint public supply = 0;

    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
        supply++;
    }
}