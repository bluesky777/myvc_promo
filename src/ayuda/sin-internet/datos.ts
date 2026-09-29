import { ACADEMICO, MEDIDAS, SECCIONES, alturaDeEntrada } from '../medidas';
import { VOCABULARIO } from '../../comunes/vocabulario';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «TRABAJAR SIN INTERNET»: LO QUE SE VE EN LAS DOS PANTALLAS Y EN EL LIBRO, Y DÓNDE CAE CADA COSA.
 *
 * Es el mismo docente de la planilla (`planilla/datos.ts`): 8°A Ciencias, 9°B y 9°A Matemáticas y
 * 10°A Estadística. Se le añade **9°B Geometría, sin indicadores en el periodo 2**, porque es la
 * fila que el vídeo tiene que enseñar: `app2` la lista aunque no tenga nada que pasar y la pinta
 * «sin indicadores», no en verde (`notas-sin-internet.html`, la rama `a.indicadores === 0`).
 *
 * Todo inventado: nombres, notas, fechas. Los seis alumnos de 9°B son los de `notas/planilla.ts`.
 */

export const SIN_INTERNET = SECCIONES[ACADEMICO].hijas!.indexOf('Trabajar sin internet');

/** El año y el periodo de la barra de la cáscara (`2026 · Periodo 2`). */
export const PERIODO = 2;
export const ANIO = 2026;
/** `LibroDeNotas::nombreDeArchivo`: `notas-P{n}-{año}.xlsx` (y `-consulta` si el periodo está cerrado). */
export const ARCHIVO = `notas-P${PERIODO}-${ANIO}.xlsx`;
/** La escala del año. Inventada, pero es la que `rangoDeLaEscala()` escribe. */
export const ESCALA = { minima: 0, maxima: 100 };

export interface AsignaturaDelLibro {
	grupo: string;
	materia: string;
	alumnos: number;
	indicadores: number;
	sinPasar: number;
}

export const ASIGNATURAS_DEL_LIBRO: AsignaturaDelLibro[] = [
	{ grupo: '8°A', materia: 'Ciencias Naturales', alumnos: 33, indicadores: 3, sinPasar: 0 },
	{ grupo: '9°B', materia: 'Matemáticas', alumnos: 30, indicadores: 3, sinPasar: 2 },
	{ grupo: '9°B', materia: 'Geometría', alumnos: 30, indicadores: 0, sinPasar: 0 },
	{ grupo: '9°A', materia: 'Matemáticas', alumnos: 31, indicadores: 3, sinPasar: 7 },
	{ grupo: '10°A', materia: 'Estadística', alumnos: 28, indicadores: 2, sinPasar: 12 },
];

/** La que ya está completa (verde, 0) y se desmarca. */
export const LA_COMPLETA = 0;
/** La que no tiene nada montado. */
export const LA_VACIA = 2;

export const SUBUNIDADES = VOCABULARIO.subunidades;

/* ── La geometría de «Trabajar sin internet», en coordenadas del CONTENIDO (sin menú ni barra) ── */

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;

export const B = {
	arriba: 30,
	lados: 36,
	/** El título y la entradilla. */
	titulo: 40,
	intro: 58,
	/** Los dos bloques: su rótulo en mayúsculas y lo de dentro. */
	yPeriodo: 158,
	rotulo: 26,
	selector: 40,
	escala: 34,
	yAsignaturas: 300,
	cabecera: 46,
	fila: 54,
	pie: 56,
};

export const ANCHO_TABLA = ANCHO_CONTENIDO - B.lados * 2;
export const COL = { casilla: 56, grupo: 130, asignatura: 410, alumnos: 150, indicadores: 170, sinPasar: 204 };

export const Y_TABLA = B.yAsignaturas + B.rotulo + 8;
export const Y_FILAS = Y_TABLA + B.cabecera;
export const Y_PIE = Y_FILAS + B.fila * ASIGNATURAS_DEL_LIBRO.length + 12;

const X0 = MEDIDAS.menu + B.lados;
const Y0 = MEDIDAS.barra;

/** Todo lo que el guion señala, en coordenadas de la CÁSCARA. */
export const GEO = {
	selector: { x: X0, y: Y0 + B.yPeriodo + B.rotulo + 4, ancho: 280, alto: B.selector },
	periodo: { x: X0 - 8, y: Y0 + B.yPeriodo - 6, ancho: 900, alto: B.rotulo + B.selector + B.escala + 22 },
	tabla: { x: X0, y: Y0 + Y_TABLA, ancho: ANCHO_TABLA, alto: B.cabecera + B.fila * ASIGNATURAS_DEL_LIBRO.length },
	columna: (cual: 'indicadores' | 'sinPasar') => {
		const antes = COL.casilla + COL.grupo + COL.asignatura + COL.alumnos + (cual === 'sinPasar' ? COL.indicadores : 0);
		return { x: X0 + antes, y: Y0 + Y_TABLA, ancho: COL[cual], alto: B.cabecera + B.fila * ASIGNATURAS_DEL_LIBRO.length };
	},
	fila: (i: number) => ({ x: X0, y: Y0 + Y_FILAS + B.fila * i, ancho: ANCHO_TABLA, alto: B.fila }),
	casilla: (i: number) => ({ x: X0 + 18, y: Y0 + Y_FILAS + B.fila * i + (B.fila - 20) / 2, ancho: 20, alto: 20 }),
	descargar: { x: X0 + ANCHO_TABLA - 330, y: Y0 + Y_PIE + 8, ancho: 330, alto: 42 },
	subir: { x: X0 + ANCHO_TABLA - 214, y: Y0 + B.arriba, ancho: 214, alto: 40 },
};

/** Del menú: la entrada «Trabajar sin internet», con Académico abierto. */
export const MENU = {
	academico: { x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion },
	sinInternet: { x: 0, y: alturaDeEntrada(ACADEMICO, SIN_INTERNET, true), ancho: MEDIDAS.menu, alto: MEDIDAS.hija },
};

export const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
