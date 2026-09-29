import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';

import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Efecto } from '../voz';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Corte } from '../cierre-6/Piezas';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla } from '../informes/Comun';
import { Visor } from '../informes/Visor';
import { PilaEntera } from './PilaEntera';
import {
	ANADIDOS, AVISOS, CIERRE, FOCO_DESDE, CLICS, FIN_RAPIDO, PASOS, PUNTOS, T, TARJETA, desplegable, elegida, enLaPilaEntera, estadoEn, pila, senal,
} from './guion';

/*
 * «La pila: trece grupos, una impresión»: encadena, no dibuja. El catálogo con la tira de la pila
 * arriba; la pila entera dentro del visor; vuelta al catálogo para quitar una fila; otra vez la pila.
 */

const AVISO_DURA = 50;

export const EscenaInformesPila: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const e = estadoEn(frame);
	const p = pila(frame);
	const enPila = enLaPilaEntera(frame);
	/* El catálogo se recoge al abrir la pila y vuelve al pulsar «Volver al catálogo». */
	const salidaCat = frame >= T.pulsaVer2 ? T.pulsaVer2 : T.pulsaVer;
	const opCat = interpolate(frame, [salidaCat + 2, salidaCat + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const vuelveCat = frame >= T.pulsaVolver && frame < T.pulsaVer2;
	const catalogoVisible = frame >= LLEGADA.monta && (!enPila || opCat > 0 || vuelveCat);
	const entraVisor = frame >= T.pulsaVer2 ? T.pulsaVer2 + 4 : T.pulsaVer + 4;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale}>
				{catalogoVisible && (
					<Catalogo
						frame={frame}
						entraEn={vuelveCat ? T.pulsaVolver + 2 : LLEGADA.monta}
						{...e}
						elegidaDesde={frame >= T.pulsaVolver ? 0 : frame >= T.pulsaVer ? 0 : elegida(frame) === 'planillas-grupo' ? T.pulsaPlanillas : T.pulsaFicha}
						listaDesde={frame >= T.pulsaAula && frame < T.pulsaVolver ? T.pulsaAula : undefined}
						senal={s}
						pulsado={s === 'apilar' && (frame - T.pulsaApilar < 8 && frame >= T.pulsaApilar || frame - T.pulsaApilar2 < 8 && frame >= T.pulsaApilar2 || frame - T.pulsaApilar3 < 8 && frame >= T.pulsaApilar3) ? 'apilar' : null}
						desplegable={desplegable(frame)}
						pilaDesde={p.desde}
						opacidad={enPila && !vuelveCat ? opCat : 1}
					/>
				)}
				{(enPila || (frame >= T.pulsaVolver && frame < T.pulsaVolver + 10)) && (
					<Visor
						frame={frame}
						entraEn={entraVisor}
						impreso={null}
						propios={false}
						params={[]}
						senal={s}
						opacidad={enPila ? 1 : interpolate(frame, [T.pulsaVolver, T.pulsaVolver + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
					>
						<PilaEntera
							frame={frame}
							desde={entraVisor}
							filas={enPila ? p.filas : pila(T.pulsaVolver - 1).filas}
							mezcla={(enPila ? p.filas : pila(T.pulsaVolver - 1).filas).length > 13}
							senal={s}
							pulsado={frame >= T.pulsaImprimir && frame < T.pulsaImprimir + 8 ? 'imprimir-todo' : null}
						/>
					</Visor>
				)}
			</Pantalla>

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Corte desde={ANADIDOS[2] - 12} hasta={FIN_RAPIDO + 12} texto="Acortado: lo mismo con cada grupo" y={560} />

			{AVISOS.map((a) => (
				<Sequence key={a.texto} from={a.desde} durationInFrames={AVISO_DURA + 20} style={{ top: 96, zIndex: 35 }}>
					<Aviso texto={a.texto} desde={0} dura={AVISO_DURA} />
				</Sequence>
			))}

			{[...AVISOS.map((a) => a.desde), T.pulsaVer + 4].map((en) => <Efecto key={en} cual="aviso" en={en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
