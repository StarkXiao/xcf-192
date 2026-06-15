export const prologueScenes = [
  {
    id: 'apartment',
    name: '清晨公寓',
    timeLabel: '6:30',
    description: '最后一天的清晨，阳光透过窗帘洒在房间里。她还靠在你肩上熟睡，睫毛微微颤动。桌上摆着昨晚没吃完的蛋糕，墙上的挂钟滴答作响，窗台上那盆她养的薰衣草还在开着。',
    backgroundStyle: 'linear-gradient(180deg, #2a2040 0%, #3d2a5c 30%, #5a3d7a 60%, #8b6aae 100%)',
    atmosphere: 'warm',
    interactivePoints: [
      {
        id: 'p_sleeping_face',
        name: '她的睡颜',
        icon: '😴',
        position: { x: 50, y: 30 },
        size: { width: 14, height: 16 },
        dialogue: [
          { speaker: 'narrator', text: '你侧过头看着她安静的睡颜，她总是喜欢把被子卷成一团。你轻轻拨开她额前的碎发，她的嘴角微微上扬，似乎在做一个好梦。' },
          { speaker: 'narrator', text: '"如果时间能停在这一刻就好了。"你心里想着，却知道那辆火车不会等你。' }
        ],
        foreshadowing: 'f_awkake'
      },
      {
        id: 'p_clock',
        name: '墙上挂钟',
        icon: '🕐',
        position: { x: 82, y: 15 },
        size: { width: 10, height: 10 },
        dialogue: [
          { speaker: 'narrator', text: '挂钟的指针指向6:30。从你醒来那一刻起，时间就像在加速——每过一秒，离分别就更近一秒。' },
          { speaker: 'her', text: '你又在盯着时钟发呆了...' },
          { speaker: 'you', text: '我只是在想，要是时间能走慢一点就好了。' },
          { speaker: 'her', text: '傻瓜，时间对每个人都是公平的。重要的是，我们把剩下的每一秒都过好。' }
        ],
        foreshadowing: 'f_time_stop'
      },
      {
        id: 'p_lavender',
        name: '窗台薰衣草',
        icon: '💜',
        position: { x: 20, y: 20 },
        size: { width: 10, height: 12 },
        dialogue: [
          { speaker: 'narrator', text: '那盆薰衣草是她执意要养的。"薰衣草的花语是等待爱情。"她笑着说，"等你走后，它会替我等你回来。"' },
          { speaker: 'you', text: '等我回来的时候，它一定开得更茂盛了。' },
          { speaker: 'her', text: '嗯，我会好好照顾它的。每天给它浇水的时候，就像在跟你说话一样。' }
        ],
        foreshadowing: 'f_lavender_promise'
      },
      {
        id: 'p_cake',
        name: '昨晚的蛋糕',
        icon: '🎂',
        position: { x: 70, y: 55 },
        size: { width: 12, height: 10 },
        dialogue: [
          { speaker: 'narrator', text: '昨晚你们偷偷庆祝了一个只有两个人知道的纪念日。蛋糕上还插着那根蜡烛，她许愿的时候闭着眼睛，好认真。' },
          { speaker: 'you', text: '你昨晚许了什么愿？' },
          { speaker: 'her', text: '说出来就不灵了。' },
          { speaker: 'narrator', text: '她笑着摇头，但她的眼神里藏着一丝你读不懂的忧伤。' }
        ],
        foreshadowing: 'f_birthday_wish'
      }
    ],
    exitDialogue: [
      { speaker: 'her', text: '该起床了，今天还有很多事要做呢。' },
      { speaker: 'narrator', text: '她伸了个懒腰，从你肩上抬起头。阳光洒在她脸上，你看清了——她的眼睛有些红，像是哭过。但她很快笑了，像什么都没发生过一样。' }
    ]
  },
  {
    id: 'street_walk',
    name: '午后老街',
    timeLabel: '13:00',
    description: '午后，你们沿着老街慢慢走着。梧桐树荫洒下斑驳的光影，冰淇淋店还是老样子，那家书店挂着打折的牌子。她说想多走走，把这座城市的每一处都刻进记忆里。',
    backgroundStyle: 'linear-gradient(180deg, #4a6741 0%, #6a8a5a 30%, #8bab7a 60%, #c8d8a0 100%)',
    atmosphere: 'bittersweet',
    interactivePoints: [
      {
        id: 'p_icecream_shop',
        name: '冰淇淋店',
        icon: '🍦',
        position: { x: 25, y: 45 },
        size: { width: 12, height: 14 },
        dialogue: [
          { speaker: 'her', text: '去买两份冰淇淋吧！一份草莓一份巧克力，和以前一样！' },
          { speaker: 'you', text: '你一个人吃不完两份吧？' },
          { speaker: 'her', text: '谁说我一个人吃？和你分着吃，就有双份的甜蜜了呀！' },
          { speaker: 'narrator', text: '她用勺子挖了一大勺递给你，眼睛弯成了月牙。你故意吃得很慢，就是想和她多待一会儿。' }
        ],
        foreshadowing: 'f_icecream_share'
      },
      {
        id: 'p_photo_spot',
        name: '梧桐树下',
        icon: '🌳',
        position: { x: 55, y: 30 },
        size: { width: 14, height: 18 },
        dialogue: [
          { speaker: 'her', text: '站在这里别动！我要给你拍照！' },
          { speaker: 'you', text: '你拍的技术真的很一般...' },
          { speaker: 'her', text: '哼，那换我来！你也给我拍一张！' },
          { speaker: 'narrator', text: '她靠在梧桐树下，阳光穿过树叶的缝隙在她脸上投下斑驳的光影。你按下快门的那一刻，心里突然很难过——你不知道下一张合影要等到什么时候。' },
          { speaker: 'her', text: '再拍一张合照吧！就当是...留念。' }
        ],
        foreshadowing: 'f_photo_memory'
      },
      {
        id: 'p_bookstore_window',
        name: '书店橱窗',
        icon: '📖',
        position: { x: 78, y: 40 },
        size: { width: 12, height: 14 },
        dialogue: [
          { speaker: 'her', text: '你看！《小王子》出纪念版了！' },
          { speaker: 'you', text: '你不是已经有一本了吗？' },
          { speaker: 'her', text: '那本不一样。那本是我送给你的，这本是...我想留给自己的。' },
          { speaker: 'narrator', text: '她翻开扉页，用极小的字写着什么。你凑过去看，她却赶紧合上了。"到时候你就知道了。"她神秘地笑了笑。' }
        ],
        foreshadowing: 'f_book_secret'
      },
      {
        id: 'p_street_corner',
        name: '转角长椅',
        icon: '🪑',
        position: { x: 40, y: 65 },
        size: { width: 12, height: 10 },
        dialogue: [
          { speaker: 'her', text: '我们坐一会儿吧。走了一上午，脚有点酸。' },
          { speaker: 'you', text: '要不要我背你？' },
          { speaker: 'her', text: '好啊！' },
          { speaker: 'narrator', text: '她跳上你的背，笑得像个小孩子。你们在转角的长椅上坐了很久，什么都不说，就看着街上的人来人往。她突然开口——' },
          { speaker: 'her', text: '你说，这条街以后还会记得我们吗？' },
          { speaker: 'you', text: '当然会。我们在这里走了那么多次，每块砖都认识我们。' },
          { speaker: 'her', text: '那就好。' }
        ]
      }
    ],
    exitDialogue: [
      { speaker: 'her', text: '时间不早了...我们还有最后一站。' },
      { speaker: 'narrator', text: '她看了看天色，眼里有光也有雾。你牵起她的手，感觉她的指尖微凉。' }
    ]
  },
  {
    id: 'lakeside',
    name: '傍晚湖畔',
    timeLabel: '17:30',
    description: '黄昏的湖畔，夕阳把一切都染成了金色。你们坐在老地方，湖水轻轻拍打着岸边。她从包里掏出了一个瓶子，还有两张折叠的纸条。',
    backgroundStyle: 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 30%, #f0a060 60%, #2a5a6b 100%)',
    atmosphere: 'melancholy',
    interactivePoints: [
      {
        id: 'p_bottle',
        name: '漂流瓶',
        icon: '🍾',
        position: { x: 35, y: 55 },
        size: { width: 10, height: 14 },
        dialogue: [
          { speaker: 'her', text: '我们把愿望写在纸条上，放进瓶子里，扔进湖里。十年后再回来找！' },
          { speaker: 'you', text: '十年？那也太久了吧。' },
          { speaker: 'her', text: '不长不长！有了这个约定，你就一定会回来了呀。' },
          { speaker: 'narrator', text: '你写的是：希望十年后我们还在一起。你偷偷瞥了一眼她的纸条，她慌忙地把它卷起来塞进瓶子。"不许偷看！"她红着脸说。' }
        ],
        foreshadowing: 'f_bottle_wish'
      },
      {
        id: 'p_stone',
        name: '湖边的石子',
        icon: '🪨',
        position: { x: 60, y: 70 },
        size: { width: 8, height: 8 },
        dialogue: [
          { speaker: 'her', text: '你会永远爱我吗？' },
          { speaker: 'you', text: '永远。' },
          { speaker: 'her', text: '永远有多远？' },
          { speaker: 'you', text: '就像这颗石头，即使海枯石烂，也不会变。' },
          { speaker: 'narrator', text: '你捡起湖边的小石子递给她。她小心翼翼地收好，像是收起了全世界最珍贵的宝物。' }
        ],
        foreshadowing: 'f_stone_promise'
      },
      {
        id: 'p_necklace',
        name: '贝壳项链',
        icon: '📿',
        position: { x: 45, y: 40 },
        size: { width: 10, height: 10 },
        dialogue: [
          { speaker: 'her', text: '你还记得这条项链吗？' },
          { speaker: 'you', text: '当然记得，我花了一整个下午找的那颗贝壳。' },
          { speaker: 'her', text: '你说它代表永恒。永恒有多久？' },
          { speaker: 'you', text: '比永远多一天。' },
          { speaker: 'narrator', text: '她摸了摸脖子上的贝壳项链，轻声说："那我每天都戴着它，直到你回来为止。"' }
        ],
        foreshadowing: 'f_shell_eternal'
      },
      {
        id: 'p_sunset',
        name: '湖面上的夕阳',
        icon: '🌅',
        position: { x: 70, y: 25 },
        size: { width: 14, height: 10 },
        dialogue: [
          { speaker: 'narrator', text: '夕阳把湖面染成了一片金红。她靠在你肩上，你们什么都没说，就这样看着太阳一点一点沉下去。' },
          { speaker: 'her', text: '你知道吗，夕阳是太阳给月亮写的情书。' },
          { speaker: 'you', text: '那我给你写一封？' },
          { speaker: 'her', text: '不用写。你在这里，就是最好的情书。' },
          { speaker: 'narrator', text: '最后一缕阳光消失在地平线上。她轻轻叹了口气——' },
          { speaker: 'her', text: '该走了。' }
        ]
      }
    ],
    exitDialogue: [
      { speaker: 'narrator', text: '你们站起来，沿着湖畔慢慢往回走。她的手一直紧紧握着你的，像是怕一松手你就会消失。路灯一盏一盏亮起来，照亮了你们并肩的影子。' },
      { speaker: 'her', text: '还有最后一站...火车站。' }
    ]
  },
  {
    id: 'station_farewell',
    name: '深夜车站',
    timeLabel: '21:00',
    description: '火车站的灯光昏黄，雾气从远处慢慢蔓延过来。站台上只有你们两个人，火车还有二十三分钟进站。她手里握着那张车票，指尖有些发白。',
    backgroundStyle: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 30%, #16213e 60%, #0f3460 100%)',
    atmosphere: 'sad',
    interactivePoints: [
      {
        id: 'p_ticket',
        name: '她的车票',
        icon: '🎫',
        position: { x: 45, y: 35 },
        size: { width: 10, height: 12 },
        dialogue: [
          { speaker: 'narrator', text: '她手里握着一张车票——不是你的，是她的。明天一早，她就要坐这趟车离开了。' },
          { speaker: 'you', text: '车票...是明天的？' },
          { speaker: 'her', text: '嗯。8:23的火车。' },
          { speaker: 'narrator', text: '8:23。你把这个时间刻进了骨头里。' }
        ],
        foreshadowing: 'f_ticket_time'
      },
      {
        id: 'p_scarf',
        name: '蓝色围巾',
        icon: '🧣',
        position: { x: 22, y: 50 },
        size: { width: 10, height: 14 },
        dialogue: [
          { speaker: 'narrator', text: '她解下脖子上的蓝色围巾，踮起脚尖围在你脖子上。' },
          { speaker: 'her', text: '给你。这样你就不会冷了。' },
          { speaker: 'you', text: '那你呢？你不冷吗？' },
          { speaker: 'her', text: '我不冷。只要想着你，心里就是暖的。' },
          { speaker: 'narrator', text: '围巾上还带着她的温度和淡淡的薰衣草香。你想把它摘下来还给她，却怎么也张不开口。' }
        ],
        foreshadowing: 'f_scarf_warmth'
      },
      {
        id: 'p_watch',
        name: '你的怀表',
        icon: '⌚',
        position: { x: 72, y: 50 },
        size: { width: 8, height: 10 },
        dialogue: [
          { speaker: 'narrator', text: '你掏出怀表看了看时间，8点整。还有23分钟。你忽然很想让这块表永远停下来。' },
          { speaker: 'her', text: '你在看什么？' },
          { speaker: 'you', text: '没什么。只是觉得时间过得太快了。' },
          { speaker: 'her', text: '时间会证明一切的。' },
          { speaker: 'narrator', text: '她说这话的时候，语气很轻，像是说给你听，又像是说给自己听。你不懂她的意思，只是紧紧握住了她的手。' }
        ],
        foreshadowing: 'f_watch_stop'
      },
      {
        id: 'p_her_hand',
        name: '她的手',
        icon: '🤝',
        position: { x: 50, y: 60 },
        size: { width: 12, height: 10 },
        dialogue: [
          { speaker: 'narrator', text: '她主动牵起了你的手，十指相扣。你能感觉到她的手在微微颤抖。' },
          { speaker: 'her', text: '如果...如果我说我想让你留下来，你会不会...？' },
          { speaker: 'you', text: '我——' },
          { speaker: 'her', text: '算了，当我没说。你有你要走的路，我懂的。' },
          { speaker: 'narrator', text: '她松开了你的手，退后了一步。雾气更浓了，你几乎看不清她的表情。' }
        ],
        foreshadowing: 'f_unspoken_words'
      }
    ],
    exitDialogue: [
      { speaker: 'narrator', text: '远处传来火车的汽笛声。她深吸一口气，朝你笑了笑。' },
      { speaker: 'her', text: '我会等你的。' },
      { speaker: 'narrator', text: '她转身走进了雾气里，你看着她的身影越来越模糊。你想喊住她，想追上去，想告诉她——' },
      { speaker: 'narrator', text: '但你什么都没做。火车轰鸣着进站了，带着她离开了这座城市。' },
      { speaker: 'narrator', text: '你一个人站在站台上，手里还攥着那条蓝色围巾。雾气散去的时候，站台上空无一人。' },
      { speaker: 'narrator', text: '那是你们分别前的最后一天。' }
    ]
  }
]

export const prologueForeshadowings = [
  {
    id: 'f_awkake',
    title: '清晨的睡颜',
    description: '她靠在你肩上熟睡的样子，成了你五年来最常梦到的画面。',
    connectsTo: 'm2',
    hint: '五年后回到雾城，围巾上的薰衣草香还会唤起那个清晨的记忆...'
  },
  {
    id: 'f_time_stop',
    title: '停摆的时间',
    description: '她说时间对每个人都是公平的——但怀表停在了8:23，像是时间本身也不同意这场分别。',
    connectsTo: 'm3',
    hint: '那块停在8:23的怀表，五年后还在原地等待...'
  },
  {
    id: 'f_lavender_promise',
    title: '薰衣草的约定',
    description: '她说会替你照顾薰衣草，每天浇水就像在跟你说话。那个花语——等待爱情——你是否真正理解了？',
    connectsTo: 'm10',
    hint: '公园门口的薰衣草，花语是等待爱情...'
  },
  {
    id: 'f_birthday_wish',
    title: '未说出口的愿望',
    description: '她的生日愿望始终是个谜。你说说出来就不灵了，可如果当时说出口了呢？',
    connectsTo: 'm11',
    hint: '那个飘走的气球，承载着从未说出口的愿望...'
  },
  {
    id: 'f_icecream_share',
    title: '双份甜蜜',
    description: '分着吃就有双份甜蜜——这是她教你的道理。只是以后，再也没人和你分冰淇淋了。',
    connectsTo: 'm5',
    hint: '老街的冰淇淋店还在，只是再没人陪你分享了...'
  },
  {
    id: 'f_photo_memory',
    title: '最后一张合影',
    description: '梧桐树下的合照，阳光穿过树叶投下斑驳的光影。你不知道这是你们最后的合照。',
    connectsTo: 'm4',
    hint: '那张被雨水打湿的合照，还留着那个夏天的温度...'
  },
  {
    id: 'f_book_secret',
    title: '扉页上的秘密',
    description: '她在《小王子》扉页上写了什么？你说不许偷看，她便笑着合上了书。这个秘密，要等五年后才能揭晓。',
    connectsTo: 'm13',
    hint: '《小王子》的扉页上，藏着她给你的最后一句话...'
  },
  {
    id: 'f_bottle_wish',
    title: '湖中的时间胶囊',
    description: '漂流瓶里装着你们各自的愿望。十年之约，五年过去了，瓶子却先回到了岸边。',
    connectsTo: 'm16',
    hint: '漂流瓶回来了，但纸条上的字已经被水浸得模糊...'
  },
  {
    id: 'f_stone_promise',
    title: '永恒的石子',
    description: '你说这颗石子代表永恒，即使海枯石烂也不会变。五年后，你再次捡起它，才明白永恒不是不会改变，而是即使改变也不会放手。',
    connectsTo: 'm18',
    hint: '湖边的那颗石子，还在原地等你...'
  },
  {
    id: 'f_shell_eternal',
    title: '贝壳与永恒',
    description: '比永远多一天——这是你对永恒的定义。她说每天都戴着，直到你回来。你不知道她有没有做到。',
    connectsTo: 'm17',
    hint: '贝壳项链的承诺，比永远多一天...'
  },
  {
    id: 'f_ticket_time',
    title: '8:23的车票',
    description: '8点23分——火车开走的时间，也是你们分别的时间。这块怀表，从此再也没有走过。',
    connectsTo: 'm1',
    hint: '泛黄的车票上，印着五年前的日期...'
  },
  {
    id: 'f_scarf_warmth',
    title: '围巾的温度',
    description: '她把蓝色围巾围在你脖子上，说想着你心里就是暖的。围巾上的薰衣草香，五年后依然清晰。',
    connectsTo: 'm2',
    hint: '蓝色围巾上的薰衣草香，穿越了五年...'
  },
  {
    id: 'f_watch_stop',
    title: '时间会证明一切',
    description: '"时间会证明一切。"——她最后说的这句话，你用了五年去理解。',
    connectsTo: 'm3',
    hint: '停在8:23的怀表，和时间会证明一切的承诺...'
  },
  {
    id: 'f_unspoken_words',
    title: '未说出口的话',
    description: '她问如果她让你留下来，你会不会——话没说完，她就收回了。那句话的完整版本，五年来一直在你脑海里回放。',
    connectsTo: 'hm3',
    hint: '日记的最后一页，写着她从未说出口的话...'
  }
]

export const prologueDialogueSpeakers = {
  narrator: { name: '旁白', color: '#a0a0b0' },
  you: { name: '你', color: '#60a5fa' },
  her: { name: '她', color: '#f472b6' }
}
