<template>
  <div class="provenance-research">
    <div class="pr-header">
      <h2 class="pr-title">
        <span>🔍</span>
        来源考证
      </h2>
      <p class="pr-desc">追溯每一件旧物的来历，揭开时光背后的秘密</p>
    </div>

    <div class="pr-layout">
      <div class="pr-items-list">
        <div class="pr-list-header">
          <h3>考证列表</h3>
          <div class="pr-summary">
            <span class="pr-sum-item">
              <span class="pr-sum-label">待考证</span>
              <span class="pr-sum-value">{{ pendingCount }}</span>
            </span>
            <span class="pr-sum-item">
              <span class="pr-sum-label">已完成</span>
              <span class="pr-sum-value pr-value-done">{{ doneCount }}</span>
            </span>
          </div>
        </div>
        <div class="pr-items-scroll">
          <div 
            v-for="item in unlockedItems" 
            :key="item.id"
            class="pr-item-entry"
            :class="{ selected: selectedItem?.id === item.id, done: isResearchDone(item.id) }"
            @click="selectItem(item)"
          >
            <div class="pr-entry-icon">{{ item.icon }}</div>
            <div class="pr-entry-info">
              <h4 class="pr-entry-name">{{ item.name }}</h4>
              <div class="pr-entry-progress">
                <div class="pr-progress-bar">
                  <div 
                    class="pr-progress-fill" 
                    :style="{ width: getClueProgress(item.id) + '%' }"
                  ></div>
                </div>
                <span class="pr-progress-text">
                  {{ solvedCountFor(item.id) }}/{{ item.provenance.clues.length }}
                </span>
              </div>
            </div>
            <div v-if="isResearchDone(item.id)" class="pr-entry-done">✓</div>
          </div>
          <div v-if="unlockedItems.length === 0" class="pr-list-empty">
            <span class="pr-empty-icon">📦</span>
            <p>还没有发现可以考证的旧物</p>
            <p class="pr-empty-sub">探索雾城，收集旧物后再来吧</p>
          </div>
        </div>
      </div>

      <div class="pr-research-panel">
        <div v-if="!selectedItem" class="pr-empty-state">
          <div class="pr-empty-icon">🔎</div>
          <h3>选择一件旧物开始考证</h3>
          <p>每一件旧物都有它的故事，每一个线索都指向真相</p>
        </div>

        <div v-else class="pr-selected">
          <div class="pr-sel-header">
            <div class="pr-sel-icon-wrap" :style="{ borderColor: collectionStore.getRarityColor(selectedItem.rarity) }">
              <span class="pr-sel-icon">{{ selectedItem.icon }}</span>
            </div>
            <div class="pr-sel-title">
              <h3>{{ selectedItem.name }}</h3>
              <span 
                class="pr-sel-rarity" 
                :style="{ background: collectionStore.getRarityColor(selectedItem.rarity) }"
              >
                {{ collectionStore.getRarityLabel(selectedItem.rarity) }}
              </span>
            </div>
          </div>

          <div v-if="isResearchDone(selectedItem.id)" class="pr-origin-card">
            <h4>📜 考证结果</h4>
            <div class="pr-origin-content">
              <div class="pr-origin-row">
                <span class="pr-origin-label">来　　源</span>
                <span class="pr-origin-value">{{ selectedItem.provenance.origin }}</span>
              </div>
              <div class="pr-origin-row">
                <span class="pr-origin-label">年　　代</span>
                <span class="pr-origin-value">{{ selectedItem.provenance.year }}</span>
              </div>
              <div class="pr-origin-row">
                <span class="pr-origin-label">曾经拥有</span>
                <span class="pr-origin-value">{{ selectedItem.provenance.owner }}</span>
              </div>
            </div>
          </div>

          <div class="pr-clues-section">
            <h4>考证线索</h4>
            <div class="pr-clues-list">
              <div 
                v-for="(clue, idx) in selectedItem.provenance.clues" 
                :key="clue.id"
                class="pr-clue-card"
                :class="{ solved: collectionStore.isClueSolved(selectedItem.id, clue.id), current: isCurrentClue(idx) }"
              >
                <div class="pr-clue-header">
                  <span class="pr-clue-num">线索 {{ idx + 1 }}</span>
                  <span v-if="collectionStore.isClueSolved(selectedItem.id, clue.id)" class="pr-clue-status solved">已考证</span>
                  <span v-else-if="isCurrentClue(idx)" class="pr-clue-status current">考证中</span>
                  <span v-else class="pr-clue-status locked">待解开</span>
                </div>
                <div class="pr-clue-text">
                  <span class="pr-quote">「</span>
                  {{ clue.text }}
                  <span class="pr-quote">」</span>
                </div>
                
                <div v-if="!collectionStore.isClueSolved(selectedItem.id, clue.id) && isCurrentClue(idx)" class="pr-clue-input-wrap">
                  <div class="pr-clue-hint" @click="showHint(clue)">
                    💡 {{ currentHint === clue.id ? clue.hint : '点击查看提示' }}
                  </div>
                  <div class="pr-input-row">
                    <input 
                      v-model="answerInputs[clue.id]"
                      type="text" 
                      class="pr-clue-input"
                      :placeholder="'输入你的考证答案...'"
                      @keyup.enter="submitAnswer(clue.id)"
                    />
                    <button 
                      class="pr-submit-btn"
                      @click="submitAnswer(clue.id)"
                      :disabled="!answerInputs[clue.id]?.trim()"
                    >
                      考证
                    </button>
                  </div>
                  <div v-if="lastResult[clue.id]" class="pr-result-msg" :class="lastResult[clue.id].success ? 'success' : 'error'">
                    {{ lastResult[clue.id].msg }}
                  </div>
                </div>

                <div v-if="collectionStore.isClueSolved(selectedItem.id, clue.id) && clueExplanations[clue.id]" class="pr-clue-explanation">
                  <span class="pr-explain-icon">📖</span>
                  {{ clueExplanations[clue.id] }}
                </div>
              </div>
            </div>
          </div>

          <div class="pr-tips-card">
            <span class="pr-tips-icon">💡</span>
            <div class="pr-tips-content">
              <strong>考证小贴士：</strong>
              <p>仔细阅读线索，结合雾城的背景故事，答案往往藏在你和她的回忆之中。</p>
              <p class="pr-tips-reward">每考证一条线索，可获得30金币，并解锁一段故事片段。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, computed, reactive, watch } from 'vue';
import { useCollectionStore } from '../stores/collectionStore';
const collectionStore = useCollectionStore();
const selectedId = ref(null);
const selectedItem = computed(() => selectedId.value ? collectionStore.getRelicViewModel(selectedId.value) : null);
const currentHint = ref(null);
const answerInputs = reactive({});
const lastResult = reactive({});
const clueExplanations = reactive({});
const unlockedItems = computed(() => {
 return collectionStore.allCollectionItems.filter(i => collectionStore.isRelicUnlocked(i.id));
});
const pendingCount = computed(() => {
 return unlockedItems.value.filter(i => !isResearchDone(i.id)).length;
});
const doneCount = computed(() => {
 return unlockedItems.value.filter(i => isResearchDone(i.id)).length;
});
function isResearchDone(relicId) {
 return collectionStore.isRelicResearched(relicId);
}
function solvedCountFor(relicId) {
 const item = collectionStore.getRelicById(relicId);
 if (!item)
 return 0;
 return item.provenance.clues.filter(c => collectionStore.isClueSolved(relicId, c.id)).length;
}
function getClueProgress(relicId) {
 const item = collectionStore.getRelicById(relicId);
 if (!item || item.provenance.clues.length === 0)
 return 0;
 return Math.round((solvedCountFor(relicId) / item.provenance.clues.length) * 100);
}
function isCurrentClue(idx) {
 if (!selectedItem.value)
 return false;
 const clues = selectedItem.value.provenance.clues;
 for (let i = 0; i < clues.length; i++) {
 if (!collectionStore.isClueSolved(selectedItem.value.id, clues[i].id)) {
 return i === idx;
 }
 }
 return false;
}
function selectItem(item) {
 selectedId.value = item.id;
 currentHint.value = null;
}
function showHint(clue) {
 currentHint.value = currentHint.value === clue.id ? null : clue.id;
}
function submitAnswer(clueId) {
 if (!selectedId.value)
 return;
 const answer = answerInputs[clueId];
 if (!answer?.trim())
 return;
 const result = collectionStore.solveClue(selectedId.value, clueId, answer);
 if (result.success) {
 lastResult[clueId] = { success: true, msg: '考证成功！' + (result.explanation || '') };
 clueExplanations[clueId] = result.explanation;
 answerInputs[clueId] = '';
 if (result.completed) {
 const relic = collectionStore.getRelicById(selectedId.value);
 if (relic) collectionStore.addActivity(`🔍 「${relic.name}」来源考证全部完成！`, 'success');
 }
 }
 else {
 lastResult[clueId] = { success: false, msg: result.reason || '答案不正确...' };
 }
 setTimeout(() => {
 delete lastResult[clueId];
 }, 4000);
}
</script>

<style scoped>
.provenance-research {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pr-header { margin-bottom: 1.5rem; }

.pr-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.pr-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.pr-layout {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  overflow: hidden;
}

.pr-items-list {
  width: 300px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow: hidden;
}

.pr-list-header {
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.pr-list-header h3 {
  margin: 0 0 0.7rem 0;
  font-size: 1rem;
  color: #d4a574;
}

.pr-summary {
  display: flex;
  gap: 0.8rem;
}

.pr-sum-item {
  flex: 1;
  padding: 0.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  text-align: center;
}

.pr-sum-label {
  display: block;
  font-size: 0.7rem;
  color: #7a7a8a;
  margin-bottom: 0.2rem;
}

.pr-sum-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fbbf24;
}

.pr-value-done { color: #86efac; }

.pr-items-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pr-items-scroll::-webkit-scrollbar { width: 5px; }
.pr-items-scroll::-webkit-scrollbar-thumb {
  background: rgba(212,165,116,0.2);
  border-radius: 3px;
}

.pr-item-entry {
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

.pr-item-entry:hover {
  background: rgba(96,165,250,0.06);
  border-color: rgba(96,165,250,0.2);
}

.pr-item-entry.selected {
  background: rgba(96,165,250,0.12);
  border-color: rgba(96,165,250,0.5);
}

.pr-item-entry.done {
  border-left: 4px solid #86efac;
}

.pr-entry-icon {
  font-size: 1.8rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  flex-shrink: 0;
}

.pr-entry-info { flex: 1; min-width: 0; }

.pr-entry-name {
  margin: 0 0 0.4rem 0;
  font-size: 0.88rem;
  color: #e0e0e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pr-entry-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pr-progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.pr-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.pr-item-entry.done .pr-progress-fill {
  background: linear-gradient(90deg, #86efac, #22c55e);
}

.pr-progress-text {
  font-size: 0.7rem;
  color: #7a7a8a;
  min-width: 28px;
  text-align: right;
}

.pr-entry-done {
  color: #86efac;
  font-size: 1.2rem;
}

.pr-list-empty {
  padding: 3rem 1rem;
  text-align: center;
}

.pr-empty-icon {
  font-size: 3rem;
  opacity: 0.3;
  display: block;
  margin-bottom: 1rem;
}

.pr-list-empty p {
  margin: 0.3rem 0;
  color: #6a6a7a;
  font-size: 0.9rem;
}

.pr-empty-sub {
  font-size: 0.8rem !important;
  color: #5a5a6a !important;
}

.pr-research-panel {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  overflow-y: auto;
}

.pr-research-panel::-webkit-scrollbar { width: 8px; }
.pr-research-panel::-webkit-scrollbar-thumb {
  background: rgba(96,165,250,0.2);
  border-radius: 4px;
}

.pr-empty-state {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.pr-empty-state .pr-empty-icon { font-size: 4rem; opacity: 0.3; margin-bottom: 1.5rem; }

.pr-empty-state h3 {
  font-size: 1.2rem;
  color: #8a8a9a;
  margin: 0 0 0.5rem 0;
}

.pr-empty-state p {
  margin: 0;
  font-size: 0.9rem;
  color: #6a6a7a;
}

.pr-selected { padding: 1.5rem; }

.pr-sel-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 1.5rem;
}

.pr-sel-icon-wrap {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  border: 3px solid;
}

.pr-sel-icon { font-size: 2.2rem; }

.pr-sel-title h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #f0e6d8;
}

.pr-sel-rarity {
  padding: 0.2rem 0.7rem;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #1a1520;
  font-weight: 600;
}

.pr-origin-card {
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(134,239,172,0.08), rgba(34,197,94,0.04));
  border: 1px solid rgba(134,239,172,0.3);
  border-radius: 14px;
}

.pr-origin-card h4 {
  margin: 0 0 1rem 0;
  color: #86efac;
  font-size: 1.05rem;
}

.pr-origin-content { display: flex; flex-direction: column; gap: 0.8rem; }

.pr-origin-row {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(134,239,172,0.1);
}

.pr-origin-row:last-child { border-bottom: none; }

.pr-origin-label {
  width: 80px;
  color: #7a9a8a;
  font-size: 0.88rem;
  flex-shrink: 0;
}

.pr-origin-value {
  flex: 1;
  color: #d0e8d8;
  font-size: 0.92rem;
  line-height: 1.6;
}

.pr-clues-section { margin-bottom: 1.5rem; }

.pr-clues-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #d4a574;
  font-weight: 500;
}

.pr-clues-list { display: flex; flex-direction: column; gap: 1rem; }

.pr-clue-card {
  padding: 1.2rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.pr-clue-card.solved {
  background: rgba(134,239,172,0.05);
  border-color: rgba(134,239,172,0.25);
}

.pr-clue-card.current {
  border-color: rgba(96,165,250,0.4);
  box-shadow: 0 0 20px rgba(96,165,250,0.1);
}

.pr-clue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.pr-clue-num {
  font-size: 0.78rem;
  color: #d4a574;
  font-weight: 600;
  letter-spacing: 0.05rem;
}

.pr-clue-status {
  padding: 0.2rem 0.65rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 500;
}

.pr-clue-status.solved {
  background: rgba(134,239,172,0.15);
  color: #86efac;
}

.pr-clue-status.current {
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
}

.pr-clue-status.locked {
  background: rgba(148,163,184,0.12);
  color: #94a3b8;
}

.pr-clue-text {
  font-size: 0.95rem;
  color: #d0d0dc;
  line-height: 1.7;
  padding: 0.8rem 1rem;
  background: rgba(212,165,116,0.06);
  border-left: 3px solid rgba(212,165,116,0.4);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  margin-bottom: 0.8rem;
}

.pr-quote {
  color: #d4a574;
  font-size: 1.1rem;
  margin: 0 0.2rem;
}

.pr-clue-input-wrap { display: flex; flex-direction: column; gap: 0.6rem; }

.pr-clue-hint {
  padding: 0.5rem 0.8rem;
  background: rgba(251,191,36,0.08);
  border: 1px dashed rgba(251,191,36,0.3);
  border-radius: 8px;
  font-size: 0.82rem;
  color: #fcd34d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pr-clue-hint:hover {
  background: rgba(251,191,36,0.14);
}

.pr-input-row { display: flex; gap: 0.6rem; }

.pr-clue-input {
  flex: 1;
  padding: 0.65rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: #e0e0e8;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.pr-clue-input:focus {
  border-color: rgba(96,165,250,0.5);
  box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
}

.pr-clue-input::placeholder { color: #5a5a6a; }

.pr-submit-btn {
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.88rem;
}

.pr-submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(96,165,250,0.35);
}

.pr-submit-btn:disabled {
  background: rgba(255,255,255,0.06);
  color: #5a5a6a;
  cursor: not-allowed;
}

.pr-result-msg {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.pr-result-msg.success {
  background: rgba(134,239,172,0.12);
  color: #86efac;
  border: 1px solid rgba(134,239,172,0.2);
}

.pr-result-msg.error {
  background: rgba(248,113,113,0.12);
  color: #fca5a5;
  border: 1px solid rgba(248,113,113,0.2);
}

.pr-clue-explanation {
  margin-top: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: rgba(96,165,250,0.06);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #a5b4fc;
  line-height: 1.6;
  display: flex;
  gap: 0.5rem;
}

.pr-explain-icon { flex-shrink: 0; }

.pr-tips-card {
  display: flex;
  gap: 1rem;
  padding: 1.1rem;
  background: rgba(251,191,36,0.06);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 12px;
}

.pr-tips-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.pr-tips-content strong {
  display: block;
  color: #fbbf24;
  margin-bottom: 0.4rem;
  font-size: 0.92rem;
}

.pr-tips-content p {
  margin: 0.3rem 0;
  font-size: 0.82rem;
  color: #c0b090;
  line-height: 1.6;
}

.pr-tips-reward { color: #d4a574 !important; }
</style>
