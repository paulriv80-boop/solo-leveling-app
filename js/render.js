// ============================================================
// MÓDULO: RENDER — Solo Leveling
// Presentación pura: lee ST y data.js, escribe al DOM.
// Nunca debe calcular reglas de negocio ni mutar ST.
// ============================================================

// ---- INICIO (Dashboard) ----

function renderAvatar() {
  const cur = Math.min(ST.rank || 0, RANGOS.length - 1);
  const r   = RANGOS[cur];

  const img = el('avatarImg');
  if (img) {
    img.src           = r.avatar || 'assets/avatar.png';
    img.style.filter  = `drop-shadow(0 0 22px ${r.color}) drop-shadow(0 0 8px ${r.color})`;
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

function renderInicio() {
  // Avatar animado
  renderAvatar();

  // Acordeón de rango
  renderRankAccord();

  // XP hoy
  const xp = xpHoy();
  setText('dXH', xp);
  setStyle('dBX', 'width', pct(xp, CONFIG.XP_DIA_MAXIMO) + '%');

  // Racha
  setText('dRC', ST.racha + ' días');
  setText('dBS', bonusLabel(ST.racha));
  setStyle('dBR', 'width', pct(ST.racha, 30) + '%');

  // Stats (atributos)
  ['fuerza','agilidad','energia','serenidad','confianza','conocimiento','claridad','espiritualidad','disciplina']
    .forEach(k => setText('s' + k, ST.stats[k] || 0));

  // Nivel del Operator
  const lvl = getLevel(ST.totalXP);
  setText('dLvl', 'Nivel ' + lvl.level);
  setText('dLvlSub', lvl.xpInLevel + ' / ' + lvl.xpNeeded + ' XP al siguiente nivel');
  setStyle('dBLvl', 'width', pct(lvl.xpInLevel, lvl.xpNeeded) + '%');

  // HUD superior
  setText('hC', ST.coins);
  setText('hX', ST.totalXP);
  setText('hR', ST.racha);

  // Indicadores de racha
  CONFIG.RACHA_BONUS.forEach((dias, i) => {
    const indicator = el(['b3', 'b7', 'b30'][i]);
    if (indicator) indicator.style.display = ST.racha >= dias ? 'inline' : 'none';
  });
}

function renderRankAccord() {
  const cur = Math.min(ST.rank || 0, RANGOS.length - 1);
  const rh  = RANGOS[cur];

  // Actualizar header con SVG
  const badge = el('dRankBadge');
  if (badge) {
    badge.innerHTML       = rh.svg;
    badge.style.filter    = `drop-shadow(0 0 7px ${rh.color})`;
    badge.style.boxShadow = '';
    badge.style.border    = '';
  }
  setText('dRankName', rh.name);

  // Construir lista de rangos con SVG en cada fila
  const body = el('rankAccordBody');
  if (!body) return;

  body.innerHTML = RANGOS.map((r, i) => {
    const isCurrent = i === cur;
    const isPast    = i < cur;
    const rowClass  = isCurrent ? 'rank-cur' : isPast ? 'rank-past' : 'rank-fut';
    const svgStyle  = isCurrent ? `filter:drop-shadow(0 0 4px ${r.color})` : '';
    const nameStyle = isCurrent ? `color:${r.color}` : '';
    const desc      = isCurrent ? r.desc : isPast ? '✓ Superado' : 'Bloqueado';

    return `<div class="rank-row ${rowClass}">
      <div class="rank-badge-xs" style="${svgStyle}">${r.svg}</div>
      <div class="rank-row-info">
        <div class="rank-row-name" style="${nameStyle}">${r.name}</div>
        <div class="rank-row-desc">${desc}</div>
      </div>
      ${isCurrent ? `<span class="rank-cur-dot" style="color:${r.color}">◉</span>` : ''}
    </div>`;
  }).join('');
}


// ---- MISIONES ----

function renderMisiones() {
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
      ${!ST.proposito ? '<span class="mdesc">Configúralo en la pestaña Ruta</span>' : ''}
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

  const today  = DateUtils.today();
  const first  = new Date(calY, calM, 1).getDay();
  const offset = (first + 6) % 7;   // Ajuste a lunes como primer día
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();

  let html = '';

  // Celdas vacías del inicio
  for (let i = 0; i < offset; i++) {
    html += '<div class="cal-d" style="opacity:0;pointer-events:none"></div>';
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const k       = `${calY}-${String(calM + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = k === today;
    const status  = ST.dias[k] || '';
    const mCount  = ST.mis[k]
      ? Object.values(ST.mis[k]).filter(v => v === true).length
      : 0;

    const classes = [
      'cal-d',
      isToday ? 'today' : '',
      status,
    ].filter(Boolean).join(' ');

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


// ---- TIENDA ----

function renderTienda() {
  setText('shopC', ST.coins);
  const container = el('shopList');
  if (!container) return;

  container.innerHTML = TIENDA.map(r => {
    const canAfford = ST.coins >= r.cost;
    // Escapar el nombre para uso seguro en el atributo onclick
    const safeName = r.name.replace(/'/g, "\\'");
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

const ALTER_UNLOCK_RANK = 3; // Índice en RANGOS (Disciplinado = 3)

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


// ---- RENDER COMPLETO ----
// Render de todas las secciones en el primer load. Después, cada
// módulo se renderiza de forma granular al navegar o interactuar.

function renderAll() {
  renderInicio();
  renderMisiones();
  renderCalendario();
  renderZona();
  renderRuta();
  renderTienda();
  renderAlter();
}
