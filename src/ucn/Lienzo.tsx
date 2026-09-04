import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

import { cargarFuentes } from './fuentes';
import { CON_ROTULO, ESCALA, PANTALLA, RAYA2, SANS, SERIF, TINTA, TINTA2 } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL FOTOGRAMA: fondo, la pantalla del portal centrada y --si lo lleva-- el rótulo de abajo.
 *
 * Está aquí una sola vez porque **los seis clips del portal tienen que verse del mismo tamaño**. Si
 * cada escena decidiera su escala, dos clips montados seguidos enseñarían el portal a dos tamaños y
 * el salto se vería aunque cada uno por separado estuviese bien. Es la misma razón por la que los
 * clips de MyVC tienen `comunes/encuadre.ts`.
 *
 * EL FONDO ES PAPEL OSCURO, no blanco ni negro: el portal ya es crema, y sobre blanco se le pierde
 * el borde. Sobre este tono se le ve el canto y la sombra lo despega de la mesa.
 */

export const FONDO = '#E4DCCB';

export const Lienzo: React.FC<{ conRotulo: boolean; children: React.ReactNode }> = ({ conRotulo, children }) => {
	cargarFuentes();
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: SANS, color: TINTA }}>{children}</AbsoluteFill>
	);
};

/**
 * LA PANTALLA DEL PORTAL DENTRO DEL FOTOGRAMA.
 *
 * **Va aparte del `Lienzo` a propósito, y esto costó un render entero.** Al principio el lienzo
 * envolvía a todos sus hijos en esta caja escalada, y el rótulo, que también es hijo suyo, se
 * escalaba con ella y acababa **impreso por encima de la pantalla**. No dio ningún error: salió en
 * el MP4 y sólo se vio sacándole un fotograma al fichero ya renderizado.
 *
 * Ahora la caja escalada envuelve **sólo** a la pantalla; el rótulo es hermano suyo y vive en el
 * fotograma, que es donde le toca.
 */
export const Pantalla: React.FC<{ conRotulo: boolean; children: React.ReactNode }> = ({ conRotulo, children }) => {
	const escala = ESCALA * (conRotulo ? CON_ROTULO : 1);

	return (
		<AbsoluteFill style={{ alignItems: 'center', justifyContent: conRotulo ? 'flex-start' : 'center', paddingTop: conRotulo ? 26 : 0 }}>
			<div
				style={{
					width: PANTALLA.ancho,
					height: PANTALLA.alto,
					transform: `scale(${escala})`,
					transformOrigin: conRotulo ? 'top center' : 'center center',
					borderRadius: 10,
					overflow: 'hidden',
					border: `1px solid ${RAYA2}`,
					boxShadow: '0 30px 70px rgba(30,29,25,.22), 0 4px 14px rgba(30,29,25,.10)',
					position: 'relative',
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

export interface Frase {
	desde: number;
	hasta: number;
	titulo: string;
	pie: string;
}

/*
 * EL RÓTULO. Una frase cada vez, abajo y centrada, y **se cambia con la escena, no con el reloj**:
 * cada frase entra cuando en la pantalla ya se ve lo que dice. Un rótulo que se adelanta cuenta el
 * final antes de que pase.
 */
export const Rotulo: React.FC<{ frases: Frase[] }> = ({ frases }) => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{ pointerEvents: 'none' }}>
			{frases.map((f) => {
				const a = interpolate(frame, [f.desde, f.desde + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
				const b = interpolate(frame, [f.hasta, f.hasta + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
				const o = a * b;
				if (o <= 0.001) { return null; }

				return (
					<div
						key={f.titulo}
						style={{
							position: 'absolute',
							left: 140,
							right: 140,
							bottom: 46,
							textAlign: 'center',
							opacity: o,
							transform: `translateY(${interpolate(a, [0, 1], [16, 0])}px)`,
						}}
					>
						<div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 500, color: TINTA, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{f.titulo}</div>
						<div style={{ fontSize: 22, color: TINTA2, marginTop: 10, lineHeight: 1.35 }}>{f.pie}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
