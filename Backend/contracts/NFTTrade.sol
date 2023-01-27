pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/certifier/Certifier.sol";

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
        bool result;
        bool requesterReady;
        bool recipientReady;
    }

    modifier TradeMustBeActive (uint _index) {
        require(TradeInfo[msg.sender][_index].active == true, "Trade offer is not active");
        _;
    }

    function createTradeRequest(address _recipientAddress, address[] _requesterNftAddresses, uint[] _requesterNftIDs, address[] _recipientNftAddresses, uint[] _recipientNftIDs) public {
        require(_requesterNftAddresses.length == _requesterNftIDs.length, "either not enough addresses or ids provided for requesters NFTs");
        require(_recipientNftAddresses.length == _recipientNftIDs.length, "either not enough addresses or ids provided for recipient NFTs");

        TradeInfo newTrade;

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
        newTrade.result = false;

        newTrade.requesterReady = false;
        newTrade.recipientReady = false;

        tradeOffers[msg.sender].push(newTrade);
        tradeOffers[_recipientAddress].push(newTrade);
    }

    function giveContractAccessToNFTs(uint _index) public {
        TradeInfo memory trade = tradeOffers[msg.sender][_index];
        require(trade.active == false, "trade offer not decided yet");
        require(trade.result == true, "trade offer not accepted yet");

        address[] nftAddress;
        uint[] nftIDs;

        if (trade.requesterAddresses == msg.sender) {
            nftAddress = trade.requesterNftAddresses;
            nftIDs = trade.requesterNftIDs;
            

        } else {
            nftAddress = trade.recipientNftAddresses;
            nftIDs = trade.recipientNftIDs;
        }

        for (uint i = 0; i < nftAddress.length; i++) {
                //ERC721 NFT = ERC721(nftAddress[i]);
                //(bool success, bytes memory data) = NFT.delegatecall()
                nftAddress[i].delegateCall(abi.encodeWithSelector("approve(address,uint256)", address(this), nftIDs[i]));
            }
        }

        if (trade.requesterAddresses == msg.sender) {
            tradeOffers[msg.sender][_index].requesterReady = true;
        } else {
            tradeOffers[msg.sender][_index].recipientReady = true;
        }
    }

    function excuteTrade(uint _index) public {
        TradeInfo memory trade = tradeOffers[msg.sender][_index];

        require(trade.requesterReady == true && trade.recipientReady == true)

        for (uint i = 0; i < trade.requesterNftAddresses.length; i++) {
            ERC721 NFT = ERC721(trade.requesterNftAddresses[i]);
            NFT.transferFrom(trade.recipientAddress, trade.recieverAddress, trade.requesterNftIDs[i]);
        }

        for (uint i = 0; i < trade.recipientNftAddresses.length; i++) {
            ERC721 NFT = ERC721(trade.recipientNftAddresses[i]);
            NFT.transferFrom(trade.recieverAddress, trade.recipientAddress, trade.requesterNftIDs[i]);
        
        }

    }
    
    function acceptTrade(uint _tradeId) public TradeMustBeActive {
        TradeInfo tradeInfo = TradeInfo[msg.sender][_tradeOfferIndex];

        TradeInfo[msg.sender][_tradeOfferIndex].active = false;
        TradeInfo[tradeInfo[requesterIndex]].active = false;
    }

    function declineTrade(uint _tradeOfferIndex) public TradeMustBeActive {
        TradeInfo tradeInfo = TradeInfo[msg.sender][_tradeOfferIndex];
        //require(msg.sender == tradeInfo.recipientAddress, "Only recipient of a trade offer can decline a trade");
        
        TradeInfo[msg.sender][_tradeOfferIndex].active = false;
        TradeInfo[tradeInfo[requesterIndex]].active = false;
    }

    function getAllOffers(address _address) public view returns(TradeInfo[] memory) {
        TradeInfo[] tradeInfoArray;

        for(uint i = 0; i < tradeoffersLength; i++) {
            tradeInfoArray.push(tradeOffers[_address][i]);
        }

        return tradeInfoArray;
    }
   
    }
}