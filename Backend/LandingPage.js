export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

const tradeContractAddress = 0;
const tradeABI = [];

let nftBoxes = document.querySelector(".UserNFTs");

let RecipientTradeBox = document.getElementById("RecipientTradeBox")

let UserSelected = new Set()
let RecipientSelected = new Set()

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

  for (let i = 0; i < UserSelected.length; i++) {
    requesterNftAddresses.push(UserSelected[i].contractAddress)
    requesterNftIDs.push(UserSelected[i].ID)
  }

  for (let i = 0; i < RecipientSelected.length; i++) {
    recipientNftAddresses.push(RecipientSelected[i].contractAddress)
    recipientNftIDs.push(RecipientSelected[i].ID)
  }

  const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
  const transaction = await contract.connect(signer).createTradeRequest(recipientAddress, requesterNftAddresses, requesterNftIDs, recipientNftAddresses, recipientNftIDs)
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
    recipientAddress = inputField;

    let userAddress = await inputField.value;
    console.log(`user address ${userAddress}`)

    let backButton = await document.createElement("button");
    backButton.textContent = "back";
    backButton.className = "recipientNftsBackButton"
    backButton
    let RecipientBoxTitle = await document.querySelector(".RecipientBoxTitle");

    backButton.style.position = "fixed";
    backButton.style.left = "79.5vh";
    backButton.style.top = "8.2vh"

    await backButton.addEventListener("click", function() {
      
      setupFirstRecipientTradeBox(backButton);
    });
    
    RecipientBoxTitle.insertBefore(backButton, RecipientBoxTitle.firstChild)

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

async function setupFirstRecipientTradeBox(backBtn) {
  console.log(`child count ${RecipientTradeBox.children.length}`)
  //while there is still a child
  while (RecipientTradeBox.firstChild) {
    RecipientTradeBox.removeChild(RecipientTradeBox.firstChild)
  }

  chooseRecipientTradeBox()
  
  backBtn.parentNode.removeChild(backBtn);
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