<template>

	<MainMenu/>
<DefaultContainer title="Liste des Tracks">
  <TrackTable/>
</DefaultContainer>


</template>
<script setup lang="ts">

import TrackTable from "../composition/track/TrackTable.vue";
import DefaultContainer from "../components/DefaultContainer.vue";
import MainMenu from "../components/MainMenu.vue";
</script>
<style scoped>

</style>