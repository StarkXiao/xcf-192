import { defineStore } from 'pinia'
import { ref } from 'vue'

const SAVE_KEY = 'foggy_city_reunion_save'

export const useSaveStore = defineStore('save', () => {
  const hasSave = ref(false)

  function init() {
    hasSave.value = !!localStorage.getItem(SAVE_KEY)
  }

  function saveGame(gameData) {
    try {
      const saveData = {
        ...gameData,
        timestamp: Date.now()
      }
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      hasSave.value = true
      return true
    } catch (error) {
      console.error('保存游戏失败:', error)
      return false
    }
  }

  function loadGame() {
    try {
      const saved = localStorage.getItem(SAVE_KEY)
      if (!saved) return null
      
      const saveData = JSON.parse(saved)
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000
      
      if (now - saveData.timestamp > maxAge) {
        clearSave()
        return null
      }
      
      return saveData
    } catch (error) {
      console.error('读取存档失败:', error)
      return null
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(SAVE_KEY)
      hasSave.value = false
      return true
    } catch (error) {
      console.error('清除存档失败:', error)
      return false
    }
  }

  function checkHasSave() {
    init()
    return hasSave.value
  }

  init()

  return {
    hasSave,
    saveGame,
    loadGame,
    clearSave,
    checkHasSave
  }
})
