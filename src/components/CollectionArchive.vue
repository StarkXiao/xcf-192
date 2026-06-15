<template>
  <div class="collection-archive">
    <div class="ca-header">
      <h2 class="ca-title">
        <span>🏛️</span>
        收藏图鉴
      </h2>
      <p class="ca-desc">所有收集的旧物在这里静静陈列，诉说着雾城的往事</p>
    </div>

    <div class="ca-stats-strip">
      <div class="ca-stat-card ca-sc-unlock">
        <div class="ca-stat-icon">📦</div>
        <div class="ca-stat-info">
          <span class="ca-stat-value">{{ collectionStore.unlockedRelicCount }}</span>
          <span class="ca-stat-label">发现藏品</span>
        </div>
        <div class="ca-stat-bar">
          <div class="ca-stat-fill" :style="{ width: pct(collectionStore.unlockedRelicCount) + '%' }"></div>
        </div>
      </div>
      <div class="ca-stat-card ca-sc-restore">
        <div class="ca-stat-icon">🔧</div>
        <div class="ca-stat-info">
          <span class="ca-stat-value">{{ collectionStore.restoredRelicCount }}</span>
          <span class="ca-stat-label">修复完成</span>
        </div>
        <div class="ca-stat-bar">
          <div class="ca-stat-fill" :style="{ width: pct(collectionStore.restoredRelicCount) + '%' }"></div>
        </div>
      </div>
      <div class="ca-stat-card ca-sc-research">
        <div class="ca-stat-icon">🔍</div>
        <div class="ca-stat-info">
          <span class="ca-stat-value">{{ collectionStore.researchedRelicCount }}</span>
          <span class="ca-stat-label">考证完成</span>
        </div>
        <div class="ca-stat-bar">
          <div class="ca-stat-fill" :style="{ width: pct(collectionStore.researchedRelicCount) + '%' }"></div>
        </div>
      </div>
      <div class="ca-stat-card ca-sc-story">
        <div class="ca-stat-icon">📖</div>
        <div class="ca-stat-info">
          <span class="ca-stat-value">{{ collectionStore.storyCompleteCount }}</span>
          <span class="ca-stat-label">故事完整</span>
        </div>
        <div class="ca-stat-bar">
          <div class="ca-stat-fill" :style="{ width: pct(collectionStore.storyCompleteCount) + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="ca-phase-section" v-for="(phase, phaseId) in phases" :key="phaseId">
      <div class="ca-phase-header">
        <div class="ca-phase-title-wrap">
          <span class="ca-phase-icon">{{ phase.icon }}</span>
          <h3 class="ca-phase-name">{{ phase.name }}</h3>
          <span class="ca-phase-desc">{{ phase.description }}</span>
        </div>
        <div class="ca-phase-count">
          {{ getPhaseUnlocked(phaseId) }}/{{ getPhaseTotal(phaseId) }} 藏品
        </div>
      </div>

      <div class="ca-items-grid">
        <div 
          v-for="item in getPhaseItems(phaseId)" 
          :key="item.id"
          class="ca-item-card"
          :class="{ 
            unlocked: collectionStore.isRelicUnlocked(item.id),
            restored: collectionStore.isRelicRestored(item.id),
            researched: collectionStore.isRelicResearched(item.id),
            story_complete: collectionStore.isStoryComplete(item.id),
            [`rarity-${item.rarity}`]: true
          }"
          @click="openItemDetail(item)"
        >
          <div class="ca-card-glow"></div>
          <div class="ca-item-icon-wrap" :style="{ borderColor: colorOf(item.rarity) }">
            <span class="ca-item-icon">
              {{ collectionStore.isRelicUnlocked(item.id) ? item.icon : '❓' }}
            </span>
            <div class="ca-item-badges">
              <span v-if="collectionStore.isRelicRestored(item.id)" class="ca-badge ca-b-restore" title="已修复">🔧</span>
              <span v-if="collectionStore.isRelicResearched(item.id)" class="ca-badge ca-b-research" title="已考证">🔍</span>
              <span v-if="collectionStore.isStoryComplete(item.id)" class="ca-badge ca-b-story" title="故事完整">📖</span>
            </div>
          </div>
          <h4 class="ca-item-name">
            {{ collectionStore.isRelicUnlocked(item.id) ? item.name : '???' }}
          </h4>
          <span class="ca-item-rarity" :style="{ color: colorOf(item.rarity) }">
            {{ collectionStore.getRarityLabel(item.rarity) }}
          </span>
          
          <div v-if="collectionStore.isRelicUnlocked(item.id)" class="ca-item-progress">
            <div class="ca-ip-row" v-for="metric in getItemMetrics(item.id)" :key="metric.label">
              <span class="ca-ip-label">{{ metric.label }}</span>
              <div class="ca-ip-bar">
                <div class="ca-ip-fill" :style="{ width: metric.value + '%', background: metric.color }"></div>
              </div>
              <span class="ca-ip-value">{{ metric.value }}%</span>
            </div>
          </div>
          <div v-else class="ca-item-locked">
            <span class="ca-lock-text">探索雾城以解锁</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDetail" class="ca-detail-modal" @click.self="closeDetail">
      <div class="ca-detail-content">
        <button class="ca-detail-close" @click="closeDetail">✕</button>
        <div class="ca-detail-header" :style="{ borderColor: colorOf(selectedDetail.rarity) }">
          <div class="ca-d-icon-wrap">
            <span class="ca-d-icon">{{ selectedDetail.icon }}</span>
          </div>
          <div class="ca-d-info">
            <h3>{{ selectedDetail.name }}</h3>
            <div class="ca-d-tags">
              <span class="ca-d-tag" :style="{ background: colorOf(selectedDetail.rarity) }">
                {{ collectionStore.getRarityLabel(selectedDetail.rarity) }}
              </span>
              <span v-if="collectionStore.isRelicRestored(selectedDetail.id)" class="ca-d-tag tag-restore">✓ 修复</span>
              <span v-if="collectionStore.isRelicResearched(selectedDetail.id)" class="ca-d-tag tag-research">✓ 考证</span>
              <span v-if="collectionStore.isStoryComplete(selectedDetail.id)" class="ca-d-tag tag-story">✓ 故事</span>
            </div>
          </div>
        </div>

        <div class="ca-detail-body">
          <div class="ca-detail-section" v-if="selectedDetail.provenance.origin">
            <h5>📜 来源档案</h5>
            <div class="ca-origin-detail">
              <div class="ca-origin-row">
                <span class="ca-or-label">来源</span>
                <span class="ca-or-value">{{ selectedDetail.provenance.origin }}</span>
              </div>
              <div class="ca-origin-row">
                <span class="ca-or-label">年代</span>
                <span class="ca-or-value">{{ selectedDetail.provenance.year }}</span>
              </div>
              <div class="ca-origin-row">
                <span class="ca-or-label">持有者</span>
                <span class="ca-or-value">{{ selectedDetail.provenance.owner }}</span>
              </div>
            </div>
          </div>

          <div class="ca-detail-section" v-if="collectionStore.isStoryComplete(selectedDetail.id)">
            <h5>📖 完整故事</h5>
            <div class="ca-story-detail">
              <p v-for="(frag, idx) in selectedDetail.story.fragments" :key="idx" class="ca-story-para">
                {{ frag.text }}
              </p>
            </div>
          </div>

          <div v-if="!collectionStore.isRelicResearched(selectedDetail.id) || !collectionStore.isRelicRestored(selectedDetail.id) || !collectionStore.isStoryComplete(selectedDetail.id)" class="ca-detail-section ca-next-steps">
            <h5>🎯 下一步</h5>
            <ul class="ca-steps-list">
              <li v-if="!collectionStore.isRelicRestored(selectedDetail.id)">
                <span class="ca-step-icon">🔧</span>
                前往「修复工作台」完成旧物修复
              </li>
              <li v-if="!collectionStore.isRelicResearched(selectedDetail.id)">
                <span class="ca-step-icon">🔍</span>
                前往「来源考证」追溯物品来历
              </li>
              <li v-if="!collectionStore.isStoryComplete(selectedDetail.id)">
                <span class="ca-step-icon">📖</span>
                前往「故事补完」解锁完整故事
              </li>
            </ul>
          </div>
        </div>

        <div class="ca-detail-footer">
          <button class="ca-go-btn" @click="goToWorkbench">
            <span>🔧</span> 前往修复工作台
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCollectionStore } from '../stores/collectionStore'
import { COLLECTION_PHASES } from '../data/collectionData'

const collectionStore = useCollectionStore()
const selectedDetailId = ref(null)
const selectedDetail = computed(() => selectedDetailId.value ? collectionStore.getRelicViewModel(selectedDetailId.value) : null)

const phases = computed(() => COLLECTION_PHASES)

function pct(value) {
  const total = collectionStore.totalRelicCount || 1
  return Math.round((value / total) * 100)
}

function colorOf(rarity) {
  return collectionStore.getRarityColor(rarity)
}

function getPhaseItems(phaseId) {
  return collectionStore.allCollectionItems.filter(i => i.phase === phaseId)
}

function getPhaseTotal(phaseId) {
  return getPhaseItems(phaseId).length
}

function getPhaseUnlocked(phaseId) {
  return getPhaseItems(phaseId).filter(i => collectionStore.isRelicUnlocked(i.id)).length
}

function getItemMetrics(relicId) {
  const relic = collectionStore.getRelicById(relicId)
  if (!relic) return []
  const metrics = []
  metrics.push({
    label: '保存',
    value: relic.condition.current,
    color: getConditionColor(relic.condition.current)
  })
  const restoreSteps = relic.restoration.steps
  const doneSteps = restoreSteps.filter(s => s.done).length
  metrics.push({
    label: '修复',
    value: Math.round((doneSteps / (restoreSteps.length || 1)) * 100),
    color: 'linear-gradient(90deg, #d4a574, #fbbf24)'
  })
  const clues = relic.provenance.clues
  const solved = clues.filter(c => collectionStore.isClueSolved(relicId, c.id)).length
  metrics.push({
    label: '考证',
    value: Math.round((solved / (clues.length || 1)) * 100),
    color: 'linear-gradient(90deg, #60a5fa, #3b82f6)'
  })
  const frags = relic.story.fragments
  const unlockedF = frags.filter(f => collectionStore.isFragmentUnlocked(relicId, f.id)).length
  metrics.push({
    label: '故事',
    value: Math.round((unlockedF / (frags.length || 1)) * 100),
    color: 'linear-gradient(90deg, #c084fc, #8b5cf6)'
  })
  return metrics
}

function getConditionColor(pct) {
  if (pct >= 80) return 'linear-gradient(90deg, #86efac, #22c55e)'
  if (pct >= 50) return 'linear-gradient(90deg, #fbbf24, #f59e0b)'
  if (pct >= 30) return 'linear-gradient(90deg, #fb923c, #f97316)'
  return 'linear-gradient(90deg, #f87171, #ef4444)'
}

function openItemDetail(item) {
  if (!collectionStore.isRelicUnlocked(item.id)) return
  selectedDetailId.value = item.id
}

function closeDetail() {
  selectedDetailId.value = null
}

function goToWorkbench() {
  closeDetail()
  collectionStore.setTab('room')
}
</script>

<style scoped>
.collection-archive {
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.collection-archive::-webkit-scrollbar { width: 10px; }
.collection-archive::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.collection-archive::-webkit-scrollbar-thumb {
  background: rgba(212,165,116,0.25);
  border-radius: 5px;
}
.collection-archive::-webkit-scrollbar-thumb:hover { background: rgba(212,165,116,0.4); }

.ca-header { margin-bottom: 1.5rem; }

.ca-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.ca-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.ca-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.ca-stat-card {
  padding: 1rem 1.2rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ca-sc-unlock { border-top: 3px solid #60a5fa; }
.ca-sc-restore { border-top: 3px solid #fbbf24; }
.ca-sc-research { border-top: 3px solid #c084fc; }
.ca-sc-story { border-top: 3px solid #86efac; }

.ca-stat-icon { font-size: 1.8rem; }

.ca-stat-info {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.ca-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f0e6d8;
}

.ca-stat-label {
  font-size: 0.8rem;
  color: #8a8a9a;
}

.ca-stat-bar {
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}

.ca-stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.ca-phase-section {
  margin-bottom: 2.2rem;
}

.ca-phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.ca-phase-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.ca-phase-icon { font-size: 1.8rem; }

.ca-phase-name {
  margin: 0;
  font-size: 1.15rem;
  color: #f0e6d8;
  font-weight: 500;
}

.ca-phase-desc {
  font-size: 0.82rem;
  color: #7a7a8a;
}

.ca-phase-count {
  padding: 0.4rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  font-size: 0.82rem;
  color: #d4a574;
  font-weight: 600;
}

.ca-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.ca-item-card {
  position: relative;
  padding: 1.3rem 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
}

.ca-item-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212,165,116,0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.ca-card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, var(--glow-color, transparent) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.ca-item-card.rarity-legendary:hover .ca-card-glow {
  --glow-color: rgba(255, 215, 0, 0.15);
  opacity: 1;
}
.ca-item-card.rarity-epic:hover .ca-card-glow {
  --glow-color: rgba(192, 132, 252, 0.15);
  opacity: 1;
}

.ca-item-card.rarity-legendary {
  background: linear-gradient(180deg, rgba(255,215,0,0.04), rgba(255,255,255,0.02));
}
.ca-item-card.rarity-epic {
  background: linear-gradient(180deg, rgba(192,132,252,0.04), rgba(255,255,255,0.02));
}
.ca-item-card.rarity-rare {
  background: linear-gradient(180deg, rgba(96,165,250,0.04), rgba(255,255,255,0.02));
}

.ca-item-card.unlocked { opacity: 1; }
.ca-item-card:not(.unlocked) {
  opacity: 0.5;
  filter: grayscale(0.7);
}

.ca-item-icon-wrap {
  position: relative;
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 2px solid;
  border-radius: 18px;
  transition: all 0.4s ease;
}

.ca-item-card:hover .ca-item-icon-wrap {
  transform: scale(1.08);
}

.ca-item-icon { font-size: 2.2rem; }

.ca-item-badges {
  position: absolute;
  bottom: -8px;
  right: -8px;
  display: flex;
  gap: 3px;
}

.ca-badge {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1520;
  border: 1.5px solid;
  border-radius: 6px;
  font-size: 0.7rem;
}

.ca-b-restore { border-color: #fbbf24; }
.ca-b-research { border-color: #60a5fa; }
.ca-b-story { border-color: #86efac; }

.ca-item-name {
  margin: 0 0 0.4rem 0;
  font-size: 0.95rem;
  color: #e8e8f0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ca-item-rarity {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.05rem;
}

.ca-item-progress {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ca-ip-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ca-ip-label {
  width: 28px;
  font-size: 0.68rem;
  color: #7a7a8a;
  flex-shrink: 0;
}

.ca-ip-bar {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.ca-ip-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.ca-ip-value {
  width: 30px;
  font-size: 0.68rem;
  color: #8a8a9a;
  text-align: right;
  flex-shrink: 0;
}

.ca-item-locked {
  padding-top: 0.3rem;
  text-align: center;
}

.ca-lock-text {
  font-size: 0.75rem;
  color: #5a5a6a;
}

.ca-detail-modal {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ca-detail-content {
  position: relative;
  width: 100%;
  max-width: 580px;
  max-height: 85vh;
  background: linear-gradient(180deg, #1f1830 0%, #1a1520 100%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  overflow: hidden;
  animation: slideUp 0.4s ease;
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.ca-detail-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.ca-detail-close:hover {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.4);
  color: #fca5a5;
}

.ca-detail-header {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  padding: 1.8rem;
  border-bottom: 3px solid;
  background: rgba(255,255,255,0.03);
}

.ca-d-icon-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  flex-shrink: 0;
}

.ca-d-icon { font-size: 2.8rem; }

.ca-d-info h3 {
  margin: 0 0 0.6rem 0;
  font-size: 1.4rem;
  color: #f0e6d8;
}

.ca-d-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ca-d-tag {
  padding: 0.25rem 0.7rem;
  border-radius: 12px;
  font-size: 0.72rem;
  color: #1a1520;
  font-weight: 600;
}

.tag-restore { background: rgba(251,191,36,0.8); color: #78350f; }
.tag-research { background: rgba(96,165,250,0.8); color: #1e3a8a; }
.tag-story { background: rgba(134,239,172,0.8); color: #064e3b; }

.ca-detail-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.8rem;
}

.ca-detail-body::-webkit-scrollbar { width: 6px; }
.ca-detail-body::-webkit-scrollbar-thumb {
  background: rgba(212,165,116,0.2);
  border-radius: 3px;
}

.ca-detail-section {
  margin-bottom: 1.8rem;
}

.ca-detail-section:last-child { margin-bottom: 0; }

.ca-detail-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #d4a574;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(212,165,116,0.15);
}

.ca-origin-detail {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.ca-origin-row {
  display: flex;
  gap: 1rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
}

.ca-or-label {
  width: 70px;
  font-size: 0.85rem;
  color: #8a8a9a;
  flex-shrink: 0;
}

.ca-or-value {
  flex: 1;
  font-size: 0.9rem;
  color: #d8d8e8;
  line-height: 1.6;
}

.ca-story-detail {
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(192,132,252,0.06), rgba(139,92,246,0.03));
  border: 1px solid rgba(192,132,252,0.2);
  border-radius: 12px;
}

.ca-story-para {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #d8d4e8;
  line-height: 2;
  text-indent: 2em;
  font-style: italic;
}

.ca-story-para:last-child { margin-bottom: 0; }

.ca-next-steps {
  padding: 1.2rem;
  background: rgba(251, 191, 36, 0.05);
  border: 1px dashed rgba(251, 191, 36, 0.25);
  border-radius: 12px;
}

.ca-steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ca-steps-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #d0d0dc;
}

.ca-step-icon { font-size: 1.1rem; }

.ca-detail-footer {
  padding: 1.2rem 1.8rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: flex-end;
  background: rgba(0,0,0,0.2);
}

.ca-go-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #d4a574, #c49664);
  border: none;
  border-radius: 10px;
  color: #1a1520;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.88rem;
}

.ca-go-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212,165,116,0.35);
}
</style>
