/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS COLORES DE LAS TRES PIEZAS DE PEGAMENTO — portada, tarjeta y cierre.
 *
 * **Son los de la aplicación, no unos de vídeo.** El acento sale de `notas/tema.ts`, que a su vez
 * sale de `app2/src/styles.scss`. Una portada con un azul «parecido» y luego el clip con el azul de
 * verdad se lee como dos marcas distintas en los primeros diez segundos del vídeo.
 *
 * EL FONDO ES EL MISMO QUE EL DE LOS CLIPS a propósito: así el corte de la portada al primer clip no
 * cambia de superficie, sólo de contenido. Es lo que hace que el vídeo se lea como uno y no como
 * piezas pegadas.
 */
import { ACENTO, BORDE, FUENTE, TEXTO, TEXTO_TENUE } from '../notas/tema';

export { ACENTO, BORDE, FUENTE, TEXTO, TEXTO_TENUE };

/** El mismo degradado de fondo que usan las escenas de MyVC. */
export const FONDO = 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)';

/** Azul apagado para lo secundario: no compite con el acento pero no es gris muerto. */
export const TINTA_SUAVE = '#5b6b7f';
