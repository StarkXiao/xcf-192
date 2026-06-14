<template>
  <div class="game-container">
    <BackgroundMusic />
    <StartScene v-if="gameState === 'start'" />
    <GameScene v-else-if="gameState === 'playing'" />
    <EndScene v-else-if="gameState === 'end'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import StartScene from './components/StartScene.vue'
import GameScene from './components/GameScene.vue'
import EndScene from './components/EndScene.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'

const gameStore = useGameStore()
const gameState = computed(() => gameStore.gameState)
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
