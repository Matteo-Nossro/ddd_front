<template>
  <Dialog v-model:visible="props.visible"  modal  dismissableMask closable   @hide="onHide"
           :style="{ width: '40rem' }">
<!--    <DefaultContainer title="Détails du Track">-->
    <div v-if="props.track">
      <ul class="track-details">
        <li v-for="(value, key) in formattedTrack" :key="key">
          <strong>{{ formatKey(key) }} :</strong> {{ value }}
        </li>
      </ul>
    </div>
<!--    </DefaultContainer>-->
  </Dialog>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import type { Track } from './index.ts'; // adapte le chemin
import Dialog from 'primevue/dialog';
import DefaultContainer from "../../components/DefaultContainer.vue";

const props = defineProps<{
  track: Track | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const isVisible = ref(props.visible);

function onHide() {
  emit('update:visible', false);
}

// 🔄 Sync avec prop `visible`
watch(() => props.visible, (val) => {
  isVisible.value = val;
});

// 🔄 Émet le changement quand on ferme
watch(isVisible, (val) => {
  if (!val) emit('update:visible', false);
});

// Formatage des clés en mode lisible
function formatKey(key: string): string {
  return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
}

// Formattage du contenu selon le type
const formattedTrack = computed(() => {
  if (!props.track) return {};

  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(props.track)) {
    if (key === 'duration_ms') {
      result[key] = formatDuration(value as number);
    } else if (key.includes('date')) {
      result[key] = formatFrenchDate(value as string);
    } else if (typeof value === 'boolean') {
      result[key] = value ? 'Oui' : 'Non';
    } else {
      result[key] = value?.toString() ?? '';
    }
  }

  return result;
});



// Formatage durée en mm:ss
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Formatage date FR
function formatFrenchDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('fr-FR');
}
</script>

<style scoped>
.track-details {
  list-style: none;
  padding: 0;
}

.track-details li {
  margin: 0.4rem 0;
}
</style>
