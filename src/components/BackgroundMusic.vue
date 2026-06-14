<template>
  <button class="music-btn" @click="toggleMusic" :title="musicEnabled ? '关闭音乐' : '开启音乐'">
    <span class="music-icon">{{ musicEnabled ? '🔊' : '🔇' }}</span>
    <span v-if="musicEnabled" class="music-layers-indicator" :class="timePressureClass">
      <span class="layer-dot base"></span>
      <span class="layer-dot mood" :class="moodStateId"></span>
      <span class="layer-dot scene" :class="sceneCharacter"></span>
    </span>
  </button>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useMusicStore } from '../stores/musicStore'

const gameStore = useGameStore()
const musicStore = useMusicStore()
const musicEnabled = ref(true)

let audioCtx = null
let masterGain = null
let baseOsc = null
let baseGain = null
let baseFilter = null
let padOsc = null
let padGain = null
let padFilter = null
let chordOscs = []
let chordGains = []
let chordFilter = null
let pulseOsc = null
let pulseGain = null
let pulseFilter = null
let pulseLfo = null
let pulseLfoGain = null
let noiseSource = null
let noiseGain = null
let noiseFilter = null
let subOsc = null
let subGain = null
let subFilter = null
let reverbConvolver = null
let reverbGain = null
let dryGain = null

let animationFrameId = null
let pulsePhase = 0
let isInitialized = false
let currentParams = null
let targetParams = null
let lerpSpeed = 0.03

const timePressureClass = computed(() => musicStore.timePressureLevel)
const moodStateId = computed(() => musicStore.moodStateId)
const sceneCharacter = computed(() => musicStore.sceneConfig?.character || 'lonely')

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpParams(current, target, t) {
  if (!current || !target) return target
  const result = {}
  for (const key of Object.keys(target)) {
    if (typeof target[key] === 'number' && typeof current[key] === 'number') {
      result[key] = lerp(current[key], target[key], t)
    } else if (typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
      result[key] = lerpParams(current[key], target[key], t)
    } else {
      result[key] = target[key]
    }
  }
  return result
}

function createNoiseBuffer(ctx, duration = 2) {
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const output = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }
  return buffer
}

function createReverbIR(ctx, duration = 3, decay = 2) {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * duration
  const impulse = ctx.createBuffer(2, length, sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return impulse
}

function initAudio() {
  if (isInitialized) return

  audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  masterGain = audioCtx.createGain()
  masterGain.gain.value = musicEnabled.value ? 0.5 : 0
  masterGain.connect(audioCtx.destination)

  dryGain = audioCtx.createGain()
  dryGain.gain.value = 0.7
  dryGain.connect(masterGain)

  reverbGain = audioCtx.createGain()
  reverbGain.gain.value = 0.3
  reverbGain.connect(masterGain)

  reverbConvolver = audioCtx.createConvolver()
  reverbConvolver.buffer = createReverbIR(audioCtx, 3, 2.5)
  reverbConvolver.connect(reverbGain)

  baseFilter = audioCtx.createBiquadFilter()
  baseFilter.type = 'lowpass'
  baseFilter.frequency.value = 800
  baseFilter.Q.value = 1.5
  baseFilter.connect(dryGain)
  baseFilter.connect(reverbConvolver)

  baseGain = audioCtx.createGain()
  baseGain.gain.value = 0
  baseGain.connect(baseFilter)

  baseOsc = audioCtx.createOscillator()
  baseOsc.type = 'sine'
  baseOsc.frequency.value = 55
  baseOsc.connect(baseGain)
  baseOsc.start()

  padFilter = audioCtx.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 600
  padFilter.Q.value = 0.8
  padFilter.connect(dryGain)
  padFilter.connect(reverbConvolver)

  padGain = audioCtx.createGain()
  padGain.gain.value = 0
  padGain.connect(padFilter)

  padOsc = audioCtx.createOscillator()
  padOsc.type = 'triangle'
  padOsc.frequency.value = 110
  padOsc.connect(padGain)
  padOsc.start()

  chordFilter = audioCtx.createBiquadFilter()
  chordFilter.type = 'lowpass'
  chordFilter.frequency.value = 1200
  chordFilter.Q.value = 1.0
  chordFilter.connect(dryGain)
  chordFilter.connect(reverbConvolver)

  const defaultChordFreqs = [55, 69.3, 82.4, 110]
  for (let i = 0; i < 5; i++) {
    const osc = audioCtx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = defaultChordFreqs[i] || 110
    const gain = audioCtx.createGain()
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(chordFilter)
    osc.start()
    chordOscs.push(osc)
    chordGains.push(gain)
  }

  pulseFilter = audioCtx.createBiquadFilter()
  pulseFilter.type = 'lowpass'
  pulseFilter.frequency.value = 300
  pulseFilter.Q.value = 3
  pulseFilter.connect(dryGain)

  pulseGain = audioCtx.createGain()
  pulseGain.gain.value = 0
  pulseGain.connect(pulseFilter)

  pulseOsc = audioCtx.createOscillator()
  pulseOsc.type = 'sine'
  pulseOsc.frequency.value = 27.5
  pulseOsc.connect(pulseGain)
  pulseOsc.start()

  pulseLfo = audioCtx.createOscillator()
  pulseLfo.type = 'sine'
  pulseLfo.frequency.value = 0
  pulseLfoGain = audioCtx.createGain()
  pulseLfoGain.gain.value = 0
  pulseLfo.connect(pulseLfoGain)
  pulseLfoGain.connect(pulseGain.gain)
  pulseLfo.start()

  noiseFilter = audioCtx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 400
  noiseFilter.Q.value = 0.5
  noiseFilter.connect(dryGain)

  noiseGain = audioCtx.createGain()
  noiseGain.gain.value = 0
  noiseGain.connect(noiseFilter)

  const noiseBuffer = createNoiseBuffer(audioCtx, 4)
  noiseSource = audioCtx.createBufferSource()
  noiseSource.buffer = noiseBuffer
  noiseSource.loop = true
  noiseSource.connect(noiseGain)
  noiseSource.start()

  subFilter = audioCtx.createBiquadFilter()
  subFilter.type = 'lowpass'
  subFilter.frequency.value = 150
  subFilter.Q.value = 1
  subFilter.connect(dryGain)

  subGain = audioCtx.createGain()
  subGain.gain.value = 0
  subGain.connect(subFilter)

  subOsc = audioCtx.createOscillator()
  subOsc.type = 'sine'
  subOsc.frequency.value = 27.5
  subOsc.connect(subGain)
  subOsc.start()

  isInitialized = true
}

function computeTargetFromContext(ctx) {
  return {
    master: musicEnabled.value ? 0.5 : 0,
    base: { freq: ctx.base.freq, gain: ctx.base.gain, detune: ctx.base.detune },
    baseFilter: { freq: ctx.base.filterFreq, Q: ctx.base.filterQ },
    pad: { freq: ctx.pad.freq, gain: ctx.pad.gain, detune: ctx.pad.detune },
    padFilter: { freq: ctx.pad.filterFreq, Q: ctx.pad.filterQ },
    chordFreqs: ctx.chord.freqs,
    chordGain: ctx.chord.gain,
    chordDetune: ctx.chord.detune,
    chordFilter: { freq: ctx.chord.filterFreq, Q: ctx.chord.filterQ },
    pulse: { freq: ctx.pulse.freq, gain: ctx.pulse.gain, rate: ctx.pulse.rate, detune: ctx.pulse.detune },
    pulseFilter: { freq: ctx.pulse.filterFreq, Q: ctx.pulse.filterQ },
    noise: { gain: ctx.noise.gain },
    noiseFilter: { freq: ctx.noise.filterFreq, Q: ctx.noise.filterQ },
    sub: { freq: ctx.sub.freq, gain: ctx.sub.gain, detune: ctx.sub.detune },
    subFilter: { freq: ctx.sub.filterFreq, Q: ctx.sub.filterQ },
    reverbMix: ctx.reverbMix,
    tempoMultiplier: ctx.tempoMultiplier
  }
}

function applyAudioParams(params) {
  if (!audioCtx || !isInitialized) return

  const now = audioCtx.currentTime
  const rampTime = 0.1

  masterGain.gain.setTargetAtTime(params.master, now, rampTime)

  baseOsc.frequency.setTargetAtTime(params.base.freq, now, rampTime)
  baseOsc.detune.setTargetAtTime(params.base.detune, now, rampTime)
  baseGain.gain.setTargetAtTime(params.base.gain, now, rampTime)
  baseFilter.frequency.setTargetAtTime(params.baseFilter.freq, now, rampTime)
  baseFilter.Q.setTargetAtTime(params.baseFilter.Q, now, rampTime)

  padOsc.frequency.setTargetAtTime(params.pad.freq, now, rampTime)
  padOsc.detune.setTargetAtTime(params.pad.detune, now, rampTime)
  padGain.gain.setTargetAtTime(params.pad.gain, now, rampTime)
  padFilter.frequency.setTargetAtTime(params.padFilter.freq, now, rampTime)
  padFilter.Q.setTargetAtTime(params.padFilter.Q, now, rampTime)

  const chordFreqs = params.chordFreqs
  for (let i = 0; i < chordOscs.length; i++) {
    if (i < chordFreqs.length) {
      chordOscs[i].frequency.setTargetAtTime(chordFreqs[i], now, rampTime)
      chordOscs[i].detune.setTargetAtTime(params.chordDetune, now, rampTime)
      chordGains[i].gain.setTargetAtTime(params.chordGain, now, rampTime)
    } else {
      chordGains[i].gain.setTargetAtTime(0, now, rampTime)
    }
  }
  chordFilter.frequency.setTargetAtTime(params.chordFilter.freq, now, rampTime)
  chordFilter.Q.setTargetAtTime(params.chordFilter.Q, now, rampTime)

  pulseOsc.frequency.setTargetAtTime(params.pulse.freq, now, rampTime)
  pulseOsc.detune.setTargetAtTime(params.pulse.detune, now, rampTime)
  pulseGain.gain.setTargetAtTime(params.pulse.gain > 0.001 ? params.pulse.gain * 0.5 : 0, now, rampTime)
  pulseLfo.frequency.setTargetAtTime(params.pulse.rate, now, rampTime)
  pulseLfoGain.gain.setTargetAtTime(params.pulse.gain > 0.001 ? params.pulse.gain : 0, now, rampTime)
  pulseFilter.frequency.setTargetAtTime(params.pulseFilter.freq, now, rampTime)
  pulseFilter.Q.setTargetAtTime(params.pulseFilter.Q, now, rampTime)

  noiseGain.gain.setTargetAtTime(params.noise.gain, now, rampTime)
  noiseFilter.frequency.setTargetAtTime(params.noiseFilter.freq, now, rampTime)
  noiseFilter.Q.setTargetAtTime(params.noiseFilter.Q, now, rampTime)

  subOsc.frequency.setTargetAtTime(params.sub.freq, now, rampTime)
  subOsc.detune.setTargetAtTime(params.sub.detune, now, rampTime)
  subGain.gain.setTargetAtTime(params.sub.gain, now, rampTime)
  subFilter.frequency.setTargetAtTime(params.subFilter.freq, now, rampTime)
  subFilter.Q.setTargetAtTime(params.subFilter.Q, now, rampTime)

  const wet = params.reverbMix
  dryGain.gain.setTargetAtTime(1 - wet * 0.5, now, rampTime)
  reverbGain.gain.setTargetAtTime(wet * 0.5, now, rampTime)
}

function animationLoop() {
  if (!isInitialized) return

  const ctx = musicStore.musicContext
  if (!ctx) {
    animationFrameId = requestAnimationFrame(animationLoop)
    return
  }

  targetParams = computeTargetFromContext(ctx)

  if (!currentParams) {
    currentParams = JSON.parse(JSON.stringify(targetParams))
  }

  currentParams = lerpParams(currentParams, targetParams, lerpSpeed)

  applyAudioParams(currentParams)

  animationFrameId = requestAnimationFrame(animationLoop)
}

watch(musicEnabled, (newVal) => {
  gameStore.musicEnabled = newVal
  if (isInitialized) {
    const now = audioCtx.currentTime
    masterGain.gain.setTargetAtTime(newVal ? 0.5 : 0, now, 0.3)
  }
})

watch(() => gameStore.gameState, (newState) => {
  musicStore.updateContext({ gameState: newState })
})

watch(() => gameStore.currentSceneId, (newSceneId) => {
  musicStore.updateContext({ sceneId: newSceneId })
})

watch(() => gameStore.timeRemaining, (newTime) => {
  musicStore.updateContext({ timeRemaining: newTime })
})

watch(() => gameStore.moodStateId, (newMood) => {
  musicStore.updateContext({ moodStateId: newMood })
})

watch(() => gameStore.currentTimePeriod, (newPeriod) => {
  musicStore.updateContext({ timePeriod: newPeriod })
})

watch(() => gameStore.currentChapterId, (newChapter) => {
  musicStore.updateContext({ chapterId: newChapter })
})

watch(() => gameStore.memoryProgressPercent, (newProgress) => {
  musicStore.updateContext({ memoryProgress: newProgress })
})

watch(() => gameStore.dominantEndingWeights, (weights) => {
  if (!weights || weights.length === 0) {
    musicStore.updateContext({ dominantEndingType: 'neutral' })
    return
  }
  const topWeight = weights[0]
  if (!topWeight) return
  const weightKey = topWeight[0]
  const typeMap = {
    sincere: 'bright',
    courage: 'bright',
    nostalgic: 'neutral',
    reserved: 'bittersweet',
    lettingGo: 'bittersweet',
    decisive: 'bright',
    romantic: 'transcendent',
    regretful: 'dark',
    mature: 'neutral',
    hopeful: 'transcendent',
    loyal: 'bright',
    honest: 'bright',
    human: 'neutral',
    passionate: 'transcendent',
    gentle: 'bright',
    humble: 'neutral',
    cautious: 'bittersweet'
  }
  const mappedType = typeMap[weightKey] || 'neutral'
  musicStore.updateContext({ dominantEndingType: mappedType })
}, { deep: true })

onMounted(() => {
  musicEnabled.value = gameStore.musicEnabled

  musicStore.updateContext({
    gameState: gameStore.gameState,
    sceneId: gameStore.currentSceneId,
    timeRemaining: gameStore.timeRemaining,
    moodStateId: gameStore.moodStateId,
    timePeriod: gameStore.currentTimePeriod,
    chapterId: gameStore.currentChapterId,
    memoryProgress: gameStore.memoryProgressPercent
  })

  const initOnInteraction = () => {
    if (!isInitialized) {
      initAudio()
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
      }
      animationLoop()
    }
    document.removeEventListener('click', initOnInteraction)
    document.removeEventListener('touchstart', initOnInteraction)
  }

  document.addEventListener('click', initOnInteraction)
  document.addEventListener('touchstart', initOnInteraction)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
    isInitialized = false
  }
})

function toggleMusic() {
  musicEnabled.value = !musicEnabled.value
}
</script>

<style scoped>
.music-btn {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 1000;
  height: 44px;
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px 0 10px;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.05);
}

.music-btn:active {
  transform: scale(0.95);
}

.music-icon {
  font-size: 1.2rem;
}

.music-layers-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.layer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.5s ease;
}

.layer-dot.base {
  background: rgba(150, 150, 200, 0.6);
  animation: layerPulse 3s ease-in-out infinite;
}

.layer-dot.mood {
  animation: layerPulse 2s ease-in-out infinite;
}

.layer-dot.mood.despair { background: rgba(61, 40, 40, 0.8); }
.layer-dot.mood.gloomy { background: rgba(74, 74, 90, 0.8); }
.layer-dot.mood.calm { background: rgba(90, 106, 122, 0.8); }
.layer-dot.mood.warm { background: rgba(196, 138, 101, 0.8); }
.layer-dot.mood.hopeful { background: rgba(232, 184, 122, 0.8); }

.layer-dot.scene {
  background: rgba(100, 200, 150, 0.6);
  animation: layerPulse 4s ease-in-out infinite;
}

.layer-dot.scene.lonely { background: rgba(100, 120, 200, 0.6); }
.layer-dot.scene.nostalgic { background: rgba(150, 130, 100, 0.6); }
.layer-dot.scene.intimate { background: rgba(180, 120, 80, 0.6); }
.layer-dot.scene.serene { background: rgba(100, 180, 130, 0.6); }
.layer-dot.scene.contemplative { background: rgba(140, 110, 80, 0.6); }
.layer-dot.scene.mysterious { background: rgba(80, 100, 160, 0.6); }

@keyframes layerPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
</style>
