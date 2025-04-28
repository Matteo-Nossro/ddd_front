<template>
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
			<DefaultButton @click="updateTable">Rechercher</DefaultButton>
		</div>
	</div>


	<DataTable
			:value="tracks"
			class="styled-table"
			tableStyle="min-width: 60rem"
			:paginator="true"
			:rows="rowsPerPage"
			:totalRecords="totalCount"
			:first="(currentPage - 1) * rowsPerPage"
			@page="onPageChange"
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
		<Column header="Action">
			<template #body="{ data }">
        <DefaultButton  v-if="props.suggestion"  variant="primary" @click="() => handleOpenSuggestions(data)">
          Suggestions
        </DefaultButton>
        <DefaultButton v-else variant="primary" @click="() => handleOpenDetails(data)">
          Détails
        </DefaultButton>
			</template>
		</Column>
	</DataTable>

  <TrackSuggestionPopup  v-if="props.suggestion"  :track="selectedTrack" v-model:visible="popupSuggestionVisible"/>
	<TrackDetailsPopup v-else :track="selectedTrack" v-model:visible="popupDetailsVisible"/>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {fetchTracksByCountry,fetchTopTracksByCountryAndDate, type Track} from "./index.ts";       // Mettez le chemin correct vers votre interface
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import TrackDetailsPopup from "./TrackDetailsPopup.vue";
import TrackSuggestionPopup from "./TrackSuggestionPopup.vue"
import DefaultButton from "../../components/DefaultButton.vue";
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';

const props = defineProps<{
  suggestion: boolean;
  inputTracks?:Track[];
}>()

import {CountryName} from '../../enum/countries.ts';

const tracks = ref<Track[]>([]);
const selectedTrack = ref<Track | null>(null);
const popupSuggestionVisible = ref(false);
const popupDetailsVisible = ref(false);

const date = ref<string | null>(null);
const selectedCountry = ref<string>('FR');
const currentPage = ref<number>(1);
const totalCount = ref<number>(0);
const rowsPerPage = ref<number>(20);

// Pagination
const updateTable = async () => {
	if (!selectedCountry.value) return;

	console.log('date.value',date.value);
	if (date.value) {
		try {
			const response = await fetchTopTracksByCountryAndDate(selectedCountry.value, formatToYMD(date.value));
			tracks.value = response.results;
			totalCount.value = response.count;
		} catch (error) {
			console.error("Erreur lors de la récupération des données :", error);
		}
	} else {
		try {
			const response = await fetchTracksByCountry(selectedCountry.value, currentPage.value);
			tracks.value = response.results;
			totalCount.value = response.count;
		} catch (error) {
			console.error("Erreur lors de la récupération des données :", error);
		}
	}
};

const onPageChange = (event: any) => {
	currentPage.value = event.page + 1; // PrimeVue commence à 0
	updateTable();
};


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


// 💡 Convertit la durée en mm:ss
function formatDuration(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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


// 🛎️ Action du bouton
function handleOpenDetails(track: Track) {
	selectedTrack.value = track;
	popupDetailsVisible.value = true;
}
function handleOpenSuggestions(track: Track) {
  console.log('handleOpenSuggestions')
	selectedTrack.value = track;
  popupSuggestionVisible.value = true;
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
  console.log(props.inputTracks)
  if (props.inputTracks?.length !== 0 && props.inputTracks !== undefined) return;

  try {
		const response = await fetchTracksByCountry('FR', 1);
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

.p-datatable{
	overflow-y: scroll;
	width: 100%;
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
		max-height: calc(100vh - 9rem);
		overflow-y: scroll;
		width: 100%;
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
