/**
 * TextSim-Engine 开源示例数据模块 (Demo Data)
 * 开发者只需修改此文件中的 JSON 配置，即可零代码生成自己的文字沙盘游戏。
 */
window.WORLD_DATA = {
  meta: {
    title: "牛马修仙传 · 极简开源示例",
    startAge: 18,
    maxSuspicion: 100
  },

  // 1. 出身模块 (补偿点数机制：寒门多点，富贵少点但带资源)
  origins: [
    { id: "poor", name: "寒门散修", desc: "家徒四壁，但根骨清奇（额外补偿 +15 天赋点）", bonusPoints: 15, initStats: { wit: 15, martial: 15, rep: 5, wealth: 10, suspicion: 0 } },
    { id: "rich", name: "世家庶子", desc: "自带百两纹银与名望，但饱受家族猜忌", bonusPoints: 5, initStats: { wit: 10, martial: 10, rep: 30, wealth: 120, suspicion: 25 } }
  ],

  // 2. 地图节点与移动成本 (沙盘移动作为真实决策成本)
  map: {
    "village": { name: "新手牛马村", desc: "灵气稀薄的偏远小村，适合闭门苦读。", cost: 0, adj: ["city", "sect"] },
    "city":    { name: "天枢王城",   desc: "繁华喧嚣的州府，商贾云集，亦是赶考之地。", cost: 20, adj: ["village", "border"] },
    "sect":    { name: "摸鱼剑派",   desc: "江湖名门，习武之人的圣地。", cost: 15, adj: ["village", "border"] },
    "border":  { name: "北境荒原",   desc: "危机四伏的战场，九死一生但功勋极高。", cost: 35, adj: ["city", "sect"] }
  },

  // 3. 四大前程路线与里程碑 (部分里程碑强制要求人物身处特定地点)
  routes: [
    { id: "study",   name: "苦读修文", stat: "wit",     gain: 12, desc: "研读心法，提升才学", milestone: { req: 50, loc: "city",   title: "金榜题名", rewardRep: 40 } },
    { id: "martial", name: "宗门演武", stat: "martial", gain: 12, desc: "锤炼体魄，提升武名", milestone: { req: 50, loc: "sect",   title: "剑道驁首", rewardRep: 40 } },
    { id: "trade",   name: "跑商倒爷", stat: "wealth",  gain: 35, desc: "低买高卖，积累盘缠", milestone: { req: 150, loc: "city",  title: "富甲一方", rewardRep: 30 } },
    { id: "scheme",  name: "钻营人脉", stat: "rep",     gain: 10, desc: "结交权贵（增加猜忌）", suspicionGain: 12, milestone: { req: 60, loc: "border", title: "裂土封侯", rewardRep: 60 } }
  ],

  // 4. 随机事件库 (支持条件触发与地点绑定)
  events: [
    {
      id: "ev_brick",
      text: "你在路边草丛里踢到一块散发着微光的神秘板砖，上面刻着『拍人必晕』四个大字。",
      choices: [
        { label: "当废品卖给铁匠", effects: { wealth: 25, wit: 2 }, log: "铁匠觉得这砖头趁手，给了你 25 两银子。" },
        { label: "揣进怀里防身",   effects: { martial: 12, suspicion: 5 }, log: "你学会了板砖暗算流，武名提升，但街坊看你的眼神不太对劲。" }
      ]
    },
    {
      id: "ev_exam",
      loc: "city",
      text: "【王城专属】天枢王城正在举办三年一度的策论大比，考官似在暗中收受贿赂。",
      choices: [
        { label: "凭真才实学硬考", effects: { wit: 15, rep: 10 }, log: "你奋笔疾书，文章传遍王城！" },
        { label: "塞 30 两银子走后门", reqWealth: 30, effects: { wealth: -30, rep: 25, suspicion: 15 }, log: "考官眉开眼笑，你名声大噪，但暗中惹人非议。" }
      ]
    },
    {
      id: "ev_sect_boss",
      loc: "sect",
      text: "【剑派专属】掌门师尊深夜叫你去后山，问你愿不愿意替他背一口黑锅。",
      choices: [
        { label: "含泪接锅，换取秘籍", effects: { martial: 20, suspicion: 20 }, log: "你背下了偷吃灵鸡的黑锅，掌门偷偷塞给你一本剑谱。" },
        { label: "义正言辞拒绝",       effects: { rep: 15, wealth: -10 }, log: "你守住了底线，但被扣了半年俸禄。" }
      ]
    },
    {
      id: "ev_war",
      loc: "border",
      text: "【北境专属】荒原妖兽夜袭大营，先锋官吓得腿软，军中无人敢应战！",
      choices: [
        { label: "提刀跃马，独自迎敌", effects: { martial: 25, rep: 30, suspicion: 10 }, log: "你一战成名，功高震主！" },
        { label: "趁乱搜刮军需跑路",   effects: { wealth: 60, rep: -15, suspicion: 25 }, log: "你发了一笔横财，但成了通缉榜上的熟人。" }
      ]
    }
  ],

  // 5. 成就与墓志铭计分规则 (铜 5 / 银 15 / 金 40 / 玉 100)
  achievements: [
    { id: "ach_survive", tier: "铜", points: 5,   name: "初涉江湖", cond: s => s.age >= 22, desc: "安全活过 22 岁" },
    { id: "ach_rich",    tier: "银", points: 15,  name: "小有资财", cond: s => s.wealth >= 100, desc: "银两积蓄突破 100 两" },
    { id: "ach_master",  tier: "金", points: 40,  name: "名动天下", cond: s => s.milestones.length >= 2, desc: "达成至少 2 项前程里程碑" },
    { id: "ach_emperor", tier: "玉", points: 100, name: "问鼎苍穹", cond: s => s.rep >= 120 && s.martial >= 60, desc: "声望与武名双绝，威震天下" }
  ]
};
