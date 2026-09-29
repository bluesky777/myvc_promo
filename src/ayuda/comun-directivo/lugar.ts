import { interpolate } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { enElFotograma } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO, alturaDeNieta, alturaEnMenu, entradaDe } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE COMPARTEN LOS VÍDEOS DE RECTORÍA QUE NO SON DE «MONTAR EL AÑO»: frases y compañía,
 * votaciones, promocionar notas y los cuatro del horario.
 *
 * `montar-el-ano/EnLaCascara` deja fija la sección Referencias; éstos abren cualquier sección --y
 * a veces dos seguidas, como el menú de verdad, que cierra una al abrir otra--. Todo va en
 * coordenadas de la cáscara (1440 × 900), y `enElFotograma()` lo pasa al fotograma.
 */

export interface Rect { x: number; y: number; ancho: number; alto: number }

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/** Un rectángulo de la cáscara al fotograma, con margen: lo que usa el foco. */
export const foco = (r: Rect, margen = 6) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 4);
	return enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y });
};

/*
 * EL MARCO DE LA PÁGINA, el de `panel.scss`: lienzo gris de 24 y panel blanco con 16 de relleno.
 * Las pantallas con `max-width` (Horario, 62rem = 992) se centran dentro.
 */
export const LIENZO = 24;
export const RELLENO = 16;
export const PANEL = { x: MEDIDAS.menu + LIENZO, y: MEDIDAS.barra + LIENZO, ancho: MEDIDAS.ancho - MEDIDAS.menu - LIENZO * 2 };
export const MAIN = { x: PANEL.x + RELLENO, y: PANEL.y + RELLENO, ancho: PANEL.ancho - RELLENO * 2 };

export const mainDe = (ancho: number) => ({ x: MAIN.x + Math.max(0, (MAIN.ancho - ancho) / 2), y: MAIN.y, ancho: Math.min(ancho, MAIN.ancho) });

/* ── El menú ──────────────────────────────────────────────────────────────────────────────── */

export const MENU = MENU_DIRECTIVO;

export const seccionDe = (etiqueta: string) => entradaDe(MENU, etiqueta).seccion;
export const hijaDe = (seccion: string, hija: string) => entradaDe(MENU, seccion, hija).hija!;

/** La entrada del menú con la sección `abierta` desplegada (o ninguna). */
export function rectDelMenu(seccion: string, hija: string | null, abierta: string | null): Rect {
	const s = seccionDe(seccion);
	const h = hija === null ? null : hijaDe(seccion, hija);
	return {
		x: 0,
		y: alturaEnMenu(MENU, s, h, abierta === null ? null : seccionDe(abierta)),
		ancho: MEDIDAS.menu,
		alto: h === null ? MEDIDAS.seccion : MEDIDAS.hija,
	};
}

/** Una nieta, con su sección y su hija desplegadas. */
export function rectDeNieta(seccion: string, hija: string, nieta: string): Rect {
	const s = seccionDe(seccion);
	const h = hijaDe(seccion, hija);
	const n = MENU[s].nietas?.[hija]?.indexOf(nieta) ?? -1;
	if (n < 0) { throw new Error(`Menú: «${hija}» no tiene «${nieta}».`); }
	return { x: 0, y: alturaDeNieta(MENU, s, h, n), ancho: MEDIDAS.menu, alto: MEDIDAS.hija };
}

export const puntoDe = (r: Rect) => ({ x: 150, y: r.y + r.alto / 2 });

/** De dónde sale el puntero al empezar: abajo, sobre la pantalla vacía. */
export const ENTRADA_DEL_PUNTERO = { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 };

/*
 * QUÉ SECCIÓN ESTÁ ABIERTA EN CADA FOTOGRAMA. Un tramo abre en `abre` y, si tiene `cierra`, se
 * recoge ahí en 16 fotogramas. La siguiente espera a que la anterior se haya recogido: el menú de
 * verdad es de una sección a la vez.
 */
export interface Tramo { seccion: string; abre: number; cierra?: number }

export function abiertaEn(f: number, fps: number, tramos: Tramo[]): { seccion: number; t: number } | null {
	for (let i = tramos.length - 1; i >= 0; i--) {
		const tr = tramos[i];
		if (f < tr.abre) { continue; }
		const t = entra(f, fps, tr.abre, 16) * (tr.cierra === undefined ? 1 : 1 - interpolate(f, [tr.cierra, tr.cierra + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
		return { seccion: seccionDe(tr.seccion), t: Math.max(0, t) };
	}
	return null;
}

/** El ratón encima de una entrada del menú, entre que llega y un poco después de pulsar. */
export interface Senal { desde: number; hasta: number; seccion: string; hija: string | null }

export function senaladaEn(f: number, senales: Senal[]) {
	const s = senales.find((x) => f >= x.desde && f < x.hasta);
	if (!s) { return null; }
	return { seccion: seccionDe(s.seccion), hija: s.hija === null ? null : hijaDe(s.seccion, s.hija) };
}

export const entre = (f: number, desde: number, hasta: number) => f >= desde && f < hasta;

export const avance = (f: number, desde: number, hasta: number) =>
	interpolate(f, [desde, hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const fotogramasDe = (ms: number) => Math.round((ms / 1000) * 30);
