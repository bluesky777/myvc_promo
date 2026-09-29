import { ALUMNOS } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import { MEDIDAS, SECCIONES, entradaDe } from '../medidas';
import { FECHAS } from '../docente-asistencia/datos';
import { GRUPOS } from '../disciplina/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «ASISTENCIAS», Y DÓNDE CAE.
 *
 * LA PANTALLA ES `paginas/asistencias` DE app2: «Asistencias a la institución», el selector de
 * grupos, «Buscar alumno…», «Ver clases» y «Ver institución», y la tabla con los dos pares de
 * columnas. Las de CLASES son fichas sin casilla («aquí sólo se miran», dice su tooltip); las de la
 * INSTITUCIÓN llevan la casilla del número, que al subir crea una falta con la fecha de hoy.
 *
 * LAS FALTAS A CLASE DE 9°B SALEN DE LA PLANILLA: las de Matemáticas son las fechas de
 * `docente-asistencia` (con las dos que aquel vídeo anotó hoy, 28 sep: Tomás y Mariana), y se
 * añaden unas pocas de otras materias --esta columna junta todas-- con su alias delante, como la
 * pinta app2 (`<b>alias:</b> fecha`). Las de la institución son inventadas: pocas, porque las pone
 * la portería o la coordinación.
 *
 * LOS GRUPOS DEL SELECTOR son los de los vídeos de disciplina (8A, 9A, 9B con su estrella, 10A).
 */

export const HOY = '28 sep';

export const ENTRADA_ASISTENCIAS = entradaDe(SECCIONES, 'Disciplina', 'Asistencias');
export { GRUPOS };
export const EL_GRUPO = GRUPOS.findIndex((g) => g.abrev === '9B');

export interface Ficha {
	alias?: string;
	fecha: string;
}

export interface FilaDeAsistencias {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	ausenciasClase: Ficha[];
	tardanzasClase: Ficha[];
	ausencias: Ficha[];
	tardanzas: Ficha[];
}

/** De «14 ag» (la planilla, dos letras) a «14 ago» (esta pantalla, tres). */
const tres = (f: string) => f.replace(/ ag$/, ' ago').replace(/ se$/, ' sep');

const OTRAS: Record<string, Partial<Pick<FilaDeAsistencias, 'ausenciasClase' | 'tardanzasClase' | 'ausencias' | 'tardanzas'>>> = {
	'Rojas Valencia, Mateo David': { ausenciasClase: [{ alias: 'ING', fecha: '9 sep' }] },
	'Delgado Peña, Samuel': { tardanzas: [{ fecha: '22 sep' }] },
	'Escobar Lozano, Valentina': { ausencias: [{ fecha: '15 sep' }] },
};

export const FILAS: FilaDeAsistencias[] = ALUMNOS.map((a) => {
	const f = FECHAS[a.nombre];
	const mat = (xs: string[]) => xs.map((x) => ({ alias: 'MAT', fecha: tres(x) }));
	const o = OTRAS[a.nombre] ?? {};
	const hoyAus = a.nombre.startsWith('Fajardo Mejía') ? [{ alias: 'MAT', fecha: HOY }] : [];
	const hoyTard = a.nombre.startsWith('Cardona Ruiz') ? [{ alias: 'MAT', fecha: HOY }] : [];
	return {
		nombre: a.nombre,
		sexo: a.sexo,
		ausenciasClase: [...mat(f.ausencias), ...hoyAus, ...(o.ausenciasClase ?? [])],
		tardanzasClase: [...mat(f.tardanzas), ...hoyTard, ...(o.tardanzasClase ?? [])],
		ausencias: o.ausencias ?? [],
		tardanzas: o.tardanzas ?? [],
	};
});

/** A quién se le anota una ausencia a la institución en el vídeo: a Mateo, que llegó sin excusa. */
export const MATEO = ALUMNOS.findIndex((a) => a.nombre.startsWith('Rojas Valencia'));

export const TEXTOS = {
	titulo: 'Asistencias a la institución',
	vacio: 'Elige un grupo para ver sus ausencias y tardanzas.',
	buscar: 'Buscar alumno…',
	verClases: 'Ver clases',
	verInstitucion: 'Ver institución',
	cuantos: `${ALUMNOS.length} alumnos`,
	columnas: ['Ausencias a CLASES', 'Tardanzas a CLASES', 'Ausencias a la institución', 'Tardanzas a la institución'],
	bloqueado: 'Este periodo está bloqueado y no se puede modificar la asistencia.',
	bloqueadoDetalle: 'Lo abre y lo cierra el administrador, en Configuración → El colegio.',
};

/* ═══ LA PÁGINA SIN GRUPO, dentro de la cáscara (coordenadas de la CÁSCARA) ═══════════════════ */

export const SIN_GRUPO = { arriba: 26, lados: 32, titulo: 44, selector: { y: 64, alto: 38, ancho: 70, hueco: 10 }, vacio: 150 };

export function botonDeGrupoEnCascara(i: number) {
	return {
		x: MEDIDAS.menu + SIN_GRUPO.lados + i * (SIN_GRUPO.selector.ancho + SIN_GRUPO.selector.hueco),
		y: MEDIDAS.barra + SIN_GRUPO.arriba + SIN_GRUPO.selector.y,
		ancho: SIN_GRUPO.selector.ancho,
		alto: SIN_GRUPO.selector.alto,
	};
}

/* ═══ LA PÁGINA CON 9B, a pantalla completa (coordenadas del PANEL) ═══════════════════════════ */

export const PG = {
	ancho: 1580,
	relleno: 36,
	letra: 21,
	titulo: 44,
	hueco: 16,
	alerta: 92,
	grupos: 44,
	mandos: 44,
	cuantos: 30,
	cabecera: 66,
	fila: 76,
};
export const UTIL = PG.ancho - PG.relleno * 2;
export const COL = { num: 60, alumno: 340, info: 56, falta: (UTIL - 60 - 340 - 56) / 4 };

export function plano(cerrado: boolean) {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo + PG.hueco;
	const alerta = y; if (cerrado) { y += PG.alerta + PG.hueco; }
	const grupos = y; y += PG.grupos + PG.hueco;
	const mandos = y; y += PG.mandos + PG.hueco;
	const cuantos = y; y += PG.cuantos + 8;
	const tabla = y; y += PG.cabecera + FILAS.length * PG.fila + PG.relleno;
	return { titulo, alerta, grupos, mandos, cuantos, tabla, alto: y };
}

export const ALTO_PANEL = plano(true).alto;

export const ENCUADRE = (() => {
	const escala = Math.min((BANDA.alto - 24) / ALTO_PANEL, (1920 - 120) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - ALTO_PANEL * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

export const xFalta = (c: number) => PG.relleno + COL.num + COL.alumno + COL.info + c * COL.falta;

export function rectCabecera(cerrado: boolean): Rect {
	return { x: PG.relleno, y: plano(cerrado).tabla, ancho: UTIL, alto: PG.cabecera };
}
/** Un par de columnas (0 = clases, 1 = institución), de la cabecera a la última fila. */
export function rectPar(par: 0 | 1, cerrado: boolean): Rect {
	return { x: xFalta(par * 2), y: plano(cerrado).tabla, ancho: COL.falta * 2, alto: PG.cabecera + FILAS.length * PG.fila };
}
export function rectCelda(fila: number, c: number, cerrado: boolean): Rect {
	return { x: xFalta(c), y: plano(cerrado).tabla + PG.cabecera + fila * PG.fila, ancho: COL.falta, alto: PG.fila };
}
/** La casilla del número de una celda de la institución. */
export function rectContador(fila: number, c: number, cerrado: boolean): Rect {
	const r = rectCelda(fila, c, cerrado);
	return { x: r.x + 12, y: r.y + (PG.fila - 40) / 2, ancho: 64, alto: 40 };
}
export function rectAlerta(): Rect {
	return { x: PG.relleno, y: plano(true).alerta, ancho: UTIL, alto: PG.alerta };
}
