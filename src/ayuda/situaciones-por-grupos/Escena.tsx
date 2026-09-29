import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { DISCIPLINA, ENTRADA } from './datos';
import { PantallaSituaciones } from './Pantalla';
import { CIERRE, LLEGADA, PASOS, PUNTOS, RECORRIDO, TARJETA } from './guion';

/* «SITUACIONES POR GRUPOS»: la llegada, el informe que se trae solo, y un paseo hasta Noveno B. */

export const EscenaSituacionesPorGrupos: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = entra(frame, fps, LLEGADA.abreSeccion, 16);
	const senalada = frame >= LLEGADA.llegaSeccion && frame < LLEGADA.pulsaSeccion + 10
		? { seccion: DISCIPLINA.seccion, hija: null }
		: frame >= LLEGADA.llegaEntrada && frame < LLEGADA.pulsaEntrada + 10 ? ENTRADA : null;

	const R = RECORRIDO;
	const scroll = interpolate(frame, [R.bajaDesde, R.bajaHasta, R.subeDesde, R.subeHasta], [0, R.scroll, R.scroll, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const clics = [LLEGADA.pulsaSeccion, LLEGADA.pulsaEntrada];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascaraDe
				abierta={{ seccion: DISCIPLINA.seccion, t: abierta }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: conPausas([
						{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
						{ frame: LLEGADA.llegaSeccion, ...PUNTOS.seccion },
						{ frame: LLEGADA.llegaEntrada, ...PUNTOS.entradaSit },
						{ frame: LLEGADA.monta + 20, ...PUNTOS.reposo },
						{ frame: R.llegaImprimir - 18, ...PUNTOS.reposo },
						{ frame: R.llegaImprimir, ...PUNTOS.imprimir },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.monta && (
					<Sequence from={LLEGADA.monta}>
						<PantallaSituaciones cargado={LLEGADA.cargado - LLEGADA.monta} scroll={scroll} encima={frame >= R.llegaImprimir - 4 ? 'imprimir' : null} />
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
