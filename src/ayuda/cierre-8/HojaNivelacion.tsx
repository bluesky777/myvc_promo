import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Banda, Firmas, Hoja, Membrete, PAPEL } from '../cierre-6/Papel';
import {
	ANCHOS_A, ANCHOS_B, CUANTAS_DISCREPAN, HN, HOJA_NIV, QUEDA, REGLA, SECCION_A, SECCION_B, TEXTOS, Y_A, Y_B, Y_FIRMAS,
	Y_REGLA, discrepa,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL ACTA DE NIVELACIÓN Y RECUPERACIÓN, apaisada (`acta-nivelacion.html`): membrete, el recuadro
 * de la regla vigente, la sección A con su asterisco y su nota al pie, la sección B con su nota en
 * cursiva, y las tres firmas. Todo va posicionado a mano con las medidas de `datos.ts`, que es de
 * donde el guion saca los focos.
 */

export const HojaNivelacion: React.FC<{ desde: number }> = ({ desde }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = (d: number) => entra(frame, fps, desde + d, 14);

	return (
		<Hoja ancho={HOJA_NIV.ancho} alto={HOJA_NIV.alto} opacidad={a(0)}>
			<Membrete titulo={TEXTOS.titulo} derecha={<><div>{TEXTOS.datos}</div><div>{TEXTOS.fecha}</div></>} />

			<div style={{ position: 'absolute', left: HN.pad, right: HN.pad, top: Y_REGLA, height: HN.regla, boxSizing: 'border-box', padding: '0 10px', display: 'flex', alignItems: 'center', background: '#eef4fb', border: `1px solid ${PAPEL.azulSuave}`, borderRadius: 5, fontSize: 10.5, opacity: a(6) }}>
				<span><b>{TEXTOS.reglaRotulo}</b> {REGLA}</span>
			</div>

			{/* ── A ── */}
			<div style={{ position: 'absolute', left: HN.pad, right: HN.pad, top: Y_A, opacity: a(10) }}>
				<div style={{ height: HN.banda, marginTop: -10 }}><Banda>{TEXTOS.tituloA}</Banda></div>
				<Fila anchos={ANCHOS_A} celdas={TEXTOS.columnasA} cabecera derecha={[3, 4, 5]} />
				{SECCION_A.map((f) => (
					<Fila
						key={`${f.estudiante}-${f.asignatura}`}
						anchos={ANCHOS_A}
						derecha={[3, 4, 5]}
						celdas={[f.estudiante, f.asignatura, f.indicador, String(f.inicial), String(f.superacion),
							<span key="q">{f.queda}{discrepa(f) && <b style={{ color: PAPEL.rojo }}>*</b>}</span>,
							f.fecha, f.registro, f.actividad]}
					/>
				))}
				<div style={{ height: HN.pie, display: 'flex', alignItems: 'center', fontSize: 9.5, color: 'rgba(0,0,0,.78)' }}>
					<span>
						<b style={{ color: PAPEL.rojo }}>*</b> <b>{CUANTAS_DISCREPAN}</b> de estas filas no cuadran con la regla vigente. <b>No están mal</b>: se
						registraron cuando el colegio tenía otra regla, y cambiarla no reescribe lo ya nivelado.
					</span>
				</div>
			</div>

			{/* ── B ── */}
			<div style={{ position: 'absolute', left: HN.pad, right: HN.pad, top: Y_B, opacity: a(16) }}>
				<div style={{ height: HN.banda, marginTop: -10 }}><Banda>{TEXTOS.tituloB}</Banda></div>
				<div style={{ height: HN.notaB, fontSize: 10, fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
					<span>{TEXTOS.notaB[0]}<b>{TEXTOS.notaB[1]}</b>{TEXTOS.notaB[2]}</span>
				</div>
				<Fila anchos={ANCHOS_B} celdas={TEXTOS.columnasB} cabecera derecha={[2, 3]} />
				{SECCION_B.map((f) => (
					<Fila
						key={f.estudiante}
						anchos={ANCHOS_B}
						derecha={[2, 3]}
						celdas={[
							f.estudiante,
							<span key="a">{f.asignatura} <span style={{ marginLeft: 4, padding: '0 5px', borderRadius: 3, background: PAPEL.rojoTenue, color: PAPEL.rojo, fontSize: 7.5, fontWeight: 700 }}>{TEXTOS.perdida}</span></span>,
							String(f.definitiva), String(f.recuperacion), f.fecha, f.registro, f.actividad,
						]}
					/>
				))}
			</div>

			<div style={{ position: 'absolute', left: HN.pad + 40, right: HN.pad + 40, top: Y_FIRMAS, opacity: a(22) }}>
				<Firmas firmas={TEXTOS.firmas} />
			</div>
		</Hoja>
	);
};

const Fila: React.FC<{ anchos: number[]; celdas: React.ReactNode[]; cabecera?: boolean; derecha?: number[] }> = ({ anchos, celdas, cabecera = false, derecha = [] }) => (
	<div style={{ display: 'flex', height: cabecera ? HN.cab : HN.fila, background: cabecera ? PAPEL.banda : 'transparent', color: cabecera ? PAPEL.azulTexto : '#000', fontWeight: cabecera ? 700 : 400, fontSize: cabecera ? 9.5 : 10 }}>
		{celdas.map((c, i) => (
			<div
				key={i}
				style={{
					width: anchos[i],
					boxSizing: 'border-box',
					borderBottom: `0.8px solid ${PAPEL.azulSuave}`,
					borderTop: cabecera ? `0.8px solid ${PAPEL.azulSuave}` : undefined,
					display: 'flex',
					alignItems: 'center',
					justifyContent: derecha.includes(i) ? 'flex-end' : 'flex-start',
					padding: '0 5px',
					whiteSpace: cabecera ? 'normal' : 'nowrap',
					overflow: 'hidden',
					lineHeight: 1.1,
				}}
			>
				{c}
			</div>
		))}
	</div>
);

export { QUEDA };
