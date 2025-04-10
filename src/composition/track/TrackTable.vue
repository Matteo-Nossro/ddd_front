<template>
  <div>
    <h1>Liste des Tracks</h1>
    <DataTable :value="tracks" tableStyle="min-width: 50rem">
      <Column field="name" header="Name" />
      <Column field="artists" header="Artist" />
      <Column field="popularity" header="Popularity" />
      <Column header="Duration">
        <template #body="{ data }">
          {{ formatDuration(data.duration_ms) }}
        </template>
      </Column>
      <Column field="album_release_date" header="Release Date">
        <template #body="{ data }">
          {{ formatFrenchDate(data.album_release_date) }}
        </template>
      </Column>
      <Column field="album_name" header="Album Name" />
      <Column header="Action">
        <template #body="{ data }">
          <button @click="() => handleActionClick(data)">Action</button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type {Track} from "./index.ts";       // Mettez le chemin correct vers votre interface
import {fetchTracks} from "./index.ts";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
const tracks = ref<Track[]>([]);

const columns = [
  { field: 'id', header: 'ID' },
  { field: 'country', header: 'Country' },
  { field: 'spotify_id', header: 'Spotify ID' },
  { field: 'name', header: 'Name' },
  { field: 'artists', header: 'Artists' },
  { field: 'daily_rank', header: 'Daily Rank' },
  { field: 'daily_movement', header: 'Daily Movement' },
  { field: 'weekly_movement', header: 'Weekly Movement' },
  { field: 'snapshot_date', header: 'Snapshot Date' },
  { field: 'popularity', header: 'Popularity' },
  { field: 'is_explicit', header: 'Explicit' },
  { field: 'duration_ms', header: 'Duration (ms)' },
  { field: 'album_name', header: 'Album Name' },
  { field: 'album_release_date', header: 'Album Release Date' },
  { field: 'danceability', header: 'Danceability' },
  { field: 'energy', header: 'Energy' },
  { field: 'key', header: 'Key' },
  { field: 'loudness', header: 'Loudness' },
  { field: 'mode', header: 'Mode' },
  { field: 'speechiness', header: 'Speechiness' },
  { field: 'acousticness', header: 'Acousticness' },
  { field: 'instrumentalness', header: 'Instrumentalness' },
  { field: 'liveness', header: 'Liveness' },
  { field: 'valence', header: 'Valence' },
  { field: 'tempo', header: 'Tempo' },
  { field: 'time_signature', header: 'Time Signature' }
];

onMounted(async () => {
  try {
    const response = await fetch('/moke_top_track.json');
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    const data = await response.json();
    tracks.value = data.results; // ✅ on accède à `results` ici
  } catch (error) {
    console.error('Erreur lors du chargement des tracks :', error);
  }
});


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
  alert(`Action sur : ${track.name}`);
}

// onMounted(async () => {
//   try {
//     tracks.value = await fetchTracks();
//   } catch (error) {
//     console.error("Erreur lors de la récupération des tracks :", error);
//   }
// });
</script>
