import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Efecto } from '../voz';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla, Plano, rampa } from '../informes/Comun';
import { RECARGAR } from '../informes/datos';
import { nombreDe, SEPTIMO_A } from '../informes/gente';
import { Trayendo } from '../informes/Mandos';
import { Resumen, Visor } from '../informes/Visor';
import { FichaMatricula } from './Ficha';
import { ABAJO, ARRIBA, CIERRE, CLICS, FOCO_DESDE, EN_LA_MESA, IMPRESO, PASOS, PUNTOS, T, TARJETA, desplegable, estadoEn, senal } from './guion';
import { BUSCA, POR_TECLA } from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra que aparece en el buscador, alternando las tres. */
const TECLEOS = [...BUSCA].map((_, i) => ({ cual: TECLAS[i % 3], en: T.teclea + (i + 1) * POR_TECLA }));

/*
 * «La ficha de matrícula»: encadena, no dibuja. Buscarla → grupo y estudiante → cargar → la hoja en
 * el visor → arriba y abajo de cerca (dos planos quietos).
 */

export const EscenaFichaMatricula: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const fueraCat = rampa(frame, T.pulsaCargar + 2, T.pulsaCargar + 10);
	const opArriba = frame < T.plano ? 0 : rampa(frame, T.plano, T.plano + 12) * (1 - rampa(frame, T.plano2, T.plano2 + 12));
	const opAbajo = frame < T.plano2 ? 0 : rampa(frame, T.plano2, T.plano2 + 12);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale} seVa={{ desde: T.seVa, hasta: T.seVa + 16 }}>
				{frame >= LLEGADA.monta && fueraCat < 1 && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						{...estadoEn(frame)}
						elegidaDesde={T.pulsaFicha}
						listaDesde={frame >= T.teclea ? 0 : undefined}
						buscadorConFoco={frame >= T.pulsaBuscador && frame < T.pulsaFicha}
						senal={s}
						pulsado={frame >= T.pulsaCargar && frame < T.pulsaCargar + 8 ? 'cargar' : null}
						desplegable={desplegable(frame)}
						opacidad={1 - fueraCat}
					/>
				)}
				{frame >= T.monta && (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={IMPRESO}
						params={['7°A']}
						ajustes={{ hoja: 0 }}
						panel={{ abierto: false, desde: 0 }}
						senal={s}
						mandos={<Resumen derecha={RECARGAR.x - 12} texto={`${nombreDe(SEPTIMO_A[1])} · 7°A`} />}
					>
						{frame < T.trae ? (
							<Trayendo texto="Trayendo la ficha del estudiante…" />
						) : (
							<div style={{ position: 'absolute', left: EN_LA_MESA.x, top: EN_LA_MESA.y }}>
								<FichaMatricula />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			{opArriba > 0 && (
				<Plano p={ARRIBA} opacidad={opArriba}>
					<FichaMatricula />
				</Plano>
			)}
			{opAbajo > 0 && (
				<Plano p={ABAJO} opacidad={opAbajo}>
					<FichaMatricula />
				</Plano>
			)}

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{TECLEOS.map((t, i) => <Efecto key={i} cual={t.cual} en={t.en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
