# BÚNKER WebXR

Experiencia WebXR de una instalación de seguridad corporativa construida con
Meta IWSDK, Three.js y TypeScript. El objetivo de entrega es Meta Quest 3; IWER
se utiliza para validación local, no como sustituto de una prueba física.

## Requisitos

- Node.js `22.12.0` (consulta [`.nvmrc`](.nvmrc)).
- Un navegador compatible con WebXR. Para emulación, Meta IWER e IWSDK CLI.

## Inicio local

```sh
npm install
npm run dev
```

El comando de desarrollo inicia el runtime administrado de IWSDK y abre el
navegador. Para detenerlo:

```sh
npm run dev:down
```

Comprobaciones de integración:

```sh
npm run typecheck
npm run build
```

## Estado funcional

- **FASE 1:** base de la experiencia IWSDK y composición de escena.
- **FASE 2:** seis estaciones, raycasting, locomoción, recorrido guiado y
  gafete interactivo.
- **FASE 3.3:** acceso y caseta originales en
  [`public/gltf/guard-access`](public/gltf/guard-access), con el nodo
  `VehicleBarrier` que consume `src/demo-system.ts`.
- **FASE 3.5:** tratamiento diurno, iluminación ambiental ligera y mejora
  arquitectónica limitada a la caseta/acceso vehicular.

La estructura y contratos de ejecución están documentados en
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). La evaluación visual preliminar
para revisión externa está en [`docs/VISUAL_AUDIT.md`](docs/VISUAL_AUDIT.md).

## Assets y licencias

La geometría de la caseta/acceso es original de BÚNKER. El inventario del GLB
declara el uso de *Granular Concrete* de Poly Haven bajo CC0 1.0 en
[`public/gltf/guard-access/LICENSES.md`](public/gltf/guard-access/LICENSES.md).
Los archivos de evaluación de terceros (incluido el paquete CGTrader) viven
solo en rutas locales ignoradas y no deben distribuirse ni reutilizarse.

## Publicación privada

Antes de un primer `push`, revisa
[`docs/REPOSITORY_AUDIT.md`](docs/REPOSITORY_AUDIT.md). El repositorio debe
permanecer privado mientras se verifican licencias, rendimiento en hardware y
material de presentación.
