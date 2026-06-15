<template>
  <div class="game-container">
    <BackgroundMusic />
    <PrologueScene v-if="isPrologueMode" />
    <MapExplore v-else-if="isMapMode" />
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
    <JournalEditor />
    <LetterSystemModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import { useMapStore } from './stores/mapStore'
import { usePrologueStore } from './stores/prologueStore'
import StartScene from './components/StartScene.vue'
import GameScene from './components/GameScene.vue'
import EndScene from './components/EndScene.vue'
import MapExplore from './components/MapExplore.vue'
import PrologueScene from './components/PrologueScene.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import ArchiveModal from './components/ArchiveModal.vue'
import JournalModal from './components/JournalModal.vue'
import JournalEditor from './components/JournalEditor.vue'
import KeyChoiceModal from './components/KeyChoiceModal.vue'
import LeaderboardModal from './components/LeaderboardModal.vue'
import BadgeModal from './components/BadgeModal.vue'
import MemoryArchiveModal from './components/MemoryArchiveModal.vue'
import LetterSystemModal from './components/LetterSystemModal.vue'

const gameStore = useGameStore()
const mapStore = useMapStore()
const prologueStore = usePrologueStore()
const gameState = computed(() => gameStore.gameState)
const isMapMode = computed(() => mapStore.isMapMode)
const isPrologueMode = computed(() => prologueStore.isActive)
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
