<template>
    <div class="container">
        <h1 class="header">Create group</h1>
        <form @submit.prevent="submitForm" class="form">
            <input class="input-field" v-model="groupName" placeholder="Group name" required />
            <button type="submit" class="submit-btn">Create</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<style scoped>
.input-field {
    width: 50%;
    margin-bottom: 10px;
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            groupName: '',
            message: ''
        };
    },
    methods: {
        submitForm() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You are not logged in!');
                return;
            }

            axios.post('http://localhost:8080/api/group/create', {
                groupName: this.groupName
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then((response) => {
                    if (response.data.status) {
                        alert('The group was created.');
                        this.groupName = '';
                    }
                    this.message = response.data.message;

                })
                .catch(error => {
                    this.message = 'An error occurred while creating the group. Try again.';
                });
        },
    },
};
</script>
