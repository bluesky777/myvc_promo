import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

import { FOCO, VELO } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL VELO CON UN RECORTE: lo que hay que mirar se queda claro y el resto se apaga.
 *
 * POR QUÉ HACE FALTA, Y NO BASTA CON EL PUNTERO. El puntero dice **quién** hizo algo; el foco dice
 * **dónde**. Un menú de nueve secciones a 1080p, visto en el móvil de un docente en la sala de
 * profesores, es una columna de texto pequeño: la flecha llega, pulsa, y quien mira ya ha perdido
 * en cuál de las nueve fue.
 *
 * EL VELO ES FLOJO A PROPÓSITO (`VELO` va al 42 %). Apagarlo más deja la pantalla irreconocible, y
 * entonces el vídeo enseña un recuadro flotando en negro en vez de un sitio **dentro de una
 * pantalla que hay que aprender a reconocer**.
 *
 * SE HACE CON UNA MÁSCARA DE SVG y no con cuatro rectángulos alrededor: con cuatro rectángulos las
 * esquinas redondeadas del hueco no existen, y un hueco de esquinas vivas sobre una aplicación que
 * todo lo tiene redondeado se lee como un fallo de dibujo.
 *
 * LAS COORDENADAS SON LAS DEL FOTOGRAMA (1920 × 1080), no las de la pantalla de dentro. Es la única
 * forma de que el guion pueda señalar algo sin saber a qué escala se está pintando la aplicación en
 * ese momento -- y lo que el guion sabe es lo que se ve, que es el fotograma.
 */

export interface Recorte {
	x: number;
	y: number;
	ancho: number;
	alto: number;
	radio?: number;
}

export const Foco: React.FC<{
	recorte: Recorte | null;
	/** Cuándo se enciende y cuándo se apaga. Fuera de esa ventana no se pinta nada. */
	desde: number;
	hasta: number;
	/** Lo que se tarda en encender. Corto: un velo que tarda se lee como que la pantalla se apagó. */
	dur?: number;
}> = ({ recorte, desde, hasta, dur = 10 }) => {
	const frame = useCurrentFrame();

	if (recorte === null) { return null; }

	const a = interpolate(frame, [desde, desde + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const b = interpolate(frame, [hasta, hasta + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const visible = a * b;

	if (visible <= 0.001) { return null; }

	const radio = recorte.radio ?? 10;
	/* El hueco respira un poco al abrirse: es lo que hace que se lea como que algo se encendió ahí. */
	const crece = interpolate(a, [0, 1], [14, 0]);
	const id = `hueco-${Math.round(recorte.x)}-${Math.round(recorte.y)}`;

	return (
		<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: visible, zIndex: 20 }}>
			<svg width="1920" height="1080" viewBox="0 0 1920 1080">
				<defs>
					<mask id={id}>
						<rect x="0" y="0" width="1920" height="1080" fill="white" />
						<rect
							x={recorte.x - crece}
							y={recorte.y - crece}
							width={recorte.ancho + crece * 2}
							height={recorte.alto + crece * 2}
							rx={radio + crece}
							fill="black"
						/>
					</mask>
				</defs>
				<rect x="0" y="0" width="1920" height="1080" fill={VELO} mask={`url(#${id})`} />
				{/*
				  * EL ARO DEL HUECO. Sin él, el borde entre lo claro y lo apagado es un degradado
				  * suave y el recorte no tiene forma: se ve que hay luz, no que hay UN SITIO.
				  */}
				<rect
					x={recorte.x - crece}
					y={recorte.y - crece}
					width={recorte.ancho + crece * 2}
					height={recorte.alto + crece * 2}
					rx={radio + crece}
					fill="none"
					stroke={FOCO}
					strokeWidth={3}
					opacity={0.9}
				/>
			</svg>
		</div>
	);
};
