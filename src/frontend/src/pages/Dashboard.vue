<template>
  <div class="container">
  <div class="row">
    <div class="col-12">
      <card>
        <template slot="header">
          <div class="row">
            <div class="col-sm-6">
              <h2 class="card-title">Stakers Explorer</h2>
            </div>
          </div>
        </template>
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7 col-md-12 ml-lg-auto mr-lg-0">
              <input
                ref="stakerAddressInput"
                class="form-control w-100"
                type="search"
                placeholder="Insert staker address"
                aria-label="Search"
            >
            </div>
            <div class="col-lg-4 col-md-12 text-center col-md-auto mr-lg-auto ml-lg-0">
              <button v-on:click="viewStakerStatistics" class="btn btn-success my-2 my-sm-0">View statistics</button>
            </div>
          </div>
        </div>
      </card>
    </div>
  </div>
<!-- BEGIN TOP ROW --------------------------------------------------------- -->
  <div class="row">


  <!-- Issued rewards card START -->
  <div class="col-lg-3 col-md-6 col-sm-12">
    <card type="chart">
      <template slot="header">
        <div class="row">
          <div class="col-sm-12">
            <h5 class="card-category">In staking</h5>
            <h2 class="card-title">{{ globalStatistics.totStaked }} QDTs</h2>
          </div>
        </div>
      </template>
    </card>
  </div>
  <!-- Issued rewards card END -->

    <!-- Avg. staked amount card START -->
  <div class="col-lg-3 col-md-6 col-sm-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-12">
              <h5 class="card-category">Stakers</h5>
              <h2 class="card-title">{{globalStatistics.totStakers}}</h2>
            </div>
          </div>
        </template>
      </card>
    </div>
    <!-- Staked tokens card END -->


    <!-- Unclaimed rewards card START -->
  <div class="col-lg-3 col-md-6 col-sm-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-12">
              <h5 class="card-category">Unclaimed rewards</h5>
              <h2 class="card-title">{{ globalStatistics.totUnclaimed }} QDTs</h2>
            </div>
          </div>
        </template>
      </card>
    </div>
    <!-- Unclaimed rewards card END -->


    <!-- Active stakeholders card START -->
  <div class="col-lg-3 col-md-6 col-sm-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
              <div class="col-sm-12">
                <h5 class="card-category">Issued rewards</h5>
                <h2 class="card-title">{{globalStatistics.totIssued}} QDTs</h2>
              </div>
            </div>
        </template>
      </card>
    </div>
    <!-- Active stakeholders card END -->
  </div>

<!-- END TOP ROW ----------------------------------------------------------- -->
    <div class="row">
    <div class="col-lg-8 col-md-12 col-sm-12">
      <card type="chart">
        <template slot="header">
          <div class="row">
            <div class="col-sm-6">
              <h2 class="card-title">Staked Tokens</h2>
            </div>
          </div>
        </template>
        <div class="chart-area">
          <staked-volume-by-month :positions="allPositions">
          </staked-volume-by-month>
        </div>
      </card>
    </div>
      <div class="col-lg-4 col-md-12">
        <card type="chart">
          <template slot="header">
          <div class="row">
            <div class="col-12 mt-1">
              <h2 class="card-title">Rewards Calculator</h2>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <form>
                <div class="form-group">
                  <h5 class="card-category">Staked Amount</h5>
                  <input class="w-100" type="range" />
                </div>
                <div class="form-group">
                  <h5 class="card-category">Staking Period</h5>
                  <input class="w-100" type="range" />
                </div>
              </form>
              <hr/>
            </div>
            <div class="col-12">
              <h5 class="card-category"> Staked amount : <b>10k QDT</b></h5>
              <h5 class="card-category"> Staking period : <b>100 days</b></h5>
              <h5 class="card-category"> Est. rewards : <b>1400 QDT</b></h5>
            </div>
            <div class="col-12 text-center mb-2">
              <a class="btn btn-primary" style="padding:11px 20px; margin-right:8px" href="https://staking.quadrans.io">
                Go to staking!
              </a>
              <a class="btn btn-outline-primary" style="padding:11px 20px;" href="https://staking.quadrans.io">
                Discover more
              </a>

            </div>
          </div>
          </template>
        </card>
      </div>

    </div>
    <div class="row">
      <div class="col-lg-6">
        <card type="chart">
          <template slot="header">
            <h2 class="card-title">Active Stakers</h2>
          </template>
          <div class="chart-area">
            <stakers-by-month :positions="allPositions" ref="activeStakersChart">
            </stakers-by-month>
          </div>
        </card>
      </div>
      <div class="col-lg-6">
        <card type="chart">
          <template slot="header">
            <h2 class="card-title">Issued Rewards</h2>
          </template>
          <div class="chart-area">
            <issued-rewards-by-month :positions="allPositions">
            </issued-rewards-by-month>
          </div>
        </card>
      </div>
    </div>


    <div class="row">
      <div class="col-12">
        <card class="card">
          <h2 slot="header" class="card-title">Top 10 Stakers</h2>
          <active-stakers-list :activeStakers="activeStakers">
          </active-stakers-list>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import config from '@/config';
  import router from '@/router/index';
  import axios from 'axios';
  import fancyFormatter from '@/plugins/fancyFormatter'
  import StakersByMonth from './Dashboard/StakersByMonth'
  import StakedVolumeByMonth from './Dashboard/StakedVolumeByMonth'
  import IssuedRewardsByMonth from './Dashboard/IssuedRewardsByMonth'
  import ActiveStakersList from './Dashboard/ActiveStakersList'


  export default {
    components: {
      StakersByMonth,
      StakedVolumeByMonth,
      IssuedRewardsByMonth,
      ActiveStakersList
    },
    data() {
      return {
        allPositions: [],
        globalStatistics : {
          totStakers : 0,
          totStaked: 0,
          totUnclaimed: 0,
          totIssued: 0
        },
        activeStakers : []
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      },
    },
    methods: {
      getGlobalStatistics() {
        const path = config.QDTMonitorApiBasePath+"v1/getGlobalStatistics"
        axios.get(path)
          .catch((err) => { console.log(err) } )
          .then( (res) => {
            this.globalStatistics=res.data
            this.globalStatistics.totStaked=fancyFormatter.QDTAmount(res.data.totStaked)
            this.globalStatistics.totUnclaimed=fancyFormatter.QDTAmount(res.data.totUnclaimed)
            this.globalStatistics.totIssued=fancyFormatter.QDTAmount(res.data.totIssued)
          })
      },
      getActiveStakers() {
        const path = config.QDTMonitorApiBasePath+"v1/getActiveStakers?limit=10"
        axios.get(path)
        .catch((err) => console.log(err))
        .then( (res) => {
          console.log(res.data)
          this.activeStakers = res.data
        })
      },
      getAllStakingPositions() {
        const path = config.QDTMonitorApiBasePath+"v1/getAllStakingPositions"
        axios.get(path)
        .catch((err) => console.log(err))
        .then( (res) => {
          this.allPositions = res.data
        })
      },
      viewStakerStatistics(event) {
        let staker=this.$refs.stakerAddressInput.value
        console.log("Called: "+staker)
        if(staker!=="")
        {
          router.push({
            path:'profile/'+staker,
          }).catch(()=>{})
        }
        event.preventDefault()
      },
    },
    created() {
      this.getGlobalStatistics()
      this.getActiveStakers()
      this.getAllStakingPositions()
    },
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }

    },
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
</style>
