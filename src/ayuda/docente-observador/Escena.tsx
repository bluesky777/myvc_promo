import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { conPausas } from '../disciplina/pausas';
import { Cursor } from '../../comunes/Cursor';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaADisciplina } from '../disciplina/Llegada';
import { Rejilla } from '../disciplina/Rejilla';
import { BOTONES_DEL_PIE } from '../disciplina/datos';
import { PaginaDelObservador } from './Observador';
import { CIERRE, LLEGADA, OBSERVADOR, PASOS, PUNTOS, TARJETA, margenEn } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL OBSERVADOR DEL GRUPO»: encadena. La llegada (con la parada en el pie sin grupo), la rejilla
 * con los tres botones, y la pestaña nueva del observador completo.
 */

const OBS = BOTONES_DEL_PIE.indexOf('Observador completo');

export const EscenaDocenteObservador: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<LlegadaADisciplina t={LLEGADA} />

			{frame < OBSERVADOR.monta + 40 && (
				<Rejilla
					estado={{
						monta: LLEGADA.entraLaRejilla,
						salidaEn: OBSERVADOR.seVaLaRejilla,
						pieSenalado: (f) => (f >= OBSERVADOR.llegaBoton && f < OBSERVADOR.pulsaBoton + 4 ? OBS : null),
					}}
				/>
			)}

			<PaginaDelObservador
				monta={OBSERVADOR.monta}
				carga={OBSERVADOR.carga}
				margen={margenEn}
				sobreMargen={(f) => f >= OBSERVADOR.llegaMargen - 6 && f < OBSERVADOR.sueltaMargen}
				sobreImprimir={(f) => f >= OBSERVADOR.llegaImprimir && f < OBSERVADOR.pulsaImprimir + 6}
			/>

			<Cursor
				puntos={conPausas([
					{ frame: LLEGADA.entraLaRejilla + 30, x: 1500, y: 700 },
					{ frame: OBSERVADOR.llegaBoton - 40, x: 1400, y: 700 },
					{ frame: OBSERVADOR.llegaBoton, ...PUNTOS.completo },
					{ frame: OBSERVADOR.monta + 20, x: 1500, y: 700 },
					{ frame: OBSERVADOR.llegaMargen - 60, x: 1500, y: 700 },
					{ frame: OBSERVADOR.llegaMargen, ...PUNTOS.flecha },
					{ frame: OBSERVADOR.sueltaMargen, ...PUNTOS.flecha },
					{ frame: OBSERVADOR.sueltaMargen + 30, x: PUNTOS.flecha.x + 60, y: PUNTOS.flecha.y + 90 },
					{ frame: OBSERVADOR.llegaImprimir - 50, x: PUNTOS.flecha.x + 60, y: PUNTOS.flecha.y + 90 },
					{ frame: OBSERVADOR.llegaImprimir, ...PUNTOS.imprimir },
				], [OBSERVADOR.pulsaBoton, ...OBSERVADOR.clics, OBSERVADOR.pulsaImprimir])}
				clics={[OBSERVADOR.pulsaBoton, ...OBSERVADOR.clics, OBSERVADOR.pulsaImprimir]}
				aparece={LLEGADA.entraLaRejilla + 30}
				sale={TARJETA - 30}
				tam={34}
			/>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
