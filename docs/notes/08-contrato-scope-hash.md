# Nota 08 — El contrato incluye el hash de scope (`data-v-*`) y genera falsos "ROTO"

**Fecha:** 2026-10-06
**Severidad:** Baja (ruido en el gate, no rompe nada)
**Estado:** Resuelto (2026-10-06)

## Problema

`scripts/contract.mjs` arma la huella del shadow DOM con **todos** los atributos salvo
`class` (`fingerprint()`):

```js
const attrs = [...el.attributes].map((a) => a.name).filter((n) => n !== "class").sort();
```

Entre esos atributos está el hash de estilos scoped de Vue (`data-v-xxxxxxxx`), que
depende del **contenido del SFC**. Entonces:

- Cualquier edición a un `.vue` / `.ce.vue` cambia su hash de scope.
- El paso `--contrato` marca el componente como `ROTO` aunque la **estructura** no haya
  cambiado (misma jerarquía, mismas clases).
- Hay que regenerar el baseline en cada edición:
  `node scripts/contract.mjs --update --solo <tag>`.

## Impacto

- Ruido: el diff del baseline es sólo el hash (p. ej. `cu-alert`, `cu-select`).
- Riesgo de "regenerar para que pase": si se hace a ciegas, un cambio **real** de
  estructura en el mismo commit puede pasar desapercibido. Hay que revisar el diff.

## Resolución (2026-10-06)

Se excluyen los atributos de scope del fingerprint (los `data-v-*` son internos de Vue, no
parte del contrato que ve el consumidor del zip):

```js
const attrs = [...el.attributes].map((a) => a.name)
  .filter((n) => n !== "class" && !/^data-v-/.test(n))
  .sort();
```

Se regeneró todo `scripts/contract-baseline/` una única vez (los baselines dejan de
contener el hash). A partir de ahora, editar un SFC **no** marca su contrato como `ROTO`
salvo que cambie de verdad la estructura (tags / clases / atributos).
