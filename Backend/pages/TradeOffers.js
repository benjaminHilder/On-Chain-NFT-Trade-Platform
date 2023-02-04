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

    getAllOffers();
}

async function getAllOffers() {
    //get from smart contract offers
    const contract = await new ethers.Contract(tradeContractAddress, tradeABI, provider);
    const allOffers = await contract.getAllOffers(ethers.utils.getAddress(await signer.getAddress()))

    let offerDiv = document.createElement("div");
    offerDiv.className = "offerInnerDiv"  

    

    for (let i = 0; i < allOffers.length; i++) {
      //info from offers
      //sort info into correct arrays
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

      for (let j = 0; j < allOffers[i].length; j++) {
        
        switch(j) {
          case 0:
            requesters.push(allOffers[i][j])
            break
          
          case 1:
            recipients.push(allOffers[i][j])
            break
          
          case 2:
            recipientNftAddresses = allOffers[i][j]
            break

          case 3:
            let normalIntArray1 = []
          
            for(let l = 0; l < allOffers[i][j].length; l++) {
              let bigInt = BigInt(allOffers[i][j][l])
              normalIntArray1.push(parseInt(bigInt.toString()))
            }
            
            recipientNftIDs = normalIntArray1
            break

          case 4:
            
            requesterNftAddresses = allOffers[i][j]
            console.log(recipientNftAddresses)
            break

          case 5:
            let normalIntArray2 = []
          
            for(let l = 0; l < allOffers[i][j].length; l++) {
              let bigInt = BigInt(allOffers[i][j][l])
              normalIntArray2.push(parseInt(bigInt.toString()))

            }
            
            requesterNftIDs = normalIntArray2
            break

          case 6:
            requesterIndex.push(allOffers[i][j])
            break

          case 7:
            recipientIndex.push(allOffers[i][j])
            break

          case 8:
            timestamp.push(allOffers[i][j])
            break

          case 9:
            active.push(allOffers[i][j])
            break

          case 10:
            result.push(allOffers[i][j])
            break

          case 11:
            requesterReady.push(allOffers[i][j])
            break
            
          case 12:
            recipientReady.push(allOffers[i][j])
            break
        }
      }
      let button = document.createElement("button") 
      button.textContent = "View Offer"

      button.addEventListener("click", function () {
        goToTradeInfoPage(requesters, 
                          recipients, 
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
                          i)
      })

      let newDiv = document.createElement("div")
      let header = document.createElement("p")
      let addressValue = document.createElement("p")

      newDiv.className = "OfferBox"
      header.innerHTML = `Trade with address:`
      
      if (signerAddress == requesters){
          addressValue.innerHTML = `${recipients}`
      } else {
          addressValue.innerHTML = `${requesters}`
      }

      newDiv.appendChild(header)
      newDiv.appendChild(addressValue)
      newDiv.appendChild(button)
      offerDiv.appendChild(newDiv)

      let offersInner = document.querySelector(".OffersInner");
      offersInner.appendChild(offerDiv)
    }

}

