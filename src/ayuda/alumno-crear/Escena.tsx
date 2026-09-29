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
import { M, NUEVO, estadoDirectorioEn, estadoNuevoEn } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';
import { Efecto } from '../voz';
import { PantallaNuevo } from './NuevoAlumno';

/*
 * «CREAR UN ALUMNO»: encadena, no dibuja. Personas ▸ Alumnos, «Crear alumno», y la ficha nueva. El
 * directorio se apaga entero antes de montar la ficha (no se desmonta a mitad de salida).
 */

export const EscenaAlumnoCrear: React.FC = () => {
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
	const aparte = (p: { x: number; y: number }) => ({ x: p.x + 90, y: p.y + 60 });
	/* A la derecha del tipo de documento, donde no tapa nada. */
	const REPOSO = { x: 1150, y: 760 };

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
						{ frame: M.llegaCrearAlumno - 30, ...P.alumnos },
						{ frame: M.llegaCrearAlumno, ...P.crearAlumno },
						{ frame: M.pulsaCrearAlumno + 30, ...P.crearAlumno },
						{ frame: M.llegaNombres, ...P.nombres },
						{ frame: M.pulsaNombres + 4, ...P.nombres },
						{ frame: M.llegaApellidos, ...P.apellidos },
						{ frame: M.pulsaApellidos + 6, ...P.apellidos },
						{ frame: M.tecleaApellidos + 20, ...REPOSO },
						{ frame: M.llegaEsEste - 40, ...REPOSO },
						{ frame: M.llegaEsEste, ...P.esEste },
						{ frame: M.llegaEsEste + 25, ...P.esEste },
						{ frame: M.llegaEsEste + 45, ...aparte(P.esEste) },
						{ frame: M.llegaEscape - 40, ...aparte(P.escape) },
						{ frame: M.llegaEscape, ...P.escape },
						{ frame: M.pulsaEscape + 20, ...P.escape },
						{ frame: M.llegaGrupo, ...P.grupo },
						{ frame: M.pulsaGrupo + 10, ...P.grupo },
						{ frame: M.llegaOpcion, ...P.opcion },
						{ frame: M.pulsaOpcion + 20, ...P.opcion },
						{ frame: M.llegaCrear, ...P.crear },
					],
					clics: [M.pulsaPersonas, M.pulsaAlumnos, M.pulsaCrearAlumno, M.pulsaNombres, M.pulsaApellidos, M.pulsaEscape, M.pulsaGrupo, M.pulsaOpcion, M.pulsaCrear],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.montaDirectorio && frame < M.montaNuevo && <PantallaDirectorio estado={{ ...estadoDirectorioEn(frame), opacidad: estadoDirectorioEn(frame).opacidad! * entra(frame, fps, M.montaDirectorio, 14) }} />}
				{frame >= M.montaNuevo && <PantallaNuevo estado={estadoNuevoEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.texto} from={a.desde} durationInFrames={a.dura + 20}>
					{/* Corrido a la derecha: centrado, tapaba el final de la miga «… ▸ Nuevo alumno». */}
					<AbsoluteFill style={{ left: 300 }}>
						<Mensaje texto={a.texto} desde={0} dura={a.dura} tono={a.tono} />
					</AbsoluteFill>
				</Sequence>
			))}

			{AVISOS.map((a) => <Efecto key={`aviso-${a.desde}`} cual="aviso" en={a.desde} />)}
			<Tecleo texto={NUEVO.nombres} desde={M.tecleaNombres} />
			<Tecleo texto={NUEVO.apellidos} desde={M.tecleaApellidos} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/* Una tecla por letra (`tecleado` escribe una cada 4 fotogramas), alternando los tres sonidos. */
const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const Tecleo: React.FC<{ texto: string; desde: number }> = ({ texto, desde }) => (
	<>
		{[...texto].map((c, i) => (c === ' ' ? null : <Efecto key={i} cual={TECLAS[i % 3]} en={desde + i * 4} />))}
	</>
);
