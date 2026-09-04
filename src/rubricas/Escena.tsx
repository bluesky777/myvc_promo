import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { Cursor } from '../comunes/Cursor';
import { CON_ROTULO, ENCUADRE } from '../comunes/encuadre';
import { Hueco } from '../comunes/Hueco';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { Casilla } from '../notas/Casilla';
import { ALUMNOS, CABECERA, COLUMNAS, UNIDAD, total } from '../notas/planilla';
import { ACENTO, BORDE, FUENTE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import { ALUMNO, CRITERIOS, INDICADOR, NIVELES, NOTA, PORCENTAJE, aporte } from './datos';
import {
	A_BOTON, A_CABECERAS, A_CLIC, A_CURSOR, A_FILAS, A_LLEGA, A_PASO_FILA, A_PASO_SALIDA, A_SALIDA,
	A_TITULO, B_CABECERAS, B_DESGLOSE, B_FILAS, B_MARCAS, B_NOTA, B_PANEL, B_PASO_CABECERA,
	B_PASO_FILA, B_TITULO, PASO_SALIDA, SALIDA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * DE LA PLANILLA A LA RÚBRICA, Y DE LA RÚBRICA A LA NOTA.
 *
 * ES EL PRIMER CLIP CON DOS PANTALLAS, y por eso es el que estrena el principio entero: la planilla
 * se monta, se usa y **se va fila a fila**, y la rúbrica entra igual que entró la planilla. Entre
 * las dos no hay un corte: hay un hueco de siete fotogramas donde la primera ya se fue y la segunda
 * todavía no llegó, que es lo que hace que se lean como dos momentos y no como dos vídeos pegados.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL BOTÓN DE RÚBRICA SE PINTA MUCHO MÁS GRANDE DE LO QUE ES, Y ES A PROPÓSITO
 *
 * En la aplicación es un icono diminuto en la esquina de la casilla (`.casilla__rubrica`, `0.7rem`)
 * que sólo sale al pasar por encima -- y ahí está bien, porque compite con veintitantas columnas y
 * no puede robarles sitio. Pero **un vídeo no es una pantalla de trabajo**: si eso saliera a su
 * tamaño real, nadie lo vería, y la bondad que se está enseñando no existiría para quien mira.
 *
 * Así que aquí es un botón con su texto, anclado a la casilla, que aparece cuando el puntero llega.
 * Lo que se afirma sigue siendo verdad --desde la casilla se entra a calificar con rúbrica--; lo
 * que cambia es el tamaño, que es lo que el medio pide.
 */

/* ── ACTO A: la planilla ──────────────────────────────────────────────────────────────────── */

const A = { alumno: 460, nota: 180, fila: 62, unidad: 44, subcolumna: 48, titulo: 62, relleno: 32 };
const A_ANCHO = A.alumno + A.nota * 3;
const A_ESCALA = ENCUADRE.planillaCorta;
/** Las tres primeras filas: en un primer plano no caben seis, y tampoco hacen falta. */
const A_FILAS_VISIBLES = 3;

/** Dónde cae la casilla del «Quiz» de la primera fila, en coordenadas del panel. */
const CASILLA = {
	x: A.relleno + A.alumno + A.nota + A.nota / 2,
	y: A.relleno + A.titulo + A.unidad + A.subcolumna + A.fila / 2,
};

/* ── ACTO B: la matriz ────────────────────────────────────────────────────────────────────── */

const B = { criterio: 400, nivel: 270, fila: 108, cabecera: 80, titulo: 88, relleno: 32 };
const B_ANCHO = B.criterio + B.nivel * NIVELES.length;

/** El centro de la celda que se marca en cada criterio, en coordenadas del panel. */
function centroDeMarca(i: number) {
	return {
		x: B.relleno + B.criterio + B.nivel * CRITERIOS[i].marca + B.nivel / 2,
		y: B.relleno + B.titulo + B.cabecera + B.fila * i + B.fila / 2,
	};
}

export const EscenaRubricas: React.FC<{ conRotulo?: boolean }> = ({ conRotulo = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)', fontFamily: FUENTE }}>
			{/*
			  * CON RÓTULO, LA PANTALLA SE APARTA. El panel de la rúbrica es alto --matriz más desglose--
			  * y a su tamaño natural se le echa encima al texto de abajo. Se sube y se encoge un pelín:
			  * el rótulo es parte del encuadre, no algo que se pega encima al final.
			  */}
			<AbsoluteFill style={{ transform: conRotulo ? `translateY(-58px) scale(${CON_ROTULO})` : undefined }}>
				<ActoA frame={frame} fps={fps} />
				<ActoB frame={frame} fps={fps} />
			</AbsoluteFill>
			{conRotulo && <Rotulo frame={frame} />}
		</AbsoluteFill>
	);
};

/*
 * LA PLANILLA EN PRIMER PLANO. Tres filas y tres columnas: lo que hay que mirar es UNA casilla, así
 * que enseñar las seis filas y las veintitantas columnas de la pantalla real sería enseñar dónde NO
 * hay que mirar. La tabla completa ya la cuenta el clip de notas.
 */
const ActoA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame > A_SALIDA + 56) { return null; }

	const panel = entra(frame, fps, 0, 14);
	const panelFuera = interpolate(frame, [A_SALIDA + 26, A_SALIDA + 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaCabecera = seVa(frame, 0, A_SALIDA, A_PASO_SALIDA);

	/* El botón aparece cuando el puntero llega a la casilla: es el puntero quien lo hace aparecer. */
	const boton = entra(frame, fps, A_BOTON, 14) * (1 - seVa(frame, 0, A_CLIC + 4, 0, 10));
	const enfocada = frame >= A_LLEGA && frame < A_CLIC + 6;

	const titulos = ['Alumno', UNIDAD, ...COLUMNAS];

	return (
		<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ transform: `scale(${A_ESCALA * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
				<div
					style={{
						position: 'relative',
						width: A_ANCHO + A.relleno * 2,
						padding: A.relleno,
						borderRadius: 14,
						background: SUPERFICIE,
						boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
						boxSizing: 'border-box',
					}}
				>
					<Titulo
						frame={frame} fps={fps} desde={A_TITULO} fuera={salidaCabecera}
						texto={CABECERA.asignatura} apunte={CABECERA.grupo} alto={40}
					/>

					<div style={{ width: A_ANCHO, border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden' }}>
						{/* La cabecera: la geometría no se mueve, se escribe el texto. */}
						<div
							style={{
								display: 'flex',
								backgroundColor: 'rgb(128 128 128 / 14%)',
								borderBottom: `1px solid ${BORDE}`,
								opacity: 1 - salidaCabecera,
								transform: `translateY(${-salidaCabecera * 30}px)`,
							}}
						>
							<Hueco ancho={A.alumno} alto={A.unidad + A.subcolumna} izquierda>
								<Rotulillo frame={frame} fps={fps} texto={titulos[0]} desde={A_CABECERAS} />
							</Hueco>
							<div style={{ width: A.nota * 3 }}>
								<div style={{ height: A.unidad, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${BORDE}` }}>
									<Rotulillo frame={frame} fps={fps} texto={titulos[1]} desde={A_CABECERAS + 5} />
								</div>
								<div style={{ display: 'flex', height: A.subcolumna }}>
									{COLUMNAS.map((c, i) => (
										<Hueco key={c} ancho={A.nota} ultimo={i === COLUMNAS.length - 1}>
											<Rotulillo frame={frame} fps={fps} texto={c} desde={A_CABECERAS + 10 + i * 5} />
										</Hueco>
									))}
								</div>
							</div>
						</div>

						{ALUMNOS.slice(0, A_FILAS_VISIBLES).map((alumno, fila) => {
							const llegada = llega(frame, fps, fila, A_FILAS, A_PASO_FILA);
							const fuera = estiloDeSalida(seVa(frame, fila + 1, A_SALIDA, A_PASO_SALIDA));

							return (
								<div
									key={alumno.nombre}
									style={{
										display: 'flex',
										height: A.fila,
										alignItems: 'center',
										borderBottom: fila === A_FILAS_VISIBLES - 1 ? 'none' : `1px solid ${BORDE}`,
										backgroundColor: fila % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
										backgroundImage: fila === 0 && enfocada ? `linear-gradient(90deg, ${ACENTO}38, ${ACENTO}0a)` : undefined,
										opacity: llegada.opacidad * fuera.opacidad,
										transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
									}}
								>
									<Hueco ancho={A.alumno} izquierda>
										<Avatar tipo={alumno.sexo} variante={fila} tam={42} />
										<span style={{ fontSize: 21, marginLeft: 14 }}>{alumno.nombre}</span>
									</Hueco>
									{COLUMNAS.map((col, c) => (
										<Hueco key={col} ancho={A.nota} ultimo={c === COLUMNAS.length - 1}>
											<Casilla
												valor={alumno.notas[c] === null ? '' : String(alumno.notas[c])}
												foco={fila === 0 && c === 1 && enfocada}
												conCursor={false}
											/>
										</Hueco>
									))}
								</div>
							);
						})}
					</div>

					{/*
					  * EL BOTÓN, ANCLADO A LA CASILLA. Va colocado en absoluto sobre la tabla y con su
					  * piquito hacia arriba: eso es lo que dice **de qué casilla sale**. Un botón suelto
					  * en un lado de la pantalla no diría eso, y entonces no se entendería que la
					  * rúbrica califica ESE indicador de ESE alumno.
					  */}
					{boton > 0.01 && (
						<div
							style={{
								position: 'absolute',
								left: CASILLA.x - 168,
								top: CASILLA.y + 30,
								opacity: boton,
								transform: `translateY(${interpolate(boton, [0, 1], [-10, 0])}px) scale(${interpolate(boton, [0, 1], [0.9, 1])})`,
								transformOrigin: '50% 0%',
							}}
						>
							<div style={{ width: 0, height: 0, margin: '0 auto', borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: `9px solid ${ACENTO}` }} />
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									padding: '13px 22px',
									borderRadius: 10,
									background: ACENTO,
									color: '#fff',
									fontSize: 21,
									fontWeight: 600,
									whiteSpace: 'nowrap',
									boxShadow: '0 10px 26px rgba(15,28,52,.24)',
								}}
							>
								<IconoMatriz />
								Calificar con rúbrica
							</div>
						</div>
					)}

					<Cursor
						puntos={[
							{ frame: A_CURSOR, x: A_ANCHO - 20, y: A.relleno + A.titulo + A.unidad + A.subcolumna + A.fila * 2.4 },
							{ frame: A_LLEGA, x: CASILLA.x + 40, y: CASILLA.y - 6 },
							/* Cae sobre el botón por su lado izquierdo: encima del texto lo taparía justo cuando hay que leerlo. */
							{ frame: A_CLIC - 6, x: CASILLA.x - 150, y: CASILLA.y + 50 },
						]}
						clics={[A_CLIC]}
						aparece={A_CURSOR}
						sale={A_CLIC + 6}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* La matriz de Ant (`nz-icon nzType="table"`), dibujada: así no hace falta cargar la fuente de iconos. */
const IconoMatriz: React.FC = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
		<rect x="2.5" y="3.5" width="19" height="17" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
		<path d="M2.5 9.5h19M9 9.5v11" stroke="currentColor" strokeWidth="2" />
	</svg>
);

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA MATRIZ, Y DEBAJO DE DÓNDE SALE LA NOTA.
 *
 * EL DESGLOSE APARECE **ANTES** DE MARCAR NADA, con sus tres líneas en «sin marcar». Es lo que hace
 * la pantalla de verdad y es lo mejor que tiene: desde el primer momento se ve **qué va a decidir la
 * nota**, y cada marca llena su línea. Si el desglose apareciera al final, sería un resultado; así
 * es una cuenta que se hace delante de quien mira.
 */
export const ActoB: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < B_PANEL - 4) { return null; }

	const panel = entra(frame, fps, B_PANEL, 14);
	const panelFuera = interpolate(frame, [SALIDA + 34, SALIDA + 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaCabecera = seVa(frame, 0, SALIDA, PASO_SALIDA);

	const marcado = (i: number) => frame >= B_MARCAS[i];
	const cuantasMarcadas = B_MARCAS.filter((m) => frame >= m).length;

	return (
		<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ transform: `scale(${ENCUADRE.matriz * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
				<div
					style={{
						position: 'relative',
						width: B_ANCHO + B.relleno * 2,
						padding: B.relleno,
						borderRadius: 14,
						background: SUPERFICIE,
						boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
						boxSizing: 'border-box',
					}}
				>
					<Titulo
						frame={frame} fps={fps} desde={B_TITULO} fuera={salidaCabecera}
						texto={ALUMNO} porTecla={1} alto={B.titulo - 26}
						debajo={`${INDICADOR} · ${PORCENTAJE} %`}
					/>

					<div style={{ width: B_ANCHO, border: `1px solid ${BORDE}`, borderRadius: 6, overflow: 'hidden' }}>
						<div
							style={{
								display: 'flex',
								height: B.cabecera,
								backgroundColor: 'rgb(128 128 128 / 14%)',
								borderBottom: `1px solid ${BORDE}`,
								opacity: 1 - salidaCabecera,
								transform: `translateY(${-salidaCabecera * 30}px)`,
							}}
						>
							<Hueco ancho={B.criterio} izquierda>
								<Rotulillo frame={frame} fps={fps} texto="Criterio" desde={B_CABECERAS} tam={22} />
							</Hueco>
							{NIVELES.map((n, i) => (
								<Hueco key={n.nombre} ancho={B.nivel} ultimo={i === NIVELES.length - 1}>
									<span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
										<Rotulillo frame={frame} fps={fps} texto={n.nombre} desde={B_CABECERAS + (i + 1) * B_PASO_CABECERA} tam={22} />
										<span style={{ fontSize: 18, color: TEXTO_TENUE, opacity: entra(frame, fps, B_CABECERAS + (i + 1) * B_PASO_CABECERA + 6, 8) }}>
											{n.puntaje}
										</span>
									</span>
								</Hueco>
							))}
						</div>

						{CRITERIOS.map((criterio, i) => {
							const llegada = llega(frame, fps, i, B_FILAS, B_PASO_FILA);
							const fuera = estiloDeSalida(seVa(frame, i + 1, SALIDA, PASO_SALIDA));

							return (
								<div
									key={criterio.definicion}
									style={{
										display: 'flex',
										height: B.fila,
										borderBottom: i === CRITERIOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
										backgroundColor: i % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
										opacity: llegada.opacidad * fuera.opacidad,
										transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
									}}
								>
									<Hueco ancho={B.criterio} izquierda>
										<span>
											<span style={{ fontSize: 23, fontWeight: 600 }}>{criterio.definicion}</span>
											<span style={{ fontSize: 19, color: TEXTO_TENUE, marginLeft: 10 }}>{criterio.peso} %</span>
										</span>
									</Hueco>

									{NIVELES.map((n, j) => {
										const esta = marcado(i) && criterio.marca === j;
										const pop = esta ? entra(frame, fps, B_MARCAS[i], 12) : 0;

										return (
											<Hueco key={n.nombre} ancho={B.nivel} ultimo={j === NIVELES.length - 1} relleno={12}>
												{/*
												  * LA CELDA MARCADA NO SE DISTINGUE SÓLO POR EL COLOR: lleva el borde
												  * grueso y la letra en negrita, como en la pantalla. El color de marca
												  * sale del tema del colegio, y en algunos es muy claro.
												  */}
												<div
													style={{
														width: '100%',
														height: '100%',
														display: 'flex',
														alignItems: 'center',
														padding: 10,
														borderRadius: 8,
														boxSizing: 'border-box',
														border: `3px solid ${esta ? ACENTO : 'transparent'}`,
														background: esta ? 'rgb(128 128 128 / 14%)' : 'transparent',
														fontWeight: esta ? 600 : 400,
														fontSize: 20,
														lineHeight: 1.25,
														color: TEXTO,
														transform: `scale(${1 + pop * 0.03 - (esta ? 0.03 : 0)})`,
													}}
												>
													{criterio.descriptores[j]}
												</div>
											</Hueco>
										);
									})}
								</div>
							);
						})}
					</div>

					<Desglose frame={frame} fps={fps} cuantas={cuantasMarcadas} fuera={seVa(frame, CRITERIOS.length + 1, SALIDA, PASO_SALIDA)} />

					<Cursor
						puntos={[
							{ frame: B_FILAS + 18, x: B.relleno + B.criterio, y: B.relleno + B.titulo + B.cabecera + B.fila * 3.2 },
							...B_MARCAS.map((f, i) => ({ frame: f, ...centroDeMarca(i) })),
						]}
						clics={B_MARCAS}
						aparece={B_FILAS + 18}
						sale={B_NOTA - 6}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/*
 * «DE DÓNDE SALE LA NOTA». Las tres líneas están desde el principio, en gris, diciendo «sin marcar»:
 * la pantalla enseña **la cuenta entera antes de tener ningún número**. Cada marca llena la suya.
 *
 * Y UNA RÚBRICA A MEDIAS NO DA UNA NOTA A MEDIAS -- lo dice con palabras mientras falte algo, que es
 * lo que evita que el docente crea que el sistema no calcula.
 */
const Desglose: React.FC<{ frame: number; fps: number; cuantas: number; fuera: number }> = ({ frame, fps, cuantas, fuera }) => {
	const aparecer = entra(frame, fps, B_DESGLOSE, 16);
	if (aparecer <= 0.001) { return null; }

	const completa = cuantas === CRITERIOS.length;
	const nota = entra(frame, fps, B_NOTA, 16);

	return (
		<div
			style={{
				marginTop: 22,
				padding: '20px 24px',
				border: `1px solid rgb(128 128 128 / 25%)`,
				borderRadius: 8,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				opacity: aparecer * (1 - fuera),
				transform: `translateY(${interpolate(aparecer, [0, 1], [18, 0]) + fuera * 30}px)`,
			}}
		>
			<div style={{ fontSize: 22, fontWeight: 600 }}>De dónde sale la nota</div>

			{CRITERIOS.map((c, i) => {
				const puesto = i < cuantas;
				const n = NIVELES[c.marca];
				return (
					<div
						key={c.definicion}
						/*
						 * EL NOMBRE DEL CRITERIO OCUPA EXACTAMENTE LO QUE LA COLUMNA «CRITERIO» DE LA MATRIZ,
						 * y la cuenta empieza donde empieza «Bajo». Así cada línea del desglose cae **debajo de
						 * la fila que la produjo**: el ojo va de la celda marcada a su cuenta en vertical, sin
						 * cruzar la pantalla. Con `space-between` el número se iba al otro extremo y había que
						 * buscarlo.
						 */
						style={{ display: 'flex', fontSize: 22, opacity: puesto ? 1 : 0.7 }}
					>
						<span style={{ fontWeight: 600, width: B.criterio - 24, flexShrink: 0 }}>{c.definicion}</span>
						{puesto ? (
							<span
								style={{
									opacity: entra(frame, fps, B_MARCAS[i] + 4, 10),
									transform: `translateX(${interpolate(entra(frame, fps, B_MARCAS[i] + 4, 10), [0, 1], [18, 0])}px)`,
								}}
							>
								{c.peso} % × {n.nombre} {n.puntaje} = <strong>{aporte(c)}</strong>
							</span>
						) : (
							<span style={{ color: TEXTO_TENUE }}>sin marcar</span>
						)}
					</div>
				);
			})}

			<div style={{ height: 1, background: 'rgb(128 128 128 / 25%)', margin: '2px 0' }} />

			{completa ? (
				<div style={{ fontSize: 30, opacity: nota, transform: `scale(${interpolate(nota, [0, 0.6, 1], [0.9, 1.03, 1])})`, transformOrigin: 'left center' }}>
					Nota que calcula la rúbrica: <strong style={{ color: ACENTO }}>{NOTA}</strong>
				</div>
			) : (
				<div style={{ fontSize: 20, color: TEXTO_TENUE }}>
					Faltan criterios por marcar. Una rúbrica a medias no da una nota a medias.
				</div>
			)}
		</div>
	);
};

/** Un título que se escribe, con su cursor, y un apunte que entra después. */
const Titulo: React.FC<{
	frame: number; fps: number; desde: number; fuera: number; texto: string;
	apunte?: string; debajo?: string; porTecla?: number; alto: number;
}> = ({ frame, fps, desde, fuera, texto, apunte, debajo, porTecla = 2, alto }) => {
	const dice = escrito(frame, texto, desde, porTecla);
	const cursor = escribiendo(frame, texto, desde, porTecla) && frame % 20 < 12;
	const resto = entra(frame, fps, desde + texto.length * porTecla + 4, 12);

	return (
		<div style={{ marginBottom: 22, opacity: 1 - fuera, transform: `translateY(${-fuera * 26}px)` }}>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 14, height: alto }}>
				<span style={{ fontSize: 32, fontWeight: 600, color: TEXTO, whiteSpace: 'pre' }}>
					{dice}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</span>
				{apunte && <span style={{ fontSize: 22, color: ACENTO, fontWeight: 600, opacity: resto }}>{apunte}</span>}
			</div>
			{debajo && <div style={{ fontSize: 21, color: TEXTO_TENUE, opacity: resto }}>{debajo}</div>}
		</div>
	);
};

/** Un rótulo de cabecera que se escribe. */
const Rotulillo: React.FC<{ frame: number; fps: number; texto: string; desde: number; tam?: number }> = ({ frame, fps, texto, desde, tam = 19 }) => (
	<span style={{ fontSize: tam, fontWeight: 600, whiteSpace: 'pre', opacity: entra(frame, fps, desde, 8) }}>
		{escrito(frame, texto, desde, 2)}
	</span>
);

const Rotulo: React.FC<{ frame: number }> = ({ frame }) => {
	const a = interpolate(frame, [B_DESGLOSE, B_DESGLOSE + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const b = interpolate(frame, [SALIDA, SALIDA + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<div style={{ position: 'absolute', left: 96, bottom: 62, opacity: a * b, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)` }}>
			<div style={{ fontSize: 46, fontWeight: 700, color: '#0f1c34', letterSpacing: -0.6 }}>
				La nota se puede defender.
			</div>
			<div style={{ fontSize: 27, color: '#4a5872', marginTop: 8 }}>
				La rúbrica no da un número: da la cuenta de dónde salió, criterio por criterio.
			</div>
		</div>
	);
};
