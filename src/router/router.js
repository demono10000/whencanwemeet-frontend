import { createWebHistory, createRouter } from "vue-router";
import Register from "../components/Register.vue";
import CreateGroup from "../components/CreateGroup.vue";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import GroupList from "@/components/GroupList.vue";
import GroupDetails from "@/components/GroupDetails.vue";
import Invites from "@/components/Invites.vue";
import Unavailabilities from "@/components/Unavailabilities.vue";

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
    {
        path: '/groups',
        name: 'GroupList',
        component: GroupList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/group/:id',
        name: 'GroupDetails',
        component: GroupDetails,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/invites',
        name: 'Invites',
        component: Invites,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/unavailabilities',
        name: 'Unavailabilities',
        component: Unavailabilities,
        meta: {
            requiresAuth: true
        }
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
