<template>
  <DefaultPopup
      v-model:visible="isVisible"
      @close="onHide"
      :globalStyle="{ width: '80rem' }"
  >
  <template #content>
    <div class="filters">
      <div class="filter-item">
        <label for="startDate" class="filter-label">Date du tri</label>
        <DatePicker
            v-model="date"
            inputId="startDate"
            :locale="frenchLocale"
            dateFormat="dd-mm-yy"
            showIcon
            placeholder="Sélectionner une date"
            style="width: 100%;"
            :minDate="new Date('2023-10-18')"
            :maxDate="new Date('2025-04-06')"
        />
      </div>


      <div class="filter-item">
        <label for="country">Pays</label>
        <Dropdown
            v-model="selectedCountry"
            :options="countries"
            optionLabel="name"
            optionValue="code"
            placeholder="Sélectionner un pays"
            filter
            showClear
        />
      </div>
      <div class="filter-item">
        <label for="country">&nbsp</label>
        <DefaultButton @click="">Rechercher</DefaultButton>
      </div>


    </div>
    <h2>liste des titres similaires suggérer</h2>

    <ul>
      <li>test</li>
      <li>test</li>
      <li>test</li>
    </ul>
    <TrackTable suggestion="false"/>
  </template>
  </DefaultPopup>
</template>

<script setup lang="ts">
import DefaultPopup from "../../components/DefaultPopUp.vue";
import {ref, watch} from "vue";
import type {Track} from "./index.ts";
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";
import DefaultButton from "../../components/DefaultButton.vue";
import {CountryName} from "../../enum/countries.ts";
import TrackTable from "./TrackTable.vue";


const props = defineProps<{
  track: Track | null;
  visible: boolean;
}>()

const selectedCountry = ref<string>('FR');
const date = ref<string | null>(null);

const isVisible = ref(props.visible)

// 📜 Locale pour afficher les dates en français
const frenchLocale = {
  firstDayOfWeek: 1,
  dayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  dayNamesShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
  dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  monthNamesShort: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
  today: "Aujourd'hui",
  clear: 'Effacer'
};

const countries = Object.entries(CountryName).map(([code, name]) => ({
  name,
  code
}));

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>()

watch(() => props.visible, (val) => {
  isVisible.value = val
})

watch(isVisible, (val) => {
  if (!val) emit('update:visible', false)
})

function onHide() {
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;

  .filter-item {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 0.3rem;
    font-weight: 500;
    font-size: 0.9rem;
  }
}
</style>