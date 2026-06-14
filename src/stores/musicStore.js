import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const SCENE_MUSIC_CONFIG = {
  station: {
    baseFreq: 55,
    baseWaveform: 'sine',
    padFreq: 110,
    padWaveform: 'triangle',
    filterFreq: 800,
    filterQ: 1.5,
    reverbMix: 0.3,
    noiseLevel: 0.02,
    character: 'lonely'
  },
  street: {
    baseFreq: 65,
    baseWaveform: 'triangle',
    padFreq: 130,
    padWaveform: 'sine',
    filterFreq: 1200,
    filterQ: 1.2,
    reverbMix: 0.2,
    noiseLevel: 0.03,
    character: 'nostalgic'
  },
  cafe: {
    baseFreq: 82,
    baseWaveform: 'sine',
    padFreq: 165,
    padWaveform: 'sine',
    filterFreq: 2000,
    filterQ: 1.0,
    reverbMix: 0.5,
    noiseLevel: 0.01,
    character: 'intimate'
  },
  park: {
    baseFreq: 73,
    baseWaveform: 'triangle',
    padFreq: 146,
    padWaveform: 'triangle',
    filterFreq: 1500,
    filterQ: 0.8,
    reverbMix: 0.4,
    noiseLevel: 0.015,
    character: 'serene'
  },
  bookstore: {
    baseFreq: 98,
    baseWaveform: 'sine',
    padFreq: 196,
    padWaveform: 'sine',
    filterFreq: 1800,
    filterQ: 1.0,
    reverbMix: 0.6,
    noiseLevel: 0.008,
    character: 'contemplative'
  },
  lake: {
    baseFreq: 44,
    baseWaveform: 'sine',
    padFreq: 88,
    padWaveform: 'sine',
    filterFreq: 600,
    filterQ: 2.0,
    reverbMix: 0.7,
    noiseLevel: 0.025,
    character: 'mysterious'
  }
}

export const TIME_MUSIC_CONFIG = {
  relaxed: {
    pulseRate: 0,
    tensionGain: 0,
    filterShift: 0,
    detuneShift: 0,
    tempoMultiplier: 0.6
  },
  building: {
    pulseRate: 0.5,
    tensionGain: 0.08,
    filterShift: -200,
    detuneShift: -10,
    tempoMultiplier: 0.8
  },
  urgent: {
    pulseRate: 1.2,
    tensionGain: 0.15,
    filterShift: -500,
    detuneShift: -25,
    tempoMultiplier: 1.0
  },
  critical: {
    pulseRate: 2.5,
    tensionGain: 0.25,
    filterShift: -800,
    detuneShift: -50,
    tempoMultiplier: 1.3
  }
}

export const MOOD_MUSIC_CONFIG = {
  despair: {
    volume: 0.15,
    filterFreq: 400,
    detune: -50,
    harmonicInterval: 3,
    padGain: 0.6,
    brightness: 0.1,
    chordIntervals: [0, 3, 7, 10]
  },
  gloomy: {
    volume: 0.22,
    filterFreq: 700,
    detune: -20,
    harmonicInterval: 2,
    padGain: 0.7,
    brightness: 0.25,
    chordIntervals: [0, 3, 7, 12]
  },
  calm: {
    volume: 0.30,
    filterFreq: 1500,
    detune: 0,
    harmonicInterval: 0,
    padGain: 0.8,
    brightness: 0.5,
    chordIntervals: [0, 4, 7, 12]
  },
  warm: {
    volume: 0.38,
    filterFreq: 2500,
    detune: 10,
    harmonicInterval: -2,
    padGain: 0.9,
    brightness: 0.7,
    chordIntervals: [0, 4, 7, 11]
  },
  hopeful: {
    volume: 0.45,
    filterFreq: 4000,
    detune: 20,
    harmonicInterval: -3,
    padGain: 1.0,
    brightness: 0.9,
    chordIntervals: [0, 4, 7, 11, 16]
  }
}

export const ENDING_MUSIC_CONFIG = {
  dark: {
    harmonicShift: -0.5,
    brightness: 0.2,
    overtoneGain: 0.1,
    subBassGain: 0.4
  },
  bittersweet: {
    harmonicShift: -0.2,
    brightness: 0.4,
    overtoneGain: 0.2,
    subBassGain: 0.3
  },
  neutral: {
    harmonicShift: 0,
    brightness: 0.5,
    overtoneGain: 0.3,
    subBassGain: 0.2
  },
  bright: {
    harmonicShift: 0.3,
    brightness: 0.7,
    overtoneGain: 0.4,
    subBassGain: 0.15
  },
  transcendent: {
    harmonicShift: 0.6,
    brightness: 1.0,
    overtoneGain: 0.6,
    subBassGain: 0.1
  }
}

export const GAME_STATE_MUSIC = {
  start: {
    baseGain: 0.15,
    padGain: 0.3,
    pulseGain: 0,
    overtoneGain: 0.05,
    noiseGain: 0.01
  },
  playing: {
    baseGain: 1.0,
    padGain: 1.0,
    pulseGain: 1.0,
    overtoneGain: 1.0,
    noiseGain: 1.0
  },
  end: {
    baseGain: 0.4,
    padGain: 0.6,
    pulseGain: 0,
    overtoneGain: 0.3,
    noiseGain: 0.05
  }
}

export const TIME_PERIOD_MUSIC = {
  dawn: { filterOffset: 200, detuneOffset: 5, noiseOffset: 0.005 },
  day: { filterOffset: 500, detuneOffset: 0, noiseOffset: 0 },
  dusk: { filterOffset: -100, detuneOffset: -5, noiseOffset: 0.003 },
  night: { filterOffset: -400, detuneOffset: -15, noiseOffset: 0.01 }
}

export const useMusicStore = defineStore('music', () => {
  const currentSceneId = ref('station')
  const timeRemaining = ref(300)
  const moodStateId = ref('calm')
  const endingTrajectory = ref('neutral')
  const gameState = ref('start')
  const currentTimePeriod = ref('day')
  const currentChapterId = ref(1)
  const memoryProgressPercent = ref(0)
  const dominantEndingType = ref('neutral')

  const timePressureLevel = computed(() => {
    const t = timeRemaining.value
    if (t <= 60) return 'critical'
    if (t <= 120) return 'urgent'
    if (t <= 180) return 'building'
    return 'relaxed'
  })

  const sceneConfig = computed(() => {
    return SCENE_MUSIC_CONFIG[currentSceneId.value] || SCENE_MUSIC_CONFIG.station
  })

  const timeConfig = computed(() => {
    return TIME_MUSIC_CONFIG[timePressureLevel.value] || TIME_MUSIC_CONFIG.relaxed
  })

  const moodConfig = computed(() => {
    return MOOD_MUSIC_CONFIG[moodStateId.value] || MOOD_MUSIC_CONFIG.calm
  })

  const endingConfig = computed(() => {
    return ENDING_MUSIC_CONFIG[computedEndingTrajectory.value] || ENDING_MUSIC_CONFIG.neutral
  })

  const gameStateConfig = computed(() => {
    return GAME_STATE_MUSIC[gameState.value] || GAME_STATE_MUSIC.playing
  })

  const timePeriodConfig = computed(() => {
    return TIME_PERIOD_MUSIC[currentTimePeriod.value] || TIME_PERIOD_MUSIC.day
  })

  const computedEndingTrajectory = computed(() => {
    const type = dominantEndingType.value
    const brightKeys = ['sincere', 'courage', 'decisive', 'loyal', 'honest', 'gentle', 'hopeful']
    const transcendentKeys = ['romantic', 'passionate']
    const bittersweetKeys = ['reserved', 'lettingGo', 'cautious']
    const darkKeys = ['regretful']
    const neutralKeys = ['nostalgic', 'mature', 'human', 'humble']

    if (transcendentKeys.includes(type)) return 'transcendent'
    if (brightKeys.includes(type)) return 'bright'
    if (bittersweetKeys.includes(type)) return 'bittersweet'
    if (darkKeys.includes(type)) return 'dark'
    if (neutralKeys.includes(type)) return 'neutral'

    if (['legendary', 'epic'].includes(type)) return 'transcendent'
    if (['special', 'perfect', 'good'].includes(type)) return 'bright'
    if (['normal'].includes(type)) return 'neutral'
    if (['bad'].includes(type)) return 'bittersweet'
    if (['despair'].includes(type)) return 'dark'
    return 'neutral'
  })

  const memoryImpact = computed(() => {
    const progress = memoryProgressPercent.value / 100
    return {
      chordComplexity: Math.floor(progress * 2),
      overtoneMultiplier: 1 + progress * 0.6,
      brightnessBoost: progress * 0.4,
      extraPadGain: progress * 0.3,
      filterOpenness: progress * 0.3,
      reverbBoost: progress * 0.15,
      chordIntervalExpansion: progress * 2
    }
  })

  const musicContext = computed(() => {
    const scene = sceneConfig.value
    const time = timeConfig.value
    const mood = moodConfig.value
    const ending = endingConfig.value
    const state = gameStateConfig.value
    const period = timePeriodConfig.value
    const memory = memoryImpact.value

    const endingBrightness = ending.brightness
    const endingHarmonic = ending.harmonicShift
    const endingOvertone = ending.overtoneGain
    const endingSub = ending.subBassGain

    const baseFilterFreq = Math.max(100, scene.filterFreq + time.filterShift + period.filterOffset + memory.filterOpenness * 500 + endingBrightness * 600)
    const baseDetune = scene.baseFreq >= 60 ? mood.detune + time.detuneShift + period.detuneOffset + endingHarmonic * 20 : 0

    const expandedChordIntervals = mood.chordIntervals.map((interval, idx) => {
      return interval + endingHarmonic * 12 + (idx > 2 ? memory.chordIntervalExpansion : 0)
    })

    const activeChordCount = Math.min(
      mood.chordIntervals.length + memory.chordComplexity,
      5
    )

    const chordFreqs = expandedChordIntervals.slice(0, activeChordCount).map(interval => {
      return scene.baseFreq * Math.pow(2, interval / 12)
    })

    const memoryBrightness = mood.brightness * (1 + memory.brightnessBoost)
    const totalBrightness = memoryBrightness * endingBrightness

    const baseGain = mood.volume * state.baseGain * 0.4 * (1 + endingHarmonic * 0.3)
    const padGain = mood.padGain * mood.volume * state.padGain * 0.3 * (1 + memory.extraPadGain + endingBrightness * 0.3)
    const chordGain = mood.volume * endingOvertone * state.overtoneGain * memory.overtoneMultiplier * 0.18
    const pulseGain = time.tensionGain * state.pulseGain * 0.2 * (1 - endingBrightness * 0.3)
    const noiseGain = (scene.noiseLevel + time.tensionGain * 0.02 + period.noiseOffset) * state.noiseGain * (1 - endingBrightness * 0.25)
    const subGain = endingSub * mood.volume * state.baseGain * 0.25

    const reverbMix = scene.reverbMix * (1 + memory.reverbBoost + endingBrightness * 0.25)
    const clampedReverbMix = Math.min(0.9, Math.max(0.1, reverbMix))

    return {
      base: {
        freq: scene.baseFreq * (1 + endingHarmonic * 0.05),
        waveform: scene.baseWaveform,
        gain: baseGain,
        detune: baseDetune,
        filterFreq: baseFilterFreq,
        filterQ: scene.filterQ * (1 - endingHarmonic * 0.2)
      },
      pad: {
        freq: scene.padFreq * (1 + endingHarmonic * 0.03),
        waveform: scene.padWaveform,
        gain: padGain,
        detune: baseDetune * 0.5,
        filterFreq: Math.max(100, baseFilterFreq * 0.7 + endingBrightness * 300),
        filterQ: scene.filterQ * 0.5
      },
      chord: {
        freqs: chordFreqs,
        waveform: 'sine',
        gain: chordGain,
        detune: baseDetune * 0.3 + endingHarmonic * 10,
        filterFreq: Math.max(100, baseFilterFreq * 1.2 + endingBrightness * 500),
        filterQ: scene.filterQ * 0.8
      },
      pulse: {
        rate: time.pulseRate * (1 + (1 - endingBrightness) * 0.3),
        gain: pulseGain,
        freq: scene.baseFreq * 0.5,
        waveform: 'sine',
        detune: time.detuneShift * 2,
        filterFreq: Math.max(100, 300 + time.filterShift * 0.5 - endingHarmonic * 50),
        filterQ: 3
      },
      noise: {
        gain: noiseGain,
        filterFreq: Math.max(100, baseFilterFreq * 0.5 + endingBrightness * 100),
        filterQ: 0.5
      },
      sub: {
        freq: scene.baseFreq * 0.5 * (1 + endingHarmonic * 0.02),
        waveform: 'sine',
        gain: subGain,
        detune: endingHarmonic * 5,
        filterFreq: Math.max(50, 150 + time.filterShift * 0.3 + endingSub * 200),
        filterQ: 1
      },
      brightness: totalBrightness,
      reverbMix: clampedReverbMix,
      tempoMultiplier: time.tempoMultiplier,
      sceneCharacter: scene.character,
      timePressure: timePressureLevel.value,
      moodState: moodStateId.value,
      endingTrajectory: computedEndingTrajectory.value,
      memoryProgress: memoryProgressPercent.value,
      activeChordCount: activeChordCount
    }
  })

  function updateContext(params) {
    if (params.sceneId !== undefined) currentSceneId.value = params.sceneId
    if (params.timeRemaining !== undefined) timeRemaining.value = params.timeRemaining
    if (params.moodStateId !== undefined) moodStateId.value = params.moodStateId
    if (params.endingTrajectory !== undefined) endingTrajectory.value = params.endingTrajectory
    if (params.gameState !== undefined) gameState.value = params.gameState
    if (params.timePeriod !== undefined) currentTimePeriod.value = params.timePeriod
    if (params.chapterId !== undefined) currentChapterId.value = params.chapterId
    if (params.memoryProgress !== undefined) memoryProgressPercent.value = params.memoryProgress
    if (params.dominantEndingType !== undefined) dominantEndingType.value = params.dominantEndingType
  }

  return {
    currentSceneId,
    timeRemaining,
    moodStateId,
    endingTrajectory,
    gameState,
    currentTimePeriod,
    currentChapterId,
    memoryProgressPercent,
    dominantEndingType,
    timePressureLevel,
    sceneConfig,
    timeConfig,
    moodConfig,
    endingConfig,
    gameStateConfig,
    timePeriodConfig,
    computedEndingTrajectory,
    memoryImpact,
    musicContext,
    updateContext
  }
})
