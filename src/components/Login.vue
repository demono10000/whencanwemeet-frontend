<template>
    <div class="container">
        <h1 class="header">Logowanie</h1>
        <form @submit.prevent="handleSubmit" class="form">
            <input v-model="username" type="text" placeholder="Username" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit" class="submit-btn">Login</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        ...mapActions(['login']),
        handleSubmit() {
            this.login({ username: this.username, password: this.password });
        }
    },
    // ...
};
</script>
