<template>
  <div 
    class="game-scene" 
    :style="gameSceneStyle"
    :class="[
      { 'final-chapter-active': isFinalChapter },
      `time-${currentTimePeriod}`
    ]"
  >
    <div 
      class="fog-overlay" 
      :style="{ opacity: adjustedFogIntensity }"
    ></div>
    <div 
      class="fog-overlay fog-overlay-2" 
      :style="{ opacity: adjustedFogIntensity * 0.6 }"
    ></div>
    <div 
      v-if="combinedAtmosphere?.backgroundTint" 
      class="atmosphere-tint"
      :style="{ background: combinedAtmosphere.backgroundTint }"
    ></div>
    
    <div v-if="isNight" class="stars-overlay">
      <div v-for="i in 50" :key="i" class="star" :style="getStarStyle(i)"></div>
    </div>
    
    <Transition name="time-change">
      <div v-if="timePeriodChanged" class="time-period-toast">
        <span class="time-icon">{{ currentPeriodConfig?.icon }}</span>
        <span class="time-text">{{ currentPeriodConfig?.name }}来临</span>
      </div>
    </Transition>
    
    <div class="game-header">
      <div class="header-left">
        <div class="chapter-indicator">
          <span class="chapter-icon">{{ chapterIcon }}</span>
          <div class="chapter-info">
            <span class="chapter-name">{{ currentChapter?.name }}</span>
            <div class="chapter-progress-mini">
              <div class="mini-progress-fill" :style="{ width: chapterProgress + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="time-indicator" :class="`time-${currentTimePeriod}`">
          <span class="time-icon">{{ currentPeriodConfig?.icon }}</span>
          <span class="time-display">{{ formattedGameTime }}</span>
          <div class="time-progress-bar">
            <div class="time-progress-fill" :style="{ width: timeProgress + '%' }"></div>
          </div>
        </div>
        <Timer />
      </div>
      <div class="header-center">
        <div class="progress-bar" :class="{ 'challenge-mode': isChallengeMode }">
          <div class="progress-fill" :style="{ width: totalProgress + '%' }"></div>
          <span class="progress-text">{{ foundCount }}/{{ totalItems }} · 合成 {{ craftedCount }}/{{ totalCraftable }}</span>
        </div>
        <div v-if="isChallengeMode" class="challenge-mode-indicator">
          <span class="cmi-icon">🎯</span>
          <span class="cmi-text">纪念日挑战</span>
          <span class="cmi-date">{{ todayDate }}</span>
        </div>
      </div>
      <div class="header-right">
        <button v-if="isLetterSystemUnlocked" class="menu-btn letter-btn" @click="openLetterPanel" :title="'雾城来信'">
          ✉️
          <span v-if="!isLetterEndingReached && letterCurrentRound > 0" class="letter-badge">第{{ letterCurrentRound }}封</span>
        </button>
        <button class="menu-btn radio-btn" @click="openRadioPanel" :title="'雾城夜话'">
          📻
          <span v-if="radioActiveQuestsCount > 0" class="radio-badge">{{ radioActiveQuestsCount }}</span>
        </button>
        <button class="menu-btn crafting-btn" @click="openCraftingPanel" :title="'旧物合成'">
          ✨
          <span v-if="availableRecipesCount > 0" class="craft-badge">{{ availableRecipesCount }}</span>
        </button>
        <button class="menu-btn journal-btn" @click="openJournal" :title="'手账图鉴'">
          📖
        </button>
        <button class="menu-btn" @click="showMenu = !showMenu">
          ⋮
        </button>
      </div>
    </div>

    <div v-if="nextChapter" class="next-chapter-hint">
      <span class="hint-text">
        下一章节：{{ nextChapter.name }}
        <span class="hint-percent">(需 {{ nextChapter.requiredMemoryPercent }}% 回忆完成度)</span>
      </span>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="currentSceneId" class="scene-content">
        <h2 class="scene-title text-shadow">{{ currentScene?.name }}</h2>
        <p class="scene-description text-shadow" :style="sceneDescriptionStyle">{{ toneModifiedDescription }}</p>
        
        <div class="mood-indicator" :style="{ borderColor: moodStateColor }">
          <span class="mood-icon">{{ getMoodIcon(moodStateName) }}</span>
          <div class="mood-info">
            <span class="mood-label" :style="{ color: moodStateColor }">{{ moodStateName }}</span>
            <div class="mood-progress-bar">
              <div class="mood-progress-fill" :style="{ width: moodPercent + '%', background: moodStateColor }"></div>
            </div>
          </div>
          <span class="mood-value">{{ moodValue }}</span>
        </div>
        
        <div class="scene-items">
          <div
            v-for="item in visibleItemsForCurrentScene"
            :key="item.id"
            class="scene-item"
            :class="{ 
              found: isItemFound(item.id), 
              'item-glow': !isItemFound(item.id),
              'fog-hidden': isItemFogHidden(item.id),
              'fog-reveal': isFogRevealed(item.id),
              'challenge-item': isChallengeMode && !isItemFound(item.id)
            }"
            :style="{
              left: item.position.x + '%',
              top: item.position.y + '%',
              width: item.size.width + '%',
              height: item.size.height + '%',
              '--hint-glow-opacity': hintIntensity.glowOpacity,
              '--hint-scale': hintIntensity.hintScale,
              '--pulse-duration': hintIntensity.pulseSpeed + 's',
              '--fog-density': getFogDensity(item.id)
            }"
            @click="handleItemClick(item)"
            @mouseenter="handleItemHover(item.id, true)"
            @mouseleave="handleItemHover(item.id, false)"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <span v-if="!isItemFound(item.id)" class="item-hint" :title="getItemChallengeHint(item.id)">
              {{ isChallengeMode ? '✨' : '?' }}
            </span>
            <div v-if="isItemFogHidden(item.id)" class="item-fog-overlay"></div>
            <Transition name="hint-tooltip">
              <div 
                v-if="isChallengeMode && !isItemFound(item.id) && hoveredItemId === item.id" 
                class="challenge-hint-tooltip"
              >
                <span class="cht-icon">💡</span>
                <span class="cht-text">{{ getItemChallengeHint(item.id) }}</span>
              </div>
            </Transition>
          </div>

          <div
            v-for="fakeClue in visibleFakeCluesForCurrentScene"
            :key="fakeClue.id"
            class="scene-item fake-clue"
            :class="`fake-type-${fakeClue.type}`"
            :style="{
              left: fakeClue.position.x + '%',
              top: fakeClue.position.y + '%',
              width: fakeClue.size.width + '%',
              height: fakeClue.size.height + '%'
            }"
            @click="handleFakeClueClick(fakeClue)"
          >
            <span class="item-icon fake-icon">{{ fakeClue.icon }}</span>
            <span class="fake-hint">?</span>
            <div class="fake-fog-effect"></div>
          </div>
          
          <div v-if="visibleItemsForCurrentScene.length < (currentScene?.items?.length || 0)" class="time-hint">
            <span class="time-hint-icon">💡</span>
            <span class="time-hint-text">某些物品只在特定时间出现...</span>
          </div>

          <Transition name="fog-unlock">
            <div v-if="isAnyFogItemRecentlyUnlocked" class="fog-unlock-toast">
              <span class="fog-unlock-icon">✨</span>
              <span class="fog-unlock-text">迷雾散去，新的线索显现了...</span>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <div class="crafted-items-bar" v-if="craftedCount > 0">
      <div class="crafted-bar-label">已合成：</div>
      <div class="crafted-bar-items">
        <div
          v-for="craftId in craftedItems"
          :key="craftId"
          class="crafted-bar-item"
          :class="getCraftedRarityClass(craftId)"
          :title="getCraftedName(craftId)"
        >
          <span class="crafted-bar-icon">{{ getCraftedIcon(craftId) }}</span>
        </div>
      </div>
    </div>

    <div class="scene-nav">
      <button
          v-for="scene in availableScenesFiltered"
          :key="scene.id"
          class="nav-btn"
          :class="{ 
            'scene-locked': !isSceneAccessible(scene.id),
            'time-locked': isTimeLocked(scene.id)
          }"
          @click="isSceneAccessible(scene.id) && changeScene(scene.id)"
          :disabled="!isSceneAccessible(scene.id)"
          :title="getSceneLockTitle(scene.id)"
        >
          <span class="nav-arrow">
            {{ isSceneAccessible(scene.id) ? '→' : (isTimeLocked(scene.id) ? '⏰' : '🔒') }}
          </span>
          <span class="nav-name">{{ scene.name }}</span>
        </button>
    </div>

    <Transition name="fade">
      <div v-if="showMenu" class="menu-overlay" @click.self="showMenu = false">
        <div class="menu-panel">
          <h3 class="menu-title">游戏菜单</h3>
          <div class="menu-stats">
            <div class="stat-item chapter-stat">
              <span class="stat-label">当前章节</span>
              <span class="stat-value chapter-stat-value">
                <span class="chapter-stat-icon">{{ chapterIcon }}</span>
                {{ currentChapter?.name }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">回忆完成度</span>
              <span class="stat-value">{{ memoryProgressPercent }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">章节进度</span>
              <span class="stat-value">{{ chapterProgress }}%</span>
            </div>
            <div class="stat-item mood-stat-item">
              <span class="stat-label">
                <span class="stat-mood-icon">{{ getMoodIcon(moodStateName) }}</span>
                心绪状态
              </span>
              <span class="stat-value" :style="{ color: moodStateColor }">
                {{ moodStateName }} ({{ moodValue }})
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已找到物品</span>
              <span class="stat-value">{{ foundCount }}/{{ totalItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已合成道具</span>
              <span class="stat-value craft-stat">{{ craftedCount }}/{{ totalCraftable }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已触发回忆</span>
              <span class="stat-value">{{ triggeredMemories.length }}/{{ totalItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已解锁隐藏回忆</span>
              <span class="stat-value hm-stat">{{ unlockedHMCount }}/{{ totalHMCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">综合完成度</span>
              <span class="stat-value total-stat">{{ totalProgress }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">剩余时间</span>
              <span class="stat-value">{{ formattedTime }}</span>
            </div>
            <div class="stat-item time-stat-item">
              <span class="stat-label">
                <span class="stat-time-icon">{{ currentPeriodConfig?.icon }}</span>
                当前时间
              </span>
              <span class="stat-value" :style="{ color: currentPeriodConfig?.ambientColor }">
                {{ currentPeriodConfig?.name }} {{ formattedGameTime }}
              </span>
            </div>
          </div>
          <div class="menu-buttons">
            <button v-if="isLetterSystemUnlocked" class="menu-btn-item letter-menu-btn" @click="openLetterFromMenu">
              ✉️ 雾城来信
            </button>
            <button class="menu-btn-item radio-menu-btn" @click="openRadioFromMenu">
              📻 雾城夜话电台
            </button>
            <button class="menu-btn-item craft-menu-btn" @click="openCraftingFromMenu">
              ✨ 旧物合成工坊
            </button>
            <button class="menu-btn-item journal-menu-btn" @click="openJournalFromMenu">
              📖 手账图鉴
            </button>
            <button class="menu-btn-item archive-menu-btn" @click="openMemoryArchiveFromMenu">
              🏛️ 回忆档案馆
            </button>
            <button class="menu-btn-item" @click="saveAndContinue">
              💾 保存并继续
            </button>
            <button class="menu-btn-item" @click="confirmExit">
              🏠 返回主页
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="foundMessage" class="found-toast">
        <span class="toast-icon">{{ foundMessage.icon }}</span>
        <span class="toast-text">找到了 {{ foundMessage.name }}！</span>
      </div>
    </Transition>

    <Transition name="mood-fade">
      <div v-if="showMoodChange && lastMoodChange" class="mood-change-toast" :class="lastMoodChange.change > 0 ? 'mood-up' : 'mood-down'">
        <span class="mood-change-icon">{{ lastMoodChange.change > 0 ? '📈' : '📉' }}</span>
        <span class="mood-change-text">
          {{ lastMoodChange.change > 0 ? '心绪上升' : '心绪下降' }}
          <span class="mood-change-value">{{ lastMoodChange.change > 0 ? '+' : '' }}{{ lastMoodChange.change }}</span>
        </span>
        <span v-if="lastMoodChange.stateChanged" class="mood-state-change">
          → {{ getMoodStateName(lastMoodChange.newState) }}
        </span>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showFakeClueModal" class="fake-clue-modal" @click.self="closeFakeClueModal">
        <div class="fake-clue-panel">
          <div class="fake-clue-header">
            <span class="fake-clue-icon">{{ currentFakeClue?.icon }}</span>
            <h3 class="fake-clue-title">{{ currentFakeClue?.name }}</h3>
          </div>
          <div class="fake-clue-divider"></div>
          <p class="fake-clue-text">{{ currentFakeClue?.fakeText }}</p>
          <div class="fake-clue-penalty">
            <div class="penalty-item time-penalty" v-if="currentFakeClue?.timeCost">
              <span class="penalty-icon">⏱️</span>
              <span class="penalty-text">消耗时间 -{{ currentFakeClue.timeCost }}秒</span>
            </div>
            <div class="penalty-item mood-penalty" v-if="currentFakeClue?.moodEffect">
              <span class="penalty-icon">💭</span>
              <span class="penalty-text">心绪变化 {{ currentFakeClue.moodEffect > 0 ? '+' : '' }}{{ currentFakeClue.moodEffect }}</span>
            </div>
          </div>
          <button class="fake-clue-close-btn" @click="closeFakeClueModal">
            继续探索
          </button>
        </div>
      </div>
    </Transition>

    <MemoryModal />
    <CraftingModal />
    <ChapterNarration />
    <RadioPlayer @close="closeRadio" />
    
    <Transition name="fade">
      <div v-if="showCharacterProfile" class="character-modal-overlay" @click.self="closeCharacterProfile">
        <div class="character-modal-content">
          <button class="character-modal-close" @click="closeCharacterProfile">✕</button>
          <CharacterProfile />
        </div>
      </div>
    </Transition>
    
    <Transition name="slide-up">
      <div v-if="showCharacterUnlockNotice && newlyUnlockedCharacters.length > 0" class="character-unlock-notice">
        <div class="cun-icon">🎉</div>
        <div class="cun-content">
          <span class="cun-title">新人物档案解锁！</span>
          <span class="cun-names">{{ newlyUnlockedCharacters.map(c => c.name).join('、') }}</span>
        </div>
        <button class="cun-btn" @click="openCharacterProfileFromNotice">查看</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useStoryStore } from '../stores/storyStore'
import { useChallengeStore } from '../stores/challengeStore'
import Timer from './Timer.vue'
import MemoryModal from './MemoryModal.vue'
import CraftingModal from './CraftingModal.vue'
import ChapterNarration from './ChapterNarration.vue'
import CharacterProfile from './CharacterProfile.vue'
import RadioPlayer from './RadioPlayer.vue'

const gameStore = useGameStore()
const storyStore = useStoryStore()
const challengeStore = useChallengeStore()

const showMenu = ref(false)
const foundMessage = ref(null)
const hoveredItemId = ref(null)

const currentSceneId = computed(() => gameStore.currentSceneId)
const isChallengeMode = computed(() => gameStore.isChallengeMode)
const todayDate = computed(() => gameStore.todayDate)
const currentScene = computed(() => gameStore.currentScene)
const progress = computed(() => gameStore.progress)
const totalProgress = computed(() => gameStore.totalProgress)
const foundCount = computed(() => gameStore.foundCount)
const totalItems = computed(() => gameStore.totalItems)
const craftedCount = computed(() => gameStore.craftedCount)
const totalCraftable = computed(() => gameStore.totalCraftable)
const craftedItems = computed(() => gameStore.craftedItems)
const formattedTime = computed(() => gameStore.formattedTime)
const triggeredMemories = computed(() => gameStore.triggeredMemories)

const memoryProgressPercent = computed(() => gameStore.memoryProgressPercent)
const currentChapter = computed(() => gameStore.currentChapter)
const nextChapter = computed(() => gameStore.nextChapter)
const chapterProgress = computed(() => gameStore.chapterProgress)
const currentChapterAtmosphere = computed(() => gameStore.currentChapterAtmosphere)
const isFinalChapter = computed(() => gameStore.isFinalChapter)
const currentSceneDescription = computed(() => gameStore.getCurrentSceneDescription())

const moodStateName = computed(() => gameStore.moodStateName)
const moodStateColor = computed(() => gameStore.moodStateColor)
const moodPercent = computed(() => gameStore.moodPercent)
const moodValue = computed(() => gameStore.moodValue)
const hintIntensity = computed(() => gameStore.hintIntensity)
const showMoodChange = computed(() => gameStore.showMoodChange)
const lastMoodChange = computed(() => gameStore.lastMoodChange)
const textTone = computed(() => gameStore.textTone)

const currentTimePeriod = computed(() => gameStore.currentTimePeriod)
const currentPeriodConfig = computed(() => gameStore.currentPeriodConfig)
const formattedGameTime = computed(() => gameStore.formattedGameTime)
const isNight = computed(() => gameStore.isNight)
const isDay = computed(() => gameStore.isDay)
const timePeriodChanged = computed(() => gameStore.timePeriodChanged)
const timeProgress = computed(() => gameStore.timeProgress)
const combinedAtmosphere = computed(() => gameStore.combinedAtmosphere)
const visibleItemsForCurrentScene = computed(() => gameStore.visibleItemsForCurrentScene)
const visibleFakeCluesForCurrentScene = computed(() => gameStore.visibleFakeCluesForCurrentScene)
const showFakeClueModal = computed(() => gameStore.showFakeClueModal)
const currentFakeClue = computed(() => gameStore.currentFakeClue)
const isAnyFogItemRecentlyUnlocked = computed(() => gameStore.isAnyFogItemRecentlyUnlocked)

const isLetterSystemUnlocked = computed(() => gameStore.isLetterSystemUnlocked)
const letterCurrentRound = computed(() => gameStore.letterCurrentRound)
const isLetterEndingReached = computed(() => gameStore.isLetterEndingReached)

const isRadioOpen = computed(() => gameStore.isRadioOpen)
const radioActiveQuestsCount = computed(() => gameStore.radioActiveQuestsCount)
const radioTotalHeardFragments = computed(() => gameStore.radioTotalHeardFragments)
const radioTotalHeardRumors = computed(() => gameStore.radioTotalHeardRumors)

const showCharacterProfile = computed(() => gameStore.showCharacterProfile)
const showCharacterUnlockNotice = computed(() => gameStore.showCharacterUnlockNotice)
const newlyUnlockedCharacters = computed(() => gameStore.newlyUnlockedCharacters)

const sceneDescriptionStyle = computed(() => {
  const tone = textTone.value
  const style = {}
  if (tone.color) {
    style.color = tone.color
  }
  if (tone.italic) {
    style.fontStyle = 'italic'
  }
  return style
})

const toneModifiedDescription = computed(() => {
  const tone = textTone.value
  let desc = currentSceneDescription.value
  if (tone.prefix) {
    desc = tone.prefix + ' ' + desc
  }
  return desc
})

const unlockedHMCount = computed(() => gameStore.unlockedHiddenMemories.length)
const totalHMCount = computed(() => storyStore.getAllHiddenMemories().length)

const availableRecipesCount = computed(() => {
  const recipes = storyStore.getAllRecipes()
  return recipes.filter(r => gameStore.canCraftItem(r.id)).length
})

const chapterIcon = computed(() => {
  if (!currentChapter.value) return '📖'
  if (currentChapter.value.isFinalChapter) return '🌟'
  const icons = ['🚂', '👣', '☀️', '💍']
  return icons[currentChapter.value.id - 1] || '📖'
})

const adjustedFogIntensity = computed(() => {
  const baseFog = currentScene.value?.fogIntensity || 0.5
  const multiplier = combinedAtmosphere.value?.fogMultiplier || 1
  return Math.max(0, Math.min(1, baseFog * multiplier))
})

const gameSceneStyle = computed(() => {
  const style = {
    background: currentScene.value?.backgroundStyle
  }
  if (combinedAtmosphere.value) {
    if (combinedAtmosphere.value.brightness) {
      style.filter = `brightness(${combinedAtmosphere.value.brightness}) saturate(${combinedAtmosphere.value.saturation || 1})`
    }
  }
  return style
})

const availableScenes = computed(() => {
  return storyStore.getAvailableScenes(currentSceneId.value)
})

const availableScenesFiltered = computed(() => {
  return gameStore.getAvailableScenesForChapter()
})

function isSceneAccessible(sceneId) {
  return gameStore.isSceneAccessible(sceneId)
}

function isItemFound(itemId) {
  return gameStore.isItemFound(itemId)
}

function handleItemClick(item) {
  if (isItemFogHidden(item.id)) return
  if (!isItemFound(item.id)) {
    gameStore.findItem(item.id)
    showFoundMessage(item)
  }
  hoveredItemId.value = null
}

function handleItemHover(itemId, isEnter) {
  if (isEnter && !isItemFound(itemId)) {
    hoveredItemId.value = itemId
  } else if (!isEnter && hoveredItemId.value === itemId) {
    hoveredItemId.value = null
  }
}

function getItemChallengeHint(itemId) {
  const hint = storyStore.getChallengeHint(itemId)
  if (hint) return hint
  const item = storyStore.getItemById(itemId)
  return item?.hint || '仔细观察周围...'
}

function handleFakeClueClick(fakeClue) {
  gameStore.clickFakeClue(fakeClue.id)
}

function closeFakeClueModal() {
  gameStore.closeFakeClueModal()
}

function closeCharacterProfile() {
  gameStore.closeCharacterProfileModal()
}

function closeRadio() {
  gameStore.closeRadio()
}

function openCharacterProfileFromNotice() {
  gameStore.closeCharacterProfileModal()
  setTimeout(() => {
    gameStore.openCharacterProfileModal()
  }, 300)
}

function isItemFogHidden(itemId) {
  return gameStore.isItemFogHidden(itemId)
}

function isFogRevealed(itemId) {
  return gameStore.recentlyUnlockedFogItems.includes(itemId)
}

function getFogDensity(itemId) {
  const fogItem = storyStore.getFogHiddenItemByItemId(itemId)
  if (!fogItem) return 0
  return fogItem.fogDensity || 0.7
}

function showFoundMessage(item) {
  foundMessage.value = item
  setTimeout(() => {
    foundMessage.value = null
  }, 2000)
}

function changeScene(sceneId) {
  gameStore.changeScene(sceneId)
}

function openCraftingPanel() {
  gameStore.openCrafting()
}

function openCraftingFromMenu() {
  showMenu.value = false
  gameStore.openCrafting()
}

function openJournal() {
  gameStore.openJournal()
}

function openJournalFromMenu() {
  showMenu.value = false
  gameStore.openJournal()
}

function openLetterPanel() {
  gameStore.openLetterSystem()
}

function openLetterFromMenu() {
  showMenu.value = false
  gameStore.openLetterSystem()
}

function openRadioPanel() {
  gameStore.openRadio()
}

function openRadioFromMenu() {
  showMenu.value = false
  gameStore.openRadio()
}

function openMemoryArchiveFromMenu() {
  showMenu.value = false
  gameStore.openMemoryArchive()
}

function saveAndContinue() {
  gameStore.saveProgress()
  showMenu.value = false
}

function confirmExit() {
  if (confirm('确定要返回主页吗？进度已自动保存。')) {
    gameStore.returnToStart()
  }
}

function getCraftedIcon(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? item.icon : '❓'
}

function getCraftedName(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? item.name : '未知'
}

function getCraftedRarityClass(craftId) {
  const item = storyStore.getCraftedItemById(craftId)
  return item ? `bar-rarity-${item.rarity}` : ''
}

function getMoodIcon(moodName) {
  const icons = {
    '绝望': '💔',
    '阴郁': '🌧️',
    '平静': '😌',
    '温暖': '☀️',
    '希冀': '✨'
  }
  return icons[moodName] || '💭'
}

function getMoodStateName(stateId) {
  const names = {
    despair: '绝望',
    gloomy: '阴郁',
    calm: '平静',
    warm: '温暖',
    hopeful: '希冀'
  }
  return names[stateId] || stateId
}

function isTimeLocked(sceneId) {
  const chapterUnlocked = storyStore.isSceneUnlocked(sceneId, currentChapterId.value)
  if (!chapterUnlocked) return false
  
  const scene = storyStore.getSceneById(sceneId)
  if (!scene || !scene.accessiblePeriods) return false
  
  return !gameStore.isSceneAccessible(sceneId)
}

function getSceneLockTitle(sceneId) {
  const chapterUnlocked = storyStore.isSceneUnlocked(sceneId, currentChapterId.value)
  if (!chapterUnlocked) {
    return '需要完成更多回忆解锁此区域'
  }
  
  const scene = storyStore.getSceneById(sceneId)
  if (scene && scene.accessiblePeriods) {
    const periodNames = {
      dawn: '黎明',
      day: '白天',
      dusk: '黄昏',
      night: '夜晚'
    }
    const periods = scene.accessiblePeriods.map(p => periodNames[p]).join('、')
    return `此区域仅在${periods}可进入`
  }
  
  return ''
}

function getStarStyle(index) {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = Math.random() * 2 + 1
  const delay = Math.random() * 3
  const duration = Math.random() * 2 + 2
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.game-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease, filter 1s ease;
}

.game-scene.time-night {
  transition: filter 2s ease;
}

.stars-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.time-period-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: toastIn 0.5s ease;
}

.time-period-toast .time-icon {
  font-size: 1.5rem;
}

.time-period-toast .time-text {
  color: #e8e8f0;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.1rem;
}

.time-change-enter-active,
.time-change-leave-active {
  transition: all 0.5s ease;
}

.time-change-enter-from,
.time-change-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.time-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 8px;
  min-width: 100px;
  transition: all 0.5s ease;
}

.time-indicator.time-dawn {
  border-color: rgba(255, 180, 100, 0.3);
  background: rgba(255, 180, 100, 0.1);
}

.time-indicator.time-day {
  border-color: rgba(135, 206, 235, 0.3);
  background: rgba(135, 206, 235, 0.1);
}

.time-indicator.time-dusk {
  border-color: rgba(255, 140, 100, 0.3);
  background: rgba(255, 140, 100, 0.1);
}

.time-indicator.time-night {
  border-color: rgba(100, 100, 180, 0.3);
  background: rgba(20, 20, 60, 0.2);
}

.time-indicator .time-icon {
  font-size: 1.1rem;
}

.time-indicator .time-display {
  color: #e8e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: monospace;
  min-width: 45px;
}

.time-progress-bar {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.time-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb464, #87ceeb, #ff8c64, #1a1a4a);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.time-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(255, 200, 100, 0.3);
  animation: hintFloat 2s ease-in-out infinite;
}

.time-hint-icon {
  font-size: 0.9rem;
}

.time-hint-text {
  color: #d4a574;
  font-size: 0.75rem;
}

.nav-btn.time-locked {
  background: rgba(100, 80, 120, 0.4);
  border-color: rgba(180, 140, 200, 0.3);
}

.nav-btn.time-locked:hover {
  background: rgba(100, 80, 120, 0.4);
  border-color: rgba(180, 140, 200, 0.3);
}

.time-stat-item {
  border-top: 1px solid rgba(135, 206, 235, 0.2);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.stat-time-icon {
  margin-right: 4px;
}

.fog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 50%, rgba(220, 220, 240, 0.4) 0%, transparent 60%);
  animation: fog 15s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.fog-overlay-2 {
  animation-delay: -8s;
  background: radial-gradient(ellipse at 70% 40%, rgba(200, 200, 230, 0.3) 0%, transparent 50%);
}

.game-header {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  gap: 10px;
}

.header-left,
.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-center {
  flex: 1;
  max-width: 300px;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #d4a574);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

.menu-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.menu-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.crafting-btn {
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.2));
  border-color: rgba(212, 165, 116, 0.4);
}

.crafting-btn:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.3));
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.3);
}

.journal-btn {
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.2));
  border-color: rgba(102, 126, 234, 0.4);
}

.journal-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.3));
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
}

.letter-btn {
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.3), rgba(255, 152, 0, 0.2));
  border-color: rgba(255, 183, 77, 0.4);
}

.letter-btn:hover {
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.5), rgba(255, 152, 0, 0.3));
  box-shadow: 0 0 15px rgba(255, 183, 77, 0.3);
}

.letter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.radio-btn {
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.3), rgba(56, 142, 60, 0.2));
  border-color: rgba(129, 199, 132, 0.4);
}

.radio-btn:hover {
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.5), rgba(56, 142, 60, 0.3));
  box-shadow: 0 0 15px rgba(129, 199, 132, 0.3);
}

.radio-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #66bb6a, #388e3c);
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.craft-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badge-pulse 1.5s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.scene-content {
  position: relative;
  z-index: 10;
  height: calc(100% - 240px);
  padding: 20px;
}

.scene-title {
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: #fff;
  text-align: center;
  margin-bottom: 0.5rem;
  font-weight: 400;
  letter-spacing: 0.2rem;
}

.scene-description {
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  max-width: 90%;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.scene-items {
  position: relative;
  width: 100%;
  height: 60%;
}

.scene-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
}

.scene-item:not(.found):hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 200, 100, 0.6);
  transform: scale(calc(1.1 * var(--hint-scale, 1)));
}

.scene-item.item-glow {
  box-shadow: 0 0 15px rgba(255, 200, 100, calc(0.4 * var(--hint-glow-opacity, 0.7)));
  animation: itemGlow calc(var(--pulse-duration, 2s)) ease-in-out infinite;
}

@keyframes itemGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 200, 100, calc(0.3 * var(--hint-glow-opacity, 0.7)));
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 200, 100, calc(0.6 * var(--hint-glow-opacity, 0.7)));
  }
}

.scene-item.found {
  opacity: 0.4;
  cursor: default;
  background: rgba(100, 200, 100, 0.1);
  border-color: rgba(100, 200, 100, 0.3);
}

.item-icon {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
  transform: scale(var(--hint-scale, 1));
  transition: transform 0.3s ease;
}

.item-hint {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #d4a574;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  animation: pulse var(--pulse-duration, 2s) ease-in-out infinite;
  transform: scale(var(--hint-scale, 1));
  opacity: var(--hint-glow-opacity, 0.7);
}

.mood-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 2px solid;
  margin: 0 auto 1rem;
  max-width: 300px;
  transition: all 0.5s ease;
}

.mood-icon {
  font-size: 1.5rem;
  animation: moodFloat 3s ease-in-out infinite;
}

@keyframes moodFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.mood-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mood-label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
}

.mood-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.mood-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease, background 0.5s ease;
}

.mood-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #e8e8f0;
  min-width: 35px;
  text-align: right;
}

.mood-change-toast {
  position: fixed;
  top: 130px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1.5rem;
  backdrop-filter: blur(10px);
  border-radius: 30px;
  font-weight: 600;
  animation: toastIn 0.3s ease;
}

.mood-change-toast.mood-up {
  background: rgba(100, 200, 150, 0.9);
  border: 1px solid rgba(100, 200, 150, 0.5);
  color: white;
}

.mood-change-toast.mood-down {
  background: rgba(200, 100, 100, 0.9);
  border: 1px solid rgba(200, 100, 100, 0.5);
  color: white;
}

.mood-change-icon {
  font-size: 1.3rem;
}

.mood-change-text {
  font-size: 0.95rem;
}

.mood-change-value {
  font-weight: bold;
  margin-left: 4px;
}

.mood-state-change {
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  font-style: italic;
}

.mood-fade-enter-active,
.mood-fade-leave-active {
  transition: all 0.3s ease;
}

.mood-fade-enter-from,
.mood-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.stat-mood-icon {
  margin-right: 4px;
}

.mood-stat-item {
  border-top: 1px solid rgba(212, 165, 116, 0.2);
  padding-top: 0.75rem;
  margin-top: 0.5rem;
}

.scene-item.found .item-hint {
  display: none;
}

.crafted-items-bar {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.crafted-bar-label {
  color: #a0a0b0;
  font-size: 0.75rem;
  white-space: nowrap;
}

.crafted-bar-items {
  display: flex;
  gap: 4px;
}

.crafted-bar-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.crafted-bar-item:hover {
  transform: scale(1.15);
}

.crafted-bar-item.bar-rarity-legendary {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.crafted-bar-item.bar-rarity-epic {
  background: rgba(192, 132, 252, 0.15);
  border-color: rgba(192, 132, 252, 0.4);
  box-shadow: 0 0 8px rgba(192, 132, 252, 0.2);
}

.crafted-bar-item.bar-rarity-rare {
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
}

.crafted-bar-icon {
  font-size: 1.1rem;
}

.scene-nav {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 15px;
  max-width: 100%;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 25px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  font-size: clamp(0.8rem, 2.3vw, 0.95rem);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-btn:hover {
  background: rgba(102, 126, 234, 0.6);
  border-color: rgba(102, 126, 234, 0.8);
  transform: translateY(-2px);
}

.nav-arrow {
  font-size: 1rem;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  padding: 20px;
}

.menu-panel {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.98));
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.menu-title {
  color: #e8e8f0;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1rem;
}

.menu-stats {
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: #a0a0b0;
  font-size: 0.88rem;
}

.stat-value {
  color: #e8e8f0;
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-value.craft-stat {
  color: #d4a574;
}

.stat-value.hm-stat {
  color: #fbbf24;
}

.stat-value.total-stat {
  color: #667eea;
  font-size: 1rem;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.menu-btn-item {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-btn-item:hover {
  background: rgba(102, 126, 234, 0.4);
}

.craft-menu-btn {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.2));
  border: 1px solid rgba(212, 165, 116, 0.3);
  color: #e8c89a;
}

.craft-menu-btn:hover {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.3));
}

.radio-menu-btn {
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.3), rgba(56, 142, 60, 0.2));
  border: 1px solid rgba(129, 199, 132, 0.3);
  color: #a5d6a7;
}

.radio-menu-btn:hover {
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.5), rgba(56, 142, 60, 0.3));
}

.journal-menu-btn {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.2));
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a5b4fc;
}

.journal-menu-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.3));
}

.archive-menu-btn {
  background: linear-gradient(135deg, rgba(96, 165, 150, 0.3), rgba(60, 130, 120, 0.2));
  border: 1px solid rgba(96, 165, 150, 0.35);
  color: #9ac8c0;
}

.archive-menu-btn:hover {
  background: linear-gradient(135deg, rgba(96, 165, 150, 0.5), rgba(60, 130, 120, 0.3));
}

.found-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(100, 200, 100, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  color: white;
  font-weight: 600;
  animation: toastIn 0.3s ease;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-icon {
  font-size: 1.5rem;
}

.atmosphere-tint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  transition: background 1s ease;
}

.chapter-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 8px;
}

.final-chapter-active .chapter-indicator {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.3);
  animation: finalChapterPulse 2s ease-in-out infinite;
}

@keyframes finalChapterPulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
}

.chapter-icon {
  font-size: 1.2rem;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #d4a574;
  white-space: nowrap;
}

.final-chapter-active .chapter-name {
  color: #ffd700;
}

.chapter-progress-mini {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4a574, #ffd700);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.next-chapter-hint {
  position: absolute;
  top: 75px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: hintFloat 3s ease-in-out infinite;
}

@keyframes hintFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}

.hint-text {
  font-size: 0.72rem;
  color: #a0a0b0;
}

.hint-percent {
  color: #d4a574;
  font-weight: 600;
  margin-left: 4px;
}

.nav-btn.scene-locked {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(100, 100, 120, 0.4);
}

.nav-btn.scene-locked:hover {
  background: rgba(100, 100, 120, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
  transform: none;
}

.nav-btn.scene-locked .nav-arrow {
  opacity: 0.7;
}

.chapter-stat {
  border-top: 1px solid rgba(212, 165, 116, 0.2);
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.chapter-stat-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d4a574;
}

.final-chapter-active .chapter-stat-value {
  color: #ffd700;
}

.chapter-stat-icon {
  font-size: 1.1rem;
}

.fake-clue {
  cursor: pointer;
  opacity: 0.7;
  filter: blur(1px);
  animation: fakeCluePulse 3s ease-in-out infinite;
}

.fake-clue:hover {
  opacity: 0.9;
  filter: blur(0.5px);
  transform: scale(1.05);
  border-color: rgba(255, 150, 150, 0.5);
}

.fake-clue .fake-icon {
  opacity: 0.6;
  filter: blur(0.5px);
}

.fake-clue .fake-hint {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: rgba(200, 100, 100, 0.7);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
}

.fake-fog-effect {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(200, 150, 150, 0.2) 0%, transparent 60%);
  pointer-events: none;
  animation: fakeFogDrift 4s ease-in-out infinite;
}

@keyframes fakeCluePulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

@keyframes fakeFogDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5%, -3%) scale(1.05); }
}

.fake-type-mirage {
  animation: mirageShimmer 2.5s ease-in-out infinite;
}

@keyframes mirageShimmer {
  0%, 100% { filter: blur(1px) hue-rotate(0deg); }
  50% { filter: blur(0.5px) hue-rotate(5deg); }
}

.scene-item.fog-hidden {
  pointer-events: none;
  cursor: not-allowed;
}

.scene-item.fog-hidden .item-icon {
  opacity: 0.15;
  filter: blur(4px);
  transform: scale(0.8);
}

.scene-item.fog-hidden .item-hint {
  display: none;
}

.item-fog-overlay {
  position: absolute;
  top: -30%;
  left: -30%;
  width: 160%;
  height: 160%;
  background: radial-gradient(circle, rgba(180, 180, 220, calc(0.4 * var(--fog-density, 0.7))) 0%, transparent 65%);
  pointer-events: none;
  animation: itemFogSwirl 5s ease-in-out infinite;
  z-index: 5;
}

@keyframes itemFogSwirl {
  0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
  25% { transform: translate(3%, -2%) rotate(5deg) scale(1.03); }
  50% { transform: translate(-2%, -4%) rotate(-3deg) scale(1.06); }
  75% { transform: translate(-4%, 1%) rotate(3deg) scale(1.02); }
}

.scene-item.fog-reveal {
  animation: fogReveal 2s ease-out forwards;
}

.scene-item.fog-reveal .item-fog-overlay {
  animation: fogRevealOverlay 2s ease-out forwards;
}

.scene-item.fog-reveal .item-icon {
  animation: fogRevealIcon 2s ease-out forwards;
}

@keyframes fogReveal {
  0% { pointer-events: none; }
  100% { pointer-events: auto; }
}

@keyframes fogRevealOverlay {
  0% { opacity: 1; }
  60% { opacity: 0.3; }
  100% { opacity: 0; }
}

@keyframes fogRevealIcon {
  0% { opacity: 0.15; filter: blur(4px); transform: scale(0.8); }
  50% { opacity: 0.5; filter: blur(2px); transform: scale(1.1); }
  100% { opacity: 1; filter: blur(0); transform: scale(1); }
}

.fog-unlock-toast {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.9), rgba(255, 215, 0, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: white;
  font-weight: 600;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

.fog-unlock-icon {
  font-size: 1.3rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

.fog-unlock-text {
  font-size: 0.9rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
}

.fog-unlock-enter-active {
  animation: fogUnlockIn 0.6s ease-out;
}

.fog-unlock-leave-active {
  animation: fogUnlockOut 0.4s ease-in;
}

@keyframes fogUnlockIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes fogUnlockOut {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px) scale(0.9);
  }
}

.fake-clue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.fake-clue-panel {
  background: linear-gradient(145deg, rgba(40, 30, 40, 0.98), rgba(30, 25, 35, 0.99));
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(200, 100, 100, 0.3);
  box-shadow: 0 0 40px rgba(200, 100, 100, 0.2);
  animation: fakeClueModalIn 0.4s ease-out;
}

@keyframes fakeClueModalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fake-clue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.fake-clue-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px rgba(200, 100, 100, 0.5));
}

.fake-clue-title {
  color: #e8b4b4;
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.1rem;
}

.fake-clue-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200, 100, 100, 0.5), transparent);
  margin: 0 auto 1.5rem;
}

.fake-clue-text {
  color: #c0b0c0;
  font-size: 0.95rem;
  line-height: 1.8;
  text-align: justify;
  text-indent: 2em;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.fake-clue-penalty {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(200, 100, 100, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(200, 100, 100, 0.2);
  margin-bottom: 1.5rem;
}

.penalty-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.penalty-icon {
  font-size: 1.1rem;
}

.time-penalty .penalty-text {
  color: #f0a0a0;
}

.mood-penalty .penalty-text {
  color: #a0a0f0;
}

.fake-clue-close-btn {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(200, 100, 100, 0.3), rgba(150, 80, 80, 0.2));
  color: #e8c8c8;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 100, 100, 0.3);
  letter-spacing: 0.1rem;
}

.fake-clue-close-btn:hover {
  background: linear-gradient(135deg, rgba(200, 100, 100, 0.4), rgba(150, 80, 80, 0.3));
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(200, 100, 100, 0.3);
}

.challenge-mode-indicator {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 10px;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(255, 215, 0, 0.15));
  border-radius: 12px;
  border: 1px solid rgba(212, 165, 116, 0.4);
  animation: challengePulse 2s ease-in-out infinite;
}

.cmi-icon {
  font-size: 0.9rem;
}

.cmi-text {
  color: #d4a574;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
}

.cmi-date {
  color: #e8c89a;
  font-size: 0.68rem;
  font-family: monospace;
  padding-left: 4px;
  border-left: 1px solid rgba(212, 165, 116, 0.3);
}

@keyframes challengePulse {
  0%, 100% { box-shadow: 0 0 8px rgba(212, 165, 116, 0.2); }
  50% { box-shadow: 0 0 16px rgba(255, 215, 0, 0.3); }
}

.progress-bar.challenge-mode {
  background: linear-gradient(90deg, rgba(30, 20, 10, 0.6), rgba(50, 35, 15, 0.6));
  border-color: rgba(212, 165, 116, 0.3);
}

.progress-bar.challenge-mode .progress-fill {
  background: linear-gradient(90deg, #d4a574, #ffd700, #ff8c00);
}

.scene-item.challenge-item {
  border-color: rgba(255, 215, 0, 0.3);
  background: rgba(255, 215, 0, 0.05);
}

.scene-item.challenge-item:hover {
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.scene-item.challenge-item .item-hint {
  background: linear-gradient(135deg, #d4a574, #ffd700);
  animation: challengeHintPulse 1.5s ease-in-out infinite;
}

@keyframes challengeHintPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 6px rgba(255, 215, 0, 0.5); }
  50% { transform: scale(1.1); box-shadow: 0 0 12px rgba(255, 215, 0, 0.8); }
}

.challenge-hint-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  max-width: 250px;
  padding: 10px 14px;
  background: linear-gradient(145deg, rgba(30, 25, 15, 0.98), rgba(50, 35, 20, 0.98));
  border-radius: 12px;
  border: 1px solid rgba(212, 165, 116, 0.5);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 165, 116, 0.2);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  pointer-events: none;
}

.challenge-hint-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: rgba(212, 165, 116, 0.5);
}

.cht-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.cht-text {
  color: #e8d8c0;
  font-size: 0.8rem;
  line-height: 1.5;
  font-style: italic;
  text-align: left;
}

.hint-tooltip-enter-active,
.hint-tooltip-leave-active {
  transition: all 0.2s ease;
}

.hint-tooltip-enter-from,
.hint-tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

.character-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(6px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.character-modal-content {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: linear-gradient(180deg, #1f1830 0%, #1a1520 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  animation: characterModalIn 0.4s ease-out;
}

@keyframes characterModalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.character-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: #a0a0b0;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.character-modal-close:hover {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.4);
  color: #fca5a5;
}

.character-unlock-notice {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
  border: 1px solid rgba(165, 180, 252, 0.5);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 2000;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  animation: noticeSlideUp 0.5s ease-out;
}

@keyframes noticeSlideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.cun-icon {
  font-size: 2rem;
}

.cun-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cun-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.cun-names {
  font-size: 0.8rem;
  color: #c7d2fe;
}

.cun-btn {
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cun-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
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
