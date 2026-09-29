import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { ACENTO, BORDE, TEXTO } from '../../notas/tema';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA, Pantalla, Plano, rampa } from '../informes/Comun';
import { ANCHO, CABEZA, RECARGAR } from '../informes/datos';
import { Trayendo } from '../informes/Mandos';
import { Visor } from '../informes/Visor';
import { HojaPuestos } from './HojaPuestos';
import { ANO, CERCA, CIERRE, CLICS, FOCO_DESDE, HOJA_EN_LA_MESA, OPCIONES, OPCION_7A, PASOS, PUNTOS, T, TARJETA, ajustes, estadoEn, fuera, senal } from './guion';

/*
 * «Los cuatro papeles de puestos»: encadena, no dibuja. «Cómo va el grupo» → la ficha por periodo
 * y su desplegable con «Todos los grupos» → la del año con «Calcular hasta el periodo» → la hoja en
 * el visor → de cerca (plano quieto) → otra vez el visor, con «Recargar».
 */

export const EscenaPuestos: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const s = senal(frame);
	const fueraCat = rampa(frame, T.pulsaCargar + 2, T.pulsaCargar + 10);
	const opCerca = frame < T.plano ? 0 : rampa(frame, T.plano, T.plano + 12) * (1 - rampa(frame, T.vuelve, T.vuelve + 16));

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<Pantalla puntos={PUNTOS} clics={CLICS} sale={T.cursorSale} fuera={fuera(frame)}>
				{frame >= LLEGADA.monta && fueraCat < 1 && (
					<Catalogo
						frame={frame}
						entraEn={LLEGADA.monta}
						{...estadoEn(frame)}
						elegidaDesde={frame >= T.pulsaAno ? T.pulsaAno : T.pulsaFicha}
						listaDesde={frame >= T.pulsaPastilla ? T.pulsaPastilla : undefined}
						senal={s}
						pulsado={frame >= T.pulsaCargar && frame < T.pulsaCargar + 8 ? 'cargar' : null}
						desplegable={frame >= T.abreGrupo && frame < T.eligeGrupo + 4 ? { campo: 'grupo', opciones: OPCIONES, senalada: frame >= T.llegaOpcion ? OPCION_7A : null, elegida: frame >= T.eligeGrupo ? OPCION_7A : null, desde: T.abreGrupo } : null}
						opacidad={1 - fueraCat}
					/>
				)}
				{frame >= T.monta && (
					<Visor
						frame={frame}
						entraEn={T.monta}
						impreso={ANO}
						params={['7°A']}
						ajustes={ajustes()}
						panel={{ abierto: true, desde: T.trae }}
						senal={s}
						mandos={<OcultarAparte derecha={RECARGAR.x - 14} />}
					>
						{frame < T.trae ? (
							<Trayendo texto="Cargando…" />
						) : (
							<div style={{ position: 'absolute', left: HOJA_EN_LA_MESA.x, top: HOJA_EN_LA_MESA.y, transformOrigin: '0 0', transform: `scale(${HOJA_EN_LA_MESA.escala})` }}>
								<HojaPuestos />
							</div>
						)}
					</Visor>
				)}
			</Pantalla>

			{opCerca > 0 && (
				<Plano p={CERCA} opacidad={opCerca}>
					<HojaPuestos />
				</Plano>
			)}

			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** «Ocultar a los de boletín aparte (no cambia los puestos)», la casilla que el informe sube a la cabecera. */
const OcultarAparte: React.FC<{ derecha: number }> = ({ derecha }) => (
	<div style={{ position: 'absolute', right: ANCHO - derecha, top: CABEZA.y, height: CABEZA.alto, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: TEXTO, whiteSpace: 'nowrap' }}>
		<span style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${BORDE}`, background: '#fff', boxSizing: 'border-box' }} />
		Ocultar a los de boletín aparte <span style={{ color: 'rgba(0,0,0,.45)' }}>(no cambia los puestos)</span>
		<span style={{ display: 'none', color: ACENTO }} />
	</div>
);
