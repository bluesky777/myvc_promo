import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, llega } from '../../comunes/movimiento';
import { Hueco } from '../../comunes/Hueco';
import { MINIMA_ACEPTADA, NOTA_ALTA } from '../../notas/planilla';
import {
	ACENTO,
	BORDE,
	PERDIDA_LETRA,
	PERDIDA_LINEA,
	SUPERFICIE,
	SUPERIOR_LETRA,
	SUPERIOR_LINEA,
	TEXTO,
	TEXTO_TENUE,
} from '../../notas/tema';
import { ASIGNATURAS, LA_QUE_SE_ABRE } from '../planilla/datos';
import { ALTO_DEF, ANCHO_DEF, ANCHO_PERIODO, COL_DEF, DEF, DEFINITIVAS, ENCUADRE_DEF, Periodo, SUBCOLUMNAS } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «DEFINITIVAS POR PERIODO», A PANTALLA COMPLETA, como la planilla en su vídeo: la cáscara se
 * acerca y se apaga, y esto se monta después.
 *
 * LA COLUMNA QUE IMPORTA ES «AUTO», y va como en la aplicación: texto plano, algo apagado
 * (`opacity: .7`) y **sin redondear** -- es la única nota de la aplicación que no pasa por el pipe
 * `| nota`, porque su sentido es enseñar en qué se diferencia de la Final que está al lado
 * (`definitivas-periodos.ts`, `automaticaDe`). Por eso aquí sale 73.3333 junto a un 73.
 */

const TITULO = 4;
const CHIPS = 16;
const CABECERA = 24;
const FILAS = 34;
const PASO_FILA = 5;
/** Cuándo acaba de entrar la última fila (`llega` dura 18), contado desde que entra la pantalla. */
export const FILAS_DENTRO = FILAS + PASO_FILA * (DEFINITIVAS.length - 1) + 18;

export const Definitivas: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const texto = 'Definitivas por periodo';
	const cursor = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const panel = entra(frame, fps, 0, 14);

	return (
		<div
			style={{
				position: 'absolute',
				left: ENCUADRE_DEF.x,
				top: ENCUADRE_DEF.y,
				width: ANCHO_DEF,
				height: ALTO_DEF,
				transformOrigin: '0 0',
				transform: `scale(${ENCUADRE_DEF.escala})`,
			}}
		>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					padding: DEF.relleno,
					paddingRight: 0,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					borderRadius: 14,
					overflow: 'hidden',
					boxShadow: '0 24px 64px rgba(15, 28, 52, .14), 0 2px 8px rgba(15, 28, 52, .06)',
					opacity: panel,
					/*
					 * EL CORTE DE LA DERECHA: la tabla sigue, y el desvanecido lo dice sin enseñar lo
					 * que este vídeo no explica. Ver `ANCHO_DEF` en `datos.ts`.
					 */
					maskImage: 'linear-gradient(90deg, #000 88%, transparent 100%)',
					WebkitMaskImage: 'linear-gradient(90deg, #000 88%, transparent 100%)',
				}}
			>
				<div style={{ height: DEF.titulo, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
					<div style={{ fontSize: 28, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, texto, TITULO, 2)}
						<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
					</div>
					<div style={{ display: 'flex', gap: 10, opacity: entra(frame, fps, CHIPS, 12), marginRight: 40 }}>
						{['Ocultar ausencias', 'A Excel', 'Recargar'].map((b) => (
							<div key={b} style={{ height: 34, padding: '0 14px', border: `1px solid ${BORDE}`, borderRadius: 6, display: 'flex', alignItems: 'center', fontSize: 15, color: TEXTO }}>
								{b}
							</div>
						))}
					</div>
				</div>

				{/* La tira de asignaturas: la que se abrió va marcada. */}
				<div style={{ height: DEF.chips, display: 'flex', gap: 10, alignItems: 'flex-start', opacity: entra(frame, fps, CHIPS, 12) }}>
					{ASIGNATURAS.map((a, i) => (
						<div
							key={`${a.materia}-${a.grupo}`}
							style={{
								height: 32,
								padding: '0 14px',
								borderRadius: 16,
								display: 'flex',
								alignItems: 'center',
								fontSize: 15,
								fontWeight: i === LA_QUE_SE_ABRE ? 600 : 400,
								color: i === LA_QUE_SE_ABRE ? '#fff' : TEXTO,
								background: i === LA_QUE_SE_ABRE ? ACENTO : 'rgb(128 128 128 / 10%)',
							}}
						>
							{a.materia} · {a.grupo}
						</div>
					))}
				</div>

				<div style={{ height: DEF.hueco }} />

				<div style={{ width: 'max-content', opacity: entra(frame, fps, CABECERA, 12), background: 'rgb(128 128 128 / 14%)', boxShadow: `inset 0 -1px 0 ${BORDE}, inset 0 1px 0 ${BORDE}` }}>
					<div style={{ display: 'flex', width: 'max-content', height: DEF.cab1 + DEF.cab2 }}>
						<Hueco ancho={COL_DEF.no}><Cab>No</Cab></Hueco>
						<Hueco ancho={COL_DEF.nombre} izquierda><Cab>Nombres</Cab></Hueco>
						{[1, 2, 3, 4].map((p) => (
							<div key={p} style={{ width: ANCHO_PERIODO, borderRight: `1px solid ${BORDE}`, boxSizing: 'border-box' }}>
								<div style={{ height: DEF.cab1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
									<Cab>Per{p}</Cab>
								</div>
								<div style={{ display: 'flex', height: DEF.cab2 }}>
									{SUBCOLUMNAS.map((s, i) => (
										<Hueco key={s} ancho={[COL_DEF.auto, COL_DEF.final, COL_DEF.manual, COL_DEF.rec][i]} ultimo={i === 3}>
											<span style={{ fontSize: i >= 2 ? 13 : 15, fontWeight: 600 }}>{s}</span>
										</Hueco>
									))}
								</div>
							</div>
						))}
						<Hueco ancho={140}><Cab>Definitiva</Cab></Hueco>
					</div>
				</div>

				{DEFINITIVAS.map((a, fila) => {
					const llegada = llega(frame, fps, fila, FILAS, PASO_FILA);
					return (
						<div
							key={a.nombre}
							style={{
								display: 'flex',
								/* A lo ancho de lo que lleva: si no, el flex encoge las columnas para caber en el panel. */
								width: 'max-content',
								height: DEF.fila,
								alignItems: 'center',
								backgroundColor: fila % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
								boxShadow: `inset 0 -1px 0 ${BORDE}`,
								opacity: llegada.opacidad,
								transform: `translate(${llegada.x}px, ${llegada.y}px)`,
							}}
						>
							<Hueco ancho={COL_DEF.no}><span style={{ color: TEXTO_TENUE, fontSize: 17 }}>{fila + 1}</span></Hueco>
							<Hueco ancho={COL_DEF.nombre} izquierda><span style={{ fontSize: 17 }}>{a.nombre}</span></Hueco>
							{a.periodos.map((p, i) => <DelPeriodo key={i} p={p} />)}
							<Hueco ancho={140}>{null}</Hueco>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const Cab: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<span style={{ fontSize: 16, fontWeight: 700, color: TEXTO }}>{children}</span>
);

const DelPeriodo: React.FC<{ p: Periodo }> = ({ p }) => (
	<div style={{ display: 'flex', width: ANCHO_PERIODO, height: '100%', borderRight: `1px solid ${BORDE}`, boxSizing: 'border-box' }}>
		<Hueco ancho={COL_DEF.auto}>
			{/* `Number()` y nada más: 73.3333 se queda en 73.3333, y 79.0000 llega como 79. */}
			<span style={{ fontSize: 17, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>{p.auto === null ? '' : String(p.auto)}</span>
		</Hueco>
		<Hueco ancho={COL_DEF.final}><Final n={p.final} /></Hueco>
		<Hueco ancho={COL_DEF.manual}><Casilla marcada={p.manual} /></Hueco>
		<Hueco ancho={COL_DEF.rec} ultimo><Casilla marcada={p.rec} /></Hueco>
	</div>
);

/** El campo de la Final, con los mismos colores que la planilla: rojo si pierde, azul si es alta. */
const Final: React.FC<{ n: number | null }> = ({ n }) => {
	const perdida = n !== null && n < MINIMA_ACEPTADA;
	const alta = n !== null && n >= NOTA_ALTA;
	return (
		<div
			style={{
				width: 58,
				height: 30,
				boxSizing: 'border-box',
				borderRadius: 6,
				border: `1px solid ${perdida ? PERDIDA_LINEA : alta ? SUPERIOR_LINEA : BORDE}`,
				background: perdida ? 'rgba(230, 25, 0, .12)' : SUPERFICIE,
				color: perdida ? PERDIDA_LETRA : alta ? SUPERIOR_LETRA : TEXTO,
				fontWeight: perdida ? 700 : 400,
				fontSize: 17,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontVariantNumeric: 'tabular-nums',
			}}
		>
			{n ?? ''}
		</div>
	);
};

/** La casilla de Ant: cuadrada, y azul con la marca cuando está puesta. */
const Casilla: React.FC<{ marcada: boolean }> = ({ marcada }) => (
	<div
		style={{
			width: 18,
			height: 18,
			boxSizing: 'border-box',
			borderRadius: 4,
			border: `1px solid ${marcada ? ACENTO : BORDE}`,
			background: marcada ? ACENTO : SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{marcada && (
			<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
				<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)}
	</div>
);
