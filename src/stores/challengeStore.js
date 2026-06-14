import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CHALLENGE_KEY = 'foggy_city_challenge'
const LEADERBOARD_KEY = 'foggy_city_leaderboard'
const BADGE_KEY = 'foggy_city_badges'

export const CHALLENGE_BADGES = {
  first_anniversary: {
    id: 'first_anniversary',
    name: '初心者',
    description: '完成首次纪念日挑战',
    icon: '🎯',
    rarity: 'common'
  },
  daily_conqueror: {
    id: 'daily_conqueror',
    name: '每日征服者',
    description: '连续7天完成纪念日挑战',
    icon: '🏆',
    rarity: 'rare'
  },
  perfect_score: {
    id: 'perfect_score',
    name: '完美回忆',
    description: '在挑战模式中找回全部物品',
    icon: '💎',
    rarity: 'epic'
  },
  speedrunner: {
    id: 'speedrunner',
    name: '极速寻物',
    description: '在挑战模式中3分钟内完成游戏',
    icon: '⚡',
    rarity: 'rare'
  },
  memory_master: {
    id: 'memory_master',
    name: '记忆大师',
    description: '在挑战模式中触发全部隐藏回忆',
    icon: '📚',
    rarity: 'epic'
  },
  badge_collector: {
    id: 'badge_collector',
    name: '徽章收藏家',
    description: '收集5枚挑战徽章',
    icon: '🎖️',
    rarity: 'legendary'
  },
  top_ranked: {
    id: 'top_ranked',
    name: '排行榜冠军',
    description: '登上排行榜第一名',
    icon: '👑',
    rarity: 'legendary'
  },
  all_scenes: {
    id: 'all_scenes',
    name: '雾城漫游者',
    description: '在一次挑战中踏足所有场景',
    icon: '🗺️',
    rarity: 'rare'
  },
  mood_hopeful: {
    id: 'mood_hopeful',
    name: '心怀希冀',
    description: '挑战模式结束时心绪达到"希冀"',
    icon: '✨',
    rarity: 'common'
  },
  hidden_hunter: {
    id: 'hidden_hunter',
    name: '隐藏猎手',
    description: '在挑战模式中找到全部隐藏物品',
    icon: '🔍',
    rarity: 'epic'
  }
}

export const useChallengeStore = defineStore('challenge', () => {
  const isChallengeMode = ref(false)
  const currentDailySeed = ref(null)
  const todayDate = ref(null)
  const visitedScenes = ref(new Set())
  const challengeStartTime = ref(null)
  const leaderboard = ref([])
  const unlockedBadges = ref([])
  const challengeStreak = ref(0)
  const lastChallengeDate = ref(null)
  const showLeaderboardModal = ref(false)
  const showBadgeModal = ref(false)
  const newlyUnlockedBadge = ref(null)

  function getTodayDateString() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  function generateDailySeed(dateStr) {
    let hash = 0
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  function seededRandom(seed) {
    let s = seed
    return function() {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  }

  function init() {
    try {
      const challengeData = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}')
      const lbData = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]')
      const badgeData = JSON.parse(localStorage.getItem(BADGE_KEY) || '[]')
      
      leaderboard.value = lbData
      unlockedBadges.value = badgeData
      challengeStreak.value = challengeData.streak || 0
      lastChallengeDate.value = challengeData.lastDate || null
      
      todayDate.value = getTodayDateString()
      currentDailySeed.value = generateDailySeed(todayDate.value)
    } catch (e) {
      console.error('初始化挑战模式失败:', e)
    }
  }

  function persistChallengeData() {
    try {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify({
        streak: challengeStreak.value,
        lastDate: lastChallengeDate.value
      }))
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard.value))
      localStorage.setItem(BADGE_KEY, JSON.stringify(unlockedBadges.value))
    } catch (e) {
      console.error('保存挑战数据失败:', e)
    }
  }

  function startChallengeMode() {
    isChallengeMode.value = true
    todayDate.value = getTodayDateString()
    currentDailySeed.value = generateDailySeed(todayDate.value)
    visitedScenes.value = new Set()
    challengeStartTime.value = Date.now()
  }

  function exitChallengeMode() {
    isChallengeMode.value = false
    visitedScenes.value = new Set()
    challengeStartTime.value = null
  }

  function recordSceneVisit(sceneId) {
    if (isChallengeMode.value) {
      visitedScenes.value.add(sceneId)
    }
  }

  function getRandomizedPositions(basePositions, seedModifier = 0) {
    const random = seededRandom(currentDailySeed.value + seedModifier)
    const positions = [...basePositions]
    
    const shuffleCount = Math.max(1, Math.floor(positions.length * 0.4))
    for (let i = 0; i < shuffleCount; i++) {
      const idx1 = Math.floor(random() * positions.length)
      let idx2 = Math.floor(random() * positions.length)
      while (idx2 === idx1) {
        idx2 = Math.floor(random() * positions.length)
      }
      
      const tempX = positions[idx1].x
      const tempY = positions[idx1].y
      positions[idx1].x = positions[idx2].x
      positions[idx1].y = positions[idx2].y
      positions[idx2].x = tempX
      positions[idx2].y = tempY
    }
    
    for (let i = 0; i < positions.length; i++) {
      if (random() < 0.3) {
        positions[i].x = Math.max(5, Math.min(90, positions[i].x + (random() - 0.5) * 10))
        positions[i].y = Math.max(15, Math.min(85, positions[i].y + (random() - 0.5) * 10))
      }
    }
    
    return positions
  }

  const CHALLENGE_HINT_VARIANTS = {
    ticket: [
      '那张承载着离别之约的纸片...',
      '站台上被遗忘的车票，日期是五年前...',
      '它会带你回到那个告别的清晨。',
      '泛黄的纸片，记载着远去的约定。'
    ],
    scarf: [
      '蓝色的温暖，曾围在谁的颈间？',
      '被遗落在候车椅上的冬日记忆。',
      '薰衣草香还萦绕在这条织物上。',
      '那是她最喜欢的颜色。'
    ],
    watch: [
      '指针停在了那个重要的时刻。',
      '时间凝固在火车开动的瞬间。',
      '一块旧怀表，藏着谁的等待？',
      '8点23分，从此成为永恒。'
    ],
    photo: [
      '被雨水打湿的笑脸，依然灿烂。',
      '老街上的合照，边缘已经泛黄。',
      '那一天，你们笑得那么开心。',
      '照片背面还写着日期吗？'
    ],
    icecream: [
      '甜甜的夏日回忆，融化在阳光里。',
      '老字号冰淇淋店的纪念物。',
      '你们曾分享过同一个甜筒。',
      '夏日里最清凉的甜蜜。'
    ],
    letter: [
      '写满思念，却始终没有寄出。',
      '深夜里的灯下之作，字字情深。',
      '有些话，总是难以说出口。',
      '信封上的地址，还是空的。'
    ],
    cup: [
      '杯口还留着淡淡的口红印。',
      '她最爱喝的拿铁，余温尚存。',
      '靠窗位置的专属咖啡杯。',
      '似乎还能闻到咖啡的香气。'
    ],
    ring: [
      '年少时的玩笑话，她却记住了。',
      '易拉罐拉环做的"戒指"。',
      '"等以后，我换个真的给你。"',
      '那句承诺，你还记得吗？'
    ],
    notebook: [
      '她落下的心事簿，写满了谁？',
      '日记本里夹着干枯的花瓣。',
      '每一页都是关于你的心事。',
      '"今天又遇到他了..."'
    ],
    flower: [
      '第一次约会时你送她的花。',
      '被压平的薰衣草，香气犹存。',
      '紫色的回忆，在书页间沉睡。',
      '那是你们第一次约会的纪念。'
    ],
    balloon: [
      '生日那天放飞的气球，绳子还在。',
      '气球飞向天空，愿望留在心里。',
      '彩色的梦，拴在这根绳子上。',
      '"生日快乐！"的欢呼声还在耳边。'
    ],
    carving: [
      '老树身上的两颗心，历经风雨。',
      '"❤" 刻在树皮上，也刻在心里。',
      '年轮增长，爱意不变。',
      '老公园的秘密记号。'
    ],
    book: [
      '"如果你爱上了某个星球的一朵花..."',
      '她最爱的故事，扉页写着你的名字。',
      '夹着枫叶书签的那一页。',
      '"所有的大人都曾经是小孩..."'
    ],
    bookmark: [
      '那年秋天一起捡的枫叶。',
      '红色的枫叶，记录着秋天的故事。',
      '她总把它夹在最爱的那一页。',
      '叶脉里藏着秋天的秘密。'
    ],
    glasses: [
      '她看书时戴的眼镜，镜片起雾了。',
      '透过这副镜片，她看到了什么？',
      '眼镜盒上还绣着她的名字。',
      '读书时专注的侧脸，你还记得吗？'
    ],
    bottle: [
      '扔进湖里的瓶子，又漂回来了。',
      '里面的纸条，写的是什么愿望？',
      '不知它在水中漂了多久。',
      '"五年后，我们再见..."'
    ],
    necklace: [
      '海边捡的贝壳，串成了项链。',
      '她说要永远戴着这条项链。',
      '每片贝壳都有海的声音。',
      '那年夏天的海边，风很温柔。'
    ],
    promise: [
      '你说它代表永恒的那颗小石子。',
      '静静地躺在湖边，等了五年。',
      '鹅卵石上刻着小小的字。',
      '"执子之手，与子偕老。"'
    ]
  }

  function getChallengeHint(itemId) {
    if (!isChallengeMode.value) return null
    
    const variants = CHALLENGE_HINT_VARIANTS[itemId]
    if (!variants || variants.length === 0) return null
    
    const random = seededRandom(currentDailySeed.value + itemId.length)
    const idx = Math.floor(random() * variants.length)
    return variants[idx]
  }

  function submitToLeaderboard(result) {
    const entry = {
      id: `lb_${Date.now()}`,
      date: todayDate.value,
      score: result.score,
      foundCount: result.foundCount,
      totalItems: result.totalItems,
      timeUsed: result.timeUsed,
      craftedCount: result.craftedCount,
      endingType: result.endingType,
      moodValue: result.moodValue,
      isChallengeMode: true,
      timestamp: Date.now()
    }
    
    leaderboard.value.push(entry)
    leaderboard.value.sort((a, b) => b.score - a.score)
    leaderboard.value = leaderboard.value.slice(0, 50)
    
    persistChallengeData()
    
    const rank = leaderboard.value.findIndex(e => e.id === entry.id) + 1
    return { rank, total: leaderboard.value.length }
  }

  function checkAndUnlockBadges(result) {
    const newBadges = []
    
    function addBadge(badgeId) {
      if (!unlockedBadges.value.includes(badgeId)) {
        unlockedBadges.value.push(badgeId)
        newBadges.push(badgeId)
        newlyUnlockedBadge.value = CHALLENGE_BADGES[badgeId]
      }
    }

    addBadge('first_anniversary')

    if (challengeStreak.value >= 7) {
      addBadge('daily_conqueror')
    }

    if (result.foundCount >= result.totalItems) {
      addBadge('perfect_score')
    }

    if (result.timeUsed <= 180) {
      addBadge('speedrunner')
    }

    if (result.unlockedHMCount >= result.totalHMCount && result.totalHMCount > 0) {
      addBadge('memory_master')
    }

    if (unlockedBadges.value.length >= 5) {
      addBadge('badge_collector')
    }

    if (visitedScenes.value.size >= 6) {
      addBadge('all_scenes')
    }

    if (result.moodValue >= 80) {
      addBadge('mood_hopeful')
    }

    if (result.foundHiddenItemsCount >= result.totalHiddenItemsCount && result.totalHiddenItemsCount > 0) {
      addBadge('hidden_hunter')
    }

    const rank = result.rank || 999
    if (rank === 1) {
      addBadge('top_ranked')
    }

    if (newBadges.length > 0) {
      persistChallengeData()
    }

    return newBadges
  }

  function updateStreak() {
    const today = getTodayDateString()
    if (lastChallengeDate.value === today) return
    
    if (lastChallengeDate.value) {
      const last = new Date(lastChallengeDate.value)
      const now = new Date(today)
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        challengeStreak.value++
      } else if (diffDays > 1) {
        challengeStreak.value = 1
      }
    } else {
      challengeStreak.value = 1
    }
    
    lastChallengeDate.value = today
    persistChallengeData()
  }

  function calculateChallengeScore(result) {
    const itemScore = result.foundCount / result.totalItems * 400
    const timeBonus = Math.max(0, (300 - result.timeUsed) / 300 * 200)
    const craftScore = result.craftedCount / Math.max(1, result.totalCraftable) * 150
    const memoryScore = result.unlockedHMCount / Math.max(1, result.totalHMCount) * 150
    const hiddenScore = result.foundHiddenItemsCount / Math.max(1, result.totalHiddenItemsCount) * 100
    
    const endingBonus = {
      legendary: 500,
      epic: 300,
      special: 200,
      perfect: 250,
      good: 100,
      normal: 50,
      bad: 0,
      despair: -50
    }
    
    const endingScore = endingBonus[result.endingType] || 0
    const moodBonus = result.moodValue
    
    return Math.round(itemScore + timeBonus + craftScore + memoryScore + hiddenScore + endingScore + moodBonus)
  }

  function getRankBadge(rank) {
    if (rank === 1) return { icon: '🥇', color: '#FFD700', label: '第一名' }
    if (rank === 2) return { icon: '🥈', color: '#C0C0C0', label: '第二名' }
    if (rank === 3) return { icon: '🥉', color: '#CD7F32', label: '第三名' }
    if (rank <= 10) return { icon: '⭐', color: '#818CF8', label: '前十名' }
    if (rank <= 25) return { icon: '✨', color: '#60A5FA', label: '前25名' }
    return { icon: '📊', color: '#9CA3AF', label: '参与奖' }
  }

  function openLeaderboard() {
    showLeaderboardModal.value = true
  }

  function closeLeaderboard() {
    showLeaderboardModal.value = false
  }

  function openBadges() {
    showBadgeModal.value = true
  }

  function closeBadges() {
    showBadgeModal.value = false
    newlyUnlockedBadge.value = null
  }

  const topLeaderboard = computed(() => {
    return [...leaderboard.value].sort((a, b) => b.score - a.score).slice(0, 10)
  })

  const todayLeaderboard = computed(() => {
    const today = getTodayDateString()
    return leaderboard.value
      .filter(e => e.date === today)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  })

  const badgesList = computed(() => {
    return Object.values(CHALLENGE_BADGES).map(badge => ({
      ...badge,
      unlocked: unlockedBadges.value.includes(badge.id)
    }))
  })

  const unlockedBadgesCount = computed(() => unlockedBadges.value.length)
  const totalBadgesCount = computed(() => Object.keys(CHALLENGE_BADGES).length)

  init()

  return {
    isChallengeMode,
    currentDailySeed,
    todayDate,
    visitedScenes,
    challengeStartTime,
    leaderboard,
    unlockedBadges,
    challengeStreak,
    lastChallengeDate,
    showLeaderboardModal,
    showBadgeModal,
    newlyUnlockedBadge,
    topLeaderboard,
    todayLeaderboard,
    badgesList,
    unlockedBadgesCount,
    totalBadgesCount,
    init,
    startChallengeMode,
    exitChallengeMode,
    recordSceneVisit,
    getRandomizedPositions,
    getChallengeHint,
    submitToLeaderboard,
    checkAndUnlockBadges,
    updateStreak,
    calculateChallengeScore,
    getRankBadge,
    openLeaderboard,
    closeLeaderboard,
    openBadges,
    closeBadges,
    seededRandom,
    getTodayDateString,
    generateDailySeed
  }
})
