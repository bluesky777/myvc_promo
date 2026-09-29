/* Copia tal cual de `cierre-2/DialogoCierre.tsx`, leyendo `./datos-periodos` (el periodo 3 en curso). Ver la cabecera de `datos-periodos.ts`. */
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import { Avatar } from '../../comunes/Avatar';
import { ALTO_DIALOGO, BOTON_CERRAR, DIALOGO, DIALOGO_X, DIALOGO_Y, FALTAN, POS_DIALOGO, TEXTOS_DIALOGO } from './datos-periodos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DIÁLOGO «CERRAR EL PERIODO 2 DE 2026» (`paginas/colegio/cierre-de-periodo.ts`). Sale al pulsar
 * un tramo que cierra las notas, y ningún otro: los demás cambios de tramo llevan una pregunta
 * corta (`nz-popconfirm`), éste un diálogo entero, porque primero mira qué falta por calificar.
 *
 * Va sobre la cáscara entera, con su velo, como los modales de la aplicación. Se dibuja en
 * coordenadas de la cáscara: el foco del guion sale de `datos.ts` con las mismas medidas.
 *
 * LO QUE ENSEÑA ES EL CASO CON VACÍAS: la lista de quién falta, «Publicar un aviso en el muro», y la
 * casilla «Poner en cero las N casillas vacías» SIN marcar, que es el error caro del cierre.
 */

const AMBAR_FONDO = '#fffbe6';
const AMBAR_BORDE = '#ffe58f';
const AMBAR = '#faad14';

export const DialogoCierre: React.FC<{
	/** Todo relativo al fotograma de la escena. */
	abre: number;
	/** Hasta cuándo dice «Mirando qué falta por calificar…». */
	cargaHasta: number;
	/** El clic en «Cerrar el periodo 3»: el botón se queda con su rueda hasta `cierra`. */
	pulsa: number;
	cierra: number;
}> = ({ abre, cargaHasta, pulsa, cierra }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < abre) { return null; }

	const entrada = entra(frame, fps, abre, 12);
	const salida = interpolate(frame, [cierra, cierra + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (salida >= 1) { return null; }

	const cargando = frame < cargaHasta;
	const contenido = entra(frame, fps, cargaHasta, 10);
	const girando = frame >= pulsa;

	return (
		<div style={{ position: 'absolute', inset: 0, width: MEDIDAS.ancho, height: MEDIDAS.alto, pointerEvents: 'none' }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: interpolate(entrada, [0, 1], [0, 1]) * (1 - salida), borderRadius: 12 }} />

			<div
				style={{
					position: 'absolute',
					left: DIALOGO_X,
					top: DIALOGO_Y,
					width: DIALOGO.ancho,
					height: ALTO_DIALOGO,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					borderRadius: 10,
					boxShadow: '0 12px 40px rgba(0,0,0,.22)',
					opacity: entrada * (1 - salida),
					transform: `scale(${interpolate(entrada, [0, 1], [0.94, 1]) * (1 - salida * 0.04)})`,
					color: TEXTO,
					overflow: 'hidden',
				}}
			>
				<div style={{ height: DIALOGO.titulo, display: 'flex', alignItems: 'center', padding: `0 ${DIALOGO.relleno}px`, fontSize: 20, fontWeight: 700, boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{TEXTOS_DIALOGO.titulo}
				</div>

				<div style={{ position: 'relative', padding: `${DIALOGO.relleno}px ${DIALOGO.relleno}px 0`, height: ALTO_DIALOGO - DIALOGO.titulo - DIALOGO.pie, boxSizing: 'border-box' }}>
					{cargando && (
						<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 16, color: TEXTO_TENUE }}>
							<Rueda frame={frame} color={ACENTO} tam={26} />
							{TEXTOS_DIALOGO.cargando}
						</div>
					)}

					{!cargando && (
						<div style={{ opacity: contenido }}>
							{/* Todo con `top` fijo desde el borde del diálogo: el foco sale de las mismas medidas. */}
							<div
								style={{
									position: 'absolute',
									left: DIALOGO.relleno,
									right: DIALOGO.relleno,
									top: POS_DIALOGO.alerta - DIALOGO.titulo,
									height: DIALOGO.alerta,
									boxSizing: 'border-box',
									border: `1px solid ${AMBAR_BORDE}`,
									background: AMBAR_FONDO,
									borderRadius: 8,
									padding: '14px 18px',
									display: 'flex',
									gap: 14,
								}}
							>
								<Exclamacion />
								<div>
									<div style={{ fontSize: 17, fontWeight: 600 }}>{TEXTOS_DIALOGO.alerta}</div>
									<div style={{ fontSize: 15, marginTop: 6, lineHeight: '22px' }}>{TEXTOS_DIALOGO.alertaDescripcion}</div>
								</div>
							</div>

							<div
								style={{
									position: 'absolute',
									left: DIALOGO.relleno,
									right: DIALOGO.relleno,
									top: POS_DIALOGO.lista - DIALOGO.titulo,
									boxSizing: 'border-box',
									border: `1px solid ${BORDE}`,
									borderRadius: 6,
								}}
							>
								{FALTAN.map((a, i) => (
									<div
										key={a.materia}
										style={{
											height: DIALOGO.fila,
											boxSizing: 'border-box',
											padding: '8px 14px',
											display: 'flex',
											alignItems: 'center',
											gap: 12,
											borderTop: i === 0 ? 'none' : `1px solid ${BORDE}`,
										}}
									>
										<div style={{ flex: '1 1 auto' }}>
											<div style={{ fontSize: 15.5 }}>
												<b style={{ fontWeight: 600 }}>{a.materia}</b>
												<span style={{ marginLeft: 8, fontSize: 14, color: TEXTO_TENUE }}>{a.grupo}</span>
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: 14, color: TEXTO_TENUE }}>
												<span style={{ width: 18, height: 18, borderRadius: '50%', overflow: 'hidden', display: 'flex' }}>
													<Avatar tipo={a.cara.tipo} variante={a.cara.variante} tam={18} />
												</span>
												{a.docente}
											</div>
										</div>
										<div style={{ textAlign: 'right' }}>
											<div style={{ fontSize: 17, fontWeight: 700 }}>{a.alumnos * a.indicadores}</div>
											<div style={{ fontSize: 13, color: TEXTO_TENUE }}>
												{a.alumnos} alum. × {a.indicadores} ind.
											</div>
										</div>
									</div>
								))}
							</div>

							<div style={{ position: 'absolute', left: DIALOGO.relleno, top: POS_DIALOGO.avisar - DIALOGO.titulo, height: DIALOGO.avisar, display: 'flex', alignItems: 'center', gap: 10 }}>
								<div style={{ height: 30, boxSizing: 'border-box', padding: '0 12px', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 7, fontSize: 14.5 }}>
									<Megafono />
									Publicar un aviso en el muro
								</div>
								<span style={{ fontSize: 14, color: TEXTO_TENUE }}>
									Lo verán <b style={{ color: TEXTO, fontWeight: 600 }}>todos</b> los docentes, no sólo los que faltan.
								</span>
							</div>

							<div style={{ position: 'absolute', left: DIALOGO.relleno, top: POS_DIALOGO.resumen - DIALOGO.titulo, height: DIALOGO.resumen, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: TEXTO_TENUE }}>
								<svg width="15" height="15" viewBox="0 0 14 14">
									{[0, 7.6].map((x) => [0, 7.6].map((y) => <rect key={`${x}-${y}`} x={x + 0.7} y={y + 0.7} width="5" height="5" rx="1" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.3" />))}
								</svg>
								<span>
									<b style={{ color: TEXTO }}>
										{TEXTOS_DIALOGO.resumen.cerradas} de {TEXTOS_DIALOGO.resumen.asignaturas}
									</b>{' '}
									asignaturas ya las cerró su docente.
								</span>
							</div>

							<div style={{ position: 'absolute', left: DIALOGO.relleno, right: DIALOGO.relleno, top: POS_DIALOGO.aviso - DIALOGO.titulo, height: DIALOGO.aviso, fontSize: 15.5, lineHeight: '24px', color: TEXTO_TENUE }}>
								{TEXTOS_DIALOGO.enCurso} {TEXTOS_DIALOGO.nivelar}
							</div>

							<div style={{ position: 'absolute', left: DIALOGO.relleno, right: DIALOGO.relleno, top: POS_DIALOGO.ceros - DIALOGO.titulo, height: DIALOGO.ceros }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15.5, fontWeight: 500 }}>
									<span style={{ width: 16, height: 16, boxSizing: 'border-box', border: '1px solid #d9d9d9', borderRadius: 4, background: SUPERFICIE }} />
									{TEXTOS_DIALOGO.ceros}
								</div>
								<div style={{ marginTop: 4, paddingLeft: 24, fontSize: 14, color: TEXTO_TENUE }}>{TEXTOS_DIALOGO.sinCeros}</div>
							</div>
						</div>
					)}
				</div>

				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						height: DIALOGO.pie,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						gap: 10,
						padding: `0 ${DIALOGO.relleno}px`,
						boxShadow: `inset 0 1px 0 ${BORDE}`,
					}}
				>
					<div style={{ height: BOTON_CERRAR.alto, boxSizing: 'border-box', padding: '0 16px', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', fontSize: 15.5 }}>
						{TEXTOS_DIALOGO.dejar}
					</div>
					<div
						style={{
							width: BOTON_CERRAR.ancho,
							height: BOTON_CERRAR.alto,
							borderRadius: 6,
							background: ACENTO,
							opacity: girando ? 0.75 : 1,
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 9,
							fontSize: 15.5,
							fontWeight: 500,
						}}
					>
						{girando ? <Rueda frame={frame} color="#fff" tam={16} /> : <Candado />}
						{TEXTOS_DIALOGO.cerrar}
					</div>
				</div>
			</div>
		</div>
	);
};

const Rueda: React.FC<{ frame: number; color: string; tam: number }> = ({ frame, color, tam }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 12}deg)` }}>
		<circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
		<path d="M12 3 A9 9 0 0 1 21 12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
	</svg>
);

const Exclamacion: React.FC = () => (
	<svg width="22" height="22" viewBox="0 0 22 22" style={{ flex: '0 0 auto', marginTop: 1 }}>
		<circle cx="11" cy="11" r="10" fill={AMBAR} />
		<path d="M11 5.6 V12.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
		<circle cx="11" cy="15.8" r="1.3" fill="#fff" />
	</svg>
);

const Megafono: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		<path d="M2.5 6.2 H5 L11.5 2.8 V13.2 L5 9.8 H2.5 Z M5 9.8 L6 13.6 H7.8 L7 10.4" fill="none" stroke={TEXTO} strokeWidth="1.3" strokeLinejoin="round" />
	</svg>
);

const Candado: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		<rect x="3" y="7" width="10" height="7.5" rx="1.4" fill="none" stroke="#fff" strokeWidth="1.5" />
		<path d="M5.4 7 V5 A2.6 2.6 0 0 1 10.6 5 V7" fill="none" stroke="#fff" strokeWidth="1.5" />
	</svg>
);
