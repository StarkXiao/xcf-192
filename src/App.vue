<template>
  <div class="game-container">
    <BackgroundMusic />
    <StartScene v-if="gameState === 'start'" />
    <GameScene v-else-if="gameState === 'playing'" />
    <EndScene v-else-if="gameState === 'end'" />
    <ArchiveModal />
    <JournalModal />
    <KeyChoiceModal />
    <LeaderboardModal />
    <BadgeModal />
    <MemoryArchiveModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import StartScene from './components/StartScene.vue'
import GameScene from './components/GameScene.vue'
import EndScene from './components/EndScene.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import ArchiveModal from './components/ArchiveModal.vue'
import JournalModal from './components/JournalModal.vue'
import KeyChoiceModal from './components/KeyChoiceModal.vue'
import LeaderboardModal from './components/LeaderboardModal.vue'
import BadgeModal from './components/BadgeModal.vue'
import MemoryArchiveModal from './components/MemoryArchiveModal.vue'

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
