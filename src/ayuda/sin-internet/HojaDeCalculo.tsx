import React from 'react';

import { FUENTE } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * UNA HOJA DE CÁLCULO GENÉRICA, DIBUJADA: la ventana, la barra de fórmulas, las letras de las
 * columnas, los números de las filas, la rejilla y las pestañas de abajo. **Sin la marca de ningún
 * programa**: el vídeo enseña el libro que baja MyVC, no un producto de otro.
 *
 * Va en coordenadas del FOTOGRAMA, como el foco y el puntero: `rectDeCelda()` da el rectángulo de
 * una casilla con los mismos números con los que se pinta, así que el foco y el puntero no pueden
 * señalar dos sitios distintos.
 */

export interface GeometriaDeHoja {
	x: number;
	y: number;
	ancho: number;
	alto: number;
	/** Anchos de las columnas A, B, C… */
	columnas: number[];
	/** Altos de las filas 1, 2, 3… */
	filas: number[];
}

export const VENTANA = { titulo: 38, formula: 46, letras: 30, numeros: 48, pestanas: 40 };

/** Dónde empieza la rejilla (la casilla A1). */
export function origen(g: GeometriaDeHoja) {
	return { x: g.x + VENTANA.numeros, y: g.y + VENTANA.titulo + VENTANA.formula + VENTANA.letras };
}

/** El rectángulo de una casilla (fila y columna desde 0), o de un bloque de `span` × `alto`. */
export function rectDeCelda(g: GeometriaDeHoja, f: number, c: number, span = 1, altoEnFilas = 1) {
	const o = origen(g);
	const x = o.x + g.columnas.slice(0, c).reduce((a, b) => a + b, 0);
	const y = o.y + g.filas.slice(0, f).reduce((a, b) => a + b, 0);
	return {
		x,
		y,
		ancho: g.columnas.slice(c, c + span).reduce((a, b) => a + b, 0),
		alto: g.filas.slice(f, f + altoEnFilas).reduce((a, b) => a + b, 0),
	};
}

export interface CeldaDibujada {
	f: number;
	c: number;
	/** Columnas que ocupa (casillas combinadas). */
	span?: number;
	contenido: React.ReactNode;
	fondo?: string;
	color?: string;
	negrita?: boolean;
	tam?: number;
	alinear?: 'izquierda' | 'centro' | 'derecha';
	/** Que el texto parta en varias líneas. */
	parte?: boolean;
	/** Una raya abajo, como la cabecera de la hoja. */
	rayaAbajo?: boolean;
}

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const REJILLA = '#e1e3e6';

export const HojaDeCalculo: React.FC<{
	g: GeometriaDeHoja;
	archivo: string;
	celdas: CeldaDibujada[];
	pestanas: string[];
	pestana: number;
	activa: { f: number; c: number } | null;
	/** Lo que se está tecleando en la activa: sale en la casilla y en la barra de fórmulas. */
	editando?: string | null;
	/** Lo que dice la barra de fórmulas cuando no se teclea. */
	formula?: string;
	opacidad?: number;
	children?: React.ReactNode;
}> = ({ g, archivo, celdas, pestanas, pestana, activa, editando = null, formula = '', opacidad = 1, children }) => {
	const o = origen(g);
	const anchoRejilla = g.x + g.ancho - o.x;
	const altoRejilla = g.y + g.alto - VENTANA.pestanas - o.y;
	const ref = activa ? `${LETRAS[activa.c]}${activa.f + 1}` : '';

	return (
		<div style={{ position: 'absolute', inset: 0, fontFamily: FUENTE, opacity: opacidad }}>
			<div
				style={{
					position: 'absolute',
					left: g.x,
					top: g.y,
					width: g.ancho,
					height: g.alto,
					background: '#fff',
					borderRadius: 12,
					overflow: 'hidden',
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
				}}
			>
				{/* La barra de la ventana: tres puntos y el nombre del archivo. */}
				<div style={{ height: VENTANA.titulo, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#1f7a4d', color: '#fff' }}>
					{['#ff6159', '#ffbd2e', '#28c941'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.9 }} />)}
					<span style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 600, marginRight: 60 }}>{archivo}</span>
				</div>

				{/* La barra de fórmulas. */}
				<div style={{ height: VENTANA.formula, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', borderBottom: `1px solid ${REJILLA}`, background: '#f7f8f9' }}>
					<div style={{ width: 86, height: 30, border: `1px solid ${REJILLA}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 17, color: '#333' }}>{ref}</div>
					<span style={{ fontSize: 18, fontStyle: 'italic', color: '#888', fontFamily: 'Georgia, serif' }}>fx</span>
					<div style={{ flex: 1, height: 30, border: `1px solid ${REJILLA}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 17, color: '#222', whiteSpace: 'pre', overflow: 'hidden' }}>
						{editando ?? formula}
					</div>
				</div>
			</div>

			{/* Las letras de las columnas. */}
			<div style={{ position: 'absolute', left: o.x, top: o.y - VENTANA.letras, width: anchoRejilla, height: VENTANA.letras, display: 'flex', background: '#f3f4f6', overflow: 'hidden', boxShadow: `inset 0 -1px 0 ${REJILLA}` }}>
				{g.columnas.map((w, c) => (
					<div key={c} style={{ width: w, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: activa?.c === c ? '#1f7a4d' : '#666', fontWeight: activa?.c === c ? 700 : 400, background: activa?.c === c ? '#e3efe8' : 'transparent', boxShadow: `inset -1px 0 0 ${REJILLA}` }}>
						{LETRAS[c]}
					</div>
				))}
			</div>
			<div style={{ position: 'absolute', left: g.x, top: o.y - VENTANA.letras, width: VENTANA.numeros, height: VENTANA.letras, background: '#f3f4f6', boxShadow: `inset -1px -1px 0 ${REJILLA}` }} />

			{/* Los números de las filas. */}
			<div style={{ position: 'absolute', left: g.x, top: o.y, width: VENTANA.numeros, height: altoRejilla, background: '#f3f4f6', overflow: 'hidden', boxShadow: `inset -1px 0 0 ${REJILLA}` }}>
				{g.filas.map((h, f) => (
					<div key={f} style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: activa?.f === f ? '#1f7a4d' : '#666', fontWeight: activa?.f === f ? 700 : 400, background: activa?.f === f ? '#e3efe8' : 'transparent', boxShadow: `inset 0 -1px 0 ${REJILLA}` }}>
						{f + 1}
					</div>
				))}
			</div>

			{/* La rejilla vacía: rayas de columnas y de filas. */}
			<div style={{ position: 'absolute', left: o.x, top: o.y, width: anchoRejilla, height: altoRejilla, overflow: 'hidden' }}>
				{g.filas.map((h, f) => {
					const y = g.filas.slice(0, f).reduce((a, b) => a + b, 0);
					return <div key={`f${f}`} style={{ position: 'absolute', left: 0, top: y + h - 1, width: anchoRejilla, height: 1, background: REJILLA }} />;
				})}
				{g.columnas.map((w, c) => {
					const x = g.columnas.slice(0, c).reduce((a, b) => a + b, 0);
					return <div key={`c${c}`} style={{ position: 'absolute', left: x + w - 1, top: 0, width: 1, height: altoRejilla, background: REJILLA }} />;
				})}

				{/* Las casillas con algo. Tapan la rejilla de debajo, como una casilla combinada. */}
				{celdas.map((cel) => {
					const r = rectDeCelda(g, cel.f, cel.c, cel.span ?? 1);
					const esLaActiva = activa && activa.f === cel.f && activa.c === cel.c;
					return (
						<div
							key={`${cel.f}-${cel.c}`}
							style={{
								position: 'absolute',
								left: r.x - o.x,
								top: r.y - o.y,
								width: r.ancho - 1,
								height: r.alto - 1,
								background: cel.fondo ?? 'transparent',
								color: cel.color ?? '#1f1f1f',
								fontWeight: cel.negrita ? 700 : 400,
								fontSize: cel.tam ?? 18,
								display: 'flex',
								alignItems: 'center',
								justifyContent: cel.alinear === 'centro' ? 'center' : cel.alinear === 'derecha' ? 'flex-end' : 'flex-start',
								textAlign: cel.alinear === 'centro' ? 'center' : cel.alinear === 'derecha' ? 'right' : 'left',
								padding: '0 8px',
								boxSizing: 'border-box',
								whiteSpace: cel.parte ? 'normal' : 'nowrap',
								lineHeight: cel.parte ? 1.25 : undefined,
								overflow: 'hidden',
								fontVariantNumeric: 'tabular-nums',
								boxShadow: cel.rayaAbajo ? 'inset 0 -1px 0 #333' : undefined,
							}}
						>
							{esLaActiva && editando !== null ? '' : cel.contenido}
						</div>
					);
				})}

				{/* La casilla activa: el recuadro verde, y lo que se teclea dentro. */}
				{activa && (() => {
					const r = rectDeCelda(g, activa.f, activa.c);
					return (
						<div
							style={{
								position: 'absolute',
								left: r.x - o.x - 1,
								top: r.y - o.y - 1,
								width: r.ancho + 1,
								height: r.alto + 1,
								boxSizing: 'border-box',
								border: '2.5px solid #1f7a4d',
								background: editando !== null ? '#fff' : 'transparent',
								display: 'flex',
								alignItems: 'center',
								padding: '0 7px',
								fontSize: 18,
								color: '#1f1f1f',
								whiteSpace: 'pre',
							}}
						>
							{editando}
							{editando !== null && <span style={{ width: 2, height: 20, background: '#1f1f1f', marginLeft: 1 }} />}
						</div>
					);
				})()}
			</div>

			{/* Las pestañas de las hojas. */}
			<div style={{ position: 'absolute', left: g.x, top: g.y + g.alto - VENTANA.pestanas, width: g.ancho, height: VENTANA.pestanas, display: 'flex', alignItems: 'stretch', gap: 2, padding: '0 0 0 60px', background: '#f3f4f6', boxShadow: `inset 0 1px 0 ${REJILLA}`, borderRadius: '0 0 12px 12px', overflow: 'hidden', boxSizing: 'border-box' }}>
				{pestanas.map((p, i) => (
					<div
						key={p}
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: '0 18px',
							fontSize: 16,
							color: i === pestana ? '#1f7a4d' : '#555',
							fontWeight: i === pestana ? 700 : 400,
							background: i === pestana ? '#fff' : 'transparent',
							boxShadow: i === pestana ? 'inset 0 -3px 0 #1f7a4d' : 'none',
							whiteSpace: 'nowrap',
						}}
					>
						{p}
					</div>
				))}
			</div>

			{children}
		</div>
	);
};
