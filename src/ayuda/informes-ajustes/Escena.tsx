import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla } from '../informes/Comun';
import { RECARGAR } from '../informes/datos';
import { MandoFondo, Trayendo } from '../informes/Mandos';
import { Resumen, Visor } from '../informes/Visor';
import { Boletin } from './Boletin';
import { CIERRE, CLICS, FOCO_DESDE, GRAFICO, HOJA_EN_LA_MESA, IMPRESO, PASOS, PUNTOS, T, TARJETA, ajustes, panelAbierto, senal, valores } from './guion';

/*
 * «Los ajustes de impresión»: encadena, no dibuja. Catálogo → configurador con los plegables →
 * cargar → el visor con el panel abierto y el boletín debajo.
 */

export const EscenaInformesAjustes: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const aj = ajustes(frame);
	const s = senal(frame);
	const fueraCatalogo = interpolate(frame, [T.pulsaCargar + 2, T.pulsaCargar + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const inter = aj.interruptores!;
	const c = { foto: inter[0].encendido, rector: inter[1].encendido, titular: inter[2].encendido, rojos: inter[3].encendido, grafico: inter[GRAFICO].encendido, escalas: inter[5].encendido, pendientes: inter[6].encendido };
	const abierto = panelAbierto(frame);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale}>
				{frame >= LLEGADA.monta && fueraCatalogo < 1 && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						consulta=""
						familia="todo"
						elegida={frame >= T.pulsaFicha ? IMPRESO.clave : null}
						elegidaDesde={T.pulsaFicha}
						valores={valores(frame)}
						ajustes={aj}
						senal={s}
						pulsado={frame >= T.pulsaCargar && frame < T.pulsaCargar + 8 ? 'cargar' : null}
						desplegable={frame >= T.abreGrupo && frame < T.eligeGrupo + 4 ? { campo: 'grupo', opciones: GRUPOS_VISIBLES, senalada: frame >= T.llegaOpcion ? 3 : null, elegida: frame >= T.eligeGrupo ? 3 : null, desde: T.abreGrupo } : null}
						opacidad={1 - fueraCatalogo}
					/>
				)}
				{frame >= T.monta && (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={IMPRESO}
						params={['7°A']}
						ajustes={aj}
						panel={{ abierto, desde: frame >= T.pulsaEngranaje2 ? T.pulsaEngranaje2 : T.trae }}
						senal={s}
						moviendo={{ indice: GRAFICO, desde: T.pulsaGrafico }}
						mandos={
							<>
								<MandoFondo derecha={RECARGAR.x - 10} />
								<Resumen derecha={RECARGAR.x - 10 - 96} texto="20 boletines del grupo 7°A" />
							</>
						}
					>
						{frame < T.trae ? (
							<Trayendo texto="Trayendo los boletines…" />
						) : (
							<div style={{ position: 'absolute', left: HOJA_EN_LA_MESA.x, top: HOJA_EN_LA_MESA.y - HOJA_EN_LA_MESA.desplazamiento }}>
								<Boletin c={c} />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** Las primeras opciones del desplegable de grupo: con trece, se ven las primeras. */
const GRUPOS_VISIBLES = ['5°A', '6°A', '6°B', '7°A', '7°B', '8°A'];
