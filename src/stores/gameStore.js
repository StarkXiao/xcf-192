import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStoryStore } from './storyStore'
import { useSaveStore } from './saveStore'

export const useGameStore = defineStore('game', () => {
  const gameState = ref('start')
  const currentSceneId = ref('station')
  const timeRemaining = ref(300)
  const isPaused = ref(false)
  const timerInterval = ref(null)
  const foundItems = ref([])
  const triggeredMemories = ref([])
  const showMemoryModal = ref(false)
  const currentMemory = ref(null)
  const musicEnabled = ref(true)
  const soundEnabled = ref(true)

  const storyStore = useStoryStore()
  const saveStore = useSaveStore()

  const totalItems = computed(() => {
    return storyStore.getTotalItemCount()
  })

  const foundCount = computed(() => foundItems.value.length)

  const progress = computed(() => {
    return totalItems.value > 0 ? (foundCount.value / totalItems.value) * 100 : 0
  })

  const currentScene = computed(() => {
    return storyStore.getSceneById(currentSceneId.value)
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const isTimeWarning = computed(() => {
    return timeRemaining.value <= 60
  })

  function startGame() {
    const savedGame = saveStore.loadGame()
    if (savedGame) {
      currentSceneId.value = savedGame.currentSceneId
      timeRemaining.value = savedGame.timeRemaining
      foundItems.value = savedGame.foundItems
      triggeredMemories.value = savedGame.triggeredMemories
    } else {
      resetGame()
    }
    gameState.value = 'playing'
    startTimer()
  }

  function resetGame() {
    currentSceneId.value = 'station'
    timeRemaining.value = 300
    foundItems.value = []
    triggeredMemories.value = []
    isPaused.value = false
    saveStore.clearSave()
  }

  function startTimer() {
    if (timerInterval.value) clearInterval(timerInterval.value)
    timerInterval.value = setInterval(() => {
      if (!isPaused.value && timeRemaining.value > 0) {
        timeRemaining.value--
        if (timeRemaining.value % 10 === 0) {
          saveProgress()
        }
        if (timeRemaining.value <= 0) {
          endGame()
        }
      }
    }, 1000)
  }

  function pauseGame() {
    isPaused.value = true
  }

  function resumeGame() {
    isPaused.value = false
  }

  function changeScene(sceneId) {
    if (storyStore.getSceneById(sceneId)) {
      currentSceneId.value = sceneId
      saveProgress()
    }
  }

  function findItem(itemId) {
    if (!foundItems.value.includes(itemId)) {
      foundItems.value.push(itemId)
      const memory = storyStore.getMemoryByItemId(itemId)
      if (memory && !triggeredMemories.value.includes(memory.id)) {
        triggeredMemories.value.push(memory.id)
        showMemory(memory)
      }
      saveProgress()
      checkGameComplete()
    }
  }

  function showMemory(memory) {
    currentMemory.value = memory
    showMemoryModal.value = true
    pauseGame()
  }

  function closeMemory() {
    showMemoryModal.value = false
    currentMemory.value = null
    resumeGame()
  }

  function checkGameComplete() {
    if (foundCount.value >= totalItems.value) {
      setTimeout(() => {
        endGame()
      }, 1500)
    }
  }

  function endGame() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    gameState.value = 'end'
    saveStore.clearSave()
  }

  function saveProgress() {
    saveStore.saveGame({
      currentSceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      foundItems: [...foundItems.value],
      triggeredMemories: [...triggeredMemories.value]
    })
  }

  function returnToStart() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    gameState.value = 'start'
  }

  function toggleMusic() {
    musicEnabled.value = !musicEnabled.value
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  function isItemFound(itemId) {
    return foundItems.value.includes(itemId)
  }

  return {
    gameState,
    currentSceneId,
    timeRemaining,
    isPaused,
    foundItems,
    triggeredMemories,
    showMemoryModal,
    currentMemory,
    musicEnabled,
    soundEnabled,
    totalItems,
    foundCount,
    progress,
    currentScene,
    formattedTime,
    isTimeWarning,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    changeScene,
    findItem,
    closeMemory,
    endGame,
    saveProgress,
    returnToStart,
    toggleMusic,
    toggleSound,
    isItemFound
  }
})
