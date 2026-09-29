import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, PERDIDA_LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ANCHO_CONTENIDO, ANCHO_TABLA, ARRASTRAN, CAMPO, COL_ASIGNATURA, COL_RA, CUANTAS, EL_GRUPO, GUARDAR,
	GRUPOS_DEL_DOCENTE, LA_QUE_SE_RECUPERA, RA, RECUPERACION_VALENTINA,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «RECUPERACIÓN DEL AÑO» (`/recuperacion-anual` y `/recuperacion-anual/:grupo_id`). Una pantalla
 * con dos caras, como en la aplicación: sin grupo es la botonera, y con grupo la tabla.
 *
 * LO QUE TIENE QUE SER EXACTO, sacado de `recuperacion-anual.html`:
 *   · la del año va en rojo y en negrita, y **no es un campo**: aquí no se toca;
 *   · la casilla de la recuperación es un campo pequeño de número, vacío al llegar;
 *   · el botón «Guardar» **sólo aparece cuando hay algo distinto que guardar**, y al volver deja
 *     «✓ Guardada» en gris. No hay diálogo de confirmación.
 */

const TITULO = 4;

export const RecuperacionAnual: React.FC<{
	/** Cuándo se pulsa el grupo: se va la botonera y sale «Trayendo…». */
	eligeGrupo: number;
	/** Cuándo llega la tabla. */
	tablaDesde: number;
	/** El grupo que tiene el ratón encima. */
	grupoSenalado: boolean;
	enfocada: { desde: number; hasta: number };
	tecleo: { empieza: number; porTecla: number };
	/** Cuándo se pulsa «Guardar» y cuándo vuelve el servidor. */
	guarda: { pulsa: number; vuelve: number };
	senalaGuardar: { desde: number; hasta: number };
}> = ({ eligeGrupo, tablaDesde, grupoSenalado, enfocada, tecleo, guarda, senalaGuardar }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const texto = 'Recuperación del año';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const selectorFuera = seVa(frame, 0, eligeGrupo + 6, 4);
	const conSelector = frame < eligeGrupo + 24;
	const trayendo = frame >= eligeGrupo + 24 && frame < tablaDesde;

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', padding: `${RA.arriba}px ${RA.lados}px`, boxSizing: 'border-box', position: 'relative' }}>
			<div style={{ height: RA.titulo, fontSize: 30, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
				{escrito(frame, texto, TITULO, 2)}
				<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
			</div>

			{conSelector && (
				<div style={{ opacity: 1 - selectorFuera }}>
					<div style={{ height: RA.pista, fontSize: 18, color: TEXTO_TENUE, opacity: entra(frame, fps, TITULO + 20, 12) }}>
						Elige un grupo para ver qué asignaturas del año arrastra cada estudiante.
					</div>
					{/* La botonera: botones unidos en un panel, el elegido en azul. */}
					<div style={{ display: 'flex', width: 'max-content', border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', background: SUPERFICIE, opacity: entra(frame, fps, TITULO + 28, 12) }}>
						{GRUPOS_DEL_DOCENTE.map((g, i) => {
							const elegido = i === EL_GRUPO && frame >= eligeGrupo;
							return (
								<div
									key={g}
									style={{
										width: RA.boton.ancho,
										height: RA.boton.alto - 2,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 17,
										fontWeight: 600,
										color: elegido ? '#fff' : i === EL_GRUPO && grupoSenalado ? ACENTO : TEXTO,
										background: elegido ? ACENTO : SUPERFICIE,
										borderRight: i < GRUPOS_DEL_DOCENTE.length - 1 ? `1px solid ${BORDE}` : 'none',
										boxSizing: 'border-box',
									}}
								>
									{g}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{trayendo && (
				<div style={{ position: 'absolute', top: RA.arriba + RA.titulo, left: RA.lados, fontSize: 18, color: TEXTO_TENUE, opacity: entra(frame, fps, eligeGrupo + 24, 10) }}>
					Trayendo lo perdido del año…
				</div>
			)}

			{frame >= tablaDesde && (
				<Tabla desde={tablaDesde} enfocada={enfocada} tecleo={tecleo} guarda={guarda} senalaGuardar={senalaGuardar} />
			)}
		</div>
	);
};

const Tabla: React.FC<{
	desde: number;
	enfocada: { desde: number; hasta: number };
	tecleo: { empieza: number; porTecla: number };
	guarda: { pulsa: number; vuelve: number };
	senalaGuardar: { desde: number; hasta: number };
}> = ({ desde, enfocada, tecleo, guarda, senalaGuardar }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const valor = RECUPERACION_VALENTINA;
	const tecleado = frame >= tecleo.empieza
		? valor.slice(0, Math.min(valor.length, Math.floor((frame - tecleo.empieza) / tecleo.porTecla) + 1))
		: '';
	const conFoco = frame >= enfocada.desde && frame < enfocada.hasta;
	const guardando = frame >= guarda.pulsa && frame < guarda.vuelve;
	const guardada = frame >= guarda.vuelve;

	return (
		<div>
			<div style={{ height: RA.barra, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', fontSize: 18, color: TEXTO, opacity: entra(frame, fps, desde, 12) }}>
				<span style={{ lineHeight: '34px' }}>{CUANTAS} asignaturas perdidas del año en este grupo</span>
				<span style={{ lineHeight: '34px', color: ACENTO }}>Cambiar de grupo</span>
			</div>

			<div style={{ width: ANCHO_TABLA, outline: `1px solid ${BORDE}`, background: SUPERFICIE }}>
				<div style={{ display: 'flex', height: RA.cabecera, fontSize: 17, fontWeight: 700, color: TEXTO, boxShadow: `inset 0 -1px 0 ${BORDE}`, opacity: entra(frame, fps, desde + 4, 12) }}>
					<Celda ancho={COL_ASIGNATURA}>Asignatura</Celda>
					<Celda ancho={COL_RA.nota}>Del año</Celda>
					<Celda ancho={COL_RA.rec}>Recuperación</Celda>
					<Celda ancho={COL_RA.accion} ultima>{null}</Celda>
				</div>

				{ARRASTRAN.map((a, ai) => {
					const nace = llega(frame, fps, ai, desde + 10, 8);
					return (
						<div key={a.nombre} style={{ opacity: nace.opacidad, transform: `translate(${nace.x}px, ${nace.y}px)` }}>
							{/* La cabecera del alumno: su nombre y cuántas arrastra. */}
							<div style={{ height: RA.alumno, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: `${ACENTO}14`, boxShadow: `inset 0 -1px 0 ${BORDE}`, fontSize: 18, fontWeight: 600, color: TEXTO }}>
								{a.nombre}
								<span style={{ padding: '1px 9px', borderRadius: 9, background: ACENTO, color: '#fff', fontSize: 14, fontWeight: 600 }}>{a.filas.length}</span>
							</div>

							{a.filas.map((f, fi) => {
								const esLa = ai === LA_QUE_SE_RECUPERA.alumno && fi === LA_QUE_SE_RECUPERA.fila;
								const hayQueGuardar = esLa && tecleado !== '' && !guardada;
								const senalado = esLa && frame >= senalaGuardar.desde && frame < senalaGuardar.hasta;
								return (
									<div key={f.materia} style={{ display: 'flex', height: RA.fila, boxShadow: `inset 0 -1px 0 ${BORDE}`, fontSize: 18, color: TEXTO }}>
										<Celda ancho={COL_ASIGNATURA} izquierda>{f.materia}</Celda>
										<Celda ancho={COL_RA.nota}>
											<span style={{ color: PERDIDA_LETRA, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{f.ano}</span>
										</Celda>
										<Celda ancho={COL_RA.rec}>
											<div
												style={{
													width: CAMPO.ancho,
													height: CAMPO.alto,
													boxSizing: 'border-box',
													border: `1px solid ${esLa && conFoco ? ACENTO : BORDE}`,
													boxShadow: esLa && conFoco ? `0 0 0 2px ${ACENTO}33` : 'none',
													borderRadius: 6,
													background: guardando ? '#f5f5f5' : SUPERFICIE,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: 18,
													color: guardando ? TEXTO_TENUE : TEXTO,
													fontVariantNumeric: 'tabular-nums',
													whiteSpace: 'pre',
												}}
											>
												{esLa ? tecleado : ''}
												<span style={{ opacity: esLa && conFoco && frame % 30 < 16 ? 1 : 0 }}>|</span>
											</div>
										</Celda>
										<Celda ancho={COL_RA.accion} izquierda ultima>
											{(hayQueGuardar || (esLa && guardando)) && (
												<div
													style={{
														width: GUARDAR.ancho,
														height: GUARDAR.alto,
														marginLeft: GUARDAR.margen - 12,
														borderRadius: 6,
														background: guardando ? '#69b1ff' : senalado ? '#4096ff' : ACENTO,
														color: '#fff',
														fontSize: 17,
														fontWeight: 600,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: 8,
														opacity: interpolate(frame - tecleo.empieza, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
													}}
												>
													{guardando && <Giro frame={frame} />}
													Guardar
												</div>
											)}
											{esLa && guardada && (
												<span style={{ color: TEXTO_TENUE, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, opacity: entra(frame, fps, guarda.vuelve, 10) }}>
													<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
														<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={TEXTO_TENUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
													Guardada
												</span>
											)}
										</Celda>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/** El giro de `nzLoading`: un arco blanco que da vueltas. */
const Giro: React.FC<{ frame: number }> = ({ frame }) => (
	<svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 24}deg)` }} aria-hidden>
		<path d="M12 3 a9 9 0 1 1 -9 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
	</svg>
);

const Celda: React.FC<{ ancho: number; izquierda?: boolean; ultima?: boolean; children?: React.ReactNode }> = ({
	ancho, izquierda = false, ultima = false, children,
}) => (
	<div
		style={{
			width: ancho,
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: izquierda ? 'flex-start' : 'center',
			padding: izquierda ? '0 12px' : 0,
			boxSizing: 'border-box',
			borderRight: ultima ? 'none' : `1px solid ${BORDE}`,
		}}
	>
		{children}
	</div>
);
