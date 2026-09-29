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

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CREAR UNA ASIGNATURA»: encadena, no dibuja. La pantalla sale de `estadoEn(frame)`, el puntero de
 * `PUNTOS`, y los dos de los mismos números de `planoAsignaturas.ts`.
 */

/** Una tecla por letra, alternando los tres sonidos, cuando la letra aparece (`tecleado`, 4 fotogramas cada una). */
const Tecleo: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) => (
	<>
		{[...texto].map((_, i) => <Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={desde + (i + 1) * 4} />)}
	</>
);

export const EscenaAsignaturasCrear: React.FC = () => {
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
	const aparte = { x: P.crearNueva.x - 60, y: P.crearNueva.y + 520 };

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
						{ frame: M.pulsaVerSus + 10, ...P.verSus },
						{ frame: M.pulsaVerSus + 24, ...aparte },
						{ frame: M.llegaCrearNueva - 20, ...aparte },
						{ frame: M.llegaCrearNueva, ...P.crearNueva },
						{ frame: M.pulsaCrearNueva + 30, ...P.crearNueva },
						{ frame: M.llegaMateria, ...P.materia },
						{ frame: M.pulsaMateria + 8, ...P.materia },
						{ frame: M.llegaOpcionMateria, ...P.opcionMateria },
						{ frame: M.pulsaOpcionMateria + 6, ...P.opcionMateria },
						{ frame: M.llegaGrupo, ...P.grupo },
						{ frame: M.pulsaGrupo + 8, ...P.grupo },
						{ frame: M.llegaOpcionGrupo, ...P.opcionGrupo },
						{ frame: M.pulsaOpcionGrupo + 6, ...P.opcionGrupo },
						{ frame: M.llegaProfesor, ...P.profesor },
						{ frame: M.pulsaProfesor + 8, ...P.profesor },
						{ frame: M.llegaOpcionProfesor, ...P.opcionProfesor },
						{ frame: M.pulsaOpcionProfesor + 6, ...P.opcionProfesor },
						{ frame: M.llegaCreditos, ...P.creditos },
						{ frame: M.pulsaCreditos + 6, ...P.creditos },
						/* Se aparta un poco para no tapar lo que se escribe. */
						{ frame: M.tecleaCreditos, x: P.creditos.x + 60, y: P.creditos.y + 44 },
						{ frame: M.llegaCrear - 30, x: P.creditos.x + 60, y: P.creditos.y + 44 },
						{ frame: M.llegaCrear, ...P.crear },
						{ frame: M.pulsaCrear + 12, ...P.crear },
						{ frame: M.creada + 30, ...aparte },
					],
					clics: [
						M.pulsaReferencias, M.pulsaEntrada, M.pulsaVerSus, M.pulsaCrearNueva, M.pulsaMateria, M.pulsaOpcionMateria,
						M.pulsaGrupo, M.pulsaOpcionGrupo, M.pulsaProfesor, M.pulsaOpcionProfesor, M.pulsaCreditos, M.pulsaCrear,
					],
					aparece: M.cursorEntra,
					sale: M.creada + 50,
				}}
			>
				{frame >= M.monta && <PantallaAsignaturas estado={estadoEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Tecleo texto={TECLEO.materia} desde={M.tecleaMateria} />
			<Tecleo texto={TECLEO.grupo} desde={M.tecleaGrupo} />
			<Tecleo texto={TECLEO.profesor} desde={M.tecleaProfesor} />
			<Tecleo texto={TECLEO.creditos} desde={M.tecleaCreditos} />
			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
