import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ALUMNOS } from '../../notas/planilla';
import { ACENTO, BORDE, SUPERFICIE, TEXTO } from '../../notas/tema';
import { CAJA, FECHAS, HOY } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * UNA CELDA DE AUS O TARD, como la de app2: la casilla con el número (`input.cuenta`) y un botón por
 * falta con su fecha (`button.falta`). Con el periodo cerrado, las dos cosas se apagan
 * (`[disabled]="!periodoAbierto()"`).
 *
 * La casilla guarda **al salir** (`(blur)`), no al teclear: por eso la falta nueva --su botón-- no
 * sale hasta que el foco se va de la casilla y el servidor contesta.
 */

export interface Anotacion {
	fila: number;
	cual: 'ausencias' | 'tardanzas';
	/** El clic en la casilla: se enciende y el número queda seleccionado. */
	pulsa: number;
	/** La tecla: el número nuevo. */
	teclea: number;
	/** El clic fuera: la casilla pierde el foco y sale la petición. */
	suelta: number;
	/** Vuelve el servidor: el botón con la fecha de hoy y el aviso. */
	vuelve: number;
}

export const CeldaDeFalta: React.FC<{
	fila: number;
	cual: 'ausencias' | 'tardanzas';
	anotaciones: Anotacion[];
	apagada?: boolean;
}> = ({ fila, cual, anotaciones, apagada = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const fechas = [...FECHAS[ALUMNOS[fila].nombre][cual]];
	const esta = anotaciones.find((a) => a.fila === fila && a.cual === cual) ?? null;

	const tecleado = esta !== null && frame >= esta.teclea;
	const numero = fechas.length + (tecleado ? 1 : 0);
	const conFoco = esta !== null && frame >= esta.pulsa && frame < esta.suelta;
	const seleccionado = esta !== null && frame >= esta.pulsa + 2 && frame < esta.teclea;
	const nueva = esta !== null && frame >= esta.vuelve;
	if (nueva) { fechas.push(HOY.boton); }

	const cursor = conFoco && tecleado && frame % 30 < 18;

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: CAJA.hueco, width: '100%', paddingLeft: CAJA.izquierda, boxSizing: 'border-box' }}>
			<div
				style={{
					width: CAJA.cuenta.ancho,
					height: CAJA.cuenta.alto,
					flex: 'none',
					borderRadius: 6,
					border: `1px solid ${conFoco ? ACENTO : BORDE}`,
					boxShadow: conFoco ? `0 0 0 3px ${ACENTO}22` : 'none',
					background: apagada ? '#f5f5f5' : SUPERFICIE,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxSizing: 'border-box',
					fontSize: 20,
					color: apagada ? 'rgba(0, 0, 0, 0.25)' : TEXTO,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				<span style={{ background: seleccionado ? '#b3d4ff' : 'transparent', padding: '0 2px', borderRadius: 2 }}>{numero}</span>
				{cursor && <span style={{ width: 2, height: 20, marginLeft: 1, background: TEXTO }} />}
			</div>

			{fechas.map((f, i) => {
				const esLaNueva = nueva && i === fechas.length - 1;
				const a = esLaNueva ? entra(frame, fps, esta!.vuelve, 12) : 1;
				return (
					<div
						key={`${f}-${i}`}
						style={{
							width: CAJA.boton.ancho,
							height: CAJA.boton.alto,
							flex: 'none',
							borderRadius: 5,
							border: `1px solid ${BORDE}`,
							background: apagada ? '#f5f5f5' : SUPERFICIE,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxSizing: 'border-box',
							fontSize: 15,
							color: apagada ? 'rgba(0, 0, 0, 0.25)' : TEXTO,
							whiteSpace: 'nowrap',
							opacity: a,
							transform: `scale(${0.8 + 0.2 * a})`,
						}}
					>
						{f}
					</div>
				);
			})}
		</div>
	);
};

/*
 * EL AVISO DEL PERIODO CERRADO: un `nz-alert` de tipo info con su icono, y el texto exacto de
 * `avisoDePeriodo` para el tramo «cerrado» y un docente.
 */
export const AVISO_CERRADO = 'El periodo 2 está cerrado: no puedes poner notas, ni asistencia, ni nivelar.';

export const AvisoDePeriodo: React.FC<{ alto: number }> = ({ alto }) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			height: alto - 18,
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			padding: '0 18px',
			borderRadius: 8,
			border: '1px solid #91caff',
			background: '#e6f4ff',
			boxSizing: 'border-box',
			fontSize: 20,
			color: TEXTO,
		}}
	>
		<svg width="22" height="22" viewBox="0 0 22 22">
			<circle cx="11" cy="11" r="10" fill={ACENTO} />
			<rect x="9.9" y="9.2" width="2.2" height="7" rx="1.1" fill="#fff" />
			<circle cx="11" cy="6.4" r="1.3" fill="#fff" />
		</svg>
		{AVISO_CERRADO}
	</div>
);
