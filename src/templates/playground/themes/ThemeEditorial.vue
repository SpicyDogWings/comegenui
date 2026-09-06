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

<style scoped>
.tb-scene {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tb-scene-header {
  padding: 0 0.25rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  padding-bottom: 0.75rem;
}
.tb-scene-title {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
}
.tb-scene-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0.25rem 0 0;
}
.tb-editorial {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
}
.tb-doc {
  min-width: 0;
}
.tb-doc-header {
  margin-bottom: 1.5rem;
}
.tb-doc-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.tb-doc-date,
.tb-doc-read {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}
.tb-doc-date::before,
.tb-doc-read::before {
  content: '·';
  margin-right: 0.25rem;
}
.tb-doc-title {
  font-size: var(--cu-font-size-3xl);
  font-weight: var(--cu-font-weight-bold);
  color: var(--cu-color-neutral);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.tb-doc-subtitle {
  font-size: var(--cu-font-size-md);
  color: var(--cu-color-neutral);
  opacity: 0.7;
  margin: 0;
}
.tb-doc-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  margin-bottom: 1.5rem;
}
.tb-doc-toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.tb-doc-toolbar-group:last-of-type {
  margin-left: auto;
}
.tb-doc-tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--cu-radius-sm);
  background: transparent;
  color: var(--cu-color-neutral);
  cursor: pointer;
  font-size: var(--cu-font-size-sm);
  transition: background 150ms ease;
}
.tb-doc-tb-btn:hover {
  background: var(--cu-color-neutral-ghost-hover);
}
.tb-doc-toolbar-spacer {
  flex: 1;
}
.tb-doc-body {
  margin-bottom: 1.5rem;
}
.tb-doc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
.tb-doc-tags {
  display: flex;
  gap: 0.5rem;
}
.tb-doc-actions {
  display: flex;
  gap: 0.5rem;
}
.tb-doc-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tb-doc-toc-card {
  padding: 1rem;
}
.tb-doc-meta-card {
  padding: 1rem;
}
.tb-doc-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.tb-doc-stat {
  text-align: center;
}
.tb-doc-stat-value {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  color: var(--cu-color-neutral);
}
.tb-doc-stat-label {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}
.tb-doc-versions-card {
  padding: 1rem;
}
.tb-doc-versions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tb-doc-version {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0;
}
.tb-doc-version--current {
  font-weight: var(--cu-font-weight-medium);
}
.tb-doc-version-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cu-border-color);
  flex-shrink: 0;
}
.tb-doc-version--current .tb-doc-version-dot {
  background: var(--cu-color-success);
}
.tb-doc-version-info {
  flex: 1;
}
.tb-doc-version-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}
.tb-doc-version-date {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.5;
}
.tb-doc-note-card {
  padding: 1rem;
}
.tb-doc-note-text {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}
.tb-doc-sidebar-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0 0 0.75rem;
}
</style>
