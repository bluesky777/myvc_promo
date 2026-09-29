import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { MENU_DOCENTE_HOY } from '../medidas';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Lienzo, Teclas, abre } from '../moverse/comun';
import { MisAsignaturas } from '../mis-asignaturas/MisAsignaturas';
import { NotasPerdidas } from '../cierre-1/NotasPerdidas';
import { Buscador } from './Buscador';
import { CIERRE, PASOS, POR_LETRA, PUNTOS, T, TARJETA, buscado } from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra, alternando los tres sonidos; y una por cada atajo pulsado. */
const TECLEOS = [
	...([['fallas', T.fallas], ['valen', T.valen], ['reprobadas', T.reprobadas]] as const).flatMap(([palabra, desde]) =>
		[...palabra].map((_, k) => desde + k * POR_LETRA)),
	T.teclaBarra.pulsa, T.teclaEsc.pulsa, T.teclaCtrlK.pulsa, T.teclaIntro.pulsa,
];

/*
 * EL BUSCADOR MÁGICO: se parte de «Mis asignaturas» y se acaba en «Notas perdidas» sin tocar el
 * menú. Las teclas salen en pantalla porque sin ellas el cuadro aparecería solo.
 */

export const EscenaBuscarEscribiendo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierto = Math.max(abre(frame, fps, T.abre1, T.cierra1, 8), abre(frame, fps, T.abre2, T.cierra2, 8));
	const b = buscado(frame);
	const escribiendo = frame >= T.fallas - 20;
	const caret = frame % 30 < 16;
	const seVaLaLista = interpolate(frame, [T.cierra2, T.cierra2 + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara
					menu={MENU_DOCENTE_HOY}
					abierta={null}
					hoy={{ anio: '2026', periodo: 2, senalado: frame >= T.llegaBuscador - 6 && frame < T.cursorSale ? 'buscador' : null }}
				>
					{frame < T.cierra2 + 6 && (
						<div style={{ position: 'absolute', inset: 0, opacity: seVaLaLista }}>
							<MisAsignaturas subtitulo="4 asignaturas en el año en curso · periodo 2: 0 de 4 cerradas" />
						</div>
					)}
					{frame >= T.montaLista && (
						<Sequence from={T.montaLista} layout="none">
							<NotasPerdidas salidaEn={1e6} enfocada={{ desde: 1e6, hasta: 1e6 }} tecleo={{ empieza: 1e6, porTecla: 5 }} />
						</Sequence>
					)}
				</Cascara>

				<Buscador
					abierto={abierto}
					texto={b.texto}
					caret={caret && escribiendo}
					bloques={b.bloques}
					aviso={b.aviso}
					resaltada={b.bloques.length ? 0 : null}
				/>

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaBuscador, ...PUNTOS.buscador },
					]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			{TECLEOS.map((en, i) => <Efecto key={i} cual={TECLAS[i % 3]} en={en} />)}
			<Teclas teclas={['/']} {...T.teclaBarra} />
			<Teclas teclas={['Esc']} {...T.teclaEsc} />
			<Teclas teclas={['Ctrl', 'K']} {...T.teclaCtrlK} />
			<Teclas teclas={['Intro']} {...T.teclaIntro} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
