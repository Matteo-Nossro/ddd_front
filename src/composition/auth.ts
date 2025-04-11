import { jwtDecode } from "jwt-decode";
import { useUser } from "./user";
import { useRouter } from "vue-router";

export function useAuth() {
  const { setUser, clearUser } = useUser();
  const router = useRouter();

  function checkAuthStatus() {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // Vérifier si le token n'est pas expiré
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          setUser({
            username: decoded.username || "Utilisateur",
            role: decoded.role || "inconnu",
          });
          return true;
        } else {
          // Token expiré
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          clearUser();
          return false;
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        clearUser();
        return false;
      }
    }
    return false;
  }

  // Fonction pour rafraîchir le token
  async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        return true;
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        clearUser();
        return false;
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
  }

  // Fonction de déconnexion
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearUser();
    router.push("/login");
  }

  return {
    checkAuthStatus,
    refreshToken,
    logout,
  };
}
