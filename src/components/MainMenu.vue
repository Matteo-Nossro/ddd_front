<!-- src/components/Menu.vue -->
<template>
  <section class="menu-container">
    <Menu :model="primeMenuItems" :style="{ border: 'none' }">
      <template #item="{ item, props }">
        <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
        >
          <a :href="href" v-bind="props.action" @click="navigate" class="flex items-center p-2 hover:bg-gray-100 rounded">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menu>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Menu from 'primevue/menu'
import {useUser} from "../composition/user/index.js";

// 1) Déclaration de tous les items avec, éventuellement, allowedRoles
const allMenuItems = [
  { label: 'Accueil',   icon: 'pi pi-home',    route: '/',         allowedRoles: [] },
  { label: 'Profil',    icon: 'pi pi-user',    route: '/profile',  allowedRoles: ['user','admin'] },
  { label: 'Admin',     icon: 'pi pi-shield',  route: '/admin',    allowedRoles: ['admin'] },
  { label: 'Connexion', icon: 'pi pi-sign-in', route: '/login',    allowedRoles: ['guest'] },
  { label: 'À propos',  icon: 'pi pi-info',    route: '/about' }  // pas de allowedRoles => tout le monde
]

// 2) Récupération de l’état utilisateur
const { user, isLoggedIn } = useUser()

// 3) Filtrage dynamique selon le rôle (par défaut 'guest' si non-connecté)
const filteredMenu = computed(() => {
  const role = isLoggedIn.value ? user.value.role : 'guest'
  return allMenuItems.filter(item => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true
    }
    return item.allowedRoles.includes(role)
  })
})

// 4) Adaptation au modèle attendu par PrimeVue (<Menu :model="...">)
const primeMenuItems = computed(() =>
    filteredMenu.value.map(item => ({
      label: item.label,
      icon:  item.icon,
      command: () => {},    // on n'utilise pas command ici, on passe par router-link
      route: item.route
    }))
)
</script>

<style scoped lang="scss">
.menu-container {
  position: fixed;
  width: 280px;
  height: calc(100vh - 9rem);
  background-color: white;
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 7rem;
  left: 2rem;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
  border-radius: 6px;
  //padding: 0.5rem 1.5rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
  0px 1px 4px rgba(0, 0, 0, 0.08);
  .p-menu {
    border: none !important;
  }
}
.leave-active,
.leave-out {
  transform: translateX(-120%); /* Translate to the left */
  opacity: 0; /* Fade out */
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}
</style>

