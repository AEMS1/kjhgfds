let userWalletAddress = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      userWalletAddress = accounts[0];
      document.getElementById("walletAddress").innerText = Wallet: ${userWalletAddress};
      document.getElementById("gameSection").style.display = "block";
    } catch (error) {
      alert("Wallet connection failed");
    }
  } else {
    alert("Please install MetaMask!");
  }
}