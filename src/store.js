import { createStore } from 'vuex';
import axios from 'axios';
import router from './router/router.js'

export default createStore({
    state: {
        isLoggedIn: false,
        username: '',
        groups: [],
        userId: '',
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
                console.error('Błąd logowania:', error);
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
                console.error('Błąd pobierania grup:', error);
            }
        }
    }
});
