const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
    "event Approval(address indexed owner, address indexed spender, uint amount)"
  ];
  
  const PANCAKE_ABI = [
    "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory)",
    "function WETH() external pure returns (address)"
  ];
  
  const AUCTION_ABI = [
    "function payEntryFee() external",
    "function entryFee() public view returns (uint256)",
    "function hasPaid(address) public view returns (bool)",
    "function participate(uint8 daysGroup) external payable",
    "function getParticipants(uint8 daysGroup) public view returns (address[] memory)",
    "function getBid(address user, uint8 daysGroup) public view returns (uint256)",
    "function auctionEndTime(uint8 daysGroup) public view returns (uint256)",
    "function setEntryFee(uint256 newFee) external",
    "function setReward(uint8 daysGroup, uint256 amount) external",
    "function setMinimumBNB(uint8 daysGroup, uint256 amount) external",
    "function resetAuction(uint8 daysGroup) external",
    "function rewardAmount(uint8 daysGroup) public view returns (uint256)",
    "function minimumBNB(uint8 daysGroup) public view returns (uint256)",
    "function getTop3(uint8 daysGroup) public view returns (address[3] memory)"
  ];
  