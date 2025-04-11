<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <div class="form-group">
      <label for="username">Nom d'utilisateur</label>
      <InputText
        id="username"
        v-model="username"
        placeholder="Entrez votre nom d'utilisateur"
      />
      <span v-if="usernameError" class="error">{{ usernameError }}</span>
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <Password
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe"
        feedback="false"
        toggleMask
      />
      <span v-if="passwordError" class="error">{{ passwordError }}</span>
    </div>

    <Button
      label="Se connecter"
      class="p-button-primary"
      @click="handleLogin"
      :loading="loading"
    />

    <!-- Lien vers la page d'inscription -->
    <p style="margin-top: 1rem">
      Pas de compte ?
      <router-link to="/Register">Inscrivez-vous ici</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { useUser } from "../composition/user";
import { jwtDecode } from "jwt-decode";

// Champs du formulaire
const username = ref("");
const password = ref("");
const loading = ref(false);

// Champs d'erreur (pour validations locales)
const usernameError = ref("");
const passwordError = ref("");

const router = useRouter();
const toast = useToast();
const { setUser } = useUser();

async function handleLogin() {
  // Réinitialiser les messages d'erreur
  usernameError.value = "";
  passwordError.value = "";

  // Validation simple des champs
  if (!username.value.trim()) {
    usernameError.value = "Le nom d'utilisateur est obligatoire.";
  }
  if (!password.value.trim()) {
    passwordError.value = "Le mot de passe est obligatoire.";
  }
  if (usernameError.value || passwordError.value) {
    return;
  }

  const data = {
    username: username.value,
    password: password.value,
  };

  loading.value = true;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/accounts/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.add({
        severity: "error",
        summary: "Erreur de connexion",
        detail:
          errorData.detail || "Une erreur est survenue lors de la connexion.",
        life: 3000,
      });
      loading.value = false;
      return;
    }

    const tokenData = await response.json();
    // Stocker les tokens dans localStorage
    localStorage.setItem("access_token", tokenData.access);
    localStorage.setItem("refresh_token", tokenData.refresh);

    // Décode le token pour obtenir des informations sur l'utilisateur
    const decoded = jwtDecode<any>(tokenData.access);
    console.log("Token décodé :", decoded);

    // Récupérer les informations utilisateur du token
    setUser({
      username: decoded.username || username.value,
      role: decoded.role || "inconnu",
    });

    // Notification de succès
    toast.add({
      severity: "success",
      summary: "Connexion réussie",
      detail: `Bienvenue, ${decoded.username || username.value} !`,
      life: 3000,
    });

    // Redirection vers la page d'accueil
    router.push("/");
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    toast.add({
      severity: "error",
      summary: "Erreur de connexion",
      detail: "Une erreur est survenue lors de la connexion au serveur.",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.error {
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.p-button-primary {
  width: 100%;
  margin-top: 1rem;
}

:deep(.p-password input) {
  width: 100%;
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>
