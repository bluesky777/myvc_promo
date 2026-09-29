import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { LA_QUE_SE_ABRE } from '../planilla/datos';
import { DialogoNivelacion } from './DialogoNivelacion';
import { PlanillaNivelacion } from './PlanillaNivelacion';
import { EXPLICACION, NIVELACION, TEXTOS } from './datos';
import { AVISO, CIERRE, EN_LA_PLANILLA as T, LLEGADA, PASOS, PUNTOS, PUNTOS_CASCARA, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CIERRE 3: encadena, no dibuja. La llegada es la del vídeo de la planilla (la cáscara se acerca y
 * se apaga al pulsar «Planilla»); luego la planilla a pantalla completa y el diálogo encima.
 */

export const EscenaCierre3: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const encima = frame >= T.llegaCasilla && frame < T.pulsaCasilla + 6;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < LLEGADA.entraLaPlanilla && <ActoDeLlegada frame={frame} fps={fps} />}

			<PlanillaNivelacion monta={LLEGADA.entraLaPlanilla} modoDesde={T.pulsaModo} niveladaDesde={T.niveladaDesde} encima={encima} seVa={0} />

			<DialogoNivelacion abre={T.abreDialogo} teclea={T.teclea} porTecla={T.porTecla} pulsa={T.pulsaRegistrar} cierra={T.cierraDialogo} />

			<Cursor
				puntos={[
					{ frame: T.cursorEntra, ...PUNTOS.entrada },
					{ frame: T.llegaModo, ...PUNTOS.modo },
					{ frame: T.pulsaModo + 30, ...PUNTOS.modo },
					{ frame: T.llegaCasilla, ...PUNTOS.casilla },
					{ frame: T.pulsaCasilla + 12, ...PUNTOS.casilla },
					/* Se aparta a la derecha del diálogo mientras se lee y se teclea. */
					{ frame: T.pulsaCasilla + 50, x: PUNTOS.registrar.x + 170, y: PUNTOS.campo.y + 40 },
					{ frame: T.llegaRegistrar - 24, x: PUNTOS.registrar.x + 170, y: PUNTOS.campo.y + 40 },
					{ frame: T.llegaRegistrar, ...PUNTOS.registrar },
					{ frame: T.pulsaRegistrar + 20, ...PUNTOS.registrar },
					{ frame: T.cursorSale - 20, x: PUNTOS.registrar.x + 220, y: PUNTOS.registrar.y + 60 },
				]}
				clics={[T.pulsaModo, T.pulsaCasilla, T.pulsaRegistrar]}
				aparece={T.cursorEntra}
				sale={T.cursorSale}
				tam={40}
			/>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoLargo desde={AVISO.desde} dura={AVISO.dura} />
			{NIVELACION.split('').map((_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={T.teclea + i * T.porTecla} />
			))}
			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/*
 * EL AVISO DE «NIVELACIÓN REGISTRADA.», con la frase del servidor detrás. Es el `nz-message` de
 * éxito de la planilla, como `notas/Aviso.tsx`, pero en dos renglones: la frase de la regla es larga
 * y a la letra del otro no cabe en el fotograma.
 */
const AvisoLargo: React.FC<{ desde: number; dura: number }> = ({ desde, dura }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame - desde;
	if (t < 0) { return null; }

	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (salida >= 1) { return null; }

	return (
		<div
			style={{
				position: 'absolute',
				top: 26,
				/* Corrido a la derecha para no tapar las migas de arriba a la izquierda. */
				left: 700,
				right: 0,
				display: 'flex',
				justifyContent: 'center',
				transform: `translateY(${interpolate(entrada, [0, 1], [-110, 0]) - salida * 40}px)`,
				opacity: entrada * (1 - salida),
				zIndex: 40,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: '20px 40px',
					borderRadius: 18,
					background: '#fff',
					fontFamily: FUENTE,
					boxShadow: '0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)',
				}}
			>
				<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden>
					<circle cx="12" cy="12" r="11" fill="#52c41a" />
					<path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				<div>
					<div style={{ fontSize: 34, fontWeight: 600, color: TEXTO }}>{TEXTOS.toast}</div>
					<div style={{ fontSize: 26, color: TEXTO_TENUE, marginTop: 4 }}>{EXPLICACION}</div>
				</div>
			</div>
		</div>
	);
};

const ActoDeLlegada: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const academico = entra(frame, fps, LLEGADA.abreAcademico, 16);

	const senalada = frame >= LLEGADA.llegaAcademico && frame < LLEGADA.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= LLEGADA.llegaMisAsignaturas && frame < LLEGADA.pulsaMisAsignaturas + 10
			? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS }
			: null;

	const filaSenalada = frame >= LLEGADA.llegaBoton && frame < LLEGADA.pulsaBoton + 10 ? LA_QUE_SE_ABRE : null;

	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [LLEGADA.seVaLaCascara, LLEGADA.entraLaPlanilla], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
					<Cascara academico={academico} senalada={senalada}>
						<Sequence from={LLEGADA.montaLista}>
							<MisAsignaturas salidaEn={LLEGADA.pulsaBoton - LLEGADA.montaLista} senalada={filaSenalada} />
						</Sequence>
					</Cascara>

					<Cursor
						puntos={[
							{ frame: LLEGADA.cursorEntra, ...PUNTOS_CASCARA.entrada },
							{ frame: LLEGADA.llegaAcademico, ...PUNTOS_CASCARA.academico },
							{ frame: LLEGADA.llegaMisAsignaturas, ...PUNTOS_CASCARA.misAsignaturas },
							{ frame: LLEGADA.llegaBoton - 18, ...PUNTOS_CASCARA.misAsignaturas },
							{ frame: LLEGADA.llegaBoton, ...PUNTOS_CASCARA.botonPlanilla },
						]}
						clics={[LLEGADA.pulsaAcademico, LLEGADA.pulsaMisAsignaturas, LLEGADA.pulsaBoton]}
						aparece={LLEGADA.cursorEntra}
						sale={LLEGADA.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
