<template>
  <Transition name="fade">
    <div v-if="showModal" class="archive-overlay" @click.self="handleClose">
      <div class="archive-panel">
        <div class="archive-header">
          <h2 class="archive-title">
            <span class="title-icon">📖</span>
            回忆档案
          </h2>
          <button class="close-icon-btn" @click="handleClose">✕</button>
        </div>

        <div class="archive-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'endings' }"
            @click="activeTab = 'endings'"
          >
            👑 结局图鉴 ({{ unlockedEndings.length }})
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'memories' }"
            @click="activeTab = 'memories'"
          >
            🌟 隐藏回忆 ({{ everHM.length }})
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'branches' }"
            @click="activeTab = 'branches'"
          >
            🌿 分支存档 ({{ branchSaves.length }})
          </button>
        </div>

        <div class="archive-body">
          <div v-if="activeTab === 'endings'" class="endings-section">
            <div v-if="allEndingsList.length === 0" class="empty-state">
              <span class="empty-icon">👑</span>
              <p class="empty-text">尚未解锁任何结局</p>
              <p class="empty-hint">完成游戏后，结局将记录在此处</p>
            </div>
            <div v-for="ending in allEndingsList" :key="ending.type" class="ending-archive-card" :class="[ending.type, { unlocked: ending.unlocked }]">
              <div class="ending-archive-icon">{{ ending.emoji }}</div>
              <div class="ending-archive-info">
                <h4 class="ending-archive-title" :class="{ unlocked: ending.unlocked }">
                  {{ ending.unlocked ? ending.title : '???' }}
                </h4>
                <p v-if="ending.unlocked" class="ending-archive-desc">{{ ending.description }}</p>
                <p v-else class="ending-archive-locked">条件未满足</p>
                <span v-if="ending.unlocked" class="ending-archive-time">
                  {{ formatTime(ending.timestamp) }}
                </span>
                <span v-if="ending.isSpecial && ending.unlocked" class="ending-badge" :class="ending.type">
                  ✦ {{ ending.badge }}
                </span>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'memories'" class="memories-section">
            <div v-if="allHMList.length === 0" class="empty-state">
              <span class="empty-icon">🌟</span>
              <p class="empty-text">尚未解锁任何隐藏回忆</p>
              <p class="empty-hint">合成道具后，隐藏回忆将在此处回看</p>
            </div>
            <div v-for="hm in allHMList" :key="hm.id" class="hm-archive-card" :class="{ unlocked: hm.unlocked }" @click="hm.unlocked && reviewMemory(hm)">
              <div class="hm-archive-icon">{{ hm.unlocked ? getEmojiForEmotion(hm.emotion) : '🔒' }}</div>
              <div class="hm-archive-info">
                <h4 class="hm-archive-title">{{ hm.unlocked ? hm.title : '???' }}</h4>
                <p v-if="hm.unlocked" class="hm-archive-craft">来源：{{ hm.craftName }}</p>
                <p v-else class="hm-archive-locked">合成对应道具后解锁</p>
              </div>
              <span v-if="hm.unlocked" class="hm-review-hint">点击回看</span>
            </div>
          </div>

          <div v-else-if="activeTab === 'branches'" class="branches-section">
            <div v-if="branchSaves.length === 0" class="empty-state">
              <span class="empty-icon">🌿</span>
              <p class="empty-text">暂无分支存档</p>
              <p class="empty-hint">合成道具或达成结局时将自动创建分支存档</p>
            </div>
            <div v-for="branch in branchSaves" :key="branch.id" class="branch-card" :class="{ 'ending-branch': isEndingBranch(branch.label) }">
              <div class="branch-info">
                <span class="branch-icon">{{ isEndingBranch(branch.label) ? '�' : '�' }}</span>
                <div class="branch-text">
                  <h4 class="branch-label" :class="{ 'ending-label': isEndingBranch(branch.label) }">
                    {{ branch.label }}
                  </h4>
                  <span class="branch-time">
                    {{ isEndingBranch(branch.label) ? '🏁 结局节点 · ' : '' }}{{ formatTime(branch.timestamp) }}
                  </span>
                  <div class="branch-stats">
                    <span class="branch-stat">物品 {{ branch.gameState.foundItems?.length || 0 }}/{{ totalItems }}</span>
                    <span class="branch-stat">合成 {{ branch.gameState.craftedItems?.length || 0 }}/{{ totalCraftable }}</span>
                    <span class="branch-stat">回忆 {{ branch.gameState.unlockedHiddenMemories?.length || 0 }}/{{ totalHM }}</span>
                  </div>
                </div>
              </div>
              <div class="branch-actions">
                <button class="branch-btn load-btn" :class="{ 'ending-load-btn': isEndingBranch(branch.label) }" @click="loadBranch(branch.id)">
                  {{ isEndingBranch(branch.label) ? '🔁 从该结局回看去探索' : '🔄 从此继续' }}
                </button>
                <button class="branch-btn del-btn" @click="deleteBranch(branch.id)">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="reviewingMemory" class="memory-review-overlay" @click.self="reviewingMemory = null">
          <div class="memory-review-card" :class="{ 'hidden-memory': reviewingMemory.isHidden }">
            <div v-if="reviewingMemory.isHidden" class="review-banner">
              <span class="banner-star">✦</span>
              隐藏回忆
              <span class="banner-star">✦</span>
            </div>
            <div class="review-header">
              <span class="review-year">{{ reviewingMemory.year }}</span>
              <span class="review-emoji">{{ getEmojiForEmotion(reviewingMemory.emotion) }}</span>
            </div>
            <h3 class="review-title" :class="{ 'hidden-title': reviewingMemory.isHidden }">
              {{ reviewingMemory.title }}
            </h3>
            <div class="review-divider" :class="{ 'hidden-divider': reviewingMemory.isHidden }"></div>
            <p class="review-content" :class="{ 'hidden-content': reviewingMemory.isHidden }">
              {{ reviewingMemory.content }}
            </p>
            <button class="review-close-btn" :class="{ 'hidden-btn': reviewingMemory.isHidden }" @click="reviewingMemory = null">
              关闭
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'
import { useArchiveStore } from '../stores/archiveStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()
const archiveStore = useArchiveStore()

const activeTab = ref('endings')
const reviewingMemory = ref(null)

const showModal = computed(() => gameStore.showArchiveModal)

const unlockedEndings = computed(() => archiveStore.unlockedEndings)
const everHM = computed(() => archiveStore.everUnlockedHiddenMemories)
const branchSaves = computed(() => [...archiveStore.branchSaves].reverse())

const totalItems = computed(() => storyStore.getTotalItemCount())
const totalCraftable = computed(() => storyStore.getTotalCraftedCount())
const totalHM = computed(() => storyStore.getAllHiddenMemories().length)

const allEndingsList = computed(() => {
  const all = [
    { type: 'legendary', title: '时光尽头的重逢', emoji: '👑', isSpecial: true, badge: '传说结局' },
    { type: 'epic', title: '补全的记忆拼图', emoji: '🏆', isSpecial: true, badge: '史诗结局' },
    { type: 'special', title: '命运的第二次机会', emoji: '💫', isSpecial: true, badge: '特殊结局' },
    { type: 'perfect', title: '完美重逢', emoji: '🌟', isSpecial: false, badge: '' },
    { type: 'good', title: '温暖重逢', emoji: '🥰', isSpecial: false, badge: '' },
    { type: 'normal', title: '迷雾中的约定', emoji: '💭', isSpecial: false, badge: '' },
    { type: 'bad', title: '雾中迷失', emoji: '🌫️', isSpecial: false, badge: '' }
  ]
  return all.map(e => {
    const found = unlockedEndings.value.find(u => u.type === e.type)
    return {
      ...e,
      unlocked: !!found,
      description: found?.description || '',
      timestamp: found?.timestamp || null
    }
  })
})

const allHMList = computed(() => {
  const hms = storyStore.getAllHiddenMemories()
  return hms.map(hm => {
    const unlocked = archiveStore.isHiddenMemoryEverUnlocked(hm.id)
    const craft = storyStore.getCraftedItemById(hm.triggerCraftId)
    return {
      ...hm,
      unlocked,
      craftName: craft ? craft.name : '未知'
    }
  })
})

watch(showModal, (val) => {
  if (val) activeTab.value = 'endings'
})

function handleClose() {
  gameStore.closeArchive()
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function getEmojiForEmotion(emotion) {
  const emotions = {
    sad: '😢', warm: '🥰', pensive: '🤔', happy: '😊',
    sweet: '🍬', nervous: '😰', bittersweet: '😌', shocking: '😲',
    romantic: '💕', regret: '💔', melancholy: '🌧️', touched: '🥹', determined: '💪'
  }
  return emotions[emotion] || '💭'
}

function reviewMemory(hm) {
  reviewingMemory.value = hm
}

function loadBranch(branchId) {
  gameStore.closeArchive()
  gameStore.startGameFromBranch(branchId)
}

function deleteBranch(branchId) {
  archiveStore.deleteBranchSave(branchId)
}

function isEndingBranch(label) {
  if (!label) return false
  return label.startsWith('达成') || label.startsWith('抵达结局')
}
</script>

<style scoped>
.archive-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  padding: 15px;
}

.archive-panel {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.98), rgba(15, 15, 30, 0.99));
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(212, 165, 116, 0.25);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 165, 116, 0.08);
  overflow: hidden;
}

.archive-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(212, 165, 116, 0.08), transparent);
}

.archive-title {
  margin: 0;
  color: #d4a574;
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  font-weight: 500;
  letter-spacing: 0.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.close-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #c0c0d0;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.close-icon-btn:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff8888;
}

.archive-tabs {
  display: flex;
  padding: 0.8rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  color: #808090;
  font-family: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #c0c0d0;
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(212, 165, 116, 0.2));
  color: #e8c89a;
  box-shadow: 0 2px 10px rgba(212, 165, 116, 0.3);
}

.archive-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  color: #a0a0b0;
  font-size: 1rem;
  margin: 0 0 0.4rem 0;
}

.empty-hint {
  color: #707080;
  font-size: 0.85rem;
  margin: 0;
}

.endings-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.ending-archive-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.ending-archive-card.unlocked {
  opacity: 1;
}

.ending-archive-card.legendary.unlocked {
  background: rgba(255, 215, 0, 0.06);
  border-color: rgba(255, 215, 0, 0.25);
}

.ending-archive-card.epic.unlocked {
  background: rgba(192, 132, 252, 0.06);
  border-color: rgba(192, 132, 252, 0.25);
}

.ending-archive-card.special.unlocked {
  background: rgba(96, 165, 250, 0.06);
  border-color: rgba(96, 165, 250, 0.25);
}

.ending-archive-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.ending-archive-info {
  flex: 1;
  min-width: 0;
}

.ending-archive-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.05rem;
  color: #707080;
  font-weight: 500;
}

.ending-archive-title.unlocked {
  color: #e8e8f0;
}

.ending-archive-card.legendary .ending-archive-title.unlocked {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-archive-card.epic .ending-archive-title.unlocked {
  background: linear-gradient(135deg, #c084fc, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-archive-card.special .ending-archive-title.unlocked {
  color: #60a5fa;
}

.ending-archive-desc {
  margin: 0;
  color: #9090a0;
  font-size: 0.82rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ending-archive-locked {
  margin: 0;
  color: #606070;
  font-size: 0.82rem;
  font-style: italic;
}

.ending-archive-time {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.72rem;
  color: #707080;
}

.ending-badge {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.72rem;
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
}

.ending-badge.legendary {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.ending-badge.epic {
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
}

.ending-badge.special {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.memories-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hm-archive-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: default;
}

.hm-archive-card.unlocked {
  opacity: 1;
  background: rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.2);
  cursor: pointer;
}

.hm-archive-card.unlocked:hover {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.35);
}

.hm-archive-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.hm-archive-info {
  flex: 1;
  min-width: 0;
}

.hm-archive-title {
  margin: 0;
  font-size: 0.95rem;
  color: #707080;
  font-weight: 500;
}

.hm-archive-card.unlocked .hm-archive-title {
  color: #e8d5a8;
}

.hm-archive-craft {
  margin: 0.2rem 0 0 0;
  font-size: 0.78rem;
  color: #808090;
}

.hm-archive-locked {
  margin: 0;
  font-size: 0.78rem;
  color: #606070;
  font-style: italic;
}

.hm-review-hint {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: #d4a574;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hm-archive-card.unlocked:hover .hm-review-hint {
  opacity: 1;
}

.branches-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.branch-card {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.branch-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(100, 200, 150, 0.25);
}

.branch-info {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.branch-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.branch-text {
  flex: 1;
}

.branch-label {
  margin: 0;
  font-size: 0.95rem;
  color: #c0c0d0;
  font-weight: 500;
}

.branch-time {
  font-size: 0.72rem;
  color: #707080;
}

.branch-stats {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.4rem;
}

.branch-stat {
  font-size: 0.72rem;
  color: #808090;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
}

.branch-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.branch-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 18px;
  font-family: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-btn {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
}

.load-btn:hover {
  box-shadow: 0 2px 12px rgba(52, 211, 153, 0.4);
  transform: translateY(-1px);
}

.del-btn {
  background: rgba(255, 100, 100, 0.1);
  color: #fca5a5;
  padding: 0.5rem 0.7rem;
}

.del-btn:hover {
  background: rgba(255, 100, 100, 0.2);
}

.branch-card.ending-branch {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.08), rgba(20, 20, 40, 0.6));
  border-color: rgba(212, 165, 116, 0.3);
  box-shadow: 0 2px 20px rgba(212, 165, 116, 0.08);
}

.branch-card.ending-branch:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.12), rgba(20, 20, 40, 0.8));
  border-color: rgba(212, 165, 116, 0.45);
}

.ending-label {
  color: #d4a574 !important;
  font-weight: 600 !important;
}

.ending-load-btn {
  background: linear-gradient(135deg, #d4a574, #b8956a) !important;
  color: #1a1a2e !important;
  font-weight: 500;
}

.ending-load-btn:hover {
  box-shadow: 0 2px 15px rgba(212, 165, 116, 0.45) !important;
  transform: translateY(-1px);
}

.memory-review-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4001;
  padding: 20px;
}

.memory-review-card {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 40, 0.99));
  border-radius: 20px;
  padding: 2rem;
  max-width: 90vw;
  width: 380px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.4s ease;
  position: relative;
}

.memory-review-card.hidden-memory {
  background: linear-gradient(145deg, rgba(50, 40, 20, 0.98), rgba(40, 30, 10, 0.99));
  border: 2px solid rgba(255, 215, 0, 0.35);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.15);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.review-banner {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.4rem 1.2rem;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a00;
  font-weight: 600;
  border-radius: 18px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  white-space: nowrap;
}

.banner-star {
  animation: twinkle 1.5s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  margin-top: 0.5rem;
}

.review-year {
  color: #a0a0b0;
  font-size: 0.85rem;
}

.hidden-memory .review-year {
  color: #d4a574;
}

.review-emoji {
  font-size: 1.8rem;
}

.review-title {
  margin: 0 0 0.8rem 0;
  font-size: 1.3rem;
  color: #e8e8f0;
  font-weight: 500;
  text-align: center;
}

.review-title.hidden-title {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.review-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin-bottom: 1.2rem;
}

.review-divider.hidden-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
  height: 3px;
}

.review-content {
  color: #c0c0d0;
  line-height: 1.9;
  font-size: 0.9rem;
  text-align: justify;
  margin-bottom: 1.2rem;
  text-indent: 2em;
}

.review-content.hidden-content {
  color: #e8d5a8;
  font-style: italic;
}

.review-close-btn {
  display: block;
  margin: 0 auto;
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 22px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.review-close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.review-close-btn.hidden-btn {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a00;
  font-weight: 600;
}

.review-close-btn.hidden-btn:hover {
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}
</style>
