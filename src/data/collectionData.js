export const COLLECTION_PHASES = {
  phase1: { id: 'phase1', name: '初见·破碎记忆', icon: '🌱', description: '那些散落在雾城中的碎片，等待被拾起。', requiredCount: 3 },
  phase2: { id: 'phase2', name: '拼凑·时光碎片', icon: '🧩', description: '当碎片开始汇聚，故事的轮廓逐渐清晰。', requiredCount: 6 },
  phase3: { id: 'phase3', name: '重现·旧日重现', icon: '✨', description: '旧日的美好，在修复中缓缓苏醒。', requiredCount: 9 },
  phase4: { id: 'phase4', name: '补完·故事圆满', icon: '📖', description: '所有的空白被填满，故事终于完整。', requiredCount: 12 }
}

export const COLLECTION_ITEMS = [
  {
    id: 'relic_ticket',
    name: '褪色的车票',
    icon: '🎫',
    rarity: 'common',
    phase: 'phase1',
    category: 'travel',
    baseItemId: 'ticket',
    condition: {
      current: 35,
      max: 100,
      labels: ['边角破损', '水渍痕迹', '字迹模糊']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '这张车票的目的地，刻着一个被雨水打湿的名字...' },
        { id: 'frag2', unlocked: false, text: '背面有一行小字：「如果我没有赶上那趟车...」' },
        { id: 'frag3', unlocked: false, text: '五年前的那天，雾气比今天还重。她站在站台上，手里攥着两张车票。' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '车票编号：19XX-0823-0823', solved: false, hint: '查档案中某年某月某日的车次记录' },
        { id: 'clue2', text: '水印显示为「雾城铁路局·特别纪念版」', solved: false, hint: '这种纪念票只在特定节日发售' },
        { id: 'clue3', text: '票根上残留着淡淡的薰衣草香', solved: false, hint: '雾城哪家花店最有名？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_acidfree', name: '无酸纸', icon: '📄', count: 2, owned: 0 },
        { id: 'mat_gel', name: '修复啫喱', icon: '🧴', count: 1, owned: 0 },
        { id: 'mat_uv', name: '紫外线灯', icon: '💡', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '用无酸纸衬底加固破损边角', done: false, requiredMat: 'mat_acidfree' },
        { id: 'step2', desc: '涂抹修复啫喱消除水渍', done: false, requiredMat: 'mat_gel' },
        { id: 'step3', desc: '紫外线照射恢复模糊字迹', done: false, requiredMat: 'mat_uv' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_scarf',
    name: '褪色的蓝围巾',
    icon: '🧣',
    rarity: 'rare',
    phase: 'phase1',
    category: 'clothing',
    baseItemId: 'scarf',
    condition: {
      current: 25,
      max: 100,
      labels: ['开线破损', '颜色褪落', '沾染污渍']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '围巾的标签上写着「20XX年冬·限量款」' },
        { id: 'frag2', unlocked: false, text: '口袋里有一张被揉皱的电影院票根' },
        { id: 'frag3', unlocked: false, text: '那年冬天特别冷，你们挤在同一条围巾里看了一场夜场电影。散场时她把围巾留给了你，笑着说：「下次见面，要还给我哦。」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '品牌标签：「织梦工坊·手工限定」', solved: false, hint: '雾城老街上有一家开了三十年的编织店' },
        { id: 'clue2', text: '内侧绣着两个字母：X & Y', solved: false, hint: '回忆一下你们名字的首字母' },
        { id: 'clue3', text: '票根日期：12月24日 23:59', solved: false, hint: '平安夜的最后一场电影，是什么特别的日子？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_thread', name: '同色丝线', icon: '🧵', count: 3, owned: 0 },
        { id: 'mat_dye', name: '植物染剂', icon: '🎨', count: 2, owned: 0 },
        { id: 'mat_soap', name: '中性皂液', icon: '🧼', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '用中性皂液轻柔清洗去除污渍', done: false, requiredMat: 'mat_soap' },
        { id: 'step2', desc: '植物染剂恢复原有蓝色', done: false, requiredMat: 'mat_dye' },
        { id: 'step3', desc: '手工缝补开线处', done: false, requiredMat: 'mat_thread' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_watch',
    name: '停摆的怀表',
    icon: '⌚',
    rarity: 'rare',
    phase: 'phase1',
    category: 'accessory',
    baseItemId: 'watch',
    condition: {
      current: 40,
      max: 100,
      labels: ['表盖划痕', '机芯停摆', '表链断裂']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '表盘内侧刻着「Forever 8:23」' },
        { id: 'frag2', unlocked: false, text: '表壳里藏着一张微缩照片' },
        { id: 'frag3', unlocked: false, text: '那是她送你的十八岁生日礼物。她说：「时间会停在最美的那一刻。」火车开走的那一刻，表针也永远停在了8:23。' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '机芯刻字：「雾城钟表行·1952年制」', solved: false, hint: '这是一块传家宝级别的老表' },
        { id: 'clue2', text: '照片里是两个小女孩在海边', solved: false, hint: '她有一个你从未见过的姐姐...' },
        { id: 'clue3', text: '表链连接处刻着「母·女」', solved: false, hint: '这块表最初属于她的母亲' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_polish', name: '金属抛光膏', icon: '✨', count: 1, owned: 0 },
        { id: 'mat_gear', name: '精密齿轮组', icon: '⚙️', count: 1, owned: 0 },
        { id: 'mat_chain', name: '银质表链', icon: '⛓️', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '抛光膏去除表盖划痕', done: false, requiredMat: 'mat_polish' },
        { id: 'step2', desc: '更换齿轮组重启机芯', done: false, requiredMat: 'mat_gear' },
        { id: 'step3', desc: '焊接修复断裂表链', done: false, requiredMat: 'mat_chain' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_photo',
    name: '泛黄的合照',
    icon: '🖼️',
    rarity: 'common',
    phase: 'phase2',
    category: 'photo',
    baseItemId: 'photo',
    condition: {
      current: 30,
      max: 100,
      labels: ['边缘卷曲', '色彩褪去', '折痕明显']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '照片背面写着：「第一次约会，20XX.06.15」' },
        { id: 'frag2', unlocked: false, text: '你手里拿着一支没吃完的冰淇淋，她在笑着看你' },
        { id: 'frag3', unlocked: false, text: '那天是你主动约的她，紧张得冰淇淋都化了。她没说什么，只是把自己的那份分了你一半。照片是路边的摄影师抓拍的，后来你们找了他好久才买到底片。' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '相纸品牌：「雾城照相馆·金典系列」', solved: false, hint: '老街上的照相馆，老板是个戴贝雷帽的老爷爷' },
        { id: 'clue2', text: '背景是雾城老街的梧桐树下', solved: false, hint: '街心花园旁边，第三棵梧桐树' },
        { id: 'clue3', text: '摄影师签名：「阿光·20XX年夏」', solved: false, hint: '那位摄影师后来去了哪里？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_flatten', name: '压平器', icon: '📚', count: 1, owned: 0 },
        { id: 'mat_color', name: '色彩修复液', icon: '🌈', count: 2, owned: 0 },
        { id: 'mat_laminate', name: '冷裱膜', icon: '🖼️', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '压平器处理卷曲边缘和折痕', done: false, requiredMat: 'mat_flatten' },
        { id: 'step2', desc: '色彩修复液还原褪色', done: false, requiredMat: 'mat_color' },
        { id: 'step3', desc: '冷裱膜封存保护', done: false, requiredMat: 'mat_laminate' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_cup',
    name: '带唇印的咖啡杯',
    icon: '☕',
    rarity: 'epic',
    phase: 'phase2',
    category: 'ceramic',
    baseItemId: 'cup',
    condition: {
      current: 55,
      max: 100,
      labels: ['杯口小裂纹', '唇印淡化', '把手松动']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '杯底写着：「转角咖啡馆·专属定制」' },
        { id: 'frag2', unlocked: false, text: '唇印的色号是她最爱的「雾城玫瑰」' },
        { id: 'frag3', unlocked: false, text: '那是你们决定在一起的那天。她喝完最后一口咖啡，忽然凑过来吻了你。杯口的唇印和你脸上的温度，是同一个颜色。' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '杯子是日本有田烧工艺', solved: false, hint: '咖啡馆老板是日本留学回来的' },
        { id: 'clue2', text: '色号「雾城玫瑰」是限定款，只发售了99支', solved: false, hint: '她的生日是几月几号？' },
        { id: 'clue3', text: '杯内残留的咖啡渍分析：深度烘焙·曼特宁', solved: false, hint: '她点咖啡从来不加糖，你呢？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_kintsugi', name: '金继漆', icon: '🖌️', count: 1, owned: 0 },
        { id: 'mat_lipstick', name: '同色口红', icon: '💄', count: 1, owned: 0 },
        { id: 'mat_glue', name: '陶瓷专用胶', icon: '🧪', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '金继漆修补杯口裂纹', done: false, requiredMat: 'mat_kintsugi' },
        { id: 'step2', desc: '陶瓷胶加固松动把手', done: false, requiredMat: 'mat_glue' },
        { id: 'step3', desc: '同色口红还原唇印', done: false, requiredMat: 'mat_lipstick' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_ring',
    name: '易拉罐拉环戒指',
    icon: '💍',
    rarity: 'legendary',
    phase: 'phase2',
    category: 'jewelry',
    baseItemId: 'ring',
    condition: {
      current: 60,
      max: 100,
      labels: ['轻微变形', '表面氧化', '刻字磨损']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '拉环内侧刻着歪歪扭扭的「MARRY ME?」' },
        { id: 'frag2', unlocked: false, text: '旁边写着更小的字：「YES · 等我」' },
        { id: 'frag3', unlocked: false, text: '那年你们都穷，开了罐分享的可乐，你把拉环扯下来单膝跪地。她笑得眼泪都出来了，把手伸给你说：「傻瓜，以后要买真的给我。」那天晚上，她在拉环内侧刻下了自己的回答。' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '罐印品牌：「雾城老汽水·1988年经典款」', solved: false, hint: '这家汽水厂承载了几代雾城人的回忆' },
        { id: 'clue2', text: '刻字工具是你当年送她的瑞士军刀', solved: false, hint: '刀柄上有什么特别的图案？' },
        { id: 'clue3', text: '拉环保存了5年，说明她天天都带在身上', solved: false, hint: '她的钱包夹层里，一直有个小绒布袋...' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_reshape', name: '塑形工具', icon: '🔧', count: 1, owned: 0 },
        { id: 'mat_polish_metal', name: '金属抛光布', icon: '🧽', count: 2, owned: 0 },
        { id: 'mat_engrave', name: '激光刻字笔', icon: '✒️', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '塑形工具校正变形', done: false, requiredMat: 'mat_reshape' },
        { id: 'step2', desc: '抛光布去除氧化层', done: false, requiredMat: 'mat_polish_metal' },
        { id: 'step3', desc: '激光笔重刻磨损刻字', done: false, requiredMat: 'mat_engrave' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_notebook',
    name: '藏心事的日记本',
    icon: '📔',
    rarity: 'epic',
    phase: 'phase3',
    category: 'book',
    baseItemId: 'notebook',
    condition: {
      current: 45,
      max: 100,
      labels: ['书脊开裂', '页面粘连', '封面磨损']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '第一页写着：「给未来的自己——如果你遇见他，请把这个本子给他。」' },
        { id: 'frag2', unlocked: false, text: '中间有十几页被撕掉了，但印痕还在' },
        { id: 'frag3', unlocked: false, text: '撕掉的那几页，写的是她决定离开的那个星期。她每天都在写「今天要不要告诉他」，然后划掉重写。最后一页她写：「我选择离开，是为了更好地回来。」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '日记本品牌：「时光书坊·手工线装」', solved: false, hint: '时光书店老板亲手做的本子' },
        { id: 'clue2', text: '字迹是用她最喜欢的暗蓝色钢笔写的', solved: false, hint: '你送她的那支钢笔，笔帽上有什么装饰？' },
        { id: 'clue3', text: '最后一页的日期是「出发前一晚」', solved: false, hint: '她走的前一天，你们在咖啡馆待到几点？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_bind', name: '线装装订线', icon: '🧵', count: 2, owned: 0 },
        { id: 'mat_separate', name: '纸张分离剂', icon: '💧', count: 1, owned: 0 },
        { id: 'mat_cover', name: '仿皮封面', icon: '📗', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '纸张分离剂小心揭开粘连页', done: false, requiredMat: 'mat_separate' },
        { id: 'step2', desc: '重新线装修复开裂书脊', done: false, requiredMat: 'mat_bind' },
        { id: 'step3', desc: '包上新的仿皮封面', done: false, requiredMat: 'mat_cover' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_flower',
    name: '压平的薰衣草',
    icon: '🌸',
    rarity: 'common',
    phase: 'phase3',
    category: 'plant',
    baseItemId: 'flower',
    condition: {
      current: 70,
      max: 100,
      labels: ['花瓣碎裂', '香气散失', '颜色暗沉']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '花是从雾城郊外的薰衣草田摘的' },
        { id: 'frag2', unlocked: false, text: '花茎上系着你编的彩色丝线' },
        { id: 'frag3', unlocked: false, text: '那天你们骑着单车骑了两个小时，她在花田里笑得像个孩子。你编了花环戴在她头上，她摘了这朵花说：「我要把今天藏起来，想你的时候就闻一闻。」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '品种是「雾城紫霞」，只在雾城特定土壤生长', solved: false, hint: '薰衣草田的主人是一对老夫妇' },
        { id: 'clue2', text: '丝线有七种颜色，对应一周七天', solved: false, hint: '你是星期几出生的？她呢？' },
        { id: 'clue3', text: '压花用的是《小王子》里的一页', solved: false, hint: '哪一页的内容最让你们感动？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_glue_flower', name: '植物胶', icon: '🫙', count: 1, owned: 0 },
        { id: 'mat_fragrance', name: '薰衣草精油', icon: '🧴', count: 1, owned: 0 },
        { id: 'mat_frame', name: '玻璃标本框', icon: '🖼️', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '植物胶小心粘合碎裂花瓣', done: false, requiredMat: 'mat_glue_flower' },
        { id: 'step2', desc: '精油恢复原有香气', done: false, requiredMat: 'mat_fragrance' },
        { id: 'step3', desc: '装入标本框永久封存', done: false, requiredMat: 'mat_frame' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_book',
    name: '写满批注的《小王子》',
    icon: '📖',
    rarity: 'rare',
    phase: 'phase3',
    category: 'book',
    baseItemId: 'book',
    condition: {
      current: 50,
      max: 100,
      labels: ['书角折损', '批注褪色', '扉页散脱']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '扉页写着：「送给我的小王子——愿你永远不被驯养，也永远有人等你回家。」' },
        { id: 'frag2', unlocked: false, text: '第21页（狐狸的那页）旁边写满了她的批注' },
        { id: 'frag3', unlocked: false, text: '她在「如果你驯养了我，我的生活就会充满阳光」旁边批注：「我已经被驯养了，我的小王子，你什么时候回来看看你的狐狸？」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '版本是20XX年纪念版，译者签名本', solved: false, hint: '译者是雾城大学的一位教授' },
        { id: 'clue2', text: '签名旁边还有一行小字：「给最美的读者」', solved: false, hint: '教授为什么对她特别好？' },
        { id: 'clue3', text: '书中夹着一张大学图书馆的借书卡', solved: false, hint: '这张卡的最后借阅日期是什么时候？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_corner', name: '书角保护贴', icon: '🏷️', count: 4, owned: 0 },
        { id: 'mat_ink', name: '墨水还原笔', icon: '🖊️', count: 2, owned: 0 },
        { id: 'mat_spine', name: '书脊胶', icon: '🧴', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '贴好书角保护贴修复折损', done: false, requiredMat: 'mat_corner' },
        { id: 'step2', desc: '墨水笔还原褪色批注', done: false, requiredMat: 'mat_ink' },
        { id: 'step3', desc: '书脊胶固定散脱扉页', done: false, requiredMat: 'mat_spine' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_letter',
    name: '未寄出的告白信',
    icon: '💌',
    rarity: 'legendary',
    phase: 'phase4',
    category: 'paper',
    baseItemId: 'letter',
    condition: {
      current: 20,
      max: 100,
      labels: ['信封破损', '墨迹晕染', '封蜡碎裂']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '信封上写着你的名字，却没有写收信地址' },
        { id: 'frag2', unlocked: false, text: '信纸写了满满三页，最后一段被划掉了' },
        { id: 'frag3', unlocked: false, text: '被划掉的内容，用铅笔轻轻描过：「如果你看到这封信，说明我没走成。谢谢你，愿意等我。五年后的今天，火车站台，8:23。如果你愿意，就来。——永远爱你的 Y」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '信纸是时光书店的定制笺，有水印', solved: false, hint: '水印是一朵什么花？' },
        { id: 'clue2', text: '封蜡是家族纹章：一只衔着信的白鸽', solved: false, hint: '她的家族有什么特别的历史？' },
        { id: 'clue3', text: '信封内侧有一张登机牌的粘痕', solved: false, hint: '航班目的地是哪里？日期是什么时候？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_paper_repair', name: '古籍修复纸', icon: '📜', count: 3, owned: 0 },
        { id: 'mat_ink_fix', name: '固墨喷雾剂', icon: '💨', count: 1, owned: 0 },
        { id: 'mat_wax', name: '同款封蜡', icon: '🕯️', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '古籍修复纸修补信封破损', done: false, requiredMat: 'mat_paper_repair' },
        { id: 'step2', desc: '固墨喷雾固定晕染墨迹', done: false, requiredMat: 'mat_ink_fix' },
        { id: 'step3', desc: '重新熔铸封蜡封印', done: false, requiredMat: 'mat_wax' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_carving',
    name: '刻着名字的木片',
    icon: '🪵',
    rarity: 'epic',
    phase: 'phase4',
    category: 'wood',
    baseItemId: 'carving',
    condition: {
      current: 55,
      max: 100,
      labels: ['木纹开裂', '刻字模糊', '表面风化']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '两颗心的图案，里面各刻了一个字' },
        { id: 'frag2', unlocked: false, text: '旁边有日期，还有一行小字：「FOREVER」' },
        { id: 'frag3', unlocked: false, text: '那天你们在公园待到很晚，她忽然说想刻点什么在树上。你找了一块脱落的树皮，两个人在路灯下刻了整整一个小时。她说：「树会老，我们也会老，但刻下来的东西不会消失。」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '树种是雾城特有的「雾中梧桐」', solved: false, hint: '这种梧桐树的叶子有什么特别？' },
        { id: 'clue2', text: '刻字的刀是她父亲留下的遗物', solved: false, hint: '她父亲当年是做什么的？' },
        { id: 'clue3', text: 'FOREVER的「O」里面藏了一个小秘密', solved: false, hint: '仔细看，是不是刻了一个日期？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_wood_fill', name: '木粉填补剂', icon: '🪵', count: 1, owned: 0 },
        { id: 'mat_rewrite', name: '木刻刀套装', icon: '🔪', count: 1, owned: 0 },
        { id: 'mat_varnish', name: '木蜡油', icon: '🫗', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '木粉填补剂填充开裂处', done: false, requiredMat: 'mat_wood_fill' },
        { id: 'step2', desc: '木刻刀重新勾勒模糊字迹', done: false, requiredMat: 'mat_rewrite' },
        { id: 'step3', desc: '涂抹木蜡油防风化', done: false, requiredMat: 'mat_varnish' }
      ],
      completed: false
    }
  },
  {
    id: 'relic_musicbox',
    name: '蒙尘的音乐盒',
    icon: '🎵',
    rarity: 'legendary',
    phase: 'phase4',
    category: 'music',
    baseItemId: null,
    condition: {
      current: 30,
      max: 100,
      labels: ['机芯卡涩', '镜面模糊', '八音不准']
    },
    story: {
      fragments: [
        { id: 'frag1', unlocked: false, text: '音乐盒打开后是一个旋转的小小火车站台' },
        { id: 'frag2', unlocked: false, text: '曲子是《友谊地久天长》的变奏版' },
        { id: 'frag3', unlocked: false, text: '这是你们一起做的大学手工课作业。为了选这首歌，你们争论了一个星期。最后她说：「不管我们以后变成什么关系，我都希望我们能地久天长。」' }
      ],
      complete: false
    },
    provenance: {
      clues: [
        { id: 'clue1', text: '机芯是瑞士Reuge古董级18音机芯', solved: false, hint: '这是你们打工三个月才凑够钱买的' },
        { id: 'clue2', text: '木盒是胡桃木，由她亲手打磨', solved: false, hint: '木盒底部有她的指纹刻印' },
        { id: 'clue3', text: '站台模型里藏着两个小秘密', solved: false, hint: '仔细看站台上的两个小人，他们手里拿着什么？' }
      ],
      origin: null,
      year: null,
      owner: null
    },
    restoration: {
      materials: [
        { id: 'mat_lubricant', name: '钟表润滑油', icon: '🛢️', count: 1, owned: 0 },
        { id: 'mat_polish_glass', name: '玻璃抛光膏', icon: '🧴', count: 1, owned: 0 },
        { id: 'mat_tune', name: '调音工具组', icon: '🎼', count: 1, owned: 0 }
      ],
      steps: [
        { id: 'step1', desc: '润滑油处理卡涩机芯', done: false, requiredMat: 'mat_lubricant' },
        { id: 'step2', desc: '玻璃抛光膏打磨镜面', done: false, requiredMat: 'mat_polish_glass' },
        { id: 'step3', desc: '调音工具校准八音', done: false, requiredMat: 'mat_tune' }
      ],
      completed: false
    }
  }
]

export const MATERIAL_SHOP = [
  { id: 'mat_acidfree', name: '无酸纸', icon: '📄', price: 30, category: 'paper' },
  { id: 'mat_gel', name: '修复啫喱', icon: '🧴', price: 50, category: 'liquid' },
  { id: 'mat_uv', name: '紫外线灯', icon: '💡', price: 80, category: 'tool' },
  { id: 'mat_thread', name: '同色丝线', icon: '🧵', price: 25, category: 'sewing' },
  { id: 'mat_dye', name: '植物染剂', icon: '🎨', price: 60, category: 'liquid' },
  { id: 'mat_soap', name: '中性皂液', icon: '🧼', price: 20, category: 'liquid' },
  { id: 'mat_polish', name: '金属抛光膏', icon: '✨', price: 55, category: 'paste' },
  { id: 'mat_gear', name: '精密齿轮组', icon: '⚙️', price: 120, category: 'mechanical' },
  { id: 'mat_chain', name: '银质表链', icon: '⛓️', price: 100, category: 'metal' },
  { id: 'mat_flatten', name: '压平器', icon: '📚', price: 45, category: 'tool' },
  { id: 'mat_color', name: '色彩修复液', icon: '🌈', price: 70, category: 'liquid' },
  { id: 'mat_laminate', name: '冷裱膜', icon: '🖼️', price: 35, category: 'paper' },
  { id: 'mat_kintsugi', name: '金继漆', icon: '🖌️', price: 150, category: 'special' },
  { id: 'mat_lipstick', name: '同色口红', icon: '💄', price: 88, category: 'special' },
  { id: 'mat_glue', name: '陶瓷专用胶', icon: '🧪', price: 40, category: 'liquid' },
  { id: 'mat_reshape', name: '塑形工具', icon: '🔧', price: 65, category: 'tool' },
  { id: 'mat_polish_metal', name: '金属抛光布', icon: '🧽', price: 30, category: 'cloth' },
  { id: 'mat_engrave', name: '激光刻字笔', icon: '✒️', price: 180, category: 'tool' },
  { id: 'mat_bind', name: '线装装订线', icon: '🧵', price: 28, category: 'sewing' },
  { id: 'mat_separate', name: '纸张分离剂', icon: '💧', price: 55, category: 'liquid' },
  { id: 'mat_cover', name: '仿皮封面', icon: '📗', price: 75, category: 'paper' },
  { id: 'mat_glue_flower', name: '植物胶', icon: '🫙', price: 38, category: 'liquid' },
  { id: 'mat_fragrance', name: '薰衣草精油', icon: '🧴', price: 68, category: 'liquid' },
  { id: 'mat_frame', name: '玻璃标本框', icon: '🖼️', price: 95, category: 'frame' },
  { id: 'mat_corner', name: '书角保护贴', icon: '🏷️', price: 15, category: 'paper' },
  { id: 'mat_ink', name: '墨水还原笔', icon: '🖊️', price: 48, category: 'pen' },
  { id: 'mat_spine', name: '书脊胶', icon: '🧴', price: 42, category: 'liquid' },
  { id: 'mat_paper_repair', name: '古籍修复纸', icon: '📜', price: 70, category: 'paper' },
  { id: 'mat_ink_fix', name: '固墨喷雾剂', icon: '💨', price: 85, category: 'liquid' },
  { id: 'mat_wax', name: '同款封蜡', icon: '🕯️', price: 120, category: 'special' },
  { id: 'mat_wood_fill', name: '木粉填补剂', icon: '🪵', price: 52, category: 'paste' },
  { id: 'mat_rewrite', name: '木刻刀套装', icon: '🔪', price: 110, category: 'tool' },
  { id: 'mat_varnish', name: '木蜡油', icon: '🫗', price: 78, category: 'liquid' },
  { id: 'mat_lubricant', name: '钟表润滑油', icon: '🛢️', price: 90, category: 'liquid' },
  { id: 'mat_polish_glass', name: '玻璃抛光膏', icon: '🧴', price: 58, category: 'paste' },
  { id: 'mat_tune', name: '调音工具组', icon: '🎼', price: 200, category: 'tool' }
]

export const PHASE_REWARDS = {
  phase1: {
    coins: 200,
    materials: ['mat_acidfree', 'mat_gel', 'mat_soap'],
    title: '记忆拾荒者',
    description: '你开始学会在碎片中寻找过去的痕迹',
    unlock: '开启材料商店基础区'
  },
  phase2: {
    coins: 500,
    materials: ['mat_polish', 'mat_chain', 'mat_color'],
    title: '时光匠人',
    description: '你已经能让一些东西重见天日',
    unlock: '开启稀有修复材料'
  },
  phase3: {
    coins: 1000,
    materials: ['mat_kintsugi', 'mat_engrave', 'mat_tune'],
    title: '故事补完者',
    description: '那些被遗忘的故事，正在你的手中苏醒',
    unlock: '开启传说级材料专区'
  },
  phase4: {
    coins: 2000,
    materials: ['mat_wax', 'mat_cover', 'mat_frame'],
    title: '雾城收藏家',
    description: '所有的碎片都已归位，故事终于圆满',
    unlock: '解锁专属纪念结局'
  }
}

export const PROVENANCE_ANSWERS = {
  relic_ticket: {
    clue1: { answer: '19XX年8月23日', explanation: '车票编号的后8位就是日期，那是你们相识的纪念日。' },
    clue2: { answer: '七夕节限量发售', explanation: '8月23日那年正好是七夕，铁路局推出了情侣纪念票。' },
    clue3: { answer: '织梦人花店', explanation: '老街上那家紫色招牌的花店，她每周都会去买花。' },
    origin: '雾城火车站·七夕情侣纪念票',
    year: '五年前的8月23日',
    owner: '你们共同持有'
  },
  relic_scarf: {
    clue1: { answer: '老街织梦工坊', explanation: '老板陈阿婆织了一辈子围巾，这是她亲手做的限定款。' },
    clue2: { answer: '你们名字的首字母', explanation: 'X是你的首字母，Y是她的——这是阿婆偷偷绣上去的。' },
    clue3: { answer: '你们的纪念日', explanation: '平安夜是你们决定在一起的日子，那晚的最后一场电影是《真爱至上》。' },
    origin: '织梦工坊·20XX年冬季限定款',
    year: '认识的第一个冬天',
    owner: '她织给你的生日礼物'
  },
  relic_watch: {
    clue1: { answer: '她母亲的嫁妆', explanation: '1952年，她外祖父送给外祖母的定情信物。' },
    clue2: { answer: '她和姐姐的合影', explanation: '她有一个大她五岁的姐姐，在海边长大...这是她最想念的人。' },
    clue3: { answer: '母女传承', explanation: '母亲传给女儿，女儿本想在婚礼那天传给你——这是她们家的传统。' },
    origin: '雾城钟表行·1952年定制款',
    year: '1952年制，20XX年传给她',
    owner: '她们家三代女性的传承'
  },
  relic_photo: {
    clue1: { answer: '老街照相馆·阿光', explanation: '戴贝雷帽的张爷爷，现在已经退休了，他儿子接手了店铺。' },
    clue2: { answer: '你们的定情树', explanation: '第三棵梧桐树，你们在那里刻了名字。后来城市改造，那棵树被移植到了公园。' },
    clue3: { answer: '阿光去了国外', explanation: '他追随着他的摄影梦想去了法国，寄回来的明信片你一直收着。' },
    origin: '雾城照相馆·街拍系列',
    year: '20XX年6月15日',
    owner: '你们爱情的第一张合影'
  },
  relic_cup: {
    clue1: { answer: '老板森田的私藏', explanation: '森田先生留学时带回的有田烧，这套杯子他一共只有两对。' },
    clue2: { answer: '她的生日日期', explanation: '9月9日发售的99支，她的生日就是9月9日——这是她送给自己的礼物。' },
    clue3: { answer: '你加了双份糖', explanation: '你喝咖啡永远加双份糖，她笑你是「小孩子口味」，但每次都会帮你加好。' },
    origin: '日本有田烧·转角咖啡馆定制款',
    year: '在一起半年的那天',
    owner: '你们的「情侣对杯」'
  },
  relic_ring: {
    clue1: { answer: '雾城人的集体回忆', explanation: '这家汽水厂创办于1988年，承载了雾城三代人的童年。现在已经停产了。' },
    clue2: { answer: '三叶草图案', explanation: '那是你初中时在运动会上赢到的奖品，你刻了三叶草——你们是「三生有幸」。' },
    clue3: { answer: '确实天天带着', explanation: '她的钱包夹层里有个小绒布袋，除了这个拉环，还有你送的每一张电影票根。' },
    origin: '雾城老汽水·1988年经典款拉环',
    year: '那年夏天·公园长椅上',
    owner: '你人生中第一枚「求婚戒指」'
  },
  relic_notebook: {
    clue1: { answer: '时光书店老板手作', explanation: '李老板是个古籍修复师，他的手工本子每一本都是独一无二的。' },
    clue2: { answer: '星辰吊坠的钢笔', explanation: '你送她的20岁生日礼物，笔帽上的星辰吊坠是你攒了三个月钱买的施华洛世奇。' },
    clue3: { answer: '凌晨三点', explanation: '那天你们聊到天亮，她对你说的最后一句话是：「不管发生什么，都要相信我。」' },
    origin: '时光书坊·手工线装典藏本',
    year: '她离开前三个月开始写',
    owner: '她五年间所有的心事'
  },
  relic_flower: {
    clue1: { answer: '王爷爷王奶奶的花田', explanation: '他们种了四十年薰衣草，花田名字叫「等待」——王爷爷当年等了王奶奶十年。' },
    clue2: { answer: '你周三·她周日', explanation: '周三出生的你聪慧，周日出生的她温柔——算命的阿婆说你们是天作之合。' },
    clue3: { answer: '第63页·狐狸驯养', explanation: '「如果你驯养了我，我的生活就会充满阳光。」这是她最喜欢的一句。' },
    origin: '雾城紫霞·「等待」花田',
    year: '认识的第一个春天',
    owner: '那天的阳光和风，还有她的笑声'
  },
  relic_book: {
    clue1: { answer: '林雪薇教授', explanation: '雾城大学法语系的传奇教授，是她最崇拜的老师，也是她选择法语专业的原因。' },
    clue2: { answer: '她长得像教授年轻时', explanation: '教授说看到她就像看到年轻时的自己，后来她们成了忘年交。' },
    clue3: { answer: '她离开那天的前一天', explanation: '她去还书，在图书馆坐了一下午。管理员阿姨说她哭了好久。' },
    origin: '20XX年译者签名纪念版',
    year: '你考上大学的那年',
    owner: '她十八岁那年，你送的成年礼'
  },
  relic_letter: {
    clue1: { answer: '「等待」薰衣草', explanation: '和那朵干花是同一种，李老板特意为她定制的笺纸。' },
    clue2: { answer: '她的家族是信使世家', explanation: '从清代开始，她们家就开信局。白鸽衔信的纹章是光绪年间御赐的。' },
    clue3: { answer: '法国巴黎·五年前的今天', explanation: '她买了机票，但在登机口折返了——她舍不得走，所以写了这封信。' },
    origin: '时光书店定制笺·家族封蜡',
    year: '她「离开」的那一天',
    owner: '她没说出口的真心话'
  },
  relic_carving: {
    clue1: { answer: '雾中梧桐·四季异色', explanation: '春天紫、夏天绿、秋天金、冬天蓝——这是雾城的市树，只在雾城生长。' },
    clue2: { answer: '老木匠·她的父亲', explanation: '她父亲是雾城最好的木匠，可惜走得早。这把刀是他留给她唯一的遗物。' },
    clue3: { answer: '你们重逢的日期', explanation: '8.23——车票上的日子，怀表停下的时刻，你们重逢的瞬间。' },
    origin: '雾中梧桐树·自然脱落的树皮',
    year: '在一起三周年的那天',
    owner: '你们的「FOREVER」'
  },
  relic_musicbox: {
    clue1: { answer: '你们的第一笔「巨款」', explanation: '送报纸、发传单、做家教——你们打了三个月工，终于凑够了钱。' },
    clue2: { answer: '她的指纹和你们的手印', explanation: '打磨时她不小心弄伤了手，血印在木头上成了永久的标记。' },
    clue3: { answer: '两张车票和一枚拉环', explanation: '站台上的两个小人，男生手里攥着车票，女生手里举着易拉罐拉环。' },
    origin: '瑞士Reuge机芯·手工胡桃木盒',
    year: '大学手工课·20XX年冬',
    owner: '你们合作完成的唯一一件作品'
  }
}
