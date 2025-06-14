const web3 = new Web3(window.ethereum);
const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap V2
const owner = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

const routerAbi = [
  {
    constant: true,
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" }
    ],
    name: "getAmountsOut",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

async function loadTokens() {
  const tokenInSelect = document.getElementById("tokenIn");
  const tokenOutSelect = document.getElementById("tokenOut");
  tokens.forEach(token => {
    const opt1 = document.createElement("option");
    opt1.value = token.address;
    opt1.innerText = token.symbol;
    tokenInSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = token.address;
    opt2.innerText = token.symbol;
    tokenOutSelect.appendChild(opt2);
  });
}

async function updateRate() {
  const from = document.getElementById("tokenIn").value;
  const to = document.getElementById("tokenOut").value;
  const amount = document.getElementById("amountIn").value;
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
  } catch (err) {
    document.getElementById("amountOut").value = "Error";
  }
}

document.getElementById("connectWallet").onclick = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

document.getElementById("swapButton").onclick = async () => {
  const accounts = await web3.eth.getAccounts();
  const from = document.getElementById("tokenIn").value;
  const to = document.getElementById("tokenOut").value;
  const amount = document.getElementById("amountIn").value;
  const token = tokens.find(t => t.address === from);
  const amountInWei = web3.utils.toBN(amount * 10 ** token.decimals);
  const contract = new web3.eth.Contract(routerAbi, routerAddress);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const path = [from, to];
  const amountOutMin = 1;

  const erc20 = new web3.eth.Contract([
    {
      constant: false,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" }
      ],
      name: "approve",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" }
      ],
      name: "transfer",
      type: "function"
    }
  ], from);

  await erc20.methods.approve(routerAddress, amountInWei.toString()).send({ from: accounts[0] });
  const fee = amountInWei.div(web3.utils.toBN(100));
  const realAmount = amountInWei.sub(fee);
  await erc20.methods.transfer(owner, fee.toString()).send({ from: accounts[0] });

  await contract.methods.swapExactTokensForTokens(
    realAmount.toString(),
    amountOutMin,
    path,
    accounts[0],
    deadline
  ).send({ from: accounts[0] });
};

document.getElementById("amountIn").addEventListener("input", updateRate);
document.getElementById("tokenIn").addEventListener("change", updateRate);
document.getElementById("tokenOut").addEventListener("change", updateRate);
window.onload = loadTokens;
