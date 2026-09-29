import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { ACADEMICO, MEDIDAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { RecuperacionAnual } from './RecuperacionAnual';
import { RECUPERACION_VALENTINA } from './datos';
import { AVISO_DURA, CIERRE, ESCRIBE, GRUPO, LA_ENTRADA, LLEGADA, PASOS, PUNTOS, TARJETA, VUELVE } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 5: encadena, no dibuja. Todo pasa dentro de la cáscara: la pantalla no se sale de ella,
 * así que no hay cambio de plano. El selector de arriba dice «Periodo 4»: es fin de año.
 */

export const EscenaCierre5: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const aparece = entra(frame, fps, 0, 14);

	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaEntrada && frame < LLEGADA.pulsaEntrada + 10
			? { seccion: ACADEMICO, hija: LA_ENTRADA }
			: null;

	const m = LLEGADA.montaPantalla;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					opacity: aparece,
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara academico={academico} senalada={senalada} periodo="2026 · Periodo 4">
						{frame >= m && (
							<Sequence from={m}>
								<RecuperacionAnual
									eligeGrupo={GRUPO.pulsa - m}
									tablaDesde={GRUPO.tabla - m}
									grupoSenalado={frame >= GRUPO.llega && frame < GRUPO.pulsa}
									enfocada={{ desde: ESCRIBE.pulsaCasilla - m, hasta: ESCRIBE.pulsaGuardar - m }}
									tecleo={{ empieza: ESCRIBE.empieza - m, porTecla: ESCRIBE.porTecla }}
									guarda={{ pulsa: ESCRIBE.pulsaGuardar - m, vuelve: VUELVE - m }}
									senalaGuardar={{ desde: ESCRIBE.llegaGuardar - m, hasta: ESCRIBE.pulsaGuardar - m }}
								/>
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
							{ frame: LLEGADA.llegaEntrada, ...PUNTOS.laEntrada },
							{ frame: GRUPO.llega - 16, ...PUNTOS.laEntrada },
							{ frame: GRUPO.llega, ...PUNTOS.grupo },
							{ frame: GRUPO.pulsa + 6, ...PUNTOS.grupo },
							/* Se aparta de la tabla mientras se cuenta, para no tapar nada. */
							{ frame: GRUPO.pulsa + 24, x: PUNTOS.grupo.x + 520, y: PUNTOS.grupo.y - 40 },
							{ frame: ESCRIBE.llegaCasilla - 16, x: PUNTOS.grupo.x + 520, y: PUNTOS.grupo.y - 40 },
							{ frame: ESCRIBE.llegaCasilla, ...PUNTOS.campo },
							{ frame: ESCRIBE.pulsaCasilla + 3, ...PUNTOS.campo },
							{ frame: ESCRIBE.empieza - 8, x: PUNTOS.campo.x + 40, y: PUNTOS.campo.y + 44 },
							{ frame: ESCRIBE.llegaGuardar - 14, x: PUNTOS.campo.x + 40, y: PUNTOS.campo.y + 44 },
							{ frame: ESCRIBE.llegaGuardar, ...PUNTOS.guardar },
							{ frame: ESCRIBE.pulsaGuardar + 8, ...PUNTOS.guardar },
							{ frame: ESCRIBE.cursorSale, x: PUNTOS.guardar.x + 60, y: PUNTOS.guardar.y + 70 },
						]}
						clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaEntrada, GRUPO.pulsa, ESCRIBE.pulsaCasilla, ESCRIBE.pulsaGuardar]}
						aparece={LLEGADA.cursorEntra}
						sale={ESCRIBE.cursorSale}
						tam={34}
					/>
				</div>
			</div>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{/* El aviso baja por debajo de la cabecera de ubicación, que si no lo lava con su degradado. */}
			<Sequence from={VUELVE} durationInFrames={AVISO_DURA + 20} style={{ top: 96, zIndex: 35 }}>
				<Aviso texto={`Recuperación de Matemáticas guardada: ${RECUPERACION_VALENTINA}.`} desde={0} dura={AVISO_DURA} />
			</Sequence>

			{[...RECUPERACION_VALENTINA].map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={ESCRIBE.empieza + i * ESCRIBE.porTecla} />
			))}
			<Efecto cual="aviso" en={VUELVE} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
