import { enElFotograma } from '../encuadre';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, centro, foco, puntoDe, rectDelMenu } from '../comun-directivo/lugar';
import { rectAbrir, rectEstadoCuadrar, rectParrafoCuadrar } from '../horario/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * HORARIO: «CUADRAR EL HORARIO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **El salto lleva tu sesión, pero necesita el clic.** El botón abre `horarios.micolevirtual.com`
 *     con `window.open` y le pasa la sesión por `postMessage` (`cuadrar.ts`): no se vuelve a
 *     escribir la clave. Y hace falta pulsarlo porque el navegador no deja abrir una pestaña que no
 *     salga de un gesto; si aun así la bloquea, la pantalla lo dice con su aviso amarillo.
 *
 * La otra pestaña enseña el programa con la rejilla del clip promocional (`src/horarios`), que es
 * el mismo programa. El caso del bloqueo va con un corte: no se ven los dos en la misma pulsación.
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
	llegaAbrir: 250,
	pulsaAbrir: 262,
	/** `window.open` vuelve con la pestaña: «Se abrió la otra pestaña…». */
	esperando: 264,
	/** La pestaña nueva se pone delante. */
	pestana: 292,
	/** Y la rejilla del programa se monta dentro, ya con la sesión. */
	rejilla: 308,
	/** El «listo» del `postMessage` llega mientras se mira la otra. */
	entregado: 370,
	/** Se vuelve a la pestaña de MyVC. */
	vuelve: 442,
	seVa: 590,
	bloqueado: 612,
	cursorSale: 778,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Horario', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Horario ▸ Cuadrar el horario', url: '/horario/cuadrar' };
const ALLI = { ubicacion: 'Otra pestaña: el programa de horarios', url: 'horarios.micolevirtual.com' };

export const MENU_R = {
	horario: rectDelMenu('Horario', null, null),
	entrada: rectDelMenu('Horario', 'Cuadrar el horario', 'Horario'),
};

export const FOCOS = {
	horario: enElFotograma(MENU_R.horario),
	parrafo: foco(rectParrafoCuadrar(), 8),
	boton: foco(rectAbrir(false), 6),
	listo: foco(rectEstadoCuadrar(88), 6),
	bloqueado: foco(rectEstadoCuadrar(100), 6),
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	horario: puntoDe(MENU_R.horario),
	cuadrar: puntoDe(MENU_R.entrada),
	abrir: centro(rectAbrir(false)),
};

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Cuadrar sin instalar nada: Horario, Cuadrar el horario.', ...EN_EL_MENU, foco: FOCOS.horario, focoHasta: T.pulsaHor + 10 },
	{ desde: 160, texto: 'Se abre en otra pestaña con un clic: el navegador no las abre solo.', ...AQUI, foco: FOCOS.boton, focoHasta: T.pulsaAbrir + 6 },
	{ desde: 316, texto: 'La otra pestaña entra sola: no se vuelve a escribir la clave.', ...ALLI },
	{ desde: 458, texto: 'De vuelta aquí, el aviso verde dice que la sesión pasó.', ...AQUI, foco: FOCOS.listo, focoHasta: T.seVa - 6 },
	{ desde: 620, texto: 'Si el navegador la bloquea, se permiten sus ventanas y se pulsa otra vez.', ...AQUI, foco: FOCOS.bloqueado },
];

export const CORTE = { desde: T.seVa, hasta: T.bloqueado + 70, texto: 'Otra vez, con el navegador bloqueando ventanas' };

export const TARJETA = 788;
export const DURACION = 908;

export const CLAVE = 'horario-cuadrar';
export const TITULO = 'Cuadrar el horario';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Horario' },
	{ desde: 160, titulo: 'El clic y la otra pestaña' },
	{ desde: 590, titulo: 'Si el navegador la bloquea' },
];

export const CIERRE: Cierre = {
	hiciste: 'Abriste el programa de horarios en otra pestaña, ya con tu sesión.',
	seVe: 'Aquí sale «Listo: ya puedes cambiar a la otra pestaña».',
	despues: 'Siguiente: cuál de los horarios rige el colegio.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* La rejilla del programa lleva su propio puntero, que a los 458 de su reloj echa a andar hacia
 * «Generar»: la pestaña tiene que haberse ido antes, o se vería pulsar algo que el vídeo no cuenta. */
/* El rótulo «De vuelta aquí» (y su miga) llega cuando la otra pestaña ya se fue, no antes ni 30 fotogramas después. */
if (PASOS[3].desde < T.vuelve + 16) { throw new Error('Guion: «De vuelta aquí» sale con la otra pestaña aún delante.'); }
if (T.vuelve + 16 > T.rejilla + (458 - 250)) { throw new Error('Guion: la otra pestaña sigue delante cuando su puntero va a Generar.'); }
