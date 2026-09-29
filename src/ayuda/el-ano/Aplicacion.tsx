import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Cursor, type Punto } from '../../comunes/Cursor';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN, enElFotograma } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APLICACIÓN DENTRO DEL FOTOGRAMA, CON EL MENÚ DE RECTORÍA Y CUALQUIER SECCIÓN ABIERTA: lo que
 * comparten los nueve vídeos de «montar el año» de la ola 2 y 3. Es `montar-el-ano/EnLaCascara`
 * sin atarse a «Referencias»: la ficha del colegio y los ajustes cuelgan de «Configuración».
 *
 * Todo lo de dentro va en coordenadas de la cáscara (1440 × 900); aquí se escala una sola vez, con
 * `ESCALA_CASCARA` y `ORIGEN`, que es lo que usa `enElFotograma()` para los focos.
 */

export interface Rect { x: number; y: number; ancho: number; alto: number }

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/** Una entrada del menú directivo por sus textos: índices, rectángulo y punto donde pulsa. */
export function entradaDelMenu(seccion: string, hija?: string) {
	const e = entradaDe(MENU_DIRECTIVO, seccion, hija);
	return {
		...e,
		/** El rectángulo con su sección `abierta` (o ninguna) desplegada, en coordenadas de la cáscara. */
		rect: (abierta: boolean): Rect => ({
			x: 0,
			y: alturaEnMenu(MENU_DIRECTIVO, e.seccion, e.hija, abierta ? e.seccion : null),
			ancho: MEDIDAS.menu,
			alto: e.hija === null ? MEDIDAS.seccion : MEDIDAS.hija,
		}),
	};
}

export function puntoDelMenu(seccion: string, hija?: string) {
	const e = entradaDelMenu(seccion, hija);
	const r = e.rect(hija !== undefined);
	return { x: 150, y: r.y + r.alto / 2 };
}

export function focoDelMenu(seccion: string, hija?: string) {
	const e = entradaDelMenu(seccion, hija);
	return enElFotograma(e.rect(hija !== undefined));
}

/** De dónde sale el puntero al empezar: abajo, sobre la pantalla vacía. */
export const ENTRADA_DEL_PUNTERO = { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 };

/** Un rectángulo de la cáscara al fotograma, con margen, recortado a lo que se ve de la cáscara. */
export const alFotograma = (r: Rect, margen = 6, radio = 10) => {
	const y = Math.max(r.y - margen, MEDIDAS.barra);
	const abajo = Math.min(r.y + r.alto + margen, MEDIDAS.alto - 6);
	return { ...enElFotograma({ x: r.x - margen, y, ancho: r.ancho + margen * 2, alto: abajo - y }), radio };
};

export const Aplicacion: React.FC<{
	/** La sección desplegada (su texto) y cuánto (0..1). */
	abierta: { seccion: string; t: number } | null;
	senalada: { seccion: number; hija: number | null } | null;
	opacidad?: number;
	children?: React.ReactNode;
	/** Lo que va encima de toda la cáscara: un modal con su máscara. */
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
	periodo?: string;
}> = ({ abierta, senalada, opacidad = 1, children, encima, cursor, periodo }) => (
	<AbsoluteFill>
		<div
			style={{
				position: 'absolute',
				left: ORIGEN.x,
				top: ORIGEN.y,
				width: MEDIDAS.ancho * ESCALA_CASCARA,
				height: MEDIDAS.alto * ESCALA_CASCARA,
				opacity: opacidad,
			}}
		>
			<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
				<Cascara
					menu={MENU_DIRECTIVO}
					abierta={abierta ? { seccion: entradaDe(MENU_DIRECTIVO, abierta.seccion).seccion, t: abierta.t } : null}
					senalada={senalada}
					periodo={periodo}
				>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);
