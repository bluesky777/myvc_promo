import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra, escrito } from '../../comunes/movimiento';
import { Escena as EscenaPlanilla } from '../../notas/Escena';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaA } from '../no-me-deja-escribir/Llegada';
import { NOTAS_DE_PARTIDA } from '../planilla-nota-rapida/datos';
import { AvisoIndependientes, EstadoBoletin, PantallaBoletin } from './Boletin';
import { AJUSTE, CAJA_AVISO, ENCIMA, ENCUADRE, ENLACE, GEOMETRIA, NUEVA_NOTA, PG, TEXTOS, rectCopiar, rectInterruptor, rectNota } from './datos';
import { Efecto } from '../voz';
import { AVISO, CIERRE, ENTRA, GUARDADA, LLEGADA, PASOS, RITMO_PLANILLA, T, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * BOLETÍN INDEPENDIENTE: la llegada a la planilla, la planilla de siempre con el aviso de arriba
 * (la opción `encima`) y, por su enlace, la pantalla del boletín aparte a pantalla completa.
 */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const EscenaBoletinIndependiente: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;
	const sale = interpolate(frame, [ENTRA + T.pulsaEnlace + 2, ENTRA + T.montaPagina], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <LlegadaA frame={frame} fps={fps} t={LLEGADA} />}
			{frame >= ENTRA && frame < ENTRA + T.montaPagina && (
				<AbsoluteFill style={{ opacity: sale }}>
					<Sequence from={ENTRA}>
						<Planilla />
					</Sequence>
				</AbsoluteFill>
			)}
			<Sequence from={ENTRA}>
				<Pagina />
			</Sequence>
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<AvisoBajoLaCabecera texto={TEXTOS.toast} desde={AVISO.desde} dura={AVISO.dura} />
			{/* Lo que suena: las dos teclas del 75, «Nota guardada» y la respuesta de la aplicación al interruptor. */}
			{[...NUEVA_NOTA].map((_, i) => <Efecto key={`t${i}`} cual={i ? 'tecla2' : 'tecla1'} en={ENTRA + T.teclea + i * 5} />)}
			<Efecto cual="aviso" en={AVISO.desde} />
			<Efecto cual="aviso" en={ENTRA + T.responde} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const ESTADO = () => ({ notas: NOTAS_DE_PARTIDA });

const Planilla: React.FC = () => {
	const f = useCurrentFrame();
	const enlace = centro(ENLACE);
	return (
		<EscenaPlanilla
			ritmo={RITMO_PLANILLA}
			ajuste={AJUSTE}
			quieta
			estado={ESTADO}
			encima={{ alto: ENCIMA, nodo: <AvisoIndependientes alto={CAJA_AVISO.alto} enlaceEncima={f >= T.llegaEnlace - 4} /> }}
			sobre={
				<Cursor
					puntos={[
						{ frame: T.cursorPlanilla, x: GEOMETRIA.ancho - 160, y: GEOMETRIA.alto - 60 },
						{ frame: T.llegaEnlace - 30, x: GEOMETRIA.ancho - 160, y: GEOMETRIA.alto - 60 },
						{ frame: T.llegaEnlace, x: enlace.x - 60, y: enlace.y },
					]}
					clics={[T.pulsaEnlace]}
					aparece={T.cursorPlanilla}
					sale={T.pulsaEnlace + 10}
					tam={30}
				/>
			}
		/>
	);
};

function estadoEn(f: number): EstadoBoletin {
	return {
		nota: f >= T.teclea ? escrito(f, NUEVA_NOTA, T.teclea, 5) : '',
		notaFoco: f >= T.pulsaNota && f < T.sueltaNota,
		guardada: f >= GUARDADA,
		cargando: f >= T.pulsaInterruptor && f < T.responde,
		noPuedo: f >= T.responde,
		copiarEncima: f >= T.llegaCopiar - 4,
	};
}

const Pagina: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (f < T.montaPagina) { return null; }
	const a = entra(f, fps, T.montaPagina, 14);
	const nota = centro(rectNota(1, false));
	const inter = centro(rectInterruptor(false));
	const copiar = centro(rectCopiar(true));
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a }}>
				<PantallaBoletin e={estadoEn(f)} />
				<Cursor
					puntos={[
						{ frame: T.cursorPagina, x: PG.ancho - 220, y: 120 },
						{ frame: T.pulsaNota - 40, x: PG.ancho - 220, y: 120 },
						{ frame: T.pulsaNota - 4, ...nota },
						{ frame: T.teclea - 6, x: nota.x + 60, y: nota.y + 60 },
						{ frame: T.sueltaNota - 24, x: nota.x - 300, y: nota.y + 70 },
						{ frame: T.llegaInterruptor - 70, x: nota.x - 300, y: nota.y + 70 },
						{ frame: T.llegaInterruptor, ...inter },
						{ frame: T.responde + 30, x: inter.x + 260, y: inter.y + 190 },
						{ frame: T.llegaCopiar - 40, x: inter.x + 260, y: inter.y + 190 },
						{ frame: T.llegaCopiar, ...copiar },
					]}
					clics={[T.pulsaNota, T.sueltaNota, T.pulsaInterruptor]}
					aparece={T.cursorPagina}
					sale={T.cursorSale}
					tam={30}
				/>
			</div>
		</AbsoluteFill>
	);
};
