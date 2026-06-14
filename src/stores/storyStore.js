import { defineStore } from 'pinia'
import { scenes, memories, craftedItems, recipes, hiddenMemories, specialEndings } from '../data/storyData'

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

  function checkSpecialEndings(craftedIds) {
    const matched = []
    for (const ending of specialEndings) {
      const hasAll = ending.requiredCrafts.every(craftId => craftedIds.includes(craftId))
      if (hasAll) {
        matched.push(ending)
      }
    }
    return matched
  }

  function getBestEnding(craftedIds) {
    const matched = checkSpecialEndings(craftedIds)
    if (matched.length === 0) return null
    const priority = { legendary: 3, epic: 2, special: 1 }
    return matched.sort((a, b) => priority[b.type] - priority[a.type])[0]
  }

  function getEndingData(foundCount, totalCount, timeUsed, craftedIds = []) {
    const specialEnding = getBestEnding(craftedIds)
    if (specialEnding) {
      return {
        type: specialEnding.type,
        title: specialEnding.title,
        description: specialEnding.description,
        image: specialEnding.image,
        isSpecial: true
      }
    }

    const percentage = foundCount / totalCount
    const perfectTime = 180
    
    if (percentage >= 1 && timeUsed <= perfectTime) {
      return {
        type: 'perfect',
        title: '完美重逢',
        description: '你找回了所有的回忆，在雾散之前，终于在熟悉的街角看见了那个等待已久的身影。五年的等待，此刻都化作了相逢的泪水。',
        image: 'perfect'
      }
    } else if (percentage >= 0.8) {
      return {
        type: 'good',
        title: '温暖重逢',
        description: '大部分的回忆都已找回，虽然有些碎片散落风中，但你知道，那个人一定还在某个地方等待着你。雾渐渐散了，前方的路清晰可见。',
        image: 'good'
      }
    } else if (percentage >= 0.5) {
      return {
        type: 'normal',
        title: '迷雾中的约定',
        description: '你找到了一些珍贵的回忆，但更多的还散落在这座雾城中。也许是时候放下过去，重新开始了。但你知道，有些约定，永远不会忘记。',
        image: 'normal'
      }
    } else {
      return {
        type: 'bad',
        title: '雾中迷失',
        description: '雾气越来越浓，你几乎看不清前方的路。那些珍贵的回忆，终究还是消散在了迷雾之中。也许，有些故事，注定没有结局...',
        image: 'bad'
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
    getEndingData
  }
})
