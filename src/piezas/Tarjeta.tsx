import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, estiloDeSalida, seVa } from '../comunes/movimiento';
import { DESCUENTO, TARJETA_CONDICION, TARJETA_PIE, TARJETA_TITULAR } from './datos';
import {
	T_CONDICION, T_CUENTA, T_FIN_CUENTA, T_PASO_SALIDA, T_PIE, T_SALIDA, T_TARJETA, T_TITULAR,
} from './guion';
import { ACENTO, BORDE, FONDO, FUENTE, TEXTO, TINTA_SUAVE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA TARJETA DEL DESCUENTO. Es la única pieza del vídeo que **pide algo**, y por eso va sola.
 *
 * EL NÚMERO SE CUENTA, no aparece. Un 30 que sube desde 0 en un segundo se mira; un 30 que aparece
 * hecho se lee y se olvida. Es el mismo truco que el total de la planilla recalculándose al teclear
 * una nota, y aquí sirve para lo mismo: obliga al ojo a quedarse en la cifra.
 *
 * LA CONDICIÓN VA DEBAJO Y ENTERA. Una oferta cuya letra pequeña no se lee en el vídeo se convierte
 * en una discusión en la reunión siguiente. Aquí la condición está al mismo tamaño de lectura que el
 * resto del texto: no hay letra pequeña.
 *
 * EL TEXTO ESTÁ PENDIENTE DE CONFIRMAR POR ÉL --las dos lecturas posibles están escritas en
 * `datos.ts`--. La animación no cambia cuando se decida; cambia una línea de texto.
 */
export const Tarjeta: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const tarjeta = entra(frame, fps, T_TARJETA, 22);
	const cuenta = Math.round(
		interpolate(frame, [T_CUENTA, T_FIN_CUENTA], [0, DESCUENTO], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);
	const titular = entra(frame, fps, T_TITULAR, 16);
	const condicion = entra(frame, fps, T_CONDICION, 18);
	const pie = entra(frame, fps, T_PIE, 16);

	const salTarjeta = estiloDeSalida(seVa(frame, 2, T_SALIDA, T_PASO_SALIDA, 16));

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<div
					style={{
						background: '#ffffff',
						border: `1px solid ${BORDE}`,
						borderRadius: 22,
						boxShadow: '0 18px 60px rgba(22, 32, 43, 0.12)',
						padding: '68px 96px',
						textAlign: 'center',
						opacity: tarjeta * salTarjeta.opacidad,
						transform: `translateY(${(1 - tarjeta) * 26}px) scale(${(0.94 + tarjeta * 0.06) * salTarjeta.escala})`,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14 }}>
						<span style={{ fontSize: 210, fontWeight: 700, letterSpacing: -8, color: ACENTO, lineHeight: 1 }}>
							{cuenta}
						</span>
						<span style={{ fontSize: 96, fontWeight: 600, color: ACENTO, lineHeight: 1 }}>%</span>
					</div>
					<div
						style={{
							fontSize: 46,
							fontWeight: 600,
							color: TEXTO,
							marginTop: 10,
							opacity: titular,
							transform: `translateY(${(1 - titular) * 12}px)`,
						}}
					>
						{TARJETA_TITULAR}
					</div>
					<div
						style={{
							width: 96,
							height: 3,
							borderRadius: 2,
							background: BORDE,
							margin: '34px auto',
							opacity: condicion,
						}}
					/>
					<div
						style={{
							fontSize: 36,
							color: TEXTO,
							opacity: condicion,
							transform: `translateY(${(1 - condicion) * 14}px)`,
						}}
					>
						{TARJETA_CONDICION}
					</div>
					<div style={{ fontSize: 26, color: TINTA_SUAVE, marginTop: 16, opacity: pie }}>
						{TARJETA_PIE}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
