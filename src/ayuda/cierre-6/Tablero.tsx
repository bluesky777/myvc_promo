import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Progreso } from './Piezas';
import {
	ALTO_TARJETA_1_CON_AVISO, ALTO_TARJETA_1_SIN_AVISO, ANCHO_CONTENIDO, ANCHO_ROTULO_PERIODO, ANCHO_TARJETA, CONFIRMA,
	FINALES, RECALCULAR_LOS, SIN_RECALCULAR, TB, TB_TEXTOS, anchoDeBoton, anchoDePestana, rectanguloDeBotonDeGrupo,
	rectanguloDeRecalcularLos,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TABLERO VIEJO, `/informes-old`. Una columna de tarjetas, sin lista a la izquierda.
 *
 * Lo que tiene que ser exacto (`tablero.html`):
 *   · el aviso amarillo y su fila de periodo, con un botón por grupo y «Recalcular los N» el
 *     último; **sin diálogo de confirmación**: el texto del aviso es la explicación;
 *   · mientras calcula, una barra de progreso y todos los botones apagados; cada grupo hecho se
 *     queda apagado, y **cuando no queda ninguno el aviso entero desaparece**;
 *   · en «Finales», «Calcular promovidos…» abre un aviso en línea --no un modal-- con un botón rojo
 *     y «Cancelar»; mientras calcula, el botón se esconde y sale la barra.
 */

const ALTO_GRUESO = 2;

export const Tablero: React.FC<{
	recalcula: { pulsa: number; fin: number };
	finalesEn: number;
	promovidos: { abre: number; confirma: number; fin: number };
	senal?: 'recalcular' | 'finales' | 'calcular' | 'confirmar' | null;
}> = ({ recalcula, finalesEn, promovidos, senal = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titulo = TB_TEXTOS.titulo;
	const cursorTitulo = escribiendo(frame, titulo, 4, 2) && frame % 20 < 12;

	/* El recálculo va grupo por grupo: cada uno se da por hecho en su tercio. */
	const tramo = (recalcula.fin - recalcula.pulsa) / SIN_RECALCULAR.length;
	const hechos = frame < recalcula.pulsa ? 0 : Math.min(SIN_RECALCULAR.length, Math.floor((frame - recalcula.pulsa) / tramo));
	const calculando = frame >= recalcula.pulsa && frame < recalcula.fin;
	const p = calculando ? interpolate(frame, [recalcula.pulsa, recalcula.fin], [0, 100]) : 0;

	/* Cuando no queda ningún grupo, el aviso se va y la tarjeta se recoge. */
	const recoge = interpolate(frame, [recalcula.fin + 4, recalcula.fin + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const alto1 = interpolate(recoge, [0, 1], [ALTO_TARJETA_1_CON_AVISO, ALTO_TARJETA_1_SIN_AVISO]);

	const enFinales = frame >= finalesEn;
	const confirmando = frame >= promovidos.abre && frame < promovidos.confirma;
	const calculandoProm = frame >= promovidos.confirma && frame < promovidos.fin;
	const pProm = calculandoProm ? interpolate(frame, [promovidos.confirma, promovidos.fin], [0, 100]) : 0;

	const y2 = TB.arriba + alto1 + TB.entreTarjetas;

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', position: 'relative' }}>
			{/* ── Tarjeta 1: «Informes» y el aviso ─────────────────────────────────────────── */}
			<Tarjeta y={TB.arriba} alto={alto1}>
				<div style={{ height: TB.h1, fontSize: 30, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
					{escrito(frame, titulo, 4, 2)}
					<span style={{ opacity: cursorTitulo ? 1 : 0 }}>|</span>
				</div>

				<div style={{ opacity: (1 - recoge) * entra(frame, fps, 16, 12) }}>
					<div style={{ height: TB.trasH1 }} />
					<div
						style={{
							height: TB.aviso,
							boxSizing: 'border-box',
							padding: '14px 18px 14px 52px',
							position: 'relative',
							borderRadius: 8,
							border: '1px solid #ffe58f',
							background: '#fffbe6',
						}}
					>
						<svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', left: 18, top: 16 }} aria-hidden>
							<circle cx="12" cy="12" r="11" fill="#faad14" />
							<path d="M12 6.5 V13.5 M12 16.8 V17.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
						</svg>
						<div style={{ fontSize: 18, fontWeight: 600, color: TEXTO }}>{TB_TEXTOS.avisoTitulo}</div>
						<div style={{ fontSize: 15.5, lineHeight: 1.4, color: TEXTO, marginTop: 4 }}>{TB_TEXTOS.avisoTexto}</div>
					</div>
					<div style={{ height: TB.trasAviso }} />
					<div style={{ height: TB.fila, display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ width: ANCHO_ROTULO_PERIODO - 10, fontSize: 17, fontWeight: 700, color: TEXTO }}>{TB_TEXTOS.periodo}</span>
						{SIN_RECALCULAR.map((g, i) => (
							<Boton key={g} texto={g} ancho={rectanguloDeBotonDeGrupo(i).ancho} apagado={i < hechos || calculando} />
						))}
						<Boton
							texto={RECALCULAR_LOS}
							ancho={rectanguloDeRecalcularLos().ancho}
							primario
							apagado={calculando}
							encima={senal === 'recalcular'}
							pulsado={frame >= recalcula.pulsa && frame < recalcula.pulsa + 8}
						/>
					</div>
					<div style={{ height: TB.progreso, display: 'flex', alignItems: 'flex-end' }}>
						{calculando && <Progreso p={p} ancho={ANCHO_TARJETA - TB.pad * 2} />}
					</div>
				</div>
			</Tarjeta>

			{/* ── Tarjeta 2: las pestañas ──────────────────────────────────────────────────── */}
			<div
				style={{
					position: 'absolute',
					left: TB.lados,
					top: y2,
					width: ANCHO_TARJETA,
					height: 900,
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
					opacity: entra(frame, fps, 22, 14),
				}}
			>
				<div style={{ height: TB.pestanas, display: 'flex', paddingLeft: 8, boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{TB_TEXTOS.pestanas.map((t, i) => {
						const activa = enFinales ? i === FINALES : i === 0;
						return (
							<div
								key={t}
								style={{
									width: anchoDePestana(t),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 17,
									fontWeight: activa ? 600 : 400,
									color: activa || (i === FINALES && senal === 'finales') ? ACENTO : TEXTO,
									boxShadow: activa ? `inset 0 -${ALTO_GRUESO}px 0 ${ACENTO}` : 'none',
								}}
							>
								{t}
							</div>
						);
					})}
				</div>

				<div key={enFinales ? 'finales' : 'boletines'} style={{ padding: TB.pad, opacity: entra(frame, fps, enFinales ? finalesEn : 22, 10) }}>
					<Segmentado {...(enFinales ? TB_TEXTOS.tipoFinal : TB_TEXTOS.tipoBoletin)} />
					<Segmentado {...TB_TEXTOS.paraQuien} />
					<div style={{ display: 'flex', gap: 16 }}>
						{TB_TEXTOS.selectores.map((s) => (
							<div key={s.rotulo} style={{ flex: 1 }}>
								<Rotulo>{s.rotulo}</Rotulo>
								<div style={{ height: TB.control, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 16, color: TEXTO_TENUE }}>
									<span>{s.valor}</span>
									<span style={{ fontSize: 13 }}>▾</span>
								</div>
							</div>
						))}
					</div>
					<div style={{ height: TB.trasControl + 4 }} />
					<div style={{ display: 'flex', gap: 10, height: TB.botones }}>
						{(enFinales ? TB_TEXTOS.botonesFinales : TB_TEXTOS.botonesBoletines).map((b) => (
							<Boton key={b} texto={b} ancho={anchoDeBoton(b, 9)} alto={TB.botones} />
						))}
					</div>
					<div style={{ height: TB.trasBotones }} />

					{enFinales && (
						<div>
							{!confirmando && !calculandoProm && (
								<Boton
									texto={TB_TEXTOS.calcular}
									ancho={anchoDeBoton(TB_TEXTOS.calcular)}
									alto={TB.botones}
									encima={senal === 'calcular'}
									pulsado={frame >= promovidos.abre - 2 && frame < promovidos.abre + 6}
								/>
							)}
							{confirmando && (
								<div style={{ opacity: entra(frame, fps, promovidos.abre, 10) }}>
									<div style={{ height: TB.confirma, boxSizing: 'border-box', padding: '14px 18px 14px 52px', position: 'relative', borderRadius: 8, border: '1px solid #ffe58f', background: '#fffbe6' }}>
										<svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', left: 18, top: 16 }} aria-hidden>
											<circle cx="12" cy="12" r="11" fill="#faad14" />
											<path d="M12 6.5 V13.5 M12 16.8 V17.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
										</svg>
										<div style={{ fontSize: 18, fontWeight: 600, color: TEXTO }}>{TB_TEXTOS.confirmaTitulo}</div>
										<div style={{ fontSize: 15.5, lineHeight: 1.4, color: TEXTO, marginTop: 4 }}>{TB_TEXTOS.confirmaTexto}</div>
									</div>
									<div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
										<Boton texto={CONFIRMA} ancho={anchoDeBoton(CONFIRMA)} alto={TB.botones} peligro encima={senal === 'confirmar'} pulsado={frame >= promovidos.confirma - 6} />
										<Boton texto={TB_TEXTOS.cancelar} ancho={anchoDeBoton(TB_TEXTOS.cancelar)} alto={TB.botones} />
									</div>
								</div>
							)}
							{calculandoProm && <Progreso p={pProm} ancho={ANCHO_TARJETA - TB.pad * 2} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const Tarjeta: React.FC<{ y: number; alto: number; children: React.ReactNode }> = ({ y, alto, children }) => (
	<div
		style={{
			position: 'absolute',
			left: TB.lados,
			top: y,
			width: ANCHO_TARJETA,
			height: alto,
			padding: TB.pad,
			boxSizing: 'border-box',
			background: SUPERFICIE,
			border: `1px solid ${BORDE}`,
			borderRadius: 12,
			overflow: 'hidden',
		}}
	>
		{children}
	</div>
);

const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ height: TB.rotulo, fontSize: 15, fontWeight: 600, color: TEXTO }}>{children}</div>
);

const Segmentado: React.FC<{ rotulo: string; opciones: string[] }> = ({ rotulo, opciones }) => (
	<div style={{ height: TB.rotulo + TB.control + TB.trasControl }}>
		<Rotulo>{rotulo}</Rotulo>
		<div style={{ display: 'inline-flex', height: TB.control, padding: 3, boxSizing: 'border-box', borderRadius: 8, background: 'rgba(0,0,0,.05)' }}>
			{opciones.map((o, i) => (
				<div
					key={o}
					style={{
						padding: '0 16px',
						display: 'flex',
						alignItems: 'center',
						fontSize: 15.5,
						borderRadius: 6,
						background: i === 0 ? SUPERFICIE : 'transparent',
						boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
						color: i === 0 ? TEXTO : 'rgba(0,0,0,.65)',
						fontWeight: i === 0 ? 600 : 400,
					}}
				>
					{o}
				</div>
			))}
		</div>
	</div>
);

const Boton: React.FC<{
	texto: string;
	ancho: number;
	alto?: number;
	primario?: boolean;
	peligro?: boolean;
	apagado?: boolean;
	encima?: boolean;
	pulsado?: boolean;
}> = ({ texto, ancho, alto = TB.fila, primario = false, peligro = false, apagado = false, encima = false, pulsado = false }) => {
	const lleno = primario && !apagado;
	const borde = apagado ? BORDE : peligro ? '#ff4d4f' : primario ? ACENTO : encima ? ACENTO : BORDE;
	return (
		<div
			style={{
				width: ancho,
				height: alto,
				flexShrink: 0,
				boxSizing: 'border-box',
				borderRadius: 7,
				border: `1px solid ${borde}`,
				background: apagado ? 'rgba(0,0,0,.04)' : lleno ? (encima || pulsado ? '#4096ff' : ACENTO) : peligro && (encima || pulsado) ? '#fff1f0' : SUPERFICIE,
				color: apagado ? 'rgba(0,0,0,.25)' : lleno ? '#fff' : peligro ? '#ff4d4f' : encima ? ACENTO : TEXTO,
				fontSize: 16,
				fontWeight: primario || peligro ? 600 : 400,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				whiteSpace: 'nowrap',
				transform: pulsado ? 'scale(.97)' : undefined,
			}}
		>
			{texto}
		</div>
	);
};
