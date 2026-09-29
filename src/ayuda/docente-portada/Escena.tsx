import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { MEDIDAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { Portada } from './Portada';
import { LA_QUE_SE_ABRE } from './datos';
import { CIERRE, INICIO, LLEGADA, PASOS, PORTADA, PUNTOS, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PORTADA: encadena, no dibuja. Toda en la cáscara: se sale de «Mis asignaturas» con un clic en
 * «Inicio», la portada se monta, se abre la fila de 9°B y luego se mira mañana.
 */

export const EscenaPortada: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = frame >= LLEGADA.llegaInicio && frame < LLEGADA.pulsaInicio + 10 ? { seccion: INICIO, hija: null } : null;
	const manana = frame >= PORTADA.pulsaManana;
	const abierta = !manana && frame >= PORTADA.pulsaFila ? LA_QUE_SE_ABRE : null;
	const filaSenalada = !manana && frame >= PORTADA.llegaFila - 4 ? LA_QUE_SE_ABRE : null;

	const aparece = entra(frame, fps, 0, 14);

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
					<Cascara abierta={null} senalada={senalada}>
						{frame < LLEGADA.montaPortada && <MisAsignaturas salidaEn={LLEGADA.pulsaInicio} />}
						<Sequence from={LLEGADA.montaPortada}>
							<Portada manana={manana} abierta={abierta} senalada={filaSenalada} />
						</Sequence>
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaInicio, ...PUNTOS.inicio },
							{ frame: LLEGADA.pulsaInicio + 60, ...PUNTOS.inicio },
							{ frame: PORTADA.llegaFila - 120, x: PUNTOS.fila.x + 200, y: PUNTOS.fila.y + 360 },
							{ frame: PORTADA.llegaFila, ...PUNTOS.fila },
							{ frame: PORTADA.pulsaFila + 30, x: PUNTOS.fila.x + 60, y: PUNTOS.fila.y + 30 },
							{ frame: PORTADA.pulsaFila + 90, x: PUNTOS.asistencia.x + 30, y: PUNTOS.asistencia.y + 10 },
							{ frame: PORTADA.llegaManana - 50, x: PUNTOS.asistencia.x + 30, y: PUNTOS.asistencia.y + 10 },
							{ frame: PORTADA.llegaManana, ...PUNTOS.manana },
							{ frame: PORTADA.pulsaManana + 40, x: PUNTOS.manana.x - 40, y: PUNTOS.manana.y + 60 },
						]}
						clics={[LLEGADA.pulsaInicio, PORTADA.pulsaFila, PORTADA.pulsaManana]}
						aparece={LLEGADA.cursorEntra}
						sale={PORTADA.cursorSale}
						tam={34}
					/>
				</div>
			</div>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
