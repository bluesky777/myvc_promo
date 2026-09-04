import React from 'react';
import { interpolate } from 'remotion';

import { Cursor } from '../comunes/Cursor';
import { ENCUADRE } from '../comunes/encuadre';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { BANDEJA, CATALOGO, DESTINO, DIAS, FRANJAS, GRUPOS, ORIGEN, REJILLA } from './datos';
import {
	G_BARRA, G_CLIC, G_CURSOR, G_FIN_BARRA, G_VEREDICTO, R_CABECERAS, R_CANJEA, R_COGE, R_CURSOR,
	R_FILAS, R_PANEL, R_PASO_FILA, R_PASO_SALIDA, R_SALIDA, R_SOBRE_BANDEJA, R_SOBRE_DESTINO,
	R_SUELTA,
} from './guion';
import {
	APAGADO, AZUL, AZUL_TINTE, CONDICIONAL_FONDO, CONDICIONAL_LINEA, HUECO_FONDO, HUECO_PUNTO,
	ILEGAL_RAYAS, LEGAL_FONDO, LEGAL_LINEA, LINEA, PAPEL, TENUE, TINTA, fichaFondo, fichaLetra,
	fichaLinea,
} from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA REJILLA: DONDE SE CUADRA A MANO. Y LO QUE ENSEÑA EL CLIP ES **EL CANJE**.
 *
 * Mover una lección a una hora que ya está ocupada no es un error ni hace falta vaciarla antes: se
 * coge la ficha, se suelta encima de la otra, y **la que estaba sube a la mano**. Desde ahí se lleva
 * a donde sea -- en el clip, a la bandeja. Dos clics para lo que en una hoja de cálculo son cuatro
 * operaciones y un borrado que se te olvida deshacer.
 *
 * AL COGER, LA REJILLA SE PINTA ENTERA DE UNA VEZ: verde donde cabe, ámbar donde cabe pero cuesta
 * --alguien marcó «?» ahí, ver el acto de la disponibilidad-- y rayado donde no. **Antes de soltar
 * ya sabes dónde puedes**, y eso es lo que separa esto de arrastrar cajas en un dibujo.
 *
 * LA FILA DEL GRUPO ES LA ÚNICA VERDE, y no es una simplificación del vídeo: una lección de 7°A sólo
 * puede ir en la fila de 7°A. Las otras cuatro salen rayadas porque para esa pieza no existen.
 */

const R = {
	relleno: 32,
	mandos: 56,
	huecoMandos: 16,
	grupo: 150,
	casilla: 74,
	dia: 34,
	franja: 32,
	fila: 56,
	mano: 46,
	huecoMano: 12,
	relato: 26,
	huecoBandeja: 14,
	bandejaCabecera: 44,
	bandejaFicha: 70,
};

const COLUMNAS = DIAS.length * FRANJAS.length;
const ANCHO_TABLA = R.grupo + R.casilla * COLUMNAS;
export const ANCHO_REJILLA = ANCHO_TABLA + R.relleno * 2;

const CABECERA_Y = R.relleno + R.mandos + R.huecoMandos;
const FILAS_Y = CABECERA_Y + R.dia + R.franja;
const MANO_Y = FILAS_Y + R.fila * GRUPOS.length + R.huecoMano;
const BANDEJA_Y = MANO_Y + R.mano + R.relato + R.huecoBandeja;

function centroDeCasilla(fila: number, columna: number) {
	return {
		x: R.relleno + R.grupo + R.casilla * columna + R.casilla / 2,
		y: FILAS_Y + R.fila * fila + R.fila / 2,
	};
}

const PUNTO_ORIGEN = centroDeCasilla(ORIGEN.fila, ORIGEN.columna);
const PUNTO_DESTINO = centroDeCasilla(DESTINO.fila, DESTINO.columna);
const PUNTO_BANDEJA = { x: R.relleno + 260, y: BANDEJA_Y + R.bandejaCabecera + R.bandejaFicha / 2 };
const PUNTO_GENERAR = { x: ANCHO_TABLA - 84, y: R.relleno + R.mandos / 2 };

/** Las dos casillas donde el docente marcó «?»: caben, pero cuestan. */
const CONDICIONALES = [7, 8];

export const Rejilla: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < R_PANEL - 4 || frame > R_SALIDA + 50) { return null; }

	const panel = entra(frame, fps, R_PANEL, 14);
	const panelFuera = interpolate(frame, [R_SALIDA + 30, R_SALIDA + 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salidaCabecera = seVa(frame, 0, R_SALIDA, R_PASO_SALIDA);

	/* ── El estado de la pantalla, sacado del fotograma ──────────────────────────────────── */
	const cogida = frame >= R_COGE && frame < R_CANJEA;      // se lleva la SOC
	const desalojada = frame >= R_CANJEA && frame < R_SUELTA; // se lleva la ING que estaba
	const llevando = cogida || desalojada;
	const generado = frame >= G_FIN_BARRA;

	const enLaMano = cogida ? REJILLA[ORIGEN.fila][ORIGEN.columna]! : desalojada ? REJILLA[DESTINO.fila][DESTINO.columna]! : null;

	/** Lo que hay en cada casilla AHORA. La única que cambia es el par origen/destino. */
	const contenido = (fila: number, columna: number): string | null => {
		if (fila === ORIGEN.fila && columna === ORIGEN.columna) {
			if (frame < R_COGE) { return REJILLA[fila][columna]; }
			return generado ? REJILLA[DESTINO.fila][DESTINO.columna] : null;
		}
		if (fila === DESTINO.fila && columna === DESTINO.columna) {
			return frame < R_CANJEA ? REJILLA[fila][columna] : REJILLA[ORIGEN.fila][ORIGEN.columna];
		}
		return REJILLA[fila][columna];
	};

	const enBandeja = [...BANDEJA, ...(frame >= R_SUELTA && !generado ? [{ etiqueta: '7°A · ING', docente: CATALOGO.ING.docente, tono: CATALOGO.ING.tono }] : [])];
	const bandejaAhora = generado ? [] : enBandeja;

	const colocadas = generado ? 77 : llevando ? 74 : frame >= R_SUELTA ? 74 : 75;

	return (
		<div style={{ transform: `scale(${ENCUADRE.horarioRejilla * (1 - panelFuera * 0.03)})`, opacity: panel * (1 - panelFuera) }}>
			<div
				style={{
					position: 'relative',
					width: ANCHO_REJILLA,
					padding: R.relleno,
					borderRadius: 14,
					background: PAPEL,
					boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
					boxSizing: 'border-box',
					color: TINTA,
				}}
			>
				{/* LOS MANDOS: en qué vista se mira, cuántas van, y el botón que lo cuadra todo. */}
				<div style={{ height: R.mandos, display: 'flex', alignItems: 'center', gap: 16, marginBottom: R.huecoMandos, opacity: 1 - salidaCabecera, transform: `translateY(${-salidaCabecera * 26}px)` }}>
					<div style={{ display: 'flex', gap: 6 }}>
						{['Grupos', 'Docentes', 'Salones'].map((v, i) => (
							<span
								key={v}
								style={{
									padding: '9px 16px', borderRadius: 8, fontSize: 17,
									border: `1px solid ${i === 0 ? AZUL : LINEA}`,
									background: i === 0 ? AZUL_TINTE : PAPEL,
									color: i === 0 ? AZUL : TENUE, fontWeight: i === 0 ? 600 : 400,
									opacity: entra(frame, fps, R_PANEL + 6 + i * 4, 10),
								}}
							>
								{v}
							</span>
						))}
					</div>

					{/* LOS DOS NÚMEROS CUENTAN LECCIONES, y el de la bandeja no cuenta tarjetas. */}
					<span style={{ fontSize: 17, color: TENUE, opacity: entra(frame, fps, R_PANEL + 20, 12), fontVariantNumeric: 'tabular-nums' }}>
						{colocadas} de 77 lecciones colocadas · {77 - colocadas} en la bandeja
					</span>

					<span style={{ flex: 1 }} />

					<span
						style={{
							display: 'flex', alignItems: 'center', gap: 9,
							padding: '12px 22px', borderRadius: 8,
							background: AZUL, color: '#fff', fontSize: 17, fontWeight: 600,
							opacity: entra(frame, fps, R_PANEL + 26, 12),
							transform: `scale(${frame >= G_CLIC && frame < G_CLIC + 8 ? 0.97 : 1})`,
						}}
					>
						<Chistera />
						Generar el horario…
					</span>
				</div>

				<div style={{ border: `1px solid ${LINEA}`, borderRadius: 6, overflow: 'hidden' }}>
					{/* La cabecera: el día arriba y debajo el número de franja con su hora. */}
					<div style={{ opacity: 1 - salidaCabecera, transform: `translateY(${-salidaCabecera * 30}px)`, background: '#f7f9fb' }}>
						<div style={{ display: 'flex', height: R.dia, alignItems: 'center' }}>
							<div style={{ width: R.grupo, fontSize: 16, fontWeight: 600, paddingLeft: 12 }}>Grupo</div>
							{DIAS.map((d, i) => (
								<div key={d} style={{ width: R.casilla * FRANJAS.length, textAlign: 'center', fontSize: 16, fontWeight: 600, borderLeft: `1px solid ${LINEA}`, opacity: entra(frame, fps, R_CABECERAS + i * 5, 10) }}>
									{escrito(frame, d, R_CABECERAS + i * 5, 2)}
								</div>
							))}
						</div>
						<div style={{ display: 'flex', height: R.franja, alignItems: 'center', borderBottom: `1px solid ${LINEA}` }}>
							<div style={{ width: R.grupo }} />
							{DIAS.flatMap((d, di) =>
								FRANJAS.map((f) => (
									<div
										key={`${d}${f}`}
										style={{
											width: R.casilla, textAlign: 'center', fontSize: 14, color: TENUE,
											borderLeft: f === 1 ? `1px solid ${LINEA}` : 'none',
											opacity: entra(frame, fps, R_CABECERAS + 14 + di * 4, 10),
										}}
									>
										{f}
									</div>
								)),
							)}
						</div>
					</div>

					{GRUPOS.map((grupo, fila) => {
						const llegada = llega(frame, fps, fila, R_FILAS, R_PASO_FILA);
						const fuera = estiloDeSalida(seVa(frame, fila + 1, R_SALIDA, R_PASO_SALIDA));
						const esSuya = fila === ORIGEN.fila;

						return (
							<div
								key={grupo}
								style={{
									display: 'flex',
									height: R.fila,
									borderTop: fila === 0 ? 'none' : `1px solid ${LINEA}`,
									opacity: llegada.opacidad * fuera.opacidad,
									transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px)`,
								}}
							>
								<div style={{ width: R.grupo, display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 18, fontWeight: 600, borderRight: `1px solid ${LINEA}`, boxSizing: 'border-box' }}>
									{grupo}
								</div>

								{Array.from({ length: COLUMNAS }, (_, columna) => {
									const clave = contenido(fila, columna);
									const ficha = clave ? CATALOGO[clave] : null;
									const esDestino = fila === DESTINO.fila && columna === DESTINO.columna;
									const nuevaAqui = esDestino && frame >= R_CANJEA;

									/* Al llevar algo, la rejilla entera dice dónde cabe. */
									let pintura: React.CSSProperties = {};
									/*
									 * LAS FILAS DONDE NO CABE SE APAGAN, y esto sale de mirarlo renderizado: el fondo
									 * rayado de «aquí no» **no se ve debajo de una ficha**, que ocupa la casilla entera.
									 * En la aplicación eso da igual --el rayado sólo se pinta en las casillas vacías, y
									 * las llenas llevan su propia marca de «sin canje»--, pero en un vídeo el resultado
									 * era que al coger la ficha no cambiaba nada en pantalla. Apagar las cuatro filas que
									 * no son suyas dice lo mismo y se ve desde el otro lado de la sala.
									 */
									let apagada = 1;
									if (llevando) {
										if (!esSuya) { pintura = { background: ILEGAL_RAYAS }; apagada = 0.26; }
										else if (ficha) { pintura = { boxShadow: `inset 0 0 0 2px ${LEGAL_LINEA}` }; }
										else if (CONDICIONALES.includes(columna)) { pintura = { background: CONDICIONAL_FONDO, boxShadow: `inset 0 0 0 1px ${CONDICIONAL_LINEA}` }; }
										else { pintura = { background: LEGAL_FONDO, boxShadow: `inset 0 0 0 1px ${LEGAL_LINEA}` }; }
									} else if (!ficha) {
										/* El hueco: una casilla vacía ENTRE dos clases del mismo día. */
										pintura = { background: HUECO_FONDO, color: HUECO_PUNTO };
									}

									return (
										<div
											key={columna}
											style={{
												width: R.casilla,
												borderRight: (columna + 1) % FRANJAS.length === 0 ? `1px solid ${LINEA}` : `1px solid #eef1f4`,
												padding: 3,
												boxSizing: 'border-box',
												display: 'flex',
												...pintura,
											}}
										>
											{ficha ? (
												<div
													style={{
														width: '100%',
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'center',
														alignItems: 'center',
														borderRadius: 4,
														borderLeft: `3px solid ${fichaLinea(ficha.tono)}`,
														background: fichaFondo(ficha.tono),
														color: fichaLetra(ficha.tono),
														opacity: apagada,
														transform: `scale(${nuevaAqui ? 0.94 + entra(frame, fps, R_CANJEA, 12) * 0.06 : 1})`,
													}}
												>
													<span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>{ficha.materia}</span>
													<span style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.2 }}>{ficha.docente}</span>
												</div>
											) : !llevando ? (
												<span style={{ margin: 'auto', fontSize: 18, lineHeight: 1 }}>·</span>
											) : null}
										</div>
									);
								})}
							</div>
						);
					})}
				</div>

				{/*
				  * LA FICHA QUE SE LLEVA, SIEMPRE VISIBLE, y este renglón **está aunque no haya nada que
				  * decir**: apareciendo sólo al coger algo, la tabla bajaría 60 px justo bajo el ratón y
				  * el segundo clic caería en otra fila.
				  */}
				<div style={{ height: R.mano, marginTop: R.huecoMano, display: 'flex', alignItems: 'center', gap: 14, opacity: (1 - salidaCabecera) * 0.99 }}>
					{enLaMano ? (
						<>
							<span style={{ padding: '7px 14px', borderRadius: 6, fontSize: 16, fontWeight: 700, borderLeft: `3px solid ${fichaLinea(CATALOGO[enLaMano].tono)}`, background: fichaFondo(CATALOGO[enLaMano].tono), color: fichaLetra(CATALOGO[enLaMano].tono) }}>
								7°A · {CATALOGO[enLaMano].materia}
							</span>
							<span style={{ fontSize: 16, color: TENUE }}>12 casillas libres y legales · 2 con «?»</span>
							<span style={{ padding: '7px 14px', border: `1px solid ${LINEA}`, borderRadius: 6, fontSize: 15, color: TENUE }}>
								Esc — {cogida ? 'devolverla a donde estaba' : 'dejarla en la bandeja'}
							</span>
						</>
					) : (
						<span style={{ fontSize: 16, color: APAGADO }}>
							Clic en una lección para cogerla y otro para soltarla · doble clic para fijarla
						</span>
					)}
				</div>

				{/* EL RENGLÓN QUE CUENTA LO QUE ACABA DE PASAR. */}
				<div style={{ height: R.relato, fontSize: 16, color: AZUL }}>
					{frame >= G_VEREDICTO
						? 'Horario entregado. La bandeja quedó vacía.'
						: frame >= G_CLIC
							? '·'
							: frame >= R_SUELTA
								? 'ING queda en la bandeja. Sin colocar: 3.'
								: frame >= R_CANJEA
									? 'SOC va al miércoles 3ª. ING sube a la mano.'
									: frame >= R_COGE
										? 'SOC en la mano. 12 casillas donde cabe.'
										: '·'}
				</div>

				{/* LA BANDEJA: lo que falta por colocar. El fondo entero es «devuélvela aquí». */}
				<div style={{ marginTop: R.huecoBandeja, border: `1px dashed ${LINEA}`, borderRadius: 8, padding: 12, opacity: 1 - seVa(frame, GRUPOS.length + 1, R_SALIDA, R_PASO_SALIDA) }}>
					<div style={{ height: R.bandejaCabecera - 12, display: 'flex', alignItems: 'center', fontSize: 17, fontWeight: 600, color: TENUE }}>
						La bandeja — {bandejaAhora.length === 0 ? 'nada sin colocar' : `${bandejaAhora.length} lecciones sin colocar`}
					</div>
					<div style={{ display: 'flex', gap: 10, height: R.bandejaFicha - 12, alignItems: 'center' }}>
						{bandejaAhora.map((b, i) => {
							const nueva = i === bandejaAhora.length - 1 && frame >= R_SUELTA && bandejaAhora.length > BANDEJA.length;
							const pop = nueva ? entra(frame, fps, R_SUELTA, 14) : 1;
							return (
								<div
									key={b.etiqueta}
									style={{
										padding: '10px 16px',
										borderRadius: 6,
										border: `1px solid ${fichaLinea(b.tono)}`,
										background: fichaFondo(b.tono),
										color: fichaLetra(b.tono),
										opacity: pop,
										transform: `translateY(${interpolate(pop, [0, 1], [-18, 0])}px) scale(${0.9 + pop * 0.1})`,
									}}
								>
									<div style={{ fontSize: 16, fontWeight: 700 }}>{b.etiqueta}</div>
									<div style={{ fontSize: 13, opacity: 0.8 }}>{b.docente}</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* El velo: sin él, el panel de progreso se lee como un trozo de tabla mal pintado. */}
				{frame >= G_BARRA && frame < G_FIN_BARRA + 12 && (
					<div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'rgba(255,255,255,.62)', zIndex: 48, opacity: entra(frame, fps, G_BARRA, 10) * (1 - seVa(frame, 0, G_FIN_BARRA, 0, 10)) }} />
				)}
				<Barra frame={frame} fps={fps} />
				<Veredicto frame={frame} fps={fps} ancho={ANCHO_TABLA} />

				{/* LA FICHA VIAJA DEBAJO DEL PUNTERO, desplazada para que la punta quede fuera. */}
				{enLaMano && <EnLaMano frame={frame} fps={fps} clave={enLaMano} />}

				<Cursor
					puntos={[
						{ frame: R_CURSOR, x: ANCHO_TABLA - 200, y: FILAS_Y + R.fila * 4 },
						{ frame: R_COGE - 4, ...PUNTO_ORIGEN },
						{ frame: R_SOBRE_DESTINO, ...PUNTO_DESTINO },
						{ frame: R_SOBRE_BANDEJA, ...PUNTO_BANDEJA },
						{ frame: G_CURSOR, ...PUNTO_BANDEJA },
						{ frame: G_CLIC - 8, ...PUNTO_GENERAR },
					]}
					clics={[R_COGE, R_CANJEA, R_SUELTA, G_CLIC]}
					aparece={R_CURSOR}
					sale={G_CLIC + 6}
					color={AZUL}
				/>
			</div>
		</div>
	);
};

/*
 * LA FICHA EN LA MANO. Va abajo y a la derecha del puntero, lo justo para que la punta quede fuera,
 * y no intercepta nada: una ficha que viaja debajo del puntero y recibe clics es una pantalla en la
 * que soltar deja de funcionar en cuanto se mueve el ratón.
 */
const EnLaMano: React.FC<{ frame: number; fps: number; clave: string }> = ({ frame, fps, clave }) => {
	const f = CATALOGO[clave];
	const cogida = frame >= R_COGE && frame < R_CANJEA;

	const puntos = cogida
		? [{ frame: R_COGE, ...PUNTO_ORIGEN }, { frame: R_SOBRE_DESTINO, ...PUNTO_DESTINO }]
		: [{ frame: R_CANJEA, ...PUNTO_DESTINO }, { frame: R_SOBRE_BANDEJA, ...PUNTO_BANDEJA }];

	const x = interpolate(frame, puntos.map((p) => p.frame), puntos.map((p) => p.x), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const y = interpolate(frame, puntos.map((p) => p.frame), puntos.map((p) => p.y), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vivo = entra(frame, fps, cogida ? R_COGE : R_CANJEA, 8);

	return (
		<div
			style={{
				position: 'absolute',
				left: x + 18,
				top: y + 16,
				padding: '8px 14px',
				borderRadius: 6,
				borderLeft: `3px solid ${fichaLinea(f.tono)}`,
				background: fichaFondo(f.tono),
				color: fichaLetra(f.tono),
				boxShadow: '0 10px 24px rgba(15,28,52,.22)',
				pointerEvents: 'none',
				zIndex: 45,
				opacity: vivo,
				transform: `scale(${0.9 + vivo * 0.1})`,
			}}
		>
			<div style={{ fontSize: 16, fontWeight: 700 }}>{f.materia}</div>
			<div style={{ fontSize: 12, opacity: 0.85 }}>{f.docente}</div>
		</div>
	);
};

/*
 * LA BARRA MIENTRAS BUSCA. Es lo que impide que treinta y ocho segundos de recocido se lean como una
 * ventana colgada -- y por eso el renglón de cifras dice **qué** está haciendo, no sólo que hace algo.
 */
const Barra: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	if (frame < G_BARRA || frame >= G_VEREDICTO) { return null; }

	const p = interpolate(frame, [G_BARRA, G_FIN_BARRA], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const colocadas = Math.round(p * 77);
	const vivo = entra(frame, fps, G_BARRA, 10) * (1 - seVa(frame, 0, G_FIN_BARRA + 4, 0, 8));

	return (
		<div style={{ position: 'absolute', left: R.relleno, right: R.relleno, top: CABECERA_Y + 120, padding: 26, borderRadius: 12, background: 'rgba(255,255,255,.97)', boxShadow: '0 18px 50px rgba(15,28,52,.2)', opacity: vivo, zIndex: 50 }}>
			<div style={{ height: 10, borderRadius: 5, background: '#e8edf3', overflow: 'hidden' }} data-barra>
				<div style={{ width: `${p * 100}%`, height: '100%', background: AZUL }} />
			</div>
			<div style={{ marginTop: 14, fontSize: 19, fontVariantNumeric: 'tabular-nums' }}>
				Colocando {colocadas} de 77 · probando el {Math.round(p * 4) + 1}º arranque
			</div>
			<div style={{ marginTop: 6, fontSize: 15, color: TENUE }}>
				Detener deja el horario como estaba: el generador sólo lo entrega al terminar.
			</div>
		</div>
	);
};

/*
 * EL VEREDICTO ENTERO, Y **LO QUE NO SE OPTIMIZÓ VA DENTRO**: un horario que no dice qué no miró se
 * lee como uno que lo miró todo. Quien lea «77 de 77» y no vea esto va a suponer que el programa
 * miró lo que él tiene en la cabeza.
 */
const Veredicto: React.FC<{ frame: number; fps: number; ancho: number }> = ({ frame, fps, ancho }) => {
	if (frame < G_VEREDICTO) { return null; }

	const vivo = entra(frame, fps, G_VEREDICTO, 16) * (1 - seVa(frame, 0, R_SALIDA - 8, 0, 12));
	if (vivo <= 0.01) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				left: R.relleno + 60,
				width: ancho - 120,
				top: CABECERA_Y + 70,
				padding: 30,
				borderRadius: 12,
				background: PAPEL,
				border: `1px solid ${LEGAL_LINEA}`,
				boxShadow: '0 22px 60px rgba(15,28,52,.24)',
				opacity: vivo,
				transform: `translateY(${interpolate(vivo, [0, 1], [22, 0])}px)`,
				zIndex: 50,
			}}
		>
			<div style={{ fontSize: 27, fontWeight: 700 }}>77 de 77 lecciones colocadas</div>
			<div style={{ fontSize: 18, color: TENUE, marginTop: 10 }}>
				Recocido simulado · 38 s · 4 arranques · la bandeja quedó vacía.
			</div>
			<div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${LINEA}` }}>
				<div style={{ fontSize: 18, fontWeight: 600 }}>Lo que este horario NO tuvo en cuenta (3)</div>
				<ul style={{ margin: '10px 0 0', paddingLeft: 22, fontSize: 17, color: TENUE, lineHeight: 1.6 }}>
					<li>Que a nadie le toquen dos horas seguidas de la misma asignatura.</li>
					<li>La preferencia de mañana o tarde de cada docente.</li>
					<li>El reparto de salones entre dos grupos que caben en el mismo.</li>
				</ul>
			</div>
		</div>
	);
};

/* La chistera del botón. Es una chistera y no un destello a propósito: un destello se lee como
   «esto lo hace una IA», y detrás de este botón hay un recocido. */
const Chistera: React.FC = () => (
	<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
		<path d="M8 4h8v9H8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
		<path d="M3 13h18v2.5c0 1.4-4 2.5-9 2.5s-9-1.1-9-2.5z" fill="currentColor" />
	</svg>
);
