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
import { BoletinPeriodo } from './BoletinPeriodo';
import { Informes } from './Informes';
import { CIERRE, PASOS, PLANO_GENERAL, PLANO_MATEMATICAS, PLANO_PIE, PUNTOS, SECCION_INFORMES, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 4: encadena, no dibuja. La cáscara con el menú de rector y el catálogo de Informes; al
 * cargar, el visor; y después la hoja a pantalla completa en TRES PLANOS QUIETOS encadenados
 * (general, Matemáticas, el pie), nunca reescalando el papel poco a poco: sus filetes de menos de
 * un píxel parpadearían (ver `competencias/Escena.tsx`).
 */

export const EscenaCierre4: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.entraLaHoja && <EnLaCascara frame={frame} fps={fps} />}

			{frame >= T.entraLaHoja - 10 && <LaHoja frame={frame} fps={fps} />}

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const LaHoja: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const suave = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: Easing.inOut(Easing.cubic) };
	const aMate = interpolate(frame, [T.aMatematicas, T.aMatematicas + T.encadenado], [0, 1], suave);
	const alPie = interpolate(frame, [T.alPie, T.alPie + T.encadenado], [0, 1], suave);
	const nace = entra(frame, fps, T.entraLaHoja, 16);

	const general = (1 - aMate) * nace;
	const mate = aMate * (1 - alPie);
	const pie = alPie;

	return (
		<>
			{general > 0 && <Plano encuadre={PLANO_GENERAL} opacidad={general} y={(1 - nace) * 18} />}
			{mate > 0 && <Plano encuadre={PLANO_MATEMATICAS} opacidad={mate} />}
			{pie > 0 && <Plano encuadre={PLANO_PIE} opacidad={pie} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number; y?: number }> = ({ encuadre, opacidad, y = 0 }) => (
	<div
		style={{
			position: 'absolute',
			left: encuadre.x,
			top: encuadre.y + y,
			transformOrigin: '0 0',
			transform: `scale(${encuadre.escala})`,
			opacity: opacidad,
		}}
	>
		<BoletinPeriodo />
	</div>
);

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [T.seVaLaCascara, T.entraLaHoja], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const senalada = frame >= T.llegaInformes && frame < T.pulsaInformes + 10 ? { seccion: SECCION_INFORMES, hija: null } : null;

	const enInformes =
		frame >= T.llegaOpcion && frame < T.pulsaOpcion + 4 ? 'opcion'
			: frame >= T.llegaImprimir && frame < T.cursorSale ? 'imprimir'
				: null;

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
					<Cascara menu={MENU_DIRECTIVO} abierta={null} senalada={senalada}>
						{frame >= T.montaInformes && (
							<Sequence from={T.montaInformes}>
								<Informes
									eligeFicha={T.eligeFicha - T.montaInformes}
									abreSelect={T.abreSelect - T.montaInformes}
									eligeGrupo={T.eligeGrupo - T.montaInformes}
									carga={T.carga - T.montaInformes}
									trae={T.trae - T.montaInformes}
									senalada={enInformes}
								/>
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: T.cursorEntra, ...PUNTOS.entrada },
							{ frame: T.llegaInformes, ...PUNTOS.informes },
							{ frame: T.llegaFicha - 16, ...PUNTOS.informes },
							{ frame: T.llegaFicha, ...PUNTOS.ficha },
							{ frame: T.llegaSelect - 14, ...PUNTOS.ficha },
							{ frame: T.llegaSelect, ...PUNTOS.select },
							{ frame: T.llegaOpcion, ...PUNTOS.opcion },
							{ frame: T.llegaCargar, ...PUNTOS.cargar },
							{ frame: T.llegaImprimir - 16, ...PUNTOS.cargar },
							{ frame: T.llegaImprimir, ...PUNTOS.imprimir },
						]}
						clics={[T.pulsaInformes, T.pulsaFicha, T.pulsaSelect, T.pulsaOpcion, T.pulsaCargar]}
						aparece={T.cursorEntra}
						sale={T.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
