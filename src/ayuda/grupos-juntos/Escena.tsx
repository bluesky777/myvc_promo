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
import { EnLaCascara, GRUPOS, REFERENCIAS } from '../montar-el-ano/EnLaCascara';
import { PantallaGrupos } from '../montar-el-ano/Grupos';
import { entre } from '../montar-el-ano/tiempo';
import { M, estadoEn } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/* «GRUPOS QUE VAN SIEMPRE JUNTOS»: encadena, no dibuja. */

export const EscenaGruposJuntos: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaReferencias, M.pulsaReferencias + 10)
		? { seccion: REFERENCIAS, hija: null }
		: entre(frame, M.llegaEntrada, M.pulsaEntrada + 10)
			? { seccion: REFERENCIAS, hija: GRUPOS }
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
						{ frame: M.llegaEntrada, ...P.grupos },
						{ frame: M.llegaJuntar - 30, ...P.grupos },
						{ frame: M.llegaJuntar, ...P.juntar },
						{ frame: M.pulsaJuntar + 12, ...P.juntar },
						{ frame: M.llegaFicha[0], ...P.fichas[0] },
						{ frame: M.pulsaFicha[0] + 6, ...P.fichas[0] },
						{ frame: M.llegaFicha[1], ...P.fichas[1] },
						{ frame: M.pulsaFicha[1] + 6, ...P.fichas[1] },
						{ frame: M.llegaFicha[2], ...P.fichas[2] },
						{ frame: M.pulsaFicha[2] + 20, ...P.fichas[2] },
						{ frame: M.llegaGuardar - 40, x: P.guardar.x + 300, y: P.guardar.y + 30 },
						{ frame: M.llegaGuardar, ...P.guardar },
						{ frame: M.pulsaGuardar + 20, ...P.guardar },
						{ frame: M.guardado + 40, ...reposo },
						{ frame: M.llegaSeparar - 30, ...reposo },
						{ frame: M.llegaSeparar, ...P.separar },
					],
					clics: [M.pulsaReferencias, M.pulsaEntrada, M.pulsaJuntar, ...M.pulsaFicha, M.pulsaGuardar],
					aparece: M.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= M.monta && <PantallaGrupos estado={estadoEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={AVISO.desde} />
			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
