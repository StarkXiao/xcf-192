<template>
  <Transition name="fade">
    <div v-if="showModal" class="memory-archive-overlay" @click.self="handleClose">
      <div class="memory-archive-panel">
        <div class="archive-header">
          <div class="header-left">
            <span class="archive-title-icon">🏛️</span>
            <div>
              <h2 class="archive-main-title">雾城回忆档案馆</h2>
              <p class="archive-subtitle">收藏每一段被雾气笼罩的往事</p>
            </div>
          </div>
          <div class="header-right">
            <div class="completion-badge">
              <span class="badge-label">完成度</span>
              <span class="badge-value">{{ overallCompletion }}%</span>
            </div>
            <button class="close-icon-btn" @click="handleClose">✕</button>
          </div>
        </div>

        <div class="chapter-navbar">
          <div class="chapter-nav-label">📖 章节导航</div>
          <div class="chapter-nav-scroll">
            <button
              v-for="chapter in allChapters"
              :key="chapter.id"
              class="chapter-nav-btn"
              :class="{
                active: selectedChapter === chapter.id,
                unlocked: isChapterUnlocked(chapter.id),
                locked: !isChapterUnlocked(chapter.id)
              }"
              @click="selectChapter(chapter.id)"
            >
              <span v-if="isChapterUnlocked(chapter.id)" class="chapter-nav-num">{{ chapter.id }}</span>
              <span v-else class="chapter-nav-lock">🔒</span>
              <span class="chapter-nav-name">{{ isChapterUnlocked(chapter.id) ? getChapterShortName(chapter) : '???' }}</span>
            </button>
          </div>
        </div>

        <div class="section-tabs">
          <button
            v-for="tab in sectionTabs"
            :key="tab.id"
            class="section-tab-btn"
            :class="{ active: activeSection === tab.id }"
            @click="activeSection = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="getSectionCount(tab.id) > 0" class="tab-count">
              {{ getUnlockedCount(tab.id) }}/{{ getSectionCount(tab.id) }}
            </span>
          </button>
        </div>

        <div class="archive-content-area">
          <div v-if="activeSection === 'items'" class="section-content items-section">
            <div v-if="!isChapterUnlocked(selectedChapter)" class="chapter-locked-state">
              <span class="lock-icon">🔒</span>
              <h3 class="lock-title">本章尚未解锁</h3>
              <p class="lock-hint">{{ getChapterUnlockHint(selectedChapter) }}</p>
            </div>
            <template v-else>
              <div class="section-header">
                <h3 class="section-title">📦 旧物图鉴</h3>
                <p class="section-desc">本章收集到的所有物品、合成道具与隐藏收集品</p>
              </div>

              <div class="items-subtabs">
                <button
                  v-for="sub in itemSubtabs"
                  :key="sub.id"
                  class="items-subtab-btn"
                  :class="{ active: itemSubtab === sub.id }"
                  @click="itemSubtab = sub.id"
                >
                  {{ sub.icon }} {{ sub.label }} ({{ getSubtabUnlocked(sub.id) }}/{{ getSubtabTotal(sub.id) }})
                </button>
              </div>

              <div v-if="itemSubtab === 'found'" class="items-grid">
                <div
                  v-for="item in chapterItems.found"
                  :key="item.id"
                  class="item-card"
                  :class="{ unlocked: item.unlocked }"
                  @click="item.unlocked && showItemDetail(item)"
                >
                  <div class="item-icon-wrap">
                    <span class="item-icon">{{ item.unlocked ? item.icon : '❓' }}</span>
                  </div>
                  <div class="item-info">
                    <h4 class="item-name">{{ item.unlocked ? item.name : '未发现的物品' }}</h4>
                    <p class="item-hint">{{ item.unlocked ? item.sceneName : getChapterHint('item', selectedChapter) }}</p>
                  </div>
                  <span v-if="!item.unlocked" class="lock-overlay">🔒</span>
                </div>
                <div v-if="chapterItems.found.length === 0" class="empty-mini-state">
                  <span>🎒</span>
                  <p>本章暂无可收集物品</p>
                </div>
              </div>

              <div v-else-if="itemSubtab === 'crafted'" class="items-grid">
                <div
                  v-for="item in chapterItems.crafted"
                  :key="item.id"
                  class="item-card crafted-card"
                  :class="{ unlocked: item.unlocked, [item.rarity]: true }"
                  @click="item.unlocked && showCraftedDetail(item)"
                >
                  <div class="item-icon-wrap crafted-icon">
                    <span class="item-icon">{{ item.unlocked ? item.icon : '✨' }}</span>
                  </div>
                  <div class="item-info">
                    <h4 class="item-name crafted-name">{{ item.unlocked ? item.name : '未合成的道具' }}</h4>
                    <p class="item-hint">{{ item.unlocked ? item.rarityLabel : getChapterHint('craft', selectedChapter) }}</p>
                  </div>
                  <span v-if="!item.unlocked" class="lock-overlay">🔒</span>
                </div>
                <div v-if="chapterItems.crafted.length === 0" class="empty-mini-state">
                  <span>⚗️</span>
                  <p>本章暂无可合成道具</p>
                </div>
              </div>

              <div v-else-if="itemSubtab === 'hidden'" class="items-grid">
                <div
                  v-for="item in chapterItems.hidden"
                  :key="item.id"
                  class="item-card hidden-card"
                  :class="{ unlocked: item.unlocked, [item.rarity]: true }"
                  @click="item.unlocked && showHiddenItemDetail(item)"
                >
                  <div class="item-icon-wrap hidden-icon">
                    <span class="item-icon">{{ item.unlocked ? item.icon : '🔮' }}</span>
                  </div>
                  <div class="item-info">
                    <h4 class="item-name hidden-name">{{ item.unlocked ? item.name : '隐藏收集品' }}</h4>
                    <p class="item-hint">{{ item.unlocked ? item.rarityLabel : '仔细探索场景中的特殊互动...' }}</p>
                  </div>
                  <span v-if="!item.unlocked" class="lock-overlay">🔒</span>
                </div>
                <div v-if="chapterItems.hidden.length === 0" class="empty-mini-state">
                  <span>✨</span>
                  <p>本章暂无隐藏收集品</p>
                </div>
              </div>
            </template>
          </div>

          <div v-else-if="activeSection === 'timeline'" class="section-content timeline-section">
            <div v-if="!isChapterUnlocked(selectedChapter)" class="chapter-locked-state">
              <span class="lock-icon">🔒</span>
              <h3 class="lock-title">本章尚未解锁</h3>
              <p class="lock-hint">{{ getChapterUnlockHint(selectedChapter) }}</p>
            </div>
            <template v-else>
              <div class="section-header">
                <h3 class="section-title">🕰️ 回忆时间线</h3>
                <p class="section-desc">按时间顺序重温每一段被唤醒的珍贵回忆</p>
              </div>

              <div class="timeline-filter">
                <button
                  v-for="filter in timelineFilters"
                  :key="filter.id"
                  class="timeline-filter-btn"
                  :class="{ active: timelineFilter === filter.id }"
                  @click="timelineFilter = filter.id"
                >
                  {{ filter.icon }} {{ filter.label }}
                </button>
              </div>

              <div class="timeline-container">
                <div class="timeline-line"></div>
                <div
                  v-for="(memory, idx) in filteredTimelineMemories"
                  :key="memory.id"
                  class="timeline-node"
                  :class="{
                    unlocked: memory.unlocked,
                    'hidden-memory': memory.isHidden,
                    left: idx % 2 === 0,
                    right: idx % 2 === 1
                  }"
                  @click="memory.unlocked && openMemoryDetail(memory)"
                >
                  <div class="timeline-dot">
                    <span>{{ memory.unlocked ? (memory.isHidden ? '⭐' : getEmojiForEmotion(memory.emotion)) : '•' }}</span>
                  </div>
                  <div class="timeline-card">
                    <div class="timeline-year">{{ memory.unlocked ? memory.year : '????' }}</div>
                    <h4 class="timeline-title">{{ memory.unlocked ? memory.title : '未解锁的回忆' }}</h4>
                    <p class="timeline-preview">{{ memory.unlocked ? (memory.content.substring(0, 50) + '...') : getChapterHint('memory', selectedChapter) }}</p>
                    <div v-if="memory.isHidden && memory.unlocked" class="timeline-hidden-badge">✨ 隐藏回忆</div>
                  </div>
                </div>
                <div v-if="filteredTimelineMemories.length === 0" class="empty-timeline">
                  <span class="empty-timeline-icon">💭</span>
                  <p>此分类下暂无回忆记录</p>
                </div>
              </div>
            </template>
          </div>

          <div v-else-if="activeSection === 'characters'" class="section-content characters-section">
            <div v-if="!isChapterUnlocked(selectedChapter)" class="chapter-locked-state">
              <span class="lock-icon">🔒</span>
              <h3 class="lock-title">本章尚未解锁</h3>
              <p class="lock-hint">{{ getChapterUnlockHint(selectedChapter) }}</p>
            </div>
            <template v-else>
              <div class="section-header">
                <h3 class="section-title">💞 角色关系卡</h3>
                <p class="section-desc">随回忆逐渐清晰的人物羁绊与情感联结</p>
              </div>

              <div class="character-cards-grid">
                <div
                  v-for="char in chapterCharacters"
                  :key="char.id"
                  class="character-card"
                  :class="{ unlocked: char.unlocked, deep: char.depthLevel >= 3 }"
                  @click="char.unlocked && openCharacterDetail(char)"
                >
                  <div class="character-avatar">
                    <span class="avatar-emoji">{{ char.unlocked ? char.avatar : '👤' }}</span>
                    <div v-if="char.unlocked" class="relation-ring" :style="{ '--depth': char.depthLevel }"></div>
                  </div>
                  <div class="character-info">
                    <h4 class="character-name">{{ char.unlocked ? char.name : '???' }}</h4>
                    <p class="character-relation">{{ char.unlocked ? char.relation : '未建立联系' }}</p>
                    <div class="depth-bar">
                      <div class="depth-fill" :style="{ width: (char.depthLevel / 5 * 100) + '%' }"></div>
                    </div>
                    <p class="depth-label">{{ char.unlocked ? getDepthLabel(char.depthLevel) : '探索更多回忆以加深了解' }}</p>
                  </div>
                  <span v-if="!char.unlocked" class="char-lock">🔒</span>
                </div>
              </div>
            </template>
          </div>

          <div v-else-if="activeSection === 'endings'" class="section-content endings-section">
            <div class="section-header">
              <h3 class="section-title">🎬 结局回放</h3>
              <p class="section-desc">所有你曾抵达的命运终点，随时可以重新回望</p>
            </div>

            <div class="endings-filter-bar">
              <div class="endings-overview">
                <div class="overview-item legendary-ov">
                  <span class="ov-icon">👑</span>
                  <span class="ov-label">传说</span>
                  <span class="ov-val">{{ legendaryCount }}</span>
                </div>
                <div class="overview-item epic-ov">
                  <span class="ov-icon">🏆</span>
                  <span class="ov-label">史诗</span>
                  <span class="ov-val">{{ epicCount }}</span>
                </div>
                <div class="overview-item special-ov">
                  <span class="ov-icon">💫</span>
                  <span class="ov-label">特殊</span>
                  <span class="ov-val">{{ specialCount }}</span>
                </div>
                <div class="overview-item other-ov">
                  <span class="ov-icon">🌟</span>
                  <span class="ov-label">其他</span>
                  <span class="ov-val">{{ otherEndingCount }}</span>
                </div>
              </div>
            </div>

            <div class="endings-list">
              <div
                v-for="ending in allEndingsList"
                :key="ending.key"
                class="ending-playback-card"
                :class="[ending.type, { unlocked: ending.unlocked }]"
              >
                <div class="ending-left">
                  <div class="ending-icon-box" :class="ending.type">
                    <span class="ending-icon-lg">{{ ending.unlocked ? ending.emoji : '🔒' }}</span>
                  </div>
                </div>
                <div class="ending-center">
                  <h4 class="ending-name" :class="{ unlocked: ending.unlocked }">
                    {{ ending.unlocked ? ending.title : '??? 未解锁结局' }}
                  </h4>
                  <p v-if="ending.unlocked" class="ending-subtitle">{{ ending.subtitle || ending.badge }}</p>
                  <p v-else class="ending-unlock-hint">{{ getEndingUnlockHint(ending.type) }}</p>
                  <p v-if="ending.unlocked" class="ending-desc-preview">
                    {{ ending.description ? ending.description.substring(0, 80) + '...' : '' }}
                  </p>
                  <div v-if="ending.unlocked && ending.timestamp" class="ending-meta">
                    <span>🏁 {{ formatTime(ending.timestamp) }} 首次达成</span>
                    <span v-if="ending.playbackCount > 0" class="playback-count">🎬 回放 {{ ending.playbackCount }} 次</span>
                  </div>
                </div>
                <div class="ending-right">
                  <button
                    v-if="ending.unlocked"
                    class="playback-btn"
                    :class="ending.type"
                    @click="playbackEnding(ending)"
                  >
                    ▶ 回放
                  </button>
                  <span v-else class="locked-badge">未达成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="detailModal" class="detail-modal-overlay" @click.self="detailModal = null">
          <div class="detail-modal-card" :class="detailModalClass">
            <button class="detail-close-btn" @click="detailModal = null">✕</button>

            <template v-if="detailModal.type === 'item'">
              <div class="detail-header">
                <span class="detail-big-icon">{{ detailModal.data.icon }}</span>
                <div>
                  <h3 class="detail-title">{{ detailModal.data.name }}</h3>
                  <p class="detail-subtitle">{{ detailModal.data.sceneName }}</p>
                </div>
              </div>
              <div class="detail-divider"></div>
              <p class="detail-description">{{ detailModal.data.description }}</p>
              <div class="detail-meta-row">
                <span>📅 出现时段：{{ detailModal.data.periodLabel }}</span>
              </div>
            </template>

            <template v-else-if="detailModal.type === 'crafted'">
              <div class="detail-header crafted-detail-header">
                <span class="detail-big-icon crafted-big">{{ detailModal.data.icon }}</span>
                <div>
                  <span class="detail-rarity-badge" :class="detailModal.data.rarity">{{ detailModal.data.rarityLabel }}</span>
                  <h3 class="detail-title crafted-detail-title">{{ detailModal.data.name }}</h3>
                  <p class="detail-subtitle">合成物</p>
                </div>
              </div>
              <div class="detail-divider crafted-divider"></div>
              <p class="detail-description crafted-desc">{{ detailModal.data.description }}</p>
              <div class="recipe-box" v-if="detailModal.data.ingredients && detailModal.data.ingredients.length">
                <div class="recipe-label">🔮 合成配方</div>
                <div class="recipe-ingredients">
                  <span v-for="(ing, idx) in detailModal.data.ingredients" :key="idx" class="ingredient-tag">
                    {{ ing.icon }} {{ ing.name }}
                  </span>
                </div>
              </div>
            </template>

            <template v-else-if="detailModal.type === 'hiddenItem'">
              <div class="detail-header hidden-detail-header">
                <span class="detail-big-icon hidden-big">{{ detailModal.data.icon }}</span>
                <div>
                  <span class="detail-rarity-badge" :class="detailModal.data.rarity">{{ detailModal.data.rarityLabel }}</span>
                  <h3 class="detail-title hidden-detail-title">{{ detailModal.data.name }}</h3>
                  <p class="detail-subtitle">隐藏收集品</p>
                </div>
              </div>
              <div class="detail-divider hidden-divider"></div>
              <p class="detail-description hidden-desc">{{ detailModal.data.description }}</p>
              <div class="unlock-condition-box">
                <div class="condition-label">💡 解锁方式</div>
                <p class="condition-text">{{ detailModal.data.unlockCondition }}</p>
              </div>
            </template>

            <template v-else-if="detailModal.type === 'memory'">
              <div v-if="detailModal.data.isHidden" class="detail-banner">
                <span class="banner-star">✦</span> 隐藏回忆 <span class="banner-star">✦</span>
              </div>
              <div class="detail-header memory-detail-header" :style="{ marginTop: detailModal.data.isHidden ? '1rem' : '0' }">
                <span class="detail-big-icon">{{ getEmojiForEmotion(detailModal.data.emotion) }}</span>
                <div>
                  <span class="detail-year-tag">{{ detailModal.data.year }}</span>
                  <h3 class="detail-title" :class="{ 'hidden-memory-title': detailModal.data.isHidden }">{{ detailModal.data.title }}</h3>
                </div>
              </div>
              <div class="detail-divider" :class="{ 'hidden-divider': detailModal.data.isHidden }"></div>
              <p class="detail-memory-content" :class="{ 'hidden-memory-content': detailModal.data.isHidden }">{{ detailModal.data.content }}</p>
            </template>

            <template v-else-if="detailModal.type === 'character'">
              <div class="detail-header character-detail-header">
                <div class="character-avatar-lg">
                  <span>{{ detailModal.data.avatar }}</span>
                </div>
                <div>
                  <h3 class="detail-title character-detail-title">{{ detailModal.data.name }}</h3>
                  <p class="character-relation-lg">{{ detailModal.data.relation }}</p>
                  <div class="character-depth-bar-lg">
                    <div class="depth-fill-lg" :style="{ width: (detailModal.data.depthLevel / 5 * 100) + '%' }"></div>
                  </div>
                  <span class="depth-text-lg">羁绊等级：{{ getDepthLabel(detailModal.data.depthLevel) }}</span>
                </div>
              </div>
              <div class="detail-divider character-divider"></div>
              <div class="character-memories-list" v-if="detailModal.data.relatedMemories && detailModal.data.relatedMemories.length">
                <div class="cm-label">💭 相关回忆片段</div>
                <div v-for="mem in detailModal.data.relatedMemories" :key="mem.id" class="cm-item">
                  <span class="cm-year">{{ mem.year }}</span>
                  <span class="cm-title">「{{ mem.title }}」</span>
                </div>
              </div>
              <div class="character-quote">
                <span class="quote-mark">"</span>
                <p class="quote-text">{{ detailModal.data.quote }}</p>
                <span class="quote-mark right">"</span>
              </div>
            </template>

            <template v-else-if="detailModal.type === 'ending'">
              <div class="ending-playback-header" :class="detailModal.data.type">
                <div class="epb-badge" v-if="detailModal.data.subtitle">
                  <span class="badge-star">✦</span>
                  {{ detailModal.data.subtitle }}
                  <span class="badge-star">✦</span>
                </div>
                <span class="epb-icon">{{ detailModal.data.emoji }}</span>
                <h3 class="epb-title" :class="detailModal.data.type">{{ detailModal.data.title }}</h3>
              </div>
              <div class="detail-divider ending-divider"></div>
              <div class="ending-playback-content">
                <p v-for="(para, idx) in detailModal.data.descriptionParagraphs" :key="idx" class="epb-para">
                  {{ para }}
                </p>
              </div>
              <div class="ending-stats-row">
                <div class="es-item">
                  <span class="es-label">首次达成</span>
                  <span class="es-value">{{ formatTime(detailModal.data.timestamp) }}</span>
                </div>
                <div class="es-item">
                  <span class="es-label">回放次数</span>
                  <span class="es-value">{{ detailModal.data.playbackCount }} 次</span>
                </div>
              </div>
            </template>

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

const showModal = computed(() => gameStore.showMemoryArchiveModal)
const activeSection = ref('items')
const selectedChapter = ref(1)
const itemSubtab = ref('found')
const timelineFilter = ref('all')
const detailModal = ref(null)

const sectionTabs = [
  { id: 'items', icon: '📦', label: '旧物图鉴' },
  { id: 'timeline', icon: '🕰️', label: '回忆时间线' },
  { id: 'characters', icon: '💞', label: '角色关系卡' },
  { id: 'endings', icon: '🎬', label: '结局回放' }
]

const itemSubtabs = [
  { id: 'found', icon: '🎒', label: '收集物品' },
  { id: 'crafted', icon: '⚗️', label: '合成道具' },
  { id: 'hidden', icon: '🔮', label: '隐藏收集' }
]

const timelineFilters = [
  { id: 'all', icon: '📚', label: '全部回忆' },
  { id: 'normal', icon: '💭', label: '普通回忆' },
  { id: 'hidden', icon: '✨', label: '隐藏回忆' }
]

const allChapters = computed(() => {
  try {
    if (storyStore.getAllChapters) return storyStore.getAllChapters()
  } catch (e) {}
  return [
    { id: 1, name: '序章·归乡', requiredMemoryPercent: 0 },
    { id: 2, name: '第一章·初遇的痕迹', requiredMemoryPercent: 15 },
    { id: 3, name: '第二章·盛夏的记忆', requiredMemoryPercent: 35 },
    { id: 4, name: '第三章·永恒的诺言', requiredMemoryPercent: 55 },
    { id: 5, name: '终章·雾散的湖畔', requiredMemoryPercent: 75 }
  ]
})

function getChapterShortName(chapter) {
  if (!chapter || !chapter.name) return '未知'
  const parts = chapter.name.split('·')
  return parts.length > 1 ? parts[1] : chapter.name
}

const chapterSceneMap = {
  1: ['station'],
  2: ['station', 'street', 'cafe'],
  3: ['station', 'street', 'cafe', 'park', 'bookstore'],
  4: ['station', 'street', 'cafe', 'park', 'bookstore', 'lake'],
  5: ['station', 'street', 'cafe', 'park', 'bookstore', 'lake']
}

const rarityLabels = {
  legendary: '传说',
  epic: '史诗',
  rare: '稀有',
  common: '普通'
}

const periodLabels = {
  dawn: '黎明',
  day: '白昼',
  dusk: '黄昏',
  night: '深夜'
}

const overallCompletion = computed(() => {
  const stats = archiveStore.getArchiveCompletionStats()
  let totalItems = 18, totalCrafted = 6, totalMemories = 18, totalHM = 6, totalHI = 5
  try {
    totalItems = storyStore.getTotalItemCount() || 18
    totalCrafted = storyStore.getTotalCraftedCount() || 6
    totalMemories = storyStore.getAllMemories().length || 18
    totalHM = storyStore.getAllHiddenMemories().length || 6
    if (storyStore.getTotalHiddenItemsCount) totalHI = storyStore.getTotalHiddenItemsCount() || 5
  } catch (e) {}
  const totalEndings = 8
  const totalChars = 5
  const totalChapters = allChapters.value.length

  let score = 0, max = 0
  score += (archiveStore.everTriggeredMemories.length / Math.max(1, totalMemories)) * 20; max += 20
  score += (archiveStore.everCraftedItems.length / Math.max(1, totalCrafted)) * 15; max += 15
  score += (archiveStore.unlockedEndings.length / Math.max(1, totalEndings)) * 20; max += 20
  score += (archiveStore.everUnlockedHiddenMemories.length / Math.max(1, totalHM)) * 15; max += 15
  score += (archiveStore.everFoundHiddenItems.length / Math.max(1, totalHI)) * 10; max += 10
  score += (stats.unlockedChapters / Math.max(1, totalChapters)) * 10; max += 10
  score += (stats.characterRelations / Math.max(1, totalChars)) * 10; max += 10
  return max > 0 ? Math.round((score / max) * 100) : 0
})

function isChapterUnlocked(chapterId) {
  return archiveStore.isChapterUnlocked(chapterId)
}

function selectChapter(chapterId) {
  if (isChapterUnlocked(chapterId)) selectedChapter.value = chapterId
}

function getChapterUnlockHint(chapterId) {
  const chapter = allChapters.value.find(c => c.id === chapterId)
  if (!chapter) return '继续探索以解锁'
  return `收集更多回忆碎片（达成 ${chapter.requiredMemoryPercent}% 回忆完整度）即可解锁本章`
}

function getChapterHint(type) {
  const hints = {
    item: '在本章场景中仔细寻找，物品可能在特定时段才会出现...',
    craft: '收集齐配方所需的物品后，尝试合成新的道具...',
    memory: '找到相关物品后，回忆会自然浮现...'
  }
  return hints[type] || '继续探索以解锁更多内容'
}

function getSectionCount(sectionId) {
  try {
    switch (sectionId) {
      case 'items':
        return (storyStore.getTotalItemCount() || 18) + (storyStore.getTotalCraftedCount() || 6) + (storyStore.getTotalHiddenItemsCount ? (storyStore.getTotalHiddenItemsCount() || 5) : 5)
      case 'timeline':
        return (storyStore.getAllMemories().length || 18) + (storyStore.getAllHiddenMemories().length || 6)
      case 'characters': return 5
      case 'endings': return 8
    }
  } catch (e) {}
  return 0
}

function getUnlockedCount(sectionId) {
  switch (sectionId) {
    case 'items':
      return archiveStore.everTriggeredMemories.length + archiveStore.everCraftedItems.length + archiveStore.everFoundHiddenItems.length
    case 'timeline':
      return archiveStore.everTriggeredMemories.length + archiveStore.everUnlockedHiddenMemories.length
    case 'characters': return archiveStore.characterRelations.length
    case 'endings': return archiveStore.unlockedEndings.length
    default: return 0
  }
}

const chapterItems = computed(() => {
  const scenes = chapterSceneMap[selectedChapter.value] || []
  const allSceneItems = []
  const allCraftedItems = []
  const allHiddenItems = []

  for (const sceneId of scenes) {
    const scene = storyStore.getSceneById(sceneId)
    if (scene && scene.items) {
      for (const item of scene.items) {
        const memory = storyStore.getMemoryByItemId(item.id)
        const unlocked = memory ? archiveStore.isMemoryEverTriggered(memory.id) : false
        allSceneItems.push({
          ...item,
          sceneId,
          sceneName: scene.name,
          unlocked,
          rarity: 'common',
          rarityLabel: '普通物品',
          periodLabel: item.visiblePeriods ? item.visiblePeriods.map(p => periodLabels[p]).join(' / ') : '全天'
        })
      }
    }
  }

  try {
    const craftedList = storyStore.getAllCraftedItems()
    const chapterCraftedMap = { 1: [], 2: [], 3: ['memory_book', 'summer_locket'], 4: ['eternal_bouquet', 'lake_message', 'promise_ring'], 5: ['time_key'] }
    const chapterCraftedIds = chapterCraftedMap[selectedChapter.value] || []
    for (const craft of craftedList) {
      if (chapterCraftedIds.includes(craft.id)) {
        const unlocked = archiveStore.isCraftedItemEverObtained(craft.id)
        const recipe = storyStore.getRecipeByResultId(craft.id)
        const ingredients = []
        if (recipe) {
          for (const ingId of recipe.ingredients) {
            const ingItem = storyStore.getItemById(ingId)
            if (ingItem) ingredients.push(ingItem)
          }
        }
        allCraftedItems.push({
          ...craft,
          unlocked,
          rarityLabel: rarityLabels[craft.rarity] || '稀有',
          ingredients
        })
      }
    }
  } catch (e) {}

  try {
    if (storyStore.getAllHiddenItems) {
      const hiddenList = storyStore.getAllHiddenItems()
      const chapterHiddenMap = { 1: ['hi_ticket_stub'], 2: ['hi_photo_back'], 3: ['hi_locked_diary_page', 'hi_tree_initial'], 4: ['hi_bottle_second'], 5: [] }
      const chapterHiddenIds = chapterHiddenMap[selectedChapter.value] || []
      for (const hi of hiddenList) {
        if (chapterHiddenIds.includes(hi.id)) {
          allHiddenItems.push({
            ...hi,
            unlocked: archiveStore.isHiddenItemEverFound(hi.id),
            rarityLabel: rarityLabels[hi.rarity] || '稀有'
          })
        }
      }
    }
  } catch (e) {}

  return { found: allSceneItems, crafted: allCraftedItems, hidden: allHiddenItems }
})

function getSubtabTotal(subtabId) { return (chapterItems.value[subtabId] || []).length }
function getSubtabUnlocked(subtabId) { return (chapterItems.value[subtabId] || []).filter(i => i.unlocked).length }
function showItemDetail(item) { detailModal.value = { type: 'item', data: item } }
function showCraftedDetail(item) { detailModal.value = { type: 'crafted', data: item } }
function showHiddenItemDetail(item) { detailModal.value = { type: 'hiddenItem', data: item } }

const filteredTimelineMemories = computed(() => {
  const scenes = chapterSceneMap[selectedChapter.value] || []
  const sceneItemIds = []
  for (const sceneId of scenes) {
    const scene = storyStore.getSceneById(sceneId)
    if (scene && scene.items) for (const item of scene.items) sceneItemIds.push(item.id)
  }

  let normalMemories = []
  try {
    normalMemories = storyStore.getAllMemories()
      .filter(m => sceneItemIds.includes(m.triggerItemId))
      .map(m => ({ ...m, isHidden: false, unlocked: archiveStore.isMemoryEverTriggered(m.id) }))
  } catch (e) {}

  let filteredHM = []
  try {
    const hiddenMemoriesList = storyStore.getAllHiddenMemories()
    const chapterHmMap = { 1: [], 2: [], 3: ['hm4'], 4: ['hm5', 'hm6', 'hm2'], 5: ['hm1', 'hm3'] }
    const chapterHmIds = chapterHmMap[selectedChapter.value] || []
    filteredHM = hiddenMemoriesList
      .filter(hm => chapterHmIds.includes(hm.id))
      .map(hm => ({ ...hm, isHidden: true, unlocked: archiveStore.isHiddenMemoryEverUnlocked(hm.id) }))
  } catch (e) {}

  const all = [...normalMemories, ...filteredHM]
  if (timelineFilter.value === 'normal') return all.filter(m => !m.isHidden)
  if (timelineFilter.value === 'hidden') return all.filter(m => m.isHidden)
  return all
})

function openMemoryDetail(memory) { detailModal.value = { type: 'memory', data: memory } }

const characterDefinitions = [
  { id: 'lover', name: '她（玫瑰花）', avatar: '👩', relation: '挚爱 · 五年未见的恋人', quote: '如果你开口挽留，我会留下来。', depthLevel: 1, chapterStart: 1 },
  { id: 'friend', name: '老陈', avatar: '👨', relation: '挚友 · 一直暗中帮你们传话', quote: '她每年都回来看那棵树，一年不差。', depthLevel: 1, chapterStart: 3 },
  { id: 'owner', name: '咖啡馆老板娘', avatar: '👵', relation: '长辈 · 看着你们从相识到相知', quote: '那个靠窗的位置，我一直给你们留着。', depthLevel: 1, chapterStart: 2 },
  { id: 'clerk', name: '书店店员小林', avatar: '👧', relation: '后辈 · 她当年的学妹', quote: '学姐经常提到你，说你是她的小王子。', depthLevel: 1, chapterStart: 3 },
  { id: 'young', name: '年少的自己', avatar: '🧑', relation: '镜中人 · 七年前的那个盛夏', quote: '树会长大的，我们的爱情也会长大。', depthLevel: 1, chapterStart: 4 }
]

const chapterCharacters = computed(() => {
  const chars = characterDefinitions.filter(c => c.chapterStart <= selectedChapter.value)
  const memoryProgress = archiveStore.everTriggeredMemories.length
  const hiddenProgress = archiveStore.everUnlockedHiddenMemories.length

  return chars.map(c => {
    let depth = c.depthLevel
    if (memoryProgress >= 3) depth++
    if (memoryProgress >= 8) depth++
    if (hiddenProgress >= 1) depth++
    if (hiddenProgress >= 3) depth++
    depth = Math.min(5, depth)

    const unlocked = isChapterUnlocked(c.chapterStart) && memoryProgress >= (c.chapterStart * 2 - 1)
    if (unlocked) archiveStore.recordCharacterRelation({ id: c.id, name: c.name })

    let relatedMemories = []
    try {
      relatedMemories = storyStore.getAllMemories().slice(0, 3 + c.chapterStart).map(m => ({ id: m.id, year: m.year, title: m.title }))
    } catch (e) {}

    return { ...c, depthLevel: depth, unlocked: archiveStore.isCharacterRelationUnlocked(c.id) || unlocked, relatedMemories }
  })
})

function openCharacterDetail(char) { detailModal.value = { type: 'character', data: char } }
function getDepthLabel(level) {
  const labels = ['初识', '相识', '相知', '情深', '羁绊']
  return labels[Math.min(level - 1, 4)] || '初识'
}

const allEndingsList = computed(() => {
  const keyedEndings = [
    { key: 'legendary', type: 'legendary', title: '时光尽头的真爱', emoji: '👑', subtitle: '✦ 传说级结局 · 完美重逢 ✦', badge: '传说结局' },
    { key: 'epic', type: 'epic', title: '补全的记忆拼图', emoji: '🏆', subtitle: '✧ 史诗级结局 · 完整回忆 ✧', badge: '史诗结局' },
    { key: 'special1', type: 'special', title: '命运的第二次机会', emoji: '💫', subtitle: '✦ 特殊结局 · 命运回响 ✦', badge: '特殊结局' },
    { key: 'special2', type: 'special', title: '迟到的告白', emoji: '💝', subtitle: '✦ 特殊结局 · 真诚之心 ✦', badge: '特殊结局' },
    { key: 'perfect', type: 'perfect', title: '旧时光里的重逢', emoji: '🌟', badge: '完美结局' },
    { key: 'good1', type: 'good', title: '释然的告别与新生', emoji: '🥰', badge: '良好结局' },
    { key: 'good2', type: 'good', title: '温暖的邂逅', emoji: '😊', badge: '良好结局' },
    { key: 'normal', type: 'normal', title: '雾中的遗憾', emoji: '💭', badge: '普通结局' }
  ]

  return keyedEndings.map(e => {
    const found = archiveStore.unlockedEndings.find(u => {
      if (e.key === 'legendary') return u.type === 'legendary'
      if (e.key === 'epic') return u.type === 'epic'
      if (e.key === 'special1') return (u.title && u.title.includes('第二次')) || (u.type === 'special' && u.title && u.title.includes('命运'))
      if (e.key === 'special2') return (u.title && u.title.includes('迟到')) || (u.title && u.title.includes('告白'))
      if (e.key === 'perfect') return u.type === 'perfect'
      if (e.key === 'good1') return (u.title && u.title.includes('释然')) || (u.title && u.title.includes('告别'))
      if (e.key === 'good2') return (u.title && u.title.includes('邂逅')) || (u.title && u.title.includes('温暖'))
      if (e.key === 'normal') return u.type === 'normal'
      return false
    })

    const playbackCount = found ? archiveStore.viewedEndingPlaybacks.filter(v => v === e.key).length : 0
    let descriptionParagraphs = []
    if (found && found.description) descriptionParagraphs = found.description.split('\n').filter(p => p.trim())

    return {
      ...e,
      unlocked: !!found,
      description: found ? found.description : '',
      descriptionParagraphs,
      timestamp: found ? found.timestamp : null,
      playbackCount
    }
  })
})

const legendaryCount = computed(() => allEndingsList.value.filter(e => e.type === 'legendary' && e.unlocked).length)
const epicCount = computed(() => allEndingsList.value.filter(e => e.type === 'epic' && e.unlocked).length)
const specialCount = computed(() => allEndingsList.value.filter(e => e.type === 'special' && e.unlocked).length)
const otherEndingCount = computed(() => allEndingsList.value.filter(e => ['perfect', 'good', 'normal'].includes(e.type) && e.unlocked).length)

function getEndingUnlockHint(type) {
  const hints = {
    legendary: '解锁条件：合成时光钥匙与承诺之戒，并在最终抉择中冲上去拥抱她',
    epic: '解锁条件：合成回忆之书与盛夏相片盒，补全大部分回忆碎片',
    special: '解锁条件：合成湖水信笺，并在湖畔对她微笑说好久不见',
    perfect: '解锁条件：珍藏那封未寄出的信，保持较高的心绪值',
    good: '解锁条件：在关键抉择中选择释然或重新认识彼此',
    normal: '解锁条件：部分探索即可达成，但或许...还有更好的结局'
  }
  return hints[type] || '继续探索游戏的不同分支和选择'
}

function playbackEnding(ending) {
  archiveStore.recordEndingPlayback(ending.key)
  const updated = { ...ending, playbackCount: ending.playbackCount + 1 }
  detailModal.value = { type: 'ending', data: updated }
}

function getEmojiForEmotion(emotion) {
  const emotions = { sad: '😢', warm: '🥰', pensive: '🤔', happy: '😊', sweet: '🍬', nervous: '😰', bittersweet: '😌', shocking: '😲', romantic: '💕', regret: '💔', melancholy: '🌧️', touched: '🥹', determined: '💪' }
  return emotions[emotion] || '💭'
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const detailModalClass = computed(() => {
  if (!detailModal.value) return ''
  const type = detailModal.value.type
  const data = detailModal.value.data
  const classes = [type + '-detail']
  if (data && data.rarity) classes.push('rarity-' + data.rarity)
  if (data && data.type) classes.push('ending-type-' + data.type)
  if (data && data.isHidden) classes.push('is-hidden')
  return classes.join(' ')
})

watch(showModal, val => {
  if (val) {
    activeSection.value = 'items'
    selectedChapter.value = 1
    detailModal.value = null
  }
})

function handleClose() { gameStore.closeMemoryArchive() }
</script>

<style scoped>
.memory-archive-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(5, 5, 20, 0.95);
  backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  z-index: 4500;
  padding: 10px;
}

.memory-archive-panel {
  background: linear-gradient(145deg, rgba(15, 15, 35, 0.98), rgba(10, 10, 25, 0.99));
  border-radius: 24px;
  width: 100%; max-width: 900px; max-height: 92vh;
  display: flex; flex-direction: column;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7), 0 0 50px rgba(212, 165, 116, 0.1);
  overflow: hidden;
}

.archive-header {
  padding: 1.2rem 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(120deg, rgba(212, 165, 116, 0.12), rgba(100, 80, 60, 0.05), transparent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left { display: flex; align-items: center; gap: 0.9rem; }
.archive-title-icon {
  font-size: 2.4rem;
  animation: float-icon 3s ease-in-out infinite;
  filter: drop-shadow(0 0 12px rgba(212, 165, 116, 0.5));
}
@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.archive-main-title {
  margin: 0;
  font-size: clamp(1.15rem, 2.5vw, 1.4rem);
  background: linear-gradient(135deg, #d4a574, #f0d090, #d4a574);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: 0.08rem;
}

.archive-subtitle {
  margin: 0.2rem 0 0 0;
  font-size: 0.78rem;
  color: #807060;
  letter-spacing: 0.05rem;
}

.header-right { display: flex; align-items: center; gap: 0.8rem; }
.completion-badge {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(212, 165, 116, 0.08));
  border: 1px solid rgba(212, 165, 116, 0.35);
  padding: 0.35rem 0.8rem;
  border-radius: 16px;
  display: flex; align-items: center; gap: 0.4rem;
}
.badge-label { font-size: 0.72rem; color: #a08870; }
.badge-value { font-size: 0.95rem; font-weight: 700; color: #f0d090; }

.close-icon-btn {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #b0b0c0;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.close-icon-btn:hover {
  background: rgba(255, 100, 100, 0.18);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff9090;
  transform: rotate(90deg);
}

.chapter-navbar {
  padding: 0.8rem 1.2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.chapter-nav-label {
  font-size: 0.72rem;
  color: #707080;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05rem;
}
.chapter-nav-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;
}
.chapter-nav-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  color: #606070;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.chapter-nav-btn.locked { opacity: 0.5; cursor: not-allowed; }
.chapter-nav-btn.unlocked:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(212, 165, 116, 0.3);
  color: #b0a090;
}
.chapter-nav-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.45), rgba(212, 165, 116, 0.2));
  border-color: rgba(212, 165, 116, 0.6);
  color: #fff8e0;
  box-shadow: 0 4px 16px rgba(212, 165, 116, 0.25);
}
.chapter-nav-num {
  width: 22px; height: 22px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  font-size: 0.72rem; font-weight: 700;
}
.chapter-nav-btn.active .chapter-nav-num { background: rgba(255, 255, 255, 0.2); }

.section-tabs {
  display: flex;
  padding: 0.7rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}
.section-tab-btn {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border: none;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  color: #808090;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.section-tab-btn:hover { background: rgba(255, 255, 255, 0.07); color: #c0c0d0; }
.section-tab-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(180, 140, 100, 0.3));
  color: #fff5dc;
  box-shadow: 0 3px 14px rgba(212, 165, 116, 0.28);
}
.tab-count {
  font-size: 0.72rem;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  color: #d4c0a0;
}

.archive-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
}
.section-content { animation: fadeInUp 0.4s ease; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.chapter-locked-state {
  text-align: center;
  padding: 4rem 1.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
}
.lock-icon {
  font-size: 4rem;
  opacity: 0.4;
  animation: pulse-lock 2s ease-in-out infinite;
}
@keyframes pulse-lock {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.08); opacity: 0.6; }
}
.lock-title { margin: 0; font-size: 1.3rem; color: #9090a0; font-weight: 500; }
.lock-hint { margin: 0; font-size: 0.85rem; color: #707080; max-width: 400px; line-height: 1.7; }

.section-header { margin-bottom: 1.2rem; }
.section-title { margin: 0 0 0.3rem 0; font-size: 1.15rem; color: #e8d5a8; font-weight: 500; }
.section-desc { margin: 0; font-size: 0.82rem; color: #808090; }

.items-subtabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.items-subtab-btn {
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  color: #808090;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.items-subtab-btn:hover { background: rgba(255, 255, 255, 0.06); color: #b0b0c0; }
.items-subtab-btn.active {
  background: linear-gradient(135deg, rgba(100, 150, 220, 0.3), rgba(80, 120, 200, 0.18));
  border-color: rgba(100, 150, 220, 0.5);
  color: #c0d8ff;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
}
.item-card {
  position: relative;
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.9rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}
.item-card:not(.unlocked) { opacity: 0.55; cursor: default; }
.item-card.unlocked:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(212, 165, 116, 0.35);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.item-card.legendary.unlocked {
  border-color: rgba(255, 215, 0, 0.35);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 200, 50, 0.03));
}
.item-card.epic.unlocked {
  border-color: rgba(192, 132, 252, 0.35);
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.07), rgba(160, 100, 220, 0.03));
}
.item-card.rare.unlocked {
  border-color: rgba(96, 165, 250, 0.3);
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.06), rgba(70, 130, 220, 0.02));
}

.item-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.18), rgba(180, 140, 100, 0.08));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.crafted-icon {
  background: linear-gradient(135deg, rgba(255, 200, 100, 0.25), rgba(255, 150, 50, 0.12));
  animation: crafted-glow 3s ease-in-out infinite;
}
@keyframes crafted-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 200, 100, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 200, 100, 0.4); }
}
.hidden-icon {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.22), rgba(220, 150, 20, 0.1));
}
.item-icon { font-size: 1.8rem; }
.item-info { flex: 1; min-width: 0; }
.item-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.92rem;
  color: #c8c8d8;
  font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.crafted-name {
  background: linear-gradient(135deg, #ffd080, #ffb060);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hidden-name {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.item-hint {
  margin: 0;
  font-size: 0.72rem;
  color: #707080;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lock-overlay {
  position: absolute;
  top: 0.5rem; right: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.empty-mini-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  opacity: 0.5;
}
.empty-mini-state span { font-size: 2.5rem; display: block; margin-bottom: 0.6rem; }
.empty-mini-state p { margin: 0; font-size: 0.85rem; color: #707080; }

.timeline-filter {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}
.timeline-filter-btn {
  padding: 0.4rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  color: #808090;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.timeline-filter-btn:hover { background: rgba(255, 255, 255, 0.06); color: #b0b0c0; }
.timeline-filter-btn.active {
  background: linear-gradient(135deg, rgba(200, 120, 200, 0.3), rgba(160, 80, 180, 0.18));
  border-color: rgba(200, 120, 200, 0.5);
  color: #f0d0ff;
}

.timeline-container {
  position: relative;
  padding: 1rem 0.5rem;
}
.timeline-line {
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(212, 165, 116, 0.35), rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.35), transparent);
  transform: translateX(-50%);
}
.timeline-node {
  position: relative;
  width: 50%;
  padding: 0.8rem 1.5rem;
  box-sizing: border-box;
}
.timeline-node.left { left: 0; padding-right: 2rem; }
.timeline-node.right { left: 50%; padding-left: 2rem; }
.timeline-dot {
  position: absolute;
  top: 1.5rem;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(15, 15, 35, 0.98);
  border: 2px solid rgba(212, 165, 116, 0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.timeline-node.left .timeline-dot { right: -16px; }
.timeline-node.right .timeline-dot { left: -16px; }
.timeline-node.unlocked .timeline-dot {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.35), rgba(180, 140, 100, 0.2));
  box-shadow: 0 0 12px rgba(212, 165, 116, 0.4);
}
.timeline-node.hidden-memory.unlocked .timeline-dot {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.45), rgba(255, 180, 50, 0.25));
  border-color: rgba(255, 215, 0, 0.7);
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
}
.timeline-card {
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}
.timeline-node:not(.unlocked) .timeline-card {
  opacity: 0.5;
  cursor: default;
}
.timeline-node.unlocked .timeline-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(212, 165, 116, 0.3);
  transform: translateY(-2px);
}
.timeline-node.hidden-memory.unlocked .timeline-card {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.06), rgba(255, 200, 50, 0.02));
  border-color: rgba(255, 215, 0, 0.25);
}
.timeline-year {
  font-size: 0.7rem;
  color: #a08870;
  margin-bottom: 0.3rem;
  letter-spacing: 0.05rem;
}
.timeline-title {
  margin: 0 0 0.35rem 0;
  font-size: 0.92rem;
  color: #d8d8e8;
  font-weight: 500;
}
.timeline-node:not(.unlocked) .timeline-title {
  color: #707080;
}
.timeline-preview {
  margin: 0;
  font-size: 0.75rem;
  color: #808090;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.timeline-hidden-badge {
  margin-top: 0.5rem;
  display: inline-block;
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 180, 50, 0.12));
  color: #ffd880;
}
.empty-timeline {
  text-align: center;
  padding: 2.5rem;
  opacity: 0.5;
}
.empty-timeline-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.7rem;
}
.empty-timeline p {
  margin: 0;
  color: #808090;
  font-size: 0.85rem;
}

.character-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.character-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.35s ease;
  cursor: pointer;
  overflow: hidden;
}
.character-card:not(.unlocked) {
  opacity: 0.5;
  cursor: default;
}
.character-card.unlocked:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(212, 165, 116, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.character-card.deep.unlocked {
  background: linear-gradient(135deg, rgba(255, 120, 180, 0.08), rgba(255, 100, 150, 0.03));
  border-color: rgba(255, 120, 180, 0.3);
}
.character-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(180, 140, 100, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-emoji {
  font-size: 2rem;
}
.relation-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 150, 180, calc(0.2 + var(--depth, 1) * 0.12));
  animation: ring-rotate 20s linear infinite;
}
@keyframes ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.character-info {
  flex: 1;
  min-width: 0;
}
.character-name {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  color: #e0e0f0;
  font-weight: 500;
}
.character-card:not(.unlocked) .character-name {
  color: #707080;
}
.character-relation {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: #c09878;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.depth-bar {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  margin-bottom: 0.35rem;
}
.depth-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff78b4, #ffa8c8);
  border-radius: 3px;
  transition: width 0.6s ease;
}
.depth-label {
  margin: 0;
  font-size: 0.68rem;
  color: #807080;
}
.char-lock {
  position: absolute;
  top: 0.7rem;
  right: 0.9rem;
  font-size: 0.9rem;
  opacity: 0.5;
}

.endings-filter-bar {
  margin-bottom: 1.2rem;
}
.endings-overview {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.overview-item {
  flex: 1;
  min-width: 100px;
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.legendary-ov {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 200, 50, 0.02));
  border-color: rgba(255, 215, 0, 0.2);
}
.epic-ov {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.08), rgba(160, 100, 220, 0.02));
  border-color: rgba(192, 132, 252, 0.2);
}
.special-ov {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.08), rgba(70, 130, 220, 0.02));
  border-color: rgba(96, 165, 250, 0.2);
}
.ov-icon { font-size: 1.2rem; }
.ov-label { font-size: 0.72rem; color: #808090; }
.ov-val {
  margin-left: auto;
  font-size: 1.15rem;
  font-weight: 700;
  color: #d8d8e8;
}
.legendary-ov .ov-val { color: #ffd880; }
.epic-ov .ov-val { color: #d8a8ff; }
.special-ov .ov-val { color: #8ac4ff; }

.endings-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.ending-playback-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}
.ending-playback-card:not(.unlocked) {
  opacity: 0.55;
}
.ending-playback-card.unlocked {
  background: rgba(255, 255, 255, 0.035);
}
.ending-playback-card.legendary.unlocked {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.07), rgba(255, 200, 50, 0.02));
  border-color: rgba(255, 215, 0, 0.28);
}
.ending-playback-card.epic.unlocked {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.07), rgba(160, 100, 220, 0.02));
  border-color: rgba(192, 132, 252, 0.28);
}
.ending-playback-card.special.unlocked {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.06), rgba(70, 130, 220, 0.02));
  border-color: rgba(96, 165, 250, 0.25);
}
.ending-left { flex-shrink: 0; }
.ending-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  display: flex;
  align-items: center;
  justify-content: center;
}
.ending-icon-box.legendary {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.22), rgba(255, 180, 50, 0.1));
}
.ending-icon-box.epic {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.22), rgba(160, 100, 220, 0.1));
}
.ending-icon-box.special {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(70, 130, 220, 0.1));
}
.ending-icon-lg { font-size: 2rem; }
.ending-center {
  flex: 1;
  min-width: 0;
}
.ending-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #707080;
  font-weight: 500;
}
.ending-name.unlocked {
  color: #e8e8f0;
}
.ending-playback-card.legendary .ending-name.unlocked {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ending-playback-card.epic .ending-name.unlocked {
  background: linear-gradient(135deg, #c084fc, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ending-subtitle {
  margin: 0 0 0.35rem 0;
  font-size: 0.75rem;
  color: #c09878;
}
.ending-unlock-hint {
  margin: 0 0 0.35rem 0;
  font-size: 0.75rem;
  color: #707080;
  font-style: italic;
  line-height: 1.5;
}
.ending-desc-preview {
  margin: 0;
  font-size: 0.72rem;
  color: #808090;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ending-meta {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.ending-meta span {
  font-size: 0.68rem;
  color: #707080;
}
.playback-count {
  padding: 0.05rem 0.45rem;
  border-radius: 8px;
  background: rgba(212, 165, 116, 0.12);
  color: #d4a574 !important;
}
.ending-right { flex-shrink: 0; margin-left: 0.5rem; }
.playback-btn {
  padding: 0.55rem 1.2rem;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}
.playback-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 18px rgba(102, 126, 234, 0.4);
}
.playback-btn.legendary {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a00;
}
.playback-btn.legendary:hover { box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5); }
.playback-btn.epic {
  background: linear-gradient(135deg, #c084fc, #7c3aed);
}
.playback-btn.epic:hover { box-shadow: 0 5px 20px rgba(192, 132, 252, 0.45); }
.playback-btn.special {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}
.playback-btn.special:hover { box-shadow: 0 5px 20px rgba(96, 165, 250, 0.45); }
.locked-badge {
  display: inline-block;
  padding: 0.45rem 0.9rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: #707080;
  font-size: 0.75rem;
}

.detail-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(8px);
  z-index: 4600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.detail-modal-card {
  position: relative;
  background: linear-gradient(145deg, rgba(25, 25, 50, 0.99), rgba(15, 15, 35, 0.995));
  border-radius: 22px;
  padding: 2rem;
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  animation: modal-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
.detail-modal-card.is-hidden {
  background: linear-gradient(145deg, rgba(50, 40, 15, 0.99), rgba(35, 25, 5, 0.995));
  border: 2px solid rgba(255, 215, 0, 0.35);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.15);
}
.detail-close-btn {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #a0a0b0;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.detail-close-btn:hover {
  background: rgba(255, 100, 100, 0.18);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff9090;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.character-detail-header {
  align-items: flex-start;
}
.detail-big-icon {
  font-size: 3rem;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.22), rgba(180, 140, 100, 0.1));
}
.crafted-big {
  background: linear-gradient(135deg, rgba(255, 200, 100, 0.3), rgba(255, 150, 50, 0.15));
}
.hidden-big {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.28), rgba(220, 150, 20, 0.13));
}
.detail-header > div { flex: 1; min-width: 0; }
.detail-rarity-badge {
  display: inline-block;
  font-size: 0.7rem;
  padding: 0.15rem 0.6rem;
  border-radius: 10px;
  margin-bottom: 0.3rem;
}
.detail-rarity-badge.legendary {
  background: rgba(255, 215, 0, 0.18);
  color: #ffd700;
}
.detail-rarity-badge.epic {
  background: rgba(192, 132, 252, 0.18);
  color: #c084fc;
}
.detail-rarity-badge.rare {
  background: rgba(96, 165, 250, 0.18);
  color: #60a5fa;
}
.detail-title {
  margin: 0 0 0.2rem 0;
  font-size: 1.35rem;
  color: #e8e8f8;
  font-weight: 500;
}
.crafted-detail-title {
  background: linear-gradient(135deg, #ffd080, #ffb060);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hidden-detail-title {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hidden-memory-title {
  background: linear-gradient(135deg, #ffd700, #ffec8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.character-detail-title {
  color: #ffd0e4;
}
.detail-subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: #808090;
}
.detail-year-tag {
  display: inline-block;
  font-size: 0.72rem;
  padding: 0.15rem 0.55rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #a09080;
  margin-bottom: 0.3rem;
}
.detail-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent);
  margin-bottom: 1.3rem;
}
.crafted-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 180, 80, 0.45), transparent);
}
.hidden-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.5), transparent);
  height: 3px;
}
.character-divider {
  background: linear-gradient(90deg, transparent, rgba(255, 120, 180, 0.4), transparent);
}
.ending-divider {
  background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.4), transparent);
}
.detail-description {
  color: #c8c8d8;
  line-height: 1.85;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}
.crafted-desc {
  color: #e8d8c0;
  font-style: italic;
}
.hidden-desc {
  color: #f0e0b8;
  font-style: italic;
}
.detail-memory-content {
  color: #c0c0d0;
  line-height: 2;
  font-size: 0.92rem;
  text-indent: 2em;
  text-align: justify;
}
.hidden-memory-content {
  color: #f0e0b8;
  font-style: italic;
}
.detail-meta-row {
  display: flex;
  gap: 0.8rem;
  font-size: 0.78rem;
  color: #808090;
  flex-wrap: wrap;
}
.detail-banner {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.45rem 1.3rem;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a00;
  font-weight: 600;
  border-radius: 18px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.45);
  white-space: nowrap;
}
.banner-star {
  animation: twinkle 1.5s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.recipe-box {
  margin-top: 1.1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 180, 80, 0.18);
}
.recipe-label {
  font-size: 0.78rem;
  color: #c08860;
  margin-bottom: 0.6rem;
}
.recipe-ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ingredient-tag {
  padding: 0.35rem 0.75rem;
  border-radius: 14px;
  background: rgba(255, 180, 80, 0.12);
  color: #ffc88a;
  font-size: 0.8rem;
}
.unlock-condition-box {
  margin-top: 1.1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 215, 0, 0.18);
}
.condition-label {
  font-size: 0.78rem;
  color: #d4a540;
  margin-bottom: 0.5rem;
}
.condition-text {
  margin: 0;
  font-size: 0.85rem;
  color: #e8d898;
  line-height: 1.7;
}

.character-avatar-lg {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 120, 180, 0.25), rgba(255, 100, 150, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.character-avatar-lg > span {
  font-size: 2.5rem;
}
.character-relation-lg {
  margin: 0.1rem 0 0.7rem 0;
  font-size: 0.85rem;
  color: #d49bb4;
}
.character-depth-bar-lg {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  margin-bottom: 0.4rem;
}
.depth-fill-lg {
  height: 100%;
  background: linear-gradient(90deg, #ff78b4, #ffa8c8, #ffd0e0);
  border-radius: 4px;
  transition: width 0.8s ease;
}
.depth-text-lg {
  font-size: 0.78rem;
  color: #d49bb4;
  font-weight: 500;
}
.character-memories-list {
  margin-top: 1.2rem;
}
.cm-label {
  font-size: 0.78rem;
  color: #a08090;
  margin-bottom: 0.6rem;
}
.cm-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  margin-bottom: 0.4rem;
}
.cm-year {
  font-size: 0.72rem;
  color: #c09878;
  padding: 0.1rem 0.45rem;
  border-radius: 8px;
  background: rgba(212, 165, 116, 0.12);
  flex-shrink: 0;
}
.cm-title {
  font-size: 0.82rem;
  color: #b0b0c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.character-quote {
  position: relative;
  margin-top: 1.3rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 120, 180, 0.08), rgba(255, 100, 150, 0.03));
  border-radius: 14px;
  border-left: 3px solid rgba(255, 120, 180, 0.5);
}
.quote-mark {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 120, 180, 0.25);
  font-family: Georgia, serif;
  line-height: 1;
}
.quote-mark:not(.right) {
  top: 0.3rem;
  left: 0.5rem;
}
.quote-mark.right {
  bottom: -0.3rem;
  right: 0.6rem;
}
.quote-text {
  margin: 0;
  font-size: 0.92rem;
  color: #f0d4e0;
  line-height: 1.8;
  font-style: italic;
  text-indent: 0.5em;
}

.ending-playback-header {
  text-align: center;
  padding-top: 0.5rem;
  margin-bottom: 1rem;
}
.epb-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(180, 140, 100, 0.1));
  color: #d4a574;
  border-radius: 14px;
  font-size: 0.78rem;
  margin-bottom: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.ending-playback-header.legendary .epb-badge {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.22), rgba(255, 180, 50, 0.1));
  color: #ffd880;
}
.ending-playback-header.epic .epb-badge {
  background: linear-gradient(135deg, rgba(192, 132, 252, 0.22), rgba(160, 100, 220, 0.1));
  color: #d8a8ff;
}
.ending-playback-header.special .epb-badge {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.22), rgba(70, 130, 220, 0.1));
  color: #8ac4ff;
}
.epb-icon {
  display: block;
  font-size: 3.2rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 15px rgba(212, 165, 116, 0.4));
}
.ending-playback-header.legendary .epb-icon {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.55));
}
.ending-playback-header.epic .epb-icon {
  filter: drop-shadow(0 0 18px rgba(192, 132, 252, 0.55));
}
.ending-playback-header.special .epb-icon {
  filter: drop-shadow(0 0 18px rgba(96, 165, 250, 0.55));
}
.epb-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #e8e8f8;
}
.epb-title.legendary {
  background: linear-gradient(135deg, #ffd700, #fff0a0, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.epb-title.epic {
  background: linear-gradient(135deg, #c084fc, #e0b0ff, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.epb-title.special {
  background: linear-gradient(135deg, #60a5fa, #a0c8ff, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.ending-playback-content {
  padding: 0.5rem 0.5rem 0 0.5rem;
}
.epb-para {
  margin: 0 0 1rem 0;
  color: #d0d0e0;
  line-height: 2;
  font-size: 0.92rem;
  text-indent: 2em;
  text-align: justify;
}
.ending-stats-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.3rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.es-item {
  flex: 1;
  padding: 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  text-align: center;
}
.es-label {
  display: block;
  font-size: 0.7rem;
  color: #707080;
  margin-bottom: 0.2rem;
}
.es-value {
  font-size: 0.88rem;
  color: #d4a574;
  font-weight: 500;
}

@media (max-width: 700px) {
  .archive-header { padding: 1rem; flex-wrap: wrap; gap: 0.8rem; }
  .archive-title-icon { font-size: 1.8rem; }
  .header-right { width: 100%; justify-content: space-between; }
  .chapter-navbar { padding: 0.6rem 0.8rem; }
  .section-tabs { padding: 0.5rem 0.7rem; }
  .section-tab-btn { padding: 0.45rem 0.8rem; font-size: 0.78rem; }
  .archive-content-area { padding: 0.9rem; }
  .timeline-line { left: 20px; }
  .timeline-node { width: 100%; left: 0 !important; padding: 0.7rem 0 0.7rem 3rem !important; }
  .timeline-node .timeline-dot { left: 4px !important; right: auto !important; }
  .character-cards-grid { grid-template-columns: 1fr; }
  .endings-overview { gap: 0.5rem; }
  .overview-item { min-width: 80px; padding: 0.55rem 0.7rem; }
  .ending-playback-card { flex-wrap: wrap; gap: 0.7rem; }
  .ending-right { width: 100%; display: flex; justify-content: flex-end; }
  .detail-modal-card { padding: 1.5rem 1.2rem; }
  .detail-header { gap: 0.8rem; }
  .detail-big-icon { width: 56px; height: 56px; font-size: 2.2rem; border-radius: 14px; }
  .detail-title { font-size: 1.15rem; }
  .character-avatar-lg { width: 64px; height: 64px; }
  .character-avatar-lg > span { font-size: 2rem; }
  .epb-title { font-size: 1.2rem; }
  .epb-icon { font-size: 2.5rem; }
}
</style>