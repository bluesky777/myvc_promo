import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { PALETA_CLARA, PALETA_OSCURA } from '../BarraDeHoy';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { MEDIDAS, MENU_DOCENTE_HOY } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Lienzo, abre } from '../moverse/comun';
import { Aspecto, POR_DEFECTO_EN_LOS_VIDEOS } from '../moverse/Aspecto';
import { ListaAlumnos } from './ListaAlumnos';
import { CIERRE, PASOS, PUNTOS, T, TARJETA, scrollEn } from './guion';

/*
 * A TU GUSTO: la lista de alumnos de fondo, el cajón «Aspecto» por la derecha. Oscuro y Compacta
 * cambian en seco, como en la aplicación.
 */

export const EscenaATuGusto: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const oscuro = frame >= T.pulsaOscuro;
	const compacta = frame >= T.pulsaCompacta;
	const p = oscuro ? PALETA_OSCURA : PALETA_CLARA;
	const estado = { ...POR_DEFECTO_EN_LOS_VIDEOS, modo: oscuro ? 'oscuro' as const : 'claro' as const, densidad: compacta ? 'compacta' as const : 'comoda' as const };

	const senalado = frame >= T.llegaOscuro - 4 && frame < T.pulsaOscuro ? 'oscuro' : frame >= T.llegaCompacta - 4 && frame < T.pulsaCompacta ? 'compacta' : null;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara
					menu={MENU_DOCENTE_HOY}
					abierta={null}
					paleta={p}
					hoy={{ anio: '2026', periodo: 2, senalado: frame >= T.llegaAspecto && frame < T.abre ? 'aspecto' : null }}
				>
					<ListaAlumnos ancho={MEDIDAS.ancho - MEDIDAS.menu} p={p} compacta={compacta} />
				</Cascara>

				<Aspecto abierto={abre(frame, fps, T.abre, T.cierra, 12)} estado={estado} scroll={scrollEn(frame)} p={p} senalado={senalado} />

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaAspecto, ...PUNTOS.aspecto },
						{ frame: T.pulsaAspecto + 20, x: PUNTOS.oscuro.x - 60, y: PUNTOS.oscuro.y + 120 },
						{ frame: T.llegaOscuro - 18, x: PUNTOS.oscuro.x - 60, y: PUNTOS.oscuro.y + 120 },
						{ frame: T.llegaOscuro, ...PUNTOS.oscuro },
						{ frame: T.llegaCompacta - 18, ...PUNTOS.oscuro },
						{ frame: T.llegaCompacta, ...PUNTOS.compacta },
						{ frame: T.pulsaCompacta + 20, x: PUNTOS.compacta.x - 260, y: PUNTOS.compacta.y - 140 },
						{ frame: T.llegaCerrar - 18, x: PUNTOS.compacta.x - 260, y: PUNTOS.compacta.y - 140 },
						{ frame: T.llegaCerrar, ...PUNTOS.cerrar },
						{ frame: T.pulsaCerrar + 20, ...PUNTOS.reposo },
					]}
					clics={[T.pulsaAspecto, T.pulsaOscuro, T.pulsaCompacta, T.pulsaCerrar]}
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
