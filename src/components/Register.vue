<template>
    <div class="container">
        <h1 class="header">Rejestracja</h1>
        <form @submit.prevent="register" class="form">
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
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        };
    },
    methods: {
        async register() {
            try {
                const response = await axios.post('http://localhost:8080/api/register', this.user);
                console.log(response.data);
                // Zrób coś po pomyślnej rejestracji, np. przekieruj na stronę logowania
            } catch (error) {
                console.error(error);
                // Obsłuż błędy, np. pokaż użytkownikowi komunikat o błędzie
            }
        }
    }
};
</script>
