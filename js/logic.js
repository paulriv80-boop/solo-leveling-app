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
 */
function applyMissionToggle(id, xp, stat, coins) {
  const today = DateUtils.today();
  if (!ST.mis[today]) ST.mis[today] = {};

  const wasDone = !!ST.mis[today][id];
  ST.mis[today][id] = !wasDone;

  if (!wasDone) {
    // Completando misión
    ST.totalXP += xp;
    ST.coins   += (coins || 0);
    ST.stats[stat] = (ST.stats[stat] || 0) + 1;
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

  return { completed: !wasDone };
}

/**
 * Evalúa qué stacks de poder se cumplen con las misiones de hoy.
 * Solo lectura — no muta ST.
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

  return conditions;
}

/**
 * Incrementa una vez por día cada stack cuya condición se cumple hoy.
 * Devuelve la lista de IDs de stacks recién desbloqueados.
 */
function applyStackUpdates() {
  const conditions = recalcStacksHoy();
  const today = DateUtils.today();
  const stacksHoy = ST.stacksHoy || {};
  const unlocked = [];

  for (const [id, met] of Object.entries(conditions)) {
    if (met && !stacksHoy[id]) {
      ST.stacks[id] = Math.min(5, (ST.stacks[id] || 0) + 1);
      stacksHoy[id] = true;
      unlocked.push(id);
    }
  }

  // Guardar qué stacks ya se activaron hoy (se resetea al día siguiente)
  if (!ST.stacksHoy) ST.stacksHoy = {};
  if (!ST.stacksHoyDate || ST.stacksHoyDate !== today) {
    ST.stacksHoy = {};
    ST.stacksHoyDate = today;
  }
  Object.assign(ST.stacksHoy, stacksHoy);

  return unlocked;
}

/**
 * Evalúa si se completaron TODAS las misiones hoy. Si es así, marca el
 * día verde y avanza racha/estrellas/rango. Devuelve si el día quedó
 * completo y si esto produjo una subida de rango.
 */
function applyDayCompletion() {
  const today = DateUtils.today();
  const todayMis = ST.mis[today] || {};
  const allMissions = Object.values(MISIONES).flat();

  if (!allMissions.every(m => todayMis[m.id])) {
    return { completed: false, rankUp: false };
  }

  // Día completado
  ST.dias[today] = 'green';
  ST.racha = DateUtils.calcRacha(ST.dias);
  ST.dc    = (ST.dc || 0) + 1;

  let rankUp = false;

  // Progresión de rango
  if (ST.dc >= CONFIG.DIAS_POR_ESTRELLA) {
    ST.starsH++;
    ST.dc = 0;

    if (ST.starsH >= CONFIG.ESTRELLAS_POR_RANGO) {
      ST.starsH = 0;
      if (ST.rankH < RANGOS_HABITOS.length - 1) {
        ST.rankH++;
        rankUp = true;
      }
    }
  }

  return { completed: true, rankUp };
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
