# Vídeos de ayuda dentro de la aplicación — el plan

*Trazado el 22 de septiembre de 2026 leyendo `~/DESARROLLOS/myvc_front`: qué vídeos hacen falta,
cómo se hacen sin audio y por dónde se cuelgan de la aplicación.*

**Las cuatro decisiones, tomadas el 22 de septiembre de 2026:** se graba la aplicación **nueva**
(`app2`, la de `up2/`) · las pantallas se **redibujan en Remotion**, como los clips promocionales ·
los datos salen de **anonimizar un volcado** · y se empieza por **un vídeo piloto entero**, que es
el que ya está hecho (apartado 9).

---

## 1. Tres decisiones que van primero, porque todo lo demás cuelga de ellas

### 1.1 Se graba la aplicación NUEVA (`app2`, la de `up2/`), no la vieja

La vieja sigue en los dieciséis colegios y no se toca — pero está siendo sustituida pantalla a
pantalla. Un vídeo de la vieja nace con fecha de caducidad conocida, y son cuarenta vídeos.

Consecuencia que hay que aceptar: **mientras un colegio no tenga `up2/`, sus usuarios verán vídeos
de una pantalla que todavía no es la suya.** Es el mismo trato que ya se tomó para los clips
promocionales el 2026-09-03 («que algo no esté desplegado no frena un clip»), y aquí además juega a
favor: el vídeo es lo que enseña la aplicación nueva antes de que llegue.

### 1.2 Las pantallas se redibujan, como en los clips promocionales

*Decisión suya, 2026-09-22, sobre la alternativa de grabar la aplicación de verdad con Playwright.*

Los seis clips de MyVC de este repo están **redibujados en Remotion**: la planilla, el aro, la
rejilla de disciplina son componentes de React que imitan la aplicación. Salen exactos, limpios y
con los tiempos que convienen, y eso es lo que se hace también aquí.

**Lo que cuesta, dicho de frente:** un recorrido grabado con Playwright se rehace solo cuando la
aplicación cambia --el arnés de `scripts/capturas/` ya sabe entrar, elegir grupo y pulsar--, y una
pantalla dibujada hay que redibujarla. A ochenta vídeos eso no es un detalle: es el trabajo de
mantenerlos vivos.

**Lo que lo hace sostenible, y por eso funciona:**

- **La capa de ayuda se escribe una vez.** Cabecera de ubicación, rótulos, contador de pasos, foco,
  puntero y tarjeta final son `src/ayuda/`, y los heredan los ochenta.
- **Las pantallas ya dibujadas se reutilizan.** La planilla del vídeo de ayuda **es la misma**
  `notas/Escena` del promocional, con otro ritmo. La de disciplina, la de rúbricas y las del móvil
  están hechas. Un vídeo de ayuda sobre algo ya dibujado cuesta su guion, no su pantalla.
- **La cáscara --barra y menú-- también se escribe una vez** (`src/ayuda/Cascara.tsx`), y es el
  primer trozo de los ochenta.

Y lo que se gana a cambio del mantenimiento: la pantalla dibujada **enseña lo que hay que mirar**.
Se puede ir más despacio en el momento que importa, resaltar una casilla, o enseñar el aro con su
degradado de verdad sin que se cuele un dato, una tardanza del servidor o un menú a medio cargar.

### 1.3 Sin audio no significa «el mismo vídeo pero mudo»

Un vídeo mudo se ve en silencio **y también se ve a medias**: alguien lo abre desde el botón de
ayuda, mira veinte segundos y vuelve a su trabajo. Eso obliga a cosas que un vídeo con voz no
necesita, y están en el apartado 2.

---

## 2. La norma de los vídeos de ayuda — vale para TODOS

Esto es el equivalente de `src/comunes/movimiento.ts`: se escribe una vez y lo heredan los cuarenta.

1. **La cabecera de ubicación no desaparece nunca.** Arriba, durante todo el clip:
   `Menú ▸ Académico ▸ Planilla de notas` y debajo, en letra más pequeña, la dirección real
   (`/planilla-notas/:asignatura_id`). Quien caiga en el segundo 40 tiene que saber dónde está.
   **Las direcciones de la aplicación nueva ya no llevan `/panel`.**

2. **El camino de llegada se recorre, no se supone.** Los primeros cinco segundos son siempre los
   mismos: menú cerrado → se abre la sección → se pulsa la entrada → la pantalla se monta. Es el
   trozo más aburrido de hacer y el que más preguntas ahorra: «¿y eso dónde está?» es la duda número
   uno, por delante de «¿y cómo se hace?».

3. **Un texto a la vez, abajo, y con tiempo de leerlo.** Regla de reparto:
   `segundos = palabras ÷ 2,5 + 1`, redondeando hacia arriba, mínimo 2 s. Nada de dos carteles
   compitiendo, nada de texto sobre la zona que hay que mirar.

4. **Numeración visible: «paso 2 de 5».** Sin voz, no hay forma de saber cuánto falta, y quien no
   sabe cuánto falta abandona.

5. **El puntero se ve y el clic se oye con los ojos.** `src/comunes/Cursor.tsx` y `Toque.tsx` ya
   existen y sirven tal cual: el anillo del clic es lo que sustituye al «y aquí pulsamos».

6. **Lo que se toca se enciende, el resto se apaga.** Un velo suave sobre la pantalla y un recorte
   claro sobre el mando del que se habla. Sin eso, en 1080p vistos en un móvil, nadie encuentra el
   botón.

7. **Las precondiciones se dicen al principio, en cartel propio.** *«Antes de esto: el periodo tiene
   que estar abierto»*. Si el vídeo enseña una tarea que fracasa por algo hecho en otra pantalla,
   el vídeo no ayuda, frustra.

8. **Lo irreversible lleva cartel rojo y se queda quieto un segundo más.** Borrar una plantilla de
   certificado es definitivo; cerrar «Notas y asistencia» corta a todos los docentes a la vez;
   «Aplicar la plantilla» con *reemplazar* toca asignaturas que ya tienen unidades. Eso no se
   enseña de pasada.

9. **Termina con la tarjeta de tres líneas, congelada 3 s.** Qué se hizo, dónde se comprueba que
   salió bien, y —si lo hay— cuál es el vídeo siguiente. Quien pausa al final tiene que poder leerla
   entera.

10. **Duración objetivo 45–90 s.** Si una tarea no cabe, son dos vídeos, no uno de tres minutos.

11. **1920×1080, 30 fps, y letra mínima de 32 px.** La mitad de esto se ve en el móvil del docente.

12. **Las palabras son las de la pantalla, y varias las pone el colegio.** «Unidad» y «subunidad»
    son nombres de la base de datos: en la aplicación cada colegio escribe los suyos, y **lo más
    común con diferencia es Logros e Indicadores**. Eso es lo que sale en los vídeos
    (`src/comunes/vocabulario.ts`), y cada vídeo en el que la palabra aparezca **lo dice una vez**:
    *«Cada colegio les pone nombre: aquí se llaman Logros»*. Sin esa frase, a quien tenga
    «Desempeños» en su pantalla el vídeo le parece de otro programa.

13. **Sin música.** Va a sonar en una sala de profesores con doce personas.

---

## 3. Antes de grabar el primero: tres cosas que hay que decidir

### 3.1 De dónde salen los datos que se van a ver en YouTube

*Decisión suya, 2026-09-22: **anonimizar un volcado**, en vez de sembrar un colegio inventado.*

Un vídeo de ayuda enseña la planilla con nombres, fotos, documentos y notas dentro, y va a estar
publicado en internet.

**Y aquí la decisión de dibujar en vez de grabar cambia el tamaño del problema.** Lo que sale en
pantalla no es una captura de una base de datos: son los datos de un fichero `datos.ts` escrito a
mano, como `notas/planilla.ts` --«Acosta Rivera, Sara Isabel», inventada-- y como los cuatro
renglones de `ayuda/planilla/datos.ts`. **En un vídeo dibujado no puede colarse un dato real, porque
no hay ninguno conectado.**

Así que el volcado anonimizado no es lo que se publica: es **de dónde se copia la forma** -- cuántas
columnas trae una planilla de verdad, cómo son de largos los nombres, qué avisos salen. Eso es lo
que hace que la pantalla dibujada se parezca a la que el docente tiene delante, que es todo el
encargo.

**La regla que queda, y es la que hay que respetar en los ochenta:** los nombres, documentos, notas
y fotos de un vídeo se escriben a mano en su `datos.ts`. Si alguna vez hiciera falta pegar una
captura de verdad, se anonimiza antes y se dice en el fichero. Las caras van siempre dibujadas
(`src/comunes/Avatar.tsx`), nunca fotos.

### 3.2 En qué idioma de interfaz se graba

El vocabulario académico es de cada colegio: «Unidades / Logros / Desempeños», «Indicadores /
Columnas». El colegio de demostración fija uno, y **el vídeo lo dice una vez**: *«en tu colegio
esto puede llamarse Logros»*. Si no se dice, medio público cree que está viendo otra pantalla.

### 3.3 Quién locuta, si nadie locuta

Sin voz, **el texto es el guion** y hay que escribirlo entero antes de grabar, no improvisarlo
encima. Cada vídeo se escribe primero como una lista numerada de rótulos con sus segundos. Eso es
lo que se revisa y se aprueba; el rodaje es después.

---

## 4. El catálogo de vídeos

Ochenta temas salen de leer la aplicación entera. **Nadie debería comprometerse con ochenta.** Van
en tres olas, y la primera son **doce**: los que contestan las preguntas que hoy llegan por
teléfono.

Columnas: **ola** · **vídeo** · **dónde vive el botón de ayuda** · **segundos** · **la duda que
mata** (lo que justifica que el vídeo exista; si el vídeo no enseña eso, sobra).

### A. Moverse por MyVC — se cuelgan de TODAS las pantallas

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 1 | **El año y el periodo se cambian arriba** | todas | 50 | «Elegido» no es «en curso»; y al cambiar de año te mueve de periodo y lo avisa |
| 1 | **Ir a cualquier sitio escribiendo** | todas | 45 | `/` o Ctrl+K; busca pantallas, informes y personas, y por sinónimos («fallas», «paz y salvo», «personero») |
| 2 | **Dónde está cada cosa: el menú** | todas | 60 | nueve secciones, plegar a iconos con el botón de la barra, lateral vs superior |
| 3 | **Volver sobre tus pasos** | todas | 40 | el rastro recuerda por dónde entraste; Atrás devuelve el rastro tal cual |
| 3 | **Ponerlo a tu gusto** | todas | 45 | tema, modo oscuro, densidad de tablas — y que se guarda en ESTE navegador, no en tu cuenta |

### B. Docente: calificar

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 1 | **Mis asignaturas, por donde se empieza** | `/mis-asignaturas` | 60 | la fila roja no es decoración: dice qué le falta a la planeación |
| 1 | **Unidades e indicadores: el 100 %** | `/unidades/:id` | 75 | suman en dos niveles; «sobra 50 %» al abrir es un dato, no una avería |
| 1 | **La planilla: teclear y que quede guardado** | `/planilla-notas/:id` | 75 | el aro ámbar = escrita sin confirmar; el aviso verde es uno por lote; Tab vertical |
| 1 | **«No me deja escribir»** | `/planilla-notas/:id` | 45 | periodo cerrado: los cuatro avisos, y que lo abre el administrador en El colegio → Periodos |
| 1 | **Nivelar no es corregir** | `/planilla-notas/:id` | 75 | corregir va a auditoría; nivelar va al boletín y a la constancia. Y la regla del colegio topa la nota |
| 2 | **La nota rápida** | `/planilla-notas/:id` | 60 | el campo vacío BORRA (y 0 no es vacío); columna y fila enteras respetan el buscador |
| 2 | **Total, Real, M y R** | `/planilla-notas/:id` | 70 | Real es la que va al boletín; escribir Real enciende M sola, y M es lo que impide que el recálculo la pise |
| 2 | **Definitivas por periodo** | `/definitivas-periodos/:id` | 70 | Auto no se redondea a propósito; «Imprimir» sólo existe con el reporte abierto |
| 2 | **Notas perdidas** | `/notas-perdidas` | 45 | se califica desde aquí, sin abrir la planilla |
| 2 | **Rúbricas: montar la matriz** | `/rubricas/:id` | 80 | pesos a 100; cambiar pesos NO recalcula lo ya calificado |
| 2 | **Rúbricas: calificar** | `/rubricas/calificar/...` | 70 | una rúbrica a medias no da nota; «sin casilla» se arregla abriendo antes la planilla |
| 1 | **Calificar por competencias** ✅ | `/mis-desempenos` (+ Logros y el boletín) | 109 | qué cambia para el docente, y cómo sale el boletín. **Hecho** — ver apartado 9 |
| 2 | **Comportamiento y el libro rojo** | `/comportamiento-notas/:id` | 70 | la pestaña 2 no es el periodo 2; las tres columnas tienen nombre y van a sitios distintos |
| 2 | **Asistencias** | `/asistencias` | 55 | las de clase aquí sólo se miran; el candado de notas cierra también la asistencia |
| 3 | **Nivelaciones del grupo, en lote** | `/nivelaciones/:id` | 60 | aquí se guarda con botón y NO se previsualiza la regla del colegio |
| 3 | **Recuperación del año** | `/recuperacion-anual` | 50 | no pisa la nota del año; el botón sólo aparece si hay algo distinto que guardar |
| 3 | **Mis desempeños** | `/mis-desempenos` | 60 | son las mismas filas que escribe la coordinación, no una copia |
| 3 | **Copiar unidades a otra asignatura** | `/copiar-unidades` | 50 | si el destino es de otro grupo, las notas no se copian |
| 3 | **Boletín independiente** | `/boletin-independiente/:id` | 60 | marcarlo «aparte» lo hace secretaría; aquí sólo se monta y se califica |
| 3 | **Actividades** | `/actividades` | 60 | «Respuestas» hoy sólo va con actividad compartida a alumnos |

### C. Docente: trabajar sin internet

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 2 | **Bajar el libro** | `/notas/sin-internet` | 70 | la columna «Sin pasar» decide; «sin indicadores» es lo que más interesa llevarse |
| 2 | **Rellenar el Excel** | (dentro del anterior) | 45 | vacío = «no la toques»; para borrar se escribe un guion; la nota es entera |
| 2 | **Subir: el archivo y las columnas** | `/notas/sin-internet/subir` | 80 | los pasos se derivan: sólo salen los que tienen problema |
| 2 | **Subir: choques, ausencias y qué va a pasar** | `/notas/sin-internet/subir` | 85 | ausencias es lo ÚNICO que borra historia; y al cambiar una decisión hay que volver a leer |

### D. Informes y boletines

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 1 | **Encontrar el papel que necesitas** | `/informes` | 60 | busca por sinónimos («sábana», «paz y salvo»); las nueve familias son filtro, no puerta |
| 1 | **Los ajustes de impresión** | `/informes` | 70 | están tras el engranaje y dicen «3 de 7»; y la galleta se comparte con la aplicación vieja |
| 1 | **La pila: trece grupos, una impresión** | `/informes/pila` | 60 | tope 20; mezclar vertical y apaisado sale todo en el papel del primero |
| 2 | **Boletines del periodo** | `/informes` | 70 | el periodo no se elige: es el del colegio. El tipo ya no se pregunta, es la ficha |
| 2 | **Certificado, constancia y citación** | `/informes` | 65 | son tres papeles distintos, y el certificado «hasta un periodo» quema un número |
| 2 | **Semáforo** | `/informes` | 60 | fecha de entrega y número/valoración; sin escala del año sale sin azul |
| 3 | **Los cuatro papeles de puestos** | `/informes` | 60 | el puesto no se guarda, se calcula: nivelar en enero cambia el de marzo |
| 3 | **Notas perdidas para la comisión** | `/informes` | 45 | una hoja por docente, con columnas en blanco para rellenar a mano |
| 2 | **Cierre 1: definitivas y promovidos** | `/informes-old` | 70 | ⚠ esos dos botones NO están en el menú nuevo; sin ellos el acta sale «Sin definir» |
| 2 | **Cierre 2: el acta de evaluación** | `/informes` | 75 | tarda minuto y medio; puede avisar de descuadre por grupo |
| 3 | **Acta de nivelación** | `/informes` | 65 | dos secciones con reglas distintas, y el asterisco de lo registrado con otra regla |
| 3 | **Planillas y controles del aula** | `/informes` | 55 | mes y columnas se eligen dentro del papel; la orientación, antes de imprimir |
| 3 | **Inasistencias por alumno** | `/informes` | 60 | el % se teclea porque el sistema no tiene fechas de periodo desde 2021 |

### E. Disciplina, convivencia e inclusión

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 2 | **La rejilla de disciplina** | `/disciplina` | 55 | sin grupo elegido los observadores no llevan a ninguna parte; el color es la gravedad |
| 2 | **Registrar una situación** | `/disciplina` | 80 | ordinales y derivantes guardan solos al EDITAR; el resto va con el botón |
| 3 | **Ordinales del manual** | `/ordinales` | 60 | año cerrado = sólo consulta; los quince campos guardan solos, sin botón |
| 3 | **El observador del grupo** | `/disciplina/observador-*` | 60 | abrirlo escribe en la base; los márgenes se ajustan antes de imprimir |
| 3 | **Situaciones por grupos** | `/disciplina/situaciones-por-grupos` | 40 | no pide nada y sale sólo quien tiene algo |
| 2 | **Ruta de inclusión: el grupo** | `/ruta-inclusion` | 70 | hay que pasar por el grupo antes que por la ficha, o subir un documento da 404 |
| 2 | **Ruta de inclusión: las cinco partes** | `/ruta-inclusion/:g/:a` | 75 | quién edita cada parte son tres criterios distintos; sin titular no edita nadie |

### F. Secretaría y matrícula

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 1 | **Crear un alumno** | `/alumnos/nuevo` | 75 | el botón se apaga si hay duplicado; hay que pulsar «No es ninguno de éstos» |
| 1 | **Matricular** | `/matriculas` | 70 | los candidatos salen del grado anterior; mover de 4A a 4B deja notas atrás y lo dice |
| 2 | **El directorio de alumnos** | `/alumnos` | 70 | se guarda al salir de la celda; restaurar de la papelera es por el buscador de abajo |
| 2 | **Prematrículas** | `/prematriculas` | 80 | cinco estados y no cuatro: PREM lo apunta secretaría, PREA la familia |
| 2 | **Requisitos y compromisos del alumno** | `/persona/:id/:tipo` | 65 | los requisitos se llevan por año; marcar quién cumplió es aquí, no en Referencias |
| 2 | **Usuarios: entrar al sistema** | `/usuarios` | 65 | abre vacía a propósito; quien no tiene cuenta no tiene botones, y eso no es un fallo |
| 2 | **El documento como nombre de usuario** | `/alumnos` | 70 | «Revisar» no cambia nada; los que chocan son la lista de trabajo y no se arreglan repitiendo |
| 3 | **La ficha de matrícula** | `/informes` | 45 | abrirla crea los requisitos que falten: es de UN alumno, nunca de un grupo |
| 3 | **Cartera** | `/cartera` | 60 | marca alumnos y aparecen las acciones; el estado de cuenta real no vive en MyVC |
| 3 | **Alumnos duplicados** | `/duplicados` | 80 | «Ver qué se movería» no escribe; unir no se deshace y lo hace un superusuario |
| 3 | **Importar de Excel: hojas y columnas** | `/alumnos/importar` | 80 | el ensayo lee el libro y no escribe nada |
| 3 | **Importar de Excel: decidir y comprobar** | `/alumnos/importar` | 85 | hoy sólo mandan las equivalencias; el informe final marca «No cuadra» |
| 3 | **Acudientes** | `/acudientes` | 45 | ⚠ la entrada se ve y la puerta no deja pasar a una secretaria que no sea superusuaria |
| 3 | **Editar docentes y contratar** | `/profesores` | 60 | editar la ficha es de superusuario; contratar es la columna del año |
| 3 | **Certificados de un alumno** | `/certificados/:id` | 50 | sólo cuentan años matriculado o asistente; un retiro no es un año que certificar |

### G. Montar y llevar el año (rectoría, coordinación, administración)

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 2 | **El orden de montar un año** (mapa, el que se ve primero) | `/colegio` | 90 | qué depende de qué: grupos antes que asignaturas, plantilla antes que la primera nota |
| 1 | **Periodos y los dos candados** | `/colegio/:y/periodos` | 60 | cerrar «Notas y asistencia» deja a todos los docentes sin calificar y sin pasar lista |
| 2 | **Los ajustes del año** | `/colegio/:y/ajustes` | 65 | «Año actual» mueve el colegio entero; cada interruptor se guarda solo |
| 2 | **Asignaturas: quién dicta qué** | `/asignaturas` | 65 | no es un catálogo: decide quién califica a quién. Y el cuadre de IH sale de Grupos |
| 2 | **Plan de evaluación: el modelo** | `/plan-evaluacion` | 60 | cambiarlo no borra ni recalcula nada; y es del año |
| 2 | **Plan de evaluación: la plantilla** | `/plan-evaluacion` | 85 | ⚠ «Aplicar la plantilla» multiplica por todo el colegio, y hay que hacerlo antes de la primera nota |
| 3 | **Niveles, grados y grupos** | `/niveles` `/grados` `/grupos` | 60 | cadena estricta, y la IH del grupo es contra lo que cuadran las asignaturas |
| 3 | **Áreas, materias y directores** | `/areas` `/materias` | 60 | la materia cambia de área arrastrándola; el director es del AÑO y se hereda sin mirar contrato |
| 3 | **La ficha del colegio y el membrete** | `/colegio/:y/ficha` | 60 | aquí no se autoguarda; y las plantillas de certificado son del colegio, no del año |
| 3 | **Imágenes: fotos y firmas** | `/imagenes/*` | 70 | foto ≠ imagen: una sale en el boletín y la otra es el avatar |
| 3 | **Compromiso académico** | `/colegio/:y/compromisos` | 70 | «todavía no ha guardado» no es «está en blanco» |
| 3 | **Frases, ciudades, calendario y muro** | varias | 60 | cuatro pantallas pequeñas en un vídeo |
| 3 | **Votaciones** | `/votaciones/*` | 75 | «actual» e «in_action» se apagan entre ellas; sólo ve la votación quien la creó |
| 3 | **Promocionar notas** | `/promocionar-notas` | 55 | el pareo va por materia y se enseña antes de copiar |

### H. Horario

| ola | vídeo | ruta | s | la duda que mata |
|---|---|---|---|---|
| 3 | **Descargar el programa** | `/horario/programa` | 40 | un 404 aquí es «la carpeta no está montada», no una avería |
| 3 | **Cuadrar el horario** | `/horario/cuadrar` | 50 | el salto lleva tu sesión, pero necesita el clic |
| 3 | **Cuál horario rige** | `/horario` | 55 | subir no es publicar: un borrador y el oficial se pintan igual |
| 3 | **Imprimir el horario** | `/horario/:id/imprimir` | 45 | nada viene marcado; 13 grupos + 12 docentes = 34 hojas |

### LA OLA QUE VA PRIMERO — pedida el 2026-09-28

*Sustituye a la «ola 1» de las tablas de arriba: la pidió Joseth a través de la sesión de
`myvc_front`, que ya está construyendo el botón de ayuda de `app2`.* **25 vídeos en cuatro series**,
y la lista con sus claves, duraciones y capítulos vive en **`CATALOGO-AYUDA.json`**, que es lo que
el front copia a `catalogo-de-ayuda.ts`.

| serie | cuántos | cuándo se usa | pantallas nuevas que hay que dibujar |
|---|---|---|---|
| **Cierre de notas** (8, numerados: cada tarjeta final anuncia el siguiente) | 8 | **ahora**, el cierre de periodo | periodos, notas perdidas, definitivas, nivelación, boletín tipo 1, tablero viejo, promovidos, las dos actas |
| **Docente, día a día** | 8 (2 hechos) | todo el año | portada, planilla con Aus/Tard, comportamiento, disciplina, observador |
| **Montar el año** | 6 | diciembre–enero | asignaturas, grupos |
| **Certificado del año** | 4 | secretaría, todo el año | certificados del colegio, el papel impreso |

**El orden es por calendario y no por gusto:** hoy es finales de septiembre, y lo que los colegios
tienen delante es cerrar un periodo. «Montar el año» no se usa hasta enero, así que va el último
aunque sea el que menos cuesta.

**Lo que NO cabe en 90 s, y se parte:**

- **`certificado-imprimir`** traía cuatro papeles. Se parte en dos: los certificados de estudio, y
  **`constancia-estudio`**, que no lleva ni una nota y es otro papel (el más pedido de secretaría).
- **`cierre-4-boletines`** se queda con sacar el boletín. Los ajustes de impresión y la pila siguen
  siendo sus propios vídeos: los tres juntos pasan de 150 s.

**Aus y Tard, decidido (2026-09-28):** la planilla dibujada ya las tiene, después del Total como en
app2, y el promocional y los dos vídeos de ayuda se volvieron a renderizar con ellas. Sirven a
`docente-asistencia`, `planilla-real-m-r` y `cierre-1`.

**Cuenta de las tablas de arriba:** 5 + 19 + 4 + 13 + 7 + 15 + 14 + 4 = **81 vídeos**. Ola 2: **28**.
El resto, ola 3 o bajo demanda — y «bajo demanda» quiere decir *cuando alguien llame preguntando
eso*, que es la única medida honesta de qué hace falta.

---

## 5. El botón de ayuda dentro de la aplicación

No existe hoy: en `app2` no hay ni un `ayuda` ni un `youtube` en todo el árbol. Lo que sigue es la
forma que encaja con lo que la aplicación ya hace, no una pieza nueva a un lado.

### 5.1 Cada ruta declara su vídeo, como ya declara su permiso y su miga

`app.routes.ts` ya lleva `data: { permiso, miga, panelPropio }`. Se le añade una clave:

```ts
{ path: 'planilla-notas/:asignatura_id', data: { permiso: califica, ayuda: 'planilla-teclear' } }
```

Y un solo fichero, `app2/src/app/cascara/ayuda/catalogo-de-ayuda.ts`, traduce la clave a lo que hace
falta para pintar el diálogo:

```ts
'planilla-teclear': { youtube: 'XXXXXXXXXXX', titulo: 'La planilla: teclear y que quede guardado',
                      segundos: 75, tambien: ['planilla-no-me-deja', 'nivelar-no-es-corregir'] }
```

**Por qué la clave y no el identificador de YouTube directo:** el día que un vídeo se rehace,
cambia el identificador y no hay que tocar treinta rutas. Y la clave se lee en el código: `ayuda:
'nivelar-no-es-corregir'` dice qué enseña; `ayuda: 'dQw4w9WgXcQ'` no dice nada.

### 5.2 Un botón en la barra, y el diálogo dice de qué pantalla es

El botón vive donde ya viven «Ajustes de aspecto» y el buscador: en la barra de la cáscara. Lo que
abre es el vídeo **de la pantalla en la que estás**, con su título y, debajo, los dos o tres
relacionados (`tambien`). El diálogo lleva el mismo `Menú ▸ Sección ▸ Pantalla` que el vídeo, para
que la pieza y la aplicación digan lo mismo.

**Si la ruta no declara `ayuda`, hereda la de su sección del menú** y el botón sigue sirviendo de
algo. Un botón que a veces está apagado enseña a no mirarlo.

### 5.3 Ayuda de un mando concreto, sin hacer otro vídeo

YouTube admite `?start=`. Un vídeo de 80 s con tres momentos sirve a tres botones: el `?` pegado a
«Nota rápida» abre el vídeo de la planilla **en el segundo 38**. En el catálogo eso es una entrada
más con el mismo `youtube` y otro `desde`.

Es lo que hace que 81 vídeos cubran doscientos sitios sin grabar doscientas veces.

### 5.4 El iframe

`https://www.youtube-nocookie.com/embed/<id>?rel=0&modestbranding=1&cc_load_policy=1&start=<n>`

`youtube-nocookie` porque esto se abre dentro de la sesión de un colegio y no hay por qué
sembrarle nada a nadie. `rel=0` para que al terminar no ofrezca vídeos de otro. Y **subtítulos
subidos a mano aunque no haya voz**: son lo que hace que el vídeo se pueda buscar dentro de
YouTube y lo que salva a quien lo ve en un móvil con la pantalla pequeña.

### 5.5 Una puerta más, que es como se hacen aquí las cosas

`check:ayuda`: recorre `app.routes.ts` y una lista de rutas que **tienen que** tener vídeo (las de
la ola 1 primero) y se pone en rojo si alguna se queda sin `ayuda`, o si una clave de `ayuda` no
existe en el catálogo. Lo segundo es el fallo que no avisa: una clave mal escrita deja el botón
mudo y no da error de nada.

---

## 6. Cómo se publica en YouTube

- **Un canal, y los vídeos «ocultos» (no listados), no privados.** Oculto se puede embeber y no
  sale en las búsquedas de YouTube ni en el canal; privado no se puede embeber.
- **Una lista de reproducción por serie** (Docente, Secretaría, Informes, Configuración, Horario).
  Sirve para dos cosas: mandar el enlace de la lista en una capacitación, y que el botón de ayuda
  pueda ofrecer «ver los demás de esta serie».
- **Título con el mismo nombre de la pantalla**: `MyVC · Planilla de notas · Teclear y que quede
  guardado`. Quien busque «planilla myvc» tiene que encontrarlo.
- **Descripción con el camino escrito** (`Menú → Académico → Mis asignaturas → Planilla`) y la
  fecha de la versión de la aplicación que se grabó. El día que la pantalla cambie, esa fecha es lo
  que dice si el vídeo miente.
- **Nada de datos de un colegio real en título, descripción ni imagen.**

---

## 7. Cómo se fabrica un vídeo, en concreto

Con el piloto hecho (apartado 9), un vídeo nuevo son cuatro ficheros y ninguno empieza en blanco:

1. **`src/ayuda/<clip>/datos.ts`** — lo que se ve en la pantalla: nombres inventados, y **la
   geometría**. Si el guion va a señalar un botón, su rectángulo se calcula aquí y no se mide en la
   imagen: es lo que hace que el foco y el puntero no se puedan equivocar de sitio a la vez.
2. **`src/ayuda/<clip>/<Pantalla>.tsx`** — la pantalla, si no está dibujada ya. Si lo está
   --planilla, rúbricas, disciplina, el móvil--, este fichero no existe.
3. **`src/ayuda/<clip>/guion.ts`** — los pasos con sus textos, el ritmo y la tarjeta final. Lleva
   sus propias puertas: `compruebaElGuion()` revienta si un rótulo dura menos de lo que se tarda en
   leerlo, y el clip puede añadir las suyas.
4. **`src/ayuda/<clip>/Escena.tsx`** — encadenar. La cáscara, la pantalla y la capa de ayuda.

Y dos líneas más: registrar la composición en `src/Root.tsx` y su guion en `package.json`.

**Estimación, y es estimación:** un vídeo sobre una pantalla **ya dibujada** es medio día --su guion
y sus tiempos--. Uno que estrena pantalla es uno o dos días, según lo que tenga dentro; una rejilla
con seis columnas no es un formulario de veintiún campos. La ola 1 --doce-- son dos o tres semanas,
y la mitad de ese tiempo es dibujar pantallas que después reutilizan los de la ola 2.

**Y la cuenta que hay que tener delante:** ochenta vídeos dibujados también hay que mantenerlos. La
forma de que eso no se haga imposible es la de este repo desde el principio — **una sola planilla,
una sola cáscara, un solo movimiento**: cuando la aplicación cambie una pantalla, se toca el
componente y **salen de nuevo todos los vídeos que la enseñan**.

---

## 8. Por dónde empezar, si hay que empezar por algo

**Un solo vídeo, entero, antes que el plan de los ochenta:** *«La planilla: teclear y que quede
guardado»*. Tiene todo lo que hay que resolver una vez — la llegada desde el menú, la cabecera de
ubicación, los rótulos sin voz, el foco, la tarjeta final — y es la pantalla que más se usa.

Si ese vídeo funciona en una sala de profesores, los otros ochenta son trabajo. Si no funciona, se
ha perdido un día y no tres semanas.

---

## 9. Lo que ya está hecho

```sh
npm run todo-ayuda        # los dos
npm run ayuda-planilla    # -> out/ayuda/planilla-teclear.mp4   42 s, 7 pasos
npm run ayuda-competencias # -> out/ayuda/competencias-docente.mp4  109 s, 18 pasos
```

### 9.1 El piloto: «La planilla: teclear y que quede guardado»

| | |
|---|---|
| La capa que heredan los ochenta | `src/ayuda/` — `Marco` (cabecera + rótulo + contador), `Foco`, `Tarjeta`, `Cascara`, `tiempos.ts`, `medidas.ts` |
| Este vídeo | `src/ayuda/planilla/` — `guion.ts`, `datos.ts`, `MisAsignaturas.tsx`, `Escena.tsx` |
| La planilla | **`src/notas/Escena.tsx`, la misma del promocional**, con otro `Ritmo` |

**Los siete pasos:** el menú y Académico · Mis asignaturas · los cuatro botones de la fila · la
planilla · el aro al teclear · la espera del lote · los tres aros apagándose con su aviso.

**Tres cosas que este piloto deja decididas para todos los demás**

1. **La cabecera de ubicación no se va nunca**, y los rótulos duran lo que su texto necesita:
   `palabras ÷ 2,5 + 1 s`, con una puerta que revienta en el estudio si no se cumple.
2. **El ritmo de la ayuda no es el del promocional.** El promocional comprime a 0,4 s los tres
   segundos que la aplicación tarda en confirmar; aquí esos tres segundos **son el paso 6**, con su
   rótulo. Y hay una puerta que exige que el lote vuelva exactamente donde empieza el paso que lo
   explica: la primera versión volvía dos segundos antes y el vídeo se desmentía solo.
3. **La geometría se calcula, no se mide.** El foco señalaba «Rúbricas» en vez de «Planilla» porque
   la fila no tenía ancho escrito; el foco y el puntero se equivocaban **juntos**, que es la clase
   de fallo que ningún render delata. Ahora los dos salen del mismo número.

### 9.2 «Calificar por competencias», el segundo — 103 s, diecisiete pasos

*Pedido el 2026-09-22: qué tiene que hacer el docente cuando el colegio califica por competencias,
terminando en el boletín de ese caso.*

| | |
|---|---|
| Pantallas nuevas | `src/ayuda/competencias/` — `Unidades`, `MisDesempenos`, `Informes` (sólo el trozo que se usa) y **el boletín tipo 6** |
| Reutilizado | la cáscara, «Mis asignaturas» y la planilla de `notas/Escena` |
| Nuevo en la capa común | `ayuda/encuadre.ts`: el encuadre de la aplicación y **el de un papel**, con su acercamiento |

**El arco:** lo que cambia (la columna es un instrumento) · lo que escribes (Mis desempeños) · lo
que no cambia (la planilla) · y lo que sale (el boletín).

**Cinco decisiones que dejan reglas para los demás vídeos**

1. **Se salta el tope de 90 s, y está escrito por qué.** La pregunta del docente no es «cómo
   escribo un desempeño», es «y esto para qué»: la respuesta es el boletín. Cortar antes manda a
   buscar un segundo vídeo que nadie busca.
2. **Un papel no se encuadra como una pantalla, y no se lee sin acercarse.** Una Letter entera en
   1080p deja el renglón del boletín en ocho píxeles. Así que el plano general dice «esto es un
   boletín» y después la cámara se acerca a una asignatura. Es la única vez que la cámara se mueve
   en un vídeo de ayuda, y va en `acercamientoAUnaHoja()`.
3. **El vídeo no puede enseñar lo que la aplicación ya no hace.** Dos fuentes del repo siguen
   dibujando un conmutador «Notas | Desempeños» en la planilla que se borró en septiembre, y el
   catálogo sigue prometiendo un boletín con medidor por renglón que ya no existe. El vídeo enseña
   la pantalla de hoy, y el guion dice en su cabecera qué fuentes están desfasadas.
4. **Los números de la pantalla tienen que cuadrar entre sí.** La primera versión ponía la barra en
   «Periodo 2» mientras la franja ámbar hablaba del 3. Se arregló **pulsando el periodo 3 en
   pantalla**, que además es como pasa de verdad: la franja no sale porque toque, sale porque los
   dos números dejaron de coincidir.
5. **Una hoja de demostración se llena.** Un boletín con cuatro asignaturas y dos tercios en blanco
   no se reconoce como el papel que el colegio imprime. Las dos áreas del final no se leen en el
   vídeo: están para que la hoja se vea llena.

**Y dos fallos que se vieron mirando el vídeo montado, no leyendo el código** *(2026-09-23)*

- **Una pantalla no se desmonta a mitad de su salida.** «Logros» empezaba a irse al pulsar el menú y
  se desmontaba diez fotogramas después: **341.935 píxeles desaparecían de un fotograma al
  siguiente** --medido entre el 798 y el 801-- y se veía como un salto de líneas. Ahora cada
  pantalla se queda montada hasta que termina de irse, y las dos conviven unos fotogramas.
- **Un papel no se reescala poco a poco.** El acercamiento al boletín hacía parpadear sus filetes:
  a la escala del plano general miden medio píxel, y al mover la escala se dibujan en unos
  fotogramas y en otros no. Ahora son **dos planos quietos encadenados**. La prueba de que eso no
  parpadea está medida: dos fotogramas seguidos de una pantalla quieta salen **idénticos byte a
  byte**.

**Cómo se buscan estos fallos, para la próxima.** No se ven leyendo el código y no los caza ninguna
puerta: se miran **dos fotogramas seguidos y se restan**. Si en una parte quieta hay un solo píxel
distinto, algo se mueve que no debería; si en una transición hay cientos de miles con un salto
grande, algo aparece o desaparece de golpe. El apaño que se usó está en
`scratchpad/diff/leer.py` de la sesión: decodifica dos PNG con `zlib` --sin dependencias-- y
enseña qué filas cambian y cuánto.
