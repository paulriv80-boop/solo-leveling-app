// ============================================================
// MÓDULO: EVENTS — Presence
// Único lugar con funciones invocadas desde onclick="" en el
// HTML. Orquesta: lógica de negocio → persistencia → render.
// ============================================================

// Variables de UI — no se persisten
let calMode = 'mark';
let calY    = new Date().getFullYear();
let calM    = new Date().getMonth();
let rankAccordOpen = false;

// Contexto del selector de modo de juego
let _gameModeContext = 'settings'; // 'onboarding' | 'settings'
let _selectedMode    = null;


// ---- NAVEGACIÓN ----

function openAddMision() { /* TODO: implementar modal de nueva misión */ }


// ---- SETTINGS ----

function openSettings() {
  _renderSettingsMode();
  _syncSettingsPrefs();
  el('settingsOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSettings() {
  el('settingsOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function _renderSettingsMode() {
  const mc = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  const nameEl = el('cfgModeName');
  const tagEl  = el('cfgModeTagline');
  const imgEl  = el('cfgModeImg');
  if (nameEl) nameEl.textContent = mc.label;
  if (tagEl)  tagEl.textContent  = mc.tagline;
  if (imgEl)  imgEl.style.backgroundImage = `url('${mc.img}')`;
}

function _syncSettingsPrefs() {
  const p    = ST.settingsPrefs || {};
  const sync = (id, val) => { const e = document.getElementById(id); if (e) e.checked = !!val; };
  sync('prefNotifications', p.notifications);
  sync('prefAnimations',    p.animations !== false);
  sync('prefSounds',        p.sounds);
  sync('prefVibration',     p.vibration !== false);
}

function toggleSettingPref(key, checkbox) {
  if (!ST.settingsPrefs) ST.settingsPrefs = {};
  ST.settingsPrefs[key] = checkbox.checked;
  saveState();
}

function exportProgress() { Toast.show('Próximamente: exportar progreso', 'var(--t2)'); }
function importProgress() { Toast.show('Próximamente: importar respaldo',  'var(--t2)'); }


// ---- ONBOARDING & SELECTOR DE MODO ----

function openOnboarding() {
  _gameModeContext = 'onboarding';
  _selectedMode    = ST.gameMode;
  _syncModeCards();
  const nav  = el('gmoNav');
  const logo = el('gmoLogo');
  if (nav)  nav.style.display  = 'none';
  if (logo) logo.style.display = 'block';
  el('gameModeOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openGameModeSelect() {
  _gameModeContext = 'settings';
  _selectedMode    = ST.gameMode;
  _syncModeCards();
  const nav  = el('gmoNav');
  const logo = el('gmoLogo');
  if (nav)  nav.style.display  = 'flex';
  if (logo) logo.style.display = 'none';
  el('gameModeOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGameModeSelect() {
  el('gameModeOverlay')?.classList.remove('open');
  if (_gameModeContext === 'settings') {
    openSettings();
  } else {
    document.body.style.overflow = '';
  }
}

function selectModeCard(mode, btn) {
  _selectedMode = mode;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  const confirmBtn = el('gmoConfirmBtn');
  if (confirmBtn) confirmBtn.disabled = false;
}

function _syncModeCards() {
  document.querySelectorAll('.mode-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.mode === _selectedMode);
  });
  const confirmBtn = el('gmoConfirmBtn');
  if (confirmBtn) confirmBtn.disabled = false;
}

function confirmGameMode() {
  if (!_selectedMode) return;
  ST.gameMode       = _selectedMode;
  ST.onboardingDone = true;
  saveState();
  el('gameModeOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
  if (_gameModeContext === 'settings') {
    _renderSettingsMode();
    openSettings();
  }
  renderAll();
}


// ---- PENALIZACIÓN ----

function openPenaltyScreen() {
  const tasks   = (ST.penalty.tasks || [])
    .map(id => CONFIG.PENALIZACIONES.find(p => p.id === id))
    .filter(Boolean);
  const isMonje = ST.gameMode === 'monje';

  const subEl = el('penaltySub');
  if (subEl) {
    subEl.textContent = isMonje
      ? 'La disciplina exige constancia. Antes de continuar deberás completar las siguientes pruebas.'
      : 'Ayer no cumpliste con la disciplina mínima. Antes de continuar deberás completar la siguiente prueba.';
  }

  const tasksEl = el('penaltyTasks');
  if (tasksEl) {
    tasksEl.innerHTML = tasks.map(t =>
      `<div class="penalty-task" data-id="${t.id}" onclick="togglePenaltyTask('${t.id}',this)">
         <div class="penalty-task-check"><i class="ti ti-check"></i></div>
         <div class="penalty-task-text">${t.text}</div>
       </div>`
    ).join('');
  }

  const ctaEl = el('penaltyCta');
  if (ctaEl) ctaEl.disabled = true;

  el('penaltyScreen')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function togglePenaltyTask(id, taskEl) {
  taskEl.classList.toggle('done');
  const completed = document.querySelectorAll('.penalty-task.done').length;
  const total     = document.querySelectorAll('.penalty-task').length;
  const ctaEl = document.getElementById('penaltyCta');
  if (ctaEl) ctaEl.disabled = completed < total;
}

function completePenalty() {
  ST.penalty.pending   = false;
  ST.penalty.completed = ST.penalty.tasks;
  saveState();
  el('penaltyScreen')?.classList.remove('open');
  document.body.style.overflow = '';
  renderAll();
}

function nav(id, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
  const section = el('sec-' + id);
  if (section) section.classList.add('on');
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  const renders = {
    misiones:  renderMisiones,
    stats:     renderStats,
    comunidad: renderComunidad,
    tools:     renderTools,
    menu:      renderMenu,
  };
  if (renders[id]) renders[id]();
}


// ---- MISIONES ----

function _calcXpGained(xp) {
  const mc = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  return Math.round(xp * mc.xpMult);
}

function toggleMision(id, xp, cats, coins) {
  const result = applyMissionToggle(id, xp, cats, coins);

  if (result.completed) {
    const coinsMsg = result.coinsGained > 0 ? ` +${result.coinsGained}c` : '';
    Toast.show(`+${result.xpGained} XP${coinsMsg}`, 'var(--c1)');
    const dayResult = applyDayCompletion();
    if (dayResult.completed) {
      Toast.show('¡Día completo! 🔥 Racha: ' + ST.racha, '#39ff14');
    }
  }

  saveState();
  renderMisiones();
  renderCalendario();
}

// Swipe derecha — marcar hecho (llamado desde attachSwipeHandlers)
function misionHechoById(id, xp, cats, coins) {
  const result = applyMissionToggle(id, xp, cats, coins);
  const coinsMsg = result.coinsGained > 0 ? ` +${result.coinsGained}c` : '';
  Toast.show(`+${result.xpGained} XP${coinsMsg}`, 'var(--c1)');
  const dayResult = applyDayCompletion();
  if (dayResult.completed) {
    Toast.show('¡Día completo! Racha: ' + ST.racha, '#39ff14');
  }
  saveState();
  renderMisiones();
  renderCalendario();
}

// Swipe izquierda — marcar saltado (llamado desde attachSwipeHandlers)
function misionSaltarById(id) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};

  // Si estaba marcada como 'done', revertir XP y atributos antes de pasar a skip
  if (ST.mis[today][id] === 'done') {
    let m = MISIONES.find(x => x.id === id);
    if (!m && id.startsWith('pu_')) {
      m = { xp: 25, coins: 2, cats: [{cat:'mente',stars:3},{cat:'enfoque',stars:2},{cat:'vinculo',stars:1}] };
    }
    if (m) applyMissionToggle(id, m.xp, m.cats, m.coins);
  }

  ST.mis[today][id] = 'skip';
  saveState();
  renderMisiones();
}

// Cambiar tab activo en misiones
function switchMisionTab(tab, el) {
  _mActiveTab = tab;
  document.querySelectorAll('.m-tab').forEach(t => t.classList.remove('on'));
  if (el) el.classList.add('on');
  renderMisiones();
}

// Toggle misión opcional (agregar / quitar de activeMissions)
function toggleOptionalMission(id) {
  const idx = (ST.activeMissions || []).indexOf(id);
  if (idx === -1) {
    ST.activeMissions = [...(ST.activeMissions || []), id];
  } else {
    ST.activeMissions = ST.activeMissions.filter(x => x !== id);
  }
  saveState();
  renderMisionesOpcionales();
  renderMisiones();
}

// Renderizar panel de misiones opcionales (m11-m20)
function renderMisionesOpcionales() {
  const container = el('mOpcionalesBody');
  if (!container) return;
  const optional = MISIONES.filter(m => m.hidden);
  container.innerHTML = optional.map(m => {
    const isActive = (ST.activeMissions || []).includes(m.id);
    return `<div class="m-opt-row">
      <span class="m-opt-name">${m.name}</span>
      <span class="m-opt-xp">+${m.xp} XP</span>
      <button class="m-opt-toggle${isActive ? ' on' : ''}" onclick="toggleOptionalMission('${m.id}')"></button>
    </div>`;
  }).join('');
}

// Mostrar/ocultar panel de opcionales
function toggleOpcionalesPanel() {
  const body    = el('mOpcionalesBody');
  const chevron = el('mOpcionalesChevron');
  if (!body) return;
  const open = body.classList.toggle('open');
  if (chevron) chevron.textContent = open ? '▴' : '▾';
  if (open) renderMisionesOpcionales();
}


// ---- PANEL EXPANDIBLE POR MISIÓN ----

function toggleMisionDetail(id, e) {
  e.stopPropagation();
  const wrap   = document.querySelector(`.mc-wrap[data-id="${id}"]`);
  const isOpen = wrap?.classList.toggle('expanded');
  if (isOpen) _renderMisionDetail(id);
}

function _renderMisionDetail(id) {
  const calEl = el('mc-cal-' + id);
  if (calEl && !calEl.dataset.rendered) {
    const today       = DateUtils.today();
    const now         = new Date();
    const year        = now.getFullYear();
    const month       = now.getMonth();
    const firstDay    = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Offset lunes=0: domingo(0)→6, lunes(1)→0, …
    const startOffset = (firstDay.getDay() + 6) % 7;

    let doneMes = 0, html = '';

    for (let i = 0; i < startOffset; i++) {
      html += `<div class="mc-cal-cell mc-cal-cell--empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const key   = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const state = (ST.mis[key] || {})[id];
      const cls   = state === 'done' ? 'done' : state === 'skip' ? 'skip' : 'none';
      const todayMark = key === today ? ' mc-cal-cell--today' : '';
      if (state === 'done') doneMes++;
      html += `<div class="mc-cal-cell mc-cal-cell--${cls}${todayMark}" title="${key}">${day}</div>`;
    }

    calEl.innerHTML = html;
    calEl.dataset.rendered = '1';

    let total90 = 0;
    for (const dateKey in ST.mis) {
      if ((ST.mis[dateKey] || {})[id] === 'done') total90++;
    }
    const eff    = Math.round((doneMes / daysInMonth) * 100);
    const streak = misionStreak(id);

    setText('mc-eff-'     + id, eff + '%');
    setText('mc-streak2-' + id, streak + 'd');
    setText('mc-total-'   + id, total90);
  }

  const rem = (ST.reminders || {})[id];
  const chk = el('mc-rem-' + id);
  if (chk) {
    chk.checked = !!(rem && rem.enabled);
    const cfg = el('mc-rem-cfg-' + id);
    if (cfg) cfg.classList.toggle('visible', !!(rem && rem.enabled));
    const timeEl = el('mc-rem-time-' + id);
    if (timeEl && rem && rem.time) timeEl.value = rem.time;
  }
  _renderDayPills(id, (rem && rem.days) ? rem.days : []);
}

function _renderDayPills(id, activeDays) {
  const daysEl = el('mc-rem-days-' + id);
  if (!daysEl) return;
  const DAYS = [['L','lun'],['M','mar'],['X','mie'],['J','jue'],['V','vie'],['S','sab'],['D','dom']];
  daysEl.innerHTML = DAYS.map(([label, key]) =>
    `<button class="mc-day-pill${activeDays.includes(key) ? ' active' : ''}"
             onclick="toggleDay('${id}','${key}',this)">${label}</button>`
  ).join('');
}

function toggleDay(id, day, btn) {
  if (!ST.reminders) ST.reminders = {};
  if (!ST.reminders[id]) ST.reminders[id] = { enabled: false, time: '07:00', days: [] };
  const days = ST.reminders[id].days;
  const idx  = days.indexOf(day);
  if (idx > -1) days.splice(idx, 1); else days.push(day);
  btn.classList.toggle('active');
  saveState();
}

function toggleReminder(id, checkbox) {
  if (!ST.reminders) ST.reminders = {};
  if (!ST.reminders[id]) ST.reminders[id] = { enabled: false, time: '07:00', days: [] };
  ST.reminders[id].enabled = checkbox.checked;
  const cfg = el('mc-rem-cfg-' + id);
  if (cfg) cfg.classList.toggle('visible', checkbox.checked);
  saveState();
}

function saveReminder(id) {
  if (!ST.reminders) ST.reminders = {};
  if (!ST.reminders[id]) ST.reminders[id] = { enabled: true, time: '07:00', days: [] };
  const timeEl = el('mc-rem-time-' + id);
  if (timeEl) ST.reminders[id].time = timeEl.value;
  saveState();
}


// ---- COLLAPSIBLES ----

function toggleCollapse(bodyId, chevronId) {
  const body    = el(bodyId);
  const chevron = el(chevronId);
  if (body) {
    const isOpen = body.classList.toggle('open');
    if (chevron) chevron.textContent = isOpen ? '▴' : '▾';
  }
}

function toggleRankAccord() {
  rankAccordOpen = !rankAccordOpen;
  const body    = el('rankAccordBody');
  const chevron = el('dRankChevron');
  if (body)    body.classList.toggle('open', rankAccordOpen);
  if (chevron) chevron.textContent = rankAccordOpen ? '▴' : '▾';
}

// ---- PROPÓSITO CRUD ----

function openPropositoForm() {
  el('propositoModal')?.classList.add('open');
  el('propNombreInput')   && (el('propNombreInput').value = '');
  el('propDescInput')     && (el('propDescInput').value = '');
  el('propObjetivoInput') && (el('propObjetivoInput').value = '');
  document.body.style.overflow = 'hidden';
}

function closePropositoForm() {
  el('propositoModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function saveProposito() {
  const nombre   = (el('propNombreInput')?.value    || '').trim();
  const desc     = (el('propDescInput')?.value      || '').trim();
  const objetivo = (el('propObjetivoInput')?.value  || '').trim();
  const frec     = el('propFrecSelect')?.value      || 'diario';

  if (!nombre) { Toast.show('Escribe un nombre', '#ff6b35'); return; }

  const nuevoProposito = {
    id:        Date.now().toString(36),
    name:      nombre,
    desc:      desc,
    objetivo:  objetivo,
    frecuencia:frec,
    progreso:  0,
    created:   DateUtils.today(),
  };

  ST.propositos = [...(ST.propositos || []), nuevoProposito];
  saveState();
  closePropositoForm();
  Toast.show('Propósito creado ✦', 'var(--c2)');
  renderMisiones();
}

function deleteProposito(propId) {
  ST.propositos = (ST.propositos || []).filter(p => p.id !== propId);
  const today = DateUtils.today();
  if (ST.mis[today]) delete ST.mis[today]['pu_' + propId];
  saveState();
  renderMisiones();
}


// ---- SWIPE HANDLERS estilo Tinder ----

function attachSwipeHandlers(activeTab) {
  const THRESHOLD = 80;

  document.querySelectorAll('.mc-wrap').forEach(card => {
    if (card._swipeAttached) return;
    card._swipeAttached = true;

    const front = card.querySelector('.mc-front');
    if (!front) return;

    if (activeTab !== 'todos') {
      card.addEventListener('click', e => {
        if (e.target.closest('.mc-confirm-ov')) return;
        front.classList.toggle('show-confirm');
      });
      return;
    }

    const overlayDone = card.querySelector('.mc-overlay--done');
    const overlaySkip = card.querySelector('.mc-overlay--skip');

    let startX = 0, startY = 0, currentX = 0, dirLocked = false, isHoriz = false;

    card.addEventListener('touchstart', e => {
      startX    = e.touches[0].clientX;
      startY    = e.touches[0].clientY;
      currentX  = 0;
      dirLocked = false;
      isHoriz   = false;
      front.style.transition = 'none';
      front.style.opacity    = '1';
      if (overlayDone) { overlayDone.style.transition = 'none'; overlayDone.style.opacity = '0'; }
      if (overlaySkip) { overlaySkip.style.transition = 'none'; overlaySkip.style.opacity = '0'; }
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (!dirLocked && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        dirLocked = true;
        isHoriz   = Math.abs(dx) > Math.abs(dy);
      }
      if (!isHoriz) return;

      e.preventDefault();
      currentX = dx;
      front.style.transform = `translateX(${currentX}px)`;

      if (currentX > 0) {
        if (overlayDone) overlayDone.style.opacity = Math.min(currentX / THRESHOLD, 1);
        if (overlaySkip) overlaySkip.style.opacity = '0';
      } else {
        if (overlaySkip) overlaySkip.style.opacity = Math.min(-currentX / THRESHOLD, 1);
        if (overlayDone) overlayDone.style.opacity = '0';
      }
    }, { passive: false });

    card.addEventListener('touchend', () => {
      if (!isHoriz) { currentX = 0; return; }

      const id    = card.dataset.id;
      const xp    = parseInt(card.dataset.xp, 10)    || 0;
      const coins = parseInt(card.dataset.coins, 10)  || 0;
      let cats = [];
      try { cats = JSON.parse(card.dataset.cats || '[]'); } catch(e) {}

      const trans = 'transform .3s ease, opacity .3s ease';
      front.style.transition = trans;
      if (overlayDone) overlayDone.style.transition = 'opacity .3s ease';
      if (overlaySkip) overlaySkip.style.transition = 'opacity .3s ease';

      if (currentX > THRESHOLD) {
        front.style.transform = 'translateX(420px)';
        front.style.opacity   = '0';
        if (overlayDone) overlayDone.style.opacity = '1';
        const xpFloat = document.createElement('div');
        xpFloat.className = 'xp-float';
        xpFloat.textContent = '+' + _calcXpGained(xp) + ' XP';
        xpFloat.style.cssText = 'position:fixed;left:50%;top:50%;z-index:9999';
        document.body.appendChild(xpFloat);
        setTimeout(() => xpFloat.remove(), 700);
        setTimeout(() => misionHechoById(id, xp, cats, coins), 310);
      } else if (currentX < -THRESHOLD) {
        front.style.transform = 'translateX(-420px)';
        front.style.opacity   = '0';
        if (overlaySkip) overlaySkip.style.opacity = '1';
        setTimeout(() => misionSaltarById(id), 310);
      } else {
        front.style.transform = 'translateX(0)';
        if (overlayDone) overlayDone.style.opacity = '0';
        if (overlaySkip) overlaySkip.style.opacity = '0';
      }
      currentX = 0;
    });
  });
}

function devolverMision(id, event) {
  if (event) event.stopPropagation();
  const today = DateUtils.today();
  if (!ST.mis[today]) return;
  const status = ST.mis[today][id];
  if (status === 'done') {
    let m = MISIONES.find(x => x.id === id);
    if (!m && id.startsWith('pu_')) {
      m = { xp: 25, coins: 2, cats: [{cat:'mente',stars:3},{cat:'enfoque',stars:2},{cat:'vinculo',stars:1}] };
    }
    if (m) applyMissionToggle(id, m.xp, m.cats, m.coins);
  } else if (status === 'skip') {
    delete ST.mis[today][id];
  }
  saveState();
  renderMisiones();
}

function cerrarConfirm(event) {
  if (event) event.stopPropagation();
  event.target.closest('.mc-wrap')?.querySelector('.mc-front')?.classList.remove('show-confirm');
}


// ---- CALENDARIO ----

function setCM(mode, btn) {
  calMode = mode;
  document.querySelectorAll('.cmb').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
}

function chM(dir) {
  calM += dir;
  if (calM < 0)  { calM = 11; calY--; }
  if (calM > 11) { calM = 0;  calY++; }
  renderCalendario();
}

function clickDay(k) {
  applyCalendarDayClick(k, calMode);

  if (calMode === 'boss') {
    Toast.show('¡Boss fight marcado! ⚔', '#ffd700');
  } else if (calMode === 'light') {
    Toast.show('Entrenamiento ligero marcado', 'var(--c1)');
  }

  saveState();
  renderCalendario();
  renderMisiones();
}


// ---- TIENDA ----

function buyReward(cost, name) {
  const success = purchaseReward(cost);
  if (!success) {
    Toast.show('Monedas insuficientes', '#ff2d55');
    return;
  }
  Toast.show(`¡${name} desbloqueado! 🎉`, '#ffd700');
  saveState();
  renderTienda();
}


// ---- ALTER EGOS ----

function selectAlter(id) {
  ST.alterActive = id;
  saveState();
  renderAlter();
}


// ---- OVERLAY ATRIBUTOS ----

function openAtributosOverlay() {
  renderAtributosOverlay();
  el('attrsOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAtributosOverlay() {
  el('attrsOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- OVERLAY RANGO (full-screen) ----

function openRangoSheet() {
  renderRangoSheet();
  el('rangoOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRangoSheet() {
  el('rangoOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- ALTER EGO OVERLAY ----

function openAlterOverlay() {
  renderAlterOverlay();
  el('alterOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAlterOverlay() {
  el('alterOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- TROFEO OVERLAY ----

function openTrofeoOverlay() {
  renderTrofeoOverlay();
  el('trofeoOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTrofeoOverlay() {
  el('trofeoOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- TIENDA OVERLAY (en Progreso) ----

function openTiendaOverlay() {
  renderTiendaOverlay();
  el('tiendaOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTiendaOverlay() {
  el('tiendaOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}


// ---- ATRIBUTOS COLAPSABLES ----

function toggleCatBlock(blk) {
  blk.classList.toggle('open');
}


// ---- RESET ----

function showReset() {
  el('resetOverlay')?.classList.add('show');
  el('resetModal')?.classList.add('show');
  const input = el('resetInput');
  if (input) input.value = '';
}

function hideReset() {
  el('resetOverlay')?.classList.remove('show');
  el('resetModal')?.classList.remove('show');
}

function confirmReset() {
  const input = el('resetInput');
  if (!input || input.value.trim() !== 'RESET') {
    Toast.show('Escribe exactamente RESET', '#ff6b35');
    return;
  }

  Storage.clear();
  ST = JSON.parse(JSON.stringify(DEFAULT_STATE));
  ST.lastVisit = DateUtils.today();

  hideReset();
  renderAll();
  Toast.show('Progreso reseteado', '#ff2d55');
}
