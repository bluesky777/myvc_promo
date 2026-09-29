import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { MEDIDAS_HOY, PALETA_CLARA } from '../BarraDeHoy';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MEDIDAS } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Lienzo, abre } from '../moverse/comun';
import { Aspecto, POR_DEFECTO_EN_LOS_VIDEOS } from '../moverse/Aspecto';
import { ListaAlumnos } from '../a-tu-gusto/ListaAlumnos';
import { ACADEMICO, CIERRE, FLYOUT, MENU, PASOS, PUNTOS, RECT_FLYOUT, T, TARJETA } from './guion';

/*
 * EL MENÚ: se abre Académico, se pliega a iconos (la lista de alumnos de fondo gana el ancho que
 * suelta el menú), sale la lista flotante al pasar por un icono, se despliega, y el engranaje
 * enseña dónde se elige lateral o superior.
 */

const PLIEGA_EN = 14;

export const EscenaMenuSecciones: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
	const plegado = frame < T.despliega
		? interpolate(frame, [T.pliega, T.pliega + PLIEGA_EN], [0, 1], suave)
		: interpolate(frame, [T.despliega, T.despliega + PLIEGA_EN], [1, 0], suave);
	const academico = entra(frame, fps, T.abreAcademico, 16) * interpolate(frame, [T.pliega, T.pliega + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const anchoMenu = MEDIDAS.menu - (MEDIDAS.menu - MEDIDAS_HOY.menuPlegado) * plegado;

	const senalada = (frame >= T.llegaAcademico && frame < T.pulsaAcademico + 10) || (frame >= T.llegaIcono && frame < T.dejaIcono)
		? { seccion: ACADEMICO, hija: null }
		: null;
	const barra = frame >= T.llegaPlegar && frame < T.pulsaPlegar + 8 ? 'plegar' as const
		: frame >= T.llegaDesplegar && frame < T.pulsaDesplegar + 8 ? 'plegar' as const
			: frame >= T.llegaAspecto && frame < T.abreAspecto ? 'aspecto' as const : null;

	const flyout = interpolate(frame, [T.flyout, T.flyout + 6, T.dejaIcono, T.dejaIcono + 6], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara
					menu={MENU}
					abierta={{ seccion: ACADEMICO, t: academico }}
					senalada={senalada}
					plegado={plegado}
					hoy={{ anio: '2026', periodo: 2, senalado: barra, plegado: frame >= T.pliega && frame < T.despliega }}
				>
					<ListaAlumnos ancho={MEDIDAS.ancho - anchoMenu} />
				</Cascara>

				{flyout > 0.001 && <Flyout opacidad={flyout} />}

				<Aspecto abierto={abre(frame, fps, T.abreAspecto, 1e9, 12)} estado={POR_DEFECTO_EN_LOS_VIDEOS} />

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaAcademico - 20, ...PUNTOS.entrada },
						{ frame: T.llegaAcademico, ...PUNTOS.academico },
						{ frame: T.pulsaAcademico + 20, ...PUNTOS.reposo },
						{ frame: T.llegaPlegar - 18, ...PUNTOS.reposo },
						{ frame: T.llegaPlegar, ...PUNTOS.plegar },
						{ frame: T.pulsaPlegar + 20, x: 420, y: 560 },
						{ frame: T.llegaIcono - 18, x: 420, y: 560 },
						{ frame: T.llegaIcono, ...PUNTOS.icono },
						{ frame: T.dejaIcono, ...PUNTOS.icono },
						{ frame: T.llegaDesplegar, ...PUNTOS.plegar },
						{ frame: T.pulsaDesplegar + 20, ...PUNTOS.reposo },
						{ frame: T.llegaAspecto - 18, ...PUNTOS.reposo },
						{ frame: T.llegaAspecto, ...PUNTOS.aspecto },
					]}
					clics={[T.pulsaAcademico, T.pulsaPlegar, T.pulsaDesplegar, T.pulsaAspecto]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** La lista flotante de una sección con el menú plegado: su nombre de cabecera y sus pantallas. */
const Flyout: React.FC<{ opacidad: number }> = ({ opacidad }) => {
	const p = PALETA_CLARA;
	return (
		<div
			style={{
				position: 'absolute',
				left: RECT_FLYOUT.x,
				top: RECT_FLYOUT.y,
				width: RECT_FLYOUT.ancho,
				height: RECT_FLYOUT.alto,
				boxSizing: 'border-box',
				padding: '4px 0 8px',
				background: p.superficie,
				borderRadius: 8,
				boxShadow: '0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
				fontFamily: FUENTE,
				opacity: opacidad,
				transform: `translateX(${(1 - opacidad) * -6}px)`,
				zIndex: 10,
			}}
		>
			<div style={{ height: FLYOUT.cabecera, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 14, fontWeight: 600, color: p.tenue }}>Académico</div>
			{MENU[ACADEMICO].hijas!.map((h) => (
				<div key={h} style={{ height: FLYOUT.hija, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 15, color: p.texto }}>{h}</div>
			))}
		</div>
	);
};
