import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Corte } from '../cierre-6/Piezas';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { PantallaPrograma } from '../horario/Pantallas';
import { CIERRE, CORTE, PASOS, PUNTOS, T, TARJETA } from './guion';

/* «DESCARGAR EL PROGRAMA»: la pantalla, y después la misma sin la carpeta de descargas, con su corte. */

export const EscenaHorarioPrograma: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [{ seccion: 'Horario', abre: T.abreHor }]);
	const senalada = senaladaEn(f, [
		{ desde: T.llegaHor, hasta: T.pulsaHor + 10, seccion: 'Horario', hija: null },
		{ desde: T.llegaEntrada, hasta: T.pulsaEntrada + 10, seccion: 'Horario', hija: 'Descargar el programa' },
	]);
	const P = PUNTOS;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={abierta}
				senalada={senalada}
				opacidad={entra(f, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaHor, ...P.horario },
						{ frame: T.llegaEntrada, ...P.programa },
						{ frame: T.pulsaEntrada + 40, ...P.programa },
						{ frame: T.llegaDescarga, ...P.descarga },
						{ frame: T.sueltaDescarga, ...P.descarga },
						{ frame: T.sueltaDescarga + 60, x: P.descarga.x + 460, y: P.descarga.y + 330 },
					],
					clics: [T.pulsaHor, T.pulsaEntrada],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.monta && f < T.seVa + 17 && (
					<PantallaPrograma opacidad={entra(f, fps, T.monta, 14) * (1 - avance(f, T.seVa, T.seVa + 16))} encimaDescarga={entre(f, T.llegaDescarga, T.sueltaDescarga)} />
				)}
				{f >= T.vuelve && <PantallaPrograma sinCarpeta opacidad={entra(f, fps, T.vuelve, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Corte desde={CORTE.desde} hasta={CORTE.hasta} texto={CORTE.texto} />

			<Efecto cual="aviso" en={T.vuelve + 4} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
