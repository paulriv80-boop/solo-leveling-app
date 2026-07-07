// ============================================================
// MÓDULO: CONFIG — Solo Leveling
// Constantes centralizadas del sistema. Cambiar balance del
// juego (XP, días, bonus) se hace únicamente aquí.
// ============================================================

const CONFIG = {
  STORAGE_KEY: 'sl_v3',
  STATE_VERSION: 8,          // v8: attrs renombrados, misiones array, propositos[]
  XP_DIA_MAXIMO: 109,       // Suma XP de las 10 misiones default (m01–m10)
  RACHA_BONUS: [3, 7, 30],  // Umbrales de racha para bonificaciones
};
