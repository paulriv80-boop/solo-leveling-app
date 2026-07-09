# BRAND IDENTITY — Presence

Fuente de verdad para identidad visual y de marca. Actualizar cuando se introduzcan cambios visuales importantes.

---

## 1. Nombre y concepto

**Nombre del producto:** Presence

**Tagline implícito:** "El sistema te acepta tal como eres."

**Concepto visual:** RPG de evolución personal. El usuario no usa una app — juega un personaje que se fortalece con hábitos reales. Cada acción cotidiana tiene peso, cada día completado es progresión visible.

**Tono:** oscuro, futurista, poderoso. No infantil. No minimalista genérico. Inspirado en la estética del manhwa *Solo Leveling*.

---

## 2. Paleta de colores

Definida en `css/variables.css`. Nunca cambiar estos valores sin actualizar este documento.

### Fondos (escala oscura)
| Variable | Hex | Uso |
|---|---|---|
| `--bg0` | `#05050f` | Fondo base de la app (el más oscuro) |
| `--bg1` | `#0d0d1a` | Fondo de secciones principales |
| `--bg2` | `#13132a` | Fondo de cards y paneles |
| `--bg3` | `#1a1a3a` | Fondo de elementos interactivos (inputs, toggles) |
| `--bg4` | `#222248` | Fondo de hover / estado activo leve |

### Colores de acento (neón)
| Variable | Hex | Nombre | Uso principal |
|---|---|---|---|
| `--c1` | `#00f5ff` | Cyan neón | Color primario — XP, tabs activos, barras, glows principales |
| `--c2` | `#bf5fff` | Morado neón | Propósitos personalizados, Alter Egos, detalles especiales |
| `--c3` | `#39ff14` | Verde matrix | Racha activa, día completado, éxito |
| `--c4` | `#ff6b35` | Naranja | Alertas, día fallido, advertencias |
| `--c5` | `#ffd700` | Dorado | Monedas de sombra, trofeos, recompensas |
| `--red` | `#ff2d55` | Rojo neón | Peligro, skip, reset, acciones destructivas |
| `--pink` | `#ff44aa` | Rosa | Detalles secundarios, Empatía |

### Texto
| Variable | Hex | Uso |
|---|---|---|
| `--t0` | `#f0f8ff` | Texto primario (títulos, valores importantes) |
| `--t1` | `#b8c8e8` | Texto secundario |
| `--t2` | `#7080a8` | Texto terciario (labels, descripciones) |
| `--t3` | `#404868` | Texto deshabilitado / placeholder |

### Bordes
| Variable | Hex | Uso |
|---|---|---|
| `--bd` | `rgba(255,255,255,0.094)` | Borde sutil de cards y paneles |
| `--bd2` | `rgba(255,255,255,0.188)` | Borde de elementos activos |

### Glows (sombras de luz)
| Variable | Uso |
|---|---|
| `--glow1` | Glow cyan para elementos primarios |
| `--glow2` | Glow morado para propósitos / alter egos |
| `--glow3` | Glow verde para rachas / éxitos |
| `--glow5` | Glow dorado para monedas / trofeos |

### Colores de rango (dinámicos, no en variables.css)
Definidos en `RANGOS` en `js/data.js`. Se aplican via `--rank-color` CSS custom property.
| Rango | Color |
|---|---|
| E — Novato | `#c8956a` (bronce) |
| D — Adepto | `#9ab0c0` (acero) |
| C — Experto | `#e8c030` (dorado) |
| B — Disciplinado | `#9966cc` (violeta) |
| A — Liberado | `#c0c0c0` (plateado) |
| S — Trascendente | `#ffd700` (oro puro) |

---

## 3. Tipografía

- **Fuente base:** `system-ui, -apple-system, sans-serif` — fuente del sistema del dispositivo. No se carga ninguna fuente externa por decisión de rendimiento.
- **Tamaños clave:**
  - Título de card / misión: `15px`, `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: 1.5px`
  - Subtítulo / descripción: `10px`, `color: var(--t2)`
  - Labels de tabs: `10px`, `font-weight: 700`, `letter-spacing: 0.5px`, `text-transform: uppercase`
  - Overlay titles: `16px`, `font-weight: 700`, `letter-spacing: 2px`, `text-transform: uppercase`
  - Valores numéricos importantes (XP, level, rang score): `font-weight: 900`

---

## 4. Iconografía

- **Librería:** Tabler Icons via CDN (`@tabler/icons-webfont@2.44.0`)
- **Uso:** `<i class="ti ti-nombre-del-icono"></i>`
- **Iconos de categorías:**
  - Cuerpo: `ti-barbell`
  - Mente: `ti-brain`
  - Presencia: `ti-leaf`
  - Enfoque: `ti-crosshair`
  - Vínculo: `ti-link`
- **Iconos de navegación:**
  - Misiones (home): `ti-home`
  - Progreso (stats): `ti-chart-bar`
  - Comunidad: `ti-shield`
  - Tools: `ti-tools`
  - Menú: `ti-grid-dots`

No usar emojis en la interfaz. Toda iconografía debe ser Tabler Icons para consistencia.

---

## 5. Estilo visual

### Principios estéticos
- **Oscuro siempre.** Nunca modo claro. La identidad es inseparable del fondo oscuro.
- **Neón sobre negro.** El contraste entre `--bg0` y los colores de acento es la firma visual.
- **Glassmorphism sutil.** Cards con `background: rgba(...)` + `backdrop-filter: blur(...)` + borde semitransparente.
- **Glows y drop-shadows.** Toda acción exitosa o elemento activo debe tener iluminación. Sin glows = sin vida.
- **Sin sombras externas clásicas.** No usar `box-shadow` oscuro al estilo material design. Los shadows son de luz (`0 0 Xpx color`).

### Componentes clave
- **Cards de misión (.mc-wrap):** 170px de alto, imagen de fondo (m01-m10) o gradiente de color (m11+), overlay oscuro para legibilidad, texto y badges en la parte inferior.
- **Overlays (.attrs-overlay):** `position: fixed; inset: 0`, `backdrop-filter: blur(28px)`, slide-up con `translateY(100%) → translateY(0)`.
- **Topbar:** Logo "trasparente.png" con aura pulsante en color de rango, estado ONLINE con punto verde.
- **Bottom nav:** 5 tabs fijos en la parte inferior, `position: fixed; bottom: 0`.
- **Radar pentagonal:** 5 ejes (CUE/MEN/PRE/ENF/VIN), fill en color del rango actual, escala absoluta TARGET=15.
- **Avatar:** imagen PNG full-screen en tab Progreso, con gradiente inferior para legibilidad de los controles.

---

## 6. Identidad de marca

### Personalidad visual
- Poderosa, no agresiva.
- Mística, no abstracta.
- Progresiva, no estática.
- Seria, no aburrida.

### Lo que nunca debe hacerse
- Fondos claros o blancos.
- Colores pasteles o "wellness".
- Tipografías decorativas externas.
- Animaciones lentas o lentas que quiten inmersión.
- Mezclar el estilo neón con iconos de colores planos tipo emoji.
- Iconos inconsistentes (mezclar Tabler con otras librerías).

### Assets de personaje
Imágenes PNG en `assets/` siguiendo la convención `Avatar_Rango_[Letra]_[actividad].png`.
- Rango E tiene imágenes para: meditación, oración/gratitud, levantar pesas, correr, hidratación, nutrición, dormir, afirmaciones, lectura, journal.
- El personaje neutro (sin actividad) es `Avatar_Rango_E_neutro.png`.
- Rangos D-S: `avatar.png` como placeholder hasta que se generen las imágenes de progresión.
