import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { IconoTardanza, IconoUniforme } from '../../disciplina/Rejilla';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ALUMNOS, ANCHO_PERIODO, ANCHO_TABLA, ANCHOS_DEL_PIE, BOTONES_DEL_PIE, FILA_UNIFORME, GEOMETRIA, GRUPO,
	GRUPOS, EL_GRUPO, ORDINALES, PERIODOS, R, TIPOS, X_PIE, X_REJILLA, Y_REJILLA, Y_TABLA,
	altoDeSituaciones, altoDeUniformes, crecida, type Situacion, type Uniforme,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA «DISCIPLINA» CON EL GRUPO ELEGIDO, a pantalla completa. Dibuja lo que dice
 * `paginas/disciplina/disciplina/disciplina.html` de app2; lo que cambia con el tiempo lo decide el
 * guion de cada vídeo y llega en `Estado`. Los contadores y los iconos son los del clip promocional.
 *
 * EL DETALLE VA DENTRO DE LA CELDA, como en la aplicación (el promocional lo pinta a lo ancho):
 * aquí la pregunta es «dónde lo pulso», y la respuesta tiene que ser el sitio de verdad.
 */

export interface Estado {
	/** Cuándo entra la pantalla y cuándo empieza a irse. */
	monta: number;
	salidaEn?: number;
	/** El detalle desplegado de la celda de Sara en el periodo 2: qué contador, y desde cuándo. */
	detalle?: { cual: 0 | 2; desde: number; hasta?: number } | null;
	/** Lo que hay dentro en cada momento. */
	uniformes?: (frame: number) => Uniforme[];
	situaciones?: (frame: number) => Situacion[];
	/** Cuánto suma cada contador de la celda de Sara en el periodo 2, en este fotograma. */
	suma?: (frame: number, cual: number) => number;
	/** El contador que el ratón tiene encima (`cual`, o 6 = el detalle). */
	senalado?: (frame: number) => number | null;
	/** El botón del pie que el ratón tiene encima. */
	pieSenalado?: (frame: number) => number | null;
}

export const Rejilla: React.FC<{ estado: Estado }> = ({ estado }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const { monta } = estado;
	const salida = estado.salidaEn ?? 1e9;

	if (frame < monta - 1) { return null; }

	const panel = entra(frame, fps, monta, 14);
	const fuera = interpolate(frame, [salida + 20, salida + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const fueraArriba = seVa(frame, 0, salida, 4);

	const det = estado.detalle ?? null;
	const abierto = det !== null && frame >= det.desde && (det.hasta === undefined || frame < det.hasta + 14);
	const uniformes = estado.uniformes?.(frame) ?? [];
	const situaciones = estado.situaciones?.(frame) ?? [];
	const altoDetalle = det === null ? 0 : det.cual === 0 ? altoDeUniformes(uniformes.length) : altoDeSituaciones(situaciones);
	const abre = !abierto ? 0 : entra(frame, fps, det!.desde, 14) * (det!.hasta === undefined ? 1 : 1 - interpolate(frame, [det!.hasta, det!.hasta + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
	const crece = crecida(altoDetalle) * abre;

	const senalado = estado.senalado?.(frame) ?? null;
	const pieSenalado = estado.pieSenalado?.(frame) ?? null;

	return (
		<div
			style={{
				position: 'absolute',
				left: X_REJILLA,
				top: Y_REJILLA,
				width: R.ancho,
				padding: R.relleno,
				boxSizing: 'border-box',
				borderRadius: 14,
				background: SUPERFICIE,
				boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
				opacity: panel * (1 - fuera),
				transform: `scale(${1 - fuera * 0.02})`,
				color: TEXTO,
			}}
		>
			<div style={{ position: 'absolute', inset: 0, opacity: 1 - fueraArriba, transform: `translateY(${-fueraArriba * 20}px)` }}>
				{/* El título: el grupo, con su abreviatura; a la derecha, los ordinales del manual. */}
				<div style={{ position: 'absolute', top: R.relleno, left: R.relleno, right: R.relleno, height: R.titulo, display: 'flex', alignItems: 'center' }}>
					<span style={{ fontSize: 32, fontWeight: 700 }}>{GRUPO.nombre}</span>
					<span style={{ fontSize: 20, color: TEXTO_TENUE, marginLeft: 12, marginTop: 6 }}>{GRUPO.abrev}</span>
					<span style={{ flex: 1 }} />
					<Boton tenue icono={<IconoLista />}>Ordinales</Boton>
				</div>
				<div style={{ position: 'absolute', top: R.relleno + R.titulo, left: R.relleno, height: R.cuenta, fontSize: 18, color: TEXTO_TENUE }}>{ALUMNOS.length} alumnos · {PERIODOS.length} periodos</div>

				<div style={{ position: 'absolute', top: GEOMETRIA.Y_SELECTOR, left: R.relleno, display: 'flex', gap: 10 }}>
					{GRUPOS.map((g, i) => (
						<BotonDeGrupo key={g.abrev} abrev={g.abrev} titular={g.titular} puesto={i === EL_GRUPO} />
					))}
				</div>

				<div style={{ position: 'absolute', top: GEOMETRIA.Y_BARRA, left: R.relleno, display: 'flex', gap: 10, alignItems: 'center' }}>
					<div style={{ width: 280, height: R.barra, border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', boxSizing: 'border-box', color: TEXTO_TENUE, fontSize: 18 }}>
						<IconoLupa />
						Buscar alumno
					</div>
					<Boton icono={<IconoRecargar />}>Recargar</Boton>
					<Boton icono={<IconoChincheta />}>Nombre fijo</Boton>
					<Boton primario icono={<IconoForma />}>Ir a comportamiento {GRUPO.nombre}</Boton>
				</div>

				{/* La leyenda: los dos grises con su icono, y los tres tipos con su color. */}
				<div style={{ position: 'absolute', top: GEOMETRIA.Y_LEYENDA, left: R.relleno, height: R.leyenda, display: 'flex', gap: 22, alignItems: 'center', fontSize: 18 }}>
					<Leyenda tinte="rgb(128 128 128 / 10%)" borde="#bfbfbf"><IconoUniforme /> Uniforme</Leyenda>
					<Leyenda tinte="rgb(128 128 128 / 10%)" borde="#bfbfbf"><IconoTardanza /> Tardanzas</Leyenda>
					{TIPOS.map((t) => (
						<Leyenda key={t.plural} tinte={t.tinte} borde={t.borde}>{t.plural}</Leyenda>
					))}
				</div>
			</div>

			<div style={{ position: 'absolute', top: Y_TABLA, left: R.relleno, width: ANCHO_TABLA, border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden', background: SUPERFICIE }}>
				<div style={{ display: 'flex', height: R.cabecera, background: 'rgb(128 128 128 / 14%)', borderBottom: `1px solid ${BORDE}`, opacity: 1 - fueraArriba }}>
					{['No', 'Nombres', ...PERIODOS.map((p) => `Periodo ${p}`)].map((t, i) => (
						<div
							key={t}
							style={{
								width: i === 0 ? R.num : i === 1 ? R.nombre : ANCHO_PERIODO,
								display: 'flex',
								alignItems: 'center',
								justifyContent: i === 1 ? 'flex-start' : 'center',
								paddingLeft: i === 1 ? 14 : 0,
								borderRight: i === PERIODOS.length + 1 ? 'none' : `1px solid ${BORDE}`,
								fontSize: 19,
								fontWeight: 600,
								boxSizing: 'border-box',
							}}
						>
							{t}
						</div>
					))}
				</div>

				{ALUMNOS.map((alumno, fila) => {
					const ll = llega(frame, fps, fila, monta + 12, 5);
					const fu = estiloDeSalida(seVa(frame, fila + 1, salida, 3));
					const suya = fila === 0;

					return (
						<div
							key={alumno.nombre}
							style={{
								display: 'flex',
								height: R.fila + (suya ? crece : 0),
								borderBottom: fila === ALUMNOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
								background: fila % 2 === 1 ? 'rgb(128 128 128 / 6%)' : 'transparent',
								opacity: ll.opacidad * fu.opacidad,
								transform: `translate(${ll.x + fu.x}px, ${ll.y}px)`,
								boxSizing: 'border-box',
							}}
						>
							<div style={{ width: R.num, height: R.fila, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${BORDE}`, color: TEXTO_TENUE, fontSize: 19, boxSizing: 'border-box' }}>{fila + 1}</div>
							<div style={{ width: R.nombre, alignSelf: 'stretch', display: 'flex', alignItems: 'flex-start', paddingTop: (R.fila - 40) / 2, gap: 12, paddingLeft: 14, borderRight: `1px solid ${BORDE}`, boxSizing: 'border-box' }}>
								<Avatar tipo={alumno.sexo} variante={fila} tam={40} />
								<span style={{ fontSize: 20, lineHeight: '40px' }}>{alumno.nombre}</span>
							</div>

							{PERIODOS.map((_, p) => {
								const d = alumno.periodos[p];
								const esLa = suya && p === 1;
								const valores = [d.uniformes, d.tardanzas, ...d.tipos].map((v, c) => v + (esLa ? estado.suma?.(frame, c) ?? 0 : 0));

								return (
									<div key={p} style={{ width: ANCHO_PERIODO, alignSelf: 'stretch', borderRight: p === PERIODOS.length - 1 ? 'none' : `1px solid ${BORDE}`, boxSizing: 'border-box', position: 'relative' }}>
										<div style={{ height: R.fila, display: 'flex', alignItems: 'center', gap: R.entre, paddingLeft: 12 }}>
											<Contador valor={valores[0]} ancho={R.menor} icono={<IconoUniforme />} senalado={esLa && senalado === 0} abierto={esLa && abierto && det!.cual === 0} />
											<Contador valor={valores[1]} ancho={R.menor} icono={<IconoTardanza />} senalado={esLa && senalado === 1} />
											<span style={{ width: R.raya, height: 22, borderLeft: `1px solid ${BORDE}`, marginLeft: 5, boxSizing: 'border-box' }} />
											{[0, 1, 2].map((t) => (
												<Contador key={t} valor={valores[2 + t]} ancho={R.tipo} tipo={t} senalado={esLa && senalado === 2 + t} abierto={esLa && abierto && det!.cual === 2 && t === 0} />
											))}
											<Contador valor={0} ancho={R.tipo} nueva senalado={esLa && senalado === 5} />
										</div>

										{esLa && abierto && (
											<div style={{ height: crece, overflow: 'hidden', marginTop: -6 }}>
												<Detalle cual={det!.cual} uniformes={uniformes} situaciones={situaciones} alto={altoDetalle} senalado={senalado === 6} />
											</div>
										)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>

			{/* El pie: «Situaciones por grupo» siempre; los tres observadores, sólo con grupo. */}
			<div
				style={{
					position: 'absolute',
					top: Y_TABLA + R.cabecera + ALUMNOS.length * R.fila + crece + 2 + 18,
					left: R.relleno,
					height: R.pie,
					display: 'flex',
					alignItems: 'center',
					opacity: entra(frame, fps, monta + 40, 12) * (1 - fueraArriba),
				}}
			>
				<span style={{ width: X_PIE, fontSize: 18, color: TEXTO_TENUE }}>Informes · se abren en otra pestaña</span>
				<div style={{ display: 'flex', gap: 10 }}>
					{BOTONES_DEL_PIE.map((b, i) => (
						<Boton key={b} tenue ancho={ANCHOS_DEL_PIE[i]} senalado={pieSenalado === i} icono={i === 0 ? <IconoTabla /> : <IconoPerfil />}>{b}</Boton>
					))}
				</div>
			</div>
			<div style={{ height: Y_TABLA + R.cabecera + ALUMNOS.length * R.fila + crece + 2 + 18 + R.pie - R.relleno }} />
		</div>
	);
};

/* ── Las piezas ───────────────────────────────────────────────────────────────────────────── */

const Contador: React.FC<{
	valor: number; ancho: number; tipo?: number; icono?: React.ReactNode; nueva?: boolean; senalado?: boolean; abierto?: boolean;
}> = ({ valor, ancho, tipo, icono, nueva = false, senalado = false, abierto = false }) => {
	const marcado = valor > 0 && !nueva;
	const t = tipo !== undefined ? TIPOS[tipo] : null;
	return (
		<span
			style={{
				width: ancho,
				height: R.alto,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 3,
				borderRadius: 6,
				fontSize: 17,
				fontWeight: marcado ? 600 : 400,
				border: `1px solid ${abierto ? '#8c8c8c' : nueva ? '#bfbfbf' : marcado ? (t ? t.borde : '#bfbfbf') : 'transparent'}`,
				background: senalado ? `${ACENTO}22` : abierto ? 'rgb(128 128 128 / 14%)' : marcado ? (t ? t.tinte : 'rgb(128 128 128 / 10%)') : 'transparent',
				color: nueva ? ACENTO : marcado ? (t ? t.legible : TEXTO) : TEXTO_TENUE,
				boxSizing: 'border-box',
				flexShrink: 0,
			}}
		>
			{icono}
			{nueva ? '+' : valor}
		</span>
	);
};

const Detalle: React.FC<{ cual: 0 | 2; uniformes: Uniforme[]; situaciones: Situacion[]; alto: number; senalado: boolean }> = ({
	cual, uniformes, situaciones, alto, senalado,
}) => {
	const t = TIPOS[0];
	const borde = cual === 0 ? '#8c8c8c' : t.fuerte;
	return (
		<div
			style={{
				margin: '0 10px',
				height: alto,
				padding: `${R.detalleRelleno}px 12px`,
				boxSizing: 'border-box',
				borderLeft: `3px solid ${borde}`,
				background: senalado ? `${ACENTO}14` : cual === 0 ? 'rgb(128 128 128 / 8%)' : t.tinte,
				borderRadius: '0 6px 6px 0',
				fontSize: 16,
				lineHeight: `${R.renglon}px`,
			}}
		>
			<div style={{ height: R.detalleTitulo, fontWeight: 600, color: cual === 0 ? TEXTO : t.legible }}>
				{cual === 0 ? 'Uniforme / Cam' : t.plural}
			</div>
			{cual === 0 && uniformes.map((u) => (
				<div key={u.fecha} style={{ height: FILA_UNIFORME, display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ color: TEXTO_TENUE }}>{u.fecha}</span>
					{u.cortas.map((c) => <Etiqueta key={c}>{c}</Etiqueta>)}
				</div>
			))}
			{cual === 2 && situaciones.map((s) => (
				<div key={s.fecha + s.descripcion} style={{ marginBottom: 6 }}>
					<div><span style={{ fontWeight: 600 }}>{s.fecha}:</span> {s.descripcion}</div>
					{s.ordinales.map((o) => (
						<div key={o} style={{ color: t.legible }}><IconoLista tam={13} /> {o}</div>
					))}
				</div>
			))}
		</div>
	);
};

export const Etiqueta: React.FC<{ children: React.ReactNode; verde?: boolean; grande?: boolean }> = ({ children, verde = false, grande = false }) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			height: grande ? 28 : 22,
			padding: '0 8px',
			borderRadius: 4,
			fontSize: grande ? 17 : 14,
			border: `1px solid ${verde ? '#b7eb8f' : '#91caff'}`,
			background: verde ? '#f6ffed' : '#e6f4ff',
			color: verde ? '#389e0d' : '#0958d9',
		}}
	>
		{children}
	</span>
);

const Leyenda: React.FC<{ tinte: string; borde: string; children: React.ReactNode }> = ({ tinte, borde, children }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: TEXTO }}>
		<span style={{ width: 16, height: 16, borderRadius: 4, background: tinte, border: `1px solid ${borde}`, boxSizing: 'border-box' }} />
		{children}
	</span>
);

export const Boton: React.FC<{
	children: React.ReactNode; icono?: React.ReactNode; primario?: boolean; tenue?: boolean; ancho?: number; senalado?: boolean; alto?: number; peligro?: boolean;
}> = ({ children, icono, primario = false, tenue = false, ancho, senalado = false, alto = 40, peligro = false }) => (
	<span
		style={{
			height: alto,
			width: ancho,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			padding: ancho ? 0 : '0 16px',
			borderRadius: 7,
			fontSize: 18,
			fontWeight: primario ? 600 : 400,
			border: `1px solid ${primario ? ACENTO : peligro ? '#ff4d4f' : senalado ? ACENTO : BORDE}`,
			background: primario ? ACENTO : senalado ? `${ACENTO}14` : tenue ? '#fafafa' : SUPERFICIE,
			color: primario ? '#fff' : peligro ? '#ff4d4f' : senalado ? ACENTO : tenue ? '#595959' : TEXTO,
			boxShadow: senalado ? `0 0 0 3px ${ACENTO}22` : 'none',
			boxSizing: 'border-box',
			whiteSpace: 'nowrap',
			flexShrink: 0,
		}}
	>
		{icono}
		{children}
	</span>
);

export const BotonDeGrupo: React.FC<{ abrev: string; titular: boolean; puesto: boolean; senalado?: boolean; alto?: number; ancho?: number }> = ({
	abrev, titular, puesto, senalado = false, alto = R.selector, ancho = 74,
}) => (
	<span
		style={{
			width: ancho,
			height: alto,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 5,
			borderRadius: 7,
			fontSize: 18,
			fontWeight: puesto ? 600 : 400,
			border: `1px solid ${puesto || senalado ? ACENTO : BORDE}`,
			background: puesto ? ACENTO : senalado ? `${ACENTO}14` : SUPERFICIE,
			color: puesto ? '#fff' : senalado ? ACENTO : TEXTO,
			boxSizing: 'border-box',
		}}
	>
		{titular && <IconoEstrella color={puesto ? '#fff' : '#faad14'} />}
		{abrev}
	</span>
);

/* ── Iconos de Ant, dibujados ─────────────────────────────────────────────────────────────── */

const trazo = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconoLista: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ verticalAlign: '-2px' }} aria-hidden><path d="M9 6h11M9 12h11M9 18h11" {...trazo} /><path d="M4 5v3M3.5 12h1.5l-1.5 2h1.5M3.5 17h1.5v2h-1.5" {...trazo} strokeWidth={1.4} /></svg>
);
export const IconoRecargar: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M20 12a8 8 0 1 1-2.3-5.6" {...trazo} /><path d="M20 4v5h-5" {...trazo} /></svg>
);
const IconoChincheta: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" {...trazo} /><circle cx="12" cy="11" r="2.2" {...trazo} /></svg>
);
const IconoForma: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M5 3h10l4 4v14H5z" {...trazo} /><path d="M9 11h6M9 15h4" {...trazo} /></svg>
);
const IconoLupa: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="6.5" {...trazo} /><path d="M16 16l4.5 4.5" {...trazo} /></svg>
);
export const IconoTabla: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" {...trazo} /><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10" {...trazo} /></svg>
);
export const IconoPerfil: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" {...trazo} /><circle cx="9" cy="11" r="2" {...trazo} /><path d="M6 16.5c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4M14 14h4" {...trazo} /></svg>
);
export const IconoMas: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14" {...trazo} strokeWidth={2.4} /></svg>
);
export const IconoLapiz: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M4 20h4L19 9l-4-4L4 16z" {...trazo} /></svg>
);
export const IconoPapelera: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13" {...trazo} /></svg>
);
export const IconoVisto: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" {...trazo} strokeWidth={2.4} /></svg>
);
const IconoEstrella: React.FC<{ color: string }> = ({ color }) => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill={color} /></svg>
);

/** El texto de la pista sin grupo, para quien lo necesite fuera. */
export const ORDINAL_TEXTO = (i: number) => `${ORDINALES[i].tipo} - ${ORDINALES[i].ordinal}. ${ORDINALES[i].descripcion}`;
export const ORDINAL_DETALLE = (i: number) => `${ORDINALES[i].tipo} ${ORDINALES[i].ordinal}. ${ORDINALES[i].descripcion}`;
