// ============================================================
// MÓDULO: EVENTS — Solo Leveling
// Único lugar con funciones invocadas desde onclick="" en el
// HTML. Orquesta: lógica de negocio → persistencia → render.
// ============================================================

// Variables de UI — no se persisten
let calMode = 'mark';
let calY = new Date().getFullYear();
let calM = new Date().getMonth();


// ---- NAVEGACIÓN ----

function nav(id, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
  const section = el('sec-' + id);
  if (section) section.classList.add('on');
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');

  // Render lazy: solo renderizar la sección activa
  const renders = {
    inicio:     renderInicio,
    misiones:   renderMisiones,
    rangos:     renderRangos,
    calendario: renderCalendario,
    zona:       renderZona,
    ruta:       renderRuta,
    tienda:     renderTienda,
    alter:      renderAlter,
  };
  if (renders[id]) renders[id]();
}


// ---- MISIONES ----

/**
 * Maneja el click de marcar/desmarcar una misión.
 * @param {string} statsStr - Stats separados por coma, ej: 'fuerza,claridad'
 */
function toggleMision(id, xp, statsStr, coins) {
  const stats  = statsStr ? statsStr.split(',') : [];
  const result = applyMissionToggle(id, xp, stats, coins);

  if (result.completed) {
    Toast.show(`+${xp} XP`, 'var(--c1)');
    const dayResult = applyDayCompletion();
    if (dayResult.completed) {
      if (dayResult.rankUp) showRankUp();
      Toast.show('¡Día completo! 🔥 Racha: ' + ST.racha, '#39ff14');
    }
  }

  saveState();
  renderMisiones();
  renderInicio();
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
  renderInicio();
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
  renderInicio();
  renderTienda();
}


// ---- ALTER EGOS ----

function selectAlter(id) {
  ST.alterActive = id;
  saveState();
  renderAlter();
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
