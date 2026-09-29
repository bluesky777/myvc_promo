import React from 'react';

import { ACENTO } from '../../notas/tema';
import { FUENTE } from '../tema';
import { CeldaDibujada, GeometriaDeHoja, HojaDeCalculo, rectDeCelda } from './HojaDeCalculo';
import {
	ANIO, ARCHIVO, ASIGNATURAS_DEL_LIBRO, BANDA_DE_LA_UNIDAD, COLEGIO, DESCARGADA, DOCENTE, ERROR_TEXTO, ERROR_TITULO, FILAS, HOJAS,
	INDICADORES, PERIODO, REGLAS, RESERVA, SUBUNIDADES, bandaDe, definitiva,
} from './datos-del-libro';
import { LA_COMPLETA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL LIBRO: la portada y la hoja de 9°B Matemáticas, cada una con su geometría. Los números salen
 * de `libro.ts`; aquí sólo se convierten en casillas.
 */

const X = 130;
const Y = 116;
const ANCHO = 1660;
const ALTO = 766;

export const GEO_PORTADA: GeometriaDeHoja = {
	x: X, y: Y, ancho: ANCHO, alto: ALTO,
	columnas: [40, 470, 130, 150, 150, 150, 150, 150, 150, 150],
	filas: [48, 36, 32, 30, 16, 34, 34, 34, 34, 34, 58, 16, 36, 34, 34, 34, 34, 30, 30, 30],
};

export const GEO_HOJA: GeometriaDeHoja = {
	x: X, y: Y, ancho: ANCHO, alto: ALTO,
	columnas: [44, 330, 112, 88, 88, 88, 88, 88, 92, 76, 76, 110, 110, 110, 110],
	filas: [36, 54, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 24, 38, 38],
};

/** Las primeras filas de la portada, por lo que dicen. */
export const FILA_REGLAS = 6;
export const FILA_ASIGNATURAS = 12;
/** La columna de la primera nota (D) y la de «Def». */
export const COL_NOTA = 3;
export const COL_DEF = COL_NOTA + INDICADORES.length + RESERVA.length;
export const FILA_ALUMNO = 2;

const GRIS = '#9a9a9a';
const AMBAR = '#fff1d6';
const AZUL = ACENTO;

/* ── La portada ───────────────────────────────────────────────────────────────────────────── */

export function celdasDeLaPortada(): CeldaDibujada[] {
	const c: CeldaDibujada[] = [
		{ f: 0, c: 0, span: 5, contenido: COLEGIO.nombre.toLocaleUpperCase('es'), fondo: AZUL, color: '#fff', negrita: true, tam: 22 },
		{ f: 1, c: 0, span: 5, contenido: `Planilla de notas · Periodo ${PERIODO} · ${ANIO}`, negrita: true, tam: 19 },
		{ f: 2, c: 0, span: 5, contenido: DOCENTE, tam: 18 },
		{ f: 3, c: 0, span: 5, contenido: `Descargada el ${DESCARGADA}`, tam: 14, color: '#888' },
		{ f: 5, c: 0, span: 5, contenido: 'CÓMO SE USA', negrita: true, tam: 16 },
	];
	REGLAS.forEach((r, i) => {
		c.push({ f: FILA_REGLAS + i, c: 0, contenido: `${i + 1}.`, tam: 17, alinear: 'derecha' });
		c.push({ f: FILA_REGLAS + i, c: 1, span: 4, contenido: r, tam: 17, parte: i === REGLAS.length - 1 });
	});
	c.push({ f: FILA_ASIGNATURAS, c: 0, span: 2, contenido: 'SUS ASIGNATURAS', negrita: true, tam: 16 });
	c.push({ f: FILA_ASIGNATURAS, c: 2, contenido: 'Alumnos', negrita: true, tam: 16, alinear: 'derecha' });
	c.push({ f: FILA_ASIGNATURAS, c: 3, contenido: SUBUNIDADES, negrita: true, tam: 16, alinear: 'derecha' });
	c.push({ f: FILA_ASIGNATURAS, c: 4, contenido: 'Sin pasar', negrita: true, tam: 16, alinear: 'derecha' });
	ASIGNATURAS_DEL_LIBRO.filter((_, i) => i !== LA_COMPLETA).forEach((a, i) => {
		const f = FILA_ASIGNATURAS + 1 + i;
		c.push({ f, c: 0, contenido: '→', alinear: 'centro', color: '#666' });
		c.push({ f, c: 1, contenido: <span style={{ color: '#0563c1', textDecoration: 'underline' }}>{HOJAS[i + 1]}</span> });
		c.push({ f, c: 2, contenido: a.alumnos, alinear: 'derecha' });
		c.push({ f, c: 3, contenido: a.indicadores, alinear: 'derecha' });
		c.push({
			f, c: 4, contenido: a.sinPasar, alinear: 'derecha',
			negrita: a.sinPasar > 0, color: a.sinPasar > 0 ? '#b36b00' : '#2e7d32',
		});
	});
	return c;
}

/** El enlace de una hoja en la portada, en el fotograma. */
export const enlaceDeLaHoja = (hoja: number) => rectDeCelda(GEO_PORTADA, FILA_ASIGNATURAS + hoja, 1);

/* ── La hoja de 9°B Matemáticas ───────────────────────────────────────────────────────────── */

export type Valor = number | null | '-';

export function celdasDeLaHoja(valores: Valor[][]): CeldaDibujada[] {
	const c: CeldaDibujada[] = [
		{ f: 0, c: 0, span: 3, contenido: '← Volver a la portada', color: '#0563c1', tam: 16 },
		{ f: 0, c: COL_NOTA, span: INDICADORES.length + RESERVA.length, contenido: BANDA_DE_LA_UNIDAD, fondo: '#dbe9ff', negrita: true, tam: 16, alinear: 'centro' },
		{ f: 1, c: 0, span: 2, contenido: `9B · MATEMÁTICAS · P${PERIODO}`, negrita: true, tam: 18, rayaAbajo: true },
		{ f: 1, c: 2, contenido: 'ID', tam: 13, color: GRIS, alinear: 'centro', rayaAbajo: true },
	];
	INDICADORES.forEach((ind, i) => {
		c.push({
			f: 1, c: COL_NOTA + i, alinear: 'centro', rayaAbajo: true,
			contenido: <span style={{ lineHeight: 1.15 }}><b style={{ fontSize: 18 }}>{ind.numero}.</b><br /><span style={{ fontSize: 14, color: GRIS }}>{ind.peso}%</span></span>,
		});
	});
	RESERVA.forEach((n, i) => {
		c.push({ f: 1, c: COL_NOTA + INDICADORES.length + i, alinear: 'centro', fondo: AMBAR, rayaAbajo: true, contenido: <b style={{ fontSize: 18 }}>{n}.</b> });
	});
	['Def', 'Aus', 'Tar'].forEach((t, i) => c.push({ f: 1, c: COL_DEF + i, contenido: t, negrita: true, tam: 15, alinear: 'centro', rayaAbajo: true }));

	FILAS.forEach((fila, i) => {
		const f = FILA_ALUMNO + i;
		c.push({ f, c: 0, contenido: fila.orden, tam: 13, color: GRIS, alinear: 'centro', fondo: '#f4f4f4' });
		c.push({ f, c: 1, contenido: fila.nombre, tam: 17, fondo: '#f4f4f4' });
		c.push({ f, c: 2, contenido: fila.id, tam: 13, color: GRIS, alinear: 'centro', fondo: '#f4f4f4' });
		valores[i].forEach((v, j) => {
			const b = typeof v === 'number' ? bandaDe(v) : null;
			c.push({
				f, c: COL_NOTA + j, alinear: 'centro', contenido: v ?? '',
				fondo: b ? b.tono : undefined,
				color: b?.perdido ? '#9f1616' : undefined,
				negrita: Boolean(b?.perdido),
			});
		});
		RESERVA.forEach((_, j) => c.push({ f, c: COL_NOTA + INDICADORES.length + j, contenido: '', fondo: AMBAR }));
		c.push({ f, c: COL_DEF, contenido: definitiva(valores[i]).toFixed(2).replace(/\.?0+$/, ''), alinear: 'centro', fondo: '#f4f4f4', color: '#555' });
		c.push({ f, c: COL_DEF + 1, contenido: fila.aus, alinear: 'centro' });
		c.push({ f, c: COL_DEF + 2, contenido: fila.tar, alinear: 'centro' });
	});

	/* El bloque del final: tres filas para quien no sale en la lista. Sólo se ve su rótulo. */
	const separador = FILA_ALUMNO + FILAS.length;
	c.push({ f: separador + 1, c: 0, span: 6, contenido: 'ALUMNOS QUE NO APARECEN EN LA LISTA · no se crea a nadie', negrita: true, tam: 15, fondo: AMBAR });
	return c;
}

export const valoresIniciales = (): Valor[][] => FILAS.map((f) => [...f.notas]);

/* ── El error de la validación ────────────────────────────────────────────────────────────── */

export const Dialogo: React.FC<{ a: number; encima: 'reintentar' | 'cancelar' | null }> = ({ a, encima }) => (
	<div
		style={{
			position: 'absolute',
			left: 960 - 330,
			top: 360,
			width: 660,
			height: 250,
			boxSizing: 'border-box',
			background: '#fff',
			borderRadius: 12,
			boxShadow: '0 30px 80px rgba(0,0,0,.28), 0 2px 8px rgba(0,0,0,.12)',
			padding: '26px 30px 22px',
			fontFamily: FUENTE,
			opacity: a,
			transform: `scale(${0.96 + a * 0.04})`,
		}}
	>
		<div style={{ display: 'flex', gap: 18 }}>
			<svg width="46" height="46" viewBox="0 0 24 24" style={{ flexShrink: 0 }} aria-hidden>
				<circle cx="12" cy="12" r="11" fill="#d93025" />
				<path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
			</svg>
			<div>
				<div style={{ fontSize: 22, fontWeight: 700, color: '#1f1f1f' }}>{ERROR_TITULO}</div>
				{ERROR_TEXTO.map((t) => <div key={t} style={{ fontSize: 18, lineHeight: 1.4, color: '#333', marginTop: 8 }}>{t}</div>)}
			</div>
		</div>
		<div style={{ position: 'absolute', right: 30, bottom: 22, display: 'flex', gap: 12 }}>
			{(['reintentar', 'cancelar'] as const).map((b) => (
				<span
					key={b}
					style={{
						height: 38, width: b === 'reintentar' ? 124 : 112, boxSizing: 'border-box', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', borderRadius: 6, fontSize: 17,
						border: `1px solid ${b === 'reintentar' ? '#1f7a4d' : '#c8c8c8'}`,
						background: b === 'reintentar' ? '#1f7a4d' : encima === b ? '#eef3f0' : '#fff',
						color: b === 'reintentar' ? '#fff' : '#222',
					}}
				>
					{b === 'reintentar' ? 'Reintentar' : 'Cancelar'}
				</span>
			))}
		</div>
	</div>
);

/** «Cancelar», en el fotograma: sale de las mismas medidas del diálogo (660 × 250, botones abajo a la derecha). */
export const BOTON_CANCELAR = { x: 960 + 330 - 30 - 112, y: 360 + 250 - 22 - 38, ancho: 112, alto: 38 };

export { ARCHIVO, HOJAS, HojaDeCalculo, rectDeCelda };
