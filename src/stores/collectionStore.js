import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  COLLECTION_ITEMS,
  COLLECTION_PHASES,
  MATERIAL_SHOP,
  PHASE_REWARDS,
  PROVENANCE_ANSWERS
} from '../data/collectionData'

const COLLECTION_KEY = 'foggy_city_collection_room'

export const useCollectionStore = defineStore('collection', () => {
  const isCollectionRoomActive = ref(false)
  const currentTab = ref('room')
  const selectedItemId = ref(null)
  const showRewardModal = ref(false)
  const currentReward = ref(null)

  const coins = ref(500)
  const unlockedRelics = ref([])
  const restoredRelics = ref([])
  const researchedRelics = ref([])
  const storyCompleteRelics = ref([])
  const ownedMaterials = ref({})
  const claimedPhases = ref([])
  const unlockedStoryFragments = ref({})
  const solvedClues = ref({})
  const currentPhase = ref('phase1')

  const recentActivity = ref([])

  function addActivity(text, type = 'info') {
    recentActivity.value.unshift({
      id: Date.now(),
      text,
      type,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    if (recentActivity.value.length > 50) {
      recentActivity.value.pop()
    }
  }

  const allCollectionItems = computed(() => COLLECTION_ITEMS)
  const allPhases = computed(() => COLLECTION_PHASES)
  const allMaterials = computed(() => MATERIAL_SHOP)
  const phaseRewards = computed(() => PHASE_REWARDS)

  function init() {
    try {
      const data = localStorage.getItem(COLLECTION_KEY)
      if (!data) return
      const parsed = JSON.parse(data)
      coins.value = parsed.coins ?? 500
      unlockedRelics.value = parsed.unlockedRelics ?? []
      restoredRelics.value = parsed.restoredRelics ?? []
      researchedRelics.value = parsed.researchedRelics ?? []
      storyCompleteRelics.value = parsed.storyCompleteRelics ?? []
      ownedMaterials.value = parsed.ownedMaterials ?? {}
      claimedPhases.value = parsed.claimedPhases ?? []
      unlockedStoryFragments.value = parsed.unlockedStoryFragments ?? {}
      solvedClues.value = parsed.solvedClues ?? {}
      currentPhase.value = parsed.currentPhase ?? 'phase1'
      recentActivity.value = parsed.recentActivity ?? []
    } catch (e) {
      console.error('读取收藏室档案失败:', e)
    }
  }

  function persist() {
    try {
      const data = {
        coins: coins.value,
        unlockedRelics: unlockedRelics.value,
        restoredRelics: restoredRelics.value,
        researchedRelics: researchedRelics.value,
        storyCompleteRelics: storyCompleteRelics.value,
        ownedMaterials: ownedMaterials.value,
        claimedPhases: claimedPhases.value,
        unlockedStoryFragments: unlockedStoryFragments.value,
        solvedClues: solvedClues.value,
        currentPhase: currentPhase.value,
        recentActivity: recentActivity.value
      }
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存收藏室档案失败:', e)
    }
  }

  const totalRelicCount = computed(() => COLLECTION_ITEMS.length)
  const unlockedRelicCount = computed(() => unlockedRelics.value.length)
  const restoredRelicCount = computed(() => restoredRelics.value.length)
  const researchedRelicCount = computed(() => researchedRelics.value.length)
  const storyCompleteCount = computed(() => storyCompleteRelics.value.length)

  const overallProgress = computed(() => {
    if (totalRelicCount.value === 0) return 0
    const unlockWeight = 0.25
    const restoreWeight = 0.3
    const researchWeight = 0.25
    const storyWeight = 0.2
    const total = totalRelicCount.value
    const progress =
      (unlockedRelicCount.value / total) * unlockWeight +
      (restoredRelicCount.value / total) * restoreWeight +
      (researchedRelicCount.value / total) * researchWeight +
      (storyCompleteCount.value / total) * storyWeight
    return Math.round(progress * 100)
  })

  const phaseProgress = computed(() => {
    const result = {}
    for (const [phaseId, phase] of Object.entries(COLLECTION_PHASES)) {
      const phaseItems = COLLECTION_ITEMS.filter(i => i.phase === phaseId)
      const unlocked = phaseItems.filter(i => unlockedRelics.value.includes(i.id)).length
      const restored = phaseItems.filter(i => restoredRelics.value.includes(i.id)).length
      const researched = phaseItems.filter(i => researchedRelics.value.includes(i.id)).length
      const storyComplete = phaseItems.filter(i => storyCompleteRelics.value.includes(i.id)).length
      result[phaseId] = {
        ...phase,
        total: phaseItems.length,
        unlocked,
        restored,
        researched,
        storyComplete,
        canClaim: restored >= phase.requiredCount && !claimedPhases.value.includes(phaseId)
      }
    }
    return result
  })

  const relicsByPhase = computed(() => {
    const result = {}
    for (const [phaseId] of Object.entries(COLLECTION_PHASES)) {
      result[phaseId] = COLLECTION_ITEMS.filter(i => i.phase === phaseId)
    }
    return result
  })

  function isRelicUnlocked(relicId) {
    return unlockedRelics.value.includes(relicId)
  }

  function isRelicRestored(relicId) {
    return restoredRelics.value.includes(relicId)
  }

  function isRelicResearched(relicId) {
    return researchedRelics.value.includes(relicId)
  }

  function isStoryComplete(relicId) {
    return storyCompleteRelics.value.includes(relicId)
  }

  function getRelicById(relicId) {
    return COLLECTION_ITEMS.find(i => i.id === relicId)
  }

  function unlockRelicByBaseItem(baseItemId) {
    const relic = COLLECTION_ITEMS.find(i => i.baseItemId === baseItemId)
    if (relic && !unlockedRelics.value.includes(relic.id)) {
      unlockedRelics.value.push(relic.id)
      coins.value += 50
      addActivity(`📦 发现了「${relic.name}」，获得50金币`, 'success')
      updateCurrentPhase()
      persist()
      return relic
    }
    return null
  }

  function unlockRelic(relicId) {
    const relic = getRelicById(relicId)
    if (relic && !unlockedRelics.value.includes(relicId)) {
      unlockedRelics.value.push(relicId)
      coins.value += 50
      addActivity(`📦 发现了「${relic.name}」，获得50金币`, 'success')
      updateCurrentPhase()
      persist()
      return true
    }
    return false
  }

  function updateCurrentPhase() {
    const phases = Object.keys(COLLECTION_PHASES)
    for (let i = phases.length - 1; i >= 0; i--) {
      const phaseId = phases[i]
      const phaseItems = COLLECTION_ITEMS.filter(it => it.phase === phaseId)
      const unlocked = phaseItems.filter(it => unlockedRelics.value.includes(it.id)).length
      if (unlocked > 0 || currentPhase.value === phaseId) {
        currentPhase.value = phaseId
        break
      }
    }
  }

  function getMaterialCount(matId) {
    return ownedMaterials.value[matId] || 0
  }

  function addMaterial(matId, count = 1) {
    if (!ownedMaterials.value[matId]) {
      ownedMaterials.value[matId] = 0
    }
    ownedMaterials.value[matId] += count
    const mat = MATERIAL_SHOP.find(m => m.id === matId)
    if (mat) {
      addActivity(`📥 获得材料：${mat.icon} ${mat.name} x${count}`, 'info')
    }
    persist()
  }

  function useMaterial(matId, count = 1) {
    const current = getMaterialCount(matId)
    if (current >= count) {
      ownedMaterials.value[matId] = current - count
      persist()
      return true
    }
    return false
  }

  function canAffordMaterial(matId) {
    const mat = MATERIAL_SHOP.find(m => m.id === matId)
    return mat && coins.value >= mat.price
  }

  function buyMaterial(matId, count = 1) {
    const mat = MATERIAL_SHOP.find(m => m.id === matId)
    if (!mat) return { success: false, reason: '材料不存在' }
    const totalCost = mat.price * count
    if (coins.value < totalCost) {
      return { success: false, reason: '金币不足' }
    }
    coins.value -= totalCost
    addMaterial(matId, count)
    addActivity(`💰 购买了 ${mat.icon} ${mat.name} x${count}，花费${totalCost}金币`, 'info')
    persist()
    return { success: true }
  }

  function canRestoreStep(relicId, stepId) {
    const relic = getRelicById(relicId)
    if (!relic) return false
    const step = relic.restoration.steps.find(s => s.id === stepId)
    if (!step || step.done) return false
    const mat = relic.restoration.materials.find(m => m.id === step.requiredMat)
    if (!mat) return false
    return getMaterialCount(step.requiredMat) >= mat.count
  }

  function performRestoreStep(relicId, stepId) {
    if (!canRestoreStep(relicId, stepId)) {
      return { success: false, reason: '条件不满足' }
    }
    const relic = getRelicById(relicId)
    const step = relic.restoration.steps.find(s => s.id === stepId)
    const mat = relic.restoration.materials.find(m => m.id === step.requiredMat)
    
    useMaterial(step.requiredMat, mat.count)
    step.done = true

    relic.condition.current = Math.min(100, relic.condition.current + Math.floor(70 / relic.restoration.steps.length))

    const allDone = relic.restoration.steps.every(s => s.done)
    if (allDone) {
      relic.restoration.completed = true
      relic.condition.current = 100
      if (!restoredRelics.value.includes(relicId)) {
        restoredRelics.value.push(relicId)
        coins.value += 150
        addActivity(`✨ 修复完成：${relic.icon} ${relic.name}，获得150金币！`, 'success')
      }
      checkPhaseReward(relic.phase)
    } else {
      addActivity(`🔧 修复进度：完成「${step.desc}」`, 'info')
    }
    persist()
    return { success: true, completed: allDone, relic }
  }

  function checkPhaseReward(phaseId) {
    const phase = COLLECTION_PHASES[phaseId]
    if (!phase) return
    const phaseItems = COLLECTION_ITEMS.filter(i => i.phase === phaseId)
    const restored = phaseItems.filter(i => restoredRelics.value.includes(i.id)).length
    if (restored >= phase.requiredCount && !claimedPhases.value.includes(phaseId)) {
      return true
    }
    return false
  }

  function claimPhaseReward(phaseId) {
    if (claimedPhases.value.includes(phaseId)) {
      return { success: false, reason: '已领取' }
    }
    if (!checkPhaseReward(phaseId)) {
      return { success: false, reason: '未达成条件' }
    }
    const reward = PHASE_REWARDS[phaseId]
    if (!reward) return { success: false, reason: '奖励不存在' }

    claimedPhases.value.push(phaseId)
    coins.value += reward.coins
    for (const matId of reward.materials) {
      addMaterial(matId, 1)
    }

    currentReward.value = {
      phase: COLLECTION_PHASES[phaseId],
      reward
    }
    showRewardModal.value = true

    addActivity(`🏆 达成阶段「${COLLECTION_PHASES[phaseId].name}」，获得丰厚奖励！`, 'success')
    persist()
    return { success: true, reward, phase: COLLECTION_PHASES[phaseId] }
  }

  function isClueSolved(relicId, clueId) {
    return solvedClues.value[relicId]?.includes(clueId) || false
  }

  function solveClue(relicId, clueId, answer) {
    const relic = getRelicById(relicId)
    if (!relic) return { success: false, reason: '旧物不存在' }
    const answers = PROVENANCE_ANSWERS[relicId]
    if (!answers) return { success: false, reason: '考证资料缺失' }
    const clueAnswer = answers[clueId]
    if (!clueAnswer) return { success: false, reason: '线索不存在' }

    if (!solvedClues.value[relicId]) {
      solvedClues.value[relicId] = []
    }
    if (solvedClues.value[relicId].includes(clueId)) {
      return { success: false, reason: '已考证过' }
    }

    const normalizedAnswer = answer.trim().toLowerCase()
    const normalizedCorrect = clueAnswer.answer.trim().toLowerCase()
    
    const isCorrect = normalizedCorrect.includes(normalizedAnswer) || 
                      normalizedAnswer.includes(normalizedCorrect.replace(/[·.]/g, '')) ||
                      normalizedAnswer.length >= 2 && normalizedCorrect.replace(/[·.]/g, '').includes(normalizedAnswer)

    if (isCorrect) {
      solvedClues.value[relicId].push(clueId)
      coins.value += 30

      if (!unlockedStoryFragments.value[relicId]) {
        unlockedStoryFragments.value[relicId] = []
      }
      const fragIndex = relic.provenance.clues.findIndex(c => c.id === clueId)
      const fragId = relic.story.fragments[fragIndex]?.id
      if (fragId && !unlockedStoryFragments.value[relicId].includes(fragId)) {
        unlockedStoryFragments.value[relicId].push(fragId)
      }

      const allCluesSolved = relic.provenance.clues.every(c => 
        solvedClues.value[relicId]?.includes(c.id)
      )
      if (allCluesSolved) {
        relic.provenance.origin = answers.origin
        relic.provenance.year = answers.year
        relic.provenance.owner = answers.owner
        if (!researchedRelics.value.includes(relicId)) {
          researchedRelics.value.push(relicId)
          coins.value += 100
          addActivity(`🔍 考证完成：${relic.icon} ${relic.name}，获得100金币！`, 'success')
        }
      }

      addActivity(`📜 考证线索：${clueAnswer.answer}`, 'info')
      persist()
      return { success: true, explanation: clueAnswer.explanation, completed: allCluesSolved }
    }

    return { success: false, reason: '答案不正确，再想想看？' }
  }

  function getHintForClue(relicId, clueId) {
    const relic = getRelicById(relicId)
    if (!relic) return null
    const clue = relic.provenance.clues.find(c => c.id === clueId)
    return clue?.hint || null
  }

  function isFragmentUnlocked(relicId, fragId) {
    return unlockedStoryFragments.value[relicId]?.includes(fragId) || false
  }

  function unlockNextFragment(relicId) {
    const relic = getRelicById(relicId)
    if (!relic) return { success: false }
    const unlocked = unlockedStoryFragments.value[relicId] || []
    const totalFragments = relic.story.fragments.length
    
    if (unlocked.length >= totalFragments) {
      if (!storyCompleteRelics.value.includes(relicId)) {
        storyCompleteRelics.value.push(relicId)
        relic.story.complete = true
        coins.value += 200
        addActivity(`📖 故事完整：${relic.icon} ${relic.name} 的故事已补完！获得200金币！`, 'success')
      }
      persist()
      return { success: true, completed: true }
    }

    if (coins.value < 40) {
      return { success: false, reason: '金币不足（需要40金币）' }
    }

    coins.value -= 40
    const nextFrag = relic.story.fragments[unlocked.length]
    if (!unlockedStoryFragments.value[relicId]) {
      unlockedStoryFragments.value[relicId] = []
    }
    unlockedStoryFragments.value[relicId].push(nextFrag.id)
    addActivity(`📖 解锁故事片段（${unlocked.length + 1}/${totalFragments}）`, 'info')

    if (unlockedStoryFragments.value[relicId].length >= totalFragments) {
      if (!storyCompleteRelics.value.includes(relicId)) {
        storyCompleteRelics.value.push(relicId)
        relic.story.complete = true
        coins.value += 200
        addActivity(`📖 故事完整：${relic.icon} ${relic.name} 的故事已补完！获得200金币！`, 'success')
      }
    }
    persist()
    return { success: true, fragment: nextFrag, completed: unlockedStoryFragments.value[relicId].length >= totalFragments }
  }

  function getRarityLabel(rarity) {
    const labels = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }
    return labels[rarity] || rarity
  }

  function getRarityColor(rarity) {
    const colors = {
      common: '#94a3b8',
      rare: '#60a5fa',
      epic: '#c084fc',
      legendary: '#ffd700'
    }
    return colors[rarity] || '#94a3b8'
  }

  function getUnlockedCountForPhase(phaseId) {
    return relicsByPhase.value[phaseId]?.filter(i => unlockedRelics.value.includes(i.id)).length || 0
  }

  function getRestoredCountForPhase(phaseId) {
    return relicsByPhase.value[phaseId]?.filter(i => restoredRelics.value.includes(i.id)).length || 0
  }

  function openCollectionRoom() {
    isCollectionRoomActive.value = true
  }

  function closeCollectionRoom() {
    isCollectionRoomActive.value = false
    currentTab.value = 'room'
    selectedItemId.value = null
  }

  function setTab(tab) {
    currentTab.value = tab
  }

  function selectItem(relicId) {
    selectedItemId.value = relicId
  }

  function closeRewardModal() {
    showRewardModal.value = false
    currentReward.value = null
  }

  function clearAll() {
    coins.value = 500
    unlockedRelics.value = []
    restoredRelics.value = []
    researchedRelics.value = []
    storyCompleteRelics.value = []
    ownedMaterials.value = {}
    claimedPhases.value = []
    unlockedStoryFragments.value = {}
    solvedClues.value = {}
    currentPhase.value = 'phase1'
    recentActivity.value = []
    
    for (const relic of COLLECTION_ITEMS) {
      relic.restoration.completed = false
      relic.condition.current = 30 + Math.floor(Math.random() * 40)
      relic.story.complete = false
      relic.provenance.origin = null
      relic.provenance.year = null
      relic.provenance.owner = null
      for (const step of relic.restoration.steps) {
        step.done = false
      }
    }
    
    try {
      localStorage.removeItem(COLLECTION_KEY)
    } catch (e) {
      console.error('清除收藏室档案失败:', e)
    }
  }

  init()

  return {
    isCollectionRoomActive,
    currentTab,
    selectedItemId,
    showRewardModal,
    currentReward,
    coins,
    unlockedRelics,
    restoredRelics,
    researchedRelics,
    storyCompleteRelics,
    ownedMaterials,
    claimedPhases,
    unlockedStoryFragments,
    solvedClues,
    currentPhase,
    recentActivity,
    allCollectionItems,
    allPhases,
    allMaterials,
    phaseRewards,
    totalRelicCount,
    unlockedRelicCount,
    restoredRelicCount,
    researchedRelicCount,
    storyCompleteCount,
    overallProgress,
    phaseProgress,
    relicsByPhase,
    isRelicUnlocked,
    isRelicRestored,
    isRelicResearched,
    isStoryComplete,
    getRelicById,
    unlockRelicByBaseItem,
    unlockRelic,
    getMaterialCount,
    addMaterial,
    useMaterial,
    canAffordMaterial,
    buyMaterial,
    canRestoreStep,
    performRestoreStep,
    checkPhaseReward,
    claimPhaseReward,
    isClueSolved,
    solveClue,
    getHintForClue,
    isFragmentUnlocked,
    unlockNextFragment,
    getRarityLabel,
    getRarityColor,
    getUnlockedCountForPhase,
    getRestoredCountForPhase,
    openCollectionRoom,
    closeCollectionRoom,
    setTab,
    selectItem,
    closeRewardModal,
    clearAll,
    addActivity,
    persist
  }
})
