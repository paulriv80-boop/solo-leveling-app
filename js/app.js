// ============================================================
// MÓDULO: APP — Solo Leveling v3.1
// Arquitectura: State → Storage → Logic → Render
// Regla de oro: cada función hace UNA cosa.
// ============================================================

// ============================================================
// SECCIÓN 1: CONFIGURACIÓN CENTRAL
// Una sola fuente de verdad para constantes del sistema.
// ============================================================

const CONFIG = {
  STORAGE_KEY: 'sl_v3',
  STATE_VERSION: 4,          // Incrementar cuando cambie la forma del estado
  XP_DIA_MAXIMO: 189,       // Suma de todos los XP posibles en misiones diarias
  DIAS_POR_ESTRELLA: 20,    // Días consecutivos para ganar 1 estrella
  ESTRELLAS_POR_RANGO: 3,   // Estrellas necesarias para subir de rango
  RACHA_BONUS: [3, 7, 30],  // Umbrales de racha para bonificaciones
  XP_MISION_SECRETA: 50,
  COINS_MISION_SECRETA: 10,
};


// ============================================================
// SECCIÓN 2: ESTADO INICIAL
// Toda la persistencia pasa por ST. Nunca guardar estado
// en variables sueltas fuera de este objeto.
// ============================================================

const DEFAULT_STATE = {
  version: CONFIG.STATE_VERSION,
  coins: 0,
  totalXP: 0,
  racha: 0,                   // Días verdes consecutivos reales (calculado)
  stats: { F: 0, M: 0, E: 0, V: 0, D: 0 },
  mis: {},                    // { 'YYYY-MM-DD': { misionId: true/false } }
  zona: {},                   // { 'YYYY-MM-DD': { fell: bool } }
  dias: {},                   // { 'YYYY-MM-DD': 'green'|'red'|'gold'|'blue' }
  rankH: 0,                   // Índice en RANGOS_HABITOS
  starsH: 0,                  // 0-2 estrellas en rango actual
  rankT: 0,                   // Índice en RANGOS_TECNICO
  starsT: 0,
  dc: 0,                      // Días completados en subnivel actual
  
  stacks: { shield: 0, steel: 0, iron: 0, clarity: 0, shadow: 0, warrior: 0 },
  stacksHoy: {},
  stacksHoyDate: null,
  alterActive: null,
  lastVisit: null,
  
};

// Estado activo en memoria
let ST = {};

// Variables de UI (no se persisten)
let calMode = 'mark';
let calY = new Date().getFullYear();
let calM = new Date().getMonth();


// ============================================================
// SECCIÓN 3: UTILIDADES DE FECHA
// TODAY se recalcula en cada llamada para evitar el bug
// de "app abierta pasada la medianoche".
// ============================================================

const DateUtils = {
  today() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Devuelve el lunes de la semana actual (clave para misión secreta semanal).
   */
  weekStart() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  },

  /**
   * Calcula la racha real de días verdes consecutivos hasta hoy.
   * No cuenta total de verdes — cuenta los consecutivos desde ayer hacia atrás.
   */
  calcRacha(dias) {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (dias[key] === 'green') {
        count++;
      } else {
        break;
      }
    }
    return count;
  },

  /**
   * Días entre dos fechas ISO 'YYYY-MM-DD'.
   */
  daysBetween(a, b) {
    return Math.floor((new Date(b) - new Date(a)) / 86400000);
  },
};


// ============================================================
// SECCIÓN 4: CAPA DE ALMACENAMIENTO
// Centraliza todo acceso a localStorage. Si en el futuro
// se migra a IndexedDB o backend, solo cambia este módulo.
// ============================================================

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.warn('[Storage] Error al cargar estado:', e);
      return null;
    }
  },

  save(state) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[Storage] Error al guardar estado:', e);
    }
  },

  clear() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (e) {
      console.warn('[Storage] Error al limpiar estado:', e);
    }
  },
};


// ============================================================
// SECCIÓN 5: MIGRACIÓN DE ESTADO
// Garantiza compatibilidad hacia adelante cuando el esquema
// del estado cambia entre versiones.
// ============================================================

const StateMigration = {
  /**
   * Toma datos crudos del storage y los convierte al esquema actual.
   * Añadir un case nuevo cuando se cambie DEFAULT_STATE.
   */
  migrate(raw) {
    const version = raw.version || 1;

    // v1 → v2: stacks no existían
    if (version < 2) {
      raw.stacks = { shield: 0, steel: 0, iron: 0, clarity: 0, shadow: 0, warrior: 0 };
    }

    // v2 → v3: alterActive no existía
    if (version < 3) {
      raw.alterActive = null;
    }

    // v3 → v4: stacks diarios
    if (version < 4) {
    raw.stacksHoy = {};
    raw.stacksHoyDate = null;
    }

    raw.version = CONFIG.STATE_VERSION;
    return raw;
  },
};


// ============================================================
// SECCIÓN 6: GESTIÓN DE ESTADO
// Inicializar, fusionar con defaults, sanitizar.
// ============================================================

function loadState() {
  const saved = Storage.load();

  if (saved) {
    const migrated = StateMigration.migrate(saved);
    // Fusión defensiva: defaults primero, luego datos guardados,
    // así campos nuevos se inicializan sin romper datos existentes.
    ST = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), migrated);
  } else {
    ST = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  // Garantizar que los contenedores de fecha existan para hoy
  const today = DateUtils.today();
  if (!ST.mis[today])  ST.mis[today]  = {};
  if (!ST.zona[today]) ST.zona[today] = {};

  // Si cambió el día, reiniciar los stacks diarios
  if (ST.stacksHoyDate !== today) {
  ST.stacksHoy = {};
  ST.stacksHoyDate = today;
  }

  // Notificar inactividad si aplica
  if (ST.lastVisit && ST.lastVisit !== today) {
    const diff = DateUtils.daysBetween(ST.lastVisit, today);
    if (diff >= 7) {
      // Se muestra después del primer render
      setTimeout(() => showToast(`⚠️ ${diff} días sin entrar. ¡El sistema te espera!`, '#ff6b35'), 500);
    }
  }

  ST.lastVisit = today;
}

function saveState() {
  ST.lastVisit = DateUtils.today();
  Storage.save(ST);
}

/**
 * Fusión profunda de objetos. Los valores del source sobreescriben
 * los del target, pero los campos que no existen en source se
 * conservan del target (útil para migraciones).
 */
function deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}


// ============================================================
// SECCIÓN 7: HELPERS DE UI
// Funciones pequeñas de presentación reutilizables.
// ============================================================

/**
 * Renderiza N estrellas llenas y (max-N) vacías.
 */
function starsHTML(n, max = 3) {
  return '★'.repeat(Math.max(0, n)) + '☆'.repeat(Math.max(0, max - n));
}

/**
 * Calcula porcentaje clampeado a [0, 100].
 */
function pct(value, total) {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Suma XP de misiones completadas hoy.
 */
function xpHoy() {
  const today = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  return Object.values(MISIONES).flat().reduce((sum, m) => {
    return sum + (todayMis[m.id] ? m.xp : 0);
  }, 0);
}

/**
 * Texto descriptivo del estado de racha.
 */
function bonusLabel(racha) {
  if (racha >= 30) return 'Despertar de poder ✦';
  if (racha >= 7)  return 'Estado de flujo ✦';
  if (racha >= 3)  return 'Bonus XP activo ✦';
  const faltan = CONFIG.RACHA_BONUS[0] - racha;
  return `${faltan} día${faltan !== 1 ? 's' : ''} para primer bonus`;
}

/**
 * Obtiene un elemento del DOM de forma segura.
 * Evita crasheos silenciosos en renders.
 */
function el(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`[DOM] Elemento no encontrado: #${id}`);
  }
  return element;
}

/**
 * Actualiza textContent de un elemento de forma segura.
 */
function setText(id, text) {
  const element = el(id);
  if (element) element.textContent = text;
}

/**
 * Actualiza un estilo inline de forma segura.
 */
function setStyle(id, prop, value) {
  const element = el(id);
  if (element) element.style[prop] = value;
}


// ============================================================
// SECCIÓN 8: SISTEMA DE NOTIFICACIONES (TOAST)
// ============================================================

const Toast = {
  _timer: null,

  show(msg, color) {
    const t = el('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = color || 'var(--c2)';
    t.style.color = color || 'var(--c1)';
    t.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => t.classList.remove('show'), 3200);
  },
};

// Alias global para compatibilidad con llamadas existentes en HTML
function showToast(msg, col) { Toast.show(msg, col); }


// ============================================================
// SECCIÓN 9: NAVEGACIÓN
// ============================================================

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


// ============================================================
// SECCIÓN 10: MÓDULO — STACKS DE PODER
// ============================================================

/**
 * Recalcula todos los stacks desde cero basándose en las misiones
 * completadas HOY. Corrige el bug de acumulación infinita:
 * el nivel de cada stack para hoy es 0 o 1 según se cumplan
 * las condiciones, más el carry acumulado de días anteriores.
 *
 * Arquitectura de stacks:
 * - stack.hoy = si se ganó el stack hoy (0 o 1)
 * - stack.total = acumulado histórico (persiste)
 * Actualmente usamos el total como nivel de display.
 */
function recalcStacksHoy() {
  const today = DateUtils.today();
  const m = ST.mis[today] || {};

  const conditions = {
    shield:  m.e1 && m.e3,
    steel:   !!m.s1,
    iron:    m.f4 && m.f5,
    clarity: m.e4 && m.e3,
    shadow:  !(ST.zona[today]?.fell),
    warrior: Object.values(MISIONES).flat().every(ms => m[ms.id]),
  };

  // Cada stack: máximo = 5. Se incrementa solo si cumpliste hoy
  // y aún no lo incrementaste (evita duplicar al marcar/desmarcar)
  // El estado guardado en stacks es el nivel histórico total.
  // Esta función no modifica el nivel — eso lo hace updateStackOnComplete().
  return conditions;
}

/**
 * Llamado cuando el jugador completa una misión relevante.
 * Evalúa si se desbloquea algún stack y lo incrementa UNA vez.
 */
function updateStacks() {
  const conditions = recalcStacksHoy();

  // Solo incrementamos si la condición es nueva (no estaba antes)
  const today = DateUtils.today();
  const stacksHoy = ST.stacksHoy || {};

  for (const [id, met] of Object.entries(conditions)) {
    if (met && !stacksHoy[id]) {
      ST.stacks[id] = Math.min(5, (ST.stacks[id] || 0) + 1);
      stacksHoy[id] = true;
      Toast.show(`✦ ${STACKS.find(s => s.id === id)?.name} activado!`, '#ffd700');
    }
  }

  // Guardar qué stacks ya se activaron hoy (se resetea al día siguiente)
  if (!ST.stacksHoy) ST.stacksHoy = {};
  if (!ST.stacksHoyDate || ST.stacksHoyDate !== today) {
    ST.stacksHoy = {};
    ST.stacksHoyDate = today;
  }
  Object.assign(ST.stacksHoy, stacksHoy);

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


// ============================================================
// SECCIÓN 11: MÓDULO — INICIO (Dashboard)
// ============================================================

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


// ============================================================
// SECCIÓN 12: MÓDULO — MISIONES
// ============================================================

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

function revealSecret(wk) {
  if (!ST.mis[wk]) ST.mis[wk] = {};
  ST.mis[wk]._secretRevealed = true;
  saveState();
  renderMisiones();
}

function completeSecret(wk) {
  if (!ST.mis[wk]) ST.mis[wk] = {};
  ST.mis[wk]._secretDone = true;
  ST.totalXP += CONFIG.XP_MISION_SECRETA;
  ST.coins   += CONFIG.COINS_MISION_SECRETA;
  Toast.show(`¡Misión secreta completada! +${CONFIG.XP_MISION_SECRETA} XP +${CONFIG.COINS_MISION_SECRETA}c`, '#ffd700');
  saveState();
  renderMisiones();
  renderInicio();
}

/**
 * Toggle de misión: marca o desmarca, ajusta XP/coins/stats.
 * Corregido: desmarca también revierte stats correctamente.
 */
function toggleMision(id, xp, stat, coins) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};

  const wasDone = !!ST.mis[today][id];
  ST.mis[today][id] = !wasDone;

  if (!wasDone) {
    // Completando misión
    ST.totalXP += xp;
    ST.coins   += (coins || 0);
    ST.stats[stat] = (ST.stats[stat] || 0) + 1;
    Toast.show(`+${xp} XP — ${stat}`, 'var(--c1)');
    updateStacks();
    checkDayComplete();
  } else {
    // Desmarcando misión
    ST.totalXP     = Math.max(0, ST.totalXP - xp);
    ST.coins       = Math.max(0, ST.coins - (coins || 0));
    ST.stats[stat] = Math.max(0, (ST.stats[stat] || 0) - 1);
    // Si el día estaba marcado como verde, revertirlo
    if (ST.dias[today] === 'green') {
      delete ST.dias[today];
      ST.racha = DateUtils.calcRacha(ST.dias);
    }
  }

  saveState();
  renderMisiones();
  renderInicio();
}

/**
 * Evalúa si se completaron TODAS las misiones hoy.
 * Si es así, marca el día verde y avanza racha/estrellas/rango.
 */
function checkDayComplete() {
  const today = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  const allMissions = Object.values(MISIONES).flat();

  if (!allMissions.every(m => todayMis[m.id])) return;

  // Día completado
  ST.dias[today] = 'green';
  ST.racha = DateUtils.calcRacha(ST.dias);
  ST.dc    = (ST.dc || 0) + 1;

  // Progresión de rango
  if (ST.dc >= CONFIG.DIAS_POR_ESTRELLA) {
    ST.starsH++;
    ST.dc = 0;

    if (ST.starsH >= CONFIG.ESTRELLAS_POR_RANGO) {
      ST.starsH = 0;
      if (ST.rankH < RANGOS_HABITOS.length - 1) {
        ST.rankH++;
        showRankUp();
      }
    }
  }

  saveState();
  Toast.show('¡Día completo! 🔥 Racha: ' + ST.racha, '#39ff14');
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


// ============================================================
// SECCIÓN 13: MÓDULO — RANGOS
// ============================================================

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


// ============================================================
// SECCIÓN 14: MÓDULO — CALENDARIO
// ============================================================

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

/**
 * Click en un día del calendario.
 * En modo 'mark': cicla entre sin-estado → verde → rojo → sin-estado.
 */
function clickDay(k) {
  const today = DateUtils.today();

  if (calMode === 'boss') {
    ST.dias[k] = 'gold';
    Toast.show('¡Boss fight marcado! ⚔', '#ffd700');
  } else if (calMode === 'light') {
    ST.dias[k] = 'blue';
    Toast.show('Entrenamiento ligero marcado', 'var(--c1)');
  } else {
    // Ciclo: vacío → green → red → vacío
    const current = ST.dias[k];
    if (!current)          ST.dias[k] = 'green';
    else if (current === 'green') ST.dias[k] = 'red';
    else                   delete ST.dias[k];
  }

  // Recalcular racha real cada vez que cambia el calendario
  ST.racha = DateUtils.calcRacha(ST.dias);

  saveState();
  renderCalendario();
  renderInicio();
}


// ============================================================
// SECCIÓN 15: MÓDULO — ZONA OSCURA
// ============================================================

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

function toggleZona() {
  const today = DateUtils.today();
  if (!ST.zona[today]) ST.zona[today] = {};
  ST.zona[today].fell = !ST.zona[today].fell;

  const fell = ST.zona[today].fell;
  Toast.show(
    fell ? '⚠️ Penalización activada' : '✦ Zona oscura limpia hoy',
    fell ? '#ff2d55' : 'var(--c3)'
  );

  saveState();
  renderZona();
}


// ============================================================
// SECCIÓN 16: MÓDULO — RUTA DE ESTUDIO
// ============================================================

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


// ============================================================
// SECCIÓN 17: MÓDULO — TIENDA
// ============================================================

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

function buyReward(cost, name) {
  if (ST.coins < cost) {
    Toast.show('Monedas insuficientes', '#ff2d55');
    return;
  }
  ST.coins -= cost;
  Toast.show(`¡${name} desbloqueado! 🎉`, '#ffd700');
  saveState();
  renderInicio();
  renderTienda();
}


// ============================================================
// SECCIÓN 18: MÓDULO — ALTER EGOS
// ============================================================

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

function selectAlter(id) {
  ST.alterActive = id;
  saveState();
  renderAlter();
}


// ============================================================
// SECCIÓN 19: MÓDULO — RESET
// ============================================================

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


// ============================================================
// SECCIÓN 20: RENDER INICIAL
// Render completo en el primer load. Después, cada módulo
// se renderiza de forma granular al navegar o al interactuar.
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


// ============================================================
// INICIO DE LA APLICACIÓN
// ============================================================

// ============================================================
// BOOT SYSTEM
// ============================================================

function bootSystem() {

  const boot = document.getElementById('bootScreen');

  if (!boot) return;

  setTimeout(() => {

    boot.style.opacity = '0';
    boot.style.transition = 'opacity .8s ease';

    setTimeout(() => {
      boot.remove();
    }, 800);

  }, 2500);

}

loadState();
renderAll();
bootSystem();
