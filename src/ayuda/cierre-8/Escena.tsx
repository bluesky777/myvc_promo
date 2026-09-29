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
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Catalogo } from '../cierre-6/Catalogo';
import { ACTA_NIVELACION } from '../cierre-6/datos-catalogo';
import { ActaNivelacion } from './ActaNivelacion';
import { HojaNivelacion } from './HojaNivelacion';
import { CIERRE, HOJA_A, HOJA_B, HOJA_ENTERA, INFORMES, LLEGADA, PAPEL_T, PASOS, PUNTOS, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 8: encadena, no dibuja. Catálogo y pantalla del acta en la cáscara del rector; después la
 * hoja en tres planos quietos encadenados (entera, sección A, sección B con las firmas).
 */

export const EscenaCierre8: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < PAPEL_T.entraLaHoja && <EnLaCascara frame={frame} fps={fps} />}
			{frame >= PAPEL_T.entraLaHoja - 10 && <LaHoja frame={frame} />}

			{/* El aviso amarillo «Antes de firmarla» sale con el acta. */}
			<Efecto cual="aviso" en={LLEGADA.montaActa + 6} />

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [PAPEL_T.seVaLaCascara, PAPEL_T.entraLaHoja], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const senalada = frame >= LLEGADA.llegaInformes && frame < LLEGADA.pulsaInformes + 10 ? { seccion: INFORMES, hija: null } : null;

	const senal =
		frame >= LLEGADA.llegaFamilia && frame < LLEGADA.pulsaFamilia + 8 ? 'familia'
			: frame >= LLEGADA.llegaFicha && frame < LLEGADA.pulsaFicha ? 'ficha'
				: frame >= LLEGADA.llegaGrupo && frame < LLEGADA.abreGrupo ? 'grupo'
					: frame >= LLEGADA.llegaOpcion && frame < LLEGADA.eligeOpcion ? 'opcion'
						: frame >= LLEGADA.llegaCargar && frame < LLEGADA.pulsaCargar ? 'cargar'
							: null;

	const mc = LLEGADA.montaCatalogo;
	const ma = LLEGADA.montaActa;

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
									ficha={{ indice: ACTA_NIVELACION, en: LLEGADA.pulsaFicha - mc }}
									grupo={{ abre: LLEGADA.abreGrupo - mc, elige: LLEGADA.eligeOpcion - mc }}
									cargarEn={LLEGADA.pulsaCargar - mc}
									salidaEn={LLEGADA.seVaCatalogo - mc}
									senal={senal}
								/>
							</Sequence>
						)}
						{frame >= ma && (
							<Sequence from={ma}>
								<ActaNivelacion />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS.entrada },
							{ frame: LLEGADA.llegaInformes, ...PUNTOS.informes },
							{ frame: LLEGADA.llegaFamilia - 16, ...PUNTOS.informes },
							{ frame: LLEGADA.llegaFamilia, ...PUNTOS.familia },
							{ frame: LLEGADA.pulsaFamilia + 6, ...PUNTOS.familia },
							{ frame: LLEGADA.llegaFicha, ...PUNTOS.ficha },
							{ frame: LLEGADA.llegaGrupo - 14, ...PUNTOS.ficha },
							{ frame: LLEGADA.llegaGrupo, ...PUNTOS.grupo },
							{ frame: LLEGADA.abreGrupo + 4, ...PUNTOS.grupo },
							{ frame: LLEGADA.llegaOpcion, ...PUNTOS.opcion },
							{ frame: LLEGADA.eligeOpcion + 4, ...PUNTOS.opcion },
							{ frame: LLEGADA.llegaCargar, ...PUNTOS.cargar },
						]}
						clics={[LLEGADA.pulsaInformes, LLEGADA.pulsaFamilia, LLEGADA.pulsaFicha, LLEGADA.abreGrupo, LLEGADA.eligeOpcion, LLEGADA.pulsaCargar]}
						aparece={LLEGADA.cursorEntra}
						sale={LLEGADA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const LaHoja: React.FC<{ frame: number }> = ({ frame }) => {
	const t = (desde: number) => interpolate(frame, [desde, desde + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
	const aA = t(PAPEL_T.aA);
	const aB = t(PAPEL_T.aB);
	return (
		<>
			{aA < 1 && <Plano encuadre={HOJA_ENTERA} opacidad={1 - aA} />}
			{aA > 0 && aB < 1 && <Plano encuadre={HOJA_A} opacidad={aA * (1 - aB)} />}
			{aB > 0 && <Plano encuadre={HOJA_B} opacidad={aB} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number }> = ({ encuadre, opacidad }) => (
	<div style={{ position: 'absolute', left: encuadre.x, top: encuadre.y, transformOrigin: '0 0', transform: `scale(${encuadre.escala})`, opacity: opacidad }}>
		<HojaNivelacion desde={PAPEL_T.entraLaHoja} />
	</div>
);
