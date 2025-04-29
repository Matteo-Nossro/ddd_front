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
              @click.prevent="e => { props.action.onClick?.(e); navigate(e) }"
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

// 1) On doit utiliser **exactement** les mêmes noms que dans src/router/routes.ts
//    → on se réfère aux **names** des routes, pas aux chemins en dur.
const allMenuItems = [
  { label: 'Accueil',       icon: 'pi pi-home',      route: { name: 'Home' } },
  { label: 'Maps',          icon: 'pi pi-map',       route: { name: 'Maps' } },
  { label: 'Test',          icon: 'pi pi-cog',       route: { name: 'test' } },
  { label: 'Dashboard',     icon: 'pi pi-users',     route: { name: 'UserDashboard' }, allowedRoles: ['admin'] },
  { label: 'Connexion',     icon: 'pi pi-sign-in',   route: { name: 'Login' },       allowedRoles: ['guest'] },
  { label: 'Inscription',   icon: 'pi pi-user-plus', route: { name: 'Register' },    allowedRoles: ['guest'] },
  // pas de allowedRoles ⇒ tout le monde y a accès
]

// 2) Récupération de l’état utilisateur
const { user, isLoggedIn } = useUser()

// 3) Filtrage réactif
const filteredMenu = computed(() => {
  const role = isLoggedIn.value ? user.value.role : 'guest'
  return allMenuItems.filter(item => {
    // si pas de clé allowedRoles OU tableau vide → accessible à tous
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true
    }
    return item.allowedRoles.includes(role)
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

