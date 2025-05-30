let web3;
let contract;
let userAddress;

// آدرس قرارداد شما در شبکه BSC
const contractAddress = "0x..."; // ← آدرس قرارداد خود را اینجا قرار بده

// مقدار ورودی بازی (۲۵۰,۰۰۰ توکن LGD)
const ENTRY_FEE = web3.utils.toWei("250000", "ether"); // اگر توکن 18 رقم دارد

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
    await loadActiveGames();
  } else {
    alert("Please install MetaMask!");
  }
});

async function connectWallet() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  userAddress = accounts[0];
  document.getElementById("userAddress").innerText = userAddress;
}

// شروع بازی جدید
async function startGame() {
  if (!userAddress) await connectWallet();

  try {
    await contract.methods.startNewGame().send({
      from: userAddress
    });

    alert("Game started!");
    loadActiveGames();
  } catch (err) {
    console.error(err);
    alert("Error starting game.");
  }
}

// پیوستن به بازی
async function joinGame() {
  if (!userAddress) await connectWallet();

  const gameId = document.getElementById("joinGameId").value;
  if (!gameId) return alert("Please enter a Game ID");

  try {
    await contract.methods.joinGame(gameId).send({
      from: userAddress
    });

    alert("Joined the game!");
    loadActiveGames();
  } catch (err) {
    console.error(err);
    alert("Error joining game.");
  }
}

// نمایش لیست بازی‌ها
async function loadActiveGames() {
  if (!contract) return;

  try {
    const totalGames = await contract.methods.totalGames().call();
    const listEl = document.getElementById("activeGames");
    listEl.innerHTML = "";

    for (let i = 1; i <= totalGames; i++) {
      const game = await contract.methods.games(i).call();
      if (!game.finished) {
        const li = document.createElement("li");
        li.innerText = Game #${i} - Player1: ${game.player1.slice(0, 8)}..., Player2: ${game.player2 === "0x0000000000000000000000000000000000000000" ? "Waiting..." : game.player2.slice(0, 8)};
        listEl.appendChild(li);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
