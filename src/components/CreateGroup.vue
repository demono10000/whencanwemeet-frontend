<template>
    <div>
        <h1>Utwórz grupę</h1>
        <form @submit.prevent="submitForm">
            <input v-model="groupName" placeholder="Nazwa grupy" required />
            <button type="submit">Utwórz</button>
        </form>
    </div>
</template>

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

            axios.post('http://localhost:8080/api/createGroup', {
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
