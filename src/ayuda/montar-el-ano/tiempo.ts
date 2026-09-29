import { interpolate } from 'remotion';

import { escrito } from '../../comunes/movimiento';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE REPITEN LOS SEIS GUIONES: la llegada por el menú, lo tecleado y el parpadeo del cursor de
 * texto. Los tiempos de la llegada son los de `cierre-1` y `planilla`, para que los vídeos de la
 * ayuda tengan todos el mismo pulso en sus primeros cinco segundos.
 */

export interface Llegada {
	cursorEntra: number;
	llegaReferencias: number;
	pulsaReferencias: number;
	abreReferencias: number;
	llegaEntrada: number;
	pulsaEntrada: number;
	monta: number;
}

export const LLEGADA: Llegada = {
	cursorEntra: 20,
	llegaReferencias: 58,
	pulsaReferencias: 64,
	abreReferencias: 66,
	llegaEntrada: 150,
	pulsaEntrada: 162,
	monta: 166,
};

export const entre = (f: number, desde: number, hasta: number) => f >= desde && f < hasta;

/** Lo que va escrito de `texto` si se empieza a teclear en `desde`, a `porTecla` fotogramas cada letra. */
export const tecleado = (f: number, texto: string, desde: number, porTecla = 4) => escrito(f, texto, desde, porTecla);

/** Cuándo acaba de teclearse. */
export const finDelTecleo = (texto: string, desde: number, porTecla = 4) => desde + texto.length * porTecla;

/** El palito del campo de texto: se ve mientras el campo tiene el foco, parpadeando. */
export const parpadea = (f: number) => f % 30 < 16;

/** Un 0..1 lineal entre dos fotogramas. */
export const avance = (f: number, desde: number, hasta: number) =>
	interpolate(f, [desde, hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Cuánto dura en pantalla un aviso de la aplicación: `nzDuration` en milisegundos, a fotogramas. */
export const fotogramasDe = (ms: number) => Math.round((ms / 1000) * 30);
