<template>
  <div class="keyboard">
    <div class="row">
      <button @click="handleClick('q')">Q</button>
      <button @click="handleClick('w')">W</button>
      <button @click="handleClick('e')">E</button>
      <button @click="handleClick('r')">R</button>
      <button @click="handleClick('t')">T</button>
      <button @click="handleClick('y')">Y</button>
      <button @click="handleClick('u')">U</button>
      <button @click="handleClick('i')">I</button>
      <button @click="handleClick('o')">O</button>
      <button @click="handleClick('p')">P</button>
    </div>
    <div class="row">
      <button @click="handleClick('a')">A</button>
      <button @click="handleClick('s')">S</button>
      <button @click="handleClick('d')">D</button>
      <button @click="handleClick('f')">F</button>
      <button @click="handleClick('g')">G</button>
      <button @click="handleClick('h')">H</button>
      <button @click="handleClick('j')">J</button>
      <button @click="handleClick('k')">K</button>
      <button @click="handleClick('l')">L</button>
    </div>
    <div class="row">
      <button class="action-button undo"></button>
      <button @click="handleClick('z')">Z</button>
      <button @click="handleClick('x')">X</button>
      <button @click="handleClick('c')">C</button>
      <button @click="handleClick('v')">V</button>
      <button @click="handleClick('b')">B</button>
      <button @click="handleClick('n')">N</button>
      <button @click="handleClick('m')">M</button>
      <button class="action-button delete"></button>
    </div>
    <!-- Add more rows as needed -->
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(character) {
      // Handle the click event and return the character
      this.$emit('clicked', character);
    },
  },
};
</script>

<style lang="scss" scoped>
.keyboard {
  padding: 10px 0;
  background-color: #d1d4db;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .row {
    display: flex;
    // gap: 1rem;
    justify-content: space-evenly;

    button {
      border: none;
      border-radius: 8px;
      width: 8.5vw;
      height: 40px;
      background: white;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease-in-out;
      font-weight: 500;
      font-size: 18px;

      &.action-button {
        background-color: rgb(174,179,185);
        width: 12vw;
      }

      &:hover {
        transform: translateY(1px);
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.25);
      }
    }
  }
}
</style>
