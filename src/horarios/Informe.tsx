import React from 'react';
import { interpolate } from 'remotion';

import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { ANIO, CATALOGO, COLEGIO, DIAS_SEMANA, GRUPO_DEL_INFORME, HOJA, SALON_DE, TIMBRES } from './datos';
import { I_CABECERA, I_FILAS, I_PANEL, I_PASO_FILA, PASO_SALIDA, SALIDA } from './guion';
import { ICONOS_DE_MATERIA } from './iconos';
import { LINEA, PAPEL, TENUE, TINTA, fichaFondo, fichaLinea, fichaLetra } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL INFORME: EL HORARIO DEL GRUPO **TAL COMO SALE DE LA IMPRESORA**, con sus dibujos.
 *
 * Es el final del clip y es el final del trabajo: lo que el coordinador entrega es papel, y ese
 * papel es lo que se pega en la puerta del salón. Por eso la última pantalla no es la rejilla sino
 * la hoja.
 *
 * LOS DIBUJOS NO SON DECORACIÓN, y ésa es la razón de que este informe cierre el vídeo: a la casilla
 * le sobra sitio debajo del texto --de 19 a 105 px, 33 de mediana, medido sobre hojas impresas-- y
 * ahí va el dibujo de la materia. Un horario que un niño de sexto lee de un vistazo por el dibujo
 * vale más colgado en la pared que uno con tres siglas.
 *
 * LOS ICONOS SON LOS DEL PROGRAMA, copiados de `icono-materia.html`: ver `iconos.ts`.
 *
 * ── LA LICENCIA MÁS GRANDE DE ESTE CLIP, y hay que saberla (2026-09-03) ─────────────────────────
 *
 * Aquí el dibujo va a 52 px dentro de una fila de 96: se ve, y es lo que este clip vende. **En la
 * hoja impresa de verdad ese mismo dibujo está topado a 8 px**, que en papel es una mota
 * (`horario-grupo.scss`, el hueco de la casilla). No es un descuido de ellos: a 32 px las 13 hojas
 * salían en 23 páginas, y bajarlo fue lo que devolvió una hoja por grupo con 8,5 mm de holgura.
 *
 * El que SÍ se lee en el papel es el otro, el que va **en línea con el nombre de la materia** --ése
 * no toca el alto de la fila y no cuesta ninguna página--.
 *
 * O sea que el tamaño de aquí es una licencia de vídeo permitida --el sitio y el tamaño se mueven
 * para que se note--, pero roza el límite: lo que el clip AFIRMA de refilón, que el dibujo del
 * hueco se lee de un vistazo en la pared del salón, hoy sólo es cierto para el icono en línea. Si
 * se quiere que sea cierto para los dos, no es un tope lo que hay que subir: es que la hoja no
 * tiene sitio, y eso lo decide Joseth. Decidido eso, este comentario se actualiza o se borra.
 *
 * Y la distancia puede agrandarse sola: **el tope de 8 px está medido con 13 grupos y 7 franjas**.
 * Un colegio de jornada más larga tiene más filas que hacer caber, así que ese número puede tener
 * que bajar todavía más sin que nadie lo decida.
 *
 * EL SALÓN SÓLO CUANDO NO ES EL AULA DEL GRUPO: repetir el aula siete veces al día no informa de
 * nada y le quita el sitio al docente.
 */

const I = {
	relleno: 34,
	cabecera: 96,
	hora: 96,
	dia: 200,
	cabeceraTabla: 44,
	fila: 96,
};

const ANCHO_TABLA = I.hora + I.dia * DIAS_SEMANA.length;
export const ANCHO_INFORME = ANCHO_TABLA + I.relleno * 2;

export const Informe: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < I_PANEL - 4) { return null; }

	const panel = entra(frame, fps, I_PANEL, 14);
	const panelFuera = interpolate(frame, [SALIDA + 32, SALIDA + 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaCabecera = seVa(frame, 0, SALIDA, PASO_SALIDA);

	return (
		<div style={{ transform: `scale(${ENCUADRE.horarioInforme * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
			<div
				style={{
					width: ANCHO_INFORME,
					padding: I.relleno,
					borderRadius: 10,
					background: PAPEL,
					boxShadow: '0 26px 70px rgba(15, 28, 52, .2), 0 2px 8px rgba(15, 28, 52, .06)',
					boxSizing: 'border-box',
					color: TINTA,
				}}
			>
				{/*
				  * LA CABECERA VA DENTRO DE LA HOJA y no en un encabezado de página del motor:
				  * `position: fixed` repetido en cada página es de lo que los tres WebView hacen
				  * distinto, y una cabecera repetida a medias sale del colegio pegada en una puerta.
				  */}
				<div style={{ height: I.cabecera, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${TINTA}`, marginBottom: 18, opacity: 1 - salidaCabecera, transform: `translateY(${-salidaCabecera * 26}px)` }}>
					<div>
						<div style={{ fontSize: 27, fontWeight: 700, whiteSpace: 'pre' }}>
							{escrito(frame, COLEGIO, I_CABECERA, 1)}
							<span style={{ opacity: escribiendo(frame, COLEGIO, I_CABECERA, 1) && frame % 20 < 12 ? 1 : 0 }}>|</span>
						</div>
						<div style={{ fontSize: 17, color: TENUE, marginTop: 4, opacity: entra(frame, fps, I_CABECERA + 30, 12) }}>
							Horario de clases · Año lectivo {ANIO}
						</div>
					</div>
					<div style={{ textAlign: 'right', opacity: entra(frame, fps, I_CABECERA + 36, 12) }}>
						<div style={{ fontSize: 34, fontWeight: 700 }}>{GRUPO_DEL_INFORME}</div>
						<div style={{ fontSize: 16, color: TENUE }}>Básica secundaria</div>
					</div>
				</div>

				<div style={{ border: `1px solid ${TINTA}` }}>
					<div style={{ display: 'flex', height: I.cabeceraTabla, background: '#f2f5f8', borderBottom: `1px solid ${TINTA}`, opacity: 1 - salidaCabecera }}>
						<div style={{ width: I.hora, borderRight: `1px solid ${LINEA}` }} />
						{DIAS_SEMANA.map((d, i) => (
							<div key={d} style={{ width: I.dia, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, borderRight: i === DIAS_SEMANA.length - 1 ? 'none' : `1px solid ${LINEA}`, opacity: entra(frame, fps, I_CABECERA + 40 + i * 4, 10) }}>
								{d}
							</div>
						))}
					</div>

					{HOJA.map((fila, f) => {
						const llegada = llega(frame, fps, f, I_FILAS, I_PASO_FILA);
						const fuera = estiloDeSalida(seVa(frame, f + 1, SALIDA, PASO_SALIDA));
						const timbre = TIMBRES[f];

						return (
							<div
								key={f}
								style={{
									display: 'flex',
									height: I.fila,
									borderBottom: f === HOJA.length - 1 ? 'none' : `1px solid ${LINEA}`,
									opacity: llegada.opacidad * fuera.opacidad,
									transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px)`,
								}}
							>
								{/* El número de franja Y su hora: el número es lo que usa la gente para hablar
								    --«en la tercera»-- y la hora es lo que se mira contra el timbre. */}
								<div style={{ width: I.hora, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${LINEA}`, boxSizing: 'border-box' }}>
									<div style={{ fontSize: 24, fontWeight: 700 }}>{f + 1}</div>
									<div style={{ fontSize: 12, color: TENUE }}>{timbre.inicio}</div>
									<div style={{ fontSize: 12, color: TENUE }}>{timbre.fin}</div>
								</div>

								{fila.map((clave, d) => {
									const ficha = CATALOGO[clave];
									const salon = SALON_DE(clave);
									const dibujo = ICONOS_DE_MATERIA[ficha.icono];

									return (
										<div
											key={d}
											style={{
												width: I.dia,
												display: 'flex',
												alignItems: 'center',
												gap: 10,
												padding: '8px 12px',
												borderRight: d === fila.length - 1 ? 'none' : `1px solid ${LINEA}`,
												borderLeft: `4px solid ${fichaLinea(ficha.tono)}`,
												background: fichaFondo(ficha.tono),
												boxSizing: 'border-box',
											}}
										>
											<div style={{ flex: 1, minWidth: 0 }}>
												<div style={{ fontSize: 19, fontWeight: 700, color: fichaLetra(ficha.tono) }}>{ficha.materia}</div>
												<div style={{ fontSize: 14, color: TINTA, opacity: 0.75 }}>{ficha.docente}</div>
												{salon && <div style={{ fontSize: 12, color: TENUE, marginTop: 2 }}>{salon}</div>}
											</div>
											{/* El dibujo se queda TODO lo que sobre y se encoge a lo que haya. */}
											<span
												style={{ display: 'block', width: 52, height: 52, flexShrink: 0, opacity: entra(frame, fps, I_FILAS + f * I_PASO_FILA + 8 + d * 2, 12) }}
												dangerouslySetInnerHTML={{ __html: `<svg width="52" height="52" viewBox="0 0 48 48">${dibujo}</svg>` }}
											/>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
