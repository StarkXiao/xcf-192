export const characters = [
  {
    id: 'protagonist',
    name: '陈凡',
    nickname: '狐狸',
    age: 28,
    birthday: '1995年7月15日',
    occupation: '软件工程师',
    hometown: '雾城',
    currentResidence: '南方某城',
    personality: ['内敛', '执着', '有点慢热', '内心温柔'],
    avatar: '👤',
    signatureQuote: '"有些话，现在不说，就永远没机会了。"',
    backgroundSummary: '土生土长的雾城人，大学毕业后去了南方工作。五年前的一场错过，成为了心中永远的遗憾。',
    initialUnlock: true,
    portraitStyle: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colorTheme: '#667eea',

    growthTimeline: [
      {
        year: '1995',
        age: 0,
        title: '出生',
        description: '出生在雾城一个普通的工薪家庭，是家里的独子。',
        significance: '人生起点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2003',
        age: 8,
        title: '初遇雾城',
        description: '开始记事的年纪，雾城的雾气、老街、梧桐树构成了童年最深刻的记忆。',
        significance: '故乡情结的源头',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2010',
        age: 15,
        title: '高中时代',
        description: '以优异的成绩考入雾城一中，理科成绩突出，语文却总是拖后腿。',
        significance: '性格成型期',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2013',
        age: 18,
        title: '考上大学',
        description: '考入南方一所知名大学的计算机系，第一次离开雾城独自生活。',
        significance: '人生的第一个转折点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2015',
        age: 20,
        title: '第一次遇见',
        description: '暑假回雾城，在时光书店偶遇了正在看《小王子》的林薇。那是他们的第一次相遇。',
        significance: '命运的相遇',
        unlockCondition: { type: 'memory', memoryId: 'm13' }
      },
      {
        year: '2015',
        age: 20,
        title: '紫色的约定',
        description: '在回忆公园，紧张地握着薰衣草送给林薇。她接过花说"我知道"，从那天起，他们在一起了。',
        significance: '爱情的开始',
        unlockCondition: { type: 'memory', memoryId: 'm10' }
      },
      {
        year: '2016',
        age: 21,
        title: '盛夏的笑容',
        description: '和林薇在雾城老街度过了整个夏天，梧桐树下的合照成了最珍贵的回忆。',
        significance: '最幸福的时光',
        unlockCondition: { type: 'memory', memoryId: 'm4' }
      },
      {
        year: '2016',
        age: 21,
        title: '玩笑的承诺',
        description: '在转角咖啡馆，用易拉罐拉环开玩笑似的向林薇求婚。她红着脸说"等以后吧"。',
        significance: '承诺的萌芽',
        unlockCondition: { type: 'memory', memoryId: 'm8' }
      },
      {
        year: '2017',
        age: 22,
        title: '毕业与抉择',
        description: '大学毕业，收到了南方一家知名互联网公司的offer。林薇选择留在雾城考研。',
        significance: '现实的考验',
        unlockCondition: { type: 'choice', choiceId: 'kc_leave' }
      },
      {
        year: '2018',
        age: 23,
        title: '离别',
        description: '在雾城火车站，林薇来送他。火车开走的前一分钟，她好像说了什么，但轰鸣声掩盖了她的声音。',
        significance: '永远的遗憾',
        unlockCondition: { type: 'memory', memoryId: 'm1' }
      },
      {
        year: '2018-2023',
        age: '23-28',
        title: '五年分离',
        description: '在南方打拼，从初级工程师做到高级工程师。事业有成，内心却始终空着一块。',
        significance: '时间的流逝',
        unlockCondition: { type: 'chapter', chapter: 1 }
      },
      {
        year: '2023',
        age: 28,
        title: '归乡',
        description: '带着五年的思念和遗憾，回到了雾城。这一次，不想再错过了。',
        significance: '故事的开始',
        unlockCondition: { type: 'initial' }
      }
    ],

    relationships: [
      {
        targetId: 'linwei',
        role: '恋人',
        status: '失而复得',
        firstMeet: '2015年夏，时光书店',
        history: [
          { period: '2015-2016', description: '热恋期，几乎形影不离', stage: '热恋' },
          { period: '2016-2018', description: '异地恋，每天视频通话', stage: '磨合' },
          { period: '2018-2023', description: '断联，互相等待', stage: '分离' },
          { period: '2023-今', description: '重逢，重新开始', stage: '重逢' }
        ],
        keyMoments: [
          { memoryId: 'm10', description: '第一次告白' },
          { memoryId: 'm7', description: '第一次约会' },
          { memoryId: 'm8', description: '玩笑求婚' },
          { memoryId: 'm1', description: '车站离别' },
          { memoryId: 'hm1', description: '时光尽头的真相' }
        ],
        unlockCondition: { type: 'memory', memoryId: 'm4' }
      },
      {
        targetId: 'mother',
        role: '母亲',
        status: '相依为命',
        firstMeet: '出生',
        history: [
          { period: '童年', description: '母亲是小学老师，对他要求严格但也很疼爱' },
          { period: '大学后', description: '母亲独自留在雾城，每年只在春节才能团聚' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'initial' }
      },
      {
        targetId: 'old_chen',
        role: '挚友',
        status: '多年好友',
        firstMeet: '2010年，高中一年级',
        history: [
          { period: '高中', description: '同班同学，同桌三年' },
          { period: '大学', description: '考去了不同城市，但一直保持联系' },
          { period: '现在', description: '留在雾城当老师，是陈凡与故乡唯一的纽带' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'chapter', chapter: 2 }
      }
    ],

    keyChoices: [
      {
        id: 'kc_leave',
        title: '关于未来的选择',
        description: '2017年，拿到南方公司offer的时候，面临着去留的抉择。',
        options: [
          { id: 'stay', label: '留在雾城，陪在她身边', result: '也许就不会错过五年', impact: '改变命运走向' },
          { id: 'go', label: '去南方打拼，给她更好的未来', result: '现实中做出的选择', impact: '造成了五年的分离' }
        ],
        actualChoice: 'go',
        consequence: '为了所谓的"更好的未来"，选择了离开，却错过了最重要的东西。',
        unlockCondition: { type: 'choice', choiceId: 'kc_leave' }
      },
      {
        id: 'kc_ring',
        title: '关于承诺的态度',
        description: '七年前那个易拉罐拉环的玩笑，现在回想起来，如果是现在会怎么做？',
        options: [
          { id: 'serious', label: '认真对待，用真正的戒指补上承诺', result: '游戏中可做出的选择', impact: '展现成熟与真心' },
          { id: 'regret', label: '后悔当初没有更认真', result: '在自责中度过五年', impact: '成为心中的遗憾' },
          { id: 'hope', label: '相信还有机会', result: '带着希望继续等待', impact: '支撑着度过分离的岁月' }
        ],
        actualChoice: 'hope',
        consequence: '正是这份希望，让他在五年后依然选择回到雾城寻找答案。',
        unlockCondition: { type: 'choice', choiceId: 'kc_ring' }
      },
      {
        id: 'kc_promise',
        title: '关于永恒的诺言',
        description: '五年前在雾霭湖畔许下的诺言，是否还记得？',
        options: [
          { id: 'keep', label: '一直记得，从未忘记', result: '五年来从未动摇', impact: '展现忠诚与执着' },
          { id: 'doubt', label: '时间太长，开始怀疑了', result: '人之常情', impact: '展现人性的真实' },
          { id: 'renew', label: '重新许下诺言', result: '放下过去，面向未来', impact: '展现成熟与勇气' }
        ],
        actualChoice: 'keep',
        consequence: '正是这份执着，让他在五年后依然坚守着那份诺言。',
        unlockCondition: { type: 'choice', choiceId: 'kc_promise' }
      },
      {
        id: 'kc_final',
        title: '最后的抉择',
        description: '当雾气散去，终于在湖畔见到她的那一刻，第一反应是什么？',
        options: [
          { id: 'run', label: '冲上去紧紧抱住她', result: '最真挚的情感流露', impact: '通往传说结局' },
          { id: 'smile', label: '微笑着说"好久不见"', result: '成熟的重逢方式', impact: '通往特殊结局' },
          { id: 'apologize', label: '先说"对不起，我来晚了"', result: '真诚的道歉', impact: '通往特殊结局' },
          { id: 'watch', label: '远远看着，不确定是不是她', result: '恐惧与不确定', impact: '通往普通结局' }
        ],
        actualChoice: null,
        consequence: '这个选择，将决定故事的最终结局。',
        unlockCondition: { type: 'chapter', chapter: 5 }
      }
    ],

    endingRequirements: {
      're_true_love': {
        requiredChoices: ['kc_leave_send', 'kc_ring_serious', 'kc_promise_keep', 'kc_final_run'],
        requiredCrafts: ['time_key', 'promise_ring'],
        requiredMemories: 16,
        requiredHiddenMemories: ['hm1', 'hm2'],
        description: '需要拿出全部的勇气和真心，才能换得时光尽头的重逢'
      },
      're_complete_puzzle': {
        requiredChoices: ['kc_leave_keep', 'kc_ring_hope', 'kc_promise_renew'],
        requiredCrafts: ['memory_book', 'summer_locket'],
        requiredMemories: 14,
        description: '找回所有的回忆碎片，才能拼凑出完整的她'
      },
      're_fate_second_chance': {
        requiredChoices: ['kc_final_smile'],
        requiredCrafts: ['lake_message'],
        description: '命运会给真诚的人第二次机会'
      }
    },

    personalityTraits: [
      { name: '执着', score: 85, description: '认定的事情就不会轻易放弃，五年的等待就是最好的证明' },
      { name: '内向', score: 70, description: '不善于表达情感，很多话都藏在心里' },
      { name: '温柔', score: 80, description: '内心柔软，会为对方着想，只是不善于表达' },
      { name: '责任感', score: 90, description: '希望给爱的人更好的生活，因此选择去南方打拼' },
      { name: '怀旧', score: 95, description: '对过去的事情念念不忘，珍藏着每一件与她相关的物品' }
    ]
  },

  {
    id: 'linwei',
    name: '林薇',
    nickname: '玫瑰花',
    age: 27,
    birthday: '1996年3月22日',
    occupation: '出版社编辑',
    hometown: '雾城',
    currentResidence: '雾城',
    personality: ['温柔', '敏感', '执着', '有点胆小'],
    avatar: '👩',
    signatureQuote: '"如果你开口挽留，我会留下来。"',
    backgroundSummary: '土生土长的雾城人，中文系毕业。外表温柔内心倔强，五年的等待从未动摇。',
    initialUnlock: false,
    portraitStyle: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    colorTheme: '#ec4899',

    growthTimeline: [
      {
        year: '1996',
        age: 0,
        title: '出生',
        description: '出生在雾城一个书香门第，父亲是大学教授，母亲是医生。',
        significance: '人生起点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2008',
        age: 12,
        title: '爱上阅读',
        description: '在父亲的影响下爱上了读书，尤其喜欢《小王子》，读了不下十遍。',
        significance: '兴趣培养',
        unlockCondition: { type: 'memory', memoryId: 'm13' }
      },
      {
        year: '2012',
        age: 16,
        title: '高中时代',
        description: '文科成绩优异，是学校文学社的社长，梦想成为一名作家。',
        significance: '文学梦想的起点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2014',
        age: 18,
        title: '考上大学',
        description: '考入雾城大学中文系，实现了自己的文学梦。',
        significance: '人生新阶段',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2015',
        age: 19,
        title: '第一次遇见',
        description: '在时光书店看《小王子》时，感受到一道目光。抬起头，看到了街对面的他。',
        significance: '命运的相遇',
        unlockCondition: { type: 'memory', memoryId: 'm13' }
      },
      {
        year: '2015',
        age: 19,
        title: '紫色的约定',
        description: '接过他递来的薰衣草，她笑着说"我知道"。其实她等这一天，已经等了很久。',
        significance: '爱情的开始',
        unlockCondition: { type: 'memory', memoryId: 'm10' }
      },
      {
        year: '2016',
        age: 20,
        title: '盛夏的生日',
        description: '生日那天，和他一起在回忆公园放飞气球。她许的愿望是"希望每年生日都能和他一起过"。',
        significance: '最甜蜜的回忆',
        unlockCondition: { type: 'memory', memoryId: 'm11' }
      },
      {
        year: '2016',
        age: 20,
        title: '玩笑的求婚',
        description: '当他用易拉罐拉环求婚时，她脸红了。其实她在心里已经说了"我愿意"，只是嘴上说"等以后吧"。',
        significance: '期待的承诺',
        unlockCondition: { type: 'memory', memoryId: 'm8' }
      },
      {
        year: '2017',
        age: 21,
        title: '他的抉择',
        description: '得知他拿到了南方的offer，她没有挽留。她想，如果他真的爱她，会自己选择留下。',
        significance: '骄傲与倔强',
        unlockCondition: { type: 'choice', choiceId: 'kc_leave' }
      },
      {
        year: '2018',
        age: 22,
        title: '车站离别',
        description: '在火车站，在火车开动的前一分钟，她终于鼓起勇气说："如果你开口挽留，我会留下来。"但轰鸣声掩盖了她的声音。',
        significance: '永远的遗憾',
        unlockCondition: { type: 'memory', memoryId: 'm1' }
      },
      {
        year: '2018',
        age: 22,
        title: '未寄出的信',
        description: '她写了一封信，买了两张车票，一张是他的，一张是她的。她在车站等了一个小时，他没有来。',
        significance: '心碎的等待',
        unlockCondition: { type: 'hidden_memory', hiddenMemoryId: 'hm3' }
      },
      {
        year: '2018-2023',
        age: '22-27',
        title: '五年等待',
        description: '留在雾城，成为了一名出版社编辑。拒绝了所有追求者，每年都回回忆公园看那棵老树。',
        significance: '执着的爱',
        unlockCondition: { type: 'chapter', chapter: 3 }
      },
      {
        year: '2023',
        age: 27,
        title: '等待',
        description: '在雾霭湖畔，她又来到了那个老地方。这一次，她有预感，他会来。',
        significance: '命运的重逢',
        unlockCondition: { type: 'chapter', chapter: 5 }
      }
    ],

    relationships: [
      {
        targetId: 'protagonist',
        role: '恋人',
        status: '失而复得',
        firstMeet: '2015年夏，时光书店',
        history: [
          { period: '2015-2016', description: '被追求时的甜蜜与矜持', stage: '暧昧' },
          { period: '2016-2018', description: '异地恋的思念与不安', stage: '焦虑' },
          { period: '2018-2023', description: '等待中的希望与失望', stage: '执着' },
          { period: '2023-今', description: '重逢后的释然与珍惜', stage: '圆满' }
        ],
        keyMoments: [
          { memoryId: 'm13', description: '书店的初遇' },
          { memoryId: 'm10', description: '接受告白' },
          { memoryId: 'm8', description: '期待的求婚' },
          { memoryId: 'm1', description: '车站的挽留' },
          { memoryId: 'hm3', description: '未寄出的告白' }
        ],
        unlockCondition: { type: 'memory', memoryId: 'm13' }
      },
      {
        targetId: 'professor_lin',
        role: '父亲',
        status: '父女情深',
        firstMeet: '出生',
        history: [
          { period: '童年', description: '父亲教她读书写字，培养了她对文学的热爱' },
          { period: '成年后', description: '父亲一直支持她的选择，包括等待陈凡的决定' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'chapter', chapter: 4 }
      },
      {
        targetId: 'dr_chen',
        role: '母亲',
        status: '母女连心',
        firstMeet: '出生',
        history: [
          { period: '童年', description: '母亲工作繁忙，但总是抽出时间陪她' },
          { period: '分离期间', description: '母亲心疼她的等待，但从不干涉她的决定' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'chapter', chapter: 4 }
      }
    ],

    keyChoices: [
      {
        id: 'kc_wait',
        title: '关于等待的选择',
        description: '他走后，面对着家人的劝说和追求者的示好，要如何选择？',
        options: [
          { id: 'wait', label: '继续等他', result: '现实中做出的选择', impact: '一等就是五年' },
          { id: 'move_on', label: '放下过去，开始新的生活', result: '理性的选择', impact: '可能会有不一样的人生' },
          { id: 'find', label: '主动去找他', result: '需要勇气的选择', impact: '也许能早点重逢' }
        ],
        actualChoice: 'wait',
        consequence: '选择了等待，一等就是五年。这份执着，成为了她最动人的品质。',
        unlockCondition: { type: 'chapter', chapter: 3 }
      },
      {
        id: 'kc_letter',
        title: '关于那封信',
        description: '写好了那封告白信，买了两张车票，要如何处置？',
        options: [
          { id: 'send', label: '把信寄给他', result: '也许能改变一切', impact: '可能会有不同的结局' },
          { id: 'keep', label: '等他来发现', result: '现实中做出的选择', impact: '信被夹在日记本里五年' },
          { id: 'destroy', label: '销毁这一切', result: '彻底放下', impact: '可能会更快走出来' }
        ],
        actualChoice: 'keep',
        consequence: '把信夹在日记本里，等待着他来发现。这一等，就是五年。',
        unlockCondition: { type: 'hidden_memory', hiddenMemoryId: 'hm3' }
      },
      {
        id: 'kc_reunion',
        title: '关于重逢',
        description: '当他真的出现在面前，五年的思念和委屈涌上心头，要如何反应？',
        options: [
          { id: 'forgive', label: '原谅他，重新开始', result: '内心真正的想法', impact: '通往圆满结局' },
          { id: 'test', label: '考验他的真心', result: '想确认他的改变', impact: '通往不同的分支' },
          { id: 'leave', label: '错过就是错过了', result: '被伤害太深后的保护', impact: '通往遗憾结局' }
        ],
        actualChoice: null,
        consequence: '这个选择，将取决于他的表现。',
        unlockCondition: { type: 'chapter', chapter: 5 }
      }
    ],

    endingRequirements: {
      're_true_love': {
        requiredMemories: 16,
        requiredHiddenMemories: ['hm1', 'hm2'],
        requiredMoodMin: 80,
        description: '当他带着全部的真心和勇气而来，她会毫不犹豫地选择原谅'
      },
      're_complete_puzzle': {
        requiredMemories: 14,
        requiredMoodMin: 65,
        description: '当他找回了所有的回忆碎片，她会愿意重新开始'
      },
      're_sincere_apology': {
        requiredChoices: ['kc_final_apologize'],
        requiredCrafts: ['time_key'],
        requiredMoodMin: 55,
        description: '真诚的道歉，总能打动人心'
      }
    },

    personalityTraits: [
      { name: '温柔', score: 90, description: '待人温和，总是为他人着想，不愿意伤害任何人' },
      { name: '执着', score: 95, description: '认定的人就不会轻易放弃，五年的等待就是最好的证明' },
      { name: '敏感', score: 80, description: '心思细腻，能察觉到细微的情绪变化，但也容易受伤' },
      { name: '骄傲', score: 75, description: '内心有自己的骄傲，不愿意主动低头，即使很在意' },
      { name: '浪漫', score: 85, description: '喜欢文学和艺术，相信命运和缘分，对爱情有美好的憧憬' }
    ],

    secrets: [
      {
        id: 'secret_diary',
        title: '日记本的秘密',
        description: '她的日记本最后一页，其实写满了他的名字。还有一句从未让他见过的话："如果我开口挽留，你会留下吗？"',
        unlockCondition: { type: 'hidden_item', hiddenItemId: 'hi_locked_diary_page' }
      },
      {
        id: 'secret_tree',
        title: '老树的秘密',
        description: '每年她都会回回忆公园，在那棵刻着两颗心的老树旁边，再刻上一个新的年份。五年了，从不间断。',
        unlockCondition: { type: 'hidden_memory', hiddenMemoryId: 'hm5' }
      },
      {
        id: 'secret_bottle',
        title: '漂流瓶的秘密',
        description: '五年后她回到湖畔，发现了当年的漂流瓶。她在背面写下："我会一直等你，到世界的尽头。"然后又扔回了湖里。',
        unlockCondition: { type: 'hidden_item', hiddenItemId: 'hi_bottle_second' }
      },
      {
        id: 'secret_ticket',
        title: '车票的秘密',
        description: '五年前的火车站，她买了两张票。一张去的，一张回的。她在等他说"别走"，然后把回程票给他。',
        unlockCondition: { type: 'hidden_item', hiddenItemId: 'hi_ticket_stub' }
      }
    ]
  },

  {
    id: 'old_chen',
    name: '陈默',
    nickname: '老陈',
    age: 28,
    birthday: '1995年5月10日',
    occupation: '高中教师',
    hometown: '雾城',
    currentResidence: '雾城',
    personality: ['稳重', '热心', '观察力强', '有点毒舌'],
    avatar: '👨',
    signatureQuote: '"当局者迷，旁观者清。你们两个啊，我早就看透了。"',
    backgroundSummary: '陈凡的高中同桌兼挚友，留在雾城当老师，是男女主角之间的重要纽带。',
    initialUnlock: false,
    portraitStyle: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    colorTheme: '#10b981',

    growthTimeline: [
      {
        year: '1995',
        age: 0,
        title: '出生',
        description: '出生在雾城一个普通家庭，从小就是"别人家的孩子"。',
        significance: '人生起点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2010',
        age: 15,
        title: '高中同桌',
        description: '和陈凡成为同桌，虽然性格迥异，但意外地合得来。',
        significance: '友谊的开始',
        unlockCondition: { type: 'chapter', chapter: 2 }
      },
      {
        year: '2013',
        age: 18,
        title: '高考志愿',
        description: '和陈凡约定考同一所大学，但因为家庭原因选择了本地师范大学。',
        significance: '人生道路的分岔',
        unlockCondition: { type: 'chapter', chapter: 2 }
      },
      {
        year: '2015',
        age: 20,
        title: '第一次见嫂子',
        description: '陈凡第一次带林薇和他吃饭，他就知道这两个人肯定有戏。',
        significance: '成为两人的朋友',
        unlockCondition: { type: 'memory', memoryId: 'm7' }
      },
      {
        year: '2017',
        age: 22,
        title: '劝和',
        description: '得知陈凡要去南方，他劝陈凡好好和林薇谈谈，不要留下遗憾。',
        significance: '试图改变结局',
        unlockCondition: { type: 'choice', choiceId: 'kc_leave' }
      },
      {
        year: '2018',
        age: 23,
        title: '见证离别',
        description: '在火车站，他看到了林薇追着火车跑的样子，也看到了陈凡在车里哭的样子。',
        significance: '心碎的旁观者',
        unlockCondition: { type: 'memory', memoryId: 'm1' }
      },
      {
        year: '2018-2023',
        age: '23-28',
        title: '传声筒',
        description: '成为两人之间唯一的纽带，偶尔会互相打听对方的消息，但从不传话。',
        significance: '沉默的纽带',
        unlockCondition: { type: 'chapter', chapter: 3 }
      },
      {
        year: '2023',
        age: 28,
        title: '推波助澜',
        description: '得知陈凡要回雾城，他提前告诉了林薇："他要回来了。这一次，别再错过了。"',
        significance: '命运的推手',
        unlockCondition: { type: 'chapter', chapter: 5 }
      }
    ],

    relationships: [
      {
        targetId: 'protagonist',
        role: '挚友',
        status: '兄弟情深',
        firstMeet: '2010年，高中一年级',
        history: [
          { period: '高中', description: '同桌三年，互相帮助，也互相调侃' },
          { period: '大学', description: '虽然异地，但经常视频聊天' },
          { period: '工作后', description: '陈凡去了南方，他留在雾城，联系变少但情谊不变' }
        ],
        keyMoments: [
          { memoryId: 'm1', description: '见证离别' },
          { memoryId: 'm7', description: '第一次见林薇' }
        ],
        unlockCondition: { type: 'chapter', chapter: 2 }
      },
      {
        targetId: 'linwei',
        role: '好友',
        status: '君子之交',
        firstMeet: '2015年，陈凡介绍',
        history: [
          { period: '热恋期', description: '经常和陈凡林薇一起吃饭，当电灯泡' },
          { period: '分离期', description: '偶尔会遇到林薇，听她说起陈凡，但从不传话' },
          { period: '重逢前', description: '提前告诉林薇陈凡要回来的消息' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'chapter', chapter: 3 }
      }
    ],

    keyChoices: [
      {
        id: 'kc_message',
        title: '关于传话',
        description: '陈凡让他帮忙给林薇带话，林薇也让他帮忙给陈凡带话，他该怎么做？',
        options: [
          { id: 'pass', label: '帮他们传话', result: '也许能让他们早点联系', impact: '可能改变结局' },
          { id: 'silent', label: '不传话，让他们自己解决', result: '现实中做出的选择', impact: '让两人自己成长' },
          { id: 'push', label: '主动推他们一把', result: '需要勇气的选择', impact: '可能会适得其反' }
        ],
        actualChoice: 'silent',
        consequence: '选择了不传话，因为他知道，有些事情必须他们自己面对。但在重逢前，他还是忍不住提前告诉了林薇。',
        unlockCondition: { type: 'chapter', chapter: 4 }
      }
    ],

    personalityTraits: [
      { name: '稳重', score: 85, description: '做事情考虑周全，总是比同龄人更成熟' },
      { name: '热心', score: 80, description: '朋友有难一定会帮忙，是个可靠的人' },
      { name: '观察力', score: 90, description: '早就看出陈凡和林薇互相喜欢，也看出他们都在等对方' },
      { name: '毒舌', score: 70, description: '嘴上不饶人，经常调侃陈凡，但内心是为他好' },
      { name: '理性', score: 85, description: '看待问题很理性，经常作为朋友的"情感顾问"' }
    ],

    perspective: {
      onProtagonist: '陈凡什么都好，就是在感情上太怂。明明喜欢得要死，却非要装酷。',
      onLinwei: '林薇看着温柔，其实比谁都倔。认定的事情，九头牛都拉不回来。',
      onRelationship: '这两个人啊，就是太像了。都在等对方先开口，结果一等就是五年。'
    }
  },

  {
    id: 'mother',
    name: '王秀兰',
    nickname: '陈妈妈',
    age: 55,
    birthday: '1969年9月15日',
    occupation: '退休小学教师',
    hometown: '雾城',
    currentResidence: '雾城',
    personality: ['传统', '节俭', '疼儿子', '有点唠叨'],
    avatar: '👵',
    signatureQuote: '"小凡啊，什么时候带女朋友回来吃饭？"',
    backgroundSummary: '陈凡的母亲，独自在雾城生活，最大的心愿就是儿子能成家立业。',
    initialUnlock: false,
    portraitStyle: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    colorTheme: '#f472b6',

    growthTimeline: [
      {
        year: '1969',
        age: 0,
        title: '出生',
        description: '出生在雾城周边的一个小镇，从小学习成绩优异。',
        significance: '人生起点',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '1990',
        age: 21,
        title: '结婚生子',
        description: '和陈凡的父亲结婚，次年生下陈凡。',
        significance: '组建家庭',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2000',
        age: 31,
        title: '单亲妈妈',
        description: '和丈夫离婚，独自抚养陈凡。生活虽然辛苦，但从不抱怨。',
        significance: '人生转折点',
        unlockCondition: { type: 'chapter', chapter: 2 }
      },
      {
        year: '2013',
        age: 44,
        title: '儿子考上大学',
        description: '陈凡考上了南方的名牌大学，她既骄傲又舍不得。',
        significance: '欣慰与不舍',
        unlockCondition: { type: 'initial' }
      },
      {
        year: '2015',
        age: 46,
        title: '第一次见林薇',
        description: '陈凡带林薇回家吃饭，她一眼就喜欢上了这个文静的姑娘。',
        significance: '认可准儿媳',
        unlockCondition: { type: 'memory', memoryId: 'm4' }
      },
      {
        year: '2018',
        age: 49,
        title: '儿子的选择',
        description: '得知陈凡要去南方工作，她没有反对，只是说"常回家看看"。',
        significance: '默默支持',
        unlockCondition: { type: 'choice', choiceId: 'kc_leave' }
      },
      {
        year: '2018-2023',
        age: '49-54',
        title: '等待',
        description: '每年春节都问陈凡"什么时候带女朋友回来"，但从不催婚。',
        significance: '母亲的期盼',
        unlockCondition: { type: 'chapter', chapter: 3 }
      },
      {
        year: '2023',
        age: 54,
        title: '退休',
        description: '从小学教师岗位上退休，生活更清闲了，也更盼着儿子能成家。',
        significance: '人生新阶段',
        unlockCondition: { type: 'chapter', chapter: 4 }
      }
    ],

    relationships: [
      {
        targetId: 'protagonist',
        role: '母亲',
        status: '母子情深',
        firstMeet: '出生',
        history: [
          { period: '童年', description: '严格但慈爱，注重培养儿子的学习习惯' },
          { period: '青春期', description: '虽然有代沟，但总是试着理解儿子' },
          { period: '成年后', description: '默默支持儿子的所有决定' }
        ],
        keyMoments: [
          { memoryId: 'm4', description: '第一次见林薇' }
        ],
        unlockCondition: { type: 'initial' }
      },
      {
        targetId: 'linwei',
        role: '准婆婆',
        status: '非常满意',
        firstMeet: '2015年，陈凡带回家',
        history: [
          { period: '第一次见面', description: '一眼就喜欢上了林薇，觉得她和儿子很般配' },
          { period: '分离期间', description: '偶尔会在陈凡面前提起林薇，旁敲侧击' }
        ],
        keyMoments: [],
        unlockCondition: { type: 'memory', memoryId: 'm4' }
      }
    ],

    personalityTraits: [
      { name: '传统', score: 85, description: '思想比较传统，希望儿子能早点成家立业' },
      { name: '节俭', score: 90, description: '生活节俭，但从不亏待儿子' },
      { name: '慈爱', score: 95, description: '非常疼爱儿子，默默支持他的所有决定' },
      { name: '唠叨', score: 70, description: '年纪大了有点唠叨，但都是出于关心' },
      { name: '坚韧', score: 85, description: '独自抚养儿子长大，从不叫苦叫累' }
    ]
  }
]

export const relationshipMap = {
  'protagonist-linwei': {
    type: 'romantic',
    label: '恋人',
    color: '#ec4899',
    story: '从书店初遇到五年分离，再到命运的重逢，他们的爱情经历了时间的考验。',
    unlockCondition: { type: 'memory', memoryId: 'm4' }
  },
  'protagonist-old_chen': {
    type: 'friendship',
    label: '挚友',
    color: '#10b981',
    story: '从高中同桌到人生挚友，老陈见证了陈凡和林薇的全部故事。',
    unlockCondition: { type: 'chapter', chapter: 2 }
  },
  'protagonist-mother': {
    type: 'family',
    label: '母子',
    color: '#f472b6',
    story: '母亲是陈凡最坚强的后盾，也是他感情路上的"神助攻"。',
    unlockCondition: { type: 'initial' }
  },
  'linwei-old_chen': {
    type: 'friendship',
    label: '好友',
    color: '#10b981',
    story: '通过陈凡认识的老陈，是林薇在雾城少数能聊起陈凡的朋友。',
    unlockCondition: { type: 'chapter', chapter: 3 }
  },
  'linwei-mother': {
    type: 'family',
    label: '准婆媳',
    color: '#f472b6',
    story: '陈妈妈第一次见到林薇就非常喜欢她，一直盼着她能成为自己的儿媳。',
    unlockCondition: { type: 'memory', memoryId: 'm4' }
  }
}

export const characterUnlocks = {
  protagonist: { type: 'initial' },
  linwei: { type: 'memory', memoryId: 'm13' },
  old_chen: { type: 'chapter', chapter: 2 },
  mother: { type: 'initial' }
}

export const getCharacterById = (characterId) => {
  return characters.find(c => c.id === characterId)
}

export const getAllCharacters = () => {
  return characters
}

export const getRelationshipById = (relId) => {
  return relationshipMap[relId]
}

export const getAllRelationships = () => {
  return Object.entries(relationshipMap).map(([id, data]) => ({ id, ...data }))
}

export const checkCharacterUnlock = (characterId, gameState) => {
  const char = getCharacterById(characterId)
  if (!char) return false
  
  if (char.initialUnlock) return true
  
  const unlock = characterUnlocks[characterId]
  if (!unlock) return false
  
  switch (unlock.type) {
    case 'initial':
      return true
    case 'memory':
      return gameState.triggeredMemories?.includes(unlock.memoryId)
    case 'chapter':
      return (gameState.currentChapterId || 1) >= unlock.chapter
    case 'choice':
      return gameState.madeChoices?.some(c => c.startsWith(unlock.choiceId))
    case 'hidden_memory':
      return gameStore.unlockedHiddenMemories?.includes(unlock.hiddenMemoryId)
    case 'hidden_item':
      return gameState.foundHiddenItems?.includes(unlock.hiddenItemId)
    default:
      return false
  }
}

export const checkTimelineUnlock = (timelineItem, gameState) => {
  const condition = timelineItem.unlockCondition
  if (!condition) return true
  
  switch (condition.type) {
    case 'initial':
      return true
    case 'memory':
      return gameState.triggeredMemories?.includes(condition.memoryId)
    case 'chapter':
      return (gameState.currentChapterId || 1) >= condition.chapter
    case 'choice':
      return gameState.madeChoices?.some(c => c.startsWith(condition.choiceId))
    case 'hidden_memory':
      return gameState.unlockedHiddenMemories?.includes(condition.hiddenMemoryId)
    case 'hidden_item':
      return gameState.foundHiddenItems?.includes(condition.hiddenItemId)
    default:
      return true
  }
}

export const checkRelationshipUnlock = (relationship, gameState) => {
  const condition = relationship.unlockCondition
  if (!condition) return true
  
  switch (condition.type) {
    case 'initial':
      return true
    case 'memory':
      return gameState.triggeredMemories?.includes(condition.memoryId)
    case 'chapter':
      return (gameState.currentChapterId || 1) >= condition.chapter
    case 'choice':
      return gameState.madeChoices?.some(c => c.startsWith(condition.choiceId))
    default:
      return true
  }
}
