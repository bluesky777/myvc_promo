import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { FUENTE, TEXTO } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL AVISO DEL LOTE: **UNO, no uno por nota**. Es la segunda mitad de lo que enseña el clip.
 *
 * Lo pidió quien usa la pantalla el 2026-08-27: «un aviso por lote, con las notas separadas por
 * coma». Y no enumera lo que se mandó: enumera **lo que el servidor confirmó**. Si de tres notas
 * fallara una, aquí saldrían dos y la tercera se quedaría con su aro en rojo sobre su celda -- no
 * hay ningún sitio donde este aviso pueda decir que se guardó algo que no se guardó.
 *
 * La forma es la del `nz-message` de Ant: arriba y centrado, entra deslizándose desde el borde.
 */

interface Props {
	texto: string;
	/** Fotograma en el que sale. Es el mismo en el que se apagan los aros: el lote volvió. */
	desde: number;
	/** Lo que dura antes de irse. En la aplicación, `nzDuration: 2500`. */
	dura: number;
}

export const Aviso: React.FC<Props> = ({ texto, desde, dura }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const t = frame - desde;
	if (t < 0) { return null; }

	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const y = interpolate(entrada, [0, 1], [-110, 0]) - salida * 40;
	const opacidad = entrada * (1 - salida);

	/*
	 * UN GOLPE DE ESCALA AL ENTRAR. El aviso es lo que cierra la historia del clip --«las tres
	 * salieron»--, así que tiene que **llegar**, no asomarse: entra un pelín grande y se asienta.
	 */
	const escala = interpolate(entrada, [0, 0.6, 1], [0.86, 1.04, 1]) * (1 - salida * 0.06);

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
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: '26px 52px',
					borderRadius: 18,
					background: '#fff',
					fontFamily: FUENTE,
					fontSize: 44,
					fontWeight: 600,
					color: TEXTO,
					boxShadow:
						'0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)',
				}}
			>
				{/* El círculo de «bien» de Ant, dibujado: así no hace falta cargar la fuente de iconos. */}
				<svg width="50" height="50" viewBox="0 0 24 24" aria-hidden>
					<circle cx="12" cy="12" r="11" fill="#52c41a" />
					<path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				<span style={{ fontVariantNumeric: 'tabular-nums' }}>{texto}</span>
			</div>
		</div>
	);
};
