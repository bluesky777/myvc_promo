import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DEDO. En un teléfono no hay puntero, así que **no se usa el de `Cursor.tsx`**: una flecha de
 * ratón sobre una pantalla táctil dice que eso se maneja con ratón, y lo que se está enseñando es
 * una app que un acudiente abre en el bus.
 *
 * Es un disco translúcido con su aro, que es como se marca el toque en las grabaciones de pantalla
 * de Android y de iOS. Al tocar, la onda: sin ella no se distingue un dedo que pasa de un dedo que
 * pulsa, y el clip entero va de qué pasa **al pulsar**.
 */

export interface Punto {
	frame: number;
	x: number;
	y: number;
}

interface Props {
	puntos: Punto[];
	toques?: number[];
	aparece: number;
	sale: number;
	tam?: number;
}

export const Toque: React.FC<Props> = ({ puntos, toques = [], aparece, sale, tam = 40 }) => {
	const frame = useCurrentFrame();
	if (puntos.length === 0) { return null; }

	const comun = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
	const cuadros = puntos.map((p) => p.frame);
	const x = puntos.length === 1 ? puntos[0].x : interpolate(frame, cuadros, puntos.map((p) => p.x), comun);
	const y = puntos.length === 1 ? puntos[0].y : interpolate(frame, cuadros, puntos.map((p) => p.y), comun);

	const opacidad =
		interpolate(frame, [aparece, aparece + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
		interpolate(frame, [sale, sale + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (opacidad <= 0.001) { return null; }

	/* Al pulsar, el disco se encoge: es lo que hace que el toque se vea y no sólo se deduzca. */
	const hundido = toques.reduce((peor, t) => {
		const d = frame - t;
		if (d < 0 || d > 8) { return peor; }
		return Math.min(peor, interpolate(d, [0, 4, 8], [1, 0.78, 1]));
	}, 1);

	return (
		<div style={{ position: 'absolute', left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, pointerEvents: 'none', zIndex: 40, opacity: opacidad }}>
			{toques.map((t) => {
				const d = frame - t;
				if (d < 0 || d > 24) { return null; }
				const r = interpolate(d, [0, 24], [tam / 2, tam * 1.5]);
				const o = interpolate(d, [0, 24], [0.5, 0]);
				return (
					<div key={t} style={{ position: 'absolute', left: tam / 2 - r, top: tam / 2 - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '3px solid rgba(255,255,255,.95)', boxShadow: '0 0 0 1px rgba(0,0,0,.25)', opacity: o }} />
				);
			})}
			<div
				style={{
					width: '100%', height: '100%', borderRadius: '50%',
					background: 'rgba(255,255,255,.42)',
					border: '2px solid rgba(255,255,255,.95)',
					boxShadow: '0 2px 10px rgba(0,0,0,.28), inset 0 0 0 1px rgba(0,0,0,.12)',
					transform: `scale(${hundido})`,
				}}
			/>
		</div>
	);
};
