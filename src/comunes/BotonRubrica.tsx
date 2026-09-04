import React from 'react';
import { interpolate } from 'remotion';

import { ACENTO } from '../notas/tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CALIFICAR CON RÚBRICA», ANCLADO A UNA CASILLA.
 *
 * SE PINTA MUCHO MÁS GRANDE DE LO QUE ES, Y ES A PROPÓSITO. En la aplicación es un icono diminuto en
 * la esquina de la casilla (`.casilla__rubrica`, `0.7rem`) que sólo sale al pasar por encima -- y ahí
 * está bien, porque compite con veintitantas columnas y no puede robarles sitio. Pero **un vídeo no
 * es una pantalla de trabajo**: a su tamaño real no lo vería nadie, y la bondad que se enseña no
 * existiría para quien mira. Lo que se afirma sigue siendo verdad; lo que cambia es el tamaño.
 *
 * EL PIQUITO HACIA ARRIBA NO ES ADORNO: es lo que dice **de qué casilla sale**. Un botón suelto en un
 * lado de la pantalla no diría eso, y entonces no se entendería que la rúbrica califica ESE indicador
 * de ESE alumno.
 */

export const BotonRubrica: React.FC<{ x: number; y: number; visible: number }> = ({ x, y, visible }) => {
	if (visible <= 0.01) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				left: x - 168,
				top: y + 30,
				opacity: visible,
				transform: `translateY(${interpolate(visible, [0, 1], [-10, 0])}px) scale(${interpolate(visible, [0, 1], [0.9, 1])})`,
				transformOrigin: '50% 0%',
				zIndex: 30,
			}}
		>
			<div style={{ width: 0, height: 0, margin: '0 auto', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: `9px solid ${ACENTO}` }} />
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '13px 22px',
					borderRadius: 10,
					background: ACENTO,
					color: '#fff',
					fontSize: 21,
					fontWeight: 600,
					whiteSpace: 'nowrap',
					boxShadow: '0 10px 26px rgba(15,28,52,.24)',
				}}
			>
				<IconoMatriz />
				Calificar con rúbrica
			</div>
		</div>
	);
};

/* La matriz de Ant (`nz-icon nzType="table"`), dibujada: así no hace falta cargar la fuente de iconos. */
export const IconoMatriz: React.FC = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
		<rect x="2.5" y="3.5" width="19" height="17" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
		<path d="M2.5 9.5h19M9 9.5v11" stroke="currentColor" strokeWidth="2" />
	</svg>
);
