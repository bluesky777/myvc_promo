import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { FUENTE, TEXTO } from '../../notas/tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL AVISO DE ERROR: el mismo cartel que `notas/Aviso.tsx` (misma entrada, mismo sitio, misma
 * letra) con el círculo rojo de Ant y sitio para dos renglones, porque los errores de la
 * aplicación son frases largas («No se puede eliminar: hay 2 grupos que dependen de esto…»).
 * Va aparte para no tocar el `Aviso` de las notas, que tiene su comprobación byte a byte.
 */

export const AvisoError: React.FC<{ texto: string; desde: number; dura: number; tam?: number }> = ({ texto, desde, dura, tam = 34 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const t = frame - desde;
	if (t < 0) { return null; }

	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const y = interpolate(entrada, [0, 1], [-110, 0]) - salida * 40;
	const opacidad = entrada * (1 - salida);
	const escala = interpolate(entrada, [0, 0.6, 1], [0.86, 1.04, 1]) * (1 - salida * 0.06);

	if (opacidad <= 0.001) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				top: 30,
				left: 0,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				transform: `translateY(${y}px) scale(${escala})`,
				opacity: opacidad,
				zIndex: 40,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					maxWidth: 1560,
					padding: '22px 44px',
					borderRadius: 18,
					background: '#fff',
					fontFamily: FUENTE,
					fontSize: tam,
					lineHeight: 1.25,
					fontWeight: 600,
					color: TEXTO,
					boxShadow: '0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)',
				}}
			>
				<svg width="46" height="46" viewBox="0 0 24 24" aria-hidden style={{ flex: 'none' }}>
					<circle cx="12" cy="12" r="11" fill="#ff4d4f" />
					<path d="M8.2 8.2l7.6 7.6M15.8 8.2l-7.6 7.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
				</svg>
				<span>{texto}</span>
			</div>
		</div>
	);
};
