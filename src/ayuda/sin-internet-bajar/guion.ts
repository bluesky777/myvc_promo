import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ARCHIVO, GEO, LA_COMPLETA, LA_VACIA, MENU, centro } from '../sin-internet/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * TRABAJAR SIN INTERNET, 1: «BAJAR EL LIBRO».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **La columna «Sin pasar» es la que decide qué se baja**, y **«sin indicadores» no es verde**:
 *     es la asignatura que todavía no tiene nada montado, y es justo la que más interesa llevarse,
 *     porque su hoja sale con las columnas de reserva vacías (el `title` de esa píldora en
 *     `notas-sin-internet.html`). El docente que ve un cero la destilda; si ve «sin indicadores» y
 *     la destilda también, se queda sin el sitio donde iba a proponerlos.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * TRES ACTOS
 *
 *     1. LA LLEGADA   menú -> Académico -> Trabajar sin internet
 *     2. LA TABLA     periodo en curso, todas marcadas, «Sin pasar», se desmarca la completa
 *     3. LA DESCARGA  «Descargar el libro (4 hojas)» y el aviso con el nombre del archivo
 *
 * LO QUE NO SE AFIRMA: cuánto tarda la descarga (depende del libro y de la red). El botón gira
 * mientras tanto (`nzLoading`) y el aviso es el de `descargar()`: «Se descargó «…».».
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaAcademico: 44,
	pulsaAcademico: 50,
	abreAcademico: 52,
	llegaSinInternet: 120,
	pulsaSinInternet: 132,
	monta: 138,
};

export const TABLA = {
	/** El puntero va a la casilla de 8°A y la desmarca. */
	llegaCasilla: 690,
	pulsaCasilla: 705,
};

export const DESCARGA = {
	llegaBoton: 1209,
	pulsaBoton: 1224,
	/** El aviso sale donde empieza el paso que lo cuenta (puerta de abajo). */
	aviso: 1260,
};

export const FOCOS = {
	academico: enElFotograma(MENU.academico),
	periodo: enElFotograma(GEO.periodo),
	tabla: enElFotograma(GEO.tabla),
	indicadores: enElFotograma(GEO.columna('indicadores')),
	sinPasar: enElFotograma(GEO.columna('sinPasar')),
	completa: enElFotograma(GEO.fila(LA_COMPLETA)),
	descargar: enElFotograma(GEO.descargar),
	vacia: enElFotograma(GEO.fila(LA_VACIA)),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: MENU.academico.y + MEDIDAS.seccion / 2 },
	sinInternet: { x: 150, y: MENU.sinInternet.y + MEDIDAS.hija / 2 },
	/** Donde descansa mientras los rótulos hablan: abajo a la derecha, lejos de la tabla. */
	reposo: { x: MEDIDAS.ancho - 160, y: MEDIDAS.alto - 60 },
	casilla: centro(GEO.casilla(LA_COMPLETA)),
	descargar: centro(GEO.descargar),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LA_PANTALLA = { ubicacion: 'Menú ▸ Académico ▸ Trabajar sin internet', url: '/notas/sin-internet' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Sin internet: Académico, Trabajar sin internet.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: 155, texto: 'Se baja el Excel, se rellena y se sube después.', ...EN_LA_PANTALLA },
	{ desde: 283, texto: 'El periodo viene puesto: el que está en curso.', ...EN_LA_PANTALLA, foco: FOCOS.periodo },
	{ desde: 398, texto: 'Una fila por asignatura, todas marcadas.', ...EN_LA_PANTALLA, foco: FOCOS.tabla },
	{ desde: 516, texto: '«Sin pasar»: cuántas casillas de nota faltan.', ...EN_LA_PANTALLA, foco: FOCOS.sinPasar },
	{ desde: 638, texto: 'Cero en verde: está completa; se puede desmarcar.', ...EN_LA_PANTALLA, foco: FOCOS.completa },
	{ desde: 776, texto: 'El botón cuenta las hojas.', ...EN_LA_PANTALLA, foco: FOCOS.descargar },
	{ desde: 860, texto: '«sin indicadores» no es estar al día: no hay nada montado.', ...EN_LA_PANTALLA, foco: FOCOS.vacia },
	{ desde: 1013, texto: 'Y conviene llevarla: trae columnas de reserva.', ...EN_LA_PANTALLA, foco: FOCOS.vacia },
	{ desde: 1137, texto: 'Descargar el libro: una hoja por asignatura.', ...EN_LA_PANTALLA, foco: FOCOS.descargar, focoHasta: DESCARGA.pulsaBoton + 10 },
	{ desde: DESCARGA.aviso, texto: `Sale el aviso con el archivo: ${ARCHIVO}.`, voz: 'Sale el aviso con el nombre del archivo.', ...EN_LA_PANTALLA },
];

export const TARJETA = 1360;
/** El aviso se queda hasta la tarjeta: el último paso lo está contando. */
export const AVISO_DURA = TARJETA - DESCARGA.aviso;
export const DURACION = 1480;

export const CLAVE = 'sin-internet-bajar';
export const TITULO = 'Bajar el libro';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico, Trabajar sin internet' },
	{ desde: LLEGADA.monta, titulo: 'El periodo y las asignaturas' },
	{ desde: PASOS[4].desde, titulo: '«Sin pasar» es la que decide' },
	{ desde: PASOS[7].desde, titulo: '«sin indicadores»: la que más interesa' },
	{ desde: PASOS[9].desde, titulo: 'Descargar el libro' },
];

export const CIERRE: Cierre = {
	hiciste: 'Bajaste el libro de Excel del periodo, con una hoja por asignatura marcada.',
	seVe: `Sale «Se descargó «${ARCHIVO}».», y ese es el archivo que se rellena.`,
	despues: 'Siguiente: rellenar el Excel sin borrar nada por error.',
	voz: 'Siguiente: rellenar el Excel.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (PASOS[PASOS.length - 1].desde !== DESCARGA.aviso) {
	throw new Error('Guion: el aviso de la descarga tiene que salir donde empieza el paso que lo cuenta.');
}
if (!(TABLA.pulsaCasilla > PASOS[5].desde && TABLA.pulsaCasilla < PASOS[6].desde)) {
	throw new Error('Guion: la casilla de 8°A se desmarca mientras el paso 6 lo cuenta.');
}
