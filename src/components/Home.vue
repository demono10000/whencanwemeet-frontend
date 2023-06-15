<template>
    <div class="container">
        <h1 v-if="isLoggedIn" class="header">Hello, {{ username }}!</h1>
        <h1 v-else class="header">Welcome to our website!</h1>
        <p>Welcome to the home page. Discover our capabilities, join a group or create your own.</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['username', 'isLoggedIn'])
    }
};
</script>
