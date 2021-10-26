<template>

  <bar-chart style="height: 100%"
             chart-id="staker-activity-chart"
             ref="stakerActivityChart"
             :chart-data="stakerActivityChart.chartData"
             :gradient-stops="stakerActivityChart.gradientStops"
             :extra-options="stakerActivityChart.extraOptions">
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
    activities: []
  },
  data() {
    return    {
      stakerActivityChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: [],
          datasets: [{
              label: "Stake",
              fill: true,
              backgroundColor: config.colors.info,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: [],
            },
            {
                label: "Withdraw",
                fill: true,
                backgroundColor: config.colors.red,
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: [],
              },
          ]
        },
        responsive: true,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
      }
    }
  },
  methods : {
    getLastSixMonthsTimestamps(nMonths) {
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
    stakerActivitiesByMonth(nMonths) {
      var stakeActivities = []
      var withdrawActivities = []
      var lastMonths = this.getLastSixMonthsTimestamps(nMonths)
      var monthLabels = lastMonths.map( (m) => { return m.mLabel })
      var i
      for(i=0;i<nMonths;i++) {
        var monthlyStake=0
        var monthlyWithdraw=0
        this.activities.forEach( (a) => {
          if(a.timestamp>=lastMonths[i].mStartTimestamp &&
            a.timestamp<=lastMonths[i].mEndTimestamp
          )
          {
            if(a.action==="Stake") {
              monthlyStake+=Number.parseFloat(a.amount)/(10**18)
            } else if(a.action==="Withdraw") {
              monthlyWithdraw+=Number.parseFloat(a.amount)/(10**18)
            }
          }
        });
        stakeActivities.push(monthlyStake)
        withdrawActivities.push(monthlyWithdraw)
      }
      return {
        labels: monthLabels,
        stakes: stakeActivities,
        withdraws: withdrawActivities
      }
    },
    renderPlot() {
      var dataObj = this.stakerActivitiesByMonth(12)
      var maxAmount = Math.max(
                        Math.max(...dataObj.stakes),
                        Math.max(...dataObj.withdraws)
                      );
      console.log(dataObj)
      this.stakerActivityChart.chartData.labels=dataObj.labels
      this.stakerActivityChart.chartData.datasets[0].data=dataObj.stakes
      this.stakerActivityChart.chartData.datasets[1].data=dataObj.withdraws
      this.stakerActivityChart.extraOptions.scales.yAxes[0].ticks.suggestedMax=maxAmount+maxAmount*0.2
      //this.stakerActivityChart.extraOptions.scales.yAxes[1].ticks.suggestedMax=maxAmount+maxAmount*0.2

      this.$refs.stakerActivityChart.renderChart(
        this.stakerActivityChart.chartData,
        this.stakerActivityChart.extraOptions
      )
    },
  },
  watch : {
    activities : function() { this.renderPlot() }
  },
  mounted() {
    this.renderPlot()
  }
}
</script>
