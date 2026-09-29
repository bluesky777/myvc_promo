import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Catalogo } from '../informes/Catalogo';
import { LLEGADA as LLEGADA_INFORMES, Pantalla } from '../informes/Comun';
import { DialogoCierre } from './DialogoCierre';
import { Periodos } from './Periodos';
import { EL_QUE_SE_CIERRA } from './datos-periodos';
import {
	AVISO_PILA, B, CIERRE, CIERRE_T, CLICS_B, FOCO_DESDE, HIJA_EL_COLEGIO, INICIO_B, LLEGADA, ORIGEN_B, PASOS, PUNTOS_A, PUNTOS_B,
	SECCION_CONFIG, TARJETA, elegidaB, estadoB, listaDesdeB, senalB,
} from './guion';

/*
 * «Entrega de notas»: encadena, no dibuja. Acto A, la cáscara con Periodos y el diálogo de cierre
 * (las piezas de `cierre-2`, con el periodo 3); acto B, la `Pantalla` de informes con el catálogo,
 * en su propio reloj dentro de una `Sequence`. Los rótulos, el foco y la tarjeta van en el del vídeo.
 */

const PERIODO = '2026 · Periodo 3';

export const EscenaEntregaDeNotas: React.FC = () => {
	const frame = useCurrentFrame();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < INICIO_B + 2 && <ActoA />}
			<Sequence from={ORIGEN_B} layout="none">
				<ActoB />
			</Sequence>

			<Efecto cual="aviso" en={CIERRE_T.cargaHasta} />
			<Efecto cual="aviso" en={ORIGEN_B + AVISO_PILA.desde} />
			<Foco recorte={paso?.foco ?? null} desde={FOCO_DESDE[cual] ?? paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** A. Configuración ▸ El colegio ▸ Periodos: el semáforo, el diálogo de cierre y «Poner en curso». */
const ActoA: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const config = entra(frame, fps, LLEGADA.abreConfig, 16);
	const aparece = entra(frame, fps, 0, 14);
	/* Se apaga mientras entra la pantalla de Informes. */
	const sale = interpolate(frame, [ORIGEN_B, INICIO_B], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const senalada = frame >= LLEGADA.llegaConfig && frame < LLEGADA.pulsaConfig + 10
		? { seccion: SECCION_CONFIG, hija: null }
		: frame >= LLEGADA.llegaColegio && frame < LLEGADA.pulsaColegio + 10
			? { seccion: SECCION_CONFIG, hija: HIJA_EL_COLEGIO }
			: null;
	const senalado = frame >= CIERRE_T.llegaNivelando && frame < CIERRE_T.pulsaNivelando + 6
		? { fila: EL_QUE_SE_CIERRA, tramo: 'nivelando' as const }
		: null;
	const tramo = frame >= CIERRE_T.cambiaLaFila ? 'nivelando' : 'calificando';

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					opacity: aparece * sale,
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: SECCION_CONFIG, t: config }} senalada={senalada} periodo={PERIODO}>
						{frame >= LLEGADA.montaColegio && (
							<Sequence from={LLEGADA.montaColegio}>
								<Periodos tramoDelQueSeCierra={tramo} senalado={senalado} />
							</Sequence>
						)}
					</Cascara>
					<DialogoCierre abre={CIERRE_T.abreDialogo} cargaHasta={CIERRE_T.cargaHasta} pulsa={CIERRE_T.pulsaCerrar} cierra={CIERRE_T.cierraDialogo} />
					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS_A.entrada },
							{ frame: LLEGADA.llegaConfig, ...PUNTOS_A.config },
							{ frame: LLEGADA.llegaColegio, ...PUNTOS_A.colegio },
							{ frame: CIERRE_T.llegaMando - 16, ...PUNTOS_A.colegio },
							{ frame: CIERRE_T.llegaMando, ...PUNTOS_A.mando },
							{ frame: CIERRE_T.llegaNivelando - 16, ...PUNTOS_A.mando },
							{ frame: CIERRE_T.llegaNivelando, ...PUNTOS_A.nivelando },
							{ frame: CIERRE_T.pulsaNivelando + 8, ...PUNTOS_A.nivelando },
							{ frame: CIERRE_T.pulsaNivelando + 28, x: PUNTOS_A.cerrar.x + 90, y: PUNTOS_A.cerrar.y + 110 },
							{ frame: CIERRE_T.llegaCerrar - 16, x: PUNTOS_A.cerrar.x + 90, y: PUNTOS_A.cerrar.y + 110 },
							{ frame: CIERRE_T.llegaCerrar, ...PUNTOS_A.cerrar },
							{ frame: CIERRE_T.pulsaCerrar + 14, ...PUNTOS_A.cerrar },
							{ frame: CIERRE_T.llegaPoner - 18, ...PUNTOS_A.cerrar },
							{ frame: CIERRE_T.llegaPoner, ...PUNTOS_A.poner },
						]}
						clics={[LLEGADA.pulsaConfig, LLEGADA.pulsaColegio, CIERRE_T.pulsaNivelando, CIERRE_T.pulsaCerrar]}
						aparece={LLEGADA.cursorEntra}
						sale={ORIGEN_B}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** B. Menú ▸ Informes, en fotogramas locales: el catálogo por familias y la pila. */
const ActoB: React.FC = () => {
	const b = useCurrentFrame();
	const e = estadoB(b);
	const elegida = elegidaB(b);
	const s = senalB(b);

	return (
		<AbsoluteFill>
			<Pantalla puntos={PUNTOS_B} clics={CLICS_B} sale={B.cursorSale} periodo={PERIODO}>
				{b >= LLEGADA_INFORMES.monta && (
					<Catalogo
						frame={b}
						entraEn={LLEGADA_INFORMES.monta}
						{...e}
						elegidaDesde={elegida.desde}
						listaDesde={listaDesdeB(b)}
						senal={s}
						pulsado={b >= B.pulsaApilar && b < B.pulsaApilar + 8 ? 'apilar' : null}
						pilaDesde={b >= B.pulsaApilar ? [B.pulsaApilar] : []}
					/>
				)}
			</Pantalla>
			<Sequence from={AVISO_PILA.desde} durationInFrames={AVISO_PILA.dura + 20} style={{ top: 96, zIndex: 35 }}>
				<Aviso texto={AVISO_PILA.texto} desde={0} dura={AVISO_PILA.dura} />
			</Sequence>
		</AbsoluteFill>
	);
};
