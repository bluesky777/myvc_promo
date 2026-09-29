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
import { Lienzo, Teclas } from '../moverse/comun';
import { MisAsignaturas } from '../mis-asignaturas/MisAsignaturas';
import { Unidades } from '../unidades-100/Unidades';
import { Portada } from '../docente-portada/Portada';
import { LA_QUE_SE_ABRE } from '../docente-portada/datos';
import { DE_9B, FILAS_MIS, LOGROS_9B } from './datos';
import { CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * VOLVER SOBRE TUS PASOS: portada -> Logros de 9°B (atajo) -> la miga «Mis asignaturas» -> la miga
 * «Panel» (Inicio) -> Alt ← (Mis asignaturas). Cada pantalla se va en diez fotogramas y la
 * siguiente entra después: nunca se desmonta una a medio irse.
 */

const SE_VA = 10;
const ESTADO = { porcentaje3: 0, editando3: false, anadido: false };
const SUBTITULO = '4 asignaturas en el año en curso · periodo 2: 0 de 4 cerradas';

/** Una pantalla que vive entre `desde` y `hasta` (el clic que la cambia), y se apaga al final. */
const Tramo: React.FC<{ desde: number; hasta: number; children: React.ReactNode }> = ({ desde, hasta, children }) => {
	const frame = useCurrentFrame();
	if (frame < desde || frame >= hasta + SE_VA) { return null; }
	const opacidad = interpolate(frame, [hasta, hasta + SE_VA], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return (
		<div style={{ position: 'absolute', inset: 0, opacity: opacidad }}>
			<Sequence from={desde} layout="none">{children}</Sequence>
		</div>
	);
};

export const EscenaVolverRastro: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acaba = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const abierta = frame >= T.pulsaFila ? LA_QUE_SE_ABRE : null;
	const filaSenalada = frame >= T.llegaFila - 4 ? LA_QUE_SE_ABRE : null;
	const migaLogros = frame >= T.llegaMiga - 4 && frame < T.pulsaMiga + 8 ? 2 : null;
	const migaPanel = frame >= T.llegaPanel - 4 && frame < T.pulsaPanel + 8 ? 0 : null;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Lienzo opacidad={entra(frame, fps, 0, 14)}>
				<Cascara menu={MENU_DOCENTE_HOY} abierta={null} hoy={{ anio: '2026', periodo: 2 }}>
					<Tramo desde={0} hasta={T.pulsaBoton}>
						<Portada manana={false} abierta={abierta} senalada={filaSenalada} />
					</Tramo>
					<Tramo desde={T.montaLogros} hasta={T.pulsaMiga}>
						<Unidades estado={ESTADO} otra={{ asignatura: DE_9B, logros: LOGROS_9B }} senaladaMiga={migaLogros} />
					</Tramo>
					<Tramo desde={T.montaMis} hasta={T.pulsaPanel}>
						<MisAsignaturas filas={FILAS_MIS} subtitulo={SUBTITULO} senaladaMiga={migaPanel} />
					</Tramo>
					<Tramo desde={T.montaPortada} hasta={T.teclas.pulsa}>
						<Portada manana={false} abierta={null} senalada={null} />
					</Tramo>
					<Tramo desde={T.montaMisAtras} hasta={1e6}>
						<MisAsignaturas filas={FILAS_MIS} subtitulo={SUBTITULO} />
					</Tramo>
				</Cascara>

				<Cursor
					puntos={[
						{ frame: T.cursorEntra, ...PUNTOS.entrada },
						{ frame: T.llegaFila, ...PUNTOS.fila9B },
						{ frame: T.llegaBoton, ...PUNTOS.boton },
						{ frame: T.pulsaBoton + 20, ...PUNTOS.reposo },
						{ frame: T.llegaMiga - 18, ...PUNTOS.reposo },
						{ frame: T.llegaMiga, ...PUNTOS.miga },
						{ frame: T.pulsaMiga + 20, x: PUNTOS.miga.x + 40, y: PUNTOS.miga.y + 80 },
						{ frame: T.llegaPanel - 18, x: PUNTOS.miga.x + 40, y: PUNTOS.miga.y + 80 },
						{ frame: T.llegaPanel, ...PUNTOS.panel },
						{ frame: T.cursorSale, x: PUNTOS.panel.x + 120, y: PUNTOS.panel.y + 200 },
					]}
					clics={[T.pulsaFila, T.pulsaBoton, T.pulsaMiga, T.pulsaPanel]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={34}
				/>
			</Lienzo>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acaba - 10} />
			<Efecto cual="tecla1" en={T.teclas.pulsa} />
			<Teclas teclas={['Alt', '←']} {...T.teclas} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
