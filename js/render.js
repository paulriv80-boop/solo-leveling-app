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

  // Badge de rango — solo ícono + letra encima
  const avBadge = el('avRankBadge');
  if (avBadge) {
    avBadge.innerHTML    = r.svg + `<span class="av-rank-letter">${r.letter}</span>`;
    avBadge.style.filter = `drop-shadow(0 0 5px ${r.color})`;
  }

  // X/90 contador
  const d90 = calcDias90();
  setText('avX90', d90.count + '/90');

  // Level + XP bar
  const lvl = getLevel(ST.totalXP);
  setText('avLevel', 'Nivel ' + lvl.level);
  setStyle('avLvlBar', 'width', pct(lvl.xpInLevel, lvl.xpNeeded) + '%');
  setText('avXPSub', lvl.xpInLevel + '/' + lvl.xpNeeded + ' XP');

  // Racha y XP hoy
  setText('avRacha', ST.racha + ' días');
  setText('avXPHoy', xpHoy() + ' XP hoy');
}


// ---- OVERLAY ATRIBUTOS (full-screen slide-up) — 5 CATEGORÍAS ----

function renderAtributosOverlay() {
  // Puntaje de categoría = suma de floor(attr/5) para cada attr en la categoría
  const catValues = CATEGORIES.map(cat =>
    cat.attrs.reduce((sum, attr) => sum + Math.floor((ST.stats[attr] || 0) / 5), 0)
  );

  const radarEl = el('radarChart');
  if (radarEl) radarEl.innerHTML = buildRadarSVG(catValues);

  const barsEl = el('attrBars');
  if (!barsEl) return;

  barsEl.innerHTML = CATEGORIES.map((cat, ci) => {
    const catScore = catValues[ci];
    const attrRows = cat.attrs.map(attr => {
      const val  = ST.stats[attr] || 0;
      const fill = val % 5;   // barras llenas dentro del ciclo actual
      const meta = ATTR_META[attr] || { label: attr, color: '#00f5ff' };
      const bars = Array.from({ length: 5 }, (_, b) =>
        `<div class="ao-bar${b < fill ? ' ao-bar--lit' : ''}" ${b < fill ? `style="background:${meta.color};border-color:${meta.color};box-shadow:0 0 6px ${meta.color}"` : ''}></div>`
      ).join('');
      return `<div class="ao-attr-row">
        <span class="ao-attr-name">${meta.label}</span>
        <span class="ao-attr-num" style="color:${meta.color}">${val}</span>
        <div class="ao-bars">${bars}</div>
      </div>`;
    }).join('');

    return `<div class="ao-cat-block">
      <div class="ao-cat-header">
        <span class="ao-cat-num">${ci + 1}</span>
        <span class="ao-cat-icon">${cat.icon}</span>
        <span class="ao-cat-name">${cat.name}</span>
        <span class="ao-cat-score">${catScore}</span>
      </div>
      ${attrRows}
    </div>`;
  }).join('');
}

// Radar pentagonal con 5 ejes (uno por categoría)
function buildRadarSVG(catValues) {
  const cx = 130, cy = 130, r = 100, n = 5;
  const maxVal = Math.max(...catValues, 1);
  const ang    = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const px     = (i, sc) => cx + r * sc * Math.cos(ang(i));
  const py     = (i, sc) => cy + r * sc * Math.sin(ang(i));

  const rings = [.25, .5, .75, 1].map(sc => {
    const pts = Array.from({ length: n }, (_, i) => `${px(i, sc)},${py(i, sc)}`).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>`;
  }).join('');

  const axes = Array.from({ length: n }, (_, i) =>
    `<line x1="${cx}" y1="${cy}" x2="${px(i, 1)}" y2="${py(i, 1)}" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>`
  ).join('');

  const scales  = catValues.map(v => Math.min(v / maxVal, 1));
  const dataPts = Array.from({ length: n }, (_, i) => `${px(i, scales[i])},${py(i, scales[i])}`).join(' ');

  const cur   = Math.min(ST.rank || 0, RANGOS.length - 1);
  const color = RANGOS[cur].color;

  const lbls = CATEGORIES.map((cat, i) => {
    const lx  = cx + (r + 24) * Math.cos(ang(i));
    const ly  = cy + (r + 24) * Math.sin(ang(i));
    const anc = lx < cx - 4 ? 'end' : lx > cx + 4 ? 'start' : 'middle';
    return `<text x="${lx}" y="${ly - 5}" text-anchor="${anc}" fill="rgba(255,255,255,.9)" font-size="15" font-family="inherit">${cat.icon}</text>
      <text x="${lx}" y="${ly + 9}" text-anchor="${anc}" fill="rgba(255,255,255,.45)" font-size="8" font-family="inherit" letter-spacing=".5">${cat.name.toUpperCase()}</text>`;
  }).join('');

  const dots = Array.from({ length: n }, (_, i) =>
    `<circle cx="${px(i, scales[i])}" cy="${py(i, scales[i])}" r="4" fill="${color}" stroke="rgba(5,5,15,.9)" stroke-width="1.5"/>`
  ).join('');

  return `<svg viewBox="0 0 260 260" width="100%" height="100%">
    ${rings}${axes}
    <polygon points="${dataPts}" fill="${color}28" stroke="${color}" stroke-width="2"/>
    ${dots}${lbls}
  </svg>`;
}


// ---- OVERLAY DE RANGO (full-screen) ----

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
        <div class="rs-name" style="${isCur ? `color:${r.color}` : ''}">
          <span style="font-size:11px;font-weight:900;opacity:.7;margin-right:5px">${r.letter}</span>${r.name}
        </div>
        <div class="rs-desc">${isCur ? r.desc : isPast ? '✓ Superado' : '🔒 Bloqueado'}</div>
      </div>
      ${isCur ? `<span class="rs-dot" style="color:${r.color}">◉</span>` : ''}
    </div>`;
  }).join('');
}


// ---- ALTER EGO OVERLAY (full-screen) ----

function renderAlterOverlay() {
  const container = el('alterOverlayContent');
  if (!container) return;

  const lvl        = getLevel(ST.totalXP);
  const curRank    = ST.rank || 0;
  const isUnlocked = lvl.level >= 100 && curRank >= 5;

  container.innerHTML = `
    <div class="alter-unlock-note">
      Desbloqueados en <strong>Nivel 100</strong> + <strong>Rango S</strong>
      ${isUnlocked ? '' : ` — (Nivel actual: ${lvl.level}, Rango: ${RANGOS[curRank].letter})`}
    </div>
    <div class="alter-grid-full">
      ${ALTER_EGOS.map(a => {
        const locked = !isUnlocked;
        const cls    = locked ? 'alter-card-full locked' : 'alter-card-full unlocked';
        const style  = locked ? '' : `style="--alter-color:${a.color};border-color:${a.color}44"`;
        const iconColor = locked ? 'rgba(255,255,255,.2)' : a.color;
        return `<div class="${cls}" ${style}>
          ${locked ? `<span class="alter-lock-icon"><i class="ti ti-lock"></i></span>` : ''}
          <div class="alter-silhouette" style="color:${iconColor}">${a.svg}</div>
          <div class="alter-archetype">${a.archetype}</div>
          <div class="alter-name-full" style="${locked ? '' : `color:${a.color}`}">${a.name}</div>
          <div class="alter-desc-full">${locked ? 'Desbloquea en Nivel 100 + Rango S' : a.desc}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}


// ---- TROFEO OVERLAY ----

function renderTrofeoOverlay() {
  // Contenido estático por ahora — Títulos y Logros placeholder
}


// ---- MISIONES (Tab home) — swipe cards + 3 tabs ----

let _mActiveTab = 'todos';

function renderMisiones() {
  const now   = new Date();
  const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio',
                 'agosto','septiembre','octubre','noviembre','diciembre'];
  setText('mDate',  `${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]}`);
  const d90 = calcDias90();
  setText('mDias90', `${d90.count}/90 días`);
  const xp = xpHoy();
  setText('mXPHoy', xp);
  setStyle('mBXPHoy', 'width', pct(xp, CONFIG.XP_DIA_MAXIMO) + '%');

  const today    = DateUtils.today();
  const todayMis = ST.mis[today] || {};

  // Lista combinada: misiones activas + propósitos
  const active = MISIONES.filter(m => (ST.activeMissions || []).includes(m.id));
  const propMissions = (ST.propositos || []).map(p => ({
    id: 'pu_' + p.id, name: p.name || 'Propósito', desc: p.objetivo || '',
    xp: 25, coins: 2, isProp: true, propId: p.id,
    cats: [{ cat:'mente', stars:3 }, { cat:'enfoque', stars:2 }, { cat:'vinculo', stars:1 }],
  }));
  const all = [...active, ...propMissions];

  const todos   = all.filter(m => !todayMis[m.id]);
  const done    = all.filter(m => todayMis[m.id] === 'done');
  const skipped = all.filter(m => todayMis[m.id] === 'skip');

  const list = _mActiveTab === 'done' ? done : _mActiveTab === 'skip' ? skipped : todos;

  const container = el('mListaMisiones');
  if (container) {
    container.innerHTML = list.length
      ? list.map(m => buildMisionCard(m)).join('')
      : `<div class="m-empty">No hay misiones en esta sección</div>`;
    if (typeof attachSwipeHandlers === 'function') attachSwipeHandlers();
  }

  // Actualizar contadores de tabs
  setText('mTabTodosCount',  todos.length);
  setText('mTabDoneCount',   done.length);
  setText('mTabSkipCount',   skipped.length);
}

function buildMisionCard(m) {
  const gradMap = {
    cuerpo:   '#180008,#28081a',
    mente:    '#000e1a,#00182e',
    presencia:'#071a0e,#00100e',
    enfoque:  '#181200,#0e0a00',
    vinculo:  '#10001a,#1a0028',
  };
  const primaryCat = m.cats && m.cats[0] ? m.cats[0].cat : 'cuerpo';
  const grad = gradMap[primaryCat] || '#0a0a1a,#1a1040';

  const catsJson   = JSON.stringify(m.cats || []);
  const catsPreview = (m.cats || []).slice(0, 2).map(c => {
    const cat = CATEGORIES.find(x => x.id === c.cat);
    return cat ? `<span class="mc-star-tag">${'★'.repeat(c.stars)}${cat.icon}</span>` : '';
  }).join('');

  const infoCats = (m.cats || []).map(c => {
    const cat = CATEGORIES.find(x => x.id === c.cat);
    if (!cat) return '';
    return `<div class="mc-info-cat">${cat.icon} ${cat.name} ${'★'.repeat(c.stars)}</div>`;
  }).join('');

  return `<div class="mc-wrap" data-id="${m.id}" data-xp="${m.xp}" data-coins="${m.coins}" data-cats='${catsJson}'>
    <div class="mc-panel-left">
      <button class="mc-btn-done" onclick="misionHecho(this)">✓ Hecho</button>
      <button class="mc-btn-skip" onclick="misionSaltar(this)">✕ Saltar</button>
    </div>
    <div class="mc-panel-right">
      <div class="mc-info-xp">+${m.xp} XP</div>
      <div class="mc-info-coins">+${m.coins} 🪙</div>
      ${infoCats}
    </div>
    <div class="mc-front">
      <div class="mc-bg" style="background:linear-gradient(135deg,${grad})"></div>
      <div class="mc-body">
        <div class="mc-name">${m.name}</div>
        ${m.desc ? `<div class="mc-desc">${m.desc}</div>` : ''}
        <div class="mc-cats-preview">${catsPreview}</div>
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
      ? Object.values(ST.mis[k]).filter(v => v === 'done').length
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
  return `<div class="alter-locked">
    <div style="font-size:11px;color:var(--t3);margin-bottom:16px;text-transform:uppercase;letter-spacing:1px">
      Alter Egos — Bloqueados
    </div>
    <div style="font-size:12px;color:var(--t2)">
      Se desbloquean al llegar a <strong style="color:var(--c2)">Disciplinado</strong>
    </div>
    <div style="margin-top:10px">
      <span class="pill pill-h">Ver en Stats → Alter Egos</span>
    </div>
  </div>`;
}

function buildAlterUnlocked() {
  const cards = ALTER_EGOS.map(a => `
    <div class="alter-card${ST.alterActive === a.id ? ' active' : ''}"
         onclick="selectAlter('${a.id}')">
      <div class="alter-name" style="color:${a.color}">${a.name}</div>
      <div class="alter-desc">${a.archetype}</div>
    </div>
  `).join('');

  return `<div style="font-size:11px;color:var(--t2);margin-bottom:10px">
      Elige tu Alter Ego activo:
    </div>
    <div class="alter-grid">${cards}</div>`;
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
