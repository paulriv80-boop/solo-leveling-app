# CHANGELOG

Formato: fecha, versión/sprint, archivos modificados, cambios. Orden descendente (más reciente arriba).

## 2026-07-06 — sprint 4.1 Fixes visuales post-prueba en celular

**Versión:** v5.1 Alpha — STATE_VERSION 8 (sin cambio)
**Archivos:** `css/topbar.css`, `css/missions.css`, `css/statsoverlay.css`, `js/data.js`, `js/render.js`, `js/events.js`, `index.html`
**Tipo:** Mejoras visuales y UX basadas en prueba real en dispositivo móvil

### 8 fixes implementados

1. **Logo más grande:** `height: 36px` → `52px` en `css/topbar.css`.
2. **Labels de tabs:** "Hecho" → "Hechos", "Saltar" → "Saltados" en `index.html`.
3. **Mini calendario semanal:** Reemplaza la barra XP del día. Muestra los últimos 7 días con puntos de color por estado (verde=completado, rojo=fallido, naranja=parcial, borde blanco=hoy). Implementado en `renderMiniWeek()` + CSS `.mw-*`.
4. **Swipe Tinder:** Sistema de paneles eliminado. Ahora: swipe derecha → overlay verde + checkmark SVG crece con el arrastre; swipe izquierda → overlay rojo + X. Al superar threshold (80px) la tarjeta vuela fuera de pantalla y ejecuta la acción. `attachSwipeHandlers` reescrito con `touchmove { passive: false }` para detectar dirección y usar `e.preventDefault()` solo en swipes horizontales.
5. **Tipografía misiones:** `.mc-name` → `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: 1.5px`, `font-size: 12px`. Sin negrilla, estilizado y elegante.
6. **Tarjetas full-bleed:** Altura reducida de 82px a 68px. Ancho extendido con `margin: 4px -14px` para ir de borde a borde (compensa el padding `14px` del `.content`).
7. **Sin emojis — iconos Tabler:** `CATEGORIES` en `data.js` incluye ahora `iconClass` (Tabler) y `radarLabel` (texto corto 3 letras). En HTML se usa `<i class="ti ti-*">`, en radar SVG se usan labels de texto (CUE/MEN/PRE/ENF/VIN).
8. **Badge de rango rediseñado:** La letra ya no se superpone al símbolo SVG. Nuevo layout: `[SVG badge] [RANGO label + letra en color del rango]`. `renderStats()` actualiza `#avRankLetter` con color dinámico del rango.

---

## 2026-07-06 — sprint 4.0 Refactorización Mayor: Misiones + Stats + Atributos

**Versión:** v5.0 Alpha — STATE_VERSION 8
**Archivos:** `js/data.js`, `js/config.js`, `js/state.js`, `js/logic.js`, `js/render.js`, `js/events.js`, `css/missions.css`, `css/statsoverlay.css`, `index.html`
**Tipo:** Refactorización mayor de datos + rediseño completo de UI

### Cambios principales

**Renombres de atributos (claves de estado):**
- `energia` → `vitalidad`
- `conocimiento` → `intelecto`
- `espiritualidad` → `conexion`

**Categorías de atributos (nuevo sistema de 5 grupos):**
- ⚔ Cuerpo: Fuerza, Agilidad, Vitalidad
- 🧠 Mente: Intelecto
- 🧘 Presencia: Claridad, Serenidad
- 🎯 Enfoque: Disciplina
- 🤝 Vínculo: Confianza, Conexión

**Lógica de barras:** `attr % 5` = barras llenas; `floor(attr/5)` = puntaje de categoría. Ciclos de 5 puntos.

**20 misiones fijas:** m01–m10 visibles (XP total 109), m11–m20 opcionales (botón +). Sistema `cats:[{cat,stars}]` reemplaza `stats:[]` para mapeo visual y de atributos.

**Sistema Propósito:** `ST.proposito: ''` → `ST.propositos: []`. Array de objetos `{id, name, desc, objetivo, frecuencia, progreso, created}`. CRUD completo vía modal.

**Misiones swipe cards:** Nuevo diseño. Swipe derecha → botones Hecho / Saltar. Swipe izquierda → info XP + categorías.

**Tabs de misiones:** To-dos / Hecho / Saltar con contadores. Estado `ST.mis[fecha][id]`: `'done'` | `'skip'` | `undefined`.

**Radar pentagonal (5 ejes):** `buildRadarSVG(catValues)` reemplaza radar de 9 ejes. Ejes con icono emoji + nombre.

**Overlay Atributos:** Categorías numeradas 1-5, puntaje por categoría, 5 barras verticales luminosas por atributo.

**Logo:** Boot + topbar ahora usan `trasparente.png`.

**STATE_VERSION 7 → 8:** Migración automática preserva valores de fuerza/agilidad/serenidad/confianza/claridad/disciplina; traduce energia→vitalidad, conocimiento→intelecto, espiritualidad→conexion. Limpia `ST.mis` (IDs cambian). Inicializa `propositos: []`, `activeMissions: [m01-m10]`.

---

## 2026-07-05 — sprint 3.0 NUEVA ARQUITECTURA MOBILE FIRST — Presence

**Versión:** v4.0 Alpha — STATE_VERSION 7 (sin cambio)
**Archivos:** `index.html`, `js/render.js`, `js/events.js`, `js/utils.js`, `css/style.css`, `css/bottomnav.css` (nuevo), `css/placeholders.css` (nuevo), `css/navigation.css`, `css/avatar.css`, `css/topbar.css`, `css/responsive.css`
**Tipo:** Refactorización arquitectónica mayor + nueva UX

### Cambios principales

- **Nombre de la app:** "THE SYSTEM" → **Presence** (topbar, boot screen, `<title>`, meta description).
- **Navegación:** 7 pestañas horizontales de texto eliminadas. Reemplazadas por **barra inferior fija** (`position: fixed; bottom: 0`) con 5 iconos Tabler (`ti-home`, `ti-chart-bar`, `ti-shield`, `ti-tools`, `ti-grid-dots`).
- **5 secciones:**
  - **Misiones** (home, por defecto): Header con fecha local + contador **X/90 días**, card XP del día, 4 categorías de misiones, 3 collapsibles (Calendario, Zona Oscura, Ruta de Propósito).
  - **Stats**: Avatar placeholder SVG animado + acordeón de rango + 9 atributos + Operator Level + XP/Racha.
  - **Comunidad**: Placeholder con lista de funcionalidades futuras (ranking, eventos, desafíos).
  - **Tools**: Grid 2 columnas con 8 herramientas Coming Soon; IA Mentor destacado (span 2 cols).
  - **Menú**: Tienda + Alter Egos + Títulos placeholder + Resetear.
- **Topbar simplificado:** Solo logo SVG + nombre "Presence" + status dot. HUD (coins/XP/racha) retirado — esos datos viven en Stats.
- **Collapsibles en Misiones:** CSS `max-height: 0 → 3000px` con transición. `toggleCollapse(bodyId, chevronId)` en events.js. Calendario, Zona Oscura y Ruta de Propósito ahora son secciones secundarias de la pantalla principal.
- **Contador 90 días:** `calcDias90()` en utils.js cuenta los últimos 90 días donde el usuario completó ≥3 misiones. Usa fecha local (evita bug UTC).
- **Avatar placeholder:** Cuando `RANGOS[i].avatar` es vacío, se muestra una silueta SVG tintada al color del rango con la misma animación `avatarFloat`. Código preparado para avatares de progresión futuros.
- **render.js refactorizado:** `renderInicio()` → `renderStats()` (personaje); `renderMisiones()` ampliado con header; nuevas `renderMenu()`, `renderComunidad()`, `renderTools()`. `renderAll()` actualizado. `renderHUD()` eliminado (HUD removido de topbar).
- **events.js refactorizado:** `nav()` apunta a `.bnav-item` y 5 IDs nuevos; `toggleCollapse()` nuevo; `toggleMision()` actualiza `renderMisiones()` + `renderCalendario()`; `buyReward()` solo llama `renderTienda()`.
- **css/navigation.css:** Deprecado (solo comentario). Estilos `.nav` y `.nb` ya no se usan.
- **css/bottomnav.css:** Nuevo. Estilos `.bottom-nav` y `.bnav-item`.
- **css/placeholders.css:** Nuevo. `.missions-header`, `.collapsible`, `.ph-screen`, `.tools-grid`, `.tool-tile`, `.menu-section-title`, `.menu-grid`, `.menu-tile`.

---

## 2026-07-04 — sprint 2.10 avatar animado en pantalla de inicio (`74eb480`)

**Versión:** v4.0 Alpha — STATE_VERSION 7
**Archivos:** `css/avatar.css` (nuevo), `css/style.css`, `index.html`, `js/data.js`, `js/render.js`
**Tipo:** Nueva funcionalidad visual

- **Avatar wallpaper:** sección `.avatar-stage` en Inicio ocupa ~62vh de la pantalla, estilo fondo de pantalla de celular.
- **Animaciones CSS puras:**
  - Flotación: `avatarFloat` — sube/baja 10px cada 4s, suave y continua.
  - Aura pulsante: `auraBreath` — gradiente radial detrás del personaje que respira (escala + opacidad).
  - Partículas: 10 puntos de energía con posiciones y duraciones variadas que ascienden y se desvanecen.
- **Dinámica por rango:** `renderAvatar()` en `render.js` aplica `drop-shadow` y color de aura del rango actual (`RANGOS[ST.rank].color`). Al cambiar de rango el glow cambia automáticamente.
- **Preparado para avatares de progresión:** propiedad `avatar` en cada objeto de `RANGOS`. Para agregar un nuevo avatar basta con poner la ruta en `data.js`.
- **Fade inferior:** gradiente de 130px que funde el avatar con el fondo oscuro donde aparecen las cards.

---

## 2026-07-02 — sprint 2.9b iconos SVG rangos (`4580ffc`)

**Versión:** v4.0 Alpha — STATE_VERSION 7
**Archivos:** `js/data.js`, `js/render.js`, `css/ranks.css`, `index.html`
**Tipo:** Mejora visual

- **SVG por rango:** cada elemento de `RANGOS` incluye propiedad `svg` con markup inline. 6 íconos que replican el diseño de referencia visual:
  - E · Novato — círculo bronce con chevron (∧) y acentos en ejes cardinales
  - D · Adepto — círculo acero con flecha apuntando arriba y diamante central
  - C · Experto — estrella de 4 puntas (compás dorado) con cruceta interior
  - B · Disciplinado — círculo violeta con espada vertical y corona de laurel
  - A · Liberado — fénix plateado con alas desplegadas hacia arriba
  - S · Trascendente — orbe dorado con anillo orbital y eje radiante vertical
- `render.js`: `renderRankAccord()` inyecta el SVG en el header y en cada fila de la lista mediante `innerHTML`. `drop-shadow` dinámico al color del rango activo.
- `css/ranks.css`: `.rank-badge-hdr` y `.rank-badge-xs` son contenedores SVG puros — sin borde ni color CSS propio.

---

## 2026-07-02 — sprint 2.9 refactorización sistema de rangos fase 1 (`c677f95`)

**Versión:** v4.0 Alpha — STATE_VERSION 7
**Archivos:** `js/data.js`, `js/config.js`, `js/state.js`, `js/logic.js`, `js/render.js`, `js/events.js`, `js/utils.js`, `index.html`, `css/ranks.css`, `css/components.css`
**Tipo:** Refactorización mayor + eliminación de features

- **Rango Técnico eliminado** completamente (datos, lógica, render, HTML).
- **Sistema de estrellas eliminado:** `DIAS_POR_ESTRELLA`, `ESTRELLAS_POR_RANGO`, `ST.starsH`, `ST.starsT`, `ST.dc`, `starsHTML()`, `.stars` CSS — todo removido.
- **Recompensas de rango eliminadas:** `RECOMPENSAS_HABITOS` y `RECOMPENSAS_TECNICO` removidas de `data.js`.
- **Pestaña "Rangos" eliminada** del menú (7 pestañas). Sección `#sec-rangos` e IDs `rH`, `rT`, `rRewH`, `rRewT` removidos del HTML. `renderRangos()`, `buildRangList()`, `buildRewList()`, `showRankUp()` removidas de `render.js`.
- **6 nuevos rangos** (`RANGOS`): E Novato · D Adepto · C Experto · B Disciplinado · A Liberado · S Trascendente — con color, colorGlow, desc y skills.
- **Acordeón de rango en Inicio:** card clicable que muestra rango actual y, al expandir, lista los 6 rangos con estado (actual / superado / bloqueado). Sin cambio de pantalla.
- **`applyDayCompletion()` simplificada:** solo marca día verde y recalcula racha. Lógica de avance de rango pendiente de rediseño en fase 2.
- **Alter Egos:** umbral de desbloqueo → índice 3 (Disciplinado).
- **Migración v6→v7:** `rankH → rank`, elimina `starsH`, `rankT`, `starsT`, `dc`.
- **Limpieza adicional:** `.pill-t`, `rankupBanner` eliminados.

---

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

- Avatares de progresión: generar imagen por rango (E→S) y asignarlas en `RANGOS[i].avatar`.
- Sistema de rangos fase 2: definir lógica de avance de rango (cómo y cuándo sube `ST.rank`).
- Convertir a PWA: `manifest.json` + `service-worker.js`, soporte offline, instalable en pantalla de inicio.
