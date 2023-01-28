export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

const tradeContractAddress = "0x2Fd136348FeF6BFD12CF5803e914dfeF665A9fA8";
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

let nftBoxes = document.querySelector(".UserNFTs");

let RecipientTradeBox = document.getElementById("RecipientTradeBox")

let UserSelected = new Set()
let RecipientSelected = new Set()

//let userSelectedAddresses = []
//let userSelectedIDs = []
//
//let recipientSelectedAddresses = []
//let recipientSelectedIDs = []

class nftInfo {
  constructor(contractAddress, ID, ImgURL) {
  this.contractAddress = contractAddress
  this.ID = ID
  this.ImgURL = ImgURL
  this.Selected = false;
  }
}

window.onload = async function() {
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
}

async function createTradeRequest() {
  let requesterNftAddresses = []
  let requesterNftIDs = []

  let recipientNftAddresses = []
  let recipientNftIDs = []

  let UserSelectedArray = [...UserSelected];
  let RecipientSelectedArray = [...RecipientSelected]

  //for (let value of UserSelected) {
  //  console.log(`val ${JSON.stringify(value).contractAddress}`);
  //}
//
  ////console.log("asda " + UserSelected[0])
  for (let i = 0; i < UserSelectedArray.length; i++) {
    //console.log(`contract addresses ${UserSelectedArray[i].contractAddress.address}`)
    //console.log(`id ${UserSelectedArray[i].ID}`)
    requesterNftAddresses.push(UserSelectedArray[i].contractAddress.address)
    requesterNftIDs.push(UserSelectedArray[i].ID)
  }
//
  for (let i = 0; i < RecipientSelectedArray.length; i++) {
    //console.log(`contract addresses ${RecipientSelectedArray[i].contractAddress.address}`)
    //console.log(`id ${RecipientSelectedArray[i].ID}`)

    recipientNftAddresses.push(RecipientSelectedArray[i].contractAddress.address)
    recipientNftIDs.push(RecipientSelectedArray[i].ID)
  }

  console.log(requesterNftAddresses)

  //let solRequesterNftAddresses = ethers.utils.arrayify(requesterNftAddresses);
  //let solRequesterNftIDs = ethers.utils.arrayify(requesterNftIDs);
  //let solRecipientNftAddresses = ethers.utils.arrayify(recipientNftAddresses);
  //let solRecipientNftIDs = ethers.utils.arrayify(recipientNftIDs);
//
  console.log(recipientAddress)
//
  console.log(`req add ${requesterNftAddresses}`)
  console.log(`req id ${requesterNftIDs}`)
  console.log(`rec add ${recipientNftAddresses}`)
  console.log(`rec id ${recipientNftIDs}`)
//
  //let address = await ethers.utils.getAddress(recipientAddress)


//
  const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
  const transaction = await contract.connect(signer).createTradeRequest(ethers.utils.getAddress(recipientAddress), recipientNftAddresses, recipientNftIDs, requesterNftAddresses, requesterNftIDs)
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
  let inputValue = await inputField.value;
  recipientAddress = await inputValue.toString();

  axios.get(`https://testnets-api.opensea.io/api/v1/assets?owner=${recipientAddress}&limit=50`)
  .then(function (response) {
    
    //console.log(`respose ${JSON.stringify(response)}`)
   // console.log(`addresses: ${JSON.stringify(response)}`)
    let nfts = response.data.assets;
    
    for (let i = 0; i < nfts.length; i++) {
        let nft = nfts[i];
        let nftId = nft.token_id;
        let nftTokenContractAddress = nft.asset_contract;
        let nftImageUrl = nft.image_url; // add this line to get the image url

        let newNft = new nftInfo(nftTokenContractAddress, nftId, nftImageUrl);
        //console.log(`new nft: ${JSON.stringify(newNft)}`)
        // create a new div for this NFT
        let nftBox = document.createElement("div");
        nftBox.className = "nftBox"
        nftBox.classList.add("nftBox");
        nftBox.addEventListener("click", function() {
            //this.classList.toggle("selected");
            
            addToSelected(RecipientSelected, newNft, nftBox)
        });

        nftBox.style.backgroundImage = 'url(' + nftImageUrl + ')';
    
        RecipientTradeBox.appendChild(nftBox);
    }
  })
  .catch(function (error) {
    console.log(error);
  });



    let userAddress = await inputField.value;
    //console.log(`user address ${userAddress}`)

    let backButton = await document.createElement("button");
    backButton.textContent = "back";
    backButton.className = "recipientNftsBackButton"
    let RecipientBoxTitle = await document.querySelector(".RecipientBoxTitle");

    backButton.style.position = "fixed";
    backButton.style.left = "140vh";

    await backButton.addEventListener("click", function() {
      setupFirstRecipientTradeBox(backButton, createTradeOfferButton);
    });

    let createTradeOfferButton = await document.createElement("button")
    createTradeOfferButton.textContent = "Create Trade Offer"
    createTradeOfferButton.className = "tradeOfferButton"

    createTradeOfferButton.style.position = "fixed";
    createTradeOfferButton.style.left = "45.5%";

    await createTradeOfferButton.addEventListener("click", function() {
      createTradeRequest();
    })
    
    RecipientBoxTitle.insertBefore(backButton, RecipientBoxTitle.firstChild)
    RecipientBoxTitle.insertBefore(createTradeOfferButton, RecipientBoxTitle.firstChild)

    let chooseRecipientAddress = await document.getElementById("chooseRecipientTradeBox")
    await chooseRecipientAddress.remove();

 
}

async function setupFirstRecipientTradeBox(backBtn, tradeOfferBtn) {
  //while there is still a child
  while (RecipientTradeBox.firstChild) {
    RecipientTradeBox.removeChild(RecipientTradeBox.firstChild)
  }

  chooseRecipientTradeBox()
  
  backBtn.parentNode.removeChild(backBtn);
  tradeOfferBtn.parentNode.removeChild(tradeOfferBtn);

  UserSelected.clear();
  RecipientSelected.clear();
}

async function addToSelected(set, nft, nftBox) {
  if (nft.Selected == false) {

    set.add(nft)
    nft.Selected = true;

    nftBox.style.filter = "brightness(70%)"
  
  } else {

    set.delete(nft)
    nft.Selected = false;

    nftBox.style.filter = "brightness(100%)"
  }

  console.log([...set])
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
            let nftTokenContractAddress = nft.asset_contract;
            let nftImageUrl = nft.image_url; // add this line to get the image url

            let newNft = new nftInfo(nftTokenContractAddress, nftId, nftImageUrl);
            //console.log(`new nft: ${JSON.stringify(newNft)}`)
            // create a new div for this NFT
            let nftBox = document.createElement("div");
            nftBox.className = "nftBox"
            nftBox.classList.add("nftBox");
            nftBox.addEventListener("click", function() {
                //this.classList.toggle("selected");
                
                addToSelected(UserSelected, newNft, nftBox)
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