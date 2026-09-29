import { ALUMNOS } from '../../notas/planilla';
import { DEFINITIVAS } from '../cierre-1/datos';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL AÑO DE 9°B, PARA LOS CUATRO ÚLTIMOS VÍDEOS DEL CIERRE (5 A 8). **Una sola fuente.**
 *
 * Los periodos 1 y 2 de Matemáticas son los de `cierre-1` --la Final de «Definitivas por periodo»,
 * tal cual--; el 3 y el 4 son inventados. La nota del año es la media de los cuatro, redondeada,
 * como la que imprime el boletín final. Si el 5 enseñara un 57 y el acta del 7 un 58, quien vea la
 * serie entera aprendería que la aplicación dice cosas distintas en cada papel.
 *
 * LA DE VALENTINA SALE 57 PASE LO QUE PASE EN EL VÍDEO 3. Si allí se le nivela el periodo 2 de 58
 * a 60, la media es 228/4 = 57; si no, 226/4 = 56,5 → 57. Se eligió así a propósito: el 3 lo hace
 * otro a la vez, y este número no puede depender de lo que decida.
 *
 * TODOS LOS NOMBRES SON INVENTADOS (los de `notas/planilla.ts`). El colegio, el rector y la titular
 * son los del boletín de `competencias/`, que ya están dibujados e inventados.
 */

const PERIODOS_3_Y_4: [number, number][] = [
	[86, 90],
	[75, 78],
	[96, 94],
	[70, 72],
	[52, 56],
	[84, 83],
];

export const ANO_MATEMATICAS_9B = ALUMNOS.map((a, i) => {
	const p = [DEFINITIVAS[i].periodos[0].final!, DEFINITIVAS[i].periodos[1].final!, ...PERIODOS_3_Y_4[i]];
	return { nombre: a.nombre, periodos: p, ano: Math.round(p.reduce((x, y) => x + y, 0) / 4) };
});

export const VALENTINA = 4;
export const SAMUEL = 3;

/** «Escobar Lozano, Valentina» → «Escobar Lozano Valentina»: así lo compone la pantalla (`nombreDe`). */
export const sinComa = (n: string) => n.replace(',', '');

export const MINIMA = 60;

/** La nota que se le pone a Valentina en la recuperación. */
export const RECUPERACION_VALENTINA = '70';

export const GRUPO_9B_ID = 318;

/* ── Recuperación del año ─────────────────────────────────────────────────────────────────── */

export interface Perdida {
	materia: string;
	ano: number;
}

export interface QuienArrastra {
	nombre: string;
	filas: Perdida[];
}

/*
 * LO PERDIDO DEL AÑO EN 9°B: lo que el boletín final da por perdido, y nada más. Matemáticas de
 * Valentina sale de la cuenta de arriba; el Inglés de Samuel es de otro docente e inventado.
 */
export const ARRASTRAN: QuienArrastra[] = [
	{ nombre: sinComa(ALUMNOS[SAMUEL].nombre), filas: [{ materia: 'Inglés', ano: 55 }] },
	{ nombre: sinComa(ALUMNOS[VALENTINA].nombre), filas: [{ materia: 'Matemáticas', ano: ANO_MATEMATICAS_9B[VALENTINA].ano }] },
];

export const CUANTAS = ARRASTRAN.reduce((n, a) => n + a.filas.length, 0);

/** La fila que se recupera: Matemáticas de Valentina. */
export const LA_QUE_SE_RECUPERA = { alumno: 1, fila: 0 };

/** Los grupos del docente, como los pinta la botonera. */
export const GRUPOS_DEL_DOCENTE = ['8°A', '9°A', '9°B', '10°A'];
export const EL_GRUPO = GRUPOS_DEL_DOCENTE.indexOf('9°B');

export const RA = {
	arriba: 28,
	lados: 32,
	titulo: 58,
	pista: 44,
	boton: { ancho: 104, alto: 44 },
	barra: 56,
	cabecera: 44,
	alumno: 46,
	fila: 54,
};

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const ANCHO_TABLA = ANCHO_CONTENIDO - RA.lados * 2;
export const COL_RA = { nota: 150, rec: 150, accion: 330 };
export const COL_ASIGNATURA = ANCHO_TABLA - COL_RA.nota - COL_RA.rec - COL_RA.accion;

/** Un botón de la botonera de grupos, en coordenadas de la cáscara. */
export function rectanguloDelGrupo(g: number) {
	return {
		x: MEDIDAS.menu + RA.lados + g * RA.boton.ancho,
		y: MEDIDAS.barra + RA.arriba + RA.titulo + RA.pista,
		ancho: RA.boton.ancho,
		alto: RA.boton.alto,
	};
}

const ARRIBA_TABLA = MEDIDAS.barra + RA.arriba + RA.titulo + RA.barra;

/** Arriba de una fila de asignatura, en coordenadas de la cáscara. */
export function arribaDeLaFila(alumno: number, fila: number): number {
	let y = ARRIBA_TABLA + RA.cabecera;
	for (let i = 0; i < alumno; i++) { y += RA.alumno + ARRASTRAN[i].filas.length * RA.fila; }
	return y + RA.alumno + fila * RA.fila;
}

const IZQ = MEDIDAS.menu + RA.lados;

/** La columna «Del año», de la cabecera a la última fila. */
export function rectanguloDelAno() {
	const abajo = arribaDeLaFila(ARRASTRAN.length - 1, ARRASTRAN[ARRASTRAN.length - 1].filas.length);
	return { x: IZQ + COL_ASIGNATURA, y: ARRIBA_TABLA, ancho: COL_RA.nota, alto: abajo - ARRIBA_TABLA };
}

/** La tabla entera. */
export function rectanguloDeLaTabla() {
	const abajo = arribaDeLaFila(ARRASTRAN.length - 1, ARRASTRAN[ARRASTRAN.length - 1].filas.length);
	return { x: IZQ, y: ARRIBA_TABLA, ancho: ANCHO_TABLA, alto: abajo - ARRIBA_TABLA };
}

/** Una fila entera. */
export function rectanguloDeLaFila(alumno: number, fila: number) {
	return { x: IZQ, y: arribaDeLaFila(alumno, fila), ancho: ANCHO_TABLA, alto: RA.fila };
}

/** El campo de la recuperación: 4,5 rem, centrado en su columna. */
export const CAMPO = { ancho: 92, alto: 36 };
export function rectanguloDelCampo(alumno: number, fila: number) {
	return {
		x: IZQ + COL_ASIGNATURA + COL_RA.nota + (COL_RA.rec - CAMPO.ancho) / 2,
		y: arribaDeLaFila(alumno, fila) + (RA.fila - CAMPO.alto) / 2,
		ancho: CAMPO.ancho,
		alto: CAMPO.alto,
	};
}

/** El botón «Guardar»: pequeño y a la izquierda de su celda. */
export const GUARDAR = { ancho: 110, alto: 36, margen: 12 };
export function rectanguloDeGuardar(alumno: number, fila: number) {
	return {
		x: IZQ + COL_ASIGNATURA + COL_RA.nota + COL_RA.rec + GUARDAR.margen,
		y: arribaDeLaFila(alumno, fila) + (RA.fila - GUARDAR.alto) / 2,
		ancho: GUARDAR.ancho,
		alto: GUARDAR.alto,
	};
}
