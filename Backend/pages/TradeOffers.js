export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

import {tradeContractAddress, tradeABI} from '../util/util.js'

window.onload = async function() {

  window.ethereum.on('accountsChanged', function (accounts) {
    // Check if accounts have changed
  });

  window.ethereum.send({ method: 'eth_requestAccounts' }, function (error, accounts) {
    if (error) {
      console.error(error);
    } else {
      // Check if the user has granted access to their wallet
      if (accounts.length === 0) {
        console.log('Please connect your wallet.');
      } else {
        console.log('Wallet is already connected.');
        connectMetamask()
      }
    }
  });
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
    document.getElementById("tradeNavButton").addEventListener("click", function() {window.location = "../Frontend/LandingPage.html"});

  }

async function goToTradeInfoPage(requesterAddress, 
                                 recipientAddress, 
                                 requesterNftAddresses, 
                                 requesterNftIDs, 
                                 recipientNftAddresses, 
                                 recipientNftIDs, 
                                 requesterIndex, 
                                 recipientIndex, 
                                 timestamp, 
                                 active, 
                                 result, 
                                 requesterReady, 
                                 recipientReady, 
                                 tradeIndex) {
  //console.log(`adasda ${requesterAddress}`)
  await sessionStorage.setItem("requesterAddress", requesterAddress);

  await sessionStorage.setItem("recipientAddress", recipientAddress);
  //stringify so we can pass it to another page and index the array
  await sessionStorage.setItem("requesterNftAddresses", JSON.stringify(requesterNftAddresses));

  await sessionStorage.setItem("requesterNftIDs", JSON.stringify(requesterNftIDs));
  await sessionStorage.setItem("recipientNftAddresses", JSON.stringify(recipientNftAddresses));
  await sessionStorage.setItem("recipientNftIDs", JSON.stringify(recipientNftIDs));
  await sessionStorage.setItem("requesterIndex", requesterIndex);
  await sessionStorage.setItem("recipientIndex", recipientIndex);
  await sessionStorage.setItem("timestamp", timestamp);
  await sessionStorage.setItem("active", active);
  await sessionStorage.setItem("result", result);
  await sessionStorage.setItem("requesterReady", requesterReady);
  await sessionStorage.setItem("recipientReady", recipientReady);
  await sessionStorage.setItem("tradeIndex", tradeIndex)

  window.location = "../Frontend/Offer.html"
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

    setupOffersButton();
}

async function setupOffersButton() {
    let offersInner = document.querySelector(".OffersInner");

    let offersSentButton = document.createElement("button")
    let offersRecievedButton = document.createElement("button")

    offersSentButton.style.height = "10vh"
    offersRecievedButton.style.height = "10vh"

    offersSentButton.innerHTML = "Offers Sent"
    offersRecievedButton.innerHTML = "Offers Received"

    offersSentButton.addEventListener("click", async function() {
      window.location = await "../Frontend/TradeOffersSent.html"
    })

    offersRecievedButton.addEventListener("click", async function() {
      window.location = await "../Frontend/TradeOffersReceived.html"
    })
    
    offersInner.appendChild(offersSentButton)
    offersInner.appendChild(offersRecievedButton)
}

