# MASTER PROJECT — THE SYSTEM (Solo Leveling App)

## 1. Estado general

- **Versión visible (UI):** v4.0 Alpha (badge del topbar en `index.html`).
- **Versión de esquema de estado:** `CONFIG.STATE_VERSION = 6` (`js/config.js`).
- **Producción:** desplegado en GitHub Pages.
  - App: https://paulriv80-boop.github.io/solo-leveling-app
  - Repo: https://github.com/paulriv80-boop/solo-leveling-app
- **Etapa:** uso personal del propio desarrollador para validar el sistema antes de evolucionar a PWA y, más adelante, a SaaS.
- **Naturaleza:** aplicación 100% frontend (HTML+CSS+JS vanilla), sin backend, sin build tool, persistencia en `localStorage`.

## 2. Visión del producto

Plataforma de evolución personal gamificada inspirada en Solo Leveling. Combina dos sistemas de rango paralelos:

- **Rango Hábitos** (disciplina, espiritualidad, cuerpo, mente) — 6 rangos, de Ansioso a Dominio Interno.
- **Rango Técnico** (carrera en datos/IA) — 7 rangos, de Aprendiz a Maestro.

Meta del usuario: transformación personal en 12 meses; generar ingresos en 6 meses mediante habilidades técnicas (Python, SQL, ML, IA generativa).

**Estrategia de evolución planeada:**
1. Uso personal para validar (etapa actual).
2. Web app PWA instalable en celular.
3. App nativa cuando existan ingresos que lo justifiquen.
4. Comercialización como SaaS con suscripción mensual.

## 3. Arquitectura

Aplicación estática sin framework. Carga clásica vía `<script>` (scope global, sin ES Modules) para mantener compatibilidad con apertura directa de `index.html` (`file://`) y con GitHub Pages.

```
index.html
css/
  style.css        — entry point, @import del resto
  variables.css     — design tokens (colores, glows)
  base.css, topbar.css, navigation.css, layout.css, cards.css, components.css
  missions.css, ranks.css, calendar.css, darkzone.css,
  route.css, shop.css, alteregos.css, reset.css   — un archivo por feature
  animations.css, responsive.css
js/
  data.js           — capa de datos (rangos, misiones, recompensas, tienda, alter egos)
  config.js         — constantes centralizadas (CONFIG)
  state.js          — estado único (ST, DEFAULT_STATE), Storage, migraciones
  utils.js          — utilidades de fecha, formateo, acceso seguro al DOM y Toast
  logic.js          — lógica de negocio pura (no toca el DOM)
  render.js         — presentación (lee estado, nunca lo muta)
  events.js         — handlers invocados desde onclick="" en el HTML
  app.js            — bootstrap: loadState() + renderAll() + bootSystem()
docs/               — documentación obligatoria del proyecto
assets/             — reservado para recursos futuros (vacío)
```

Capas según las reglas del proyecto (Datos / Estado / Lógica de negocio / Presentación / Utilidades):

- **Datos** → `data.js` (sin lógica).
- **Estado** → `config.js` + `state.js` (única fuente de verdad: `ST`).
- **Lógica de negocio** → `logic.js` (XP, monedas, rachas, rangos, nivel; muta `ST` pero nunca el DOM).
- **Presentación** → `render.js` (lee `ST` + `data.js`, nunca muta estado).
- **Utilidades** → `utils.js` (fechas, formateo, helpers DOM seguros, Toast).
- **Orquestación** → `events.js` (todo lo que el HTML llama vía `onclick=""`; conecta logic → state → render).

## 4. Módulos / features existentes

| Módulo | Descripción |
|---|---|
| Inicio | Dashboard: rango actual, estrellas, XP del día, racha, 9 atributos en grilla 3×3, Operator Level |
| Misiones | 4 categorías diarias (Físico / Mente / Espiritual / Propósito) — XP + coins + chips de atributos por misión |
| Rangos | Listado de rangos de Hábitos y Técnico + tabla de recompensas por rango |
| Calendario | Calendario mensual con estados (verde/rojo/dorado/azul), racha y bonus por racha |
| Zona Oscura | Registro diario de "caída" + penalizaciones graduales según rango de Hábitos |
| Ruta | Ruta de estudio de 6 meses + campo configurable de Propósito personal |
| Tienda | Canje de monedas de sombra por recompensas reales |
| Alter Egos | Identidades secundarias desbloqueables desde rango "Equilibrado" |
| Reset | Modal de confirmación para borrar todo el progreso |

## 5. Sistema de progresión (resumen)

- 1 estrella cada `CONFIG.DIAS_POR_ESTRELLA` (20) días consecutivos completando **todas** las misiones diarias.
- 3 estrellas → sube de rango de Hábitos, banner de rank-up con habilidades desbloqueadas y recompensa.
- Racha (`ST.racha`) = días verdes consecutivos reales, recalculada desde el calendario (`DateUtils.calcRacha`), nunca un contador acumulativo simple.
- Bonus de racha en `CONFIG.RACHA_BONUS = [3, 7, 30]` días.
- **9 atributos** (`ST.stats`): Fuerza, Agilidad, Energía, Serenidad, Confianza, Conocimiento, Claridad, Espiritualidad, Disciplina. Cada misión especifica qué atributos incrementa mediante `stats: ['attr1', 'attr2']`.
- **Monedas (`ST.coins`):** máx. 26c/día según misiones completadas. Se gastan en la Tienda.
- **Operator Level:** `getLevel(totalXP)` en `utils.js` calcula nivel con progresión escalada (Nivel 1→2: 200 XP, cada nivel siguiente requiere 150 XP adicionales). Se muestra en Inicio con barra de progreso.
- **Misiones auto-reset:** cada nuevo día local (fecha en hora local, no UTC) el historial del día anterior queda intacto pero el día actual siempre empieza desde cero. Almacenamiento: `ST.mis['YYYY-MM-DD']`.

## 6. Funcionalidades implementadas

Todas las descritas en la sección 4, con persistencia completa en `localStorage` (clave `sl_v3`) y migraciones de esquema de v1 a v6.

**Estructura de misiones (`data.js`):**
```js
// Cada misión:
{ id: 'ph1', t: 'Ejercicio de fuerza', desc: 'Mínimo 45 minutos', xp: 20, coins: 3, stats: ['fuerza'] }
// 15 misiones totales — XP diario máximo: 177, Coins máximo: 26
```
Categorías: `FISICO` (ph1–ph5) / `MENTE` (mn1–mn6) / `ESPIRITUAL` (sp1–sp3) / `PROPOSITO` (pu1, texto dinámico de `ST.proposito`).

**Migraciones de estado:**
| Versión | Cambio |
|---|---|
| v1→v2 | Añade `dias`, `racha` |
| v2→v3 | Añade `mis`, `coins` |
| v3→v4 | Añade `stacks`, `stacksHoy`, `zona`, `alter` |
| v4→v5 | 9 nuevos atributos, elimina stacks, añade `proposito` |
| v5→v6 | Limpia `ST.mis` (fix colisión de IDs de misiones) |

## 7. Funcionalidades pendientes (roadmap)

Ver detalle priorizado en `docs/TODO.md`. Próximo hito:

- [ ] Convertir a PWA (`manifest.json` + `service-worker.js`).
- [ ] Soporte offline.
- [ ] Instalable en pantalla de inicio del celular.
- [ ] Backend / API REST / sincronización en la nube (futuro, no antes de tiempo).

## 8. Decisiones técnicas relevantes

Ver `docs/DECISION_LOG.md` para el detalle de cada decisión con alternativas consideradas.

## 9. Próximos objetivos

1. Evaluar conversión a PWA una vez estabilizada la base de código.
2. Añadir tests de regresión (ver `TODO.md`).
3. Definir uso de la carpeta `assets/`.
