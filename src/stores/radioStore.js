import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  RADIO_STATION,
  RADIO_PROGRAMS,
  MEMORY_FRAGMENTS,
  CITY_RUMORS,
  RADIO_QUESTS,
  RADIO_STORIES,
  RADIO_ATMOSPHERE,
  getProgramById,
  getMemoryFragmentById,
  getCityRumorById,
  getRadioQuestById,
  getRadioStoryById,
  getMemoryFragmentsByProgram,
  getCityRumorsByProgram,
  getRadioQuestsByProgram,
  getRadioStoriesByProgram,
  isProgramUnlocked,
  isMemoryFragmentUnlocked,
  isRumorUnlocked,
  isQuestUnlocked
} from '../data/radioData'

export const useRadioStore = defineStore('radio', () => {
  const isRadioOpen = ref(false)
  const isPlaying = ref(false)
  const currentProgramId = ref(null)
  const currentContentId = ref(null)
  const currentContentType = ref(null)
  const currentLineIndex = ref(0)
  const volume = ref(0.6)
  const frequency = ref(102.4)
  const isTuning = ref(false)
  const showStatic = ref(false)

  const heardMemoryFragments = ref([])
  const heardRumors = ref([])
  const activeQuests = ref([])
  const completedQuests = ref([])
  const heardStories = ref([])
  const visitedScenes = ref([])

  const questProgress = ref({})
  const radioUnlocked = ref(false)
  const radioFirstTime = ref(true)

  const radioStation = computed(() => RADIO_STATION)

  const currentProgram = computed(() => {
    if (!currentProgramId.value) return null
    return getProgramById(currentProgramId.value)
  })

  const currentContent = computed(() => {
    if (!currentContentId.value || !currentContentType.value) return null

    switch (currentContentType.value) {
      case 'memory':
        return getMemoryFragmentById(currentContentId.value)
      case 'rumor':
        return getCityRumorById(currentContentId.value)
      case 'quest':
        return getRadioQuestById(currentContentId.value)
      case 'story':
        return getRadioStoryById(currentContentId.value)
      default:
        return null
    }
  })

  const unlockedPrograms = computed(() => {
    const gameState = getGameStateSnapshot()
    return RADIO_PROGRAMS.filter(p => isProgramUnlocked(p, gameState))
  })

  const currentProgramContents = computed(() => {
    if (!currentProgramId.value) return []
    const program = getProgramById(currentProgramId.value)
    if (!program) return []

    const gameState = getGameStateSnapshot()

    switch (program.type) {
      case 'memory':
        return MEMORY_FRAGMENTS
          .filter(m => m.programId === currentProgramId.value)
          .map(m => ({
            ...m,
            type: 'memory',
            unlocked: isMemoryFragmentUnlocked(m, gameState),
            heard: heardMemoryFragments.value.includes(m.id)
          }))
      case 'rumor':
        return CITY_RUMORS
          .filter(r => r.programId === currentProgramId.value)
          .map(r => ({
            ...r,
            type: 'rumor',
            unlocked: isRumorUnlocked(r, gameState),
            heard: heardRumors.value.includes(r.id)
          }))
      case 'quest':
        return RADIO_QUESTS
          .filter(q => q.programId === currentProgramId.value)
          .map(q => ({
            ...q,
            type: 'quest',
            unlocked: isQuestUnlocked(q, gameState),
            active: activeQuests.value.includes(q.id),
            completed: completedQuests.value.includes(q.id)
          }))
      case 'story':
        return RADIO_STORIES
          .filter(s => s.programId === currentProgramId.value)
          .map(s => ({
            ...s,
            type: 'story',
            unlocked: isQuestUnlocked(s, gameState),
            heard: heardStories.value.includes(s.id)
          }))
      case 'atmosphere':
        return RADIO_ATMOSPHERE
          .filter(a => a.programId === currentProgramId.value)
          .map(a => ({
            ...a,
            type: 'atmosphere',
            unlocked: isQuestUnlocked(a, gameState)
          }))
      default:
        return []
    }
  })

  const activeQuestCount = computed(() => activeQuests.value.length)

  const completedQuestCount = computed(() => completedQuests.value.length)

  const totalHeardFragments = computed(() => heardMemoryFragments.value.length)

  const totalHeardRumors = computed(() => heardRumors.value.length)

  const _cachedGameState = ref({
    currentChapterId: 1,
    foundItems: [],
    triggeredMemories: [],
    moodStateId: 'calm',
    visitedScenes: [],
    currentSceneId: null,
    currentTimePeriod: 'day'
  })

  const _onContentPlayed = ref(null)
  const _onQuestCompleted = ref(null)

  function getGameStateSnapshot() {
    return { ..._cachedGameState.value }
  }

  function updateGameStateReference(gameState) {
    const cache = { ..._cachedGameState.value }
    if (gameState.currentChapterId !== undefined) {
      cache.currentChapterId = gameState.currentChapterId
    }
    if (gameState.foundItems) {
      cache.foundItems = [...gameState.foundItems]
    }
    if (gameState.triggeredMemories) {
      cache.triggeredMemories = [...gameState.triggeredMemories]
    }
    if (gameState.moodStateId !== undefined) {
      cache.moodStateId = gameState.moodStateId
    }
    if (gameState.visitedScenes) {
      cache.visitedScenes = [...gameState.visitedScenes]
    }
    if (gameState.currentSceneId !== undefined) {
      cache.currentSceneId = gameState.currentSceneId
    }
    if (gameState.currentTimePeriod !== undefined) {
      cache.currentTimePeriod = gameState.currentTimePeriod
    }
    _cachedGameState.value = cache
  }

  function setOnContentPlayed(callback) {
    _onContentPlayed.value = callback
  }

  function setOnQuestCompleted(callback) {
    _onQuestCompleted.value = callback
  }

  function unlockRadio() {
    radioUnlocked.value = true
  }

  function openRadio() {
    if (!radioUnlocked.value) return false
    isRadioOpen.value = true
    if (!currentProgramId.value && unlockedPrograms.value.length > 0) {
      selectProgram(unlockedPrograms.value[0].id)
    }
    return true
  }

  function closeRadio() {
    isRadioOpen.value = false
    stopPlayback()
  }

  function selectProgram(programId) {
    const program = getProgramById(programId)
    if (!program) return false

    const gameState = getGameStateSnapshot()
    if (!isProgramUnlocked(program, gameState)) return false

    currentProgramId.value = programId
    currentContentId.value = null
    currentContentType.value = null
    currentLineIndex.value = 0
    stopPlayback()
    return true
  }

  function playContent(contentId, contentType) {
    currentContentId.value = contentId
    currentContentType.value = contentType
    currentLineIndex.value = 0
    isPlaying.value = true

    if (contentType === 'memory' && !heardMemoryFragments.value.includes(contentId)) {
      heardMemoryFragments.value.push(contentId)
    }
    if (contentType === 'rumor' && !heardRumors.value.includes(contentId)) {
      heardRumors.value.push(contentId)
    }
    if (contentType === 'story' && !heardStories.value.includes(contentId)) {
      heardStories.value.push(contentId)
    }

    if (_onContentPlayed.value) {
      const contentData = currentContent.value
      if (contentData) {
        _onContentPlayed.value(contentType, contentData)
      }
    }

    showStaticEffect()
  }

  function stopPlayback() {
    isPlaying.value = false
  }

  function togglePlayPause() {
    isPlaying.value = !isPlaying.value
  }

  function nextLine() {
    if (!currentContent.value) return

    const lines = getCurrentContentLines()
    if (currentLineIndex.value < lines.length - 1) {
      currentLineIndex.value++
    }
  }

  function prevLine() {
    if (currentLineIndex.value > 0) {
      currentLineIndex.value--
    }
  }

  function getCurrentContentLines() {
    const content = currentContent.value
    if (!content) return []

    if (content.voiceLines) return content.voiceLines
    if (content.lines) return content.lines
    if (content.description) return [content.description]
    return []
  }

  function showStaticEffect() {
    showStatic.value = true
    setTimeout(() => {
      showStatic.value = false
    }, 300)
  }

  function tuneFrequency(delta) {
    isTuning.value = true
    frequency.value = Math.max(88, Math.min(108, frequency.value + delta))
    showStaticEffect()

    setTimeout(() => {
      isTuning.value = false
    }, 200)
  }

  function setFrequency(freq) {
    frequency.value = Math.max(88, Math.min(108, freq))
    showStaticEffect()
  }

  function acceptQuest(questId) {
    if (activeQuests.value.includes(questId)) return false
    if (completedQuests.value.includes(questId)) return false

    const quest = getRadioQuestById(questId)
    if (!quest) return false

    activeQuests.value.push(questId)

    questProgress.value[questId] = {
      currentStep: 0,
      completedSteps: ['hear_request']
    }

    return true
  }

  function completeQuest(questId) {
    const idx = activeQuests.value.indexOf(questId)
    if (idx > -1) {
      activeQuests.value.splice(idx, 1)
    }
    if (!completedQuests.value.includes(questId)) {
      completedQuests.value.push(questId)
    }

    if (_onQuestCompleted.value) {
      const questData = getRadioQuestById(questId)
      if (questData) {
        _onQuestCompleted.value(questData)
      }
    }
  }

  function updateQuestProgress(questId, stepId) {
    if (!questProgress.value[questId]) return false
    if (questProgress.value[questId].completedSteps.includes(stepId)) return false

    questProgress.value[questId].completedSteps.push(stepId)

    const quest = getRadioQuestById(questId)
    if (quest) {
      const totalSteps = quest.progressSteps.length
      const completedCount = questProgress.value[questId].completedSteps.length
      if (completedCount >= totalSteps) {
        completeQuest(questId)
        return true
      }
    }

    return false
  }

  function getQuestProgress(questId) {
    return questProgress.value[questId] || { completedSteps: [] }
  }

  function recordSceneVisit(sceneId) {
    if (!visitedScenes.value.includes(sceneId)) {
      visitedScenes.value.push(sceneId)
    }
  }

  function checkQuestProgress(gameState) {
    const updates = []

    for (const questId of activeQuests.value) {
      const quest = getRadioQuestById(questId)
      if (!quest) continue

      const progress = questProgress.value[questId]
      if (!progress) continue

      for (const step of quest.progressSteps) {
        if (progress.completedSteps.includes(step.id)) continue

        if (checkStepCondition(step.condition, gameState)) {
          progress.completedSteps.push(step.id)
          updates.push({ questId, stepId: step.id })

          const completedCount = progress.completedSteps.length
          if (completedCount >= quest.progressSteps.length) {
            completeQuest(questId)
          }
        }
      }
    }

    return updates
  }

  function checkStepCondition(condition, gameState) {
    if (!condition) return true

    switch (condition.type) {
      case 'item':
        return gameState.foundItems?.includes(condition.value)
      case 'scene':
        return gameState.currentSceneId === condition.value
      case 'scene_time':
        return gameState.currentSceneId === condition.value.scene &&
               gameState.currentTimePeriod === condition.value.time
      case 'memories':
        return (gameState.triggeredMemories?.length || 0) >= condition.value
      case 'chapter':
        return gameState.currentChapterId >= condition.value
      default:
        return false
    }
  }

  function getSaveData() {
    return {
      heardMemoryFragments: [...heardMemoryFragments.value],
      heardRumors: [...heardRumors.value],
      activeQuests: [...activeQuests.value],
      completedQuests: [...completedQuests.value],
      heardStories: [...heardStories.value],
      visitedScenes: [...visitedScenes.value],
      questProgress: JSON.parse(JSON.stringify(questProgress.value)),
      radioUnlocked: radioUnlocked.value,
      currentProgramId: currentProgramId.value
    }
  }

  function loadSaveData(data) {
    if (!data) return

    if (data.heardMemoryFragments) {
      heardMemoryFragments.value = [...data.heardMemoryFragments]
    }
    if (data.heardRumors) {
      heardRumors.value = [...data.heardRumors]
    }
    if (data.activeQuests) {
      activeQuests.value = [...data.activeQuests]
    }
    if (data.completedQuests) {
      completedQuests.value = [...data.completedQuests]
    }
    if (data.heardStories) {
      heardStories.value = [...data.heardStories]
    }
    if (data.visitedScenes) {
      visitedScenes.value = [...data.visitedScenes]
    }
    if (data.questProgress) {
      questProgress.value = JSON.parse(JSON.stringify(data.questProgress))
    }
    if (data.radioUnlocked !== undefined) {
      radioUnlocked.value = data.radioUnlocked
    }
    if (data.currentProgramId) {
      currentProgramId.value = data.currentProgramId
    }
  }

  function resetRadio() {
    isRadioOpen.value = false
    isPlaying.value = false
    currentProgramId.value = null
    currentContentId.value = null
    currentContentType.value = null
    currentLineIndex.value = 0
    heardMemoryFragments.value = []
    heardRumors.value = []
    activeQuests.value = []
    completedQuests.value = []
    heardStories.value = []
    visitedScenes.value = []
    questProgress.value = {}
    radioUnlocked.value = false
    radioFirstTime.value = true
  }

  return {
    isRadioOpen,
    isPlaying,
    currentProgramId,
    currentContentId,
    currentContentType,
    currentLineIndex,
    volume,
    frequency,
    isTuning,
    showStatic,
    heardMemoryFragments,
    heardRumors,
    activeQuests,
    completedQuests,
    heardStories,
    questProgress,
    radioUnlocked,
    radioFirstTime,
    visitedScenes,

    radioStation,
    currentProgram,
    currentContent,
    unlockedPrograms,
    currentProgramContents,
    activeQuestCount,
    completedQuestCount,
    totalHeardFragments,
    totalHeardRumors,

    unlockRadio,
    openRadio,
    closeRadio,
    selectProgram,
    playContent,
    stopPlayback,
    togglePlayPause,
    nextLine,
    prevLine,
    getCurrentContentLines,
    tuneFrequency,
    setFrequency,
    acceptQuest,
    completeQuest,
    updateQuestProgress,
    getQuestProgress,
    recordSceneVisit,
    checkQuestProgress,
    getSaveData,
    loadSaveData,
    resetRadio,
    updateGameStateReference,
    setOnContentPlayed,
    setOnQuestCompleted
  }
})
