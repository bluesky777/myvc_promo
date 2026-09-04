import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { Toque } from '../../comunes/Toque';
import { entra, escribiendo, escrito, llega, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { AccionesPorDefecto, Marco } from '../Marco';
import { AppDocente, AvisoQueSale, MovilFlotante } from '../Movil';
import { Aviso, Barra, Boton, Chip, Num, Over, Pildora, Tarjeta } from '../piezas';
import {
	AZUL, AZUL_SUAVE, MONO, NARANJA, OCRE, PAPEL, RAYA, RAYA2, RELLENO, SERIF, TARJETA, TINTA,
	TINTA2, TINTA3, TINTA_AZUL, VERDE,
} from '../tema';
import { CONFIRMADOS, DESTINATARIOS, EVENTO, OPCIONES, PROXIMOS, ROLES } from './datos';
import {
	CLIC_COLEGIOS, CLIC_COORDINADORES, CLIC_DOCENTES, CLIC_PUBLICAR, CLIC_RECTORES, CLIC_TIPO,
	COLUMNA_DERECHA, CONFIRMADO, CUANDO, CUENTA, CURSOR_ENTRA, CURSOR_PUBLICAR, DEDO,
	DEDO_CONFIRMA, DESTINO_ROTULO, DONDE, EVENTO as EVENTO_ENTRA, EVENTO_FILAS, MARCO, MOVIL,
	OPCIONES as OPCIONES_ENTRAN, PASO_OPCION, PORTAL_SUMA, PUSH, PUSH_DENTRO, PUSH_FUERA,
	PUSH_SALE, PUSH_VUELVE, SALIDA, TARJETA_COMPOSITOR, TITULO, TOCA_CONFIRMA, TOCA_PUSH,
	POR_TECLA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * COMUNICADOS Y EVENTOS: DEL NAVEGADOR AL BOLSILLO DE 401 PERSONAS.
 *
 * ES EL PRIMER CLIP DEL VÍDEO DEL PORTAL a propósito. Todo lo demás que el portal enseña son cifras
 * --matrícula, notas, bautismos, cartera-- y las cifras se miran. Esto se **usa**: alguien escribe,
 * pulsa un botón y trece colegios se enteran. Empezar por aquí dice, antes que nada, que el portal
 * no es un informe bonito.
 *
 * ── LA LICENCIA, ANOTADA ───────────────────────────────────────────────────────────────────────
 *
 * En el portal de verdad, entre pulsar «Publicar» y que suene el teléfono de un docente pasan
 * segundos --se encola el envío, sale el push, lo recibe el aparato--. Aquí van pegados, porque seis
 * segundos de pantalla quieta son seis segundos donde se pierde a quien mira. **Lo que no se toca es
 * el desenlace**: llega a los tres roles marcados, se abre dentro de la app que el docente ya usa, y
 * lo que él contesta vuelve a la pantalla de quien lo escribió. Eso sí es lo que hace el portal.
 *
 * Tampoco se enseña el campo «Mensaje» del compositor: el texto completo se lee en el teléfono, que
 * es donde importa. En una pantalla de 1440 metida en un 16:9, un párrafo de cuatro líneas se come
 * el sitio de lo que sí hay que ver.
 */

/* ── La geometría, en un solo sitio ────────────────────────────────────────────────────────────
 *
 * Las coordenadas del puntero salen de estas medidas, no de mirar el fotograma y adivinar: si mañana
 * cambia el alto de un bloque, el puntero sigue señalando lo que tiene que señalar.
 */
const ORIGEN_X = 40;
const TOP = 134;          // dónde empieza el cuerpo, bajo la cabecera de la pantalla
const CARD = 700;         // el compositor
const PAD = 26;

const Y_HEAD = 22, H_HEAD = 40;
const Y_PILLS = Y_HEAD + H_HEAD + 14, H_PILL = 34;
const Y_TITULO = Y_PILLS + H_PILL + 14, H_CAMPO = 58;
const Y_FECHAS = Y_TITULO + H_CAMPO + 12;
const Y_DESTINO = Y_FECHAS + H_CAMPO + 14;
const Y_AMBITO = Y_DESTINO + 22, H_FILA = 34;
const Y_ROLES = Y_AMBITO + H_FILA + 8;
const Y_CUENTA = Y_ROLES + H_FILA + 10, H_CUENTA = 42;
const Y_OPCIONES = Y_CUENTA + H_CUENTA + 14;
const Y_FILAS_OP = Y_OPCIONES + 20, H_OP = 42;
const Y_BOTONES = Y_FILAS_OP + H_OP * OPCIONES.length + 14, H_BOTON = 42;

const DERECHA_X = CARD + 24;

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL TELÉFONO VA EN COORDENADAS DE LA PANTALLA ENTERA (1440 × 812) y no de la columna de contenido,
 * porque tiene que poder salirse de ella: **se enseña grande y cortado por abajo**. La franja del
 * portal mide 812 de alto y el teléfono, a esta escala, mide 891: los últimos ochenta píxeles de la
 * app --que son lista vacía-- se quedan fuera de cuadro, y a cambio el texto de dentro se lee.
 */
const COLUMNA_X = 236 + 40;          // el rail, más el margen de la columna
const MOVIL_X = COLUMNA_X + DERECHA_X;
const MOVIL_Y = TOP;
const MOVIL_ESCALA = 0.95;

/** El hueco de la bandeja de avisos dentro del teléfono, ya en coordenadas de la pantalla. */
const AVISO_DENTRO = {
	x: MOVIL_X + 27 * MOVIL_ESCALA,
	y: MOVIL_Y + 75 * MOVIL_ESCALA,
	escala: MOVIL_ESCALA,
};

/**
 * DÓNDE SE PLANTA EL AVISO CUANDO SE DESPEGA: por delante del compositor, que es el sitio que acaba
 * de quedarse sin nada que mirar --ya está todo escrito y publicado-- y el único hueco donde cabe a
 * un tamaño en el que la frase se lee de un vistazo.
 */
const AVISO_FUERA = { x: COLUMNA_X + 44, y: TOP + 176, escala: 1.62 };

/** Un campo del formulario: su rótulo en versalitas y la caja de papel. */
const Campo: React.FC<{ etiqueta: string; children: React.ReactNode; select?: boolean; ancho?: number | string; t: number }> = ({
	etiqueta, children, select = false, ancho = '100%', t,
}) => (
	<div style={{ width: ancho, display: 'flex', flexDirection: 'column', gap: 6, opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }) }}>
		<Over>{etiqueta}</Over>
		<div style={{ display: 'flex', alignItems: 'center', gap: 8, background: PAPEL, border: `1px solid ${RAYA2}`, borderRadius: 5, padding: '11px 13px', fontSize: 13.5, height: 40, boxSizing: 'border-box' }}>
			<span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{children}</span>
			{select ? <span style={{ color: TINTA3 }}>▾</span> : null}
		</div>
	</div>
);

/** Un interruptor de «Cómo se envía». Se enciende solo cuando le toca. */
const Opcion: React.FC<{ texto: string; sub: string; on: number; t: number }> = ({ texto, sub, on, t }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 12,
			height: H_OP,
			borderBottom: `1px solid ${RAYA}`,
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateX(${interpolate(t, [0, 1], [-10, 0])}px)`,
		}}
	>
		<div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minWidth: 0 }}>
			<div style={{ fontSize: 12.5, fontWeight: 600 }}>{texto}</div>
			<div style={{ fontSize: 11.5, color: TINTA3, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
		</div>
		{/* El pulgar cruza de un lado a otro: encender es un gesto, no un cambio de color. */}
		<div style={{ width: 36, height: 20, borderRadius: 10, background: on > 0.5 ? VERDE : RAYA2, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 3px', boxSizing: 'border-box' }}>
			<span style={{ width: 14, height: 14, borderRadius: '50%', background: TARJETA, transform: `translateX(${interpolate(on, [0, 1], [0, 16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)` }} />
		</div>
	</div>
);

/** Una fecha del calendario de la red, en la columna de la derecha. */
const Evento: React.FC<{ mes: string; dia: string; titulo: string; alcance: string; pie: string; ocre?: boolean; t: number; nuevo?: boolean }> = ({
	mes, dia, titulo, alcance, pie, ocre = false, t, nuevo = false,
}) => (
	<div
		style={{
			display: 'flex',
			gap: 12,
			alignItems: 'flex-start',
			paddingBottom: 12,
			borderBottom: `1px solid ${RAYA}`,
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [14, 0])}px)`,
		}}
	>
		<div style={{ width: 44, height: 48, borderRadius: 8, background: ocre ? OCRE : TINTA_AZUL, color: TARJETA, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
			<span style={{ fontSize: 8, letterSpacing: '0.14em', color: ocre ? '#F0E7C2' : '#89B6DC', fontWeight: 500 }}>{mes}</span>
			<span style={{ fontFamily: SERIF, fontVariantNumeric: 'tabular-nums', fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{dia}</span>
		</div>
		<div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
			<span style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{titulo}</span>
			<span style={{ fontSize: 11, color: TINTA3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alcance}</span>
			<Num style={{ fontSize: 11, color: nuevo ? VERDE : TINTA2, fontWeight: nuevo ? 600 : 400 }}>{pie}</Num>
		</div>
	</div>
);

/* ── La pantalla del evento dentro del teléfono ────────────────────────────────────────────── */

const PantallaEvento: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const confirmado = frame >= CONFIRMADO;
	const tBarra = entra(frame, fps, EVENTO_FILAS + 20, 22);

	return (
		<AppDocente titulo="Evento de la Unión">
			<div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 11, opacity: entra(frame, fps, EVENTO_FILAS, 14) }}>
					<div style={{ width: 54, height: 58, borderRadius: 9, background: TINTA_AZUL, color: TARJETA, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
						<span style={{ fontSize: 9, letterSpacing: '0.14em', color: '#89B6DC', fontWeight: 500 }}>{EVENTO.mes}</span>
						<span style={{ fontFamily: SERIF, fontVariantNumeric: 'tabular-nums', fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{EVENTO.dia}</span>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						<span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{EVENTO.titulo}</span>
						<Num style={{ fontSize: 13, color: TINTA2 }}>{EVENTO.cuando}</Num>
					</div>
				</div>

				<div style={{ fontSize: 14, color: TINTA2, lineHeight: 1.55, opacity: entra(frame, fps, EVENTO_FILAS + 6, 14) }}>{EVENTO.cuerpo}</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: entra(frame, fps, EVENTO_FILAS + 12, 14) }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 9,
							background: confirmado ? VERDE : TINTA_AZUL,
							color: TARJETA,
							borderRadius: 9,
							padding: 16,
							fontSize: 15,
							fontWeight: 600,
							transform: `scale(${interpolate(frame - TOCA_CONFIRMA, [0, 4, 12], [1, 0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
						}}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
							<path d="M5 12.5 10 17.5 19 7" />
						</svg>
						{confirmado ? 'Asistencia confirmada' : 'Confirmo mi asistencia'}
					</div>
					{confirmado ? null : (
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${RAYA2}`, borderRadius: 9, padding: 15, fontSize: 14.5, fontWeight: 500, color: TINTA2 }}>
							No podré asistir
						</div>
					)}
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${RAYA}`, paddingTop: 16, opacity: entra(frame, fps, EVENTO_FILAS + 18, 14) }}>
					<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
						<span style={{ fontSize: 13, color: TINTA3 }}>Ya confirmaron</span>
						<Num style={{ fontSize: 14, fontWeight: 600 }}>
							{confirmado ? CONFIRMADOS.despues : CONFIRMADOS.antes} de {CONFIRMADOS.total}
						</Num>
					</div>
					<Barra pct={CONFIRMADOS.pct} t={tBarra} color={VERDE} alto={9} />
					<div style={{ fontSize: 12, color: TINTA3 }}>De tu colegio, 34 de 46 docentes.</div>
				</div>

				<Aviso fondo="#F7F1E6" t={entra(frame, fps, EVENTO_FILAS + 24, 14)}
					icono={
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OCRE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
							<rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" />
						</svg>
					}
				>
					<span style={{ fontSize: 12.5 }}>Ya está en tu calendario y en el del colegio.</span>
				</Aviso>
			</div>
		</AppDocente>
	);
};

/* ── La escena ─────────────────────────────────────────────────────────────────────────────── */

export const EscenaComunicados: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	/** Todo se va a la vez al final, con el marco recogiéndose el último. */
	const fuera = seVa(frame, 0, SALIDA, 0, 26);
	const tipoElegido = frame >= CLIC_TIPO;

	/* La cuenta de destinatarios sube al elegir el último rol. */
	const tCuenta = entra(frame, fps, CUENTA, 20);
	const cuantos = Math.round(DESTINATARIOS * Math.min(1, tCuenta));

	const rolOn = (i: number) => frame >= [CLIC_DOCENTES, CLIC_RECTORES, CLIC_COORDINADORES][i];

	return (
		<Lienzo conRotulo={conRotulo}>
			<Pantalla conRotulo={conRotulo}>
			<div style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})`, transformOrigin: 'center center' }}>
				<Marco
					activo="comunicados"
					overline="Unión Colombiana del Norte · Comunicación"
					titulo="Comunicados y eventos"
					sub="Lo que se publica aquí llega esta misma tarde al teléfono de cada docente de la red"
					desde={MARCO}
					acciones={<AccionesPorDefecto />}
					pie={[
						'El docente lo recibe en la misma app que ya usa para sus notas: no hay que instalar nada nuevo ni repartir otra contraseña.',
						`${DESTINATARIOS} destinatarios · 6 comunicados este trimestre`,
					]}
					encima={
						<>
							<MovilFlotante desde={MOVIL} sale={PORTAL_SUMA - 14} x={MOVIL_X} y={MOVIL_Y} escala={MOVIL_ESCALA}>
								<Reposo />
								{/*
								 * LA PANTALLA DEL EVENTO ENTRA DESLIZANDO POR ENCIMA DE LA LISTA, que se queda
								 * debajo: es cómo navega un teléfono, y dice que se puede volver. Un corte seco
								 * entre las dos se leería como dos capturas pegadas.
								 */}
								{frame >= EVENTO_ENTRA ? (
									<div
										style={{
											position: 'absolute',
											inset: 0,
											transform: `translateX(${interpolate(frame, [EVENTO_ENTRA, EVENTO_ENTRA + 14], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}%)`,
											boxShadow: '-16px 0 40px rgba(15,28,52,.18)',
										}}
									>
										<PantallaEvento frame={frame} fps={fps} />
									</div>
								) : null}
							</MovilFlotante>

							<AvisoQueSale
								titulo={EVENTO.titulo}
								cuerpo="Sábado 19 de septiembre, 8:00. Toca para confirmar tu asistencia."
								origen={AVISO_DENTRO}
								destino={AVISO_FUERA}
								cae={PUSH}
								sale={PUSH_SALE}
								plantado={PUSH_FUERA}
								vuelve={PUSH_VUELVE}
								dentro={PUSH_DENTRO}
							/>

							{/* El dedo toca el aviso donde está: grande y por delante del portal. */}
							<Toque
								puntos={[{ frame: DEDO, x: AVISO_FUERA.x + 300, y: AVISO_FUERA.y + 74 }]}
								toques={[TOCA_PUSH]}
								aparece={DEDO}
								sale={TOCA_PUSH + 10}
								tam={40}
							/>
							{/* Y después, el de confirmar, ya dentro de la app. */}
							<Toque
								puntos={[{ frame: DEDO_CONFIRMA, x: MOVIL_X + 212, y: MOVIL_Y + 330 }]}
								toques={[TOCA_CONFIRMA]}
								aparece={DEDO_CONFIRMA}
								sale={TOCA_CONFIRMA + 12}
								tam={38}
							/>
						</>
					}
				>
					<div style={{ position: 'relative', height: 620 }}>
						{/* ── El compositor ────────────────────────────────────────────────── */}
						<div
							style={{
								position: 'absolute',
								left: 0,
								top: 0,
								width: CARD,
								background: TARJETA,
								border: `1px solid ${RAYA}`,
								borderRadius: 6,
								padding: `0 ${PAD}px`,
								height: Y_BOTONES + H_BOTON + 18,
								boxSizing: 'border-box',
								opacity: entra(frame, fps, TARJETA_COMPOSITOR, 16),
								transform: `translateY(${interpolate(entra(frame, fps, TARJETA_COMPOSITOR, 16), [0, 1], [18, 0])}px)`,
							}}
						>
							<div style={{ position: 'absolute', left: PAD, top: Y_HEAD, display: 'flex', flexDirection: 'column', gap: 3 }}>
								<div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>Nuevo comunicado</div>
								<div style={{ fontSize: 12, color: TINTA3 }}>Se publica desde aquí y llega al teléfono de cada docente en menos de un minuto.</div>
							</div>

							{/* Qué se publica: comunicado, evento o urgente. */}
							<div style={{ position: 'absolute', left: PAD, top: Y_PILLS, display: 'flex', alignItems: 'center', gap: 9 }}>
								<Pildora icono={<IconoMega color={TINTA3} />}>Comunicado</Pildora>
								<Pildora on={tipoElegido} icono={<IconoCal color={tipoElegido ? TARJETA : TINTA3} />}>Evento con fecha</Pildora>
								<Pildora icono={<IconoRayo color={TINTA3} />}>Urgente</Pildora>
							</div>

							<div style={{ position: 'absolute', left: PAD, top: Y_TITULO, width: CARD - PAD * 2 }}>
								<Campo etiqueta="Título" t={entra(frame, fps, TITULO - 6, 12)}>
									{escrito(frame, EVENTO.titulo, TITULO, POR_TECLA)}
									{escribiendo(frame, EVENTO.titulo, TITULO, POR_TECLA) ? (
										<span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: AZUL }}>|</span>
									) : null}
								</Campo>
							</div>

							<div style={{ position: 'absolute', left: PAD, top: Y_FECHAS, width: CARD - PAD * 2, display: 'flex', gap: 20 }}>
								<Campo etiqueta="Cuándo" select t={entra(frame, fps, CUANDO, 12)}>{EVENTO.cuando}</Campo>
								<Campo etiqueta="Dónde" select t={entra(frame, fps, DONDE, 12)}>{EVENTO.donde}</Campo>
							</div>

							{/* ── A quién le llega ─────────────────────────────────────────── */}
							<div style={{ position: 'absolute', left: PAD, top: Y_DESTINO, opacity: entra(frame, fps, DESTINO_ROTULO, 12) }}>
								<Over>A quién le llega</Over>
							</div>
							<div style={{ position: 'absolute', left: PAD, top: Y_AMBITO, display: 'flex', alignItems: 'center', gap: 9, opacity: entra(frame, fps, DESTINO_ROTULO + 4, 12) }}>
								<Pildora on={frame >= CLIC_COLEGIOS}>Los 13 colegios</Pildora>
								<Pildora>Por campo</Pildora>
								<Pildora>Elegir colegios</Pildora>
							</div>
							<div style={{ position: 'absolute', left: PAD, top: Y_ROLES, display: 'flex', alignItems: 'center', gap: 9, opacity: entra(frame, fps, DESTINO_ROTULO + 8, 12) }}>
								{ROLES.map((r, i) => <Pildora key={r.nombre} on={rolOn(i)}>{r.nombre}</Pildora>)}
								<Pildora>Acudientes</Pildora>
							</div>
							<div style={{ position: 'absolute', left: PAD, top: Y_CUENTA, width: CARD - PAD * 2 }}>
								<Aviso
									t={tCuenta}
									icono={
										<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={AZUL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
											<path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3.2" />
											<path d="M17 11.5a3 3 0 0 0 0-6" /><path d="M21 20v-2a3.6 3.6 0 0 0-2.5-3.4" />
										</svg>
									}
								>
									Llega a <strong style={{ color: TINTA }}><Num>{cuantos}</Num> personas</strong>: 363 docentes, 13 rectores y 25 coordinadores, en los trece colegios.
								</Aviso>
							</div>

							{/* ── Cómo se envía ────────────────────────────────────────────── */}
							<div style={{ position: 'absolute', left: PAD, top: Y_OPCIONES, opacity: entra(frame, fps, OPCIONES_ENTRAN - 6, 12) }}>
								<Over>Cómo se envía</Over>
							</div>
							<div style={{ position: 'absolute', left: PAD, top: Y_FILAS_OP, width: CARD - PAD * 2 }}>
								{OPCIONES.map((o, i) => (
									<Opcion
										key={o.texto}
										texto={o.texto}
										sub={o.sub}
										t={entra(frame, fps, OPCIONES_ENTRAN + i * PASO_OPCION, 14)}
										on={entra(frame, fps, OPCIONES_ENTRAN + 6 + i * PASO_OPCION, 10)}
									/>
								))}
							</div>

							<div style={{ position: 'absolute', left: PAD, top: Y_BOTONES, display: 'flex', alignItems: 'center', gap: 12 }}>
								<Boton
									primario
									resalte={interpolate(frame - CLIC_PUBLICAR, [0, 5, 16], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
									icono={
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TARJETA} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
											<path d="M21 3 10.5 13.5" /><path d="M21 3 14.5 21l-4-8-8-4L21 3Z" />
										</svg>
									}
								>
									Publicar y notificar
								</Boton>
								<Boton>Programar</Boton>
							</div>
						</div>

						{/* ── La columna de la derecha: el calendario de la red ─────────────── */}
						<div style={{ position: 'absolute', left: DERECHA_X, top: 0, width: 300 }}>
							<Tarjeta titulo="Lo que viene" sub="El calendario de los trece colegios" t={entra(frame, fps, COLUMNA_DERECHA, 16)}>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
									{/*
									 * EL EVENTO RECIÉN PUBLICADO SE COLOCA EL PRIMERO Y EN VERDE. Es el remate
									 * del clip: lo que el docente tocó en su teléfono vuelve aquí, a la pantalla
									 * de quien lo escribió, sin cambiar de plano.
									 */}
									{frame >= PORTAL_SUMA ? (
										<Evento
											mes={EVENTO.mes}
											dia={EVENTO.dia}
											titulo={EVENTO.titulo}
											alcance="Los 13 colegios · docentes, rectores y coordinadores"
											pie={`${CONFIRMADOS.despues} de ${CONFIRMADOS.total} confirmados`}
											t={entra(frame, fps, PORTAL_SUMA, 16)}
											nuevo
										/>
									) : null}
									{PROXIMOS.map((e, i) => (
										<Evento key={e.titulo} {...e} t={llega(frame, fps, i, COLUMNA_DERECHA + 10, 7, 16).opacidad} />
									))}
								</div>
							</Tarjeta>
						</div>

						{/* El puntero del navegador: elige el tipo, los roles y publica. */}
						<Cursor
							color={AZUL}
							puntos={[
								{ frame: CURSOR_ENTRA, x: 470, y: 40 },
								{ frame: CLIC_TIPO, x: 246, y: Y_PILLS + 17 },
								{ frame: CLIC_COLEGIOS, x: 91, y: Y_AMBITO + 17 },
								{ frame: CLIC_DOCENTES, x: 72, y: Y_ROLES + 17 },
								{ frame: CLIC_RECTORES, x: 173, y: Y_ROLES + 17 },
								{ frame: CLIC_COORDINADORES, x: 290, y: Y_ROLES + 17 },
								{ frame: CURSOR_PUBLICAR, x: 126, y: Y_BOTONES + 21 },
								{ frame: CLIC_PUBLICAR, x: 126, y: Y_BOTONES + 21 },
							].map((p) => ({ ...p, x: p.x + ORIGEN_X - 40, y: p.y + TOP - 134 }))}
							clics={[CLIC_TIPO, CLIC_COLEGIOS, CLIC_DOCENTES, CLIC_RECTORES, CLIC_COORDINADORES, CLIC_PUBLICAR]}
							aparece={CURSOR_ENTRA}
							sale={CLIC_PUBLICAR + 8}
						/>
					</div>
				</Marco>
			</div>
			</Pantalla>

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: TITULO + 20, hasta: CLIC_COLEGIOS - 6, titulo: 'Se escribe una vez.', pie: 'Un evento de la Unión, con su fecha y su enlace.' },
						{ desde: CUENTA + 6, hasta: CLIC_PUBLICAR + 10, titulo: '401 personas, trece colegios.', pie: 'Docentes, rectores y coordinadores. El portal sabe cuántos hay detrás de cada casilla.' },
						{ desde: PUSH_FUERA + 4, hasta: DEDO_CONFIRMA - 8, titulo: 'Y ya está en su teléfono.', pie: 'Dentro de la misma app que usa para sus notas. Sin instalar nada, sin otra contraseña.' },
						{ desde: PORTAL_SUMA + 6, hasta: SALIDA, titulo: 'Lo que contesta, vuelve.', pie: 'Confirma desde el aviso y el portal lo cuenta. Un comunicado que no se puede medir no se ha enviado.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};

/** El teléfono antes de que llegue nada: la lista de la app, en reposo. */
const Reposo: React.FC = () => (
	<AppDocente titulo="Mis asignaturas" volver={false}>
		<div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.55 }}>
			{['9.º A · Matemáticas', '9.º B · Matemáticas', '10.º A · Física', '10.º B · Física', '11.º A · Física', '11.º B · Física', 'Dirección de grupo · 9.º A'].map((t) => (
				<div key={t} style={{ border: `1px solid ${RAYA}`, borderRadius: 10, padding: '16px 14px', fontSize: 15, background: TARJETA }}>{t}</div>
			))}
		</div>
	</AppDocente>
);

/* ── Los tres iconos de las píldoras de tipo ───────────────────────────────────────────────── */

const IconoMega: React.FC<{ color: string }> = ({ color }) => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 10.5v3a1 1 0 0 0 1 1h2.5l8 4.5v-14l-8 4.5H4a1 1 0 0 0-1 1Z" /><path d="M18 9.5a4 4 0 0 1 0 5" />
	</svg>
);
const IconoCal: React.FC<{ color: string }> = ({ color }) => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
		<rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" />
	</svg>
);
const IconoRayo: React.FC<{ color: string }> = ({ color }) => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
		<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
	</svg>
);
