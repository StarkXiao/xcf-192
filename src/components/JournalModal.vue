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
                      <span class="memory-location">📍 {{ memory.sceneName }}</span>
                      <span class="memory-chapter">📖 {{ memory.chapterName }}</span>
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
                <p class="rel-section-hint">基于已收集的旧物与回忆整理 · 随探索逐步浮现</p>
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
                        <div class="connection-name-row">
                          <h4 class="connection-name">{{ rel.name }}</h4>
                          <span v-if="rel.badge" class="rel-badge">{{ rel.badge }}</span>
                        </div>
                        <p v-if="rel.unlocked" class="connection-relation">{{ rel.relation }}</p>
                        <p v-else class="connection-locked">关系未知 · 探索相关场景</p>
                        <p v-if="rel.unlocked" class="connection-memory">"{{ rel.memory }}"</p>
                        <div v-if="rel.stats" class="rel-stats">
                          <div v-for="(val, key) in rel.stats" :key="key" class="rel-stat">
                            <span class="stat-key">{{ key }}</span>
                            <span class="stat-val">{{ val }}</span>
                          </div>
                        </div>
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
                <span class="meta-tag">📍 {{ detailItem.sceneName }}</span>
                <span class="meta-tag">📖 {{ detailItem.chapterName }}</span>
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
import { scenes, chapters } from '../data/storyData'

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

const ITEM_LOCATION_MAP = {}
const ITEM_CHAPTER_MAP = {}
const SCENE_ICON_MAP = { station: '🚂', street: '🏘️', cafe: '☕', park: '🌳', bookstore: '📚', lake: '🌊' }

for (const chapter of chapters) {
  for (const sceneId of chapter.unlockedScenes) {
    const scene = scenes.find(s => s.id === sceneId)
    if (scene) {
      for (const item of scene.items) {
        if (!ITEM_LOCATION_MAP[item.id]) ITEM_LOCATION_MAP[item.id] = sceneId
        if (!ITEM_CHAPTER_MAP[item.id]) ITEM_CHAPTER_MAP[item.id] = chapter.id
      }
    }
  }
}

const HIDDEN_MEMORY_META = {
  hm1: { chapterId: 'ch3', sceneId: 'park', sceneName: '公园', chapterName: '盛夏的记忆' },
  hm2: { chapterId: 'ch2', sceneId: 'cafe', sceneName: '街角咖啡馆', chapterName: '初遇的痕迹' },
  hm3: { chapterId: 'ch4', sceneId: 'lake', sceneName: '湖畔公园', chapterName: '星光下的约定' }
}

const chapterFilters = computed(() => {
  const chapters = storyStore.getAllChapters()
  return [{ id: 'all', name: '全部' }, ...chapters.map(c => ({ id: c.id, name: c.name }))]
})

const sceneFilters = computed(() => {
  const scenes = storyStore.getAllScenes()
  return [{ id: 'all', name: '全部', icon: '🌍' }, ...scenes.map(s => ({ id: s.id, name: s.name, icon: SCENE_ICON_MAP[s.id] || '📍' }))]
})

function getItemLocationInfo(itemId) {
  const sceneId = ITEM_LOCATION_MAP[itemId]
  const chapterId = ITEM_CHAPTER_MAP[itemId]
  const scene = scenes.find(s => s.id === sceneId)
  const chapter = chapters.find(c => c.id === chapterId)
  return {
    sceneId: sceneId,
    sceneName: scene?.name || '未知地点',
    chapterId: chapterId,
    chapterName: chapter?.name || '未知章节'
  }
}

function getMemoryLocationInfo(memory) {
  if (memory.isHidden) {
    const meta = HIDDEN_MEMORY_META[memory.id]
    if (meta) {
      return {
        sceneId: meta.sceneId,
        sceneName: meta.sceneName,
        chapterId: meta.chapterId,
        chapterName: meta.chapterName
      }
    }
    return { sceneId: 'all', sceneName: '跨区域', chapterId: 'ch5', chapterName: '终章：重聚' }
  }
  return getItemLocationInfo(memory.triggerItemId)
}

const allItems = computed(() => {
  const scenes = storyStore.getAllScenes()
  const items = []
  for (const scene of scenes) {
    for (const item of scene.items) {
      const locInfo = getItemLocationInfo(item.id)
      if (selectedScene.value !== 'all' && locInfo.sceneId !== selectedScene.value) continue
      if (selectedChapter.value !== 'all' && locInfo.chapterId !== selectedChapter.value) continue

      const unlocked = gameStore.isItemFound(item.id) || archiveStore.isMemoryEverTriggered(storyStore.getMemoryByItemId(item.id)?.id)
      const memory = storyStore.getMemoryByItemId(item.id)
      items.push({
        ...item,
        sceneId: locInfo.sceneId,
        sceneName: locInfo.sceneName,
        chapterId: locInfo.chapterId,
        chapterName: locInfo.chapterName,
        unlocked,
        memory: unlocked ? memory : null
      })
    }
  }
  return items
})

const allMemories = computed(() => {
  const normalMemories = storyStore.getAllMemories().map(m => {
    const locInfo = getItemLocationInfo(m.triggerItemId)
    return {
      ...m,
      isHidden: false,
      excerpt: m.content.substring(0, 50) + '...',
      unlocked: gameStore.triggeredMemories.includes(m.id) || archiveStore.isMemoryEverTriggered(m.id),
      sceneId: locInfo.sceneId,
      sceneName: locInfo.sceneName,
      chapterId: locInfo.chapterId,
      chapterName: locInfo.chapterName
    }
  })
  const hiddenMemories = storyStore.getAllHiddenMemories().map(hm => {
    const locInfo = getMemoryLocationInfo({ ...hm, isHidden: true })
    return {
      ...hm,
      isHidden: true,
      excerpt: hm.content.substring(0, 50) + '...',
      unlocked: gameStore.isHiddenMemoryUnlocked(hm.id) || archiveStore.isHiddenMemoryEverUnlocked(hm.id),
      sceneId: locInfo.sceneId,
      sceneName: locInfo.sceneName,
      chapterId: locInfo.chapterId,
      chapterName: locInfo.chapterName
    }
  })
  return [...normalMemories, ...hiddenMemories].filter(m => {
    if (selectedScene.value !== 'all' && m.sceneId !== selectedScene.value) return false
    if (selectedChapter.value !== 'all' && m.chapterId !== selectedChapter.value) return false
    return true
  })
})

const relationships = computed(() => {
  const hasMemory = (id) => gameStore.triggeredMemories.includes(id) || archiveStore.isMemoryEverTriggered(id)
  const hasItem = (id) => gameStore.isItemFound(id) || archiveStore.isMemoryEverTriggered(storyStore.getMemoryByItemId(id)?.id)
  const hasHM = (id) => gameStore.isHiddenMemoryUnlocked(id) || archiveStore.isHiddenMemoryEverUnlocked(id)

  const cafeUnlocked = hasItem('cup') || hasItem('notebook') || hasItem('ring') || hasMemory('m7') || hasMemory('m8') || hasMemory('m9')
  const bookstoreUnlocked = hasItem('book') || hasItem('bookmark') || hasItem('glasses') || hasMemory('m13') || hasMemory('m14') || hasMemory('m15')
  const streetUnlocked = hasItem('bracelet') || hasItem('flower') || hasItem('carving') || hasMemory('m10') || hasMemory('m11') || hasMemory('m12')
  const parkUnlocked = hasItem('photo') || hasItem('icecream') || hasItem('balloon') || hasMemory('m4') || hasMemory('m5') || hasMemory('m6')
  const lakeUnlocked = hasItem('bottle') || hasItem('necklace') || hasItem('promise_ring') || hasMemory('m16') || hasMemory('m17') || hasMemory('m18')
  const stationUnlocked = hasItem('ticket') || hasItem('watch') || hasItem('letter') || hasMemory('m1') || hasMemory('m2') || hasMemory('m3')

  const totalMemories = (() => {
    const set = new Set([...gameStore.triggeredMemories, ...archiveStore.everTriggeredMemories])
    return set.size
  })()
  const totalItems = (() => {
    let count = 0
    const allScenes = storyStore.getAllScenes()
    for (const scene of allScenes) {
      for (const item of scene.items) {
        if (hasItem(item.id)) count++
      }
    }
    return count
  })()
  const totalHM = (() => {
    const set = new Set([...gameStore.unlockedHiddenMemories, ...archiveStore.everUnlockedHiddenMemories])
    return set.size
  })()
  const herUnlocked = totalMemories > 0 || totalItems > 0

  const rels = []

  rels.push({
    id: 'her',
    name: '她',
    icon: '👩',
    relation: herUnlocked ? `恋人 · 共同回忆 ${Math.min(totalMemories + totalHM, 21)} 段` : '恋人',
    color: '#ff6b9d',
    angle: 0,
    memory: hasMemory('m18')
      ? '「我一直在等你开口。」'
      : hasMemory('m9')
        ? '「这枚戒指，我还留着。」'
        : hasMemory('m1')
          ? '「再见...保重。」'
          : '「如果你开口挽留，我会留下来。」',
    unlocked: herUnlocked,
    stats: herUnlocked ? { '旧物': Math.min(totalItems, 18), '回忆': Math.min(totalMemories, 18), '隐藏': Math.min(totalHM, 3) } : null,
    badge: hasHM('hm3') ? '✦ 星光见证' : hasMemory('m18') ? '💕 永不分离' : hasMemory('m9') ? '💍 未完待续' : null
  })

  rels.push({
    id: 'station_master',
    name: '火车站长',
    icon: '🧔',
    relation: stationUnlocked ? '离别见证者' : '素未谋面',
    color: '#8b9dc3',
    angle: 51,
    memory: hasMemory('m3')
      ? '「这封信，是她特意留给你的。」'
      : hasMemory('m2')
        ? '「这块表，见证了太多离别与重逢。」'
        : hasMemory('m1')
          ? '「那天的雪，下得真大啊。」'
          : '「年轻人，要去哪里？」',
    unlocked: stationUnlocked,
    stats: stationUnlocked ? {
      '站台': '火车站',
      '物品': [hasItem('ticket') && '车票', hasItem('watch') && '旧手表', hasItem('letter') && '未拆的信'].filter(Boolean).join('、') || '无'
    } : null
  })

  rels.push({
    id: 'cafe_owner',
    name: '咖啡馆老板',
    icon: '👨‍🍳',
    relation: cafeUnlocked ? '初遇的守护者' : '素未谋面',
    color: '#d4a574',
    angle: 102,
    memory: hasHM('hm2')
      ? '「这杯特调，只为你们而调。」'
      : hasMemory('m9')
        ? '「这枚戒指，我保存了很多年。」'
        : hasMemory('m8')
          ? '「她的笔记，写满了你的名字。」'
          : hasMemory('m7')
            ? '「靠窗的位置，一直为你们留着。」'
            : '「欢迎光临，要点什么？」',
    unlocked: cafeUnlocked,
    stats: cafeUnlocked ? {
      '角落': '街角咖啡馆',
      '物品': [hasItem('cup') && '情侣杯', hasItem('notebook') && '笔记本', hasItem('ring') && '银戒指'].filter(Boolean).join('、') || '无'
    } : null
  })

  rels.push({
    id: 'neighbor',
    name: '老街邻居',
    icon: '👵',
    relation: streetUnlocked ? '青梅竹马的见证者' : '素未谋面',
    color: '#9b8b6a',
    angle: 153,
    memory: hasMemory('m12')
      ? '「这木雕，是你们一起刻的吧？」'
      : hasMemory('m11')
        ? '「她走的那天，回头了好多次。」'
        : hasMemory('m10')
          ? '「你们两个，从小就形影不离。」'
          : '「你是...老王家的小子？」',
    unlocked: streetUnlocked,
    stats: streetUnlocked ? {
      '巷口': '老街',
      '物品': [hasItem('flower') && '干花', hasItem('bracelet') && '编绳手链', hasItem('carving') && '木雕'].filter(Boolean).join('、') || '无'
    } : null
  })

  rels.push({
    id: 'old_tree',
    name: '公园老树',
    icon: '🌳',
    relation: parkUnlocked ? '夏日回忆的载体' : '伫立的守候',
    color: '#7cb342',
    angle: 204,
    memory: hasHM('hm1')
      ? '✦ 树洞里藏着一个关于星光的秘密...'
      : hasMemory('m6')
        ? '「气球带着心愿飘向了远方。」'
        : hasMemory('m5')
          ? '「那支融化的冰淇淋，甜了整个夏天。」'
          : hasMemory('m4')
            ? '「老照片里，你们笑得真灿烂。」'
            : '风吹树叶，沙沙作响...',
    unlocked: parkUnlocked,
    stats: parkUnlocked ? {
      '树荫': '公园',
      '物品': [hasItem('photo') && '老照片', hasItem('icecream') && '冰淇淋盒', hasItem('balloon') && '气球残片'].filter(Boolean).join('、') || '无'
    } : null
  })

  rels.push({
    id: 'bookstore_clerk',
    name: '书店店员',
    icon: '👩‍💼',
    relation: bookstoreUnlocked ? '字里行间的观察者' : '素未谋面',
    color: '#8b7355',
    angle: 255,
    memory: hasMemory('m15')
      ? '「这副眼镜，是她遗落在这里的。」'
      : hasMemory('m14')
        ? '「她总把书签夹在同一页。」'
        : hasMemory('m13')
          ? '「她经常来，每次都找同一本书。」'
          : '「欢迎光临，需要推荐吗？」',
    unlocked: bookstoreUnlocked,
    stats: bookstoreUnlocked ? {
      '书架间': '旧书店',
      '物品': [hasItem('book') && '诗集', hasItem('bookmark') && '书签', hasItem('glasses') && '眼镜'].filter(Boolean).join('、') || '无'
    } : null
  })

  rels.push({
    id: 'lake_witness',
    name: '湖畔涟漪',
    icon: '🌊',
    relation: lakeUnlocked ? '约定的见证者' : '平静的湖面',
    color: '#4dd0e1',
    angle: 306,
    memory: hasHM('hm3')
      ? '✦ 星光下，那个关于一生的约定终于被听见...'
      : hasMemory('m18')
        ? '「我答应过你，会等你。」'
        : hasMemory('m17')
          ? '「这条项链，坠着我所有的勇气。」'
          : hasMemory('m16')
            ? '「漂流瓶里，装着我的思念。」'
            : '湖面倒映着星光与云影...',
    unlocked: lakeUnlocked,
    stats: lakeUnlocked ? {
      '水畔': '湖畔公园',
      '物品': [hasItem('bottle') && '漂流瓶', hasItem('necklace') && '项链', hasItem('promise_ring') && '承诺戒指'].filter(Boolean).join('、') || '无'
    } : null
  })

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
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
}

.memory-year,
.memory-location,
.memory-chapter {
  font-size: 0.72rem;
  color: #8b7355;
  background: rgba(139, 115, 85, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
}

.memory-read-hint {
  font-size: 0.72rem;
  color: #d4a574;
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-left: auto;
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
  height: 340px;
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
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-bottom: 6px;
}

.center-name {
  margin: 0;
  color: #5d4e37;
  font-weight: 500;
  font-size: 0.85rem;
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
  width: 45%;
  transform: translate(calc(-50% + calc(cos(var(--rel-angle)) * 150px)), calc(-50% + calc(sin(var(--rel-angle)) * 130px)));
  display: flex;
  align-items: flex-start;
  gap: 8px;
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

.rel-section-hint {
  margin: -10px 0 12px 0;
  font-size: 0.75rem;
  color: #a09380;
  font-style: italic;
  text-align: center;
}

.connection-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.rel-badge {
  display: inline-block;
  padding: 1px 6px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.25), rgba(255, 107, 157, 0.1));
  color: #ff6b9d;
  font-size: 0.65rem;
  border-radius: 8px;
  font-weight: 500;
  white-space: nowrap;
}

.rel-stats {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(139, 115, 85, 0.2);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rel-stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  gap: 8px;
}

.stat-key {
  color: #9b8b6a;
  font-weight: 500;
  flex-shrink: 0;
}

.stat-val {
  color: #6b5a3c;
  text-align: right;
  min-width: 0;
  word-break: break-all;
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
