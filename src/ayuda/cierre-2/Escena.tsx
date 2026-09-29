import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { DialogoCierre } from './DialogoCierre';
import { Periodos } from './Periodos';
import { EL_QUE_SE_CIERRA } from './datos';
import { CIERRE, CIERRE_T, HIJA_EL_COLEGIO, LLEGADA, OTRA_FILA, PASOS, PUNTOS, SECCION_CONFIG, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 2: encadena, no dibuja. Todo pasa dentro de la cáscara, con el menú de rector: una sola
 * pantalla, «El colegio ▸ Periodos», y el diálogo de cierre encima.
 */

export const EscenaCierre2: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const config = entra(frame, fps, LLEGADA.abreConfig, 16);
	const aparece = entra(frame, fps, 0, 14);

	const senalada = frame >= LLEGADA.llegaConfig && frame < LLEGADA.pulsaConfig + 10
		? { seccion: SECCION_CONFIG, hija: null }
		: frame >= LLEGADA.llegaColegio && frame < LLEGADA.pulsaColegio + 10
			? { seccion: SECCION_CONFIG, hija: HIJA_EL_COLEGIO }
			: null;

	const senalado = frame >= CIERRE_T.llegaNivelando && frame < CIERRE_T.pulsaNivelando + 6
		? { fila: EL_QUE_SE_CIERRA, tramo: 'nivelando' as const }
		: null;

	/* El «⋯» del 3 se abre con el clic y se queda abierto hasta la tarjeta: nadie pulsa «Eliminar». */
	const menuMas = { fila: OTRA_FILA, t: interpolate(frame, [CIERRE_T.pulsaMas + 2, CIERRE_T.pulsaMas + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) };

	const tramo = frame >= CIERRE_T.cambiaLaFila ? 'nivelando' : 'calificando';

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill>
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
						<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: SECCION_CONFIG, t: config }} senalada={senalada}>
							{frame >= LLEGADA.montaColegio && (
								<Sequence from={LLEGADA.montaColegio}>
									<Periodos tramoDelQueSeCierra={tramo} senalado={senalado} menuMas={menuMas} />
								</Sequence>
							)}
						</Cascara>

						<DialogoCierre
							abre={CIERRE_T.abreDialogo}
							cargaHasta={CIERRE_T.cargaHasta}
							pulsa={CIERRE_T.pulsaCerrar}
							cierra={CIERRE_T.cierraDialogo}
						/>

						<Cursor
							puntos={[
								{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
								{ frame: LLEGADA.llegaConfig, ...PUNTOS.config },
								{ frame: LLEGADA.llegaColegio, ...PUNTOS.colegio },
								{ frame: CIERRE_T.llegaNivelando - 18, ...PUNTOS.colegio },
								{ frame: CIERRE_T.llegaNivelando, ...PUNTOS.nivelando },
								{ frame: CIERRE_T.pulsaNivelando + 8, ...PUNTOS.nivelando },
								/* Se aparta para no tapar el diálogo mientras se lee. */
								{ frame: CIERRE_T.pulsaNivelando + 28, x: PUNTOS.cerrar.x + 90, y: PUNTOS.cerrar.y + 110 },
								{ frame: CIERRE_T.llegaCerrar - 16, x: PUNTOS.cerrar.x + 90, y: PUNTOS.cerrar.y + 110 },
								{ frame: CIERRE_T.llegaCerrar, ...PUNTOS.cerrar },
								{ frame: CIERRE_T.pulsaCerrar + 14, ...PUNTOS.cerrar },
								{ frame: CIERRE_T.llegaPoner - 18, ...PUNTOS.cerrar },
								{ frame: CIERRE_T.llegaPoner, ...PUNTOS.poner },
								{ frame: CIERRE_T.llegaMas - 16, ...PUNTOS.poner },
								{ frame: CIERRE_T.llegaMas, ...PUNTOS.mas },
							]}
							clics={[LLEGADA.pulsaConfig, LLEGADA.pulsaColegio, CIERRE_T.pulsaNivelando, CIERRE_T.pulsaCerrar, CIERRE_T.pulsaMas]}
							aparece={LLEGADA.cursorEntra}
							sale={CIERRE_T.cursorSale}
							tam={34}
						/>
					</div>
				</div>
			</AbsoluteFill>

			<Efecto cual="aviso" en={CIERRE_T.cargaHasta} />

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
