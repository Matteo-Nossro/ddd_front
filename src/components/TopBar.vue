<template>
  <div class="topbar">
    <div class="menu_icon">
      <img src="../assets/ddd_logo.png" class="lmh-icon" alt="Logo" />
    </div>

    <div v-if="isLoggedIn" class="user-info">
      <span>{{ user?.username }} ({{ user?.role }})</span>
      <Button label="Déconnexion" class="logout-button" @click="handleLogout" />
    </div>

    <div v-else class="login-link">
      <router-link to="/login">Se connecter</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "../composition/user";
import { useAuth } from "../composition/auth"; // Importez le nouveau hook
import Button from "primevue/button";

const { user, isLoggedIn } = useUser();
const { logout } = useAuth(); // Utilisez la fonction de déconnexion du hook auth

function handleLogout() {
  logout();
}
</script>
<style scoped lang="scss">
.topbar {
  height: 80px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 900;

  .menu_icon {
    .lmh-icon {
      height: 56px;
      margin-left: 2rem;
    }
  }

  .user-info {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    color: #333;
  }

  .login-link {
    margin-left: auto;
    font-size: 1rem;
    a {
      text-decoration: none;
      color: #007bff;
    }
  }

  .logout-button {
    /* Vous pouvez ajouter ici des styles spécifiques pour le bouton de déconnexion */
  }
}
</style>
