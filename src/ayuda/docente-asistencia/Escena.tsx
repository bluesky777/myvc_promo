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
import { Llegada } from '../planilla-nota-rapida/Llegada';
import { NOTAS_DE_PARTIDA } from '../planilla-nota-rapida/datos';
import { AvisoDePeriodo, CeldaDeFalta } from './Faltas';
import { AJUSTE, ANCHOS, ENCIMA_CERRADA, GEOMETRIA } from './datos';
import {
	ANOTACIONES, AVISOS, AVISO_DURA, CERRADA, CIERRE, ENTRA, ENTRA_CERRADA, LLEGADA, PASOS, PLANILLA,
	PUNTOS, RITMO_ASISTENCIA, RITMO_CERRADA, TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PASAR ASISTENCIA: la llegada de los vídeos de la planilla, la planilla de siempre con Aus y Tard
 * dibujadas como en app2 (número y botones de fecha), y un segundo plano con el periodo cerrado.
 * El puntero de cada plano va dentro del panel, en sus coordenadas.
 */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const EscenaAsistencia: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <Llegada frame={frame} fps={fps} t={LLEGADA} />}

			{frame < ENTRA_CERRADA && (
				<Sequence from={ENTRA}>
					<EscenaPlanilla
						ritmo={RITMO_ASISTENCIA}
						ajuste={AJUSTE}
						quieta
						anchos={ANCHOS}
						estado={LAS_NOTAS}
						falta={(fila, c) => <CeldaDeFalta fila={fila} cual={c} anotaciones={ANOTACIONES} />}
						sobre={<PunteroAbierta />}
					/>
				</Sequence>
			)}

			<Sequence from={ENTRA_CERRADA}>
				<EscenaPlanilla
					ritmo={RITMO_CERRADA}
					ajuste={AJUSTE}
					quieta
					cerrada
					anchos={ANCHOS}
					estado={LAS_NOTAS}
					encima={{ alto: ENCIMA_CERRADA, nodo: <AvisoDePeriodo alto={ENCIMA_CERRADA} /> }}
					falta={(fila, c) => <CeldaDeFalta fila={fila} cual={c} anotaciones={YA_ANOTADAS} apagada />}
					sobre={<PunteroCerrada />}
				/>
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			{AVISOS.map((a) => (
				<Sequence key={a.desde} from={a.desde} durationInFrames={AVISO_DURA + 20}>
					<Aviso texto={a.texto} desde={0} dura={AVISO_DURA} />
				</Sequence>
			))}

			{ANOTACIONES.map((a, i) => <Efecto key={`t${i}`} cual={i % 2 === 0 ? 'tecla1' : 'tecla2'} en={ENTRA + a.teclea} />)}
			{AVISOS.map((a) => <Efecto key={`a${a.desde}`} cual="aviso" en={a.desde} />)}

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/** Las notas son las que dejó `planilla-teclear`: aquí no se tocan. */
const LAS_NOTAS = () => ({ notas: NOTAS_DE_PARTIDA });

/** Otro día: las dos faltas de hoy ya están, con su botón, y sin nada a medias. */
const YA_ANOTADAS = ANOTACIONES.map((a) => ({ ...a, pulsa: -1000, teclea: -1000, suelta: -1000, vuelve: -1000 }));

const [TOMAS_A, MARIANA_A] = ANOTACIONES;
/** Un sitio que no es nada --a la derecha del título--: el clic ahí sólo quita el foco de la casilla. */
const FUERA = { x: GEOMETRIA.ancho - 260, y: 52 };

const PunteroAbierta: React.FC = () => {
	const tomas = centro(PUNTOS.ausDeTomas);
	const mariana = centro(PUNTOS.tardDeMariana);
	const boton = centro(PUNTOS.botonDeTomas);
	return (
		<Cursor
			puntos={[
				{ frame: PLANILLA.cursorEntra, x: GEOMETRIA.ancho - 120, y: GEOMETRIA.alto - 40 },
				{ frame: TOMAS_A.pulsa - 12, ...tomas },
				{ frame: TOMAS_A.suelta - 50, x: tomas.x + 20, y: tomas.y + 36 },
				{ frame: TOMAS_A.suelta - 8, ...FUERA },
				{ frame: MARIANA_A.pulsa - 40, ...FUERA },
				{ frame: MARIANA_A.pulsa - 10, ...mariana },
				{ frame: MARIANA_A.suelta - 32, x: mariana.x + 20, y: mariana.y + 36 },
				{ frame: MARIANA_A.suelta - 6, ...FUERA },
				{ frame: MARIANA_A.suelta + 70, ...FUERA },
				{ frame: MARIANA_A.suelta + 100, x: boton.x + 6, y: boton.y + 4 },
			]}
			clics={[TOMAS_A.pulsa, TOMAS_A.suelta, MARIANA_A.pulsa, MARIANA_A.suelta]}
			aparece={PLANILLA.cursorEntra}
			sale={PLANILLA.cursorSale}
			tam={30}
		/>
	);
};

const PunteroCerrada: React.FC = () => {
	const aus = centro(PUNTOS.ausCerrada);
	const boton = centro(PUNTOS.botonCerrado);
	return (
		<Cursor
			puntos={[
				{ frame: CERRADA.cursorEntra, x: GEOMETRIA.ancho - 120, y: GEOMETRIA.alto },
				{ frame: CERRADA.pulsaAus - 10, ...aus },
				{ frame: CERRADA.pulsaAus + 16, ...aus },
				{ frame: CERRADA.pulsaBoton - 8, ...boton },
				{ frame: CERRADA.pulsaBoton + 60, x: boton.x + 30, y: boton.y + 40 },
			]}
			clics={[CERRADA.pulsaAus, CERRADA.pulsaBoton]}
			aparece={CERRADA.cursorEntra}
			sale={CERRADA.cursorSale}
			tam={30}
		/>
	);
};
