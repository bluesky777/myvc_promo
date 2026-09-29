import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { COLEGIO } from '../colegio';
import { CIUDAD, Escudo } from '../cierre-6/Papel';
import {
	AC, ACTA_TEXTOS, ANCHO_CONTENIDO, ANCHO_TRAER, ANCHO_UTIL, GRUPOS, LA_ACADEMICA, PAPEL_EN_PANTALLA, Y_PAPEL,
	rectanguloDeCasilla,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DEL ACTA: los mandos arriba (título, recargar, imprimir), la tarjeta «Qué incluir al
 * imprimir» con sus ocho casillas, y debajo el papel tal como saldrá -- aquí se ve el encabezado,
 * con el aviso de descuadre, que **se imprime a propósito**.
 *
 * LA HOJA ACADÉMICA: al marcarla aparece el botón «Traer las columnas académicas» con la pista de
 * lo que va a tardar. Mientras trae, el botón se queda apagado con su rueda y el texto cuenta los
 * grupos. `listos` lo manda el guion: el primero llega a los 8 s; el resto es el corte.
 */

export const Acta: React.FC<{
	marcaAcademica: number;
	traer: number;
	/** Cuántos grupos han llegado, según el guion. `null` antes de pulsar. */
	listos: number | null;
	acabado: boolean;
	senal?: 'casilla' | 'traer' | null;
}> = ({ marcaAcademica, traer, listos, acabado, senal = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const h1 = ACTA_TEXTOS.h1;
	const conAcademico = frame >= marcaAcademica;
	const trayendo = frame >= traer && !acabado;
	const crece = interpolate(frame, [marcaAcademica, marcaAcademica + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const yPapel = interpolate(crece, [0, 1], [Y_PAPEL(false), Y_PAPEL(true)]);

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', position: 'relative' }}>
			{/* Los mandos. */}
			<div style={{ position: 'absolute', left: AC.lados, top: AC.arriba, width: ANCHO_UTIL, height: AC.mandos, display: 'flex', alignItems: 'center', gap: 14 }}>
				<div style={{ fontSize: 26, fontWeight: 700, color: TEXTO, whiteSpace: 'pre', flex: 1 }}>
					{escrito(frame, h1, 4, 1)}
					<span style={{ opacity: escribiendo(frame, h1, 4, 1) && frame % 20 < 12 ? 1 : 0 }}>|</span>
				</div>
				<BotonIcono>
					<path d="M19 12 a7 7 0 1 1 -2.05 -4.95 M19 4.5 V8 H15.5" fill="none" stroke={TEXTO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
				</BotonIcono>
				<BotonIcono primario>
					<path d="M7 9 V4 H17 V9 M5 9 H19 V16 H5 Z M8 14 H16 V20 H8 Z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
				</BotonIcono>
			</div>

			{/* «Qué incluir al imprimir». */}
			<div
				style={{
					position: 'absolute',
					left: AC.lados,
					top: AC.arriba + AC.mandos,
					width: ANCHO_UTIL,
					padding: AC.pad,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					border: `1px solid ${BORDE}`,
					borderRadius: 12,
					opacity: entra(frame, fps, 14, 12),
				}}
			>
				<div style={{ height: AC.opTitulo, fontSize: 17, fontWeight: 600, color: TEXTO }}>{ACTA_TEXTOS.opcionesTitulo}</div>
				<div style={{ position: 'relative', height: AC.casilla * 4 }}>
					{ACTA_TEXTOS.casillas.map((c, i) => {
						const r = rectanguloDeCasilla(i);
						const puesta = c.puesta || (i === LA_ACADEMICA && conAcademico);
						return (
							<div key={c.texto} style={{ position: 'absolute', left: r.x - AC.lados - AC.pad, top: r.y - (AC.arriba + AC.mandos + AC.pad + AC.opTitulo), height: r.alto, display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: TEXTO }}>
								<Casilla puesta={puesta} encima={i === LA_ACADEMICA && senal === 'casilla'} />
								{c.texto}
							</div>
						);
					})}
				</div>
				<div style={{ height: AC.pista, fontSize: 15, color: TEXTO_TENUE, display: 'flex', alignItems: 'center' }}>{ACTA_TEXTOS.pista}</div>
				{conAcademico && (
					<div style={{ height: AC.academico * crece, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 14, opacity: crece }}>
						<div
							style={{
								width: ANCHO_TRAER,
								height: 40,
								boxSizing: 'border-box',
								borderRadius: 7,
								border: `1px solid ${trayendo ? BORDE : senal === 'traer' ? ACENTO : BORDE}`,
								background: trayendo ? 'rgba(0,0,0,.04)' : SUPERFICIE,
								color: trayendo ? 'rgba(0,0,0,.35)' : senal === 'traer' ? ACENTO : TEXTO,
								fontSize: 16,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 8,
								flexShrink: 0,
							}}
						>
							{trayendo ? <Rueda frame={frame} /> : <Descarga />}
							{trayendo ? ACTA_TEXTOS.trayendo : acabado ? ACTA_TEXTOS.volver : ACTA_TEXTOS.traer}
						</div>
						<span style={{ fontSize: 15, color: TEXTO_TENUE }}>
							{trayendo ? (
								<>Trayendo notas del año: <b style={{ color: TEXTO }}>{listos ?? 0}</b> de {GRUPOS} grupos.</>
							) : (
								<>Son {GRUPOS} llamadas, una por grupo, de unos 8 segundos cada una.</>
							)}
						</span>
					</div>
				)}
			</div>

			{/* El papel, tal como saldrá: el encabezado del acta. */}
			<div
				style={{
					position: 'absolute',
					left: AC.lados,
					top: yPapel,
					width: ANCHO_UTIL,
					height: 900,
					padding: PAPEL_EN_PANTALLA.pad,
					boxSizing: 'border-box',
					background: '#fff',
					boxShadow: '0 6px 20px rgba(15,28,52,.10)',
					opacity: entra(frame, fps, 24, 14),
					color: '#000',
				}}
			>
				<div style={{ height: PAPEL_EN_PANTALLA.titulos, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
					<Escudo tam={64} />
					<div style={{ flex: 1, textAlign: 'center', lineHeight: 1.45 }}>
						<div style={{ fontSize: 17, fontWeight: 700 }}>{COLEGIO.nombre} — {COLEGIO.abreviatura} 2026</div>
						<div style={{ fontSize: 15, fontWeight: 700 }}>COMISIÓN DE EVALUACIÓN Y PROMOCIÓN</div>
						<div style={{ fontSize: 15, fontWeight: 700 }}>ACTA DE REUNIÓN FINAL</div>
						<div style={{ fontSize: 14, fontWeight: 700 }}>DEFINICIÓN DE PROMOCIÓN Y REPROBACIÓN AÑO LECTIVO 2026</div>
					</div>
					<div style={{ width: 64 }} />
				</div>
				<div style={{ height: PAPEL_EN_PANTALLA.preambulo, fontSize: 14, lineHeight: 1.5, textAlign: 'justify' }}>
					Basado en el Sistema de Evaluación y Promoción del {COLEGIO.nombre} de {CIUDAD}, según el MEN la Ley 115 y el
					decreto 1290 del 23 de Abril del 2009, {COLEGIO.resolucion}, siendo las <b>08:30</b> del día <b>2026-11-27</b> del
					año en curso, se reúnen en sus instalaciones la comisión de evaluación y promoción.
				</div>
				<div
					style={{
						height: PAPEL_EN_PANTALLA.aviso - 8,
						boxSizing: 'border-box',
						border: '2px solid #ff4d4f',
						borderRadius: 6,
						padding: '8px 14px',
					}}
				>
					<div style={{ fontSize: 15, fontWeight: 700, color: '#ff4d4f' }}>{ACTA_TEXTOS.descuadreTitulo}</div>
					<div style={{ fontSize: 15, marginTop: 3 }}>{ACTA_TEXTOS.descuadreGrupos}</div>
				</div>
			</div>
		</div>
	);
};

const BotonIcono: React.FC<{ primario?: boolean; children: React.ReactNode }> = ({ primario = false, children }) => (
	<div style={{ width: 44, height: 40, borderRadius: 7, border: `1px solid ${primario ? ACENTO : BORDE}`, background: primario ? ACENTO : SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>{children}</svg>
	</div>
);

const Casilla: React.FC<{ puesta: boolean; encima: boolean }> = ({ puesta, encima }) => (
	<div style={{ width: 20, height: 20, boxSizing: 'border-box', borderRadius: 4, border: `1px solid ${puesta || encima ? ACENTO : BORDE}`, background: puesta ? ACENTO : SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
		{puesta && (
			<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
				<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)}
	</div>
);

const Rueda: React.FC<{ frame: number }> = ({ frame }) => (
	<svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 24}deg)` }} aria-hidden>
		<path d="M12 3 a9 9 0 1 1 -9 9" fill="none" stroke={ACENTO} strokeWidth="3" strokeLinecap="round" />
	</svg>
);

const Descarga: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
		<path d="M12 4 V15 M7 10.5 L12 15.5 L17 10.5 M5 19.5 H19" fill="none" stroke={TEXTO} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
