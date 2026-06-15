import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import {
  COLLECTION_ITEMS,
  COLLECTION_PHASES,
  MATERIAL_SHOP,
  PHASE_REWARDS,
  PROVENANCE_ANSWERS
} from '../data/collectionData'

const COLLECTION_KEY = 'foggy_city_collection_room'
const SCHEMA_VERSION = 2

function cloneRelicInitialState(staticRelic) {
  return {
    id: staticRelic.id,
    condition: {
      current: staticRelic.condition?.current ?? 35,
      max: staticRelic.condition?.max ?? 100,
      labels: staticRelic.condition?.labels ?? []
    },
    restoration: {
      completed: false,
      steps: staticRelic.restoration.steps.map(s => ({
        id: s.id,
        desc: s.desc,
        requiredMat: s.requiredMat,
        done: false
      }))
    },
    provenance: {
      clues: staticRelic.provenance.clues.map(c => ({
        id: c.id,
        title: c.title,
        text: c.text,
        hint: c.hint
      })),
      origin: null,
      year: null,
      owner: null
    },
    story: {
      fragments: staticRelic.story.fragments.map(f => ({
        id: f.id,
        title: f.title,
        text: f.text || f.content
      })),
      complete: false
    }
  }
}

function buildFreshRelicStates() {
  const map = {}
  for (const staticRelic of COLLECTION_ITEMS) {
    map[staticRelic.id] = cloneRelicInitialState(staticRelic)
  }
  return map
}

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

  const relicStates = reactive(buildFreshRelicStates())

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

  function getRelicRuntime(relicId) {
    return relicStates[relicId] || null
  }

  function getRelicViewModel(relicId) {
    const def = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!def) return null
    const rt = relicStates[relicId]
    if (!rt) return def
    return {
      ...def,
      condition: { ...def.condition, ...rt.condition },
      restoration: {
        ...def.restoration,
        completed: rt.restoration.completed,
        steps: def.restoration.steps.map((sDef, idx) => ({
          ...sDef,
          done: rt.restoration.steps[idx]?.done ?? sDef.done ?? false
        }))
      },
      provenance: {
        ...def.provenance,
        clues: def.provenance.clues.map((cDef, idx) => ({
          ...cDef,
          ...(rt.provenance.clues[idx] || {})
        })),
        origin: rt.provenance.origin ?? def.provenance.origin,
        year: rt.provenance.year ?? def.provenance.year,
        owner: rt.provenance.owner ?? def.provenance.owner
      },
      story: {
        ...def.story,
        complete: rt.story.complete,
        fragments: def.story.fragments.map((fDef, idx) => ({
          ...fDef,
          ...(rt.story.fragments[idx] || {})
        }))
      }
    }
  }

  function init() {
    try {
      const data = localStorage.getItem(COLLECTION_KEY)
      if (!data) return
      const parsed = JSON.parse(data)

      if (parsed.schemaVersion !== SCHEMA_VERSION) {
        console.warn(`[收藏室] 数据版本不匹配（本地=${parsed.schemaVersion ?? 1}，当前=${SCHEMA_VERSION}），进行迁移或重建`)
      }

      coins.value = typeof parsed.coins === 'number' ? parsed.coins : 500
      unlockedRelics.value = Array.isArray(parsed.unlockedRelics) ? parsed.unlockedRelics : []
      restoredRelics.value = Array.isArray(parsed.restoredRelics) ? parsed.restoredRelics : []
      researchedRelics.value = Array.isArray(parsed.researchedRelics) ? parsed.researchedRelics : []
      storyCompleteRelics.value = Array.isArray(parsed.storyCompleteRelics) ? parsed.storyCompleteRelics : []
      ownedMaterials.value = parsed.ownedMaterials && typeof parsed.ownedMaterials === 'object' ? parsed.ownedMaterials : {}
      claimedPhases.value = Array.isArray(parsed.claimedPhases) ? parsed.claimedPhases : []
      unlockedStoryFragments.value = parsed.unlockedStoryFragments && typeof parsed.unlockedStoryFragments === 'object' ? parsed.unlockedStoryFragments : {}
      solvedClues.value = parsed.solvedClues && typeof parsed.solvedClues === 'object' ? parsed.solvedClues : {}
      currentPhase.value = parsed.currentPhase || 'phase1'
      recentActivity.value = Array.isArray(parsed.recentActivity) ? parsed.recentActivity : []

      const savedRelicStates = parsed.relicStates && typeof parsed.relicStates === 'object' ? parsed.relicStates : null

      for (const staticRelic of COLLECTION_ITEMS) {
        const rid = staticRelic.id
        const fresh = cloneRelicInitialState(staticRelic)
        const saved = savedRelicStates?.[rid]

        if (saved && typeof saved === 'object') {
          if (saved.condition && typeof saved.condition === 'object') {
            fresh.condition.current = typeof saved.condition.current === 'number'
              ? Math.min(fresh.condition.max, Math.max(0, saved.condition.current))
              : fresh.condition.current
            if (Array.isArray(saved.condition.labels)) {
              fresh.condition.labels = saved.condition.labels
            }
          }
          if (saved.restoration && typeof saved.restoration === 'object') {
            fresh.restoration.completed = !!saved.restoration.completed
            if (Array.isArray(saved.restoration.steps)) {
              for (let i = 0; i < fresh.restoration.steps.length; i++) {
                if (saved.restoration.steps[i]) {
                  fresh.restoration.steps[i].done = !!saved.restoration.steps[i].done
                }
              }
            }
          }
          if (saved.provenance && typeof saved.provenance === 'object') {
            fresh.provenance.origin = saved.provenance.origin ?? null
            fresh.provenance.year = saved.provenance.year ?? null
            fresh.provenance.owner = saved.provenance.owner ?? null
          }
          if (saved.story && typeof saved.story === 'object') {
            fresh.story.complete = !!saved.story.complete
          }
        }

        if (!relicStates[rid]) {
          relicStates[rid] = fresh
        } else {
          Object.assign(relicStates[rid].condition, fresh.condition)
          Object.assign(relicStates[rid].restoration, fresh.restoration)
          relicStates[rid].restoration.steps = fresh.restoration.steps
          Object.assign(relicStates[rid].provenance, fresh.provenance)
          relicStates[rid].provenance.clues = fresh.provenance.clues
          Object.assign(relicStates[rid].story, fresh.story)
          relicStates[rid].story.fragments = fresh.story.fragments
        }
      }

      for (const relicId of Object.keys(relicStates)) {
        if (!COLLECTION_ITEMS.find(i => i.id === relicId)) {
          delete relicStates[relicId]
        }
      }
    } catch (e) {
      console.error('[收藏室] 读取档案失败，已重置为初始状态：', e)
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
      const fresh = buildFreshRelicStates()
      for (const k of Object.keys(relicStates)) delete relicStates[k]
      for (const [k, v] of Object.entries(fresh)) relicStates[k] = v
    }
  }

  function persist() {
    try {
      const relicStatesSnapshot = {}
      for (const [rid, rt] of Object.entries(relicStates)) {
        relicStatesSnapshot[rid] = {
          condition: {
            current: rt.condition.current,
            labels: rt.condition.labels
          },
          restoration: {
            completed: rt.restoration.completed,
            steps: rt.restoration.steps.map(s => ({ id: s.id, done: !!s.done }))
          },
          provenance: {
            origin: rt.provenance.origin ?? null,
            year: rt.provenance.year ?? null,
            owner: rt.provenance.owner ?? null
          },
          story: {
            complete: !!rt.story.complete
          }
        }
      }

      const payload = {
        schemaVersion: SCHEMA_VERSION,
        updatedAt: Date.now(),
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
        recentActivity: recentActivity.value,
        relicStates: relicStatesSnapshot
      }
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(payload))
    } catch (e) {
      console.error('[收藏室] 保存档案失败:', e)
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
    return getRelicViewModel(relicId)
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
    if (!ownedMaterials.value[matId]) ownedMaterials.value[matId] = 0
    ownedMaterials.value[matId] += count
    addActivity(`💰 购买了 ${mat.icon} ${mat.name} x${count}，花费${totalCost}金币`, 'info')
    persist()
    return { success: true }
  }

  function canRestoreStep(relicId, stepId) {
    const relicDef = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!relicDef) return false
    const rt = relicStates[relicId]
    if (!rt) return false
    if (rt.restoration.completed) return false
    const stepIndex = relicDef.restoration.steps.findIndex(s => s.id === stepId)
    if (stepIndex < 0) return false
    const stepDef = relicDef.restoration.steps[stepIndex]
    const rtStep = rt.restoration.steps[stepIndex]
    if (!rtStep || rtStep.done) return false
    const mat = relicDef.restoration.materials.find(m => m.id === stepDef.requiredMat)
    if (!mat) return false
    return getMaterialCount(stepDef.requiredMat) >= mat.count
  }

  function performRestoreStep(relicId, stepId) {
    const relicDef = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!relicDef) return { success: false, reason: '旧物不存在' }
    const rt = relicStates[relicId]
    if (!rt) return { success: false, reason: '运行时状态缺失' }

    const stepIndex = relicDef.restoration.steps.findIndex(s => s.id === stepId)
    if (stepIndex < 0) return { success: false, reason: '修复步骤不存在' }

    const stepDef = relicDef.restoration.steps[stepIndex]
    const rtStep = rt.restoration.steps[stepIndex]
    if (rtStep.done) return { success: false, reason: '该步骤已完成' }

    const mat = relicDef.restoration.materials.find(m => m.id === stepDef.requiredMat)
    if (!mat) return { success: false, reason: '材料配方错误' }
    if (getMaterialCount(stepDef.requiredMat) < mat.count) {
      return { success: false, reason: '材料不足' }
    }

    useMaterial(stepDef.requiredMat, mat.count)
    rtStep.done = true

    const stepCount = rt.restoration.steps.length
    rt.condition.current = Math.min(rt.condition.max, rt.condition.current + Math.floor(70 / stepCount))

    const allDone = rt.restoration.steps.every(s => s.done)
    if (allDone) {
      rt.restoration.completed = true
      rt.condition.current = rt.condition.max
      if (!restoredRelics.value.includes(relicId)) {
        restoredRelics.value.push(relicId)
        coins.value += 150
        addActivity(`✨ 修复完成：${relicDef.icon} ${relicDef.name}，获得150金币！`, 'success')
      }
      checkPhaseReward(relicDef.phase)
    } else {
      addActivity(`🔧 修复进度：完成「${stepDef.desc}」`, 'info')
    }
    persist()
    return { success: true, completed: allDone, relic: getRelicViewModel(relicId) }
  }

  function checkPhaseReward(phaseId) {
    const phase = COLLECTION_PHASES[phaseId]
    if (!phase) return false
    const phaseItems = COLLECTION_ITEMS.filter(i => i.phase === phaseId)
    const restored = phaseItems.filter(i => restoredRelics.value.includes(i.id)).length
    return restored >= phase.requiredCount && !claimedPhases.value.includes(phaseId)
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
      if (!ownedMaterials.value[matId]) ownedMaterials.value[matId] = 0
      ownedMaterials.value[matId] += 1
      const mat = MATERIAL_SHOP.find(m => m.id === matId)
      if (mat) {
        addActivity(`📥 阶段奖励：${mat.icon} ${mat.name} x1`, 'success')
      }
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
    const relicDef = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!relicDef) return { success: false, reason: '旧物不存在' }
    const rt = relicStates[relicId]
    if (!rt) return { success: false, reason: '运行时状态缺失' }
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

    const isCorrect =
      normalizedCorrect.includes(normalizedAnswer) ||
      normalizedAnswer.includes(normalizedCorrect.replace(/[·.]/g, '')) ||
      (normalizedAnswer.length >= 2 && normalizedCorrect.replace(/[·.]/g, '').includes(normalizedAnswer))

    if (isCorrect) {
      solvedClues.value[relicId].push(clueId)
      coins.value += 30

      if (!unlockedStoryFragments.value[relicId]) {
        unlockedStoryFragments.value[relicId] = []
      }
      const fragIndex = relicDef.provenance.clues.findIndex(c => c.id === clueId)
      const fragId = relicDef.story.fragments[fragIndex]?.id
      if (fragId && !unlockedStoryFragments.value[relicId].includes(fragId)) {
        unlockedStoryFragments.value[relicId].push(fragId)
      }

      const allCluesSolved = relicDef.provenance.clues.every(c =>
        solvedClues.value[relicId]?.includes(c.id)
      )
      if (allCluesSolved) {
        rt.provenance.origin = answers.origin
        rt.provenance.year = answers.year
        rt.provenance.owner = answers.owner
        if (!researchedRelics.value.includes(relicId)) {
          researchedRelics.value.push(relicId)
          coins.value += 100
          addActivity(`🔍 考证完成：${relicDef.icon} ${relicDef.name}，获得100金币！`, 'success')
        }
      }

      addActivity(`📜 考证线索：${clueAnswer.answer}`, 'info')
      persist()
      return { success: true, explanation: clueAnswer.explanation, completed: allCluesSolved }
    }

    return { success: false, reason: '答案不正确，再想想看？' }
  }

  function getHintForClue(relicId, clueId) {
    const relicDef = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!relicDef) return null
    const clue = relicDef.provenance.clues.find(c => c.id === clueId)
    return clue?.hint || null
  }

  function isFragmentUnlocked(relicId, fragId) {
    return unlockedStoryFragments.value[relicId]?.includes(fragId) || false
  }

  function unlockNextFragment(relicId) {
    const relicDef = COLLECTION_ITEMS.find(i => i.id === relicId)
    if (!relicDef) return { success: false }
    const rt = relicStates[relicId]
    if (!rt) return { success: false }
    const unlocked = unlockedStoryFragments.value[relicId] || []
    const totalFragments = relicDef.story.fragments.length

    if (unlocked.length >= totalFragments) {
      if (!storyCompleteRelics.value.includes(relicId)) {
        storyCompleteRelics.value.push(relicId)
        rt.story.complete = true
        coins.value += 200
        addActivity(`📖 故事完整：${relicDef.icon} ${relicDef.name} 的故事已补完！获得200金币！`, 'success')
      }
      persist()
      return { success: true, completed: true }
    }

    if (coins.value < 40) {
      return { success: false, reason: '金币不足（需要40金币）' }
    }

    coins.value -= 40
    const nextFrag = relicDef.story.fragments[unlocked.length]
    if (!unlockedStoryFragments.value[relicId]) {
      unlockedStoryFragments.value[relicId] = []
    }
    unlockedStoryFragments.value[relicId].push(nextFrag.id)
    addActivity(`📖 解锁故事片段（${unlocked.length + 1}/${totalFragments}）`, 'info')

    if (unlockedStoryFragments.value[relicId].length >= totalFragments) {
      if (!storyCompleteRelics.value.includes(relicId)) {
        storyCompleteRelics.value.push(relicId)
        rt.story.complete = true
        coins.value += 200
        addActivity(`📖 故事完整：${relicDef.icon} ${relicDef.name} 的故事已补完！获得200金币！`, 'success')
      }
    }
    persist()
    return {
      success: true,
      fragment: nextFrag,
      completed: unlockedStoryFragments.value[relicId].length >= totalFragments
    }
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

    const fresh = buildFreshRelicStates()
    for (const k of Object.keys(relicStates)) delete relicStates[k]
    for (const [k, v] of Object.entries(fresh)) relicStates[k] = v

    try {
      localStorage.removeItem(COLLECTION_KEY)
    } catch (e) {
      console.error('[收藏室] 清除档案失败:', e)
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
    relicStates,
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
    getRelicRuntime,
    getRelicViewModel,
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
    persist,
    init
  }
})
