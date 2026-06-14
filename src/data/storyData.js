export const scenes = [
  {
    id: 'station',
    name: '雾城火车站',
    description: '五年前，你就是在这里与她分别。雾气弥漫的站台，仿佛还能看见她挥手的身影...',
    backgroundStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fogIntensity: 0.7,
    connectedScenes: ['street', 'cafe'],
    accessiblePeriods: ['dawn', 'day', 'dusk', 'night'],
    timeDescriptions: {
      dawn: '黎明的火车站笼罩在淡金色的光晕中，早班火车的鸣笛声划破寂静...',
      day: '阳光透过雾气洒在站台上，人来人往，却没有那个熟悉的身影...',
      dusk: '黄昏的火车站被染成橙红色，下班的人群匆匆走过...',
      night: '夜晚的火车站灯火阑珊，只有几盏路灯照亮空荡荡的站台...'
    },
    items: [
      {
        id: 'ticket',
        name: '旧车票',
        description: '一张泛黄的火车票，日期是五年前的今天。',
        position: { x: 15, y: 65 },
        size: { width: 12, height: 8 },
        icon: '🎫',
        visiblePeriods: ['dawn', 'day', 'dusk', 'night']
      },
      {
        id: 'scarf',
        name: '蓝色围巾',
        description: '她当年最喜欢的那条蓝色围巾，被遗落在了候车椅上。',
        position: { x: 60, y: 55 },
        size: { width: 10, height: 12 },
        icon: '🧣',
        visiblePeriods: ['dawn', 'dusk', 'night']
      },
      {
        id: 'watch',
        name: '怀表',
        description: '一块停在8点23分的怀表，那是火车开走的时间。',
        position: { x: 80, y: 70 },
        size: { width: 8, height: 10 },
        icon: '⌚',
        visiblePeriods: ['day', 'dusk']
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
    accessiblePeriods: ['dawn', 'day', 'dusk', 'night'],
    timeDescriptions: {
      dawn: '清晨的老街很安静，只有早点摊的炊烟袅袅升起...',
      day: '白天的老街热闹非凡，店铺开门营业，人来人往...',
      dusk: '黄昏的老街被夕阳染成金色，梧桐树影婆娑...',
      night: '夜晚的老街灯火通明，小吃摊的香气弥漫在空气中...'
    },
    items: [
      {
        id: 'photo',
        name: '合照',
        description: '一张被雨水打湿边缘的合照，照片上的你们笑得那么灿烂。',
        position: { x: 25, y: 60 },
        size: { width: 10, height: 12 },
        icon: '🖼️',
        visiblePeriods: ['day', 'dusk']
      },
      {
        id: 'icecream',
        name: '冰淇淋勺',
        description: '那家老字号冰淇淋店的勺子，你们曾分享过同一个甜筒。',
        position: { x: 70, y: 45 },
        size: { width: 8, height: 10 },
        icon: '🍦',
        visiblePeriods: ['day']
      },
      {
        id: 'letter',
        name: '未寄出的信',
        description: '一封写满思念的信，却始终没有勇气寄出去。',
        position: { x: 45, y: 75 },
        size: { width: 10, height: 8 },
        icon: '💌',
        visiblePeriods: ['night']
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
    accessiblePeriods: ['day', 'dusk', 'night'],
    timeDescriptions: {
      day: '白天的咖啡馆阳光明媚，靠窗的位置洒满阳光...',
      dusk: '黄昏的咖啡馆笼罩在温暖的灯光下，咖啡香气四溢...',
      night: '夜晚的咖啡馆只留了一盏灯，空荡荡的座位上仿佛还留着她的影子...'
    },
    items: [
      {
        id: 'cup',
        name: '咖啡杯',
        description: '杯口还留着她的口红印，仿佛她刚刚才离开。',
        position: { x: 30, y: 50 },
        size: { width: 10, height: 12 },
        icon: '☕',
        visiblePeriods: ['day', 'dusk']
      },
      {
        id: 'ring',
        name: '易拉罐拉环',
        description: '你当年用这个开玩笑说要向她求婚，她红着脸说等以后。',
        position: { x: 65, y: 65 },
        size: { width: 8, height: 8 },
        icon: '💍',
        visiblePeriods: ['dusk']
      },
      {
        id: 'notebook',
        name: '日记本',
        description: '她落下的日记本，里面写满了关于你的心事。',
        position: { x: 80, y: 40 },
        size: { width: 12, height: 14 },
        icon: '📔',
        visiblePeriods: ['day']
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
    accessiblePeriods: ['dawn', 'day', 'dusk', 'night'],
    timeDescriptions: {
      dawn: '清晨的公园空气清新，晨练的人们开始出现...',
      day: '白天的公园阳光明媚，孩子们在草地上奔跑...',
      dusk: '黄昏的公园最美，夕阳把一切都染成了金黄色...',
      night: '夜晚的公园一片寂静，只有蝉鸣和风声，长椅在月光下等待...'
    },
    items: [
      {
        id: 'flower',
        name: '干花',
        description: '一朵被压平的薰衣草，是你们第一次约会时你送她的。',
        position: { x: 20, y: 55 },
        size: { width: 8, height: 12 },
        icon: '🌸',
        visiblePeriods: ['dawn', 'day']
      },
      {
        id: 'balloon',
        name: '气球绳子',
        description: '生日那天放飞的气球，绳子还在，气球却早已飞向远方。',
        position: { x: 55, y: 25 },
        size: { width: 6, height: 20 },
        icon: '🎈',
        visiblePeriods: ['day', 'dusk']
      },
      {
        id: 'carving',
        name: '木刻',
        description: '刻在老树上的两颗心，虽然有些模糊，但依然清晰可见。',
        position: { x: 75, y: 50 },
        size: { width: 12, height: 15 },
        icon: '🪵',
        visiblePeriods: ['dusk']
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
    accessiblePeriods: ['day', 'dusk', 'night'],
    timeDescriptions: {
      day: '白天的书店安静祥和，阳光透过窗户洒在书架上...',
      dusk: '黄昏的书店灯光温暖，最适合安静地阅读...',
      night: '夜晚的书店静谧安详，只有翻书声和咖啡香...'
    },
    items: [
      {
        id: 'book',
        name: '小王子',
        description: '她最爱的那本书，扉页写着送给你的话。',
        position: { x: 35, y: 45 },
        size: { width: 10, height: 14 },
        icon: '📖',
        visiblePeriods: ['day', 'dusk', 'night']
      },
      {
        id: 'bookmark',
        name: '书签',
        description: '一枚枫叶做的书签，是那年秋天你们一起捡的。',
        position: { x: 60, y: 60 },
        size: { width: 8, height: 12 },
        icon: '🍁',
        visiblePeriods: ['dusk', 'night']
      },
      {
        id: 'glasses',
        name: '眼镜',
        description: '她看书时戴的眼镜，镜片上似乎还有雾气。',
        position: { x: 80, y: 55 },
        size: { width: 10, height: 8 },
        icon: '👓',
        visiblePeriods: ['night']
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
    accessiblePeriods: ['dusk', 'night'],
    timeDescriptions: {
      dusk: '黄昏的湖畔波光粼粼，夕阳在湖面洒下金色...',
      night: '夜晚的湖畔雾气弥漫，月光倒映在水中...'
    },
    items: [
      {
        id: 'bottle',
        name: '漂流瓶',
        description: '你们扔进湖里的漂流瓶，不知为何又回到了岸边。',
        position: { x: 25, y: 70 },
        size: { width: 10, height: 14 },
        icon: '🍾',
        visiblePeriods: ['dusk', 'night']
      },
      {
        id: 'necklace',
        name: '贝壳项链',
        description: '你在海边为她捡贝壳做的项链，她说要永远戴着。',
        position: { x: 55, y: 50 },
        size: { width: 10, height: 10 },
        icon: '📿',
        visiblePeriods: ['dusk']
      },
      {
        id: 'promise',
        name: '石子',
        description: '那颗你说代表永恒的小石子，静静地躺在湖边。',
        position: { x: 75, y: 75 },
        size: { width: 8, height: 8 },
        icon: '🪨',
        visiblePeriods: ['night']
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
    year: '五年前',
    timeVariants: {
      dawn: {
        title: '黎明的离别',
        content: '黎明的站台上，你握着这张车票。五年前的那个清晨，雾气比现在更浓。"我会等你的。"她的声音带着哽咽，火车的轰鸣声掩盖了她最后说的那句话。晨光中，你仿佛又看到了她挥手的身影...',
        emotion: 'pensive'
      },
      night: {
        title: '深夜的车票',
        content: '深夜的火车站格外寂静。你握着这张泛黄的车票，五年前的那个夜晚历历在目。火车开走后，你一个人在站台上站了很久。如果当时你追上去，结局会不会不一样？',
        emotion: 'regret'
      }
    }
  },
  {
    id: 'm2',
    triggerItemId: 'scarf',
    title: '温暖的冬天',
    content: '那年冬天特别冷，她把自己的蓝色围巾围在你脖子上。"这样你就不会冷了。"她笑着说，鼻尖冻得通红。围巾上还留着她的味道，你想把它摘下来还给她，却发现她已经跑远了。现在，这条围巾还带着淡淡的薰衣草香。',
    emotion: 'warm',
    year: '六年前',
    timeVariants: {
      night: {
        title: '寒夜的温暖',
        content: '夜晚的凉意让你想起了那个冬天。她把蓝色围巾围在你脖子上，"这样你就不会冷了。"围巾上还留着她的温度和薰衣草香。在这个孤独的夜晚，这条围巾是你唯一的慰藉。',
        emotion: 'melancholy'
      }
    }
  },
  {
    id: 'm3',
    triggerItemId: 'watch',
    title: '停下的时间',
    content: '8点23分，火车准点开出。你看着她发来的最后一条短信："时间会证明一切。"然后，这块怀表就再也没有走过。也许时间真的能证明什么，但五年过去了，你依然不懂她这句话的意思。',
    emotion: 'pensive',
    year: '五年前',
    timeVariants: {
      day: {
        title: '日光下的怀表',
        content: '阳光照在怀表上，指针停在8点23分。那是火车开走的时间，也是她离开的时间。"时间会证明一切。"她的短信还在，可你始终不懂这句话的意思。也许有些答案，需要用一生去寻找。',
        emotion: 'pensive'
      }
    }
  },
  {
    id: 'm4',
    triggerItemId: 'photo',
    title: '盛夏的笑容',
    content: '照片是在一个夏天拍的，你们在梧桐树下笑得没心没肺。"我们要永远这样开心。"她说着，把头靠在你肩上。阳光穿过树叶的缝隙，在她脸上投下斑驳的光影。你以为那个夏天会是永远，却没想到那是你们最后一次一起过夏天。',
    emotion: 'happy',
    year: '七年前',
    timeVariants: {
      dusk: {
        title: '黄昏的合照',
        content: '黄昏的阳光洒在照片上，把你们的笑容染成了金色。"我们要永远这样开心。"七年前的那个盛夏，她靠在你肩上说。梧桐树下的誓言，现在只剩这张泛黄的照片。',
        emotion: 'bittersweet'
      }
    }
  },
  {
    id: 'm5',
    triggerItemId: 'icecream',
    title: '甜蜜的分享',
    content: '她总说一个冰淇淋吃不完，要和你分着吃。"这样就有双份的甜蜜了。"她用勺子挖了一大勺递给你，眼睛弯成了月牙。你故意吃得很慢，就是想和她多待一会儿。现在再路过这家店，你还是会习惯性地点两份。',
    emotion: 'sweet',
    year: '六年前',
    timeVariants: {
      day: {
        title: '正午的甜蜜',
        content: '正午的阳光让人想起那年夏天。她总说一个冰淇淋吃不完，要和你分着吃。"这样就有双份的甜蜜了。"她笑着把勺子递过来。现在冰淇淋店还在，只是再也没有人陪你分享了。',
        emotion: 'sweet'
      }
    }
  },
  {
    id: 'm6',
    triggerItemId: 'letter',
    title: '未说出口的话',
    content: '这封信你写了又改，改了又写，最后还是没有寄出去。"亲爱的，我想告诉你..."每次写到这里就写不下去了。有些话，总是在面对她的时候说不出口。现在再看这些文字，字迹已经有些模糊，不知道是被泪水还是雨水打湿的。',
    emotion: 'sad',
    year: '五年前',
    timeVariants: {
      night: {
        title: '深夜的信',
        content: '深夜里，你再次展开这封信。"亲爱的，我想告诉你..."五年了，你还是没有勇气寄出它。街灯的光透过窗户，照在模糊的字迹上——那些被泪水打湿的痕迹，在夜色中格外清晰。',
        emotion: 'sad'
      }
    }
  },
  {
    id: 'm7',
    triggerItemId: 'cup',
    title: '第一次约会',
    content: '你紧张得手心都是汗，她却很自然地坐在了你对面。"一杯拿铁，谢谢。"她对服务员说，然后转过头对你微笑。那是你们第一次单独见面，你却感觉已经认识她很久很久了。杯口的口红印，是她留下的第一个痕迹。',
    emotion: 'nervous',
    year: '八年前',
    timeVariants: {
      day: {
        title: '阳光下的相遇',
        content: '白天的咖啡馆，阳光透过窗户洒进来。八年前的那个午后，她就坐在你对面。"一杯拿铁，谢谢。"她的声音很好听。杯口的口红印，是那个下午最美好的印记。',
        emotion: 'warm'
      },
      dusk: {
        title: '黄昏的咖啡',
        content: '黄昏的咖啡馆格外浪漫。你想起八年前第一次约她出来的场景，紧张得手心都是汗。她却很自然地坐在了你对面，微笑着说："我等你很久了。"',
        emotion: 'romantic'
      }
    }
  },
  {
    id: 'm8',
    triggerItemId: 'ring',
    title: '玩笑的承诺',
    content: '你拿着易拉罐拉环单膝跪地，"嫁给我吧！"她笑着拍你，"谁要嫁给你啊，想得美。"嘴上这么说，脸却红了。"等以后吧，等你真的准备好的时候。"她接过拉环，小心翼翼地收进了包里。你一直记得这句话，只是那个"以后"，好像永远都不会来。',
    emotion: 'bittersweet',
    year: '七年前',
    timeVariants: {
      dusk: {
        title: '黄昏的承诺',
        content: '黄昏的光线最适合说情话。七年前的这个时刻，你拿着易拉罐拉环单膝跪地："嫁给我吧！"她脸红了，"等以后吧，等你真的准备好的时候。"你一直在准备，却再也没有机会说出口。',
        emotion: 'regret'
      }
    }
  },
  {
    id: 'm9',
    triggerItemId: 'notebook',
    title: '她的心事',
    content: '她的日记本里写满了你的名字。"今天他又迟到了，我假装生气，其实心里很开心。""他说我笑起来很好看，我开心了一整天。""他说他要走了，我不知道该怎么办。"翻到最后一页，只有一句话："如果我开口挽留，你会留下吗？"',
    emotion: 'shocking',
    year: '五年前',
    timeVariants: {
      day: {
        title: '午后的日记',
        content: '午后的阳光照在日记本上，她的字迹清晰可见。"今天他又迟到了，我假装生气，其实心里很开心。""他说他要走了，我不知道该怎么办。"翻到最后一页，你的心揪紧了——"如果我开口挽留，你会留下吗？"',
        emotion: 'shocking'
      }
    }
  },
  {
    id: 'm10',
    triggerItemId: 'flower',
    title: '紫色的约定',
    content: '薰衣草的花语是等待爱情。你拿着这朵花紧张地站在公园门口，她出现的时候，你把花递过去，什么都没说。她接过花，闻了闻，"我知道。"她说。你不知道她知道什么，但是从那天起，你们就在一起了。',
    emotion: 'romantic',
    year: '八年前',
    timeVariants: {
      dawn: {
        title: '黎明的薰衣草',
        content: '黎明的薄雾中，你仿佛又看到了八年前的那个清晨。你紧张地握着薰衣草，站在公园门口等她。她出现的时候，你把花递过去。她接过花，闻了闻，"我知道。"从那天起，你们的故事开始了。',
        emotion: 'romantic'
      }
    }
  },
  {
    id: 'm11',
    triggerItemId: 'balloon',
    title: '飘走的愿望',
    content: '生日那天，你们一起放飞气球。"许个愿吧。"她说。你闭上眼睛许愿：希望每年的生日都能和她一起过。睁开眼的时候，气球已经飞远了。"你许了什么愿？"她好奇地问。"说出来就不灵了。"你笑着说。现在想想，也许说出来，愿望就不会跟着气球一起飘走了。',
    emotion: 'regret',
    year: '六年前',
    timeVariants: {
      day: {
        title: '阳光下的气球',
        content: '阳光明媚的下午，你们一起放飞气球。"许个愿吧。"她说。你闭上眼睛，许愿每年的生日都能和她一起过。现在气球早已飘远，愿望也随之消散。也许当时说出来，结局会不一样。',
        emotion: 'regret'
      },
      dusk: {
        title: '黄昏的愿望',
        content: '黄昏的天空格外美丽，六年前的生日就是这样的天气。你们一起放飞气球，她问你许了什么愿。"说出来就不灵了。"你笑着回答。现在你多希望当时能告诉她——"我的愿望，就是和你永远在一起。"',
        emotion: 'melancholy'
      }
    }
  },
  {
    id: 'm12',
    triggerItemId: 'carving',
    title: '永恒的印记',
    content: '你们在老树上刻下两颗心，"这样我们的爱情就永远不会消失了。"她说。你笑着说："树会长大的。""那我们的爱情也会长大。"她认真地说。现在再看这两颗心，确实长大了一些，只是刻下它们的人，却不在身边了。',
    emotion: 'melancholy',
    year: '七年前',
    timeVariants: {
      dusk: {
        title: '黄昏的木刻',
        content: '黄昏的阳光把老树的影子拉得很长。七年前，你们在这里刻下两颗心。"树会长大的。"你说。"那我们的爱情也会长大。"她认真地回答。现在树长大了，心也长大了，只是刻下它们的人，却不在了。',
        emotion: 'melancholy'
      }
    }
  },
  {
    id: 'm13',
    triggerItemId: 'book',
    title: '共同的秘密',
    content: '《小王子》是她最爱的书。"你看，小王子和狐狸是最好的朋友。"她指着书页给你看，"你就是我的狐狸。""那你是我的玫瑰花吗？"你问。她脸红了，"才不是。"翻开扉页，是她的字迹："送给我的狐狸，愿你永远记得我。 - 你的玫瑰花"',
    emotion: 'touched',
    year: '七年前',
    timeVariants: {
      day: {
        title: '午后的小王子',
        content: '午后的阳光穿过书店的窗户，照在《小王子》的封面上。"你就是我的狐狸。"七年前，她指着书页对你说。翻开扉页，她的字迹依然清晰："送给我的狐狸，愿你永远记得我。 - 你的玫瑰花"',
        emotion: 'touched'
      },
      night: {
        title: '深夜的阅读',
        content: '深夜里，你再次翻开《小王子》。"只有用心才能看得清楚，本质的东西眼睛是看不见的。"她曾经念给你听。泪水模糊了字迹，你终于明白——你一直都是她的小王子，只是你从来没有真正看见她的爱。',
        emotion: 'sad'
      }
    }
  },
  {
    id: 'm14',
    triggerItemId: 'bookmark',
    title: '秋天的回忆',
    content: '那年秋天的枫叶特别红，你们捡了满满一袋子。她用最红的那片做了书签，"这样你每次翻书都会想起我。"你说不会忘记她的，她只是笑着摇头。"人是会变的。"她说。你当时不懂她为什么这么说，现在终于懂了。',
    emotion: 'sad',
    year: '六年前',
    timeVariants: {
      dusk: {
        title: '黄昏的枫叶',
        content: '黄昏的天空像枫叶一样红。六年前的秋天，你们捡了满满一袋子枫叶。她用最红的那片做了书签，"这样你每次翻书都会想起我。"你说不会忘记她，她却摇头说："人是会变的。"现在你终于懂了她的意思。',
        emotion: 'sad'
      },
      night: {
        title: '深夜的书签',
        content: '深夜里，你摩挲着这片枫叶书签。六年前的秋天，她把它送给你，"这样你每次翻书都会想起我。"你说不会忘记她，她却只是摇头。窗外的秋风呼啸，你终于明白——她早就知道会有这么一天。',
        emotion: 'melancholy'
      }
    }
  },
  {
    id: 'm15',
    triggerItemId: 'glasses',
    title: '专注的模样',
    content: '她看书的时候会戴眼镜，眉头微蹙，很认真的样子。你就坐在对面，假装看书，其实一直在看她。"你看我干嘛？"她突然抬头问。"你好看。"你实话实说。她脸一红，低下头继续看书，嘴角却微微上扬。',
    emotion: 'warm',
    year: '八年前',
    timeVariants: {
      night: {
        title: '深夜的眼镜',
        content: '深夜的书店很安静，只有翻书的声音。你想起八年前的那个夜晚，她就坐在你对面看书，戴着这副眼镜。"你看我干嘛？"她突然抬头。"你好看。"你实话实说。她的脸红了，在灯光下格外动人。',
        emotion: 'warm'
      }
    }
  },
  {
    id: 'm16',
    triggerItemId: 'bottle',
    title: '时间胶囊',
    content: '"我们把愿望写在纸条上，放进瓶子里，扔进湖里。十年后再回来找。"她兴奋地说。你写的是：希望十年后我们还在一起。现在瓶子回来了，可是她呢？纸条已经被水浸得模糊不清，但你依然记得自己写的每一个字。',
    emotion: 'sad',
    year: '五年前',
    timeVariants: {
      dusk: {
        title: '黄昏的漂流瓶',
        content: '黄昏的湖面波光粼粼。五年前的这个时刻，你们把愿望写在纸条上，放进漂流瓶里。你写的是：希望十年后我们还在一起。现在瓶子回来了，可是她在哪里？',
        emotion: 'sad'
      },
      night: {
        title: '夜晚的回信',
        content: '夜晚的湖水倒映着月光。你打开漂流瓶，纸条已经被水浸得模糊。但你依然记得自己写的每一个字——"希望十年后我们还在一起。"五年了，这个愿望还能实现吗？',
        emotion: 'pensive'
      }
    }
  },
  {
    id: 'm17',
    triggerItemId: 'necklace',
    title: '永恒的贝壳',
    content: '你花了一个下午才找到这颗完美的贝壳，小心翼翼地做成项链。"送给你。"你把项链戴在她脖子上，"这代表永恒。"她摸了摸贝壳，"永恒有多久？""比永远多一天。"你说。她笑了，眼中闪着光。现在，项链还在，只是戴项链的人，已经不在身边了。',
    emotion: 'melancholy',
    year: '七年前',
    timeVariants: {
      dusk: {
        title: '黄昏的项链',
        content: '黄昏的阳光照在贝壳项链上，折射出七彩的光。七年前的海边，你把它戴在她脖子上。"这代表永恒。""永恒有多久？""比永远多一天。"她笑了，眼中闪着光。现在项链还在，只是戴项链的人不在了。',
        emotion: 'melancholy'
      }
    }
  },
  {
    id: 'm18',
    triggerItemId: 'promise',
    title: '湖边的诺言',
    content: '"你会永远爱我吗？"她靠在你肩上问。"永远。"你坚定地说。"永远有多远？""就像这颗石头，即使海枯石烂，也不会变。"你捡起湖边的小石子递给她。她小心翼翼地收好，"那我就把它当作我们的信物。"湖水依旧，诺言却早已随着雾气飘散。',
    emotion: 'determined',
    year: '五年前',
    timeVariants: {
      night: {
        title: '深夜的诺言',
        content: '深夜的湖畔只有你一个人。五年前的这个夜晚，她靠在你肩上问："你会永远爱我吗？""永远。"你捡起这颗小石子递给她，"就像它一样，永远不变。"湖水依旧，可诺言呢？',
        emotion: 'determined'
      }
    }
  }
]

export const craftedItems = [
  {
    id: 'time_key',
    name: '时光钥匙',
    description: '将怀表、车票与未寄出的信融合，铸成的一把闪耀着淡蓝色光芒的钥匙。据说它能打开被时间封印的门。',
    icon: '🗝️',
    rarity: 'legendary'
  },
  {
    id: 'promise_ring',
    name: '承诺之戒',
    description: '易拉罐拉环与贝壳项链的缠绕，还有那颗代表永恒的石子镶嵌其中。这不只是玩笑，而是真正的约定。',
    icon: '💎',
    rarity: 'legendary'
  },
  {
    id: 'memory_book',
    name: '回忆之书',
    description: '日记本、书签、小王子，还有那枚枫叶书签夹在其中。每一页，都是你们共同写下的故事。',
    icon: '📚',
    rarity: 'epic'
  },
  {
    id: 'summer_locket',
    name: '盛夏相片盒',
    description: '合照、干花与冰淇淋勺的碎片，封存进一个精巧的小盒中。打开它，仿佛能闻到那年夏天的味道。',
    icon: '🌻',
    rarity: 'epic'
  },
  {
    id: 'eternal_bouquet',
    name: '永恒花束',
    description: '干薰衣草、气球绳子与木刻碎屑组成的花束，不会凋谢，不会褪色，就像你们刻在老树上的誓言。',
    icon: '💐',
    rarity: 'rare'
  },
  {
    id: 'lake_message',
    name: '湖水信笺',
    description: '漂流瓶中的纸条被重新抚平，和贝壳、许愿石一起，组成了一封来自五年前的完整情书。',
    icon: '📜',
    rarity: 'rare'
  }
]

export const recipes = [
  {
    id: 'r1',
    resultId: 'time_key',
    ingredients: ['watch', 'ticket', 'letter'],
    hint: '时间、离别与未说出口的话，也许能打开某扇门...'
  },
  {
    id: 'r2',
    resultId: 'promise_ring',
    ingredients: ['ring', 'necklace', 'promise'],
    hint: '玩笑的承诺、海边的贝壳与湖边的石头，能否组成真正的约定？'
  },
  {
    id: 'r3',
    resultId: 'memory_book',
    ingredients: ['notebook', 'bookmark', 'book'],
    hint: '她的心事、你的秘密，还有那片秋天的枫叶...'
  },
  {
    id: 'r4',
    resultId: 'summer_locket',
    ingredients: ['photo', 'flower', 'icecream'],
    hint: '盛夏的笑容、紫色的约定，还有那份甜蜜的分享...'
  },
  {
    id: 'r5',
    resultId: 'eternal_bouquet',
    ingredients: ['flower', 'balloon', 'carving'],
    hint: '不会凋谢的花、飘走的愿望，还有刻在树上的心...'
  },
  {
    id: 'r6',
    resultId: 'lake_message',
    ingredients: ['bottle', 'necklace', 'promise'],
    hint: '时间胶囊里的愿望，似乎还缺少什么...'
  }
]

export const hiddenMemories = [
  {
    id: 'hm1',
    triggerCraftId: 'time_key',
    title: '被时间封印的真相',
    content: '你将时光钥匙插入火车站老钟的钥匙孔，指针开始疯狂转动，停在了五年前的8点22分——火车开走的前一分钟。你终于听到了她最后说的那句话："如果你开口挽留，我会留下来。"原来，只差一分钟，只差一句话。她的身影在雾气中渐渐清晰，"这一次，你还会让我走吗？"她微笑着问。',
    emotion: 'shocking',
    year: '时间裂缝',
    isHidden: true
  },
  {
    id: 'hm2',
    triggerCraftId: 'promise_ring',
    title: '七年前的答案',
    content: '你单膝跪地，将承诺之戒举到她面前。"这一次，不是易拉罐拉环了。"她泪流满面，却笑得那么甜。"你知道吗，七年前的那天，我在包里放了一整天，连睡觉都攥着它。"她伸出手，"我等这个答案，等了七年。"戒指戴在她无名指上的那一刻，雾气奇迹般地散开了。',
    emotion: 'romantic',
    year: '第七个夏天',
    isHidden: true
  },
  {
    id: 'hm3',
    triggerCraftId: 'memory_book',
    title: '最后一页',
    content: '你翻开回忆之书的最后一页，那是她的字迹，却从未被你见过。"亲爱的狐狸：当你看到这一页的时候，我应该已经在去机场的路上了。但我想告诉你——我买了两张票，一张是我的，一张是你的。我在车站等了一个小时，你没有来。我不怪你，我只是想让你知道，我从来没有怪过你。永远爱你的，玫瑰花。"书的夹层里，是一张五年前被退回的机票。',
    emotion: 'regret',
    year: '未寄出的告白',
    isHidden: true
  },
  {
    id: 'hm4',
    triggerCraftId: 'summer_locket',
    title: '那年夏天的秘密',
    content: '打开相片盒的瞬间，一阵凉爽的夏风扑面而来。"其实那天，我许的愿望和你一样。"她的声音在耳边响起。你转过头，看到十七岁的她站在梧桐树下，笑容和照片里一模一样。"我每年生日都许同一个愿望，"她说，"希望你能先说那句——我喜欢你。"照片里的两个人手牵着手，越走越远，消失在夏日的阳光中。',
    emotion: 'sweet',
    year: '重回盛夏',
    isHidden: true
  },
  {
    id: 'hm5',
    triggerCraftId: 'eternal_bouquet',
    title: '老树的秘密',
    content: '你把永恒花束放在老树下，刻着两颗心的地方开始发光。"你知道吗，树真的会长大的。"她的手从后面环住你的腰。"我们的爱情也是。"转过头，她就在你身后，和七年前一样年轻。"我每年都回来看这棵树，"她说，"每年都在两颗心旁边，再刻一个新的年份。"你仔细看，才发现那两颗心旁边，整整齐齐刻着六个年份——一年不差。',
    emotion: 'touched',
    year: '树的年轮',
    isHidden: true
  },
  {
    id: 'hm6',
    triggerCraftId: 'lake_message',
    title: '漂流瓶的回信',
    content: '展开湖水信笺，背面居然还有字——是她后来写的。"五年了，我回来了。瓶子居然还在，这一定是命运吧。如果你也看到了这张纸条，就来湖畔的老地方。我会一直等，等到你来为止。"信的末尾是一个日期，就是今天。你抬起头，雾气缭绕的湖畔，有一个身影正在向你挥手——是她。',
    emotion: 'determined',
    year: '命运的回响',
    isHidden: true
  }
]

export const specialEndings = [
  {
    id: 'se_true_reunion',
    requiredCrafts: ['time_key', 'promise_ring'],
    requiredChapter: 5,
    type: 'legendary',
    title: '时光尽头的重逢',
    description: '当承诺之戒戴上她无名指的那一刻，时光钥匙散发出耀眼的光芒。五年的迷雾在瞬间消散，火车站、老街、咖啡馆、公园、书店、湖畔——所有你走过的地方，都开满了紫色的薰衣草。她紧紧握着你的手："这一次，我们再也不分开了。"时间在这一刻停下，定格成永恒的拥抱。原来命运从不残忍，它只是想让你们更懂珍惜。',
    image: 'legendary'
  },
  {
    id: 'se_complete_memory',
    requiredCrafts: ['memory_book', 'summer_locket', 'eternal_bouquet', 'lake_message'],
    requiredChapter: 5,
    type: 'epic',
    title: '补全的记忆拼图',
    description: '四件合成之物在空中悬浮，散发出四种不同颜色的光芒，编织成一幅完整的画卷——从第一次约会的薰衣草，到盛夏的冰淇淋，到老树的誓言，再到湖畔的诺言。所有碎片终于拼成了完整的她。"你真的找回了所有的回忆..."她的眼眶泛红，"那么，这次换我来问你——你愿意，和我重新开始吗？"',
    image: 'epic'
  },
  {
    id: 'se_second_chance',
    requiredCrafts: ['lake_message'],
    requiredChapter: 4,
    type: 'special',
    title: '命运的第二次机会',
    description: '你奔跑在雾气弥漫的湖畔，那个身影越来越近。五年的思念、遗憾、等待，都化作最后百米的冲刺。"我来了。"你气喘吁吁地说。她笑着，泪水从脸颊滑落："我知道你会来的。"湖水荡漾，映出两个并肩的身影。这一次，谁也没有先放手。有些约定，迟到五年，依然算数。',
    image: 'special'
  }
]

export const keyChoices = [
  {
    id: 'kc_leave',
    chapter: 2,
    triggerItemId: 'letter',
    title: '关于那封未寄出的信',
    description: '你握着这封写满思念的信，五年了，你终于有勇气面对它。你要怎么做？',
    options: [
      {
        id: 'kc_leave_send',
        label: '📮 把信寄出去',
        resultText: '你走到邮局，把信投入了邮筒。五年来的沉重，在这一刻终于放下了。也许，她会收到的。',
        effects: { mood: 8, endingWeight: { sincere: 2, courage: 1 } }
      },
      {
        id: 'kc_leave_keep',
        label: '📦 继续珍藏这封信',
        resultText: '你把信小心翼翼地收进了口袋。有些话，也许永远不必说出口。珍藏本身，就是一种答案。',
        effects: { mood: 3, endingWeight: { nostalgic: 2, reserved: 1 } }
      },
      {
        id: 'kc_leave_burn',
        label: '🔥 让过去随风而逝',
        resultText: '你点燃了信，看着它在火光中化作灰烬。五年的等待，也随烟消散。是时候，向前看了。',
        effects: { mood: -5, endingWeight: { lettingGo: 2, decisive: 1 } }
      }
    ]
  },
  {
    id: 'kc_ring',
    chapter: 3,
    triggerItemId: 'ring',
    title: '关于那个玩笑般的承诺',
    description: '你握着这枚易拉罐拉环，七年前的玩笑还历历在目。如果是现在，你会怎么做？',
    options: [
      {
        id: 'kc_ring_serious',
        label: '💎 这次是认真的',
        resultText: '你紧紧攥着拉环，在心里默念：这一次，我不会再开玩笑了。我要用真正的戒指，补上这个迟到了七年的承诺。',
        effects: { mood: 10, endingWeight: { sincere: 3, romantic: 2 } }
      },
      {
        id: 'kc_ring_regret',
        label: '😔 如果当时更认真一点...',
        resultText: '你苦笑着摇摇头。七年前太年轻，以为玩笑就是浪漫。现在才明白，有些承诺，不能以玩笑的方式说出口。',
        effects: { mood: -3, endingWeight: { regretful: 2, mature: 1 } }
      },
      {
        id: 'kc_ring_hope',
        label: '✨ 还有机会的',
        resultText: '你把拉环收好。七年了，这枚拉环还在，你们的故事，也一定还没有结束。',
        effects: { mood: 6, endingWeight: { hopeful: 2, romantic: 1 } }
      }
    ]
  },
  {
    id: 'kc_promise',
    chapter: 4,
    triggerItemId: 'promise',
    title: '关于永恒的诺言',
    description: '湖边的夜风拂过，你握着这颗代表永恒的小石子。五年前的诺言，你还记得多少？',
    options: [
      {
        id: 'kc_promise_keep',
        label: '💪 我一直记得，从未忘记',
        resultText: '你把石子贴近心口。五年的分离没有让你忘记，反而让这份诺言在心中越来越清晰。',
        effects: { mood: 12, endingWeight: { loyal: 3, sincere: 2 } }
      },
      {
        id: 'kc_promise_doubt',
        label: '🤔 我...不确定了',
        resultText: '五年太长，长到你开始怀疑，那些年少时的诺言，是否还作数。但你握着石子的手，却始终没有松开。',
        effects: { mood: -2, endingWeight: { honest: 2, human: 1 } }
      },
      {
        id: 'kc_promise_renew',
        label: '🌟 让我重新许下这个诺言',
        resultText: '你对着湖面，轻声说："我愿意重新许下这个诺言。不是对过去的你，而是对现在的你——不管你变成什么样子。"',
        effects: { mood: 9, endingWeight: { mature: 2, romantic: 2 } }
      }
    ]
  },
  {
    id: 'kc_final',
    chapter: 5,
    triggerScene: 'lake',
    title: '最后的抉择',
    description: '雾气散去，你看到她就站在湖畔。五年了，你终于再次见到了她。此刻，你的第一反应是？',
    options: [
      {
        id: 'kc_final_run',
        label: '🏃 冲上去紧紧抱住她',
        resultText: '你什么都没说，只是用尽全身力气奔向她，把她紧紧拥入怀中。五年的等待、思念、遗憾，都化作了这一刻的拥抱。她在你怀里，轻声说："你终于来了。"',
        effects: { mood: 15, endingWeight: { passionate: 3, sincere: 2 } },
        requiredEndingWeights: { loyal: 1 }
      },
      {
        id: 'kc_final_smile',
        label: '😊 微笑着说"好久不见"',
        resultText: '你站在原地，嘴角微微上扬，轻声说："好久不见。"她也笑了，泪水却从脸颊滑落："好久不见。"',
        effects: { mood: 10, endingWeight: { mature: 3, gentle: 2 } }
      },
      {
        id: 'kc_final_apologize',
        label: '🙇 先说"对不起，我来晚了"',
        resultText: '你深深鞠了一躬："对不起，我来晚了。五年了，让你一个人等了这么久。"她走过来，轻轻抬起你的头："没关系，你来了就好。"',
        effects: { mood: 12, endingWeight: { sincere: 3, humble: 2 } }
      },
      {
        id: 'kc_final_watch',
        label: '👀 远远看着，不确定是不是她',
        resultText: '你站在原地，不敢上前。五年了，你害怕这只是雾气中的幻影，害怕一靠近就会消散。她转过头，看到了你，笑了："傻瓜，还要我走过来吗？"',
        effects: { mood: 4, endingWeight: { cautious: 2, human: 1 } }
      }
    ]
  }
]

export const hiddenItems = [
  {
    id: 'hi_locked_diary_page',
    name: '被锁住的日记页',
    description: '日记本中被小心折起的一页，上面写着她从未示人的秘密。',
    icon: '🔐',
    rarity: 'epic',
    unlockCondition: '在夜晚的书店找到日记本后，反复查看三次',
    associatedHiddenMemory: 'hm3'
  },
  {
    id: 'hi_photo_back',
    name: '照片背后的字',
    description: '翻到合照背面，用铅笔轻轻写着："和你在一起的每一天，都是最好的夏天。——你的玫瑰花"',
    icon: '📝',
    rarity: 'rare',
    unlockCondition: '在黄昏的老街找到合照后，翻转查看',
    associatedHiddenMemory: 'm4'
  },
  {
    id: 'hi_ticket_stub',
    name: '回程票根',
    description: '旧车票的夹层里，藏着一张五年前的回程票。她买了两张票，一张去的，一张回的。',
    icon: '🎟️',
    rarity: 'rare',
    unlockCondition: '在黎明的火车站找到旧车票后，仔细查看',
    associatedHiddenMemory: 'm1'
  },
  {
    id: 'hi_tree_initial',
    name: '树心的刻字',
    description: '两颗心的中间，还有一行极小的字："F & Y Forever"，是你们名字的首字母。',
    icon: '❤️',
    rarity: 'epic',
    unlockCondition: '在黄昏的公园找到木刻后，近距离观察',
    associatedHiddenMemory: 'm12'
  },
  {
    id: 'hi_bottle_second',
    name: '漂流瓶中的第二张纸条',
    description: '你没有注意到，瓶子里还有第二张卷得更紧的纸条，上面只有一句话："我会一直等你，到世界的尽头。"',
    icon: '🗒️',
    rarity: 'legendary',
    unlockCondition: '在夜晚的湖畔找到漂流瓶后，仔细翻找',
    associatedHiddenMemory: 'm16'
  }
]

export const reunionEndings = [
  {
    id: 're_true_love',
    type: 'legendary',
    title: '时光尽头的真爱',
    subtitle: '✦ 传说级结局 · 完美重逢 ✦',
    score: 1000,
    requirements: {
      findEfficiency: 'excellent',
      memoryCompleteness: 'excellent',
      keyChoices: ['kc_leave_send', 'kc_ring_serious', 'kc_promise_keep', 'kc_final_run'],
      hiddenItems: 3,
      craftedItems: ['time_key', 'promise_ring'],
      moodMin: 80
    },
    description: '当承诺之戒戴上她无名指的那一刻，时光钥匙散发出耀眼的光芒。你终于说出了那句迟到了五年的话——"我爱你，从未改变。"\n\n她泪流满面，却笑得像个少女："我知道。我一直都知道。"\n\n五年的迷雾在瞬间消散，火车站、老街、咖啡馆、公园、书店、湖畔——所有你走过的地方，都开满了紫色的薰衣草。你们紧紧相拥，时间在这一刻停下，定格成永恒。\n\n原来命运从不残忍，它只是想让你们更懂珍惜。\n\n——时光会证明一切，而真爱，永不褪色。',
    scene: {
      background: 'linear-gradient(180deg, #1a0a00 0%, #3d2000 30%, #ff8c00 70%, #ffd700 100%)',
      particles: 'lavender',
      effects: ['timeStop', 'lightBurst'],
      musicLayer: 'legendary'
    }
  },
  {
    id: 're_complete_puzzle',
    type: 'epic',
    title: '补全的记忆拼图',
    subtitle: '✧ 史诗级结局 · 完整回忆 ✧',
    score: 850,
    requirements: {
      findEfficiency: 'good',
      memoryCompleteness: 'excellent',
      keyChoices: ['kc_leave_keep', 'kc_ring_hope', 'kc_promise_renew'],
      hiddenItems: 2,
      craftedItems: ['memory_book', 'summer_locket'],
      moodMin: 65
    },
    description: '四件合成之物在空中悬浮，散发出四种不同颜色的光芒，编织成一幅完整的画卷——从第一次约会的薰衣草，到盛夏的冰淇淋，到老树的誓言，再到湖畔的诺言。\n\n所有碎片终于拼成了完整的她，也拼成了完整的你。\n\n"你真的找回了所有的回忆..."她的眼眶泛红，"那么，这次换我来问你——你愿意，和我重新开始吗？"\n\n你没有说话，只是牵起了她的手。\n\n——有些故事，写好了开头，就一定会有结局。',
    scene: {
      background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1f4d 30%, #6b448a 70%, #a78bfa 100%)',
      particles: 'stars',
      effects: ['puzzlePieces', 'rainbow'],
      musicLayer: 'epic'
    }
  },
  {
    id: 're_fate_second_chance',
    type: 'special',
    title: '命运的第二次机会',
    subtitle: '✦ 特殊结局 · 命运回响 ✦',
    score: 700,
    requirements: {
      findEfficiency: 'normal',
      memoryCompleteness: 'good',
      keyChoices: ['kc_final_smile'],
      hiddenItems: 1,
      craftedItems: ['lake_message'],
      moodMin: 50
    },
    description: '你奔跑在雾气弥漫的湖畔，那个身影越来越近。五年的思念、遗憾、等待，都化作最后百米的冲刺。\n\n"好久不见。"你微笑着说，声音有些颤抖。\n\n她也笑了，泪水从脸颊滑落："好久不见。我知道你会来的。"\n\n湖水荡漾，映出两个并肩的身影。这一次，谁也没有先放手。\n\n——有些约定，迟到五年，依然算数。',
    scene: {
      background: 'linear-gradient(180deg, #0a1a2e 0%, #1f3d4d 30%, #2a5a6b 70%, #38bdf8 100%)',
      particles: 'water',
      effects: ['ripple', 'softGlow'],
      musicLayer: 'special'
    }
  },
  {
    id: 're_sincere_apology',
    type: 'special',
    title: '迟到的告白',
    subtitle: '✦ 特殊结局 · 真诚之心 ✦',
    score: 680,
    requirements: {
      findEfficiency: 'good',
      memoryCompleteness: 'normal',
      keyChoices: ['kc_final_apologize'],
      hiddenItems: 1,
      craftedItems: ['time_key'],
      moodMin: 55
    },
    description: '你深深鞠了一躬："对不起，我来晚了。五年了，让你一个人等了这么久。"\n\n她走过来，轻轻抬起你的头，用拇指拭去你眼角的泪："没关系，你来了就好。"\n\n"还有一句话，"你鼓起勇气，"五年前没说出口的——我喜欢你。从八年前的那个清晨开始，一直都是。"\n\n她踮起脚尖，在你额头上轻轻一吻："我也是。一直都是。"\n\n——有些话，虽然迟到，但从不会太晚。',
    scene: {
      background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d5a 30%, #4a4a8a 70%, #818cf8 100%)',
      particles: 'petals',
      effects: ['heartRise', 'gentleLight'],
      musicLayer: 'special'
    }
  },
  {
    id: 're_nostalgic_reunion',
    type: 'perfect',
    title: '旧时光里的重逢',
    subtitle: '完美结局 · 岁月安好',
    score: 600,
    requirements: {
      findEfficiency: 'normal',
      memoryCompleteness: 'excellent',
      keyChoices: ['kc_leave_keep'],
      hiddenItems: 1,
      moodMin: 60
    },
    description: '雾气散去，阳光透过梧桐树叶洒在你们身上。她就站在你们第一次约会的街角，和八年前一模一样。\n\n"你还记得这里？"她问。\n\n"怎么可能忘记。"你笑着回答，从口袋里掏出那封珍藏了五年的信，"这个，我想亲手交给你。"\n\n她接过信，指尖轻轻摩挲着信封："我也有东西给你。"她递过来一封信，同样的泛黄，同样的珍藏了五年。\n\n阳光正好，微风不燥。你们并肩坐在街角的长椅上，一起读着对方五年来的心事。\n\n——有些时光，从未远去。',
    scene: {
      background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 30%, #4a6741 70%, #87ceeb 100%)',
      particles: 'leaves',
      effects: ['sunbeam', 'softWarmth'],
      musicLayer: 'perfect'
    }
  },
  {
    id: 're_letting_go',
    type: 'good',
    title: '释然的告别与新生',
    subtitle: '良好结局 · 各自安好',
    score: 500,
    requirements: {
      findEfficiency: 'good',
      memoryCompleteness: 'poor',
      keyChoices: ['kc_leave_burn'],
      moodMin: 35
    },
    description: '你看着最后一缕雾气散去，也看到了她。五年了，她还是那么美，但你心中却出奇地平静。\n\n"你来了。"她说。\n\n"嗯。"你点点头，"我来...是想好好说声再见。"\n\n她愣了一下，然后笑了，笑得很释然："好啊。那...再见。"\n\n"再见。"你也笑了。\n\n你们朝相反的方向走去，没有回头。但你知道，这一次，你们都真正放下了。\n\n你抬头看看天，阳光正好。\n\n——有些故事，不需要结局。有些人，不需要重逢。放下，也是一种圆满。',
    scene: {
      background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d4d 30%, #4a4a6a 70%, #87ceeb 100%)',
      particles: 'ashes',
      effects: ['clearingFog', 'newDay'],
      musicLayer: 'good'
    }
  },
  {
    id: 're_warm_encounter',
    type: 'good',
    title: '温暖的邂逅',
    subtitle: '良好结局 · 重新认识',
    score: 480,
    requirements: {
      findEfficiency: 'poor',
      memoryCompleteness: 'good',
      keyChoices: ['kc_final_watch'],
      hiddenItems: 0,
      moodMin: 45
    },
    description: '你站在原地，不敢上前。五年了，你害怕这只是雾气中的幻影。\n\n她转过头，看到了你，笑了："傻瓜，还要我走过来吗？"\n\n她一步步走向你，你的心跳越来越快。她在你面前停下，歪着头看你："怎么，不认识我了？"\n\n"认识，"你深吸一口气，"只是...五年了，我需要一点时间确认这不是梦。"\n\n她轻轻掐了一下你的胳膊："疼吗？"\n\n"疼。"\n\n"那就不是梦。"她笑了，"你好，重新认识一下。我叫...算了，你应该还记得。"\n\n你也笑了："当然记得。你好，好久不见。"\n\n——有时候，最浪漫的重逢，是像第一次遇见那样，重新认识彼此。',
    scene: {
      background: 'linear-gradient(180deg, #3d2914 0%, #5d4e37 30%, #8b7355 70%, #ffd7a0 100%)',
      particles: 'sparkle',
      effects: ['cafeWarmth', 'softGlow'],
      musicLayer: 'good'
    }
  },
  {
    id: 're_regretful_meeting',
    type: 'normal',
    title: '雾中的遗憾',
    subtitle: '普通结局 · 错过的时光',
    score: 350,
    requirements: {
      findEfficiency: 'normal',
      memoryCompleteness: 'poor',
      keyChoices: ['kc_ring_regret', 'kc_promise_doubt'],
      hiddenItems: 0,
      moodMin: 20
    },
    description: '雾气散去了一些，你看到了她的轮廓。但她身边，好像还有另一个人。\n\n你停下了脚步。\n\n她也看到了你，愣了一下，然后走过来："好久不见。"\n\n"好久不见。"你努力挤出一个微笑，"这是...？"\n\n"一个朋友。"她简单介绍，没有多说。\n\n你们寒暄了几句，都是些无关紧要的话。五年来你在心里演练了无数次的重逢场景，没有一次是这样的。\n\n告别之后，你一个人走在老街。梧桐叶落在你肩上，你没有拍掉。\n\n——有些错过，就是一辈子。但至少，你看到她过得很好。',
    scene: {
      background: 'linear-gradient(180deg, #1a1a2e 0%, #2a2a3e 30%, #3a3a4e 70%, #5a5a6a 100%)',
      particles: 'mist',
      effects: ['lingeringFog', 'grayTone'],
      musicLayer: 'normal'
    }
  },
  {
    id: 're_honest_start',
    type: 'normal',
    title: '诚实的开始',
    subtitle: '普通结局 · 坦诚相见',
    score: 380,
    requirements: {
      findEfficiency: 'poor',
      memoryCompleteness: 'normal',
      keyChoices: ['kc_promise_doubt', 'kc_final_watch'],
      hiddenItems: 0,
      moodMin: 25
    },
    description: '"五年了，我不确定我还记得你的喜好，不确定我们还能不能像以前那样，"你诚实地说，"但我想试一试。"\n\n她看着你，眼中有惊讶，也有欣慰："谢谢你的诚实。其实...我也不确定。五年可以改变很多事情。"\n\n"那...我们重新开始？不是回到过去，而是从现在开始，认识全新的彼此？"\n\n她伸出手："你好，很高兴认识你。"\n\n你握住她的手，这一次，没有颤抖："你好，我也是。"\n\n雾气正在慢慢散去，前方的路虽然不清晰，但你们终于并肩站在了一起。\n\n——诚实，是一切新开始的基石。',
    scene: {
      background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d4a 30%, #4a4a6a 70%, #88aacc 100%)',
      particles: 'mist',
      effects: ['clearingSlow', 'dawnLight'],
      musicLayer: 'normal'
    }
  },
  {
    id: 're_fog_missing',
    type: 'bad',
    title: '雾中迷失',
    subtitle: '遗憾结局 · 擦肩而过',
    score: 200,
    requirements: {
      findEfficiency: 'poor',
      memoryCompleteness: 'poor',
      moodMin: 10
    },
    description: '雾气越来越浓，你几乎看不清前方的路。你好像看到了一个熟悉的身影，但当你揉揉眼睛，那身影又消失在了雾中。\n\n你在湖畔站了很久，直到天色完全暗下来。\n\n也许，她没有来。也许，你错过了。也许，你们的故事，五年前就已经结束了。\n\n你拖着疲惫的脚步，转身离开。身后的雾气中，有一个身影静静地看着你离去，手中握着那封你寄出去的信。\n\n——有些缘分，经不起等待。',
    scene: {
      background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 30%, #2d2d3d 70%, #3a3a4a 100%)',
      particles: 'denseFog',
      effects: ['thickFog', 'darkness'],
      musicLayer: 'bad'
    }
  },
  {
    id: 're_despair_lost',
    type: 'despair',
    title: '心之迷雾',
    subtitle: '绝望结局 · 永远的等待',
    score: 100,
    requirements: {
      findEfficiency: 'poor',
      memoryCompleteness: 'poor',
      moodMin: 0
    },
    description: '雾气笼罩了整座城市，也笼罩了你的心。\n\n你找到了一些回忆的碎片，但更多的，还是失落。你错过了关键的时间，错过了重要的线索，也错过了...她。\n\n你坐在空荡荡的火车站，手中只有那枚停下来的怀表，指针永远停在8点23分。\n\n五年了，你还是没能走出这座雾城。\n\n也许，你会一直等下去。等到雾气散去，等到她回来，等到时间重新开始流动。\n\n——有些人，注定等待。有些结局，注定没有答案。',
    scene: {
      background: 'linear-gradient(180deg, #0a0505 0%, #1a0a0a 30%, #2d1515 70%, #3d1a1a 100%)',
      particles: 'sorrow',
      effects: ['totalDarkness', 'frozenTime'],
      musicLayer: 'despair'
    }
  }
]

export const endingWeightLabels = {
  sincere: '真诚',
  courage: '勇气',
  nostalgic: '怀旧',
  reserved: '内敛',
  lettingGo: '释然',
  decisive: '果断',
  romantic: '浪漫',
  regretful: '遗憾',
  mature: '成熟',
  hopeful: '希冀',
  loyal: '忠诚',
  honest: '诚实',
  human: '人性',
  passionate: '热烈',
  gentle: '温柔',
  humble: '谦逊',
  cautious: '谨慎'
}

export const chapters = [
  {
    id: 1,
    name: '序章·归乡',
    requiredMemoryPercent: 0,
    unlockNarration: '五年了。你终于回到了这座城市。雾气依旧，熟悉又陌生。火车站的钟声响起，仿佛在提醒你——有些东西，从未真正离开。',
    chapterNarration: '【第一章 · 归乡的站台】\n\n火车缓缓驶入雾城车站。你提着行李箱走下车，熟悉的雾气扑面而来。五年前，你就是在这里与她分别的。\n\n站台空荡荡的，只有你一个人。但你总觉得，她的身影就在雾气的深处，若隐若现。\n\n"先从这里开始吧。"你对自己说。',
    unlockedScenes: ['station'],
    atmosphere: {
      fogMultiplier: 1.2,
      brightness: 0.8,
      saturation: 0.7,
      backgroundTint: 'rgba(20, 20, 50, 0.3)'
    },
    sceneDescriptions: {
      station: '五年前，你就是在这里与她分别。雾气比记忆中更浓，几乎看不清站台的尽头...'
    }
  },
  {
    id: 2,
    name: '第一章·初遇的痕迹',
    requiredMemoryPercent: 15,
    unlockNarration: '你找到了第一件旧物，回忆的大门缓缓打开。那些被尘封的往事，开始一点点浮现。雾城的其他角落，似乎也在向你招手。',
    chapterNarration: '【第二章 · 初遇的街角】\n\n旧车票上的日期依然清晰。你握着那张泛黄的纸片，眼眶有些发热。\n\n"如果那天我开口挽留..."这个念头无数次在脑海中浮现。但你知道，时光无法倒流。\n\n至少，你还可以寻找。寻找那些遗落在这座城市里的，属于你们的痕迹。\n\n雾气似乎淡了一些。你看到了通往老街的路。',
    unlockedScenes: ['station', 'street', 'cafe'],
    atmosphere: {
      fogMultiplier: 1.0,
      brightness: 0.9,
      saturation: 0.8,
      backgroundTint: 'rgba(30, 30, 60, 0.2)'
    },
    sceneDescriptions: {
      station: '雾气比刚来时淡了一些，你能隐约看到站台的出口了。',
      street: '熟悉的街道，两旁的梧桐树还是老样子。雾气中，仿佛能听到曾经的笑声...',
      cafe: '你们第一次约会的地方。靠窗的位置，还留着她最喜欢的拿铁香味...'
    }
  },
  {
    id: 3,
    name: '第二章·盛夏的记忆',
    requiredMemoryPercent: 35,
    unlockNarration: '越来越多的回忆被唤醒。你仿佛看到了年少的你们，在这座城市的各个角落留下足迹。盛夏的阳光，似乎能穿透这层层迷雾。',
    chapterNarration: '【第三章 · 盛夏的公园】\n\n你找到了那张被雨水打湿的合照。照片上的你们笑得那么灿烂，仿佛永远不会有烦恼。\n\n那是你们在一起的第三个夏天。你记得那天的阳光很暖，风很轻，她的笑容比阳光还要耀眼。\n\n"我们要永远这样开心。"她当时这么说。\n\n你握紧了照片。现在，你只想找到更多。\n\n雾气又淡了一些。你看到了通往公园和书店的路。',
    unlockedScenes: ['station', 'street', 'cafe', 'park', 'bookstore'],
    atmosphere: {
      fogMultiplier: 0.8,
      brightness: 1.0,
      saturation: 0.9,
      backgroundTint: 'rgba(255, 150, 100, 0.1)'
    },
    sceneDescriptions: {
      station: '雾气渐渐散去，你甚至能看到几年前你们刻在长椅上的名字。',
      street: '熟悉的街道，两旁的梧桐树还是老样子。雾气中，仿佛能听到曾经的笑声...',
      cafe: '你们第一次约会的地方。靠窗的位置，还留着她最喜欢的拿铁香味...',
      park: '傍晚时分的公园，夕阳穿过雾气，洒下金色的光芒。那座长椅上，刻着你们的名字...',
      bookstore: '她最爱来的书店，书架间似乎还能看到她专注读书的身影...'
    }
  },
  {
    id: 4,
    name: '第三章·永恒的诺言',
    requiredMemoryPercent: 60,
    unlockNarration: '大部分的回忆已经找回。你开始明白，有些东西从未改变。雾气笼罩的湖畔，是你们许下诺言的地方。也许，答案就在那里。',
    chapterNarration: '【第四章 · 雾霭湖畔】\n\n你翻开了她的日记本，看到了最后那句话："如果我开口挽留，你会留下吗？"\n\n心脏像是被什么东西紧紧攥住。原来，她也在等。\n\n五年前的那个下午，你们都在等对方先开口。然后，就错过了。\n\n但现在还不晚。你知道她在哪里——那个你们许下永恒诺言的地方。\n\n雾气几乎散尽了。通往湖畔的路，清晰可见。',
    unlockedScenes: ['station', 'street', 'cafe', 'park', 'bookstore', 'lake'],
    atmosphere: {
      fogMultiplier: 0.5,
      brightness: 1.1,
      saturation: 1.0,
      backgroundTint: 'rgba(100, 150, 200, 0.1)'
    },
    sceneDescriptions: {
      station: '阳光透过雾气洒落，整个站台都笼罩在一层金色的光晕中。',
      street: '熟悉的街道，两旁的梧桐树还是老样子。雾气中，仿佛能听到曾经的笑声...',
      cafe: '你们第一次约会的地方。靠窗的位置，还留着她最喜欢的拿铁香味...',
      park: '傍晚时分的公园，夕阳穿过雾气，洒下金色的光芒。那座长椅上，刻着你们的名字...',
      bookstore: '她最爱来的书店，书架间似乎还能看到她专注读书的身影...',
      lake: '湖面上的雾气正在渐渐散去。五年前的夏天，你们曾在这里许下诺言...'
    }
  },
  {
    id: 5,
    name: '终章·重逢',
    requiredMemoryPercent: 85,
    unlockNarration: '所有的回忆碎片都已归位。你终于明白了她的心意，也明白了自己的心意。雾气即将完全散去，命运的重逢，就在眼前。',
    chapterNarration: '【终章 · 雾散之时】\n\n你站在湖畔，看着最后一缕雾气消散在阳光中。\n\n所有的回忆都已找回。从初遇的薰衣草，到盛夏的冰淇淋，从老树的誓言，到湖畔的诺言——每一片碎片，都拼成了完整的她。\n\n你终于懂了。五年前的错过，是因为你们都太骄傲，都在等对方先开口。\n\n但这一次，你不会再等了。\n\n你抬起头，看到湖畔的那个身影。她穿着白色的连衣裙，和五年前一模一样。\n\n她也看到了你，微微一笑，泪光闪烁。\n\n"你来了。"她说。\n\n"我来了。"你回答。',
    unlockedScenes: ['station', 'street', 'cafe', 'park', 'bookstore', 'lake'],
    atmosphere: {
      fogMultiplier: 0.1,
      brightness: 1.3,
      saturation: 1.2,
      backgroundTint: 'rgba(255, 220, 150, 0.15)'
    },
    sceneDescriptions: {
      station: '阳光明媚，雾气完全消散。这座火车站，见证了你们的离别，也将见证你们的重逢。',
      street: '阳光洒满老街，梧桐树叶沙沙作响，仿佛在为你们的重逢鼓掌。',
      cafe: '咖啡馆里飘来浓郁的咖啡香，靠窗的位置似乎还留着她的温度。',
      park: '金色的夕阳洒在公园的每一个角落，老树上的两颗心，在阳光下闪闪发光。',
      bookstore: '书店的风铃响起，她最喜欢的那本书，正放在最显眼的位置。',
      lake: '湖水如镜，倒映着蓝天白云。她就在那里，等着你。'
    },
    isFinalChapter: true
  }
]

export const fakeClues = [
  {
    id: 'fc1',
    sceneId: 'station',
    name: '模糊的身影',
    description: '雾气中似乎有一个身影在向你招手...',
    fakeText: '"你终于来了..."她的声音若隐若现。你快步走过去，却发现只是路灯的光影交错。雾气又浓了几分。',
    position: { x: 45, y: 35 },
    size: { width: 10, height: 15 },
    icon: '👤',
    timeCost: 5,
    moodEffect: -3,
    visiblePeriods: ['dawn', 'dusk', 'night'],
    type: 'mirage'
  },
  {
    id: 'fc2',
    sceneId: 'station',
    name: '废弃的票根',
    description: '角落里有一张皱巴巴的纸片，会是她留下的吗？',
    fakeText: '你小心翼翼地捡起那张纸片，满怀期待地展开。却只是一张过期的广告宣传单，上面写着"雾城特色小吃，买二送一"。你无奈地叹了口气。',
    position: { x: 30, y: 78 },
    size: { width: 8, height: 6 },
    icon: '📄',
    timeCost: 3,
    moodEffect: -1,
    visiblePeriods: ['dawn', 'day', 'dusk', 'night'],
    type: 'trash'
  },
  {
    id: 'fc3',
    sceneId: 'street',
    name: '熟悉的背影',
    description: '街角有个背影，和她好像...',
    fakeText: '你心跳加速，快步追上去。"等等！"那人回过头，却是一张完全陌生的脸。"你认错人了。"对方有些疑惑地看着你。你尴尬地道歉，心里一阵失落。',
    position: { x: 55, y: 30 },
    size: { width: 8, height: 18 },
    icon: '🚶',
    timeCost: 6,
    moodEffect: -5,
    visiblePeriods: ['day', 'dusk'],
    type: 'mirage'
  },
  {
    id: 'fc4',
    sceneId: 'street',
    name: '玻璃反光',
    description: '商店橱窗的反光中，似乎有她的影子...',
    fakeText: '你猛地转头，橱窗里只有你自己的倒影。你盯着倒影看了很久，发现自己的眼神里满是疲惫和思念。五年了，你变了很多。',
    position: { x: 80, y: 55 },
    size: { width: 10, height: 12 },
    icon: '🪟',
    timeCost: 2,
    moodEffect: -2,
    visiblePeriods: ['day'],
    type: 'reflection'
  },
  {
    id: 'fc5',
    sceneId: 'cafe',
    name: '空咖啡杯',
    description: '靠窗的位置上有一杯还冒着热气的咖啡...',
    fakeText: '你走过去，心跳加速。杯子旁边放着一本书——但不是她最爱的《小王子》，而是一本财经杂志。你摇摇头，是自己想多了。',
    position: { x: 50, y: 45 },
    size: { width: 8, height: 10 },
    icon: '☕',
    timeCost: 4,
    moodEffect: -3,
    visiblePeriods: ['day', 'dusk'],
    type: 'almost'
  },
  {
    id: 'fc6',
    sceneId: 'park',
    name: '飞舞的花瓣',
    description: '花瓣在风中旋转，像是有人在...',
    fakeText: '你追着花瓣跑了一会儿，它们却被风吹向了远方。你站在原地，看着花瓣消失在雾气中。那年夏天，你们也曾这样追着蝴蝶跑。',
    position: { x: 40, y: 40 },
    size: { width: 12, height: 12 },
    icon: '🌸',
    timeCost: 3,
    moodEffect: -2,
    visiblePeriods: ['dawn', 'day'],
    type: 'memory'
  },
  {
    id: 'fc7',
    sceneId: 'park',
    name: '长椅上的人影',
    description: '那座刻着你们名字的长椅上，似乎坐着一个人...',
    fakeText: '你屏住呼吸，慢慢走近。风吹散了一些雾气，你看清了——那只是一个背包，放在长椅上。旁边的老爷爷正在喂鸽子。"小伙子，你找人吗？"老爷爷慈祥地问。你摇摇头，笑了笑。',
    position: { x: 65, y: 60 },
    size: { width: 10, height: 12 },
    icon: '🪑',
    timeCost: 5,
    moodEffect: -4,
    visiblePeriods: ['dusk', 'night'],
    type: 'mirage'
  },
  {
    id: 'fc8',
    sceneId: 'bookstore',
    name: '翻阅的书本',
    description: '书架间有一本书自己翻开了...',
    fakeText: '你好奇地走过去，原来是窗户没关，风吹动了书页。你正要把窗户关上，却注意到那本书——《雾都孤儿》。你自嘲地笑了笑，她才不会看这种书。',
    position: { x: 50, y: 50 },
    size: { width: 10, height: 14 },
    icon: '📖',
    timeCost: 3,
    moodEffect: -2,
    visiblePeriods: ['dusk', 'night'],
    type: 'wind'
  },
  {
    id: 'fc9',
    sceneId: 'bookstore',
    name: '熟悉的香水味',
    description: '空气中飘着一丝淡淡的薰衣草香...',
    fakeText: '你循着香味找过去，却发现是书架上的香薰蜡烛在燃烧。"先生，要买一个吗？薰衣草味的，很受欢迎。"店员热情地介绍。你拿起蜡烛看了看，又放了回去。不是这个味道。',
    position: { x: 25, y: 35 },
    size: { width: 8, height: 10 },
    icon: '🕯️',
    timeCost: 4,
    moodEffect: -3,
    visiblePeriods: ['day', 'dusk', 'night'],
    type: 'scent'
  },
  {
    id: 'fc10',
    sceneId: 'lake',
    name: '湖中的倒影',
    description: '湖面上倒映着一个身影...是她吗？',
    fakeText: '你猛地抬头，岸边空无一人。再看向湖面，倒影也消失了。你蹲下来，看着自己的倒影。"是我太想你了吗？"你轻声问自己。湖面上雾气缭绕，没有回答。',
    position: { x: 45, y: 65 },
    size: { width: 12, height: 10 },
    icon: '🌊',
    timeCost: 4,
    moodEffect: -4,
    visiblePeriods: ['dusk', 'night'],
    type: 'mirage'
  },
  {
    id: 'fc11',
    sceneId: 'lake',
    name: '远处的灯笼',
    description: '雾气深处有一点微光，像是有人提着灯笼...',
    fakeText: '你朝着光点走了很久，却发现那只是湖边的太阳能路灯。你站在路灯下，四周都是雾气，分不清方向。你花了好一会儿才找到回去的路。',
    position: { x: 85, y: 45 },
    size: { width: 6, height: 15 },
    icon: '🏮',
    timeCost: 7,
    moodEffect: -5,
    visiblePeriods: ['night'],
    type: 'lost'
  }
]

export const fogHiddenItems = [
  {
    itemId: 'notebook',
    sceneId: 'cafe',
    unlockType: 'items',
    requiredItems: ['cup', 'ring'],
    hint: '有些东西，需要先找到其他线索才会显现...',
    fogDensity: 0.8
  },
  {
    itemId: 'letter',
    sceneId: 'street',
    unlockType: 'items',
    requiredItems: ['photo'],
    hint: '有些话，需要勇气才能看见...',
    fogDensity: 0.7
  },
  {
    itemId: 'glasses',
    sceneId: 'bookstore',
    unlockType: 'items',
    requiredItems: ['book', 'bookmark'],
    hint: '专注的模样，藏在记忆深处...',
    fogDensity: 0.75
  },
  {
    itemId: 'promise',
    sceneId: 'lake',
    unlockType: 'items',
    requiredItems: ['bottle', 'necklace'],
    hint: '永恒的诺言，需要先找到其他碎片...',
    fogDensity: 0.85
  },
  {
    itemId: 'carving',
    sceneId: 'park',
    unlockType: 'memory',
    requiredMemoryCount: 5,
    hint: '有些印记，只有回忆足够多的时候才会浮现...',
    fogDensity: 0.7
  },
  {
    itemId: 'necklace',
    sceneId: 'lake',
    unlockType: 'time',
    requiredPeriod: 'dusk',
    requiredChapter: 3,
    hint: '海边的礼物，只在黄昏时分闪耀...',
    fogDensity: 0.6
  }
]
