import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Calendar from './Calendar.vue'

const dayButton = (w: VueWrapper, n: number) =>
  w.findAll('.cu-calendar-day').find((d) => d.text() === String(n))

const gridLabel = (w: VueWrapper) => w.find('.cu-calendar').attributes('aria-label') ?? ''
const sliderText = (w: VueWrapper) => w.find('.cu-month-slider').text().toLowerCase()

describe('Calendar — selección', () => {
  it('click en un día emite update:modelValue/change/select', async () => {
    const w = mount(Calendar)
    const day = dayButton(w, 15)
    expect(day).toBeTruthy()
    await day!.trigger('click')
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })

  it('no emite al clickear un día deshabilitado por disabledDates', async () => {
    // Deshabilita todos los días del mes visible salvo el 15 no sirve para
    // aislar; deshabilitamos el 10 puntual de un mes fijo.
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-01', disabledDates: '2026-08-10' },
    })
    const disabled = dayButton(w, 10)
    await disabled!.trigger('click')
    expect(w.emitted('select')).toBeFalsy()
  })
})

describe('Calendar — modo rango', () => {
  it('primer click inicio, segundo fin, y emite el rango', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.emitted('update:rangeStart')).toBeTruthy()
    expect(w.emitted('select')).toBeFalsy()
    await dayButton(w, 20)!.trigger('click')
    expect(w.emitted('update:rangeEnd')).toBeTruthy()
    const selected = w.emitted('select')
    expect(selected).toBeTruthy()
    expect((selected![0]![0] as { start: Date; end: Date }).start.getDate()).toBe(10)
    expect((selected![0]![0] as { start: Date; end: Date }).end.getDate()).toBe(20)
    expect(w.emitted('change')).toBeTruthy()
  })

  it('no emite update:modelValue al clickear en modo rango', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.emitted('update:modelValue')).toBeFalsy()
  })

  it('pinta el rango con range-start/range-end', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(1)
    await dayButton(w, 20)!.trigger('click')
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(1)
    expect(w.findAll('.cu-calendar-day--range-end')).toHaveLength(1)
    expect(w.findAll('.cu-calendar-day--range').length).toBeGreaterThan(1)
  })
})

describe('Calendar — single ignora el rango', () => {
  it('no pinta clases de rango con rangeStart/rangeEnd', () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-01', rangeStart: '2026-08-05', rangeEnd: '2026-08-20' },
    })
    expect(w.findAll('.cu-calendar-day--range')).toHaveLength(0)
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(0)
    expect(w.findAll('.cu-calendar-day--range-end')).toHaveLength(0)
  })
})

describe('Calendar — viewMonth', () => {
  it('modo controlado: navegar emite update:viewMonth', async () => {
    const w = mount(Calendar, { props: { viewMonth: '2026-03-15' } })
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('marzo')
    await (w.vm as any).nextMonth()
    const emitted = w.emitted('update:viewMonth')
    expect(emitted).toBeTruthy()
    expect((emitted![0][0] as Date).getMonth()).toBe(3)
    expect((emitted![0][0] as Date).getDate()).toBe(1)
  })

  it('modo controlado: la prop manda sobre modelValue', () => {
    const w = mount(Calendar, {
      props: { viewMonth: '2026-03-15', modelValue: '2026-09-20' },
    })
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('marzo')
  })

  it('modo no controlado: navegar cambia el mes sin emitir update:viewMonth', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-03-15' } })
    await (w.vm as any).nextMonth()
    expect(w.emitted('update:viewMonth')).toBeFalsy()
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('abril')
  })
})

describe('Calendar — setValue respeta los días deshabilitados', () => {
  it('no selecciona un día anterior a min ni posterior a max', async () => {
    const w = mount(Calendar, { props: { min: '2026-08-10', max: '2026-08-20' } })
    ;(w.vm as unknown as { setValue: (v: string) => void }).setValue('2026-08-05')
    await nextTick()
    expect(w.emitted('change')).toBeFalsy()
    expect((w.vm as unknown as { getValue: () => Date | null }).getValue()).toBeNull()

    ;(w.vm as unknown as { setValue: (v: string) => void }).setValue('2026-08-15')
    await nextTick()
    expect(w.emitted('change')).toBeTruthy()
    expect(
      (w.vm as unknown as { getValue: () => Date | null }).getValue()?.getDate(),
    ).toBe(15)
  })

  it('no selecciona un día de la semana deshabilitado ni una fecha puntual', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-01', disabledWeekdays: '0,6', disabledDates: '2026-08-12' },
    })
    const vm = w.vm as unknown as { setValue: (v: string) => void; getValue: () => Date | null }
    vm.setValue('2026-08-16') // domingo
    vm.setValue('2026-08-12') // fecha puntual
    await nextTick()
    expect(w.emitted('change')).toBeFalsy()
    expect(vm.getValue()?.getDate()).toBe(1)
  })
})

describe('Calendar — clear es solo de rango', () => {
  it('en single no emite un change con forma de rango', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-11' } })
    ;(w.vm as unknown as { clear: () => void }).clear()
    await nextTick()
    expect(w.emitted('change')).toBeFalsy()
    expect(w.emitted('update:modelValue')).toBeFalsy()
  })
})

describe('Calendar — mes inicial del rango', () => {
  it('con rangeStart abre en el mes de esa fecha, no en el actual', () => {
    const w = mount(Calendar, { props: { mode: 'range', rangeStart: '2026-03-10' } })
    expect(sliderText(w)).toContain('marzo')
    expect(gridLabel(w).toLowerCase()).toContain('marzo')
  })

  it('sin valor abre en el mes actual', () => {
    const w = mount(Calendar)
    const now = new Date()
    const expected = new Intl.DateTimeFormat('es', { month: 'long' }).format(now)
    expect(sliderText(w)).toContain(expected.toLowerCase())
  })
})

describe('Calendar — viewMonth controlado se recorta a min/max', () => {
  it('el header y la grilla muestran el mes del límite', () => {
    const w = mount(Calendar, { props: { viewMonth: '2026-01-15', min: '2026-06-01' } })
    expect(sliderText(w)).toContain('junio')
    expect(gridLabel(w).toLowerCase()).toContain('junio')
    expect(gridLabel(w).toLowerCase()).not.toContain('enero')
  })
})

describe('Calendar — eventos', () => {
  it('un evento con fecha inválida no rompe la grilla', () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-11', events: [{ date: 'no-es-fecha' }] },
    })
    expect(w.findAll('.cu-calendar-day').length).toBe(31)
    expect(w.findAll('.cu-calendar-dot')).toHaveLength(0)
  })

  it('un color no string no rompe la grilla', () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-11', events: [{ date: '2026-08-11', color: 5 as unknown as string }] },
    })
    expect(w.findAll('.cu-calendar-day').length).toBe(31)
    expect(w.findAll('.cu-calendar-dot')).toHaveLength(1)
  })

  it('pinta un punto por evento del día', () => {
    const w = mount(Calendar, {
      props: {
        modelValue: '2026-08-11',
        events: [
          { date: '2026-08-11', color: 'primary' },
          { date: '2026-08-11', color: 'danger' },
          { date: '2026-08-12' },
        ],
      },
    })
    expect(w.findAll('.cu-calendar-dot')).toHaveLength(3)
  })
})

describe('Calendar — ARIA de la grilla', () => {
  it('marca el día seleccionado con aria-selected y nombra cada día con la fecha completa', () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-15' } })
    const selected = w.find('.cu-calendar-day--selected')
    expect(selected.attributes('aria-selected')).toBe('true')
    expect(selected.attributes('aria-label')?.toLowerCase()).toContain('15 de agosto de 2026')
    const other = dayButton(w, 16)!
    expect(other.attributes('aria-selected')).toBe('false')
    expect(other.attributes('aria-label')?.toLowerCase()).toContain('16 de agosto de 2026')
  })

  it('los encabezados de día son columnheader con el nombre completo', () => {
    const w = mount(Calendar)
    const headers = w.findAll('.cu-calendar-weekday')
    expect(headers).toHaveLength(7)
    expect(headers[0]!.attributes('role')).toBe('columnheader')
    expect(headers[0]!.attributes('aria-label')?.toLowerCase()).toBe('lunes')
  })

  it('las celdas vacías completan la fila de la grilla', () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-01' } })
    const empties = w.findAll('.cu-calendar-day--empty')
    expect(empties.length).toBeGreaterThan(0)
    expect(empties[0]!.attributes('role')).toBe('gridcell')
    expect(empties[0]!.attributes('aria-disabled')).toBe('true')
  })

  it('un día deshabilitado es un button disabled, se anuncia y no se selecciona', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-01', min: '2026-08-10' } })
    const day = dayButton(w, 5)!
    expect(day.attributes('disabled')).toBeDefined()
    expect(day.attributes('aria-disabled')).toBe('true')
    await day.trigger('click')
    expect(w.emitted('select')).toBeFalsy()
  })

  it('un solo día es tab-stop: el seleccionado', () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-15' } })
    const stops = w.findAll('.cu-calendar-day').filter((d) => d.attributes('tabindex') === '0')
    expect(stops).toHaveLength(1)
    expect(stops[0]!.text()).toBe('15')
  })

  it('sin selección el tab-stop es el primer día habilitado del mes', () => {
    const w = mount(Calendar, { props: { viewMonth: '2026-08-01', min: '2026-08-10' } })
    const stops = w.findAll('.cu-calendar-day').filter((d) => d.attributes('tabindex') === '0')
    expect(stops).toHaveLength(1)
    expect(stops[0]!.text()).toBe('10')
  })
})

describe('Calendar — teclado', () => {
  const press = async (w: VueWrapper, day: number, key: string) => {
    const button = dayButton(w, day)!
    ;(button.element as HTMLElement).focus()
    await button.trigger('keydown', { key })
    await flushPromises()
    return document.activeElement?.textContent?.trim()
  }

  it('las flechas mueven el foco un día / una semana', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-11' }, attachTo: document.body })
    expect(await press(w, 11, 'ArrowRight')).toBe('12')
    expect(await press(w, 12, 'ArrowLeft')).toBe('11')
    expect(await press(w, 11, 'ArrowDown')).toBe('18')
    expect(await press(w, 18, 'ArrowUp')).toBe('11')
    w.unmount()
  })

  it('Home y End van al borde de la semana (weekStart lunes)', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-12' }, attachTo: document.body })
    expect(await press(w, 12, 'Home')).toBe('10')
    expect(await press(w, 10, 'End')).toBe('16')
    w.unmount()
  })

  it('PageDown pasa al mes siguiente con el mismo día', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-11' }, attachTo: document.body })
    const focused = await press(w, 11, 'PageDown')
    expect(focused).toBe('11')
    expect(sliderText(w)).toContain('septiembre')
    expect(gridLabel(w).toLowerCase()).toContain('septiembre')
    w.unmount()
  })

  it('PageUp vuelve al mes anterior', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-11' }, attachTo: document.body })
    expect(await press(w, 11, 'PageUp')).toBe('11')
    expect(sliderText(w)).toContain('julio')
    w.unmount()
  })

  it('el teclado no sale de min/max', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-15', min: '2026-08-01', max: '2026-08-15' },
      attachTo: document.body,
    })
    expect(await press(w, 15, 'ArrowRight')).toBe('15')
    expect(gridLabel(w).toLowerCase()).toContain('agosto')
    w.unmount()
  })

  it('el teclado saltea un día deshabilitado', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-11', disabledDates: '2026-08-12' },
      attachTo: document.body,
    })
    expect(dayButton(w, 12)!.attributes('disabled')).toBeDefined()
    expect(await press(w, 11, 'ArrowRight')).toBe('13')
    expect(await press(w, 13, 'ArrowLeft')).toBe('11')
    w.unmount()
  })

  it('el teclado saltea un bloque de días deshabilitados (fines de semana)', async () => {
    // 2026-08-14 es viernes; sábado 15 y domingo 16 deshabilitados.
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-14', disabledWeekdays: '0,6' },
      attachTo: document.body,
    })
    expect(await press(w, 14, 'ArrowRight')).toBe('17')
    expect(await press(w, 17, 'ArrowLeft')).toBe('14')
    w.unmount()
  })

  it('Home y End saltean los bordes de la semana deshabilitados', async () => {
    // Semana del 10 al 16 de agosto: domingo 16 deshabilitado.
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-12', disabledWeekdays: '0' },
      attachTo: document.body,
    })
    expect(await press(w, 12, 'Home')).toBe('10')
    expect(await press(w, 10, 'End')).toBe('15')
    w.unmount()
  })

  it('PageDown cae en el día habilitado más cercano del mes siguiente', async () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-15', disabledDates: '2026-09-15' },
      attachTo: document.body,
    })
    const focused = await press(w, 15, 'PageDown')
    expect(focused).toBe('16')
    expect(gridLabel(w).toLowerCase()).toContain('septiembre')
    w.unmount()
  })

  it('si el mes entero está deshabilitado, ningún día es tab-stop', () => {
    const w = mount(Calendar, {
      props: { viewMonth: '2026-08-01', disabledWeekdays: '0,1,2,3,4,5,6' },
    })
    const days = w.findAll('.cu-calendar-day')
    expect(days.length).toBeGreaterThan(0)
    expect(days.filter((d) => d.attributes('tabindex') === '0')).toHaveLength(0)
  })
})

describe('Calendar — locale y estado deshabilitado', () => {
  it('con locale en, los encabezados y el nombre del día van en inglés', () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-15', locale: 'en' } })
    expect(w.findAll('.cu-calendar-weekday')[0]!.text()).toBe('Mon')
    expect(
      w.find('.cu-calendar-day--selected').attributes('aria-label')?.toLowerCase(),
    ).toContain('august')
  })

  it('con el calendario deshabilitado no hay ningún día en el orden de tabulación', () => {
    const w = mount(Calendar, { props: { modelValue: '2026-08-15', disabled: true } })
    const days = w.findAll('.cu-calendar-day')
    expect(days.filter((d) => d.attributes('tabindex') === '0')).toHaveLength(0)
    expect(days.filter((d) => d.attributes('disabled') !== undefined)).toHaveLength(days.length)
  })

  it('el día de hoy lleva aria-current="date"', () => {
    const w = mount(Calendar)
    const today = w.find('.cu-calendar-day--today')
    expect(today.exists()).toBe(true)
    expect(today.attributes('aria-current')).toBe('date')
  })
})

describe('Calendar — el tab-stop respeta los días deshabilitados', () => {
  it('si la fecha seleccionada está deshabilitada, el tab-stop es el primer día habilitado', () => {
    const w = mount(Calendar, {
      props: { viewMonth: '2026-08-01', modelValue: '2026-08-05', min: '2026-08-10' },
    })
    const stops = w.findAll('.cu-calendar-day').filter((d) => d.attributes('tabindex') === '0')
    expect(stops).toHaveLength(1)
    expect(stops[0]!.text()).toBe('10')
  })
})
