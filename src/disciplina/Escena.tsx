import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { CON_ROTULO } from '../comunes/encuadre';
import { FUENTE } from '../notas/tema';
import { Comportamiento } from './Comportamiento';
import { Modal } from './Modal';
import { Rejilla } from './Rejilla';
import { C_SALIDA, D_PANEL, N_APARECE, SALIDA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CLIP LARGO: COMPORTAMIENTO → DISCIPLINA → EL DIÁLOGO → Y LA SITUACIÓN NUEVA EN SU SITIO.
 *
 * Son tres pantallas y un diálogo, encadenados sin un solo corte seco: cada una se monta
 * escribiéndose y se va fila a fila, que es el principio de la casa (`comunes/movimiento.ts`).
 *
 * LO QUE CUENTA, en una frase: **el colegio lleva la convivencia en el mismo sitio donde lleva las
 * notas**, y crear una situación disciplinaria con su respaldo del manual de convivencia es escribir
 * una línea, porque todo lo demás el sistema ya lo sabe.
 */

export const EscenaDisciplina: React.FC<{ conRotulo?: boolean }> = ({ conRotulo = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: conRotulo ? `translateY(-56px) scale(${CON_ROTULO})` : undefined }}>
				<Comportamiento frame={frame} fps={fps} />
			</AbsoluteFill>

			{frame >= D_PANEL - 4 && (
				<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: conRotulo ? `translateY(-56px) scale(${CON_ROTULO})` : undefined }}>
					<Rejilla frame={frame} fps={fps} panelEmpieza={D_PANEL} />
				</AbsoluteFill>
			)}

			<Modal frame={frame} fps={fps} />

			{conRotulo && <Rotulo frame={frame} />}
		</AbsoluteFill>
	);
};

/*
 * TRES FRASES, UNA POR MOMENTO. La del diálogo es la que hay que decir: lo que se enseña ahí no es
 * un formulario, es todo lo que **no** hay que rellenar.
 */
const FRASES = [
	{ desde: 40, hasta: C_SALIDA, titulo: 'El observador, escrito donde se trabaja.', pie: 'Un periodo por pestaña y tres columnas con nombre. No doce campos apilados.' },
	{ desde: D_PANEL + 60, hasta: 470, titulo: 'De un vistazo, dónde hay que mirar.', pie: 'El color es el de la gravedad, y sólo se enciende cuando hay algo dentro.' },
	{ desde: 496, hasta: N_APARECE + 40, titulo: 'Sólo escribes qué pasó.', pie: 'Tipo, fecha, testigos, descargo y los ordinales del manual vienen puestos.' },
];

const Rotulo: React.FC<{ frame: number }> = ({ frame }) => (
	<>
		{FRASES.map((f) => {
			const a = interpolate(frame, [f.desde, f.desde + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const b = interpolate(frame, [f.hasta, f.hasta + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const o = a * b;
			if (o <= 0.001) { return null; }

			return (
				<div key={f.titulo} style={{ position: 'absolute', left: 96, bottom: 58, opacity: o, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)`, zIndex: 60 }}>
					<div style={{ fontSize: 44, fontWeight: 700, color: '#0f1c34', letterSpacing: -0.6 }}>{f.titulo}</div>
					<div style={{ fontSize: 26, color: '#4a5872', marginTop: 8 }}>{f.pie}</div>
				</div>
			);
		})}
	</>
);
