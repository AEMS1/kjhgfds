const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
const tokenDecimals = 18;
const ownerWallet = "0x16b564df5470089947e3Ca71cC3F6aF93583f3a8";
const entryAmount = 25000;
let paymentDone = false;

const payButton = document.getElementById("payButton");
const statusText = document.getElementById("paymentStatus");

payButton.onclick = async () => {
  if (!window.ethereum || !userWalletAddress) return alert("Connect wallet first");

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const amount = ethers.utils.parseUnits(entryAmount.toString(), tokenDecimals);
    const fee = amount.div(100); // 1%
    const ownerAmount = fee;
    const gameAmount = amount.sub(fee);

    // Send 1% fee to owner
    let tx1 = await contract.transfer(ownerWallet, ownerAmount);
    await tx1.wait();

    // Send remaining 99% to game contract (simulate - send to own wallet for now)
    let tx2 = await contract.transfer(userWalletAddress, gameAmount);
    await tx2.wait();

    paymentDone = true;
    statusText.innerText = "Payment successful! Game started.";
    startGame();
  } catch (e) {
    console.error(e);
    alert("Payment failed!");
  }
};

// Chess game logic
let game = new Chess();
let board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
});

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if (move === null) return 'snapback';
  updateStatus();
}

function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  let status = "";

  if (game.in_checkmate()) {
    status = "Checkmate! Game over.";
    if (game.turn() === 'w') status += " Black wins!";
    else status += " White wins!";
  } else if (game.in_draw()) {
    status = "Game drawn.";
  } else {
    status = (game.turn() === 'w' ? "White's turn" : "Black's turn");
    if (game.in_check()) {
      status += " - Check!";
    }
  }

  document.getElementById("status").innerText = status;
}

document.getElementById("resetBtn").onclick = () => {
  game.reset();
  board.start();
  updateStatus();
};

function startGame() {
  game.reset();
  board.start();
  updateStatus();
}