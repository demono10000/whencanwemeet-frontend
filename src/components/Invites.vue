<template>
    <div class="container">
        <h1 class="header">Zaproszenia do grupy</h1>

        <div v-for="invitation in invitations" :key="invitation.id" class="group-info">
            <h2>Grupa: {{ invitation.groupName }}</h2>
            <p>Właściciel: {{ invitation.owner }}</p>
            <button @click="respondInvitation(invitation.id, true)" class="submit-btn">Akceptuj</button>
            <button @click="respondInvitation(invitation.id, false)" class="nav-button">Odrzuć</button>
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
            alert('Nie jesteś zalogowany!');
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
                console.error("Błąd podczas pobierania listy zaproszeń:", error);
            });
    },
    methods: {
        respondInvitation(id, accepted) {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Nie jesteś zalogowany!');
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
                .then(() => {
                    // Po udanej odpowiedzi na zaproszenie, usuń je z listy
                    this.invitations = this.invitations.filter(
                        (invitation) => invitation.id !== id
                    );
                })
                .catch((error) => {
                    console.error("Błąd podczas odpowiadania na zaproszenie:", error);
                });
        },
    },
};
</script>

