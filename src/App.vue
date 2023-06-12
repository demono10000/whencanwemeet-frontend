<template>
    <div id="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link">Register</router-link>
        <router-link v-if="isLoggedIn" to="/create-group" class="nav-link">Utwórz grupę</router-link>
        <button v-if="isLoggedIn" @click="logout" class="nav-link">Wyloguj się</button>
    </div>
    <router-view/>
</template>

<style>
#nav {
    padding: 30px;
    background-color: #0067e6;
}
.nav-link {
    margin: 0 10px;
}
</style>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState(['isLoggedIn']),
    },
    methods: {
        ...mapActions(['logout'])
    },
    watch: {
        // Obserwujemy zmiany na ścieżce $route, aby zaktualizować stan zalogowania
        // po zmianie strony
        '$route': function() {
            this.isLoggedIn = !!localStorage.getItem('token');
        }
    }
}
</script>

