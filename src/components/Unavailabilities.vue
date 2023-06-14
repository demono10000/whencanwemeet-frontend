<template>
    <div class="container">
        <h1 class="header">Twoje niedostępności</h1>
        <ul v-if="unavailabilities.length">
            <li v-for="unavailability in unavailabilities" :key="unavailability.id">
                Start: {{ unavailability.startDate }}<br>
                Koniec: {{ unavailability.endDate }}<br>
                <div v-if="unavailability.repeatDaysOfWeek.length > 0 && unavailability.repeatDaysOfWeek[0] !== ''">
                    Dni tygodnia: {{ unavailability.repeatDaysOfWeek.join(', ') }}
                </div>
                <div v-if="unavailability.repeatDaysInterval !== null">
                    Interwał powtarzania: {{ unavailability.repeatDaysInterval }} dni
                </div>
                <div v-if="unavailability.repeatDayOfMonth !== null">
                    Dzień miesiąca: {{ unavailability.repeatDayOfMonth }}
                </div>
                <button @click="deleteUnavailability(unavailability.id)" class="delete-btn submit-btn">Usuń</button>
            </li>
        </ul>
        <p v-else>Brak niedostępności.</p>
    </div>
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
.delete-btn {
    width: 10%;  /* zmniejsza szerokość przycisku do 70% */
    background-color: #cc0000;
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
            },
            unavailabilities: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList(){
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            axios.post('http://localhost:8080/api/unavailable/get', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(response => {
                    this.unavailabilities = response.data;
                })
                .catch(error => {
                    console.error('Błąd podczas pobierania niedostępności:', error);
                });
        },
        submitForm(e) {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            const { start_date, end_date, repeatDaysOfWeek, repeatDaysInterval, repeatDayOfMonth } = this.unavailability;

            const repeatDaysOfWeekArray = repeatDaysOfWeek.split(',');

            axios.post('http://localhost:8080/api/unavailable/add', {
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
                    this.getList();
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
        },
        deleteUnavailability(id) {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            axios.delete(`http://localhost:8080/api/unavailable/delete/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(() => {
                    this.unavailabilities = this.unavailabilities.filter(unavailability => unavailability.id !== id);
                    alert('Usunięto niedostępność.');
                })
                .catch(error => {
                    console.error('Błąd podczas usuwania niedostępności:', error);
                });
        }
    }
};
</script>
