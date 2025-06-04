let web3;
let contract;
const contractAddress = "0x0000000000000000000000000000000000000000"; // Add later

window.connectWallet = async function () {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];
      document.getElementById("walletAddress").innerText = "Wallet: " + walletAddress;
      contract = new web3.eth.Contract(contractABI, contractAddress);
    } catch (err) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("MetaMask not found.");
  }
};

window.startGame = async function () {
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
  const amount = web3.utils.toWei("25000", "ether");
  const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
  await tokenContract.methods.transfer(contractAddress, amount).send({ from });
  alert("You have entered the game!");
};