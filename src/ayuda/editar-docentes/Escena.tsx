import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { AvisoApp, EnPersonas, MENU_SECRETARIA, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { PantallaDocentes } from './Pantalla';
import { Efecto } from '../voz';
import { AVISO, BAJA, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EDITAR DOCENTES: una pantalla, con el menú de la secretaria. La página baja al final para
 * enseñar la rejilla de contratados, como bajaría quien la usa.
 */

const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };

export const EscenaEditarDocentes: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara />
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<AvisoApp texto={AVISO.texto} desde={AVISO.desde} dura={AVISO.dura} />
			<Efecto cual="aviso" en={AVISO.desde} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const menu = MENU_SECRETARIA;
	const senalada = entre(f, T.llegaPersonas, T.pulsaPersonas + 10)
		? senaladaDelMenu(menu, null)
		: entre(f, T.llegaEntrada, T.pulsaEntrada + 10)
			? senaladaDelMenu(menu, 'Editar docentes')
			: null;
	const desplazada = interpolate(f, [T.bajaDesde, T.bajaHasta], [0, BAJA], suave);
	return (
		<EnPersonas
			menu={menu}
			personas={aparece(f, fps, T.abrePersonas, 16)}
			senalada={senalada}
			opacidad={aparece(f, fps, 0, 14)}
			cursor={{
				puntos: [
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaPersonas, ...PUNTOS.personas },
					{ frame: T.llegaEntrada, ...PUNTOS.docentes },
					{ frame: T.llegaContrato - 25, ...PUNTOS.docentes },
					{ frame: T.llegaContrato, ...PUNTOS.contrato },
					{ frame: T.pulsaContrato + 10, ...PUNTOS.contrato },
					{ frame: T.bajaDesde, x: PUNTOS.contrato.x + 60, y: PUNTOS.contrato.y + 60 },
					{ frame: T.llegaAccion - 25, x: PUNTOS.contrato.x + 60, y: PUNTOS.contrato.y + 60 - BAJA },
					{ frame: T.llegaAccion, ...PUNTOS.accion },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaContrato],
				aparece: T.cursorEntra,
				sale: T.cursorSale,
			}}
		>
			{f >= T.monta && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.monta, 12) }}>
					<PantallaDocentes
						contratado={f >= T.contratado}
						desplazada={desplazada}
						encimaContrato={entre(f, T.llegaContrato - 6, T.pulsaContrato)}
						cargandoContrato={entre(f, T.pulsaContrato, T.contratado)}
						encimaAccion={f >= T.llegaAccion ? 1 : null}
						nuevaFila={avance(f, T.contratado, T.contratado + 12)}
					/>
				</div>
			)}
		</EnPersonas>
	);
};
