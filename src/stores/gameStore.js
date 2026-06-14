import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStoryStore } from './storyStore'
import { useSaveStore } from './saveStore'
import { useArchiveStore } from './archiveStore'
import { useMoodStore } from './moodStore'
import { useTimeStore } from './timeStore'

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
  const currentChapterId = ref(1)
  const showChapterNarration = ref(false)
  const currentNarrationChapter = ref(null)
  const showChapterUnlockHint = ref(false)
  const unlockHintChapter = ref(null)

  const storyStore = useStoryStore()
  const saveStore = useSaveStore()
  const archiveStore = useArchiveStore()
  const moodStore = useMoodStore()
  const timeStore = useTimeStore()

  const moodStateName = computed(() => moodStore.moodStateName)
  const moodStateColor = computed(() => moodStore.moodStateColor)
  const moodPercent = computed(() => moodStore.moodPercent)
  const moodValue = computed(() => moodStore.moodValue)
  const moodStateId = computed(() => moodStore.moodStateId)
  const musicLayer = computed(() => moodStore.musicLayer)
  const textTone = computed(() => moodStore.textTone)
  const hintIntensity = computed(() => moodStore.hintIntensity)
  const lastMoodChange = ref(null)
  const showMoodChange = ref(false)

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

  const memoryProgressPercent = computed(() => {
    return storyStore.getMemoryPercent(foundCount.value, totalItems.value)
  })

  const currentChapter = computed(() => {
    return storyStore.getChapterById(currentChapterId.value)
  })

  const nextChapter = computed(() => {
    return storyStore.getNextChapter(memoryProgressPercent.value)
  })

  const chapterProgress = computed(() => {
    return storyStore.getChapterProgress(memoryProgressPercent.value)
  })

  const currentChapterAtmosphere = computed(() => {
    return storyStore.getChapterAtmosphere(currentChapterId.value)
  })

  const isFinalChapter = computed(() => {
    const chapter = currentChapter.value
    return chapter ? chapter.isFinalChapter : false
  })

  const currentTimePeriod = computed(() => timeStore.currentTimePeriod)
  const currentPeriodConfig = computed(() => timeStore.currentPeriodConfig)
  const formattedGameTime = computed(() => timeStore.formattedTime)
  const isNight = computed(() => timeStore.isNight)
  const isDay = computed(() => timeStore.isDay)
  const isDawn = computed(() => timeStore.isDawn)
  const isDusk = computed(() => timeStore.isDusk)
  const timeAtmosphere = computed(() => timeStore.timeAtmosphere)
  const timePeriodChanged = computed(() => timeStore.timePeriodChanged)
  const timeProgress = computed(() => timeStore.timeProgress)

  const combinedAtmosphere = computed(() => {
    const chapterAtmos = currentChapterAtmosphere.value || {}
    const timeAtmos = timeAtmosphere.value
    return {
      fogMultiplier: (chapterAtmos.fogMultiplier || 1) * (timeAtmos.fogMultiplier || 1),
      brightness: (chapterAtmos.brightness || 1) * (timeAtmos.brightness || 1),
      saturation: (chapterAtmos.saturation || 1) * (timeAtmos.saturation || 1),
      backgroundTint: timeAtmos.backgroundTint || chapterAtmos.backgroundTint,
      ambientColor: timeAtmos.ambientColor
    }
  })

  const visibleItemsForCurrentScene = computed(() => {
    const scene = currentScene.value
    if (!scene || !scene.items) return []
    return scene.items.filter(item => 
      timeStore.isItemVisibleAtTime(item, timeStore.currentHour)
    )
  })

  function checkChapterProgress() {
    const calculatedChapter = storyStore.getCurrentChapter(memoryProgressPercent.value)
    if (calculatedChapter && calculatedChapter.id > currentChapterId.value) {
      advanceChapter(calculatedChapter.id)
    }
  }

  function triggerMoodChange(emotion) {
    const result = moodStore.modifyMoodByEmotion(emotion)
    if (result) {
      lastMoodChange.value = result
      showMoodChange.value = true
      setTimeout(() => {
        showMoodChange.value = false
      }, 2000)
    }
    return result
  }

  function clearMoodChange() {
    showMoodChange.value = false
    lastMoodChange.value = null
  }

  function advanceChapter(newChapterId) {
    const chapter = storyStore.getChapterById(newChapterId)
    if (!chapter) return

    currentChapterId.value = newChapterId

    unlockHintChapter.value = chapter
    showChapterUnlockHint.value = true
    setTimeout(() => {
      showChapterUnlockHint.value = false
    }, 3000)

    setTimeout(() => {
      currentNarrationChapter.value = chapter
      showChapterNarration.value = true
      pauseGame()
    }, 500)

    if (chapter.isFinalChapter) {
      checkGameComplete()
    }

    saveProgress()
  }

  function closeChapterNarration() {
    showChapterNarration.value = false
    currentNarrationChapter.value = null
    resumeGame()
  }

  function getAvailableScenesForChapter() {
    const chapter = currentChapter.value
    if (!chapter) return []
    return storyStore.getAvailableScenes(currentSceneId.value).filter(
      scene => chapter.unlockedScenes.includes(scene.id)
    )
  }

  function isSceneAccessible(sceneId) {
    const chapterUnlocked = storyStore.isSceneUnlocked(sceneId, currentChapterId.value)
    if (!chapterUnlocked) return false
    
    const scene = storyStore.getSceneById(sceneId)
    return timeStore.isSceneAccessibleAtTime(scene, timeStore.currentHour)
  }

  function getCurrentSceneDescription() {
    const scene = currentScene.value
    if (scene && scene.timeDescriptions) {
      const period = timeStore.currentTimePeriod
      if (scene.timeDescriptions[period]) {
        return scene.timeDescriptions[period]
      }
    }
    return storyStore.getChapterSceneDescription(currentSceneId.value, currentChapterId.value)
  }

  function startGame() {
    const savedGame = saveStore.loadGame()
    if (savedGame) {
      currentSceneId.value = savedGame.currentSceneId
      timeRemaining.value = savedGame.timeRemaining
      foundItems.value = savedGame.foundItems || []
      triggeredMemories.value = savedGame.triggeredMemories || []
      craftedItems.value = savedGame.craftedItems || []
      unlockedHiddenMemories.value = savedGame.unlockedHiddenMemories || []
      currentChapterId.value = savedGame.currentChapterId || 1
      if (savedGame.moodData) {
        moodStore.loadSaveData(savedGame.moodData)
      }
      if (savedGame.timeData) {
        timeStore.loadSaveData(savedGame.timeData)
      }
    } else {
      resetGame()
    }
    gameState.value = 'playing'
    startTimer()
    timeStore.startTimeFlow()

    if (!savedGame) {
      setTimeout(() => {
        currentNarrationChapter.value = storyStore.getChapterById(1)
        showChapterNarration.value = true
        pauseGame()
      }, 500)
    }
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
    currentChapterId.value = branchData.currentChapterId || 1
    isPaused.value = false
    if (branchData.moodData) {
      moodStore.loadSaveData(branchData.moodData)
    } else {
      moodStore.resetMood()
    }
    if (branchData.timeData) {
      timeStore.loadSaveData(branchData.timeData)
    } else {
      timeStore.resetTime()
    }

    saveStore.saveGame({
      currentSceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      foundItems: [...foundItems.value],
      triggeredMemories: [...triggeredMemories.value],
      craftedItems: [...craftedItems.value],
      unlockedHiddenMemories: [...unlockedHiddenMemories.value],
      currentChapterId: currentChapterId.value,
      moodData: moodStore.getSaveData(),
      timeData: timeStore.getSaveData()
    })

    gameState.value = 'playing'
    startTimer()
    timeStore.startTimeFlow()
    return true
  }

  function resetGame() {
    currentSceneId.value = 'station'
    timeRemaining.value = 300
    foundItems.value = []
    triggeredMemories.value = []
    craftedItems.value = []
    unlockedHiddenMemories.value = []
    currentChapterId.value = 1
    isPaused.value = false
    moodStore.resetMood()
    timeStore.resetTime()
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
    timeStore.pauseTime()
  }

  function resumeGame() {
    isPaused.value = false
    timeStore.resumeTime()
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
      const period = timeStore.currentTimePeriod
      archiveStore.recordTimePeriodStat(period, 'item')
      
      const memory = storyStore.getMemoryByItemId(itemId)
      if (memory && !triggeredMemories.value.includes(memory.id)) {
        const variantMemory = timeStore.getMemoryVariant(memory, timeStore.currentHour)
        triggeredMemories.value.push(memory.id)
        archiveStore.recordTimePeriodStat(period, 'memory')
        triggerMoodChange(variantMemory.emotion)
        showMemory(variantMemory)
      }
      archiveToGlobal()
      saveProgress()
      checkChapterProgress()
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
      triggerMoodChange(hiddenMemory.emotion)
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
        unlockedHiddenMemories: [...unlockedHiddenMemories.value],
        currentChapterId: currentChapterId.value,
        moodData: moodStore.getSaveData(),
        timeData: timeStore.getSaveData()
      }
    )

    archiveToGlobal()
    saveProgress()
    checkChapterProgress()
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
      [...craftedItems.value],
      currentChapterId.value,
      moodStore.moodValue
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
        unlockedHiddenMemories: [...unlockedHiddenMemories.value],
        currentChapterId: currentChapterId.value,
        moodData: moodStore.getSaveData(),
        timeData: timeStore.getSaveData()
      }
    )

    timeStore.stopTimeFlow()
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
      unlockedHiddenMemories: [...unlockedHiddenMemories.value],
      currentChapterId: currentChapterId.value,
      moodData: moodStore.getSaveData(),
      timeData: timeStore.getSaveData()
    })
  }

  function returnToStart() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    timeStore.stopTimeFlow()
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
    currentChapterId,
    showChapterNarration,
    currentNarrationChapter,
    showChapterUnlockHint,
    unlockHintChapter,
    moodStateName,
    moodStateColor,
    moodPercent,
    moodValue,
    moodStateId,
    musicLayer,
    textTone,
    hintIntensity,
    lastMoodChange,
    showMoodChange,
    totalItems,
    foundCount,
    craftedCount,
    totalCraftable,
    progress,
    currentScene,
    formattedTime,
    isTimeWarning,
    totalProgress,
    memoryProgressPercent,
    currentChapter,
    nextChapter,
    chapterProgress,
    currentChapterAtmosphere,
    isFinalChapter,
    currentTimePeriod,
    currentPeriodConfig,
    formattedGameTime,
    isNight,
    isDay,
    isDawn,
    isDusk,
    timeAtmosphere,
    timePeriodChanged,
    timeProgress,
    combinedAtmosphere,
    visibleItemsForCurrentScene,
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
    closeArchive,
    checkChapterProgress,
    advanceChapter,
    closeChapterNarration,
    getAvailableScenesForChapter,
    isSceneAccessible,
    getCurrentSceneDescription,
    triggerMoodChange,
    clearMoodChange
  }
})
