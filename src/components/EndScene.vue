<template>
  <div class="end-scene" :class="endingType" :style="{ background: endingSceneBg }">
    <div class="particles-container" v-if="endingData?.scene?.particles">
      <div
        v-for="i in particleCount"
        :key="i"
        class="particle"
        :class="endingData.scene.particles"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <div class="fog-layer" :class="{ active: showIntro }"></div>
    <div class="effect-layer" :class="activeEffects"></div>

    <div class="end-content" :class="{ 'intro-mode': showIntro }">
      <Transition name="reunion" appear>
        <div v-if="!showIntro" key="stats">
          <div class="ending-badge-wrap">
            <div class="ending-icon" :class="{ special: endingData?.isSpecial, legendary: endingType === 'legendary' }">{{ endingEmoji }}</div>
            <div class="ending-type-badge" v-if="endingData?.isSpecial || endingData?.subtitle">
              <span class="badge-star">✦</span>
              {{ endingData?.subtitle || specialEndingText }}
              <span class="badge-star">✦</span>
            </div>
          </div>

          <h1 class="ending-title text-shadow" :class="endingType">
            {{ endingData?.title }}
          </h1>

          <div class="ending-divider"></div>

          <div class="ending-description-wrap">
            <p class="ending-description text-shadow" v-for="(para, idx) in descriptionParagraphs" :key="idx">
              {{ para }}
            </p>
          </div>

          <div class="reunion-dimensions">
            <h3 class="dimensions-title">
              <span class="dim-icon">📊</span>
              重逢维度解析
            </h3>
            <div class="dimensions-grid">
              <div class="dimension-card" :class="findEfficiencyClass">
                <div class="dim-icon-wrap">
                  <span class="dim-icon-lg">⏱️</span>
                </div>
                <div class="dim-info">
                  <span class="dim-label">找物效率</span>
                  <span class="dim-value">{{ getEfficiencyLabel(findEfficiencyLevel) }}</span>
                </div>
                <div class="dim-bar">
                  <div class="dim-bar-fill" :style="{ width: findEfficiencyPercent + '%' }"></div>
                </div>
              </div>
              <div class="dimension-card" :class="memoryClass">
                <div class="dim-icon-wrap">
                  <span class="dim-icon-lg">💭</span>
                </div>
                <div class="dim-info">
                  <span class="dim-label">回忆完整度</span>
                  <span class="dim-value">{{ getEfficiencyLabel(memoryCompletenessLevel) }}</span>
                </div>
                <div class="dim-bar">
                  <div class="dim-bar-fill" :style="{ width: memoryCompletenessPercent + '%' }"></div>
                </div>
              </div>
              <div class="dimension-card" :class="choiceClass">
                <div class="dim-icon-wrap">
                  <span class="dim-icon-lg">🌿</span>
                </div>
                <div class="dim-info">
                  <span class="dim-label">关键抉择</span>
                  <span class="dim-value">{{ madeChoicesCount }}/{{ totalChoicesCount }}</span>
                </div>
                <div class="dim-bar">
                  <div class="dim-bar-fill" :style="{ width: choicePercent + '%' }"></div>
                </div>
              </div>
              <div class="dimension-card" :class="hiddenItemClass">
                <div class="dim-icon-wrap">
                  <span class="dim-icon-lg">🔮</span>
                </div>
                <div class="dim-info">
                  <span class="dim-label">隐藏收集</span>
                  <span class="dim-value">{{ hiddenItemsCount }}/{{ totalHiddenItemsCount }}</span>
                </div>
                <div class="dim-bar">
                  <div class="dim-bar-fill" :style="{ width: hiddenItemPercent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="dominantWeights.length > 0" class="personality-tags">
            <span class="pt-title">你的心路标签：</span>
            <span
              v-for="(entry, idx) in dominantWeights"
              :key="idx"
              class="pt-tag"
            >
              {{ getWeightLabel(entry[0]) }}
            </span>
          </div>

          <div class="game-stats">
            <div class="stat-row chapter-stat-row">
              <span class="stat-icon">📖</span>
              <span class="stat-label">抵达章节</span>
              <span class="stat-value chapter-stat-end">
                <span class="chapter-end-icon">{{ chapterIcon }}</span>
                {{ currentChapterName }}
              </span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">💎</span>
              <span class="stat-label">找到物品</span>
              <span class="stat-value">{{ foundCount }}/{{ totalItems }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">✨</span>
              <span class="stat-label">合成道具</span>
              <span class="stat-value craft-stat">{{ craftedCount }}/{{ totalCraftable }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">💭</span>
              <span class="stat-label">回忆碎片</span>
              <span class="stat-value">{{ triggeredMemories }}/{{ totalItems }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">🌟</span>
              <span class="stat-label">隐藏回忆</span>
              <span class="stat-value hm-stat">{{ unlockedHM }}/{{ totalHM }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">🔮</span>
              <span class="stat-label">隐藏道具</span>
              <span class="stat-value hi-stat">{{ hiddenItemsCount }}/{{ totalHiddenItemsCount }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-icon">⏱️</span>
              <span class="stat-label">用时</span>
              <span class="stat-value">{{ formattedTimeUsed }}</span>
            </div>
            <div class="stat-row mood-stat-row">
              <span class="stat-icon">💭</span>
              <span class="stat-label">最终心绪</span>
              <span class="stat-value" :style="{ color: getMoodColor(finalMoodValue) }">
                {{ getMoodStateName(finalMoodValue) }} ({{ finalMoodValue }})
              </span>
            </div>
            <div class="stat-row time-stat-row">
              <span class="stat-icon">⏰</span>
              <span class="stat-label">游戏内时间</span>
              <span class="stat-value">
                {{ getFinalGameTime() }}
              </span>
            </div>
            <div class="stat-row total-progress-row">
              <span class="stat-icon">📊</span>
              <span class="stat-label">综合完成度</span>
              <span class="stat-value total-stat">{{ completionRate }}%</span>
            </div>
          </div>

          <div class="crafted-section" v-if="totalCraftable > 0">
            <h3 class="section-title">
              <span class="section-icon">💎</span>
              合成收集
            </h3>
            <div class="crafted-grid">
              <div
                v-for="crafted in allCraftedItems"
                :key="crafted.id"
                class="crafted-end-card"
                :class="{ unlocked: isCraftedVisible(crafted.id), [`end-rarity-${crafted.rarity}`]: true }"
              >
                <span class="crafted-end-icon">
                  {{ isCraftedVisible(crafted.id) ? crafted.icon : '🔒' }}
                </span>
                <span class="crafted-end-name">
                  {{ isCraftedVisible(crafted.id) ? crafted.name : '???' }}
                </span>
                <span v-if="isCraftedVisible(crafted.id)" class="crafted-end-rarity" :class="`end-rarity-${crafted.rarity}`">
                  {{ getRarityLabel(crafted.rarity) }}
                </span>
                <span v-if="isCraftedVisible(crafted.id) && !isCraftedCurrent(crafted.id) && isCraftedEver(crafted.id)" class="crafted-ever-tag">
                  历史周目
                </span>
              </div>
            </div>
          </div>

          <div class="hidden-items-section" v-if="totalHiddenItemsCount > 0">
            <h3 class="section-title">
              <span class="section-icon">🔮</span>
              隐藏发现
            </h3>
            <div class="hidden-items-grid">
              <div
                v-for="hi in allHiddenItemsList"
                :key="hi.id"
                class="hidden-item-end-card"
                :class="{ unlocked: isHiddenItemVisible(hi.id), [`end-rarity-${hi.rarity}`]: true }"
              >
                <span class="hi-end-icon">
                  {{ isHiddenItemVisible(hi.id) ? hi.icon : '🔒' }}
                </span>
                <span class="hi-end-name">
                  {{ isHiddenItemVisible(hi.id) ? hi.name : '???' }}
                </span>
              </div>
            </div>
          </div>

          <div class="collected-memories">
            <h3 class="memories-title">收集的回忆</h3>

            <div class="memories-section" v-if="totalHM > 0">
              <h4 class="subsection-title">🌟 隐藏回忆</h4>
              <div class="memories-grid hidden-grid">
                <div
                  v-for="memory in allHiddenMemories"
                  :key="memory.id"
                  class="memory-card hidden-card"
                  :class="{ unlocked: isHMVisible(memory.id) }"
                >
                  <span class="memory-card-icon">
                    {{ isHMVisible(memory.id) ? getEmojiForEmotion(memory.emotion) : '🔒' }}
                  </span>
                  <span class="memory-card-title">
                    {{ isHMVisible(memory.id) ? memory.title : '???' }}
                  </span>
                  <span v-if="isHMVisible(memory.id) && !isHMCurrent(memory.id) && isHMEver(memory.id)" class="memory-ever-tag">
                    历史
                  </span>
                </div>
              </div>
            </div>

            <div class="memories-section">
              <h4 class="subsection-title">💭 普通回忆</h4>
              <div class="memories-grid">
                <div
                  v-for="memory in allMemories"
                  :key="memory.id"
                  class="memory-card"
                  :class="{ unlocked: isMemoryVisible(memory.id) }"
                >
                  <span class="memory-card-icon">
                    {{ isMemoryVisible(memory.id) ? getEmojiForEmotion(memory.emotion) : '🔒' }}
                  </span>
                  <span class="memory-card-title">
                    {{ isMemoryVisible(memory.id) ? memory.title : '???' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="challenge-result-section" v-if="isChallengeMode">
            <div class="challenge-header">
              <span class="challenge-icon-big">🎯</span>
              <div class="challenge-title-wrap">
                <h3 class="challenge-title">纪念日挑战完成！</h3>
                <p class="challenge-date">{{ challengeDate }}</p>
              </div>
            </div>

            <div class="challenge-score-card" :class="getRankClass(challengeRank)">
              <div class="score-main">
                <span class="score-label">挑战得分</span>
                <span class="score-value">{{ challengeScore }}</span>
                <span v-if="challengeRank" class="score-rank-badge">
                  <span class="rank-icon">{{ getRankInfo(challengeRank).icon }}</span>
                  <span class="rank-text">第 {{ challengeRank }} 名</span>
                </span>
              </div>
              <div class="score-breakdown">
                <div class="score-item">
                  <span class="si-icon">💎</span>
                  <span class="si-label">找物</span>
                  <span class="si-value">{{ foundCount }}/{{ totalItems }}</span>
                </div>
                <div class="score-item">
                  <span class="si-icon">⏱️</span>
                  <span class="si-label">用时</span>
                  <span class="si-value">{{ formattedTimeUsed }}</span>
                </div>
                <div class="score-item">
                  <span class="si-icon">✨</span>
                  <span class="si-label">合成</span>
                  <span class="si-value">{{ craftedCount }}/{{ totalCraftable }}</span>
                </div>
                <div class="score-item">
                  <span class="si-icon">💭</span>
                  <span class="si-label">心绪</span>
                  <span class="si-value" :style="{ color: getMoodColor(finalMoodValue) }">{{ finalMoodValue }}</span>
                </div>
              </div>
            </div>

            <div class="newly-unlocked-badges" v-if="newlyUnlockedBadges.length > 0">
              <h4 class="nub-title">
                <span class="nub-icon">🎉</span>
                获得新徽章！
              </h4>
              <div class="nub-grid">
                <div
                  v-for="badge in newlyUnlockedBadges"
                  :key="badge.id"
                  class="nub-card"
                  :class="`nub-rarity-${badge.rarity}`"
                >
                  <span class="nub-card-icon">{{ badge.icon }}</span>
                  <span class="nub-card-name">{{ badge.name }}</span>
                  <span class="nub-card-desc">{{ badge.description }}</span>
                </div>
              </div>
            </div>

            <div class="challenge-streak-info" v-if="challengeStreak > 0">
              <span class="streak-icon">🔥</span>
              <span class="streak-text">已连续挑战 <strong>{{ challengeStreak }}</strong> 天！</span>
            </div>

            <div class="challenge-quick-buttons">
              <button class="btn btn-outline half-btn" @click="openLeaderboardFromEnd">
                🏆 查看排行榜
              </button>
              <button class="btn btn-outline half-btn" @click="openBadgesFromEnd">
                🎖️ 所有徽章 ({{ unlockedBadgesCount }}/{{ totalBadgesCount }})
              </button>
            </div>
          </div>

          <div class="archive-hint" v-if="archiveEndings > 0">
            <span class="hint-icon">📖</span>
            跨周目已解锁 {{ archiveEndings }} 个结局、{{ archiveHM }} 个隐藏回忆
            <button class="hint-btn" @click="openArchive">查看档案</button>
          </div>

          <div class="journal-hint">
            <span class="hint-icon">📔</span>
            整理你的回忆图鉴
            <button class="hint-btn journal-hint-btn" @click="openJournalEditor">✨ 手账编辑器</button>
            <button class="hint-btn" @click="openJournal">查看手账</button>
          </div>

          <div class="theater-hint" v-if="hasTheaterContent">
            <span class="hint-icon">🎬</span>
            回放你的记忆剧场
            <button class="hint-btn theater-hint-btn" @click="openMemoryTheater">🎭 记忆剧场</button>
          </div>

          <div class="collection-hint">
            <span class="hint-icon">🏛️</span>
            修复旧物·考证来源·补完故事
            <button class="hint-btn collection-hint-btn" @click="openCollectionRoom">
              <span class="cr-hint-progress">
                {{ collectionProgress }}%
              </span>
              雾城收藏室
            </button>
          </div>

          <div class="branch-continue" v-if="hasBranches">
            <h4 class="branch-title">🌿 从分支存档继续</h4>
            <div class="branch-list">
              <div v-for="branch in recentBranches" :key="branch.id" class="branch-item" @click="loadBranch(branch.id)">
                <span class="branch-item-icon">🌿</span>
                <span class="branch-item-label">{{ branch.label }}</span>
                <span class="branch-item-action">继续 →</span>
              </div>
            </div>
          </div>

          <div class="end-buttons">
            <button class="btn btn-primary" @click="playAgain">
              再玩一次
            </button>
            <button class="btn btn-outline" @click="returnHome">
              返回主页
            </button>
          </div>

          <div class="credits">
            感谢游玩《雾城重逢》
          </div>
        </div>

        <div v-else key="intro" class="intro-scene">
          <div class="intro-stage">
            <div class="intro-emoji big" :class="endingEmoji">{{ endingEmoji }}</div>
            <h1 class="intro-title" :class="endingType">
              {{ endingData?.title }}
            </h1>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'
import { useArchiveStore } from '../stores/archiveStore'
import { useTimeStore, GAME_START_HOUR, GAME_TOTAL_HOURS } from '../stores/timeStore'
import { useChallengeStore, CHALLENGE_BADGES } from '../stores/challengeStore'
import { useCollectionStore } from '../stores/collectionStore'
import { useGrowthStore } from '../stores/growthStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()
const archiveStore = useArchiveStore()
const timeStore = useTimeStore()
const challengeStore = useChallengeStore()
const collectionStore = useCollectionStore()
const growthStore = useGrowthStore()

const showIntro = ref(true)

onMounted(() => {
  const introDuration = gameStore.endingData?.isSpecial ? 3500 : 2500
  setTimeout(() => {
    showIntro.value = false
  }, introDuration)
  
  recordGameToGrowth()
})

const timeUsed = ref(300 - gameStore.timeRemaining)
const foundCount = computed(() => gameStore.foundCount)
const totalItems = computed(() => gameStore.totalItems)
const triggeredMemories = computed(() => gameStore.triggeredMemories.length)
const craftedCount = computed(() => gameStore.craftedCount)
const totalCraftable = computed(() => gameStore.totalCraftable)
const craftedItems = computed(() => gameStore.craftedItems)

const unlockedHM = computed(() => gameStore.unlockedHiddenMemories.length)
const totalHM = computed(() => storyStore.getAllHiddenMemories().length)
const allHiddenMemories = computed(() => storyStore.getAllHiddenMemories())
const allCraftedItems = computed(() => storyStore.getAllCraftedItems())
const allHiddenItemsList = computed(() => storyStore.getAllHiddenItems())
const totalHiddenItemsCount = computed(() => storyStore.getTotalHiddenItemsCount())
const hiddenItemsCount = computed(() => gameStore.foundHiddenItemsCount)

const archiveEndings = computed(() => archiveStore.unlockedEndings.length)
const archiveHM = computed(() => archiveStore.everUnlockedHiddenMemories.length)

const hasBranches = computed(() => archiveStore.branchSaves.length > 0)
const recentBranches = computed(() => [...archiveStore.branchSaves].reverse().slice(0, 4))

const madeChoicesCount = computed(() => gameStore.madeChoices.length)
const totalChoicesCount = computed(() => storyStore.getAllKeyChoices().length)

const dominantWeights = computed(() => gameStore.dominantEndingWeights)

const completionRate = computed(() => {
  const itemRate = totalItems.value > 0 ? foundCount.value / totalItems.value : 0
  const craftRate = totalCraftable.value > 0 ? craftedCount.value / totalCraftable.value : 0
  const hmRate = totalHM.value > 0 ? unlockedHM.value / totalHM.value : 0
  const hiRate = totalHiddenItemsCount.value > 0 ? hiddenItemsCount.value / totalHiddenItemsCount.value : 0
  return Math.round(((itemRate * 0.3) + (craftRate * 0.25) + (hmRate * 0.2) + (hiRate * 0.15) + (choicePercent.value / 100 * 0.1)) * 100)
})

const choicePercent = computed(() => {
  return totalChoicesCount.value > 0 ? Math.round((madeChoicesCount.value / totalChoicesCount.value) * 100) : 0
})

const formattedTimeUsed = computed(() => {
  const minutes = Math.floor(timeUsed.value / 60)
  const seconds = timeUsed.value % 60
  return `${minutes}分${seconds}秒`
})

const currentChapterId = computed(() => gameStore.currentChapterId)

const currentChapterName = computed(() => {
  const chapter = storyStore.getChapterById(currentChapterId.value)
  return chapter ? chapter.name : '未知'
})

const chapterIcon = computed(() => {
  const chapter = storyStore.getChapterById(currentChapterId.value)
  if (!chapter) return '📖'
  if (chapter.isFinalChapter) return '🌟'
  const icons = ['🚂', '👣', '☀️', '💍']
  return icons[chapter.id - 1] || '📖'
})

const endingData = computed(() => {
  const foundC = foundCount.value
  const totalC = totalItems.value
  const tUsed = timeUsed.value
  const crafted = [...craftedItems.value]
  const chId = currentChapterId.value
  const moodV = gameStore.moodValue
  const trigM = triggeredMemories.value
  const unlocHM = unlockedHM.value
  const totalHMC = totalHM.value
  const madeCh = [...gameStore.madeChoices]
  const endW = { ...gameStore.endingWeights }
  const foundHI = hiddenItemsCount.value
  const totalHIC = totalHiddenItemsCount.value

  return storyStore.getReunionEnding({
    foundCount: foundC,
    totalItems: totalC,
    timeUsed: tUsed,
    craftedItems: crafted,
    currentChapterId: chId,
    moodValue: moodV,
    triggeredMemoriesCount: trigM,
    unlockedHMCount: unlocHM,
    totalHMCount: totalHMC,
    madeChoices: madeCh,
    endingWeights: endW,
    foundHiddenItemsCount: foundHI,
    totalHiddenItemsCount: totalHIC
  })
})

const findEfficiencyLevel = computed(() => endingData.value?.findEfficiency || 'normal')
const memoryCompletenessLevel = computed(() => endingData.value?.memoryCompleteness || 'normal')

const findEfficiencyPercent = computed(() => {
  const map = { perfect: 100, excellent: 85, good: 70, normal: 50, poor: 25 }
  return map[findEfficiencyLevel.value] || 50
})

const memoryCompletenessPercent = computed(() => {
  const map = { perfect: 100, excellent: 85, good: 70, normal: 50, poor: 25 }
  return map[memoryCompletenessLevel.value] || 50
})

const findEfficiencyClass = computed(() => `eff-${findEfficiencyLevel.value}`)
const memoryClass = computed(() => `mem-${memoryCompletenessLevel.value}`)
const choiceClass = computed(() => {
  if (choicePercent.value >= 80) return 'choice-excellent'
  if (choicePercent.value >= 50) return 'choice-good'
  if (choicePercent.value >= 30) return 'choice-normal'
  return 'choice-poor'
})
const hiddenItemPercent = computed(() => totalHiddenItemsCount.value > 0 ? Math.round((hiddenItemsCount.value / totalHiddenItemsCount.value) * 100) : 0)
const hiddenItemClass = computed(() => {
  if (hiddenItemPercent.value >= 80) return 'hi-excellent'
  if (hiddenItemPercent.value >= 50) return 'hi-good'
  if (hiddenItemPercent.value >= 30) return 'hi-normal'
  return 'hi-poor'
})

function getEfficiencyLabel(level) {
  const labels = { perfect: '完美', excellent: '优秀', good: '良好', normal: '一般', poor: '不足' }
  return labels[level] || '一般'
}

function getWeightLabel(key) {
  return storyStore.getEndingWeightLabel(key)
}

const endingType = computed(() => endingData.value?.type || 'normal')

const endingSceneBg = computed(() => {
  if (endingData.value?.scene?.background) return endingData.value.scene.background
  const defaults = {
    legendary: 'linear-gradient(180deg, #1a1200 0%, #2d1f05 40%, #4a3008 100%)',
    epic: 'linear-gradient(180deg, #1a0a2e 0%, #2d1f4d 40%, #3d2a6b 100%)',
    special: 'linear-gradient(180deg, #0a1a2e 0%, #1f3d4d 40%, #2a5a6b 100%)',
    perfect: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d5a 40%, #4a4a8a 100%)',
    good: 'linear-gradient(180deg, #1a1a2e 0%, #2d3d4a 40%, #3d4a6b 100%)',
    normal: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #2d1f3d 100%)',
    bad: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #2d2d3d 100%)',
    despair: 'linear-gradient(180deg, #0a0505 0%, #1a0a0a 40%, #2d1515 100%)'
  }
  return defaults[endingType.value] || defaults.normal
})

const activeEffects = computed(() => {
  if (endingData.value?.scene?.effects) return endingData.value.scene.effects
  return []
})

const specialEndingText = computed(() => {
  const map = {
    legendary: '传说结局',
    epic: '史诗结局',
    special: '特殊结局'
  }
  return map[endingType.value] || '隐藏结局'
})

const endingEmoji = computed(() => {
  const emojis = {
    legendary: '👑',
    epic: '🏆',
    special: '💫',
    perfect: '🌟',
    good: '🥰',
    normal: '💭',
    bad: '🌫️',
    despair: '💔'
  }
  return emojis[endingType.value] || '💭'
})

const finalMoodValue = computed(() => endingData.value?.moodValue ?? 50)

const descriptionParagraphs = computed(() => {
  const desc = endingData.value?.description || ''
  return desc.split('\n').filter(p => p.trim())
})

const particleCount = computed(() => {
  const counts = { lavender: 40, stars: 35, water: 30, petals: 45, leaves: 35, sparkle: 25, ashes: 20, mist: 50, denseFog: 60, sorrow: 30 }
  return counts[endingData.value?.scene?.particles] || 0
})

function getParticleStyle(index) {
  const seed = index * 37
  const left = (seed * 17) % 100
  const delay = (seed * 7) % 10
  const duration = 6 + ((seed * 3) % 8)
  const size = 6 + (seed % 8)
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

function getMoodStateName(moodValue) {
  if (moodValue <= 20) return '绝望'
  if (moodValue <= 40) return '阴郁'
  if (moodValue <= 60) return '平静'
  if (moodValue <= 80) return '温暖'
  return '希冀'
}

function getMoodColor(moodValue) {
  if (moodValue <= 20) return '#3d2828'
  if (moodValue <= 40) return '#4a4a5a'
  if (moodValue <= 60) return '#5a6a7a'
  if (moodValue <= 80) return '#c48a65'
  return '#e8b87a'
}

const allMemories = computed(() => storyStore.getAllMemories())

function isMemoryUnlocked(memoryId) {
  return gameStore.triggeredMemories.includes(memoryId)
}

function isMemoryVisible(memoryId) {
  return isMemoryUnlocked(memoryId) || archiveStore.isMemoryEverTriggered(memoryId)
}

function isHiddenMemoryUnlocked(hmId) {
  return gameStore.isHiddenMemoryUnlocked(hmId)
}

function isHMVisible(hmId) {
  return isHiddenMemoryUnlocked(hmId) || archiveStore.isHiddenMemoryEverUnlocked(hmId)
}

function isHMCurrent(hmId) {
  return gameStore.isHiddenMemoryUnlocked(hmId)
}

function isHMEver(hmId) {
  return archiveStore.isHiddenMemoryEverUnlocked(hmId)
}

function isHiddenItemVisible(hiId) {
  return gameStore.isHiddenItemFound(hiId) || archiveStore.isHiddenItemEverFound(hiId)
}

function isCrafted(craftId) {
  return gameStore.isCrafted(craftId)
}

function isCraftedVisible(craftId) {
  return isCrafted(craftId) || archiveStore.isCraftedItemEverObtained(craftId)
}

function isCraftedCurrent(craftId) {
  return gameStore.isCrafted(craftId)
}

function isCraftedEver(craftId) {
  return archiveStore.isCraftedItemEverObtained(craftId)
}

function getRarityLabel(rarity) {
  const map = { legendary: '传说', epic: '史诗', rare: '稀有' }
  return map[rarity] || rarity
}

function getEmojiForEmotion(emotion) {
  const emotions = {
    sad: '😢',
    warm: '🥰',
    pensive: '🤔',
    happy: '😊',
    sweet: '🍬',
    nervous: '😰',
    bittersweet: '😌',
    shocking: '😲',
    romantic: '💕',
    regret: '💔',
    melancholy: '🌧️',
    touched: '🥹',
    determined: '💪'
  }
  return emotions[emotion] || '💭'
}

function getFinalGameTime() {
  const finalHour = Math.min(timeStore.currentHour, GAME_START_HOUR + GAME_TOTAL_HOURS)
  const periodNames = {
    dawn: '黎明',
    day: '白天',
    dusk: '黄昏',
    night: '夜晚'
  }
  const period = timeStore.currentTimePeriod
  return `${periodNames[period]} ${finalHour}:00`
}

function openArchive() {
  gameStore.openArchive()
}

function openJournal() {
  gameStore.openJournal()
}

function openJournalEditor() {
  gameStore.openJournalEditor()
}

function openMemoryTheater() {
  gameStore.openMemoryTheater()
}

function openCollectionRoom() {
  collectionStore.openCollectionRoom()
}

const collectionProgress = computed(() => collectionStore.overallProgress)

const hasTheaterContent = computed(() => {
  return triggeredMemories.value > 0 || unlockedHM.value > 0 || archiveHM.value > 0
})

function recordGameToGrowth() {
  const timeUsedVal = 300 - gameStore.timeRemaining
  const foundCountVal = gameStore.foundCount
  const memoryCountVal = gameStore.triggeredMemories.length
  const craftedCountVal = gameStore.craftedCount
  const hiddenCountVal = gameStore.foundHiddenItemsCount
  const isPerfect = foundCountVal >= gameStore.totalItems
  const endingType = gameStore.endingData?.type || 'neutral'
  
  const visitedScenesArr = [gameStore.currentSceneId]
  
  growthStore.recordGameEnd({
    timeUsed: timeUsedVal,
    foundCount: foundCountVal,
    memoryCount: memoryCountVal,
    craftedCount: craftedCountVal,
    hiddenCount: hiddenCountVal,
    isPerfect,
    visitedScenes: visitedScenesArr,
    endingType,
    locationStats: {}
  })
}

function loadBranch(branchId) {
  gameStore.startGameFromBranch(branchId)
}

function playAgain() {
  gameStore.resetGame()
  gameStore.startGame()
}

function returnHome() {
  gameStore.resetGame()
  gameStore.returnToStart()
}

const isChallengeMode = computed(() => challengeStore.isChallengeMode)
const challengeDate = computed(() => challengeStore.todayDate || new Date().toLocaleDateString('zh-CN'))
const challengeStreak = computed(() => challengeStore.challengeStreak)
const unlockedBadgesCount = computed(() => challengeStore.unlockedBadgesCount)
const totalBadgesCount = computed(() => challengeStore.totalBadgesCount)

const challengeScore = computed(() => {
  if (!isChallengeMode.value) return 0
  const result = {
    foundCount: foundCount.value,
    totalItems: totalItems.value,
    timeUsed: timeUsed.value,
    craftedCount: craftedCount.value,
    totalCraftable: totalCraftable.value,
    unlockedHMCount: unlockedHM.value,
    totalHMCount: totalHM.value,
    foundHiddenItemsCount: hiddenItemsCount.value,
    totalHiddenItemsCount: totalHiddenItemsCount.value,
    endingType: endingType.value,
    moodValue: finalMoodValue.value
  }
  return challengeStore.calculateChallengeScore(result)
})

const challengeRank = computed(() => {
  if (!isChallengeMode.value) return null
  const sortedLb = [...challengeStore.leaderboard].sort((a, b) => b.score - a.score)
  const idx = sortedLb.findIndex(e => e.timestamp && Date.now() - e.timestamp < 5000)
  return idx >= 0 ? idx + 1 : sortedLb.length + 1
})

const newlyUnlockedBadges = computed(() => {
  if (!challengeStore.newlyUnlockedBadge) return []
  return [challengeStore.newlyUnlockedBadge]
})

function getRankClass(rank) {
  if (!rank) return 'rank-normal'
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  if (rank <= 10) return 'rank-top10'
  return 'rank-normal'
}

function getRankInfo(rank) {
  return challengeStore.getRankBadge(rank)
}

function openLeaderboardFromEnd() {
  challengeStore.openLeaderboard()
}

function openBadgesFromEnd() {
  challengeStore.openBadges()
}
</script>

<style scoped>
.end-scene {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 1.5s ease;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  bottom: -20px;
  opacity: 0;
  animation: particle-fall linear infinite;
  pointer-events: none;
}

.particle.lavender {
  background: radial-gradient(circle, #b48ecf 0%, #9b59b6 100%);
  border-radius: 50%;
  filter: blur(0.5px);
}

.particle.stars {
  background: radial-gradient(circle, #ffd700 0%, #ffec8b 100%);
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
}

.particle.water {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(56, 189, 248, 0.4) 100%);
  border-radius: 50%;
}

.particle.petals {
  background: radial-gradient(ellipse, #ffb6c1 0%, #ff69b4 100%);
  border-radius: 60% 40% 60% 40%;
  animation-name: particle-fall, petal-rotate;
}

.particle.leaves {
  background: linear-gradient(135deg, #8fbc8f 0%, #6b8e23 100%);
  border-radius: 0 50% 50% 50%;
  transform: rotate(45deg);
  animation-name: particle-fall, leaf-sway;
}

.particle.sparkle {
  background: radial-gradient(circle, #fff 0%, #ffd700 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px #fff, 0 0 20px #ffd700;
}

.particle.ashes {
  background: radial-gradient(circle, #5a5a5a 0%, #3a3a3a 100%);
  border-radius: 50%;
  filter: blur(1px);
}

.particle.mist {
  background: radial-gradient(circle, rgba(200, 200, 220, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(8px);
}

.particle.denseFog {
  background: radial-gradient(circle, rgba(150, 150, 170, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(15px);
}

.particle.sorrow {
  background: linear-gradient(180deg, rgba(100, 50, 50, 0.6) 0%, transparent 100%);
  border-radius: 50% 50% 0 0;
}

@keyframes particle-fall {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0);
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) translateX(30px);
  }
}

@keyframes petal-rotate {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
}

@keyframes leaf-sway {
  0%, 100% { margin-left: 0; }
  50% { margin-left: 20px; }
}

.fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(200, 200, 220, 0.15) 0%, transparent 70%);
  animation: fog 12s ease-in-out infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 2;
}

.fog-layer.active {
  opacity: 1;
}

.end-scene.legendary .fog-layer.active {
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.12) 0%, transparent 70%);
}

.end-scene.epic .fog-layer.active {
  background: radial-gradient(ellipse at center, rgba(192, 132, 252, 0.12) 0%, transparent 70%);
}

.end-scene.special .fog-layer.active {
  background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.12) 0%, transparent 70%);
}

.end-scene.despair .fog-layer.active {
  background: radial-gradient(ellipse at center, rgba(100, 50, 50, 0.15) 0%, transparent 70%);
}

.effect-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.effect-layer.timeStop {
  animation: time-stop-effect 4s ease-in-out;
}

.effect-layer.lightBurst {
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, transparent 60%);
  animation: light-burst 3s ease-out;
}

.effect-layer.rainbow {
  background: linear-gradient(180deg, rgba(255, 0, 0, 0.05), rgba(255, 165, 0, 0.05), rgba(255, 255, 0, 0.05), rgba(0, 128, 0, 0.05), rgba(0, 0, 255, 0.05), rgba(75, 0, 130, 0.05));
  animation: rainbow-shift 8s ease-in-out infinite;
}

.effect-layer.heartRise {
  background: radial-gradient(circle at 50% 80%, rgba(255, 105, 180, 0.2) 0%, transparent 50%);
  animation: heart-rise 4s ease-out;
}

@keyframes time-stop-effect {
  0%, 100% { filter: none; }
  50% { filter: sepia(0.3) contrast(1.2); }
}

@keyframes light-burst {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: scale(2); }
}

@keyframes rainbow-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes heart-rise {
  0% { opacity: 0; transform: translateY(50px); }
  50% { opacity: 0.8; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-50px); }
}

@keyframes fog {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-25%); }
}

.end-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 20px;
  max-width: 90vw;
  max-height: 95vh;
  overflow-y: auto;
}

.intro-scene {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-stage {
  text-align: center;
}

.intro-emoji.big {
  font-size: clamp(5rem, 15vw, 8rem);
  margin-bottom: 2rem;
  animation: intro-emoji 2s ease-out;
}

.intro-emoji.legendary {
  animation: intro-emoji 2s ease-out, sparkle-rotate 2s ease-in-out infinite;
}

@keyframes intro-emoji {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-20deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.intro-title {
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 300;
  letter-spacing: 0.3rem;
  color: #fff;
  animation: intro-title 2.5s ease-out;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
}

@keyframes intro-title {
  0% { opacity: 0; letter-spacing: 1rem; }
  100% { opacity: 1; letter-spacing: 0.3rem; }
}

.intro-title.perfect {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-title.good {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-title.legendary {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700, #ff8c00);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: intro-title 2.5s ease-out, gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.intro-title.epic {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #818cf8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: intro-title 2.5s ease-out, gradient-shift 4s ease infinite;
}

.intro-title.special {
  background: linear-gradient(135deg, #60a5fa, #38bdf8, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.intro-title.normal {
  color: #b0b0c0;
}

.intro-title.bad {
  color: #707080;
}

.intro-title.despair {
  background: linear-gradient(135deg, #6b4444, #8b3a3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.reunion-enter-active {
  opacity: 0;
  transform: translateY(30px);
}

.reunion-enter-to {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.8s ease-out;
}

.reunion-leave-active {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.5s ease-in;
}

.ending-badge-wrap {
  margin-bottom: 1rem;
}

.ending-icon {
  font-size: clamp(3rem, 10vw, 5rem);
  margin-bottom: 0.8rem;
  animation: float 4s ease-in-out infinite;
}

.ending-icon.special {
  animation: float 4s ease-in-out infinite, sparkle-rotate 3s ease-in-out infinite;
}

.ending-icon.legendary {
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes sparkle-rotate {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)); }
}

.ending-title {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  font-weight: 400;
  letter-spacing: 0.3rem;
  margin-bottom: 0.5rem;
  color: #e8e8f0;
}

.ending-title.perfect {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-title.good {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-title.legendary {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700, #ff8c00);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

.ending-title.epic {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #818cf8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

.ending-title.special {
  background: linear-gradient(135deg, #60a5fa, #38bdf8, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-title.normal {
  color: #b0b0c0;
}

.ending-title.bad {
  color: #707080;
}

.ending-title.despair {
  background: linear-gradient(135deg, #6b4444, #8b3a3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-type-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.end-scene.epic .ending-type-badge {
  color: #c084fc;
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.3);
}

.end-scene.special .ending-type-badge {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.3);
}

.badge-star {
  margin: 0 0.3rem;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.ending-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  margin: 0 auto 1.5rem;
}

.end-scene.legendary .ending-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.end-scene.epic .ending-divider {
  background: linear-gradient(90deg, transparent, rgba(192, 132, 252, 0.6), transparent);
}

.end-scene.special .ending-divider {
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent);
}

.ending-description-wrap {
  margin-bottom: 2rem;
}

.ending-description {
  font-size: clamp(0.9rem, 2.8vw, 1.05rem);
  color: #d0d0e0;
  line-height: 2.1;
  max-width: 560px;
  margin: 0 auto 0.8rem;
  text-align: justify;
  text-indent: 2em;
}

.ending-description:last-child {
  margin-bottom: 0;
  font-style: italic;
  color: #b0b0c8;
  text-indent: 0;
  text-align: center;
}

.reunion-dimensions {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dimensions-title {
  margin: 0 0 1.2rem 0;
  color: #d4a574;
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dim-icon {
  font-size: 1.3rem;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.dimension-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.dim-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
}

.dim-icon-lg {
  font-size: 1.5rem;
}

.dim-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dim-label {
  color: #a0a0b8;
  font-size: 0.85rem;
}

.dim-value {
  color: #e8e8f0;
  font-weight: 600;
  font-size: 0.95rem;
}

.dim-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease-out;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.eff-perfect .dim-bar-fill { background: linear-gradient(90deg, #ffd700, #ff8c00); }
.eff-excellent .dim-bar-fill { background: linear-gradient(90deg, #ffec8b, #ffd700); }
.eff-good .dim-bar-fill { background: linear-gradient(90deg, #86efac, #4ade80); }
.eff-normal .dim-bar-fill { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.eff-poor .dim-bar-fill { background: linear-gradient(90deg, #94a3b8, #64748b); }

.mem-perfect .dim-bar-fill { background: linear-gradient(90deg, #c084fc, #a78bfa); }
.mem-excellent .dim-bar-fill { background: linear-gradient(90deg, #a78bfa, #818cf8); }
.mem-good .dim-bar-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.mem-normal .dim-bar-fill { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.mem-poor .dim-bar-fill { background: linear-gradient(90deg, #94a3b8, #64748b); }

.choice-excellent .dim-bar-fill { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.choice-good .dim-bar-fill { background: linear-gradient(90deg, #86efac, #4ade80); }
.choice-normal .dim-bar-fill { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.choice-poor .dim-bar-fill { background: linear-gradient(90deg, #94a3b8, #64748b); }

.hi-excellent .dim-bar-fill { background: linear-gradient(90deg, #f472b6, #ec4899); }
.hi-good .dim-bar-fill { background: linear-gradient(90deg, #c084fc, #a855f7); }
.hi-normal .dim-bar-fill { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.hi-poor .dim-bar-fill { background: linear-gradient(90deg, #94a3b8, #64748b); }

.personality-tags {
  margin-bottom: 1.5rem;
  padding: 0.8rem 1rem;
  background: rgba(212, 165, 116, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(212, 165, 116, 0.15);
}

.pt-title {
  color: #a0a0b0;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}

.pt-tag {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  margin: 0.2rem;
  background: rgba(102, 126, 234, 0.15);
  color: #a5b4fc;
  border-radius: 12px;
  font-size: 0.78rem;
  border: 1px solid rgba(102, 126, 234, 0.25);
}

.game-stats {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.end-scene.legendary .game-stats {
  border-color: rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.03);
}

.end-scene.epic .game-stats {
  border-color: rgba(192, 132, 252, 0.2);
  background: rgba(192, 132, 252, 0.03);
}

.end-scene.special .game-stats {
  border-color: rgba(96, 165, 250, 0.2);
  background: rgba(96, 165, 250, 0.03);
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-row:last-child {
  border-bottom: none;
}

.total-progress-row {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
}

.stat-icon {
  font-size: 1.3rem;
  margin-right: 0.8rem;
}

.stat-label {
  flex: 1;
  text-align: left;
  color: #a0a0b0;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
}

.stat-value {
  color: #e8e8f0;
  font-weight: 600;
  font-size: clamp(0.9rem, 2.6vw, 1rem);
}

.stat-value.craft-stat {
  color: #d4a574;
}

.stat-value.hm-stat {
  color: #fbbf24;
}

.stat-value.hi-stat {
  color: #f472b6;
}

.stat-value.total-stat {
  color: #667eea;
  font-size: 1.1rem;
}

.end-scene.legendary .stat-value.total-stat {
  color: #ffd700;
}

.end-scene.epic .stat-value.total-stat {
  color: #c084fc;
}

.end-scene.special .stat-value.total-stat {
  color: #60a5fa;
}

.end-scene.despair .stat-value.total-stat {
  color: #8b3a3a;
}

.mood-stat-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.crafted-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hidden-items-section {
  background: rgba(244, 114, 182, 0.04);
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(244, 114, 182, 0.12);
}

.section-title {
  margin: 0 0 1rem 0;
  color: #d4a574;
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.3rem;
}

.crafted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.8rem;
}

.hidden-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.8rem;
}

.crafted-end-card,
.hidden-item-end-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 0.8rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.crafted-end-card.unlocked,
.hidden-item-end-card.unlocked {
  opacity: 1;
}

.crafted-end-card.end-rarity-legendary.unlocked {
  background: rgba(255, 215, 0, 0.08);
  border-color: rgba(255, 215, 0, 0.3);
}

.crafted-end-card.end-rarity-epic.unlocked {
  background: rgba(192, 132, 252, 0.08);
  border-color: rgba(192, 132, 252, 0.3);
}

.crafted-end-card.end-rarity-rare.unlocked {
  background: rgba(96, 165, 250, 0.08);
  border-color: rgba(96, 165, 250, 0.3);
}

.hidden-item-end-card.end-rarity-legendary.unlocked {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.35);
}

.hidden-item-end-card.end-rarity-epic.unlocked {
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.35);
}

.hidden-item-end-card.end-rarity-rare.unlocked {
  background: rgba(244, 114, 182, 0.1);
  border-color: rgba(244, 114, 182, 0.35);
}

.crafted-end-icon,
.hi-end-icon {
  font-size: 1.8rem;
}

.crafted-end-name,
.hi-end-name {
  font-size: 0.82rem;
  color: #707080;
  text-align: center;
}

.crafted-end-card.unlocked .crafted-end-name,
.hidden-item-end-card.unlocked .hi-end-name {
  color: #c0c0d0;
}

.crafted-end-rarity {
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
}

.crafted-end-rarity.end-rarity-legendary {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.crafted-end-rarity.end-rarity-epic {
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
}

.crafted-end-rarity.end-rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.crafted-ever-tag {
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: rgba(212, 165, 116, 0.15);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.2);
}

.collected-memories {
  margin-bottom: 2rem;
}

.memories-title {
  color: #d4a574;
  font-size: clamp(1rem, 3vw, 1.1rem);
  margin-bottom: 1rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.memories-section {
  margin-bottom: 1.2rem;
}

.subsection-title {
  margin: 0 0 0.8rem 0;
  color: #808090;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.6rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.3rem;
}

.hidden-grid {
  max-height: 140px;
}

.memory-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.7rem 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}

.memory-card.unlocked {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.hidden-card.unlocked {
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.3);
}

.memory-card-icon {
  font-size: 1.5rem;
}

.memory-card-title {
  font-size: 0.75rem;
  color: #707080;
  text-align: center;
  line-height: 1.3;
}

.memory-card.unlocked .memory-card-title,
.hidden-card.unlocked .memory-card-title {
  color: #c0c0d0;
}

.memory-ever-tag {
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: rgba(212, 165, 116, 0.15);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.2);
}

.archive-hint,
.journal-hint,
.theater-hint,
.collection-hint {
  background: rgba(212, 165, 116, 0.06);
  border: 1px solid rgba(212, 165, 116, 0.15);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #a0a0b0;
}

.journal-hint {
  background: rgba(96, 165, 250, 0.06);
  border-color: rgba(96, 165, 250, 0.15);
}

.theater-hint {
  background: rgba(167, 139, 250, 0.06);
  border-color: rgba(167, 139, 250, 0.15);
}

.collection-hint {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.04));
  border-color: rgba(251, 191, 36, 0.25);
  animation: hint-glow 3s ease-in-out infinite;
}

@keyframes hint-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
  50% { box-shadow: 0 0 15px 0 rgba(251, 191, 36, 0.1); }
}

.hint-icon {
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

.hint-btn {
  background: rgba(212, 165, 116, 0.15);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.25);
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.journal-hint-btn {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.25);
}

.theater-hint-btn {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.25);
}

.collection-hint-btn {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15));
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.cr-hint-progress {
  padding: 0.1rem 0.5rem;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.hint-btn:hover {
  transform: translateY(-1px);
}

.branch-continue {
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.branch-title {
  margin: 0 0 0.8rem 0;
  color: #86efac;
  font-size: 0.95rem;
  font-weight: 500;
}

.branch-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.branch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.branch-item:hover {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.25);
}

.branch-item-icon {
  font-size: 1rem;
}

.branch-item-label {
  flex: 1;
  text-align: left;
  color: #c0c0d0;
  margin: 0 0.8rem;
}

.branch-item-action {
  color: #86efac;
  font-size: 0.8rem;
}

.end-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0 1.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-family: inherit;
  letter-spacing: 0.05rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.end-scene.legendary .btn-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.end-scene.epic .btn-primary {
  background: linear-gradient(135deg, #c084fc 0%, #a78bfa 100%);
  box-shadow: 0 4px 15px rgba(192, 132, 252, 0.4);
}

.end-scene.special .btn-primary {
  background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%);
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);
}

.btn-outline {
  background: transparent;
  color: #a0a0b0;
  border: 1px solid rgba(160, 160, 176, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(160, 160, 176, 0.5);
  transform: translateY(-2px);
}

.credits {
  text-align: center;
  color: #606070;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
  font-style: italic;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.end-scene.legendary .credits {
  color: #8b7530;
}

.end-scene.epic .credits {
  color: #7c6aa0;
}

.end-scene.special .credits {
  color: #5a7a9a;
}

.text-shadow {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.end-scene.legendary .ending-title,
.end-scene.legendary .ending-description {
  text-shadow: 0 2px 20px rgba(255, 215, 0, 0.3);
}

.end-scene.epic .ending-title,
.end-scene.epic .ending-description {
  text-shadow: 0 2px 20px rgba(192, 132, 252, 0.3);
}

.end-scene.special .ending-title,
.end-scene.special .ending-description {
  text-shadow: 0 2px 20px rgba(96, 165, 250, 0.3);
}

.challenge-result-section {
  background: linear-gradient(145deg, rgba(50, 35, 20, 0.5), rgba(30, 25, 15, 0.6));
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(212, 165, 116, 0.3);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
}

.challenge-icon-big {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

.challenge-title-wrap {
  text-align: left;
  flex: 1;
}

.challenge-title {
  margin: 0;
  color: #d4a574;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.challenge-date {
  margin: 0.3rem 0 0 0;
  color: #8a8070;
  font-size: 0.8rem;
  font-family: monospace;
}

.challenge-score-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.challenge-score-card.rank-gold {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05));
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.15);
}

.challenge-score-card.rank-silver {
  background: linear-gradient(145deg, rgba(192, 192, 192, 0.1), rgba(160, 160, 160, 0.05));
  border-color: rgba(192, 192, 192, 0.35);
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.1);
}

.challenge-score-card.rank-bronze {
  background: linear-gradient(145deg, rgba(205, 127, 50, 0.1), rgba(180, 100, 40, 0.05));
  border-color: rgba(205, 127, 50, 0.35);
  box-shadow: 0 0 15px rgba(205, 127, 50, 0.1);
}

.challenge-score-card.rank-top10 {
  background: linear-gradient(145deg, rgba(129, 140, 248, 0.08), rgba(96, 165, 250, 0.04));
  border-color: rgba(129, 140, 248, 0.3);
}

.score-main {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.score-label {
  display: block;
  color: #8a8070;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  letter-spacing: 0.1rem;
}

.score-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4a574, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1rem;
}

.score-rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.5rem;
  padding: 0.3rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rank-icon {
  font-size: 1rem;
}

.rank-text {
  color: #e8e8f0;
  font-size: 0.85rem;
  font-weight: 600;
}

.score-breakdown {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.si-icon {
  font-size: 1.1rem;
}

.si-label {
  color: #8a8070;
  font-size: 0.72rem;
}

.si-value {
  color: #e8e8f0;
  font-size: 0.85rem;
  font-weight: 600;
}

.newly-unlocked-badges {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: badgeUnlockGlow 2s ease-in-out infinite;
}

@keyframes badgeUnlockGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.25); }
}

.nub-title {
  margin: 0 0 0.8rem 0;
  color: #ffd700;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.nub-icon {
  font-size: 1.2rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

.nub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.8rem;
}

.nub-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.8rem 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: badgePopIn 0.5s ease-out;
}

@keyframes badgePopIn {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.nub-card.nub-rarity-legendary {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.08));
  border-color: rgba(255, 215, 0, 0.45);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.nub-card.nub-rarity-epic {
  background: linear-gradient(145deg, rgba(192, 132, 252, 0.12), rgba(167, 139, 250, 0.06));
  border-color: rgba(192, 132, 252, 0.4);
  box-shadow: 0 0 15px rgba(192, 132, 252, 0.15);
}

.nub-card.nub-rarity-rare {
  background: linear-gradient(145deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.05));
  border-color: rgba(96, 165, 250, 0.35);
}

.nub-card-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.nub-card-name {
  color: #e8e8f0;
  font-size: 0.9rem;
  font-weight: 600;
}

.nub-rarity-legendary .nub-card-name { color: #ffd700; }
.nub-rarity-epic .nub-card-name { color: #c084fc; }
.nub-rarity-rare .nub-card-name { color: #60a5fa; }

.nub-card-desc {
  color: #8a8a9a;
  font-size: 0.72rem;
  line-height: 1.4;
}

.challenge-streak-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.08));
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.streak-icon {
  font-size: 1.3rem;
  animation: fireShake 0.5s ease-in-out infinite;
}

@keyframes fireShake {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.streak-text {
  color: #e8e8f0;
  font-size: 0.9rem;
}

.streak-text strong {
  color: #f97316;
  font-size: 1.1rem;
}

.challenge-quick-buttons {
  display: flex;
  gap: 0.8rem;
}

.half-btn {
  flex: 1;
}
</style>