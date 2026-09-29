import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { FUENTE, TINTA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DOS PIEZAS QUE NO SON DE LA APLICACIÓN, y por eso van con la tinta de la capa de ayuda.
 */

/**
 * LA BARRA DE DIRECCIONES DEL NAVEGADOR. El tablero viejo no está en el menú desde el 2026-09-19
 * (`menu.ts`): a `/informes-old` se llega escribiéndolo. La cáscara dibujada no tiene navegador
 * alrededor, así que la barra aparece encima de la ventana mientras se teclea y se va al pulsar
 * Intro. Coordenadas del FOTOGRAMA.
 */
export const BARRA_DIRECCIONES = { x: 360, y: 128, ancho: 1200, alto: 64 };

export const BarraDeDirecciones: React.FC<{ desde: number; teclea: number; intro: number; porTecla?: number; base: string; tramo: string }> = ({
	desde, teclea, intro, porTecla = 3, base, tramo,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < desde || frame > intro + 20) { return null; }
	const a = entra(frame, fps, desde, 12) * interpolate(frame, [intro + 6, intro + 18], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const escrito_ = escrito(frame, tramo, teclea, porTecla);
	const b = BARRA_DIRECCIONES;
	return (
		<div
			style={{
				position: 'absolute',
				left: b.x,
				top: b.y,
				width: b.ancho,
				height: b.alto,
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				padding: '0 22px',
				boxSizing: 'border-box',
				background: '#f1f3f6',
				border: `2px solid ${ACENTO}`,
				borderRadius: 32,
				boxShadow: '0 18px 48px rgba(15, 28, 52, .22)',
				fontFamily: FUENTE,
				fontSize: 30,
				color: TINTA,
				opacity: a,
				transform: `translateY(${(1 - a) * -10}px)`,
				zIndex: 20,
				whiteSpace: 'pre',
			}}
		>
			<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
				<rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke={TEXTO_TENUE} strokeWidth="2" />
				<path d="M8 10 V7.5 a4 4 0 0 1 8 0 V10" fill="none" stroke={TEXTO_TENUE} strokeWidth="2" />
			</svg>
			<span style={{ color: TEXTO_TENUE }}>{base}</span>
			<span style={{ marginLeft: -16, fontWeight: 600 }}>
				{escrito_}
				<span style={{ opacity: frame < intro && frame % 20 < 12 ? 1 : 0 }}>|</span>
			</span>
			<div style={{ flex: 1 }} />
			<span
				style={{
					fontSize: 20,
					fontWeight: 700,
					padding: '4px 12px',
					borderRadius: 8,
					border: `1px solid ${BORDE}`,
					background: frame >= intro && frame < intro + 8 ? `${ACENTO}22` : SUPERFICIE,
					color: TEXTO,
					opacity: frame >= teclea + tramo.length * porTecla ? 1 : 0.3,
				}}
			>
				Intro ↵
			</span>
		</div>
	);
};

/**
 * EL CORTE. Donde la aplicación tarda más de lo que un vídeo puede enseñar entero, la espera se
 * acorta **y se dice**: una pastilla oscura, fuera de la aplicación, con cuánto dura de verdad.
 * Coordenadas del fotograma.
 */
export const Corte: React.FC<{ desde: number; hasta: number; texto: string; x?: number; y?: number }> = ({ desde, hasta, texto, x = 1920 / 2, y = 150 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < desde || frame > hasta + 12) { return null; }
	const a = entra(frame, fps, desde, 10) * interpolate(frame, [hasta, hasta + 12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return (
		<div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', zIndex: 36, opacity: a, transform: `translateX(${x - 1920 / 2}px)` }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					padding: '14px 28px',
					borderRadius: 999,
					background: TINTA,
					color: '#fff',
					fontFamily: FUENTE,
					fontSize: 32,
					fontWeight: 600,
					boxShadow: '0 14px 40px rgba(15, 28, 52, .3)',
				}}
			>
				<svg width="32" height="32" viewBox="0 0 24 24" aria-hidden>
					<circle cx="6" cy="6" r="3" fill="none" stroke="#fff" strokeWidth="2" />
					<circle cx="6" cy="18" r="3" fill="none" stroke="#fff" strokeWidth="2" />
					<path d="M8.5 7.5 L20 18 M8.5 16.5 L20 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
				</svg>
				{texto}
			</div>
		</div>
	);
};

/** La barra de progreso de Ant (`nz-progress`, activa): azul, con el porcentaje a la derecha. */
export const Progreso: React.FC<{ p: number; ancho: number }> = ({ p, ancho }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 12, width: ancho }}>
		<div style={{ flex: 1, height: 10, borderRadius: 5, background: 'rgba(0,0,0,.06)', overflow: 'hidden' }}>
			<div style={{ width: `${p}%`, height: '100%', borderRadius: 5, background: ACENTO }} />
		</div>
		<span style={{ fontSize: 16, color: TEXTO, width: 48, fontVariantNumeric: 'tabular-nums' }}>{Math.round(p)}%</span>
	</div>
);
