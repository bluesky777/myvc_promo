import React from 'react';

import { BORDE, TEXTO } from '../notas/tema';

/*
 * UNA CELDA DE CUALQUIERA DE LAS TABLAS: ancho fijo y la raya de la derecha, salvo la última.
 *
 * Está aquí y no dentro de un clip porque **todas las pantallas de la casa son tablas**: la planilla,
 * la matriz de la rúbrica, la parrilla del grupo. Dos copias de esto se separan al tercer clip, y lo
 * que se vería entonces son dos tablas que ya no se parecen entre sí.
 */
export const Hueco: React.FC<{
	ancho: number;
	izquierda?: boolean;
	ultimo?: boolean;
	alto?: number | string;
	arriba?: boolean;
	relleno?: number;
	children?: React.ReactNode;
}> = ({ ancho, izquierda = false, ultimo = false, alto, arriba = false, relleno, children }) => (
	<div
		style={{
			width: ancho,
			height: alto ?? '100%',
			display: 'flex',
			alignItems: arriba ? 'flex-start' : 'center',
			justifyContent: izquierda ? 'flex-start' : 'center',
			padding: relleno ?? 0,
			paddingLeft: relleno ?? (izquierda ? 14 : 0),
			borderRight: ultimo ? 'none' : `1px solid ${BORDE}`,
			color: TEXTO,
			boxSizing: 'border-box',
		}}
	>
		{children}
	</div>
);
