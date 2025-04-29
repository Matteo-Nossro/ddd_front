<template>
  <MainMenu/>
  <div v-if="isLoggedIn">



  <!-- on ne montre ce container QUE si l'utilisateur existe et est citizen -->
  <DefaultContainer
      v-if="isLoggedIn && user.role === 'citizen'"
      title="Liste des Tracks"
  >
    <TrackTable suggestion/>
  </DefaultContainer>

  <!-- sinon si scientist -->
  <DefaultContainer
      v-else-if="isLoggedIn && user.role === 'scientist'"
      title="Liste des Tracks"
  >
    <TrackTable :suggestion="false"/>
  </DefaultContainer>

  <!-- sinon (guest ou autre) -->
  <div v-else>
    <DefaultContainer title="Liste des Tracks Suggestion">
      <TrackTable suggestion/>
    </DefaultContainer>
    <DefaultContainer title="Liste des Tracks analyse">
      <TrackTable :suggestion="false"/>
    </DefaultContainer>
  </div>
  </div>
  <div v-else>
    Veuillez vous connecter

    <DefaultButton @click="redirectToLogin">
      Se connecter
    </DefaultButton>

  </div>
</template>

<script setup>
import {useUser} from "../composition/user/index.js";
import MainMenu from "../components/MainMenu.vue";
import TrackTable from "../composition/track/TrackTable.vue";
import DefaultContainer from "../components/DefaultContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import {useRoute, useRouter} from "vue-router";

const { user, isLoggedIn } = useUser()
const router = useRouter()
const route = useRoute()
const redirectToLogin = () => {
  router.push({
    name: 'Login',
    query: { redirect: route.fullPath }
  })
}
</script>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
