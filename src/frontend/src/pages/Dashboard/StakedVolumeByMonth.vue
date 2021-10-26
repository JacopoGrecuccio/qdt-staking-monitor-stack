<template>
<line-chart style="height: 100%"
            ref="volumeChart"
            chart-id="staked-volume-over-month-chart"
            :chart-data="stakedVolumeChart.chartData"
            :gradient-colors="stakedVolumeChart.gradientColors"
            :gradient-stops="stakedVolumeChart.gradientStops"
            :extra-options="stakedVolumeChart.extraOptions">
</line-chart>
</template>


<script>
import config from '@/config';
import * as chartConfigs from '@/components/Charts/config';
import LineChart from '@/components/Charts/LineChart'

export default {
  components: {
    LineChart
  },
  props: {
    positions: [],
  },
  data() {
    return {
          stakedVolumeChart: {
            extraOptions: chartConfigs.greenChartOptions,
            chartData: {
              labels: [],
              datasets: [{
                label: "Total staked",
                fill: false,
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
                data: [],
              }]
            },
            gradientColors: ['rgba(66,134,121,0.15)', 'rgba(66,134,121,0.0)', 'rgba(66,134,121,0)'],
            gradientStops: [1, 0.4, 0],
          },
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
      console.log(months)
      return months
    },
    totalStakedVolumeByMonth(nMonths) {
      var totalVolumes = []
      var lastMonths = this.getLastMonthsTimestamps(nMonths)
      var monthLabels = lastMonths.map( (m) => { return m.mLabel })
      var i
      for(i=0;i<nMonths;i++) { totalVolumes.push(0); }
      for(i=0;i<nMonths;i++)
      {
        this.positions.forEach( (p) => {
          if(p.closingTimestamp) {
            // It's a closed position
            if(
            p.openingTimestamp<=lastMonths[i].mEndTimestamp &&
            p.closingTimestamp>lastMonths[i].mEndTimestamp
            ) {
              totalVolumes[i]-= (Number.parseFloat(p.stakedAmount)/(10**18))
            }
          } else {
            // It's an open position
            if(p.openingTimestamp<=lastMonths[i].mEndTimestamp) {
              totalVolumes[i]+= (Number.parseFloat(p.stakedAmount)/(10**18))
            }
          }
        })
      }

      return {
        totalVolumes : totalVolumes,
        labels : monthLabels
      }
    },
    renderPlot() {
      var dataObj = this.totalStakedVolumeByMonth(12)
      var maxVolume = Math.max(...dataObj.totalVolumes)
      console.log(dataObj)
      this.stakedVolumeChart.chartData.labels=dataObj.labels
      this.stakedVolumeChart.chartData.datasets[0].data=dataObj.totalVolumes
      console.log(maxVolume)
      this.stakedVolumeChart.extraOptions.scales.yAxes[0].ticks.suggestedMax=maxVolume+10000

      this.$refs.volumeChart.renderChart(
        this.stakedVolumeChart.chartData,
        this.stakedVolumeChart.extraOptions
      )
    }
  },
  watch : {
    positions: function() { this.renderPlot() }
  },
  mounted() {
    this.renderPlot()
  }
}
</script>
