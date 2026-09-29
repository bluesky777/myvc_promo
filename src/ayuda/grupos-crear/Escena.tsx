import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { PantallaAsignaturas } from '../montar-el-ano/Asignaturas';
import { ASIGNATURAS, EnLaCascara, GRUPOS, REFERENCIAS } from '../montar-el-ano/EnLaCascara';
import { PantallaGrupos } from '../montar-el-ano/Grupos';
import { entre } from '../montar-el-ano/tiempo';
import { ASIGNATURAS_AL_LLEGAR, M, TECLEO, estadoGruposEn } from './datos';
import { AVISO, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * «CREAR LOS GRUPOS DEL AÑO»: encadena, no dibuja. Grupos, y al final Asignaturas por el menú: la
 * primera se apaga entera antes de montar la segunda, que es la regla de no desmontar a mitad de
 * salida.
 */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra, a 4 fotogramas (lo que usa `tecleado`). */
const TECLEADOS = ([
	[TECLEO.nombre, M.tecleaNombre],
	[TECLEO.abrev, M.tecleaAbrev],
	[TECLEO.titular, M.tecleaTitular],
	[TECLEO.orden, M.tecleaOrden],
	[TECLEO.ih, M.tecleaIh],
] as const).flatMap(([texto, desde]) => [...texto].map((_, i) => desde + i * 4));

export const EscenaGruposCrear: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, M.llegaReferencias, M.pulsaReferencias + 10)
		? { seccion: REFERENCIAS, hija: null }
		: entre(frame, M.llegaEntrada, M.pulsaEntrada + 10)
			? { seccion: REFERENCIAS, hija: GRUPOS }
			: entre(frame, M.llegaAsignaturas, M.pulsaAsignaturas + 10)
				? { seccion: REFERENCIAS, hija: ASIGNATURAS }
				: null;

	const P = PUNTOS;
	const reposo = { x: 1428, y: 560 };
	const seVa = interpolate(frame, [M.seVaGrupos, M.seVaGrupos + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
						{ frame: M.llegaCrear - 30, ...P.grupos },
						{ frame: M.llegaCrear, ...P.crear },
						{ frame: M.pulsaCrear + 10, ...P.crear },
						{ frame: M.llegaNombre, ...P.nombre },
						{ frame: M.pulsaNombre + 6, ...P.nombre },
						{ frame: M.llegaAbrev, ...P.abrev },
						{ frame: M.pulsaAbrev + 6, ...P.abrev },
						{ frame: M.llegaGrado, ...P.grado },
						{ frame: M.bajaListaHasta, ...P.grado },
						{ frame: M.llegaOpcionGrado, ...P.opcionGrado },
						{ frame: M.pulsaOpcionGrado + 6, ...P.opcionGrado },
						{ frame: M.llegaTitular, ...P.titular },
						{ frame: M.tecleaTitular, ...P.titular },
						{ frame: M.llegaOpcionTitular, ...P.opcionTitular },
						{ frame: M.pulsaOpcionTitular + 6, ...P.opcionTitular },
						{ frame: M.llegaOrden, ...P.orden },
						{ frame: M.pulsaOrden + 6, ...P.orden },
						{ frame: M.llegaIh, ...P.ih },
						{ frame: M.pulsaIh + 6, ...P.ih },
						{ frame: M.tecleaIh + 12, x: P.ih.x + 150, y: P.ih.y + 84 },
						{ frame: M.llegaCrearFicha - 40, x: P.ih.x + 150, y: P.ih.y + 84 },
						{ frame: M.llegaCrearFicha, ...P.crearFicha },
						{ frame: M.pulsaCrearFicha + 20, ...P.crearFicha },
						{ frame: M.bajaDesde, ...reposo },
						{ frame: M.bajaHasta, ...reposo },
						{ frame: M.llegaBarra, ...P.pulgar },
						{ frame: M.agarraBarra, ...P.pulgar },
						{ frame: M.sueltaBarra, ...P.pulgarSuelto },
						{ frame: M.sueltaBarra + 40, ...P.pulgarSuelto },
						{ frame: M.llegaAsignaturas - 60, ...reposo },
						{ frame: M.llegaAsignaturas, ...P.asignaturas },
						{ frame: M.pulsaAsignaturas + 30, ...P.asignaturas },
					],
					clics: [
						M.pulsaReferencias, M.pulsaEntrada, M.pulsaCrear, M.pulsaNombre, M.pulsaAbrev, M.pulsaGrado, M.pulsaOpcionGrado, M.pulsaTitular,
						M.pulsaOpcionTitular, M.pulsaOrden, M.pulsaIh, M.pulsaCrearFicha, M.agarraBarra, M.pulsaAsignaturas,
					],
					aparece: M.cursorEntra,
					sale: M.pulsaAsignaturas + 60,
				}}
			>
				{frame >= M.monta && frame < M.montaAsignaturas && (
					<PantallaGrupos estado={estadoGruposEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14) * seVa} />
				)}
				{frame >= M.montaAsignaturas && <PantallaAsignaturas estado={ASIGNATURAS_AL_LLEGAR} opacidad={entra(frame, fps, M.montaAsignaturas, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{TECLEADOS.map((en, i) => <Efecto key={i} cual={TECLAS[i % 3]} en={en} />)}
			<Efecto cual="aviso" en={AVISO.desde} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
