import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ANCHO_LISTA, ASIGNATURAS, BOTONES, LISTA } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS»: EL VESTÍBULO DEL DOCENTE.
 *
 * De esta pantalla salen cinco de las seis pantallas con las que un docente trabaja --unidades,
 * planilla, definitivas, rúbricas y, abajo, comportamiento-- y **ninguna de ellas tiene entrada en
 * el menú**, porque todas llevan identificador y el contrato del proyecto lo prohíbe
 * (`contracts/menu-y-rutas.md`, regla 1). O sea que este vestíbulo no es una comodidad: **es la
 * puerta**, y por eso todos los vídeos del docente empiezan pasando por aquí.
 *
 * SE MONTA COMO TODO EN ESTA CASA: el título se escribe, las filas van llegando en cascada. El
 * principio está en `comunes/movimiento.ts` y vale igual para un vídeo de ayuda que para uno
 * promocional -- lo que cambia en la ayuda es que encima hay un rótulo explicándolo.
 */

const TITULO = 6;
const FILAS = 22;
const PASO_FILA = 6;

export const MisAsignaturas: React.FC<{
	/** Cuándo se va, para que entre la planilla. */
	salidaEn: number;
	/** La fila que el ratón tiene encima, o `null`. */
	senalada?: number | null;
}> = ({ salidaEn, senalada = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const texto = 'Mis asignaturas';
	const cursor = escribiendo(frame, texto, TITULO, 2) && frame % 20 < 12;
	const fueraTitulo = seVa(frame, 0, salidaEn, 4);

	return (
		/*
		 * EL ANCHO VA ESCRITO, NO HEREDADO. Aquí falló una vez y no dio ningún error: dejando que la
		 * fila se estirara sola, el ancho que salía era el de su contenido --unos 810 en vez de los
		 * 1.128 de la pantalla--, y entonces `rectanguloDelBoton()` señalaba **el cuarto botón en vez
		 * del segundo**. El foco y el puntero se equivocaban juntos y a la vez, que es lo peor: como
		 * los dos salen de la misma cuenta, se apuntaban mutuamente que estaban bien.
		 *
		 * Con el ancho escrito, lo que el guion calcula y lo que se dibuja salen del mismo número.
		 */
		<div style={{ width: ANCHO_LISTA, height: '100%', padding: `${LISTA.arriba}px ${LISTA.lados}px`, boxSizing: 'border-box' }}>
			<div style={{ height: LISTA.titulo, opacity: 1 - fueraTitulo, transform: `translateY(${-fueraTitulo * 24}px)` }}>
				<div style={{ fontSize: 30, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
					{escrito(frame, texto, TITULO, 2)}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</div>
				<div style={{ fontSize: 17, color: TEXTO_TENUE, marginTop: 8 }}>
					{ASIGNATURAS.length} asignaturas en el año en curso
				</div>
			</div>

			{ASIGNATURAS.map((a, i) => {
				const llegada = llega(frame, fps, i, FILAS, PASO_FILA);
				const fuera = estiloDeSalida(seVa(frame, i + 1, salidaEn, 4));

				return (
					<div
						key={`${a.materia}-${a.grupo}`}
						style={{
							display: 'flex',
							alignItems: 'center',
							width: ANCHO_LISTA - LISTA.lados * 2,
							height: LISTA.fila,
							boxSizing: 'border-box',
							marginBottom: LISTA.hueco,
							padding: '0 18px',
							borderRadius: 10,
							border: `1px solid ${BORDE}`,
							background: SUPERFICIE,
							boxShadow: senalada === i ? `0 0 0 2px ${ACENTO}55` : '0 1px 2px rgba(15, 28, 52, .05)',
							opacity: llegada.opacidad * fuera.opacidad,
							transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
						}}
					>
						{/*
						  * EL BLOQUE DE COLOR CON LA SIGLA DEL GRUPO. En la aplicación es lo que permite
						  * encontrar la fila sin leerla: un docente con trece asignaturas reconoce «9B»
						  * por su color antes de llegar a la palabra.
						  */}
						<div
							style={{
								width: 54,
								height: 54,
								borderRadius: 10,
								background: a.color,
								color: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 19,
								fontWeight: 700,
							}}
						>
							{a.sigla}
						</div>

						<div style={{ marginLeft: 16, flex: 1 }}>
							<div style={{ fontSize: 19, fontWeight: 600, color: TEXTO }}>
								{a.materia} <span style={{ color: TEXTO_TENUE, fontWeight: 500 }}>· {a.grupo}</span>
							</div>
							<div style={{ fontSize: 15, color: TEXTO_TENUE, marginTop: 4 }}>{a.resumen}</div>
						</div>

						<div style={{ display: 'flex', gap: LISTA.boton.hueco }}>
							{BOTONES.map((b) => (
								<div
									key={b}
									style={{
										width: LISTA.boton.ancho,
										height: LISTA.boton.alto,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: 8,
										border: `1px solid ${b === 'Planilla' ? ACENTO : BORDE}`,
										color: b === 'Planilla' ? '#fff' : TEXTO,
										background: b === 'Planilla' ? ACENTO : SUPERFICIE,
										fontSize: 15,
										fontWeight: 600,
									}}
								>
									{b}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};
