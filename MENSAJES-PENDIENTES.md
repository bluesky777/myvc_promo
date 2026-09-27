# Lo que el texto promocional debe decir

**Dictado por Joseth el 2026-09-04. Sin trabajar: está tal cual lo dijo.**

**Es la lista del VÍDEO COMPLETO**, dicho por él: el vídeo grande lleva clips de todo --la
aplicación, el portal de la Unión y el programa de horarios--, así que estos argumentos no son de
una sección, son del conjunto. No es todavía un guion, ni
un orden, ni una redacción — es la lista de lo que el vídeo (o el texto que lo acompañe) tiene que
llegar a decir. Convertirlo en frases y repartirlo entre clips es un paso posterior, y él lo pidió
así expresamente: *«todavía no me ayudes, sólo anota»*.

1. **App lista para instalar desde la Play Store y la App Store.**

2. **Modificaciones al portal para adaptarse a nuevos deseos de la Unión.**

3. **Transferencia de alumnos con su historial de colegio a colegio.**

4. **Integración con sus programas, como SunPlus y más.**

5. **Los colegios usan programas piratas de horario**, lo cual es peligroso, ilegal y nada ético.

6. **Comparación no sólo entre colegios adventistas de manera anónima, sino con la media nacional.**

7. **Certificados con QR.**

---

Cuando se trabaje, tener presente lo que ya está decidido y escrito en el `LEEME.md`:

- lo que el vídeo **afirma** tiene que ser verdad, aunque el tamaño y el sitio se muevan;
- que algo no esté desplegado en los quince colegios **no frena** un clip;
- las cifras que no estén medidas no se citan como medición.

---

## Qué de esto ya tiene pantalla diseñada

Las pantallas son las del portal de la UCN (`~/DESARROLLOS/myvc_ucn/diseno/`); el número es su sitio
en el guion de esa sección.

| punto | ya existe | qué falta |
|---|---|---|
| 3 · Traslado con historial | **`12` Traslado entre colegios** — está en el núcleo del guion | **animado**: primer acto de `UCN-Red-Conectada`, en diagrama y no en captura |
| 4 · Integración con SunPlus | **`9` Cartera y SunPlus** | **animado**: tercer acto de `UCN-Red-Conectada` |
| 6 · Comparación con la media nacional | **`7` Comparador ciego** — hoy compara a cada colegio **contra los otros doce**, sin ver el nombre de ninguno | **la media nacional no está**: hay que decidir de dónde sale el dato (¿Saber 11 del ICFES?) y si se puede citar |
| 7 · Certificados con QR | **`13` Certificados con QR** | **animado**: segundo acto de `UCN-Red-Conectada` |
| 1 · App en Play Store y App Store | **`15` la red en el móvil** enseña el móvil usándose | **no dice que se instala desde las tiendas**; es un argumento nuevo |
| 2 · Modificaciones según lo que pida la Unión | — | es una promesa de servicio, no una pantalla |
| 5 · Programas piratas de horario | — | es argumento del **clip de horarios**, no del portal |

**El punto 6 es el único que pide algo que hoy no existe.** El comparador enseña a un colegio contra
los otros doce de la red, anónimos. Compararlo con la **media nacional** es otro dato, de otra
fuente, y hay que saber cuál antes de dibujarlo: una media nacional inventada en un vídeo es
exactamente el tipo de cifra que no se puede defender en la reunión siguiente.

---

## Lo comercial, corregido el 2026-09-04

**El 30 % es para la UNIÓN, no para cada colegio.** El documento de decisiones del portal decía lo
contrario y ya está corregido (`myvc_ucn/docs/03-decisiones.md`). Vuelve a la Unión el 30 % de lo que
paguen sus colegios.

**La mecánica está abierta y es fiscal, no de producto**: o el colegio le paga a él y él le devuelve
a la Unión, o el colegio le paga a la Unión y ésta le paga a él menos ese 30 %. **En el vídeo no se
dice la mecánica**, se dice a quién le llega el dinero.

**El portal no se cobra.** Es lo que la Unión recibe por hacer suyo el sistema: nadie lo pagaría si
la Unión adopta MyVc como su sistema oficial de notas. Eso es un argumento de venta por sí solo y
todavía no está en ninguna pieza.

## El estado real de cada cosa que se promociona — comprobado el 2026-09-04

Esto es lo que decide qué se puede afirmar y en qué tiempo verbal:

| | estado |
|---|---|
| La aplicación (notas, disciplina, asistencia, móvil) | **funciona y está desplegada** en los colegios |
| El programa de horarios | **funciona**, es otro programa de escritorio |
| Las rúbricas | en `main`, **sin subir colegio por colegio** |
| **El portal de la UCN** | **NO EXISTE**: no hay ni una línea de código. Cero rutas y cero migraciones en `8myvc`, y `myvc_ucn` sólo tiene diseños y documentos |

**El portal es un diseño, no un producto**, y eso no es lo mismo que «hecho pero sin desplegar».
Montado junto a los clips de la aplicación --que sí es real-- el que mira dará por hecho que las dos
cosas existen. La forma de que la promesa siga siendo verdad **sin quitar la sección** es que el
rótulo que abre la sección del portal la presente como **lo que la Unión recibe** y no como algo que
ya está funcionando.

---

## Redacciones propuestas — anotadas el 2026-09-04

### La tarjeta del 30 %, redactada de nuevo — **APLICADA el 2026-09-07**

Problema de la que había: decía **«30 % de descuento»**, y **a la Unión no se le puede descontar nada
porque la Unión no paga nada**. Un descuento sólo significa algo para quien tiene una factura
delante. Lo que de verdad ocurre es que una parte de lo que pagan los colegios vuelve a la Unión.

Lo que dice ahora la tarjeta, y lo dicen las dos piezas donde sale porque está dibujada una sola vez
(`src/piezas/Oferta.tsx`, texto en `src/piezas/datos.ts`):

> **30 %**
> de lo que paguen sus colegios vuelve a la Unión
> ──
> Si adoptan el ecosistema como el oficial de la UCN
> Y el portal administrativo no se cobra: es lo que reciben por hacer suyo el sistema

**El remate de abajo puede que sea el argumento más fuerte de todos --el portal no se le vende a la
Unión, se le da por adoptar el sistema--, y ya está en pantalla.**

Las otras dos redacciones de esta sección **siguen sin aplicar**.

### Los documentos de la junta

Lo que se puede decir sin exagerar nada:

> **La Unión llega a su junta con el informe hecho.** El mismo panel que se mira todo el año, cortado
> a una fecha y sacado en páginas que se reparten en la mesa. Nadie junta quince correos ni copia
> números a mano.

**Lo que NO se dice: «en tiempo real».** El diseño es una foto por noche, así que el informe está al
día **de anoche** y sólo de los colegios conectados. Dicho sin el «tiempo real» sigue siendo enorme
--hoy eso son semanas de trabajo de alguien-- y no deja flanco en la primera pregunta incómoda.

### El rótulo que abre la sección del portal

Tiene que presentarla como **lo que la Unión recibe**, no como algo que ya funciona: es lo que
mantiene cierta la promesa cuando la sección va detrás de los clips de la aplicación, que sí es real.
Algo del tipo «Lo que la Unión tendrá encima de lo que ya usan sus colegios». Va con la piel del
portal --papel crema--, no con el azul de MyVC.

---

## Huecos de producción del guion — interno, 2026-09-04

**No van en el guion.** El vídeo es una propuesta y ahí todo se presenta como listo; esto es lo que
hay que resolver de este lado para que eso sea verdad en pantalla.

Medido contando las palabras de cada bloque a 150 por minuto y comparándolo con la duración real del
fichero renderizado:

| bloque | voz | clip | hueco |
|---|---|---|---|
| 1 · Notas y rúbricas | 24 s | 20 s | faltan 4 s de clip |
| 2 · Disciplina | 30 s | 27 s | faltan 3 s |
| 3 · Móvil | 28 s | 19 s | **faltan 9 s** |
| 6.3 · Comparador | 15 s | 13 s | faltan 2 s |
| 5 · Rótulo de sección | 6 s | — | **la pieza no existe** |
| 6.7 · Traslados, QR, SunPlus | 40 s | 26,7 s | faltan 13 s |
| 7 · El trato | 38 s | 20,0 s | faltan 18 s |

**6.7 YA TIENE CLIP** (`UCN-Red-Conectada`, hecho el 2026-09-06). No son tres clips cortos de las
pantallas `12`, `13` y `9`: es **un diagrama de tres actos** --el traslado de una alumna con su
historial, el certificado que alguien comprueba con el móvil, y MyVC y SunPlus mandándose datos en
los dos sentidos--, porque las tres cosas pasan *entre* dos sitios y una captura de cualquiera de los
dos extremos no enseña lo de en medio.

**Lo que le sigue faltando son unos trece segundos**, y son los del último párrafo de la voz: «el
portal se adapta a lo que la Unión pida». Eso es una promesa de servicio y no una pantalla --ya está
anotado arriba, punto 2--, así que o se dice sobre el final del diagrama, o se recorta del guion.

**El punto 7 tiene pieza desde el 2026-09-07** (`Trato`, 20 s): las tres razones del guion llegando
una a una, y detrás la tarjeta del 30 % con el texto ya corregido. Él la pidió de veinte segundos y
dura veinte; la voz del bloque mide treinta y ocho, así que **o se alarga la pieza --las tres razones
aguantan más tiempo juntas, es un número en `piezas/guion.ts`-- o se acorta lo que se dice**.

Los clips que se quedan cortos se arreglan alargando su `guion.ts` y volviendo a renderizar.

**Y el vídeo dura 5:42, que es largo para una reunión.** Si hay que recortar, el primer sitio es 6.7.
