export const scenes = [
  {
    id: 'station',
    name: '雾城火车站',
    description: '五年前，你就是在这里与她分别。雾气弥漫的站台，仿佛还能看见她挥手的身影...',
    backgroundStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fogIntensity: 0.7,
    connectedScenes: ['street', 'cafe'],
    items: [
      {
        id: 'ticket',
        name: '旧车票',
        description: '一张泛黄的火车票，日期是五年前的今天。',
        position: { x: 15, y: 65 },
        size: { width: 12, height: 8 },
        icon: '🎫'
      },
      {
        id: 'scarf',
        name: '蓝色围巾',
        description: '她当年最喜欢的那条蓝色围巾，被遗落在了候车椅上。',
        position: { x: 60, y: 55 },
        size: { width: 10, height: 12 },
        icon: '🧣'
      },
      {
        id: 'watch',
        name: '怀表',
        description: '一块停在8点23分的怀表，那是火车开走的时间。',
        position: { x: 80, y: 70 },
        size: { width: 8, height: 10 },
        icon: '⌚'
      }
    ]
  },
  {
    id: 'street',
    name: '雾城老街',
    description: '熟悉的街道，两旁的梧桐树还是老样子。雾气中，仿佛能听到曾经的笑声...',
    backgroundStyle: 'linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #4a6741 100%)',
    fogIntensity: 0.5,
    connectedScenes: ['station', 'park', 'bookstore'],
    items: [
      {
        id: 'photo',
        name: '合照',
        description: '一张被雨水打湿边缘的合照，照片上的你们笑得那么灿烂。',
        position: { x: 25, y: 60 },
        size: { width: 10, height: 12 },
        icon: '🖼️'
      },
      {
        id: 'icecream',
        name: '冰淇淋勺',
        description: '那家老字号冰淇淋店的勺子，你们曾分享过同一个甜筒。',
        position: { x: 70, y: 45 },
        size: { width: 8, height: 10 },
        icon: '🍦'
      },
      {
        id: 'letter',
        name: '未寄出的信',
        description: '一封写满思念的信，却始终没有勇气寄出去。',
        position: { x: 45, y: 75 },
        size: { width: 10, height: 8 },
        icon: '💌'
      }
    ]
  },
  {
    id: 'cafe',
    name: '转角咖啡馆',
    description: '你们第一次约会的地方。靠窗的位置，还留着她最喜欢的拿铁香味...',
    backgroundStyle: 'linear-gradient(180deg, #3d2914 0%, #5d4e37 50%, #8b7355 100%)',
    fogIntensity: 0.3,
    connectedScenes: ['station', 'bookstore'],
    items: [
      {
        id: 'cup',
        name: '咖啡杯',
        description: '杯口还留着她的口红印，仿佛她刚刚才离开。',
        position: { x: 30, y: 50 },
        size: { width: 10, height: 12 },
        icon: '☕'
      },
      {
        id: 'ring',
        name: '易拉罐拉环',
        description: '你当年用这个开玩笑说要向她求婚，她红着脸说等以后。',
        position: { x: 65, y: 65 },
        size: { width: 8, height: 8 },
        icon: '💍'
      },
      {
        id: 'notebook',
        name: '日记本',
        description: '她落下的日记本，里面写满了关于你的心事。',
        position: { x: 80, y: 40 },
        size: { width: 12, height: 14 },
        icon: '📔'
      }
    ]
  },
  {
    id: 'park',
    name: '回忆公园',
    description: '傍晚时分的公园，夕阳穿过雾气，洒下金色的光芒。那座长椅上，刻着你们的名字...',
    backgroundStyle: 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 50%, #6a82fb 100%)',
    fogIntensity: 0.4,
    connectedScenes: ['street', 'lake'],
    items: [
      {
        id: 'flower',
        name: '干花',
        description: '一朵被压平的薰衣草，是你们第一次约会时你送她的。',
        position: { x: 20, y: 55 },
        size: { width: 8, height: 12 },
        icon: '🌸'
      },
      {
        id: 'balloon',
        name: '气球绳子',
        description: '生日那天放飞的气球，绳子还在，气球却早已飞向远方。',
        position: { x: 55, y: 25 },
        size: { width: 6, height: 20 },
        icon: '🎈'
      },
      {
        id: 'carving',
        name: '木刻',
        description: '刻在老树上的两颗心，虽然有些模糊，但依然清晰可见。',
        position: { x: 75, y: 50 },
        size: { width: 12, height: 15 },
        icon: '🪵'
      }
    ]
  },
  {
    id: 'bookstore',
    name: '时光书店',
    description: '她最爱来的书店，书架间似乎还能看到她专注读书的身影...',
    backgroundStyle: 'linear-gradient(180deg, #4a3728 0%, #6b4423 50%, #8b5a2b 100%)',
    fogIntensity: 0.2,
    connectedScenes: ['street', 'cafe'],
    items: [
      {
        id: 'book',
        name: '小王子',
        description: '她最爱的那本书，扉页写着送给你的话。',
        position: { x: 35, y: 45 },
        size: { width: 10, height: 14 },
        icon: '📖'
      },
      {
        id: 'bookmark',
        name: '书签',
        description: '一枚枫叶做的书签，是那年秋天你们一起捡的。',
        position: { x: 60, y: 60 },
        size: { width: 8, height: 12 },
        icon: '🍁'
      },
      {
        id: 'glasses',
        name: '眼镜',
        description: '她看书时戴的眼镜，镜片上似乎还有雾气。',
        position: { x: 80, y: 55 },
        size: { width: 10, height: 8 },
        icon: '👓'
      }
    ]
  },
  {
    id: 'lake',
    name: '雾霭湖畔',
    description: '湖面上雾气缭绕，像是一层轻纱。五年前的夏天，你们曾在这里许下诺言...',
    backgroundStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #1f4068 70%, #206a5d 100%)',
    fogIntensity: 0.8,
    connectedScenes: ['park'],
    items: [
      {
        id: 'bottle',
        name: '漂流瓶',
        description: '你们扔进湖里的漂流瓶，不知为何又回到了岸边。',
        position: { x: 25, y: 70 },
        size: { width: 10, height: 14 },
        icon: '🍾'
      },
      {
        id: 'necklace',
        name: '贝壳项链',
        description: '你在海边为她捡贝壳做的项链，她说要永远戴着。',
        position: { x: 55, y: 50 },
        size: { width: 10, height: 10 },
        icon: '📿'
      },
      {
        id: 'promise',
        name: '石子',
        description: '那颗你说代表永恒的小石子，静静地躺在湖边。',
        position: { x: 75, y: 75 },
        size: { width: 8, height: 8 },
        icon: '🪨'
      }
    ]
  }
]

export const memories = [
  {
    id: 'm1',
    triggerItemId: 'ticket',
    title: '离别的站台',
    content: '"我会等你的。"她的声音带着哽咽，火车的轰鸣声掩盖了她最后说的那句话。你紧紧握着车票，看着她的身影越来越小，直到消失在雾气中。五年后再回到这里，那张泛黄的车票还在，只是等待的人，是否还在原地？',
    emotion: 'sad',
    year: '五年前'
  },
  {
    id: 'm2',
    triggerItemId: 'scarf',
    title: '温暖的冬天',
    content: '那年冬天特别冷，她把自己的蓝色围巾围在你脖子上。"这样你就不会冷了。"她笑着说，鼻尖冻得通红。围巾上还留着她的味道，你想把它摘下来还给她，却发现她已经跑远了。现在，这条围巾还带着淡淡的薰衣草香。',
    emotion: 'warm',
    year: '六年前'
  },
  {
    id: 'm3',
    triggerItemId: 'watch',
    title: '停下的时间',
    content: '8点23分，火车准点开出。你看着她发来的最后一条短信："时间会证明一切。"然后，这块怀表就再也没有走过。也许时间真的能证明什么，但五年过去了，你依然不懂她这句话的意思。',
    emotion: 'pensive',
    year: '五年前'
  },
  {
    id: 'm4',
    triggerItemId: 'photo',
    title: '盛夏的笑容',
    content: '照片是在一个夏天拍的，你们在梧桐树下笑得没心没肺。"我们要永远这样开心。"她说着，把头靠在你肩上。阳光穿过树叶的缝隙，在她脸上投下斑驳的光影。你以为那个夏天会是永远，却没想到那是你们最后一次一起过夏天。',
    emotion: 'happy',
    year: '七年前'
  },
  {
    id: 'm5',
    triggerItemId: 'icecream',
    title: '甜蜜的分享',
    content: '她总说一个冰淇淋吃不完，要和你分着吃。"这样就有双份的甜蜜了。"她用勺子挖了一大勺递给你，眼睛弯成了月牙。你故意吃得很慢，就是想和她多待一会儿。现在再路过这家店，你还是会习惯性地点两份。',
    emotion: 'sweet',
    year: '六年前'
  },
  {
    id: 'm6',
    triggerItemId: 'letter',
    title: '未说出口的话',
    content: '这封信你写了又改，改了又写，最后还是没有寄出去。"亲爱的，我想告诉你..."每次写到这里就写不下去了。有些话，总是在面对她的时候说不出口。现在再看这些文字，字迹已经有些模糊，不知道是被泪水还是雨水打湿的。',
    emotion: 'sad',
    year: '五年前'
  },
  {
    id: 'm7',
    triggerItemId: 'cup',
    title: '第一次约会',
    content: '你紧张得手心都是汗，她却很自然地坐在了你对面。"一杯拿铁，谢谢。"她对服务员说，然后转过头对你微笑。那是你们第一次单独见面，你却感觉已经认识她很久很久了。杯口的口红印，是她留下的第一个痕迹。',
    emotion: 'nervous',
    year: '八年前'
  },
  {
    id: 'm8',
    triggerItemId: 'ring',
    title: '玩笑的承诺',
    content: '你拿着易拉罐拉环单膝跪地，"嫁给我吧！"她笑着拍你，"谁要嫁给你啊，想得美。"嘴上这么说，脸却红了。"等以后吧，等你真的准备好的时候。"她接过拉环，小心翼翼地收进了包里。你一直记得这句话，只是那个"以后"，好像永远都不会来。',
    emotion: 'bittersweet',
    year: '七年前'
  },
  {
    id: 'm9',
    triggerItemId: 'notebook',
    title: '她的心事',
    content: '她的日记本里写满了你的名字。"今天他又迟到了，我假装生气，其实心里很开心。""他说我笑起来很好看，我开心了一整天。""他说他要走了，我不知道该怎么办。"翻到最后一页，只有一句话："如果我开口挽留，你会留下吗？"',
    emotion: 'shocking',
    year: '五年前'
  },
  {
    id: 'm10',
    triggerItemId: 'flower',
    title: '紫色的约定',
    content: '薰衣草的花语是等待爱情。你拿着这朵花紧张地站在公园门口，她出现的时候，你把花递过去，什么都没说。她接过花，闻了闻，"我知道。"她说。你不知道她知道什么，但是从那天起，你们就在一起了。',
    emotion: 'romantic',
    year: '八年前'
  },
  {
    id: 'm11',
    triggerItemId: 'balloon',
    title: '飘走的愿望',
    content: '生日那天，你们一起放飞气球。"许个愿吧。"她说。你闭上眼睛许愿：希望每年的生日都能和她一起过。睁开眼的时候，气球已经飞远了。"你许了什么愿？"她好奇地问。"说出来就不灵了。"你笑着说。现在想想，也许说出来，愿望就不会跟着气球一起飘走了。',
    emotion: 'regret',
    year: '六年前'
  },
  {
    id: 'm12',
    triggerItemId: 'carving',
    title: '永恒的印记',
    content: '你们在老树上刻下两颗心，"这样我们的爱情就永远不会消失了。"她说。你笑着说："树会长大的。""那我们的爱情也会长大。"她认真地说。现在再看这两颗心，确实长大了一些，只是刻下它们的人，却不在身边了。',
    emotion: 'melancholy',
    year: '七年前'
  },
  {
    id: 'm13',
    triggerItemId: 'book',
    title: '共同的秘密',
    content: '《小王子》是她最爱的书。"你看，小王子和狐狸是最好的朋友。"她指着书页给你看，"你就是我的狐狸。""那你是我的玫瑰花吗？"你问。她脸红了，"才不是。"翻开扉页，是她的字迹："送给我的狐狸，愿你永远记得我。 - 你的玫瑰花"',
    emotion: 'touched',
    year: '七年前'
  },
  {
    id: 'm14',
    triggerItemId: 'bookmark',
    title: '秋天的回忆',
    content: '那年秋天的枫叶特别红，你们捡了满满一袋子。她用最红的那片做了书签，"这样你每次翻书都会想起我。"你说不会忘记她的，她只是笑着摇头。"人是会变的。"她说。你当时不懂她为什么这么说，现在终于懂了。',
    emotion: 'sad',
    year: '六年前'
  },
  {
    id: 'm15',
    triggerItemId: 'glasses',
    title: '专注的模样',
    content: '她看书的时候会戴眼镜，眉头微蹙，很认真的样子。你就坐在对面，假装看书，其实一直在看她。"你看我干嘛？"她突然抬头问。"你好看。"你实话实说。她脸一红，低下头继续看书，嘴角却微微上扬。',
    emotion: 'warm',
    year: '八年前'
  },
  {
    id: 'm16',
    triggerItemId: 'bottle',
    title: '时间胶囊',
    content: '"我们把愿望写在纸条上，放进瓶子里，扔进湖里。十年后再回来找。"她兴奋地说。你写的是：希望十年后我们还在一起。现在瓶子回来了，可是她呢？纸条已经被水浸得模糊不清，但你依然记得自己写的每一个字。',
    emotion: 'sad',
    year: '五年前'
  },
  {
    id: 'm17',
    triggerItemId: 'necklace',
    title: '永恒的贝壳',
    content: '你花了一个下午才找到这颗完美的贝壳，小心翼翼地做成项链。"送给你。"你把项链戴在她脖子上，"这代表永恒。"她摸了摸贝壳，"永恒有多久？""比永远多一天。"你说。她笑了，眼中闪着光。现在，项链还在，只是戴项链的人，已经不在身边了。',
    emotion: 'melancholy',
    year: '七年前'
  },
  {
    id: 'm18',
    triggerItemId: 'promise',
    title: '湖边的诺言',
    content: '"你会永远爱我吗？"她靠在你肩上问。"永远。"你坚定地说。"永远有多远？""就像这颗石头，即使海枯石烂，也不会变。"你捡起湖边的小石子递给她。她小心翼翼地收好，"那我就把它当作我们的信物。"湖水依旧，诺言却早已随着雾气飘散。',
    emotion: 'determined',
    year: '五年前'
  }
]
