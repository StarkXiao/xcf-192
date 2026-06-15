<template>
  <Transition name="fade">
    <div v-if="showModal" class="journal-editor-overlay" @click.self="handleClose">
      <div class="journal-editor-container">
        <div class="editor-header">
          <div class="header-left">
            <span class="editor-title-icon">📔</span>
            <div>
              <h2 class="editor-main-title">雾城手账编辑器</h2>
              <p class="editor-subtitle">整理你的回忆，创造专属记忆册</p>
            </div>
          </div>
          <div class="header-right">
            <div class="editor-stats">
              <span class="stat-item">📦 {{ stats.totalItems }} 件旧物</span>
              <span class="stat-item">💭 {{ stats.totalMemories }} 段回忆</span>
            </div>
            <button class="close-icon-btn" @click="handleClose">✕</button>
          </div>
        </div>

        <div class="editor-navbar">
          <button
            v-for="tab in mainTabs"
            :key="tab.id"
            class="nav-tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <div class="editor-content-area">
          <div v-if="activeTab === 'items'" class="tab-content items-tab">
            <div class="tab-toolbar">
              <h3 class="tab-title">📦 旧物整理</h3>
              <div class="toolbar-actions">
                <select v-model="selectedCategoryFilter" class="category-select">
                  <option value="all">全部分类</option>
                  <option value="important">重要物品</option>
                  <option value="memory">回忆载体</option>
                  <option value="daily">日常点滴</option>
                  <option value="collection">珍藏收藏</option>
                  <option value="uncategorized">未分类</option>
                </select>
              </div>
            </div>

            <div class="items-organizer">
              <div class="items-list-panel">
                <h4 class="panel-subtitle">可整理的物品</h4>
                <div class="items-grid-small">
                  <div
                    v-for="item in filteredUnorganizedItems"
                    :key="item.id"
                    class="item-card-small"
                    :class="{ selected: selectedItemId === item.id }"
                    @click="selectItem(item)"
                  >
                    <span class="item-icon-sm">{{ item.icon }}</span>
                    <span class="item-name-sm">{{ item.name }}</span>
                  </div>
                </div>
                <div v-if="filteredUnorganizedItems.length === 0" class="empty-mini">
                  <span>🎉</span>
                  <p>所有物品都已整理完成！</p>
                </div>
              </div>

              <div class="item-detail-panel">
                <div v-if="selectedItem" class="item-detail-card">
                  <div class="detail-item-header">
                    <span class="detail-item-icon">{{ selectedItem.icon }}</span>
                    <div>
                      <h4 class="detail-item-name">{{ selectedItem.name }}</h4>
                      <p class="detail-item-location">📍 {{ selectedItem.sceneName }}</p>
                    </div>
                  </div>

                  <div class="detail-section">
                    <label class="detail-label">分类</label>
                    <div class="category-buttons">
                      <button
                        v-for="cat in categories"
                        :key="cat.id"
                        class="category-btn"
                        :class="{ active: selectedCategory === cat.id }"
                        @click="selectedCategory = cat.id"
                      >
                        {{ cat.icon }} {{ cat.name }}
                      </button>
                    </div>
                  </div>

                  <div class="detail-section">
                    <label class="detail-label">标签</label>
                    <div class="tags-input-area">
                      <div class="tags-display">
                        <span
                          v-for="tag in currentTags"
                          :key="tag"
                          class="tag-chip"
                        >
                          {{ tag }}
                          <button class="tag-remove" @click="removeTag(tag)">×</button>
                        </span>
                      </div>
                      <div class="tag-input-row">
                        <input
                          v-model="newTag"
                          type="text"
                          class="tag-input"
                          placeholder="输入标签后按回车添加..."
                          @keyup.enter="addTag"
                        />
                        <button class="add-tag-btn" @click="addTag">添加</button>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section">
                    <label class="detail-label">个人备注</label>
                    <textarea
                      v-model="currentNote"
                      class="note-textarea"
                      placeholder="写下你对这件物品的感受和回忆..."
                      rows="4"
                    ></textarea>
                  </div>

                  <div class="detail-actions">
                    <button class="save-btn" @click="saveItemOrganize">
                      💾 保存整理
                    </button>
                    <button v-if="currentOrganized" class="remove-btn" @click="removeItemOrganize">
                      🗑️ 移除整理
                    </button>
                  </div>
                </div>
                <div v-else class="empty-detail">
                  <span class="empty-icon-lg">✨</span>
                  <p>选择一件物品开始整理</p>
                </div>
              </div>

              <div class="organized-preview-panel">
                <h4 class="panel-subtitle">已整理的物品</h4>
                <div v-for="cat in categories" :key="cat.id" class="category-group">
                  <div v-if="getCategoryItems(cat.id).length > 0">
                    <h5 class="category-group-title">
                      {{ cat.icon }} {{ cat.name }} ({{ getCategoryItems(cat.id).length }})
                    </h5>
                    <div class="organized-items-row">
                      <div
                        v-for="item in getCategoryItems(cat.id)"
                        :key="item.id"
                        class="organized-item-chip"
                        @click="selectItem(item)"
                      >
                        <span>{{ item.icon }}</span>
                        <span class="chip-name">{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'dialogs'" class="tab-content dialogs-tab">
            <div class="tab-toolbar">
              <h3 class="tab-title">💬 对白摘录</h3>
              <div class="toolbar-actions">
                <button class="action-btn primary" @click="showAddExcerpt = true">
                  ✨ 添加摘录
                </button>
              </div>
            </div>

            <div class="dialogs-container">
              <div v-if="dialogExcerpts.length === 0" class="empty-state">
                <span class="empty-state-icon">💬</span>
                <h4 class="empty-state-title">还没有对白摘录</h4>
                <p class="empty-state-desc">从回忆中摘录打动你的对白，记录那些珍贵的瞬间</p>
                <button class="action-btn primary" @click="showAddExcerpt = true">
                  添加第一条摘录
                </button>
              </div>

              <div v-else class="excerpts-list">
                <div
                  v-for="excerpt in dialogExcerpts"
                  :key="excerpt.id"
                  class="excerpt-card"
                >
                  <div class="excerpt-header">
                    <span class="excerpt-memory-tag">📖 {{ excerpt.memoryTitle }}</span>
                    <span class="excerpt-character">{{ excerpt.character }}</span>
                  </div>
                  <p class="excerpt-text">"{{ excerpt.text }}"</p>
                  <p v-if="excerpt.note" class="excerpt-note">📝 {{ excerpt.note }}</p>
                  <div class="excerpt-footer">
                    <span class="excerpt-date">{{ formatDate(excerpt.createdAt) }}</span>
                    <div class="excerpt-actions">
                      <button class="excerpt-action-btn" @click="editExcerpt(excerpt)">✏️</button>
                      <button class="excerpt-action-btn danger" @click="deleteExcerpt(excerpt.id)">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Transition name="slide-up">
              <div v-if="showAddExcerpt" class="excerpt-modal-overlay" @click.self="showAddExcerpt = false">
                <div class="excerpt-modal">
                  <h3 class="modal-title">{{ editingExcerpt ? '编辑摘录' : '添加对白摘录' }}</h3>
                  
                  <div class="form-group">
                    <label class="form-label">选择回忆</label>
                    <select v-model="excerptForm.memoryId" class="form-select">
                      <option value="">请选择回忆...</option>
                      <option v-for="m in unlockedMemories" :key="m.id" :value="m.id">
                        {{ m.year }} - {{ m.title }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">说话人</label>
                    <input
                      v-model="excerptForm.character"
                      type="text"
                      class="form-input"
                      placeholder="例如：她、站长、咖啡馆老板..."
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">对白内容</label>
                    <textarea
                      v-model="excerptForm.text"
                      class="form-textarea"
                      placeholder="输入打动你的对白..."
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label class="form-label">个人感受（可选）</label>
                    <textarea
                      v-model="excerptForm.note"
                      class="form-textarea"
                      placeholder="写下你对这段对白的感受..."
                      rows="2"
                    ></textarea>
                  </div>

                  <div class="modal-actions">
                    <button class="modal-btn cancel" @click="showAddExcerpt = false">取消</button>
                    <button class="modal-btn confirm" @click="saveExcerpt">
                      {{ editingExcerpt ? '保存修改' : '添加摘录' }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div v-else-if="activeTab === 'collage'" class="tab-content collage-tab">
            <div class="tab-toolbar">
              <h3 class="tab-title">🖼️ 照片拼贴</h3>
              <div class="toolbar-actions">
                <select v-model="selectedCollageId" class="collage-select" @change="loadCollage">
                  <option value="">选择拼贴...</option>
                  <option v-for="c in photoCollages" :key="c.id" :value="c.id">
                    {{ c.title }}
                  </option>
                </select>
                <button class="action-btn primary" @click="createNewCollage">
                  ➕ 新建拼贴
                </button>
              </div>
            </div>

            <div class="collage-workspace">
              <div class="collage-items-panel">
                <h4 class="panel-subtitle">可用物品</h4>
                <div class="collage-items-grid">
                  <div
                    v-for="item in unlockedItems"
                    :key="item.id"
                    class="collage-item-source"
                    draggable="true"
                    @dragstart="startDrag($event, item)"
                  >
                    <span class="collage-item-icon">{{ item.icon }}</span>
                    <span class="collage-item-name">{{ item.name }}</span>
                  </div>
                </div>
              </div>

              <div class="collage-canvas-container">
                <div v-if="currentCollage" class="collage-controls">
                  <input
                    v-model="currentCollage.title"
                    type="text"
                    class="collage-title-input"
                    placeholder="拼贴标题..."
                    @change="updateCollageTitle"
                  />
                  <div class="layout-buttons">
                    <button
                      v-for="layout in layouts"
                      :key="layout.id"
                      class="layout-btn"
                      :class="{ active: currentCollage.layout === layout.id }"
                      @click="changeLayout(layout.id)"
                    >
                      {{ layout.icon }}
                    </button>
                  </div>
                </div>

                <div
                  v-if="currentCollage"
                  class="collage-canvas"
                  @drop="handleDrop"
                  @dragover.prevent
                >
                  <div
                    v-for="photo in currentCollage.photos"
                    :key="photo.id"
                    class="collage-photo"
                    :class="{ selected: selectedPhotoId === photo.id }"
                    :style="{
                      left: photo.position.x + 'px',
                      top: photo.position.y + 'px',
                      width: photo.size.width + 'px',
                      height: photo.size.height + 'px',
                      transform: `rotate(${photo.rotation}deg)`
                    }"
                    @click="selectPhoto(photo.id)"
                  >
                    <span class="photo-icon">{{ photo.itemIcon }}</span>
                    <span class="photo-name">{{ photo.itemName }}</span>
                    <button
                      v-if="selectedPhotoId === photo.id"
                      class="photo-remove"
                      @click.stop="removePhoto(photo.id)"
                    >
                      ×
                    </button>
                  </div>
                  <div v-if="currentCollage.photos.length === 0" class="canvas-empty">
                    <span>🖼️</span>
                    <p>拖拽左侧物品到此处创建拼贴</p>
                  </div>
                </div>

                <div v-if="currentCollage && selectedPhotoId" class="photo-edit-panel">
                  <div class="photo-edit-row">
                    <label>大小：</label>
                    <input
                      type="range"
                      v-model="photoEditSize"
                      min="60"
                      max="150"
                      @input="updatePhotoSize"
                    />
                  </div>
                  <div class="photo-edit-row">
                    <label>旋转：</label>
                    <input
                      type="range"
                      v-model="photoEditRotation"
                      min="-45"
                      max="45"
                      @input="updatePhotoRotation"
                    />
                  </div>
                </div>

                <div v-if="!currentCollage" class="no-collage-state">
                  <span class="no-collage-icon">🖼️</span>
                  <h4>选择或创建一个拼贴</h4>
                  <p>将收集到的物品自由拼贴，创造独特的视觉回忆</p>
                </div>
              </div>

              <div v-if="currentCollage" class="collage-actions-panel">
                <button class="action-btn danger" @click="deleteCollage">
                  🗑️ 删除拼贴
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'book'" class="tab-content book-tab">
            <div class="tab-toolbar">
              <h3 class="tab-title">📖 回忆册生成</h3>
              <div class="toolbar-actions">
                <select v-model="selectedBookId" class="book-select" @change="loadBook">
                  <option value="">选择回忆册...</option>
                  <option v-for="b in memoryBooks" :key="b.id" :value="b.id">
                    {{ b.title }}
                  </option>
                </select>
                <button class="action-btn" @click="createNewBook">
                  ➕ 新建
                </button>
                <button class="action-btn primary" @click="autoGenerateBook">
                  ✨ 智能生成
                </button>
              </div>
            </div>

            <div class="book-workspace">
              <div v-if="currentBook" class="book-editor">
                <div class="book-meta">
                  <input
                    v-model="currentBook.title"
                    type="text"
                    class="book-title-input"
                    placeholder="回忆册标题..."
                    @change="updateBookTitle"
                  />
                  <select v-model="currentBook.theme" class="theme-select" @change="updateBookTheme">
                    <option value="nostalgic">怀旧风</option>
                    <option value="warm">温暖风</option>
                    <option value="romantic">浪漫风</option>
                    <option value="minimal">简约风</option>
                  </select>
                </div>

                <div class="book-pages-list">
                  <div
                    v-for="(page, index) in currentBook.pages"
                    :key="page.id"
                    class="page-card"
                    :class="{ selected: selectedPageId === page.id }"
                    draggable="true"
                    @dragstart="startPageDrag(index)"
                    @dragover.prevent
                    @drop="handlePageDrop(index)"
                    @click="selectPage(page.id)"
                  >
                    <div class="page-drag-handle">⋮⋮</div>
                    <div class="page-preview">
                      <span class="page-type-icon">{{ getPageTypeIcon(page.type) }}</span>
                      <span class="page-type-name">{{ getPageTypeName(page.type) }}</span>
                    </div>
                    <div class="page-actions">
                      <button class="page-action-btn" @click.stop="editPage(page)">✏️</button>
                      <button class="page-action-btn danger" @click.stop="deletePage(page.id)">🗑️</button>
                    </div>
                  </div>
                </div>

                <div class="add-page-section">
                  <h4 class="panel-subtitle">添加新页面</h4>
                  <div class="page-type-buttons">
                    <button
                      v-for="pt in pageTypes"
                      :key="pt.id"
                      class="page-type-btn"
                      @click="addNewPage(pt.id)"
                    >
                      {{ pt.icon }} {{ pt.name }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="currentBook && selectedPage" class="page-editor-panel">
                <h4 class="panel-subtitle">编辑页面 - {{ getPageTypeName(selectedPage.type) }}</h4>
                
                <div v-if="selectedPage.type === 'cover'" class="page-editor-form">
                  <div class="form-group">
                    <label class="form-label">标题</label>
                    <input
                      v-model="selectedPage.content.title"
                      type="text"
                      class="form-input"
                      @change="savePageContent"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">副标题</label>
                    <input
                      v-model="selectedPage.content.subtitle"
                      type="text"
                      class="form-input"
                      @change="savePageContent"
                    />
                  </div>
                </div>

                <div v-else-if="selectedPage.type === 'memory'" class="page-editor-form">
                  <div class="form-group">
                    <label class="form-label">选择回忆</label>
                    <select
                      v-model="selectedPage.content.memoryId"
                      class="form-select"
                      @change="updateMemoryPage"
                    >
                      <option value="">请选择...</option>
                      <option v-for="m in unlockedMemories" :key="m.id" :value="m.id">
                        {{ m.title }}
                      </option>
                    </select>
                  </div>
                  <div v-if="selectedMemoryForPage" class="memory-preview">
                    <div class="memory-preview-header">
                      <span class="memory-year">{{ selectedMemoryForPage.year }}</span>
                      <span class="memory-emoji">{{ getEmojiForEmotion(selectedMemoryForPage.emotion) }}</span>
                    </div>
                    <p class="memory-preview-content">{{ selectedMemoryForPage.content }}</p>
                  </div>
                </div>

                <div v-else-if="selectedPage.type === 'items'" class="page-editor-form">
                  <div class="form-group">
                    <label class="form-label">分类</label>
                    <select v-model="selectedPage.content.category" class="form-select" @change="updateItemsPage">
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div v-else-if="selectedPage.type === 'excerpts'" class="page-editor-form">
                  <p class="form-hint">此页面将自动展示你收藏的对白摘录</p>
                </div>

                <div v-else-if="selectedPage.type === 'summary'" class="page-editor-form">
                  <p class="form-hint">此页面将自动展示你的探索统计数据</p>
                </div>
              </div>

              <div v-if="!currentBook" class="no-book-state">
                <span class="no-book-icon">📖</span>
                <h4>创建你的专属回忆册</h4>
                <p>将所有回忆整合在一起，生成一本独一无二的个人回忆册</p>
                <button class="action-btn primary" @click="autoGenerateBook">
                  ✨ 一键智能生成
                </button>
              </div>
            </div>

            <div v-if="currentBook" class="book-preview-section">
              <button class="action-btn primary large" @click="previewBook">
                👁️ 预览回忆册
              </button>
            </div>
          </div>

        <Transition name="fade">
          <div v-if="showBookPreview" class="book-preview-overlay" @click.self="showBookPreview = false">
            <div class="book-preview-container" :class="currentBook?.theme">
              <div class="preview-header">
                <h3 class="preview-title">{{ currentBook?.title }}</h3>
                <button class="close-icon-btn" @click="showBookPreview = false">✕</button>
              </div>
              <div class="preview-pages">
                <div
                  v-for="(page, idx) in currentBook?.pages"
                  :key="page.id"
                  class="preview-page"
                  :class="page.type"
                >
                  <div v-if="page.type === 'cover'" class="preview-cover">
                    <span class="preview-cover-icon">📖</span>
                    <h2 class="preview-cover-title">{{ page.content.title || '雾城手账' }}</h2>
                    <p class="preview-cover-subtitle">{{ page.content.subtitle || '一段关于重逢的旅程' }}</p>
                    <p class="preview-cover-date">{{ page.content.date || new Date().toLocaleDateString('zh-CN') }}</p>
                  </div>

                  <div v-else-if="page.type === 'memory'" class="preview-memory">
                    <div class="preview-memory-header">
                      <span class="preview-memory-emoji">{{ getEmojiForEmotion(page.content.emotion) }}</span>
                      <div>
                        <h4 class="preview-memory-title">{{ page.content.title }}</h4>
                        <span class="preview-memory-year">{{ page.content.year }}</span>
                      </div>
                    </div>
                    <p class="preview-memory-content">{{ page.content.content }}</p>
                    <div class="preview-memory-item">
                      <span>{{ page.content.itemIcon }}</span>
                      <span>{{ page.content.itemName }}</span>
                    </div>
                  </div>

                  <div v-else-if="page.type === 'items'" class="preview-items">
                    <h4 class="preview-items-title">{{ page.content.categoryName }}</h4>
                    <div class="preview-items-grid">
                      <div v-for="item in page.content.items" :key="item.id" class="preview-item-card">
                        <span class="preview-item-icon">{{ item.icon }}</span>
                        <span class="preview-item-name">{{ item.name }}</span>
                        <p v-if="item.note" class="preview-item-note">"{{ item.note }}"</p>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="page.type === 'excerpts'" class="preview-excerpts">
                    <h4 class="preview-excerpts-title">💬 对白摘录</h4>
                    <div class="preview-excerpts-list">
                      <div v-for="ex in page.content.excerpts" :key="ex.id" class="preview-excerpt">
                        <p class="preview-excerpt-text">"{{ ex.text }}"</p>
                        <span class="preview-excerpt-author">—— {{ ex.character }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="page.type === 'summary'" class="preview-summary">
                    <h4 class="preview-summary-title">✨ 旅程总结</h4>
                    <div class="preview-summary-stats">
                      <div class="summary-stat">
                        <span class="stat-num">{{ page.content.totalMemories }}</span>
                        <span class="stat-label">段回忆</span>
                      </div>
                      <div class="summary-stat">
                        <span class="stat-num">{{ page.content.totalItems }}</span>
                        <span class="stat-label">件旧物</span>
                      </div>
                      <div class="summary-stat">
                        <span class="stat-num">{{ page.content.completionRate }}%</span>
                        <span class="stat-label">完成度</span>
                      </div>
                    </div>
                  </div>

                  <div class="preview-page-number">第 {{ idx + 1 }} 页</div>
                </div>
              </div>
              <div class="preview-controls">
                <button class="preview-nav-btn" @click="previewPageIndex = Math.max(0, previewPageIndex - 1)" :disabled="previewPageIndex === 0">
                  ← 上一页
                </button>
                <span class="preview-page-indicator">{{ previewPageIndex + 1 }} / {{ currentBook?.pages?.length || 0 }}</span>
                <button class="preview-nav-btn" @click="previewPageIndex = Math.min((currentBook?.pages?.length || 1) - 1, previewPageIndex + 1)" :disabled="previewPageIndex >= (currentBook?.pages?.length || 1) - 1">
                  下一页 →
                </button>
              </div>
            </div>
          </div>
        </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useJournalStore } from '../stores/journalStore'

const gameStore = useGameStore()
const journalStore = useJournalStore()

const showModal = computed(() => gameStore.showJournalEditor)
const activeTab = ref('items')

const mainTabs = [
  { id: 'items', icon: '📦', label: '旧物整理' },
  { id: 'dialogs', icon: '💬', label: '对白摘录' },
  { id: 'collage', icon: '🖼️', label: '照片拼贴' },
  { id: 'book', icon: '📖', label: '回忆册' }
]

const categories = [
  { id: 'important', icon: '⭐', name: '重要物品' },
  { id: 'memory', icon: '💭', name: '回忆载体' },
  { id: 'daily', icon: '☀️', name: '日常点滴' },
  { id: 'collection', icon: '🏆', name: '珍藏收藏' },
  { id: 'uncategorized', icon: '📁', name: '未分类' }
]

const layouts = [
  { id: 'free', icon: '▢' },
  { id: 'grid', icon: '▦' },
  { id: 'masonry', icon: '▤' }
]

const pageTypes = [
  { id: 'cover', icon: '📔', name: '封面' },
  { id: 'memory', icon: '💭', name: '回忆页' },
  { id: 'items', icon: '📦', name: '物品页' },
  { id: 'excerpts', icon: '💬', name: '摘录页' },
  { id: 'summary', icon: '📊', name: '总结页' }
]

const stats = computed(() => journalStore.getJournalStats())
const unlockedItems = computed(() => journalStore.getAllUnlockedItems())
const unlockedMemories = computed(() => journalStore.getAllUnlockedMemories())
const organizedItemsByCategory = computed(() => journalStore.organizedItemsByCategory)
const dialogExcerpts = computed(() => journalStore.dialogExcerpts)
const photoCollages = computed(() => journalStore.photoCollages)
const memoryBooks = computed(() => journalStore.memoryBooks)

const selectedCategoryFilter = ref('all')
const selectedItemId = ref(null)
const selectedCategory = ref('uncategorized')
const newTag = ref('')
const currentTags = ref([])
const currentNote = ref('')

const selectedItem = computed(() => {
  if (!selectedItemId.value) return null
  return unlockedItems.value.find(i => i.id === selectedItemId.value)
})

const currentOrganized = computed(() => {
  if (!selectedItemId.value) return null
  return journalStore.organizedItems.find(o => o.itemId === selectedItemId.value)
})

const filteredUnorganizedItems = computed(() => {
  let items = unlockedItems.value.filter(i => {
    const organized = journalStore.organizedItems.find(o => o.itemId === i.id)
    if (selectedCategoryFilter.value === 'all') return true
    if (selectedCategoryFilter.value === 'uncategorized') return !organized
    return organized?.category === selectedCategoryFilter.value
  })
  return items
})

watch(selectedItem, (item) => {
  if (item) {
    const organized = journalStore.organizedItems.find(o => o.itemId === item.id)
    selectedCategory.value = organized?.category || 'uncategorized'
    currentTags.value = [...journalStore.getItemTags(item.id)]
    currentNote.value = journalStore.getItemNote(item.id)
  } else {
    selectedCategory.value = 'uncategorized'
    currentTags.value = []
    currentNote.value = ''
  }
})

function selectItem(item) {
  selectedItemId.value = item.id
}

function addTag() {
  if (newTag.value.trim() && !currentTags.value.includes(newTag.value.trim())) {
    currentTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tag) {
  currentTags.value = currentTags.value.filter(t => t !== tag)
}

function saveItemOrganize() {
  if (!selectedItemId.value) return
  journalStore.organizeItem(selectedItemId.value, selectedCategory.value)
  journalStore.setItemTags(selectedItemId.value, currentTags.value)
  journalStore.setItemNote(selectedItemId.value, currentNote.value)
  showToast('物品整理已保存')
}

function removeItemOrganize() {
  if (!selectedItemId.value) return
  journalStore.removeOrganizedItem(selectedItemId.value)
  journalStore.setItemTags(selectedItemId.value, [])
  journalStore.setItemNote(selectedItemId.value, '')
  showToast('已移除整理')
}

function getCategoryItems(categoryId) {
  return organizedItemsByCategory.value[categoryId] || []
}

const showAddExcerpt = ref(false)
const editingExcerpt = ref(null)
const excerptForm = ref({
  memoryId: '',
  character: '',
  text: '',
  note: ''
})

function editExcerpt(excerpt) {
  editingExcerpt.value = excerpt
  excerptForm.value = {
    memoryId: excerpt.memoryId,
    character: excerpt.character,
    text: excerpt.text,
    note: excerpt.note || ''
  }
  showAddExcerpt.value = true
}

function saveExcerpt() {
  if (!excerptForm.value.memoryId || !excerptForm.value.text.trim()) {
    showToast('请填写回忆和对白内容')
    return
  }

  if (editingExcerpt.value) {
    journalStore.updateDialogExcerpt(editingExcerpt.value.id, excerptForm.value)
    showToast('摘录已更新')
  } else {
    journalStore.addDialogExcerpt(
      excerptForm.value.memoryId,
      excerptForm.value.text.trim(),
      excerptForm.value.character || '她',
      excerptForm.value.note
    )
    showToast('摘录已添加')
  }

  showAddExcerpt.value = false
  editingExcerpt.value = null
  excerptForm.value = { memoryId: '', character: '', text: '', note: '' }
}

function deleteExcerpt(excerptId) {
  if (confirm('确定要删除这条摘录吗？')) {
    journalStore.removeDialogExcerpt(excerptId)
    showToast('摘录已删除')
  }
}

function formatDate(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const selectedCollageId = ref('')
const currentCollage = ref(null)
const selectedPhotoId = ref(null)
const photoEditSize = ref(100)
const photoEditRotation = ref(0)
let draggedItem = null

function createNewCollage() {
  const collage = journalStore.createPhotoCollage('新拼贴')
  selectedCollageId.value = collage.id
  loadCollage()
  showToast('新拼贴已创建')
}

function loadCollage() {
  if (!selectedCollageId.value) {
    currentCollage.value = null
    return
  }
  currentCollage.value = photoCollages.value.find(c => c.id === selectedCollageId.value)
  selectedPhotoId.value = null
}

function updateCollageTitle() {
  if (currentCollage.value) {
    journalStore.updateCollage(currentCollage.value.id, { title: currentCollage.value.title })
  }
}

function changeLayout(layoutId) {
  if (currentCollage.value) {
    journalStore.updateCollage(currentCollage.value.id, { layout: layoutId })
  }
}

function startDrag(event, item) {
  draggedItem = item
}

function handleDrop(event) {
  if (!draggedItem || !currentCollage.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left - 50
  const y = event.clientY - rect.top - 50
  journalStore.addPhotoToCollage(currentCollage.value.id, draggedItem.id, { x, y })
  draggedItem = null
}

function selectPhoto(photoId) {
  selectedPhotoId.value = photoId
  const photo = currentCollage.value?.photos.find(p => p.id === photoId)
  if (photo) {
    photoEditSize.value = photo.size.width
    photoEditRotation.value = photo.rotation
  }
}

function updatePhotoSize() {
  if (!currentCollage.value || !selectedPhotoId.value) return
  journalStore.updatePhotoInCollage(
    currentCollage.value.id,
    selectedPhotoId.value,
    { size: { width: photoEditSize.value, height: photoEditSize.value } }
  )
}

function updatePhotoRotation() {
  if (!currentCollage.value || !selectedPhotoId.value) return
  journalStore.updatePhotoInCollage(
    currentCollage.value.id,
    selectedPhotoId.value,
    { rotation: photoEditRotation.value }
  )
}

function removePhoto(photoId) {
  if (!currentCollage.value) return
  journalStore.removePhotoFromCollage(currentCollage.value.id, photoId)
  selectedPhotoId.value = null
}

function deleteCollage() {
  if (!currentCollage.value) return
  if (confirm('确定要删除这个拼贴吗？')) {
    journalStore.removeCollage(currentCollage.value.id)
    currentCollage.value = null
    selectedCollageId.value = ''
    showToast('拼贴已删除')
  }
}

const selectedBookId = ref('')
const currentBook = ref(null)
const selectedPageId = ref(null)
const selectedPage = computed(() => {
  if (!currentBook.value || !selectedPageId.value) return null
  return currentBook.value.pages.find(p => p.id === selectedPageId.value)
})
const showBookPreview = ref(false)
const previewPageIndex = ref(0)
let draggedPageIndex = null

const selectedMemoryForPage = computed(() => {
  if (!selectedPage.value?.content?.memoryId) return null
  return unlockedMemories.value.find(m => m.id === selectedPage.value.content.memoryId)
})

function createNewBook() {
  const book = journalStore.createMemoryBook('新回忆册')
  selectedBookId.value = book.id
  loadBook()
  showToast('新回忆册已创建')
}

function loadBook() {
  if (!selectedBookId.value) {
    currentBook.value = null
    return
  }
  currentBook.value = memoryBooks.value.find(b => b.id === selectedBookId.value)
  selectedPageId.value = null
}

function updateBookTitle() {
  if (currentBook.value) {
    journalStore.updateMemoryBook(currentBook.value.id, { title: currentBook.value.title })
  }
}

function updateBookTheme() {
  if (currentBook.value) {
    journalStore.updateMemoryBook(currentBook.value.id, { theme: currentBook.value.theme })
  }
}

function autoGenerateBook() {
  const book = journalStore.generateAutoMemoryBook()
  if (book) {
    selectedBookId.value = book.id
    loadBook()
    showToast('智能回忆册已生成！')
  } else {
    showToast('需要先收集一些回忆和物品才能生成回忆册')
  }
}

function selectPage(pageId) {
  selectedPageId.value = pageId
}

function addNewPage(pageType) {
  if (!currentBook.value) return
  const content = pageType === 'cover' 
    ? { title: '雾城手账', subtitle: '一段关于重逢的旅程', date: new Date().toLocaleDateString('zh-CN') }
    : {}
  journalStore.addPageToBook(currentBook.value.id, pageType, content)
  showToast('页面已添加')
}

function editPage(page) {
  selectedPageId.value = page.id
}

function deletePage(pageId) {
  if (!currentBook.value) return
  if (confirm('确定要删除这个页面吗？')) {
    journalStore.removePageFromBook(currentBook.value.id, pageId)
    selectedPageId.value = null
    showToast('页面已删除')
  }
}

function savePageContent() {
  if (!currentBook.value || !selectedPage.value) return
  journalStore.updatePageInBook(currentBook.value.id, selectedPage.value.id, selectedPage.value.content)
}

function updateMemoryPage() {
  if (!selectedPage.value?.content?.memoryId) return
  const memory = unlockedMemories.value.find(m => m.id === selectedPage.value.content.memoryId)
  if (memory) {
    selectedPage.value.content = {
      ...selectedPage.value.content,
      title: memory.title,
      year: memory.year,
      emotion: memory.emotion,
      content: memory.content,
      itemIcon: memory.itemIcon,
      itemName: memory.itemName
    }
    savePageContent()
  }
}

function updateItemsPage() {
  if (!selectedPage.value?.content?.category) return
  const catItems = getCategoryItems(selectedPage.value.content.category)
  selectedPage.value.content = {
    ...selectedPage.value.content,
    categoryName: journalStore.getCategoryName(selectedPage.value.content.category),
    items: catItems.map(i => ({
      id: i.id,
      name: i.name,
      icon: i.icon,
      note: i.note,
      tags: i.tags
    }))
  }
  savePageContent()
}

function startPageDrag(index) {
  draggedPageIndex = index
}

function handlePageDrop(toIndex) {
  if (draggedPageIndex === null || !currentBook.value) return
  journalStore.reorderPagesInBook(currentBook.value.id, draggedPageIndex, toIndex)
  draggedPageIndex = null
}

function getPageTypeIcon(type) {
  const icons = { cover: '📔', memory: '💭', items: '📦', excerpts: '💬', summary: '📊' }
  return icons[type] || '📄'
}

function getPageTypeName(type) {
  const names = { cover: '封面', memory: '回忆页', items: '物品页', excerpts: '摘录页', summary: '总结页' }
  return names[type] || '页面'
}

function previewBook() {
  if (!currentBook.value || currentBook.value.pages.length === 0) {
    showToast('请先添加一些页面')
    return
  }
  previewPageIndex.value = 0
  showBookPreview.value = true
}

function getEmojiForEmotion(emotion) {
  const emotions = { sad: '😢', warm: '🥰', pensive: '🤔', happy: '😊', sweet: '🍬', nervous: '😰', bittersweet: '😌', shocking: '😲', romantic: '💕', regret: '💔', melancholy: '🌧️', touched: '🥹', determined: '💪' }
  return emotions[emotion] || '💭'
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.className = 'journal-toast'
  toast.textContent = message
  toast.style.position = 'fixed'
  toast.style.top = '50%'
  toast.style.left = '50%'
  toast.style.transform = 'translate(-50%, -50%)'
  toast.style.background = 'rgba(0,0,0,0.8)'
  toast.style.color = 'white'
  toast.style.padding = '12px 24px'
  toast.style.borderRadius = '8px'
  toast.style.zIndex = '10000'
  toast.style.animation = 'toastIn 0.3s ease'
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 1500)
}

function handleClose() {
  gameStore.closeJournalEditor()
}

watch(showModal, (val) => {
  if (val) {
    activeTab.value = 'items'
    selectedItemId.value = null
    selectedCollageId.value = ''
    currentCollage.value = null
    selectedBookId.value = ''
    currentBook.value = null
  }
});
</script>

<style scoped>
.journal-editor-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(5, 5, 20, 0.95);
  backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  z-index: 5000;
  padding: 10px;
}

.journal-editor-container {
  background: linear-gradient(145deg, rgba(15, 15, 35, 0.98), rgba(10, 10, 25, 0.99));
  border-radius: 24px;
  width: 100%; max-width: 1100px; max-height: 92vh;
  display: flex; flex-direction: column;
  border: 1px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7), 0 0 50px rgba(212, 165, 116, 0.1);
  overflow: hidden;
}

.editor-header {
  padding: 1.2rem 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(120deg, rgba(212, 165, 116, 0.12), rgba(100, 80, 60, 0.05), transparent);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-left { display: flex; align-items: center; gap: 0.9rem; }
.editor-title-icon {
  font-size: 2.4rem;
  animation: float-icon 3s ease-in-out infinite;
  filter: drop-shadow(0 0 12px rgba(212, 165, 116, 0.5));
}
@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.editor-main-title {
  margin: 0;
  font-size: clamp(1.15rem, 2.5vw, 1.4rem);
  background: linear-gradient(135deg, #d4a574, #f0d090, #d4a574);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: 0.08rem;
}
.editor-subtitle {
  margin: 0.2rem 0 0 0;
  font-size: 0.78rem;
  color: #807060;
  letter-spacing: 0.05rem;
}
.header-right { display: flex; align-items: center; gap: 0.8rem; }
.editor-stats { display: flex; gap: 1rem; }
.stat-item {
  font-size: 0.8rem;
  color: #a08870;
  background: rgba(212, 165, 116, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}
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

.editor-navbar {
  display: flex;
  padding: 0.7rem 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}
.nav-tab-btn {
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
.nav-tab-btn:hover { background: rgba(255, 255, 255, 0.07); color: #c0c0d0; }
.nav-tab-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(180, 140, 100, 0.3));
  color: #fff5dc;
  box-shadow: 0 3px 14px rgba(212, 165, 116, 0.28);
}

.editor-content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
}

.tab-content { animation: fadeInUp 0.4s ease; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.tab-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.tab-title { margin: 0; font-size: 1.15rem; color: #e8d5a8; font-weight: 500; }
.toolbar-actions { display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; }

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  color: #a0a0b0;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.action-btn:hover { background: rgba(255, 255, 255, 0.08); color: #e0e0e0; }
.action-btn.primary {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(180, 140, 100, 0.25));
  border-color: rgba(212, 165, 116, 0.4);
  color: #f5e0c0;
}
.action-btn.primary:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(180, 140, 100, 0.35));
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
}
.action-btn.danger {
  background: rgba(255, 100, 100, 0.1);
  border-color: rgba(255, 100, 100, 0.3);
  color: #ff8080;
}
.action-btn.danger:hover {
  background: rgba(255, 100, 100, 0.2);
}
.action-btn.large { padding: 0.8rem 2rem; font-size: 1rem; }

.category-select, .collage-select, .book-select {
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.items-organizer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  min-height: 400px;
}
@media (max-width: 900px) {
  .items-organizer { grid-template-columns: 1fr; }
}

.items-list-panel, .item-detail-panel, .organized-preview-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.panel-subtitle {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #a08870;
  font-weight: 500;
}

.items-grid-small {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}
.item-card-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.7rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.item-card-small:hover { background: rgba(255, 255, 255, 0.06); }
.item-card-small.selected {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.25), rgba(180, 140, 100, 0.15));
  border-color: rgba(212, 165, 116, 0.5);
}
.item-icon-sm { font-size: 1.8rem; }
.item-name-sm { font-size: 0.75rem; color: #b0a090; text-align: center; }

.empty-mini {
  text-align: center;
  padding: 2rem 1rem;
  opacity: 0.6;
}
.empty-mini span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.empty-mini p { margin: 0; font-size: 0.85rem; color: #707080; }

.item-detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.detail-item-icon { font-size: 3rem; }
.detail-item-name { margin: 0; font-size: 1.1rem; color: #e8d5a8; }
.detail-item-location { margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #807060; }

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.detail-label {
  font-size: 0.82rem;
  color: #a08870;
  font-weight: 500;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.category-btn {
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  color: #808090;
  font-family: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.category-btn:hover { background: rgba(255, 255, 255, 0.06); }
.category-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(180, 140, 100, 0.15));
  border-color: rgba(212, 165, 116, 0.5);
  color: #f5e0c0;
}

.tags-input-area { display: flex; flex-direction: column; gap: 0.5rem; }
.tags-display { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  background: linear-gradient(135deg, rgba(100, 150, 220, 0.2), rgba(80, 120, 200, 0.1));
  border: 1px solid rgba(100, 150, 220, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  color: #a0c8ff;
}
.tag-remove {
  background: none;
  border: none;
  color: #a0c8ff;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  line-height: 1;
}
.tag-input-row { display: flex; gap: 0.4rem; }
.tag-input {
  flex: 1;
  padding: 0.4rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.8rem;
}
.add-tag-btn {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 10px;
  background: rgba(100, 150, 220, 0.3);
  color: #c0d8ff;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.note-textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.85rem;
  resize: vertical;
}

.detail-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.save-btn {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(180, 140, 100, 0.3));
  color: #fff5dc;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.save-btn:hover { box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3); }
.remove-btn {
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 12px;
  background: rgba(255, 100, 100, 0.1);
  color: #ff8080;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.empty-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.5;
}
.empty-icon-lg { font-size: 3rem; margin-bottom: 1rem; }
.empty-detail p { margin: 0; color: #707080; }

.category-group { margin-bottom: 1rem; }
.category-group-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.82rem;
  color: #a08870;
}
.organized-items-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.organized-item-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: rgba(212, 165, 116, 0.1);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 12px;
  font-size: 0.75rem;
  color: #d4c0a0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.organized-item-chip:hover { background: rgba(212, 165, 116, 0.2); }
.chip-name { max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}
.empty-state-icon { font-size: 4rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
.empty-state-title { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #a0a0b0; }
.empty-state-desc { margin: 0 0 1.5rem 0; font-size: 0.9rem; color: #707080; }

.excerpts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.excerpt-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.2rem;
  transition: all 0.3s ease;
}
.excerpt-card:hover { background: rgba(255, 255, 255, 0.05); }
.excerpt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}
.excerpt-memory-tag {
  font-size: 0.75rem;
  color: #a08870;
  background: rgba(212, 165, 116, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
}
.excerpt-character {
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 500;
}
.excerpt-text {
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  color: #e0d8c8;
  font-style: italic;
  line-height: 1.7;
  padding-left: 1rem;
  border-left: 3px solid rgba(212, 165, 116, 0.4);
}
.excerpt-note {
  margin: 0 0 0.8rem 0;
  font-size: 0.85rem;
  color: #808090;
}
.excerpt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.excerpt-date {
  font-size: 0.75rem;
  color: #707080;
}
.excerpt-actions {
  display: flex;
  gap: 0.4rem;
}
.excerpt-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.excerpt-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}
.excerpt-action-btn.danger:hover {
  background: rgba(255, 100, 100, 0.2);
  color: #ff8080;
}

.excerpt-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5100;
  padding: 20px;
}
.excerpt-modal {
  background: linear-gradient(145deg, rgba(20, 20, 40, 0.98), rgba(15, 15, 30, 0.99));
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(212, 165, 116, 0.3);
}
.modal-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #e8d5a8;
  text-align: center;
}
.form-group {
  margin-bottom: 1rem;
}
.form-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: #a08870;
}
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.85rem;
}
.form-textarea {
  resize: vertical;
}
.form-hint {
  color: #707080;
  font-size: 0.85rem;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}
.modal-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.modal-btn {
  flex: 1;
  padding: 0.7rem;
  border-radius: 12px;
  border: none;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #a0a0b0;
}
.modal-btn.cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}
.modal-btn.confirm {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(180, 140, 100, 0.3));
  color: #fff5dc;
}
.modal-btn.confirm:hover {
  box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);
}

.collage-workspace {
  display: grid;
  grid-template-columns: 200px 1fr 150px;
  gap: 1rem;
  min-height: 450px;
}
@media (max-width: 900px) {
  .collage-workspace {
    grid-template-columns: 1fr;
  }
}

.collage-items-panel, .collage-actions-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.collage-items-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 380px;
  overflow-y: auto;
}
.collage-item-source {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.7rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  cursor: grab;
  transition: all 0.3s ease;
}
.collage-item-source:hover {
  background: rgba(255, 255, 255, 0.06);
}
.collage-item-source:active {
  cursor: grabbing;
}
.collage-item-icon {
  font-size: 1.5rem;
}
.collage-item-name {
  font-size: 0.8rem;
  color: #b0a090;
}

.collage-canvas-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.collage-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}
.collage-title-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.9rem;
}
.layout-buttons {
  display: flex;
  gap: 0.3rem;
}
.layout-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.layout-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.layout-btn.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.4), rgba(180, 140, 100, 0.2));
  border-color: rgba(212, 165, 116, 0.5);
  color: #f5e0c0;
}

.collage-canvas {
  position: relative;
  flex: 1;
  min-height: 350px;
  background: linear-gradient(135deg, rgba(139, 115, 85, 0.1), rgba(100, 80, 60, 0.05));
  border: 2px dashed rgba(212, 165, 116, 0.2);
  border-radius: 16px;
  overflow: hidden;
}
.collage-photo {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #d4a574;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.collage-photo:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.collage-photo.selected {
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.6), 0 6px 20px rgba(0, 0, 0, 0.3);
}
.photo-icon {
  font-size: 2rem;
}
.photo-name {
  font-size: 0.7rem;
  color: #5d4e37;
  margin-top: 0.2rem;
}
.photo-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #ff6b6b;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
}

.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #707080;
  opacity: 0.6;
}
.canvas-empty span {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.photo-edit-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.8rem;
}
.photo-edit-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}
.photo-edit-row label {
  font-size: 0.75rem;
  color: #a08870;
  width: 40px;
}
.photo-edit-row input[type="range"] {
  flex: 1;
}

.no-collage-state, .no-book-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  opacity: 0.7;
}
.no-collage-icon, .no-book-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.no-collage-state h4, .no-book-state h4 {
  margin: 0 0 0.5rem 0;
  color: #a0a0b0;
}
.no-collage-state p, .no-book-state p {
  margin: 0 0 1.5rem 0;
  color: #707080;
}

.book-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 450px;
}
@media (max-width: 900px) {
  .book-workspace {
    grid-template-columns: 1fr;
  }
}

.book-editor, .page-editor-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-meta {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}
.book-title-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.95rem;
}
.theme-select {
  padding: 0.5rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #c0c0d0;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.book-pages-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 280px;
  overflow-y: auto;
}
.page-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.page-card:hover {
  background: rgba(255, 255, 255, 0.06);
}
.page-card.selected {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.25), rgba(180, 140, 100, 0.15));
  border-color: rgba(212, 165, 116, 0.5);
}
.page-drag-handle {
  color: #707080;
  cursor: grab;
  font-size: 0.8rem;
}
.page-drag-handle:active {
  cursor: grabbing;
}
.page-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.page-type-icon {
  font-size: 1.2rem;
}
.page-type-name {
  font-size: 0.85rem;
  color: #b0a090;
}
.page-actions {
  display: flex;
  gap: 0.3rem;
}
.page-action-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
}
.page-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}
.page-action-btn.danger:hover {
  background: rgba(255, 100, 100, 0.2);
  color: #ff8080;
}

.add-page-section {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.page-type-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.page-type-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: #a0a0b0;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.page-type-btn:hover {
  background: rgba(212, 165, 116, 0.15);
  border-color: rgba(212, 165, 116, 0.3);
  color: #f5e0c0;
}

.page-editor-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.memory-preview {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1rem;
  border-left: 3px solid rgba(212, 165, 116, 0.4);
}
.memory-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}
.memory-year {
  font-size: 0.85rem;
  color: #a08870;
  background: rgba(212, 165, 116, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
}
.memory-emoji {
  font-size: 1.5rem;
}
.memory-preview-content {
  margin: 0;
  font-size: 0.9rem;
  color: #c0b8a8;
  line-height: 1.7;
}

.book-preview-section {
  margin-top: 1rem;
  text-align: center;
}

.book-preview-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5200;
  padding: 20px;
}
.book-preview-container {
  background: linear-gradient(145deg, #f5e6d3, #e8dcc8);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.book-preview-container.warm {
  background: linear-gradient(145deg, #fff5e6, #ffe8cc);
}
.book-preview-container.romantic {
  background: linear-gradient(145deg, #fff0f5, #ffe4ec);
}
.book-preview-container.minimal {
  background: linear-gradient(145deg, #fafafa, #f0f0f0);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.preview-title {
  margin: 0;
  font-size: 1.2rem;
  color: #5d4e37;
}
.preview-pages {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.preview-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #5d4e37;
}
.preview-page:nth-child(n+2):nth-last-child(n+2) {
  display: none;
}
.preview-page.cover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(180, 140, 100, 0.1));
}
.preview-page.cover,
.preview-page.memory,
.preview-page.items,
.preview-page.excerpts,
.preview-page.summary {
  display: none;
}
.preview-page:nth-child(1) {
  display: flex;
}

.preview-cover-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}
.preview-cover-title {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #5d4e37;
}
.preview-cover-subtitle {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  color: #8b7355;
}
.preview-cover-date {
  font-size: 0.9rem;
  color: #a08870;
}

.preview-memory-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.preview-memory-emoji {
  font-size: 3rem;
}
.preview-memory-title {
  margin: 0;
  font-size: 1.3rem;
  color: #5d4e37;
}
.preview-memory-year {
  font-size: 0.9rem;
  color: #8b7355;
}
.preview-memory-content {
  font-size: 1rem;
  line-height: 2;
  color: #5d4e37;
  text-indent: 2em;
  margin: 0 0 1.5rem 0;
}
.preview-memory-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #8b7355;
  font-size: 0.9rem;
}

.preview-items-title,
.preview-excerpts-title,
.preview-summary-title {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  color: #5d4e37;
}
.preview-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
}
.preview-item-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}
.preview-item-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}
.preview-item-name {
  font-size: 0.9rem;
  color: #5d4e37;
  display: block;
  margin-bottom: 0.3rem;
}
.preview-item-note {
  font-size: 0.75rem;
  color: #8b7355;
  margin: 0;
  font-style: italic;
}

.preview-excerpts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  text-align: left;
}
.preview-excerpt-text {
  font-size: 1rem;
  color: #5d4e37;
  font-style: italic;
  line-height: 1.7;
  margin: 0 0 0.3rem 0;
  padding-left: 1rem;
  border-left: 2px solid rgba(212, 165, 116, 0.4);
}
.preview-excerpt-author {
  font-size: 0.85rem;
  color: #8b7355;
  display: block;
  text-align: right;
}

.preview-summary-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}
.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d4a574;
}
.stat-label {
  font-size: 0.9rem;
  color: #8b7355;
}

.preview-page-number {
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #a08870;
}

.preview-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.preview-nav-btn {
  padding: 0.6rem 1.5rem;
  border: 1px solid rgba(139, 115, 85, 0.3);
  border-radius: 20px;
  background: rgba(212, 165, 116, 0.1);
  color: #5d4e37;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.preview-nav-btn:hover:not(:disabled) {
  background: rgba(212, 165, 116, 0.25);
}
.preview-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.preview-page-indicator {
  font-size: 0.9rem;
  color: #8b7355;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
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
