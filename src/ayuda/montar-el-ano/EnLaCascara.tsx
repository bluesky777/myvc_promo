import React from 'react';
import { AbsoluteFill } from 'remotion';

import { Cursor, type Punto } from '../../comunes/Cursor';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA APLICACIÓN DENTRO DEL FOTOGRAMA, CON EL MENÚ DE RECTORÍA: lo que comparten los seis vídeos de
 * «montar el año». Encadena, no decide: el guion le dice qué sección está abierta, qué entrada tiene
 * el ratón encima, qué pantalla va dentro y por dónde pasa el puntero.
 *
 * Todo lo de dentro va en coordenadas de la cáscara (1440 × 900); aquí se escala una sola vez,
 * con `ESCALA_CASCARA` y `ORIGEN`, que es lo mismo que usa `enElFotograma()` para los focos.
 */

export const REFERENCIAS = entradaDe(MENU_DIRECTIVO, 'Referencias').seccion;
export const ASIGNATURAS = entradaDe(MENU_DIRECTIVO, 'Referencias', 'Asignaturas').hija!;
export const GRUPOS = entradaDe(MENU_DIRECTIVO, 'Referencias', 'Grupos').hija!;

/** La entrada del menú, con Referencias abierta o cerrada, en coordenadas de la cáscara. */
export function rectDelMenu(hija: number | null, abierta: boolean) {
	return {
		x: 0,
		y: alturaEnMenu(MENU_DIRECTIVO, REFERENCIAS, hija, abierta ? REFERENCIAS : null),
		ancho: MEDIDAS.menu,
		alto: hija === null ? MEDIDAS.seccion : MEDIDAS.hija,
	};
}

export const puntoDelMenu = (hija: number | null, abierta: boolean) => {
	const r = rectDelMenu(hija, abierta);
	return { x: 150, y: r.y + r.alto / 2 };
};

/** De dónde sale el puntero al empezar: abajo, sobre la pantalla vacía. */
export const ENTRADA_DEL_PUNTERO = { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 };

export const EnLaCascara: React.FC<{
	/** Cuánto está desplegada Referencias (0..1). */
	referencias: number;
	senalada: { seccion: number; hija: number | null } | null;
	opacidad?: number;
	/** Lo que se acerca la cáscara al salir, como al abrir la planilla en su vídeo. */
	acercamiento?: number;
	/** La pantalla de dentro. */
	children?: React.ReactNode;
	/** Lo que va encima de toda la cáscara: el modal con su máscara. */
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
}> = ({ referencias, senalada, opacidad = 1, acercamiento = 0, children, encima, cursor }) => (
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
				<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: REFERENCIAS, t: referencias }} senalada={senalada}>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);
