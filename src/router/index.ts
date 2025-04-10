// router/index.ts ou index.js
import Home from '../pages/Home.vue'
import Login from "../pages/Login.vue";

export default [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]
