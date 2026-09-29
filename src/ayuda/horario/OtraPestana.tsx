import React from 'react';
import { Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Rejilla } from '../../horarios/Rejilla';
import { R_PANEL } from '../../horarios/guion';
import { BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { FUENTE } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA OTRA PESTAÑA: el programa de horarios montado como web (`horarios.micolevirtual.com`), que
 * `/horario/cuadrar` abre con `window.open` y al que le pasa la sesión por `postMessage`.
 *
 * DENTRO VA LA REJILLA DEL CLIP PROMOCIONAL (`src/horarios/Rejilla.tsx`), sin tocarla: recibe el
 * fotograma por props, así que basta con darle el suyo desplazado. Es el mismo programa --la ruta
 * lo dice: «abre ese mismo programa montado como web»--, y dibujarlo otra vez sería enseñar dos.
 *
 * Va encima de la cáscara, del mismo tamaño y en el mismo sitio, con una tira de pestañas y la
 * barra de direcciones: es lo que dice «esto es otra pestaña» sin una palabra.
 */

const TIRA = 40;
const BARRA = 40;

/**
 * `desde`: el fotograma del vídeo en que la rejilla empieza a montarse. Va dentro de una `Sequence`
 * y no con el fotograma retocado a mano, porque el puntero de la rejilla lee `useCurrentFrame()`:
 * así los dos, rejilla y puntero, ven el mismo reloj.
 */
export const DESFASE = R_PANEL - 2;

export const OtraPestana: React.FC<{ aparece: number; desde: number }> = ({ aparece, desde }) => {
	if (aparece <= 0.001) { return null; }
	const ancho = MEDIDAS.ancho * ESCALA_CASCARA;
	const alto = MEDIDAS.alto * ESCALA_CASCARA;
	return (
		<div
			style={{
				position: 'absolute', left: ORIGEN.x, top: ORIGEN.y, width: ancho, height: alto, borderRadius: 12, overflow: 'hidden', fontFamily: FUENTE,
				background: '#eef2f6', boxShadow: '0 24px 64px rgba(15, 28, 52, .22)', opacity: aparece, transform: `translateY(${(1 - aparece) * 24}px)`, zIndex: 15,
			}}
		>
			<div style={{ height: TIRA, background: '#dfe4ea', display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 12px' }}>
				<Pestana texto="Cuadrar el horario · MyVC" />
				<Pestana texto="Horarios" activa />
			</div>
			<div style={{ height: BARRA, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: `1px solid ${BORDE}` }}>
				<div style={{ flex: 1, height: 28, borderRadius: 14, background: '#f1f3f6', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', fontSize: 15, color: TEXTO }}>
					<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
						<rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke={TEXTO_TENUE} strokeWidth="2" />
						<path d="M8 10 V7.5 a4 4 0 0 1 8 0 V10" fill="none" stroke={TEXTO_TENUE} strokeWidth="2" />
					</svg>
					horarios.micolevirtual.com
				</div>
			</div>
			<div style={{ position: 'absolute', left: 0, right: 0, top: TIRA + BARRA, bottom: 0, overflow: 'hidden' }}>
				<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.66)' }}>
					<Sequence from={desde - DESFASE} layout="none"><RejillaConSuReloj /></Sequence>
				</div>
			</div>
		</div>
	);
};

const Pestana: React.FC<{ texto: string; activa?: boolean }> = ({ texto, activa = false }) => (
	<div style={{ height: 32, width: 230, borderRadius: '9px 9px 0 0', background: activa ? '#fff' : 'transparent', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', fontSize: 14, color: activa ? TEXTO : TEXTO_TENUE, boxSizing: 'border-box' }}>
		<span style={{ width: 14, height: 14, borderRadius: 3, background: activa ? '#1b4d7a' : '#1677ff', flex: 'none' }} />
		<span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{texto}</span>
	</div>
);

const RejillaConSuReloj: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return <Rejilla frame={frame} fps={fps} />;
};
