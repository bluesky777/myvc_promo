import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, centro, crece, foco, puntoDelMenu, rectDelMenu } from '../personas/comun';
import {
	ALTO_ELEGIR,
	ALTO_REVISADO,
	FILAS_TOTALES,
	GRUPO1,
	INTRO,
	NOTA2,
	GRUPO2,
	PIE_ELEGIR,
	PIE_REVISADO,
	POR_DOCUMENTO,
	REVISADO,
	SE_QUEDA,
	SE_VACIA,
	rectFichaRadio,
	rectPie,
	rectUnir,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «ALUMNOS DUPLICADOS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     1. **«Ver qué se movería» no escribe.** Llama a `revisarFusion(origen, destino)` y pinta lo
 *        que contesta: filas por tabla, la cuenta con la que entrará, y el aviso rojo
 *        (`unir-fichas.ts`, paso «revisado»). Lo que escribe es «Unir las fichas», el botón de
 *        después, y el vídeo **no lo pulsa**.
 *     2. **Unir no se deshace y lo hace un superusuario.** El aviso rojo lo dice en la propia
 *        pantalla («Esto no se deshace solo»), y la ruta lo deja escrito: «unir dos fichas exige
 *        superusuario en el backend: revisar es de secretaría» (`app.routes.ts`, `duplicados`).
 *        Por eso el último paso va en cartel rojo y se queda un segundo más.
 *
 * Y la que llega antes que ninguna: **esto no es un fallo del sistema**. El párrafo de arriba de la
 * pantalla lo dice («El documento no es único en la base, y no puede serlo»), y es por donde se
 * empieza. Luego los dos bloques: mismo documento (casi seguro la misma persona) y mismo nombre
 * con otro documento (pueden ser hermanos).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   Personas -> Alumnos duplicados; el porqué, en el párrafo
 *     2. LA LISTA     los dos bloques, con sus fichas y su historial
 *     3. UNIR         cuál se queda, «Ver qué se movería», y el botón que no se pulsa
 *
 * NO SE DICE EL MENSAJE QUE RECIBE UNA SECRETARIA AL PULSAR «UNIR LAS FICHAS»: el front lo pinta
 * como «No se pudo unir: …» con el texto del servidor, y ese texto no está a la vista. El vídeo
 * dice sólo lo que la ruta deja escrito: que el servidor lo exige.
 */

export const FPS = 30;
const MENU = MENU_DIRECTIVO;

export const T = {
	...LLEGADA,
	/* La llegada por el menú, más corta que la de `LLEGADA`: trayectos de 20 fotogramas. */
	cursorEntra: 12,
	llegaPersonas: 34,
	pulsaPersonas: 40,
	abrePersonas: 42,
	llegaEntrada: 62,
	pulsaEntrada: 72,
	monta: 76,
	llegaUnir: 520,
	pulsaUnir: 530,
	abreDialogo: 532,
	llegaRadio: 560,
	pulsaRadio: 570,
	llegaVer: 625,
	pulsaVer: 640,
	/** «Mirando qué habría que mover…»: la revisión va y vuelve. */
	revisado: 675,
	llegaUnirFichas: 930,
	cursorSale: 1038,
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	duplicados: puntoDelMenu(MENU, 'Alumnos duplicados', true),
	unir: centro(rectUnir(GRUPO1)),
	radio: { x: rectFichaRadio(SE_QUEDA).x + 19, y: rectFichaRadio(SE_QUEDA).y + 38 },
	ver: centro(rectPie(ALTO_ELEGIR, PIE_ELEGIR, 1)),
	unirFichas: centro(rectPie(ALTO_REVISADO, PIE_REVISADO, 1)),
};

const r = REVISADO;
export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	intro: foco(crece(INTRO, 10), 10),
	grupo1: foco(crece(GRUPO1, 6), 10),
	nota2: foco(crece({ x: NOTA2.x, y: NOTA2.y, ancho: GRUPO2.ancho, alto: GRUPO2.y + GRUPO2.alto - NOTA2.y }, 6), 10),
	unir: foco(crece(rectUnir(GRUPO1), 6), 8),
	fichas: foco(crece({ ...rectFichaRadio(0), alto: rectFichaRadio(1).y + rectFichaRadio(1).alto - rectFichaRadio(0).y }, 6), 10),
	ver: foco(crece(rectPie(ALTO_ELEGIR, PIE_ELEGIR, 1), 6), 8),
	cifra: foco(crece({ ...r.cifra, alto: r.tablas.y + r.tablas.alto - r.cifra.y }, 6), 10),
	cuenta: foco(crece(r.cuenta, 6), 8),
	peligro: foco(crece({ x: r.peligro.x, y: r.peligro.y, ancho: r.peligro.ancho, alto: rectPie(ALTO_REVISADO, PIE_REVISADO, 1).y + 32 - r.peligro.y }, 8), 10),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_DUPLICADOS = { ubicacion: 'Menú ▸ Personas ▸ Alumnos duplicados', url: '/duplicados' };

export const PASOS: Paso[] = [
	{ desde: 7, texto: 'Los duplicados están en Personas.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 104, texto: 'No es un fallo: el documento no es único.', ...EN_DUPLICADOS, foco: FOCOS.intro },
	{ desde: 220, texto: 'Mismo documento: casi seguro, la misma persona.', ...EN_DUPLICADOS, foco: FOCOS.grupo1 },
	{ desde: 360, texto: 'Mismo nombre, otro documento: pueden ser hermanos.', ...EN_DUPLICADOS, foco: FOCOS.nota2 },
	{ desde: 496, texto: 'Unir: primero eliges qué ficha se queda.', ...EN_DUPLICADOS, foco: FOCOS.unir, focoHasta: T.pulsaUnir - 2 },
	{ desde: 607, texto: 'Ver qué se movería no escribe nada.', ...EN_DUPLICADOS, foco: FOCOS.ver, focoHasta: T.pulsaVer - 2 },
	{ desde: 699, texto: 'Cuántas filas pasan, tabla por tabla.', ...EN_DUPLICADOS, foco: FOCOS.cifra },
	{ desde: 812, texto: 'Y con qué usuario entrará el alumno.', ...EN_DUPLICADOS, foco: FOCOS.cuenta },
	{ desde: 903, texto: 'Unir no se deshace: revisa antes cuál ficha se queda.', ...EN_DUPLICADOS, foco: FOCOS.peligro, rojo: true },
];

export const TARJETA = 1068;
export const DURACION = TARJETA + 120;

export const CLAVE = 'duplicados';
export const TITULO = 'Alumnos duplicados';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está, y por qué pasa' },
	{ desde: 220, titulo: 'Los dos bloques de la lista' },
	{ desde: 496, titulo: 'Unir: cuál se queda' },
	{ desde: 607, titulo: 'Ver qué se movería' },
	{ desde: 903, titulo: 'Lo que no se deshace' },
];

const vacia = POR_DOCUMENTO.fichas[SE_VACIA];
export const CIERRE: Cierre = {
	hiciste: 'Revisaste qué movería unir las dos fichas de Samuel, sin escribir nada.',
	seVe: `El diálogo dice «${FILAS_TOTALES} filas se mueven» y que la ficha de ${vacia.ultimoYear} irá a la papelera.`,
	despues: 'Siguiente: importar de Excel, hojas y columnas.',
	voz: 'Siguiente: importar de Excel.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.revisado >= PASOS[6].desde) {
	throw new Error('Guion: la revisión vuelve después del paso que la explica.');
}
