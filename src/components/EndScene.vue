<template>
  <div class="end-scene">
    <div class="fog-layer"></div>
    
    <div class="end-content">
      <div class="ending-icon">{{ endingEmoji }}</div>
      
      <h1 class="ending-title text-shadow" :class="endingType">
        {{ endingData?.title }}
      </h1>
      
      <div class="ending-divider"></div>
      
      <p class="ending-description text-shadow">
        {{ endingData?.description }}
      </p>
      
      <div class="game-stats">
        <div class="stat-row">
          <span class="stat-icon">💎</span>
          <span class="stat-label">找到物品</span>
          <span class="stat-value">{{ foundCount }}/{{ totalItems }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">💭</span>
          <span class="stat-label">回忆碎片</span>
          <span class="stat-value">{{ triggeredMemories }}/{{ totalItems }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">⏱️</span>
          <span class="stat-label">用时</span>
          <span class="stat-value">{{ formattedTimeUsed }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">📊</span>
          <span class="stat-label">完成度</span>
          <span class="stat-value">{{ completionRate }}%</span>
        </div>
      </div>
      
      <div class="collected-memories">
        <h3 class="memories-title">收集的回忆</h3>
        <div class="memories-grid">
          <div
            v-for="memory in allMemories"
            :key="memory.id"
            class="memory-card"
            :class="{ unlocked: isMemoryUnlocked(memory.id) }"
          >
            <span class="memory-card-icon">
              {{ isMemoryUnlocked(memory.id) ? getEmojiForEmotion(memory.emotion) : '🔒' }}
            </span>
            <span class="memory-card-title">
              {{ isMemoryUnlocked(memory.id) ? memory.title : '???' }}
            </span>
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

const gameStore = useGameStore()
const storyStore = useStoryStore()

const timeUsed = ref(300 - gameStore.timeRemaining)
const foundCount = computed(() => gameStore.foundCount)
const totalItems = computed(() => gameStore.totalItems)
const triggeredMemories = computed(() => gameStore.triggeredMemories.length)

const completionRate = computed(() => {
  return Math.round((foundCount.value / totalItems.value) * 100)
})

const formattedTimeUsed = computed(() => {
  const minutes = Math.floor(timeUsed.value / 60)
  const seconds = timeUsed.value % 60
  return `${minutes}分${seconds}秒`
})

const endingData = computed(() => {
  return storyStore.getEndingData(foundCount.value, totalItems.value, timeUsed.value)
})

const endingType = computed(() => endingData.value?.type || 'normal')

const endingEmoji = computed(() => {
  const emojis = {
    perfect: '🌟',
    good: '🥰',
    normal: '💭',
    bad: '🌫️'
  }
  return emojis[endingType.value] || '💭'
})

const allMemories = computed(() => storyStore.getAllMemories())

function isMemoryUnlocked(memoryId) {
  return gameStore.triggeredMemories.includes(memoryId)
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

.ending-title {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  font-weight: 400;
  letter-spacing: 0.3rem;
  margin-bottom: 1rem;
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

.ending-title.normal {
  color: #b0b0c0;
}

.ending-title.bad {
  color: #707080;
}

.ending-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  margin: 0 auto 1.5rem;
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

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-icon {
  font-size: 1.4rem;
  margin-right: 1rem;
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

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
}

.memory-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.8rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.memory-card.unlocked {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.memory-card-icon {
  font-size: 1.5rem;
}

.memory-card-title {
  font-size: clamp(0.75rem, 2.2vw, 0.85rem);
  color: #a0a0b0;
  text-align: center;
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
</style>
