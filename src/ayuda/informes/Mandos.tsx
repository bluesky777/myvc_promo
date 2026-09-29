import React from 'react';
import { useCurrentFrame } from 'remotion';

import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { ANCHO, CABEZA, MESA } from './datos';
import { Icono } from './Piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS MANDOS QUE CADA INFORME SUBE A LA CABECERA DEL VISOR (`informes/mandos-del-informe.ts`), y la
 * espera de la mesa mientras llega el papel. Se pintan pegados a la derecha de `derecha`, que es el
 * borde izquierdo del mando que va después.
 */

const ALTO = 30;
const yMando = CABEZA.y + (CABEZA.alto - ALTO) / 2;

/** Un botón pequeño con icono y texto, como los cajones de opciones (`myvc-cajon-de-opciones`). */
export const MandoCajon: React.FC<{ derecha: number; ancho: number; icono: string; rotulo: string; resumen?: string; encima?: boolean }> = ({
	derecha,
	ancho,
	icono,
	rotulo,
	resumen,
	encima = false,
}) => (
	<div
		style={{
			position: 'absolute',
			left: derecha - ancho,
			top: yMando,
			width: ancho,
			height: ALTO,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 6,
			borderRadius: 6,
			border: `1px solid ${encima ? '#4096ff' : BORDE}`,
			background: SUPERFICIE,
			fontSize: 14,
			color: encima ? ACENTO : TEXTO,
			whiteSpace: 'nowrap',
		}}
	>
		<Icono que={icono} tam={15} color={encima ? ACENTO : 'rgba(0,0,0,.65)'} />
		{rotulo}
		{resumen && <span style={{ color: 'rgba(0,0,0,.45)' }}>· {resumen}</span>}
	</div>
);

export const rectDeCajon = (derecha: number, ancho: number) => ({ x: derecha - ancho, y: yMando, ancho, alto: ALTO });

/** «Fondo»: la imagen de fondo del informe (`fondo-del-informe.html`). */
export const MandoFondo: React.FC<{ derecha: number }> = ({ derecha }) => <MandoCajon derecha={derecha} ancho={86} icono="fondo" rotulo="Fondo" />;

/** Una casilla de número con su rótulo delante, como «Días de clase» y «Umbral %». */
export const MandoNumero: React.FC<{ derecha: number; rotulo: string; valor: string | null; conFoco?: boolean; anchoCasilla?: number }> = ({
	derecha,
	rotulo,
	valor,
	conFoco = false,
	anchoCasilla = 64,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'absolute', right: ANCHO - derecha, top: yMando, height: ALTO, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: TEXTO, whiteSpace: 'nowrap' }}>
			{rotulo}
			<div
				style={{
					width: anchoCasilla,
					height: 28,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					padding: '0 8px',
					borderRadius: 6,
					border: `1px solid ${conFoco ? '#4096ff' : BORDE}`,
					boxShadow: conFoco ? '0 0 0 2px rgba(5,145,255,.1)' : undefined,
					background: SUPERFICIE,
					color: valor ? TEXTO : '#bfbfbf',
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{valor ?? '—'}
				{conFoco && <span style={{ color: TEXTO, opacity: frame % 30 < 16 ? 1 : 0 }}>|</span>}
			</div>
		</div>
	);
};

/** La espera en la mesa: el «Trayendo…» de cada informe, con su rueda. */
export const Trayendo: React.FC<{ texto: string }> = ({ texto }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: MESA.ancho, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 16, color: 'rgba(0,0,0,.55)' }}>
			<svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: `rotate(${frame * 12}deg)` }}>
				<circle cx="17" cy="17" r="13" fill="none" stroke="#e6f4ff" strokeWidth="4" />
				<path d="M17 4 A13 13 0 0 1 30 17" fill="none" stroke={ACENTO} strokeWidth="4" strokeLinecap="round" />
			</svg>
			{texto}
		</div>
	);
};
