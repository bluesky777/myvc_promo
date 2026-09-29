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
import { PantallaDirectorio } from '../secretaria/Directorio';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { CAMBIAN, CHOQUES, M, QUIEN, SIN_DOCUMENTO, YA_LO_TENIAN, estadoDialogoEn, estadoDirectorioEn } from './datos';
import { DialogoDocumento } from './Dialogo';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/* «EL DOCUMENTO COMO NOMBRE DE USUARIO»: Alumnos con su panel abierto, y el diálogo encima. */

export const EscenaDocumentoUsuario: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaPersonas, M.pulsaPersonas + 10)
		? { seccion: PERSONAS, hija: null }
		: entre(frame, M.llegaAlumnos, M.pulsaAlumnos + 10)
			? { seccion: PERSONAS, hija: dePersonas('Alumnos') }
			: null;

	const P = PUNTOS;
	const reposo = { x: 1320, y: 800 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={{ seccion: PERSONAS, t: entra(frame, fps, M.abrePersonas, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					frame >= M.abre ? (
						<DialogoDocumento quien={QUIEN} cambian={CAMBIAN} yaLoTenian={YA_LO_TENIAN} sinDocumento={SIN_DOCUMENTO} choques={CHOQUES} estado={estadoDialogoEn(frame)} />
					) : null
				}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaPersonas, ...P.personas },
						{ frame: M.llegaAlumnos, ...P.alumnos },
						{ frame: M.llegaClaves - 20, ...P.alumnos },
						{ frame: M.llegaClaves, ...P.claves },
						{ frame: M.pulsaClaves + 16, ...P.claves },
						{ frame: M.llegaRevisar - 24, x: P.revisar.x - 200, y: P.revisar.y + 120 },
						{ frame: M.llegaRevisar, ...P.revisar },
						{ frame: M.pulsaRevisar + 14, ...P.revisar },
						{ frame: M.pulsaRevisar + 40, ...reposo },
						{ frame: M.llegaCambiar - 18, ...reposo },
						{ frame: M.llegaCambiar, ...P.cambiar },
						{ frame: M.hecho + 20, ...P.cambiar },
						{ frame: M.hecho + 50, ...reposo },
					],
					clics: [M.pulsaPersonas, M.pulsaAlumnos, M.pulsaClaves, M.pulsaRevisar, M.pulsaCambiar],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && <PantallaDirectorio estado={estadoDirectorioEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					<Mensaje texto={a.texto} desde={0} dura={a.dura} />
				</Sequence>
			))}

			<Efecto cual="aviso" en={M.hecho} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
