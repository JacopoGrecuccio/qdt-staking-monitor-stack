const api = require('./stakingMonitorApiHandler')

const runTests = async () => {
  let evt = {}
  let ctx = {}

  /* Test get GET /v1/getGlobalStatistics */

  evt = {
    routeKey: "GET /v1/getGlobalStatistics"
  }
  result = await api.handler(evt,ctx)
  console.log(result)


  /* Test get GET /v1/getTopStakers */

  evt = {
    routeKey: "GET /v1/getActiveStakers/{limit}",
    pathParameters: { limit: 10 }
  }
  result = await api.handler(evt,ctx)
  console.log(result)


  evt = {
    routeKey: "GET /v1/getStakerStatistics/{staker}",
    pathParameters: {staker: "0xd8c93302899A2f598B6F862b6564986732E05559" }
  }
  result = await api.handler(evt,ctx)
  console.log(result)

}



runTests()
