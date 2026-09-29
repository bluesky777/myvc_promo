import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../comunes/movimiento';
import { FONDO, FUENTE, PAPEL, TINTA, TINTA_SUAVE } from './tema';
import { Efecto, RETRASO_VOZ, Voz } from './voz';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA TARJETA DEL FINAL: tres líneas, quietas tres segundos.
 *
 * POR QUÉ NO SE ACABA Y YA. Quien mira un vídeo de ayuda lo hace **con la pantalla de verdad
 * delante**, y lo que hace al terminar es pausar para volver a mirar qué era lo que había que
 * pulsar. Si el vídeo termina en negro, o en la pantalla yéndose, lo que se queda congelado es el
 * momento en que ya no hay nada. Tres segundos quietos son los que valen para eso.
 *
 * TRES LÍNEAS Y NO UN RESUMEN: **qué hiciste**, **dónde se ve que salió bien**, y **qué mirar
 * después**. La segunda es la que más se usa: casi todas las llamadas son «¿se guardó?», no «¿cómo
 * se hace?».
 */

export interface Cierre {
	/** Qué acabas de hacer. En pasado y en una línea. */
	hiciste: string;
	/** Dónde se ve que salió bien. Lo que hay que mirar en la pantalla, no una promesa. */
	seVe: string;
	/** El vídeo siguiente, o lo que conviene aprender después. Puede faltar. */
	despues?: string;
	/** Lo que dice la voz sobre la tarjeta. Si falta, dice `despues`, o `seVe` si tampoco hay. */
	voz?: string;
}

export const Tarjeta: React.FC<{ cierre: Cierre; desde: number }> = ({ cierre, desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const sonido = (
		<>
			<Efecto cual="tarjeta" en={desde} />
			<Voz texto={cierre.voz ?? cierre.despues ?? cierre.seVe} en={desde + RETRASO_VOZ} />
		</>
	);
	if (frame < desde - 12) { return sonido; }

	const a = entra(frame, fps, desde, 18);

	return (
		<AbsoluteFill
			style={{
				background: FONDO,
				fontFamily: FUENTE,
				alignItems: 'center',
				justifyContent: 'center',
				opacity: interpolate(frame, [desde - 12, desde + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
				zIndex: 50,
			}}
		>
			{sonido}
			<div
				style={{
					width: 1180,
					background: PAPEL,
					borderRadius: 20,
					padding: '52px 60px',
					boxShadow: '0 28px 72px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .06)',
					transform: `translateY(${interpolate(a, [0, 1], [26, 0])}px) scale(${interpolate(a, [0, 1], [0.985, 1])})`,
				}}
			>
				<Linea rotulo="Lo que hiciste" texto={cierre.hiciste} retraso={0} desde={desde} />
				<Linea rotulo="Dónde se ve que salió bien" texto={cierre.seVe} retraso={10} desde={desde} />
				{cierre.despues && <Linea rotulo="Después" texto={cierre.despues} retraso={20} desde={desde} />}
			</div>
		</AbsoluteFill>
	);
};

const Linea: React.FC<{ rotulo: string; texto: string; retraso: number; desde: number }> = ({ rotulo, texto, retraso, desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, desde + retraso, 16);

	return (
		<div style={{ marginTop: retraso === 0 ? 0 : 30, opacity: a, transform: `translateY(${interpolate(a, [0, 1], [12, 0])}px)` }}>
			<div style={{ fontSize: 19, fontWeight: 700, color: TINTA_SUAVE, letterSpacing: 1.4, textTransform: 'uppercase' }}>
				{rotulo}
			</div>
			<div style={{ fontSize: 36, lineHeight: 1.25, fontWeight: 600, color: TINTA, marginTop: 8 }}>{texto}</div>
		</div>
	);
};
