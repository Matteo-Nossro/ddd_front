// router/index.ts ou index.js
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Maps from "../components/Maps.vue";
import Test from "../pages/Test.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Register from "../pages/Registration.vue";

export default [
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
        path: "/maps",
        name: "Maps",
        component: Maps,
      },
      {
        path: "/test",
        name: "test",
        component: Test,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];
