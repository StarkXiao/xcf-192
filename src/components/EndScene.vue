<template>
  <div class="end-scene" :class="endingType">
    <div class="fog-layer"></div>
    
    <div class="end-content">
      <div class="ending-icon" :class="{ special: endingData?.isSpecial }">{{ endingEmoji }}</div>
      
      <h1 class="ending-title text-shadow" :class="endingType">
        {{ endingData?.title }}
      </h1>
      
      <div class="ending-type-badge" v-if="endingData?.isSpecial">
        <span class="badge-star">✦</span>
        {{ specialEndingText }}
        <span class="badge-star">✦</span>
      </div>
      
      <div class="ending-divider"></div>
      
      <p class="ending-description text-shadow">
        {{ endingData?.description }}
      </p>
      
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
      
      <div class="archive-hint" v-if="archiveEndings > 0">
        <span class="hint-icon">📖</span>
        跨周目已解锁 {{ archiveEndings }} 个结局、{{ archiveHM }} 个隐藏回忆
        <button class="hint-btn" @click="openArchive">查看档案</button>
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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'
import { useArchiveStore } from '../stores/archiveStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()
const archiveStore = useArchiveStore()

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

const archiveEndings = computed(() => archiveStore.unlockedEndings.length)
const archiveHM = computed(() => archiveStore.everUnlockedHiddenMemories.length)

const hasBranches = computed(() => archiveStore.branchSaves.length > 0)
const recentBranches = computed(() => [...archiveStore.branchSaves].reverse().slice(0, 4))

const completionRate = computed(() => {
  const itemRate = totalItems.value > 0 ? foundCount.value / totalItems.value : 0
  const craftRate = totalCraftable.value > 0 ? craftedCount.value / totalCraftable.value : 0
  const hmRate = totalHM.value > 0 ? unlockedHM.value / totalHM.value : 0
  return Math.round(((itemRate * 0.4) + (craftRate * 0.35) + (hmRate * 0.25)) * 100)
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
  return storyStore.getEndingData(foundCount.value, totalItems.value, timeUsed.value, craftedItems.value, currentChapterId.value)
})

const endingType = computed(() => endingData.value?.type || 'normal')

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

function openArchive() {
  gameStore.openArchive()
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
</script>

<style scoped>
.end-scene {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #2d1f3d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background 1s ease;
}

.end-scene.legendary {
  background: linear-gradient(180deg, #1a1200 0%, #2d1f05 40%, #4a3008 100%);
}

.end-scene.epic {
  background: linear-gradient(180deg, #1a0a2e 0%, #2d1f4d 40%, #3d2a6b 100%);
}

.end-scene.special {
  background: linear-gradient(180deg, #0a1a2e 0%, #1f3d4d 40%, #2a5a6b 100%);
}

.end-scene.despair {
  background: linear-gradient(180deg, #0a0505 0%, #1a0a0a 40%, #2d1515 100%);
}

.end-scene.despair .fog-layer {
  background: radial-gradient(ellipse at center, rgba(100, 50, 50, 0.15) 0%, transparent 70%);
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
}

.end-scene.legendary .fog-layer {
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.12) 0%, transparent 70%);
}

.end-scene.epic .fog-layer {
  background: radial-gradient(ellipse at center, rgba(192, 132, 252, 0.12) 0%, transparent 70%);
}

.end-scene.special .fog-layer {
  background: radial-gradient(ellipse at center, rgba(96, 165, 250, 0.12) 0%, transparent 70%);
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

.ending-icon {
  font-size: clamp(3rem, 10vw, 5rem);
  margin-bottom: 1rem;
  animation: float 4s ease-in-out infinite;
}

.ending-icon.special {
  animation: float 4s ease-in-out infinite, sparkle-rotate 3s ease-in-out infinite;
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

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
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

.epic + .ending-type-badge,
.end-scene.epic .ending-type-badge {
  color: #c084fc;
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.3);
}

.special + .ending-type-badge,
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

.ending-description {
  font-size: clamp(0.9rem, 2.8vw, 1.1rem);
  color: #c0c0d0;
  line-height: 2;
  max-width: 500px;
  margin: 0 auto 2rem;
  text-align: justify;
  text-indent: 2em;
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

.crafted-end-card {
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

.crafted-end-card.unlocked {
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

.crafted-end-icon {
  font-size: 1.8rem;
}

.crafted-end-name {
  font-size: 0.82rem;
  color: #707080;
  text-align: center;
}

.crafted-end-card.unlocked .crafted-end-name {
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
  max-height: 180px;
  overflow-y: auto;
  padding: 0.3rem;
}

.hidden-grid {
  max-height: 120px;
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

.memory-card.hidden-card.unlocked {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.memory-card-icon {
  font-size: 1.4rem;
}

.memory-card-title {
  font-size: clamp(0.72rem, 2.1vw, 0.82rem);
  color: #707080;
  text-align: center;
  line-height: 1.3;
}

.memory-card.unlocked .memory-card-title {
  color: #c0c0d0;
}

.end-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.end-scene.legendary .btn-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.end-scene.epic .btn-primary {
  background: linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%);
  box-shadow: 0 4px 15px rgba(192, 132, 252, 0.4);
}

.end-scene.special .btn-primary {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #c0c0d0;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.credits {
  color: #606070;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
}

.crafted-ever-tag {
  font-size: 0.6rem;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  background: rgba(212, 165, 116, 0.15);
  color: #d4a574;
  border: 1px solid rgba(212, 165, 116, 0.2);
}

.memory-ever-tag {
  font-size: 0.55rem;
  padding: 0.1rem 0.3rem;
  border-radius: 5px;
  background: rgba(212, 165, 116, 0.12);
  color: #d4a574;
}

.archive-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: rgba(212, 165, 116, 0.06);
  border: 1px solid rgba(212, 165, 116, 0.15);
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  color: #a0a0b0;
}

.hint-icon {
  font-size: 1.1rem;
}

.hint-btn {
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 14px;
  background: rgba(212, 165, 116, 0.1);
  color: #d4a574;
  font-family: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-btn:hover {
  background: rgba(212, 165, 116, 0.2);
}

.branch-continue {
  margin-bottom: 1.5rem;
  background: rgba(100, 200, 150, 0.04);
  border: 1px solid rgba(100, 200, 150, 0.15);
  border-radius: 12px;
  padding: 1rem;
}

.branch-title {
  margin: 0 0 0.8rem 0;
  color: #86efac;
  font-size: 0.88rem;
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
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
}

.branch-item:hover {
  background: rgba(100, 200, 150, 0.1);
  border-color: rgba(100, 200, 150, 0.3);
}

.branch-item-icon {
  font-size: 1rem;
}

.branch-item-label {
  flex: 1;
  color: #c0c0d0;
  font-size: 0.82rem;
  text-align: left;
}

.branch-item-action {
  color: #86efac;
  font-size: 0.78rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.branch-item:hover .branch-item-action {
  opacity: 1;
}

.chapter-stat-row {
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.chapter-stat-end {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d4a574;
  font-weight: 600;
}

.end-scene.legendary .chapter-stat-end,
.end-scene.epic .chapter-stat-end,
.end-scene.special .chapter-stat-end {
  color: #ffd700;
}

.chapter-end-icon {
  font-size: 1.2rem;
}
</style>
