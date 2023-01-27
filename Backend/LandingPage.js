import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ethers } from 'ethers';

const crypto = require('crypto');

export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress

let nftBoxes = document.querySelector(".UserNFTs");

let RecipientTradeBox = document.getElementById("RecipientTradeBox")

let UserSelected = new Set()
let RecipientSelected = new Set()


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtQwoCVLyGZtzY6jfebdOrBL9B1Ts-lhs",
  authDomain: "nft-trade-platform.firebaseapp.com",
  projectId: "nft-trade-platform",
  storageBucket: "nft-trade-platform.appspot.com",
  messagingSenderId: "289639626075",
  appId: "1:289639626075:web:aa1dae118296cfff4e967e",
  measurementId: "G-HJW2SHLWDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = firebase.firestore();

class nftInfo {
  constructor(contractAddress, ID, ImgURL) {
  this.contractAddress = contractAddress
  this.ID = ID
  this.ImgURL = ImgURL
  this.Selected = false;

  }
}

class TradeData {
  constructor(hash, nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp) {
    this.Hash = hash;
    this.NFTsReceived = nftsBeingReceived;
    this.NFTsSent = nftsBeingSent;
    this.RecipientWalletAddress = recipientWalletAddress;
    this.RequesterWalletAddress = requesterWalletAddress;
    this.Status = status;
    this.Timestamp = timestamp;
  }
}

async function createHash(nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp) {
  const jsonTrade = JSON.stringify(nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp);
  const hash = crypto.createHash('sha256').update(jsonTrade).digest('hex');
  return hash;
}

window.onload = async function() {
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
}

async function makeTradeRequest(nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp) {
  let latestBlock = await provider.getBlock("latest");
  let { timestamp } = latestBlock

  let hash = await createHash(nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp);

  let newTradeRequest = new TradeData(hash, nftsBeingReceived, nftsBeingSent, recipientWalletAddress, requesterWalletAddress, status, timestamp)

  addTradeRequestToDB(newTradeRequest)

  //add to smart contract the hash
}

function addTradeRequestToDB(tradeData) {
  db.collection("TradeRequest").add({
    Hash: tradeData.Hash,
    NFTsRecieved: tradeData.NFTsRecieved,
    NFTsSent: tradeData.NFTsSent,
    RecipientAddress: tradeData.RecipientWalletAddress,
    RequesterAddress: tradeData.RequesterWalletAddress,
    Status: tradeData.Status,
    Timestamp: tradeData.Timestamp
  })
    .then(function(docRef) {
    console.log("Trade added with ID: ", docRef.id);
  })
    .catch(function(error) {
    console.error("Error adding trade: ", error);
  });
}

export async function connectMetamask() {
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    const network = await provider.getNetwork();
    let chainName = network.name;

    var button = document.getElementById("connectWalletButton");
    
    if (chainName === "goerli") {
       button.innerHTML = "✔️ Wallet Connected"
    }
    else {
        button.innerHTML = "❌ Please Change Network to Goerli"
    }

    signerAddress = await signer.getAddress();
    
    console.log("Account address: ", signerAddress)
    console.log("chain name: " + chainName) 
    await createNFTBoxes();

    await chooseRecipientTradeBox()
}

async function displayRecipientNfts() {
    let inputField = await document.getElementById("chosenRecipientAddress")
   
    let userAddress = await inputField.value;
    console.log(`user address ${userAddress}`)

    let chooseRecipientAddress = await document.getElementById("chooseRecipientTradeBox")
    await chooseRecipientAddress.remove();

    axios.get(`https://testnets-api.opensea.io/api/v1/assets?owner=${userAddress}&limit=50`)
      .then(function (response) {

        let nfts = response.data.assets;
        
        for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i];
            let nftId = nft.token_id;
            let nftTokenContractAddress = nft.contract_address;
            let nftImageUrl = nft.image_url; // add this line to get the image url

            let newNft = new nftInfo(nft.contract_address, nft.token_id, nft.image_url);

            // create a new div for this NFT
            let nftBox = document.createElement("div");
            nftBox.className = "nftBox"
            nftBox.classList.add("nftBox");
            nftBox.addEventListener("click", function() {
                //this.classList.toggle("selected");
                addToSelected(RecipientSelected, newNft)
            });

            nftBox.style.backgroundImage = 'url(' + nftImageUrl + ')';
        
            RecipientTradeBox.appendChild(nftBox);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
}

async function addToSelected(set, nft) {
  if (nft.Selected == false) {

    set.add(nft);
    nft.Selected = true;
    
    
  } else {
    set.delete(nft)
    nft.Selected = false;
  }
}


async function chooseRecipientTradeBox() {

    let starterDiv = document.createElement("div");
    starterDiv.id = "chooseRecipientTradeBox"

    let title = document.createElement("h1")
    title.textContent = "Recipient Address"
    title.style.fontSize = "3vh"

    let input = document.createElement("input");
    input.id = "chosenRecipientAddress"
    input.type = "text"
    input.placeholder = "Recipient Address:"
    input.style.width = "40vh"
    input.style.height = "3vh"

    let button = document.createElement("button")
    button.onclick = function() {
        //Wrapped in a function to avoid being called
        //Only want the function to be called when clicked 
        displayRecipientNfts()
    } 
    button.textContent = "Trade"    

    starterDiv.appendChild(title)
    starterDiv.appendChild(input)
    starterDiv.appendChild(button)

    RecipientTradeBox.appendChild(starterDiv)
    
}

async function createNFTBoxes() {
    let userAddress = await signer.getAddress();

    let offset = 0;

    //figure out how to call this again if limit is reached (and if it gets called and reaches limit, how to call again until its at its max)
    //if after call is done if divisable by limit
    //call again
    axios.get(`https://testnets-api.opensea.io/api/v1/assets?owner=${userAddress}&limit=50`)
      .then(function (response) {

        let nfts = response.data.assets;
        
        for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i];
            let nftId = nft.token_id;
            let nftTokenContractAddress = nft.contract_address;
            let nftImageUrl = nft.image_url; // add this line to get the image url

            let newNft = new nftInfo(nft.contract_address, nft.token_id, nft.image_url);

            // create a new div for this NFT
            let nftBox = document.createElement("div");
            nftBox.className = "nftBox"
            nftBox.classList.add("nftBox");
            nftBox.addEventListener("click", function() {
                //this.classList.toggle("selected");
                addToSelected(UserSelected, newNft)
            });

            nftBox.style.backgroundImage = 'url(' + nftImageUrl + ')';
        
            nftBoxes.appendChild(nftBox);

        }
      })
      .catch(function (error) {
        console.log(error);
      });

      function saveTradeRequest(formData) {
        // Get a reference to the trade requests collection in Firestore
        let tradeRequestsRef = firebase.firestore().collection("tradeRequests");
    
        // Create a timestamp for the trade request
        let timestamp = new Date().toLocaleString();
    
        // Add the trade request to the collection
        tradeRequestsRef.add({
            walletAddress: formData.walletAddress,
            nftsBeingTraded: formData.nftsBeingTraded,
            nftsBeingReceived: formData.nftsBeingReceived,
            timestamp: timestamp,
            status: "pending"
        })
        .then(function(docRef) {
            console.log("Trade request saved with ID: ", docRef.id);
            // Clear the form fields
            formData.walletAddress = "";
            formData.nftsBeingTraded = "";
            formData.nftsBeingReceived = "";
            formData.timestamp = "";
            // Display a message to the user
            alert("Trade request submitted successfully!");
        })
        .catch(function(error) {
            console.error("Error adding trade request: ", error);
        });
    }
    
}