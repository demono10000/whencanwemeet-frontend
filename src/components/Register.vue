<template>
    <div class="container">
        <h1 class="header">Register</h1>
        <form @submit.prevent="submit" class="form">
            <label>
                Username:
                <input type="text" v-model="user.username" placeholder="Username" required>
            </label>
            <label>
                Password:
                <input type="password" v-model="user.password" placeholder="Password" required>
            </label>
            <button type="submit" class="submit-btn">Submit</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
        };
    },
    computed: {
        ...mapState(['message'])
    },
    methods: {
        ...mapActions(['register']),
        submit() {
            this.register(this.user)
                .catch(err => {
                    console.error(err);
                });
        }
    }
};
</script>
