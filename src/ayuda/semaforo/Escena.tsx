import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

import { BANDA } from '../encuadre';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Corte } from '../cierre-6/Piezas';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla } from '../informes/Comun';
import { RECARGAR } from '../informes/datos';
import { Trayendo } from '../informes/Mandos';
import { Alerta } from '../informes/Piezas';
import { Resumen, Visor } from '../informes/Visor';
import { ALUMNOS, ENTREGA } from './datos';
import { Folio, HojaRiesgo, MediaHoja } from './Papeles';
import {
	CIERRE, CLICS, CON_AVISO, GRUPOS_VISIBLES, IMPRESO, PASOS, PLANO_A, PLANO_B, PLANO_C, PUNTOS, RIESGO_EN_LA_MESA, T, TARJETA, ajustes,
	estadoEn, fuera, senal, FOCO_DESDE, BUSCA, POR_TECLA, FECHA_TECLA,
} from './guion';

const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
/** Una tecla por letra que aparece, alternando las tres: la búsqueda y la fecha de entrega. */
const TECLEOS = ([[BUSCA, T.teclea, POR_TECLA], [ENTREGA, T.tecleaFecha, FECHA_TECLA]] as const).flatMap(([texto, desde, cada]) =>
	[...texto].map((_, i) => ({ cual: TECLAS[i % 3], en: desde + (i + 1) * cada })),
);

/*
 * «Semáforo»: encadena, no dibuja. Catálogo → configurador con la casilla y la fecha → la hoja de
 * riesgo en el visor → el folio y la media hoja de cerca (planos quietos) → el panel para la
 * valoración → la media hoja otra vez → el aviso de un colegio sin escala.
 */

const rampa = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const EscenaSemaforo: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const e = estadoEn(frame);
	const fueraCat = rampa(frame, T.pulsaCargar + 2, T.pulsaCargar + 10);
	const aj = ajustes(frame);
	const valoracion = aj.casilla === 1;

	const opA = frame < T.planoA ? 0 : rampa(frame, T.planoA, T.planoA + 12) * (1 - rampa(frame, T.planoB, T.planoB + 12));
	const opB = frame < T.planoB ? 0 : rampa(frame, T.planoB, T.planoB + 12) * (1 - rampa(frame, T.vuelve, T.vuelve + 16));
	const opB2 = frame < T.planoB2 ? 0 : rampa(frame, T.planoB2, T.planoB2 + 12) * (1 - rampa(frame, T.planoC, T.planoC + 12));
	const opC = frame < T.planoC ? 0 : rampa(frame, T.planoC, T.planoC + 12);

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale} fuera={fuera(frame)}>
				{frame >= LLEGADA.monta && fueraCat < 1 && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						{...e}
						elegidaDesde={T.pulsaFicha}
						listaDesde={frame >= T.teclea ? 0 : undefined}
						buscadorConFoco={frame >= T.pulsaBuscador && frame < T.pulsaFicha}
						fechaConFoco={frame >= T.pulsaFecha && frame < T.llegaCargar}
						senal={s}
						pulsado={frame >= T.pulsaCargar && frame < T.pulsaCargar + 8 ? 'cargar' : null}
						desplegable={frame >= T.abreGrupo && frame < T.eligeGrupo + 4 ? { campo: 'grupo', opciones: GRUPOS_VISIBLES, senalada: frame >= T.llegaOpcion ? 3 : null, elegida: frame >= T.eligeGrupo ? 3 : null, desde: T.abreGrupo } : null}
						opacidad={1 - fueraCat}
					/>
				)}
				{frame >= T.monta && (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={IMPRESO}
						params={['7°A']}
						ajustes={aj}
						panel={{ abierto: true, desde: T.trae }}
						senal={s}
						fechaConFoco={false}
						mandos={<Resumen derecha={RECARGAR.x - 12} texto="20 alumnos · 10 hojas (dos por hoja)" />}
					>
						{frame < T.trae ? (
							<Trayendo texto="Cargando…" />
						) : (
							<div style={{ position: 'absolute', left: RIESGO_EN_LA_MESA.x, top: RIESGO_EN_LA_MESA.y, transformOrigin: '0 0', transform: `scale(${RIESGO_EN_LA_MESA.escala})` }}>
								<HojaRiesgo />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			{opA > 0 && (
				<Plano p={PLANO_A} opacidad={opA}>
					<Folio arriba={ALUMNOS[0]} abajo={ALUMNOS[1]} valoracion={false} entrega={ENTREGA} />
				</Plano>
			)}
			{opB > 0 && (
				<Plano p={PLANO_B} opacidad={opB}>
					<Folio arriba={ALUMNOS[0]} abajo={ALUMNOS[1]} valoracion={false} entrega={ENTREGA} />
				</Plano>
			)}
			{opB2 > 0 && (
				<Plano p={PLANO_B} opacidad={opB2}>
					<Folio arriba={ALUMNOS[0]} abajo={ALUMNOS[1]} valoracion entrega={ENTREGA} />
				</Plano>
			)}
			{opC > 0 && (
				<Plano p={PLANO_C} opacidad={opC}>
					<div style={{ width: CON_AVISO.ancho, height: CON_AVISO.alto }}>
						<Alerta
							tipo="warning"
							ancho={CON_AVISO.ancho}
							titulo="Sin escala de valoración, no se marca lo excelente"
							texto="El colegio no tiene bandas definidas para este año, así que el semáforo sale con el rojo de lo perdido y sin el azul. Se arregla en Plan de evaluación → Escalas."
							tam={14}
						/>
						<div style={{ height: 14 }} />
						<div style={{ boxShadow: '0 24px 64px rgba(15,28,52,.18), 0 2px 8px rgba(15,28,52,.07)' }}>
							<MediaHoja a={ALUMNOS[0]} valoracion={false} conEscala={false} entrega={ENTREGA} />
						</div>
					</div>
				</Plano>
			)}
			<Corte desde={T.planoC + 6} hasta={TARJETA - 16} texto="Un año sin escala" x={1672} y={170} />

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			{TECLEOS.map((t, i) => <Efecto key={i} cual={t.cual} en={t.en} />)}
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** Un plano quieto del papel, recortado a la banda entre la cabecera y el rótulo. */
const Plano: React.FC<{ p: { escala: number; x: number; y: number }; opacidad: number; children: React.ReactNode }> = ({ p, opacidad, children }) => (
	<AbsoluteFill style={{ clipPath: `inset(${BANDA.arriba}px 0 ${1080 - BANDA.arriba - BANDA.alto}px 0)`, opacity: opacidad }}>
		<div style={{ position: 'absolute', left: p.x, top: p.y, transformOrigin: '0 0', transform: `scale(${p.escala})` }}>{children}</div>
	</AbsoluteFill>
);
