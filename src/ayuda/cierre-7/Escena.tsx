import React from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { Paso, pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Catalogo } from '../cierre-6/Catalogo';
import { ACTA_PROMOCION } from '../cierre-6/datos-catalogo';
import { Corte } from '../cierre-6/Piezas';
import { Acta } from './Acta';
import { HojaActa } from './HojaActa';
import { GRUPOS, SEGUNDOS_POR_GRUPO } from './datos';
import {
	ACADEMICA, CIERRE, CORTE, FOCOS, HOJA_CUADRO, HOJA_ENTERA, HOJA_LISTADO, INFORMES, LLEGADA, PAPEL_T, PASOS, PRIMERO, PUNTOS,
	TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 7: encadena, no dibuja. Catálogo y pantalla del acta dentro de la cáscara del rector; el
 * corte de la hoja académica es un fundido corto a fondo con la pastilla encima; y la hoja de 9°B
 * entra en tres planos quietos (entera, el listado de cerca, el cuadro de cerca).
 */

/*
 * El foco de «la hoja académica» recorta el panel de opciones, que crece al marcar la casilla (8
 * fotogramas, `Acta.tsx`). Antes del clic el hueco mide lo que el panel sin la fila de «Traer», y
 * crece a la vez que él: si no, deja al descubierto una franja vacía debajo del panel.
 */
type Recorte = NonNullable<Paso['foco']>;

function focoQueCrece(foco: Recorte | null, frame: number): Recorte | null {
	if (foco === null || foco !== (FOCOS.academica as Recorte)) { return foco; }
	const crece = interpolate(frame, [ACADEMICA.pulsaCasilla, ACADEMICA.pulsaCasilla + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return { ...foco, alto: interpolate(crece, [0, 1], [FOCOS.opciones.alto, FOCOS.academica.alto]) };
}

export const EscenaCierre7: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	/* El corte: la imagen baja a fondo y vuelve ya en el final. Se ve que hubo un salto. */
	const salto = interpolate(frame, [CORTE.desde, CORTE.salto, CORTE.salto + 12], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < PAPEL_T.entraLaHoja && <EnLaCascara frame={frame} fps={fps} />}
			{frame >= PAPEL_T.entraLaHoja - 10 && <LaHoja frame={frame} />}

			<AbsoluteFill style={{ background: FONDO, opacity: salto, zIndex: 25 }} />

			<Foco recorte={focoQueCrece(paso?.foco ?? null, frame)} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{/* El aviso de descuadre sale con el acta. */}
			<Efecto cual="aviso" en={LLEGADA.montaActa + 6} />
			<Corte desde={CORTE.desde} hasta={CORTE.hasta} texto={`Corte: ${GRUPOS - 1} grupos más, unos ${(GRUPOS - 1) * SEGUNDOS_POR_GRUPO} s`} y={480} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [PAPEL_T.seVaLaCascara, PAPEL_T.entraLaHoja], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const senalada = frame >= LLEGADA.llegaInformes && frame < LLEGADA.pulsaInformes + 10 ? { seccion: INFORMES, hija: null } : null;

	const senalCatalogo =
		frame >= LLEGADA.llegaFamilia && frame < LLEGADA.pulsaFamilia + 8 ? 'familia'
			: frame >= LLEGADA.llegaFicha && frame < LLEGADA.pulsaFicha ? 'ficha'
				: frame >= LLEGADA.llegaCargar && frame < LLEGADA.pulsaCargar ? 'cargar'
					: null;
	const senalActa =
		frame >= ACADEMICA.llegaCasilla && frame < ACADEMICA.pulsaCasilla ? 'casilla'
			: frame >= ACADEMICA.llegaTraer && frame < ACADEMICA.pulsaTraer ? 'traer'
				: null;

	const mc = LLEGADA.montaCatalogo;
	const ma = LLEGADA.montaActa;
	const listos = frame < ACADEMICA.pulsaTraer ? null : frame >= PRIMERO ? 1 : 0;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					transformOrigin: '50% 45%',
					transform: `scale(${1 + seVa * 0.07})`,
					opacity: aparece * (1 - seVa),
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={null} senalada={senalada} periodo="2026 · Periodo 4">
						{frame >= mc && frame < ma && (
							<Sequence from={mc}>
								<Catalogo
									familiaEn={LLEGADA.pulsaFamilia - mc}
									ficha={{ indice: ACTA_PROMOCION, en: LLEGADA.pulsaFicha - mc }}
									cargarEn={LLEGADA.pulsaCargar - mc}
									salidaEn={LLEGADA.seVaCatalogo - mc}
									senal={senalCatalogo}
								/>
							</Sequence>
						)}
						{frame >= ma && (
							<Sequence from={ma}>
								<Acta
									marcaAcademica={ACADEMICA.pulsaCasilla - ma}
									traer={ACADEMICA.pulsaTraer - ma}
									listos={listos}
									acabado={frame >= CORTE.salto}
									senal={senalActa}
								/>
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaInformes, ...PUNTOS.informes },
							{ frame: LLEGADA.llegaFamilia - 16, ...PUNTOS.informes },
							{ frame: LLEGADA.llegaFamilia, ...PUNTOS.familia },
							{ frame: LLEGADA.llegaFicha - 16, ...PUNTOS.familia },
							{ frame: LLEGADA.llegaFicha, ...PUNTOS.ficha },
							{ frame: LLEGADA.llegaCargar - 16, ...PUNTOS.ficha },
							{ frame: LLEGADA.llegaCargar, ...PUNTOS.cargar },
							{ frame: LLEGADA.pulsaCargar + 10, ...PUNTOS.cargar },
							{ frame: ACADEMICA.llegaCasilla - 16, x: PUNTOS.cargar.x, y: PUNTOS.cargar.y + 120 },
							{ frame: ACADEMICA.llegaCasilla, ...PUNTOS.casilla },
							{ frame: ACADEMICA.pulsaCasilla + 4, ...PUNTOS.casilla },
							{ frame: ACADEMICA.llegaTraer, ...PUNTOS.traer },
							{ frame: ACADEMICA.pulsaTraer + 8, ...PUNTOS.traer },
							{ frame: ACADEMICA.cursorSale, x: PUNTOS.traer.x + 60, y: PUNTOS.traer.y + 90 },
						]}
						clics={[LLEGADA.pulsaInformes, LLEGADA.pulsaFamilia, LLEGADA.pulsaFicha, LLEGADA.pulsaCargar, ACADEMICA.pulsaCasilla, ACADEMICA.pulsaTraer]}
						aparece={LLEGADA.cursorEntra}
						sale={ACADEMICA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* Tres planos quietos encadenados: la hoja entera, el listado de cerca, el cuadro de cerca. */
const LaHoja: React.FC<{ frame: number }> = ({ frame }) => {
	const t = (desde: number) => interpolate(frame, [desde, desde + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
	const aL = t(PAPEL_T.aListado);
	const aC = t(PAPEL_T.aCuadro);
	return (
		<>
			{aL < 1 && <Plano encuadre={HOJA_ENTERA} opacidad={1 - aL} />}
			{aL > 0 && aC < 1 && <Plano encuadre={HOJA_LISTADO} opacidad={aL * (1 - aC)} />}
			{aC > 0 && <Plano encuadre={HOJA_CUADRO} opacidad={aC} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number }> = ({ encuadre, opacidad }) => (
	<div style={{ position: 'absolute', left: encuadre.x, top: encuadre.y, transformOrigin: '0 0', transform: `scale(${encuadre.escala})`, opacity: opacidad }}>
		<HojaActa desde={PAPEL_T.entraLaHoja} />
	</div>
);
