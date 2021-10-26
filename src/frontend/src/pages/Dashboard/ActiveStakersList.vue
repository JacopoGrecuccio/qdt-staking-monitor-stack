<template>
  <div class="table-responsive" style="overflow:hidden;">
  <table class="table tablesorter">
    <thead class="text-primary" style="font-weight:300; font-size:1.2rem;">

      <td>Staker address</td>
      <td>Staked amount</td>
      <td>Interest days</td>
      <td>Accured interests</td>
    </thead>
    <tbody style="font-size:1rem;">
      <tr v-for="staker in activeStakers" >
        <td>
        <router-link :to="{path: '/profile/'+staker.stakerAddress}" class="nav-link">
          {{staker.stakerAddress}}
        </router-link>
        </td>
        <td>{{fancyFormatter.QDTAmount(staker.stakedAmount )}}</td>
        <td>{{staker.interestDays.toFixed(2)}}</td>
        <td>{{fancyFormatter.QDTAmount(staker.estReward)}}</td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>

import fancyFormatter from '@/plugins/fancyFormatter'

export default {
  props : {
    activeStakers: []
  },
  data() {
    return {
      fancyFormatter : fancyFormatter
    }
  }
}
</script>
