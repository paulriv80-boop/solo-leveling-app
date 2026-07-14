# CHANGELOG

Formato: fecha, versión/sprint, archivos modificados, cambios. Orden descendente (más reciente arriba).

## 2026-07-13 — sprint 5.4 — Sistema "Rutina": Wizard guiado · Pilares · Goal · Camino · Guardianes · Mapa

**Versión:** v6.1 Alpha — STATE_VERSION 11
**Archivos:** `js/data.js`, `js/config.js`, `js/state.js`, `js/logic.js`, `js/events.js`, `js/render.js`, `css/rutina.css`, `css/style.css`, `index.html`
**Tipo:** Feature completa — nuevo sistema central de la app

### Cambios implementados

1. **Wizard Rutina (5 pasos + intro).** El botón `+` del header de misiones se convierte en `⊞` y abre un overlay full-screen (z-700, slide-up) con 6 pasos: Intro → Pilares → Goal → Camino → Guardianes → Mapa. Navegación con dots-indicator, back button y close.

2. **Pilares.** Las 20 MISIONES existentes se presentan como grid de tarjetas con imagen/gradiente. Tap activa/desactiva (fuente de verdad: `activeMissions`). Tap en pilar activo abre time picker inline. `ST.pilares` almacena `{ time, reminderOn, reminderDays }` por misión.

3. **Goal.** Campo de texto libre para un objetivo de largo plazo sin XP. Se guarda en `ST.goal = { text, desc, createdAt }`.

4. **Camino (reemplaza Propósitos).** `ST.camino` reemplaza `ST.propositos`. IDs en `ST.mis` migrados de `pu_` → `ca_`. Mini-form inline para añadir pasos con nombre, hora y frecuencia.

5. **Guardianes.** Nuevo tipo de misión evitativa con 6 predefinidos (`GUARDIANES_DEFAULT` en `data.js`) + opción de añadir personalizados. Selección en grid. En la vista diaria aparecen como fila con botones ✓ (ok) / ✕ (fell). Racha calculada por `guardianStreak()`.

6. **Mapa del sistema.** Vista CSS-only con 4 nodos conectados (Pilares → Goal → Camino → Guardianes). Botón ✏ en cada nodo navega directo al paso de edición.

7. **Time blocks en vista de misiones.** Tab "todos" agrupa misiones por hora: 🌅 Mañana (5-12h) / ☀️ Tarde (12-18h) / 🌙 Noche (18-24h) / 🌑 Guardianes. Misiones sin hora asignada van a Mañana por defecto.

8. **Migración v10 → v11.** `StateMigration.migrate()` convierte: reminders → pilares, propositos → camino (remap pu_ → ca_ en ST.mis de todo el historial).

9. **Eliminaciones.** Removidos del HTML: `m-optional-panel`, `m-add-prop-btn`, `#propositoModal`.

---

## 2026-07-13 — sprint 5.3 Ajustes: Logo · Topbar fijo · Penalizaciones · Menú · Tarjetas Modo

**Versión:** v6.0 Alpha — STATE_VERSION 10 (sin cambio de esquema)
**Archivos:** `css/topbar.css`, `css/layout.css`, `css/settings.css`, `css/gamemodes.css`, `js/logic.js`, `js/app.js`, `js/events.js`, `index.html`
**Tipo:** Correcciones y mejoras visuales post-prueba

### 7 cambios implementados

1. **Logo más grande.** `.logo-img` height aumentado de 32px a 44px para mayor protagonismo en el header.

2. **Topbar fija (position: fixed).** Cambiado de `sticky` a `fixed` con `left:0; right:0; width:100%` para comportamiento garantizado en iOS Safari. `padding-top` del `.content` ajustado a 78px para compensar.

3. **Sistema de penalizaciones robusto.** Tres mejoras: (a) Fix pool agotado — si `lastIds` deja el pool con menos tareas que las necesarias, se resetea automáticamente y se usa el pool completo. (b) `bootSystem()` ya no retorna early si `#bootScreen` no existe — ahora evalúa penalty/onboarding igual. (c) Listener `visibilitychange` — detecta cambio de día cuando la app queda en segundo plano y genera penalty en ese momento. Añadido botón "Simular penalización (debug)" en Settings → Datos.

4. **Eliminado tab Menú.** El tab "Menú" removido del bottom-nav y el bloque `#sec-menu` eliminado del HTML. Los Alter Egos siguen accesibles desde el tab Progreso (botón → overlay `#alterOverlay`). El botón Reset movido a Settings.

5. **Reset en Configuración.** Nueva sección "Zona de Peligro" al final de Settings con botón rojo de reset. `showReset()` ahora cierra Settings antes de mostrar el modal.

6. **Tarjetas de modo rediseñadas.** Altura mínima aumentada a 200px. Gradiente rediseñado (bottom-to-top cinemático). `.mode-card-body` ahora posicionado absolutamente al fondo de la tarjeta. Añadidas estrellas de dificultad (Normal ★★, Guerrero ★★★★, Monje ★★★★★). Meta chips con fondo glass. Colores de selección por modo (verde/rojo/índigo en lugar de cyan genérico).

7. **Dirección visual Genshin Impact documentada.** Las pantallas deben sentirse como videojuego AAA móvil: gradientes suaves, imágenes full-bleed, glass morphism, buen espacio negativo. Guía registrada para futuros sprints.

---

## 2026-07-12 — sprint 5.2 Settings · Onboarding · Modos de Juego · Penalizaciones

**Versión:** v6.0 Alpha — STATE_VERSION 9 → **10**
**Archivos:** `js/config.js`, `js/state.js`, `js/logic.js`, `js/utils.js`, `js/app.js`, `js/events.js`, `js/render.js`, `index.html`, `css/settings.css` (nuevo), `css/gamemodes.css` (nuevo), `css/penalty.css` (nuevo), `css/style.css`
**Tipo:** Feature mayor — sistema de modos de juego, configuración premium, penalizaciones

### 5 cambios implementados

1. **Onboarding "Elige tu Camino".** Primera vez que el usuario abre la app (o tras un reset), aparece una pantalla full-screen con las 3 tarjetas de modo usando las imágenes de `assets/design-system/camino/`. Se muestra después del boot screen (2.5s + 0.8s fade). `ST.onboardingDone: false` → `true` al confirmar. En sesiones subsiguientes no vuelve a aparecer.

2. **3 Modos de Juego (Normal/Guerrero/Monje).** Sistema configurado en `CONFIG.GAME_MODES` con propiedades: `misionesMin`, `xpMult`, `coinsEnabled`, `penaltyCount`. Afecta: (a) XP ganado por misión (×1.0/×1.5/×2.0); (b) coins — Monje no gana coins; (c) umbral de día verde para racha y X/90 (3/6/10 misiones). `applyMissionToggle()`, `applyDayCompletion()` y `calcDias90()` actualizados para leer el modo activo desde `ST.gameMode`.

3. **Panel de Configuración.** Accessible desde el botón engranaje del topbar. Seis secciones: (1) Modo de Juego — tarjeta hero con imagen + nombre + tagline, tap abre selector; (2) Perfil — avatar circular + nombre/rango (stub); (3) Notificaciones — toggles (implementables via notificaciones web en sprint futuro); (4) Apariencia — toggles animations/sounds/vibration; (5) Datos — stubs exportar/importar; (6) Acerca de — versión + links placeholder. Usa `class="attrs-overlay"` (slide-up existente) con z-index:600.

4. **Sistema de penalizaciones (Guerrero y Monje).** `checkAndGeneratePenalty(prevDate)` en `logic.js` se llama en cada apertura de la app con la fecha de la visita anterior. Si el modo tiene `penaltyCount > 0` y el día anterior tuvo menos misiones que `misionesMin`, genera una penalización aleatoria en `ST.penalty`. Las tareas se seleccionan del pool `CONFIG.PENALIZACIONES` (12 entradas), sin repetir las 2 últimas IDs. Guerrero: 1 tarea. Monje: 2 tareas. La pantalla de penalización aparece después del boot screen (si no hay onboarding pendiente). El usuario debe marcar todas las tareas como completadas antes de acceder a la app.

5. **Avatar de penalización.** Cuando `ST.penalty.pending === true`, `renderAvatar()` usa `assets/Avatar_Rango_E_Penalizacion.png` en lugar del avatar de rango actual. Al completar la penalización (`completePenalty()`) se llama `renderAll()` que restaura el avatar neutro.

---

## 2026-07-12 — sprint 5.1 Refinamiento Premium: Misiones

**Versión:** v6.0 Alpha — STATE_VERSION 9 (sin cambio)
**Archivos:** `index.html`, `css/topbar.css`, `css/missions.css`, `js/render.js`, `js/events.js`
**Tipo:** Refinamiento visual premium

### 6 cambios implementados

1. **Logo oficial.** Reemplazado `solo_icon.png` por el logo definitivo (`assets/design-system/logo/final/definitivo/logo final.png`) que contiene símbolo + texto "Presence". Aplicado en topbar y boot screen. Eliminado el texto `.boot-brand` HTML (ya no necesario, el logo lo incluye). Eliminado el filtro CSS piedra-tallada de `.logo-img` y `.boot-logo-img` — el logo oficial está diseñado para fondos oscuros. Topbar: `height: 32px`; boot screen: `width: 180px`.

2. **Header misiones limpio.** Eliminados: ícono flotante central (`.missions-logo-row`) y mini-calendario de 7 días (`#mMiniWeek`). Eliminada llamada a `renderMiniWeek()` en `render.js`. Eliminado CSS de `.m-mini-week`, `.mw-day`, `.mw-lbl`, `.mw-dot`, `.mw-num`, `.mw-today` de `missions.css`. Eliminado CSS de `.missions-logo-row` de `topbar.css`.

3. **X/90 maestría premium + barra de progreso.** El counter X/90 fue elevado a un componente de maestría: número grande (`32px/900`) con separador `/` y máximo `90` alineados en baseline, etiqueta `DÍAS ACTIVOS` en letra tracking de 2px, y una barra de progreso cyan (`3px`) que muestra visualmente el avance de 0% a 100% de los 90 días. `render.js` ahora actualiza también `#mDias90Bar` (via `style.width`) en cada `renderMisiones()`.

4. **Botón Rutina.** El botón `+` fue movido de los tabs al header, a la derecha del indicador X/90. Nueva clase `.m-rutina-btn` (círculo de 46px, glassmorphism cyan, glow sutil, `scale(0.91)` al tap). Semánticamente nombrado "Rutina" por ser el punto de entrada futuro a la gestión de rutinas. Llamada: `openAddMision()` (stub existente).

5. **Tabs pill glassmorphism.** Rediseño completo de `.m-tab`: era un tab underline plano → ahora pill con `border-radius: 20px`, `background: rgba(255,255,255,.04)`, borde sutil, transición en background/border/color (`200ms`), `scale(0.96)` al presionar. Tab activo: fondo cyan semitransparente, borde cyan. Badge de conteo alineado con `vertical-align: middle`. Eliminado el `border-bottom` del contenedor `.m-tabs`.

6. **Calendario mensual real por misión.** Reemplazada la cuadrícula de 30 puntos sin números (10 columnas) por un calendario del mes actual con: fila de iniciales de días `L M X J V S D`, 7 columnas, celdas con número del día visible (`font-size: 9px`), offset de celdas vacías para alinear el primer día al día de semana correcto (lunes = columna 0). Colores: verde semitransparente `rgba(57,255,20,.20)` para días hechos, rojo semitransparente `rgba(255,45,85,.18)` para saltados, gris oscuro `rgba(255,255,255,.06)` para vacíos. Día de hoy: outline cyan 1.5px. Estadísticas: efectividad calculada sobre días del mes (no 30 días fijos). `buildMisionCard()` incluye ahora el nombre del mes y la fila de iniciales. `_renderMisionDetail()` reescrita para lógica de mes actual con `startOffset = (firstDay.getDay() + 6) % 7`.

---

## 2026-07-12 — sprint 5.0 Visual Overhaul: Pantalla Misiones

**Versión:** v6.0 Alpha — STATE_VERSION 9 (sin cambio)
**Archivos:** `index.html`, `css/topbar.css`, `css/missions.css`, `css/animations.css`, `js/render.js`, `js/events.js`, `js/logic.js`
**Tipo:** Rediseño visual mayor + nuevas funcionalidades UX

### 7 cambios implementados

1. **Logo: piedra tallada visible.** El filtro anterior (`brightness(0.75)`) oscurecía el icono negro hasta hacerlo invisible sobre fondo oscuro. Nuevo filtro: `invert(0.88) brightness(0.62) contrast(1.4) sepia(0.15)` + dos `drop-shadow` opuestos (luz desde arriba, sombra abajo) que simulan relieve hundido en piedra mate. Boot screen cambia de `logo.png` a `solo_icon.png` con texto "PRESENCE" como elemento HTML (independiente de la imagen para evitar texto en idioma incorrecto). Nueva clase `.boot-brand`.

2. **Topbar HUD: XP + Coins + Settings.** El indicador ONLINE (`.system-status` + `.status-dot` con animación parpadeante) fue reemplazado por dos chips minimalistas (`#hudXP`, `#hudCoins`) y un botón engranaje (`openSettings()`). Nueva función `renderHUD()` en `render.js`, llamada desde `renderAll()` y `renderMisiones()`. Los chips se actualizan en tiempo real al completar misiones. `openSettings()` y `openAddMision()` son stubs — funcionalidad en sprint futuro.

3. **Header misiones: X/90 premium.** Se eliminó el elemento `#mDate` (fecha del día) del header de misiones. El contador X/90 se rediseñó con tipografía grande (`font-size: 28px; font-weight: 900`) dentro de un pill con borde cyan tenue. La estructura HTML cambió a `<span class="days90-num">` + `<span class="days90-lbl">` para separar número de etiqueta. `renderMisiones()` actualiza solo `.days90-num` en lugar de reemplazar todo el texto.

4. **Botón (+) junto a tabs / espaciado de cards.** Añadido `button.m-add-mission-btn` al final de `.m-tabs` para añadir misiones personalizadas (funcionalidad pendiente). Espaciado de tarjetas: `.mc-wrap { margin: 6px 0 → 10px 0 }` para más respiración visual.

5. **Eliminación de 3 collapsibles.** Removidos del HTML y del ciclo de render:
   - **Calendario global:** HTML eliminado (≈55 líneas). `renderCalendario()` ya no se llama en `renderAll()`. Los elementos `#cRacha`, `#cGrid`, etc. no existen → las funciones del calendario son silent-miss.
   - **Zona Oscura:** HTML eliminado (≈30 líneas). `renderZona()` eliminado de `render.js`. `toggleZona()` eliminado de `events.js`. `toggleZonaFall()` eliminado de `logic.js`. El campo `zona: {}` permanece en `DEFAULT_STATE` (campo huérfano, no requiere migration ni VERSION bump).
   - **Ruta de Propósito:** HTML eliminado (≈18 líneas). `renderRuta()` ya no se llama. `openPropositoForm()` y el modal `#propositoModal` se conservan intactos (la funcionalidad de crear propósitos sigue activa).

6. **Calendario expandible por misión.** Cada tarjeta de misión ahora tiene:
   - Estructura `.mc-card-face` (nuevo wrapper para el frente de la tarjeta) con el botón chevron como sibling de `.mc-front` (evita el `overflow: hidden` del frente). Panel `.mc-detail` como sibling de `.mc-card-face`, expande con `max-height` transition.
   - Contenido del panel: mini-calendario de 30 puntos de colores (verde=hecho, rojo-rosado=saltado, gris=sin datos), 3 estadísticas (efectividad %, racha actual, total completadas en 90d), configuración de recordatorio (toggle ON/OFF, selector de hora, pills de días de semana L-M-X-J-V-S-D).
   - Estado de recordatorios guardado en `ST.reminders` (accedido como `ST.reminders || {}` → defensivo, sin VERSION bump). Funciones nuevas en `events.js`: `toggleMisionDetail`, `_renderMisionDetail`, `_renderDayPills`, `toggleDay`, `toggleReminder`, `saveReminder`.
   - **Nota:** Las notificaciones push reales requieren PWA (sprint futuro). El sistema ya guarda la preferencia en localStorage.

7. **Animación XP flotante.** Al completar una misión con swipe derecha, aparece un elemento `div.xp-float` centrado en pantalla (posición fija) que muestra "+N XP" en cyan y flota hacia arriba desapareciendo en 650ms. CSS en `animations.css`. El elemento se crea en `attachSwipeHandlers` y se auto-elimina tras la animación.

---

## 2026-07-09 — sprint 4.4 Post-prueba en celular #4

**Versión:** v5.4 Alpha — STATE_VERSION 9 (sin cambio)
**Archivos:** `index.html`, `css/statsoverlay.css`, `css/topbar.css`, `css/base.css`, `js/render.js`, `assets/design-system/logo/final/logo.png` (nuevo), `assets/design-system/logo/final/solo_icon.png` (nuevo), `assets/design-system/logo/logo.png` (eliminado)
**Tipo:** Fixes UX + rediseño visual basados en prueba real en dispositivo móvil

### 3 cambios implementados

1. **Botón Rango compacto + columna derecha reorganizada:** El `div.av-rank-overlay` (posición absoluta top-left, mostraba badge + "RANGO" + letra siempre visibles) fue reemplazado por `button.av-rank-btn` — compacto 44×44px, columna derecha del avatar. Posición de los 3 botones (de arriba a abajo): Rango (`top:calc(50%-134px)`) → Tienda (`top:calc(50%-78px)`, antes `-60px`) → Trofeo (centro). Espaciado de 12px entre cada uno. Eliminados `avRankLetter` del DOM y su actualización en `render.js`. CSS obsoleto del overlay antiguo (`.av-rank-overlay`, `.av-rank-info`, `.av-rank-lbl`, `.av-rank-letter-ext`, `.av-rank-name`, `.av-rank-desc`) reemplazado por `.av-rank-btn`.

2. **Swipe de misiones sin deformación de pantalla:** Al hacer `translateX(420px)` para la animación de salida de tarjetas, el viewport de iOS Safari se expandía momentáneamente creando el efecto "se aleja". Causa: `body` tenía `overflow-x: hidden` pero `html` no — en iOS Safari el elemento `html` controla el scroll del viewport, no `body`. Fix: añadido `html { overflow-x: hidden }` en `css/base.css`.

3. **Logo rediseñado — estilo piedra + nuevos assets:** Reemplazada la animación `logoGlow` (resplandor de neón en color de rango) por un efecto de relieve hundido estático: `brightness(0.75) contrast(1.1) drop-shadow(1px 1px 0 rgba(255,255,255,.10)) drop-shadow(-1px -1px 2px rgba(0,0,0,.85))`. Eliminados `mix-blend-mode: screen`, `--rank-color` CSS var y su actualización JS desde `renderStats()`. Tres puntos de uso: topbar (`solo_icon.png`), boot screen (`logo.png`), home de misiones (nuevo `.missions-logo-row` con `solo_icon.png`). Assets en `assets/design-system/logo/final/`.

---

## 2026-07-08 — sprint 4.3 Post-prueba en celular #3

**Versión:** v5.3 Alpha — STATE_VERSION 9 (sin cambio)
**Archivos:** `js/utils.js`, `js/render.js`, `js/events.js`, `js/data.js`, `css/topbar.css`, `css/missions.css`, `css/statsoverlay.css`, `index.html`, `assets/Avatar_Rango_E_*.png`
**Tipo:** Bug fix + mejoras visuales y UX basadas en prueba real en dispositivo móvil

### 7 cambios implementados

1. **Bug X/90 días:** `calcDias90()` filtraba `v === true` (booleano) cuando el estado se almacena como `'done'` (string). El contador siempre retornaba 0. Corregido: `v === 'done'`. Nueva función auxiliar `misionStreak(id)` añadida a `utils.js` para racha individual por misión.
2. **Aura pulsante en logo Presence:** Animación `logoGlow` añadida a `.logo-img` (topbar) y `.boot-logo-img` (pantalla de arranque). El color del aura (`--rank-color` custom property) se actualiza al color del rango actual en `renderStats()` vía `querySelectorAll`.
3. **Tab "Stats" → "Progreso":** Solo el label en la barra inferior. IDs de DOM, funciones internas y CSS sin cambio.
4. **Categorías colapsables en overlay Atributos:** Cada `ao-cat-block` es clicable con `onclick="toggleCatBlock(this)"`. Atributos envueltos en `.ao-cat-body` (oculto por defecto). Chevron con `transform: rotate(180deg)` en `.ao-cat-block.open`. `toggleCatBlock(blk)` en `events.js`.
5. **Tienda movida a Progreso:** Botón `.av-shop-btn` (ícono moneda, encima del trofeo) en el tab Progreso. Overlay `#tiendaOverlay` con estructura idéntica a los demás overlays. `renderTiendaOverlay()` en `render.js`. `openTiendaOverlay()` / `closeTiendaOverlay()` en `events.js`. Tienda eliminada del tab Menú. `renderMenu()` ya no llama a `renderTienda()`.
6. **Badges en tarjetas de misión:** Racha individual (`misionStreak(id)`, solo si >0), frecuencia (`m.freq`) y dificultad (`m.dif`, barras 1–5). Nuevos campos `freq` y `dif` en los 20 objetos de `MISIONES`. Tipografía: `.mc-name` 12px→15px, `.mc-desc` 9px→10px. Altura: `.mc-wrap` 140px→170px.
7. **Imágenes de fondo en tarjetas m01–m10:** Campo `img` en misiones m01–m10. `.mc-bg` usa `background-image: url(...)` con `cover`/`center top`. `data-has-img` en el wrapper activa overlay oscuro más pronunciado (`.mc-wrap[data-has-img] .mc-front::after`) para legibilidad. m11–m20 y propósitos conservan gradiente de color.

### Assets
- **Añadidas (nuevas):** `Avatar_Rango_E_meditacion.png`, `Avatar_Rango_E_oracion_y_gratitud.png`, `Avatar_Rango_E_levantar_pesas.png`, `Avatar_Rango_E_hidratacion.png`, `Avatar_Rango_E_nutricion.png`, `Avatar_Rango_E_Dormir_7_o_8_H.png`, `Avatar_Rango_E_Afirmaciones.png`, `Avatar_Rango_E_lectura.png`, `Avatar_Rango_E_journal.png`.
- **Reemplazada:** `Avatar_Rango_E_correr.png` (nueva versión de mayor calidad).
- **Eliminadas (obsoletas):** `Avatar_Rango_E_descanso.png`, `Avatar_Rango_E_flexiones.png`, `Avatar_Rango_E_meditar.png`, `avatar.png`.

---

## 2026-07-06 — sprint 4.2 Correcciones post-prueba #2

**Versión:** v5.2 Alpha — STATE_VERSION 9
**Archivos:** `js/events.js`, `js/render.js`, `js/data.js`, `js/state.js`, `js/config.js`, `css/missions.css`, `css/statsoverlay.css`
**Tipo:** Fixes UX basados en prueba real en dispositivo móvil

### 4 fixes implementados

1. **Sin rotación en swipe:** Eliminado `rotate(...)` del transform de todas las líneas en `attachSwipeHandlers`. La tarjeta se mueve solo con `translateX`, sin deformación ni solapamiento visual al devolver sin soltar.
2. **Hechos/Saltados: tap → confirmar devolver:** En tabs `done`/`skip` se desactiva el swipe y se activa un tap handler. Tap sobre tarjeta muestra overlay in-card con botones "Devolver" y "✕". `devolverMision(id)`: si era 'done' revierte XP y atributos con `applyMissionToggle`; si era 'skip' borra el estado. `cerrarConfirm(event)` cierra el overlay. CSS `.mc-confirm-ov` con `.mc-front.show-confirm` toggle.
3. **Radar escala absoluta:** `buildRadarSVG` cambia de normalización relativa (max=100%) a absoluta. `TARGET=15` significa full=75 completions por attr (~75 días intensos por categoría). `radarValues[i] = min(catValues[i] / (cat.attrs.length * TARGET), 1)`. El radar ya no se llena con un solo día de misiones.
4. **Atributo `empatia` en Vínculo:** Vínculo sube de 2 a 3 atributos (`confianza`, `conexion`, `empatia`). Añadido a `ATTR_META` (color `#ff77aa`), `CATEGORIES`, `DEFAULT_STATE.stats`. Migration v8→v9 añade `empatia: 0` a estados existentes. `STATE_VERSION: 9`.
5. **Badge de rango más pequeño:** `.av-rank-badge` 42px→32px, `.av-rank-overlay` padding 10px 14px→7px 10px, `.av-rank-letter-ext` 22px→17px, `.av-rank-lbl` 8px→7px.

---

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
