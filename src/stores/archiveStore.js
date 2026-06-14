import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const ARCHIVE_KEY = 'foggy_city_reunion_archive'

export const useArchiveStore = defineStore('archive', () => {
  const unlockedEndings = ref([])
  const everUnlockedHiddenMemories = ref([])
  const everCraftedItems = ref([])
  const everTriggeredMemories = ref([])
  const branchSaves = ref([])

  const hasArchive = computed(() => {
    return unlockedEndings.value.length > 0
      || everUnlockedHiddenMemories.value.length > 0
      || everCraftedItems.value.length > 0
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
      branchSaves.value = parsed.branchSaves || []
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
        branchSaves: branchSaves.value
      }
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存档案失败:', e)
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

  function clearArchive() {
    unlockedEndings.value = []
    everUnlockedHiddenMemories.value = []
    everCraftedItems.value = []
    everTriggeredMemories.value = []
    branchSaves.value = []
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

  init()

  return {
    unlockedEndings,
    everUnlockedHiddenMemories,
    everCraftedItems,
    everTriggeredMemories,
    branchSaves,
    hasArchive,
    endingCount,
    init,
    persist,
    recordEnding,
    recordHiddenMemories,
    recordCraftedItems,
    recordTriggeredMemories,
    createBranchSave,
    loadBranchSave,
    deleteBranchSave,
    clearArchive,
    isEndingUnlocked,
    isHiddenMemoryEverUnlocked,
    isCraftedItemEverObtained,
    isMemoryEverTriggered
  }
})
