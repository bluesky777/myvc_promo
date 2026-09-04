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

/* ── CIERRE: 6 s ───────────────────────────────────────────────────────────────────────────── */
export const C_TITULO = 10;
export const C_POR_TECLA = 3;
export const C_REMATE = 58;
export const C_CONTACTO = 76;
export const C_PASO_CONTACTO = 9;
export const C_SALIDA = 146;
export const C_PASO_SALIDA = 5;
export const DURACION_CIERRE = 180;
