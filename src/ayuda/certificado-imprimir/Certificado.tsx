import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ALMENDROS, Escudo, Membrete, Rubrica } from '../colegio';
import { AREAS, ALUMNO, ESCALA, HOJA, MINIMA, MINUTOS_CLASE, desempeno, promedio } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CERTIFICADO DE ESTUDIO IMPRESO (`informes/certificado-estudio/certificado-estudio.html`).
 *
 * EL FORMATO Y LOS TEXTOS FIJOS SON LOS DE LA APLICACIÓN, en su orden: la imagen del membrete de
 * filo a filo (y entonces el logo suelto no se pinta: `@if (year().logo && !cabeceraMembrete())`),
 * la cabecera con el título, «N.º» y el texto bajo el membrete, el párrafo --el de «hasta el
 * periodo» o el del año--, «Nro Matrícula / Folio», la tabla (NO, ÁREAS, IH, Per1..Per4, ESCALA
 * NACIONAL, ESCALA VALORATIVA, Total), «Dado en…», las dos firmas y la leyenda de IH y escalas.
 *
 * LO QUE SE LLENA ES INVENTADO: colegio, rector, secretaria, alumno, documento, notas y firmas.
 *
 * LO QUE NO SE PINTA Y POR QUÉ: la «frase final» del año (`frase_final_certificado`) es un texto
 * del colegio sin valor por defecto que se pueda afirmar, así que este colegio no tiene; la foto
 * del alumno sólo sale si la tiene, y este no; la fila de comportamiento es un ajuste del año, y
 * aquí está apagado. La frase de promoción («cursó y aprobó») del certificado del año sólo sale
 * si el alumno ya está promovido, y en septiembre no lo está: por eso el vídeo enseña el de periodo.
 */

const AZUL = '#1f4e79';
const AZUL_TEXTO = '#173859';
const AZUL_SUAVE = '#9db8d2';
const BANDA = '#dae7f5';
const BANDA_TENUE = '#f2f7fc';
const ROJO = '#8a0000';

const PT = 96 / 72;

export interface PropsCertificado {
	/** Qué plantilla lo imprime: con la imagen del membrete, o la hoja en blanco. */
	conMembrete: boolean;
	/** El periodo hasta el que se calcula, o null para el del año. */
	hastaPeriodo: number | null;
	numero: number;
	/** El «Texto bajo el membrete» del año. */
	encabezado: string;
	/** Cuándo empieza a montarse la hoja. */
	desde: number;
	/** El año y el grado del párrafo, si no son los de 2026 (`certificados-alumno`: uno por año). */
	year?: number;
	grado?: string;
}

/** Las medidas de cada plantilla, las de `certificado-membrete/datos.ts` después del vídeo 1. */
const CAJA = {
	membrete: { arriba: 170, izquierda: 60, derecha: 60, abajo: 60 },
	blanco: { arriba: 45, izquierda: 45, derecha: 45, abajo: 45 },
};

export const Certificado: React.FC<PropsCertificado> = ({ conMembrete, hastaPeriodo, numero, encabezado, desde, year = ALMENDROS.year, grado = ALUMNO.grupo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const hoja = entra(frame, fps, desde, 16);
	/* `max(1.2cm, …)`: el cuerpo nunca entra a menos de 1,2 cm del filo. */
	const caja = conMembrete ? CAJA.membrete : CAJA.blanco;
	const lado = (n: number) => Math.max(45, n);

	const titulo = hastaPeriodo ? 'CONSTANCIA DE DESEMPEÑO ACADÉMICO PARCIAL' : 'CONSTANCIA DE DESEMPEÑO ACADÉMICO';

	return (
		<div
			style={{
				position: 'relative',
				width: HOJA.ancho,
				height: HOJA.alto,
				boxSizing: 'border-box',
				padding: `${caja.arriba}px ${lado(caja.derecha)}px ${caja.abajo}px ${lado(caja.izquierda)}px`,
				background: '#fff',
				color: '#000',
				fontFamily: 'Arial, Helvetica, sans-serif',
				fontSize: 10 * PT,
				lineHeight: 1.35,
				border: '1px solid #d9d9d9',
				boxShadow: '0 24px 64px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .07)',
				opacity: hoja,
				transform: `translateY(${(1 - hoja) * 18}px)`,
				overflow: 'hidden',
			}}
		>
			{conMembrete && (
				<div style={{ position: 'absolute', left: 0, top: 0 }}>
					<Membrete />
				</div>
			)}

			{/* ── La cabecera: logo (si no hay membrete), el título con su número, y el texto del año. */}
			<div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 19, alignItems: 'start' }}>
				{!conMembrete ? <Escudo tam={78} /> : <span />}
				<div style={{ textAlign: 'center' }}>
					<span style={{ fontSize: 13 * PT, fontWeight: 700, letterSpacing: 0.3 }}>{titulo}</span>
					<span style={{ fontSize: 9 * PT, marginLeft: 11 }}>N.º {numero}</span>
					<div style={{ fontSize: 8 * PT, lineHeight: 1.25, marginTop: 3 }}>{encabezado}</div>
				</div>
				<span />
			</div>

			{/* ── El párrafo ──────────────────────────────────────────────────────────────────── */}
			<div style={{ margin: '19px 0', textAlign: 'justify' }}>
				{hastaPeriodo ? (
					<p style={{ margin: 0 }}>
						El suscrito rector del <b>{ALMENDROS.nombrePapel}</b> que, <b>{ALUMNO.nombre},</b> identificado con {ALUMNO.tipoDoc}{' '}
						<b>{ALUMNO.documento},</b> ha cursado en este plantel educativo las áreas correspondientes al grado <b>{grado}</b> de la{' '}
						{ALUMNO.nivel} <i>hasta el periodo</i> <b>{hastaPeriodo} de {year}</b> obteniendo los siguientes resultados:
					</p>
				) : (
					<p style={{ margin: 0 }}>
						El suscrito rector y la secretaria del <b>{ALMENDROS.nombrePapel}</b>, de carácter {ALMENDROS.caracter}, calendario{' '}
						{ALMENDROS.calendario}, jornada {ALMENDROS.jornada}. <b style={{ fontSize: 11 * PT }}>HACEN CONSTAR QUE</b> el estudiante{' '}
						<b>{ALUMNO.nombre}</b>, identificado con <b>{ALUMNO.tipoDoc}</b> <b>{ALUMNO.documento}</b>, en éste plantel educativo las áreas
						correspondientes al grado <b>{grado}</b> de la {ALUMNO.nivel} durante el año <b>{year}</b>, obteniendo los
						siguientes resultados:
					</p>
				)}
				<p style={{ margin: '6px 0 0', fontSize: 9 * PT, display: 'flex', gap: 24 }}>
					<span>
						Nro Matrícula: <b>{ALUMNO.matricula}</b>
					</span>
					<span>
						Folio: <b>{ALUMNO.folio}</b>
					</span>
				</p>
			</div>

			<Tabla />

			<p style={{ margin: '8px 0' }}>
				Dado en {ALMENDROS.ciudad} ({ALMENDROS.departamento}) a los 28 días del mes de Septiembre de {ALMENDROS.year}.
			</p>

			{/* ── Las firmas ──────────────────────────────────────────────────────────────────── */}
			<div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 14 }}>
				<Firma cual="rector" nombre={`${ALMENDROS.rector.nombres} ${ALMENDROS.rector.apellidos}`} cc={ALMENDROS.rector.cc} cargo="Rector" />
				<Firma cual="secretaria" nombre={`${ALMENDROS.secretaria.nombres} ${ALMENDROS.secretaria.apellidos}`} cc={ALMENDROS.secretaria.cc} cargo="Secretaria" />
			</div>

			{/* ── La leyenda ──────────────────────────────────────────────────────────────────── */}
			<div style={{ margin: '8px auto 0', width: 'fit-content', fontSize: 7.5 * PT, lineHeight: 1.35 }}>
				<div>
					<b>
						<i>IH:</i>
					</b>{' '}
					Intensidad horaria semanal. {MINUTOS_CLASE} minutos de clase. 40 semanas escolares al año.
				</div>
				<div style={{ display: 'flex', gap: 10 }}>
					{ESCALA.map((e) => (
						<span key={e.nombre}>
							<b>
								<i>D. {e.nombre}:</i>
							</b>{' '}
							de {e.desde} a {e.hasta}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

const Firma: React.FC<{ cual: 'rector' | 'secretaria'; nombre: string; cc: string; cargo: string }> = ({ cual, nombre, cc, cargo }) => (
	<div style={{ width: 250, textAlign: 'center' }}>
		<div style={{ height: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
			<Rubrica cual={cual} ancho={150} />
		</div>
		<div style={{ borderTop: '1px solid #555', paddingTop: 3 }}>{nombre}</div>
		<div style={{ fontSize: 8.5 * PT }}>
			{cargo} · C.C. {cc}
		</div>
	</div>
);

const celda: React.CSSProperties = {
	borderRight: `1px solid ${AZUL_SUAVE}`,
	borderBottom: `1px solid ${AZUL_SUAVE}`,
	padding: '1px 4px',
};

const Tabla: React.FC = () => {
	const periodos = [1, 2, 3, 4];
	let n = 0;
	const filas: React.ReactNode[] = [];
	AREAS.forEach((area, i) => {
		const varias = area.asignaturas.length > 1;
		if (varias) {
			const p1 = promedio(area.asignaturas.map((a) => a.per[0]));
			const p2 = promedio(area.asignaturas.map((a) => a.per[1]));
			const nota = Math.round((p1 + p2) / 2);
			filas.push(
				<tr key={area.area} style={{ fontWeight: 700 }}>
					<td style={{ ...celda, textAlign: 'center' }}>{i + 1}</td>
					<td style={celda}>{area.area}</td>
					<td style={celda} />
					{periodos.map((p) => (
						<td key={p} style={{ ...celda, textAlign: 'center' }}>
							{p === 1 ? Math.round(p1) : p === 2 ? Math.round(p2) : ''}
						</td>
					))}
					<td style={{ ...celda, textAlign: 'center' }}>{desempeno(nota)}</td>
					<td style={{ ...celda, textAlign: 'center', borderRight: 0 }}>{nota}</td>
				</tr>,
			);
		}
		area.asignaturas.forEach((a) => {
			n++;
			const nota = Math.round(promedio(a.per));
			const fondo = n % 2 === 0 ? BANDA_TENUE : undefined;
			filas.push(
				<tr key={a.materia} style={{ background: fondo }}>
					<td style={{ ...celda, textAlign: 'center' }}>{varias ? '' : i + 1}</td>
					<td style={{ ...celda, paddingLeft: varias ? 19 : 4 }}>
						<b>{a.materia}</b>
						<span style={{ fontSize: 7 * PT, marginLeft: 5 }}>{a.profesor}</span>
					</td>
					<td style={{ ...celda, textAlign: 'center' }}>{a.ih}</td>
					{periodos.map((p) => {
						const v = p <= 2 ? a.per[p - 1] : null;
						const pierde = v !== null && v < MINIMA;
						return (
							<td key={p} style={{ ...celda, textAlign: 'center', fontWeight: pierde ? 700 : 400, color: pierde ? ROJO : undefined }}>
								{v ?? ''}
							</td>
						);
					})}
					<td style={{ ...celda, textAlign: 'center' }}>{desempeno(nota)}</td>
					<td style={{ ...celda, textAlign: 'center', borderRight: 0, fontWeight: nota < MINIMA ? 700 : 400, color: nota < MINIMA ? ROJO : undefined }}>{nota}</td>
				</tr>,
			);
		});
	});

	const todas = AREAS.flatMap((a) => a.asignaturas);
	const ih = todas.reduce((s, a) => s + a.ih, 0);
	const pp1 = Math.round(promedio(todas.map((a) => a.per[0])));
	const pp2 = Math.round(promedio(todas.map((a) => a.per[1])));
	const total = Math.round(promedio(todas.map((a) => promedio(a.per))));

	const th: React.CSSProperties = { ...celda, background: BANDA, color: AZUL_TEXTO, fontWeight: 700, borderBottom: `1.2px solid ${AZUL}`, textAlign: 'center' };

	return (
		<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, border: `1px solid ${AZUL}`, borderRadius: 5, fontSize: 8 * PT, lineHeight: 1.15 }}>
			<thead>
				<tr>
					<th style={{ ...th, width: 24 }}>NO</th>
					<th style={{ ...th, textAlign: 'left' }}>ÁREAS</th>
					<th style={{ ...th, width: 26 }}>IH</th>
					{[1, 2, 3, 4].map((p) => (
						<th key={p} style={{ ...th, width: 34 }}>
							Per{p}
						</th>
					))}
					<th style={{ ...th, width: 66 }}>ESCALA NACIONAL</th>
					<th style={{ ...th, width: 70, borderRight: 0 }}>ESCALA VALORATIVA</th>
				</tr>
			</thead>
			<tbody>
				{filas}
				<tr style={{ fontWeight: 700 }}>
					{['', 'Total', ih, pp1, pp2, '', '', desempeno(total)].map((v, k) => (
						<td key={k} style={{ ...celda, borderBottom: 0, borderTop: `1.5px solid ${AZUL}`, background: BANDA_TENUE, textAlign: k === 1 ? 'left' : 'center' }}>
							{v}
						</td>
					))}
					<td style={{ ...celda, borderBottom: 0, borderRight: 0, borderTop: `1.5px solid ${AZUL}`, background: BANDA_TENUE, textAlign: 'center' }}>
						<b>{total}</b>
					</td>
				</tr>
			</tbody>
		</table>
	);
};
