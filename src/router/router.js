import { createWebHistory, createRouter } from "vue-router";
import Register from "../components/Register.vue";
import CreateGroup from "../components/CreateGroup.vue";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";

const routes = [
    {
        path: "/register",
        name: "register",
        component: Register,
    },
    {
        path: '/create-group',
        name: 'CreateGroup',
        component: CreateGroup,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem('token')) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});


export default router;
