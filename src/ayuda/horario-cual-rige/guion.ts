import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, MAIN, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import {
	LA_NUEVA, LA_QUE_RIGE, VERSIONES, VERSION_Y, rectAvisoVersion, rectCabeza, rectConfirmar, rectNoPublicar, rectPublicar, rectVer, rectVersion,
	rectVolver,
} from '../horario/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * HORARIO: «CUÁL HORARIO RIGE».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, CONTRASTADA CON EL CÓDIGO
 *
 *     **Subir no es publicar** (`horario.ts`, la frase está escrita tal cual). El plan decía que un
 *     borrador y el oficial «se pintan igual»; hoy ya no: en la lista la que rige lleva la etiqueta
 *     verde «Rige el colegio» y un borde de color a la izquierda (`horario.scss`), y dentro de un
 *     borrador sale el aviso amarillo «Esto es un borrador: no rige el colegio». Lo que SIGUE
 *     confundiendo es la etiqueta gris «La más reciente»: la última subida no es la que rige.
 *
 *     Publicar se hace desde la fila (desde el 4 sep; antes sólo leía), con una caja que avisa de lo
 *     que reescribe. Aquí se abre y se cierra con «No publicar»: el vídeo no publica nada.
 *
 * ⚠ La pantalla de la versión todavía dice «publicar se hace desde el programa de escritorio»: se
 * enseña tal cual, pero el rótulo no lo repite.
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
	llegaVer: 500,
	pulsaVer: 512,
	seVaLista: 512,
	montaVersion: 532,
	llegaVolver: 650,
	pulsaVolver: 662,
	seVaVersion: 662,
	montaLista: 682,
	llegaPublicar: 740,
	pulsaPublicar: 752,
	abreConfirmar: 754,
	llegaNo: 1000,
	pulsaNo: 1012,
	cierraConfirmar: 1014,
	cursorSale: 1050,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Horario', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Horario ▸ El horario del colegio', url: '/horario' };
const EN_LA_VERSION = { ubicacion: 'Menú ▸ Horario ▸ El horario del colegio ▸ Versión', url: `/horario/${VERSIONES[LA_NUEVA].id}` };

export const MENU_R = {
	horario: rectDelMenu('Horario', null, null),
	entrada: rectDelMenu('Horario', 'El horario del colegio', 'Horario'),
};

const todas = () => {
	const a = rectVersion(0);
	const b = rectVersion(VERSIONES.length - 1);
	return { x: a.x, y: a.y, ancho: a.ancho, alto: b.y + b.alto - a.y };
};

export const FOCOS = {
	horario: enElFotograma(MENU_R.horario),
	lista: foco(todas(), 6),
	rige: foco(rectVersion(LA_QUE_RIGE), 6),
	nueva: foco(rectCabeza(LA_NUEVA), 4),
	aviso: foco(rectAvisoVersion(), 6),
	parrilla: foco({ x: MAIN.x, y: VERSION_Y.parrilla + 48, ancho: MAIN.ancho, alto: 258 }, 4),
	publicar: foco(rectPublicar(LA_NUEVA), 6),
	confirmar: foco(rectConfirmar(), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	horario: puntoDe(MENU_R.horario),
	lista: puntoDe(MENU_R.entrada),
	ver: centro(rectVer(LA_NUEVA, true)),
	volver: centro(rectVolver()),
	publicar: centro(rectPublicar(LA_NUEVA)),
	no: centro(rectNoPublicar()),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Qué horario rige: Horario, El horario del colegio.', ...EN_EL_MENU, foco: FOCOS.horario, focoHasta: T.pulsaHor + 10 },
	{ desde: 150, texto: 'Cada subida es una versión: subir no es publicar.', ...AQUI, foco: FOCOS.lista },
	{ desde: 276, texto: 'La que rige lleva «Rige el colegio» y borde de color.', ...AQUI, foco: FOCOS.rige },
	{ desde: 416, texto: 'La más reciente sólo es la última subida.', ...AQUI, foco: FOCOS.nueva, focoHasta: T.llegaVer - 8 },
	{ desde: 540, texto: 'Un borrador lo avisa arriba: no rige el colegio.', ...EN_LA_VERSION, foco: FOCOS.aviso, focoHasta: T.llegaVolver - 8 },
	{ desde: 680, texto: 'Para que rija, se publica desde su fila.', ...AQUI, foco: FOCOS.publicar, focoHasta: T.pulsaPublicar + 6 },
	{ desde: 796, texto: 'Publicar reescribe los días de clase de todas las asignaturas.', ...AQUI, foco: FOCOS.confirmar },
	{ desde: 935, texto: 'Publica un superusuario o el rol Coord académico.', voz: 'Publica un superusuario o el rol de coordinador académico.', ...AQUI },
];

export const TARJETA = 1075;
export const DURACION = 1195;

export const CLAVE = 'horario-cual-rige';
export const TITULO = 'Cuál horario rige';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Horario' },
	{ desde: 276, titulo: 'La que rige y la más reciente' },
	{ desde: 500, titulo: 'Un borrador, por dentro' },
	{ desde: 680, titulo: 'Publicar, desde su fila' },
];

export const CIERRE: Cierre = {
	hiciste: 'Viste cuál rige, abriste un borrador y dónde se publica.',
	seVe: 'La fila con «Rige el colegio» y el borde de color.',
	despues: 'Siguiente: imprimir el horario.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.montaVersion < T.seVaLista + 17 || T.montaLista < T.seVaVersion + 17) { throw new Error('Guion: una pantalla se monta antes de que la anterior se vaya entera.'); }
if (PASOS[6].desde < T.abreConfirmar + 14) { throw new Error('Guion: el paso 7 señala la caja antes de que se abra.'); }
