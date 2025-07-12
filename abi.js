// PancakeSwap Router V2 ABI (برای سواپ)
// فقط تابع swapExactTokensForTokens و getAmountsOut رو نیاز داریم
const pancakeRouterAbi = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)"
];

// آدرس Router پنکیک سواپ روی BSC mainnet
const pancakeRouterAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

// آدرس کیف پول کارمزد شما
const feeWallet = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

// ABI استاندارد ERC20 حداقلی
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];
