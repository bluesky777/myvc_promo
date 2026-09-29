import { MEDIDAS, MENU_DOCENTE_HOY } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { alFotograma, centro, holgura, rectDeEntrada, union } from '../moverse/comun';
import { LA_DE_10A, LA_DE_9A, geometriaDeLaFila } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS, POR DONDE SE EMPIEZA» (serie docente, ola 1).
 *
 * LA DUDA QUE MATA: **la fila roja no es decoración: dice qué le falta a la planeación.** En la
 * aplicación de hoy no es la fila entera la que se pone roja sino el bloque del grupo, que lleva un
 * marco rojo por dentro (`fila--incompleta`), y lo que falta lo dicen las etiquetas ámbar de la
 * línea de datos. El vídeo enseña las dos cosas y dónde se arregla.
 *
 * TRES ACTOS
 *
 *     1. LA LLEGADA     menú -> Académico -> Mis asignaturas
 *     2. LA FILA        el grupo, la materia, sus datos y sus botones; «Logros» es palabra del colegio
 *     3. LO QUE FALTA   el marco rojo, las etiquetas de 9°A y la de 10°A, y el botón que lo arregla
 */

export const FPS = 30;

export const MENU = MENU_DOCENTE_HOY;

export const LLEGADA = {
	cursorEntra: 4,
	llegaAcademico: 28,
	pulsaAcademico: 34,
	abreAcademico: 36,
	llegaMisAsignaturas: 90,
	pulsaMisAsignaturas: 98,
	monta: 102,
};

export const FINAL = {
	llegaBoton: 995,
	pulsaBoton: 1030,
	salida: 1038,
	cursorSale: 1055,
};

const g9A = geometriaDeLaFila(LA_DE_9A);
const g9B = geometriaDeLaFila(1);
const g10A = geometriaDeLaFila(LA_DE_10A);
const g8A = geometriaDeLaFila(0);

export const FOCOS = {
	academico: alFotograma(rectDeEntrada(MENU, 'Académico'), 6),
	primeraFila: alFotograma(holgura(g8A.fila, 4)),
	botones: alFotograma(holgura(union(g9B.botones[0], g9B.botones[3]), 5)),
	logros: alFotograma(holgura(g9B.botones[0], 5)),
	franjas: alFotograma(holgura(union(g9A.franja, g10A.franja), 4)),
	sinSumar: alFotograma(holgura(g9A.avisos[0], 5)),
	malRepartidos: alFotograma(holgura(g9A.avisos[1], 5)),
	sinLogros: alFotograma(holgura(g10A.avisos[0], 5)),
	logros9A: alFotograma(holgura(g9A.botones[0], 5)),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 160 },
	academico: { x: 130, y: centro(rectDeEntrada(MENU, 'Académico')).y },
	misAsignaturas: { x: 130, y: centro(rectDeEntrada(MENU, 'Académico', 'Mis asignaturas')).y },
	reposo: { x: 980, y: 845 },
	logros9A: centro(g9A.botones[0]),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const AQUI = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'Abre Académico y entra en Mis asignaturas.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 16 },
	{ desde: 130, texto: 'Una fila por asignatura: el grupo, la materia y sus datos.', ...AQUI, foco: FOCOS.primeraFila },
	{ desde: 286, texto: 'Cada botón abre una pantalla de esa asignatura.', ...AQUI, foco: FOCOS.botones },
	{ desde: 397, texto: 'El marco rojo en el grupo avisa: falta algo en la planeación.', ...AQUI, foco: FOCOS.franjas },
	{ desde: 541, texto: 'La etiqueta ámbar dice qué: aquí, los Logros no suman 100.', voz: 'La etiqueta ámbar dice qué: aquí, los Logros no suman cien.', ...AQUI, foco: FOCOS.sinSumar },
	{ desde: 697, texto: 'Aquí, Indicadores que no suman 100 dentro de un Logro.', voz: 'Aquí, Indicadores que no suman cien dentro de un Logro.', ...AQUI, foco: FOCOS.malRepartidos },
	{ desde: 832, texto: 'En 10°A no hay Logros: la planilla queda sin columnas.', voz: 'En décimo A no hay Logros: la planilla queda sin columnas.', ...AQUI, foco: FOCOS.sinLogros },
	{ desde: 973, texto: 'Se arregla en el botón Logros de la fila.', ...AQUI, foco: FOCOS.logros9A, focoHasta: FINAL.salida + 4 },
];

export const TARJETA = 1072;
export const DURACION = TARJETA + 116;

export const CLAVE = 'mis-asignaturas';
export const TITULO = 'Mis asignaturas, por donde se empieza';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Académico, Mis asignaturas' },
	{ desde: PASOS[1].desde, titulo: 'Una fila por asignatura' },
	{ desde: PASOS[3].desde, titulo: 'El marco rojo: lo que falta' },
	{ desde: PASOS[7].desde, titulo: 'Dónde se arregla' },
];

export const CIERRE: Cierre = {
	hiciste: 'Viste qué le falta a la planeación de cada asignatura.',
	seVe: 'Una fila sin marco rojo ni etiquetas ámbar está lista para calificar.',
	despues: 'Siguiente: Logros e Indicadores, el 100 %.',
	voz: 'Siguiente: Logros e Indicadores.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* El clic en «Logros» cae dentro del paso que lo anuncia. */
if (FINAL.pulsaBoton < PASOS[7].desde || FINAL.pulsaBoton >= TARJETA) {
	throw new Error('Guion: el clic en «Logros» no cae en el paso que lo explica.');
}
