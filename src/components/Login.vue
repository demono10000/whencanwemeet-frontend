<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
    </form>
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
