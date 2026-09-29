import { ALUMNOS as ALUMNOS_PLANILLA } from '../../notas/planilla';
import { ALUMNOS as ALUMNOS_PROMO, TIPOS as TIPOS_PROMO } from '../../disciplina/datos';
import { BANDA } from '../encuadre';
import { MEDIDAS, SECCIONES, entradaDe } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN LA PANTALLA «DISCIPLINA» DE LOS VÍDEOS DE AYUDA DEL DOCENTE, Y DÓNDE CAE.
 *
 * La comparten tres vídeos (situación, uniforme y tardanzas, observador): es la misma pantalla, y
 * tres copias se separarían al primer cambio.
 *
 * DE DÓNDE SALE CADA COSA (app2, `paginas/disciplina/disciplina/disciplina.html`):
 *   · el título es el nombre del grupo con su abreviatura; sin grupo, «Seleccione grupo»;
 *   · el grupo se elige con una fila de botones (`myvc-selector-grupo`); la estrella es «eres el
 *     titular»; sin grupo sólo sale «Elija un grupo para ver su disciplina.»;
 *   · la celda: uniforme y tardanzas (gris, con icono), una raya, los tres tipos (sin icono, oro,
 *     volcán y rojo) y el «+» («Crear falta»);
 *   · pulsar un contador despliega el detalle DENTRO de la celda, y la fila crece;
 *   · abajo, «Informes · se abren en otra pestaña», y los tres observadores sólo con grupo.
 *
 * LOS NOMBRES DE LOS TIPOS SON LOS DE FÁBRICA («Situaciones tipo 1»): cada colegio los renombra
 * (`faltas_tipoN_displayname`), y un rótulo del vídeo lo dice. Los colores son los del clip
 * promocional, que son los de verdad (`--paleta-aviso/alerta/peligro`).
 *
 * LOS ALUMNOS SON LOS SEIS DE 9°B de `notas/planilla.ts`, inventados. Las cuentas de los tres
 * primeros son las del clip promocional, para que las dos rejillas digan lo mismo.
 *
 * TODO VA EN COORDENADAS DEL FOTOGRAMA: la pantalla se pinta a escala 1 a pantalla completa, así
 * que el foco y el puntero salen de estos números sin convertir nada.
 */

/* ── Los tipos ─────────────────────────────────────────────────────────────────────────────── */

export interface Tipo {
	plural: string;
	singular: string;
	tinte: string;
	borde: string;
	legible: string;
	fuerte: string;
}

export const TIPOS: Tipo[] = TIPOS_PROMO.map((t, i) => ({
	...t,
	plural: `Situaciones tipo ${i + 1}`,
	singular: `Situación tipo ${i + 1}`,
}));

/* ── El grupo y los alumnos ────────────────────────────────────────────────────────────────── */

export const GRUPO = { nombre: 'Noveno B', abrev: '9B', id: 318 };

/** Los grupos del selector: los del docente. La estrella va en el suyo, del que es titular. */
export const GRUPOS = [
	{ abrev: '8A', titular: false },
	{ abrev: '9A', titular: false },
	{ abrev: '9B', titular: true },
	{ abrev: '10A', titular: false },
];
export const EL_GRUPO = GRUPOS.findIndex((g) => g.abrev === GRUPO.abrev);

export interface Situacion {
	fecha: string;
	descripcion: string;
	/** Cuántos renglones ocupa en los 270 px del detalle. Medido a ojo contra el render. */
	lineas: number;
	ordinales: string[];
	/** Lo que sale en la tabla del diálogo. */
	docente?: string;
	descargo?: string;
	testigos?: string;
}

export interface Uniforme {
	fecha: string;
	fechaLarga: string;
	/** Las etiquetas cortas de la rejilla, y las largas del diálogo. */
	cortas: string[];
	largas: string[];
}

export interface PeriodoDeAlumno {
	uniformes: number;
	tardanzas: number;
	tipos: [number, number, number];
}

export interface AlumnoDeDisciplina {
	/** «Apellidos Nombres», como la columna de la aplicación. */
	nombre: string;
	/** «Nombres Apellidos», como la cabecera del diálogo. */
	alReves: string;
	sexo: 'mujer' | 'hombre';
	periodos: PeriodoDeAlumno[];
}

const VACIO: PeriodoDeAlumno = { uniformes: 0, tardanzas: 0, tipos: [0, 0, 0] };

const DE_MAS: PeriodoDeAlumno[][] = [
	[{ uniformes: 0, tardanzas: 2, tipos: [0, 0, 0] }, { uniformes: 1, tardanzas: 1, tipos: [0, 0, 0] }, VACIO, VACIO],
	[VACIO, { uniformes: 0, tardanzas: 1, tipos: [1, 0, 0] }, VACIO, VACIO],
	[{ uniformes: 1, tardanzas: 0, tipos: [0, 0, 0] }, VACIO, VACIO, VACIO],
];

function alReves(nombre: string): string {
	const [apellidos, nombres] = nombre.split(', ');
	return `${nombres} ${apellidos}`;
}

export const ALUMNOS: AlumnoDeDisciplina[] = ALUMNOS_PLANILLA.map((a, i) => ({
	nombre: a.nombre.replace(', ', ' '),
	alReves: alReves(a.nombre),
	sexo: a.sexo,
	periodos: i < ALUMNOS_PROMO.length ? ALUMNOS_PROMO[i].periodos : DE_MAS[i - ALUMNOS_PROMO.length],
}));

export const PERIODOS = [1, 2, 3, 4];

/** Donde pasa todo: Sara, en el periodo 2 (el que está en curso en la barra de la cáscara). */
export const LA_FILA = 0;
export const EL_PERIODO = 1;

/** Lo que Sara ya tiene en el periodo 2: dos fallas de uniforme y una situación tipo 1. */
export const UNIFORMES_DE_SARA: Uniforme[] = [
	{ fecha: '12 ago', fechaLarga: '12 ago, 6:58 a. m.', cortas: ['Sin uni'], largas: ['Sin uniforme'] },
	{ fecha: '3 sep', fechaLarga: '3 sep, 7:05 a. m.', cortas: ['Incompl'], largas: ['Incompleto'] },
];

export const UNIFORME_NUEVO: Uniforme = {
	fecha: '28 sep', fechaLarga: '28 sep, 7:10 a. m.', cortas: ['Accesor'], largas: ['Accesorios'],
};

export const SITUACIONES_DE_SARA: Situacion[] = [
	{
		fecha: '19 ago',
		descripcion: 'Salió del aula sin permiso en clase de Sociales.',
		lineas: 2,
		ordinales: [],
		docente: 'Ramírez Osorio Andrés',
		descargo: 'Dice que iba a la enfermería.',
	},
];

/** La que se crea en el vídeo. Sólo se teclea la descripción: la fecha viene con la de hoy. */
export const SITUACION_NUEVA: Situacion = {
	fecha: '28 sep',
	descripcion: 'Usó el celular durante la evaluación de Matemáticas.',
	lineas: 2,
	ordinales: [],
};

/*
 * LOS ORDINALES DEL MANUAL, INVENTADOS. En la aplicación salen del manual de convivencia del
 * colegio (`/ordinales`); aquí son cuatro verosímiles de tipo 1. La opción del desplegable se lee
 * «{tipo} - {ordinal}. {descripción}», y en el detalle «{tipo} {ordinal}. {descripción}».
 */
export const ORDINALES = [
	{ tipo: 1, ordinal: 2, descripcion: 'Llegar tarde al aula sin justificación.' },
	{ tipo: 1, ordinal: 5, descripcion: 'Usar el celular en clase sin autorización.' },
	{ tipo: 1, ordinal: 7, descripcion: 'Comer en el aula durante la clase.' },
	{ tipo: 1, ordinal: 9, descripcion: 'Salir del aula sin permiso del docente.' },
];
export const EL_ORDINAL = 1;

export const DESCARGO_NUEVO = 'Dice que estaba mirando la hora.';

export const HOY = '28-09-2026';

/* ── La llegada por el menú ────────────────────────────────────────────────────────────────── */

export const DISCIPLINA = entradaDe(SECCIONES, 'Disciplina');
export const ENTRADA_DISCIPLINA = entradaDe(SECCIONES, 'Disciplina', 'Disciplina');
export const ENTRADA_ASISTENCIAS = entradaDe(SECCIONES, 'Disciplina', 'Asistencias');

/* ── La página sin grupo, dentro de la cáscara (coordenadas de la CÁSCARA) ─────────────────── */

export const SIN_GRUPO = {
	arriba: 26,
	lados: 32,
	titulo: 44,
	selector: { y: 64, alto: 38, ancho: 70, hueco: 10 },
	pista: 126,
	pie: 176,
};

/** El botón de un grupo del selector, en coordenadas de la cáscara. */
export function botonDeGrupoEnCascara(i: number) {
	return {
		x: MEDIDAS.menu + SIN_GRUPO.lados + i * (SIN_GRUPO.selector.ancho + SIN_GRUPO.selector.hueco),
		y: MEDIDAS.barra + SIN_GRUPO.arriba + SIN_GRUPO.selector.y,
		ancho: SIN_GRUPO.selector.ancho,
		alto: SIN_GRUPO.selector.alto,
	};
}

/* ── La rejilla a pantalla completa (coordenadas del FOTOGRAMA) ────────────────────────────── */

export const R = {
	ancho: 1760,
	relleno: 28,
	/** El título con su cuenta, el selector, la barra y la leyenda, apilados. */
	titulo: 44,
	cuenta: 28,
	selector: 40,
	barra: 40,
	leyenda: 28,
	hueco: 12,
	cabecera: 46,
	fila: 58,
	num: 56,
	nombre: 400,
	/** Los contadores: los dos grises llevan icono y son más anchos. */
	menor: 52,
	tipo: 36,
	raya: 11,
	entre: 5,
	alto: 30,
	/** El detalle dentro de la celda. */
	detalleTitulo: 26,
	renglon: 22,
	detalleRelleno: 10,
	pie: 40,
};

export const X_REJILLA = (1920 - R.ancho) / 2;
export const Y_REJILLA = BANDA.arriba + 6;
export const ANCHO_TABLA = R.ancho - R.relleno * 2;
export const ANCHO_PERIODO = (ANCHO_TABLA - R.num - R.nombre) / PERIODOS.length;

const Y_SELECTOR = R.relleno + R.titulo + R.cuenta + R.hueco;
const Y_BARRA = Y_SELECTOR + R.selector + R.hueco;
const Y_LEYENDA = Y_BARRA + R.barra + R.hueco;
export const Y_TABLA = Y_LEYENDA + R.leyenda + R.hueco;
export const Y_FILAS = Y_TABLA + R.cabecera;

export const GEOMETRIA = { Y_SELECTOR, Y_BARRA, Y_LEYENDA };

/** El alto del detalle de situaciones, con sus renglones. */
export function altoDelDetalle(renglones: number): number {
	return R.detalleRelleno * 2 + R.detalleTitulo + renglones * R.renglon + 8;
}

/** Dónde empieza la fila `fila`, contando lo que hayan crecido las de arriba. */
export function arribaDeLaFila(fila: number, crecidas: number[] = []): number {
	let y = Y_REJILLA + Y_FILAS;
	for (let i = 0; i < fila; i++) { y += R.fila + (crecidas[i] ?? 0); }
	return y;
}

/**
 * EL CONTADOR `cual` DE UNA CELDA, en el fotograma: 0 uniforme, 1 tardanzas, 2..4 los tipos, 5 el
 * «+». Es el mismo número para el puntero y para el foco.
 */
export function contador(fila: number, periodo: number, cual: number, crecidas: number[] = []) {
	const celda = X_REJILLA + R.relleno + R.num + R.nombre + periodo * ANCHO_PERIODO + 12;
	const anchos = [R.menor, R.menor, R.tipo, R.tipo, R.tipo, R.tipo];
	let x = celda;
	for (let i = 0; i < cual; i++) {
		x += anchos[i] + R.entre;
		if (i === 1) { x += R.raya + R.entre; }
	}
	return {
		x,
		y: arribaDeLaFila(fila, crecidas) + (R.fila - R.alto) / 2,
		ancho: anchos[cual],
		alto: R.alto,
	};
}

/** La celda entera de un periodo, con lo que haya crecido. */
export function celda(fila: number, periodo: number, crece = 0, crecidas: number[] = []) {
	return {
		x: X_REJILLA + R.relleno + R.num + R.nombre + periodo * ANCHO_PERIODO,
		y: arribaDeLaFila(fila, crecidas),
		ancho: ANCHO_PERIODO,
		alto: R.fila + crece,
	};
}

/** El detalle desplegado de una celda. */
export function detalle(fila: number, periodo: number, alto: number) {
	const c = celda(fila, periodo);
	return { x: c.x + 10, y: c.y + R.fila - 6, ancho: ANCHO_PERIODO - 20, alto };
}

export const LEYENDA = {
	x: X_REJILLA + R.relleno,
	y: Y_REJILLA + Y_LEYENDA,
	ancho: 900,
	alto: R.leyenda,
};

export const SELECTOR = {
	x: X_REJILLA + R.relleno,
	y: Y_REJILLA + Y_SELECTOR,
	ancho: GRUPOS.length * (74 + 10) - 10,
	alto: R.selector,
};

/** Dónde empieza el pie, con la tabla crecida lo que sea. */
export function arribaDelPie(crecidas: number[] = []): number {
	return arribaDeLaFila(ALUMNOS.length, crecidas) + 2 + 18;
}

/** Los botones del pie: «Situaciones por grupo» y los tres observadores. */
export const BOTONES_DEL_PIE = ['Situaciones por grupo', 'Observador por periodo', 'Observador completo', 'Observador completo 2'];
export const ANCHOS_DEL_PIE = [236, 246, 232, 250];
export const X_PIE = 390;

export function botonDelPie(i: number, crecidas: number[] = []) {
	let x = X_REJILLA + R.relleno + X_PIE;
	for (let k = 0; k < i; k++) { x += ANCHOS_DEL_PIE[k] + 10; }
	return { x, y: arribaDelPie(crecidas), ancho: ANCHOS_DEL_PIE[i], alto: R.pie };
}

/* ── Lo que crece la fila al desplegar un detalle ──────────────────────────────────────────── */

export const FILA_UNIFORME = 30;

/** El detalle de uniforme: un renglón por falla. */
export function altoDeUniformes(cuantos: number): number {
	return R.detalleRelleno * 2 + R.detalleTitulo + Math.max(1, cuantos) * FILA_UNIFORME + 6;
}

/** El de situaciones: los renglones de cada una, más uno por ordinal. */
export function altoDeSituaciones(lista: Situacion[]): number {
	const cuerpo = lista.reduce((s, x) => s + (x.lineas + x.ordinales.length) * R.renglon + 6, 0);
	return R.detalleRelleno * 2 + R.detalleTitulo + Math.max(cuerpo, R.renglon) + 6;
}

/** Lo que crece la fila con un detalle de alto `alto`: el detalle más su margen de debajo. */
export function crecida(alto: number): number {
	return alto + 4;
}

/** El pie de la página sin grupo, en coordenadas de la cáscara: la pista de los observadores. */
export function pieSinGrupo() {
	return { x: MEDIDAS.menu + SIN_GRUPO.lados - 8, y: MEDIDAS.barra + SIN_GRUPO.arriba + SIN_GRUPO.pie - 6, ancho: 1010, alto: 50 };
}

/** El selector entero de la página sin grupo, en coordenadas de la cáscara. */
export function selectorSinGrupo() {
	const a = botonDeGrupoEnCascara(0);
	const b = botonDeGrupoEnCascara(GRUPOS.length - 1);
	return { x: a.x - 6, y: a.y - 6, ancho: b.x + b.ancho - a.x + 12, alto: a.alto + 12 };
}
