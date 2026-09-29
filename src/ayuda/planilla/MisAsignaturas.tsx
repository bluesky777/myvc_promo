import React from 'react';

import { MisAsignaturas as MisAsignaturasDeHoy } from '../mis-asignaturas/MisAsignaturas';
import { ASIGNATURAS } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS»: EL VESTÍBULO DEL DOCENTE.
 *
 * De esta pantalla salen las pantallas con las que un docente trabaja --unidades, planilla,
 * definitivas, rúbricas y, abajo, comportamiento-- y **ninguna de ellas tiene entrada en el menú**,
 * porque todas llevan identificador (`contracts/menu-y-rutas.md`, regla 1). Por eso todos los
 * vídeos del docente empiezan pasando por aquí.
 *
 * ES EL DIBUJO DE HOY (`mis-asignaturas/MisAsignaturas.tsx`) con la firma de siempre: los vídeos
 * que la cruzan camino de otra pantalla dicen cuándo se va y qué fila tiene el ratón encima.
 */
export const MisAsignaturas: React.FC<{
	/** Cuándo se va, para que entre la pantalla siguiente. */
	salidaEn: number;
	/** La fila que el ratón tiene encima, o `null`. */
	senalada?: number | null;
	/** El botón «Comportamiento» de «Grupos titularía», señalado. */
	titulariaSenalada?: boolean;
	/** El grupo de la titularía ya tiene notas de comportamiento: no sale «Sin notas…». */
	titulariaConNotas?: boolean;
	/** Por defecto, el periodo 2 sin ninguna cerrada. */
	subtitulo?: string;
}> = ({ salidaEn, senalada = null, titulariaSenalada = false, titulariaConNotas = false, subtitulo }) => (
	<MisAsignaturasDeHoy
		salidaEn={salidaEn}
		filaSenalada={senalada}
		titulariaSenalada={titulariaSenalada}
		titulariaConNotas={titulariaConNotas}
		subtitulo={subtitulo ?? `${ASIGNATURAS.length} asignaturas en el año en curso · periodo 2: 0 de ${ASIGNATURAS.length} cerradas`}
	/>
);
