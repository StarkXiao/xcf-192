import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getLetterById,
  getLetterEnding,
  letterEndings,
  letterEndingRoutes
} from '../data/letterData'

export const useLetterStore = defineStore('letter', () => {
  const isLetterSystemUnlocked = ref(false)
  const currentLetterId = ref(null)
  const receivedLetters = ref([])
  const madeChoices = ref([])
  const relationValue = ref(0)
  const characterTraits = ref({})
  const showLetterModal = ref(false)
  const showReplyModal = ref(false)
  const showEndingModal = ref(false)
  const currentReplyContent = ref(null)
  const letterEnding = ref(null)
  const isLetterEndingReached = ref(false)
  const lastLetterId = ref(null)

  const onMoodChange = ref(null)
  const onEndingWeightChange = ref(null)
  const onSaveRequest = ref(null)

  const currentLetter = computed(() => {
    if (!currentLetterId.value) return null
    return getLetterById(currentLetterId.value)
  })

  const receivedLetterCount = computed(() => receivedLetters.value.length)

  const totalLetterRounds = computed(() => 5)

  const currentRound = computed(() => {
    const letter = currentLetter.value
    return letter ? letter.round : 0
  })

  const isLastLetter = computed(() => {
    if (!currentLetter.value) return false
    return isLetterEndingReached.value
  })

  const dominantTrait = computed(() => {
    const traits = characterTraits.value
    if (Object.keys(traits).length === 0) return null
    return Object.entries(traits)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null
  })

  const topTraits = computed(() => {
    return Object.entries(characterTraits.value)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  })

  function setMoodCallback(callback) {
    onMoodChange.value = callback
  }

  function setEndingWeightCallback(callback) {
    onEndingWeightChange.value = callback
  }

  function setSaveCallback(callback) {
    onSaveRequest.value = callback
  }

  function triggerMood(emotion) {
    if (onMoodChange.value && typeof onMoodChange.value === 'function') {
      onMoodChange.value(emotion)
    }
  }

  function addEndingWeight(weight, value) {
    if (onEndingWeightChange.value && typeof onEndingWeightChange.value === 'function') {
      onEndingWeightChange.value(weight, value)
    }
  }

  function requestSave() {
    if (onSaveRequest.value && typeof onSaveRequest.value === 'function') {
      onSaveRequest.value()
    }
  }

  function unlockLetterSystem() {
    if (isLetterSystemUnlocked.value) return false
    isLetterSystemUnlocked.value = true
    currentLetterId.value = 'lc1'
    receivedLetters.value.push('lc1')
    lastLetterId.value = 'lc1'
    return true
  }

  function openLetterSystem() {
    if (!isLetterSystemUnlocked.value) return false
    showLetterModal.value = true
    return true
  }

  function closeLetterModal() {
    showLetterModal.value = false
  }

  function closeReplyModal() {
    showReplyModal.value = false
    currentReplyContent.value = null
  }

  function closeEndingModal() {
    showEndingModal.value = false
  }

  function makeChoice(choiceId) {
    const letter = currentLetter.value
    if (!letter || !letter.choices) return null

    const choice = letter.choices.find(c => c.id === choiceId)
    if (!choice) return null

    madeChoices.value.push(choiceId)

    if (choice.effects) {
      if (choice.effects.relation !== undefined) {
        relationValue.value += choice.effects.relation
      }
      for (const [trait, value] of Object.entries(choice.effects)) {
        if (trait !== 'relation') {
          characterTraits.value[trait] = (characterTraits.value[trait] || 0) + value
        }
      }
    }

    if (choice.replyContent) {
      currentReplyContent.value = {
        content: choice.replyContent,
        choiceLabel: choice.label
      }
      showReplyModal.value = true
    }

    const nextLetterId = choice.nextLetter
    if (nextLetterId) {
      const isEnding = nextLetterId.startsWith('ending_') || letterEndingRoutes[nextLetterId]
      if (isEnding) {
        let ending = getLetterEnding(nextLetterId)
        if (!ending && nextLetterId.startsWith('ending_')) {
          ending = letterEndings.find(e => e.id === nextLetterId)
        }
        if (ending) {
          letterEnding.value = ending
          isLetterEndingReached.value = true
          applyEndingEffects(ending)
        }
      } else {
        const nextLetter = getLetterById(nextLetterId)
        if (nextLetter) {
          setTimeout(() => {
            currentLetterId.value = nextLetterId
            if (!receivedLetters.value.includes(nextLetterId)) {
              receivedLetters.value.push(nextLetterId)
              lastLetterId.value = nextLetterId
            }
            if (nextLetter.moodEffect) {
              triggerMood(nextLetter.moodEffect > 0 ? 'warm' : 'sad')
            }
          }, choice.replyContent ? 100 : 0)
        }
      }
    }

    requestSave()
    return choice
  }

  function applyEndingEffects(ending) {
    if (!ending || !ending.effects) return

    if (ending.effects.mood) {
      triggerMood(ending.effects.mood > 0 ? 'touched' : 'sad')
    }
    if (ending.effects.endingWeight) {
      for (const [weight, value] of Object.entries(ending.effects.endingWeight)) {
        addEndingWeight(weight, value)
      }
    }
  }

  function goToNextLetter() {
    showReplyModal.value = false
    currentReplyContent.value = null

    if (isLetterEndingReached.value && letterEnding.value) {
      showEndingModal.value = true
    }
  }

  function hasMadeChoice(choiceId) {
    return madeChoices.value.includes(choiceId)
  }

  function hasChoiceForLetter(letterId) {
    const letter = getLetterById(letterId)
    if (!letter || !letter.choices) return false
    return letter.choices.some(c => madeChoices.value.includes(c.id))
  }

  function getLetterSaveData() {
    return {
      isLetterSystemUnlocked: isLetterSystemUnlocked.value,
      currentLetterId: currentLetterId.value,
      receivedLetters: [...receivedLetters.value],
      madeChoices: [...madeChoices.value],
      relationValue: relationValue.value,
      characterTraits: { ...characterTraits.value },
      letterEnding: letterEnding.value,
      isLetterEndingReached: isLetterEndingReached.value,
      lastLetterId: lastLetterId.value
    }
  }

  function loadLetterSaveData(data) {
    if (!data) return
    isLetterSystemUnlocked.value = data.isLetterSystemUnlocked || false
    currentLetterId.value = data.currentLetterId || null
    receivedLetters.value = data.receivedLetters || []
    madeChoices.value = data.madeChoices || []
    relationValue.value = data.relationValue || 0
    characterTraits.value = data.characterTraits || {}
    letterEnding.value = data.letterEnding || null
    isLetterEndingReached.value = data.isLetterEndingReached || false
    lastLetterId.value = data.lastLetterId || null
  }

  function resetLetterSystem() {
    isLetterSystemUnlocked.value = false
    currentLetterId.value = null
    receivedLetters.value = []
    madeChoices.value = []
    relationValue.value = 0
    characterTraits.value = {}
    showLetterModal.value = false
    showReplyModal.value = false
    showEndingModal.value = false
    currentReplyContent.value = null
    letterEnding.value = null
    isLetterEndingReached.value = false
    lastLetterId.value = null
  }

  function checkLetterUnlock(itemId) {
    if (itemId === 'letter' && !isLetterSystemUnlocked.value) {
      setTimeout(() => {
        const unlocked = unlockLetterSystem()
        if (unlocked) {
          openLetterSystem()
        }
      }, 1500)
      return true
    }
    return false
  }

  return {
    isLetterSystemUnlocked,
    currentLetterId,
    currentLetter,
    receivedLetters,
    receivedLetterCount,
    totalLetterRounds,
    currentRound,
    isLastLetter,
    madeChoices,
    relationValue,
    characterTraits,
    dominantTrait,
    topTraits,
    showLetterModal,
    showReplyModal,
    showEndingModal,
    currentReplyContent,
    letterEnding,
    isLetterEndingReached,
    lastLetterId,
    setMoodCallback,
    setEndingWeightCallback,
    setSaveCallback,
    unlockLetterSystem,
    openLetterSystem,
    closeLetterModal,
    closeReplyModal,
    closeEndingModal,
    makeChoice,
    goToNextLetter,
    hasMadeChoice,
    hasChoiceForLetter,
    getLetterSaveData,
    loadLetterSaveData,
    resetLetterSystem,
    checkLetterUnlock
  }
})
