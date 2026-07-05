# Presence — Solo Leveling App

Plataforma de evolución personal gamificada inspirada en Solo Leveling. Convierte hábitos diarios y estudio técnico (datos/IA) en un sistema de progresión tipo RPG: misiones, XP, monedas, rangos, rachas y recompensas reales.

## Cómo ejecutar el proyecto

No requiere instalación ni build. Es HTML/CSS/JS puro:

1. Clona o descarga el repositorio.
2. Abre `index.html` directamente en el navegador, **o**
3. Sírvelo con cualquier servidor estático (ej. `npx serve .`) si prefieres probarlo como en producción.

Producción: https://paulriv80-boop.github.io/solo-leveling-app (GitHub Pages, se actualiza automáticamente con cada push a `main`).

## Estructura

```
index.html        — estructura completa de la app (5 tabs + bottom nav)
css/               — estilos modulares (ver style.css como entry point)
  bottomnav.css    — barra inferior fija (5 tabs)
  placeholders.css — collapsibles, tools-grid, menu, coming soon
js/
  data.js          — datos del juego (rangos, misiones, recompensas, etc.)
  config.js        — constantes centralizadas
  state.js         — estado global, persistencia y migraciones
  utils.js         — utilidades de fecha/formateo/DOM, Toast y calcDias90()
  logic.js         — reglas de negocio (XP, monedas, rachas, rangos)
  render.js         — funciones de presentación (renderStats, renderMisiones, renderMenu…)
  events.js         — handlers conectados a los onclick="" del HTML
  app.js            — arranque de la aplicación
docs/              — documentación del proyecto
assets/            — imágenes de avatar por rango
```

## Tecnologías

- HTML5 + CSS3 (custom properties, sin preprocesador)
- JavaScript vanilla ES6+ (sin framework, sin TypeScript, sin bundler)
- `localStorage` para persistencia del progreso
- Tabler Icons (CDN) para iconografía
- GitHub Pages para hosting

## Objetivos del proyecto

Evolucionar desde una herramienta personal hacia una plataforma comercial de desarrollo personal gamificada (web → PWA → app nativa → SaaS). Ver `docs/MASTER_PROJECT.md` para la visión completa y `docs/TODO.md` para el roadmap priorizado.

## Convenciones de código

- Una sola fuente de verdad para el estado: el objeto `ST` (definido en `js/state.js`), nunca estados paralelos.
- Toda configuración/balance del juego vive en `CONFIG` (`js/config.js`) o en `js/data.js` — nunca números mágicos sueltos en la lógica.
- Separación de capas: datos (`data.js`) / estado (`config.js`, `state.js`) / lógica de negocio (`logic.js`) / presentación (`render.js`) / utilidades (`utils.js`). Los handlers de UI (`events.js`) son los únicos que orquestan entre capas.
- Cambios de forma del estado → incrementar `CONFIG.STATE_VERSION` y añadir un caso en `StateMigration.migrate()`. Nunca romper partidas guardadas existentes.
- Ver reglas completas del proyecto en `instrucciones_claude.md` (raíz del repo).
