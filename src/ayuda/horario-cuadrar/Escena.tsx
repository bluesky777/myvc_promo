import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

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
import { OtraPestana } from '../horario/OtraPestana';
import { PantallaCuadrar, type EstadoCuadrar } from '../horario/Pantallas';
import { CIERRE, CORTE, PASOS, PUNTOS, T, TARJETA } from './guion';

/* «CUADRAR EL HORARIO»: la pantalla, la otra pestaña delante, la vuelta, y el caso bloqueado. */

export const EscenaHorarioCuadrar: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [{ seccion: 'Horario', abre: T.abreHor }]);
	const senalada = senaladaEn(f, [
		{ desde: T.llegaHor, hasta: T.pulsaHor + 10, seccion: 'Horario', hija: null },
		{ desde: T.llegaEntrada, hasta: T.pulsaEntrada + 10, seccion: 'Horario', hija: 'Cuadrar el horario' },
	]);

	const estado: EstadoCuadrar = f < T.esperando ? 'nada' : f < T.entregado ? 'esperando' : 'listo';
	const pestana = f < T.pestana ? 0 : entra(f, fps, T.pestana, 16) * (1 - interpolate(f, [T.vuelve, T.vuelve + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

	const P = PUNTOS;
	const aparte = { x: P.abrir.x + 600, y: P.abrir.y + 470 };

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
						{ frame: T.llegaEntrada, ...P.cuadrar },
						{ frame: T.pulsaEntrada + 30, ...P.cuadrar },
						{ frame: T.pulsaEntrada + 70, ...aparte },
						{ frame: T.llegaAbrir - 30, ...aparte },
						{ frame: T.llegaAbrir, ...P.abrir },
						{ frame: T.pulsaAbrir + 20, ...P.abrir },
						{ frame: T.pulsaAbrir + 70, ...aparte },
					],
					clics: [T.pulsaHor, T.pulsaEntrada, T.pulsaAbrir],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.monta && f < T.seVa + 17 && (
					<PantallaCuadrar
						estado={estado}
						opacidad={entra(f, fps, T.monta, 14) * (1 - avance(f, T.seVa, T.seVa + 16))}
						encimaAbrir={entre(f, T.llegaAbrir, T.pulsaAbrir + 6)}
						aparece={estado === 'listo' ? avance(f, T.entregado, T.entregado + 10) : estado === 'esperando' ? avance(f, T.esperando, T.esperando + 8) : 1}
					/>
				)}
				{f >= T.bloqueado && <PantallaCuadrar estado="bloqueado" opacidad={entra(f, fps, T.bloqueado, 14)} />}
			</EnLaCascara>

			<OtraPestana aparece={pestana} desde={T.rejilla} />

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Corte desde={CORTE.desde} hasta={CORTE.hasta} texto={CORTE.texto} />

			<Efecto cual="aviso" en={T.esperando} />
			<Efecto cual="aviso" en={T.entregado} />
			<Efecto cual="aviso" en={T.bloqueado + 4} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
