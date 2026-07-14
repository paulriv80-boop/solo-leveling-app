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

// ---- RUTINA WIZARD ----

let _rutinaStep     = 0;
let _selectedPilarId = null;

function openRutina() {
  _rutinaStep = ST.rutina && ST.rutina.configured ? 5 : 0;
  _renderRutinaStep(_rutinaStep);
  el('rutinaOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRutina() {
  el('rutinaOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
  _selectedPilarId = null;
}

function rutinaNext() {
  if (_rutinaStep === 2) _saveGoal();
  _rutinaStep = Math.min(_rutinaStep + 1, 5);
  _renderRutinaStep(_rutinaStep);
}

function rutinaBack() {
  _rutinaStep = Math.max(_rutinaStep - 1, 0);
  _renderRutinaStep(_rutinaStep);
}

function rutinaGoStep(step) {
  _rutinaStep = step;
  _renderRutinaStep(step);
}

function finishRutina() {
  if (!ST.rutina) ST.rutina = {};
  ST.rutina.configured = true;
  saveState();
  closeRutina();
  renderMisiones();
  Toast.show('Sistema activado ✦', 'var(--c1)');
}

function _renderRutinaStep(step) {
  for (let i = 0; i <= 5; i++) el(`rutinaStep${i}`)?.classList.remove('active');
  el(`rutinaStep${step}`)?.classList.add('active');

  const backBtn = el('rutinaBackBtn');
  if (backBtn) backBtn.style.visibility = step > 0 ? 'visible' : 'hidden';

  _updateRutinaDots(step);

  if (step === 1) _renderPilaresGrid();
  if (step === 2) _renderGoalForm();
  if (step === 3) _renderCaminoList();
  if (step === 4) _renderGuardianesGrid();
  if (step === 5) _renderMapa();

  el(`rutinaStep${step}`)?.scrollTo(0, 0);
}

function _updateRutinaDots(currentStep) {
  const dotsEl = el('rutinaDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = [1,2,3,4,5].map(i =>
    `<div class="rutina-dot ${currentStep === i ? 'active' : ''}"></div>`
  ).join('');
}

// — Pilares —
function _renderPilaresGrid() {
  const grid = el('pilaresGrid');
  if (!grid) return;
  grid.innerHTML = MISIONES.map(m => {
    const isActive = (ST.activeMissions || []).includes(m.id);
    const pilarCfg = (ST.pilares || {})[m.id] || {};
    const timeStr  = pilarCfg.time ? `⏰ ${pilarCfg.time}` : '';
    const bgStyle  = m.img
      ? `background-image:url('${m.img}')`
      : `background:linear-gradient(135deg,${_mCatGrad(m.cats?.[0]?.cat)})`;
    return `<div class="pilar-card ${isActive ? 'active' : ''}" data-id="${m.id}"
        onclick="togglePilarCard('${m.id}',this)">
      <div class="pilar-card-bg" style="${bgStyle}"></div>
      <div class="pilar-card-overlay"></div>
      <div class="pilar-card-body">
        <div class="pilar-card-name">${m.name}</div>
        <div class="pilar-card-freq">${timeStr || (m.freq || '')}</div>
      </div>
      <div class="pilar-card-check" onclick="deactivatePilar('${m.id}',event)">
        <i class="ti ti-check"></i>
      </div>
    </div>`;
  }).join('');
  const timeRow = el('pilarTimeRow');
  if (timeRow) timeRow.style.display = 'none';
  _selectedPilarId = null;
}

function _mCatGrad(cat) {
  const g = {
    cuerpo:   '#180008,#28081a', mente:    '#000e1a,#00182e',
    presencia:'#071a0e,#00100e', enfoque:  '#181200,#0e0a00',
    vinculo:  '#10001a,#1a0028',
  };
  return g[cat] || '#111,#1a1a2e';
}

function togglePilarCard(id, cardEl) {
  if (cardEl.classList.contains('active')) {
    _showPilarTimePicker(id);
    return;
  }
  cardEl.classList.add('active');
  ST.activeMissions = [...new Set([...(ST.activeMissions || []), id])];
  _showPilarTimePicker(id);
  saveState();
}

function deactivatePilar(id, event) {
  event.stopPropagation();
  ST.activeMissions = (ST.activeMissions || []).filter(x => x !== id);
  const card = document.querySelector(`.pilar-card[data-id="${id}"]`);
  if (card) card.classList.remove('active');
  if (_selectedPilarId === id) {
    const timeRow = el('pilarTimeRow');
    if (timeRow) timeRow.style.display = 'none';
    _selectedPilarId = null;
  }
  saveState();
}

function _showPilarTimePicker(id) {
  const m = MISIONES.find(x => x.id === id);
  if (!m) return;
  _selectedPilarId = id;
  const nameEl  = el('pilarTimeName');
  const inputEl = el('pilarTimeInput');
  const rowEl   = el('pilarTimeRow');
  if (nameEl)  nameEl.textContent = m.name;
  if (inputEl) inputEl.value = ((ST.pilares || {})[id] || {}).time || '';
  if (rowEl)   rowEl.style.display = 'flex';
}

function savePilarTime() {
  if (!_selectedPilarId) return;
  const val = el('pilarTimeInput')?.value || null;
  if (!ST.pilares) ST.pilares = {};
  if (!ST.pilares[_selectedPilarId]) ST.pilares[_selectedPilarId] = {};
  ST.pilares[_selectedPilarId].time = val;
  saveState();
  const freqEl = document.querySelector(`.pilar-card[data-id="${_selectedPilarId}"] .pilar-card-freq`);
  if (freqEl) freqEl.textContent = val
    ? `⏰ ${val}`
    : (MISIONES.find(m => m.id === _selectedPilarId)?.freq || '');
}

// — Goal —
function _renderGoalForm() {
  const textEl = el('goalText');
  const descEl = el('goalDesc');
  if (textEl) textEl.value = (ST.goal || {}).text || '';
  if (descEl) descEl.value = (ST.goal || {}).desc || '';
  const caminoSub = el('caminoSub');
  if (caminoSub) caminoSub.textContent = ST.goal?.text
    ? `Los pasos para lograr: ${ST.goal.text}`
    : 'Los pasos que debes dar para llegar a tu Goal.';
}

function _saveGoal() {
  const text = (el('goalText')?.value || '').trim();
  const desc = (el('goalDesc')?.value || '').trim();
  if (!ST.goal) ST.goal = { text: '', desc: '', createdAt: null };
  ST.goal.text = text;
  ST.goal.desc = desc;
  if (text && !ST.goal.createdAt) ST.goal.createdAt = DateUtils.today();
  saveState();
  const caminoSub = el('caminoSub');
  if (caminoSub) caminoSub.textContent = text
    ? `Los pasos para lograr: ${text}`
    : 'Los pasos que debes dar para llegar a tu Goal.';
}

// — Camino —
function _renderCaminoList() {
  const list = el('caminoList');
  if (!list) return;
  const steps = ST.camino || [];
  list.innerHTML = steps.length ? steps.map(s =>
    `<div class="camino-step-card ${s.done ? 'done' : ''}" data-id="${s.id}">
       <div class="camino-step-check" onclick="toggleCaminoStepDone('${s.id}')">
         ${s.done ? '<i class="ti ti-check"></i>' : ''}
       </div>
       <div class="camino-step-info">
         <div class="camino-step-name">${s.name}</div>
         <div class="camino-step-meta">${s.freq}${s.time ? ' · ' + s.time : ''}</div>
       </div>
       <button style="background:transparent;border:none;color:var(--t3);cursor:pointer;font-size:16px;padding:4px"
         onclick="deleteCaminoStep('${s.id}')"><i class="ti ti-x"></i></button>
     </div>`
  ).join('') : '<div style="color:var(--t3);font-size:12px;text-align:center;padding:20px 0">Añade el primer paso de tu camino</div>';
  el('caminoForm')?.classList.remove('open');
}

function showCaminoForm() {
  const form = el('caminoForm');
  if (form) { form.classList.add('open'); el('caminoNombre')?.focus(); }
}

function saveCaminoStep() {
  const name = (el('caminoNombre')?.value || '').trim();
  if (!name) { Toast.show('Escribe un nombre para el paso', 'var(--c4)'); return; }
  const step = {
    id:          Date.now().toString(36),
    name,
    desc:        '',
    time:        el('caminoTime')?.value || null,
    freq:        el('caminoFreq')?.value || 'diario',
    duration:    null,
    reminderOn:  false,
    reminderDays:[],
    done:        false,
    createdAt:   DateUtils.today(),
  };
  ST.camino = [...(ST.camino || []), step];
  saveState();
  if (el('caminoNombre')) el('caminoNombre').value = '';
  if (el('caminoTime'))   el('caminoTime').value   = '';
  el('caminoForm')?.classList.remove('open');
  _renderCaminoList();
}

function toggleCaminoStepDone(id) {
  const step = (ST.camino || []).find(s => s.id === id);
  if (!step) return;
  step.done = !step.done;
  saveState();
  _renderCaminoList();
}

function deleteCaminoStep(id) {
  ST.camino = (ST.camino || []).filter(s => s.id !== id);
  const prefix = 'ca_' + id;
  Object.keys(ST.mis).forEach(date => { delete ST.mis[date][prefix]; });
  saveState();
  _renderCaminoList();
  renderMisiones();
}

// — Guardianes —
function _renderGuardianesGrid() {
  const grid = el('guardianesGrid');
  if (!grid) return;
  const activeIds = (ST.guardianes || []).map(g => g.id);

  let html = GUARDIANES_DEFAULT.map(g => {
    const isActive = activeIds.includes(g.id);
    return `<div class="guardian-card ${isActive ? 'active' : ''}" data-id="${g.id}"
        onclick="toggleGuardian('${g.id}',this)">
      <div class="guardian-card-icon"><i class="ti ${g.icon}"></i></div>
      <div class="guardian-card-name">${g.name}</div>
      <div class="guardian-card-check"><i class="ti ti-check"></i></div>
    </div>`;
  }).join('');

  (ST.guardianes || []).filter(g => g.custom).forEach(g => {
    html += `<div class="guardian-card active" data-id="${g.id}">
      <div class="guardian-card-icon"><i class="ti ti-shield"></i></div>
      <div class="guardian-card-name">${g.name}</div>
      <div class="guardian-card-check"><i class="ti ti-check"></i></div>
    </div>`;
  });

  html += `<div class="guardian-card guardian-card--add" onclick="addCustomGuardian()">
    <div class="guardian-card-icon"><i class="ti ti-plus"></i></div>
    <div class="guardian-card-name">Otro</div>
  </div>`;

  grid.innerHTML = html;
}

function toggleGuardian(id, cardEl) {
  const existing = (ST.guardianes || []).find(g => g.id === id);
  if (existing) {
    ST.guardianes = ST.guardianes.filter(g => g.id !== id);
    cardEl.classList.remove('active');
  } else {
    const def = GUARDIANES_DEFAULT.find(g => g.id === id);
    ST.guardianes = [...(ST.guardianes || []), {
      id, name: def?.name || id, icon: def?.icon || 'ti-shield',
      custom: false, createdAt: DateUtils.today(),
    }];
    cardEl.classList.add('active');
  }
  saveState();
}

function addCustomGuardian() {
  const name = (prompt('Nombre del guardián:') || '').trim();
  if (!name) return;
  const id = 'gd_' + Date.now().toString(36);
  ST.guardianes = [...(ST.guardianes || []), {
    id, name, icon: 'ti-shield', custom: true, createdAt: DateUtils.today(),
  }];
  saveState();
  _renderGuardianesGrid();
}

// — Mapa —
function _renderMapa() {
  const mapa = el('rutinaMapa');
  if (!mapa) return;
  const activePilares = MISIONES.filter(m => (ST.activeMissions || []).includes(m.id));
  const goal          = ST.goal?.text || '—';
  const caminoSteps   = ST.camino    || [];
  const guardianes    = ST.guardianes || [];

  mapa.innerHTML = `
    <div class="mapa-node mapa-node--pilares" style="width:100%">
      <button class="mapa-edit-btn" onclick="rutinaGoStep(1)"><i class="ti ti-pencil"></i></button>
      <div class="mapa-node-header">
        <span class="mapa-node-icon">🌳</span>
        <span class="mapa-node-label">Pilares</span>
      </div>
      <div class="mapa-node-title">${activePilares.length} hábitos activos</div>
      <div class="mapa-node-chips">
        ${activePilares.slice(0,5).map(m => `<span class="mapa-chip">${m.name}</span>`).join('')}
        ${activePilares.length > 5 ? `<span class="mapa-chip">+${activePilares.length - 5}</span>` : ''}
      </div>
    </div>
    <div class="mapa-connector"></div>
    <div class="mapa-node mapa-node--goal" style="width:100%">
      <button class="mapa-edit-btn" onclick="rutinaGoStep(2)"><i class="ti ti-pencil"></i></button>
      <div class="mapa-node-header">
        <span class="mapa-node-icon">🎯</span>
        <span class="mapa-node-label">Goal</span>
      </div>
      <div class="mapa-node-title">${goal}</div>
      ${ST.goal?.desc ? `<p style="font-size:11px;color:var(--t3);margin:6px 0 0;line-height:1.4">${ST.goal.desc}</p>` : ''}
    </div>
    <div class="mapa-connector"></div>
    <div class="mapa-node mapa-node--camino" style="width:100%">
      <button class="mapa-edit-btn" onclick="rutinaGoStep(3)"><i class="ti ti-pencil"></i></button>
      <div class="mapa-node-header">
        <span class="mapa-node-icon">🛤</span>
        <span class="mapa-node-label">Camino</span>
      </div>
      <div class="mapa-node-title">${caminoSteps.length} pasos definidos</div>
      <div class="mapa-node-chips">
        ${caminoSteps.map(s => `<span class="mapa-chip" ${s.done ? 'style="opacity:.4"' : ''}>${s.done ? '✓ ' : ''}${s.name}</span>`).join('')}
      </div>
    </div>
    <div class="mapa-connector"></div>
    <div class="mapa-node mapa-node--guardianes" style="width:100%">
      <button class="mapa-edit-btn" onclick="rutinaGoStep(4)"><i class="ti ti-pencil"></i></button>
      <div class="mapa-node-header">
        <span class="mapa-node-icon">🌑</span>
        <span class="mapa-node-label">Guardianes</span>
      </div>
      <div class="mapa-node-title">${guardianes.length} guardando integridad</div>
      <div class="mapa-node-chips">
        ${guardianes.map(g => `<span class="mapa-chip">${g.name}</span>`).join('')}
      </div>
    </div>`;
}

// — Guardianes vista diaria —
function toggleGuardianDay(id, status) {
  applyGuardianToggle(id, status);
  saveState();
  renderMisiones();
}


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

function debugSimulatePenalty() {
  const modeConf = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  if (modeConf.penaltyCount === 0) {
    Toast.show('El Modo Normal no tiene penalizaciones', 'var(--t2)');
    return;
  }
  const pool  = [...CONFIG.PENALIZACIONES].sort(() => Math.random() - 0.5);
  const tasks = pool.slice(0, modeConf.penaltyCount).map(p => p.id);
  ST.penalty  = { pending: true, date: DateUtils.today(), tasks, completed: [], lastIds: tasks };
  saveState();
  closeSettings();
  openPenaltyScreen();
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
    if (!m && (id.startsWith('pu_') || id.startsWith('ca_'))) {
      m = { xp: 25, coins: 2, cats: [{cat:'enfoque',stars:3},{cat:'mente',stars:2}] };
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
    if (!m && (id.startsWith('pu_') || id.startsWith('ca_'))) {
      m = { xp: 25, coins: 2, cats: [{cat:'enfoque',stars:3},{cat:'mente',stars:2}] };
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
  closeSettings(); // cerrar settings si está abierta
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
