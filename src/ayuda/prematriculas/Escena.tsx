import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { entre } from '../montar-el-ano/tiempo';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { M, estadoEn } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';
import { PantallaPrematriculas } from './Prematriculas';

/* «PREMATRÍCULAS»: encadena, no dibuja. Una pantalla larga, que se recorre con la rueda. */

export const EscenaPrematriculas: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaPersonas, M.pulsaPersonas + 10)
		? { seccion: PERSONAS, hija: null }
		: entre(frame, M.llegaPrematriculas, M.pulsaPrematriculas + 10)
			? { seccion: PERSONAS, hija: dePersonas('Prematrículas') }
			: null;

	const P = PUNTOS;
	const reposo = { x: 1250, y: 520 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={{ seccion: PERSONAS, t: entra(frame, fps, M.abrePersonas, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaPersonas, ...P.personas },
						{ frame: M.llegaPrematriculas, ...P.prematriculas },
						{ frame: M.pulsaPrematriculas + 4, ...P.prematriculas },
						{ frame: M.pulsaPrematriculas + 30, ...reposo },
						{ frame: M.llegaGrupo - 20, ...reposo },
						{ frame: M.llegaGrupo, ...P.grupo },
						{ frame: M.pulsaGrupo + 16, ...P.grupo },
						{ frame: M.pulsaGrupo + 40, ...reposo },
						{ frame: M.llegaRevisada - 20, ...reposo },
						{ frame: M.llegaRevisada, ...P.revisada },
					],
					clics: [M.pulsaPersonas, M.pulsaPrematriculas, M.pulsaGrupo, M.pulsaRevisada],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && <PantallaPrematriculas estado={estadoEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					<Mensaje texto={a.texto} desde={0} dura={a.dura} />
				</Sequence>
			))}

			<Efecto cual="aviso" en={M.revisada} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
