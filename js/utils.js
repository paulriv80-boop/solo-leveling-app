// ============================================================
// MÓDULO: UTILS — Solo Leveling
// Utilidades reutilizables: fechas, formateo, acceso seguro al
// DOM y notificaciones (Toast). Sin lógica de negocio.
// ============================================================

const DateUtils = {
  // Usa fecha local (no UTC) para que el día cambie a medianoche local, no a medianoche UTC.
  today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
// HELPERS DE DOM
// Funciones pequeñas de presentación reutilizables.
// ============================================================

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

/**
 * Calcula porcentaje clampeado a [0, 100].
 */
function pct(value, total) {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Calcula el nivel actual del Operator a partir del XP total acumulado.
 * XP para pasar de nivel N a N+1: 200 + (N-1)*150.
 *   Nivel 1→2: 200 XP | 2→3: 350 | 3→4: 500 | 4→5: 650 ...
 */
function getLevel(totalXP) {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = 200 + (level - 1) * 150;
    if (accumulated + needed > totalXP) {
      return { level, xpInLevel: totalXP - accumulated, xpNeeded: needed };
    }
    accumulated += needed;
    level++;
  }
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


// ============================================================
// SISTEMA DE NOTIFICACIONES (TOAST)
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
// CONTADOR 90 DÍAS — Presence
// Días en los últimos 90 donde el usuario completó ≥3 misiones.
// Usa fecha local (evita bug UTC de calcRacha).
// ============================================================

function calcDias90() {
  const now      = new Date();
  const modeConf = CONFIG.GAME_MODES[ST.gameMode] || CONFIG.GAME_MODES.normal;
  let count = 0;
  for (let i = 0; i < 90; i++) {
    const d   = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dayMis = ST.mis[key];
    if (dayMis && Object.values(dayMis).filter(v => v === 'done').length >= modeConf.misionesMin) count++;
  }
  return { count, total: 90 };
}

function misionStreak(id) {
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (ST.mis[key] && ST.mis[key][id] === 'done') streak++;
    else break;
  }
  return streak;
}
