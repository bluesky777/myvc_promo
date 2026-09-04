import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { CON_ROTULO } from '../comunes/encuadre';
import { Escena as EscenaNotas } from '../notas/Escena';
import { CONFIRMA } from '../notas/guion';
import { FUENTE } from '../notas/tema';
import { ActoB } from '../rubricas/Escena';
import { B_PANEL, SALIDA as R_SALIDA, DURACION as R_DURACION } from '../rubricas/guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS DOS EN UNO: SE CALIFICA A MANO, SE GUARDA EL LOTE, Y **DESDE ESA MISMA PANTALLA** SE SIGUE A
 * LA RÚBRICA.
 *
 * NO ES PEGAR LOS DOS CLIPS. Los dos sueltos empiezan cada uno montando su pantalla, así que
 * pegados se vería la planilla construirse dos veces. Aquí la planilla se monta UNA vez, se usa, y
 * **cuando el aviso del lote se va**, el puntero vuelve a entrar y aparece «Calificar con rúbrica»
 * sobre una casilla. Ése es el hilo: el docente no cambió de tarea, siguió con la misma.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * CÓMO SE ENGANCHAN, QUE ES LA ÚNICA PIEZA NUEVA
 *
 * `<Sequence>` **desplaza el fotograma que ven sus hijos**. O sea que el acto de la rúbrica puede
 * reutilizarse tal cual, con sus tiempos escritos desde cero en `rubricas/guion.ts`, y aquí sólo se
 * dice CUÁNDO empieza. Sin eso habría que parametrizar cada constante del otro clip -- y entonces
 * los dos guiones se irían separando, que es exactamente lo que no se quiere: **el clip de rúbricas
 * suelto y esta segunda mitad tienen que ser el mismo vídeo**.
 *
 * La planilla se va en `SALE_LA_PLANILLA`; la rúbrica entra 24 fotogramas después. Ese hueco no es
 * un descuido: es lo que hace que se lean como dos momentos y no como dos capas superpuestas.
 */

/** El aviso del lote se va antes de que vuelva el puntero: dos cosas moviéndose a la vez no se leen. */
const DURA_EL_AVISO = 58;

const RUBRICA = {
	fila: 0,
	columna: 1,
	cursor: 250,
	llega: 268,
	boton: 270,
	clic: 292,
};

const SALE_LA_PLANILLA = 300;

/** Cuándo arranca el acto de la rúbrica, en fotogramas de ESTE clip. */
const ENTRA_LA_RUBRICA = SALE_LA_PLANILLA + 24;

/*
 * `Sequence` empieza a contar en cero, y el acto de la rúbrica no aparece hasta su `B_PANEL`. Así
 * que la secuencia arranca antes, para que su fotograma 128 caiga donde queremos.
 */
const DESPLAZAMIENTO = ENTRA_LA_RUBRICA - B_PANEL;

export const DURACION_COMBINADO = DESPLAZAMIENTO + R_DURACION;

export const EscenaCombinada: React.FC<{ conRotulo?: boolean }> = ({ conRotulo = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill style={{ transform: conRotulo ? `translateY(-52px) scale(${CON_ROTULO})` : undefined }}>
				<Sequence durationInFrames={SALE_LA_PLANILLA + 60} layout="none">
					<EscenaNotas salidaEn={SALE_LA_PLANILLA} avisoDura={DURA_EL_AVISO} rubrica={RUBRICA} />
				</Sequence>

				<Sequence from={DESPLAZAMIENTO} layout="none">
					<ActoB frame={frame - DESPLAZAMIENTO} fps={fps} />
				</Sequence>
			</AbsoluteFill>

			{conRotulo && <Rotulo frame={frame} />}
		</AbsoluteFill>
	);
};

/*
 * EL RÓTULO CAMBIA A MITAD DE CLIP, y tiene que cambiar: son dos afirmaciones distintas y la segunda
 * no se sostiene sobre la primera. Se va con la planilla y vuelve con la rúbrica, en el mismo sitio.
 */
const FRASES = [
	{ desde: 30, hasta: SALE_LA_PLANILLA, titulo: 'Sabes qué está guardado.', pie: 'El aro marca la nota que aún no ha salido. Un aviso por tanda, no uno por nota.' },
	{ desde: DESPLAZAMIENTO + 198, hasta: DESPLAZAMIENTO + R_SALIDA, titulo: 'Y la nota se puede defender.', pie: 'La rúbrica no da un número: da la cuenta de dónde salió, criterio por criterio.' },
];

const Rotulo: React.FC<{ frame: number }> = ({ frame }) => (
	<>
		{FRASES.map((f) => {
			const a = interpolate(frame, [f.desde, f.desde + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const b = interpolate(frame, [f.hasta, f.hasta + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const o = a * b;
			if (o <= 0.001) { return null; }

			return (
				<div
					key={f.titulo}
					style={{ position: 'absolute', left: 96, bottom: 62, opacity: o, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)` }}
				>
					<div style={{ fontSize: 46, fontWeight: 700, color: '#0f1c34', letterSpacing: -0.6 }}>{f.titulo}</div>
					<div style={{ fontSize: 27, color: '#4a5872', marginTop: 8 }}>{f.pie}</div>
				</div>
			);
		})}
	</>
);
