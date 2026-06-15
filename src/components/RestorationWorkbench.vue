<template>
  <div class="restoration-workbench">
    <div class="wb-header">
      <h2 class="wb-title">
        <span>🔧</span>
        修复工作台
      </h2>
      <p class="wb-desc">细心修复每一件旧物，让它们重现当年的光彩</p>
    </div>

    <div class="wb-layout">
      <div class="wb-items-panel">
        <div class="wb-items-header">
          <h3>待修复藏品</h3>
          <div class="wb-filter-tabs">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              class="wb-filter-btn"
              :class="{ active: currentFilter === filter.id }"
              @click="currentFilter = filter.id"
            >
              {{ filter.label }}
              <span class="wb-filter-count">{{ getFilterCount(filter.id) }}</span>
            </button>
          </div>
        </div>
        <div class="wb-items-grid">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            class="wb-item-card"
            :class="{ 
              selected: selectedItem?.id === item.id,
              locked: !collectionStore.isRelicUnlocked(item.id),
              restored: collectionStore.isRelicRestored(item.id)
            }"
            @click="selectItem(item)"
          >
            <div class="wb-item-icon-wrap" :style="{ borderColor: collectionStore.getRarityColor(item.rarity) }">
              <span class="wb-item-icon">{{ collectionStore.isRelicUnlocked(item.id) ? item.icon : '🔒' }}</span>
              <span class="wb-item-rarity" :style="{ background: collectionStore.getRarityColor(item.rarity) }">
                {{ collectionStore.getRarityLabel(item.rarity) }}
              </span>
            </div>
            <div class="wb-item-info">
              <h4 class="wb-item-name">{{ collectionStore.isRelicUnlocked(item.id) ? item.name : '???' }}</h4>
              <div class="wb-item-condition">
                <div class="wb-condition-bar">
                  <div 
                    class="wb-condition-fill" 
                    :style="{ 
                      width: (collectionStore.isRelicUnlocked(item.id) ? item.condition.current : 0) + '%',
                      background: getConditionGradient(item.condition.current)
                    }"
                  ></div>
                </div>
                <span class="wb-condition-text">
                  {{ collectionStore.isRelicUnlocked(item.id) ? item.condition.current + '%' : '--' }}
                </span>
              </div>
              <div class="wb-item-tags">
                <span v-if="collectionStore.isRelicRestored(item.id)" class="wb-tag tag-restored">✓ 已修复</span>
                <span v-else-if="collectionStore.isRelicUnlocked(item.id)" class="wb-tag tag-progress">修复中</span>
                <span v-else class="wb-tag tag-locked">未发现</span>
              </div>
            </div>
            <div class="wb-item-phase">
              {{ getPhaseName(item.phase) }}
            </div>
          </div>
        </div>
      </div>

      <div class="wb-work-panel">
        <div v-if="!selectedItem" class="wb-empty-state">
          <div class="wb-empty-icon">🔨</div>
          <h3>选择一件旧物开始修复</h3>
          <p>点击左侧的藏品卡片，查看修复进度和所需材料</p>
        </div>

        <div v-else class="wb-selected-item">
          <div class="wb-sel-header" :style="{ borderColor: collectionStore.getRarityColor(selectedItem.rarity) }">
            <div class="wb-sel-icon-wrap">
              <span class="wb-sel-icon">{{ selectedItem.icon }}</span>
              <span class="wb-sel-rarity" :style="{ background: collectionStore.getRarityColor(selectedItem.rarity) }">
                {{ collectionStore.getRarityLabel(selectedItem.rarity) }}
              </span>
            </div>
            <div class="wb-sel-info">
              <h3 class="wb-sel-name">{{ selectedItem.name }}</h3>
              <p class="wb-sel-desc">{{ selectedItem.description || '一件承载着回忆的旧物...' }}</p>
            </div>
          </div>

          <div class="wb-condition-section">
            <h4>保存状态</h4>
            <div class="wb-condition-display">
              <div class="wb-condition-big">
                <div class="wb-condition-big-bar">
                  <div 
                    class="wb-condition-big-fill" 
                    :style="{ 
                      width: selectedItem.condition.current + '%',
                      background: getConditionGradient(selectedItem.condition.current)
                    }"
                  ></div>
                </div>
                <span class="wb-condition-big-text">{{ selectedItem.condition.current }}%</span>
              </div>
              <div class="wb-condition-labels">
                <span v-for="(label, idx) in selectedItem.condition.labels" :key="idx" class="wb-cond-label">
                  ⚠ {{ label }}
                </span>
              </div>
            </div>
          </div>

          <div class="wb-materials-section">
            <h4>所需材料</h4>
            <div class="wb-materials-grid">
              <div 
                v-for="mat in selectedItem.restoration.materials" 
                :key="mat.id"
                class="wb-mat-card"
                :class="{ enough: collectionStore.getMaterialCount(mat.id) >= mat.count }"
              >
                <span class="wb-mat-icon">{{ getMaterialIcon(mat.id) }}</span>
                <div class="wb-mat-info">
                  <span class="wb-mat-name">{{ getMaterialName(mat.id) }}</span>
                  <span class="wb-mat-count">
                    <span :class="{ insufficient: collectionStore.getMaterialCount(mat.id) < mat.count }">
                      {{ collectionStore.getMaterialCount(mat.id) }}
                    </span>
                    / {{ mat.count }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="wb-steps-section">
            <h4>修复步骤</h4>
            <div class="wb-steps-list">
              <div 
                v-for="(step, idx) in selectedItem.restoration.steps" 
                :key="step.id"
                class="wb-step-item"
                :class="{ done: step.done, current: !step.done && isCurrentStep(idx), available: canDoStep(step.id) }"
              >
                <div class="wb-step-num">
                  <span v-if="step.done">✓</span>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <div class="wb-step-content">
                  <span class="wb-step-desc">{{ step.desc }}</span>
                  <span class="wb-step-mat">
                    需要：{{ getMaterialName(step.requiredMat) }}
                    <span class="wb-step-mat-count">
                      x{{ getStepRequiredCount(step.requiredMat) }}
                    </span>
                  </span>
                </div>
                <button 
                  v-if="!step.done"
                  class="wb-step-btn"
                  :disabled="!canDoStep(step.id)"
                  @click="doStep(step.id)"
                >
                  {{ canDoStep(step.id) ? '执行' : '材料不足' }}
                </button>
                <span v-else class="wb-step-done-tag">已完成</span>
              </div>
            </div>
          </div>

          <div v-if="selectedItem.restoration.completed" class="wb-complete-banner">
            <div class="wb-complete-icon">✨</div>
            <div class="wb-complete-info">
              <h4>修复完成！</h4>
              <p>这件旧物已经恢复了当年的模样，静静等待着被讲述的故事</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollectionStore } from '../stores/collectionStore'
import { MATERIAL_SHOP, COLLECTION_PHASES } from '../data/collectionData'

const collectionStore = useCollectionStore()

const currentFilter = ref('all')
const selectedItem = ref(null)

const filters = [
  { id: 'all', label: '全部' },
  { id: 'unlocked', label: '已发现' },
  { id: 'progress', label: '修复中' },
  { id: 'completed', label: '已完成' },
  { id: 'locked', label: '未发现' }
]

function getFilterCount(filterId) {
  const items = collectionStore.allCollectionItems
  switch (filterId) {
    case 'all': return items.length
    case 'unlocked': return items.filter(i => collectionStore.isRelicUnlocked(i.id)).length
    case 'progress': return items.filter(i => 
      collectionStore.isRelicUnlocked(i.id) && !collectionStore.isRelicRestored(i.id)
    ).length
    case 'completed': return items.filter(i => collectionStore.isRelicRestored(i.id)).length
    case 'locked': return items.filter(i => !collectionStore.isRelicUnlocked(i.id)).length
    default: return items.length
  }
}

const filteredItems = computed(() => {
  const items = collectionStore.allCollectionItems
  switch (currentFilter.value) {
    case 'unlocked': return items.filter(i => collectionStore.isRelicUnlocked(i.id))
    case 'progress': return items.filter(i => 
      collectionStore.isRelicUnlocked(i.id) && !collectionStore.isRelicRestored(i.id)
    )
    case 'completed': return items.filter(i => collectionStore.isRelicRestored(i.id))
    case 'locked': return items.filter(i => !collectionStore.isRelicUnlocked(i.id))
    default: return items
  }
})

function selectItem(item) {
  if (!collectionStore.isRelicUnlocked(item.id)) {
    return
  }
  selectedItem.value = item
}

function getPhaseName(phaseId) {
  return COLLECTION_PHASES[phaseId]?.name || phaseId
}

function getMaterialName(matId) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  return mat ? mat.name : matId
}

function getMaterialIcon(matId) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  return mat ? mat.icon : '📦'
}

function getConditionGradient(percent) {
  if (percent >= 80) return 'linear-gradient(90deg, #86efac, #22c55e)'
  if (percent >= 50) return 'linear-gradient(90deg, #fbbf24, #f59e0b)'
  if (percent >= 30) return 'linear-gradient(90deg, #fb923c, #f97316)'
  return 'linear-gradient(90deg, #f87171, #ef4444)'
}

function canDoStep(stepId) {
  return selectedItem.value && collectionStore.canRestoreStep(selectedItem.value.id, stepId)
}

function isCurrentStep(idx) {
  if (!selectedItem.value) return false
  const steps = selectedItem.value.restoration.steps
  for (let i = 0; i < steps.length; i++) {
    if (!steps[i].done) return i === idx
  }
  return false
}

function getStepRequiredCount(matId) {
  if (!selectedItem.value) return 0
  const mat = selectedItem.value.restoration.materials.find(m => m.id === matId)
  return mat ? mat.count : 0
}

function doStep(stepId) {
  if (!selectedItem.value) return
  const result = collectionStore.performRestoreStep(selectedItem.value.id, stepId)
  if (result.success) {
    if (result.completed) {
      selectedItem.value = { ...result.relic }
    }
  }
}
</script>

<style scoped>
.restoration-workbench {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.wb-header {
  margin-bottom: 1.5rem;
}

.wb-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.wb-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.wb-layout {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  overflow: hidden;
}

.wb-items-panel {
  width: 340px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.wb-items-header {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.wb-items-header h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  color: #d4a574;
}

.wb-filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.wb-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.7rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  color: #8a8a9a;
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.2s ease;
}

.wb-filter-btn:hover {
  background: rgba(212, 165, 116, 0.1);
  color: #d4a574;
}

.wb-filter-btn.active {
  background: rgba(212, 165, 116, 0.18);
  color: #d4a574;
  border-color: rgba(212, 165, 116, 0.3);
}

.wb-filter-count {
  padding: 0.05rem 0.45rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.7rem;
}

.wb-items-grid {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.wb-items-grid::-webkit-scrollbar {
  width: 6px;
}

.wb-items-grid::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.2);
  border-radius: 3px;
}

.wb-item-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.wb-item-card:hover {
  background: rgba(212, 165, 116, 0.06);
  border-color: rgba(212, 165, 116, 0.2);
  transform: translateX(3px);
}

.wb-item-card.selected {
  background: rgba(212, 165, 116, 0.12);
  border-color: rgba(212, 165, 116, 0.5);
  box-shadow: 0 0 20px rgba(212, 165, 116, 0.15);
}

.wb-item-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.wb-item-card.restored {
  border-left: 4px solid #86efac;
}

.wb-item-icon-wrap {
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid;
  flex-shrink: 0;
}

.wb-item-icon {
  font-size: 1.8rem;
}

.wb-item-rarity {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 0.1rem 0.4rem;
  border-radius: 8px;
  font-size: 0.62rem;
  color: #1a1520;
  font-weight: 600;
}

.wb-item-info {
  flex: 1;
  min-width: 0;
}

.wb-item-name {
  margin: 0 0 0.4rem 0;
  font-size: 0.9rem;
  color: #e0e0e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wb-item-condition {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.wb-condition-bar {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.wb-condition-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.wb-condition-text {
  font-size: 0.72rem;
  color: #8a8a9a;
  min-width: 32px;
  text-align: right;
}

.wb-item-tags {
  display: flex;
  gap: 0.3rem;
}

.wb-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  font-size: 0.68rem;
}

.wb-tag.tag-restored {
  background: rgba(134, 239, 172, 0.15);
  color: #86efac;
}

.wb-tag.tag-progress {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.wb-tag.tag-locked {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
}

.wb-item-phase {
  position: absolute;
  top: 0.5rem;
  right: 0.7rem;
  font-size: 0.65rem;
  color: #6a6a7a;
}

.wb-work-panel {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
}

.wb-work-panel::-webkit-scrollbar {
  width: 8px;
}

.wb-work-panel::-webkit-scrollbar-thumb {
  background: rgba(212, 165, 116, 0.2);
  border-radius: 4px;
}

.wb-empty-state {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.wb-empty-icon {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.wb-empty-state h3 {
  font-size: 1.2rem;
  color: #8a8a9a;
  margin: 0 0 0.5rem 0;
}

.wb-empty-state p {
  font-size: 0.9rem;
  color: #6a6a7a;
  margin: 0;
}

.wb-selected-item {
  padding: 1.5rem;
}

.wb-sel-header {
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  border-left: 4px solid;
  margin-bottom: 1.5rem;
}

.wb-sel-icon-wrap {
  position: relative;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  flex-shrink: 0;
}

.wb-sel-icon {
  font-size: 2.5rem;
}

.wb-sel-rarity {
  position: absolute;
  bottom: -8px;
  right: -8px;
  padding: 0.15rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  color: #1a1520;
  font-weight: 600;
}

.wb-sel-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #f0e6d8;
}

.wb-sel-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #9a9aaa;
  line-height: 1.6;
}

.wb-condition-section,
.wb-materials-section,
.wb-steps-section {
  margin-bottom: 1.5rem;
}

.wb-condition-section h4,
.wb-materials-section h4,
.wb-steps-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #d4a574;
  font-weight: 500;
}

.wb-condition-display {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.wb-condition-big {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wb-condition-big-bar {
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  overflow: hidden;
}

.wb-condition-big-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.8s ease;
  box-shadow: 0 0 10px currentColor;
}

.wb-condition-big-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f0e6d8;
  min-width: 60px;
}

.wb-condition-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.wb-cond-label {
  padding: 0.3rem 0.7rem;
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
  border-radius: 8px;
  font-size: 0.8rem;
}

.wb-materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.7rem;
}

.wb-mat-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.wb-mat-card.enough {
  border-color: rgba(134, 239, 172, 0.3);
  background: rgba(134, 239, 172, 0.05);
}

.wb-mat-icon {
  font-size: 1.5rem;
}

.wb-mat-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.wb-mat-name {
  font-size: 0.85rem;
  color: #c0c0d0;
}

.wb-mat-count {
  font-size: 0.8rem;
  color: #8a8a9a;
}

.wb-mat-count .insufficient {
  color: #f87171;
  font-weight: 600;
}

.wb-steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.wb-step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.wb-step-item.done {
  background: rgba(134, 239, 172, 0.06);
  border-color: rgba(134, 239, 172, 0.25);
}

.wb-step-item.current {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.06);
}

.wb-step-item.available {
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

.wb-step-num {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #8a8a9a;
  font-weight: 600;
  flex-shrink: 0;
}

.wb-step-item.done .wb-step-num {
  background: #86efac;
  color: #064e3b;
}

.wb-step-item.current .wb-step-num {
  background: #fbbf24;
  color: #78350f;
}

.wb-step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wb-step-desc {
  font-size: 0.92rem;
  color: #d0d0dc;
}

.wb-step-mat {
  font-size: 0.78rem;
  color: #8a8a9a;
}

.wb-step-mat-count {
  color: #d4a574;
  font-weight: 500;
}

.wb-step-btn {
  padding: 0.5rem 1.2rem;
  background: linear-gradient(135deg, #d4a574, #c49664);
  border: none;
  border-radius: 8px;
  color: #1a1520;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.wb-step-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(212, 165, 116, 0.35);
}

.wb-step-btn:disabled {
  background: rgba(255, 255, 255, 0.06);
  color: #5a5a6a;
  cursor: not-allowed;
}

.wb-step-done-tag {
  padding: 0.4rem 0.9rem;
  background: rgba(134, 239, 172, 0.15);
  color: #86efac;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  flex-shrink: 0;
}

.wb-complete-banner {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.3rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.08));
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 14px;
  animation: complete-banner 0.6s ease-out;
}

@keyframes complete-banner {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.wb-complete-icon {
  font-size: 2.5rem;
  animation: sparkle-rotate 2s ease-in-out infinite;
}

@keyframes sparkle-rotate {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5)); }
  50% { filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.8)); }
}

.wb-complete-info h4 {
  margin: 0 0 0.4rem 0;
  font-size: 1.15rem;
  color: #fbbf24;
}

.wb-complete-info p {
  margin: 0;
  font-size: 0.88rem;
  color: #d4c8a8;
}
</style>
