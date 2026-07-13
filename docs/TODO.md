# TODO

Lista priorizada de tareas pendientes. Basada en el informe de reconocimiento del proyecto (2026-06-28) y en la bitácora de la sesión anterior (v3.0).

## Alta prioridad

- [x] Redactar documentación obligatoria (MASTER_PROJECT, README, CHANGELOG, TODO, DECISION_LOG).
- [x] Dividir `js/app.js` en módulos por responsabilidad (`config`, `state`, `utils`, `logic`, `render`, `events`) — ver DECISION_LOG.
- [x] Separar lógica de negocio de las funciones que tocan el DOM (parte del punto anterior).
- [x] Refactorización sistema de rangos fase 1: eliminar Rango Técnico, estrellas, recompensas; 6 nuevos rangos con íconos SVG; acordeón en Inicio (sprint 2.9 + 2.9b).
- [x] Avatar animado en pantalla de inicio: wallpaper estilo Solo Leveling con flotación, aura pulsante y partículas; glow dinámico por rango (sprint 2.10).
- [x] **Sprint 3.0 — Arquitectura Mobile First:** nombre → Presence; bottom nav 5 tabs; Misiones como home con X/90 contador y 3 collapsibles; Stats con avatar placeholder; Comunidad/Tools placeholders; Menú con Tienda + Alter Egos + Títulos.
- [x] **Sprint 3.1/3.2 — Stats rediseño:** avatar full-screen estático, badge rango con letra (E/D/C/B/A/S), X/90 top-right, trofeo SVG middle-right, overlay rango semitransparente, Alter Egos con 5 siluetas SVG (Leónidas/Kenshin/Baldwinus/Magnus/Ananda, desbloqueo nivel 100 + Rango S), logo `trasparente.png`.
- [x] **Sprint 4.0 — Refactorización mayor Misiones + Stats + Atributos:**
  - Atributos renombrados: `energia→vitalidad`, `conocimiento→intelecto`, `espiritualidad→conexion`.
  - 5 categorías: ⚔ Cuerpo / 🧠 Mente / 🧘 Presencia / 🎯 Enfoque / 🤝 Vínculo.
  - 20 misiones fijas (m01–m10 default, m11–m20 opcionales con botón +).
  - Sistema Propósito: array de misiones personalizadas con modal CRUD.
  - Tarjetas swipe (swipe→ Hecho/Saltar, swipe← info XP/cats) + 3 tabs (To-dos/Hecho/Saltar).
  - Radar pentagonal 5 ejes + barras luminosas 5-segmentos en overlay Atributos.
  - STATE_VERSION 7→8 con migración automática.
- [x] **Sprint 4.1 — Fixes post-prueba en celular:** logo más grande, tabs renombrados (Hechos/Saltados), mini calendario semanal, swipe Tinder con overlays verde/rojo, tipografía misiones uppercase medium, tarjetas full-bleed más cortas, iconos Tabler en lugar de emojis, badge de rango rediseñado (SVG + RANGO + letra en color).
- [x] **Sprint 4.2 — Correcciones post-prueba #2:** sin rotación en swipe (no deformación), Hechos/Saltados tap→confirmar devolver, radar escala absoluta (TARGET=15), `empatia` añadido a Vínculo (STATE_VERSION 9), badge de rango más pequeño.
- [x] **Sprint 4.3 — Post-prueba en celular #3:** bug X/90 días corregido (`=== true` → `=== 'done'`), logo con aura pulsante color-rango, tab Stats → Progreso, categorías de atributos colapsables, Tienda movida a overlay en Progreso, badges racha/freq/dif en misiones + títulos más grandes, imágenes de fondo en tarjetas m01–m10.
- [x] **Sprint 4.4 — Post-prueba en celular #4:** botón Rango compacto 44×44px (columna derecha encima de Tienda, sin texto siempre visible), swipe de misiones sin deformación viewport (`html { overflow-x: hidden }`), logo rediseñado con efecto piedra tallada estático (sin neón, sin animación), nuevos assets en `final/`, logo añadido en home de misiones.
- [x] **Sprint 5.0 — Visual Overhaul Misiones:** logo piedra visible (filtro `invert+sepia`), topbar HUD (XP+coins+settings), header misiones limpio (sin fecha, X/90 premium pill), botón (+) en tabs, eliminación de 3 collapsibles (Calendario, Zona Oscura, Ruta de Propósito), calendario expandible por misión con historial 30d + stats + recordatorio, animación XP flotante al completar.
- [x] **Sprint 5.1 — Refinamiento Premium Misiones:** logo definitivo (`logo final.png`) sin filtros; eliminado ícono flotante y mini-semana; X/90 con barra de progreso cyan animada; botón Rutina (46px circle glass) en header; tabs pill glassmorphism; calendario mensual real por misión (números de día, iniciales L/M/X/J/V/S/D, alineación por día de semana).
- [x] **Sprint 5.2 — Settings + Modos de Juego + Penalizaciones:** STATE_VERSION 10; onboarding "Elige tu Camino" (3 tarjetas imágenes modo normal/guerrero/monje); 3 modos (Normal 3mis/×1.0, Guerrero 6mis/×1.5, Monje 10mis/×2.0/sin coins); panel Configuración 6 secciones slide-up premium; sistema penalizaciones automático (Guerrero: 1 tarea, Monje: 2 tareas); avatar penalización cuando hay una pendiente.
- [x] **Sprint 5.3 — Ajustes generales:** logo topbar 44px; topbar `position:fixed`; fix penalizaciones (pool agotado, visibilitychange, bootSystem fallback, botón debug); eliminado tab Menú (Reset → Settings Zona de Peligro); tarjetas modo rediseñadas (200px, gradiente cinemático, estrellas dificultad, colores por modo); dirección visual Genshin Impact documentada.
- [ ] **Imágenes para tarjetas m11–m20:** las misiones opcionales aún usan gradiente de color. Añadir imágenes cuando estén disponibles.
- [ ] **Avatares de progresión:** generar y asignar imágenes distintas para cada uno de los 6 rangos. Propiedad `avatar` ya preparada en `RANGOS`.
- [ ] **Sistema de rangos fase 2:** definir lógica de avance de rango (cómo y cuándo sube `ST.rank`). Pendiente de diseño y aprobación antes de implementar.
- [ ] **Ruta de Propósito:** conectar `ST.propositos[]` al módulo de roadmap (Ruta de Propósito collapsible). Preparar estructura de hitos/progreso visual.

## Media prioridad

- [x] Dividir `css/modules.css` (182 líneas, 8 features sin relación) en archivos por feature: `missions.css`, `ranks.css`, `calendar.css`, `darkzone.css`, `route.css`, `shop.css`, `alteregos.css`, `reset.css`. Ver DECISION_LOG.
- [x] Eliminar estilos inline duplicados en `index.html` (los 5 orbes de stats y el `margin-bottom` redundante de la tienda). Ver DECISION_LOG.
- [ ] **Reconsiderado, no implementado:** centralizar el mapeo de IDs del DOM usados por `el()`/`setText()`/`setStyle()`. Tras evaluarlo (regla YAGNI/KISS del proyecto: "¿Es realmente necesaria? ¿Puede simplificarse?"), no se justifica todavía: `el()` ya centraliza el acceso y avisa por consola si un id no existe, los renames de id son poco frecuentes en este tamaño de proyecto, y un mapa de constantes añadiría una capa de indirección en ~30 sitios sin reducir riesgo real. Queda en espera de decisión del usuario — si se prefiere implementarlo igual, hacerlo.

## Media prioridad (reciente)

- [x] **BRAND_IDENTITY.md creado** — documento de identidad visual de marca (paleta, tipografía, estilo, assets).
- [x] **instrucciones_claude.md actualizado** — stack técnico real, flujo de Git, eliminadas referencias obsoletas (Stacks, Enemigos, NPC, Inventario), UX subida a prioridad 5, estructura de carpetas corregida.

## Baja prioridad / futuro

- [ ] Migrar a ES Modules (`type="module"`, `import`/`export`) para habilitar bundling y tests automatizados — requiere servir la app vía HTTP (no `file://`); evaluar antes de aplicar.
- [ ] Añadir tests de regresión (manuales documentados primero; automatizados con Vitest/Jest después).
- [ ] Convertir a PWA: `manifest.json` + `service-worker.js`, soporte offline, instalable en pantalla de inicio.
- [ ] Backend / API REST / base de datos / sincronización en la nube / sistema de usuarios (no implementar antes de tiempo, pero la arquitectura debe permitirlo).
- [ ] Definir contenido y uso de la carpeta `assets/` (actualmente vacía).

## Bugs / hallazgos menores detectados

- [x] Doble llamada a `saveState()` dentro del flujo `toggleMision` → `checkDayComplete`. Corregido durante el refactor: `applyDayCompletion()` (en `logic.js`) ya no persiste por sí mismo; `toggleMision()` (en `events.js`) guarda una sola vez al final.
- [x] `buildSecretCard()` — ya no aplica. La Misión Secreta Semanal fue eliminada completamente en el sprint 2.6. El bug desapareció junto con la feature.
- [x] Misiones no se reseteaban al día siguiente (sprint 2.7). Causa dual: (1) `DateUtils.today()` usaba `toISOString()` (UTC) en lugar de fecha local; (2) colisión de IDs de misión entre sprints. Ambos corregidos.
- [x] Atributos stats de misiones no se sumaban correctamente. Causa: `applyMissionToggle` recibía un string en lugar de array. Corregido al pasar `statsStr.split(',')` en `events.js`.
- [x] `calcDias90()` siempre retornaba 0 (sprint 4.3). Causa: filtro `v === true` cuando el estado se almacena como el string `'done'`. Corregido a `v === 'done'`.
