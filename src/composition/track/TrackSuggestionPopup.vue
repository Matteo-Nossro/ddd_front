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
          <!-- On appelle searchTracks() au clic -->
          <label>&nbsp;</label>
          <DefaultButton @click="searchTracks">Rechercher</DefaultButton>
        </div>
      </div>

      <h2>Liste des titres similaires suggérés</h2>
      <!-- Affichage très basique en attendant le TrackTable -->
<!--      <ul v-if="!tracks.length">-->
<!--        <li>Aucun titre similaire trouvé.</li>-->
<!--      </ul>-->

      <!-- On passe maintenant `tracks` dans le tableau -->
      <DataTable
          :value="formattedTrack"
          class="styled-table"
          tableStyle="min-width: 60rem"
      >
        <template #empty>Pas de données pour ce pays / date</template>
        <Column field="daily_rank" header="Rang"/>
        <Column field="name" header="Nom"/>
        <Column field="artists" header="Artiste"/>
        <Column field="popularity" header="Popularité"/>
        <Column header="Durée">
          <template #body="{ data }">
            {{ formatDuration(data.duration_ms) }}
          </template>
        </Column>
        <Column field="album_release_date" header="Date de sortie">
          <template #body="{ data }">
            {{ formatFrenchDate(data.album_release_date) }}
          </template>
        </Column>
        <Column field="album_name" header="Nom de l'album"/>
      </DataTable>
    </template>
  </DefaultPopup>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import DefaultPopup from '../../components/DefaultPopup.vue' // adapte selon ton arborescence
import DatePicker from 'primevue/datepicker'
import Dropdown from 'primevue/dropdown'
import DefaultButton from '../../components/DefaultButton.vue'
import TrackTable from './TrackTable.vue'
import { fetchSmilarTracksFromDateAndCountry, type Track } from './index'
import {CountryName} from '../../enum/countries.ts';
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const props = defineProps<{
  track: Track | null
  lastDate: string
  lastCountry: string
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const isVisible = ref(props.visible)
watch(() => props.visible, val => { isVisible.value = val })
watch(isVisible, val => { if (!val) emit('update:visible', false) })
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// filtres
const selectedCountry = ref<string | null>(null)
const date = ref<string | null>(null)

// résultats
const tracks = ref<Track[]>([])

// locale français pour DatePicker
const frenchLocale = {
  /* …copiez votre config… */
}

function formatToYMD(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois = 0-indexé
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatFrenchDate(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // La date n'est pas valide
    return dateString;
  }

  const day = date.getDate().toString().padStart(2, '0');
  // Mois : +1 car getMonth() retourne 0 pour janvier, 1 pour février, etc.
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const formattedTrack = computed(() => {
  return tracks.value
})


// liste des pays
const countries = Object.entries(CountryName).map(([code, name]) => ({ code, name }))

function onHide() {
  emit('update:visible', false)
}

async function searchTracks() {
  // on ne lance la recherche que si on a tout
  if (!props.track?.spotify_id || !selectedCountry.value || !date.value) {
    console.warn('Il manque la date, le pays ou la track de référence.')
    return
  }

  console.log(
      'Données envoyées →',
      'lastCountry:', props.lastCountry,
      'lastDate:', props.lastDate,
      'spotify_id:', props.track.spotify_id,
      'selectedCountry:', selectedCountry.value,
      'date:', formatToYMD(date.value)
  )

  try {
    const  response  = await fetchSmilarTracksFromDateAndCountry(
        props.lastCountry,
        props.lastDate,
        props.track.spotify_id,
        selectedCountry.value,
        formatToYMD(date.value)
    )
    console.log('fetchSmilarTracksFromDateAndCountry results',response)
    console.log('results.results:', response)

    tracks.value = response
    console.log('Tracks trouvées:', tracks.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des tracks :', error)
  }
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