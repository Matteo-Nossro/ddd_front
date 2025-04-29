// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import routes from "./routes";
import { useAuth } from "../composition/auth";
import { useUser } from "../composition/user";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation global
router.beforeEach((to, from, next) => {
  // Si la route nécessite une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // const { checkAuthStatus } = useAuth();
    const { user,isLoggedIn } = useUser();

    // Vérifier si l'utilisateur est connecté
    if (!isLoggedIn) {
      // Rediriger vers la page de connexion avec le chemin cible pour retour après connexion
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Vérifier si la route nécessite des droits d'admin
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      // Vérifier si l'utilisateur est un admin
      if (user.value.role !== "admin") {
        // Si non admin, rediriger vers la page d'accueil
        next({ name: "Home" });
        return;
      }
    }
  }

  // Si tout est ok ou si la route ne nécessite pas d'authentification, continuer
  next();
});

export default router;
