<script setup lang="ts">
import Badge from '@/components/information/Badge.vue'
import Button from '@/components/buttons/Button.vue'
import Card from '@/components/information/Card.vue'
import AuthorCard from '@/components/information/AuthorCard.vue'
import Outline from '@/components/lab/collapse/navigation/Outline.vue'
import Markdown from '@/components/markdown/Markdown.vue'

const docOutlineItems = [
  { label: 'Introducción', id: 'intro' },
  { label: '¿Cómo funciona?', id: 'how', children: [
    { label: 'Tokens de color', id: 'color-tokens' },
    { label: 'Tipografía', id: 'typography' },
  ]},
  { label: 'Buenas prácticas', id: 'practices' },
]
</script>

<template>
  <div class="tb-scene">
    <div class="tb-scene-header">
      <h3 class="tb-scene-title">Editorial</h3>
      <p class="tb-scene-desc">Nota de documentación con formato de artículo</p>
    </div>
    <div class="tb-editorial">
      <div class="tb-doc">
        <div class="tb-doc-header">
          <div class="tb-doc-meta">
            <Badge color="primary" variant="soft">Documentación</Badge>
            <span class="tb-doc-date">6 sep 2026</span>
            <span class="tb-doc-read">4 min de lectura</span>
          </div>
          <h1 class="tb-doc-title">Sistema de tokens y temas</h1>
          <p class="tb-doc-subtitle">Cómo funciona la personalización de colores, tipografía y espaciado en ComegenUI</p>
          <div class="tb-doc-author">
            <AuthorCard name="María Cano" role="Design Systems" />
          </div>
        </div>
        <div class="tb-doc-toolbar">
          <div class="tb-doc-toolbar-group">
            <button class="tb-doc-tb-btn" title="Negrita"><strong>B</strong></button>
            <button class="tb-doc-tb-btn" title="Itálica"><em>I</em></button>
            <button class="tb-doc-tb-btn" title="Código">&lt;/&gt;</button>
            <button class="tb-doc-tb-btn" title="Link">🔗</button>
          </div>
          <div class="tb-doc-toolbar-group">
            <button class="tb-doc-tb-btn" title="Lista">☰</button>
            <button class="tb-doc-tb-btn" title="Título">H</button>
            <button class="tb-doc-tb-btn" title="Cita">❝</button>
          </div>
          <div class="tb-doc-toolbar-spacer" />
          <Badge color="success" variant="soft">Publicado</Badge>
        </div>
        <div class="tb-doc-body">
          <Markdown>
## Introducción

Los **tokens de diseño** son la fuente única de verdad para todo el sistema visual. En lugar de hardcodear colores o tamaños en cada componente, usamos variables CSS que se resuelven según el tema activo.

> Cambiás un token y todo el ecosistema lo sigue — desde los botones hasta las alertas.

## ¿Cómo funciona?

Cada tema define un conjunto de tokens que cubren:

- **Colores**: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`
- **Tipografía**: familias, pesos y tamaños
- **Espaciado**: escala consistente para márgenes y paddings
- **Bordes**: radios y anchos

### Ejemplo rápido

Definís un tema nuevo en pocos pasos:

1. Abrís el Theme Builder
2. Ajustás los colores con los pickers
3. Exportás el CSS generado
4. Lo importás en tu proyecto

## Buenas prácticas

- **No mezcles temas** en la misma vista
- **Usá los tokens semánticos** (`primary`, `success`) en vez de nombres de color
- **Probá en contexto** con las previews del builder
- **Exportá y versioná** los temas junto al código
          </Markdown>
        </div>
        <div class="tb-doc-footer">
          <div class="tb-doc-tags">
            <Badge color="neutral" variant="soft">Design Tokens</Badge>
            <Badge color="neutral" variant="soft">Temas</Badge>
            <Badge color="neutral" variant="soft">CSS</Badge>
          </div>
          <div class="tb-doc-actions">
            <Button color="neutral" variant="ghost">Compartir</Button>
            <Button color="primary">Guardar borrador</Button>
          </div>
        </div>
      </div>
      <div class="tb-doc-sidebar">
        <Card variant="subtle" color="primary" class="tb-doc-toc-card">
          <h4 class="tb-doc-sidebar-title">En esta página</h4>
          <Outline :items="docOutlineItems" />
        </Card>
        <Card variant="ghost" class="tb-doc-meta-card">
          <h4 class="tb-doc-sidebar-title">Estadísticas</h4>
          <div class="tb-doc-stats">
            <div class="tb-doc-stat">
              <span class="tb-doc-stat-value">1.2k</span>
              <span class="tb-doc-stat-label">Palabras</span>
            </div>
            <div class="tb-doc-stat">
              <span class="tb-doc-stat-value">4</span>
              <span class="tb-doc-stat-label">Secciones</span>
            </div>
            <div class="tb-doc-stat">
              <span class="tb-doc-stat-value">3</span>
              <span class="tb-doc-stat-label">Bloques código</span>
            </div>
            <div class="tb-doc-stat">
              <span class="tb-doc-stat-value">2</span>
              <span class="tb-doc-stat-label">Citas</span>
            </div>
          </div>
        </Card>
        <Card variant="ghost" class="tb-doc-versions-card">
          <h4 class="tb-doc-sidebar-title">Versiones</h4>
          <div class="tb-doc-versions">
            <div class="tb-doc-version tb-doc-version--current">
              <div class="tb-doc-version-dot" />
              <div class="tb-doc-version-info">
                <span class="tb-doc-version-label">v1.3</span>
                <span class="tb-doc-version-date">Hoy, 14:20</span>
              </div>
              <Badge color="success" variant="soft">Actual</Badge>
            </div>
            <div class="tb-doc-version">
              <div class="tb-doc-version-dot" />
              <div class="tb-doc-version-info">
                <span class="tb-doc-version-label">v1.2</span>
                <span class="tb-doc-version-date">Ayer, 09:45</span>
              </div>
            </div>
            <div class="tb-doc-version">
              <div class="tb-doc-version-dot" />
              <div class="tb-doc-version-info">
                <span class="tb-doc-version-label">v1.1</span>
                <span class="tb-doc-version-date">5 sep, 18:00</span>
              </div>
            </div>
            <div class="tb-doc-version">
              <div class="tb-doc-version-dot" />
              <div class="tb-doc-version-info">
                <span class="tb-doc-version-label">v1.0</span>
                <span class="tb-doc-version-date">3 sep, 11:30</span>
              </div>
            </div>
          </div>
        </Card>
        <Card variant="soft" color="warning" class="tb-doc-note-card">
          <h4 class="tb-doc-sidebar-title">Nota del editor</h4>
          <p class="tb-doc-note-text">Esta documentación está en revisión. Faltan ejemplos de migración desde v1.x.</p>
        </Card>
      </div>
    </div>
  </div>
</template>
