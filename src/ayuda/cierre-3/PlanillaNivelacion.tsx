import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { Hueco } from '../../comunes/Hueco';
import { entra, llega } from '../../comunes/movimiento';
import { Casilla } from '../../notas/Casilla';
import { ALUMNOS, CABECERA, COLUMNAS, MINIMA_ACEPTADA, NOTA_ALTA, total } from '../../notas/planilla';
import { ACENTO, BORDE, PERDIDA_LETRA, SUPERFICIE, SUPERIOR_LETRA, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ALTO_FILA, ALTO_PANEL, ALTO_SUBCOLUMNA, ALTO_UNIDAD, ANCHOS, ANCHO_PANEL, ANCHO_TABLA, ARRIBA_AVISO, ARRIBA_MODO,
	ARRIBA_TABLA, COLUMNA_NIVELADA, ENCUADRE_PL, INICIAL, NOTAS, PERDIDAS, PL, QUEDA, TEXTOS, UNIDAD, VALENTINA,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PLANILLA EN LA SEMANA DE NIVELACIONES. Quieta: nadie teclea en ella. Lo que cambia es:
 *
 *   1. arriba, el aviso del periodo (`avisoDePeriodo`, en azul de información);
 *   2. la casilla «Modo nivelación»: al marcarla, lo que no se puede nivelar se apaga a un cuarto
 *      (`planilla-notas.scss:294`) y la pista dice cuántas casillas quedan;
 *   3. al registrar, la casilla del quiz enseña lo que quedó y, pequeño y tachado a la izquierda,
 *      la valoración inicial (`casilla__original`, `planilla-notas.html:646`).
 *
 * Todo con las medidas de `notas/Escena.tsx`, para que sea la misma planilla que en los vídeos de
 * antes. Se pinta a su tamaño y se escala entera en `ENCUADRE_PL`.
 */

export const PlanillaNivelacion: React.FC<{
	/** Todo relativo al fotograma de la escena. */
	monta: number;
	/** Cuándo se marca «Modo nivelación». */
	modoDesde: number;
	/** Cuándo la casilla ya enseña lo que quedó. */
	niveladaDesde: number;
	/** El ratón encima de la casilla del quiz de Valentina (el borde de color del `:hover`). */
	encima: boolean;
	seVa: number;
}> = ({ monta, modoDesde, niveladaDesde, encima, seVa }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < monta) { return null; }

	const f = frame - monta;
	const panel = entra(frame, fps, monta, 14);
	const conModo = frame >= modoDesde;
	const apagado = interpolate(frame, [modoDesde, modoDesde + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const nivelada = frame >= niveladaDesde;

	const notas = NOTAS.map((fila, i) => fila.map((n, c) => (nivelada && i === VALENTINA && c === COLUMNA_NIVELADA ? QUEDA : n)));

	const e = ENCUADRE_PL;

	return (
		<div
			style={{
				position: 'absolute',
				left: e.x,
				top: e.y,
				width: ANCHO_PANEL,
				height: ALTO_PANEL,
				transformOrigin: '0 0',
				transform: `scale(${e.escala})`,
				opacity: panel * (1 - seVa),
			}}
		>
			<div
				style={{
					position: 'relative',
					width: ANCHO_PANEL,
					height: ALTO_PANEL,
					boxSizing: 'border-box',
					padding: ANCHOS.relleno,
					borderRadius: 14,
					background: SUPERFICIE,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 14, height: PL.titulo }}>
					<span style={{ fontSize: 30, fontWeight: 600, color: TEXTO }}>{CABECERA.asignatura}</span>
					<span style={{ fontSize: 22, color: ACENTO, fontWeight: 600 }}>{CABECERA.grupo}</span>
					<span style={{ fontSize: 19, color: TEXTO_TENUE }}>· {CABECERA.periodo}</span>
				</div>

				{/* El aviso del periodo: `nz-alert` de información. */}
				<div
					style={{
						position: 'absolute',
						left: ANCHOS.relleno,
						top: ARRIBA_AVISO,
						width: ANCHO_TABLA,
						height: PL.aviso,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 16px',
						borderRadius: 8,
						border: '1px solid #91caff',
						background: '#e6f4ff',
						fontSize: 17,
						color: TEXTO,
						opacity: entra(frame, fps, monta + 10, 12),
					}}
				>
					<Info />
					{TEXTOS.aviso}
				</div>

				{/* El «Modo nivelación»: casilla, pista, y el enlace a la lista del grupo. */}
				<div
					style={{
						position: 'absolute',
						left: ANCHOS.relleno,
						top: ARRIBA_MODO,
						width: ANCHO_TABLA,
						height: PL.modo,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						paddingLeft: 14,
						boxSizing: 'border-box',
						fontSize: 17,
						color: TEXTO,
						opacity: entra(frame, fps, monta + 16, 12),
					}}
				>
					<Check marcado={conModo} />
					<span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{TEXTOS.modo}</span>
					<span style={{ fontSize: 15.5, color: TEXTO_TENUE, opacity: apagado, flex: '0 1 auto' }}>{conModo ? TEXTOS.pistaModo : ''}</span>
					<span style={{ marginLeft: 'auto', color: ACENTO, fontSize: 15.5, whiteSpace: 'nowrap', paddingRight: 6 }}>{TEXTOS.lista}</span>
				</div>

				<div
					style={{
						position: 'absolute',
						left: ANCHOS.relleno,
						top: ARRIBA_TABLA,
						width: ANCHO_TABLA,
						border: `1px solid ${BORDE}`,
						borderRadius: 6,
						overflow: 'hidden',
					}}
				>
					<Cabecera />

					{ALUMNOS.map((alumno, fila) => {
						const nace = llega(frame, fps, fila, monta + 20, 5);
						const suma = total(notas[fila]);
						return (
							<div
								key={alumno.nombre}
								style={{
									display: 'flex',
									height: ALTO_FILA,
									alignItems: 'center',
									borderBottom: fila === ALUMNOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
									backgroundColor: fila % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
									opacity: nace.opacidad,
									transform: `translateY(${nace.y}px)`,
								}}
							>
								<Hueco ancho={ANCHOS.num}>
									<span style={{ color: TEXTO_TENUE, fontSize: 21 }}>{fila + 1}</span>
								</Hueco>
								<Hueco ancho={ANCHOS.alumno} izquierda>
									<Avatar tipo={alumno.sexo} variante={fila} tam={42} />
									<span style={{ fontSize: 21, marginLeft: 14 }}>{alumno.nombre}</span>
								</Hueco>

								{COLUMNAS.map((col, c) => {
									const n = notas[fila][c];
									const nivelable = PERDIDAS.some((p) => p.fila === fila && p.c === c) || (nivelada && fila === VALENTINA && c === COLUMNA_NIVELADA);
									const esLaNivelada = nivelada && fila === VALENTINA && c === COLUMNA_NIVELADA;
									const conBorde = encima && fila === VALENTINA && c === COLUMNA_NIVELADA;
									return (
										<Hueco key={col} ancho={ANCHOS.nota}>
											<span style={{ position: 'relative', display: 'inline-block', opacity: nivelable ? 1 : 1 - apagado * 0.75 }}>
												{/* El borde del color del colegio al pasar por encima de una casilla nivelable. */}
												<span style={{ position: 'absolute', inset: -3, borderRadius: 9, boxShadow: conBorde ? `0 0 0 2px ${ACENTO}` : 'none' }} />
												{esLaNivelada && (
													<s style={{ position: 'absolute', left: 7, top: 3, zIndex: 1, fontSize: 15, color: TEXTO_TENUE }}>{INICIAL}</s>
												)}
												<Casilla valor={n === null ? '' : String(n)} />
											</span>
										</Hueco>
									);
								})}

								<Hueco ancho={ANCHOS.total}>
									<span style={{ fontSize: 22, fontWeight: 600, color: colorDeNota(suma), fontVariantNumeric: 'tabular-nums' }}>{suma ?? ''}</span>
								</Hueco>
								<Hueco ancho={ANCHOS.falta}>
									<Falta n={alumno.ausencias} />
								</Hueco>
								<Hueco ancho={ANCHOS.falta} ultimo>
									<Falta n={alumno.tardanzas} />
								</Hueco>
							</div>
						);
					})}
				</div>
			</div>
			{f < 0 && null}
		</div>
	);
};

function colorDeNota(n: number | null): string {
	if (n === null) { return TEXTO; }
	if (n < MINIMA_ACEPTADA) { return PERDIDA_LETRA; }
	if (n >= NOTA_ALTA) { return SUPERIOR_LETRA; }
	return TEXTO;
}

const Falta: React.FC<{ n: number }> = ({ n }) => (
	<span style={{ fontSize: 21, color: n === 0 ? TEXTO_TENUE : TEXTO, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
);

const Cabecera: React.FC = () => {
	const letra: React.CSSProperties = { fontSize: 19, fontWeight: 600 };
	return (
		<div style={{ display: 'flex', backgroundColor: 'rgb(128 128 128 / 14%)', borderBottom: `1px solid ${BORDE}` }}>
			<Hueco ancho={ANCHOS.num} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}><span style={letra}>No</span></Hueco>
			<Hueco ancho={ANCHOS.alumno} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} izquierda><span style={letra}>Alumno</span></Hueco>
			<div style={{ width: ANCHOS.nota * COLUMNAS.length, borderRight: `1px solid ${BORDE}` }}>
				<div style={{ height: ALTO_UNIDAD, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDE}` }}>
					<span style={letra}>{UNIDAD}</span>
				</div>
				<div style={{ display: 'flex', height: ALTO_SUBCOLUMNA }}>
					{COLUMNAS.map((c, i) => (
						<Hueco key={c} ancho={ANCHOS.nota} ultimo={i === COLUMNAS.length - 1}><span style={letra}>{c}</span></Hueco>
					))}
				</div>
			</div>
			<Hueco ancho={ANCHOS.total} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}><span style={letra}>Total</span></Hueco>
			<Hueco ancho={ANCHOS.falta} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}><span style={letra}>Aus</span></Hueco>
			<Hueco ancho={ANCHOS.falta} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} ultimo><span style={letra}>Tard</span></Hueco>
		</div>
	);
};

const Check: React.FC<{ marcado: boolean }> = ({ marcado }) => (
	<span
		style={{
			width: 22,
			height: 22,
			boxSizing: 'border-box',
			borderRadius: 5,
			border: `1.5px solid ${marcado ? ACENTO : '#bfbfbf'}`,
			background: marcado ? ACENTO : SUPERFICIE,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			flex: '0 0 auto',
		}}
	>
		{marcado && (
			<svg width="14" height="14" viewBox="0 0 14 14">
				<path d="M2.8 7.2 L5.8 10 L11.2 4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)}
	</span>
);

const Info: React.FC = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" style={{ flex: '0 0 auto' }}>
		<circle cx="10" cy="10" r="9" fill={ACENTO} />
		<path d="M10 8.6 V14.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
		<circle cx="10" cy="5.9" r="1.2" fill="#fff" />
	</svg>
);
