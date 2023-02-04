export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

import {tradeContractAddress, tradeABI, nftABIApprove} from '../util/util.js'

let mainClass = document.querySelector(".Offers");
let innerClass = document.querySelector(".OffersInner")

const Vote = {
    Accept: 0,
    Decline: 1
}

window.onload = async function() {
  window.ethereum.on('accountsChanged', function (accounts) { 
    // Check if accounts have changed
  });

  window.ethereum.send({ method: 'eth_requestAccounts' }, async function (error, accounts) {
    if (error) {
      console.error(error);
    } else {
      // Check if the user has granted access to their wallet
      if (accounts.length === 0) {
        console.log('Please connect your wallet.');
      } else {
        console.log('Wallet is already connected.');
        await connectMetamask()
        await loadOfferInfo();
      }
    }
  });
    await document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
    await setupBackButton();
}

async function loadOfferInfo() {
    // Get the offer number from session storage
    let requesterAddress = await sessionStorage.getItem("requesterAddress");

    let recipientAddress = await sessionStorage.getItem("recipientAddress")
    let requesterNftAddressesResult = await await JSON.parse(sessionStorage.getItem("requesterNftAddresses"))
    let requesterNftAddresses = await []
    for (let i = 0; i < await requesterNftAddressesResult.length; i++) {
      await requesterNftAddresses.push(JSON.stringify(requesterNftAddressesResult[i]))
    }

    let requesterNftIDs = await JSON.parse(sessionStorage.getItem("requesterNftIDs"))
    let recipientNftAddressesResult = await JSON.parse(sessionStorage.getItem("recipientNftAddresses"))
    let recipientNftAddresses = await []
    for (let i = 0; i < await recipientNftAddressesResult.length; i++) {
      await recipientNftAddresses.push(JSON.stringify(recipientNftAddressesResult[i]))
    }

    let recipientNftIDs = await JSON.parse(sessionStorage.getItem("recipientNftIDs"))
    let requesterIndex = await sessionStorage.getItem("requesterIndex")
    let recipientIndex = await sessionStorage.getItem("recipientIndex")
    let timestamp = await sessionStorage.getItem("timestamp")
    let active = await sessionStorage.getItem("active")
    let result = await sessionStorage.getItem("result")
    let tradeIndex = await sessionStorage.getItem("tradeIndex")

    if (result == "true") {
      result = true;
    } else if (result == "false") {
      result = false;
    }
    
    if (active == "true") {
      active = true;
    } else if (active == "false") {
      active = false;
    }

    let requesterDiv = await document.createElement("div")
    let recipientDiv = await document.createElement("div")
    let mainTradeAreaDiv = await document.createElement("div")

    requesterDiv.className = await "offerInfoRequesterDiv"
    recipientDiv.className = await "offerInfoRecipientDiv"
    mainTradeAreaDiv.className = await "mainTradeAreaDiv"

    let YouTitle = await document.createElement("h1")
    let OtherTraderTitle = await document.createElement("h1")

    //if recipient hasn't voted and user is recipient
    if (result == false && signerAddress == recipientAddress && active == true) {

      YouTitle.innerHTML = "You"
      YouTitle.style.left = "35vh"

      OtherTraderTitle.innerHTML = "Other Trader"
      OtherTraderTitle.style.left = "103vh"  

      let OfferTitle = await document.createElement("h1")
      OfferTitle.innerHTML = "Offer"

      mainClass.appendChild(YouTitle)
      mainClass.appendChild(OfferTitle)
      mainClass.appendChild(OtherTraderTitle)
      let buttonDiv = document.createElement("div")

      buttonDiv.style.paddingTop = "2vh"


    for(let i = 0; i < requesterNftAddresses.length; i++) {
        await displayNFT(requesterNftAddresses[i], requesterNftIDs[i], requesterDiv)
    }

    for(let i = 0; i < recipientNftAddresses.length; i++) {
        await displayNFT(recipientNftAddresses[i], recipientNftIDs[i], recipientDiv)
    }

    mainTradeAreaDiv.appendChild(requesterDiv)
    mainTradeAreaDiv.appendChild(recipientDiv)
//
    innerClass.appendChild(mainTradeAreaDiv)
    mainClass.appendChild(buttonDiv)

    let buttonApproveContract = document.createElement("button")
    buttonApproveContract.addEventListener("click", function () {
    })
      buttonApproveContract.innerHTML = "Approve Contract"
      let buttContract = document.createElement("button")
      buttonApproveContract.addEventListener("click", function () {
    })
      buttonApproveContract.innerHTML = "Approve Contract"
    
    let buttonAccept = document.createElement("button")
      buttonAccept.addEventListener("click", function() {
      voteOnTrade(Vote.Accept)
    })
      buttonAccept.innerHTML = "Accept"
      let buttonDecline = document.createElement("button")
      buttonDecline.addEventListener("click", function() {
      voteOnTrade(Vote.Decline)
    })
      buttonDecline.innerHTML = "Decline"
      buttonDiv.appendChild(buttonAccept);
      buttonDiv.appendChild(buttonDecline);

    } else if (result == false && signerAddress == requesterAddress && active == true) {
      let waitingP = document.createElement("p")
      waitingP.innerHTML = "Waiting for other trader to decide..."
      waitingP.style.fontSize = "3vh"
      mainClass.appendChild(waitingP)
    
    } else if (result == true && active == true) {
      let approveTitle = document.createElement("h1");
      approveTitle.innerHTML = "Approved Contract"

      mainClass.appendChild(YouTitle)
      mainClass.appendChild(approveTitle)
      mainClass.appendChild(OtherTraderTitle)

      let buttonApprove = document.createElement("button")
      let buttonExecuteTrade = document.createElement("button")

      buttonApprove.innerHTML = "Approve Contract"
      buttonExecuteTrade.innerHTML = "Execute Trade"

      buttonApprove.addEventListener("click", async function() {
        if (signerAddress == recipientAddress) {
          await approveNfts(recipientNftAddresses, recipientNftIDs);

        } else if (signerAddress == requesterAddress) {
          await approveNfts(requesterNftAddresses, requesterNftIDs);
        }
      })

      buttonExecuteTrade.addEventListener("click", async function() {
        const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
        //let owner = await contract.connect(signer).ownerOf(IDs[i])
        await contract.connect(signer).excuteTrade(await parseInt(tradeIndex));
      })

      let buttonDiv = document.createElement("div")
      buttonDiv.style.paddingTop = "2vh"

      buttonExecuteTrade.style.marginLeft = "1vh"

      buttonDiv.appendChild(buttonApprove);
      buttonDiv.appendChild(buttonExecuteTrade)
      mainClass.appendChild(buttonDiv)  
    }
}

async function approveNfts(addresses, IDs) {
  for (let i = 0; i < addresses.length; i++) {
    //remove quotation marks from address
    let cleanedAddress = await addresses[i].replace(/^"(.*)"$/, '$1');
    const contract = await new ethers.Contract(cleanedAddress, nftABIApprove, provider);
    //let owner = await contract.connect(signer).ownerOf(IDs[i])
    const transaction = await contract.connect(signer).approve(tradeContractAddress, IDs[i]);
  }
}

async function voteOnTrade(result) {
  if (result == Vote.Accept) {
    const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
    const transaction = await contract.connect(signer).acceptTrade(parseInt(sessionStorage.getItem("requesterIndex")))

  } else if (result == Vote.Decline) {
    const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
    const transaction = await contract.connect(signer).declineTrade(parseInt(sessionStorage.getItem("requesterIndex")))
  }
}

async function displayNFT(contractAddressUnflitered, tokenId, div) {
  let contractAddress = await encodeURIComponent(contractAddressUnflitered)
  let url = `https://testnets-api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`
  url = url.replace(/%../g, "");

  await fetch(url)
  .then(response => response.json())
  .then(data => {

  const imageUrl = data.image_url
    
  let nftBox = document.createElement("div");
  nftBox.className = "nftBox"
  nftBox.classList.add("nftBox");

  nftBox.style.backgroundImage = 'url(' + imageUrl + ')';
  div.appendChild(nftBox);
  // You can use the imageUrl to display the image in an HTML <img> element or do something else
  })

  .catch(error => console.error(error))
}

async function setupBackButton() {
  let backButton = document.createElement("button")
  backButton.innerHTML = "Back"
  backButton.style.position = "absolute"
  backButton.style.left = "5vh"
  backButton.style.top = "4.25vh"

  backButton.addEventListener("click", function() {
    window.location = "../Frontend/TradeOffers.html"
  })

  mainClass.appendChild(backButton)
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
}