import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { conPausas } from '../disciplina/pausas';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { EnLaCascaraDe } from '../EnLaCascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { ACADEMICO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Bajar } from '../sin-internet/Bajar';
import { ARCHIVO, LA_COMPLETA, SIN_INTERNET } from '../sin-internet/datos';
import { AVISO_DURA, CIERRE, DESCARGA, LLEGADA, PASOS, PUNTOS, TABLA, TARJETA } from './guion';

/*
 * «BAJAR EL LIBRO»: encadena, no dibuja. Todo el vídeo pasa dentro de la cáscara, en una sola
 * pantalla: se llega, se mira la tabla, se desmarca la completa y se descarga.
 */

export const EscenaSinInternetBajar: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = entra(frame, fps, LLEGADA.abreAcademico, 16);
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaSinInternet && frame < LLEGADA.pulsaSinInternet + 10
			? { seccion: ACADEMICO, hija: SIN_INTERNET }
			: null;

	const encima = frame >= TABLA.llegaCasilla - 4 && frame < TABLA.pulsaCasilla + 12
		? LA_COMPLETA
		: frame >= DESCARGA.llegaBoton - 4 && frame < DESCARGA.pulsaBoton + 10 ? 'descargar' as const : null;

	const clics = [LLEGADA.pulsaAcademico, LLEGADA.pulsaSinInternet, TABLA.pulsaCasilla, DESCARGA.pulsaBoton];

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
						{ frame: LLEGADA.llegaSinInternet, ...PUNTOS.sinInternet },
						{ frame: LLEGADA.monta + 20, ...PUNTOS.reposo },
						{ frame: TABLA.llegaCasilla - 18, ...PUNTOS.reposo },
						{ frame: TABLA.llegaCasilla, ...PUNTOS.casilla },
						{ frame: TABLA.pulsaCasilla + 20, ...PUNTOS.reposo },
						{ frame: DESCARGA.llegaBoton - 18, ...PUNTOS.reposo },
						{ frame: DESCARGA.llegaBoton, ...PUNTOS.descargar },
						{ frame: DESCARGA.pulsaBoton + 30, x: PUNTOS.descargar.x - 40, y: PUNTOS.descargar.y + 70 },
					], clics),
					clics,
					aparece: LLEGADA.cursorEntra,
					sale: TARJETA - 20,
				}}
			>
				{frame >= LLEGADA.monta && (
					<Sequence from={LLEGADA.monta}>
						<Bajar
							estado={{
								fuera: frame >= TABLA.pulsaCasilla ? [LA_COMPLETA] : [],
								descargando: frame >= DESCARGA.pulsaBoton && frame < DESCARGA.aviso,
								encima,
							}}
						/>
					</Sequence>
				)}
			</EnLaCascaraDe>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={DESCARGA.aviso} />
			<AvisoBajoLaCabecera texto={`Se descargó «${ARCHIVO}».`} desde={DESCARGA.aviso} dura={AVISO_DURA} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
