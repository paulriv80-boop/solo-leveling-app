// ============================================================
// MÓDULO: DATA — Solo Leveling App v3.0
// Toda la data del juego. Para cambiar misiones, rangos,
// recompensas, etc., solo editar este archivo.
// ============================================================

const RANGOS = [
  {
    letter: 'E', name: 'Novato',
    color: '#c8956a', colorGlow: 'rgba(200,149,106,0.5)',
    desc: 'El punto de partida. Reconoces el caos como oportunidad de cambio.',
    skills: ['El sistema te acepta tal como eres', 'Primera misión desbloqueada', 'Zona oscura desbloqueada'],
    avatar: 'assets/avatar.png',
    // Círculo bronce con chevron y acentos en los cuatro ejes
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#c8956a" stroke-width="5"/>
      <polygon points="50,7 54,15 46,15" fill="#c8956a"/>
      <polygon points="50,93 54,85 46,85" fill="#c8956a"/>
      <polygon points="7,50 15,46 15,54" fill="#c8956a"/>
      <polygon points="93,50 85,46 85,54" fill="#c8956a"/>
      <polyline points="28,67 50,41 72,67" fill="none" stroke="#c8956a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="50" cy="77" r="4.5" fill="#c8956a"/>
    </svg>`,
  },
  {
    letter: 'D', name: 'Adepto',
    color: '#9ab0c0', colorGlow: 'rgba(154,176,192,0.5)',
    desc: 'Empiezas a ver tus patrones. La constancia comienza a formarse.',
    skills: ['Patrones de sabotaje identificados', 'Resistencia mental activada', 'Misiones avanzadas desbloqueadas'],
    avatar: 'assets/avatar.png',
    // Círculo acero con flecha apuntando arriba y diamante central
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#8899aa" stroke-width="5"/>
      <polygon points="50,18 70,63 50,55 30,63" fill="#9ab0c0"/>
      <polygon points="50,53 55,58 50,63 45,58" fill="#d0e0ea"/>
    </svg>`,
  },
  {
    letter: 'C', name: 'Experto',
    color: '#e8c030', colorGlow: 'rgba(232,192,48,0.5)',
    desc: 'Visión expandida. Actúas con intención real y disciplina inicial sólida.',
    skills: ['Rutinas establecidas', 'Rendimiento en ascenso', 'XP diario potenciado'],
    avatar: 'assets/avatar.png',
    // Estrella de 4 puntas (compás dorado) con cruceta interior
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,4 L56,44 L96,50 L56,56 L50,96 L44,56 L4,50 L44,44 Z" fill="#e8c030"/>
      <circle cx="50" cy="50" r="13" fill="none" stroke="#fff8b0" stroke-width="1.5" opacity="0.65"/>
      <line x1="50" y1="37" x2="50" y2="63" stroke="#fff8b0" stroke-width="1.5" opacity="0.65"/>
      <line x1="37" y1="50" x2="63" y2="50" stroke="#fff8b0" stroke-width="1.5" opacity="0.65"/>
    </svg>`,
  },
  {
    letter: 'B', name: 'Disciplinado',
    color: '#9b59b6', colorGlow: 'rgba(155,89,182,0.55)',
    desc: 'Mente y cuerpo alineados. Control real sobre tus impulsos y hábitos.',
    skills: ['Alter Egos desbloqueados', 'Dominio de impulsos activo', 'Modo guerrero disponible'],
    avatar: 'assets/avatar.png',
    // Círculo violeta con espada y corona de laurel
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#9b59b6" stroke-width="3.5"/>
      <polygon points="50,14 54,52 50,58 46,52" fill="#c084f5"/>
      <rect x="35" y="52" width="30" height="5.5" rx="2.5" fill="#9b59b6"/>
      <rect x="47" y="57.5" width="6" height="13" rx="3" fill="#7c3ea8"/>
      <circle cx="50" cy="74" r="4.5" fill="#9b59b6"/>
      <path d="M37,74 C30,65 27,55 30,44" fill="none" stroke="#9b59b6" stroke-width="2.5"/>
      <ellipse cx="27" cy="61" rx="7" ry="3.5" fill="#9b59b6" transform="rotate(-35,27,61)" opacity="0.9"/>
      <ellipse cx="28.5" cy="52" rx="6.5" ry="3.5" fill="#9b59b6" transform="rotate(-50,28.5,52)" opacity="0.8"/>
      <ellipse cx="31" cy="44" rx="6" ry="3" fill="#9b59b6" transform="rotate(-62,31,44)" opacity="0.7"/>
      <path d="M63,74 C70,65 73,55 70,44" fill="none" stroke="#9b59b6" stroke-width="2.5"/>
      <ellipse cx="73" cy="61" rx="7" ry="3.5" fill="#9b59b6" transform="rotate(35,73,61)" opacity="0.9"/>
      <ellipse cx="71.5" cy="52" rx="6.5" ry="3.5" fill="#9b59b6" transform="rotate(50,71.5,52)" opacity="0.8"/>
      <ellipse cx="69" cy="44" rx="6" ry="3" fill="#9b59b6" transform="rotate(62,69,44)" opacity="0.7"/>
    </svg>`,
  },
  {
    letter: 'A', name: 'Liberado',
    color: '#c8d8e8', colorGlow: 'rgba(200,216,232,0.55)',
    desc: 'Renaces. Los hábitos fluyen naturalmente. Enseñas con el ejemplo.',
    skills: ['Fénix interior despertado', 'Flujo sostenido del guerrero', 'Guías con tu presencia'],
    avatar: 'assets/avatar.png',
    // Fénix plateado con alas desplegadas hacia arriba
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="58" r="25" fill="none" stroke="#c8d8e8" stroke-width="2" opacity="0.3"/>
      <path d="M44,53 C36,44 21,37 13,46 C21,42 36,49 44,59" fill="#c8d8e8"/>
      <path d="M43,49 C32,35 17,27 20,40 C26,34 38,43 43,53" fill="#d8eaf8" opacity="0.75"/>
      <path d="M56,53 C64,44 79,37 87,46 C79,42 64,49 56,59" fill="#c8d8e8"/>
      <path d="M57,49 C68,35 83,27 80,40 C74,34 62,43 57,53" fill="#d8eaf8" opacity="0.75"/>
      <ellipse cx="50" cy="61" rx="7.5" ry="11" fill="#c8d8e8"/>
      <circle cx="50" cy="44" r="8" fill="#c8d8e8"/>
      <polygon points="50,40 56,43 50,46" fill="#90a8b8"/>
      <path d="M44,71 C40,81 42,89 50,85 C58,89 60,81 56,71" fill="#c8d8e8" opacity="0.85"/>
    </svg>`,
  },
  {
    letter: 'S', name: 'Trascendente',
    color: '#ffb833', colorGlow: 'rgba(255,184,51,0.65)',
    desc: 'Dominio absoluto. La evolución personal es tu naturaleza permanente.',
    skills: ['Forma final desbloqueada', 'Poder absoluto desde adentro', 'Inspira y guía a otros'],
    avatar: 'assets/avatar.png',
    // Orbe dorado con anillo orbital y eje vertical radiante
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="44" ry="16" fill="none" stroke="#ffb833" stroke-width="3.5"/>
      <polygon points="5,50 13,46 13,54" fill="#ffb833"/>
      <polygon points="95,50 87,46 87,54" fill="#ffb833"/>
      <line x1="50" y1="7" x2="50" y2="93" stroke="#ffb833" stroke-width="3"/>
      <polygon points="50,5 54,14 46,14" fill="#ffb833"/>
      <polygon points="50,95 54,86 46,86" fill="#ffb833"/>
      <circle cx="50" cy="50" r="19" fill="none" stroke="#ffb833" stroke-width="1.5" opacity="0.35"/>
      <circle cx="50" cy="50" r="13" fill="#ffb833" opacity="0.3"/>
      <circle cx="50" cy="50" r="8" fill="#ffb833" opacity="0.75"/>
      <circle cx="50" cy="50" r="4" fill="#fff5cc"/>
    </svg>`,
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
