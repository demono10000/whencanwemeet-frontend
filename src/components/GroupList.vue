<template>
    <div class="container">
        <h2 class="header">Twoje grupy</h2>
        <ul class="list">
            <li v-for="group in groups" :key="group.id">
                <router-link :to="`/group/${group.id}`" class="nav-link">{{ group.name }}</router-link>
            </li>
        </ul>
    </div>
</template>


<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters(['groups'])
    },
    methods: {
        ...mapActions(['fetchGroups'])
    },
    created() {
        this.fetchGroups(); // Wywołaj akcję przy tworzeniu komponentu, aby pobrać grupy
    }
};
</script>
