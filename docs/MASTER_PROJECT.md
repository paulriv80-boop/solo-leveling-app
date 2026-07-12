# MASTER PROJECT — Presence (Solo Leveling App)

## 1. Estado general

- **Nombre de la app:** **Presence** (anteriormente "THE SYSTEM").
- **Versión visible (UI):** v6.0 Alpha.
- **Versión de esquema de estado:** `CONFIG.STATE_VERSION = 9` (`js/config.js`).
- **Producción:** desplegado en GitHub Pages.
  - App: https://paulriv80-boop.github.io/solo-leveling-app
  - Repo: https://github.com/paulriv80-boop/solo-leveling-app
- **Etapa:** uso personal del propio desarrollador para validar el sistema antes de evolucionar a PWA y, más adelante, a SaaS.
- **Naturaleza:** aplicación 100% frontend (HTML+CSS+JS vanilla), sin backend, sin build tool, persistencia en `localStorage`.

## 2. Visión del producto

Plataforma de evolución personal gamificada inspirada en Solo Leveling. Sistema de rango único de 6 niveles:

**E Novato → D Adepto → C Experto → B Disciplinado → A Liberado → S Trascendente**

Cada rango tiene ícono SVG propio, color y habilidades desbloqueadas. La lógica de avance de rango (fase 2) está pendiente de diseño.

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
  missions.css, ranks.css, avatar.css, calendar.css, darkzone.css,
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
assets/             — imágenes del juego (avatar.png y futuros avatares de progresión por rango)
```

Capas según las reglas del proyecto (Datos / Estado / Lógica de negocio / Presentación / Utilidades):

- **Datos** → `data.js` (sin lógica).
- **Estado** → `config.js` + `state.js` (única fuente de verdad: `ST`).
- **Lógica de negocio** → `logic.js` (XP, monedas, rachas, nivel; muta `ST` pero nunca el DOM).
- **Presentación** → `render.js` (lee `ST` + `data.js`, nunca muta estado).
- **Utilidades** → `utils.js` (fechas, formateo, helpers DOM seguros, Toast).
- **Orquestación** → `events.js` (todo lo que el HTML llama vía `onclick=""`; conecta logic → state → render).

## 4. Módulos / features existentes

| Tab | Descripción |
|---|---|
| **Misiones** (home) | Topbar HUD (XP+Coins+Settings); logo piedra-tallada; header X/90 premium; mini calendario 7 días; 4 tabs (To-dos / Hechos / Saltados / botón+); tarjetas swipe Tinder con badge racha/freq/dif + botón chevron para expandir panel de historial (calendario 30d, estadísticas, recordatorio); panel misiones opcionales (+); botón Agregar Propósito |
| **Progreso** (antes Stats) | Avatar full-screen con aura pulsante logo Presence; badge rango; X/90 top-right; botón Tienda + botón Trofeo (derecha); overlay Tienda: canje de monedas de sombra; overlay Atributos: radar pentagonal (5 categorías, colapsables) + barras luminosas; overlay Alter Egos; overlay Rangos |
| **Comunidad** | Placeholder — arquitectura para rankings, eventos globales y desafíos cooperativos (futuro) |
| **Tools** | Grid de herramientas Coming Soon: IA Mentor (destacado), Pomodoro, Respiración, Workout, Diario, Visualización, Temporizador, Meditación |
| **Menú** | Alter Egos + Títulos placeholder + Reset |

## 5. Sistema de progresión (resumen)

- Racha (`ST.racha`) = días verdes consecutivos reales, recalculada desde el calendario (`DateUtils.calcRacha`), nunca un contador acumulativo simple.
- Bonus de racha en `CONFIG.RACHA_BONUS = [3, 7, 30]` días.
- **Rango (`ST.rank`):** índice 0–5 en `RANGOS`. La lógica de avance (cuándo sube) está pendiente de diseño en fase 2. El rango se muestra en Inicio como card acordeón con ícono SVG del rango actual.
- **10 atributos** (`ST.stats`): Fuerza, Agilidad, Vitalidad, Serenidad, Confianza, Intelecto, Claridad, Conexión, Disciplina, Empatía. Organizados en 5 categorías (`CATEGORIES` en `data.js`): Cuerpo (3) / Mente (1) / Presencia (2) / Enfoque (1) / Vínculo (3).
- **Lógica de barras:** `attr_value % 5` = barras llenas del atributo (ciclos de 5). Puntaje de categoría = `sum(floor(attr/5))` para attrs en esa categoría.
- **20 misiones fijas** (`MISIONES` array en `data.js`): m01–m10 visibles (con imagen de fondo), m11–m20 opcionales. Propiedades: `cats:[{cat, stars}]` (visual + mapeo de atributos), `freq` (string: 'Diario'/'3x/sem'/etc.), `dif` (1–5, estático), `img` (ruta asset, solo m01–m10).
- **Sistema Propósito:** `ST.propositos[]` = array de objetos `{id, name, desc, objetivo, frecuencia, progreso, created}`. Cada propósito genera una tarjeta swipe diaria con XP=25.
- **Estado de misión:** `ST.mis[fecha][id]` = `'done'` | `'skip'` | `undefined`.
- **Monedas (`ST.coins`):** máx. 26c/día según misiones completadas. Se gastan en la Tienda.
- **Operator Level:** `getLevel(totalXP)` calcula nivel con progresión escalada (Nivel 1→2: 200 XP, +150 XP por cada nivel adicional). Se muestra en Inicio con barra de progreso.
- **Misiones auto-reset:** cada nuevo día local (no UTC) el día actual empieza desde cero. Almacenamiento: `ST.mis['YYYY-MM-DD']`.

## 6. Funcionalidades implementadas

Todas las descritas en la sección 4, con persistencia completa en `localStorage` (clave `sl_v3`) y migraciones de esquema de v1 a v9.

**Estructura de misiones (`data.js`):**
```js
// Cada misión:
{ id: 'm03', name: 'Levantar Pesas', desc: 'Mínimo 45 minutos', xp: 20, coins: 2, hidden: false,
  freq: '3x/sem', dif: 4, img: 'assets/Avatar_Rango_E_levantar_pesas.png',
  cats: [{ cat: 'cuerpo', stars: 3 }, { cat: 'enfoque', stars: 2 }] }
// 20 misiones — m01–m10 default (con img), m11–m20 opcionales — XP diario máximo: 109
// freq: string de frecuencia display  |  dif: 1–5 (estático, escalará con rango en el futuro)
```

**Migraciones de estado:**
| Versión | Cambio |
|---|---|
| v1→v2 | Añade `dias`, `racha` |
| v2→v3 | Añade `mis`, `coins` |
| v3→v4 | Añade `stacks`, `stacksHoy`, `zona`, `alter` |
| v4→v5 | 9 nuevos atributos, elimina stacks, añade `proposito` |
| v5→v6 | Limpia `ST.mis` (fix colisión de IDs de misiones) |
| v6→v7 | `rankH → rank`, elimina `starsH`, `rankT`, `starsT`, `dc` |
| v7→v8 | `energia→vitalidad`, `conocimiento→intelecto`, `espiritualidad→conexion`; `propositos[]`; `activeMissions[]`; limpia `ST.mis` |
| v8→v9 | Añade `empatia: 0` a `ST.stats` (3er atributo de Vínculo) |

> **Sprint 4.3 (sin cambio de STATE_VERSION):** bug `calcDias90` corregido, logo con aura pulsante color-rango, tab Progreso, categorías colapsables, Tienda en overlay de Progreso, badges racha/freq/dif en misiones, imágenes de fondo m01–m10.
> **Sprint 4.4 (sin cambio de STATE_VERSION):** botón Rango compacto (44×44, columna derecha, encima de Tienda), swipe de misiones sin deformación de viewport (`html { overflow-x: hidden }`), logo con efecto piedra tallada estático (sin animación, sin neón), nuevos assets `final/logo.png` y `final/solo_icon.png`, logo añadido en home de misiones.
> **Sprint 5.0 (sin cambio de STATE_VERSION):** logo visible con filtro piedra `invert+sepia`, topbar HUD (XP+Coins+Settings), header misiones sin fecha + X/90 pill premium, botón (+) en tabs, 3 collapsibles eliminados (Calendario global, Zona Oscura+lógica, Ruta de Propósito), calendario expandible por misión (historial 30d, stats efectividad/racha/total, recordatorio ON/OFF+hora+días guardado en `ST.reminders`), animación XP flotante al completar. Funciones eliminadas: `renderZona`, `renderRuta`, `toggleZona`, `toggleZonaFall`.
> **Sprint 5.1 (sin cambio de STATE_VERSION):** logo definitivo `logo final.png` (símbolo+texto) en topbar y boot screen sin filtros CSS; eliminado ícono flotante `.missions-logo-row` y mini-semana `#mMiniWeek`; X/90 rediseñado con número 32px, separador `/90`, label `DÍAS ACTIVOS` tracking-2px, barra de progreso cyan animada `#mDias90Bar`; botón Rutina `.m-rutina-btn` en header junto al X/90; tabs rediseñados como pills glassmorphism; calendario mensual real por misión: 7 columnas, iniciales L/M/X/J/V/S/D, offset de celdas vacías por día de semana, números de día visibles en celdas de color semitransparente. Función `_renderMisionDetail` reescrita.

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
