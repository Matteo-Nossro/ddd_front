<template>
  <div class="test-container">
    <div class="controls">
      <div class="button-group">
        <Dropdown
          v-model="selectedMetric"
          :options="availableMetrics"
          optionLabel="label"
          optionValue="value"
          placeholder="Sélectionner une métrique"
          class="mb-3"
        />
        <SelectButton
          v-model="selectedChart"
          :options="chartOptions"
          optionLabel="label"
          optionValue="value"
          @change="handleChartChange"
          class="mb-3"
        >
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton>
      </div>
    </div>
    <ChartSelector :data="chartData" :selectedChart="selectedChart" />
  </div>
</template>

<script setup lang="ts">
import ChartSelector from './ChartSelector.vue';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';
import { ref, computed } from 'vue';

const selectedMetric = ref('ventes');
const selectedChart = ref('line');

const chartOptions = [
  { label: 'Ligne', value: 'line', icon: 'pi pi-chart-line' },
  { label: 'Barre', value: 'bar', icon: 'pi pi-chart-bar' }
];

const availableMetrics = [
  { label: 'Ventes', value: 'ventes' },
  { label: 'Bénéfices', value: 'benefices' },
  { label: 'Clients', value: 'clients' }
];

const mockData = {
  ventes: {
    2023: [150, 230, 224, 218, 135, 147, 260, 280, 200, 190, 220, 250],
    2024: [180, 250, 240, 220, 150, 160, 280, 300, 220, 210, 240, 270]
  },
  benefices: {
    2023: [50, 80, 75, 70, 45, 48, 85, 95, 65, 60, 75, 85],
    2024: [60, 90, 85, 75, 50, 55, 95, 105, 75, 70, 85, 95]
  },
  clients: {
    2023: [45, 65, 60, 58, 40, 42, 70, 75, 55, 50, 60, 65],
    2024: [50, 70, 65, 60, 45, 48, 75, 80, 60, 55, 65, 70]
  }
};

const chartData = computed(() => ({
  xAxis: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  series: [
    {
      name: '2023',
      data: mockData[selectedMetric.value][2023]
    },
    {
      name: '2024',
      data: mockData[selectedMetric.value][2024]
    }
  ]
}));

const handleChartChange = () => {
  // Vous pouvez ajouter ici des actions supplémentaires lors du changement de graphique
};
</script>

<style scoped>
.test-container {
  padding: 2rem;
  width: 100%;
  min-width: 450px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.controls {
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  align-items: left;
  justify-content: left;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style> 