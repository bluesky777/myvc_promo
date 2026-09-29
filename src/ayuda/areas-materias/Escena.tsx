import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { avance, entre } from '../montar-el-ano/tiempo';
import { Arrastrada, DialogoElegir, PantallaAreas, PantallaDirectores, PantallaMaterias } from './Pantallas';
import { A, AREAS, AREAS_DESPUES, CONTRATADOS, NUEVO_DIRECTOR } from './datos';
import { AVISO, BAJADA, CIERRE, ORIGEN, PASOS, PUNTOS, T, TARJETA } from './guion';

/*
 * «ÁREAS, MATERIAS Y DIRECTORES»: encadena, no dibuja. Materias (con el arrastre y la bajada),
 * Áreas de paso, y Directores de área con su diálogo. Cada pantalla se apaga antes de la siguiente.
 */

const REFERENCIAS = entradaDelMenu('Referencias');
const MATERIAS_M = entradaDelMenu('Referencias', 'Materias');
const AREAS_M = entradaDelMenu('Referencias', 'Áreas');
const curva = Easing.inOut(Easing.cubic);
const ELEGIDO = CONTRATADOS.indexOf(NUEVO_DIRECTOR);

export const EscenaAreasMaterias: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaReferencias, T.pulsaReferencias + 10)
		? { seccion: REFERENCIAS.seccion, hija: null }
		: entre(frame, T.llegaEntrada, T.pulsaEntrada + 10)
			? { seccion: MATERIAS_M.seccion, hija: MATERIAS_M.hija }
			: entre(frame, T.llegaAreas, T.pulsaAreas + 10)
				? { seccion: AREAS_M.seccion, hija: AREAS_M.hija }
				: null;

	const P = PUNTOS;
	const soltada = frame >= T.suelta;
	const arrastrando = entre(frame, T.agarra, T.suelta);
	const t = curva(avance(frame, T.agarra, T.suelta));
	const arrastre = { x: ORIGEN.x + (P.suelta.x - P.asa.x) * t, y: ORIGEN.y + (P.suelta.y - P.asa.y) * t };
	const bajada = curva(avance(frame, T.bajaDesde, T.bajaHasta)) * BAJADA;
	const seVaMaterias = 1 - avance(frame, T.seVaMaterias, T.seVaMaterias + 14);
	const seVaAreas = 1 - avance(frame, T.seVaAreas, T.seVaAreas + 14);
	const guardado = frame >= T.guardado;
	const aviso = 1 - avance(frame, T.guardado + 4, T.guardado + 18);
	const dialogo = frame >= T.dialogo ? entra(frame, fps, T.dialogo, 10) * (1 - avance(frame, T.pulsaDocente + 4, T.pulsaDocente + 12)) : 0;
	const reposo = { x: P.persona.x + 380, y: P.persona.y + 200 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Referencias', t: entra(frame, fps, T.abreReferencias, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={<DialogoElegir aparece={dialogo} resaltada={entre(frame, T.llegaDocente - 6, T.pulsaDocente + 12) ? ELEGIDO : null} />}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaReferencias, ...P.referencias },
						{ frame: T.llegaEntrada, ...P.materias },
						{ frame: T.llegaAsa - 70, ...P.materias },
						{ frame: T.llegaAsa, ...P.asa },
						{ frame: T.agarra, ...P.asa },
						{ frame: T.suelta, ...P.suelta },
						{ frame: T.suelta + 30, x: P.suelta.x + 160, y: P.suelta.y + 110 },
						{ frame: T.llegaAreas - 50, x: P.suelta.x + 160, y: P.suelta.y + 110 },
						{ frame: T.llegaAreas, ...P.areas },
						{ frame: T.llegaDirectores - 16, ...P.areas },
						{ frame: T.llegaDirectores, ...P.directores },
						{ frame: T.pulsaDirectores + 40, ...P.directores },
						{ frame: T.pulsaDirectores + 100, ...reposo },
						{ frame: T.llegaPersona - 50, ...reposo },
						{ frame: T.llegaPersona, ...P.persona },
						{ frame: T.llegaDocente - 30, ...P.persona },
						{ frame: T.llegaDocente, ...P.docente },
						{ frame: T.pulsaDocente + 30, ...P.docente },
						{ frame: T.guardado + 80, ...reposo },
					],
					clics: [T.pulsaReferencias, T.pulsaEntrada, T.agarra, T.pulsaAreas, T.pulsaDirectores, T.pulsaPersona, T.pulsaDocente],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.monta && frame < T.montaAreas && (
					<>
						<PantallaMaterias
							lista={soltada ? AREAS_DESPUES : AREAS}
							arrastrando={arrastrando}
							areaDeLaMovida={soltada ? AREAS[A].nombre : AREAS[3].nombre}
							bajada={bajada}
							opacidad={entra(frame, fps, T.monta, 14) * seVaMaterias}
						/>
						{arrastrando && <Arrastrada x={arrastre.x} y={arrastre.y} ancho={ORIGEN.ancho} />}
					</>
				)}
				{frame >= T.montaAreas && frame < T.montaDirectores && (
					<PantallaAreas encimaDirectores={entre(frame, T.llegaDirectores, T.pulsaDirectores + 8)} opacidad={entra(frame, fps, T.montaAreas, 14) * seVaAreas} />
				)}
				{frame >= T.montaDirectores && (
					<PantallaDirectores
						aviso={aviso}
						resuelto={guardado}
						encimaPersona={entre(frame, T.llegaPersona, T.pulsaPersona + 6)}
						opacidad={entra(frame, fps, T.montaDirectores, 14)}
					/>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Sequence from={AVISO.desde} durationInFrames={AVISO.dura + 20}>
				<Aviso texto={AVISO.texto} desde={0} dura={AVISO.dura} />
			</Sequence>

			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

void interpolate;
