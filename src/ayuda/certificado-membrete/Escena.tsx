import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Colegio } from './Colegio';
import { CERTIFICADOS, EstadoPantalla, MEMBRETADA, PLANTILLAS, PRUEBA, TEXTOS, enLaCascara, rectPapelera } from './datos';
import { ALMENDROS } from '../colegio';
import { AVISO_ELIMINADA, AVISO_GUARDADA, CIERRE, CONFIG, EL_COLEGIO, E1, PASOS, PUNTOS, SCROLL, T, TARJETA, TECLEADO } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS 1: encadena, no dibuja. Todo pasa dentro de la cáscara y en una sola pantalla; lo
 * que se mueve es el scroll, los paneles que se abren y el pie que asoma, y todo sale de `T`.
 */

const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
const tramo = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], suave);

export function scrollEn(frame: number): number {
	return (
		SCROLL.arriba +
		(SCROLL.membretes - SCROLL.arriba) * tramo(frame, T.bajaDesde, T.bajaHasta) +
		(SCROLL.membretada - SCROLL.membretes) * tramo(frame, T.baja2Desde, T.baja2Hasta) +
		(SCROLL.prueba - SCROLL.membretada) * tramo(frame, T.baja3Desde, T.baja3Hasta)
	);
}

export const EscenaCertificadoMembrete: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			<EnLaCascara frame={frame} />

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Sequence from={AVISO_GUARDADA.desde} durationInFrames={AVISO_GUARDADA.dura + 20}>
				<Aviso texto={`Guardada «${PLANTILLAS[MEMBRETADA].nombre}».`} desde={0} dura={AVISO_GUARDADA.dura} />
			</Sequence>
			<Sequence from={AVISO_ELIMINADA.desde} durationInFrames={AVISO_ELIMINADA.dura + 20}>
				<Aviso texto={`Eliminada «${PLANTILLAS[PRUEBA].nombre}».`} desde={0} dura={AVISO_ELIMINADA.dura} />
			</Sequence>

			{[...TECLEADO].map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={T.teclea + i * T.porTecla} />
			))}
			<Efecto cual="aviso" en={AVISO_GUARDADA.desde} />
			<Efecto cual="aviso" en={AVISO_ELIMINADA.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();
	const abierta = entra(frame, fps, T.abreConfig, 16);
	const aparece = entra(frame, fps, 0, 14);
	const scroll = scrollEn(frame);

	const senaladaMenu =
		frame >= T.llegaConfig && frame < T.pulsaConfig + 10
			? { seccion: CONFIG.seccion, hija: null }
			: frame >= T.llegaColegio && frame < T.pulsaColegio + 10
				? { seccion: EL_COLEGIO.seccion, hija: EL_COLEGIO.hija }
				: null;

	const senalado =
		frame >= T.llegaPestana && frame < T.pulsaPestana + 10
			? `pestana-${CERTIFICADOS}`
			: frame >= T.llegaAbrir && frame < T.pulsaAbrir + 10
				? `abrir-${MEMBRETADA}`
				: frame >= T.llegaPapelera && frame < T.baja3Desde
					? `papelera-${MEMBRETADA}`
					: frame >= T.llegaPapelera2 && frame < T.pulsaPapelera2 + 10
						? `papelera-${PRUEBA}`
						: null;

	const pie = tramo(frame, T.pieDesde, T.pieHasta) * (1 - tramo(frame, T.guardada, T.guardada + 14));
	const estado: EstadoPantalla = {
		abiertas: [tramo(frame, T.abreDesde, T.abreHasta), 1, 0],
		pies: [pie, 0, 0],
		barraTextos: 0,
		vivas: [1, 1, 1 - tramo(frame, T.eliminada - 8, T.eliminada + 12)],
	};

	const teclas = frame >= T.teclea ? Math.min(TECLEADO.length, Math.floor((frame - T.teclea) / T.porTecla) + 1) : 0;
	const alturaTecleada = teclas > 0 ? TECLEADO.slice(0, teclas) : null;

	const pop = frame >= T.popconfirm
		? entra(frame, fps, T.popconfirm, 10) * (1 - tramo(frame, T.pulsaEliminar + 2, T.pulsaEliminar + 8))
		: 0;

	/* El tooltip de la papelera apagada, mientras el ratón está encima. */
	const tooltip = interpolate(frame, [T.llegaPapelera + 8, T.llegaPapelera + 16, T.baja3Desde - 10, T.baja3Desde], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const papelera = enLaCascara(rectPapelera(E1, MEMBRETADA), SCROLL.membretada);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					opacity: aparece,
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: CONFIG.seccion, t: abierta }} senalada={senaladaMenu}>
						{frame >= T.montaColegio && (
							<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio, 12) }}>
								<Colegio
									frame={frame}
									pestana={frame >= T.pulsaPestana ? CERTIFICADOS : 0}
									cuerpo={entra(frame, fps, T.montaCertificados, 16)}
									scroll={scroll}
									estado={estado}
									puesta={1}
									alturaTecleada={alturaTecleada}
									alturaConFoco={frame >= T.pulsaAltura && frame < T.pulsaGuardar}
									sucias={[frame >= T.teclea && frame < T.guardada, false, false]}
									textoEncabezado={ALMENDROS.encabezado}
									popconfirm={pop > 0 ? { i: PRUEBA, t: pop } : null}
									senalado={senalado}
								/>
							</div>
						)}
					</Cascara>

					{tooltip > 0 && (
						<div
							style={{
								position: 'absolute',
								left: papelera.x + papelera.ancho - 430,
								top: papelera.y - 46,
								width: 430,
								whiteSpace: 'nowrap',
								boxSizing: 'border-box',
								padding: '8px 12px',
								borderRadius: 7,
								background: 'rgba(0,0,0,.85)',
								color: '#fff',
								fontSize: 15,
								textAlign: 'center',
								opacity: tooltip,
							}}
						>
							{TEXTOS.noSePuede}
						</div>
					)}

					<Cursor
						puntos={[
							{ frame: T.cursorEntra, ...PUNTOS.entrada },
							{ frame: T.llegaConfig, ...PUNTOS.config },
							{ frame: T.llegaColegio, ...PUNTOS.colegio },
							{ frame: T.llegaPestana - 20, ...PUNTOS.colegio },
							{ frame: T.llegaPestana, ...PUNTOS.pestana },
							{ frame: T.pulsaPestana + 30, x: PUNTOS.pestana.x + 260, y: PUNTOS.pestana.y + 420 },
							{ frame: T.llegaAbrir - 70, x: PUNTOS.pestana.x + 260, y: PUNTOS.pestana.y + 420 },
							{ frame: T.llegaAbrir, ...PUNTOS.abrir },
							{ frame: T.llegaAltura - 60, ...PUNTOS.abrir },
							{ frame: T.llegaAltura, ...PUNTOS.altura },
							{ frame: T.pulsaAltura + 8, ...PUNTOS.altura },
							{ frame: T.teclea - 6, x: PUNTOS.altura.x + 90, y: PUNTOS.altura.y + 50 },
							{ frame: T.llegaGuardar - 60, x: PUNTOS.altura.x + 90, y: PUNTOS.altura.y + 50 },
							{ frame: T.llegaGuardar, ...PUNTOS.guardar },
							{ frame: T.llegaPapelera - 30, ...PUNTOS.guardar },
							{ frame: T.llegaPapelera, ...PUNTOS.papelera },
							{ frame: T.baja3Desde, ...PUNTOS.papelera },
							{ frame: T.baja3Hasta, x: PUNTOS.papelera2.x - 120, y: PUNTOS.papelera2.y + 60 },
							{ frame: T.llegaPapelera2, ...PUNTOS.papelera2 },
							{ frame: T.llegaEliminar - 50, ...PUNTOS.papelera2 },
							{ frame: T.llegaEliminar, ...PUNTOS.eliminar },
						]}
						clics={[T.pulsaConfig, T.pulsaColegio, T.pulsaPestana, T.pulsaAbrir, T.pulsaAltura, T.pulsaGuardar, T.pulsaPapelera2, T.pulsaEliminar]}
						aparece={T.cursorEntra}
						sale={T.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
