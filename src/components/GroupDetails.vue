<template>
    <div class="container">
        <h2 class="header">Szczegóły grupy "{{ group.name }}"</h2>

        <div class="group-info">
            <p><strong>ID Grupy:</strong> {{ group.id }}</p>
            <p><strong>Właściciel:</strong> {{ group.ownerName }}</p>
        </div>

        <div class="list-container">
            <h3 class="sub-header">Użytkownicy w grupie:</h3>
            <ul class="list">
                <li v-for="(user, index) in group.users" :key="index">{{ user }}</li>
            </ul>
        </div>

        <div class="list-container">
            <h3 class="sub-header">Spotkania w grupie:</h3>
            <ul class="list">
                <li v-for="(meeting, index) in group.meetings" :key="index">
                    <strong>{{ meeting.name }}:</strong> od {{ formatDate(meeting.startDate) }} do {{ formatDate(meeting.endDate) }}
                </li>
            </ul>
        </div>
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Utwórz nowe spotkanie</h3>
            <form @submit.prevent="createMeeting" class="form">
                <label for="name">Nazwa spotkania:</label>
                <input type="text" id="name" v-model="meeting.name">

                <label for="startDate">Data początku:</label>
                <input type="datetime-local" id="startDate" v-model="meeting.startDate">

                <label for="endDate">Data końca:</label>
                <input type="datetime-local" id="endDate" v-model="meeting.endDate">

                <button type="submit" class="submit-btn">Utwórz spotkanie</button>
            </form>
        </div>
        <!-- Formularz zapraszania użytkowników, widoczny tylko dla właściciela -->
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Zaproś użytkownika do grupy</h3>
            <form @submit.prevent="inviteUser">
                <label for="username">Nazwa użytkownika:</label>
                <input type="text" id="username" v-model="inviteUsername">
                <button type="submit" class="submit-btn">Zaproś</button>
            </form>
        </div>
        <!-- Formularz szukania dostępnych terminów spotkań, widoczny tylko dla właściciela -->
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Szukaj terminów dla nowego spotkania</h3>
            <form @submit.prevent="searchMeetingTimes">
                <label for="searchStart">Czas rozpoczęcia poszukiwań:</label>
                <input type="time" id="searchStart" v-model="searchTimes.startTime">

                <label for="searchEnd">Czas zakończenia poszukiwań:</label>
                <input type="time" id="searchEnd" v-model="searchTimes.endTime">

                <button type="submit" class="submit-btn">Szukaj terminów</button>
            </form>

            <h3 class="sub-header">Wolne terminy:</h3>
            <ul>
                <li v-for="(time, index) in meetingTimes" :key="index">{{ formatDate(time) }}</li>
            </ul>
        </div>
    </div>
</template>


<script>
import axios from "axios";
import { mapState } from 'vuex';
import { format } from 'date-fns';

export default {
    data() {
        return {
            group: {},
            meeting: {
                startDate: '',
                endDate: '',
                groupId: this.$route.params.id,
                name: ''
            },
            inviteUsername: '',
            searchTimes: {
                startTime: '',
                endTime: '',
                groupId: this.$route.params.id
            },
            meetingTimes: [],
        };
    },
    computed: {
        ...mapState([
            'userId'
        ])
    },
    created() {
        this.getGroupDetails();
    },
    methods: {
        getGroupDetails() {
            const groupId = this.$route.params.id;
            axios.get(`http://localhost:8080/api/group/${groupId}`)
                .then(response => {
                    this.group = response.data;
                    console.log('Szczegóły grupy:', this.group);
                })
                .catch(error => {
                    console.error('Błąd pobierania szczegółów grupy:', error);
                });
        },
        createMeeting() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            axios.post('http://localhost:8080/api/meeting/create', {
                name: this.meeting.name,
                startDate: this.meeting.startDate,
                endDate: this.meeting.endDate,
                groupId: this.meeting.groupId
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(response => {
                    // console.log('Utworzono spotkanie:', response.data);
                    this.getGroupDetails();
                })
                .catch(error => {
                    console.error('Błąd tworzenia spotkania:', error);
                });
        },
        inviteUser() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }
            axios.post('http://localhost:8080/api/invitation/send', {
                username: this.inviteUsername,
                groupId: this.group.id
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(() => {
                    alert('Zaproszenie wysłane do: ' + this.inviteUsername);
                    this.inviteUsername = '';
                })
                .catch(error => {
                    console.error('Błąd podczas wysyłania zaproszenia:', error);
                });
        },
        searchMeetingTimes() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Nie jesteś zalogowany!');
                return;
            }

            axios.post('http://localhost:8080/api/meeting/schedule', {
                startTime: this.searchTimes.startTime,
                endTime: this.searchTimes.endTime,
                groupId: this.searchTimes.groupId
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(response => {
                    this.meetingTimes = response.data;
                    console.log('Znalezione terminy spotkań:', this.meetingTimes);
                })
                .catch(error => {
                    console.error('Błąd podczas wyszukiwania terminów:', error);
                });
        },
        formatDate(value) {
            // Przycięcie subsekund do milisekund
            const dateWithoutNanoSeconds = value.slice(0, 23);

            return format(new Date(dateWithoutNanoSeconds), 'dd.MM.yyyy HH:mm');
        },

    }
};
</script>