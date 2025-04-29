<template>
  <section class="menu-container">
    <Menu :model="filteredMenuItems" :style="{ border: 'none' }">
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menu>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import Menu from "primevue/menu";

const menuItems = ref([
  {
    label: "Accueil",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "Page de test",
    icon: "pi pi-link",
    route: "/test",
  },
  {
    label: "Test de map",
    icon: "pi pi-clipboard",
    route: "/maps",
  },
  {
    label: "Gestions des utilisateurs / permissions",
    icon: "pi pi-key",
    route: "/admin/users",
    permission: ["Consultation des rôles", "Consultation des permissions"],
  },
]);

// Computed pour filtrer les éléments du menu selon les permissions
// const filteredMenuItems = computed(() => {
// 	return menuItems.value.filter(item => {
// 		if (!item.permission) return true;
// 		return hasPermission(item.permission);
// 	});
// });
const filteredMenuItems = computed(() => {
  return menuItems.value;
});
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
