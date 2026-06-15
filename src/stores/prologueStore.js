import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { prologueScenes, prologueForeshadowings } from '../data/prologueData'

export const usePrologueStore = defineStore('prologue', () => {
  const isActive = ref(false)
  const currentSceneIndex = ref(0)
  const exploredPoints = ref([])
  const collectedForeshadowings = ref([])
  const currentDialogue = ref(null)
  const currentDialogueIndex = ref(0)
  const isDialogueActive = ref(false)
  const isExitDialogueActive = ref(false)
  const exitDialogueIndex = ref(0)
  const isComplete = ref(false)
  const showForeshadowingReveal = ref(false)
  const currentForeshadowing = ref(null)
  const foreshadowingCallbackQueue = ref([])

  const currentScene = computed(() => prologueScenes[currentSceneIndex.value])
  const totalScenes = computed(() => prologueScenes.length)
  const sceneProgress = computed(() => {
    const scene = currentScene.value
    if (!scene) return 0
    const total = scene.interactivePoints.length
    const explored = scene.interactivePoints.filter(p => exploredPoints.value.includes(p.id)).length
    return total > 0 ? Math.round((explored / total) * 100) : 0
  })
  const overallProgress = computed(() => {
    const total = prologueScenes.reduce((sum, s) => sum + s.interactivePoints.length, 0)
    return total > 0 ? Math.round((exploredPoints.value.length / total) * 100) : 0
  })
  const canAdvanceScene = computed(() => {
    const scene = currentScene.value
    if (!scene) return false
    return scene.interactivePoints.every(p => exploredPoints.value.includes(p.id))
  })
  const collectedForeshadowingCount = computed(() => collectedForeshadowings.value.length)
  const totalForeshadowingCount = computed(() => prologueForeshadowings.length)
  const isLastScene = computed(() => currentSceneIndex.value >= prologueScenes.length - 1)

  function startPrologue() {
    isActive.value = true
    currentSceneIndex.value = 0
    exploredPoints.value = []
    collectedForeshadowings.value = []
    currentDialogue.value = null
    currentDialogueIndex.value = 0
    isDialogueActive.value = false
    isExitDialogueActive.value = false
    exitDialogueIndex.value = 0
    isComplete.value = false
    showForeshadowingReveal.value = false
    currentForeshadowing.value = null
  }

  function exitPrologue() {
    isActive.value = false
    currentSceneIndex.value = 0
    exploredPoints.value = []
    collectedForeshadowings.value = []
    currentDialogue.value = null
    currentDialogueIndex.value = 0
    isDialogueActive.value = false
    isExitDialogueActive.value = false
    exitDialogueIndex.value = 0
    isComplete.value = false
    showForeshadowingReveal.value = false
    currentForeshadowing.value = null
  }

  function explorePoint(pointId) {
    const scene = currentScene.value
    if (!scene) return null
    const point = scene.interactivePoints.find(p => p.id === pointId)
    if (!point) return null
    if (exploredPoints.value.includes(pointId)) return null

    exploredPoints.value.push(pointId)
    currentDialogue.value = point.dialogue
    currentDialogueIndex.value = 0
    isDialogueActive.value = true

    if (point.foreshadowing && !collectedForeshadowings.value.includes(point.foreshadowing)) {
      foreshadowingCallbackQueue.value.push(point.foreshadowing)
    }

    return point
  }

  function advanceDialogue() {
    if (!currentDialogue.value) return
    if (currentDialogueIndex.value < currentDialogue.value.length - 1) {
      currentDialogueIndex.value++
    } else {
      isDialogueActive.value = false
      currentDialogue.value = null
      currentDialogueIndex.value = 0

      if (foreshadowingCallbackQueue.value.length > 0) {
        const fId = foreshadowingCallbackQueue.value.shift()
        revealForeshadowing(fId)
      }
    }
  }

  function startExitDialogue() {
    const scene = currentScene.value
    if (!scene || !scene.exitDialogue) return
    isExitDialogueActive.value = true
    exitDialogueIndex.value = 0
  }

  function advanceExitDialogue() {
    const scene = currentScene.value
    if (!scene || !scene.exitDialogue) return
    if (exitDialogueIndex.value < scene.exitDialogue.length - 1) {
      exitDialogueIndex.value++
    } else {
      isExitDialogueActive.value = false
      exitDialogueIndex.value = 0
      if (isLastScene.value) {
        isComplete.value = true
      } else {
        advanceToNextScene()
      }
    }
  }

  function advanceToNextScene() {
    if (currentSceneIndex.value < prologueScenes.length - 1) {
      currentSceneIndex.value++
    }
  }

  function revealForeshadowing(foreshadowingId) {
    const f = prologueForeshadowings.find(item => item.id === foreshadowingId)
    if (!f) return
    if (!collectedForeshadowings.value.includes(foreshadowingId)) {
      collectedForeshadowings.value.push(foreshadowingId)
    }
    currentForeshadowing.value = f
    showForeshadowingReveal.value = true
  }

  function closeForeshadowingReveal() {
    showForeshadowingReveal.value = false
    currentForeshadowing.value = null
  }

  function isPointExplored(pointId) {
    return exploredPoints.value.includes(pointId)
  }

  function getForeshadowingById(fId) {
    return prologueForeshadowings.find(item => item.id === fId)
  }

  return {
    isActive,
    currentSceneIndex,
    exploredPoints,
    collectedForeshadowings,
    currentDialogue,
    currentDialogueIndex,
    isDialogueActive,
    isExitDialogueActive,
    exitDialogueIndex,
    isComplete,
    showForeshadowingReveal,
    currentForeshadowing,
    currentScene,
    totalScenes,
    sceneProgress,
    overallProgress,
    canAdvanceScene,
    collectedForeshadowingCount,
    totalForeshadowingCount,
    isLastScene,
    startPrologue,
    exitPrologue,
    explorePoint,
    advanceDialogue,
    startExitDialogue,
    advanceExitDialogue,
    advanceToNextScene,
    revealForeshadowing,
    closeForeshadowingReveal,
    isPointExplored,
    getForeshadowingById
  }
})
