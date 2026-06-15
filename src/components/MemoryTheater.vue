<template>
  <Transition name="theater-fade">
    <div v-if="gameStore.showMemoryTheater" class="theater-overlay">
      <div v-if="!currentScript" class="theater-lobby">
        <div class="lobby-header">
          <div class="lobby-title-wrap">
            <span class="lobby-icon">🎬</span>
            <h2 class="lobby-title">雾城记忆剧场</h2>
          </div>
          <p class="lobby-subtitle">重温那些被雾气笼罩的往事</p>
          <button class="lobby-close" @click="closeTheater">✕</button>
        </div>

        <div class="lobby-filters">
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-btn"
            :class="{ active: activeFilter === filter.id }"
            @click="activeFilter = filter.id"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            <span class="filter-label">{{ filter.label }}</span>
            <span class="filter-count">{{ getFilterCount(filter.id) }}</span>
          </button>
        </div>

        <div class="lobby-scripts" v-if="filteredScripts.length > 0">
          <div
            v-for="script in filteredScripts"
            :key="script.memoryId"
            class="script-card"
            :class="[`emotion-${script.emotion}`, { hidden: script.isHidden }]"
            @click="startPlayback(script)"
          >
            <div class="script-bg" :style="{ background: getScriptBg(script) }"></div>
            <div class="script-overlay" :style="{ background: getScriptOverlay(script.emotion) }"></div>
            <div class="script-content">
              <span class="script-emoji">{{ getEmoji(script.emotion) }}</span>
              <span class="script-title">{{ script.title }}</span>
              <span class="script-year">{{ script.year }}</span>
              <span v-if="script.isHidden" class="script-badge">🌟 隐藏</span>
              <span class="script-shots">🎬 {{ script.shots.length }}幕</span>
            </div>
            <div class="script-play-hint">▶ 回放</div>
          </div>
        </div>

        <div class="lobby-empty" v-else>
          <span class="empty-icon">🎬</span>
          <p class="empty-text">还没有可回放的回忆</p>
          <p class="empty-hint">解锁更多回忆后，即可在剧场中回放</p>
        </div>
      </div>

      <div v-else class="theater-stage" :style="{ background: currentShot?.background }">
        <div class="stage-overlay" :style="{ background: currentShot?.overlay }"></div>

        <div class="stage-fog" :class="{ active: shotTransitioning }"></div>

        <div class="stage-effect" :class="currentShot?.effect" v-if="currentShot?.effect"></div>

        <div class="stage-particles" v-if="currentShot?.type === 'opening' || currentShot?.type === 'closing'">
          <div
            v-for="i in 12"
            :key="i"
            class="stage-particle"
            :class="currentShot?.emotion"
            :style="getParticleStyle(i)"
          ></div>
        </div>

        <div class="stage-content" :class="{ transitioning: shotTransitioning }">
          <Transition :name="shotTransition" mode="out-in">
            <div :key="currentShotIndex" class="shot-frame">
              <template v-if="currentShot?.type === 'opening' || currentShot?.type === 'closing' || currentShot?.type === 'transition'">
                <div class="shot-title-scene">
                  <div class="shot-emoji-big" :class="`emotion-${currentShot?.emotion}`">
                    {{ getEmoji(currentShot?.emotion) }}
                  </div>
                  <h2 class="shot-main-title" :class="`emotion-${currentShot?.emotion}`">
                    {{ currentShot?.subtitle }}
                  </h2>
                  <p v-if="currentShot?.subtitleSub" class="shot-sub-title">
                    {{ currentShot.subtitleSub }}
                  </p>
                </div>
              </template>

              <template v-if="currentShot?.type === 'narration'">
                <div class="shot-narration-scene">
                  <div class="narration-text-wrap">
                    <p class="narration-text" :class="`emotion-${currentShot?.emotion}`">
                      <span
                        v-for="(char, idx) in currentShot.narration"
                        :key="idx"
                        class="narration-char"
                        :class="{ visible: idx < displayedCharCount }"
                        :style="{ animationDelay: (idx * 0.04) + 's' }"
                      >{{ char }}</span>
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </Transition>
        </div>

        <Transition name="subtitle-fade" mode="out-in">
          <div
            v-if="currentShot?.type === 'narration' && displayedSubtitle"
            :key="currentShotIndex"
            class="stage-subtitle-bar"
          >
            <div class="subtitle-content">
              <span class="subtitle-text">{{ displayedSubtitle }}</span>
            </div>
          </div>
        </Transition>

        <div class="stage-hud">
          <div class="hud-left">
            <span class="hud-emoji">{{ getEmoji(currentScript?.emotion) }}</span>
            <span class="hud-title">{{ currentScript?.title }}</span>
          </div>
          <div class="hud-center">
            <div class="shot-progress">
              <div class="shot-progress-bar">
                <div class="shot-progress-fill" :style="{ width: shotProgressPercent + '%' }"></div>
              </div>
              <span class="shot-counter">{{ currentShotIndex + 1 }} / {{ totalShots }}</span>
            </div>
          </div>
          <div class="hud-right">
            <button class="hud-btn" @click="toggleAutoPlay" :class="{ active: autoPlay }">
              {{ autoPlay ? '⏸' : '▶' }}
            </button>
            <button class="hud-btn" @click="prevShot" :disabled="currentShotIndex <= 0">◀</button>
            <button class="hud-btn" @click="nextShot" :disabled="currentShotIndex >= totalShots - 1">▶</button>
            <button class="hud-btn hud-close-btn" @click="exitPlayback">✕</button>
          </div>
        </div>

        <div class="stage-emotion-indicator" :class="`emotion-${currentShot?.emotion}`">
          <div class="emotion-pulse"></div>
          <span class="emotion-label">{{ getEmotionLabel(currentShot?.emotion) }}</span>
        </div>

        <div class="stage-click-zone left" @click="prevShot"></div>
        <div class="stage-click-zone right" @click="nextShot"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useMusicStore } from '../stores/musicStore'
import { useStoryStore } from '../stores/storyStore'
import { useArchiveStore } from '../stores/archiveStore'
import { getAvailableTheaterScripts, getEmotionLabel, EMOTION_MUSIC_MAP } from '../data/theaterData'

const gameStore = useGameStore()
const musicStore = useMusicStore()
const storyStore = useStoryStore()
const archiveStore = useArchiveStore()

const currentScript = ref(null)
const currentShotIndex = ref(0)
const autoPlay = ref(true)
const shotTransitioning = ref(false)
const displayedCharCount = ref(0)
const displayedSubtitle = ref('')
const shotProgress = ref(0)
const activeFilter = ref('all')
const shotTransition = ref('shot-fade')

let shotTimer = null
let charTimer = null
let progressTimer = null

const filters = [
  { id: 'all', icon: '🎬', label: '全部' },
  { id: 'normal', icon: '💭', label: '普通回忆' },
  { id: 'hidden', icon: '🌟', label: '隐藏回忆' },
  { id: 'sad', icon: '😢', label: '悲伤' },
  { id: 'warm', icon: '🥰', label: '温暖' },
  { id: 'romantic', icon: '💕', label: '浪漫' }
]

const unlockedMemoryIds = computed(() => gameStore.triggeredMemories)
const unlockedHMIds = computed(() => gameStore.unlockedHiddenMemories)

const allScripts = computed(() => {
  const triggeredMem = [...gameStore.triggeredMemories]
  const triggeredHM = [...gameStore.unlockedHiddenMemories]
  const everTriggered = archiveStore.everTriggeredMemories || []
  const everHM = archiveStore.everUnlockedHiddenMemories || []

  const allMemIds = [...new Set([...triggeredMem, ...everTriggered])]
  const allHMIds = [...new Set([...triggeredHM, ...everHM])]

  return getAvailableTheaterScripts(allMemIds, allHMIds)
})

const filteredScripts = computed(() => {
  const list = allScripts.value
  switch (activeFilter.value) {
    case 'normal': return list.filter(s => !s.isHidden)
    case 'hidden': return list.filter(s => s.isHidden)
    case 'sad': return list.filter(s => ['sad', 'regret', 'melancholy', 'heartbreak'].includes(s.emotion))
    case 'warm': return list.filter(s => ['warm', 'happy', 'sweet', 'touched'].includes(s.emotion))
    case 'romantic': return list.filter(s => ['romantic', 'bittersweet'].includes(s.emotion))
    default: return list
  }
})

const currentShot = computed(() => {
  if (!currentScript.value) return null
  return currentScript.value.shots[currentShotIndex.value] || null
})

const totalShots = computed(() => currentScript.value?.shots.length || 0)

const shotProgressPercent = computed(() => {
  if (totalShots.value === 0) return 0
  return Math.round(((currentShotIndex.value + 1) / totalShots.value) * 100)
})

function getFilterCount(filterId) {
  switch (filterId) {
    case 'all': return allScripts.value.length
    case 'normal': return allScripts.value.filter(s => !s.isHidden).length
    case 'hidden': return allScripts.value.filter(s => s.isHidden).length
    case 'sad': return allScripts.value.filter(s => ['sad', 'regret', 'melancholy', 'heartbreak'].includes(s.emotion)).length
    case 'warm': return allScripts.value.filter(s => ['warm', 'happy', 'sweet', 'touched'].includes(s.emotion)).length
    case 'romantic': return allScripts.value.filter(s => ['romantic', 'bittersweet'].includes(s.emotion)).length
    default: return 0
  }
}

function getEmoji(emotion) {
  const map = {
    sad: '😢', warm: '🥰', pensive: '🤔', happy: '😊',
    sweet: '🍬', nervous: '😰', bittersweet: '😌',
    shocking: '😲', romantic: '💕', regret: '💔',
    melancholy: '🌧️', touched: '🥹', determined: '💪',
    heartbreak: '💔'
  }
  return map[emotion] || '💭'
}

function getScriptBg(script) {
  const bgs = {
    station: 'linear-gradient(135deg, #0a0a1a 0%, #16213e 50%, #1f3460 100%)',
    street: 'linear-gradient(135deg, #1a1a2e 0%, #2c3e50 50%, #34495e 100%)',
    cafe: 'linear-gradient(135deg, #1a150a 0%, #3d2914 50%, #5d4e37 100%)',
    park: 'linear-gradient(135deg, #1a1520 0%, #4a2040 50%, #6a3050 100%)',
    bookstore: 'linear-gradient(135deg, #1a1510 0%, #4a3728 50%, #5a3a1a 100%)',
    lake: 'linear-gradient(135deg, #050510 0%, #0a1530 50%, #102040 100%)',
    void: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)'
  }
  return bgs[script.sceneId] || bgs.void
}

function getScriptOverlay(emotion) {
  const overlays = {
    sad: 'rgba(100,100,150,0.1)', warm: 'rgba(251,191,36,0.08)',
    romantic: 'rgba(244,114,182,0.1)', happy: 'rgba(251,191,36,0.1)',
    sweet: 'rgba(244,114,182,0.08)', melancholy: 'rgba(100,116,139,0.08)',
    regret: 'rgba(100,116,139,0.1)', shocking: 'rgba(239,68,68,0.08)',
    touched: 'rgba(192,132,252,0.08)', nervous: 'rgba(96,165,250,0.06)',
    bittersweet: 'rgba(192,132,252,0.06)', determined: 'rgba(251,191,36,0.06)',
    heartbreak: 'rgba(239,68,68,0.1)', pensive: 'rgba(96,165,250,0.06)'
  }
  return overlays[emotion] || 'transparent'
}

function getParticleStyle(index) {
  const seed = index * 37
  const left = (seed * 17) % 100
  const delay = (seed * 7) % 8
  const duration = 5 + ((seed * 3) % 6)
  const size = 4 + (seed % 6)
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

function startPlayback(script) {
  currentScript.value = script
  currentShotIndex.value = 0
  autoPlay.value = true
  displayedCharCount.value = 0
  displayedSubtitle.value = ''
  shotProgress.value = 0
  nextTick(() => {
    playCurrentShot()
  })
}

function playCurrentShot() {
  clearAllTimers()
  if (!currentShot.value) return

  const shot = currentShot.value
  displayedCharCount.value = 0
  displayedSubtitle.value = ''
  shotProgress.value = 0

  applyTheaterMusic(shot.music)

  if (shot.type === 'narration' && shot.narration) {
    displayedSubtitle.value = shot.narration
    startTypewriter(shot.narration)
  }

  if (autoPlay.value) {
    const duration = shot.duration || 3000
    let elapsed = 0
    const interval = 100
    progressTimer = setInterval(() => {
      elapsed += interval
      shotProgress.value = Math.min(1, elapsed / duration)
      if (elapsed >= duration) {
        clearInterval(progressTimer)
        progressTimer = null
        if (currentShotIndex.value < totalShots.value - 1) {
          advanceShot()
        }
      }
    }, interval)
  }
}

function startTypewriter(text) {
  let charIdx = 0
  const speed = 50
  charTimer = setInterval(() => {
    charIdx++
    displayedCharCount.value = charIdx
    if (charIdx >= text.length) {
      clearInterval(charTimer)
      charTimer = null
    }
  }, speed)
}

function advanceShot() {
  if (shotTransitioning.value) return
  shotTransitioning.value = true

  setTimeout(() => {
    if (currentShotIndex.value < totalShots.value - 1) {
      currentShotIndex.value++
      shotTransitioning.value = false
      playCurrentShot()
    } else {
      shotTransitioning.value = false
    }
  }, 600)
}

function nextShot() {
  if (currentShotIndex.value >= totalShots.value - 1) return
  clearAllTimers()
  shotTransitioning.value = true
  setTimeout(() => {
    currentShotIndex.value++
    shotTransitioning.value = false
    playCurrentShot()
  }, 400)
}

function prevShot() {
  if (currentShotIndex.value <= 0) return
  clearAllTimers()
  shotTransitioning.value = true
  setTimeout(() => {
    currentShotIndex.value--
    shotTransitioning.value = false
    playCurrentShot()
  }, 400)
}

function toggleAutoPlay() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) {
    playCurrentShot()
  } else {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }
}

function exitPlayback() {
  clearAllTimers()
  currentScript.value = null
  currentShotIndex.value = 0
  restoreGameMusic()
}

function closeTheater() {
  clearAllTimers()
  currentScript.value = null
  gameStore.closeMemoryTheater()
  restoreGameMusic()
}

function clearAllTimers() {
  if (shotTimer) { clearTimeout(shotTimer); shotTimer = null }
  if (charTimer) { clearInterval(charTimer); charTimer = null }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
}

let theaterAudioCtx = null
let theaterMasterGain = null
let theaterBaseOsc = null
let theaterBaseGain = null
let theaterBaseFilter = null
let theaterPadOsc = null
let theaterPadGain = null
let theaterPadFilter = null
let theaterChordOscs = []
let theaterChordGains = []
let theaterChordFilter = null
let theaterReverb = null
let theaterReverbGain = null
let theaterDryGain = null

function initTheaterAudio() {
  if (theaterAudioCtx) return
  try {
    theaterAudioCtx = new (window.AudioContext || window.webkitAudioContext)()

    theaterMasterGain = theaterAudioCtx.createGain()
    theaterMasterGain.gain.value = 0
    theaterMasterGain.connect(theaterAudioCtx.destination)

    theaterDryGain = theaterAudioCtx.createGain()
    theaterDryGain.gain.value = 0.7
    theaterDryGain.connect(theaterMasterGain)

    theaterReverbGain = theaterAudioCtx.createGain()
    theaterReverbGain.gain.value = 0.3
    theaterReverbGain.connect(theaterMasterGain)

    const sampleRate = theaterAudioCtx.sampleRate
    const reverbLen = sampleRate * 3
    const impulse = theaterAudioCtx.createBuffer(2, reverbLen, sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < reverbLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5)
      }
    }
    theaterReverb = theaterAudioCtx.createConvolver()
    theaterReverb.buffer = impulse
    theaterReverb.connect(theaterReverbGain)

    theaterBaseFilter = theaterAudioCtx.createBiquadFilter()
    theaterBaseFilter.type = 'lowpass'
    theaterBaseFilter.frequency.value = 600
    theaterBaseFilter.Q.value = 1.5
    theaterBaseFilter.connect(theaterDryGain)
    theaterBaseFilter.connect(theaterReverb)

    theaterBaseGain = theaterAudioCtx.createGain()
    theaterBaseGain.gain.value = 0
    theaterBaseGain.connect(theaterBaseFilter)

    theaterBaseOsc = theaterAudioCtx.createOscillator()
    theaterBaseOsc.type = 'sine'
    theaterBaseOsc.frequency.value = 55
    theaterBaseOsc.connect(theaterBaseGain)
    theaterBaseOsc.start()

    theaterPadFilter = theaterAudioCtx.createBiquadFilter()
    theaterPadFilter.type = 'lowpass'
    theaterPadFilter.frequency.value = 500
    theaterPadFilter.Q.value = 0.8
    theaterPadFilter.connect(theaterDryGain)
    theaterPadFilter.connect(theaterReverb)

    theaterPadGain = theaterAudioCtx.createGain()
    theaterPadGain.gain.value = 0
    theaterPadGain.connect(theaterPadFilter)

    theaterPadOsc = theaterAudioCtx.createOscillator()
    theaterPadOsc.type = 'triangle'
    theaterPadOsc.frequency.value = 110
    theaterPadOsc.connect(theaterPadGain)
    theaterPadOsc.start()

    theaterChordFilter = theaterAudioCtx.createBiquadFilter()
    theaterChordFilter.type = 'lowpass'
    theaterChordFilter.frequency.value = 1200
    theaterChordFilter.Q.value = 1.0
    theaterChordFilter.connect(theaterDryGain)
    theaterChordFilter.connect(theaterReverb)

    for (let i = 0; i < 4; i++) {
      const osc = theaterAudioCtx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 110
      const gain = theaterAudioCtx.createGain()
      gain.gain.value = 0
      osc.connect(gain)
      gain.connect(theaterChordFilter)
      osc.start()
      theaterChordOscs.push(osc)
      theaterChordGains.push(gain)
    }

    theaterMasterGain.gain.setTargetAtTime(0.35, theaterAudioCtx.currentTime, 0.5)
  } catch (e) {
    // audio not available
  }
}

function applyTheaterMusic(musicConfig) {
  if (!theaterAudioCtx || !musicConfig) return
  const now = theaterAudioCtx.currentTime
  const ramp = 0.8

  theaterBaseOsc.frequency.setTargetAtTime(musicConfig.freq || 55, now, ramp)
  theaterBaseGain.gain.setTargetAtTime(0.12 * (musicConfig.brightness || 0.3), now, ramp)
  theaterBaseFilter.frequency.setTargetAtTime(musicConfig.filter || 800, now, ramp)

  theaterPadOsc.frequency.setTargetAtTime(musicConfig.pad || 110, now, ramp)
  theaterPadGain.gain.setTargetAtTime(0.08 * (musicConfig.brightness || 0.3), now, ramp)
  theaterPadFilter.frequency.setTargetAtTime(Math.max(100, (musicConfig.filter || 800) * 0.7), now, ramp)

  const chordIntervals = musicConfig.chordIntervals || [0, 4, 7, 12]
  for (let i = 0; i < theaterChordOscs.length; i++) {
    if (i < chordIntervals.length) {
      const freq = (musicConfig.freq || 55) * Math.pow(2, chordIntervals[i] / 12)
      theaterChordOscs[i].frequency.setTargetAtTime(freq, now, ramp)
      theaterChordGains[i].gain.setTargetAtTime(0.05 * (musicConfig.brightness || 0.3), now, ramp)
    } else {
      theaterChordGains[i].gain.setTargetAtTime(0, now, ramp)
    }
  }
  theaterChordFilter.frequency.setTargetAtTime(Math.max(100, (musicConfig.filter || 1200) * 1.2), now, ramp)

  const reverbMix = Math.min(0.9, 0.3 + (musicConfig.brightness || 0.3) * 0.3)
  theaterDryGain.gain.setTargetAtTime(1 - reverbMix * 0.5, now, ramp)
  theaterReverbGain.gain.setTargetAtTime(reverbMix * 0.5, now, ramp)
}

function fadeOutTheaterAudio() {
  if (!theaterAudioCtx) return
  const now = theaterAudioCtx.currentTime
  theaterMasterGain.gain.setTargetAtTime(0, now, 0.5)
}

function restoreGameMusic() {
  fadeOutTheaterAudio()
}

function cleanupTheaterAudio() {
  if (theaterAudioCtx) {
    theaterMasterGain.gain.setTargetAtTime(0, theaterAudioCtx.currentTime, 0.1)
    setTimeout(() => {
      try {
        theaterAudioCtx.close()
      } catch (e) {}
      theaterAudioCtx = null
      theaterChordOscs = []
      theaterChordGains = []
    }, 300)
  }
}

watch(() => gameStore.showMemoryTheater, (show) => {
  if (show) {
    initTheaterAudio()
  } else {
    cleanupTheaterAudio()
    clearAllTimers()
    currentScript.value = null
  }
})

onUnmounted(() => {
  cleanupTheaterAudio()
  clearAllTimers()
})
</script>

<style scoped>
.theater-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.theater-lobby {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem 1.5rem;
}

.lobby-header {
  text-align: center;
  position: relative;
  margin-bottom: 2rem;
}

.lobby-title-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.lobby-icon {
  font-size: 2rem;
}

.lobby-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: #d4a574;
  margin: 0;
  letter-spacing: 0.15rem;
}

.lobby-subtitle {
  color: #808090;
  font-size: 0.9rem;
  margin: 0;
}

.lobby-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #a0a0b0;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lobby-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #e8e8f0;
  transform: rotate(90deg);
}

.lobby-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.lobby-filters::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #a0a0b0;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: inherit;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-btn.active {
  background: rgba(212, 165, 116, 0.15);
  border-color: rgba(212, 165, 116, 0.4);
  color: #d4a574;
}

.filter-icon {
  font-size: 1rem;
}

.filter-count {
  font-size: 0.72rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
}

.filter-btn.active .filter-count {
  background: rgba(212, 165, 116, 0.2);
}

.lobby-scripts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.8rem;
}

.script-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 140px;
}

.script-card:hover {
  transform: translateY(-3px);
  border-color: rgba(212, 165, 116, 0.35);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.script-card.emotion-sad { border-color: rgba(100, 100, 150, 0.25); }
.script-card.emotion-sad:hover { border-color: rgba(100, 100, 150, 0.5); }
.script-card.emotion-warm { border-color: rgba(251, 191, 36, 0.2); }
.script-card.emotion-warm:hover { border-color: rgba(251, 191, 36, 0.45); }
.script-card.emotion-romantic { border-color: rgba(244, 114, 182, 0.2); }
.script-card.emotion-romantic:hover { border-color: rgba(244, 114, 182, 0.45); }
.script-card.emotion-happy, .script-card.emotion-sweet { border-color: rgba(251, 191, 36, 0.2); }
.script-card.emotion-regret, .script-card.emotion-melancholy { border-color: rgba(100, 116, 139, 0.2); }
.script-card.emotion-shocking { border-color: rgba(239, 68, 68, 0.2); }
.script-card.emotion-touched { border-color: rgba(192, 132, 252, 0.2); }
.script-card.emotion-determined { border-color: rgba(251, 191, 36, 0.2); }

.script-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.script-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.script-content {
  position: relative;
  z-index: 2;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
}

.script-emoji {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.script-title {
  font-size: 0.95rem;
  color: #e8e8f0;
  font-weight: 500;
  line-height: 1.4;
}

.script-year {
  font-size: 0.75rem;
  color: #808090;
}

.script-badge {
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.25);
}

.script-shots {
  font-size: 0.68rem;
  color: #707080;
}

.script-play-hint {
  position: absolute;
  bottom: 8px;
  right: 10px;
  z-index: 3;
  font-size: 0.72rem;
  color: #d4a574;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.script-card:hover .script-play-hint {
  opacity: 1;
}

.lobby-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #707080;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}

.empty-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #606070;
}

.theater-stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 1.5s ease;
}

.stage-overlay {
  position: absolute;
  inset: 0;
  transition: background 1s ease;
  pointer-events: none;
  z-index: 1;
}

.stage-fog {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.stage-fog.active {
  opacity: 1;
  background: rgba(0, 0, 0, 0.3);
}

.stage-effect {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.stage-effect.fadeIn {
  animation: stage-fadeIn 1.5s ease-out;
}

.stage-effect.fadeOut {
  animation: stage-fadeOut 1.5s ease-in;
}

.stage-effect.sparkle {
  background: radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 50%);
  animation: stage-sparkle 2s ease-out;
}

.stage-effect.ripple {
  background: radial-gradient(circle at center, rgba(96, 165, 250, 0.15) 0%, transparent 50%);
  animation: stage-ripple 1.5s ease-out;
}

@keyframes stage-fadeIn {
  0% { background: rgba(0, 0, 0, 1); }
  100% { background: transparent; }
}

@keyframes stage-fadeOut {
  0% { background: transparent; }
  100% { background: rgba(0, 0, 0, 0.7); }
}

@keyframes stage-sparkle {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: scale(2); }
}

@keyframes stage-ripple {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: scale(2); }
}

.stage-particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

.stage-particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  opacity: 0;
  animation: particle-drift linear infinite;
}

.stage-particle.sad,
.stage-particle.regret,
.stage-particle.melancholy {
  background: radial-gradient(circle, rgba(100, 100, 150, 0.6) 0%, transparent 70%);
}

.stage-particle.warm,
.stage-particle.happy,
.stage-particle.sweet {
  background: radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%);
}

.stage-particle.romantic,
.stage-particle.bittersweet {
  background: radial-gradient(circle, rgba(244, 114, 182, 0.5) 0%, transparent 70%);
}

.stage-particle.shocking {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, transparent 70%);
}

.stage-particle.touched,
.stage-particle.pensive {
  background: radial-gradient(circle, rgba(192, 132, 252, 0.5) 0%, transparent 70%);
}

.stage-particle.determined {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, transparent 70%);
}

@keyframes particle-drift {
  0% { opacity: 0; transform: translateY(0); }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-100vh); }
}

.stage-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  text-align: center;
  transition: opacity 0.4s ease;
}

.stage-content.transitioning {
  opacity: 0;
}

.shot-frame {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shot-title-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.shot-emoji-big {
  font-size: clamp(3rem, 10vw, 5rem);
  animation: emoji-float 3s ease-in-out infinite;
}

.shot-emoji-big.emotion-sad { filter: none; }
.shot-emoji-big.emotion-warm,
.shot-emoji-big.emotion-happy { filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.4)); }
.shot-emoji-big.emotion-romantic { filter: drop-shadow(0 0 15px rgba(244, 114, 182, 0.4)); }

@keyframes emoji-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.shot-main-title {
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 400;
  color: #e8e8f0;
  letter-spacing: 0.2rem;
  margin: 0;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
}

.shot-main-title.emotion-sad { color: #b0b0c8; }
.shot-main-title.emotion-warm,
.shot-main-title.emotion-happy { color: #fde68a; }
.shot-main-title.emotion-romantic { color: #f9a8d4; }
.shot-main-title.emotion-shocking { color: #f87171; }
.shot-main-title.emotion-touched { color: #c4b5fd; }

.shot-sub-title {
  font-size: 0.9rem;
  color: #808090;
  margin: 0;
  letter-spacing: 0.1rem;
}

.shot-narration-scene {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.narration-text-wrap {
  max-width: 500px;
  text-align: justify;
}

.narration-text {
  font-size: clamp(1rem, 3vw, 1.15rem);
  line-height: 2.2;
  color: #d0d0e0;
  text-indent: 2em;
  margin: 0;
}

.narration-char {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.narration-char.visible {
  opacity: 1;
}

.narration-text.emotion-sad { color: #b0b0c8; }
.narration-text.emotion-warm { color: #fde68a; }
.narration-text.emotion-romantic { color: #f9a8d4; }
.narration-text.emotion-happy { color: #fef3c7; }
.narration-text.emotion-regret { color: #94a3b8; }
.narration-text.emotion-melancholy { color: #a0a0b8; }
.narration-text.emotion-shocking { color: #fca5a5; }
.narration-text.emotion-touched { color: #c4b5fd; }
.narration-text.emotion-determined { color: #93c5fd; }

.stage-subtitle-bar {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  max-width: 500px;
  width: 90%;
}

.subtitle-content {
  text-align: center;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.subtitle-text {
  color: #e8e8f0;
  font-size: 0.95rem;
  letter-spacing: 0.05rem;
  line-height: 1.6;
}

.subtitle-fade-enter-active,
.subtitle-fade-leave-active {
  transition: all 0.4s ease;
}

.subtitle-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.subtitle-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

.stage-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.hud-emoji {
  font-size: 1.1rem;
}

.hud-title {
  font-size: 0.82rem;
  color: #b0b0c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hud-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.shot-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shot-progress-bar {
  width: 80px;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.shot-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a574, #b8860b);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.shot-counter {
  font-size: 0.72rem;
  color: #808090;
  white-space: nowrap;
}

.hud-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  justify-content: flex-end;
}

.hud-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #c0c0d0;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.hud-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.hud-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.hud-btn.active {
  background: rgba(212, 165, 116, 0.2);
  border-color: rgba(212, 165, 116, 0.4);
  color: #d4a574;
}

.hud-close-btn {
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.stage-emotion-indicator {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.emotion-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: emotion-glow 2s ease-in-out infinite;
}

.stage-emotion-indicator.emotion-sad .emotion-pulse { background: #6b7280; }
.stage-emotion-indicator.emotion-warm .emotion-pulse,
.stage-emotion-indicator.emotion-happy .emotion-pulse { background: #fbbf24; }
.stage-emotion-indicator.emotion-romantic .emotion-pulse { background: #f472b6; }
.stage-emotion-indicator.emotion-regret .emotion-pulse,
.stage-emotion-indicator.emotion-melancholy .emotion-pulse { background: #94a3b8; }
.stage-emotion-indicator.emotion-shocking .emotion-pulse { background: #ef4444; }
.stage-emotion-indicator.emotion-touched .emotion-pulse { background: #c084fc; }
.stage-emotion-indicator.emotion-determined .emotion-pulse { background: #60a5fa; }
.stage-emotion-indicator.emotion-bittersweet .emotion-pulse { background: #a78bfa; }
.stage-emotion-indicator.emotion-pensive .emotion-pulse { background: #818cf8; }
.stage-emotion-indicator.emotion-nervous .emotion-pulse { background: #fb923c; }
.stage-emotion-indicator.emotion-sweet .emotion-pulse { background: #f9a8d4; }

@keyframes emotion-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

.emotion-label {
  font-size: 0.72rem;
  color: #808090;
  letter-spacing: 0.05rem;
}

.stage-click-zone {
  position: absolute;
  top: 0;
  bottom: 60px;
  width: 25%;
  z-index: 8;
  cursor: pointer;
}

.stage-click-zone.left {
  left: 0;
}

.stage-click-zone.right {
  right: 0;
}

.shot-fade-enter-active,
.shot-fade-leave-active {
  transition: all 0.5s ease;
}

.shot-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.shot-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.theater-fade-enter-active,
.theater-fade-leave-active {
  transition: opacity 0.5s ease;
}

.theater-fade-enter-from,
.theater-fade-leave-to {
  opacity: 0;
}
</style>
