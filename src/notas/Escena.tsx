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
import { AVISO_DURA, COLUMNA_TECLEADA, RITMO, Ritmo, SALIDA, textoDelAviso } from './guion';
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

/*
 * AUS Y TARD VAN DESPUÉS DEL TOTAL, como en app2. Para que quepan sin bajar el encuadre se estrechó
 * lo que sobraba --el nombre más largo no llega a 400, y la casilla mide 92--: la tabla sigue midiendo
 * lo mismo que antes de tenerlas.
 */
/*
 * `real` y `marca` sólo se usan con la opción `definitivas` (Real, M y R entre el Total y Aus): sin
 * ella no entran en ninguna cuenta y la tabla mide lo de siempre.
 */
const ANCHOS = { num: 64, alumno: 400, nota: 150, total: 120, falta: 88, relleno: 32, real: 116, marca: 58 };
const ALTO_FILA = 62;
const ALTO_UNIDAD = 44;
const ALTO_SUBCOLUMNA = 48;

const ANCHO_TABLA = ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * COLUMNAS.length + ANCHOS.total + ANCHOS.falta * 2;

/** El bloque del título: su alto más el hueco que deja debajo. Hace falta para colocar cosas encima. */
const ALTO_TITULO = 40 + 22;

export type Anchos = typeof ANCHOS;
export type ColumnaDePlanilla = 'num' | 'alumno' | 'total' | 'real' | 'm' | 'r' | 'ausencias' | 'tardanzas' | number;

/** Lo que ocupan Real, M y R juntas; 0 sin la opción `definitivas`. */
const anchoDefinitivas = (a: Anchos, con: boolean) => (con ? a.real + a.marca * 2 : 0);

/*
 * LA GEOMETRÍA DE LA PLANILLA, PARA QUIEN LA SEÑALA DESDE FUERA (los vídeos de ayuda). Sale de las
 * mismas constantes que el dibujo, así que el foco y el puntero no pueden señalar al vecino. Todo va
 * en coordenadas del PANEL (su esquina de arriba a la izquierda, con el relleno dentro); para pasar
 * al fotograma, `planillaEnElFotograma`, que sólo vale con la escena `quieta`.
 *
 * `filas` es cuántas filas se ven (el buscador puede esconder algunas: el hueco se conserva igual).
 */
export function geometriaDePlanilla(o: { anchos?: Partial<Anchos>; encima?: number; definitivas?: boolean } = {}) {
	const a: Anchos = { ...ANCHOS, ...o.anchos };
	const encima = o.encima ?? 0;
	const def = anchoDefinitivas(a, o.definitivas ?? false);
	const anchoTabla = a.num + a.alumno + a.nota * COLUMNAS.length + a.total + def + a.falta * 2;
	const arribaTabla = a.relleno + ALTO_TITULO + encima;
	/* El borde de la tabla (1) y la cabecera con su raya (92 + 1). */
	const arribaFilas = arribaTabla + 1 + ALTO_UNIDAD + ALTO_SUBCOLUMNA + 1;

	const izquierdaDe = (c: ColumnaDePlanilla): number => {
		const base = a.relleno + 1;
		if (c === 'num') { return base; }
		if (c === 'alumno') { return base + a.num; }
		const notas = base + a.num + a.alumno;
		if (typeof c === 'number') { return notas + a.nota * c; }
		const total = notas + a.nota * COLUMNAS.length;
		if (c === 'total') { return total; }
		if (c === 'real') { return total + a.total; }
		if (c === 'm') { return total + a.total + a.real; }
		if (c === 'r') { return total + a.total + a.real + a.marca; }
		return c === 'ausencias' ? total + a.total + def : total + a.total + def + a.falta;
	};
	const anchoDe = (c: ColumnaDePlanilla): number =>
		c === 'num' ? a.num : c === 'alumno' ? a.alumno : c === 'total' ? a.total : c === 'real' ? a.real : c === 'm' || c === 'r' ? a.marca : typeof c === 'number' ? a.nota : a.falta;

	return {
		anchos: a,
		ancho: anchoTabla + a.relleno * 2,
		alto: a.relleno * 2 + ALTO_TITULO + encima + 2 + ALTO_UNIDAD + ALTO_SUBCOLUMNA + 1 + ALUMNOS.length * ALTO_FILA,
		/** El hueco de `encima`, entre el título y la tabla. */
		encima: { x: a.relleno, y: a.relleno + ALTO_TITULO, ancho: anchoTabla, alto: encima },
		/** Una celda de la fila que se ve en el puesto `puesto` (0 = la primera que se ve). */
		celda: (puesto: number, c: ColumnaDePlanilla) => ({
			x: izquierdaDe(c),
			y: arribaFilas + puesto * ALTO_FILA,
			ancho: anchoDe(c),
			alto: ALTO_FILA - 1,
		}),
		/** La casilla de nota de esa celda: 92 × 46, centrada. */
		casilla: (puesto: number, c: number) => ({
			x: izquierdaDe(c) + (a.nota - 92) / 2,
			y: arribaFilas + puesto * ALTO_FILA + (ALTO_FILA - 1 - 46) / 2,
			ancho: 92,
			alto: 46,
		}),
		/** El título de una columna de notas (la segunda fila de la cabecera). */
		cabecera: (c: number) => ({
			x: izquierdaDe(c),
			y: arribaTabla + 1 + ALTO_UNIDAD,
			ancho: a.nota,
			alto: ALTO_SUBCOLUMNA,
		}),
		/** El título de una columna de las de dos pisos (Total, Real, M, R, Aus, Tard). */
		cabeceraDe: (c: ColumnaDePlanilla) => ({
			x: izquierdaDe(c),
			y: arribaTabla + 1,
			ancho: anchoDe(c),
			alto: ALTO_UNIDAD + ALTO_SUBCOLUMNA,
		}),
		/** De la cabecera a la última fila, una columna entera. */
		columna: (c: ColumnaDePlanilla) => ({
			x: izquierdaDe(c),
			y: arribaTabla + 1,
			ancho: anchoDe(c),
			alto: ALTO_UNIDAD + ALTO_SUBCOLUMNA + 1 + ALUMNOS.length * ALTO_FILA,
		}),
	};
}

/**
 * DE COORDENADAS DEL PANEL AL FOTOGRAMA, con la escena `quieta` y el `ajuste` que se le pasó. El
 * panel va centrado y se escala desde su centro; `ajuste.y` lo sube.
 */
export function planillaEnElFotograma(
	g: { ancho: number; alto: number },
	r: { x: number; y: number; ancho: number; alto: number },
	ajuste: { escala?: number; y?: number } = {},
) {
	const k = ENCUADRE.planilla * (ajuste.escala ?? 1);
	const cx = 1920 / 2;
	const cy = 1080 / 2 + (ajuste.y ?? 0);
	return {
		x: cx + (r.x - g.ancho / 2) * k,
		y: cy + (r.y - g.alto / 2) * k,
		ancho: r.ancho * k,
		alto: r.alto * k,
	};
}

/*
 * LO QUE HAY EN LA PLANILLA EN UN FOTOGRAMA, cuando lo cuenta otro guion y no los tecleos del ritmo
 * (la nota rápida: clics que ponen, borran y deshacen). Todo opcional salvo las notas.
 */
export interface EstadoDePlanilla {
	/** Una fila por alumno de `ALUMNOS`, en su orden; `null` es la casilla vacía. */
	notas: (number | null)[][];
	/** El aro de cada casilla: desde cuándo está y cuándo lo apaga el lote. */
	aros?: ({ desde: number; confirma: number } | null)[][];
	/** Las filas que se ven, en su orden (el buscador). Sin esto, todas. */
	filas?: number[];
	/** La casilla que el ratón tiene encima con la nota rápida puesta. */
	senalada?: { fila: number; columna: number } | null;
}

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

/** Las cabeceras, en el orden en que se escriben. */
const TITULOS = ['No', 'Alumno', UNIDAD, ...COLUMNAS, 'Total', 'Aus', 'Tard'];
/** Y con Real, M y R: van después del Total, como en app2 (`planilla-notas.html`). */
const TITULOS_CON_DEFINITIVAS = ['No', 'Alumno', UNIDAD, ...COLUMNAS, 'Total', 'Real', 'M', 'R', 'Aus', 'Tard'];

/*
 * LA DEFINITIVA DE UNA FILA, cuando se pintan Real, M y R (opción `definitivas`). Real es un campo
 * como el de las notas --mismo aro, mismo `[disabled]`-- y M y R son dos `nz-checkbox`.
 */
export interface DefinitivaEnFila {
	/** Lo que se ve en Real. Cadena vacía, vacía. */
	real: string;
	m: boolean;
	r: boolean;
	/** Real con el foco y el cursor de escribir. */
	foco?: boolean;
	aro?: { desde: number; confirma: number } | null;
	/** Las tres apagadas (`!puedeNivelar()`). */
	apagada?: boolean;
	/** La marca que el ratón tiene encima. */
	senalada?: 'm' | 'r' | null;
}

function loTecleado(frame: number, valor: string, empieza: number, porTecla: number): string {
	if (frame < empieza) { return ''; }
	const teclas = Math.min(valor.length, Math.floor((frame - empieza) / porTecla) + 1);
	return valor.slice(0, teclas);
}

function tecleoActivo(frame: number, r: Ritmo): number | null {
	let activo: number | null = null;
	r.TECLEOS.forEach((t, i) => { if (frame >= t.empieza - r.FOCO_ANTES) { activo = i; } });
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
	/**
	 * A QUÉ VELOCIDAD SE CUENTA. Por defecto, el del clip promocional. El vídeo de ayuda pasa el
	 * suyo, con los tiempos de verdad de la aplicación: ver la cabecera de `Ritmo` en `guion.ts`.
	 */
	ritmo?: Ritmo;
	/**
	 * DÓNDE CAE LA PANTALLA DENTRO DEL FOTOGRAMA. `conRotulo` es el caso del promocional --encoger y
	 * subir para dejar sitio al texto de abajo-- y esto es lo mismo dicho con números, para cuando
	 * encima hay además una cabecera de ayuda y el hueco no es el de siempre.
	 */
	ajuste?: { escala?: number; y?: number };
	/*
	 * LO QUE AÑADEN LOS VÍDEOS DE AYUDA DE LA NOTA RÁPIDA Y DE LA ASISTENCIA. Todo opcional y, sin
	 * pasarlo, la planilla sale byte a byte como antes (medido con `cmp` sobre Notas-Aro y
	 * Ayuda-Planilla-Teclear).
	 */
	/** Las notas de cada fotograma, cuando no salen de `ritmo.TECLEOS`. Ver `EstadoDePlanilla`. */
	estado?: (frame: number) => EstadoDePlanilla;
	/** Lo que va entre el título y la tabla (la franja de la nota rápida, el buscador, un aviso). */
	encima?: { alto: number; nodo: React.ReactNode };
	/** Lo que se pinta encima del panel en sus coordenadas: el puntero, sobre todo. */
	sobre?: React.ReactNode;
	/** Otros anchos de columna: Aus y Tard con sus botones de fecha no caben en 88. */
	anchos?: Partial<Anchos>;
	/** Lo que va en Aus y Tard cuando no es sólo el número. */
	falta?: (fila: number, cual: 'ausencias' | 'tardanzas') => React.ReactNode;
	/** El periodo está cerrado: ninguna casilla se deja tocar. */
	cerrada?: boolean;
	/** Sin el acercamiento lento: el foco de fuera tiene que caer en un sitio que no se mueva. */
	quieta?: boolean;
	/** Real, M y R después del Total, con lo que hay en cada fila. Sin esto, no se pintan. */
	definitivas?: (fila: number, frame: number) => DefinitivaEnFila;
}> = ({ conRotulo = false, salidaEn, avisoDura, rubrica = null, ritmo = RITMO, ajuste, estado, encima, sobre, anchos, falta, cerrada = false, quieta = false, definitivas }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const r = ritmo;
	const salida = salidaEn ?? r.SALIDA;

	/*
	 * EL FOCO DE LA ÚLTIMA NOTA SE APAGA CUANDO VUELVE EL PUNTERO. Sin esto, en el clip combinado se
	 * quedaban **dos sitios encendidos a la vez** --la fila que se tecleó y la casilla del botón de
	 * rúbrica--, y dos señales de «mira aquí» son ninguna. Al soltar el teclado y coger el ratón, el
	 * docente ya no está en esa celda.
	 */
	const tecleando = rubrica === null || frame < rubrica.cursor;
	const activo = tecleando ? tecleoActivo(frame, r) : null;

	/* La fila señalada es la que se teclea, y luego la que el ratón visita. */
	const filaTocada = activo !== null
		? r.TECLEOS[activo].fila
		: rubrica && frame >= rubrica.llega && frame < rubrica.clic + 6
			? rubrica.fila
			: null;

	/* Lo que hay en cada casilla AHORA. El total sale de aquí, así que se recalcula al escribir. */
	const e = estado ? estado(frame) : null;
	const notasAhora = e ? e.notas.map((n) => [...n]) : ALUMNOS.map((a) => [...a.notas]);
	const orden = e?.filas ?? ALUMNOS.map((_, i) => i);
	const A: Anchos = anchos ? { ...ANCHOS, ...anchos } : ANCHOS;
	const anchoTabla = A.num + A.alumno + A.nota * COLUMNAS.length + A.total + anchoDefinitivas(A, Boolean(definitivas)) + A.falta * 2;
	r.TECLEOS.forEach((t) => {
		const texto = loTecleado(frame, t.valor, t.empieza, r.POR_TECLA);
		notasAhora[t.fila][COLUMNA_TECLEADA] = texto === '' ? null : Number(texto);
	});

	/* El panel: lo único que entra de golpe, porque es el marco y no el contenido. */
	const panel = entra(frame, fps, 0, 14);
	const escala = quieta ? ENCUADRE.planilla : interpolate(frame, [0, salida + 46], [ENCUADRE.planilla, ENCUADRE.planilla + 0.05]);

	/*
	 * Y AL FINAL SE VA EL PANEL TAMBIÉN, después de las filas: primero se vacía y luego se recoge.
	 * Al revés --recogerlo con las filas dentro-- se lee como que la pantalla se cerró, no como que
	 * el trabajo terminó.
	 */
	const panelFuera = interpolate(frame, [salida + 30, salida + 46], [0, 1], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
	});

	const salidaCabecera = seVa(frame, 0, salida, r.PASO_SALIDA);

	/* El encuadre: lo que diga `ajuste`, y si no, lo de siempre según lleve rótulo o no. */
	const conEscala = ajuste?.escala ?? (conRotulo ? CON_ROTULO : 1);
	const conY = ajuste?.y ?? (conRotulo ? -54 : 0);

	return (
		<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 34%, #f7f9fc 0%, #e6ebf2 62%, #dde3ec 100%)', fontFamily: FUENTE }}>
			<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
				<div
					style={{
						transform: `translateY(${conY}px) scale(${escala * conEscala * (1 - panelFuera * 0.03)})`,
						opacity: panel * (1 - panelFuera),
					}}
				>
					<div
						style={{
							position: 'relative',
							width: anchoTabla + A.relleno * 2,
							padding: A.relleno,
							borderRadius: 14,
							background: SUPERFICIE,
							boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
						}}
					>
						<Titulo frame={frame} fps={fps} fuera={salidaCabecera} r={r} />

						{encima && (
							<div style={{ position: 'relative', height: encima.alto, opacity: 1 - salidaCabecera }}>{encima.nodo}</div>
						)}

						<div
							style={{
								position: 'relative',
								width: anchoTabla,
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
										left: A.num + A.alumno + A.nota * COLUMNA_TECLEADA,
										width: A.nota,
										top: 0,
										bottom: 0,
										background: `${ACENTO}17`,
										/* La banda se va con la cabecera: si no, se queda una franja azul sobre el panel vacío. */
										opacity: 1 - salidaCabecera,
									}}
								/>
							)}

							<Cabecera frame={frame} fps={fps} fuera={salidaCabecera} r={r} a={A} conDefinitivas={Boolean(definitivas)} />

							{orden.map((fila, puesto) => {
								const alumno = ALUMNOS[fila];
								const t = r.TECLEOS.find((x) => x.fila === fila) ?? null;
								const escrito2 = t ? loTecleado(frame, t.valor, t.empieza, r.POR_TECLA) : null;
								const suma = total(notasAhora[fila]);

								const llegada = llega(frame, fps, fila, r.FILAS, r.PASO_FILA);
								const fuera = estiloDeSalida(seVa(frame, fila + 1, salida, r.PASO_SALIDA));

								return (
									<div
										key={alumno.nombre}
										style={{
											position: 'relative',
											display: 'flex',
											height: ALTO_FILA,
											alignItems: 'center',
											borderBottom: puesto === orden.length - 1 ? 'none' : `1px solid ${BORDE}`,
											/* El sombreado alterno: es lo que hace que el ojo no se salte de renglón. */
											backgroundColor: puesto % 2 === 1 ? 'rgb(128 128 128 / 8%)' : 'transparent',
											/* Y la franja de la fila tocada, que se va apagando hacia la derecha. */
											backgroundImage: fila === filaTocada ? `linear-gradient(90deg, ${ACENTO}38, ${ACENTO}0a)` : undefined,
											opacity: llegada.opacidad * fuera.opacidad,
											transform: `translate(${llegada.x + fuera.x}px, ${llegada.y}px) scale(${fuera.escala})`,
										}}
									>
										<Hueco ancho={A.num}>
											<span style={{ color: TEXTO_TENUE, fontSize: 21 }}>{puesto + 1}</span>
										</Hueco>

										<Hueco ancho={A.alumno} izquierda>
											<Avatar tipo={alumno.sexo} variante={fila} tam={42} />
											<span style={{ fontSize: 21, marginLeft: 14 }}>{alumno.nombre}</span>
										</Hueco>

										{COLUMNAS.map((col, c) => {
											const esLaQueSeTeclea = t !== null && c === COLUMNA_TECLEADA;
											const aro = e?.aros?.[fila]?.[c] ?? null;
											const valor = esLaQueSeTeclea
												? (escrito2 as string)
												: notasAhora[fila][c] === null ? '' : String(notasAhora[fila][c]);

											return (
												<Hueco key={col} ancho={A.nota}>
													<Casilla
														apagada={cerrada}
														rapida={e?.senalada?.fila === fila && e.senalada.columna === c}
														valor={valor}
														foco={esLaQueSeTeclea && activo !== null && r.TECLEOS[activo].fila === fila}
														/*
														 * EL ARO SE ENCIENDE CON LA PRIMERA TECLA y no cuando sale la petición:
														 * la marca compara **lo que se ve** con lo último que el servidor confirmó.
														 */
														aroDesde={aro ? aro.desde : esLaQueSeTeclea && t ? t.empieza : null}
														confirmadoEn={aro ? aro.confirma : esLaQueSeTeclea ? r.CONFIRMA : null}
													/>
												</Hueco>
											);
										})}

										<Hueco ancho={A.total}>
											<span style={{ fontSize: 22, fontWeight: 600, color: colorDeNota(suma), fontVariantNumeric: 'tabular-nums' }}>
												{suma ?? ''}
											</span>
										</Hueco>

										{definitivas && <CeldasDefinitiva d={definitivas(fila, frame)} a={A} />}

										<Hueco ancho={A.falta}>
											{falta ? falta(fila, 'ausencias') : <Falta cuantas={alumno.ausencias} />}
										</Hueco>
										<Hueco ancho={A.falta} ultimo>
											{falta ? falta(fila, 'tardanzas') : <Falta cuantas={alumno.tardanzas} />}
										</Hueco>
									</div>
								);
							})}
						</div>

						{/* El buscador esconde filas y la tabla encoge; el hueco se guarda para que el panel no salte. */}
						{e?.filas && <div style={{ height: (ALUMNOS.length - orden.length) * ALTO_FILA }} />}

						{rubrica && <RubricaSobreCasilla frame={frame} fps={fps} rubrica={rubrica} />}

						{sobre}
					</div>
				</div>
			</AbsoluteFill>

			<Aviso texto={textoDelAviso(r.TECLEOS)} desde={r.CONFIRMA} dura={avisoDura ?? AVISO_DURA} />

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
const Titulo: React.FC<{ frame: number; fps: number; fuera: number; r: Ritmo }> = ({ frame, fps, fuera, r }) => {
	const texto = escrito(frame, CABECERA.asignatura, r.TITULO, 2);
	const cursor = escribiendo(frame, CABECERA.asignatura, r.TITULO, 2) && frame % 20 < 12;
	const resto = entra(frame, fps, r.TITULO + CABECERA.asignatura.length * 2 + 4, 12);

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
/** Una casilla de Aus o Tard: el número de faltas del periodo. El cero se ve, pero apagado. */
const Falta: React.FC<{ cuantas: number }> = ({ cuantas }) => (
	<span style={{ fontSize: 21, color: cuantas === 0 ? TEXTO_TENUE : TEXTO, fontVariantNumeric: 'tabular-nums' }}>
		{cuantas}
	</span>
);

const Cabecera: React.FC<{ frame: number; fps: number; fuera: number; r: Ritmo; a?: Anchos; conDefinitivas?: boolean }> = ({ frame, fps, fuera, r, a = ANCHOS, conDefinitivas = false }) => {
	const titulos = conDefinitivas ? TITULOS_CON_DEFINITIVAS : TITULOS;
	/* Dónde caen Aus y Tard en la lista de títulos: detrás de Real, M y R si las hay. */
	const aus = conDefinitivas ? 10 : 7;
	const letra = (i: number): React.CSSProperties => ({
		fontSize: 19,
		fontWeight: 600,
		opacity: entra(frame, fps, r.CABECERAS + i * r.PASO_CABECERA, 8),
		whiteSpace: 'pre',
	});
	const dice = (i: number) => escrito(frame, titulos[i], r.CABECERAS + i * r.PASO_CABECERA, 2);

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
			<Hueco ancho={a.num} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
				<span style={letra(0)}>{dice(0)}</span>
			</Hueco>
			<Hueco ancho={a.alumno} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} izquierda>
				<span style={letra(1)}>{dice(1)}</span>
			</Hueco>

			<div style={{ width: a.nota * COLUMNAS.length, borderRight: `1px solid ${BORDE}` }}>
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
						<Hueco key={col} ancho={a.nota} ultimo={i === COLUMNAS.length - 1}>
							<span style={letra(3 + i)}>{dice(3 + i)}</span>
						</Hueco>
					))}
				</div>
			</div>

			<Hueco ancho={a.total} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
				<span style={letra(6)}>{dice(6)}</span>
			</Hueco>
			{conDefinitivas && (
				<>
					<Hueco ancho={a.real} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
						<span style={letra(7)}>{dice(7)}</span>
					</Hueco>
					<Hueco ancho={a.marca} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
						<span style={letra(8)}>{dice(8)}</span>
					</Hueco>
					<Hueco ancho={a.marca} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
						<span style={letra(9)}>{dice(9)}</span>
					</Hueco>
				</>
			)}
			<Hueco ancho={a.falta} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA}>
				<span style={letra(aus)}>{dice(aus)}</span>
			</Hueco>
			<Hueco ancho={a.falta} alto={ALTO_UNIDAD + ALTO_SUBCOLUMNA} ultimo>
				<span style={letra(aus + 1)}>{dice(aus + 1)}</span>
			</Hueco>
		</div>
	);
};

/*
 * REAL, M Y R DE UNA FILA (opción `definitivas`). Real es una casilla como las de nota, con su aro;
 * M y R, dos casillas de verificación de Ant: cuadrado con borde, y azul con la palomita al marcarse.
 */
const CeldasDefinitiva: React.FC<{ d: DefinitivaEnFila; a: Anchos }> = ({ d, a }) => (
	<>
		<Hueco ancho={a.real}>
			<Casilla
				valor={d.real}
				foco={d.foco ?? false}
				aroDesde={d.aro ? d.aro.desde : null}
				confirmadoEn={d.aro ? d.aro.confirma : null}
				apagada={d.apagada ?? false}
			/>
		</Hueco>
		<Hueco ancho={a.marca}>
			<Marca puesta={d.m} apagada={d.apagada ?? false} senalada={d.senalada === 'm'} />
		</Hueco>
		<Hueco ancho={a.marca}>
			<Marca puesta={d.r} apagada={d.apagada ?? false} senalada={d.senalada === 'r'} />
		</Hueco>
	</>
);

const Marca: React.FC<{ puesta: boolean; apagada: boolean; senalada: boolean }> = ({ puesta, apagada, senalada }) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			borderRadius: 5,
			boxSizing: 'border-box',
			border: `1.5px solid ${puesta && !apagada ? ACENTO : senalada ? ACENTO : BORDE}`,
			background: apagada ? '#f5f5f5' : puesta ? ACENTO : SUPERFICIE,
		}}
	>
		{puesta && (
			<svg width="16" height="16" viewBox="0 0 16 16">
				<path d="M3.2 8.4 L6.6 11.6 L12.8 4.8" fill="none" stroke={apagada ? 'rgba(0,0,0,.25)' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)}
	</span>
);

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
