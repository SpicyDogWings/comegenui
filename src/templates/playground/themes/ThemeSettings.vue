<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/information/Card.vue'
import Alert from '@/components/information/Alert.vue'
import Button from '@/components/buttons/Button.vue'
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import Textarea from '@/components/form/Textarea.vue'
import FileInput from '@/components/form/FileInput.vue'
import Autocomplete from '@/components/form/Autocomplete.vue'
import Switch from '@/components/form/Switch.vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Collapse from '@/components/overlay/Collapse.vue'
import FileInputZone from '@/components/form/FileInputZone.vue'

const isSaving = ref(false)
const showSaveSuccess = ref(false)

function handleSaveProfile() {
  isSaving.value = true
  showSaveSuccess.value = false
  setTimeout(() => {
    isSaving.value = false
    showSaveSuccess.value = true
  }, 800)
}
</script>

<template>
  <div class="tb-scene">
    <div class="tb-scene-header">
      <h3 class="tb-scene-title">Settings</h3>
      <p class="tb-scene-desc">Formulario de configuración con preferencias y campos</p>
    </div>
    <div class="tb-settings">
      <Card variant="ghost" title="Perfil" class="tb-settings-card tb-settings-profile">
        <div class="tb-settings-form">
          <div class="tb-settings-row">
            <div class="tb-field">
              <Label label="Nombre" />
              <Input placeholder="Tu nombre" />
            </div>
            <div class="tb-field">
              <Label label="Apellido" />
              <Input placeholder="Tu apellido" />
            </div>
          </div>
          <div class="tb-settings-row">
            <div class="tb-field">
              <Label label="Email" color="primary" />
              <Input placeholder="tu@email.com" color="primary" />
            </div>
            <div class="tb-field">
              <Label label="Teléfono" />
              <Input placeholder="+54 11 1234-5678" />
            </div>
          </div>
          <div class="tb-field">
            <Label label="Bio" />
            <Textarea placeholder="Contanos qué estás construyendo…" />
          </div>
          <div class="tb-settings-row">
            <div class="tb-field">
              <Label label="Rol" />
              <Select placeholder="Elegí…">
                <option value="dev">Developer</option>
                <option value="designer">Diseñador</option>
              </Select>
            </div>
            <div class="tb-field">
              <Label label="Ubicación" />
              <Autocomplete placeholder="¿Dónde estás?" />
            </div>
          </div>
          <div class="tb-field">
            <Label label="Avatar" />
            <FileInput placeholder="Adjuntá una imagen" accept="image/*" />
          </div>
          <div class="tb-settings-form-footer">
            <Checkbox label="Acepto los términos y condiciones" color="primary" />
            <div class="tb-settings-form-actions">
              <Button color="neutral" variant="ghost">Cancelar</Button>
              <Button color="primary" :loading="isSaving" @click="handleSaveProfile">
                {{ isSaving ? 'Guardando...' : 'Guardar' }}
              </Button>
            </div>
          </div>
          <Transition name="tb-fade">
            <Alert v-if="showSaveSuccess" title="Cambios guardados" color="success">
              Tu perfil se actualizó correctamente.
            </Alert>
          </Transition>
        </div>
      </Card>

      <Card variant="ghost" title="Preferencias" class="tb-settings-card tb-settings-prefs-card">
        <div class="tb-settings-prefs">
          <div class="tb-pref-section">
            <h4 class="tb-pref-title">Notificaciones</h4>
            <div class="tb-pref-row">
              <span class="tb-pref-label">Email</span>
              <Switch color="primary" :model-value="true" />
            </div>
            <div class="tb-pref-row">
              <span class="tb-pref-label">Push</span>
              <Switch />
            </div>
            <div class="tb-pref-row">
              <span class="tb-pref-label">WhatsApp</span>
              <Switch color="success" :model-value="true" />
            </div>
          </div>
          <div class="tb-pref-section">
            <h4 class="tb-pref-title">Privacidad</h4>
            <div class="tb-pref-row">
              <span class="tb-pref-label">Perfil público</span>
              <Checkbox color="primary" :model-value="true" />
            </div>
            <div class="tb-pref-row">
              <span class="tb-pref-label">Compartir métricas</span>
              <Checkbox color="success" :model-value="true" />
            </div>
          </div>
          <div class="tb-pref-section">
            <h4 class="tb-pref-title">Archivos</h4>
            <FileInputZone placeholder="Arrastrá archivos acá, o hacé clic para elegir" />
          </div>
          <Collapse label="Zona de peligro" color="danger" :default-open="true" class="tb-settings-collapse">
            <div class="tb-over-options">
              <div class="tb-over-option-row">
                <div>
                  <span class="tb-over-option-title">Desactivar cuenta</span>
                  <span class="tb-over-option-desc">Tu cuenta se ocultará temporalmente</span>
                </div>
                <Button color="danger" variant="outlined" size="sm">Desactivar</Button>
              </div>
              <div class="tb-over-option-row">
                <div>
                  <span class="tb-over-option-title">Eliminar datos</span>
                  <span class="tb-over-option-desc">Borrar toda tu información permanentemente</span>
                </div>
                <Switch color="danger" />
              </div>
            </div>
          </Collapse>
        </div>
      </Card>
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
.tb-settings {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
}
.tb-settings-card {
  padding: 1.25rem;
}
.tb-settings-profile {
  min-width: 0;
}
.tb-settings-prefs-card {
  min-width: 0;
}
.tb-settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tb-settings-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.tb-settings-form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
.tb-settings-form-actions {
  display: flex;
  gap: 0.5rem;
}
.tb-settings-collapse {
  margin-top: 1rem;
}
.tb-settings-prefs {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.tb-pref-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tb-pref-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
}
.tb-pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0;
}
.tb-pref-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}
.tb-over-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.tb-over-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.tb-over-option-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
}
.tb-over-option-desc {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}
</style>
