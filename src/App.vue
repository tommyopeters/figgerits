<script setup lang="ts">import { computed } from 'vue';
import { useStore } from 'vuex';
import Figgerits from './components/Figgerits.vue'
import Login from './components/Login.vue'

const store = useStore();
const signedIn = computed(() => store.getters.signedIn);
</script>

<template>
  <Login v-if="!signedIn" />
  <Figgerits v-if="signedIn" />
</template>

<style scoped>
</style>
