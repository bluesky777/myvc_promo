import React from 'react';
import { interpolate } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { Cursor } from '../comunes/Cursor';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import { COLUMNAS_DEL_LIBRO, FICHAS, LO_QUE_SE_ESCRIBE, PERIODOS, PERIODO_DEL_LIBRO, escritasEnPeriodo } from './datos';
import {
	C_CAMPO, C_CLIC_CAMPO, C_CLIC_PESTANA, C_CURSOR, C_DISTINTIVO, C_ESCRIBE, C_FICHAS, C_PASO_FICHA,
	C_PASO_SALIDA, C_PESTANA, C_POR_TECLA, C_SALIDA, C_TITULO,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * COMPORTAMIENTO: UNA FICHA POR ALUMNO, Y EL LIBRO EN PESTAÑAS POR PERIODO.
 *
 * LO QUE SE ENSEÑA es lo que la pantalla arregló de la vieja: los cuatro periodos **son pestañas**,
 * o sea tres campos a la vista en vez de doce por alumno. Y las tres columnas del libro **tienen
 * nombre** --Convivencia, Académico, Compromiso--, que es la única pista de qué va en cada una.
 *
 * EL DISTINTIVO DE LA PESTAÑA cuenta cuántas de las tres tienen algo escrito, y por eso sube en
 * cuanto se termina de escribir: es lo que permite ver de un vistazo en qué periodos hay libro sin
 * abrirlos uno a uno. Con cero no se pinta nada -- un «0» en un distintivo se lee como un aviso.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LAS MEDIDAS SON CONSTANTES Y NO ESTILOS SUELTOS porque **el puntero tiene que saber dónde caer**.
 * Una pestaña que se mueve dos píxeles deja al puntero pulsando al lado, y eso en un vídeo se ve.
 */

const F = {
	relleno: 32,
	titulo: 62,
	fichaRelleno: 20,
	cabecera: 56,
	huecoCabecera: 16,
	pestanas: 46,
	huecoPestanas: 18,
	etiqueta: 22,
	campo: 88,
	entreFichas: 18,
	anchoPestana: 168,
	anchoCampo: 364,
	huecoCampo: 21,
};

const ANCHO_FICHA = F.anchoCampo * 3 + F.huecoCampo * 2;
const ANCHO_INTERIOR = ANCHO_FICHA + F.fichaRelleno * 2;
export const ANCHO_COMPORTAMIENTO = ANCHO_INTERIOR + F.relleno * 2;

const ALTO_FICHA = F.fichaRelleno * 2 + F.cabecera + F.huecoCabecera + F.pestanas + F.huecoPestanas + F.etiqueta + F.campo;

/** Dónde cae cada cosa de la PRIMERA ficha, que es la que se toca. En coordenadas del panel. */
const FICHA0 = F.relleno + F.titulo;
const PESTANAS_Y = FICHA0 + F.fichaRelleno + F.cabecera + F.huecoCabecera;
const CAMPOS_Y = PESTANAS_Y + F.pestanas + F.huecoPestanas + F.etiqueta;

export const PUNTO_PESTANA = {
	x: F.relleno + F.fichaRelleno + F.anchoPestana * (PERIODO_DEL_LIBRO - 1) + F.anchoPestana / 2,
	y: PESTANAS_Y + F.pestanas / 2,
};

export const PUNTO_CAMPO = {
	x: F.relleno + F.fichaRelleno + 40,
	y: CAMPOS_Y + 30,
};

export const Comportamiento: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame > C_SALIDA + 60) { return null; }

	const panel = entra(frame, fps, 0, 14);
	const panelFuera = interpolate(frame, [C_SALIDA + 30, C_SALIDA + 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaTitulo = seVa(frame, 0, C_SALIDA, C_PASO_SALIDA);

	/* La pestaña abierta cambia al pulsarla: es la única pieza con estado de esta pantalla. */
	const pestanaAbierta = frame >= C_CLIC_PESTANA ? PERIODO_DEL_LIBRO : FICHAS[0].pestanaInicial;
	const loEscrito = escrito(frame, LO_QUE_SE_ESCRIBE, C_ESCRIBE, C_POR_TECLA);

	return (
		<div style={{ transform: `scale(${ENCUADRE.comportamiento * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
			<div
				style={{
					position: 'relative',
					width: ANCHO_COMPORTAMIENTO,
					padding: F.relleno,
					borderRadius: 14,
					background: SUPERFICIE,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
					boxSizing: 'border-box',
				}}
			>
				<div style={{ marginBottom: 22, height: 40, display: 'flex', alignItems: 'baseline', gap: 14, opacity: 1 - salidaTitulo, transform: `translateY(${-salidaTitulo * 26}px)` }}>
					<span style={{ fontSize: 32, fontWeight: 600, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, 'Comportamiento', C_TITULO, 2)}
						<span style={{ opacity: escribiendo(frame, 'Comportamiento', C_TITULO, 2) && frame % 20 < 12 ? 1 : 0 }}>|</span>
					</span>
					<span style={{ fontSize: 22, color: ACENTO, fontWeight: 600, opacity: entra(frame, fps, C_TITULO + 32, 12) }}>9°B</span>
				</div>

				{FICHAS.map((ficha, i) => {
					const llegada = llega(frame, fps, i, C_FICHAS, C_PASO_FICHA);
					const fuera = estiloDeSalida(seVa(frame, i + 1, C_SALIDA, C_PASO_SALIDA));
					const esLaQueSeToca = i === 0;
					const abierta = esLaQueSeToca ? pestanaAbierta : ficha.pestanaInicial;
					const libro = ficha.libros[abierta] ?? ['', '', ''];

					return (
						<div
							key={ficha.nombre}
							style={{
								border: `1px solid ${BORDE}`,
								borderRadius: 10,
								padding: F.fichaRelleno,
								marginBottom: i === FICHAS.length - 1 ? 0 : F.entreFichas,
								height: ALTO_FICHA,
								boxSizing: 'border-box',
								opacity: llegada.opacidad * fuera.opacidad,
								transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
							}}
						>
							{/* Quién es y su nota: es el campo que más se usa, así que va arriba y siempre a la vista. */}
							<div style={{ display: 'flex', alignItems: 'center', height: F.cabecera, gap: 16 }}>
								<Avatar tipo={ficha.sexo} variante={i} tam={48} />
								<span style={{ fontSize: 24, fontWeight: 600 }}>{i + 1}. {ficha.nombre}</span>
								<span style={{ flex: 1 }} />
								<span style={{ fontSize: 17, color: TEXTO_TENUE }}>Comportamiento</span>
								<span
									style={{
										width: 92, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
										border: `1px solid ${BORDE}`, borderRadius: 7, fontSize: 22, background: SUPERFICIE,
									}}
								>
									{ficha.nota}
								</span>
							</div>

							{/* LAS PESTAÑAS DE PERIODO. Ant las marca con la línea de abajo, no con un fondo. */}
							<div style={{ display: 'flex', height: F.pestanas, marginTop: F.huecoCabecera, borderBottom: `1px solid ${BORDE}` }}>
								{PERIODOS.map((periodo) => {
									const puesta = periodo === abierta;
									/* El distintivo del periodo que se escribe sube cuando se termina de escribir. */
									const extra = esLaQueSeToca && periodo === PERIODO_DEL_LIBRO && frame >= C_DISTINTIVO ? 1 : 0;
									const cuenta = escritasEnPeriodo(ficha, periodo) + extra;

									return (
										<div
											key={periodo}
											style={{
												width: F.anchoPestana,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: 8,
												fontSize: 20,
												fontWeight: puesta ? 600 : 400,
												color: puesta ? ACENTO : TEXTO,
												boxShadow: puesta ? `inset 0 -2px 0 0 ${ACENTO}` : undefined,
											}}
										>
											Periodo {periodo}
											{cuenta > 0 && (
												<span
													style={{
														minWidth: 24, height: 24, padding: '0 7px', borderRadius: 12,
														display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
														background: puesta ? ACENTO : 'rgb(128 128 128 / 22%)',
														color: puesta ? '#fff' : TEXTO,
														fontSize: 15, fontWeight: 600,
														transform: `scale(${extra && periodo === PERIODO_DEL_LIBRO ? entra(frame, fps, C_DISTINTIVO, 12) * 0.15 + 1 : 1})`,
													}}
												>
													{cuenta}
												</span>
											)}
										</div>
									);
								})}
							</div>

							{/*
							  * LAS TRES COLUMNAS DEL LIBRO, con su nombre encima. Se cambian de golpe al cambiar de
							  * pestaña y entran con un desvanecido corto: sin él, el cambio de pestaña se lee como un
							  * fallo de pintado en vez de como otro periodo.
							  */}
							<div key={abierta} style={{ display: 'flex', gap: F.huecoCampo, marginTop: F.huecoPestanas }}>
								{COLUMNAS_DEL_LIBRO.map((columna, c) => {
									const cambio = esLaQueSeToca ? entra(frame, fps, C_CLIC_PESTANA, 10) : 1;
									const opacidad = esLaQueSeToca && frame >= C_CLIC_PESTANA ? cambio : 1;
									const texto = esLaQueSeToca && c === 0 ? loEscrito : libro[c];
									const escribiendoAqui = esLaQueSeToca && c === 0 && frame >= C_ESCRIBE;

									return (
										<div key={columna} style={{ width: F.anchoCampo, opacity: opacidad }}>
											<div style={{ height: F.etiqueta, fontSize: 17, color: TEXTO_TENUE }}>{columna}</div>
											<div
												style={{
													height: F.campo,
													border: `1px solid ${escribiendoAqui ? ACENTO : BORDE}`,
													boxShadow: escribiendoAqui ? `0 0 0 3px ${ACENTO}22` : 'none',
													borderRadius: 7,
													padding: 12,
													fontSize: 19,
													lineHeight: 1.35,
													color: texto ? TEXTO : TEXTO_TENUE,
													background: SUPERFICIE,
													boxSizing: 'border-box',
												}}
											>
												{texto || 'Escriba aquí'}
												{escribiendoAqui && escribiendo(frame, LO_QUE_SE_ESCRIBE, C_ESCRIBE, C_POR_TECLA) && frame % 20 < 12 && (
													<span style={{ borderLeft: `2px solid ${TEXTO}`, marginLeft: 1 }} />
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}

				<Cursor
					puntos={[
						{ frame: C_CURSOR, x: ANCHO_COMPORTAMIENTO - 120, y: PESTANAS_Y + 180 },
						{ frame: C_PESTANA, x: PUNTO_PESTANA.x, y: PUNTO_PESTANA.y },
						{ frame: C_CAMPO, x: PUNTO_CAMPO.x, y: PUNTO_CAMPO.y },
					]}
					clics={[C_CLIC_PESTANA, C_CLIC_CAMPO]}
					aparece={C_CURSOR}
					sale={C_ESCRIBE}
				/>
			</div>
		</div>
	);
};
