<template>
  <div class="character-profile">
    <div class="cp-header">
      <h2 class="cp-title">
        <span>👤</span>
        人物侧写
      </h2>
      <p class="cp-desc">雾城中的每一个人，都有一段不为人知的过往</p>
    </div>

    <div class="cp-progress-strip">
      <div class="cp-progress-card">
        <div class="cp-prog-icon">📜</div>
        <div class="cp-prog-info">
          <span class="cp-prog-value">{{ characterStore.overallProgress }}%</span>
          <span class="cp-prog-label">档案解锁</span>
        </div>
        <div class="cp-prog-bar">
          <div class="cp-prog-fill" :style="{ width: characterStore.overallProgress + '%' }"></div>
        </div>
      </div>
      <div class="cp-progress-card">
        <div class="cp-prog-icon">🎭</div>
        <div class="cp-prog-info">
          <span class="cp-prog-value">{{ unlockedCharacters.length }}</span>
          <span class="cp-prog-label">已解锁角色</span>
        </div>
        <div class="cp-prog-bar">
          <div class="cp-prog-fill" :style="{ width: (unlockedCharacters.length / totalCharacters * 100) + '%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }"></div>
        </div>
      </div>
      <div class="cp-progress-card">
        <div class="cp-prog-icon">🔗</div>
        <div class="cp-prog-info">
          <span class="cp-prog-value">{{ totalUnlockedRelationships }}</span>
          <span class="cp-prog-label">关系揭示</span>
        </div>
        <div class="cp-prog-bar">
          <div class="cp-prog-fill" :style="{ width: (totalUnlockedRelationships / totalRelationships * 100) + '%', background: 'linear-gradient(90deg, #c084fc, #8b5cf6)' }"></div>
        </div>
      </div>
      <div class="cp-progress-card">
        <div class="cp-prog-icon">🔚</div>
        <div class="cp-prog-info">
          <span class="cp-prog-value">{{ availableEndings.filter(e => e.unlocked).length }}</span>
          <span class="cp-prog-label">结局可达成</span>
        </div>
        <div class="cp-prog-bar">
          <div class="cp-prog-fill" :style="{ width: (availableEndings.filter(e => e.unlocked).length / availableEndings.length * 100) + '%', background: 'linear-gradient(90deg, #86efac, #22c55e)' }"></div>
        </div>
      </div>
    </div>

    <div class="cp-characters-section">
      <div class="cp-section-header">
        <h3 class="cp-section-title">角色档案</h3>
        <span class="cp-section-count">{{ unlockedCharacters.length }}/{{ totalCharacters }} 已解锁</span>
      </div>

      <div class="cp-characters-grid">
        <div
          v-for="char in allCharacters"
          :key="char.id"
          class="cp-character-card"
          :class="{
            unlocked: isCharacterUnlocked(char.id),
            selected: currentCharacterId === char.id
          }"
          @click="selectCharacter(char)"
        >
          <div class="cp-char-avatar" :style="{ borderColor: getCharacterColor(char.id) }">
            <span class="cp-char-icon">{{ isCharacterUnlocked(char.id) ? char.icon : '❓' }}</span>
          </div>
          <div class="cp-char-info">
            <h4 class="cp-char-name">{{ isCharacterUnlocked(char.id) ? char.name : '???' }}</h4>
            <span class="cp-char-role">{{ isCharacterUnlocked(char.id) ? char.role : '未解锁' }}</span>
          </div>
          <div v-if="isCharacterUnlocked(char.id)" class="cp-char-progress">
            <div class="cp-cp-bar">
              <div class="cp-cp-fill" :style="{ width: getCharacterProgress(char.id) + '%', background: getCharacterColor(char.id) }"></div>
            </div>
            <span class="cp-cp-text">{{ getCharacterProgress(char.id) }}%</span>
          </div>
          <div v-else class="cp-char-lock">
            <span class="cp-lock-icon">🔒</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentProfile" class="cp-detail-section">
      <div class="cp-detail-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="cp-tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <span class="cp-tab-icon">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>

      <div v-show="activeTab === 'profile'" class="cp-tab-content">
        <div class="cp-profile-header">
          <div class="cp-profile-avatar" :style="{ borderColor: getCharacterColor(currentProfile.id), background: getCharacterColor(currentProfile.id) + '20' }">
            <span class="cp-pa-icon">{{ currentProfile.icon }}</span>
          </div>
          <div class="cp-profile-info">
            <h3 class="cp-profile-name">{{ currentProfile.name }}</h3>
            <div class="cp-profile-tags">
              <span class="cp-p-tag">「{{ currentProfile.nickname }}」</span>
              <span class="cp-p-tag cp-age">{{ currentProfile.age }}岁</span>
              <span class="cp-p-tag cp-occupation">{{ currentProfile.occupation }}</span>
            </div>
            <p class="cp-profile-quote">"{{ currentProfile.quote }}"</p>
          </div>
        </div>

        <div class="cp-profile-bio">
          <h4 class="cp-sub-title">📝 人物简介</h4>
          <p class="cp-bio-text">{{ currentProfile.biography }}</p>
        </div>

        <div class="cp-personality-section">
          <h4 class="cp-sub-title">🎯 性格特质</h4>
          <div class="cp-traits-grid">
            <div v-for="trait in currentProfile.personalityTraits" :key="trait.name" class="cp-trait-item">
              <div class="cp-trait-header">
                <span class="cp-trait-name">{{ trait.name }}</span>
                <span class="cp-trait-score">{{ trait.score }}%</span>
              </div>
              <div class="cp-trait-bar">
                <div class="cp-trait-fill" :style="{ width: trait.score + '%', background: getTraitColor(trait.score) }"></div>
              </div>
              <span class="cp-trait-desc">{{ trait.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'timeline'" class="cp-tab-content">
        <h4 class="cp-sub-title">⏳ 成长时间线</h4>
        <div class="cp-timeline-container">
          <div v-for="(item, index) in sortedTimeline" :key="item.year + item.title" class="cp-timeline-item">
            <div class="cp-tl-dot" :style="{ background: item.isKeyEvent ? '#fbbf24' : getCharacterColor(currentProfile.id) }"></div>
            <div class="cp-tl-line" v-if="index < sortedTimeline.length - 1"></div>
            <div class="cp-tl-content">
              <div class="cp-tl-header">
                <span class="cp-tl-year">{{ item.year }}年</span>
                <span v-if="item.isKeyEvent" class="cp-tl-key-marker">⭐ 关键事件</span>
                <span v-if="item.isTurningPoint" class="cp-tl-turn-marker">🔄 转折点</span>
              </div>
              <h5 class="cp-tl-title">{{ item.title }}</h5>
              <p class="cp-tl-desc">{{ item.description }}</p>
              <div v-if="item.impact" class="cp-tl-impact">
                <span class="cp-impact-label">影响：</span>
                <span class="cp-impact-text">{{ item.impact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'relationships'" class="cp-tab-content">
        <h4 class="cp-sub-title">🔗 人物关系</h4>
        <div class="cp-relationships-grid">
          <div v-for="rel in currentProfile.unlockedRelationships" :key="rel.targetId" class="cp-relationship-card" :class="`rel-${rel.type}`">
            <div class="cp-rel-header">
              <div class="cp-rel-avatar" :style="{ borderColor: relationshipMap[rel.type]?.color }">
                <span class="cp-rel-icon">{{ getTargetCharacter(rel.targetId)?.icon || '👤' }}</span>
              </div>
              <div class="cp-rel-info">
                <h5 class="cp-rel-name">{{ getTargetCharacter(rel.targetId)?.name || '???' }}</h5>
                <span class="cp-rel-type" :style="{ color: relationshipMap[rel.type]?.color }">{{ relationshipMap[rel.type]?.label || rel.type }}</span>
              </div>
              <div class="cp-rel-level">
                <span class="cp-level-text">{{ rel.level }}/10</span>
                <div class="cp-level-bar">
                  <div class="cp-level-fill" :style="{ width: (rel.level / 10 * 100) + '%', background: relationshipMap[rel.type]?.color }"></div>
                </div>
              </div>
            </div>
            <p class="cp-rel-history">{{ rel.history }}</p>
            <div v-if="rel.keyMoments && rel.keyMoments.length > 0" class="cp-rel-moments">
              <h6 class="cp-moments-title">重要时刻</h6>
              <div v-for="(moment, idx) in rel.keyMoments" :key="idx" class="cp-moment-item">
                <span class="cp-moment-dot"></span>
                <span class="cp-moment-text">{{ moment }}</span>
              </div>
            </div>
            <div v-if="rel.changes && rel.changes.length > 0" class="cp-rel-changes">
              <h6 class="cp-changes-title">关系变化</h6>
              <div class="cp-changes-timeline">
                <div v-for="(change, idx) in rel.changes" :key="idx" class="cp-change-item">
                  <span class="cp-change-year">{{ change.year }}</span>
                  <span class="cp-change-arrow">→</span>
                  <span class="cp-change-to">{{ change.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'choices'" class="cp-tab-content">
        <h4 class="cp-sub-title">⚖️ 关键抉择</h4>
        <div class="cp-choices-list">
          <div v-for="choice in currentProfile.unlockedChoices" :key="choice.id" class="cp-choice-card" :class="`choice-${choice.impact}`">
            <div class="cp-choice-header">
              <div class="cp-choice-icon-wrap" :style="{ background: getChoiceImpactColor(choice.impact) + '20', borderColor: getChoiceImpactColor(choice.impact) }">
                <span class="cp-choice-icon">{{ getChoiceIcon(choice.impact) }}</span>
              </div>
              <div class="cp-choice-info">
                <h5 class="cp-choice-title">{{ choice.title }}</h5>
                <span class="cp-choice-context">{{ choice.context }}</span>
              </div>
              <div class="cp-choice-impact-badge" :style="{ background: getChoiceImpactColor(choice.impact) }">
                {{ getImpactLabel(choice.impact) }}
              </div>
            </div>
            
            <div class="cp-options-grid">
              <div 
                v-for="opt in choice.options" 
                :key="opt.id" 
                class="cp-option-card"
                :class="{ selected: opt.id === choice.actualChoice }"
              >
                <div class="cp-option-header">
                  <span class="cp-option-label">选项 {{ opt.id.toUpperCase() }}</span>
                  <span v-if="opt.id === choice.actualChoice" class="cp-option-selected">✓ 实际选择</span>
                </div>
                <p class="cp-option-text">{{ opt.text }}</p>
                <div class="cp-option-consequence">
                  <span class="cp-cons-label">结果：</span>
                  <span class="cp-cons-text">{{ opt.consequence }}</span>
                </div>
              </div>
            </div>

            <div class="cp-choice-reflection">
              <h6 class="cp-reflection-title">💭 事后反思</h6>
              <p class="cp-reflection-text">{{ choice.reflection }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'endings'" class="cp-tab-content">
        <h4 class="cp-sub-title">🔚 结局解锁</h4>
        <div class="cp-endings-list">
          <div 
            v-for="ending in availableEndings" 
            :key="ending.endingId" 
            class="cp-ending-card"
            :class="{ unlocked: ending.unlocked }"
          >
            <div class="cp-ending-header">
              <div class="cp-ending-icon-wrap">
                <span class="cp-ending-icon">{{ ending.unlocked ? '🌟' : '🔒' }}</span>
              </div>
              <div class="cp-ending-info">
                <h5 class="cp-ending-title">{{ getEndingName(ending.endingId) }}</h5>
                <p class="cp-ending-hint">{{ ending.hint }}</p>
              </div>
              <div class="cp-ending-progress">
                <span class="cp-ep-text">{{ ending.progress }}%</span>
                <div class="cp-ep-bar">
                  <div class="cp-ep-fill" :style="{ width: ending.progress + '%', background: ending.unlocked ? 'linear-gradient(90deg, #86efac, #22c55e)' : 'linear-gradient(90deg, #94a3b8, #64748b)' }"></div>
                </div>
              </div>
            </div>
            
            <div v-if="!ending.unlocked && ending.requirements" class="cp-ending-requirements">
              <h6 class="cp-req-title">解锁条件</h6>
              <div class="cp-req-list">
                <div v-if="ending.requirements.requiredChoices" class="cp-req-item">
                  <span class="cp-req-check">{{ checkRequirement('choices', ending) ? '✓' : '○' }}</span>
                  <span class="cp-req-text">关键抉择符合度 ≥ 80%</span>
                </div>
                <div v-if="ending.requirements.requiredCrafts" class="cp-req-item">
                  <span class="cp-req-check">{{ checkRequirement('crafts', ending) ? '✓' : '○' }}</span>
                  <span class="cp-req-text">完成特定物品修复</span>
                </div>
                <div v-if="ending.requirements.requiredMemories !== undefined" class="cp-req-item">
                  <span class="cp-req-check">{{ checkRequirement('memories', ending) ? '✓' : '○' }}</span>
                  <span class="cp-req-text">回忆解锁 ≥ {{ ending.requirements.requiredMemories }}个</span>
                </div>
                <div v-if="ending.requirements.requiredHiddenMemories" class="cp-req-item">
                  <span class="cp-req-check">{{ checkRequirement('hiddenMemories', ending) ? '✓' : '○' }}</span>
                  <span class="cp-req-text">解锁隐藏回忆</span>
                </div>
                <div v-if="ending.requirements.requiredMoodMin !== undefined" class="cp-req-item">
                  <span class="cp-req-check">{{ checkRequirement('mood', ending) ? '✓' : '○' }}</span>
                  <span class="cp-req-text">心境值 ≥ {{ ending.requirements.requiredMoodMin }}</span>
                </div>
              </div>
            </div>

            <div v-if="ending.unlocked" class="cp-ending-unlocked">
              <p class="cp-unlocked-text">✨ 你已达成此结局的所有条件，在最终抉择时将有机会解锁。</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentProfile.unlockedSecrets && currentProfile.unlockedSecrets.length > 0 && activeTab === 'profile'" class="cp-secrets-section">
        <h4 class="cp-sub-title">🔮 隐藏秘密</h4>
        <div class="cp-secrets-list">
          <div v-for="secret in currentProfile.unlockedSecrets" :key="secret.id" class="cp-secret-card">
            <div class="cp-secret-header">
              <span class="cp-secret-icon">📜</span>
              <h5 class="cp-secret-title">{{ secret.title }}</h5>
            </div>
            <p class="cp-secret-content">{{ secret.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isCharacterSelected" class="cp-locked-notice">
      <div class="cp-locked-icon">🔒</div>
      <h3 class="cp-locked-title">档案未解锁</h3>
      <p class="cp-locked-desc">继续探索雾城，解锁更多人物档案</p>
    </div>

    <div v-else class="cp-empty-notice">
      <div class="cp-empty-icon">👆</div>
      <h3 class="cp-empty-title">选择一位角色</h3>
      <p class="cp-empty-desc">点击上方角色卡片，查看详细侧写</p>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useCharacterStore } from '../stores/characterStore'
import { characters, relationshipMap } from '../data/characterData'

const characterStore = useCharacterStore()
const gameStore = inject('gameStore')

const tabs = [
  { id: 'profile', name: '人物档案', icon: '📋' },
  { id: 'timeline', name: '成长时间线', icon: '⏳' },
  { id: 'relationships', name: '人物关系', icon: '🔗' },
  { id: 'choices', name: '关键抉择', icon: '⚖️' },
  { id: 'endings', name: '结局解锁', icon: '🔚' }
]

const totalCharacters = computed(() => characters.length)

const allCharacters = computed(() => characters)

const unlockedCharacters = computed(() => 
  characterStore.getUnlockedCharacters(gameStore)
)

const currentCharacterId = computed(() => characterStore.currentCharacterId)

const isCharacterSelected = computed(() => currentCharacterId.value !== null)

const currentProfile = computed(() => {
  if (!currentCharacterId.value) return null
  return characterStore.getCharacterProfile(currentCharacterId.value, gameStore)
})

const activeTab = computed(() => characterStore.activeTab)

const availableEndings = computed(() => 
  characterStore.getAvailableEndings(gameStore)
)

const totalUnlockedRelationships = computed(() => {
  let count = 0
  for (const char of characters) {
    if (char.relationships) {
      for (const rel of char.relationships) {
        if (characterStore.isRelationshipUnlocked(char.id, rel, gameStore)) {
          count++
        }
      }
    }
  }
  return count
})

const totalRelationships = computed(() => {
  let count = 0
  for (const char of characters) {
    if (char.relationships) {
      count += char.relationships.length
    }
  }
  return count
})

const sortedTimeline = computed(() => {
  if (!currentProfile.value) return []
  return [...currentProfile.value.unlockedTimeline].sort((a, b) => a.year - b.year)
})

function isCharacterUnlocked(characterId) {
  return characterStore.isCharacterUnlocked(characterId, gameStore)
}

function getCharacterProgress(characterId) {
  return characterStore.getCharacterProgress(characterId, gameStore)
}

function selectCharacter(char) {
  if (isCharacterUnlocked(char.id)) {
    characterStore.openCharacterProfile(char.id)
  }
}

function setActiveTab(tab) {
  characterStore.setActiveTab(tab)
}

function getCharacterColor(characterId) {
  const colors = {
    protagonist: 'linear-gradient(135deg, #667eea, #764ba2)',
    linwei: 'linear-gradient(135deg, #f093fb, #f5576c)',
    old_chen: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    mother: 'linear-gradient(135deg, #43e97b, #38f9d7)'
  }
  return colors[characterId] || '#d4a574'
}

function getTraitColor(score) {
  if (score >= 80) return 'linear-gradient(90deg, #86efac, #22c55e)'
  if (score >= 50) return 'linear-gradient(90deg, #fbbf24, #f59e0b)'
  if (score >= 30) return 'linear-gradient(90deg, #fb923c, #f97316)'
  return 'linear-gradient(90deg, #f87171, #ef4444)'
}

function getTargetCharacter(characterId) {
  return characters.find(c => c.id === characterId)
}

function getChoiceImpactColor(impact) {
  const colors = {
    positive: '#22c55e',
    neutral: '#f59e0b',
    negative: '#ef4444',
    critical: '#8b5cf6'
  }
  return colors[impact] || '#64748b'
}

function getChoiceIcon(impact) {
  const icons = {
    positive: '😊',
    neutral: '😐',
    negative: '😔',
    critical: '💥'
  }
  return icons[impact] || '❓'
}

function getImpactLabel(impact) {
  const labels = {
    positive: '积极影响',
    neutral: '中性',
    negative: '消极影响',
    critical: '关键转折'
  }
  return labels[impact] || '未知'
}

function getEndingName(endingId) {
  const names = {
    redemption: '救赎结局',
    escape: '逃离结局',
    truth: '真相结局'
  }
  return names[endingId] || endingId
}

function checkRequirement(type, ending) {
  const gameState = {
    triggeredMemories: gameStore?.triggeredMemories || [],
    unlockedHiddenMemories: gameStore?.unlockedHiddenMemories || [],
    foundHiddenItems: gameStore?.foundHiddenItems || [],
    madeChoices: gameStore?.madeChoices || [],
    craftedItems: gameStore?.craftedItems || [],
    moodValue: gameStore?.moodValue || 50
  }
  
  const req = ending.requirements
  
  switch (type) {
    case 'choices':
      if (!req.requiredChoices) return true
      const matchedCount = req.requiredChoices.filter(kc => 
        gameState.madeChoices.includes(kc)).length
      return matchedCount >= req.requiredChoices.length * 0.8
    case 'crafts':
      if (!req.requiredCrafts) return true
      return req.requiredCrafts.every(craftId => 
        gameState.craftedItems.includes(craftId))
    case 'memories':
      if (req.requiredMemories === undefined) return true
      return gameState.triggeredMemories.length >= req.requiredMemories
    case 'hiddenMemories':
      if (!req.requiredHiddenMemories) return true
      return req.requiredHiddenMemories.every(hmId => 
        gameState.unlockedHiddenMemories.includes(hmId))
    case 'mood':
      if (req.requiredMoodMin === undefined) return true
      return gameState.moodValue >= req.requiredMoodMin
    default:
      return true
  }
}
</script>

<style scoped>
.character-profile {
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.character-profile::-webkit-scrollbar { width: 10px; }
.character-profile::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.character-profile::-webkit-scrollbar-thumb {
  background: rgba(212,165,116,0.25);
  border-radius: 5px;
}
.character-profile::-webkit-scrollbar-thumb:hover { background: rgba(212,165,116,0.4); }

.cp-header { margin-bottom: 1.5rem; }

.cp-title {
  font-size: 1.3rem;
  color: #f0e6d8;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
}

.cp-desc {
  font-size: 0.9rem;
  color: #8a8a9a;
  margin: 0;
}

.cp-progress-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.cp-progress-card {
  padding: 1rem 1.2rem;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-top: 3px solid #667eea;
}

.cp-prog-icon { font-size: 1.8rem; }

.cp-prog-info {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.cp-prog-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f0e6d8;
}

.cp-prog-label {
  font-size: 0.8rem;
  color: #8a8a9a;
}

.cp-prog-bar {
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}

.cp-prog-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.cp-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.cp-section-title {
  margin: 0;
  font-size: 1.15rem;
  color: #f0e6d8;
  font-weight: 500;
}

.cp-section-count {
  padding: 0.4rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  font-size: 0.82rem;
  color: #d4a574;
  font-weight: 600;
}

.cp-characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.cp-character-card {
  position: relative;
  padding: 1.3rem 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cp-character-card:hover:not(.unlocked) {
  cursor: not-allowed;
}

.cp-character-card:hover.unlocked {
  transform: translateY(-5px);
  border-color: rgba(212,165,116,0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.cp-character-card.selected {
  border-color: #d4a574;
  background: rgba(212,165,116,0.1);
}

.cp-character-card:not(.unlocked) {
  opacity: 0.5;
  filter: grayscale(0.7);
}

.cp-char-avatar {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 2px solid;
  border-radius: 16px;
  flex-shrink: 0;
}

.cp-char-icon { font-size: 1.8rem; }

.cp-char-info {
  flex: 1;
  min-width: 0;
}

.cp-char-name {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  color: #e8e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-char-role {
  font-size: 0.75rem;
  color: #8a8a9a;
}

.cp-char-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.cp-cp-bar {
  width: 50px;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.cp-cp-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.cp-cp-text {
  font-size: 0.7rem;
  color: #8a8a9a;
}

.cp-char-lock {
  font-size: 1.2rem;
}

.cp-detail-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
}

.cp-detail-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  overflow-x: auto;
}

.cp-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #8a8a9a;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.85rem;
}

.cp-tab-btn:hover {
  color: #d4a574;
  background: rgba(255,255,255,0.03);
}

.cp-tab-btn.active {
  color: #1a1520;
  background: linear-gradient(135deg, #d4a574, #c49664);
  border-color: #d4a574;
}

.cp-tab-icon { font-size: 1rem; }

.cp-tab-content {
  padding: 2rem;
}

.cp-sub-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  color: #d4a574;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(212,165,116,0.15);
}

.cp-profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  border-radius: 14px;
}

.cp-profile-avatar {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid;
  border-radius: 24px;
  flex-shrink: 0;
}

.cp-pa-icon { font-size: 3rem; }

.cp-profile-info { flex: 1; }

.cp-profile-name {
  margin: 0 0 0.8rem 0;
  font-size: 1.6rem;
  color: #f0e6d8;
  font-weight: 600;
}

.cp-profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.cp-p-tag {
  padding: 0.3rem 0.8rem;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  font-size: 0.78rem;
  color: #a0a0b0;
}

.cp-p-tag.cp-age { color: #60a5fa; }
.cp-p-tag.cp-occupation { color: #c084fc; }

.cp-profile-quote {
  margin: 0;
  font-size: 0.95rem;
  color: #8a8a9a;
  font-style: italic;
  line-height: 1.8;
  padding-left: 1rem;
  border-left: 3px solid #d4a574;
}

.cp-profile-bio {
  margin-bottom: 2rem;
}

.cp-bio-text {
  margin: 0;
  font-size: 0.95rem;
  color: #d8d8e8;
  line-height: 2;
  text-indent: 2em;
}

.cp-personality-section {
  margin-bottom: 2rem;
}

.cp-traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.2rem;
}

.cp-trait-item {
  padding: 1.2rem;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
}

.cp-trait-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.cp-trait-name {
  font-size: 0.9rem;
  color: #f0e6d8;
  font-weight: 500;
}

.cp-trait-score {
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 600;
}

.cp-trait-bar {
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.6rem;
}

.cp-trait-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.cp-trait-desc {
  font-size: 0.78rem;
  color: #8a8a9a;
  line-height: 1.6;
}

.cp-timeline-container {
  position: relative;
  padding-left: 2rem;
}

.cp-timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.cp-timeline-item:last-child {
  padding-bottom: 0;
}

.cp-tl-dot {
  position: absolute;
  left: -2rem;
  top: 0.3rem;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  z-index: 2;
}

.cp-tl-line {
  position: absolute;
  left: -1.45rem;
  top: 1rem;
  width: 2px;
  height: calc(100% + 0.6rem);
  background: rgba(255,255,255,0.1);
}

.cp-tl-content {
  padding: 1rem 1.2rem;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
}

.cp-tl-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.cp-tl-year {
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  background: rgba(212,165,116,0.1);
  border-radius: 6px;
}

.cp-tl-key-marker, .cp-tl-turn-marker {
  font-size: 0.72rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.cp-tl-key-marker {
  background: rgba(251,191,36,0.15);
  color: #fbbf24;
}

.cp-tl-turn-marker {
  background: rgba(139,92,246,0.15);
  color: #8b5cf6;
}

.cp-tl-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #f0e6d8;
}

.cp-tl-desc {
  margin: 0 0 0.8rem 0;
  font-size: 0.9rem;
  color: #b8b8c8;
  line-height: 1.8;
}

.cp-tl-impact {
  padding: 0.6rem 0.8rem;
  background: rgba(96,165,250,0.08);
  border-radius: 8px;
  border-left: 3px solid #60a5fa;
}

.cp-impact-label {
  font-size: 0.78rem;
  color: #60a5fa;
  font-weight: 600;
}

.cp-impact-text {
  font-size: 0.78rem;
  color: #a8c8f0;
}

.cp-relationships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}

.cp-relationship-card {
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
}

.cp-rel-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.cp-rel-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 2px solid;
  border-radius: 14px;
  flex-shrink: 0;
}

.cp-rel-icon { font-size: 1.5rem; }

.cp-rel-info { flex: 1; }

.cp-rel-name {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  color: #f0e6d8;
}

.cp-rel-type {
  font-size: 0.78rem;
  font-weight: 600;
}

.cp-rel-level {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.cp-level-text {
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 600;
}

.cp-level-bar {
  width: 60px;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
}

.cp-level-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.cp-rel-history {
  margin: 0 0 1rem 0;
  font-size: 0.88rem;
  color: #b8b8c8;
  line-height: 1.8;
}

.cp-moments-title, .cp-changes-title {
  margin: 0 0 0.8rem 0;
  font-size: 0.82rem;
  color: #d4a574;
  font-weight: 500;
}

.cp-moment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
  font-size: 0.82rem;
  color: #a8a8b8;
  line-height: 1.6;
}

.cp-moment-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4a574;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.cp-changes-timeline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

.cp-change-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  font-size: 0.78rem;
}

.cp-change-year {
  color: #60a5fa;
  font-weight: 600;
}

.cp-change-arrow {
  color: #8a8a9a;
}

.cp-change-to {
  color: #c084fc;
}

.cp-choices-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cp-choice-card {
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
}

.cp-choice-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cp-choice-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 14px;
  flex-shrink: 0;
}

.cp-choice-icon { font-size: 1.6rem; }

.cp-choice-info { flex: 1; }

.cp-choice-title {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
  color: #f0e6d8;
}

.cp-choice-context {
  font-size: 0.82rem;
  color: #8a8a9a;
}

.cp-choice-impact-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #fff;
  font-weight: 600;
}

.cp-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cp-option-card {
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.cp-option-card.selected {
  border-color: #d4a574;
  background: rgba(212,165,116,0.08);
}

.cp-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.cp-option-label {
  font-size: 0.75rem;
  color: #8a8a9a;
  font-weight: 600;
  text-transform: uppercase;
}

.cp-option-selected {
  font-size: 0.7rem;
  color: #22c55e;
  background: rgba(34,197,94,0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.cp-option-text {
  margin: 0 0 0.6rem 0;
  font-size: 0.9rem;
  color: #e0e0e8;
  line-height: 1.6;
}

.cp-option-consequence {
  padding: 0.5rem 0.6rem;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  font-size: 0.78rem;
}

.cp-cons-label {
  color: #8a8a9a;
}

.cp-cons-text {
  color: #a8a8b8;
}

.cp-choice-reflection {
  padding: 1rem 1.2rem;
  background: rgba(192,132,252,0.06);
  border-radius: 10px;
  border-left: 3px solid #c084fc;
}

.cp-reflection-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: #c084fc;
}

.cp-reflection-text {
  margin: 0;
  font-size: 0.88rem;
  color: #d0c8e8;
  line-height: 1.8;
  font-style: italic;
}

.cp-endings-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.cp-ending-card {
  padding: 1.5rem;
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;
}

.cp-ending-card.unlocked {
  border-color: rgba(34,197,94,0.3);
  background: rgba(34,197,94,0.05);
}

.cp-ending-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cp-ending-icon-wrap {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  flex-shrink: 0;
}

.cp-ending-icon { font-size: 1.8rem; }

.cp-ending-info { flex: 1; }

.cp-ending-title {
  margin: 0 0 0.4rem 0;
  font-size: 1.1rem;
  color: #f0e6d8;
}

.cp-ending-hint {
  margin: 0;
  font-size: 0.82rem;
  color: #8a8a9a;
  line-height: 1.6;
}

.cp-ending-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.cp-ep-text {
  font-size: 0.9rem;
  color: #d4a574;
  font-weight: 600;
}

.cp-ep-bar {
  width: 80px;
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
}

.cp-ep-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.cp-ending-requirements {
  padding: 1rem 1.2rem;
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
}

.cp-req-title {
  margin: 0 0 0.8rem 0;
  font-size: 0.85rem;
  color: #d4a574;
  font-weight: 500;
}

.cp-req-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cp-req-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: #a8a8b8;
}

.cp-req-check {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #22c55e;
}

.cp-ending-unlocked {
  padding: 1rem 1.2rem;
  background: rgba(34,197,94,0.08);
  border-radius: 10px;
  text-align: center;
}

.cp-unlocked-text {
  margin: 0;
  font-size: 0.88rem;
  color: #86efac;
}

.cp-secrets-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.cp-secrets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cp-secret-card {
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, rgba(251,191,36,0.06), rgba(245,158,11,0.03));
  border: 1px dashed rgba(251,191,36,0.25);
  border-radius: 12px;
}

.cp-secret-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.cp-secret-icon { font-size: 1.2rem; }

.cp-secret-title {
  margin: 0;
  font-size: 0.95rem;
  color: #fbbf24;
}

.cp-secret-content {
  margin: 0;
  font-size: 0.88rem;
  color: #e8d8b0;
  line-height: 1.8;
  text-indent: 2em;
}

.cp-locked-notice, .cp-empty-notice {
  padding: 4rem 2rem;
  text-align: center;
  background: rgba(255,255,255,0.02);
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 16px;
}

.cp-locked-icon, .cp-empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.cp-locked-title, .cp-empty-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #f0e6d8;
}

.cp-locked-desc, .cp-empty-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #8a8a9a;
}

@media (max-width: 768px) {
  .cp-progress-strip {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cp-characters-grid {
    grid-template-columns: 1fr;
  }
  
  .cp-profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .cp-detail-tabs {
    padding: 0.8rem;
    gap: 0.3rem;
  }
  
  .cp-tab-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.78rem;
  }
  
  .cp-tab-content {
    padding: 1.2rem;
  }
}
</style>
