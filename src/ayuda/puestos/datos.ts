import { DOCENTES, SEPTIMO_A, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PUESTOS AÑO 2026 GRUPO 7°A», HASTA EL PERIODO 3. Las notas del año son inventadas; el total es
 * la media de las diez asignaturas con un decimal, y el puesto sale como en
 * `puestosDelGrupo` (`informes/puestos/puestos.ts:389`): 1 + cuántos tienen un total MAYOR. Dos con
 * el mismo total comparten puesto, y entonces la tabla pinta la columna «No» (`hayEmpates`).
 */

export interface FilaDePuestos {
	nombre: string;
	notas: number[];
	co: number;
	total: number;
	perdidas: number;
	puesto: number;
}

/** Las notas del año de cada alumno, en el orden de `DOCENTES`. Escritas a mano. */
const NOTAS: number[][] = [
	[78, 81, 84, 80, 76, 95, 88, 86, 90, 85],
	[84, 86, 70, 88, 90, 94, 83, 87, 91, 86],
	[92, 90, 93, 89, 95, 97, 94, 91, 96, 93],
	[66, 72, 75, 70, 68, 90, 80, 78, 84, 80],
	[88, 84, 86, 85, 80, 92, 90, 88, 89, 86],
	[95, 94, 96, 93, 97, 96, 95, 94, 98, 95],
	[55, 64, 58, 66, 57, 88, 76, 72, 80, 74],
	[81, 85, 83, 86, 88, 91, 87, 84, 90, 88],
	[74, 70, 72, 75, 71, 93, 82, 80, 85, 81],
	[89, 91, 90, 87, 92, 95, 93, 90, 94, 91],
	[58, 59, 70, 72, 66, 89, 78, 75, 82, 79],
	[86, 88, 85, 90, 87, 93, 89, 88, 92, 90],
	[77, 80, 79, 76, 62, 94, 85, 83, 87, 84],
	[90, 92, 88, 91, 93, 96, 92, 89, 95, 92],
	[70, 74, 73, 71, 75, 91, 81, 79, 83, 80],
	[83, 82, 87, 84, 85, 92, 88, 86, 90, 86],
	[79, 76, 81, 78, 80, 90, 84, 82, 86, 83],
	[87, 89, 86, 88, 90, 94, 90, 87, 93, 89],
	[72, 75, 74, 77, 70, 92, 83, 81, 84, 82],
	[93, 90, 94, 92, 91, 97, 93, 92, 95, 94],
];
const CO = [85, 86, 92, 80, 84, 95, 72, 88, 82, 90, 78, 87, 84, 91, 80, 86, 83, 89, 81, 92];

const media = (xs: number[]) => Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;

const SIN_ORDEN = SEPTIMO_A.map((a, i) => ({
	nombre: nombreDe(a),
	notas: NOTAS[i],
	co: CO[i],
	total: media(NOTAS[i]),
	perdidas: NOTAS[i].filter((n) => n < 60).length,
}));

/** Por total, de mayor a menor, con el puesto como lo cuenta la aplicación. */
export const FILAS: FilaDePuestos[] = SIN_ORDEN
	.map((f) => ({ ...f, puesto: 1 + SIN_ORDEN.filter((o) => o.total > f.total).length }))
	.sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'));

export const HAY_EMPATES = new Set(FILAS.map((f) => f.puesto)).size !== FILAS.length;
/** Los dos que empatan, para el foco. */
export const EMPATE = FILAS.findIndex((f, i) => i > 0 && FILAS[i - 1].puesto === f.puesto) - 1;

export const COLUMNAS = DOCENTES.map((d) => d.alias);
export const PROMEDIOS = COLUMNAS.map((_, j) => media(FILAS.map((f) => f.notas[j])));
export const PROMEDIO_TOTAL = media(FILAS.map((f) => f.total));
export const PROMEDIO_CO = media(FILAS.map((f) => f.co));

/** `fechaDeAhora()`: `toLocaleString('es-CO')` con día, mes, año, hora y minutos, a doce horas. */
export const CALCULADO = '28/09/2026, 10:42 a. m.';
export const TITULO_HOJA = 'Puestos Año 2026 Grupo 7°A';
