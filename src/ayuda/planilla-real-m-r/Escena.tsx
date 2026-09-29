import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { DefinitivaEnFila, Escena as EscenaPlanilla } from '../../notas/Escena';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaA } from '../no-me-deja-escribir/Llegada';
import { NOTAS_DE_PARTIDA } from '../planilla-nota-rapida/datos';
import { AvisoInfo } from '../no-me-deja-escribir/AvisoInfo';
import { AJUSTE, ANCHOS, AVISO_NIVELANDO, CAJA_AVISO, ENCIMA, GEOMETRIA, REAL_DE_PARTIDA, SAMUEL, TECLAS } from './datos';
import { Efecto } from '../voz';
import { AVISOS, CIERRE, ENTRA, LLEGADA, PASOS, PLANILLA, RITMO_REAL, TARJETA, VUELVE_M, VUELVE_REAL } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * TOTAL, REAL, M Y R: encadena, no dibuja. La llegada de los vídeos de la planilla y la planilla de
 * siempre con la opción `definitivas` (Real, M y R entre el Total y Aus), las notas apagadas por el
 * tramo «Nivelando» y el aviso de arriba. El puntero va DENTRO del panel, en sus coordenadas.
 */

export const EscenaRealMR: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <LlegadaA frame={frame} fps={fps} t={LLEGADA} />}

			<Sequence from={ENTRA}>
				<EscenaPlanilla
					ritmo={RITMO_REAL}
					ajuste={AJUSTE}
					quieta
					cerrada
					anchos={ANCHOS}
					estado={ESTADO}
					encima={{ alto: ENCIMA, nodo: <AvisoInfo alto={CAJA_AVISO.alto} texto={AVISO_NIVELANDO} /> }}
					definitivas={DefinitivaEn}
					sobre={<Puntero />}
				/>
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => <AvisoBajoLaCabecera key={a.desde} texto={a.texto} desde={a.desde} dura={a.dura} />)}

			{/* Lo que suena: las cuatro teclas de la Real y los dos avisos. */}
			{TECLAS.map((_, i) => <Efecto key={`t${i}`} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={ENTRA + PLANILLA.teclea + i * PLANILLA.porTecla} />)}
			{AVISOS.map((a) => <Efecto key={`a${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const ESTADO = () => ({ notas: NOTAS_DE_PARTIDA });

/* ── Real, M y R de cada fila, en fotogramas locales ──────────────────────────────────────── */

const T = PLANILLA;

/** Lo que se ve en la Real de Samuel: su 73 hasta la primera tecla, y luego lo tecleado. */
function realDeSamuel(f: number): string {
	if (f < T.teclea) { return REAL_DE_PARTIDA[SAMUEL]; }
	const i = Math.min(TECLAS.length - 1, Math.floor((f - T.teclea) / T.porTecla));
	return TECLAS[i];
}

/** Lo que hay en Real, M y R de una fila en el fotograma local `f`. */
function DefinitivaEn(fila: number, f: number): DefinitivaEnFila {
	if (fila !== SAMUEL) { return { real: REAL_DE_PARTIDA[fila], m: false, r: false }; }

	const manual = f >= VUELVE_REAL && f < VUELVE_M;
	const senalada = f >= T.llegaR - 4 && f < T.llegaM - 30 ? 'r' : f >= T.llegaM - 4 && f < T.pulsaM + 12 ? 'm' : null;

	return {
		real: realDeSamuel(f),
		m: manual,
		r: false,
		foco: f >= T.pulsaReal && f < VUELVE_REAL + 20,
		aro: { desde: T.teclea, confirma: VUELVE_REAL },
		senalada,
	};
}

/* ── El puntero, en coordenadas del panel ─────────────────────────────────────────────────── */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

const P = {
	entrada: { x: GEOMETRIA.ancho - 160, y: GEOMETRIA.alto - 50 },
	real: centro(GEOMETRIA.celda(SAMUEL, 'real')),
	m: centro(GEOMETRIA.celda(SAMUEL, 'm')),
	r: centro(GEOMETRIA.celda(SAMUEL, 'r')),
};
/** Apartado de la Real, para no tapar lo que se escribe. */
const APARTE = { x: P.real.x + 40, y: P.real.y + 90 };

const Puntero: React.FC = () => (
	<Cursor
		puntos={[
			{ frame: T.cursorEntra, ...P.entrada },
			{ frame: T.llegaReal - 150, ...P.entrada },
			{ frame: T.llegaReal, ...P.real },
			{ frame: T.pulsaReal + 14, ...P.real },
			{ frame: T.teclea - 10, ...APARTE },
			{ frame: T.llegaR - 40, ...APARTE },
			{ frame: T.llegaR, ...P.r },
			{ frame: T.llegaM - 30, ...P.r },
			{ frame: T.llegaM, ...P.m },
			{ frame: T.pulsaM + 14, ...P.m },
			{ frame: T.cursorSale, x: P.m.x + 60, y: P.m.y + 140 },
		]}
		clics={[T.pulsaReal, T.pulsaM]}
		aparece={T.cursorEntra}
		sale={T.cursorSale}
		tam={30}
	/>
);
