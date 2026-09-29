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
import { PantallaAsignaturas } from '../montar-el-ano/Asignaturas';
import { ASIGNATURAS, EnLaCascara, REFERENCIAS } from '../montar-el-ano/EnLaCascara';
import { entre } from '../montar-el-ano/tiempo';
import { M, TECLEO, estadoEn } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/* «COPIAR LAS ASIGNATURAS DE UN GRUPO A OTRO»: encadena, no dibuja. */

/** Una tecla por letra, alternando los tres sonidos, cuando la letra aparece (`tecleado`, 4 fotogramas cada una). */
const Tecleo: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) => (
	<>
		{[...texto].map((_, i) => <Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={desde + (i + 1) * 4} />)}
	</>
);

export const EscenaAsignaturasCopiar: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaReferencias, M.pulsaReferencias + 10)
		? { seccion: REFERENCIAS, hija: null }
		: entre(frame, M.llegaEntrada, M.pulsaEntrada + 10)
			? { seccion: REFERENCIAS, hija: ASIGNATURAS }
			: null;

	const P = PUNTOS;
	const reposo = { x: 1428, y: 560 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				referencias={entra(frame, fps, M.abreReferencias, 16)}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaReferencias, ...P.referencias },
						{ frame: M.llegaEntrada, ...P.asignaturas },
						{ frame: M.llegaVerSus - 20, ...P.asignaturas },
						{ frame: M.llegaVerSus, ...P.verSus },
						{ frame: M.pulsaVerSus + 20, ...P.verSus },
						{ frame: M.bajaDesde, ...reposo },
						{ frame: M.llegaOrigen - 40, ...reposo },
						{ frame: M.llegaOrigen, ...P.origen },
						{ frame: M.tecleaOrigen, ...P.origen },
						{ frame: M.llegaOpcionOrigen, ...P.opcionOrigen },
						{ frame: M.pulsaOpcionOrigen + 8, ...P.opcionOrigen },
						{ frame: M.llegaDestino, ...P.destino },
						{ frame: M.tecleaDestino, ...P.destino },
						{ frame: M.llegaOpcionDestino, ...P.opcionDestino },
						{ frame: M.pulsaOpcionDestino + 8, ...P.opcionDestino },
						{ frame: M.llegaCopiar, ...P.copiar },
						{ frame: M.pulsaCopiar + 16, ...P.copiar },
						{ frame: M.copiadas + 30, ...reposo },
					],
					clics: [M.pulsaReferencias, M.pulsaEntrada, M.pulsaVerSus, M.pulsaOrigen, M.pulsaOpcionOrigen, M.pulsaDestino, M.pulsaOpcionDestino, M.pulsaCopiar],
					aparece: M.cursorEntra,
					sale: M.copiadas + 60,
				}}
			>
				{frame >= M.monta && <PantallaAsignaturas estado={estadoEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.focoDesde ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Tecleo texto={TECLEO.origen} desde={M.tecleaOrigen} />
			<Tecleo texto={TECLEO.destino} desde={M.tecleaDestino} />
			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
