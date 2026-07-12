# DECISION LOG

Registro de decisiones técnicas importantes: problema, alternativas consideradas, solución elegida y motivos.

---

## 2026-07-12 — Sprint 5.0: HUD topbar, collapsibles eliminados, calendario por misión, logo visible

**Decisión 1 — Logo visible: `invert()` vs. cambiar el asset.**

El `solo_icon.png` es negro sobre fondo transparente. Con `brightness(0.75)` (sprint 4.4) el logo quedaba invisible sobre el fondo oscuro `#05050f`.

**Alternativas consideradas:**
1. **Crear un asset nuevo con el icono en blanco.** Requiere edición de imagen externa; la app no debe depender de ediciones externas para cambiar el tema.
2. **`mix-blend-mode: screen`** (revertir sprint 4.4). Devolvería el glow de neón que el usuario quería eliminar.
3. **Filtro CSS `invert(0.88) brightness(0.62) contrast(1.4) sepia(0.15)` + drop-shadows opuestos.** **Elegida.** Convierte el negro en gris-piedra claro sin cambiar el asset, añade el efecto de relieve tallado y es ajustable sin tocar archivos de imagen.

---

**Decisión 2 — Topbar HUD vs. mantener ONLINE indicator.**

El punto parpadeante ONLINE no aportaba información real (la app funciona offline). El espacio era mejor aprovechado con XP y Coins, los recursos primarios del juego.

**Alternativas consideradas:**
1. **Eliminar solo el dot, mantener texto ONLINE.** Sin valor informativo; ocupa espacio.
2. **XP + Coins en la topbar como texto plano.** Sin identidad visual RPG.
3. **Chips pill con icono Tabler.** **Elegida.** Consistente con el estilo glassmorphism de la app. `renderHUD()` centraliza las actualizaciones y se llama en `renderAll()` + `renderMisiones()` (único punto donde coins/XP cambian).

---

**Decisión 3 — Eliminar Zona Oscura: ¿mantener `zona: {}` en DEFAULT_STATE?**

Eliminar `zona` de `DEFAULT_STATE` requeriría bumpar `STATE_VERSION` y añadir una migración que no hace nada útil (borrar un campo que ninguna función lee). Los usuarios con localStorage existente seguirán teniendo `ST.zona` porque `deepMerge` copia el estado guardado, pero ningún código lo usa.

**Solución:** Dejar `zona: {}` en `DEFAULT_STATE` como campo huérfano. No hay `VERSION` bump. Las funciones `renderZona`, `toggleZona`, `toggleZonaFall` están completamente eliminadas.

---

**Decisión 4 — Estructura `.mc-card-face` para el botón chevron.**

El botón chevron no puede vivir dentro de `.mc-front` porque `.mc-front` tiene `overflow: hidden` — el botón sería recortado en los bordes de la tarjeta.

**Alternativas consideradas:**
1. **Botón absoluto dentro de `.mc-wrap`.** `.mc-front` también es absoluto con `inset: 0` y Z-index superior, cubriría el botón.
2. **Botón como sibling de `.mc-front` dentro de `.mc-card-face` (nuevo wrapper).**  **Elegida.** `.mc-card-face` es `position: relative; height: 170px`, contiene `.mc-front` (absolute, inset: 0) y `.mc-expand-btn` (absolute, z-index: 5 > mc-front). El botón no está recortado porque vive en el mismo nivel del DOM que el frente, fuera de su `overflow: hidden`. `wrap.querySelector('.mc-front')` en `attachSwipeHandlers` sigue encontrando el frente correctamente.

---

**Decisión 5 — Recordatorios: `ST.reminders` sin VERSION bump.**

Añadir `reminders: {}` a `DEFAULT_STATE` requeriría `STATE_VERSION 9 → 10` con migración trivial (`ST.reminders = {}`). Dado que `_renderMisionDetail` accede siempre como `ST.reminders || {}` de forma defensiva, el campo puede no existir en usuarios con estado antiguo sin causar errores. Las funciones `toggleReminder`/`saveReminder` inicializan `ST.reminders` en el primer uso con `if (!ST.reminders) ST.reminders = {}`.

**Solución:** No bumpar VERSION. El campo se auto-crea cuando el usuario usa un recordatorio por primera vez. `saveState()` lo persiste desde ese momento.

---

## 2026-07-09 — Sprint 4.4: Botón rango compacto, swipe sin deformación, logo piedra

**Decisión 1 — Botón Rango: compacto en columna derecha vs. overlay con texto siempre visible.**

El `.av-rank-overlay` (div clicable, top-left del avatar, 3 elementos: badge SVG + "RANGO" label + letra con color del rango) consumía mucho espacio visual y estaba en la esquina opuesta a los demás controles flotantes (Tienda, Trofeo), fragmentando la UI.

**Alternativas consideradas:**
1. **Mantener en top-left pero colapsar con toggle:** Añade estado extra (expandido/colapsado) y un tap antes de llegar al overlay de info completa. Dos fuentes de verdad para el mismo dato.
2. **Mover a top-right con texto visible.** Chocaría con el contador X/90 que está ahí.
3. **Compacto 44×44px en la columna de botones derecha, sin texto externo, mismo onclick que antes.** **Elegida.**

**Solución:** `button.av-rank-btn` con solo el `.av-rank-badge` (SVG del rango) dentro. El badge ya contiene visualmente el símbolo y el color del rango — la letra "RANGO" y el text-label externos eran redundantes. Tap sigue abriendo el mismo `rangoOverlay` completo.

---

**Decisión 2 — Fix swipe: `html { overflow-x: hidden }` vs. cambiar la animación de salida.**

La animación `translateX(420px)` en el touchend causaba que el viewport de iOS Safari se expandiera brevemente, creando un efecto de "zoom out" o "pantalla que se aleja" incluso con `body { overflow-x: hidden }`.

**Causa raíz:** En iOS Safari, `body` NO es el scroll container del viewport. El elemento `html` lo es. Si solo `body` tiene `overflow-x: hidden`, el contenido desbordado puede provocar que el viewport se estire momentáneamente.

**Alternativas consideradas:**
1. **Cambiar la animación de salida a solo `opacity: 0`** (sin `translateX`). Elimina el overflow, pero pierde el feedback visual de la tarjeta "volando" fuera de pantalla.
2. **Añadir `overflow: hidden` al contenedor de misiones `#mListaMisiones` vía JS durante el swipe.** Funciona pero añade lógica de gestión de estado en eventos, frágil.
3. **Añadir `html { overflow-x: hidden }` en `base.css`.** **Elegida.** Una línea, no toca la animación, afecta el viewport real en iOS.

---

**Decisión 3 — Efecto de logo: relieve hundido estático vs. otras opciones.**

El usuario quería reemplazar el glow pulsante de neón (que cambiaba de color según el rango) por un efecto "rudimentario como piedra tallada, no luminoso".

**Alternativas consideradas:**
1. **Solo quitar la animación y dejar el filtro estático con `--rank-color`.** Sigue siendo un glow de neón, aunque estático. No cumple el requisito visual.
2. **`filter: grayscale(1) brightness(0.6)`.** Demasiado plano, pierde los detalles del logo.
3. **Dos `drop-shadow` opuestos (luz desde arriba-izquierda, sombra hacia abajo-derecha) + `brightness` reducido.** **Elegida.** Simula la física de luz de un bajo-relieve: el filo superior captura la luz, el filo inferior queda en sombra, la superficie es mate (`brightness < 1`).

**CSS resultante:**
```css
filter: brightness(0.75) contrast(1.1)
  drop-shadow(1px 1px 0px rgba(255,255,255,0.10))
  drop-shadow(-1px -1px 2px rgba(0,0,0,0.85));
```
Sin animación, sin `mix-blend-mode: screen`, sin `--rank-color`. Cero JS para el logo.

---

## 2026-07-08 — Sprint 4.3: Tienda en Progreso, categorías colapsables, badges de misión

**Decisión 1 — Mover Tienda de Menú a Progreso.**
La Tienda estaba en el tab Menú, lejos del contexto de progreso del usuario. El usuario quería verla cerca del avatar y los atributos.

**Alternativas consideradas:**
1. **Mantenerla en Menú con un enlace desde Progreso.** Añade navegación extra sin reducir fricción real.
2. **Tab propio "Tienda".** La app ya tiene 5 tabs; añadir uno rompería el balance.
3. **Overlay slide-up encima del botón Trofeo en Progreso.** **Elegida.**

**Solución:** Botón `.av-shop-btn` (ícono moneda) posicionado absoluto a `top: calc(50% - 60px)` encima del `.av-trophy-btn` (que usa `top: 50%`). Overlay `#tiendaOverlay` con la misma estructura `attrs-overlay` de los demás overlays (Atributos, Rangos, Alter Egos, Trofeos). `renderTiendaOverlay()` escribe a `#tiendaListOv` y `#tiendaCoinsOv`. `renderMenu()` ya no llama a `renderTienda()`. Los elementos `#shopList` y `#shopC` se eliminaron del HTML de Menú; `renderTienda()` queda en `render.js` como función inerte (no rompe nada, sus targets simplemente no existen).

---

**Decisión 2 — Categorías colapsables (cerradas por defecto) vs. abiertas por defecto.**

**Alternativas consideradas:**
1. **Abiertas por defecto:** el usuario ve todo de inmediato pero la lista es muy larga en una pantalla pequeña.
2. **Colapsadas por defecto:** requiere un tap extra para ver atributos, pero la vista general de 5 categorías con su puntaje es la lectura más útil a primera vista. **Elegida.**

**Solución:** `.ao-cat-body { display: none }` / `.ao-cat-block.open .ao-cat-body { display: block }`. El chevron rota 180° con `transition: transform .2s`. Sin animación de altura para mantener el código simple (no se necesita `max-height` porque el overlay ya tiene scroll).

---

**Decisión 3 — Dificultad como campo estático vs. dinámica.**
El usuario quiere que la dificultad (`m.dif`, 1–5) sea estática ahora y se vuelva dinámica en el futuro al subir de rango. Se implementa como campo de datos en `MISIONES` y se renderiza como barras decorativas. Sin lógica de escalado por rango todavía — pendiente de diseño en fase futura.

---

**Nota — Bug `calcDias90` corregido.**
La implementación original del decisión de sprint 3.0 (ver más abajo) tenía un error en el filtro: `v === true` cuando el valor real almacenado es `'done'` (string). Documentado en el CHANGELOG de sprint 4.3. La lógica de diseño sigue siendo la misma; solo el predicado era incorrecto.

---

## 2026-07-06 — Sprint 4.2: Radar absoluto, empatia, swipe sin rotación, devolver desde Hechos/Saltados

**Problema 1 — Radar se llenaba tras un solo día de misiones.**
La normalización relativa (`maxVal = max(radarValues)`) hacía que el eje con más progreso apareciera siempre al 100%. Con apenas 1 punto en cualquier categoría, ese eje se mostraba completo, dando una falsa impresión de maestría.

**Alternativas consideradas:**
1. **Escala logarítmica.** Difícil de intuir para el usuario: no sabe cuánto le falta.
2. **Escala relativa con suavizado (media entre valores).** Sigue siendo engañosa en fases tempranas.
3. **Escala absoluta con TARGET fijo.** **Elegida.**

**Solución:** `TARGET = 15` → full = 75 completions de misiones por atributo (≈75 días de trabajo intenso en una categoría). `radarValues[i] = min(catValues[i] / (cat.attrs.length * TARGET), 1)`. El radar empieza casi vacío y crece progresivamente a lo largo de semanas, reflejando el progreso real.

---

**Problema 2 — Vínculo siempre débil en el radar.**
Vínculo tenía 2 atributos (confianza, conexión) frente a los 3 de Cuerpo. Aunque la normalización per-attr lo compensaba parcialmente, el puntaje máximo posible de Vínculo era siempre inferior al de Cuerpo con el mismo esfuerzo diario.

**Solución:** Añadir `empatia` como 3er atributo de Vínculo. Las misiones existentes que otorgan XP a la categoría `vinculo` (ej. Socializar, Oración/Gratitud) automáticamente incrementan `empatia` en +1 por completado, sin cambiar las definiciones de misiones. STATE_VERSION 8→9 con migración automática.

---

**Problema 3 — Rotación del swipe deformaba la UI.**
El `rotate(deltaX * 0.04deg)` durante el arrastre hacía que la tarjeta girase visualmente sobre sus vecinas (el wrapper tiene `overflow: visible` para que la sombra no se corte). Al devolver la tarjeta sin soltar, la rotación se podía "pegar" visualmente a las tarjetas de arriba/abajo.

**Solución:** Eliminar el `rotate()` por completo. Usar solo `translateX`. La experiencia de swipe Tinder sigue siendo clara con el overlay de color sin necesitar inclinación.

---

**Problema 4 — No había forma de revertir una misión desde Hechos/Saltados.**
Los tabs Hechos y Saltados mostraban tarjetas con swipe activo, pero el usuario quería poder devolverlas a To-dos sin que eso afectase los XP/atributos acumulados históricamente (solo revertir el estado del día actual).

**Alternativas consideradas:**
1. **Swipe izquierda en Hechos = devolver.** Confuso: izquierda ya significa "Saltar" en To-dos.
2. **Botón persistente en cada tarjeta.** Añade ruido visual cuando no se quiere devolver.
3. **Tap → overlay de confirmación in-card.** **Elegida.**

**Solución:** En tabs `done`/`skip`, `attachSwipeHandlers` no añade listeners de touch/swipe, solo un `click` handler que hace `toggle('show-confirm')` en `.mc-front`. El overlay `.mc-confirm-ov` aparece con `opacity: 1; pointer-events: auto` vía CSS (`.mc-front.show-confirm`). `devolverMision(id)`: si era `done` llama `applyMissionToggle` (revierte XP+attrs), si era `skip` hace `delete ST.mis[today][id]`. Los acumulados históricos (`ST.totalXP`, `ST.stats`) solo se modifican si la misión estaba `done` ese mismo día.

---

## 2026-07-06 — Sprint 4.1: Swipe Tinder, mini calendario, Tabler Icons, badge de rango

**Problema 1 — Sistema de paneles de swipe poco intuitivo en móvil.**
El diseño anterior mostraba el card en posición central; swipe derecha revelaba un panel con botón "Hecho", swipe izquierda revelaba info de XP/categorías. En mobile el gesto era ambiguo y no daba feedback visual inmediato de la intención.

**Solución:** Sistema Tinder: el card se arrastra con el dedo, superponiéndose un overlay de color proporcional al desplazamiento (verde=hecho, rojo=saltar). Al superar 80px la tarjeta vuela fuera de pantalla. `touchmove { passive: false }` para interceptar el scroll vertical solo cuando se detecta dirección horizontal (`|dx| > |dy|`). Función `misionHechoById(id, xp, cats, coins)` y `misionSaltarById(id)` reciben datos directamente desde `dataset`, sin leer el DOM.

---

**Problema 2 — Barra XP del día no aportaba contexto en mobile.**
Un número de XP aislado no transmite si el usuario está en racha o ha fallado la semana.

**Solución:** Mini calendario de 7 días con puntos de color (verde=completo, rojo=fallido, naranja=parcial, borde blanco=hoy). Implementado en `renderMiniWeek()`. El ID del elemento (`mMiniWeek`) reemplaza la card de XP en `index.html`.

---

**Problema 3 — Emojis de categorías incompatibles con el estilo visual.**
Los emojis ⚔🧠🧘🎯🤝 varían por sistema operativo y no se integran bien con el diseño oscuro/neón de la app.

**Solución:** Tabler Icons webfont (ya cargado vía CDN). `CATEGORIES` en `data.js` añade `iconClass` (`ti-barbell`, `ti-brain`, `ti-leaf`, `ti-crosshair`, `ti-link`) y `radarLabel` (3 letras: CUE/MEN/PRE/ENF/VIN). El emoji `icon` se conserva en el objeto pero ya no se usa en la UI.

---

## 2026-07-06 — Sprint 4: Categorías, barras de atributo y sistema de misiones

**Problema 1 — Nombres de atributos inconsistentes con la visión.**
`energia`, `conocimiento`, `espiritualidad` eran nombres técnicos genéricos que no reflejaban la identidad RPG del producto.

**Solución:** Renombrar claves JS (`vitalidad`, `intelecto`, `conexion`). Migración v7→v8 automática conserva los valores acumulados del usuario.

---

**Problema 2 — 9 atributos planos sin jerarquía visual.**
El radar de 9 ejes resultaba difícil de leer. El usuario necesitaba ver el progreso a nivel de "categoría de vida" antes que el detalle por atributo.

**Alternativas consideradas:**
1. Mantener el radar de 9 ejes pero añadir colores por grupo. Descartada: demasiado denso para móvil.
2. Eliminar el radar y mostrar solo barras. Descartada: el radar da una lectura visual rápida del balance de vida.
3. **5 categorías en el radar + detalle de atributos debajo.** Elegida.

**Categorías finales:** ⚔ Cuerpo (Fuerza/Agilidad/Vitalidad) · 🧠 Mente (Intelecto) · 🧘 Presencia (Claridad/Serenidad) · 🎯 Enfoque (Disciplina) · 🤝 Vínculo (Confianza/Conexión).

---

**Problema 3 — Lógica de barras de atributo.**
El usuario pidió que "al completar 5 puntos suba la categoría y se reinicie como un ciclo".

**Solución elegida:** `attr_value` = total bruto acumulado (nunca se resetea). Las barras muestran `attr_value % 5` de 5 segmentos. El puntaje de categoría = `sum(floor(attr/5))`. Esto permite calcular todo desde un único número sin estado adicional.

---

**Problema 4 — MISIONES como objeto con 4 claves vs. array plano.**
El objeto `{FISICO:[], MENTE:[], ...}` requería `Object.values().flat()` en cada lugar que iteraba misiones, y hacía difícil agregar propiedades globales (ej. `hidden`).

**Solución:** Array plano con campo `hidden: true/false` y `cats:[{cat, stars}]`. Las categorías de UI (`CATEGORIES`) viven separadas en `data.js`. Más fácil de filtrar y extender.

---

**Problema 5 — `ST.mis[fecha][id]` como boolean vs. string.**
El sistema solo sabía si una misión estaba hecha o no. El nuevo diseño necesita tres estados: pendiente / hecho / saltada.

**Solución:** `undefined` = to-do · `'done'` = completada · `'skip'` = saltada. La migración v7→v8 limpia `ST.mis = {}` (los IDs de misiones cambiaron completamente de ph/mn/sp → m01-m20).

---

## 2026-07-05 — Arquitectura Mobile First + nombre Presence (sprint 3.0)

**Problema:** La app tenía 7 pestañas horizontales con texto en la parte superior, un HUD con datos en el topbar, y las secciones de Inicio y Misiones eran tabs separados. En móvil, la barra de pestañas ocupaba espacio valioso y era difícil de alcanzar con el pulgar.

**Alternativas consideradas:**
1. **Mantener la nav horizontal pero reducirla a 5 tabs.** Descartada: el problema fundamental de usabilidad con el pulgar no se resuelve; las pestañas superiores siguen siendo las menos accesibles en un teléfono.
2. **Tab bar inferior con scroll horizontal** (como Instagram Stories). Descartada: el scroll horizontal no es intuitivo para navigación principal; Tabler Icons con texto corto caben perfectamente en 5 items fijos.
3. **Bottom navigation fija con 5 tabs + íconos Tabler.** **Elegida.**

**Solución elegida:** `<nav class="bottom-nav">` con `position: fixed; bottom: 0`, 5 `.bnav-item` con `flex: 1`. El contenido principal tiene `padding-bottom: 80px` para no quedar oculto bajo la nav. `env(safe-area-inset-bottom)` para compatibilidad con iPhone con notch.

**Motivos:**
- La zona de alcance cómodo del pulgar está en la parte inferior de la pantalla — el estándar de todas las apps móviles modernas.
- 5 secciones caben sin necesitar scroll horizontal, lo que elimina un comportamiento confuso.
- Simplificación del topbar (solo logo + status) maximiza el área de contenido.

---

## 2026-07-05 — Collapsibles en Misiones en lugar de secciones separadas (sprint 3.0)

**Problema:** Calendario, Zona Oscura y Ruta eran pestañas independientes. El usuario debía navegar fuera de Misiones para acceder a información relacionada con sus hábitos del día.

**Alternativas consideradas:**
1. **Mantenerlas como tabs separados** (reduciendo de 7 a 5, dos de ellas ya no existen). Descartada: obliga al usuario a salir del contexto de misiones para ver el calendario del día.
2. **Pestañas secundarias dentro de Misiones** (sub-nav). Descartada: añade una capa de navegación extra, ocupa espacio y complica el código.
3. **Collapsibles CSS (`max-height: 0 → 3000px`).** **Elegida.**

**Solución elegida:** Tres `<div class="collapsible">` al final de `sec-misiones`. `toggleCollapse(bodyId, chevronId)` en events.js hace `classList.toggle('open')`. CSS controla la visibilidad con `max-height` y transición `cubic-bezier`. Los IDs del DOM de Calendario/Zona/Ruta son idénticos a los anteriores — los render functions existentes funcionan sin cambios.

**Motivos:**
- Todos los datos del día (misiones, calendario, zona oscura, propósito) están en una sola pantalla. Un scroll vertical es más intuitivo que cambiar de tab.
- `max-height` CSS es la técnica estándar para acordeones suaves sin JS para la animación.
- Cero migración de código: los IDs del DOM se preservan completamente.

---

## 2026-07-05 — Contador X/90 días como indicador principal (sprint 3.0)

**Problema:** La racha (días consecutivos) es el único indicador de consistencia, pero es frágil: un solo día fallido la rompe. Un usuario que falla un día después de 60 pierde toda su métrica de progreso visual.

**Alternativas consideradas:**
1. **Racha con "vidas"** (permite N días de fallo). Descartada: desnaturaliza el concepto de racha y añade lógica compleja.
2. **Contador total de días verdes** (todos los días completados históricamente). Descartada: crece ilimitadamente y no refleja la consistencia reciente.
3. **Contador de días en los últimos 90 con ≥3 misiones completadas.** **Elegida.**

**Solución elegida:** `calcDias90()` en utils.js: itera los 90 días anteriores al día actual usando `new Date(y, m, d-i)` (fecha local, evita el bug UTC de `calcRacha`). Cuenta días donde `Object.values(ST.mis[key]).filter(v => v===true).length >= 3`.

**Motivos:**
- 90 días es un horizonte temporal de hábitos ampliamente usado (trimestre). Tiene significado práctico.
- El umbral de 3 misiones evita que días "ligeros" cuenten como éxito, sin exigir perfección total.
- La ventana deslizante hace que la métrica nunca llegue a 0 por un fallo reciente — es forgiving pero honesta.
- Usa fecha local como `DateUtils.today()`, sin el bug UTC que tiene `calcRacha`.

---

## 2026-07-04 — Avatar animado como wallpaper en Inicio (sprint 2.10)

**Problema:** La pantalla de Inicio era una lista de cards sin personalidad visual. Se quería una experiencia de "fondo de pantalla de celular" con el personaje animado, preparada para una progresión visual de avatares por rango.

**Alternativas consideradas:**
1. **GIF animado.** Descartado: tamaño de archivo grande, calidad fija, difícil de personalizar por rango.
2. **Lottie / animación JSON.** Descartado: requiere biblioteca externa y encontrar animaciones que encajen con el estilo Solo Leveling.
3. **Imagen PNG + animaciones CSS puras.** **Elegida.**

**Solución elegida:** `.avatar-stage` con `position: relative`, imagen centrada con `animation: avatarFloat`, aura radial vía `background` dinámico en `#avatarAura`, y partículas `.av-particle` generadas en JS con posiciones y duraciones deterministas. El color del glow (`drop-shadow` + aura) se lee de `RANGOS[ST.rank].color` en cada render. Propiedad `avatar` añadida a cada rango en `data.js` para que la imagen cambie al subir de rango.

**Motivos:**
- Cero dependencias externas. Todo en CSS y JS vanilla, coherente con la arquitectura del proyecto.
- Las animaciones CSS (`will-change: transform`, `filter`) están aceleradas por GPU — sin impacto en rendimiento.
- El modelo data-driven del proyecto (cada rango es un objeto con sus propiedades) hace trivial agregar avatares nuevos: una línea en `data.js` por rango.

---

## 2026-07-02 — Íconos SVG en lugar de letras para los rangos (sprint 2.9b)

**Problema:** La primera versión del acordeón de rango usaba letras (E, D, C, B, A, S) en badges circulares con borde de color. No reflejaba la identidad visual del diseño de referencia.

**Alternativas consideradas:**
1. **Letras con borde de color** (implementado en sprint 2.9). Rápido, pero sin valor visual real — cualquier letra en cualquier app se ve igual.
2. **Imágenes PNG/JPG externas.** Descartadas: añaden archivos binarios al repositorio, no escalan sin perder calidad, requieren rutas y peticiones HTTP.
3. **SVG inline por rango en `data.js`.** **Elegida.**

**Solución elegida:** propiedad `svg` (string) en cada objeto de `RANGOS`. `render.js` lo inyecta con `innerHTML`. El SVG usa `viewBox="0 0 100 100"` para escalar limpiamente a cualquier tamaño (header 52px, lista 32px). `drop-shadow(color)` dinámico via `filter` CSS para el glow del rango activo.

**Motivos:**
- Los SVGs inline no requieren archivos externos, no generan peticiones de red y escalan sin artefactos.
- Centralizar el SVG en `data.js` garantiza que el ícono, el color y el glow de un rango siempre viajan juntos — cambiar un rango en el futuro es tocar un solo objeto.
- La arquitectura ya era data-driven; los SVGs son un dato más del rango.

---

## 2026-07-02 — Sistema de rangos fase 1: refactorización completa (sprint 2.9)

**Problema:** El sistema anterior tenía dos rangos paralelos (Hábitos + Técnico), estrellas como subnivel, recompensas por rango y una pestaña "Rangos" separada. Era complejo, estaba acoplado en múltiples archivos y el usuario decidió rediseñarlo completamente antes de continuar con PWA.

**Alternativas consideradas:**
1. **Ajuste incremental:** añadir nuevos rangos manteniendo la estructura dual. Descartada: perpetuaba la complejidad y la deuda técnica del Rango Técnico y las estrellas.
2. **Eliminar Rangos completamente** hasta la fase 2. Descartada: el rango es parte de la identidad visual del juego — debe seguir visible en Inicio.
3. **Eliminar dual-rank + estrellas, integrar rango en Inicio como acordeón, dejar avance de rango para fase 2.** **Elegida.**

**Solución elegida:**
- Un único array `RANGOS` (6 rangos: E→S) reemplaza `RANGOS_HABITOS` y `RANGOS_TECNICO`.
- Estado simplificado: `ST.rank` (índice 0–5). Eliminados `starsH`, `starsT`, `rankT`, `dc`.
- Pestaña "Rangos" eliminada del menú. El rango se muestra en Inicio como card acordeón (clicable, sin cambio de pantalla).
- `applyDayCompletion()` simplificada: solo marca día verde y racha. **La lógica de avance de rango es fase 2** — se diseñará e implementará por separado, con aprobación previa del usuario.
- Migración v6→v7 preserva el `rankH` anterior como nuevo `rank` (sin perder progreso del usuario).

**Motivos:**
- Reducir surface area antes de añadir PWA. Menos código, menos bugs potenciales.
- El acordeón en Inicio es menos fricción que una pestaña separada: el usuario ve su rango sin navegar.
- Separar "mostrar rango" de "avanzar rango" permite presentar el nuevo sistema visual antes de definir las reglas de progresión.

---

## 2026-06-30 — Sistema de misiones: refactorización completa (sprint 2.6)

**Problema:** La estructura de misiones anterior (3 categorías, stacks de poder, misión secreta semanal, 5 orbes de stats, tooltips en checkboxes) no representaba bien el sistema de evolución personal del usuario ni era escalable.

**Alternativas consideradas:**
1. **Ajuste incremental:** añadir nuevas categorías manteniendo la estructura. Descartada: dejaba código de stacks y misión secreta como deuda técnica activa.
2. **Refactorización completa con arquitectura data-driven.** **Elegida.**

**Solución elegida:**
- 4 categorías: Físico / Mente / Espiritual / Propósito. Cada misión tiene `stats: ['attr1', 'attr2']` (array) en lugar de una stat hardcodeada. Añadir una misión futura solo requiere tocar `data.js`, no `logic.js` ni `render.js`.
- Misión Propósito: texto dinámico desde `ST.proposito`, configurable en la pestaña Ruta. Resuelve el problema de que la misión de "Ruta de Estudio" fuera estática en código.
- Stacks de poder eliminados: añadían complejidad de UI/lógica sin aportar valor claro en esta etapa del producto.
- Misión secreta semanal eliminada: implementación frágil (mutación de estado en función de render) con impacto bajo en el sistema global. Eliminada en lugar de corregida.
- 5 orbes reemplazados por 9 atributos en grilla 3×3: Fuerza, Agilidad, Energía, Serenidad, Confianza, Conocimiento, Claridad, Espiritualidad, Disciplina.

**Motivos:**
- La arquitectura `stats: []` por misión escala a cualquier número de misiones/atributos sin tocar lógica.
- Eliminar features frágiles > corregirlas cuando no aportan valor de producto.
- Los 9 atributos cubren todos los vectores del sistema de evolución personal del usuario.

---

## 2026-06-30 — Fix timezone en `DateUtils.today()` (sprint 2.7)

**Problema:** `DateUtils.today()` retornaba `new Date().toISOString().split('T')[0]`, que es fecha UTC. En Colombia (UTC-5), el día UTC cambia 5 horas antes que el día local, causando que las misiones se "resetearan" a las 7pm hora local en lugar de medianoche.

**Alternativas consideradas:**
1. **Ajuste con offset manual** (`new Date(Date.now() - offset * 60000)`). Descartada: hardcodear un offset rompe en zonas con horario de verano.
2. **`Intl.DateTimeFormat`** con `timeZone` explícito. Descartada: requiere conocer la zona del usuario.
3. **Fecha local con `getFullYear/getMonth/getDate`.** **Elegida.**

**Solución elegida:**
```js
today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
```
Usa la fecha local del dispositivo sin ningún offset. Correcto para cualquier zona horaria. Verificado: en UTC-5 a las 10pm, la fecha local es diferente a la UTC y el reset ocurre a medianoche local.

---

## 2026-06-30 — Renombrado de IDs de misiones para evitar colisión (sprint 2.7)

**Problema:** Los IDs asignados en sprint 2.6 (`f1-f5`, `e1-e3`, `s1`, `p1`) colisionaban con IDs del sistema anterior. El localStorage con datos del día anterior marcaba como "completadas" misiones del nuevo sistema porque compartían el mismo ID.

**Solución elegida:** IDs descriptivos con prefijo por categoría:
- `ph1-ph5` (PHysical) — Físico
- `mn1-mn6` (MiNd) — Mente
- `sp1-sp3` (SPiritual) — Espiritual
- `pu1` (PUrpose) — Propósito

Migración `v5→v6` limpia completamente `ST.mis` al actualizar, eliminando cualquier dato de misiones con IDs inválidos del estado guardado.

**Motivo:** Los IDs de misiones son claves de `localStorage`; un cambio de ID sin migración es un bug silencioso de estado.

---

## 2026-06-30 — Economía de monedas por misión (sprint 2.7)

**Problema:** La Tienda requería monedas pero no había una fuente diaria clara para acumularlas.

**Solución elegida:** Cada misión define `coins` directamente en `data.js`. Máximo diario: 26c. Escala por esfuerzo:
- Alta: 3–5c (ejercicio de fuerza, inglés, propósito)
- Media: 2c (cardio, sueño, lectura espiritual, oración)
- Baja: 1c (meditación, journaling, gratitud, hidratación, alimentación)
- Cero: misiones de bajo tiempo (informarse)

**Motivos:**
- La escala intencionada incentiva misiones de mayor esfuerzo.
- Definir `coins` en `data.js` (no hardcodeado en lógica) permite ajustar la economía sin tocar `logic.js`.

---

## 2026-06-30 — Sistema de Level del Operator (sprint 2.7)

**Problema:** El XP total acumulado no tenía representación visual de progreso a largo plazo en el Inicio.

**Solución elegida:** `getLevel(totalXP)` en `utils.js` con progresión escalada:
- Nivel 1→2: 200 XP
- Cada nivel adicional: +150 XP respecto al anterior (Nivel 2→3: 350 XP, Nivel 3→4: 500 XP…)

Card "Operator Level" en Inicio muestra: nombre del nivel, XP actual / XP necesario y barra de progreso porcentual.

**Alternativas descartadas:**
- Niveles con XP fijo por nivel (lineal): fácil de escalar pero sin sensación de progresión creciente.
- Tabla de XP precalculada: innecesaria para este tamaño.

**Motivo de progresión escalada:** Los primeros niveles se alcanzan rápido (reward loop), los altos requieren constancia sostenida (refleja la naturaleza del sistema de evolución personal).

---

## 2026-06-28 — Modularización de `js/app.js`

**Problema:** `js/app.js` concentraba 1131 líneas con 9+ responsabilidades (configuración, estado, persistencia, migraciones, utilidades, lógica de negocio y presentación de 8 módulos). Esto incumple la regla del proyecto de evitar archivos gigantes y de mantener la lógica de negocio desacoplada del HTML/render.

**Alternativas consideradas:**
1. **Migrar a ES Modules** (`type="module"`, `import`/`export`) con un bundler. Descartada por ahora: rompe la apertura directa de `index.html` vía `file://` (los navegadores bloquean `import` por CORS sin servidor), y añade una dependencia de build inexistente hoy. Queda en el roadmap (`TODO.md`) como mejora futura cuando el proyecto se sirva siempre vía HTTP.
2. **Dejar `app.js` como está** y solo documentar. Descartada: no reduce la deuda técnica ya señalada en el informe de arquitectura, y dificulta cada vez más el mantenimiento a medida que se agreguen features.
3. **Dividir en módulos clásicos (`<script>` múltiples, scope global compartido)** manteniendo exactamente el mismo comportamiento. **Elegida.**

**Solución elegida:** dividir `app.js` en 6 archivos cargados como `<script>` clásicos, en el mismo scope global, sin cambiar la forma de carga de la app:

- `config.js` — `CONFIG` (constantes).
- `state.js` — `DEFAULT_STATE`, `ST`, `Storage`, `StateMigration`, `loadState()`, `saveState()`, `deepMerge()`.
- `utils.js` — `DateUtils`, `Toast`/`showToast()`, helpers DOM (`el`, `setText`, `setStyle`) y formateo (`starsHTML`, `pct`, `bonusLabel`).
- `logic.js` — reglas de negocio puras que mutan `ST` pero nunca el DOM (cálculo de XP, stacks, finalización de día, progresión de rango, compras, zona oscura, misión secreta).
- `render.js` — funciones `render*`/`build*` que solo leen `ST` + `data.js` y escriben al DOM; nunca mutan `ST`.
- `events.js` — único lugar con funciones invocadas desde `onclick=""` en el HTML; orquesta logic → state → render.
- `app.js` — se reduce a bootstrap: `loadState(); renderAll(); bootSystem();` + la función `bootSystem()`.

**Motivos:**
- Reduce riesgo: cada cambio futuro toca un archivo pequeño y específico, no un monolito.
- Acerca el código a las "capas" que las reglas del proyecto exigen explícitamente: Datos / Estado / Lógica de negocio / Presentación / Utilidades.
- Cero riesgo de regresión por carga de scripts: se mantiene el modelo de scope global clásico, solo cambia el orden y cantidad de etiquetas `<script>` en `index.html`.
- Compatible con GitHub Pages y con apertura directa de `index.html`.

**Riesgos:** al mover código entre archivos es posible introducir un error de orden de carga o una referencia rota. Mitigación: verificación manual de cada flujo clave en navegador tras el refactor (ver `TODO.md` para hallazgos detectados durante esta revisión).

---

## 2026-06-27 (heredado) — CSS Modularization

**Problema:** estilos en un único archivo CSS.
**Solución:** dividir en 10 archivos por responsabilidad, unificados vía `@import` en `style.css` (commit `c5924d2`).
**Pendiente (resuelto el 2026-06-28):** `modules.css` agrupa 8 features sin relación entre sí bajo un nombre genérico — ver decisión siguiente.

---

## 2026-06-28 — Segunda división de CSS: `css/modules.css` → 8 archivos por feature

**Problema:** `modules.css` (182 líneas) agrupaba 8 secciones sin relación temática (misiones, rangos, calendario, zona oscura, ruta, tienda, alter egos, modal de reset) bajo un nombre genérico, rompiendo la convención de modularidad por responsabilidad que ya seguía el resto de `css/`.

**Alternativas consideradas:**
1. Dejarlo como está. Descartada: ya identificado como deuda técnica en el informe de arquitectura.
2. Dividir 1:1 respetando los bloques originales. **Elegida**, con un ajuste: el modal de "subida de rango" (`.rankup*`) se agrupó con `ranks.css` (no con "Inicio", aunque se muestra ahí) porque temáticamente pertenece a la progresión de rango, y la misión secreta semanal se agrupó con `missions.css` (se muestra dentro de la pestaña Misiones).

**Solución elegida:** 8 archivos nuevos — `missions.css`, `ranks.css`, `calendar.css`, `darkzone.css`, `route.css`, `shop.css`, `alteregos.css`, `reset.css` — importados desde `style.css` en el mismo lugar donde antes estaba `modules.css`. `modules.css` se eliminó.

**Hallazgo durante la división:** la clase `.rname` estaba declarada dos veces dentro del propio `modules.css` (una en la sección "RANG LIST", otra en "TIENDA"), con propiedades distintas (`flex: 1`, `color: var(--t0)` solo en la segunda). Por la cascada CSS ambas reglas se combinaban silenciosamente sobre cualquier elemento `.rname`, sin conflicto visible hoy (el `flex:1` es inerte porque `.rname` nunca es hijo directo de un contenedor flex en ninguno de los 3 usos — Rangos, Recompensas y Tienda — y el color queda sobreescrito por estilos inline en los casos que lo necesitan), pero era una colisión de selectores frágil ante cualquier cambio futuro de markup. Se consolidó en una única declaración en `ranks.css`. Verificado en navegador que el resultado visual es idéntico al anterior en las tres vistas.

**Riesgos:** ninguno detectado tras la verificación visual (capturas de Inicio, Rangos y Tienda antes/después idénticas).

---

## 2026-06-28 — Estilos inline duplicados en `index.html`

**Problema:** 5 tarjetas de stats (Fuerza/Mente/Espíritu/Vitalidad/Disciplina) repetían exactamente `style="padding:8px 4px;text-align:center"`; el `streak-box` de Tienda repetía `style="margin-bottom:12px"`, valor que la clase `.streak-box` ya define por defecto (override sin efecto, puro ruido).

**Solución elegida:**
- Se añadió `.g5 .card { padding: 8px 4px; text-align: center; }` en `layout.css` (verificado que `.g5` solo se usa en ese bloque de 5 tarjetas, sin riesgo de afectar otra cosa) y se quitó el `style=` de las 5 tarjetas.
- Se quitó el `style="margin-bottom:12px"` redundante del `streak-box` de Tienda.

**Lo que NO se tocó (decisión explícita):** la repetición de `style="margin-bottom:10px"` en 3 tarjetas `.card2` de Misiones/Rangos no se extrajo a una clase. No es una duplicación del mismo componente (es un ajuste de espaciado puntual, distinto en cada caso de si la tarjeta es la última de su bloque o no) y el proyecto no usa clases utilitarias en ningún otro lugar del CSS — introducir una solo para esto añadiría una convención nueva sin reducir riesgo real. Sigue documentado por transparencia, no por descuido.

**Riesgo evaluado y descartado:** centralizar el mapeo de IDs del DOM (`el()`/`setText()`/`setStyle()`) en un objeto de constantes. Se reconsideró por las reglas YAGNI/KISS del propio proyecto: `el()` ya centraliza el acceso y avisa por consola si un id falta; un mapa de constantes añadiría indirección en ~30 sitios sin reducir riesgo real para el tamaño actual del proyecto. Ver `TODO.md`.
