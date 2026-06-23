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
  E: [
    { id: 'e1', t: 'Oración matutina (15 min)',    xp: 15, st: 'E', tip: { title: 'Escudo espiritual', desc: 'Un guerrero con Dios activa su escudo espiritual. Esta misión carga tu fuente de paz interior — ningún enemigo externo puede romperla mientras esté activa.' } },
    { id: 'e2', t: 'Lectura bíblica (1 capítulo)', xp: 15, st: 'E', tip: { title: 'Espada de doble filo', desc: 'La palabra es espada de doble filo. Cada capítulo absorbe sabiduría ancestral que alimenta tu discernimiento y fortalece tu espíritu ante la adversidad.' } },
    { id: 'e3', t: 'Meditación (10 min)',           xp: 10, st: 'E', tip: { title: 'Estado de calma profunda', desc: 'El personaje entra en quietud absoluta que restaura su enfoque. Reduce efectos del estrés, aumenta concentración y acelera recuperación de energía.' } },
    { id: 'e4', t: 'Lectura (20 páginas)',          xp: 15, st: 'M', tip: { title: 'Absorción de conocimiento', desc: 'Cada página es una habilidad nueva absorbida. La mente se expande y el personaje gana perspectivas que otros cazadores nunca verán.' } },
  ],
  F: [
    { id: 'f1', t: 'Hidratación (2 litros)',           xp: 8,  st: 'V', tip: { title: 'Recarga vital', desc: 'El guerrero recarga su energía vital. Sin hidratación el personaje opera al 60% — con ella activa su rendimiento máximo de combate.' } },
    { id: 'f2', t: 'Batido de verduras',               xp: 8,  st: 'V', tip: { title: 'Nutrición de élite', desc: 'Combustible de alto octanaje para un cuerpo de combate. Los guerreros de clase S no descuidan lo que consumen.' } },
    { id: 'f3', t: 'Ejercicio cuello y facial',        xp: 8,  st: 'V', tip: { title: 'Forja del rostro', desc: 'El rostro y cuello del guerrero se forjan con disciplina. Presencia y postura son armas silenciosas en el campo social.' } },
    { id: 'f4', t: 'Cardio (según fase)',              xp: 20, st: 'F', tip: { title: 'Resistencia acumulada', desc: 'La resistencia se construye un kilómetro a la vez. Cada sesión agrega un escudo invisible contra el agotamiento futuro.' } },
    { id: 'f5', t: 'Gym — tronco superior/inferior',  xp: 25, st: 'F', tip: { title: 'Templo del guerrero', desc: 'El cuerpo es el primer campo de batalla. Un guerrero con cuerpo débil limita su poder mental y espiritual — el gym es sagrado.' } },
  ],
  S: [
    { id: 's1', t: 'Módulo activo Python (3–4h)', xp: 30, st: 'M', coins: 10, tip: { title: 'Dominio del código', desc: 'El código es el nuevo idioma del poder. Cada hora de estudio activo construye habilidades que generarán ingresos reales en meses.' } },
    { id: 's2', t: 'Inglés (30 min)',              xp: 15, st: 'M', tip: { title: 'Llave al mundo', desc: 'Cada palabra nueva en inglés abre una puerta al mundo global. Los cazadores de clase S operan sin fronteras de idioma.' } },
    { id: 's3', t: 'Finanzas e inversión (30 min)',xp: 20, st: 'D', tip: { title: 'Inteligencia financiera', desc: 'El dinero obedece a quien lo estudia. Cada sesión construye el sistema mental que separa a quienes crean riqueza de quienes la persiguen.' } },
  ]
};

const MISIONES_SECRETAS = [
  'Habla con un extraño hoy y aprende su nombre',
  'Escribe tu visión de vida en 5 años con detalle',
  'Haz 50 flexiones ahora mismo sin parar',
  'Medita 20 minutos extra en silencio total',
  'Escribe 3 cosas que agradeces profundamente',
  'Sal a caminar 30 min sin celular ni música',
  'Lee 10 páginas de un libro fuera de tu zona de confort',
  'Contacta a alguien importante que tienes pendiente',
];

const ZONA_OSCURA_ITEMS = [
  'Redes sociales sin límite (máx 20 min/día)',
  'Lujuria',
  'Simpear',
  'Videojuegos sin ganarlos como recompensa',
  'Comida chatarra / dulces / alcohol',
  'Apuestas',
];

const STACKS = [
  { id: 'shield',  name: 'Escudo Espiritual', color: '#ffd700', max: 5, desc: 'Se alimenta de oración y meditación consecutivas. Reduce penalización si caes un día.' },
  { id: 'steel',   name: 'Mente de Acero',    color: '#bf5fff', max: 5, desc: 'Se alimenta de estudio consecutivo. Aumenta XP de misiones de estudio.' },
  { id: 'iron',    name: 'Cuerpo de Hierro',  color: '#ff2d55', max: 5, desc: 'Se alimenta de gym y cardio consecutivos. Aumenta XP físico.' },
  { id: 'clarity', name: 'Claridad Mental',   color: '#00f5ff', max: 5, desc: 'Se alimenta de lectura y meditación. Desbloquea misiones secretas más valiosas.' },
  { id: 'shadow',  name: 'Disciplina Sombra', color: '#9944ff', max: 5, desc: 'Se alimenta de resistir la zona oscura. Multiplica monedas ganadas.' },
  { id: 'warrior', name: 'Flujo Guerrero',    color: '#ffd700', max: 5, desc: 'Todas las misiones completadas 3 días seguidos. Bonus general, el más raro.' },
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

const STACK_SVGS = {
  shield:  `<svg viewBox="0 0 40 40"><polygon points="20,4 34,10 34,22 20,36 6,22 6,10" fill="#ffd70022" stroke="#ffd700" stroke-width="1.5"/><line x1="20" y1="8" x2="20" y2="32" stroke="#ffd700" stroke-width="1"/><line x1="8" y1="16" x2="32" y2="16" stroke="#ffd700" stroke-width="1"/></svg>`,
  steel:   `<svg viewBox="0 0 40 40"><polygon points="20,4 28,14 36,14 30,22 32,32 20,26 8,32 10,22 4,14 12,14" fill="#bf5fff22" stroke="#bf5fff" stroke-width="1.5"/><circle cx="20" cy="20" r="4" fill="#bf5fff"/></svg>`,
  iron:    `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#ff2d5522" stroke="#ff2d55" stroke-width="1.5"/><path d="M14 26 L20 8 L26 26 Z" fill="#ff2d55" opacity=".6"/></svg>`,
  clarity: `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="18" rx="10" ry="12" fill="#00f5ff22" stroke="#00f5ff" stroke-width="1.5"/><circle cx="20" cy="16" r="3" fill="#00f5ff"/><line x1="20" y1="30" x2="20" y2="36" stroke="#00f5ff" stroke-width="1.5"/><line x1="16" y1="34" x2="24" y2="34" stroke="#00f5ff" stroke-width="1.5"/></svg>`,
  shadow:  `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="#22003a" stroke="#9944ff" stroke-width="1.5"/><path d="M20 6 A14 14 0 0 1 34 20 L20 20Z" fill="#9944ff" opacity=".5"/><circle cx="20" cy="20" r="4" fill="#9944ff"/></svg>`,
  warrior: `<svg viewBox="0 0 40 40"><line x1="8" y1="32" x2="28" y2="8" stroke="#ffd700" stroke-width="2"/><line x1="32" y1="32" x2="12" y2="8" stroke="#ffd700" stroke-width="2"/><circle cx="20" cy="20" r="5" fill="#ffd700" opacity=".3" stroke="#ffd700" stroke-width="1"/></svg>`,
};

const DAYS_LABELS   = ['L','M','X','J','V','S','D'];
const MONTHS_LABELS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
