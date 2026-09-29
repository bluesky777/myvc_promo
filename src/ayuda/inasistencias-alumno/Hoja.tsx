import React from 'react';

import { COLEGIO } from '../colegio';
import { PAPEL } from '../cierre-6/Papel';
import { SEPTIMO_A, TITULAR_7A, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «INASISTENCIAS POR ALUMNO» (`inasistencias-alumno.html`), carta apaisada: el membrete, la tabla de
 * trece columnas --#, Estudiante, Matr., Celular, P1-P4, Faltas, %, Segu., Desde, Tard., S/f.--, el
 * pie con lo que se contó y lo que no, y las dos firmas. El «%» va vacío hasta que se teclean los
 * días de clase; con umbral, las filas que lo alcanzan llevan «!». Todo inventado: los celulares
 * llevan el 555, que no es de nadie.
 */

export const HOJA = { ancho: 1056, alto: 816 };

export interface FilaInasistencias {
	nombre: string;
	matricula: string;
	celular: string;
	porPeriodo: [number, number, number, number];
	tardanzas: number;
	seguidas: number;
	desde: string;
	sinFecha: number;
}

const DATOS: [number[], number, number, string, number][] = [
	[[1, 1, 1], 1, 1, '', 0],
	[[0, 2, 1], 1, 2, '2026-05-18', 0],
	[[0, 0, 0], 0, 0, '', 0],
	[[2, 1, 0], 0, 2, '2026-03-09', 0],
	[[0, 0, 1], 2, 1, '', 0],
	[[0, 0, 0], 0, 0, '', 0],
	[[3, 4, 4], 2, 4, '2026-08-24', 1],
	[[1, 0, 0], 0, 1, '', 0],
	[[0, 1, 2], 3, 2, '2026-09-14', 0],
	[[0, 0, 0], 1, 0, '', 0],
	[[2, 1, 1], 0, 1, '', 0],
	[[0, 0, 0], 0, 0, '', 0],
	[[2, 3, 3], 3, 3, '2026-06-02', 0],
	[[0, 0, 0], 0, 0, '', 0],
	[[1, 1, 0], 1, 1, '', 0],
	[[0, 0, 1], 0, 1, '', 0],
	[[1, 0, 0], 4, 1, '', 0],
	[[0, 0, 0], 0, 0, '', 0],
	[[0, 2, 0], 0, 2, '2026-05-04', 0],
	[[0, 1, 0], 0, 1, '', 0],
];

export const FILAS: FilaInasistencias[] = SEPTIMO_A.map((a, i) => {
	const [p, tard, seg, desde, sf] = DATOS[i];
	return {
		nombre: nombreDe(a),
		matricula: String(412 + i * 7).padStart(4, '0'),
		celular: `3${String(10 + ((i * 7) % 30)).padStart(2, '0')} 555 ${String(1000 + i * 37).slice(-4)}`,
		porPeriodo: [p[0], p[1], p[2], 0],
		tardanzas: tard,
		seguidas: seg,
		desde,
		sinFecha: sf,
	};
});

export const faltasDe = (f: FilaInasistencias) => f.porPeriodo.reduce((a, b) => a + b, 0) + f.sinFecha;
/** `porcentaje()` de `cuentas-de-inasistencias.ts:193`: redondeado, y nulo sin días de clase. */
export const porcentaje = (faltas: number, dias: number | null) => (dias ? Math.round((faltas / dias) * 100) : null);

/* ── Geometría (px de la hoja) ─────────────────────────────────────────────────────────────── */

export const G = { pad: 30, membrete: 58, cab: 26, fila: 23, pie: 118 };
export const COL = { n: 26, alumno: 250, matr: 50, celular: 110, per: 38, faltas: 56, pct: 44, segu: 48, desde: 96, tard: 46, sf: 40 };
export const COLUMNAS: { clave: keyof typeof COL | 'p'; rotulo: string; ancho: number }[] = [
	{ clave: 'n', rotulo: '#', ancho: COL.n },
	{ clave: 'alumno', rotulo: 'Estudiante', ancho: COL.alumno },
	{ clave: 'matr', rotulo: 'Matr.', ancho: COL.matr },
	{ clave: 'celular', rotulo: 'Celular', ancho: COL.celular },
	{ clave: 'p', rotulo: 'P1', ancho: COL.per },
	{ clave: 'p', rotulo: 'P2', ancho: COL.per },
	{ clave: 'p', rotulo: 'P3', ancho: COL.per },
	{ clave: 'p', rotulo: 'P4', ancho: COL.per },
	{ clave: 'faltas', rotulo: 'Faltas', ancho: COL.faltas },
	{ clave: 'pct', rotulo: '%', ancho: COL.pct },
	{ clave: 'segu', rotulo: 'Segu.', ancho: COL.segu },
	{ clave: 'desde', rotulo: 'Desde', ancho: COL.desde },
	{ clave: 'tard', rotulo: 'Tard.', ancho: COL.tard },
	{ clave: 'sf', rotulo: 'S/f.', ancho: COL.sf },
];
export const ANCHO_TABLA = COLUMNAS.reduce((a, c) => a + c.ancho, 0);
export const X_TABLA = (HOJA.ancho - ANCHO_TABLA) / 2;
export const Y_TABLA = G.pad + G.membrete + 12;
export const yFila = (i: number) => Y_TABLA + G.cab + i * G.fila;
export const Y_PIE = yFila(FILAS.length) + 12;
export const xColumna = (i: number) => X_TABLA + COLUMNAS.slice(0, i).reduce((a, c) => a + c.ancho, 0);
export const COL_PCT = COLUMNAS.findIndex((c) => c.clave === 'pct');

const borde = `0.8px solid ${PAPEL.azulSuave}`;

export const HojaInasistencias: React.FC<{ dias: number | null; umbral: number | null }> = ({ dias, umbral }) => (
	<div style={{ width: HOJA.ancho, height: HOJA.alto, boxSizing: 'border-box', padding: G.pad, background: '#fff', color: '#000', position: 'relative', boxShadow: '0 16px 44px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)' }}>
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: G.membrete, borderBottom: `1.5px solid ${PAPEL.azul}`, boxSizing: 'border-box' }}>
			<div style={{ lineHeight: 1.35 }}>
				<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>{COLEGIO.nombre}</div>
				<div style={{ fontSize: 15, fontWeight: 700 }}>Inasistencias por alumno · sólo faltas a la institución</div>
			</div>
			<div style={{ textAlign: 'right', fontSize: 12, lineHeight: 1.35 }}>
				<div style={{ fontWeight: 700, fontSize: 13.5 }}>7°A</div>
				<div>{TITULAR_7A}</div>
				<div>2026</div>
			</div>
		</div>
		<div style={{ position: 'absolute', left: X_TABLA, top: Y_TABLA, width: ANCHO_TABLA, border: borde, fontSize: 11.5 }}>
			<div style={{ display: 'flex', height: G.cab, background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700 }}>
				{COLUMNAS.map((c, i) => (
					<span
						key={i}
						style={{
							width: c.ancho,
							flexShrink: 0,
							boxSizing: 'border-box',
							borderRight: i < COLUMNAS.length - 1 ? borde : 'none',
							display: 'flex',
							alignItems: 'center',
							justifyContent: c.clave === 'alumno' || c.clave === 'celular' || c.clave === 'desde' ? 'flex-start' : 'center',
							paddingLeft: c.clave === 'alumno' || c.clave === 'celular' || c.clave === 'desde' ? 5 : 0,
							background: c.clave === 'faltas' ? '#c9daee' : undefined,
						}}
					>
						{c.rotulo}
					</span>
				))}
			</div>
			{FILAS.map((f, i) => {
				const faltas = faltasDe(f);
				const pct = porcentaje(faltas, dias);
				const marcada = pct !== null && umbral !== null && umbral > 0 && pct >= umbral;
				const valores = [
					String(i + 1),
					f.nombre,
					f.matricula,
					f.celular,
					...f.porPeriodo.map((n) => (n ? String(n) : '')),
					faltas ? String(faltas) : '',
					pct === null ? '' : String(pct),
					f.seguidas > 1 ? String(f.seguidas) : '',
					f.seguidas > 1 ? f.desde : '',
					f.tardanzas ? String(f.tardanzas) : '',
					f.sinFecha ? String(f.sinFecha) : '',
				];
				return (
					<div key={f.nombre} style={{ display: 'flex', height: G.fila, borderTop: borde, background: marcada ? '#fdecea' : i % 2 ? '#f6f9fc' : '#fff' }}>
						{COLUMNAS.map((c, k) => (
							<span
								key={k}
								style={{
									width: c.ancho,
									flexShrink: 0,
									boxSizing: 'border-box',
									borderRight: k < COLUMNAS.length - 1 ? borde : 'none',
									display: 'flex',
									alignItems: 'center',
									justifyContent: c.clave === 'alumno' || c.clave === 'celular' || c.clave === 'desde' ? 'flex-start' : 'center',
									paddingLeft: c.clave === 'alumno' || c.clave === 'celular' || c.clave === 'desde' ? 5 : 0,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									fontWeight: c.clave === 'faltas' ? 700 : 400,
									background: c.clave === 'faltas' ? 'rgba(201,218,238,.35)' : undefined,
									color: c.clave === 'celular' || c.clave === 'matr' ? PAPEL.gris : '#000',
								}}
							>
								{c.clave === 'alumno' && marcada && <b style={{ color: PAPEL.rojo, marginRight: 5 }}>!</b>}
								{valores[k]}
							</span>
						))}
					</div>
				);
			})}
		</div>
		{/* El pie: lo que se contó y lo que no, y las firmas. */}
		<div style={{ position: 'absolute', left: X_TABLA, top: Y_PIE, width: ANCHO_TABLA, display: 'flex', gap: 24, fontSize: 10.5, lineHeight: 1.45 }}>
			<ul style={{ margin: 0, paddingLeft: 16, flex: 1 }}>
				<li>
					<b>Sólo faltas registradas en la portería.</b> Las que el docente anota en su planilla de clase <b>no las ve este listado</b>, y en muchos colegios son casi todas: si aquí sale cero, compruébelo antes de decidir nada.
				</li>
				<li>
					<b>Se cuentan registros</b>, no cantidades: cada fila de asistencia es una falta.
				</li>
				<li>
					<b>«Segu.»</b> es la racha más larga de días hábiles seguidos. Salta sábados y domingos; <b>los festivos no</b>, porque el sistema no tiene calendario de días no lectivos — una racha puede venir inflada por un puente.
				</li>
				<li>
					<b>«S/f.»</b> son faltas registradas sin día. Cuentan en el total y no pueden entrar en ninguna racha.
				</li>
				{dias ? (
					<li>
						El <b>%</b> está calculado sobre <b>{dias}</b> días de clase.
					</li>
				) : (
					<li>
						La columna <b>%</b> va vacía: no se indicaron los días de clase del periodo.
					</li>
				)}
				{umbral ? (
					<li>
						Marcadas con <b>!</b> las filas que llegan o pasan del <b>{umbral} %</b>.
					</li>
				) : null}
			</ul>
			<div style={{ width: 300, display: 'flex', gap: 24, paddingTop: 50 }}>
				{[TITULAR_7A, ''].map((n, i) => (
					<div key={i} style={{ flex: 1, textAlign: 'center', borderTop: `1px solid ${PAPEL.linea}`, paddingTop: 3 }}>
						{n && <div style={{ fontSize: 10, fontWeight: 700 }}>{n}</div>}
						<div style={{ fontSize: 10, color: PAPEL.gris }}>{i === 0 ? 'Titular del grupo' : 'Coordinación'}</div>
					</div>
				))}
			</div>
		</div>
	</div>
);
