<template>
  <Transition name="fade">
    <div v-if="showModal" class="journal-overlay" @click.self="handleClose">
      <div class="journal-container">
        <div class="journal-book" :style="{ '--page-count': totalPages }">
          <div class="book-spine"></div>
          
          <div class="book-cover book-cover-left">
            <div class="cover-decoration">
              <span class="cover-emblem">📖</span>
            </div>
            <h2 class="cover-title">雾城手账</h2>
            <p class="cover-subtitle">回忆图鉴</p>
            <div class="cover-divider"></div>
            <p class="cover-year">{{ currentYear }}</p>
          </div>

          <div 
            class="page" 
            v-for="(page, pageIndex) in displayedPages" 
            :key="pageIndex"
            :class="{ 'page-active': currentPageIndex === pageIndex }"
            :style="{ transform: `rotateY(${(pageIndex - currentPageIndex) * 180}deg)`, zIndex: pageIndex <= currentPageIndex ? totalPages - pageIndex : pageIndex }"
          >
            <div class="page-content">
              <div class="page-header">
                <span class="page-number">第 {{ pageIndex + 1 }} 页</span>
                <span class="page-date">{{ getPageDate(page) }}</span>
              </div>
              
              <div v-if="page.type === 'items'" class="journal-section items-section">
                <h3 class="section-title">
                  <span class="section-icon">🎁</span>
                  旧物收集
                </h3>
                <div v-if="page.items.length === 0" class="empty-page">
                  <span class="empty-icon">📦</span>
                  <p class="empty-text">此处留白...</p>
                  <p class="empty-hint">探索更多地点寻找旧物</p>
                </div>
                <div v-else class="items-grid">
                  <div 
                    v-for="item in page.items" 
                    :key="item.id"
                    class="journal-item-card"
                    :class="{ unlocked: item.unlocked }"
                    @click="item.unlocked && showItemDetail(item)"
                  >
                    <div class="item-sticker">
                      <span class="item-icon">{{ item.unlocked ? item.icon : '❓' }}</span>
                    </div>
                    <div class="item-info">
                      <h4 class="item-name">{{ item.unlocked ? item.name : '???' }}</h4>
                      <p v-if="item.unlocked" class="item-location">📍 {{ item.sceneName }}</p>
                      <p v-else class="item-locked">未发现</p>
                    </div>
                    <span v-if="item.unlocked" class="item-detail-hint">查看详情 →</span>
                  </div>
                </div>
              </div>

              <div v-else-if="page.type === 'memories'" class="journal-section memories-section">
                <h3 class="section-title">
                  <span class="section-icon">💭</span>
                  回忆片段
                </h3>
                <div v-if="page.memories.length === 0" class="empty-page">
                  <span class="empty-icon">💭</span>
                  <p class="empty-text">此处留白...</p>
                  <p class="empty-hint">找到旧物后会触发回忆</p>
                </div>
                <div v-else class="memories-list">
                  <div 
                    v-for="memory in page.memories" 
                    :key="memory.id"
                    class="journal-memory-card"
                    :class="{ unlocked: memory.unlocked, 'hidden-memory': memory.isHidden }"
                    @click="memory.unlocked && showMemoryDetail(memory)"
                  >
                    <div class="memory-header">
                      <span class="memory-emoji">{{ memory.unlocked ? getEmojiForEmotion(memory.emotion) : '🔒' }}</span>
                      <div class="memory-title-area">
                        <h4 class="memory-title">{{ memory.unlocked ? memory.title : '???' }}</h4>
                        <span v-if="memory.unlocked && memory.isHidden" class="hidden-badge">✦ 隐藏回忆</span>
                      </div>
                    </div>
                    <p v-if="memory.unlocked" class="memory-excerpt">"{{ memory.excerpt }}"</p>
                    <p v-else class="memory-locked">回忆尚未唤醒</p>
                    <div v-if="memory.unlocked" class="memory-footer">
                      <span class="memory-year">📅 {{ memory.year }}</span>
                      <span class="memory-read-hint">阅读全文 →</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="page.type === 'relationships'" class="journal-section relationships-section">
                <h3 class="section-title">
                  <span class="section-icon">💕</span>
                  人物关系
                </h3>
                <div class="relationship-map">
                  <div class="relationship-center">
                    <div class="center-avatar">👤</div>
                    <p class="center-name">你</p>
                  </div>
                  <div class="relationship-connections">
                    <div 
                      v-for="rel in page.relationships" 
                      :key="rel.id"
                      class="connection-card"
                      :class="{ active: rel.unlocked }"
                      :style="{ '--rel-angle': rel.angle + 'deg' }"
                    >
                      <div class="connection-line" :style="{ background: rel.color }"></div>
                      <div class="connection-node" :style="{ borderColor: rel.color }">
                        <span class="node-icon">{{ rel.icon }}</span>
                      </div>
                      <div class="connection-info">
                        <h4 class="connection-name">{{ rel.name }}</h4>
                        <p v-if="rel.unlocked" class="connection-relation">{{ rel.relation }}</p>
                        <p v-else class="connection-locked">关系未知</p>
                        <p v-if="rel.unlocked" class="connection-memory">"{{ rel.memory }}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="page-footer">
                <span class="footer-sticker">🍂</span>
                <span class="footer-decor">~ ~ ~ ~ ~ ~ ~ ~</span>
                <span class="footer-sticker">🍂</span>
              </div>
            </div>
          </div>

          <div class="book-cover book-cover-right">
            <div class="back-cover-pattern">
              <div class="pattern-line" v-for="i in 12" :key="i"></div>
            </div>
          </div>
        </div>

        <div class="journal-controls">
          <button class="nav-btn prev-btn" @click="prevPage" :disabled="currentPageIndex === 0">
            ← 上一页
          </button>
          <div class="page-indicator">
            <span class="current-page">{{ currentPageIndex + 1 }}</span>
            <span class="page-separator">/</span>
            <span class="total-pages">{{ totalPages }}</span>
          </div>
          <button class="nav-btn next-btn" @click="nextPage" :disabled="currentPageIndex === totalPages - 1">
            下一页 →
          </button>
        </div>

        <div class="journal-filters">
          <div class="filter-group">
            <span class="filter-label">📚 章节：</span>
            <button 
              v-for="ch in chapterFilters" 
              :key="ch.id"
              class="filter-btn"
              :class="{ active: selectedChapter === ch.id }"
              @click="selectedChapter = ch.id"
            >
              {{ ch.name }}
            </button>
          </div>
          <div class="filter-group">
            <span class="filter-label">📍 地点：</span>
            <button 
              v-for="sc in sceneFilters" 
              :key="sc.id"
              class="filter-btn"
              :class="{ active: selectedScene === sc.id }"
              @click="selectedScene = sc.id"
            >
              {{ sc.icon }} {{ sc.name }}
            </button>
          </div>
          <button class="reset-filter-btn" @click="resetFilters">
            🔄 重置筛选
          </button>
        </div>

        <button class="journal-close-btn" @click="handleClose">✕</button>
      </div>

      <Transition name="fade">
        <div v-if="detailItem" class="detail-overlay" @click.self="detailItem = null">
          <div class="detail-card" :class="detailType">
            <div v-if="detailType === 'item'" class="item-detail">
              <div class="detail-icon-large">{{ detailItem.icon }}</div>
              <h3 class="detail-title">{{ detailItem.name }}</h3>
              <div class="detail-meta">
                <span class="meta-tag">📍 {{ detailItem.sceneName }}</span>
                <span class="meta-tag">📖 {{ detailItem.chapterName }}</span>
              </div>
              <p class="detail-description">{{ detailItem.description }}</p>
              <div v-if="detailItem.memory" class="linked-memory">
                <h4 class="linked-title">💭 关联回忆</h4>
                <p class="linked-content">"{{ detailItem.memory.title }}"</p>
              </div>
            </div>
            <div v-else class="memory-detail">
              <div class="memory-detail-header">
                <span class="memory-detail-emoji">{{ getEmojiForEmotion(detailItem.emotion) }}</span>
                <div>
                  <h3 class="detail-title">{{ detailItem.title }}</h3>
                  <span v-if="detailItem.isHidden" class="hidden-badge large">✦ 隐藏回忆</span>
                </div>
              </div>
              <div class="detail-meta">
                <span class="meta-tag">📅 {{ detailItem.year }}</span>
                <span class="meta-tag" :style="{ color: getEmotionColor(detailItem.emotion) }">{{ getEmotionName(detailItem.emotion) }}</span>
              </div>
              <div class="detail-divider"></div>
              <p class="detail-content">{{ detailItem.content }}</p>
            </div>
            <button class="detail-close-btn" @click="detailItem = null">关闭</button>
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
import { useArchiveStore } from '../stores/archiveStore'

const gameStore = useGameStore()
const storyStore = useStoryStore()
const archiveStore = useArchiveStore()

const currentPageIndex = ref(0)
const selectedChapter = ref('all')
const selectedScene = ref('all')
const detailItem = ref(null)
const detailType = ref('item')

const showModal = computed(() => gameStore.showJournalModal)

const currentYear = new Date().getFullYear()

const chapterFilters = computed(() => {
  const chapters = storyStore.getAllChapters()
  return [{ id: 'all', name: '全部' }, ...chapters.map(c => ({ id: c.id, name: c.name }))]
})

const sceneFilters = computed(() => {
  const scenes = storyStore.getAllScenes()
  const icons = { station: '🚂', street: '🏘️', cafe: '☕', park: '🌳', bookstore: '📚', lake: '🌊' }
  return [{ id: 'all', name: '全部', icon: '🌍' }, ...scenes.map(s => ({ id: s.id, name: s.name, icon: icons[s.id] || '📍' }))]
})

const allItems = computed(() => {
  const scenes = storyStore.getAllScenes()
  const items = []
  for (const scene of scenes) {
    if (selectedScene.value !== 'all' && scene.id !== selectedScene.value) continue
    for (const item of scene.items) {
      const unlocked = gameStore.isItemFound(item.id) || archiveStore.isMemoryEverTriggered(storyStore.getMemoryByItemId(item.id)?.id)
      const memory = storyStore.getMemoryByItemId(item.id)
      const chapter = getItemChapter(item.id)
      if (selectedChapter.value !== 'all' && chapter?.id !== selectedChapter.value) continue
      items.push({
        ...item,
        sceneId: scene.id,
        sceneName: scene.name,
        chapterId: chapter?.id,
        chapterName: chapter?.name,
        unlocked,
        memory: unlocked ? memory : null
      })
    }
  }
  return items
})

const allMemories = computed(() => {
  const normalMemories = storyStore.getAllMemories().map(m => ({
    ...m,
    isHidden: false,
    excerpt: m.content.substring(0, 50) + '...',
    unlocked: gameStore.triggeredMemories.includes(m.id) || archiveStore.isMemoryEverTriggered(m.id)
  }))
  const hiddenMemories = storyStore.getAllHiddenMemories().map(hm => ({
    ...hm,
    excerpt: hm.content.substring(0, 50) + '...',
    unlocked: gameStore.isHiddenMemoryUnlocked(hm.id) || archiveStore.isHiddenMemoryEverUnlocked(hm.id)
  }))
  return [...normalMemories, ...hiddenMemories].filter(m => {
    if (selectedScene.value !== 'all') {
      if (m.isHidden) return false
      const item = storyStore.getItemById(m.triggerItemId)
      if (!item) return false
      const itemScene = findSceneForItem(item.id)
      return itemScene?.id === selectedScene.value
    }
    if (selectedChapter.value !== 'all') {
      if (m.isHidden) return true
      const chapter = getItemChapter(m.triggerItemId)
      return chapter?.id === selectedChapter.value
    }
    return true
  })
})

const relationships = computed(() => {
  const rels = [
    {
      id: 'her',
      name: '她',
      icon: '👩',
      relation: '恋人',
      color: '#ff6b9d',
      angle: 0,
      memory: '「如果你开口挽留，我会留下来。」',
      unlocked: gameStore.triggeredMemories.length > 0 || archiveStore.everTriggeredMemories.length > 0
    },
    {
      id: 'best_friend',
      name: '旧时好友',
      icon: '👨‍🦱',
      relation: '挚友',
      color: '#667eea',
      angle: 72,
      memory: '「你们是天造地设的一对。」',
      unlocked: gameStore.foundItems.length >= 5 || archiveStore.everCraftedItems.length > 0
    },
    {
      id: 'cafe_owner',
      name: '咖啡馆老板',
      icon: '👨‍🍳',
      relation: '熟人',
      color: '#d4a574',
      angle: 144,
      memory: '「靠窗的位置，一直为你们留着。」',
      unlocked: gameStore.isItemFound('cup') || archiveStore.isMemoryEverTriggered('m7')
    },
    {
      id: 'bookstore_clerk',
      name: '书店店员',
      icon: '👩‍💼',
      relation: '熟人',
      color: '#8b7355',
      angle: 216,
      memory: '「她经常来这里，每次都找同一本书。」',
      unlocked: gameStore.isItemFound('book') || archiveStore.isMemoryEverTriggered('m13')
    },
    {
      id: 'old_neighbor',
      name: '老邻居',
      icon: '👴',
      relation: '长辈',
      color: '#6b8e23',
      angle: 288,
      memory: '「你们两个，从小就形影不离。」',
      unlocked: gameStore.isItemFound('carving') || archiveStore.isMemoryEverTriggered('m12')
    }
  ]
  return rels
})

const displayedPages = computed(() => {
  const pages = []
  
  const itemsPerPage = 4
  for (let i = 0; i < allItems.value.length; i += itemsPerPage) {
    pages.push({
      type: 'items',
      items: allItems.value.slice(i, i + itemsPerPage)
    })
  }
  
  const memoriesPerPage = 2
  for (let i = 0; i < allMemories.value.length; i += memoriesPerPage) {
    pages.push({
      type: 'memories',
      memories: allMemories.value.slice(i, i + memoriesPerPage)
    })
  }
  
  pages.push({
    type: 'relationships',
    relationships: relationships.value
  })
  
  return pages
})

const totalPages = computed(() => displayedPages.value.length)

watch(showModal, (val) => {
  if (val) {
    currentPageIndex.value = 0
    selectedChapter.value = 'all'
    selectedScene.value = 'all'
  }
})

watch([selectedChapter, selectedScene], () => {
  currentPageIndex.value = 0
})

function getItemChapter(itemId) {
  for (const chapter of storyStore.getAllChapters()) {
    const item = storyStore.getItemById(itemId)
    if (!item) continue
    const itemScene = findSceneForItem(itemId)
    if (itemScene && chapter.unlockedScenes.includes(itemScene.id)) {
      return chapter
    }
  }
  return null
}

function findSceneForItem(itemId) {
  for (const scene of storyStore.getAllScenes()) {
    if (scene.items.some(i => i.id === itemId)) {
      return scene
    }
  }
  return null
}

function getPageDate(page) {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日 记录`
}

function prevPage() {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }
}

function nextPage() {
  if (currentPageIndex.value < totalPages.value - 1) {
    currentPageIndex.value++
  }
}

function handleClose() {
  gameStore.closeJournal()
}

function resetFilters() {
  selectedChapter.value = 'all'
  selectedScene.value = 'all'
}

function showItemDetail(item) {
  detailType.value = 'item'
  detailItem.value = item
}

function showMemoryDetail(memory) {
  detailType.value = 'memory'
  detailItem.value = memory
}

function getEmojiForEmotion(emotion) {
  const emotions = {
    sad: '😢', warm: '🥰', pensive: '🤔', happy: '😊',
    sweet: '🍬', nervous: '😰', bittersweet: '😌', shocking: '😲',
    romantic: '💕', regret: '💔', melancholy: '🌧️', touched: '🥹', determined: '💪'
  }
  return emotions[emotion] || '💭'
}

function getEmotionName(emotion) {
  const names = {
    sad: '悲伤', warm: '温暖', pensive: '沉思', happy: '快乐',
    sweet: '甜蜜', nervous: '紧张', bittersweet: '苦乐参半', shocking: '震惊',
    romantic: '浪漫', regret: '遗憾', melancholy: '忧郁', touched: '感动', determined: '坚定'
  }
  return names[emotion] || emotion
}

function getEmotionColor(emotion) {
  const colors = {
    sad: '#6b8ecf', warm: '#ff9a9e', pensive: '#a78bfa', happy: '#fbbf24',
    sweet: '#f472b6', nervous: '#fcd34d', bittersweet: '#c4a574', shocking: '#f87171',
    romantic: '#fb7185', regret: '#9ca3af', melancholy: '#60a5fa', touched: '#fca5a5', determined: '#34d399'
  }
  return colors[emotion] || '#a0a0b0'
}
</script>

<style scoped>
.journal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 20, 0.95);
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  padding: 20px;
}

.journal-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.journal-book {
  position: relative;
  width: 100%;
  height: 550px;
  perspective: 2000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-spine {
  position: absolute;
  left: 50%;
  top: 0;
  width: 30px;
  height: 100%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #3d2914 0%, #5d4e37 50%, #3d2914 100%);
  z-index: 100;
  border-radius: 5px;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

.book-cover {
  position: absolute;
  width: 45%;
  height: 100%;
  background: linear-gradient(145deg, #8b7355 0%, #6b5a3c 50%, #4a3728 100%);
  border-radius: 5px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.book-cover-left {
  left: 2.5%;
  transform-origin: right center;
}

.book-cover-right {
  right: 2.5%;
  transform-origin: left center;
}

.cover-decoration {
  margin-bottom: 30px;
}

.cover-emblem {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cover-title {
  color: #f5e6d3;
  font-size: 2rem;
  margin: 0 0 10px 0;
  letter-spacing: 0.3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.cover-subtitle {
  color: #d4c4a8;
  font-size: 1rem;
  margin: 0 0 20px 0;
  letter-spacing: 0.2rem;
}

.cover-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4a574, transparent);
  margin-bottom: 20px;
}

.cover-year {
  color: #a89880;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
}

.back-cover-pattern {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}

.pattern-line {
  height: 1px;
  background: rgba(0,0,0,0.1);
}

.page {
  position: absolute;
  width: 42%;
  height: 94%;
  background: linear-gradient(to right, #f5e6d3 0%, #faf0e0 2%, #faf0e0 98%, #e8dcc8 100%);
  box-shadow: 
    0 5px 15px rgba(0,0,0,0.2),
    inset 0 0 20px rgba(0,0,0,0.03);
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: left center;
  left: 6%;
}

.page-content {
  width: 100%;
  height: 100%;
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  background-image: 
    linear-gradient(transparent 95%, rgba(0,0,0,0.05) 95%);
  background-size: 100% 25px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.2);
}

.page-number {
  color: #8b7355;
  font-size: 0.85rem;
  font-style: italic;
}

.page-date {
  color: #a89880;
  font-size: 0.8rem;
}

.journal-section {
  flex: 1;
  overflow-y: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5d4e37;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px dashed rgba(139, 115, 85, 0.3);
}

.section-icon {
  font-size: 1.4rem;
}

.empty-page {
  text-align: center;
  padding: 40px 20px;
  color: #a89880;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
  opacity: 0.4;
}

.empty-text {
  font-style: italic;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 0.85rem;
  margin: 0;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.journal-item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(139, 115, 85, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  opacity: 0.6;
}

.journal-item-card.unlocked {
  opacity: 1;
  background: rgba(255,255,255,0.8);
  border-color: rgba(212, 165, 116, 0.4);
}

.journal-item-card.unlocked:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 115, 85, 0.2);
  border-color: rgba(212, 165, 116, 0.6);
}

.item-sticker {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fff9f0, #f5e6d3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.15);
  flex-shrink: 0;
}

.item-icon {
  font-size: 1.8rem;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: #5d4e37;
  font-weight: 500;
}

.item-location {
  margin: 0;
  font-size: 0.75rem;
  color: #8b7355;
}

.item-locked {
  margin: 0;
  font-size: 0.75rem;
  color: #a89880;
  font-style: italic;
}

.item-detail-hint {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 0.7rem;
  color: #d4a574;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.journal-item-card.unlocked:hover .item-detail-hint {
  opacity: 1;
}

.memories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.journal-memory-card {
  padding: 15px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(139, 115, 85, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0.6;
  position: relative;
}

.journal-memory-card.unlocked {
  opacity: 1;
  background: rgba(255,255,255,0.8);
}

.journal-memory-card.unlocked:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(139, 115, 85, 0.2);
}

.journal-memory-card.hidden-memory.unlocked {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255,255,255,0.8));
  border-color: rgba(255, 215, 0, 0.4);
}

.memory-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.memory-emoji {
  font-size: 2rem;
  flex-shrink: 0;
}

.memory-title-area {
  flex: 1;
}

.memory-title {
  margin: 0 0 4px 0;
  font-size: 1rem;
  color: #5d4e37;
  font-weight: 500;
}

.hidden-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 215, 0, 0.2);
  color: #d4a017;
  font-size: 0.7rem;
  border-radius: 10px;
}

.hidden-badge.large {
  padding: 4px 12px;
  font-size: 0.8rem;
}

.memory-excerpt {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  color: #6b5a3c;
  font-style: italic;
  line-height: 1.5;
  padding-left: 10px;
  border-left: 2px solid rgba(212, 165, 116, 0.4);
}

.memory-locked {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  color: #a89880;
  font-style: italic;
}

.memory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memory-year {
  font-size: 0.75rem;
  color: #8b7355;
}

.memory-read-hint {
  font-size: 0.72rem;
  color: #d4a574;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.journal-memory-card.unlocked:hover .memory-read-hint {
  opacity: 1;
}

.relationships-section {
  display: flex;
  flex-direction: column;
}

.relationship-map {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.relationship-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.center-avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-bottom: 8px;
}

.center-name {
  margin: 0;
  color: #5d4e37;
  font-weight: 500;
  font-size: 0.9rem;
}

.relationship-connections {
  position: absolute;
  width: 100%;
  height: 100%;
}

.connection-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 42%;
  transform: translate(calc(-50% + calc(cos(var(--rel-angle)) * 130px)), calc(-50% + calc(sin(var(--rel-angle)) * 100px)));
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.connection-card.active {
  opacity: 1;
}

.connection-line {
  position: absolute;
  width: 50px;
  height: 2px;
  left: -50px;
  opacity: 0.4;
}

.connection-node {
  width: 45px;
  height: 45px;
  background: #faf0e0;
  border: 2px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
}

.node-icon {
  font-size: 1.5rem;
}

.connection-info {
  flex: 1;
  min-width: 0;
}

.connection-name {
  margin: 0 0 3px 0;
  font-size: 0.9rem;
  color: #5d4e37;
  font-weight: 500;
}

.connection-relation {
  margin: 0 0 3px 0;
  font-size: 0.75rem;
  color: #8b7355;
}

.connection-locked {
  margin: 0 0 3px 0;
  font-size: 0.75rem;
  color: #a89880;
  font-style: italic;
}

.connection-memory {
  margin: 0;
  font-size: 0.72rem;
  color: #6b5a3c;
  font-style: italic;
  line-height: 1.4;
}

.page-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
  margin-top: auto;
  border-top: 1px dashed rgba(139, 115, 85, 0.2);
}

.footer-sticker {
  font-size: 0.9rem;
  opacity: 0.6;
}

.footer-decor {
  color: #8b7355;
  opacity: 0.4;
  font-size: 0.8rem;
  letter-spacing: 0.2rem;
}

.journal-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 30px;
  background: rgba(139, 115, 85, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.nav-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #d4a574, #b8956a);
  color: #3d2914;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.4);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  color: #d4a574;
  font-size: 1rem;
  font-weight: 600;
}

.current-page {
  color: #f5e6d3;
}

.page-separator {
  margin: 0 8px;
  opacity: 0.6;
}

.total-pages {
  opacity: 0.7;
}

.journal-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(0,0,0,0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: 100%;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  color: #a0a0b0;
  font-size: 0.85rem;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 15px;
  background: rgba(255,255,255,0.05);
  color: #808090;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #c0c0d0;
}

.filter-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(212, 165, 116, 0.2));
  color: #e8c89a;
  border-color: rgba(212, 165, 116, 0.4);
}

.reset-filter-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 18px;
  background: rgba(255,255,255,0.05);
  color: #a0a0b0;
  font-family: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filter-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #e0e0e0;
}

.journal-close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  z-index: 1000;
}

.journal-close-btn:hover {
  transform: rotate(90deg);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5100;
  padding: 20px;
}

.detail-card {
  background: linear-gradient(145deg, #faf0e0, #f5e6d3);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid rgba(212, 165, 116, 0.4);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: modalIn 0.4s ease;
}

.detail-card.memory {
  background: linear-gradient(145deg, #fff9f0, #faf0e0);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.detail-icon-large {
  font-size: 4rem;
  text-align: center;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.detail-title {
  color: #5d4e37;
  font-size: 1.4rem;
  text-align: center;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.memory-detail-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.memory-detail-emoji {
  font-size: 3rem;
}

.detail-meta {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.meta-tag {
  padding: 5px 12px;
  background: rgba(139, 115, 85, 0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  color: #8b7355;
}

.detail-description {
  color: #6b5a3c;
  line-height: 1.8;
  font-size: 0.95rem;
  margin: 0 0 15px 0;
  text-align: justify;
  text-indent: 2em;
}

.linked-memory {
  padding: 15px;
  background: rgba(212, 165, 116, 0.1);
  border-radius: 12px;
  border-left: 3px solid #d4a574;
}

.linked-title {
  margin: 0 0 8px 0;
  color: #8b7355;
  font-size: 0.9rem;
  font-weight: 500;
}

.linked-content {
  margin: 0;
  color: #6b5a3c;
  font-style: italic;
  font-size: 0.88rem;
}

.detail-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.5), transparent);
  margin: 15px 0;
}

.detail-content {
  color: #5d4e37;
  line-height: 2;
  font-size: 0.95rem;
  margin: 0 0 20px 0;
  text-align: justify;
  text-indent: 2em;
}

.detail-close-btn {
  display: block;
  margin: 20px auto 0;
  padding: 12px 40px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #d4a574, #b8956a);
  color: #3d2914;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
