import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { alFotograma, centro, holgura } from '../moverse/comun';
import { enLaCascara, LA_QUE_SE_ABRE, rectDeBoton, rectDeFila } from '../docente-portada/datos';
import { RECT_RASTRO, rectDeMiga } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «VOLVER SOBRE TUS PASOS» (Moverse por MyVC, ola 3).
 *
 * LA DUDA QUE MATA, CORREGIDA: el plan decía que el rastro recuerda por dónde entraste. Hoy no: dice
 * de qué pantalla cuelga la que tienes delante, y por eso dice lo mismo llegues como llegues. Lo
 * que se enseña es eso, que las migas azules suben, y que el Atrás del navegador vuelve a la
 * pantalla anterior con su propio rastro. El porqué, en `datos.ts`.
 *
 * CUATRO ACTOS
 *
 *     1. UN ATAJO        de la portada a los Logros de 9°B, sin pasar por Mis asignaturas
 *     2. EL RASTRO       dice «Mis asignaturas» aunque no se pasó por ahí
 *     3. SUBIR           la miga «Mis asignaturas», y luego «Panel», que es Inicio
 *     4. ATRÁS           Alt ← vuelve a Mis asignaturas, con su rastro
 */

export const FPS = 30;

export const T = {
	cursorEntra: 16,
	llegaFila: 44,
	pulsaFila: 56,
	llegaBoton: 80,
	pulsaBoton: 92,
	/** La portada se va en diez fotogramas y luego entra la pantalla nueva. */
	montaLogros: 106,
	llegaMiga: 511,
	pulsaMiga: 523,
	montaMis: 537,
	llegaPanel: 640,
	pulsaPanel: 652,
	montaPortada: 666,
	teclas: { desde: 707, pulsa: 723, hasta: 773 },
	montaMisAtras: 737,
	cursorSale: 690,
};

export const FOCOS = {
	fila9B: alFotograma(holgura(enLaCascara(rectDeFila(LA_QUE_SE_ABRE, null)), 4), 10),
	rastro: alFotograma(RECT_RASTRO, 8),
	misAsignaturas: alFotograma(holgura(rectDeMiga(2), 2), 6),
	panel: alFotograma(holgura(rectDeMiga(0), 2), 6),
};

export const PUNTOS = {
	entrada: { x: 900, y: 700 },
	fila9B: { x: enLaCascara(rectDeFila(LA_QUE_SE_ABRE, null)).x + 260, y: centro(enLaCascara(rectDeFila(LA_QUE_SE_ABRE, null))).y },
	boton: centro(enLaCascara(rectDeBoton('unidades'))),
	reposo: { x: 820, y: 640 },
	miga: centro(rectDeMiga(2)),
	panel: centro(rectDeMiga(0)),
};

const EN_INICIO = { ubicacion: 'Menú ▸ Inicio', url: 'micolegio.micolevirtual.com/up2/' };
const EN_LOGROS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas ▸ Logros', url: '/unidades/1222' };
const EN_MIS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'Desde la portada se va directo a los Logros de una clase.', ...EN_INICIO, foco: FOCOS.fila9B, focoHasta: T.pulsaFila + 10 },
	{ desde: 133, texto: 'Arriba, el rastro: de qué pantalla cuelga esta.', ...EN_LOGROS, foco: FOCOS.rastro },
	{ desde: 272, texto: 'Logros cuelga siempre de Mis asignaturas.', ...EN_LOGROS, foco: FOCOS.misAsignaturas },
	{ desde: 378, texto: 'Llegues por donde llegues, dice lo mismo.', ...EN_LOGROS, foco: FOCOS.rastro },
	{ desde: 491, texto: 'Las migas azules se pulsan: suben un nivel.', ...EN_LOGROS, foco: FOCOS.misAsignaturas, focoHasta: T.pulsaMiga + 8 },
	{ desde: 616, texto: 'Y Panel te lleva a Inicio.', ...EN_MIS, foco: FOCOS.panel, focoHasta: T.pulsaPanel + 8 },
	{ desde: 697, texto: 'Atrás, o Alt ←, vuelve a la pantalla anterior.', voz: 'Atrás, o alt flecha izquierda, vuelve a la pantalla anterior.', ...EN_MIS },
	{ desde: 843, texto: 'Y el rastro es el de esa pantalla.', ...EN_MIS, foco: FOCOS.rastro },
];

export const TARJETA = 938;
export const DURACION = 1058;

export const CLAVE = 'volver-rastro';
export const TITULO = 'Volver sobre tus pasos';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Un atajo desde la portada' },
	{ desde: PASOS[1].desde, titulo: 'El rastro: de qué pantalla cuelga' },
	{ desde: PASOS[4].desde, titulo: 'Subir con las migas' },
	{ desde: PASOS[6].desde, titulo: 'El Atrás del navegador' },
];

export const CIERRE: Cierre = {
	hiciste: 'Subiste con las migas del rastro y volviste con el Atrás del navegador.',
	seVe: 'El rastro de arriba dice siempre de qué pantalla cuelga la que tienes delante.',
	despues: 'Ponerlo a tu gusto: tema, modo oscuro y densidad.',
	voz: 'Siguiente: ponerlo a tu gusto.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

if (T.pulsaMiga < PASOS[4].desde || T.pulsaPanel < PASOS[5].desde || T.teclas.pulsa < PASOS[6].desde) {
	throw new Error('Guion: un clic o una tecla cae antes del paso que lo explica.');
}
