<template>
    <div id="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link">Register</router-link>
        <router-link v-if="isLoggedIn" to="/create-group" class="nav-link">Create group</router-link>
        <router-link v-if="isLoggedIn" to="/groups" class="nav-link">Your groups</router-link>
        <router-link v-if="isLoggedIn" to="/invites" class="nav-link">Invitations</router-link>
        <router-link v-if="isLoggedIn" to="/unavailabilities" class="nav-link">Unavailabilities</router-link>
        <button v-if="isLoggedIn" @click="logout" class="nav-link nav-button">Logout</button>
    </div>
    <router-view/>
</template>

<style>
#nav {
    padding: 20px;
    background-color: #0067e6;
    box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Arial, sans-serif;
}

.nav-link {
    margin: 0 10px;
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #dddddd;
}

.nav-button {
    background-color: #ff3333;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.nav-button:hover {
    background-color: #cc0000;
}
.nav-link-invitation {
    color: #0067e6;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-link-invitation:hover {
    color: #004499;
}
.container {
    max-width: 1000px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.header, .sub-header {
    color: #eeeeee;
}

.group-info {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    color: #333;
}

.list-container {
    margin-bottom: 20px;
}

.list {
    list-style-type: none;
    padding: 0;
}

.form {
    margin-bottom: 20px;
}

.submit-btn {
    background-color: #007BFF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #0056b3;
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
        '$route': function() {
            const token = localStorage.getItem('token');
            this.$store.commit('setLoggedIn', !!token);
            if (token) {
                this.$store.commit('setUsername', localStorage.getItem('username'));
                this.$store.commit('setUserId', localStorage.getItem('userId'));
            }
        }
    }
}
</script>


