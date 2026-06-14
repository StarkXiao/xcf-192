import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStoryStore } from './storyStore'
import { useSaveStore } from './saveStore'
import { useArchiveStore } from './archiveStore'
import { useMoodStore } from './moodStore'
import { useTimeStore } from './timeStore'
import { useMusicStore } from './musicStore'
import { useChallengeStore } from './challengeStore'

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
  const showJournalModal = ref(false)
  const currentChapterId = ref(1)
  const showChapterNarration = ref(false)
  const currentNarrationChapter = ref(null)
  const showChapterUnlockHint = ref(false)
  const unlockHintChapter = ref(null)
  const madeChoices = ref([])
  const endingWeights = ref({})
  const foundHiddenItems = ref([])
  const itemInspectCount = ref({})
  const showKeyChoiceModal = ref(false)
  const currentKeyChoice = ref(null)
  const keyChoiceResult = ref(null)
  const showKeyChoiceResult = ref(false)
  const triggeredFakeClues = ref([])
  const fakeClueMessage = ref(null)
  const showFakeClueModal = ref(false)
  const currentFakeClue = ref(null)
  const recentlyUnlockedFogItems = ref([])

  const storyStore = useStoryStore()
  const saveStore = useSaveStore()
  const archiveStore = useArchiveStore()
  const moodStore = useMoodStore()
  const timeStore = useTimeStore()
  const musicStore = useMusicStore()
  const challengeStore = useChallengeStore()

  const moodStateName = computed(() => moodStore.moodStateName)
  const moodStateColor = computed(() => moodStore.moodStateColor)
  const moodPercent = computed(() => moodStore.moodPercent)
  const moodValue = computed(() => moodStore.moodValue)
  const moodStateId = computed(() => moodStore.moodStateId)
  const musicLayer = computed(() => moodStore.musicLayer)
  const textTone = computed(() => moodStore.textTone)
  const hintIntensity = computed(() => moodStore.hintIntensity)
  const combinedMusicContext = computed(() => musicStore.musicContext)
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

  const foundHiddenItemsCount = computed(() => foundHiddenItems.value.length)
  const totalHiddenItems = computed(() => storyStore.getTotalHiddenItemsCount())

  const dominantEndingWeights = computed(() => {
    const weights = endingWeights.value
    const sorted = Object.entries(weights).sort((a, b) => b[1] - a[1])
    return sorted.slice(0, 3)
  })

  const hasMadeChoice = (choiceOptionId) => {
    return madeChoices.value.includes(choiceOptionId)
  }

  const isChoiceMadeFor = (choiceId) => {
    const choice = storyStore.getKeyChoiceById(choiceId)
    if (!choice) return false
    return choice.options.some(opt => madeChoices.value.includes(opt.id))
  }

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

  const visibleFakeCluesForCurrentScene = computed(() => {
    const scene = currentScene.value
    if (!scene) return []
    const fakeClues = storyStore.getFakeCluesBySceneId(scene.id)
    return fakeClues.filter(fc => 
      storyStore.isFakeClueVisibleAtTime(fc, timeStore.currentHour) &&
      !triggeredFakeClues.value.includes(fc.id)
    )
  })

  const foggedItemsForCurrentScene = computed(() => {
    const scene = currentScene.value
    if (!scene) return []
    const fogItems = storyStore.getFogHiddenItemsBySceneId(scene.id)
    return fogItems.map(fhi => {
      const item = storyStore.getItemById(fhi.itemId)
      const status = storyStore.checkFogItemUnlock(
        fhi,
        foundItems.value,
        triggeredMemories.value.length,
        timeStore.currentTimePeriod,
        currentChapterId.value
      )
      return {
        ...fhi,
        item,
        unlocked: status.unlocked,
        status
      }
    })
  })

  const isAnyFogItemRecentlyUnlocked = computed(() => {
    return recentlyUnlockedFogItems.value.length > 0
  })

  const isChallengeMode = computed(() => challengeStore.isChallengeMode)
  const challengeBadgesCount = computed(() => challengeStore.unlockedBadgesCount)
  const challengeStreak = computed(() => challengeStore.challengeStreak)
  const todayDate = computed(() => challengeStore.todayDate)

  function checkChapterProgress() {
    const calculatedChapter = storyStore.getCurrentChapter(memoryProgressPercent.value)
    if (calculatedChapter && calculatedChapter.id > currentChapterId.value) {
      advanceChapter(calculatedChapter.id)
    }
    musicStore.updateContext({ memoryProgress: memoryProgressPercent.value })
  }

  function triggerMoodChange(emotion) {
    const result = moodStore.modifyMoodByEmotion(emotion)
    if (result) {
      lastMoodChange.value = result
      showMoodChange.value = true
      musicStore.updateContext({ moodStateId: moodStore.moodStateId })
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
    musicStore.updateContext({
      chapterId: newChapterId,
      memoryProgress: memoryProgressPercent.value,
      dominantEndingType: dominantEndingWeights.value[0]?.[0] || 'neutral'
    })

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
      madeChoices.value = savedGame.madeChoices || []
      endingWeights.value = savedGame.endingWeights || {}
      foundHiddenItems.value = savedGame.foundHiddenItems || []
      itemInspectCount.value = savedGame.itemInspectCount || {}
      triggeredFakeClues.value = savedGame.triggeredFakeClues || []
      if (savedGame.moodData) {
        moodStore.loadSaveData(savedGame.moodData)
      }
      if (savedGame.timeData) {
        timeStore.loadSaveData(savedGame.timeData)
      }
      if (savedGame.challengeMode) {
        challengeStore.startChallengeMode()
      }
    } else {
      resetGame()
    }
    gameState.value = 'playing'
    startTimer()
    timeStore.startTimeFlow()

    musicStore.updateContext({
      gameState: 'playing',
      sceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      moodStateId: moodStore.moodStateId,
      timePeriod: timeStore.currentTimePeriod,
      chapterId: currentChapterId.value,
      memoryProgress: memoryProgressPercent.value,
      dominantEndingType: dominantEndingWeights.value[0]?.[0] || 'neutral'
    })

    if (challengeStore.isChallengeMode) {
      challengeStore.recordSceneVisit(currentSceneId.value)
    }

    if (!savedGame) {
      setTimeout(() => {
        currentNarrationChapter.value = storyStore.getChapterById(1)
        showChapterNarration.value = true
        pauseGame()
      }, 500)
    }
  }

  function startChallengeGame() {
    resetGame()
    challengeStore.startChallengeMode()
    saveStore.saveGame({
      currentSceneId: currentSceneId.value,
      timeRemaining: timeRemaining.value,
      foundItems: [...foundItems.value],
      triggeredMemories: [...triggeredMemories.value],
      craftedItems: [...craftedItems.value],
      unlockedHiddenMemories: [...unlockedHiddenMemories.value],
      currentChapterId: currentChapterId.value,
      madeChoices: [...madeChoices.value],
      endingWeights: { ...endingWeights.value },
      foundHiddenItems: [...foundHiddenItems.value],
      itemInspectCount: { ...itemInspectCount.value },
      triggeredFakeClues: [...triggeredFakeClues.value],
      moodData: moodStore.getSaveData(),
      timeData: timeStore.getSaveData(),
      challengeMode: true
    })
    startGame()
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
    madeChoices.value = branchData.madeChoices || []
    endingWeights.value = branchData.endingWeights || {}
    foundHiddenItems.value = branchData.foundHiddenItems || []
    itemInspectCount.value = branchData.itemInspectCount || {}
    triggeredFakeClues.value = branchData.triggeredFakeClues || []
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
    madeChoices.value = []
    endingWeights.value = {}
    foundHiddenItems.value = []
    itemInspectCount.value = {}
    triggeredFakeClues.value = []
    fakeClueMessage.value = null
    showFakeClueModal.value = false
    currentFakeClue.value = null
    recentlyUnlockedFogItems.value = []
    challengeStore.exitChallengeMode()
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
      if (challengeStore.isChallengeMode) {
        challengeStore.recordSceneVisit(sceneId)
      }
      musicStore.updateContext({ sceneId })
      saveProgress()
      triggerFinalKeyChoiceIfReady()
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

      const keyChoice = storyStore.getKeyChoiceByTriggerItem(itemId, currentChapterId.value)
      if (keyChoice && !isChoiceMadeFor(keyChoice.id)) {
        setTimeout(() => {
          openKeyChoice(keyChoice)
        }, 500)
      }

      checkFogItemUnlocks()

      archiveToGlobal()
      saveProgress()
      checkChapterProgress()
      checkGameComplete()

      musicStore.updateContext({
        memoryProgress: memoryProgressPercent.value,
        moodStateId: moodStore.moodStateId
      })
    }
  }

  function clickFakeClue(fcId) {
    if (triggeredFakeClues.value.includes(fcId)) return null
    
    const fakeClue = storyStore.getFakeClueById(fcId)
    if (!fakeClue) return null

    triggeredFakeClues.value.push(fcId)

    if (fakeClue.timeCost && timeRemaining.value > 0) {
      timeRemaining.value = Math.max(0, timeRemaining.value - fakeClue.timeCost)
    }

    if (fakeClue.moodEffect) {
      moodStore.setMood(moodStore.moodValue + fakeClue.moodEffect)
      const emotion = fakeClue.moodEffect > 0 ? 'warm' : 'sad'
      triggerMoodChange(emotion)
    }

    currentFakeClue.value = fakeClue
    showFakeClueModal.value = true
    pauseGame()

    saveProgress()
    return fakeClue
  }

  function closeFakeClueModal() {
    showFakeClueModal.value = false
    currentFakeClue.value = null
    resumeGame()
  }

  function isFakeClueTriggered(fcId) {
    return triggeredFakeClues.value.includes(fcId)
  }

  function isItemFogHidden(itemId) {
    const fogItem = storyStore.getFogHiddenItemByItemId(itemId)
    if (!fogItem) return false
    
    const status = storyStore.checkFogItemUnlock(
      fogItem,
      foundItems.value,
      triggeredMemories.value.length,
      timeStore.currentTimePeriod,
      currentChapterId.value
    )
    return !status.unlocked
  }

  function getFogItemStatus(itemId) {
    const fogItem = storyStore.getFogHiddenItemByItemId(itemId)
    if (!fogItem) return { unlocked: true, reason: 'no_fog_item' }
    
    return storyStore.checkFogItemUnlock(
      fogItem,
      foundItems.value,
      triggeredMemories.value.length,
      timeStore.currentTimePeriod,
      currentChapterId.value
    )
  }

  function checkFogItemUnlocks() {
    const scene = currentScene.value
    if (!scene) return

    const fogItems = storyStore.getFogHiddenItemsBySceneId(scene.id)
    const newlyUnlocked = []

    for (const fhi of fogItems) {
      const status = storyStore.checkFogItemUnlock(
        fhi,
        foundItems.value,
        triggeredMemories.value.length,
        timeStore.currentTimePeriod,
        currentChapterId.value
      )
      
      if (status.unlocked && !recentlyUnlockedFogItems.value.includes(fhi.itemId)) {
        if (!foundItems.value.includes(fhi.itemId)) {
          newlyUnlocked.push(fhi.itemId)
          recentlyUnlockedFogItems.value.push(fhi.itemId)
          
          setTimeout(() => {
            const idx = recentlyUnlockedFogItems.value.indexOf(fhi.itemId)
            if (idx > -1) {
              recentlyUnlockedFogItems.value.splice(idx, 1)
            }
          }, 3000)
        }
      }
    }

    return newlyUnlocked
  }

  function inspectItem(itemId) {
    if (!itemInspectCount.value[itemId]) {
      itemInspectCount.value[itemId] = 0
    }
    itemInspectCount.value[itemId]++

    const hiddenItem = storyStore.checkHiddenItemUnlock(
      itemId,
      itemInspectCount.value[itemId],
      timeStore.currentTimePeriod,
      foundItems.value
    )
    if (hiddenItem && !foundHiddenItems.value.includes(hiddenItem.id)) {
      foundHiddenItems.value.push(hiddenItem.id)
      triggerMoodChange('touched')
      archiveStore.recordHiddenItem(hiddenItem.id)
      saveProgress()
      return hiddenItem
    }
    return null
  }

  function isHiddenItemFound(hiId) {
    return foundHiddenItems.value.includes(hiId)
  }

  function openKeyChoice(choice) {
    currentKeyChoice.value = choice
    showKeyChoiceModal.value = true
    pauseGame()
  }

  function closeKeyChoice() {
    showKeyChoiceModal.value = false
    currentKeyChoice.value = null
    resumeGame()
  }

  function makeChoice(choiceOptionId) {
    const choice = currentKeyChoice.value
    if (!choice) return null

    const option = choice.options.find(o => o.id === choiceOptionId)
    if (!option) return null

    if (option.requiredEndingWeights) {
      for (const [weight, required] of Object.entries(option.requiredEndingWeights)) {
        if ((endingWeights.value[weight] || 0) < required) {
          return { success: false, reason: '你还没有足够的心路历程来做出这个选择' }
        }
      }
    }

    madeChoices.value.push(choiceOptionId)

    if (option.effects) {
      if (option.effects.mood) {
        triggerMoodChange(option.effects.mood > 0 ? 'warm' : 'sad')
        moodStore.setMood(moodStore.moodValue + option.effects.mood)
      }
      if (option.effects.endingWeight) {
        for (const [weight, value] of Object.entries(option.effects.endingWeight)) {
          endingWeights.value[weight] = (endingWeights.value[weight] || 0) + value
        }
        musicStore.updateContext({ dominantEndingType: dominantEndingWeights.value[0]?.[0] || 'neutral' })
      }
    }

    keyChoiceResult.value = option
    showKeyChoiceResult.value = true
    saveProgress()

    return { success: true, resultText: option.resultText }
  }

  function closeKeyChoiceResult() {
    showKeyChoiceResult.value = false
    keyChoiceResult.value = null
    closeKeyChoice()
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
        madeChoices: [...madeChoices.value],
        endingWeights: { ...endingWeights.value },
        foundHiddenItems: [...foundHiddenItems.value],
        itemInspectCount: { ...itemInspectCount.value },
        triggeredFakeClues: [...triggeredFakeClues.value],
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

  function triggerFinalKeyChoiceIfReady() {
    if (currentChapterId.value >= 5 && currentSceneId.value === 'lake' && !isChoiceMadeFor('kc_final')) {
      const finalChoice = storyStore.getKeyChoiceById('kc_final')
      if (finalChoice) {
        setTimeout(() => {
          openKeyChoice(finalChoice)
        }, 1000)
        return true
      }
    }
    return false
  }

  function checkGameComplete() {
    const allItemsFound = foundCount.value >= totalItems.value
    const allCrafted = craftedCount.value >= totalCraftable.value
    const itemProgress = totalItems.value > 0 ? foundCount.value / totalItems.value : 0
    const isFinalChapterUnlocked = currentChapterId.value >= 5
    const hasEnoughProgress = itemProgress >= 0.4 && currentChapterId.value >= 3

    if (allItemsFound && allCrafted) {
      if (!triggerFinalKeyChoiceIfReady()) {
        setTimeout(() => {
          endGame()
        }, 2000)
      }
      return
    }

    if (allItemsFound) {
      if (!triggerFinalKeyChoiceIfReady()) {
        setTimeout(() => {
          endGame()
        }, 3000)
      }
      return
    }

    if (isFinalChapterUnlocked) {
      if (currentSceneId.value === 'lake' && !isChoiceMadeFor('kc_final')) {
        triggerFinalKeyChoiceIfReady()
      }
      return
    }

    if (hasEnoughProgress && itemProgress >= 0.6) {
      setTimeout(() => {
        endGame()
      }, 5000)
    }
  }

  function endGame() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }

    const timeUsed = 300 - timeRemaining.value
    const ending = storyStore.getReunionEnding({
      foundCount: foundCount.value,
      totalItems: totalItems.value,
      timeUsed,
      craftedItems: [...craftedItems.value],
      currentChapterId: currentChapterId.value,
      moodValue: moodStore.moodValue,
      triggeredMemoriesCount: triggeredMemories.value.length,
      unlockedHMCount: unlockedHiddenMemories.value.length,
      totalHMCount: storyStore.getAllHiddenMemories().length,
      madeChoices: [...madeChoices.value],
      endingWeights: { ...endingWeights.value },
      foundHiddenItemsCount: foundHiddenItems.value.length,
      totalHiddenItemsCount: totalHiddenItems.value
    })

    archiveStore.recordEnding(ending)
    archiveToGlobal()

    if (challengeStore.isChallengeMode) {
      challengeStore.updateStreak()
      
      const result = {
        foundCount: foundCount.value,
        totalItems: totalItems.value,
        timeUsed,
        craftedCount: craftedCount.value,
        totalCraftable: totalCraftable.value,
        unlockedHMCount: unlockedHiddenMemories.value.length,
        totalHMCount: storyStore.getAllHiddenMemories().length,
        foundHiddenItemsCount: foundHiddenItems.value.length,
        totalHiddenItemsCount: totalHiddenItems.value,
        endingType: ending.type,
        moodValue: moodStore.moodValue
      }
      
      result.score = challengeStore.calculateChallengeScore(result)
      const lbResult = challengeStore.submitToLeaderboard(result)
      result.rank = lbResult.rank
      
      challengeStore.checkAndUnlockBadges(result)
    }

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
        madeChoices: [...madeChoices.value],
        endingWeights: { ...endingWeights.value },
        foundHiddenItems: [...foundHiddenItems.value],
        itemInspectCount: { ...itemInspectCount.value },
        triggeredFakeClues: [...triggeredFakeClues.value],
        moodData: moodStore.getSaveData(),
        timeData: timeStore.getSaveData()
      }
    )

    timeStore.stopTimeFlow()
    saveStore.clearSave()

    musicStore.updateContext({ gameState: 'end' })
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
      madeChoices: [...madeChoices.value],
      endingWeights: { ...endingWeights.value },
      foundHiddenItems: [...foundHiddenItems.value],
      itemInspectCount: { ...itemInspectCount.value },
      triggeredFakeClues: [...triggeredFakeClues.value],
      moodData: moodStore.getSaveData(),
      timeData: timeStore.getSaveData(),
      challengeMode: challengeStore.isChallengeMode
    })
  }

  function returnToStart() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    timeStore.stopTimeFlow()
    musicStore.updateContext({ gameState: 'start' })
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

  function openJournal() {
    showJournalModal.value = true
  }

  function closeJournal() {
    showJournalModal.value = false
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
    showJournalModal,
    currentChapterId,
    showChapterNarration,
    currentNarrationChapter,
    showChapterUnlockHint,
    unlockHintChapter,
    madeChoices,
    endingWeights,
    foundHiddenItems,
    itemInspectCount,
    showKeyChoiceModal,
    currentKeyChoice,
    keyChoiceResult,
    showKeyChoiceResult,
    foundHiddenItemsCount,
    totalHiddenItems,
    dominantEndingWeights,
    hasMadeChoice,
    isChoiceMadeFor,
    triggeredFakeClues,
    fakeClueMessage,
    showFakeClueModal,
    currentFakeClue,
    recentlyUnlockedFogItems,
    visibleFakeCluesForCurrentScene,
    foggedItemsForCurrentScene,
    isAnyFogItemRecentlyUnlocked,
    moodStateName,
    moodStateColor,
    moodPercent,
    moodValue,
    moodStateId,
    musicLayer,
    textTone,
    hintIntensity,
    combinedMusicContext,
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
    isChallengeMode,
    challengeBadgesCount,
    challengeStreak,
    todayDate,
    startGame,
    startGameFromBranch,
    startChallengeGame,
    resetGame,
    pauseGame,
    resumeGame,
    changeScene,
    findItem,
    inspectItem,
    isHiddenItemFound,
    clickFakeClue,
    closeFakeClueModal,
    isFakeClueTriggered,
    isItemFogHidden,
    getFogItemStatus,
    checkFogItemUnlocks,
    openKeyChoice,
    closeKeyChoice,
    makeChoice,
    closeKeyChoiceResult,
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
    openJournal,
    closeJournal,
    checkChapterProgress,
    advanceChapter,
    closeChapterNarration,
    getAvailableScenesForChapter,
    isSceneAccessible,
    getCurrentSceneDescription,
    triggerMoodChange,
    clearMoodChange,
    triggerFinalKeyChoiceIfReady
  }
})
