<template>
  <Transition name="radio-modal">
    <div v-if="isRadioOpen" class="radio-modal-overlay" @click.self="handleClose">
      <div class="radio-player" :class="{ 'static-noise': showStatic }">
        <div class="radio-header">
          <div class="radio-brand">
            <span class="radio-icon">{{ radioStation.icon }}</span>
            <div class="radio-info">
              <span class="station-name">{{ radioStation.name }}</span>
              <span class="station-tagline">{{ radioStation.tagline }}</span>
            </div>
          </div>
          <button class="close-btn" @click="handleClose">✕</button>
        </div>

        <div class="radio-display">
          <div class="frequency-display">
            <span class="freq-value">{{ frequency.toFixed(1) }}</span>
            <span class="freq-unit">MHz</span>
          </div>
          <div class="tuning-bar">
            <div class="tuning-scale">
              <span v-for="f in freqMarkers" :key="f" class="scale-mark">{{ f }}</span>
            </div>
            <div class="tuning-pointer" :style="{ left: pointerPosition + '%' }"></div>
          </div>
        </div>

        <div class="radio-controls">
          <div class="tuning-knob-section">
            <button class="tune-btn tune-left" @click="tuneLeft" :disabled="isTuning">◀</button>
            <div class="knob-container">
              <div class="knob" :style="{ transform: `rotate(${knobRotation}deg)` }">
                <div class="knob-line"></div>
              </div>
            </div>
            <button class="tune-btn tune-right" @click="tuneRight" :disabled="isTuning">▶</button>
          </div>

          <div class="volume-section">
            <span class="volume-label">音量</span>
            <input 
              type="range" 
              class="volume-slider" 
              min="0" 
              max="100" 
              v-model.number="volumePercent"
            >
            <span class="volume-value">{{ volumePercent }}%</span>
          </div>
        </div>

        <div class="program-section">
          <div class="section-title">
            <span>🎙️ 节目单</span>
            <span class="program-count">{{ unlockedPrograms.length }} / {{ totalPrograms }}</span>
          </div>
          <div class="program-list">
            <div 
              v-for="program in allProgramsWithStatus" 
              :key="program.id"
              class="program-item"
              :class="{ 
                active: currentProgramId === program.id,
                unlocked: program.unlocked,
                locked: !program.unlocked
              }"
              @click="program.unlocked && selectProgram(program.id)"
            >
              <span class="program-icon">{{ program.icon }}</span>
              <div class="program-info">
                <span class="program-name">{{ program.name }}</span>
                <span class="program-time">{{ program.timeSlot }}</span>
              </div>
              <span v-if="!program.unlocked" class="lock-icon">🔒</span>
              <span v-if="program.unlocked && program.heard" class="heard-icon">✓</span>
            </div>
          </div>
        </div>

        <div v-if="currentProgram" class="content-section">
          <div class="section-title">
            <span>{{ getSectionIcon(currentProgram.type) }} {{ currentProgram.name }}</span>
            <span v-if="currentProgramContents.length > 0" class="content-count">
              {{ currentProgramContents.filter(c => c.heard || c.completed).length }} / {{ currentProgramContents.length }}
            </span>
          </div>

          <div class="content-list">
            <div 
              v-for="content in currentProgramContents" 
              :key="content.id"
              class="content-item"
              :class="{ 
                active: currentContentId === content.id && isPlaying,
                unlocked: content.unlocked,
                locked: !content.unlocked,
                heard: content.heard || content.completed
              }"
              @click="handleContentClick(content)"
            >
              <span class="content-status-dot"></span>
              <div class="content-info">
                <span class="content-title">{{ content.title || content.name }}</span>
                <span class="content-desc">{{ content.description }}</span>
              </div>
              <span v-if="!content.unlocked" class="lock-icon">🔒</span>
              <span v-else-if="content.heard || content.completed" class="played-icon">⏹</span>
              <span v-else class="play-icon">▶</span>
            </div>
          </div>
        </div>

        <div v-if="currentContent && isPlaying" class="playback-section">
          <div class="now-playing">
            <span class="np-label">正在播出</span>
            <span class="np-title">{{ currentContent.title || currentContent.name }}</span>
          </div>

          <div class="subtitle-box">
            <p class="subtitle-text">{{ currentSubtitle }}</p>
          </div>

          <div class="playback-controls">
            <button class="pb-btn" @click="prevLine" :disabled="currentLineIndex === 0">⏮</button>
            <button class="pb-btn play-pause" @click="togglePlayPause">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button class="pb-btn" @click="nextLine" :disabled="isLastLine">⏭</button>
          </div>

          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: subtitleProgress + '%' }"></div>
            </div>
            <span class="progress-text">{{ currentLineIndex + 1 }} / {{ totalLines }}</span>
          </div>

          <div v-if="currentContentType === 'quest' && !isQuestCompleted" class="quest-info">
            <div class="quest-header">
              <span>📋 任务进度</span>
              <span class="quest-reward">奖励: {{ currentQuestReward }}</span>
            </div>
            <div class="quest-steps">
              <div 
                v-for="step in currentQuestSteps" 
                :key="step.id"
                class="quest-step"
                :class="{ done: isStepCompleted(step.id) }"
              >
                <span class="step-icon">{{ isStepCompleted(step.id) ? '✓' : '○' }}</span>
                <span class="step-text">{{ step.text }}</span>
              </div>
            </div>
            <button 
              v-if="!isQuestActive && !isQuestCompleted" 
              class="accept-quest-btn"
              @click="handleAcceptQuest"
            >
              接受任务
            </button>
          </div>
        </div>

        <div v-if="showStatic" class="static-overlay"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import { useGameStore } from '../stores/gameStore'
import { RADIO_PROGRAMS, isProgramUnlocked, isMemoryFragmentUnlocked, isRumorUnlocked, isQuestUnlocked, getMemoryFragmentsByProgram, getCityRumorsByProgram, getRadioQuestsByProgram, getRadioStoriesByProgram, getRadioAtmosphereByProgram } from '../data/radioData'

const radioStore = useRadioStore()
const gameStore = useGameStore()

const emit = defineEmits(['close'])

const isRadioOpen = computed(() => radioStore.isRadioOpen)
const isPlaying = computed(() => radioStore.isPlaying)
const currentProgramId = computed(() => radioStore.currentProgramId)
const currentContentId = computed(() => radioStore.currentContentId)
const currentContentType = computed(() => radioStore.currentContentType)
const currentLineIndex = computed(() => radioStore.currentLineIndex)
const volume = computed(() => radioStore.volume)
const frequency = computed(() => radioStore.frequency)
const isTuning = computed(() => radioStore.isTuning)
const showStatic = computed(() => radioStore.showStatic)
const radioStation = computed(() => radioStore.radioStation)
const currentProgram = computed(() => radioStore.currentProgram)
const currentContent = computed(() => radioStore.currentContent)

const totalPrograms = RADIO_PROGRAMS.length

const gameStateSnapshot = computed(() => ({
  currentChapterId: gameStore.currentChapterId,
  foundItems: gameStore.foundItems,
  triggeredMemories: gameStore.triggeredMemories,
  moodStateId: gameStore.moodStateId,
  visitedScenes: radioStore.visitedScenes
}))

const unlockedPrograms = computed(() => {
  return RADIO_PROGRAMS.filter(p => isProgramUnlocked(p, gameStateSnapshot.value))
})

const allProgramsWithStatus = computed(() => {
  return RADIO_PROGRAMS.map(program => {
    const isUnlocked = isProgramUnlocked(program, gameStateSnapshot.value)
    const contents = getProgramContentsList(program.id, program.type)
    const heardCount = contents.filter(c => c.heard || c.completed).length

    return {
      ...program,
      unlocked: isUnlocked,
      heard: heardCount > 0
    }
  })
})

const currentProgramContents = computed(() => {
  if (!currentProgramId.value) return []
  const program = currentProgram.value
  if (!program) return []

  const contents = getProgramContentsList(program.id, program.type)
  return contents
})

function getProgramContentsList(programId, type) {
  const gameState = gameStateSnapshot.value

  switch (type) {
    case 'memory':
      return getMemoryFragmentsByProgram(programId).map(m => ({
        ...m,
        type: 'memory',
        unlocked: isMemoryFragmentUnlocked(m, gameState),
        heard: radioStore.heardMemoryFragments.includes(m.id)
      }))
    case 'rumor':
      return getCityRumorsByProgram(programId).map(r => ({
        ...r,
        type: 'rumor',
        unlocked: isRumorUnlocked(r, gameState),
        heard: radioStore.heardRumors.includes(r.id)
      }))
    case 'quest':
      return getRadioQuestsByProgram(programId).map(q => ({
        ...q,
        type: 'quest',
        unlocked: isQuestUnlocked(q, gameState),
        active: radioStore.activeQuests.includes(q.id),
        completed: radioStore.completedQuests.includes(q.id)
      }))
    case 'story':
      return getRadioStoriesByProgram(programId).map(s => ({
        ...s,
        type: 'story',
        unlocked: isQuestUnlocked(s, gameState),
        heard: radioStore.heardStories.includes(s.id)
      }))
    case 'atmosphere':
      return (getRadioAtmosphereByProgram ? getRadioAtmosphereByProgram(programId) : []).map(a => ({
        ...a,
        type: 'atmosphere',
        unlocked: isQuestUnlocked(a, gameState)
      }))
    default:
      return []
  }
}

const volumePercent = computed({
  get: () => Math.round(radioStore.volume * 100),
  set: (val) => { radioStore.volume = val / 100 }
})

const freqMarkers = [88, 92, 96, 100, 104, 108]

const pointerPosition = computed(() => {
  const min = 88
  const max = 108
  return ((frequency.value - min) / (max - min)) * 100
})

const knobRotation = computed(() => {
  const min = 88
  const max = 108
  const range = max - min
  const progress = (frequency.value - min) / range
  return -120 + progress * 240
})

function getSectionIcon(type) {
  const icons = {
    memory: '🎵',
    rumor: '👻',
    quest: '🌙',
    story: '💌',
    atmosphere: '☕'
  }
  return icons[type] || '📻'
}

const currentSubtitle = computed(() => {
  if (!currentContent.value) return ''
  const lines = getContentLines()
  return lines[currentLineIndex.value] || ''
})

const totalLines = computed(() => {
  if (!currentContent.value) return 0
  return getContentLines().length
})

const isLastLine = computed(() => {
  return currentLineIndex.value >= totalLines.value - 1
})

const subtitleProgress = computed(() => {
  if (totalLines.value <= 1) return 100
  return (currentLineIndex.value / (totalLines.value - 1)) * 100
})

function getContentLines() {
  const content = currentContent.value
  if (!content) return []
  if (content.voiceLines) return content.voiceLines
  if (content.lines) return content.lines
  if (content.description) return [content.description]
  return []
}

const isQuestActive = computed(() => {
  if (currentContentType.value !== 'quest') return false
  return radioStore.activeQuests.includes(currentContentId.value)
})

const isQuestCompleted = computed(() => {
  if (currentContentType.value !== 'quest') return false
  return radioStore.completedQuests.includes(currentContentId.value)
})

const currentQuestSteps = computed(() => {
  if (!currentContent.value || currentContentType.value !== 'quest') return []
  return currentContent.value.progressSteps || []
})

const currentQuestReward = computed(() => {
  if (!currentContent.value || currentContentType.value !== 'quest') return ''
  return currentContent.value.reward?.description || '神秘奖励'
})

function isStepCompleted(stepId) {
  if (!currentContentId.value) return false
  const progress = radioStore.getQuestProgress(currentContentId.value)
  return progress.completedSteps.includes(stepId)
}

function selectProgram(programId) {
  radioStore.selectProgram(programId)
}

function handleContentClick(content) {
  if (!content.unlocked) return

  if (content.type === 'quest') {
    radioStore.playContent(content.id, content.type)
  } else {
    radioStore.playContent(content.id, content.type)
  }
}

function handleAcceptQuest() {
  if (currentContentId.value) {
    radioStore.acceptQuest(currentContentId.value)
  }
}

function tuneLeft() {
  radioStore.tuneFrequency(-0.2)
}

function tuneRight() {
  radioStore.tuneFrequency(0.2)
}

function togglePlayPause() {
  radioStore.togglePlayPause()
}

function nextLine() {
  radioStore.nextLine()
}

function prevLine() {
  radioStore.prevLine()
}

function handleClose() {
  radioStore.closeRadio()
  emit('close')
}

let autoPlayInterval = null

watch(isPlaying, (newVal) => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }

  if (newVal && !isLastLine.value) {
    autoPlayInterval = setInterval(() => {
      if (!isLastLine.value) {
        radioStore.nextLine()
      } else {
        clearInterval(autoPlayInterval)
        autoPlayInterval = null
      }
    }, 3000)
  }
})

watch(currentContentId, () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
  if (isPlaying.value && !isLastLine.value) {
    autoPlayInterval = setInterval(() => {
      if (!isLastLine.value) {
        radioStore.nextLine()
      } else {
        clearInterval(autoPlayInterval)
        autoPlayInterval = null
      }
    }, 3000)
  }
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.radio-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.radio-player {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #2a1f1a 0%, #1a1410 50%, #0d0a08 100%);
  border: 3px solid #4a3528;
  border-radius: 16px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 200, 150, 0.1);
  position: relative;
  overflow: hidden;
}

.radio-player::-webkit-scrollbar {
  width: 6px;
}

.radio-player::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.radio-player::-webkit-scrollbar-thumb {
  background: rgba(180, 140, 100, 0.4);
  border-radius: 3px;
}

.radio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(180deg, rgba(80, 60, 45, 0.4) 0%, transparent 100%);
  border-bottom: 1px solid rgba(180, 140, 100, 0.2);
}

.radio-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.radio-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(255, 200, 150, 0.3));
}

.radio-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.station-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #d4a574;
  text-shadow: 0 0 10px rgba(212, 165, 116, 0.3);
}

.station-tagline {
  font-size: 0.75rem;
  color: rgba(212, 165, 116, 0.6);
  font-style: italic;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(180, 140, 100, 0.15);
  color: rgba(212, 165, 116, 0.7);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(180, 140, 100, 0.3);
  color: #d4a574;
}

.radio-display {
  padding: 20px;
  background: 
    radial-gradient(ellipse at center, rgba(20, 30, 25, 0.8) 0%, rgba(10, 15, 12, 0.95) 100%);
  border-bottom: 1px solid rgba(180, 140, 100, 0.15);
}

.frequency-display {
  text-align: center;
  margin-bottom: 12px;
}

.freq-value {
  font-size: 2.5rem;
  font-weight: 300;
  color: #7fff7f;
  font-family: 'Courier New', monospace;
  text-shadow: 
    0 0 10px rgba(127, 255, 127, 0.5),
    0 0 20px rgba(127, 255, 127, 0.3);
  letter-spacing: 2px;
}

.freq-unit {
  font-size: 0.9rem;
  color: rgba(127, 255, 127, 0.6);
  margin-left: 6px;
}

.tuning-bar {
  position: relative;
  height: 40px;
}

.tuning-scale {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  height: 100%;
  align-items: flex-end;
}

.scale-mark {
  font-size: 0.65rem;
  color: rgba(127, 255, 127, 0.5);
  font-family: 'Courier New', monospace;
  position: relative;
}

.scale-mark::before {
  content: '';
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 8px;
  background: rgba(127, 255, 127, 0.4);
}

.tuning-pointer {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  width: 3px;
  height: 36px;
  background: linear-gradient(180deg, #ff6b6b 0%, #cc5555 100%);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
  transition: left 0.2s ease-out;
}

.radio-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(180, 140, 100, 0.15);
  gap: 20px;
}

.tuning-knob-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tune-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(180, 140, 100, 0.3);
  background: linear-gradient(145deg, #3a2a20, #2a1d16);
  color: #d4a574;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tune-btn:hover:not(:disabled) {
  border-color: rgba(180, 140, 100, 0.6);
  box-shadow: 0 0 8px rgba(212, 165, 116, 0.3);
}

.tune-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.knob-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(145deg, #1a1210, #0d0907);
  border: 2px solid #4a3528;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.knob {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(145deg, #5a4030, #3a2820);
  border: 2px solid #6a4a38;
  position: relative;
  transition: transform 0.2s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.knob-line {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 12px;
  background: #d4a574;
  border-radius: 2px;
  box-shadow: 0 0 4px rgba(212, 165, 116, 0.5);
}

.volume-section {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.volume-label {
  font-size: 0.75rem;
  color: rgba(212, 165, 116, 0.6);
  white-space: nowrap;
}

.volume-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(145deg, #d4a574, #a07850);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.volume-value {
  font-size: 0.7rem;
  color: rgba(212, 165, 116, 0.5);
  min-width: 32px;
  text-align: right;
}

.program-section,
.content-section {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(180, 140, 100, 0.1);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #d4a574;
  font-weight: 500;
}

.program-count,
.content-count {
  font-size: 0.7rem;
  color: rgba(212, 165, 116, 0.5);
  font-weight: normal;
}

.program-list,
.content-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.program-item,
.content-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(180, 140, 100, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.program-item:hover.unlocked,
.content-item:hover.unlocked {
  background: rgba(180, 140, 100, 0.1);
  border-color: rgba(180, 140, 100, 0.3);
}

.program-item.active,
.content-item.active {
  background: rgba(212, 165, 116, 0.15);
  border-color: rgba(212, 165, 116, 0.5);
  box-shadow: 0 0 12px rgba(212, 165, 116, 0.1);
}

.program-item.locked,
.content-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.program-icon {
  font-size: 1.3rem;
  width: 28px;
  text-align: center;
}

.content-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(212, 165, 116, 0.3);
  flex-shrink: 0;
}

.content-item.heard .content-status-dot,
.content-item.completed .content-status-dot {
  background: rgba(127, 255, 127, 0.6);
}

.content-item.active .content-status-dot {
  background: #ff9966;
  box-shadow: 0 0 8px rgba(255, 153, 102, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.program-info,
.content-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.program-name {
  font-size: 0.9rem;
  color: #d4c4a8;
  font-weight: 500;
}

.program-time {
  font-size: 0.7rem;
  color: rgba(212, 165, 116, 0.5);
}

.content-title {
  font-size: 0.85rem;
  color: #d4c4a8;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-desc {
  font-size: 0.7rem;
  color: rgba(212, 165, 116, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lock-icon {
  font-size: 0.8rem;
  opacity: 0.7;
}

.heard-icon {
  font-size: 0.8rem;
  color: rgba(127, 255, 127, 0.7);
}

.play-icon,
.played-icon {
  font-size: 0.6rem;
  color: rgba(212, 165, 116, 0.6);
  width: 20px;
  text-align: center;
}

.playback-section {
  padding: 20px;
  background: linear-gradient(180deg, rgba(20, 30, 25, 0.6) 0%, rgba(10, 15, 12, 0.8) 100%);
}

.now-playing {
  text-align: center;
  margin-bottom: 16px;
}

.np-label {
  display: block;
  font-size: 0.7rem;
  color: rgba(127, 255, 127, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.np-title {
  font-size: 1rem;
  color: #d4a574;
  font-weight: 500;
}

.subtitle-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(127, 255, 127, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subtitle-text {
  font-size: 0.95rem;
  color: #e8dcc8;
  text-align: center;
  line-height: 1.6;
  text-shadow: 0 0 10px rgba(232, 220, 200, 0.1);
}

.playback-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
}

.pb-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(180, 140, 100, 0.3);
  background: linear-gradient(145deg, #3a2a20, #2a1d16);
  color: #d4a574;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pb-btn:hover:not(:disabled) {
  border-color: rgba(180, 140, 100, 0.6);
  box-shadow: 0 0 10px rgba(212, 165, 116, 0.2);
}

.pb-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pb-btn.play-pause {
  width: 56px;
  height: 56px;
  font-size: 1.2rem;
  background: linear-gradient(145deg, #5a4030, #3a2820);
  border-color: rgba(180, 140, 100, 0.5);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7fff7f, #d4a574);
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 6px rgba(127, 255, 127, 0.4);
}

.progress-text {
  font-size: 0.7rem;
  color: rgba(212, 165, 116, 0.5);
  min-width: 40px;
  text-align: right;
}

.quest-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(180, 140, 100, 0.2);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.85rem;
  color: #d4a574;
}

.quest-reward {
  font-size: 0.7rem;
  color: rgba(127, 255, 127, 0.7);
  font-weight: normal;
}

.quest-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.quest-step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: rgba(212, 165, 116, 0.6);
}

.quest-step.done {
  color: rgba(127, 255, 127, 0.8);
}

.step-icon {
  width: 18px;
  text-align: center;
  font-size: 0.75rem;
}

.accept-quest-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(145deg, #d4a574, #a07850);
  color: #1a1410;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accept-quest-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.accept-quest-btn:active {
  transform: translateY(0);
}

.static-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
  pointer-events: none;
  animation: staticFlicker 0.1s infinite;
}

@keyframes staticFlicker {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

.radio-modal-enter-active,
.radio-modal-leave-active {
  transition: all 0.3s ease;
}

.radio-modal-enter-from,
.radio-modal-leave-to {
  opacity: 0;
}

.radio-modal-enter-from .radio-player,
.radio-modal-leave-to .radio-player {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 480px) {
  .radio-player {
    max-height: 85vh;
  }
  
  .freq-value {
    font-size: 2rem;
  }
  
  .program-item,
  .content-item {
    padding: 8px 10px;
  }
}
</style>
