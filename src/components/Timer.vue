<template>
  <div class="timer" :class="{ warning: isTimeWarning }">
    <span class="timer-icon">⏱️</span>
    <span class="timer-text">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const formattedTime = computed(() => gameStore.formattedTime)
const isTimeWarning = computed(() => gameStore.isTimeWarning)
</script>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.timer.warning {
  background: rgba(220, 50, 50, 0.6);
  border-color: rgba(255, 100, 100, 0.5);
  animation: pulse 1s ease-in-out infinite;
}

.timer-icon {
  font-size: 1.2rem;
}

.timer-text {
  font-size: 1.3rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.timer.warning .timer-text {
  color: #ffcccc;
}
</style>
