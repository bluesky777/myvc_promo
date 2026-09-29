import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { entre } from '../montar-el-ano/tiempo';
import { PantallaDirectorio } from '../secretaria/Directorio';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { M, estadoDirectorioEn, estadoFichaEn } from './datos';
import { PantallaFicha } from './Ficha';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';
import { Efecto } from '../voz';

/* «REQUISITOS Y COMPROMISOS DEL ALUMNO»: Alumnos, y la ficha. La primera se apaga antes de montar la otra. */

export const EscenaRequisitosAlumno: React.FC = () => {
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
	const reposo = { x: 1260, y: 470 };

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
						{ frame: M.llegaAlumnos, ...P.alumnos },
						{ frame: M.llegaFicha - 36, ...P.alumnos },
						{ frame: M.llegaFicha, ...P.carne },
						{ frame: M.pulsaFicha + 30, ...P.carne },
						{ frame: M.pulsaFicha + 60, ...reposo },
						{ frame: M.llegaYa - 40, ...reposo },
						{ frame: M.llegaYa, ...P.ya },
						{ frame: M.pulsaYa + 40, ...P.ya },
						{ frame: M.pulsaYa + 70, ...reposo },
						{ frame: M.llegaSelect - 30, ...reposo },
						{ frame: M.llegaSelect, ...P.select },
						{ frame: M.pulsaSelect + 10, ...P.select },
						{ frame: M.llegaOpcion, ...P.opcion },
					],
					clics: [M.pulsaPersonas, M.pulsaAlumnos, M.pulsaFicha, M.pulsaYa, M.pulsaSelect, M.pulsaOpcion],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && frame < M.montaFicha && <PantallaDirectorio estado={estadoDirectorioEn(frame)} />}
				{frame >= M.montaFicha && <PantallaFicha estado={estadoFichaEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					{/* Corrido a la derecha: centrado, tapaba el final de la miga «… ▸ Ficha de la persona». */}
					<AbsoluteFill style={{ left: 300 }}>
						<Mensaje texto={a.texto} desde={0} dura={a.dura} />
					</AbsoluteFill>
				</Sequence>
			))}

			{AVISOS.map((a) => <Efecto key={`aviso-${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
