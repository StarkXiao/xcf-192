<template>
  <Transition name="fade">
    <div v-if="showModal" class="crafting-overlay" @click.self="handleClose">
      <div class="crafting-panel">
        <div class="crafting-header">
          <h2 class="crafting-title">
            <span class="title-icon">✨</span>
            旧物合成工坊
          </h2>
          <div class="header-actions">
            <span class="craft-progress">
              合成进度：{{ craftedCount }}/{{ totalCraftable }}
            </span>
            <button class="close-icon-btn" @click="handleClose">
              ✕
            </button>
          </div>
        </div>

        <div class="crafting-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'recipes' }"
            @click="activeTab = 'recipes'"
          >
            📋 合成配方
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'crafted' }"
            @click="activeTab = 'crafted'"
          >
            💎 已合成 ({{ craftedCount }})
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'inventory' }"
            @click="activeTab = 'inventory'"
          >
            🎒 物品栏 ({{ foundCount }}/{{ totalItems }})
          </button>
        </div>

        <div class="crafting-body">
          <div v-if="activeTab === 'recipes'" class="recipes-list">
            <div
              v-for="recipe in allRecipes"
              :key="recipe.id"
              class="recipe-card"
              :class="{
                available: canCraft(recipe.id),
                crafted: isRecipeCrafted(recipe.resultId),
                locked: !canCraft(recipe.id) && !isRecipeCrafted(recipe.resultId)
              }"
            >
              <div class="recipe-result">
                <span class="result-icon" :class="getRarityClass(recipe.resultId)">
                  {{ getCraftedIcon(recipe.resultId) }}
                </span>
                <div class="result-info">
                  <h4 class="result-name" :class="getRarityClass(recipe.resultId)">
                    {{ getCraftedName(recipe.resultId) }}
                  </h4>
                  <span class="rarity-tag" :class="getRarityClass(recipe.resultId)">
                    {{ getRarityText(recipe.resultId) }}
                  </span>
                </div>
              </div>

              <div class="recipe-hint" v-if="!isRecipeCrafted(recipe.resultId)">
                💡 {{ recipe.hint }}
              </div>

              <div class="recipe-ingredients">
                <div class="ingredients-label">所需材料：</div>
                <div class="ingredients-list">
                  <div
                    v-for="ingredientId in recipe.ingredients"
                    :key="ingredientId"
                    class="ingredient-item"
                    :class="{ found: isItemFound(ingredientId) }"
                  >
                    <span class="ingredient-icon">
                      {{ getItemIcon(ingredientId) }}
                    </span>
                    <span class="ingredient-name">
                      {{ getItemName(ingredientId) }}
                    </span>
                    <span class="ingredient-status">
                      {{ isItemFound(ingredientId) ? '✓' : '✗' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="recipe-action">
                <button
                  v-if="isRecipeCrafted(recipe.resultId)"
                  class="craft-btn crafted-btn"
                  disabled
                >
                  ✅ 已合成
                </button>
                <button
                  v-else-if="canCraft(recipe.id)"
                  class="craft-btn available-btn"
                  @click="handleCraft(recipe.id)"
                >
                  🔨 开始合成
                </button>
                <button
                  v-else
                  class="craft-btn locked-btn"
                  disabled
                >
                  🔒 材料不足
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'crafted'" class="crafted-list">
            <div v-if="craftedCount === 0" class="empty-state">
              <span class="empty-icon">🔮</span>
              <p class="empty-text">还没有合成任何道具</p>
              <p class="empty-hint">跨场景收集线索，尝试组合不同的旧物吧</p>
            </div>
            <div
              v-for="craftedId in craftedItems"
              :key="craftedId"
              class="crafted-card"
              :class="getRarityClass(craftedId)"
            >
              <div class="crafted-icon-wrapper">
                <span class="crafted-icon">
                  {{ getCraftedIcon(craftedId) }}
                </span>
                <span class="crafted-glow"></span>
              </div>
              <div class="crafted-details">
                <h4 class="crafted-name">{{ getCraftedName(craftedId) }}</h4>
                <span class="crafted-rarity" :class="getRarityClass(craftedId)">
                  {{ getRarityText(craftedId) }}
                </span>
                <p class="crafted-desc">{{ getCraftedDesc(craftedId) }}</p>
                <div v-if="hasHiddenMemory(craftedId)" class="hm-badge">
                  <span v-if="isHMUnlocked(craftedId)" class="hm-unlocked">
                    🌟 已解锁隐藏回忆
                  </span>
                  <span v-else class="hm-locked">
                    🔒 合成后解锁隐藏回忆
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'inventory'" class="inventory-list">
            <div class="inventory-scenes">
              <div
                v-for="scene in allScenes"
                :key="scene.id"
                class="inventory-scene"
              >
                <h4 class="scene-name">📍 {{ scene.name }}</h4>
                <div class="scene-items-grid">
                  <div
                    v-for="item in scene.items"
                    :key="item.id"
                    class="inventory-item"
                    :class="{ found: isItemFound(item.id) }"
                  >
                    <span class="inv-icon">{{ item.icon }}</span>
                    <span class="inv-name">
                      {{ isItemFound(item.id) ? item.name : '???' }}
                    </span>
                    <span v-if="isItemFound(item.id)" class="inv-check">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="crafting-footer">
          <p class="footer-tip">
            💫 提示：不同场景的旧物之间可能存在神秘联系，仔细阅读线索，探索所有可能性！
          </p>
        </div>
      </div>

      <Transition name="craft-pop">
        <div v-if="craftResult" class="craft-result-popup" :class="getRarityClass(craftResult.id)">
          <div class="result-shine"></div>
          <div class="result-content">
            <div class="result-badge">🎉 合成成功</div>
            <span class="result-big-icon">{{ craftResult.icon }}</span>
            <h3 class="result-title" :class="getRarityClass(craftResult.id)">
              {{ craftResult.name }}
            </h3>
            <p class="result-rarity" :class="getRarityClass(craftResult.id)">
              {{ getRarityText(craftResult.id) }}
            </p>
            <p class="result-desc">{{ craftResult.description }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()

const activeTab = ref('recipes')

const showModal = computed(() => gameStore.showCraftingModal)
const craftResult = computed(() => gameStore.craftResultMessage)
const foundCount = computed(() => gameStore.foundCount)
const totalItems = computed(() => gameStore.totalItems)
const craftedCount = computed(() => gameStore.craftedCount)
const totalCraftable = computed(() => gameStore.totalCraftable)
const craftedItems = computed(() => gameStore.craftedItems)

const allRecipes = computed(() => storyStore.getAllRecipes())
const allScenes = computed(() => storyStore.getAllScenes())

watch(showModal, (val) => {
  if (val) {
    activeTab.value = 'recipes'
  }
})

function handleClose() {
  gameStore.closeCrafting()
}

function isItemFound(itemId) {
  return gameStore.isItemFound(itemId)
}

function canCraft(recipeId) {
  return gameStore.canCraftItem(recipeId)
}

function isRecipeCrafted(resultId) {
  return gameStore.isCrafted(resultId)
}

function handleCraft(recipeId) {
  gameStore.craftItem(recipeId)
}

function getItemIcon(itemId) {
  const item = storyStore.getItemById(itemId)
  return item ? item.icon : '❓'
}

function getItemName(itemId) {
  const item = storyStore.getItemById(itemId)
  return item ? item.name : '未发现'
}

function getCraftedIcon(craftedId) {
  const item = storyStore.getCraftedItemById(craftedId)
  return item ? item.icon : '❓'
}

function getCraftedName(craftedId) {
  const item = storyStore.getCraftedItemById(craftedId)
  return item ? item.name : '未知'
}

function getCraftedDesc(craftedId) {
  const item = storyStore.getCraftedItemById(craftedId)
  return item ? item.description : ''
}

function getRarityClass(craftedId) {
  const item = storyStore.getCraftedItemById(craftedId)
  return item ? `rarity-${item.rarity}` : ''
}

function getRarityText(craftedId) {
  const item = storyStore.getCraftedItemById(craftedId)
  if (!item) return ''
  const map = {
    legendary: '传说',
    epic: '史诗',
    rare: '稀有'
  }
  return map[item.rarity] || item.rarity
}

function hasHiddenMemory(craftedId) {
  return !!storyStore.getHiddenMemoryByCraftId(craftedId)
}

function isHMUnlocked(craftedId) {
  const hm = storyStore.getHiddenMemoryByCraftId(craftedId)
  return hm ? gameStore.isHiddenMemoryUnlocked(hm.id) : false
}
</script>

<style scoped>
.crafting-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 15px;
}

.crafting-panel {
  background: linear-gradient(145deg, rgba(25, 25, 45, 0.98), rgba(15, 15, 35, 0.99));
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 165, 116, 0.1);
  overflow: hidden;
}

.crafting-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(212, 165, 116, 0.1), transparent);
}

.crafting-title {
  margin: 0;
  color: #d4a574;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 500;
  letter-spacing: 0.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(15deg); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.craft-progress {
  color: #a0a0b0;
  font-size: 0.85rem;
}

.close-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #c0c0d0;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.close-icon-btn:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff8888;
}

.crafting-tabs {
  display: flex;
  padding: 0.8rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.tab-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  color: #808090;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #c0c0d0;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.4);
}

.crafting-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
}

.recipes-list,
.crafted-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recipe-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.2rem;
  transition: all 0.3s ease;
}

.recipe-card.available {
  border-color: rgba(100, 200, 150, 0.4);
  background: rgba(100, 200, 150, 0.05);
  animation: pulse-green 2s ease-in-out infinite;
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 rgba(100, 200, 150, 0); }
  50% { box-shadow: 0 0 20px rgba(100, 200, 150, 0.2); }
}

.recipe-card.crafted {
  opacity: 0.6;
  border-color: rgba(100, 150, 100, 0.3);
}

.recipe-card.locked {
  opacity: 0.75;
}

.recipe-result {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.result-icon {
  font-size: 2.2rem;
  filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.4));
}

.result-icon.rarity-legendary {
  animation: legendary-glow 2s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%, 100% { filter: drop-shadow(2px 2px 6px rgba(255, 215, 0, 0.4)); }
  50% { filter: drop-shadow(2px 2px 15px rgba(255, 215, 0, 0.8)); }
}

.result-icon.rarity-epic {
  animation: epic-glow 2s ease-in-out infinite;
}

@keyframes epic-glow {
  0%, 100% { filter: drop-shadow(2px 2px 6px rgba(180, 100, 255, 0.4)); }
  50% { filter: drop-shadow(2px 2px 15px rgba(180, 100, 255, 0.7)); }
}

.result-info {
  flex: 1;
}

.result-name {
  margin: 0 0 0.2rem 0;
  font-size: 1.1rem;
  color: #e8e8f0;
  font-weight: 500;
}

.result-name.rarity-legendary {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-name.rarity-epic {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-name.rarity-rare {
  color: #60a5fa;
}

.rarity-tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
}

.rarity-tag.rarity-legendary {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.rarity-tag.rarity-epic {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.2), rgba(167, 139, 250, 0.1));
  color: #c084fc;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.rarity-tag.rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.recipe-hint {
  background: rgba(212, 165, 116, 0.08);
  border-left: 3px solid rgba(212, 165, 116, 0.5);
  padding: 0.6rem 0.8rem;
  border-radius: 0 8px 8px 0;
  color: #c4a882;
  font-size: 0.88rem;
  font-style: italic;
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.recipe-ingredients {
  margin-bottom: 1rem;
}

.ingredients-label {
  color: #808090;
  font-size: 0.82rem;
  margin-bottom: 0.5rem;
}

.ingredients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  background: rgba(255, 100, 100, 0.08);
  border: 1px solid rgba(255, 100, 100, 0.2);
  font-size: 0.82rem;
  transition: all 0.3s ease;
}

.ingredient-item.found {
  background: rgba(100, 200, 150, 0.1);
  border-color: rgba(100, 200, 150, 0.3);
}

.ingredient-icon {
  font-size: 1rem;
}

.ingredient-name {
  color: #c0c0d0;
}

.ingredient-item.found .ingredient-name {
  color: #86efac;
}

.ingredient-status {
  font-weight: bold;
  font-size: 0.8rem;
}

.ingredient-item:not(.found) .ingredient-status {
  color: #fca5a5;
}

.ingredient-item.found .ingredient-status {
  color: #86efac;
}

.recipe-action {
  display: flex;
  justify-content: flex-end;
}

.craft-btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.craft-btn.available-btn {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.4);
}

.craft-btn.available-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 211, 153, 0.5);
}

.craft-btn.crafted-btn {
  background: rgba(100, 150, 100, 0.15);
  color: #86efac;
  cursor: default;
}

.craft-btn.locked-btn {
  background: rgba(255, 255, 255, 0.03);
  color: #707080;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-text {
  color: #a0a0b0;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  color: #707080;
  font-size: 0.88rem;
  margin: 0;
}

.crafted-card {
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}

.crafted-card.rarity-legendary {
  border-color: rgba(255, 215, 0, 0.3);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.02));
}

.crafted-card.rarity-epic {
  border-color: rgba(192, 132, 252, 0.3);
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.05), rgba(167, 139, 250, 0.02));
}

.crafted-card.rarity-rare {
  border-color: rgba(96, 165, 250, 0.3);
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(96, 165, 250, 0.02));
}

.crafted-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.crafted-icon {
  font-size: 3rem;
  display: block;
  position: relative;
  z-index: 1;
}

.crafted-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 165, 116, 0.3), transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

.rarity-legendary .crafted-glow {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4), transparent 70%);
}

.rarity-epic .crafted-glow {
  background: radial-gradient(circle, rgba(192, 132, 252, 0.4), transparent 70%);
}

.rarity-rare .crafted-glow {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.4), transparent 70%);
}

@keyframes glow-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}

.crafted-details {
  flex: 1;
  min-width: 0;
}

.crafted-name {
  margin: 0 0 0.3rem 0;
  font-size: 1.15rem;
  color: #e8e8f0;
  font-weight: 500;
}

.rarity-legendary .crafted-name {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rarity-epic .crafted-name {
  background: linear-gradient(135deg, #c084fc, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rarity-rare .crafted-name {
  color: #60a5fa;
}

.crafted-rarity {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 10px;
  margin-bottom: 0.6rem;
}

.crafted-rarity.rarity-legendary {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
  color: #ffd700;
}

.crafted-rarity.rarity-epic {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.2), rgba(167, 139, 250, 0.1));
  color: #c084fc;
}

.crafted-rarity.rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.crafted-desc {
  margin: 0;
  color: #a0a0b0;
  font-size: 0.88rem;
  line-height: 1.6;
}

.hm-badge {
  margin-top: 0.6rem;
}

.hm-unlocked {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1));
  color: #fbbf24;
  font-size: 0.82rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.hm-locked {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.05);
  color: #707080;
  font-size: 0.82rem;
}

.inventory-scenes {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.scene-name {
  margin: 0 0 0.6rem 0;
  color: #a0a0b0;
  font-size: 0.95rem;
  font-weight: 500;
}

.scene-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.inventory-item.found {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.inv-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.inv-name {
  flex: 1;
  font-size: 0.82rem;
  color: #707080;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inventory-item.found .inv-name {
  color: #c0c0d0;
}

.inv-check {
  color: #86efac;
  font-size: 0.85rem;
  font-weight: bold;
}

.crafting-footer {
  padding: 0.8rem 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.footer-tip {
  margin: 0;
  color: #707080;
  font-size: 0.82rem;
  text-align: center;
}

.craft-result-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(145deg, rgba(30, 30, 55, 0.99), rgba(20, 20, 45, 0.99));
  border-radius: 20px;
  padding: 2rem;
  min-width: 300px;
  max-width: 90%;
  text-align: center;
  border: 2px solid;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  z-index: 2;
  overflow: hidden;
}

.craft-result-popup.rarity-legendary {
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 215, 0, 0.3);
}

.craft-result-popup.rarity-epic {
  border-color: rgba(192, 132, 252, 0.6);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(192, 132, 252, 0.3);
}

.craft-result-popup.rarity-rare {
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(96, 165, 250, 0.3);
}

.result-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shine 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.result-content {
  position: relative;
  z-index: 1;
}

.result-badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.05rem;
}

.result-big-icon {
  font-size: 4.5rem;
  display: block;
  margin-bottom: 0.8rem;
  animation: icon-pop 0.6s ease;
}

@keyframes icon-pop {
  0% { transform: scale(0) rotate(-20deg); }
  50% { transform: scale(1.3) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.result-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #e8e8f0;
}

.result-title.rarity-legendary {
  background: linear-gradient(135deg, #ffd700, #ffec8b, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-title.rarity-epic {
  background: linear-gradient(135deg, #c084fc, #a78bfa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-title.rarity-rare {
  color: #60a5fa;
}

.result-rarity {
  display: inline-block;
  font-size: 0.85rem;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.result-rarity.rarity-legendary {
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
}

.result-rarity.rarity-epic {
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
}

.result-rarity.rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.result-desc {
  margin: 0;
  color: #a0a0b0;
  font-size: 0.92rem;
  line-height: 1.7;
}
</style>
