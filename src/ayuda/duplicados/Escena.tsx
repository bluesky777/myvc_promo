import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { EnPersonas, aparece, entre, senaladaDelMenu } from '../personas/comun';
import { SE_QUEDA } from './datos';
import { DialogoUnir, PantallaDuplicados, type PasoUnir } from './Pantalla';
import { CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ALUMNOS DUPLICADOS: la pantalla dentro de la cáscara, y el diálogo encima desde que se pulsa
 * «Unir». El diálogo no se cierra: el vídeo se para delante del botón que no se deshace.
 */

export const EscenaDuplicados: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara />
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Efecto cual="aviso" en={T.revisado} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_DIRECTIVO;

	const senalada = entre(f, T.llegaPersonas, T.pulsaPersonas + 10)
		? senaladaDelMenu(menu, null)
		: entre(f, T.llegaEntrada, T.pulsaEntrada + 10)
			? senaladaDelMenu(menu, 'Alumnos duplicados')
			: null;

	const paso: PasoUnir = f >= T.revisado ? 'revisado' : f >= T.pulsaVer ? 'mirando' : 'elegir';
	const dialogo = f >= T.abreDialogo ? (
		<DialogoUnir
			aparece={aparece(f, fps, T.abreDialogo, 12)}
			paso={paso}
			elegida={f >= T.pulsaRadio ? SE_QUEDA : null}
			encima={entre(f, T.llegaRadio - 4, T.pulsaRadio) ? 'radio' : entre(f, T.llegaVer - 4, T.pulsaVer + 6) ? 'ver' : f >= T.llegaUnirFichas ? 'unir' : null}
		/>
	) : null;

	return (
		<EnPersonas
			menu={menu}
			personas={aparece(f, fps, T.abrePersonas, 16)}
			senalada={senalada}
			opacidad={aparece(f, fps, 0, 14)}
			encima={dialogo}
			cursor={{
				puntos: [
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaPersonas, ...PUNTOS.personas },
					{ frame: T.llegaEntrada, ...PUNTOS.duplicados },
					{ frame: T.llegaUnir - 24, ...PUNTOS.duplicados },
					{ frame: T.llegaUnir, ...PUNTOS.unir },
					{ frame: T.pulsaUnir + 8, ...PUNTOS.unir },
					{ frame: T.llegaRadio, ...PUNTOS.radio },
					{ frame: T.pulsaRadio + 8, ...PUNTOS.radio },
					{ frame: T.llegaVer, ...PUNTOS.ver },
					{ frame: T.pulsaVer + 10, ...PUNTOS.ver },
					{ frame: T.revisado + 20, x: PUNTOS.ver.x + 60, y: PUNTOS.ver.y + 120 },
					{ frame: T.llegaUnirFichas - 40, x: PUNTOS.ver.x + 60, y: PUNTOS.ver.y + 120 },
					{ frame: T.llegaUnirFichas, ...PUNTOS.unirFichas },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaUnir, T.pulsaRadio, T.pulsaVer],
				aparece: T.cursorEntra,
				sale: T.cursorSale,
			}}
		>
			{f >= T.monta && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.monta, 12) }}>
					<PantallaDuplicados encimaUnir={entre(f, T.llegaUnir - 4, T.pulsaUnir + 8)} />
				</div>
			)}
		</EnPersonas>
	);
};
