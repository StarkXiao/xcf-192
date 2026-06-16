export const RADIO_STATION = {
  frequency: '102.4',
  name: '雾城夜话',
  tagline: '深夜里，我们不孤单',
  host: '陈主播',
  description: '雾城唯一的深夜电台，每晚零点准时开播，陪伴每一个失眠的灵魂。',
  broadcastHours: ['night', 'dawn'],
  icon: '📻'
}

export const RADIO_PROGRAMS = [
  {
    id: 'prog_memory_fragments',
    name: '回忆留声机',
    timeSlot: '00:00 - 01:00',
    description: '播放听众寄来的回忆，让过去的声音在深夜里回响。',
    host: '陈主播',
    type: 'memory',
    unlockCondition: { type: 'chapter', value: 1 },
    icon: '🎵'
  },
  {
    id: 'prog_city_legends',
    name: '雾城奇谈',
    timeSlot: '01:00 - 02:00',
    description: '讲述这座城市里不为人知的传说与秘闻。',
    host: '老张',
    type: 'rumor',
    unlockCondition: { type: 'items', value: 3 },
    icon: '👻'
  },
  {
    id: 'prog_night_traveler',
    name: '夜行者',
    timeSlot: '02:00 - 03:00',
    description: '给深夜还在路上的人，一些特别的任务和指引。',
    host: '神秘嘉宾',
    type: 'quest',
    unlockCondition: { type: 'memories', value: 2 },
    icon: '🌙'
  },
  {
    id: 'prog_love_letter',
    name: '情书信箱',
    timeSlot: '03:00 - 04:00',
    description: '读一封寄不出去的情书，给那个想见的人。',
    host: '陈主播',
    type: 'story',
    unlockCondition: { type: 'mood', value: 'warm' },
    icon: '💌'
  },
  {
    id: 'prog_midnight_cafe',
    name: '午夜咖啡馆',
    timeSlot: '04:00 - 05:00',
    description: '点一首歌，给心里的那个人。',
    host: '小陈',
    type: 'atmosphere',
    unlockCondition: { type: 'scene', value: 'cafe' },
    icon: '☕'
  }
]

export const MEMORY_FRAGMENTS = [
  {
    id: 'mf_station_whistle',
    title: '站台的汽笛声',
    programId: 'prog_memory_fragments',
    description: '五年前那个清晨，火车站的汽笛声特别响。你提着行李，她站在站台边缘，手里攥着那条蓝色围巾...',
    audioType: 'ambient',
    duration: 120,
    unlockCondition: { type: 'item', value: 'ticket' },
    memoryUnlock: 'm_station_goodbye',
    moodEffect: 'nostalgic',
    endingWeight: { nostalgic: 2 },
    voiceLines: [
      '「火车要开了...」',
      '「我会回来的，等我。」',
      '「嗯，我等你。」'
    ],
    soundEffects: ['train_whistle', 'wind', 'distant_bell']
  },
  {
    id: 'mf_cafe_latte',
    title: '拿铁的温度',
    programId: 'prog_memory_fragments',
    description: '转角咖啡馆的靠窗位置，阳光洒在她的发梢。你点了两杯拿铁，她笑着说你记错了，她要的是卡布奇诺...',
    audioType: 'ambient',
    duration: 90,
    unlockCondition: { type: 'item', value: 'cup' },
    memoryUnlock: 'm_cafe_first_date',
    moodEffect: 'warm',
    endingWeight: { sincere: 2 },
    voiceLines: [
      '「你怎么记得我喝拿铁？」',
      '「因为...你说过的呀。」',
      '「笨蛋，我说的是卡布奇诺。」'
    ],
    soundEffects: ['coffee_pour', 'cup_clink', 'soft_jazz']
  },
  {
    id: 'mf_park_sunset',
    title: '夕阳下的长椅',
    programId: 'prog_memory_fragments',
    description: '回忆公园的那把长椅，你们并肩坐着，看夕阳把天空染成橘红色。她把头靠在你肩上，什么都没说...',
    audioType: 'ambient',
    duration: 100,
    unlockCondition: { type: 'item', value: 'flower' },
    memoryUnlock: 'm_park_bench',
    moodEffect: 'peaceful',
    endingWeight: { gentle: 2 },
    voiceLines: [
      '「如果时间能停在这一刻就好了。」',
      '「会的，至少在回忆里。」'
    ],
    soundEffects: ['birds', 'wind_leaves', 'distant_laughter']
  },
  {
    id: 'mf_rain_umbrella',
    title: '雨中的伞',
    programId: 'prog_memory_fragments',
    description: '那天的雨很大，你们只有一把伞。你把伞都歪向她那边，自己半边肩膀都湿透了。她笑着说你傻，却把伞又推了回来...',
    audioType: 'ambient',
    duration: 80,
    unlockCondition: { type: 'item', value: 'letter' },
    memoryUnlock: 'm_street_rain',
    moodEffect: 'bittersweet',
    endingWeight: { romantic: 3 },
    voiceLines: [
      '「你都淋湿了！」',
      '「没关系，你别感冒就好。」',
      '「笨蛋...我们一起打嘛。」'
    ],
    soundEffects: ['rain', 'thunder_far', 'umbrella_open']
  },
  {
    id: 'mf_bookstore_promise',
    title: '书架后的约定',
    programId: 'prog_memory_fragments',
    description: '旧书店的角落里，你们在同本书的扉页上写下了名字。她说，等五年后再一起来看，看看这本书还在不在...',
    audioType: 'ambient',
    duration: 110,
    unlockCondition: { type: 'item', value: 'notebook' },
    memoryUnlock: 'm_bookstore_promise',
    moodEffect: 'hopeful',
    endingWeight: { loyal: 2, hopeful: 1 },
    voiceLines: [
      '「五年后，我们还会一起来吗？」',
      '「当然会，我保证。」',
      '「拉钩？」',
      '「拉钩。」'
    ],
    soundEffects: ['page_turn', 'clock_tick', 'soft_piano']
  }
]

export const CITY_RUMORS = [
  {
    id: 'cr_lighthouse',
    title: '湖畔灯塔',
    programId: 'prog_city_legends',
    description: '听说雾城湖畔有一座废弃的灯塔，每到月圆之夜就会亮起。有人说那是等待归人的信号...',
    unlockCondition: { type: 'scene', value: 'lake' },
    rumorHint: '也许在深夜的湖畔，能看到什么不一样的东西。',
    unlocksItem: null,
    unlocksMemory: 'hm_lighthouse',
    moodEffect: 'mysterious',
    isTrue: true,
    requiredTime: 'night'
  },
  {
    id: 'cr_old_clock',
    title: '停摆的老钟',
    programId: 'prog_city_legends',
    description: '老街拐角有一座老钟，据说在某个特定的时刻，它会突然走动，指向某个重要的瞬间...',
    unlockCondition: { type: 'items', value: 5 },
    rumorHint: '老钟停在8点23分，那个时间有什么特别的吗？',
    unlocksItem: 'watch',
    unlocksMemory: null,
    moodEffect: 'curious',
    isTrue: true,
    requiredTime: 'dusk'
  },
  {
    id: 'cr_ghost_train',
    title: '午夜末班车',
    programId: 'prog_city_legends',
    description: '火车站每晚零点有一班不存在的列车，会带走那些不愿离开的灵魂...',
    unlockCondition: { type: 'memories', value: 3 },
    rumorHint: '也许你可以在站台等等看，但别上车。',
    unlocksItem: null,
    unlocksMemory: 'hm_ghost_train',
    moodEffect: 'spooky',
    isTrue: false,
    requiredTime: 'night'
  },
  {
    id: 'cr_secret_garden',
    title: '公园里的秘密花园',
    programId: 'prog_city_legends',
    description: '回忆公园深处有一扇被藤蔓遮住的门，门后是一片只存在于传说中的花园...',
    unlockCondition: { type: 'scene', value: 'park' },
    rumorHint: '多看看公园的角落，也许会有意外发现。',
    unlocksItem: 'flower',
    unlocksMemory: null,
    moodEffect: 'wonder',
    isTrue: true,
    requiredTime: 'dawn'
  },
  {
    id: 'cr_cafe_message',
    title: '咖啡馆的留言墙',
    programId: 'prog_city_legends',
    description: '转角咖啡馆有一面留言墙，据说只要在凌晨三点写下心愿，就会被某个特别的人看到...',
    unlockCondition: { type: 'mood', value: 'warm' },
    rumorHint: '也许你也可以写点什么。',
    unlocksItem: null,
    unlocksMemory: 'hm_cafe_message',
    moodEffect: 'warm',
    isTrue: true,
    requiredTime: 'night'
  }
]

export const RADIO_QUESTS = [
  {
    id: 'rq_find_lost_item',
    title: '寻人启事',
    programId: 'prog_night_traveler',
    description: '有位听众说她在火车站丢了一件重要的东西，如果有人捡到，请送到转角咖啡馆...',
    questType: 'fetch',
    unlockCondition: { type: 'chapter', value: 2 },
    startItem: null,
    targetItem: 'scarf',
    targetScene: 'cafe',
    reward: {
      type: 'memory',
      value: 'm_scarf_memory',
      description: '关于那条围巾的回忆'
    },
    progressSteps: [
      { id: 'hear_request', text: '听到寻人启事', done: true },
      { id: 'find_item', text: '找到失物', done: false, condition: { type: 'item', value: 'scarf' } },
      { id: 'deliver_item', text: '送到咖啡馆', done: false, condition: { type: 'scene', value: 'cafe' } }
    ]
  },
  {
    id: 'rq_night_photo',
    title: '夜雾摄影师',
    programId: 'prog_night_traveler',
    description: '一位听众想收集雾城夜晚的照片，如果你能在三个不同的地方看到深夜的风景，请告诉他...',
    questType: 'explore',
    unlockCondition: { type: 'memories', value: 4 },
    requiredScenes: ['station', 'park', 'lake'],
    requiredTime: 'night',
    reward: {
      type: 'ending_weight',
      value: { nostalgic: 3, romantic: 2 },
      description: '解锁特殊回忆碎片'
    },
    progressSteps: [
      { id: 'hear_request', text: '接到摄影任务', done: true },
      { id: 'station_night', text: '深夜的火车站', done: false, condition: { type: 'scene_time', value: { scene: 'station', time: 'night' } } },
      { id: 'park_night', text: '深夜的公园', done: false, condition: { type: 'scene_time', value: { scene: 'park', time: 'night' } } },
      { id: 'lake_night', text: '深夜的湖畔', done: false, condition: { type: 'scene_time', value: { scene: 'lake', time: 'night' } } }
    ]
  },
  {
    id: 'rq_letter_delivery',
    title: '信件传递',
    programId: 'prog_night_traveler',
    description: '有人托电台转交一封信，需要你帮忙送到书店...',
    questType: 'delivery',
    unlockCondition: { type: 'items', value: 8 },
    startScene: 'cafe',
    targetScene: 'bookstore',
    reward: {
      type: 'memory',
      value: 'm_letter_story',
      description: '一封信背后的故事'
    },
    progressSteps: [
      { id: 'hear_request', text: '听到信件委托', done: true },
      { id: 'pickup_letter', text: '在咖啡馆取信', done: false, condition: { type: 'scene', value: 'cafe' } },
      { id: 'deliver_letter', text: '送到书店', done: false, condition: { type: 'scene', value: 'bookstore' } }
    ]
  },
  {
    id: 'rq_melody_hunt',
    title: '寻找那首歌',
    programId: 'prog_night_traveler',
    description: '有位听众说她一直在找一首小时候听过的歌，只记得旋律，不记得名字。如果你在不同地方听到熟悉的旋律...',
    questType: 'collect',
    unlockCondition: { type: 'chapter', value: 3 },
    collectibles: ['melody_station', 'melody_cafe', 'melody_park', 'melody_bookstore'],
    reward: {
      type: 'memory',
      value: 'm_childhood_song',
      description: '那首歌的完整回忆'
    },
    progressSteps: [
      { id: 'hear_request', text: '听到听众的请求', done: true },
      { id: 'melody_1', text: '在车站听到片段', done: false, condition: { type: 'scene', value: 'station' } },
      { id: 'melody_2', text: '在咖啡馆听到片段', done: false, condition: { type: 'scene', value: 'cafe' } },
      { id: 'melody_3', text: '在公园听到片段', done: false, condition: { type: 'scene', value: 'park' } },
      { id: 'melody_4', text: '在书店听到片段', done: false, condition: { type: 'scene', value: 'bookstore' } }
    ]
  }
]

export const RADIO_STORIES = [
  {
    id: 'rs_love_letter_1',
    title: '给五年后的你',
    programId: 'prog_love_letter',
    description: '一封写给五年后那个人的信，不知道他/她还会不会记得...',
    unlockCondition: { type: 'memories', value: 3 },
    moodEffect: 'bittersweet',
    endingWeight: { romantic: 2 },
    lines: [
      '「亲爱的，不知道这封信寄出的时候，你在哪里。」',
      '「五年了，我还是会常常想起我们在一起的日子。」',
      '「街角的那家冰淇淋店还在，我还是会点你最喜欢的口味。」',
      '「如果你听到这封信，请记得，我还在等。」'
    ]
  },
  {
    id: 'rs_love_letter_2',
    title: '来不及说出口',
    programId: 'prog_love_letter',
    description: '有些话，当年没有说出口，现在想说，却不知道该寄到哪里...',
    unlockCondition: { type: 'items', value: 6 },
    moodEffect: 'sad',
    endingWeight: { regretful: 1, sincere: 2 },
    lines: [
      '「你好吗？我是那个总是不敢直视你的人。」',
      '「其实那时候，我有很多话想对你说。」',
      '「比如，我喜欢你。」',
      '「但现在说这些，好像都太晚了。」'
    ]
  },
  {
    id: 'rs_love_letter_3',
    title: '再见，我的少年',
    programId: 'prog_love_letter',
    description: '是时候说再见了，和那个年少的自己，和那个年少的你。',
    unlockCondition: { type: 'chapter', value: 4 },
    moodEffect: 'cathartic',
    endingWeight: { lettingGo: 2, mature: 2 },
    lines: [
      '「写这封信的时候，我终于决定放下了。」',
      '「不是不爱了，是时候往前走了。」',
      '「谢谢你，出现在我的青春里。」',
      '「再见了，我的少年。愿你一切都好。」'
    ]
  }
]

export const RADIO_ATMOSPHERE = [
  {
    id: 'ra_smooth_jazz',
    name: '爵士夜曲',
    programId: 'prog_midnight_cafe',
    description: '慵懒的爵士乐，适合深夜的咖啡和思念。',
    musicStyle: 'jazz',
    moodBoost: 'calm',
    unlockCondition: { type: 'scene', value: 'cafe' }
  },
  {
    id: 'ra_piano_solo',
    name: '钢琴独奏',
    programId: 'prog_midnight_cafe',
    description: '简单的钢琴旋律，像在诉说一个人的心事。',
    musicStyle: 'piano',
    moodBoost: 'nostalgic',
    unlockCondition: { type: 'items', value: 4 }
  },
  {
    id: 'ra_old_songs',
    name: '怀旧金曲',
    programId: 'prog_midnight_cafe',
    description: '那些年我们一起听过的歌，每一首都是一个故事。',
    musicStyle: 'oldies',
    moodBoost: 'warm',
    unlockCondition: { type: 'memories', value: 5 }
  }
]

export function getProgramById(id) {
  return RADIO_PROGRAMS.find(p => p.id === id)
}

export function getMemoryFragmentById(id) {
  return MEMORY_FRAGMENTS.find(m => m.id === id)
}

export function getCityRumorById(id) {
  return CITY_RUMORS.find(r => r.id === id)
}

export function getRadioQuestById(id) {
  return RADIO_QUESTS.find(q => q.id === id)
}

export function getRadioStoryById(id) {
  return RADIO_STORIES.find(s => s.id === id)
}

export function getMemoryFragmentsByProgram(programId) {
  return MEMORY_FRAGMENTS.filter(m => m.programId === programId)
}

export function getCityRumorsByProgram(programId) {
  return CITY_RUMORS.filter(r => r.programId === programId)
}

export function getRadioQuestsByProgram(programId) {
  return RADIO_QUESTS.filter(q => q.programId === programId)
}

export function getRadioStoriesByProgram(programId) {
  return RADIO_STORIES.filter(s => s.programId === programId)
}

export function getRadioAtmosphereByProgram(programId) {
  return RADIO_ATMOSPHERE.filter(a => a.programId === programId)
}

export function isProgramUnlocked(program, gameState) {
  const condition = program.unlockCondition
  if (!condition) return true

  switch (condition.type) {
    case 'chapter':
      return gameState.currentChapterId >= condition.value
    case 'items':
      return gameState.foundItems.length >= condition.value
    case 'memories':
      return gameState.triggeredMemories.length >= condition.value
    case 'mood':
      return gameState.moodStateId === condition.value
    case 'scene':
      return gameState.visitedScenes?.includes(condition.value)
    default:
      return false
  }
}

export function isMemoryFragmentUnlocked(fragment, gameState) {
  const condition = fragment.unlockCondition
  if (!condition) return true

  switch (condition.type) {
    case 'item':
      return gameState.foundItems.includes(condition.value)
    case 'chapter':
      return gameState.currentChapterId >= condition.value
    case 'memories':
      return gameState.triggeredMemories.length >= condition.value
    default:
      return false
  }
}

export function isRumorUnlocked(rumor, gameState) {
  const condition = rumor.unlockCondition
  if (!condition) return true

  switch (condition.type) {
    case 'scene':
      return gameState.visitedScenes?.includes(condition.value)
    case 'items':
      return gameState.foundItems.length >= condition.value
    case 'memories':
      return gameState.triggeredMemories.length >= condition.value
    case 'mood':
      return gameState.moodStateId === condition.value
    default:
      return false
  }
}

export function isQuestUnlocked(quest, gameState) {
  const condition = quest.unlockCondition
  if (!condition) return true

  switch (condition.type) {
    case 'chapter':
      return gameState.currentChapterId >= condition.value
    case 'items':
      return gameState.foundItems.length >= condition.value
    case 'memories':
      return gameState.triggeredMemories.length >= condition.value
    default:
      return false
  }
}
