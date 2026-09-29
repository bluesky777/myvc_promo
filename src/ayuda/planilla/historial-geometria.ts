import { ENCUADRE } from '../../comunes/encuadre';
import { geometriaDePlanilla } from '../../notas/Escena';
import { HUECO_DE_LA_AYUDA, SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DÓNDE CAE LA COLUMNA «HISTORIAL». La planilla dibujada (`notas/Escena`) no la tiene y es común con
 * el promocional, así que este vídeo la pinta encima, pegada a la derecha de «Tard», con el `sobre`
 * de la escena (coordenadas del panel). Aquí están sus medidas y su paso al fotograma, para que el
 * puntero y el foco caigan donde se pinta.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */

const G = geometriaDePlanilla();
const TARD = G.columna('tardanzas');

/** «Frases» (el botón redondo del comentario del boletín), que en app2 va justo antes de «Historial». */
export const ANCHO_FRASES = 72;
/** Lo que mide «Historial»: la fecha con su reloj, en una línea. */
export const ANCHO_HISTORIAL = 228;
/** Las dos columnas nuevas juntas. */
export const ANCHO_NUEVAS = ANCHO_FRASES + ANCHO_HISTORIAL;

export const HISTORIAL = {
	/** El panel de la planilla, tal como lo mide la escena. */
	panel: { ancho: G.ancho, alto: G.alto },
	/** Donde acaba hoy la tabla, por fuera de su borde. */
	finDeLaTabla: TARD.x + TARD.ancho + 1,
	/** La columna entera, de la cabecera a la última fila. */
	columna: { x: TARD.x + TARD.ancho + ANCHO_FRASES, y: TARD.y, ancho: ANCHO_HISTORIAL, alto: TARD.alto },
	/** El alto de la cabecera de dos pisos: el de «Tard». */
	cabecera: G.cabeceraDe('tardanzas').alto,
	/** Una celda de la columna, en la fila que se ve en el puesto `puesto`. */
	celda: (puesto: number) => {
		const c = G.celda(puesto, 'tardanzas');
		return { x: TARD.x + TARD.ancho + ANCHO_FRASES, y: c.y, ancho: ANCHO_HISTORIAL, alto: c.alto };
	},
};

/** Lo que se corre la cámara a la izquierda para que quepa la columna: la mitad de su ancho. */
export const CORRE = (ANCHO_NUEVAS * ENCUADRE.planilla * HUECO_DE_LA_AYUDA) / 2;

/**
 * DEL PANEL AL FOTOGRAMA en el fotograma `frame` de la escena de la planilla, con su acercamiento
 * lento (de `ENCUADRE.planilla` a +0,05 entre 0 y `salida + 46`, como en `notas/Escena`) y la cámara
 * ya corrida.
 */
export function historialEnElFotograma(
	r: { x: number; y: number; ancho: number; alto: number },
	frame: number,
	salida: number,
	corrido = 1,
) {
	const t = Math.min(1, Math.max(0, frame / (salida + 46)));
	const k = (ENCUADRE.planilla + 0.05 * t) * HUECO_DE_LA_AYUDA;
	return {
		x: 1920 / 2 - CORRE * corrido + (r.x - G.ancho / 2) * k,
		y: 1080 / 2 + SUBE_LA_PANTALLA + (r.y - G.alto / 2) * k,
		ancho: r.ancho * k,
		alto: r.alto * k,
	};
}
