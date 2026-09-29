import { ALUMNOS } from '../../notas/planilla';
import { COLEGIO } from '../colegio';
import { ARCHIVO, ASIGNATURAS_DEL_LIBRO, ESCALA, LA_COMPLETA, PERIODO, ANIO, SUBUNIDADES } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL LIBRO DE EXCEL QUE SE BAJA, DIBUJADO: la portada («Bienvenida») y la hoja de 9°B Matemáticas.
 *
 * SALE DEL GENERADOR DE VERDAD, NO DE UNA CAPTURA: `8myvc/app/Exports/LibroDeNotas.php` (la portada:
 * el nombre del colegio en una banda azul, «Planilla de notas · Periodo 2 · 2026», el docente, la
 * fecha, «CÓMO SE USA» con sus cinco reglas y «SUS ASIGNATURAS» con un enlace por hoja) y
 * `HojaDeAsignatura.php` (dos filas de cabecera: «← Volver a la portada» y la banda de cada
 * unidad en la 1; «9B · MATEMÁTICAS · P2», «ID», el número y el peso de cada indicador, y «Def»,
 * «Aus» y «Tar» en la 2; el orden y el ID en gris; las columnas de reserva en ámbar y sin peso).
 *
 * Los textos de las reglas y del error de validación son los del generador, palabra por palabra.
 * Los nombres, los ID y las notas son inventados (los seis primeros alumnos son los de la planilla).
 * La hoja de cálculo es genérica, sin la marca de ningún programa.
 */

export const DOCENTE = 'Julián Andrés Mora Quintero';
export const DESCARGADA = '21/09/2026 18:40';

/** Las hojas del libro: la portada y una por asignatura marcada (8°A se desmarcó al bajarlo). */
const abrev = (g: string) => g.replace('°', '');
export const HOJAS = [
	'Bienvenida',
	...ASIGNATURAS_DEL_LIBRO.filter((_, i) => i !== LA_COMPLETA).map((a) => `${abrev(a.grupo)} ${a.materia}`),
];
export const LA_HOJA = HOJAS.indexOf('9B Matemáticas');

/* ── Las cinco reglas de la portada (`LibroDeNotas::pintarPortada`) ─────────────────────────── */

export const REGLAS = [
	'Pulse el nombre de una asignatura para ir a su planilla.',
	`Escriba las notas en las casillas blancas. Sólo números enteros de ${ESCALA.minima} a ${ESCALA.maxima}.`,
	'Una casilla vacía se queda como está: no borra la nota que ya hubiera.',
	'Para BORRAR una nota, escriba un guion: -',
	'Lo gris no se puede tocar: es lo que le dice al sistema quién es quién. Guarde el archivo y súbalo en Académico → Trabajar sin internet → Subir una planilla.',
];

/** La escala del año, inventada: la primera banda es la perdida. */
export const BANDAS = [
	{ desde: 0, hasta: 59, nombre: 'Bajo', perdido: true, tono: '#ffe0e0' },
	{ desde: 60, hasta: 79, nombre: 'Básico', perdido: false, tono: '#fff7db' },
	{ desde: 80, hasta: 94, nombre: 'Alto', perdido: false, tono: '#e8f3ff' },
	{ desde: 95, hasta: 100, nombre: 'Superior', perdido: false, tono: '#e3f7e6' },
];

export function bandaDe(n: number) {
	return BANDAS.find((b) => n >= b.desde && n < b.hasta + 1) ?? null;
}

/** «Esa nota no cabe»: el error de la validación (`HojaDeAsignatura::mensajeDeError`). */
export const ERROR_TITULO = 'Esa nota no cabe';
export const ERROR_TEXTO = [
	`Sólo se admiten números enteros de ${ESCALA.minima} a ${ESCALA.maxima}, o un guion (-) para borrar la nota.`,
	'Una nota con decimales se guardaría recortada, así que el libro no la deja escribir.',
];

/* ── La hoja de 9°B Matemáticas ─────────────────────────────────────────────────────────── */

export const INDICADORES = [
	{ numero: 1, peso: 30 },
	{ numero: 2, peso: 30 },
	{ numero: 3, peso: 40 },
];
/** Las de reserva de la primera unidad: cinco columnas por unidad, «existan o no» (D12). */
export const RESERVA = [4, 5];
export const BANDA_DE_LA_UNIDAD = '1 · Resuelve y plantea ecuaciones lineales  100%';

export interface FilaDeLaHoja {
	orden: number;
	nombre: string;
	id: string;
	notas: (number | null)[];
	aus: number;
	tar: number;
}

const MAS: Omit<FilaDeLaHoja, 'orden' | 'id'>[] = [
	{ nombre: 'Gaviria Toro, Isabella', notas: [77, 80, 74], aus: 1, tar: 0 },
	{ nombre: 'Henao Sepúlveda, Juan José', notas: [90, 86, 88], aus: 0, tar: 1 },
	{ nombre: 'Ibarra Castaño, Luciana', notas: [66, 70, 61], aus: 2, tar: 0 },
	{ nombre: 'Jaramillo Ossa, Emiliano', notas: [84, 79, 82], aus: 0, tar: 0 },
];

export const FILAS: FilaDeLaHoja[] = [
	/* Valentina ya tiene el 55 que se le puso en el vídeo de la planilla. */
	...ALUMNOS.map((a, i) => ({ nombre: a.nombre, notas: i === 4 ? [58, 55, 62] : a.notas, aus: a.ausencias, tar: a.tardanzas })),
	...MAS,
].map((f, i) => ({ ...f, orden: i + 1, id: String(20231041 + i * 7) }));

/** La definitiva orientativa de la fila: la fórmula `ROUND(SUMPRODUCT(...),2)` del generador. */
export function definitiva(notas: (number | null | '-')[]): number {
	const s = notas.reduce<number>((n, v, i) => n + (typeof v === 'number' ? v * INDICADORES[i].peso / 100 : 0), 0);
	return Math.round(s * 100) / 100;
}

/** Los tres cambios del vídeo: la que faltaba, la que se borra y la de decimales que no entra. */
export const LA_QUE_FALTA = { fila: 1, col: 1, valor: '76' };
export const LA_QUE_SE_BORRA = { fila: 0, col: 2, valor: '-' };
export const LA_DE_DECIMALES = { fila: 3, col: 1, valor: '72,5' };

export { ARCHIVO, PERIODO, ANIO, COLEGIO, SUBUNIDADES, ASIGNATURAS_DEL_LIBRO };
