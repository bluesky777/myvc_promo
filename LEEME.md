# Animaciones de MyVC para el vídeo promocional

Clips cortos, generados **desde el código**, para que quien monta el vídeo los una con lo suyo.
Cada clip sale como un fichero suelto: esto no es un vídeo terminado, son piezas.

## Por qué Remotion y no Rotato ni Jitter

Las tres sirven, pero no para lo mismo:

| | qué es | cuándo |
|---|---|---|
| **Rotato** | mete una **grabación de pantalla** dentro de un portátil o un móvil en 3D | cuando ya tienes el vídeo grabado y quieres la maqueta bonita |
| **Jitter** | motion design **a mano**, en su web. No hay código | carátulas, textos animados, logos |
| **Remotion** | un clip es un **componente de React**; se renderiza a MP4 | cuando la animación **es** la aplicación y tiene que salir exacta |

Aquí hace falta Remotion: el aro de guardado se está enseñando con **su degradado real, sus 0,8 s de
vuelta y los tiempos de verdad del lote**. Grabando pantalla no sale igual de limpio, y a mano habría
que dibujarlo de nuevo cada vez que la aplicación cambie.

Rotato sigue teniendo sitio **después**: se le puede dar el MP4 de aquí y que lo meta en un portátil.

## Cómo se usa

```sh
cd ~/DESARROLLOS/myvc_promo

npm run studio           # el editor: se ve el clip, se arrastra la línea de tiempo, recarga al guardar
npm run todo             # renderiza los cuatro de una vez

npm run notas            # -> out/notas-aro.mp4          (limpio, sin textos)
npm run notas-rotulo     # -> out/notas-aro-rotulo.mp4   (con el rótulo abajo)
npm run rubricas         # -> out/rubricas.mp4
npm run rubricas-rotulo  # -> out/rubricas-rotulo.mp4
npm run combinado        # -> out/notas-y-rubricas.mp4   notas y rúbricas en un solo clip
npm run disciplina       # -> out/disciplina.mp4         comportamiento -> disciplina -> el diálogo
npm run notas-alfa       # -> out/notas-aro.mov          ProRes 4444, por si quiere fondo transparente
```

**`npm run studio` es donde se trabaja.** Se abre en el navegador, se mueve la aguja al fotograma que
sea y se ve el aro parado ahí. Al guardar un fichero, se recarga solo.

## El principio de movimiento — vale para TODOS los clips

Está escrito en `src/comunes/movimiento.ts` y no dentro del clip de notas, a propósito: los que
vengan lo heredan y todos se mueven igual.

1. **Una pantalla no aparece de golpe ni con un fundido.** Se monta delante de quien mira: el título
   **se escribe**, las cabeceras salen una a una **escribiéndose**, las filas **van llegando** en
   cascada. Un fundido enseña una foto; esto enseña una pantalla montándose, y de paso obliga al ojo
   a recorrerla en el orden en que hay que leerla.
2. **Y se va igual.** Cada fila se aparta por su cuenta, escalonadas y con las salidas solapadas: se
   lee como **un solo movimiento**, no como seis despedidas. El marco se recoge al final, cuando ya
   está vacío.
3. **Si un clip cambia de pantalla, la nueva entra con esto mismo.** Nunca un corte seco.

La geometría de la cabecera **no se mueve** mientras se escribe -- se mueve el texto. Si cada celda
entrara volando, las rayas de la tabla bailarían y lo que se vería es un desorden, no una pantalla
montándose. Las filas sí se mueven enteras, porque no comparten línea con nadie.

## REGLA: todo listado de personas lleva avatar

**Cualquier lista de alumnos o de profesores, en cualquier clip, va con su avatar de foto.** Sin
excepciones. Una tabla de personas sin caras se ve como una hoja de cálculo, y eso es justo lo que el
sistema no es -- y además la aplicación **sí** enseña la foto en esas pantallas (`ficha__foto` en
comportamiento, `alumno__foto` en disciplina, `comunes/celda-foto` en la planilla), así que quitarla
en el vídeo enseñaría algo más pobre que el producto.

## El encuadre está en un solo sitio

`src/comunes/encuadre.ts` dice cuánto se agranda cada pantalla dentro del fotograma. Estaba repartido
--un número en cada escena-- y eso es lo que hace que **dos clips montados seguidos enseñen la
aplicación a dos tamaños distintos**: cada uno por separado se ve bien, y pegados se ve el salto.

Ahí mismo está `CON_ROTULO`: cuando el clip lleva texto abajo, la pantalla se encoge para dejarle
sitio. El rótulo es parte del encuadre, no algo que se pega encima al final.

## Los avatares

Van **dibujados en SVG** (`src/comunes/Avatar.tsx`), no son imágenes. La planilla de verdad enseña la
foto del alumno, y una tabla de notas sin caras se ve como una hoja de cálculo -- justo lo que el
sistema no es. Pero en un vídeo que ve media Unión no puede salir la cara de ningún menor ni una foto
de banco que haya que licenciar. Son planos y sin rasgos: se lee «persona» a 42 px y no se parecen a
nadie. Mujer y hombre se distinguen por el pelo, que es lo único que funciona a ese tamaño.

## Qué enseña el clip de notas

1. El docente teclea una nota → **aparece el aro ámbar en movimiento**: eso todavía no está guardado.
2. Teclea otras dos → **tres aros a la vez**. Ninguna se apagó sola.
3. El lote vuelve → **los tres se apagan a la vez** y sale **un** aviso: «Cambiadas: 92, 78, 55».

Y todo lo demás que se ve de paso, sin decirlo: las notas perdidas en rojo y las altas en azul, la
cruz que ilumina la fila y la columna que se está tocando, el total que se recalcula al escribir.

**Una licencia, y conviene saberla.** En la aplicación, entre la última tecla y el aviso pasan hasta
tres segundos (1 s de espera de la celda + 2 s de ventana del lote + la ida y vuelta). En el clip son
0,4 s: tres segundos de pantalla quieta en un vídeo promocional son tres segundos donde se pierde a
quien mira. **Lo que no se toca es el desenlace**: los tres aros se apagan a la vez y sale un aviso
con las tres notas, porque eso sí es lo que hace la aplicación. Está anotado en `src/notas/guion.ts`.

## Qué enseña el clip de rúbricas

Empieza donde termina el de notas, así que van seguidos -- pero es un fichero aparte y sirve solo.

1. La planilla en primer plano. El puntero llega a una casilla y aparece **«Calificar con rúbrica»**,
   anclado a esa casilla con su piquito: se ve de qué casilla sale.
2. La planilla **se va fila a fila** y entra la matriz de la rúbrica: criterios × niveles, con un
   descriptor en cada celda.
3. Debajo aparece **«De dónde sale la nota»** con las tres líneas en «sin marcar». El docente marca
   un nivel por criterio y **cada marca llena su línea**: «Argumentación 40 % × Alto 85 = 34».
4. Con los tres marcados: **«Nota que calcula la rúbrica: 82»**. Antes de eso la pantalla lo dice con
   palabras: *una rúbrica a medias no da una nota a medias*.

El desglose es lo que hay que enseñar, no la matriz: es lo que separa esto de una nota que aparece
sola. Sin él, el docente tiene un número que no puede defender ante un acudiente.

## Que algo no esté desplegado NO frena un clip

**Decisión suya, 2026-09-03.** Se hacen los clips de lo que el sistema hace, esté o no desplegado en
los quince colegios. Las rúbricas, por ejemplo, están en `main` y medidas pero todavía no subidas
colegio por colegio -- y el clip se hace igual. Lo que manda es tener el vídeo promocional.

Lo único que conviene tener presente al enseñarlo: si alguien de la Unión pide verlo en vivo justo
después, hay que saber en qué colegio está desplegado. No es un problema del clip, es del orden de
la conversación.

## Los clips que hay

| clip | qué cuenta | dura |
|---|---|---|
| **Notas** | el aro de guardado y el aviso por lote | 9,9 s |
| **Rúbricas** | de la planilla a la matriz, y el desglose que produce la nota | 13,2 s |
| **Notas y rúbricas** | los dos seguidos, **con la planilla montándose una sola vez** | 19,7 s |
| **Disciplina** | comportamiento → disciplina → el diálogo → la situación en su sitio | 26,7 s |
| **Horarios** | **otro programa**: disponibilidad → rejilla → generar → el informe impreso | 32,7 s |
| **Móvil** | **la app de los acudientes**: el aviso de que el hijo no llegó al colegio | 18,7 s |

El combinado **no es pegar los dos primeros**: los dos sueltos empiezan cada uno montando su
pantalla, así que pegados se vería la planilla construirse dos veces. En el combinado se monta una
vez, se usa, y cuando el aviso del lote se va vuelve el puntero y aparece «Calificar con rúbrica».

## Los clips del portal de la UCN

Son de **otro producto y de otro vídeo**: el portal nacional de la Unión Colombiana del Norte, cuyo diseño vive en `~/DESARROLLOS/myvc_ucn`. Viven en `src/ucn/` y no comparten nada con los de MyVC salvo `comunes/` y el aparato del teléfono.

| clip | qué cuenta | dura |
|---|---|---|
| **UCN-Comunicados** | se escribe un evento, se pulsa publicar y está en el teléfono de 401 personas; el docente confirma y el portal lo cuenta | 18,9 s |
| **UCN-Encuestas** | una respuesta abre unas preguntas y la otra abre otras distintas, encadenadas; al publicar, el aviso con su fecha | 19,0 s |
| **UCN-Salud-Escolar** | once mil atenciones al año, y el brote de fiebre que un colegio solo no puede ver | 14,3 s |
| **UCN-Comparador** | cada colegio contra los otros doce, sin ver el nombre de ninguno | 12,8 s |
| **UCN-Metas** | seis metas en una sola escala, y por qué un 96 % pinta en rojo | 13,1 s |
| **UCN-Misional** | ocho años de bautismos y la proporción por campo | 12,1 s |

`npm run todo-ucn` los renderiza los doce. `todo` sigue siendo sólo el vídeo de MyVC.

**Dónde se toca cada cosa**

| lo que quieras cambiar | dónde |
|---|---|
| los colores y el tamaño del portal en el fotograma | `src/ucn/tema.ts` |
| el cromo del portal (rail y cabecera) | `src/ucn/Marco.tsx` |
| las piezas repetidas: tarjeta, cifra, píldora, barra, aviso | `src/ucn/piezas.tsx` |
| los cuatro gráficos | `src/ucn/graficos.tsx` |
| el teléfono flotante y el aviso | `src/ucn/Movil.tsx` |
| el fondo, el encuadre y el rótulo | `src/ucn/Lienzo.tsx` |
| las cifras y los textos de un clip | `src/ucn/<clip>/datos.ts` |
| el ritmo de un clip | `src/ucn/<clip>/guion.ts` |

**Tres cosas que conviene saber**

- **La escala de estos seis NO está en `comunes/encuadre.ts`**, está en `src/ucn/tema.ts`. El portal es otro producto con otro ancho de diseño (1440), y meterlo allí haría que tocar el portal moviera de tamaño los clips de la aplicación. Lo que ese fichero protege se cumple igual: los seis comparten una sola escala entre ellos.
- **El teléfono es el de `src/movil/Telefono.tsx`**, con su barra morada de `myvc_flutter`, aunque las maquetas del portal dibujen uno crema. Si el mismo teléfono cambiara de aspecto entre dos clips del mismo vídeo, se leería como dos aplicaciones — y lo que el clip afirma es justo lo contrario: al docente le llega dentro de la app que ya usa.
- **Las cifras que salen son de muestra**, coherentes entre sí pero no medidas. Están en `myvc_ucn/docs/04-guion-video.md` con ese aviso; ninguna debe citarse como medición.

## Qué enseña el clip de disciplina

Cuatro momentos encadenados, sin un solo corte seco:

1. **Comportamiento.** El observador, con un periodo por pestaña y las tres columnas con su nombre
   --Convivencia, Académico, Compromiso--. Se abre el último periodo y se escribe; **el distintivo de
   la pestaña sube**, que es lo que permite ver en qué periodos hay libro sin abrirlos uno a uno.
2. **Disciplina.** La rejilla: una fila por alumno, una columna por periodo, y en cada celda los
   contadores. El color es el de la gravedad --oro, volcán y rojo-- y **sólo se enciende cuando hay
   algo dentro**: una rejilla donde todo está encendido no dice nada.
3. **El diálogo.** Se pulsa el distintivo, se despliega el detalle, se pulsa el detalle y se abre el
   diálogo **con todo puesto menos la descripción**: tipo, fecha, testigos, descargo, profesor y los
   ordinales del manual de convivencia. Lo único que hay que escribir es qué pasó.
4. **La vuelta.** Al guardar, la situación nueva aparece **debajo de la que ya estaba** y el contador
   de la rejilla sube.

## Qué enseña el clip de horarios

**Es otra aplicación**: `myvc_horarios`, un programa de escritorio (Tauri + Angular) que cuadra el
horario de un colegio y lo imprime, con o sin MyVC detrás. Por eso el clip no se parece a los demás:
fondo distinto, azul de tinta en vez del color del colegio, y ninguna cáscara de MyVC.

**El orden de los cuatro actos es el argumento entero.** Un clip que empezara generando enseñaría
magia; empezar por la disponibilidad enseña lo contrario, que es lo que hace que un coordinador se
fíe.

1. **La disponibilidad del salón «Iglesia».** Se marca ✕ toda la semana menos la 3ª del martes y la
   del miércoles. La iglesia no es un aula --culto, ensayos, actos-- y eso **no lo adivina nadie: se
   declara**. Es el ejemplo que explica la pantalla mejor que cualquier docente con una tarde libre.
2. **La rejilla, y el canje.** Se coge una lección y **la rejilla se pinta entera de una vez**: verde
   donde cabe, ámbar donde cuesta, apagado donde no. Se suelta encima de otra y **la que estaba sube
   a la mano**; de ahí, a la bandeja. Dos clics para lo que en una hoja de cálculo son cuatro
   operaciones y un borrado que se olvida deshacer.
3. **Generar.** La barra con lo que está haciendo, y el veredicto entero — incluido **lo que NO tuvo
   en cuenta**: un horario que no dice qué no miró se lee como uno que lo miró todo.
4. **El informe.** El horario del grupo tal como sale de la impresora, con el dibujo de cada materia.
   Los iconos son **los del programa, copiados de `icono-materia.html`** (`src/horarios/iconos.ts`),
   no unos parecidos: el informe con dibujos es justo lo que este clip vende.

### La copia de los iconos: cuándo caduca y cómo se comprueba

Es la única dependencia de este proyecto que puede **caducar en silencio**: si en `myvc_horarios`
cambian los dibujos, el clip sigue renderizando igual de bien un informe que ya no existe. Nada se
pone rojo, porque un vídeo no compila contra nada.

**Comprobado el 2026-09-03: los 12 copiados son idénticos a los del programa.** Comparados trazo a
trazo —los 16 `@case` del `icono-materia.html` contra las 12 cadenas de `iconos.ts`, con los
espacios normalizados y comparando `fill`, `stroke`, `stroke-width` y opacidades enteros—: 12
idénticos, 0 distintos. La copia todavía no miente.

Los cuatro que faltan --`biologia`, `civica`, `economia`, `filosofia`-- **nunca se copiaron**, no es
que envejecieran. Hoy eso no se ve: los iconos sólo los usa el informe, que pinta las diez materias
del catálogo del grupo, y las diez están entre las copiadas. `FIL` y `ECO` salen sólo como fichas de
la bandeja, y la bandeja no dibuja iconos. **Si alguien mete una de esas cuatro en el catálogo del
clip, saldrá un hueco sin dar ningún error** — hay que copiar el dibujo que falte.

Cómo se vuelve a comprobar: sacar los `@case` del HTML y las cadenas del `.ts`, normalizar espacios
y comparar cadena contra cadena. En minuto y medio se sabe. `myvc-horarios-21` quedó en avisar aquí
si alguien toca esos doce dibujos, y eso está en su reparto, no en la memoria de una sesión.

## Qué enseña el clip del móvil

Es **`myvc_flutter`**, la app de los acudientes: una sola para los quince colegios, con su morado
`#6A62B7` y no el color del colegio. Cuatro pantallas, y las tres últimas entran deslizando desde la
derecha, que es como navega un teléfono.

1. El acudiente ve **a sus dos hijos** y abre a uno.
2. Está mirando sus notas y **le llega el aviso**: «Se registró una ausencia de Juan David hoy».
3. Lo toca y cae en **Asistencia**: dos ausencias frente al colegio, cero a clases.
4. Entra al **detalle**: qué dos días fueron.

**Que el aviso llegue mientras mira otra cosa es la mitad del argumento**: el padre no estaba
buscando eso. Si el clip empezara en la pantalla de asistencia, lo que se vería es a alguien
comprobando algo que ya sabía.

**El texto del aviso no está inventado**: está en `myvc_flutter/docs/notificaciones.md`, en la tabla
de los cinco tipos. Y con él va una regla que el clip respeta: **ninguna notificación lleva la nota
dentro** — se ve en la pantalla bloqueada, en el bus, con gente al lado, y la nota de un menor no es
algo que deba aparecer ahí. Un clip que enseñara la nota en el aviso vendería lo contrario de lo que
el sistema hace bien a propósito.

## Las tres piezas de pegamento del vídeo grande

Portada, tarjeta del descuento y cierre. **No son clips**: no enseñan ninguna pantalla, son el texto
que une lo demás. Viven en `src/piezas/` y salen a `out/piezas/`.

| pieza | qué dice | dura |
|---|---|---|
| **Portada** | el nombre escribiéndose y, debajo, las cuatro palabras que **son el índice** — Notas, Disciplina, Asistencia, Horarios, en el orden en que vienen los clips | 5,5 s |
| **Tarjeta** | el 30 % **contándose de 0 a 30**, y la condición entera debajo | 6,5 s |
| **Cierre** | el nombre otra vez y los datos de contacto | 6,0 s |

`npm run todo-piezas` las rehace las tres. **No tienen variante con rótulo** —son texto: un rótulo
debajo no tendría nada que explicar—, y son la única excepción a la regla de las dos composiciones
por clip.

**Se mueven con `comunes/movimiento.ts`, igual que los clips**, y llevan el mismo fondo. Es
deliberado: el corte de la portada al primer clip **no cambia de superficie**, sólo de contenido. Es
lo que hace que el vídeo se lea como uno y no como piezas pegadas.

**Tres decisiones que están dentro y que no se ven mirando el vídeo:**

- **La portada no lleva ningún número de colegios.** En los documentos de la UCN conviven «los
  dieciséis colegios de MyVc» y «trece en territorio UCN»; una cifra equivocada en la primera
  pantalla, delante de la propia Unión, se lleva por delante la credibilidad de todo lo que venga
  detrás. Las cifras van en los clips del portal, que sí están medidas.
- **El 30 % es para quien TRAE al colegio**, no para el colegio que entra. Confirmado por él el
  2026-09-03; las dos lecturas posibles están escritas en `piezas/datos.ts`. Quien cambie ese texto
  está cambiando la oferta, no la redacción.
- **Lo que falta se dibuja como hueco rayado**, no con un valor de relleno. Un teléfono inventado en
  una tarjeta terminada se cuela en el montaje y acaba delante de la Unión; un hueco rayado se ve
  desde la otra punta de la sala.

## Fidelidad: qué se copia y qué no

**Los estilos se copian de la aplicación. El sitio y el tamaño, no.** El botón de rúbrica real es un
icono de `0.7rem` escondido en la esquina de la casilla; a ese tamaño, en un vídeo que alguien mira
en el móvil, no existe. Aquí sale como un botón con su texto.

La regla es: **lo que el clip afirma tiene que ser verdad** --desde la casilla se entra a calificar
con rúbrica, los tres aros se apagan a la vez y sale un aviso, la nota sale de la suma de los
aportes--. Lo que cambia es lo que el medio pide: tamaño, sitio y ritmo. Cada licencia va anotada en
el código del clip que la toma.

## Qué se toca para cambiar cosas

| lo que quieras cambiar | dónde |
|---|---|
| el color del colegio | `src/notas/tema.ts` → `ACENTO` |
| **cuánto ocupa la pantalla en el fotograma** | `src/comunes/encuadre.ts` — un solo sitio para los ocho |
| qué notas se teclean y cuándo | `src/notas/guion.ts` → `TECLEOS`, `CONFIRMA` |
| el ritmo de entrada y de salida | `src/notas/guion.ts` → `TITULO`, `CABECERAS`, `FILAS`, `SALIDA` |
| cómo entra y sale **cualquier** clip | `src/comunes/movimiento.ts` |
| los avatares | `src/comunes/Avatar.tsx` |
| los hijos, el aviso y la asistencia del móvil | `src/movil/datos.ts` |
| los alumnos y las notas de partida | `src/notas/planilla.ts` |
| la rúbrica: criterios, pesos, niveles y qué se marca | `src/rubricas/datos.ts` |
| el ritmo del clip de rúbricas | `src/rubricas/guion.ts` |
| el texto del rótulo | `src/notas/Escena.tsx`, al final |
| duración, tamaño, fps | `src/Root.tsx` |

Los colores del aro, del rojo de «perdida» y del azul de «superior` son **los de la aplicación**, no
unos parecidos: salen de `myvc_front/app2/src/app/comunes/estilos/casilla-de-nota.scss`. Si allí
cambian, aquí hay que cambiarlos también.

## Cómo está la carpeta `out/`

    out/*.mp4          los clips CON rótulo — llevan el texto puesto
    out/sin-rotulo/    los mismos, limpios — los que se le dan al montador si él pone sus textos
    out/imagenes/      fotogramas sueltos de comprobación; no son entregables

Los `.png` salen de `remotion still` y sirven para mirar un fotograma sin renderizar el clip entero.
Se pueden borrar en cualquier momento.

**Y hay que mirarlos.** Cuatro cosas de este proyecto se arreglaron por verlas en un fotograma y no
por razonarlas: el rayado de «aquí no cabe» que no se veía debajo de una ficha, las dos tarjetas
encimadas en el paso de la rejilla al informe, el pelo de los avatares que se confundía con la piel, y
la pantalla del móvil vacía un segundo entero tras deslizar. **Ninguna daba error.**

## Lo que hay que pasarle al montador

- `out/notas-aro.mp4` y `out/rubricas.mp4` — **los limpios**. Son los que debe usar si él pone sus
  propios textos.
- `out/notas-aro-rotulo.mp4` y `out/rubricas-rotulo.mp4` — con el rótulo, por si le sirven tal cual.

Los dos van seguidos en ese orden: el de rúbricas arranca en la misma planilla donde acaba el otro.

1920×1080, 30 fps, H.264. Se abre en cualquier editor sin convertir nada.

Si pide **fondo transparente** para montarlo encima de lo suyo: `npm run notas-alfa` da un `.mov`
ProRes 4444 con canal alfa -- pero antes hay que quitarle el fondo a la escena
(`src/notas/Escena.tsx`, el `background` del `AbsoluteFill` de fuera).
