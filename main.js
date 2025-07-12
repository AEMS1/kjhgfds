const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let routerContract;

const fromTokenSelect = document.getElementById("fromToken");
const toTokenSelect = document.getElementById("toToken");
const fromAmountInput = document.getElementById("fromAmount");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const swapBtn = document.getElementById("swapBtn");
const priceUsdEl = document.getElementById("priceUsd");
const expectedReceiveEl = document.getElementById("expectedReceive");
const feePercentEl = document.getElementById("feePercent");
const statusMsg = document.getElementById("statusMsg");

let connectedAddress = null;

// پر کردن select ها با لیست توکن‌ها
function populateTokenSelects() {
  for (const token of tokens) {
    const optionFrom = document.createElement("option");
    optionFrom.value = token.symbol;
    optionFrom.textContent = token.symbol;
    fromTokenSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = token.symbol;
    optionTo.textContent = token.symbol;
    toTokenSelect.appendChild(optionTo
                              
