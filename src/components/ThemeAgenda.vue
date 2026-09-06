<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '@/components/form/Input.vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Calendar from '@/components/controls/Calendar.vue'
import DatePicker from '@/components/form/DatePicker.vue'
import Select from '@/components/form/Select.vue'
import Textarea from '@/components/form/Textarea.vue'
import Button from '@/components/buttons/Button.vue'
import Label from '@/components/form/Label.vue'
import Badge from '@/components/information/Badge.vue'
import Alert from '@/components/information/Alert.vue'

const dropdownItems = [
  { label: 'Todas', value: 'all' },
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
]

interface AgendaEvent {
  date: string
  time: string
  title: string
  desc: string
  color: string
  badge: string
}

const allAgendaEvents: AgendaEvent[] = [
  { date: '2026-09-06', time: '09:00', title: 'Sprint planning', desc: 'Revisión del backlog', color: 'primary', badge: 'work' },
  { date: '2026-09-06', time: '14:00', title: 'Dentista', desc: 'Control semestral', color: 'warning', badge: 'personal' },
  { date: '2026-09-07', time: '10:30', title: 'Deploy v2.0', desc: 'Release a producción', color: 'danger', badge: 'urgent' },
  { date: '2026-09-08', time: '11:00', title: '1:1 con manager', desc: 'Feedback trimestral', color: 'success', badge: 'work' },
  { date: '2026-09-09', time: '16:00', title: 'Workshop Vue', desc: 'Capacitación interna', color: 'secondary', badge: 'work' },
]

const agendaSelectedDate = ref('2026-09-06')

const agendaEvents = computed(() =>
  allAgendaEvents.filter((e) => e.date === agendaSelectedDate.value)
)

const agendaDots = computed(() =>
  allAgendaEvents.map((e) => ({ date: e.date, color: e.color }))
)

function onSelectDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  agendaSelectedDate.value = `${y}-${m}-${d}`
}

const newEvent = ref({
  title: '',
  date: '',
  time: '',
  category: 'work',
  desc: '',
})

const eventSaved = ref(false)

function createEvent() {
  if (!newEvent.value.title) return
  const colorMap: Record<string, string> = { work: 'primary', personal: 'warning', urgent: 'danger' }
  const badgeMap: Record<string, string> = { work: 'work', personal: 'personal', urgent: 'urgent' }
  allAgendaEvents.push({
    date: newEvent.value.date || '2026-09-06',
    time: newEvent.value.time || '12:00',
    title: newEvent.value.title,
    desc: newEvent.value.desc,
    color: colorMap[newEvent.value.category] || 'primary',
    badge: badgeMap[newEvent.value.category] || 'work',
  })
  newEvent.value = { title: '', date: '', time: '', category: 'work', desc: '' }
  eventSaved.value = true
  setTimeout(() => (eventSaved.value = false), 2500)
}
</script>

<template>
  <div class="tb-scene">
    <div class="tb-scene-header">
      <h3 class="tb-scene-title">Agenda</h3>
      <p class="tb-scene-desc">Calendario con eventos, badges de estado y acciones rápidas</p>
    </div>
    <div class="tb-agenda">
      <div class="tb-agenda-toolbar">
        <Input placeholder="Buscar evento…" style="max-width: 220px" />
        <div class="tb-agenda-toolbar-actions">
          <DropdownMenu color="neutral" variant="soft" label="Filtrar" :items="dropdownItems" />
        </div>
      </div>
      <div class="tb-agenda-split">
        <div class="tb-agenda-cal">
          <Calendar
            :model-value="agendaSelectedDate"
            :events="agendaDots"
            style="width: 100%"
            @select="onSelectDate"
          />
          <div class="tb-agenda-events">
            <h4 class="tb-agenda-section-title">Eventos del día ({{ agendaEvents.length }})</h4>
            <template v-if="agendaEvents.length > 0">
              <div v-for="event in agendaEvents" :key="event.time + event.title" class="tb-agenda-event">
                <div class="tb-agenda-event-time">{{ event.time }}</div>
                <div class="tb-agenda-event-content">
                  <div class="tb-agenda-event-header">
                    <span class="tb-agenda-event-title">{{ event.title }}</span>
                    <Badge :color="event.color" variant="soft">{{ event.badge }}</Badge>
                  </div>
                  <p class="tb-agenda-event-desc">{{ event.desc }}</p>
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
.tb-agenda {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tb-agenda-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.tb-agenda-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.tb-agenda-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.tb-agenda-cal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tb-agenda-events {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tb-agenda-section-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
}
.tb-agenda-event {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
}
.tb-agenda-event:last-child {
  margin-bottom: 0;
}
.tb-agenda-event-time {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  min-width: 3rem;
}
.tb-agenda-event-content {
  flex: 1;
}
.tb-agenda-event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.tb-agenda-event-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
}
.tb-agenda-event-desc {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0.25rem 0 0;
}
.tb-agenda-empty {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.5;
  padding: 1rem;
  text-align: center;
}
.tb-agenda-side {
  min-width: 0;
}
.tb-agenda-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tb-agenda-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.tb-agenda-form-actions {
  margin-top: 0.5rem;
}
</style>
            <p v-else class="tb-agenda-empty">No hay eventos para este día</p>
          </div>
        </div>
        <div class="tb-agenda-side">
          <h4 class="tb-agenda-section-title">Nuevo evento</h4>
          <div class="tb-agenda-form">
            <div class="tb-field">
              <Label label="Título" />
              <Input v-model="newEvent.title" placeholder="Nombre del evento" />
            </div>
            <div class="tb-agenda-form-row">
              <div class="tb-field">
                <Label label="Fecha" />
                <DatePicker v-model="newEvent.date" />
              </div>
              <div class="tb-field">
                <Label label="Hora" />
                <Input v-model="newEvent.time" placeholder="14:00" />
              </div>
            </div>
            <div class="tb-field">
              <Label label="Categoría" />
              <Select v-model="newEvent.category">
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
            <div class="tb-field">
              <Label label="Descripción" />
              <Textarea v-model="newEvent.desc" placeholder="Detalles del evento…" />
            </div>
            <div class="tb-agenda-form-actions">
              <Button color="primary" style="width: 100%" @click="createEvent">Crear evento</Button>
            </div>
            <Transition name="tb-fade">
              <Alert v-if="eventSaved" title="Evento creado" color="success">
                Se agregó a tu agenda.
              </Alert>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
