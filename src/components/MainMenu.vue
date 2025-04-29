<!-- src/components/Menu.vue -->
<template>
  <section class="menu-container">
    <Menu :model="filteredMenu" :style="{ border: 'none' }">
      <template #item="{ item, props }">
        <router-link
            v-if="item.route"
            custom
            v-slot="{ href, navigate }"
            :to="item.route"
        >
          <a
              :href="href"
              v-bind="props.action"
              @click.prevent="(e) => { props.action.onClick?.(e); navigate(); }"
              class="flex items-center p-2 hover:bg-gray-100 rounded"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a
            v-else
            :href="item.url"
            v-bind="props.action"
            class="flex items-center p-2 hover:bg-gray-100 rounded"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Menu from 'primevue/menu'
import {useUser} from "../composition/user/index.js";

// 1) Définition des items, avec requiresAuth et allowedRoles
const allMenuItems = [
  { label: 'Accueil',     icon: 'pi pi-home',      route: { name: 'Home' },           requiresAuth: true },
  {
    label: 'Dashboard',   icon: 'pi pi-users',     route: { name: 'UserDashboard' },  requiresAuth: true,
    allowedRoles: ['admin']
  },
  // ces deux-là restent libre accès
  { label: 'Connexion',   icon: 'pi pi-sign-in',   route: { name: 'Login' },          requiresAuth: false },
  { label: 'Inscription', icon: 'pi pi-user-plus', route: { name: 'Register' },       requiresAuth: false },
]

// 2) On récupère l’état utilisateur
const { user, isLoggedIn } = useUser()

// 3) Filtrage : auth d’abord, puis rôle
const filteredMenu = computed(() => {
  const role = isLoggedIn.value ? user.value.role : 'guest'

  return allMenuItems.filter(item => {
    // a) si la page demande auth et qu’on n’est pas connecté → hide
    if (item.requiresAuth && !isLoggedIn.value) {
      return false
    }
    // b) si des rôles sont définis et que le user n’y est pas → hide
    if (item.allowedRoles && !item.allowedRoles.includes(role)) {
      return false
    }
    // sinon → show
    return true
  })
})
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
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02),
  0px 0px 2px rgba(0, 0, 0, 0.05),
  0px 1px 4px rgba(0, 0, 0, 0.08);
  .p-menu { border: none !important; }
}
.leave-active,
.leave-out {
  transform: translateX(-120%);
  opacity: 0;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}
</style>
