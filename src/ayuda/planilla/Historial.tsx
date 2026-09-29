import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra } from '../../comunes/movimiento';
import { ALUMNOS } from '../../notas/planilla';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ANCHO_FRASES, ANCHO_NUEVAS, HISTORIAL } from './historial-geometria';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL HISTORIAL DE LA PLANILLA, como lo enseña app2 desde el 2026-09-29: la última columna,
 * «Historial», con el reloj (`nz-icon history`) y la fecha de la última edición de la fila; y al
 * pulsarla, el diálogo «Historial de {apellidos nombres}» (`comunes/historial/historial-de-entidad`)
 * con Cuándo | Quién | Qué | Valor, de la más reciente a la más antigua.
 *
 * Datos inventados: la coordinadora de Los Almendros no existe, y la nota es la del Taller de la
 * primera fila, la que se ve en la planilla del vídeo.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 */

/** La primera fila: Acosta Rivera, Sara Isabel. */
const LA_QUE_SE_ABRE = 0;

/** La fecha de cada fila. Las tres que se acaban de calificar llevan la de hoy. */
const FECHAS = [
	'14 sep 2026, 3:27 p. m.',
	'29 sep 2026, 10:14 a. m.',
	'11 sep 2026, 9:02 a. m.',
	'29 sep 2026, 10:14 a. m.',
	'29 sep 2026, 10:14 a. m.',
	'11 sep 2026, 9:05 a. m.',
];

export const CAMBIO = {
	cuando: FECHAS[LA_QUE_SE_ABRE],
	quien: 'Lucía Fernanda Montoya Ríos',
	que: 'Editó nota',
	/** Debajo de «Qué», más pequeño: el indicador y el periodo. */
	detalle: 'Taller · P2',
	valor: String(ALUMNOS[LA_QUE_SE_ABRE].notas[0]),
};

/** «Acosta Rivera, Sara Isabel» → «Acosta Rivera Sara Isabel»: apellidos y nombres, como el título de app2. */
const titulo = (nombre: string) => nombre.replace(',', '');

/** El icono `history` de Ant: una esfera con su flecha de vuelta atrás y las dos agujas. */
const Reloj: React.FC<{ tam?: number; color?: string }> = ({ tam = 18, color = ACENTO }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
		<path d="M3 3.5v4.5h4.5" />
		<path d="M12 7.5V12l3 2" />
	</svg>
);

/** El icono `message` de Ant: el bocadillo con sus tres puntos. */
const Mensaje: React.FC = () => (
	<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={TEXTO} strokeOpacity={0.65} strokeWidth={1.8} strokeLinejoin="round">
		<path d="M4 5.5h16v10.5H9.5L5.5 19.5V16H4z" />
		<circle cx="8.5" cy="10.8" r="0.9" fill={TEXTO} />
		<circle cx="12" cy="10.8" r="0.9" fill={TEXTO} />
		<circle cx="15.5" cy="10.8" r="0.9" fill={TEXTO} />
	</svg>
);

/*
 * LA COLUMNA, en coordenadas del panel (va en el `sobre` de la escena). Se pinta pegada a «Tard»:
 * un trozo de panel blanco que lo alarga, y un trozo de tabla con su cabecera de dos pisos y sus
 * filas. Aparece con la cámara corrida y se va antes que las filas.
 */
export const ColumnaHistorial: React.FC<{ aparece: number; seVa: number; senalada: number | null }> = ({ aparece, seVa, senalada }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < aparece) { return null; }
	const opacidad = entra(frame, fps, aparece, 12) * interpolate(frame, [seVa, seVa + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (opacidad <= 0) { return null; }

	const fin = HISTORIAL.finDeLaTabla;
	const col = HISTORIAL.columna;
	/* Lo que se monta encima de la tabla de antes: su borde derecho, para poner la raya entre columnas. */
	const solape = 4;

	return (
		<div style={{ position: 'absolute', inset: 0, opacity: opacidad, pointerEvents: 'none' }}>
			{/* El panel, alargado. La sombra sólo hacia fuera: hacia dentro oscurecería el panel de antes. */}
			<div
				style={{
					position: 'absolute',
					left: fin,
					top: 0,
					width: ANCHO_NUEVAS + (HISTORIAL.panel.ancho - fin),
					height: HISTORIAL.panel.alto,
					background: SUPERFICIE,
					borderRadius: '0 14px 14px 0',
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
					clipPath: 'inset(-100px -100px -100px 0)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: fin - solape,
					top: col.y - 1,
					width: ANCHO_NUEVAS + solape + 1,
					height: col.alto + 2,
					boxSizing: 'border-box',
					border: `1px solid ${BORDE}`,
					borderLeft: 'none',
					borderRadius: '0 6px 6px 0',
					overflow: 'hidden',
					background: SUPERFICIE,
				}}
			>
				{/* Las rayas: entre «Tard» y «Frases», y entre «Frases» y «Historial». */}
				<div style={{ position: 'absolute', left: solape - 1, top: 0, bottom: 0, width: 1, background: BORDE }} />
				<div style={{ position: 'absolute', left: solape - 1 + ANCHO_FRASES, top: 0, bottom: 0, width: 1, background: BORDE }} />
				{(['Frases', 'Historial'] as const).map((t, i) => (
					<div
						key={t}
						style={{
							position: 'absolute',
							left: i === 0 ? solape : solape + ANCHO_FRASES,
							width: i === 0 ? ANCHO_FRASES - 1 : ANCHO_NUEVAS - ANCHO_FRASES,
							top: 0,
							height: HISTORIAL.cabecera,
							backgroundColor: 'rgb(128 128 128 / 14%)',
							borderBottom: `1px solid ${BORDE}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 19,
							fontWeight: 600,
							color: TEXTO,
						}}
					>
						{t}
					</div>
				))}
				{FECHAS.map((f, puesto) => {
					const c = HISTORIAL.celda(puesto);
					return (
						<div
							key={puesto}
							style={{
								position: 'absolute',
								left: solape + ANCHO_FRASES,
								right: 0,
								top: c.y - (col.y - 1) - 1,
								height: c.alto,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 7,
								fontSize: 15,
								color: ACENTO,
								whiteSpace: 'nowrap',
								textDecoration: senalada === puesto ? 'underline' : 'none',
								borderTop: puesto === 0 ? 'none' : `1px solid ${BORDE}`,
							}}
						>
							<Reloj />
							{f}
						</div>
					);
				})}
				{/* «Frases»: el botón redondo con el icono del comentario (`nz-icon message`). */}
				{FECHAS.map((_, puesto) => {
					const c = HISTORIAL.celda(puesto);
					return (
						<div
							key={`f${puesto}`}
							style={{
								position: 'absolute',
								left: solape,
								width: ANCHO_FRASES - 1,
								top: c.y - (col.y - 1) - 1,
								height: c.alto,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderTop: puesto === 0 ? 'none' : `1px solid ${BORDE}`,
							}}
						>
							<Mensaje />
						</div>
					);
				})}
			</div>
		</div>
	);
};

/*
 * EL DIÁLOGO, directamente en el fotograma, con el velo de los modales encima de la planilla.
 */
export const DialogoHistorial: React.FC<{ abre: number; cierra: number }> = ({ abre, cierra }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < abre) { return null; }
	const entrada = entra(frame, fps, abre, 12);
	const salida = interpolate(frame, [cierra, cierra + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (salida >= 1) { return null; }

	const alumno = ALUMNOS[LA_QUE_SE_ABRE];
	const th: React.CSSProperties = { padding: '12px 16px', fontWeight: 600, textAlign: 'left', background: '#fafafa', borderBottom: `1px solid ${BORDE}` };
	const td: React.CSSProperties = { padding: '14px 16px', verticalAlign: 'top' };

	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: entrada * (1 - salida) }} />
			<div
				style={{
					position: 'absolute',
					left: (1920 - 1120) / 2,
					top: 190,
					width: 1120,
					boxSizing: 'border-box',
					padding: '28px 32px 30px',
					background: SUPERFICIE,
					borderRadius: 12,
					boxShadow: '0 14px 48px rgba(0,0,0,.25)',
					color: TEXTO,
					opacity: entrada * (1 - salida),
					transform: `scale(${interpolate(entrada, [0, 1], [0.94, 1]) * (1 - salida * 0.04)})`,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Avatar tipo={alumno.sexo} variante={LA_QUE_SE_ABRE} tam={56} />
					</div>
					<div style={{ fontSize: 26, fontWeight: 700 }}>Historial de {titulo(alumno.nombre)}</div>
				</div>
				<div style={{ fontSize: 19, marginTop: 22 }}>
					Última edición según la fila: <b style={{ fontWeight: 700 }}>{CAMBIO.cuando}</b>
				</div>
				<div style={{ fontSize: 17, marginTop: 14, color: TEXTO_TENUE }}>De la más reciente a la más antigua.</div>
				<table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse', fontSize: 19, border: `1px solid ${BORDE}`, borderRadius: 8 }}>
					<thead>
						<tr>
							<th style={th}>Cuándo</th>
							<th style={th}>Quién</th>
							<th style={th}>Qué</th>
							<th style={th}>Valor</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style={{ ...td, whiteSpace: 'nowrap' }}>{CAMBIO.cuando}</td>
							<td style={td}>{CAMBIO.quien}</td>
							<td style={td}>
								{CAMBIO.que}
								<div style={{ fontSize: 16, color: TEXTO_TENUE, marginTop: 4 }}>{CAMBIO.detalle}</div>
							</td>
							<td style={{ ...td, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{CAMBIO.valor}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
