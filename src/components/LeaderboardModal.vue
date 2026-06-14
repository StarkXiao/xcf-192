<template>
  <Transition name="fade">
    <div v-if="showLeaderboardModal" class="leaderboard-modal" @click.self="closeModal">
      <div class="leaderboard-panel">
        <div class="lb-header">
          <div class="lb-header-main">
            <span class="lb-icon">🏆</span>
            <h2 class="lb-title">纪念日挑战排行榜</h2>
          </div>
          <button class="lb-close-btn" @click="closeModal" title="关闭">
            ✕
          </button>
        </div>

        <div class="lb-tabs">
          <button
            class="lb-tab"
            :class="{ active: activeTab === 'today' }"
            @click="activeTab = 'today'"
          >
            <span class="tab-icon">📅</span>
            <span class="tab-text">今日排行</span>
            <span v-if="todayLeaderboard.length > 0" class="tab-count">{{ todayLeaderboard.length }}</span>
          </button>
          <button
            class="lb-tab"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            <span class="tab-icon">👑</span>
            <span class="tab-text">总排行榜</span>
            <span v-if="topLeaderboard.length > 0" class="tab-count">{{ topLeaderboard.length }}</span>
          </button>
        </div>

        <div class="lb-summary">
          <div class="summary-item">
            <span class="si-icon">🎯</span>
            <span class="si-label">参与次数</span>
            <span class="si-value">{{ totalParticipations }}</span>
          </div>
          <div class="summary-item">
            <span class="si-icon">📊</span>
            <span class="si-label">最高分</span>
            <span class="si-value best-score">{{ highestScore }}</span>
          </div>
          <div class="summary-item">
            <span class="si-icon">🔥</span>
            <span class="si-label">连续挑战</span>
            <span class="si-value streak-val">{{ challengeStreak }}天</span>
          </div>
        </div>

        <div class="lb-content-wrap">
          <div v-if="currentList.length === 0" class="lb-empty">
            <span class="empty-icon">📭</span>
            <p class="empty-text">{{ activeTab === 'today' ? '今日还没有挑战记录' : '还没有排行榜记录' }}</p>
            <p class="empty-hint">快去完成纪念日挑战，登上排行榜吧！</p>
          </div>

          <div v-else class="lb-list">
            <TransitionGroup name="list">
              <div
                v-for="(entry, index) in currentList"
                :key="entry.id"
                class="lb-entry"
                :class="getRankEntryClass(index + 1)"
              >
                <div class="entry-rank" :class="getRankClass(index + 1)">
                  <span v-if="index < 3" class="rank-medal">{{ getMedalIcon(index + 1) }}</span>
                  <span v-else class="rank-number">{{ index + 1 }}</span>
                </div>

                <div class="entry-main">
                  <div class="entry-top">
                    <span class="entry-score">{{ entry.score }}</span>
                    <span class="entry-date">{{ entry.date }}</span>
                  </div>
                  <div class="entry-stats">
                    <div class="stat-mini">
                      <span>💎</span>
                      <span>{{ entry.foundCount }}/{{ entry.totalItems }}</span>
                    </div>
                    <div class="stat-mini">
                      <span>⏱️</span>
                      <span>{{ formatTime(entry.timeUsed) }}</span>
                    </div>
                    <div class="stat-mini">
                      <span>✨</span>
                      <span>{{ entry.craftedCount }}</span>
                    </div>
                    <div class="stat-mini ending-tag" :class="`ending-${entry.endingType}`">
                      <span>{{ getEndingEmoji(entry.endingType) }}</span>
                    </div>
                  </div>
                </div>

                <div class="entry-rank-badge" v-if="index < 10">
                  <span class="erb-icon">{{ challengeStore.getRankBadge(index + 1).icon }}</span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <div class="lb-footer">
          <p class="lb-note">💡 每日挑战物品位置与提示文案随机刷新，快来刷新你的记录吧！</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChallengeStore } from '../stores/challengeStore'

const challengeStore = useChallengeStore()

const activeTab = ref('today')

const showLeaderboardModal = computed(() => challengeStore.showLeaderboardModal)
const topLeaderboard = computed(() => challengeStore.topLeaderboard)
const todayLeaderboard = computed(() => challengeStore.todayLeaderboard)
const challengeStreak = computed(() => challengeStore.challengeStreak)

const currentList = computed(() => {
  return activeTab.value === 'today' ? todayLeaderboard.value : topLeaderboard.value
})

const totalParticipations = computed(() => challengeStore.leaderboard.length)
const highestScore = computed(() => {
  if (challengeStore.leaderboard.length === 0) return 0
  return Math.max(...challengeStore.leaderboard.map(e => e.score))
})

function closeModal() {
  challengeStore.closeLeaderboard()
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}分${sec}秒`
}

function getMedalIcon(rank) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  return medals[rank] || ''
}

function getRankClass(rank) {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  if (rank <= 10) return 'rank-top10'
  return 'rank-normal'
}

function getRankEntryClass(rank) {
  if (rank === 1) return 'entry-gold'
  if (rank === 2) return 'entry-silver'
  if (rank === 3) return 'entry-bronze'
  return ''
}

function getEndingEmoji(type) {
  const emojis = {
    legendary: '👑',
    epic: '🏆',
    special: '💫',
    perfect: '🌟',
    good: '🥰',
    normal: '💭',
    bad: '🌫️',
    despair: '💔'
  }
  return emojis[type] || '💭'
}
</script>

<style scoped>
.leaderboard-modal {
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

.leaderboard-panel {
  background: linear-gradient(145deg, rgba(30, 25, 35, 0.98), rgba(20, 15, 25, 0.99));
  border-radius: 20px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 165, 116, 0.1);
  display: flex;
  flex-direction: column;
  animation: panelIn 0.4s ease-out;
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

.lb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lb-header-main {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.lb-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.lb-title {
  margin: 0;
  color: #d4a574;
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.lb-close-btn {
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

.lb-close-btn:hover {
  background: rgba(200, 100, 100, 0.2);
  border-color: rgba(200, 100, 100, 0.4);
  color: #f0a0a0;
  transform: rotate(90deg);
}

.lb-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lb-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.7rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #808090;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lb-tab:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.lb-tab.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(255, 215, 0, 0.1));
  border-color: rgba(212, 165, 116, 0.5);
  color: #d4a574;
}

.tab-icon {
  font-size: 1rem;
}

.tab-count {
  padding: 0.1rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 600;
}

.lb-tab.active .tab-count {
  background: rgba(212, 165, 116, 0.25);
}

.lb-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0.4rem;
}

.si-icon {
  font-size: 1.1rem;
}

.si-label {
  color: #707080;
  font-size: 0.7rem;
}

.si-value {
  color: #e8e8f0;
  font-size: 1rem;
  font-weight: 700;
}

.si-value.best-score {
  color: #ffd700;
}

.si-value.streak-val {
  color: #f97316;
}

.lb-content-wrap {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.3rem;
}

.lb-content-wrap::-webkit-scrollbar {
  width: 6px;
}

.lb-content-wrap::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
}

.lb-content-wrap::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.3);
  border-radius: 3px;
}

.lb-empty {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 1rem;
  display: block;
}

.empty-text {
  color: #a0a0b0;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  color: #707080;
  font-size: 0.85rem;
  margin: 0;
}

.lb-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lb-entry {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.lb-entry:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(4px);
}

.lb-entry.entry-gold {
  background: linear-gradient(145deg, rgba(255, 215, 0, 0.12), rgba(255, 140, 0, 0.06));
  border-color: rgba(255, 215, 0, 0.35);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

.lb-entry.entry-silver {
  background: linear-gradient(145deg, rgba(192, 192, 192, 0.1), rgba(160, 160, 160, 0.05));
  border-color: rgba(192, 192, 192, 0.3);
}

.lb-entry.entry-bronze {
  background: linear-gradient(145deg, rgba(205, 127, 50, 0.1), rgba(180, 100, 40, 0.05));
  border-color: rgba(205, 127, 50, 0.28);
}

.entry-rank {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.entry-rank.rank-gold {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3), rgba(255, 140, 0, 0.1));
}

.entry-rank.rank-silver {
  background: radial-gradient(circle, rgba(192, 192, 192, 0.25), rgba(160, 160, 160, 0.08));
}

.entry-rank.rank-bronze {
  background: radial-gradient(circle, rgba(205, 127, 50, 0.25), rgba(180, 100, 40, 0.08));
}

.entry-rank.rank-top10 {
  background: rgba(129, 140, 248, 0.15);
}

.entry-rank.rank-normal {
  background: rgba(255, 255, 255, 0.05);
}

.rank-medal {
  font-size: 1.5rem;
  animation: medalBounce 2s ease-in-out infinite;
}

@keyframes medalBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.rank-number {
  color: #808090;
  font-size: 1rem;
  font-weight: 700;
}

.entry-main {
  flex: 1;
  min-width: 0;
}

.entry-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.entry-score {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4a574, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.entry-date {
  color: #606070;
  font-size: 0.7rem;
  font-family: monospace;
}

.entry-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0.15rem 0.45rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  font-size: 0.72rem;
  color: #a0a0b0;
}

.ending-tag {
  padding: 0.15rem 0.35rem;
  font-size: 0.85rem;
}

.ending-tag.ending-legendary { background: rgba(255, 215, 0, 0.15); }
.ending-tag.ending-epic { background: rgba(192, 132, 252, 0.15); }
.ending-tag.ending-special { background: rgba(96, 165, 250, 0.15); }
.ending-tag.ending-perfect { background: rgba(251, 191, 36, 0.15); }
.ending-tag.ending-good { background: rgba(134, 239, 172, 0.15); }
.ending-tag.ending-normal { background: rgba(148, 163, 184, 0.15); }
.ending-tag.ending-bad { background: rgba(100, 116, 139, 0.15); }
.ending-tag.ending-despair { background: rgba(127, 29, 29, 0.2); }

.entry-rank-badge {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.erb-icon {
  font-size: 1.2rem;
  opacity: 0.8;
}

.lb-footer {
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.lb-note {
  margin: 0;
  color: #707080;
  font-size: 0.78rem;
  text-align: center;
  font-style: italic;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
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
