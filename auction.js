let provider, signer, auctionContract;
const AUCTION_ADDRESS = "0xab8cbbba46ebc7ae38b6be977b774f3dc42c4262";
const AMS_ADDRESS = "0x887ada8fe79740b913De549f81014f37e2f8D07a";

window.onload = async () => {
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  auctionContract = new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, signer);

  document.getElementById("connectWallet").onclick = connectWallet;
  document.getElementById("payEntry").onclick = payEntry;
  startCountdowns();
};

async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
  alert("Wallet connected!");
}

async function payEntry() {
  const token = new ethers.Contract(AMS_ADDRESS, ERC20_ABI, signer);
  const fee = await auctionContract.entryFee();
  await token.approve(AUCTION_ADDRESS, fee);
  await auctionContract.payEntryFee();
  document.getElementById("auctionSections").style.display = "block";
}

async function bid(days) {
  const input = document.getElementById(`bid${days}`);
  const value = ethers.parseEther(input.value);
  await auctionContract.participate(days, { value });
  alert("Bid submitted!");
}

function startCountdowns() {
  setInterval(async () => {
    const end30 = await auctionContract.auctionEndTime(30);
    const end60 = await auctionContract.auctionEndTime(60);
    document.getElementById("countdown30").innerText = formatTime(end30);
    document.getElementById("countdown60").innerText = formatTime(end60);
  }, 1000);
}

function formatTime(ts) {
  const now = Math.floor(Date.now() / 1000);
  let diff = ts - now;
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}
