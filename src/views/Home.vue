<template>
  <button :disabled="gameid !== ''" @click="createGame">Create game</button>
  <h6 v-if="gameURL">{{gameURL}}</h6>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import firebase from "firebase/app";

export default defineComponent({
  setup() {
    const gameid = ref("");
    function createGame() {
      const gameRef = firebase
        .database()
        .ref("games")
        .push({ title: "New game" });
      gameid.value = gameRef.key ?? "";
    }
    const gameURL = computed(()=> {
      if(!gameid.value) return '';
      const url = `${window.location.origin}/game/${gameid.value}`;
      return url;
    })
    return {
      createGame,
      gameid,
      gameURL,
    };
  },
});
</script>

<style>
</style>