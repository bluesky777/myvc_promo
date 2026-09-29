import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { AvisoApp } from '../comun-directivo/AvisoApp';
import { EnLaCascara } from '../comun-directivo/Escenario';
import { abiertaEn, avance, entre, senaladaEn } from '../comun-directivo/lugar';
import { AL_ENTRAR, LA_BUENA } from './datos';
import { AVISOS, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';
import { PantallaCandidatos, PantallaConfig } from './Pantallas';

/*
 * «VOTACIONES»: encadena, no dibuja. El menú abre Configuración y dentro el grupo Votaciones, que
 * es el tercer nivel; Configurar se apaga entera antes de montar Candidatos.
 */

export const EscenaVotaciones: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, f);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = abiertaEn(f, fps, [{ seccion: 'Configuración', abre: T.abreConfig }]);
	const subAbierta = f >= T.abreVot ? { hija: 'Votaciones', t: entra(f, fps, T.abreVot, 16) } : null;
	const senalada = senaladaEn(f, [
		{ desde: T.llegaConfig, hasta: T.pulsaConfig + 10, seccion: 'Configuración', hija: null },
		{ desde: T.llegaVot, hasta: T.pulsaVot + 10, seccion: 'Configuración', hija: 'Votaciones' },
	]);
	const nietaSenalada = entre(f, T.llegaConfigurar, T.pulsaConfigurar + 10) ? 0 : entre(f, T.llegaCandidatos, T.pulsaCandidatos + 10) ? 1 : null;

	const cierraSel = interpolate(f, [T.pulsaOpcion + 2, T.pulsaOpcion + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const eConfig = {
		elegida: f >= T.cambiaEleccion ? LA_BUENA : AL_ENTRAR,
		/* La del simulacro trae la marca del año; la buena entra sin ninguna de las dos. */
		actual: f < T.cambiaEleccion ? true : f >= T.cambiaActual,
		in_action: f >= T.cambiaAbierta,
		desplegable: f >= T.abreSelector ? entra(f, fps, T.abreSelector, 10) * cierraSel : 0,
		resaltada: f >= T.llegaOpcion - 8 ? LA_BUENA : null,
		encima: entre(f, T.llegaActual, T.pulsaActual + 8) ? ('actual' as const) : entre(f, T.llegaAbierta, T.pulsaAbierta + 8) ? ('in_action' as const) : null,
	};

	const P = PUNTOS;
	const aparte = { x: P.actual.x + 420, y: P.actual.y + 40 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara
				abierta={abierta}
				senalada={senalada}
				subAbierta={subAbierta}
				nietaSenalada={nietaSenalada}
				opacidad={entra(f, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.configuracion },
						{ frame: T.llegaVot, ...P.votaciones },
						{ frame: T.llegaConfigurar, ...P.configurar },
						{ frame: T.pulsaConfigurar + 30, ...P.configurar },
						{ frame: T.pulsaConfigurar + 90, x: P.selector.x + 300, y: P.selector.y + 240 },
						{ frame: T.llegaSelector - 30, x: P.selector.x + 300, y: P.selector.y + 240 },
						{ frame: T.llegaSelector, ...P.selector },
						{ frame: T.pulsaSelector + 6, ...P.selector },
						{ frame: T.llegaOpcion, ...P.opcion },
						{ frame: T.pulsaOpcion + 20, ...P.opcion },
						{ frame: T.pulsaOpcion + 70, ...aparte },
						{ frame: T.llegaActual - 30, ...aparte },
						{ frame: T.llegaActual, ...P.actual },
						{ frame: T.pulsaActual + 30, ...P.actual },
						{ frame: T.llegaAbierta, ...P.abierta },
						{ frame: T.pulsaAbierta + 30, ...P.abierta },
						{ frame: T.pulsaAbierta + 80, ...aparte },
						{ frame: T.llegaCandidatos - 40, ...aparte },
						{ frame: T.llegaCandidatos, ...P.candidatos },
						{ frame: T.pulsaCandidatos + 30, ...P.candidatos },
						{ frame: T.pulsaCandidatos + 90, x: 1300, y: 780 },
					],
					clics: [T.pulsaConfig, T.pulsaVot, T.pulsaConfigurar, T.pulsaSelector, T.pulsaOpcion, T.pulsaActual, T.pulsaAbierta, T.pulsaCandidatos],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{f >= T.montaConfig && f < T.seVaConfig + 17 && (
					<PantallaConfig e={eConfig} opacidad={entra(f, fps, T.montaConfig, 14) * (1 - avance(f, T.seVaConfig, T.seVaConfig + 16))} />
				)}
				{f >= T.montaCandidatos && <PantallaCandidatos opacidad={entra(f, fps, T.montaCandidatos, 14)} />}
			</EnLaCascara>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Efecto key={`e${a.desde}`} cual="aviso" en={a.desde} />
			))}
			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={a.dura + 20} style={{ zIndex: 30 }}>
					<AvisoApp texto={a.texto} tipo="info" desde={0} dura={a.dura} />
				</Sequence>
			))}

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
