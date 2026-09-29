import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ALMENDROS, Escudo, Rubrica } from '../colegio';
import { ALUMNO } from '../certificado-imprimir/datos';
import { BARRA, HOJA_CONSTANCIA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CONSTANCIA DE ESTUDIO (`paginas/informes/constancia/constancia-estudio.html`), con la barra de
 * mandos que la aplicación pone encima de la hoja y que no se imprime.
 *
 * EL FORMATO Y LOS TEXTOS FIJOS SON LOS DE LA APLICACIÓN: el escudo del año SIEMPRE que exista (esta
 * hoja no usa las plantillas de certificado), el nombre del colegio y su «texto bajo el membrete»,
 * «CONSTANCIA DE ESTUDIO» con «Año lectivo», el párrafo con «HACEN CONSTAR QUE» en su renglón, la
 * tabla de cinco datos --ni una nota--, «Se expide a solicitud del interesado…», la vigencia de 30
 * días (casilla encendida por defecto), «Dada en…» y las dos firmas con sitio para el sello.
 *
 * NO LLEVA CONSECUTIVO, NI FOLIO, NI FOTO: está decidido así en la cabecera del componente.
 *
 * LO QUE SE LLENA ES INVENTADO: colegio, escudo, rector, secretaria, alumno, documento y firmas.
 */

const AZUL = '#1f4e79';
const AZUL_TEXTO = '#173859';
const AZUL_SUAVE = '#9db8d2';
const BANDA_TENUE = '#f2f7fc';
const PT = 96 / 72;

export const Constancia: React.FC<{ desde: number; vigencia?: boolean }> = ({ desde, vigencia = true }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const hoja = entra(frame, fps, desde, 16);

	return (
		<div style={{ width: HOJA_CONSTANCIA.ancho, opacity: hoja, transform: `translateY(${(1 - hoja) * 18}px)` }}>
			<Mandos vigencia={vigencia} />
			<div
				style={{
					width: HOJA_CONSTANCIA.ancho,
					height: HOJA_CONSTANCIA.alto,
					boxSizing: 'border-box',
					padding: '52px 60px 56px',
					background: '#fff',
					color: '#000',
					fontFamily: 'Arial, Helvetica, sans-serif',
					fontSize: 10 * PT,
					lineHeight: 1.5,
					display: 'flex',
					flexDirection: 'column',
					gap: 14 * 1.2,
					border: '1px solid #d9d9d9',
					boxShadow: '0 24px 64px rgba(15, 28, 52, .18), 0 2px 8px rgba(15, 28, 52, .07)',
				}}
			>
				<header style={{ display: 'flex', alignItems: 'flex-start', gap: 14, borderBottom: `2px solid ${AZUL}`, paddingBottom: 8 }}>
					<Escudo tam={62} />
					<div style={{ flex: 1 }}>
						<div style={{ fontWeight: 700, fontSize: 13 * PT, color: AZUL_TEXTO, lineHeight: 1.2 }}>{ALMENDROS.nombrePapel}</div>
						<div style={{ fontSize: 8 * PT, lineHeight: 1.35, color: '#4d4d4d', marginTop: 2 }}>
							{ALMENDROS.encabezado + ALMENDROS.encabezadoAnadido}
						</div>
					</div>
				</header>

				<div style={{ textAlign: 'center', marginTop: 6 }}>
					<div style={{ fontWeight: 700, fontSize: 13 * PT, letterSpacing: '0.06em', color: AZUL_TEXTO }}>CONSTANCIA DE ESTUDIO</div>
					<div style={{ fontSize: 8.5 * PT, color: '#606060' }}>Año lectivo {ALMENDROS.year}</div>
				</div>

				<p style={{ margin: 0, textAlign: 'justify' }}>
					El suscrito Rector y la secretaria del <b>{ALMENDROS.nombrePapel}</b>, de carácter {ALMENDROS.caracter}, calendario {ALMENDROS.calendario}, jornada{' '}
					{ALMENDROS.jornada},
					<b style={{ display: 'block', textAlign: 'center', letterSpacing: '0.08em', margin: '8px 0', color: AZUL_TEXTO }}>HACEN CONSTAR QUE</b>
					el estudiante <b>{ALUMNO.nombre}</b>, identificado con {ALUMNO.tipoDocLargo} n.º <b>{ALUMNO.documento}</b>,{' '}
					<b>se encuentra matriculado y cursando actualmente</b> el grado <b>{ALUMNO.grupo}</b> durante el año lectivo <b>{ALMENDROS.year}</b> en este
					plantel educativo.
				</p>

				<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, border: `1px solid ${AZUL}`, borderRadius: 5 }}>
					<tbody>
						{FILAS.map(([k, v], i) => (
							<tr key={k} style={{ background: i % 2 === 1 ? BANDA_TENUE : undefined }}>
								<th style={{ width: '38%', textAlign: 'left', fontWeight: 600, padding: '2px 6px', borderRight: `1px solid ${AZUL_SUAVE}`, borderBottom: i < FILAS.length - 1 ? `1px solid ${AZUL_SUAVE}` : 0 }}>{k}</th>
								<td style={{ padding: '2px 6px', borderBottom: i < FILAS.length - 1 ? `1px solid ${AZUL_SUAVE}` : 0 }}>{v}</td>
							</tr>
						))}
					</tbody>
				</table>

				<p style={{ margin: 0, textAlign: 'justify' }}>
					Se expide a solicitud del interesado, para los fines que estime convenientes.{' '}
					{vigencia && <i>La presente constancia tiene una vigencia de treinta (30) días a partir de su expedición.</i>}
				</p>

				<p style={{ margin: '6px 0 0', textAlign: 'justify' }}>
					Dada en{' '}
					<b>
						{ALMENDROS.ciudad} ({ALMENDROS.departamento})
					</b>
					, a los 28 días del mes de septiembre de {ALMENDROS.year}.
				</p>

				<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', gap: 24, marginTop: 'auto', paddingTop: 56 }}>
					<Firma cual="rector" nombre={`${ALMENDROS.rector.nombres} ${ALMENDROS.rector.apellidos}`} cc={ALMENDROS.rector.cc} rol="Rector" />
					<Firma cual="secretaria" nombre={`${ALMENDROS.secretaria.nombres} ${ALMENDROS.secretaria.apellidos}`} cc={ALMENDROS.secretaria.cc} rol="Secretaria" />
				</div>
			</div>
		</div>
	);
};

export const FILAS: [string, string][] = [
	['Grado y grupo', ALUMNO.grupo],
	['Jornada', ALMENDROS.jornada],
	['Estado de la matrícula', 'Matriculado'],
	['Fecha de matrícula', ALUMNO.fechaMatricula],
	['Número de matrícula', ALUMNO.matricula],
];

const Firma: React.FC<{ cual: 'rector' | 'secretaria'; nombre: string; cc: string; rol: string }> = ({ cual, nombre, cc, rol }) => (
	<div style={{ flex: 1, maxWidth: '46%', textAlign: 'center', minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
		<div style={{ height: 46, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: -6 }}>
			<Rubrica cual={cual} ancho={140} />
		</div>
		<div style={{ borderTop: '1px solid #444', marginTop: 4 }} />
		<div style={{ fontWeight: 600, marginTop: 3 }}>{nombre}</div>
		<div style={{ fontSize: 8.5 * PT }}>C.C. {cc}</div>
		<div style={{ fontSize: 8.5 * PT, color: '#555' }}>{rol}</div>
	</div>
);

/*
 * LA BARRA DE MANDOS de la hoja (`.mandos`, `hidden-print`): el título, el alumno con su grado, la
 * casilla «Vigencia 30 días» --encendida por defecto--, recargar e imprimir. El desplegable del año
 * no sale: sólo aparece si el alumno tiene matrícula en más de un año.
 */
const Mandos: React.FC<{ vigencia: boolean }> = ({ vigencia }) => (
	<div
		style={{
			height: BARRA.alto,
			marginBottom: BARRA.hueco,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			gap: 10,
			padding: '0 14px',
			background: '#fff',
			border: '1px solid #ececec',
			borderRadius: 10,
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		}}
	>
		<span style={{ fontSize: 19, fontWeight: 700, color: TEXTO, whiteSpace: 'nowrap' }}>Constancia de estudio</span>
		<span style={{ marginRight: 'auto', fontSize: 15, color: TEXTO_TENUE, whiteSpace: 'nowrap' }}>
			{ALUMNO.nombreLista} · {ALUMNO.grupo}
		</span>
		<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14.5, color: TEXTO, whiteSpace: 'nowrap' }}>
			<span style={{ width: 17, height: 17, borderRadius: 4, boxSizing: 'border-box', background: vigencia ? ACENTO : '#fff', border: `1px solid ${vigencia ? ACENTO : BORDE}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
				{vigencia && (
					<svg width="11" height="11" viewBox="0 0 16 16" aria-hidden>
						<path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				)}
			</span>
			Vigencia 30 días
		</span>
		<BotonIcono>
			<path d="M13 8 A5 5 0 1 1 11.5 4.5 M13 2.5 V5 H10.5" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</BotonIcono>
		<BotonIcono>
			<path d="M4.5 6 V2.5 H11.5 V6 M3 6 H13 V11 H3 Z M5 9.5 H11 V13.5 H5 Z" fill="none" stroke={TEXTO} strokeWidth="1.4" strokeLinejoin="round" />
		</BotonIcono>
	</div>
);

const BotonIcono: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ width: 34, height: 34, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<svg width="17" height="17" viewBox="0 0 16 16" aria-hidden>
			{children}
		</svg>
	</div>
);
