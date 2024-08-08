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
      <button @click="handleUndo" class="action-button undo"><Return width="30" height="30" /></button>
      <button @click="handleClick('z')">Z</button>
      <button @click="handleClick('x')">X</button>
      <button @click="handleClick('c')">C</button>
      <button @click="handleClick('v')">V</button>
      <button @click="handleClick('b')">B</button>
      <button @click="handleClick('n')">N</button>
      <button @click="handleClick('m')">M</button>
      <button @click="handleDelete" class="action-button delete"><Backspace width="30" height="30" /></button>
    </div>
    <!-- Add more rows as needed -->
  </div>
</template>

<script>
import Backspace from '../assets/svgs/icons/backspace.svg?component';
import Return from '../assets/svgs/icons/return.svg?component';
export default {
  components: {
    Backspace,
    Return
  },
  methods: {
    handleClick(character) {
      // Handle the click event and return the character
      this.$emit('clicked', character);
    },
    handleDelete() {
      // Handle the click event and return the character
      this.$emit('delete');
    },
    handleUndo(character) {
      // Handle the click event and return the character
      this.$emit('undo');
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
      cursor: pointer;
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

        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.25);
      }
      &:active {
        transform: translateY(0);
        box-shadow: 0 3px 3px -1px rgba(0, 0, 0, 0.25);
      }
    }
  }
}
</style>
