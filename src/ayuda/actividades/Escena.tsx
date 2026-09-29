import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { MEDIDAS } from '../medidas';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { Bandeja, Entregas, Resultados } from './Pantallas';
import { CUESTIONARIO, ENCUADRE, MARIANA, NOTA_DE_MARIANA, PG, TAREA, rectCampoNota, rectFila, rectFilaEntrega, rectVolver } from './datos';
import { CIERRE, ELIGE_MARIANA, ENTRA, ENTREGAS_, HIJA, LLEGADA, MENU, PASOS, PUNTOS_LLEGADA, RESULTADOS_, SECCION, T, TARJETA, VUELVE_BANDEJA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ACTIVIDADES: el menú del docente, y al pulsar la entrada `/act` acercada. Las tres pantallas
 * (bandeja, resultados, entregas) van en el mismo panel, que no se mueve: cambia lo de dentro, como
 * al navegar en la aplicación.
 */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const EscenaActividades: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <EnLaCascara frame={frame} fps={fps} />}
			<Sequence from={ENTRA}>
				<Panel />
			</Sequence>
			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const t = LLEGADA;
	const abierta = entra(frame, fps, t.abreAcademico, 16);
	const senalada = frame >= t.llegaAcademico && frame < t.pulsaAcademico + 10
		? { seccion: SECCION, hija: null }
		: frame >= t.llegaHija && frame < t.pulsaHija + 10 ? { seccion: SECCION, hija: HIJA } : null;
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraPanel], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ORIGEN.x, top: ORIGEN.y, width: MEDIDAS.ancho * ESCALA_CASCARA, height: MEDIDAS.alto * ESCALA_CASCARA, transformOrigin: '50% 45%', transform: `scale(${1 + seVa * 0.07})`, opacity: aparece * (1 - seVa) }}>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU} abierta={{ seccion: SECCION, t: abierta }} senalada={senalada} />
					<Cursor
						puntos={[
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaAcademico, ...PUNTOS_LLEGADA.academico },
							{ frame: t.llegaHija, ...PUNTOS_LLEGADA.hija },
						]}
						clics={[t.pulsaAcademico, t.pulsaHija]}
						aparece={t.cursorEntra}
						sale={t.pulsaHija + 4}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Panel: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);
	const cuestionario = rectFila(CUESTIONARIO);
	const tarea = rectFila(TAREA);
	const volver = centro(rectVolver());
	const enCuestionario = { x: cuestionario.x + 260, y: centro(cuestionario).y };
	const enTarea = { x: tarea.x + 260, y: centro(tarea).y };
	const mariana = rectFilaEntrega(MARIANA);
	const enMariana = { x: mariana.x + 200, y: centro(mariana).y };
	const nota = centro(rectCampoNota());

	let pantalla: React.ReactNode;
	if (f < RESULTADOS_ || (f >= VUELVE_BANDEJA && f < ENTREGAS_)) {
		const encima = f >= T.llegaCuestionario - 4 && f < RESULTADOS_ ? CUESTIONARIO : f >= T.llegaTarea - 4 && f < ENTREGAS_ ? TAREA : null;
		pantalla = <Bandeja encima={encima} />;
	} else if (f < VUELVE_BANDEJA) {
		pantalla = <Resultados volverEncima={f >= T.llegaVolver - 4} />;
	} else {
		const tecleadas = T.teclas.filter((t) => f >= t).length;
		pantalla = (
			<Entregas
				elegida={f >= ELIGE_MARIANA ? MARIANA : 0}
				filaEncima={f >= T.llegaMariana - 4 && f < ELIGE_MARIANA ? MARIANA : null}
				nota={NOTA_DE_MARIANA.slice(0, tecleadas)}
				notaActiva={f >= T.pulsaNota}
			/>
		);
	}

	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a }}>
				{pantalla}
				<Cursor
					puntos={[
						{ frame: T.cursorEntra, x: PG.ancho - 300, y: 700 },
						{ frame: T.llegaCuestionario - 70, x: PG.ancho - 300, y: 700 },
						{ frame: T.llegaCuestionario, ...enCuestionario },
						{ frame: T.pulsaCuestionario + 20, ...enCuestionario },
						{ frame: T.llegaVolver - 60, x: volver.x + 160, y: volver.y + 180 },
						{ frame: T.llegaVolver, ...volver },
						{ frame: T.pulsaVolver + 20, ...volver },
						{ frame: T.llegaTarea - 50, x: enTarea.x + 300, y: enTarea.y + 200 },
						{ frame: T.llegaTarea, ...enTarea },
						{ frame: T.pulsaTarea + 20, ...enTarea },
						{ frame: T.llegaMariana - 60, x: enMariana.x + 240, y: enMariana.y - 120 },
						{ frame: T.llegaMariana, ...enMariana },
						{ frame: T.pulsaMariana + 16, ...enMariana },
						{ frame: T.llegaNota, ...nota },
						{ frame: T.pulsaNota + 40, ...nota },
						{ frame: T.cursorSale, x: nota.x + 320, y: nota.y + 150 },
					]}
					clics={[T.pulsaCuestionario, T.pulsaVolver, T.pulsaTarea, T.pulsaMariana, T.pulsaNota]}
					aparece={T.cursorEntra}
					sale={T.cursorSale}
					tam={32}
				/>
			</div>
			{T.teclas.map((t, i) => <Efecto key={t} cual={i % 2 === 0 ? 'tecla1' : 'tecla2'} en={t} />)}
		</AbsoluteFill>
	);
};
