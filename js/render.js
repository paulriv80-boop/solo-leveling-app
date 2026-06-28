// ============================================================
// MÓDULO: RENDER — Solo Leveling
// Presentación pura: lee ST y data.js, escribe al DOM.
// Nunca debe calcular reglas de negocio ni mutar ST.
// ============================================================

// ---- INICIO (Dashboard) ----

function renderInicio() {
  const rh = RANGOS_HABITOS[Math.min(ST.rankH, RANGOS_HABITOS.length - 1)];
  const rt = RANGOS_TECNICO[Math.min(ST.rankT, RANGOS_TECNICO.length - 1)];

  // Rango Hábitos
  setText('dRH',   rh.emoji + ' ' + rh.name);
  setText('dSH',   starsHTML(ST.starsH));
  setText('dSubH', ST.dc + '/' + CONFIG.DIAS_POR_ESTRELLA + ' días');
  setStyle('dBH', 'width', pct(ST.dc, CONFIG.DIAS_POR_ESTRELLA) + '%');

  // Rango Técnico
  setText('dRT', rt.emoji + ' ' + rt.name);
  setText('dST', starsHTML(ST.starsT));
  setStyle('dBT', 'width', pct(ST.rankT, RANGOS_TECNICO.length - 1) + '%');

  // XP hoy
  const xp = xpHoy();
  setText('dXH', xp);
  setStyle('dBX', 'width', pct(xp, CONFIG.XP_DIA_MAXIMO) + '%');

  // Racha
  setText('dRC', ST.racha + ' días');
  setText('dBS', bonusLabel(ST.racha));
  setStyle('dBR', 'width', pct(ST.racha, 30) + '%');

  // Estado del guerrero
  const estadoEl = el('dEst');
  if (estadoEl) {
    estadoEl.textContent = rh.emoji + ' ' + rh.name;
    estadoEl.style.color = rh.color;
  }
  setText('dEstS', rh.subs ? rh.subs[Math.min(ST.starsH, 2)] : rh.desc || '');

  // Stats (orbs)
  ['F', 'M', 'E', 'V', 'D'].forEach(k => setText('s' + k, ST.stats[k] || 0));

  // HUD superior
  setText('hC', ST.coins);
  setText('hX', ST.totalXP);
  setText('hR', ST.racha);

  // Indicadores de racha
  CONFIG.RACHA_BONUS.forEach((dias, i) => {
    const indicator = el(['b3', 'b7', 'b30'][i]);
    if (indicator) indicator.style.display = ST.racha >= dias ? 'inline' : 'none';
  });

  renderStacks();
}

function renderStacks() {
  const container = el('stackGrid');
  if (!container) return;

  const fragments = STACKS.map(sk => {
    const lvl = ST.stacks[sk.id] || 0;
    const isActive = lvl > 0;
    return `<div class="stack-item${isActive ? ' active' : ''}" title="${sk.name} — ${sk.desc}">
      ${STACK_SVGS[sk.id]}
      <div class="stack-name">${sk.name}</div>
      <div class="stack-lvl">${isActive ? 'Nv.' + lvl : '—'}</div>
      <div class="stack-bar">
        <div class="stack-bar-fill" style="width:${pct(lvl, sk.max)}%;background:${sk.color}"></div>
      </div>
    </div>`;
  });

  container.innerHTML = fragments.join('');
}


// ---- MISIONES ----

function renderMisiones() {
  const wk = DateUtils.weekStart();
  const secretEl = el('secretCard');
  if (secretEl) secretEl.innerHTML = buildSecretCard(wk);

  renderListaMisiones(MISIONES.E, 'mE');
  renderListaMisiones(MISIONES.F, 'mF');
  renderListaMisiones(MISIONES.S, 'mS');
}

function renderListaMisiones(list, elId) {
  const container = el(elId);
  if (!container) return;

  const today = DateUtils.today();
  const todayMis = ST.mis[today] || {};

  container.innerHTML = list.map(m => {
    const done = !!todayMis[m.id];
    const tipHTML = m.tip
      ? `<div class="tooltip">
           <div class="tooltip-title">${m.tip.title}</div>
           ${m.tip.desc}
         </div>`
      : '';

    return `<div class="mrow">
      <div class="mchk${done ? ' done' : ''}"
           onclick="toggleMision('${m.id}',${m.xp},'${m.st}',${m.coins || 0})">
        ${done ? '✓' : ''}
      </div>
      <span class="mtxt${done ? ' done' : ''}">${m.t}</span>
      <span class="mstat">${m.st}</span>
      <span class="mxp">+${m.xp}${m.coins ? ' +' + m.coins + 'c' : ''}</span>
      ${tipHTML}
    </div>`;
  }).join('');
}

function buildSecretCard(wk) {
  if (!ST.mis[wk]) ST.mis[wk] = {};
  if (ST.mis[wk]._secretIdx === undefined) {
    ST.mis[wk]._secretIdx = Math.floor(Math.random() * MISIONES_SECRETAS.length);
  }

  const idx      = ST.mis[wk]._secretIdx;
  const revealed = !!ST.mis[wk]._secretRevealed;
  const done     = !!ST.mis[wk]._secretDone;

  const innerHTML = revealed
    ? `<div class="secret-desc">${MISIONES_SECRETAS[idx]}</div>
       ${done
         ? `<div style="color:var(--c3);font-size:11px;margin-top:6px">✦ Completada esta semana</div>`
         : `<button class="secret-btn" onclick="completeSecret('${wk}')">
              Completar — +${CONFIG.XP_MISION_SECRETA} XP +${CONFIG.COINS_MISION_SECRETA}c
            </button>`}`
    : `<button class="secret-btn" onclick="revealSecret('${wk}')">Revelar misión</button>`;

  return `<div class="secret-card">
    <div class="secret-icon">❓</div>
    <div class="secret-title">Misión Secreta Semanal</div>
    ${innerHTML}
  </div>`;
}

function showRankUp() {
  const rh  = RANGOS_HABITOS[ST.rankH];
  const rew = RECOMPENSAS_HABITOS.find(r => r.rang === rh.name);
  const banner = el('rankupBanner');
  if (!banner) return;

  banner.innerHTML = `<div class="rankup">
    <div class="rankup-animal">${rh.emoji}</div>
    <div class="rankup-title">¡Rango superado!</div>
    <div style="font-size:13px;color:var(--t1);margin-top:4px">
      Ahora eres: <strong>${rh.name}</strong> — ${rh.animal}
    </div>
    <div class="rankup-skills">
      <div style="font-size:10px;color:var(--t3);margin-bottom:4px">Habilidades desbloqueadas:</div>
      ${rh.skills.map(s => `<div class="skill-item">${s}</div>`).join('')}
    </div>
    ${rew ? `<div class="rankup-reward">🎁 Recompensa: ${rew.reward}</div>` : ''}
    <button class="secret-btn" style="margin-top:10px" onclick="this.closest('.rankup').remove()">
      Continuar
    </button>
  </div>`;

  Toast.show(`¡RANGO SUBIDO! ${rh.emoji} ${rh.name}`, '#ffd700');
}


// ---- RANGOS ----

function renderRangos() {
  buildRangList(RANGOS_HABITOS, 'rH',    ST.rankH, ST.starsH);
  buildRangList(RANGOS_TECNICO, 'rT',    ST.rankT, ST.starsT);
  buildRewList(RECOMPENSAS_HABITOS, 'rRewH', ST.rankH);
  buildRewList(RECOMPENSAS_TECNICO, 'rRewT', ST.rankT);
}

function buildRangList(list, elId, curIdx, curStars) {
  const container = el(elId);
  if (!container) return;

  container.innerHTML = list.map((r, i) => {
    const isCurrent = i === curIdx;
    const isPast    = i < curIdx;
    const numClass  = isCurrent ? 'rn-cur' : isPast ? 'rn-past' : 'rn-fut';
    const boxShadow = isCurrent ? `box-shadow:0 0 10px ${r.color}` : '';
    const nameColor = isCurrent ? r.color : 'inherit';
    const desc      = isCurrent
      ? starsHTML(curStars) + ' ' + (r.subs ? r.subs[Math.min(curStars, 2)] : (r.desc || ''))
      : (r.desc || r.subs?.[0] || '');

    return `<div class="rrow">
      <div class="rnum ${numClass}" style="${boxShadow}">${r.emoji}</div>
      <div>
        <div class="rname" style="color:${nameColor}">${r.name}</div>
        <div class="rdesc">${desc}</div>
      </div>
    </div>`;
  }).join('');
}

function buildRewList(list, elId, curRank) {
  const container = el(elId);
  if (!container) return;

  container.innerHTML = list.map((r, i) => {
    const unlocked = curRank > i + 1;
    const current  = curRank === i + 1;
    const numClass = unlocked ? 'rn-past' : current ? 'rn-cur' : 'rn-fut';
    const star     = (unlocked || current) ? '★' : '☆';
    const rew      = (unlocked || current) ? 'color:var(--c5)' : '';

    return `<div class="rrow">
      <div class="rnum ${numClass}">${star}</div>
      <div>
        <div class="rname" style="font-size:11px">${r.rang}</div>
        <div class="rdesc" style="${rew}">🎁 ${r.reward}</div>
      </div>
    </div>`;
  }).join('');
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

  const pd = PENALIZACIONES[Math.min(ST.rankH, PENALIZACIONES.length - 1)];
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

const ALTER_UNLOCK_RANK = 4; // Índice en RANGOS_HABITOS (Equilibrado = 4)

function renderAlter() {
  const container = el('alterContent');
  if (!container) return;

  if (ST.rankH < ALTER_UNLOCK_RANK) {
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
      Se desbloquean al llegar a <strong style="color:var(--c2)">Equilibrado</strong>
    </div>
    <div style="margin-top:10px">
      <span class="pill pill-h">Progreso: Rango ${ST.rankH + 1}/${ALTER_UNLOCK_RANK}</span>
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
  renderRangos();
  renderCalendario();
  renderZona();
  renderRuta();
  renderTienda();
  renderAlter();
}
