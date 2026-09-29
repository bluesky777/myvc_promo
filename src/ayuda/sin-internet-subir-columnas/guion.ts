import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { GEO, MENU, centro } from '../sin-internet/datos';
import { GEO_SUBIR, Y_PIE } from '../sin-internet/Subir';
import { RESERVA } from '../sin-internet/datos-de-la-subida';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * TRABAJAR SIN INTERNET, 3: «SUBIR: EL ARCHIVO Y LAS COLUMNAS».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA
 *
 *     **Los pasos se derivan: sólo salen los que tienen problema.** Quien vio la pantalla con cinco
 *     pasos cree que la de su compañero, con tres, está rota. `pasosDeLaSubida()` (app2,
 *     `datos/planilla-offline.ts`) pone siempre «Archivo» y «Qué va a pasar», y en medio sólo
 *     Estructura, Celdas, Columnas nuevas, Alumnos, Choques o Ausencias si el libro los trae.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CUATRO ACTOS
 *
 *     1. LA LLEGADA    Académico -> Trabajar sin internet -> «Subir una planilla»
 *     2. LA LECTURA    «Elegir el archivo», «Leyendo …», y el paso Archivo con sus cifras
 *     3. LOS PASOS     la barra: siempre dos, en medio los que tocan; la tabla de hojas tocadas
 *     4. LA COLUMNA    «Columnas nuevas»: 28 notas en una columna de reserva; «Crear el indicador»
 *
 * LO QUE NO SE AFIRMA: cuánto tarda la lectura (depende del libro). El diálogo del sistema para
 * elegir el archivo no se dibuja: es del navegador, no de MyVC.
 */

export const FPS = 30;

export const LLEGADA = {
	cursorEntra: 16,
	llegaAcademico: 44,
	pulsaAcademico: 50,
	abreAcademico: 52,
	llegaSinInternet: 100,
	pulsaSinInternet: 112,
	montaBajar: 118,
	llegaSubir: 164,
	pulsaSubir: 178,
	/** Después de que la lista de bajar haya acabado de irse entera (su última fila sale 46 después del clic). */
	montaSubir: 226,
};

export const LECTURA = {
	llegaElegir: 545,
	pulsaElegir: 555,
	empieza: 561,
	acaba: 641,
};

export const COLUMNA = {
	llegaSiguiente: 1060,
	pulsaSiguiente: 1072,
	entraReserva: 1077,
	llegaSelect: 1300,
	pulsaSelect: 1311,
	llegaOpcion: 1329,
	pulsaOpcion: 1339,
	llegaNombre: 1355,
	pulsaNombre: 1365,
	empiezaNombre: 1373,
	porLetra: 3,
	llegaSiguiente2: 1572,
	pulsaSiguiente2: 1584,
	entraChoques: 1589,
};

export const FIN_NOMBRE = COLUMNA.empiezaNombre + RESERVA.nombre.length * COLUMNA.porLetra;

const f = enElFotograma;

export const FOCOS = {
	academico: f(MENU.academico),
	subir: f(GEO.subir),
	elegir: f(GEO_SUBIR.elegir),
	cifras: f(GEO_SUBIR.cifras),
	pasos: f(GEO_SUBIR.pasos),
	delMedio: f(GEO_SUBIR.pasosDelMedio),
	tabla: f(GEO_SUBIR.tablaHojas),
	siguiente: f(GEO_SUBIR.siguiente(Y_PIE.archivo)),
	fila: f(GEO_SUBIR.filaReserva),
	select: f(GEO_SUBIR.selectReserva),
	siguiente2: f(GEO_SUBIR.siguiente(Y_PIE.reserva)),
};

export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: MENU.academico.y + MEDIDAS.seccion / 2 },
	sinInternet: { x: 150, y: MENU.sinInternet.y + MEDIDAS.hija / 2 },
	subir: centro(GEO.subir),
	elegir: centro(GEO_SUBIR.elegir),
	reposo: { x: MEDIDAS.ancho - 170, y: MEDIDAS.alto - 40 },
	siguiente: centro(GEO_SUBIR.siguiente(Y_PIE.archivo)),
	select: centro(GEO_SUBIR.selectReserva),
	opcion: centro(GEO_SUBIR.opcionCrear),
	nombre: centro(GEO_SUBIR.nombreReserva),
	siguiente2: centro(GEO_SUBIR.siguiente(Y_PIE.reserva)),
};

const EN_EL_MENU = { ubicacion: 'Menú ▸ Académico', url: 'micolegio.micolevirtual.com/up2/' };
const EN_BAJAR = { ubicacion: 'Menú ▸ Académico ▸ Trabajar sin internet', url: '/notas/sin-internet' };
const EN_SUBIR = { ubicacion: 'Menú ▸ Académico ▸ Trabajar sin internet ▸ Subir una planilla', url: '/notas/sin-internet/subir' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Para subir: Académico, Trabajar sin internet, Subir una planilla.', ...EN_EL_MENU, foco: FOCOS.academico, focoHasta: LLEGADA.pulsaAcademico + 20 },
	{ desde: LLEGADA.montaSubir, texto: 'Primero se lee: nada se escribe hasta que confirmes.', ...EN_SUBIR },
	{ desde: 358, texto: 'Para borrar una nota escribe un guion; vacía no borra.', ...EN_SUBIR, foco: FOCOS.elegir },
	{ desde: 514, texto: 'Elegir el archivo: el libro que rellenaste.', ...EN_SUBIR, foco: FOCOS.elegir, focoHasta: LECTURA.pulsaElegir - 6 },
	{ desde: 641, texto: 'MyVC lo lee y dice qué pasaría, sin escribir nada.', ...EN_SUBIR, foco: FOCOS.cifras },
	{ desde: 785, texto: 'Arriba, sólo los pasos que este libro necesita.', ...EN_SUBIR, foco: FOCOS.pasos },
	{ desde: 912, texto: 'La tabla enseña sólo las hojas tocadas.', ...EN_SUBIR, foco: FOCOS.tabla },
	{ desde: 1020, texto: 'Siguiente lleva a Columnas nuevas.', ...EN_SUBIR, foco: FOCOS.siguiente, focoHasta: COLUMNA.entraReserva - 10 },
	{ desde: 1113, texto: `Hay ${RESERVA.notas} notas en una columna de reserva: sin decidir, no entran.`, ...EN_SUBIR, foco: FOCOS.fila },
	{ desde: 1285, texto: 'Para que entren: «Crear el indicador», y un nombre.', ...EN_SUBIR, foco: FOCOS.fila },
	{ desde: 1420, texto: 'El peso viene sugerido: lo que falta hasta 100.', ...EN_SUBIR, foco: FOCOS.fila },
	{ desde: 1542, texto: 'Con el nombre puesto, Siguiente lleva a los choques.', ...EN_SUBIR, foco: FOCOS.siguiente2, focoHasta: COLUMNA.entraChoques - 10 },
];

export const TARJETA = 1664;
export const DURACION = 1784;

export const CLAVE = 'sin-internet-subir-columnas';
export const TITULO = 'Subir: el archivo y las columnas';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Subir una planilla' },
	{ desde: PASOS[3].desde, titulo: 'Elegir el archivo: primero se lee' },
	{ desde: PASOS[5].desde, titulo: 'Los pasos: sólo los que hacen falta' },
	{ desde: COLUMNA.entraReserva, titulo: 'Columnas nuevas: crear el indicador' },
];

export const CIERRE: Cierre = {
	hiciste: 'Subiste el libro para leerlo y decidiste qué hacer con la columna nueva.',
	seVe: 'En la barra de arriba: sólo los pasos que tu libro necesita, y nada escrito aún.',
	despues: 'Siguiente: choques, ausencias y qué va a pasar.',
	voz: 'Siguiente: choques y ausencias.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (LECTURA.acaba > PASOS[4].desde) {
	throw new Error('Guion: la lectura tiene que acabar antes del paso que enseña lo leído.');
}
if (FIN_NOMBRE > PASOS[10].desde) {
	throw new Error('Guion: el nombre del indicador tiene que acabar de escribirse antes del paso 11.');
}
