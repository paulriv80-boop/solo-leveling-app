// ============================================================
// MÓDULO: CONFIG — Solo Leveling
// Constantes centralizadas del sistema. Cambiar balance del
// juego (XP, días, bonus) se hace únicamente aquí.
// ============================================================

const CONFIG = {
  STORAGE_KEY: 'sl_v3',
  STATE_VERSION: 11,         // v11: sistema Rutina (pilares, goal, camino, guardianes)
  XP_DIA_MAXIMO: 109,       // Suma XP de las 10 misiones default (m01–m10)
  RACHA_BONUS: [3, 7, 30],  // Umbrales de racha para bonificaciones

  GAME_MODES: {
    normal: {
      label: 'Normal',
      tagline: 'Construye hábitos',
      msg: 'Cada gran guerrero comenzó dando un solo paso.',
      img: 'assets/design-system/camino/modo normal.png',
      misionesMin: 3,
      xpMult: 1.0,
      coinsEnabled: true,
      penaltyCount: 0,
      accentColor: 'rgba(0,200,80,.35)',
      bgColor: 'rgba(0,80,40,.18)',
    },
    guerrero: {
      label: 'Guerrero',
      tagline: 'Forja disciplina',
      msg: 'La disciplina aparece cuando desaparecen las excusas.',
      img: 'assets/design-system/camino/modo guerrero.png',
      misionesMin: 6,
      xpMult: 1.5,
      coinsEnabled: true,
      penaltyCount: 1,
      accentColor: 'rgba(220,50,50,.40)',
      bgColor: 'rgba(80,10,10,.20)',
    },
    monje: {
      label: 'Monje',
      tagline: 'Domina tu mente',
      msg: 'El verdadero progreso ocurre cuando nadie está mirando.',
      img: 'assets/design-system/camino/modo monje.png',
      misionesMin: 10,
      xpMult: 2.0,
      coinsEnabled: false,
      penaltyCount: 2,
      accentColor: 'rgba(140,140,170,.40)',
      bgColor: 'rgba(40,40,55,.25)',
    },
  },

  PENALIZACIONES: [
    { id: 'p01', text: 'Haz 20 flexiones' },
    { id: 'p02', text: 'Medita 5 minutos' },
    { id: 'p03', text: 'Lee 5 páginas' },
    { id: 'p04', text: 'Camina 10 minutos' },
    { id: 'p05', text: 'Bebe un vaso de agua y respira profundamente 2 minutos' },
    { id: 'p06', text: 'Escribe 3 cosas por las que estás agradecido' },
    { id: 'p07', text: 'Haz 40 flexiones' },
    { id: 'p08', text: 'Medita 10 minutos' },
    { id: 'p09', text: 'Lee 10 páginas' },
    { id: 'p10', text: 'Camina 20 minutos sin usar el teléfono' },
    { id: 'p11', text: 'Escribe una reflexión sobre el día anterior' },
    { id: 'p12', text: 'Respiración consciente durante 10 minutos' },
  ],
};
