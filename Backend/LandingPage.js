export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress

let nftBoxes = document.querySelector(".UserNFTs");

let RecipientTradeBox = document.getElementById("RecipientTradeBox")
window.onload = async function() {
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
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

            // create a new div for this NFT
            let nftBox = document.createElement("div");
            nftBox.className = "nftBox"
            nftBox.classList.add("nftBox");
            nftBox.addEventListener("click", function() {
                this.classList.toggle("selected");
            });

            nftBox.style.backgroundImage = 'url(' + nftImageUrl + ')';
        
            RecipientTradeBox.appendChild(nftBox);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
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

            // create a new div for this NFT
            let nftBox = document.createElement("div");
            nftBox.className = "nftBox"
            nftBox.classList.add("nftBox");
            nftBox.addEventListener("click", function() {
                this.classList.toggle("selected");
            });

            nftBox.style.backgroundImage = 'url(' + nftImageUrl + ')';
        
            nftBoxes.appendChild(nftBox);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
}
