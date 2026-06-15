import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  mapLocations,
  mapEvents,
  mapClues,
  mapEndings,
  getLocationById,
  getEventById,
  getClueById,
  getEventsByLocationId,
  getCluesByLocationId,
  getEndingById
} from '../data/mapData'

export const useMapStore = defineStore('map', () => {
  const isMapMode = ref(false)
  const currentLocationId = ref('station')
  const unlockedLocations = ref(['station'])
  const visitedLocations = ref([])
  const collectedClues = ref([])
  const triggeredMemories = ref([])
  const triggeredEvents = ref([])
  const moodValue = ref(50)
  const showLocationDetail = ref(false)
  const detailLocationId = ref(null)
  const showEventModal = ref(false)
  const currentEvent = ref(null)
  const currentEventResult = ref(null)
  const showClueTracker = ref(false)
  const showMemoryModal = ref(false)
  const currentMemory = ref(null)
  const memoryQueue = ref([])
  const mapEnding = ref(null)
  const showEnding = ref(false)
  const unlockedByEvent = ref([])

  const totalLocations = computed(() => mapLocations.length)
  const unlockedCount = computed(() => unlockedLocations.value.length)
  const visitedCount = computed(() => visitedLocations.value.length)
  const totalClues = computed(() => mapClues.length)
  const collectedCluesCount = computed(() => collectedClues.value.length)
  const totalMemories = computed(() => {
    return mapLocations.reduce((sum, loc) => sum + (loc.memories?.length || 0), 0)
  })
  const triggeredMemoriesCount = computed(() => triggeredMemories.value.length)

  const progress = computed(() => {
    const locationProgress = unlockedCount.value / totalLocations.value
    const clueProgress = collectedCluesCount.value / totalClues.value
    const memoryProgress = totalMemories.value > 0 ? triggeredMemoriesCount.value / totalMemories.value : 0
    return Math.round(((locationProgress * 0.35) + (clueProgress * 0.4) + (memoryProgress * 0.25)) * 100)
  })

  const currentLocation = computed(() => getLocationById(currentLocationId.value))

  const availableConnections = computed(() => {
    const loc = currentLocation.value
    if (!loc) return []
    return loc.connectedTo
      .map(id => getLocationById(id))
      .filter(l => l)
      .map(l => ({
        ...l,
        isUnlocked: unlockedLocations.value.includes(l.id),
        unlockHint: getUnlockHint(l)
      }))
  })

  const allLocationsWithStatus = computed(() => {
    return mapLocations.map(loc => ({
      ...loc,
      isUnlocked: unlockedLocations.value.includes(loc.id),
      isVisited: visitedLocations.value.includes(loc.id),
      isCurrent: loc.id === currentLocationId.value,
      unlockHint: getUnlockHint(loc)
    }))
  })

  const collectedCluesList = computed(() => {
    return collectedClues.value.map(id => getClueById(id)).filter(c => c)
  })

  const keyClues = computed(() => collectedCluesList.value.filter(c => c.importance === 'key'))
  const legendaryClues = computed(() => collectedCluesList.value.filter(c => c.importance === 'legendary'))

  const availableEventsForCurrentLocation = computed(() => {
    const events = getEventsByLocationId(currentLocationId.value)
    return events.filter(e => !triggeredEvents.value.includes(e.id))
  })

  const availableCluesForCurrentLocation = computed(() => {
    const clues = getCluesByLocationId(currentLocationId.value)
    return clues.filter(c => !collectedClues.value.includes(c.id))
  })

  function getUnlockHint(location) {
    if (unlockedLocations.value.includes(location.id)) return null
    const condition = location.unlockCondition
    if (!condition) return '即将开放...'

    switch (condition.type) {
      case 'visit':
        const reqLoc = getLocationById(condition.locationId)
        return `先前往「${reqLoc?.name || '某地'}」探索`
      case 'clue':
        if (condition.clueId === 'clue_promise') {
          return `收集至少 ${condition.count} 条线索后解锁`
        }
        const reqClue = getClueById(condition.clueId)
        return `找到「${reqClue?.name || '某个线索'}」`
      case 'memory':
        return `触发 ${condition.count} 段回忆后解锁`
      default:
        return '探索更多内容后解锁'
    }
  }

  function checkLocationUnlock(locationId) {
    const location = getLocationById(locationId)
    if (!location) return false
    if (unlockedLocations.value.includes(locationId)) return true

    const condition = location.unlockCondition
    if (!condition) {
      unlockedLocations.value.push(locationId)
      return true
    }

    let canUnlock = false
    switch (condition.type) {
      case 'visit':
        canUnlock = visitedLocations.value.includes(condition.locationId)
        break
      case 'clue':
        if (condition.clueId === 'clue_promise') {
          canUnlock = collectedClues.value.length >= condition.count
        } else {
          canUnlock = collectedClues.value.includes(condition.clueId)
        }
        break
      case 'memory':
        canUnlock = triggeredMemories.value.length >= condition.count
        break
    }

    if (canUnlock && !unlockedLocations.value.includes(locationId)) {
      unlockedLocations.value.push(locationId)
    }

    return canUnlock
  }

  function checkAllUnlocks() {
    for (const loc of mapLocations) {
      if (!unlockedLocations.value.includes(loc.id)) {
        checkLocationUnlock(loc.id)
      }
    }
  }

  function enterMapMode() {
    isMapMode.value = true
    if (!visitedLocations.value.includes(currentLocationId.value)) {
      visitedLocations.value.push(currentLocationId.value)
    }
  }

  function exitMapMode() {
    isMapMode.value = false
  }

  function travelTo(locationId) {
    if (!unlockedLocations.value.includes(locationId)) {
      if (!checkLocationUnlock(locationId)) {
        return { success: false, reason: getUnlockHint(getLocationById(locationId)) }
      }
    }

    currentLocationId.value = locationId

    if (!visitedLocations.value.includes(locationId)) {
      visitedLocations.value.push(locationId)
    }

    checkAllUnlocks()
    checkForEnding()
    return { success: true }
  }

  function openLocationDetail(locationId) {
    if (!unlockedLocations.value.includes(locationId)) return
    detailLocationId.value = locationId
    showLocationDetail.value = true
  }

  function closeLocationDetail() {
    showLocationDetail.value = false
    detailLocationId.value = null
  }

  function triggerEvent(eventId) {
    const event = getEventById(eventId)
    if (!event) return null
    if (event.once && triggeredEvents.value.includes(eventId)) return null

    currentEvent.value = event
    showEventModal.value = true
    return event
  }

  function makeEventChoice(choiceId) {
    const event = currentEvent.value
    if (!event) return null

    const choice = event.choices.find(c => c.id === choiceId)
    if (!choice) return null

    const effects = choice.effects || {}

    if (typeof effects.mood === 'number') {
      moodValue.value = Math.max(0, Math.min(100, moodValue.value + effects.mood))
    }

    if (effects.clue) {
      collectClue(effects.clue)
    }

    if (effects.memory) {
      triggerMemory(effects.memory)
    }

    if (effects.unlock) {
      if (!unlockedLocations.value.includes(effects.unlock)) {
        unlockedLocations.value.push(effects.unlock)
        unlockedByEvent.value.push(effects.unlock)
      }
    }

    if (effects.ending) {
      mapEnding.value = getEndingById(effects.ending)
    }

    if (event.once) {
      triggeredEvents.value.push(event.id)
    }

    currentEventResult.value = choice
    checkAllUnlocks()
    checkForEnding()

    return { resultText: choice.resultText, effects }
  }

  function closeEventModal() {
    showEventModal.value = false
    currentEvent.value = null
    currentEventResult.value = null

    if (mapEnding.value) {
      showEnding.value = true
    }
  }

  function collectClue(clueId) {
    if (collectedClues.value.includes(clueId)) return null
    const clue = getClueById(clueId)
    if (!clue) return null

    collectedClues.value.push(clueId)

    if (clue.relatedMemory) {
      triggerMemory(clue.relatedMemory)
    }

    checkAllUnlocks()
    checkForEnding()
    return clue
  }

  function triggerMemory(memoryId) {
    if (triggeredMemories.value.includes(memoryId)) return null

    let memory = null
    for (const loc of mapLocations) {
      if (loc.memories) {
        memory = loc.memories.find(m => m.id === memoryId)
        if (memory) break
      }
    }

    if (!memory) return null

    triggeredMemories.value.push(memoryId)

    if (showMemoryModal.value) {
      memoryQueue.value.push(memory)
    } else {
      currentMemory.value = memory
      showMemoryModal.value = true
    }

    checkAllUnlocks()
    return memory
  }

  function closeMemoryModal() {
    showMemoryModal.value = false
    currentMemory.value = null

    if (memoryQueue.value.length > 0) {
      const nextMemory = memoryQueue.value.shift()
      setTimeout(() => {
        currentMemory.value = nextMemory
        showMemoryModal.value = true
      }, 300)
    }
  }

  function openClueTracker() {
    showClueTracker.value = true
  }

  function closeClueTracker() {
    showClueTracker.value = false
  }

  function getMoodStateName() {
    if (moodValue.value <= 20) return '低落'
    if (moodValue.value <= 40) return '沉重'
    if (moodValue.value <= 60) return '平静'
    if (moodValue.value <= 80) return '温暖'
    return '充满希望'
  }

  function getMoodColor() {
    if (moodValue.value <= 20) return '#5a3a3a'
    if (moodValue.value <= 40) return '#5a5a6a'
    if (moodValue.value <= 60) return '#6a7a8a'
    if (moodValue.value <= 80) return '#c4a574'
    return '#e8b87a'
  }

  function checkForEnding() {
    if (mapEnding.value) return

    for (const ending of mapEndings) {
      if (typeof ending.requiredClues === 'number') {
        if (collectedClues.value.length >= ending.requiredClues) {
          mapEnding.value = ending
          return
        }
      } else if (Array.isArray(ending.requiredClues)) {
        const hasAll = ending.requiredClues.every(id => collectedClues.value.includes(id))
        if (hasAll) {
          mapEnding.value = ending
          return
        }
      }
    }
  }

  function resetMap() {
    currentLocationId.value = 'station'
    unlockedLocations.value = ['station']
    visitedLocations.value = []
    collectedClues.value = []
    triggeredMemories.value = []
    triggeredEvents.value = []
    moodValue.value = 50
    showLocationDetail.value = false
    detailLocationId.value = null
    showEventModal.value = false
    currentEvent.value = null
    currentEventResult.value = null
    showClueTracker.value = false
    showMemoryModal.value = false
    currentMemory.value = null
    memoryQueue.value = []
    mapEnding.value = null
    showEnding.value = false
    unlockedByEvent.value = []
    isMapMode.value = false
  }

  function closeEnding() {
    showEnding.value = false
  }

  return {
    isMapMode,
    currentLocationId,
    unlockedLocations,
    visitedLocations,
    collectedClues,
    triggeredMemories,
    triggeredEvents,
    moodValue,
    showLocationDetail,
    detailLocationId,
    showEventModal,
    currentEvent,
    currentEventResult,
    showClueTracker,
    showMemoryModal,
    currentMemory,
    mapEnding,
    showEnding,
    unlockedByEvent,
    totalLocations,
    unlockedCount,
    visitedCount,
    totalClues,
    collectedCluesCount,
    totalMemories,
    triggeredMemoriesCount,
    progress,
    currentLocation,
    availableConnections,
    allLocationsWithStatus,
    collectedCluesList,
    keyClues,
    legendaryClues,
    availableEventsForCurrentLocation,
    availableCluesForCurrentLocation,
    getUnlockHint,
    checkLocationUnlock,
    checkAllUnlocks,
    enterMapMode,
    exitMapMode,
    travelTo,
    openLocationDetail,
    closeLocationDetail,
    triggerEvent,
    makeEventChoice,
    closeEventModal,
    collectClue,
    triggerMemory,
    closeMemoryModal,
    openClueTracker,
    closeClueTracker,
    getMoodStateName,
    getMoodColor,
    resetMap,
    closeEnding
  }
})
