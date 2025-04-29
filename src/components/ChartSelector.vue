<template>
  <div class="chart-container">
    <div class="chart-selector">
      <!-- <SelectButton
        v-model="selectedChart"
        :options="chartOptions"
        optionLabel="label"
        optionValue="value"
        @change="handleChartChange"
      >
      <template #option="slotProps">
        <i :class="slotProps.option.icon"></i>
      </template>
      </SelectButton> -->

    </div>
    <div class="chart-wrapper">
      <v-chart
        class="chart"
        :option="chartOption"
        autoresize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SelectButton from 'primevue/selectbutton';

interface SeriesData {
  name: string;
  data: number[];
}

interface ChartData {
  xAxis: string[];
  series: SeriesData[];
}

const props = defineProps<{
  data: ChartData;
  selectedChart: string;
}>();

const selectedChart = computed(() => props.selectedChart);
console.log('selectedChart', selectedChart.value);

const chartOptions = [
  { label: 'Ligne', value: 'line', icon: 'pi pi-chart-line' },
  { label: 'Barre', value: 'bar', icon: 'pi pi-chart-bar' }
];

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: props.data.series.map(s => s.name)
    },
    xAxis: {
      type: 'category',
      data: props.data.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: props.data.series.map(series => ({
      name: series.name,
      type: selectedChart.value,
      data: series.data,
      smooth: true,
      showSymbol: false
    }))
  };
});

const handleChartChange = () => {
  // Vous pouvez ajouter ici des actions supplémentaires lors du changement de graphique
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.chart-selector {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style> 