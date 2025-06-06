
let web3;
let account;
let contract;
const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const tokenDecimals = 18;
const tokenAmount = web3?.utils.toBN("25000").mul(web3?.utils.toBN("10").pow(web3?.utils.toBN(tokenDecimals)));

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    document.getElementById("connectWalletBtn").onclick = connectWallet;
    document.getElementById("startGameBtn").onclick = startGame;
    contract = new web3.eth.Contract(abi, contractAddress);
  } else {
    alert("MetaMask not found");
  }
});

async function connectWallet() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  document.getElementById("walletAddress").innerText = account;
}

async function startGame() {
  try {
    await contract.methods.enterGame().send({ from: account });
    alert("Game Started!");
  } catch (err) {
    console.error(err);
    alert("Failed to start game.");
  }
}
