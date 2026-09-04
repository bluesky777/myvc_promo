import React from 'react';
import { interpolate } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { Cursor } from '../comunes/Cursor';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import {
	ALUMNOS, FILA_ABIERTA, PERIODOS, PERIODO_ABIERTO, SITUACION_EXISTENTE, SITUACION_NUEVA, TIPOS,
	TIPO_ABIERTO, type SituacionEnPantalla,
} from './datos';
import {
	D_CABECERAS, D_CLIC_CONTADOR, D_CLIC_DETALLE, D_CURSOR, D_DETALLE, D_FILAS, D_PASO_CABECERA,
	D_PASO_FILA, N_APARECE, PASO_SALIDA, SALIDA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA REJILLA DE DISCIPLINA: UNA FILA POR ALUMNO, UNA COLUMNA POR PERIODO.
 *
 * EN CADA CELDA, CINCO CONTADORES: uniforme y tardanzas --lo administrativo, en gris-- y los tres
 * tipos de situación del manual de convivencia, **en oro, volcán y rojo**. El color es el de la
 * GRAVEDAD, y sólo se enciende cuando hay algo dentro: una rejilla donde todo está encendido no
 * dice nada. Es lo que hace que el coordinador vea de un vistazo dónde mirar.
 *
 * PULSANDO UN CONTADOR SE DESPLIEGA EL DETALLE, y **la fila crece**: no es una ventanita que tapa a
 * los de abajo, es la propia celda abriéndose. Aquí el detalle se pinta a lo ancho de la tabla y no
 * dentro de los 260 px de la columna, que es donde va en la aplicación: en una columna estrecha el
 * texto de una situación se parte en seis renglones y en un vídeo no se lee.
 */

export const R = {
	relleno: 32,
	titulo: 62,
	num: 56,
	nombre: 420,
	periodo: 260,
	cabecera: 64,
	fila: 78,
	distintivo: 32,
	hueco: 3,
};

export const ANCHO_TABLA = R.num + R.nombre + R.periodo * PERIODOS.length;
export const ANCHO_REJILLA = ANCHO_TABLA + R.relleno * 2;

const FILAS_Y = R.relleno + R.titulo + R.cabecera;

/** Dónde cae el contador que se pulsa, en coordenadas del panel. */
export const PUNTO_CONTADOR = {
	x: R.relleno + R.num + R.nombre + R.periodo * PERIODO_ABIERTO + 12
		+ (R.distintivo + R.hueco) * 2 + 9 + R.hueco
		+ (R.distintivo + R.hueco) * TIPO_ABIERTO + R.distintivo / 2,
	y: FILAS_Y + R.fila * FILA_ABIERTA + R.fila / 2,
};

export const PUNTO_DETALLE = {
	x: R.relleno + R.num + 260,
	y: FILAS_Y + R.fila * (FILA_ABIERTA + 1) + 54,
};

/* Los dos iconos administrativos de Ant (`user` y `clock-circle`), dibujados. */
const IconoUniforme: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="8" r="4" fill="currentColor" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" /></svg>
);
const IconoTardanza: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5.4l3.4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);

const Distintivo: React.FC<{ valor: number; tipo?: number; abierto?: boolean; icono?: React.ReactNode; nueva?: boolean }> = ({
	valor, tipo, abierto = false, icono, nueva = false,
}) => {
	const marcado = valor > 0;
	const t = tipo !== undefined ? TIPOS[tipo] : null;

	return (
		<span
			style={{
				minWidth: R.distintivo,
				height: 30,
				padding: '0 6px',
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 3,
				borderRadius: 6,
				fontSize: 17,
				fontWeight: marcado ? 600 : 400,
				border: `1px ${nueva ? 'dashed' : 'solid'} ${abierto ? '#8c8c8c' : marcado ? (t ? t.borde : '#d0d0d0') : 'transparent'}`,
				background: abierto ? 'rgb(128 128 128 / 14%)' : marcado ? (t ? t.tinte : 'rgb(128 128 128 / 10%)') : 'transparent',
				color: nueva ? ACENTO : marcado ? (t ? t.legible : TEXTO) : TEXTO_TENUE,
				boxSizing: 'border-box',
			}}
		>
			{icono}
			{nueva ? '+' : valor}
		</span>
	);
};

export const Rejilla: React.FC<{ frame: number; fps: number; panelEmpieza: number }> = ({ frame, fps, panelEmpieza }) => {
	const panel = entra(frame, fps, panelEmpieza, 14);
	const panelFuera = interpolate(frame, [SALIDA + 32, SALIDA + 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaCabecera = seVa(frame, 0, SALIDA, PASO_SALIDA);

	const abierto = frame >= D_DETALLE;

	/*
	 * LO QUE HAY EN EL DETALLE. La segunda entra cuando se guarda el diálogo, **debajo** de la que ya
	 * estaba: en una lista de situaciones el orden es el de los hechos, y la nueva es la última.
	 */
	const situaciones: SituacionEnPantalla[] = frame >= N_APARECE
		? [SITUACION_EXISTENTE, SITUACION_NUEVA]
		: [SITUACION_EXISTENTE];

	const tipo = TIPOS[TIPO_ABIERTO];

	/*
	 * LA FILA CRECE CON LO QUE HAY DENTRO, y las dos alturas están medidas contra el render: el marco
	 * del detalle (título, relleno y el hueco de debajo) más lo que ocupa cada situación. Se calculan
	 * y no se dejan a `auto` porque **la altura tiene que poder animarse**: sin número, la fila daría
	 * un salto en el fotograma en que se abre en vez de abrirse.
	 */
	const MARCO_DETALLE = 60;
	const ALTO_SITUACION = 62;
	const abre = entra(frame, fps, D_DETALLE, 16);
	const crece = frame >= N_APARECE ? entra(frame, fps, N_APARECE, 16) : 1;
	const altoAhora = abierto
		? (MARCO_DETALLE + ALTO_SITUACION) * abre + (situaciones.length > 1 ? ALTO_SITUACION * crece : 0)
		: 0;

	const titulos = ['No', 'Nombres', ...PERIODOS.map((p) => `Periodo ${p}`)];

	return (
		<div style={{ transform: `scale(${ENCUADRE.rejilla * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
			<div
				style={{
					position: 'relative',
					width: ANCHO_REJILLA,
					padding: R.relleno,
					borderRadius: 14,
					background: SUPERFICIE,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
					boxSizing: 'border-box',
				}}
			>
				<div style={{ marginBottom: 22, height: 40, display: 'flex', alignItems: 'baseline', gap: 14, opacity: 1 - salidaCabecera, transform: `translateY(${-salidaCabecera * 26}px)` }}>
					<span style={{ fontSize: 32, fontWeight: 600, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, 'Disciplina', panelEmpieza + 6, 2)}
						<span style={{ opacity: escribiendo(frame, 'Disciplina', panelEmpieza + 6, 2) && frame % 20 < 12 ? 1 : 0 }}>|</span>
					</span>
					<span style={{ fontSize: 22, color: ACENTO, fontWeight: 600, opacity: entra(frame, fps, panelEmpieza + 30, 12) }}>9°B</span>
				</div>

				<div style={{ width: ANCHO_TABLA, border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden' }}>
					<div
						style={{
							display: 'flex',
							height: R.cabecera,
							backgroundColor: 'rgb(128 128 128 / 14%)',
							borderBottom: `1px solid ${BORDE}`,
							opacity: 1 - salidaCabecera,
							transform: `translateY(${-salidaCabecera * 30}px)`,
						}}
					>
						{[R.num, R.nombre, ...PERIODOS.map(() => R.periodo)].map((ancho, i) => (
							<div
								key={i}
								style={{
									width: ancho,
									display: 'flex',
									alignItems: 'center',
									justifyContent: i === 1 ? 'flex-start' : 'center',
									paddingLeft: i === 1 ? 14 : 0,
									borderRight: i === PERIODOS.length + 1 ? 'none' : `1px solid ${BORDE}`,
									fontSize: 19,
									fontWeight: 600,
									whiteSpace: 'pre',
									boxSizing: 'border-box',
									opacity: entra(frame, fps, D_CABECERAS + i * D_PASO_CABECERA, 8),
								}}
							>
								{escrito(frame, titulos[i], D_CABECERAS + i * D_PASO_CABECERA, 2)}
							</div>
						))}
					</div>

					{ALUMNOS.map((alumno, fila) => {
						const llegada = llega(frame, fps, fila, D_FILAS, D_PASO_FILA);
						const fuera = estiloDeSalida(seVa(frame, fila + 1, SALIDA, PASO_SALIDA));
						const suyo = fila === FILA_ABIERTA;

						return (
							<div
								key={alumno.nombre}
								style={{
									borderBottom: fila === ALUMNOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
									backgroundColor: fila % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
									opacity: llegada.opacidad * fuera.opacidad,
									transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
								}}
							>
								<div style={{ display: 'flex', height: R.fila }}>
									<div style={{ width: R.num, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${BORDE}`, color: TEXTO_TENUE, fontSize: 20, boxSizing: 'border-box' }}>
										{fila + 1}
									</div>
									<div style={{ width: R.nombre, display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 14, borderRight: `1px solid ${BORDE}`, boxSizing: 'border-box' }}>
										<Avatar tipo={alumno.sexo} variante={fila} tam={44} />
										<span style={{ fontSize: 21 }}>{alumno.nombre}</span>
									</div>

									{PERIODOS.map((_, p) => {
										const d = alumno.periodos[p];
										const esEsta = suyo && p === PERIODO_ABIERTO;

										return (
											<div
												key={p}
												style={{
													width: R.periodo,
													display: 'flex',
													alignItems: 'center',
													gap: R.hueco,
													padding: '0 12px',
													borderRight: p === PERIODOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
													boxSizing: 'border-box',
												}}
											>
												<Distintivo valor={d.uniformes} icono={<IconoUniforme />} />
												<Distintivo valor={d.tardanzas} icono={<IconoTardanza />} />
												<span style={{ width: 9, height: 22, borderLeft: `1px solid ${BORDE}` }} />
												{d.tipos.map((n, t) => {
													/*
													 * EL CONTADOR SUBE AL GUARDAR. Es la mitad de lo que hay que enseñar: la
													 * situación nueva no sólo aparece en el detalle, **cuenta** -- y es ese
													 * número el que el coordinador va a mirar la próxima vez, sin abrir nada.
													 */
													const esElAbierto = esEsta && t === TIPO_ABIERTO;
													const cuenta = esElAbierto && frame >= N_APARECE ? n + 1 : n;

													return <Distintivo key={t} valor={cuenta} tipo={t} abierto={esElAbierto && abierto} />;
												})}
												<Distintivo valor={0} nueva />
											</div>
										);
									})}
								</div>

								{/* EL DETALLE. La fila crece: no es una ventanita que tape a los de abajo. */}
								{suyo && (
									<div style={{ height: altoAhora, overflow: 'hidden' }}>
										<div
											style={{
												marginLeft: R.num,
												marginRight: 12,
												marginBottom: 12,
												padding: '14px 18px',
												borderLeft: `4px solid ${tipo.fuerte}`,
												background: tipo.tinte,
												borderRadius: '0 8px 8px 0',
											}}
										>
											<div style={{ fontSize: 19, fontWeight: 600, color: tipo.legible, marginBottom: 8 }}>{tipo.plural}</div>
											{situaciones.map((s, i) => (
												<div
													key={s.fecha}
													style={{
														marginTop: i === 0 ? 0 : 10,
														opacity: i === 1 ? entra(frame, fps, N_APARECE, 16) : 1,
														transform: i === 1 ? `translateY(${interpolate(entra(frame, fps, N_APARECE, 16), [0, 1], [14, 0])}px)` : undefined,
													}}
												>
													<div style={{ fontSize: 20 }}>
														<span style={{ fontWeight: 600, marginRight: 8 }}>{s.fecha}:</span>
														{s.descripcion}
													</div>
													{s.ordinales.map((o) => (
														<div key={o} style={{ fontSize: 18, color: tipo.legible, marginTop: 3 }}>→ {o}</div>
													))}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				<Cursor
					puntos={[
						{ frame: D_CURSOR, x: ANCHO_TABLA - 80, y: FILAS_Y + R.fila * 2.6 },
						{ frame: D_CLIC_CONTADOR - 4, x: PUNTO_CONTADOR.x, y: PUNTO_CONTADOR.y },
						{ frame: D_CLIC_DETALLE - 6, x: PUNTO_DETALLE.x, y: PUNTO_DETALLE.y },
					]}
					clics={[D_CLIC_CONTADOR, D_CLIC_DETALLE]}
					aparece={D_CURSOR}
					sale={D_CLIC_DETALLE + 6}
				/>
			</div>
		</div>
	);
};
