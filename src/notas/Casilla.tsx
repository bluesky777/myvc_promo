import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	ACENTO, ARO_DEGRADADO, ARO_MOSAICO, ARO_VUELTA_S, BORDE, PERDIDA_LETRA, PERDIDA_LINEA,
	SUPERFICIE, SUPERIOR_LETRA, SUPERIOR_LINEA, TEXTO,
} from './tema';
import { MINIMA_ACEPTADA, NOTA_ALTA } from './planilla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * UNA CASILLA DE NOTA, CON SU ARO. Es la pieza que este clip existe para enseñar.
 *
 * EL ARO ES UN RECTÁNGULO RELLENO QUE SE VE COMO UN BORDE, y no un `border`: un borde no puede
 * llevar un degradado que se mueva. Va colocado en absoluto, sobresaliendo 5 px por cada lado, y la
 * casilla --que es opaca y va encima-- deja ver sólo esos 5 px. Es lo mismo, línea por línea, que
 * hace `comunes/estilos/casilla-de-nota.scss` en la aplicación.
 *
 * EL CAMPO VA POR DELANTE DEL ARO y hay que decirlo: un elemento en absoluto se pinta encima del
 * contenido normal aunque vaya antes en el HTML. Posicionando el `<input>`, manda el orden del HTML.
 */

interface Props {
	/** Lo que se ve escrito. Cadena vacía es la casilla vacía. */
	valor: string;
	/** La casilla que el docente está escribiendo: lleva el foco y el cursor. */
	foco?: boolean;
	/**
	 * SI EL FOCO LLEVA CURSOR DE ESCRITURA. Se apaga cuando la casilla está señalada pero **nadie
	 * está tecleando** -- el ratón por encima, por ejemplo. Un cursor parpadeando donde no se escribe
	 * dice que se está escribiendo, y eso es una mentira pequeña que se nota.
	 */
	conCursor?: boolean;
	/** Fotograma en el que se encendió el aro. `null` mientras lo que se ve es lo que hay en la base. */
	aroDesde?: number | null;
	/** Fotograma en el que el lote confirmó. Antes de él, el aro sigue puesto. */
	confirmadoEn?: number | null;
	ancho?: number;
}

/*
 * EL COLOR DE LA NOTA, con la misma regla que la planilla: por debajo del mínimo aceptado va en rojo
 * y en negrita --perder es lo que hay que ver desde el otro lado de la mesa--, y de la escala más
 * alta para arriba, en azul. La casilla vacía no lleva ninguna de las dos.
 */
function marcaDe(valor: string): 'perdida' | 'superior' | null {
	if (valor.trim() === '') { return null; }
	const n = Number(valor);
	if (Number.isNaN(n)) { return null; }
	if (n < MINIMA_ACEPTADA) { return 'perdida'; }
	if (n >= NOTA_ALTA) { return 'superior'; }
	return null;
}

export const Casilla: React.FC<Props> = ({ valor, foco = false, conCursor = true, aroDesde = null, confirmadoEn = null, ancho = 92 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const marca = marcaDe(valor);

	/*
	 * EL DEGRADADO QUE CORRE. En CSS son 0,8 s en bucle infinito; aquí el bucle se calcula, porque un
	 * render por fotogramas no ejecuta animaciones de CSS -- cada fotograma es una foto suelta.
	 * Desplaza EXACTAMENTE un mosaico, que es lo que lo hace continuo y sin tirón.
	 */
	const vuelta = ARO_VUELTA_S * fps;
	const corrido = ((frame % vuelta) / vuelta) * ARO_MOSAICO;

	/* El aro entra con un muelle corto: en la aplicación aparece de golpe, pero en vídeo eso se pierde. */
	const entrada = aroDesde === null || frame < aroDesde
		? 0
		: spring({ frame: frame - aroDesde, fps, config: { damping: 13, mass: 0.4 }, durationInFrames: 12 });

	/*
	 * Y SE VA CUANDO EL LOTE CONFIRMA. Se abre un poco al desvanecerse: es la lectura de «esto ya
	 * salió», y a 30 fotogramas por segundo un corte seco se lee como un fallo de pintado.
	 */
	const apagado = confirmadoEn === null
		? 0
		: interpolate(frame - confirmadoEn, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const aroVisible = entrada * (1 - apagado);

	/* El cursor parpadea, salvo justo después de una tecla: ahí se queda quieto, como el de verdad. */
	const cursorEncendido = frame % 30 < 18;

	const colorLinea = marca === 'perdida' ? PERDIDA_LINEA : marca === 'superior' ? SUPERIOR_LINEA : foco ? ACENTO : BORDE;
	const tinte = marca === 'perdida'
		? 'linear-gradient(rgb(230 25 0 / 12%), rgb(230 25 0 / 12%))'
		: marca === 'superior'
			? 'linear-gradient(rgb(87 181 227 / 12%), rgb(87 181 227 / 12%))'
			: 'none';

	return (
		<span style={{ position: 'relative', display: 'inline-block' }}>
			{aroVisible > 0.001 && (
				<span
					style={{
						position: 'absolute',
						inset: -5,
						borderRadius: 11,
						pointerEvents: 'none',
						backgroundImage: ARO_DEGRADADO,
						backgroundSize: `${ARO_MOSAICO}px 100%`,
						backgroundPosition: `${corrido}px 0`,
						opacity: aroVisible,
						transform: `scale(${1 + apagado * 0.14})`,
					}}
				/>
			)}

			{/*
			  * LA CASILLA. Fondo OPACO y el tinte de la marca encima como imagen, y eso no es un adorno:
			  * con la casilla translúcida se vería el aro ENTERO por debajo del número --el degradado
			  * corriendo detrás de la nota-- en vez de un marco de 5 px. Está medido en pantalla en la
			  * aplicación, el 2026-08-29.
			  */}
			<span
				style={{
					position: 'relative',
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: ancho,
					height: 46,
					borderRadius: 7,
					border: `1px solid ${colorLinea}`,
					backgroundColor: SUPERFICIE,
					backgroundImage: tinte,
					boxShadow: foco && marca === null ? `0 0 0 3px ${ACENTO}22` : 'none',
					color: marca === 'perdida' ? PERDIDA_LETRA : marca === 'superior' ? SUPERIOR_LETRA : TEXTO,
					fontWeight: marca === 'perdida' ? 700 : 500,
					fontSize: 23,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{valor}
				{foco && conCursor && (
					<span
						style={{
							width: 2,
							height: 24,
							marginLeft: 2,
							background: TEXTO,
							opacity: cursorEncendido ? 1 : 0,
						}}
					/>
				)}
			</span>
		</span>
	);
};
