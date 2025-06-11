const web3 = new Web3(window.ethereum);
const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap V2
const owner = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

const routerAbi = [
  {
    "constant": true,
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "path", "type": "address[]" }
    ],
    "name": "getAmountsOut",
    "outputs": [
      { "name": "amounts", "type": "uint256[]" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "amountIn", "type": "uint256" },
      { "name": "amountOutMin", "type": "uint256" },
      { "name": "path", "type": "address[]" },
      { "name": "to", "type": "address" },
      { "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [{ "name": "amounts", "type": "uint256[]" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function loadTokens() {
  const tokenInSelect = document.getElementById("tokenIn");
  const tokenOutSelect = document.getElementById("tokenOut");
  tokens.forEach(token => {
    let optIn = document.createElement("option");
    optIn.value = token.address;
    optIn.innerText = token.symbol;
    tokenInSelect.appendChild(optIn);

    let optOut = document.createElement("option");
    optOut.value = token.address;
    optOut.innerText = token.symbol;
    tokenOutSelect.appendChild(optOut);
  });
}

async function updateRate() {
  const from = document.getElementById("tokenIn").value;
  const to = document.getElementById("tokenOut").value;
  const amount = document.getElementById("amountIn").value;
  const status = document.getElementById("status");

  if (!amount || isNaN(amount)) return;

  const token = tokens.find(t => t.address === from);
  const amountInWei = web3.utils.toBN(amount * 10 ** token.decimals);

  const contract = new web3.eth.Contract(routerAbi, routerAddress);
  const path = [from, to];

  try {
    const amounts = await contract.methods.getAmountsOut(amountInWei.toString(), path).call();
    const outToken = tokens.find(t => t.address === to);
    const amountOut = amounts[1] / (10 ** outToken.decimals);
    document.getElementById("amountOut").value = parseFloat(amountOut).toFixed(6);
    status.innerText = "";
  } catch (err) {
    console.error("Rate error", err);
    document.getElementById("amountOut").value = "Error";
    status.innerText = "Rate fetch failed.";
  }
}

document.getElementById("connectWallet").onclick = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("status").innerText = "Wallet connected ✅";
  } catch (err) {
    document.getElementById("status").innerText = "Connection failed ❌";
  }
};

document.getElementById("swapButton").onclick = async () => {
  const status = document.getElementById("status");
  status.innerText = "Processing swap...";
  try {
    const accounts = await web3.eth.getAccounts();
    const from = document.getElementById("tokenIn").value;
    const to = document.getElementById("tokenOut").value;
    const amount = document.getElementById("amountIn").value;

    if (!amount || isNaN(amount)) {
      status.innerText = "Invalid input.";
      return;
    }

    const token = tokens.find(t => t.address === from);
    const amountInWei = web3.utils.toBN(amount * 10 ** token.decimals);
    const fee = amountInWei.div(web3.utils.toBN(100));
    const realAmount = amountInWei.sub(fee);

    const path = [from, to];
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    const amountOutMin = 1;

    const erc20 = new web3.eth.Contract([
      {
        "constant": false,
        "inputs": [
          { "name": "_spender", "type": "address" },
          { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          { "name": "_to", "type": "address" },
          { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "type": "function"
      }
    ], from);

    // Approve router to spend
    await erc20.methods.approve(routerAddress, amountInWei.toString()).send({ from: accounts[0] });

    // Send 1% fee to owner
    await erc20.methods.transfer(owner, fee.toString()).send({ from: accounts[0] });

    // Execute swap
    const router = new web3.eth.Contract(routerAbi, routerAddress);
    await router.methods.swapExactTokensForTokens(
      realAmount.toString(),
      amountOutMin,
      path,
      accounts[0],
      deadline
    ).send({ from: accounts[0] });

    status.innerText = "Swap successful ✅";
  } catch (err) {
    console.error("Swap error:", err);
    status.innerText = "Swap failed ❌";
  }
};

document.getElementById("amountIn").addEventListener("input", updateRate);
document.getElementById("tokenIn").addEventListener("change", updateRate);
document.getElementById("tokenOut").addEventListener("change", updateRate);

window.onload = loadTokens;
