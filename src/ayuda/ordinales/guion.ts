import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { EL_CAMPO, EL_NUEVO, GEO_ORD, LA_CORREGIDA, MENU_ORD, centro } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ORDINALES DEL MANUAL».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     1. **Los campos guardan solos, sin botón.** La rejilla guarda al salir de la celda («Haz clic
 *        en una celda para editarla. Se guarda al salir.», y el aviso «Ordinal actualizado con
 *        éxito»); la configuración de convivencia guarda cada campo 800 ms después de la última
 *        tecla (`ESPERA_CONFIG` de `ordinales.ts`) y avisa «Campo actualizado».
 *     2. **Año cerrado = sólo consulta.** Al elegir un año anterior sale «Año cerrado: sólo
 *        consulta» con su motivo, y «Crear ordinal» se apaga (`soloLectura()`).
 *
 * EL RITMO ES EL DE LA APLICACIÓN: la configuración espera 800 ms (24 fotogramas) desde la última
 * tecla, y la ida y vuelta se dibuja en medio segundo (15). La puerta de abajo lo exige. Cuánto
 * tarda la rejilla en guardar al salir de la celda no está en el código de la pantalla: el vídeo
 * no lo afirma, sólo que el aviso sale.
 *
 * LOS AVISOS SON AZULES: `Avisos.open()` sin acción es un `NzMessage` de tipo `info`, no el verde
 * de `exito()` (`comunes/avisos/avisos.ts`).
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaSeccion: 44,
	pulsaSeccion: 50,
	abreSeccion: 52,
	llegaEntrada: 100,
	pulsaEntrada: 112,
	monta: 118,
};

export const CELDA = {
	llega: 236,
	pulsa: 248,
	empieza: 258,
	porTecla: 5,
	llegaFuera: 296,
	sale: 308,
	aviso: 333,
};

export const CREAR = {
	llegaBoton: 454,
	pulsaBoton: 466,
	abre: 468,
	pulsaOrdinal: 480,
	empiezaOrdinal: 486,
	pulsaTipo: 500,
	empiezaTipo: 506,
	pulsaDescripcion: 516,
	empiezaDescripcion: 522,
	porLetra: 1,
	llegaCrear: 574,
	pulsaCrear: 584,
	aviso: 599,
	llegaOcultar: 639,
	pulsaOcultar: 651,
};

export const CONFIGURACION = {
	llegaBoton: 683,
	pulsaBoton: 696,
	bajaDesde: 702,
	bajaHasta: 738,
	llegaCampo: 821,
	pulsaCampo: 833,
	tecla: 846,
	/** 800 ms de espera desde la tecla, y la ida y vuelta. */
	aviso: 846 + 24 + 15,
	subeDesde: 1028,
	subeHasta: 1054,
};

export const ANIO = {
	llega: 1058,
	pulsa: 1070,
	llegaOpcion: 1088,
	pulsaOpcion: 1100,
	/** La lista se recarga y sale la alerta. */
	cerrado: 1118,
};

export const SCROLL = 560;

const f = enElFotograma;

export const FOCOS = {
	disciplina: f(MENU_ORD.seccion),
	rejilla: f(GEO_ORD.rejilla(false)),
	celda: f(GEO_ORD.celdaPagina(LA_CORREGIDA.fila)),
	crear: f(GEO_ORD.accion('crear')),
	ficha: f(GEO_ORD.ficha),
	configurar: f(GEO_ORD.accion('configurar')),
	cuantas: f(GEO_ORD.cuantas(SCROLL)),
	libroRojo: f(GEO_ORD.libroRojo(SCROLL)),
	anio: f(GEO_ORD.accion('anio')),
	/** «Crear ordinal» apagado y, debajo, la alerta: un solo recuadro que coge los dos. */
	alertaYCrear: f({ x: GEO_ORD.alerta.x, y: GEO_ORD.accion('crear').y - 4, ancho: GEO_ORD.alerta.ancho, alto: GEO_ORD.alerta.y + GEO_ORD.alerta.alto - GEO_ORD.accion('crear').y + 8 }),
};

const ANIO_OPCION_2025 = { x: GEO_ORD.accion('anio').x + 50, y: GEO_ORD.accion('anio').y + 40 + 4 + 4 + 38 + 19 };

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	seccion: { x: 150, y: MENU_ORD.seccion.y + MEDIDAS.seccion / 2 },
	entradaOrd: { x: 150, y: MENU_ORD.hija.y + MEDIDAS.hija / 2 },
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	celda: centro(GEO_ORD.celdaPagina(LA_CORREGIDA.fila)),
	fuera: centro(GEO_ORD.fuera),
	crear: centro(GEO_ORD.accion('crear')),
	ordinal: centro(GEO_ORD.campoFicha('ordinal')),
	tipo: centro(GEO_ORD.campoFicha('tipo')),
	descripcion: centro(GEO_ORD.campoFicha('descripcion')),
	crearFicha: centro(GEO_ORD.crear),
	ocultar: centro(GEO_ORD.ocultar),
	configurar: centro(GEO_ORD.accion('configurar')),
	campo: centro(GEO_ORD.campoTardanzas(SCROLL)),
	anio: centro(GEO_ORD.accion('anio')),
	anio2025: ANIO_OPCION_2025,
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Disciplina', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Disciplina ▸ Ordinales', url: '/ordinales' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'El manual se carga en Disciplina, Ordinales.', ...EN_EL_MENU, foco: FOCOS.disciplina, focoHasta: LLEGADA.pulsaSeccion + 20 },
	{ desde: 133, texto: 'Cada fila es una falta del manual.', ...AQUI, foco: FOCOS.rejilla },
	{ desde: 226, texto: 'Se corrige en la celda y se guarda al salir.', ...AQUI, foco: FOCOS.celda },
	{ desde: CELDA.aviso, texto: 'Sale el aviso; no hay botón de guardar.', ...AQUI },
	{ desde: 444, texto: 'Crear ordinal abre la ficha de uno nuevo.', ...AQUI, foco: FOCOS.crear, focoHasta: CREAR.pulsaBoton + 6 },
	{ desde: 549, texto: 'Al crearlo, la ficha se vacía para el siguiente.', ...AQUI, foco: FOCOS.ficha, focoHasta: CREAR.llegaOcultar - 10 },
	{ desde: 673, texto: 'Configurar comportamiento: cómo se llama cada tipo.', ...AQUI, foco: FOCOS.configurar, focoHasta: CONFIGURACION.pulsaBoton + 6 },
	{ desde: 801, texto: 'Estos campos se guardan solos al escribir.', ...AQUI, foco: FOCOS.cuantas },
	{ desde: 907, texto: 'Las columnas del libro rojo las escribe cada titular.', ...AQUI, foco: FOCOS.libroRojo, focoHasta: CONFIGURACION.subeDesde - 10 },
	{ desde: 1033, texto: 'Un año cerrado se abre sólo para consultar.', ...AQUI, foco: FOCOS.anio, focoHasta: ANIO.pulsaOpcion + 6 },
	{ desde: 1143, texto: 'Crear sale apagado; el aviso dice por qué.', ...AQUI, foco: FOCOS.alertaYCrear },
];

export const TARJETA = 1258;
export const DURACION = 1378;

export const CLAVE = 'ordinales';
export const TITULO = 'Ordinales del manual';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Disciplina, Ordinales' },
	{ desde: PASOS[2].desde, titulo: 'Corregir en la celda' },
	{ desde: PASOS[4].desde, titulo: 'Crear un ordinal' },
	{ desde: PASOS[6].desde, titulo: 'Configurar comportamiento' },
	{ desde: PASOS[9].desde, titulo: 'Año cerrado: sólo consulta' },
];

export const CIERRE: Cierre = {
	hiciste: 'Corregiste un ordinal, creaste otro y cambiaste la configuración de convivencia.',
	seVe: 'Cada cambio avisa solo: «Ordinal actualizado con éxito», «Creado con éxito», «Campo actualizado».',
	despues: 'En Disciplina, al registrar una situación, estos ordinales salen en su desplegable.',
	voz: 'Estos ordinales salen al registrar una situación.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (CONFIGURACION.aviso - CONFIGURACION.tecla !== 24 + 15) {
	throw new Error('Guion: «Campo actualizado» sale 800 ms después de la tecla, más la ida y vuelta.');
}
if (!(CONFIGURACION.aviso > PASOS[7].desde && CONFIGURACION.aviso < PASOS[8].desde)) {
	throw new Error('Guion: «Campo actualizado» tiene que salir mientras el paso 8 lo cuenta.');
}
const FIN_DESCRIPCION = CREAR.empiezaDescripcion + EL_NUEVO.descripcion.length * CREAR.porLetra;
if (FIN_DESCRIPCION >= CREAR.llegaCrear) {
	throw new Error('Guion: la descripción tiene que acabar de escribirse antes de pulsar «Crear».');
}
export { EL_CAMPO };
