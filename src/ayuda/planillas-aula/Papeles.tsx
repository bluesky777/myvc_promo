import React from 'react';

import { COLEGIO } from '../colegio';
import { Escudo, PAPEL } from '../cierre-6/Papel';
import { SEPTIMO_A, TITULAR_7A, nombreDe } from '../informes/gente';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS DOS PAPELES DEL AULA, en oficio apaisado:
 *
 *   · LA PLANILLA DEL GRUPO (`tabla-planilla.html`): membrete «Planilla de trabajo Per3-2026 7°A -
 *     matemáticas», No, Alumnos, las definitivas P1-P4 con el promedio del grupo debajo, y 22
 *     casillas en blanco: las de los bloques del plan de evaluación --repartidas como
 *     `repartirCasillas`, 20 entre los bloques-- con su porcentaje, y 2 al final para extras.
 *   · EL CONTROL DE ASISTENCIA A CLASE (`control-planilla.html`): una hoja por grupo, «Control de
 *     asistencia a clase 2026», y una columna por día hábil del mes elegido; con «Sin días», 21 en
 *     blanco y sin fecha.
 *
 * Los bloques, sus textos y las notas son inventados.
 */

export const OFICIO = { ancho: 1248, alto: 816 };

export const BLOQUES = [
	{ definicion: 'Resuelve problemas con números enteros', porcentaje: 40, casillas: 7, subs: [15, 15, 10, 20, 20, 10, 10] },
	{ definicion: 'Plantea y resuelve ecuaciones de primer grado', porcentaje: 35, casillas: 7, subs: [20, 20, 20, 15, 15, 10] },
	{ definicion: 'Interpreta información en tablas y gráficas', porcentaje: 25, casillas: 6, subs: [25, 25, 25, 25] },
];
export const EXTRAS = 2;

/** Las definitivas de 7°A en Matemáticas, periodos 1 a 3 (el 4 aún no tiene). Las del periodo 3 de Juan Pablo y María José son las de su semáforo (58 y 76). */
const DEFINITIVAS = [[80, 76, 58], [86, 83, 76], [91, 93, 92], [70, 64, 66], [87, 88, 88], [95, 96, 95], [60, 52, 55], [82, 80, 81], [75, 72, 74], [88, 90, 89], [62, 55, 58], [85, 87, 86], [78, 76, 77], [89, 91, 90], [72, 69, 70], [84, 82, 83], [80, 78, 79], [86, 88, 87], [73, 71, 72], [92, 94, 93]];

export const P = { pad: 26, membrete: 70, cab1: 40, cab2: 24, fila: 25, no: 26, alumno: 214, per: 40, casilla: 34 };
export const X_TABLA = P.pad;
export const Y_TABLA = P.pad + P.membrete + 8;
export const X_CASILLAS = X_TABLA + P.no + P.alumno + P.per * 4;
export const ANCHO_BLOQUES = (BLOQUES.reduce((a, b) => a + b.casillas, 0) + EXTRAS) * P.casilla;

const borde = `0.8px solid ${PAPEL.azulSuave}`;
const caja = (ancho: number, alto: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	width: ancho,
	height: alto,
	flexShrink: 0,
	boxSizing: 'border-box',
	borderRight: borde,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	...extra,
});

const promedio = (j: number) => Math.round((DEFINITIVAS.reduce((a, d) => a + d[j], 0) / DEFINITIVAS.length) * 10) / 10;

export const PlanillaGrupo: React.FC = () => {
	const alto = P.cab1 + P.cab2;
	return (
		<div style={{ width: OFICIO.ancho, height: OFICIO.alto, boxSizing: 'border-box', padding: P.pad, background: '#fff', color: '#000', position: 'relative', boxShadow: '0 16px 44px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 14, height: P.membrete }}>
				<Escudo tam={56} />
				<div style={{ lineHeight: 1.35 }}>
					<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>
						{COLEGIO.nombre} - {COLEGIO.abreviatura}
					</div>
					<div style={{ fontSize: 15 }}>
						Planilla de trabajo Per3-2026 <b>7°A - matemáticas</b>
					</div>
					<div style={{ fontSize: 12, color: PAPEL.gris }}>{TITULAR_7A}</div>
				</div>
			</div>
			<div style={{ position: 'absolute', left: X_TABLA, top: Y_TABLA, border: borde, fontSize: 12 }}>
				<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700 }}>
					<span style={caja(P.no, alto)}>No</span>
					<span style={caja(P.alumno, alto, { justifyContent: 'flex-start', paddingLeft: 6 })}>Alumnos</span>
					{[1, 2, 3, 4].map((p, j) => (
						<span key={p} style={{ ...caja(P.per, alto), flexDirection: 'column', lineHeight: 1.2 }}>
							<span>P{p}</span>
							<span style={{ fontSize: 10, fontWeight: 400, color: PAPEL.gris }}>{j < 3 ? promedio(j) : ''}</span>
						</span>
					))}
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div style={{ display: 'flex' }}>
							{BLOQUES.map((b, i) => (
								<span
									key={b.definicion}
									style={{ ...caja(b.casillas * P.casilla, P.cab1, { borderBottom: borde, padding: '0 5px', justifyContent: 'space-between', gap: 6, fontSize: 10.5, lineHeight: 1.15 }) }}
								>
									<span style={{ textAlign: 'left' }}>
										{i + 1}. {b.definicion}
									</span>
									<span style={{ fontWeight: 400, color: PAPEL.azul }}>{b.porcentaje}%</span>
								</span>
							))}
							<span style={caja(EXTRAS * P.casilla, P.cab1, { borderBottom: borde, borderRight: 'none' })}>{BLOQUES.length + 1}.</span>
						</div>
						<div style={{ display: 'flex' }}>
							{BLOQUES.flatMap((b) =>
								Array.from({ length: b.casillas }, (_, i) => (
									<span key={`${b.definicion}-${i}`} style={{ ...caja(P.casilla, P.cab2, { flexDirection: 'column', lineHeight: 1, fontSize: 10.5 }) }}>
										{i < b.subs.length ? i + 1 : ''}
										{i < b.subs.length && <span style={{ fontSize: 8, fontWeight: 400 }}>{b.subs[i]}%</span>}
									</span>
								)),
							)}
							{Array.from({ length: EXTRAS }, (_, i) => (
								<span key={`x${i}`} style={caja(P.casilla, P.cab2, { borderRight: i === EXTRAS - 1 ? 'none' : borde, fontSize: 10.5 })}>
									{i + 1}
								</span>
							))}
						</div>
					</div>
				</div>
				{SEPTIMO_A.map((a, i) => (
					<div key={a.apellidos} style={{ display: 'flex', borderTop: borde, background: i % 2 ? '#f4f8fc' : '#fff' }}>
						<span style={caja(P.no, P.fila, { color: PAPEL.gris })}>{i + 1}</span>
						<span style={caja(P.alumno, P.fila, { justifyContent: 'flex-start', paddingLeft: 6, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 11.5 })}>{nombreDe(a)}</span>
						{[0, 1, 2, 3].map((j) => (
							<span key={j} style={caja(P.per, P.fila, { color: j < 3 && DEFINITIVAS[i][j] < 60 ? PAPEL.rojo : '#000' })}>
								{j < 3 ? DEFINITIVAS[i][j] : ''}
							</span>
						))}
						{Array.from({ length: ANCHO_BLOQUES / P.casilla }, (_, k) => (
							<span key={k} style={caja(P.casilla, P.fila, { borderRight: k === ANCHO_BLOQUES / P.casilla - 1 ? 'none' : borde })} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};

/* ── El control de asistencia a clase ─────────────────────────────────────────────────────── */

/** Los días hábiles de septiembre de 2026 (`diasHabiles`: lunes a viernes, sin festivos). */
export const DIAS_SEPTIEMBRE = [1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 28, 29, 30];

export const C = { pad: 26, membrete: 70, cab1: 24, cab2: 24, fila: 25, no: 26, alumno: 230 };
export const Y_TABLA_C = C.pad + C.membrete + 8;

export const ControlClase: React.FC<{ mes: string; dias: number[] | null }> = ({ mes, dias }) => {
	const columnas = dias ? dias.length : 21;
	const ancho = (OFICIO.ancho - C.pad * 2 - C.no - C.alumno - 2) / columnas;
	return (
		<div style={{ width: OFICIO.ancho, height: OFICIO.alto, boxSizing: 'border-box', padding: C.pad, background: '#fff', color: '#000', position: 'relative', boxShadow: '0 16px 44px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 14, height: C.membrete }}>
				<Escudo tam={56} />
				<div style={{ lineHeight: 1.35 }}>
					<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>
						{COLEGIO.nombre} - {COLEGIO.abreviatura}
					</div>
					<div style={{ fontSize: 15, fontWeight: 700 }}>Control de asistencia a clase 2026</div>
					<div style={{ fontSize: 12.5 }}>
						<b>7°A</b> — {TITULAR_7A}
					</div>
				</div>
			</div>
			<div style={{ position: 'absolute', left: C.pad, top: Y_TABLA_C, border: borde, fontSize: 12 }}>
				<div style={{ display: 'flex', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700 }}>
					<span style={caja(C.no, C.cab1 + C.cab2)}>No</span>
					<span style={caja(C.alumno, C.cab1 + C.cab2, { justifyContent: 'flex-start', paddingLeft: 6 })}>Alumnos</span>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<span style={caja(ancho * columnas, C.cab1, { borderBottom: borde, borderRight: 'none' })}>{mes}</span>
						<div style={{ display: 'flex' }}>
							{Array.from({ length: columnas }, (_, k) => (
								<span key={k} style={caja(ancho, C.cab2, { borderRight: k === columnas - 1 ? 'none' : borde, fontSize: 10.5 })}>
									{dias ? dias[k] : ''}
								</span>
							))}
						</div>
					</div>
				</div>
				{SEPTIMO_A.map((a, i) => (
					<div key={a.apellidos} style={{ display: 'flex', borderTop: borde }}>
						<span style={caja(C.no, C.fila, { color: PAPEL.gris })}>{i + 1}</span>
						<span style={caja(C.alumno, C.fila, { justifyContent: 'flex-start', paddingLeft: 6, whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 11.5 })}>{nombreDe(a)}</span>
						{Array.from({ length: columnas }, (_, k) => (
							<span key={k} style={caja(ancho, C.fila, { borderRight: k === columnas - 1 ? 'none' : borde })} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};
