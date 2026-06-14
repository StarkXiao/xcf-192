import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const TIME_PERIODS = {
  DAWN: 'dawn',
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night'
}

export const TIME_PERIOD_CONFIG = {
  [TIME_PERIODS.DAWN]: {
    name: '黎明',
    icon: '🌅',
    startHour: 5,
    endHour: 8,
    brightness: 0.85,
    saturation: 0.8,
    fogMultiplier: 1.3,
    backgroundTint: 'rgba(255, 180, 100, 0.25)',
    ambientColor: '#ffb464'
  },
  [TIME_PERIODS.DAY]: {
    name: '白天',
    icon: '☀️',
    startHour: 8,
    endHour: 16,
    brightness: 1.2,
    saturation: 1.1,
    fogMultiplier: 0.6,
    backgroundTint: 'rgba(135, 206, 235, 0.1)',
    ambientColor: '#87ceeb'
  },
  [TIME_PERIODS.DUSK]: {
    name: '黄昏',
    icon: '🌇',
    startHour: 16,
    endHour: 18,
    brightness: 0.9,
    saturation: 0.95,
    fogMultiplier: 1.1,
    backgroundTint: 'rgba(255, 140, 100, 0.25)',
    ambientColor: '#ff8c64'
  },
  [TIME_PERIODS.NIGHT]: {
    name: '夜晚',
    icon: '🌙',
    startHour: 18,
    endHour: 5,
    brightness: 0.5,
    saturation: 0.6,
    fogMultiplier: 1.5,
    backgroundTint: 'rgba(20, 20, 60, 0.4)',
    ambientColor: '#1a1a4a'
  }
}

export const GAME_START_HOUR = 8
export const GAME_TOTAL_HOURS = 14
export const REAL_SECONDS_PER_GAME_HOUR = 22

export const useTimeStore = defineStore('time', () => {
  const currentHour = ref(GAME_START_HOUR)
  const timeElapsed = ref(0)
  const isPaused = ref(false)
  const timeInterval = ref(null)
  const lastTimePeriod = ref(null)
  const timePeriodChanged = ref(false)

  const currentMinute = computed(() => {
    const fraction = timeElapsed.value % REAL_SECONDS_PER_GAME_HOUR
    return Math.floor((fraction / REAL_SECONDS_PER_GAME_HOUR) * 60)
  })

  const formattedTime = computed(() => {
    const hour = Math.floor(currentHour.value)
    const minute = currentMinute.value
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  })

  const currentTimePeriod = computed(() => {
    const hour = currentHour.value
    for (const [period, config] of Object.entries(TIME_PERIOD_CONFIG)) {
      if (config.startHour < config.endHour) {
        if (hour >= config.startHour && hour < config.endHour) {
          return period
        }
      } else {
        if (hour >= config.startHour || hour < config.endHour) {
          return period
        }
      }
    }
    return TIME_PERIODS.DAY
  })

  const currentPeriodConfig = computed(() => {
    return TIME_PERIOD_CONFIG[currentTimePeriod.value]
  })

  const timeProgress = computed(() => {
    const elapsedHours = currentHour.value - GAME_START_HOUR
    return Math.min(100, (elapsedHours / GAME_TOTAL_HOURS) * 100)
  })

  const isNight = computed(() => currentTimePeriod.value === TIME_PERIODS.NIGHT)
  const isDay = computed(() => currentTimePeriod.value === TIME_PERIODS.DAY)
  const isDawn = computed(() => currentTimePeriod.value === TIME_PERIODS.DAWN)
  const isDusk = computed(() => currentTimePeriod.value === TIME_PERIODS.DUSK)

  const timeAtmosphere = computed(() => {
    const config = currentPeriodConfig.value
    return {
      brightness: config.brightness,
      saturation: config.saturation,
      fogMultiplier: config.fogMultiplier,
      backgroundTint: config.backgroundTint,
      ambientColor: config.ambientColor
    }
  })

  function getTimePeriodForHour(hour) {
    for (const [period, config] of Object.entries(TIME_PERIOD_CONFIG)) {
      if (config.startHour < config.endHour) {
        if (hour >= config.startHour && hour < config.endHour) {
          return period
        }
      } else {
        if (hour >= config.startHour || hour < config.endHour) {
          return period
        }
      }
    }
    return TIME_PERIODS.DAY
  }

  function isItemVisibleAtTime(item, hour) {
    if (!item || !item.visiblePeriods) return true
    const period = getTimePeriodForHour(hour)
    return item.visiblePeriods.includes(period)
  }

  function isSceneAccessibleAtTime(scene, hour) {
    if (!scene || !scene.accessiblePeriods) return true
    const period = getTimePeriodForHour(hour)
    return scene.accessiblePeriods.includes(period)
  }

  function getMemoryVariant(memory, hour) {
    if (!memory || !memory.timeVariants) return memory
    const period = getTimePeriodForHour(hour)
    const variant = memory.timeVariants[period]
    if (variant) {
      return {
        ...memory,
        title: variant.title || memory.title,
        content: variant.content || memory.content,
        emotion: variant.emotion || memory.emotion
      }
    }
    return memory
  }

  function startTimeFlow() {
    if (timeInterval.value) clearInterval(timeInterval.value)
    timeInterval.value = setInterval(() => {
      if (!isPaused.value) {
        timeElapsed.value++
        const newHour = GAME_START_HOUR + Math.floor(timeElapsed.value / REAL_SECONDS_PER_GAME_HOUR)
        
        if (newHour !== currentHour.value && newHour <= GAME_START_HOUR + GAME_TOTAL_HOURS) {
          const oldPeriod = currentTimePeriod.value
          currentHour.value = newHour
          const newPeriod = currentTimePeriod.value
          
          if (oldPeriod !== newPeriod) {
            lastTimePeriod.value = oldPeriod
            timePeriodChanged.value = true
            setTimeout(() => {
              timePeriodChanged.value = false
            }, 3000)
          }
        }
      }
    }, 1000)
  }

  function stopTimeFlow() {
    if (timeInterval.value) {
      clearInterval(timeInterval.value)
      timeInterval.value = null
    }
  }

  function pauseTime() {
    isPaused.value = true
  }

  function resumeTime() {
    isPaused.value = false
  }

  function resetTime() {
    stopTimeFlow()
    currentHour.value = GAME_START_HOUR
    timeElapsed.value = 0
    isPaused.value = false
    lastTimePeriod.value = null
    timePeriodChanged.value = false
  }

  function setTime(hour, elapsedSeconds = 0) {
    currentHour.value = Math.max(GAME_START_HOUR, Math.min(GAME_START_HOUR + GAME_TOTAL_HOURS, hour))
    timeElapsed.value = elapsedSeconds || (hour - GAME_START_HOUR) * REAL_SECONDS_PER_GAME_HOUR
  }

  function getSaveData() {
    return {
      currentHour: currentHour.value,
      timeElapsed: timeElapsed.value,
      lastTimePeriod: lastTimePeriod.value
    }
  }

  function loadSaveData(data) {
    if (data) {
      if (data.currentHour !== undefined) {
        currentHour.value = data.currentHour
      }
      if (data.timeElapsed !== undefined) {
        timeElapsed.value = data.timeElapsed
      }
      if (data.lastTimePeriod !== undefined) {
        lastTimePeriod.value = data.lastTimePeriod
      }
    }
  }

  return {
    currentHour,
    timeElapsed,
    isPaused,
    currentMinute,
    formattedTime,
    currentTimePeriod,
    currentPeriodConfig,
    timeProgress,
    isNight,
    isDay,
    isDawn,
    isDusk,
    timeAtmosphere,
    timePeriodChanged,
    lastTimePeriod,
    getTimePeriodForHour,
    isItemVisibleAtTime,
    isSceneAccessibleAtTime,
    getMemoryVariant,
    startTimeFlow,
    stopTimeFlow,
    pauseTime,
    resumeTime,
    resetTime,
    setTime,
    getSaveData,
    loadSaveData
  }
})
