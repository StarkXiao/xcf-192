import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useArchiveStore } from './archiveStore'
import { useGameStore } from './gameStore'
import { useStoryStore } from './storyStore'

const JOURNAL_KEY = 'foggy_city_reunion_journal'

export const useJournalStore = defineStore('journal', () => {
  const archiveStore = useArchiveStore()
  const gameStore = useGameStore()
  const storyStore = useStoryStore()

  const organizedItems = ref([])
  const dialogExcerpts = ref([])
  const photoCollages = ref([])
  const memoryBooks = ref([])
  const itemTags = ref({})
  const itemNotes = ref({})

  function init() {
    try {
      const data = localStorage.getItem(JOURNAL_KEY)
      if (!data) return
      const parsed = JSON.parse(data)
      organizedItems.value = parsed.organizedItems || []
      dialogExcerpts.value = parsed.dialogExcerpts || []
      photoCollages.value = parsed.photoCollages || []
      memoryBooks.value = parsed.memoryBooks || []
      itemTags.value = parsed.itemTags || {}
      itemNotes.value = parsed.itemNotes || {}
    } catch (e) {
      console.error('读取手账数据失败:', e)
    }
  }

  function persist() {
    try {
      const data = {
        organizedItems: organizedItems.value,
        dialogExcerpts: dialogExcerpts.value,
        photoCollages: photoCollages.value,
        memoryBooks: memoryBooks.value,
        itemTags: itemTags.value,
        itemNotes: itemNotes.value
      }
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('保存手账数据失败:', e)
    }
  }

  function getAllUnlockedItems() {
    const items = []
    for (const scene of storyStore.getAllScenes()) {
      for (const item of scene.items) {
        const unlocked = gameStore.isItemFound(item.id) || archiveStore.isMemoryEverTriggered(
          storyStore.getMemoryByItemId(item.id)?.id
        )
        if (unlocked) {
          const memory = storyStore.getMemoryByItemId(item.id)
          items.push({
            ...item,
            sceneName: scene.name,
            sceneId: scene.id,
            memoryId: memory?.id,
            memoryTitle: memory?.title
          })
        }
      }
    }

    try {
      const craftedList = storyStore.getAllCraftedItems()
      for (const craft of craftedList) {
        if (gameStore.isCrafted(craft.id) || archiveStore.isCraftedItemEverObtained(craft.id)) {
          items.push({
            ...craft,
            sceneName: '合成工坊',
            sceneId: 'craft',
            isCrafted: true
          })
        }
      }
    } catch (e) {}

    return items
  }

  function getAllUnlockedMemories() {
    const memories = []
    const normalMemories = storyStore.getAllMemories()
    for (const m of normalMemories) {
      if (gameStore.triggeredMemories.includes(m.id) || archiveStore.isMemoryEverTriggered(m.id)) {
        const item = storyStore.getItemById(m.triggerItemId)
        memories.push({
          ...m,
          isHidden: false,
          itemName: item?.name,
          itemIcon: item?.icon
        })
      }
    }

    try {
      const hiddenMemories = storyStore.getAllHiddenMemories()
      for (const hm of hiddenMemories) {
        if (gameStore.isHiddenMemoryUnlocked(hm.id) || archiveStore.isHiddenMemoryEverUnlocked(hm.id)) {
          memories.push({
            ...hm,
            isHidden: true,
            itemName: '隐藏回忆',
            itemIcon: '✨'
          })
        }
      }
    } catch (e) {}

    return memories
  }

  function organizeItem(itemId, category, order = 0) {
    const existing = organizedItems.value.find(o => o.itemId === itemId)
    if (existing) {
      existing.category = category
      existing.order = order
      existing.updatedAt = Date.now()
    } else {
      organizedItems.value.push({
        itemId,
        category,
        order,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    }
    persist()
  }

  function setItemTags(itemId, tags) {
    itemTags.value[itemId] = tags
    persist()
  }

  function getItemTags(itemId) {
    return itemTags.value[itemId] || []
  }

  function setItemNote(itemId, note) {
    itemNotes.value[itemId] = note
    persist()
  }

  function getItemNote(itemId) {
    return itemNotes.value[itemId] || ''
  }

  function removeOrganizedItem(itemId) {
    organizedItems.value = organizedItems.value.filter(o => o.itemId !== itemId)
    persist()
  }

  const organizedItemsByCategory = computed(() => {
    const categories = {
      important: [],
      memory: [],
      daily: [],
      collection: [],
      uncategorized: []
    }
    const allItems = getAllUnlockedItems()
    for (const item of allItems) {
      const organized = organizedItems.value.find(o => o.itemId === item.id)
      const category = organized?.category || 'uncategorized'
      if (categories[category]) {
        categories[category].push({
          ...item,
          organized,
          tags: getItemTags(item.id),
          note: getItemNote(item.id)
        })
      }
    }
    return categories
  })

  function addDialogExcerpt(memoryId, text, character, note = '') {
    const memory = getAllUnlockedMemories().find(m => m.id === memoryId)
    if (!memory) return null

    const excerpt = {
      id: `excerpt_${Date.now()}`,
      memoryId,
      memoryTitle: memory.title,
      text,
      character,
      note,
      createdAt: Date.now()
    }
    dialogExcerpts.value.push(excerpt)
    persist()
    return excerpt
  }

  function updateDialogExcerpt(excerptId, updates) {
    const excerpt = dialogExcerpts.value.find(e => e.id === excerptId)
    if (excerpt) {
      Object.assign(excerpt, updates)
      excerpt.updatedAt = Date.now()
      persist()
    }
  }

  function removeDialogExcerpt(excerptId) {
    dialogExcerpts.value = dialogExcerpts.value.filter(e => e.id !== excerptId)
    persist()
  }

  const dialogExcerptsByMemory = computed(() => {
    const grouped = {}
    for (const excerpt of dialogExcerpts.value) {
      if (!grouped[excerpt.memoryId]) {
        grouped[excerpt.memoryId] = []
      }
      grouped[excerpt.memoryId].push(excerpt)
    }
    return grouped
  })

  function createPhotoCollage(title, description = '') {
    const collage = {
      id: `collage_${Date.now()}`,
      title,
      description,
      photos: [],
      layout: 'grid',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    photoCollages.value.push(collage)
    persist()
    return collage
  }

  function addPhotoToCollage(collageId, itemId, position = { x: 0, y: 0 }, size = { width: 100, height: 100 }) {
    const collage = photoCollages.value.find(c => c.id === collageId)
    const item = getAllUnlockedItems().find(i => i.id === itemId)
    if (!collage || !item) return null

    const photo = {
      id: `photo_${Date.now()}`,
      itemId,
      itemIcon: item.icon,
      itemName: item.name,
      position,
      size,
      rotation: 0,
      filter: 'none'
    }
    collage.photos.push(photo)
    collage.updatedAt = Date.now()
    persist()
    return photo
  }

  function updatePhotoInCollage(collageId, photoId, updates) {
    const collage = photoCollages.value.find(c => c.id === collageId)
    if (!collage) return
    const photo = collage.photos.find(p => p.id === photoId)
    if (photo) {
      Object.assign(photo, updates)
      collage.updatedAt = Date.now()
      persist()
    }
  }

  function removePhotoFromCollage(collageId, photoId) {
    const collage = photoCollages.value.find(c => c.id === collageId)
    if (!collage) return
    collage.photos = collage.photos.filter(p => p.id !== photoId)
    collage.updatedAt = Date.now()
    persist()
  }

  function updateCollage(collageId, updates) {
    const collage = photoCollages.value.find(c => c.id === collageId)
    if (collage) {
      Object.assign(collage, updates)
      collage.updatedAt = Date.now()
      persist()
    }
  }

  function removeCollage(collageId) {
    photoCollages.value = photoCollages.value.filter(c => c.id !== collageId)
    persist()
  }

  function createMemoryBook(title, theme = 'nostalgic') {
    const book = {
      id: `book_${Date.now()}`,
      title,
      theme,
      pages: [],
      coverStyle: 'classic',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    memoryBooks.value.push(book)
    persist()
    return book
  }

  function addPageToBook(bookId, pageType, content = {}) {
    const book = memoryBooks.value.find(b => b.id === bookId)
    if (!book) return null

    const page = {
      id: `page_${Date.now()}`,
      type: pageType,
      content,
      createdAt: Date.now()
    }
    book.pages.push(page)
    book.updatedAt = Date.now()
    persist()
    return page
  }

  function updatePageInBook(bookId, pageId, content) {
    const book = memoryBooks.value.find(b => b.id === bookId)
    if (!book) return
    const page = book.pages.find(p => p.id === pageId)
    if (page) {
      page.content = { ...page.content, ...content }
      book.updatedAt = Date.now()
      persist()
    }
  }

  function removePageFromBook(bookId, pageId) {
    const book = memoryBooks.value.find(b => b.id === bookId)
    if (!book) return
    book.pages = book.pages.filter(p => p.id !== pageId)
    book.updatedAt = Date.now()
    persist()
  }

  function reorderPagesInBook(bookId, fromIndex, toIndex) {
    const book = memoryBooks.value.find(b => b.id === bookId)
    if (!book) return
    const [removed] = book.pages.splice(fromIndex, 1)
    book.pages.splice(toIndex, 0, removed)
    book.updatedAt = Date.now()
    persist()
  }

  function updateMemoryBook(bookId, updates) {
    const book = memoryBooks.value.find(b => b.id === bookId)
    if (book) {
      Object.assign(book, updates)
      book.updatedAt = Date.now()
      persist()
    }
  }

  function removeMemoryBook(bookId) {
    memoryBooks.value = memoryBooks.value.filter(b => b.id !== bookId)
    persist()
  }

  function generateAutoMemoryBook() {
    const memories = getAllUnlockedMemories()
    const items = getAllUnlockedItems()

    if (memories.length === 0 && items.length === 0) return null

    const book = createMemoryBook('我的雾城回忆', 'nostalgic')

    addPageToBook(book.id, 'cover', {
      title: '雾城手账',
      subtitle: '一段关于重逢的旅程',
      date: new Date().toLocaleDateString('zh-CN')
    })

    const sortedMemories = [...memories].sort((a, b) => a.year - b.year)
    for (const memory of sortedMemories) {
      addPageToBook(book.id, 'memory', {
        memoryId: memory.id,
        title: memory.title,
        year: memory.year,
        emotion: memory.emotion,
        content: memory.content,
        itemIcon: memory.itemIcon,
        itemName: memory.itemName
      })
    }

    const categories = organizedItemsByCategory.value
    for (const [cat, catItems] of Object.entries(categories)) {
      if (catItems.length > 0) {
        addPageToBook(book.id, 'items', {
          category: cat,
          categoryName: getCategoryName(cat),
          items: catItems.map(i => ({
            id: i.id,
            name: i.name,
            icon: i.icon,
            note: i.note,
            tags: i.tags
          }))
        })
      }
    }

    if (dialogExcerpts.value.length > 0) {
      addPageToBook(book.id, 'excerpts', {
        excerpts: dialogExcerpts.value.slice(0, 6).map(e => ({
          id: e.id,
          text: e.text,
          character: e.character,
          memoryTitle: e.memoryTitle
        }))
      })
    }

    addPageToBook(book.id, 'summary', {
      totalMemories: memories.length,
      totalItems: items.length,
      totalExcerpts: dialogExcerpts.value.length,
      totalCollages: photoCollages.value.length,
      completionRate: Math.round(((memories.length + items.length) / 48) * 100)
    })

    return book
  }

  function getCategoryName(category) {
    const names = {
      important: '重要物品',
      memory: '回忆载体',
      daily: '日常点滴',
      collection: '珍藏收藏',
      uncategorized: '未分类'
    }
    return names[category] || category
  }

  function clearJournal() {
    organizedItems.value = []
    dialogExcerpts.value = []
    photoCollages.value = []
    memoryBooks.value = []
    itemTags.value = {}
    itemNotes.value = {}
    try {
      localStorage.removeItem(JOURNAL_KEY)
    } catch (e) {
      console.error('清除手账数据失败:', e)
    }
  }

  function getJournalStats() {
    return {
      totalItems: getAllUnlockedItems().length,
      totalMemories: getAllUnlockedMemories().length,
      organizedItems: organizedItems.value.length,
      dialogExcerpts: dialogExcerpts.value.length,
      photoCollages: photoCollages.value.length,
      memoryBooks: memoryBooks.value.length,
      totalTags: Object.keys(itemTags.value).length,
      totalNotes: Object.keys(itemNotes.value).length
    }
  }

  init()

  return {
    organizedItems,
    dialogExcerpts,
    photoCollages,
    memoryBooks,
    itemTags,
    itemNotes,
    organizedItemsByCategory,
    dialogExcerptsByMemory,
    init,
    persist,
    getAllUnlockedItems,
    getAllUnlockedMemories,
    organizeItem,
    setItemTags,
    getItemTags,
    setItemNote,
    getItemNote,
    removeOrganizedItem,
    addDialogExcerpt,
    updateDialogExcerpt,
    removeDialogExcerpt,
    createPhotoCollage,
    addPhotoToCollage,
    updatePhotoInCollage,
    removePhotoFromCollage,
    updateCollage,
    removeCollage,
    createMemoryBook,
    addPageToBook,
    updatePageInBook,
    removePageFromBook,
    reorderPagesInBook,
    updateMemoryBook,
    removeMemoryBook,
    generateAutoMemoryBook,
    getCategoryName,
    clearJournal,
    getJournalStats
  }
})
