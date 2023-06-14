<template>
    <div class="container">
        <h1 v-if="isLoggedIn" class="header">Witaj, {{ username }}!</h1>
        <h1 v-else class="header">Witaj na naszej stronie!</h1>
        <p>Witamy na stronie głównej. Odkryj nasze możliwości, dołącz do grupy lub stwórz swoją własną.</p>
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
