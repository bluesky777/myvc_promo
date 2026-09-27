import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, estiloDeSalida, seVa } from '../comunes/movimiento';
import { TOPE, TarjetaOferta } from './Oferta';
import {
	T_CONDICION, T_CUENTA, T_FIN_CUENTA, T_PASO_SALIDA, T_PIE, T_SALIDA, T_TARJETA, T_TITULAR,
} from './guion';
import { FONDO, FUENTE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA TARJETA DEL TRATO, SOLA. Es la única pieza del vídeo que **pide algo**, y por eso va sola.
 *
 * LA MISMA TARJETA REMATA EL CLIP `Trato`, que además cuenta antes las tres razones. Ésta se queda
 * porque el montador puede necesitarla suelta --para una diapositiva, para el correo de después--,
 * pero **el dibujo y el texto son los mismos** (`Oferta.tsx`, `datos.ts`): si mañana cambia la
 * oferta, cambia en un sitio y las dos piezas dicen lo mismo.
 */
export const Tarjeta: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<TarjetaOferta
					t={entra(frame, fps, T_TARJETA, 22)}
					cuenta={Math.round(interpolate(frame, [T_CUENTA, T_FIN_CUENTA], [0, TOPE], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
					tTitular={entra(frame, fps, T_TITULAR, 16)}
					tCondicion={entra(frame, fps, T_CONDICION, 18)}
					tPie={entra(frame, fps, T_PIE, 16)}
					salida={estiloDeSalida(seVa(frame, 2, T_SALIDA, T_PASO_SALIDA, 16))}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
