<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showLetterModal || showReplyModal || showEndingModal" class="letter-overlay" @click.self="handleOverlayClick">
        
        <Transition name="letter-slide" mode="out-in">
          <div v-if="showLetterModal && currentLetter && !showReplyModal && !showEndingModal" 
               key="letter" 
               class="letter-modal">
            <div class="letter-header">
              <div class="letter-meta">
                <span class="letter-from">{{ currentLetter.from }}</span>
                <span class="letter-date">{{ currentLetter.date }}</span>
              </div>
              <h2 class="letter-title">{{ currentLetter.title }}</h2>
            </div>

            <div class="letter-body">
              <p class="letter-opening">{{ currentLetter.opening }}</p>
              <div class="letter-content">
                <p v-for="(paragraph, index) in letterParagraphs" :key="index" class="letter-paragraph">
                  {{ paragraph }}
                </p>
              </div>
              <p class="letter-closing">{{ currentLetter.closing }}</p>
            </div>

            <div class="letter-choices" v-if="currentLetter.choices && currentLetter.choices.length > 0">
              <div class="choices-title">
                <span class="choices-icon">✍️</span>
                <span>写下你的回信</span>
              </div>
              <button
                v-for="choice in currentLetter.choices"
                :key="choice.id"
                class="choice-btn"
                :class="{ 'made': hasMadeChoice(choice.id) }"
                :disabled="hasChoiceForCurrentLetter"
                @click="handleChoice(choice.id)"
              >
                <span class="choice-label">{{ choice.label }}</span>
                <span v-if="hasMadeChoice(choice.id)" class="choice-check">✓</span>
              </button>
            </div>

            <div class="letter-footer">
              <div class="progress-indicator">
                <span class="round-badge">第 {{ currentRound }} 封</span>
                <span class="total-badge">共 {{ totalLetterRounds }} 封</span>
              </div>
              <button class="close-btn" @click="handleCloseLetter">
                收起信件
              </button>
            </div>

            <div class="letter-decoration">
              <div class="stamp">📮</div>
              <div class="wax-seal">💌</div>
            </div>
          </div>
        </Transition>

        <Transition name="reply-fade">
          <div v-if="showReplyModal && currentReplyContent" key="reply" class="reply-modal">
            <div class="reply-header">
              <span class="reply-icon">📬</span>
              <h3 class="reply-title">收到回信</h3>
            </div>
            
            <div class="reply-body">
              <div class="your-choice">
                <span class="choice-label-text">你的选择：</span>
                <span class="choice-content">{{ currentReplyContent.choiceLabel }}</span>
              </div>
              <div class="reply-content">
                <p v-for="(paragraph, index) in replyParagraphs" :key="index" class="reply-paragraph">
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <div class="reply-footer">
              <div class="trait-changes" v-if="hasTraitChanges">
                <span class="trait-title">关系变化：</span>
                <span class="trait-value" :class="{ positive: relationChange > 0, negative: relationChange < 0 }">
                  {{ relationChange > 0 ? '+' : '' }}{{ relationChange }} 好感
                </span>
              </div>
              <button class="btn btn-primary continue-btn" @click="handleContinue">
                {{ isEndingNext ? '查看结局' : '继续阅读' }}
              </button>
            </div>
          </div>
        </Transition>

        <Transition name="ending-fade">
          <div v-if="showEndingModal && letterEnding" key="ending" class="ending-modal">
            <div class="ending-header">
              <div class="ending-type-badge" :class="letterEnding.type">
                {{ endingTypeLabel }}
              </div>
              <h2 class="ending-title">{{ letterEnding.title }}</h2>
              <div class="ending-character">
                <span class="character-name">{{ letterEnding.character }}</span>
                <span class="character-mood">· {{ letterEnding.characterMood }}</span>
              </div>
            </div>

            <div class="ending-body">
              <p v-for="(paragraph, index) in endingParagraphs" :key="index" class="ending-paragraph">
                {{ paragraph }}
              </p>
            </div>

            <div class="ending-stats">
              <div class="stats-title">📊 你的选择轨迹</div>
              <div class="trait-list">
                <div v-for="[trait, value] in topTraits" :key="trait" class="trait-item">
                  <span class="trait-name">{{ traitLabel(trait) }}</span>
                  <div class="trait-bar">
                    <div class="trait-fill" :style="{ width: traitWidth(value) + '%' }"></div>
                  </div>
                  <span class="trait-num">{{ value }}</span>
                </div>
              </div>
              <div class="relation-stat">
                <span class="relation-label">💕 人物好感</span>
                <span class="relation-value">{{ relationValue }}</span>
              </div>
            </div>

            <div class="ending-effects" v-if="letterEnding.effects">
              <div class="effects-title">✨ 获得效果</div>
              <div class="effect-tags">
                <span v-if="letterEnding.effects.mood" class="effect-tag mood">
                  心绪 {{ letterEnding.effects.mood > 0 ? '+' : '' }}{{ letterEnding.effects.mood }}
                </span>
                <span v-for="(value, weight) in letterEnding.effects.endingWeight" :key="weight" class="effect-tag weight">
                  {{ weightLabel(weight) }} +{{ value }}
                </span>
              </div>
            </div>

            <div class="ending-footer">
              <button class="btn btn-primary finish-btn" @click="handleCloseEnding">
                继续探索雾城
              </button>
            </div>
          </div>
        </Transition>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()

const {
  showLetterModal,
  showLetterReplyModal: showReplyModal,
  showLetterEndingModal: showEndingModal,
  letterCurrentLetter: currentLetter,
  letterCurrentReply: currentReplyContent,
  letterEnding,
  letterCurrentRound: currentRound,
  letterTotalRounds: totalLetterRounds,
  letterRelationValue: relationValue,
  letterTopTraits: topTraits,
  isLetterEndingReached
} = storeToRefs(gameStore)

const {
  letterCloseModal: closeLetterModal,
  letterCloseReply: closeReplyModal,
  letterCloseEnding: closeEndingModal,
  letterMakeChoice: makeChoice,
  letterGoToNext: goToNextLetter,
  letterHasMadeChoice: hasMadeChoice,
  closeLetterSystem
} = gameStore

const lastRelationValue = ref(0)
const relationChange = ref(0)
const isEndingNext = ref(false)

watch(currentLetter, (newLetter) => {
  if (newLetter) {
    lastRelationValue.value = relationValue.value
  }
})

watch(showReplyModal, (showing) => {
  if (showing) {
    relationChange.value = relationValue.value - lastRelationValue.value
  }
})

watch(isLetterEndingReached, (reached) => {
  isEndingNext.value = reached
})

const hasChoiceForCurrentLetter = computed(() => {
  if (!currentLetter.value || !currentLetter.value.choices) return false
  return currentLetter.value.choices.some(c => hasMadeChoice(c.id))
})

const letterParagraphs = computed(() => {
  if (!currentLetter.value?.content) return []
  return currentLetter.value.content.split('\n').filter(p => p.trim())
})

const replyParagraphs = computed(() => {
  if (!currentReplyContent.value?.content) return []
  return currentReplyContent.value.content.split('\n').filter(p => p.trim())
})

const endingParagraphs = computed(() => {
  if (!letterEnding.value?.content) return []
  return letterEnding.value.content.split('\n').filter(p => p.trim())
})

const hasTraitChanges = computed(() => {
  return relationChange.value !== 0
})

const endingTypeLabel = computed(() => {
  const types = {
    best: '✨ 最佳结局',
    good: '🌟 良好结局',
    normal: '📝 普通结局'
  }
  return types[letterEnding.value?.type] || '结局'
})

function traitLabel(trait) {
  const labels = {
    sincere: '真诚',
    curious: '好奇',
    cautious: '谨慎',
    doubtful: '怀疑',
    reserved: '内敛',
    romantic: '浪漫',
    nostalgic: '怀旧',
    gentle: '温柔',
    anxious: '急切',
    invested: '投入',
    touched: '感动',
    regret: '遗憾',
    empathetic: '共情',
    courage: '勇气',
    supportive: '支持',
    fearful: '胆怯',
    thoughtful: '深思',
    connection: '羁绊',
    warm: '温暖',
    healing: '治愈',
    growth: '成长',
    grateful: '感激',
    peaceful: '平和',
    mature: '成熟',
    decisive: '果断',
    patient: '耐心',
    philosophical: '达观',
    calm: '冷静',
    hopeful: '希望',
    sad: '忧伤',
    realistic: '现实',
    kind: '善良',
    honest: '诚实',
    selfaware: '自知',
    respected: '尊重',
    understanding: '理解',
    bittersweet: '苦乐参半',
    hesitant: '犹豫',
    mutual: '相互',
    comforting: '慰藉',
    motivating: '激励',
    listener: '倾听',
    silent_support: '默默支持',
    '动摇': '动摇',
    open: '开放',
    stuck: '执着'
  }
  return labels[trait] || trait
}

function weightLabel(weight) {
  const labels = {
    sincere: '真诚',
    romantic: '浪漫',
    courageous: '勇气',
    peaceful: '平和',
    mature: '成熟',
    nostalgic: '怀旧',
    destined: '宿命',
    growth: '成长',
    warm: '温暖',
    gentle: '温柔',
    quiet: '静谧',
    reserved: '内敛',
    indifferent: '淡然'
  }
  return labels[weight] || weight
}

function traitWidth(value) {
  const max = Math.max(10, ...topTraits.value.map(([, v]) => v))
  return Math.min(100, (value / max) * 100)
}

function handleChoice(choiceId) {
  if (hasChoiceForCurrentLetter.value) return
  lastRelationValue.value = relationValue.value
  makeChoice(choiceId)
}

function handleContinue() {
  goToNextLetter()
}

function handleCloseLetter() {
  closeLetterSystem()
}

function handleCloseEnding() {
  closeLetterSystem()
}

function handleOverlayClick() {
  if (showReplyModal.value || showEndingModal.value) {
    return
  }
  if (showLetterModal.value) {
    closeLetterSystem()
  }
}
</script>

<style scoped>
.letter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.letter-modal {
  position: relative;
  background: linear-gradient(180deg, #f5f0e6 0%, #ebe4d4 100%);
  border-radius: 8px;
  padding: 2.5rem 2rem;
  max-width: 520px;
  width: 92vw;
  max-height: 88vh;
  overflow-y: auto;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 215, 150, 0.1);
  color: #3d3528;
  font-family: 'Georgia', 'Songti SC', serif;
  animation: letter-appear 0.6s ease;
}

@keyframes letter-appear {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(-20deg) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0) scale(1);
  }
}

.letter-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(100, 80, 50, 0.2);
}

.letter-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #8b7355;
}

.letter-from {
  font-style: italic;
}

.letter-date {
  opacity: 0.7;
}

.letter-title {
  margin: 0;
  font-size: clamp(1.3rem, 4vw, 1.6rem);
  color: #5d4e37;
  font-weight: 500;
  letter-spacing: 0.15rem;
}

.letter-body {
  line-height: 2.2;
  margin-bottom: 2rem;
}

.letter-opening {
  margin: 0 0 1.5rem 0;
  font-style: italic;
  color: #6b5a42;
}

.letter-content {
  margin-bottom: 1.5rem;
}

.letter-paragraph {
  margin: 0 0 1rem 0;
  text-indent: 2em;
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
  color: #4a3f2f;
}

.letter-closing {
  text-align: right;
  margin: 0;
  font-style: italic;
  color: #6b5a42;
}

.letter-choices {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  border: 1px dashed rgba(100, 80, 50, 0.3);
}

.choices-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #7a6548;
  font-weight: 500;
}

.choices-icon {
  font-size: 1.2rem;
}

.choice-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.9rem 1.2rem;
  margin-bottom: 0.7rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(150, 120, 80, 0.3);
  border-radius: 10px;
  color: #5d4e37;
  font-family: inherit;
  font-size: clamp(0.9rem, 2.6vw, 0.95rem);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.choice-btn:hover:not(.made):not(:disabled) {
  background: rgba(255, 248, 230, 0.9);
  border-color: rgba(200, 160, 100, 0.6);
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(150, 120, 80, 0.2);
}

.choice-btn.made {
  background: rgba(180, 160, 120, 0.3);
  border-color: rgba(150, 130, 90, 0.5);
  opacity: 0.7;
}

.choice-btn:disabled {
  cursor: not-allowed;
}

.choice-label {
  flex: 1;
}

.choice-check {
  color: #8b7355;
  font-weight: bold;
}

.letter-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(100, 80, 50, 0.2);
}

.progress-indicator {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.round-badge,
.total-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: rgba(100, 80, 50, 0.15);
  color: #7a6548;
}

.close-btn {
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(100, 80, 50, 0.4);
  border-radius: 20px;
  color: #7a6548;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(100, 80, 50, 0.1);
}

.letter-decoration {
  position: absolute;
  pointer-events: none;
}

.stamp {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  opacity: 0.3;
  transform: rotate(15deg);
}

.wax-seal {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  font-size: 1.5rem;
  opacity: 0.4;
}

.reply-modal {
  background: linear-gradient(180deg, #f0f5f0 0%, #e0e8e0 100%);
  border-radius: 12px;
  padding: 2rem;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: reply-appear 0.5s ease;
  color: #3d4a3d;
  font-family: 'Georgia', 'Songti SC', serif;
}

@keyframes reply-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.reply-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.reply-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.reply-title {
  margin: 0;
  font-size: 1.3rem;
  color: #4a6a4a;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.reply-body {
  margin-bottom: 1.5rem;
}

.your-choice {
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.choice-label-text {
  color: #6a7a6a;
  font-size: 0.85rem;
  display: block;
  margin-bottom: 0.3rem;
}

.choice-content {
  color: #3d4a3d;
  font-weight: 500;
}

.reply-content {
  line-height: 2;
}

.reply-paragraph {
  margin: 0 0 0.8rem 0;
  text-indent: 2em;
  font-size: 0.95rem;
  color: #4a5a4a;
}

.reply-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.trait-changes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.trait-title {
  color: #6a7a6a;
}

.trait-value.positive {
  color: #4a8a4a;
  font-weight: 500;
}

.trait-value.negative {
  color: #8a4a4a;
  font-weight: 500;
}

.continue-btn {
  min-width: 150px;
  padding: 0.8rem 2rem;
}

.ending-modal {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 520px;
  width: 92vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 30px 100px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(100, 150, 255, 0.2);
  color: #e0e0f0;
  font-family: 'Georgia', 'Songti SC', serif;
  animation: ending-appear 0.8s ease;
}

@keyframes ending-appear {
  from {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.ending-header {
  text-align: center;
  margin-bottom: 2rem;
}

.ending-type-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  letter-spacing: 0.1rem;
}

.ending-type-badge.best {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
  font-weight: bold;
}

.ending-type-badge.good {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
}

.ending-type-badge.normal {
  background: rgba(150, 150, 200, 0.2);
  color: #b0b0d0;
  border: 1px solid rgba(150, 150, 200, 0.3);
}

.ending-title {
  margin: 0 0 0.8rem 0;
  font-size: clamp(1.4rem, 4.5vw, 1.8rem);
  color: #fff;
  font-weight: 500;
  letter-spacing: 0.15rem;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.ending-character {
  font-size: 0.95rem;
  color: #a0a0c0;
}

.character-name {
  font-weight: 500;
  color: #c0c0e0;
}

.character-mood {
  opacity: 0.7;
}

.ending-body {
  line-height: 2.2;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(150, 150, 200, 0.1);
}

.ending-paragraph {
  margin: 0 0 1rem 0;
  text-indent: 2em;
  font-size: clamp(0.95rem, 2.8vw, 1.05rem);
  color: #c8c8e0;
}

.ending-stats {
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
}

.stats-title {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #a0a0c0;
  letter-spacing: 0.1rem;
}

.trait-list {
  margin-bottom: 1rem;
}

.trait-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
}

.trait-name {
  width: 70px;
  font-size: 0.85rem;
  color: #b0b0d0;
  flex-shrink: 0;
}

.trait-bar {
  flex: 1;
  height: 6px;
  background: rgba(150, 150, 200, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.trait-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.trait-num {
  width: 30px;
  text-align: right;
  font-size: 0.85rem;
  color: #9090b0;
}

.relation-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(150, 150, 200, 0.1);
}

.relation-label {
  font-size: 0.9rem;
  color: #b0b0d0;
}

.relation-value {
  font-size: 1.1rem;
  color: #ff9999;
  font-weight: 500;
}

.ending-effects {
  margin-bottom: 2rem;
}

.effects-title {
  text-align: center;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: #a0a0c0;
}

.effect-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.effect-tag {
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.effect-tag.mood {
  background: rgba(100, 200, 150, 0.15);
  color: #86efac;
  border: 1px solid rgba(100, 200, 150, 0.3);
}

.effect-tag.weight {
  background: rgba(150, 150, 255, 0.15);
  color: #a0a0ff;
  border: 1px solid rgba(150, 150, 255, 0.3);
}

.ending-footer {
  text-align: center;
}

.finish-btn {
  min-width: 200px;
  padding: 1rem 2.5rem;
  font-size: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
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
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.letter-slide-enter-active,
.letter-slide-leave-active {
  transition: all 0.4s ease;
}

.letter-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.letter-slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.reply-fade-enter-active,
.reply-fade-leave-active {
  transition: all 0.3s ease;
}

.reply-fade-enter-from,
.reply-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.ending-fade-enter-active,
.ending-fade-leave-active {
  transition: all 0.5s ease;
}

.ending-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.ending-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
