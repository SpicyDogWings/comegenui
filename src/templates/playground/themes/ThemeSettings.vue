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
