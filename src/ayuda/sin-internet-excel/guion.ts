import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { ARCHIVO } from '../sin-internet/datos';
import { BOTON_CANCELAR, COL_DEF, COL_NOTA, FILA_ALUMNO, FILA_REGLAS, GEO_HOJA, GEO_PORTADA, enlaceDeLaHoja, rectDeCelda } from '../sin-internet/Libro';
import { FILAS, INDICADORES, LA_DE_DECIMALES, LA_HOJA, LA_QUE_FALTA, LA_QUE_SE_BORRA, RESERVA, REGLAS } from '../sin-internet/datos-del-libro';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * TRABAJAR SIN INTERNET, 2: «RELLENAR EL EXCEL».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Vacío es «no la toques», no «bórrala»; para borrar se escribe un guion; y la nota es
 *     entera.** Las tres son reglas del libro que baja MyVC (`8myvc/app/Exports/LibroDeNotas.php`,
 *     «CÓMO SE USA», y la validación de `HojaDeAsignatura.php`): el vídeo las enseña en la portada
 *     y luego pasando por cada una en la hoja.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * DOS PLANOS, NINGÚN MENÚ
 *
 * Este vídeo no pasa dentro de MyVC: es el archivo abierto en una hoja de cálculo. Por eso no hay
 * cáscara ni llegada por el menú (la llegada es el vídeo anterior), y la cabecera dice dónde se
 * está con el nombre del archivo y de la pestaña. La hoja de cálculo es genérica: sin marca.
 *
 *     1. LA PORTADA   «Bienvenida»: las cinco reglas y el enlace a cada hoja
 *     2. LA HOJA      9B Matemáticas: se escribe una nota, se borra otra con «-», y una con
 *                     decimales la rechaza la validación con su mensaje («Esa nota no cabe»)
 *
 * LO QUE NO SE AFIRMA: el aspecto exacto de la ventana y del diálogo de error, que dependen del
 * programa con el que se abra el libro. El texto del error sí es el del libro.
 */

export const FPS = 30;

export const PORTADA = {
	/** El puntero va al enlace de «9B Matemáticas» y lo pulsa. */
	llegaEnlace: 280,
	pulsaEnlace: 292,
	/** La hoja entra con un relevo corto, como cambia una pestaña. */
	cambia: 298,
	dura: 8,
};

export const TECLEO = {
	porTecla: 6,
	/** La que faltaba: se pulsa, se teclea «76» y Enter. */
	falta: { llega: 562, pulsa: 577, empieza: 597, enter: 617 },
	/** La que se borra con un guion. */
	borra: { llega: 654, pulsa: 667, empieza: 681, enter: 695 },
	/** La de decimales: «72,5», Enter, sale el error, se cancela. */
	decimales: { llega: 759, pulsa: 771, empieza: 785, enter: 815, dialogo: 819, llegaCancelar: 849, pulsaCancelar: 861, cierra: 865 },
};

const foco = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, radio: 4 });
const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

const celda = (f: number, c: number) => rectDeCelda(GEO_HOJA, FILA_ALUMNO + f, COL_NOTA + c);

export const FOCOS = {
	reglas: foco(rectDeCelda(GEO_PORTADA, FILA_REGLAS, 0, 5, REGLAS.length)),
	vacioYGuion: foco(rectDeCelda(GEO_PORTADA, FILA_REGLAS + 2, 0, 5, 2)),
	enlace: foco(enlaceDeLaHoja(LA_HOJA)),
	gris: foco(rectDeCelda(GEO_HOJA, 1, 0, 3, FILAS.length + 1)),
	cabecera: foco(rectDeCelda(GEO_HOJA, 0, COL_NOTA, INDICADORES.length, 2)),
	falta: foco(celda(LA_QUE_FALTA.fila, LA_QUE_FALTA.col)),
	borra: foco(celda(LA_QUE_SE_BORRA.fila, LA_QUE_SE_BORRA.col)),
	decimales: foco(celda(LA_DE_DECIMALES.fila, LA_DE_DECIMALES.col)),
	reserva: foco(rectDeCelda(GEO_HOJA, 1, COL_NOTA + INDICADORES.length, RESERVA.length, FILAS.length + 1)),
	finales: foco(rectDeCelda(GEO_HOJA, 1, COL_DEF, 3, FILAS.length + 1)),
};

export const PUNTOS = {
	entrada: { x: 1500, y: 800 },
	enlace: { x: enlaceDeLaHoja(LA_HOJA).x + 90, y: centro(enlaceDeLaHoja(LA_HOJA)).y },
	reposo: { x: 1560, y: 820 },
	falta: centro(celda(LA_QUE_FALTA.fila, LA_QUE_FALTA.col)),
	borra: centro(celda(LA_QUE_SE_BORRA.fila, LA_QUE_SE_BORRA.col)),
	decimales: centro(celda(LA_DE_DECIMALES.fila, LA_DE_DECIMALES.col)),
	cancelar: centro(BOTON_CANCELAR),
};

const EN_LA_PORTADA = { ubicacion: 'El libro, en Excel ▸ Bienvenida', url: ARCHIVO };
const EN_LA_HOJA = { ubicacion: 'El libro, en Excel ▸ 9B Matemáticas', url: ARCHIVO };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'La portada explica cómo se usa el libro.', ...EN_LA_PORTADA, foco: FOCOS.reglas },
	{ desde: 109, texto: 'Vacío no borra nada; para borrar, un guion.', ...EN_LA_PORTADA, foco: FOCOS.vacioYGuion },
	{ desde: 240, texto: 'Cada asignatura enlaza a su hoja.', ...EN_LA_PORTADA, foco: FOCOS.enlace, focoHasta: PORTADA.pulsaEnlace },
	{ desde: 329, texto: 'Una fila por alumno; lo gris no se toca.', ...EN_LA_HOJA, foco: FOCOS.gris },
	{ desde: 446, texto: 'Arriba, cada indicador y su peso.', ...EN_LA_HOJA, foco: FOCOS.cabecera },
	{ desde: 552, texto: 'Se escribe la nota que falta.', ...EN_LA_HOJA, foco: FOCOS.falta },
	{ desde: 639, texto: 'Para BORRAR una nota, un guion.', voz: 'Para borrar una nota, un guion.', ...EN_LA_HOJA, foco: FOCOS.borra },
	{ desde: 744, texto: 'Sólo enteros: el libro no deja escribir decimales.', ...EN_LA_HOJA, foco: FOCOS.decimales, focoHasta: TECLEO.decimales.enter },
	{ desde: 879, texto: 'Lo ámbar es de reserva, para indicadores nuevos.', ...EN_LA_HOJA, foco: FOCOS.reserva },
	{ desde: 1009, texto: 'Def no se sube; Aus y Tar, sí.', voz: 'La definitiva no se sube; ausencias y tardanzas, sí.', ...EN_LA_HOJA, foco: FOCOS.finales },
	{ desde: 1170, texto: 'Luego se sube: Trabajar sin internet, Subir una planilla.', ...EN_LA_HOJA },
];

export const TARJETA = 1324;
export const DURACION = 1444;

export const CLAVE = 'sin-internet-excel';
export const TITULO = 'Rellenar el Excel';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'La portada: cómo se usa' },
	{ desde: PORTADA.cambia, titulo: 'La hoja de una asignatura' },
	{ desde: PASOS[5].desde, titulo: 'Vacío, guion y enteros' },
	{ desde: PASOS[8].desde, titulo: 'Reserva, Def, Aus y Tar' },
];

export const CIERRE: Cierre = {
	hiciste: 'Rellenaste el libro: una nota nueva, una borrada con guion.',
	seVe: 'Al subirlo, el resumen cuenta las notas que entran y las del guion.',
	despues: 'Siguiente: subir el libro, el archivo y las columnas.',
	voz: 'Siguiente: subir el libro.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

for (const [nombre, t, paso] of [['falta', TECLEO.falta, 5], ['borra', TECLEO.borra, 6], ['decimales', TECLEO.decimales, 7]] as const) {
	if (!(t.pulsa > PASOS[paso].desde && t.enter < PASOS[paso + 1].desde)) {
		throw new Error(`Guion: el tecleo «${nombre}» tiene que caer dentro del paso ${paso + 1}.`);
	}
}
