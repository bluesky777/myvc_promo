import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { MENU_DIRECTIVO } from '../medidas';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { CabeceraDelColegio, DesplegableDeAnios, P_AJUSTES, P_PERIODOS, enLaCascara } from '../el-ano/colegio';
import { Popconfirm } from '../el-ano/piezas';
import { avance, entre } from '../montar-el-ano/tiempo';
import { CuerpoAjustes } from './Ajustes';
import { TEXTOS, Y2026, Y2027, rectBotonAnio } from './datos';
import { AVISO_ACTUAL, AVISO_PUESTO, CIERRE, PASOS, POP, PUNTOS, SCROLL, T, TARJETA } from './guion';

/*
 * «LOS AJUSTES DEL AÑO»: encadena, no dibuja. Una sola pantalla dentro de la cáscara; lo que cambia
 * es la pestaña, el interruptor, el año que se mira y el popconfirm. Todo sale de `T`.
 */

const CONFIG = entradaDelMenu('Configuración');
const EL_COLEGIO = entradaDelMenu('Configuración', 'El colegio');

export const EscenaAjustesDelAno: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaConfig, T.pulsaConfig + 10)
		? { seccion: CONFIG.seccion, hija: null }
		: entre(frame, T.llegaColegio, T.pulsaColegio + 10)
			? { seccion: EL_COLEGIO.seccion, hija: EL_COLEGIO.hija }
			: null;

	const en2027 = frame >= T.en2027;
	const actual2027 = frame >= T.actual;
	/* El aviso amarillo crece al llegar a 2027 y se pliega cuando 2027 pasa a estar en curso. */
	const aviso = avance(frame, T.en2027, T.en2027 + 12) * (1 - avance(frame, T.actual + 4, T.actual + 18));

	const pop = frame >= T.popconfirm ? entra(frame, fps, T.popconfirm, 10) * (1 - avance(frame, T.pulsaOk + 2, T.pulsaOk + 8)) : 0;
	const desplegable = entre(frame, T.pulsaSelector + 2, T.pulsaOpcion + 4) ? entra(frame, fps, T.pulsaSelector + 2, 8) : 0;

	const senalado = entre(frame, T.llegaPestana, T.pulsaPestana + 10)
		? `pestana-${P_AJUSTES}`
		: entre(frame, T.llegaSelector, T.pulsaSelector + 6)
			? 'selector'
			: null;

	const scroll = SCROLL * interpolate(frame, [T.bajaDesde, T.bajaHasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

	const boton = enLaCascara(rectBotonAnio(1));
	const P = PUNTOS;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Configuración', t: entra(frame, fps, T.abreConfig, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				periodo="2026 · Periodo 4"
				encima={
					<Popconfirm
						x={boton.x + boton.ancho / 2}
						y={boton.y}
						ancho={POP.ancho}
						ancla={POP.ancla}
						titulo={TEXTOS.popconfirm(Y2027.year)}
						ok={TEXTOS.ok(Y2027.year)}
						cancelar={TEXTOS.cancelar}
						aparece={pop}
						encimaOk={entre(frame, T.llegaOk + 6, T.pulsaOk + 4)}
					/>
				}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.config },
						{ frame: T.llegaColegio, ...P.colegio },
						{ frame: T.llegaPestana - 20, ...P.colegio },
						{ frame: T.llegaPestana, ...P.pestana },
						{ frame: T.pulsaPestana + 40, x: P.pestana.x + 120, y: P.pestana.y + 360 },
						{ frame: T.llegaPuesto - 60, x: P.pestana.x + 120, y: P.pestana.y + 360 },
						{ frame: T.llegaPuesto, ...P.puesto },
						{ frame: T.pulsaPuesto + 30, ...P.puesto },
						{ frame: T.llegaSelector - 50, x: P.puesto.x - 60, y: P.puesto.y + 90 },
						{ frame: T.llegaSelector, ...P.selector },
						{ frame: T.pulsaSelector + 16, ...P.selector },
						{ frame: T.llegaOpcion, ...P.opcion },
						{ frame: T.pulsaOpcion + 30, ...P.opcion },
						{ frame: T.llegaBoton - 60, x: P.boton.x + 260, y: P.boton.y + 150 },
						{ frame: T.llegaBoton, ...P.boton },
						{ frame: T.llegaOk - 40, ...P.boton },
						{ frame: T.llegaOk, ...P.ok },
						{ frame: T.pulsaOk + 20, ...P.ok },
						{ frame: T.cursorSale - 20, x: P.ok.x + 200, y: P.ok.y + 300 },
					],
					clics: [T.pulsaConfig, T.pulsaColegio, T.pulsaPestana, T.pulsaPuesto, T.pulsaSelector, T.pulsaOpcion, T.pulsaBoton, T.pulsaOk],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.montaColegio && (
					<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio, 12), transform: `translateY(${-scroll}px)` }}>
						<CabeceraDelColegio
							year={en2027 ? Y2027.year : Y2026.year}
							enCurso={en2027 ? actual2027 : true}
							actual={Y2026.year}
							aviso={aviso}
							pestana={frame >= T.pulsaPestana ? P_AJUSTES : P_PERIODOS}
							senalado={senalado}
						/>
						{frame >= T.montaAjustes && (
							<div style={{ opacity: entra(frame, fps, T.montaAjustes, 14) }}>
								<CuerpoAjustes
									year={en2027 ? Y2027.year : Y2026.year}
									enCurso={en2027 ? actual2027 : true}
									aviso={aviso}
									puesto={en2027 ? 0 : avance(frame, T.pulsaPuesto, T.pulsaPuesto + 6)}
									cargaPuesto={entre(frame, T.pulsaPuesto, T.puestoGuardado) ? 1 : 0}
									frame={frame}
									botonEncima={entre(frame, T.llegaBoton, T.llegaOk - 40)}
									botonCarga={entre(frame, T.pulsaOk, T.actual)}
								/>
							</div>
						)}
						{desplegable > 0 && (
							<DesplegableDeAnios
								anios={[
									{ year: 2027, enCurso: false },
									{ year: 2026, enCurso: true },
									{ year: 2025, enCurso: false },
									{ year: 2024, enCurso: false },
								]}
								resaltada={frame >= T.llegaOpcion - 6 ? 0 : 1}
								aparece={desplegable}
							/>
						)}
					</div>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="aviso" en={AVISO_PUESTO.desde} />
			<Efecto cual="aviso" en={AVISO_ACTUAL.desde} />
			<Sequence from={AVISO_PUESTO.desde} durationInFrames={AVISO_PUESTO.dura + 20}>
				<Aviso texto={AVISO_PUESTO.texto} desde={0} dura={AVISO_PUESTO.dura} />
			</Sequence>
			<Sequence from={AVISO_ACTUAL.desde} durationInFrames={AVISO_ACTUAL.dura + 20}>
				<Aviso texto={AVISO_ACTUAL.texto} desde={0} dura={AVISO_ACTUAL.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

export { MENU_DIRECTIVO };
