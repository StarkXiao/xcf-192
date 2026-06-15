<template>
  <div class="collection-room" v-if="collectionStore.isCollectionRoomActive">
    <div class="cr-bg">
      <div class="cr-particles">
        <div v-for="i in 30" :key="i" class="cr-dust" :style="getDustStyle(i)"></div>
      </div>
      <div class="cr-fog"></div>
    </div>

    <div class="cr-header">
      <div class="cr-header-left">
        <button class="cr-back-btn" @click="handleClose">
          <span class="cr-back-icon">←</span>
          <span class="cr-back-text">返回</span>
        </button>
        <div class="cr-title-wrap">
          <h1 class="cr-title text-shadow">
            <span class="cr-title-icon">🏛️</span>
            雾城收藏室
          </h1>
          <p class="cr-subtitle">在时光的碎片中，拼凑被遗忘的故事</p>
        </div>
      </div>
      <div class="cr-header-right">
        <div class="cr-stat-coin">
          <span class="cr-coin-icon">🪙</span>
          <span class="cr-coin-value">{{ collectionStore.coins }}</span>
        </div>
        <div class="cr-stat-progress">
          <div class="cr-progress-ring" :style="{ '--progress': collectionStore.overallProgress + '%' }">
            <span class="cr-progress-text">{{ collectionStore.overallProgress }}%</span>
          </div>
          <span class="cr-progress-label">收藏完成度</span>
        </div>
      </div>
    </div>

    <div class="cr-stats-bar">
      <div class="cr-stat-item">
        <span class="cr-stat-icon">📦</span>
        <div class="cr-stat-info">
          <span class="cr-stat-value">{{ collectionStore.unlockedRelicCount }}/{{ collectionStore.totalRelicCount }}</span>
          <span class="cr-stat-label">发现旧物</span>
        </div>
      </div>
      <div class="cr-stat-item">
        <span class="cr-stat-icon">🔧</span>
        <div class="cr-stat-info">
          <span class="cr-stat-value">{{ collectionStore.restoredRelicCount }}/{{ collectionStore.totalRelicCount }}</span>
          <span class="cr-stat-label">修复完成</span>
        </div>
      </div>
      <div class="cr-stat-item">
        <span class="cr-stat-icon">🔍</span>
        <div class="cr-stat-info">
          <span class="cr-stat-value">{{ collectionStore.researchedRelicCount }}/{{ collectionStore.totalRelicCount }}</span>
          <span class="cr-stat-label">考证完成</span>
        </div>
      </div>
      <div class="cr-stat-item">
        <span class="cr-stat-icon">📖</span>
        <div class="cr-stat-info">
          <span class="cr-stat-value">{{ collectionStore.storyCompleteCount }}/{{ collectionStore.totalRelicCount }}</span>
          <span class="cr-stat-label">故事完整</span>
        </div>
      </div>
    </div>

    <div class="cr-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="cr-tab-btn"
        :class="{ active: collectionStore.currentTab === tab.id }"
        @click="collectionStore.setTab(tab.id)"
      >
        <span class="cr-tab-icon">{{ tab.icon }}</span>
        <span class="cr-tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="cr-content">
      <div class="cr-main-area">
        <RestorationWorkbench v-if="collectionStore.currentTab === 'room'" />
        <ProvenanceResearch v-else-if="collectionStore.currentTab === 'research'" />
        <StoryCompletion v-else-if="collectionStore.currentTab === 'story'" />
        <CollectionArchive v-else-if="collectionStore.currentTab === 'archive'" />
        <MaterialShop v-else-if="collectionStore.currentTab === 'shop'" />
      </div>

      <div class="cr-side-panel">
        <div class="cr-phases-section">
          <h3 class="cr-section-title">
            <span>🌿</span>
            阶段进度
          </h3>
          <div class="cr-phase-list">
            <div 
              v-for="(phase, phaseId) in collectionStore.phaseProgress" 
              :key="phaseId"
              class="cr-phase-card"
              :class="{ 
                active: collectionStore.currentPhase === phaseId,
                claimed: collectionStore.claimedPhases.includes(phaseId),
                canClaim: phase.canClaim
              }"
            >
              <div class="cr-phase-header">
                <span class="cr-phase-icon">{{ phase.icon }}</span>
                <span class="cr-phase-name">{{ phase.name }}</span>
              </div>
              <div class="cr-phase-stats">
                <div class="cr-phase-stat">
                  <span>修复</span>
                  <span :class="{ highlight: phase.restored >= phase.requiredCount }">
                    {{ phase.restored }}/{{ phase.requiredCount }}
                  </span>
                </div>
                <div class="cr-phase-bar">
                  <div 
                    class="cr-phase-bar-fill" 
                    :style="{ width: Math.min(100, (phase.restored / phase.requiredCount) * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <button 
                v-if="phase.canClaim" 
                class="cr-claim-btn"
                @click="handleClaimPhase(phaseId)"
              >
                🎁 领取奖励
              </button>
              <span v-else-if="collectionStore.claimedPhases.includes(phaseId)" class="cr-claimed-tag">
                ✓ 已领取
              </span>
            </div>
          </div>
        </div>

        <div class="cr-activity-section">
          <h3 class="cr-section-title">
            <span>📜</span>
            近期动态
          </h3>
          <div class="cr-activity-list">
            <div 
              v-for="act in collectionStore.recentActivity.slice(0, 10)" 
              :key="act.id"
              class="cr-activity-item"
              :class="act.type"
            >
              <span class="cr-act-time">{{ act.time }}</span>
              <span class="cr-act-text">{{ act.text }}</span>
            </div>
            <div v-if="collectionStore.recentActivity.length === 0" class="cr-activity-empty">
              探索雾城，寻找遗落的旧物吧...
            </div>
          </div>
        </div>
      </div>
    </div>

    <PhaseRewardModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCollectionStore } from '../stores/collectionStore'
import RestorationWorkbench from './RestorationWorkbench.vue'
import ProvenanceResearch from './ProvenanceResearch.vue'
import StoryCompletion from './StoryCompletion.vue'
import CollectionArchive from './CollectionArchive.vue'
import MaterialShop from './MaterialShop.vue'
import PhaseRewardModal from './PhaseRewardModal.vue'

const collectionStore = useCollectionStore()

const tabs = [
  { id: 'room', icon: '🔧', label: '修复工作台' },
  { id: 'research', icon: '🔍', label: '来源考证' },
  { id: 'story', icon: '📖', label: '故事补完' },
  { id: 'archive', icon: '🏛️', label: '收藏图鉴' },
  { id: 'shop', icon: '🛒', label: '材料商店' }
]

function getDustStyle(index) {
  const seed = index * 53
  return {
    left: `${(seed * 7) % 100}%`,
    top: `${(seed * 13) % 100}%`,
    animationDelay: `${(seed % 20) / 2}s`,
    animationDuration: `${15 + (seed % 10)}s`,
    width: `${3 + (seed % 4)}px`,
    height: `${3 + (seed % 4)}px`
  }
}

function handleClose() {
  collectionStore.closeCollectionRoom()
}

function handleClaimPhase(phaseId) {
  const result = collectionStore.claimPhaseReward(phaseId)
  if (result.success) {
    console.log('领取奖励成功:', result)
  }
}
</script>

<style scoped>
.collection-room {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  background: linear-gradient(180deg, #1a1520 0%, #2a1f35 30%, #1f1a2a 70%, #15101a 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cr-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.cr-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cr-dust {
  position: absolute;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: dust-float linear infinite;
}

@keyframes dust-float {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
}

.cr-fog {
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 80%, rgba(147, 112, 219, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(212, 165, 116, 0.08) 0%, transparent 50%);
  animation: fog-drift 20s ease-in-out infinite;
}

@keyframes fog-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5%); }
}

.cr-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(212, 165, 116, 0.2);
  backdrop-filter: blur(10px);
}

.cr-header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cr-back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #d4a574;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cr-back-btn:hover {
  background: rgba(212, 165, 116, 0.15);
  border-color: rgba(212, 165, 116, 0.4);
  transform: translateX(-3px);
}

.cr-back-icon {
  font-size: 1.1rem;
}

.cr-title-wrap {
  display: flex;
  flex-direction: column;
}

.cr-title {
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
  color: #f0e6d8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.cr-title-icon {
  font-size: 2rem;
  animation: gentle-float 4s ease-in-out infinite;
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.cr-subtitle {
  font-size: 0.85rem;
  color: #9a8a7a;
  margin: 0.3rem 0 0 0;
  letter-spacing: 0.1rem;
}

.text-shadow {
  text-shadow: 0 0 20px rgba(212, 165, 116, 0.3);
}

.cr-header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cr-stat-coin {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 140, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
}

.cr-coin-icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
}

.cr-coin-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
}

.cr-stat-progress {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.25);
  border-radius: 25px;
}

.cr-progress-ring {
  --progress: 0%;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: 
    conic-gradient(
      #667eea 0%, 
      #764ba2 var(--progress), 
      rgba(255, 255, 255, 0.1) var(--progress), 
      rgba(255, 255, 255, 0.1) 100%
    );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cr-progress-ring::before {
  content: '';
  position: absolute;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(26, 21, 32, 0.9);
}

.cr-progress-text {
  position: relative;
  font-size: 0.7rem;
  font-weight: 700;
  color: #a5b4fc;
  z-index: 1;
}

.cr-progress-label {
  font-size: 0.8rem;
  color: #a0a0b0;
}

.cr-stats-bar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cr-stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cr-stat-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(212, 165, 116, 0.2);
  transform: translateY(-2px);
}

.cr-stat-icon {
  font-size: 1.6rem;
}

.cr-stat-info {
  display: flex;
  flex-direction: column;
}

.cr-stat-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: #e8e8f0;
}

.cr-stat-label {
  font-size: 0.75rem;
  color: #8a8a9a;
}

.cr-tabs {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.8rem 2rem;
  background: rgba(0, 0, 0, 0.15);
}

.cr-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px 12px 0 0;
  color: #8a8a9a;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cr-tab-btn:hover {
  background: rgba(212, 165, 116, 0.1);
  color: #d4a574;
  border-color: rgba(212, 165, 116, 0.2);
}

.cr-tab-btn.active {
  background: linear-gradient(180deg, rgba(212, 165, 116, 0.2), rgba(212, 165, 116, 0.05));
  color: #d4a574;
  border-color: rgba(212, 165, 116, 0.4);
  border-bottom-color: transparent;
}

.cr-tab-icon {
  font-size: 1.2rem;
}

.cr-tab-label {
  font-weight: 500;
}

.cr-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 1.5rem;
  gap: 1.5rem;
}

.cr-main-area {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.cr-main-area::-webkit-scrollbar {
  width: 8px;
}

.cr-main-area::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}

.cr-main-area::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.3);
  border-radius: 4px;
}

.cr-main-area::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 165, 116, 0.5);
}

.cr-side-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  overflow-y: auto;
}

.cr-side-panel::-webkit-scrollbar {
  width: 6px;
}

.cr-side-panel::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.2);
  border-radius: 3px;
}

.cr-section-title {
  font-size: 0.95rem;
  color: #d4a574;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(212, 165, 116, 0.15);
}

.cr-phases-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.2rem;
}

.cr-phase-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.cr-phase-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.9rem;
  transition: all 0.3s ease;
}

.cr-phase-card.active {
  background: rgba(212, 165, 116, 0.08);
  border-color: rgba(212, 165, 116, 0.3);
}

.cr-phase-card.canClaim {
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
  50% { box-shadow: 0 0 20px 0 rgba(251, 191, 36, 0.2); }
}

.cr-phase-card.claimed {
  opacity: 0.6;
}

.cr-phase-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.cr-phase-icon {
  font-size: 1.3rem;
}

.cr-phase-name {
  font-size: 0.9rem;
  color: #e0e0e8;
  font-weight: 500;
}

.cr-phase-stats {
  margin-bottom: 0.6rem;
}

.cr-phase-stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #8a8a9a;
  margin-bottom: 0.4rem;
}

.cr-phase-stat .highlight {
  color: #86efac;
  font-weight: 600;
}

.cr-phase-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.cr-phase-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a574, #fbbf24);
  border-radius: 3px;
  transition: width 0.8s ease-out;
}

.cr-claim-btn {
  width: 100%;
  padding: 0.5rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: none;
  border-radius: 8px;
  color: #1a1520;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.cr-claim-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(251, 191, 36, 0.3);
}

.cr-claimed-tag {
  display: block;
  text-align: center;
  font-size: 0.8rem;
  color: #86efac;
}

.cr-activity-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.2rem;
  flex: 1;
  min-height: 200px;
}

.cr-activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.cr-activity-list::-webkit-scrollbar {
  width: 4px;
}

.cr-activity-list::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.2);
  border-radius: 2px;
}

.cr-activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border-left: 3px solid rgba(255, 255, 255, 0.1);
}

.cr-activity-item.success {
  border-left-color: #86efac;
  background: rgba(134, 239, 172, 0.05);
}

.cr-activity-item.info {
  border-left-color: #60a5fa;
}

.cr-act-time {
  font-size: 0.65rem;
  color: #707080;
}

.cr-act-text {
  font-size: 0.8rem;
  color: #b0b0c0;
  line-height: 1.5;
}

.cr-activity-empty {
  padding: 2rem;
  text-align: center;
  color: #606070;
  font-size: 0.85rem;
  font-style: italic;
}
</style>
