import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { entra, escribiendo, escrito, seVa } from '../../comunes/movimiento';
import { ALTO_TELEFONO, ANCHO_TELEFONO, BarraDeEstado, Telefono } from '../../movil/Telefono';
import { Lienzo, Rotulo } from '../Lienzo';
import { Escudo } from '../Marco';
import { Over } from '../piezas';
import { AZUL, MONO, RAYA, RAYA2, SANS, SERIF, TARJETA, TINTA, TINTA2, TINTA3, VERDE } from '../tema';
import {
	ANCHO_COLEGIO, ANCHO_FICHA, Certificado, Colegio, Ficha, Flecha, HUECO, Insignia, LADO_INSIGNIA,
	QR_EN_CERT, Qr, Sello,
} from './figuras';
import { ALUMNA, CABECERA, CERTIFICADO as CERT, DESTINO, HISTORIAL, INTEGRACION, LECTOR, ORIGEN, SELLO, TITULOS, VIA } from './datos';
import {
	BARRIDO, BARRIDO_FIN, CABECERA as T_CABECERA, CERTIFICADO as T_CERT, COLEGIO_A, COLEGIO_B, DOCS,
	DUR_SALIDA, FICHA as T_FICHA, HAZ, IDA, IDA_FIN, LINEAS, MEDALLA, MOVIL, MYVC, PASO_DOC,
	PASO_SALIDA, PASO_VISTO, QR as T_QR, SALE_1, SALE_2, SALIDA, SUNPLUS, TITULO_1, TITULO_2,
	TITULO_3, VERIFICADO, VIA as T_VIA, VISTOS, VUELA_DESDE, VUELA_HASTA, VUELTA, VUELTA_FIN,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA RED CONECTADA — el clip del 6.7. Tres actos y un solo escenario.
 *
 * POR QUÉ ES UN DIAGRAMA Y NO UNA PANTALLA, está contado en `guion.ts`. Lo que hay que saber para
 * tocar este fichero es que **el escenario es un rectángulo de 1.480 × 660 con coordenadas propias**
 * --cabecera arriba, los 560 de abajo para los actos-- que después se agranda entero para llenar el
 * fotograma. Todo lo que se coloca aquí va en esas coordenadas, y por eso las posiciones son
 * números redondos que se pueden seguir a mano: la ficha vuela de 80 a 1.100 porque ahí están los
 * dos huecos, no porque quedara bien.
 *
 * EL ESCENARIO SE ENCOGE CUANDO HAY RÓTULO, igual que la pantalla del portal en `Lienzo.tsx` -- y
 * por la misma razón, que ya costó un render: el rótulo es parte del encuadre, no algo que se pega
 * encima al final.
 */

const ANCHO = 1480;
const ALTO_CABECERA = 100;
const ALTO_ACTO = 620;

/*
 * CUÁNTO SE AGRANDA EL ESCENARIO. **El número no se eligió a ojo: sale de una cuenta.** Las otras
 * seis pantallas del portal miden 1.440 de ancho y se agrandan 1,28, así que en el fotograma ocupan
 * 1.843 píxeles. Este diagrama mide 1.480, y con 1,2454 ocupa exactamente los mismos 1.843.
 *
 * Es lo mismo que protege `ucn/tema.ts` para los seis: montado detrás del clip de encuestas, si éste
 * saliera más pequeño el corte se leería como un alejamiento de cámara y no como un cambio de tema.
 */
const ESCALA = (1440 * 1.28) / ANCHO;
const CON_ROTULO = 0.88;

/* ── DÓNDE ESTÁ CADA COSA. En coordenadas del acto (1.480 × 560). ──────────────────────────── */

const A_X = 40;
const B_X = ANCHO - ANCHO_COLEGIO - A_X;
const COLEGIO_Y = 142;
/** El hueco de la ficha, en coordenadas del acto: es de donde sale y a donde llega. */
const FICHA_A = { x: A_X + HUECO.x + (HUECO.ancho - ANCHO_FICHA) / 2, y: COLEGIO_Y + HUECO.y + 21 };
const FICHA_B = { x: B_X + HUECO.x + (HUECO.ancho - ANCHO_FICHA) / 2, y: FICHA_A.y };
/** La vía pasa por el centro de los dos huecos: la ficha viaja por donde estaba dibujada la red. */
const VIA_Y = COLEGIO_Y + HUECO.y + HUECO.alto / 2;

const CERT_X = 280;
const CERT_Y = 50;
const MOVIL_X = 1000;
const MOVIL_Y = 56;
const ESCALA_MOVIL = 0.54;
/** El código dentro del papel, ya en coordenadas del acto: ahí apunta el teléfono. */
const QR_ACTO = { x: CERT_X + QR_EN_CERT.x, y: CERT_Y + QR_EN_CERT.y, tam: QR_EN_CERT.tam };
/** Por dónde sale el haz del teléfono. */
const OJO = { x: MOVIL_X, y: MOVIL_Y + (ALTO_TELEFONO * ESCALA_MOVIL) / 2 };

const INSIGNIA_Y = 189;
const MYVC_CX = 400;
const SUNPLUS_CX = 1080;
const IDA_Y = 250;
const VUELTA_Y = 338;

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DEL TELÉFONO DE QUIEN RECIBE EL CERTIFICADO.
 *
 * EL APARATO ES EL MISMO DE SIEMPRE (`src/movil/Telefono.tsx`), pero **lo de dentro no es la app**:
 * quien comprueba un certificado --una universidad, otro colegio, un empleador-- no tiene MyVC
 * instalado ni tiene por qué. Es la cámara de su teléfono, sin marca. Poner aquí la barra morada de
 * la aplicación diría que para verificar hay que instalarse algo, que es lo contrario de lo que un
 * código QR resuelve.
 */
const Lector: React.FC<{ barrido: number; hecho: number }> = ({ barrido, hecho }) => (
	<div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#101014', fontFamily: SANS, position: 'relative' }}>
		<BarraDeEstado sobre="#101014" />

		<div style={{ position: 'absolute', left: 90, top: 210, width: 240, height: 240 }}>
			<Qr t={1} tam={240} />
			{/* Las cuatro esquinas del visor. Son lo que dice «esto es una cámara apuntando». */}
			{[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([px, py, sx, sy], i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: px ? undefined : -14,
						right: px ? -14 : undefined,
						top: py ? undefined : -14,
						bottom: py ? -14 : undefined,
						width: 44,
						height: 44,
						borderTop: sy > 0 ? '5px solid rgba(255,255,255,.9)' : undefined,
						borderBottom: sy < 0 ? '5px solid rgba(255,255,255,.9)' : undefined,
						borderLeft: sx > 0 ? '5px solid rgba(255,255,255,.9)' : undefined,
						borderRight: sx < 0 ? '5px solid rgba(255,255,255,.9)' : undefined,
						borderRadius: 6,
					}}
				/>
			))}
			{/* El barrido: la línea que recorre el código mientras lo lee. */}
			<div
				style={{
					position: 'absolute',
					left: -10,
					right: -10,
					top: interpolate(barrido, [0, 1], [0, 240], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
					height: 3,
					background: '#7FD4B8',
					boxShadow: '0 0 22px 7px rgba(127,212,184,.55)',
					opacity: barrido > 0.001 && hecho < 0.5 ? 1 : 0,
				}}
			/>
		</div>

		<div style={{ position: 'absolute', left: 0, right: 0, top: 496, textAlign: 'center', fontSize: 24, color: 'rgba(255,255,255,.86)', opacity: 1 - hecho }}>
			{LECTOR.buscando}
		</div>

		{/*
		 * EL RESULTADO SUBE DESDE ABAJO Y NO TAPA EL CÓDIGO. Que las dos cosas se vean a la vez --el
		 * código arriba y el veredicto abajo-- es lo que hace que se lea «esto salió de leer eso».
		 */}
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: 380,
				background: TARJETA,
				borderRadius: '28px 28px 0 0',
				padding: '30px 30px 0',
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
				transform: `translateY(${interpolate(hecho, [0, 1], [380, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
			}}
		>
			<svg width="66" height="66" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="11" fill={VERDE} />
				<path d="M7 12.4 10.6 16 17 8.8" fill="none" stroke={TARJETA} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
			<div style={{ fontFamily: SERIF, fontSize: 31, fontWeight: 600, color: TINTA, textAlign: 'center', lineHeight: 1.15 }}>{LECTOR.hecho}</div>
			<div style={{ fontSize: 17, color: TINTA2, textAlign: 'center', lineHeight: 1.35 }}>{LECTOR.sub}</div>
			<div style={{ fontFamily: MONO, fontSize: 16, color: TINTA3, marginTop: 2 }}>{CERT.codigo}</div>
		</div>
	</div>
);

/** El titular de cada acto: se escribe, como los de las pantallas del portal, y se va con su acto. */
const Titulo: React.FC<{ texto: string; desde: number; hasta: number }> = ({ texto, desde, hasta }) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [hasta, hasta + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (frame < desde || o <= 0.001) { return null; }

	return (
		<div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 500, letterSpacing: '-0.02em', color: TINTA, lineHeight: 1, opacity: o, whiteSpace: 'nowrap' }}>
			{escrito(frame, texto, desde, 1.6)}
			{escribiendo(frame, texto, desde, 1.6) ? <span style={{ opacity: frame % 16 < 8 ? 1 : 0, fontWeight: 300, color: AZUL }}>|</span> : null}
		</div>
	);
};

export const EscenaRed: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	/* ── 1 · EL TRASLADO ───────────────────────────────────────────────────────────────────── */
	const tA = entra(frame, fps, COLEGIO_A, 18);
	const tB = entra(frame, fps, COLEGIO_B, 18);
	const tVia = interpolate(frame, [T_VIA, T_VIA + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
	const tFicha = entra(frame, fps, T_FICHA, 18);

	/*
	 * EL VUELO. `paso` va de 0 a 1 con una curva suave por los dos extremos --arranca despacio y
	 * frena al llegar--, y el arco lo pone un seno: la ficha se levanta 140 y vuelve a posarse.
	 */
	const paso = interpolate(frame, [VUELA_DESDE, VUELA_HASTA], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
	const vuelo = Math.sin(Math.PI * paso);
	const fichaX = FICHA_A.x + (FICHA_B.x - FICHA_A.x) * paso;
	const fichaY = FICHA_A.y + (FICHA_B.y - FICHA_A.y) * paso - vuelo * 140;

	const fuera1 = (i: number) => seVa(frame, i, SALE_1, 6, 22);

	/* ── 2 · EL CERTIFICADO ────────────────────────────────────────────────────────────────── */
	const tCert = entra(frame, fps, T_CERT, 18);
	const tQr = interpolate(frame, [T_QR, T_QR + 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const tMovil = interpolate(frame, [MOVIL, MOVIL + 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
	const tHaz = interpolate(frame, [HAZ, HAZ + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const barrido = interpolate(frame, [BARRIDO, BARRIDO_FIN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const hecho = entra(frame, fps, VERIFICADO, 16);
	const tSello = entra(frame, fps, MEDALLA, 20);
	const tVistoSello = interpolate(frame, [MEDALLA + 8, MEDALLA + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const fuera2 = (i: number) => seVa(frame, i, SALE_2, 7, 22);

	/* ── 3 · LA INTEGRACIÓN ────────────────────────────────────────────────────────────────── */
	const tMyvc = entra(frame, fps, MYVC, 18);
	const tSun = entra(frame, fps, SUNPLUS, 18);
	const tIda = interpolate(frame, [IDA, IDA_FIN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
	const tVuelta = interpolate(frame, [VUELTA, VUELTA_FIN], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
	/* El aro de acuse: sale cuando la punta llega, y se apaga solo. */
	const golpeSun = interpolate(frame, [IDA_FIN - 2, IDA_FIN + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const golpeMyvc = interpolate(frame, [VUELTA_FIN - 2, VUELTA_FIN + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const salida = (i: number) => seVa(frame, i, SALIDA, PASO_SALIDA, DUR_SALIDA);

	const escala = ESCALA * (conRotulo ? CON_ROTULO : 1);

	return (
		<Lienzo conRotulo={conRotulo}>
			<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: conRotulo ? 'flex-start' : 'center', justifyContent: 'center', paddingTop: conRotulo ? 40 : 0 }}>
				<div style={{ width: ANCHO, height: ALTO_CABECERA + ALTO_ACTO, transform: `scale(${escala})`, transformOrigin: conRotulo ? 'top center' : 'center center', position: 'relative' }}>

					{/* ── LA CABECERA. Está los veintiséis segundos y cierra el clip. ───────── */}
					<div
						style={{
							height: ALTO_CABECERA,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 12,
							opacity: entra(frame, fps, T_CABECERA, 16) * (1 - salida(4)),
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
							<Escudo tam={19} />
							<Over>{CABECERA}</Over>
						</div>
						<Titulo texto={TITULOS[0]} desde={TITULO_1} hasta={SALE_1} />
						<Titulo texto={TITULOS[1]} desde={TITULO_2} hasta={SALE_2} />
						<Titulo texto={TITULOS[2]} desde={TITULO_3} hasta={SALIDA + PASO_SALIDA * 3} />
					</div>

					<div style={{ position: 'absolute', left: 0, top: ALTO_CABECERA, width: ANCHO, height: ALTO_ACTO }}>

						{/* ═══ ACTO 1 · EL TRASLADO ═══════════════════════════════════════════ */}
						{frame < SALE_1 + 40 ? (
							<>
								{/*
								 * LA VÍA SE DIBUJA ANTES DE QUE NADIE LA RECORRA, y crece desde el colegio de
								 * origen hacia el de destino. Primero existe la red, después pasa algo por ella.
								 */}
								<div style={{ position: 'absolute', left: A_X + ANCHO_COLEGIO, top: VIA_Y - 1, width: (B_X - A_X - ANCHO_COLEGIO) * tVia, height: 2, background: `repeating-linear-gradient(90deg, ${RAYA2} 0 9px, transparent 9px 18px)`, opacity: 1 - fuera1(1) }} />
								<div
									style={{
										position: 'absolute',
										left: ANCHO / 2 - 105,
										top: VIA_Y - 18,
										width: 210,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 8,
										height: 36,
										borderRadius: 18,
										background: TARJETA,
										border: `1px solid ${RAYA}`,
										fontSize: 13,
										color: TINTA2,
										boxSizing: 'border-box',
										opacity: interpolate(tVia, [0.6, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - fuera1(1)),
									}}
								>
									<Escudo tam={16} />
									{VIA}
								</div>

								<div style={{ position: 'absolute', left: A_X, top: COLEGIO_Y, opacity: 1 - fuera1(0), transform: `translateY(${fuera1(0) * -26}px)` }}>
									<Colegio
										papel={ORIGEN.papel}
										nombre={ORIGEN.nombre}
										color={AZUL}
										t={tA}
										nota="historial enviado"
										tNota={interpolate(frame, [VUELA_DESDE + 30, VUELA_DESDE + 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
									/>
								</div>

								<div style={{ position: 'absolute', left: B_X, top: COLEGIO_Y, opacity: 1 - fuera1(2), transform: `translateY(${fuera1(2) * -26}px)` }}>
									<Colegio papel={DESTINO.papel} nombre={DESTINO.nombre} color={VERDE} t={tB} />
								</div>

								{/* La ficha va suelta y por encima de los dos colegios: es la que viaja. */}
								<div
									style={{
										position: 'absolute',
										left: fichaX,
										top: fichaY,
										zIndex: 5,
										opacity: 1 - fuera1(2),
										transform: `translateY(${fuera1(2) * -26}px) scale(${1 + vuelo * 0.05})`,
										transformOrigin: 'center center',
									}}
								>
									<Ficha
										nombre={ALUMNA.nombre}
										grupo={ALUMNA.grupo}
										avatar={<Avatar tipo="mujer" variante={2} tam={42} />}
										t={tFicha}
										tDoc={(i) => entra(frame, fps, DOCS + i * PASO_DOC, 14)}
										visto={(i) => interpolate(frame, [VISTOS + i * PASO_VISTO, VISTOS + i * PASO_VISTO + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
										docs={HISTORIAL}
										vuelo={vuelo}
									/>
								</div>
							</>
						) : null}

						{/* ═══ ACTO 2 · EL CERTIFICADO CON QR ═════════════════════════════════ */}
						{frame >= T_CERT - 10 && frame < SALE_2 + 40 ? (
							<>
								<div style={{ position: 'absolute', left: CERT_X, top: CERT_Y, opacity: 1 - fuera2(1), transform: `translateY(${fuera2(1) * -22}px)` }}>
									<Certificado
										emisor={CERT.emisor}
										titulo={CERT.titulo}
										lineas={CERT.lineas}
										codigo={CERT.codigo}
										pie={CERT.pie}
										t={tCert}
										tLinea={(i) => entra(frame, fps, LINEAS + i * 8, 14)}
										tQr={tQr}
									/>
								</div>

								{/*
								 * EL HAZ Y EL BARRIDO. El haz es lo que ata el teléfono al papel --sin él son dos
								 * objetos sueltos en la misma pantalla-- y el barrido es lo que dice que está
								 * leyendo ahora y no que ya lo sabía.
								 */}
								<svg width={ANCHO} height={ALTO_ACTO} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
									<g opacity={tHaz * (1 - Math.max(hecho, fuera2(1)))}>
										<path
											d={`M${OJO.x} ${OJO.y - 16} L${QR_ACTO.x + QR_ACTO.tam} ${QR_ACTO.y} L${QR_ACTO.x + QR_ACTO.tam} ${QR_ACTO.y + QR_ACTO.tam} L${OJO.x} ${OJO.y + 16} Z`}
											fill={AZUL}
											opacity={0.10}
										/>
										<path d={`M${OJO.x} ${OJO.y - 16} L${QR_ACTO.x + QR_ACTO.tam} ${QR_ACTO.y}`} stroke={AZUL} strokeWidth="1.4" opacity={0.4} fill="none" />
										<path d={`M${OJO.x} ${OJO.y + 16} L${QR_ACTO.x + QR_ACTO.tam} ${QR_ACTO.y + QR_ACTO.tam}`} stroke={AZUL} strokeWidth="1.4" opacity={0.4} fill="none" />
									</g>
									{/* La misma línea verde que recorre el código dentro del teléfono, sobre el papel. */}
									{barrido > 0.001 && hecho < 0.5 ? (
										<g opacity={(1 - hecho) * (1 - fuera2(1))}>
											<rect
												x={QR_ACTO.x - 6}
												y={QR_ACTO.y + barrido * QR_ACTO.tam}
												width={QR_ACTO.tam + 12}
												height={2.5}
												fill="#12876B"
												opacity={0.85}
											/>
										</g>
									) : null}
								</svg>

								<div
									style={{
										position: 'absolute',
										left: MOVIL_X,
										top: MOVIL_Y,
										width: ANCHO_TELEFONO * ESCALA_MOVIL,
										height: ALTO_TELEFONO * ESCALA_MOVIL,
										transform: `scale(${ESCALA_MOVIL}) translateY(${interpolate(tMovil, [0, 1], [120, 0]) + fuera2(2) * 90}px)`,
										transformOrigin: 'top left',
										opacity: (1 - fuera2(2)) * (tMovil > 0.001 ? 1 : 0),
										filter: 'drop-shadow(0 26px 60px rgba(30,29,25,.30))',
									}}
								>
									<Telefono>
										<Lector barrido={barrido} hecho={hecho} />
									</Telefono>
								</div>
							</>
						) : null}

						{/* ═══ ACTO 3 · MyVC Y SUNPLUS ════════════════════════════════════════ */}
						{frame >= MYVC - 10 ? (
							<>
								<div style={{ position: 'absolute', left: MYVC_CX - LADO_INSIGNIA / 2, top: INSIGNIA_Y, opacity: 1 - salida(3) }}>
									<Insignia texto={INTEGRACION.myvc} pie={INTEGRACION.myvcPie} t={tMyvc} golpe={golpeMyvc * (1 - golpeMyvc) * 2.6} propia />
								</div>
								<div style={{ position: 'absolute', left: SUNPLUS_CX - LADO_INSIGNIA / 2, top: INSIGNIA_Y, opacity: 1 - salida(2) }}>
									<Insignia texto={INTEGRACION.otro} pie={INTEGRACION.otroPie} t={tSun} golpe={golpeSun * (1 - golpeSun) * 2.6} />
								</div>

								<svg width={ANCHO} height={ALTO_ACTO} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
									<g opacity={1 - salida(1)}>
										<Flecha
											desde={{ x: MYVC_CX + LADO_INSIGNIA / 2 + 30, y: IDA_Y }}
											control={{ x: (MYVC_CX + SUNPLUS_CX) / 2, y: IDA_Y - 62 }}
											hasta={{ x: SUNPLUS_CX - LADO_INSIGNIA / 2 - 30, y: IDA_Y }}
											t={tIda}
											color={AZUL}
											etiqueta={INTEGRACION.ida}
											desvioEtiqueta={-18}
										/>
									</g>
									<g opacity={1 - salida(0)}>
										<Flecha
											desde={{ x: SUNPLUS_CX - LADO_INSIGNIA / 2 - 30, y: VUELTA_Y }}
											control={{ x: (MYVC_CX + SUNPLUS_CX) / 2, y: VUELTA_Y + 62 }}
											hasta={{ x: MYVC_CX + LADO_INSIGNIA / 2 + 30, y: VUELTA_Y }}
											t={tVuelta}
											color={VERDE}
											etiqueta={INTEGRACION.vuelta}
											desvioEtiqueta={28}
										/>
									</g>
								</svg>
							</>
						) : null}
					</div>
				</div>
			</div>

			{/*
			 * ═══ EL SELLO, POR DELANTE DE TODO ══════════════════════════════════════════════
			 *
			 * VA FUERA DEL ESCENARIO --a tamaño de fotograma, no de diagrama-- y con un velo de papel
			 * por debajo. Es el único momento del clip en que algo tapa lo demás, y es a propósito:
			 * el certificado y el teléfono ya contaron su parte, y lo que tiene que quedarse en la
			 * cabeza de quien mira son dos palabras.
			 */}
			{frame >= MEDALLA - 6 && frame < SALE_2 + 30 ? (
				<div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: 1 - fuera2(0) }}>
					<div style={{ position: 'absolute', inset: 0, background: 'rgba(247,242,232,.80)', opacity: interpolate(tSello, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }) }} />
					<div style={{ position: 'relative', transform: `scale(${interpolate(tSello, [0, 1], [1.05, 1.45])})`, opacity: interpolate(tSello, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) }}>
						<Sello t={tSello} tVisto={tVistoSello} />
					</div>
					<div
						style={{
							position: 'relative',
							fontFamily: SERIF,
							fontSize: 58,
							fontWeight: 500,
							letterSpacing: '-0.02em',
							color: TINTA,
							marginTop: 78,
							opacity: interpolate(tSello, [0.45, 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
							transform: `translateY(${interpolate(tSello, [0.45, 1], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
						}}
					>
						{SELLO}
					</div>
				</div>
			) : null}

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: VUELA_DESDE + 18, hasta: SALE_1 - 6, titulo: 'Cambia de colegio con su historial.', pie: 'Sus notas, su convivencia y sus certificados llegan con ella. Sin sobres y sin volver a teclear nada.' },
						{ desde: BARRIDO + 10, hasta: SALE_2 - 6, titulo: 'Certificados con código QR.', pie: 'Quien lo recibe comprueba en un segundo que es auténtico.' },
						{ desde: VUELTA_FIN - 10, hasta: SALIDA, titulo: 'Se integra con lo que ya usan.', pie: 'SunPlus y los que hagan falta: el portal se adapta a lo que la Unión pida.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
