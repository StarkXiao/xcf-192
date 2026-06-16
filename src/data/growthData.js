export const GROWTH_SCHEMA_VERSION = 1

export const CHAPTER_GOALS = [
  {
    id: 'ch1_first_find_3items',
    chapterId: 1,
    name: '初入雾城',
    description: '在序章中找到 3 件物品',
    icon: '🔍',
    type: 'find_items',
    target: 3,
    reward: { coins: 50, badgeHint: '解锁序章徽章' }
  },
  {
    id: 'ch1_first_memory_2memories',
    chapterId: 1,
    name: '回忆的碎片',
    description: '触发 2 段回忆',
    icon: '💭',
    type: 'trigger_memories',
    target: 2,
    reward: { coins: 30, diaryUnlock: 'diary_ch1_1' }
  },
  {
    id: 'ch2_all_stations',
    chapterId: 2,
    name: '雾城漫游',
    description: '踏足全部场景',
    icon: '🗺️',
    type: 'visit_scenes',
    target: 4,
    reward: { coins: 80, achievement: 'ach_city_explorer' }
  },
  {
    id: 'ch2_craft_1',
    chapterId: 2,
    name: '巧思工坊',
    description: '合成第一件道具',
    icon: '✨',
    type: 'craft_items',
    target: 1,
    reward: { coins: 40 }
  },
  {
    id: 'ch3_hidden_1',
    chapterId: 3,
    name: '隐藏猎手',
    description: '发现 1 件隐藏物品',
    icon: '🔮',
    type: 'find_hidden',
    target: 1,
    reward: { coins: 60 }
  },
  {
    id: 'ch3_all_choices',
    chapterId: 3,
    name: '心之所向',
    description: '做出全部关键抉择',
    icon: '🌿',
    type: 'make_choices',
    target: 3,
    reward: { coins: 70, diaryUnlock: 'diary_ch3_1' }
  }
]

export const ACHIEVEMENTS = [
  {
    id: 'ach_first_play',
    name: '初次相逢',
    description: '完成第一次游戏',
    icon: '🌸',
    rarity: 'common',
    category: 'journey',
    condition: { type: 'play_count', value: 1 }
  },
  {
    id: 'ach_memory_collector',
    name: '回忆收藏家',
    description: '累计触发 20 段回忆',
    icon: '📖',
    rarity: 'rare',
    category: 'collection',
    condition: { type: 'total_memories', value: 20 }
  },
  {
    id: 'ach_speed_demon',
    name: '疾风寻物',
    description: '在 3 分钟内完成一局游戏',
    icon: '⚡',
    rarity: 'rare',
    category: 'skill',
    condition: { type: 'best_time', value: 180 }
  },
  {
    id: 'ach_perfect_run',
    name: '完美重逢',
    description: '在一局中找到全部物品',
    icon: '💎',
    rarity: 'epic',
    category: 'skill',
    condition: { type: 'perfect_clear' }
  },
  {
    id: 'ach_city_explorer',
    name: '雾城漫游者',
    description: '探索全部场景',
    icon: '🗺️',
    rarity: 'rare',
    category: 'exploration',
    condition: { type: 'all_scenes' }
  },
  {
    id: 'ach_heart_of_warm',
    name: '心怀希冀',
    description: '以"希冀"心绪完成游戏',
    icon: '✨',
    rarity: 'common',
    category: 'mood',
    condition: { type: 'mood_ending', value: 'hopeful' }
  },
  {
    id: 'ach_heart_of_sad',
    name: '雾中徘徊',
    description: '以"惆怅"心绪完成游戏',
    icon: '🌧️',
    rarity: 'common',
    category: 'mood',
    condition: { type: 'mood_ending', value: 'melancholy' }
  },
  {
    id: 'ach_letter_writer',
    name: '信笺诗人',
    description: '收到全部信件',
    icon: '💌',
    rarity: 'rare',
    category: 'collection',
    condition: { type: 'all_letters' }
  },
  {
    id: 'ach_relic_master',
    name: '旧物修复师',
    description: '修复全部收藏品',
    icon: '🔧',
    rarity: 'epic',
    category: 'collection',
    condition: { type: 'all_relics_restored' }
  },
  {
    id: 'ach_streak_7',
    name: '七日之约',
    description: '连续 7 天登陆游戏',
    icon: '📅',
    rarity: 'epic',
    category: 'dedication',
    condition: { type: 'login_streak', value: 7 }
  },
  {
    id: 'ach_legendary_ending',
    name: '传奇重逢',
    description: '达成传说结局',
    icon: '👑',
    rarity: 'legendary',
    category: 'ending',
    condition: { type: 'ending_type', value: 'legendary' }
  },
  {
    id: 'ach_all_endings',
    name: '万象归一',
    description: '达成全部结局',
    icon: '🌈',
    rarity: 'legendary',
    category: 'ending',
    condition: { type: 'all_endings' }
  }
]

export const HIDDEN_DIARIES = [
  {
    id: 'diary_intro_1',
    title: '启程·雾中来信',
    date: '第一日 · 雾',
    content: '今天回到了雾城。五年了，这座城市好像什么都没变，又好像什么都变了。\n\n车站的钟还是停在八点二十三分，梧桐还是那么大的雾。\n\n我走在熟悉的街道上，每一步都像是踩在回忆上——柔软，却又真实。\n\n她说过她会等我。\n\n她还在吗？',
    icon: '📔',
    unlockCondition: { type: 'first_play' },
    hint: '完成第一次游戏后解锁',
    category: 'main'
  },
  {
    id: 'diary_ch1_1',
    title: '序章·站台回响',
    date: '第三日 · 薄雾',
    content: '在火车站找到了那张褪色的车票。\n\n记得吗？那年夏天，我们挤在售票窗口前，你攥着两张去往海边的车票。\n\n你说："等毕业就去看海。"\n\n海没有看成，我们也没有看成。\n\n车票还在，人呢？',
    icon: '🎫',
    unlockCondition: { type: 'goal_complete', goalId: 'ch1_first_memory' },
    hint: '完成序章回忆目标后解锁',
    category: 'chapter'
  },
  {
    id: 'diary_explore_1',
    title: '探索·老街梧桐',
    date: '第七日 · 晴',
    content: '今天走到了老街。\n\n梧桐还是那么茂盛，阳光从树叶缝隙漏下来，碎金一样。\n\n我在那棵最老的树下站了很久。\n\n好像还能听到你笑的声音，从很远很远的地方飘过来。\n\n"你快点呀，冰淇淋化了！"',
    icon: '🌳',
    unlockCondition: { type: 'visit_location', locationId: 'old_street', count: 3 },
    hint: '多次探访老街 3 次后解锁',
    category: 'exploration'
  },
  {
    id: 'diary_cafe_1',
    title: '转角·拿铁余香',
    date: '第十日 · 雨',
    content: '去了转角咖啡馆。\n\n点了两杯拿铁，一杯放在对面。\n\n老板娘还认得我，说："好久没来了。"\n\n我笑了笑，没说话。\n\n咖啡还是当年的味道，苦中带一点点甜。\n\n像极了我们的故事。',
    icon: '☕',
    unlockCondition: { type: 'visit_location', locationId: 'cafe_alley', count: 5 },
    hint: '五次探访咖啡馆后解锁',
    category: 'exploration'
  },
  {
    id: 'diary_ch3_1',
    title: '抉择·心之所向',
    date: '第十五日 · 浓雾',
    content: '今天做出了所有的选择。\n\n每一个岔路口，我都在想：\n\n如果当年我选了另一条路，\n\n结局会不会不一样？\n\n可是没有如果。\n\n只有雾，只有回忆，只有我。',
    icon: '🌿',
    unlockCondition: { type: 'goal_complete', goalId: 'ch3_all_choices' },
    hint: '完成第三章全部抉择后解锁',
    category: 'chapter'
  },
  {
    id: 'diary_secret_1',
    title: '秘境·时光书店',
    date: '第二十日 · 星',
    content: '在书店的角落，发现了一本旧书。\n\n《小王子》。\n\n书里夹着一张机票，目的地是我的城市。\n\n红笔写着："我买了两张，一张是我的，一张是你的。"\n\n"我在车站等了一个小时，你没有来。"\n\n手指抚过机票上的泪痕。\n\n原来，你也来过。',
    icon: '📚',
    unlockCondition: { type: 'find_hidden_item', itemId: 'hidden_book' },
    hint: '找到书店里的隐藏物品',
    category: 'secret'
  },
  {
    id: 'diary_ending_1',
    title: '终章·雾散之时',
    date: '最后一日 · 晴',
    content: '雾散了。\n\n阳光洒下来，整座城市都在发光。\n\n我站在车站前，好像等了很久很久。\n\n身后传来脚步声。\n\n很轻，很熟悉。\n\n我没有回头。\n\n我知道，是你。',
    icon: '☀️',
    unlockCondition: { type: 'ending_type', endingType: 'good' },
    hint: '达成美好结局后解锁',
    category: 'ending'
  }
]

export const LOCATION_RATING_RULES = {
  scorePerItem: 15,
  scorePerMemory: 20,
  scorePerHidden: 30,
  timeBonus: {
    excellent: { threshold: 120, multiplier: 1.5, label: '极速' }
  },
  grades: [
    { min: 0, label: '初探', stars: 1 },
    { min: 30, label: '驻足', stars: 2 },
    { min: 60, label: '深入', stars: 3 },
    { min: 85, label: '通晓', stars: 4 },
    { min: 100, label: '圆满', stars: 5 }
  ]
}

export const REPLAY_REWARDS = [
  { playCount: 1, reward: { coins: 50, label: '初次相逢礼' } },
  { playCount: 3, reward: { coins: 100, material: 'mat_acid_free_paper', count: 3, label: '三度造访礼' } },
  { playCount: 5, reward: { coins: 200, badge: 'ach_relics_beginner', label: '五度回味礼' } },
  { playCount: 10, reward: { coins: 500, material: 'mat_restoration_gel', count: 5, label: '十度重临礼' } },
  { playCount: 20, reward: { coins: 1000, achievement: 'ach_dedicated', label: '廿载不忘礼' } },
  { playCount: 50, reward: { coins: 3000, achievement: 'ach_legendary_player', label: '半百初心礼' } }
]

export const DAILY_LOGIN_REWARDS = [
  { day: 1, reward: { coins: 30, label: '初临雾城' } },
  { day: 2, reward: { coins: 50, label: '再访旧地' } },
  { day: 3, reward: { coins: 80, material: 'mat_acid_free_paper', count: 2, label: '三日连登' } },
  { day: 4, reward: { coins: 100, label: '四日相伴' } },
  { day: 5, reward: { coins: 150, material: 'mat_restoration_gel', count: 2, label: '五日坚守' } },
  { day: 6, reward: { coins: 200, label: '六日相随' } },
  { day: 7, reward: { coins: 500, achievement: 'ach_weekly_visitor', label: '七日之约' } }
]

export const RARITY_COLORS = {
  common: { name: '普通', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.2)' },
  rare: { name: '稀有', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.2)' },
  epic: { name: '史诗', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.2)' },
  legendary: { name: '传说', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.25)' }
}

export const ACHIEVEMENT_CATEGORIES = {
  journey: { name: '旅途', icon: '🚶' },
  collection: { name: '收集', icon: '📦' },
  skill: { name: '技巧', icon: '⚔️' },
  exploration: { name: '探索', icon: '🗺️' },
  mood: { name: '心绪', icon: '💭' },
  dedication: { name: '坚守', icon: '📅' },
  ending: { name: '结局', icon: '🌟' }
}

export const DIARY_CATEGORIES = {
  main: { name: '主线', icon: '📖' },
  chapter: { name: '章节', icon: '📑' },
  exploration: { name: '探索', icon: '🗺️' },
  secret: { name: '秘境', icon: '🔮' },
  ending: { name: '结局', icon: '✨' }
}
