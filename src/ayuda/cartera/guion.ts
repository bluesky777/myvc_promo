import { enElFotograma } from '../encuadre';
import { MENU_DIRECTIVO } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ENTRADA_DEL_PUNTERO, LLEGADA, centro, crece, foco, puntoDelMenu, rectDelMenu } from '../personas/comun';
import { BARRA, EL_GRUPO, LOS_QUE_PAGAN, MARCADOS, REJILLA, RESUMEN, SELECTOR, ENLACE_DEUDORES, rectBotonCabecera, rectCelda, rectColumnas, rectOpcion, resumen, filasEn } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * SECRETARÍA: «CARTERA».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     1. **Marca alumnos y aparecen las acciones.** La barra de arriba de la rejilla dice
 *        «Marca alumnos con la casilla y aquí aparecerán las acciones» y hasta que no se marca
 *        uno no hay ningún botón (`cartera.html`, `.marcados`).
 *     2. **El estado de cuenta real no vive en MyVC.** La cartera guarda tres datos por alumno
 *        --paz y salvo, deuda y «Pagada hasta»-- que alguien escribe a mano o sube con «Subir
 *        cambios (Excel)». No hay pagos, ni abonos, ni recibos: el vídeo lo dice así, con lo que
 *        la pantalla tiene y no con lo que no se ve.
 *
 * Y la que sale de mirar `cambiarVarios` (`cartera.ts`): **cada botón cambia UNA columna**
 * (`alumnos/guardar-valor-varios` con una sola `propiedad`). «Poner a paz y salvo» no toca la
 * deuda: el total del pie no se mueve hasta «Cambiar la deuda». El vídeo lo enseña con los dos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA     Personas -> Cartera; sin grupo no pide nada
 *     2. EL GRUPO       se elige 8°A y llega la rejilla
 *     3. LO MARCADO     dos casillas; paz y salvo; y la deuda, aparte
 *
 * EL RITMO: el PUT de `guardar-valor-varios` va y vuelve en medio segundo (15 fotogramas) y el
 * aviso sale entonces, **donde empieza el paso que lo explica** (puertas de abajo).
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
	llegaSelector: 112,
	pulsaSelector: 122,
	abreSelector: 124,
	llegaOpcion: 140,
	pulsaOpcion: 152,
	cierraSelector: 154,
	/** La lista llega en medio segundo y las filas caen. */
	llegaLaLista: 166,
	llenaLaLista: 190,
	llegaCasilla1: 362,
	pulsaCasilla1: 370,
	llegaCasilla2: 388,
	pulsaCasilla2: 396,
	llegaPaz: 432,
	pulsaPaz: 447,
	/** + 15: la ida y vuelta. */
	avisoPaz: 462,
	llegaDeuda: 616,
	pulsaDeuda: 624,
	teclea: 636,
	llegaCambiarDeuda: 660,
	pulsaCambiarDeuda: 695,
	avisoDeuda: 710,
	llegaSubir: 810,
	cursorSale: 1072,
};

export const PUNTOS = {
	entrada: ENTRADA_DEL_PUNTERO,
	personas: puntoDelMenu(MENU, null, false),
	cartera: puntoDelMenu(MENU, 'Cartera', true),
	selector: { x: SELECTOR.x + 160, y: SELECTOR.y + 16 },
	opcion: { x: rectOpcion(EL_GRUPO).x + 80, y: rectOpcion(EL_GRUPO).y + 24 },
	casilla1: centro(rectCelda(LOS_QUE_PAGAN[0], 'sel')),
	casilla2: centro(rectCelda(LOS_QUE_PAGAN[1], 'sel')),
	paz: centro(BARRA.paz),
	deuda: { x: BARRA.deuda.x + 40, y: BARRA.deuda.y + 15 },
	cambiarDeuda: centro(BARRA.cambiarDeuda),
	subir: centro(rectBotonCabecera(0, true)),
};

export const FOCOS = {
	personas: foco(rectDelMenu(MENU, null, false), 8),
	grupo: foco(crece({ x: SELECTOR.x, y: SELECTOR.y, ancho: ENLACE_DEUDORES.x + ENLACE_DEUDORES.ancho - SELECTOR.x, alto: 32 }, 8), 10),
	columnas: foco(crece(rectColumnas('paz', 'pagada'), 2), 8),
	casillas: foco(crece(rectColumnas('sel', 'sel'), 2), 8),
	marcados: foco(crece(MARCADOS, 4), 8),
	pieYPaz: foco(crece(RESUMEN, 8), 10),
	barraDeuda: foco(crece({ x: BARRA.deuda.x, y: BARRA.deuda.y, ancho: BARRA.cambiarDeuda.x + BARRA.cambiarDeuda.ancho - BARRA.deuda.x, alto: 30 }, 6), 8),
	subir: foco(crece(rectBotonCabecera(0, true), 6), 10),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Personas', url: 'micolegio.micolevirtual.com/up2/' };
const EN_CARTERA = { ubicacion: 'Menú ▸ Personas ▸ Cartera', url: '/cartera' };

export const PASOS: Paso[] = [
	{ desde: 7, texto: 'La cartera está en Personas.', ...EN_EL_MENU, foco: FOCOS.personas, focoHasta: T.pulsaPersonas + 16 },
	{ desde: 94, texto: 'Elige un grupo, o todos los deudores.', ...EN_CARTERA, foco: FOCOS.grupo, focoHasta: T.pulsaSelector - 4 },
	{ desde: 204, texto: 'Por alumno: paz y salvo, deuda y fecha pagada.', ...EN_CARTERA, foco: FOCOS.columnas },
	{ desde: 342, texto: 'Marca los que pagaron: Poner a paz y salvo.', ...EN_CARTERA, foco: FOCOS.casillas, focoHasta: T.pulsaCasilla2 + 12 },
	{ desde: T.avisoPaz, texto: 'Bajan los deudores, pero la deuda total sigue igual.', ...EN_CARTERA, foco: FOCOS.pieYPaz },
	{ desde: 596, texto: 'La deuda va aparte: Cambiar la deuda.', ...EN_CARTERA, foco: FOCOS.barraDeuda, focoHasta: T.pulsaCambiarDeuda - 4 },
	{ desde: T.avisoDeuda, texto: 'Ahora sí baja el total.', ...EN_CARTERA, foco: FOCOS.pieYPaz },
	{ desde: 789, texto: 'MyVC no lleva pagos.', ...EN_CARTERA, foco: FOCOS.subir },
	{
		desde: 875,
		texto: 'Antes de subir el Excel, revisa la columna de paz y salvo.',
		voz: 'Antes de subir el Excel, revisa la paz y salvo: sin un sí, el acudiente no ve el boletín.',
		...EN_CARTERA,
		foco: FOCOS.subir,
	},
];

export const AVISO_PAZ = { desde: T.avisoPaz, dura: PASOS[5].desde - T.avisoPaz - 30 };
export const AVISO_DEUDA = { desde: T.avisoDeuda, dura: PASOS[7].desde - T.avisoDeuda - 30 };

export const TARJETA = 1086;
export const DURACION = TARJETA + 120;

export const CLAVE = 'cartera';
export const TITULO = 'Cartera';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Personas, Cartera' },
	{ desde: 94, titulo: 'Elegir el grupo' },
	{ desde: 342, titulo: 'Marcar alumnos y aplicar' },
	{ desde: 596, titulo: 'La deuda, aparte' },
	{ desde: 789, titulo: 'Lo que MyVC no lleva' },
	{ desde: 875, titulo: 'Antes de subir el Excel' },
]

const antes = resumen(filasEn(false, false));
const despues = resumen(filasEn(true, true));

export const CIERRE: Cierre = {
	hiciste: 'Pusiste a paz y salvo a dos alumnos de 8°A y les dejaste la deuda en 0.',
	seVe: `Sale «2 alumno(s) actualizados.», y el pie pasa de ${antes.deudores} deudores a ${despues.deudores}.`,
	despues: 'Siguiente: alumnos duplicados.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[4].desde !== T.avisoPaz || T.avisoPaz - T.pulsaPaz !== 15) {
	throw new Error('Guion: el aviso de paz y salvo no cae donde empieza su paso, o no tarda la ida y vuelta.');
}
if (PASOS[6].desde !== T.avisoDeuda || T.avisoDeuda - T.pulsaCambiarDeuda !== 15) {
	throw new Error('Guion: el aviso de la deuda no cae donde empieza su paso.');
}
if (REJILLA.y + REJILLA.alto > RESUMEN.y) {
	throw new Error('Cartera: la rejilla pisa el pie.');
}
void enElFotograma;
