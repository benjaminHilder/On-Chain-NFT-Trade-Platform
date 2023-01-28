export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

const tradeContractAddress = "0x2Fd136348FeF6BFD12CF5803e914dfeF665A9fA8";

window.onload = async function() {
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
}

async function goToTradeInfoPage(requesterAddress, recipientAddress, requesterNftAddresses, requesterNftIDs, recipientNftAddresses, recipentNftIds, requesterIndex, recipientIndex, timestamp, active, result, requesterReady, recipientReady) {
  await sessionStorage.setItem("requesterAddress", requesterAddress);
  await sessionStorage.setItem("recipientAddress", recipientAddress);
  await sessionStorage.setItem("requesterNftAddresses", requesterNftAddresses);
  await sessionStorage.setItem("requesterNftIDs", requesterNftIDs);
  await sessionStorage.setItem("recipientNftAddresses", recipientNftAddresses);
  await sessionStorage.setItem("recipentNftIds", recipentNftIds);
  await sessionStorage.setItem("requesterIndex", requesterIndex);
  await sessionStorage.setItem("recipientIndex", recipientIndex);
  await sessionStorage.setItem("timestamp", timestamp);
  await sessionStorage.setItem("active", active);
  await sessionStorage.setItem("result", result);
  await sessionStorage.setItem("requesterReady", requesterReady);
  await sessionStorage.setItem("recipientReady", recipientReady);


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

    getAllOffers();
}

async function getAllOffers() {
    //get from smart contract offers
    const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
    const allOffers = await contract.getAllOffers(ethers.utils.getAddress(await signer.getAddress()))
    //info from offers
    let requesters = []
    let recipients = []
    
    let requesterNftAddresses = []
    let requesterNftIDs = []

    let recipientNftAddresses = []
    let recipientNftIDs = []

    let requesterIndex = []
    let recipientIndex = []

    let timestamp = []

    let active = []
    let result = []
    let requesterReady = []
    let recipientReady = []
    
    let arrays = [requesters, recipients, requesterNftAddresses, requesterNftIDs, recipientNftAddresses, recipientNftIDs, requesterIndex, recipientIndex, timestamp, active, result, requesterReady, recipientReady];
    //sort info into correct arrays

    let offerDiv = document.createElement("div");
    offerDiv.className = "offerInnerDiv"

    for (let i = 0; i < allOffers.length; i++) {
        for (let j = 0; j < allOffers[i].length; j++) {
            if (j == 0) {
                requesters.push(allOffers[i][j])
            } else if (j == 1) {
                recipients.push(allOffers[i][j])
            } else if (j == 2) {
                requesterNftAddresses.push(allOffers[i][j])
            } else if (j == 3) {
                requesterNftIDs.push(allOffers[i][j])
            } else if (j == 4) {
                recipientNftAddresses.push(allOffers[i][j])
            } else if (j == 5) {
                recipientNftIDs.push(allOffers[i][j])
            } else if (j == 6) {
                requesterIndex.push(allOffers[i][j])
            } else if (j == 7) {
                recipientIndex.push(allOffers[i][j])
            } else if (j == 8) {
                timestamp.push(allOffers[i][j])
            } else if (j == 9) {
                active.push(allOffers[i][j])
            } else if (j == 10) {
                result.push(allOffers[i][j])
            } else if (j == 11) {
                requesterReady.push(allOffers[i][j])
            } else if (j == 12) {
                recipientReady.push(allOffers[i][j])
            }
        }

        let newDiv = document.createElement("div")
        newDiv.className = "OfferBox"

        let header = document.createElement("p")
        header.innerHTML = `Trade with address:`
        
        let addressValue = document.createElement("p")

        if (signerAddress == requesters[i]){
            addressValue.innerHTML = `${recipients[i]}`
        } else {
            addressValue.innerHTML = `${requesters[i]}`
        }

        let button = document.createElement("button") 
        button.addEventListener("click", function () {
          goToTradeInfoPage(allOffers[i][0], allOffers[i][1], allOffers[i][2], allOffers[i][3], allOffers[i][4], allOffers[i][5], allOffers[i][6], allOffers[i][7], allOffers[i][8], allOffers[i][9], allOffers[i][10], allOffers[i][0], allOffers[i][11], allOffers[i][12])})
        button.textContent = "View Offer"

        newDiv.appendChild(header)
        newDiv.appendChild(addressValue)
        newDiv.appendChild(button)
        offerDiv.appendChild(newDiv)
    }

    arrays.forEach(array => {
        //let p = document.createElement("p");
        //p.innerHTML = array;
        //offerDiv.appendChild(p);
          
  
      });
    
    
    //arrays.forEach(array => {
    //  //let p = document.createElement("p");
    //  //p.innerHTML = array;
    //  //offerDiv.appendChild(p);
    //    let newDiv = document.createElement("div")
    //    newDiv.className = "OfferBox"
//
    //    offerDiv.appendChild(newDiv)
//
    //});
    
    
    let offersInner = document.querySelector(".OffersInner");
    offersInner.appendChild(offerDiv)
    //format info

    //setup box to be put in frontend
    //popular box with info

    //put box in screen
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