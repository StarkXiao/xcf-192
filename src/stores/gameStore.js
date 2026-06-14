import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStoryStore } from './storyStore'
import { useSaveStore } from './saveStore'
import { useArchiveStore } from './archiveStore'

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
  const craftedItems = ref([])
  const unlockedHiddenMemories = ref([])
  const showCraftingModal = ref(false)
  const craftResultMessage = ref(null)
  const showArchiveModal = ref(false)

  const storyStore = useStoryStore()
  const saveStore = useSaveStore()
  const archiveStore = useArchiveStore()

  const totalItems = computed(() => {
    return storyStore.getTotalItemCount()
  })

  const foundCount = computed(() => foundItems.value.length)

  const craftedCount = computed(() => craftedItems.value.length)

  const totalCraftable = computed(() => storyStore.getTotalCraftedCount())

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

  const totalProgress = computed(() => {
    const itemProgress = totalItems.value > 0 ? foundCount.value / totalItems.value : 0
    const craftProgress = totalCraftable.value > 0 ? craftedCount.value / totalCraftable.value : 0
    return Math.round(((itemProgress * 0.6) + (craftProgress * 0.4)) * 100)
  })

  function startGame() {
    const savedGame = saveStore.loadGame()
    if (savedGame) {
      currentSceneId.value = savedGame.currentSceneId
      timeRemaining.value = savedGame.timeRemaining
      foundItems.value = savedGame.foundItems || []
      triggeredMemories.value = savedGame.triggeredMemories || []
      craftedItems.value = savedGame.craftedItems || []
      unlockedHiddenMemories.value = savedGame.unlockedHiddenMemories || []
    } else {
      resetGame()
    }
    gameState.value = 'playing'
    startTimer()
  }

  function startGameFromBranch(branchId) {
    const branchData = archiveStore.loadBranchSave(branchId)
    if (!branchData) return false

    currentSceneId.value = branchData.currentSceneId || 'station'
    timeRemaining.value = branchData.timeRemaining || 300
    foundItems.value = branchData.foundItems || []
    triggeredMemories.value = branchData.triggeredMemories || []
    craftedItems.value = branchData.craftedItems || []
    unlockedHiddenMemories.value = branchData.unlockedHiddenMemories || []
    isPaused.value = false

    saveStore.saveGame({
      currentSceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      foundItems: [...foundItems.value],
      triggeredMemories: [...triggeredMemories.value],
      craftedItems: [...craftedItems.value],
      unlockedHiddenMemories: [...unlockedHiddenMemories.value]
    })

    gameState.value = 'playing'
    startTimer()
    return true
  }

  function resetGame() {
    currentSceneId.value = 'station'
    timeRemaining.value = 300
    foundItems.value = []
    triggeredMemories.value = []
    craftedItems.value = []
    unlockedHiddenMemories.value = []
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
      archiveToGlobal()
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

  function openCrafting() {
    showCraftingModal.value = true
    pauseGame()
  }

  function closeCrafting() {
    showCraftingModal.value = false
    resumeGame()
  }

  function canCraftItem(recipeId) {
    const recipe = storyStore.getRecipeById(recipeId)
    if (!recipe) return false
    if (craftedItems.value.includes(recipe.resultId)) return false
    return recipe.ingredients.every(ing => foundItems.value.includes(ing))
  }

  function craftItem(recipeId) {
    const recipe = storyStore.getRecipeById(recipeId)
    if (!recipe || !canCraftItem(recipeId)) return null

    craftedItems.value.push(recipe.resultId)

    const craftedItem = storyStore.getCraftedItemById(recipe.resultId)
    craftResultMessage.value = craftedItem

    const hiddenMemory = storyStore.getHiddenMemoryByCraftId(recipe.resultId)
    if (hiddenMemory && !unlockedHiddenMemories.value.includes(hiddenMemory.id)) {
      unlockedHiddenMemories.value.push(hiddenMemory.id)
      setTimeout(() => {
        craftResultMessage.value = null
        showMemory(hiddenMemory)
      }, 2500)
    } else {
      setTimeout(() => {
        craftResultMessage.value = null
      }, 2500)
    }

    const craftedName = craftedItem ? craftedItem.name : recipe.resultId
    archiveStore.createBranchSave(
      `合成「${craftedName}」后`,
      {
        currentSceneId: currentSceneId.value,
        timeRemaining: timeRemaining.value,
        foundItems: [...foundItems.value],
        triggeredMemories: [...triggeredMemories.value],
        craftedItems: [...craftedItems.value],
        unlockedHiddenMemories: [...unlockedHiddenMemories.value]
      }
    )

    archiveToGlobal()
    saveProgress()
    checkGameComplete()
    return craftedItem
  }

  function clearCraftResult() {
    craftResultMessage.value = null
  }

  function archiveToGlobal() {
    if (craftedItems.value.length > 0) {
      archiveStore.recordCraftedItems(craftedItems.value)
    }
    if (unlockedHiddenMemories.value.length > 0) {
      archiveStore.recordHiddenMemories(unlockedHiddenMemories.value)
    }
    if (triggeredMemories.value.length > 0) {
      archiveStore.recordTriggeredMemories(triggeredMemories.value)
    }
  }

  function checkGameComplete() {
    const allItemsFound = foundCount.value >= totalItems.value
    const allCrafted = craftedCount.value >= totalCraftable.value
    if (allItemsFound && allCrafted) {
      setTimeout(() => {
        endGame()
      }, 2000)
    }
  }

  function endGame() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }

    const timeUsed = 300 - timeRemaining.value
    const ending = storyStore.getEndingData(
      foundCount.value,
      totalItems.value,
      timeUsed,
      [...craftedItems.value]
    )

    archiveStore.recordEnding(ending)
    archiveToGlobal()

    const endingLabel = ending?.isSpecial
      ? `达成「${ending.title}」`
      : `抵达结局：${ending?.title || '未知'}`
    archiveStore.createBranchSave(
      endingLabel,
      {
        currentSceneId: currentSceneId.value,
        timeRemaining: timeRemaining.value,
        foundItems: [...foundItems.value],
        triggeredMemories: [...triggeredMemories.value],
        craftedItems: [...craftedItems.value],
        unlockedHiddenMemories: [...unlockedHiddenMemories.value]
      }
    )

    saveStore.clearSave()

    gameState.value = 'end'
  }

  function saveProgress() {
    saveStore.saveGame({
      currentSceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      foundItems: [...foundItems.value],
      triggeredMemories: [...triggeredMemories.value],
      craftedItems: [...craftedItems.value],
      unlockedHiddenMemories: [...unlockedHiddenMemories.value]
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

  function isCrafted(itemId) {
    return craftedItems.value.includes(itemId)
  }

  function isHiddenMemoryUnlocked(hmId) {
    return unlockedHiddenMemories.value.includes(hmId)
  }

  function openArchive() {
    showArchiveModal.value = true
  }

  function closeArchive() {
    showArchiveModal.value = false
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
    craftedItems,
    unlockedHiddenMemories,
    showCraftingModal,
    craftResultMessage,
    showArchiveModal,
    totalItems,
    foundCount,
    craftedCount,
    totalCraftable,
    progress,
    currentScene,
    formattedTime,
    isTimeWarning,
    totalProgress,
    startGame,
    startGameFromBranch,
    resetGame,
    pauseGame,
    resumeGame,
    changeScene,
    findItem,
    closeMemory,
    openCrafting,
    closeCrafting,
    canCraftItem,
    craftItem,
    clearCraftResult,
    endGame,
    saveProgress,
    returnToStart,
    toggleMusic,
    toggleSound,
    isItemFound,
    isCrafted,
    isHiddenMemoryUnlocked,
    openArchive,
    closeArchive
  }
})
