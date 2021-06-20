
<template>
  <div v-if="!joined">
    <input type="text" placeholder="Name" v-model="username" />
    <button :disabled="!username" @click="joinGame">Join</button>
  </div>
  <div v-else class="container">
    <img v-for="answer in answers" :key="answer.id" :src="answer.photoURL" :alt="answer.name" class="answer-button" @click="submitAnswer(answer.id)">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import firebase from "firebase/app";

export default defineComponent({
  setup() {
    const db = firebase.database();
    const username = ref("");
    const route = useRoute();
    const joined = ref(false);

    let gameRef: firebase.database.Reference;
    let playerid: string;

    async function joinGame() {
      const gameid = route.params.gameid;
      gameRef = db.ref("games").child(gameid as string);
      // Add yourself as a player
      const playerRef = await gameRef.child("players").push({ name: username.value });
      playerid = playerRef.key as string;
      joined.value = true;
    }

    async function submitAnswer(choice: string){
      console.log(choice, playerid);      
      gameRef.child('answers').push({
        choice,
        playerid,
      })
    }

    return {
      answers: [
        {name: 'Eric', photoURL: '/images/eric.jpeg', id: 'eric'},
        {name: 'Ian', photoURL: '/images/ian.jpeg', id: 'ian'},
        {name: 'Adam', photoURL: '/images/adam.jpeg', id: 'adam'},
      ],
      username,
      joined,
      joinGame,
      submitAnswer
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.answer-button {
  border-radius: 100%;
  width: 164px;
  margin: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}
</style>