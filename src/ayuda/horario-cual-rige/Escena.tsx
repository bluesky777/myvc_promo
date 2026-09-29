import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { LA_NUEVA, VERSIONES } from '../horario/datos';
import { LISTA_QUIETA, PantallaLista, PantallaVersion } from '../horario/Pantallas';
import { CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/* «CUÁL HORARIO RIGE»: la lista, un borrador por dentro, y de vuelta a la lista para publicar. */

export const EscenaHorarioCualRige: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [{ seccion: 'Horario', abre: T.abreHor }]);
	const senalada = senaladaEn(f, [
		{ desde: T.llegaHor, hasta: T.pulsaHor + 10, seccion: 'Horario', hija: null },
		{ desde: T.llegaEntrada, hasta: T.pulsaEntrada + 10, seccion: 'Horario', hija: 'El horario del colegio' },
	]);

	const confirmando = f < T.abreConfirmar ? 0 : entra(f, fps, T.abreConfirmar, 14) * (1 - avance(f, T.cierraConfirmar, T.cierraConfirmar + 12));
	const P = PUNTOS;
	const reposo = { x: 1330, y: 850 };

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
						{ frame: T.llegaEntrada, ...P.lista },
						{ frame: T.pulsaEntrada + 40, ...P.lista },
						{ frame: T.pulsaEntrada + 110, ...reposo },
						{ frame: T.llegaVer - 40, ...reposo },
						{ frame: T.llegaVer, ...P.ver },
						{ frame: T.pulsaVer + 30, ...P.ver },
						{ frame: T.pulsaVer + 90, ...reposo },
						{ frame: T.llegaVolver - 40, ...reposo },
						{ frame: T.llegaVolver, ...P.volver },
						{ frame: T.pulsaVolver + 20, ...P.volver },
						{ frame: T.llegaPublicar - 30, ...reposo },
						{ frame: T.llegaPublicar, ...P.publicar },
						{ frame: T.pulsaPublicar + 20, ...P.publicar },
						{ frame: T.pulsaPublicar + 70, x: P.no.x + 300, y: P.no.y + 60 },
						{ frame: T.llegaNo - 40, x: P.no.x + 300, y: P.no.y + 60 },
						{ frame: T.llegaNo, ...P.no },
					],
					clics: [T.pulsaHor, T.pulsaEntrada, T.pulsaVer, T.pulsaVolver, T.pulsaPublicar, T.pulsaNo],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.monta && f < T.seVaLista + 17 && (
					<PantallaLista e={{ ...LISTA_QUIETA, encimaVer: entre(f, T.llegaVer, T.pulsaVer + 6) ? LA_NUEVA : null }} opacidad={entra(f, fps, T.monta, 14) * (1 - avance(f, T.seVaLista, T.seVaLista + 16))} />
				)}
				{f >= T.montaVersion && f < T.seVaVersion + 17 && (
					<PantallaVersion v={VERSIONES[LA_NUEVA]} encimaVolver={entre(f, T.llegaVolver, T.pulsaVolver + 6)} opacidad={entra(f, fps, T.montaVersion, 14) * (1 - avance(f, T.seVaVersion, T.seVaVersion + 16))} />
				)}
				{f >= T.montaLista && (
					<PantallaLista
						e={{ encimaVer: null, encimaPublicar: entre(f, T.llegaPublicar, T.pulsaPublicar + 6), confirmando, encimaNoPublicar: entre(f, T.llegaNo, T.pulsaNo + 6) }}
						opacidad={entra(f, fps, T.montaLista, 14)}
					/>
				)}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={T.abreConfirmar} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
