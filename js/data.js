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
    avatar: 'assets/Avatar_Rango_E_neutro.png',
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
    id: 'leonidas',
    name: 'Leónidas',
    archetype: 'El Guerrero Espartano',
    desc: 'Eligió la gloria sobre la vida. La disciplina absoluta es su única ley.',
    color: '#e8c060',
    unlockLevel: 100, unlockRank: 5,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Casco corintio con penacho -->
      <ellipse cx="30" cy="18" rx="11" ry="10" fill="currentColor"/>
      <path d="M19,14 Q14,8 16,4 Q22,10 30,12" fill="currentColor"/>
      <path d="M19,16 L14,16 Q11,16 11,13 Q14,9 19,12" fill="currentColor"/>
      <!-- Protector de nariz -->
      <rect x="27.5" y="13" width="5" height="12" rx="2.5" fill="currentColor" opacity=".6"/>
      <!-- Cuerpo con armadura -->
      <rect x="19" y="30" width="22" height="26" rx="3" fill="currentColor"/>
      <!-- Faldilla -->
      <path d="M19,56 L22,68 L27,62 L30,70 L33,62 L38,68 L41,56 Z" fill="currentColor" opacity=".85"/>
      <!-- Brazo con escudo -->
      <rect x="6" y="31" width="11" height="18" rx="5" fill="currentColor"/>
      <ellipse cx="8" cy="40" rx="7" ry="9" fill="currentColor" opacity=".7"/>
      <!-- Brazo con lanza -->
      <rect x="43" y="28" width="6" height="20" rx="3" fill="currentColor"/>
      <rect x="45" y="4" width="3" height="26" rx="1" fill="currentColor" opacity=".85"/>
      <polygon points="46.5,2 44,8 49,8" fill="currentColor"/>
      <!-- Piernas -->
      <rect x="21" y="68" width="8" height="20" rx="4" fill="currentColor"/>
      <rect x="31" y="68" width="8" height="20" rx="4" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'kenshin',
    name: 'Kenshin',
    archetype: 'El Samurái Sin Igual',
    desc: 'La espada como extensión del alma. Cada acción es un corte limpio y preciso.',
    color: '#60c8e8',
    unlockLevel: 100, unlockRank: 5,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Moño samurái -->
      <ellipse cx="30" cy="13" rx="9" ry="9" fill="currentColor"/>
      <rect x="26" y="4" width="8" height="7" rx="2" fill="currentColor" opacity=".7"/>
      <!-- Kimono/armadura -->
      <path d="M14,32 L20,28 L30,30 L40,28 L46,32 L44,62 L16,62 Z" fill="currentColor"/>
      <!-- Solapas del kimono -->
      <path d="M24,30 L30,44 L36,30 L30,34 Z" fill="currentColor" opacity=".5"/>
      <!-- Brazos con katana -->
      <rect x="6" y="30" width="10" height="18" rx="4" fill="currentColor"/>
      <rect x="44" y="26" width="10" height="18" rx="4" fill="currentColor"/>
      <!-- Katana diagonal -->
      <rect x="46" y="10" width="3" height="40" rx="1.5" fill="currentColor" opacity=".9" transform="rotate(-20,48,30)"/>
      <polygon points="55,4 52,10 58,10" fill="currentColor" transform="rotate(-20,55,7)"/>
      <rect x="44" y="26" width="10" height="4" rx="2" fill="currentColor" opacity=".6"/>
      <!-- Hakama / falda -->
      <path d="M16,62 L18,80 L28,72 L30,82 L32,72 L42,80 L44,62 Z" fill="currentColor" opacity=".9"/>
      <!-- Pies -->
      <ellipse cx="23" cy="88" rx="6" ry="4" fill="currentColor"/>
      <ellipse cx="37" cy="88" rx="6" ry="4" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'baldwinus',
    name: 'Baldwinus',
    archetype: 'El Rey de Jerusalén',
    desc: 'Gobernó con hierro y fe desde su dolor. La corona más pesada, la voluntad más fuerte.',
    color: '#c0a040',
    unlockLevel: 100, unlockRank: 5,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Corona -->
      <path d="M18,16 L18,8 L24,13 L30,6 L36,13 L42,8 L42,16 Z" fill="currentColor"/>
      <rect x="17" y="14" width="26" height="5" rx="2" fill="currentColor" opacity=".8"/>
      <!-- Cabeza -->
      <ellipse cx="30" cy="26" rx="10" ry="11" fill="currentColor"/>
      <!-- Capa real -->
      <path d="M10,40 L20,34 L30,36 L40,34 L50,40 L48,68 L30,72 L12,68 Z" fill="currentColor"/>
      <!-- Cruz en el pecho -->
      <rect x="28" y="40" width="4" height="16" rx="1" fill="currentColor" opacity=".4"/>
      <rect x="22" y="46" width="16" height="4" rx="1" fill="currentColor" opacity=".4"/>
      <!-- Brazos con espada -->
      <rect x="6" y="38" width="12" height="20" rx="5" fill="currentColor"/>
      <rect x="42" y="38" width="12" height="20" rx="5" fill="currentColor"/>
      <!-- Espada vertical -->
      <rect x="28.5" y="58" width="3" height="30" rx="1.5" fill="currentColor" opacity=".9"/>
      <rect x="22" y="58" width="16" height="3" rx="1.5" fill="currentColor" opacity=".8"/>
      <!-- Manto / falda -->
      <path d="M12,68 L15,88 L30,80 L45,88 L48,68 Z" fill="currentColor" opacity=".85"/>
    </svg>`,
  },
  {
    id: 'magnus',
    name: 'Magnus',
    archetype: 'El Estratega Rico',
    desc: 'Convierte la visión en riqueza y la riqueza en poder real. Cada movimiento es calculado.',
    color: '#88dd88',
    unlockLevel: 100, unlockRank: 5,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Cabeza con cabello hacia atrás -->
      <ellipse cx="30" cy="15" rx="10" ry="11" fill="currentColor"/>
      <path d="M20,10 Q30,5 40,10 Q38,8 30,7 Q22,8 20,10" fill="currentColor" opacity=".5"/>
      <!-- Traje impecable — hombros anchos -->
      <path d="M12,30 L18,26 L30,28 L42,26 L48,30 L46,64 L14,64 Z" fill="currentColor"/>
      <!-- Solapa del traje -->
      <path d="M22,28 L26,44 L30,36 Z" fill="currentColor" opacity=".45"/>
      <path d="M38,28 L34,44 L30,36 Z" fill="currentColor" opacity=".45"/>
      <!-- Brazos de traje -->
      <rect x="6" y="30" width="10" height="24" rx="4" fill="currentColor"/>
      <rect x="44" y="30" width="10" height="24" rx="4" fill="currentColor"/>
      <!-- Pieza de ajedrez (torre) en mano derecha -->
      <rect x="46" y="47" width="8" height="3" rx="1" fill="currentColor" opacity=".7"/>
      <rect x="48" y="42" width="4" height="6" rx="1" fill="currentColor" opacity=".7"/>
      <path d="M46,42 L48,40 L50,42 L52,40 L54,42" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7"/>
      <!-- Pantalón -->
      <rect x="18" y="64" width="10" height="24" rx="4" fill="currentColor"/>
      <rect x="32" y="64" width="10" height="24" rx="4" fill="currentColor"/>
      <!-- Corbata -->
      <path d="M28,28 L30,42 L32,28 L30,32 Z" fill="currentColor" opacity=".55"/>
    </svg>`,
  },
  {
    id: 'ananda',
    name: 'Ananda',
    archetype: 'El Monje Interior',
    desc: 'La quietud como fuente de todo poder. En el silencio absoluto nace la claridad suprema.',
    color: '#cc88ff',
    unlockLevel: 100, unlockRank: 5,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Cabeza rapada -->
      <ellipse cx="30" cy="14" rx="10" ry="11" fill="currentColor"/>
      <!-- Túnica con capucha bajada -->
      <path d="M10,32 Q20,26 30,28 Q40,26 50,32 L52,70 L8,70 Z" fill="currentColor"/>
      <!-- Pliegues de la túnica -->
      <line x1="22" y1="32" x2="20" y2="68" stroke="currentColor" stroke-width="1.5" opacity=".3"/>
      <line x1="30" y1="30" x2="30" y2="70" stroke="currentColor" stroke-width="1.5" opacity=".3"/>
      <line x1="38" y1="32" x2="40" y2="68" stroke="currentColor" stroke-width="1.5" opacity=".3"/>
      <!-- Brazos en posición de oración -->
      <path d="M10,34 Q8,46 16,50 L22,46 Q18,42 18,36 Z" fill="currentColor"/>
      <path d="M50,34 Q52,46 44,50 L38,46 Q42,42 42,36 Z" fill="currentColor"/>
      <!-- Manos unidas en oración -->
      <ellipse cx="30" cy="50" rx="8" ry="5" fill="currentColor" opacity=".9"/>
      <!-- Rosario o mala -->
      <circle cx="22" cy="54" r="2" fill="currentColor" opacity=".6"/>
      <circle cx="26" cy="57" r="2" fill="currentColor" opacity=".6"/>
      <circle cx="30" cy="58" r="2" fill="currentColor" opacity=".6"/>
      <circle cx="34" cy="57" r="2" fill="currentColor" opacity=".6"/>
      <circle cx="38" cy="54" r="2" fill="currentColor" opacity=".6"/>
      <!-- Hábito / falda -->
      <path d="M8,70 L10,90 L28,82 L30,92 L32,82 L50,90 L52,70 Z" fill="currentColor" opacity=".9"/>
    </svg>`,
  },
];


const DAYS_LABELS   = ['L','M','X','J','V','S','D'];
const MONTHS_LABELS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
