// ============================================================
// MÓDULO: DATA — Solo Leveling App v3.0
// Toda la data del juego. Para cambiar misiones, rangos,
// recompensas, etc., solo editar este archivo.
// ============================================================

const RANGOS = [
  {
    letter: 'E', name: 'Novato',
    color: '#c8956a', colorGlow: 'rgba(200,149,106,0.45)',
    desc: 'El punto de partida. Reconoces el caos como oportunidad de cambio.',
    skills: ['El sistema te acepta tal como eres', 'Primera misión desbloqueada', 'Zona oscura desbloqueada'],
  },
  {
    letter: 'D', name: 'Adepto',
    color: '#9ab0c0', colorGlow: 'rgba(154,176,192,0.45)',
    desc: 'Empiezas a ver tus patrones. La constancia comienza a formarse.',
    skills: ['Patrones de sabotaje identificados', 'Resistencia mental activada', 'Misiones avanzadas desbloqueadas'],
  },
  {
    letter: 'C', name: 'Experto',
    color: '#e8c030', colorGlow: 'rgba(232,192,48,0.45)',
    desc: 'Visión expandida. Actúas con intención real y disciplina inicial sólida.',
    skills: ['Rutinas establecidas', 'Rendimiento en ascenso', 'XP diario potenciado'],
  },
  {
    letter: 'B', name: 'Disciplinado',
    color: '#9b59b6', colorGlow: 'rgba(155,89,182,0.5)',
    desc: 'Mente y cuerpo alineados. Control real sobre tus impulsos y hábitos.',
    skills: ['Alter Egos desbloqueados', 'Dominio de impulsos activo', 'Modo guerrero disponible'],
  },
  {
    letter: 'A', name: 'Liberado',
    color: '#c8d8e8', colorGlow: 'rgba(200,216,232,0.5)',
    desc: 'Renaces. Los hábitos fluyen naturalmente. Enseñas con el ejemplo.',
    skills: ['Fénix interior despertado', 'Flujo sostenido del guerrero', 'Guías con tu presencia'],
  },
  {
    letter: 'S', name: 'Trascendente',
    color: '#ffb833', colorGlow: 'rgba(255,184,51,0.6)',
    desc: 'Dominio absoluto. La evolución personal es tu naturaleza permanente.',
    skills: ['Forma final desbloqueada', 'Poder absoluto desde adentro', 'Inspira y guía a otros'],
  },
];

const PENALIZACIONES = [
  { rank: 0, name: 'Novato',        items: ['50 sentadillas', '1h extra estudio', 'Sin series ese día'] },
  { rank: 1, name: 'Adepto',        items: ['100 sentadillas', '1.5h estudio', 'Sin series', 'Cardio 20 min'] },
  { rank: 2, name: 'Experto',       items: ['150 sentadillas', '2h estudio', 'Cardio 30 min', 'Ayuno hasta mediodía'] },
  { rank: 3, name: 'Disciplinado',  items: ['200 sentadillas', '2h estudio', 'Sin redes', 'Doble cardio', 'Ayuno hasta mediodía'] },
  { rank: 4, name: 'Liberado',      items: ['200 sentadillas', '3h estudio', 'Sin redes 48h', 'Doble cardio', 'Ayuno todo el día'] },
  { rank: 5, name: 'Trascendente',  items: ['300 sentadillas', '4h estudio', 'Sin redes 72h', 'Triple cardio', 'Ayuno 24h'] },
];

const MISIONES = {
  FISICO: [
    { id: 'ph1', t: 'Ejercicio de fuerza',   desc: 'Mínimo 45 minutos',   xp: 20, coins: 3, stats: ['fuerza'] },
    { id: 'ph2', t: 'Ejercicio de cardio',    desc: 'Mínimo 30 minutos',   xp: 15, coins: 2, stats: ['agilidad'] },
    { id: 'ph3', t: 'Hidratación',            desc: '2 a 3 litros',        xp: 8,  coins: 1, stats: ['energia'] },
    { id: 'ph4', t: 'Alimentación saludable', desc: '',                    xp: 8,  coins: 1, stats: ['energia'] },
    { id: 'ph5', t: 'Sueño de calidad',       desc: '6 a 8 horas',        xp: 10, coins: 2, stats: ['energia', 'claridad'] },
  ],
  MENTE: [
    { id: 'mn1', t: 'Meditación',         desc: 'Mínimo 10 minutos',      xp: 10, coins: 1, stats: ['serenidad', 'claridad'] },
    { id: 'mn2', t: 'Autoconfirmación',   desc: '5 a 10 minutos',         xp: 8,  coins: 1, stats: ['confianza'] },
    { id: 'mn3', t: 'Informarse',         desc: 'Leer titulares del día', xp: 5,  coins: 0, stats: ['conocimiento'] },
    { id: 'mn4', t: 'Estudiar inglés',    desc: '30 minutos',             xp: 15, coins: 3, stats: ['conocimiento', 'disciplina'] },
    { id: 'mn5', t: 'Lectura',            desc: 'Mínimo 5 páginas',       xp: 10, coins: 2, stats: ['conocimiento'] },
    { id: 'mn6', t: 'Journaling',         desc: '',                       xp: 8,  coins: 1, stats: ['claridad', 'confianza'] },
  ],
  ESPIRITUAL: [
    { id: 'sp1', t: 'Lectura y reflexión espiritual', desc: '', xp: 15, coins: 2, stats: ['espiritualidad', 'conocimiento'] },
    { id: 'sp2', t: 'Oración',                        desc: '', xp: 10, coins: 1, stats: ['espiritualidad', 'serenidad'] },
    { id: 'sp3', t: 'Gratitud',                       desc: '', xp: 10, coins: 1, stats: ['espiritualidad'] },
  ],
  PROPOSITO: [
    { id: 'pu1', t: 'Propósito', desc: '', xp: 25, coins: 5, stats: ['disciplina'], dynamic: true },
  ],
};

const ZONA_OSCURA_ITEMS = [
  'Redes sociales sin límite (máx 20 min/día)',
  'Lujuria',
  'Simpear',
  'Videojuegos sin ganarlos como recompensa',
  'Comida chatarra / dulces / alcohol',
  'Apuestas',
];


const MODULOS_ESTUDIO = [
  { name: 'Python fundamentos',       weeks: '1–4',   rank: 'Aprendiz → Analista',          status: 'active' },
  { name: 'Excel avanzado',           weeks: '5–7',   rank: 'Analista ⭐⭐',                status: 'locked' },
  { name: 'SQL',                      weeks: '8–11',  rank: 'Analista → Desarrollador',      status: 'locked' },
  { name: 'Estadística',              weeks: '12–14', rank: 'Desarrollador ⭐⭐',            status: 'locked' },
  { name: 'Power BI',                 weeks: '15–17', rank: 'Desarrollador → Ingeniero',     status: 'locked' },
  { name: 'Git / GitHub',             weeks: '18',    rank: 'Ingeniero ⭐',                  status: 'locked' },
  { name: 'Machine Learning',         weeks: '19–22', rank: 'Ingeniero → Científico',        status: 'locked' },
  { name: 'IA generativa y agentes',  weeks: '23–26', rank: 'Científico → Arquitecto IA',   status: 'locked' },
];

const TIENDA = [
  { name: 'Ver una película',          cost: 40,  emoji: '🎬', req: 'Completar semana limpia' },
  { name: 'Cerveza con amigos',        cost: 60,  emoji: '🍺', req: '10 días de racha' },
  { name: 'Paseo / salida especial',   cost: 100, emoji: '🚶', req: '20 días de racha' },
  { name: 'Comprar un libro',          cost: 80,  emoji: '📚', req: 'Completar un módulo' },
  { name: 'Comprar ropa',              cost: 150, emoji: '👕', req: 'Subir de rango' },
  { name: 'Comida especial (lo que quieras)', cost: 120, emoji: '🍔', req: '30 días físicos' },
  { name: 'Día de descanso total',     cost: 90,  emoji: '😴', req: 'Completar 2 módulos' },
  { name: 'Gadget / accesorio tech',   cost: 200, emoji: '🎧', req: 'Subir 3 rangos' },
  { name: 'Videojuego (sesión libre)', cost: 70,  emoji: '🎮', req: '15 días consecutivos' },
  { name: 'Celebración grande',        cost: 400, emoji: '🏆', req: 'Completar ruta 6 meses' },
];

const ALTER_EGOS = [
  {
    id: 'social', name: 'Relaciones Sociales', emoji: '👥', color: '#ff44aa',
    desc: 'Habilidades sociales y seducción',
    missions: [
      'Entabla conversación con un desconocido',
      'Practica contacto visual consciente 5 min',
      'Sal a socializar sin propósito fijo',
      'Escucha activa — 30 min sin hablar de ti',
      'Aprende el nombre de alguien nuevo hoy',
    ]
  },
  {
    id: 'musashi', name: 'Musashi', emoji: '⚔️', color: '#00f5ff',
    desc: 'Quietud mental del guerrero',
    missions: [
      'Silencio activo 20 min sin distracciones',
      'Escribe tus pensamientos durante 10 min',
      'Contemplación de un objetivo futuro',
      'Lee filosofía del guerrero (10 páginas)',
      'Meditación en movimiento — caminar consciente',
    ]
  },
];


const DAYS_LABELS   = ['L','M','X','J','V','S','D'];
const MONTHS_LABELS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
