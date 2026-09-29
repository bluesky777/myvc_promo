import { MEDIDAS } from '../medidas';
import {
	CAT_TEXTOS, ClaveFamilia, FAMILIAS_DEL_CATALOGO, IMPRESOS, Impreso, Pide, buscarImpresos,
} from '../cierre-6/datos-catalogo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE INFORMES (`/informes`) PARA LA SERIE «INFORMES», Y DÓNDE CAE CADA COSA.
 *
 * Es el catálogo de `cierre-6/` --mismos textos, mismas familias, mismo buscador-- ampliado con lo
 * que estos vídeos recorren y aquéllos no: el buscador que filtra de verdad (`buscarImpresos`, la
 * misma cuenta que `casa()`), las pastillas que se quedan sólo con lo que tiene algo, el
 * configurador con TODOS sus campos y sus cuatro plegables de ajustes, la tira de la pila, y el
 * visor con el papel debajo. Literal de `catalogo-informes.html` y `catalogo-informes.ts`.
 *
 * LA GEOMETRÍA SE CALCULA AQUÍ, en coordenadas del CONTENIDO de la cáscara (1192 × 844), y el
 * dibujo la lee de aquí: el foco y el puntero salen del mismo número que la caja que señalan.
 */

export type Rect = { x: number; y: number; ancho: number; alto: number };

export const ANCHO = MEDIDAS.ancho - MEDIDAS.menu;
export const ALTO = MEDIDAS.alto - MEDIDAS.barra;

export const INF = {
	lados: 28,
	arriba: 20,
	pad: 22,
	fila1: 44,
	hueco: 14,
	busca: 50,
	pastilla: 36,
	huecoPastilla: 10,
	trasTarjeta: 20,
	cabezaFamilia: 64,
	ficha: 98,
	huecoFicha: 12,
	trasFamilia: 16,
	config: 384,
	huecoConfig: 20,
	/** Entre secciones del `<main>` (pila, buscador, cuerpo). */
	seccion: 16,
};

export const ANCHO_UTIL = ANCHO - INF.lados * 2;
export const ANCHO_LISTA = ANCHO_UTIL - INF.config - INF.huecoConfig;
export const ANCHO_FICHA = (ANCHO_LISTA - INF.huecoFicha) / 2;
export const X_CONFIG = INF.lados + ANCHO_LISTA + INF.huecoConfig;

export const TEXTOS = {
	...CAT_TEXTOS,
	periodo: 3,
	grupos: 13,
	vacio: 'Elige un informe y aquí aparecen sólo los datos que ese papel necesita.',
	nada: 'Nada se llama así. Prueba con boletín, planilla, certificado, quién falta o puestos.',
	paraQuien: '¿Para quién?',
	destinatarios: ['Todo el grupo', 'Los alumnos que marque'],
	estudiante: 'Estudiante',
	eligeEstudiante: 'Elige un estudiante',
	profesor: 'Profesor',
	eligeProfesor: 'Elige un profesor',
	hasta: 'Calcular hasta el periodo',
	todos: 'Todos los grupos',
	yaEsta: 'Ya está en la pila',
	vivefuera: 'Vive fuera',
	todaviaNo: 'Todavía no',
	como: 'Cómo sale este informe',
	casilla: 'Qué sale en la casilla',
	casillas: ['El número', 'La valoración'],
	casillaPista: 'Con «La valoración» sale el desempeño del colegio —ALTO, BÁSICO…— en vez del número. La escala con sus rangos va al pie de la hoja en los dos casos.',
	fecha: 'Fecha de entrega',
	fechaPista: 'Sale en todas las hojas, junto al periodo. Es el día en que se reparte, no el de hoy.',
	hoja: 'La hoja',
	hojas: ['Vertical', 'Carta apaisada', 'Oficio apaisado'],
	hojaPista: 'Viene puesta: cada informe sabe en qué papel se imprime.',
	pilaRotulo: 'La pila',
	pilaPista: 'Se pintan seguidos y salen en una sola impresión',
	vaciar: 'Vaciar',
	verPila: 'Ver la pila entera',
	buscarOtro: 'Buscar otro informe',
	mostrar: 'Mostrar opciones',
	ocultar: 'Ocultar opciones',
};

/** Los trece grupos del colegio inventado, en el orden del desplegable. */
export const GRUPOS = ['5°A', '6°A', '6°B', '7°A', '7°B', '8°A', '8°B', '9°A', '9°B', '10°A', '10°B', '11°A', '11°B'];

/* ── El buscador y las pastillas ──────────────────────────────────────────────────────────── */

export interface Pastilla {
	clave: ClaveFamilia | 'todo';
	titulo: string;
	cuenta: number;
	rect: Rect;
}

/** Lo que casa con la búsqueda y la familia puesta: es lo que se pinta en la lista. */
export function visibles(consulta: string, familia: ClaveFamilia | 'todo'): Impreso[] {
	return buscarImpresos(consulta).filter((i) => familia === 'todo' || i.familia === familia);
}

const anchoTexto = (t: string, tam: number, factor = 0.55) => t.length * tam * factor;

/** El ancho de una pastilla, por letra: sale de aquí y no del dibujo. */
export const anchoDePastilla = (titulo: string, cuenta: number) => Math.round(anchoTexto(titulo + String(cuenta), 15, 0.56) + 40);

/*
 * LA DISPOSICIÓN ENTERA DE LA PANTALLA con el catálogo desplegado. Todo lo que el dibujo pinta y el
 * guion señala sale de aquí.
 */
export interface EstadoDelCatalogo {
	consulta: string;
	familia: ClaveFamilia | 'todo';
	/** Las filas de la pila, si hay: la tira sale arriba del todo. */
	pila?: FilaDePila[];
	/** La ficha elegida, o null. */
	elegida: string | null;
	/** Lo que lleva cada campo del configurador. */
	valores: Valores;
	ajustes?: Ajustes;
	/** Cuánto se ha bajado la página: el buscador y la lista suben, el configurador se pega. */
	desplazamiento?: number;
}

export interface Valores {
	destinatario?: number;
	grupo?: string | null;
	alumno?: string | null;
	profesor?: string | null;
	hasta?: number | null;
}

/**
 * LOS AJUSTES QUE ESE PAPEL LEE (`opciones-del-informe.ts`), en el orden de la plantilla
 * `ajustesDelInforme`: «Cómo sale este informe», «Qué sale en la casilla», «Fecha de entrega» y
 * «La hoja». Los tres primeros sólo si el papel los lee.
 */
export interface Ajustes {
	interruptores?: { etiqueta: string; encendido: boolean }[];
	/** 0 = El número, 1 = La valoración. Sólo el semáforo. */
	casilla?: number;
	/** La fecha de entrega ya escrita, `dd/mm/aaaa`. Sólo el semáforo. */
	fecha?: string;
	/** 0 vertical, 1 carta apaisada, 2 oficio apaisado. */
	hoja: number;
	/** Qué plegables van abiertos. Por defecto, los de la plantilla (ver `abiertosPorDefecto`). */
	abiertos?: Partial<Record<Plegable, boolean>>;
}

export type Plegable = 'como' | 'casilla' | 'fecha' | 'hoja';

export interface FilaDePila {
	nombre: string;
	etiquetas: string[];
}

/** Lo que dice el botón grande: lo que falta, o adónde lleva. `catalogo-informes.ts:733`. */
export function loQueDiceElBoton(impreso: Impreso, valores: Valores): { texto: string; apagado: boolean } {
	if (impreso.estado === 'propuesto') { return { texto: 'Todavía no se puede sacar', apagado: true }; }
	if (impreso.estado === 'fuera') { return { texto: `Abrir «${impreso.dondeVive ?? 'la pantalla'}»`, apagado: false }; }
	const falta = queFalta(impreso, valores);
	return falta ? { texto: falta, apagado: true } : { texto: TEXTOS.cargar, apagado: false };
}

export function queFalta(impreso: Impreso, v: Valores): string | null {
	if (impreso.pide.includes('grupo') && !v.grupo) { return 'Elige un grupo'; }
	if (impreso.pide.includes('profesor') && !v.profesor) { return 'Elige un profesor'; }
	if (impreso.pide.includes('alumno') && !v.alumno) { return 'Elige un estudiante'; }
	return null;
}

export function sePuedeApilar(impreso: Impreso, v: Valores): boolean {
	return !impreso.estado && queFalta(impreso, v) === null;
}

/* ── Medidas del configurador ─────────────────────────────────────────────────────────────── */

export const CONF = {
	pad: 20,
	cabeza: 104,
	rotulo: 24,
	control: 42,
	aire: 16,
	plegable: 40,
	fila: 32,
	segmento: 34,
	boton: 44,
	botonPila: 40,
	huecoBoton: 10,
};

const CAMPOS_EN_ORDEN: Pide[] = ['destinatario', 'grupo', 'alumno', 'profesor', 'hasta'];

/** Las líneas que ocupa un texto de 13,5 px en el ancho del configurador. */
const lineasDePista = (t: string, ancho: number) => Math.ceil(anchoTexto(t, 13.5) / ancho);

export interface Disposicion {
	pila: DisposicionDePila | null;
	tarjeta: Rect;
	buscador: Rect;
	pastillas: Pastilla[];
	secciones: { clave: ClaveFamilia; titulo: string; para: string; y: number; fichas: { impreso: Impreso; rect: Rect }[] }[];
	vacio: boolean;
	config: Rect;
	conf: DisposicionDelConfigurador | null;
}

export interface DisposicionDelConfigurador {
	campos: Partial<Record<Pide, Rect>>;
	sinCampos: Rect | null;
	plegables: { que: Plegable; cabeza: Rect; abierto: boolean; cuerpo: Rect | null; controles: Rect[] }[];
	nota: Rect | null;
	cargar: Rect;
	apilar: Rect | null;
}

export function abiertosPorDefecto(que: Plegable, enElPanel: boolean): boolean {
	if (que === 'casilla' || que === 'fecha') { return true; }
	if (que === 'como') { return enElPanel; }
	return false;
}

/**
 * LOS PLEGABLES DE AJUSTES, apilados desde `y`, en el ancho `ancho`. Se usan en el configurador
 * (`enElPanel` false: «Cómo sale» nace cerrado) y en el panel flotante del visor (abierto).
 */
export function disponerAjustes(ajustes: Ajustes, x: number, y: number, ancho: number, enElPanel: boolean) {
	const lista: Plegable[] = [];
	if (ajustes.interruptores?.length) { lista.push('como'); }
	if (ajustes.casilla !== undefined) { lista.push('casilla'); }
	if (ajustes.fecha !== undefined) { lista.push('fecha'); }
	lista.push('hoja');
	const dentro = ancho - 32;
	const plegables: DisposicionDelConfigurador['plegables'] = [];
	for (const que of lista) {
		const abierto = ajustes.abiertos?.[que] ?? abiertosPorDefecto(que, enElPanel);
		const cabeza = { x, y, ancho, alto: CONF.plegable };
		y += CONF.plegable;
		let cuerpo: Rect | null = null;
		const controles: Rect[] = [];
		if (abierto) {
			const arriba = y + 4;
			let alto = 0;
			if (que === 'como') {
				(ajustes.interruptores ?? []).forEach((_, i) => controles.push({ x: x + 16, y: arriba + i * CONF.fila, ancho: dentro, alto: CONF.fila }));
				alto = (ajustes.interruptores ?? []).length * CONF.fila + 12;
			} else {
				const pista = que === 'casilla' ? TEXTOS.casillaPista : que === 'fecha' ? TEXTOS.fechaPista : TEXTOS.hojaPista;
				controles.push({ x: x + 16, y: arriba, ancho: que === 'fecha' ? 170 : dentro, alto: CONF.segmento });
				alto = CONF.segmento + 8 + lineasDePista(pista, dentro) * 19 + 14;
			}
			cuerpo = { x, y, ancho, alto };
			y += alto;
		}
		plegables.push({ que, cabeza, abierto, cuerpo, controles });
	}
	return { plegables, fin: y };
}

/* ── La tira de la pila ───────────────────────────────────────────────────────────────────── */

export const PILA = { pad: 14, hueco: 12, huecoFila: 8, chip: 30, huecoChip: 6, tam: 14 };

export interface DisposicionDePila {
	rect: Rect;
	rotulo: Rect;
	chips: { rect: Rect; quitar: Rect }[];
	cuenta: Rect;
	vaciar: Rect;
	ver: Rect;
}

export function anchoDeChip(f: FilaDePila) {
	return Math.round(10 + anchoTexto(f.nombre, PILA.tam, 0.57) + (f.etiquetas.length ? 7 + anchoTexto(f.etiquetas.join(' · '), PILA.tam) : 0) + 6 + 24 + 4);
}

/**
 * LA TIRA ES UN `flex-wrap`: el rótulo, la lista de filas (que se parte por dentro), la cuenta y
 * los dos botones empujados a la derecha. Se reparte en renglones igual que el navegador.
 */
export function disponerPila(filas: FilaDePila[], y: number, x = INF.lados, ancho = ANCHO_UTIL): DisposicionDePila {
	const dentro = ancho - PILA.pad * 2;
	const anchoRotulo = 330;
	const anchoCuenta = 64;
	const anchoVaciar = 84;
	const anchoVer = 196;
	const anchoMandos = anchoVaciar + 8 + anchoVer;
	const anchosChip = filas.map(anchoDeChip);
	const anchoLista = anchosChip.reduce((a, b) => a + b, 0) + Math.max(0, filas.length - 1) * PILA.huecoChip;

	type Pieza = { que: 'rotulo' | 'lista' | 'cuenta' | 'mandos'; ancho: number; alto: number };
	const listaAncho = Math.min(anchoLista, dentro);
	/* Las filas de chips dentro de la lista, si no cabe en un renglón. */
	const lineasDeChips: number[][] = [[]];
	let xx = 0;
	anchosChip.forEach((w, i) => {
		if (xx > 0 && xx + w > listaAncho + 0.5) { lineasDeChips.push([]); xx = 0; }
		lineasDeChips[lineasDeChips.length - 1].push(i);
		xx += w + PILA.huecoChip;
	});
	const altoLista = lineasDeChips.length * PILA.chip + (lineasDeChips.length - 1) * PILA.huecoChip;
	const piezas: Pieza[] = [
		{ que: 'rotulo', ancho: anchoRotulo, alto: 40 },
		{ que: 'lista', ancho: listaAncho, alto: altoLista },
		{ que: 'cuenta', ancho: anchoCuenta, alto: 32 },
		{ que: 'mandos', ancho: anchoMandos, alto: 36 },
	];
	/* Renglones del flex-wrap. */
	const renglones: Pieza[][] = [[]];
	let usado = 0;
	for (const p of piezas) {
		const hace = usado === 0 ? p.ancho : usado + PILA.hueco + p.ancho;
		if (usado > 0 && hace > dentro) { renglones.push([]); usado = 0; }
		renglones[renglones.length - 1].push(p);
		usado = usado === 0 ? p.ancho : usado + PILA.hueco + p.ancho;
	}
	const pos: Record<string, Rect> = {};
	let yy = y + PILA.pad;
	for (const r of renglones) {
		const altoR = Math.max(...r.map((p) => p.alto));
		let px = x + PILA.pad;
		for (const p of r) {
			let left = px;
			if (p.que === 'mandos') { left = x + ancho - PILA.pad - p.ancho; }
			pos[p.que] = { x: left, y: yy + (altoR - p.alto) / 2, ancho: p.ancho, alto: p.alto };
			px += p.ancho + PILA.hueco;
		}
		yy += altoR + PILA.huecoFila;
	}
	const alto = yy - PILA.huecoFila + PILA.pad - y;
	const chips: DisposicionDePila['chips'] = [];
	lineasDeChips.forEach((linea, l) => {
		let cx = pos.lista.x;
		for (const i of linea) {
			const rect = { x: cx, y: pos.lista.y + l * (PILA.chip + PILA.huecoChip), ancho: anchosChip[i], alto: PILA.chip };
			chips[i] = { rect, quitar: { x: rect.x + rect.ancho - 28, y: rect.y + 3, ancho: 24, alto: 24 } };
			cx += anchosChip[i] + PILA.huecoChip;
		}
	});
	const m = pos.mandos;
	return {
		rect: { x, y, ancho, alto },
		rotulo: pos.rotulo,
		chips,
		cuenta: pos.cuenta,
		vaciar: { x: m.x, y: m.y, ancho: anchoVaciar, alto: m.alto },
		ver: { x: m.x + anchoVaciar + 8, y: m.y, ancho: anchoVer, alto: m.alto },
	};
}

/* ── La disposición del catálogo ──────────────────────────────────────────────────────────── */

export function disponer(e: EstadoDelCatalogo): Disposicion {
	const baja = e.desplazamiento ?? 0;
	let y = INF.arriba;
	/* La tira de la pila va pegada arriba (`position: sticky; top: 0`): baja con la página hasta el techo y ahí se queda. */
	const pila = e.pila && e.pila.length ? disponerPila(e.pila, Math.max(0, INF.arriba - baja)) : null;
	if (pila) { y += pila.rect.alto + INF.seccion; }
	y -= baja;

	/* La tarjeta del buscador y sus pastillas: «Todo» y las familias con algo (`@if (cuentas()…)`). */
	const encontrados = buscarImpresos(e.consulta);
	const lista: Omit<Pastilla, 'rect'>[] = [{ clave: 'todo', titulo: 'Todo', cuenta: encontrados.length }];
	for (const f of FAMILIAS_DEL_CATALOGO) {
		const cuenta = encontrados.filter((i) => i.familia === f.clave).length;
		if (cuenta) { lista.push({ clave: f.clave, titulo: f.titulo, cuenta }); }
	}
	const dentro = ANCHO_UTIL - INF.pad * 2;
	const arribaP = y + INF.pad + INF.fila1 + INF.hueco + INF.busca + INF.hueco;
	let px = 0;
	let fila = 0;
	const pastillas: Pastilla[] = lista.map((p) => {
		const ancho = anchoDePastilla(p.titulo, p.cuenta);
		if (px + ancho > dentro) { px = 0; fila++; }
		const rect = { x: INF.lados + INF.pad + px, y: arribaP + fila * (INF.pastilla + INF.huecoPastilla), ancho, alto: INF.pastilla };
		px += ancho + INF.huecoPastilla;
		return { ...p, rect };
	});
	const filas = fila + 1;
	const altoTarjeta = INF.pad * 2 + INF.fila1 + INF.hueco + INF.busca + INF.hueco + filas * INF.pastilla + (filas - 1) * INF.huecoPastilla;
	const tarjeta = { x: INF.lados, y, ancho: ANCHO_UTIL, alto: altoTarjeta };
	const buscador = { x: INF.lados + INF.pad, y: y + INF.pad + INF.fila1 + INF.hueco, ancho: dentro, alto: INF.busca };

	/* La lista: una sección por familia con algo, dos columnas. */
	const arribaCuerpo = y + altoTarjeta + INF.trasTarjeta;
	let ly = arribaCuerpo;
	const secciones: Disposicion['secciones'] = [];
	const suyos = visibles(e.consulta, e.familia);
	for (const f of FAMILIAS_DEL_CATALOGO) {
		const deEsta = suyos.filter((i) => i.familia === f.clave);
		if (!deEsta.length) { continue; }
		const yCab = ly;
		const fichas = deEsta.map((impreso, i) => ({
			impreso,
			rect: {
				x: INF.lados + (i % 2) * (ANCHO_FICHA + INF.huecoFicha),
				y: yCab + INF.cabezaFamilia + Math.floor(i / 2) * (INF.ficha + INF.huecoFicha),
				ancho: ANCHO_FICHA,
				alto: INF.ficha,
			},
		}));
		secciones.push({ clave: f.clave, titulo: f.titulo, para: f.para, y: yCab, fichas });
		ly = yCab + INF.cabezaFamilia + Math.ceil(deEsta.length / 2) * (INF.ficha + INF.huecoFicha) - INF.huecoFicha + INF.trasFamilia + 14;
	}

	/* El configurador: pegado arriba cuando la página baja (`sticky`). */
	const yConfig = Math.max((pila ? pila.rect.y + pila.rect.alto + INF.seccion : 12), arribaCuerpo);
	const impreso = e.elegida ? IMPRESOS.find((i) => i.clave === e.elegida) ?? null : null;
	let conf: DisposicionDelConfigurador | null = null;
	let altoConfig = 250;
	if (impreso) {
		const x = X_CONFIG + CONF.pad;
		const ancho = INF.config - CONF.pad * 2;
		let cy = yConfig + CONF.pad + CONF.cabeza;
		const campos: Partial<Record<Pide, Rect>> = {};
		for (const que of CAMPOS_EN_ORDEN) {
			if (!impreso.pide.includes(que)) { continue; }
			/* «Estudiante» cuelga del grupo: sin grupo no se pinta (`@if (pide('alumno') && grupoId() !== null)`). */
			if (que === 'alumno' && !e.valores.grupo) { continue; }
			campos[que] = { x, y: cy + CONF.rotulo, ancho, alto: que === 'destinatario' ? 38 : CONF.control };
			cy += CONF.rotulo + (que === 'destinatario' ? 38 : CONF.control) + CONF.aire;
		}
		const ajustes = e.ajustes ?? { hoja: impreso.papel === 'apaisado' ? 1 : 0 };
		let sinCampos: Rect | null = null;
		if (!impreso.pide.length && !ajustes.interruptores?.length) {
			sinCampos = { x, y: cy, ancho, alto: 30 };
			cy += 30 + CONF.aire;
		}
		const aj = disponerAjustes(ajustes, X_CONFIG, cy, INF.config, false);
		cy = aj.fin + 16;
		let nota: Rect | null = null;
		if (impreso.estado) {
			nota = { x, y: cy, ancho, alto: 86 };
			cy += 86 + 10;
		}
		const cargar = { x, y: cy, ancho, alto: CONF.boton };
		cy += CONF.boton;
		let apilar: Rect | null = null;
		if (sePuedeApilar(impreso, e.valores)) {
			apilar = { x, y: cy + CONF.huecoBoton, ancho, alto: CONF.botonPila };
			cy += CONF.huecoBoton + CONF.botonPila;
		}
		conf = { campos, sinCampos, plegables: aj.plegables, nota, cargar, apilar };
		altoConfig = cy + CONF.pad - yConfig;
	}
	return {
		pila,
		tarjeta,
		buscador,
		pastillas,
		secciones,
		vacio: suyos.length === 0,
		config: { x: X_CONFIG, y: yConfig, ancho: INF.config, alto: altoConfig },
		conf,
	};
}

/** La ficha de una clave en la disposición. */
export function rectDeFicha(d: Disposicion, clave: string): Rect {
	for (const s of d.secciones) {
		const f = s.fichas.find((x) => x.impreso.clave === clave);
		if (f) { return f.rect; }
	}
	throw new Error(`La ficha «${clave}» no está a la vista con esa búsqueda.`);
}

export function rectDePastilla(d: Disposicion, clave: string): Rect {
	const p = d.pastillas.find((x) => x.clave === clave);
	if (!p) { throw new Error(`La pastilla «${clave}» no sale con esa búsqueda.`); }
	return p.rect;
}

/* ── El visor, con el informe cargado (el catálogo recogido) ──────────────────────────────── */

export const VIS = {
	tira: 44,
	cabeza: 54,
	mando: 32,
	panel: 372,
};

export const TIRA = { x: INF.lados, y: INF.arriba, ancho: ANCHO_UTIL, alto: VIS.tira };
export const Y_VISOR = INF.arriba + VIS.tira + 12;
export const VISOR = { x: INF.lados, y: Y_VISOR, ancho: ANCHO_UTIL, alto: ALTO - Y_VISOR + 20 };
export const CABEZA = { x: INF.lados, y: Y_VISOR, ancho: ANCHO_UTIL, alto: VIS.cabeza };
export const MESA = { x: INF.lados + 1, y: Y_VISOR + VIS.cabeza, ancho: ANCHO_UTIL - 2, alto: ALTO - Y_VISOR - VIS.cabeza + 20 };

/** Los dos mandos del panel, a la derecha de la cabecera: «Ajustes» y «Pantalla completa». */
export const ENGRANAJE = { x: INF.lados + ANCHO_UTIL - 16 - VIS.mando * 2 - 8, y: Y_VISOR + (VIS.cabeza - VIS.mando) / 2, ancho: VIS.mando, alto: VIS.mando };
export const COMPLETA = { ...ENGRANAJE, x: ENGRANAJE.x + VIS.mando + 8 };
/** El de «Mostrar opciones», el primero de la izquierda. */
export const MOSTRAR = { x: INF.lados + 14, y: ENGRANAJE.y, ancho: VIS.mando, alto: VIS.mando };
/** Imprimir y recargar, los últimos mandos del informe, justo antes de «Ajustes». */
export const IMPRIMIR = { ...ENGRANAJE, x: ENGRANAJE.x - 22 - VIS.mando };
export const RECARGAR = { ...ENGRANAJE, x: IMPRIMIR.x - 8 - VIS.mando };
/** El panel flotante de ajustes: 372 de ancho, 12 px bajo la cabecera, contra la derecha. */
export const X_PANEL = INF.lados + ANCHO_UTIL - 16 - VIS.panel;
export const Y_PANEL = Y_VISOR + VIS.cabeza + 12;

/** De coordenadas del contenido a las de la cáscara. */
export const enLaCascara = (r: Rect): Rect => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
