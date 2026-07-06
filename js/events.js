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


// ---- NAVEGACIÓN ----

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

function toggleMision(id, xp, statsStr, coins) {
  const stats  = statsStr ? statsStr.split(',') : [];
  const result = applyMissionToggle(id, xp, stats, coins);

  if (result.completed) {
    const coinsMsg = coins > 0 ? ` +${coins}c` : '';
    Toast.show(`+${xp} XP${coinsMsg}`, 'var(--c1)');
    const dayResult = applyDayCompletion();
    if (dayResult.completed) {
      Toast.show('¡Día completo! 🔥 Racha: ' + ST.racha, '#39ff14');
    }
  }

  saveState();
  renderMisiones();
  renderCalendario();
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

function saveProposito() {
  const input = el('propositoInput');
  if (!input) return;
  ST.proposito = input.value.trim();
  saveState();
  Toast.show('Propósito guardado ✦', 'var(--c3)');
  renderMisiones();
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


// ---- ZONA OSCURA ----

function toggleZona() {
  const fell = toggleZonaFall();
  Toast.show(
    fell ? '⚠️ Penalización activada' : '✦ Zona oscura limpia hoy',
    fell ? '#ff2d55' : 'var(--c3)'
  );
  saveState();
  renderZona();
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
