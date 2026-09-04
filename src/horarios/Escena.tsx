import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { CON_ROTULO } from '../comunes/encuadre';
import { Disponibilidad } from './Disponibilidad';
import { Informe } from './Informe';
import { Rejilla } from './Rejilla';
import { D_SALIDA, G_VEREDICTO, I_PANEL, R_PANEL, R_SALIDA, R_SUELTA, SALIDA } from './guion';
import { FUENTE, TENUE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL PROGRAMA DE HORARIOS, DE PRINCIPIO A FIN.
 *
 * Es **otra aplicación** --escritorio, se instala, funciona con o sin MyVC detrás-- y por eso el
 * clip no se parece a los demás: fondo distinto, color distinto, y ninguna cáscara de colegio.
 *
 * EL ORDEN DE LOS CUATRO ACTOS ES EL ARGUMENTO ENTERO: primero se le dice lo que **no** puede hacer
 * --la iglesia está ocupada--, luego se retoca una lección a mano, y sólo entonces se le pide que
 * cuadre el resto. Al revés --generar primero y corregir después-- es lo que hace que un coordinador
 * no se fíe de lo que le sale.
 */

export const EscenaHorarios: React.FC<{ conRotulo?: boolean }> = ({ conRotulo = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const encoge = conRotulo ? `translateY(-52px) scale(${CON_ROTULO})` : undefined;

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #fbfcfd 0%, #e9eef4 62%, #dde4ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: encoge }}>
				<Disponibilidad frame={frame} fps={fps} />
			</AbsoluteFill>

			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: encoge }}>
				<Rejilla frame={frame} fps={fps} />
			</AbsoluteFill>

			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: encoge }}>
				<Informe frame={frame} fps={fps} />
			</AbsoluteFill>

			{conRotulo && <Rotulo frame={frame} />}
		</AbsoluteFill>
	);
};

/*
 * CUATRO FRASES, UNA POR ACTO. La primera es la que más cuesta vender y la que más vale: **declarar
 * lo que no se puede** parece burocracia hasta que te ahorra rehacer el horario en marzo.
 */
const FRASES = [
	{ desde: 40, hasta: D_SALIDA, titulo: 'Primero, lo que NO se puede.', pie: 'La iglesia está libre dos horas a la semana. El generador no lo adivina: se le dice.' },
	{ desde: R_PANEL + 110, hasta: R_SUELTA + 14, titulo: 'Mover una clase son dos clics.', pie: 'Se suelta encima de otra, y la que estaba se te queda en la mano.' },
	{ desde: G_VEREDICTO + 8, hasta: R_SALIDA, titulo: 'Y el resto lo cuadra él.', pie: 'Con el veredicto entero: cuántas de cuántas, y qué NO tuvo en cuenta.' },
	{ desde: I_PANEL + 40, hasta: SALIDA, titulo: 'Lo que se pega en la puerta del salón.', pie: 'El horario del grupo, con el dibujo de cada materia. Impreso, no en pantalla.' },
];

const Rotulo: React.FC<{ frame: number }> = ({ frame }) => (
	<>
		{FRASES.map((f) => {
			const a = interpolate(frame, [f.desde, f.desde + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const b = interpolate(frame, [f.hasta, f.hasta + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
			const o = a * b;
			if (o <= 0.001) { return null; }

			return (
				<div key={f.titulo} style={{ position: 'absolute', left: 96, bottom: 56, opacity: o, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)`, zIndex: 60 }}>
					<div style={{ fontSize: 44, fontWeight: 700, color: '#101b28', letterSpacing: -0.6 }}>{f.titulo}</div>
					<div style={{ fontSize: 26, color: TENUE, marginTop: 8 }}>{f.pie}</div>
				</div>
			);
		})}
	</>
);
