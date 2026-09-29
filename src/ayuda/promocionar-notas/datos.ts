import { ALTO_CONTROL } from '../montar-el-ano/ant';
import { MAIN, type Rect } from '../comun-directivo/lugar';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PROMOCIONAR NOTAS»: LO QUE SE VE Y DÓNDE CAE CADA MANDO (`paginas/promocionar-notas`).
 *
 * LA HISTORIA: Tomás Felipe pasó de 9°B a 9°A a mitad de año. Sus notas del periodo 2 están en
 * 9°B, donde ya sale como RETIRADO; en 9°A está matriculado y todavía sin notas. Se copian de un
 * lado al otro. Todo inventado: el alumno, los compañeros, las notas y los docentes.
 *
 * LAS FILAS son las de `parear()` (`tipos.ts`): por `materia_id`. Emprendimiento sólo existe en el
 * plan de 9°B, así que sale «No existe en el destino»; Inglés ya tiene nota en 9°A, así que
 * «Reemplaza el 65»; Naturales vale lo mismo en los dos lados.
 */

const ARRIBA = MAIN.y;

export const ALUMNO = 'Arenas Quintero Tomás Felipe';
export const ALUMNOS_DE_9B = ['Álvarez Mora Daniela', `${ALUMNO} (RETIRADO)`, 'Bautista Lizcano Sergio Andrés', 'Carrillo Duarte Natalia'];
export const EL_ALUMNO = 1;

export const LADO = { ancho: 506, arriba: ARRIBA + 84, alto: 212 };
export const ORIGEN_X = MAIN.x;
export const DESTINO_X = MAIN.x + MAIN.ancho - LADO.ancho;
export const FLECHA = { x: ORIGEN_X + LADO.ancho, ancho: DESTINO_X - ORIGEN_X - LADO.ancho };

/** Las piezas de un lado, relativas a su esquina. */
export const PIEZA = { cabecera: 46, grupo: { dx: 16, dy: 54, ancho: 150 }, alumno: { dx: 176, dy: 54, ancho: 314 }, ubicaciones: 100, ubicacion: 44 };

export const rectLado = (lado: 'origen' | 'destino'): Rect => ({ x: lado === 'origen' ? ORIGEN_X : DESTINO_X, y: LADO.arriba, ancho: LADO.ancho, alto: LADO.alto });

export const rectAlumno = (lado: 'origen' | 'destino'): Rect => ({ x: rectLado(lado).x + PIEZA.alumno.dx, y: LADO.arriba + PIEZA.alumno.dy, ancho: PIEZA.alumno.ancho, alto: ALTO_CONTROL });

export const rectOpcionAlumno = (i: number): Rect => {
	const a = rectAlumno('origen');
	return { x: a.x + 4, y: a.y + ALTO_CONTROL + 8 + i * 34, ancho: a.ancho - 8, alto: 34 };
};

/** Las ubicaciones del alumno: más nuevo primero; dentro del año, la matrícula válida arriba. */
export const UBICACIONES = [
	{ anio: 2026, grupo: '9°A', etiqueta: 'matriculado' as const },
	{ anio: 2026, grupo: '9°B', etiqueta: 'con notas' as const },
];

export const PERIODOS = [1, 2, 3, 4];

export function rectPeriodo(lado: 'origen' | 'destino', ubicacion: number, periodo: number): Rect {
	const l = rectLado(lado);
	return { x: l.x + l.ancho - 16 - (PERIODOS.length - PERIODOS.indexOf(periodo)) * 36 + 4, y: l.y + PIEZA.ubicaciones + ubicacion * PIEZA.ubicacion + 7, ancho: 30, alto: 30 };
}

export const UBICACION_ORIGEN = 1;
export const UBICACION_DESTINO = 0;
export const PERIODO = 2;

/* ── La tabla ─────────────────────────────────────────────────────────────────────────────── */

export const CONTROLES_Y = LADO.arriba + LADO.alto + 16;
export const TABLA = { x: MAIN.x, y: CONTROLES_Y + 44, ancho: MAIN.ancho, cabecera: 40, fila: 42 };

export const COLUMNAS = [
	{ clave: 'marca', titulo: '', ancho: 44 },
	{ clave: 'materia', titulo: 'Materia', ancho: 300 },
	{ clave: 'origen', titulo: 'Origen', ancho: 100 },
	{ clave: 'flecha', titulo: '', ancho: 52 },
	{ clave: 'destino', titulo: 'Destino', ancho: 100 },
	{ clave: 'manual', titulo: 'Manual', ancho: 84 },
	{ clave: 'rec', titulo: 'Rec', ancho: 64 },
	{ clave: 'pasara', titulo: 'Qué pasará', ancho: MAIN.ancho - 44 - 300 - 100 - 52 - 100 - 84 - 64 },
] as const;

export type Estado = 'nueva' | 'reemplaza' | 'igual' | 'sin-pareja';

export interface Fila { materia: string; docente: string; tipo: 'mujer' | 'hombre'; variante: number; origen: number; destino: number | null; estado: Estado }

export const NOTA_MINIMA = 60;

export const FILAS: Fila[] = [
	{ materia: 'Matemáticas', docente: 'Hernando Pabón Rivera', tipo: 'hombre', variante: 2, origen: 78, destino: null, estado: 'nueva' },
	{ materia: 'Lengua castellana', docente: 'Clara Inés Vera Suárez', tipo: 'mujer', variante: 4, origen: 85, destino: null, estado: 'nueva' },
	{ materia: 'Inglés', docente: 'Wilson Ferney Gélvez Rozo', tipo: 'hombre', variante: 0, origen: 72, destino: 65, estado: 'reemplaza' },
	{ materia: 'Ciencias naturales', docente: 'Ruth Mery Contreras Pinto', tipo: 'mujer', variante: 5, origen: 81, destino: 81, estado: 'igual' },
	{ materia: 'Ciencias sociales', docente: 'Jairo Alonso Ramírez Leal', tipo: 'hombre', variante: 3, origen: 58, destino: null, estado: 'nueva' },
	{ materia: 'Emprendimiento', docente: 'Sandra Milena Ortiz Paz', tipo: 'mujer', variante: 1, origen: 90, destino: null, estado: 'sin-pareja' },
];

export const MARCADAS = FILAS.filter((f) => f.estado === 'nueva' || f.estado === 'reemplaza');
export const SE_CREAN = FILAS.filter((f) => f.estado === 'nueva').length;
export const SE_PISAN = FILAS.filter((f) => f.estado === 'reemplaza').length;

export function xColumna(clave: string): number {
	let x = TABLA.x;
	for (const c of COLUMNAS) { if (c.clave === clave) { return x; } x += c.ancho; }
	throw new Error(`Promocionar: no hay columna «${clave}».`);
}
export const anchoColumna = (clave: string) => COLUMNAS.find((c) => c.clave === clave)!.ancho;

export const rectFila = (i: number): Rect => ({ x: TABLA.x, y: TABLA.y + TABLA.cabecera + i * TABLA.fila, ancho: TABLA.ancho, alto: TABLA.fila });
export const rectTabla = (): Rect => ({ x: TABLA.x, y: TABLA.y, ancho: TABLA.ancho, alto: TABLA.cabecera + FILAS.length * TABLA.fila });
export function rectColumnas(desde: string, hasta = desde): Rect {
	const x = xColumna(desde);
	return { x, y: TABLA.y, ancho: xColumna(hasta) + anchoColumna(hasta) - x, alto: TABLA.cabecera + FILAS.length * TABLA.fila };
}

export const BARRA_Y = TABLA.y + TABLA.cabecera + FILAS.length * TABLA.fila + 14;
export const COPIAR = { x: MAIN.x + MAIN.ancho - 188, y: BARRA_Y + 4, ancho: 188, alto: 40 };

/* ── El diálogo de confirmación (560 de ancho, como `confirmar-copia.ts`) ───────────────────── */

export const DIALOGO = { x: MAIN.x + (MAIN.ancho - 560) / 2, y: 170, ancho: 560, alto: 316 };
export const rectListaDialogo = (): Rect => ({ x: DIALOGO.x + 24, y: DIALOGO.y + 182, ancho: DIALOGO.ancho - 48, alto: 64 });
export const rectCopiarDialogo = (): Rect => ({ x: DIALOGO.x + DIALOGO.ancho - 24 - 150, y: DIALOGO.y + DIALOGO.alto - 24 - 32, ancho: 150, alto: 32 });
