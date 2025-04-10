<template>
  <div class="app">
    <h1>Dashboard</h1>

    <Button label="Clique moi" class="p-button-primary" @click="onClick" />

    <v-chart :option="chartOptions" style="height: 400px; width: 100%; margin-top: 2rem;" />

    <router-link to="/" style="display: block; margin-top: 2rem;">Retour à l'accueil</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

const onClick = () => {
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
