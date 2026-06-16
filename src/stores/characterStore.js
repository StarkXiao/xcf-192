import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  characters, getAllCharacters, getCharacterById, checkCharacterUnlock, checkTimelineUnlock, checkRelationshipUnlock, characterUnlocks } from '../data/characterData'
import { useArchiveStore } from './archiveStore'

export const useCharacterStore = defineStore('character', () => {
  const archiveStore = useArchiveStore()
  
  const unlockedCharacters = ref(['protagonist', 'mother'])
  const unlockedTimelines = ref({})
  const unlockedRelationships = ref({})
  const unlockedChoices = ref({})
  const unlockedSecrets = ref([])
  const currentCharacterId = ref(null)
  const showCharacterModal = ref(false)
  const activeTab = ref('profile')

  function getGameStateSnapshot(gameStore) {
    return {
      triggeredMemories: gameStore?.triggeredMemories || [],
      unlockedHiddenMemories: gameStore?.unlockedHiddenMemories || [],
      foundHiddenItems: gameStore?.foundHiddenItems || [],
      madeChoices: gameStore?.madeChoices || [],
      currentChapterId: gameStore?.currentChapterId || 1,
      craftedItems: gameStore?.craftedItems || [],
      moodValue: gameStore?.moodValue || 50
    }
  }

  const isCharacterUnlocked = (characterId, gameStore) => {
    if (unlockedCharacters.value.includes(characterId)) {
      return true
    }
    
    const gameState = getGameStateSnapshot(gameStore)
    const unlocked = checkCharacterUnlock(characterId, gameState)
    
    if (unlocked && !unlockedCharacters.value.includes(characterId)) {
      unlockedCharacters.value.push(characterId)
      archiveStore.recordCharacterUnlock(characterId)
    }
    
    return unlocked
  }

  const isTimelineUnlocked = (characterId, timelineItem, gameStore) => {
    const key = `${characterId}_${timelineItem.year}_${timelineItem.title}`
    if (unlockedTimelines.value[key]) {
      return true
    }
    
    const gameState = getGameStateSnapshot(gameStore)
    const unlocked = checkTimelineUnlock(timelineItem, gameState)
    
    if (unlocked) {
      unlockedTimelines.value[key] = true
    }
    
    return unlocked
  }

  const isRelationshipUnlocked = (characterId, relationship, gameStore) => {
    const key = `${characterId}_${relationship.targetId}`
    if (unlockedRelationships.value[key]) {
      return true
    }
    
    const gameState = getGameStateSnapshot(gameStore)
    const unlocked = checkRelationshipUnlock(relationship, gameState)
    
    if (unlocked) {
      unlockedRelationships.value[key] = true
    }
    
    return unlocked
  }

  const isChoiceUnlocked = (characterId, choice, gameStore) => {
    const key = `${characterId}_${choice.id}`
    if (unlockedChoices.value[key]) {
      return true
    }
    
    const gameState = getGameStateSnapshot(gameStore)
    
    if (!choice.unlockCondition) {
      unlockedChoices.value[key] = true
      return true
    }
    
    const condition = choice.unlockCondition
    let unlocked = false
    
    switch (condition.type) {
      case 'initial':
        unlocked = true
        break
      case 'memory':
        unlocked = gameState.triggeredMemories.includes(condition.memoryId)
        break
      case 'chapter':
        unlocked = gameState.currentChapterId >= condition.chapter
        break
      case 'choice':
        unlocked = gameState.madeChoices.some(c => c.startsWith(condition.choiceId))
        break
      case 'hidden_memory':
        unlocked = gameState.unlockedHiddenMemories.includes(condition.hiddenMemoryId)
        break
      case 'hidden_item':
        unlocked = gameState.foundHiddenItems.includes(condition.hiddenItemId)
        break
      default:
        unlocked = true
    }
    
    if (unlocked) {
      unlockedChoices.value[key] = true
    }
    
    return unlocked
  }

  const isSecretUnlocked = (secret, gameStore) => {
    if (unlockedSecrets.value.includes(secret.id)) {
      return true
    }
    
    const gameState = getGameStateSnapshot(gameStore)
    
    if (!secret.unlockCondition) {
      unlockedSecrets.value.push(secret.id)
      archiveStore.recordSecretUnlock(secret.id)
      return true
    }
    
    const condition = secret.unlockCondition
    let unlocked = false
    
    switch (condition.type) {
      case 'hidden_memory':
        unlocked = gameState.unlockedHiddenMemories.includes(condition.hiddenMemoryId)
        break
      case 'hidden_item':
        unlocked = gameState.foundHiddenItems.includes(condition.hiddenItemId)
        break
      default:
        unlocked = true
    }
    
    if (unlocked) {
      unlockedSecrets.value.push(secret.id)
      archiveStore.recordSecretUnlock(secret.id)
    }
    
    return unlocked
  }

  const getUnlockedCharacters = (gameStore) => {
    return characters.filter(char => isCharacterUnlocked(char.id, gameStore))
  }

  const getCharacterProfile = (characterId, gameStore) => {
    const char = getCharacterById(characterId)
    if (!char) return null
    
    const isUnlocked = isCharacterUnlocked(characterId, gameStore)
    if (!isUnlocked) return null
    
    return {
      ...char,
      unlockedTimeline: char.growthTimeline.filter(item => isTimelineUnlocked(characterId, item, gameStore)),
      unlockedRelationships: char.relationships.filter(rel => isRelationshipUnlocked(characterId, rel, gameStore)),
      unlockedChoices: char.keyChoices ? char.keyChoices.filter(choice => isChoiceUnlocked(characterId, choice, gameStore)) : [],
      unlockedSecrets: char.secrets ? char.secrets.filter(secret => isSecretUnlocked(secret, gameStore)) : []
    }
  }

  const getUnlockedTimelineCount = (characterId, gameStore) => {
    const char = getCharacterById(characterId)
    if (!char) return 0
    return char.growthTimeline.filter(item => isTimelineUnlocked(characterId, item, gameStore)).length
  }

  const getTotalTimelineCount = (characterId) => {
    const char = getCharacterById(characterId)
    return char ? char.growthTimeline.length : 0
  }

  const getCharacterProgress = (characterId, gameStore) => {
    const char = getCharacterById(characterId)
    if (!char) return 0
    
    const timelineCount = getUnlockedTimelineCount(characterId, gameStore)
    const totalTimeline = getTotalTimelineCount(characterId)
    
    const relCount = char.relationships ? char.relationships.filter(rel => 
      isRelationshipUnlocked(characterId, rel, gameStore)).length : 0
    const totalRel = char.relationships ? char.relationships.length : 0
    
    const choiceCount = char.keyChoices ? char.keyChoices.filter(choice => 
      isChoiceUnlocked(characterId, choice, gameStore)).length : 0
    const totalChoice = char.keyChoices ? char.keyChoices.length : 0
    
    const secretCount = char.secrets ? char.secrets.filter(secret => 
      isSecretUnlocked(secret, gameStore)).length : 0
    const totalSecret = char.secrets ? char.secrets.length : 0
    
    const totalItems = totalTimeline + totalRel + totalChoice + totalSecret
    const unlockedItems = timelineCount + relCount + choiceCount + secretCount
    
    return totalItems > 0 ? Math.round((unlockedItems / totalItems) * 100) : 0
  }

  const overallProgress = computed(() => {
    const totalChars = characters.length
    const unlockedChars = unlockedCharacters.value.length
    return Math.round((unlockedChars / totalChars) * 100)
  })

  const checkNewUnlocks = (gameStore) => {
    const newlyUnlocked = []
    
    for (const char of characters) {
      if (!unlockedCharacters.value.includes(char.id)) {
        const isUnlocked = isCharacterUnlocked(char.id, gameStore)
        if (isUnlocked) {
          newlyUnlocked.push({
            type: 'character',
            characterId: char.id,
            name: char.name
          })
        }
      }
    }
    
    return newlyUnlocked
  }

  const openCharacterProfile = (characterId) => {
    currentCharacterId.value = characterId
    activeTab.value = 'profile'
    showCharacterModal.value = true
  }

  const closeCharacterModal = () => {
    showCharacterModal.value = false
    currentCharacterId.value = null
  }

  const setActiveTab = (tab) => {
    activeTab.value = tab
  }

  const checkEndingUnlockConditions = (endingId, gameStore) => {
    const gameState = getGameStateSnapshot(gameStore)
    const char = getCharacterById('protagonist')
    if (!char || !char.endingRequirements) return false
    
    const requirements = char.endingRequirements[endingId]
    if (!requirements) return false
    
    if (requirements.requiredChoices) {
      const matchedCount = requirements.requiredChoices.filter(kc => 
        gameState.madeChoices.includes(kc)).length
      if (matchedCount < requirements.requiredChoices.length * 0.8) return false
    }
    
    if (requirements.requiredCrafts) {
      const hasAll = requirements.requiredCrafts.every(craftId => 
        gameState.craftedItems.includes(craftId))
      if (!hasAll) return false
    }
    
    if (requirements.requiredMemories !== undefined) {
      if (gameState.triggeredMemories.length < requirements.requiredMemories) return false
    }
    
    if (requirements.requiredHiddenMemories) {
      const hasAll = requirements.requiredHiddenMemories.every(hmId => 
        gameState.unlockedHiddenMemories.includes(hmId))
      if (!hasAll) return false
    }
    
    if (requirements.requiredMoodMin !== undefined) {
      if (gameState.moodValue < requirements.requiredMoodMin) return false
    }
    
    return true
  }

  const getEndingUnlockHint = (endingId, gameStore) => {
    const char = getCharacterById('protagonist')
    if (!char || !char.endingRequirements) return ''
    
    const requirements = char.endingRequirements[endingId]
    if (!requirements) return ''
    
    return requirements.description || ''
  }

  const getAvailableEndings = (gameStore) => {
    const char = getCharacterById('protagonist')
    if (!char || !char.endingRequirements) return []
    
    const available = []
    for (const [endingId, requirements] of Object.entries(char.endingRequirements)) {
      const unlocked = checkEndingUnlockConditions(endingId, gameStore)
      available.push({
        endingId,
        unlocked,
        requirements,
        hint: getEndingUnlockHint(endingId, gameStore),
        progress: calculateEndingProgress(endingId, gameStore)
      })
    }
    
    return available
  }

  const calculateEndingProgress = (endingId, gameStore) => {
    const gameState = getGameStateSnapshot(gameStore)
    const char = getCharacterById('protagonist')
    if (!char || !char.endingRequirements) return 0
    
    const requirements = char.endingRequirements[endingId]
    if (!requirements) return 0
    
    let totalChecks = 0
    let passedChecks = 0
    
    if (requirements.requiredChoices) {
      totalChecks++
      const matchedCount = requirements.requiredChoices.filter(kc => 
        gameState.madeChoices.includes(kc)).length
      if (matchedCount >= requirements.requiredChoices.length * 0.8) passedChecks++
    }
    
    if (requirements.requiredCrafts) {
      totalChecks++
      const hasAll = requirements.requiredCrafts.every(craftId => 
        gameState.craftedItems.includes(craftId))
      if (hasAll) passedChecks++
    }
    
    if (requirements.requiredMemories !== undefined) {
      totalChecks++
      if (gameState.triggeredMemories.length >= requirements.requiredMemories) passedChecks++
    }
    
    if (requirements.requiredHiddenMemories) {
      totalChecks++
      const hasAll = requirements.requiredHiddenMemories.every(hmId => 
        gameState.unlockedHiddenMemories.includes(hmId))
      if (hasAll) passedChecks++
    }
    
    if (requirements.requiredMoodMin !== undefined) {
      totalChecks++
      if (gameState.moodValue >= requirements.requiredMoodMin) passedChecks++
    }
    
    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0
  }

  const resetCharacterStore = () => {
    unlockedCharacters.value = ['protagonist', 'mother']
    unlockedTimelines.value = {}
    unlockedRelationships.value = {}
    unlockedChoices.value = {}
    unlockedSecrets.value = []
    currentCharacterId.value = null
    showCharacterModal.value = false
    activeTab.value = 'profile'
  }

  const loadFromArchive = () => {
    const archiveChars = archiveStore.unlockedCharacters || []
    for (const charId of archiveChars) {
      if (!unlockedCharacters.value.includes(charId)) {
        unlockedCharacters.value.push(charId)
      }
    }
    
    const archiveSecrets = archiveStore.unlockedSecrets || []
    for (const secretId of archiveSecrets) {
      if (!unlockedSecrets.value.includes(secretId)) {
        unlockedSecrets.value.push(secretId)
      }
    }
  }

  return {
    unlockedCharacters,
    unlockedTimelines,
    unlockedRelationships,
    unlockedChoices,
    unlockedSecrets,
    currentCharacterId,
    showCharacterModal,
    activeTab,
    overallProgress,
    isCharacterUnlocked,
    isTimelineUnlocked,
    isRelationshipUnlocked,
    isChoiceUnlocked,
    isSecretUnlocked,
    getUnlockedCharacters,
    getCharacterProfile,
    getUnlockedTimelineCount,
    getTotalTimelineCount,
    getCharacterProgress,
    checkNewUnlocks,
    openCharacterProfile,
    closeCharacterModal,
    setActiveTab,
    checkEndingUnlockConditions,
    getEndingUnlockHint,
    getAvailableEndings,
    calculateEndingProgress,
    resetCharacterStore,
    loadFromArchive
  }
})
