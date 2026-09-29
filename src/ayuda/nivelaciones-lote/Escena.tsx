import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra, escrito } from '../../comunes/movimiento';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { LlegadaA } from '../no-me-deja-escribir/Llegada';
import { PlanillaNivelacion } from '../cierre-3/PlanillaNivelacion';
import { ENCUADRE_PL } from '../cierre-3/datos';
import { EstadoNivelaciones, PantallaNivelaciones } from './Nivelaciones';
import { ACTIVIDAD, ENCUADRE, ENLACE_EN_PLANILLA, NIVELACION, PG, TEXTOS, rectBoton, rectCampo } from './datos';
import { AVISO, CIERRE, ENTRA, LLEGADA, PASOS, POR_LETRA, T, TARJETA, VUELVE } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * NIVELACIONES EN LOTE: la llegada a la planilla, la planilla de la semana de nivelaciones de
 * `cierre-3` (con su aviso y el «Modo nivelación» sin marcar) y, por su enlace, la lista del grupo
 * a pantalla completa.
 */

export const EscenaNivelacionesLote: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const seVaLaPlanilla = interpolate(frame, [ENTRA + T.pulsaEnlace + 4, ENTRA + T.montaLista], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <LlegadaA frame={frame} fps={fps} t={LLEGADA} />}

			{frame >= ENTRA && frame < ENTRA + T.montaLista && (
				<>
					<PlanillaNivelacion monta={ENTRA} modoDesde={1e9} niveladaDesde={1e9} encima={false} seVa={seVaLaPlanilla} />
					<CursorDeLaPlanilla />
				</>
			)}

			<Sequence from={ENTRA}>
				<Lista />
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto={TEXTOS.toast} desde={AVISO.desde} dura={AVISO.dura} />

			{/* Lo que suena: el 85, la actividad (una tecla cada tres fotogramas) y el aviso del registro. */}
			{[[T.teclaNivelacion, NIVELACION.length * 5, 5], [T.teclaActividad, ACTIVIDAD.length * POR_LETRA, POR_LETRA]].flatMap(([desde, dura, cada], j) =>
				Array.from({ length: Math.ceil(dura / cada) }, (_, i) => <Efecto key={`t${j}-${i}`} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={ENTRA + desde + i * cada} />),
			)}
			<Efecto cual="aviso" en={AVISO.desde} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/* El puntero de la planilla va en coordenadas del fotograma: el enlace se señala donde se ve. */
const CursorDeLaPlanilla: React.FC = () => {
	const e = ENCUADRE_PL;
	const enlace = { x: ENLACE_EN_PLANILLA.x + 90, y: ENLACE_EN_PLANILLA.y + ENLACE_EN_PLANILLA.alto / 2 };
	return (
		<Cursor
			puntos={[
				{ frame: ENTRA + T.cursorEntra, x: e.x + 1300 * e.escala, y: e.y + 700 * e.escala },
				{ frame: ENTRA + T.llegaEnlace, ...enlace },
			]}
			clics={[ENTRA + T.pulsaEnlace]}
			aparece={ENTRA + T.cursorEntra}
			sale={ENTRA + T.pulsaEnlace + 10}
			tam={30}
		/>
	);
};

function estadoEn(f: number): EstadoNivelaciones {
	return {
		nivelacion: escrito(f, NIVELACION, T.teclaNivelacion, 5),
		actividad: escrito(f, ACTIVIDAD, T.teclaActividad, POR_LETRA),
		foco: f >= T.pulsaNivelacion && f < T.pulsaActividad ? 'nivelacion' : f >= T.pulsaActividad && f < T.llegaBoton - 30 ? 'actividad' : null,
		registrada: f >= VUELVE,
		botonEncima: f >= T.llegaBoton - 4 && f < T.pulsaBoton + 10,
	};
}

const Lista: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (f < T.montaLista) { return null; }
	const a = entra(f, fps, T.montaLista, 14);
	const c = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
	const niv = rectCampo(1, 'nivelacion');
	const act = rectCampo(1, 'actividad');
	const b = rectBoton();
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a }}>
				<PantallaNivelaciones e={estadoEn(f)} />
				<Cursor
					puntos={[
						{ frame: T.cursorLista, x: PG.ancho - 260, y: 120 },
						{ frame: T.pulsaNivelacion - 40, x: PG.ancho - 260, y: 120 },
						{ frame: T.pulsaNivelacion - 4, ...c(niv) },
						{ frame: T.teclaNivelacion - 4, x: niv.x + niv.ancho / 2 + 30, y: niv.y + niv.alto + 40 },
						{ frame: T.pulsaActividad - 6, x: act.x + 120, y: c(act).y },
						{ frame: T.teclaActividad + 10, x: act.x + act.ancho - 40, y: act.y + act.alto + 40 },
						{ frame: T.llegaBoton - 50, x: act.x + act.ancho - 40, y: act.y + act.alto + 40 },
						{ frame: T.llegaBoton, ...c(b) },
						{ frame: T.pulsaBoton + 16, ...c(b) },
						{ frame: T.cursorSale, x: b.x + b.ancho / 2, y: b.y + 170 },
					]}
					clics={[T.pulsaNivelacion, T.pulsaActividad, T.pulsaBoton]}
					aparece={T.cursorLista}
					sale={T.cursorSale}
					tam={30}
				/>
			</div>
		</AbsoluteFill>
	);
};
