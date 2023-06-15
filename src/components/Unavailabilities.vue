<template>
    <div class="container">
        <h1 class="header">Your unavailabilities</h1>
        <ul v-if="unavailabilities.length">
            <li v-for="unavailability in unavailabilities" :key="unavailability.id">
                Start: {{ unavailability.startDate }}<br>
                End: {{ unavailability.endDate }}<br>
                <div v-if="unavailability.repeatDaysOfWeek.length > 0 && unavailability.repeatDaysOfWeek[0] !== ''">
                    Days of the week: {{ unavailability.repeatDaysOfWeek.join(', ') }}
                </div>
                <div v-if="unavailability.repeatDaysInterval !== null">
                    Repetition interval: {{ unavailability.repeatDaysInterval }} dni
                </div>
                <div v-if="unavailability.repeatDayOfMonth !== null">
                    Day of the month: {{ unavailability.repeatDayOfMonth }}
                </div>
                <button @click="deleteUnavailability(unavailability.id)" class="delete-btn submit-btn">Delete</button>
            </li>
        </ul>
        <p v-else>No unavailability.</p>
    </div>
    <div class="container">
        <h1 class="header">Add unavailability</h1>
        <form @submit="submitForm" class="form flex-form">
            <label for="start_date">Start date:</label>
            <input class="input-field" v-model="unavailability.start_date" id="start_date" type="datetime-local" required>

            <label for="end_date">End date:</label>
            <input class="input-field" v-model="unavailability.end_date" id="end_date" type="datetime-local" required>

            <label for="repeatDaysOfWeek">Days of the week (separate with commas):</label>
            <input class="input-field" v-model="unavailability.repeatDaysOfWeek" id="repeatDaysOfWeek" type="text">

            <label for="repeatDaysInterval">Repetition interval:</label>
            <input class="input-field" v-model="unavailability.repeatDaysInterval" id="repeatDaysInterval" type="number">

            <label for="repeatDayOfMonth">Day of the month:</label>
            <input class="input-field" v-model="unavailability.repeatDayOfMonth" id="repeatDayOfMonth" type="number">

            <button type="submit" class="submit-btn">Add</button>
        </form>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<style scoped>
.flex-form {
    display: flex;
    flex-direction: column;
}

.input-field {
    width: 50%;
    margin-bottom: 10px;
}
.submit-btn {
    width: 50%;
}
.delete-btn {
    width: 10%;
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
            unavailabilities: [],
            message: ''
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList(){
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
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
                    console.error('Error while downloading unavailability:', error);
                });
        },
        submitForm(e) {
            e.preventDefault();

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
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
                .then((response) => {
                    this.message = response.data.message;
                    if (response.data.status) {
                        this.resetForm();
                        this.getList();
                    }
                })
                .catch(error => {
                    this.message = 'Error when adding unavailability.';
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
                alert('You are not logged in!');
                return;
            }

            axios.delete(`http://localhost:8080/api/unavailable/delete/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(() => {
                    this.unavailabilities = this.unavailabilities.filter(unavailability => unavailability.id !== id);
                    alert('Removed unavailability.');
                })
                .catch(error => {
                    console.error('Error while removing unavailability:', error);
                });
        }
    }
};
</script>
