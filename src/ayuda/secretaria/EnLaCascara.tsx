import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Cursor, type Punto } from '../../comunes/Cursor';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APLICACIÓN DENTRO DEL FOTOGRAMA, CON EL MENÚ DE SECRETARÍA. Es la de `montar-el-ano`, pero con
 * la sección abierta que diga el guion (Personas casi siempre). Encadena, no decide.
 *
 * Todo lo de dentro va en coordenadas de la cáscara (1440 × 900); aquí se escala una sola vez, con
 * `ESCALA_CASCARA` y `ORIGEN`, lo mismo que usa `enElFotograma()` para los focos.
 */

export const EnLaCascara: React.FC<{
	/** La sección desplegada y cuánto (0..1), o `null`. */
	abierta: { seccion: number; t: number } | null;
	senalada: { seccion: number; hija: number | null } | null;
	opacidad?: number;
	/** Lo que se acerca la cáscara al salir. */
	acercamiento?: number;
	children?: React.ReactNode;
	/** Lo que va encima de toda la cáscara: un modal con su máscara. */
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
}> = ({ abierta, senalada, opacidad = 1, acercamiento = 0, children, encima, cursor }) => (
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
			<div
				style={{
					position: 'relative',
					width: MEDIDAS.ancho,
					height: MEDIDAS.alto,
					transformOrigin: '0 0',
					transform: `scale(${ESCALA_CASCARA})`,
				}}
			>
				<Cascara menu={MENU_DIRECTIVO} abierta={abierta} senalada={senalada}>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);
