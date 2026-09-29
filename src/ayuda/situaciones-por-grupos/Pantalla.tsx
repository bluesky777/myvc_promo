import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { SUPERFICIE, TEXTO } from '../../notas/tema';
import { IconoImpresora } from '../ant';
import { IconoRecargar } from '../disciplina/Rejilla';
import { BotonAnt } from '../sin-internet/Bajar';
import { GRUPOS_DEL_INFORME, MEMBRETE, S, altoDelAlumno, arribaDelAlumno, arribaDelGrupo } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «SITUACIONES DISCIPLINARIAS»: el informe de todo el colegio, tal cual lo pinta `app2`. Arriba,
 * fuera de lo que se imprime, el título con «Recargar» e «Imprimir»; debajo, el membrete, el título
 * del informe centrado, y por grupo, cada alumno con su tabla de cuatro periodos.
 */

const TITULO = 4;
const GRIS = 'rgb(128 128 128)';
const LINEA = 'rgb(128 128 128 / 25%)';

export const PantallaSituaciones: React.FC<{ cargado: number; scroll: number; encima: string | null }> = ({ cargado, scroll, encima }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const texto = 'Situaciones disciplinarias';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const botones = entra(frame, fps, TITULO + 16, 12);
	const listo = frame >= cargado;

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', color: TEXTO }}>
			<div style={{ position: 'absolute', left: 0, top: -scroll, width: '100%', height: 1800 }}>
				<div style={{ position: 'absolute', left: S.lados, top: S.arriba, width: S.ancho, height: 40, display: 'flex', alignItems: 'center' }}>
					<span style={{ fontSize: 26, fontWeight: 600, whiteSpace: 'pre' }}>{escrito(frame, texto, TITULO, 2)}<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span></span>
					<span style={{ flex: 1 }} />
					<span style={{ display: 'flex', gap: 8, opacity: botones }}>
						<BotonAnt icono={<IconoRecargar />} ancho={124} tam={16}>Recargar</BotonAnt>
						<BotonAnt primario icono={<IconoImpresora />} ancho={132} tam={16} encima={encima === 'imprimir'}>Imprimir</BotonAnt>
					</span>
				</div>

				{!listo && frame > TITULO + 10 && (
					<div style={{ position: 'absolute', left: S.lados, top: S.membrete, fontSize: 15, color: GRIS }}>Trayendo las situaciones de todo el colegio…</div>
				)}

				{listo && (
					<>
						<Centrado y={S.membrete} a={llega(frame, fps, 0, cargado, 0)}><span style={{ fontSize: 19, fontWeight: 600 }}>{MEMBRETE}</span></Centrado>
						<Centrado y={S.titulo} a={llega(frame, fps, 1, cargado, 4)}><span style={{ fontSize: 17, fontWeight: 600 }}>Situaciones disciplinarias</span></Centrado>
						{GRUPOS_DEL_INFORME.map((g, gi) => (
							<React.Fragment key={g.abrev}>
								<Centrado y={arribaDelGrupo(gi)} a={llega(frame, fps, 2 + gi, cargado, 4)}><span style={{ fontSize: 17, fontWeight: 600 }}>{g.nombre}</span></Centrado>
								{g.alumnos.map((al, ai) => {
									const y = arribaDelAlumno(gi, ai);
									const a = llega(frame, fps, 2 + gi, cargado + 2 + ai * 2, 4);
									return (
										<div key={al.nombre} style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, height: altoDelAlumno(al) - S.huecoAlumno, opacity: a.opacidad, transform: `translateY(${a.y}px)` }}>
											<div style={{ height: S.nombre, textAlign: 'center', fontSize: 16 }}>{al.nombre} ({g.nombre})</div>
											<div style={{ display: 'flex', border: `1px solid ${LINEA}`, background: SUPERFICIE }}>
												{al.periodos.map((p, pi) => (
													<div key={pi} style={{ flex: 1, borderLeft: pi ? `1px solid ${LINEA}` : 'none' }}>
														<div style={{ height: S.cabecera, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${LINEA}` }}>Periodo {pi + 1}</div>
														<div style={{ padding: '3px 7px', minHeight: S.vacia - 6 }}>
															{p.map((f) => (
																<div key={f.fecha} style={{ height: S.falta - 4, fontSize: 13.5, lineHeight: 1.3, borderBottom: `1px solid ${LINEA}`, paddingTop: 2, boxSizing: 'border-box', overflow: 'hidden' }}>
																	<b>Tipo {f.tipo}:</b> {f.descripcion} <span>({f.fecha})</span>
																</div>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</React.Fragment>
						))}
					</>
				)}
			</div>
		</div>
	);
};

const Centrado: React.FC<{ y: number; a: { opacidad: number; y: number }; children: React.ReactNode }> = ({ y, a, children }) => (
	<div style={{ position: 'absolute', left: S.lados, top: y, width: S.ancho, textAlign: 'center', opacity: a.opacidad, transform: `translateY(${a.y}px)` }}>{children}</div>
);
