import { AVISO_DEL_VOCABULARIO } from '../../comunes/vocabulario';
import { MEDIDAS, SECCIONES, alturaDeEntrada } from '../medidas';
import { Cierre } from '../Tarjeta';
import { enElFotograma } from '../encuadre';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { CLASES_HOY, LA_QUE_SE_ABRE, MANANA, RECT_DERECHA, enLaCascara, rectDeBoton, rectDeClases, rectDeFila } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «LA PORTADA: LO QUE TIENES HOY».
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA DUDA QUE MATA, Y EL CATÁLOGO LA DICE A MEDIAS
 *
 * El catálogo pide: «Clases de hoy sale de los días de la asignatura, no del horario». En app2 eso
 * es verdad **sólo sin horario oficial**: con una versión oficial publicada, el backend manda
 * `clases_hoy` sacado del horario (con franja, hora y salón) y el front la usa antes que nada
 * (`clases-de-hoy.ts:226-228`); sin ella, manda `horario_hoy`, que sale de `asignaturas.lunes …
 * domingo`. Así que el vídeo dice las dos mitades, en dos rótulos seguidos, y dibuja la de los
 * días (la de la mayoría de colegios, que no publican horario).
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * DOS ACTOS
 *
 *     1. LA LLEGADA   desde «Mis asignaturas», un clic en «Inicio», la primera entrada del menú
 *     2. LA PORTADA   las clases de hoy, abrir la de 9°B, «Mañana…», y la columna de la derecha
 */

export const FPS = 30;

export const INICIO = SECCIONES.findIndex((s) => s.etiqueta === 'Inicio');

export const LLEGADA = {
	cursorEntra: 14,
	llegaInicio: 40,
	pulsaInicio: 50,
	montaPortada: 80,
};

export const PORTADA = {
	llegaFila: 440,
	pulsaFila: 452,
	llegaManana: 725,
	pulsaManana: 739,
	cursorSale: 911,
};

const fotograma = (r: { x: number; y: number; ancho: number; alto: number }) => enElFotograma(enLaCascara(r));

export const FOCOS = {
	inicio: enElFotograma({ x: 0, y: alturaDeEntrada(INICIO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	clases: fotograma(rectDeClases(CLASES_HOY.length)),
	asistencia: fotograma(rectDeBoton('asistencia')),
	unidades: fotograma(rectDeBoton('unidades')),
	manana: fotograma(MANANA),
	derecha: fotograma(RECT_DERECHA),
};

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/** En coordenadas de la cáscara: es donde vive el puntero. */
export const PUNTOS = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	inicio: { x: 120, y: alturaDeEntrada(INICIO, null, false) + MEDIDAS.seccion / 2 },
	fila: (() => { const r = enLaCascara(rectDeFila(LA_QUE_SE_ABRE, null)); return { x: r.x + 380, y: r.y + r.alto / 2 }; })(),
	asistencia: centro(enLaCascara(rectDeBoton('asistencia'))),
	manana: centro(enLaCascara(MANANA)),
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const EN_MIS_ASIGNATURAS = { ubicacion: 'Menú ▸ Académico ▸ Mis asignaturas', url: '/mis-asignaturas' };
const EN_LA_PORTADA = { ubicacion: 'Menú ▸ Inicio', url: 'micolegio.micolevirtual.com/up2/' };

export const PASOS: Paso[] = [
	{ desde: 10, texto: 'La portada es Inicio: la primera entrada del menú.', ...EN_MIS_ASIGNATURAS, foco: FOCOS.inicio, focoHasta: LLEGADA.pulsaInicio + 20 },
	{ desde: 131, texto: 'Clases de hoy sale de los días marcados en cada asignatura.', ...EN_LA_PORTADA, foco: FOCOS.clases },
	{ desde: 262, texto: 'Con horario oficial del colegio, sale de ahí, con la hora.', ...EN_LA_PORTADA, foco: FOCOS.clases },
	{ desde: 408, texto: 'Pulsa una clase: Asistencia para las faltas, y Logros.', ...EN_LA_PORTADA },
	{ desde: 571, texto: AVISO_DEL_VOCABULARIO, ...EN_LA_PORTADA, foco: FOCOS.unidades },
	{ desde: 699, texto: 'Mañana… enseña las clases de mañana.', voz: 'Mañana enseña las clases de mañana.', ...EN_LA_PORTADA, foco: FOCOS.manana, focoHasta: PORTADA.pulsaManana + 12 },
	{ desde: 801, texto: 'A la derecha, el calendario y los avisos del colegio.', ...EN_LA_PORTADA, foco: FOCOS.derecha },
];

export const TARJETA = 931;
export const DURACION = 1081;

export const CLAVE = 'docente-portada';

export const TITULO = 'La portada: lo que tienes hoy';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: Inicio' },
	{ desde: 131, titulo: 'Clases de hoy: de dónde salen' },
	{ desde: 408, titulo: 'Abrir una clase' },
	{ desde: 801, titulo: 'Lo que viene y los avisos' },
];

export const CIERRE: Cierre = {
	hiciste: 'Viste tus clases de hoy y abriste la de 9°B.',
	seVe: 'Cada clase de hoy es una fila, con el color y la sigla de su grupo.',
	despues: '¿Falta una? Sus días se marcan en «Asignaturas», con los botones de los días.',
	voz: '¿Falta una? Marca sus días en Asignaturas.',
};

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Las puertas propias: la fila se abre dentro del paso que lo cuenta, y «Mañana…» dentro del suyo. */
if (!(PORTADA.pulsaFila >= PASOS[3].desde && PORTADA.pulsaFila < PASOS[4].desde)) {
	throw new Error('Guion: la fila de 9°B se abre fuera del paso que lo explica.');
}
if (!(PORTADA.pulsaManana >= PASOS[5].desde && PORTADA.pulsaManana < PASOS[6].desde)) {
	throw new Error('Guion: «Mañana…» se pulsa fuera de su paso.');
}
