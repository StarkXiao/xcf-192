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
