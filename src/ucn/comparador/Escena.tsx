import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, llega, seVa } from '../../comunes/movimiento';
import { Lienzo, Pantalla, Rotulo } from '../Lienzo';
import { AccionesPorDefecto, Marco } from '../Marco';
import { tSerie } from '../graficos';
import { Aviso, Num, Tarjeta } from '../piezas';
import { AZUL, GRIS, MONO, NARANJA, RAYA, RAYA2, TARJETA, TINTA, TINTA2, TINTA3, VERDE } from '../tema';
import { INDICADORES, NIVELES } from './datos';
import { CARD, CARD_NIVELES, GRISES, MARCO, MIO, NIVELES_ENTRAN, PASO_FILA, SALIDA, SELECTOR } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * COMPARADOR: TRECE COLEGIOS, DOCE SIN NOMBRE.
 *
 * EL ORDEN DE ENTRADA ES EL ARGUMENTO. Primero caen los doce puntos grises --y se ve que son
 * indistinguibles, porque **se dibujan ordenados por valor y no por colegio**: ni siquiera contando
 * de izquierda a derecha se puede deducir cuál es cuál--. Sólo después entra el punto de color, que
 * es el único con número encima.
 *
 * Si entrara primero el de color, la pantalla diría «mira qué bien vas». Entrando el último dice
 * «así está la red, y aquí estás tú», que es otra cosa y es la que se puede enseñar a trece rectores
 * a la vez.
 */

const ANCHO = 720;
const IZQ = 200;
const UTIL = 400;
const FILA = 58;

const Enjambre: React.FC<{ frame: number }> = ({ frame }) => (
	<svg width="100%" viewBox={`0 0 ${ANCHO} ${INDICADORES.length * FILA + 34}`} fill="none" style={{ display: 'block' }}>
		{INDICADORES.map((ind, i) => {
			const y = 26 + i * FILA;
			const lo = Math.min(...ind.valores);
			const hi = Math.max(...ind.valores);
			const px = (v: number) => IZQ + ((v - lo) / (hi - lo)) * UTIL;
			const mediana = [...ind.valores].sort((a, b) => a - b)[6];
			const color = ind.bueno ? VERDE : NARANJA;

			const tGris = tSerie(frame, GRISES, i, PASO_FILA, 18);
			const tMio = tSerie(frame, MIO, i, PASO_FILA, 16);

			return (
				<g key={ind.nombre}>
					<text x={IZQ - 10} y={y + 4} textAnchor="end" fontSize="12.5" fill={TINTA} opacity={tGris}>{ind.nombre}</text>
					<line x1={IZQ} y1={y} x2={IZQ + UTIL} y2={y} stroke={RAYA} strokeWidth="1.5" opacity={tGris} />
					<line x1={px(mediana)} y1={y - 13} x2={px(mediana)} y2={y + 13} stroke={TINTA2} strokeWidth="1.2" strokeDasharray="3 2" opacity={tGris} />

					{/* Los doce, sin etiqueta y ordenados por valor: no se pueden identificar. */}
					{ind.valores.slice(1).map((v, j) => (
						<circle
							key={j}
							cx={px(v)}
							cy={y}
							r={5 * tGris}
							fill={GRIS}
							stroke={TARJETA}
							strokeWidth="1.6"
							opacity={tGris}
						/>
					))}

					{/* El tuyo. Entra el último, más grande y con su cifra encima. */}
					<circle cx={px(ind.valores[0])} cy={y} r={7.5 * tMio} fill={color} stroke={TARJETA} strokeWidth="2.4" opacity={tMio} />
					<text x={px(ind.valores[0])} y={y - 15} textAnchor="middle" fontFamily={MONO} fontSize="11.5" fontWeight="600" fill={color} opacity={tMio}>{ind.mio}</text>
					<text x={IZQ + UTIL + 22} y={y + 4} fontFamily={MONO} fontSize="12.5" fontWeight="600" fill={color} opacity={tMio}>{ind.rango}</text>

					{i === 0 ? (
						<text x={px(mediana)} y={y - 26} textAnchor="middle" fontSize="10.5" fill={TINTA2} fontWeight="600" opacity={tGris}>mediana de la red</text>
					) : null}
				</g>
			);
		})}
		<text x={IZQ} y={INDICADORES.length * FILA + 22} fontSize="11" fill={TINTA3} opacity={tSerie(frame, MIO, INDICADORES.length, PASO_FILA, 20)}>
			Cada punto gris es uno de los otros doce colegios. Nunca se dice cuál.
		</text>
	</svg>
);

export const EscenaComparador: React.FC<{ conRotulo: boolean }> = ({ conRotulo }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const fuera = seVa(frame, 0, SALIDA, 0, 26);

	return (
		<Lienzo conRotulo={conRotulo}>
			<Pantalla conRotulo={conRotulo}>
			<div style={{ opacity: 1 - fuera, transform: `scale(${1 - fuera * 0.02})` }}>
				<Marco
					activo="comparador"
					overline="Unión Colombiana del Norte · Departamento de Educación"
					titulo="Comparador"
					sub="Cada colegio se ve contra la red entera sin ver el nombre de ningún otro"
					desde={MARCO}
					acciones={<AccionesPorDefecto />}
					pie={[
						'Los grises no se pueden identificar: se dibujan ordenados por valor, no por colegio, y sin etiqueta.',
						'13 colegios · datos del 3 de septiembre',
					]}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
						{/* Quién está mirando. Sin esto, el punto de color no es de nadie. */}
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 20,
								background: '#F2ECE0',
								border: `1px solid ${RAYA2}`,
								borderRadius: 6,
								padding: '12px 18px',
								opacity: entra(frame, fps, SELECTOR, 16),
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={TINTA2} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="3" /><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
								</svg>
								<span style={{ fontSize: 13, color: TINTA2 }}>Viendo el comparador como</span>
								<span style={{ fontSize: 13.5, fontWeight: 600 }}>Colegio Adventista Simón Bolívar</span>
								<span style={{ color: TINTA3 }}>▾</span>
							</div>
							<Num style={{ fontSize: 11.5, color: TINTA3 }}>Cambiar de colegio sólo puede la Unión</Num>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 342px', gap: 22, alignItems: 'start' }}>
							<Tarjeta
								titulo="Tu colegio entre los trece"
								sub="Seis indicadores · el punto de color eres tú, los grises son los demás"
								t={entra(frame, fps, CARD, 16)}
							>
								<Enjambre frame={frame} />
							</Tarjeta>

							<Tarjeta titulo="Quién ve qué" sub="Tres niveles, y por eso funciona" t={entra(frame, fps, CARD_NIVELES, 16)}>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
									{NIVELES.map((n, i) => {
										const t = llega(frame, fps, i, NIVELES_ENTRAN, 10, 16);
										return (
											<div key={n.titulo} style={{ display: 'flex', gap: 11, paddingBottom: 10, borderBottom: `1px solid ${RAYA}`, opacity: t.opacidad, transform: `translateY(${t.y * 0.5}px)` }}>
												<span style={{ width: 22, height: 22, borderRadius: '50%', background: AZUL, color: TARJETA, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0, fontFamily: MONO }}>{i + 1}</span>
												<div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
													<div style={{ fontSize: 12.5, fontWeight: 600 }}>{n.titulo}</div>
													<div style={{ fontSize: 11.5, color: TINTA2, lineHeight: 1.45 }}>{n.texto}</div>
												</div>
											</div>
										);
									})}
									<Aviso t={entra(frame, fps, NIVELES_ENTRAN + 34, 16)}>
										Un comparador con nombres se convierte en una lista de agravios y deja de abrirse a la semana. Éste se sigue abriendo.
									</Aviso>
								</div>
							</Tarjeta>
						</div>
					</div>
				</Marco>
			</div>
			</Pantalla>

			{conRotulo ? (
				<Rotulo
					frases={[
						{ desde: GRISES + 40, hasta: MIO + 40, titulo: 'Los otros doce, en gris.', pie: 'Ordenados por valor y sin etiqueta: no se puede saber cuál es cuál.' },
						{ desde: MIO + 60, hasta: NIVELES_ENTRAN + 14, titulo: 'Y tú, en color.', pie: 'Primero en cuatro indicadores. Último en dos, y también se enseñan.' },
						{ desde: NIVELES_ENTRAN + 20, hasta: SALIDA, titulo: 'La Unión ve los nombres. Un colegio, no.', pie: 'Por eso el rector la abre la semana siguiente.' },
					]}
				/>
			) : null}
		</Lienzo>
	);
};
