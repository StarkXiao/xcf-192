<template>
  <Transition name="memory-fade">
    <div v-if="mapStore.showMemoryModal && mapStore.currentMemory" class="memory-overlay">
      <div class="memory-container" :class="`emotion-${mapStore.currentMemory.emotion}`">
        <div class="memory-glow"></div>
        <div class="memory-content">
          <div class="memory-emoji">
            {{ getEmoji(mapStore.currentMemory.emotion) }}
          </div>

          <h3 class="memory-title">{{ mapStore.currentMemory.title }}</h3>

          <div class="memory-divider"></div>

          <div class="memory-text-wrap">
            <p class="memory-text">
              {{ mapStore.currentMemory.content }}
            </p>
          </div>

          <div class="memory-meta">
            <span class="memory-tag" :class="`tag-${mapStore.currentMemory.emotion}`">
              {{ getEmotionLabel(mapStore.currentMemory.emotion) }}
            </span>
          </div>

          <button class="memory-close-btn" @click="mapStore.closeMemoryModal">
            将这段回忆珍藏于心 →
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()

function getEmoji(emotion) {
  const map = {
    sad: '😢',
    warm: '🥰',
    pensive: '🤔',
    happy: '😊',
    sweet: '🍬',
    nervous: '😰',
    bittersweet: '😌',
    shocking: '😲',
    romantic: '💕',
    regret: '💔',
    melancholy: '🌧️',
    touched: '🥹',
    determined: '💪'
  }
  return map[emotion] || '💭'
}

function getEmotionLabel(emotion) {
  const map = {
    sad: '悲伤',
    warm: '温暖',
    pensive: '沉思',
    happy: '喜悦',
    sweet: '甜蜜',
    nervous: '紧张',
    bittersweet: '苦乐参半',
    shocking: '震惊',
    romantic: '浪漫',
    regret: '遗憾',
    melancholy: '忧郁',
    touched: '感动',
    determined: '坚定'
  }
  return map[emotion] || '回忆'
}
</script>

<style scoped>
.memory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1.5rem;
}

.memory-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  padding: 2.5rem 2rem;
  background: linear-gradient(180deg, rgba(30, 30, 50, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%);
  border-radius: 24px;
  border: 1px solid rgba(167, 139, 250, 0.25);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.memory-glow {
  position: absolute;
  top: -50%;
  left: -20%;
  width: 140%;
  height: 80%;
  background: radial-gradient(ellipse, rgba(167, 139, 250, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.memory-container.emotion-sad .memory-glow {
  background: radial-gradient(ellipse, rgba(100, 100, 150, 0.15) 0%, transparent 60%);
}
.memory-container.emotion-warm .memory-glow {
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.12) 0%, transparent 60%);
}
.memory-container.emotion-romantic .memory-glow {
  background: radial-gradient(ellipse, rgba(244, 114, 182, 0.15) 0%, transparent 60%);
}
.memory-container.emotion-happy .memory-glow,
.memory-container.emotion-sweet .memory-glow {
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.15) 0%, transparent 60%);
}
.memory-container.emotion-touched .memory-glow {
  background: radial-gradient(ellipse, rgba(192, 132, 252, 0.15) 0%, transparent 60%);
}

.memory-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.memory-emoji {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: memory-emoji-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes memory-emoji-in {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-15deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.memory-title {
  font-size: 1.4rem;
  color: #e8e8f0;
  margin: 0 0 1rem 0;
  font-weight: 500;
  letter-spacing: 0.08rem;
}

.memory-container.emotion-romantic .memory-title {
  color: #f9a8d4;
}
.memory-container.emotion-warm .memory-title,
.memory-container.emotion-happy .memory-title {
  color: #fde68a;
}
.memory-container.emotion-sad .memory-title,
.memory-container.emotion-regret .memory-title {
  color: #94a3b8;
}

.memory-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), transparent);
  margin: 0 auto 1.5rem;
}

.memory-text-wrap {
  margin-bottom: 1.5rem;
}

.memory-text {
  color: #c8c8d8;
  line-height: 2.1;
  font-size: 0.95rem;
  margin: 0;
  text-align: justify;
  text-indent: 2em;
  animation: memory-text-in 1s ease-out 0.2s both;
}

@keyframes memory-text-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.memory-meta {
  margin-bottom: 1.8rem;
}

.memory-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.25);
}

.memory-tag.tag-sad,
.memory-tag.tag-regret,
.memory-tag.tag-melancholy {
  background: rgba(100, 116, 139, 0.15);
  color: #94a3b8;
  border-color: rgba(100, 116, 139, 0.3);
}

.memory-tag.tag-warm,
.memory-tag.tag-happy,
.memory-tag.tag-sweet {
  background: rgba(251, 191, 36, 0.12);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.25);
}

.memory-tag.tag-romantic {
  background: rgba(244, 114, 182, 0.12);
  color: #f472b6;
  border-color: rgba(244, 114, 182, 0.25);
}

.memory-tag.tag-touched {
  background: rgba(192, 132, 252, 0.12);
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.25);
}

.memory-close-btn {
  padding: 0.85rem 1.8rem;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.05rem;
}

.memory-close-btn:hover {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0.3));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(167, 139, 250, 0.25);
}

.memory-fade-enter-active,
.memory-fade-leave-active {
  transition: opacity 0.4s ease;
}

.memory-fade-enter-active .memory-container,
.memory-fade-leave-active .memory-container {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.memory-fade-enter-from,
.memory-fade-leave-to {
  opacity: 0;
}

.memory-fade-enter-from .memory-container,
.memory-fade-leave-to .memory-container {
  transform: scale(0.85);
  opacity: 0;
}
</style>
