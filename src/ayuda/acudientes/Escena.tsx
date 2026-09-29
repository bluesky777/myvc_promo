import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { AvisoApp, EnPersonas, MENU_SECRETARIA, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { GRUPO, PantallaAcudientes, PantallaInicio } from './Pantalla';
import { AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';
import { Efecto } from '../voz';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ACUDIENTES: dos cáscaras seguidas. La de la secretaria (su menú, e Inicio tras el rebote) se
 * apaga entera y entra la de un superusuario, que ya tiene Personas abierta. Cada una se desmonta
 * sólo cuando está a opacidad cero.
 */

export const EscenaAcudientes: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.llegaLaOtra && <LaSecretaria />}
			{frame >= T.seVaLaSecretaria && <ElSuperusuario />}
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<AvisoApp texto={AVISO.texto} desde={AVISO.desde} dura={AVISO.dura} tipo="info" />
			<Efecto cual="aviso" en={AVISO.desde} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const LaSecretaria: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_SECRETARIA;
	const senalada = entre(f, T.llegaPersonas, T.pulsaPersonas + 10)
		? senaladaDelMenu(menu, null)
		: entre(f, T.llegaEntrada, T.pulsaEntrada + 10)
			? senaladaDelMenu(menu, 'Acudientes')
			: null;
	return (
		<EnPersonas
			menu={menu}
			personas={aparece(f, fps, T.abrePersonas, 16)}
			senalada={senalada}
			opacidad={aparece(f, fps, 0, 14) * (1 - avance(f, T.seVaLaSecretaria, T.llegaLaOtra - 4))}
			cursor={{
				puntos: [
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaPersonas, ...PUNTOS.personas },
					{ frame: T.llegaEntrada, ...PUNTOS.acudientes },
					{ frame: T.inicio + 30, x: PUNTOS.acudientes.x + 60, y: PUNTOS.acudientes.y + 20 },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada],
				aparece: T.cursorEntra,
				sale: T.seVaLaSecretaria - 20,
			}}
		>
			{f >= T.inicio && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.inicio, 12) }}>
					<PantallaInicio />
				</div>
			)}
		</EnPersonas>
	);
};

const ElSuperusuario: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_DIRECTIVO;
	const senalada = entre(f, T.llegaEntradaB, T.pulsaEntradaB + 10) ? senaladaDelMenu(menu, 'Acudientes') : null;
	return (
		<EnPersonas
			menu={menu}
			personas={1}
			senalada={senalada}
			opacidad={avance(f, T.seVaLaSecretaria + 8, T.llegaLaOtra + 4)}
			cursor={{
				puntos: [
					{ frame: T.llegaLaOtra, x: PUNTOS.acudientesB.x + 260, y: PUNTOS.acudientesB.y + 120 },
					{ frame: T.llegaEntradaB - 30, x: PUNTOS.acudientesB.x + 260, y: PUNTOS.acudientesB.y + 120 },
					{ frame: T.llegaEntradaB, ...PUNTOS.acudientesB },
					{ frame: T.pulsaEntradaB + 10, ...PUNTOS.acudientesB },
					{ frame: T.llegaGrupo, ...PUNTOS.grupo },
					{ frame: T.pulsaGrupo + 10, ...PUNTOS.grupo },
					{ frame: T.llegaBoton, ...PUNTOS.boton },
				],
				clics: [T.pulsaEntradaB, T.pulsaGrupo],
				aparece: T.llegaLaOtra,
				sale: T.cursorSale,
			}}
		>
			{f >= T.montaB && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.montaB, 12) }}>
					<PantallaAcudientes
						grupo={f >= T.pulsaGrupo ? GRUPO : null}
						llegada={avance(f, T.llegaLaLista, T.llenaLaLista)}
						encimaGrupo={entre(f, T.llegaGrupo - 6, T.pulsaGrupo) ? GRUPO : null}
						encimaFila={f >= T.llegaBoton ? 0 : null}
					/>
				</div>
			)}
		</EnPersonas>
	);
};
