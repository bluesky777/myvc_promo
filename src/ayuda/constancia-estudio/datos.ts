/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CONSTANCIA: la hoja y la barra de mandos que va encima, y dónde cae cada cosa.
 *
 * El catálogo de Informes, el colegio y el alumno son los del vídeo del certificado
 * (`certificado-imprimir/datos.ts`, `certificado-membrete/almendros.tsx`): la misma secretaria, el
 * mismo 8°B y el mismo Juan Esteban. Aquí sólo está lo que es de la constancia.
 */

/** La hoja: 21 × 27 cm en píxeles de pantalla, como el certificado. */
export const HOJA_CONSTANCIA = { ancho: 794, alto: 1020 };

/** La barra de mandos (no se imprime) y el aire entre ella y la hoja. */
export const BARRA = { alto: 56, hueco: 14 };

/** Lo que se encuadra: la barra y la hoja, juntas. */
export const COMPUESTO = { ancho: HOJA_CONSTANCIA.ancho, alto: BARRA.alto + BARRA.hueco + HOJA_CONSTANCIA.alto };

/*
 * DENTRO DE LA BARRA, de derecha a izquierda: 14 de relleno, imprimir (34), 10, recargar (34), 10,
 * y la casilla con su rótulo. Coordenadas del compuesto.
 */
export const IMPRIMIR = { x: COMPUESTO.ancho - 14 - 34, y: (BARRA.alto - 34) / 2, ancho: 34, alto: 34 };
export const VIGENCIA = { x: IMPRIMIR.x - 10 - 34 - 10 - 150, y: 12, ancho: 150, alto: 32 };

/** El plano corto: del párrafo al final de la tabla. Coordenadas del compuesto, medidas sobre el dibujo. */
export const ACERCAMIENTO_CONSTANCIA = { y: 250, alto: 330 };

export const ALUMNO_ID = 3127;
