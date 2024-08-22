<template>
    <div class="result">
        <div class="result-container">
            <h1> {{ props.correct ? 'Correct!' : 'Oops, you missed something 🤭' }}</h1>
            <h3 v-if="props.correct"><strong> {{ props.quote }}</strong></h3>
            <p v-if="props.correct">{{ props.info }}</p>

            <button v-if="props.correct" @click="$emit('next')" class="action-button next">Next Puzzle</button>
            <div class="button-group" v-else>
                <button @click="$emit('back')" class="action-button back">Go back</button>
                <button @click="$emit('reset')" class="action-button reset">Reset</button>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps(['correct', 'quote', 'info']);

console.log(props)
</script>

<style lang="scss" scoped>
.result {
    position: fixed;
    z-index: 2;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #0000004a;
}

.result-container {
    height: 70vh;
    width: 60vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.216);
}

.button-group {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
}

.action-button:hover {
    background-color: #0056b3;
}

.reset {
    background-color: #dc3545;
}

.reset:hover {
    background-color: #bd2130;
}

.next {
    background-color: #28a745;
}

.next:hover {
    background-color: #218838;
}

.back {
    background-color: #ffc107;
}

.back:hover {
    background-color: #d39e00;
}

/* Your component styles here */
</style>