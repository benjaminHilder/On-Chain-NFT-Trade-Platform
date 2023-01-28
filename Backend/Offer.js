export let provider = new ethers.providers.Web3Provider(window.ethereum)
export let signer
export let signerAddress
export let recipientAddress

const tradeContractAddress = "0x2Fd136348FeF6BFD12CF5803e914dfeF665A9fA8";
let mainClass = document.querySelector(".Offers");
let innerClass = document.querySelector(".OffersInner")

window.onload = async function() {
    document.getElementById("connectWalletButton").addEventListener("click", connectMetamask);
    
    setupBackButton();
    loadOfferInfo();

}

async function loadOfferInfo() {
    // Get the offer number from session storage
    let requesterAddress = sessionStorage.getItem("requesterAddress");
    let recipientAddress = sessionStorage.getItem("recipientAddress")
    let requesterNftAddresses = sessionStorage.getItem("requesterNftAddresses")
    let requesterNftIDs = sessionStorage.getItem("requesterNftIDs")
    let recipientNftAddresses = sessionStorage.getItem("recipientNftAddresses")
    let recipentNftIds = sessionStorage.getItem("recipentNftIds")
    let requesterIndex = sessionStorage.getItem("requesterIndex")
    let recipientIndex = sessionStorage.getItem("recipientIndex")
    let timestamp = sessionStorage.getItem("timestamp")
    let active = sessionStorage.getItem("active")
    let result = sessionStorage.getItem("result")
    let requesterReady = sessionStorage.getItem("requesterReady")
    let recipientReady = sessionStorage.getItem("recipientReady")

    Object.entries({requesterAddress, recipientAddress, requesterNftAddresses, requesterNftIDs, recipientNftAddresses, recipentNftIds, requesterIndex, recipientIndex, timestamp, active, result, requesterReady, recipientReady}).forEach(([key, value]) => {
        let p = document.createElement("p");
        let name = document.createElement("p");
        name.innerHTML = key;
        p.innerHTML = value;
        mainClass.appendChild(name);
        mainClass.appendChild(p);
    });

    //Object.keys(values).forEach((key) => {
    //    let p = document.createElement("p");
    //    p.innerHTML = `${key}: ${values[key]}`;
    //    mainClass.appendChild(p);
    //});
//
    //console.log(requesterAddress)
    //// Create a <p> element
    //let offerParagraph = document.createElement("p");
    //// Set the text of the <p> element to the offer number
    //offerParagraph.innerHTML = requesterAddress;
//
    //// Append the <p> element to the main class <div>
    //innerClass.appendChild(offerParagraph);
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