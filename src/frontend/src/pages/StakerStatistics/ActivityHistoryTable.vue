<template>
<div class="row">
  <div class="col-12">
    <card class="card">
      <h2 slot="header" class="card-title">Activity History</h2>
      <div class="table-responsive" style="overflow:hidden;">
      <table class="table tablesorter">
        <thead class="text-primary" style="font-weight:300; font-size:1.2rem;">
          <td>Date</td>
          <td></td>
          <td>Amount</td>
          <td>Block #</td>
          <td>Transaction</td>
        </thead>
        <tbody style="font-size:1rem;">

          <tr v-for="activity in activities" >
            <td>{{ renderTimestamp(activity.timestamp) }}</td>
            <td>
              <span v-if="activity.action==='Stake'"
                class="badge badge-success">
                  {{activity.action}}
              </span>
              <span v-if="activity.action==='Withdraw'"
                class="badge badge-danger">
                  {{activity.action}}
              </span>
            </td>
            <td>{{renderQDTAmount(activity.amount)}}</td>
            <td>
              <a
                :href="'https://etherscan.io/block/'+activity.blockNumber"
                class="nav-link"
              >
                {{activity.blockNumber}}
              </a>
            </td>
            <td>
              <a
                :href="'https://etherscan.io/tx/'+activity.transactionHash"
                target="_blank"
                class="nav-link"
              >
              {{activity.transactionHash}}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <h5 class="text-center" v-if="activities.length==0"> No staking activity for the given address</h5>
      </div>
    </card>
  </div>
</div>
</template>
<script>
  import fancyFormatter from '@/plugins/fancyFormatter'

  export default {
    props: {
      activities: []
    },
    methods : {
      renderTimestamp(timestamp) {
        return fancyFormatter.timestampToDate(timestamp)
      },
      renderQDTAmount(amount) {
        return fancyFormatter.QDTAmount(amount)
      }
    }
  }
</script>
