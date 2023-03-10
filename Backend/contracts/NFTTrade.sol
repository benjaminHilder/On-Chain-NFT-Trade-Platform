pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTrade{

    //       reciever address   => index         => trade offer information
    //mapping (address => mapping(uint => TradeInfo)) tradeOffers;
    // trade offer index for each address
    //mapping (address => uint) tradeOffersLength;

    mapping(address => TradeInfo[]) public tradeOffers;
    
    struct TradeInfo {
        address requesterAddress;
        address recipientAddress;

        address[] requesterNftAddresses;
        uint[]    requesterNftIDs;

        address[] recipientNftAddresses;
        uint[]    recipientNftIDs;

        //index values for where in the array its stored for each address
        uint requesterIndex;
        uint recipientIndex;

        uint timestamp;

        bool active;
        bool offerResult;
    }

    modifier TradeMustBeActive (uint _index) {
        require(tradeOffers[msg.sender][_index].active == true, "Trade offer is not active");
        _;
    }

    function createTradeRequest(address _recipientAddress, address[] memory _requesterNftAddresses, uint[] memory _requesterNftIDs, address[] memory _recipientNftAddresses, uint[] memory _recipientNftIDs) public {
        require(_requesterNftAddresses.length == _requesterNftIDs.length, "either not enough addresses or ids provided for requesters NFTs");
        require(_recipientNftAddresses.length == _recipientNftIDs.length, "either not enough addresses or ids provided for recipient NFTs");

        TradeInfo memory newTrade;

        newTrade.requesterAddress = msg.sender;
        newTrade.recipientAddress = _recipientAddress;

        newTrade.requesterNftAddresses = _requesterNftAddresses;
        newTrade.requesterNftIDs = _requesterNftIDs;

        newTrade.recipientNftAddresses = _recipientNftAddresses;
        newTrade.recipientNftIDs = _recipientNftIDs;

        newTrade.timestamp = block.timestamp;

        newTrade.requesterIndex = tradeOffers[msg.sender].length;
        newTrade.recipientIndex = tradeOffers[_recipientAddress].length;

        newTrade.active = true;
        newTrade.offerResult = false;

        tradeOffers[msg.sender].push(newTrade);
        tradeOffers[_recipientAddress].push(newTrade);
    }

    function excuteTrade(uint _index) public {
        TradeInfo memory trade = tradeOffers[msg.sender][_index];

        for (uint i = 0; i < trade.requesterNftAddresses.length; i++) {
            ERC721 NFT = ERC721(trade.requesterNftAddresses[i]);
            
            NFT.transferFrom(trade.recipientAddress, trade.requesterAddress, trade.requesterNftIDs[i]);
        }

        for (uint i = 0; i < trade.recipientNftAddresses.length; i++) {
            ERC721 NFT = ERC721(trade.recipientNftAddresses[i]);

            NFT.transferFrom(trade.requesterAddress, trade.recipientAddress, trade.recipientNftIDs[i]);
        }
    }
    
    function acceptTrade(uint _tradeOfferIndex) public TradeMustBeActive(_tradeOfferIndex) {
        TradeInfo memory tradeInfo = tradeOffers[msg.sender][_tradeOfferIndex];
        
        //requester is automatically voted to accept trade so only recipient needs to vote
        require (msg.sender == tradeInfo.recipientAddress, "Only recipient of this offer can accept or decline");
     
        tradeOffers[msg.sender][_tradeOfferIndex].offerResult = true;
        tradeOffers[tradeInfo.requesterAddress][tradeInfo.requesterIndex].offerResult = true;
        
    }

    function declineTrade(uint _tradeOfferIndex) public TradeMustBeActive(_tradeOfferIndex) {
        TradeInfo memory tradeInfo = tradeOffers[msg.sender][_tradeOfferIndex];
        
        tradeOffers[msg.sender][_tradeOfferIndex].active = false;
        tradeOffers[tradeInfo.requesterAddress][tradeInfo.requesterIndex].active = false;
    }

    function getAllOffers(address _address) public view returns(TradeInfo[] memory) {
        TradeInfo[] memory tradeInfoArray = new TradeInfo[](tradeOffers[_address].length);

        for(uint i = 0; i < tradeInfoArray.length; i++) {
            tradeInfoArray[i] = tradeOffers[_address][i];
        }

        return tradeInfoArray;
    }
}
