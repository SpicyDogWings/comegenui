<script setup lang="ts">
import Navbar from '@/components/lab/collapse/navigation/Navbar.vue'
import Outline from '@/components/lab/collapse/navigation/Outline.vue'
import Input from '@/components/form/Input.vue'
import Button from '@/components/buttons/Button.vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Card from '@/components/information/Card.vue'
import Badge from '@/components/information/Badge.vue'
import Table from '@/components/data/Table.vue'
import Pagination from '@/components/controls/Pagination.vue'

const dropdownItems = [
  { label: 'PDF', value: 'pdf' },
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'xlsx' },
]

const tableData = [
  { name: 'Alice Johnson', status: 'Active', role: 'Admin' },
  { name: 'Bob Smith', status: 'Pending', role: 'User' },
  { name: 'Carol White', status: 'Inactive', role: 'Moderator' },
]

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
]

const demoNavItems = [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Reportes', path: '/reports' },
  { label: 'Equipo', path: '/team' },
  { label: 'Configuración', children: [
    { label: 'General', path: '/settings' },
    { label: 'Seguridad', path: '/security' },
  ]},
]

const demoOutlineItems = [
  { label: 'Usuarios', id: 'users' },
  { label: 'Permisos', id: 'perms', children: [
    { label: 'Roles', id: 'roles' },
    { label: 'Políticas', id: 'policies' },
  ]},
  { label: 'Actividad', id: 'activity' },
]
</script>

<template>
  <div class="tb-scene">
    <div class="tb-scene-header">
      <h3 class="tb-scene-title">Dashboard</h3>
      <p class="tb-scene-desc">Vista general con métricas, datos y acciones rápidas</p>
    </div>
    <div class="tb-dashboard">
      <div class="tb-dash-sidebar">
        <Navbar :items="demoNavItems" :search="true" search-placeholder="Buscar sección..." />
        <div class="tb-dash-sidebar-footer">
          <Outline :items="demoOutlineItems" />
        </div>
      </div>
      <div class="tb-dash-main">
        <div class="tb-dash-toolbar">
          <Input placeholder="Buscar…" style="max-width: 240px" />
          <div class="tb-dash-toolbar-actions">
            <Button color="primary">Nuevo</Button>
            <DropdownMenu color="neutral" variant="soft" label="Exportar" :items="dropdownItems" />
          </div>
        </div>
        <div class="tb-dash-stats">
          <Card variant="soft" color="primary" class="tb-stat">
            <div class="tb-stat-value">1,284</div>
            <div class="tb-stat-label">Usuarios activos</div>
          </Card>
          <Card variant="soft" color="success" class="tb-stat">
            <div class="tb-stat-value">98.2%</div>
            <div class="tb-stat-label">Uptime</div>
          </Card>
          <Card variant="soft" color="warning" class="tb-stat">
            <div class="tb-stat-value">42</div>
            <div class="tb-stat-label">Alertas</div>
          </Card>
          <Card variant="subtle" color="secondary" class="tb-stat">
            <div class="tb-stat-value">$12.4k</div>
            <div class="tb-stat-label">Ingresos</div>
          </Card>
        </div>
        <Card variant="ghost" class="tb-dash-table">
          <Table :columns="tableColumns" :data="tableData" color="primary">
            <template #cell-status="{ value }">
              <Badge :color="value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'">
                {{ value }}
              </Badge>
            </template>
          </Table>
          <template #footer>
            <Pagination :total-pages="10" :current-page="3" :total-items="100" color="primary" />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
