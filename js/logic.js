// ============================================================
// MÓDULO: LOGIC — Solo Leveling
// Lógica de negocio: XP, monedas, stacks, rachas, progresión
// de rango, tienda, zona oscura. Muta ST pero nunca el DOM —
// la lógica nunca debe depender del HTML.
// ============================================================

/**
 * Suma XP de misiones y propósitos completados hoy.
 */
function xpHoy() {
  const today    = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  const missionXP = MISIONES
    .filter(m => ST.activeMissions.includes(m.id))
    .reduce((sum, m) => sum + (todayMis[m.id] === 'done' ? m.xp : 0), 0);
  const caminoXP = (ST.camino || []).reduce((sum, s) => {
    return sum + (todayMis['ca_' + s.id] === 'done' ? 25 : 0);
  }, 0);
  return missionXP + caminoXP;
}

/**
 * Aplica el toggle de una misión: marca o desmarca, ajusta XP/coins/attrs según modo.
 * Revierte el día verde si se desmarca. Devuelve { completed, xpGained, coinsGained }.
 *
 * @param {string}              id    - ID de la misión (o 'pu_xxx' para propósito)
 * @param {number}              xp    - XP base de la misión
 * @param {{cat,stars}[]}       cats  - Categorías que incrementa
 * @param {number}              coins - Monedas base
 */
function applyMissionToggle(id, xp, cats, coins) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};

  const wasDone = ST.mis[today][id] === 'done';
  if (wasDone) {
    delete ST.mis[today][id];
  } else {
    ST.mis[today][id] = 'done';
  }
  const delta = wasDone ? -1 : 1;

  const modeConf   = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  const xpDelta    = Math.round(xp * modeConf.xpMult);
  const coinsDelta = modeConf.coinsEnabled ? (coins || 0) : 0;

  ST.totalXP = Math.max(0, ST.totalXP + delta * xpDelta);
  ST.coins   = Math.max(0, ST.coins   + delta * coinsDelta);

  // Por cada categoría en cats: incrementar todos sus atributos +1
  (cats || []).forEach(({ cat }) => {
    const catObj = CATEGORIES.find(c => c.id === cat);
    if (!catObj) return;
    catObj.attrs.forEach(attr => {
      ST.stats[attr] = Math.max(0, (ST.stats[attr] || 0) + delta);
    });
  });

  if (wasDone && ST.dias[today] === 'green') {
    delete ST.dias[today];
    ST.racha = DateUtils.calcRacha(ST.dias);
  }

  return {
    completed:    !wasDone,
    xpGained:     delta > 0 ? xpDelta    : 0,
    coinsGained:  delta > 0 ? coinsDelta : 0,
  };
}

/**
 * Evalúa si se completaron suficientes misiones hoy según el modo activo.
 * Si es así, marca el día verde y recalcula la racha.
 */
function applyDayCompletion() {
  const today     = DateUtils.today();
  const todayMis  = ST.mis[today] || {};
  const modeConf  = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  const doneCount = Object.values(todayMis).filter(v => v === 'done').length;

  if (doneCount < modeConf.misionesMin) return { completed: false };
  if (ST.dias[today] === 'green')       return { completed: false };

  ST.dias[today] = 'green';
  ST.racha = DateUtils.calcRacha(ST.dias);
  return { completed: true };
}

/**
 * Comprueba si el día anterior no cumplió el umbral del modo activo.
 * Si es así, genera una penalización pendiente en ST.penalty.
 * Debe llamarse con la fecha de la ÚLTIMA visita (antes de sobrescribir lastVisit).
 */
function checkAndGeneratePenalty(prevDate) {
  if (!prevDate) return;
  if (ST.penalty && ST.penalty.pending) return;

  const today = DateUtils.today();
  if (prevDate === today) return;

  const modeConf = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  if (modeConf.penaltyCount === 0) return;

  const prevMis  = ST.mis[prevDate] || {};
  const donePrev = Object.values(prevMis).filter(v => v === 'done').length;
  if (donePrev >= modeConf.misionesMin) return;

  // Seleccionar tareas evitando repetir las últimas; reset si el pool queda vacío
  let lastIds = (ST.penalty && ST.penalty.lastIds) || [];
  let pool    = CONFIG.PENALIZACIONES.filter(p => !lastIds.includes(p.id));
  if (pool.length < modeConf.penaltyCount) {
    lastIds = [];
    pool    = [...CONFIG.PENALIZACIONES];
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const tasks    = [];
  for (let i = 0; i < modeConf.penaltyCount && i < shuffled.length; i++) {
    tasks.push(shuffled[i].id);
  }

  ST.penalty = { pending: true, date: today, tasks, completed: [], lastIds: tasks };
}

/**
 * Aplica el click de un día del calendario según el modo activo.
 * En modo 'mark': cicla entre sin-estado → verde → rojo → sin-estado.
 */
function applyCalendarDayClick(k, mode) {
  if (mode === 'boss') {
    ST.dias[k] = 'gold';
  } else if (mode === 'light') {
    ST.dias[k] = 'blue';
  } else {
    const current = ST.dias[k];
    if (!current)          ST.dias[k] = 'green';
    else if (current === 'green') ST.dias[k] = 'red';
    else                   delete ST.dias[k];
  }

  // Recalcular racha real cada vez que cambia el calendario
  ST.racha = DateUtils.calcRacha(ST.dias);
}

/**
 * Marca un guardián como 'ok' (resistió) o 'fell' (cayó) hoy.
 * Toggle: si ya estaba en el mismo estado, lo desmarca.
 */
function applyGuardianToggle(id, status) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};
  const current = ST.mis[today][id];
  if (current === status) {
    delete ST.mis[today][id];
  } else {
    ST.mis[today][id] = status;
  }
}

/**
 * Calcula racha de días consecutivos 'ok' para un guardián (máx 90).
 */
function guardianStreak(id) {
  let count = 0;
  const today = new Date();
  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-CA');
    const v = (ST.mis[key] || {})[id];
    if (v === 'ok') count++;
    else break;
  }
  return count;
}

/**
 * Intenta comprar una recompensa de la tienda. Devuelve true si hubo
 * monedas suficientes y se descontó el costo.
 */
function purchaseReward(cost) {
  if (ST.coins < cost) return false;
  ST.coins -= cost;
  return true;
}
