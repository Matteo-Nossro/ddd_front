<template>
  <div class="admin-dashboard">
    <h1>Gestion des utilisateurs / permissions</h1>

    <!-- Carte des statistiques -->
    <div class="stats-container" v-if="stats">
      <div class="stat-card">
        <h3>Total Utilisateurs</h3>
        <div class="stat-value">{{ stats.total_users }}</div>
      </div>
      <div class="stat-card">
        <h3>Utilisateurs Actifs</h3>
        <div class="stat-value">{{ stats.active_users }}</div>
      </div>
      <div class="stat-card">
        <h3>Utilisateurs Inactifs</h3>
        <div class="stat-value">{{ stats.inactive_users }}</div>
      </div>
    </div>

    <!-- Distribution des rôles -->
    <div class="role-distribution" v-if="stats && stats.role_distribution">
      <h2>Distribution des Rôles</h2>
      <div class="role-chart">
        <div
          v-for="role in stats.role_distribution"
          :key="role.name"
          class="role-bar"
          :style="{ width: `${(role.user_count / stats.total_users) * 100}%` }"
        >
          <span class="role-name">{{ role.name }}</span>
          <span class="role-count">{{ role.user_count }}</span>
        </div>
      </div>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="users-list-container">
      <h2>Liste des Utilisateurs</h2>
      <div class="actions">
        <InputText
          v-model="searchQuery"
          placeholder="Rechercher des utilisateurs..."
          class="search-input"
        />
      </div>

      <DataTable
        :value="filteredUsers"
        :paginator="true"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        filterDisplay="menu"
        :loading="loading"
      >
        <Column field="username" header="Nom d'utilisateur" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="role" header="Rôle" sortable>
          <template #body="{ data }">
            <Tag
              :value="data.role"
              :severity="getRoleSeverity(data.role)"
            ></Tag>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Dropdown
              v-model="filterModel.value"
              :options="roleOptions"
              placeholder="Sélectionner un rôle"
              class="p-column-filter"
              @change="filterCallback()"
            ></Dropdown>
          </template>
        </Column>
        <Column field="date_joined" header="Date d'inscription" sortable>
          <template #body="{ data }">
            {{ new Date(data.date_joined).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="is_active" header="Statut" sortable>
          <template #body="{ data }">
            <Tag
              :value="data.is_active ? 'Actif' : 'Inactif'"
              :severity="data.is_active ? 'success' : 'danger'"
            ></Tag>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-warning p-button-sm"
                @click="editUser(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm"
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialogue d'édition utilisateur -->
    <Dialog
      v-model:visible="editDialog"
      header="Modifier l'utilisateur"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div class="p-fluid" v-if="selectedUser">
        <div class="field">
          <label for="username">Nom d'utilisateur</label>
          <InputText
            id="username"
            v-model="selectedUser.username"
            :disabled="true"
          />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model="selectedUser.email" />
        </div>
        <div class="field">
          <label for="role">Rôle</label>
          <Dropdown
            id="role"
            v-model="selectedUser.role"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner un rôle"
          />
        </div>
        <div class="field">
          <label for="status">Statut</label>
          <Dropdown
            id="status"
            v-model="selectedUser.is_active"
            :options="[
              { label: 'Actif', value: true },
              { label: 'Inactif', value: false },
            ]"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner un statut"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Annuler"
          icon="pi pi-times"
          class="p-button-text"
          @click="cancelEdit"
        />
        <Button
          label="Enregistrer"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveUser"
          :loading="saving"
        />
      </template>
    </Dialog>

    <!-- Dialogue de confirmation de suppression -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirmation"
      :style="{ width: '450px' }"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="selectedUser"
          >Êtes-vous sûr de vouloir supprimer l'utilisateur
          <b>{{ selectedUser.username }}</b> ?</span
        >
      </div>
      <template #footer>
        <Button
          label="Non"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteDialog = false"
        />
        <Button
          label="Oui"
          icon="pi pi-check"
          class="p-button-text p-button-danger"
          @click="deleteSelectedUser"
          :loading="deleting"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  getUsers,
  getUserStats,
  updateUser,
  deleteUser,
} from "../services/userService";
import { useToast } from "primevue/usetoast";
// PrimeVue Components
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";

// État des données
const users = ref([]);
const stats = ref(null);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const searchQuery = ref("");

// État des dialogues
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedUser = ref(null);

// Options de filtre et de rôle
const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Scientist", value: "scientist" },
  { label: "Citizen", value: "citizen" },
  { label: "Sans rôle", value: "no_role" },
];

// Configuration des filtres
const filters = ref({
  role: { value: null, matchMode: "equals" },
});

const toast = useToast();

// Computed pour filtrer les utilisateurs
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Chargement des données
onMounted(async () => {
  try {
    // Charger les utilisateurs et les statistiques en parallèle
    const [usersData, statsData] = await Promise.all([
      getUsers(),
      getUserStats(),
    ]);

    users.value = usersData;
    stats.value = statsData;
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible de charger les données des utilisateurs",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});

// Actions sur les utilisateurs
function editUser(user) {
  selectedUser.value = { ...user };
  editDialog.value = true;
}

function confirmDelete(user) {
  selectedUser.value = user;
  deleteDialog.value = true;
}

async function saveUser() {
  if (!selectedUser.value) return;

  saving.value = true;
  try {
    const updatedUser = await updateUser(selectedUser.value.id, {
      email: selectedUser.value.email,
      role: selectedUser.value.role,
      is_active: selectedUser.value.is_active,
    });

    // Mettre à jour l'utilisateur dans la liste
    const index = users.value.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }

    toast.add({
      severity: "success",
      summary: "Succès",
      detail: `L'utilisateur ${updatedUser.username} a été mis à jour`,
      life: 3000,
    });

    // Recharger les statistiques
    stats.value = await getUserStats();
    editDialog.value = false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: error.message || "Erreur lors de la mise à jour de l'utilisateur",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

function cancelEdit() {
  selectedUser.value = null;
  editDialog.value = false;
}

async function deleteSelectedUser() {
  if (!selectedUser.value) return;

  deleting.value = true;
  try {
    await deleteUser(selectedUser.value.id);

    // Supprimer l'utilisateur de la liste
    users.value = users.value.filter((u) => u.id !== selectedUser.value.id);

    toast.add({
      severity: "success",
      summary: "Succès",
      detail: `L'utilisateur ${selectedUser.value.username} a été supprimé`,
      life: 3000,
    });

    // Recharger les statistiques
    stats.value = await getUserStats();
    deleteDialog.value = false;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur lors de la suppression de l'utilisateur",
      life: 3000,
    });
  } finally {
    deleting.value = false;
    selectedUser.value = null;
  }
}

// Utilitaires
function getRoleSeverity(role) {
  const severities = {
    admin: "danger",
    scientist: "warning",
    citizen: "info",
    no_role: "secondary",
  };

  return severities[role] || "secondary";
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.stats-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2196f3;
}

.role-distribution {
  margin-bottom: 2rem;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.role-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: width 0.3s ease;
  min-width: 80px;
}

.role-name {
  font-weight: bold;
}

.users-list-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.search-input {
  width: 300px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}

:deep(.p-tag) {
  text-transform: capitalize;
}

:deep(.p-datatable-wrapper) {
  border-radius: 8px;
  overflow: hidden;
}

h1,
h2,
h3 {
  color: #333;
}
</style>
