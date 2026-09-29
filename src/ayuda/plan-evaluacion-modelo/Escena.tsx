import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { CabeceraDelPlan, PanelDePagina } from '../el-ano/plan';
import { entre } from '../montar-el-ano/tiempo';
import { CuerpoModelo } from './Modelo';
import { COMPETENCIAS, PONDERADO, YEAR, pestanas } from './datos';
import { AVISO_1, AVISO_2, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «PLAN DE EVALUACIÓN: EL MODELO»: encadena, no dibuja. Una sola pantalla; cambia la tarjeta
 * marcada, la marca de la pestaña ① y la pestaña ③, que entra y sale con el modelo.
 */

const REFERENCIAS = entradaDelMenu('Referencias');
const PLAN = entradaDelMenu('Referencias', 'Plan de evaluación');

export const EscenaPlanModelo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaReferencias, T.pulsaReferencias + 10)
		? { seccion: REFERENCIAS.seccion, hija: null }
		: entre(frame, T.llegaEntrada, T.pulsaEntrada + 10)
			? { seccion: PLAN.seccion, hija: PLAN.hija }
			: null;

	const modelo = frame >= T.aCompetencias && frame < T.aPonderado ? COMPETENCIAS : PONDERADO;
	const guardando = entre(frame, T.pulsaCompetencias, T.aCompetencias) || entre(frame, T.pulsaPonderado, T.aPonderado);
	const encima = entre(frame, T.llegaCompetencias - 10, T.pulsaCompetencias) ? COMPETENCIAS : entre(frame, T.llegaPonderado - 10, T.pulsaPonderado) ? PONDERADO : null;
	const P = PUNTOS;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Referencias', t: entra(frame, fps, T.abreReferencias, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaReferencias, ...P.referencias },
						{ frame: T.llegaEntrada, ...P.plan },
						{ frame: T.llegaEntrada + 60, ...P.plan },
						{ frame: T.llegaEntrada + 110, x: P.competencias.x - 200, y: P.competencias.y + 420 },
						{ frame: T.llegaCompetencias - 60, x: P.competencias.x - 200, y: P.competencias.y + 420 },
						{ frame: T.llegaCompetencias, ...P.competencias },
						{ frame: T.pulsaCompetencias + 30, ...P.competencias },
						{ frame: T.pulsaCompetencias + 80, x: P.competencias.x + 120, y: P.competencias.y + 440 },
						{ frame: T.llegaPonderado - 50, x: P.competencias.x + 120, y: P.competencias.y + 440 },
						{ frame: T.llegaPonderado, ...P.ponderado },
						{ frame: T.pulsaPonderado + 20, ...P.ponderado },
					],
					clics: [T.pulsaReferencias, T.pulsaEntrada, T.pulsaCompetencias, T.pulsaPonderado],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.monta && (
					<PanelDePagina opacidad={entra(frame, fps, T.monta, 14)}>
						<CabeceraDelPlan year={YEAR} pestanas={pestanas(modelo)} puesta="modelo" />
						<CuerpoModelo elegida={modelo} encima={encima} guardando={guardando} />
					</PanelDePagina>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={AVISO_1.desde} />
			<Efecto cual="aviso" en={AVISO_2.desde} />
			<Sequence from={AVISO_1.desde} durationInFrames={AVISO_1.dura + 20}>
				<Aviso texto={AVISO_1.texto} desde={0} dura={AVISO_1.dura} />
			</Sequence>
			<Sequence from={AVISO_2.desde} durationInFrames={AVISO_2.dura + 20}>
				<Aviso texto={AVISO_2.texto} desde={0} dura={AVISO_2.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
