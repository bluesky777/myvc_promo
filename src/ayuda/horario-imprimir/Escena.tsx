import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { BarraDeDirecciones, Corte } from '../cierre-6/Piezas';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { LA_QUE_RIGE, VERSIONES } from '../horario/datos';
import { LISTA_QUIETA, PantallaImprimir, PantallaLista, PantallaVersion } from '../horario/Pantallas';
import { CIERRE, CORTE, DIRECCION, PASOS, PUNTOS, T, TARJETA } from './guion';

/* «IMPRIMIR EL HORARIO»: lista → la versión que rige → /imprimir tecleado → marcar dos informes. */

export const EscenaHorarioImprimir: React.FC = () => {
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

	const v = VERSIONES[LA_QUE_RIGE];
	const grupo = f >= T.pulsaGrupo + 2;
	const docente = f >= T.pulsaDocente + 2;
	const eImprimir = {
		marcados: { grupo, docente },
		abiertos: { grupo: avance(f, T.pulsaGrupo + 2, T.pulsaGrupo + 14), docente: avance(f, T.pulsaDocente + 2, T.pulsaDocente + 14) },
		encimaImprimir: entre(f, T.llegaImprimir, T.pulsaImprimir + 8),
	};

	const P = PUNTOS;
	const reposo = { x: 1330, y: 640 };

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
						{ frame: T.pulsaEntrada + 30, ...P.lista },
						{ frame: T.llegaVer, ...P.ver },
						{ frame: T.pulsaVer + 30, ...P.ver },
						{ frame: T.pulsaVer + 90, ...reposo },
						{ frame: T.llegaGrupo - 40, ...reposo },
						{ frame: T.llegaGrupo, ...P.grupo },
						{ frame: T.pulsaGrupo + 20, ...P.grupo },
						{ frame: T.llegaDocente, ...P.docente },
						{ frame: T.pulsaDocente + 30, ...P.docente },
						{ frame: T.pulsaDocente + 90, ...reposo },
						{ frame: T.llegaImprimir - 40, ...reposo },
						{ frame: T.llegaImprimir, ...P.imprimir },
					],
					clics: [T.pulsaHor, T.pulsaEntrada, T.pulsaVer, T.pulsaGrupo, T.pulsaDocente, T.pulsaImprimir],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.monta && f < T.seVaLista + 17 && (
					<PantallaLista e={{ ...LISTA_QUIETA, encimaVer: entre(f, T.llegaVer, T.pulsaVer + 6) ? LA_QUE_RIGE : null }} opacidad={entra(f, fps, T.monta, 14) * (1 - avance(f, T.seVaLista, T.seVaLista + 16))} />
				)}
				{f >= T.montaVersion && f < T.seVaVersion + 17 && (
					<PantallaVersion v={v} opacidad={entra(f, fps, T.montaVersion, 14) * (1 - avance(f, T.seVaVersion, T.seVaVersion + 16))} />
				)}
				{f >= T.montaImprimir && <PantallaImprimir e={eImprimir} v={v} opacidad={entra(f, fps, T.montaImprimir, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<BarraDeDirecciones desde={T.barra} teclea={T.teclea} intro={T.intro} porTecla={4} base={DIRECCION.base} tramo={DIRECCION.tramo} />
			<Corte desde={CORTE.desde} hasta={CORTE.hasta} texto={CORTE.texto} />

			{DIRECCION.tramo.split('').map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={T.teclea + (i + 1) * 4} />
			))}
			<Efecto cual="tecla2" en={T.intro} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
