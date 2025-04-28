<template>
  <div class="app">
    <h1>Dashboard</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import {useUser} from "../composition/user/index.js";
import Maps from "../components/Maps.vue";

const { user } = useUser()


const onClick = () => {
  console.log('user ',user)
  alert('Bouton cliqué !')
}

const chartOptions = ref({
  title: {
    text: 'Exemple de graphique'
  },
  tooltip: {},
  legend: {
    data: ['Ventes']
  },
  xAxis: {
    data: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  },
  yAxis: {},
  series: [
    {
      name: 'Ventes',
      type: 'bar',
      data: [5, 20, 36, 10, 10]
    }
  ]
})
</script>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
