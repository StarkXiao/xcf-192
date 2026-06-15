<template>
  <Transition name="ending-fade">
    <div v-if="mapStore.showEnding && mapStore.mapEnding" class="ending-overlay" :class="`ending-${mapStore.mapEnding.type}`">
      <div class="particles-container">
        <div
          v-for="i in particleCount"
          :key="i"
          class="particle"
          :class="particleType"
          :style="getParticleStyle(i)"
        ></div>
      </div>

      <div class="ending-content">
        <div class="ending-stage" v-if="showIntro">
          <div class="ending-emoji">{{ endingEmoji }}</div>
          <h1 class="ending-intro-title">{{ mapStore.mapEnding.title }}</h1>
        </div>

        <div class="ending-main" v-else>
          <div class="ending-type-badge" v-if="mapStore.mapEnding.type !== 'good' && mapStore.mapEnding.type !== 'normal'">
            <span class="badge-star">✦</span>
            {{ getTypeLabel(mapStore.mapEnding.type) }}
            <span class="badge-star">✦</span>
          </div>

          <h1 class="ending-title">{{ mapStore.mapEnding.title }}</h1>

          <div class="ending-divider"></div>

          <div class="ending-description-wrap">
            <p
              v-for="(para, idx) in descriptionParagraphs"
              :key="idx"
              class="ending-description"
            >
              {{ para }}
            </p>
          </div>

          <div class="ending-stats">
            <div class="stat-item">
              <span class="stat-icon">🗺️</span>
              <span class="stat-label">探索地点</span>
              <span class="stat-value">{{ mapStore.visitedCount }}/{{ mapStore.totalLocations }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🔍</span>
              <span class="stat-label">收集线索</span>
              <span class="stat-value">{{ mapStore.collectedCluesCount }}/{{ mapStore.totalClues }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💭</span>
              <span class="stat-label">唤醒回忆</span>
              <span class="stat-value">{{ mapStore.triggeredMemoriesCount }}/{{ mapStore.totalMemories }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📊</span>
              <span class="stat-label">综合完成度</span>
              <span class="stat-value highlight">{{ mapStore.progress }}%</span>
            </div>
          </div>

          <div class="ending-buttons">
            <button class="btn btn-primary" @click="restart">
              再次探索雾城
            </button>
            <button class="btn btn-outline" @click="closeAndBack">
              返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()

const showIntro = ref(true)
const particleCount = 35

onMounted(() => {
  const introDuration = mapStore.mapEnding?.type === 'legendary' ? 3500 : 2500
  setTimeout(() => {
    showIntro.value = false
  }, introDuration)
})

const descriptionParagraphs = computed(() => {
  const desc = mapStore.mapEnding?.description || ''
  return desc.split('\n').filter(p => p.trim())
})

const endingEmoji = computed(() => {
  const emojis = {
    legendary: '👑',
    epic: '🏆',
    perfect: '🌟',
    good: '🥰',
    normal: '💭'
  }
  return emojis[mapStore.mapEnding?.type] || '💭'
})

const particleType = computed(() => {
  const types = {
    legendary: 'sparkle',
    epic: 'stars',
    perfect: 'lavender',
    good: 'petals',
    normal: 'mist'
  }
  return types[mapStore.mapEnding?.type] || 'mist'
})

function getParticleStyle(index) {
  const seed = index * 37
  const left = (seed * 17) % 100
  const delay = (seed * 7) % 10
  const duration = 6 + ((seed * 3) % 8)
  const size = 6 + (seed % 8)
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

function getTypeLabel(type) {
  const labels = {
    legendary: '传说结局',
    epic: '史诗结局',
    special: '特殊结局',
    perfect: '完美结局'
  }
  return labels[type] || '结局'
}

function restart() {
  mapStore.resetMap()
  mapStore.enterMapMode()
}

function closeAndBack() {
  mapStore.closeEnding()
  mapStore.exitMapMode()
}
</script>

<style scoped>
.ending-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #2a1a3e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  overflow: hidden;
}

.ending-overlay.ending-legendary {
  background: linear-gradient(180deg, #1a0a00 0%, #3d2000 40%, #4a3008 100%);
}

.ending-overlay.ending-epic {
  background: linear-gradient(180deg, #1a0a2e 0%, #2d1f4d 40%, #3d2a6b 100%);
}

.ending-overlay.ending-good {
  background: linear-gradient(180deg, #1a1a2e 0%, #2d3d4a 40%, #3d4a6b 100%);
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  opacity: 0;
  animation: particle-fall linear infinite;
  pointer-events: none;
}

.particle.lavender {
  background: radial-gradient(circle, #b48ecf 0%, #9b59b6 100%);
  border-radius: 50%;
}

.particle.stars {
  background: radial-gradient(circle, #ffd700 0%, #ffec8b 100%);
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
}

.particle.petals {
  background: radial-gradient(ellipse, #ffb6c1 0%, #ff69b4 100%);
  border-radius: 60% 40% 60% 40%;
}

.particle.sparkle {
  background: radial-gradient(circle, #fff 0%, #ffd700 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px #fff, 0 0 20px #ffd700;
}

.particle.mist {
  background: radial-gradient(circle, rgba(200, 200, 220, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(10px);
}

@keyframes particle-fall {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0);
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) translateX(30px);
  }
}

.ending-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
}

.ending-stage {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ending-emoji {
  font-size: clamp(5rem, 15vw, 7rem);
  margin-bottom: 1.5rem;
  animation: ending-emoji-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ending-overlay.ending-legendary .ending-emoji {
  filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
  animation: ending-emoji-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), sparkle-rotate 2s ease-in-out infinite;
}

.ending-overlay.ending-epic .ending-emoji {
  filter: drop-shadow(0 0 30px rgba(192, 132, 252, 0.6));
}

@keyframes ending-emoji-in {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-20deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

@keyframes sparkle-rotate {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)); }
}

.ending-intro-title {
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 300;
  letter-spacing: 0.3rem;
  color: #fff;
  animation: ending-title-in 2s ease-out;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  margin: 0;
}

.ending-overlay.ending-legendary .ending-intro-title {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ending-title-in 2s ease-out, gradient-shift 3s ease infinite;
}

.ending-overlay.ending-epic .ending-intro-title {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #818cf8);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes ending-title-in {
  0% { opacity: 0; letter-spacing: 1rem; }
  100% { opacity: 1; letter-spacing: 0.3rem; }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.ending-type-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.ending-overlay.ending-epic .ending-type-badge {
  color: #c084fc;
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.3);
}

.badge-star {
  margin: 0 0.3rem;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.ending-title {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 400;
  letter-spacing: 0.2rem;
  margin-bottom: 0.8rem;
  color: #e8e8f0;
}

.ending-overlay.ending-legendary .ending-title {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ff8c00);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

.ending-overlay.ending-epic .ending-title {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ending-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  margin: 0 auto 1.5rem;
}

.ending-description-wrap {
  margin-bottom: 2rem;
}

.ending-description {
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  color: #c8c8d8;
  line-height: 2.2;
  max-width: 520px;
  margin: 0 auto 0.8rem;
  text-align: justify;
  text-indent: 2em;
}

.ending-description:last-child {
  margin-bottom: 0;
  font-style: italic;
  color: #a0a0b8;
  text-indent: 0;
  text-align: center;
}

.ending-stats {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.stat-icon {
  font-size: 1.1rem;
}

.stat-label {
  flex: 1;
  color: #a0a0b0;
  font-size: 0.85rem;
  text-align: left;
}

.stat-value {
  color: #e0e0f0;
  font-weight: 600;
  font-size: 0.95rem;
}

.stat-value.highlight {
  color: #fbbf24;
  font-size: 1.1rem;
}

.ending-overlay.ending-legendary .stat-value.highlight {
  color: #ffd700;
}

.ending-buttons {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
}

.btn {
  padding: 0.85rem 1.8rem;
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #c0c0d0;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.ending-fade-enter-active,
.ending-fade-leave-active {
  transition: opacity 0.6s ease;
}

.ending-fade-enter-from,
.ending-fade-leave-to {
  opacity: 0;
}
</style>
