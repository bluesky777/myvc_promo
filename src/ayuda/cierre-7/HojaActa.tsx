import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, llega } from '../../comunes/movimiento';
import { Hoja, Membrete, PAPEL, TITULAR_9B } from '../cierre-6/Papel';
import {
	ANCHOS_LISTADO, COLUMNAS_LISTADO, CUADRO_MOVIMIENTO_9B, CUADRO_PROMOCION_9B, FilaCuadro, HA, HOJA_ACTA, LISTADO_9B,
	PROMOVIDO, Y_CUADRO,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA HOJA DE 9°B DEL ACTA: el listado «{Grupo} — {titular}» y el cuadro «{Grupo} — movimiento y
 * promoción», que son las dos cosas que van marcadas por defecto (`acta-evaluacion.html`). Carta
 * apaisada, que es la orientación que el catálogo le pone al acta.
 *
 * Las columnas y las filas del cuadro son literales (`acta.ts`, `filasMovimiento`/`filasPromocion`).
 * Las filas de aviso («Matrículas sin fecha…», «SIN DEFINIR promoción») no salen porque en 9°B
 * cuentan 0, y el cuadro sólo las pinta si pasan de 0.
 */

export const LA_CUADRO_ANCHO = 936;
const ANCHO_ETIQUETA = 520;
const ANCHO_NUM = (LA_CUADRO_ANCHO - ANCHO_ETIQUETA) / 6;

export const HojaActa: React.FC<{ desde: number }> = ({ desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<Hoja ancho={HOJA_ACTA.ancho} alto={HOJA_ACTA.alto} opacidad={entra(frame, fps, desde, 14)}>
			<Membrete titulo="ACTA DE EVALUACIÓN Y PROMOCIÓN 2026" derecha={<div>Comisión de evaluación y promoción</div>} />

			<div style={{ height: 12 }} />
			<div style={{ height: HA.titulo, fontSize: 13, fontWeight: 700, color: PAPEL.azulTexto, display: 'flex', alignItems: 'center' }}>
				9°B — {TITULAR_9B}
			</div>

			<div style={{ display: 'flex', height: HA.cab, background: PAPEL.banda, color: PAPEL.azulTexto, fontWeight: 700, fontSize: 9 }}>
				{COLUMNAS_LISTADO.map((c, i) => (
					<div key={c} style={{ width: ANCHOS_LISTADO[i], boxSizing: 'border-box', border: `0.8px solid ${PAPEL.azulSuave}`, display: 'flex', alignItems: 'center', justifyContent: i === 1 ? 'flex-start' : 'center', textAlign: 'center', padding: '0 3px', lineHeight: 1.1 }}>
						{c}
					</div>
				))}
			</div>
			{LISTADO_9B.map((f, fi) => {
				const nace = llega(frame, fps, fi, desde + 8, 3);
				return (
					<div key={f.celdas[1]} style={{ display: 'flex', height: HA.fila, fontSize: 10, opacity: nace.opacidad }}>
						{f.celdas.map((c, i) => (
							<div
								key={i}
								style={{
									width: ANCHOS_LISTADO[i],
									boxSizing: 'border-box',
									border: `0.8px solid ${PAPEL.azulSuave}`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: i === 1 ? 'flex-start' : 'center',
									padding: '0 4px',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									fontWeight: i === 1 ? 600 : i === PROMOVIDO ? 700 : 400,
									color: i === PROMOVIDO && c === 'Pendiente' ? PAPEL.ambar : '#000',
								}}
							>
								{c}
							</div>
						))}
					</div>
				);
			})}

			<div style={{ position: 'absolute', left: HA.pad, top: Y_CUADRO, display: 'flex', flexDirection: 'column', gap: HA.entreCuadros, opacity: entra(frame, fps, desde + 26, 14) }}>
				<Cuadro titulo="Movimiento de estudiantes" filas={CUADRO_MOVIMIENTO_9B} encabezado="9°B — movimiento y promoción" />
				<Cuadro titulo="Promoción (sólo quienes terminaron el año)" filas={CUADRO_PROMOCION_9B} encabezado="" />
			</div>
		</Hoja>
	);
};

const Cuadro: React.FC<{ titulo: string; filas: FilaCuadro[]; encabezado: string }> = ({ titulo, filas, encabezado }) => (
	<div style={{ width: LA_CUADRO_ANCHO }}>
		<div style={{ height: HA.tituloCuadro, fontSize: 12, fontWeight: 700, color: PAPEL.azulTexto, display: 'flex', alignItems: 'center' }}>{encabezado}</div>
		<div style={{ display: 'flex', height: HA.cabCuadro, background: PAPEL.banda, color: PAPEL.azulTexto, fontSize: 9, fontWeight: 700 }}>
			{[titulo, 'Cantidad', 'Masc', '%', 'Fem', '%', 'Sin dato'].map((c, i) => (
				<div key={i} style={{ width: i === 0 ? ANCHO_ETIQUETA : ANCHO_NUM, boxSizing: 'border-box', border: `0.8px solid ${PAPEL.azulSuave}`, display: 'flex', alignItems: 'center', justifyContent: i === 0 ? 'flex-start' : 'center', padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
					{c}
				</div>
			))}
		</div>
		{filas.map((f) => {
			const pct = (n: number) => (f.c.total ? `${Math.round((n * 100) / f.c.total)}` : '0');
			const celdas = [f.etiqueta, String(f.c.total), String(f.c.m), pct(f.c.m), String(f.c.f), pct(f.c.f), '0'];
			return (
				<div key={f.etiqueta} style={{ display: 'flex', height: HA.filaCuadro, fontSize: 9.5, fontWeight: f.fuerte ? 700 : 400 }}>
					{celdas.map((c, i) => (
						<div key={i} style={{ width: i === 0 ? ANCHO_ETIQUETA : ANCHO_NUM, boxSizing: 'border-box', border: `0.8px solid ${PAPEL.azulSuave}`, display: 'flex', alignItems: 'center', justifyContent: i === 0 ? 'flex-start' : 'center', padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textDecoration: i === 1 ? 'underline' : 'none', textDecorationColor: PAPEL.azulSuave }}>
							{c}
						</div>
					))}
				</div>
			);
		})}
	</div>
);
