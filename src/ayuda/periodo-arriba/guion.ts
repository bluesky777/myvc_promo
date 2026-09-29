import { rectanguloDeMando } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { Cierre } from '../Tarjeta';
import { Capitulo, Paso, compruebaElGuion, compruebaLosCapitulos } from '../tiempos';
import { MIGAS_ALTO, alFotograma, centro, holgura, union } from '../moverse/comun';
import { MA } from '../mis-asignaturas/datos';
import { COLUMNAS, PANEL, PIE, TEXTOS, rectDeAnio, rectDePeriodo } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL AÑO Y EL PERIODO SE CAMBIAN ARRIBA» (Moverse por MyVC, ola 1).
 *
 * LA DUDA QUE MATA: **«elegido» no es «en curso»**; y al cambiar de año te mueve de periodo y lo
 * avisa. Casi todos los «no veo mis notas» empiezan con un periodo elegido que no es el que el
 * docente cree.
 *
 * CUATRO ACTOS
 *
 *     1. DÓNDE ESTÁ     la píldora de la barra, en cualquier pantalla (se parte de Mis asignaturas)
 *     2. LO QUE DICE    años a la izquierda, periodos a la derecha; el chulo y la etiqueta «en curso»
 *     3. CAMBIAR        el periodo: mensaje y la pantalla se vuelve a montar; el año: mismo número o
 *                       el último, con su segundo mensaje
 *     4. VOLVER         queda guardado en la cuenta; se vuelve eligiendo 2026 y el «en curso»
 *
 * EL RITMO ES EL DE LA APLICACIÓN. Cada cambio es un PATCH a la sesión, luego `auth/me`: medio
 * segundo (15 fotogramas) entre el clic y el mensaje. La pantalla de debajo se destruye y se vuelve
 * a montar sin recargar (`paginas/panel/panel.html:274`, la `epoca`).
 *
 * LA LICENCIA: los mensajes de Ant duran 3 s. El del segundo periodo se queda mientras el paso que
 * lo explica lo explica, igual que el aviso de la planilla; quitarlo antes dejaría al rótulo
 * hablando de algo que ya no está.
 */

export const FPS = 30;

/** Del clic a que vuelve la sesión y sale el mensaje. */
export const IDA_Y_VUELTA = 15;

export const T = {
	cursorEntra: 14,
	llegaSelector: 40,
	pulsaSelector: 50,
	abre: 52,

	llegaP4: 610,
	pulsaP4: 625,
	llega2025: 733,
	pulsa2025: 745,
	llega2026: 1128,
	pulsa2026: 1138,
	llegaP4b: 1168,
	pulsaP4b: 1180,
	cursorSale: 1225,
};

export const VUELVE = {
	p4: T.pulsaP4 + IDA_Y_VUELTA,
	a2025: T.pulsa2025 + IDA_Y_VUELTA,
	a2026: T.pulsa2026 + IDA_Y_VUELTA,
	p4b: T.pulsaP4b + IDA_Y_VUELTA,
};

/** Lo que está elegido en cada momento: cambia cuando vuelve el servidor, no al pulsar. */
export function elegido(frame: number): { anio: string; periodo: number; epoca: number } {
	if (frame >= VUELVE.p4b) { return { anio: '2026', periodo: 4, epoca: VUELVE.p4b }; }
	if (frame >= VUELVE.a2026) { return { anio: '2026', periodo: 3, epoca: VUELVE.a2026 }; }
	if (frame >= VUELVE.a2025) { return { anio: '2025', periodo: 3, epoca: VUELVE.a2025 }; }
	if (frame >= VUELVE.p4) { return { anio: '2026', periodo: 4, epoca: VUELVE.p4 }; }
	return { anio: '2026', periodo: 3, epoca: 0 };
}

export const EPOCAS = [0, VUELVE.p4, VUELVE.a2025, VUELVE.a2026, VUELVE.p4b];

/* ── Dónde cae cada cosa ──────────────────────────────────────────────────────────────────── */

const subtitulo = { x: MEDIDAS.menu + MA.lados - 6, y: MEDIDAS.barra + MA.arriba + MIGAS_ALTO + MA.titulo - 2, ancho: 540, alto: MA.subtitulo + 4, radio: 6 };

export const FOCOS = {
	selector: alFotograma(holgura(rectanguloDeMando('selector'), 4), 20),
	columnas: alFotograma(COLUMNAS, 10),
	elegidoYEnCurso: alFotograma(holgura(union(rectDePeriodo(3), rectDePeriodo(4)), 3), 8),
	subtitulo: alFotograma(subtitulo, 8),
	anios: alFotograma(holgura(union(rectDeAnio(0), rectDeAnio(1)), 4), 8),
	pie: alFotograma(PIE, 8),
	panel: alFotograma(holgura(PANEL, 2), 12),
};

export const PUNTOS = {
	entrada: { x: 760, y: 700 },
	selector: centro(rectanguloDeMando('selector')),
	reposo: { x: PANEL.x - 70, y: PANEL.y + 250 },
	p4: { x: rectDePeriodo(4).x + 70, y: centro(rectDePeriodo(4)).y },
	a2025: { x: rectDeAnio(1).x + 60, y: centro(rectDeAnio(1)).y },
	a2026: { x: rectDeAnio(0).x + 60, y: centro(rectDeAnio(0)).y },
};

/* ── Los pasos ─────────────────────────────────────────────────────────────────────────────── */

const ARRIBA = { ubicacion: 'Barra de arriba ▸ Año y periodo', url: 'En todas las pantallas, a la derecha' };

export const PASOS: Paso[] = [
	{ desde: 8, texto: 'El año y el periodo se eligen arriba.', ...ARRIBA, foco: FOCOS.selector, focoHasta: T.pulsaSelector + 12 },
	{ desde: 106, texto: 'Años a la izquierda, periodos a la derecha.', ...ARRIBA, foco: FOCOS.columnas },
	{ desde: 220, texto: 'El chulo es el elegido; «en curso», el del colegio.', ...ARRIBA, foco: FOCOS.elegidoYEnCurso },
	{ desde: 361, texto: 'Lo que ves es del elegido.', ...ARRIBA, foco: FOCOS.subtitulo },
	{ desde: 440, texto: 'Boletines, semáforo y notas del año usan este periodo: revísalo antes de imprimir.', ...ARRIBA, foco: FOCOS.selector, focoHasta: T.llegaP4 - 20 },
	{ desde: VUELVE.p4, texto: 'Al elegir otro, la pantalla se recarga.', ...ARRIBA },
	{ desde: VUELVE.a2025, texto: 'Al cambiar de año, te deja en el mismo periodo.', ...ARRIBA },
	{ desde: 882, texto: '2025 no tiene periodo 4: te deja en el 3.', ...ARRIBA },
	{ desde: 1027, texto: 'Queda guardado en tu cuenta.', ...ARRIBA, foco: FOCOS.pie },
	{ desde: 1108, texto: 'Para volver: 2026 y el «en curso».', ...ARRIBA },
];

export const TARJETA = 1255;
export const DURACION = 1375;

export const CLAVE = 'periodo-arriba';
export const TITULO = 'El año y el periodo se cambian arriba';

export const CAPITULOS: Capitulo[] = [
	{ desde: 0, titulo: 'Dónde está: la barra de arriba' },
	{ desde: PASOS[2].desde, titulo: 'Elegido no es «en curso»' },
	{ desde: T.pulsaP4, titulo: 'Cambiar de periodo' },
	{ desde: T.pulsa2025, titulo: 'Cambiar de año: te mueve y lo avisa' },
	{ desde: PASOS[8].desde, titulo: 'Se guarda en tu cuenta' },
];

export const CIERRE: Cierre = {
	hiciste: 'Cambiaste de periodo y de año desde la barra de arriba.',
	seVe: 'La píldora de arriba dice qué tienes elegido; «en curso» es el del colegio.',
	despues: 'Ir a cualquier sitio escribiendo: el Buscador mágico.',
	voz: 'Siguiente: el Buscador mágico.',
};

/* LOS MENSAJES, con el tiempo de Ant (3 s) salvo el que explica el paso 8. */
export const MENSAJES = [
	{ texto: TEXTOS.periodoCambiado(4), tipo: 'exito' as const, desde: VUELVE.p4, dura: 90 },
	{ texto: TEXTOS.anioCambiado('2025'), tipo: 'exito' as const, desde: VUELVE.a2025, dura: 90 },
	{ texto: TEXTOS.sinEsePeriodo(4, 3), tipo: 'info' as const, desde: VUELVE.a2025 + 3, dura: PASOS[8].desde - VUELVE.a2025 - 3 },
	{ texto: TEXTOS.anioCambiado('2026'), tipo: 'exito' as const, desde: VUELVE.a2026, dura: 90 },
	{ texto: TEXTOS.periodoCambiado(4), tipo: 'exito' as const, desde: VUELVE.p4b, dura: 90 },
];

compruebaElGuion(PASOS, FPS, TARJETA);
compruebaLosCapitulos(CAPITULOS, DURACION);

/* Cada mensaje sale donde empieza el paso que lo explica. */
if (PASOS[5].desde !== VUELVE.p4 || PASOS[6].desde !== VUELVE.a2025) {
	throw new Error('Guion: un mensaje no sale donde empieza el paso que lo explica.');
}
/* Los dos clics de la vuelta caen dentro del último paso. */
if (T.pulsa2026 < PASOS[9].desde || VUELVE.p4b + 60 > TARJETA) {
	throw new Error('Guion: la vuelta a 2026 no cabe en su paso.');
}
