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
import { MandoNumero, Trayendo } from '../informes/Mandos';
import { Resumen, Visor } from '../informes/Visor';
import { HojaInasistencias } from './Hoja';
import {
	CERCA, CIERRE, CLICS, FOCO_DESDE, DERECHA_DIAS, DERECHA_RESUMEN, DERECHA_UMBRAL, DIAS, EN_LA_MESA, IMPRESO, OPCIONES, PASOS, PIE, PUNTOS, T, TARJETA, UMBRAL,
	dias, estadoEn, fuera, marcadas, senal, umbral,
} from './guion';
import { POR_TECLA } from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por cifra que aparece en «Días de clase» y en «Umbral %», alternando las tres. */
const TECLEOS = ([[DIAS, T.tecleaDias], [UMBRAL, T.tecleaUmbral]] as const).flatMap(([texto, desde]) =>
	[...texto].map((_, i) => ({ cual: TECLAS[i % 3], en: desde + (i + 1) * POR_TECLA })),
);

/*
 * «Inasistencias por alumno»: encadena, no dibuja. «Quién vino» → la ficha y el grupo → la hoja en
 * el visor → el % vacío de cerca → «Días de clase» y «Umbral %» en la cabecera → el pie de cerca.
 */

export const EscenaInasistenciasAlumno: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const fueraCat = rampa(frame, T.pulsaCargar + 2, T.pulsaCargar + 10);
	const d = dias(frame);
	const u = umbral(frame);
	const n = marcadas(frame);
	const opCerca = frame < T.plano ? 0 : rampa(frame, T.plano, T.plano + 12) * (1 - rampa(frame, T.vuelve, T.vuelve + 16));
	const opPie = frame < T.plano2 ? 0 : rampa(frame, T.plano2, T.plano2 + 12);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale} fuera={fuera(frame)}>
				{frame >= LLEGADA.monta && fueraCat < 1 && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						{...estadoEn(frame)}
						elegidaDesde={T.pulsaFicha}
						listaDesde={frame >= T.pulsaPastilla ? T.pulsaPastilla : undefined}
						senal={s}
						pulsado={frame >= T.pulsaCargar && frame < T.pulsaCargar + 8 ? 'cargar' : null}
						desplegable={frame >= T.abreGrupo && frame < T.eligeGrupo + 4 ? { campo: 'grupo', opciones: OPCIONES, senalada: frame >= T.llegaOpcion ? 3 : null, elegida: frame >= T.eligeGrupo ? 3 : null, desde: T.abreGrupo } : null}
						opacidad={1 - fueraCat}
					/>
				)}
				{frame >= T.monta && (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={IMPRESO}
						params={['7°A']}
						ajustes={{ hoja: 1 }}
						panel={{ abierto: false, desde: 0 }}
						senal={s}
						mandos={
							<>
								<Resumen
									derecha={DERECHA_RESUMEN}
									texto={
										<>
											7°A · 20 alumnos
											{n > 0 && (
												<>
													&nbsp;· <b style={{ color: 'rgba(0,0,0,.88)' }}>{n}</b>&nbsp;sobre el umbral
												</>
											)}
										</>
									}
								/>
								<MandoNumero derecha={DERECHA_DIAS} rotulo="Días de clase" valor={d} conFoco={frame >= T.pulsaDias && frame < T.pulsaUmbral} anchoCasilla={60} />
								<MandoNumero derecha={DERECHA_UMBRAL} rotulo="Umbral %" valor={u} conFoco={frame >= T.pulsaUmbral && frame < T.seVa2} anchoCasilla={60} />
							</>
						}
					>
						{frame < T.trae ? (
							<Trayendo texto="Trayendo las ausencias del año…" />
						) : (
							<div style={{ position: 'absolute', left: EN_LA_MESA.x, top: EN_LA_MESA.y }}>
								<HojaInasistencias dias={d ? Number(d) : null} umbral={u ? Number(u) : null} />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			{opCerca > 0 && (
				<Plano p={CERCA} opacidad={opCerca}>
					<HojaInasistencias dias={null} umbral={null} />
				</Plano>
			)}
			{opPie > 0 && (
				<Plano p={PIE} opacidad={opPie}>
					<HojaInasistencias dias={Number(DIAS)} umbral={Number(UMBRAL)} />
				</Plano>
			)}

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{TECLEOS.map((t, i) => <Efecto key={i} cual={t.cual} en={t.en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
