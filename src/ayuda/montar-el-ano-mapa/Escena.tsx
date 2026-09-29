import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { CabeceraDelPlan, PanelDePagina } from '../el-ano/plan';
import { Periodos } from '../cierre-2/Periodos';
import { PantallaAsignaturas } from '../montar-el-ano/Asignaturas';
import { PantallaGrupos } from '../montar-el-ano/Grupos';
import { avance, entre } from '../montar-el-ano/tiempo';
import { PantallaMaterias } from '../areas-materias/Pantallas';
import { AREAS } from '../areas-materias/datos';
import { CuerpoModelo } from '../plan-evaluacion-modelo/Modelo';
import { PONDERADO, YEAR, pestanas } from '../plan-evaluacion-modelo/datos';
import { ASIGNATURAS_AL_LLEGAR, CIERRE, ESTADO_GRUPOS, PASOS, PLIEGA, PUNTOS, T, TARJETA } from './guion';

/*
 * «EL ORDEN DE MONTAR UN AÑO»: encadena, no dibuja. Seis paradas por el menú, cada una con la
 * pantalla ya dibujada en su vídeo. Cada pantalla se apaga entera antes de montar la siguiente, y
 * entre Configuración y Referencias una sección se pliega antes de que la otra se despliegue.
 */

const CONFIG = entradaDelMenu('Configuración');
const EL_COLEGIO = entradaDelMenu('Configuración', 'El colegio');
const REFERENCIAS = entradaDelMenu('Referencias');
const GRUPOS_M = entradaDelMenu('Referencias', 'Grupos');
const MATERIAS_M = entradaDelMenu('Referencias', 'Materias');
const ASIGNATURAS_M = entradaDelMenu('Referencias', 'Asignaturas');
const PLAN_M = entradaDelMenu('Referencias', 'Plan de evaluación');

export const EscenaMontarElAnoMapa: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	/* Qué sección está desplegada: Configuración, luego Referencias, luego Configuración otra vez. */
	const abierta =
		frame < T.pulsaRef
			? { seccion: 'Configuración', t: entra(frame, fps, T.abreConfig, 16) }
			: frame < T.pulsaRef + PLIEGA
				? { seccion: 'Configuración', t: 1 - avance(frame, T.pulsaRef, T.pulsaRef + PLIEGA) }
				: frame < T.pulsaRefCierra
					? { seccion: 'Referencias', t: entra(frame, fps, T.pulsaRef + PLIEGA, 16) }
					: frame < T.pulsaConfig2
						? { seccion: 'Referencias', t: 1 - avance(frame, T.pulsaRefCierra, T.pulsaRefCierra + PLIEGA) }
						: { seccion: 'Configuración', t: entra(frame, fps, T.pulsaConfig2 + 2, 16) };

	const hija = (e: { seccion: number; hija: number | null }) => ({ seccion: e.seccion, hija: e.hija });
	const senalada =
		entre(frame, T.llegaConfig, T.pulsaConfig + 10) || entre(frame, T.llegaConfig2, T.pulsaConfig2 + 10) ? { seccion: CONFIG.seccion, hija: null }
			: entre(frame, T.llegaColegio, T.pulsaColegio + 10) || entre(frame, T.llegaColegio2, T.pulsaColegio2 + 10) ? hija(EL_COLEGIO)
				: entre(frame, T.llegaRef, T.pulsaRef + 10) || entre(frame, T.llegaRefCierra, T.pulsaRefCierra + 10) ? { seccion: REFERENCIAS.seccion, hija: null }
					: entre(frame, T.llegaGrupos, T.pulsaGrupos + 10) ? hija(GRUPOS_M)
						: entre(frame, T.llegaMaterias, T.pulsaMaterias + 10) ? hija(MATERIAS_M)
							: entre(frame, T.llegaAsignaturas, T.pulsaAsignaturas + 10) ? hija(ASIGNATURAS_M)
								: entre(frame, T.llegaPlan, T.pulsaPlan + 10) ? hija(PLAN_M)
									: null;

	/** Una pantalla que llega en `monta` y se apaga al pulsar la siguiente entrada (`vase`). */
	const vida = (monta: number, vase: number) => entra(frame, fps, monta, 14) * (1 - avance(frame, vase, vase + 14));
	const P = PUNTOS;
	const reposo = { x: 1300, y: 700 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={abierta}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaConfig, ...P.config },
						{ frame: T.llegaColegio, ...P.colegio },
						{ frame: T.llegaColegio + 60, ...reposo },
						{ frame: T.llegaRef - 50, ...reposo },
						{ frame: T.llegaRef, ...P.referencias },
						{ frame: T.llegaGrupos, ...P.grupos },
						{ frame: T.llegaGrupos + 60, ...reposo },
						{ frame: T.llegaMaterias - 50, ...reposo },
						{ frame: T.llegaMaterias, ...P.materias },
						{ frame: T.llegaMaterias + 60, ...reposo },
						{ frame: T.llegaAsignaturas - 50, ...reposo },
						{ frame: T.llegaAsignaturas, ...P.asignaturas },
						{ frame: T.llegaAsignaturas + 60, ...reposo },
						{ frame: T.llegaPlan - 50, ...reposo },
						{ frame: T.llegaPlan, ...P.plan },
						{ frame: T.llegaPlan + 60, ...reposo },
						{ frame: T.llegaRefCierra - 50, ...reposo },
						{ frame: T.llegaRefCierra, ...P.referencias },
						{ frame: T.pulsaRefCierra + 24, ...P.referencias },
						{ frame: T.llegaConfig2, ...P.config },
						{ frame: T.llegaColegio2, ...P.colegio },
						{ frame: T.llegaColegio2 + 60, ...reposo },
					],
					clics: [T.pulsaConfig, T.pulsaColegio, T.pulsaRef, T.pulsaGrupos, T.pulsaMaterias, T.pulsaAsignaturas, T.pulsaPlan, T.pulsaRefCierra, T.pulsaConfig2, T.pulsaColegio2],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.montaColegio && frame < T.montaGrupos && (
					<div style={{ position: 'absolute', inset: 0, opacity: vida(T.montaColegio, T.pulsaGrupos) }}>
						<Sequence from={T.montaColegio}>
							<Periodos tramoDelQueSeCierra="calificando" senalado={null} />
						</Sequence>
					</div>
				)}
				{frame >= T.montaGrupos && frame < T.montaMaterias && <PantallaGrupos estado={ESTADO_GRUPOS} opacidad={vida(T.montaGrupos, T.pulsaMaterias)} />}
				{frame >= T.montaMaterias && frame < T.montaAsignaturas && (
					<PantallaMaterias lista={AREAS} arrastrando={false} areaDeLaMovida={AREAS[3].nombre} opacidad={vida(T.montaMaterias, T.pulsaAsignaturas)} />
				)}
				{frame >= T.montaAsignaturas && frame < T.montaPlan && <PantallaAsignaturas estado={ASIGNATURAS_AL_LLEGAR} opacidad={vida(T.montaAsignaturas, T.pulsaPlan)} />}
				{frame >= T.montaPlan && frame < T.montaColegio2 && (
					<PanelDePagina opacidad={vida(T.montaPlan, T.pulsaColegio2)}>
						<CabeceraDelPlan year={YEAR} pestanas={pestanas(PONDERADO)} puesta="modelo" />
						<CuerpoModelo elegida={PONDERADO} />
					</PanelDePagina>
				)}
				{frame >= T.montaColegio2 && (
					<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio2, 14) }}>
						{/* La segunda visita llega ya dibujada: si no, el foco del paso 11 cae antes que las filas. */}
						<Sequence from={T.montaColegio2 - 60}>
							<Periodos tramoDelQueSeCierra="calificando" senalado={null} />
						</Sequence>
					</div>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
