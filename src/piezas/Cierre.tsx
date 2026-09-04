import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { CIERRE_REMATE, CONTACTO, PRODUCTO } from './datos';
import {
	C_CONTACTO, C_PASO_CONTACTO, C_PASO_SALIDA, C_POR_TECLA, C_REMATE, C_SALIDA, C_TITULO,
} from './guion';
import { ACENTO, BORDE, FONDO, FUENTE, TEXTO, TINTA_SUAVE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CIERRE. La última pantalla es la única que alguien va a fotografiar con el móvil, así que lo
 * que tiene que estar grande es **el dato de contacto**, no el nombre del producto.
 *
 * LOS DATOS QUE FALTAN SE DIBUJAN COMO HUECO RAYADO, con su etiqueta al lado. No es un descuido: un
 * teléfono inventado en una tarjeta terminada se cuela en el montaje y acaba delante de la Unión.
 * Un hueco rayado no se cuela: se ve desde la otra punta de la sala que ahí falta algo.
 *
 * SE ESCRIBE EL NOMBRE, igual que en la portada: el vídeo se cierra con el mismo gesto con el que se
 * abrió, y eso es lo que hace que las dos piezas se lean como los extremos de una misma cosa.
 */
export const Cierre: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titulo = escrito(frame, PRODUCTO, C_TITULO, C_POR_TECLA);
	const remate = entra(frame, fps, C_REMATE, 18);
	const salTitulo = estiloDeSalida(seVa(frame, 0, C_SALIDA, C_PASO_SALIDA));

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<div
						style={{
							fontSize: 76,
							fontWeight: 700,
							letterSpacing: -1.8,
							color: TEXTO,
							opacity: salTitulo.opacidad,
							transform: `translateX(${salTitulo.x}px) scale(${salTitulo.escala})`,
							whiteSpace: 'pre',
						}}
					>
						{titulo}
						<span style={{ opacity: escribiendo(frame, PRODUCTO, C_TITULO, C_POR_TECLA) && frame % 20 < 12 ? 1 : 0, color: ACENTO }}>|</span>
					</div>
					<div
						style={{
							fontSize: 30,
							color: TINTA_SUAVE,
							marginTop: 14,
							opacity: remate * estiloDeSalida(seVa(frame, 1, C_SALIDA, C_PASO_SALIDA)).opacidad,
							transform: `translateY(${(1 - remate) * 14}px)`,
						}}
					>
						{CIERRE_REMATE}
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 56 }}>
						{CONTACTO.map((c, i) => {
							const llegada = llega(frame, fps, i, C_CONTACTO, C_PASO_CONTACTO, 20);
							const sal = estiloDeSalida(seVa(frame, i + 2, C_SALIDA, C_PASO_SALIDA));
							return (
								<div
									key={c.etiqueta}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 22,
										opacity: llegada.opacidad * sal.opacidad,
										transform: `translate(${llegada.x + sal.x}px, ${llegada.y}px)`,
									}}
								>
									<span style={{ width: 150, textAlign: 'right', fontSize: 26, color: TINTA_SUAVE }}>
										{c.etiqueta}
									</span>
									{c.valor === null ? (
										/* EL HUECO: rayado y con su borde discontinuo. Se ve que falta, no que está vacío. */
										<span
											style={{
												width: 460,
												height: 54,
												borderRadius: 10,
												border: `2px dashed ${BORDE}`,
												background: 'repeating-linear-gradient(135deg, #f2f5f9 0 10px, #e8edf4 10px 20px)',
												display: 'inline-flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: 22,
												color: TINTA_SUAVE,
											}}
										>
											por poner
										</span>
									) : (
										<span style={{ fontSize: 38, fontWeight: 600, color: TEXTO }}>{c.valor}</span>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
