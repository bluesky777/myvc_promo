/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS COLORES DE LA CAPA DE AYUDA -- **los de encima, no los de la aplicación**.
 *
 * La aplicación se pinta con `notas/tema.ts`, que copia los colores de verdad de `app2`. Esto es lo
 * otro: la cabecera que dice dónde estás, el rótulo de abajo y la tarjeta del final. Van en tinta
 * oscura y no en el azul de la aplicación **a propósito**: si la ayuda se pintara con los colores
 * del producto, un rótulo y un aviso de la pantalla se leerían como la misma cosa, y entonces el
 * vídeo estaría enseñando avisos que la aplicación no da.
 */

/** La tinta de la capa: casi negra, con azul dentro. Es lo que sostiene el texto de encima. */
export const TINTA = '#0f1c34';
export const TINTA_SUAVE = '#4a5872';

export const PAPEL = '#ffffff';

/** El fondo del fotograma, el mismo de los clips promocionales: los vídeos son de la misma casa. */
export const FONDO = 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)';

/** El velo que apaga lo que no hay que mirar. Poco: apagar mucho deja la pantalla irreconocible. */
export const VELO = 'rgba(15, 28, 52, 0.42)';

/** El aro del foco, y el acento de la propia capa de ayuda. */
export const FOCO = '#f4b400';

export const FUENTE =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/*
 * LAS MEDIDAS DE LA CAPA. Están aquí y no repartidas porque **el hueco que dejan es el encuadre**:
 * la pantalla de la aplicación tiene que caber entre la cabecera y el rótulo, y si alguien sube la
 * cabecera sin bajar la pantalla, lo que pasa es que la tapa.
 */
export const CABECERA_ALTO = 108;
export const ROTULO_ALTO = 188;

/** Lo que se encoge la pantalla de la aplicación para dejarle sitio a las dos. */
export const HUECO_DE_LA_AYUDA = 0.82;

/** Y cuánto se sube, para quedar centrada en lo que queda y no en el fotograma entero. */
export const SUBE_LA_PANTALLA = -26;
