// ============================================================
// MÓDULO: APP — Solo Leveling v3.0
// Lógica principal. Para agregar features, editar aquí.
// ============================================================

const KEY   = 'sl_v3';
const TODAY = new Date().toISOString().split('T')[0];

const DEFAULT_STATE = {
  coins: 0, totalXP: 0, racha: 0,
  stats: { F: 0, M: 0, E: 0, V: 0, D: 0 },
  mis: {}, zona: {}, dias: {},
  rankH: 0, starsH: 0, rankT: 0, starsT: 0, dc: 0,
  stacks: { shield: 0, steel: 0, iron: 0, clarity: 0, shadow: 0, warrior: 0 },
  alterActive: null,
  lastVisit: TODAY,
};

let ST = JSON.parse(JSON.stringify(DEFAULT_STATE));
let calMode = 'mark';
let calY = new Date().getFullYear();
let calM = new Date().getMonth();

// ---- STATE ----
function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) ST = Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), JSON.parse(saved));
  } catch(e) {}
  if (!ST.mis)    ST.mis    = {};
  if (!ST.zona)   ST.zona   = {};
  if (!ST.dias)   ST.dias   = {};
  if (!ST.stacks) ST.stacks = { shield:0, steel:0, iron:0, clarity:0, shadow:0, warrior:0 };
  if (!ST.mis[TODAY])  ST.mis[TODAY]  = {};
  if (!ST.zona[TODAY]) ST.zona[TODAY] = {};
  checkInactivity();
}

function saveState() {
  try { ST.lastVisit = TODAY; localStorage.setItem(KEY, JSON.stringify(ST)); } catch(e) {}
}

function checkInactivity() {
  if (ST.lastVisit && ST.lastVisit !== TODAY) {
    const diff = Math.floor((new Date(TODAY) - new Date(ST.lastVisit)) / 864e5);
    if (diff >= 7) showToast('⚠️ ' + diff + ' días sin entrar. ¡El sistema te espera!', '#ff6b35');
  }
}

// ---- TOAST ----
function showToast(msg, col) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = col || 'var(--c2)';
  t.style.color = col || 'var(--c1)';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- HELPERS ----
function starsHTML(n, max = 3) {
  let h = '';
  for (let i = 0; i < max; i++) h += i < n ? '★' : '☆';
  return h;
}
function pct(a, b) { return Math.min(100, Math.round(a / b * 100)); }
function xpHoy() {
  let x = 0;
  Object.values(MISIONES).flat().forEach(m => { if (ST.mis[TODAY]?.[m.id]) x += m.xp; });
  return x;
}
function bonusLabel(r) {
  if (r >= 30) return 'Despertar de poder ✦';
  if (r >= 7)  return 'Estado de flujo ✦';
  if (r >= 3)  return 'Bonus XP activo ✦';
  return (3 - r) + ' días para primer bonus';
}
function getWeekKey() {
  const d = new Date(TODAY);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// ---- NAV ----
function nav(id, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
  document.getElementById('sec-' + id).classList.add('on');
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

// ============================================================
// MÓDULO: INICIO (Dashboard)
// ============================================================
function renderInicio() {
  const rh = RANGOS_HABITOS[Math.min(ST.rankH, RANGOS_HABITOS.length - 1)];
  const rt = RANGOS_TECNICO[Math.min(ST.rankT, RANGOS_TECNICO.length - 1)];

  document.getElementById('dRH').textContent  = rh.emoji + ' ' + rh.name;
  document.getElementById('dSH').textContent  = starsHTML(ST.starsH);
  document.getElementById('dSubH').textContent = ST.dc + '/20 días';
  document.getElementById('dBH').style.width   = pct(ST.dc, 20) + '%';

  document.getElementById('dRT').textContent  = rt.emoji + ' ' + rt.name;
  document.getElementById('dST').textContent  = starsHTML(ST.starsT);
  document.getElementById('dBT').style.width  = pct(ST.rankT, 6) + '%';

  const xp = xpHoy();
  document.getElementById('dXH').textContent = xp;
  document.getElementById('dBX').style.width = pct(xp, 189) + '%';

  document.getElementById('dRC').textContent  = ST.racha + ' días';
  document.getElementById('dBS').textContent  = bonusLabel(ST.racha);
  document.getElementById('dBR').style.width  = pct(ST.racha, 30) + '%';

  document.getElementById('dEst').textContent  = rh.emoji + ' ' + rh.name;
  document.getElementById('dEst').style.color  = rh.color;
  document.getElementById('dEstS').textContent = rh.subs[Math.min(ST.starsH, 2)];

  ['F','M','E','V','D'].forEach(k => document.getElementById('s' + k).textContent = ST.stats[k] || 0);

  // HUD
  document.getElementById('hC').textContent = ST.coins;
  document.getElementById('hX').textContent = ST.totalXP;
  document.getElementById('hR').textContent = ST.racha;

  // Bonus streaks
  ['b3','b7','b30'].forEach((id, i) => {
    document.getElementById(id).style.display = ST.racha >= [3,7,30][i] ? 'inline' : 'none';
  });

  renderStacks();
}

// ============================================================
// MÓDULO: STACKS
// ============================================================
function renderStacks() {
  const el = document.getElementById('stackGrid');
  el.innerHTML = '';
  STACKS.forEach(sk => {
    const lvl = ST.stacks[sk.id] || 0;
    const d = document.createElement('div');
    d.className = 'stack-item' + (lvl > 0 ? ' active' : '');
    d.title = sk.name + ' — ' + sk.desc;
    d.innerHTML = STACK_SVGS[sk.id] +
      `<div class="stack-name">${sk.name}</div>` +
      `<div class="stack-lvl">${lvl > 0 ? 'Nv.' + lvl : '—'}</div>` +
      `<div class="stack-bar"><div class="stack-bar-fill" style="width:${pct(lvl, sk.max)}%;background:${sk.color}"></div></div>`;
    el.appendChild(d);
  });
}

function updateStacks() {
  const m = ST.mis[TODAY] || {};
  if (m.e1 && m.e3) ST.stacks.shield  = Math.min(5, (ST.stacks.shield  || 0) + 1);
  if (m.s1)         ST.stacks.steel   = Math.min(5, (ST.stacks.steel   || 0) + 1);
  if (m.f4 && m.f5) ST.stacks.iron    = Math.min(5, (ST.stacks.iron    || 0) + 1);
  if (m.e4 && m.e3) ST.stacks.clarity = Math.min(5, (ST.stacks.clarity || 0) + 1);
  const all = Object.values(MISIONES).flat();
  if (all.every(ms => m[ms.id])) ST.stacks.warrior = Math.min(5, (ST.stacks.warrior || 0) + 1);
  renderStacks();
}

// ============================================================
// MÓDULO: MISIONES
// ============================================================
function renderMisiones() {
  const wk = getWeekKey();
  document.getElementById('secretCard').innerHTML = buildSecretCard(wk);

  function buildList(list, elId) {
    const el = document.getElementById(elId);
    el.innerHTML = '';
    list.forEach(m => {
      const done = !!(ST.mis[TODAY]?.[m.id]);
      const tip  = m.tip;
      const d = document.createElement('div');
      d.className = 'mrow';
      d.innerHTML =
        `<div class="mchk${done ? ' done' : ''}" onclick="toggleMision('${m.id}',${m.xp},'${m.st}',${m.coins || 0})">${done ? '✓' : ''}</div>` +
        `<span class="mtxt${done ? ' done' : ''}">${m.t}</span>` +
        `<span class="mstat">${m.st}</span>` +
        `<span class="mxp">+${m.xp}${m.coins ? ' +' + m.coins + 'c' : ''}</span>` +
        (tip ? `<div class="tooltip"><div class="tooltip-title">${tip.title}</div>${tip.desc}</div>` : '');
      el.appendChild(d);
    });
  }
  buildList(MISIONES.E, 'mE');
  buildList(MISIONES.F, 'mF');
  buildList(MISIONES.S, 'mS');
}

function buildSecretCard(wk) {
  if (!ST.mis[wk]) ST.mis[wk] = {};
  if (ST.mis[wk]._secretIdx === undefined)
    ST.mis[wk]._secretIdx = Math.floor(Math.random() * MISIONES_SECRETAS.length);
  const idx      = ST.mis[wk]._secretIdx;
  const revealed = !!ST.mis[wk]._secretRevealed;
  const done     = !!ST.mis[wk]._secretDone;
  return `<div class="secret-card">
    <div class="secret-icon">❓</div>
    <div class="secret-title">Misión Secreta Semanal</div>
    ${revealed
      ? `<div class="secret-desc">${MISIONES_SECRETAS[idx]}</div>
         ${!done
           ? `<button class="secret-btn" onclick="completeSecret('${wk}')">Completar — +50 XP +10c</button>`
           : `<div style="color:var(--c3);font-size:11px;margin-top:6px">✦ Completada esta semana</div>`}`
      : `<button class="secret-btn" onclick="revealSecret('${wk}')">Revelar misión</button>`}
  </div>`;
}

function revealSecret(wk) {
  if (!ST.mis[wk]) ST.mis[wk] = {};
  ST.mis[wk]._secretRevealed = true;
  saveState(); renderMisiones();
}
function completeSecret(wk) {
  ST.mis[wk]._secretDone = true;
  ST.totalXP += 50; ST.coins += 10;
  showToast('¡Misión secreta completada! +50 XP +10c', '#ffd700');
  saveState(); renderMisiones(); renderInicio();
}

function toggleMision(id, xp, stat, coins) {
  if (!ST.mis[TODAY]) ST.mis[TODAY] = {};
  const was = !!ST.mis[TODAY][id];
  ST.mis[TODAY][id] = !was;
  if (!was) {
    ST.totalXP += xp;
    ST.coins   += coins || 0;
    ST.stats[stat] = (ST.stats[stat] || 0) + 1;
    showToast('+' + xp + ' XP — ' + stat);
    updateStacks();
    checkDayComplete();
  } else {
    ST.totalXP     = Math.max(0, ST.totalXP - xp);
    ST.coins       = Math.max(0, ST.coins - (coins || 0));
    ST.stats[stat] = Math.max(0, (ST.stats[stat] || 0) - 1);
  }
  saveState(); renderMisiones(); renderInicio();
}

function checkDayComplete() {
  const all = Object.values(MISIONES).flat();
  if (all.every(m => ST.mis[TODAY]?.[m.id])) {
    ST.dias[TODAY] = 'green';
    ST.racha = (ST.racha || 0) + 1;
    ST.dc    = (ST.dc    || 0) + 1;
    if (ST.dc >= 20 && ST.starsH < 3) {
      ST.starsH++; ST.dc = 0;
      if (ST.starsH >= 3 && ST.rankH < RANGOS_HABITOS.length - 1) {
        ST.starsH = 0; ST.rankH++;
        showRankUp();
      }
    }
    saveState();
  }
}

function showRankUp() {
  const rh  = RANGOS_HABITOS[ST.rankH];
  const rew = RECOMPENSAS_HABITOS.find(r => r.rang === rh.name);
  const el  = document.getElementById('rankupBanner');
  el.innerHTML = `<div class="rankup">
    <div class="rankup-animal">${rh.emoji}</div>
    <div class="rankup-title">¡Rango superado!</div>
    <div style="font-size:13px;color:var(--t1);margin-top:4px">Ahora eres: <strong>${rh.name}</strong> — ${rh.animal}</div>
    <div class="rankup-skills">
      <div style="font-size:10px;color:var(--t3);margin-bottom:4px">Habilidades desbloqueadas:</div>
      ${rh.skills.map(s => `<div class="skill-item">${s}</div>`).join('')}
    </div>
    ${rew ? `<div class="rankup-reward">🎁 Recompensa: ${rew.reward}</div>` : ''}
    <button class="secret-btn" style="margin-top:10px" onclick="this.parentElement.remove()">Continuar</button>
  </div>`;
  showToast('¡RANGO SUBIDO! ' + rh.emoji + ' ' + rh.name, '#ffd700');
}

// ============================================================
// MÓDULO: RANGOS
// ============================================================
function renderRangos() {
  buildRangList(RANGOS_HABITOS, 'rH', ST.rankH, ST.starsH, true);
  buildRangList(RANGOS_TECNICO, 'rT', ST.rankT, ST.starsT, false);
  buildRewList(RECOMPENSAS_HABITOS, 'rRewH', ST.rankH);
  buildRewList(RECOMPENSAS_TECNICO, 'rRewT', ST.rankT);
}

function buildRangList(list, elId, curIdx, curStars, isHabitos) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  list.forEach((r, i) => {
    const cur  = i === curIdx;
    const past = i < curIdx;
    const d = document.createElement('div');
    d.className = 'rrow';
    d.innerHTML =
      `<div class="rnum ${cur ? 'rn-cur' : past ? 'rn-past' : 'rn-fut'}" style="${cur ? 'box-shadow:0 0 10px ' + r.color : ''}">${r.emoji}</div>` +
      `<div>
        <div class="rname" style="color:${cur ? r.color : 'inherit'}">${r.name}</div>
        <div class="rdesc">${cur
          ? starsHTML(curStars) + ' ' + (r.subs ? r.subs[Math.min(curStars, 2)] : r.desc)
          : (r.desc || r.subs?.[0] || '')}</div>
      </div>`;
    el.appendChild(d);
  });
}

function buildRewList(list, elId, curRank) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  list.forEach((r, i) => {
    const unlocked = curRank > i + 1;
    const current  = curRank === i + 1;
    const d = document.createElement('div');
    d.className = 'rrow';
    d.innerHTML =
      `<div class="rnum ${unlocked ? 'rn-past' : current ? 'rn-cur' : 'rn-fut'}">${unlocked || current ? '★' : '☆'}</div>` +
      `<div>
        <div class="rname" style="font-size:11px">${r.rang}</div>
        <div class="rdesc" style="${unlocked || current ? 'color:var(--c5)' : ''}">🎁 ${r.reward}</div>
      </div>`;
    el.appendChild(d);
  });
}

// ============================================================
// MÓDULO: CALENDARIO
// ============================================================
function renderCalendario() {
  document.getElementById('cLabel').textContent = MONTHS_LABELS[calM] + ' ' + calY;
  document.getElementById('cRacha').textContent = ST.racha;
  ['b3','b7','b30'].forEach((id, i) => {
    document.getElementById(id).style.display = ST.racha >= [3,7,30][i] ? 'inline' : 'none';
  });

  const hEl = document.getElementById('cHdr');
  hEl.innerHTML = '';
  DAYS_LABELS.forEach(d => {
    const e = document.createElement('div');
    e.className = 'cal-dh';
    e.textContent = d;
    hEl.appendChild(e);
  });

  const gEl = document.getElementById('cGrid');
  gEl.innerHTML = '';
  const first = new Date(calY, calM, 1).getDay();
  const off   = (first + 6) % 7;
  const dim   = new Date(calY, calM + 1, 0).getDate();

  for (let i = 0; i < off; i++) {
    const e = document.createElement('div');
    e.className = 'cal-d';
    e.style.opacity = '0';
    gEl.appendChild(e);
  }
  for (let d = 1; d <= dim; d++) {
    const k = calY + '-' + String(calM + 1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
    const isToday = k === TODAY;
    const status  = ST.dias[k];
    const mc = ST.mis[k] ? Object.values(ST.mis[k]).filter(v => v === true).length : 0;
    const e = document.createElement('div');
    e.className = 'cal-d' + (isToday ? ' today' : '') + (status ? ' ' + status : '');
    e.innerHTML = d + (status === 'gold' ? '<span class="boss-mk">⚔</span>' : '') + (mc > 0 ? '<span class="cal-mc">' + mc + 'm</span>' : '');
    e.onclick = () => clickDay(k);
    gEl.appendChild(e);
  }
}

function setCM(mode, btn) {
  calMode = mode;
  document.querySelectorAll('.cmb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}
function chM(dir) {
  calM += dir;
  if (calM < 0)  { calM = 11; calY--; }
  if (calM > 11) { calM = 0;  calY++; }
  renderCalendario();
}
function clickDay(k) {
  if (calMode === 'boss')  { ST.dias[k] = 'gold'; showToast('¡Boss fight marcado!', '#ffd700'); }
  else if (calMode === 'light') { ST.dias[k] = 'blue'; showToast('Entrenamiento ligero', 'var(--c1)'); }
  else {
    const c = ST.dias[k];
    if (!c)          ST.dias[k] = 'green';
    else if (c === 'green') ST.dias[k] = 'red';
    else if (c === 'red')   delete ST.dias[k];
    else                    delete ST.dias[k];
  }
  ST.racha = Object.values(ST.dias).filter(v => v === 'green').length;
  saveState(); renderCalendario(); renderInicio();
}

// ============================================================
// MÓDULO: ZONA OSCURA
// ============================================================
function renderZona() {
  const fell = !!(ST.zona[TODAY]?.fell);
  const chk  = document.getElementById('zonaBigChk');
  chk.textContent  = fell ? '✕' : '';
  chk.className    = 'zone-big-chk' + (fell ? ' fell' : '');
  document.getElementById('zonaSub').textContent = fell
    ? 'Penalización activada — cumple el castigo'
    : 'Toca si fallaste hoy';

  const pd = PENALIZACIONES[Math.min(ST.rankH, PENALIZACIONES.length - 1)];
  document.getElementById('punRank').textContent = pd.name;
  const pl = document.getElementById('punList');
  pl.innerHTML = '';
  pd.items.forEach(item => {
    const d = document.createElement('div');
    d.className = 'pitem';
    d.textContent = item;
    pl.appendChild(d);
  });
}

function toggleZona() {
  if (!ST.zona[TODAY]) ST.zona[TODAY] = {};
  ST.zona[TODAY].fell = !ST.zona[TODAY].fell;
  showToast(ST.zona[TODAY].fell ? '⚠️ Penalización activada' : '✦ Zona oscura limpia hoy', ST.zona[TODAY].fell ? '#ff2d55' : 'var(--c3)');
  saveState(); renderZona();
}

// ============================================================
// MÓDULO: RUTA
// ============================================================
function renderRuta() {
  const el = document.getElementById('rutaList');
  el.innerHTML = '';
  MODULOS_ESTUDIO.forEach(m => {
    const d = document.createElement('div');
    d.className = 'mod-row';
    d.innerHTML =
      `<div class="mod-dot dot-${m.status}"></div>` +
      `<div style="flex:1"><div class="mod-name">${m.name}</div><div class="mod-sub">${m.rank}</div></div>` +
      `<div class="mod-wk">Sem.${m.weeks}</div>`;
    el.appendChild(d);
  });
}

// ============================================================
// MÓDULO: TIENDA
// ============================================================
function renderTienda() {
  document.getElementById('shopC').textContent = ST.coins;
  const el = document.getElementById('shopList');
  el.innerHTML = '';
  TIENDA.forEach(r => {
    const can = ST.coins >= r.cost;
    const d = document.createElement('div');
    d.className = 'reward-row';
    d.innerHTML =
      `<div class="remoji">${r.emoji}</div>` +
      `<div style="flex:1"><div class="rname">${r.name}</div><div class="rreq">${r.req}</div></div>` +
      `<div class="rcost">${r.cost}c</div>` +
      `<button class="rbuy" ${can ? '' : 'disabled'} onclick="buyReward(${r.cost},'${r.name}')">${can ? 'Canjear' : 'Bloqueado'}</button>`;
    el.appendChild(d);
  });
}

function buyReward(cost, name) {
  if (ST.coins >= cost) {
    ST.coins -= cost;
    showToast('¡' + name + ' desbloqueado! 🎉', '#ffd700');
    saveState(); renderInicio(); renderTienda();
  }
}

// ============================================================
// MÓDULO: ALTER EGOS
// ============================================================
function renderAlter() {
  const el = document.getElementById('alterContent');
  if (ST.rankH < 4) {
    el.innerHTML = `<div class="alter-locked">
      <div style="font-size:11px;color:var(--t3);margin-bottom:16px;text-transform:uppercase;letter-spacing:1px">Alter Egos — Bloqueados</div>
      <div style="display:flex;gap:20px;justify-content:center;margin-bottom:16px">
        ${ALTER_EGOS.map(a => `<div style="text-align:center">
          <div class="alter-silhouette">${a.emoji}</div>
          <div style="font-size:10px;color:var(--t3);margin-top:4px">???</div>
        </div>`).join('')}
      </div>
      <div style="font-size:12px;color:var(--t2)">Se desbloquean al llegar a <strong style="color:var(--c2)">Equilibrado</strong></div>
      <div style="margin-top:10px"><span class="pill pill-h">Progreso: Rango ${ST.rankH + 1}/5</span></div>
    </div>`;
    return;
  }
  el.innerHTML = `
    <div style="font-size:11px;color:var(--t2);margin-bottom:10px">Elige tu identidad secundaria de hoy:</div>
    <div class="alter-grid">
      ${ALTER_EGOS.map(a => `
        <div class="alter-card${ST.alterActive === a.id ? ' active' : ''}" onclick="selectAlter('${a.id}')">
          <div class="alter-icon">${a.emoji}</div>
          <div class="alter-name" style="color:${a.color}">${a.name}</div>
          <div class="alter-desc">${a.desc}</div>
        </div>`).join('')}
    </div>
    ${ST.alterActive ? buildAlterMissions() : ''}`;
}

function selectAlter(id) {
  ST.alterActive = id;
  saveState(); renderAlter();
}

function buildAlterMissions() {
  const a = ALTER_EGOS.find(x => x.id === ST.alterActive);
  if (!a) return '';
  return `<div class="card card2">
    <div class="stitle" style="color:${a.color}">${a.emoji} Misiones — ${a.name}</div>
    ${a.missions.map(m => `
      <div class="mrow">
        <div class="mchk" style="border-color:${a.color}">&nbsp;</div>
        <span class="mtxt">${m}</span>
        <span class="mxp" style="color:${a.color}">+20 XP</span>
      </div>`).join('')}
  </div>`;
}

// ============================================================
// MÓDULO: RESET
// ============================================================
function showReset()  { document.getElementById('resetOverlay').classList.add('show'); document.getElementById('resetModal').classList.add('show'); document.getElementById('resetInput').value = ''; }
function hideReset()  { document.getElementById('resetOverlay').classList.remove('show'); document.getElementById('resetModal').classList.remove('show'); }
function confirmReset() {
  if (document.getElementById('resetInput').value.trim() === 'RESET') {
    ST = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState(); hideReset(); renderAll();
    showToast('Progreso reseteado', '#ff2d55');
  } else {
    showToast('Escribe exactamente RESET', '#ff6b35');
  }
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  renderInicio();
  renderMisiones();
  renderRangos();
  renderCalendario();
  renderZona();
  renderRuta();
  renderTienda();
  renderAlter();
}

// ---- INIT ----
loadState();
renderAll();
