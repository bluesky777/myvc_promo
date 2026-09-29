import { MANDOS } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { Rect } from '../moverse/comun';
import { FilaAsignatura } from '../mis-asignaturas/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DESPLEGABLE DEL AÑO Y EL PERIODO, y lo que se ve detrás.
 *
 * Sale de `cascara/selector-academico/selector-academico.html:56-135` y de su `.ts`:
 *
 *   - un `nz-dropdown` que se abre al pulsar (no al pasar), pegado abajo a la derecha de la píldora;
 *   - dos columnas a la vez: «Año lectivo» y «Periodos de 2026»;
 *   - **EL ELEGIDO lleva un chulo y fondo de acento; EL EN CURSO lleva la etiqueta «en curso»**.
 *     Son dos cosas distintas (`selector-academico.ts:27-37`) y pueden no coincidir: es la duda que
 *     mata el vídeo;
 *   - abajo, el pie: «Lo que elijas aquí queda guardado en tu cuenta…»;
 *   - no se cierra al elegir: se puede cambiar de año y de periodo sin volver a abrirlo.
 *
 * AL CAMBIAR DE AÑO el servidor te deja en el periodo con el MISMO NÚMERO del año nuevo; si ese año
 * no lo tiene, en el último, y la aplicación lo dice con un segundo mensaje
 * (`selector-academico.ts:89-101`). Para enseñarlo, el año pasado del colegio tuvo tres periodos y
 * éste tiene cuatro: quien está en el 4 y mira 2025 cae en el 3.
 *
 * LOS DATOS SON INVENTADOS. El docente tiene elegido el 3 --terminando de calificar-- y el colegio ya
 * va en el 4.
 */

export const ANIOS = [
	{ anio: '2026', enCurso: true, periodos: 4, periodoEnCurso: 4 },
	{ anio: '2025', enCurso: false, periodos: 3, periodoEnCurso: null as number | null },
	{ anio: '2024', enCurso: false, periodos: 4, periodoEnCurso: null as number | null },
];

export const TEXTOS = {
	anios: 'Año lectivo',
	periodosDe: (anio: string) => `Periodos de ${anio}`,
	enCurso: 'en curso',
	pie: 'Lo que elijas aquí queda guardado en tu cuenta: la app del celular y la versión vieja verán el mismo año y el mismo periodo.',
	periodoCambiado: (n: number) => `Periodo cambiado al ${n}.`,
	anioCambiado: (a: string) => `Año cambiado a ${a}.`,
	sinEsePeriodo: (venia: number, queda: number) => `Ese año no tiene periodo ${venia}: te dejamos en el ${queda}.`,
};

/* ── Geometría del desplegable, en coordenadas de la cáscara ──────────────────────────────── */

export const D = {
	ancho: 470,
	relleno: 16,
	colAnios: 170,
	cabecera: 34,
	opcion: 46,
	pie: 96,
};

const derecha = MANDOS.selector.x + MANDOS.selector.ancho;
export const PANEL: Rect = {
	x: derecha - D.ancho,
	y: MEDIDAS.barra + 6,
	ancho: D.ancho,
	alto: D.relleno + D.cabecera + 4 * D.opcion + D.relleno + D.pie,
	radio: 10,
};

const colPeriodosX = PANEL.x + D.relleno + D.colAnios + 16;
const colPeriodosAncho = D.ancho - D.relleno * 2 - D.colAnios - 16;

export function rectDeAnio(i: number): Rect {
	return { x: PANEL.x + D.relleno, y: PANEL.y + D.relleno + D.cabecera + i * D.opcion, ancho: D.colAnios, alto: D.opcion - 4, radio: 6 };
}

export function rectDePeriodo(n: number): Rect {
	return { x: colPeriodosX, y: PANEL.y + D.relleno + D.cabecera + (n - 1) * D.opcion, ancho: colPeriodosAncho, alto: D.opcion - 4, radio: 6 };
}

export const COLUMNAS: Rect = { x: PANEL.x + 6, y: PANEL.y + 6, ancho: PANEL.ancho - 12, alto: D.relleno + D.cabecera + 4 * D.opcion, radio: 8 };
export const PIE: Rect = { x: PANEL.x + 6, y: PANEL.y + PANEL.alto - D.pie - 4, ancho: PANEL.ancho - 12, alto: D.pie, radio: 8 };
export const COL_PERIODOS = { x: colPeriodosX, ancho: colPeriodosAncho };

/* ── Lo que se ve detrás: «Mis asignaturas» de cada año ───────────────────────────────────── */

/** Lo del año pasado: otras asignaturas, todas con su planeación completa (es un año cerrado). */
export const FILAS_2025: FilaAsignatura[] = [
	{ materia: 'Matemáticas', grupo: '8°B', sigla: '8B', color: '#0e8f9e', nombreGrupo: 'Octavo B', ih: 5, logros: 3, avisos: [] },
	{ materia: 'Ciencias Naturales', grupo: '7°A', sigla: '7A', color: '#c2410c', nombreGrupo: 'Séptimo A', ih: 4, logros: 3, avisos: [] },
	{ materia: 'Estadística', grupo: '9°A', sigla: '9A', color: '#7b5cd6', nombreGrupo: 'Noveno A', ih: 2, logros: 2, avisos: [] },
];
