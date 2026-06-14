import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const MOOD_MIN = 0
export const MOOD_MAX = 100
export const MOOD_DEFAULT = 50

export const EMOTION_MOOD_CHANGES = {
  sad: -8,
  warm: 6,
  pensive: -3,
  happy: 8,
  sweet: 7,
  nervous: -4,
  bittersweet: 2,
  shocking: -6,
  romantic: 10,
  regret: -10,
  melancholy: -5,
  touched: 9,
  determined: 5
}

export const MOOD_STATES = [
  { id: 'despair', min: 0, max: 20, name: '绝望', color: '#3d2828', textClass: 'mood-despair' },
  { id: 'gloomy', min: 21, max: 40, name: '阴郁', color: '#4a4a5a', textClass: 'mood-gloomy' },
  { id: 'calm', min: 41, max: 60, name: '平静', color: '#5a6a7a', textClass: 'mood-calm' },
  { id: 'warm', min: 61, max: 80, name: '温暖', color: '#c48a65', textClass: 'mood-warm' },
  { id: 'hopeful', min: 81, max: 100, name: '希冀', color: '#e8b87a', textClass: 'mood-hopeful' }
]

export const MUSIC_LAYERS = {
  despair: { volume: 0.15, playbackRate: 0.85, filter: 'lowpass(800)' },
  gloomy: { volume: 0.25, playbackRate: 0.92, filter: 'lowpass(1200)' },
  calm: { volume: 0.35, playbackRate: 1.0, filter: 'none' },
  warm: { volume: 0.45, playbackRate: 1.05, filter: 'highpass(200)' },
  hopeful: { volume: 0.55, playbackRate: 1.1, filter: 'highpass(400)' }
}

export const TEXT_TONE_MODIFIERS = {
  despair: { prefix: '【阴霾】', color: '#6b4444', italic: true },
  gloomy: { prefix: '【沉重】', color: '#7a7a8a', italic: true },
  calm: { prefix: '', color: '', italic: false },
  warm: { prefix: '【暖意】', color: '#c48a65', italic: false },
  hopeful: { prefix: '【光亮】', color: '#e8b87a', italic: false }
}

export const HINT_INTENSITY = {
  despair: { glowOpacity: 0.3, hintScale: 0.8, pulseSpeed: 4 },
  gloomy: { glowOpacity: 0.5, hintScale: 0.9, pulseSpeed: 3 },
  calm: { glowOpacity: 0.7, hintScale: 1.0, pulseSpeed: 2 },
  warm: { glowOpacity: 0.85, hintScale: 1.1, pulseSpeed: 1.5 },
  hopeful: { glowOpacity: 1.0, hintScale: 1.2, pulseSpeed: 1 }
}

export const ENDING_MOOD_THRESHOLDS = {
  legendary: 80,
  epic: 60,
  special: 40,
  perfect: 70,
  good: 50,
  normal: 30,
  bad: 0
}

export const useMoodStore = defineStore('mood', () => {
  const moodValue = ref(MOOD_DEFAULT)
  const moodHistory = ref([])
  const lastEmotion = ref(null)

  const currentMoodState = computed(() => {
    for (const state of MOOD_STATES) {
      if (moodValue.value >= state.min && moodValue.value <= state.max) {
        return state
      }
    }
    return MOOD_STATES[2]
  })

  const moodStateId = computed(() => currentMoodState.value.id)
  const moodStateName = computed(() => currentMoodState.value.name)
  const moodStateColor = computed(() => currentMoodState.value.color)
  const moodStateTextClass = computed(() => currentMoodState.value.textClass)

  const musicLayer = computed(() => MUSIC_LAYERS[moodStateId.value] || MUSIC_LAYERS.calm)
  const textTone = computed(() => TEXT_TONE_MODIFIERS[moodStateId.value] || TEXT_TONE_MODIFIERS.calm)
  const hintIntensity = computed(() => HINT_INTENSITY[moodStateId.value] || HINT_INTENSITY.calm)

  const moodPercent = computed(() => Math.round((moodValue.value / MOOD_MAX) * 100))

  function setMood(value) {
    const oldValue = moodValue.value
    moodValue.value = Math.max(MOOD_MIN, Math.min(MOOD_MAX, value))
    
    if (oldValue !== moodValue.value) {
      moodHistory.value.push({
        oldValue,
        newValue: moodValue.value,
        emotion: lastEmotion.value,
        timestamp: Date.now()
      })
    }
  }

  function modifyMoodByEmotion(emotion) {
    lastEmotion.value = emotion
    const change = EMOTION_MOOD_CHANGES[emotion] || 0
    if (change !== 0) {
      const oldState = moodStateId.value
      setMood(moodValue.value + change)
      const newState = moodStateId.value
      return {
        change,
        oldState,
        newState,
        stateChanged: oldState !== newState
      }
    }
    return null
  }

  function resetMood() {
    moodValue.value = MOOD_DEFAULT
    moodHistory.value = []
    lastEmotion.value = null
  }

  function getMoodChangeForEmotion(emotion) {
    return EMOTION_MOOD_CHANGES[emotion] || 0
  }

  function meetsEndingRequirement(endingType) {
    const threshold = ENDING_MOOD_THRESHOLDS[endingType]
    if (threshold === undefined) return true
    return moodValue.value >= threshold
  }

  function getSaveData() {
    return {
      moodValue: moodValue.value,
      moodHistory: [...moodHistory.value],
      lastEmotion: lastEmotion.value
    }
  }

  function loadSaveData(data) {
    if (data) {
      if (data.moodValue !== undefined) {
        moodValue.value = data.moodValue
      }
      if (data.moodHistory) {
        moodHistory.value = [...data.moodHistory]
      }
      if (data.lastEmotion !== undefined) {
        lastEmotion.value = data.lastEmotion
      }
    }
  }

  return {
    moodValue,
    moodHistory,
    lastEmotion,
    currentMoodState,
    moodStateId,
    moodStateName,
    moodStateColor,
    moodStateTextClass,
    musicLayer,
    textTone,
    hintIntensity,
    moodPercent,
    setMood,
    modifyMoodByEmotion,
    resetMood,
    getMoodChangeForEmotion,
    meetsEndingRequirement,
    getSaveData,
    loadSaveData
  }
})
