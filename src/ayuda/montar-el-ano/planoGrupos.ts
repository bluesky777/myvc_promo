import { ALTO_CABECERA_FICHA, ALTO_CONTROL, ALTO_ETIQUETA, RELLENO_FICHA } from './ant';
import { MAIN as MAIN_PANEL, type Rect } from './planoAsignaturas';
import { CABECERA, FILA, altoDeLaRejilla, anchoDeColumna, izquierdaDeColumna, type Columna } from './Rejilla';
import { GRUPOS, type ClaveDocente } from './reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE GRUPOS, EN NÚMEROS (`paginas/grupos/grupos.html` y `grupos-juntos.html`).
 *
 * Mismo principio que `planoAsignaturas.ts`: `disposicion()` dice dónde cae cada bloque según el
 * estado, y de ahí salen el dibujo, el foco y el puntero.
 *
 * GRUPOS NO LLENA EL PANEL: `main { max-width: 62rem }`, o sea 992 px centrados. Con esos 992 la
 * rejilla no cabe de ancho --doce columnas, cinco de ellas con `flex` y un mínimo de 110-- y la
 * última, «IH semanal», queda fuera por la derecha: para verla hay que desplazar la rejilla, y el
 * vídeo lo hace.
 */

export const ANCHO_GRUPOS = 992;
export const MAIN = { x: MAIN_PANEL.x + (MAIN_PANEL.ancho - ANCHO_GRUPOS) / 2, y: MAIN_PANEL.y, ancho: ANCHO_GRUPOS };

export const HUECO = 16;
export const CABECERA_PAGINA = 40;
export const BOTON_CREAR_GRUPO = 136;
export const BOTON_RECARGAR = 116;

export const COLUMNAS_GRUPOS: Columna[] = [
	{ clave: 'orden', titulo: 'Orden', ancho: 90, filtro: true },
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'alumnos', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'borrar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'nombre', titulo: 'Nombre', ancho: 110, filtro: true },
	{ clave: 'abrev', titulo: 'Abrev', ancho: 110, filtro: true },
	{ clave: 'juntos', titulo: 'Va junto con', ancho: 110, filtro: true },
	{ clave: 'titular', titulo: 'Titular', ancho: 110, filtro: true },
	{ clave: 'grado', titulo: 'Grado', ancho: 110, filtro: true },
	{ clave: 'cant', titulo: 'Canti alumnos', ancho: 130, filtro: true },
	{ clave: 'cupo', titulo: 'Cupo', ancho: 100, filtro: true },
	{ clave: 'ih', titulo: 'IH semanal', ancho: 120, filtro: true },
];

/** Lo que hay que desplazar para ver «IH semanal» entera, pegada al borde derecho. */
export const HASTA_LA_IH = izquierdaDeColumna(COLUMNAS_GRUPOS, 'ih') + anchoDeColumna(COLUMNAS_GRUPOS, 'ih') - ANCHO_GRUPOS;

/* ── El estado ──────────────────────────────────────────────────────────────────────────────── */

export type CampoGrupo = 'nombre' | 'abrev' | 'grado' | 'titular' | 'valormatricula' | 'valorpension' | 'orden' | 'ih';

export interface FichaGrupo {
	nombre: string;
	abrev: string;
	grado: string | null;
	titular: ClaveDocente | null;
	valormatricula: string;
	valorpension: string;
	orden: string;
	ih: string;
	activo?: CampoGrupo | null;
	cursor?: boolean;
	encima?: boolean;
	aparece?: number;
}

export interface FilaGrupo {
	nombre: string;
	/** «Va junto con»: los otros del conjunto, o vacío. */
	juntos: string;
	/** El que se acaba de crear: 0 alumnos y el cupo sin poner (el alta no lo escribe). */
	nuevo?: boolean;
	opacidad?: number;
	x?: number;
	fondo?: string;
}

export type Juntos =
	| { forma: 'vacio'; encimaJuntar?: boolean }
	| { forma: 'conjuntos'; conjuntos: { grupos: string[]; alumnos: number }[]; aparece?: number; encimaSeparar?: boolean }
	| { forma: 'editor'; elegidos: string[]; encimaGuardar?: boolean; cargando?: boolean; aparece?: number };

export interface EstadoGrupos {
	ficha: FichaGrupo | null;
	juntos: Juntos;
	filas: FilaGrupo[];
	desplazadaRejilla?: number;
	desplazada?: number;
	desplegable?: {
		donde: 'grado' | 'titular';
		opciones: { texto: string; debajo?: string; cara?: ClaveDocente }[];
		resaltada?: number | null;
		elegida?: number | null;
		aparece?: number;
		visibles?: number;
		desplazada?: number;
		busqueda?: string | null;
		cursor?: boolean;
	} | null;
	encimaCrear?: boolean;
}

/* ── Una fila de campos que se parte en líneas: `display: flex; flex-wrap: wrap` ─────────────── */

export interface Pieza { clave: string; base: number; crece: number; alto: number }
export interface Colocada { clave: string; x: number; y: number; ancho: number; alto: number }

/**
 * LO QUE HACE EL NAVEGADOR CON `.ficha__campos`: coloca por su base, parte la línea cuando no cabe,
 * reparte lo que sobra según `flex-grow` y alinea abajo (`align-items: flex-end`).
 */
export function enLineas(piezas: Pieza[], ancho: number, hueco = 12, entreLineas = 12): Colocada[] {
	const lineas: Pieza[][] = [[]];
	let usado = 0;
	for (const p of piezas) {
		const linea = lineas[lineas.length - 1];
		const hace = usado + (linea.length ? hueco : 0) + p.base;
		if (linea.length && hace > ancho) {
			lineas.push([p]);
			usado = p.base;
		} else {
			linea.push(p);
			usado = hace;
		}
	}

	const r: Colocada[] = [];
	let y = 0;
	for (const linea of lineas) {
		const bases = linea.reduce((n, p) => n + p.base, 0) + hueco * (linea.length - 1);
		const crecen = linea.reduce((n, p) => n + p.crece, 0);
		const sobra = ancho - bases;
		const alto = Math.max(...linea.map((p) => p.alto));
		let x = 0;
		for (const p of linea) {
			const w = Math.round(p.base + (crecen ? (sobra * p.crece) / crecen : 0));
			r.push({ clave: p.clave, x, y: y + alto - p.alto, ancho: w, alto: p.alto });
			x += w + hueco;
		}
		y += alto + entreLineas;
	}
	return r;
}

const ALTO_CAMPO = ALTO_ETIQUETA + ALTO_CONTROL;
/** «Horas de clase a la semana. En blanco = sin definir.»: la ayuda de debajo del campo IH. */
export const ALTO_EXTRA = 44;

export const PIEZAS_FICHA: Pieza[] = [
	{ clave: 'nombre', base: 224, crece: 3, alto: ALTO_CAMPO },
	{ clave: 'abrev', base: 128, crece: 1, alto: ALTO_CAMPO },
	{ clave: 'grado', base: 160, crece: 1, alto: ALTO_CAMPO },
	{ clave: 'titular', base: 224, crece: 2, alto: ALTO_CAMPO },
	{ clave: 'valormatricula', base: 160, crece: 1, alto: ALTO_CAMPO },
	{ clave: 'valorpension', base: 160, crece: 1, alto: ALTO_CAMPO },
	{ clave: 'orden', base: 112, crece: 0, alto: ALTO_CAMPO },
	{ clave: 'ih', base: 192, crece: 1, alto: ALTO_CAMPO + ALTO_EXTRA },
	{ clave: 'caritas', base: 96, crece: 0, alto: ALTO_CONTROL },
	{ clave: 'botones', base: 170, crece: 0, alto: ALTO_CONTROL },
];

const ANCHO_CUERPO_FICHA = ANCHO_GRUPOS - RELLENO_FICHA * 2 - 2;
export const COLOCADAS_FICHA = enLineas(PIEZAS_FICHA, ANCHO_CUERPO_FICHA);
export const colocada = (clave: string) => {
	const c = COLOCADAS_FICHA.find((x) => x.clave === clave);
	if (!c) { throw new Error(`Grupos: la ficha no tiene «${clave}».`); }
	return c;
};
const ALTO_CAMPOS = Math.max(...COLOCADAS_FICHA.map((c) => c.y + c.alto));
export const ALTO_FICHA = ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_CAMPOS + RELLENO_FICHA;

/* ── «Grupos que van siempre juntos» ────────────────────────────────────────────────────────── */

export const JUNTOS = { relleno: 16, lados: 20, titulo: 26, explica: 44, conjunto: 46, hueco: 12, pide: 30, ficha: 34, entreFichas: 8, frase: 46 };
export const BOTON_JUNTAR = 150;

/** El ancho de una ficha de grupo del editor: su nombre con el relleno de `.ficha-grupo`, y el visto si está elegida. */
export const anchoDeFicha = (nombre: string, elegida: boolean) => Math.round(28 + nombre.length * 8.6 + (elegida ? 22 : 0));

const ANCHO_DENTRO_JUNTOS = ANCHO_GRUPOS - JUNTOS.lados * 2 - 2;

/** Dónde cae cada ficha del editor, desde la esquina de la zona de fichas. */
export function fichasDelEditor(elegidos: string[]): { nombre: string; x: number; y: number; ancho: number }[] {
	const r: { nombre: string; x: number; y: number; ancho: number }[] = [];
	let x = 0;
	let y = 0;
	for (const g of GRUPOS) {
		const ancho = anchoDeFicha(g.nombre, elegidos.includes(g.nombre));
		if (x > 0 && x + ancho > ANCHO_DENTRO_JUNTOS) { x = 0; y += JUNTOS.ficha + JUNTOS.entreFichas; }
		r.push({ nombre: g.nombre, x, y, ancho });
		x += ancho + JUNTOS.entreFichas;
	}
	return r;
}

/*
 * LAS FICHAS SE MIDEN SIN ELEGIR NINGUNA, y el alto no cambia al elegir: el visto ensancha la ficha,
 * y si la línea se partiera en otro sitio el recuadro entero daría un salto al pulsar. Con quince
 * grupos cortos caben en dos líneas con holgura, así que el alto es el de dos líneas siempre.
 */
const LINEAS_DE_FICHAS = Math.max(...fichasDelEditor(GRUPOS.map((g) => g.nombre)).map((f) => f.y)) / (JUNTOS.ficha + JUNTOS.entreFichas) + 1;

export function altoDeJuntos(j: Juntos): number {
	const cabeza = JUNTOS.titulo + JUNTOS.explica;
	let cuerpo = 0;
	if (j.forma === 'vacio') { cuerpo = JUNTOS.hueco + 44; }
	if (j.forma === 'conjuntos') { cuerpo = j.conjuntos.length * (JUNTOS.hueco + JUNTOS.conjunto); }
	if (j.forma === 'editor') {
		cuerpo = JUNTOS.hueco + JUNTOS.pide + LINEAS_DE_FICHAS * JUNTOS.ficha + (LINEAS_DE_FICHAS - 1) * JUNTOS.entreFichas + JUNTOS.frase + ALTO_CONTROL;
	}
	return JUNTOS.relleno * 2 + cabeza + cuerpo;
}

/* ── La disposición ─────────────────────────────────────────────────────────────────────────── */

export const ALTO_PISTA = 22;

export interface DisposicionGrupos {
	ficha: { y: number; alto: number } | null;
	juntos: { y: number; alto: number };
	pista: number;
	rejilla: { y: number; alto: number };
	fin: number;
}

export function disposicionGrupos(e: EstadoGrupos): DisposicionGrupos {
	let y = CABECERA_PAGINA + HUECO;
	let ficha: DisposicionGrupos['ficha'] = null;
	if (e.ficha) {
		ficha = { y, alto: ALTO_FICHA };
		y += ALTO_FICHA + HUECO;
	}
	const juntos = { y, alto: altoDeJuntos(e.juntos) };
	y += juntos.alto + HUECO;
	const pista = y;
	y += ALTO_PISTA + 8;
	const rejilla = { y, alto: altoDeLaRejilla(e.filas.length) };
	y += rejilla.alto + 24;
	return { ficha, juntos, pista, rejilla, fin: y };
}

const bajar = (e: EstadoGrupos, y: number) => MAIN.y + y - (e.desplazada ?? 0);

export function rectCrearGrupo(e: EstadoGrupos): Rect {
	return { x: MAIN.x + MAIN.ancho - BOTON_CREAR_GRUPO, y: bajar(e, (CABECERA_PAGINA - ALTO_CONTROL) / 2), ancho: BOTON_CREAR_GRUPO, alto: ALTO_CONTROL };
}

export function rectCampoGrupo(e: EstadoGrupos, clave: CampoGrupo | 'caritas' | 'botones'): Rect {
	const d = disposicionGrupos(e);
	if (!d.ficha) { throw new Error('Grupos: la ficha no está abierta.'); }
	const c = colocada(clave);
	const conEtiqueta = clave !== 'caritas' && clave !== 'botones';
	return {
		x: MAIN.x + 1 + RELLENO_FICHA + c.x,
		y: bajar(e, d.ficha.y + ALTO_CABECERA_FICHA + RELLENO_FICHA + c.y + (conEtiqueta ? ALTO_ETIQUETA : 0)),
		ancho: c.ancho,
		alto: ALTO_CONTROL,
	};
}

export function rectCampoGrupoConEtiqueta(e: EstadoGrupos, clave: CampoGrupo, conExtra = false): Rect {
	const r = rectCampoGrupo(e, clave);
	return { x: r.x - 6, y: r.y - ALTO_ETIQUETA - 4, ancho: r.ancho + 12, alto: r.alto + ALTO_ETIQUETA + 10 + (conExtra ? ALTO_EXTRA : 0) };
}

export function rectBotonCrear(e: EstadoGrupos): Rect {
	const b = rectCampoGrupo(e, 'botones');
	return { x: b.x, y: b.y, ancho: 72, alto: ALTO_CONTROL };
}

export function rectJuntos(e: EstadoGrupos): Rect {
	const d = disposicionGrupos(e);
	return { x: MAIN.x, y: bajar(e, d.juntos.y), ancho: MAIN.ancho, alto: d.juntos.alto };
}

export function rectJuntar(e: EstadoGrupos): Rect {
	const j = rectJuntos(e);
	return { x: j.x + j.ancho - JUNTOS.lados - BOTON_JUNTAR, y: j.y + JUNTOS.relleno, ancho: BOTON_JUNTAR, alto: ALTO_CONTROL };
}

/** Lo alto de la zona de debajo de la cabeza, dentro del recuadro. */
const arribaDelCuerpo = (e: EstadoGrupos) => rectJuntos(e).y + JUNTOS.relleno + JUNTOS.titulo + JUNTOS.explica;

export function rectFichaDelEditor(e: EstadoGrupos, nombre: string): Rect {
	if (e.juntos.forma !== 'editor') { throw new Error('Grupos: el editor no está abierto.'); }
	const f = fichasDelEditor(e.juntos.elegidos).find((x) => x.nombre === nombre)!;
	const y0 = arribaDelCuerpo(e) + JUNTOS.hueco + JUNTOS.pide;
	return { x: MAIN.x + 1 + JUNTOS.lados + f.x, y: y0 + f.y, ancho: f.ancho, alto: JUNTOS.ficha };
}

export function rectFrase(e: EstadoGrupos): Rect {
	const j = rectJuntos(e);
	const y = j.y + j.alto - JUNTOS.relleno - ALTO_CONTROL - JUNTOS.frase;
	return { x: j.x + JUNTOS.lados - 6, y: y + 6, ancho: 720, alto: JUNTOS.frase - 12 };
}

export function rectGuardarJuntos(e: EstadoGrupos): Rect {
	const j = rectJuntos(e);
	return { x: j.x + 1 + JUNTOS.lados, y: j.y + j.alto - JUNTOS.relleno - ALTO_CONTROL, ancho: 90, alto: ALTO_CONTROL };
}

export function rectConjunto(e: EstadoGrupos, i = 0): Rect {
	const y = arribaDelCuerpo(e) + JUNTOS.hueco + i * (JUNTOS.hueco + JUNTOS.conjunto);
	return { x: MAIN.x + 1 + JUNTOS.lados, y, ancho: ANCHO_DENTRO_JUNTOS, alto: JUNTOS.conjunto };
}

export const BOTON_SEPARAR = 104;
export const BOTON_CAMBIAR = 100;
export function rectSeparar(e: EstadoGrupos, i = 0): Rect {
	const c = rectConjunto(e, i);
	return { x: c.x + c.ancho - 12 - BOTON_SEPARAR, y: c.y + (JUNTOS.conjunto - 26) / 2, ancho: BOTON_SEPARAR, alto: 26 };
}

export function rectRejillaGrupos(e: EstadoGrupos): Rect {
	const d = disposicionGrupos(e);
	return { x: MAIN.x, y: bajar(e, d.rejilla.y), ancho: MAIN.ancho, alto: d.rejilla.alto };
}

export function rectCeldasGrupos(e: EstadoGrupos, i: number, desde: string, hasta = desde, filas = 1): Rect {
	const d = disposicionGrupos(e);
	const x = izquierdaDeColumna(COLUMNAS_GRUPOS, desde) - (e.desplazadaRejilla ?? 0);
	const x2 = izquierdaDeColumna(COLUMNAS_GRUPOS, hasta) + anchoDeColumna(COLUMNAS_GRUPOS, hasta) - (e.desplazadaRejilla ?? 0);
	return { x: MAIN.x + 1 + x, y: bajar(e, d.rejilla.y + 1 + CABECERA * 2 + i * FILA), ancho: x2 - x, alto: FILA * filas };
}

export function rectColumnasGrupos(e: EstadoGrupos, desde: string, hasta = desde): Rect {
	const r = rectCeldasGrupos(e, 0, desde, hasta, e.filas.length);
	return { x: r.x, y: r.y - CABECERA * 2, ancho: r.ancho, alto: r.alto + CABECERA * 2 };
}

/** La barra de desplazamiento de la rejilla: por donde se arrastra de lado. */
export function rectBarraGrupos(e: EstadoGrupos): Rect {
	const r = rectRejillaGrupos(e);
	return { x: r.x, y: r.y + r.alto - 18, ancho: r.ancho, alto: 16 };
}

export function rectOpcionGrupos(e: EstadoGrupos, i: number): Rect {
	const d = e.desplegable!;
	const campo = rectCampoGrupo(e, d.donde);
	let y = campo.y + campo.alto + 8 - (d.desplazada ?? 0);
	for (let k = 0; k < i; k++) { y += d.opciones[k].debajo ? 48 : 34; }
	return { x: campo.x + 4, y, ancho: campo.ancho - 8, alto: d.opciones[i].debajo ? 48 : 34 };
}

/** El pulgar de la barra horizontal, que es lo que se arrastra. */
export function rectPulgarGrupos(e: EstadoGrupos): Rect {
	const r = rectRejillaGrupos(e);
	const total = COLUMNAS_GRUPOS.reduce((n, c) => n + c.ancho, 0);
	return { x: r.x + ((e.desplazadaRejilla ?? 0) / total) * r.ancho, y: r.y + r.alto - 13, ancho: (r.ancho * r.ancho) / total, alto: 10 };
}

/** Los grados del colegio, en su orden: lo que ofrece el desplegable «Grado» de la ficha. */
export const GRADOS = GRUPOS.map((g) => g.grado).filter((g, i, xs) => xs.indexOf(g) === i);
