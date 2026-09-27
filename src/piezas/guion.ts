/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL RITMO DE LAS TRES PIEZAS.
 *
 * SON CORTAS A PROPÓSITO. Una portada de diez segundos en un vídeo de venta es diez segundos en los
 * que nadie ha visto todavía el producto. La portada dura lo que se tarda en leerla dos veces, y la
 * tarjeta lo que se tarda en creerse el número.
 *
 * Y NINGUNA TERMINA EN NEGRO: cada una se va con el mismo movimiento escalonado de los clips, así
 * que el montador puede encadenarlas sin poner una transición encima.
 */

export const FPS = 30;

/* ── PORTADA: 5,5 s ────────────────────────────────────────────────────────────────────────── */
export const P_RAYA = 6;
export const P_TITULO = 16;
export const P_POR_TECLA = 3;
export const P_BAJADA = 66;
export const P_PILDORAS = 84;
export const P_PASO_PILDORA = 7;
export const P_SALIDA = 132;
export const P_PASO_SALIDA = 4;
export const DURACION_PORTADA = 165;

/* ── TARJETA: 6,5 s ────────────────────────────────────────────────────────────────────────── */
export const T_TARJETA = 6;
/** El número sube de 0 a 30 mientras entra: un número que se cuenta se mira, uno que aparece se lee. */
export const T_CUENTA = 18;
export const T_FIN_CUENTA = 48;
export const T_TITULAR = 52;
export const T_CONDICION = 68;
export const T_PIE = 110;
export const T_SALIDA = 158;
export const T_PASO_SALIDA = 5;
export const DURACION_TARJETA = 195;

/*
 * ── EL TRATO: 20 s ───────────────────────────────────────────────────────────────────────────
 *
 * ES LA PIEZA MÁS LARGA DE LAS CUATRO, y tiene por qué: las otras tres dicen una cosa cada una y
 * ésta dice cuatro --tres razones y la oferta--. Aun así se reparte a la contra de lo que parecería:
 * **las tres razones ocupan siete segundos entre las tres y la tarjeta ocupa ocho ella sola**, y es
 * a propósito. Las razones se leen de un vistazo porque son un titular cada una; la cifra hay que
 * creérsela, y eso lleva más tiempo que leerla.
 *
 * LAS TRES SE QUEDAN JUNTAS EN PANTALLA casi dos segundos antes de irse. Si cada una se fuera al
 * llegar la siguiente, lo que se vería son tres cosas; juntas se ve **una oferta de tres patas**,
 * que es lo que el bloque tiene que dejar dicho.
 */
export const TR_ENCABEZADO = 8;
export const TR_POR_TECLA = 1.6;
export const TR_RAZONES = 84;
export const TR_PASO_RAZON = 46;
/** Se van el encabezado primero y las tres detrás, de izquierda a derecha. */
export const TR_SALEN_RAZONES = 258;
export const TR_PASO_SALE_RAZON = 7;

export const TR_TARJETA = 296;
/*
 * EL NÚMERO EMPIEZA A SUBIR MIENTRAS LA TARJETA TODAVÍA ENTRA, y no después. Si esperase a que la
 * tarjeta estuviera puesta, se leería medio segundo de **«0 %»** en una tarjeta de oferta, que es la
 * peor media frase posible de las que puede enseñar esta pieza.
 */
export const TR_CUENTA = 298;
export const TR_FIN_CUENTA = 344;
export const TR_TITULAR = 352;
export const TR_CONDICION = 370;
export const TR_PIE = 404;
export const TR_SALIDA = 520;
export const TR_PASO_SALIDA = 5;
export const DURACION_TRATO = 600;

/* ── CIERRE: 6 s ───────────────────────────────────────────────────────────────────────────── */
export const C_TITULO = 10;
export const C_POR_TECLA = 3;
export const C_REMATE = 58;
export const C_CONTACTO = 76;
export const C_PASO_CONTACTO = 9;
export const C_SALIDA = 146;
export const C_PASO_SALIDA = 5;
export const DURACION_CIERRE = 180;
