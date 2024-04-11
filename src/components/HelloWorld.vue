<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (active.value !== null) {
      console.log(`Key ${event.key} was pressed`);

      if (/^[a-zA-Z]$/.test(event.key)) {
        // Do something when event.key is an alphabet
        (userInput.value as { [key: number]: string | null })[active.value] = event.key.toLowerCase();

        // Check if all the characters are filled
        if (Object.values(userInput.value).every((value) => value !== null)) {
          console.log('All characters are filled!');

          // Check if the user input is correct
          if (isCorrect) {
            console.log('Correct!');
          } else {
            console.log('Incorrect!');
          }
        } else {
          // get all divs with class answer-box
          const answerBoxes = document.querySelectorAll('.answer-box');
          // get the index of the first occurence of the active divs

          const activeElements = document.querySelectorAll('.active');
          console.log(activeElements);
          const activeElement = activeElements.length > 0 ? activeElements[0] : null;

          if (activeElement !== null) {
            let i = Array.from(answerBoxes).indexOf(activeElement) + 1;
            console.log(i);
            console.log(answerBoxes.length);
            while (true) {
              if (i === answerBoxes.length) {
                i = 0;
              }
              const encodingElement = answerBoxes[i].querySelector('.encoding');
              const encoding = encodingElement?.textContent ? Number(encodingElement.textContent) : null;

              if (!!encoding && !hasValue(encoding)) {
                activate(encoding);
                break;
              }

              i++;
            }

            //   // get the next unfilled div
            //   for (let i = Array.from(answerBoxes).indexOf(activeElement) + 1; i < answerBoxes.length; i++) {
            //     // console.log(!hasValue(i))

            //     // get the value of the span.encoding within the div.answer-box with the index i
            //     const encodingElement = answerBoxes[i].querySelector('.encoding');
            //     const encoding = encodingElement?.textContent ? Number(encodingElement.textContent) : null;

            //     if (!!encoding && !hasValue(encoding)) {
            //       activate(encoding);
            //       break;
            //     }
            //   }
          }
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});

const encoded = ref<{ [key: string]: number }>({});
const userInput = ref<{ [key: number]: string | null }>({});

const paragraph = ref('Hello, World!'.split(''));
const highlighted = ref<number | null>(null);
const active = ref<number | null>(null);

const highlight = (char: number | null) => {
  highlighted.value = char;
};
const activate = (char: number) => {
  active.value = char;
};

const getUniqueCharacters = (paragraph: string): string[] => {
  const uniqueCharacters: string[] = [];
  const characters: string[] = paragraph.toLowerCase().match(/[a-z]/g) || [];

  for (const char of characters) {
    if (!uniqueCharacters.includes(char)) {
      uniqueCharacters.push(char);
    }
  }

  return uniqueCharacters;
};

const encodeLetters = (paragraph: string): { [key: string]: number } => {
  const uniqueCharacters = getUniqueCharacters(paragraph);
  console.log(uniqueCharacters);
  console.log(uniqueCharacters);
  const encodedLetters: { [key: string]: number } = {};

  for (const char of uniqueCharacters) {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * uniqueCharacters.length + 1);
    } while (Object.values(encodedLetters).includes(randomNum));
    encodedLetters[char] = randomNum;
  }

  return encodedLetters;
};

const isCorrect = Object.keys(encoded.value).every((char) => {
  return userInput.value[encoded.value[char]] === char;
});
encoded.value = encodeLetters('Hello, World!');
Object.keys(encoded.value).map((i) => {
  userInput.value[encoded.value[i]] = null;
});

const hasValue = (num: number): boolean => {
  return userInput.value[num] !== null;
};
const getValue = (num: number): string | null => {
  return (userInput.value as { [key: number]: string | null })[num];
};

const isEncoded = (char: string): boolean => {
  return !!encoded.value[char.toLowerCase()];
};
</script>

<template>
  <div>
    <ul>
      <li v-for="(char, index) in paragraph" :key="index">
        <div class="answer-box" :class="{ hover: highlighted == encoded[char.toLowerCase()], active: active == encoded[char.toLowerCase()] }" @click="activate(encoded[char.toLowerCase()])" @mouseenter="highlight(encoded[char.toLowerCase()])" @mouseleave="highlight(null)" v-if="isEncoded(char)">
          <span class="user-input">
            {{ hasValue(encoded[char.toLowerCase()]) ? getValue(encoded[char.toLowerCase()]) : '?' }}
          </span>
          <span class="divider"></span>
          <span class="encoding">{{ encoded[char.toLowerCase()] }}</span>
        </div>
        <div class="space" v-else-if="char == ' '">{{ char }}</div>
        <div class="non-char" v-else>{{ char }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  list-style-type: none;
  gap: 5px;
}

div.answer-box {
  box-sizing: border-box;
  cursor: pointer;
  width: 20px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  transition: all 100ms ease-in;

  span.divider {
    width: 100%;
    height: 1px;
    background-color: black;
  }

  &.hover {
    border: 1px solid rgba(97, 172, 115, 0.65);
    background-color: rgba(187, 249, 202, 0.65);
  }
  &.active {
    border: 1px solid rgb(97, 172, 115);
    background-color: rgb(187, 249, 202);
  }
}
div.non-char {
  display: flex;

  align-items: center;
  justify-content: center;
  width: 10px;
}
div.space {
  display: flex;

  align-items: center;
  justify-content: center;
  width: 20px;
  height: 42px;
}
ul {
  margin: 0;
  padding: 0;
}
</style>
