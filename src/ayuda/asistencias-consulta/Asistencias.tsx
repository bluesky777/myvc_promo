import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, escribiendo, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MEDIDAS } from '../medidas';
import { FUENTE } from '../tema';
import { BotonDeGrupo } from '../disciplina/Rejilla';
import { Alerta, Btn } from '../rubricas-montar/Rubricas';
import { Icono } from '../montar-el-ano/ant';
import { COL, FILAS, Ficha, GRUPOS, PG, SIN_GRUPO, TEXTOS, UTIL, plano } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE ASISTENCIAS (`paginas/asistencias/asistencias.html`). Dos piezas: la página sin
 * grupo dentro de la cáscara (título, grupos y el `nz-empty` que dice qué hacer), y la página con
 * 9B a pantalla completa, como la rejilla de disciplina.
 */

export const SinGrupo: React.FC<{ senalado: boolean; puesto: boolean }> = ({ senalado, puesto }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const s = SIN_GRUPO;
	const resto = entra(frame, fps, 20, 12);

	return (
		<div style={{ position: 'relative', width: MEDIDAS.ancho - MEDIDAS.menu, height: '100%', padding: `${s.arriba}px ${s.lados}px`, boxSizing: 'border-box', color: TEXTO, fontFamily: FUENTE }}>
			<div style={{ height: s.titulo, display: 'flex', alignItems: 'center' }}>
				<span style={{ fontSize: 28, fontWeight: 700, whiteSpace: 'pre' }}>
					{escrito(frame, TEXTOS.titulo, 4, 1)}
					<span style={{ opacity: escribiendo(frame, TEXTOS.titulo, 4, 1) && frame % 20 < 12 ? 1 : 0 }}>|</span>
				</span>
			</div>
			<div style={{ position: 'absolute', top: s.arriba + s.selector.y, left: s.lados, display: 'flex', gap: s.selector.hueco, opacity: resto }}>
				{GRUPOS.map((g) => (
					<BotonDeGrupo key={g.abrev} abrev={g.abrev} titular={g.titular} puesto={puesto && g.abrev === '9B'} senalado={senalado && g.abrev === '9B'} alto={s.selector.alto} ancho={s.selector.ancho} />
				))}
			</div>
			{/* El `nz-empty`: la caja vacía dibujada y la frase. */}
			<div style={{ position: 'absolute', top: s.arriba + s.vacio, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: resto }}>
				<svg width="64" height="41" viewBox="0 0 64 41">
					<ellipse cx="32" cy="33" rx="32" ry="7" fill="#f5f5f5" />
					<path d="M55 13.3 44.9 1.9A2.6 2.6 0 0 0 43 1H21c-.7 0-1.4.4-1.9.9L9 13.3V23h46z" fill="none" stroke="#d9d9d9" />
					<path d="M9 13.3h11.2c1.2 0 2 1 2 2.3 0 1.2.8 2.2 2 2.2h15.6c1.2 0 2-1 2-2.2 0-1.3.8-2.3 2-2.3H55V30c0 1.5-1 2.8-2.2 2.8H11.2C10 32.8 9 31.5 9 30z" fill="#fafafa" stroke="#d9d9d9" />
				</svg>
				<span style={{ fontSize: 16, color: TEXTO_TENUE }}>{TEXTOS.vacio}</span>
			</div>
		</div>
	);
};

/* ── La página con el grupo ───────────────────────────────────────────────────────────────── */

export interface EstadoAsistencias {
	cerrado: boolean;
	/** Lo escrito en la casilla de ausencias a la institución de una fila, mientras se teclea. */
	contador: { fila: number; valor: string; foco: boolean } | null;
	/** Las faltas de la institución que ya volvieron del servidor, añadidas a las de partida. */
	nuevas: { fila: number; ficha: Ficha }[];
}

const F = PG.letra;

export const PanelAsistencias: React.FC<{ e: EstadoAsistencias }> = ({ e }) => {
	const p = plano(e.cerrado);
	return (
		<div
			style={{
				position: 'relative',
				width: PG.ancho,
				height: plano(true).alto,
				borderRadius: 14,
				background: SUPERFICIE,
				boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
				fontFamily: FUENTE,
				color: TEXTO,
			}}
		>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.titulo, height: PG.titulo, display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700 }}>
				{TEXTOS.titulo}
			</div>

			{e.cerrado && (
				<Alerta top={p.alerta} tipo="info" mensaje={TEXTOS.bloqueado} ancho={UTIL}>
					{TEXTOS.bloqueadoDetalle}
				</Alerta>
			)}

			<div style={{ position: 'absolute', left: PG.relleno, top: p.grupos, display: 'flex', gap: 10 }}>
				{GRUPOS.map((g) => <BotonDeGrupo key={g.abrev} abrev={g.abrev} titular={g.titular} puesto={g.abrev === '9B'} alto={PG.grupos} ancho={84} />)}
			</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: p.mandos, display: 'flex', gap: 12 }}>
				<div style={{ width: 360, height: PG.mandos, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: F, color: 'rgba(0,0,0,0.3)' }}>
					{TEXTOS.buscar}
				</div>
				<Btn texto={TEXTOS.verClases} tipo="primary" />
				<Btn texto={TEXTOS.verInstitucion} tipo="primary" />
			</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: p.cuantos, fontSize: F - 2, color: TEXTO_TENUE }}>{TEXTOS.cuantos}</div>

			<Tabla e={e} top={p.tabla} />
		</div>
	);
};

const Tabla: React.FC<{ e: EstadoAsistencias; top: number }> = ({ e, top }) => {
	const celda: React.CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', flex: 'none', borderRight: `1px solid ${BORDE}` };
	return (
		<div style={{ position: 'absolute', left: PG.relleno, top, width: UTIL, border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden' }}>
			<div style={{ display: 'flex', height: PG.cabecera, background: 'rgb(128 128 128 / 8%)', borderBottom: `1px solid ${BORDE}`, fontSize: F - 2, fontWeight: 600 }}>
				<div style={{ ...celda, width: COL.num, justifyContent: 'center' }}>No</div>
				<div style={{ ...celda, width: COL.alumno, padding: '0 14px' }}>Alumno</div>
				<div style={{ ...celda, width: COL.info }} />
				{TEXTOS.columnas.map((t, c) => (
					<div key={t} style={{ ...celda, width: COL.falta, padding: '0 14px', lineHeight: 1.2, borderRight: c === 3 ? 'none' : celda.borderRight }}>{t}</div>
				))}
			</div>

			{FILAS.map((a, i) => {
				const nuevas = e.nuevas.filter((n) => n.fila === i).map((n) => n.ficha);
				const listas = [a.ausenciasClase, a.tardanzasClase, [...a.ausencias, ...nuevas], a.tardanzas];
				return (
					<div key={a.nombre} style={{ display: 'flex', height: PG.fila, borderBottom: i === FILAS.length - 1 ? 'none' : `1px solid ${BORDE}`, background: i % 2 ? 'rgb(128 128 128 / 5%)' : 'transparent' }}>
						<div style={{ ...celda, width: COL.num, justifyContent: 'center', color: TEXTO_TENUE, fontSize: F - 1 }}>{i + 1}</div>
						<div style={{ ...celda, width: COL.alumno, padding: '0 14px', gap: 12, fontSize: F - 1 }}>
							<Avatar tipo={a.sexo} variante={i} tam={34} />
							{a.nombre}
						</div>
						<div style={{ ...celda, width: COL.info, justifyContent: 'center' }}>
							<Icono cual="info" tam={20} color={TEXTO_TENUE} />
						</div>
						{listas.map((l, c) => {
							const institucion = c >= 2;
							const escribiendo = institucion && c === 2 && e.contador?.fila === i ? e.contador : null;
							return (
								<div key={c} style={{ ...celda, width: COL.falta, padding: '0 12px', gap: 6, flexWrap: 'wrap', alignContent: 'center', borderRight: c === 3 ? 'none' : celda.borderRight }}>
									{institucion
										? <Contador valor={escribiendo ? escribiendo.valor : String(l.length)} foco={escribiendo?.foco ?? false} apagado={e.cerrado} />
										: <span style={{ fontSize: F - 1, fontWeight: 600, minWidth: 18, color: l.length ? TEXTO : TEXTO_TENUE }}>{l.length}</span>}
									{l.map((f, k) => <Chip key={k} f={f} />)}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

const Contador: React.FC<{ valor: string; foco: boolean; apagado: boolean }> = ({ valor, foco, apagado }) => (
	<span
		style={{
			width: 64,
			height: 40,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : 'none',
			borderRadius: 6,
			background: apagado ? '#f5f5f5' : SUPERFICIE,
			color: apagado ? 'rgba(0,0,0,0.25)' : TEXTO,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: F - 1,
			fontVariantNumeric: 'tabular-nums',
			marginRight: 4,
		}}
	>
		{valor}
		{foco && <span style={{ marginLeft: 1 }}>|</span>}
	</span>
);

const Chip: React.FC<{ f: Ficha }> = ({ f }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 7px', borderRadius: 6, background: 'rgba(0,0,0,0.05)', fontSize: F - 5, whiteSpace: 'nowrap' }}>
		{f.alias && <b>{f.alias}:</b>}
		{f.fecha}
	</span>
);
