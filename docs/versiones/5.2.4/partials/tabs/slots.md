Hay un slot por pestaña y otro por ícono; el nombre sale de la `key` de cada item de `tabs`:

- `{key}` — contenido del panel de esa pestaña (en HTML plano: `slot="{key}"`).
- `tab-icon-{key}` — ícono de esa pestaña; sólo se usa cuando el item no trae el campo `icon`.

Se declaran tantos como items tenga `tabs`: si falta el slot, el panel se renderiza vacío.
