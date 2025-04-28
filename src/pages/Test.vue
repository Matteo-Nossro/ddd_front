<template>

	<MainMenu/>
<DefaultContainer title="Liste des Tracks">
  <TrackTable suggestion/>
</DefaultContainer>

<DefaultContainer title="Liste des Pays">
  <ChartTest/>
</DefaultContainer>

<DefaultContainer title="Globe">
  <MapsThreeJs/>
</DefaultContainer>

<DefaultContainer title="planisphère">
  <SelectableWorldMap/>
  <p>Pays choisis : {{ countries.join(', ') }}</p>
</DefaultContainer>

</template>
<script setup lang="ts">
import { ref } from 'vue';

import TrackTable from "../composition/track/TrackTable.vue";
import DefaultContainer from "../components/DefaultContainer.vue";
import MainMenu from "../components/MainMenu.vue";
import ChartTest from "../components/ChartTest.vue";
import MapsThreeJs from "../components/MapsThreeJs.vue";
import SelectableWorldMap from "../components/SelectableWorldMap.vue";

const countries = ref<string[]>(['FR', 'DE']);

</script>
<style scoped>

</style>