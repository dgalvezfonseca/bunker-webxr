# Auditoría de publicación, seguridad y licencias

Fecha de revisión: 2026-10-09.

## Estado Git y GitHub

El directorio contiene un repositorio Git inicial, sin commits ni remotos. Se
conservó esa condición y se corrigió su configuración local de árbol de trabajo
para permitir la auditoría. GitHub CLI está instalado, pero la credencial activa
de GitHub no es válida; no se creó repositorio ni se realizó push.

Cuando la autenticación se renueve y el propietario apruebe la lista final, el
destino previsto es un repositorio **privado** llamado `bunker-webxr`. No debe
cambiarse la visibilidad de ningún repositorio existente.

## Material que se publicaría

- Código TypeScript bajo `src/`, escena y recursos bajo `public/`.
- Configuración de IWSDK, Vite, TypeScript y paquetes.
- Instrucciones de proyecto y archivos de workflow/versionado que no contengan
  secretos.
- Documentación de arquitectura, auditoría y cuatro capturas propias de FASE
  3.5 para revisión privada.
- `guard-access.glb` original de BÚNKER y su inventario CC0.

## Exclusiones obligatorias

`.gitignore` excluye dependencias, `dist`, runtime `.iwsdk`, certificados y
claves, variables de entorno, registros, respaldos de Blender, archivos
temporales, artefactos locales, herramientas de agentes y archivos comprimidos.

Se encontraron seis archivos `.7z` de evaluación CGTrader bajo `.codex/`,
incluidos `Guardhouse.7z`, `Automatic_Barrier.7z`, `Bollard.7z`, `Intercom.7z`,
`Island.7z` y `Lamp.7z`. Permanecen fuera de la publicación y no deben
incorporarse al producto público ni procesarse mientras persistan sus
restricciones de licencia.

El certificado de desarrollo `.iwsdk/https/_cert.pem` también queda excluido.
Antes de publicar, debe repetirse una búsqueda de secretos sobre el índice
propuesto y revisarse que solo se agreguen los archivos listados arriba.
