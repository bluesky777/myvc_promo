import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, llega } from '../../comunes/movimiento';
import { Decision, HOJA_APAISADA, PROMOCION_9B, SIN_CALCULAR } from './datos';
import { Hoja, Membrete, PAPEL, TITULAR_9B, cab, cel } from './Papel';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PROMOVIDOS Y NO PROMOVIDOS» DE 9°B, HOJA 1 (`informes/promocion/hoja-academica.html`): un
 * renglón por alumno con lo que le queda, y la decisión. Apaisada.
 *
 * La decisión va con los colores del papel (`hoja-academica.scss`): «Promovido» en verde oscuro y
 * letra normal, «NO PROMOVIDO» en rojo y negrita, «Promoción pendiente» en ámbar y negrita, y
 * «Sin definir» en gris y cursiva -- que es lo que tiene todo el grupo antes de calcular.
 */

export const COLUMNAS_PROMOVIDOS = ['#', 'Alumno', 'Prom.', 'Asig.', 'Áreas', 'Cuáles quedan', 'Faltas', 'Decisión', 'Observación'];
export const ANCHOS_PROMOVIDOS = [28, 250, 56, 48, 52, 200, 52, 150, 100];
const ANCHOS = ANCHOS_PROMOVIDOS;
/** Las medidas de la tabla en la hoja, para que el foco sepa dónde cae la columna «Decisión». */
export const FILA_CAB = 24;
export const FILA = 26;
export const ARRIBA_TABLA_PROMOVIDOS = 20 + 56 + 16;

export const HojaPromovidos: React.FC<{ desde: number; calculado: boolean }> = ({ desde, calculado }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<Hoja ancho={HOJA_APAISADA.ancho} alto={HOJA_APAISADA.alto} opacidad={entra(frame, fps, desde, 14)}>
			<Membrete
				titulo="Acta de evaluación y promoción · los alumnos, uno por uno"
				derecha={
					<>
						<div>Grupo: <b style={{ color: '#000' }}>9°B</b></div>
						<div>Titular: {TITULAR_9B}</div>
						<div>Año 2026</div>
					</>
				}
			/>

			<table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
				<thead>
					<tr>
						{COLUMNAS_PROMOVIDOS.map((c, i) => (
							<th key={c} style={cab({ width: ANCHOS[i], height: FILA_CAB, textAlign: i === 1 || i === 5 || i === 8 ? 'left' : 'center' })}>{c}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{PROMOCION_9B.map((f, i) => {
						const nace = llega(frame, fps, i, desde + 10, 3);
						const d: Decision = calculado ? f.decision : SIN_CALCULAR;
						return (
							<tr key={f.nombre} style={{ opacity: nace.opacidad, height: FILA }}>
								<td style={cel({ textAlign: 'center', color: PAPEL.gris })}>{i + 1}</td>
								<td style={cel({ fontWeight: 600 })}>{f.nombre}</td>
								<td style={cel({ textAlign: 'center' })}>{f.prom}</td>
								<td style={cel({ textAlign: 'center' })}>{f.asig}</td>
								<td style={cel({ textAlign: 'center' })}>{f.areas}</td>
								<td style={cel()}>{f.quedan}</td>
								<td style={cel({ textAlign: 'center' })}>{f.faltas}</td>
								<td style={cel(estiloDe(d))}>{d}</td>
								<td style={cel()} />
							</tr>
						);
					})}
				</tbody>
			</table>

			<div style={{ position: 'absolute', left: 22, bottom: 18, fontSize: 10, color: PAPEL.gris, fontStyle: 'italic' }}>
				Las firmas van en la hoja siguiente.
			</div>
		</Hoja>
	);
};

function estiloDe(d: Decision): React.CSSProperties {
	switch (d) {
		case 'Promovido': return { color: PAPEL.verde };
		case 'NO PROMOVIDO': return { color: PAPEL.rojo, fontWeight: 700 };
		case 'Promoción pendiente': return { color: PAPEL.ambar, fontWeight: 700 };
		default: return { color: PAPEL.gris, fontStyle: 'italic' };
	}
}
