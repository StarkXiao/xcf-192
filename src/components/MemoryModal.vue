<template>
  <Transition name="fade">
    <div v-if="showModal" class="memory-modal-overlay" @click.self="closeModal">
      <div class="memory-modal" :class="emotionClass">
        <div class="memory-header">
          <span class="memory-year">{{ memory?.year }}</span>
          <span class="memory-emoji">{{ emotionEmoji }}</span>
        </div>
        
        <h2 class="memory-title">{{ memory?.title }}</h2>
        
        <div class="memory-divider"></div>
        
        <div class="memory-content">
          {{ memory?.content }}
        </div>
        
        <div class="memory-footer">
          <div class="memory-item-info">
            <span class="item-icon">{{ item?.icon }}</span>
            <span class="item-name">{{ item?.name }}</span>
          </div>
          <button class="close-btn" @click="closeModal">
            继续寻找
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()

const showModal = computed(() => gameStore.showMemoryModal)
const memory = computed(() => gameStore.currentMemory)

const item = computed(() => {
  if (memory.value) {
    return storyStore.getItemById(memory.value.triggerItemId)
  }
  return null
})

const emotionEmoji = computed(() => {
  const emotions = {
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
  return emotions[memory.value?.emotion] || '💭'
})

const emotionClass = computed(() => {
  return `emotion-${memory.value?.emotion || 'default'}`
})

function closeModal() {
  gameStore.closeMemory()
}
</script>

<style scoped>
.memory-modal-overlay {
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
}

.memory-modal {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.98));
  border-radius: 20px;
  padding: 2rem;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.5s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.memory-modal.emotion-sad {
  border-color: rgba(100, 150, 255, 0.3);
}

.memory-modal.emotion-warm {
  border-color: rgba(255, 180, 100, 0.3);
}

.memory-modal.emotion-romantic {
  border-color: rgba(255, 100, 150, 0.3);
}

.memory-modal.emotion-happy {
  border-color: rgba(255, 220, 100, 0.3);
}

.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.memory-year {
  color: #a0a0b0;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
}

.memory-emoji {
  font-size: 2rem;
}

.memory-title {
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  color: #e8e8f0;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.memory-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin-bottom: 1.5rem;
}

.memory-content {
  color: #c0c0d0;
  line-height: 2;
  font-size: clamp(0.9rem, 2.6vw, 1.05rem);
  text-align: justify;
  margin-bottom: 1.5rem;
  text-indent: 2em;
}

.memory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.memory-item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0b0;
  font-size: 0.9rem;
}

.item-icon {
  font-size: 1.5rem;
}

.close-btn {
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.close-btn:active {
  transform: translateY(0);
}
</style>
