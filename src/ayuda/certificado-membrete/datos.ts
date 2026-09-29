import { MEDIDAS } from '../medidas';
import { ALMENDROS, MEMBRETE } from '../colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PESTAÑA «CERTIFICADOS» DEL AÑO (`/colegio/:yearId/certificados`) Y DÓNDE CAE CADA COSA.
 *
 * La usan dos vídeos: «Los membretes del colegio» (abajo: los paneles de cada plantilla) y «Lo que
 * imprime este año» (arriba: cuál usa el año y sus textos). Por eso la geometría es UNA función
 * del estado de la pantalla --qué panel está abierto, si la barra de «sin guardar» salió-- y la
 * llaman igual el dibujo y los guiones: el foco y el puntero salen del mismo número que el dibujo.
 *
 * LO QUE ES DE LA APLICACIÓN (`colegio-certificados.html`, `colegio.html`, `colegio.scss`): el orden
 * de los paneles, sus títulos y pistas literales, las pestañas, los chips «imprime 2026», «la usan
 * N años» y «sin guardar», el pie «Al guardar cambia lo que imprimen N años.», el popconfirm de
 * borrar y los avisos. LO INVENTADO: el colegio, los nombres de las plantillas y las medidas.
 */

/* ── El colegio y sus plantillas ──────────────────────────────────────────────────────────── */

export interface Plantilla {
	id: number;
	nombre: string;
	/** El fichero del membrete, o `null`: «sin membrete». */
	membrete: string | null;
	/** Los años que la tienen puesta. El de 2026 se decide aparte (`puesta`). */
	usanOtros: number[];
	/** Las seis medidas, en píxeles de pantalla como en la aplicación. */
	medidas: { alturaEncabezado: number; encIzquierda: number; encDerecha: number; cuerpoIzquierda: number; cuerpoDerecha: number; alturaPie: number };
}

/*
 * TRES PLANTILLAS, que es lo que tiene un colegio que probó cosas: la membretada que usaron 2024 y
 * 2025, la «hoja en blanco» con la que arrancó 2026 y una de prueba que nadie usa.
 */
export const PLANTILLAS: Plantilla[] = [
	{
		id: 3,
		nombre: 'Membrete Los Almendros',
		membrete: MEMBRETE.fichero,
		usanOtros: [2024, 2025],
		medidas: { alturaEncabezado: 150, encIzquierda: 60, encDerecha: 60, cuerpoIzquierda: 60, cuerpoDerecha: 60, alturaPie: 60 },
	},
	{
		id: 5,
		nombre: 'Hoja en blanco',
		membrete: null,
		usanOtros: [],
		medidas: { alturaEncabezado: 40, encIzquierda: 40, encDerecha: 40, cuerpoIzquierda: 40, cuerpoDerecha: 40, alturaPie: 40 },
	},
	{
		id: 6,
		nombre: 'Prueba',
		membrete: null,
		usanOtros: [],
		medidas: { alturaEncabezado: 0, encIzquierda: 0, encDerecha: 0, cuerpoIzquierda: 0, cuerpoDerecha: 0, alturaPie: 0 },
	},
];

export const MEMBRETADA = 0;
export const EN_BLANCO = 1;
export const PRUEBA = 2;

/** Las imágenes publicadas del colegio: el número sale en la pista de «Los membretes». */
export const IMAGENES_PUBLICADAS = 4;

export const YEAR = ALMENDROS.year;

/* ── Los textos literales ─────────────────────────────────────────────────────────────────── */

export const TEXTOS = {
	pistaDelAnio: [
		'El membrete y sus medidas son ', { b: 'del colegio' }, ' y los comparten todos los años. Lo que es de ',
		String(YEAR), ' es ', { b: 'cuál de ellos usa' }, ' y los textos de abajo.',
	],
	pistaMembretes: [
		'La imagen del encabezado va ', { b: 'de filo a filo' }, ' —es el papel— y los seis números colocan lo que se imprime ',
		'encima: dónde cae el ', { b: 'texto del encabezado' }, ' y dónde cae el ', { b: 'cuerpo' },
		', que en una hoja membretada no tienen por qué ser el mismo hueco. Cada uno se mide desde su filo del papel, no ',
		'desde el margen, y se imprimen ', { b: 'aunque no subas ninguna imagen' },
		': es lo que necesita el colegio que compra la hoja ya membretada. Van en ', { b: 'píxeles de pantalla' },
		', que es lo que lee el navegador al imprimir: 96 px es una pulgada, y 38 px es un centímetro. La hoja de cada ',
		'panel los enseña puestos. ',
	],
	/** La última frase de la pista va aparte: es la que el foco señala. */
	pistaMembretesFinal: [{ b: 'Estas plantillas las comparten todos los años' }, ': lo que cambies aquí cambia lo que imprimen los que la estén usando.'],
	pistaImagenes: [
		'El desplegable trae las imágenes ', { b: 'publicadas del colegio' }, ` (${IMAGENES_PUBLICADAS}): las sube cualquiera del personal `,
		'desde Imágenes y las ven todos. Cada opción dice de quién es cuando hay más de un dueño.',
	],
	crear: 'Crear otra plantilla',
	crearPista: 'Nace en cero y sin membrete: el cuerpo empieza en el margen de siempre.',
	textoBajo: 'Texto bajo el membrete',
	textoBajoExtra: 'Sale también en la cabecera del boletín; suele ser la resolución de aprobación.',
	tituloFinal: 'Título del certificado de fin de año',
	tituloFinalValor: 'CONSTANCIA DE DESEMPEÑO ACADÉMICO',
	tituloFinalExtra: 'Va impreso arriba del todo, en el certificado de fin de año. No puede quedar en blanco.',
	tituloPeriodo: 'Título del certificado de un periodo',
	tituloPeriodoValor: 'CONSTANCIA DE DESEMPEÑO ACADÉMICO PARCIAL',
	tituloPeriodoExtra: 'El que va arriba del todo cuando el certificado se pide a mitad de año. No puede quedar en blanco.',
	pendiente: 'Hay textos sin guardar.',
	guardarTextos: 'Guardar los textos',
	guardarPlantilla: 'Guardar la plantilla',
	descartar: 'Descartar',
	popconfirm: 'Esto la borra para siempre, no va a la papelera. ¿Seguimos?',
	eliminar: 'Eliminar',
	dejarla: 'Dejarla',
	noSePuede: 'No se puede borrar: hay años que imprimen con ella',
};

export type Trozo = string | { b: string };

/* ── Las pestañas del año ─────────────────────────────────────────────────────────────────── */

/** En el orden de `colegio.html`. Anchos fijos: el puntero tiene que caer en la que dice el guion. */
export const PESTANAS = [
	{ etiqueta: 'Periodos', ancho: 132 },
	{ etiqueta: 'Ficha del colegio', ancho: 186 },
	{ etiqueta: 'Ajustes del año', ancho: 172 },
	{ etiqueta: 'Certificados', ancho: 160 },
	{ etiqueta: 'Compromisos', ancho: 160 },
	{ etiqueta: 'Plantilla del compromiso', ancho: 246 },
];
export const CERTIFICADOS = 3;

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const G = {
	lado: 24,
	arriba: 20,
	hueco: 16,
	relleno: 20,
	/** El panel de navegación: cabecera y tira de pestañas. */
	nav: 150,
	navPestanas: 102,
	pestana: 46,
	/** Panel «Lo que imprime»: dónde empiezan los botones y cuánto mide cada uno. */
	aBotones: 118,
	boton: { ancho: 252, alto: 58, hueco: 10 },
	/** Panel «Los textos»: sin la barra de pendientes, y lo que ésta añade. */
	b: 520,
	bBarra: 62,
	/** Dentro de «Los textos»: el editor. */
	bEditor: 92,
	bEditorAlto: 124,
	/** Panel «Los membretes del colegio». */
	c: 330,
	/** Un panel de plantilla, plegado. */
	cab: 62,
	/** Lo que añade abierto (nombre + cuerpo), y lo que añade el pie de «sin guardar». */
	cuerpo: 680,
	pie: 64,
};

export const ANCHO_PANEL = ANCHO_CONTENIDO - G.lado * 2;
export const ANCHO_MEDIO = (ANCHO_PANEL - G.hueco) / 2;

export interface EstadoPantalla {
	/** 0..1 por plantilla: cuánto está abierto su cuerpo. */
	abiertas: number[];
	/** 0..1 por plantilla: cuánto asoma su pie de «sin guardar». */
	pies: number[];
	/** 0..1: cuánto asoma la barra «Hay textos sin guardar». */
	barraTextos: number;
	/** 0..1 por plantilla: 1 = está, 0 = se borró (se pliega hasta desaparecer). */
	vivas: number[];
}

export const ESTADO_INICIAL: EstadoPantalla = {
	abiertas: [0, 1, 0],
	pies: [0, 0, 0],
	barraTextos: 0,
	vivas: [1, 1, 1],
};

/** Dónde cae cada bloque, en coordenadas del CONTENIDO (sin el menú ni la barra), antes del scroll. */
export function disposicion(e: EstadoPantalla) {
	const nav = { x: G.lado, y: G.arriba, ancho: ANCHO_PANEL, alto: G.nav };
	const filaY = nav.y + nav.alto + G.hueco;
	/* Las filas de botones: dos por fila, y sólo cuentan las plantillas que siguen vivas. */
	const filas = Math.ceil(e.vivas.filter((v) => v > 0.5).length / 2);
	const aAlto = G.aBotones + G.boton.alto * filas + G.boton.hueco * (filas - 1) + G.relleno;
	const bAlto = G.b + G.bBarra * e.barraTextos;
	const a = { x: G.lado, y: filaY, ancho: ANCHO_MEDIO, alto: aAlto };
	const b = { x: G.lado + ANCHO_MEDIO + G.hueco, y: filaY, ancho: ANCHO_MEDIO, alto: bAlto };
	const c = { x: G.lado, y: filaY + Math.max(aAlto, bAlto) + G.hueco, ancho: ANCHO_PANEL, alto: G.c };

	let y = c.y + c.alto + G.hueco;
	const plantillas = PLANTILLAS.map((_, i) => {
		const alto = (G.cab + G.cuerpo * e.abiertas[i] + G.pie * e.pies[i]) * e.vivas[i];
		const r = { x: G.lado, y, ancho: ANCHO_PANEL, alto };
		y += (alto + G.hueco) * Math.min(1, e.vivas[i] * 1.5);
		return r;
	});

	return { nav, a, b, c, plantillas, fin: y };
}

/* Rectángulos concretos, en coordenadas del contenido. */

export function rectPestana(i: number) {
	const x = G.lado + G.relleno + PESTANAS.slice(0, i).reduce((s, p) => s + p.ancho + 4, 0);
	return { x, y: G.arriba + G.navPestanas, ancho: PESTANAS[i].ancho, alto: G.pestana };
}

export function rectBotonDelAnio(e: EstadoPantalla, i: number) {
	const { a } = disposicion(e);
	const col = i % 2;
	const fila = Math.floor(i / 2);
	return {
		x: a.x + G.relleno + col * (G.boton.ancho + G.boton.hueco),
		y: a.y + G.aBotones + fila * (G.boton.alto + G.boton.hueco),
		ancho: G.boton.ancho,
		alto: G.boton.alto,
	};
}

export function rectEditor(e: EstadoPantalla) {
	const { b } = disposicion(e);
	return { x: b.x + G.relleno, y: b.y + G.bEditor, ancho: b.ancho - G.relleno * 2, alto: G.bEditorAlto };
}

export function rectBarraTextos(e: EstadoPantalla) {
	const { b } = disposicion(e);
	return { x: b.x + G.relleno, y: b.y + G.b - G.relleno + 4, ancho: b.ancho - G.relleno * 2, alto: G.bBarra - 12 };
}

/** El botón «Guardar los textos», a la derecha de la barra. */
export function rectGuardarTextos(e: EstadoPantalla) {
	const r = rectBarraTextos(e);
	return { x: r.x + r.ancho - 12 - 176, y: r.y + (r.alto - 36) / 2, ancho: 176, alto: 36 };
}

/** La pista de «Los membretes del colegio», que acaba en «Estas plantillas las comparten todos los años». */
export const PISTA_MEMBRETES = { dy: 58, alto: 124 };

export function rectPistaMembretes(e: EstadoPantalla) {
	const { c } = disposicion(e);
	return { x: c.x + G.relleno - 8, y: c.y + PISTA_MEMBRETES.dy - 6, ancho: c.ancho - G.relleno * 2 + 16, alto: PISTA_MEMBRETES.alto };
}

/** La fila de «Lo que imprime» y «Los textos»: lo que es del año. */
export function rectFilaDelAnio(e: EstadoPantalla) {
	const { a, b } = disposicion(e);
	return { x: a.x - 6, y: a.y - 6, ancho: b.x + b.ancho - a.x + 12, alto: Math.max(a.alto, b.alto) + 12 };
}

export function rectCabecera(e: EstadoPantalla, i: number) {
	const r = disposicion(e).plantillas[i];
	return { x: r.x, y: r.y, ancho: r.ancho, alto: G.cab };
}

/** El botón del nombre (la flecha y el nombre), que es lo que abre y pliega. */
export function rectAbrir(e: EstadoPantalla, i: number) {
	const r = rectCabecera(e, i);
	return { x: r.x + G.relleno - 4, y: r.y + 14, ancho: 290, alto: 34 };
}

/** La papelera, al final de la cabecera. */
export function rectPapelera(e: EstadoPantalla, i: number) {
	const r = rectCabecera(e, i);
	return { x: r.x + r.ancho - G.relleno - 34, y: r.y + 14, ancho: 34, alto: 34 };
}

/** «la usan N años» y el chip «imprime 2026»: el tramo derecho-central de la cabecera. */
export function rectChips(e: EstadoPantalla, i: number) {
	const r = rectCabecera(e, i);
	return { x: r.x + 300, y: r.y + 10, ancho: 560, alto: 42 };
}

/*
 * DENTRO DEL CUERPO ABIERTO. El nombre arriba; debajo, a la izquierda, las dos cajas de campos
 * (Encabezado y Cuerpo) en 404 px, y a la derecha la hoja de vista previa.
 */
export const CUERPO = {
	nombre: 16,
	nombreAlto: 60,
	/** Donde empiezan las dos cajas, desde el borde de abajo de la cabecera. */
	campos: 92,
	izquierda: 404,
	caja: { titulo: 30, campo: 104, imagen: 70 },
};

/**
 * La casilla «Altura encabezado», que es la que se teclea en el vídeo de los membretes. Cuenta como
 * el dibujo: la caja tiene 8 de relleno arriba, 22 de título, la fila de «Imagen» (18 + 4 + 40) y
 * 10 de hueco; dentro del campo, 18 de rótulo y 4 de aire.
 */
export function rectAlturaEncabezado(e: EstadoPantalla, i: number) {
	const r = rectCabecera(e, i);
	return {
		x: r.x + G.relleno + 11,
		y: r.y + G.cab + CUERPO.campos + 8 + 22 + 62 + 10 + 18 + 4,
		ancho: 140,
		alto: 36,
	};
}

/** El pie de «sin guardar» de una plantilla y su botón «Guardar la plantilla». */
export function rectPie(e: EstadoPantalla, i: number) {
	const r = disposicion(e).plantillas[i];
	return { x: r.x + G.relleno, y: r.y + r.alto - G.pie - 4, ancho: r.ancho - G.relleno * 2, alto: G.pie - 12 };
}

export function rectGuardarPlantilla(e: EstadoPantalla, i: number) {
	const r = rectPie(e, i);
	return { x: r.x + r.ancho - 12 - 190, y: r.y + (r.alto - 36) / 2, ancho: 190, alto: 36 };
}

/** El popconfirm de borrar sale ENCIMA de la papelera y alineado a su derecha (`topRight`). */
export const POPCONFIRM = { ancho: 420, alto: 118 };

export function rectPopconfirm(e: EstadoPantalla, i: number) {
	const p = rectPapelera(e, i);
	return { x: p.x + p.ancho - POPCONFIRM.ancho + 8, y: p.y - POPCONFIRM.alto - 10, ancho: POPCONFIRM.ancho, alto: POPCONFIRM.alto };
}

export function rectEliminar(e: EstadoPantalla, i: number) {
	const r = rectPopconfirm(e, i);
	return { x: r.x + r.ancho - 16 - 92, y: r.y + r.alto - 16 - 34, ancho: 92, alto: 34 };
}

/** De coordenadas del contenido a coordenadas de la cáscara, con el scroll puesto. */
export function enLaCascara(r: { x: number; y: number; ancho: number; alto: number }, scroll: number) {
	return { x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra - scroll, ancho: r.ancho, alto: r.alto };
}
