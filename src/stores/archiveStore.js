import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const ARCHIVE_KEY = 'foggy_city_reunion_archive'

export const useArchiveStore = defineStore('archive', () => {
  const unlockedEndings = ref([])
  const everUnlockedHiddenMemories = ref([])
  const everCraftedItems = ref([])
  const everTriggeredMemories = ref([])
  const everFoundHiddenItems = ref([])
  const branchSaves = ref([])
  const timePeriodStats = ref({
    dawn: { itemsFound: 0, memoriesTriggered: 0 },
    day: { itemsFound: 0, memoriesTriggered: 0 },
    dusk: { itemsFound: 0, memoriesTriggered: 0 },
    night: { itemsFound: 0, memoriesTriggered: 0 }
  })
  const unlockedChapters = ref([1])
  const characterRelations = ref([])
  const viewedEndingPlaybacks = ref([])

  const hasArchive = computed(() => {
    return unlockedEndings.value.length > 0
      || everUnlockedHiddenMemories.value.length > 0
      || everCraftedItems.value.length > 0
      || everFoundHiddenItems.value.length > 0
      || branchSaves.value.length > 0
  })

  const endingCount = computed(() => unlockedEndings.value.length)

  function init() {
    try {
      const data = localStorage.getItem(ARCHIVE_KEY)
      if (!data) return
      const parsed = JSON.parse(data)
      unlockedEndings.value = parsed.unlockedEndings || []
      everUnlockedHiddenMemories.value = parsed.everUnlockedHiddenMemories || []
      everCraftedItems.value = parsed.everCraftedItems || []
      everTriggeredMemories.value = parsed.everTriggeredMemories || []
      everFoundHiddenItems.value = parsed.everFoundHiddenItems || []
      branchSaves.value = parsed.branchSaves || []
      timePeriodStats.value = parsed.timePeriodStats || {
        dawn: { itemsFound: 0, memoriesTriggered: 0 },
        day: { itemsFound: 0, memoriesTriggered: 0 },
        dusk: { itemsFound: 0, memoriesTriggered: 0 },
        night: { itemsFound: 0, memoriesTriggered: 0 }
      }
      unlockedChapters.value = parsed.unlockedChapters || [1]
      characterRelations.value = parsed.characterRelations || []
      viewedEndingPlaybacks.value = parsed.viewedEndingPlaybacks || []
    } catch (e) {
      console.error('读取档案失败:', e)
    }
  }

  function persist() {
    try {
      const data = {
        unlockedEndings: unlockedEndings.value,
        everUnlockedHiddenMemories: everUnlockedHiddenMemories.value,
        everCraftedItems: everCraftedItems.value,
        everTriggeredMemories: everTriggeredMemories.value,
        everFoundHiddenItems: everFoundHiddenItems.value,
        branchSaves: branchSaves.value,
        timePeriodStats: timePeriodStats.value,
        unlockedChapters: unlockedChapters.value,
        characterRelations: characterRelations.value,
        viewedEndingPlaybacks: viewedEndingPlaybacks.value
      }
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存档案失败:', e)
    }
  }

  function recordHiddenItem(hiId) {
    if (!everFoundHiddenItems.value.includes(hiId)) {
      everFoundHiddenItems.value.push(hiId)
      persist()
    }
  }

  function recordEnding(ending) {
    const exists = unlockedEndings.value.find(e => e.type === ending.type)
    if (!exists) {
      unlockedEndings.value.push({
        type: ending.type,
        title: ending.title,
        description: ending.description,
        isSpecial: ending.isSpecial || false,
        timestamp: Date.now()
      })
    } else {
      exists.timestamp = Date.now()
    }
    persist()
  }

  function recordHiddenMemories(hmIds) {
    for (const id of hmIds) {
      if (!everUnlockedHiddenMemories.value.includes(id)) {
        everUnlockedHiddenMemories.value.push(id)
      }
    }
    persist()
  }

  function recordCraftedItems(craftedIds) {
    for (const id of craftedIds) {
      if (!everCraftedItems.value.includes(id)) {
        everCraftedItems.value.push(id)
      }
    }
    persist()
  }

  function recordTriggeredMemories(memoryIds) {
    for (const id of memoryIds) {
      if (!everTriggeredMemories.value.includes(id)) {
        everTriggeredMemories.value.push(id)
      }
    }
    persist()
  }

  function createBranchSave(label, gameState) {
    const id = `branch_${Date.now()}`
    branchSaves.value.push({
      id,
      label,
      timestamp: Date.now(),
      gameState: { ...gameState }
    })
    if (branchSaves.value.length > 10) {
      branchSaves.value = branchSaves.value.slice(-10)
    }
    persist()
    return id
  }

  function loadBranchSave(branchId) {
    const branch = branchSaves.value.find(b => b.id === branchId)
    return branch ? branch.gameState : null
  }

  function deleteBranchSave(branchId) {
    branchSaves.value = branchSaves.value.filter(b => b.id !== branchId)
    persist()
  }

  function recordTimePeriodStat(period, type) {
    if (timePeriodStats.value[period]) {
      if (type === 'item') {
        timePeriodStats.value[period].itemsFound++
      } else if (type === 'memory') {
        timePeriodStats.value[period].memoriesTriggered++
      }
      persist()
    }
  }

  function clearArchive() {
    unlockedEndings.value = []
    everUnlockedHiddenMemories.value = []
    everCraftedItems.value = []
    everTriggeredMemories.value = []
    everFoundHiddenItems.value = []
    branchSaves.value = []
    timePeriodStats.value = {
      dawn: { itemsFound: 0, memoriesTriggered: 0 },
      day: { itemsFound: 0, memoriesTriggered: 0 },
      dusk: { itemsFound: 0, memoriesTriggered: 0 },
      night: { itemsFound: 0, memoriesTriggered: 0 }
    }
    unlockedChapters.value = [1]
    characterRelations.value = []
    viewedEndingPlaybacks.value = []
    try {
      localStorage.removeItem(ARCHIVE_KEY)
    } catch (e) {
      console.error('清除档案失败:', e)
    }
  }

  function isEndingUnlocked(endingType) {
    return unlockedEndings.value.some(e => e.type === endingType)
  }

  function isHiddenMemoryEverUnlocked(hmId) {
    return everUnlockedHiddenMemories.value.includes(hmId)
  }

  function isCraftedItemEverObtained(craftId) {
    return everCraftedItems.value.includes(craftId)
  }

  function isMemoryEverTriggered(memoryId) {
    return everTriggeredMemories.value.includes(memoryId)
  }

  function isHiddenItemEverFound(hiId) {
    return everFoundHiddenItems.value.includes(hiId)
  }

  function unlockChapter(chapterId) {
    if (!unlockedChapters.value.includes(chapterId)) {
      unlockedChapters.value.push(chapterId)
      unlockedChapters.value.sort((a, b) => a - b)
      persist()
    }
  }

  function isChapterUnlocked(chapterId) {
    return unlockedChapters.value.includes(chapterId)
  }

  function recordCharacterRelation(relation) {
    const exists = characterRelations.value.find(r => r.id === relation.id)
    if (!exists) {
      characterRelations.value.push({
        ...relation,
        unlockedAt: Date.now()
      })
      persist()
    }
  }

  function isCharacterRelationUnlocked(relationId) {
    return characterRelations.value.some(r => r.id === relationId)
  }

  function recordEndingPlayback(endingType) {
    if (!viewedEndingPlaybacks.value.includes(endingType)) {
      viewedEndingPlaybacks.value.push(endingType)
      persist()
    }
  }

  function isEndingPlaybackViewed(endingType) {
    return viewedEndingPlaybacks.value.includes(endingType)
  }

  function getArchiveCompletionStats() {
    return {
      unlockedChapters: unlockedChapters.value.length,
      unlockedEndings: unlockedEndings.value.length,
      triggeredMemories: everTriggeredMemories.value.length,
      craftedItems: everCraftedItems.value.length,
      hiddenMemories: everUnlockedHiddenMemories.value.length,
      hiddenItems: everFoundHiddenItems.value.length,
      characterRelations: characterRelations.value.length
    }
  }

  init()

  return {
    unlockedEndings,
    everUnlockedHiddenMemories,
    everCraftedItems,
    everTriggeredMemories,
    everFoundHiddenItems,
    branchSaves,
    timePeriodStats,
    unlockedChapters,
    characterRelations,
    viewedEndingPlaybacks,
    hasArchive,
    endingCount,
    init,
    persist,
    recordEnding,
    recordHiddenMemories,
    recordCraftedItems,
    recordTriggeredMemories,
    recordTimePeriodStat,
    recordHiddenItem,
    createBranchSave,
    loadBranchSave,
    deleteBranchSave,
    clearArchive,
    isEndingUnlocked,
    isHiddenMemoryEverUnlocked,
    isCraftedItemEverObtained,
    isMemoryEverTriggered,
    isHiddenItemEverFound,
    unlockChapter,
    isChapterUnlocked,
    recordCharacterRelation,
    isCharacterRelationUnlocked,
    recordEndingPlayback,
    isEndingPlaybackViewed,
    getArchiveCompletionStats
  }
})
