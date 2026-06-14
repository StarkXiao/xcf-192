<template>
  <Transition name="fade">
    <div v-if="showBadgeModal" class="badge-modal" @click.self="closeModal">
      <div class="badge-panel">
        <div class="bm-header">
          <div class="bm-header-main">
            <span class="bm-icon">🎖️</span>
            <div class="bm-title-wrap">
              <h2 class="bm-title">挑战徽章收藏</h2>
              <p class="bm-progress">{{ unlockedBadgesCount }}/{{ totalBadgesCount }} 已解锁</p>
            </div>
          </div>
          <button class="bm-close-btn" @click="closeModal" title="关闭">
            ✕
          </button>
        </div>

        <div class="bm-overall-progress">
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
          <div class="progress-label-row">
            <span class="progress-percent">{{ progressPercent }}%</span>
            <span class="progress-hint" v-if="nextBadge">
              下一枚：<strong>{{ nextBadge.name }}</strong>
            </span>
            <span v-else class="progress-hint all-unlocked">🎉 全部徽章已解锁！</span>
          </div>
        </div>

        <div class="bm-rarity-filters">
          <button
            v-for="filter in rarityFilters"
            :key="filter.key"
            class="rarity-filter-btn"
            :class="{ active: activeFilter === filter.key, [`filter-${filter.key}`]: true }"
            @click="activeFilter = filter.key"
          >
            <span class="filter-dot" :class="`dot-${filter.key}`"></span>
            <span class="filter-name">{{ filter.name }}</span>
            <span class="filter-count">{{ getRarityCount(filter.key) }}</span>
          </button>
        </div>

        <div class="bm-badges-grid-wrap">
          <div class="bm-badges-grid">
            <TransitionGroup name="badge-list">
              <div
                v-for="badge in filteredBadges"
                :key="badge.id"
                class="badge-card"
                :class="[
                  `badge-rarity-${badge.rarity}`,
                  { unlocked: badge.unlocked, 'newly-unlocked': isNewlyUnlocked(badge.id) }
                ]"
                @click="selectedBadge = badge.unlocked ? badge : null"
              >
                <div class="badge-icon-wrap">
                  <span class="badge-icon">{{ badge.unlocked ? badge.icon : '🔒' }}</span>
                  <div v-if="badge.unlocked" class="badge-shine"></div>
                </div>
                <span class="badge-name">{{ badge.unlocked ? badge.name : '???' }}</span>
                <span v-if="!badge.unlocked" class="badge-lock-hint">{{ getRarityLabel(badge.rarity) }}徽章</span>
                <span v-if="badge.unlocked" class="badge-rarity-tag" :class="`tag-${badge.rarity}`">
                  {{ getRarityLabel(badge.rarity) }}
                </span>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="selectedBadge" class="badge-detail-popup" @click.self="selectedBadge = null">
            <div class="bdp-content" :class="`bdp-${selectedBadge.rarity}`">
              <div class="bdp-close" @click="selectedBadge = null">×</div>
              <div class="bdp-icon-wrap">
                <span class="bdp-icon">{{ selectedBadge.icon }}</span>
              </div>
              <h3 class="bdp-name">{{ selectedBadge.name }}</h3>
              <span class="bdp-rarity" :class="`bdpr-${selectedBadge.rarity}`">
                {{ getRarityLabel(selectedBadge.rarity) }}徽章
              </span>
              <p class="bdp-desc">{{ selectedBadge.description }}</p>
              <div class="bdp-check">
                <span class="check-icon">✅</span>
                <span class="check-text">已解锁</span>
              </div>
            </div>
          </div>
        </Transition>

        <div class="bm-footer">
          <p class="bm-tip">💡 完成各种挑战目标解锁专属徽章，展现你的雾城重逢之旅！</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChallengeStore, CHALLENGE_BADGES } from '../stores/challengeStore'

const challengeStore = useChallengeStore()

const activeFilter = ref('all')
const selectedBadge = ref(null)

const showBadgeModal = computed(() => challengeStore.showBadgeModal)
const badgesList = computed(() => challengeStore.badgesList)
const unlockedBadgesCount = computed(() => challengeStore.unlockedBadgesCount)
const totalBadgesCount = computed(() => challengeStore.totalBadgesCount)

const rarityFilters = [
  { key: 'all', name: '全部' },
  { key: 'common', name: '普通' },
  { key: 'rare', name: '稀有' },
  { key: 'epic', name: '史诗' },
  { key: 'legendary', name: '传说' }
]

const progressPercent = computed(() => {
  if (totalBadgesCount.value === 0) return 0
  return Math.round((unlockedBadgesCount.value / totalBadgesCount.value) * 100)
})

const nextBadge = computed(() => {
  return badgesList.value.find(b => !b.unlocked)
})

const filteredBadges = computed(() => {
  if (activeFilter.value === 'all') {
    return badgesList.value
  }
  return badgesList.value.filter(b => b.rarity === activeFilter.value)
})

function getRarityCount(rarity) {
  if (rarity === 'all') {
    return `${unlockedBadgesCount.value}/${totalBadgesCount.value}`
  }
  const filtered = badgesList.value.filter(b => b.rarity === rarity)
  const unlocked = filtered.filter(b => b.unlocked).length
  return `${unlocked}/${filtered.length}`
}

function getRarityLabel(rarity) {
  const labels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return labels[rarity] || rarity
}

function isNewlyUnlocked(badgeId) {
  return challengeStore.newlyUnlockedBadge?.id === badgeId
}

function closeModal() {
  challengeStore.closeBadges()
  selectedBadge.value = null
}
</script>

<style scoped>
.badge-modal {
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

.badge-panel {
  background: linear-gradient(145deg, rgba(25, 20, 35, 0.98), rgba(15, 10, 25, 0.99));
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  border: 1px solid rgba(192, 132, 252, 0.25);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(192, 132, 252, 0.08);
  display: flex;
  flex-direction: column;
  animation: panelIn 0.4s ease-out;
  position: relative;
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.bm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bm-header-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bm-icon {
  font-size: 2.2rem;
  animation: badgeSpin 4s ease-in-out infinite;
}

@keyframes badgeSpin {
  0%, 100% { transform: rotate(-5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.1); }
}

.bm-title-wrap {
  text-align: left;
}

.bm-title {
  margin: 0;
  color: #c084fc;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.08rem;
}

.bm-progress {
  margin: 0.3rem 0 0 0;
  color: #a78bfa;
  font-size: 0.8rem;
  font-family: monospace;
}

.bm-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #a0a0b0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.bm-close-btn:hover {
  background: rgba(200, 100, 100, 0.2);
  border-color: rgba(200, 100, 100, 0.4);
  color: #f0a0a0;
  transform: rotate(90deg);
}

.bm-overall-progress {
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.progress-bar-bg {
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #c084fc, #f472b6);
  border-radius: 5px;
  transition: width 0.8s ease-out;
  box-shadow: 0 0 10px rgba(192, 132, 252, 0.5);
}

.progress-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-percent {
  color: #c084fc;
  font-size: 0.85rem;
  font-weight: 700;
}

.progress-hint {
  color: #707080;
  font-size: 0.75rem;
}

.progress-hint strong {
  color: #a78bfa;
}

.progress-hint.all-unlocked {
  color: #fbbf24;
  font-weight: 600;
}

.bm-rarity-filters {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.rarity-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #808090;
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rarity-filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.rarity-filter-btn.active {
  background: rgba(192, 132, 252, 0.15);
  border-color: rgba(192, 132, 252, 0.4);
  color: #c084fc;
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #808090;
}

.dot-all { background: linear-gradient(135deg, #667eea, #c084fc, #fbbf24); }
.dot-common { background: #94a3b8; }
.dot-rare { background: #60a5fa; }
.dot-epic { background: #c084fc; }
.dot-legendary { background: #fbbf24; }

.filter-count {
  padding: 0.05rem 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 0.68rem;
  font-family: monospace;
}

.bm-badges-grid-wrap {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.3rem;
}

.bm-badges-grid-wrap::-webkit-scrollbar {
  width: 6px;
}

.bm-badges-grid-wrap::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
}

.bm-badges-grid-wrap::-webkit-scrollbar-thumb {
  background: rgba(192, 132, 252, 0.3);
  border-radius: 3px;
}

.bm-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.8rem;
}

.badge-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.8rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
  cursor: default;
  transition: all 0.3s ease;
  position: relative;
  opacity: 0.5;
  filter: grayscale(0.5);
}

.badge-card.unlocked {
  opacity: 1;
  filter: grayscale(0);
  cursor: pointer;
}

.badge-card.unlocked:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.badge-card.newly-unlocked {
  animation: newlyUnlockPulse 1.5s ease-in-out infinite;
}

@keyframes newlyUnlockPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.2); }
  50% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.5); }
}

.badge-card.badge-rarity-common.unlocked {
  background: rgba(148, 163, 184, 0.06);
  border-color: rgba(148, 163, 184, 0.25);
}

.badge-card.badge-rarity-rare.unlocked {
  background: rgba(96, 165, 250, 0.08);
  border-color: rgba(96, 165, 250, 0.3);
}

.badge-card.badge-rarity-epic.unlocked {
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.35);
}

.badge-card.badge-rarity-legendary.unlocked {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
}

.badge-icon-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.2rem;
}

.badge-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.badge-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shineSweep 3s ease-in-out infinite;
}

@keyframes shineSweep {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.badge-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #c0c0d0;
  line-height: 1.3;
}

.badge-rarity-legendary.unlocked .badge-name { color: #fbbf24; }
.badge-rarity-epic.unlocked .badge-name { color: #c084fc; }
.badge-rarity-rare.unlocked .badge-name { color: #60a5fa; }

.badge-lock-hint {
  font-size: 0.65rem;
  color: #606070;
}

.badge-rarity-tag {
  padding: 0.1rem 0.5rem;
  border-radius: 8px;
  font-size: 0.62rem;
  font-weight: 600;
}

.tag-common { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.tag-rare { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.tag-epic { background: rgba(192, 132, 252, 0.15); color: #c084fc; }
.tag-legendary { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.badge-detail-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
}

.bdp-content {
  background: linear-gradient(145deg, rgba(30, 20, 40, 0.98), rgba(20, 15, 30, 0.99));
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 350px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  animation: bdpIn 0.3s ease-out;
}

@keyframes bdpIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bdp-content.bdp-legendary {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.15);
}

.bdp-content.bdp-epic {
  border-color: rgba(192, 132, 252, 0.4);
  box-shadow: 0 0 40px rgba(192, 132, 252, 0.15);
}

.bdp-content.bdp-rare {
  border-color: rgba(96, 165, 250, 0.35);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.1);
}

.bdp-close {
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #707080;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.bdp-close:hover {
  color: #f0a0a0;
  transform: scale(1.2);
}

.bdp-icon-wrap {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.bdp-icon-wrap::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: rotateRing 3s linear infinite;
}

@keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bdp-icon {
  font-size: 3rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
}

.bdp-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #e8e8f0;
}

.bdp-legendary .bdp-name { color: #fbbf24; }
.bdp-epic .bdp-name { color: #c084fc; }
.bdp-rare .bdp-name { color: #60a5fa; }

.bdp-rarity {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.bdpr-common { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.bdpr-rare { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.bdpr-epic { background: rgba(192, 132, 252, 0.15); color: #c084fc; }
.bdpr-legendary { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.bdp-desc {
  margin: 0 0 1.2rem 0;
  color: #b0b0c0;
  font-size: 0.9rem;
  line-height: 1.6;
  font-style: italic;
}

.bdp-check {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
}

.check-icon {
  font-size: 1rem;
}

.check-text {
  color: #86efac;
  font-size: 0.85rem;
  font-weight: 600;
}

.bm-footer {
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.bm-tip {
  margin: 0;
  color: #707080;
  font-size: 0.78rem;
  text-align: center;
  font-style: italic;
}

.badge-list-enter-active,
.badge-list-leave-active {
  transition: all 0.4s ease;
}

.badge-list-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.badge-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.badge-list-move {
  transition: transform 0.4s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
