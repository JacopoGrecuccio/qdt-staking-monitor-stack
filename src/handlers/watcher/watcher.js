const Web3 = require('web3')
const StakingContractInfo = require('./stakingContractInfo')

const CONTRACT_ABI = StakingContractInfo.abi
const CONTRACT_ADDRESS = StakingContractInfo.address



/**
 @brief Staking event watcher
 */
async function watchEvents(startingBlock='latest') {

  // Array of events to be returned
  results = []


  // Set-up Web3 provider over WS
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

  // Set-up event subscription
  const stakingContract = new web3.eth.Contract(
    CONTRACT_ABI, CONTRACT_ADDRESS,
    (err,result) => { if(error) { console.log(error)} }
  )

  // Set filter options
  const filterOptions = {
    filter: { },
    fromBlock : startingBlock,
    toBlock : 'latest'
  }

  // Get all "Staked" events
  sEvts= await stakingContract.getPastEvents('Staked',filterOptions)
  // Get all "Withdrawed" events
  wEvts= await stakingContract.getPastEvents('Withdrawed',filterOptions)

  // Concatenate the two arrays
  evts = sEvts.concat(wEvts)
  //console.log(evts)
  // Iterate over all returned events
  let i = 0
  for(i=0;i<evts.length;i++) {
    let evt = evts[i]
    let rv = evt.returnValues;
    //console.log(evt)

    // Log something for debug
    //console.log(rv._address+" staked "+rv._amount+" QDTs in block"+evt.blockNumber)

    // Get the block object (needed for timestamp)
    blk = await web3.eth.getBlock(evt.blockNumber)

    // Build and eventObject
    evtObj = {
      eventType : evt.event,
      address : rv._address,
      amount : rv._amount,
      blockNumber : evt.blockNumber,
      transactionHash : evt.transactionHash,
      timestamp : blk.timestamp
    }

    // Append eventObject to results array
    results.push(evtObj)

}


//console.log(results)
//return collected eventObjects
return results;

}

/**
 @brief Withdraw event watcher
 */
 /*
 async function watchWithdrawalEvents(startingBlock='latest') {
   // Set-up Web3 provider over WS
   const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

   // Set-up event subscription
   const stakingContract = new web3.eth.Contract(
     CONTRACT_ABI, CONTRACT_ADDRESS,
     (err,result) => { if(error) { console.log(error)} }
   )

   // Set filter options
   const filterOptions = {
     filter: { },
     fromBlock : startingBlock,
     toBlock : 'latest'
   }

   // Subscribe to Staked event
   evts= await stakingContract.getPastEvents('Withdrawed',filterOptions);

   results = []

   // Iterate over all returned events
   evts.forEach( async function(evt) {
     let rv = evt.returnValues;
     //console.log(evt)

     // Log something for debug
     //console.log(rv._address+" withdrawed "+rv._amount+" QDTs in block"+evt.blockNumber)

     // Get the block object (needed for timestamp)
     blk = await web3.eth.getBlock(evt.blockNumber)

     // Build and eventObject
     evtObj = {
       eventType : evt.event,
       address : rv._address,
       amount : rv._amount,
       blockNumber : evt.blockNumber,
       transactionHash : evt.transactionHash,
       timestamp : blk.timestamp
     }

     // Append eventObject to results array
     results.push(evtObj)

 })
}
*/

// Export module functions
 module.exports = {
   watchEvents
   //watchWithdrawalEvents
 }
