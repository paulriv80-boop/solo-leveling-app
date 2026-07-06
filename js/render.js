// ============================================================
// MÓDULO: RENDER — Presence
// Presentación pura: lee ST y data.js, escribe al DOM.
// Nunca debe calcular reglas de negocio ni mutar ST.
// ============================================================


// ---- AVATAR (usado por renderStats) ----

function renderAvatar() {
  const cur         = Math.min(ST.rank || 0, RANGOS.length - 1);
  const r           = RANGOS[cur];
  const img         = el('avatarImg');
  const placeholder = el('avatarPlaceholder');
  const hasAvatar   = !!(r.avatar && r.avatar.trim());

  if (img) {
    img.style.display = hasAvatar ? 'block' : 'none';
    if (hasAvatar) {
      img.src          = r.avatar;
      img.style.filter = `drop-shadow(0 0 22px ${r.color}) drop-shadow(0 0 8px ${r.color})`;
    }
  }

  if (placeholder) {
    placeholder.style.display = hasAvatar ? 'none' : 'flex';
    if (!hasAvatar) {
      placeholder.style.color  = r.color;
      placeholder.style.filter = `drop-shadow(0 0 18px ${r.color})`;
    }
  }

  const aura = el('avatarAura');
  if (aura) {
    aura.style.background = `radial-gradient(ellipse 55% 55% at 50% 62%, ${r.color}55 0%, ${r.color}22 45%, transparent 70%)`;
  }

  const pContainer = el('avatarParticles');
  if (!pContainer) return;
  const lx   = [14, 24, 36, 50, 64, 76, 42, 58, 30, 68];
  const dls  = [0, 0.5, 1.1, 0.3, 0.8, 1.4, 1.7, 0.2, 1.0, 0.6];
  const durs = [2.4, 2.8, 2.2, 3.0, 2.6, 2.9, 2.3, 2.7, 3.1, 2.5];
  pContainer.innerHTML = lx.map((x, i) =>
    `<div class="av-particle" style="left:${x}%;animation-delay:${dls[i]}s;animation-duration:${durs[i]}s;background:${r.color};box-shadow:0 0 5px ${r.color}"></div>`
  ).join('');
}


// ---- STATS (Tab personaje — avatar full-screen) ----

function renderStats() {
  renderAvatar();

  const cur = Math.min(ST.rank || 0, RANGOS.length - 1);
  const r   = RANGOS[cur];

  // Rank overlay encima del avatar
  const avBadge = el('avRankBadge');
  if (avBadge) {
    avBadge.innerHTML    = r.svg;
    avBadge.style.filter = `drop-shadow(0 0 6px ${r.color})`;
  }
  setText('avRankName', r.name);
  setText('avRankDesc', r.desc);

  // Level + XP bar
  const lvl = getLevel(ST.totalXP);
  setText('avLevel', 'Nivel ' + lvl.level);
  setStyle('avLvlBar', 'width', pct(lvl.xpInLevel, lvl.xpNeeded) + '%');
  setText('avXPSub', lvl.xpInLevel + '/' + lvl.xpNeeded + ' XP');

  // Racha y XP hoy
  setText('avRacha', ST.racha + ' días');
  setText('avXPHoy', xpHoy() + ' XP hoy');
}


// ---- OVERLAY ATRIBUTOS (full-screen slide-up) ----

const ATTR_KEYS   = ['fuerza','agilidad','energia','serenidad','confianza','conocimiento','claridad','espiritualidad','disciplina'];
const ATTR_LABELS = ['Fuerza','Agilidad','Energía','Serenidad','Confianza','Conocimiento','Claridad','Espiritualidad','Disciplina'];
const ATTR_COLORS = ['#ff5555','#44ddff','#ffaa00','#55aaff','#ff88cc','#aa88ff','#00dd88','#ff7733','#cc44ff'];

function renderAtributosOverlay() {
  const values = ATTR_KEYS.map(k => ST.stats[k] || 0);
  const maxVal = Math.max(...values, 10);
  const cur    = Math.min(ST.rank || 0, RANGOS.length - 1);

  const radarEl = el('radarChart');
  if (radarEl) radarEl.innerHTML = buildRadarSVG(values, ATTR_LABELS, RANGOS[cur].color);

  const barsEl = el('attrBars');
  if (barsEl) {
    barsEl.innerHTML = ATTR_KEYS.map((k, i) => `
      <div class="attr-bar-row">
        <div class="attr-bar-lbl">${ATTR_LABELS[i]}</div>
        <div class="attr-bar-track">
          <div class="attr-bar-fill" style="width:${pct(values[i], maxVal)}%;background:${ATTR_COLORS[i]}"></div>
        </div>
        <div class="attr-bar-num">${values[i]}</div>
      </div>
    `).join('');
  }
}

function buildRadarSVG(values, labels, color) {
  const cx = 130, cy = 130, r = 100, n = values.length;
  const maxVal = Math.max(...values, 10);
  const ang    = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const px     = (i, sc) => cx + r * sc * Math.cos(ang(i));
  const py     = (i, sc) => cy + r * sc * Math.sin(ang(i));

  const rings = [.25,.5,.75,1].map(sc => {
    const pts = Array.from({length:n}, (_,i) => `${px(i,sc)},${py(i,sc)}`).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`;
  }).join('');

  const axes = Array.from({length:n}, (_,i) =>
    `<line x1="${cx}" y1="${cy}" x2="${px(i,1)}" y2="${py(i,1)}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>`
  ).join('');

  const scales  = values.map(v => Math.min(v / maxVal, 1));
  const dataPts = Array.from({length:n}, (_,i) => `${px(i,scales[i])},${py(i,scales[i])}`).join(' ');

  const lbls = Array.from({length:n}, (_,i) => {
    const lx     = cx + (r + 18) * Math.cos(ang(i));
    const ly     = cy + (r + 18) * Math.sin(ang(i));
    const anchor = lx < cx - 4 ? 'end' : lx > cx + 4 ? 'start' : 'middle';
    return `<text x="${lx}" y="${ly+4}" text-anchor="${anchor}" fill="rgba(255,255,255,.55)" font-size="9" font-family="inherit">${labels[i].substring(0,3).toUpperCase()}</text>`;
  }).join('');

  const dots = Array.from({length:n}, (_,i) =>
    `<circle cx="${px(i,scales[i])}" cy="${py(i,scales[i])}" r="3.5" fill="${color}" stroke="rgba(5,5,15,.9)" stroke-width="1.5"/>`
  ).join('');

  return `<svg viewBox="0 0 260 260" width="100%" height="100%">
    ${rings}${axes}
    <polygon points="${dataPts}" fill="${color}30" stroke="${color}" stroke-width="2"/>
    ${dots}${lbls}
  </svg>`;
}


// ---- BOTTOM SHEET DE RANGO ----

function renderRangoSheet() {
  const cur       = Math.min(ST.rank || 0, RANGOS.length - 1);
  const container = el('rangoSheetContent');
  if (!container) return;

  container.innerHTML = RANGOS.map((r, i) => {
    const isCur  = i === cur;
    const isPast = i < cur;
    const cls    = isCur ? 'rs-row rs-cur' : isPast ? 'rs-row rs-past' : 'rs-row rs-fut';
    return `<div class="${cls}">
      <div class="rs-badge" style="${isCur ? `filter:drop-shadow(0 0 5px ${r.color})` : ''}">${r.svg}</div>
      <div style="flex:1">
        <div class="rs-name" style="${isCur ? `color:${r.color}` : ''}">${r.name}</div>
        <div class="rs-desc">${isCur ? r.desc : isPast ? '✓ Superado' : '🔒 Bloqueado'}</div>
      </div>
      ${isCur ? `<span class="rs-dot" style="color:${r.color}">◉</span>` : ''}
    </div>`;
  }).join('');
}


// ---- MISIONES (Tab home) ----

function renderMisiones() {
  // Header: fecha local + contador 90 días
  const now   = new Date();
  const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio',
                 'agosto','septiembre','octubre','noviembre','diciembre'];
  setText('mDate', `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]}`);

  const d90 = calcDias90();
  setText('mDias90', `${d90.count}/90 días`);

  // XP hoy
  const xp = xpHoy();
  setText('mXPHoy', xp);
  setStyle('mBXPHoy', 'width', pct(xp, CONFIG.XP_DIA_MAXIMO) + '%');

  // 4 categorías
  renderListaMisiones(MISIONES.FISICO,     'mFISICO');
  renderListaMisiones(MISIONES.MENTE,      'mMENTE');
  renderListaMisiones(MISIONES.ESPIRITUAL, 'mESPIRITUAL');
  renderProposito('mPROPOSITO');
}

function renderListaMisiones(list, elId) {
  const container = el(elId);
  if (!container) return;

  const today    = DateUtils.today();
  const todayMis = ST.mis[today] || {};

  container.innerHTML = list.map(m => {
    const done     = !!todayMis[m.id];
    const statsStr = m.stats.join(',');
    const statTags = m.stats.map(s =>
      `<span class="mstat-tag">${s}</span>`
    ).join('');

    return `<div class="mrow">
      <div class="mchk${done ? ' done' : ''}"
           onclick="toggleMision('${m.id}',${m.xp},'${statsStr}',${m.coins || 0})">
        ${done ? '✓' : ''}
      </div>
      <div class="m-body">
        <span class="mtxt${done ? ' done' : ''}">${m.t}</span>
        ${m.desc ? `<span class="mdesc">${m.desc}</span>` : ''}
        <div class="m-meta">
          <span class="mxp">+${m.xp} XP${m.coins ? ' +' + m.coins + 'c' : ''}</span>
          ${statTags}
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderProposito(elId) {
  const container = el(elId);
  if (!container) return;

  const today    = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  const m        = MISIONES.PROPOSITO[0];
  const done     = !!todayMis[m.id];
  const nombre   = ST.proposito || 'Sin propósito configurado';
  const statsStr = m.stats.join(',');
  const statTags = m.stats.map(s => `<span class="mstat-tag">${s}</span>`).join('');

  container.innerHTML = `<div class="mrow">
    <div class="mchk${done ? ' done' : ''}"
         onclick="toggleMision('${m.id}',${m.xp},'${statsStr}',${m.coins || 0})">
      ${done ? '✓' : ''}
    </div>
    <div class="m-body">
      <span class="mtxt${done ? ' done' : ''}">${nombre}</span>
      ${!ST.proposito ? '<span class="mdesc">Configúralo en Ruta de Propósito ↓</span>' : ''}
      <div class="m-meta">
        <span class="mxp">+${m.xp} XP +${m.coins}c</span>
        ${statTags}
      </div>
    </div>
  </div>`;
}


// ---- CALENDARIO ----

function renderCalendario() {
  const label = el('cLabel');
  if (label) label.textContent = MONTHS_LABELS[calM] + ' ' + calY;

  setText('cRacha', ST.racha);

  CONFIG.RACHA_BONUS.forEach((dias, i) => {
    const indicator = el(['b3', 'b7', 'b30'][i]);
    if (indicator) indicator.style.display = ST.racha >= dias ? 'inline' : 'none';
  });

  renderCalHeader();
  renderCalGrid();
}

function renderCalHeader() {
  const hEl = el('cHdr');
  if (!hEl) return;
  hEl.innerHTML = DAYS_LABELS.map(d => `<div class="cal-dh">${d}</div>`).join('');
}

function renderCalGrid() {
  const gEl = el('cGrid');
  if (!gEl) return;

  const today       = DateUtils.today();
  const first       = new Date(calY, calM, 1).getDay();
  const offset      = (first + 6) % 7;
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < offset; i++) {
    html += '<div class="cal-d" style="opacity:0;pointer-events:none"></div>';
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const k      = `${calY}-${String(calM + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = k === today;
    const status  = ST.dias[k] || '';
    const mCount  = ST.mis[k]
      ? Object.values(ST.mis[k]).filter(v => v === true).length
      : 0;

    const classes   = ['cal-d', isToday ? 'today' : '', status].filter(Boolean).join(' ');
    const bossIcon  = status === 'gold' ? '<span class="boss-mk">⚔</span>' : '';
    const mCountEl  = mCount > 0 ? `<span class="cal-mc">${mCount}m</span>` : '';

    html += `<div class="${classes}" onclick="clickDay('${k}')">${d}${bossIcon}${mCountEl}</div>`;
  }
  gEl.innerHTML = html;
}


// ---- ZONA OSCURA ----

function renderZona() {
  const today = DateUtils.today();
  const fell  = !!(ST.zona[today]?.fell);
  const chk   = el('zonaBigChk');

  if (chk) {
    chk.textContent = fell ? '✕' : '';
    chk.className   = 'zone-big-chk' + (fell ? ' fell' : '');
  }

  setText('zonaSub', fell
    ? 'Penalización activada — cumple el castigo'
    : 'Toca si fallaste hoy');

  const pd = PENALIZACIONES[Math.min(ST.rank || 0, PENALIZACIONES.length - 1)];
  setText('punRank', pd.name);

  const punList = el('punList');
  if (punList) {
    punList.innerHTML = pd.items.map(item =>
      `<div class="pitem">${item}</div>`
    ).join('');
  }
}


// ---- RUTA DE ESTUDIO ----

function renderRuta() {
  const propInput = el('propositoInput');
  if (propInput) propInput.value = ST.proposito || '';

  const container = el('rutaList');
  if (!container) return;

  container.innerHTML = MODULOS_ESTUDIO.map(m => `
    <div class="mod-row">
      <div class="mod-dot dot-${m.status}"></div>
      <div style="flex:1">
        <div class="mod-name">${m.name}</div>
        <div class="mod-sub">${m.rank}</div>
      </div>
      <div class="mod-wk">Sem.${m.weeks}</div>
    </div>
  `).join('');
}


// ---- MENÚ (Tienda + Alter Egos) ----

function renderMenu() {
  renderTienda();
  renderAlter();
}

function renderTienda() {
  setText('shopC', ST.coins);
  const container = el('shopList');
  if (!container) return;

  container.innerHTML = TIENDA.map(r => {
    const canAfford = ST.coins >= r.cost;
    const safeName  = r.name.replace(/'/g, "\\'");
    return `<div class="reward-row">
      <div class="remoji">${r.emoji}</div>
      <div style="flex:1">
        <div class="rname">${r.name}</div>
        <div class="rreq">${r.req}</div>
      </div>
      <div class="rcost">${r.cost}c</div>
      <button class="rbuy"
              ${canAfford ? '' : 'disabled'}
              onclick="buyReward(${r.cost}, '${safeName}')">
        ${canAfford ? 'Canjear' : 'Bloqueado'}
      </button>
    </div>`;
  }).join('');
}


// ---- ALTER EGOS ----

const ALTER_UNLOCK_RANK = 3;

function renderAlter() {
  const container = el('alterContent');
  if (!container) return;

  if ((ST.rank || 0) < ALTER_UNLOCK_RANK) {
    container.innerHTML = buildAlterLocked();
    return;
  }
  container.innerHTML = buildAlterUnlocked();
}

function buildAlterLocked() {
  const siluetas = ALTER_EGOS.map(a => `
    <div style="text-align:center">
      <div class="alter-silhouette">${a.emoji}</div>
      <div style="font-size:10px;color:var(--t3);margin-top:4px">???</div>
    </div>
  `).join('');

  return `<div class="alter-locked">
    <div style="font-size:11px;color:var(--t3);margin-bottom:16px;text-transform:uppercase;letter-spacing:1px">
      Alter Egos — Bloqueados
    </div>
    <div style="display:flex;gap:20px;justify-content:center;margin-bottom:16px">
      ${siluetas}
    </div>
    <div style="font-size:12px;color:var(--t2)">
      Se desbloquean al llegar a <strong style="color:var(--c2)">Disciplinado</strong>
    </div>
    <div style="margin-top:10px">
      <span class="pill pill-h">Progreso: Rango ${(ST.rank || 0) + 1}/${ALTER_UNLOCK_RANK + 1}</span>
    </div>
  </div>`;
}

function buildAlterUnlocked() {
  const cards = ALTER_EGOS.map(a => `
    <div class="alter-card${ST.alterActive === a.id ? ' active' : ''}"
         onclick="selectAlter('${a.id}')">
      <div class="alter-icon">${a.emoji}</div>
      <div class="alter-name" style="color:${a.color}">${a.name}</div>
      <div class="alter-desc">${a.desc}</div>
    </div>
  `).join('');

  return `
    <div style="font-size:11px;color:var(--t2);margin-bottom:10px">
      Elige tu identidad secundaria de hoy:
    </div>
    <div class="alter-grid">${cards}</div>
    ${ST.alterActive ? buildAlterMissions() : ''}
  `;
}

function buildAlterMissions() {
  const a = ALTER_EGOS.find(x => x.id === ST.alterActive);
  if (!a) return '';

  const misionRows = a.missions.map(m => `
    <div class="mrow">
      <div class="mchk" style="border-color:${a.color}">&nbsp;</div>
      <span class="mtxt">${m}</span>
      <span class="mxp" style="color:${a.color}">+20 XP</span>
    </div>
  `).join('');

  return `<div class="card card2">
    <div class="stitle" style="color:${a.color}">${a.emoji} Misiones — ${a.name}</div>
    ${misionRows}
  </div>`;
}


// ---- PLACEHOLDERS ESTÁTICOS ----

function renderComunidad() { /* HTML estático en sec-comunidad */ }
function renderTools()     { /* HTML estático en sec-tools */ }


// ---- RENDER COMPLETO ----

function renderAll() {
  renderStats();
  renderMisiones();
  renderCalendario();
  renderZona();
  renderRuta();
  renderMenu();
}
