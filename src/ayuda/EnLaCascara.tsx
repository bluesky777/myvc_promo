import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Cursor, type Punto } from '../comunes/Cursor';
import { Cascara } from './Cascara';
import { ESCALA_CASCARA, ORIGEN } from './encuadre';
import { MEDIDAS, SECCIONES, type Seccion } from './medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA CÁSCARA PUESTA EN EL FOTOGRAMA, CON SU PUNTERO: lo que cada vídeo repetía a mano (`ORIGEN`,
 * `ESCALA_CASCARA`, el acercamiento al salir). Es `montar-el-ano/EnLaCascara` sin atarse a un menú:
 * recibe cuál y qué sección va abierta.
 */

export const EnLaCascaraDe: React.FC<{
	menu?: Seccion[];
	abierta: { seccion: number; t: number } | null;
	senalada: { seccion: number; hija: number | null } | null;
	opacidad?: number;
	/** Lo que se acerca la cáscara al salir (0..1), como al abrir la planilla en su vídeo. */
	acercamiento?: number;
	children?: React.ReactNode;
	/** Lo que va encima de la cáscara entera (un diálogo con su máscara). */
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
}> = ({ menu = SECCIONES, abierta, senalada, opacidad = 1, acercamiento = 0, children, encima, cursor }) => (
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
				<Cascara menu={menu} abierta={abierta} senalada={senalada}>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);
