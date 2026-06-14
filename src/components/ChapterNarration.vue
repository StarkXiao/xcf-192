<template>
  <Transition name="fade">
    <div v-if="gameStore.showChapterNarration" class="chapter-narration-overlay" @click.self="handleClose">
      <div class="narration-container">
        <div class="narration-header">
          <div class="chapter-badge" :class="{ 'final-chapter': chapter?.isFinalChapter }">
            <span class="badge-icon">{{ chapterIcon }}</span>
            <span class="badge-text">{{ chapter?.name }}</span>
          </div>
        </div>

        <div class="narration-divider"></div>

        <div class="narration-content">
          <p 
            v-for="(paragraph, index) in narrationParagraphs" 
            :key="index"
            class="narration-paragraph"
            :style="{ animationDelay: (index * 0.3) + 's' }"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="narration-footer">
          <button class="continue-btn" @click="handleClose">
            <span class="btn-text">继续</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>

        <div class="narration-decoration left">
          <div class="deco-line"></div>
          <div class="deco-dot"></div>
        </div>
        <div class="narration-decoration right">
          <div class="deco-line"></div>
          <div class="deco-dot"></div>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="slide-down">
    <div v-if="gameStore.showChapterUnlockHint" class="chapter-unlock-hint">
      <span class="hint-icon">✨</span>
      <span class="hint-text">
        {{ gameStore.unlockHintChapter?.isFinalChapter ? '终章解锁！' : '新章节解锁：' }}
        <strong>{{ gameStore.unlockHintChapter?.name }}</strong>
      </span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const chapter = computed(() => gameStore.currentNarrationChapter)

const chapterIcon = computed(() => {
  if (!chapter.value) return '📖'
  if (chapter.value.isFinalChapter) return '🌟'
  const icons = ['🚂', '👣', '☀️', '💍']
  return icons[chapter.value.id - 1] || '📖'
})

const narrationParagraphs = computed(() => {
  if (!chapter.value) return []
  const text = chapter.value.chapterNarration || chapter.value.unlockNarration || ''
  return text.split('\n').filter(p => p.trim())
})

function handleClose() {
  gameStore.closeChapterNarration()
}
</script>

<style scoped>
.chapter-narration-overlay {
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
  z-index: 3000;
  padding: 20px;
}

.narration-container {
  position: relative;
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.95), rgba(10, 10, 30, 0.98));
  border: 1px solid rgba(255, 215, 100, 0.3);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 40px rgba(212, 165, 116, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: narrationIn 0.6s ease-out;
}

@keyframes narrationIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.narration-header {
  margin-bottom: 1rem;
}

.chapter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(212, 165, 116, 0.1));
  border: 1px solid rgba(212, 165, 116, 0.4);
  border-radius: 30px;
}

.chapter-badge.final-chapter {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.1));
  border-color: rgba(255, 215, 0, 0.5);
  animation: badge-glow 2s ease-in-out infinite;
}

@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.5); }
}

.badge-icon {
  font-size: 1.3rem;
}

.badge-text {
  font-size: 1rem;
  font-weight: 600;
  color: #d4a574;
  letter-spacing: 0.1rem;
}

.final-chapter .badge-text {
  color: #ffd700;
}

.narration-divider {
  width: 60px;
  height: 2px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.6), transparent);
}

.final-chapter + .narration-divider,
.narration-container:has(.final-chapter) .narration-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.6), transparent);
}

.narration-content {
  margin-bottom: 2rem;
  text-align: left;
}

.narration-paragraph {
  color: #c0c0d0;
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 1rem;
  text-indent: 2em;
  opacity: 0;
  animation: paragraphIn 0.8s ease-out forwards;
}

.narration-paragraph:last-child {
  margin-bottom: 0;
}

@keyframes paragraphIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.narration-footer {
  display: flex;
  justify-content: center;
}

.continue-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, #d4a574, #b8860b);
  border: none;
  border-radius: 30px;
  color: #1a1a2e;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.4);
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 165, 116, 0.5);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.continue-btn:hover .btn-arrow {
  transform: translateX(3px);
}

.narration-decoration {
  position: absolute;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.narration-decoration.left {
  left: 20px;
}

.narration-decoration.right {
  right: 20px;
}

.deco-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, rgba(212, 165, 116, 0.4), transparent);
}

.narration-decoration.right .deco-line {
  background: linear-gradient(180deg, rgba(212, 165, 116, 0.4), transparent);
}

.deco-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4a574;
  opacity: 0.6;
}

.chapter-unlock-hint {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2500;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.8rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.95), rgba(184, 134, 11, 0.95));
  border-radius: 30px;
  color: #1a1a2e;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 20px rgba(212, 165, 116, 0.4);
  animation: hintPulse 1.5s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.02); }
}

.hint-icon {
  font-size: 1.2rem;
}

.hint-text strong {
  color: #fff;
  font-weight: 700;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
