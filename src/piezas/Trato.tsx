import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { TOPE, TarjetaOferta } from './Oferta';
import { TRATO_ENCABEZADO, TRATO_RAZONES } from './datos';
import {
	TR_CONDICION, TR_CUENTA, TR_ENCABEZADO, TR_FIN_CUENTA, TR_PASO_RAZON, TR_PASO_SALE_RAZON,
	TR_PASO_SALIDA, TR_PIE, TR_POR_TECLA, TR_RAZONES, TR_SALEN_RAZONES, TR_SALIDA, TR_TARJETA,
	TR_TITULAR,
} from './guion';
import { ACENTO, BORDE, FONDO, FUENTE, TEXTO, TINTA_SUAVE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TRATO — el punto 7 del guion. Tres razones y, detrás, la oferta.
 *
 * ES LA ÚNICA PIEZA QUE ARGUMENTA. Las otras tres presentan, rematan o piden; ésta tiene que
 * convencer, y por eso está construida al revés que un anuncio: **primero por qué, y sólo al final
 * cuánto**. Una tarjeta con un 30 % puesta antes de las razones convierte todo lo anterior en el
 * precio de algo; puesta detrás, es lo que se llevan por decir que sí.
 *
 * VUELVE LA PIEL DE MyVC --fondo frío, azul de la aplicación, la tipografía del sistema-- después de
 * veintiséis segundos de papel crema del portal. El cambio de superficie no es un descuido: la
 * sección del portal contaba lo que recibe la Unión, y esto lo dice **quien se lo ofrece**.
 *
 * LAS TRES RAZONES SE QUEDAN JUNTAS antes de irse, y esa espera es el argumento: sueltas son tres
 * ventajas, juntas son una oferta que las otras no pueden igualar.
 */

/* Los tres iconos, del mismo trazo que los del resto del vídeo. */
const ICONO: Record<string, string> = {
	/*
	 * EL COLEGIO ESTÁ DIBUJADO OTRA VEZ AQUÍ, y no importado del clip de la red: aquél es del portal
	 * de la UCN, otro producto. Compartir cuatro trazos entre los dos ataría dos vídeos que tienen
	 * que poder cambiar por separado.
	 */
	colegio: '<path d="M2.5 21h19"></path><path d="M4.5 21V9.5L12 4l7.5 5.5V21"></path><path d="M9.5 21v-5.5h5V21"></path><path d="M9.5 11h1.2M13.3 11h1.2"></path>',
	horario: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><path d="M8 3v4M16 3v4"></path><path d="M7.5 14h3M13.5 14h3M7.5 17.5h3"></path>',
	portal: '<path d="M12 3 3 8v11h18V8l-9-5Z"></path><path d="M12 7.5v7M8.5 11h7"></path>',
};

const ANCHO_RAZON = 500;

const ESTILO_ENCABEZADO: React.CSSProperties = {
	fontSize: 46,
	fontWeight: 600,
	color: TEXTO,
	letterSpacing: -0.6,
	whiteSpace: 'pre',
	lineHeight: 1.2,
};

export const Trato: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	/* El encabezado se escribe, igual que el nombre en la portada y los títulos de las pantallas. */
	const encabezado = escrito(frame, TRATO_ENCABEZADO, TR_ENCABEZADO, TR_POR_TECLA);
	const salEncabezado = estiloDeSalida(seVa(frame, 0, TR_SALEN_RAZONES, TR_PASO_SALE_RAZON, 16));

	const tTarjeta = entra(frame, fps, TR_TARJETA, 22);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{/* ── LAS TRES RAZONES ────────────────────────────────────────────────────────── */}
			{frame < TR_TARJETA ? (
				<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64 }}>
						{/*
						  * EL HUECO LO RESERVA UN GEMELO INVISIBLE, igual que el titular de las pantallas del
						  * portal. Sin él, una frase centrada que se escribe **se recentra en cada fotograma** y
						  * la línea se desliza trescientos píxeles hacia la izquierda mientras se teclea. Con
						  * cuatro letras no se nota; con cuarenta y cuatro, se ve.
						  */}
						<div
							style={{
								position: 'relative',
								opacity: salEncabezado.opacidad,
								transform: `translateX(${salEncabezado.x}px) scale(${salEncabezado.escala})`,
							}}
						>
							<div style={{ ...ESTILO_ENCABEZADO, visibility: 'hidden' }}>{TRATO_ENCABEZADO}</div>
							<div style={{ ...ESTILO_ENCABEZADO, position: 'absolute', left: 0, top: 0 }}>
								{encabezado}
								<span style={{ opacity: escribiendo(frame, TRATO_ENCABEZADO, TR_ENCABEZADO, TR_POR_TECLA) && frame % 20 < 12 ? 1 : 0, color: ACENTO }}>|</span>
							</div>
						</div>

						<div style={{ display: 'flex', gap: 44 }}>
							{TRATO_RAZONES.map((r, i) => {
								const llegada = llega(frame, fps, i, TR_RAZONES, TR_PASO_RAZON, 20);
								const sal = estiloDeSalida(seVa(frame, i + 1, TR_SALEN_RAZONES, TR_PASO_SALE_RAZON, 16));
								return (
									<div
										key={r.numero}
										style={{
											width: ANCHO_RAZON,
											height: 380,
											background: '#ffffff',
											border: `1px solid ${BORDE}`,
											borderRadius: 20,
											boxShadow: '0 12px 40px rgba(22, 32, 43, 0.08)',
											padding: 40,
											boxSizing: 'border-box',
											display: 'flex',
											flexDirection: 'column',
											opacity: llegada.opacidad * sal.opacidad,
											transform: `translate(${llegada.x + sal.x}px, ${llegada.y}px) scale(${sal.escala})`,
										}}
									>
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div style={{ width: 68, height: 68, borderRadius: 16, background: 'rgba(22, 119, 255, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
												<svg
													width="34"
													height="34"
													viewBox="0 0 24 24"
													fill="none"
													stroke={ACENTO}
													strokeWidth="1.7"
													strokeLinecap="round"
													strokeLinejoin="round"
													dangerouslySetInnerHTML={{ __html: ICONO[r.icono] ?? '' }}
												/>
											</div>
											{/* El número, apagado: ordena la lectura sin competir con el titular. */}
											<span style={{ fontSize: 38, fontWeight: 700, color: 'rgba(22, 119, 255, 0.30)', letterSpacing: -1 }}>{r.numero}</span>
										</div>

										{/*
										 * EL TITULAR TIENE ALTURA FIJA DE DOS LÍNEAS aunque el tercero sólo ocupe una: si
										 * no, los tres pies arrancarían a tres alturas distintas y la fila se vería
										 * torcida sin que se supiera por qué.
										 */}
										<div style={{ fontSize: 34, fontWeight: 700, color: TEXTO, lineHeight: 1.2, marginTop: 34, minHeight: 82, letterSpacing: -0.4 }}>
											{r.titulo}
										</div>
										<div style={{ fontSize: 22, color: TINTA_SUAVE, lineHeight: 1.45, marginTop: 16 }}>{r.pie}</div>
									</div>
								);
							})}
						</div>
					</div>
				</AbsoluteFill>
			) : null}

			{/* ── Y EL TRATO. La misma tarjeta que la pieza suelta, con el mismo texto. ────── */}
			{frame >= TR_TARJETA - 6 ? (
				<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
					<TarjetaOferta
						t={tTarjeta}
						cuenta={Math.round(interpolate(frame, [TR_CUENTA, TR_FIN_CUENTA], [0, TOPE], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))}
						tTitular={entra(frame, fps, TR_TITULAR, 16)}
						tCondicion={entra(frame, fps, TR_CONDICION, 18)}
						tPie={entra(frame, fps, TR_PIE, 16)}
						salida={estiloDeSalida(seVa(frame, 2, TR_SALIDA, TR_PASO_SALIDA, 16))}
					/>
				</AbsoluteFill>
			) : null}
		</AbsoluteFill>
	);
};
