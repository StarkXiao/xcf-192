<template>
  <Transition name="fade">
    <div v-if="showModal" class="memory-modal-overlay" @click.self="closeModal">
      <div class="memory-modal" :class="[emotionClass, { 'hidden-memory': isHidden }]">
        <div v-if="isHidden" class="hidden-memory-banner">
          <span class="banner-star">✦</span>
          隐藏回忆解锁
          <span class="banner-star">✦</span>
        </div>
        
        <div class="memory-header">
          <span class="memory-year">{{ memory?.year }}</span>
          <span class="memory-emoji">{{ emotionEmoji }}</span>
        </div>
        
        <h2 class="memory-title" :class="{ 'hidden-title': isHidden }">
          {{ memory?.title }}
        </h2>
        
        <div class="memory-divider" :class="{ 'hidden-divider': isHidden }"></div>
        
        <div class="memory-content" :class="{ 'hidden-content': isHidden }" :style="contentStyle">
          {{ toneModifiedContent }}
        </div>
        
        <div class="memory-footer">
          <div class="memory-item-info">
            <span class="item-icon">{{ item?.icon }}</span>
            <div class="item-text">
              <span class="item-name">{{ item?.name }}</span>
              <span v-if="isHidden" class="item-tag">合成道具</span>
            </div>
          </div>
          <button class="close-btn" :class="{ 'hidden-btn': isHidden }" @click="closeModal">
            {{ isHidden ? '继续探索' : '继续寻找' }}
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
const textTone = computed(() => gameStore.textTone)
const moodStateId = computed(() => gameStore.moodStateId)

const isHidden = computed(() => memory.value?.isHidden === true)

const item = computed(() => {
  if (memory.value) {
    if (isHidden.value && memory.value.triggerCraftId) {
      return storyStore.getCraftedItemById(memory.value.triggerCraftId)
    }
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
  return `emotion-${memory.value?.emotion || 'default'} mood-${moodStateId.value}`
})

const toneModifiedContent = computed(() => {
  if (!memory.value) return ''
  const tone = textTone.value
  let content = memory.value.content
  
  if (tone.prefix) {
    content = tone.prefix + ' ' + content
  }
  
  return content
})

const contentStyle = computed(() => {
  const tone = textTone.value
  const style = {}
  if (tone.color) {
    style.color = tone.color
  }
  if (tone.italic) {
    style.fontStyle = 'italic'
  }
  return style
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
  position: relative;
}

.memory-modal.hidden-memory {
  background: linear-gradient(145deg, rgba(50, 40, 20, 0.98), rgba(40, 30, 10, 0.99));
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.2);
  animation: modalIn 0.5s ease, hiddenShine 3s ease-in-out infinite;
}

@keyframes hiddenShine {
  0%, 100% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.15); }
  50% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.35); }
}

.hidden-memory-banner {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a00;
  font-weight: 600;
  border-radius: 20px;
  font-size: 0.85rem;
  letter-spacing: 0.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  white-space: nowrap;
}

.banner-star {
  font-size: 0.9rem;
  animation: twinkle 1.5s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
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

.memory-modal.mood-despair {
  background: linear-gradient(145deg, rgba(40, 20, 20, 0.95), rgba(30, 15, 15, 0.98));
  border-color: rgba(100, 50, 50, 0.4);
}

.memory-modal.mood-gloomy {
  background: linear-gradient(145deg, rgba(35, 35, 50, 0.95), rgba(25, 25, 40, 0.98));
  border-color: rgba(80, 80, 120, 0.3);
}

.memory-modal.mood-calm {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.98));
  border-color: rgba(100, 120, 150, 0.3);
}

.memory-modal.mood-warm {
  background: linear-gradient(145deg, rgba(50, 35, 25, 0.95), rgba(40, 28, 20, 0.98));
  border-color: rgba(200, 140, 100, 0.3);
}

.memory-modal.mood-hopeful {
  background: linear-gradient(145deg, rgba(50, 40, 20, 0.95), rgba(40, 32, 16, 0.98));
  border-color: rgba(230, 180, 120, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(230, 180, 120, 0.15);
}

.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.memory-year {
  color: #a0a0b0;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
}

.hidden-memory .memory-year {
  color: #d4a574;
}

.memory-emoji {
  font-size: 2rem;
}

.hidden-memory .memory-emoji {
  animation: emoji-bounce 2s ease-in-out infinite;
}

@keyframes emoji-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.memory-title {
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  color: #e8e8f0;
  margin-bottom: 1rem;
  font-weight: 500;
  text-align: center;
}

.memory-title.hidden-title {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.memory-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin-bottom: 1.5rem;
}

.memory-divider.hidden-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
  height: 3px;
}

.memory-content {
  color: #c0c0d0;
  line-height: 2;
  font-size: clamp(0.9rem, 2.6vw, 1.05rem);
  text-align: justify;
  margin-bottom: 1.5rem;
  text-indent: 2em;
}

.memory-content.hidden-content {
  color: #e8d5a8;
  font-style: italic;
}

.memory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.hidden-memory .memory-footer {
  border-top-color: rgba(255, 215, 0, 0.2);
}

.memory-item-info {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #a0a0b0;
  font-size: 0.9rem;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: flex-start;
}

.item-icon {
  font-size: 1.8rem;
}

.item-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
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

.close-btn.hidden-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  color: #1a1a00;
  font-weight: 600;
}

.close-btn.hidden-btn:hover {
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
}
</style>
