import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Efecto } from '../voz';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { entre } from '../montar-el-ano/tiempo';
import { PantallaDirectorio } from '../secretaria/Directorio';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { nombreCompleto } from '../secretaria/personas';
import { M, NOTAS, QUIEN_CAMBIA, estadoDirectorioEn, estadoMatricularEn, estadoMatricularEnDialogo, estadoTraerNotasEn } from './datos';
import { DialogoMatricularEn, DialogoTraerNotas } from './Dialogos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';
import { PantallaMatricular } from './Matricular';

/*
 * «MATRICULAR»: encadena, no dibuja. Matricular, y luego Alumnos con sus dos diálogos. Cada pantalla
 * se apaga entera antes de montar la siguiente.
 */

export const EscenaMatricular: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaPersonas, M.pulsaPersonas + 10)
		? { seccion: PERSONAS, hija: null }
		: entre(frame, M.llegaMatricular, M.pulsaMatricular + 10)
			? { seccion: PERSONAS, hija: dePersonas('Matricular') }
			: entre(frame, M.llegaAlumnos, M.pulsaAlumnos + 10)
				? { seccion: PERSONAS, hija: dePersonas('Alumnos') }
				: null;

	const P = PUNTOS;
	const reposo = { x: 1180, y: 330 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={{ seccion: PERSONAS, t: entra(frame, fps, M.abrePersonas, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					<>
						{frame >= M.abreEn && frame < M.matriculadoEn + 8 && (
							<DialogoMatricularEn id={QUIEN_CAMBIA.id} nombre={nombreCompleto(QUIEN_CAMBIA)} estado={estadoMatricularEnDialogo(frame)} />
						)}
						{frame >= M.abreNotas && frame < M.traidas + 8 && (
							<DialogoTraerNotas nombre={nombreCompleto(QUIEN_CAMBIA)} origen="9°A" destino="9°B" notas={NOTAS} estado={estadoTraerNotasEn(frame)} />
						)}
					</>
				}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaPersonas, ...P.personas },
						{ frame: M.llegaMatricular, ...P.matricular },
						{ frame: M.llegaMatricular + 30, ...P.matricular },
						{ frame: M.llegaMatricular + 60, ...reposo },
						{ frame: M.llegaAno - 18, ...reposo },
						{ frame: M.llegaAno, ...P.ano },
						{ frame: M.llegaMatric - 20, ...P.ano },
						{ frame: M.llegaMatric, ...P.matric },
						{ frame: M.pulsaMatric + 16, ...P.matric },
						{ frame: M.llegaRetiDese, ...P.retiDese },
						{ frame: M.llegaAlumnos - 20, ...P.retiDese },
						{ frame: M.llegaAlumnos, ...P.alumnos },
						{ frame: M.llegaGrupo9A - 18, ...P.alumnos },
						{ frame: M.llegaGrupo9A, ...P.grupo9A },
						{ frame: M.pulsaGrupo9A + 12, ...P.grupo9A },
						{ frame: M.llegaPuntos, ...P.puntos },
						{ frame: M.pulsaPuntos + 16, ...P.puntos },
						{ frame: M.llegaSelector, ...P.selector },
						{ frame: M.teclea + 6, ...P.selector },
						{ frame: M.llegaOpcion, ...P.opcion9B },
						{ frame: M.pulsaOpcion + 6, ...P.opcion9B },
						{ frame: M.llegaMatricularEn, ...P.matricularEn },
						{ frame: M.matriculadoEn + 16, ...P.matricularEn },
						{ frame: M.llegaTraer - 30, x: P.traer.x - 160, y: P.traer.y + 70 },
						{ frame: M.llegaTraer, ...P.traer },
					],
					clics: [M.pulsaPersonas, M.pulsaMatricular, M.pulsaMatric, M.pulsaAlumnos, M.pulsaGrupo9A, M.pulsaPuntos, M.pulsaSelector, M.pulsaOpcion, M.pulsaMatricularEn, M.pulsaTraer],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && frame < M.montaDirectorio && <PantallaMatricular estado={estadoMatricularEn(frame)} />}
				{frame >= M.montaDirectorio && <PantallaDirectorio estado={estadoDirectorioEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					<Mensaje texto={a.texto} desde={0} dura={a.dura} />
				</Sequence>
			))}

			{/* El «9» del buscador de grupos, y el sonido de cada aviso. */}
			<Efecto cual="tecla1" en={M.teclea} />
			{AVISOS.map((a) => <Efecto key={`aviso-${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
