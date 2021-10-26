<template>

  <bar-chart style="height: 100%"
             chart-id="active-stakers-chart"
             ref="activeStakersChart"
             :chart-data="activeStakersChart.chartData"
             :gradient-stops="activeStakersChart.gradientStops"
             :extra-options="activeStakersChart.extraOptions">
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
      activeStakersChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: {
          labels: [],
          datasets: [{
            label: "Active stakers",
            fill: true,
            backgroundColor: config.colors.info,
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
      console.log(months)
      return months
    },
    activeStakersByMonth(nMonths) {
      var activeStakers = []
      var lastSixMonths = this.getLastSixMonthsTimestamps(nMonths)
      var monthLabels = lastSixMonths.map( (m) => { return m.mLabel })
      var i
      for(i=0;i<nMonths;i++) { activeStakers.push(0); }
      for(i=0;i<nMonths;i++)
      {
        this.positions.forEach( (p) => {
          if(p.closingTimestamp) {
            // It's a closed position
            if(
              p.openingTimestamp<=lastSixMonths[i].mEndTimestamp &&
              p.closingTimestamp>lastSixMonths[i].mEndTimestamp
            ) {
              activeStakers[i]++
            }
          } else {
            // It's an open position
            if(p.openingTimestamp<=lastSixMonths[i].mEndTimestamp) {
              activeStakers[i]++
            }
          }
        })
      }

      return {
        labels : monthLabels,
        activeStakers : activeStakers
      }
    },
    renderPlot() {
      var dataObj = this.activeStakersByMonth(12)
      var maxStakers = Math.max(...dataObj.activeStakers)
      this.activeStakersChart.chartData.labels=dataObj.labels
      this.activeStakersChart.chartData.datasets[0].data=dataObj.activeStakers
      this.activeStakersChart.extraOptions.scales.yAxes[0].ticks.suggestedMax=maxStakers+maxStakers*0.2

      this.$refs.activeStakersChart.renderChart(
        this.activeStakersChart.chartData,
        this.activeStakersChart.extraOptions
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
