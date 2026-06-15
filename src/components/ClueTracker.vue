<template>
  <Transition name="modal-fade">
    <div v-if="mapStore.showClueTracker" class="modal-overlay" @click.self="mapStore.closeClueTracker">
      <div class="modal-content clue-tracker-modal">
        <div class="modal-header">
          <div class="header-title-wrap">
            <span class="header-icon">🔍</span>
            <h2 class="modal-title">线索追踪</h2>
          </div>
          <div class="header-progress">
            <span class="progress-num">{{ mapStore.collectedCluesCount }}</span>
            <span class="progress-sep">/</span>
            <span class="progress-total">{{ mapStore.totalClues }}</span>
          </div>
          <button class="close-btn" @click="mapStore.closeClueTracker">×</button>
        </div>

        <div class="modal-body">
          <div class="clue-tabs">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'all' }"
              @click="activeTab = 'all'"
            >
              全部 ({{ mapStore.collectedCluesCount }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'key' }"
              @click="activeTab = 'key'"
            >
              关键 ({{ keyClues.length }})
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'legendary' }"
              @click="activeTab = 'legendary'"
            >
              传说 ({{ legendaryClues.length }})
            </button>
          </div>

          <div class="clue-progress-bar">
            <div class="clue-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <div class="clues-grid" v-if="filteredClues.length > 0">
            <div
              v-for="clue in filteredClues"
              :key="clue.id"
              class="clue-card"
              :class="`importance-${clue.importance}`"
              @click="openClueDetail(clue)"
            >
              <span class="clue-icon">{{ clue.icon }}</span>
              <span class="clue-name">{{ clue.name }}</span>
              <span class="clue-category">{{ clue.category }}</span>
            </div>
          </div>

          <div class="empty-state" v-else>
            <span class="empty-icon">🔍</span>
            <p class="empty-text">还没有收集到线索</p>
            <p class="empty-hint">去雾城的各个角落探索吧</p>
          </div>

          <div class="clue-detail-panel" v-if="selectedClue">
            <div class="detail-header">
              <span class="detail-icon">{{ selectedClue.icon }}</span>
              <div class="detail-info">
                <h4 class="detail-name">{{ selectedClue.name }}</h4>
                <span class="detail-category">{{ selectedClue.category }} · {{ getImportanceLabel(selectedClue.importance) }}</span>
              </div>
              <button class="detail-close" @click="selectedClue = null">×</button>
            </div>
            <p class="detail-description">{{ selectedClue.description }}</p>
            <div class="detail-location">
              <span class="loc-label">发现地点：</span>
              <span class="loc-value">{{ getLocationName(selectedClue.locationId) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { getLocationById } from '../data/mapData'

const mapStore = useMapStore()
const activeTab = ref('all')
const selectedClue = ref(null)

const keyClues = computed(() => mapStore.keyClues)
const legendaryClues = computed(() => mapStore.legendaryClues)

const filteredClues = computed(() => {
  const all = mapStore.collectedCluesList
  switch (activeTab.value) {
    case 'key':
      return all.filter(c => c.importance === 'key')
    case 'legendary':
      return all.filter(c => c.importance === 'legendary')
    default:
      return all
  }
})

const progressPercent = computed(() => {
  if (mapStore.totalClues === 0) return 0
  return (mapStore.collectedCluesCount / mapStore.totalClues) * 100
})

function getImportanceLabel(importance) {
  const map = {
    key: '关键线索',
    normal: '普通线索',
    legendary: '传说线索'
  }
  return map[importance] || importance
}

function getLocationName(locationId) {
  const loc = getLocationById(locationId)
  return loc?.name || '未知地点'
}

function openClueDetail(clue) {
  selectedClue.value = clue
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.header-icon {
  font-size: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  color: #e8e8f0;
  margin: 0;
  font-weight: 500;
}

.header-progress {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  color: #f472b6;
  font-weight: 600;
}

.progress-num {
  font-size: 1.3rem;
}

.progress-sep {
  color: #707080;
}

.progress-total {
  font-size: 0.95rem;
  color: #a0a0b0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.clue-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #a0a0b0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.tab-btn.active {
  background: rgba(244, 114, 182, 0.15);
  border-color: rgba(244, 114, 182, 0.35);
  color: #f472b6;
}

.clue-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.clue-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f472b6, #c084fc);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.clues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.7rem;
}

.clue-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clue-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

.clue-card.importance-key {
  border-color: rgba(244, 114, 182, 0.25);
  background: rgba(244, 114, 182, 0.05);
}

.clue-card.importance-legendary {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.06);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.1);
}

.clue-icon {
  font-size: 2rem;
}

.clue-name {
  font-size: 0.85rem;
  color: #d0d0e0;
  text-align: center;
  font-weight: 500;
}

.clue-category {
  font-size: 0.7rem;
  color: #808090;
  padding: 0.1rem 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #707080;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.empty-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #606070;
}

.clue-detail-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.2rem;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.detail-icon {
  font-size: 2.2rem;
}

.detail-info {
  flex: 1;
}

.detail-name {
  margin: 0 0 0.2rem 0;
  font-size: 1.1rem;
  color: #e8e8f0;
}

.detail-category {
  font-size: 0.78rem;
  color: #f472b6;
}

.detail-close {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #a0a0b0;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-description {
  color: #c0c0d0;
  line-height: 1.7;
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
}

.detail-location {
  font-size: 0.85rem;
  color: #a0a0b0;
}

.loc-label {
  color: #707080;
}

.loc-value {
  color: #a5b4fc;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
