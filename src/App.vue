<template>
  <Toast />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
import { onMounted } from "vue";
import { useAuth } from "./composition/auth";
import { useRouter } from "vue-router";

// Initialiser l'authentification au chargement de l'application
const router = useRouter();
const { checkAuthStatus } = useAuth();

onMounted(() => {
  checkAuthStatus();
});
</script>

<style scoped></style>
