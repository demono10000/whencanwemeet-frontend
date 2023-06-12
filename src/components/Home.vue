<template>
    <div>
        <h1 v-if="isLoggedIn">Witaj, {{ username }}!</h1>
        <h1 v-else>Witaj na naszej stronie!</h1>
        <p>Witamy na stronie głównej.</p>
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
