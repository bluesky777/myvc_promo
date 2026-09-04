import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL PUNTERO. Va **dentro del panel**, no sobre el fotograma, y eso es lo que hace que sus
 * coordenadas sean las de la pantalla que se está enseñando: si el panel se mueve o se acerca, el
 * puntero se mueve con él y sigue señalando lo mismo.
 *
 * QUÉ APORTA: sin él, un botón que aparece solo se lee como que la pantalla hizo algo sola. Con él,
 * se lee como que **alguien lo hizo** -- que es lo que hay que enseñar cuando se vende una
 * herramienta que usa una persona.
 *
 * El blanco con borde oscuro no es decoración: es lo único que se ve igual sobre una casilla blanca
 * y sobre una fila sombreada.
 */

export interface Punto {
	frame: number;
	x: number;
	y: number;
}

interface Props {
	/** Por dónde pasa. Entre dos puntos va con aceleración y frenada, como una mano. */
	puntos: Punto[];
	/** Fotogramas en los que pulsa. */
	clics?: number[];
	aparece: number;
	sale: number;
	tam?: number;
	color?: string;
}

export const Cursor: React.FC<Props> = ({ puntos, clics = [], aparece, sale, tam = 30, color = '#1677ff' }) => {
	const frame = useCurrentFrame();

	if (puntos.length === 0) { return null; }

	const cuadros = puntos.map((p) => p.frame);
	const comun = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };

	const x = puntos.length === 1 ? puntos[0].x : interpolate(frame, cuadros, puntos.map((p) => p.x), comun);
	const y = puntos.length === 1 ? puntos[0].y : interpolate(frame, cuadros, puntos.map((p) => p.y), comun);

	const opacidad =
		interpolate(frame, [aparece, aparece + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
		interpolate(frame, [sale, sale + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	if (opacidad <= 0.001) { return null; }

	/* Al pulsar, el puntero se encoge un poco: es lo que hace que el clic se vea y no sólo se deduzca. */
	const hundido = clics.reduce((peor, c) => {
		const t = frame - c;
		if (t < 0 || t > 8) { return peor; }
		return Math.min(peor, interpolate(t, [0, 4, 8], [1, 0.84, 1]));
	}, 1);

	return (
		<div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', opacity: opacidad, zIndex: 40 }}>
			{/* La onda del clic sale del punto exacto de la punta. */}
			{clics.map((c) => {
				const t = frame - c;
				if (t < 0 || t > 22) { return null; }
				const r = interpolate(t, [0, 22], [6, 46]);
				const o = interpolate(t, [0, 22], [0.45, 0]);
				return (
					<div
						key={c}
						style={{
							position: 'absolute',
							left: -r, top: -r,
							width: r * 2, height: r * 2,
							borderRadius: '50%',
							border: `3px solid ${color}`,
							opacity: o,
						}}
					/>
				);
			})}

			<svg width={tam} height={tam * 1.4} viewBox="0 0 24 34" style={{ transform: `scale(${hundido})`, transformOrigin: '0 0' }}>
				<path
					d="M2 1.5 L2 27 L8.4 21.2 L12.3 30.6 L16.6 28.8 L12.7 19.6 L21 19.2 Z"
					fill="#fff"
					stroke="#101828"
					strokeWidth="1.6"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
};
