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
        <button v-if="hasArchive" class="btn btn-archive" @click="openArchive">
          📖 回忆档案 ({{ archiveSummary }})
        </button>
      </div>

      <div class="version-info">v1.1.0 | 雾城工作室</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSaveStore } from '../stores/saveStore'
import { useArchiveStore } from '../stores/archiveStore'

const gameStore = useGameStore()
const saveStore = useSaveStore()
const archiveStore = useArchiveStore()

const hasSave = saveStore.hasSave

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

onMounted(() => {
  saveStore.checkHasSave()
  archiveStore.init()
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

function openArchive() {
  gameStore.openArchive()
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
  margin-bottom: 2rem;
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

.start-buttons {
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

.version-info {
  color: #606070;
  font-size: 0.8rem;
  margin-top: 1rem;
}
</style>
