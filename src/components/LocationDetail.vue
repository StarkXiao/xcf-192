<template>
  <Transition name="modal-fade">
    <div v-if="mapStore.showLocationDetail" class="modal-overlay" @click.self="mapStore.closeLocationDetail">
      <div class="modal-content location-detail-modal">
        <div class="modal-header" :style="{ background: location?.backgroundStyle }">
          <div class="header-content">
            <span class="location-icon-lg">{{ location?.icon }}</span>
            <div>
              <h2 class="modal-title">{{ location?.name }}</h2>
              <div class="header-tags">
                <span class="tag" v-if="isVisited">已探索</span>
                <span class="tag current-tag" v-if="isCurrent">当前位置</span>
              </div>
            </div>
          </div>
          <button class="close-btn" @click="mapStore.closeLocationDetail">×</button>
        </div>

        <div class="modal-body">
          <p class="long-description">{{ location?.longDescription }}</p>

          <div class="detail-section">
            <h4 class="detail-title">
              <span class="detail-icon">🔗</span>
              可连接地点
            </h4>
            <div class="connected-list">
              <div
                v-for="conn in connectedLocations"
                :key="conn.id"
                class="connected-item"
                :class="{ unlocked: conn.isUnlocked }"
              >
                <span class="conn-icon">{{ conn.isUnlocked ? conn.icon : '🔒' }}</span>
                <div class="conn-info">
                  <span class="conn-name">{{ conn.isUnlocked ? conn.name : '未知地点' }}</span>
                  <span v-if="!conn.isUnlocked" class="conn-hint">{{ conn.unlockHint }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="locationMemories.length > 0">
            <h4 class="detail-title">
              <span class="detail-icon">💭</span>
              此地的回忆
            </h4>
            <div class="memories-list">
              <div
                v-for="mem in locationMemories"
                :key="mem.id"
                class="memory-item"
                :class="{ triggered: isTriggered(mem.id) }"
              >
                <span class="mem-icon">{{ isTriggered(mem.id) ? getEmoji(mem.emotion) : '❓' }}</span>
                <div class="mem-info">
                  <span class="mem-title">{{ isTriggered(mem.id) ? mem.title : '???' }}</span>
                  <span v-if="!isTriggered(mem.id)" class="mem-hint">{{ mem.hint }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="clueCount > 0">
            <h4 class="detail-title">
              <span class="detail-icon">🔍</span>
              线索
            </h4>
            <p class="clue-info">此地共有 {{ clueCount }} 条线索，已收集 {{ collectedCount }} 条</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="mapStore.closeLocationDetail">
            关闭
          </button>
          <button
            v-if="!isCurrent"
            class="btn btn-primary"
            :disabled="!canTravel"
            @click="handleTravel"
          >
            {{ canTravel ? '🚶 前往此地' : '🔒 尚未解锁' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { getLocationById, getCluesByLocationId } from '../data/mapData'

const mapStore = useMapStore()

const location = computed(() => {
  if (!mapStore.detailLocationId) return null
  return getLocationById(mapStore.detailLocationId)
})

const isVisited = computed(() => {
  if (!location.value) return false
  return mapStore.visitedLocations.includes(location.value.id)
})

const isCurrent = computed(() => {
  if (!location.value) return false
  return mapStore.currentLocationId === location.value.id
})

const canTravel = computed(() => {
  if (!location.value) return false
  return mapStore.unlockedLocations.includes(location.value.id)
})

const connectedLocations = computed(() => {
  if (!location.value) return []
  return location.value.connectedTo.map(id => {
    const loc = getLocationById(id)
    return {
      id,
      ...loc,
      isUnlocked: mapStore.unlockedLocations.includes(id),
      unlockHint: mapStore.getUnlockHint(loc)
    }
  })
})

const locationMemories = computed(() => {
  return location.value?.memories || []
})

const clueCount = computed(() => {
  if (!location.value) return 0
  return getCluesByLocationId(location.value.id).length
})

const collectedCount = computed(() => {
  if (!location.value) return 0
  return getCluesByLocationId(location.value.id).filter(c =>
    mapStore.collectedClues.includes(c.id)
  ).length
})

function isTriggered(memId) {
  return mapStore.triggeredMemories.includes(memId)
}

function getEmoji(emotion) {
  const map = {
    sad: '😢',
    warm: '🥰',
    pensive: '🤔',
    happy: '😊',
    sweet: '🍬',
    nervous: '😰',
    bittersweet: '😌',
    shocking: '😲',
    romantic: '💕',
    regret: '💔',
    melancholy: '🌧️',
    touched: '🥹',
    determined: '💪'
  }
  return map[emotion] || '💭'
}

function handleTravel() {
  if (!location.value) return
  mapStore.travelTo(location.value.id)
  mapStore.closeLocationDetail()
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
  max-width: 520px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem 1.5rem 1.2rem;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.location-icon-lg {
  font-size: 3rem;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
}

.modal-title {
  font-size: 1.5rem;
  color: #fff;
  margin: 0 0 0.3rem 0;
  font-weight: 500;
  letter-spacing: 0.05rem;
}

.header-tags {
  display: flex;
  gap: 0.4rem;
}

.tag {
  padding: 0.2rem 0.6rem;
  background: rgba(134, 239, 172, 0.15);
  color: #86efac;
  border-radius: 8px;
  font-size: 0.75rem;
  border: 1px solid rgba(134, 239, 172, 0.3);
}

.current-tag {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
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
}

.long-description {
  color: #c0c0d0;
  line-height: 1.9;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  text-indent: 2em;
}

.detail-section {
  margin-bottom: 1.3rem;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #d4a574;
  margin: 0 0 0.7rem 0;
  font-weight: 500;
}

.detail-icon {
  font-size: 1rem;
}

.connected-list,
.memories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.connected-item,
.memory-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  opacity: 0.6;
}

.connected-item.unlocked,
.memory-item.triggered {
  opacity: 1;
  border-color: rgba(102, 126, 234, 0.2);
}

.memory-item.triggered {
  border-color: rgba(167, 139, 250, 0.25);
  background: rgba(167, 139, 250, 0.04);
}

.conn-icon,
.mem-icon {
  font-size: 1.3rem;
}

.conn-info,
.mem-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.conn-name,
.mem-title {
  color: #d0d0e0;
  font-size: 0.9rem;
}

.conn-hint,
.mem-hint {
  font-size: 0.75rem;
  color: #808090;
}

.clue-info {
  color: #a0a0b0;
  font-size: 0.9rem;
  margin: 0;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 0.7rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.7rem 1.3rem;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #c0c0d0;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
