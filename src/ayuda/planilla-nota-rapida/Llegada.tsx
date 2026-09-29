import React from 'react';
import { AbsoluteFill, Sequence, interpolate } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS, alturaDeEntrada } from '../medidas';
import { ESCALA_CASCARA, ORIGEN, enElFotograma } from '../encuadre';
import { Cascara } from '../Cascara';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { LA_QUE_SE_ABRE, PLANILLA, rectanguloDelBoton } from '../planilla/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA LLEGADA A LA PLANILLA DE 9°B, más corta que la de `planilla-teclear` y con los mismos pasos:
 * Académico -> Mis asignaturas -> el botón «Planilla» de la fila de 9°B. La comparten los dos vídeos
 * que ocurren en la planilla (la nota rápida y la asistencia): el camino es el mismo y tiene que
 * verse igual en los dos.
 */

export interface TiemposDeLlegada {
	cursorEntra: number;
	llegaAcademico: number;
	pulsaAcademico: number;
	abreAcademico: number;
	llegaMisAsignaturas: number;
	pulsaMisAsignaturas: number;
	montaLista: number;
	llegaBoton: number;
	pulsaBoton: number;
	cursorSale: number;
	seVaLaCascara: number;
	entraLaPlanilla: number;
}

/** La de los dos vídeos: 11 s hasta que la planilla empieza a montarse. */
export const LLEGADA_CORTA: TiemposDeLlegada = {
	cursorEntra: 16,
	llegaAcademico: 52,
	pulsaAcademico: 58,
	abreAcademico: 60,
	llegaMisAsignaturas: 150,
	pulsaMisAsignaturas: 160,
	montaLista: 164,
	llegaBoton: 262,
	pulsaBoton: 282,
	cursorSale: 296,
	seVaLaCascara: 300,
	entraLaPlanilla: 340,
};

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const PUNTOS_LLEGADA = {
	entrada: { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 },
	academico: { x: 150, y: alturaDeEntrada(ACADEMICO, null, false) + MEDIDAS.seccion / 2 },
	misAsignaturas: { x: 150, y: alturaDeEntrada(ACADEMICO, MIS_ASIGNATURAS, true) + MEDIDAS.hija / 2 },
	botonPlanilla: centro(rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA)),
};

export const FOCOS_LLEGADA = {
	academico: enElFotograma({ x: 0, y: alturaDeEntrada(ACADEMICO, null, false), ancho: MEDIDAS.menu, alto: MEDIDAS.seccion }),
	botonPlanilla: enElFotograma(rectanguloDelBoton(LA_QUE_SE_ABRE, PLANILLA)),
};

export const Llegada: React.FC<{ frame: number; fps: number; t: TiemposDeLlegada }> = ({ frame, fps, t }) => {
	const academico = entra(frame, fps, t.abreAcademico, 16);

	const senalada = frame >= t.llegaAcademico && frame < t.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= t.llegaMisAsignaturas && frame < t.pulsaMisAsignaturas + 10
			? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
			: null;

	const filaSenalada = frame >= t.llegaBoton && frame < t.pulsaBoton + 10 ? LA_QUE_SE_ABRE : null;

	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraLaPlanilla], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					transformOrigin: '50% 45%',
					transform: `scale(${1 + seVa * 0.07})`,
					opacity: aparece * (1 - seVa),
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
					<Cascara academico={academico} senalada={senalada}>
						{frame >= t.montaLista && (
							<Sequence from={t.montaLista}>
								<MisAsignaturas salidaEn={t.pulsaBoton - t.montaLista} senalada={filaSenalada} />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaAcademico, ...PUNTOS_LLEGADA.academico },
							{ frame: t.llegaMisAsignaturas, ...PUNTOS_LLEGADA.misAsignaturas },
							{ frame: t.llegaBoton, ...PUNTOS_LLEGADA.botonPlanilla },
						]}
						clics={[t.pulsaAcademico, t.pulsaMisAsignaturas, t.pulsaBoton]}
						aparece={t.cursorEntra}
						sale={t.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
