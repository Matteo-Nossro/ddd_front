// src/composition/user/index.js (ou index.ts)
import { reactive, toRefs } from "vue";

// Cet état sera partagé entre tous les composants qui importent useUser
const state = reactive({
  user: null,
  isLoggedIn: false,
});

function setUser(newUser) {
  state.user = newUser;
  state.isLoggedIn = true;
  console.log("setUser:", state.user); // Vérifiez ici
}

function clearUser() {
  state.user = null;
  state.isLoggedIn = false;
}

export function useUser() {
  return { ...toRefs(state), setUser, clearUser };
}
