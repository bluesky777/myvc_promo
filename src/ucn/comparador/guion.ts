/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DE «COMPARADOR».
 *
 * LO QUE CUENTA: un colegio se ve **contra los otros doce sin ver el nombre de ninguno**. Y ésa no
 * es una limitación técnica: es lo que hace que la pantalla se siga abriendo. Un comparador con
 * nombres se convierte en una lista de agravios y deja de mirarse a la semana.
 *
 *   1  LOS DOCE GRISES     entran primero, y son sólo puntos: nadie sabe cuál es cuál
 *   2  TU PUNTO            entra después, en color, y encima el número
 *   3  SEIS INDICADORES    y en dos de ellos el punto de color está el último
 *   4  LA DISTANCIA        lo mismo en una cifra, a un lado y a otro de la mediana
 *   5  QUIÉN VE QUÉ        tres niveles, y por eso funciona
 *
 * EL TERCERO ES EL QUE HACE HONESTA LA PANTALLA: si los seis indicadores salieran en verde, esto
 * sería un anuncio. Dos en rojo --y bien visibles-- es lo que hace creíbles los otros cuatro.
 */

export const FPS = 30;

export const MARCO = 0;
export const SELECTOR = 26;
export const CARD = 44;

/** Los grises de cada fila, y después el punto de color. */
export const GRISES = 62;
export const PASO_FILA = 20;
export const MIO = 78;

/*
 * «QUIÉN VE QUÉ» ENTRA CUANDO YA ESTÁN LOS SEIS INDICADORES, no antes: primero se ve que la
 * comparación es anónima, y sólo después se explica quién puede ver qué. Al revés sería una
 * advertencia legal delante de un gráfico que todavía no se ha visto.
 */
export const CARD_NIVELES = 218;
export const NIVELES_ENTRAN = 232;

export const SALIDA = 340;
export const DURACION = 384;
