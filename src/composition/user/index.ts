import { ref, computed } from 'vue'

/**
 * Interface décrivant la forme d'un utilisateur
 */
export interface User {
    email: string
    password: string
    role: string
}

/**
 * État global pour stocker l'utilisateur (accessible à toute l'appli).
 */
const userState = ref<User | null>(null)

/**
 * Hook (composition function) pour manipuler l'utilisateur dans toute l'app.
 */
export function useUser() {
    /**
     * Met à jour l'utilisateur (ex: après connexion).
     */
    const setUser = (newUser: User) => {
        userState.value = newUser
    }

    /**
     * Réinitialise l'utilisateur (ex: après déconnexion).
     */
    const clearUser = () => {
        userState.value = null
    }

    /**
     * Indique si un utilisateur est actuellement connecté.
     */
    const isLoggedIn = computed(() => userState.value !== null)

    return {
        user: userState, // on expose la référence elle-même
        isLoggedIn,
        setUser,
        clearUser
    }
}
