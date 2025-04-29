// src/router/routes.ts
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Maps from "../components/Maps.vue";
import Test from "../pages/Test.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Register from "../pages/Registration.vue";
import UserDashboard from "../pages/UserDashboard.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/maps",
        name: "Maps",
        component: Maps,
      },
      {
        path: "/test",
        name: "test",
        component: Test,
      },
      {
        path: "/admin/users",
        name: "UserDashboard",
        component: UserDashboard,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

export default routes;
