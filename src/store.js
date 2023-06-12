import { createStore } from 'vuex';
import axios from 'axios';
import router from './router/router.js'

export default createStore({
    state: {
        isLoggedIn: false,
        username: '',
    },
    mutations: {
        setLoggedIn(state, value) {
            state.isLoggedIn = value;
        },
        setUsername(state, value) {
            state.username = value;
        }
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
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                commit('setLoggedIn', true);
                commit('setUsername', response.data.username);
                router.push('/');
            } catch (error) {
                console.error('Błąd logowania:', error);
            }
        },
        logout({ commit }) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            commit('setLoggedIn', false);
            router.push('/login');
        }
    }
});
