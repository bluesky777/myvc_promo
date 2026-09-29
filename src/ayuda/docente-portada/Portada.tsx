import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ALTO_DESPLIEGUE, ANCHO, AVISOS_DEL_COLEGIO, AZULEJOS, BOTONES_DESPLIEGUE, BOTON_UNIDADES, CLASES_HOY, CLASES_MANANA,
	COL_DER, COL_IZQ, DESPLIEGUE, LO_QUE_VIENE, MANANA, P, SIN_INDICADOR, UNIDADES_9B, altoDeCaja, rectDeFila,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PORTADA DEL DOCENTE, dibujada con los textos de app2 (`inicio.html`, `clases-de-hoy.html`,
 * `lo-que-viene.html`). Va dentro de la cáscara, en el hueco del contenido.
 *
 * Las filas de «Clases de hoy» son botones de ancho entero: el recuadro del color del grupo con su
 * sigla, la materia en negrita y el chevron. Sin hora, porque sin horario oficial la lista sale de
 * los días marcados. Al pulsar una, se despliega pegada debajo con «Asistencia», «Ir a Logros» y los
 * logros del periodo con sus indicadores. Una sola abierta a la vez; «Mañana…» cierra la abierta.
 */

const SUAVE = '#595959';
const LINEA = '#f0f0f0';

export const Portada: React.FC<{
	/** Qué día se ve, y desde cuándo (el cambio a mañana es un corte, como en la aplicación). */
	manana: boolean;
	/** La fila abierta, o `null`. */
	abierta: number | null;
	/** La fila con el ratón encima. */
	senalada: number | null;
	/** Cuándo empieza a montarse (fotograma local). */
	desde?: number;
}> = ({ manana, abierta, senalada, desde = 0 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const clases = manana ? CLASES_MANANA : CLASES_HOY;
	const bloque = (i: number) => {
		const l = llega(frame, fps, i, desde + 4, 5);
		return { opacity: l.opacidad, transform: `translateY(${l.y}px)` };
	};

	return (
		<div style={{ position: 'relative', width: ANCHO, height: '100%' }}>
			{/* ── Clases de hoy ── */}
			<div style={{ position: 'absolute', left: COL_IZQ.x, top: P.arriba, width: COL_IZQ.ancho, ...bloque(0) }}>
				<Cabecera icono="reloj" titulo={manana ? 'Clases de mañana' : 'Clases de hoy'} />
				<span style={{ position: 'absolute', left: MANANA.x - COL_IZQ.x, top: MANANA.y - P.arriba, width: MANANA.ancho, height: MANANA.alto, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 17, color: ACENTO }}>
					{manana ? '…Hoy' : 'Mañana…'}
				</span>
			</div>

			{clases.map((a, i) => {
				const r = rectDeFila(i, abierta);
				const esLaAbierta = abierta === i;
				return (
					<div key={`${manana}-${a.grupo}`} style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, ...bloque(1 + i) }}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: r.alto,
								boxSizing: 'border-box',
								borderRadius: esLaAbierta ? '8px 8px 0 0' : 8,
								border: `1px solid ${esLaAbierta || senalada === i ? ACENTO : 'rgb(128 128 128 / 25%)'}`,
								background: SUPERFICIE,
								overflow: 'hidden',
							}}
						>
							<div style={{ width: 58, alignSelf: 'stretch', background: a.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700 }}>
								{a.sigla}
							</div>
							<span style={{ flex: 1, marginLeft: 18, fontSize: 20, fontWeight: 600, color: TEXTO }}>{a.materia}</span>
							<Chevron arriba={esLaAbierta} />
						</div>

						{esLaAbierta && <Despliegue />}
					</div>
				);
			})}

			{/* ── Los azulejos de alumnos por grupo, debajo ── */}
			<div
				style={{
					position: 'absolute',
					left: COL_IZQ.x,
					top: rectDeFila(clases.length - 1, abierta).y + P.fila + 40,
					width: COL_IZQ.ancho,
					display: 'flex',
					gap: 16,
					...bloque(5),
				}}
			>
				{AZULEJOS.map((z) => (
					<div key={z.rotulo} style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: `1px solid ${BORDE}`, background: SUPERFICIE }}>
						<div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.6, color: TEXTO_TENUE }}>{z.rotulo}</div>
						<div style={{ marginTop: 6, fontSize: 28, fontWeight: 700, color: TEXTO }}>
							{z.cifra}
							{z.apunte && <span style={{ marginLeft: 8, fontSize: 16, fontWeight: 400, color: SUAVE }}>{z.apunte}</span>}
						</div>
					</div>
				))}
			</div>

			{/* ── La columna de la derecha ── */}
			<div style={{ position: 'absolute', left: COL_DER.x, top: P.arriba, width: COL_DER.ancho, ...bloque(2) }}>
				<Cabecera icono="calendario" titulo="Lo que viene" enlace="Ver el calendario ›" />
				<div style={{ marginTop: P.bajoCabecera }}>
					{LO_QUE_VIENE.map((d) => (
						<div key={d.dia} style={{ marginBottom: 14 }}>
							<div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.7, color: TEXTO_TENUE }}>{d.dia}</div>
							{d.cosas.map((c) => (
								<div key={c.texto} style={{ marginTop: 4, fontSize: 17, color: TEXTO, lineHeight: 1.35 }}>
									{c.cumple && <Regalo />}
									{c.hora && <span style={{ fontWeight: 600, marginRight: 8, fontVariantNumeric: 'tabular-nums' }}>{c.hora}</span>}
									{c.texto}
									{c.soloPersonal && <div style={{ fontSize: 13, color: TEXTO_TENUE }}>sólo personal</div>}
								</div>
							))}
						</div>
					))}
				</div>

				<div style={{ marginTop: 22 }}>
					<Cabecera icono="aviso" titulo="Avisos del colegio" enlace="Ver todas →" />
					{AVISOS_DEL_COLEGIO.map((a, i) => (
						<div key={a.autor} style={{ padding: '12px 0', borderTop: i > 0 ? `1px solid ${LINEA}` : 'none', marginTop: i === 0 ? 6 : 0 }}>
							<div>
								<span style={{ fontSize: 16, fontWeight: 700, color: TEXTO }}>{a.autor}</span>
								<span style={{ marginLeft: 8, fontSize: 13, color: TEXTO_TENUE }}>{a.fecha}</span>
							</div>
							<div style={{ marginTop: 4, fontSize: 15.5, color: TEXTO, lineHeight: 1.4 }}>{a.texto}</div>
							{a.comentarios && (
								<div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXTO_TENUE }}>
									<svg width="14" height="14" viewBox="0 0 16 16"><path d="M2.5 3.5 H13.5 V11 H7 L4 13.5 V11 H2.5 Z" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.4" strokeLinejoin="round" /></svg>
									{a.comentarios} comentarios
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

/** El panel que se despliega debajo de la fila de 9°B. */
const Despliegue: React.FC = () => (
	<div
		style={{
			height: ALTO_DESPLIEGUE,
			boxSizing: 'border-box',
			padding: DESPLIEGUE.relleno,
			border: `1px solid ${ACENTO}`,
			borderTop: 'none',
			borderRadius: '0 0 8px 8px',
			background: SUPERFICIE,
		}}
	>
		<div style={{ display: 'flex', gap: 10, height: DESPLIEGUE.botones }}>
			<Boton ancho={BOTONES_DESPLIEGUE.asistencia} primario icono="equipo">Asistencia</Boton>
			<Boton ancho={BOTONES_DESPLIEGUE.unidades} icono="lista">{BOTON_UNIDADES}</Boton>
		</div>
		<div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: DESPLIEGUE.entreCajas }}>
			{UNIDADES_9B.map((u, i) => (
				<div
					key={u.definicion}
					style={{
						height: altoDeCaja(u.indicadores.length),
						boxSizing: 'border-box',
						padding: DESPLIEGUE.caja.relleno,
						borderRadius: 8,
						border: `1px solid ${BORDE}`,
						background: '#fafafa',
					}}
				>
					<div style={{ height: DESPLIEGUE.caja.titulo, fontSize: 17, fontWeight: 600, color: TEXTO }}>{i + 1}. {u.definicion}</div>
					<div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: DESPLIEGUE.caja.hueco }}>
						{u.indicadores.length === 0 && (
							<div style={{ height: DESPLIEGUE.caja.linea, display: 'flex', alignItems: 'center', fontSize: 15.5, color: TEXTO_TENUE }}>{SIN_INDICADOR}</div>
						)}
						{u.indicadores.map((ind, j) => (
							<div
								key={ind}
								style={{
									height: DESPLIEGUE.caja.linea,
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									padding: '0 12px',
									boxSizing: 'border-box',
									borderRadius: 6,
									border: `1px solid ${BORDE}`,
									background: SUPERFICIE,
									fontSize: 15.5,
									color: TEXTO,
									whiteSpace: 'nowrap',
								}}
							>
								<Lapiz />
								{j + 1}. {ind}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	</div>
);

const Boton: React.FC<{ ancho: number; primario?: boolean; icono: 'equipo' | 'lista'; children: React.ReactNode }> = ({ ancho, primario = false, icono, children }) => (
	<div
		style={{
			width: ancho,
			height: DESPLIEGUE.botones,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			borderRadius: 7,
			border: `1px solid ${primario ? ACENTO : BORDE}`,
			background: primario ? ACENTO : SUPERFICIE,
			color: primario ? '#fff' : TEXTO,
			fontSize: 16.5,
			fontWeight: 500,
		}}
	>
		<svg width="17" height="17" viewBox="0 0 18 18">
			{icono === 'equipo' ? (
				<g fill="none" stroke={primario ? '#fff' : TEXTO} strokeWidth="1.6" strokeLinecap="round">
					<circle cx="6.5" cy="6.5" r="2.4" />
					<circle cx="12.6" cy="7.2" r="1.9" />
					<path d="M2 15 C2 11.8 4.1 10.6 6.5 10.6 C8.9 10.6 11 11.8 11 15 M12.2 10.8 C14.4 10.8 16 12 16 14.6" />
				</g>
			) : (
				<g fill="none" stroke={TEXTO} strokeWidth="1.6" strokeLinecap="round">
					<path d="M7 4.5 H15.5 M7 9 H15.5 M7 13.5 H15.5" />
					<path d="M2.6 3.6 H3.8 V6 M2.6 8.2 C3.2 7.7 4.4 7.8 4.4 8.6 C4.4 9.4 2.6 10 2.6 10.8 H4.6" />
				</g>
			)}
		</svg>
		{children}
	</div>
);

const Cabecera: React.FC<{ icono: 'reloj' | 'calendario' | 'aviso'; titulo: string; enlace?: string }> = ({ icono, titulo, enlace }) => (
	<div style={{ height: P.cabecera, display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${LINEA}`, boxSizing: 'border-box' }}>
		<svg width="20" height="20" viewBox="0 0 20 20">
			<g fill="none" stroke={TEXTO} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
				{icono === 'reloj' && (<><circle cx="10" cy="10" r="7.4" /><path d="M10 5.8 V10.2 L13 12" /></>)}
				{icono === 'calendario' && (<><rect x="3" y="4.4" width="14" height="12.4" rx="1.6" /><path d="M3 8.4 H17 M7 2.6 V6 M13 2.6 V6" /></>)}
				{icono === 'aviso' && (<><path d="M3.4 8 V12 L7 12 L13.6 15.6 V4.4 L7 8 Z" /><path d="M7 12 L8.2 16" /></>)}
			</g>
		</svg>
		<span style={{ fontSize: 21, fontWeight: 600, color: TEXTO, flex: 1 }}>{titulo}</span>
		{enlace && <span style={{ fontSize: 15, color: icono === 'aviso' ? TEXTO_TENUE : ACENTO }}>{enlace}</span>}
	</div>
);

const Chevron: React.FC<{ arriba: boolean }> = ({ arriba }) => (
	<svg width="16" height="16" viewBox="0 0 12 12" style={{ marginRight: 20, transform: `rotate(${arriba ? 180 : 0}deg)` }}>
		<path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Regalo: React.FC = () => (
	<svg width="17" height="17" viewBox="0 0 18 18" style={{ marginRight: 8, verticalAlign: -2 }}>
		<g fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinejoin="round">
			<rect x="2.6" y="6.6" width="12.8" height="3.4" />
			<path d="M3.8 10 V15.4 H14.2 V10 M9 6.6 V15.4 M9 6.4 C7.6 3.4 4.8 3.8 5.6 5.6 C6 6.4 9 6.4 9 6.4 C10.4 3.4 13.2 3.8 12.4 5.6 C12 6.4 9 6.4 9 6.4" />
		</g>
	</svg>
);

const Lapiz: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		<path d="M3 13 L3.6 10.4 L10.8 3.2 L12.8 5.2 L5.6 12.4 Z M9.8 4.2 L11.8 6.2" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);
