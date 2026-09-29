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
import { Catalogo } from './Catalogo';
import { HojaPromovidos } from './HojaPromovidos';
import { BarraDeDirecciones, Corte } from './Piezas';
import { Tablero } from './Tablero';
import {
	AVISO_PROMOVIDOS, AVISO_RECALCULO, CIERRE, DIRECCION, FINALES_T, HOJA_DE_CERCA, HOJA_EN_EL_FOTOGRAMA, INFORMES, LLEGADA,
	PAPEL_T, PASOS, PROMOVIDOS_T, PUNTOS, RECALCULA, TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 6: encadena, no dibuja. Cáscara con el menú de rectoría: el catálogo, la barra de
 * direcciones encima, el tablero viejo; después la cáscara se acerca y se apaga, y el papel de
 * promovidos entra en dos planos quietos (hoja entera, y la tabla de cerca).
 */

const AVISO_DURA = 90;

export const EscenaCierre6: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < PAPEL_T.entraLaHoja && <EnLaCascara frame={frame} fps={fps} />}

			{frame >= PAPEL_T.entraLaHoja - 10 && <LaHoja frame={frame} />}

			<BarraDeDirecciones desde={DIRECCION.aparece} teclea={DIRECCION.teclea} intro={DIRECCION.intro} porTecla={DIRECCION.porTecla} base="micolegio.micolevirtual.com/up2/" tramo="informes-old" />

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{[...'informes-old'].map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={DIRECCION.teclea + i * DIRECCION.porTecla} />
			))}
			<Efecto cual="aviso" en={RECALCULA.fin} />
			<Efecto cual="aviso" en={PROMOVIDOS_T.fin} />
			<Corte desde={RECALCULA.pulsa + 6} hasta={RECALCULA.fin - 4} texto="Espera acortada: en la aplicación va grupo por grupo" y={560} />
			<Corte desde={PROMOVIDOS_T.confirma + 6} hasta={PROMOVIDOS_T.fin - 4} texto="Espera acortada: recorre los 13 grupos, uno detrás de otro" y={420} />

			<Sequence from={RECALCULA.fin} durationInFrames={AVISO_DURA + 20} style={{ top: 96, zIndex: 35 }}>
				<Aviso texto={AVISO_RECALCULO} desde={0} dura={AVISO_DURA} />
			</Sequence>
			<Sequence from={PROMOVIDOS_T.fin} durationInFrames={AVISO_DURA + 20} style={{ top: 96, zIndex: 35 }}>
				<Aviso texto={AVISO_PROMOVIDOS} desde={0} dura={AVISO_DURA} />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [PAPEL_T.seVaLaCascara, PAPEL_T.entraLaHoja], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const senalada = frame >= LLEGADA.llegaInformes && frame < LLEGADA.pulsaInformes + 10 ? { seccion: INFORMES, hija: null } : null;

	const conCatalogo = frame >= LLEGADA.montaCatalogo && frame < DIRECCION.montaTablero;
	const conTablero = frame >= DIRECCION.montaTablero;

	const senalCatalogo = frame >= LLEGADA.llegaFamilia && frame < LLEGADA.pulsaFamilia + 8 ? 'familia' : null;
	const senalTablero =
		frame >= RECALCULA.llega && frame < RECALCULA.pulsa ? 'recalcular'
			: frame >= FINALES_T.llega && frame < FINALES_T.pulsa ? 'finales'
				: frame >= PROMOVIDOS_T.llegaCalcular && frame < PROMOVIDOS_T.abre ? 'calcular'
					: frame >= PROMOVIDOS_T.llegaConfirmar && frame < PROMOVIDOS_T.confirma ? 'confirmar'
						: null;

	const mc = LLEGADA.montaCatalogo;
	const mt = DIRECCION.montaTablero;

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
						{conCatalogo && (
							<Sequence from={mc}>
								<Catalogo
									familiaEn={LLEGADA.pulsaFamilia - mc}
									ficha={{ indice: 0, en: 1e6 }}
									cargarEn={1e6}
									salidaEn={DIRECCION.seVaCatalogo - mc}
									senal={senalCatalogo}
								/>
							</Sequence>
						)}
						{conTablero && (
							<Sequence from={mt}>
								<Tablero
									recalcula={{ pulsa: RECALCULA.pulsa - mt, fin: RECALCULA.fin - mt }}
									finalesEn={FINALES_T.pulsa - mt}
									promovidos={{ abre: PROMOVIDOS_T.abre - mt, confirma: PROMOVIDOS_T.confirma - mt, fin: PROMOVIDOS_T.fin - mt }}
									senal={senalTablero}
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
							{ frame: LLEGADA.pulsaFamilia + 8, ...PUNTOS.familia },
							/* Mientras se teclea la dirección, el puntero espera abajo, fuera de la barra. */
							{ frame: DIRECCION.aparece, x: PUNTOS.familia.x + 120, y: PUNTOS.familia.y + 300 },
							{ frame: RECALCULA.llega - 16, x: PUNTOS.familia.x + 120, y: PUNTOS.familia.y + 300 },
							{ frame: RECALCULA.llega, ...PUNTOS.recalcular },
							{ frame: RECALCULA.pulsa + 8, ...PUNTOS.recalcular },
							{ frame: FINALES_T.llega, ...PUNTOS.finales },
							{ frame: FINALES_T.pulsa + 6, ...PUNTOS.finales },
							{ frame: PROMOVIDOS_T.llegaCalcular, ...PUNTOS.calcular },
							{ frame: PROMOVIDOS_T.abre + 8, ...PUNTOS.calcular },
							{ frame: PROMOVIDOS_T.llegaConfirmar, ...PUNTOS.confirmar },
							{ frame: PROMOVIDOS_T.confirma + 8, ...PUNTOS.confirmar },
						]}
						clics={[LLEGADA.pulsaInformes, LLEGADA.pulsaFamilia, RECALCULA.pulsa, FINALES_T.pulsa, PROMOVIDOS_T.abre, PROMOVIDOS_T.confirma]}
						aparece={LLEGADA.cursorEntra}
						sale={PROMOVIDOS_T.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* El papel: dos planos quietos encadenados, como el boletín de `competencias/`. */
const LaHoja: React.FC<{ frame: number }> = ({ frame }) => {
	const cerca = interpolate(frame, [PAPEL_T.empiezaElAcercamiento, PAPEL_T.acabaElAcercamiento], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
	return (
		<>
			{cerca < 1 && <Plano encuadre={HOJA_EN_EL_FOTOGRAMA} opacidad={1 - cerca} />}
			{cerca > 0 && <Plano encuadre={HOJA_DE_CERCA} opacidad={cerca} />}
		</>
	);
};

const Plano: React.FC<{ encuadre: { escala: number; x: number; y: number }; opacidad: number }> = ({ encuadre, opacidad }) => (
	<div style={{ position: 'absolute', left: encuadre.x, top: encuadre.y, transformOrigin: '0 0', transform: `scale(${encuadre.escala})`, opacity: opacidad }}>
		<HojaPromovidos desde={PAPEL_T.entraLaHoja} calculado />
	</div>
);
