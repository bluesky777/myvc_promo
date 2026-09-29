import React from 'react';
import { interpolate } from 'remotion';

import { PALETA_CLARA } from '../BarraDeHoy';
import { FUENTE } from '../tema';
import { ANIOS, COL_PERIODOS, D, PANEL, TEXTOS, rectDeAnio, rectDePeriodo } from './datos';

/*
 * EL DESPLEGABLE DEL SELECTOR, encima de la cáscara y en sus coordenadas. Se abre como los de Ant:
 * baja un poco y aparece, en una décima de segundo.
 */

const P = PALETA_CLARA;

export const Desplegable: React.FC<{
	/** 0..1 */
	abierto: number;
	anioElegido: string;
	periodoElegido: number;
	/** Lo que tiene el ratón encima. */
	senalado?: { tipo: 'anio'; anio: string } | { tipo: 'periodo'; n: number } | null;
}> = ({ abierto, anioElegido, periodoElegido, senalado = null }) => {
	if (abierto <= 0.001) { return null; }
	const anio = ANIOS.find((a) => a.anio === anioElegido)!;

	return (
		<div
			style={{
				position: 'absolute',
				left: PANEL.x,
				top: PANEL.y,
				width: PANEL.ancho,
				height: PANEL.alto,
				boxSizing: 'border-box',
				background: P.superficie,
				borderRadius: 10,
				boxShadow: '0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
				fontFamily: FUENTE,
				color: P.texto,
				opacity: abierto,
				transform: `translateY(${interpolate(abierto, [0, 1], [-8, 0])}px) scaleY(${interpolate(abierto, [0, 1], [0.92, 1])})`,
				transformOrigin: '100% 0',
				zIndex: 10,
			}}
		>
			<div style={{ position: 'absolute', left: D.relleno, top: D.relleno, height: D.cabecera, fontSize: 14, fontWeight: 600, color: P.tenue, display: 'flex', alignItems: 'flex-start' }}>
				{TEXTOS.anios}
			</div>
			<div style={{ position: 'absolute', left: COL_PERIODOS.x - PANEL.x, top: D.relleno, height: D.cabecera, fontSize: 14, fontWeight: 600, color: P.tenue }}>
				{TEXTOS.periodosDe(anioElegido)}
			</div>
			{/* La raya entre las dos columnas. */}
			<div style={{ position: 'absolute', left: D.relleno + D.colAnios + 8, top: D.relleno, width: 1, height: D.cabecera + 4 * D.opcion - 6, background: '#f0f0f0' }} />

			{ANIOS.map((a, i) => (
				<Opcion
					key={a.anio}
					r={rectDeAnio(i)}
					texto={a.anio}
					elegida={a.anio === anioElegido}
					enCurso={a.enCurso}
					encima={senalado?.tipo === 'anio' && senalado.anio === a.anio}
				/>
			))}

			{Array.from({ length: anio.periodos }, (_, k) => k + 1).map((n) => (
				<Opcion
					key={`${anioElegido}-${n}`}
					r={rectDePeriodo(n)}
					texto={`Periodo ${n}`}
					elegida={n === periodoElegido}
					enCurso={anio.periodoEnCurso === n}
					encima={senalado?.tipo === 'periodo' && senalado.n === n}
				/>
			))}

			{/* EL PIE: por qué da igual desde dónde lo cambies. */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: D.pie,
					boxSizing: 'border-box',
					borderTop: '1px solid #f0f0f0',
					padding: '12px 16px',
					display: 'flex',
					gap: 10,
					fontSize: 14,
					lineHeight: 1.45,
					color: '#595959',
				}}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}>
					<circle cx="8" cy="8" r="6.6" fill="none" stroke={P.tenue} strokeWidth="1.4" />
					<circle cx="8" cy="5" r="0.9" fill={P.tenue} />
					<path d="M8 7.2 V11.4" stroke={P.tenue} strokeWidth="1.5" strokeLinecap="round" />
				</svg>
				<span>{TEXTOS.pie}</span>
			</div>
		</div>
	);
};

const Opcion: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; texto: string; elegida: boolean; enCurso: boolean; encima: boolean }> = ({
	r, texto, elegida, enCurso, encima,
}) => (
	<div
		style={{
			position: 'absolute',
			left: r.x - PANEL.x,
			top: r.y - PANEL.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			gap: 8,
			padding: '0 10px',
			borderRadius: 6,
			background: elegida ? `${P.acento}1f` : encima ? '#f5f5f5' : 'transparent',
			color: elegida ? P.acento : P.texto,
			fontSize: 17,
			fontWeight: elegida ? 600 : 400,
			fontVariantNumeric: 'tabular-nums',
			whiteSpace: 'nowrap',
		}}
	>
		{/* El hueco del chulo va siempre, para que las filas no bailen (scss:350). */}
		<span style={{ width: 16, display: 'inline-flex' }}>
			{elegida && (
				<svg width="16" height="16" viewBox="0 0 16 16">
					<path d="M3 8.4 L6.4 11.6 L13 4.8" fill="none" stroke={P.acento} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)}
		</span>
		<span>{texto}</span>
		{enCurso && (
			<span
				style={{
					marginLeft: 4,
					padding: '1px 8px',
					borderRadius: 999,
					background: elegida ? 'rgba(255,255,255,.7)' : `${P.acento}1a`,
					color: P.acento,
					fontSize: 13,
					fontWeight: 600,
				}}
			>
				{TEXTOS.enCurso}
			</span>
		)}
	</div>
);
