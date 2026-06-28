// ============================================================
// MÓDULO: STATE — Solo Leveling
// Estado único del sistema (ST) y su persistencia. Todo cambio
// del juego pasa por ST. Nunca crear estados paralelos.
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

// Estado activo en memoria — única fuente de verdad
let ST = {};


// ============================================================
// CAPA DE ALMACENAMIENTO
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
// MIGRACIÓN DE ESTADO
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
// GESTIÓN DE ESTADO
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
