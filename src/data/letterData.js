export const letterChapters = [
  {
    id: 'lc1',
    round: 1,
    title: '第一封信 · 雾中的来信',
    from: '雾城邮局 · 匿名',
    date: '五年前 · 初秋',
    opening: '展信安。',
    content: `不知这封信会被谁拾起，也不知它能否找到归处。

我在雾城生活了很多年，这座城市总是被雾气笼罩，就像有些人的心，永远看不清真面目。

如果你读到了这封信，说明我们之间或许有些缘分。我有一个故事，想讲给愿意听的人。

故事关于一场错过，关于一句没说出口的话，关于一封...永远不会寄出的信。

你愿意，继续听下去吗？`,
    closing: '等你回信的人',
    choices: [
      {
        id: 'lc1_a',
        label: '📝 写下回信：我愿意听你的故事',
        replyContent: `你好：

谢谢你愿意听我讲这个故事。其实我犹豫了很久，才决定写下这封信。

不知道为什么，我总觉得你会懂。也许是因为，你也在雾城里寻找着什么吧。

那么，故事就从五年前的那个夏天开始讲起...

——雾城的陌生人`,
        effects: { relation: 2, sincere: 1, curious: 2 },
        nextLetter: 'lc2_path_a'
      },
      {
        id: 'lc1_b',
        label: '❓ 写下回信：你是谁？为什么要告诉我这些？',
        replyContent: `陌生人：

我是谁不重要。重要的是，这个故事需要有人记得。

你不必相信我，也不必继续读下去。但我想告诉你——

有些错过，是一辈子的遗憾。有些话，现在不说，就永远没机会了。

如果你改变主意了，就把信放回原处。也许，下一封信会告诉你更多。

——一个路过的人`,
        effects: { relation: 0, cautious: 2, doubtful: 1 },
        nextLetter: 'lc2_path_b'
      },
      {
        id: 'lc1_c',
        label: '✉️ 不回信，把信放回原处',
        replyContent: null,
        effects: { relation: -1, reserved: 2 },
        nextLetter: 'lc2_path_c'
      }
    ],
    moodEffect: 3
  },
  {
    id: 'lc2_path_a',
    round: 2,
    title: '第二封信 · 那年盛夏',
    from: '雾城邮局 · 等待回信的人',
    date: '五年前 · 盛夏',
    opening: '老朋友：',
    content: `谢谢你的回信。看到字迹的那一刻，我竟然有些紧张，像个第一次写信的孩子。

那年夏天，雾城的雾气比往年都淡。阳光透过梧桐树叶，洒在老街上，像碎金一样。

我就是在那个夏天遇到她的。

她站在书店门口，手里捧着一本《小王子》，眉头微蹙，很认真的样子。我站在街对面看了她很久，直到她突然抬起头，目光对上了我的。

你猜怎么着？她没有躲开，反而对我笑了笑。

那个笑容，我记了一辈子。

...也许你也有过这样的时刻吧？一个笑容，就定格了整个夏天。`,
    closing: '期待你的回信',
    choices: [
      {
        id: 'lc2a_a',
        label: '💭 写下回信：我也有过这样的时刻。后来呢？',
        replyContent: `朋友：

看到你说"也有过"，我忽然觉得不那么孤单了。

后来啊...后来我鼓起勇气走进了书店。

"请问，这本书好看吗？"我指着她手里的《小王子》，声音有点发抖。

她抬起头，眼睛弯弯的："好看啊。不过，要用心才能看得清楚。"

那天我们聊了很久，从小王子聊到雾城的雾，从日出聊到黄昏。

她说她叫"玫瑰花"。我知道那不是真名，但我还是说："那我就是狐狸。"

她笑了，笑得很开心。

——故事才刚刚开始呢`,
        effects: { relation: 3, romantic: 2, nostalgic: 1 },
        nextLetter: 'lc3_path_warm'
      },
      {
        id: 'lc2a_b',
        label: '🤔 写下回信：这是真实的故事，还是你编的？',
        replyContent: `怀疑者：

你可以把它当作故事，也可以当作...某个人的心事。

真假重要吗？

重要的是，有些感觉是真的。心跳是真的，快乐是真的，思念也是真的。

至于故事的真假...等你听完，也许自己会有答案。

——讲故事的人`,
        effects: { relation: 1, doubtful: 2, sincere: -1 },
        nextLetter: 'lc3_path_doubt'
      },
      {
        id: 'lc2a_c',
        label: '🌻 写下回信：她一定是个很特别的人',
        replyContent: `你说得对：

她确实很特别。

她喜欢在雨天看书，喜欢吃冰淇淋吃到头疼，喜欢在雾里散步，说这样看不清方向也没关系，因为"重要的不是目的地，是身边的人"。

她总是说些奇怪的话，但奇怪的是，我都懂。

我想，这就是所谓的"同频"吧。

——她真的很特别`,
        effects: { relation: 4, gentle: 2, romantic: 1 },
        nextLetter: 'lc3_path_sweet'
      }
    ],
    moodEffect: 5
  },
  {
    id: 'lc2_path_b',
    round: 2,
    title: '第二封信 · 疑虑',
    from: '雾城邮局 · 陌生人',
    date: '五年前 · 初秋',
    opening: '警惕的人：',
    content: `我理解你的怀疑。毕竟，谁会相信一封来自陌生人的信呢？

但请你相信，我没有恶意。我只是...有些话憋在心里太久了，需要一个出口。

如果你愿意继续读下去，我会把整个故事都告诉你。

如果你不愿意，那也没关系。就当这是一场雾中的梦，醒了就忘了吧。

选择权，在你手里。`,
    closing: '一个陌生人',
    choices: [
      {
        id: 'lc2b_a',
        label: '📖 好吧，我继续读。请讲你的故事。',
        replyContent: `谢谢：

谢谢你愿意给我，也给这个故事一个机会。

故事要从五年前的那个夏天讲起...

那是雾城少有的晴天，阳光把老街照得暖洋洋的。她就站在书店门口，像一幅画。

——故事很长，慢慢讲`,
        effects: { relation: 2, open: 1, cautious: -1 },
        nextLetter: 'lc3_path_warm'
      },
      {
        id: 'lc2b_b',
        label: '🚪 我不想继续了。这是最后一封信。',
        replyContent: null,
        effects: { relation: -2, decisive: 2 },
        nextLetter: 'ending_cold'
      }
    ],
    moodEffect: 0
  },
  {
    id: 'lc2_path_c',
    round: 2,
    title: '第二封信 · 沉默的回应',
    from: '雾城邮局 · ？？？',
    date: '五年前 · 深秋',
    opening: '（没有称呼）',
    content: `我知道你看到了那封信。你没有回信，把它放回了原处。

没关系。有些人习惯用沉默回答。

但我还是想把这个故事讲完。不是讲给你听，是讲给我自己听。

也许有一天，你会愿意听。也许不会。

但故事，已经开始了。`,
    closing: '（没有署名）',
    choices: [
      {
        id: 'lc2c_a',
        label: '✍️ 终于决定回信：对不起，让你等了这么久',
        replyContent: `没关系：

你不必道歉。每个人都有自己的节奏。

你愿意回信，我已经很开心了。

那么，故事继续吧。关于那个夏天，关于那个女孩，关于那封没寄出的信...

——愿意等待的人`,
        effects: { relation: 3, sincere: 2, patient: 1 },
        nextLetter: 'lc3_path_sweet'
      },
      {
        id: 'lc2c_b',
        label: '👀 继续沉默，但把信收起来了',
        replyContent: null,
        effects: { relation: 0, reserved: 2, thoughtful: 1 },
        nextLetter: 'lc3_path_silent'
      }
    ],
    moodEffect: 2
  },
  {
    id: 'lc3_path_warm',
    round: 3,
    title: '第三封信 · 转折点',
    from: '雾城邮局 · 讲故事的人',
    date: '五年前 · 深秋',
    opening: '朋友：',
    content: `秋天来的时候，我们已经很要好了。

每天放学都一起走，从老街走到车站，从黄昏走到天黑。她说她喜欢和我一起走路，因为"路好像变短了"。

我也是。

但那时候我太年轻了，总觉得时间还很多，有些话可以以后再说。

"以后"是什么时候呢？是明天？是明年？还是...永远不会来？

有一天，她递给我一封信。

"这是给你的。"她说，脸红红的，"但你现在别看，等...等我走了再看。"

我接过信，想问她什么意思，但她已经跑远了。

那时候我还不知道，那是我们最后一次见面。`,
    closing: '待续',
    choices: [
      {
        id: 'lc3w_a',
        label: '💔 写下回信：为什么？发生了什么？',
        replyContent: `你别急：

我知道你想知道答案。我也想。

但答案...不是三言两语能说清的。

她走了，去了很远的地方。没有说为什么，也没有说什么时候回来。

我握着那封信，在车站等了三天。

三天后，我打开了那封信。

——答案，在信里`,
        effects: { relation: 3, anxious: 2, invested: 1 },
        nextLetter: 'lc4_path_curious'
      },
      {
        id: 'lc3w_b',
        label: '📜 写下回信：那封信里写了什么？',
        replyContent: `你想知道信的内容吗？

那封信啊...

那封信很短，只有三行字。

"如果我说我喜欢你，你会怎么样？"
"我等了你一个夏天。"
"我走了。"

就这三句话。我看了五年。

每一个字，都像刻在心上。

——三行字，五年时间`,
        effects: { relation: 4, touched: 2, regret: 1 },
        nextLetter: 'lc4_path_letter'
      },
      {
        id: 'lc3w_c',
        label: '😔 写下回信：你后悔吗？',
        replyContent: `后悔？

这个问题，我问了自己五年。

后悔没有早一点说出口？
后悔没有追上去？
后悔...连一句"再见"都没说？

说不后悔是假的。

但更多的是...遗憾。
遗憾我们的故事，就这样戛然而止。
遗憾那句话，永远没机会说出口了。

——如果当时勇敢一点...`,
        effects: { relation: 5, regret: 2, empathetic: 2 },
        nextLetter: 'lc4_path_regret'
      }
    ],
    moodEffect: -2
  },
  {
    id: 'lc3_path_doubt',
    round: 3,
    title: '第三封信 · 真实与虚构',
    from: '雾城邮局 · 讲故事的人',
    date: '五年前 · 深秋',
    opening: '怀疑论者：',
    content: `你问我这个故事是真的还是编的。

说实话，我有时候也分不清了。

五年了，回忆开始变得模糊。哪些是真的，哪些是我想象出来的，好像已经不重要了。

重要的是，那些感觉是真的。
心跳是真的。
快乐是真的。
痛，也是真的。

如果你还是不信...那也没关系。就当这是一个故事，一个关于错过的故事。

但我想告诉你一件事——
那封她给我的信，现在就在我手里。
五年来，我带在身边，却从来没有勇气回一封。

你说，我该回信吗？`,
    closing: '迷茫的人',
    choices: [
      {
        id: 'lc3d_a',
        label: '💪 回！有些话必须说出口！',
        replyContent: `你说得对：

"有些话必须说出口。"

看到这句话的时候，我忽然觉得...也许我应该试一试。

五年了，我不知道她还在不在那个地址，不知道她还记不记得我。

但至少，我要让她知道——
那句话，我也想说很久了。

谢谢你，陌生人。
是你给了我勇气。

——我决定了`,
        effects: { relation: 4, courage: 2, supportive: 2 },
        nextLetter: 'lc4_path_courage'
      },
      {
        id: 'lc3d_b',
        label: '🤫 还是别了吧。有些回忆，放在心里就好',
        replyContent: `也许你是对的：

"有些回忆，放在心里就好。"

我有时候也会这么想。
如果不联系，那些回忆就永远是美好的。
如果联系了...万一呢？

万一时过境迁？
万一物是人非？
万一...她已经不记得我了？

我害怕那个答案。

——也许沉默更好`,
        effects: { relation: 2, cautious: 2, fearful: 1 },
        nextLetter: 'lc4_path_fear'
      },
      {
        id: 'lc3d_c',
        label: '🤔 你自己怎么想的？跟着心走就好',
        replyContent: `跟着心走...

说起来容易，做起来好难。

我的心很乱。
一半说"去吧，别留遗憾"，
一半说"算了，别破坏回忆"。

你呢？如果你是我，你会怎么做？

——我想听听你的故事`,
        effects: { relation: 3, thoughtful: 2, connection: 1 },
        nextLetter: 'lc4_path_mutual'
      }
    ],
    moodEffect: 1
  },
  {
    id: 'lc3_path_sweet',
    round: 3,
    title: '第三封信 · 甜蜜时光',
    from: '雾城邮局 · 温柔的人',
    date: '五年前 · 盛夏末',
    opening: '懂我的人：',
    content: `谢谢你说她特别。听到有人这么说她，我很开心。

那些日子，真的很美好。

我们会在书店待一下午，各看各的书，偶尔抬头相视一笑。
我们会分享同一个冰淇淋，她总说一个人吃不完。
我们会在雾里散步，她说雾大的时候，世界就只剩下我们两个人。

现在想想，那大概就是...幸福吧。

但那时候太年轻，总觉得这样的日子会一直持续下去。
永远不会变。

永远...到底有多远呢？`,
    closing: '怀念过去的人',
    choices: [
      {
        id: 'lc3s_a',
        label: '🥰 写下回信：真好。你们一定很相爱吧？',
        replyContent: `相爱吗...

我想，是的。

至少，我是爱着她的。
她呢？我以为她也是。
但有些话，我们都没说出口。

大概是...都害怕说破了，连朋友都做不成。

所以我们就保持着这样的距离，不远不近，像隔着一层雾。

你说，我们是不是很傻？

——两个胆小鬼`,
        effects: { relation: 4, romantic: 2, bittersweet: 1 },
        nextLetter: 'lc4_path_tender'
      },
      {
        id: 'lc3s_b',
        label: '😢 写下回信：你说"永远不会变"...后来呢？',
        replyContent: `你很敏锐：

是的，没有什么是永远的。

夏天结束的时候，她告诉我，她要走了。
"去一个很远的地方。"她说。
"多久？"我问。
"不知道。"她低着头，"也许...不会回来了。"

那天雾很大，我看不清她的表情。
但我知道，她在哭。

我也想哭，但我忍住了。
因为我不想让她看到我脆弱的样子。

——夏天结束了`,
        effects: { relation: 5, sad: 2, empathetic: 2 },
        nextLetter: 'lc4_path_sad'
      },
      {
        id: 'lc3s_c',
        label: '✨ 写下回信：美好的回忆，也是一种永远',
        replyContent: `你说得真好：

"美好的回忆，也是一种永远。"

看到这句话的时候，我忽然就释然了。

是啊，即使人不在身边了，那些回忆也是真的。
快乐是真的，心动是真的，温暖也是真的。

这些东西，是谁也拿不走的。

谢谢你，陌生人。
你让我明白了一些事情。

——回忆是永恒的`,
        effects: { relation: 5, warm: 3, healing: 2 },
        nextLetter: 'lc4_path_healing'
      }
    ],
    moodEffect: 4
  },
  {
    id: 'lc3_path_silent',
    round: 3,
    title: '第三封信 · 倾诉',
    from: '雾城邮局 · 自言自语的人',
    date: '五年前 · 深秋',
    opening: '（你没有回信，但信还是来了）',
    content: `我知道你在看。

也许你觉得我很奇怪，为什么要给一个陌生人写这么多信。

因为...有些话，不能对认识的人说。
因为...认识的人会担心，会评判，会有各种各样的反应。

但陌生人不一样。
你可以静静地听，不用回应。
对我来说，这就够了。

今天想告诉你她离开那天的事。

那天雾很大，比平时都大。
她站在站台上，手里攥着车票。
我站在她对面，想说的话很多，却一句也说不出来。

火车来了。
她上车前，递给我一封信。
"等我走了再看。"她说。
然后火车就开走了。

我站在站台上，手里攥着那封信，站了很久很久。

久到...我都忘了时间。`,
    closing: '（没有署名）',
    choices: [
      {
        id: 'lc3si_a',
        label: '💌 终于回信：那封信里写了什么？',
        replyContent: `你终于回信了：

我等这一天，等了好久。

那封信里...只有三句话。

"如果我说我喜欢你，你会怎么样？"
"我等了你一个夏天。"
"我走了。"

就三句话。
我看了五年。
每一个字，都记得清清楚楚。

你说，她为什么不早说呢？
为什么...要等到离开的时候才说？

——三句话，五年痛`,
        effects: { relation: 4, touched: 2, connection: 2 },
        nextLetter: 'lc4_path_letter'
      },
      {
        id: 'lc3si_b',
        label: '👋 继续沉默，但把每封信都收好',
        replyContent: null,
        effects: { relation: 1, reserved: 2, listener: 2 },
        nextLetter: 'lc4_path_listener'
      }
    ],
    moodEffect: -1
  },
  {
    id: 'lc4_path_curious',
    round: 4,
    title: '第四封信 · 追寻',
    from: '雾城邮局 · 寻找答案的人',
    date: '四年前 · 初春',
    opening: '好奇的朋友：',
    content: `她走之后，我消沉了很久。

每天都去车站等，等一列不会回来的火车，等一个不会回来的人。

朋友都说我傻。
我知道我傻。
但我控制不住。

后来有一天，我收到了一个包裹。
没有寄件人地址，只有一行字："如果你还想找我，就来这里。"

包裹里是一张地图，上面画着一个红色的圈。
还有一张火车票。
日期是...一周后。

你说，我该去吗？`,
    closing: '站在十字路口的人',
    choices: [
      {
        id: 'lc4c_a',
        label: '🚄 去！一定要去！哪怕只是为了一个答案',
        replyContent: `你说得对：

"哪怕只是为了一个答案。"

我也是这么想的。
五年了，我需要一个答案。

不管答案是什么，
不管她还记不记得我，
不管我们还能不能回到过去...

至少，我要去见她一面。
至少，我要把那句话说出口。

——我买了票`,
        effects: { relation: 5, courage: 3, decisive: 2 },
        nextLetter: 'lc5_path_go'
      },
      {
        id: 'lc4c_b',
        label: '🤷 不知道...这会不会是个陷阱？',
        replyContent: `陷阱...

我也想过这个可能。

但即使是陷阱，我也想跳进去。
因为这是五年来，我唯一的线索。

如果不去，我会后悔一辈子。
如果去了，哪怕是陷阱，至少我试过了。

你说呢？

——也许是陷阱，但我愿意跳`,
        effects: { relation: 3, cautious: 1, hopeful: 2 },
        nextLetter: 'lc5_path_hesitate'
      },
      {
        id: 'lc4c_c',
        label: '💭 你心里已经有答案了，不是吗？',
        replyContent: `你真的很懂我：

是的，我心里已经有答案了。

从收到包裹的那一刻起，
我就知道，我会去。

不管结果如何。
不管等待我的是什么。

只是...我需要一点勇气。
而你的信，给了我这份勇气。

谢谢你，真的。

——我决定了`,
        effects: { relation: 6, understanding: 3, supportive: 2 },
        nextLetter: 'lc5_path_determined'
      }
    ],
    moodEffect: 2
  },
  {
    id: 'lc4_path_letter',
    round: 4,
    title: '第四封信 · 回信',
    from: '雾城邮局 · 执笔的人',
    date: '四年前 · 春天',
    opening: '朋友：',
    content: `那三句话，我看了五年。

"如果我说我喜欢你，你会怎么样？"
"我等了你一个夏天。"
"我走了。"

每一个字，都像一根针，扎在心上。
但又像一颗糖，甜的时候，能让人忘掉所有的痛。

五年了。
我写了无数封回信，
却一封都没有寄出去。

不是不想寄，是不敢。
我怕地址不对，
怕她已经忘了我，
怕...打扰到她现在的生活。

你说，我该把信寄出去吗？`,
    closing: '犹豫不决的人',
    choices: [
      {
        id: 'lc4l_a',
        label: '📮 寄！有些话，必须让对方知道',
        replyContent: `你说得对：

"有些话，必须让对方知道。"

五年了，
我不能再等了。

我要告诉她——
我也是。
我也喜欢她。
我也等了很久。

不管结果如何，
至少，我要让她知道。

——明天就去寄信`,
        effects: { relation: 5, courage: 3, sincere: 2 },
        nextLetter: 'lc5_path_send'
      },
      {
        id: 'lc4l_b',
        label: '⏳ 再想想吧。五年都等了，也不急这一时',
        replyContent: `也是：

五年都等了，
也不急这一时。

但我怕...
再等下去，
就真的来不及了。

时间不等人。
有些人，错过就是一辈子。

——还在犹豫`,
        effects: { relation: 3, hesitant: 2, patient: 1 },
        nextLetter: 'lc5_path_wait'
      },
      {
        id: 'lc4l_c',
        label: '💌 你已经写好了信，不是吗？把它交给命运吧',
        replyContent: `交给命运...

这个想法，好像也不错。

我写好了信，
却一直没有勇气投进邮筒。

如果是命运的安排，
那它总有一天会到达。
如果不是...
那就当它是一场梦吧。

——交给命运`,
        effects: { relation: 4, philosophical: 2, calm: 2 },
        nextLetter: 'lc5_path_fate'
      }
    ],
    moodEffect: 1
  },
  {
    id: 'lc4_path_regret',
    round: 4,
    title: '第四封信 · 遗憾',
    from: '雾城邮局 · 悔恨的人',
    date: '三年前 · 秋天',
    opening: '懂我的人：',
    content: `你问我后不后悔。

后悔。
怎么可能不后悔。

我后悔那天没有追上去，
后悔没有早一点说出口，
后悔...连一句"我喜欢你"都没来得及说。

五年了。
我试过忘记，试过放下，试过开始新的生活。
但做不到。

她的影子无处不在。
书店里有她的影子，
老街上有她的影子，
就连雾里，都好像有她的味道。

你说，人这一辈子，
能有几次这样的遇见？
能有几次这样的心动？

如果错过了，是不是就再也遇不到了？`,
    closing: '困在过去的人',
    choices: [
      {
        id: 'lc4r_a',
        label: '💪 既然这么放不下，就去找她吧',
        replyContent: `去找她...

说起来容易。
可是，去哪里找？

她走了之后，
就像人间蒸发了一样。
没有消息，没有音信。

我甚至都不知道，
她还在不在这座城市，
还在不在这个国家。

世界这么大，
找一个人，谈何容易。

——世界太大了`,
        effects: { relation: 4, hopeful: 2, sad: 1 },
        nextLetter: 'lc5_path_search'
      },
      {
        id: 'lc4r_b',
        label: '⏰ 人不能一直活在过去。向前看吧。',
        replyContent: `向前看...

我知道你说得对。
道理我都懂。

可是，心不听我的。
它还停在五年前的那个夏天，
停在她转身的那个瞬间，
停在...那句没说出口的话。

什么时候才能向前走呢？
我不知道。
也许明天就可以，
也许...还要等五年。

——谢谢你的劝`,
        effects: { relation: 3, realistic: 2, kind: 1 },
        nextLetter: 'lc5_path_forward'
      },
      {
        id: 'lc4r_c',
        label: '🤗 抱抱你。但我相信，念念不忘必有回响',
        replyContent: `念念不忘，必有回响...

你相信吗？

我想相信。
我真的想相信。

五年了，
如果真的有回响，
应该早就有了吧？

但你说得对，
也许我该再等等。
再给自己一点希望。

谢谢你的安慰。
真的。

——再等等吧`,
        effects: { relation: 5, warm: 3, hopeful: 2 },
        nextLetter: 'lc5_path_hope'
      }
    ],
    moodEffect: -3
  },
  {
    id: 'lc4_path_courage',
    round: 4,
    title: '第四封信 · 勇气',
    from: '雾城邮局 · 鼓起勇气的人',
    date: '三年前 · 春天',
    opening: '给我勇气的人：',
    content: `谢谢你。

是你的话，让我下定决心。
五年了，我不能再等下去了。

我写了一封回信，
很长很长的回信。

我写下了五年来的思念，
写下了没说出口的那句话，
写下了...我所有的心情。

明天，我就去寄信。

说不紧张是假的。
我甚至都不知道，
那个地址还对不对，
她还收不收得到。

但至少，我做了。
至少，我不会再因为"没有尝试"而后悔。

为我加油吧，朋友。`,
    closing: '既紧张又期待的人',
    choices: [
      {
        id: 'lc4co_a',
        label: '👏 加油！你一定可以的！',
        replyContent: `谢谢你！

你的鼓励，
是我最大的动力。

我已经能想象到，
她收到信时的样子。
是惊讶？是开心？还是...

不管是什么反应，
我都能接受。

因为我终于，
迈出了这一步。

——等我的好消息`,
        effects: { relation: 5, supportive: 3, positive: 2 },
        nextLetter: 'lc5_path_send'
      },
      {
        id: 'lc4co_b',
        label: '😊 不管结果如何，你已经赢了',
        replyContent: `"你已经赢了"...

听到这句话，
我忽然就不害怕了。

是啊，
比起五年前那个胆小的自己，
我已经进步太多了。

结果重要吗？
重要。
但更重要的是，
我终于有勇气面对了。

谢谢你，
让我看到了自己的成长。

——我已经赢了`,
        effects: { relation: 6, growth: 3, grateful: 2 },
        nextLetter: 'lc5_path_growth'
      },
      {
        id: 'lc4co_c',
        label: '⏳ 慢慢等回信吧。有些事情，急不得',
        replyContent: `我知道：

有些事情，急不得。

我已经等了五年，
不在乎再多等几天。

但等待的滋味，
真的不好受。

每一天都在盼着邮差来，
每一天又在害怕——
怕收到回信，更怕收不到。

这种忐忑...
大概就是喜欢一个人的感觉吧。

——忐忑地等待`,
        effects: { relation: 4, patient: 2, realistic: 1 },
        nextLetter: 'lc5_path_wait'
      }
    ],
    moodEffect: 6
  },
  {
    id: 'lc4_path_fear',
    round: 4,
    title: '第四封信 · 怯步',
    from: '雾城邮局 · 退缩的人',
    date: '三年前 · 秋天',
    opening: '朋友：',
    content: `你说得对，有些回忆放在心里就好。

我决定了，不回信了。

就让那段回忆，
永远停在最美好的时候。

这样，至少在我心里，
她永远是那个夏天的样子。
永远笑着，永远年轻。

不会被时间改变，
不会被生活磨平。

这样...也挺好的，对吧？

虽然偶尔还是会想她，
还是会遗憾，
还是会...如果当时勇敢一点。

但就这样吧。
就这样，也挺好的。`,
    closing: '决定放下的人',
    choices: [
      {
        id: 'lc4f_a',
        label: '🤔 你真的放下了吗？还是只是在逃避？',
        replyContent: `逃避...

也许你是对的。
也许我只是在逃避。

逃避面对可能的失望，
逃避面对物是人非，
逃避面对...她已经不记得我的可能。

但有时候，
逃避也是一种保护。
保护那些美好的回忆，
不被现实打碎。

这样...有错吗？

——也许是在逃避`,
        effects: { relation: 3, honest: 2, selfaware: 1 },
        nextLetter: 'lc5_path_escape'
      },
      {
        id: 'lc4f_b',
        label: '😊 嗯，每个人都有自己的选择。尊重你的决定',
        replyContent: `谢谢你的理解：

不是每个人，
都能理解这种选择。

他们会说我懦弱，
说我不够勇敢，
说我会后悔。

但我知道自己在做什么。
我知道什么对我来说是重要的。

有些美好，
就让它停在最美的时刻吧。

——谢谢你尊重我`,
        effects: { relation: 4, respected: 2, peaceful: 2 },
        nextLetter: 'lc5_path_peace'
      },
      {
        id: 'lc4f_c',
        label: '💭 如果...她也在等你的信呢？',
        replyContent: `她也在等...

你说的这个可能性，
我不是没想过。

但我不敢赌。
我怕输。

如果她在等，
那我没回信，
她会不会很失望？
会不会像我一样，
等了一年又一年？

...
也许，我该再想想。

——你让我动摇了`,
        effects: { relation: 4,动摇: 2, thoughtful: 2 },
        nextLetter: 'lc5_path_动摇'
      }
    ],
    moodEffect: 0
  },
  {
    id: 'lc4_path_mutual',
    round: 4,
    title: '第四封信 · 交换',
    from: '雾城邮局 · 好奇的人',
    date: '三年前 · 夏天',
    opening: '朋友：',
    content: `你说，让我跟着心走。

可我的心太乱了，
连我自己都不知道它想要什么。

对了，你还没告诉我你的故事呢。
你为什么会在雾城？
你也在找什么人吗？
你也有...没说出口的话吗？

如果你愿意说，我愿意听。
就像你听我的故事一样。

虽然我们是陌生人，
但有时候，陌生人反而更能说心里话。

你觉得呢？`,
    closing: '想了解你的人',
    choices: [
      {
        id: 'lc4m_a',
        label: '📖 我也有一个故事...关于一个等了五年的人',
        replyContent: `原来你也是：

我就知道，
我们之间有种特别的缘分。

你也在等一个人吗？
也是五年吗？

真巧。
不对，应该说...
真让人难过。

原来这座城市里，
有这么多在等待的人。
有这么多没说出口的话。

说说你的故事吧。
我想听听。

——同病相怜的人`,
        effects: { relation: 6, connection: 3, mutual: 2 },
        nextLetter: 'lc5_path_mutual'
      },
      {
        id: 'lc4m_b',
        label: '🤐 我的故事...还是不说了吧',
        replyContent: `没关系：

每个人都有自己的秘密。
不想说，就不说。

反正我们是陌生人，
你不用勉强自己。

只要你知道，
在这座雾城里，
你不是一个人就好。

有人和你一样，
在等待，在思念，
在和过去拉扯。

你不是一个人。

——你不是一个人`,
        effects: { relation: 4, warm: 2, comforting: 2 },
        nextLetter: 'lc5_path_company'
      },
      {
        id: 'lc4m_c',
        label: '✨ 我的故事不重要。重要的是你的故事，该有个结局了',
        replyContent: `我的故事，该有个结局了...

你说得对。
五年了，
是时候给这个故事画上句号了。

不管是圆满的句号，
还是遗憾的句号，
总得有个结束。

不能一直这样，
悬在半空中，
上不去，也下不来。

谢谢你，朋友。
是你让我下定决心。

——是时候了`,
        effects: { relation: 5, motivating: 3, decisive: 2 },
        nextLetter: 'lc5_path_ending'
      }
    ],
    moodEffect: 3
  },
  {
    id: 'lc4_path_tender',
    round: 4,
    title: '第四封信 · 胆小鬼',
    from: '雾城邮局 · 温柔的人',
    date: '三年前 · 春天',
    opening: '懂的人：',
    content: `你说我们是两个胆小鬼。
你说得对。

两个明明互相喜欢的人，
却谁都不敢先说出口。

她在等我说，
我在等她说。
等着等着，就错过了。

你说可笑不可笑？
两个大人了，
却比孩子还要胆小。

如果当时勇敢一点，
现在会不会不一样？
如果当时牵起她的手，
是不是就不会走散了？

这些问题，
我问了自己无数遍。
没有答案。
永远也不会有答案了。`,
    closing: '胆小鬼',
    choices: [
      {
        id: 'lc4t_a',
        label: '💪 现在勇敢也不晚。去找她吧。',
        replyContent: `现在勇敢也不晚...

你真的这么觉得吗？

五年了，
什么都可能变了。
她可能已经有了新的生活，
新的人...

但你说得对，
不试试怎么知道呢？

也许，
她也在等。

——也许真的不晚`,
        effects: { relation: 5, hopeful: 3, courage: 2 },
        nextLetter: 'lc5_path_go'
      },
      {
        id: 'lc4t_b',
        label: '💔 有些错过，就是一辈子。',
        replyContent: `一辈子...

听到这三个字，
心还是会痛。

一辈子那么长，
却连一句"我喜欢你"都来不及说。
一辈子那么短，
只够爱一个人。

如果真的是一辈子的错过，
那我也认了。

至少，
我遇见了她。
至少，
我们有过那样的夏天。

——一辈子只够爱一个人`,
        effects: { relation: 4, sad: 2, acceptance: 2 },
        nextLetter: 'lc5_path_accept'
      },
      {
        id: 'lc4t_c',
        label: '🤗 抱抱。也许你们都需要一点勇气',
        replyContent: `谢谢你的拥抱：

如果她也有你这样的朋友，
在她身边鼓励她，
那该多好。

也许她也在犹豫，
也在等一个契机。
就像我一样。

如果有一天，
我们能再遇见，
我一定会...
一定会说出口。

——一定会说出口`,
        effects: { relation: 5, warm: 3, determined: 2 },
        nextLetter: 'lc5_path_promise'
      }
    ],
    moodEffect: -1
  },
  {
    id: 'lc4_path_sad',
    round: 4,
    title: '第四封信 · 离别',
    from: '雾城邮局 · 难过的人',
    date: '三年前 · 秋天',
    opening: '朋友：',
    content: `你问后来呢。

后来...
火车开走了，
她也走了。

我站在站台上，
手里攥着那封信，
站了很久很久。

直到雾气漫上来，
直到再也看不到火车的影子，
直到...眼泪终于掉了下来。

我没有哭出声。
只是静静地流泪。
好像连眼泪，
都怕打破那份寂静。

那天的雾，
真的好大啊。
大到...我都看不清自己了。`,
    closing: '还在车站的人',
    choices: [
      {
        id: 'lc4s_a',
        label: '😢 抱抱你。我能感受到那种痛。',
        replyContent: `谢谢你：

你能感受到，
说明你也经历过吧。

经历过那种，
明明很痛，
却哭不出声的感觉。
经历过那种，
世界都空了的感觉。

原来，
不止我一个人这样。
原来，
这座雾城里，
都是有故事的人。

——谢谢你懂我`,
        effects: { relation: 6, empathetic: 3, connection: 2 },
        nextLetter: 'lc5_path_comfort'
      },
      {
        id: 'lc4s_b',
        label: '📜 那封信里写了什么？',
        replyContent: `你想知道信的内容吗？

三句话。
只有三句话。

"如果我说我喜欢你，你会怎么样？"
"我等了你一个夏天。"
"我走了。"

就这三句话。
每一个字，
我都记得清清楚楚。

你说，
她为什么要走呢？
为什么不早说呢？

——三句话，五年痛`,
        effects: { relation: 4, curious: 2, invested: 1 },
        nextLetter: 'lc5_path_letter'
      },
      {
        id: 'lc4s_c',
        label: '🌅 五年了。是时候往前走了。',
        replyContent: `往前走...

你说得对。
五年了，
是时候了。

但我做不到。
我真的做不到。

我试过。
真的试过。
但就是...
走不出去。

心就像被锁住了，
而钥匙，
被她带走了。

——钥匙被带走了`,
        effects: { relation: 4, stuck: 2, realistic: 1 },
        nextLetter: 'lc5_path_stuck'
      }
    ],
    moodEffect: -4
  },
  {
    id: 'lc4_path_healing',
    round: 4,
    title: '第四封信 · 释然',
    from: '雾城邮局 · 慢慢释怀的人',
    date: '两年前 · 夏天',
    opening: '治愈我的人：',
    content: `你说的对，美好的回忆也是一种永远。

我忽然就想通了。

她不在我身边，
但那些回忆在。
快乐在，心动在，
那些夏天的风，
那些夜晚的星，
都在。

这些都是我的，
是谁也拿不走的。

也许有一天，
我会再遇见她。
也许不会。

但那都不重要了。
重要的是，
那段时光是真实的，
那份喜欢是真实的，
那些美好...是真实的。

谢谢你，朋友。
是你的话，
让我和自己和解了。`,
    closing: '慢慢好起来的人',
    choices: [
      {
        id: 'lc4h_a',
        label: '😊 真好。你能想通，我也很开心。',
        replyContent: `我也很开心：

好久没有这么轻松了。
好像心里的一块大石头，
终于落地了。

五年了，
我终于可以笑着说那段往事了。
不再只有痛和遗憾，
还有温暖和感谢。

谢谢你，
真的谢谢你。

——轻松多了`,
        effects: { relation: 6, healing: 3, gratitude: 2 },
        nextLetter: 'lc5_path_healed'
      },
      {
        id: 'lc4h_b',
        label: '✨ 那...如果再遇见她，你会怎么做？',
        replyContent: `再遇见她...

我没想过这个问题。
但如果真的有那么一天，
我想，我会笑着对她说：

"好久不见。"
"这些年，你过得好吗？"

就像一个老朋友一样。
不追问过去，
不妄想未来，
只是...
静静地打个招呼。

你觉得呢？

——好久不见`,
        effects: { relation: 5, peaceful: 2, mature: 2 },
        nextLetter: 'lc5_path_mature'
      },
      {
        id: 'lc4h_c',
        label: '💌 那你还会给她写信吗？',
        replyContent: `写信...

也许吧。
但不是现在。

等我准备好了，
等我真的放下了，
等我可以坦然面对的时候，
也许我会写一封。

不是为了挽回什么，
只是想告诉她——
"谢谢你，出现在我的生命里。"

就够了。

——谢谢你出现过`,
        effects: { relation: 5, grateful: 2, peaceful: 2 },
        nextLetter: 'lc5_path_grateful'
      }
    ],
    moodEffect: 8
  },
  {
    id: 'lc4_path_listener',
    round: 4,
    title: '第四封信 · 陪伴',
    from: '雾城邮局 · 自言自语的人',
    date: '两年前 · 冬天',
    opening: '（没有称呼）',
    content: `你还在吗？

我知道你一直在看。
虽然你不回信，
但我知道，
你在那里。

这种感觉很奇怪，
明明是陌生人，
却好像认识了很久。

也许是因为，
你愿意听我说这些吧。
愿意听一个陌生人的心事，
不评判，不催促，
只是...静静地听着。

谢谢你。
虽然你不说话，
但我知道，
你在那里。

这就够了。

今天想告诉你，
我好像...慢慢好起来了。
没有那么痛了，
也没有那么频繁地想起她了。

不是忘记了，
而是...
把她放在了心里一个温暖的角落。
不再是伤口，
而是...
一份温暖的回忆。`,
    closing: '谢谢你做我的听众',
    choices: [
      {
        id: 'lc4li_a',
        label: '💌 终于回信：你好，陌生人。很高兴能陪你走这一程。',
        replyContent: `你回信了！

我...我不知道该说什么。
就是...很开心。

谢谢你，
愿意做我的听众。
愿意陪我走这一程。

你知道吗？
这些信，
不止是写给你的，
也是写给我自己的。

通过写这些信，
我终于理清了自己的心情。
终于...
可以和过去好好告别了。

——谢谢你`,
        effects: { relation: 7, connection: 4, healing: 3 },
        nextLetter: 'lc5_path_together'
      },
      {
        id: 'lc4li_b',
        label: '👋 继续沉默，但心里说了声"加油"',
        replyContent: null,
        effects: { relation: 2, silent_support: 3, warm: 1 },
        nextLetter: 'lc5_path_silent_end'
      }
    ],
    moodEffect: 5
  }
]

export const letterEndings = [
  {
    id: 'ending_reunion',
    type: 'best',
    title: '✉️ 结局 · 雾中的重逢',
    character: '林薇',
    characterMood: '欣喜',
    content: `第五封信来的时候，信封上写着熟悉的字迹。

你心跳加速，拆开信——

"亲爱的朋友：

谢谢你一直以来的陪伴和鼓励。是你的信，给了我勇气。

我终于决定，去找她了。

站在她楼下的时候，我犹豫了很久。
五年了，她还记得我吗？她会愿意见我吗？

就在我准备转身离开的时候，门开了。

是她。

她站在门口，手里拿着一封信。
那封信...和我寄出去的那封，一模一样的信封。

"你..."她的声音有些颤抖，"你怎么来了？"

"我...我收到了一封信。"我说，"所以我来了。"

她笑了，眼泪掉了下来：
"我也收到了一封。来自一个陌生人。是那封信，给了我勇气，把这封写了五年的信，寄了出去。"

我愣住了。

然后，我也笑了。

原来，
我们都是那个"陌生人"。
原来，
我们都在给对方写信，却不知道彼此的身份。
原来，
雾城的邮局，从来没有寄错过信。

雾气慢慢散去，阳光洒了下来。
五年的等待，五年的思念，
都化作了一个拥抱。

"好久不见。"她说。
"好久不见。"我说。

——谢谢你，雾城的陌生人。
   也谢谢你，愿意相信一封来自雾中的信。`,
    effects: { mood: 20, endingWeight: { sincere: 3, romantic: 3, courageous: 2 } }
  },
  {
    id: 'ending_peace',
    type: 'good',
    title: '✉️ 结局 · 各自安好',
    character: '林薇',
    characterMood: '平静',
    content: `第五封信是最后一封。

"朋友：

谢谢你陪我走了这么久。
谢谢你听我说那些故事。
谢谢你...让我和过去和解了。

我决定了，不找她了。
不是放下了，
而是...把她放在心里最合适的位置。

那些回忆是真的，
那些心动是真的，
那些美好...也是真的。
这就够了。

我也要开始新的生活了。
去新的城市，
认识新的人，
看看不一样的风景。

也许有一天，
我们会在世界的某个角落遇见。
那时候，
我会笑着对她说一句：
"好久不见。"

你也一样。
不管你在等待谁，
不管你有什么故事，
都希望你能...
好好的。

雾会散的，
天会晴的，
一切都会好起来的。

再见了，朋友。
愿你珍重。

——雾城的陌生人",

你把信收好，望向窗外。
雾气好像淡了一些。

是啊，
一切都会好起来的。`,
    effects: { mood: 12, endingWeight: { peaceful: 2, mature: 2, nostalgic: 1 } }
  },
  {
    id: 'ending_cold',
    type: 'normal',
    title: '✉️ 结局 · 雾中消散',
    character: '林薇',
    characterMood: '平淡',
    content: `之后，再也没有信来了。

你把那两封信收好，放在抽屉的最底层。
就像很多事情一样，
慢慢被遗忘在时光里。

雾城的雾还是那么浓，
每天来来往往的人，
都有自己的故事，
自己的心事。

你偶尔会想起那个写信的人。
ta现在怎么样了？
有没有找到想找的人？
有没有说出那句没说出口的话？

没有人知道答案。

也许，
这就是大多数故事的结局——
没有答案，
没有结局，
就这样消散在雾里。

但你知道，
在某个你不知道的地方，
有一个人，
曾经把心事写进信里，
寄给了一个陌生人。

而你，
就是那个陌生人。

——雾里的故事，就让它留在雾里吧。`,
    effects: { mood: 2, endingWeight: { reserved: 2, indifferent: 1 } }
  },
  {
    id: 'ending_together',
    type: 'best',
    title: '✉️ 结局 · 信的两端',
    character: '林薇',
    characterMood: '感动',
    content: `最后一封信里，ta说要告诉你一个秘密。

"其实，我早就知道你是谁了。

从第二封信开始，
从你写下那些话开始，
我就知道，是你。

因为只有你，会说那样的话。
只有你，会用那样的语气。
只有你...能让我心跳加速。

我一直在等，
等你愿意说出口的那一天。
等你...认出我的那一天。

谢谢你，愿意陪我演这场戏。
谢谢你，愿意给我回信。
谢谢你...愿意等我。

现在，轮到我了。

我在雾城火车站。
五年前，我在这里离开。
五年后，我在这里等你。

如果你愿意，
就来见我吧。

——一直在等你的人"

你握着信，手在发抖。

五年了。
原来你不是一个人在等。
原来，ta也在等。

雾气弥漫的站台上，
有一个熟悉的身影。
ta转过身，对你笑了。

和五年前一样。
和你记忆中一样。

"你来了。"ta说。
"我来了。"你说。

——有些信，注定会送到对的人手上。
   有些人，注定会再次相遇。`,
    effects: { mood: 25, endingWeight: { romantic: 4, destined: 3, sincere: 2 } }
  },
  {
    id: 'ending_growth',
    type: 'good',
    title: '✉️ 结局 · 成长的信',
    character: '林薇',
    characterMood: '释然',
    content: `第五封信里，ta说自己长大了。

"朋友：

给你写这五封信，
就像重新活了一遍那五年。

从最开始的痛，
到后来的遗憾，
再到现在的释然...

谢谢你陪我走过来。
谢谢你的每一封回信，
每一句话，
都给了我力量。

我想通了很多事情。
有些人，注定只能陪你走一段路。
但那段路的意义，
不会因为结束而消失。

她教会了我什么是喜欢，
什么是心动，
什么是...想要和一个人永远在一起的心情。

这些，都是很珍贵的东西。

所以，
我不后悔遇见她，
也不后悔错过她。
因为我知道，
因为她，我变成了更好的人。

你也是，
不管你经历了什么，
都要相信——
那些经历，都会让你变成更好的人。

再见了，朋友。
愿你的故事，也有一个温暖的结局。

——变成了更好的人的陌生人"

你把信放在胸口。
是啊，
我们都在变成更好的人。`,
    effects: { mood: 15, endingWeight: { growth: 3, warm: 2, mature: 2 } }
  },
  {
    id: 'ending_silent',
    type: 'normal',
    title: '✉️ 结局 · 沉默的陪伴',
    character: '林薇',
    characterMood: '温柔',
    content: `再也没有信来了。

但你知道，
ta已经好起来了。
ta已经可以面对过去，
面对那段感情了。

而你，
作为一个沉默的听众，
陪ta走了这一程。

这就够了。

不是所有故事都需要结局。
不是所有相遇都需要重逢。
有时候，
默默地陪伴，
也是一种温暖。

你把那些信都收好，
放在一个精致的盒子里。
就像把一段时光，
小心地珍藏起来。

窗外的雾散了又来，
来了又散。
日子一天天过去。

偶尔你会想起那个写信的人。
ta现在过得好吗？
有没有找到自己的幸福？

你不知道答案。
但你真心希望，
ta过得好。

——谢谢你，陌生人。
   让我成为你故事的一部分。`,
    effects: { mood: 8, endingWeight: { gentle: 2, warm: 1, quiet: 2 } }
  }
]

export const letterEndingRoutes = {
  lc5_path_go: 'ending_reunion',
  lc5_path_send: 'ending_reunion',
  lc5_path_determined: 'ending_reunion',
  lc5_path_growth: 'ending_growth',
  lc5_path_healed: 'ending_peace',
  lc5_path_mature: 'ending_peace',
  lc5_path_grateful: 'ending_peace',
  lc5_path_together: 'ending_together',
  lc5_path_mutual: 'ending_together',
  lc5_path_hope: 'ending_reunion',
  lc5_path_fate: 'ending_together',
  lc5_path_search: 'ending_reunion',
  lc5_path_comfort: 'ending_together',
  ending_cold: 'ending_cold',
  lc5_path_silent_end: 'ending_silent',
  lc5_path_peace: 'ending_peace',
  lc5_path_accept: 'ending_peace',
  lc5_path_forward: 'ending_growth',
  lc5_path_company: 'ending_silent',
  lc5_path_ending: 'ending_growth',
  lc5_path_escape: 'ending_silent',
  lc5_path_动摇: 'ending_reunion',
  lc5_path_promise: 'ending_reunion',
  lc5_path_letter: 'ending_together',
  lc5_path_wait: 'ending_peace',
  lc5_path_hesitate: 'ending_growth',
  lc5_path_stuck: 'ending_silent'
}

export const letterCharacters = {
  '林薇': {
    name: '林薇',
    description: '雾城邮局的神秘写信人，五年来一直执着于那段未完成的感情',
    traits: ['温柔', '敏感', '执着', '有点胆小']
  }
}

export const getLetterById = (letterId) => {
  return letterChapters.find(l => l.id === letterId)
}

export const getLetterEndingById = (endingId) => {
  return letterEndings.find(e => e.id === endingId)
}

export const getNextLetterId = (currentLetterId, choiceId) => {
  const letter = getLetterById(currentLetterId)
  if (!letter || !letter.choices) return null
  
  const choice = letter.choices.find(c => c.id === choiceId)
  return choice ? choice.nextLetter : null
}

export const getLetterEnding = (pathId) => {
  const endingId = letterEndingRoutes[pathId]
  return endingId ? getLetterEndingById(endingId) : null
}
