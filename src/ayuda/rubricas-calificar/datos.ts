import { BANDA } from '../encuadre';
import { NIVELES, TALLER } from '../rubricas-montar/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «RÚBRICAS: CALIFICAR», Y DÓNDE CAE.
 *
 * LA PARRILLA DEL GRUPO (`paginas/rubricas/calificar-grupo.html`): una fila por estudiante, un
 * `<select>` nativo por criterio y la columna Nota. Se califica el «Taller» de Matemáticas 9°A con
 * la rúbrica «Taller de ecuaciones» que dejó montada el vídeo anterior (por qué 9°A y no 9°B, en
 * `rubricas-montar/datos.ts`).
 *
 * LOS SIETE DE 9°A SON INVENTADOS. Emilio llegó al grupo esta semana y todavía no tiene casilla en
 * el indicador: `nota_id` es null, porque la fila de `notas` la crea la planilla al abrirse. Es el
 * «Hay estudiantes sin casilla» que el vídeo explica.
 *
 * LA NOTA LA CALCULA EL SERVIDOR: Σ peso/100 × puntaje del nivel marcado. Aquí se hace la misma
 * cuenta para saber qué número pintar, y se eligieron niveles que dan enteros (89 y 79).
 */

export interface Estudiante {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	/** Sin casilla en el indicador: `nota_id === null`. */
	sinCasilla?: boolean;
}

export const ESTUDIANTES: Estudiante[] = [
	{ nombre: 'Arango Pérez, Daniela', sexo: 'mujer' },
	{ nombre: 'Benítez Rojas, Juan José', sexo: 'hombre' },
	{ nombre: 'Castaño Gil, Isabella', sexo: 'mujer' },
	{ nombre: 'Duarte León, Santiago', sexo: 'hombre' },
	{ nombre: 'Herrera Salas, Emilio', sexo: 'hombre', sinCasilla: true },
	{ nombre: 'Montoya Vélez, Sofía', sexo: 'mujer' },
	{ nombre: 'Quintero Ríos, Nicolás', sexo: 'hombre' },
];

export const CRITERIOS = TALLER.criterios;

/** Lo que se marca, en orden: (fila, criterio, nivel). Isabella se queda sin el tercero. */
export const MARCAS: { fila: number; criterio: number; nivel: number }[] = [
	{ fila: 0, criterio: 0, nivel: 0 },
	{ fila: 0, criterio: 1, nivel: 1 },
	{ fila: 0, criterio: 2, nivel: 1 },
	{ fila: 1, criterio: 0, nivel: 1 },
	{ fila: 1, criterio: 1, nivel: 2 },
	{ fila: 1, criterio: 2, nivel: 1 },
	{ fila: 2, criterio: 0, nivel: 2 },
	{ fila: 2, criterio: 1, nivel: 2 },
];

export const ISABELLA = 2;
export const EMILIO = ESTUDIANTES.findIndex((e) => e.sinCasilla);

/** La nota de una fila con todos los criterios marcados; `null` si le falta alguno. */
export function notaDe(niveles: (number | null)[]): number | null {
	if (niveles.some((n) => n === null)) { return null; }
	return Math.round(CRITERIOS.reduce((s, c, i) => s + (c.peso / 100) * NIVELES[niveles[i]!].puntaje, 0));
}

export const CON_CASILLA = ESTUDIANTES.filter((e) => !e.sinCasilla).length;

export const TEXTOS = {
	estudiantes: `${ESTUDIANTES.length} estudiantes`,
	inicial: 'Valoración inicial',
	nivelacion: 'Nivelación',
	sinCasilla: 'Hay estudiantes sin casilla en este indicador',
	sinCasillaDetalle: `${ESTUDIANTES.length - CON_CASILLA} de ${ESTUDIANTES.length} no se pueden calificar todavía. Su casilla se crea al abrir la planilla de la materia; después vuelve aquí.`,
	estudiante: 'Estudiante',
	nota: 'Nota',
	incompleta: 'incompleta',
	pie: 'Elige un nivel por criterio. La nota la calcula el servidor al guardar: una rúbrica a la que le falte un criterio no produce nota.',
	guardar: 'Guardar marcas y notas',
	guardado: 'Guardado',
	completos: (n: number) => `${n} de ${CON_CASILLA} con todos los criterios marcados`,
	notaAlPie: 'Guardar hace dos cosas: registra las marcas de la rúbrica y escribe la nota de los estudiantes que quedaron con todos los criterios marcados. A los que les falte alguno se les guarda lo marcado, pero no se les pone nota.',
	toast: (n: number) => `Marcas guardadas y ${n} notas escritas.`,
};

/** Cómo se lee una opción del `<select>`: «Alto (85)». */
export const opcion = (nivel: number | null) => (nivel === null ? '—' : `${NIVELES[nivel].nombre} (${NIVELES[nivel].puntaje})`);

/* ═══ LA GEOMETRÍA, en coordenadas del PANEL ═════════════════════════════════════════════════ */

export const PG = {
	ancho: 1500,
	relleno: 36,
	letra: 21,
	titulo: 44,
	hueco: 16,
	momentos: 44,
	alerta: 92,
	cabecera: 62,
	fila: 58,
	pie: 54,
	boton: 44,
	notaAlPie: 58,
};
export const UTIL = PG.ancho - PG.relleno * 2;
export const COL = { estudiante: 470, criterio: 260, nota: UTIL - 470 - 260 * 3 };

export const Y = (() => {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo + PG.hueco;
	const momentos = y; y += PG.momentos + PG.hueco;
	const alerta = y; y += PG.alerta + PG.hueco;
	const tabla = y; y += PG.cabecera + ESTUDIANTES.length * PG.fila;
	const pie = y; y += PG.pie + PG.hueco;
	const mandos = y; y += PG.boton + 12;
	const notaAlPie = y; y += PG.notaAlPie + PG.relleno;
	return { titulo, momentos, alerta, tabla, pie, mandos, notaAlPie, alto: y };
})();

export const ENCUADRE = (() => {
	const escala = Math.min((BANDA.alto - 24) / Y.alto, (1920 - 160) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - Y.alto * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

export const xCriterio = (c: number) => PG.relleno + COL.estudiante + c * COL.criterio;
export const X_NOTA = PG.relleno + COL.estudiante + 3 * COL.criterio;

export function rectFila(i: number): Rect {
	return { x: PG.relleno, y: Y.tabla + PG.cabecera + i * PG.fila, ancho: UTIL, alto: PG.fila };
}
/** El `<select>` de una celda, con su margen dentro de la celda. */
export function rectSelector(i: number, c: number): Rect {
	return { x: xCriterio(c) + 14, y: Y.tabla + PG.cabecera + i * PG.fila + 9, ancho: COL.criterio - 28, alto: PG.fila - 18 };
}
export const ALTO_OPCION = 38;
/** La opción `k` de la lista abierta (0 = «—»), debajo del selector. */
export function rectOpcion(i: number, c: number, k: number): Rect {
	const s = rectSelector(i, c);
	return { x: s.x, y: s.y + s.alto + 4 + k * ALTO_OPCION, ancho: s.ancho, alto: ALTO_OPCION };
}
export const rectCabecera = (): Rect => ({ x: PG.relleno, y: Y.tabla, ancho: UTIL, alto: PG.cabecera });
export const rectColumnaNota = (): Rect => ({ x: X_NOTA, y: Y.tabla, ancho: COL.nota, alto: PG.cabecera + ESTUDIANTES.length * PG.fila });
export const rectAlerta = (): Rect => ({ x: PG.relleno, y: Y.alerta, ancho: UTIL, alto: PG.alerta });
export const rectGuardar = (): Rect => ({ x: PG.relleno, y: Y.mandos, ancho: 300, alto: PG.boton });
export const rectMandos = (): Rect => ({ x: PG.relleno, y: Y.mandos, ancho: 820, alto: PG.boton });
