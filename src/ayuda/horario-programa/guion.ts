import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import { rectAvisoPrograma, rectBotonDescarga, rectDescarga, rectIntroPrograma, rectViñeta } from '../horario/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * HORARIO: «DESCARGAR EL PROGRAMA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Un aviso aquí es «la carpeta no está montada», no una avería.** La pantalla pide
 *     `…/descargas/horarios/ultima.json`; si contesta 404 o 403, sale el aviso azul «Todavía no hay
 *     ninguna versión publicada en este colegio» (`programa.html`, estado `sinPublicar`). Con sus
 *     palabras: a este colegio aún no le han subido la carpeta de descargas. No hay nada que hacer.
 *
 * Para enseñar los dos estados sin mentir, el segundo va con un corte que dice que es **otro
 * colegio**: en uno mismo no se ven los dos a la vez.
 *
 * Se queda en 28 s: la pantalla sólo lee y no hay nada que teclear.
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
	llegaDescarga: 290,
	sueltaDescarga: 370,
	/** El corte a la misma pantalla sin la carpeta de descargas: la página se va entera y vuelve con el aviso. */
	seVa: 510,
	vuelve: 532,
	cursorSale: 540,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Horario', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Horario ▸ Descargar el programa', url: '/horario/programa' };

export const MENU_R = {
	horario: rectDelMenu('Horario', null, null),
	entrada: rectDelMenu('Horario', 'Descargar el programa', 'Horario'),
};

export const FOCOS = {
	horario: enElFotograma(MENU_R.horario),
	intro: foco(rectIntroPrograma(), 8),
	primera: foco(rectDescarga(0), 4),
	licencia: foco(rectViñeta(2), 8),
	aviso: foco(rectAvisoPrograma(), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	horario: puntoDe(MENU_R.horario),
	programa: puntoDe(MENU_R.entrada),
	descarga: centro(rectBotonDescarga(0)),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El programa de horarios se descarga desde Horario.', ...EN_EL_MENU, foco: FOCOS.horario, focoHasta: T.pulsaHor + 10 },
	{ desde: 130, texto: 'Se instala en el computador: aquí sólo se descarga.', ...AQUI, foco: FOCOS.intro },
	{ desde: 260, texto: 'El primero es el de este computador: el que toca.', ...AQUI, foco: FOCOS.primera },
	{ desde: 378, texto: 'Cuadrar e imprimir van solos; subirlo a MyVC pide licencia.', voz: 'Cuadrar e imprimir van solos; subirlo a la plataforma pide licencia.', ...AQUI, foco: FOCOS.licencia, focoHasta: T.seVa - 6 },
	{ desde: 540, texto: 'Si sale este aviso, no es avería: la carpeta llega con una actualización.', ...AQUI, foco: FOCOS.aviso },
];

export const CORTE = { desde: T.seVa, hasta: T.vuelve + 70, texto: 'Si aún no han subido la carpeta de descargas' };

export const TARJETA = 716;
export const DURACION = 836;

export const CLAVE = 'horario-programa';
export const TITULO = 'Descargar el programa';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Horario' },
	{ desde: 260, titulo: 'Cuál descargar' },
	{ desde: 510, titulo: 'Si sale el aviso azul' },
];

export const CIERRE: Cierre = {
	hiciste: 'Encontraste la descarga del programa de horarios.',
	seVe: 'El botón que dice «es el de este computador», el primero.',
	despues: 'Siguiente: cuadrar el horario sin instalar nada.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[4].desde < T.vuelve + 8) { throw new Error('Guion: el paso 5 señala el aviso antes de que la página vuelva.'); }
