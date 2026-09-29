import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import { IMPRIMIR_Y, INFORMES, LA_QUE_RIGE, LISTA, VERSIONES, rectBotonImprimir, rectCasillaInforme, rectContador, rectInforme, rectVer } from '../horario/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * HORARIO: «IMPRIMIR EL HORARIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, CONTRASTADA CON EL CÓDIGO
 *
 *     **Nada viene marcado** (`impresion.ts`: el mapa de marcados empieza vacío, y la prueba
 *     «no viene nada marcado» lo vigila), y abajo se van sumando las hojas.
 *
 *     El plan decía «13 grupos + 12 docentes = 34 hojas». La cuenta de `hojasDe()` da **25** con
 *     esos dos; el 34 de la prueba de referencia suma además 5 días de «El colegio entero», 3
 *     salones y 1 hoja de carga. El vídeo marca los dos primeros y enseña el 25.
 *
 *     Y UNA SORPRESA: ningún botón lleva aquí. La ruta dice que se entra por un botón de la
 *     versión, pero `version.html` no lo tiene (el único `imprimir` del front es la ruta). Hoy se
 *     llega **escribiendo /imprimir** detrás de la dirección de la versión, y así lo enseña el vídeo.
 */

export const FPS = 30;

export const T = {
	cursorEntra: 20,
	llegaHor: 50,
	pulsaHor: 56,
	abreHor: 58,
	llegaEntrada: 100,
	pulsaEntrada: 110,
	monta: 114,
	llegaVer: 220,
	pulsaVer: 232,
	seVaLista: 232,
	montaVersion: 252,
	barra: 292,
	teclea: 310,
	intro: 350,
	seVaVersion: 356,
	montaImprimir: 376,
	llegaGrupo: 500,
	pulsaGrupo: 512,
	llegaDocente: 580,
	pulsaDocente: 592,
	llegaImprimir: 802,
	pulsaImprimir: 814,
	cursorSale: 920,
};

const V = VERSIONES[LA_QUE_RIGE];
const EN_EL_MENU = { ubicacion: 'Menú ▸ Horario', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_LISTA = { ubicacion: 'Menú ▸ Horario ▸ El horario del colegio', url: '/horario' };
const EN_LA_VERSION = { ubicacion: 'Menú ▸ Horario ▸ El horario del colegio ▸ Versión', url: `/horario/${V.id}` };
const AQUI = { ubicacion: 'Menú ▸ Horario ▸ El horario del colegio ▸ Versión ▸ Imprimir', url: `/horario/${V.id}/imprimir` };

export const DIRECCION = { base: `micolegio.micolevirtual.com/up2/horario/${V.id}`, tramo: '/imprimir' };

export const MENU_R = {
	horario: rectDelMenu('Horario', null, null),
	entrada: rectDelMenu('Horario', 'El horario del colegio', 'Horario'),
};

const GRUPO = INFORMES.findIndex((i) => i.clave === 'grupo');
const DOCENTE = INFORMES.findIndex((i) => i.clave === 'docente');

const todos = () => {
	const a = rectInforme(0);
	const b = rectInforme(3);
	return { x: a.x, y: a.y, ancho: a.ancho, alto: b.y + b.alto - a.y };
};

export const FOCOS = {
	horario: enElFotograma(MENU_R.horario),
	ver: foco(rectVer(LA_QUE_RIGE, true), 6),
	lista: foco(todos(), 6),
	grupo: foco(rectInforme(GRUPO, { grupo: 1 }), 4),
	contador: foco(rectContador(), 8),
	subtitulo: foco({ x: LISTA.x, y: IMPRIMIR_Y.subtitulo, ancho: 560, alto: 22 }, 8),
	imprimir: foco(rectBotonImprimir(), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	horario: puntoDe(MENU_R.horario),
	lista: puntoDe(MENU_R.entrada),
	ver: centro(rectVer(LA_QUE_RIGE, true)),
	grupo: { x: rectCasillaInforme(GRUPO).x + 8, y: centro(rectCasillaInforme(GRUPO)).y },
	docente: { x: rectCasillaInforme(DOCENTE, { grupo: 1 }).x + 8, y: centro(rectCasillaInforme(DOCENTE, { grupo: 1 })).y },
	imprimir: centro(rectBotonImprimir()),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Para imprimir: Horario, y se abre la versión.', ...EN_EL_MENU, foco: FOCOS.horario, focoHasta: T.pulsaHor + 10 },
	{ desde: 138, texto: 'Aquí, la que rige: Ver el horario.', ...EN_LA_LISTA, foco: FOCOS.ver, focoHasta: T.pulsaVer + 6 },
	{ desde: 252, texto: 'Sin botón: se añade /imprimir a la dirección.', voz: 'Sin botón: se añade barra imprimir a la dirección.', ...EN_LA_VERSION },
	{ desde: 381, texto: 'Nada viene marcado: se elige qué informes salen.', ...AQUI, foco: FOCOS.lista, focoHasta: T.llegaGrupo - 8 },
	{ desde: 506, texto: 'Por grupo, trece hojas; por docente, doce: 25 en total.', ...AQUI, foco: FOCOS.grupo, focoHasta: T.llegaDocente - 8 },
	{ desde: 691, texto: 'Cada hoja dice su versión, y avisa si no rige.', ...AQUI, foco: FOCOS.subtitulo },
	{ desde: 816, texto: 'Se imprime en carta, horizontal.', ...AQUI, foco: FOCOS.imprimir },
];

export const CORTE = { desde: T.pulsaImprimir + 16, hasta: T.pulsaImprimir + 110, texto: 'Aquí se abre la ventana de impresión del navegador' };

export const TARJETA = 930;
export const DURACION = 1050;

export const CLAVE = 'horario-imprimir';
export const TITULO = 'Imprimir el horario';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la versión, en Horario' },
	{ desde: 252, titulo: 'La dirección, con /imprimir' },
	{ desde: 381, titulo: 'Elegir los informes y contar hojas' },
	{ desde: 691, titulo: 'Qué dice cada hoja' },
];

export const CIERRE: Cierre = {
	hiciste: 'Marcaste el horario por grupo y por docente para imprimir.',
	seVe: 'Abajo, el contador: «25 hojas de papel».',
};

compruebaElGuion(PASOS, FPS, TARJETA);
/* La miga «▸ Versión» llega con la pantalla de la versión, no 50 fotogramas después. */
if (PASOS[2].desde < T.montaVersion || PASOS[2].desde > T.montaVersion + 6) { throw new Error('Guion: el rótulo de la dirección no llega con la versión.'); }
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.montaVersion < T.seVaLista + 17 || T.montaImprimir < T.seVaVersion + 17) { throw new Error('Guion: una pantalla se monta antes de que la anterior se vaya entera.'); }
if (T.teclea + DIRECCION.tramo.length * 4 >= T.intro) { throw new Error('Guion: se pulsa Intro antes de acabar de escribir.'); }
