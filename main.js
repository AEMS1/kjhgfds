let provider, signer, userAddress;
const ownerAddress = "0xec54951C7d4619256Ea01C811fFdFa01A9925683"; // کارمزد

async function connectWallet() {
  if (!window.ethereum) return alert("Install MetaMask");
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();
  document.getElementById("connectWallet").innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
}

async function populateTokens() {
  const fromSelect = document.getElementById("fromToken");
  const toSelect = document.getElementById("toToken");

  tokenList.forEach(token => {
    const opt1 = new Option(token.symbol, token.address);
    const opt2 = new Option(token.symbol, token.address);
    fromSelect.appendChild(opt1);
    toSelect.appendChild(opt2);
  });

  fromSelect.value = tokenList[0].address;
  toSelect.value = tokenList[1].address;
}

async function getTokenObject(address) {
  if (address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") return null;
  return new ethers.Contract(address, erc20Abi, signer);
}

async function updateEstimation() {
  const amount = parseFloat(document.getElementById("fromAmount").value);
  const from = document.getElementById("fromToken").value;
  const to = document.getElementById("toToken").value;
  if (!amount || from === to) return;

  const router = new ethers.Contract(pancakeRouterAddress, pancakeRouterAbi, provider);
  const path = [from === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? ethers.ZeroAddress : from, to];
  const amountIn = ethers.parseUnits(amount.toString(), 18);
  const amounts = await router.getAmountsOut(amountIn, path);
  const estimatedOut = amounts[1];
  const fee = estimatedOut / 100n;
  const finalAmount = estimatedOut - fee;

  document.getElementById("toAmount").value = ethers.formatUnits(finalAmount, 18);
  document.getElementById("priceBox").innerText = `Price: ${ethers.formatUnits(amounts[1], 18)} ${getSymbol(to)}`;
  document.getElementById("feeBox").innerText = `Fee (1%): ${ethers.formatUnits(fee, 18)} ${getSymbol(to)}`;
}

function getSymbol(addr) {
  const t = tokenList.find(t => t.address.toLowerCase() === addr.toLowerCase());
  return t?.symbol || "-";
}

async function swapTokens() {
  const from = document.getElementById("fromToken").value;
  const to = document.getElementById("toToken").value;
  const amount = parseFloat(document.getElementById("fromAmount").value);
  if (!amount || from === to) return alert("Invalid selection");

  const router = new ethers.Contract(pancakeRouterAddress, pancakeRouterAbi, signer);
  const path = [from === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? ethers.ZeroAddress : from, to];
  const amountIn = ethers.parseUnits(amount.toString(), 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const token = await getTokenObject(from);
  if (token) {
    const allowance = await token.allowance(userAddress, pancakeRouterAddress);
    if (allowance < amountIn) await token.approve(pancakeRouterAddress, ethers.MaxUint256);
  }

  let tx;
  if (!token) {
    tx = await router.swapExactETHForTokens(0, path, userAddress, deadline, { value: amountIn });
  } else {
    tx = await router.swapExactTokensForTokens(amountIn, 0, path, userAddress, deadline);
  }

  await tx.wait();

  // Transfer 1% fee to owner
  const outToken = await getTokenObject(to);
  const outBalance = await outToken.balanceOf(userAddress);
  const fee = outBalance / 100n;
  const transferTx = await outToken.transfer(ownerAddress, fee);
  await transferTx.wait();

  alert("Swap completed with 1% fee sent to owner.");
}

document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("fromAmount").oninput = updateEstimation;
document.getElementById("fromToken").onchange = updateEstimation;
document.getElementById("toToken").onchange = updateEstimation;
document.getElementById("swapButton").onclick = swapTokens;

populateTokens();
