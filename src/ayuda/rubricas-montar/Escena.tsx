import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { Efecto } from '../voz';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { LlegadaA } from '../no-me-deja-escribir/Llegada';
import { PantallaRubricas } from './Rubricas';
import { ENCUADRE, LA_DE_RUBRICAS, NUEVA, TEXTOS, centro } from './datos';
import { AVISO_GUARDADA, BOTON_RUBRICAS, CIERRE, ENTRA, LLEGADA, PASOS, T, TARJETA } from './guion';
import { CLICS, estadoEn, puntosDelPuntero } from './estado';
import { CORRECCION, POR_LETRA, POR_LETRA_DESCRIPTOR } from './tiempo';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * RÚBRICAS, MONTAR: encadena. La llegada por Mis asignaturas (fila de 9°A, botón «Rúbricas»), y la
 * pantalla de rúbricas a pantalla completa, con el estado de cada fotograma de `estado.ts`.
 */

export const EscenaRubricasMontar: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <LlegadaA frame={frame} fps={fps} t={LLEGADA} boton={centro(BOTON_RUBRICAS)} fila={LA_DE_RUBRICAS} />}

			<Sequence from={ENTRA}>
				<Pantalla />
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<AvisoBajoLaCabecera texto={TEXTOS.toastGuardada} desde={AVISO_GUARDADA.desde} dura={AVISO_GUARDADA.dura} tipo="info" />
			<Efecto cual="aviso" en={AVISO_GUARDADA.desde} />

			<Sequence from={ENTRA} layout="none">
				<Tecleos />
			</Sequence>

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const PUNTOS = puntosDelPuntero();

/* El tecleo: una tecla por letra, al ritmo al que `estado.ts` escribe cada cosa (`escrito` pone la primera letra un golpe después; los números, en seguida y a una cada 5). */
const TECLAS = ['tecla1', 'tecla2', 'tecla3'] as const;
const Tecleo: React.FC<{ texto: string; desde: number; porLetra: number }> = ({ texto, desde, porLetra }) => (
	<>
		{[...texto].map((c, i) => (c === ' ' ? null : <Efecto key={i} cual={TECLAS[i % 3]} en={desde + i * porLetra} />))}
	</>
);

const Tecleos: React.FC = () => (
	<>
		<Tecleo texto={NUEVA.nombre} desde={T.tecleaNombre + POR_LETRA} porLetra={POR_LETRA} />
		{NUEVA.criterios.map((c, i) => (
			<React.Fragment key={i}>
				<Tecleo texto={c.definicion} desde={T.tecleaDef[i] + POR_LETRA} porLetra={POR_LETRA} />
				<Tecleo texto={c.peso} desde={T.tecleaPeso[i]} porLetra={5} />
			</React.Fragment>
		))}
		<Tecleo texto={'x'.repeat(CORRECCION.length)} desde={T.corrige} porLetra={5} />
		{T.tecleaCelda.map((d, j) => <Tecleo key={j} texto={NUEVA.descriptores[j]} desde={d + POR_LETRA_DESCRIPTOR} porLetra={POR_LETRA_DESCRIPTOR} />)}
	</>
);

const Pantalla: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ENCUADRE.x,
					top: ENCUADRE.y,
					transformOrigin: '0 0',
					transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`,
					opacity: a,
				}}
			>
				<PantallaRubricas estado={estadoEn(f)} />
				<Cursor puntos={PUNTOS} clics={CLICS} aparece={T.cursorEntra} sale={T.cursorSale} tam={36} />
			</div>
		</AbsoluteFill>
	);
};
