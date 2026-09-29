import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Efecto } from '../voz';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { avance, entre } from '../montar-el-ano/tiempo';
import { DialogoBorrar } from '../secretaria/Borrar';
import { PantallaDirectorio } from '../secretaria/Directorio';
import { EnLaCascara } from '../secretaria/EnLaCascara';
import { PERSONAS, dePersonas } from '../secretaria/menu';
import { Mensaje } from '../secretaria/piezas';
import { nombreCompleto } from '../secretaria/personas';
import { BORRADO, M, estadoEn } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * «EL DIRECTORIO DE ALUMNOS»: encadena, no dibuja. Una sola pantalla, con el diálogo de borrar encima.
 */

export const EscenaAlumnosDirectorio: React.FC = () => {
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
	const reposo = { x: 1250, y: 420 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={{ seccion: PERSONAS, t: entra(frame, fps, M.abrePersonas, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					frame >= M.abreBorrar && frame < M.eliminado + 8 ? (
						<DialogoBorrar
							nombre={nombreCompleto(BORRADO)}
							id={BORRADO.id}
							t={avance(frame, M.abreBorrar, M.abreBorrar + 12)}
							sale={avance(frame, M.eliminado, M.eliminado + 8)}
							encimaEliminar={entre(frame, M.llegaEliminar, M.eliminado)}
						/>
					) : null
				}
				cursor={{
					puntos: [
						{ frame: M.cursorEntra, ...P.entrada },
						{ frame: M.llegaPersonas, ...P.personas },
						{ frame: M.llegaAlumnos, ...P.alumnos },
						{ frame: M.llega9B - 18, ...P.alumnos },
						{ frame: M.llega9B, ...P.g9B },
						{ frame: M.llegaCelda - 20, ...P.g9B },
						{ frame: M.llegaCelda, ...P.celda },
						{ frame: M.pulsaCelda + 8, ...P.celda },
						{ frame: M.borra + 6, x: P.celda.x + 60, y: P.celda.y + 60 },
						{ frame: M.llegaFuera - 16, x: P.celda.x + 60, y: P.celda.y + 60 },
						{ frame: M.llegaFuera, ...P.fuera },
						{ frame: M.llegaReti - 20, ...P.fuera },
						{ frame: M.llegaReti, ...P.reti },
						{ frame: M.bajaRapidaDesde, ...P.reti },
						{ frame: M.bajaRapidaHasta, ...reposo },
						{ frame: M.llegaSinMatricula, ...P.sinMatricula },
						{ frame: M.bajaListaDesde, ...P.sinMatricula },
						{ frame: M.bajaListaHasta + 10, ...P.lista },
						{ frame: M.llegaAno - 20, ...P.lista },
						{ frame: M.llegaAno, ...P.ano },
						{ frame: M.llegaMatric - 20, ...P.ano },
						{ frame: M.llegaMatric, ...P.matric },
						{ frame: M.pulsaMatric + 12, ...P.matric },
						{ frame: M.pulsaMatric + 34, ...reposo },
						{ frame: M.llegaPapelera, ...P.papelera },
						{ frame: M.pulsaPapelera + 14, ...P.papelera },
						{ frame: M.llegaEliminar, ...P.eliminar },
						{ frame: M.eliminado + 16, ...P.eliminar },
						{ frame: M.llegaCaja, ...P.caja },
						{ frame: M.pulsaCaja + 8, ...P.caja },
						{ frame: M.llegaPorNombre, ...P.porNombre },
						{ frame: M.bajaMasDesde, ...P.porNombre },
						{ frame: M.bajaMasHasta + 8, ...reposo },
						{ frame: M.llegaRestaurar - 12, ...reposo },
						{ frame: M.llegaRestaurar, ...P.restaurar },
						{ frame: M.subeDesde, ...P.restaurar },
						{ frame: M.subeHasta, ...reposo },
						{ frame: M.llegaRecargar, ...P.recargar },
					],
					clics: [M.pulsaPersonas, M.pulsaAlumnos, M.pulsa9B, M.pulsaCelda, M.sale, M.pulsaSinMatricula, M.pulsaMatric, M.pulsaPapelera, M.pulsaEliminar, M.pulsaCaja, M.pulsaPorNombre, M.pulsaRestaurar, M.pulsaRecargar],
					aparece: M.cursorEntra,
					sale: TARJETA - 30,
				}}
			>
				{frame >= M.monta && <PantallaDirectorio estado={estadoEn(frame)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20}>
					{/* Corrido a la derecha: centrado, el largo rozaba la miga «… ▸ Alumnos». */}
					<AbsoluteFill style={{ left: 300 }}>
						<Mensaje texto={a.texto} desde={0} dura={a.dura} tono={a.tono} />
					</AbsoluteFill>
				</Sequence>
			))}

			{/* El tecleo: tres borrados y «zano» en la celda, y «Martín» en el buscador. */}
			{[...[0, 1, 2].map((i) => M.borra + i * 4), ...[0, 1, 2, 3].map((i) => M.escribe + i * 4), ...[0, 1, 2, 3, 4, 5].map((i) => M.teclea + i * 4)].map((en, i) => (
				<Efecto key={en} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={en} />
			))}
			{AVISOS.map((a) => <Efecto key={`aviso-${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
