const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" },
      { "internalType": "address", "name": "_feeWallet", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "gameId", "type": "uint256" },
      { "internalType": "address", "name": "_winner", "type": "address" }
    ],
    "name": "proposeWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "gameId", "type": "uint256" }],
    "name": "getGame",
    "outputs": [
      { "internalType": "address", "name": "player1", "type": "address" },
      { "internalType": "address", "name": "player2", "type": "address" },
      { "internalType": "address", "name": "winnerProposal", "type": "address" },
      { "internalType": "enum LGDChessArena.GameStatus", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
