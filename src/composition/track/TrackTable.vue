<template>
	<div class="filters">
		<div class="filter-item">
			<label for="startDate">Date du trie</label>
			<DatePicker
					inputId="date"
					v-model="date"
					dateFormat="yy-mm-dd"
					:locale="frenchLocale"

					showIcon
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
	</div>


  <DataTable :value="tracks" class="styled-table"
             tableStyle="min-width: 60rem; 		" paginator :rows="20" :rowsPerPageOptions="[20, 50]">
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
    <Column header="Action">
      <template #body="{ data }">
				<DefaultButton variant="primary" @click="() => handleActionClick(data)">
					Détails
				</DefaultButton>
      </template>
    </Column>
  </DataTable>

  <TrackDetailsPopup :track="selectedTrack" v-model:visible="popupVisible"/>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type {Track} from "./index.ts";       // Mettez le chemin correct vers votre interface
import {fetchTracks} from "./index.ts";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TrackDetailsPopup from "./TrackDetailsPopup.vue";
import DefaultButton from "../../components/DefaultButton.vue";
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';
const tracks = ref<Track[]>([]);
const selectedTrack = ref<Track | null>(null);
const popupVisible = ref(false);


import { CountryName } from '../../enum/countries.ts'; // Remplace avec le bon chemin

const date = ref<string | null>(null);
const selectedCountry = ref<string | null>(null);

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

// 🔄 Transformer l’enum en tableau d’objets
const countries = Object.entries(CountryName).map(([code, name]) => ({
	name,
	code
}));


// 2023-10-18 et 2025-04-06 (format YYYY-MM-DD)


// 💡 Convertit la durée en mm:ss
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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


// 🛎️ Action du bouton
function handleActionClick(track: Track) {
  selectedTrack.value = track;
  popupVisible.value = true;
}

// onMounted(async () => {
//   try {
//     const response = await fetch('/moke_top_track.json');
//     if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//
//     const data = await response.json();
//     tracks.value = data.results; // ✅ on accède à `results` ici
//   } catch (error) {
//     console.error('Erreur lors du chargement des tracks :', error);
//   }
// });
onMounted(async () => {
  try {
    const response = await fetchTracks();
    tracks.value = response.results; // ✅ on prend directement les tracks ici
    console.log('tracks.value', tracks.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des tracks :", error);
  }
});


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


.styled-table {

  ::v-deep(.p-datatable-thead > tr > th) {
    white-space: nowrap;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
    background-color: #f5f5f5;
    text-align: left;
  }

	::v-deep(.p-datatable) {
		max-height : calc(100vh - 9rem);
		overflow-y: scroll;
	}

  ::v-deep(.p-datatable-tbody > tr) {
    height: 3.5rem;


    &:hover {
      background-color: #f9f9f9;
    }
  }

  ::v-deep(.p-datatable-tbody > tr > td) {
    padding: 0.8rem 1.5rem;
    font-size: 0.95rem;
    vertical-align: middle;
  }
}

.action-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
}
</style>
