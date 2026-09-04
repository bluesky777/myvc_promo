/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA RÚBRICA: LA MATRIZ DE CRITERIOS × NIVELES QUE **PRODUCE** LA NOTA EN VEZ DE QUE EL DOCENTE LA
 * INVENTE. Es lo que hace la pantalla de verdad (`paginas/rubricas/calificar-alumno`).
 *
 * LA FÓRMULA, que es lo que el clip enseña:
 *
 *     nota = Σ (peso_criterio / 100) × puntaje_del_nivel_marcado
 *
 * Y EL DESGLOSE ES LA RAZÓN DE SER DE LA PANTALLA, no un adorno: «Argumentación 40 % × Alto 85 = 34»
 * es lo que separa esto de una nota que aparece sola. Sin él el docente tiene un número que **no
 * puede defender ante un acudiente**, y la rúbrica no habría servido para nada. Por eso el clip
 * dedica su segunda mitad al desglose y no a la matriz.
 *
 * LOS DESCRIPTORES SON CORTOS, y ahí se toma una licencia a propósito: los de verdad son frases
 * enteras. En una celda vista en un móvil, una frase entera no se lee -- y lo que hay que leer aquí
 * es la ESTRUCTURA (cuatro niveles, un descriptor en cada uno), no el texto de esta rúbrica.
 */

export interface Nivel {
	nombre: string;
	puntaje: number;
}

export interface Criterio {
	definicion: string;
	peso: number;
	descriptores: string[];
	/** Qué nivel marca el docente en el clip. Índice dentro de `NIVELES`. */
	marca: number;
}

export const NIVELES: Nivel[] = [
	{ nombre: 'Bajo', puntaje: 40 },
	{ nombre: 'Básico', puntaje: 60 },
	{ nombre: 'Alto', puntaje: 85 },
	{ nombre: 'Superior', puntaje: 100 },
];

export const CRITERIOS: Criterio[] = [
	{
		definicion: 'Argumentación',
		peso: 40,
		descriptores: ['Afirma sin sustentar', 'Sustenta con un ejemplo', 'Sustenta con fuentes', 'Sustenta y refuta objeciones'],
		marca: 2,
	},
	{
		definicion: 'Uso de fuentes',
		peso: 30,
		descriptores: ['No cita', 'Cita una fuente', 'Cita y contrasta dos', 'Contrasta y valora cuál pesa'],
		marca: 3,
	},
	{
		definicion: 'Claridad y orden',
		peso: 30,
		descriptores: ['Ideas sueltas', 'Orden general', 'Orden y conectores', 'Orden impecable'],
		marca: 1,
	},
];

export const ALUMNO = 'Acosta Rivera, Sara Isabel';
export const INDICADOR = 'Argumenta y sustenta una postura';
export const PORCENTAJE = 30;

/** Lo que aporta un criterio. Es la fórmula, escrita una vez. */
export function aporte(c: Criterio): number {
	return Math.round((c.peso / 100) * NIVELES[c.marca].puntaje);
}

/** La nota que calcula la rúbrica cuando están todos los criterios marcados. */
export const NOTA = CRITERIOS.reduce((suma, c) => suma + aporte(c), 0);
