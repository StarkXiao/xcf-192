<template>
  <Transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content memory-list-modal">
        <div class="modal-header">
          <div class="header-title-wrap">
            <span class="header-icon">💭</span>
            <h2 class="modal-title">回忆图鉴</h2>
          </div>
          <div class="header-progress">
            <span class="progress-num">{{ mapStore.triggeredMemoriesCount }}</span>
            <span class="progress-sep">/</span>
            <span class="progress-total">{{ mapStore.totalMemories }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>

        <div class="modal-body">
          <div class="memory-progress-bar">
            <div class="memory-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <div class="memories-grid" v-if="allMemories.length > 0">
            <div
              v-for="mem in allMemories"
              :key="mem.id"
              class="memory-card"
              :class="{ unlocked: isTriggered(mem.id), [`emotion-${mem.emotion}`]: isTriggered(mem.id) }"
              @click="openMemory(mem)"
            >
              <span class="mem-icon">{{ isTriggered(mem.id) ? getEmoji(mem.emotion) : '🔒' }}</span>
              <span class="mem-title">{{ isTriggered(mem.id) ? mem.title : '???' }}</span>
              <span v-if="isTriggered(mem.id)" class="mem-emotion-tag">
                {{ getEmotionLabel(mem.emotion) }}
              </span>
            </div>
          </div>

          <div class="empty-state" v-else>
            <span class="empty-icon">💭</span>
            <p class="empty-text">还没有唤醒任何回忆</p>
            <p class="empty-hint">在雾城的各个角落探索吧</p>
          </div>
        </div>
      </div>

      <Transition name="memory-fade">
        <div v-if="selectedMemory" class="memory-overlay" @click.self="selectedMemory = null">
          <div class="memory-container" :class="`emotion-${selectedMemory.emotion}`">
            <div class="memory-glow"></div>
            <div class="memory-content">
              <div class="memory-emoji">{{ getEmoji(selectedMemory.emotion) }}</div>
              <h3 class="memory-title">{{ selectedMemory.title }}</h3>
              <div class="memory-divider"></div>
              <div class="memory-text-wrap">
                <p class="memory-text">{{ selectedMemory.content }}</p>
              </div>
              <div class="memory-meta">
                <span class="memory-tag" :class="`tag-${selectedMemory.emotion}`">
                  {{ getEmotionLabel(selectedMemory.emotion) }}
                </span>
              </div>
              <button class="memory-close-btn" @click="selectedMemory = null">
                关闭
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { mapLocations } from '../data/mapData'

const mapStore = useMapStore()
defineEmits(['close'])

const selectedMemory = ref(null)

const allMemories = computed(() => {
  const memories = []
  for (const loc of mapLocations) {
    if (loc.memories) {
      for (const mem of loc.memories) {
        memories.push({ ...mem, locationName: loc.name })
      }
    }
  }
  return memories
})

const progressPercent = computed(() => {
  if (mapStore.totalMemories === 0) return 0
  return (mapStore.triggeredMemoriesCount / mapStore.totalMemories) * 100
})

function isTriggered(memId) {
  return mapStore.triggeredMemories.includes(memId)
}

function openMemory(mem) {
  if (!isTriggered(mem.id)) return
  selectedMemory.value = mem
}

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.header-icon {
  font-size: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  color: #e8e8f0;
  margin: 0;
  font-weight: 500;
}

.header-progress {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  color: #a78bfa;
  font-weight: 600;
}

.progress-num {
  font-size: 1.3rem;
}

.progress-sep {
  color: #707080;
}

.progress-total {
  font-size: 0.95rem;
  color: #a0a0b0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.memory-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.memory-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #c084fc);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.7rem;
}

.memory-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: default;
}

.memory-card.unlocked {
  opacity: 1;
  cursor: pointer;
}

.memory-card.unlocked:hover {
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.25);
  transform: translateY(-2px);
}

.memory-card.unlocked.emotion-romantic {
  border-color: rgba(244, 114, 182, 0.2);
}
.memory-card.unlocked.emotion-romantic:hover {
  background: rgba(244, 114, 182, 0.06);
  border-color: rgba(244, 114, 182, 0.35);
}

.memory-card.unlocked.emotion-warm,
.memory-card.unlocked.emotion-happy {
  border-color: rgba(251, 191, 36, 0.2);
}

.mem-icon {
  font-size: 1.8rem;
}

.mem-title {
  font-size: 0.82rem;
  color: #c0c0d0;
  text-align: center;
  font-weight: 500;
}

.mem-emotion-tag {
  font-size: 0.68rem;
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
}

.empty-state {
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
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.empty-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #606070;
}

.memory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
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
.memory-container.emotion-warm .memory-glow,
.memory-container.emotion-happy .memory-glow {
  background: radial-gradient(ellipse, rgba(251, 191, 36, 0.12) 0%, transparent 60%);
}
.memory-container.emotion-romantic .memory-glow {
  background: radial-gradient(ellipse, rgba(244, 114, 182, 0.15) 0%, transparent 60%);
}

.memory-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.memory-emoji {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.memory-title {
  font-size: 1.3rem;
  color: #e8e8f0;
  margin: 0 0 1rem 0;
  font-weight: 500;
  letter-spacing: 0.05rem;
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
  line-height: 2;
  font-size: 0.92rem;
  margin: 0;
  text-align: justify;
  text-indent: 2em;
}

.memory-meta {
  margin-bottom: 1.5rem;
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

.memory-close-btn {
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.memory-close-btn:hover {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0.3));
  transform: translateY(-2px);
}

.modal-fade-enter-active,
.modal-fade-leave-active,
.memory-fade-enter-active,
.memory-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to,
.memory-fade-enter-from,
.memory-fade-leave-to {
  opacity: 0;
}
</style>
