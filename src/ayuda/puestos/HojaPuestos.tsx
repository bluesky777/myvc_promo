import React from 'react';

import { COLEGIO } from '../colegio';
import { Escudo, PAPEL } from '../cierre-6/Papel';
import { CALCULADO, COLUMNAS, FILAS, HAY_EMPATES, PROMEDIOS, PROMEDIO_CO, PROMEDIO_TOTAL, TITULO_HOJA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA HOJA DE PUESTOS (`encabezado-puestos.ts` + `tabla-puestos.html`): el encabezado centrado
 * --colegio, resolución, título y la fecha y hora en que se calculó--, y la tabla «Puesto · No ·
 * Nombres · una columna por asignatura · CO · Total», con la fila de promedios al pie. «No» sólo
 * sale si hay empates. Lo perdido va en rojo y el total lleva entre paréntesis cuántas.
 */

export const HOJA = { ancho: 816, alto: 1056 };

export const G = {
	pad: 30,
	encabezado: 96,
	cab: 30,
	fila: 27,
	anchos: { puesto: 52, no: 36, nombre: 200, nota: 36, co: 38, total: 64 },
};

export const X_TABLA = G.pad;
export const Y_TABLA = G.pad + G.encabezado + 10;
export const yFila = (i: number) => Y_TABLA + G.cab + i * G.fila;
export const ANCHO_TABLA = HOJA.ancho - G.pad * 2;
export const RECT_FECHA = { x: 280, y: G.pad + 69, ancho: 256, alto: 17 };
export const RECT_PUESTOS = { x: X_TABLA, y: Y_TABLA, ancho: G.anchos.puesto + (HAY_EMPATES ? G.anchos.no : 0), alto: G.cab + FILAS.length * G.fila };
export const X_TOTAL = X_TABLA + ANCHO_TABLA - G.anchos.total;

const celda = (ancho: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
	width: ancho,
	flexShrink: 0,
	textAlign: 'center',
	borderRight: `0.8px solid ${PAPEL.azulSuave}`,
	...extra,
});

export const HojaPuestos: React.FC = () => {
	const a = G.anchos;
	return (
		<div style={{ width: HOJA.ancho, height: HOJA.alto, boxSizing: 'border-box', padding: G.pad, background: '#fff', color: '#000', fontSize: 12, boxShadow: '0 12px 36px rgba(15,28,52,.16), 0 1px 4px rgba(15,28,52,.08)', position: 'relative' }}>
			<div style={{ height: G.encabezado, display: 'grid', gridTemplateColumns: '70px 1fr 70px', alignItems: 'center' }}>
				<Escudo tam={56} />
				<div style={{ textAlign: 'center', lineHeight: 1.35 }}>
					<div style={{ fontSize: 14, fontWeight: 700, color: PAPEL.azulTexto }}>
						{COLEGIO.nombre} - {COLEGIO.abreviatura}
					</div>
					<div style={{ fontSize: 10, color: PAPEL.gris }}>{COLEGIO.resolucion}</div>
					<div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{TITULO_HOJA}</div>
					<div style={{ fontSize: 11, color: PAPEL.gris }}>{CALCULADO}</div>
				</div>
				<div />
			</div>
			<div style={{ marginTop: 10, border: `0.8px solid ${PAPEL.azulSuave}` }}>
				<div style={{ display: 'flex', height: G.cab, alignItems: 'center', background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, fontSize: 11 }}>
					<span style={celda(a.puesto)}>Puesto</span>
					{HAY_EMPATES && <span style={celda(a.no)}>No</span>}
					<span style={celda(a.nombre, { textAlign: 'left', paddingLeft: 6, boxSizing: 'border-box' })}>Nombres</span>
					{COLUMNAS.map((c) => (
						<span key={c} style={celda(a.nota)}>{c}</span>
					))}
					<span style={celda(a.co)}>CO</span>
					<span style={celda(a.total, { borderRight: 'none' })}>Total</span>
				</div>
				{FILAS.map((f, i) => (
					<div key={f.nombre} style={{ display: 'flex', height: G.fila, alignItems: 'center', borderTop: `0.8px solid ${PAPEL.azulSuave}`, background: i % 2 ? '#f4f8fc' : '#fff' }}>
						<span style={celda(a.puesto, { fontWeight: 700, fontSize: 13 })}>{f.puesto}</span>
						{HAY_EMPATES && <span style={celda(a.no, { color: PAPEL.gris })}>{i + 1}</span>}
						<span style={celda(a.nombre, { textAlign: 'left', paddingLeft: 6, boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: 11.5 })}>{f.nombre}</span>
						{f.notas.map((n, j) => (
							<span key={j} style={celda(a.nota, { color: n < 60 ? PAPEL.rojo : '#000', fontWeight: n < 60 ? 700 : 400 })}>
								{n}
							</span>
						))}
						<span style={celda(a.co)}>{f.co}</span>
						<span style={celda(a.total, { borderRight: 'none', fontWeight: 700 })}>
							{f.total.toFixed(1)}
							{f.perdidas > 0 && <span style={{ color: PAPEL.rojo, fontWeight: 400, fontSize: 10.5 }}> ({f.perdidas})</span>}
						</span>
					</div>
				))}
				<div style={{ display: 'flex', height: G.fila, alignItems: 'center', borderTop: `1.2px solid ${PAPEL.azul}`, fontWeight: 700, fontSize: 11 }}>
					<span style={celda(a.puesto)} />
					{HAY_EMPATES && <span style={celda(a.no)} />}
					<span style={celda(a.nombre, { textAlign: 'left', paddingLeft: 6, boxSizing: 'border-box' })}>Total</span>
					{PROMEDIOS.map((p, j) => (
						<span key={j} style={celda(a.nota)}>{p.toFixed(1)}</span>
					))}
					<span style={celda(a.co)}>{PROMEDIO_CO.toFixed(0)}</span>
					<span style={celda(a.total, { borderRight: 'none' })}>{PROMEDIO_TOTAL.toFixed(1)}</span>
				</div>
			</div>
		</div>
	);
};
