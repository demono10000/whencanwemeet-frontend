<template>
    <div class="container">
        <h2 class="header">Group details "{{ group.name }}"</h2>

        <div class="group-info">
            <p><strong>Group ID:</strong> {{ group.id }}</p>
            <p><strong>Owner:</strong> {{ group.ownerName }}</p>
        </div>

        <div class="list-container">
            <h3 class="sub-header">Users in the group:</h3>
            <ul class="list">
                <li v-for="(user, index) in group.users" :key="index">
                    {{ user }}
                    <button v-if="group.ownerId == userId && user != username" @click="removeUser(user)" class="remove-btn">Remove User</button>
                </li>
            </ul>
        </div>

        <div class="list-container">
            <h3 class="sub-header">Meetings in the group:</h3>
            <ul class="list">
                <li v-for="(meeting, index) in group.meetings" :key="index">
                    <strong>{{ meeting.name }}:</strong> od {{ formatDate(meeting.startDate) }} do {{ formatDate(meeting.endDate) }}
                </li>
            </ul>
        </div>
        <!-- Formularz tworzenia nowego spotkania, widoczny tylko dla właściciela -->
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Create new meeting</h3>
            <form @submit.prevent="createMeeting" class="form">
                <label for="name">Meeting name:</label>
                <input type="text" id="name" v-model="meeting.name" placeholder="Meeting name" required>

                <label for="startDate">Start date:</label>
                <input type="datetime-local" id="startDate" v-model="meeting.startDate" required>

                <label for="endDate">End date:</label>
                <input type="datetime-local" id="endDate" v-model="meeting.endDate" required>

                <button type="submit" class="submit-btn">Create meeting</button>
            </form>
            <p v-if="message_create">{{ message_create }}</p>
        </div>
        <!-- Formularz zapraszania użytkowników, widoczny tylko dla właściciela -->
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Invite a user to the group</h3>
            <form @submit.prevent="inviteUser">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="inviteUsername" placeholder="Username" required>
                <button type="submit" class="submit-btn">Invite</button>
            </form>
            <p v-if="message_invite">{{ message_invite }}</p>
        </div>
        <!-- Formularz szukania dostępnych terminów spotkań, widoczny tylko dla właściciela -->
        <div v-if="group.ownerId == userId">
            <h3 class="sub-header">Search for new meeting times</h3>
            <form @submit.prevent="searchMeetingTimes">
                <label for="searchStart">Start time of the search:</label>
                <input type="time" id="searchStart" v-model="searchTimes.startTime" required>

                <label for="searchEnd">End time of the search:</label>
                <input type="time" id="searchEnd" v-model="searchTimes.endTime" required>

                <button type="submit" class="submit-btn">Search for times</button>
            </form>
            <p v-if="message_search">{{ message_search }}</p>
            <h3 class="sub-header">Free times:</h3>
            <ul>
                <li v-for="(time, index) in meetingTimes" :key="index">{{ formatDate(time) }}</li>
            </ul>
        </div>
    </div>
</template>

<style>
/* Dodajemy styl dla przycisku usuwania */
.remove-btn {
    margin-left: 20px;
    margin-bottom: 10px;
    color: white;
    background-color: red;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.remove-btn:hover {
    background-color: darkred;
}
</style>

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
            message_create: '',
            message_invite: '',
            message_search: ''
        };
    },
    computed: {
        ...mapState([
            'userId',
            'username'
        ])
    },
    created() {
        this.getGroupDetails();
    },
    methods: {
        getGroupDetails() {
            const groupId = this.$route.params.id;
            axios.post(`http://localhost:8080/api/group/${groupId}`)
                .then(response => {
                    this.group = response.data;
                })
                .catch(error => {
                    console.error('Error downloading group details:', error);
                });
        },
        createMeeting() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
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
                    this.getGroupDetails();
                    this.message_create = response.data.message;
                })
                .catch(error => {
                    console.error('Meeting creation error:', error);
                });
        },
        inviteUser() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
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
                .then((response) => {
                    if (response.data.status) {
                        alert('Invitation sent to: ' + this.inviteUsername);
                        this.inviteUsername = '';
                        this.message_invite = '';
                    } else {
                        this.message_invite = response.data.message;
                    }

                })
                .catch(error => {
                    this.message_invite = 'Error when sending an invitation: ' + error;
                });
        },
        searchMeetingTimes() {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
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
                    this.message_search = response.data.message;
                })
                .catch(error => {
                    this.message_search = 'Error when searching for terms: ' + error;
                });
        },
        formatDate(value) {
            const dateWithoutNanoSeconds = value.slice(0, 23);

            return format(new Date(dateWithoutNanoSeconds), 'dd.MM.yyyy HH:mm');
        },
        removeUser(user) {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
                return;
            }
            console.log(user);

            axios.post(`http://localhost:8080/api/group/removeUser/${this.group.id}`, {
                userName: user
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(response => {
                    if (response.data.status) {
                        this.getGroupDetails();
                        alert('User removed successfully.');
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Error removing user:', error);
                });
        },

    }
};
</script>