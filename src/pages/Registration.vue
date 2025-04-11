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
        toggleMask
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
        toggleMask
      />
      <span v-if="password2Error" class="error">{{ password2Error }}</span>
    </div>

    <div class="form-group">
      <label for="role">Choisissez votre rôle</label>
      <Dropdown
        id="role"
        v-model="role"
        :options="roleOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Sélectionnez un rôle"
        class="w-full"
      />
    </div>

    <Button
      label="S'inscrire"
      class="p-button-primary"
      @click="handleRegister"
      :loading="loading"
    />

    <!-- Lien vers la page de connexion -->
    <p style="margin-top: 1rem">
      Déjà un compte ?
      <router-link to="/login">Connectez-vous ici</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const loading = ref(false);

// Champs du formulaire
const username = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const role = ref("citizen");

// Options pour le dropdown des rôles
const roleOptions = [
  { label: "Citizen", value: "citizen" },
  { label: "Scientist", value: "scientist" },
  { label: "Admin", value: "admin" },
];

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
  } else if (!isValidEmail(email.value)) {
    emailError.value = "Veuillez entrer une adresse e-mail valide.";
  }
  if (!password.value.trim()) {
    passwordError.value = "Le mot de passe est obligatoire.";
  } else if (password.value.length < 8) {
    passwordError.value =
      "Le mot de passe doit contenir au moins 8 caractères.";
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

  loading.value = true;

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/accounts/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      // Gestion des erreurs retournées par le backend
      if (typeof responseData === "object") {
        // Si le backend retourne des erreurs spécifiques aux champs
        if (responseData.username)
          usernameError.value = responseData.username[0];
        if (responseData.email) emailError.value = responseData.email[0];
        if (responseData.password)
          passwordError.value = responseData.password[0];
        if (responseData.non_field_errors)
          registrationError.value = responseData.non_field_errors[0];
      } else {
        registrationError.value =
          "Une erreur s'est produite lors de l'inscription.";
      }
      loading.value = false;
      return;
    }

    // Inscription réussie : Afficher le toast de succès et rediriger
    toast.add({
      severity: "success",
      summary: "Inscription réussie",
      detail:
        "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      life: 3000,
    });

    // Redirection vers la page de login
    router.push("/login");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    toast.add({
      severity: "error",
      summary: "Erreur d'inscription",
      detail: "Une erreur est survenue lors de la connexion au serveur.",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

// Fonction de validation d'email basique
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
</script>

<style scoped>
.registration-container {
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

:deep(.p-dropdown) {
  width: 100%;
}
</style>
