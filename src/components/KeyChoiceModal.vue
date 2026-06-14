<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showKeyChoiceModal || showKeyChoiceResult" class="key-choice-overlay" @click.self="handleOverlayClick">
        <div class="key-choice-modal" :class="{ 'result-mode': showKeyChoiceResult }">
          <div v-if="!showKeyChoiceResult && currentKeyChoice" class="choice-content">
            <div class="choice-header">
              <span class="choice-icon">🌿</span>
              <h2 class="choice-title">{{ currentKeyChoice.title }}</h2>
            </div>
            <p class="choice-description">{{ currentKeyChoice.description }}</p>
            <div class="choice-options">
              <button
                v-for="option in currentKeyChoice.options"
                :key="option.id"
                class="choice-option-btn"
                :class="{ disabled: !canChooseOption(option) }"
                @click="handleChoice(option.id)"
              >
                <span class="option-label">{{ option.label }}</span>
                <span v-if="!canChooseOption(option)" class="option-lock">🔒</span>
              </button>
            </div>
            <div v-if="choiceError" class="choice-error">{{ choiceError }}</div>
          </div>

          <div v-else-if="showKeyChoiceResult && keyChoiceResult" class="result-content">
            <div class="result-icon">✨</div>
            <h3 class="result-title">你的选择</h3>
            <p class="result-text">{{ keyChoiceResult.resultText }}</p>
            <div v-if="keyChoiceResult.effects?.mood" class="result-effects">
              <span class="effect-tag" :class="keyChoiceResult.effects.mood > 0 ? 'positive' : 'negative'">
                心绪 {{ keyChoiceResult.effects.mood > 0 ? '+' : '' }}{{ keyChoiceResult.effects.mood }}
              </span>
            </div>
            <button class="btn btn-primary result-btn" @click="closeResult">
              继续寻找
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const showKeyChoiceModal = computed(() => gameStore.showKeyChoiceModal)
const currentKeyChoice = computed(() => gameStore.currentKeyChoice)
const showKeyChoiceResult = computed(() => gameStore.showKeyChoiceResult)
const keyChoiceResult = computed(() => gameStore.keyChoiceResult)

const choiceError = ref(null)

function canChooseOption(option) {
  if (!option.requiredEndingWeights) return true
  for (const [weight, required] of Object.entries(option.requiredEndingWeights)) {
    if ((gameStore.endingWeights[weight] || 0) < required) {
      return false
    }
  }
  return true
}

function handleChoice(optionId) {
  choiceError.value = null
  const result = gameStore.makeChoice(optionId)
  if (result && !result.success) {
    choiceError.value = result.reason
  }
}

function closeResult() {
  choiceError.value = null
  gameStore.closeKeyChoiceResult()
}

function handleOverlayClick() {
  if (!showKeyChoiceResult.value) {
  }
}
</script>

<style scoped>
.key-choice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

.key-choice-modal {
  background: linear-gradient(180deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.98) 100%);
  border: 1px solid rgba(150, 150, 200, 0.2);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(150, 150, 255, 0.1);
  animation: choice-appear 0.5s ease;
}

@keyframes choice-appear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.key-choice-modal.result-mode {
  background: linear-gradient(180deg, rgba(40, 30, 60, 0.95) 0%, rgba(30, 20, 50, 0.98) 100%);
  border-color: rgba(200, 150, 255, 0.3);
}

.choice-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.choice-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.choice-title {
  margin: 0;
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  color: #e8e8f0;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.choice-description {
  color: #b0b0c8;
  font-size: clamp(0.9rem, 2.6vw, 1rem);
  line-height: 1.9;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.choice-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.choice-option-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(150, 150, 200, 0.15);
  border-radius: 12px;
  color: #d0d0e8;
  font-family: inherit;
  font-size: clamp(0.9rem, 2.6vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.choice-option-btn:hover:not(.disabled) {
  background: rgba(150, 150, 255, 0.1);
  border-color: rgba(150, 150, 255, 0.4);
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(150, 150, 255, 0.15);
}

.choice-option-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-label {
  flex: 1;
}

.option-lock {
  font-size: 0.9rem;
  opacity: 0.7;
}

.choice-error {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(200, 100, 100, 0.1);
  border: 1px solid rgba(200, 100, 100, 0.3);
  border-radius: 8px;
  color: #e08080;
  font-size: 0.85rem;
  text-align: center;
}

.result-content {
  text-align: center;
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)); }
  50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.8)); }
}

.result-title {
  margin: 0 0 1rem 0;
  color: #c084fc;
  font-size: clamp(1.1rem, 3.2vw, 1.3rem);
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.result-text {
  color: #d0d0e8;
  font-size: clamp(0.9rem, 2.6vw, 1.05rem);
  line-height: 2;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  white-space: pre-wrap;
}

.result-effects {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.effect-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.effect-tag.positive {
  background: rgba(100, 200, 150, 0.15);
  color: #86efac;
  border: 1px solid rgba(100, 200, 150, 0.3);
}

.effect-tag.negative {
  background: rgba(200, 100, 100, 0.15);
  color: #f87171;
  border: 1px solid rgba(200, 100, 100, 0.3);
}

.result-btn {
  width: 100%;
  padding: 0.9rem 2rem;
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
