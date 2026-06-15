<template>
  <div class="map-explore" :style="{ background: currentBgStyle }">
    <div class="fog-layer" :style="{ opacity: currentFogOpacity }"></div>
    <div class="particles-layer">
      <div
        v-for="i in particleCount"
        :key="i"
        class="fog-particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <div class="map-header">
      <div class="header-left">
        <button class="header-btn" @click="handleBack">
          ← 返回
        </button>
        <div class="progress-info">
          <span class="progress-icon">🗺️</span>
          <span class="progress-text">探索进度 {{ progress }}%</span>
        </div>
      </div>
      <div class="header-right">
        <div class="mood-indicator" :style="{ color: mapStore.getMoodColor() }">
          <span class="mood-icon">💭</span>
          <span class="mood-text">{{ mapStore.getMoodStateName() }}</span>
        </div>
        <button class="header-btn clue-btn" @click="mapStore.openClueTracker">
          <span>🔍</span>
          <span>线索 ({{ mapStore.collectedCluesCount }}/{{ mapStore.totalClues }})</span>
        </button>
        <button class="header-btn memory-btn" @click="openMemoryList">
          <span>💭</span>
          <span>回忆 ({{ mapStore.triggeredMemoriesCount }}/{{ mapStore.totalMemories }})</span>
        </button>
      </div>
    </div>

    <div class="map-main-area">
      <div class="map-canvas">
        <svg class="connections-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g v-for="conn in allConnections" :key="conn.from + '-' + conn.to">
            <line
              :x1="conn.fromX" :y1="conn.fromY"
              :x2="conn.toX" :y2="conn.toY"
              :class="['connection-line', { active: conn.isUnlocked, locked: !conn.isUnlocked }]"
              stroke-dasharray="0.5,0.5"
            />
          </g>
        </svg>

        <div
          v-for="loc in allLocationsWithStatus"
          :key="loc.id"
          class="location-marker"
          :class="{
            'current': loc.isCurrent,
            'unlocked': loc.isUnlocked,
            'visited': loc.isVisited,
            'locked': !loc.isUnlocked
          }"
          :style="{ left: loc.position.x + '%', top: loc.position.y + '%' }"
          @click="handleLocationClick(loc)"
        >
          <div class="marker-pin">
            <span class="marker-icon">{{ loc.isUnlocked ? loc.icon : '🔒' }}</span>
            <div v-if="loc.isCurrent" class="marker-pulse"></div>
          </div>
          <div class="marker-label" :class="{ 'label-locked': !loc.isUnlocked }">
            {{ loc.isUnlocked ? loc.name : '???' }}
          </div>
          <div v-if="!loc.isUnlocked && loc.unlockHint" class="marker-hint">
            {{ loc.unlockHint }}
          </div>
          <div v-if="loc.isUnlocked && hasUnreadContent(loc.id)" class="marker-notification">
            !
          </div>
        </div>
      </div>
    </div>

    <div class="location-panel">
      <div class="current-location-header">
        <span class="location-icon">{{ currentLocation?.icon }}</span>
        <div class="location-info">
          <h2 class="location-name">{{ currentLocation?.name }}</h2>
          <p class="location-desc">{{ currentLocation?.description }}</p>
        </div>
      </div>

      <div class="location-actions">
        <div class="action-section" v-if="availableEvents.length > 0">
          <h4 class="section-title">
            <span class="section-icon">✨</span>
            发现事件
          </h4>
          <div class="action-list">
            <button
              v-for="event in availableEvents"
              :key="event.id"
              class="action-btn event-btn"
              @click="mapStore.triggerEvent(event.id)"
            >
              <span class="btn-icon">💫</span>
              <span class="btn-label">{{ event.title }}</span>
            </button>
          </div>
        </div>

        <div class="action-section" v-if="availableClues.length > 0">
          <h4 class="section-title">
            <span class="section-icon">🔍</span>
            可发现线索
          </h4>
          <div class="action-list">
            <button
              v-for="clue in availableClues"
              :key="clue.id"
              class="action-btn clue-btn-item"
              @click="collectClue(clue.id)"
            >
              <span class="btn-icon">{{ clue.icon }}</span>
              <span class="btn-label">{{ clue.name }}</span>
              <span class="btn-hint" v-if="clue.importance === 'key'">关键线索</span>
            </button>
          </div>
        </div>

        <div class="action-section" v-if="availableConnections.length > 0">
          <h4 class="section-title">
            <span class="section-icon">🚶</span>
            可前往地点
          </h4>
          <div class="action-list connections-list">
            <button
              v-for="conn in availableConnections"
              :key="conn.id"
              class="action-btn travel-btn"
              :class="{ locked: !conn.isUnlocked }"
              :disabled="!conn.isUnlocked"
              @click="handleTravel(conn.id)"
            >
              <span class="btn-icon">{{ conn.isUnlocked ? conn.icon : '🔒' }}</span>
              <span class="btn-label">{{ conn.isUnlocked ? conn.name : '???' }}</span>
              <span v-if="!conn.isUnlocked && conn.unlockHint" class="btn-hint lock-hint">
                {{ conn.unlockHint }}
              </span>
            </button>
          </div>
        </div>

        <div class="action-section" v-if="locationMemories.length > 0">
          <h4 class="section-title">
            <span class="section-icon">💭</span>
            此地回忆
          </h4>
          <div class="action-list">
            <button
              v-for="mem in locationMemories"
              :key="mem.id"
              class="action-btn memory-btn-item"
              :class="{ triggered: isMemoryTriggered(mem.id) }"
              @click="handleMemoryClick(mem)"
            >
              <span class="btn-icon">{{ isMemoryTriggered(mem.id) ? '📖' : '❓' }}</span>
              <span class="btn-label">{{ isMemoryTriggered(mem.id) ? mem.title : '模糊的记忆...' }}</span>
              <span v-if="!isMemoryTriggered(mem.id)" class="btn-hint">
                {{ mem.hint }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <LocationDetail />
    <ClueTracker />
    <MapEventModal />
    <MemoryModal />
    <MapEnding />
    <MemoryListModal
      v-if="showMemoryList"
      @close="showMemoryList = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { mapLocations } from '../data/mapData'
import LocationDetail from './LocationDetail.vue'
import ClueTracker from './ClueTracker.vue'
import MapEventModal from './MapEventModal.vue'
import MemoryModal from './MemoryModal.vue'
import MapEnding from './MapEnding.vue'
import MemoryListModal from './MemoryListModal.vue'
import { useGameStore } from '../stores/gameStore'

const mapStore = useMapStore()
const gameStore = useGameStore()

const showMemoryList = ref(false)
const particleCount = 30

const currentLocation = computed(() => mapStore.currentLocation)
const progress = computed(() => mapStore.progress)
const allLocationsWithStatus = computed(() => mapStore.allLocationsWithStatus)
const availableConnections = computed(() => mapStore.availableConnections)
const availableEvents = computed(() => mapStore.availableEventsForCurrentLocation)
const availableClues = computed(() => mapStore.availableCluesForCurrentLocation)

const currentBgStyle = computed(() => {
  return currentLocation.value?.backgroundStyle || 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #2a2a4e 100%)'
})

const currentFogOpacity = computed(() => {
  return currentLocation.value?.fogIntensity ?? 0.5
})

const allConnections = computed(() => {
  const connections = []
  const added = new Set()

  for (const loc of mapLocations) {
    for (const connId of loc.connectedTo) {
      const conn = mapLocations.find(l => l.id === connId)
      if (!conn) continue
      const key = [loc.id, connId].sort().join('-')
      if (added.has(key)) continue
      added.add(key)

      const isUnlocked = mapStore.unlockedLocations.includes(loc.id) &&
                         mapStore.unlockedLocations.includes(connId)

      connections.push({
        from: loc.id,
        to: connId,
        fromX: loc.position.x,
        fromY: loc.position.y,
        toX: conn.position.x,
        toY: conn.position.y,
        isUnlocked
      })
    }
  }
  return connections
})

const locationMemories = computed(() => {
  return currentLocation.value?.memories || []
})

function isMemoryTriggered(memId) {
  return mapStore.triggeredMemories.includes(memId)
}

function hasUnreadContent(locationId) {
  if (locationId === mapStore.currentLocationId) return false
  const events = mapLocations.find(l => l.id === locationId)?.events || []
  const hasEvent = events.some(eid => !mapStore.triggeredEvents.includes(eid))
  if (hasEvent) return true

  const clues = mapLocations.find(l => l.id === locationId)?.clues || []
  const hasClue = clues.some(cid => !mapStore.collectedClues.includes(cid))
  return hasClue
}

function getParticleStyle(index) {
  const seed = index * 47
  const left = (seed * 13) % 100
  const top = (seed * 19) % 100
  const delay = (seed * 7) % 8
  const duration = 8 + ((seed * 3) % 6)
  const size = 20 + (seed % 40)
  const opacity = 0.05 + ((seed % 5) * 0.03)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity
  }
}

function handleBack() {
  mapStore.exitMapMode()
}

function handleLocationClick(loc) {
  if (!loc.isUnlocked) return
  mapStore.openLocationDetail(loc.id)
}

function handleTravel(locationId) {
  const result = mapStore.travelTo(locationId)
  if (!result.success) {
    console.log(result.reason)
  }
}

function collectClue(clueId) {
  mapStore.collectClue(clueId)
}

function handleMemoryClick(mem) {
  if (isMemoryTriggered(mem.id)) {
    mapStore.currentMemory = mem
    mapStore.showMemoryModal = true
  } else {
    const available = availableEvents.value
    if (available.length > 0) {
      mapStore.triggerEvent(available[0].id)
    } else {
      const clues = availableClues.value
      if (clues.length > 0) {
        mapStore.collectClue(clues[0].id)
      }
    }
  }
}

function openMemoryList() {
  showMemoryList.value = true
}

onMounted(() => {
  mapStore.checkAllUnlocks()
})
</script>

<style scoped>
.map-explore {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: background 1.5s ease;
}

.fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(200, 200, 220, 0.2) 0%, transparent 70%);
  animation: fog-drift 15s ease-in-out infinite;
  pointer-events: none;
  transition: opacity 1s ease;
  z-index: 1;
}

@keyframes fog-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-25%); }
}

.particles-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.fog-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(200, 200, 220, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(10px);
  animation: particle-float ease-in-out infinite;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) translateX(15px);
    opacity: 0.8;
  }
}

.map-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%);
  z-index: 10;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e0e0f0;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
}

.progress-icon {
  font-size: 1rem;
}

.progress-text {
  color: #a5b4fc;
  font-size: 0.85rem;
}

.mood-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mood-icon {
  font-size: 1rem;
}

.mood-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.clue-btn {
  background: rgba(244, 114, 182, 0.12);
  border-color: rgba(244, 114, 182, 0.25);
}

.memory-btn {
  background: rgba(251, 191, 36, 0.12);
  border-color: rgba(251, 191, 36, 0.25);
}

.map-main-area {
  position: absolute;
  top: 80px;
  left: 0;
  right: 380px;
  bottom: 0;
  padding: 1.5rem;
  z-index: 5;
}

.map-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.connections-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-line {
  stroke-width: 0.3;
  fill: none;
  stroke-linecap: round;
}

.connection-line.active {
  stroke: rgba(165, 180, 252, 0.5);
  animation: line-glow 3s ease-in-out infinite;
}

.connection-line.locked {
  stroke: rgba(100, 100, 120, 0.2);
}

@keyframes line-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.location-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
}

.location-marker:hover {
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 10;
}

.location-marker.locked {
  cursor: not-allowed;
  opacity: 0.5;
}

.marker-pin {
  position: relative;
  width: 50px;
  height: 50px;
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.location-marker.unlocked .marker-pin {
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

.location-marker.visited .marker-pin {
  border-color: rgba(134, 239, 172, 0.5);
  box-shadow: 0 0 20px rgba(134, 239, 172, 0.2);
}

.location-marker.current .marker-pin {
  border-color: rgba(251, 191, 36, 0.7);
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
  background: rgba(50, 40, 20, 0.9);
}

.marker-icon {
  font-size: 1.5rem;
}

.marker-pulse {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.marker-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 0.3rem 0.7rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  color: #e0e0f0;
  font-size: 0.8rem;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.marker-label.label-locked {
  color: #707080;
}

.marker-hint {
  position: absolute;
  top: calc(100% + 30px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.6rem;
  background: rgba(100, 100, 120, 0.5);
  border-radius: 8px;
  color: #b0b0c0;
  font-size: 0.7rem;
  white-space: nowrap;
  max-width: 150px;
  text-align: center;
}

.marker-notification {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  animation: notif-bounce 1s ease-in-out infinite;
}

@keyframes notif-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.location-panel {
  position: absolute;
  top: 80px;
  right: 0;
  bottom: 0;
  width: 380px;
  padding: 1.5rem;
  background: rgba(10, 10, 20, 0.7);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
  z-index: 10;
}

.current-location-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 1.2rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.location-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.location-info {
  flex: 1;
}

.location-name {
  font-size: 1.4rem;
  color: #e8e8f0;
  margin: 0 0 0.3rem 0;
  font-weight: 500;
  letter-spacing: 0.05rem;
}

.location-desc {
  font-size: 0.9rem;
  color: #a0a0b8;
  line-height: 1.6;
  margin: 0;
}

.location-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 0.9rem;
  color: #c0c0d0;
  font-weight: 500;
  letter-spacing: 0.05rem;
}

.section-icon {
  font-size: 1rem;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #d0d0e0;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateX(3px);
}

.action-btn.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.locked:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.btn-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.btn-label {
  flex: 1;
}

.btn-hint {
  font-size: 0.75rem;
  color: #888;
  padding: 0.15rem 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.event-btn {
  border-color: rgba(251, 191, 36, 0.2);
}

.event-btn:hover {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.06);
}

.clue-btn-item {
  border-color: rgba(244, 114, 182, 0.2);
}

.clue-btn-item:hover {
  border-color: rgba(244, 114, 182, 0.4);
  background: rgba(244, 114, 182, 0.06);
}

.btn-hint:has(.key-hint) {
  background: rgba(244, 114, 182, 0.15);
  color: #f472b6;
}

.travel-btn {
  border-color: rgba(102, 126, 234, 0.2);
}

.travel-btn:hover:not(.locked) {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(102, 126, 234, 0.06);
}

.lock-hint {
  background: rgba(100, 100, 120, 0.3);
  color: #888;
}

.memory-btn-item {
  border-color: rgba(167, 139, 250, 0.2);
}

.memory-btn-item:hover {
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(167, 139, 250, 0.06);
}

.memory-btn-item.triggered {
  border-color: rgba(134, 239, 172, 0.3);
  background: rgba(134, 239, 172, 0.04);
}

@media (max-width: 900px) {
  .map-main-area {
    right: 0;
    bottom: 45%;
  }

  .location-panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 45%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .header-right .progress-text,
  .header-right .mood-text {
    display: none;
  }
}
</style>
