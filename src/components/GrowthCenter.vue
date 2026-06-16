<template>
  <Transition name="fade">
    <div v-if="growthStore.showGrowthCenter" class="growth-center" @click.self="closeGrowthCenter">
      <div class="gc-panel">
        <div class="gc-header">
          <div class="gc-header-main">
            <span class="gc-icon">🌱</span>
            <div class="gc-title-wrap">
              <h2 class="gc-title">雾城成长之旅</h2>
              <p class="gc-subtitle">在时光的河流中，留下你的足迹</p>
            </div>
          </div>
          <button class="gc-close-btn" @click="closeGrowthCenter" title="关闭">
            ✕
          </button>
        </div>

        <div class="gc-overview">
          <div class="gc-overview-card">
            <span class="gc-ov-icon">🎮</span>
            <div class="gc-ov-info">
              <span class="gc-ov-value">{{ growthStore.totalPlayCount }}</span>
              <span class="gc-ov-label">游戏次数</span>
            </div>
          </div>
          <div class="gc-overview-card">
            <span class="gc-ov-icon">⏱️</span>
            <div class="gc-ov-info">
              <span class="gc-ov-value">{{ formatTime(growthStore.bestTime) }}</span>
              <span class="gc-ov-label">最佳记录</span>
            </div>
          </div>
          <div class="gc-overview-card">
            <span class="gc-ov-icon">🏆</span>
            <div class="gc-ov-info">
              <span class="gc-ov-value">{{ growthStore.achievementCount }}/{{ growthStore.totalAchievementCount }}</span>
              <span class="gc-ov-label">成就徽章</span>
            </div>
          </div>
          <div class="gc-overview-card">
            <span class="gc-ov-icon">📔</span>
            <div class="gc-ov-info">
              <span class="gc-ov-value">{{ growthStore.diaryCount }}/{{ growthStore.totalDiaryCount }}</span>
              <span class="gc-ov-label">隐藏日记</span>
            </div>
          </div>
        </div>

        <div class="gc-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="gc-tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="gc-tab-icon">{{ tab.icon }}</span>
            <span class="gc-tab-label">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="gc-tab-badge">{{ tab.count }}</span>
          </button>
        </div>

        <div class="gc-content">
          <Transition name="slide-fade" mode="out-in">
            <div v-if="activeTab === 'goals'" key="goals" class="gc-tab-content goals-tab">
              <div class="goals-header">
                <h3 class="goals-title">📖 章节目标</h3>
                <p class="goals-hint">完成章节目标，解锁丰厚奖励</p>
              </div>
              <div class="goals-list">
                <div
                  v-for="goal in growthStore.goalsList"
                  :key="goal.id"
                  class="goal-card"
                  :class="{ completed: goal.completed }"
                >
                  <div class="goal-icon-wrap">
                    <span class="goal-icon">{{ goal.icon }}</span>
                    <div v-if="goal.completed" class="goal-check">✓</div>
                  </div>
                  <div class="goal-info">
                    <h4 class="goal-name">{{ goal.name }}</h4>
                    <p class="goal-desc">{{ goal.description }}</p>
                    <div class="goal-progress-wrap">
                      <div class="goal-progress-bar-bg">
                        <div
                          class="goal-progress-bar-fill"
                          :style="{ width: (goal.progress.current / goal.progress.total * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="goal-progress-text">
                        {{ goal.progress.current }}/{{ goal.progress.total }}
                      </span>
                    </div>
                  </div>
                  <div class="goal-reward">
                    <span v-if="goal.reward?.coins" class="reward-item">
                      🪙 {{ goal.reward.coins }}
                    </span>
                    <span v-if="goal.reward?.diaryUnlock" class="reward-item diary-reward">
                      📔 日记
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'achievements'" key="achievements" class="gc-tab-content achievements-tab">
              <div class="ach-header">
                <h3 class="ach-title">🏆 成就徽章</h3>
                <p class="ach-hint">
                  已解锁 {{ growthStore.achievementCount }}/{{ growthStore.totalAchievementCount }}
                  <span class="ach-percent">({{ growthStore.achievementProgressPercent }}%)</span>
                </p>
              </div>

              <div class="ach-category-filters">
                <button
                  v-for="cat in achievementCategories"
                  :key="cat.key"
                  class="ach-cat-btn"
                  :class="{ active: achievementFilter === cat.key }"
                  @click="achievementFilter = cat.key"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.name }}</span>
                </button>
              </div>

              <div class="ach-grid">
                <div
                  v-for="ach in filteredAchievements"
                  :key="ach.id"
                  class="ach-card"
                  :class="[
                    `ach-rarity-${ach.rarity}`,
                    { unlocked: ach.unlocked, locked: !ach.unlocked }
                  ]"
                  @click="selectAchievement(ach)"
                >
                  <div class="ach-icon-wrap">
                    <span class="ach-icon">{{ ach.unlocked ? ach.icon : '🔒' }}</span>
                    <div v-if="ach.unlocked" class="ach-shine"></div>
                  </div>
                  <div class="ach-info">
                    <span class="ach-name">{{ ach.unlocked ? ach.name : '???' }}</span>
                    <span class="ach-rarity-tag" :class="`tag-${ach.rarity}`">
                      {{ getRarityLabel(ach.rarity) }}
                    </span>
                  </div>
                  <div v-if="!ach.unlocked && ach.progress" class="ach-mini-progress">
                    <div class="amp-bg">
                      <div class="amp-fill" :style="{ width: (ach.progress.current / ach.progress.total * 100) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'diary'" key="diary" class="gc-tab-content diary-tab">
              <div class="diary-header">
                <h3 class="diary-title">📔 隐藏日记</h3>
                <p class="diary-hint">在雾城的角落，拾起散落的记忆</p>
              </div>

              <div class="diary-list">
                <div
                  v-for="diary in growthStore.diariesList"
                  :key="diary.id"
                  class="diary-entry"
                  :class="{ unlocked: diary.unlocked, locked: !diary.unlocked }"
                  @click="diary.unlocked && (selectedDiary = diary)"
                >
                  <div class="diary-icon-wrap">
                    <span class="diary-icon">{{ diary.unlocked ? diary.icon : '🔒' }}</span>
                  </div>
                  <div class="diary-info">
                    <h4 class="diary-name">{{ diary.unlocked ? diary.title : '???' }}</h4>
                    <p class="diary-date">{{ diary.unlocked ? diary.date : '未解锁' }}</p>
                    <p v-if="!diary.unlocked" class="diary-hint-text">{{ diary.hint }}</p>
                    <p v-else class="diary-preview">{{ diary.content.substring(0, 50) }}...</p>
                  </div>
                  <div class="diary-category-tag">
                    {{ getDiaryCategoryLabel(diary.category) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'locations'" key="locations" class="gc-tab-content locations-tab">
              <div class="loc-header">
                <h3 class="loc-title">🗺️ 地点评分</h3>
                <p class="loc-hint">探索每一个角落，留下你的印记</p>
              </div>

              <div class="loc-list">
                <div
                  v-for="location in locationsWithRating"
                  :key="location.id"
                  class="loc-card"
                  :class="{ visited: location.rating }"
                >
                  <div class="loc-icon-wrap">
                    <span class="loc-icon">{{ location.icon }}</span>
                  </div>
                  <div class="loc-info">
                    <h4 class="loc-name">{{ location.name }}</h4>
                    <div class="loc-stars">
                      <span v-for="i in 5" :key="i" class="loc-star" :class="{ filled: i <= (location.rating?.grade?.stars || 0) }">
                        ★
                      </span>
                    </div>
                    <p class="loc-grade-label">
                      {{ location.rating?.grade?.label || '未探索' }}
                    </p>
                  </div>
                  <div class="loc-stats">
                    <div class="loc-stat">
                      <span class="loc-stat-value">{{ location.rating?.bestScore || 0 }}</span>
                      <span class="loc-stat-label">最高分</span>
                    </div>
                    <div class="loc-stat">
                      <span class="loc-stat-value">{{ location.rating?.visitCount || 0 }}</span>
                      <span class="loc-stat-label">造访次数</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <Transition name="scale">
        <div v-if="selectedAchievement" class="ach-detail-popup" @click.self="selectedAchievement = null">
          <div class="adp-content" :class="`adp-${selectedAchievement.rarity}`">
            <div class="adp-close" @click="selectedAchievement = null">×</div>
            <div class="adp-icon-wrap">
              <span class="adp-icon">{{ selectedAchievement.icon }}</span>
            </div>
            <h3 class="adp-name">{{ selectedAchievement.name }}</h3>
            <span class="adp-rarity" :class="`adpr-${selectedAchievement.rarity}`">
              {{ getRarityLabel(selectedAchievement.rarity) }}徽章
            </span>
            <p class="adp-desc">{{ selectedAchievement.description }}</p>
            <div class="adp-progress" v-if="selectedAchievement.progress">
              <div class="adp-progress-bar-bg">
                <div
                  class="adp-progress-bar-fill"
                  :style="{ width: (selectedAchievement.progress.current / selectedAchievement.progress.total * 100) + '%' }"
                ></div>
              </div>
              <span class="adp-progress-text">
                {{ selectedAchievement.progress.current }}/{{ selectedAchievement.progress.total }}
              </span>
            </div>
            <div v-if="selectedAchievement.unlocked" class="adp-check">
              <span class="check-icon">✅</span>
              <span class="check-text">已解锁</span>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="scale">
        <div v-if="selectedDiary" class="diary-detail-popup" @click.self="selectedDiary = null">
          <div class="ddp-content">
            <div class="ddp-close" @click="selectedDiary = null">×</div>
            <div class="ddp-icon-wrap">
              <span class="ddp-icon">{{ selectedDiary.icon }}</span>
            </div>
            <h3 class="ddp-title">{{ selectedDiary.title }}</h3>
            <span class="ddp-date">{{ selectedDiary.date }}</span>
            <div class="ddp-divider"></div>
            <div class="ddp-content-text">
              <p v-for="(para, idx) in diaryParagraphs" :key="idx">{{ para }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGrowthStore } from '../stores/growthStore'
import { mapLocations } from '../data/mapData'
import {
  RARITY_COLORS,
  ACHIEVEMENT_CATEGORIES,
  DIARY_CATEGORIES
} from '../data/growthData'

const growthStore = useGrowthStore()

const activeTab = ref('goals')
const achievementFilter = ref('all')
const selectedAchievement = ref(null)
const selectedDiary = ref(null)

const tabs = computed(() => [
  { id: 'goals', icon: '🎯', label: '章节目标' },
  { id: 'achievements', icon: '🏆', label: '成就徽章', count: growthStore.achievementCount },
  { id: 'diary', icon: '📔', label: '隐藏日记', count: growthStore.diaryCount },
  { id: 'locations', icon: '🗺️', label: '地点评分' }
])

const achievementCategories = computed(() => [
  { key: 'all', name: '全部', icon: '📋' },
  ...Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, val]) => ({
    key,
    name: val.name,
    icon: val.icon
  }))
])

const filteredAchievements = computed(() => {
  if (achievementFilter.value === 'all') {
    return growthStore.achievementsList
  }
  return growthStore.achievementsList.filter(a => a.category === achievementFilter.value)
})

const diaryParagraphs = computed(() => {
  if (!selectedDiary.value) return []
  return selectedDiary.value.content.split('\n').filter(p => p.trim())
})

const locationsWithRating = computed(() => {
  return mapLocations.map(loc => ({
    ...loc,
    rating: growthStore.getLocationRating(loc.id)
  }))
})

function closeGrowthCenter() {
  growthStore.closeGrowthCenter()
}

function selectAchievement(ach) {
  if (ach.unlocked) {
    selectedAchievement.value = ach
  }
}

function getRarityLabel(rarity) {
  return RARITY_COLORS[rarity]?.name || '普通'
}

function getDiaryCategoryLabel(category) {
  return DIARY_CATEGORIES[category]?.name || '其他'
}

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}
</script>

<style scoped>
.growth-center {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gc-panel {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(167, 139, 250, 0.15);
  overflow: hidden;
}

.gc-header {
  padding: 24px 28px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gc-header-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gc-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5));
}

.gc-title-wrap h2 {
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  font-weight: 700;
}

.gc-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0 0;
}

.gc-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.gc-close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: rotate(90deg);
}

.gc-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.gc-overview-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gc-ov-icon {
  font-size: 1.8rem;
}

.gc-ov-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gc-ov-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.gc-ov-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.gc-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.15);
}

.gc-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.gc-tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.gc-tab-btn.active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(139, 92, 246, 0.15));
  color: #c084fc;
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.gc-tab-icon {
  font-size: 1rem;
}

.gc-tab-badge {
  background: rgba(167, 139, 250, 0.3);
  color: #ddd6fe;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.gc-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.goals-header,
.ach-header,
.diary-header,
.loc-header {
  margin-bottom: 20px;
}

.goals-title,
.ach-title,
.diary-title,
.loc-title {
  font-size: 1.2rem;
  color: #fff;
  margin: 0 0 4px 0;
}

.goals-hint,
.ach-hint,
.diary-hint,
.loc-hint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.ach-percent {
  color: #c084fc;
  font-weight: 600;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.3s;
}

.goal-card.completed {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05));
  border-color: rgba(34, 197, 94, 0.3);
}

.goal-icon-wrap {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(167, 139, 250, 0.15);
  border-radius: 12px;
  flex-shrink: 0;
}

.goal-card.completed .goal-icon-wrap {
  background: rgba(34, 197, 94, 0.15);
}

.goal-icon {
  font-size: 1.6rem;
}

.goal-check {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  background: #22c55e;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.goal-info {
  flex: 1;
  min-width: 0;
}

.goal-name {
  font-size: 1rem;
  color: #fff;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.goal-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 8px 0;
}

.goal-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.goal-progress-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.goal-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #8b5cf6);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.goal-card.completed .goal-progress-bar-fill {
  background: linear-gradient(90deg, #22c55e, #10b981);
}

.goal-progress-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.goal-reward {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.reward-item {
  font-size: 0.8rem;
  color: #fbbf24;
  font-weight: 600;
}

.reward-item.diary-reward {
  color: #60a5fa;
}

.ach-category-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.ach-cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.ach-cat-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.ach-cat-btn.active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.1));
  border-color: rgba(167, 139, 250, 0.4);
  color: #c084fc;
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.ach-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.ach-card.unlocked {
  cursor: pointer;
}

.ach-card.locked {
  opacity: 0.5;
  cursor: default;
}

.ach-card:hover.unlocked {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.ach-rarity-common.unlocked {
  border-color: rgba(156, 163, 175, 0.3);
  box-shadow: 0 0 20px rgba(156, 163, 175, 0.1);
}

.ach-rarity-rare.unlocked {
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 0 25px rgba(96, 165, 250, 0.15);
}

.ach-rarity-epic.unlocked {
  border-color: rgba(167, 139, 250, 0.4);
  box-shadow: 0 0 30px rgba(167, 139, 250, 0.2);
}

.ach-rarity-legendary.unlocked {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.25);
}

.ach-icon-wrap {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.ach-icon {
  font-size: 2rem;
}

.ach-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%);
  pointer-events: none;
}

.ach-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.ach-name {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 600;
}

.ach-rarity-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.tag-common { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
.tag-rare { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
.tag-epic { background: rgba(167, 139, 250, 0.2); color: #a78bfa; }
.tag-legendary { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

.ach-mini-progress {
  margin-top: 8px;
}

.amp-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.amp-fill {
  height: 100%;
  background: rgba(167, 139, 250, 0.6);
  border-radius: 2px;
}

.diary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.diary-entry {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s;
}

.diary-entry.unlocked {
  cursor: pointer;
}

.diary-entry.unlocked:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.diary-entry.locked {
  opacity: 0.5;
}

.diary-icon-wrap {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96, 165, 250, 0.15);
  border-radius: 10px;
  flex-shrink: 0;
}

.diary-icon {
  font-size: 1.3rem;
}

.diary-info {
  flex: 1;
  min-width: 0;
}

.diary-name {
  font-size: 0.95rem;
  color: #fff;
  margin: 0 0 2px 0;
  font-weight: 600;
}

.diary-date {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px 0;
}

.diary-hint-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  font-style: italic;
}

.diary-preview {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.diary-category-tag {
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  flex-shrink: 0;
}

.loc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loc-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.loc-card.visited {
  border-color: rgba(251, 191, 36, 0.2);
}

.loc-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  flex-shrink: 0;
}

.loc-icon {
  font-size: 1.5rem;
}

.loc-info {
  flex: 1;
  min-width: 0;
}

.loc-name {
  font-size: 0.95rem;
  color: #fff;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.loc-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
}

.loc-star {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.2);
}

.loc-star.filled {
  color: #fbbf24;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
}

.loc-grade-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.loc-stats {
  display: flex;
  gap: 20px;
}

.loc-stat {
  text-align: center;
}

.loc-stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.loc-stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.ach-detail-popup,
.diary-detail-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.adp-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 32px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.adp-content.adp-common {
  box-shadow: 0 0 60px rgba(156, 163, 175, 0.2);
  border-color: rgba(156, 163, 175, 0.3);
}

.adp-content.adp-rare {
  box-shadow: 0 0 60px rgba(96, 165, 250, 0.25);
  border-color: rgba(96, 165, 250, 0.4);
}

.adp-content.adp-epic {
  box-shadow: 0 0 60px rgba(167, 139, 250, 0.3);
  border-color: rgba(167, 139, 250, 0.4);
}

.adp-content.adp-legendary {
  box-shadow: 0 0 80px rgba(251, 191, 36, 0.3);
  border-color: rgba(251, 191, 36, 0.5);
}

.adp-close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.adp-close:hover {
  color: #fff;
}

.adp-icon-wrap {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  position: relative;
}

.adp-icon {
  font-size: 3rem;
}

.adp-name {
  font-size: 1.4rem;
  color: #fff;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.adp-rarity {
  font-size: 0.85rem;
  padding: 4px 14px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 16px;
  font-weight: 600;
}

.adpr-common { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
.adpr-rare { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
.adpr-epic { background: rgba(167, 139, 250, 0.2); color: #a78bfa; }
.adpr-legendary { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

.adp-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.adp-progress {
  margin-bottom: 16px;
}

.adp-progress-bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.adp-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #8b5cf6);
  border-radius: 4px;
}

.adp-progress-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.adp-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  color: #4ade80;
  font-size: 0.9rem;
  font-weight: 600;
}

.ddp-content {
  background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
  color: #78350f;
  border-radius: 16px;
  padding: 28px;
  max-width: 450px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(251, 191, 36, 0.2);
  font-family: 'Georgia', serif;
}

.ddp-close {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 1.3rem;
  color: rgba(120, 53, 15, 0.5);
  cursor: pointer;
  line-height: 1;
}

.ddp-icon-wrap {
  text-align: center;
  margin-bottom: 12px;
}

.ddp-icon {
  font-size: 2.5rem;
}

.ddp-title {
  text-align: center;
  font-size: 1.3rem;
  margin: 0 0 4px 0;
  color: #92400e;
  font-weight: 700;
}

.ddp-date {
  display: block;
  text-align: center;
  font-size: 0.85rem;
  color: #b45309;
  font-style: italic;
}

.ddp-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #d97706, transparent);
  margin: 16px 0;
}

.ddp-content-text {
  line-height: 1.8;
  font-size: 0.95rem;
  color: #78350f;
}

.ddp-content-text p {
  margin: 0 0 12px 0;
  text-indent: 2em;
}

.ddp-content-text p:last-child {
  margin-bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

@media (max-width: 600px) {
  .gc-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .ach-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
