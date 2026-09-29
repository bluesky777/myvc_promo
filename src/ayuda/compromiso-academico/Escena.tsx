import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { BarraSinGuardar, CabeceraDelColegio, P_COMPROMISOS, P_PERIODOS } from '../el-ano/colegio';
import { avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { CuerpoCompromisos } from './Compromisos';
import { CORTE_DE_FABRICA, CORTE_NUEVO, TEXTOS, YEAR } from './datos';
import { ANCHO_GUARDAR, AVISO, CIERRE, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «COMPROMISO ACADÉMICO»: encadena, no dibuja. Una pantalla; lo que cambia es el corte, la barra y
 * el aviso azul, que se pliega cuando vuelve el guardado.
 */

const CONFIG = entradaDelMenu('Configuración');
const EL_COLEGIO = entradaDelMenu('Configuración', 'El colegio');

export const EscenaCompromisoAcademico: React.FC = () => {
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

	const aviso = 1 - avance(frame, T.guardado + 4, T.guardado + 20);
	const sucio = frame >= T.teclea && frame < T.guardado;
	const corte = frame >= T.teclea ? tecleado(frame, CORTE_NUEVO, T.teclea) : CORTE_DE_FABRICA;
	const barra = avance(frame, T.teclea, T.teclea + 10) * (1 - avance(frame, T.guardado, T.guardado + 10));
	const P = PUNTOS;
	const reposo = { x: P.corte.x + 420, y: P.corte.y + 180 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Configuración', t: entra(frame, fps, T.abreConfig, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.config },
						{ frame: T.llegaColegio, ...P.colegio },
						{ frame: T.llegaPestana - 20, ...P.colegio },
						{ frame: T.llegaPestana, ...P.pestana },
						{ frame: T.pulsaPestana + 40, ...reposo },
						{ frame: T.llegaCorte - 50, ...reposo },
						{ frame: T.llegaCorte, ...P.corte },
						{ frame: T.teclea + 10, ...P.corte },
						{ frame: T.teclea + 40, x: P.corte.x + 140, y: P.corte.y + 60 },
						{ frame: T.llegaGuardar - 40, x: P.corte.x + 140, y: P.corte.y + 60 },
						{ frame: T.llegaGuardar, ...P.guardar },
						{ frame: T.guardado + 30, ...P.guardar },
						{ frame: T.guardado + 90, ...reposo },
					],
					clics: [T.pulsaConfig, T.pulsaColegio, T.pulsaPestana, T.pulsaCorte, T.pulsaCorte + 5, T.pulsaGuardar],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.montaColegio && (
					<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio, 12) }}>
						<CabeceraDelColegio
							year={YEAR}
							enCurso
							actual={YEAR}
							pestana={frame >= T.pulsaPestana ? P_COMPROMISOS : P_PERIODOS}
							senalado={entre(frame, T.llegaPestana, T.pulsaPestana + 10) ? `pestana-${P_COMPROMISOS}` : null}
						/>
						{frame >= T.montaCompromisos && (
							<CuerpoCompromisos
								aviso={aviso}
								corte={corte}
								corteFoco={entre(frame, T.pulsaCorte, T.llegaGuardar)}
								corteSeleccionado={entre(frame, T.pulsaCorte + 5, T.teclea)}
								corteSucio={sucio}
								cursor={parpadea(frame)}
								aparece={entra(frame, fps, T.montaCompromisos, 14)}
							/>
						)}
						{barra > 0.001 && (
							<BarraSinGuardar
								texto={TEXTOS.barra}
								guardar={TEXTOS.guardar}
								aparece={barra}
								anchoGuardar={ANCHO_GUARDAR}
								encima={entre(frame, T.llegaGuardar, T.pulsaGuardar + 4)}
								cargando={entre(frame, T.pulsaGuardar, T.guardado)}
								frame={frame}
							/>
						)}
					</div>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="tecla1" en={T.teclea} />
			<Efecto cual="aviso" en={AVISO.desde} />
			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
