# Advertencias de los vídeos de ayuda

*2026-09-29. Las pidió Joseth: que los vídeos avisen de los errores que un usuario puede cometer,
sobre todo los graves. Las sacó `myvc-front-74` leyendo el código de app2 y del backend (tiene los
file:line). En cada línea: clave · el error · qué pasa de verdad · qué hacer en su lugar.
[IRREVERSIBLE] = no se puede deshacer desde la aplicación: en el vídeo va como paso `rojo: true`.*

## Secretaría

- **alumnos-directorio** · Borrar al alumno para sacarlo del colegio o al cambiar de año · La ficha va a la papelera; sus notas, matrículas y faltas se quedan · **LA REGLA DE JOSETH: los alumnos no se borran nunca, ni al cambiar de año ni cuando se van. Se retiran (o se marcan desertores) en Matrículas; al año siguiente sólo se eligen para continuar, o se ignoran.** Borrar sólo sirve para una ficha creada por error.
- **matricular** · Retirar para corregir un error · Sólo pone el estado «retirado» y la fecha; se deshace con Rematricular · Retirar es el camino para quien se va, no para corregir.
- **matricular** · Mover al alumno de grupo a mitad de año · Sus definitivas se quedan en las asignaturas del grupo viejo: el boletín del grupo nuevo le sale en blanco; las notas de indicadores no viajan nunca · Después de mover, «traer notas del grupo anterior» y revisar lo que va a pisar.
- **matricular** · «Eliminar notas del periodo» en el detalle de la matrícula · [IRREVERSIBLE] Borra todas sus notas de todas las asignaturas de ese periodo · Nunca para corregir: se edita la nota.
- **matricular** · «Eliminar matrícula» en el detalle · [IRREVERSIBLE] Sin papelera · Retirar.
- **prematriculas** · Quitar una prematrícula · Se borra sin papelera, pero no arrastra nada · «Si la quitas por error, vuelve a apuntarlo.» (sin rojo)
- **prematriculas** · Prematricular sin haber creado el año siguiente y sus grupos · Da error · Primero el año nuevo y sus grupos.
- **duplicados** · Unir dos fichas eligiendo mal cuál se queda · [IRREVERSIBLE] Pasa todo (unas 27 tablas) a una ficha y manda la otra a la papelera; no hay «separar» · Siempre «Ver qué se movería» antes, y mirar cuál se queda con todo.
- **importar-hojas / importar-decidir** · Subir un Excel con columnas vacías · Si el documento ya existe, sobrescribe la ficha y la celda vacía BORRA el dato, salvo que se marque «conservar» en esa columna. Si el documento cambió (RC→TI), crea otro alumno: un duplicado sin aviso · Hacer el ensayo, marcar «conservar» y corregir documentos antes.
- **cartera** · Subir el Excel de cartera sin la columna de paz y salvo o con otro texto · Todo lo que no diga «si» deja al alumno sin paz y salvo, y el acudiente NO puede ver el boletín; no guarda el valor anterior · Revisar las columnas antes de subir.
- **usuarios** · Resetear una contraseña · [IRREVERSIBLE] La anterior se pierde · Avisarle al usuario su clave nueva.
- **documento-usuario** · «Contraseña igual para todos los alumnos/acudientes» · [IRREVERSIBLE] Cambia de un golpe la clave de TODOS los alumnos (o acudientes) del colegio · Reset de uno en uno, salvo que de verdad se quiera cambiar a todos.

## Montar el año

- **ajustes-del-ano** · Marcar como actual el año equivocado · Apaga los demás años; a todos se les pone el periodo de ese año en su siguiente entrada, y matricular sin año usa ese · Sólo al arrancar el año nuevo, con sus periodos creados. Se puede volver atrás.
- **ajustes-del-ano** · Eliminar un año · Papelera; el definitivo arrastra 59 tablas · No borrar un año con datos.
- **asignaturas-copiar** · Copiar asignaturas a un grupo que ya las tiene · Las inserta otra vez y quedan DUPLICADAS · Copiar sólo a grupos vacíos.
- **asignaturas-modificar** · Borrar una asignatura con notas · Papelera; las notas se quedan · Se restaura desde la Papelera.
- **grupos-crear** · Borrar un grupo · Sólo un superusuario; no hay botón de restaurar · No borrar grupos con alumnos.
- **plan-evaluacion-plantilla** · «Aplicar la plantilla» con reemplazar a mitad de año · No borra notas, pero reescribe nombres y porcentajes y CAMBIA las definitivas de los ya calificados · Aplicarla antes de la primera nota.
- **promocionar-notas** · Copiar definitivas encima de otras · Pisa la de destino y la deja fija: ya no se recalcula sola · Leer el aviso de «pisaría» antes.
- **votaciones** · Borrar una elección, un candidato o una mesa · No hay restaurar; las mesas, ni papelera · Desactivar en vez de borrar.

## Certificado

- **certificado-membrete** · Borrar un membrete o plantilla · [IRREVERSIBLE] Es del colegio, no del año: afecta a todos los años que la usen · Crear una nueva en vez de borrar la que está en uso.

## Docente

- **unidades-100 / competencias-docente** · Borrar un indicador con notas · Papelera, y recalcula las definitivas · Se restaura desde la papelera de la asignatura (restaurar vuelve a recalcular).
- **unidades-100** · Cambiar porcentajes después de calificar · Recalcula las definitivas de todo el grupo al guardar · Fijar los pesos antes de calificar.
- **copiar-unidades** · Copiar unidades a una asignatura que ya tiene las suyas · Las AÑADE: los porcentajes pasan de 100 · Copiar sólo a asignaturas vacías.
- **sin-internet-subir-columnas** · (CORREGIDA por front) Celda vacía = no se toca, nunca; guion (-) = borra la nota (si cambió en el sistema, sale como choque y por defecto manda el sistema); texto = paso «Celdas», nunca borra. Faltas: un número menor NO borra solo: bloque «Se borran · N filas», aviso «Borrar una ausencia se lleva su fecha, y no vuelve», casilla «Sí, bórralas» desmarcada · «Para borrar una nota escribe un guion; vacía no borra. Las faltas sólo se borran si marcas «Sí, bórralas»: la fecha borrada no vuelve.»
- **docente-situacion** · Borrar una situación de disciplina · No hay restaurar · Editarla; borrar sólo lo registrado por error.

## Cierre

- **cierre-2-candados** · OJO: desde el 23 sep los candados son un **semáforo de 4 tramos por periodo** (Calificando / + nivelando / Nivelando / Cerrado), no dos interruptores ni la columna «Notas y asistencia». El vídeo está desfasado. Detalle en la sección «Entrega de notas».
- **cierre-2-candados** · Cerrar con «Poner en cero las N casillas vacías» · Todo lo que falta cuenta como 0; en un colegio fueron 3.094 casillas en dos cierres · Revisar primero la lista de lo que falta.
- **cierre-2-candados** · «Poner en curso» el periodo equivocado · Sin confirmación: todo el colegio cambia de periodo al instante · Volver a ponerlo; reversible, pero todos lo notan.
- **cierre-2-candados** · Borrar un periodo · No hay restaurar · No borrar nunca; pedir ayuda a soporte.
- **cierre-1-quien-falta** · Teclear la definitiva a mano para corregirla · Queda fija: ya no cambia aunque cambien las notas · Corregir la nota del indicador; si ya se tecleó, quitar la marca de manual y se recalcula.
- **cierre-1-quien-falta** · «Recalcular definitivas» · Es seguro, pero no toca las tecleadas a mano ni las niveladas.
- **cierre-3-nivelaciones** · Nivelar cuando se quería corregir · Queda como nivelada (original + nivelación) en el boletín y la constancia · Si fue un error al teclear, se corrige la nota.
- ~~cierre-5-recuperacion~~ · RETIRADA: app2 no ofrece eliminar una recuperación en ninguna pantalla.
- **cierre-8-acta-nivelacion** · El acta de nivelación no pide periodo: usa el del selector de arriba · Mirar arriba antes de imprimir.
- **cierre-6** · «Recalcular» conserva las «manual» y las «recuperadas» (las recuperadas son las niveladas).

## Vídeo nuevo: «Entrega de notas» (serie informes)

Pedido por Joseth: el vídeo principal para el día de la entrega. Primero bloquear la edición
docente; después, lo que conviene imprimir según el periodo.

**A. Bloquear la edición docente.** Menú ▸ Configuración ▸ El colegio ▸ pestaña «Periodos»
(`/colegio/:yearId/periodos`), título «Periodos de 2026». Cada fila «Periodo N», el en curso con
etiqueta azul «en curso». Semáforo de 4 tramos, de izquierda a derecha: «Calificando» (notas y
asistencia) · «+ nivelando» (notas, asistencia y nivelar; con el que nace un periodo) · «Nivelando»
(nivelar lo perdido y definitivas) · «Cerrado» (sólo mirar). Debajo, «Profesores: …». Notas y
asistencia se cierran JUNTAS. Pasar a Nivelando o Cerrado abre «Cerrar el periodo N de 2026»:
«Mirando qué falta por calificar…» → «Todo calificado» o la lista asignatura · grupo · docente ·
casillas vacías; botón «Publicar un aviso en el muro»; «X de Y asignaturas ya las cerró su
docente»; si el año califica vacías como cero, casilla «Poner en cero las N casillas vacías»; pie
«Dejarlo abierto» / «Cerrar el periodo N». Otros cambios de tramo: «Periodo N a «X»: los
profesores …» con «Cambiar» / «Dejarlo como está». En la fila también «boletines» → «poner»: la
fecha de entrega. **Advertencia:** «Poner en curso» (otra fila) NO pide confirmación: en la entrega
no se toca.

**B. Lo que se imprime.** Menú ▸ Informes (`/informes`), buscador «¿Qué necesitas imprimir?…».
Familias: Para la familia / Para el aula / Cómo va el grupo / Cifras y tendencias / Quién vino /
Convivencia e inclusión / Cierre de año / Horario / Secretaría y dirección. En cada informe:
«¿Para quién?» (Todo el grupo / Los alumnos que marque), «Grupo» (a veces «Todos los grupos»),
en los acumulados «Calcular hasta el periodo». Botones «Cargar el informe» y «Añadir a la pila de
impresión» (hasta 20, una sola impresión). **Advertencia clave:** boletines, semáforo y notas del
año NO preguntan el periodo: usan el del selector de arriba («2026 · Periodo 3»). Antes de
imprimir, comprobar que arriba está el periodo que se entrega.

1. «Boletín del periodo» (Para la familia). Grupo; la pila para varios grupos.
2. Si es el 4.º: «Boletín final» (Cierre de año), «Calcular hasta el periodo» = 4.
3. Si es el 3.º: «Nota que necesita en el periodo 4» (Cómo va el grupo, `/informes/nota-faltante`), grupo o «Todos los grupos». Es la «planilla de faltantes».
4. Para la comisión: «Notas perdidas de todos» (apaisado) o «Notas perdidas del profesor».
5. «Puestos por periodo» y «Puestos por año» (Cómo va el grupo), un grupo o «Todos los grupos». El de año pide «Calcular hasta el periodo».
6. «Asistencia de padres» (Quién vino): la planilla de firmas de la entrega. No pide nada.
7. Opcionales: «Semáforo académico», «Citación al acudiente», «Constancia de estudio».

NO EXISTEN, no prometerlos: paz y salvo (lleva a Cartera), cuadro de honor. La sábana
(«Consolidado del grupo») no se imprime desde Informes.

## El historial de notas (YA ESTÁ: backend 8myvc a90c3b8, front cc1ad46c; falta desplegar)

El docente ve el historial de SUS asignaturas. En la planilla, última columna «Historial» (tooltip
«Última vez que se cambió algo de esta fila: notas, definitiva, faltas o frases de esta asignatura
en este periodo»); cada celda es un enlace con reloj y fecha («14 sep 2026, 3:27 p. m.») o «sin
cambios». Al pulsarlo: diálogo «Historial de {apellidos nombres}» con la foto, «Última edición según
la fila: …», «De la más reciente a la más antigua», columnas Cuándo | Quién | Qué | Valor. Enseña
TODO lo que se le hizo a esas notas, también lo que cambió coordinación o un administrador. En la
barra, la casilla «Historial»: marcada, doble clic en una nota abre Cuándo | Quién | Antes | Después.
Lo mismo en Definitivas por periodo, Nivelaciones y rúbricas (asignaturas suyas).

Frase: «El historial siempre deja ver tu actividad: cada cambio a tus notas, tuyo o de otra
persona, queda con su nombre y la hora.» Fila de ejemplo (nombre inventado de Los Almendros):
14 sep 2026, 3:27 p. m. · <coordinadora inventada> · Editó nota — <indicador del vídeo> · P3 · 42.

## El paso de año por la vía rápida (Joseth, 2026-09-29)

Si el colegio no usa Estaciones del día, la vía rápida está en Alumnos: se miran los alumnos del año
pasado de ese grupo, también los retirados, y ahí mismo se matriculan o se desmatriculan. Así
continúan al año siguiente sin borrar a nadie. No se dice «si es un colegio pequeño»: se presenta
como la opción rápida. Los nombres exactos de los botones los confirma `myvc-front-74`.

**Cómo es en app2** (`myvc-front-74`, leyendo el código): Menú ▸ Personas ▸ Alumnos (`/alumnos`),
selector de grupo arriba («Elige un grupo para ver sus alumnos.»), botón «Recargar». Rejilla
principal: matriculados de este año, pie «Alumnos: N». «Ver retirados y desertados (N)»: los de
ESTE año. **«Ver alumnos sin matrícula (N)»** es el año pasado: todos los que estuvieron en el grado
anterior, en cualquier estado, retirados incluidos; texto en pantalla «Vienen del grado anterior y
todavía no tienen matrícula este año…». Columna «Matrícula» por fila, sin acción en bloque ni
confirmación: en «sin matrícula», «Asis» / «Matric» / «…» («Matric» → «Alumno matriculado con
éxito.», la fila pasa a la principal; «…» = otro grupo). En la principal y retirados: «Prem»,
«PreA», «Matr», «Asis», «Reti», «Dese», con el estado actual hundido; al pulsar, «Guardado.».
Desmatricular = «Reti» (se fue) o «Dese» (desertó); «Matr» lo devuelve. No hay filtro de año ni
botón «desmatricular».

Advertencias:
- Antes de «Matric», el año de arriba tiene que ser el NUEVO; si no, lo matricula en el año pasado.
- La papelera roja de «Acciones» («Enviar a la papelera») NO es retirar: borra al alumno. Se confunde con «Reti».
- Los repitentes no salen en «sin matrícula» (estaban en el mismo grado): se matriculan con «…» o buscándolos.
- Si ya está en 6B, sigue saliendo en la lista de 6A, y «Matric» lo cambiaría de grupo.
- Sin verificar: según el código, sólo un superusuario o quien tenga permiso de editar alumnos puede matricular o retirar; una secretaria normal recibiría «No tiene permisos para editar». Pendiente de Joseth.
