<template>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <card type="chart">
          <template slot="header">
          <div class="row">
            <div class="col-12 mt-1">
              <h2 class="card-title">Join the staking!</h2>
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
            <div class="col-auto mr-auto ml-auto mb-2 mt-1">
              <a class="btn btn-primary">Stake now!</a>
            </div>
          </div>
          </template>
        </card>
      </div>
      <div class="col-8">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category"></h5>
                <h2 class="card-title">Staking Pool Size</h2>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle"
                     :class="isRTL ? 'float-left' : 'float-right'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in bigLineChartCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: bigLineChart.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="initBigChart(index)"
                           name="options" autocomplete="off"
                           :checked="bigLineChart.activeIndex === index">
                    {{option}}
                  </label>
                </div>
              </div>

            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        ref="bigChart"
                        chart-id="big-line-chart"
                        :chart-data="bigLineChart.chartData"
                        :gradient-colors="bigLineChart.gradientColors"
                        :gradient-stops="bigLineChart.gradientStops"
                        :extra-options="bigLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4" :class="{'text-right': isRTL}">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Staked Tokens</h5>
            <h3 class="card-title">
              <i class="tim-icons icon-bell-55 text-primary "></i>
                {{ totalStakedTokens }} QDTs</h3>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="purple-line-chart"
                        :chart-data="purpleLineChart.chartData"
                        :gradient-colors="purpleLineChart.gradientColors"
                        :gradient-stops="purpleLineChart.gradientStops"
                        :extra-options="purpleLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
      <div class="col-lg-4" :class="{'text-right': isRTL}">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Active Stakers</h5>
            <h3 class="card-title"><i class="tim-icons icon-delivery-fast text-info "></i>
            {{activeStakersCount}} </h3>
          </template>
          <div class="chart-area">
            <bar-chart style="height: 100%"
                       chart-id="blue-bar-chart"
                       :chart-data="blueBarChart.chartData"
                       :gradient-stops="blueBarChart.gradientStops"
                       :extra-options="blueBarChart.extraOptions">
            </bar-chart>
          </div>
        </card>
      </div>
      <div class="col-lg-4" :class="{'text-right': isRTL}">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Issued Rewards</h5>
            <h3 class="card-title"><i class="tim-icons icon-send text-success "></i>
            {{ issuedRewards }} QDTs</h3>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        chart-id="green-line-chart"
                        :chart-data="greenLineChart.chartData"
                        :gradient-stops="greenLineChart.gradientStops"
                        :extra-options="greenLineChart.extraOptions">
            </line-chart>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <!-- Avg. staked amount card START -->
      <div class="col-3">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-12" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">Average Staked Amount</h5>
                <h2 class="card-title">1.75M QDTs</h2>
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
              <div class="col-sm-12" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">Unclaimed rewards</h5>
                <h2 class="card-title">1.75M QDTs</h2>
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
              <div class="col-sm-12" :class="isRTL ? 'text-right' : 'text-left'">
                <h5 class="card-category">Average Interest Days</h5>
                <h2 class="card-title">90 days</h2>
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
                <div class="col-sm-12" :class="isRTL ? 'text-right' : 'text-left'">
                  <h5 class="card-category">Staking Pool Age</h5>
                  <h2 class="card-title">300 days </h2>
                </div>
              </div>
          </template>
        </card>
      </div>
      <!-- Active stakeholders card END -->
    </div>

    <div class="row">
      <div class="col-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">Top Stakers</h4>
          <div class="table-responsive" style="overflow:hidden;">
          <table class="table tablesorter">
            <thead class="text-primary">

              <td>Staker address</td>
              <td>Staked amount</td>
              <td>Interest days</td>
              <td>Accured interests</td>
            </thead>
            <tbody>
              <tr v-for="staker in activeStakers" >
                <td>{{staker[0]}}</a></td>
                <td>{{fancyQDTAmountFormatter(staker[1])}}</td>
                <td>{{staker[2].toFixed(2)}}</td>
                <td>{{fancyQDTAmountFormatter(staker[3])}}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  import * as chartConfigs from '@/components/Charts/config';
  import TaskList from './Dashboard/TaskList';
  import UserTable from './Dashboard/UserTable';
  import config from '@/config';
  import axios from 'axios';

  export default {
    components: {
      LineChart,
      BarChart,
      TaskList,
      UserTable
    },
    data() {
      return {
        totalStakedTokens : 0,
        activeStakers : [],
        activeStakersCount : 0,
        issuedRewards : 0,
        bigLineChart: {
          allData: [
            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
          ],
          activeIndex: 0,
          chartData: {
            datasets: [{ }],
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          },
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        },
        purpleLineChart: {
          extraOptions: chartConfigs.purpleChartOptions,
          chartData: {
            labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            datasets: [{
              label: "Data",
              fill: true,
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.primary,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: [80, 100, 70, 80, 120, 80],
            }]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.2, 0],
        },
        greenLineChart: {
          extraOptions: chartConfigs.greenChartOptions,
          chartData: {
            labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
            datasets: [{
              label: "My First dataset",
              fill: true,
              borderColor: config.colors.danger,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.danger,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.danger,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: [90, 27, 60, 12, 80],
            }]
          },
          gradientColors: ['rgba(66,134,121,0.15)', 'rgba(66,134,121,0.0)', 'rgba(66,134,121,0)'],
          gradientStops: [1, 0.4, 0],
        },
        blueBarChart: {
          extraOptions: chartConfigs.barChartOptions,
          chartData: {
            labels: ['USA', 'GER', 'AUS', 'UK', 'RO', 'BR'],
            datasets: [{
              label: "Countries",
              fill: true,
              borderColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [53, 20, 10, 80, 100, 45],
            }]
          },
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
        }
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      },
      bigLineChartCategories() {
        return this.$t('dashboard.chartCategories');
      }
    },
    methods: {
      fancyQDTAmountFormatter(qdtAmount) {
        if(qdtAmount>=0 && qdtAmount<999)
        {
          return qdtAmount.toFixed(2)+'';
        } else if(qdtAmount>=1000 && qdtAmount<999999)
        {
          return (qdtAmount/1000).toFixed(2)+'k';
        } else if(qdtAmount>=1000000 && qdtAmount<999999999)
        {
          return (qdtAmount/1000000).toFixed(2)+'M';
        } else if(qdtAmount>=1000000000 && qdtAmount<999999999999)
        {
          return (qdtAmount/1000000).toFixed(2)+'B';
        } else
        {
          return qdtAmount.toFixed(2)+'';
        }
      },
      getTotalStakedTokens() {
        const path = "http://127.0.0.1:5000/api/v1/totalStakedTokens";
        axios.get(path)
          .then( (res) => {
              this.totalStakedTokens = this.fancyQDTAmountFormatter(res.data.inStakingQDTs);
          } )
          .catch( (error) => { console.log(error) } );
      },
      getActiveStakers() {
        const path = "http://127.0.0.1:5000/api/v1/activeStakers";
        axios.get(path)
          .then( (res => {
            this.activeStakers = res.data.activeStakers;
            this.activeStakersCount = this.activeStakers.length;
          } ))
          .catch( (error) => console.log(error) );
      },
      getIssuedRewards() {
      const path = "http://127.0.0.1:5000/api/v1/issuedRewards";
      axios.get(path)
        .then( (res => {
          this.issuedRewards = this.fancyQDTAmountFormatter(res.data.issuedRewards);
        } ))
        .catch( (error) => console.log(error) );
      },
      getPoolSize() {
        const path="http://127.0.0.1:5000/api/v1/poolSizeWithinTimePeriod";
        axios.get(path)
        .then((res) => {

          let chartData = {
            datasets: [{
              fill: true,
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.primary,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: res.data.poolSize,
            }],
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
          }
          this.$refs.bigChart.updateGradients(chartData);
          this.bigLineChart.chartData = chartData;
          this.bigLineChart.activeIndex = index;
        })
      },
      initBigChart(index) {
        let chartData = {
          datasets: [{
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.bigLineChart.allData[index]
          }],
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        }
        this.$refs.bigChart.updateGradients(chartData);
        this.bigLineChart.chartData = chartData;
        this.bigLineChart.activeIndex = index;
      }
    },
    created() {

    },
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }
      this.getTotalStakedTokens();
      this.getActiveStakers();
      this.getIssuedRewards();
      this.getPoolSize();
      //this.initBigChart(0);

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
