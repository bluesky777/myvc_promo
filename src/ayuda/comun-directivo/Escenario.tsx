import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Cursor, type Punto } from '../../comunes/Cursor';
import { BORDE, TEXTO } from '../../notas/tema';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { MENU, PANEL } from './lugar';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APLICACIÓN DENTRO DEL FOTOGRAMA, CON EL MENÚ DE RECTORÍA Y CUALQUIER SECCIÓN ABIERTA.
 * Es `montar-el-ano/EnLaCascara` sin la sección fija: encadena, no decide.
 */

export const EnLaCascara: React.FC<{
	abierta: { seccion: number; t: number } | null;
	senalada: { seccion: number; hija: number | null } | null;
	subAbierta?: { hija: string; t: number } | null;
	nietaSenalada?: number | null;
	opacidad?: number;
	acercamiento?: number;
	children?: React.ReactNode;
	/** Lo que va encima de toda la cáscara: un modal con su máscara. */
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
}> = ({ abierta, senalada, subAbierta = null, nietaSenalada = null, opacidad = 1, acercamiento = 0, children, encima, cursor }) => (
	<AbsoluteFill>
		<div
			style={{
				position: 'absolute',
				left: ORIGEN.x,
				top: ORIGEN.y,
				width: MEDIDAS.ancho * ESCALA_CASCARA,
				height: MEDIDAS.alto * ESCALA_CASCARA,
				transformOrigin: '50% 45%',
				transform: acercamiento ? `scale(${1 + acercamiento * 0.07})` : undefined,
				opacity: opacidad,
			}}
		>
			<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
				<Cascara menu={MENU} abierta={abierta} senalada={senalada} subAbierta={subAbierta} nietaSenalada={nietaSenalada}>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);

/*
 * LA PÁGINA: el lienzo gris y el panel blanco. Lo de dentro se coloca **en coordenadas de la
 * cáscara** --el mismo número que usan el foco y el puntero--, porque el envoltorio deshace el
 * desplazamiento del menú y la barra.
 */
export const Pagina: React.FC<{ opacidad?: number; bajada?: number; children?: React.ReactNode }> = ({ opacidad = 1, bajada = 0, children }) => (
	<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f5f7fa' }}>
		<div
			style={{
				position: 'absolute',
				left: PANEL.x - MEDIDAS.menu,
				top: PANEL.y - MEDIDAS.barra - bajada,
				width: PANEL.ancho,
				height: 2000,
				background: '#fff',
				border: `1px solid ${BORDE}`,
				borderRadius: 10,
				boxSizing: 'border-box',
			}}
		/>
		<div style={{ position: 'absolute', left: -MEDIDAS.menu, top: -MEDIDAS.barra - bajada, width: MEDIDAS.ancho, height: 2000, opacity: opacidad, color: TEXTO }}>
			{children}
		</div>
	</div>
);

/** Un trozo colocado en coordenadas de la cáscara. */
export const En: React.FC<{ x: number; y: number; ancho?: number; alto?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
	x, y, ancho, alto, style, children,
}) => <div style={{ position: 'absolute', left: x, top: y, width: ancho, height: alto, ...style }}>{children}</div>;

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ fontSize: 26, fontWeight: 600, lineHeight: '40px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>{children}</div>
);

export const Gris: React.FC<{ tam?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ tam = 15, children, style }) => (
	<div style={{ fontSize: tam, lineHeight: 1.45, color: 'rgba(0,0,0,0.55)', ...style }}>{children}</div>
);
