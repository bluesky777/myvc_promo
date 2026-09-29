import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { Escena as EscenaPlanilla } from '../../notas/Escena';
import { Aviso } from '../../notas/Aviso';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { BUSQUEDA } from './datos';
import { Franja } from './Franja';
import { Llegada } from './Llegada';
import { AJUSTE, ENCIMA, EN_EL_PANEL, GEOMETRIA, QUIZ, VALENTINA, estadoEn } from './datos';
import { AVISOS, AVISO_DURA, CIERRE, ENTRA, LLEGADA, PASOS, PLANILLA, RITMO_RAPIDA, TARJETA, TIEMPOS } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA NOTA RÁPIDA: encadena, no dibuja. La llegada es la de los vídeos de la planilla; la planilla es
 * `notas/Escena`, la misma de siempre, con la franja de la nota rápida encima y las notas contadas
 * por la máquina de `datos.ts`. El puntero va DENTRO del panel, en sus coordenadas.
 */

export const EscenaNotaRapida: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <Llegada frame={frame} fps={fps} t={LLEGADA} />}

			<Sequence from={ENTRA}>
				<EscenaPlanilla
					ritmo={RITMO_RAPIDA}
					ajuste={AJUSTE}
					quieta
					estado={(f) => {
						const e = estadoEn(TIEMPOS, f);
						return { ...e, senalada: senaladaEn(f) };
					}}
					encima={{ alto: ENCIMA.alto, nodo: <Franja t={TIEMPOS} /> }}
					sobre={<Puntero />}
				/>
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={AVISO_DURA + 20}>
					<Aviso texto={a.texto} desde={0} dura={AVISO_DURA} />
				</Sequence>
			))}

			{/* Lo que suena: el 0 y la búsqueda se teclean, y cada lote trae su aviso. */}
			<Efecto cual="tecla1" en={ENTRA + PLANILLA.tecleaCero} />
			{[...BUSQUEDA].map((_, i) => (
				<Efecto key={`b${i}`} cual={(['tecla2', 'tecla3', 'tecla1'] as const)[i % 3]} en={ENTRA + TIEMPOS.busca!.empieza + i * TIEMPOS.busca!.porTecla} />
			))}
			{AVISOS.map((a) => <Efecto key={`a${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/* ── El puntero, en coordenadas del panel y en fotogramas locales de la planilla ───────────── */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

const P = {
	entrada: { x: GEOMETRIA.ancho - 140, y: GEOMETRIA.alto - 70 },
	interruptor: { x: EN_EL_PANEL.interruptor.x + 12, y: EN_EL_PANEL.interruptor.y + EN_EL_PANEL.interruptor.alto / 2 },
	valor: centro(EN_EL_PANEL.campoValor),
	buscador: { x: EN_EL_PANEL.buscador.x + 150, y: EN_EL_PANEL.buscador.y + EN_EL_PANEL.buscador.alto / 2 },
	casilla: centro(GEOMETRIA.casilla(VALENTINA, QUIZ)),
	cabecera: centro(GEOMETRIA.cabecera(QUIZ)),
	nombre: { x: GEOMETRIA.celda(VALENTINA, 'alumno').x + 250, y: centro(GEOMETRIA.celda(VALENTINA, 'alumno')).y },
};
/** Apartado de la casilla, para no tapar lo que se escribe en ella. */
const APARTE = { x: P.casilla.x + 70, y: P.casilla.y + 44 };

const T = PLANILLA;

/** Los ratos en que el ratón está encima de la casilla de Valentina, con la nota rápida puesta. */
const ENCIMA_DE_LA_CASILLA: [number, number][] = [
	[T.borra - 14, T.borra + 16],
	[T.deshaceBorrar - 10, T.deshaceBorrar + 18],
	[T.pone0 - 12, T.pone0 + 16],
	[T.deshace0 - 6, T.deshace0 + 18],
];

function senaladaEn(f: number) {
	return ENCIMA_DE_LA_CASILLA.some(([a, b]) => f >= a && f < b) ? { fila: VALENTINA, columna: QUIZ } : null;
}

const Puntero: React.FC = () => (
	<Cursor
		puntos={[
			{ frame: T.cursorEntra, ...P.entrada },
			{ frame: T.activa - 10, ...P.interruptor },
			{ frame: T.borra - 62, ...P.interruptor },
			{ frame: T.borra - 12, ...P.casilla },
			{ frame: T.borra + 18, ...APARTE },
			{ frame: T.deshaceBorrar - 20, ...APARTE },
			{ frame: T.deshaceBorrar - 8, ...P.casilla },
			{ frame: T.deshaceBorrar + 20, ...APARTE },
			{ frame: T.pulsaValor - 30, ...APARTE },
			{ frame: T.pulsaValor - 7, ...P.valor },
			{ frame: T.pone0 - 30, ...P.valor },
			{ frame: T.pone0 - 10, ...P.casilla },
			{ frame: T.pone0 + 18, ...APARTE },
			{ frame: T.deshace0 - 16, ...APARTE },
			{ frame: T.deshace0 - 5, ...P.casilla },
			{ frame: T.deshace0 + 20, ...APARTE },
			{ frame: T.pulsaBuscador - 30, ...APARTE },
			{ frame: T.pulsaBuscador - 7, ...P.buscador },
			{ frame: T.cabecera - 50, ...P.buscador },
			{ frame: T.cabecera - 18, ...P.cabecera },
			{ frame: T.borraBusqueda - 40, ...P.cabecera },
			{ frame: T.borraBusqueda - 14, ...P.buscador },
			{ frame: T.borraBusqueda + 20, ...P.buscador },
			{ frame: T.borraBusqueda + 40, ...P.nombre },
		]}
		clics={[T.activa, T.borra, T.deshaceBorrar, T.pulsaValor, T.pone0, T.deshace0, T.pulsaBuscador, T.cabecera, T.deshaceCabecera, T.borraBusqueda - 6]}
		aparece={T.cursorEntra}
		sale={T.cursorSale}
		tam={30}
	/>
);
