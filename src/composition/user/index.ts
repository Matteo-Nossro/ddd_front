// src/composition/user/index.js
import { reactive, toRefs } from "vue";

// On crée un objet réactif global
const state = reactive({
  user: null,
  isLoggedIn: false,
});

function setUser(newUser) {
  state.user = newUser;
  state.isLoggedIn = true;
}

function clearUser() {
  state.user = null;
  state.isLoggedIn = false;
}

export function useUser() {
  return { ...toRefs(state), setUser, clearUser };
}
