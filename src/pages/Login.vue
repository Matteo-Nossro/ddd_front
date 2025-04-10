<template>
  <div class="login-container">
    <h2>Connexion</h2>

    <div class="form-group">
      <label for="email">Adresse e-mail</label>
      <InputText
          id="email"
          v-model="email"
          placeholder="Entrez votre adresse e-mail"
      />
      <!-- Message d'erreur spécifique à l'e-mail -->
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
      <!-- Message d'erreur spécifique au mot de passe -->
      <span v-if="passwordError" class="error">{{ passwordError }}</span>
    </div>

    <Button label="Se connecter" class="p-button-primary" @click="handleLogin" />
  </div>

  <div style="margin-top: 2rem;">
    <p>Est connecté : {{ isLoggedIn }}</p>
    <p v-if="isLoggedIn">
      Bonjour, {{ user.email }} (rôle : {{ user.role }})
    </p>

    <button @click="handleLogout">Déconnexion</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useUser } from '../composition/user/index.js'

// Récupération du hook utilisateur
const { user, isLoggedIn, setUser, clearUser } = useUser()

// Champs du formulaire
const email = ref('')
const password = ref('')

// Champs d'erreur
const emailError = ref('')
const passwordError = ref('')

function handleLogin() {
  // On réinitialise les messages d'erreur
  emailError.value = ''
  passwordError.value = ''

  // Vérification des champs
  if (!email.value.trim()) {
    emailError.value = 'Adresse e-mail obligatoire.'
  }
  if (!password.value.trim()) {
    passwordError.value = 'Mot de passe obligatoire.'
  }

  // Si des erreurs sont présentes, on stoppe le processus
  if (emailError.value || passwordError.value) {
    return
  }

  // Si tout est OK, on "connecte" l'utilisateur (exemple)
  setUser({
    email: email.value,
    password: password.value,
    role: 'admin'
  })
}

function handleLogout() {
  clearUser()
}
</script>

<style scoped>
.login-container {
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

/* Style minimal pour l'affichage des erreurs */
.error {
  display: block;
  color: red;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}
</style>
