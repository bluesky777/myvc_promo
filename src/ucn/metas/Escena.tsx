import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { Marco } from '../Marco';
import { Linea, tSerie } from '../graficos';
import { Aviso, Boton, Delta, FilaKpi, Num, Over, Tarjeta } from '../piezas';
import { NARANJA, RAYA, RELLENO, SERIF, TARJETA, TINTA, TINTA2, TINTA3, VERDE } from '../tema';
import { ADVENTISTA, KPI, METAS, SEMAFORO } from './datos';
import {
	CARD_LINEA, EXPLICA, FILAS, KPIS, LINEA, LINEA_DUR, MARCO, PASO_FILA, PASO_KPI,
	RETRASO_SEMAFORO, SALIDA, TABLERO,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * METAS Y SEMÁFORO: UNA META QUE SE PERSIGUE SOLA.
 *
 * LA MARCA NEGRA DE CADA BARRA ES EL OBJETIVO, y está siempre en el mismo sitio --al 83,3 % del
 * ancho-- porque la barra no mide el valor, mide **el cumplimiento**. Así seis metas con seis
 * unidades distintas --alumnos, porcentajes, una nota de 1 a 5-- se leen de un vistazo y en la
 * misma escala. Es la decisión de diseño que hace que el tablero funcione.
 */

const COL = { nombre: 190, hoy: 84, estado: 164, hueco: 14 };

const FilaMeta: React.FC<{ m: (typeof METAS)[number]; t: number; tColor: number }> = ({ m, t, tColor }) => {
	const s = SEMAFORO[m.estado];
	const ancho = Math.min(100, m.cumpl / 1.2);

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `${COL.nombre}px minmax(0, 1fr) ${COL.hoy}px ${COL.estado}px`,
				alignItems: 'center',
				gap: COL.hueco,
				height: 58,
				borderBottom: `1px solid ${RAYA}`,
				opacity: interpolate(t, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<div style={{ fontSize: 13, fontWeight: 600 }}>{m.nombre}</div>
				<div style={{ fontSize: 11, color: TINTA3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sub}</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				<div style={{ position: 'relative', height: 14, background: RELLENO, borderRadius: 4 }}>
					<div style={{ position: 'absolute', left: 0, top: 0, height: 14, width: `${ancho * t}%`, background: s.color, borderRadius: 4 }} />
					{/* La marca del objetivo. Siempre en el mismo sitio: la barra mide cumplimiento. */}
					<div style={{ position: 'absolute', left: '83.3%', top: -5, width: 2, height: 24, background: TINTA }} />
				</div>
				<div style={{ fontSize: 10.5, color: TINTA3, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.nota}</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
				<span style={{ fontFamily: SERIF, fontVariantNumeric: 'tabular-nums', fontSize: 21, fontWeight: 500, lineHeight: 1 }}>{m.valor}</span>
				<Num style={{ fontSize: 11, color: TINTA3 }}>meta {m.objetivo}</Num>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7, opacity: tColor }}>
				<Num style={{ fontSize: 13, fontWeight: 600, color: s.color, whiteSpace: 'nowrap' }}>{m.cumpl.toLocaleString('es-ES', { minimumFractionDigits: 1 })} %</Num>
				<span style={{ display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${s.color}`, color: s.color, borderRadius: 12, padding: '3px 9px', fontSize: 10.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: s.icono }} />
					{s.etiqueta}
				</span>
			</div>
		</div>
	);
};

export const EscenaMetas: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const fuera = seVa(frame, 0, SALIDA, 0, 26);

	return (
		<Lienzo conRotulo={conRotulo}>
			<Pantalla conRotulo={conRotulo}>
			<div style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})` }}>
				<Marco
					activo="metas"
					overline="Unión Colombiana del Norte · Departamento de Educación"
					titulo="Metas y semáforo"
					sub="La Unión fija la meta una vez al año y el portal la persigue sola hasta diciembre"
					desde={MARCO}
					acciones={
						<>
							<Boton primario icono={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}>
								Fijar las metas de 2027
							</Boton>
							<Boton>Historial</Boton>
						</>
					}
					pie={[
						'El semáforo no mira sólo cuánto falta, sino hacia dónde va: un 96 % que se aleja año tras año pinta en rojo, y un 100,5 % recién alcanzado en verde.',
						'Metas fijadas el 12 de febrero de 2026',
					]}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						<FilaKpi
							datos={KPI.map((k) => ({
								etiqueta: k.etiqueta,
								valor: k.valor,
								pie: k.pie,
								delta: <Delta sentido={k.delta[0]} texto={k.delta[1]} extra={k.delta[2]} bueno={k.delta[0] === 'baja'} />,
							}))}
							t={(i) => entra(frame, fps, KPIS + i * PASO_KPI, 20)}
						/>

						<div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 306px', gap: 20, alignItems: 'start' }}>
							<Tarjeta titulo="El tablero" sub="Cada meta con su avance · la marca negra es el objetivo" t={entra(frame, fps, TABLERO, 16)}>
								<div>
									<div style={{ display: 'grid', gridTemplateColumns: `${COL.nombre}px minmax(0, 1fr) ${COL.hoy}px ${COL.estado}px`, gap: COL.hueco, paddingBottom: 7, borderBottom: `1px solid ${RAYA}` }}>
										<Over>Meta</Over><Over>Avance</Over>
										<div style={{ textAlign: 'right' }}><Over>Hoy</Over></div>
										<div style={{ textAlign: 'right' }}><Over>Cumplimiento</Over></div>
									</div>
									{METAS.map((m, i) => (
										<FilaMeta
											key={m.nombre}
											m={m}
											t={tSerie(frame, FILAS, i, PASO_FILA, 20)}
											tColor={tSerie(frame, FILAS + RETRASO_SEMAFORO, i, PASO_FILA, 12)}
										/>
									))}
								</div>
							</Tarjeta>

							<Tarjeta
								titulo="Por qué el semáforo mira dos cosas"
								sub="Familia adventista, 2019–2026"
								t={entra(frame, fps, CARD_LINEA, 16)}
							>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									<Linea
										valores={ADVENTISTA.valores}
										anios={ADVENTISTA.anios}
										frame={frame}
										desde={LINEA}
										dur={LINEA_DUR}
										ancho={262}
										alto={214}
										color={NARANJA}
										min={61.5}
										max={70}
										meta={{ valor: 65, texto: 'meta 65,0 %', color: VERDE }}
									/>
									<Aviso t={entra(frame, fps, EXPLICA, 18)} fondo="#F7F1E6">
										<strong style={{ color: TINTA }}>Cruzó la meta en 2023 y no ha vuelto.</strong> Por eso está en rojo con un 96 % de cumplimiento: el semáforo mira la dirección, no sólo la distancia.
									</Aviso>
								</div>
							</Tarjeta>
						</div>
					</div>
				</Marco>
			</div>
			</Pantalla>

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: FILAS + 30, hasta: CARD_LINEA - 6, titulo: 'Seis metas, una escala.', pie: 'Alumnos, porcentajes y una nota de 1 a 5 en la misma barra: la marca negra es el objetivo.' },
						{ desde: LINEA + 20, hasta: EXPLICA - 4, titulo: 'Dos en verde. Una en rojo.', pie: 'Y la roja está al 96 % de su meta.' },
						{ desde: EXPLICA + 8, hasta: SALIDA, titulo: 'Porque lleva siete años alejándose.', pie: 'El semáforo mira hacia dónde va, no sólo cuánto falta.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
