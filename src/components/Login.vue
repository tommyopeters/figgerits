<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const error = ref(null);

const store = useStore();
onMounted(() => {
  store.dispatch('checkUserState');
});

const login = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    await store.dispatch('login', { email, password });
  } catch (error) {
    console.error(error);
    error.value = error.message;
  }
}

const signInWithGoogle = async () => {
  try {
    await store.dispatch('loginWithGoogle');
  } catch (error) {
    console.error(error);
    error.value = error.message;
  }
}

</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit="login">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" />
      <button type="submit">Login</button>
    </form>
    <button @click="signInWithGoogle"> Sign in with Google </button>
  </div>
</template>