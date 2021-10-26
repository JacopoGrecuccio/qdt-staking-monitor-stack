<template>

  <bar-chart style="height: 100%"
             chart-id="active-stakers-chart"
             ref="issuedRewardsByMonthChart"
             :chart-data="issuedRewardsByMonthChart.chartData"
             :gradient-stops="issuedRewardsByMonthChart.gradientStops"
             :extra-options="issuedRewardsByMonthChart.extraOptions">
  </bar-chart>

</template>


<script>
import config from '@/config';
import BarChart from '@/components/Charts/BarChart';
import * as chartConfigs from '@/components/Charts/config';

export default {
  components: {
    BarChart,
  },
  props: {
    positions: []
  },
  data() {
    return    {
      issuedRewardsByMonthChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: [],
          datasets: [{
            label: "Issued Rewards",
            fill: true,
            backgroundColor: config.colors.warning,
            /*borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,*/
            data: [],
          }]
        },
        responsive: true,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
      }
    }
  },
  methods : {
    getLastMonthsTimestamps(nMonths) {
      var months = []
      var today = new Date()
      var i=0
      const mLbls= ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEPT","OCT","NOV","DEC"]
      for(i=(nMonths-1);i>=0;i--)
      {

        let monthStart = new Date(today.getFullYear(),today.getMonth()-i,1)
        let monthEnd = new Date(today.getFullYear(),today.getMonth()-i+1,0)
        months.push({
          mStartTimestamp : Math.floor(monthStart.getTime()/1000),
          mEndTimestamp : Math.floor(monthEnd.getTime()/1000),
          mLabel : mLbls[monthStart.getMonth()]
        })

      }
      return months
    },
    issuedRewardsByMonth(nMonths) {
      var issuedRewards = []
      var lastMonths = this.getLastMonthsTimestamps(nMonths)
      var monthLabels = lastMonths.map( (m) => { return m.mLabel })
      var i
      for(i=0;i<nMonths;i++) { issuedRewards.push(0); }
      for(i=0;i<nMonths;i++)
      {
        this.positions.forEach( (p) => {
          if(p.closingTimestamp) {
            // It's a closed position
            if(
              p.closingTimestamp>=lastMonths[i].mStartTimestamp &&
              p.closingTimestamp<=lastMonths[i].mEndTimestamp) {
              issuedRewards[i]+=(
                Number.parseFloat(p.withdrawedAmount)-Number.parseFloat(p.stakedAmount)
                )/(10**18)
            }
          }
        })
      }

      return {
        labels : monthLabels,
        issuedRewards : issuedRewards
      }
    },
    renderPlot() {
      var dataObj = this.issuedRewardsByMonth(12)
      var maxRewards = Math.max(...dataObj.issuedRewards)
      this.issuedRewardsByMonthChart.chartData.labels=dataObj.labels
      this.issuedRewardsByMonthChart.chartData.datasets[0].data=dataObj.issuedRewards

      this.issuedRewardsByMonthChart.extraOptions.scales.yAxes[0].ticks.suggestedMax=maxRewards+maxRewards*0.2

      this.$refs.issuedRewardsByMonthChart.renderChart(
        this.issuedRewardsByMonthChart.chartData,
        this.issuedRewardsByMonthChart.extraOptions
      )
    },
  },
  watch : {
    positions : function() { this.renderPlot() }
  },
  mounted() {
    this.renderPlot()
  }
}
</script>
