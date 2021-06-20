<template>
  <h1>Father's Day Trivia</h1>
  <button v-if="!gameURL" @click="createGame">Get started</button>
  <h6 v-else-if="questionIndex === -1">{{ gameURL }}</h6>
  <h4 v-for="player in players" :key="player.id">
    {{ player.name }}: {{ player.score }}
  </h4>
  <button v-if="questionIndex === -1 && gameURL" @click="nextQuestion">
    Start Game
  </button>
  <div
    v-if="questionIndex !== -1"
    :class="{
      'question-card': true,
      'question-correct': answerStatus === 'correct',
      'question-wrong': answerStatus === 'wrong',
    }"
  >
    <p>
      {{ question.text }}
    </p>
    <h4 class="correct-answer">{{correctAnswer}}</h4>
    <h6 class="answerer" v-if="firstResponder">(Answer by {{ firstResponder }})</h6>
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
    const answerStatus = ref("");
    const firstResponder = ref("");
    const correctAnswer = ref("");
    const answerLock = ref(false);

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
      let winner = "No one";
      for (const playerid in playerData.value) {
        const player = playerData.value[playerid];
        if (player.score > highestScore) {
          highestScore = player.score;
          winner = player.name;
        }
      }
      alert(winner + " wins!");
    }

    function nextQuestion() {
      if (questionIndex.value >= questions.length - 1) {
        endGame();
      } else {
        // Advance state
        questionIndex.value += 1;
        answerStatus.value = "";
        firstResponder.value = "";
        correctAnswer.value = "";
        answerLock.value = false;
      }
    }

    function capitalizeFirstLetter(s: string) {
      return s.charAt(0).toUpperCase() + s.slice(1);
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
        if (answerLock.value) return; // don't allow spamming
        answerLock.value = true;
        console.log(snap.val());
        const answer = snap.val() as {
          choice: "eric" | "ian" | "adam";
          playerid: string;
        };
        // Check if answer is correct
        firstResponder.value = playerData.value[answer.playerid].name;
        correctAnswer.value = capitalizeFirstLetter(question.value.answer);
        console.log(correctAnswer.value);
        
        if (question.value.answer === answer.choice) {
          playerData.value[answer.playerid].score += 1;
          answerStatus.value = "correct";
        } else {
          playerData.value[answer.playerid].score -= 1;
          answerStatus.value = "wrong";
        }
        setTimeout(nextQuestion, 10000); // wait X seconds before advancing to next question
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
      answerStatus,
      firstResponder,
      correctAnswer
    };
  },
});
</script>

<style scoped>
.question-card {
  padding: 48px;
  margin: 16px;
  border-radius: var(--border-radius);
  background: var(--basic-color);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  transition: all ease-in-out 0.2s;
}
.question-correct {
  background: var(--success-color) !important;
}
.question-wrong {
  background: var(--error-color) !important;
}
.correct-answer {
  font-size: 2.2em;
  margin-bottom: 8px;
}
.answerer {
  font-size: 1em;
  font-weight: lighter;
  margin-top: 8px;
}
</style>