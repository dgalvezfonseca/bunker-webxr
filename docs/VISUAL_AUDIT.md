# Auditoría visual preliminar — FASE 3.5

## Evidencia incluida

Estas capturas propias se generaron en IWER y se incluyen para revisión privada:

- [Antes: acceso oscuro](visuals/phase35-before-hero.png)
- [Después: exterior diurno](visuals/phase35-final-hero.png)
- [Acceso a altura humana](visuals/phase35-human-height.png)
- [Detalle cercano de la caseta](visuals/phase35-booth-closeup.png)

## Hallazgos

La mejora se concentra en caseta y acceso vehicular: fondo diurno con gradiente,
iluminación ambiente coherente, cubierta plana, cristales amplios con marcos
oscuros, concreto PBR claro, pavimento, bordillos y jardineras de bajo costo.
La composición ya comunica un acceso corporativo moderno y evita la lectura de
maqueta oscura de la captura base.

El GLB mantiene geometría original de BÚNKER y texturas de concreto CC0
documentadas en `public/gltf/guard-access/LICENSES.md`. No incorpora geometría,
UV, texturas ni derivados del paquete CGTrader evaluado localmente.

## Métricas observadas en IWER

| Medida | Base | FASE 3.5 |
| --- | ---: | ---: |
| Triángulos de escena | 3,938 | 3,988 |
| Meshes de escena | 116 | 130 |
| Draw calls | 117 | 107 |
| Texturas | 14 | 13 |
| GLB de caseta | — | 3.14 MB |

La caseta/acceso contiene aproximadamente 2,720 triángulos, 76 meshes y 12
materiales. Las métricas son lecturas del emulador y no presupuesto final de
GPU para Quest 3.

## Limitaciones y siguientes comprobaciones

- No hay HDRI pesado, lightmaps ni sombras dinámicas; se usa iluminación
  direccional/hemisférica y geometría de contacto para proteger el presupuesto
  móvil.
- Transparencias, exposición, legibilidad de señalética y térmicas deben
  revisarse en Quest 3 físico.
- Recepción, corredor y monitoreo conservan la geometría de FASE 2 por alcance;
  su estética sigue siendo más procedimental que la del acceso.
- El recorrido completo y cada interacción deben repetirse en dispositivo tras
  cualquier cambio de runtime; la evidencia actual es una validación de carga,
  estación y barrera en IWER, no una certificación física.
