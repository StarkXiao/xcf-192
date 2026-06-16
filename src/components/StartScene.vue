<template>
  <div class="start-scene">
    <div class="fog-layer"></div>
    <div class="fog-layer fog-layer-2"></div>
    
    <div class="start-content">
      <h1 class="game-title text-shadow">雾城重逢</h1>
      <p class="game-subtitle text-shadow">在雾散之前，找回那些遗失的记忆...</p>
      
      <div class="story-intro">
        <p>五年前，你在雾城火车站与她告别。</p>
        <p>她说："我会等你的。"</p>
        <p>五年后，你回到这座城市，</p>
        <p>雾气依旧弥漫，那个人是否还在原地等待？</p>
      </div>

      <div class="game-rules">
        <div class="rules-title">游戏规则</div>
        <ul>
          <li>⏱️ 在5分钟内寻找散落在各处的旧物</li>
          <li>💫 每找到一件物品，都会触发一段回忆</li>
          <li>✨ 跨场景收集线索，合成关键道具解锁隐藏回忆</li>
          <li>🗺️ 点击场景名称可以切换不同地点</li>
          <li>💾 游戏会自动保存，结局与回忆永久记录在档案中</li>
        </ul>
      </div>

      <div class="challenge-banner" v-if="todayDate">
        <div class="challenge-banner-header">
          <span class="cb-icon">🎯</span>
          <span class="cb-title">纪念日挑战</span>
          <span class="cb-date">{{ todayDate }}</span>
        </div>
        <div class="challenge-banner-body">
          <p class="cb-desc">每日随机物品位置与神秘提示文案，挑战你的观察力！</p>
          <div class="cb-stats">
            <span v-if="challengeStreak > 0" class="cb-stat">
              🔥 连续 {{ challengeStreak }} 天
            </span>
            <span class="cb-stat">
              🎖️ {{ badgesCount }}/{{ totalBadges }} 徽章
            </span>
          </div>
        </div>
      </div>

      <div class="start-buttons">
        <button v-if="hasSave" class="btn btn-secondary" @click="continueGame">
          继续游戏
        </button>
        <button v-if="hasSave" class="btn btn-outline" @click="newGame">
          重新开始
        </button>
        <button v-else class="btn btn-primary" @click="startNewGame">
          开始游戏
        </button>
        <button class="btn btn-challenge" @click="startChallenge">
          🎯 纪念日挑战模式
        </button>
        <button class="btn btn-map-explore" @click="startMapExplore">
          🗺️ 雾城地图探索
        </button>
        <button class="btn btn-prologue" @click="startPrologue">
          🌫️ 序章 · 最后一天
        </button>
        <div class="btn-row">
          <button v-if="hasArchive" class="btn btn-archive half-btn" @click="openArchive">
            📖 回忆档案 ({{ archiveSummary }})
          </button>
          <button class="btn btn-memory-archive half-btn" @click="openMemoryArchive">
            🏛️ 回忆档案馆
          </button>
          <button class="btn btn-collection half-btn" @click="openCollectionRoom">
            🏺 收藏室 ({{ collectionProgress }}%)
          </button>
          <button class="btn btn-leaderboard half-btn" @click="openLeaderboard">
            🏆 排行榜
          </button>
          <button class="btn btn-badges half-btn" @click="openBadges">
            🎖️ 徽章 ({{ badgesCount }})
          </button>
        </div>
      </div>

      <div class="version-info">v1.2.0 纪念日挑战版 | 雾城工作室</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSaveStore } from '../stores/saveStore'
import { useArchiveStore } from '../stores/archiveStore'
import { useChallengeStore } from '../stores/challengeStore'
import { useMapStore } from '../stores/mapStore'
import { usePrologueStore } from '../stores/prologueStore'
import { useCollectionStore } from '../stores/collectionStore'

const gameStore = useGameStore()
const saveStore = useSaveStore()
const archiveStore = useArchiveStore()
const challengeStore = useChallengeStore()
const mapStore = useMapStore()
const prologueStore = usePrologueStore()
const collectionStore = useCollectionStore()

const hasSave = saveStore.hasSave

const collectionProgress = computed(() => collectionStore.overallProgress)

const hasArchive = computed(() => archiveStore.hasArchive)

const archiveSummary = computed(() => {
  const endings = archiveStore.unlockedEndings.length
  const hm = archiveStore.everUnlockedHiddenMemories.length
  const branches = archiveStore.branchSaves.length
  const parts = []
  if (endings > 0) parts.push(`${endings}结局`)
  if (hm > 0) parts.push(`${hm}回忆`)
  if (branches > 0) parts.push(`${branches}存档`)
  return parts.length > 0 ? parts.join('/') : ''
})

const todayDate = computed(() => challengeStore.todayDate)
const challengeStreak = computed(() => challengeStore.challengeStreak)
const badgesCount = computed(() => challengeStore.unlockedBadgesCount)
const totalBadges = computed(() => challengeStore.totalBadgesCount)

onMounted(() => {
  saveStore.checkHasSave()
  archiveStore.init()
  challengeStore.init()
})

function startNewGame() {
  gameStore.resetGame()
  gameStore.startGame()
}

function continueGame() {
  gameStore.startGame()
}

function newGame() {
  if (confirm('确定要开始新游戏吗？当前进度将会丢失。')) {
    gameStore.resetGame()
    gameStore.startGame()
  }
}

function startChallenge() {
  if (confirm('纪念日挑战模式：每日物品位置随机、提示文案神秘化。确定开始挑战？')) {
    gameStore.startChallengeGame()
  }
}

function openArchive() {
  gameStore.openArchive()
}

function openMemoryArchive() {
  gameStore.openMemoryArchive()
}

function openLeaderboard() {
  challengeStore.openLeaderboard()
}

function openBadges() {
  challengeStore.openBadges()
}

function openCollectionRoom() {
  collectionStore.openCollectionRoom()
}

function startMapExplore() {
  mapStore.resetMap()
  mapStore.enterMapMode()
}

function startPrologue() {
  prologueStore.startPrologue()
}
</script>

<style scoped>
.start-scene {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
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
  background: radial-gradient(ellipse at center, rgba(200, 200, 220, 0.1) 0%, transparent 70%);
  animation: fog 10s ease-in-out infinite;
  pointer-events: none;
}

.fog-layer-2 {
  animation-delay: -5s;
  opacity: 0.7;
}

.start-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.game-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.5rem;
  color: #e8e8f0;
  margin-bottom: 0.5rem;
  animation: float 4s ease-in-out infinite;
}

.game-subtitle {
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  color: #a0a0b0;
  margin-bottom: 2rem;
  letter-spacing: 0.2rem;
}

.story-intro {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  line-height: 2;
  color: #c0c0d0;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.story-intro p {
  margin: 0.5rem 0;
}

.game-rules {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.rules-title {
  font-size: clamp(0.9rem, 2.8vw, 1rem);
  color: #d4a574;
  margin-bottom: 0.8rem;
  text-align: center;
  letter-spacing: 0.1rem;
}

.game-rules ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.game-rules li {
  padding: 0.4rem 0;
  color: #b0b0c0;
  font-size: clamp(0.8rem, 2.3vw, 0.9rem);
  line-height: 1.6;
}

.challenge-banner {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.1));
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  animation: bannerGlow 3s ease-in-out infinite;
}

@keyframes bannerGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.1); }
  50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.25); }
}

.challenge-banner-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
}

.cb-icon {
  font-size: 1.3rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(10deg); }
}

.cb-title {
  color: #fbbf24;
  font-weight: 600;
  font-size: clamp(0.95rem, 3vw, 1.05rem);
  letter-spacing: 0.1rem;
}

.cb-date {
  color: #a0a0b0;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
}

.challenge-banner-body {
  text-align: center;
}

.cb-desc {
  color: #d4c4a8;
  font-size: clamp(0.8rem, 2.3vw, 0.9rem);
  margin: 0 0 0.6rem 0;
  line-height: 1.5;
}

.cb-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cb-stat {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #e8e8f0;
}

.start-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.btn-row {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.half-btn {
  flex: 1;
  min-width: calc(50% - 0.3rem);
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

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
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

.btn-challenge {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
  animation: challengePulse 2.5s ease-in-out infinite;
}

@keyframes challengePulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(245, 158, 11, 0.6), 0 0 30px rgba(239, 68, 68, 0.3); }
}

.btn-challenge:hover {
  transform: translateY(-2px) scale(1.02);
}

.btn-map-explore {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-map-explore:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.btn-prologue {
  background: linear-gradient(135deg, #c084fc 0%, #818cf8 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(192, 132, 252, 0.4);
  animation: prologuePulse 3s ease-in-out infinite;
}

@keyframes prologuePulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(192, 132, 252, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(192, 132, 252, 0.6), 0 0 30px rgba(129, 140, 248, 0.3); }
}

.btn-prologue:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 25px rgba(192, 132, 252, 0.5);
}

.btn-archive {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.15));
  border: 1px solid rgba(212, 165, 116, 0.4);
  color: #e8c89a;
}

.btn-archive:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.25));
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
  transform: translateY(-2px);
}

.btn-memory-archive {
  background: linear-gradient(135deg, rgba(96, 165, 150, 0.3), rgba(60, 130, 120, 0.2));
  border: 1px solid rgba(96, 165, 150, 0.4);
  color: #a0d4cc;
}

.btn-memory-archive:hover {
  background: linear-gradient(135deg, rgba(96, 165, 150, 0.5), rgba(60, 130, 120, 0.3));
  box-shadow: 0 4px 15px rgba(96, 165, 150, 0.35);
  transform: translateY(-2px);
}

.btn-collection {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.15));
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fbbf24;
  font-weight: 600;
}

.btn-collection:hover {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.45), rgba(245, 158, 11, 0.25));
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  transform: translateY(-2px);
}

.btn-leaderboard {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(217, 119, 6, 0.2));
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde68a;
}

.btn-leaderboard:hover {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.5), rgba(217, 119, 6, 0.3));
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  transform: translateY(-2px);
}

.btn-badges {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(109, 40, 217, 0.2));
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #ddd6fe;
}

.btn-badges:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(109, 40, 217, 0.3));
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.version-info {
  color: #606070;
  font-size: 0.8rem;
  margin-top: 1rem;
}
</style>
