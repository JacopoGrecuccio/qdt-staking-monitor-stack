const AWS = require('aws-sdk')
AWS.config.update({region: "us-east-2"})
const dynamo = new AWS.DynamoDB.DocumentClient();

function computeInterestDays(t)
{
  return ((Date.now()/1000)-t)/(60*60*24)
}

function estimatedRewards(staked,positionOpeningTimestamp)
{
  // Estimate position rewards
  let interestDays = 0
  let positionRewards=0

  interestDays=computeInterestDays(positionOpeningTimestamp)
  positionRewards=((0.14)*staked)*(interestDays/365)

  return positionRewards
}

async function getAllStakingPositions() {
    p = await dynamo
      .scan({
        TableName: "qdt-staking-positions-table"
      }).promise()
    return p.Items
}
async function getGlobalStatistics() {
  /* Here we return an object containing:
    - The total number of active stakers: totStakers
    - The total amount of QDT actually staked : totStaked
    - The total amount of unclaimed rewards : totUnclaimed
    - The total amount of issued rewards : totIssued
  */
  let globalStatistics = {
    totStakers : 0,
    totStaked : 0,
    totUnclaimed: 0,
    totIssued: 0
  }

  let op = {}
  let cp = {}
  // Get all open positions from Dynamo
  op = await dynamo
  .scan({
    TableName: "qdt-staking-positions-table",
    FilterExpression: "attribute_not_exists(closingTransaction)"
  }).promise()

  // Get all closed positions from Dynamo
  cp = await dynamo
  .scan({
    TableName: "qdt-staking-positions-table",
    FilterExpression: "attribute_exists(closingTransaction)"
  }).promise()

  // Compute statistics over op.Items
  op.Items.map((p) =>{


    globalStatistics.totUnclaimed+=estimatedRewards(
      Number.parseFloat(p.stakedAmount),
      Number.parseFloat(p.openingTimestamp)
    )
    // Increment stakers counter
    globalStatistics.totStakers++
    // Update staked accumulator
    globalStatistics.totStaked+=Number.parseFloat(p.stakedAmount)
  })


  // Compute statistics over cp.Items
  cp.Items.map((p) => {
    //Update issued rewards accumulator
    globalStatistics.totIssued+=(p.withdrawedAmount-p.stakedAmount)
  })

  console.log(globalStatistics)

  return globalStatistics
}


async function getActiveStakers(limitParameter=null) {

  /*
    Here we return a list of object containing information about the
    "top" active stakers. "Top stakers" is in other words the list
    of active stakers sorted, in descending order, by the sum of staked
    tokens plus the accured rewards
  */
  // Get open positions
  let op = {}
  if (limitParameter!=null)
  {
    op = await dynamo
    .scan({
      TableName: "qdt-staking-positions-table",
      FilterExpression: "attribute_not_exists(closingTransaction)",
      Limit: limitParameter
    }).promise()
  } else
  {
    op = await dynamo
    .scan({
      TableName: "qdt-staking-positions-table",
      FilterExpression: "attribute_not_exists(closingTransaction)"
    }).promise()
  }
  // Order op.Items in descending order by (staked+estimatedRewards),
  // then
  topStakers=op.Items.sort( (pa,pb) => {
    a_size= Number.parseFloat(pa.stakedAmount)+estimatedRewards(
      Number.parseFloat(pa.stakedAmount),Number.parseFloat(pa.openingTimestamp)
    )
    b_size=Number.parseFloat(pb.stakedAmount)+estimatedRewards(
      Number.parseFloat(pb.stakedAmount),Number.parseFloat(pb.openingTimestamp)
    )

    if (a_size>b_size) {
      return -1
    } else if (a_size <b_size) {
      return 1
    } else {
      return 0
    }

  }).map( (p) => {
    ps = {
      stakerAddress: p.stakerAddress,
      stakedAmount: p.stakedAmount,
      interestDays: computeInterestDays(Number.parseFloat(p.openingTimestamp)),
      estReward: estimatedRewards(Number.parseFloat(p.stakedAmount),Number.parseFloat(p.openingTimestamp))
    }
    return ps
  })
  return topStakers
}


async function getStakerStatistics(staker) {
  /*
    Here we return the global statistics of a staker as an object with
    this structure:
      {
        activePosition : {
          staked : AMOUNT_OF_QDT_ACTUALLY IN STAKING
          estimatedRewards: AMOUNT_OF_REWARDS_ESTIMATED,
          interestDays: INTEREST_DAYS_FOR_THE_CURRENT_POSITION,
          openedAt : TIMESTAMP_OF_POSITION_OPENING,
          openingTransaction : TX_HASH_OF_POSITION_OPENING
        },
        activities : [
          {
            action : "Staked" | "Withdrawed",
            amount : AMOUNT_OF_QDT_STAKED_IN_THAT_POSITION,
            timestamp: TIMESTAMP_OF_THE_ACTION,
            blockNumber: BLOCK_WHERE_ACTION_HAPPENED,
            transactionHash : HASH_OF_THE_TRANSACITON_WHO_TRIGGERED_ACTION
          }
        ]
      }
  */

  let stakerStatistics = {
    activePosition : {},
    activities : []
  }
  let op = {}
  let cp = {}
  // Get the open position for the staker (if any)
  op = await dynamo
  .query({
      TableName: "qdt-staking-positions-table",
      KeyConditionExpression: "stakerAddress=:addr",
      ExpressionAttributeValues: {
        ":addr" : staker
      },
      FilterExpression: "attribute_not_exists(closingTransaction)"
  }).promise()

  // Get all closed positions
  cp = await dynamo
  .query({
      TableName: "qdt-staking-positions-table",
      KeyConditionExpression: "stakerAddress=:addr",
      ExpressionAttributeValues: {
        ":addr" : staker
      },
      FilterExpression: "attribute_exists(closingTimestamp)"
  }).promise()

  // Check if exists an active position, eventually put information
  // in statistics object

  if (op.Items.length==1) {
    let p=op.Items[0]
    stakerStatistics.activePosition = {
      staked: p.stakedAmount,
      estimatedRewards: estimatedRewards(
          Number.parseFloat(p.stakedAmount),
          Number.parseFloat(p.openingTimestamp)
        ),
      interestDays: computeInterestDays(Number.parseFloat(p.openingTimestamp)),
      openedAt : p.openingTimestamp,
      openingTransaction: p.openingTransaction
    }
    stakerStatistics.activities.push({
      action: "Stake",
      amount : p.stakedAmount,
      timestamp : p.openingTimestamp,
      transactionHash : p.openingTransaction,
      blockNumber: p.openingBlockNumber
    })
  }

  // Put closed position in array if any
  cp.Items.forEach((p, i) => {
    stakerStatistics.activities.push({
      action: "Stake",
      amount: p.stakedAmount,
      timestamp: p.openingTimestamp,
      transactionHash: p.openingTransaction,
      blockNumber: p.openingBlockNumber
    })
    stakerStatistics.activities.push({
      action: "Withdraw",
      amount: p.withdrawedAmount,
      timestamp: p.closingTimestamp,
      transactionHash: p.closingTransaction,
      blockNumber: p.closingBlockNumber
    })
  });

  stakerStatistics.activities.sort((a_a,a_b) => {
    if(a_a.timestamp>a_b.timestamp)
    {
      return 1
    } else if(a_a.timestamp<a_b.timestamp) {
      return -1
    } else {
      return 0
    }
  })

  return stakerStatistics

}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    //console.log(event)
    switch (event.routeKey) {

      case "GET /v1/getGlobalStatistics":

        // Return object
        body=await getGlobalStatistics()

        break;


      case "GET /v1/getActiveStakers":

        if(event.queryStringParameters && event.queryStringParameters.limit && event.queryStringParameters.limit!=="") {
          body=await getActiveStakers(limit=event.queryStringParameters.limit)
        } else {
          body=await getActiveStakers()
        }

        break;

      case "GET /v1/getStakerStatistics":

        if(event.queryStringParameters && event.queryStringParameters.staker && event.queryStringParameters.staker!=="")
        {
          body = await getStakerStatistics(event.queryStringParameters.staker)
        } else {
          throw new Error("Missing staker queryParameter!")
        }

        break;

      case "GET /v1/getAllStakingPositions":
        body=await getAllStakingPositions()
        break;

      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);

    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
