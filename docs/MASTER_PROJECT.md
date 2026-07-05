# MASTER PROJECT — Presence (Solo Leveling App)

## 1. Estado general

- **Nombre de la app:** **Presence** (anteriormente "THE SYSTEM").
- **Versión visible (UI):** v4.0 Alpha.
- **Versión de esquema de estado:** `CONFIG.STATE_VERSION = 7` (`js/config.js`).
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
| **Misiones** (home) | Header con fecha + contador X/90 días; card XP del día; 4 categorías (Físico / Mente / Espiritual / Propósito); 3 collapsibles: Calendario, Zona Oscura, Ruta de Propósito |
| **Stats** | Avatar placeholder SVG animado (o imagen de progresión cuando exista) + acordeón de rango SVG + 9 atributos 3×3 + Operator Level + XP/Racha |
| **Comunidad** | Placeholder — arquitectura para rankings, eventos globales y desafíos cooperativos (futuro) |
| **Tools** | Grid de herramientas Coming Soon: IA Mentor (destacado), Pomodoro, Respiración, Workout, Diario, Visualización, Temporizador, Meditación |
| **Menú** | Tienda (canje de monedas de sombra) + Alter Egos (identidades desde Rango B) + Títulos placeholder + Reset |

## 5. Sistema de progresión (resumen)

- Racha (`ST.racha`) = días verdes consecutivos reales, recalculada desde el calendario (`DateUtils.calcRacha`), nunca un contador acumulativo simple.
- Bonus de racha en `CONFIG.RACHA_BONUS = [3, 7, 30]` días.
- **Rango (`ST.rank`):** índice 0–5 en `RANGOS`. La lógica de avance (cuándo sube) está pendiente de diseño en fase 2. El rango se muestra en Inicio como card acordeón con ícono SVG del rango actual.
- **9 atributos** (`ST.stats`): Fuerza, Agilidad, Energía, Serenidad, Confianza, Conocimiento, Claridad, Espiritualidad, Disciplina. Cada misión especifica cuáles incrementa mediante `stats: ['attr1', 'attr2']`.
- **Monedas (`ST.coins`):** máx. 26c/día según misiones completadas. Se gastan en la Tienda.
- **Operator Level:** `getLevel(totalXP)` calcula nivel con progresión escalada (Nivel 1→2: 200 XP, +150 XP por cada nivel adicional). Se muestra en Inicio con barra de progreso.
- **Misiones auto-reset:** cada nuevo día local (no UTC) el día actual empieza desde cero. Almacenamiento: `ST.mis['YYYY-MM-DD']`.

## 6. Funcionalidades implementadas

Todas las descritas en la sección 4, con persistencia completa en `localStorage` (clave `sl_v3`) y migraciones de esquema de v1 a v7.

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
| v6→v7 | `rankH → rank`, elimina `starsH`, `rankT`, `starsT`, `dc` |

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
