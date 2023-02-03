export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

const tradeContractAddress = "0x8364846b14339e15F61E58F551Cd7896feA20A47";
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

    let recipientNftIDs = await JSON.parse(sessionStorage.getItem("recipentNftIds"))
    let requesterIndex = await sessionStorage.getItem("requesterIndex")
    let recipientIndex = await sessionStorage.getItem("recipientIndex")
    let timestamp = await sessionStorage.getItem("timestamp")
    let active = await sessionStorage.getItem("active")
    let result = await sessionStorage.getItem("result")
    let requesterReady = await sessionStorage.getItem("requesterReady")
    let recipientReady = await sessionStorage.getItem("recipientReady")

    if (requesterReady == "true") {
      requesterReady = true;
    } else if (requesterReady == "false") {
      requesterReady = false;
    }

    if (recipientReady == "true") {
      recipientReady = true;
    } else if (recipientReady == "false") {
      recipientReady = false;
    }

    let requesterDiv = await document.createElement("div")
    requesterDiv.className = await "offerInfoRequesterDiv"

    let recipientDiv = await document.createElement("div")
    recipientDiv.className = await "offerInfoRecipientDiv"

    let mainTradeAreaDiv = await document.createElement("div")
    mainTradeAreaDiv.className = await "mainTradeAreaDiv"

    let YouTitle = await document.createElement("h1")
    let OtherTraderTitle = await document.createElement("h1")
    let OffersTitle = await document.createElement("h1")
  
    if (signerAddress == requesterAddress) {
      if (requesterReady == true) {
          YouTitle.innerHTML = await "You ✅"
          YouTitle.style.left = await "25vh"

      } else if (requesterReady == false) {
          YouTitle.innerHTML = "You ❌"
          YouTitle.style.left = "35vh"

      }

      if (recipientReady == true) {
          OtherTraderTitle.innerHTML = "Other Trader ✅"
          OtherTraderTitle.style.left = "98vh"

      } else if (recipientReady == false) {
          OtherTraderTitle.innerHTML = "Other Trader ❌"
          OtherTraderTitle.style.left = "103vh"

      }

    } else if (signerAddress == recipientAddress){
      if (recipientReady == true) {
          YouTitle.innerHTML = "You ✅"
          YouTitle.style.left = "25vh"

      } else if (recipientReady == false) {
          YouTitle.innerHTML = "You ❌"
          YouTitle.style.left = "35vh"

      }

      if (requesterReady == true) {
          OtherTraderTitle.innerHTML = "Other Trader ✅"
          OtherTraderTitle.style.left = "98vh"

      } else if (requesterReady == false) {
          YouTitle.innerHTML = "You ❌"
          YouTitle.style.left = "35vh"

      }
    }

    mainClass.appendChild(YouTitle)
    mainClass.appendChild(OtherTraderTitle)
    let buttonDiv = document.createElement("div")

    buttonDiv.style.paddingTop = "2vh"

    if (requesterReady == true && recipientReady == true) {
      let buttonApproveContract = document.createElement("button")
      buttonApproveContract.addEventListener("click", function () {

      })
      buttonApproveContract.innerHTML = "Approve Contract"

      let buttContract = document.createElement("button")
      buttonApproveContract.addEventListener("click", function () {

      })
      buttonApproveContract.innerHTML = "Approve Contract"
    } else {
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
    }

    for(let i = 0; i < requesterNftAddresses.length; i++) {
        await displayNFT(requesterNftAddresses[i], requesterNftIDs[i], requesterDiv)
    }

    for(let i = 0; i < recipientNftAddresses.length; i++) {
        await displayNFT(recipientNftAddresses[i], recipientNftIDs[i], recipientDiv)
    }

    mainTradeAreaDiv.appendChild(requesterDiv)
    mainTradeAreaDiv.appendChild(recipientDiv)

    mainClass.appendChild(mainTradeAreaDiv)
    mainClass.appendChild(buttonDiv)
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
  console.log("sadasd    " + signerAddress)

  console.log("Account address: ", signerAddress)
  console.log("chain name: " + chainName) 
}

const tradeABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tradeOfferIndex",
          "type": "uint256"
        }
      ],
      "name": "acceptTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recipientAddress",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "_requesterNftAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_requesterNftIDs",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "_recipientNftAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_recipientNftIDs",
          "type": "uint256[]"
        }
      ],
      "name": "createTradeRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tradeOfferIndex",
          "type": "uint256"
        }
      ],
      "name": "declineTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "excuteTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "giveContractAccessToNFTs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getAllOffers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "requesterAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipientAddress",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "requesterNftAddresses",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "requesterNftIDs",
              "type": "uint256[]"
            },
            {
              "internalType": "address[]",
              "name": "recipientNftAddresses",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "recipientNftIDs",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256",
              "name": "requesterIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "recipientIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "result",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "requesterReady",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "recipientReady",
              "type": "bool"
            }
          ],
          "internalType": "struct NFTTrade.TradeInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tradeOffers",
      "outputs": [
        {
          "internalType": "address",
          "name": "requesterAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipientAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "requesterIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "recipientIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "result",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "requesterReady",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "recipientReady",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]