import React from 'react';

import { VOCABULARIO } from '../../comunes/vocabulario';
import { PAPEL } from '../cierre-6/Papel';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NOTAS PERDIDAS DE TODOS» (`notas-perdidas-todos.html` + `tabla-pendientes.html`): una hoja por
 * docente (`.hoja + .hoja { break-before: page }`), y dentro, una tabla por grupo y asignatura con
 * lo que va perdido y SEIS COLUMNAS EN BLANCO para la recuperación: Nota nueva, Asist Sí/No, Fecha,
 * Método refuerzo y Firma. Cada alumno lleva todas sus notas pendientes en la misma fila, una
 * debajo de otra. Carta apaisada. Nombres, indicadores y notas inventados.
 */

export const HOJA = { ancho: 1056, alto: 816 };

export interface Pendiente { per: number; unidad: number; indicador: string; nota: number }
export interface AlumnoPendiente { nombre: string; notas: Pendiente[] }
export interface TablaPendiente { grupo: string; materia: string; alumnos: AlumnoPendiente[] }
export interface DocentePendiente { nombre: string; tablas: TablaPendiente[] }

export const DOCENTES_PENDIENTES: DocentePendiente[] = [
	{
		nombre: 'Beatriz Elena Cortés Ramírez',
		tablas: [
			{
				grupo: '7°A',
				materia: 'Matemáticas',
				alumnos: [
					{ nombre: 'Agudelo Sierra Juan Pablo', notas: [{ per: 3, unidad: 1, indicador: 'Plantea ecuaciones de primer grado', nota: 58 }] },
					{
						nombre: 'Galvis Rendón Miguel Ángel',
						notas: [
							{ per: 1, unidad: 0, indicador: 'Resuelve operaciones con números enteros', nota: 52 },
							{ per: 3, unidad: 1, indicador: 'Plantea ecuaciones de primer grado', nota: 48 },
						],
					},
					{ nombre: 'Marulanda Gil Jerónimo', notas: [{ per: 2, unidad: 0, indicador: 'Interpreta tablas de frecuencia', nota: 55 }] },
				],
			},
			{
				grupo: '8°B',
				materia: 'Matemáticas',
				alumnos: [
					{ nombre: 'Benítez Ossa Laura Camila', notas: [{ per: 3, unidad: 1, indicador: 'Factoriza expresiones algebraicas', nota: 57 }] },
					{
						nombre: 'Correa Vanegas Andrés Felipe',
						notas: [
							{ per: 2, unidad: 0, indicador: 'Aplica el teorema de Pitágoras', nota: 50 },
							{ per: 3, unidad: 1, indicador: 'Factoriza expresiones algebraicas', nota: 54 },
						],
					},
				],
			},
		],
	},
	{
		nombre: 'Hernán Darío Pulgarín Soto',
		tablas: [
			{
				grupo: '7°A',
				materia: 'Lengua castellana',
				alumnos: [
					{ nombre: 'Marulanda Gil Jerónimo', notas: [{ per: 3, unidad: 1, indicador: 'Identifica la idea principal de un texto', nota: 54 }] },
					{ nombre: 'Salazar Uribe Tomás', notas: [{ per: 2, unidad: 0, indicador: 'Escribe párrafos con conectores', nota: 59 }] },
				],
			},
		],
	},
];

/* ── Geometría de la hoja (px de la hoja) ─────────────────────────────────────────────────── */

export const H = { pad: 34, docente: 34, titulo: 30, cab1: 22, cab2: 20, linea: 24 };
export const COL = { no: 30, alumno: 210, per: 36, tema: 230, nota: 44, nueva: 76, si: 34, fecha: 76, metodo: 110, firma: 96 };
export const ANCHO_TABLA = Object.values(COL).reduce((a, b) => a + b, 0) + COL.si;
export const X_TABLA = (HOJA.ancho - ANCHO_TABLA) / 2;
export const X_BLANCAS = X_TABLA + COL.no + COL.alumno + COL.per + COL.tema + COL.nota;
export const X_TEMA = X_TABLA + COL.no + COL.alumno + COL.per;

/** Dónde empieza cada tabla en la hoja, y cuánto mide. */
export function tablasDe(d: DocentePendiente) {
	let y = H.pad + H.docente;
	return d.tablas.map((t) => {
		const lineas = t.alumnos.reduce((a, al) => a + al.notas.length, 0);
		const r = { y, titulo: y, cabeza: y + H.titulo, cuerpo: y + H.titulo + H.cab1 + H.cab2, alto: H.titulo + H.cab1 + H.cab2 + lineas * H.linea };
		y += r.alto + 18;
		return r;
	});
}

const borde = `0.8px solid ${PAPEL.azulSuave}`;
const th = (ancho: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	width: ancho,
	flexShrink: 0,
	boxSizing: 'border-box',
	borderRight: borde,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
	...extra,
});

export const HojaDocente: React.FC<{ d: DocentePendiente }> = ({ d }) => {
	const pos = tablasDe(d);
	return (
		<div style={{ width: HOJA.ancho, height: HOJA.alto, boxSizing: 'border-box', background: '#fff', color: '#000', position: 'relative', boxShadow: '0 16px 44px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)' }}>
			<div style={{ position: 'absolute', left: H.pad, top: H.pad, fontSize: 17, fontWeight: 700 }}>{d.nombre}</div>
			{d.tablas.map((t, k) => (
				<div key={t.grupo + t.materia} style={{ position: 'absolute', left: X_TABLA, top: pos[k].y, width: ANCHO_TABLA }}>
					<div style={{ height: H.titulo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
						<b>{t.grupo}</b>&nbsp;— {t.materia}
					</div>
					<div style={{ border: borde, fontSize: 12 }}>
						{/* La cabecera de dos pisos: «Asist» abarca Sí y No. */}
						<div style={{ display: 'flex', height: H.cab1 + H.cab2, background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700 }}>
							<span style={th(COL.no)}>No</span>
							<span style={th(COL.alumno, { justifyContent: 'flex-start', paddingLeft: 4 })}>Alumnos</span>
							<span style={th(COL.per)}>Per</span>
							<span style={th(COL.tema)}>{VOCABULARIO.subunidad} / Tema</span>
							<span style={th(COL.nota)}>Nota</span>
							<span style={th(COL.nueva)}>Nota nueva</span>
							<span style={{ ...th(COL.si * 2), flexDirection: 'column' }}>
								<span style={{ height: H.cab1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: borde }}>Asist</span>
								<span style={{ height: H.cab2, width: '100%', display: 'flex' }}>
									<span style={{ flex: 1, borderRight: borde, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Si</span>
									<span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No</span>
								</span>
							</span>
							<span style={th(COL.fecha)}>Fecha</span>
							<span style={th(COL.metodo)}>Método refuerzo</span>
							<span style={th(COL.firma, { borderRight: 'none' })}>Firma</span>
						</div>
						{t.alumnos.map((al, i) => (
							<div key={al.nombre} style={{ display: 'flex', borderTop: borde }}>
								<div style={{ width: COL.no, flexShrink: 0, borderRight: borde, textAlign: 'center', lineHeight: `${H.linea}px`, fontSize: 12.5 }}>{i + 1}</div>
								<div style={{ width: COL.alumno, flexShrink: 0, borderRight: borde, padding: '0 4px', boxSizing: 'border-box', fontWeight: 600, color: PAPEL.azulTexto, lineHeight: `${H.linea}px`, fontSize: 12.5 }}>{al.nombre}</div>
								<Col w={COL.per} lineas={al.notas.length} valores={al.notas.map((n) => String(n.per))} />
								<Col w={COL.tema} lineas={al.notas.length} valores={al.notas.map((n) => `${n.unidad + 1}.${n.indicador}`)} izquierda />
								<Col w={COL.nota} lineas={al.notas.length} valores={al.notas.map((n) => String(n.nota))} rojo />
								<Col w={COL.nueva} lineas={al.notas.length} />
								<Col w={COL.si} lineas={al.notas.length} />
								<Col w={COL.si} lineas={al.notas.length} />
								<Col w={COL.fecha} lineas={al.notas.length} />
								<Col w={COL.metodo} lineas={al.notas.length} />
								<Col w={COL.firma} lineas={al.notas.length} ultima />
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

/** Una columna de una fila: tantas líneas como notas pendientes, con su raya entre una y otra. */
const Col: React.FC<{ w: number; lineas: number; valores?: string[]; izquierda?: boolean; rojo?: boolean; ultima?: boolean }> = ({ w, lineas, valores, izquierda = false, rojo = false, ultima = false }) => (
	<div style={{ width: w, flexShrink: 0, borderRight: ultima ? 'none' : borde, boxSizing: 'border-box' }}>
		{Array.from({ length: lineas }, (_, i) => (
			<div
				key={i}
				style={{
					height: H.linea,
					lineHeight: `${H.linea}px`,
					borderTop: i ? borde : 'none',
					textAlign: izquierda ? 'left' : 'center',
					padding: '0 4px',
					fontSize: izquierda ? 11.5 : 12.5,
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					color: rojo ? PAPEL.rojo : '#000',
					fontWeight: rojo ? 700 : 400,
				}}
			>
				{valores?.[i] ?? (valores ? '' : ' ')}
			</div>
		))}
	</div>
);
