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
import { EL_ESTUDIANTE, EL_GRUPO, LA_AJENA, RUTA } from '../ruta-inclusion/datos';
import { CIERRE, LLEGADA, PASOS, PESTANAS, PUNTOS, TARJETA } from './guion';

/* «RUTA DE INCLUSIÓN: LAS CINCO PARTES»: del listado a la ficha, y pestaña por pestaña. */

const P = PESTANAS;

function pestanaEn(frame: number): { pestana: number; desde: number } {
	const cambios: [number, number][] = [[P.pulsaValoracion, 1], [P.pulsaAjustes, 2], [P.pulsaActas, 3], [P.pulsaInforme, 4]];
	let r = { pestana: 0, desde: 0 };
	for (const [f, p] of cambios) { if (frame >= f + 2) { r = { pestana: p, desde: f + 2 - LLEGADA.montaFicha }; } }
	return r;
}

export const EscenaRutaInclusionPartes: React.FC = () => {
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

	const pes = pestanaEn(frame);
	const encimaPestana = ([
		[P.llegaValoracion, P.pulsaValoracion, 1], [P.llegaAjustes, P.pulsaAjustes, 2], [P.llegaActas, P.pulsaActas, 3], [P.llegaInforme, P.pulsaInforme, 4],
	] as const).find(([l, p]) => frame >= l - 4 && frame < p + 4);
	const encimaFicha = encimaPestana ? `pestana-${encimaPestana[2]}`
		: frame >= P.llegaAjena - 4 && frame < P.pulsaAjena + 4 ? `materia-${LA_AJENA}` : null;

	const clics = [LLEGADA.pulsaAcademico, LLEGADA.pulsaRuta, LLEGADA.pulsaFila, P.pulsaValoracion, P.pulsaAjustes, P.pulsaAjena, P.pulsaActas, P.pulsaInforme];

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
						{ frame: LLEGADA.pulsaRuta + 20, ...PUNTOS.reposo },
						{ frame: LLEGADA.llegaFila - 18, ...PUNTOS.reposo },
						{ frame: LLEGADA.llegaFila, ...PUNTOS.fila },
						{ frame: LLEGADA.pulsaFila + 20, ...PUNTOS.reposo },
						{ frame: P.llegaValoracion - 18, ...PUNTOS.reposo },
						{ frame: P.llegaValoracion, ...PUNTOS.pestana(1) },
						{ frame: P.llegaAjustes - 18, ...PUNTOS.pestana(1) },
						{ frame: P.llegaAjustes, ...PUNTOS.pestana(2) },
						{ frame: P.llegaAjena - 18, ...PUNTOS.pestana(2) },
						{ frame: P.llegaAjena, ...PUNTOS.ajena },
						{ frame: P.llegaActas - 18, ...PUNTOS.ajena },
						{ frame: P.llegaActas, ...PUNTOS.pestana(3) },
						{ frame: P.llegaInforme - 18, ...PUNTOS.pestana(3) },
						{ frame: P.llegaInforme, ...PUNTOS.pestana(4) },
						{ frame: P.pulsaInforme + 20, ...PUNTOS.reposo },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.monta && frame < LLEGADA.montaFicha && (
					<Sequence from={LLEGADA.monta}>
						<Listado
							e={{
								grupo: EL_GRUPO,
								cargadoEn: LLEGADA.cargado - LLEGADA.monta,
								contextoAbierto: false,
								encima: frame >= LLEGADA.llegaFila - 4 && frame < LLEGADA.pulsaFila + 4 ? `fila-${EL_ESTUDIANTE}` : null,
								salidaEn: LLEGADA.pulsaFila - LLEGADA.monta,
							}}
						/>
					</Sequence>
				)}
				{frame >= LLEGADA.montaFicha && (
					<Sequence from={LLEGADA.montaFicha}>
						<Ficha e={{ pestana: pes.pestana, pestanaDesde: pes.desde, materia: frame >= P.pulsaAjena + 2 ? LA_AJENA : 0, encima: encimaFicha }} />
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
