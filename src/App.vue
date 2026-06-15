<template>
  <div class="game-container">
    <BackgroundMusic />
    <MapExplore v-if="isMapMode" />
    <template v-else>
      <StartScene v-if="gameState === 'start'" />
      <GameScene v-else-if="gameState === 'playing'" />
      <EndScene v-else-if="gameState === 'end'" />
    </template>
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
import { useMapStore } from './stores/mapStore'
import StartScene from './components/StartScene.vue'
import GameScene from './components/GameScene.vue'
import EndScene from './components/EndScene.vue'
import MapExplore from './components/MapExplore.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import ArchiveModal from './components/ArchiveModal.vue'
import JournalModal from './components/JournalModal.vue'
import KeyChoiceModal from './components/KeyChoiceModal.vue'
import LeaderboardModal from './components/LeaderboardModal.vue'
import BadgeModal from './components/BadgeModal.vue'
import MemoryArchiveModal from './components/MemoryArchiveModal.vue'

const gameStore = useGameStore()
const mapStore = useMapStore()
const gameState = computed(() => gameStore.gameState)
const isMapMode = computed(() => mapStore.isMapMode)
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
