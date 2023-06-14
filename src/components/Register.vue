<template>
    <div class="container">
        <h1 class="header">Rejestracja</h1>
        <form @submit.prevent="submit" class="form">
            <label>
                Nazwa użytkownika:
                <input type="text" v-model="user.username">
            </label>
            <label>
                Hasło:
                <input type="password" v-model="user.password">
            </label>
            <button type="submit" class="submit-btn">Zarejestruj</button>
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
