/**
 * TextSim-Engine Core (v1.0.0)
 * 零依赖、数据驱动的文字模拟与历史沙盘微引擎
 * Author: Joestar (https://joestar.cc.cd/)
 * Showcase: 大衍天下 (https://dayantx.online/)
 * License: MIT
 */
class TextSimEngine {
  constructor(worldData) {
    this.data = worldData;
    this.state = null;
  }

  // 初始化开局
  initGame(originId = "poor") {
    const origin = this.data.origins.find(o => o.id === originId) || this.data.origins[0];
    this.state = {
      age: this.data.meta.startAge,
      alive: true,
      deathReason: "",
      origin: origin.name,
      location: Object.keys(this.data.map)[0],
      wit: origin.initStats.wit + origin.bonusPoints,
      martial: origin.initStats.martial,
      rep: origin.initStats.rep,
      wealth: origin.initStats.wealth,
      suspicion: origin.initStats.suspicion,
      milestones: [],
      logs: [`【开局】18岁，你以「${origin.name}」之身踏入世间，初始身处【${this.data.map[Object.keys(this.data.map)[0]].name}】。`]
    };
    this.saveToLocal();
    return this.state;
  }

  // 沙盘地图移动 (扣除路费并推进 1 年)
  travel(targetLocId) {
    if (!this.state.alive) return;
    const curNode = this.data.map[this.state.location];
    const targetNode = this.data.map[targetLocId];
    if (!targetNode || !curNode.adj.includes(targetLocId)) {
      return { ok: false, msg: "道路不通，无法直接前往该州府！" };
    }
    if (this.state.wealth < targetNode.cost) {
      return { ok: false, msg: `盘缠不足！前往【${targetNode.name}】需要 ${targetNode.cost} 两银子。` };
    }
    this.state.wealth -= targetNode.cost;
    this.state.location = targetLocId;
    this.log(`【远行】耗费 ${targetNode.cost} 两盘缠，历经跋涉抵达【${targetNode.name}】。`);
    this.advanceYear();
    return { ok: true };
  }

  // 执行年度行动路线
  takeAction(routeId) {
    if (!this.state.alive) return;
    const r = this.data.routes.find(x => x.id === routeId);
    if (!r) return;

    this.state[r.stat] += r.gain;
    if (r.suspicionGain) this.state.suspicion += r.suspicionGain;
    this.log(`【修行】潜心「${r.name}」，${this.statLabel(r.stat)} +${r.gain}` + (r.suspicionGain ? `，猜忌度 +${r.suspicionGain}。` : "。"));

    this.checkMilestones();
    this.advanceYear();
  }

  // 检定前程里程碑 (强制验证当前所在州府地图)
  checkMilestones() {
    for (const r of this.data.routes) {
      const ms = r.milestone;
      if (!ms || this.state.milestones.includes(ms.title)) continue;
      if (this.state[r.stat] >= ms.req) {
        if (this.state.location === ms.loc) {
          this.state.milestones.push(ms.title);
          this.state.rep += ms.rewardRep;
          this.log(`🎉【里程碑达成】你在【${this.data.map[ms.loc].name}】成功触发前程突破——「${ms.title}」！名望暴涨 +${ms.rewardRep}！`);
        } else {
          const reqLocName = this.data.map[ms.loc].name;
          this.log(`💡【机缘提示】你的${this.statLabel(r.stat)}已达标，但需亲自前往【${reqLocName}】方可突破「${ms.title}」！`);
        }
      }
    }
  }

  // 推进年份与检定生死
  advanceYear() {
    this.state.age += 1;

    // 检定死亡结局
    if (this.state.suspicion >= this.data.meta.maxSuspicion) {
      this.endGame("锋芒太露，猜忌度爆表，被神秘大能连夜清算陨落。");
      return;
    }
    if (this.state.age >= 30) {
      this.endGame("岁月流转，你走完了这段波澜壮阔的修仙打工生涯，安然坐化。");
      return;
    }

    // 触发当前地点的随机事件
    const pool = this.data.events.filter(e => !e.loc || e.loc === this.state.location);
    if (pool.length > 0 && Math.random() < 0.75) {
      this.state.activeEvent = pool[Math.floor(Math.random() * pool.length)];
    } else {
      this.state.activeEvent = null;
    }
    this.saveToLocal();
  }

  // 处理事件抉择
  resolveEvent(choiceIdx) {
    const ev = this.state.activeEvent;
    if (!ev) return;
    const ch = ev.choices[choiceIdx];
    if (ch.reqWealth && this.state.wealth < ch.reqWealth) {
      alert(`银两不足 ${ch.reqWealth} 两！`);
      return;
    }
    for (const [k, v] of Object.entries(ch.effects)) {
      this.state[k] = Math.max(0, (this.state[k] || 0) + v);
    }
    this.log(`【际遇】${ch.log}`);
    this.state.activeEvent = null;
    this.checkMilestones();
    if (this.state.suspicion >= this.data.meta.maxSuspicion) {
      this.endGame("因际遇抉择引火烧身，猜忌度达到顶峰，不幸陨落。");
    }
    this.saveToLocal();
  }

  // 结局与墓志铭生成
  endGame(reason) {
    this.state.alive = false;
    this.state.activeEvent = null;
    this.state.deathReason = reason;
    this.log(`⚰️【终局】享年 ${this.state.age} 岁：${reason}`);
    this.saveToLocal();
  }

  generateEpitaph() {
    const unlocked = this.data.achievements.filter(a => a.cond(this.state));
    const totalScore = unlocked.reduce((sum, a) => sum + a.points, 0);
    return {
      age: this.state.age,
      origin: this.state.origin,
      reason: this.state.deathReason,
      milestones: this.state.milestones,
      unlocked,
      totalScore
    };
  }

  statLabel(k) {
    return { wit: "才学", martial: "武名", rep: "乡望", wealth: "银两", suspicion: "猜忌度" }[k] || k;
  }

  log(msg) { this.state.logs.unshift(`[${this.state.age}岁] ${msg}`); }
  saveToLocal() { localStorage.setItem("TEXTSIM_SAVE", JSON.stringify(this.state)); }
  loadFromLocal() {
    const raw = localStorage.getItem("TEXTSIM_SAVE");
    if (raw) { this.state = JSON.parse(raw); return true; }
    return false;
  }
}
window.TextSimEngine = TextSimEngine;
