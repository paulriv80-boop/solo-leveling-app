// ============================================================
// MÓDULO: CONFIG — Solo Leveling
// Constantes centralizadas del sistema. Cambiar balance del
// juego (XP, días, bonus) se hace únicamente aquí.
// ============================================================

const CONFIG = {
  STORAGE_KEY: 'sl_v3',
  STATE_VERSION: 5,          // Incrementar cuando cambie la forma del estado
  XP_DIA_MAXIMO: 177,       // Suma de todos los XP posibles en misiones diarias
  DIAS_POR_ESTRELLA: 20,    // Días consecutivos para ganar 1 estrella
  ESTRELLAS_POR_RANGO: 3,   // Estrellas necesarias para subir de rango
  RACHA_BONUS: [3, 7, 30],  // Umbrales de racha para bonificaciones
};
