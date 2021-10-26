<template>
  <pie-chart chart-id="staker-shares-chart"
    ref="stakerSharesChart"
    :chart-data="stakerSharesChart.chartData"
    :gradient-stops="stakerSharesChart.gradientStops"
    :extra-options="stakerSharesChart.extraOptions"
    :height="220"
    >
  </pie-chart>
</template>

<script>

import config from '@/config'
import PieChart from '@/components/Charts/PieChart'
  export default {
    props: {
      actualStaked: Number,
      actualRewards: Number,
      poolSize: Number,
    },
    components: {
      PieChart
    },
    data() {
      return {
        stakerSharesChart: {
          extraOptions: {
            legend: {
              display:true,
              position:'left'
            },
            responsive: true,
            maintainAspectRatio: true
          },
          chartData: {
            labels: [],
            datasets: [{
              label: "Share",
              fill: true,
              data: [],
              backgroundColor: [
                'rgba(75, 192, 192, .95)',
                'rgb(54, 162, 235, .75)',
              ],
            }]
          },
          responsive: true,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
        }
      }
    },
    methods: {
      computeShares() {
        if (this.$props.poolSize!=0)
        {
          return [
            100*((this.$props.actualStaked+this.$props.actualRewards)/this.$props.poolSize),
            100*(1-(this.$props.actualStaked+this.$props.actualRewards)/this.$props.poolSize)
          ]
        } else {
          return [
            0,100
          ]
        }
      },
      renderPlot() {

        this.stakerSharesChart.chartData.labels=[
                                                  "Staker",
                                                  "Others"
                                                ]
        this.stakerSharesChart.chartData.datasets[0].data=this.computeShares()
        console.log(this.stakerSharesChart.chartData.datasets[0].data)

        this.$refs.stakerSharesChart.renderChart(
          this.stakerSharesChart.chartData,
          this.stakerSharesChart.extraOptions
        );

      }
    },
    watch: {
      /*actualStaked:function()  {
        this.renderPlot()
      },
      actualRewards: function() {
        this.renderPlot()
      },*/
      poolSize: function() {
        this.renderPlot()
      }
    },
    mounted() {
      this.renderPlot()
    }
  }
</script>
