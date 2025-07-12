const provider = new ethers.BrowserProvider(window.ethereum);
let signer;
let userAddress;

const FEE_WALLET = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap v2

document.getElementById("connectWallet").onclick = async () => {
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();
  alert("Wallet Connected: " + userAddress);
  loadTokens();
};

async function loadTokens() {
  const fromSelect = document.getElementById("fromToken");
  const toSelect = document.getElementById("toToken");
  TOKENS.forEach(t => {
    fromSelect.innerHTML += `<option value="${t.address}">${t.symbol}</option>`;
    toSelect.innerHTML += `<option value="${t.address}">${t.symbol}</option>`;
  });
}

document.getElementById("swapButton").onclick = async () => {
  const fromToken = document.getElementById("fromToken").value;
  const toToken = document.getElementById("toToken").value;
  const amount = parseFloat(document.getElementById("fromAmount").value);

  if (!amount || amount <= 0) return alert("Enter valid amount");

  const token = new ethers.Contract(fromToken, ERC20_ABI, signer);
  const decimals = await token.decimals();
  const value = ethers.parseUnits(amount.toString(), decimals);

  const fee = value / 100n; // 1%
  const amountAfterFee = value - fee;

  await token.approve(PANCAKE_ROUTER, value);
  await token.transfer(FEE_WALLET, fee);

  const router = new ethers.Contract(PANCAKE_ROUTER, PANCAKE_ABI, signer);
  const path = [fromToken, toToken];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountAfterFee,
    0,
    path,
    userAddress,
    deadline
  );

  alert("Swap completed!");
};
