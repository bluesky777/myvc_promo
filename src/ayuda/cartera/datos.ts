import { MAIN, type Rect } from '../personas/comun';
import { CABECERA, FILA, type Columna } from '../montar-el-ano/Rejilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CARTERA (`paginas/cartera/cartera.html`), EN NÚMEROS: lo que se ve y dónde cae cada mando.
 *
 * LOS ALUMNOS SON INVENTADOS, igual que sus usuarios, sus deudas y sus fechas. Las caras son el
 * avatar dibujado. El grupo es el 8°A de `montar-el-ano/reparto.ts`, con su titular.
 *
 * LAS COLUMNAS, en el orden de `cartera.ts`: la casilla de marcar (`seleccionable`), Acciones (un
 * botón: la ficha), A paz y salvo (el interruptor), Nombres con su foto, Apellidos, Sexo, Usuario,
 * Deuda y Pagada hasta. «Grupo» no sale: se esconde cuando la lista es de un grupo. Los anchos son
 * los de la aplicación con el `minWidth: 110` que `comunes/rejilla` pone a todas: así caben en
 * los 1112 del panel sin desplazarse.
 */

export interface AlumnoCartera {
	nombres: string;
	apellidos: string;
	sexo: 'M' | 'F';
	usuario: string;
	deuda: number;
	paz: boolean;
	pagadaHasta: string;
	cara: { tipo: 'mujer' | 'hombre'; variante: number };
}

export const GRUPO = '8°A';
export const GRUPOS_DEL_DESPLEGABLE = ['6°A', '7°A', '8°A', '9°A', '9°B', '10°A'];
export const EL_GRUPO = GRUPOS_DEL_DESPLEGABLE.indexOf(GRUPO);

export const ALUMNOS: AlumnoCartera[] = [
	{ nombres: 'Isabella', apellidos: 'Acosta Bermúdez', sexo: 'F', usuario: 'isabella.acosta', deuda: 0, paz: true, pagadaHasta: '2026-09-30', cara: { tipo: 'mujer', variante: 1 } },
	{ nombres: 'Tomás', apellidos: 'Bedoya Cárdenas', sexo: 'M', usuario: 'tomas.bedoya', deuda: 180000, paz: false, pagadaHasta: '2026-07-31', cara: { tipo: 'hombre', variante: 2 } },
	{ nombres: 'Mariana', apellidos: 'Cano Restrepo', sexo: 'F', usuario: 'mariana.cano', deuda: 0, paz: true, pagadaHasta: '2026-09-30', cara: { tipo: 'mujer', variante: 3 } },
	{ nombres: 'Santiago', apellidos: 'Durán Ospina', sexo: 'M', usuario: 'santiago.duran', deuda: 360000, paz: false, pagadaHasta: '2026-06-30', cara: { tipo: 'hombre', variante: 4 } },
	{ nombres: 'Valeria', apellidos: 'Escobar Rincón', sexo: 'F', usuario: 'valeria.escobar', deuda: 0, paz: true, pagadaHasta: '2026-09-30', cara: { tipo: 'mujer', variante: 5 } },
	{ nombres: 'Samuel', apellidos: 'Fajardo Mejía', sexo: 'M', usuario: 'samuel.fajardo', deuda: 180000, paz: false, pagadaHasta: '2026-08-31', cara: { tipo: 'hombre', variante: 0 } },
	{ nombres: 'Sara', apellidos: 'Giraldo Patiño', sexo: 'F', usuario: 'sara.giraldo', deuda: 0, paz: true, pagadaHasta: '2026-09-30', cara: { tipo: 'mujer', variante: 2 } },
	{ nombres: 'Emilio', apellidos: 'Henao Quintero', sexo: 'M', usuario: 'emilio.henao', deuda: 540000, paz: false, pagadaHasta: '2026-06-30', cara: { tipo: 'hombre', variante: 1 } },
];

/** Los dos que pagan en el vídeo: Tomás y Samuel, que debían lo mismo. */
export const LOS_QUE_PAGAN = [1, 5];
/** Lo que se teclea en «Deuda» antes de «Cambiar la deuda». */
export const DEUDA_NUEVA = '0';

/** `currency:'$':'symbol':'1.0-0'` sin `LOCALE_ID`: el de Angular por defecto, en-US. */
export const pesos = (n: number) => `$${n.toLocaleString('en-US')}`;

export interface Resumen { total: number; deudores: number; hombres: number; mujeres: number; deuda: number }
export function resumen(filas: AlumnoCartera[]): Resumen {
	let deuda = 0, deudores = 0, hombres = 0, mujeres = 0;
	for (const a of filas) {
		deuda += a.deuda;
		if (!a.paz) { deudores += 1; }
		if (a.sexo === 'M') { hombres += 1; } else { mujeres += 1; }
	}
	return { total: filas.length, deudores, hombres, mujeres, deuda };
}

/** Las filas en cada momento: `paz` tras «Poner a paz y salvo», `deuda0` tras «Cambiar la deuda». */
export function filasEn(paz: boolean, deuda0: boolean): AlumnoCartera[] {
	return ALUMNOS.map((a, i) =>
		LOS_QUE_PAGAN.includes(i) ? { ...a, paz: paz ? true : a.paz, deuda: deuda0 ? 0 : a.deuda } : a,
	);
}

/* ── Las columnas ─────────────────────────────────────────────────────────────────────────── */

export const COLUMNAS: Columna[] = [
	{ clave: 'sel', titulo: '', ancho: 50, alinear: 'centro' },
	{ clave: 'acciones', titulo: 'Acciones', ancho: 50 },
	{ clave: 'paz', titulo: 'A paz y salvo', ancho: 150, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 156, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 156, filtro: true },
	{ clave: 'sexo', titulo: 'Sexo', ancho: 80, filtro: true },
	{ clave: 'usuario', titulo: 'Usuario', ancho: 250, filtro: true },
	{ clave: 'deuda', titulo: 'Deuda', ancho: 110, filtro: true },
	{ clave: 'pagada', titulo: 'Pagada hasta', ancho: 110, filtro: true },
];

/* ── La página, de arriba abajo ───────────────────────────────────────────────────────────── */

export const HUECO = 16;
export const ALTO_H1 = 40;

/** Los botones de la cabecera, de izquierda a derecha, con su ancho. */
export const BOTONES_CABECERA = [
	{ texto: 'Subir cambios (Excel)', icono: 'subir', ancho: 204 },
	{ texto: 'Deudores a Excel', icono: 'bajar', ancho: 166 },
	{ texto: 'Bajar lo que se ve (CSV)', icono: 'bajar', ancho: 214 },
	{ texto: 'Recargar', icono: 'reload', ancho: 112 },
] as const;

export function rectBotonCabecera(i: number, conRecargar: boolean): Rect {
	const lista = conRecargar ? BOTONES_CABECERA : BOTONES_CABECERA.slice(0, 3);
	let x = MAIN.x + MAIN.ancho;
	for (let k = lista.length - 1; k >= i; k--) {
		x -= lista[k].ancho;
		if (k > i) { x -= 8; }
	}
	return { x, y: MAIN.y + 4, ancho: lista[i].ancho, alto: 32 };
}

export const Y = {
	etiqueta: MAIN.y + ALTO_H1 + HUECO,
	selector: MAIN.y + ALTO_H1 + HUECO + 26,
	marcados: MAIN.y + ALTO_H1 + HUECO + 26 + 32 + HUECO,
	pista: MAIN.y + ALTO_H1 + HUECO + 26 + 32 + HUECO + 48 + HUECO,
	rejilla: MAIN.y + ALTO_H1 + HUECO + 26 + 32 + HUECO + 48 + HUECO + 22 + HUECO,
};

export const ALTO_REJILLA = CABECERA * 2 + ALUMNOS.length * FILA + 2;
export const Y_RESUMEN = Y.rejilla + ALTO_REJILLA + HUECO;
export const ALTO_PAGINA = Y_RESUMEN + 24 + 16 - (MAIN.y - 16);

export const ANCHO_SELECTOR = 360;
export const SELECTOR: Rect = { x: MAIN.x, y: Y.selector, ancho: ANCHO_SELECTOR, alto: 32 };
export const ENLACE_DEUDORES: Rect = { x: MAIN.x + ANCHO_SELECTOR + 8, y: Y.selector, ancho: 200, alto: 32 };

/** El panel del desplegable, bajo el selector: una opción de 48 por grupo (nombre y titular). */
export const ALTO_OPCION = 48;
export function rectOpcion(i: number): Rect {
	return { x: SELECTOR.x + 4, y: SELECTOR.y + 32 + 4 + 4 + i * ALTO_OPCION, ancho: SELECTOR.ancho - 8, alto: ALTO_OPCION };
}

export const MARCADOS: Rect = { x: MAIN.x, y: Y.marcados, ancho: MAIN.ancho, alto: 48 };

/** Los mandos de la barra de lo marcado, de izquierda a derecha, en su fila. */
export const BARRA = (() => {
	const y = Y.marcados + 12;
	let x = MAIN.x + 9 + 96 + 8;
	const pon = (ancho: number, alto = 24) => { const r = { x, y: y + (24 - alto) / 2, ancho, alto }; x += ancho + 8; return r; };
	const paz = pon(152);
	const deudores = pon(164);
	const deuda = pon(144, 30); x -= 4;
	const cambiarDeuda = pon(132);
	const fecha = pon(144, 30); x -= 4;
	const cambiarFecha = pon(132);
	return { paz, deudores, deuda, cambiarDeuda, fecha, cambiarFecha };
})();

export const PISTA_REJILLA: Rect = { x: MAIN.x, y: Y.pista, ancho: 600, alto: 22 };
export const REJILLA: Rect = { x: MAIN.x, y: Y.rejilla, ancho: MAIN.ancho, alto: ALTO_REJILLA };
export const RESUMEN: Rect = { x: MAIN.x, y: Y_RESUMEN, ancho: 760, alto: 24 };

export function izquierda(clave: string): number {
	let x = 0;
	for (const c of COLUMNAS) {
		if (c.clave === clave) { return x; }
		x += c.ancho;
	}
	throw new Error(`Cartera: no hay columna «${clave}».`);
}
const anchoCol = (clave: string) => COLUMNAS.find((c) => c.clave === clave)!.ancho;

/** Una celda de la rejilla, en coordenadas de la cáscara. */
export function rectCelda(fila: number, clave: string): Rect {
	return { x: REJILLA.x + 1 + izquierda(clave), y: REJILLA.y + 1 + CABECERA * 2 + fila * FILA, ancho: anchoCol(clave), alto: FILA };
}

/** Una franja de columnas, de la cabecera al final. */
export function rectColumnas(desde: string, hasta: string): Rect {
	const x = REJILLA.x + 1 + izquierda(desde);
	return { x, y: REJILLA.y, ancho: izquierda(hasta) + anchoCol(hasta) - izquierda(desde), alto: ALTO_REJILLA };
}
