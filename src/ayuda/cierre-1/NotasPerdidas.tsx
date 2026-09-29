import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ANCHO_CONTENIDO, ANCHO_NP, COL_NP, IZQUIERDA_NP, LA_QUE_SE_CAMBIA, NP, PENDIENTES } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «ALUMNOS CON NOTAS PENDIENTES» -- en el menú se llama «Notas perdidas», y el título de la
 * pantalla es otro. Se dibujan los dos tal cual: quien llegue por el menú tiene que reconocer
 * la pantalla aunque el título no repita la entrada.
 *
 * LO QUE NO LLEVA, Y ES A PROPÓSITO: color. En la planilla una nota perdida va en rojo porque está
 * entre las que no; aquí **todas** lo están, y la aplicación no pinta ninguna. La casilla es un
 * campo de número normal, sin aro: se guarda sola un segundo después de la última tecla
 * (`myvcGuardarSiCambia`), y lo único que lo dice es el aviso.
 *
 * LAS RAYAS VAN CON `outline` Y SOMBRAS DE DENTRO, no con bordes: un borde ocupa un píxel y la
 * suma de todos movería la casilla respecto a `rectanguloDeLaNota()`, que es a donde va el puntero.
 */

const TITULO = 6;
const GRUPOS = 26;
const PASO_GRUPO = 8;

export const NotasPerdidas: React.FC<{
	salidaEn: number;
	/** Cuándo se pincha la casilla y cuándo se sale de ella. */
	enfocada: { desde: number; hasta: number };
	tecleo: { empieza: number; porTecla: number };
}> = ({ salidaEn, enfocada, tecleo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const texto = 'Alumnos con notas pendientes';
	const cursorTitulo = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const fueraTitulo = seVa(frame, 0, salidaEn, 4);
	const filtro = entra(frame, fps, TITULO + 14, 12);

	const tecleado = frame >= tecleo.empieza
		? LA_QUE_SE_CAMBIA.valor.slice(0, Math.min(LA_QUE_SE_CAMBIA.valor.length, Math.floor((frame - tecleo.empieza) / tecleo.porTecla) + 1))
		: null;
	const conFoco = frame >= enfocada.desde && frame < enfocada.hasta;

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', padding: `${NP.arriba}px ${NP.lados}px`, boxSizing: 'border-box', position: 'relative' }}>
			<div style={{ opacity: 1 - fueraTitulo, transform: `translateY(${-fueraTitulo * 24}px)` }}>
				<div style={{ height: NP.titulo, fontSize: 30, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
					{escrito(frame, texto, TITULO, 2)}
					<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
				</div>

				{/* El filtro: el docente llega con su periodo en curso ya elegido. */}
				<div style={{ height: NP.filtro, display: 'flex', alignItems: 'flex-start', gap: 12, opacity: filtro }}>
					<span style={{ fontSize: 17, color: TEXTO, lineHeight: '38px' }}>Filtrar por periodo</span>
					<div
						style={{
							width: 230,
							height: 38,
							boxSizing: 'border-box',
							border: `1px solid ${BORDE}`,
							borderRadius: 6,
							background: SUPERFICIE,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 12px',
							fontSize: 17,
							color: TEXTO,
						}}
					>
						Segundo Periodo
						<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
							<path d="M5 9l7 7 7-7" fill="none" stroke={TEXTO_TENUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</div>
			</div>

			{PENDIENTES.map((g, gi) => {
				const llegada = llega(frame, fps, gi, GRUPOS, PASO_GRUPO);
				const fuera = estiloDeSalida(seVa(frame, gi + 1, salidaEn, 4));
				let n = 0;

				return (
					<div
						key={`${g.grupo}-${g.materia}`}
						style={{
							marginBottom: NP.hueco,
							opacity: llegada.opacidad * fuera.opacidad,
							transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
						}}
					>
						<div style={{ height: NP.grupo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: TEXTO }}>
							{g.grupo} — {g.materia}
						</div>

						<div style={{ marginLeft: IZQUIERDA_NP - NP.lados, width: ANCHO_NP, outline: `1px solid ${BORDE}`, background: SUPERFICIE }}>
							<div style={{ display: 'flex', height: NP.cabecera, background: 'rgb(128 128 128 / 14%)', boxShadow: `inset 0 -1px 0 ${BORDE}`, fontSize: 18, fontWeight: 600, color: TEXTO }}>
								<Celda ancho={COL_NP.no}>No</Celda>
								<Celda ancho={COL_NP.alumno}>Alumnos</Celda>
								<Celda ancho={COL_NP.per}>Per</Celda>
								<Celda ancho={COL_NP.tema}>Tema</Celda>
								<Celda ancho={COL_NP.nota} ultima>Nota</Celda>
							</div>

							{g.alumnos.map((a, ai) => {
								const ultimo = ai === g.alumnos.length - 1;
								return (
									<div key={a.nombre} style={{ display: 'flex', boxShadow: ultimo ? 'none' : `inset 0 -1px 0 ${BORDE}`, fontSize: 19, color: TEXTO }}>
										<Celda ancho={COL_NP.no} alto={a.lineas.length * NP.linea}>{ai + 1}</Celda>
										<Celda ancho={COL_NP.alumno} alto={a.lineas.length * NP.linea} izquierda>{a.nombre}</Celda>
										{/* Per, Tema y Nota van apiladas: una línea por nota, con una raya fina entre ellas. */}
										<div style={{ display: 'flex', flexDirection: 'column' }}>
											{a.lineas.map((l, li) => {
												n++;
												const esLaQueSeCambia = gi === LA_QUE_SE_CAMBIA.grupo && ai === LA_QUE_SE_CAMBIA.alumno && li === LA_QUE_SE_CAMBIA.linea;
												const valor = esLaQueSeCambia && tecleado !== null ? tecleado : String(l.nota);
												return (
													<div key={`${n}`} style={{ display: 'flex', height: NP.linea, boxShadow: li === 0 ? 'none' : `inset 0 1px 0 ${BORDE}` }}>
														<Celda ancho={COL_NP.per}>{l.per}</Celda>
														<Celda ancho={COL_NP.tema} izquierda>
															<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.tema}</span>
														</Celda>
														<Celda ancho={COL_NP.nota} ultima>
															<Campo
																valor={valor}
																foco={esLaQueSeCambia && conFoco}
																cursor={esLaQueSeCambia && conFoco && frame % 30 < 16}
															/>
														</Celda>
													</div>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const Celda: React.FC<{ ancho: number; alto?: number; izquierda?: boolean; ultima?: boolean; children?: React.ReactNode }> = ({
	ancho,
	alto,
	izquierda = false,
	ultima = false,
	children,
}) => (
	<div
		style={{
			width: ancho,
			height: alto ?? '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: izquierda ? 'flex-start' : 'center',
			padding: izquierda ? '0 12px' : 0,
			boxSizing: 'border-box',
			borderRight: ultima ? 'none' : `1px solid ${BORDE}`,
			overflow: 'hidden',
		}}
	>
		{children}
	</div>
);

/** El campo de número de Ant, pequeño: borde gris, y azul con su halo mientras tiene el foco. */
const Campo: React.FC<{ valor: string; foco: boolean; cursor: boolean }> = ({ valor, foco, cursor }) => (
	<div
		style={{
			width: 92,
			height: 34,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 2px ${ACENTO}33` : 'none',
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			padding: '0 10px',
			fontSize: 19,
			color: TEXTO,
			fontVariantNumeric: 'tabular-nums',
			whiteSpace: 'pre',
		}}
	>
		{valor}
		<span style={{ opacity: cursor ? 1 : 0, marginLeft: 1 }}>|</span>
	</div>
);
