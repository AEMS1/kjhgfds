let web3;
let account;
let contract;
const contractAddress = "0xYourSmartContractAddress"; // Replace with real one
const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A"; // LGD Token
const entryFee = web3?.utils.toWei("25000", "ether");

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install MetaMask to use this site.");
  }
});

document.getElementById("connectWalletBtn")?.addEventListener("click", async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  document.getElementById("walletAddress").textContent = Wallet: ${account};
  contract = new web3.eth.Contract(contractABI, contractAddress);
});

document.getElementById("payAndJoinBtn")?.addEventListener("click", async () => {
  if (!account) return alert("Connect wallet first.");
  const token = new web3.eth.Contract([
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" }
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      type: "function"
    }
  ], tokenAddress);

  const amount = web3.utils.toWei("25000", "ether");

  try {
    await token.methods.approve(contractAddress, amount).send({ from: account });
    await contract.methods.enterGame().send({ from: account });
    alert("Payment successful! Waiting for opponent...");
  } catch (e) {
    alert("Transaction failed: " + e.message);
  }
});
