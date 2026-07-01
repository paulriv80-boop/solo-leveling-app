// ============================================================
// MÓDULO: DATA — Solo Leveling App v3.0
// Toda la data del juego. Para cambiar misiones, rangos,
// recompensas, etc., solo editar este archivo.
// ============================================================

const RANGOS_HABITOS = [
  {
    name: 'Ansioso', emoji: '🐭', animal: 'Rata gris', color: '#ff2d55',
    subs: ['Ansioso leve', 'Ansiedad activa', 'Ansiedad alta'],
    skills: ['Reconoces el caos como punto de partida', 'El sistema te acepta tal como eres', 'Primera misión desbloqueada']
  },
  {
    name: 'Inestable', emoji: '🐺', animal: 'Lobo joven', color: '#ff6b35',
    subs: ['Inestabilidad leve', 'Cambios frecuentes', 'Sin rutina fija'],
    skills: ['Empiezas a ver tus patrones de sabotaje', 'Resistencia mental +5', 'Zona oscura desbloqueada']
  },
  {
    name: 'Despierto', emoji: '🦅', animal: 'Águila emergiendo', color: '#ffd700',
    subs: ['Empieza conciencia', 'Ve sus patrones', 'Intención real'],
    skills: ['Visión expandida: ves desde arriba', 'Misiones secretas desbloqueadas', 'Resistencia mental +10']
  },
  {
    name: 'Enfocado', emoji: '🐯', animal: 'Tigre en ataque', color: '#00f5ff',
    subs: ['Atención presente', 'Rutinas básicas', 'Disciplina inicial'],
    skills: ['Modo concentración activado', 'Stacks de poder potenciados', 'XP diario aumentado +15%']
  },
  {
    name: 'Equilibrado', emoji: '🦁', animal: 'León maduro', color: '#bf5fff',
    subs: ['Control parcial', 'Hábitos estables', 'Mente y cuerpo'],
    skills: ['Alter Egos desbloqueados', 'Dominio de impulsos +20', 'Flujo del guerrero disponible']
  },
  {
    name: 'Dominio Interno', emoji: '🐉', animal: 'Dragón negro', color: '#39ff14',
    subs: ['Estabilidad alta', 'Control fuerte', 'Integración total'],
    skills: ['Forma final desbloqueada', 'Poder absoluto desde adentro', 'Puede enseñar a otros']
  },
];

const RANGOS_TECNICO = [
  { name: 'Aprendiz',        emoji: '🐢', animal: 'Tortuga',            color: '#888888', desc: 'Lento pero constante',        skills: ['Primeros pasos en el código', 'Mentalidad de crecimiento activada'] },
  { name: 'Analista',        emoji: '🦝', animal: 'Mapache',             color: '#ff6b35', desc: 'Curioso, encuentra patrones', skills: ['Excel y SQL dominados', 'Ves datos donde otros ven ruido', 'Monedas de estudio +5/día'] },
  { name: 'Desarrollador',   emoji: '🐙', animal: 'Pulpo',               color: '#00f5ff', desc: 'Multitarea, adaptable',        skills: ['Python fluido', 'Automatizaciones reales', 'Bonus XP estudio +10%'] },
  { name: 'Ingeniero Datos', emoji: '🦈', animal: 'Tiburón',             color: '#bf5fff', desc: 'Preciso en aguas profundas',   skills: ['Pipelines de datos', 'Git dominado', 'Proyectos completos'] },
  { name: 'Científico',      emoji: '🦑', animal: 'Calamar profundo',    color: '#39ff14', desc: 'Ve donde nadie llega',         skills: ['Machine Learning aplicado', 'Estadística sólida', 'Primer ingreso posible'] },
  { name: 'Arquitecto IA',   emoji: '🦋', animal: 'Mantis con armadura', color: '#ffd700', desc: 'Calculadora, letal',           skills: ['Diseña agentes con Claude', 'n8n dominado', 'Sistemas autónomos'] },
  { name: 'Maestro',         emoji: '🦅', animal: 'Fénix blanco',        color: '#ffffff', desc: 'Renace, ilumina a otros',      skills: ['Ingresos reales generados', 'Puede enseñar y vender', 'Caso de éxito completo'] },
];

const RECOMPENSAS_HABITOS = [
  { rang: 'Inestable',      reward: '50 monedas + día libre' },
  { rang: 'Despierto',      reward: '100 monedas + 1 serie completa' },
  { rang: 'Enfocado',       reward: '150 monedas + comida especial' },
  { rang: 'Equilibrado',    reward: '250 monedas + gadget o libro' },
  { rang: 'Dominio Interno',reward: '500 monedas + salida especial + día libre' },
];

const RECOMPENSAS_TECNICO = [
  { rang: 'Analista',      reward: '30 monedas + app premium 1 mes' },
  { rang: 'Desarrollador', reward: '60 monedas + curso avanzado' },
  { rang: 'Ingeniero Datos',reward: '100 monedas + equipo tech' },
  { rang: 'Científico',    reward: '150 monedas + certificación' },
  { rang: 'Arquitecto IA', reward: '250 monedas + herramienta pro' },
  { rang: 'Maestro',       reward: '500 monedas + celebración especial' },
];

const PENALIZACIONES = [
  { rank: 0, name: 'Ansioso',        items: ['50 sentadillas', '1h extra estudio', 'Sin series ese día'] },
  { rank: 1, name: 'Inestable',      items: ['100 sentadillas', '1.5h estudio', 'Sin series', 'Cardio 20 min'] },
  { rank: 2, name: 'Despierto',      items: ['150 sentadillas', '2h estudio', 'Cardio 30 min', 'Ayuno hasta mediodía'] },
  { rank: 3, name: 'Enfocado',       items: ['200 sentadillas', '2h estudio', 'Sin redes', 'Doble cardio', 'Ayuno hasta mediodía'] },
  { rank: 4, name: 'Equilibrado',    items: ['200 sentadillas', '3h estudio', 'Sin redes 48h', 'Doble cardio', 'Ayuno todo el día'] },
  { rank: 5, name: 'Dominio Interno',items: ['300 sentadillas', '4h estudio', 'Sin redes 72h', 'Triple cardio', 'Ayuno 24h'] },
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
