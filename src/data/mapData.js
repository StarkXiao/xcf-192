export const mapLocations = [
  {
    id: 'station',
    name: '雾城火车站',
    icon: '🚂',
    description: '五年前离别的地方，雾气弥漫的站台。',
    longDescription: '老旧的火车站在雾气中若隐若现。站台上的时钟永远停在8点23分，那是火车开走的时刻。候车椅上似乎还留着她的体温，空气中仿佛还能听到那句"我会等你的"。',
    position: { x: 15, y: 70 },
    unlocked: true,
    visited: false,
    fogIntensity: 0.7,
    backgroundStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    connectedTo: ['old_street', 'cafe_alley'],
    unlockCondition: null,
    timePeriod: 'all',
    memories: [
      { id: 'map_mem_1', title: '离别的鸣笛声', content: '火车的鸣笛声划破浓雾，她在车窗后向你挥手。你想追上去，脚步却像灌了铅一样沉重。', emotion: 'sad', hint: '在站台最末端寻找' }
    ],
    events: ['evt_clock_stopped'],
    clues: ['clue_ticket']
  },
  {
    id: 'old_street',
    name: '雾城老街',
    icon: '🏘️',
    description: '梧桐树下的老街，回荡着旧日的笑声。',
    longDescription: '两旁的梧桐树还是老样子，枝叶在雾气中交错成绿色的隧道。记得那年夏天，你们在这条街上奔跑，冰淇淋化在指尖，笑声飘得很远很远。现在老街依旧，只是再也没有人陪你分享同一个甜筒了。',
    position: { x: 38, y: 55 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.5,
    backgroundStyle: 'linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #4a6741 100%)',
    connectedTo: ['station', 'park', 'bookstore'],
    unlockCondition: { type: 'visit', locationId: 'station' },
    timePeriod: 'all',
    memories: [
      { id: 'map_mem_2', title: '梧桐下的奔跑', content: '"快跑！冰淇淋要化了！"她在前面笑着跑，你在后面追，阳光穿过梧桐叶的缝隙，在她脸上洒下金色的光斑。', emotion: 'happy', hint: '在梧桐树最茂密的地方驻足' }
    ],
    events: ['evt_old_photograph'],
    clues: ['clue_photo', 'clue_icecream']
  },
  {
    id: 'cafe_alley',
    name: '转角咖啡馆',
    icon: '☕',
    description: '第一次约会的地方，拿铁香还在空气中。',
    longDescription: '推开那扇吱呀作响的木门，铃铛声依旧。靠窗的位置空着，桌上似乎还留着两杯拿铁的余温。记得那天你紧张得手心都是汗，她却很自然地坐在了你对面，微笑着说"我等你很久了"。',
    position: { x: 22, y: 40 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.3,
    backgroundStyle: 'linear-gradient(180deg, #3d2914 0%, #5d4e37 50%, #8b7355 100%)',
    connectedTo: ['station', 'bookstore'],
    unlockCondition: { type: 'visit', locationId: 'station' },
    timePeriod: 'day,dusk,night',
    memories: [
      { id: 'map_mem_3', title: '杯口的口红印', content: '她喝咖啡的时候，杯口总会留下淡淡的口红印。你假装不看，却在她去洗手间的时候，偷偷把那个杯子转到自己面前。', emotion: 'warm', hint: '点一杯她最爱的拿铁' }
    ],
    events: ['evt_coffee_cup'],
    clues: ['clue_cup', 'clue_ring', 'clue_key']
  },
  {
    id: 'park',
    name: '回忆公园',
    icon: '🌳',
    description: '刻着两颗心的老树，还在原地等待。',
    longDescription: '傍晚的公园笼罩在金色的雾气中。那棵老树静静地立着，树干上的两颗心虽然有些模糊，但依然清晰可见。记得你们刻下它们的时候，她说"树会长大的"，你说"那我们的爱情也会长大"。',
    position: { x: 60, y: 40 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.4,
    backgroundStyle: 'linear-gradient(180deg, #ff7e5f 0%, #feb47b 50%, #6a82fb 100%)',
    connectedTo: ['old_street', 'lake'],
    unlockCondition: { type: 'visit', locationId: 'old_street' },
    timePeriod: 'all',
    memories: [
      { id: 'map_mem_4', title: '刻在树上的心', content: '你们蹲在树下，用小刀笨拙地刻着两颗心。她嫌你刻得丑，抢过刀子自己来，结果不小心划破了手指。你握着她的手指，心疼得不得了，她却笑得很开心。', emotion: 'bittersweet', hint: '仔细观察老树的树干' }
    ],
    events: ['evt_tree_carving'],
    clues: ['clue_flower', 'clue_balloon']
  },
  {
    id: 'bookstore',
    name: '时光书店',
    icon: '📚',
    description: '她最爱的书店，书架间藏着她的心事。',
    longDescription: '书店里还是老样子，木质地板发出熟悉的吱呀声。最里面的角落，靠窗的位置，她总爱坐在那里看书，眉头微蹙，很认真的样子。你就坐在对面，假装翻书，其实一直在看她。',
    position: { x: 50, y: 25 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.2,
    backgroundStyle: 'linear-gradient(180deg, #4a3728 0%, #6b4423 50%, #8b5a2b 100%)',
    connectedTo: ['old_street', 'cafe_alley'],
    unlockCondition: { type: 'visit', locationId: 'cafe_alley' },
    timePeriod: 'day,dusk,night',
    memories: [
      { id: 'map_mem_5', title: '小王子和狐狸', content: '"你看，小王子和狐狸是最好的朋友。"她指着书页对你说，"你就是我的狐狸。""那你是我的玫瑰花吗？"你问。她脸红了，"才不是。"', emotion: 'touched', hint: '在外国文学区找《小王子》' },
      { id: 'map_mem_5b', title: '退回的机票', content: '书的夹层里掉出一张机票——是五年前的，目的地是你的城市。机票上用红笔写着："我买了两张，一张是我的，一张是你的。我在车站等了一个小时，你没有来。"你仿佛能看到她攥着机票站在站台上的样子，眼泪一滴一滴砸在票面上。', emotion: 'heartbreak', hint: '翻开《小王子》第21页' }
    ],
    events: ['evt_book_page'],
    clues: ['clue_book', 'clue_bookmark']
  },
  {
    id: 'lake',
    name: '雾霭湖畔',
    icon: '🌊',
    description: '雾气缭绕的湖边，藏着五年前的诺言。',
    longDescription: '湖面上雾气缭绕，像是一层轻纱。五年前的夏天，你们曾在这里许下诺言。她说"你会永远爱我吗？"你说"永远"，捡起湖边的小石子递给她，"就像这颗石头，即使海枯石烂，也不会变。"',
    position: { x: 82, y: 55 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.8,
    backgroundStyle: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #1f4068 70%, #206a5d 100%)',
    connectedTo: ['park'],
    unlockCondition: { type: 'clue', clueId: 'clue_promise', count: 3 },
    timePeriod: 'dusk,night',
    memories: [
      { id: 'map_mem_6', title: '漂流瓶的愿望', content: '"我们把愿望写在纸条上，放进瓶子里，扔进湖里。十年后再回来找。"她兴奋地说。你写的是：希望十年后我们还在一起。', emotion: 'pensive', hint: '沿着湖岸慢慢走' }
    ],
    events: ['evt_drift_bottle'],
    clues: ['clue_bottle', 'clue_necklace', 'clue_promise']
  },
  {
    id: 'clock_tower',
    name: '钟楼广场',
    icon: '🕰️',
    description: '被遗忘的钟楼，指针永远指向重逢时刻。',
    longDescription: '广场中央的老钟楼已经很多年不走了，但奇怪的是，每当你靠近，指针似乎会微微颤动。传说钟楼在等待一个人，等待那个迟到了五年的约定。据说当所有线索汇聚，钟楼的钟声会再次响起。',
    position: { x: 70, y: 78 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.6,
    backgroundStyle: 'linear-gradient(180deg, #1a0a2e 0%, #2d1f4d 40%, #4a3068 100%)',
    connectedTo: ['old_street', 'lake'],
    unlockCondition: { type: 'memory', count: 4 },
    timePeriod: 'night',
    memories: [
      { id: 'map_mem_7', title: '钟楼下的告白', content: '新年倒计时，钟楼下人山人海。她踮起脚尖在你耳边说了一句话，钟声刚好响起，你没听清。后来你问她，她只是笑，说"等下一个新年再告诉你"。', emotion: 'romantic', hint: '在午夜时分来到钟楼下' }
    ],
    events: ['evt_bell_tolls'],
    clues: ['clue_watch', 'clue_final']
  },
  {
    id: 'old_house',
    name: '紫藤老屋',
    icon: '🏡',
    description: '爬满紫藤的老房子，窗台上还摆着她种的花。',
    longDescription: '院墙上爬满了紫藤，紫色的花朵在雾气中摇曳。窗台上的多肉还活着，有人一直在浇水。门口的风铃叮咚作响，仿佛在说"欢迎回家"。这里，是你们曾经一起布置的"家"。',
    position: { x: 5, y: 25 },
    unlocked: false,
    visited: false,
    fogIntensity: 0.4,
    backgroundStyle: 'linear-gradient(180deg, #2d4a3e 0%, #3d5a4e 50%, #5a7a6a 100%)',
    connectedTo: ['cafe_alley'],
    unlockCondition: { type: 'clue', clueId: 'clue_key', count: 1 },
    timePeriod: 'dusk,night',
    memories: [
      { id: 'map_mem_8', title: '紫藤花下', content: '"以后我们也要有个这样的院子。"她靠在你肩上，看着满墙的紫藤花，"种满花，养一只猫，再养一只狗。""好。"你轻声说，那时候你以为"以后"很快就会来。', emotion: 'melancholy', hint: '在紫藤架下多待一会儿' }
    ],
    events: ['evt_wind_chime'],
    clues: ['clue_notebook']
  }
]

export const mapEvents = [
  {
    id: 'evt_clock_stopped',
    locationId: 'station',
    title: '停滞的时钟',
    description: '站台上的老式挂钟，指针永远停在8点23分。你伸出手，轻轻触碰钟面——',
    choices: [
      {
        id: 'evt_clock_1',
        label: '尝试拨动指针',
        resultText: '指针纹丝不动，你却在钟的背面发现了一行小字："等待是最长情的告白。"你的心被什么东西轻轻敲了一下。',
        effects: { mood: 5, clue: 'clue_watch_hint' }
      },
      {
        id: 'evt_clock_2',
        label: '静静看着它',
        resultText: '你看着停滞的指针，五年前的画面在眼前浮现。那个清晨，雾气比现在更浓，她的身影在雾气中越来越小......你深吸一口气，把眼眶里的湿润逼回去。',
        effects: { mood: -2, memory: 'map_mem_1' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_old_photograph',
    locationId: 'old_street',
    title: '橱窗里的旧照片',
    description: '一家老照相馆的橱窗里，摆着一张褪色的照片。你凑近一看——竟然是你们！',
    choices: [
      {
        id: 'evt_photo_1',
        label: '走进照相馆询问',
        resultText: '店主是个慈祥的老人。"哦，你们啊，我记得。"他笑着说，"那年夏天，你们非要在雨中拍照，说什么"要记住这个湿漉漉的夏天"。这张照片，是她特意让我留在这里的，说万一有人来找，就给他。"老人递给你一个信封，"她说，给那个迟到了五年的傻瓜。"',
        effects: { mood: 8, clue: 'clue_photo' }
      },
      {
        id: 'evt_photo_2',
        label: '只是远远看着',
        resultText: '你站在橱窗外，看着照片上笑得没心没肺的两个人。那年夏天的雨，那年夏天的风，都在照片里定格了。只是照片里的人，现在在哪里呢？',
        effects: { mood: -3, memory: 'map_mem_2' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_coffee_cup',
    locationId: 'cafe_alley',
    title: '熟悉的位置',
    description: '靠窗的那张桌子，摆着两杯拿铁，还冒着热气。服务员走过来："那位女士说，她每天这个时候都会在这里等，如果有人来找她，就请他坐这里。"',
    choices: [
      {
        id: 'evt_cup_1',
        label: '坐下来，等她',
        resultText: '你在那个熟悉的位置坐下。咖啡已经有些凉了，但你还是端起来喝了一口。还是那个味道，五年了，一点都没变。你不知道等了多久，当你抬起头的时候——窗外，雾气中，有一个熟悉的身影正在朝这里走来。',
        effects: { mood: 12, clue: 'clue_cup', unlock: 'old_house' }
      },
      {
        id: 'evt_cup_2',
        label: '留下一张字条离开',
        resultText: '你找了纸笔，写下"我来过，我还会再来"，压在咖啡杯下面。走出咖啡馆的时候，你听到身后传来急促的脚步声，但你没有回头。你害怕一回头，就再也迈不动脚步了。',
        effects: { mood: 2, clue: 'clue_cup_hint' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_tree_carving',
    locationId: 'park',
    title: '老树的秘密',
    description: '你走到那棵刻着两颗心的老树前。七年了，树长大了，两颗心也跟着长大了一些。你注意到，两颗心的中间，似乎多了些什么。',
    choices: [
      {
        id: 'evt_tree_1',
        label: '仔细查看刻痕',
        resultText: '你凑上前，拂去树皮上的青苔——两颗心的中间，整整齐齐刻着六个年份，一年不差。最后一个年份下面，有一行新刻的小字："我每年都来。今天，是第五年。"你的手开始颤抖。她来过，她每年都来。',
        effects: { mood: 15, clue: 'clue_tree_initial' }
      },
      {
        id: 'evt_tree_2',
        label: '轻轻抚摸树干',
        resultText: '你把手贴在粗糙的树皮上，仿佛能感受到这些年来它见证的一切——春日的新芽，夏日的浓荫，秋日的落叶，冬日的雪。还有，每年都会有一个人，来到这棵树下，站很久很久。',
        effects: { mood: 4, memory: 'map_mem_4' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_book_page',
    locationId: 'bookstore',
    title: '被折起的书页',
    description: '你在老位置找到了那本《小王子》。翻开，发现第21页被折起了一个角。那一页上，"只有用心才能看得清楚"这句话下面，被人用红笔圈了起来，旁边还有一行小字。',
    choices: [
      {
        id: 'evt_book_1',
        label: '读那行小字',
        resultText: '你凑近看，字迹很熟悉——是她的字："给我的狐狸：当你看到这一页的时候，我应该已经在去机场的路上了。但我想告诉你——我买了两张票，一张是我的，一张是你的。我在车站等了一个小时，你没有来。我不怪你，我只是想让你知道，我从来没有怪过你。永远爱你的，玫瑰花。"书的夹层里，是一张五年前被退回的机票。',
        effects: { mood: -5, clue: 'clue_book', memory: 'map_mem_5b' }
      },
      {
        id: 'evt_book_2',
        label: '合上书，放回原位',
        resultText: '你把书合上，放回原来的位置。有些真相，也许还需要更多的勇气去面对。但你知道，你一定会回来的。',
        effects: { mood: 0, clue: 'clue_book_hint' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_drift_bottle',
    locationId: 'lake',
    title: '漂流瓶回来了',
    description: '湖边的芦苇丛中，有什么东西在闪闪发光。你走过去——是一只玻璃瓶，正是五年前你们扔进湖里的那只！',
    choices: [
      {
        id: 'evt_bottle_1',
        label: '打开瓶子，取出纸条',
        resultText: '你打开漂流瓶，取出里面的纸条。你的字迹还在：希望十年后我们还在一起。但纸条的背面，多了一行字——是她后来写的："五年了，我回来了。瓶子居然还在，这一定是命运吧。如果你也看到了这张纸条，就来湖畔的老地方。我会一直等，等到你来为止。"信的末尾是一个日期，就是今天。你猛然抬头——雾气中，有一个身影正站在湖畔。',
        effects: { mood: 20, clue: 'clue_bottle', ending: 'map_ending_reunion' }
      },
      {
        id: 'evt_bottle_2',
        label: '把瓶子放回水里',
        resultText: '你把瓶子轻轻放回湖里，看着它随波漂远。也许，有些愿望需要更多的时间才能实现。但你知道，你已经离真相越来越近了。',
        effects: { mood: 3, clue: 'clue_bottle_hint' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_bell_tolls',
    locationId: 'clock_tower',
    title: '钟声响起',
    description: '当你站在钟楼下的那一刻，停滞了五年的指针突然开始颤动。然后——"当——当——当——"悠扬的钟声穿过浓雾，响彻整个雾城。',
    choices: [
      {
        id: 'evt_bell_1',
        label: '闭上眼睛，许愿',
        resultText: '你闭上眼睛，在心里默念着那个许了无数次的愿望。钟声停止的时候，你睁开眼——钟楼的台阶上，坐着一个人。她抬起头，看到你，笑了："你终于来了。我等这钟声，等了五年。"',
        effects: { mood: 25, ending: 'map_ending_tower' }
      },
      {
        id: 'evt_bell_2',
        label: '顺着钟声的方向走去',
        resultText: '你朝着钟声传来的方向走去。雾越来越浓，但你不再害怕。因为你知道，钟声的尽头，一定有她在等你。',
        effects: { mood: 8, clue: 'clue_final' }
      }
    ],
    once: true,
    triggered: false
  },
  {
    id: 'evt_wind_chime',
    locationId: 'old_house',
    title: '风铃叮咚',
    description: '门上的风铃响了，却没有人推门进来。你站在院子里，看着满墙的紫藤花。窗台上的多肉，比五年前长大了许多。',
    choices: [
      {
        id: 'evt_wind_1',
        label: '推开那扇门',
        resultText: '你的手放在门把手上，冰凉的金属让你打了个寒颤。门没有锁。你轻轻一推——"你来了。"她站在客厅里，背对着你，正在浇花。"我每天都给花浇水，"她的声音有些颤抖，"我知道你一定会来的。"她转过身，泪流满面，却笑得像个少女："欢迎回家。"',
        effects: { mood: 30, ending: 'map_ending_home' }
      },
      {
        id: 'evt_wind_2',
        label: '在院子里等',
        resultText: '你坐在紫藤架下的秋千上，轻轻摇晃。风铃叮咚，花香萦绕。你不知道等了多久，但你愿意等。因为五年都等过来了，不在乎再多等一会儿。',
        effects: { mood: 6, memory: 'map_mem_8' }
      }
    ],
    once: true,
    triggered: false
  }
]

export const mapClues = [
  {
    id: 'clue_ticket',
    name: '旧车票',
    icon: '🎫',
    description: '一张泛黄的火车票，日期是五年前的今天。背面写着："我会等你的，直到你来。"',
    locationId: 'station',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_1'
  },
  {
    id: 'clue_photo',
    name: '雨中的合照',
    icon: '🖼️',
    description: '一张被雨水打湿边缘的照片，照片上的你们笑得那么灿烂。背面写着："湿漉漉的夏天，永远不会忘。"',
    locationId: 'old_street',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_2'
  },
  {
    id: 'clue_icecream',
    name: '冰淇淋店名片',
    icon: '🍦',
    description: '那家老字号冰淇淋店的名片，背面有她的字迹："下次，换你请我吃两个。"',
    locationId: 'old_street',
    category: '线索',
    importance: 'normal'
  },
  {
    id: 'clue_cup',
    name: '咖啡杯垫',
    icon: '☕',
    description: '咖啡馆的杯垫，上面用口红画了一颗心。旁边写着："每天下午三点，我都在这里。"',
    locationId: 'cafe_alley',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_3'
  },
  {
    id: 'clue_ring',
    name: '易拉罐拉环',
    icon: '💍',
    description: '被小心珍藏的易拉罐拉环。七年了，它还在。',
    locationId: 'cafe_alley',
    category: '物品',
    importance: 'key'
  },
  {
    id: 'clue_flower',
    name: '干薰衣草',
    icon: '🌸',
    description: '被压平的薰衣草，是你们第一次约会时你送她的。旁边有她的字迹："等待爱情。"',
    locationId: 'park',
    category: '物品',
    importance: 'normal',
    relatedMemory: 'map_mem_4'
  },
  {
    id: 'clue_balloon',
    name: '气球绳子',
    icon: '🎈',
    description: '生日那天放飞的气球，绳子还在。上面写着："愿望说出来就不灵了，但我想告诉你——"后面的字被剪断了。',
    locationId: 'park',
    category: '线索',
    importance: 'normal'
  },
  {
    id: 'clue_book',
    name: '《小王子》第21页',
    icon: '📖',
    description: '"只有用心才能看得清楚，本质的东西眼睛是看不见的。"旁边是她的批注："我的狐狸，你什么时候才能看见？"',
    locationId: 'bookstore',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_5'
  },
  {
    id: 'clue_bookmark',
    name: '枫叶书签',
    icon: '🍁',
    description: '枫叶做的书签，上面写着："人是会变的，但有些不会。"',
    locationId: 'bookstore',
    category: '物品',
    importance: 'normal'
  },
  {
    id: 'clue_bottle',
    name: '漂流瓶的纸条',
    icon: '🍾',
    description: '两张纸条，一张是你写的，一张是她后来加的。"如果你看到了这张纸条，就来湖畔的老地方。"',
    locationId: 'lake',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_6'
  },
  {
    id: 'clue_necklace',
    name: '贝壳项链',
    icon: '📿',
    description: '你在海边为她做的项链，她说要永远戴着。它被静静地放在湖边的石头上。',
    locationId: 'lake',
    category: '物品',
    importance: 'normal'
  },
  {
    id: 'clue_promise',
    name: '许愿石',
    icon: '🪨',
    description: '那颗你说代表永恒的小石子。底部刻着："永远有多远？比永远多一天。"',
    locationId: 'lake',
    category: '物品',
    importance: 'key'
  },
  {
    id: 'clue_watch',
    name: '怀表',
    icon: '⌚',
    description: '停在8点23分的怀表。现在，它又开始走了。',
    locationId: 'clock_tower',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_7'
  },
  {
    id: 'clue_final',
    name: '钟楼的钥匙',
    icon: '🗝️',
    description: '一把古旧的钥匙，据说能打开钟楼顶端的门。门上刻着："给所有等待重逢的人。"',
    locationId: 'clock_tower',
    category: '物品',
    importance: 'legendary'
  },
  {
    id: 'clue_key',
    name: '老屋的钥匙',
    icon: '🔑',
    description: '紫藤老屋的钥匙，系着紫色的丝带。她说过，这把钥匙永远为你留着。',
    locationId: 'cafe_alley',
    category: '物品',
    importance: 'key',
    relatedMemory: 'map_mem_8'
  },
  {
    id: 'clue_notebook',
    name: '未写完的日记',
    icon: '📔',
    description: '她的日记本，最后一页写着："今天他还是没来。没关系，我明天再来。五年算什么，我可以等十年。"',
    locationId: 'old_house',
    category: '物品',
    importance: 'key'
  },
  {
    id: 'clue_watch_hint',
    name: '钟背的刻字',
    icon: '✍️',
    description: '时钟背面刻着一行小字："等待是最长情的告白。"笔触很轻，却刻得很深。',
    locationId: 'station',
    category: '线索',
    importance: 'normal'
  },
  {
    id: 'clue_cup_hint',
    name: '留下的字条',
    icon: '📝',
    description: '"我来过，我还会再来。"字迹匆忙，却带着一丝坚定。她真的一直在等。',
    locationId: 'cafe_alley',
    category: '线索',
    importance: 'normal'
  },
  {
    id: 'clue_tree_initial',
    name: '树下的年份',
    icon: '🌲',
    description: '刻在两颗心中间的六个年份，一年不差。她每年都来，每年都刻下一个年份。',
    locationId: 'park',
    category: '线索',
    importance: 'key'
  },
  {
    id: 'clue_book_hint',
    name: '折角的书页',
    icon: '📄',
    description: '《小王子》第21页被折起了一角。"只有用心才能看得清楚"——这句话被红笔圈了起来。',
    locationId: 'bookstore',
    category: '线索',
    importance: 'normal'
  },
  {
    id: 'clue_bottle_hint',
    name: '瓶中的一瞥',
    icon: '🌫️',
    description: '你瞥见瓶中似乎有两张纸条，但还没有勇气打开。也许，下次吧。',
    locationId: 'lake',
    category: '线索',
    importance: 'normal'
  }
]

export const mapEndings = [
  {
    id: 'map_ending_reunion',
    type: 'legendary',
    title: '湖畔的重逢',
    description: '你朝着那个身影走去，每一步都像踩在棉花上。五年了，你在心里演练了无数次重逢的场景，但没有一次是现在这样——她就站在那里，真实得触手可及。\n\n"你来了。"她的声音和记忆中一模一样。\n\n"我来了。"你说不出更多的话，喉咙像被什么东西堵住了。\n\n她笑了，眼泪从脸颊滑落："我知道你会来的。漂流瓶告诉我，命运会把你带回来。"\n\n雾气开始消散，夕阳穿过云层，在湖面洒下金色的光芒。你们并肩坐在湖边的老地方，像五年前一样。只是这一次，谁也没有先放手。\n\n——有些约定，迟到五年，依然算数。',
    requiredClues: ['clue_bottle', 'clue_promise', 'clue_necklace']
  },
  {
    id: 'map_ending_tower',
    type: 'epic',
    title: '钟楼下的答案',
    description: '你一步一步走上钟楼的台阶。她坐在最高的那一层，看着雾中的城市。\n\n"你知道吗，"她没有回头，"我每年新年都会来这里等。等那个答案。"\n\n"什么答案？"你在她身边坐下。\n\n"那年新年，我在你耳边说的话。"她终于转过头，眼睛闪闪发亮，"你听清了吗？"\n\n你摇头。\n\n"我说，"她轻轻凑过来，在你耳边，和五年前一样的位置，一样的温度，"我喜欢你。从八年前的那个清晨开始，一直都是。"\n\n钟声再次响起，这一次，你听清了所有。\n\n——迟到了五年的答案，原来是最好的答案。',
    requiredClues: ['clue_final', 'clue_watch', 'clue_photo']
  },
  {
    id: 'map_ending_home',
    type: 'legendary',
    title: '永远的家',
    description: '你放下行李，看着她忙前忙后的身影。这个"家"，比你记忆中还要温暖。\n\n"紫藤花今年开得特别好，"她端着两杯茶走过来，"我就知道，它们在等你回来一起看。"\n\n你接过茶，看着她手腕上的贝壳项链——她真的戴了七年。\n\n"对不起，"你说，"让你等了这么久。"\n\n"傻瓜，"她在你身边坐下，把头靠在你肩上，"等待的日子，也是我们故事的一部分啊。没有这五年，我们怎么知道，原来对方这么重要。"\n\n窗外的紫藤花在风中摇曳，风铃叮咚作响。你终于明白——你走过的每一条街道，收集的每一条线索，触发的每一个回忆，都是为了指引你，回到这里。\n\n——家，是有人等你回去的地方。而你，终于回家了。',
    requiredClues: ['clue_notebook', 'clue_key', 'clue_ring']
  },
  {
    id: 'map_ending_still_searching',
    type: 'good',
    title: '寻找的路上',
    description: '夕阳西下，你站在雾城的最高处，俯瞰这座被雾气笼罩的城市。\n\n还有几个地方没有去，还有几条线索没有找到，还有几段回忆没有拼凑完整。但你不再迷茫了。\n\n因为你知道，她就在这个城市的某个角落，和你一样，在寻找，在等待。\n\n你握紧口袋里的线索，朝着下一个目的地走去。雾气很浓，但你能看见前方的路。\n\n——有些故事，不需要立刻有结局。因为寻找的过程，本身就是最好的答案。',
    requiredClues: 5
  }
]

export const getLocationById = (id) => mapLocations.find(l => l.id === id)
export const getEventById = (id) => mapEvents.find(e => e.id === id)
export const getClueById = (id) => mapClues.find(c => c.id === id)
export const getEventsByLocationId = (locationId) => mapEvents.filter(e => e.locationId === locationId)
export const getCluesByLocationId = (locationId) => mapClues.filter(c => c.locationId === locationId)
export const getEndingById = (id) => mapEndings.find(e => e.id === id)
