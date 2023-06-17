<template>
    <div class="container">
        <h1 class="header">Invitations to the group</h1>

        <div v-for="invitation in invitations" :key="invitation.id" class="group-info">
            <h2>Group: {{ invitation.groupName }}</h2>
            <p>Owner: {{ invitation.owner }}</p>
            <button @click="respondInvitation(invitation.id, true)" class="submit-btn">Accept</button>
            <button @click="respondInvitation(invitation.id, false)" class="nav-button">Reject</button>
        </div>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
            invitations: [],
        };
    },
    created() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You are not logged in!');
            return;
        }

        const username = this.$store.state.username; // Załóżmy, że nazwa użytkownika jest przechowywana w stanie Vuex
        axios.post("http://localhost:8080/api/invitation/list", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                this.invitations = response.data;
            })
            .catch((error) => {
                console.error("Error while downloading invitation list:", error);
            });
    },
    methods: {
        respondInvitation(id, accepted) {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You are not logged in!');
                return;
            }

            axios.post("http://localhost:8080/api/invitation/respond", {
                id,
                accepted,
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then((response) => {
                    if (response.data.status) {
                        this.invitations = this.invitations.filter(
                            (invitation) => invitation.id !== id
                        );
                    }
                    alert(response.data.message);

                })
                .catch((error) => {
                    console.error("Error when responding to an invitation:", error);
                });
        },
    },
};
</script>

