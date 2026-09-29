import { ALUMNOS, COLUMNAS } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { RITMO_AYUDA } from '../planilla/guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «NOTAS PERDIDAS» Y EN «DEFINITIVAS POR PERIODO», Y DÓNDE CAE CADA COSA.
 *
 * EL MISMO DOCENTE Y EL MISMO MOMENTO QUE EL VÍDEO DE LA PLANILLA. 9°B es la planilla de
 * `notas/planilla.ts` **después** de los tres tecleos de `planilla-teclear`: Valentina tiene 58 en
 * el taller y el 55 que se le puso en el quiz. Por eso sale aquí con esas dos, y por eso su
 * definitiva del periodo 2 es la media de 58, 55 y 62. Si los números no cuadraran entre vídeos,
 * quien vea la serie entera aprendería que la aplicación enseña cosas distintas en cada pantalla.
 *
 * LA NOTA QUE SE CAMBIA ES DE 9°A Y NO DE 9°B, a propósito: el vídeo no puede afirmar si la
 * definitiva se recalcula al guardar una nota suelta, así que la que se toca está en otro grupo y
 * la tabla de definitivas de 9°B no depende de ella.
 */

/* ── Notas perdidas ───────────────────────────────────────────────────────────────────────── */

/** Lo que dice la columna «Tema»: la definición del indicador (`defin_subunidad`), no su nombre. */
const TEMAS_MATEMATICAS_9: Record<string, string> = {
	Taller: 'Resuelve ecuaciones lineales con una incógnita',
	Quiz: 'Plantea ecuaciones a partir de un problema',
	Examen: 'Interpreta la solución de un sistema de ecuaciones',
};

export interface Linea {
	/** El periodo, en número: la columna «Per». */
	per: number;
	tema: string;
	nota: number;
}

export interface Pendiente {
	nombre: string;
	/** Cada nota perdida es un renglón DENTRO de la fila del alumno: una fila por alumno. */
	lineas: Linea[];
}

export interface Grupo {
	grupo: string;
	materia: string;
	alumnos: Pendiente[];
}

const VALENTINA = ALUMNOS[4];
/** El 55 que le puso la planilla. Sale del guion de aquel vídeo, no se copia. */
const QUIZ_DE_VALENTINA = Number(RITMO_AYUDA.TECLEOS.find((t) => t.fila === 4)!.valor);

export const PENDIENTES: Grupo[] = [
	{
		grupo: '8°A',
		materia: 'Ciencias Naturales',
		alumnos: [
			{ nombre: 'Benítez Ossa, Julián', lineas: [{ per: 2, tema: 'Explica la función de la célula en los seres vivos', nota: 54 }] },
		],
	},
	{
		grupo: '9°B',
		materia: 'Matemáticas',
		alumnos: [
			{
				nombre: VALENTINA.nombre,
				lineas: [
					{ per: 2, tema: TEMAS_MATEMATICAS_9[COLUMNAS[0]], nota: VALENTINA.notas[0]! },
					{ per: 2, tema: TEMAS_MATEMATICAS_9[COLUMNAS[1]], nota: QUIZ_DE_VALENTINA },
				],
			},
		],
	},
	{
		grupo: '9°A',
		materia: 'Matemáticas',
		alumnos: [
			{ nombre: 'Castaño Gil, Laura Sofía', lineas: [{ per: 2, tema: TEMAS_MATEMATICAS_9.Examen, nota: 57 }] },
			{
				nombre: 'Montoya Arias, Felipe',
				lineas: [
					{ per: 2, tema: TEMAS_MATEMATICAS_9.Taller, nota: 52 },
					{ per: 2, tema: TEMAS_MATEMATICAS_9.Quiz, nota: 49 },
				],
			},
		],
	},
];

/** La casilla que se califica: la primera nota de Felipe, en 9°A. */
export const LA_QUE_SE_CAMBIA = { grupo: 2, alumno: 1, linea: 0, valor: '65' };

export const NP = {
	arriba: 28,
	lados: 32,
	titulo: 58,
	filtro: 58,
	grupo: 46,
	cabecera: 40,
	linea: 46,
	/** Lo que hay entre una tabla y el título del grupo siguiente. */
	hueco: 18,
};

/* Los anchos van agrandados respecto a los `rem` de la aplicación, igual que el resto del dibujo. */
export const COL_NP = { no: 52, alumno: 320, per: 60, tema: 520, nota: 120 };
export const ANCHO_NP = COL_NP.no + COL_NP.alumno + COL_NP.per + COL_NP.tema + COL_NP.nota;
export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
/** La tabla va centrada, como en la aplicación (`margin: 0 auto`). */
export const IZQUIERDA_NP = (ANCHO_CONTENIDO - ANCHO_NP) / 2;

/** Dónde empieza cada grupo --su título--, en coordenadas del contenido. */
export function arribaDelGrupo(g: number): number {
	let y = NP.arriba + NP.titulo + NP.filtro;
	for (let i = 0; i < g; i++) {
		const lineas = PENDIENTES[i].alumnos.reduce((n, a) => n + a.lineas.length, 0);
		y += NP.grupo + NP.cabecera + lineas * NP.linea + NP.hueco;
	}
	return y;
}

/** El rectángulo de la casilla «Nota» de una línea, en coordenadas de la CÁSCARA. */
export function rectanguloDeLaNota(g: number, alumno: number, linea: number) {
	const antes = PENDIENTES[g].alumnos.slice(0, alumno).reduce((n, a) => n + a.lineas.length, 0) + linea;
	return {
		x: MEDIDAS.menu + IZQUIERDA_NP + ANCHO_NP - COL_NP.nota,
		y: MEDIDAS.barra + arribaDelGrupo(g) + NP.grupo + NP.cabecera + antes * NP.linea,
		ancho: COL_NP.nota,
		alto: NP.linea,
	};
}

/* ── Definitivas por periodo ──────────────────────────────────────────────────────────────── */

export interface Periodo {
	/** `def_materia_auto_N` tal como llega: con sus decimales. Vacío si no hay. */
	auto: number | null;
	final: number | null;
	manual: boolean;
	rec: boolean;
}

const VACIO: Periodo = { auto: null, final: null, manual: false, rec: false };

/** Cuatro decimales, que es como la guarda el servidor. `Number()` le quita los ceros de sobra. */
const comoLlega = (n: number) => Math.round(n * 10000) / 10000;

/** El periodo 2 sale de la planilla, con los tres tecleos del vídeo anterior ya puestos. */
function periodo2(fila: number): Periodo {
	const notas = ALUMNOS[fila].notas.map((n, c) => {
		const t = RITMO_AYUDA.TECLEOS.find((x) => x.fila === fila);
		return c === 1 && t ? Number(t.valor) : n;
	});
	const puestas = notas.filter((n): n is number => n !== null);
	const auto = comoLlega(puestas.reduce((a, b) => a + b, 0) / puestas.length);
	return { auto, final: Math.round(auto), manual: false, rec: false };
}

/*
 * EL PERIODO 1 ES INVENTADO, y lleva el único caso con las casillas marcadas: Valentina recuperó,
 * así que su Final no es la calculada. Es lo que el paso 10 señala.
 */
const PERIODO_1: Periodo[] = [
	{ auto: 85.3333, final: 85, manual: false, rec: false },
	{ auto: 71.5, final: 72, manual: false, rec: false },
	{ auto: 93.25, final: 93, manual: false, rec: false },
	{ auto: 66.6667, final: 67, manual: false, rec: false },
	{ auto: 55.75, final: 60, manual: true, rec: true },
	{ auto: 79.5, final: 80, manual: false, rec: false },
];

export const DEFINITIVAS = ALUMNOS.map((a, i) => ({
	nombre: a.nombre,
	periodos: [PERIODO_1[i], periodo2(i), VACIO, VACIO],
}));

/** La de Valentina, que es a la que señala el último paso. */
export const LA_RECUPERADA = 4;

export const DEF = {
	relleno: 28,
	titulo: 56,
	chips: 46,
	hueco: 18,
	cab1: 40,
	cab2: 36,
	fila: 50,
};

export const COL_DEF = { no: 44, nombre: 330, auto: 96, final: 80, manual: 64, rec: 54 };
export const SUBCOLUMNAS = ['Auto', 'Final', 'Manual', 'Rec'] as const;
export const ANCHO_PERIODO = COL_DEF.auto + COL_DEF.final + COL_DEF.manual + COL_DEF.rec;

/*
 * LA TABLA SE CORTA EN EL PERIODO 4, con un desvanecido. A la derecha siguen Definitiva,
 * Recuperación, Falta, Aus y Tard, pero a mitad de año la definitiva cuenta los periodos sin nota
 * como cero y enseñaría a todos perdiendo: explicarlo es otro vídeo, y enseñarlo sin explicarlo es
 * sembrar una llamada. El encuadre deja fuera lo que este vídeo no cuenta, como haría una cámara.
 */
const VISIBLE_DEL_ULTIMO = 130;
export const ANCHO_DEF = DEF.relleno + COL_DEF.no + COL_DEF.nombre + ANCHO_PERIODO * 3 + VISIBLE_DEL_ULTIMO;
export const ALTO_DEF =
	DEF.relleno * 2 + DEF.titulo + DEF.chips + DEF.hueco + DEF.cab1 + DEF.cab2 + DEF.fila * DEFINITIVAS.length;

/** Dónde se pinta la pantalla de definitivas dentro del fotograma. */
export const ENCUADRE_DEF = (() => {
	const escala = 1.2;
	return {
		escala,
		x: (1920 - ANCHO_DEF * escala) / 2,
		y: BANDA.arriba + (BANDA.alto - ALTO_DEF * escala) / 2,
	};
})();

const ARRIBA_TABLA = DEF.relleno + DEF.titulo + DEF.chips + DEF.hueco;
const ARRIBA_FILAS = ARRIBA_TABLA + DEF.cab1 + DEF.cab2;

/** Dónde empieza una subcolumna, en coordenadas de la pantalla de definitivas. */
export function izquierdaDe(per: number, sub: number): number {
	const antes = [COL_DEF.auto, COL_DEF.final, COL_DEF.manual, COL_DEF.rec].slice(0, sub).reduce((a, b) => a + b, 0);
	return DEF.relleno + COL_DEF.no + COL_DEF.nombre + per * ANCHO_PERIODO + antes;
}

function alFotograma(r: { x: number; y: number; ancho: number; alto: number }) {
	const e = ENCUADRE_DEF;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio: 6 };
}

/** Unas subcolumnas de un periodo, de la cabecera de abajo a la última fila, en el fotograma. */
export function focoDeColumnas(per: number, desdeSub: number, hastaSub: number) {
	const x = izquierdaDe(per, desdeSub);
	return alFotograma({
		x,
		y: ARRIBA_TABLA + DEF.cab1,
		ancho: izquierdaDe(per, hastaSub) + [COL_DEF.auto, COL_DEF.final, COL_DEF.manual, COL_DEF.rec][hastaSub] - x,
		alto: DEF.cab2 + DEF.fila * DEFINITIVAS.length,
	});
}

/** Unas casillas de una fila, en el fotograma. */
export function focoDeCasillas(fila: number, per: number, desdeSub: number, hastaSub: number) {
	const x = izquierdaDe(per, desdeSub);
	return alFotograma({
		x,
		y: ARRIBA_FILAS + DEF.fila * fila,
		ancho: izquierdaDe(per, hastaSub) + [COL_DEF.auto, COL_DEF.final, COL_DEF.manual, COL_DEF.rec][hastaSub] - x,
		alto: DEF.fila,
	});
}
