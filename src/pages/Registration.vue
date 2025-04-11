<template>
  <div class="registration-container">
    <h2>Inscription</h2>
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
      <label for="email">Adresse e-mail</label>
      <InputText id="email" v-model="email" placeholder="Entrez votre e-mail" />
      <span v-if="emailError" class="error">{{ emailError }}</span>
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <Password
        id="password"
        v-model="password"
        placeholder="Entrez votre mot de passe"
        feedback="false"
      />
      <span v-if="passwordError" class="error">{{ passwordError }}</span>
    </div>

    <div class="form-group">
      <label for="password2">Confirmez le mot de passe</label>
      <Password
        id="password2"
        v-model="password2"
        placeholder="Confirmez votre mot de passe"
        feedback="false"
      />
      <span v-if="password2Error" class="error">{{ password2Error }}</span>
    </div>

    <div class="form-group">
      <label for="role">Choisissez votre rôle</label>
      <select id="role" v-model="role">
        <option value="citizen">Citizen</option>
        <option value="scientist">Scientist</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <Button
      label="S'inscrire"
      class="p-button-primary"
      @click="handleRegister"
    />

    <div v-if="registrationError" class="error" style="margin-top: 1rem">
      {{ registrationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

// Champs du formulaire
const username = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const role = ref("citizen");

// Champs d'erreur
const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const password2Error = ref("");
const registrationError = ref("");

async function handleRegister() {
  // Réinitialiser les messages d'erreur
  usernameError.value = "";
  emailError.value = "";
  passwordError.value = "";
  password2Error.value = "";
  registrationError.value = "";

  // Validation simple des champs
  if (!username.value.trim()) {
    usernameError.value = "Le nom d'utilisateur est obligatoire.";
  }
  if (!email.value.trim()) {
    emailError.value = "L'adresse e-mail est obligatoire.";
  }
  if (!password.value.trim()) {
    passwordError.value = "Le mot de passe est obligatoire.";
  }
  if (!password2.value.trim()) {
    password2Error.value = "La confirmation du mot de passe est obligatoire.";
  }
  if (password.value !== password2.value) {
    password2Error.value = "Les mots de passe ne correspondent pas.";
  }
  if (
    usernameError.value ||
    emailError.value ||
    passwordError.value ||
    password2Error.value
  ) {
    return;
  }

  // Préparer les données pour l'API
  const data = {
    username: username.value,
    email: email.value,
    password: password.value,
    password2: password2.value,
    role: role.value,
  };

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/accounts/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      registrationError.value =
        errorData || "Une erreur s'est produite lors de l'inscription.";
      return;
    }

    const result = await response.json();
    console.log("Inscription réussie:", result);
    // Vous pouvez par la suite rediriger l'utilisateur ou afficher un message de succès
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    registrationError.value =
      "Une erreur est survenue lors de la connexion au serveur.";
  }
}
</script>

<style scoped>
.registration-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error {
  color: red;
  font-size: 0.875rem;
}
</style>
