import React from 'react';
import { AbsoluteFill, Sequence, interpolate } from 'remotion';

import { Cursor, Punto } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { LA_QUE_SE_ABRE } from '../planilla/datos';
import { PUNTOS_LLEGADA, TiemposDeLlegada } from '../planilla-nota-rapida/Llegada';
import { MENU } from '../mis-desempenos/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA LLEGADA A UNA PANTALLA DE UNA ASIGNATURA DE 9°B: Académico -> Mis asignaturas -> un botón de
 * la fila. Es `planilla-nota-rapida/Llegada` con dos cosas más, y por eso no se toca aquélla:
 *
 *   - el BOTÓN de la fila es cualquiera (Planilla, Rúbricas…): se pasa su punto;
 *   - el puntero puede DETENERSE por el camino (`paradas`): mientras el rótulo habla de otra cosa
 *     de la cáscara --el selector del periodo, por ejemplo-- el puntero no cruza la pantalla a
 *     cámara lenta hacia el botón, que es lo que haría interpolando de un extremo al otro.
 */

export const LlegadaA: React.FC<{
	frame: number;
	fps: number;
	t: TiemposDeLlegada;
	/** El centro del botón que se pulsa, en coordenadas de la cáscara. Por defecto, «Planilla». */
	boton?: { x: number; y: number };
	paradas?: Punto[];
	/** La fila de Mis asignaturas que se resalta al llegar al botón. Por defecto, la de 9°B. */
	fila?: number;
}> = ({ frame, fps, t, boton = PUNTOS_LLEGADA.botonPlanilla, paradas = [], fila = LA_QUE_SE_ABRE }) => {
	const academico = entra(frame, fps, t.abreAcademico, 16);

	const senalada = frame >= t.llegaAcademico && frame < t.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= t.llegaMisAsignaturas && frame < t.pulsaMisAsignaturas + 10
			? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
			: null;

	const filaSenalada = frame >= t.llegaBoton && frame < t.pulsaBoton + 10 ? fila : null;

	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraLaPlanilla], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const puntos: Punto[] = [
		{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
		{ frame: t.llegaAcademico, ...PUNTOS_LLEGADA.academico },
		{ frame: t.llegaMisAsignaturas, ...PUNTOS_LLEGADA.misAsignaturas },
		...paradas,
		{ frame: t.llegaBoton, ...boton },
	].sort((a, b) => a.frame - b.frame);

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
					{/* El menú de hoy: «Mis competencias» y no «Mis desempeños» (ver `mis-desempenos/datos.ts`). */}
					<Cascara menu={MENU} academico={academico} senalada={senalada}>
						{frame >= t.montaLista && (
							<Sequence from={t.montaLista}>
								<MisAsignaturas salidaEn={t.pulsaBoton - t.montaLista} senalada={filaSenalada} />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={puntos}
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
