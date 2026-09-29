import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { BOTONES_DEL_PIE, DISCIPLINA, botonDelPie, pieSinGrupo, selectorSinGrupo } from '../disciplina/datos';
import type { TiemposDeLlegada } from '../disciplina/Llegada';
import { PUNTOS_LLEGADA } from '../disciplina/Llegada';
import { CONTROLES, EN_LA_HOJA, FLECHA_ARRIBA, HOJA, IMPRIMIR, MARGEN_IZQUIERDO, MARGEN_NUEVO, MARGEN_SUPERIOR, X_HOJA, Y_HOJA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DOCENTE: «EL OBSERVADOR DEL GRUPO».
 *
 * LAS DOS DUDAS QUE MATA, las dos del código:
 *   1. **Abrirlo escribe en la base.** La página hace un PUT a `comportamiento/observador-completo`
 *      al cargar, y el backend (`ComportamientoController::putObservadorCompleto`) crea la fila del
 *      libro rojo de todo alumno que no la tenga («El libro rojo se creó al abrir el observador»).
 *   2. **Los márgenes se ajustan antes de imprimir, y no se guardan.** Son dos números en píxeles
 *      (150 y 200) que corren el contenido sobre la imagen de fondo; no son los del papel, y al
 *      volver a abrir la página vuelven a 150 y 200.
 *
 * Y la de siempre: sin grupo elegido, los botones del observador **no están** (no salen apagados).
 *
 * TRES ACTOS: la llegada (con la parada en el pie sin grupo), la rejilla con sus tres botones, y la
 * pestaña nueva con la hoja y los márgenes.
 */

export const FPS = 30;

export const LLEGADA: TiemposDeLlegada = {
	cursorEntra: 14,
	llegaSeccion: 40,
	pulsaSeccion: 46,
	llegaEntrada: 90,
	pulsaEntrada: 100,
	montaPagina: 104,
	llegaGrupo: 210,
	pulsaGrupo: 222,
	seVaLaCascara: 232,
	entraLaRejilla: 262,
	pausas: [
		{ frame: 135, x: 700, y: 480 },
		{ frame: 170, x: 700, y: 480 },
	],
};

export const OBSERVADOR = {
	llegaBoton: 368,
	pulsaBoton: 384,
	seVaLaRejilla: 390,
	monta: 440,
	carga: 480,
	llegaMargen: 776,
	clics: [796, 812, 828],
	sueltaMargen: 864,
	llegaImprimir: 1065,
	pulsaImprimir: 1085,
};

/** El margen superior en cada fotograma: 150, y diez más a cada clic de la flecha. */
export function margenEn(frame: number): number {
	const n = OBSERVADOR.clics.filter((c) => frame >= c).length;
	return MARGEN_SUPERIOR + n * 10;
}

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
const aire = (r: { x: number; y: number; ancho: number; alto: number }, a = 6) => ({ x: r.x - a, y: r.y - a, ancho: r.ancho + a * 2, alto: r.alto + a * 2 });

const Y_SECCION = alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null);
const OBS = BOTONES_DEL_PIE.indexOf('Observador completo');
const tresBotones = (() => { const a = botonDelPie(1); const b = botonDelPie(3); return { x: a.x, y: a.y, ancho: b.x + b.ancho - a.x, alto: a.alto }; })();
const margenes = { x: CONTROLES.superior.x, y: CONTROLES.superior.y - 26, ancho: CONTROLES.izquierdo.x + CONTROLES.izquierdo.ancho - CONTROLES.superior.x, alto: CONTROLES.superior.alto + 26 };

export const FOCOS = {
	/*
	 * Sólo la sección «Disciplina»: un recuadro del alto de sus hijas, encendido antes de que se
	 * desplieguen, cubría Compromisos…Configuración. Se apaga al desplegarse.
	 */
	disciplina: enElFotograma({ x: 0, y: Y_SECCION, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	pieSinGrupo: enElFotograma(pieSinGrupo()),
	selector: enElFotograma(selectorSinGrupo()),
	tresBotones: aire(tresBotones),
	completo: aire(botonDelPie(OBS)),
	hoja: aire({ x: X_HOJA + MARGEN_IZQUIERDO - 10, y: Y_HOJA + MARGEN_SUPERIOR + EN_LA_HOJA.paneles - 6, ancho: HOJA.ancho - MARGEN_IZQUIERDO - 20, alto: EN_LA_HOJA.fallas + EN_LA_HOJA.fallasAlto - EN_LA_HOJA.paneles + 12 }, 2),
	margenes: aire(margenes),
	imprimir: aire(IMPRIMIR),
};

export const PUNTOS = {
	completo: centro(botonDelPie(OBS)),
	flecha: centro(FLECHA_ARRIBA),
	imprimir: centro(IMPRIMIR),
	grupo: PUNTOS_LLEGADA.grupo,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const EN_DISCIPLINA = { ubicacion: 'Menú ▸ Disciplina ▸ Disciplina', url: '/disciplina' };
const EN_EL_OBSERVADOR = { ubicacion: 'Disciplina ▸ Observador completo (otra pestaña)', url: '/disciplina/observador-completo/318' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El observador se abre desde Disciplina.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 22 },
	{ desde: 115, texto: 'Sin grupo no hay observadores: elige el tuyo arriba.', ...EN_DISCIPLINA, foco: FOCOS.selector, focoHasta: LLEGADA.seVaLaCascara - 6 },
	{ desde: 262, texto: 'Abajo, sus botones: por periodo o el año, en otra pestaña.', ...EN_DISCIPLINA, foco: FOCOS.tresBotones, focoHasta: OBSERVADOR.pulsaBoton },
	{ desde: OBSERVADOR.monta, texto: 'Abrirlo crea el libro rojo de quien no lo tenga.', ...EN_EL_OBSERVADOR },
	{ desde: 551, texto: 'Cada hoja: convivencia, académico, y fallas y situaciones.', ...EN_EL_OBSERVADOR, foco: FOCOS.hoja },
	{ desde: 726, texto: 'Antes de imprimir, los márgenes mueven el texto sobre el membrete.', ...EN_EL_OBSERVADOR, foco: FOCOS.margenes, focoHasta: OBSERVADOR.clics[0] - 4 },
	{ desde: 875, texto: `No se guardan: al reabrirlo vuelven a ${MARGEN_SUPERIOR} y ${MARGEN_IZQUIERDO}.`, ...EN_EL_OBSERVADOR, foco: FOCOS.margenes },
	{ desde: 1031, texto: 'Una hoja por alumno; Imprimir abre el diálogo del navegador.', ...EN_EL_OBSERVADOR, foco: FOCOS.imprimir },
];

export const TARJETA = 1172;
export const DURACION = 1292;

export const CLAVE = 'docente-observador';
export const TITULO = 'El observador del grupo';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, y el grupo' },
	{ desde: 262, titulo: 'Los botones del observador' },
	{ desde: OBSERVADOR.monta, titulo: 'Abrirlo escribe en la base' },
	{ desde: 726, titulo: 'Los márgenes, antes de imprimir' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste el observador completo de tu grupo y subiste el margen superior.',
	seVe: `El texto baja sobre el membrete; el margen dice ${MARGEN_NUEVO} hasta que cierres la pestaña.`,
	despues: 'Antes de imprimir otra vez, revisa los márgenes: vuelven a 150 y 200.',
	voz: 'Antes de imprimir, revisa los márgenes.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (margenEn(OBSERVADOR.sueltaMargen) !== MARGEN_NUEVO) { throw new Error('Guion: los clics de la flecha no llegan al margen nuevo.'); }
