<template>
    <div class="container">
        <h1 class="header">Login</h1>
        <form @submit.prevent="handleSubmit" class="form">
            <label>
                Username:
                <input v-model="username" type="text" placeholder="Username" required />
            </label>
            <label>
                Password:
                <input v-model="password" type="password" placeholder="Password" required />
            </label>
            <button type="submit" class="submit-btn">Login</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    computed: {
        ...mapState(['message']),
    },
    methods: {
        ...mapActions(['login', 'clearMessage']),
        handleSubmit() {
            this.login({ username: this.username, password: this.password });
        }
    },
    beforeRouteLeave(to, from, next) {
        this.clearMessage();
        next();
    },
};
</script>
