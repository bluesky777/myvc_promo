import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Aplicacion, entradaDelMenu } from '../el-ano/Aplicacion';
import { CabeceraDelPlan, PanelDePagina } from '../el-ano/plan';
import { CuerpoModelo } from '../plan-evaluacion-modelo/Modelo';
import { avance, entre, parpadea, tecleado } from '../montar-el-ano/tiempo';
import { CuerpoPlantilla, DialogoSembrar } from './Plantilla';
import { YEAR, pestanas } from './datos';
import { CIERRE, PASOS, PUNTOS, T, TARJETA, TEXTO_NUEVO } from './guion';

/*
 * «PLAN DE EVALUACIÓN: LA PLANTILLA»: encadena, no dibuja. La pestaña ① se ve al llegar (es la que
 * abre la página) y se cambia a la ②; ahí se añade una fila y se aplica.
 */

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const REFERENCIAS = entradaDelMenu('Referencias');
const PLAN = entradaDelMenu('Referencias', 'Plan de evaluación');

export const EscenaPlanPlantilla: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const senalada = entre(frame, T.llegaReferencias, T.pulsaReferencias + 10)
		? { seccion: REFERENCIAS.seccion, hija: null }
		: entre(frame, T.llegaEntrada, T.pulsaEntrada + 10)
			? { seccion: PLAN.seccion, hija: PLAN.hija }
			: null;

	const anadido = frame >= T.anadido;
	const suma = anadido ? 100 : 75;
	const estado = { aviso: 1 - avance(frame, T.anadido, T.anadido + 14), tercera: avance(frame, T.anadido, T.anadido + 14) };
	const enPlantilla = frame >= T.pulsaPestana;

	const foco = entre(frame, T.pulsaCampo, T.pulsaPorcentaje) ? 'texto' as const : entre(frame, T.pulsaPorcentaje, T.pulsaAnadir) ? 'porcentaje' as const : null;
	const entrada = anadido
		? { texto: '', porcentaje: '', foco: null, cursor: false, encimaBoton: false }
		: {
			texto: frame >= T.tecleaTexto ? tecleado(frame, TEXTO_NUEVO.texto, T.tecleaTexto) : '',
			porcentaje: frame >= T.tecleaPorcentaje ? tecleado(frame, TEXTO_NUEVO.porcentaje, T.tecleaPorcentaje) : '',
			foco,
			cursor: parpadea(frame),
			encimaBoton: entre(frame, T.llegaAnadir, T.pulsaAnadir + 8),
		};

	const dialogo = frame >= T.dialogo ? entra(frame, fps, T.dialogo, 12) : 0;
	const hecho = avance(frame, T.aplicada, T.aplicada + 10);
	const P = PUNTOS;
	const reposo = { x: P.aplicarDialogo.x - 40, y: P.aplicarDialogo.y + 150 };

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Aplicacion
				abierta={{ seccion: 'Referencias', t: entra(frame, fps, T.abreReferencias, 16) }}
				senalada={senalada}
				opacidad={entra(frame, fps, 0, 14)}
				encima={
					<DialogoSembrar
						aparece={dialogo}
						hecho={hecho}
						encimaAplicar={entre(frame, T.llegaAplicarDialogo, T.pulsaAplicarDialogo + 6)}
						cargando={entre(frame, T.pulsaAplicarDialogo, T.aplicada)}
						frame={frame}
					/>
				}
				cursor={{
					puntos: [
						{ frame: T.cursorEntra, ...P.entrada },
						{ frame: T.llegaReferencias, ...P.referencias },
						{ frame: T.llegaEntrada, ...P.plan },
						{ frame: T.llegaPestana - 40, ...P.plan },
						{ frame: T.llegaPestana, ...P.pestana },
						{ frame: T.pulsaPestana + 40, x: P.pestana.x + 380, y: P.pestana.y + 300 },
						{ frame: T.llegaCampo - 50, x: P.pestana.x + 380, y: P.pestana.y + 300 },
						{ frame: T.llegaCampo, ...P.campo },
						{ frame: T.llegaPorcentaje - 16, ...P.campo },
						{ frame: T.llegaPorcentaje, ...P.porcentaje },
						{ frame: T.llegaAnadir - 14, ...P.porcentaje },
						{ frame: T.llegaAnadir, ...P.anadir },
						{ frame: T.pulsaAnadir + 40, ...P.anadir },
						{ frame: T.llegaAplicar - 50, x: P.aplicar.x + 300, y: P.aplicar.y - 10 },
						{ frame: T.llegaAplicar, ...P.aplicar },
						{ frame: T.pulsaAplicar + 30, ...P.aplicar },
						{ frame: T.pulsaAplicar + 90, ...reposo },
						{ frame: T.llegaAplicarDialogo - 40, ...reposo },
						{ frame: T.llegaAplicarDialogo, ...P.aplicarDialogo },
						{ frame: T.pulsaAplicarDialogo + 30, ...P.aplicarDialogo },
						{ frame: T.cursorSale - 20, ...reposo },
					],
					clics: [T.pulsaReferencias, T.pulsaEntrada, T.pulsaPestana, T.pulsaCampo, T.pulsaPorcentaje, T.pulsaAnadir, T.pulsaAplicar, T.pulsaAplicarDialogo],
					aparece: T.cursorEntra,
					sale: T.cursorSale,
				}}
			>
				{frame >= T.monta && (
					<PanelDePagina opacidad={entra(frame, fps, T.monta, 14)}>
						<CabeceraDelPlan year={YEAR} pestanas={pestanas(suma)} puesta={enPlantilla ? 'plantilla' : 'modelo'} senalada={entre(frame, T.llegaPestana, T.pulsaPestana) ? 'plantilla' : null} />
						{!enPlantilla && <CuerpoModelo elegida={0} />}
						{enPlantilla && (
							<CuerpoPlantilla
								estado={estado}
								suma={suma}
								entrada={entrada}
								encimaAplicar={entre(frame, T.llegaAplicar, T.pulsaAplicar + 8)}
								aparece={entra(frame, fps, T.montaPlantilla, 12)}
							/>
						)}
					</PanelDePagina>
				)}
			</Aplicacion>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{[...TEXTO_NUEVO.texto].map((_, i) => <Efecto key={`t${i}`} cual={TECLAS[i % 3]} en={T.tecleaTexto + (i + 1) * 4} />)}
			{[...TEXTO_NUEVO.porcentaje].map((_, i) => <Efecto key={`p${i}`} cual={TECLAS[(i + 1) % 3]} en={T.tecleaPorcentaje + (i + 1) * 4} />)}
			<Efecto cual="aviso" en={T.aplicada} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
