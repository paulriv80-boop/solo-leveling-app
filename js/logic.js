// ============================================================
// MÓDULO: LOGIC — Solo Leveling
// Lógica de negocio: XP, monedas, stacks, rachas, progresión
// de rango, tienda, zona oscura. Muta ST pero nunca el DOM —
// la lógica nunca debe depender del HTML.
// ============================================================

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
 * Aplica el toggle de una misión: marca o desmarca, ajusta XP/coins/stats,
 * y revierte el día verde si corresponde. Devuelve si la misión quedó
 * completada (true) o desmarcada (false).
 * @param {string}   id    - ID de la misión
 * @param {number}   xp    - XP de la misión
 * @param {string[]} stats - Atributos que incrementa (array)
 * @param {number}   coins - Monedas opcionales
 */
function applyMissionToggle(id, xp, stats, coins) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};

  const wasDone = !!ST.mis[today][id];
  ST.mis[today][id] = !wasDone;
  const delta = wasDone ? -1 : 1;

  ST.totalXP = Math.max(0, ST.totalXP + delta * xp);
  ST.coins   = Math.max(0, ST.coins   + delta * (coins || 0));

  (stats || []).forEach(s => {
    ST.stats[s] = Math.max(0, (ST.stats[s] || 0) + delta);
  });

  if (wasDone && ST.dias[today] === 'green') {
    delete ST.dias[today];
    ST.racha = DateUtils.calcRacha(ST.dias);
  }

  return { completed: !wasDone };
}

/**
 * Evalúa si se completaron TODAS las misiones hoy. Si es así, marca el
 * día verde y recalcula la racha.
 */
function applyDayCompletion() {
  const today = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  const allMissions = Object.values(MISIONES).flat();

  if (!allMissions.every(m => todayMis[m.id])) {
    return { completed: false };
  }

  ST.dias[today] = 'green';
  ST.racha = DateUtils.calcRacha(ST.dias);

  return { completed: true };
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
 * Alterna el estado de "caída" en la zona oscura para hoy.
 * Devuelve el nuevo valor de fell.
 */
function toggleZonaFall() {
  const today = DateUtils.today();
  if (!ST.zona[today]) ST.zona[today] = {};
  ST.zona[today].fell = !ST.zona[today].fell;
  return ST.zona[today].fell;
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
