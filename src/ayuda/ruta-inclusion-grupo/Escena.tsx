import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { ACADEMICO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Ficha } from '../ruta-inclusion/Ficha';
import { Listado } from '../ruta-inclusion/Listado';
import { EL_ESTUDIANTE, EL_GRUPO, RUTA } from '../ruta-inclusion/datos';
import { CIERRE, GRUPO_T, LLEGADA, PASOS, PUNTOS, TARJETA } from './guion';

/* «RUTA DE INCLUSIÓN: EL GRUPO»: encadena, no dibuja. El listado del grupo y, al final, la ficha. */

export const EscenaRutaInclusionGrupo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaRuta && frame < LLEGADA.pulsaRuta + 10
			? { seccion: ACADEMICO, hija: RUTA }
			: null;

	const rel = (f: number) => f - LLEGADA.monta;
	const encima = frame >= GRUPO_T.llega - 4 && frame < GRUPO_T.pulsa ? `grupo-${EL_GRUPO}`
		: frame >= GRUPO_T.llegaContexto - 4 && frame < GRUPO_T.pulsaContexto + 6 ? 'contexto'
			: frame >= GRUPO_T.llegaFila - 4 && frame < GRUPO_T.pulsaFila + 4 ? `fila-${EL_ESTUDIANTE}`
				: null;

	const clics = [LLEGADA.pulsaAcademico, LLEGADA.pulsaRuta, GRUPO_T.pulsa, GRUPO_T.pulsaContexto, GRUPO_T.pulsaFila];

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascaraDe
				abierta={{ seccion: ACADEMICO, t: abierta }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: conPausas([
						{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
						{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
						{ frame: LLEGADA.llegaRuta, ...PUNTOS.ruta },
						{ frame: LLEGADA.monta + 20, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llega - 18, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llega, ...PUNTOS.grupo },
						{ frame: GRUPO_T.pulsa + 20, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llegaContexto - 18, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llegaContexto, ...PUNTOS.contexto },
						{ frame: GRUPO_T.pulsaContexto + 20, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llegaFila - 18, ...PUNTOS.reposo },
						{ frame: GRUPO_T.llegaFila, ...PUNTOS.fila },
						{ frame: GRUPO_T.pulsaFila + 20, ...PUNTOS.reposo },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.monta && frame < GRUPO_T.montaFicha && (
					<Sequence from={LLEGADA.monta}>
						<Listado
							e={{
								grupo: frame >= GRUPO_T.pulsa ? EL_GRUPO : null,
								cargadoEn: frame >= GRUPO_T.pulsa ? rel(GRUPO_T.cargado) : null,
								contextoAbierto: frame >= GRUPO_T.pulsaContexto,
								encima,
								salidaEn: rel(GRUPO_T.pulsaFila),
							}}
						/>
					</Sequence>
				)}
				{frame >= GRUPO_T.montaFicha && (
					<Sequence from={GRUPO_T.montaFicha}>
						<Ficha e={{ pestana: 0, pestanaDesde: 0, materia: 0, encima: null }} />
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
