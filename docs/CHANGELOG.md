# CHANGELOG

Formato: fecha, versión/sprint, archivos modificados, cambios. Orden descendente (más reciente arriba).

## 2026-06-30 — sprint 2.7 (`3622e99`)

**Versión:** v4.0 Alpha — STATE_VERSION 6
**Archivos:** `js/data.js`, `js/config.js`, `js/state.js`, `js/utils.js`, `js/render.js`, `js/events.js`, `index.html`
**Tipo:** Bug fix + Nuevas funcionalidades

### Bugs corregidos
- **Reset diario de misiones (bug timezone):** `DateUtils.today()` usaba `toISOString()` (UTC). En Colombia (UTC-5) el día cambiaba a las 7pm local en lugar de medianoche, dejando misiones completadas "visibles" durante 5 horas extra al siguiente día local. Reemplazado por fecha local con `getFullYear/getMonth/getDate`.
- **Colisión de IDs de misiones:** Los IDs de la refactorización anterior (`f1-f5`, `e1-e3`) coincidían con IDs del sistema anterior, causando que el estado guardado de días anteriores apareciera como "marcado" en el nuevo sistema. IDs renombrados a `ph1-ph5`, `mn1-mn6`, `sp1-sp3`, `pu1`. Migración v5→v6 limpia `ST.mis` al actualizar.

### Nuevas funcionalidades
- **Monedas por misión:** Cada misión otorga coins al completarse (máx. 26c/día). Se muestran en la fila de misión (`+20 XP +3c`) y en el toast al completar. Escala: misiones de mayor esfuerzo dan más monedas (ejercicio de fuerza 3c, inglés 3c, propósito 5c).
- **Sistema de Level del Operator:** `getLevel(totalXP)` en `utils.js` calcula el nivel con progresión escalada (Nivel 1→2: 200 XP, +150 XP adicionales por nivel). Card "Operator Level" en Inicio muestra nivel actual, XP en el nivel y barra de progreso. Se actualiza en tiempo real al completar misiones.

---

## 2026-06-30 — sprint 2.6 (`15cb337`)

**Versión:** v4.0 Alpha — STATE_VERSION 5
**Archivos:** `js/data.js`, `js/config.js`, `js/state.js`, `js/logic.js`, `js/render.js`, `js/events.js`, `index.html`, `css/components.css`, `css/layout.css`, `css/missions.css`, `css/route.css`
**Tipo:** Refactorización completa de funcionalidad e interfaz

- **Atributos (Inicio):** 5 orbs (F/M/E/V/D) reemplazados por 9 en grilla 3×3: Fuerza, Agilidad, Energía, Serenidad, Confianza, Conocimiento, Claridad, Espiritualidad, Disciplina. Colores distintos por tipo.
- **Stacks de poder:** Eliminados completamente (sección en Inicio, lógica en `logic.js`, CSS en `components.css`).
- **Misiones — nueva estructura:** 4 categorías (Físico / Mente / Espiritual / Propósito) reemplazando las 3 antiguas (E/F/S). Cada misión muestra nombre, descripción opcional, XP y chips de atributos que incrementa. Sin tooltips.
- **Misión Propósito:** Misión única dinámica cuyo texto se configura desde la pestaña Ruta (`ST.proposito`). Botón "Guardar" persiste el propósito. No requiere modificar código.
- **Misión secreta semanal:** Eliminada completamente (card, lógica, estados en `ST.mis`).
- **data.js:** Cada misión tiene `stats: ['attr1', 'attr2']` — arquitectura preparada para agregar misiones o atributos sin tocar lógica.
- **logic.js:** `applyMissionToggle` acepta array de stats; delta unificado (+1/-1). Eliminadas `recalcStacksHoy()` y `applyStackUpdates()`.
- **state.js:** Migración v4→v5: nuevos atributos (9), elimina stacks, agrega `ST.proposito`.
- **XP diario máximo:** 189 → 177 (15 misiones × XP asignado por dificultad).
- **Verificado:** Chrome headless, 0 errores JS, 8/8 pestañas OK, toggle misión actualiza XP y atributo, propósito guardado en Ruta aparece en Misiones.

---

## [Sin publicar] — 2026-06-28

**Versión:** v4.0 Alpha
**Tipo:** Documentación + Refactorización

- Redactados los documentos obligatorios del proyecto (`MASTER_PROJECT.md`, `README.md`, `CHANGELOG.md`, `TODO.md`, `DECISION_LOG.md`), que existían vacíos desde el commit `e6eedc8`.
- Refactor de `js/app.js` (1131 líneas, monolito) en módulos por responsabilidad: `config.js`, `state.js`, `utils.js`, `logic.js`, `render.js`, `events.js`, dejando `app.js` como bootstrap (`loadState(); renderAll(); bootSystem();`). Ver detalle de la división en `DECISION_LOG.md`.
- `index.html` actualizado con el nuevo orden de `<script>` (`data` → `config` → `state` → `utils` → `logic` → `render` → `events` → `app`).
- Corrección menor: se eliminó la doble llamada a `saveState()` que ocurría en el flujo de completar una misión (antes se guardaba una vez dentro de `checkDayComplete()` y otra vez al final de `toggleMision()`). Ahora se guarda una sola vez.
- Verificado en navegador (Chrome headless vía Puppeteer, sirviendo la app como estática): carga sin errores de consola propios de la app, navegación entre las 8 secciones, marcar/desmarcar misión actualiza XP/monedas correctamente, y el ciclo de estados del calendario (vacío → verde → rojo) funciona igual que antes del refactor. Sin cambios de comportamiento para el usuario.
- `css/modules.css` (182 líneas, 8 features sin relación) dividido en 8 archivos por feature: `missions.css`, `ranks.css`, `calendar.css`, `darkzone.css`, `route.css`, `shop.css`, `alteregos.css`, `reset.css`. `css/style.css` actualizado con los nuevos `@import`.
- Corrección menor: `.rname` estaba declarado dos veces en `modules.css` (en "RANG LIST" y en "TIENDA") con propiedades distintas (`flex`, `color`); se consolidó en una sola declaración en `ranks.css`. Verificado que el resultado visual es idéntico en Rangos, Recompensas y Tienda (las tres vistas que usan esa clase).
- Eliminados estilos inline duplicados en `index.html`: los 5 `<div class="card" style="padding:8px 4px;text-align:center">` de los orbes de stats (Inicio) ahora usan una regla `.g5 .card` en `layout.css`; y el `style="margin-bottom:12px"` redundante del `streak-box` de Tienda (la clase `.streak-box` ya define ese mismo valor).
- Verificado de nuevo en navegador tras el cambio de CSS: capturas de Inicio, Rangos y Tienda idénticas a antes del cambio.

## 2026-06-27 — sprint 2.2 (`a12a982`)

**Archivos:** `js/app.js`
**Tipo:** Corrección de bug

- Fix en la lógica de JS (ver commit `a12a982`, "sprint 2.2 js fix bug").

## 2026-06-27 — fix documentation files (`e6eedc8`)

**Archivos:** `docs/CHANGELOG.doc` → eliminado, `docs/MASTER_PROJECT.doc` → eliminado

- Se eliminaron los documentos en formato `.doc` (binario, no apto para control de versiones en texto). Quedaron pendientes de redactar en formato `.md` hasta esta sesión.

## 2026-06-27 — sprint 2.1 CSS Modularization (`c5924d2`)

**Archivos:** `css/*`
**Tipo:** Refactorización

- División del CSS monolítico en 10 archivos modulares: `variables`, `base`, `topbar`, `navigation`, `layout`, `cards`, `components`, `modules`, `animations`, `responsive`, unificados vía `@import` en `style.css`.

## 2026-06-26 — sprint 1 (`203a9bc`)

**Tipo:** Desarrollo de funcionalidades base

- Implementación de los módulos principales: Inicio, Misiones, Rangos, Calendario, Zona Oscura, Ruta, Tienda, Alter Egos, Reset.

## 2026-06-26 — Primera modificación (`654c342`)

- Ajustes iniciales sobre la base subida.

## 2026-06-23 — Add files via upload (`ef20735`)

- Versión inicial del proyecto (tag `v0.1`).

---

## Próximo sprint (propuesto)

- Convertir a PWA: `manifest.json` + `service-worker.js`, soporte offline, instalable en pantalla de inicio.
