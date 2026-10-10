# Arquitectura de BÚNKER WebXR

## Arranque y composición

`iwsdk.config.json` es la autoridad del proyecto: declara el manifiesto de
assets (`src/assets.ts`), los componentes (`src/components.ts`) y la escena
[`public/scenes/main.iwsdk.scene.json`](../public/scenes/main.iwsdk.scene.json).
`src/index.ts` crea el `World` de IWSDK y registra `RobotSystem`, `PanelSystem`,
`ExperienceSystem` y `DemoSystem`.

La escena compone el entorno, la base procedimental `facility-base`, el GLB
`guard-access`, el gafete y seis instancias `station-*`. La iluminación diurna
de FASE 3.5 usa `DomeGradient`, `IBLGradient`, una luz direccional y luz
hemisférica: no depende de luces exportadas desde Blender.

## Assets y Blender

`src/assets.ts` resuelve los recursos con rutas públicas deterministas. La
instalación general sigue siendo geometría procedimental en
`src/scene-assets/facility-base.scene-asset.ts`; la zona de caseta/acceso se
carga como `public/gltf/guard-access/guard-access.glb`.

El GLB se modela y exporta en una escena de trabajo de Blender separada. Para
preservar el contrato de ejecución, debe conservar el nodo llamado exactamente
`VehicleBarrier`; `DemoSystem` lo localiza con `getObjectByName` y anima su
pivote. No se usa `GLTFLoader` directamente ni se importan APIs de `three`
fuera de los paquetes admitidos por IWSDK.

## Interacción

`ExperienceSystem` configura las seis estaciones: vehículo, caseta, peatón,
recepción, corredor y monitoreo. Sus paneles UIKitML responden a
`RayInteractable`; el recorrido guiado actualiza el componente `Experience`.
El gafete tiene `RayInteractable` y `OneHandGrabbable`. La locomoción usa el
worker de IWSDK; físicas, scene understanding y environment raycast siguen
desactivados en la configuración actual.

`DemoSystem` coordina la demostración de cada estación y mantiene la barrera
vehicular. Cualquier reemplazo visual debe mantener ids de escena, estaciones,
gafete y el contrato `VehicleBarrier` para no romper FASE 2.

## Flujo de validación

Ejecuta `npm run typecheck` y `npm run build`. Para el runtime, inicia
`npm run dev`, valida en IWER la carga de escena, raycasting, recorrido guiado
y el ciclo de la barrera. IWER reduce riesgos de integración; rendimiento,
comodidad y calidad visual finales requieren una prueba en Quest 3 físico.
