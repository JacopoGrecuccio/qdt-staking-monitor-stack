const AWS = require('aws-sdk')
const dotEnv = require('dotenv-safe')
const watcher = require('./watcher')

dotEnv.config('./')

AWS.config.update({region: "us-east-2"})
const dynamo = new AWS.DynamoDB.DocumentClient()

/*
const truncateTable = async () => {
  let ExclusiveStartKey, result

  do {
    result = await dynamo.scan({
      TableName: "qdt-staking-positions-table",
      ExclusiveStartKey,
    }).promise()

    ExclusiveStartKey = result.LastEvaluatedKey

    console.log(`Found ${result.Items.length} Items, removing...`)

    if (result.Items.length > 0) {
      await Promise.all(
        result.Items.map(async item =>
          dynamo.delete({
            TableName: "qdt-staking-positions-table",
            Key: {
              stakerAddress: item.stakerAddress,
              openingTransaction: item.openingTransaction,
            },
          }).promise()
        )
      )
    }
  } while (result.Items.length || result.LastEvaluatedKey)
}
*/

async function putOrUpdateStakerPosition(e) {
  if(e.eventType==="Staked")
  {
    try
    {
      // Here we put a new "open" position
      await dynamo
      .put({
        TableName: "qdt-staking-positions-table",
        Item : {
          stakerAddress: e.address,
          openingTransaction: e.transactionHash,
          openingBlockNumber: e.blockNumber,
          stakedAmount: e.amount,
          openingTimestamp: e.timestamp
        }
      }).promise()
      console.log("Position opened for address: "+e.address)
    } catch (error) {
      console.log(error)
    }
  } else if(e.eventType==="Withdrawed")
  {
    try
    {
      // Here we update an existing "open" position. Open positions have no
      // closingTransaction attribute, thus we set it plus some additional
      // data

      // First of all retreive the current open position for the staker
      p = await dynamo
      .query({
        TableName: "qdt-staking-positions-table",
        KeyConditionExpression: "stakerAddress=:addr",
        FilterExpression: "attribute_not_exists(closingTransaction)",
        ExpressionAttributeValues: {
          ":addr" : e.address
        }
      }).promise()


      // Now close the position (ie update the record by adding closingTransaction
      // and other useful stuff)
      await dynamo
      .update({
        TableName: "qdt-staking-positions-table",
        Key: {
            stakerAddress: e.address,
            openingTransaction: p.Items[0].openingTransaction
         },
        UpdateExpression: "set closingTransaction = :closingTx,  withdrawedAmount = :wAmount, closingTimestamp = :closingTime, closingBlockNumber = :closingBlock",
        ConditionalExpression: "attribute_not_exists(closingTransaction)",
        ExpressionAttributeValues: {
          ":closingTx" : e.transactionHash,
          ":wAmount" : e.amount,
          ":closingTime" : e.timestamp,
          ":closingBlock" : e.blockNumber
        }
      }).promise()

      console.log("Position closed for address: "+e.address)

    } catch (error) {
      console.log(error)
    }
  }
}


async function getLastSeenBlockNumber()
{
  maxBlock=0


  positions=await dynamo
  .scan(
    {
      TableName: "qdt-staking-positions-table",
      ProjectionExpression: "closingBlockNumber, openingBlockNumber"
    }
  ).promise()


  if (positions.Items.length>0)
  {
    maxBlock = Math.max.apply(
      Math, positions.Items.map(  function(o) {
            if(("closingBlockNumber" in o)) {
              return Math.max(o.openingBlockNumber,o.closingBlockNumber)
            } else {
              return o.openingBlockNumber
            }
        })
    )
  }


  return maxBlock
}

/*
async function getClosedPositions() {
  closed= await dynamo
    .scan({
      TableName: "qdt-staking-positions-table",
      FilterExpression: "attribute_exists(closingTransaction)",
      ProjectionExpression: "stakerAddress, stakedAmount, withdrawedAmount, openingTimestamp, closingTimestamp"
    }).promise()
  return closed;
}
*/


exports.startWatcher = async (event,context) => {

  // Turn this on only when debugging
  //await truncateTable()

  // Get the highestBlock from "globals" table
  lastSeenBlock=await getLastSeenBlockNumber()

  console.log("Start watching from block: "+lastSeenBlock)

  // Get last events
  evts= await watcher.watchEvents(startingBlock=(lastSeenBlock+1))

  //Add new events to database, and eventually update stakers' positions
  let i=0
  let last
  for(i=0;i<evts.length;i++) {
    await putOrUpdateStakerPosition(evts[i])
  }

}
