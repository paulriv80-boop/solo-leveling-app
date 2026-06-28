# MASTER PROJECT — THE SYSTEM (Solo Leveling App)

## 1. Estado general

- **Versión visible (UI):** v4.0 Alpha (badge del topbar en `index.html`).
- **Versión de esquema de estado:** `CONFIG.STATE_VERSION = 4` (`js/app.js`).
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
  data.js           — capa de datos (rangos, misiones, recompensas, stacks, tienda, alter egos)
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
- **Lógica de negocio** → `logic.js` (XP, monedas, stacks, rachas, rangos; muta `ST` pero nunca el DOM).
- **Presentación** → `render.js` (lee `ST` + `data.js`, nunca muta estado).
- **Utilidades** → `utils.js` (fechas, formateo, helpers DOM seguros, Toast).
- **Orquestación** → `events.js` (todo lo que el HTML llama vía `onclick=""`; conecta logic → state → render).

## 4. Módulos / features existentes

| Módulo | Descripción |
|---|---|
| Inicio | Dashboard: rango actual, estrellas, XP del día, racha, stats (orbes), stacks de poder |
| Misiones | Misiones diarias por categoría (Espirituales/mentales, Físicas, Estudio) + misión secreta semanal |
| Rangos | Listado de rangos de Hábitos y Técnico + tabla de recompensas por rango |
| Calendario | Calendario mensual con estados (verde/rojo/dorado/azul), racha y bonus por racha |
| Zona Oscura | Registro diario de "caída" + penalizaciones graduales según rango de Hábitos |
| Ruta | Ruta de estudio de 6 meses (8 módulos técnicos) |
| Tienda | Canje de monedas de sombra por recompensas reales |
| Alter Egos | Identidades secundarias desbloqueables desde rango "Equilibrado" |
| Reset | Modal de confirmación para borrar todo el progreso |

## 5. Sistema de progresión (resumen)

- 1 estrella cada `CONFIG.DIAS_POR_ESTRELLA` (20) días consecutivos completando **todas** las misiones diarias.
- 3 estrellas → sube de rango de Hábitos, banner de rank-up con habilidades desbloqueadas y recompensa.
- Racha (`ST.racha`) = días verdes consecutivos reales, recalculada desde el calendario (`DateUtils.calcRacha`), nunca un contador acumulativo simple.
- Bonus de racha en `CONFIG.RACHA_BONUS = [3, 7, 30]` días.
- Stacks de poder (6, máx. nivel 5 cada uno) se incrementan una vez por día cuando se cumple su condición; se resetean diariamente vía `ST.stacksHoy`.

## 6. Funcionalidades implementadas

Todas las descritas en la sección 4, con persistencia completa en `localStorage` (clave `sl_v3`) y migraciones de esquema de v1 a v4.

## 7. Funcionalidades pendientes (roadmap)

Ver detalle priorizado en `docs/TODO.md`. Resumen del próximo hito (v4.0):

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
