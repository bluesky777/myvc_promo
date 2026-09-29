# Relevo: los vídeos de ayuda

*Escrito el 28 de septiembre de 2026, al llenarse la ventana de la sesión que los empezó. Esto es
lo que hay, lo que falta y lo que está a medias. Lo largo está en `PLAN-VIDEOS-AYUDA.md`; esto es
el relevo.*

---

## 0. ESTADO AL 2026-09-29 (tarde) — leer primero

- **92 vídeos, CON VOZ Y EFECTOS** (decisión de Joseth tras oír el piloto): voz sintética
  es-CO-SalomeNeural por edge-tts, efectos sintetizados en `public/ayuda-sfx/`. Todos tratan de **tú**.
- **La voz sale sola de los rótulos**: `Marco` dice cada paso (`paso.voz ?? paso.texto`) y `Tarjeta`
  su cierre; el MP3 se busca por la huella del texto (`src/ayuda/voz.tsx`, `public/ayuda-voz/`,
  `src/ayuda/voces.json`). `Cursor` suena en cada clic; teclas y avisos con `<Efecto>` en cada escena.
  Tras cambiar un texto: `node tools/voz.mjs src/ayuda/<carpeta>/`; `node tools/voz.mjs --limpia`
  regenera todo y borra lo que ya no se dice.
- **La puerta del guion ahora mide la voz**: un paso dura `6 + voz + 6` fotogramas (+30 si es rojo).
  Un guion que no pasa rompe `Root` entero; cada carpeta tiene `entrada.tsx` para renderizar suelta
  (`tools/render-solo.sh <Comp> <mp4> src/ayuda/<clave>/entrada.tsx`).
- **Un tercio más cortos**: de 94 a 68 min; mediana de 62 a 44 s.
- **Advertencias anti-errores** en cada vídeo que las tiene: `ADVERTENCIAS-AYUDA.md` (sacadas del
  código de app2 por `myvc-front-74`, con las correcciones que salieron después).
- **Vídeo nuevo `entrega-de-notas`** (principal de informes): bloquear en el semáforo de periodos y
  qué imprimir según el periodo. **cierre-2-candados** rehecho para el semáforo de 4 tramos.
- **planilla-teclear enseña el historial**: el docente ya lo ve en app2 (8myvc a90c3b8, front
  cc1ad46c) — **hay que desplegarlo** para que el vídeo sea verdad. Igual el arreglo de «Modo
  nivelación» (front 42d9969f) que enseña no-me-deja-escribir.
- **El catálogo se genera**: `node tools/catalogo.mjs` reescribe título, duración y capítulos desde
  los guiones. La clave es el contrato con app2 y no cambió.
- **Render**: siempre `tools/render-solo.sh`, Chrome headless de Remotion, 0 PARPADEOS.
- **Nada está commiteado.** Por rutas, nunca `git add -A`. **YouTube**: todo hay que volver a subirlo.
- Sin decidir: si una secretaria normal puede matricular/retirar en Alumnos (el código dice que sólo
  superusuario o quien tenga permiso de editar alumnos); los vídeos no nombran el rol.

## 1. Qué es esto

Vídeos cortos **con voz** (desde el 2026-09-29; antes eran mudos) que se embeben en `app2` detrás de un botón de ayuda en cada pantalla.
No son los clips promocionales, aunque comparten repo, movimiento y pantallas dibujadas.

La sesión de `myvc_front` (nombre `myvc-front-74`) está construyendo el botón: panel lateral con el
vídeo de la pantalla, sus capítulos, «de la misma serie» y un reproductor flotante. Su maqueta:
<https://claude.ai/artifact/UgvhLKA8NwRHrTDnPVf4bB>.

## 2. Estado

**Hechos y renderizados** (`npm run todo-ayuda`):

| clave | vídeo | dura | composición |
|---|---|---|---|
| `planilla-teclear` | La planilla: teclear y que quede guardado | 42 s, 7 pasos | `Ayuda-Planilla-Teclear` |
| `competencias-docente` | Calificar por competencias | 109 s, 18 pasos | `Ayuda-Competencias` |
| `cierre-1-quien-falta` | Antes de cerrar: a quién le falta | 61,5 s, 10 pasos | `Ayuda-Cierre-1` |

**Planeados:** 81 temas en `PLAN-VIDEOS-AYUDA.md`, de los que **25 son la ola que va primero**
(pedida el 2026-09-28). La lista con claves, rutas, duraciones y capítulos está en
**`CATALOGO-AYUDA.json`**, que es lo que el front copia a `catalogo-de-ayuda.ts`.

## 3. Dónde está cada cosa

```
PLAN-VIDEOS-AYUDA.md      el plan entero: la norma, los 81 temas, el gancho en app2, la ola
CATALOGO-AYUDA.json       lo que lee el front: clave, título, duración, capítulos, youtube: null
LEEME.md                  cómo se usa el repo; la sección «Los vídeos de AYUDA»
src/comunes/vocabulario.ts  Logros/Indicadores, la palabra del colegio, en un solo sitio
src/ayuda/                LA CAPA QUE HEREDAN LOS 80
  Marco.tsx               cabecera de ubicación + rótulo + «paso N de M»
  Foco.tsx                el velo con el recorte
  Tarjeta.tsx             la tarjeta de tres líneas del final
  Cascara.tsx, medidas.ts barra y menú de la aplicación, y sus medidas
  encuadre.ts             a qué escala se pinta la aplicación, y cómo se encuadra un papel
  tiempos.ts              la regla de lectura y las dos puertas (rótulos y capítulos)
  planilla/, competencias/  un vídeo por carpeta: datos.ts, guion.ts, Escena.tsx, pantallas
src/notas/Escena.tsx      la planilla, COMPARTIDA con el clip promocional (prop `ritmo`, prop `ajuste`)
```

## 4. Las decisiones que ya están tomadas — no volver a abrirlas

Del usuario, el 2026-09-22:

1. **Se dibuja en Remotion**, no se graba la aplicación con Playwright.
2. **Se dibuja `app2`** (la de `up2/`), no la vieja.
3. **Los datos salen de anonimizar un volcado** — que en la práctica significa: los nombres y las
   notas se escriben a mano en el `datos.ts` de cada vídeo. En un vídeo dibujado no puede colarse
   un dato real porque no hay ninguno conectado.
4. **Se empezó por un piloto entero** antes de comprometerse con la ola.

Y las que salieron de hacerlos:

- **El ritmo de la ayuda no es el del promocional.** El promocional comprime a 0,4 s los tres
  segundos que tarda el lote; la ayuda los enseña enteros, porque «tarda un par de segundos» *es*
  lo que hay que explicar. Hay una puerta que exige los 105 fotogramas de la aplicación.
- **La geometría se calcula, no se mide.** El foco y el puntero salen del mismo número del
  `datos.ts`. Cuando no fue así, los dos señalaron el botón equivocado a la vez.
- **Un papel no se reescala poco a poco**: dos planos quietos encadenados.
- **«Unidad» y «subunidad» no son palabras de pantalla**: el colegio las renombra y lo más común es
  **Logros e Indicadores**. Está en `src/comunes/vocabulario.ts`, y cada vídeo donde salga la
  palabra dice una vez que la pone el colegio.
- **Un vídeo se salta el tope de 90 s** (competencias, 109) y está escrito por qué en su guion.

## 5. LO QUE ESTÁ A MEDIAS — empezar por aquí

### 5.1 Hay un mensaje sin enviar a `myvc-front-74`

El comprobador del sandbox dejó de dar veredicto y bloqueó `Bash` y `SendMessage` en los últimos
intentos. **El texto está escrito y hay que mandarlo tal cual** (`SendMessage` a `myvc-front-74`),
porque para si no se programa un botón que abre el vídeo equivocado:

> Parad el «?» de la nota rápida: planilla-teclear no enseña la nota rápida en ningún segundo, y su
> 0:38 es la tarjeta del final.
>
> El vídeo dura 42 s, no 1:15, y sus capítulos de verdad son cuatro: 0:00 dónde está la planilla ·
> 0:14 la pantalla, una fila por alumno · 0:21 el aro, escrita y sin confirmar · 0:31 un aviso por
> tanda. Los seis de vuestra maqueta describen un vídeo que no existe: la nota rápida es
> `planilla-nota-rapida` (planeado, 60 s), nivelar es `cierre-3-nivelaciones` y ausencias es
> `docente-asistencia`. Eso es lo que tienen que abrir esos «?»; no hay segundo al que apuntar en
> planilla-teclear.
>
> El catálogo está en **myvc_promo/CATALOGO-AYUDA.json** — ahí y no en out/, que está en
> .gitignore. Trae los 2 hechos con duración y capítulos medidos sobre el guion, y los 24 planeados
> con clave, rutas, duración estimada y la duda que cada uno tiene que matar. El id de YouTube va
> en null; Joseth lo rellena al subir.
>
> Tres cosas más de vuestra lista: (1) la clave del segundo vídeo es `competencias-docente` y no
> `competencias`, porque habrá otro del mismo tema para coordinación; si preferís `competencias`,
> es una línea. (2) En el menú la entrada se llama «Mis desempeños», no «Mis competencias»
> (`menu.ts:596`). (3) `certificado-imprimir` traía cuatro papeles y no cabe en 90 s: lo partí en
> `certificado-imprimir` y `constancia-estudio`. `cierre-4-boletines` se queda sólo con sacar el
> boletín.
>
> Orden, por calendario y no por gusto: **cierre de notas primero**, después docente día a día, y
> montar el año el último aunque sea el más barato, porque no se usa hasta enero. 16 pantallas
> nuevas para los 23 que faltan; unas cinco semanas.
>
> Y una decisión que os toca tanto como a mí: `docente-asistencia` va de las columnas Aus y Tard, y
> la planilla dibujada no las tiene. Ampliarla sirve también a `planilla-real-m-r` y a `cierre-1`,
> pero cambia de aspecto el clip promocional, que usa la misma planilla.

### 5.2 Hay cambios sin comprobar

Lo último que se tocó **no pasó por `npx tsc --noEmit` ni por un render**, porque el sandbox dejó de
dar veredicto a mitad:

- `src/ayuda/tiempos.ts`: tipo `Capitulo` y `compruebaLosCapitulos()` (exige entre 2 y 6, en orden y
  dentro del vídeo). **Se ejecuta al cargar el guion**, así que si está mal, el render falla.
- `src/ayuda/planilla/guion.ts` y `src/ayuda/competencias/guion.ts`: `CLAVE`, `TITULO` y `CAPITULOS`
  nuevos, con su llamada a la puerta. **Ojo a `TITULO`**: es un nombre que ya se usa como constante
  local en otros ficheros; comprobar que no choca.
- `CATALOGO-AYUDA.json` y las secciones nuevas de `PLAN-VIDEOS-AYUDA.md`.

**Lo primero que hay que hacer:** `npx tsc --noEmit` y `npx remotion still Ayuda-Competencias /tmp/x.png --frame=100`.
Si las dos pasan, lo de arriba está bien y **no hace falta volver a renderizar**: nada de eso cambia
un píxel.

### 5.3 Las tres decisiones, cerradas (2026-09-28)

1. La clave es **`competencias-docente`**; el front ya la adoptó.
2. **La planilla tiene Aus y Tard**, después del Total. Promocional y ayudas re-renderizados.
3. **Los promocionales dicen «Logro»**: se corrió `npm run todo`.

## 6. Cómo se trabaja aquí

**Un vídeo nuevo son cuatro ficheros** en `src/ayuda/<clip>/`: `datos.ts` (lo que se ve **y la
geometría**), la pantalla si no está dibujada, `guion.ts` (pasos, ritmo, capítulos, puertas) y
`Escena.tsx` (encadenar). Más dos líneas: la composición en `src/Root.tsx` y el guion en
`package.json`.

**Las puertas que ya existen y no hay que apagar:**

- un rótulo dura `palabras ÷ 2,5 + 1 s` como mínimo (`compruebaElGuion`);
- los capítulos son entre 2 y 6 y caen dentro del vídeo (`compruebaLosCapitulos`);
- el lote de la planilla vuelve 105 fotogramas después de la última tecla, y **donde empieza el paso
  que lo explica**.

**Cómo se caza un parpadeo, que es lo que más caro salió:** se restan dos fotogramas seguidos. Una
parte quieta tiene que salir **idéntica byte a byte** —lo está, medido—; si en una transición hay
cientos de miles de píxeles con un salto grande, algo aparece o desaparece de golpe. El apaño que se
usó decodifica dos PNG con `zlib`, sin dependencias, y dice qué filas cambian y cuánto. **No hay
numpy ni ffmpeg en esta máquina.**

Las dos causas que ya mordieron: **desmontar una pantalla a mitad de su salida** (341.935 píxeles
desaparecían de un fotograma al siguiente) y **reescalar un papel poco a poco** (sus filetes de
0,8 px se dibujan en unos fotogramas y en otros no).

## 7. Comandos

```sh
npm run studio              # el estudio; las puertas revientan aquí, no en el render
npm run todo-ayuda          # los dos vídeos de ayuda
npm run ayuda-planilla
npm run ayuda-competencias
npm run todo                # los promocionales (hoy pendientes de re-render por «Logro»)
npx tsc --noEmit
npx remotion still Ayuda-Competencias /tmp/x.png --frame=940
```
