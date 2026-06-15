<template>
  <div class="prologue-scene" :style="sceneStyle">
    <div class="prologue-fog-layer"></div>
    <div class="prologue-fog-layer fog-delay"></div>

    <Transition name="prologue-complete">
      <div v-if="isComplete" class="prologue-ending" @click="handleEndingClick">
        <div class="ending-particles">
          <div v-for="i in 20" :key="i" class="ending-particle" :style="getEndingParticleStyle(i)"></div>
        </div>
        <div class="ending-content">
          <div class="ending-icon">🌫️</div>
          <h1 class="ending-title">序章 · 最后一天</h1>
          <div class="ending-divider"></div>
          <p class="ending-text">五年前的那个夜晚，火车带走了她，也带走了一半的你。</p>
          <p class="ending-text">你不知道的是，她也带走了一张回程票。</p>
          <p class="ending-text">而你从未说出口的那句话——她一直在等。</p>
          <div class="ending-stats">
            <div class="ending-stat">
              <span class="es-icon">🔍</span>
              <span class="es-label">探索交互</span>
              <span class="es-value">{{ exploredPoints.length }}/{{ totalInteractivePoints }}</span>
            </div>
            <div class="ending-stat">
              <span class="es-icon">🔮</span>
              <span class="es-label">收集伏笔</span>
              <span class="es-value">{{ collectedForeshadowingCount }}/{{ totalForeshadowingCount }}</span>
            </div>
          </div>
          <div v-if="collectedForeshadowingCount > 0" class="foreshadowing-summary">
            <h3 class="fs-title">🔮 伏笔回响</h3>
            <p class="fs-subtitle">这些伏笔将在正篇中迎来回响...</p>
            <div class="fs-grid">
              <div
                v-for="fId in collectedForeshadowings"
                :key="fId"
                class="fs-card"
                @click.stop="showForeshadowingDetail(fId)"
              >
                <span class="fs-card-icon">🔮</span>
                <span class="fs-card-title">{{ getForeshadowingTitle(fId) }}</span>
                <span class="fs-card-arrow">→</span>
              </div>
            </div>
          </div>
          <button class="btn btn-primary prologue-end-btn" @click.stop="finishPrologue">
            进入正篇 · 雾城重逢
          </button>
        </div>
      </div>
    </Transition>

    <template v-if="!isComplete">
      <div class="prologue-header">
        <div class="header-left">
          <span class="prologue-badge">序章</span>
          <span class="scene-time">{{ currentScene?.timeLabel }}</span>
        </div>
        <div class="header-center">
          <div class="scene-progress-bar">
            <div class="scene-progress-fill" :style="{ width: sceneProgress + '%' }"></div>
          </div>
          <span class="progress-label">场景探索 {{ sceneProgress }}%</span>
        </div>
        <div class="header-right">
          <span class="foreshadowing-count" v-if="collectedForeshadowingCount > 0">
            🔮 {{ collectedForeshadowingCount }}
          </span>
          <button class="exit-btn" @click="confirmExit">✕</button>
        </div>
      </div>

      <div class="scene-nav-dots">
        <div
          v-for="(scene, idx) in allScenes"
          :key="scene.id"
          class="nav-dot"
          :class="{
            active: idx === currentSceneIndex,
            completed: idx < currentSceneIndex,
            locked: idx > currentSceneIndex
          }"
          @click="idx <= currentSceneIndex && goToScene(idx)"
        >
          <span class="dot-time">{{ scene.timeLabel }}</span>
        </div>
      </div>

      <Transition name="scene-change" mode="out-in">
        <div :key="currentSceneIndex" class="prologue-content">
          <h2 class="scene-name text-shadow">{{ currentScene?.name }}</h2>
          <p class="scene-desc text-shadow">{{ currentScene?.description }}</p>

          <div class="interactive-area">
            <div
              v-for="point in currentScene?.interactivePoints"
              :key="point.id"
              class="interactive-point"
              :class="{
                explored: isPointExplored(point.id),
                'point-glow': !isPointExplored(point.id),
                'has-foreshadowing': point.foreshadowing && !isPointExplored(point.id)
              }"
              :style="{
                left: point.position.x + '%',
                top: point.position.y + '%',
                width: point.size.width + '%',
                height: point.size.height + '%'
              }"
              @click="handlePointClick(point)"
            >
              <span class="point-icon">{{ point.icon }}</span>
              <span v-if="!isPointExplored(point.id)" class="point-hint">?</span>
              <span v-if="point.foreshadowing && !isPointExplored(point.id)" class="point-foreshadow-hint">🔮</span>
            </div>
          </div>
        </div>
      </Transition>

      <div class="prologue-footer">
        <div v-if="canAdvanceScene && !isLastScene" class="advance-hint" @click="startExitDialogue">
          <span class="advance-icon">→</span>
          <span class="advance-text">继续前行</span>
        </div>
        <div v-if="canAdvanceScene && isLastScene && !isExitDialogueActive" class="advance-hint farewell-hint" @click="startExitDialogue">
          <span class="advance-icon">🌙</span>
          <span class="advance-text">最后的告别</span>
        </div>
        <div v-if="!canAdvanceScene" class="explore-hint">
          <span class="explore-icon">💡</span>
          <span class="explore-text">点击场景中的物品进行探索</span>
        </div>
      </div>

      <Transition name="dialogue-fade">
        <div v-if="isDialogueActive && currentDialogue" class="dialogue-overlay" @click.self="advanceDialogue">
          <div class="dialogue-panel" @click="advanceDialogue">
            <div class="dialogue-speaker" :style="{ color: getSpeakerColor(currentDialogue[currentDialogueIndex]?.speaker) }">
              {{ getSpeakerName(currentDialogue[currentDialogueIndex]?.speaker) }}
            </div>
            <div class="dialogue-text">
              {{ currentDialogue[currentDialogueIndex]?.text }}
            </div>
            <div class="dialogue-indicator">
              <span class="indicator-dot" :class="{ active: true }"></span>
              <span class="indicator-hint">点击继续</span>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="dialogue-fade">
        <div v-if="isExitDialogueActive && currentScene?.exitDialogue" class="dialogue-overlay exit-overlay" @click.self="advanceExitDialogue">
          <div class="dialogue-panel exit-panel" @click="advanceExitDialogue">
            <div class="dialogue-speaker" :style="{ color: getSpeakerColor(currentScene.exitDialogue[exitDialogueIndex]?.speaker) }">
              {{ getSpeakerName(currentScene.exitDialogue[exitDialogueIndex]?.speaker) }}
            </div>
            <div class="dialogue-text">
              {{ currentScene.exitDialogue[exitDialogueIndex]?.text }}
            </div>
            <div class="dialogue-indicator">
              <span class="indicator-dot exit-dot"></span>
              <span class="indicator-hint">点击继续</span>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="foreshadowing-reveal">
        <div v-if="showForeshadowingReveal && currentForeshadowing" class="foreshadowing-overlay" @click.self="closeForeshadowingReveal">
          <div class="foreshadowing-panel" @click="closeForeshadowingReveal">
            <div class="foreshadowing-glow"></div>
            <div class="foreshadowing-icon">🔮</div>
            <h3 class="foreshadowing-title">伏笔 · {{ currentForeshadowing.title }}</h3>
            <div class="foreshadowing-divider"></div>
            <p class="foreshadowing-desc">{{ currentForeshadowing.description }}</p>
            <div class="foreshadowing-connection">
              <span class="fc-icon">🔗</span>
              <span class="fc-text">{{ currentForeshadowing.hint }}</span>
            </div>
            <div class="foreshadowing-close-hint">点击任意处关闭</div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePrologueStore } from '../stores/prologueStore'
import { useGameStore } from '../stores/gameStore'
import { prologueScenes, prologueForeshadowings, prologueDialogueSpeakers } from '../data/prologueData'

const prologueStore = usePrologueStore()
const gameStore = useGameStore()

const currentScene = computed(() => prologueStore.currentScene)
const currentSceneIndex = computed(() => prologueStore.currentSceneIndex)
const allScenes = computed(() => prologueScenes)
const sceneProgress = computed(() => prologueStore.sceneProgress)
const canAdvanceScene = computed(() => prologueStore.canAdvanceScene)
const isLastScene = computed(() => prologueStore.isLastScene)
const isComplete = computed(() => prologueStore.isComplete)

const exploredPoints = computed(() => prologueStore.exploredPoints)
const collectedForeshadowings = computed(() => prologueStore.collectedForeshadowings)
const collectedForeshadowingCount = computed(() => prologueStore.collectedForeshadowingCount)
const totalForeshadowingCount = computed(() => prologueStore.totalForeshadowingCount)

const currentDialogue = computed(() => prologueStore.currentDialogue)
const currentDialogueIndex = computed(() => prologueStore.currentDialogueIndex)
const isDialogueActive = computed(() => prologueStore.isDialogueActive)
const isExitDialogueActive = computed(() => prologueStore.isExitDialogueActive)
const exitDialogueIndex = computed(() => prologueStore.exitDialogueIndex)

const showForeshadowingReveal = computed(() => prologueStore.showForeshadowingReveal)
const currentForeshadowing = computed(() => prologueStore.currentForeshadowing)

const totalInteractivePoints = computed(() => {
  return prologueScenes.reduce((sum, s) => sum + s.interactivePoints.length, 0)
})

const sceneStyle = computed(() => ({
  background: currentScene.value?.backgroundStyle || 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)'
}))

function handlePointClick(point) {
  if (prologueStore.isPointExplored(point.id)) return
  prologueStore.explorePoint(point.id)
}

function advanceDialogue() {
  prologueStore.advanceDialogue()
}

function startExitDialogue() {
  prologueStore.startExitDialogue()
}

function advanceExitDialogue() {
  prologueStore.advanceExitDialogue()
}

function closeForeshadowingReveal() {
  prologueStore.closeForeshadowingReveal()
}

function isPointExplored(pointId) {
  return prologueStore.isPointExplored(pointId)
}

function goToScene(idx) {
  if (idx <= prologueStore.currentSceneIndex) {
    prologueStore.currentSceneIndex = idx
  }
}

function getSpeakerName(speaker) {
  return prologueDialogueSpeakers[speaker]?.name || speaker
}

function getSpeakerColor(speaker) {
  return prologueDialogueSpeakers[speaker]?.color || '#a0a0b0'
}

function getForeshadowingTitle(fId) {
  const f = prologueForeshadowings.find(item => item.id === fId)
  return f ? f.title : '???'
}

function showForeshadowingDetail(fId) {
  prologueStore.revealForeshadowing(fId)
}

function confirmExit() {
  if (confirm('确定要退出序章吗？当前进度不会保存。')) {
    prologueStore.exitPrologue()
    gameStore.returnToStart()
  }
}

function handleEndingClick() {}

function finishPrologue() {
  prologueStore.exitPrologue()
  gameStore.resetGame()
  gameStore.startGame()
}

function getEndingParticleStyle(index) {
  const seed = index * 37
  const left = (seed * 17) % 100
  const delay = (seed * 7) % 8
  const duration = 5 + (seed % 6)
  const size = 4 + (seed % 6)
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}
</script>

<style scoped>
.prologue-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: background 1.5s ease;
}

.prologue-fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(200, 200, 220, 0.12) 0%, transparent 70%);
  animation: prologueFog 14s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.prologue-fog-layer.fog-delay {
  animation-delay: -7s;
  opacity: 0.7;
}

@keyframes prologueFog {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-25%); }
}

.prologue-header {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prologue-badge {
  padding: 4px 14px;
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.3), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 20px;
  color: #c084fc;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
}

.scene-time {
  color: #a0a0b0;
  font-size: 0.85rem;
  font-family: monospace;
}

.header-center {
  flex: 1;
  max-width: 200px;
  margin: 0 15px;
}

.scene-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.scene-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c084fc, #a78bfa, #818cf8);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-label {
  display: block;
  text-align: center;
  color: #a0a0b0;
  font-size: 0.7rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.foreshadowing-count {
  padding: 4px 10px;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  color: #fbbf24;
  font-size: 0.8rem;
}

.exit-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #a0a0b0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.exit-btn:hover {
  background: rgba(200, 100, 100, 0.3);
  border-color: rgba(200, 100, 100, 0.5);
  color: #f0a0a0;
}

.scene-nav-dots {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 8px 20px;
}

.nav-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot::before {
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.nav-dot.active::before {
  background: #c084fc;
  border-color: #c084fc;
  box-shadow: 0 0 10px rgba(192, 132, 252, 0.5);
}

.nav-dot.completed::before {
  background: #818cf8;
  border-color: #818cf8;
}

.nav-dot.locked::before {
  opacity: 0.3;
}

.nav-dot.locked {
  cursor: default;
}

.dot-time {
  color: #707080;
  font-size: 0.65rem;
  font-family: monospace;
}

.nav-dot.active .dot-time {
  color: #c084fc;
}

.nav-dot.completed .dot-time {
  color: #818cf8;
}

.prologue-content {
  position: relative;
  z-index: 10;
  height: calc(100% - 180px);
  padding: 10px 20px;
  overflow-y: auto;
}

.scene-name {
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: #e8e8f0;
  text-align: center;
  margin-bottom: 0.4rem;
  font-weight: 400;
  letter-spacing: 0.3rem;
}

.scene-desc {
  font-size: clamp(0.82rem, 2.5vw, 0.95rem);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  max-width: 90%;
  margin: 0 auto 1.5rem;
  line-height: 1.8;
}

.interactive-area {
  position: relative;
  width: 100%;
  height: 55%;
  min-height: 200px;
}

.interactive-point {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid transparent;
}

.interactive-point:not(.explored):hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(192, 132, 252, 0.6);
  transform: scale(1.08);
}

.interactive-point.point-glow {
  animation: pointGlow 2.5s ease-in-out infinite;
}

@keyframes pointGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(192, 132, 252, 0.2); }
  50% { box-shadow: 0 0 20px rgba(192, 132, 252, 0.4); }
}

.interactive-point.has-foreshadowing:not(.explored) {
  border-color: rgba(251, 191, 36, 0.25);
}

.interactive-point.explored {
  opacity: 0.35;
  cursor: default;
  background: rgba(192, 132, 252, 0.08);
  border-color: rgba(192, 132, 252, 0.2);
}

.interactive-point.explored .point-hint {
  display: none;
}

.interactive-point.explored .point-foreshadow-hint {
  display: none;
}

.point-icon {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.5));
}

.point-hint {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: #c084fc;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.point-foreshadow-hint {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  animation: floatHint 2s ease-in-out infinite;
}

@keyframes floatHint {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}

.prologue-footer {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.advance-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1.8rem;
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.25), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 30px;
  color: #c084fc;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: advancePulse 2.5s ease-in-out infinite;
}

@keyframes advancePulse {
  0%, 100% { box-shadow: 0 0 10px rgba(192, 132, 252, 0.2); }
  50% { box-shadow: 0 0 25px rgba(192, 132, 252, 0.4); }
}

.advance-hint:hover {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.35), rgba(168, 85, 247, 0.25));
  transform: translateY(-2px);
}

.farewell-hint {
  background: linear-gradient(135deg, rgba(255, 100, 100, 0.2), rgba(200, 80, 80, 0.12));
  border-color: rgba(255, 150, 150, 0.4);
  color: #f0a0a0;
  animation-name: farewellPulse;
}

@keyframes farewellPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 150, 150, 0.15); }
  50% { box-shadow: 0 0 25px rgba(255, 150, 150, 0.35); }
}

.advance-icon {
  font-size: 1.1rem;
}

.advance-text {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.explore-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.6rem 1.4rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  color: #707080;
  font-size: 0.85rem;
}

.explore-icon {
  font-size: 1rem;
}

.dialogue-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1500;
  padding: 20px;
  cursor: pointer;
}

.dialogue-panel {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(145deg, rgba(30, 25, 50, 0.97), rgba(20, 18, 40, 0.98));
  border-radius: 20px 20px 12px 12px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  animation: dialogueIn 0.4s ease-out;
}

@keyframes dialogueIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exit-panel {
  border-color: rgba(192, 132, 252, 0.25);
  background: linear-gradient(145deg, rgba(35, 25, 55, 0.97), rgba(25, 20, 45, 0.98));
}

.dialogue-speaker {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  margin-bottom: 0.6rem;
}

.dialogue-text {
  color: #d0d0e0;
  font-size: clamp(0.9rem, 2.8vw, 1rem);
  line-height: 2;
  text-indent: 2em;
  text-align: justify;
  margin-bottom: 1rem;
}

.dialogue-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c084fc;
  animation: indicatorPulse 1.5s ease-in-out infinite;
}

.exit-dot {
  background: #f472b6;
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.indicator-hint {
  color: #707080;
  font-size: 0.75rem;
}

.dialogue-fade-enter-active,
.dialogue-fade-leave-active {
  transition: all 0.3s ease;
}

.dialogue-fade-enter-from,
.dialogue-fade-leave-to {
  opacity: 0;
}

.foreshadowing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  cursor: pointer;
}

.foreshadowing-panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: linear-gradient(145deg, rgba(40, 30, 60, 0.98), rgba(25, 18, 45, 0.99));
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
  text-align: center;
  animation: foreshadowingIn 0.5s ease-out;
  overflow: hidden;
}

@keyframes foreshadowingIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.foreshadowing-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.08) 0%, transparent 50%);
  animation: foreshadowingGlow 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes foreshadowingGlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.foreshadowing-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  animation: foreshadowingFloat 2s ease-in-out infinite;
}

@keyframes foreshadowingFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.foreshadowing-title {
  color: #fbbf24;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.15rem;
  margin: 0 0 1rem;
}

.foreshadowing-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent);
  margin: 0 auto 1.2rem;
}

.foreshadowing-desc {
  color: #c0c0d0;
  font-size: 0.95rem;
  line-height: 1.8;
  text-align: justify;
  text-indent: 2em;
  margin-bottom: 1.2rem;
}

.foreshadowing-connection {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 0.8rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: left;
}

.fc-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.fc-text {
  color: #a5b4fc;
  font-size: 0.85rem;
  line-height: 1.6;
}

.foreshadowing-close-hint {
  color: #606070;
  font-size: 0.75rem;
}

.foreshadowing-reveal-enter-active {
  animation: foreshadowingIn 0.5s ease-out;
}

.foreshadowing-reveal-leave-active {
  transition: all 0.3s ease;
}

.foreshadowing-reveal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.scene-change-enter-active,
.scene-change-leave-active {
  transition: all 0.6s ease;
}

.scene-change-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.scene-change-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.prologue-ending {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.ending-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.ending-particle {
  position: absolute;
  bottom: -20px;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.6) 0%, rgba(168, 85, 247, 0.3) 100%);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) translateX(20px);
  }
}

.ending-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 30px 20px;
  max-width: 90vw;
}

.ending-icon {
  font-size: clamp(3rem, 10vw, 4.5rem);
  margin-bottom: 1rem;
  animation: endingFloat 3s ease-in-out infinite;
}

@keyframes endingFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.ending-title {
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 300;
  color: #e8e8f0;
  letter-spacing: 0.3rem;
  margin-bottom: 1rem;
}

.ending-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(192, 132, 252, 0.5), transparent);
  margin: 0 auto 1.5rem;
}

.ending-text {
  color: #c0c0d0;
  font-size: clamp(0.9rem, 2.8vw, 1.05rem);
  line-height: 2.1;
  margin-bottom: 0.6rem;
  text-align: justify;
  text-indent: 2em;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.ending-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1.5rem 0;
}

.ending-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.es-icon {
  font-size: 1.5rem;
}

.es-label {
  color: #a0a0b0;
  font-size: 0.8rem;
}

.es-value {
  color: #e8e8f0;
  font-weight: 600;
  font-size: 1.1rem;
}

.foreshadowing-summary {
  margin: 1.5rem 0;
  text-align: center;
}

.fs-title {
  color: #fbbf24;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
  margin: 0 0 0.3rem;
}

.fs-subtitle {
  color: #808090;
  font-size: 0.82rem;
  margin: 0 0 1rem;
}

.fs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.6rem;
  max-width: 500px;
  margin: 0 auto;
}

.fs-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 0.8rem;
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fs-card:hover {
  background: rgba(251, 191, 36, 0.12);
  border-color: rgba(251, 191, 36, 0.4);
}

.fs-card-icon {
  font-size: 0.9rem;
}

.fs-card-title {
  flex: 1;
  color: #c0c0d0;
  font-size: 0.78rem;
  text-align: left;
}

.fs-card-arrow {
  color: #707080;
  font-size: 0.7rem;
}

.prologue-end-btn {
  margin-top: 1.5rem;
}

.prologue-complete-enter-active {
  animation: prologueCompleteIn 1.5s ease-out;
}

@keyframes prologueCompleteIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.text-shadow {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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
</style>
