let provider;
let signer;
let contract;
let userAddress;

const CONTRACT_ADDRESS = "0xa8F88821F9A5Ea4Fef29c41Ca191290415e9FaF8";

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = Wallet: ${userAddress};
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  } else {
    alert("MetaMask not found!");
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);

document.getElementById("joinButton").addEventListener("click", async () => {
  const gameId = parseInt(document.getElementById("joinGameId").value);
  if (isNaN(gameId)) return alert("Enter valid game ID");

  try {
    const tx = await contract.joinGame(gameId);
    await tx.wait();
    alert("Joined game successfully!");
  } catch (err) {
    console.error(err);
    alert("Join failed.");
  }
});

document.getElementById("proposeButton").addEventListener("click", async () => {
  const gameId = parseInt(document.getElementById("winnerGameId").value);
  const winner = document.getElementById("winnerAddress").value;

  if (!ethers.utils.isAddress(winner)) return alert("Invalid address");

  try {
    const tx = await contract.proposeWinner(gameId, winner);
    await tx.wait();
    alert("Winner proposed successfully!");
  } catch (err) {
    console.error(err);
    alert("Propose failed.");
  }
});

document.getElementById("infoButton").addEventListener("click", async () => {
  const gameId = parseInt(document.getElementById("infoGameId").value);
  try {
    const info = await contract.getGame(gameId);
    document.getElementById("gameInfo").innerText = `
Game ID: ${gameId}
Player 1: ${info[0]}
Player 2: ${info[1]}
Winner Proposal: ${info[2]}
Status: ${["Empty", "Waiting", "Ongoing", "Finished", "Disputed"][info[3]]}
    `;
  } catch (err) {
    console.error(err);
    alert("Failed to get game info.");
  }
});
