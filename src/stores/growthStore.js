import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGameStore } from './gameStore'
import { useArchiveStore } from './archiveStore'
import { useCollectionStore } from './collectionStore'
import { useChallengeStore } from './challengeStore'
import { useSaveStore } from './saveStore'
import {
  GROWTH_SCHEMA_VERSION,
  CHAPTER_GOALS,
  ACHIEVEMENTS,
  HIDDEN_DIARIES,
  LOCATION_RATING_RULES,
  REPLAY_REWARDS,
  DAILY_LOGIN_REWARDS,
  RARITY_COLORS,
  ACHIEVEMENT_CATEGORIES,
  DIARY_CATEGORIES
} from '../data/growthData'

const GROWTH_KEY = 'foggy_city_growth_v2'

export const useGrowthStore = defineStore('growth', () => {
  const showGrowthCenter = ref(false)
  const newlyUnlockedAchievements = ref([])
  const newlyUnlockedDiaries = ref([])
  const showAchievementUnlock = ref(null)
  const showDiaryUnlock = ref(null)
  const showReplayReward = ref(null)

  const totalPlayCount = ref(0)
  const totalPlayTime = ref(0)
  const totalFoundItems = ref(0)
  const totalTriggeredMemories = ref(0)
  const totalCraftedItems = ref(0)
  const totalHiddenFound = ref(0)
  const bestTime = ref(null)
  const perfectClearCount = ref(0)
  const visitedScenes = ref({})
  const loginStreak = ref(0)
  const lastLoginDate = ref(null)
  const totalEndings = ref([])
  const unlockedAchievements = ref([])
  const unlockedDiaries = ref([])
  const completedGoals = ref([])
  const locationStats = ref({})
  const claimedReplayRewards = ref([])
  const claimedDailyRewards = ref([])

  let gameStore = null
  let archiveStore = null
  let collectionStore = null
  let challengeStore = null
  let saveStore = null

  function initDependencies() {
    gameStore = useGameStore()
    archiveStore = useArchiveStore()
    collectionStore = useCollectionStore()
    challengeStore = useChallengeStore()
    saveStore = useSaveStore()
  }

  function init() {
    try {
      const raw = localStorage.getItem(GROWTH_KEY)
      if (!raw) {
        initFreshState()
        return
      }
      const data = JSON.parse(raw)

      if (data.schemaVersion !== GROWTH_SCHEMA_VERSION) {
        migrateData(data)
        return
      }

      totalPlayCount.value = data.totalPlayCount || 0
      totalPlayTime.value = data.totalPlayTime || 0
      totalFoundItems.value = data.totalFoundItems || 0
      totalTriggeredMemories.value = data.totalTriggeredMemories || 0
      totalCraftedItems.value = data.totalCraftedItems || 0
      totalHiddenFound.value = data.totalHiddenFound || 0
      bestTime.value = data.bestTime || null
      perfectClearCount.value = data.perfectClearCount || 0
      visitedScenes.value = data.visitedScenes || {}
      loginStreak.value = data.loginStreak || 0
      lastLoginDate.value = data.lastLoginDate || null
      totalEndings.value = data.totalEndings || []
      unlockedAchievements.value = data.unlockedAchievements || []
      unlockedDiaries.value = data.unlockedDiaries || []
      completedGoals.value = data.completedGoals || []
      locationStats.value = data.locationStats || {}
      claimedReplayRewards.value = data.claimedReplayRewards || []
      claimedDailyRewards.value = data.claimedDailyRewards || []

      checkDailyLogin()
      checkAllAchievements()
      checkAllDiaries()
    } catch (e) {
      console.error('初始化成长系统失败:', e)
      initFreshState()
    }
  }

  function initFreshState() {
    totalPlayCount.value = 0
    totalPlayTime.value = 0
    totalFoundItems.value = 0
    totalTriggeredMemories.value = 0
    totalCraftedItems.value = 0
    totalHiddenFound.value = 0
    bestTime.value = null
    perfectClearCount.value = 0
    visitedScenes.value = {}
    loginStreak.value = 0
    lastLoginDate.value = null
    totalEndings.value = []
    unlockedAchievements.value = []
    unlockedDiaries.value = []
    completedGoals.value = []
    locationStats.value = {}
    claimedReplayRewards.value = []
    claimedDailyRewards.value = []
    persist()
  }

  function migrateData(oldData) {
    initFreshState()
    if (oldData.totalPlayCount) totalPlayCount.value = oldData.totalPlayCount
    if (oldData.bestTime) bestTime.value = oldData.bestTime
    persist()
  }

  function persist() {
    try {
      const data = {
        schemaVersion: GROWTH_SCHEMA_VERSION,
        totalPlayCount: totalPlayCount.value,
        totalPlayTime: totalPlayTime.value,
        totalFoundItems: totalFoundItems.value,
        totalTriggeredMemories: totalTriggeredMemories.value,
        totalCraftedItems: totalCraftedItems.value,
        totalHiddenFound: totalHiddenFound.value,
        bestTime: bestTime.value,
        perfectClearCount: perfectClearCount.value,
        visitedScenes: visitedScenes.value,
        loginStreak: loginStreak.value,
        lastLoginDate: lastLoginDate.value,
        totalEndings: totalEndings.value,
        unlockedAchievements: unlockedAchievements.value,
        unlockedDiaries: unlockedDiaries.value,
        completedGoals: completedGoals.value,
        locationStats: locationStats.value,
        claimedReplayRewards: claimedReplayRewards.value,
        claimedDailyRewards: claimedDailyRewards.value
      }
      localStorage.setItem(GROWTH_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存成长数据失败:', e)
    }
  }

  function getTodayStr() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  function checkDailyLogin() {
    const today = getTodayStr()
    if (lastLoginDate.value === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    if (lastLoginDate.value === yesterdayStr) {
      loginStreak.value += 1
    } else {
      loginStreak.value = 1
    }
    lastLoginDate.value = today

    const dayInCycle = ((loginStreak.value - 1) % 7) + 1
    const rewardKey = `${today}_day${dayInCycle}`
    if (!claimedDailyRewards.value.includes(rewardKey)) {
      claimedDailyRewards.value.push(rewardKey)
      const reward = DAILY_LOGIN_REWARDS.find(r => r.day === dayInCycle)
      if (reward) {
        if (reward.reward.coins && collectionStore) {
          collectionStore.addCoins(reward.reward.coins)
        }
        if (reward.reward.achievement) {
          unlockAchievement(reward.reward.achievement)
        }
      }
    }

    persist()
  }

  const achievementsList = computed(() => {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: unlockedAchievements.value.includes(a.id),
      progress: getAchievementProgress(a)
    }))
  })

  function getAchievementProgress(achievement) {
    const cond = achievement.condition
    switch (cond.type) {
      case 'play_count':
        return { current: Math.min(totalPlayCount.value, cond.value), total: cond.value }
      case 'total_memories':
        return { current: Math.min(totalTriggeredMemories.value, cond.value), total: cond.value }
      case 'best_time':
        return {
          current: bestTime.value ? Math.max(0, cond.value - bestTime.value) : 0,
          total: cond.value,
          inverted: true
        }
      case 'login_streak':
        return { current: Math.min(loginStreak.value, cond.value), total: cond.value }
      case 'ending_type':
        return { current: totalEndings.value.includes(cond.value) ? 1 : 0, total: 1 }
      case 'all_endings':
        const allTypes = ['good', 'bad', 'neutral', 'legendary']
        const got = totalEndings.value.filter(e => allTypes.includes(e)).length
        return { current: got, total: 4 }
      default:
        return { current: 0, total: 1 }
    }
  }

  const achievementCount = computed(() => unlockedAchievements.value.length)
  const totalAchievementCount = computed(() => ACHIEVEMENTS.length)
  const achievementProgressPercent = computed(() => {
    return totalAchievementCount.value > 0
      ? Math.round((achievementCount.value / totalAchievementCount.value) * 100)
      : 0
  })

  function checkAllAchievements() {
    for (const ach of ACHIEVEMENTS) {
      if (unlockedAchievements.value.includes(ach.id)) continue
      if (isAchievementConditionMet(ach)) {
        unlockAchievement(ach.id)
      }
    }
  }

  function isAchievementConditionMet(achievement) {
    const cond = achievement.condition
    switch (cond.type) {
      case 'play_count':
        return totalPlayCount.value >= cond.value
      case 'total_memories':
        return totalTriggeredMemories.value >= cond.value
      case 'best_time':
        return bestTime.value !== null && bestTime.value <= cond.value
      case 'perfect_clear':
        return perfectClearCount.value > 0
      case 'all_scenes':
        const totalScenes = 6
        const visited = Object.keys(visitedScenes.value).length
        return visited >= totalScenes
      case 'mood_ending':
        return archiveStore?.hasMoodEnding?.(cond.value) || false
      case 'all_letters':
        return collectionStore?.unlockedRelicCount >= 12 || false
      case 'all_relics_restored':
        return collectionStore?.restoredRelicCount >= 12 || false
      case 'login_streak':
        return loginStreak.value >= cond.value
      case 'ending_type':
        return totalEndings.value.includes(cond.value)
      case 'all_endings':
        const allTypes = ['good', 'bad', 'neutral', 'legendary']
        return allTypes.every(t => totalEndings.value.includes(t))
      default:
        return false
    }
  }

  function unlockAchievement(achId) {
    if (unlockedAchievements.value.includes(achId)) return
    unlockedAchievements.value.push(achId)
    newlyUnlockedAchievements.value.push(achId)
    const ach = ACHIEVEMENTS.find(a => a.id === achId)
    if (ach) {
      showAchievementUnlock.value = ach
    }
    persist()
  }

  const diariesList = computed(() => {
    return HIDDEN_DIARIES.map(d => ({
      ...d,
      unlocked: unlockedDiaries.value.includes(d.id)
    }))
  })

  const diaryCount = computed(() => unlockedDiaries.value.length)
  const totalDiaryCount = computed(() => HIDDEN_DIARIES.length)

  function checkAllDiaries() {
    for (const diary of HIDDEN_DIARIES) {
      if (unlockedDiaries.value.includes(diary.id)) continue
      if (isDiaryUnlocked(diary)) {
        unlockDiary(diary.id)
      }
    }
  }

  function isDiaryUnlocked(diary) {
    const cond = diary.unlockCondition
    switch (cond.type) {
      case 'first_play':
        return totalPlayCount.value >= 1
      case 'goal_complete':
        return completedGoals.value.includes(cond.goalId)
      case 'visit_location':
        const stats = locationStats.value[cond.locationId]
        return stats && stats.visitCount >= (cond.count || 1)
      case 'find_hidden_item':
        return archiveStore?.isHiddenItemEverFound?.(cond.itemId) || false
      case 'ending_type':
        return totalEndings.value.includes(cond.endingType)
      default:
        return false
    }
  }

  function unlockDiary(diaryId) {
    if (unlockedDiaries.value.includes(diaryId)) return
    unlockedDiaries.value.push(diaryId)
    newlyUnlockedDiaries.value.push(diaryId)
    const diary = HIDDEN_DIARIES.find(d => d.id === diaryId)
    if (diary) {
      showDiaryUnlock.value = diary
    }
    persist()
  }

  const goalsList = computed(() => {
    return CHAPTER_GOALS.map(g => ({
      ...g,
      completed: completedGoals.value.includes(g.id),
      progress: getGoalProgress(g)
    }))
  })

  function getGoalProgress(goal) {
    const stat = getSessionStat(goal.chapterId)
    const total = goal.target
    let current = 0

    switch (goal.type) {
      case 'find_items':
        current = stat.foundItems
        break
      case 'trigger_memories':
        current = stat.triggeredMemories
        break
      case 'visit_scenes':
        current = stat.visitedScenes
        break
      case 'craft_items':
        current = stat.craftedItems
        break
      case 'find_hidden':
        current = stat.foundHidden
        break
      case 'make_choices':
        current = stat.madeChoices
        break
    }

    return { current: Math.min(current, total), total }
  }

  function getSessionStat(chapterId) {
    const stats = {
      foundItems: totalFoundItems.value,
      triggeredMemories: totalTriggeredMemories.value,
      visitedScenes: Object.keys(visitedScenes.value).length,
      craftedItems: totalCraftedItems.value,
      foundHidden: totalHiddenFound.value,
      madeChoices: 0
    }
    return stats
  }

  function checkChapterGoals() {
    for (const goal of CHAPTER_GOALS) {
      if (completedGoals.value.includes(goal.id)) continue
      const progress = getGoalProgress(goal)
      if (progress.current >= progress.total) {
        completeGoal(goal.id)
      }
    }
  }

  function completeGoal(goalId) {
    if (completedGoals.value.includes(goalId)) return
    completedGoals.value.push(goalId)
    const goal = CHAPTER_GOALS.find(g => g.id === goalId)
    if (goal?.reward?.coins && collectionStore) {
      collectionStore.addCoins(goal.reward.coins)
    }
    if (goal?.reward?.diaryUnlock) {
      unlockDiary(goal.reward.diaryUnlock)
    }
    if (goal?.reward?.achievement) {
      unlockAchievement(goal.reward.achievement)
    }
    persist()
  }

  function recordGameEnd(gameResult) {
    totalPlayCount.value += 1
    totalPlayTime.value += gameResult.timeUsed || 0

    totalFoundItems.value += gameResult.foundCount || 0
    totalTriggeredMemories.value += gameResult.memoryCount || 0
    totalCraftedItems.value += gameResult.craftedCount || 0
    totalHiddenFound.value += gameResult.hiddenCount || 0

    if (gameResult.timeUsed) {
      if (bestTime.value === null || gameResult.timeUsed < bestTime.value) {
        bestTime.value = gameResult.timeUsed
      }
    }

    if (gameResult.isPerfect) {
      perfectClearCount.value += 1
    }

    if (gameResult.visitedScenes) {
      for (const sceneId of gameResult.visitedScenes) {
        if (!visitedScenes.value[sceneId]) {
          visitedScenes.value[sceneId] = 0
        }
        visitedScenes.value[sceneId] += 1
      }
    }

    if (gameResult.endingType && !totalEndings.value.includes(gameResult.endingType)) {
      totalEndings.value.push(gameResult.endingType)
    }

    if (gameResult.locationStats) {
      for (const [locId, stat] of Object.entries(gameResult.locationStats)) {
        if (!locationStats.value[locId]) {
          locationStats.value[locId] = {
            visitCount: 0,
            bestScore: 0,
            bestTime: null,
            totalItemsFound: 0
          }
        }
        const loc = locationStats.value[locId]
        loc.visitCount += 1
        if (stat.score > loc.bestScore) {
          loc.bestScore = stat.score
        }
        if (stat.time && (loc.bestTime === null || stat.time < loc.bestTime)) {
          loc.bestTime = stat.time
        }
        loc.totalItemsFound += stat.foundCount || 0
      }
    }

    checkAllAchievements()
    checkAllDiaries()
    checkChapterGoals()
    checkReplayRewards()

    persist()

    return {
      newAchievements: newlyUnlockedAchievements.value.slice(),
      newDiaries: newlyUnlockedDiaries.value.slice()
    }
  }

  function checkReplayRewards() {
    for (const reward of REPLAY_REWARDS) {
      if (totalPlayCount.value >= reward.playCount && !claimedReplayRewards.value.includes(reward.playCount)) {
        claimReplayReward(reward.playCount)
      }
    }
  }

  function claimReplayReward(playCount) {
    if (claimedReplayRewards.value.includes(playCount)) return
    const rewardData = REPLAY_REWARDS.find(r => r.playCount === playCount)
    if (!rewardData) return

    claimedReplayRewards.value.push(playCount)

    if (rewardData.reward.coins && collectionStore) {
      collectionStore.addCoins(rewardData.reward.coins)
    }
    if (rewardData.reward.material && rewardData.reward.count && collectionStore) {
      collectionStore.addMaterial(rewardData.reward.material, rewardData.reward.count)
    }
    if (rewardData.reward.achievement) {
      unlockAchievement(rewardData.reward.achievement)
    }

    showReplayReward.value = rewardData
    persist()
  }

  function calculateLocationScore(locationId, foundCount, memoryCount, hiddenCount, timeUsed) {
    const rules = LOCATION_RATING_RULES
    let score = 0

    score += foundCount * rules.scorePerItem
    score += memoryCount * rules.scorePerMemory
    score += hiddenCount * rules.scorePerHidden

    if (timeUsed && timeUsed <= rules.timeBonus.excellent.threshold) {
      score = Math.floor(score * rules.timeBonus.excellent.multiplier)
    }

    score = Math.min(100, Math.floor(score))

    const grade = rules.grades.reduce((acc, g) => {
      return score >= g.min ? g : acc
    }, rules.grades[0])

    return { score, grade }
  }

  function getLocationRating(locationId) {
    const stats = locationStats.value[locationId]
    if (!stats) return null

    const rules = LOCATION_RATING_RULES
    const grade = rules.grades.reduce((acc, g) => {
      return stats.bestScore >= g.min ? g : acc
    }, rules.grades[0])

    return {
      ...stats,
      grade,
      rules
    }
  }

  function openGrowthCenter() {
    showGrowthCenter.value = true
  }

  function closeGrowthCenter() {
    showGrowthCenter.value = false
  }

  function dismissAchievementUnlock() {
    showAchievementUnlock.value = null
  }

  function dismissDiaryUnlock() {
    showDiaryUnlock.value = null
  }

  function dismissReplayReward() {
    showReplayReward.value = null
  }

  function clearNewBadges() {
    newlyUnlockedAchievements.value = []
    newlyUnlockedDiaries.value = []
  }

  return {
    showGrowthCenter,
    showAchievementUnlock,
    showDiaryUnlock,
    showReplayReward,
    newlyUnlockedAchievements,
    newlyUnlockedDiaries,
    totalPlayCount,
    totalPlayTime,
    totalFoundItems,
    totalTriggeredMemories,
    totalCraftedItems,
    totalHiddenFound,
    bestTime,
    perfectClearCount,
    visitedScenes,
    loginStreak,
    lastLoginDate,
    totalEndings,
    unlockedAchievements,
    unlockedDiaries,
    completedGoals,
    locationStats,
    claimedReplayRewards,
    achievementsList,
    diariesList,
    goalsList,
    achievementCount,
    totalAchievementCount,
    achievementProgressPercent,
    diaryCount,
    totalDiaryCount,
    initDependencies,
    init,
    persist,
    recordGameEnd,
    unlockAchievement,
    unlockDiary,
    completeGoal,
    checkAllAchievements,
    checkAllDiaries,
    checkChapterGoals,
    checkReplayRewards,
    calculateLocationScore,
    getLocationRating,
    openGrowthCenter,
    closeGrowthCenter,
    dismissAchievementUnlock,
    dismissDiaryUnlock,
    dismissReplayReward,
    clearNewBadges
  }
})
