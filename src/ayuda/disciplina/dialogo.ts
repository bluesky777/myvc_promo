/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA GEOMETRÍA DE LOS DOS DIÁLOGOS DE LA REJILLA (situaciones y uniforme), en el FOTOGRAMA.
 *
 * El diálogo de situaciones de app2 (`falta-modal.html`) es alto: la cabecera del alumno, un
 * acordeón con un panel por periodo, y dentro, o las tres tablas o el formulario. No cabe entero en
 * la banda, y en la aplicación tampoco cabe en un portátil: **se desplaza**. Aquí también, con
 * `scroll`, y todo lo que el puntero toca se calcula restándolo.
 */

export const D = {
	x: 380,
	y: 118,
	ancho: 1160,
	alto: 770,
	relleno: 24,
	cabecera: 96,
	pie: 64,
	panel: 44,
};

export const VISTA = D.alto - D.cabecera - D.pie;
export const IZQ = D.x + D.relleno;
export const DER = D.x + D.ancho - D.relleno;
export const ANCHO_DENTRO = D.ancho - D.relleno * 2;

/** De la altura dentro del cuerpo a la del fotograma, con lo desplazado. */
export function enY(local: number, scroll: number): number {
	return D.y + D.cabecera + local - scroll;
}

/** El formulario de alta y de edición: dónde empieza cada cosa dentro del cuerpo. */
export const FORM = {
	titulo: 104,
	tipoRotulo: 142,
	tipo: 166,
	descRotulo: 216,
	desc: 240,
	descAlto: 60,
	fechaRotulo: 312,
	fecha: 336,
	testRotulo: 386,
	test: 410,
	descaRotulo: 460,
	descargo: 484,
	deriva: 534,
	profRotulo: 578,
	prof: 602,
	ordRotulo: 652,
	ord: 676,
	botones: 726,
	fin: 780,
	campo: 38,
	anchoTipo: 196,
	anchoCampo: 720,
};

/** La lista de un periodo: las tres tablas y el botón de crear. */
export const LISTA = {
	t1: 104,
	cabeceraTabla: 138,
	filas: 174,
	fila: 44,
	crear: 416,
	fin: 470,
};

/** Las columnas de la tabla de situaciones (No, Descripción, Fecha, Docente, Descargo, Testigos, acciones). */
export const COLUMNAS = [
	{ t: 'No', ancho: 56 },
	{ t: 'Descripción', ancho: 370 },
	{ t: 'Fecha', ancho: 96 },
	{ t: 'Docente', ancho: 180 },
	{ t: 'Descargo', ancho: 270 },
	{ t: 'Testigos', ancho: 90 },
	{ t: '', ancho: 0 },
];

export function rect(x: number, localY: number, ancho: number, alto: number, scroll: number) {
	return { x, y: enY(localY, scroll), ancho, alto };
}

/** El botón de un tipo en el formulario. */
export function botonDeTipo(i: number, scroll: number) {
	return rect(IZQ + i * FORM.anchoTipo, FORM.tipo, FORM.anchoTipo, FORM.campo, scroll);
}

/** Los dos botones del pie del formulario, pegados a la derecha. `principal` mide `ancho`. */
export function botonPrincipal(ancho: number, scroll: number) {
	return rect(DER - ancho, FORM.botones, ancho, FORM.campo, scroll);
}

/** El lápiz de la fila `i` de la tabla de tipo 1. */
export function lapiz(i: number, scroll: number) {
	return rect(DER - 50, LISTA.filas + i * LISTA.fila + 7, 32, 30, scroll);
}

/** Las opciones del desplegable de ordinales, debajo del campo. */
export const OPCION = 40;
export function opcion(i: number, scroll: number) {
	return rect(IZQ, FORM.ord + FORM.campo + 4 + i * OPCION, FORM.anchoCampo, OPCION, scroll);
}

/* ── El de uniformes (`uniformes-modal.html`), que es corto y no se desplaza ───────────────── */

export const U = {
	x: 460,
	y: 150,
	ancho: 1000,
	alto: 700,
	agregar: 120,
	form: 120,
	checks: 160,
	fechaRotulo: 212,
	fecha: 236,
	descRotulo: 290,
	desc: 314,
	botones: 372,
	lista: 430,
	fila: 52,
};
