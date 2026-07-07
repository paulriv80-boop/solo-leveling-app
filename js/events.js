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

function toggleMision(id, xp, cats, coins) {
  const result = applyMissionToggle(id, xp, cats, coins);

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

// "Hecho" desde swipe card
function misionHecho(btn) {
  const wrap  = btn.closest('.mc-wrap');
  if (!wrap) return;
  const id    = wrap.dataset.id;
  const xp    = parseInt(wrap.dataset.xp, 10) || 0;
  const coins = parseInt(wrap.dataset.coins, 10) || 0;
  let cats = [];
  try { cats = JSON.parse(wrap.dataset.cats || '[]'); } catch(e) {}

  applyMissionToggle(id, xp, cats, coins);
  const coinsMsg = coins > 0 ? ` +${coins}c` : '';
  Toast.show(`+${xp} XP${coinsMsg}`, 'var(--c1)');
  const dayResult = applyDayCompletion();
  if (dayResult.completed) {
    Toast.show('¡Día completo! 🔥 Racha: ' + ST.racha, '#39ff14');
  }

  saveState();
  renderMisiones();
  renderCalendario();
}

// "Saltar" desde swipe card
function misionSaltar(btn) {
  const wrap = btn.closest('.mc-wrap');
  if (!wrap) return;
  const id   = wrap.dataset.id;
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};
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


// ---- SWIPE HANDLERS para tarjetas de misiones ----

function attachSwipeHandlers() {
  document.querySelectorAll('.mc-wrap').forEach(card => {
    if (card._swipeAttached) return;
    card._swipeAttached = true;

    let startX = 0, currentX = 0, dragging = false;
    const front = card.querySelector('.mc-front');
    if (!front) return;
    const THRESHOLD = 80;

    card.addEventListener('touchstart', e => {
      startX   = e.touches[0].clientX;
      currentX = 0;
      dragging = true;
      front.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      if (!dragging) return;
      currentX = e.touches[0].clientX - startX;
      front.style.transform = `translateX(${currentX}px)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      front.style.transition = 'transform .28s cubic-bezier(.22,.68,0,1.2)';

      if (currentX > THRESHOLD) {
        front.style.transform = `translateX(130px)`;
      } else if (currentX < -THRESHOLD) {
        front.style.transform = `translateX(-130px)`;
      } else {
        front.style.transform = 'translateX(0)';
      }
      currentX = 0;
    });

    // Tap sobre el frente cierra el panel si estaba abierto
    front.addEventListener('click', () => {
      const tr = front.style.transform;
      if (tr && tr !== 'translateX(0px)' && tr !== '') {
        front.style.transition = 'transform .28s cubic-bezier(.22,.68,0,1.2)';
        front.style.transform  = 'translateX(0)';
      }
    });
  });
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
