<template>
    <div class="container">
        <h2 class="header">Your groups</h2>
        <ul class="group-list">
            <router-link class="group-item" v-for="group in groups" :key="group.id" :to="`/group/${group.id}`">
                <li class="group-link">{{ group.name }}</li>
            </router-link>
        </ul>
    </div>
</template>

<style scoped>
.group-list {
    padding: 0;
    list-style-type: none;
}

.group-item {
    display: block;
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.group-item:hover {
    background-color: #eaeaea;
}

.group-link {
    color: #333333;
    font-weight: bold;
    transition: color 0.3s;
}

.group-link:hover {
    color: #007BFF;
}
</style>

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
        this.fetchGroups();
    }
};
</script>
