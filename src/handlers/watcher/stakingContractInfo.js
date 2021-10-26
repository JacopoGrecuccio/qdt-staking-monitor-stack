
const address = "0xEC979680B5E8D8c1E541fAbDb32e2A07c1C83a06"
const abi = [
    {
      "inputs":[
        {"internalType":"address","name":"_tokenAddress","type":"address"}
      ],
      "stateMutability":"nonpayable","type":"constructor"
    },
    {
      "anonymous":false,"inputs":[
        {"indexed":false,"internalType":"address","name":"_recipient","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}
      ],
      "name":"CleanedUp","type":"event"
    },
    {
      "anonymous":false,
      "inputs":[
        {"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},
        {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}
      ],
      "name":"OwnershipTransferred",
      "type":"event"
    },
    {
      "anonymous":false,
      "inputs":[
        {"indexed":false,"internalType":"address","name":"_address","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}
      ],
      "name":"Staked",
      "type":"event"
    },
    {
      "anonymous":false,
      "inputs":[
        {"indexed":false,"internalType":"bool","name":"_closed","type":"bool"}
      ],
      "name":"StakingisClosed",
      "type":"event"
    },
    {
      "anonymous":false,
      "inputs":[
        {"indexed":false,"internalType":"address","name":"_address","type":"address"},
        {"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}
      ],
      "name":"Withdrawed","type":"event"
    },
    {
      "inputs":[],
      "name":"MIN_ALLOWED_AMOUNT",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[
        {"internalType":"address","name":"","type":"address"}
      ],
      "name":"StakeHolders",
      "outputs":[
        {"internalType":"uint256","name":"joinDate","type":"uint256"},
        {"internalType":"uint256","name":"stake","type":"uint256"}
      ],
      "stateMutability":"view","type":"function"
    },
    {
      "inputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "name":"StakeHoldersList",
      "outputs":[
        {"internalType":"address","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"closeStaking",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"closed",
      "outputs":[
        {"internalType":"bool","name":"","type":"bool"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"getInterest",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"openStaking",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"owner",
      "outputs":[
        {"internalType":"address","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"renounceOwnership",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"rewardInterest",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"rewardPeriod",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"rewardedTokens",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[
        {"internalType":"uint256","name":"_amount","type":"uint256"}
      ],
      "name":"stake",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"stakedTokens",
      "outputs":[
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs":[
        {"internalType":"address","name":"newOwner","type":"address"}
      ],
      "name":"transferOwnership",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[],
      "name":"withdraw",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    }
  ]

  module.exports = {
    abi,
    address
  }
