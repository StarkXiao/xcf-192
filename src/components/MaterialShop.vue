<template>
  <div class="material-shop">
    <div class="ms-header">
      <div class="ms-header-left">
        <h2 class="ms-title">
          <span>🛒</span>
          材料商店
        </h2>
        <p class="ms-desc">购买修复和考证所需的专业材料</p>
      </div>
      <div class="ms-coins-display">
        <span class="ms-coins-icon">🪙</span>
        <span class="ms-coins-value">{{ collectionStore.coins }}</span>
        <span class="ms-coins-label">金币</span>
      </div>
    </div>

    <div class="ms-category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="ms-cat-btn"
        :class="{ active: currentCategory === cat.id }"
        @click="currentCategory = cat.id"
      >
        <span class="ms-cat-icon">{{ cat.icon }}</span>
        <span class="ms-cat-label">{{ cat.label }}</span>
      </button>
    </div>

    <div class="ms-owned-section">
      <h3 class="ms-section-title">
        <span>📦</span>
        我的材料
        <span class="ms-owned-count">拥有 {{ ownedMaterials.length }} 种</span>
      </h3>
      <div class="ms-owned-grid" v-if="ownedMaterials.length > 0">
        <div v-for="mat in ownedMaterials" :key="mat.id" class="ms-owned-card">
          <span class="ms-owned-icon">{{ mat.icon }}</span>
          <div class="ms-owned-info">
            <span class="ms-owned-name">{{ mat.name }}</span>
            <span class="ms-owned-count-badge">x{{ mat.count }}</span>
          </div>
        </div>
      </div>
      <div v-else class="ms-owned-empty">
        还没有材料，快去购买吧～
      </div>
    </div>

    <div class="ms-shop-section">
      <h3 class="ms-section-title">
        <span>🏪</span>
        商品列表
        <span class="ms-shop-count">{{ filteredMaterials.length }} 件商品</span>
      </h3>

      <div class="ms-materials-grid">
        <div 
          v-for="mat in filteredMaterials" 
          :key="mat.id"
          class="ms-material-card"
          :class="{ canAfford: collectionStore.canAffordMaterial(mat.id) }"
        >
          <div class="ms-mat-icon-wrap">
            <span class="ms-mat-icon">{{ mat.icon }}</span>
          </div>
          <div class="ms-mat-info">
            <h4 class="ms-mat-name">{{ mat.name }}</h4>
            <div class="ms-mat-owned">
              <span>已拥有</span>
              <span class="ms-mat-owned-count">{{ collectionStore.getMaterialCount(mat.id) }}</span>
            </div>
          </div>
          <div class="ms-mat-price">
            <div class="ms-price-row">
              <span class="ms-price-icon">🪙</span>
              <span class="ms-price-value">{{ mat.price }}</span>
            </div>
          </div>
          <div class="ms-mat-actions">
            <div class="ms-buy-count">
              <button 
                class="ms-count-btn minus"
                :disabled="buyCounts[mat.id] <= 1"
                @click="changeCount(mat.id, -1)"
              >
                −
              </button>
              <span class="ms-count-value">{{ buyCounts[mat.id] || 1 }}</span>
              <button 
                class="ms-count-btn plus"
                @click="changeCount(mat.id, 1)"
              >
                +
              </button>
            </div>
            <button 
              class="ms-buy-btn"
              :disabled="!canBuy(mat.id, buyCounts[mat.id] || 1)"
              @click="buyMaterial(mat.id, buyCounts[mat.id] || 1)"
            >
              购买
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lastBuyResult" class="ms-toast" :class="lastBuyResult.success ? 'success' : 'error'">
      {{ lastBuyResult.msg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useCollectionStore } from '../stores/collectionStore'
import { MATERIAL_SHOP } from '../data/collectionData'

const collectionStore = useCollectionStore()
const currentCategory = ref('all')
const buyCounts = reactive({})
const lastBuyResult = ref(null)

const categories = [
  { id: 'all', icon: '📋', label: '全部' },
  { id: 'paper', icon: '📄', label: '纸张类' },
  { id: 'liquid', icon: '💧', label: '液体类' },
  { id: 'tool', icon: '🔧', label: '工具类' },
  { id: 'sewing', icon: '🧵', label: '缝纫类' },
  { id: 'metal', icon: '⚙️', label: '金属类' },
  { id: 'special', icon: '✨', label: '特殊材料' }
]

const filteredMaterials = computed(() => {
  if (currentCategory.value === 'all') return MATERIAL_SHOP
  return MATERIAL_SHOP.filter(m => m.category === currentCategory.value)
})

const ownedMaterials = computed(() => {
  const result = []
  for (const mat of MATERIAL_SHOP) {
    const count = collectionStore.getMaterialCount(mat.id)
    if (count > 0) {
      result.push({ ...mat, count })
    }
  }
  return result.sort((a, b) => b.count - a.count)
})

function changeCount(matId, delta) {
  const current = buyCounts[matId] || 1
  const next = Math.max(1, current + delta)
  buyCounts[matId] = next
}

function canBuy(matId, count) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  if (!mat) return false
  return collectionStore.coins >= mat.price * count
}

function buyMaterial(matId, count) {
  const mat = MATERIAL_SHOP.find(m => m.id === matId)
  if (!mat) return
  
  for (let i = 0; i < count; i++) {
    const result = collectionStore.buyMaterial(matId, 1)
    if (!result.success) {
      showToast(result.reason || '购买失败', false)
      return
    }
  }
  showToast(`成功购买 ${mat.icon} ${mat.name} x${count}！`, true)
  buyCounts[matId] = 1
}

function showToast(msg, success) {
  lastBuyResult.value = { msg, success }
  setTimeout(() => {
    lastBuyResult.value = null
  }, 2500)
}
</script>

<style scoped>
.material-shop {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.material-shop::-webkit-scrollbar { width: 8px; }
.material-shop::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.material-shop::-webkit-scrollbar-thumb {
  background: rgba(212,165,116,0.25);
  border-radius: 4px;
}

.ms-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.ms-header-left { flex: 1; }

.ms-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.ms-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.ms-coins-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.3rem;
  background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1));
  border: 1px solid rgba(255,215,0,0.35);
  border-radius: 16px;
}

.ms-coins-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 6px rgba(255,215,0,0.5));
}

.ms-coins-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffd700;
}

.ms-coins-label {
  font-size: 0.8rem;
  color: #d4a574;
}

.ms-category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ms-cat-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #8a8a9a;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 0.85rem;
}

.ms-cat-btn:hover {
  background: rgba(212,165,116,0.1);
  color: #d4a574;
  border-color: rgba(212,165,116,0.25);
}

.ms-cat-btn.active {
  background: rgba(212,165,116,0.18);
  color: #d4a574;
  border-color: rgba(212,165,116,0.45);
}

.ms-cat-icon { font-size: 1rem; }

.ms-owned-section,
.ms-shop-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 1.2rem;
}

.ms-section-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #d4a574;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ms-owned-count,
.ms-shop-count {
  margin-left: auto;
  font-size: 0.78rem;
  color: #7a7a8a;
  font-weight: 400;
}

.ms-owned-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.6rem;
}

.ms-owned-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.ms-owned-card:hover {
  background: rgba(212,165,116,0.08);
  border-color: rgba(212,165,116,0.2);
}

.ms-owned-icon { font-size: 1.4rem; }

.ms-owned-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.ms-owned-name {
  font-size: 0.82rem;
  color: #c0c0d0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ms-owned-count-badge {
  padding: 0.1rem 0.5rem;
  background: rgba(212,165,116,0.15);
  color: #d4a574;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.ms-owned-empty {
  padding: 1.5rem;
  text-align: center;
  color: #6a6a7a;
  font-size: 0.88rem;
  font-style: italic;
}

.ms-materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.9rem;
}

.ms-material-card {
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.ms-material-card:hover {
  border-color: rgba(212,165,116,0.3);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.ms-material-card.canAfford {
  border-color: rgba(134,239,172,0.25);
}

.ms-mat-icon-wrap {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  margin: 0 auto;
}

.ms-mat-icon { font-size: 2rem; }

.ms-mat-info {
  text-align: center;
}

.ms-mat-name {
  margin: 0 0 0.4rem 0;
  font-size: 0.95rem;
  color: #e0e0e8;
}

.ms-mat-owned {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #7a7a8a;
}

.ms-mat-owned-count {
  color: #d4a574;
  font-weight: 600;
}

.ms-mat-price {
  display: flex;
  justify-content: center;
}

.ms-price-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  background: rgba(255,215,0,0.08);
  border-radius: 20px;
}

.ms-price-icon { font-size: 1.1rem; }

.ms-price-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffd700;
}

.ms-mat-actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ms-buy-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.ms-count-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #a0a0b0;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ms-count-btn:hover:not(:disabled) {
  background: rgba(212,165,116,0.15);
  border-color: rgba(212,165,116,0.3);
  color: #d4a574;
}

.ms-count-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ms-count-value {
  min-width: 30px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e8;
}

.ms-buy-btn {
  width: 100%;
  padding: 0.6rem;
  background: linear-gradient(135deg, #d4a574, #c49664);
  border: none;
  border-radius: 10px;
  color: #1a1520;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.ms-buy-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 18px rgba(212,165,116,0.35);
}

.ms-buy-btn:disabled {
  background: rgba(255,255,255,0.06);
  color: #5a5a6a;
  cursor: not-allowed;
}

.ms-material-card.canAfford .ms-buy-btn:not(:disabled) {
  background: linear-gradient(135deg, #86efac, #22c55e);
}

.ms-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 4000;
  animation: toastIn 0.3s ease;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

.ms-toast.success {
  background: rgba(34, 197, 94, 0.95);
  color: white;
}

.ms-toast.error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
