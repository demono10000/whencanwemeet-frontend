<template>
    <div class="container">
        <h1 class="header">Dodaj niedostępność</h1>
        <form @submit="submitForm" class="form flex-form">
            <label for="start_date">Data początkowa:</label>
            <input class="input-field" v-model="unavailability.start_date" id="start_date" type="datetime-local" required>

            <label for="end_date">Data końcowa:</label>
            <input class="input-field" v-model="unavailability.end_date" id="end_date" type="datetime-local" required>

            <label for="repeatDaysOfWeek">Dni tygodnia (oddziel przecinkami):</label>
            <input class="input-field" v-model="unavailability.repeatDaysOfWeek" id="repeatDaysOfWeek" type="text">

            <label for="repeatDaysInterval">Interwał powtarzania:</label>
            <input class="input-field" v-model="unavailability.repeatDaysInterval" id="repeatDaysInterval" type="number">

            <label for="repeatDayOfMonth">Dzień miesiąca:</label>
            <input class="input-field" v-model="unavailability.repeatDayOfMonth" id="repeatDayOfMonth" type="number">

            <button type="submit" class="submit-btn">Dodaj niedostępność</button>
        </form>
    </div>
</template>

<style scoped>
.flex-form {
    display: flex;
    flex-direction: column;
}

.input-field {
    width: 50%;  /* zmniejsza szerokość pól formularza do 70% */
    margin-bottom: 10px;  /* dodaje margines na dole każdego pola, aby było więcej miejsca */
}
.submit-btn {
    width: 50%;  /* zmniejsza szerokość przycisku do 70% */
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            unavailability: {
                start_date: '',
                end_date: '',
                repeatDaysOfWeek: '',
                repeatDaysInterval: null,
                repeatDayOfMonth: null
            }
        };
    },
    methods: {
        submitForm(e) {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            const { start_date, end_date, repeatDaysOfWeek, repeatDaysInterval, repeatDayOfMonth } = this.unavailability;

            const repeatDaysOfWeekArray = repeatDaysOfWeek.split(',');

            axios.post('http://localhost:8080/api/unavailable', {
                start_date,
                end_date,
                repeatDaysOfWeek: repeatDaysOfWeekArray,
                repeatDaysInterval,
                repeatDayOfMonth
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(() => {
                    alert('Dodano niedostępność.');
                    this.resetForm();
                })
                .catch(error => {
                    console.error('Błąd podczas dodawania niedostępności:', error);
                });
        },
        resetForm() {
            this.unavailability = {
                start_date: '',
                end_date: '',
                repeatDaysOfWeek: '',
                repeatDaysInterval: null,
                repeatDayOfMonth: null
            };
        }
    }
};
</script>
