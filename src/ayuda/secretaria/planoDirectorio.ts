import { CABECERA, FILA } from '../montar-el-ano/Rejilla';
import type { Columna } from '../montar-el-ano/Rejilla';
import { ALTO_CABECERA, MAIN, anchoDeBoton, botonesDeCabecera, enCascara, rectBotonDeGrupo, rectDeEstado, type BotonDeCabecera, type Rect } from './piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ ALUMNOS (`/alumnos`, `paginas/panel-alumnos`), EN NÚMEROS.
 *
 * El orden es el de `panel-alumnos.html`: cabecera con cinco botones, el selector de grupos, el botón
 * «Cambiar contraseñas y usuarios» (y su panel si está abierto), la pista, la rejilla (60vh), el
 * resumen, los dos botones de retirados y sin matrícula, y «Buscar en todo el sistema». Entre bloque
 * y bloque, 1rem (`main { gap: 1rem }`). Todo en coordenadas de la página (`piezas.tsx`).
 */

export const BOTONES_DIRECTORIO: BotonDeCabecera[] = [
	{ texto: 'Crear alumno', icono: 'user-add' },
	{ texto: 'Exportar para SIMAT', icono: 'download' },
	{ texto: 'Importar alumnos', icono: 'upload' },
	{ texto: 'Bajar lo que se ve (CSV)', icono: 'download' },
	{ texto: 'Recargar', icono: 'reload' },
];

export const HUECO = 16;
export const ALTO_REJILLA = 540;
/** El panel de «Cambiar contraseñas y usuarios» abierto, con sus dos bloques. */
export const ALTO_PANEL_CLAVES = 440;

/** Las ocho del principio, con los anchos de `panel-alumnos.ts:313-460`. Nº, Nombres y Acciones van fijas a la izquierda. */
export const COLUMNAS_DIRECTORIO: Columna[] = [
	{ clave: 'no', titulo: 'Nº', ancho: 64 },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 160, filtro: true },
	{ clave: 'acciones', titulo: 'Acciones', ancho: 16 + 3 * 34 },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 150, filtro: true },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 110, filtro: true },
	{ clave: 'estado', titulo: 'Matrícula', ancho: 250, alinear: 'centro' },
	{ clave: 'promovido', titulo: 'Promovido?', ancho: 100 },
	{ clave: 'no_matricula', titulo: '# matrícula', ancho: 110, filtro: true },
	{ clave: 'fecha', titulo: 'Fecha matrícula', ancho: 150, filtro: true },
	{ clave: 'retiro', titulo: 'Fecha retiro/deserción', ancho: 190, filtro: true },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 170 },
	{ clave: 'deuda', titulo: 'Deuda', ancho: 110, filtro: true },
];

export const ESTADOS_DIRECTORIO = ['Prem', 'PreA', 'Matr', 'Asis', 'Reti', 'Dese', '…'];
/** En la lista «sin matrícula» la columna «Matrícula» son estos tres (`panel-alumnos.ts:1176-1178`). */
export const ESTADOS_SIN_MATRICULA = ['Asis', 'Matric', '…'];
export const ALTO_PISTA_LISTA = 42;
/** La rejilla de «sin matrícula», con sitio para tres filas. */
export const ALTO_REJILLA_LISTA = CABECERA * 2 + 3 * FILA + 20;
export const TEXTO_BOTON_SIN_MATRICULA = (abierta: boolean, n: number) => `${abierta ? 'Ocultar' : 'Ver'} alumnos sin matrícula (${n})`;
export const LETRA_ESTADOS_DIRECTORIO = 12;
export const HUECO_ESTADOS_DIRECTORIO = 3;

export interface DisposicionDirectorio {
	selector: number;
	claves: number;
	panel: number | null;
	pista: number;
	rejilla: number;
	resumen: number;
	retirados: number;
	sinMatricula: number;
	buscador: number;
	/** La lista de «Ver alumnos sin matrícula» abierta: su pista y su rejilla, o `null` si está cerrada. */
	listaPista: number | null;
	listaRejilla: number | null;
	/** Donde empiezan los resultados de la búsqueda, si los hay. */
	resultados: number;
	fin: number;
}

/** `conGrupo`: sin grupo elegido no hay rejilla, ni resumen, ni botones, y el buscador sube. */
export function disposicionDirectorio(panelAbierto: boolean, conResultados: boolean, conGrupo = true, listaAbierta = false): DisposicionDirectorio {
	const selector = ALTO_CABECERA + HUECO;
	const claves = selector + 32 + HUECO;
	const panel = panelAbierto ? claves + 32 + 12 : null;
	const pista = (panel !== null ? panel + ALTO_PANEL_CLAVES : claves + 32) + HUECO;
	const rejilla = pista + 21 + HUECO;
	const resumen = rejilla + ALTO_REJILLA + HUECO;
	const retirados = resumen + 22 + HUECO;
	const sinMatricula = retirados + 32 + HUECO;
	/* La lista abierta va debajo de su botón: la pista (dos renglones) y la rejilla (`panel-alumnos.html:350-364`). */
	const listaPista = conGrupo && listaAbierta ? sinMatricula + 32 + HUECO : null;
	const listaRejilla = listaPista !== null ? listaPista + ALTO_PISTA_LISTA + 8 : null;
	const buscador = !conGrupo ? rejilla : listaRejilla !== null ? listaRejilla + ALTO_REJILLA_LISTA + HUECO : sinMatricula + 32 + HUECO;
	/* h2 (24 + 8) y la caja con los dos botones (32), y la pista de los resultados. */
	const resultados = buscador + 32 + 32 + 12 + 21 + 8;
	const fin = conResultados ? resultados + 300 : buscador + 32 + 32;
	return { selector, claves, panel, pista, rejilla, resumen, retirados, sinMatricula, listaPista, listaRejilla, buscador, resultados, fin };
}

/* ── Rectángulos, en coordenadas de la CÁSCARA (ya con el desplazamiento) ─────────────────── */

export const rectBotonCabecera = (i: number, desplazada = 0): Rect => enCascara(botonesDeCabecera(BOTONES_DIRECTORIO)[i], desplazada);

export const rectGrupo = (abrev: string, desplazada = 0): Rect => enCascara(rectBotonDeGrupo(abrev, ALTO_CABECERA + HUECO), desplazada);

export const ANCHO_BOTON_CLAVES = anchoDeBoton('Cambiar contraseñas y usuarios', true) + 20;

export const rectBotonClaves = (desplazada = 0): Rect =>
	enCascara({ x: 0, y: disposicionDirectorio(false, false).claves, ancho: ANCHO_BOTON_CLAVES, alto: 32 }, desplazada);

export function xDeColumna(clave: string): number {
	let x = 0;
	for (const c of COLUMNAS_DIRECTORIO) {
		if (c.clave === clave) { return x; }
		x += c.ancho;
	}
	throw new Error(`Directorio: no hay columna «${clave}».`);
}

export const anchoDeColumna = (clave: string) => COLUMNAS_DIRECTORIO.find((c) => c.clave === clave)!.ancho;

/** Una celda de la rejilla principal: fila `i` (desde 0), columna `clave`. */
export function rectCelda(d: DisposicionDirectorio, i: number, clave: string, desplazada = 0): Rect {
	return enCascara({ x: xDeColumna(clave), y: d.rejilla + CABECERA * 2 + i * FILA, ancho: anchoDeColumna(clave), alto: FILA }, desplazada);
}

/** Varias celdas seguidas de la fila `i`, de `desde` a `hasta`. */
export function rectFila(d: DisposicionDirectorio, i: number, desde: string, hasta: string, desplazada = 0): Rect {
	const a = rectCelda(d, i, desde, desplazada);
	const b = rectCelda(d, i, hasta, desplazada);
	return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: FILA };
}

/** Uno de los tres iconos de «Acciones»: 0 la ficha, 1 los acudientes, 2 la papelera. */
export function rectAccion(d: DisposicionDirectorio, i: number, cual: 0 | 1 | 2, desplazada = 0): Rect {
	const c = rectCelda(d, i, 'acciones', desplazada);
	return { x: c.x + 8 + cual * 34, y: c.y + 5, ancho: 32, alto: 32 };
}

/** Uno de los botones de la tira «Matrícula». La tira va centrada en su columna. */
export function rectEstado(d: DisposicionDirectorio, i: number, boton: string, desplazada = 0): Rect {
	const c = rectCelda(d, i, 'estado', desplazada);
	const total = ESTADOS_DIRECTORIO.reduce((n, b) => n + rectDeEstado([b], b, LETRA_ESTADOS_DIRECTORIO).ancho, 0) + HUECO_ESTADOS_DIRECTORIO * (ESTADOS_DIRECTORIO.length - 1);
	const r = rectDeEstado(ESTADOS_DIRECTORIO, boton, LETRA_ESTADOS_DIRECTORIO, HUECO_ESTADOS_DIRECTORIO);
	return { x: c.x + (c.ancho - total) / 2 + r.x, y: c.y + 8, ancho: r.ancho, alto: 26 };
}

/** Un botón de la columna «Matrícula» de la lista «sin matrícula» (fila `i`). */
export function rectEstadoSinMatricula(d: DisposicionDirectorio, i: number, boton: string, desplazada = 0): Rect {
	if (d.listaRejilla === null) { throw new Error('Directorio: la lista «sin matrícula» está cerrada.'); }
	const total = ESTADOS_SIN_MATRICULA.reduce((n, b) => n + rectDeEstado([b], b, LETRA_ESTADOS_DIRECTORIO).ancho, 0) + HUECO_ESTADOS_DIRECTORIO * (ESTADOS_SIN_MATRICULA.length - 1);
	const r = rectDeEstado(ESTADOS_SIN_MATRICULA, boton, LETRA_ESTADOS_DIRECTORIO, HUECO_ESTADOS_DIRECTORIO);
	const x = xDeColumna('estado');
	return enCascara({ x: x + (anchoDeColumna('estado') - total) / 2 + r.x, y: d.listaRejilla + CABECERA * 2 + i * FILA + 8, ancho: r.ancho, alto: 26 }, desplazada);
}

/** La lista «sin matrícula» entera, de la pista al pie de su rejilla. */
export function rectListaSinMatricula(d: DisposicionDirectorio, desplazada = 0): Rect {
	if (d.listaPista === null || d.listaRejilla === null) { throw new Error('Directorio: la lista «sin matrícula» está cerrada.'); }
	return enCascara({ x: 0, y: d.listaPista, ancho: MAIN.ancho, alto: d.listaRejilla + ALTO_REJILLA_LISTA - d.listaPista }, desplazada);
}

/** La rejilla entera, o las primeras `filas` filas con la cabecera. */
export function rectRejilla(d: DisposicionDirectorio, filas: number | null, desplazada = 0): Rect {
	return enCascara({ x: 0, y: d.rejilla, ancho: MAIN.ancho, alto: filas === null ? ALTO_REJILLA : CABECERA * 2 + filas * FILA }, desplazada);
}

/* ── «Buscar en todo el sistema» ──────────────────────────────────────────────────────────── */

export const ANCHO_CAJA_BUSCAR = 360;
export const BOTON_POR_NOMBRE = anchoDeBoton('Por nombre', true);
export const BOTON_POR_APELLIDO = anchoDeBoton('Por apellido', true);

export const rectCajaBuscar = (d: DisposicionDirectorio, desplazada = 0): Rect =>
	enCascara({ x: 0, y: d.buscador + 32, ancho: ANCHO_CAJA_BUSCAR, alto: 32 }, desplazada);

export const rectPorNombre = (d: DisposicionDirectorio, desplazada = 0): Rect =>
	enCascara({ x: ANCHO_CAJA_BUSCAR + 8, y: d.buscador + 32, ancho: BOTON_POR_NOMBRE, alto: 32 }, desplazada);

/** Las columnas del buscador (`panel-alumnos.ts:516-539`). */
export const COLUMNAS_BUSCADOR: Columna[] = [
	{ clave: 'no', titulo: 'Nº', ancho: 64 },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 190, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 190, filtro: true },
	{ clave: 'restaurar', titulo: 'Restaurar', ancho: 110, alinear: 'centro' },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 110, filtro: true },
	{ clave: 'no_matricula', titulo: '# matrícula', ancho: 130, filtro: true },
	{ clave: 'documento', titulo: 'Documento', ancho: 160, filtro: true },
	{ clave: 'historial', titulo: 'Historial', ancho: 158 },
];

export const ALTO_REJILLA_BUSCADOR = 300;

export function rectRestaurar(d: DisposicionDirectorio, i: number, desplazada = 0): Rect {
	let x = 0;
	for (const c of COLUMNAS_BUSCADOR) { if (c.clave === 'restaurar') { break; } x += c.ancho; }
	return enCascara({ x: x + 55 - 16, y: d.resultados + CABECERA * 2 + i * FILA + 5, ancho: 32, alto: 32 }, desplazada);
}
