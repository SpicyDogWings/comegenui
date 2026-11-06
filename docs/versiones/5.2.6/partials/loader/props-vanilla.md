|Atributo|Tipo|Default|Descripción|
|---|---|---|---|
|`color`|`"primary" \|"secondary" \|"neutral" \|"success" \|"warning" \|"danger"`|`"primary"`|Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`|
|`animation`|`"loading" \|"cooldown"`|`"loading"`|`loading` (barrido infinito) o `cooldown` (se consume una vez en `delay` ms)|
|`delay`|`number`|`2000`|Milisegundos que tarda en vaciarse `cooldown` (se ignora en `loading`)|
