/*
 * LOS COLORES SON LOS DE LA APLICACIÓN, no unos parecidos. Salen de `app2/src/styles.scss` y de
 * `app2/src/app/comunes/estilos/casilla-de-nota.scss`.
 *
 * EL ACENTO ES EL ÚNICO QUE SE TOCA: en la aplicación lo elige cada colegio (`--myvc-acento`), así
 * que si el vídeo se hace para un colegio concreto, se cambia aquí y el clip entero se tiñe solo --
 * la cruz de la fila y la columna, el foco de la casilla y la barra de arriba beben de él.
 */
export const ACENTO = '#1677ff';

/** La superficie de Ant: blanco en claro, `#141414` en oscuro. El clip va en claro. */
export const SUPERFICIE = '#ffffff';

/* Las dos marcas de la nota, exactamente las de `casilla-de-nota.scss`. */
export const PERDIDA_LINEA = '#e61900';
export const PERDIDA_LETRA = '#f11a00';
export const SUPERIOR_LINEA = '#a4d3fe';
export const SUPERIOR_LETRA = '#57b5e3';

/* El aro de «escrita y todavía sin confirmar». Ámbar → claro → ámbar, para que el bucle no dé tirón. */
export const ARO_DEGRADADO = `linear-gradient(90deg, #f4b400, #fff3cf, #f4b400)`;

/*
 * EL MOSAICO DEL ARO. En la aplicación mide 48 px; aquí todo va al DOBLE para que se lea en un vídeo
 * que alguien mirará en el móvil, así que el mosaico también.
 */
export const ARO_MOSAICO = 96;

/** Lo que tarda el degradado en recorrer un mosaico. En la aplicación, 0,8 s. */
export const ARO_VUELTA_S = 0.8;

export const BORDE = '#d9d9d9';
export const TEXTO = 'rgba(0, 0, 0, 0.88)';
export const TEXTO_TENUE = '#8c8c8c';

export const FUENTE =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
