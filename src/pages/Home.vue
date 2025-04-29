<template>
  <MainMenu/>
  <DefaultContainer v-if="user.role='citizen'" title="Liste des Tracks">
    <TrackTable suggestion/>
  </DefaultContainer>
  <DefaultContainer v-else-if="user.role='scientist'" title="Liste des Tracks">
    <TrackTable suggestion="false"/>
  </DefaultContainer>
  <div v-else >
    <DefaultContainer title="Liste des Tracks Suggestion">
      <TrackTable suggestion/>
    </DefaultContainer>

    <DefaultContainer title="Liste des Tracks analyse">
      <TrackTable suggestion="false"/>
    </DefaultContainer>

  </div>
  {{user.role}}

  <DefaultContainer v-if="user.role != 'citizen'" title="Liste des Pays">
    <ChartTest/>
  </DefaultContainer>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Button from 'primevue/button'
import {useUser} from "../composition/user/index.js";
import Maps from "../components/Maps.vue";
import ChartTest from "../components/ChartTest.vue";
import MainMenu from "../components/MainMenu.vue";
import TrackTable from "../composition/track/TrackTable.vue";
import DefaultContainer from "../components/DefaultContainer.vue";

const { user, isLoggedIn } = useUser()



const onClick = () => {
  console.log('user ',user)
  alert('Bouton cliqué !')
}

onMounted(()=>{
  console.log('user.value.role',user.value.role)
})
</script>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
