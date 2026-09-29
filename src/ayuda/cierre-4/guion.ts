import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Cierre } from '../Tarjeta';
import { acercamientoAUnaHoja, encuadreDeUnaHoja, enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos, fotogramasDeLectura } from '../tiempos';
import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from '../voz';
import {
	ARRIBA_LEYENDA, EN_CFG, FRANJA_MATEMATICAS, FRANJA_PIE, GRUPO, GRUPO_ID, H, HOJA, MATERIAS, PERIODO,
	SELECTOR_DE_LA_BARRA, TEXTOS_INF, arribaDeMateria, rectDeCargar, rectDeImprimir, rectDeLaFicha, rectDeLaOpcion,
	rectDelSelect,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE DE NOTAS, 4 DE 8: «SACAR LOS BOLETINES DEL PERIODO». Para coordinación.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **El periodo no se elige en Informes.** No hay desplegable: el boletín sale del periodo que
 *     la persona tiene puesto en el selector de arriba («2026 · Periodo 2»), que casi siempre es el
 *     abierto. El catálogo lo decía como «el que el colegio tiene abierto»; el código lo lee de la
 *     sesión (`catalogo-informes.ts:1701`), y el vídeo dice eso. Quien vaya a repetirlo buscará un
 *     desplegable del periodo, y hay que decirle dónde está de verdad.
 *
 * Y DE PASO CIERRA LA HISTORIA DEL VÍDEO 3: la hoja es la de Valentina, con la nivelación tachada.
 *
 * FUERA A PROPÓSITO: los ajustes de «Cómo sale este informe» y la pila de impresión, que son sus
 * propios vídeos (`informes-ajustes`, `informes-pila`); los tres juntos pasaban de 150 s.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   menú -> Informes; el periodo es el de arriba: comprobarlo antes de imprimir
 *     2. EL PAPEL     «Boletín del periodo» -> para quién y grupo -> «Cargar el informe» -> el visor
 *     3. LA HOJA      plano general, Matemáticas de cerca, y el pie con la leyenda (el indicador
 *                     nivelado repetía la idea de Matemáticas: fuera al acortar)
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */

export const FPS = 30;

const INFORMES = entradaDe(MENU_DIRECTIVO, 'Informes');
export const SECCION_INFORMES = INFORMES.seccion;

/* ── Los textos, antes que los tiempos: los tiempos salen de lo que tardan en decirse ─────── */

const M = MATERIAS[0];

type Texto = { texto: string; voz?: string; rojo?: boolean };

const X: Texto[] = [
	{ texto: 'Los boletines están en el menú, en Informes.' },
	/* La advertencia de la entrega (ADVERTENCIAS-AYUDA.md, «Entrega de notas», B): aquí no se elige el periodo. */
	{ texto: 'El periodo es el de arriba: compruébalo antes de imprimir.' },
	{ texto: 'En «Para la familia», «Boletín del periodo».', voz: 'Para la familia, Boletín del periodo.' },
	{ texto: `Para quién: todo el grupo. Grupo: ${GRUPO}.`, voz: 'Todo el grupo, el noveno B.' },
	{ texto: '«Cargar el informe»: un boletín por alumno.', voz: 'Cargar el informe: un boletín por alumno.' },
	{ texto: 'Se imprime con la impresora de arriba.' },
	{ texto: 'Esta es la hoja de Valentina.' },
	{ texto: `Matemáticas: ${M.original} tachado, y el ${M.nota} que quedó.` },
	{ texto: 'Al pie se explica el número tachado.' },
];

/** Lo que dura un paso: lo mismo que exige `compruebaElGuion`. */
const dura = (t: Texto): number => {
	/* Dentro de `tools/voz.mjs` la puerta usa el tiempo de lectura: aquí, lo mismo. */
	const voz = (globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ ? null : segundosDeVoz(t.voz ?? t.texto);
	return (voz === null ? fotogramasDeLectura(t.texto, FPS) : RETRASO_VOZ + Math.ceil(voz * FPS) + RESPIRO_VOZ) + (t.rojo ? FPS : 0);
};

/* ── Los arranques, encadenados; los clics cuelgan de sus pasos ──────────────────────────── */

const D: number[] = [];
D[0] = 8;
const montaInformes = 42;
/* El 2 señala el selector con el catálogo ya puesto. */
D[1] = Math.max(D[0] + dura(X[0]), montaInformes + 30);
D[2] = D[1] + dura(X[1]);
const llegaFicha = D[2] + 16;
const pulsaFicha = llegaFicha + 8;
D[3] = Math.max(D[2] + dura(X[2]), pulsaFicha + 16);
const llegaSelect = D[3] + 14;
const pulsaSelect = llegaSelect + 10;
const llegaOpcion = pulsaSelect + 16;
const pulsaOpcion = llegaOpcion + 10;
D[4] = Math.max(D[3] + dura(X[3]), pulsaOpcion + 12);
const llegaCargar = D[4] + 14;
const pulsaCargar = llegaCargar + 10;
const carga = pulsaCargar + 4;
/** «Trayendo los boletines…»: lo que tarda en llegar la respuesta. No está medido; es corto. */
const trae = carga + 30;
D[5] = Math.max(D[4] + dura(X[4]), trae + 12);
D[6] = D[5] + dura(X[5]);
D[7] = D[6] + dura(X[6]);
D[8] = D[7] + dura(X[7]);

export const TARJETA = D[8] + dura(X[8]);

export const T = {
	cursorEntra: 12,
	llegaInformes: 30,
	pulsaInformes: 36,
	montaInformes,
	llegaFicha,
	pulsaFicha,
	eligeFicha: pulsaFicha + 4,
	llegaSelect,
	pulsaSelect,
	abreSelect: pulsaSelect + 2,
	llegaOpcion,
	pulsaOpcion,
	eligeGrupo: pulsaOpcion + 2,
	llegaCargar,
	pulsaCargar,
	carga,
	trae,
	llegaImprimir: D[5] + 14,
	cursorSale: D[6] - 30,
	seVaLaCascara: D[6] - 30,
	entraLaHoja: D[6],
	/* Los dos encadenados de la hoja: a Matemáticas, y al pie. Acaban justo antes de su rótulo. */
	aMatematicas: D[7] - 14,
	alPie: D[8] - 14,
	/** Lo que dura cada encadenado. */
	encadenado: 12,
};

/* ── Los tres planos de la hoja ────────────────────────────────────────────────────────────── */

export const PLANO_GENERAL = encuadreDeUnaHoja(HOJA);
export const PLANO_MATEMATICAS = acercamientoAUnaHoja(HOJA, FRANJA_MATEMATICAS);
export const PLANO_PIE = acercamientoAUnaHoja(HOJA, FRANJA_PIE);

function enElPlano(p: { escala: number; x: number; y: number }, r: { x: number; y: number; ancho: number; alto: number }) {
	return { x: p.x + r.x * p.escala, y: p.y + r.y * p.escala, ancho: r.ancho * p.escala, alto: r.alto * p.escala, radio: 8 };
}

const enLaCascara = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra, ancho: r.ancho, alto: r.alto });
const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const holgado = (r: { x: number; y: number; ancho: number; alto: number }, h = 6) => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

const MATE = arribaDeMateria(0);
const DER_BLOQUE = HOJA.ancho - 18;

export const FOCOS = {
	informes: enElFotograma({ x: 0, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_INFORMES, null, null), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	selector: enElFotograma(holgado(SELECTOR_DE_LA_BARRA)),
	ficha: enElFotograma(holgado(enLaCascara(rectDeLaFicha(0)), 4)),
	configurador: enElFotograma(enLaCascara({
		x: rectDelSelect().x - 10,
		y: EN_CFG.paraQuien - 8,
		ancho: rectDelSelect().ancho + 20,
		alto: rectDeLaOpcion(TEXTOS_INF.grupos_lista.length - 1).y + 44 - EN_CFG.paraQuien,
	})),
	cargar: enElFotograma(holgado(enLaCascara(rectDeCargar()), 5)),
	imprimir: enElFotograma(holgado(enLaCascara(rectDeImprimir()), 6)),
	notaMatematicas: enElPlano(PLANO_MATEMATICAS, { x: DER_BLOQUE - 130, y: MATE - 3, ancho: 132, alto: H.materiaCabeza + 6 }),
	leyenda: enElPlano(PLANO_PIE, { x: 20, y: ARRIBA_LEYENDA - 4, ancho: HOJA.ancho - 32, alto: 20 }),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	informes: { x: 150, y: alturaEnMenu(MENU_DIRECTIVO, SECCION_INFORMES, null, null) + MEDIDAS.seccion / 2 },
	ficha: centro(enLaCascara(rectDeLaFicha(0))),
	select: centro(enLaCascara(rectDelSelect())),
	opcion: centro(enLaCascara(rectDeLaOpcion(TEXTOS_INF.grupos_lista.indexOf(GRUPO)))),
	cargar: centro(enLaCascara(rectDeCargar())),
	imprimir: centro(enLaCascara(rectDeImprimir())),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };
const EN_EL_BOLETIN = {
	ubicacion: 'Menú ▸ Informes ▸ Boletín del periodo',
	url: `/informes/boletines-periodo/${GRUPO_ID}/${PERIODO}`,
};

const PASO_FOCO: Omit<Paso, 'desde' | 'texto'>[] = [
	{ ...EN_EL_MENU, foco: FOCOS.informes, focoHasta: T.pulsaInformes + 16 },
	{ ...EN_INFORMES, foco: FOCOS.selector },
	{ ...EN_INFORMES, foco: FOCOS.ficha, focoHasta: T.pulsaFicha + 6 },
	{ ...EN_INFORMES, foco: FOCOS.configurador },
	{ ...EN_INFORMES, foco: FOCOS.cargar, focoHasta: T.carga - 4 },
	{ ...EN_EL_BOLETIN, foco: FOCOS.imprimir, focoHasta: T.seVaLaCascara - 6 },
	{ ...EN_EL_BOLETIN },
	{ ...EN_EL_BOLETIN, foco: FOCOS.notaMatematicas, focoHasta: T.alPie - 8 },
	{ ...EN_EL_BOLETIN, foco: FOCOS.leyenda },
];

export const PASOS: Paso[] = X.map((x, i) => ({ desde: D[i], ...x, ...PASO_FOCO[i] }));

export const CIERRE: Cierre = {
	hiciste: `Sacaste los boletines del periodo ${PERIODO} de ${GRUPO}.`,
	seVe: 'Una hoja por alumno; lo nivelado, tachado junto a la nota que quedó.',
	despues: 'Siguiente, 5 de 8: recuperación del año.',
};

/** La tarjeta dura lo que su voz, y nunca menos de cuatro segundos. */
const VOZ_TARJETA = segundosDeVoz(CIERRE.despues!);
export const DURACION = TARJETA + Math.max(120, VOZ_TARJETA === null ? 0 : RETRASO_VOZ + Math.ceil(VOZ_TARJETA * FPS) + 12);

export const CLAVE = 'cierre-4-boletines';

export const TITULO = 'Sacar los boletines del periodo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde: Informes' },
	{ desde: PASOS[1].desde, titulo: 'El periodo: el que tienes puesto arriba' },
	{ desde: PASOS[2].desde, titulo: 'Elegir el boletín y el grupo' },
	{ desde: T.entraLaHoja, titulo: 'La hoja, con lo nivelado tachado' },
];


compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Los números del rótulo salen de la hoja: si la hoja cambia, esto revienta antes que el vídeo mienta. */
if (!PASOS[7].texto.includes(`${M.original} tachado`) || !PASOS[7].texto.includes(`el ${M.nota} `)) {
	throw new Error('Guion: el rótulo de Matemáticas no dice los números de la hoja.');
}
/* Cada plano de la hoja tiene que estar quieto mientras su rótulo habla de él. */
if (T.aMatematicas + T.encadenado > PASOS[7].desde || T.alPie + T.encadenado > PASOS[8].desde || T.alPie < PASOS[7].desde) {
	throw new Error('Guion: un encadenado de la hoja cae encima de un rótulo que habla del plano.');
}
