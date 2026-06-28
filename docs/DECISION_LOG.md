# DECISION LOG

Registro de decisiones técnicas importantes: problema, alternativas consideradas, solución elegida y motivos.

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
