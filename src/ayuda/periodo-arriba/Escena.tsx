import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { MENU_DOCENTE_HOY } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Lienzo, Mensajes, abre } from '../moverse/comun';
import { MisAsignaturas } from '../mis-asignaturas/MisAsignaturas';
import { Desplegable } from './Desplegable';
import { FILAS_2025 } from './datos';
import { CIERRE, EPOCAS, MENSAJES, PASOS, PUNTOS, T, TARJETA, elegido } from './guion';

/*
 * EL AÑO Y EL PERIODO: la cáscara de hoy con «Mis asignaturas» detrás, el desplegable del
 * selector encima, y los mensajes arriba. Cada vez que vuelve el servidor la pantalla de debajo se
 * apaga y se vuelve a montar (la `epoca` de la aplicación): la vieja se va en seis fotogramas y la
 * nueva entra después, nunca las dos a la vez ni una desmontada a medio irse.
 */

const SE_VA = 6;

export const EscenaPeriodoArriba: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const ahora = elegido(frame);
	const abierto = abre(frame, fps, T.abre);

	const senalado =
		frame >= T.llegaP4 - 4 && frame < T.pulsaP4 + 10 ? { tipo: 'periodo' as const, n: 4 }
			: frame >= T.llega2025 - 4 && frame < T.pulsa2025 + 10 ? { tipo: 'anio' as const, anio: '2025' }
				: frame >= T.llega2026 - 4 && frame < T.pulsa2026 + 10 ? { tipo: 'anio' as const, anio: '2026' }
					: frame >= T.llegaP4b - 4 && frame < T.pulsaP4b + 10 ? { tipo: 'periodo' as const, n: 4 }
						: null;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara
					menu={MENU_DOCENTE_HOY}
					abierta={null}
					hoy={{
						anio: ahora.anio,
						periodo: ahora.periodo,
						senalado: frame >= T.llegaSelector && frame < T.abre ? 'selector' : null,
						selectorAbierto: frame >= T.abre,
					}}
				>
					{EPOCAS.map((e, i) => {
						const siguiente = EPOCAS[i + 1] ?? 1e9;
						if (frame < e || frame >= siguiente + SE_VA) { return null; }
						const monta = e === 0 ? 0 : e + SE_VA;
						const vista = elegido(e);
						const fuera = interpolate(frame, [siguiente, siguiente + SE_VA], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
						const del2025 = vista.anio === '2025';
						return (
							<div key={e} style={{ position: 'absolute', inset: 0, opacity: fuera }}>
								<Sequence from={monta} layout="none">
									<MisAsignaturas
										filas={del2025 ? FILAS_2025 : undefined}
										sinCerrar={del2025}
										subtitulo={del2025 ? '3 asignaturas en el año en curso' : `4 asignaturas en el año en curso · periodo ${vista.periodo}: 0 de 4 cerradas`}
									/>
								</Sequence>
							</div>
						);
					})}
				</Cascara>

				<Desplegable abierto={abierto} anioElegido={ahora.anio} periodoElegido={ahora.periodo} senalado={senalado} />

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaSelector, ...PUNTOS.selector },
						{ frame: T.pulsaSelector + 20, ...PUNTOS.reposo },
						{ frame: T.llegaP4 - 18, ...PUNTOS.reposo },
						{ frame: T.llegaP4, ...PUNTOS.p4 },
						{ frame: T.llega2025 - 18, ...PUNTOS.p4 },
						{ frame: T.llega2025, ...PUNTOS.a2025 },
						{ frame: T.llega2025 + 30, ...PUNTOS.reposo },
						{ frame: T.llega2026 - 18, ...PUNTOS.reposo },
						{ frame: T.llega2026, ...PUNTOS.a2026 },
						{ frame: T.llegaP4b, ...PUNTOS.p4 },
					]}
					clics={[T.pulsaSelector, T.pulsaP4, T.pulsa2025, T.pulsa2026, T.pulsaP4b]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			{MENSAJES.filter((m, i) => i === 0 || m.desde - MENSAJES[i - 1].desde > 10).map((m, i) => <Efecto key={i} cual="aviso" en={m.desde} />)}
			<Mensajes mensajes={MENSAJES} centroX={755} anchoMax={500} letra={27} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
