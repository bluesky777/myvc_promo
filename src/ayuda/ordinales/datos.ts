import { MEDIDAS, SECCIONES, alturaEnMenu, entradaDe } from '../medidas';
import { ORDINALES as DE_LA_REJILLA } from '../disciplina/datos';
import { CABECERA, FILA } from '../montar-el-ano/Rejilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ORDINALES DEL MANUAL DE CONVIVENCIA» (`app2/.../ordinales/`): lo que se ve y dónde cae.
 *
 * Los cuatro de tipo 1 son los mismos de la rejilla de disciplina (`disciplina/datos.ts`), para que
 * el ordinal que allí se elige en el desplegable sea el que aquí se carga. Los de tipo 2 y 3 y el
 * nuevo son inventados, genéricos. La configuración también: los nombres de los tipos, cuántas
 * hacen falta para pasar al siguiente y las tres columnas del libro rojo.
 */

export const DISCIPLINA = entradaDe(SECCIONES, 'Disciplina');
export const ENTRADA = entradaDe(SECCIONES, 'Disciplina', 'Ordinales');

export const MENU_ORD = {
	seccion: { x: 0, y: alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion },
	hija: { x: 0, y: alturaEnMenu(SECCIONES, ENTRADA.seccion, ENTRADA.hija, DISCIPLINA.seccion), ancho: MEDIDAS.menu, alto: MEDIDAS.hija },
};

export interface OrdinalDibujado { tipo: string; ordinal: string; descripcion: string; pagina: string }

export const ORDINALES: OrdinalDibujado[] = [
	...DE_LA_REJILLA.map((o, i) => ({ tipo: String(o.tipo), ordinal: String(o.ordinal), descripcion: o.descripcion, pagina: i < 2 ? 'p. 18' : 'p. 19' })),
	{ tipo: '2', ordinal: '3', descripcion: 'Agresión verbal o gestual reiterada a un compañero.', pagina: 'p. 24' },
	{ tipo: '3', ordinal: '1', descripcion: 'Porte de objetos que pongan en riesgo a otras personas.', pagina: 'p. 31' },
];

/** La celda que se corrige: la página del ordinal 5 (fila 2). */
export const LA_CORREGIDA = { fila: 1, valor: 'p. 20' };
export const EL_NUEVO: OrdinalDibujado = { tipo: '1', ordinal: '12', descripcion: 'Dañar a propósito los útiles de un compañero.', pagina: '' }; // la página no se teclea en la ficha: sale vacía

export const CONFIG = {
	nombres: [
		['Falta tipo 1', 'Situación tipo 1'], ['Plural faltas tipo 1', 'Situaciones tipo 1'], ['Género 1', 'F'],
		['Falta tipo 2', 'Situación tipo 2'], ['Plural faltas tipo 2', 'Situaciones tipo 2'], ['Género 2', 'F'],
		['Falta tipo 3', 'Situación tipo 3'], ['Plural faltas tipo 3', 'Situaciones tipo 3'], ['Género 3', 'F'],
	],
	cuantas: [['Tardanzas para tipo 1', '3'], ['Para tipo 2', '3'], ['Para tipo 3', '2']],
	libroRojo: [['Primera columna', 'Descargos'], ['Segunda columna', 'Compromiso'], ['Tercera columna', 'Seguimiento']],
};
/** El campo que se cambia: «Tardanzas para tipo 1», de 3 a 4. */
export const EL_CAMPO = { valor: '4' };

export const ANIOS = ['2026', '2025', '2024'];
export const MOTIVO = '2025 es un año lectivo ya cerrado: se puede consultar, pero sólo un superusuario puede modificarlo. Cambie al año en curso en la barra de arriba para editar.';

/* ── La geometría, en coordenadas del CONTENIDO ─────────────────────────────────────────── */

export const O = {
	arriba: 24,
	lados: 36,
	ancho: MEDIDAS.ancho - MEDIDAS.menu - 72,
	yAcciones: 76,
	alto: 40,
	yVariable: 136,
	alerta: 112,
	ficha: 268,
	pista: 34,
	rejilla: Math.round(900 * 0.55),
	yConfig: 32,
};

/** Los botones de la fila de acciones: dónde empieza cada uno y cuánto mide. */
export const ACCIONES = {
	anio: { x: 84, ancho: 120 },
	recargar: { x: 214, ancho: 124 },
	crear: { x: 348, ancho: 156 },
	configurar: { x: 514, ancho: 262 },
};

export const COLUMNAS = [
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' as const },
	{ clave: 'borrar', titulo: '', ancho: 56, alinear: 'centro' as const },
	{ clave: 'tipo', titulo: 'Tipo', ancho: 124, filtro: true },
	{ clave: 'ordinal', titulo: 'Ordinal', ancho: 124, filtro: true },
	{ clave: 'descripcion', titulo: 'Descripción', ancho: 636, filtro: true },
	{ clave: 'pagina', titulo: 'Página', ancho: 124, filtro: true },
];

/** Lo que baja el contenido variable: la alerta del año cerrado y la ficha de crear. */
export const bajada = (alerta: boolean, ficha: boolean) => (alerta ? O.alerta : 0) + (ficha ? O.ficha : 0);

export const yRejilla = (alerta: boolean, ficha: boolean) => O.yVariable + bajada(alerta, ficha) + O.pista;
export const yConfig = (alerta: boolean, ficha: boolean) => yRejilla(alerta, ficha) + O.rejilla + O.yConfig;

/** La configuración por dentro, desde su borde de arriba. Cinco columnas: `minmax(12rem, 1fr)` en ese ancho. */
export const CFG = {
	relleno: 16,
	h2: 16,
	casilla: 54,
	h3Nombres: 92,
	fila1: 124,
	fila2: 196,
	h3Cuantas: 276,
	filaCuantas: 310,
	h3Libro: 392,
	pistaLibro: 422,
	filaLibro: 452,
	alto: 546,
	columnas: 5,
	hueco: 12,
	anchoCampo: (MEDIDAS.ancho - MEDIDAS.menu - 72 - 32 - 4 * 12) / 5,
};

const X0 = MEDIDAS.menu + O.lados;
const Y0 = MEDIDAS.barra;

export const GEO_ORD = {
	accion: (cual: keyof typeof ACCIONES) => ({ x: X0 + ACCIONES[cual].x, y: Y0 + O.yAcciones, ancho: ACCIONES[cual].ancho, alto: O.alto }),
	rejilla: (ficha: boolean) => ({ x: X0, y: Y0 + yRejilla(false, ficha), ancho: O.ancho, alto: CABECERA * 2 + FILA * (ORDINALES.length + (ficha ? 1 : 0)) }),
	celdaPagina: (fila: number) => ({ x: X0 + O.ancho - 124, y: Y0 + yRejilla(false, false) + CABECERA * 2 + FILA * fila, ancho: 124, alto: FILA }),
	fuera: { x: X0 + 500, y: Y0 + yRejilla(false, false) + CABECERA * 2 + FILA * ORDINALES.length + 90, ancho: 10, alto: 10 },
	ficha: { x: X0, y: Y0 + O.yVariable, ancho: O.ancho, alto: O.ficha - 14 },
	campoFicha: (cual: 'ordinal' | 'tipo' | 'descripcion') => (cual === 'ordinal'
		? { x: X0 + 16, y: Y0 + O.yVariable + 70, ancho: 340, alto: 36 }
		: cual === 'tipo'
			? { x: X0 + 749, y: Y0 + O.yVariable + 70, ancho: 340, alto: 36 }
			: { x: X0 + 16, y: Y0 + O.yVariable + 136, ancho: O.ancho - 32, alto: 54 }),
	crear: { x: X0 + 16, y: Y0 + O.yVariable + O.ficha - 14 - 50, ancho: 90, alto: 36 },
	ocultar: { x: X0 + 116, y: Y0 + O.yVariable + O.ficha - 14 - 50, ancho: 100, alto: 36 },
	/* La configuración, con la página bajada `scroll`. */
	config: (scroll: number) => ({ x: X0, y: Y0 + yConfig(false, false) - scroll, ancho: O.ancho, alto: 546 }),
	cuantas: (scroll: number) => ({ x: X0 + 8, y: Y0 + yConfig(false, false) + CFG.h3Cuantas - 6 - scroll, ancho: O.ancho - 16, alto: CFG.filaCuantas + 62 - CFG.h3Cuantas + 12 }),
	campoTardanzas: (scroll: number) => ({ x: X0 + CFG.relleno, y: Y0 + yConfig(false, false) + CFG.filaCuantas + 26 - scroll, ancho: CFG.anchoCampo, alto: 36 }),
	libroRojo: (scroll: number) => ({ x: X0 + 8, y: Y0 + yConfig(false, false) + CFG.h3Libro - 6 - scroll, ancho: O.ancho - 16, alto: CFG.filaLibro + 62 - CFG.h3Libro + 12 }),
	alerta: { x: X0, y: Y0 + O.yVariable, ancho: O.ancho, alto: O.alerta - 14 },
};

export const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
