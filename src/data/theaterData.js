import { memories, hiddenMemories } from './storyData'

const EMOTION_MUSIC_MAP = {
  sad: { freq: 55, pad: 110, filter: 600, brightness: 0.15, chordIntervals: [0, 3, 7, 10] },
  warm: { freq: 82, pad: 165, filter: 2500, brightness: 0.7, chordIntervals: [0, 4, 7, 11] },
  pensive: { freq: 65, pad: 130, filter: 1200, brightness: 0.4, chordIntervals: [0, 4, 7, 12] },
  happy: { freq: 98, pad: 196, filter: 3000, brightness: 0.8, chordIntervals: [0, 4, 7, 11] },
  sweet: { freq: 98, pad: 196, filter: 2800, brightness: 0.75, chordIntervals: [0, 4, 7, 11] },
  nervous: { freq: 73, pad: 146, filter: 900, brightness: 0.3, chordIntervals: [0, 3, 7, 10] },
  bittersweet: { freq: 65, pad: 130, filter: 1400, brightness: 0.45, chordIntervals: [0, 4, 7, 12] },
  shocking: { freq: 55, pad: 110, filter: 800, brightness: 0.25, chordIntervals: [0, 3, 7, 10] },
  romantic: { freq: 82, pad: 165, filter: 2200, brightness: 0.7, chordIntervals: [0, 4, 7, 11] },
  regret: { freq: 55, pad: 110, filter: 700, brightness: 0.2, chordIntervals: [0, 3, 7, 10] },
  melancholy: { freq: 55, pad: 110, filter: 800, brightness: 0.3, chordIntervals: [0, 3, 7, 12] },
  touched: { freq: 73, pad: 146, filter: 1800, brightness: 0.55, chordIntervals: [0, 4, 7, 12] },
  determined: { freq: 73, pad: 146, filter: 2000, brightness: 0.6, chordIntervals: [0, 4, 7, 11] },
  heartbreak: { freq: 49, pad: 98, filter: 500, brightness: 0.1, chordIntervals: [0, 3, 6, 10] }
}

const SHOT_BACKGROUNDS = {
  station: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 40%, #1f3460 100%)',
  street: 'linear-gradient(180deg, #1a1a2e 0%, #2c3e50 40%, #34495e 100%)',
  cafe: 'linear-gradient(180deg, #1a150a 0%, #3d2914 40%, #5d4e37 100%)',
  park: 'linear-gradient(180deg, #1a1520 0%, #4a2040 40%, #6a3050 100%)',
  bookstore: 'linear-gradient(180deg, #1a1510 0%, #4a3728 40%, #5a3a1a 100%)',
  lake: 'linear-gradient(180deg, #050510 0%, #0a1530 40%, #102040 100%)',
  void: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #0f0f1a 100%)'
}

const EMOTION_OVERLAY = {
  sad: 'radial-gradient(ellipse at 50% 80%, rgba(100,100,150,0.15) 0%, transparent 60%)',
  warm: 'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.12) 0%, transparent 60%)',
  pensive: 'radial-gradient(ellipse at 50% 80%, rgba(96,165,250,0.1) 0%, transparent 60%)',
  happy: 'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.15) 0%, transparent 60%)',
  sweet: 'radial-gradient(ellipse at 50% 80%, rgba(244,114,182,0.12) 0%, transparent 60%)',
  nervous: 'radial-gradient(ellipse at 50% 80%, rgba(96,165,250,0.08) 0%, transparent 60%)',
  bittersweet: 'radial-gradient(ellipse at 50% 80%, rgba(192,132,252,0.1) 0%, transparent 60%)',
  shocking: 'radial-gradient(ellipse at 50% 80%, rgba(239,68,68,0.12) 0%, transparent 60%)',
  romantic: 'radial-gradient(ellipse at 50% 80%, rgba(244,114,182,0.15) 0%, transparent 60%)',
  regret: 'radial-gradient(ellipse at 50% 80%, rgba(100,116,139,0.12) 0%, transparent 60%)',
  melancholy: 'radial-gradient(ellipse at 50% 80%, rgba(100,116,139,0.1) 0%, transparent 60%)',
  touched: 'radial-gradient(ellipse at 50% 80%, rgba(192,132,252,0.12) 0%, transparent 60%)',
  determined: 'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.1) 0%, transparent 60%)',
  heartbreak: 'radial-gradient(ellipse at 50% 80%, rgba(239,68,68,0.15) 0%, transparent 60%)'
}

const ITEM_SCENE_MAP = {
  ticket: 'station', scarf: 'station', watch: 'station',
  photo: 'street', icecream: 'street', letter: 'street',
  cup: 'cafe', ring: 'cafe', notebook: 'cafe',
  flower: 'park', balloon: 'park', carving: 'park',
  book: 'bookstore', bookmark: 'bookstore', glasses: 'bookstore',
  bottle: 'lake', necklace: 'lake', promise: 'lake'
}

const CRAFT_SCENE_MAP = {
  time_key: 'station', promise_ring: 'cafe', memory_book: 'bookstore',
  summer_locket: 'park', eternal_bouquet: 'park', lake_message: 'lake'
}

function decomposeContent(content) {
  const sentences = content.match(/[^。！？]+[。！？]/g) || [content]
  const chunks = []
  let current = ''
  for (const s of sentences) {
    current += s
    if (current.length >= 30 || s.match(/[！？]/)) {
      chunks.push(current)
      current = ''
    }
  }
  if (current) chunks.push(current)
  return chunks.length > 0 ? chunks : [content]
}

function buildTheaterShots(memory, sceneId) {
  const shots = []
  const bg = SHOT_BACKGROUNDS[sceneId] || SHOT_BACKGROUNDS.void
  const musicConfig = EMOTION_MUSIC_MAP[memory.emotion] || EMOTION_MUSIC_MAP.pensive

  shots.push({
    type: 'opening',
    background: bg,
    overlay: EMOTION_OVERLAY[memory.emotion] || EMOTION_OVERLAY.pensive,
    narration: '',
    subtitle: memory.title,
    subtitleSub: memory.year || '',
    emotion: memory.emotion,
    music: { ...musicConfig, brightness: Math.max(0.05, musicConfig.brightness * 0.3) },
    duration: 2500,
    effect: memory.isHidden ? 'sparkle' : 'fadeIn'
  })

  const contentChunks = decomposeContent(memory.content)
  contentChunks.forEach((chunk, idx) => {
    const isFirst = idx === 0
    const isLast = idx === contentChunks.length - 1
    let chunkEmotion = memory.emotion
    let chunkOverlay = EMOTION_OVERLAY[memory.emotion]

    if (chunk.includes('泪') || chunk.includes('哭') || chunk.includes('心碎')) {
      chunkEmotion = 'sad'
      chunkOverlay = EMOTION_OVERLAY.sad
    } else if (chunk.includes('笑') || chunk.includes('开心') || chunk.includes('甜')) {
      chunkEmotion = 'happy'
      chunkOverlay = EMOTION_OVERLAY.happy
    } else if (chunk.includes('遗憾') || chunk.includes('如果') || chunk.includes('可惜')) {
      chunkEmotion = 'regret'
      chunkOverlay = EMOTION_OVERLAY.regret
    }

    const chunkMusic = EMOTION_MUSIC_MAP[chunkEmotion] || musicConfig
    const musicBrightness = isLast
      ? Math.max(0.05, chunkMusic.brightness * 0.4)
      : isFirst
        ? Math.max(0.05, chunkMusic.brightness * 0.6)
        : chunkMusic.brightness

    shots.push({
      type: 'narration',
      background: bg,
      overlay: chunkOverlay,
      narration: chunk,
      subtitle: '',
      emotion: chunkEmotion,
      music: { ...chunkMusic, brightness: musicBrightness },
      duration: Math.max(2500, chunk.length * 120),
      effect: null
    })
  })

  if (memory.timeVariants) {
    const variantKeys = Object.keys(memory.timeVariants)
    const chosenKey = variantKeys[Math.floor(Math.random() * variantKeys.length)] || variantKeys[0]
    const variant = memory.timeVariants[chosenKey]

    if (variant) {
      const variantChunks = decomposeContent(variant.content)
      const variantMusic = EMOTION_MUSIC_MAP[variant.emotion] || musicConfig

      shots.push({
        type: 'transition',
        background: bg,
        overlay: EMOTION_OVERLAY[variant.emotion] || EMOTION_OVERLAY.pensive,
        narration: '',
        subtitle: variant.title || '回忆的另一面',
        subtitleSub: '',
        emotion: variant.emotion,
        music: { ...variantMusic, brightness: Math.max(0.05, variantMusic.brightness * 0.4) },
        duration: 2000,
        effect: 'ripple'
      })

      variantChunks.forEach((chunk, idx) => {
        const isLast = idx === variantChunks.length - 1
        shots.push({
          type: 'narration',
          background: bg,
          overlay: EMOTION_OVERLAY[variant.emotion] || EMOTION_OVERLAY.pensive,
          narration: chunk,
          subtitle: '',
          emotion: variant.emotion,
          music: { ...variantMusic, brightness: isLast ? Math.max(0.05, variantMusic.brightness * 0.3) : variantMusic.brightness },
          duration: Math.max(2500, chunk.length * 120),
          effect: null
        })
      })
    }
  }

  shots.push({
    type: 'closing',
    background: bg,
    overlay: EMOTION_OVERLAY[memory.emotion] || EMOTION_OVERLAY.pensive,
    narration: '',
    subtitle: '—— 回忆落幕 ——',
    subtitleSub: getEmotionLabel(memory.emotion),
    emotion: memory.emotion,
    music: { ...musicConfig, brightness: Math.max(0.02, musicConfig.brightness * 0.15) },
    duration: 3000,
    effect: 'fadeOut'
  })

  return shots
}

function getEmotionLabel(emotion) {
  const map = {
    sad: '悲伤', warm: '温暖', pensive: '沉思', happy: '喜悦',
    sweet: '甜蜜', nervous: '紧张', bittersweet: '苦乐参半',
    shocking: '震惊', romantic: '浪漫', regret: '遗憾',
    melancholy: '忧郁', touched: '感动', determined: '坚定',
    heartbreak: '心碎'
  }
  return map[emotion] || '回忆'
}

function buildTheaterData() {
  const theaterMap = {}

  for (const memory of memories) {
    const sceneId = ITEM_SCENE_MAP[memory.triggerItemId] || 'void'
    theaterMap[memory.id] = {
      memoryId: memory.id,
      title: memory.title,
      emotion: memory.emotion,
      year: memory.year,
      isHidden: false,
      sceneId,
      shots: buildTheaterShots(memory, sceneId)
    }
  }

  for (const hm of hiddenMemories) {
    const sceneId = CRAFT_SCENE_MAP[hm.triggerCraftId] || 'void'
    theaterMap[hm.id] = {
      memoryId: hm.id,
      title: hm.title,
      emotion: hm.emotion,
      year: hm.year,
      isHidden: true,
      sceneId,
      shots: buildTheaterShots(hm, sceneId)
    }
  }

  return theaterMap
}

export const theaterData = buildTheaterData()

export function getTheaterScript(memoryId) {
  return theaterData[memoryId] || null
}

export function getAvailableTheaterScripts(unlockedMemoryIds, unlockedHMIds) {
  const scripts = []
  for (const id of unlockedMemoryIds) {
    if (theaterData[id]) scripts.push(theaterData[id])
  }
  for (const id of unlockedHMIds) {
    if (theaterData[id]) scripts.push(theaterData[id])
  }
  return scripts.sort((a, b) => {
    if (a.isHidden !== b.isHidden) return a.isHidden ? 1 : -1
    return 0
  })
}

export { EMOTION_MUSIC_MAP, getEmotionLabel }
