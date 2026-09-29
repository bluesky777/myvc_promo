# Encargo: voz, un tercio más cortos y advertencias (2026-09-29)

Decisiones de Joseth, tomadas y cerradas: los vídeos de ayuda llevan **voz sintética**
(es-CO-SalomeNeural, ya montada) y **efectos**; tienen que ser **un tercio más cortos** (mediana de
62 s → unos 40 s); y deben **advertir de los errores graves** (`ADVERTENCIAS-AYUDA.md`).

## Lo que ya está hecho (no tocarlo)

- `src/ayuda/voz.tsx`: `Voz`, `Efecto`, `huella`, `segundosDeVoz`, `RETRASO_VOZ`, `RESPIRO_VOZ`.
- `Marco` dice en voz alta cada paso (`paso.voz ?? paso.texto`), 6 fotogramas después del rótulo.
- `Tarjeta` suena y dice `cierre.voz ?? cierre.despues ?? cierre.seVe`.
- `Cursor` (src/comunes) hace sonar cada `clics` sólo en composiciones `Ayuda-*`.
- `compruebaElGuion`: si el texto ya tiene voz, el paso tiene que durar
  `6 + voz + 6` fotogramas (+30 si es `rojo`). Si no cabe, el guion lanza al cargarse.
- `node tools/voz.mjs <carpeta>/` genera las voces que falten de los guiones cuya ruta contenga
  ese texto y actualiza `src/ayuda/voces.json`. Ejemplo: `node tools/voz.mjs src/ayuda/cartera/`.

## Por cada vídeo

1. Lee su `guion.ts` y su `Escena.tsx` (por trozos). Mide la duración actual (`DURACION`).
2. **Textos.** El rótulo sigue siendo corto. Si el rótulo tiene abreviaturas o símbolos que no se
   leen bien en voz alta («Aus, Tard», «9°B», «▸», «%»), pon en el paso un `voz:` con la versión
   hablada. Frases de 6–12 palabras: cada paso dura lo que tarda en decirse.
3. **Advertencias.** Mete las de ese vídeo que están en `ADVERTENCIAS-AYUDA.md`. Lo irreversible va
   en un paso con `rojo: true`. Una advertencia es una frase, en imperativo y con la alternativa
   («No lo borres: desmatricúlalo.»). No inventes advertencias sobre la aplicación: si dudas de un
   comportamiento, no lo afirmes y dilo en tu informe.
4. **Voz.** `node tools/voz.mjs src/ayuda/<carpeta>/`. Después, `npx tsc --noEmit`, y carga el
   guion (con `npx remotion still <Composición> /tmp/x.png --frame=0` basta) para que la puerta diga
   qué pasos no caben.
5. **Recorta el tiempo** hasta que la `DURACION` quede en unos **2/3 de la actual**, sin romper la
   puerta: acorta los viajes del puntero (12–20 fotogramas por trayecto bastan), las pausas
   muertas, las entradas lentas y los pasos que repiten una idea. **Se conserva siempre el camino
   por el menú** (es la mitad del encargo). No se tocan los tiempos que imitan a la aplicación y
   que el guion defiende con una puerta propia (p. ej. los 105 fotogramas del lote en la planilla).
   Mueve `TARJETA`, `DURACION` y `CAPITULOS` a la vez. Todo lo que dependa de un tiempo
   (foco, `focoHasta`, clics, avisos, secuencias) tiene que moverse con él.
6. **Efectos.** Los clics ya suenan solos. Añade con `<Efecto cual="tecla1|tecla2|tecla3" en={…} />`
   el tecleo (alternando las tres) donde se escriba, y `<Efecto cual="aviso" en={…} />` cuando
   salga un aviso o mensaje de la aplicación. Nada más: sin música, sin «whoosh» en cada cambio.
7. **Render**: `tools/render-solo.sh <Composición> out/ayuda/<clave>.mp4` (cola de dos plazas,
   compartida con otros agentes: espera, no lo saltes). Tiene que salir **0 PARPADEOS**.
8. **Mira** 4–6 fotogramas (`npx remotion still`, y lee el PNG) en los momentos que moviste:
   el foco y el puntero tienen que señalar lo que dice el rótulo, y ningún rótulo puede hablar de
   algo que todavía no está o ya no está en pantalla.

## Reglas que no se reabren

- Datos, nombres y fotos siempre inventados; el colegio es Los Almendros; las caras son el Avatar.
- app2 es sólo lectura (está en `/Users/josethguerrero/DESARROLLOS/myvc_front`).
- **Sólo editas las carpetas de tus vídeos.** Los ficheros compartidos (`src/ayuda/*.tsx|ts`,
  `src/comunes/`, `src/notas/`, `src/ayuda/moverse/`, `src/ayuda/secretaria/`, `src/ayuda/colegio/`
  y cualquier carpeta que importe un vídeo que no es tuyo; compruébalo con `grep -rl`) no se tocan:
  si hace falta cambiar uno, dilo en el informe.
- No toques `CATALOGO-AYUDA.json`, `src/Root.tsx` ni `package.json` (salvo el encargo del vídeo
  nuevo). El catálogo se regenera al final desde los guiones.
- Nada de `git add`, commit ni stash. Hay otras sesiones en el repo.

## Informe (lo último que escribes, corto)

Una línea por vídeo: `clave · antes s → ahora s · advertencias añadidas · 0 parpadeos`, y aparte
lo que no pudiste hacer, lo que dudaste de la aplicación y los ficheros compartidos que habría que
cambiar.
