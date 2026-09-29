import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
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
import { CIERRE, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * «LOS DÍAS DE CLASE DE UNA ASIGNATURA»: encadena, no dibuja. Sin aviso: al conmutar un día la
 * aplicación no dice nada si sale bien, y el vídeo tampoco se lo inventa.
 */

export const EscenaAsignaturasDias: React.FC = () => {
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
	const reposo = { x: 1428, y: 560 };
	const [lunes, miercoles, viernes] = P.dias;

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
						{ frame: M.llegaFiltro - 30, ...P.asignaturas },
						{ frame: M.llegaFiltro, ...P.filtro },
						{ frame: M.tecleaFiltro, ...P.filtro },
						{ frame: M.llegaOpcionFiltro, ...P.opcionFiltro },
						{ frame: M.pulsaOpcionFiltro + 20, ...P.opcionFiltro },
						{ frame: M.llegaBarra, ...P.pulgar },
						{ frame: M.agarraBarra, ...P.pulgar },
						/* El arrastre va con la rejilla: el pulgar y el puntero salen del mismo avance. */
						{ frame: M.sueltaBarra, ...P.pulgarSuelto },
						{ frame: M.sueltaBarra + 40, ...P.pulgarSuelto },
						{ frame: M.pulsaDia[0] - 10, ...lunes },
						{ frame: M.pulsaDia[0] + 8, ...lunes },
						{ frame: M.pulsaDia[1] - 10, ...miercoles },
						{ frame: M.pulsaDia[1] + 8, ...miercoles },
						{ frame: M.pulsaDia[2] - 10, ...viernes },
						{ frame: M.pulsaDia[2] + 16, ...viernes },
						{ frame: M.pulsaDia[2] + 70, ...reposo },
					],
					clics: [M.pulsaReferencias, M.pulsaEntrada, M.pulsaFiltro, M.pulsaOpcionFiltro, M.agarraBarra, ...M.pulsaDia],
					aparece: M.cursorEntra,
					sale: M.pulsaDia[2] + 90,
				}}
			>
				{frame >= M.monta && <PantallaAsignaturas estado={estadoEn(frame, fps)} opacidad={entra(frame, fps, M.monta, 14)} />}
			</EnLaCascara>

			{[...TECLEO.filtro].map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={M.tecleaFiltro + i * 4} />
			))}

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
