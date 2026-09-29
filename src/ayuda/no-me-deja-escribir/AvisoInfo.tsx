import React from 'react';

import { ACENTO, TEXTO } from '../../notas/tema';

/*
 * EL AVISO DE ARRIBA DE LA PLANILLA: un `nz-alert` de tipo info con su icono (`planilla-notas.html`,
 * `avisoDePeriodo`). Es el de `docente-asistencia/Faltas.tsx` con el texto como parámetro y sitio
 * para dos renglones, y con un RELEVO: cuando el caso cambia, el texto viejo se apaga y el nuevo
 * se enciende en la misma caja, que no se mueve.
 */
export const AvisoInfo: React.FC<{
	alto: number;
	texto: string;
	/** El texto de antes, mientras se apaga, y cuánto va del relevo (0 = el de antes, 1 = el nuevo). */
	antes?: string | null;
	t?: number;
}> = ({ alto, texto, antes = null, t = 1 }) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			height: alto,
			display: 'flex',
			alignItems: 'center',
			gap: 14,
			padding: '0 20px',
			borderRadius: 8,
			border: '1px solid #91caff',
			background: '#e6f4ff',
			boxSizing: 'border-box',
			fontSize: 22,
			lineHeight: 1.35,
			color: TEXTO,
		}}
	>
		<svg width="24" height="24" viewBox="0 0 22 22" style={{ flexShrink: 0 }}>
			<circle cx="11" cy="11" r="10" fill={ACENTO} />
			<rect x="9.9" y="9.2" width="2.2" height="7" rx="1.1" fill="#fff" />
			<circle cx="11" cy="6.4" r="1.3" fill="#fff" />
		</svg>
		<div style={{ position: 'relative', flex: 1, height: '100%' }}>
			{antes !== null && t < 1 && <Texto texto={antes} opacidad={1 - t} />}
			<Texto texto={texto} opacidad={antes !== null ? t : 1} />
		</div>
	</div>
);

const Texto: React.FC<{ texto: string; opacidad: number }> = ({ texto, opacidad }) => (
	<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', opacity: opacidad }}>{texto}</div>
);
