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
import { Trayendo } from '../informes/Mandos';
import { Visor } from '../informes/Visor';
import { DOCENTES_PENDIENTES, HOJA, HojaDocente } from './Hoja';
import { BUSCA, POR_TECLA, CERCA, CIERRE, CLICS, DOS, EN_LA_MESA, IMPRESO, PASOS, PLANO_DOS, PUNTOS, T, TARJETA, ajustes, estadoEn, senal } from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra que aparece en el buscador, alternando las tres. */
const TECLEOS = [...BUSCA].map((_, i) => ({ cual: TECLAS[i % 3], en: T.teclea + (i + 1) * POR_TECLA }));

/*
 * «Notas perdidas para la comisión»: encadena, no dibuja. Buscar «comision» → la ficha → cargar →
 * la hoja en el visor → las tablas de cerca → las dos hojas, una por docente.
 */

export const EscenaNotasPerdidasComision: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const fueraCat = rampa(frame, T.pulsaCargar + 2, T.pulsaCargar + 10);
	const opCerca = frame < T.plano ? 0 : rampa(frame, T.plano, T.plano + 12) * (1 - rampa(frame, T.planoDos, T.planoDos + 12));
	const opDos = frame < T.planoDos ? 0 : rampa(frame, T.planoDos, T.planoDos + 12);

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
						opacidad={1 - fueraCat}
					/>
				)}
				{frame >= T.monta && (
					<Visor frame={frame} entraEn={T.monta} impreso={IMPRESO} params={[]} ajustes={ajustes()} panel={{ abierto: false, desde: 0 }} senal={s}>
						{frame < T.trae ? (
							<Trayendo texto="Cargando…" />
						) : (
							<>
								<div style={{ position: 'absolute', left: 0, width: '100%', top: 14, textAlign: 'center', fontSize: 16, color: '#000' }}>
									Profesores con notas pendientes - 2026 hasta per3
								</div>
								<div style={{ position: 'absolute', left: EN_LA_MESA.x, top: EN_LA_MESA.y }}>
									<HojaDocente d={DOCENTES_PENDIENTES[0]} />
								</div>
							</>
						)}
					</Visor>
				)}
			</Pantalla>

			{opCerca > 0 && (
				<Plano p={CERCA} opacidad={opCerca}>
					<HojaDocente d={DOCENTES_PENDIENTES[0]} />
				</Plano>
			)}
			{opDos > 0 && (
				<Plano p={PLANO_DOS} opacidad={opDos}>
					<div style={{ width: DOS.ancho, height: DOS.alto, display: 'flex', gap: DOS.ancho - HOJA.ancho * 2 }}>
						<HojaDocente d={DOCENTES_PENDIENTES[0]} />
						<HojaDocente d={DOCENTES_PENDIENTES[1]} />
					</div>
				</Plano>
			)}

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{TECLEOS.map((t, i) => <Efecto key={i} cual={t.cual} en={t.en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};
