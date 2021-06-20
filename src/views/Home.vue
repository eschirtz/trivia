<template>
  <button v-if="!gameURL" @click="createGame">Create game</button>
  <h6 v-else>{{ gameURL }}</h6>
  <h4 v-for="player in players" :key="player.id">
    {{ player.name }}: {{ player.score }}
  </h4>
  <button v-if="questionIndex === -1 && gameURL" @click="nextQuestion">
    Start Game
  </button>
  <div v-if="questionIndex !== -1">
    {{ question.text }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import firebase from "firebase/app";
import questions from "./questions";

export default defineComponent({
  setup() {
    const gameid = ref("");
    const playerData = ref({}) as Ref<{
      [playerid: string]: { name: string; score: number };
    }>;
    const questionIndex = ref(-1);

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

    const question = computed(() => {
      return questions[questionIndex.value];
    });

    function endGame() {
      let highestScore = Number.MIN_VALUE;
      let winner = 'No one';
      for (const playerid in playerData.value) {
        const player = playerData.value[playerid];
        if (player.score > highestScore) {
          highestScore = player.score;
          winner = player.name;
        }
      }
      alert(winner + ' wins!');
    }

    function nextQuestion() {
      if (questionIndex.value >= questions.length - 1) {
        endGame();
      } else {
        questionIndex.value += 1;
      }
    }

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

      gameRef.child("answers").on("child_added", (snap) => {
        console.log(snap.val());
        const answer = snap.val() as {
          choice: "eric" | "ian" | "adam";
          playerid: string;
        };
        // Check if answer is correct
        if (question.value.answer === answer.choice) {
          playerData.value[answer.playerid].score += 1;
          console.log("YOU ARE RIGHT!");
        } else {
          playerData.value[answer.playerid].score -= 1;
          console.error("YOU ARE WRONG!");
        }
        setTimeout(nextQuestion, 3000); // wait 5 seconds before advancing to next question        
      });
    }

    return {
      createGame,
      nextQuestion,
      gameid,
      gameURL,
      players,
      questionIndex,
      question,
    };
  },
});
</script>

<style>
</style>