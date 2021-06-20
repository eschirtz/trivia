<template>
  <button v-if="!gameURL" @click="createGame">Create game</button>
  <h6 v-else>{{ gameURL }}</h6>
  <h4 v-for="player in players" :key="player.id">{{ player.name }}: {{player.score}}</h4>
  <button v-if="questionIndex === -1 && gameURL" @click="nextQuestion">
    Start Game
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import firebase from "firebase/app";

export default defineComponent({
  setup() {
    const gameid = ref("");
    const playerData = ref({}) as Ref<{
      [playerid: string]: { name: string; score: number };
    }>;
    const questionIndex = ref(-1);

    function createGame() {
      const gameRef = firebase
        .database()
        .ref("games")
        .push({ title: "New game" });
      gameid.value = gameRef.key ?? "";
      // Listen to changes to the game
      gameRef.child("players").on("child_added", (snap) => {
        console.log(snap.val());        
        playerData.value[snap.key as string] = {
          name: snap.val().name,
          score: 0,
        };
      });
      
      gameRef.child('answers').on('child_added', snap => {
        console.log(snap.val());  
        const answer = snap.val() as {choice: 'eric' | 'ian' | 'adam', playerid: string}  
        // Check if answer is correct
        if(true)    {
          playerData.value[answer.playerid].score += 1;
        }
      })
    }

    function nextQuestion() {
      questionIndex.value += 1;
      for(const player of players.value) {
        playerData.value[player.id].score += 2
      }
    }

    const players = computed(() => {
      const list = [];
      for (const playerid in playerData.value) {
        // @ts-ignore
        const player = playerData.value[playerid];
        list.push({          
          id: playerid,
          name: player.name,
          score: player.score,          
        });
      }
      return list;
    });
    
    const gameURL = computed(() => {
      if (!gameid.value) return "";
      const url = `${window.location.origin}/game/${gameid.value}`;
      return url;
    });

    return {
      createGame,
      nextQuestion,
      gameid,
      gameURL,
      players,
      questionIndex,
    };
  },
});
</script>

<style>
</style>