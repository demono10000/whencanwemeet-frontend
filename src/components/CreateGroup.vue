<template>
    <div class="container">
        <h1 class="header">Utwórz grupę</h1>
        <form @submit.prevent="submitForm" class="form">
            <input class="input-field" v-model="groupName" placeholder="Nazwa grupy" required />
            <button type="submit" class="submit-btn">Utwórz</button>
        </form>
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
        };
    },
    methods: {
        submitForm() {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            axios.post('http://localhost:8080/api/group/create', {
                groupName: this.groupName
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(() => {
                    alert('Grupa została utworzona.');
                    this.groupName = '';
                })
                .catch(error => {
                    console.error('Błąd podczas tworzenia grupy:', error);
                });
        },
    },
};
</script>
