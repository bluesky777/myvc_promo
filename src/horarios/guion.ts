/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL CLIP DE HORARIOS. **Tres pantallas del programa de escritorio**, encadenadas:
 *
 *     ACTO 1  LA DISPONIBILIDAD   el salón «Iglesia»: se marca ✕ toda la semana menos dos horas
 *     ACTO 2  LA REJILLA          se mueve una lección; la que estaba se va a la bandeja
 *     ACTO 3  GENERAR             el botón, la barra y el veredicto entero
 *     ACTO 4  EL INFORME          el horario del grupo tal como sale impreso, con sus dibujos
 *
 * LOS CUATRO CUENTAN UNA SOLA COSA, y por eso van seguidos: **primero se le dice al programa lo que
 * no puede hacer, luego se retoca a mano, y sólo entonces se le pide que cuadre el resto**. Al revés
 * --generar primero-- es lo que hace que un coordinador desconfíe del resultado.
 */

export const FPS = 30;

/* ── ACTO 1: la disponibilidad del salón ─────────────────────────────────────────────────── */

export const D_TITULO = 8;
export const D_LISTA = 26;
export const D_PASO_LISTA = 6;
export const D_TABLA = 54;

export const D_CURSOR = 74;
/** Las ✕ van cayendo en orden de lectura. Dos fotogramas por casilla: es un barrido, no 33 clics. */
export const D_MARCAS = 90;
export const D_POR_MARCA = 2;
/** Y la cuenta de la lista sube cuando termina. */
export const D_CUENTA = 162;

export const D_SALIDA = 196;
export const D_PASO_SALIDA = 4;

/*
 * ── ACTO 2: la rejilla ─────────────────────────────────────────────────────────────────────
 *
 * CADA PANTALLA ENTRA CUANDO LA ANTERIOR YA SE FUE DEL TODO, y esto está medido en un fotograma, no
 * calculado: con la rejilla entrando a los 232 se veían **las dos tarjetas encimadas** --el marco
 * vacío del informe encima de la rejilla a medio desvanecer, con el renglón de relato flotando por
 * encima--. En pantalla eso no se lee como una transición: se lee como un error de la aplicación,
 * que es lo peor que puede enseñar un vídeo promocional.
 *
 * La cuenta de cuándo se ha ido una pantalla: la última fila sale en `SALIDA + índice × paso + 14`,
 * y el panel se recoge después, en `SALIDA + 30 … SALIDA + 46`. La siguiente entra pasado eso.
 */

export const R_PANEL = 250;
export const R_CABECERAS = 268;
export const R_FILAS = 288;
export const R_PASO_FILA = 6;

export const R_CURSOR = 334;
/** Clic en la ficha: se coge. La rejilla se pinta entera de verde, ámbar y rayado. */
export const R_COGE = 354;
/** Llega a la casilla ocupada de otra hora. */
export const R_SOBRE_DESTINO = 390;
/** Y ahí canjea: la que llevaba baja, y **la que estaba sube a la mano**. */
export const R_CANJEA = 398;
/** Se lleva la desalojada a la bandeja y la suelta. */
export const R_SOBRE_BANDEJA = 428;
export const R_SUELTA = 436;

/* ── ACTO 3: generar ──────────────────────────────────────────────────────────────────────── */

export const G_CURSOR = 458;
export const G_CLIC = 474;
export const G_BARRA = 480;
export const G_FIN_BARRA = 564;
export const G_VEREDICTO = 570;

export const R_SALIDA = 658;
export const R_PASO_SALIDA = 4;

/* ── ACTO 4: el informe ───────────────────────────────────────────────────────────────────── */

export const I_PANEL = 716;
export const I_CABECERA = 724;
export const I_FILAS = 746;
export const I_PASO_FILA = 7;

export const SALIDA = 910;
export const PASO_SALIDA = 4;

export const DURACION = 980;
