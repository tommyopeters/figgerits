<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Keyboard from './Keyboard.vue';

onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (active.value === null) return;
    console.log(`Key ${event.key} was pressed`);

    if (!/^[a-zA-Z]$/.test(event.key)) return;
    handleKeyboardInput(event.key.toLowerCase());
  };

  window.addEventListener('keydown', handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});

// VARIABLES -------------------------------------------------------
const quote = ref<string | null>('');
const info = ref<string | null>('');
const encoding = ref<{ [key: string]: number }>({});
const userInput = ref<{ [key: number]: string | null }>({});
const words = ref<string[][] | null>(null);
const hints = ref<{ word: string, hint: string }[]>([]);
const highlighted = ref<number | null>(null);
const active = ref<number | null>(null);

// PURE FUNCTIONS -------------------------------------------------

const splitWords = (quote: string): string[][] => {
  let wordsArray = quote.split(' ');
  let charactersArray = [];
  for (let word of wordsArray) {
    let characters = word.split('');
    charactersArray.push(characters);
  }
  return charactersArray;
};

const getUniqueCharacters = (quote: string): string[] => {
  const uniqueCharacters: string[] = [];
  const characters: string[] = quote.toLowerCase().match(/[a-z]/g) || [];

  for (const char of characters) {
    if (!uniqueCharacters.includes(char)) {
      uniqueCharacters.push(char);
    }
  }

  return uniqueCharacters;
};

const encodeLetters = (quote: string): { [key: string]: number } => {
  const uniqueCharacters = getUniqueCharacters(quote);
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

// IMPURE FUNCTIONS -------------------------------------------------

const highlight = (char: number | null) => {
  highlighted.value = char;
};

const activate = (event: MouseEvent, char: number) => {
  active.value = char;
  const targetElement = event.target as Element;
  // check if element has 'current' classname, if not, select any ancestor with a the classname
  const currentAnswerBox = targetElement.classList.contains('answer-box') ? targetElement : targetElement.closest('.answer-box');
  if (currentAnswerBox) {
    nextTick(() => {
      currentAnswerBox.classList.add('current');
      console.log(currentAnswerBox);
    });
    console.log(currentAnswerBox)
  }
};
const hasValue = (num: number): boolean => {
  return userInput.value[num] !== null;
};
const getValue = (num: number): string | null => {
  return (userInput.value as { [key: number]: string | null })[num];
};
const isEncoded = (char: string): boolean => {
  return !!encoding.value[char.toLowerCase()];
};
const handleKeyboardInput = (character: string) => {
  if (active.value !== null) {
    (userInput.value as { [key: number]: string | null })[active.value] = character.toLowerCase();

    if (Object.values(userInput.value).every((value) => value !== null)) {
      console.log('All characters are filled!');

      const isCorrect = (Object.keys(encoding.value).every((char) => {
        return userInput.value[encoding.value[char]] === char;
      }))

      if (isCorrect) {
        console.log('Correct!');
      } else {
        console.log('Incorrect!');
      }
    } else {
      const answerBoxes = document.querySelectorAll('.answer-box');
      const activeElements = document.querySelectorAll('.active');
      // check if there is an element with 'current' classname
      const currentElement = document.querySelector('.current');

      let activeElement;
      if (currentElement) {
        activeElement = currentElement
      } else {
        activeElement = activeElements.length > 0 ? activeElements[0] : null;
      }


      if (activeElement !== null) {
        let i = Array.from(answerBoxes).indexOf(activeElement) + 1;
        while (true) {
          if (i === answerBoxes.length) {
            i = 0;
          }
          const encodingElement = answerBoxes[i].querySelector('.encoding');
          const encoding = encodingElement?.textContent ? Number(encodingElement.textContent) : null;

          if (!!encoding && !hasValue(encoding)) {
            active.value = encoding;
            nextTick(() => {
              activeElement.classList.remove('current');
              answerBoxes[i].classList.add('current');
            });
            break;
          }

          i++;
        }
      }
    }
  }
};


const startGame = (quoteString: string, clues: { word: string, hint: string }[], infoString: string) => {
  quote.value = quoteString;
  words.value = splitWords(quoteString);
  encoding.value = encodeLetters(quoteString);
  Object.keys(encoding.value).map((i) => {
    userInput.value[encoding.value[i]] = null;
  });
  hints.value = clues;
  info.value = infoString;
};

// ------------------------------------------------------------------

startGame('Water might not be wet.', [
  {
    "word": "better",
    "hint": "improve with time"
  },
  {
    "word": "manage",
    "hint": "control and organize"
  },
  {
    "word": "within",
    "hint": "inside a boundary"
  },
  {
    "word": "motion",
    "hint": "movement and change"
  }
], "This is because most scientists define wetness as a liquid’s ability to maintain contact with a solid surface, meaning that water itself is not wet, but can make other objects wet.")


</script>

<template>
  <div class="figgerits">
    <div class="quote">
      <ul class="words">
        <li v-for="(word, index) in words" :key="index">
          <ul class="letters">
            <li v-for="(char, ind) in word" :key="ind">
              <div class="answer-box"
                :class="{ hover: highlighted == encoding[char.toLowerCase()], active: active == encoding[char.toLowerCase()] }"
                @click="activate($event, encoding[char.toLowerCase()])"
                @mouseenter="highlight(encoding[char.toLowerCase()])" @mouseleave="highlight(null)"
                v-if="isEncoded(char)">
                <span class="user-input">
                  {{ hasValue(encoding[char.toLowerCase()]) ? getValue(encoding[char.toLowerCase()]) : '?' }}
                </span>
                <span class="divider"></span>
                <span class="encoding">{{ encoding[char.toLowerCase()] }}</span>
              </div>
              <div class="space" v-else-if="char == ' '">{{ char }}</div>
              <div class="non-char" v-else>{{ char }}</div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="hints">
      <h3>Definition & words</h3>
      <ul>
        <li v-for="(hint, index) in hints" :key="index">
          <div class="hint">{{ hint.hint }}</div>
          <div class="word">
            <ul class="letters">
              <li class="" v-for="(char, ind) in hint.word" :key="ind">
                <div class="answer-box"
                  :class="{ hover: highlighted == encoding[char.toLowerCase()], active: active == encoding[char.toLowerCase()] }"
                  @click="activate($event, encoding[char.toLowerCase()])"
                  @mouseenter="highlight(encoding[char.toLowerCase()])" @mouseleave="highlight(null)"
                  v-if="isEncoded(char)">
                  <span class="user-input">
                    {{ hasValue(encoding[char.toLowerCase()]) ? getValue(encoding[char.toLowerCase()]) : '?' }}
                  </span>
                  <span class="divider"></span>
                  <span class="encoding">{{ encoding[char.toLowerCase()] }}</span>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <Keyboard @clicked="handleKeyboardInput"></Keyboard>
  </div>

</template>

<style lang="scss" scoped>
.figgerits {
  height: 100dvh;
  // max-height: -webkit-fill-available;
  display: grid;
  grid-template-rows: max-content 1fr max-content;

  .quote {
    background-color: white;
    padding: 10px;

    ul.words {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px 25px;
    }
  }
}


div.answer-box {
  text-transform: uppercase;
  font-weight: 500;
  box-sizing: border-box;
  cursor: pointer;
  width: 20px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  transition: all 100ms ease-in;

  font-size: 14px;

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

  &.current {
    border-color: rgb(48, 219, 85);
    background-color: rgb(48, 219, 85);
  }
}

div.non-char {
  display: flex;

  align-items: center;
  justify-content: center;
  width: 10px;
}

.hints {
  display: block;
  padding: 10px;

  &>ul {
    display: block;

    &>li {
      display: grid;
      align-items: center;
      margin-bottom: 30px;
      column-gap: 10px;
      grid-template-columns: 5fr 4fr;
      padding: 5px 20px;
      border-radius: 10px;

      .hint {
        font-size: 14px;
        justify-self: end;
        font-weight: 500;

        &::first-letter {
          text-transform: uppercase;
        }
      }


      &:has(.answer-box.current) {
        background-color: white;
        border: 1px solid rgb(48, 219, 85);
      }
    }
  }
}

div.space {
  display: flex;

  align-items: center;
  justify-content: center;
  width: 20px;
  height: 42px;
}
</style>
