import { defineStore } from 'pinia'
import { scenes, memories, craftedItems, recipes, hiddenMemories, specialEndings, chapters, keyChoices, hiddenItems, reunionEndings, endingWeightLabels } from '../data/storyData'
import { ENDING_MOOD_THRESHOLDS } from './moodStore'

export const EFFICIENCY_LEVELS = {
  PERFECT: 'perfect',
  EXCELLENT: 'excellent',
  GOOD: 'good',
  NORMAL: 'normal',
  POOR: 'poor'
}

export const useStoryStore = defineStore('story', () => {
  function getSceneById(sceneId) {
    return scenes.find(scene => scene.id === sceneId)
  }

  function getAllScenes() {
    return scenes
  }

  function getAvailableScenes(currentSceneId) {
    const currentScene = getSceneById(currentSceneId)
    if (!currentScene) return []
    return currentScene.connectedScenes.map(id => getSceneById(id)).filter(Boolean)
  }

  function getItemById(itemId) {
    for (const scene of scenes) {
      const item = scene.items.find(i => i.id === itemId)
      if (item) return item
    }
    return null
  }

  function getMemoryByItemId(itemId) {
    return memories.find(m => m.triggerItemId === itemId)
  }

  function getMemoryById(memoryId) {
    return memories.find(m => m.id === memoryId)
  }

  function getAllMemories() {
    return memories
  }

  function getTotalItemCount() {
    return scenes.reduce((count, scene) => count + scene.items.length, 0)
  }

  function getSceneItemCount(sceneId) {
    const scene = getSceneById(sceneId)
    return scene ? scene.items.length : 0
  }

  function getCraftedItemById(craftedId) {
    return craftedItems.find(c => c.id === craftedId)
  }

  function getAllCraftedItems() {
    return craftedItems
  }

  function getTotalCraftedCount() {
    return craftedItems.length
  }

  function getAllRecipes() {
    return recipes
  }

  function getRecipeById(recipeId) {
    return recipes.find(r => r.id === recipeId)
  }

  function getRecipeByResultId(resultId) {
    return recipes.find(r => r.resultId === resultId)
  }

  function getHiddenMemoryByCraftId(craftId) {
    return hiddenMemories.find(h => h.triggerCraftId === craftId)
  }

  function getHiddenMemoryById(hmId) {
    return hiddenMemories.find(h => h.id === hmId)
  }

  function getAllHiddenMemories() {
    return hiddenMemories
  }

  function getAllSpecialEndings() {
    return specialEndings
  }

  function getKeyChoiceById(choiceId) {
    return keyChoices.find(c => c.id === choiceId)
  }

  function getKeyChoiceByTriggerItem(itemId, chapterId) {
    return keyChoices.find(c => c.triggerItemId === itemId && c.chapter <= chapterId)
  }

  function getAllKeyChoices() {
    return keyChoices
  }

  function getHiddenItemById(hiId) {
    return hiddenItems.find(h => h.id === hiId)
  }

  function getAllHiddenItems() {
    return hiddenItems
  }

  function getTotalHiddenItemsCount() {
    return hiddenItems.length
  }

  function checkHiddenItemUnlock(baseItemId, inspectCount, timePeriod, foundItemsList) {
    const hiddenItemMap = {
      notebook: 'hi_locked_diary_page',
      photo: 'hi_photo_back',
      ticket: 'hi_ticket_stub',
      carving: 'hi_tree_initial',
      bottle: 'hi_bottle_second'
    }
    const conditionMap = {
      hi_locked_diary_page: () => baseItemId === 'notebook' && inspectCount >= 3 && timePeriod === 'night',
      hi_photo_back: () => baseItemId === 'photo' && inspectCount >= 2 && timePeriod === 'dusk',
      hi_ticket_stub: () => baseItemId === 'ticket' && inspectCount >= 2 && timePeriod === 'dawn',
      hi_tree_initial: () => baseItemId === 'carving' && inspectCount >= 3 && timePeriod === 'dusk',
      hi_bottle_second: () => baseItemId === 'bottle' && inspectCount >= 3 && timePeriod === 'night'
    }
    const targetId = hiddenItemMap[baseItemId]
    if (!targetId) return null
    const hi = getHiddenItemById(targetId)
    if (!hi) return null
    const condition = conditionMap[targetId]
    if (condition && condition()) {
      return hi
    }
    return null
  }

  function getAllReunionEndings() {
    return reunionEndings
  }

  function getEndingWeightLabels() {
    return endingWeightLabels
  }

  function getEndingWeightLabel(weightKey) {
    return endingWeightLabels[weightKey] || weightKey
  }

  function calculateFindEfficiency(foundCount, totalItems, timeUsed) {
    const percentage = totalItems > 0 ? foundCount / totalItems : 0
    const totalTime = 300
    const perfectTime = 180
    const goodTime = 220
    const normalTime = 260

    if (percentage >= 1 && timeUsed <= perfectTime) return EFFICIENCY_LEVELS.PERFECT
    if (percentage >= 0.9 && timeUsed <= goodTime) return EFFICIENCY_LEVELS.EXCELLENT
    if (percentage >= 0.75 && timeUsed <= normalTime) return EFFICIENCY_LEVELS.GOOD
    if (percentage >= 0.5) return EFFICIENCY_LEVELS.NORMAL
    return EFFICIENCY_LEVELS.POOR
  }

  function calculateMemoryCompleteness(triggeredMemoriesCount, totalMemories, unlockedHMCount, totalHMCount) {
    const normalRate = totalMemories > 0 ? triggeredMemoriesCount / totalMemories : 0
    const hmRate = totalHMCount > 0 ? unlockedHMCount / totalHMCount : 0
    const combined = normalRate * 0.6 + hmRate * 0.4

    if (combined >= 0.95) return EFFICIENCY_LEVELS.PERFECT
    if (combined >= 0.8) return EFFICIENCY_LEVELS.EXCELLENT
    if (combined >= 0.6) return EFFICIENCY_LEVELS.GOOD
    if (combined >= 0.35) return EFFICIENCY_LEVELS.NORMAL
    return EFFICIENCY_LEVELS.POOR
  }

  function checkEndingRequirements(ending, params) {
    const req = ending.requirements
    if (!req) return true

    if (req.moodMin !== undefined && params.moodValue < req.moodMin) return false
    if (req.findEfficiency && req.findEfficiency !== params.findEfficiency) {
      const levelOrder = [EFFICIENCY_LEVELS.POOR, EFFICIENCY_LEVELS.NORMAL, EFFICIENCY_LEVELS.GOOD, EFFICIENCY_LEVELS.EXCELLENT, EFFICIENCY_LEVELS.PERFECT]
      const reqLevel = levelOrder.indexOf(req.findEfficiency)
      const currentLevel = levelOrder.indexOf(params.findEfficiency)
      if (currentLevel < reqLevel) return false
    }
    if (req.memoryCompleteness && req.memoryCompleteness !== params.memoryCompleteness) {
      const levelOrder = [EFFICIENCY_LEVELS.POOR, EFFICIENCY_LEVELS.NORMAL, EFFICIENCY_LEVELS.GOOD, EFFICIENCY_LEVELS.EXCELLENT, EFFICIENCY_LEVELS.PERFECT]
      const reqLevel = levelOrder.indexOf(req.memoryCompleteness)
      const currentLevel = levelOrder.indexOf(params.memoryCompleteness)
      if (currentLevel < reqLevel) return false
    }
    if (req.keyChoices && req.keyChoices.length > 0) {
      const matchedCount = req.keyChoices.filter(kc => params.madeChoices.includes(kc)).length
      if (matchedCount < Math.ceil(req.keyChoices.length * 0.5)) return false
    }
    if (req.hiddenItems !== undefined && params.foundHiddenItemsCount < req.hiddenItems) return false
    if (req.craftedItems && req.craftedItems.length > 0) {
      const hasAll = req.craftedItems.every(ci => params.craftedItems.includes(ci))
      if (!hasAll) return false
    }
    return true
  }

  function calculateEndingMatchScore(ending, params) {
    let score = ending.score || 0
    const req = ending.requirements

    if (req?.keyChoices) {
      const matchedCount = req.keyChoices.filter(kc => params.madeChoices.includes(kc)).length
      score += matchedCount * 50
    }

    if (params.endingWeights) {
      const weightBonus = Object.values(params.endingWeights).reduce((sum, v) => sum + v, 0)
      score += weightBonus * 10
    }

    return score
  }

  function getReunionEnding(params) {
    const totalMemories = getAllMemories().length
    const findEfficiency = calculateFindEfficiency(params.foundCount, params.totalItems, params.timeUsed)
    const memoryCompleteness = calculateMemoryCompleteness(
      params.triggeredMemoriesCount,
      totalMemories,
      params.unlockedHMCount,
      params.totalHMCount
    )

    const fullParams = {
      ...params,
      findEfficiency,
      memoryCompleteness
    }

    const matched = []
    for (const ending of reunionEndings) {
      if (checkEndingRequirements(ending, fullParams)) {
        matched.push({
          ending,
          score: calculateEndingMatchScore(ending, fullParams)
        })
      }
    }

    let selected
    if (matched.length > 0) {
      matched.sort((a, b) => b.score - a.score)
      selected = matched[0].ending
    } else {
      selected = getFallbackEnding(fullParams)
    }

    return {
      id: selected.id,
      type: selected.type,
      title: selected.title,
      subtitle: selected.subtitle,
      description: selected.description,
      scene: selected.scene,
      score: selected.score,
      findEfficiency,
      memoryCompleteness,
      isSpecial: ['legendary', 'epic', 'special'].includes(selected.type),
      moodValue: params.moodValue
    }
  }

  function getFallbackEnding(params) {
    const percentage = params.foundCount / (params.totalItems || 1)
    if (percentage >= 0.8 && params.moodValue >= 60) {
      return reunionEndings.find(e => e.id === 're_nostalgic_reunion') || reunionEndings[4]
    } else if (percentage >= 0.5 && params.moodValue >= 35) {
      return reunionEndings.find(e => e.id === 're_warm_encounter') || reunionEndings[6]
    } else if (percentage >= 0.3 && params.moodValue >= 20) {
      return reunionEndings.find(e => e.id === 're_honest_start') || reunionEndings[8]
    } else if (params.moodValue >= 10) {
      return reunionEndings.find(e => e.id === 're_fog_missing') || reunionEndings[9]
    }
    return reunionEndings.find(e => e.id === 're_despair_lost') || reunionEndings[10]
  }

  function getAllChapters() {
    return chapters
  }

  function getChapterById(chapterId) {
    return chapters.find(c => c.id === chapterId)
  }

  function getCurrentChapter(memoryPercent) {
    let currentChapter = chapters[0]
    for (const chapter of chapters) {
      if (memoryPercent >= chapter.requiredMemoryPercent) {
        currentChapter = chapter
      }
    }
    return currentChapter
  }

  function getNextChapter(memoryPercent) {
    for (const chapter of chapters) {
      if (memoryPercent < chapter.requiredMemoryPercent) {
        return chapter
      }
    }
    return null
  }

  function getChapterProgress(memoryPercent) {
    const current = getCurrentChapter(memoryPercent)
    const next = getNextChapter(memoryPercent)
    if (!next) return 100
    const range = next.requiredMemoryPercent - current.requiredMemoryPercent
    const progress = memoryPercent - current.requiredMemoryPercent
    return Math.min(100, Math.round((progress / range) * 100))
  }

  function isSceneUnlocked(sceneId, chapterId) {
    const chapter = getChapterById(chapterId)
    if (!chapter) return false
    return chapter.unlockedScenes.includes(sceneId)
  }

  function getChapterAtmosphere(chapterId) {
    const chapter = getChapterById(chapterId)
    return chapter ? chapter.atmosphere : null
  }

  function getChapterSceneDescription(sceneId, chapterId) {
    const chapter = getChapterById(chapterId)
    if (chapter && chapter.sceneDescriptions && chapter.sceneDescriptions[sceneId]) {
      return chapter.sceneDescriptions[sceneId]
    }
    const scene = getSceneById(sceneId)
    return scene ? scene.description : ''
  }

  function getMemoryPercent(foundCount, totalItems) {
    if (totalItems === 0) return 0
    return Math.round((foundCount / totalItems) * 100)
  }

  function checkSpecialEndings(craftedIds, chapterId = 5) {
    const matched = []
    for (const ending of specialEndings) {
      const hasAll = ending.requiredCrafts.every(craftId => craftedIds.includes(craftId))
      const meetsChapter = !ending.requiredChapter || chapterId >= ending.requiredChapter
      if (hasAll && meetsChapter) {
        matched.push(ending)
      }
    }
    return matched
  }

  function getBestEnding(craftedIds, chapterId = 5, moodValue = 50) {
    const matched = checkSpecialEndings(craftedIds, chapterId)
    if (matched.length === 0) return null
    
    const moodFiltered = matched.filter(ending => {
      const threshold = ENDING_MOOD_THRESHOLDS[ending.type]
      return threshold === undefined || moodValue >= threshold
    })
    
    if (moodFiltered.length === 0) return null
    
    const priority = { legendary: 3, epic: 2, special: 1 }
    return moodFiltered.sort((a, b) => priority[b.type] - priority[a.type])[0]
  }

  function getEndingData(foundCount, totalCount, timeUsed, craftedIds = [], chapterId = 1, moodValue = 50) {
    const specialEnding = getBestEnding(craftedIds, chapterId, moodValue)
    if (specialEnding) {
      const moodBonus = moodValue >= ENDING_MOOD_THRESHOLDS[specialEnding.type] ? ' 心绪与回忆共鸣，让这份重逢更加真挚动人。' : ''
      return {
        type: specialEnding.type,
        title: specialEnding.title,
        description: specialEnding.description + moodBonus,
        image: specialEnding.image,
        isSpecial: true,
        moodValue
      }
    }

    const percentage = foundCount / totalCount
    const perfectTime = 180
    
    if (percentage >= 1 && timeUsed <= perfectTime && moodValue >= ENDING_MOOD_THRESHOLDS.perfect) {
      return {
        type: 'perfect',
        title: '完美重逢',
        description: '你找回了所有的回忆，在雾散之前，终于在熟悉的街角看见了那个等待已久的身影。五年的等待，此刻都化作了相逢的泪水。温暖的心绪让这一刻更加永恒。',
        image: 'perfect',
        moodValue
      }
    } else if (percentage >= 0.8 && moodValue >= ENDING_MOOD_THRESHOLDS.good) {
      return {
        type: 'good',
        title: '温暖重逢',
        description: '大部分的回忆都已找回，虽然有些碎片散落风中，但你知道，那个人一定还在某个地方等待着你。雾渐渐散了，前方的路清晰可见。温暖的心绪指引着你前进的方向。',
        image: 'good',
        moodValue
      }
    } else if (percentage >= 0.5 && moodValue >= ENDING_MOOD_THRESHOLDS.normal) {
      return {
        type: 'normal',
        title: '迷雾中的约定',
        description: '你找到了一些珍贵的回忆，但更多的还散落在这座雾城中。也许是时候放下过去，重新开始了。但你知道，有些约定，永远不会忘记。平静的心绪让你能够坦然面对。',
        image: 'normal',
        moodValue
      }
    } else if (moodValue >= ENDING_MOOD_THRESHOLDS.bad) {
      return {
        type: 'bad',
        title: '雾中迷失',
        description: '雾气越来越浓，你几乎看不清前方的路。那些珍贵的回忆，终究还是消散在了迷雾之中。也许，有些故事，注定没有结局... 低落的心绪让一切都显得更加黯淡。',
        image: 'bad',
        moodValue
      }
    } else {
      return {
        type: 'despair',
        title: '心之迷雾',
        description: '不仅雾气笼罩了这座城市，你的心也被深深的绝望所笼罩。回忆散落一地，却再也无法拼凑。也许，只有先找回自己，才能找回那些失去的东西。',
        image: 'despair',
        moodValue
      }
    }
  }

  return {
    getSceneById,
    getAllScenes,
    getAvailableScenes,
    getItemById,
    getMemoryByItemId,
    getMemoryById,
    getAllMemories,
    getTotalItemCount,
    getSceneItemCount,
    getCraftedItemById,
    getAllCraftedItems,
    getTotalCraftedCount,
    getAllRecipes,
    getRecipeById,
    getRecipeByResultId,
    getHiddenMemoryByCraftId,
    getHiddenMemoryById,
    getAllHiddenMemories,
    getAllSpecialEndings,
    checkSpecialEndings,
    getBestEnding,
    getEndingData,
    getAllChapters,
    getChapterById,
    getCurrentChapter,
    getNextChapter,
    getChapterProgress,
    isSceneUnlocked,
    getChapterAtmosphere,
    getChapterSceneDescription,
    getMemoryPercent,
    getKeyChoiceById,
    getKeyChoiceByTriggerItem,
    getAllKeyChoices,
    getHiddenItemById,
    getAllHiddenItems,
    getTotalHiddenItemsCount,
    checkHiddenItemUnlock,
    getAllReunionEndings,
    getEndingWeightLabels,
    getEndingWeightLabel,
    calculateFindEfficiency,
    calculateMemoryCompleteness,
    getReunionEnding
  }
})
