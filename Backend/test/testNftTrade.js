const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Functions of the NFTTrade solidity smart contract", async function() {
    let NftTradeContract;

    let NftContract;

    let acc1, acc2;

    beforeEach(async function() {
        [acc1, acc2] = await ethers.getSigners();

        const nftTradeFactory = await ethers.getContractFactory("NFTTrade")
        NftTradeContract = await nftTradeFactory.deploy();
        await NftTradeContract.deployed();

        const NftContractFactory = await ethers.getContractFactory("MyToken")
        NftContract = await NftContractFactory.deploy();
        await NftContract.deployed();

        for (let i = 0; i < 3; i++) {
            await NftContract.safeMint(acc1.address, NftContract.supply())
        }

        for (let i = 0; i < 3; i++) {
            await NftContract.safeMint(acc2.address, NftContract.supply())
        }
    })

    it("Should give the correct NFT balance for each accounts", async function() {
        let bal1 = await NftContract.balanceOf(acc1.address)
        let bal2 = await NftContract.balanceOf(acc2.address)

        await expect(bal1 == 3)
        await expect(bal2 == 3)

        for (let i = 0; i < 3; i++) {
            let nftOwner = await NftContract.ownerOf(i);
            await expect (nftOwner).to.equal(acc1.address)
        }

        for (let i = 3; i < 6; i++) {
            let nftOwner = await NftContract.ownerOf(i);
            await expect (nftOwner).to.equal(acc2.address)
        }
    })

    it("Should allow allow an account to make a trade request with the NFTs they have and the NFTs the other account has", async function() {

    })

    it("", async function() {
        let requesterNftAddresses = [NftContract.address, NftContract.address, NftContract.address]
        let requesterNftIDs = [0, 1, 2]

        let recipientNftAddresses = [NftContract.address, NftContract.address, NftContract.address]
        let recipientNftIDs = [3, 4, 5]

        await NftTradeContract.connect(acc1).createTradeRequest(acc2.address, recipientNftAddresses, recipientNftIDs, requesterNftAddresses, requesterNftIDs)
    
        let result = await NftTradeContract.getAllOffers(acc1.address)
        console.log(result[0])

        expect(result[0])

        requesterNftAddresses= [NftContract.address, NftContract.address]
        recipientNftAddresses = [NftContract.address, NftContract.address]

        requesterNftIDs = [0, 1]
        recipientNftIDs = [4, 5]

        await NftTradeContract.connect(acc1).createTradeRequest(acc2.address, recipientNftAddresses, recipientNftIDs, requesterNftAddresses, requesterNftIDs)
        result = await NftTradeContract.getAllOffers(acc1.address)
        console.log(result[1])
    })
    
})