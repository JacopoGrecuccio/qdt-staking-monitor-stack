<template>
<div class="container">
  <div class="row" >
    <div class="col-12 col-lg-12 mb-2" style="background-color:#6719e0;">
        <h4
          class="title"
          style="text-align:center; color:#ffffff !important; font-weight:800 !important;"
          >
          Staker statistics
        </h4>
        <p
          class="description"
          style="text-align:center; vertical-align:middle; color:#ffffff !important;"
          >
          {{ $route.params.stakerAddress }} -
            <span class="badge badge-success" v-if="staker.active">Active</span>
            <span class="badge badge-danger" v-else="staker.active">Inactive</span>
        </p>
    </div>
  </div>

  <div class="row">
    <!-- Avg. staked amount card START -->
    <div class="col-3">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-12">
              <h5 class="card-category">Current Staked Amount</h5>
              <h2 class="card-title">{{renderQDTAmount(staker.activePosition.staked)}} QDTs</h2>
            </div>
          </div>
        </template>
      </card>
    </div>
    <!-- Staked tokens card END -->


    <!-- Unclaimed rewards card START -->
    <div class="col-3">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-12">
              <h5 class="card-category">Current Unclaimed rewards</h5>
              <h2 class="card-title">{{renderQDTAmount(staker.activePosition.estimatedRewards)}} QDTs</h2>
            </div>
          </div>
        </template>
      </card>
    </div>
    <!-- Unclaimed rewards card END -->
    <!-- Issued rewards card START -->
    <div class="col-3">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-12">
              <h5 class="card-category">Current Interest Days</h5>
              <h2 class="card-title">{{staker.activePosition.interestDays.toFixed(2)}} days</h2>
            </div>
          </div>
        </template>
      </card>
    </div>
    <!-- Issued rewards card END -->


    <!-- Active stakeholders card START -->
    <div class="col-3">
      <card type="chart">
        <template slot="header">
          <div class="row">
              <div class="col-sm-12">
                <h5 class="card-category">Total Redeemed Rewards</h5>
                <h2 class="card-title">0 QDT </h2>
              </div>
            </div>
        </template>
      </card>
    </div>
    <!-- Active stakeholders card END -->
  </div>

  <div class="row">
    <div class="col-lg-8">
      <card type="chart">
        <template slot="header">
          <h2 class="card-title">Montly Activity</h2>
        </template>
        <div class="chart-area">
          <StakerActivityByMonth :activities="staker.activities">
          </StakerActivityByMonth>
        </div>
      </card>
    </div>
    <div class="col-lg-4">
      <card type="chart">
        <template slot="header">
          <h2 class="card-title">Pool Shares</h2>
        </template>
        <div class="chart-area">
          <StakerPoolShareChart
            :actualStaked="Number.parseFloat(staker.activePosition.staked)/10**18"
            :actualRewards="Number.parseFloat(staker.activePosition.estimatedRewards)/10**18"
            :poolSize="poolSize">
          </StakerPoolShareChart>
        </div>
      </card>
    </div>
  </div>

  <activity-history-table :activities="staker.activities">
  </activity-history-table>

</div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import * as chartConfigs from '@/components/Charts/config';
  import ActivityHistoryTable from './StakerStatistics/ActivityHistoryTable'
  import StakerActivityByMonth from './Profile/StakerActivityByMonth'
  import StakerPoolShareChart from './Profile/StakerPoolShareChart'
  import config from '@/config';
  import axios from 'axios';
  import fancyFormatter from '@/plugins/fancyFormatter'


  export default {
    components: {
      LineChart,
      ActivityHistoryTable,
      StakerActivityByMonth,
      StakerPoolShareChart
    },
    methods: {
      renderQDTAmount(amount) {
        return fancyFormatter.QDTAmount(amount)
      },
      getStakerStatistics() {
        const path = config.QDTMonitorApiBasePath + "v1/getStakerStatistics?staker="+this.$route.params.stakerAddress
        axios.get(path)
          .catch((err) => {console.log(err)})
          .then((res) => {
            // Do the staker have an active position?
            if(res.data.activePosition.staked)
            {
              this.staker.activePosition = res.data.activePosition
              this.staker.active=true
            }
            this.staker.activities = res.data.activities
          })
      },
      getGlobalStatistics() {
        const path = config.QDTMonitorApiBasePath+"v1/getGlobalStatistics"
        axios.get(path)
          .catch((err) => { console.log(err) } )
          .then( (res) => {
            this.poolSize=Number.parseFloat(res.data.totStaked)/10**18+Number.parseFloat(res.data.totUnclaimed)/10**18
          })
      },
    },
    data() {
      return {
        staker : {
          active: false,
          activePosition: {
            staked : 0,
            estimatedRewards: 0,
            interestDays: 0,
            openedAt : 0,
            openingTransaction : 0
          },
          activities : [],
        },
        poolSize: 0,
      }
    },
    created() {
      this.getStakerStatistics()
      this.getGlobalStatistics()
    }
  }
</script>
<style>
</style>
