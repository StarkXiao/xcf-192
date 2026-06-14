import { defineStore } from 'pinia'
import { scenes, memories, craftedItems, recipes, hiddenMemories, specialEndings, chapters, keyChoices, hiddenItems, reunionEndings, endingWeightLabels, fakeClues, fogHiddenItems } from '../data/storyData'
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

  function getFakeCluesBySceneId(sceneId) {
    return fakeClues.filter(fc => fc.sceneId === sceneId)
  }

  function getAllFakeClues() {
    return fakeClues
  }

  function getFakeClueById(fcId) {
    return fakeClues.find(fc => fc.id === fcId)
  }

  function isFakeClueVisibleAtTime(fakeClue, hour) {
    if (!fakeClue || !fakeClue.visiblePeriods) return true
    const period = getTimePeriodForHour(hour)
    return fakeClue.visiblePeriods.includes(period)
  }

  function getFogHiddenItems() {
    return fogHiddenItems
  }

  function getFogHiddenItemByItemId(itemId) {
    return fogHiddenItems.find(fhi => fhi.itemId === itemId)
  }

  function getFogHiddenItemsBySceneId(sceneId) {
    return fogHiddenItems.filter(fhi => fhi.sceneId === sceneId)
  }

  function checkFogItemUnlock(fogItem, foundItemIds, triggeredMemoryCount, currentPeriod, currentChapterId) {
    if (!fogItem) return { unlocked: true, reason: 'no_fog_item' }

    switch (fogItem.unlockType) {
      case 'items':
        const hasAllItems = fogItem.requiredItems.every(itemId => foundItemIds.includes(itemId))
        return {
          unlocked: hasAllItems,
          reason: hasAllItems ? 'all_items_found' : 'missing_items',
          progress: fogItem.requiredItems.filter(id => foundItemIds.includes(id)).length,
          total: fogItem.requiredItems.length
        }
      case 'memory':
        const hasEnoughMemories = triggeredMemoryCount >= fogItem.requiredMemoryCount
        return {
          unlocked: hasEnoughMemories,
          reason: hasEnoughMemories ? 'enough_memories' : 'not_enough_memories',
          progress: triggeredMemoryCount,
          total: fogItem.requiredMemoryCount
        }
      case 'time':
        const rightPeriod = currentPeriod === fogItem.requiredPeriod
        const rightChapter = !fogItem.requiredChapter || currentChapterId >= fogItem.requiredChapter
        const timeUnlocked = rightPeriod && rightChapter
        return {
          unlocked: timeUnlocked,
          reason: timeUnlocked ? 'right_time' : (rightChapter ? 'wrong_time' : 'chapter_locked'),
          progress: timeUnlocked ? 1 : 0,
          total: 1
        }
      default:
        return { unlocked: true, reason: 'unknown_type' }
    }
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

  function getLevelIndex(level) {
    const levelOrder = [EFFICIENCY_LEVELS.POOR, EFFICIENCY_LEVELS.NORMAL, EFFICIENCY_LEVELS.GOOD, EFFICIENCY_LEVELS.EXCELLENT, EFFICIENCY_LEVELS.PERFECT]
    return levelOrder.indexOf(level)
  }

  function getKeyChoiceMatchThreshold(endingType) {
    const thresholds = {
      legendary: 1.0,
      epic: 0.8,
      special: 0.7,
      perfect: 0.7,
      good: 0.5,
      normal: 0.3,
      bad: 0.2,
      despair: 0
    }
    return thresholds[endingType] ?? 0.5
  }

  function checkEndingRequirements(ending, params) {
    const req = ending.requirements
    if (!req) return true

    if (req.moodMin !== undefined && params.moodValue < req.moodMin) return false

    if (req.findEfficiency) {
      const reqLevel = getLevelIndex(req.findEfficiency)
      const currentLevel = getLevelIndex(params.findEfficiency)
      if (currentLevel < reqLevel) return false
    }

    if (req.memoryCompleteness) {
      const reqLevel = getLevelIndex(req.memoryCompleteness)
      const currentLevel = getLevelIndex(params.memoryCompleteness)
      if (currentLevel < reqLevel) return false
    }

    if (req.keyChoices && req.keyChoices.length > 0) {
      const matchedCount = req.keyChoices.filter(kc => params.madeChoices.includes(kc)).length
      const threshold = getKeyChoiceMatchThreshold(ending.type)
      const required = Math.ceil(req.keyChoices.length * threshold)
      if (matchedCount < required) return false
    }

    if (req.hiddenItems !== undefined && params.foundHiddenItemsCount < req.hiddenItems) return false

    if (req.craftedItems && req.craftedItems.length > 0) {
      if (ending.type === 'legendary') {
        const hasAll = req.craftedItems.every(ci => params.craftedItems.includes(ci))
        if (!hasAll) return false
      } else if (ending.type === 'epic') {
        const matchedCount = req.craftedItems.filter(ci => params.craftedItems.includes(ci)).length
        if (matchedCount < Math.ceil(req.craftedItems.length * 0.6)) return false
      } else {
        const matchedCount = req.craftedItems.filter(ci => params.craftedItems.includes(ci)).length
        if (matchedCount < 1 && req.craftedItems.length > 0) return false
      }
    }

    return true
  }

  function calculateEndingMatchScore(ending, params) {
    let score = ending.score || 0
    const req = ending.requirements

    if (req?.findEfficiency) {
      const reqLevel = getLevelIndex(req.findEfficiency)
      const currentLevel = getLevelIndex(params.findEfficiency)
      const diff = currentLevel - reqLevel
      if (diff > 0) score += diff * 40
    } else {
      score += getLevelIndex(params.findEfficiency) * 20
    }

    if (req?.memoryCompleteness) {
      const reqLevel = getLevelIndex(req.memoryCompleteness)
      const currentLevel = getLevelIndex(params.memoryCompleteness)
      const diff = currentLevel - reqLevel
      if (diff > 0) score += diff * 40
    } else {
      score += getLevelIndex(params.memoryCompleteness) * 20
    }

    if (req?.keyChoices) {
      const matchedCount = req.keyChoices.filter(kc => params.madeChoices.includes(kc)).length
      score += matchedCount * 80
      const matchRate = matchedCount / req.keyChoices.length
      if (matchRate >= 1) score += 150
      else if (matchRate >= 0.8) score += 80
      else if (matchRate >= 0.6) score += 40
    }

    if (req?.hiddenItems !== undefined) {
      const diff = params.foundHiddenItemsCount - req.hiddenItems
      if (diff > 0) score += diff * 60
    } else {
      score += params.foundHiddenItemsCount * 30
    }

    if (req?.craftedItems) {
      const matchedCount = req.craftedItems.filter(ci => params.craftedItems.includes(ci)).length
      score += matchedCount * 70
      if (matchedCount === req.craftedItems.length && req.craftedItems.length > 0) score += 100
    } else {
      score += params.craftedItems.length * 25
    }

    if (req?.moodMin !== undefined) {
      const diff = params.moodValue - req.moodMin
      if (diff > 0) score += Math.min(diff, 30) * 3
    }

    if (params.endingWeights) {
      const weightBonus = Object.values(params.endingWeights).reduce((sum, v) => sum + v, 0)
      score += weightBonus * 15
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
    const findIdx = getLevelIndex(params.findEfficiency)
    const memIdx = getLevelIndex(params.memoryCompleteness)
    const choiceCount = params.madeChoices ? params.madeChoices.length : 0
    const hiCount = params.foundHiddenItemsCount || 0
    const mood = params.moodValue || 0

    const score = findIdx * 25 + memIdx * 25 + choiceCount * 15 + hiCount * 15 + mood * 0.4

    if (score >= 220 && mood >= 55) {
      return reunionEndings.find(e => e.id === 're_nostalgic_reunion') || reunionEndings[4]
    } else if (score >= 170 && mood >= 40) {
      return reunionEndings.find(e => e.id === 're_letting_go') || reunionEndings[5]
    } else if (score >= 170) {
      return reunionEndings.find(e => e.id === 're_warm_encounter') || reunionEndings[6]
    } else if (score >= 110 && mood >= 25) {
      return reunionEndings.find(e => e.id === 're_honest_start') || reunionEndings[8]
    } else if (score >= 110 || mood >= 15) {
      return reunionEndings.find(e => e.id === 're_regretful_meeting') || reunionEndings[7]
    } else if (mood >= 8) {
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
    getReunionEnding,
    getFakeCluesBySceneId,
    getAllFakeClues,
    getFakeClueById,
    isFakeClueVisibleAtTime,
    getFogHiddenItems,
    getFogHiddenItemByItemId,
    getFogHiddenItemsBySceneId,
    checkFogItemUnlock
  }
})
