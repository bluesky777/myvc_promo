import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { TEXTO } from '../../notas/tema';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla, Plano, rampa } from '../informes/Comun';
import { ANCHO, CABEZA, RECARGAR } from '../informes/datos';
import { MandoFondo, Trayendo } from '../informes/Mandos';
import { Desplegable, Select } from '../informes/Piezas';
import { Visor } from '../informes/Visor';
import { ControlClase, DIAS_SEPTIEMBRE, PlanillaGrupo } from './Papeles';
import {
	CERCA, CIERRE, CLICS, FOCO_DESDE, CONTROL, MESES, OPCIONES_GRUPO, PASOS, PISTA, PLANILLAS, PUNTOS, SELECT_MES, T, TARJETA, ajustesPlanillas, enElCatalogo,
	enElControl, enLaPlanilla, estadoEn, fuera, senal,
} from './guion';

/*
 * «Planillas y controles del aula»: encadena, no dibuja. «Para el aula» → Planillas del grupo →
 * el visor con «La hoja» y la pista de las columnas → la cabecera de cerca → «Buscar otro informe»
 * → el control de asistencia a clase, con su «Mes».
 */

export const EscenaPlanillasAula: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const salida = frame >= T.pulsaBuscarOtro ? T.pulsaCargar2 : T.pulsaCargar;
	const opCat = 1 - rampa(frame, salida + 2, salida + 10);
	const opPlanilla = frame < T.pulsaBuscarOtro ? 1 : 1 - rampa(frame, T.pulsaBuscarOtro, T.pulsaBuscarOtro + 8);
	const opCerca = frame < T.plano ? 0 : rampa(frame, T.plano, T.plano + 12) * (1 - rampa(frame, T.vuelve, T.vuelve + 16));
	const mes = frame >= T.eligeMes ? 'Sin días' : 'Septiembre';

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale} fuera={fuera(frame)}>
				{enElCatalogo(frame) && (
					<Catalogo
						frame={frame}
						entraEn={frame >= T.pulsaBuscarOtro ? T.vuelveCatalogo : LLEGADA.monta}
						{...estadoEn(frame)}
						elegidaDesde={frame >= T.pulsaControl ? T.pulsaControl : frame >= T.pulsaBuscarOtro ? 0 : T.pulsaFicha}
						listaDesde={frame >= T.pulsaPastilla ? (frame >= T.pulsaBuscarOtro ? T.vuelveCatalogo : T.pulsaPastilla) : undefined}
						senal={s}
						pulsado={(frame >= T.pulsaCargar && frame < T.pulsaCargar + 8) || (frame >= T.pulsaCargar2 && frame < T.pulsaCargar2 + 8) ? 'cargar' : null}
						desplegable={frame >= T.abreGrupo && frame < T.eligeGrupo + 4 ? { campo: 'grupo', opciones: OPCIONES_GRUPO, senalada: frame >= T.llegaOpcion ? 3 : null, elegida: frame >= T.eligeGrupo ? 3 : null, desde: T.abreGrupo } : null}
						opacidad={opCat}
					/>
				)}
				{enLaPlanilla(frame) || (frame >= T.pulsaBuscarOtro && opPlanilla > 0) ? (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={PLANILLAS}
						params={['7°A']}
						ajustes={ajustesPlanillas(frame)}
						panel={{ abierto: true, desde: T.trae }}
						senal={s}
						opacidad={opPlanilla}
						mandos={
							<>
								<div style={{ position: 'absolute', left: PISTA.x, top: PISTA.y, width: PISTA.ancho, height: PISTA.alto, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 14, color: 'rgba(0,0,0,.5)', whiteSpace: 'nowrap' }}>
									Las columnas salen del plan de evaluación, con su porcentaje.
								</div>
								<MandoFondo derecha={RECARGAR.x - 10} />
							</>
						}
					>
						{frame < T.trae ? (
							<Trayendo texto="Trayendo las planillas…" />
						) : (
							<div style={{ position: 'absolute', left: 18, top: 18, transformOrigin: '0 0', transform: 'scale(0.58)' }}>
								<PlanillaGrupo />
							</div>
						)}
					</Visor>
				) : null}
				{enElControl(frame) && (
					<Visor
						frame={frame}
						entraEn={T.monta2}
						impreso={CONTROL}
						params={[]}
						ajustes={{ hoja: 2 }}
						panel={{ abierto: false, desde: 0 }}
						senal={s}
						mandos={<MandoMes frame={frame} fps={fps} mes={mes} />}
					>
						{frame < T.trae2 ? (
							<Trayendo texto="Trayendo los grupos del colegio…" />
						) : (
							<div style={{ position: 'absolute', left: 18, top: 18, transformOrigin: '0 0', transform: 'scale(0.88)' }}>
								<ControlClase mes={mes === 'Sin días' ? '' : mes} dias={mes === 'Sin días' ? null : DIAS_SEPTIEMBRE} />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			{opCerca > 0 && (
				<Plano p={CERCA} opacidad={opCerca}>
					<PlanillaGrupo />
				</Plano>
			)}

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** «Mes» y su desplegable, en la cabecera del control. */
const MandoMes: React.FC<{ frame: number; fps: number; mes: string }> = ({ frame, fps, mes }) => {
	const abierto = frame >= T.abreMes && frame < T.eligeMes + 4;
	return (
		<>
			<div style={{ position: 'absolute', right: ANCHO - SELECT_MES.x + 10, top: CABEZA.y, height: CABEZA.alto, display: 'flex', alignItems: 'center', fontSize: 14.5, color: TEXTO }}>Mes</div>
			<Select r={SELECT_MES} valor={mes} marcador="" abierto={abierto} encima={frame >= T.llegaMes && frame < T.abreMes} tam={15} />
			{abierto && (
				<Desplegable
					bajo={SELECT_MES}
					opciones={MESES}
					senalada={frame >= T.llegaSinDias ? 0 : 9}
					elegida={frame >= T.eligeMes ? 0 : 9}
					opacidad={entra(frame, fps, T.abreMes, 6)}
					tam={15}
				/>
			)}
		</>
	);
};
