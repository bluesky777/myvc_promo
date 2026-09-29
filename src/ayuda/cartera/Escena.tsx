import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MENU_DIRECTIVO } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { AvisoApp, EnPersonas, aparece, avance, entre, senaladaDelMenu } from '../personas/comun';
import { DEUDA_NUEVA, EL_GRUPO, GRUPO, LOS_QUE_PAGAN, filasEn } from './datos';
import { PantallaCartera, type EstadoCartera } from './Pantalla';
import { AVISO_DEUDA, AVISO_PAZ, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CARTERA: encadena, no dibuja. Una sola pantalla dentro de la cáscara, de principio a fin; lo que
 * cambia es su estado, que sale de los tiempos del guion.
 */

export const EscenaCartera: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara />
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<AvisoApp texto="2 alumno(s) actualizados." desde={AVISO_PAZ.desde} dura={AVISO_PAZ.dura} />
			<AvisoApp texto="2 alumno(s) actualizados." desde={AVISO_DEUDA.desde} dura={AVISO_DEUDA.dura} />
			<Efecto cual="aviso" en={AVISO_PAZ.desde} />
			<Efecto cual="aviso" en={AVISO_DEUDA.desde} />
			<Efecto cual="tecla1" en={T.teclea} />
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
			? senaladaDelMenu(menu, 'Cartera')
			: null;

	const abierto = f >= T.pulsaSelector && f < T.cierraSelector + 8;
	const tDesplegable = f < T.cierraSelector ? avance(f, T.abreSelector, T.abreSelector + 8) : 1 - avance(f, T.cierraSelector, T.cierraSelector + 8);

	const estado: EstadoCartera = {
		grupo: f >= T.pulsaOpcion ? GRUPO : null,
		desplegable: abierto ? { t: tDesplegable, resaltada: f >= T.llegaOpcion - 6 ? EL_GRUPO : null } : null,
		filas: filasEn(f >= T.avisoPaz, f >= T.avisoDeuda),
		llegadaFilas: avance(f, T.llegaLaLista, T.llenaLaLista),
		marcadas: [
			...(f >= T.pulsaCasilla1 ? [LOS_QUE_PAGAN[0]] : []),
			...(f >= T.pulsaCasilla2 ? [LOS_QUE_PAGAN[1]] : []),
		],
		casillaEncima: entre(f, T.llegaCasilla1 - 4, T.pulsaCasilla1) ? LOS_QUE_PAGAN[0] : entre(f, T.llegaCasilla2 - 4, T.pulsaCasilla2) ? LOS_QUE_PAGAN[1] : null,
		encima: entre(f, T.llegaPaz - 4, T.pulsaPaz + 8)
			? 'paz'
			: entre(f, T.llegaCambiarDeuda - 4, T.pulsaCambiarDeuda + 8)
				? 'cambiarDeuda'
				: f >= T.llegaSubir
					? 'subir'
					: null,
		deudaTecleada: f >= T.teclea ? DEUDA_NUEVA : '',
		deudaConFoco: entre(f, T.pulsaDeuda, T.pulsaCambiarDeuda),
		cursorDeTexto: entre(f, T.pulsaDeuda, T.pulsaCambiarDeuda) && f % 30 < 16,
	};

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
					{ frame: T.llegaEntrada, ...PUNTOS.cartera },
					{ frame: T.pulsaEntrada + 8, ...PUNTOS.cartera },
					{ frame: T.llegaSelector, ...PUNTOS.selector },
					{ frame: T.pulsaSelector + 6, ...PUNTOS.selector },
					{ frame: T.llegaOpcion, ...PUNTOS.opcion },
					{ frame: T.pulsaOpcion + 10, ...PUNTOS.opcion },
					{ frame: T.llegaCasilla1 - 40, x: PUNTOS.opcion.x + 40, y: PUNTOS.casilla1.y - 60 },
					{ frame: T.llegaCasilla1, ...PUNTOS.casilla1 },
					{ frame: T.pulsaCasilla1 + 6, ...PUNTOS.casilla1 },
					{ frame: T.llegaCasilla2, ...PUNTOS.casilla2 },
					{ frame: T.llegaPaz - 24, ...PUNTOS.casilla2 },
					{ frame: T.llegaPaz, ...PUNTOS.paz },
					{ frame: T.llegaDeuda - 24, ...PUNTOS.paz },
					{ frame: T.llegaDeuda, ...PUNTOS.deuda },
					{ frame: T.teclea + 4, ...PUNTOS.deuda },
					{ frame: T.llegaCambiarDeuda, ...PUNTOS.cambiarDeuda },
					{ frame: T.llegaSubir - 24, ...PUNTOS.cambiarDeuda },
					{ frame: T.llegaSubir, x: PUNTOS.subir.x, y: PUNTOS.subir.y + 6 },
				],
				clics: [T.pulsaPersonas, T.pulsaEntrada, T.pulsaSelector, T.pulsaOpcion, T.pulsaCasilla1, T.pulsaCasilla2, T.pulsaPaz, T.pulsaDeuda, T.pulsaCambiarDeuda],
				aparece: T.cursorEntra,
				sale: T.cursorSale,
			}}
		>
			{f >= T.monta && (
				<div style={{ position: 'absolute', inset: 0, opacity: aparece(f, fps, T.monta, 12) }}>
					<PantallaCartera e={estado} />
				</div>
			)}
		</EnPersonas>
	);
};
