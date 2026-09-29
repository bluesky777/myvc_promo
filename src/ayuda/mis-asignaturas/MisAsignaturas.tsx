import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { escribiendo, escrito, estiloDeSalida, llega, seVa } from '../../comunes/movimiento';
import { MEDIDAS } from '../medidas';
import { Migas } from '../moverse/comun';
import { PALETA_CLARA } from '../BarraDeHoy';
import {
	ANCHO, BOTONES, CUERPO, FILAS, FilaAsignatura, MA, MIGAS_MIS_ASIGNATURAS, RENGLON_DEL_RESUMEN, TITULARIA, geometriaDeLaFila, geometriaDeTitularia,
	incompleta, piezasColocadas,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS», la de hoy. Va dentro de la cáscara, en el hueco del contenido. Las medidas y
 * el porqué de cada diferencia con el dibujo viejo están en `datos.ts`.
 */

const P = PALETA_CLARA;
/** `--paleta-peligro` y los ámbar de `--paleta-aviso-*`. */
const PELIGRO = '#ff4d4f';
const AVISO_FONDO = '#fff7e6';
const AVISO_TINTA = '#ad4e00';

export const MisAsignaturas: React.FC<{
	/** Fotograma local en que empieza a montarse. */
	desde?: number;
	/** Cuándo se va (local), o nunca. */
	salidaEn?: number;
	filas?: FilaAsignatura[];
	/** «4 asignaturas en el año en curso · periodo 2: 0 de 4 cerradas». */
	subtitulo?: string;
	/** El botón que el ratón tiene encima. */
	senalada?: { fila: number; boton: number } | null;
	/** Sin el rastro, para los vídeos que no lo cuentan (lo lleva igual: la aplicación lo pinta). */
	senaladaMiga?: number | null;
	/** Sin el botón «Cerrar»: en un año ya cerrado no sale. */
	sinCerrar?: boolean;
	/** La fila entera que el ratón tiene encima (el anillo azul), o `null`. */
	filaSenalada?: number | null;
	/** El botón «Comportamiento» de «Grupos titularía», señalado. */
	titulariaSenalada?: boolean;
	/**
	 * El grupo ya tiene notas de comportamiento en el periodo (`con_notas`): la aplicación no pinta
	 * entonces «Sin notas de comportamiento…». Lo pide el vídeo de comportamiento, que las enseña.
	 */
	titulariaConNotas?: boolean;
}> = ({ desde = 0, salidaEn = 1e9, filas = FILAS, subtitulo, senalada = null, senaladaMiga = null, sinCerrar = false, filaSenalada = null, titulariaSenalada = false, titulariaConNotas = false }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titulo = 'Mis asignaturas';
	const cursor = escribiendo(frame, titulo, desde + 4, 2) && frame % 20 < 12;
	const fueraTitulo = seVa(frame, 0, salidaEn, 4);
	const sub = subtitulo ?? `${filas.length} asignaturas en el año en curso`;
	const tit = geometriaDeTitularia(0, 0, filas);

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: MEDIDAS.alto - MEDIDAS.barra, color: P.texto }}>
			<div style={{ position: 'absolute', left: 0, top: MA.arriba, width: ANCHO }}>
				<Migas migas={MIGAS_MIS_ASIGNATURAS} izquierda={MA.lados} derecha={MA.lados} colores={P} senalada={senaladaMiga} />
			</div>

			<div style={{ position: 'absolute', left: MA.lados, top: MA.arriba + 40, opacity: 1 - fueraTitulo, transform: `translateY(${-fueraTitulo * 20}px)` }}>
				<div style={{ height: MA.titulo, display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, whiteSpace: 'pre' }}>
					{escrito(frame, titulo, desde + 4, 2)}
					<span style={{ opacity: cursor ? 1 : 0 }}>|</span>
				</div>
				<div style={{ height: MA.subtitulo, display: 'flex', alignItems: 'center', fontSize: 17, color: '#595959', opacity: frame >= desde + 30 ? 1 : 0 }}>
					{sub}
				</div>
			</div>

			{filas.map((f, i) => {
				const g = geometriaDeLaFila(i, 0, 0, filas);
				const l = llega(frame, fps, i, desde + 18, 6);
				const fuera = estiloDeSalida(seVa(frame, i + 1, salidaEn, 4));
				const mala = incompleta(f);

				return (
					<div
						key={`${f.materia}-${f.grupo}`}
						style={{
							position: 'absolute',
							left: g.fila.x,
							top: g.fila.y,
							width: g.fila.ancho,
							height: g.fila.alto,
							boxSizing: 'border-box',
							border: `1px solid #d9d9d9`,
							borderRadius: 8,
							background: P.superficie,
							overflow: 'hidden',
							boxShadow: filaSenalada === i ? `0 0 0 2px ${P.acento}55` : undefined,
							opacity: l.opacidad * fuera.opacidad,
							transform: `translate(${l.x + fuera.x}px, ${l.y}px) scale(${fuera.escala})`,
						}}
					>
						{/* LA FRANJA DEL GRUPO, con el marco rojo por dentro si la planeación no cuadra. */}
						<div
							style={{
								position: 'absolute',
								left: 0,
								top: 0,
								width: MA.franja,
								height: '100%',
								background: f.color,
								color: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 24,
								fontWeight: 600,
								boxShadow: mala ? `inset 0 0 0 4px ${PELIGRO}` : 'none',
							}}
						>
							{f.sigla}
						</div>

						<div style={{ position: 'absolute', left: CUERPO.x, top: 12, fontSize: 20, fontWeight: 600 }}>{f.materia}</div>

						<div style={{ position: 'absolute', left: CUERPO.x, top: 46, width: CUERPO.ancho, whiteSpace: 'nowrap' }}>
							{piezasColocadas(f).map((p) => (
								<span
									key={p.texto}
									style={{
										position: 'absolute',
										left: p.x,
										top: p.linea * RENGLON_DEL_RESUMEN,
										width: p.ancho,
										height: 26,
										boxSizing: 'border-box',
										display: 'inline-flex',
										alignItems: 'center',
										gap: 6,
										padding: p.aviso ? '0 9px' : 0,
										borderRadius: 6,
										background: p.aviso ? AVISO_FONDO : 'transparent',
										color: p.aviso ? AVISO_TINTA : p.grupo ? P.texto : '#595959',
										fontSize: p.aviso ? 15 : 16,
										fontWeight: p.grupo ? 600 : 400,
									}}
								>
									{p.grupo && <IconoEquipo />}
									{p.icono === 'fall' && <IconoBaja />}
									{p.texto}
								</span>
							))}
						</div>

						{BOTONES.map((b, bi) => {
							if (sinCerrar && b.texto === 'Cerrar') { return null; }
							const r = g.botones[bi];
							const encima = senalada?.fila === i && senalada.boton === bi;
							return (
								<div
									key={b.texto}
									style={{
										position: 'absolute',
										left: r.x - g.fila.x,
										top: r.y - g.fila.y,
										width: r.ancho,
										height: r.alto,
										boxSizing: 'border-box',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 7,
										borderRadius: 6,
										border: `1px solid ${b.primario ? P.acento : encima ? P.acento : '#d9d9d9'}`,
										background: b.primario ? (encima ? '#4096ff' : P.acento) : encima ? '#f0f7ff' : '#fafafa',
										color: b.primario ? '#fff' : encima ? P.acento : '#595959',
										fontSize: 15,
										fontWeight: 500,
									}}
								>
									<IconoBoton cual={bi} color={b.primario ? '#fff' : encima ? P.acento : '#595959'} />
									{b.texto}
								</div>
							);
						})}
					</div>
				);
			})}

			{/* «Grupos titularía»: el docente es titular de 9°B. */}
			<div style={{ position: 'absolute', left: tit.seccion.x, top: tit.seccion.y, opacity: llega(frame, fps, filas.length, desde + 18, 6).opacidad * (1 - seVa(frame, filas.length + 1, salidaEn, 4)) }}>
				<div style={{ height: TITULARIA.rotulo, display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 600 }}>Grupos titularía</div>
				<div
					style={{
						position: 'relative',
						width: TITULARIA.ancho,
						height: TITULARIA.fila,
						boxSizing: 'border-box',
						border: '1px solid #d9d9d9',
						borderRadius: 8,
						background: P.superficie,
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						boxShadow: titulariaSenalada ? `0 0 0 2px ${P.acento}55` : undefined,
					}}
				>
					<div style={{ width: MA.franja, height: '100%', background: FILAS[1].color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600 }}>
						{FILAS[1].sigla}
					</div>
					<div style={{ marginLeft: 16, flex: 1 }}>
						<div style={{ fontSize: 18, fontWeight: 600 }}>Noveno B</div>
						{!titulariaConNotas && <div style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>Sin notas de comportamiento en este periodo</div>}
					</div>
					<div
						style={{
							position: 'absolute',
							left: tit.boton.x - tit.fila.x,
							top: tit.boton.y - tit.fila.y - 1,
							width: tit.boton.ancho,
							height: tit.boton.alto,
							borderRadius: 6,
							background: titulariaSenalada ? '#4096ff' : P.acento,
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 15,
						}}
					>
						Comportamiento
					</div>
				</div>
			</div>
		</div>
	);
};

const trazo = (color: string) => ({ fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

const IconoEquipo: React.FC = () => (
	<svg width="16" height="16" viewBox="0 0 16 16">
		<circle cx="6" cy="5.6" r="2.2" {...trazo('rgba(0,0,0,.7)')} />
		<circle cx="11.2" cy="6.4" r="1.6" {...trazo('rgba(0,0,0,.7)')} />
		<path d="M2 13.4 C2 10.8 3.8 9.6 6 9.6 C8.2 9.6 10 10.8 10 13.4 M10.6 9.8 C12.6 9.8 14 10.8 14 13" {...trazo('rgba(0,0,0,.7)')} />
	</svg>
);

/** `fall` de Ant: la flecha que baja. */
const IconoBaja: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		<path d="M2 4 L6.4 8.6 L9.2 6 L14 11 M14 7.4 V11 H10.4" {...trazo(AVISO_TINTA)} />
	</svg>
);

/** ordered-list, table, check-square, appstore y lock, a trazo. */
const IconoBoton: React.FC<{ cual: number; color: string }> = ({ cual, color }) => (
	<svg width="15" height="15" viewBox="0 0 16 16">
		{cual === 0 && <path d="M6 3.5 H14 M6 8 H14 M6 12.5 H14 M2.4 2.6 V4.6 M2 12 H3.4 L2 14 H3.6 M2.1 7.2 C2.4 6.7 3.5 6.8 3.3 7.6 L2.1 9 H3.5" {...trazo(color)} />}
		{cual === 1 && <path d="M2 2.5 H14 V13.5 H2 Z M2 6 H14 M2 9.7 H14 M6 2.5 V13.5" {...trazo(color)} />}
		{cual === 2 && <path d="M2.5 2.5 H13.5 V13.5 H2.5 Z M5 8.2 L7.2 10.4 L11.2 6" {...trazo(color)} />}
		{cual === 3 && <path d="M2.5 2.5 H7 V7 H2.5 Z M9 2.5 H13.5 V7 H9 Z M2.5 9 H7 V13.5 H2.5 Z M9 9 H13.5 V13.5 H9 Z" {...trazo(color)} />}
		{cual === 4 && <path d="M3.5 7.2 H12.5 V14 H3.5 Z M5.4 7.2 V5 C5.4 3.4 6.6 2.2 8 2.2 C9.4 2.2 10.6 3.4 10.6 5 V7.2" {...trazo(color)} />}
	</svg>
);
