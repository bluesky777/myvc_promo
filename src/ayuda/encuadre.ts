import { MEDIDAS } from './medidas';
import { CABECERA_ALTO, ROTULO_ALTO } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CUÁNTO OCUPA LA APLICACIÓN DENTRO DEL FOTOGRAMA, EN LOS VÍDEOS DE AYUDA. **Un solo sitio.**
 *
 * Es el mismo principio que `comunes/encuadre.ts` --dos clips seguidos no pueden enseñar la
 * aplicación a dos tamaños distintos-- pero no son los mismos números ni el mismo problema. Allí se
 * encuadra **una pantalla suelta y grande**, para un promocional. Aquí se encuadra **la aplicación
 * entera con su cáscara**, y el límite no es el borde del fotograma: es la banda que queda libre
 * entre la cabecera de ubicación y el rótulo, que son parte del vídeo y no se pueden tapar.
 *
 * Estaba dentro del guion del primer clip, y se sacó al hacer el segundo: dos clips calculando su
 * propio origen es exactamente cómo empiezan a verse a dos tamaños.
 */

export const ESCALA_CASCARA = 0.84;

/** El hueco libre entre la cabecera y el rótulo. Es donde tiene que caber lo que se enseñe. */
export const BANDA = {
	arriba: CABECERA_ALTO,
	alto: 1080 - CABECERA_ALTO - ROTULO_ALTO,
};

export const ORIGEN = {
	x: (1920 - MEDIDAS.ancho * ESCALA_CASCARA) / 2,
	y: BANDA.arriba + (BANDA.alto - MEDIDAS.alto * ESCALA_CASCARA) / 2,
};

/**
 * DE COORDENADAS DE LA CÁSCARA A COORDENADAS DEL FOTOGRAMA. Es lo que usa el foco: el guion señala
 * «la entrada Académico del menú» con las medidas de la aplicación, sin saber a qué escala se está
 * pintando, y esto lo traduce. Si mañana la escala cambia, los focos se mueven solos.
 */
export function enElFotograma(r: { x: number; y: number; ancho: number; alto: number }) {
	return {
		x: ORIGEN.x + r.x * ESCALA_CASCARA,
		y: ORIGEN.y + r.y * ESCALA_CASCARA,
		ancho: r.ancho * ESCALA_CASCARA,
		alto: r.alto * ESCALA_CASCARA,
	};
}

/**
 * Y LO MISMO PARA UN PAPEL. Un informe no es una pantalla: es una hoja vertical, y lo que la limita
 * es el ALTO de la banda, no el ancho del fotograma. Devuelve a qué escala hay que pintarla para
 * que quepa entera, y dónde cae su esquina.
 */
export function encuadreDeUnaHoja(hoja: { ancho: number; alto: number }, margen = 22) {
	const escala = (BANDA.alto - margen * 2) / hoja.alto;
	return {
		escala,
		x: (1920 - hoja.ancho * escala) / 2,
		y: BANDA.arriba + (BANDA.alto - hoja.alto * escala) / 2,
	};
}

/**
 * Y EL ACERCAMIENTO A UN TROZO DE LA HOJA. Devuelve a qué escala y en qué sitio hay que pintarla
 * para que **esa franja** llene la banda, sin salirse de ancho.
 *
 * Existe porque una hoja entera a 1080p es ilegible: el renglón de un boletín mide 8 pt, y a la
 * escala que hace caber una Letter en el fotograma eso son ocho píxeles. El plano general dice
 * «esto es un boletín»; el acercamiento es el que deja leerlo.
 */
export function acercamientoAUnaHoja(
	hoja: { ancho: number; alto: number },
	franja: { y: number; alto: number },
	margen = 0.92,
) {
	/* Lo que quepa: o llena la banda de alto, o llena el fotograma de ancho. Manda el más pequeño. */
	const escala = Math.min((BANDA.alto - 24) / franja.alto, (1920 * margen) / hoja.ancho);
	const centro = franja.y + franja.alto / 2;

	return {
		escala,
		x: 1920 / 2 - (hoja.ancho / 2) * escala,
		y: BANDA.arriba + BANDA.alto / 2 - centro * escala,
	};
}
