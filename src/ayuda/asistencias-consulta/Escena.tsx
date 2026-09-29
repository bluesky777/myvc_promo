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
import { EstadoAsistencias, PanelAsistencias, SinGrupo } from './Asistencias';
import { ENCUADRE, ENTRADA_ASISTENCIAS, HOY, MATEO, PG, rectContador } from './datos';
import { CIERRE, ENTRA, LLEGADA, PANEL, PASOS, PUNTOS_LLEGADA, RELEVO, TARJETA, VUELVE } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ASISTENCIAS: la llegada por Disciplina ▸ Asistencias dentro de la cáscara, la página sin grupo, y
 * al pulsar 9B la cáscara se acerca y se apaga para dejar la tabla a pantalla completa. El periodo
 * cerrado es un segundo panel que se enciende encima (con el aviso, la tabla baja: no se anima).
 */

export const EscenaAsistenciasConsulta: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && <EnLaCascara frame={frame} fps={fps} />}

			<Sequence from={ENTRA}>
				<Paneles />
			</Sequence>

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Efecto cual="tecla1" en={ENTRA + PANEL.tecla} />
			<Efecto cual="aviso" en={ENTRA + PANEL.cierra} />
			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const t = LLEGADA;
	const abierta = entra(frame, fps, t.pulsaSeccion + 2, 16);
	const senalada = frame >= t.llegaSeccion && frame < t.pulsaSeccion + 10
		? { seccion: ENTRADA_ASISTENCIAS.seccion, hija: null }
		: frame >= t.llegaEntrada && frame < t.pulsaEntrada + 10 ? ENTRADA_ASISTENCIAS : null;
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraPanel], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
					<Cascara abierta={{ seccion: ENTRADA_ASISTENCIAS.seccion, t: abierta }} senalada={senalada}>
						{frame >= t.montaPagina && (
							<Sequence from={t.montaPagina}>
								<SinGrupo senalado={frame >= t.llegaGrupo && frame < t.pulsaGrupo} puesto={frame >= t.pulsaGrupo} />
							</Sequence>
						)}
					</Cascara>
					<Cursor
						puntos={[
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaSeccion, ...PUNTOS_LLEGADA.seccion },
							{ frame: t.llegaEntrada, ...PUNTOS_LLEGADA.hija },
							{ frame: t.llegaGrupo - 60, ...PUNTOS_LLEGADA.hija },
							{ frame: t.llegaGrupo, ...PUNTOS_LLEGADA.grupo },
						]}
						clics={[t.pulsaSeccion, t.pulsaEntrada, t.pulsaGrupo]}
						aparece={t.cursorEntra}
						sale={t.pulsaGrupo + 12}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

function estadoEn(f: number, cerrado: boolean): EstadoAsistencias {
	const escribe = f >= PANEL.pulsaContador && f < VUELVE + 10;
	return {
		cerrado,
		contador: escribe ? { fila: MATEO, valor: f >= PANEL.tecla ? '1' : '0', foco: f < VUELVE + 10 } : null,
		nuevas: f >= VUELVE ? [{ fila: MATEO, ficha: { fecha: HOY } }] : [],
	};
}

const Paneles: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);
	const b = interpolate(f, [PANEL.cierra, PANEL.cierra + RELEVO], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const caja = (hijos: React.ReactNode, opacidad: number) => (
		<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: opacidad }}>
			{hijos}
		</div>
	);
	const c = rectContador(MATEO, 2, false);
	const centro = { x: c.x + c.ancho / 2, y: c.y + c.alto / 2 };

	return (
		<AbsoluteFill>
			{f < PANEL.cierra + RELEVO && caja(
				<>
					<PanelAsistencias e={estadoEn(f, false)} />
					<Cursor
						puntos={[
							{ frame: PANEL.cursorEntra, x: PG.ancho - 240, y: 700 },
							{ frame: PANEL.llegaContador - 70, x: PG.ancho - 240, y: 700 },
							{ frame: PANEL.llegaContador, ...centro },
							{ frame: PANEL.pulsaContador + 14, ...centro },
							{ frame: PANEL.tecla + 20, x: centro.x + 150, y: centro.y + 90 },
						]}
						clics={[PANEL.pulsaContador]}
						aparece={PANEL.cursorEntra}
						sale={PANEL.cursorSale}
						tam={36}
					/>
				</>,
				a,
			)}
			{f >= PANEL.cierra && caja(<PanelAsistencias e={estadoEn(f, true)} />, b)}
		</AbsoluteFill>
	);
};
