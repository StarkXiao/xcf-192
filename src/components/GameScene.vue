<template>
  <div 
    class="game-scene" 
    :style="gameSceneStyle"
    :class="{ 'final-chapter-active': isFinalChapter }"
  >
    <div 
      class="fog-overlay" 
      :style="{ opacity: adjustedFogIntensity }"
    ></div>
    <div 
      class="fog-overlay fog-overlay-2" 
      :style="{ opacity: adjustedFogIntensity * 0.6 }"
    ></div>
    <div 
      v-if="currentChapterAtmosphere?.backgroundTint" 
      class="atmosphere-tint"
      :style="{ background: currentChapterAtmosphere.backgroundTint }"
    ></div>
    
    <div class="game-header">
      <div class="header-left">
        <div class="chapter-indicator">
          <span class="chapter-icon">{{ chapterIcon }}</span>
          <div class="chapter-info">
            <span class="chapter-name">{{ currentChapter?.name }}</span>
            <div class="chapter-progress-mini">
              <div class="mini-progress-fill" :style="{ width: chapterProgress + '%' }"></div>
            </div>
          </div>
        </div>
        <Timer />
      </div>
      <div class="header-center">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: totalProgress + '%' }"></div>
          <span class="progress-text">{{ foundCount }}/{{ totalItems }} · 合成 {{ craftedCount }}/{{ totalCraftable }}</span>
        </div>
      </div>
      <div class="header-right">
        <button class="menu-btn crafting-btn" @click="openCraftingPanel" :title="'旧物合成'">
          ✨
          <span v-if="availableRecipesCount > 0" class="craft-badge">{{ availableRecipesCount }}</span>
        </button>
        <button class="menu-btn" @click="showMenu = !showMenu">
          ⋮
        </button>
      </div>
    </div>

    <div v-if="nextChapter" class="next-chapter-hint">
      <span class="hint-text">
        下一章节：{{ nextChapter.name }}
        <span class="hint-percent">(需 {{ nextChapter.requiredMemoryPercent }}% 回忆完成度)</span>
      </span>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="currentSceneId" class="scene-content">
        <h2 class="scene-title text-shadow">{{ currentScene?.name }}</h2>
        <p class="scene-description text-shadow">{{ currentSceneDescription }}</p>
        
        <div class="scene-items">
          <div
            v-for="item in currentScene?.items"
            :key="item.id"
            class="scene-item"
            :class="{ found: isItemFound(item.id), 'item-glow': !isItemFound(item.id) }"
            :style="{
              left: item.position.x + '%',
              top: item.position.y + '%',
              width: item.size.width + '%',
              height: item.size.height + '%'
            }"
            @click="handleItemClick(item)"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <span v-if="!isItemFound(item.id)" class="item-hint">?</span>
          </div>
        </div>
      </div>
    </Transition>

    <div class="crafted-items-bar" v-if="craftedCount > 0">
      <div class="crafted-bar-label">已合成：</div>
      <div class="crafted-bar-items">
        <div
          v-for="craftId in craftedItems"
          :key="craftId"
          class="crafted-bar-item"
          :class="getCraftedRarityClass(craftId)"
          :title="getCraftedName(craftId)"
        >
          <span class="crafted-bar-icon">{{ getCraftedIcon(craftId) }}</span>
        </div>
      </div>
    </div>

    <div class="scene-nav">
      <button
        v-for="scene in availableScenesFiltered"
        :key="scene.id"
        class="nav-btn"
        :class="{ 'scene-locked': !isSceneAccessible(scene.id) }"
        @click="isSceneAccessible(scene.id) && changeScene(scene.id)"
        :disabled="!isSceneAccessible(scene.id)"
        :title="isSceneAccessible(scene.id) ? '' : '需要完成更多回忆解锁此区域'"
      >
        <span class="nav-arrow">
          {{ isSceneAccessible(scene.id) ? '→' : '🔒' }}
        </span>
        <span class="nav-name">{{ scene.name }}</span>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="showMenu" class="menu-overlay" @click.self="showMenu = false">
        <div class="menu-panel">
          <h3 class="menu-title">游戏菜单</h3>
          <div class="menu-stats">
            <div class="stat-item chapter-stat">
              <span class="stat-label">当前章节</span>
              <span class="stat-value chapter-stat-value">
                <span class="chapter-stat-icon">{{ chapterIcon }}</span>
                {{ currentChapter?.name }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">回忆完成度</span>
              <span class="stat-value">{{ memoryPercent }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">章节进度</span>
              <span class="stat-value">{{ chapterProgress }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已找到物品</span>
              <span class="stat-value">{{ foundCount }}/{{ totalItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已合成道具</span>
              <span class="stat-value craft-stat">{{ craftedCount }}/{{ totalCraftable }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已触发回忆</span>
              <span class="stat-value">{{ triggeredMemories.length }}/{{ totalItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已解锁隐藏回忆</span>
              <span class="stat-value hm-stat">{{ unlockedHMCount }}/{{ totalHMCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">综合完成度</span>
              <span class="stat-value total-stat">{{ totalProgress }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">剩余时间</span>
              <span class="stat-value">{{ formattedTime }}</span>
            </div>
          </div>
          <div class="menu-buttons">
            <button class="menu-btn-item craft-menu-btn" @click="openCraftingFromMenu">
              ✨ 旧物合成工坊
            </button>
            <button class="menu-btn-item" @click="saveAndContinue">
              💾 保存并继续
            </button>
            <button class="menu-btn-item" @click="confirmExit">
              🏠 返回主页
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="foundMessage" class="found-toast">
        <span class="toast-icon">{{ foundMessage.icon }}</span>
        <span class="toast-text">找到了 {{ foundMessage.name }}！</span>
      </div>
    </Transition>

    <MemoryModal />
    <CraftingModal />
    <ChapterNarration />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'
import Timer from './Timer.vue'
import MemoryModal from './MemoryModal.vue'
import CraftingModal from './CraftingModal.vue'
import ChapterNarration from './ChapterNarration.vue'

const gameStore = useGameStore()
const storyStore = useStoryStore()

const showMenu = ref(false)
const foundMessage = ref(null)

const currentSceneId = computed(() => gameStore.currentSceneId)
const currentScene = computed(() => gameStore.currentScene)
const progress = computed(() => gameStore.progress)
const totalProgress = computed(() => gameStore.totalProgress)
const foundCount = computed(() => gameStore.foundCount)
const totalItems = computed(() => gameStore.totalItems)
const craftedCount = computed(() => gameStore.craftedCount)
const totalCraftable = computed(() => gameStore.totalCraftable)
const craftedItems = computed(() => gameStore.craftedItems)
const formattedTime = computed(() => gameStore.formattedTime)
const triggeredMemories = computed(() => gameStore.triggeredMemories)

const memoryPercent = computed(() => gameStore.memoryPercent)
const currentChapter = computed(() => gameStore.currentChapter)
const nextChapter = computed(() => gameStore.nextChapter)
const chapterProgress = computed(() => gameStore.chapterProgress)
const currentChapterAtmosphere = computed(() => gameStore.currentChapterAtmosphere)
const isFinalChapter = computed(() => gameStore.isFinalChapter)
const currentSceneDescription = computed(() => gameStore.getCurrentSceneDescription())

const unlockedHMCount = computed(() => gameStore.unlockedHiddenMemories.length)
const totalHMCount = computed(() => storyStore.getAllHiddenMemories().length)

const availableRecipesCount = computed(() => {
  const recipes = storyStore.getAllRecipes()
  return recipes.filter(r => gameStore.canCraftItem(r.id)).length
})

const chapterIcon = computed(() => {
  if (!currentChapter.value) return '📖'
  if (currentChapter.value.isFinalChapter) return '🌟'
  const icons = ['🚂', '👣', '☀️', '💍']
  return icons[currentChapter.value.id - 1] || '📖'
})

const adjustedFogIntensity = computed(() => {
  const baseFog = currentScene.value?.fogIntensity || 0.5
  const multiplier = currentChapterAtmosphere.value?.fogMultiplier || 1
  return Math.max(0, Math.min(1, baseFog * multiplier))
})

const gameSceneStyle = computed(() => {
  const style = {
    background: currentScene.value?.backgroundStyle
  }
  if (currentChapterAtmosphere.value) {
    if (currentChapterAtmosphere.value.brightness) {
      style.filter = `brightness(${currentChapterAtmosphere.value.brightness}) saturate(${currentChapterAtmosphere.value.saturation || 1})`
    }
  }
  return style
})

const availableScenes = computed(() => {
  return storyStore.getAvailableScenes(currentSceneId.value)
})

const availableScenesFiltered = computed(() => {
  return gameStore.getAvailableScenesForChapter()
})

function isSceneAccessible(sceneId) {
  return gameStore.isSceneAccessible(sceneId)
}

function isItemFound(itemId) {
  return gameStore.isItemFound(itemId)
}

function handleItemClick(item) {
  if (!isItemFound(item.id)) {
    gameStore.findItem(item.id)
    showFoundMessage(item)
  }
}

function showFoundMessage(item) {
  foundMessage.value = item
  setTimeout(() => {
    foundMessage.value = null
  }, 2000)
}

function changeScene(sceneId) {
  gameStore.changeScene(sceneId)
}

function openCraftingPanel() {
  gameStore.openCrafting()
}

function openCraftingFromMenu() {
  showMenu.value = false
  gameStore.openCrafting()
}

function saveAndContinue() {
  gameStore.saveProgress()
  showMenu.value = false
}

function confirmExit() {
  if (confirm('确定要返回主页吗？进度已自动保存。')) {
    gameStore.returnToStart()
  }
}

function getCraftedIcon(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? item.icon : '❓'
}

function getCraftedName(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? item.name : '未知'
}

function getCraftedRarityClass(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? `bar-rarity-${item.rarity}` : ''
}
</script>

<style scoped>
.game-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease;
}

.fog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 50%, rgba(220, 220, 240, 0.4) 0%, transparent 60%);
  animation: fog 15s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.fog-overlay-2 {
  animation-delay: -8s;
  background: radial-gradient(ellipse at 70% 40%, rgba(200, 200, 230, 0.3) 0%, transparent 50%);
}

.game-header {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  gap: 10px;
}

.header-left,
.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-center {
  flex: 1;
  max-width: 300px;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #d4a574);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.menu-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.menu-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.crafting-btn {
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.2));
  border-color: rgba(212, 165, 116, 0.4);
}

.crafting-btn:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.3));
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.3);
}

.craft-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badge-pulse 1.5s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.scene-content {
  position: relative;
  z-index: 10;
  height: calc(100% - 240px);
  padding: 20px;
}

.scene-title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: #fff;
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
}

.scene-description {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 90%;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.scene-items {
  position: relative;
  width: 100%;
  height: 60%;
}

.scene-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
}

.scene-item:not(.found):hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 200, 100, 0.6);
  transform: scale(1.1);
}

.scene-item.found {
  opacity: 0.4;
  cursor: default;
  background: rgba(100, 200, 100, 0.1);
  border-color: rgba(100, 200, 100, 0.3);
}

.item-icon {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}

.item-hint {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #d4a574;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
}

.scene-item.found .item-hint {
  display: none;
}

.crafted-items-bar {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.crafted-bar-label {
  color: #a0a0b0;
  font-size: 0.75rem;
  white-space: nowrap;
}

.crafted-bar-items {
  display: flex;
  gap: 4px;
}

.crafted-bar-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.crafted-bar-item:hover {
  transform: scale(1.15);
}

.crafted-bar-item.bar-rarity-legendary {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.crafted-bar-item.bar-rarity-epic {
  background: rgba(192, 132, 252, 0.15);
  border-color: rgba(192, 132, 252, 0.4);
  box-shadow: 0 0 8px rgba(192, 132, 252, 0.2);
}

.crafted-bar-item.bar-rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
}

.crafted-bar-icon {
  font-size: 1.1rem;
}

.scene-nav {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 15px;
  max-width: 100%;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 25px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  font-size: clamp(0.8rem, 2.3vw, 0.95rem);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-btn:hover {
  background: rgba(102, 126, 234, 0.6);
  border-color: rgba(102, 126, 234, 0.8);
  transform: translateY(-2px);
}

.nav-arrow {
  font-size: 1rem;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  padding: 20px;
}

.menu-panel {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.98));
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.menu-title {
  color: #e8e8f0;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.menu-stats {
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: #a0a0b0;
  font-size: 0.88rem;
}

.stat-value {
  color: #e8e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-value.craft-stat {
  color: #d4a574;
}

.stat-value.hm-stat {
  color: #fbbf24;
}

.stat-value.total-stat {
  color: #667eea;
  font-size: 1rem;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.menu-btn-item {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-btn-item:hover {
  background: rgba(102, 126, 234, 0.4);
}

.craft-menu-btn {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.2));
  border: 1px solid rgba(212, 165, 116, 0.3);
  color: #e8c89a;
}

.craft-menu-btn:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.3));
}

.found-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(100, 200, 100, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  color: white;
  font-weight: 600;
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-icon {
  font-size: 1.5rem;
}

.atmosphere-tint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  transition: background 1s ease;
}

.chapter-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 8px;
}

.final-chapter-active .chapter-indicator {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.3);
  animation: finalChapterPulse 2s ease-in-out infinite;
}

@keyframes finalChapterPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
}

.chapter-icon {
  font-size: 1.2rem;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #d4a574;
  white-space: nowrap;
}

.final-chapter-active .chapter-name {
  color: #ffd700;
}

.chapter-progress-mini {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a574, #ffd700);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.next-chapter-hint {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: hintFloat 3s ease-in-out infinite;
}

@keyframes hintFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}

.hint-text {
  font-size: 0.72rem;
  color: #a0a0b0;
}

.hint-percent {
  color: #d4a574;
  font-weight: 600;
  margin-left: 4px;
}

.nav-btn.scene-locked {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(100, 100, 120, 0.4);
}

.nav-btn.scene-locked:hover {
  background: rgba(100, 100, 120, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
  transform: none;
}

.nav-btn.scene-locked .nav-arrow {
  opacity: 0.7;
}

.chapter-stat {
  border-top: 1px solid rgba(212, 165, 116, 0.2);
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.chapter-stat-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d4a574;
}

.final-chapter-active .chapter-stat-value {
  color: #ffd700;
}

.chapter-stat-icon {
  font-size: 1.1rem;
}
</style>
