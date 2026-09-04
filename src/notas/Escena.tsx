import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../comunes/Avatar';
import { BotonRubrica } from '../comunes/BotonRubrica';
import { CON_ROTULO, ENCUADRE } from '../comunes/encuadre';
import { Cursor } from '../comunes/Cursor';
import { Hueco } from '../comunes/Hueco';
import { entra, escribiendo, escrito, estiloDeSalida, llega, seVa } from '../comunes/movimiento';
import { Aviso } from './Aviso';
import { Casilla } from './Casilla';
import { ALUMNOS, CABECERA, COLUMNAS, MINIMA_ACEPTADA, NOTA_ALTA, UNIDAD, total } from './planilla';
import {
	AVISO_DURA, CABECERAS, COLUMNA_TECLEADA, CONFIRMA, FILAS, FOCO_ANTES, PASO_CABECERA, PASO_FILA,
	PASO_SALIDA, POR_TECLA, SALIDA, TECLEOS, TITULO, textoDelAviso,
} from './guion';
import { ACENTO, BORDE, FUENTE, PERDIDA_LETRA, SUPERFICIE, SUPERIOR_LETRA, TEXTO, TEXTO_TENUE } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PLANILLA DE UN GRUPO: SE MONTA, SE CALIFICA Y SE VA.
 *
 * NO ES UNA `<table>`, Y ESO NO ES UN CAPRICHO. La primera versión sí lo era, copiando la pantalla.
 * Pero **`transform` y `opacity` sobre un `<tr>` no son de fiar**, y aquí cada fila tiene que poder
 * llegar y marcharse por su cuenta: es la mitad del encargo. Con filas de `flex` cada una se mueve
 * sola y sin sorpresas.
 *
 * LO QUE SE PIERDE AL DEJAR LA TABLA es el truco del `<col>` para la columna tocada -- el navegador
 * pintaba la columna por debajo de las filas y por eso el cruce salía más fuerte que los dos brazos.
 * Se recupera a mano: la banda de la columna va en una capa por debajo y las filas van con fondos
 * translúcidos, así que el cruce **se sigue sumando**, que era lo que valía.
 */

const ANCHOS = { num: 64, alumno: 440, nota: 170, total: 140, relleno: 32 };
const ALTO_FILA = 62;
const ALTO_UNIDAD = 44;
const ALTO_SUBCOLUMNA = 48;

const ANCHO_TABLA = ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * 3 + ANCHOS.total;

/** El bloque del título: su alto más el hueco que deja debajo. Hace falta para colocar cosas encima. */
const ALTO_TITULO = 40 + 22;

/** El centro de una casilla, en coordenadas del panel. Es lo que necesitan el puntero y el botón. */
function centroDeCasilla(fila: number, columna: number) {
	return {
		x: ANCHOS.relleno + ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * columna + ANCHOS.nota / 2,
		y: ANCHOS.relleno + ALTO_TITULO + ALTO_UNIDAD + ALTO_SUBCOLUMNA + ALTO_FILA * fila + ALTO_FILA / 2,
	};
}

/*
 * LO QUE HACE FALTA PARA QUE ESTA MISMA PLANILLA SIRVA DE ENTRADA AL CLIP DE RÚBRICAS: el puntero
 * llega a una casilla y aparece el botón. Va como opción y no como otra escena **porque es la misma
 * pantalla**: duplicarla para añadirle un botón sería tener dos planillas que se separan.
 */
export interface RubricaEnCasilla {
	fila: number;
	columna: number;
	/** El puntero entra. */
	cursor: number;
	/** Llega a la casilla -- y es su llegada la que hace aparecer el botón. */
	llega: number;
	boton: number;
	clic: number;
}

/** Dónde empieza la columna que se está calificando, para poder pintarle la banda debajo. */
const IZQUIERDA_COLUMNA = ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * COLUMNA_TECLEADA;

/** Las cabeceras, en el orden en que se escriben. */
const TITULOS = ['No', 'Alumno', UNIDAD, ...COLUMNAS, 'Total'];

function loTecleado(frame: number, valor: string, empieza: number): string {
	if (frame < empieza) { return ''; }
	const teclas = Math.min(valor.length, Math.floor((frame - empieza) / POR_TECLA) + 1);
	return valor.slice(0, teclas);
}

function tecleoActivo(frame: number): number | null {
	let activo: number | null = null;
	TECLEOS.forEach((t, i) => { if (frame >= t.empieza - FOCO_ANTES) { activo = i; } });
	return activo;
}

function colorDeNota(n: number | null): string {
	if (n === null) { return TEXTO; }
	if (n < MINIMA_ACEPTADA) { return PERDIDA_LETRA; }
	if (n >= NOTA_ALTA) { return SUPERIOR_LETRA; }
	return TEXTO;
}

export const Escena: React.FC<{
	conRotulo?: boolean;
	/** Cuándo se va la pantalla. Se pasa cuando el clip sigue después, como en `combinado`. */
	salidaEn?: number;
	/** Lo que dura el aviso del lote. Por defecto, hasta que la pantalla se va. */
	avisoDura?: number;
	/** El botón de rúbrica sobre una casilla, con su puntero. Ver `RubricaEnCasilla`. */
	rubrica?: RubricaEnCasilla | null;
}> = ({ conRotulo = false, salidaEn, avisoDura, rubrica = null }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const salida = salidaEn ?? SALIDA;

	/*
	 * EL FOCO DE LA ÚLTIMA NOTA SE APAGA CUANDO VUELVE EL PUNTERO. Sin esto, en el clip combinado se
	 * quedaban **dos sitios encendidos a la vez** --la fila que se tecleó y la casilla del botón de
	 * rúbrica--, y dos señales de «mira aquí» son ninguna. Al soltar el teclado y coger el ratón, el
	 * docente ya no está en esa celda.
	 */
	const tecleando = rubrica === null || frame < rubrica.cursor;
	const activo = tecleando ? tecleoActivo(frame) : null;

	/* La fila señalada es la que se teclea, y luego la que el ratón visita. */
	const filaTocada = activo !== null
		? TECLEOS[activo].fila
		: rubrica && frame >= rubrica.llega && frame < rubrica.clic + 6
			? rubrica.fila
			: null;

	/* Lo que hay en cada casilla AHORA. El total sale de aquí, así que se recalcula al escribir. */
	const notasAhora = ALUMNOS.map((a) => [...a.notas]);
	TECLEOS.forEach((t) => {
		const texto = loTecleado(frame, t.valor, t.empieza);
		notasAhora[t.fila][COLUMNA_TECLEADA] = texto === '' ? null : Number(texto);
	});

	/* El panel: lo único que entra de golpe, porque es el marco y no el contenido. */
	const panel = entra(frame, fps, 0, 14);
	const escala = interpolate(frame, [0, 296], [ENCUADRE.planilla, ENCUADRE.planilla + 0.05]);

	/*
	 * Y AL FINAL SE VA EL PANEL TAMBIÉN, después de las filas: primero se vacía y luego se recoge.
	 * Al revés --recogerlo con las filas dentro-- se lee como que la pantalla se cerró, no como que
	 * el trabajo terminó.
	 */
	const panelFuera = interpolate(frame, [salida + 30, salida + 46], [0, 1], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
	});

	const salidaCabecera = seVa(frame, 0, salida, PASO_SALIDA);

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<div
					style={{
						transform: `translateY(${conRotulo ? -54 : 0}px) scale(${escala * (conRotulo ? CON_ROTULO : 1) * (1 - panelFuera * 0.03)})`,
						opacity: panel * (1 - panelFuera),
					}}
				>
					<div
						style={{
							position: 'relative',
							width: ANCHO_TABLA + ANCHOS.relleno * 2,
							padding: ANCHOS.relleno,
							borderRadius: 14,
							background: SUPERFICIE,
							boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
						}}
					>
						<Titulo frame={frame} fps={fps} fuera={salidaCabecera} />

						<div
							style={{
								position: 'relative',
								width: ANCHO_TABLA,
								border: `1px solid ${BORDE}`,
								borderRadius: 6,
								overflow: 'hidden',
							}}
						>
							{/*
							  * LA BANDA DE LA COLUMNA QUE SE ESTÁ CALIFICANDO. Va debajo de todo -- de la
							  * cabecera también, porque si no, la columna que acabas de tocar se encendería
							  * entera menos su título, que es justo el que dice cuál es.
							  */}
							{activo !== null && (
								<div
									style={{
										position: 'absolute',
										left: IZQUIERDA_COLUMNA,
										width: ANCHOS.nota,
										top: 0,
										bottom: 0,
										background: `${ACENTO}17`,
										/* La banda se va con la cabecera: si no, se queda una franja azul sobre el panel vacío. */
										opacity: 1 - salidaCabecera,
									}}
								/>
							)}

							<Cabecera frame={frame} fps={fps} fuera={salidaCabecera} />

							{ALUMNOS.map((alumno, fila) => {
								const t = TECLEOS.find((x) => x.fila === fila) ?? null;
								const escrito2 = t ? loTecleado(frame, t.valor, t.empieza) : null;
								const suma = total(notasAhora[fila]);

								const llegada = llega(frame, fps, fila, FILAS, PASO_FILA);
								const fuera = estiloDeSalida(seVa(frame, fila + 1, salida, PASO_SALIDA));

								return (
									<div
										key={alumno.nombre}
										style={{
											position: 'relative',
											display: 'flex',
											height: ALTO_FILA,
											alignItems: 'center',
											borderBottom: fila === ALUMNOS.length - 1 ? 'none' : `1px solid ${BORDE}`,
											/* El sombreado alterno: es lo que hace que el ojo no se salte de renglón. */
											backgroundColor: fila % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
											/* Y la franja de la fila tocada, que se va apagando hacia la derecha. */
											backgroundImage: fila === filaTocada ? `linear-gradient(90deg, ${ACENTO}38, ${ACENTO}0a)` : undefined,
											opacity: llegada.opacidad * fuera.opacidad,
											transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
										}}
									>
										<Hueco ancho={ANCHOS.num}>
											<span style={{ color: TEXTO_TENUE, fontSize: 21 }}>{fila + 1}</span>
										</Hueco>

										<Hueco ancho={ANCHOS.alumno} izquierda>
											<Avatar tipo={alumno.sexo} variante={fila} tam={42} />
											<span style={{ fontSize: 21, marginLeft: 14 }}>{alumno.nombre}</span>
										</Hueco>

										{COLUMNAS.map((col, c) => {
											const esLaQueSeTeclea = t !== null && c === COLUMNA_TECLEADA;
											const valor = esLaQueSeTeclea
												? (escrito2 as string)
												: notasAhora[fila][c] === null ? '' : String(notasAhora[fila][c]);

											return (
												<Hueco key={col} ancho={ANCHOS.nota}>
													<Casilla
														valor={valor}
														foco={esLaQueSeTeclea && activo !== null && TECLEOS[activo].fila === fila}
														/*
														 * EL ARO SE ENCIENDE CON LA PRIMERA TECLA y no cuando sale la petición:
														 * la marca compara **lo que se ve** con lo último que el servidor confirmó.
														 */
														aroDesde={esLaQueSeTeclea && t ? t.empieza : null}
														confirmadoEn={esLaQueSeTeclea ? CONFIRMA : null}
													/>
												</Hueco>
											);
										})}

										<Hueco ancho={ANCHOS.total} ultimo>
											<span style={{ fontSize: 22, fontWeight: 600, color: colorDeNota(suma), fontVariantNumeric: 'tabular-nums' }}>
												{suma ?? ''}
											</span>
										</Hueco>
									</div>
								);
							})}
						</div>

						{rubrica && <RubricaSobreCasilla frame={frame} fps={fps} rubrica={rubrica} />}
					</div>
				</div>
			</AbsoluteFill>

			<Aviso texto={textoDelAviso()} desde={CONFIRMA} dura={avisoDura ?? AVISO_DURA} />

			{conRotulo && <Rotulo />}
		</AbsoluteFill>
	);
};

/*
 * EL BOTÓN DE RÚBRICA SOBRE UNA CASILLA, con el puntero que lo hace aparecer. Es el puente entre este
 * clip y el de rúbricas: quien mira ve **de dónde se entra**, que es lo que no se entendería si la
 * matriz apareciera sola.
 */
const RubricaSobreCasilla: React.FC<{ frame: number; fps: number; rubrica: RubricaEnCasilla }> = ({ frame, fps, rubrica }) => {
	const punto = centroDeCasilla(rubrica.fila, rubrica.columna);
	const visible = entra(frame, fps, rubrica.boton, 14) * (1 - seVa(frame, 0, rubrica.clic + 4, 0, 10));

	return (
		<>
			<BotonRubrica x={punto.x} y={punto.y} visible={visible} />
			<Cursor
				puntos={[
					{ frame: rubrica.cursor, x: ANCHO_TABLA - 40, y: punto.y + ALTO_FILA * 2.6 },
					{ frame: rubrica.llega, x: punto.x + 40, y: punto.y - 6 },
					/* Cae sobre el botón por su lado izquierdo: encima del texto lo taparía justo al leerlo. */
					{ frame: rubrica.clic - 6, x: punto.x - 150, y: punto.y + 50 },
				]}
				clics={[rubrica.clic]}
				aparece={rubrica.cursor}
				sale={rubrica.clic + 6}
			/>
		</>
	);
};

/*
 * EL TÍTULO SE ESCRIBE, con su cursor. Es lo primero que se lee y por eso es lo primero que se monta:
 * antes de enseñar una tabla de notas hay que decir de qué asignatura y de qué grupo son.
 */
const Titulo: React.FC<{ frame: number; fps: number; fuera: number }> = ({ frame, fps, fuera }) => {
	const texto = escrito(frame, CABECERA.asignatura, TITULO, 2);
	const cursor = escribiendo(frame, CABECERA.asignatura, TITULO, 2) && frame % 20 < 12;
	const resto = entra(frame, fps, TITULO + CABECERA.asignatura.length * 2 + 4, 12);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				gap: 14,
				marginBottom: 22,
				height: 40,
				opacity: 1 - fuera,
				transform: `translateY(${-fuera * 26}px)`,
			}}
		>
			<span style={{ fontSize: 30, fontWeight: 600, color: TEXTO, whiteSpace: 'pre' }}>
				{texto}
				<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
			</span>
			<span style={{ fontSize: 22, color: ACENTO, fontWeight: 600, opacity: resto }}>{CABECERA.grupo}</span>
			<span style={{ fontSize: 19, color: TEXTO_TENUE, opacity: resto }}>· {CABECERA.periodo}</span>
		</div>
	);
};

/*
 * LAS CABECERAS SE ESCRIBEN UNA DETRÁS DE OTRA, y en el orden en que hay que leerlas: primero de
 * quién es la fila (No, Alumno), luego de qué unidad son las notas, luego cada columna, y al final
 * el total. **La geometría no se mueve** -- se mueve el texto: si cada celda entrara volando, las
 * rayas de la tabla bailarían y lo que se ve sería un desorden, no una pantalla montándose.
 */
const Cabecera: React.FC<{ frame: number; fps: number; fuera: number }> = ({ frame, fps, fuera }) => {
	const letra = (i: number): React.CSSProperties => ({
		fontSize: 19,
		fontWeight: 600,
		opacity: entra(frame, fps, CABECERAS + i * PASO_CABECERA, 8),
		whiteSpace: 'pre',
	});
	const dice = (i: number) => escrito(frame, TITULOS[i], CABECERAS + i * PASO_CABECERA, 2);

	const fondo: React.CSSProperties = {
		/* Gris medio con alfa: sirve igual sobre fondo claro que sobre oscuro, y deja pasar la banda. */
		backgroundColor: 'rgb(128 128 128 / 14%)',
		borderBottom: `1px solid ${BORDE}`,
	};

	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				...fondo,
				opacity: 1 - fuera,
				transform: `translateY(${-fuera * 30}px)`,
			}}
		>
			<Hueco ancho={ANCHOS.num} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
				<span style={letra(0)}>{dice(0)}</span>
			</Hueco>
			<Hueco ancho={ANCHOS.alumno} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} izquierda>
				<span style={letra(1)}>{dice(1)}</span>
			</Hueco>

			<div style={{ width: ANCHOS.nota * 3, borderRight: `1px solid ${BORDE}` }}>
				<div
					style={{
						height: ALTO_UNIDAD,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderBottom: `1px solid ${BORDE}`,
					}}
				>
					<span style={letra(2)}>{dice(2)}</span>
				</div>
				<div style={{ display: 'flex', height: ALTO_SUBCOLUMNA }}>
					{COLUMNAS.map((col, i) => (
						<Hueco key={col} ancho={ANCHOS.nota} ultimo={i === COLUMNAS.length - 1}>
							<span style={letra(3 + i)}>{dice(3 + i)}</span>
						</Hueco>
					))}
				</div>
			</div>

			<Hueco ancho={ANCHOS.total} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} ultimo>
				<span style={letra(6)}>{dice(6)}</span>
			</Hueco>
		</div>
	);
};

/*
 * EL RÓTULO va en una composición aparte para que quien monta el vídeo pueda elegir: si él pone sus
 * propios textos, renderiza el clip limpio y no tiene que tapar nada.
 */
const Rotulo: React.FC = () => {
	const frame = useCurrentFrame();
	const a = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const b = interpolate(frame, [SALIDA, SALIDA + 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const y = interpolate(a, [0, 1], [22, 0]);

	return (
		<div style={{ position: 'absolute', left: 96, bottom: 74, opacity: a * b, transform: `translateY(${y}px)` }}>
			<div style={{ fontSize: 46, fontWeight: 700, color: '#0f1c34', letterSpacing: -0.6 }}>
				Sabes qué está guardado.
			</div>
			<div style={{ fontSize: 27, color: '#4a5872', marginTop: 8 }}>
				El aro marca la nota que aún no ha salido. Un aviso por tanda, no uno por nota.
			</div>
		</div>
	);
};
