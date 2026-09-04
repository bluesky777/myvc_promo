import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { PORTADA_BAJADA, PORTADA_PILDORAS, PORTADA_TITULO } from './datos';
import {
	P_BAJADA, P_PASO_PILDORA, P_PASO_SALIDA, P_PILDORAS, P_POR_TECLA, P_RAYA, P_SALIDA, P_TITULO,
} from './guion';
import { ACENTO, BORDE, FONDO, FUENTE, TEXTO, TINTA_SUAVE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PORTADA. Lo primero que se ve del vídeo, y por eso lo más fácil de estropear.
 *
 * NO ES UN LOGO CON UN FUNDIDO. El nombre **se escribe**, igual que se escriben los títulos de las
 * pantallas en todos los clips: quien mira ya está viendo, desde el segundo uno, el mismo lenguaje
 * de movimiento que va a ver durante el resto del vídeo.
 *
 * LAS CUATRO PÍLDORAS SON EL ÍNDICE, no adorno: son, en orden, los cuatro clips que vienen detrás.
 * Anunciar lo que se va a enseñar es lo que hace que alguien aguante los dos minutos siguientes; y
 * llegan en cascada, así que el ojo las lee una a una en vez de encontrarse un bloque.
 *
 * EL FONDO ES EL DE LOS CLIPS. Así el corte de aquí al primer clip no cambia de superficie: cambia
 * lo que hay encima. Un vídeo, no una presentación de diapositivas.
 */
export const Portada: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	/* La raya de acento crece desde el centro: es el primer movimiento y da el color de la marca. */
	const raya = entra(frame, fps, P_RAYA, 20);
	const titulo = escrito(frame, PORTADA_TITULO, P_TITULO, P_POR_TECLA);
	const bajada = entra(frame, fps, P_BAJADA, 18);

	/* Se van todos escalonados: la raya la última, que es la que cierra. */
	const fueraTitulo = seVa(frame, 0, P_SALIDA, P_PASO_SALIDA);
	const fueraBajada = seVa(frame, 1, P_SALIDA, P_PASO_SALIDA);
	const salTitulo = estiloDeSalida(fueraTitulo);
	const salBajada = estiloDeSalida(fueraBajada);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
					<div
						style={{
							width: 132 * raya,
							height: 6,
							borderRadius: 3,
							background: ACENTO,
							marginBottom: 44,
							opacity: 1 - seVa(frame, 3, P_SALIDA, P_PASO_SALIDA),
						}}
					/>
					<div
						style={{
							fontSize: 104,
							fontWeight: 700,
							letterSpacing: -2.5,
							color: TEXTO,
							opacity: salTitulo.opacidad,
							transform: `translateX(${salTitulo.x}px) scale(${salTitulo.escala})`,
							whiteSpace: 'pre',
						}}
					>
						{titulo}
						<span style={{ opacity: escribiendo(frame, PORTADA_TITULO, P_TITULO, P_POR_TECLA) && frame % 20 < 12 ? 1 : 0, color: ACENTO }}>|</span>
					</div>
					<div
						style={{
							fontSize: 34,
							color: TINTA_SUAVE,
							marginTop: 18,
							opacity: bajada * salBajada.opacidad,
							transform: `translateY(${(1 - bajada) * 16}px) translateX(${salBajada.x}px)`,
						}}
					>
						{PORTADA_BAJADA}
					</div>
					<div style={{ display: 'flex', gap: 16, marginTop: 54 }}>
						{PORTADA_PILDORAS.map((p, i) => {
							const llegada = llega(frame, fps, i, P_PILDORAS, P_PASO_PILDORA, 20);
							const sal = estiloDeSalida(seVa(frame, i, P_SALIDA + 6, P_PASO_SALIDA));
							return (
								<div
									key={p}
									style={{
										padding: '14px 30px',
										borderRadius: 999,
										border: `1px solid ${BORDE}`,
										background: '#ffffff',
										fontSize: 26,
										color: TEXTO,
										opacity: llegada.opacidad * sal.opacidad,
										transform: `translate(${llegada.x + sal.x}px, ${llegada.y}px) scale(${sal.escala})`,
									}}
								>
									{p}
								</div>
							);
						})}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
