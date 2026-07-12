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
  const propXP = (ST.propositos || []).reduce((sum, p) => {
    return sum + (todayMis['pu_' + p.id] === 'done' ? 25 : 0);
  }, 0);
  return missionXP + propXP;
}

/**
 * Aplica el toggle de una misión: marca o desmarca, ajusta XP/coins/attrs.
 * Revierte el día verde si se desmarca. Devuelve { completed }.
 *
 * @param {string}              id    - ID de la misión (o 'pu_xxx' para propósito)
 * @param {number}              xp    - XP de la misión
 * @param {{cat,stars}[]}       cats  - Categorías que incrementa (VISUAL + atributos)
 * @param {number}              coins - Monedas
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

  ST.totalXP = Math.max(0, ST.totalXP + delta * xp);
  ST.coins   = Math.max(0, ST.coins   + delta * (coins || 0));

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

  return { completed: !wasDone };
}

/**
 * Evalúa si se completaron todas las misiones activas hoy.
 * Si es así, marca el día verde y recalcula la racha.
 */
function applyDayCompletion() {
  const today     = DateUtils.today();
  const todayMis  = ST.mis[today] || {};
  const active    = MISIONES.filter(m => ST.activeMissions.includes(m.id));

  if (!active.every(m => todayMis[m.id] === 'done')) {
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
 * Intenta comprar una recompensa de la tienda. Devuelve true si hubo
 * monedas suficientes y se descontó el costo.
 */
function purchaseReward(cost) {
  if (ST.coins < cost) return false;
  ST.coins -= cost;
  return true;
}
