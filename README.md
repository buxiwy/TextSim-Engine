# 📜 TextSim-Engine

> **A zero-dependency, data-driven text simulation & sandbox RPG micro-engine in Vanilla JS.**
> **零框架、零构建、纯数据驱动的文字模拟与历史沙盘微引擎。**

[![License: MIT](https://img.shields.io/badge/License-MIT-147A58.svg)](https://opensource.org/licenses/MIT)
[![Showcase](https://img.shields.io/badge/Showcase-大衍天下-3E3223)](https://dayantx.online/)
[![Author](https://img.shields.io/badge/Author-Joestar-6B8E4E)](https://joestar.cc.cd/)

---

## ✨ 为什么做这个引擎？ (Why TextSim-Engine?)

大多数开源的文字重开类游戏把「文字剧本」和「状态逻辑」死死耦合在一起。
**TextSim-Engine** 把底层沙盘规则与世界观数据彻底解耦：

- **规则与内容分离**：`src/engine.js` 只负责回合推进、条件检定、移动损耗与结局计分。
  改 `data/demo-world.js` 里的配置即可零代码生成你自己的修仙、历史或跑团模拟器。
- **地图参与决策（Graph Map Cost）**：部分前程里程碑**强制要求人物身处特定州府节点**，
  沙盘移动需要消耗真实盘缠与回合——地图不是背景板，是决策成本。
- **出身补偿与猜忌度平衡**：寒门开局多天赋点，世家开局多银两人脉但自带高猜忌；
  内置铜（5 分）/ 银（15 分）/ 金（40 分）/ 玉（100 分）墓志铭结算系统。
- **零依赖即开即玩**：纯原生 HTML/CSS/JS，双击 `index.html` 即可运行，自带 `LocalStorage` 自动存档。

---

## 🎮 官方完整版商业级案例 (Official Showcase)

本引擎提取自独立文字沙盘游戏 **《大衍天下 · 元末乱世文字模拟》**：

- 👉 在线试玩完整版：<https://dayantx.online/>
- 👉 作者个人作品集：<https://joestar.cc.cd/>

> ⚠️ 本仓库**不包含**《大衍天下》的任何游戏数据、地图或数值——仓库里只有一份
> 另写的搞笑演示剧本《牛马修仙传》。商业版与开源版内容完全隔离。

---

## 🚀 快速开始 (Quick Start)

```bash
git clone https://github.com/buxiwy/TextSim-Engine.git
cd TextSim-Engine
```

然后**直接双击 `index.html`**，用浏览器打开即可游玩内置剧本。不需要 `npm install`，
不需要任何构建步骤——本项目没有 `package.json`，这是刻意的。

想换成自己的世界？打开 `data/demo-world.js` 改配置，刷新页面即可。

---

## 📂 目录结构 (Structure)

```text
TextSim-Engine/
├── index.html          # 奶油复古绿配色的沙盘 Playground（界面 + 渲染）
├── src/
│   └── engine.js       # 核心状态机：地图移动、里程碑、事件、结局与墓志铭结算
├── data/
│   └── demo-world.js   # 【改这里就行】世界观、地图、事件、成就配置
├── README.md
└── LICENSE
```

### 数据文件怎么改？(How to write your own world)

`data/demo-world.js` 挂了一个全局 `window.WORLD_DATA`，五个字段：

| 字段 | 说明 |
|---|---|
| `meta` | 起始年龄、猜忌度上限 |
| `origins[]` | 出身。`bonusPoints` 会**直接加到 `wit`** 上，`initStats` 决定其余初始值 |
| `map{}` | 沙盘节点。`cost` 是路费（两），`adj` 必须**双向互指**，否则走不通 |
| `routes[]` | 四条前程。`milestone.loc` 是强制地点——属性到了也得人在这儿才算达成 |
| `events[]` | 随机事件。`loc` 可选；`choices[].reqWealth` 可选，做资格门槛 |
| `achievements[]` | `cond` 是个**函数**，返回 `true` 即解锁 |

> **注意**：`achievements[].cond` 是 JS 箭头函数而不是纯数据，
> 所以 `demo-world.js` 不是合法 JSON。若你需要纯 JSON 配置，
> 把 `cond` 改成 `{ field, op, value }` 之类，再在引擎里解释即可。

---

## 🧪 已知取舍 (Known trade-offs)

这些是**有意为之**的简化，不是 bug：

- **12 年即终局**（18 → 30 岁）。本引擎是微引擎，故意压缩生命周期。
- **属性达标后会年年提示**「需亲往某地」。提示会重复出现，真实项目里应该加冷却。
- **存档是明文 JSON**。仅供单机，玩家自己就能改。线上产品请勿照抄。
- **`effects` 直接加总**，`Math.max(0, ...)` 只防负数，不做上限封顶。
- **移动不触发里程碑检定**，只有 `takeAction` 会触发。所以刚抵达州府不会立刻弹出突破提示。

---

## 📄 License

MIT © Joestar — 详见 [LICENSE](LICENSE)。

展示案例《大衍天下》的商标与内容归原作者所有，本引擎代码以 MIT 授权开源。