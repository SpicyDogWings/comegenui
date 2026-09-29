import { describe, it, expect } from 'vitest'
import {
  isAlign,
  isColor,
  isColorBase,
  isDateMode,
  isFieldVariant,
  isModalSize,
  isPosition,
  isSize,
  isSizeSm,
  isTarget,
  isVariantFull,
  oneOf,
} from './validators'

describe('utils/validators — oneOf', () => {
  it('acepta solo los valores del set', () => {
    const isAbc = oneOf(['a', 'b', 'c'] as const)
    expect(isAbc('a')).toBe(true)
    expect(isAbc('c')).toBe(true)
    expect(isAbc('d')).toBe(false)
    expect(isAbc('')).toBe(false)
    expect(isAbc(null)).toBe(false)
    expect(isAbc(1)).toBe(false)
  })
})

describe('utils/validators — validadores con nombre', () => {
  it('isColor / isColorBase', () => {
    expect(isColor('secondary')).toBe(true)
    expect(isColorBase('secondary')).toBe(false)
    expect(isColorBase('primary')).toBe(true)
  })

  it('isVariantFull incluye link/none y isFieldVariant no', () => {
    expect(isVariantFull('link')).toBe(true)
    expect(isVariantFull('none')).toBe(true)
    expect(isFieldVariant('none')).toBe(false)
    expect(isFieldVariant('ghost')).toBe(true)
  })

  it('sizes, position, align y target', () => {
    expect(isSize('lg')).toBe(true)
    expect(isSizeSm('lg')).toBe(false)
    expect(isPosition('top')).toBe(true)
    expect(isAlign('center')).toBe(true)
    expect(isTarget('_blank')).toBe(true)
    expect(isTarget('blank')).toBe(false)
  })

  it('modal size y date mode', () => {
    expect(isModalSize('full')).toBe(true)
    expect(isModalSize('md')).toBe(true)
    expect(isModalSize('xxl')).toBe(false)
    expect(isDateMode('range')).toBe(true)
    expect(isDateMode('multiple')).toBe(false)
  })
})
