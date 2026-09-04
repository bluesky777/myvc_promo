import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Toque } from '../../comunes/Toque';
import { Cursor } from '../../comunes/Cursor';
import { entra, escrito, llega, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { Marco } from '../Marco';
import { AppDocente, MovilFlotante } from '../Movil';
import { BarrasHorizontales, BarrasVerticales, Linea, num, tSerie } from '../graficos';
import { Aviso, Barra, Boton, Cifra, Muestra, Num, Over, Pildora, Tarjeta } from '../piezas';
import {
	AZUL, AZUL_SUAVE, GRIS, MONO, NARANJA, PAPEL, RAYA, RAYA2, RELLENO, SERIF, TARJETA, TINTA,
	TINTA2, TINTA3, TINTA_AZUL, VERDE,
} from '../tema';
import { ARBOL, ENCUESTA, MOVIL_PREGUNTAS, RESULTADOS as R, TIPOS } from './datos';
import {
	CLIC_PUBLICAR, CONSTRUCTOR, CURSOR_PUBLICAR, DEDO_ENVIAR, DEDO_ESCALA, DEDO_NO, DEDO_SI,
	G_APLICA, G_CAMPOS, G_CAPACITACION, G_DIA, G_EXPERIENCIA, G_INTERES, GUARDADO, KPIS, MARCO,
	MOVIL, MOVIL_SALE, NOTA, PASO_KPI, PASO_PREGUNTA, PREGUNTAS, RAMA_HONDA, RAMA_NO, RAMA_SI,
	RESULTADOS, SALIDA, TOCA_ENVIAR, TOCA_ESCALA, TOCA_NO, TOCA_SI, WEB_SALE,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ENCUESTAS: SE PREPARA, SE CONTESTA Y SE MIRA. TRES SITIOS Y TRES MOMENTOS.
 *
 * El porqué del orden está en `guion.ts`. Lo que hay que respetar al tocar este fichero es una sola
 * regla: **en ningún fotograma se ven a la vez el navegador de la Unión y el teléfono del docente**.
 * En cuanto se ven juntos, quien mira entiende que están conectados en vivo, y no lo están: el
 * docente contesta cuando puede, y la Unión mira los resultados cuando quiere.
 *
 * ── LA PANTALLA DE RESULTADOS ES INVENTADA ─────────────────────────────────────────────────────
 *
 * No existe en `myvc_ucn/diseno`: se dibuja aquí, a petición de Joseth, para que el clip termine
 * donde termina de verdad el trabajo --en lo que la encuesta contestó--. Por eso las preguntas del
 * informe no son exactamente las que se ven contestar en el teléfono. Las cifras son de muestra.
 */

/* ── ACTO 1: la encuesta se prepara en el navegador ────────────────────────────────────────── */

const CARD = 820;
const PAD = 24;

const Y_HEAD = 16, H_HEAD = 40;
const Y_PILLS = Y_HEAD + H_HEAD + 10, H_PILL = 34;
const Y_ARBOL = Y_PILLS + H_PILL + 12;
const H_SIMPLE = 44, H_COND = 58, GAP_FILA = 5;

const FILA_Y: number[] = [];
ARBOL.reduce((y, p, i) => {
	FILA_Y[i] = y;
	return y + (p.condicion ? H_COND : H_SIMPLE) + GAP_FILA;
}, Y_ARBOL);

const FIN_ARBOL = FILA_Y[ARBOL.length - 1] + (ARBOL[ARBOL.length - 1].condicion ? H_COND : H_SIMPLE);
const Y_NOTA = FIN_ARBOL + 10, H_NOTA = 42;
const Y_PIE = Y_NOTA + H_NOTA + 10, H_PIE = 44;

const FilaPregunta: React.FC<{ p: (typeof ARBOL)[number]; t: number }> = ({ p, t }) => {
	const tipo = TIPOS[p.tipo];
	const sangria = p.nivel * 34;

	return (
		<div
			style={{
				position: 'relative',
				paddingLeft: sangria,
				height: p.condicion ? H_COND : H_SIMPLE,
				boxSizing: 'border-box',
				opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
				transform: `translateX(${interpolate(t, [0, 1], [-14, 0])}px)`,
			}}
		>
			{/* El codo que la cuelga de su madre. Sin él, la sangría sola no dice de quién depende. */}
			{p.nivel > 0 ? (
				<>
					<div style={{ position: 'absolute', left: sangria - 18, top: -8, bottom: '50%', width: 1, background: NARANJA }} />
					<div style={{ position: 'absolute', left: sangria - 18, top: '50%', width: 14, height: 1, background: NARANJA }} />
				</>
			) : null}

			<div
				style={{
					background: TARJETA,
					border: `1px solid ${p.condicion ? NARANJA : RAYA}`,
					borderRadius: 6,
					padding: p.condicion ? '7px 13px' : '11px 13px',
					height: '100%',
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					gap: 3,
				}}
			>
				{p.condicion ? (
					<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NARANJA} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
							<path d="M6 3v8a4 4 0 0 0 4 4h8" /><path d="M14 11 18 15 14 19" />
						</svg>
						<span style={{ fontSize: 10.5, color: NARANJA, fontWeight: 600 }}>{p.condicion}</span>
					</div>
				) : null}
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
						<div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>
							<Num style={{ color: TINTA3, fontWeight: 500 }}>{p.num}</Num>&nbsp;&nbsp;{p.texto}
						</div>
						{p.opciones && !p.condicion ? (
							<div style={{ fontSize: 11, color: TINTA3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.opciones}</div>
						) : null}
					</div>
					<span style={{ border: `1px solid ${tipo.color}`, color: tipo.color, borderRadius: 12, padding: '2px 9px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
						{tipo.etiqueta}
					</span>
				</div>
			</div>
		</div>
	);
};

const ActoUno: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
	<Marco
		activo="encuestas"
		sinRail
		overline="Unión Colombiana del Norte · Comunicación"
		titulo="Encuestas"
		sub="Se contestan dentro de la app, y una respuesta puede abrir preguntas que otros no verán"
		desde={MARCO}
		pie={[
			'Una pregunta puede depender de la respuesta de otra, y de otra encadenada: el docente sólo ve el camino que le toca.',
			`Cierra el ${ENCUESTA.cierra}`,
		]}
	>
		<div style={{ position: 'relative', height: 620 }}>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: CARD,
					height: Y_PIE + H_PIE + 14,
					background: '#F7F4EC',
					border: `1px solid ${RAYA}`,
					borderRadius: 6,
					boxSizing: 'border-box',
					opacity: entra(frame, fps, CONSTRUCTOR, 16),
					transform: `translateY(${interpolate(entra(frame, fps, CONSTRUCTOR, 16), [0, 1], [18, 0])}px)`,
				}}
			>
				<div style={{ position: 'absolute', left: PAD, top: Y_HEAD, right: PAD, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>{ENCUESTA.titulo}</div>
						<div style={{ fontSize: 12, color: TINTA3 }}>{ENCUESTA.sub}</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 7, background: TARJETA, border: `1px solid ${RAYA2}`, borderRadius: 4, padding: '7px 12px', fontSize: 11.5, fontWeight: 500 }}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TINTA2} strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
						Añadir pregunta
					</div>
				</div>

				<div style={{ position: 'absolute', left: PAD, top: Y_PILLS, display: 'flex', alignItems: 'center', gap: 9 }}>
					<Pildora on>Docentes</Pildora>
					<Pildora>Rectores</Pildora>
					<span style={{ width: 1, height: 22, background: RAYA2, margin: '0 4px' }} />
					<Pildora on>Los 13 colegios</Pildora>
					<Pildora>Por campo</Pildora>
				</div>

				{ARBOL.map((p, i) => (
					<div key={p.num} style={{ position: 'absolute', left: PAD, top: FILA_Y[i], width: CARD - PAD * 2 }}>
						<FilaPregunta p={p} t={llega(frame, fps, i, PREGUNTAS, PASO_PREGUNTA, 16).opacidad} />
					</div>
				))}

				<div style={{ position: 'absolute', left: PAD, top: Y_NOTA, width: CARD - PAD * 2 }}>
					<Aviso
						t={entra(frame, fps, NOTA, 16)}
						icono={
							<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={AZUL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M6 3v8a4 4 0 0 0 4 4h8" /><path d="M14 11 18 15 14 19" />
							</svg>
						}
					>
						<strong style={{ color: TINTA }}>Cuatro preguntas dependen de otra.</strong> Un docente que nunca recibió la capacitación contesta cinco preguntas; uno que sí la recibió y no la aplica, ocho.
					</Aviso>
				</div>

				<div style={{ position: 'absolute', left: PAD, right: PAD, top: Y_PIE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderTop: `1px solid ${RAYA}`, paddingTop: 12 }}>
					<Num style={{ fontSize: 11, color: TINTA3, whiteSpace: 'nowrap' }}>{ENCUESTA.resumen}</Num>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Boton>Vista previa</Boton>
						<Boton
							primario
							resalte={interpolate(frame - CLIC_PUBLICAR, [0, 5, 16], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
							icono={
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 3 10.5 13.5" /><path d="M21 3 14.5 21l-4-8-8-4L21 3Z" />
								</svg>
							}
						>
							Publicar y notificar
						</Boton>
					</div>
				</div>
			</div>

			{/* A la derecha, qué va a pasar al publicar. Es lo que el acto 2 enseña después. */}
			<div style={{ position: 'absolute', left: CARD + 24, top: 0, width: 464 }}>
				<Tarjeta titulo="Qué pasa al publicar" sub="Sin que nadie tenga que repartir nada" t={entra(frame, fps, CONSTRUCTOR + 16, 16)}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
						{[
							['Le llega a 363 docentes', 'Un aviso en la app que ya usan, con la fecha de cierre dentro.'],
							['Cada uno ve su camino', 'Las condicionales se resuelven en su teléfono, según lo que conteste.'],
							['Se guarda sola', 'Puede cerrarla y seguir después. Al enviar, queda registrada.'],
							['Y la Unión ve el resultado', 'Sin pedirle la hoja de cálculo a nadie.'],
						].map(([t, s], i) => {
							const m = llega(frame, fps, i, CONSTRUCTOR + 24, 9, 16);
							return (
								<div key={t} style={{ display: 'flex', gap: 11, paddingBottom: 11, borderBottom: `1px solid ${RAYA}`, opacity: m.opacidad, transform: `translateY(${m.y * 0.5}px)` }}>
									<span style={{ width: 22, height: 22, borderRadius: '50%', background: AZUL, color: TARJETA, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0, fontFamily: MONO }}>{i + 1}</span>
									<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
										<div style={{ fontSize: 12.5, fontWeight: 600 }}>{t}</div>
										<div style={{ fontSize: 11.5, color: TINTA2, lineHeight: 1.45 }}>{s}</div>
									</div>
								</div>
							);
						})}
					</div>
				</Tarjeta>
			</div>

			<Cursor
				color={AZUL}
				puntos={[
					{ frame: CURSOR_PUBLICAR, x: 380, y: Y_PIE - 60 },
					{ frame: CLIC_PUBLICAR, x: 696, y: Y_PIE + 22 },
				]}
				clics={[CLIC_PUBLICAR]}
				aparece={CURSOR_PUBLICAR}
				sale={CLIC_PUBLICAR + 8}
			/>
		</div>
	</Marco>
);

/* ── ACTO 2: el docente contesta ───────────────────────────────────────────────────────────── */

const Opcion: React.FC<{ texto: string; marcada?: boolean; t: number }> = ({ texto, marcada = false, t }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 11,
			borderRadius: 8,
			padding: '12px 14px',
			border: marcada ? `1.5px solid ${AZUL}` : `1px solid ${RAYA2}`,
			background: marcada ? AZUL_SUAVE : TARJETA,
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [10, 0])}px)`,
		}}
	>
		<span style={{ width: 19, height: 19, borderRadius: '50%', border: marcada ? 'none' : `1.5px solid ${RAYA2}`, background: marcada ? AZUL : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box' }}>
			{marcada ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: TARJETA }} /> : null}
		</span>
		<span style={{ fontSize: 13.5, fontWeight: marcada ? 600 : 400 }}>{texto}</span>
	</div>
);

const Divisor: React.FC<{ t: number }> = ({ t }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: interpolate(t, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }) }}>
		<span style={{ flexGrow: 1, height: 1, background: RAYA2 }} />
		<span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: NARANJA, fontWeight: 600 }}>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NARANJA} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M6 3v8a4 4 0 0 0 4 4h8" /><path d="M14 11 18 15 14 19" />
			</svg>
			apareció por tu respuesta
		</span>
		<span style={{ flexGrow: 1, height: 1, background: RAYA2 }} />
	</div>
);

type Rama = 'ninguna' | 'no' | 'si' | 'honda';

function ramaEn(frame: number): Rama {
	if (frame >= RAMA_HONDA) { return 'honda'; }
	if (frame >= RAMA_SI) { return 'si'; }
	if (frame >= RAMA_NO) { return 'no'; }
	return 'ninguna';
}

const PantallaEncuesta: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const rama = ramaEn(frame);
	const contestada = frame >= TOCA_NO;
	const eligeSi = frame >= TOCA_SI;
	const guardado = frame >= GUARDADO;

	const de = rama === 'ninguna' || rama === 'no' ? 5 : 8;
	const va = rama === 'ninguna' ? 1 : rama === 'honda' ? 3 : 2;

	const salidaNo = interpolate(frame, [TOCA_SI, TOCA_SI + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	/*
	 * LAS OCHO PREGUNTAS DEL CAMINO LARGO CABEN ENTERAS: 712 px de contenido en los 802 de pantalla
	 * útil. Aquí hubo un desplazamiento automático «por si no cabía» y lo único que hacía era
	 * empujar el contador «3 de 8» fuera de cuadro, que es justo lo que hay que ver.
	 */

	return (
		<AppDocente titulo={ENCUESTA.titulo}>
			<div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 16, }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<span style={{ fontSize: 13, color: TINTA3 }}>Tus preguntas</span>
						<Num style={{ fontSize: 12.5, color: TINTA3 }}>{va} de {de}</Num>
					</div>
					<div style={{ height: 6, background: RAYA, borderRadius: 3, display: 'flex' }}>
						<div style={{ width: `${(va / de) * 100}%`, background: AZUL, borderRadius: 3 }} />
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 11, opacity: contestada ? 0.5 : 1 }}>
					<div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{MOVIL_PREGUNTAS.dos.texto}</div>
					<div style={{ display: 'flex', gap: 10 }}>
						{MOVIL_PREGUNTAS.dos.opciones.map((o) => {
							const marcada = (o === 'No' && contestada && !eligeSi) || (o === 'Sí' && eligeSi);
							return (
								<div key={o} style={{ flexGrow: 1, border: marcada ? `1.5px solid ${AZUL}` : `1px solid ${RAYA2}`, background: marcada ? AZUL_SUAVE : TARJETA, borderRadius: 8, padding: 12, textAlign: 'center', fontSize: 13.5, fontWeight: marcada ? 600 : 400 }}>
									{o}
								</div>
							);
						})}
					</div>
				</div>

				{rama === 'no' && salidaNo > 0.01 ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14, opacity: salidaNo }}>
						<Divisor t={entra(frame, fps, RAMA_NO, 12)} />
						<div style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.35 }}>{MOVIL_PREGUNTAS.dosUno.texto}</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							{MOVIL_PREGUNTAS.dosUno.opciones.map((o, i) => (
								<Opcion key={o} texto={o} t={entra(frame, fps, RAMA_NO + 6 + i * 5, 12)} />
							))}
						</div>
					</div>
				) : null}

				{rama === 'si' || rama === 'honda' ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						<Divisor t={entra(frame, fps, RAMA_SI, 12)} />

						<div style={{ display: 'flex', flexDirection: 'column', gap: 9, opacity: entra(frame, fps, RAMA_SI + 4, 12) }}>
							<div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{MOVIL_PREGUNTAS.dosDos.texto}</div>
							<div style={{ border: `1px solid ${RAYA2}`, borderRadius: 8, padding: '11px 14px', fontSize: 15, fontFamily: MONO, background: PAPEL }}>
								{MOVIL_PREGUNTAS.dosDos.valor}
							</div>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 9, opacity: entra(frame, fps, RAMA_SI + 12, 12) }}>
							<div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{MOVIL_PREGUNTAS.dosTres.texto}</div>
							<div style={{ display: 'flex', gap: 8 }}>
								{MOVIL_PREGUNTAS.dosTres.escala.map((n) => {
									const marcada = n === '2' && frame >= TOCA_ESCALA;
									return (
										<div key={n} style={{ flexGrow: 1, border: marcada ? `1.5px solid ${AZUL}` : `1px solid ${RAYA2}`, background: marcada ? AZUL : TARJETA, color: marcada ? TARJETA : TINTA, borderRadius: 8, padding: '11px 0', textAlign: 'center', fontSize: 15, fontWeight: 600, fontFamily: MONO }}>
											{n}
										</div>
									);
								})}
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: TINTA3 }}>
								<span>{MOVIL_PREGUNTAS.dosTres.pie[0]}</span>
								<span>{MOVIL_PREGUNTAS.dosTres.pie[1]}</span>
							</div>
						</div>
					</div>
				) : null}

				{rama === 'honda' ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						<Divisor t={entra(frame, fps, RAMA_HONDA, 12)} />
						<div style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.35, opacity: entra(frame, fps, RAMA_HONDA + 4, 12) }}>{MOVIL_PREGUNTAS.dosTresUno.texto}</div>
						<div style={{ border: `1px solid ${RAYA2}`, borderRadius: 8, padding: '11px 14px', fontSize: 13.5, color: TINTA2, lineHeight: 1.45, minHeight: 64, background: PAPEL, opacity: entra(frame, fps, RAMA_HONDA + 4, 12) }}>
							{escrito(frame, MOVIL_PREGUNTAS.dosTresUno.respuesta, RAMA_HONDA + 14, 1.2)}
							<span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: AZUL }}>|</span>
						</div>
					</div>
				) : null}

				{/* Enviar, y la prueba de que quedó guardada. */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 9,
							background: guardado ? VERDE : TINTA_AZUL,
							color: TARJETA,
							borderRadius: 9,
							padding: 15,
							fontSize: 14.5,
							fontWeight: 600,
							transform: `scale(${interpolate(frame - TOCA_ENVIAR, [0, 4, 12], [1, 0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
						}}
					>
						{guardado ? (
							<>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>
								Respuestas guardadas
							</>
						) : (
							<>
								Enviar respuestas
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15" /><path d="M13.5 6 19.5 12 13.5 18" /></svg>
							</>
						)}
					</div>
					<div style={{ fontSize: 11.5, color: guardado ? VERDE : TINTA3, textAlign: 'center', fontWeight: guardado ? 600 : 400 }}>
						{guardado ? 'Ya están en el portal de la Unión.' : 'Se guarda sola. Puede cerrarla y seguir después.'}
					</div>
				</div>
			</div>
		</AppDocente>
	);
};

/* ── ACTO 3: los resultados ────────────────────────────────────────────────────────────────── */

const ActoTres: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
	<Marco
		activo="encuestas"
		sinRail
		overline={`Unión Colombiana del Norte · ${ENCUESTA.titulo}`}
		titulo="Lo que contestaron"
		sub="249 de 363 docentes · trece colegios · la encuesta cierra el 12 de septiembre"
		desde={RESULTADOS}
		pie={[
			'Cada respuesta trae el colegio y el campo de quien la envió: por eso una pregunta condicional sirve para algo y una encuesta plana no.',
			'249 respuestas · actualizado hace 4 minutos',
		]}
	>
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
				{R.kpi.map((k, i) => {
					const t = entra(frame, fps, KPIS + i * PASO_KPI, 20);
					return (
						<div key={k.etiqueta} style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: i === 0 ? 0 : 26, paddingRight: 26, borderLeft: i === 0 ? 'none' : `1px solid ${RAYA}`, opacity: interpolate(t, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) }}>
							<Over>{k.etiqueta}</Over>
							<Cifra valor={k.valor} t={t} decimales={k.decimales} sufijo={k.sufijo} tam={30} />
							<div style={{ fontSize: 11, color: TINTA3 }}>{k.pie}</div>
						</div>
					);
				})}
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '640px 324px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
				<Tarjeta
					titulo="La pregunta que abre las demás"
					sub="Y lo que contestaron los 97 que dijeron «No»"
					t={entra(frame, fps, G_CAPACITACION - 8, 16)}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<div style={{ fontSize: 12.5, fontWeight: 600 }}>2 · ¿Ha recibido capacitación en evaluación por competencias?</div>
						{R.capacitacion.map((d, i) => {
							const t = tSerie(frame, G_CAPACITACION, i, 8, 20);
							return (
								<div key={d.etiqueta} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
									<span style={{ fontSize: 12.5, width: 30 }}>{d.etiqueta}</span>
									<Barra pct={d.pct} t={t} color={d.color} alto={18} />
									<Num style={{ fontSize: 12.5, fontWeight: 600, width: 80, textAlign: 'right', whiteSpace: 'nowrap' }}>{d.pct} % · {num(Math.round(d.valor * t))}</Num>
								</div>
							);
						})}

						<div style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: entra(frame, fps, G_INTERES - 10, 14) }}>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={NARANJA} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
								<path d="M6 3v8a4 4 0 0 0 4 4h8" /><path d="M14 11 18 15 14 19" />
							</svg>
							<span style={{ fontSize: 11, color: NARANJA, fontWeight: 600 }}>a los 97 que dijeron «No» se les abrió la 2.1</span>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 22, borderLeft: `2px solid ${RAYA}` }}>
							<div style={{ fontSize: 12.5, fontWeight: 600 }}>2.1 · ¿Le interesaría recibirla este año?</div>
							{R.interes.map((d, i) => {
								const t = tSerie(frame, G_INTERES, i, 7, 18);
								return (
									<div key={d.etiqueta} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
										<span style={{ fontSize: 12, width: 104 }}>{d.etiqueta}</span>
										<Barra pct={d.pct} t={t} color={d.color} alto={16} />
										<Num style={{ fontSize: 12.5, fontWeight: 600, width: 80, textAlign: 'right', whiteSpace: 'nowrap' }}>{d.pct} % · {num(Math.round(d.valor * t))}</Num>
									</div>
								);
							})}
						</div>
					</div>
				</Tarjeta>

				<Tarjeta titulo="¿La aplica en su aula?" sub="Los 152 que sí la recibieron · de 1 a 5" t={entra(frame, fps, G_APLICA - 8, 16)}>
					<BarrasVerticales
						datos={R.aplica}
						frame={frame}
						desde={G_APLICA}
						ancho={276}
						alto={172}
						color={AZUL}
						max={50}
						rejilla={[25, 50]}
						pie="52 contestaron 1 o 2: a ésos se les abrió otra."
					/>
				</Tarjeta>

				<Tarjeta titulo="Años enseñando" sub="En un colegio adventista" t={entra(frame, fps, G_EXPERIENCIA - 8, 16)}>
					<BarrasVerticales
						datos={R.experiencia}
						frame={frame}
						desde={G_EXPERIENCIA}
						ancho={276}
						alto={172}
						color={VERDE}
						max={100}
						rejilla={[50, 100]}
					/>
				</Tarjeta>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: '640px minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
				<Tarjeta titulo="Quién ha contestado" sub="Participación por campo" t={entra(frame, fps, G_CAMPOS - 8, 16)}>
					<BarrasHorizontales
						datos={R.campos}
						frame={frame}
						desde={G_CAMPOS}
						ancho={592}
						anchoEtiqueta={150}
						altoFila={20}
						color={AZUL}
						max={100}
						sufijo=" %"
						referencia={{ valor: 68.6, texto: 'red 68,6 %', color: NARANJA }}
					/>
				</Tarjeta>

				<Tarjeta titulo="Cómo fueron llegando" sub="Respuestas acumuladas desde que se publicó" t={entra(frame, fps, G_DIA - 8, 16)}>
					<Linea
						valores={R.porDia.valores}
						anios={R.porDia.dias as unknown as number[]}
						frame={frame}
						desde={G_DIA}
						dur={44}
						ancho={608}
						alto={150}
						color={AZUL}
						min={0}
						max={280}
						pie="Más de la mitad, en las primeras 48 horas."
					/>
				</Tarjeta>
			</div>
		</div>
	</Marco>
);

/* ── La escena ─────────────────────────────────────────────────────────────────────────────── */

export const EscenaEncuestas: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const fuera = seVa(frame, 0, SALIDA, 0, 26);

	/* La web del acto 1 se retira; la del acto 3 llega después. Nunca están las dos, ni con el móvil. */
	const salidaWeb = interpolate(frame, [WEB_SALE, WEB_SALE + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });

	/* El teléfono, centrado en el fotograma y a su tamaño: aquí no comparte sitio con nada. */
	const escalaMovil = conRotulo ? 0.9 : 1.0;
	const movilX = (1920 - 446 * escalaMovil) / 2;
	const movilY = conRotulo ? 24 : 71;

	return (
		<Lienzo conRotulo={conRotulo}>
			{frame < WEB_SALE + 22 ? (
				<AbsoluteFill style={{ opacity: 1 - salidaWeb, transform: `scale(${1 - salidaWeb * 0.04})`, transformOrigin: 'center center' }}>
					<Pantalla conRotulo={conRotulo}>
						<ActoUno frame={frame} fps={fps} />
					</Pantalla>
				</AbsoluteFill>
			) : null}

			{frame >= RESULTADOS ? (
				<AbsoluteFill style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})` }}>
					<Pantalla conRotulo={conRotulo}>
						<ActoTres frame={frame} fps={fps} />
					</Pantalla>
				</AbsoluteFill>
			) : null}

			<MovilFlotante desde={MOVIL} sale={MOVIL_SALE} x={movilX} y={movilY} escala={escalaMovil}>
				<PantallaEncuesta frame={frame} fps={fps} />
			</MovilFlotante>

			{/* El dedo del docente. Las coordenadas son del fotograma: el teléfono está solo en él. */}
			<Toque puntos={[{ frame: DEDO_NO, x: movilX + 320 * escalaMovil, y: movilY + 300 * escalaMovil }]} toques={[TOCA_NO]} aparece={DEDO_NO} sale={TOCA_NO + 10} tam={40} />
			<Toque puntos={[{ frame: DEDO_SI, x: movilX + 126 * escalaMovil, y: movilY + 300 * escalaMovil }]} toques={[TOCA_SI]} aparece={DEDO_SI} sale={TOCA_SI + 10} tam={40} />
			<Toque puntos={[{ frame: DEDO_ESCALA, x: movilX + 140 * escalaMovil, y: movilY + 604 * escalaMovil }]} toques={[TOCA_ESCALA]} aparece={DEDO_ESCALA} sale={TOCA_ESCALA + 10} tam={40} />
			<Toque puntos={[{ frame: DEDO_ENVIAR, x: movilX + 223 * escalaMovil, y: movilY + 800 * escalaMovil }]} toques={[TOCA_ENVIAR]} aparece={DEDO_ENVIAR} sale={TOCA_ENVIAR + 12} tam={40} />

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: NOTA + 8, hasta: CURSOR_PUBLICAR - 6, titulo: 'Nueve preguntas. Nadie las ve todas.', pie: 'Cuatro cuelgan de la respuesta a otra.' },
						{ desde: RAMA_NO + 10, hasta: DEDO_SI - 8, titulo: 'Contesta «No» y aparece una.', pie: 'A quien dijo que sí, esta pregunta no le sale.' },
						{ desde: RAMA_SI + 10, hasta: DEDO_ESCALA - 8, titulo: 'Contesta «Sí» y aparecen otras dos.', pie: 'Distintas, no la misma con otro texto. El camino cambia entero.' },
						{ desde: RAMA_HONDA + 12, hasta: DEDO_ENVIAR - 8, titulo: 'Y una respuesta baja abre la tercera.', pie: 'La 2.3.1 sólo existe para quien contestó 1 o 2 en la anterior.' },
						{ desde: GUARDADO + 4, hasta: RESULTADOS + 20, titulo: 'Enviadas.', pie: 'Se guardan solas, y el docente sabe que llegaron.' },
						{ desde: G_CAPACITACION + 20, hasta: G_CAMPOS - 6, titulo: '85 docentes piden la capacitación.', pie: 'Y se sabe en qué colegio está cada uno. Eso lo da una pregunta condicional; una encuesta plana, no.' },
						{ desde: G_DIA + 20, hasta: SALIDA, titulo: 'Sin pedirle la hoja de cálculo a nadie.', pie: '249 respuestas de trece colegios, contadas solas.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
