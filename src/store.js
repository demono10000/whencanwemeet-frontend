import { createStore } from 'vuex';
import axios from 'axios';
import router from './router/router.js'

export default createStore({
    state: {
        isLoggedIn: false,
        username: '',
        groups: [],
        userId: '',
        message: ''
    },
    mutations: {
        setLoggedIn(state, value) {
            state.isLoggedIn = value;
        },
        setUsername(state, value) {
            state.username = value;
        },
        setGroups(state, groups) {
            state.groups = groups;
        },
        setUserId(state, value) {
            state.userId = value;
        },
        setMessage(state, message) {
            state.message = message;
        }
    },
    getters: {
        groups: state => state.groups,
    },
    actions: {
        async login({ commit }, { username, password }) {
            try {
                const response = await axios.post('http://localhost:8080/api/login',
                    `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                const token = response.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('userId', response.data.id);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                commit('setLoggedIn', true);
                commit('setUsername', response.data.username);
                commit('setUserId', response.data.id);
                router.push('/');
            } catch (error) {
                commit('setMessage', error.response.data.message || "Login error");
            }
        },
        logout({ commit }) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            delete axios.defaults.headers.common['Authorization'];
            commit('setLoggedIn', false);
            router.push('/login');
        },
        async fetchGroups({ commit }) {
            try {
                const response = await axios.post('http://localhost:8080/api/group/groups');
                const groups = response.data;
                commit('setGroups', groups);
            } catch (error) {
                console.error('Group download error:', error);
            }
        },
        async register({ commit }, user) {
            try {
                const response = await axios.post('http://localhost:8080/api/register', user);
                if (response.data.status) {
                    commit('setMessage', "");
                    router.push('/login');
                } else {
                    commit('setMessage', response.data.message);
                }
            } catch (error) {
                console.error(error);
                commit('setMessage', "An error occurred during registration. Please try again.");
            }
        },
        clearMessage({ commit }) {
            commit('setMessage', '');
        },
    }
});
