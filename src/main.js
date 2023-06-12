import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from "axios";
import store from './store';

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createApp(App).use(router).use(store).mount('#app')

