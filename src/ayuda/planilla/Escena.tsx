import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Escena as EscenaPlanilla } from '../../notas/Escena';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE, HUECO_DE_LA_AYUDA, SUBE_LA_PANTALLA } from '../tema';
import { pasoEn } from '../tiempos';
import { MisAsignaturas } from './MisAsignaturas';
import { Efecto } from '../voz';
import { AVISO_DURA, CIERRE, DURACION, EL_HISTORIAL, LLEGADA, PASOS, PUNTOS, RITMO_TECLEAR, TARJETA } from './guion';
import { ColumnaHistorial, DialogoHistorial } from './Historial';
import { CORRE, HISTORIAL, historialEnElFotograma } from './historial-geometria';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL PRIMER VÍDEO DE AYUDA, ENTERO. Lo que hace este fichero es **encadenar**, no dibujar:
 *
 *     · la cáscara y «Mis asignaturas» las pinta `ayuda/`
 *     · la planilla la pinta `notas/Escena`, la MISMA del vídeo promocional, con otro ritmo
 *     · la cabecera, los rótulos, el foco y la tarjeta los pinta la capa de ayuda
 *
 * QUE LA PLANILLA SEA LA MISMA NO ES AHORRO, ES LO ÚNICO QUE HACE QUE ESTO SE SOSTENGA. Con ochenta
 * vídeos por delante, una segunda planilla «la de ayuda» se separaría de la buena al tercer cambio
 * de la aplicación, y entonces habría dos pantallas distintas enseñándose como si fueran una.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL PASO DE UN ACTO AL OTRO NO ES UN CORTE
 *
 * La cáscara **se acerca y se apaga** --como si se entrara en la pantalla-- y la planilla se monta
 * después con el movimiento de la casa. Un corte seco entre dos encuadres distintos se lee como dos
 * vídeos pegados, y lo que hay que entender es que **es el mismo sitio**: se pulsó un botón y se
 * abrió lo de dentro.
 */

export const EscenaAyudaPlanilla: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	/* Lo que la cámara se ha corrido para el historial, y dónde cae la celda que se pulsa. */
	const corrido = interpolate(frame, [EL_HISTORIAL.seCorre, EL_HISTORIAL.yaCorrida], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
	const celda = (() => {
		const r = historialEnElFotograma(HISTORIAL.celda(0), EL_HISTORIAL.llegaCelda - LLEGADA.entraLaPlanilla, RITMO_TECLEAR.SALIDA);
		return { x: r.x + r.ancho / 2 - 20, y: r.y + r.alto / 2 };
	})();

	/* La cáscara deja de pintarse cuando ya se ha ido del todo: detrás de la planilla no hace nada. */
	const enLaCascara = frame < LLEGADA.entraLaPlanilla;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{enLaCascara && <ActoDeLlegada frame={frame} fps={fps} />}

			{/*
			  * LA PLANILLA, con `<Sequence>`: sus tiempos están escritos desde cero en `RITMO_TECLEAR` y
			  * aquí sólo se dice CUÁNDO empieza. Es el mismo aparejo que usa `combinado/Escena.tsx`.
			  */}
			{/*
			  * Y AL FINAL, EL HISTORIAL: la cámara se corre a la izquierda para que quepa la última
			  * columna, que se pinta encima del panel con el `sobre` de la escena (ver `Historial.tsx`).
			  */}
			<AbsoluteFill style={{ transform: `translateX(${-CORRE * corrido}px)` }}>
				<Sequence from={LLEGADA.entraLaPlanilla}>
					<EscenaPlanilla
						ritmo={RITMO_TECLEAR}
						avisoDura={AVISO_DURA}
						ajuste={{ escala: HUECO_DE_LA_AYUDA, y: SUBE_LA_PANTALLA }}
						sobre={
							<ColumnaHistorial
								aparece={EL_HISTORIAL.seCorre - LLEGADA.entraLaPlanilla}
								seVa={RITMO_TECLEAR.SALIDA - 6}
								senalada={frame >= EL_HISTORIAL.llegaCelda && frame < EL_HISTORIAL.abreDialogo + 4 ? 0 : null}
							/>
						}
					/>
				</Sequence>
			</AbsoluteFill>

			<DialogoHistorial abre={EL_HISTORIAL.abreDialogo} cierra={EL_HISTORIAL.cierraDialogo} />

			<Cursor
				puntos={[
					{ frame: EL_HISTORIAL.cursorEntra, x: celda.x + 150, y: celda.y + 190 },
					{ frame: EL_HISTORIAL.llegaCelda, x: celda.x, y: celda.y },
				]}
				clics={[EL_HISTORIAL.pulsaCelda]}
				aparece={EL_HISTORIAL.cursorEntra}
				sale={EL_HISTORIAL.cursorSale}
				tam={30}
			/>

			{/*
			  * EL FOCO VA SÓLO EN LA LLEGADA, y no es un descuido. En el menú hay que señalar cuál de
			  * nueve entradas; en la planilla **la pantalla ya se señala sola** --la cruz de la fila y
			  * la columna, el foco de la casilla, el aro-- y un velo encima taparía justo lo que hay
			  * que aprender a reconocer.
			  */}
			<Foco
				recorte={paso?.foco ?? null}
				desde={paso?.desde ?? 0}
				/*
				 * EL FOCO SE APAGA ANTES DE QUE LA CÁSCARA SE VAYA. Si no, el aro se quedaría
				 * recortando un sitio de una pantalla que ya se está yendo, y eso se lee como que
				 * el recuadro señala el fotograma y no la aplicación.
				 */
				hasta={paso?.focoHasta ?? acabaElPaso - 10}
			/>

			{/* Lo que suena de la planilla: cada tecla (alternando las tres) y el aviso cuando vuelve el lote. */}
			{RITMO_TECLEAR.TECLEOS.flatMap((t, i) =>
				[...t.valor].map((_, k) => (
					<Efecto key={`t${i}-${k}`} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[(i * 2 + k) % 3]} en={LLEGADA.entraLaPlanilla + t.empieza + k * RITMO_TECLEAR.POR_TECLA} />
				)),
			)}
			<Efecto cual="aviso" en={LLEGADA.entraLaPlanilla + RITMO_TECLEAR.CONFIRMA} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/*
 * EL ACTO DE LA LLEGADA. El puntero hace tres cosas y cada una tiene su rótulo: abre la sección,
 * entra en «Mis asignaturas», y pulsa el botón de la planilla en la fila de 9°B.
 */
const ActoDeLlegada: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	/* La sección se abre empujando: entre 0 y 1, con muelle, como en la aplicación. */
	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);

	/* La entrada que el ratón tiene encima. Es lo que en la aplicación hace el `:hover`. */
	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaMisAsignaturas && frame < LLEGADA.pulsaMisAsignaturas + 10
			? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
			: null;

	/* Y la fila de la lista que el ratón tiene encima, ya en «Mis asignaturas». */
	const filaSenalada = frame >= LLEGADA.llegaBoton && frame < LLEGADA.pulsaBoton + 10 ? 1 : null;

	/* La cáscara entra de golpe --es el marco, no el contenido-- y al final se acerca y se apaga. */
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [LLEGADA.seVaLaCascara, LLEGADA.entraLaPlanilla], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			{/*
			  * DOS CAPAS Y NO UNA, Y LA RAZÓN ES EL PUNTERO. La de fuera coloca la aplicación en el
			  * fotograma y hace el acercamiento del final; la de dentro la encoge desde su esquina.
			  * Así **las coordenadas de dentro siguen siendo las de la aplicación**: el puntero va a
			  * «Académico» con la altura que dice `alturaDeEntrada()`, sin saber a qué escala se está
			  * pintando. En una sola capa habría que convertir cada punto a mano, y el día que la
			  * escala cambiara el puntero señalaría al vecino sin que nada avisara.
			  */}
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
						{frame >= LLEGADA.montaLista && (
							<Sequence from={LLEGADA.montaLista}>
								<MisAsignaturas salidaEn={LLEGADA.pulsaBoton - LLEGADA.montaLista} senalada={filaSenalada} />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaAcademico, ...PUNTOS.academico },
							{ frame: LLEGADA.llegaMisAsignaturas, ...PUNTOS.misAsignaturas },
							{ frame: LLEGADA.dejaMisAsignaturas, ...PUNTOS.misAsignaturas },
							{ frame: LLEGADA.llegaBoton, ...PUNTOS.botonPlanilla },
						]}
						clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaMisAsignaturas, LLEGADA.pulsaBoton]}
						aparece={LLEGADA.cursorEntra}
						sale={LLEGADA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const DURACION_AYUDA_PLANILLA = DURACION;
