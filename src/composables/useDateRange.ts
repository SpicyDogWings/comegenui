// src/composables/useDateRange.ts
// FSM de selección de rango (2 clicks): primer click = inicio, segundo = fin
// (con swap si el fin es anterior). La usan Calendar (modo `range`) y el
// DualCalendar (que sólo comparte el mismo rango entre sus 2 Calendar).
//
// `pickingEnd` se deriva del valor (`start` seteado y `end` vacío) en lugar de
// ser un flag aparte: así dos Calendar que comparten `rangeStart`/`rangeEnd`
// cooperan (el segundo click, en cualquiera de los dos, completa el rango).

import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { parseDate } from '@/utils/date'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface UseDateRangeOptions {
  /** Getter de la prop de inicio (para sincronizar desde afuera). */
  start?: () => string | number | Date | null
  /** Getter de la prop de fin (para sincronizar desde afuera). */
  end?: () => string | number | Date | null
  /** Se dispara cuando cambia el inicio (→ `update:rangeStart`). */
  onStartChange?: (value: Date | null) => void
  /** Se dispara cuando cambia el fin (→ `update:rangeEnd`). */
  onEndChange?: (value: Date | null) => void
  /** Rango completo (→ `change`). También al limpiar y al `setRange`. */
  onChange?: (range: DateRange) => void
  /** Rango cerrado por el usuario (→ `select`). No se dispara al limpiar. */
  onSelect?: (range: DateRange) => void
}

export interface UseDateRange {
  startValue: Ref<Date | null>
  endValue: Ref<Date | null>
  /** `true` cuando hay inicio pero falta el fin: el próximo click completa. */
  pickingEnd: ComputedRef<boolean>
  /** Click en un día: inicia o completa el rango. */
  select: (day: Date) => void
  /** Limpia el rango y emite el cambio. */
  clear: () => void
  /** Setea el rango completo y emite el cambio. */
  setRange: (start: string | number | Date | null, end: string | number | Date | null) => void
}

export function useDateRange(options: UseDateRangeOptions = {}): UseDateRange {
  const startValue = ref<Date | null>(parseDate(options.start?.() ?? null))
  const endValue = ref<Date | null>(parseDate(options.end?.() ?? null))

  const pickingEnd = computed(() => startValue.value !== null && endValue.value === null)

  watch(
    () => options.start?.(),
    (value) => {
      startValue.value = parseDate(value)
    },
  )
  watch(
    () => options.end?.(),
    (value) => {
      endValue.value = parseDate(value)
    },
  )

  function select(day: Date) {
    if (!pickingEnd.value) {
      // Primer click (o reinicio tras un rango completo): arranca el rango.
      // Si había un fin previo, se descarta.
      const hadEnd = endValue.value !== null
      startValue.value = day
      endValue.value = null
      options.onStartChange?.(day)
      if (hadEnd) options.onEndChange?.(null)
      return
    }

    // Segundo click: cierra el rango (con swap si el fin es anterior).
    if (day.getTime() < (startValue.value as Date).getTime()) {
      endValue.value = startValue.value
      startValue.value = day
      options.onStartChange?.(day)
      options.onEndChange?.(endValue.value)
    } else {
      endValue.value = day
      options.onEndChange?.(day)
    }
    const range = { start: startValue.value, end: endValue.value }
    options.onSelect?.(range)
    options.onChange?.(range)
  }

  function clear() {
    startValue.value = null
    endValue.value = null
    options.onStartChange?.(null)
    options.onEndChange?.(null)
    options.onChange?.({ start: null, end: null })
  }

  function setRange(
    start: string | number | Date | null,
    end: string | number | Date | null,
  ) {
    startValue.value = parseDate(start)
    endValue.value = parseDate(end)
    options.onStartChange?.(startValue.value)
    options.onEndChange?.(endValue.value)
    options.onChange?.({ start: startValue.value, end: endValue.value })
  }

  return { startValue, endValue, pickingEnd, select, clear, setRange }
}
