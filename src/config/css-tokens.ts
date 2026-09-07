/**
 * Diccionario central de tokens CSS de ComegenUI.
 *
 * - Los tokens compartidos (prefijo --cu-) se documentan aquí con descripción genérica.
 * - Los tokens de componente (prefijo específico) se documentan con su scope.
 * - Los playgrounds importan este diccionario para generar la sección Style.
 */

export interface TokenDoc {
  description: string;
  scope: 'shared' | 'component';
  component?: string;
}

export const cssTokens: Record<string, TokenDoc> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // TOKENS COMPARTIDOS — Generados por cu-tokens/css.ts
  // ═══════════════════════════════════════════════════════════════════════════

  // -- Tipografía
  '--cu-font-sans': { description: 'Fuente sans-serif principal', scope: 'shared' },
  '--cu-font-mono': { description: 'Fuente monoespaciada (código)', scope: 'shared' },
  '--cu-font-size-xs': { description: 'Tamaño de texto extra pequeño (0.75rem)', scope: 'shared' },
  '--cu-font-size-sm': { description: 'Tamaño de texto pequeño (0.875rem)', scope: 'shared' },
  '--cu-font-size-md': { description: 'Tamaño de texto medio (1rem)', scope: 'shared' },
  '--cu-font-size-lg': { description: 'Tamaño de texto grande (1.125rem)', scope: 'shared' },
  '--cu-font-size-xl': { description: 'Tamaño de texto extra grande (1.25rem)', scope: 'shared' },
  '--cu-font-size-2xl': { description: 'Tamaño de texto 2xl (1.5rem)', scope: 'shared' },
  '--cu-font-size-3xl': { description: 'Tamaño de texto 3xl (1.75rem)', scope: 'shared' },
  '--cu-font-size-4xl': { description: 'Tamaño de texto 4xl (2rem)', scope: 'shared' },
  '--cu-font-weight-normal': { description: 'Peso de fuente normal (400)', scope: 'shared' },
  '--cu-font-weight-medium': { description: 'Peso de fuente medio (500)', scope: 'shared' },
  '--cu-font-weight-semibold': { description: 'Peso de fuente semi-bold (600)', scope: 'shared' },
  '--cu-font-weight-bold': { description: 'Peso de fuente bold (700)', scope: 'shared' },
  '--cu-line-height-tight': { description: 'Altura de línea compacta (1.25)', scope: 'shared' },
  '--cu-line-height-normal': { description: 'Altura de línea normal (1.5)', scope: 'shared' },
  '--cu-line-height-relaxed': { description: 'Altura de línea relajada (1.75)', scope: 'shared' },

  // -- Espaciado
  '--cu-space-2xs': { description: 'Espaciado extra extra pequeño (2px)', scope: 'shared' },
  '--cu-space-xs': { description: 'Espaciado extra pequeño (4px)', scope: 'shared' },
  '--cu-space-sm': { description: 'Espaciado pequeño (8px)', scope: 'shared' },
  '--cu-space-md': { description: 'Espaciado medio (12px)', scope: 'shared' },
  '--cu-space-lg': { description: 'Espaciado grande (16px)', scope: 'shared' },
  '--cu-space-xl': { description: 'Espaciado extra grande (24px)', scope: 'shared' },
  '--cu-space-2xl': { description: 'Espaciado 2xl (32px)', scope: 'shared' },
  '--cu-space-3xl': { description: 'Espaciado 3xl (48px)', scope: 'shared' },
  '--cu-space-4xl': { description: 'Espaciado 4xl (64px)', scope: 'shared' },
  '--cu-space-5xl': { description: 'Espaciado 5xl (80px)', scope: 'shared' },

  // -- Border Radius
  '--cu-radius': { description: 'Radio de borde por defecto (8px)', scope: 'shared' },
  '--cu-radius-none': { description: 'Sin radio de borde (0)', scope: 'shared' },
  '--cu-radius-sm': { description: 'Radio de borde pequeño (4px)', scope: 'shared' },
  '--cu-radius-md': { description: 'Radio de borde medio (8px)', scope: 'shared' },
  '--cu-radius-lg': { description: 'Radio de borde grande (12px)', scope: 'shared' },
  '--cu-radius-full': { description: 'Radio de borde completo (9999px)', scope: 'shared' },

  // -- Sombras
  '--cu-shadow-color': { description: 'Color base de sombras (por tema)', scope: 'shared' },
  '--cu-shadow-sm': { description: 'Sombra pequeña', scope: 'shared' },
  '--cu-shadow-md': { description: 'Sombra media', scope: 'shared' },
  '--cu-shadow-lg': { description: 'Sombra grande', scope: 'shared' },
  '--cu-shadow-xl': { description: 'Sombra extra grande', scope: 'shared' },

  // -- Bordes
  '--cu-border-none': { description: 'Sin borde (0)', scope: 'shared' },
  '--cu-border-thin': { description: 'Borde fino (1px)', scope: 'shared' },
  '--cu-border-medium': { description: 'Borde medio (2px)', scope: 'shared' },
  '--cu-border-thick': { description: 'Borde grueso (4px)', scope: 'shared' },
  '--cu-border-color': { description: 'Color de borde por defecto', scope: 'shared' },
  '--cu-border-color-strong': { description: 'Color de borde fuerte', scope: 'shared' },
  '--cu-border-color-focus': { description: 'Color de borde en foco', scope: 'shared' },

  // -- Colores de superficie y código
  '--cu-color-surface': { description: 'Color de superficie (fondo de tarjetas, modales)', scope: 'shared' },
  '--cu-code-bg': { description: 'Fondo de bloques de código', scope: 'shared' },
  '--cu-code-text': { description: 'Texto sobre bloques de código', scope: 'shared' },
  '--cu-code-faded': { description: 'Texto atenuado en código (comentarios, meta)', scope: 'shared' },

  // -- Modal
  '--cu-modal-size-sm': { description: 'Ancho modal pequeño (25vw)', scope: 'shared' },
  '--cu-modal-size-md': { description: 'Ancho modal medio (30vw)', scope: 'shared' },
  '--cu-modal-size-lg': { description: 'Ancho modal grande (35vw)', scope: 'shared' },
  '--cu-modal-size-xl': { description: 'Ancho modal extra grande (40vw)', scope: 'shared' },
  '--cu-modal-size-auto': { description: 'Ancho modal automático (50vw)', scope: 'shared' },
  '--cu-modal-size-full': { description: 'Ancho modal completo (90vw)', scope: 'shared' },
  '--cu-modal-height-sm': { description: 'Alto modal pequeño (30vh)', scope: 'shared' },
  '--cu-modal-height-md': { description: 'Alto modal medio (40vh)', scope: 'shared' },
  '--cu-modal-height-lg': { description: 'Alto modal grande (50vh)', scope: 'shared' },
  '--cu-modal-height-xl': { description: 'Alto modal extra grande (60vh)', scope: 'shared' },
  '--cu-modal-height-auto': { description: 'Alto modal automático (50vh)', scope: 'shared' },
  '--cu-modal-height-full': { description: 'Alto modal completo (90vh)', scope: 'shared' },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOKENS DE COMPONENTE — Definidos en cada .vue
  // ═══════════════════════════════════════════════════════════════════════════

  // -- Button
  '--btn-bg': { description: 'Fondo del botón', scope: 'component', component: 'Button' },
  '--btn-bg-hover': { description: 'Fondo del botón en hover', scope: 'component', component: 'Button' },
  '--btn-bg-active': { description: 'Fondo del botón en estado activo', scope: 'component', component: 'Button' },
  '--btn-fg': { description: 'Color de texto del botón', scope: 'component', component: 'Button' },
  '--btn-bd': { description: 'Color de borde del botón', scope: 'component', component: 'Button' },
  '--btn-soft': { description: 'Fondo de la variante soft', scope: 'component', component: 'Button' },
  '--btn-soft-hover': { description: 'Fondo hover de la variante soft', scope: 'component', component: 'Button' },
  '--btn-soft-active': { description: 'Fondo activo de la variante soft', scope: 'component', component: 'Button' },
  '--btn-subtle': { description: 'Fondo de la variante subtle', scope: 'component', component: 'Button' },
  '--btn-subtle-hover': { description: 'Fondo hover de la variante subtle', scope: 'component', component: 'Button' },
  '--btn-subtle-active': { description: 'Fondo activo de la variante subtle', scope: 'component', component: 'Button' },
  '--btn-subtle-border': { description: 'Borde de la variante subtle', scope: 'component', component: 'Button' },
  '--btn-ghost-hover': { description: 'Fondo hover de la variante ghost', scope: 'component', component: 'Button' },
  '--btn-ghost-active': { description: 'Fondo activo de la variante ghost', scope: 'component', component: 'Button' },

  // -- FloatingButton
  '--fab-bg': { description: 'Fondo del botón flotante', scope: 'component', component: 'FloatingButton' },
  '--fab-bg-hover': { description: 'Fondo del botón flotante en hover', scope: 'component', component: 'FloatingButton' },
  '--fab-bg-active': { description: 'Fondo del botón flotante en activo', scope: 'component', component: 'FloatingButton' },

  // -- Calendar
  '--cal-accent': { description: 'Color de acento del calendario', scope: 'component', component: 'Calendar' },
  '--cal-accent-hover': { description: 'Color de acento en hover', scope: 'component', component: 'Calendar' },
  '--cal-soft': { description: 'Fondo soft del calendario', scope: 'component', component: 'Calendar' },
  '--cal-soft-hover': { description: 'Fondo soft en hover', scope: 'component', component: 'Calendar' },
  '--cal-subtle': { description: 'Fondo subtle del calendario', scope: 'component', component: 'Calendar' },
  '--cal-subtle-border': { description: 'Borde subtle del calendario', scope: 'component', component: 'Calendar' },
  '--cal-ghost-hover': { description: 'Fondo hover ghost del calendario', scope: 'component', component: 'Calendar' },

  // -- Alert
  '--alert-bg': { description: 'Fondo de la alerta', scope: 'component', component: 'Alert' },
  '--alert-text': { description: 'Color de texto de la alerta', scope: 'component', component: 'Alert' },
  '--alert-soft': { description: 'Fondo de la variante soft', scope: 'component', component: 'Alert' },
  '--alert-subtle': { description: 'Fondo de la variante subtle', scope: 'component', component: 'Alert' },
  '--alert-subtle-border': { description: 'Borde de la variante subtle', scope: 'component', component: 'Alert' },
  '--alert-ghost-hover': { description: 'Fondo hover de la variante ghost', scope: 'component', component: 'Alert' },
  '--alert-ghost-active': { description: 'Fondo activo de la variante ghost', scope: 'component', component: 'Alert' },

  // -- Badge
  '--badge-bg': { description: 'Fondo del badge', scope: 'component', component: 'Badge' },
  '--badge-text': { description: 'Color de texto del badge', scope: 'component', component: 'Badge' },
  '--badge-soft': { description: 'Fondo de la variante soft', scope: 'component', component: 'Badge' },
  '--badge-subtle': { description: 'Fondo de la variante subtle', scope: 'component', component: 'Badge' },
  '--badge-subtle-border': { description: 'Borde de la variante subtle', scope: 'component', component: 'Badge' },

  // -- Card
  '--card-bg': { description: 'Fondo de la tarjeta', scope: 'component', component: 'Card' },
  '--card-text': { description: 'Color de texto de la tarjeta', scope: 'component', component: 'Card' },
  '--card-soft': { description: 'Fondo de la variante soft', scope: 'component', component: 'Card' },
  '--card-subtle': { description: 'Fondo de la variante subtle', scope: 'component', component: 'Card' },
  '--card-subtle-border': { description: 'Borde de la variante subtle', scope: 'component', component: 'Card' },

  // -- Avatar
  '--avatar-bg': { description: 'Color de fondo del avatar (resuelto desde --cu-color-{color})', scope: 'component', component: 'Avatar' },

  // -- Loader
  '--cu-loader-color': { description: 'Color del loader', scope: 'component', component: 'Loader' },
  '--cu-loader-delay': { description: 'Duración de la animación de enfriamiento', scope: 'component', component: 'Loader' },

  // -- Checkbox
  '--cb-bg': { description: 'Fondo del checkbox', scope: 'component', component: 'Checkbox' },
  '--cb-ghost-hover': { description: 'Fondo hover ghost del checkbox', scope: 'component', component: 'Checkbox' },

  // -- CodeBlock
  '--cb-text': { description: 'Color de texto del código', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-keyword': { description: 'Color de keywords', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-string': { description: 'Color de strings', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-number': { description: 'Color de números', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-title': { description: 'Color de títulos', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-tag': { description: 'Color de tags HTML', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-attr': { description: 'Color de atributos', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-meta': { description: 'Color de meta', scope: 'component', component: 'CodeBlock' },
  '--cb-hl-comment': { description: 'Color de comentarios', scope: 'component', component: 'CodeBlock' },

  // -- ColorPicker
  '--cp-subtle-border': { description: 'Borde subtle del selector de color', scope: 'component', component: 'ColorPicker' },

  // -- FileInput
  '--input-bg': { description: 'Fondo del input', scope: 'component', component: 'FileInput' },
  '--input-text': { description: 'Color de texto del input', scope: 'component', component: 'FileInput' },
  '--input-soft': { description: 'Fondo de la variante soft', scope: 'component', component: 'FileInput' },
  '--input-soft-hover': { description: 'Fondo hover de la variante soft', scope: 'component', component: 'FileInput' },
  '--input-ghost-hover': { description: 'Fondo hover de la variante ghost', scope: 'component', component: 'FileInput' },

  // -- FileInputZone
  '--zone-bg': { description: 'Fondo de la zona de arrastre', scope: 'component', component: 'FileInputZone' },
  '--zone-text': { description: 'Color de texto de la zona', scope: 'component', component: 'FileInputZone' },
  '--zone-ghost-hover': { description: 'Fondo hover ghost de la zona', scope: 'component', component: 'FileInputZone' },

  // -- Label
  '--label-fg': { description: 'Color de texto de la etiqueta', scope: 'component', component: 'Label' },

  // -- Switch
  '--switch-bg': { description: 'Fondo del switch', scope: 'component', component: 'Switch' },
  '--switch-ghost-hover': { description: 'Fondo hover ghost del switch', scope: 'component', component: 'Switch' },

  // -- Table
  '--table-bg-hover': { description: 'Fondo de fila en hover', scope: 'component', component: 'Table' },
  '--table-bd': { description: 'Color de bordes de la tabla', scope: 'component', component: 'Table' },

  // -- Tabs
  '--tabs-color': { description: 'Color del tab activo', scope: 'component', component: 'Tabs' },
  '--tabs-soft': { description: 'Fondo soft del tab', scope: 'component', component: 'Tabs' },
  '--tabs-soft-hover': { description: 'Fondo hover soft del tab', scope: 'component', component: 'Tabs' },

  // -- Modal
  '--modal-color': { description: 'Color del header del modal', scope: 'component', component: 'Modal' },

  // -- DropdownMenu
  '--menu-bg': { description: 'Fondo del menú desplegable', scope: 'component', component: 'DropdownMenu' },

  // -- Navbar (no tokens propios, usa shared)

  // -- Pagination (no tokens propios, usa shared)

  // -- Select (no tokens propios, usa shared)

  // -- Collapse (no tokens propios, usa shared)

  // -- Dropdown (no tokens propios, usa shared)

  // -- Markdown (no tokens propios, usa shared)

  // -- Blockquote (no tokens propios, usa shared)

  // -- Autocomplete (no tokens propios, usa shared)

  // -- DatePicker (no tokens propios, usa shared)

  // -- DatePickerRange (no tokens propios, usa shared)

  // -- MonthSlider (no tokens propios, usa shared)

  // -- YearSlider (no tokens propios, usa shared)

  // -- CopyButton (no tokens propios, usa shared)

  // -- ToggleColorScheme (no tokens propios, usa shared)

  // -- AdvancedTable (no tokens propios, usa shared)

  // -- EditableRow (no tokens propios, usa shared)

  // -- Textarea (no tokens propios, usa shared)

  // -- Input (no tokens propios, usa shared)

  // -- AuthorCard (no tokens propios, usa shared + Avatar)
};

/**
 * Obtiene la documentación de un token por su nombre.
 * Si el token no está en el diccionario, devuelve una descripción genérica.
 */
export function getTokenDoc(tokenName: string): TokenDoc {
  if (cssTokens[tokenName]) {
    return cssTokens[tokenName];
  }
  // Tokens generados dinámicamente (colores por nombre)
  if (tokenName.startsWith('--cu-color-')) {
    return { description: 'Color semántico del tema', scope: 'shared' };
  }
  return { description: 'Token personalizado', scope: 'component' };
}

/**
 * Resuelve la descripción de un token, útil para mostrar en tablas.
 */
export function getTokenDescription(tokenName: string): string {
  return getTokenDoc(tokenName).description;
}
