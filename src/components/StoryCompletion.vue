<template>
  <div class="story-completion">
    <div class="sc-header">
      <h2 class="sc-title">
        <span>📖</span>
        故事补完
      </h2>
      <p class="sc-desc">每一件旧物都承载着一段故事，让那些被遗忘的篇章重新流淌</p>
    </div>

    <div class="sc-layout">
      <div class="sc-items-sidebar">
        <div class="sc-sidebar-header">
          <h3>故事列表</h3>
          <div class="sc-stats-badge">
            <span>{{ completedCount }}</span> / <span>{{ unlockedCount }}</span>
          </div>
        </div>
        <div class="sc-items-scroll">
          <div 
            v-for="item in storyItems" 
            :key="item.id"
            class="sc-story-entry"
            :class="{ 
              selected: selectedItem?.id === item.id, 
              complete: collectionStore.isStoryComplete(item.id),
              locked: !collectionStore.isRelicUnlocked(item.id)
            }"
            @click="selectStory(item)"
          >
            <div class="sc-entry-icon-wrap">
              <span class="sc-entry-icon">
                {{ collectionStore.isRelicUnlocked(item.id) ? item.icon : '🔒' }}
              </span>
              <div 
                class="sc-entry-progress-ring"
                :style="{ '--progress': getFragmentProgress(item.id) + '%' }"
              ></div>
            </div>
            <div class="sc-entry-info">
              <h4 class="sc-entry-name">
                {{ collectionStore.isRelicUnlocked(item.id) ? item.name : '未发现的旧物' }}
              </h4>
              <div class="sc-entry-meta">
                <span class="sc-meta-frags">
                  {{ unlockedFragCount(item.id) }}/{{ item.story.fragments.length }} 片段
                </span>
                <span v-if="collectionStore.isStoryComplete(item.id)" class="sc-meta-complete">✓ 完整</span>
              </div>
            </div>
          </div>
          <div v-if="storyItems.length === 0" class="sc-side-empty">
            暂无故事
          </div>
        </div>
      </div>

      <div class="sc-story-panel">
        <div v-if="!selectedItem || !collectionStore.isRelicUnlocked(selectedItem.id)" class="sc-empty-state">
          <div class="sc-empty-icon">📜</div>
          <h3>选择一段故事开始补完</h3>
          <p>每一段故事都由三个片段组成，考证线索可解锁片段</p>
          <p class="sc-empty-sub">也可以花费40金币手动解锁下一个片段</p>
        </div>

        <div v-else class="sc-story-view">
          <div class="sc-story-header" :style="{ borderColor: collectionStore.getRarityColor(selectedItem.rarity) }">
            <div class="sc-sh-icon-wrap">
              <span class="sc-sh-icon">{{ selectedItem.icon }}</span>
              <span class="sc-sh-rarity" :style="{ background: collectionStore.getRarityColor(selectedItem.rarity) }">
                {{ collectionStore.getRarityLabel(selectedItem.rarity) }}
              </span>
            </div>
            <div class="sc-sh-info">
              <h3>{{ selectedItem.name }}</h3>
              <div class="sc-sh-progress">
                <div class="sc-sh-progress-bar">
                  <div 
                    class="sc-sh-progress-fill" 
                    :style="{ width: getFragmentProgress(selectedItem.id) + '%' }"
                  ></div>
                </div>
                <span class="sc-sh-progress-text">
                  故事进度：{{ unlockedFragCount(selectedItem.id) }} / {{ selectedItem.story.fragments.length }}
                </span>
              </div>
            </div>
            <div v-if="collectionStore.isStoryComplete(selectedItem.id)" class="sc-sh-complete-badge">
              <span>📖</span>
              故事完整
            </div>
          </div>

          <div class="sc-fragments-container">
            <div 
              v-for="(frag, idx) in selectedItem.story.fragments" 
              :key="frag.id"
              class="sc-fragment-card"
              :class="{ 
                unlocked: isFragmentUnlocked(frag.id), 
                locked: !isFragmentUnlocked(frag.id),
                next: isNextFragment(idx)
              }"
            >
              <div class="sc-frag-header">
                <div class="sc-frag-num">
                  <span v-if="isFragmentUnlocked(frag.id)">第 {{ idx + 1 }} 章</span>
                  <span v-else>???</span>
                </div>
                <span 
                  v-if="isFragmentUnlocked(frag.id)" 
                  class="sc-frag-status unlocked"
                >已解锁</span>
                <span 
                  v-else-if="isNextFragment(idx)" 
                  class="sc-frag-status next"
                >待解锁</span>
                <span v-else class="sc-frag-status locked">条件未达成</span>
              </div>

              <div v-if="isFragmentUnlocked(frag.id)" class="sc-frag-content">
                <p class="sc-frag-text">{{ frag.text }}</p>
              </div>

              <div v-else class="sc-frag-locked">
                <div class="sc-lock-pattern">
                  <span v-for="n in 8" :key="n" class="sc-lock-dot"></span>
                </div>
                <p v-if="isNextFragment(idx)" class="sc-lock-hint">
                  {{ getUnlockHint(idx) }}
                </p>
                <p v-else class="sc-lock-hint">先解锁上一个故事片段</p>
              </div>

              <div 
                v-if="isNextFragment(idx) && !isFragmentUnlocked(frag.id)" 
                class="sc-frag-actions"
              >
                <button 
                  class="sc-unlock-btn"
                  :class="{ disabled: collectionStore.coins < 40 }"
                  @click="unlockFragment()"
                >
                  <span class="sc-unlock-icon">🪙</span>
                  花费 40 金币解锁
                </button>
                <div class="sc-unlock-alt">
                  或通过「来源考证」解锁相关线索免费解锁
                </div>
              </div>
            </div>
          </div>

          <div v-if="collectionStore.isStoryComplete(selectedItem.id)" class="sc-story-complete-card">
            <div class="sc-scc-left">
              <div class="sc-scc-icon">✨</div>
            </div>
            <div class="sc-scc-right">
              <h4>故事已完整！</h4>
              <p class="sc-scc-quote">
                「所有的碎片都已归位，那段被时光封存的故事，终于可以被完整地讲述了。」
              </p>
              <div class="sc-scc-stats">
                <div class="sc-stat">
                  <span class="sc-stat-icon">💰</span>
                  <span>获得 200 金币奖励</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="collectionStore.isRelicResearched(selectedItem.id) && collectionStore.isRelicRestored(selectedItem.id)" class="sc-origin-card">
            <h4>📚 完整档案</h4>
            <div class="sc-origin-grid">
              <div class="sc-origin-item">
                <span class="sc-oi-label">物品名称</span>
                <span class="sc-oi-value">{{ selectedItem.name }}</span>
              </div>
              <div class="sc-origin-item">
                <span class="sc-oi-label">物品来源</span>
                <span class="sc-oi-value">{{ selectedItem.provenance.origin }}</span>
              </div>
              <div class="sc-origin-item">
                <span class="sc-oi-label">年代</span>
                <span class="sc-oi-value">{{ selectedItem.provenance.year }}</span>
              </div>
              <div class="sc-origin-item">
                <span class="sc-oi-label">曾经拥有</span>
                <span class="sc-oi-value">{{ selectedItem.provenance.owner }}</span>
              </div>
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

const collectionStore = useCollectionStore()

const selectedId = ref(null)
const selectedItem = computed(() => selectedId.value ? collectionStore.getRelicViewModel(selectedId.value) : null)

const storyItems = computed(() => collectionStore.allCollectionItems)

const unlockedCount = computed(() => 
  storyItems.value.filter(i => collectionStore.isRelicUnlocked(i.id)).length
)

const completedCount = computed(() => 
  storyItems.value.filter(i => collectionStore.isStoryComplete(i.id)).length
)

function selectStory(item) {
  if (!collectionStore.isRelicUnlocked(item.id)) return
  selectedId.value = item.id
}

function isFragmentUnlocked(fragId) {
  if (!selectedId.value) return false
  return collectionStore.isFragmentUnlocked(selectedId.value, fragId)
}

function unlockedFragCount(relicId) {
  if (!collectionStore.isRelicUnlocked(relicId)) return 0
  const item = collectionStore.getRelicById(relicId)
  if (!item) return 0
  return item.story.fragments.filter(f => collectionStore.isFragmentUnlocked(relicId, f.id)).length
}

function getFragmentProgress(relicId) {
  if (!collectionStore.isRelicUnlocked(relicId)) return 0
  const item = collectionStore.getRelicById(relicId)
  if (!item || item.story.fragments.length === 0) return 0
  return Math.round((unlockedFragCount(relicId) / item.story.fragments.length) * 100)
}

function isNextFragment(idx) {
  if (!selectedItem.value) return false
  const fragments = selectedItem.value.story.fragments
  for (let i = 0; i < fragments.length; i++) {
    if (!isFragmentUnlocked(fragments[i].id)) {
      return i === idx
    }
  }
  return false
}

function getUnlockHint(idx) {
  const hints = [
    '考证线索1可免费解锁此片段',
    '考证线索2可免费解锁此片段',
    '考证线索3可免费解锁此片段，或点击下方按钮直接解锁'
  ]
  return hints[idx] || '考证相关线索可解锁'
}

function unlockFragment() {
  if (!selectedId.value) return
  const result = collectionStore.unlockNextFragment(selectedId.value)
  if (!result.success) {
    console.warn(result.reason)
  }
}
</script>

<style scoped>
.story-completion {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sc-header { margin-bottom: 1.5rem; }

.sc-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.sc-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.sc-layout {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  overflow: hidden;
}

.sc-items-sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow: hidden;
}

.sc-sidebar-header {
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sc-sidebar-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #d4a574;
}

.sc-stats-badge {
  padding: 0.25rem 0.7rem;
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sc-items-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sc-items-scroll::-webkit-scrollbar { width: 5px; }
.sc-items-scroll::-webkit-scrollbar-thumb {
  background: rgba(192,132,252,0.2);
  border-radius: 3px;
}

.sc-story-entry {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sc-story-entry:hover {
  background: rgba(192,132,252,0.06);
  border-color: rgba(192,132,252,0.2);
}

.sc-story-entry.selected {
  background: rgba(192,132,252,0.12);
  border-color: rgba(192,132,252,0.5);
  box-shadow: 0 0 15px rgba(192,132,252,0.1);
}

.sc-story-entry.complete {
  border-left: 4px solid #86efac;
}

.sc-story-entry.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.sc-entry-icon-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sc-entry-icon { font-size: 1.6rem; }

.sc-entry-progress-ring {
  --progress: 0%;
  position: absolute;
  top: 0; left: 0;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: conic-gradient(
    #c084fc 0%,
    #8b5cf6 var(--progress),
    rgba(255,255,255,0.08) var(--progress),
    rgba(255,255,255,0.08) 100%
  );
  -webkit-mask: radial-gradient(circle, transparent 18px, black 19px);
  mask: radial-gradient(circle, transparent 18px, black 19px);
  opacity: 0.7;
}

.sc-entry-info { flex: 1; min-width: 0; }

.sc-entry-name {
  margin: 0 0 0.35rem 0;
  font-size: 0.88rem;
  color: #e0e0e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-entry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
}

.sc-meta-frags { color: #8a8a9a; }
.sc-meta-complete { color: #86efac; }

.sc-side-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #6a6a7a;
  font-size: 0.9rem;
}

.sc-story-panel {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow-y: auto;
}

.sc-story-panel::-webkit-scrollbar { width: 8px; }
.sc-story-panel::-webkit-scrollbar-thumb {
  background: rgba(192,132,252,0.2);
  border-radius: 4px;
}

.sc-empty-state {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.sc-empty-icon {
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.sc-empty-state h3 {
  font-size: 1.2rem;
  color: #8a8a9a;
  margin: 0 0 0.5rem 0;
}

.sc-empty-state p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #6a6a7a;
}

.sc-empty-sub { font-size: 0.8rem !important; color: #5a5a6a !important; }

.sc-story-view { padding: 1.5rem; }

.sc-story-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  border-left: 4px solid;
  margin-bottom: 1.5rem;
  position: relative;
}

.sc-sh-icon-wrap { position: relative; flex-shrink: 0; }

.sc-sh-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  font-size: 2.2rem;
}

.sc-sh-rarity {
  position: absolute;
  bottom: -6px;
  right: -6px;
  padding: 0.15rem 0.55rem;
  border-radius: 10px;
  font-size: 0.68rem;
  color: #1a1520;
  font-weight: 600;
}

.sc-sh-info { flex: 1; }

.sc-sh-info h3 {
  margin: 0 0 0.7rem 0;
  font-size: 1.25rem;
  color: #f0e6d8;
}

.sc-sh-progress {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.sc-sh-progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.sc-sh-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c084fc, #8b5cf6);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.sc-sh-progress-text {
  font-size: 0.82rem;
  color: #a090c0;
  min-width: 110px;
}

.sc-sh-complete-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(134,239,172,0.18), rgba(34,197,94,0.1));
  color: #86efac;
  border: 1px solid rgba(134,239,172,0.35);
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

.sc-fragments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sc-fragment-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sc-fragment-card.unlocked {
  background: linear-gradient(180deg, rgba(192,132,252,0.06), rgba(255,255,255,0.02));
  border-color: rgba(192,132,252,0.25);
}

.sc-fragment-card.next {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.08);
}

.sc-frag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.2rem;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.sc-frag-num {
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 600;
  letter-spacing: 0.05rem;
}

.sc-frag-status {
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 500;
}

.sc-frag-status.unlocked {
  background: rgba(192,132,252,0.15);
  color: #c084fc;
}

.sc-frag-status.next {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.sc-frag-status.locked {
  background: rgba(148,163,184,0.1);
  color: #94a3b8;
}

.sc-frag-content {
  padding: 1.4rem 1.6rem;
}

.sc-frag-text {
  margin: 0;
  font-size: 0.98rem;
  color: #d8d4e8;
  line-height: 2;
  text-indent: 2em;
  font-style: italic;
  position: relative;
}

.sc-frag-text::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: -5px;
  font-size: 2.5rem;
  color: rgba(192,132,252,0.3);
  font-family: Georgia, serif;
}

.sc-frag-locked {
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.sc-lock-pattern {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  opacity: 0.4;
}

.sc-lock-dot {
  width: 6px;
  height: 6px;
  background: #8a8a9a;
  border-radius: 50%;
  animation: lock-pulse 2s ease-in-out infinite;
}

.sc-lock-dot:nth-child(even) { animation-delay: 0.5s; }

@keyframes lock-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.sc-lock-hint {
  margin: 0;
  font-size: 0.85rem;
  color: #7a7a8a;
  text-align: center;
}

.sc-frag-actions {
  padding: 1rem 1.2rem 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  border-top: 1px dashed rgba(251, 191, 36, 0.2);
}

.sc-unlock-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.8rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: none;
  border-radius: 10px;
  color: #1a1520;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.sc-unlock-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.35);
}

.sc-unlock-btn.disabled {
  background: rgba(255,255,255,0.06);
  color: #5a5a6a;
  cursor: not-allowed;
}

.sc-unlock-icon { font-size: 1.1rem; }

.sc-unlock-alt {
  font-size: 0.75rem;
  color: #6a6a7a;
}

.sc-story-complete-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.4rem;
  background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.06));
  border: 1px solid rgba(251,191,36,0.3);
  border-radius: 14px;
  margin-bottom: 1.5rem;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(251,191,36,0.1); }
  50% { box-shadow: 0 0 25px rgba(251,191,36,0.2); }
}

.sc-scc-icon {
  font-size: 2.8rem;
  animation: sparkle-rotate 3s ease-in-out infinite;
}

@keyframes sparkle-rotate {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(251,191,36,0.8)); }
}

.sc-scc-right { flex: 1; }

.sc-scc-right h4 {
  margin: 0 0 0.6rem 0;
  color: #fbbf24;
  font-size: 1.1rem;
}

.sc-scc-quote {
  margin: 0 0 0.9rem 0;
  font-size: 0.9rem;
  color: #d4c8a8;
  line-height: 1.8;
  font-style: italic;
}

.sc-scc-stats {
  display: flex;
  gap: 1rem;
}

.sc-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  background: rgba(255,215,0,0.1);
  border-radius: 8px;
  font-size: 0.82rem;
  color: #ffd700;
}

.sc-origin-card {
  padding: 1.3rem;
  background: rgba(102,126,234,0.06);
  border: 1px solid rgba(102,126,234,0.25);
  border-radius: 14px;
}

.sc-origin-card h4 {
  margin: 0 0 1rem 0;
  color: #a5b4fc;
  font-size: 1rem;
}

.sc-origin-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.sc-origin-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.7rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
}

.sc-oi-label {
  font-size: 0.72rem;
  color: #7a8aaa;
}

.sc-oi-value {
  font-size: 0.88rem;
  color: #c0c8e0;
  line-height: 1.5;
}
</style>
