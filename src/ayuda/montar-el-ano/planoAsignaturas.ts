import { MEDIDAS } from '../medidas';
import { ALTO_CABECERA_FICHA, ALTO_CONTROL, ALTO_ETIQUETA, ALTO_OPCION, ALTO_OPCION_DOBLE, RELLENO_FICHA, type Opcion } from './ant';
import { CABECERA, FILA, altoDeLaRejilla, izquierdaDeColumna, anchoDeColumna, type Columna } from './Rejilla';
import type { Asignatura, ClaveDocente } from './reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE ASIGNATURAS, EN NÚMEROS: qué bloque va debajo de cuál y a qué altura cae cada mando.
 *
 * Es lo que comparten los cuatro vídeos de asignaturas, y está aquí y no en el dibujo por la regla de
 * siempre: **el foco y el puntero salen del mismo número que la pieza**. `disposicion()` recibe el
 * estado de la pantalla --si hay alerta, si la ficha está abierta, cuántas filas hay-- y devuelve
 * dónde empieza cada bloque. El dibujo coloca los bloques con esos números, y el guion señala con
 * esos mismos números. Si un bloque crece, los dos se mueven a la vez.
 *
 * El orden es el de `asignaturas.html`: cabecera, cuadre de la IH, ficha nueva, ficha de edición,
 * filtros, pista, rejilla, copiar, papelera.
 *
 * TODO VA EN COORDENADAS DE LA CÁSCARA (1440 × 900), ya con el desplazamiento de la página aplicado.
 * `enElFotograma()` los pasa al fotograma.
 */

/*
 * EL MARCO DE LA PÁGINA. La cáscara pone alrededor de cada pantalla un lienzo gris de 24 px y un
 * panel blanco con 16 de relleno (`panel.scss`, `.lienzo` y `.panel`). Asignaturas no tiene ancho
 * máximo que alcance (84rem), así que llena el panel.
 */
export const LIENZO = 24;
export const PANEL_RELLENO = 16;
export const CONTENIDO = {
	x: MEDIDAS.menu + LIENZO,
	y: MEDIDAS.barra + LIENZO,
	ancho: MEDIDAS.ancho - MEDIDAS.menu - LIENZO * 2,
};
export const MAIN = {
	x: CONTENIDO.x + PANEL_RELLENO,
	y: CONTENIDO.y + PANEL_RELLENO,
	ancho: CONTENIDO.ancho - PANEL_RELLENO * 2,
};

export const HUECO = 16;
export const CABECERA_PAGINA = 40;
export const BOTON_CREAR = 132;
export const BOTON_RECARGAR = 116;

/* ── Las columnas de la rejilla, con los anchos de `asignaturas.ts` ─────────────────────────────── */

/*
 * Los tres de `flex` (Materia, Grupo, Profesor) se quedan en su `minWidth`: con los días y el
 * historial la rejilla no cabe de ancho, y AG Grid no los estira por debajo de eso. Por eso los días
 * empiezan a asomar por la derecha y hay que desplazar para verlos.
 */
export const COLUMNAS: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 56 },
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'borrar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'notas', titulo: 'Notas', ancho: 90 },
	{ clave: 'materia', titulo: 'Materia', ancho: 150, filtro: true },
	{ clave: 'grupo', titulo: 'Grupo', ancho: 110, filtro: true },
	{ clave: 'profesor', titulo: 'Profesor', ancho: 150, filtro: true },
	{ clave: 'ih', titulo: 'IH', ancho: 80 },
	{ clave: 'area', titulo: '% del área', ancho: 118, alinear: 'derecha' },
	{ clave: 'd0', titulo: 'Lunes', ancho: 90, alinear: 'centro' },
	{ clave: 'd1', titulo: 'Martes', ancho: 90, alinear: 'centro' },
	{ clave: 'd2', titulo: 'Miércoles', ancho: 90, alinear: 'centro' },
	{ clave: 'd3', titulo: 'Jueves', ancho: 90, alinear: 'centro' },
	{ clave: 'd4', titulo: 'Viernes', ancho: 90, alinear: 'centro' },
	{ clave: 'historial', titulo: 'Historial', ancho: 250 },
];

/** Lo que hay que desplazar la rejilla para que el viernes quede entero a la vista. */
export const HASTA_EL_VIERNES = izquierdaDeColumna(COLUMNAS, 'd4') + anchoDeColumna(COLUMNAS, 'd4') - MAIN.ancho;

/* ── El estado de la pantalla ──────────────────────────────────────────────────────────────────── */

export interface FilaDelCuadre {
	grupo: string;
	cifras: string;
	diferencia: string;
}

export type Cuadre =
	| { forma: 'linea'; tipo: 'success' | 'warning'; mensaje: string }
	| { forma: 'grupo'; tipo: 'success' | 'warning'; mensaje: string; detalle: string }
	| { forma: 'lista'; mensaje: string; filas: FilaDelCuadre[] };

export type CampoDeFicha = 'materia' | 'grupo' | 'profesor' | 'creditos' | 'orden';

export interface EstadoFicha {
	modo: 'nueva' | 'editar';
	materia: string | null;
	grupo: string | null;
	profesor: ClaveDocente | null;
	creditos: string;
	orden: string;
	/** El campo que tiene el foco, si alguno; y lo tecleado en su buscador. */
	activo?: CampoDeFicha | null;
	busqueda?: string | null;
	cursor?: boolean;
	/** El botón con el ratón encima, y el que está guardando. */
	encima?: 'crear' | 'guardar' | null;
	cargando?: boolean;
	aparece?: number;
}

export interface FilaVista extends Asignatura {
	opacidad?: number;
	x?: number;
	fondo?: string;
	/** El botón de la fila que tiene el ratón encima: `editar`, `borrar` o un día `d0`…`d4`. */
	encima?: string | null;
	/** Un día que está guardando (el botón gira). */
	volando?: string | null;
}

export interface Desplegable {
	/** Dónde está: un campo de la ficha, un filtro o un campo de copiar. */
	donde: CampoDeFicha | 'filtroGrupo' | 'filtroProfesor' | 'origen' | 'destino';
	opciones: Opcion[];
	resaltada?: number | null;
	elegida?: number | null;
	aparece?: number;
	/** Lo tecleado en el buscador del selector, y si se ve el palito. */
	busqueda?: string | null;
	cursor?: boolean;
}

export interface EstadoAsignaturas {
	/** 0..1: la cabecera y la rejilla entran al montarse. Lo lleva la pantalla con su propio tiempo. */
	cuadre: Cuadre | null;
	ficha: EstadoFicha | null;
	filtroGrupo: { nombre: string; titular: ClaveDocente } | null;
	filtroProfesor: ClaveDocente | null;
	/** «Viendo 9 de 146.», sólo con un filtro puesto. */
	viendo: { de: number } | null;
	filas: FilaVista[];
	desplazadaRejilla?: number;
	copia?: { origen: string | null; destino: string | null; cargando?: boolean; encima?: boolean };
	papelera?: { abierta: boolean; filas: { id: number; materia: string; profesor: ClaveDocente; grupo: string }[]; restaurando?: number | null; encima?: 'boton' | number | null };
	mostrarTodas?: boolean;
	/** Cuánto se ha desplazado la página hacia abajo. */
	desplazada?: number;
	desplegable?: Desplegable | null;
	encima?: 'crearNueva' | 'verSus' | 'mostrarTodas' | null;
}

/* ── La disposición ───────────────────────────────────────────────────────────────────────────── */

export const ALTO_LINEA_CUADRE = 36;

export function altoDelCuadre(c: Cuadre): number {
	if (c.forma === 'linea') { return 40; }
	if (c.forma === 'grupo') { return 88; }
	return 16 + 22 + 8 + c.filas.length * ALTO_LINEA_CUADRE + 12;
}

/** Una fila de la ficha: la etiqueta encima y el control debajo. */
export const ALTO_CAMPO = ALTO_ETIQUETA + ALTO_CONTROL;

/*
 * LA FICHA SE PARTE EN DOS LÍNEAS, y no por gusto: `.ficha__campos` es un `flex-wrap`, y las bases
 * de los cinco campos más los dos botones (18 + 10 + 14 + 7 + 7 rem y los botones) no caben en el
 * panel. Los botones bajan a la segunda línea y los campos crecen en la primera según su `flex`.
 */
export const ALTO_FICHA = ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_CAMPO + 12 + ALTO_CONTROL + RELLENO_FICHA;

const ANCHO_CUERPO_FICHA = MAIN.ancho - RELLENO_FICHA * 2 - 2;
const HUECO_CAMPOS = 12;
const BASES = { materia: 288, grupo: 160, profesor: 224, creditos: 112, orden: 112 };
const CRECE = { materia: 3, grupo: 1, profesor: 2, creditos: 0, orden: 0 };

export const CAMPOS_FICHA: Record<CampoDeFicha, { x: number; ancho: number }> = (() => {
	const claves: CampoDeFicha[] = ['materia', 'grupo', 'profesor', 'creditos', 'orden'];
	const bases = claves.reduce((n, k) => n + BASES[k], 0) + HUECO_CAMPOS * (claves.length - 1);
	const sobra = ANCHO_CUERPO_FICHA - bases;
	const crecen = claves.reduce((n, k) => n + CRECE[k], 0);
	let x = 0;
	const r = {} as Record<CampoDeFicha, { x: number; ancho: number }>;
	for (const k of claves) {
		const ancho = Math.round(BASES[k] + (sobra * CRECE[k]) / crecen);
		r[k] = { x, ancho };
		x += ancho + HUECO_CAMPOS;
	}
	return r;
})();

export const BOTONES_FICHA = { crear: 72, guardar: 150, ocultar: 90 };

export const ALTO_FILTROS = ALTO_CONTROL;
export const ANCHO_FILTRO = 240;
export const BOTON_MOSTRAR_TODAS = 150;
export const ALTO_PISTA = 22;
export const ALTO_COPIA = ALTO_CABECERA_FICHA + RELLENO_FICHA * 2 + ALTO_CONTROL;
export const ANCHO_COPIA_CAMPO = 280;
export const BOTON_COPIAR = 176;
export const ALTO_FILA_PAPELERA = 42;

export interface Disposicion {
	cuadre: { y: number; alto: number } | null;
	ficha: { y: number; alto: number } | null;
	filtros: number;
	pista: number;
	rejilla: { y: number; alto: number };
	copia: number;
	papelera: number;
	fin: number;
}

/** Dónde cae cada bloque, desde lo alto del `main` y sin desplazar la página. */
export function disposicion(e: EstadoAsignaturas): Disposicion {
	let y = CABECERA_PAGINA + HUECO;

	let cuadre: Disposicion['cuadre'] = null;
	if (e.cuadre) {
		cuadre = { y, alto: altoDelCuadre(e.cuadre) };
		y += cuadre.alto + HUECO;
	}

	let ficha: Disposicion['ficha'] = null;
	if (e.ficha) {
		ficha = { y, alto: ALTO_FICHA };
		y += ALTO_FICHA + HUECO;
	}

	const filtros = y;
	y += ALTO_FILTROS + 8;
	const pista = y;
	y += ALTO_PISTA + 8;
	const rejilla = { y, alto: altoDeLaRejilla(e.filas.length) };
	y += rejilla.alto + 24;
	const copia = y;
	y += ALTO_COPIA + 24;
	const papelera = y;
	y += ALTO_CONTROL + (e.papelera?.abierta ? 8 + Math.max(1, e.papelera.filas.length) * ALTO_FILA_PAPELERA : 0) + 24;

	return { cuadre, ficha, filtros, pista, rejilla, copia, papelera, fin: y };
}

/* ── Los rectángulos que señala el guion, en coordenadas de la cáscara ──────────────────────── */

export interface Rect { x: number; y: number; ancho: number; alto: number }

const bajar = (e: EstadoAsignaturas, y: number) => MAIN.y + y - (e.desplazada ?? 0);

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export function rectCrearNueva(e: EstadoAsignaturas): Rect {
	return { x: MAIN.x + MAIN.ancho - BOTON_CREAR, y: bajar(e, (CABECERA_PAGINA - ALTO_CONTROL) / 2), ancho: BOTON_CREAR, alto: ALTO_CONTROL };
}

export function rectCuadre(e: EstadoAsignaturas): Rect {
	const d = disposicion(e);
	if (!d.cuadre) { throw new Error('Asignaturas: no hay cuadre que señalar.'); }
	return { x: MAIN.x, y: bajar(e, d.cuadre.y), ancho: MAIN.ancho, alto: d.cuadre.alto };
}

/** El «Ver sus asignaturas» de la fila `i` de la lista del cuadre. */
export const ANCHO_VER_SUS = 150;
export function rectVerSus(e: EstadoAsignaturas, i: number): Rect {
	const d = disposicion(e);
	if (!d.cuadre) { throw new Error('Asignaturas: no hay cuadre.'); }
	return {
		x: MAIN.x + MAIN.ancho - 22 - ANCHO_VER_SUS,
		y: bajar(e, d.cuadre.y + 16 + 22 + 8 + i * ALTO_LINEA_CUADRE + (ALTO_LINEA_CUADRE - 26) / 2),
		ancho: ANCHO_VER_SUS,
		alto: 26,
	};
}

export function rectCampo(e: EstadoAsignaturas, campo: CampoDeFicha): Rect {
	const d = disposicion(e);
	if (!d.ficha) { throw new Error('Asignaturas: la ficha no está abierta.'); }
	const c = CAMPOS_FICHA[campo];
	return {
		x: MAIN.x + 1 + RELLENO_FICHA + c.x,
		y: bajar(e, d.ficha.y + ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_ETIQUETA),
		ancho: c.ancho,
		alto: ALTO_CONTROL,
	};
}

/** El campo con su etiqueta encima: es lo que se enciende cuando el rótulo habla del campo. */
export function rectCampoConEtiqueta(e: EstadoAsignaturas, campo: CampoDeFicha): Rect {
	const r = rectCampo(e, campo);
	return { x: r.x - 6, y: r.y - ALTO_ETIQUETA - 4, ancho: r.ancho + 12, alto: r.alto + ALTO_ETIQUETA + 10 };
}

export function rectBotonFicha(e: EstadoAsignaturas, cual: 'primero' | 'ocultar'): Rect {
	const d = disposicion(e);
	if (!d.ficha || !e.ficha) { throw new Error('Asignaturas: la ficha no está abierta.'); }
	const y = bajar(e, d.ficha.y + ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_CAMPO + 12);
	const primero = e.ficha.modo === 'nueva' ? BOTONES_FICHA.crear : BOTONES_FICHA.guardar;
	const x0 = MAIN.x + 1 + RELLENO_FICHA;
	return cual === 'primero'
		? { x: x0, y, ancho: primero, alto: ALTO_CONTROL }
		: { x: x0 + primero + 8, y, ancho: BOTONES_FICHA.ocultar, alto: ALTO_CONTROL };
}

export function rectFiltro(e: EstadoAsignaturas, cual: 'grupo' | 'profesor'): Rect {
	const d = disposicion(e);
	return { x: MAIN.x + (cual === 'grupo' ? 0 : ANCHO_FILTRO + 12), y: bajar(e, d.filtros), ancho: ANCHO_FILTRO, alto: ALTO_CONTROL };
}

/** El interruptor «Mostrar todas las materias al docente», con su texto. */
export const ANCHO_AJUSTE = 452;
export function rectAjuste(e: EstadoAsignaturas): Rect {
	const d = disposicion(e);
	/* Lo que ocupan de verdad el interruptor y su texto, pegados a la derecha. */
	const visible = 392;
	return { x: MAIN.x + MAIN.ancho - visible, y: bajar(e, d.filtros), ancho: visible, alto: ALTO_CONTROL };
}

export function rectRejilla(e: EstadoAsignaturas): Rect {
	const d = disposicion(e);
	return { x: MAIN.x, y: bajar(e, d.rejilla.y), ancho: MAIN.ancho, alto: d.rejilla.alto };
}

/** Una celda (o un tramo de columnas, de `desde` a `hasta`) de la fila `i`. */
export function rectCeldas(e: EstadoAsignaturas, i: number, desde: string, hasta = desde, filas = 1): Rect {
	const d = disposicion(e);
	const x = izquierdaDeColumna(COLUMNAS, desde) - (e.desplazadaRejilla ?? 0);
	const x2 = izquierdaDeColumna(COLUMNAS, hasta) + anchoDeColumna(COLUMNAS, hasta) - (e.desplazadaRejilla ?? 0);
	return {
		x: MAIN.x + 1 + x,
		y: bajar(e, d.rejilla.y + 1 + CABECERA * 2 + i * FILA),
		ancho: x2 - x,
		alto: FILA * filas,
	};
}

/** Un tramo de columnas entero, con su título: de la cabecera a la última fila. */
export function rectColumnas(e: EstadoAsignaturas, desde: string, hasta = desde): Rect {
	const r = rectCeldas(e, 0, desde, hasta, e.filas.length);
	return { x: r.x, y: r.y - CABECERA * 2, ancho: r.ancho, alto: r.alto + CABECERA * 2 };
}

/** El botón pequeño de una celda (editar, borrar o un día). */
export function rectBotonDeCelda(e: EstadoAsignaturas, i: number, columna: string): Rect {
	const c = rectCeldas(e, i, columna);
	const ancho = columna.startsWith('d') ? 48 : 30;
	return { x: c.x + (c.ancho - ancho) / 2, y: c.y + (FILA - 26) / 2, ancho, alto: 26 };
}

export function rectCopia(e: EstadoAsignaturas, cual: 'tarjeta' | 'origen' | 'destino' | 'boton'): Rect {
	const d = disposicion(e);
	const y = bajar(e, d.copia);
	if (cual === 'tarjeta') { return { x: MAIN.x, y, ancho: MAIN.ancho, alto: ALTO_COPIA }; }
	const yc = y + ALTO_CABECERA_FICHA + RELLENO_FICHA;
	const x0 = MAIN.x + 1 + RELLENO_FICHA;
	if (cual === 'origen') { return { x: x0, y: yc, ancho: ANCHO_COPIA_CAMPO, alto: ALTO_CONTROL }; }
	if (cual === 'destino') { return { x: x0 + ANCHO_COPIA_CAMPO + 12, y: yc, ancho: ANCHO_COPIA_CAMPO, alto: ALTO_CONTROL }; }
	return { x: x0 + (ANCHO_COPIA_CAMPO + 12) * 2, y: yc, ancho: BOTON_COPIAR, alto: ALTO_CONTROL };
}

export const ANCHO_BOTON_PAPELERA = 206;
export function rectPapelera(e: EstadoAsignaturas): Rect {
	const d = disposicion(e);
	return { x: MAIN.x, y: bajar(e, d.papelera), ancho: ANCHO_BOTON_PAPELERA, alto: ALTO_CONTROL };
}

export const ANCHO_RESTAURAR = 110;
export function rectFilaPapelera(e: EstadoAsignaturas, i: number): Rect {
	const d = disposicion(e);
	return { x: MAIN.x, y: bajar(e, d.papelera + ALTO_CONTROL + 8 + i * ALTO_FILA_PAPELERA), ancho: MAIN.ancho, alto: ALTO_FILA_PAPELERA };
}
export function rectRestaurar(e: EstadoAsignaturas, i: number): Rect {
	const f = rectFilaPapelera(e, i);
	return { x: f.x, y: f.y + (ALTO_FILA_PAPELERA - 26) / 2, ancho: ANCHO_RESTAURAR, alto: 26 };
}

/** Dónde cae el campo del que cuelga un desplegable. */
export function rectDelDesplegable(e: EstadoAsignaturas, donde: Desplegable['donde']): Rect {
	if (donde === 'filtroGrupo') { return rectFiltro(e, 'grupo'); }
	if (donde === 'filtroProfesor') { return rectFiltro(e, 'profesor'); }
	if (donde === 'origen' || donde === 'destino') { return rectCopia(e, donde); }
	return rectCampo(e, donde);
}

/** La opción `i` del desplegable abierto. */
export function rectOpcion(e: EstadoAsignaturas, d: Desplegable, i: number): Rect {
	const campo = rectDelDesplegable(e, d.donde);
	let y = campo.y + campo.alto + 4 + 4;
	for (let k = 0; k < i; k++) { y += d.opciones[k].debajo ? ALTO_OPCION_DOBLE : ALTO_OPCION; }
	return { x: campo.x + 4, y, ancho: campo.ancho - 8, alto: d.opciones[i].debajo ? ALTO_OPCION_DOBLE : ALTO_OPCION };
}

/* ── El modal de borrar (`borrar-asignatura`) ──────────────────────────────────────────────────── */

/*
 * Se abre con `size: 'lg'` y máscara sobre TODA la aplicación, menú incluido: por eso no va dentro
 * de la pantalla sino encima de la cáscara, y sus medidas son de la cáscara entera.
 */
export const MODAL = { x: 340, y: 110, ancho: 760 };

export interface DetalleBorrado {
	id: number;
	materia: string;
	notas: number;
	unidades: { periodo: number; definicion: string; subunidades: { id: number; definicion: string; notas: number }[] }[];
}

export const MODAL_MEDIDAS = { relleno: 24, titulo: 44, identidad: 34, notas: 34, tituloUnidad: 36, cabeceraTabla: 34, filaTabla: 34, hueco: 14, botones: 56 };

export function altoDelModal(d: DetalleBorrado): number {
	const m = MODAL_MEDIDAS;
	const cuerpo = d.unidades.reduce((n, u) => n + m.tituloUnidad + m.cabeceraTabla + u.subunidades.length * m.filaTabla + m.hueco, 0);
	return m.relleno + m.titulo + m.identidad + m.notas + cuerpo + m.botones + m.relleno;
}

export function rectNotasDelModal(): Rect {
	const m = MODAL_MEDIDAS;
	return { x: MODAL.x + m.relleno - 6, y: MODAL.y + m.relleno + m.titulo + m.identidad - 2, ancho: 250, alto: m.notas + 4 };
}

export function rectBotonDelModal(d: DetalleBorrado, cual: 'eliminar' | 'cancelar'): Rect {
	const m = MODAL_MEDIDAS;
	const y = MODAL.y + altoDelModal(d) - m.relleno - ALTO_CONTROL;
	return cual === 'eliminar'
		? { x: MODAL.x + m.relleno, y, ancho: 98, alto: ALTO_CONTROL }
		: { x: MODAL.x + m.relleno + 98 + 8, y, ancho: 100, alto: ALTO_CONTROL };
}

/** Lo que cuelga de la asignatura: el total de notas y los periodos con lo suyo, sin los botones. */
export function rectDetalleDelModal(d: DetalleBorrado): Rect {
	const m = MODAL_MEDIDAS;
	const y = MODAL.y + m.relleno + m.titulo + m.identidad - 2;
	return { x: MODAL.x + m.relleno - 8, y, ancho: MODAL.ancho - m.relleno * 2 + 16, alto: MODAL.y + altoDelModal(d) - m.relleno - m.botones - y + 6 };
}

/** El pulgar de la barra horizontal de la rejilla, que es lo que se arrastra para ver los días. */
export function rectPulgar(e: EstadoAsignaturas): Rect {
	const r = rectRejilla(e);
	const total = COLUMNAS.reduce((n, c) => n + c.ancho, 0);
	return {
		x: r.x + ((e.desplazadaRejilla ?? 0) / total) * r.ancho,
		y: r.y + r.alto - 13,
		ancho: (r.ancho * r.ancho) / total,
		alto: 10,
	};
}
