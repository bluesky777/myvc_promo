import { COLUMNAS } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import {
	ANCHOS as ANCHOS_PL, ANCHO_TABLA as ANCHO_TABLA_PL, ARRIBA_MODO, ENCUADRE_PL, INICIAL, NIVELACION, NOTAS, PL, QUEDA, VALENTINA,
} from '../cierre-3/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «NIVELACIONES DEL GRUPO, EN LOTE», Y DÓNDE CAE.
 *
 * LA PANTALLA ES `paginas/nivelaciones` DE app2 (`/nivelaciones/:asignatura_id`), y en 9°B sólo
 * hay dos cosas perdidas, las dos de Valentina: el taller (58) y el quiz (55). Es la misma semana
 * de nivelaciones de `cierre-3`, y **se nivela lo mismo que allí --el quiz, 85, que queda en 60--**
 * pero por la lista del grupo en vez de por el diálogo de la celda. Así el total sigue siendo 60 y
 * el boletín de `cierre-4` (58 tachado, 60) no se contradice. El taller se queda sin nivelar.
 *
 * LO QUE EL VÍDEO ENSEÑA ES LA DIFERENCIA CON EL DIÁLOGO: aquí se escribe lo que sacó (85) y **no
 * se ve lo que va a quedar** --el comentario de la casilla en `nivelaciones.html` lo dice: «lo que
 * sacó en la superación, no lo que va a quedar»--, y se guarda con un botón. El 60 sólo aparece
 * después, en la columna Inicial, con el 55 tachado.
 */

export const TALLER = COLUMNAS.indexOf('Taller');
export const QUIZ = COLUMNAS.indexOf('Quiz');
export { INICIAL, NIVELACION, QUEDA, VALENTINA };
export const INICIAL_TALLER = NOTAS[VALENTINA][TALLER]!;

/** Lo que se escribe en «Actividad de superación». */
export const ACTIVIDAD = 'Sustentación oral';

export const TEXTOS = {
	titulo: 'Nivelaciones del grupo',
	pista: 'Matemáticas · Noveno B',
	/** «2. Álgebra · 1. Taller»: la unidad y el indicador numerados, como `nombresDeIndicador`. */
	indicadores: ['2. Álgebra · 1. Taller', '2. Álgebra · 2. Quiz'],
	alumno: 'Escobar Lozano Valentina',
	columnas: ['Indicador', 'Inicial', 'Nivelación', 'Actividad de superación'],
	placeholder: 'Taller, sustentación…',
	porNivelar: (n: number) => `${n} ${n === 1 ? 'indicador' : 'indicadores'} por nivelar`,
	escritas: (n: number) => `· ${n} con nota escrita`,
	registrar: (n: number) => `Registrar ${n} ${n === 1 ? 'nivelación' : 'nivelaciones'}`,
	toast: 'Se registró 1 nivelación.',
};

/* ═══ EL ENLACE DE LA PLANILLA (la de `cierre-3`): «Ver todo lo perdido del grupo en una lista» ═ */

/** El enlace va pegado a la derecha de la fila del modo; mide lo que su texto a 15,5 px. */
export const ENLACE_EN_PLANILLA = (() => {
	const ancho = 318;
	const r = { x: ANCHOS_PL.relleno + ANCHO_TABLA_PL - 6 - ancho, y: ARRIBA_MODO, ancho, alto: PL.modo };
	const e = ENCUADRE_PL;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala };
})();

/* ═══ LA PÁGINA DE NIVELACIONES, a pantalla completa (coordenadas del PANEL) ══════════════════ */

export const PG = {
	ancho: 1440,
	relleno: 36,
	letra: 22,
	titulo: 44,
	pista: 30,
	hueco: 18,
	barra: 48,
	cabecera: 56,
	alumno: 52,
	fila: 66,
};
export const UTIL = PG.ancho - PG.relleno * 2;
export const COL = { indicador: 500, inicial: 170, nivelacion: 190, actividad: UTIL - 500 - 170 - 190 };

export const Y = (() => {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo;
	const pista = y; y += PG.pista + PG.hueco;
	const barra = y; y += PG.barra + PG.hueco;
	const tabla = y; y += PG.cabecera + PG.alumno + 2 * PG.fila + PG.relleno;
	return { titulo, pista, barra, tabla, alto: y };
})();

export const ENCUADRE = (() => {
	const escala = Math.min(1.15, (BANDA.alto - 24) / Y.alto, (1920 - 120) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - Y.alto * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

const X0 = PG.relleno;
export const xDe = (c: 'indicador' | 'inicial' | 'nivelacion' | 'actividad') =>
	X0 + (c === 'indicador' ? 0 : c === 'inicial' ? COL.indicador : c === 'nivelacion' ? COL.indicador + COL.inicial : COL.indicador + COL.inicial + COL.nivelacion);

/** Una fila de indicador (0 = taller, 1 = quiz). */
export function rectFila(i: number): Rect {
	return { x: X0, y: Y.tabla + PG.cabecera + PG.alumno + i * PG.fila, ancho: UTIL, alto: PG.fila };
}
export function rectCampo(i: number, c: 'nivelacion' | 'actividad'): Rect {
	const f = rectFila(i);
	const ancho = c === 'nivelacion' ? COL.nivelacion - 28 : COL.actividad - 28;
	return { x: xDe(c) + 14, y: f.y + (PG.fila - 42) / 2, ancho, alto: 42 };
}
export function rectCelda(i: number, c: 'inicial' | 'nivelacion'): Rect {
	const f = rectFila(i);
	return { x: xDe(c), y: f.y, ancho: COL[c], alto: PG.fila };
}
export const ANCHO_BOTON = 300;
export function rectBoton(): Rect {
	return { x: PG.ancho - PG.relleno - ANCHO_BOTON, y: Y.barra + (PG.barra - 44) / 2, ancho: ANCHO_BOTON, alto: 44 };
}
export function rectTabla(): Rect {
	return { x: X0, y: Y.tabla, ancho: UTIL, alto: PG.cabecera + PG.alumno + 2 * PG.fila };
}
