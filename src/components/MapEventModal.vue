<template>
  <Transition name="modal-fade">
    <div v-if="mapStore.showEventModal && mapStore.currentEvent" class="modal-overlay">
      <div class="modal-content event-modal">
        <div class="event-header">
          <span class="event-icon">💫</span>
          <h2 class="event-title">{{ mapStore.currentEvent.title }}</h2>
        </div>

        <div class="event-body" v-if="!mapStore.currentEventResult">
          <p class="event-description">{{ mapStore.currentEvent.description }}</p>

          <div class="event-choices">
            <button
              v-for="choice in mapStore.currentEvent.choices"
              :key="choice.id"
              class="choice-btn"
              @click="makeChoice(choice.id)"
            >
              {{ choice.label }}
            </button>
          </div>
        </div>

        <div class="event-body result-body" v-else>
          <p class="result-text">{{ mapStore.currentEventResult.resultText }}</p>

          <div class="result-effects" v-if="hasEffects">
            <div class="effect-item mood-effect" v-if="moodChange">
              <span class="effect-icon">{{ moodChange > 0 ? '💖' : '💔' }}</span>
              <span class="effect-text">心绪 {{ moodChange > 0 ? '+' : '' }}{{ moodChange }}</span>
            </div>
            <div class="effect-item clue-effect" v-if="gotClue">
              <span class="effect-icon">🔍</span>
              <span class="effect-text">获得线索</span>
            </div>
            <div class="effect-item memory-effect" v-if="gotMemory">
              <span class="effect-icon">💭</span>
              <span class="effect-text">唤醒回忆</span>
            </div>
            <div class="effect-item unlock-effect" v-if="gotUnlock">
              <span class="effect-icon">🗺️</span>
              <span class="effect-text">解锁新地点</span>
            </div>
          </div>

          <button class="btn btn-primary continue-btn" @click="mapStore.closeEventModal">
            继续探索 →
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()

const resultEffects = computed(() => {
  return mapStore.currentEventResult?.effects || {}
})

const moodChange = computed(() => resultEffects.value.mood ?? null)
const gotClue = computed(() => !!resultEffects.value.clue)
const gotMemory = computed(() => !!resultEffects.value.memory)
const gotUnlock = computed(() => !!resultEffects.value.unlock)

const hasEffects = computed(() => {
  return moodChange.value !== null || gotClue.value || gotMemory.value || gotUnlock.value
})

function makeChoice(choiceId) {
  mapStore.makeEventChoice(choiceId)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(180deg, #1e1e32 0%, #151528 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  border: 1px solid rgba(251, 191, 36, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 60px rgba(251, 191, 36, 0.08);
}

.event-header {
  padding: 1.8rem 1.5rem 1.2rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.12) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.event-icon {
  font-size: 2.8rem;
  display: block;
  margin-bottom: 0.6rem;
  animation: icon-float 3s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.event-title {
  font-size: 1.35rem;
  color: #fbbf24;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.05rem;
}

.event-body {
  padding: 1.5rem;
}

.event-description {
  color: #d0d0e0;
  line-height: 1.9;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.choice-btn {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e0e0f0;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  line-height: 1.5;
}

.choice-btn:hover {
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.3);
  transform: translateX(4px);
}

.result-body {
  text-align: center;
}

.result-text {
  color: #e8e8f0;
  line-height: 2;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  text-align: justify;
  text-indent: 2em;
}

.result-effects {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.mood-effect {
  background: rgba(244, 114, 182, 0.12);
  color: #f472b6;
  border: 1px solid rgba(244, 114, 182, 0.25);
}

.clue-effect {
  background: rgba(165, 180, 252, 0.12);
  color: #a5b4fc;
  border: 1px solid rgba(165, 180, 252, 0.25);
}

.memory-effect {
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.25);
}

.unlock-effect {
  background: rgba(134, 239, 172, 0.12);
  color: #86efac;
  border: 1px solid rgba(134, 239, 172, 0.25);
}

.effect-icon {
  font-size: 1rem;
}

.btn {
  padding: 0.8rem 1.5rem;
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
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.continue-btn {
  min-width: 160px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.35s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
