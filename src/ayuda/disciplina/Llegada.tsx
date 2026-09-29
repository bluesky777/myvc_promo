import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { conPausas } from './pausas';
import { Cursor, type Punto } from '../../comunes/Cursor';
import { entra, escribiendo, escrito, seVa } from '../../comunes/movimiento';
import { BORDE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { MEDIDAS, SECCIONES, alturaEnMenu } from '../medidas';
import { Boton, BotonDeGrupo, IconoLista, IconoTabla } from './Rejilla';
import { DISCIPLINA, ENTRADA_DISCIPLINA, GRUPOS, SIN_GRUPO, botonDeGrupoEnCascara } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA LLEGADA A «DISCIPLINA», común a los tres vídeos de la rejilla: menú → Disciplina → la entrada
 * Disciplina → la página sin grupo → se pulsa 9B, y la cáscara se acerca y se apaga (como en la
 * planilla) para dejar sitio a la rejilla a pantalla completa.
 *
 * LA PÁGINA SIN GRUPO ES LA DE VERDAD: título «Seleccione grupo», la fila de grupos, «Elija un grupo
 * para ver su disciplina.» y el pie con «Situaciones por grupo» y «Elija un grupo para ver sus
 * observadores.» --los observadores no están apagados: no se pintan--.
 */

export interface TiemposDeLlegada {
	cursorEntra: number;
	llegaSeccion: number;
	pulsaSeccion: number;
	llegaEntrada: number;
	pulsaEntrada: number;
	montaPagina: number;
	llegaGrupo: number;
	pulsaGrupo: number;
	seVaLaCascara: number;
	entraLaRejilla: number;
	/** Puntos de más del puntero entre la entrada y el grupo (para detenerse en algo). */
	pausas?: Punto[];
}

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const PUNTOS_LLEGADA = {
	entrada: { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 },
	seccion: { x: 150, y: alturaEnMenu(SECCIONES, DISCIPLINA.seccion, null, null) + MEDIDAS.seccion / 2 },
	hija: { x: 150, y: alturaEnMenu(SECCIONES, ENTRADA_DISCIPLINA.seccion, ENTRADA_DISCIPLINA.hija, DISCIPLINA.seccion) + MEDIDAS.hija / 2 },
	grupo: centro(botonDeGrupoEnCascara(GRUPOS.findIndex((g) => g.abrev === '9B'))),
};

export const LlegadaADisciplina: React.FC<{ t: TiemposDeLlegada }> = ({ t }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame >= t.entraLaRejilla) { return null; }

	const abierta = entra(frame, fps, t.pulsaSeccion + 2, 16);
	const senalada = frame >= t.llegaSeccion && frame < t.pulsaSeccion + 10
		? { seccion: DISCIPLINA.seccion, hija: null }
		: frame >= t.llegaEntrada && frame < t.pulsaEntrada + 10
			? ENTRADA_DISCIPLINA
			: null;

	const aparece = entra(frame, fps, 0, 14);
	const seVaYa = interpolate(frame, [t.seVaLaCascara, t.entraLaRejilla], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
					transform: `scale(${1 + seVaYa * 0.07})`,
					opacity: aparece * (1 - seVaYa),
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara abierta={{ seccion: DISCIPLINA.seccion, t: abierta }} senalada={senalada}>
						{frame >= t.montaPagina && (
							<Sequence from={t.montaPagina}>
								<SinGrupo
									senalado={frame >= t.llegaGrupo && frame < t.pulsaGrupo}
									puesto={frame >= t.pulsaGrupo}
								/>
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={conPausas([
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaSeccion, ...PUNTOS_LLEGADA.seccion },
							{ frame: t.llegaEntrada, ...PUNTOS_LLEGADA.hija },
							...(t.pausas ?? [{ frame: t.llegaGrupo - 50, ...PUNTOS_LLEGADA.hija }]),
							{ frame: t.llegaGrupo, ...PUNTOS_LLEGADA.grupo },
						], [t.pulsaSeccion, t.pulsaEntrada, t.pulsaGrupo])}
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

/** La página sin grupo. Va dentro de un `<Sequence>`: sus tiempos cuentan desde que se monta. */
const SinGrupo: React.FC<{ senalado: boolean; puesto: boolean }> = ({ senalado, puesto }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const texto = 'Seleccione grupo';
	const s = SIN_GRUPO;
	const resto = entra(frame, fps, 20, 12);

	return (
		<div style={{ position: 'relative', width: MEDIDAS.ancho - MEDIDAS.menu, height: '100%', padding: `${s.arriba}px ${s.lados}px`, boxSizing: 'border-box', color: TEXTO, opacity: 1 - seVa(frame, 0, 1e9) }}>
			<div style={{ height: s.titulo, display: 'flex', alignItems: 'center' }}>
				<span style={{ fontSize: 30, fontWeight: 700, whiteSpace: 'pre' }}>
					{escrito(frame, texto, 4, 2)}
					<span style={{ opacity: escribiendo(frame, texto, 4, 2) && frame % 20 < 12 ? 1 : 0 }}>|</span>
				</span>
				<span style={{ flex: 1 }} />
				<span style={{ opacity: resto }}><Boton tenue alto={36} icono={<IconoLista />}>Ordinales</Boton></span>
			</div>

			<div style={{ position: 'absolute', top: s.arriba + s.selector.y, left: s.lados, display: 'flex', gap: s.selector.hueco, opacity: resto }}>
				{GRUPOS.map((g) => (
					<BotonDeGrupo
						key={g.abrev}
						abrev={g.abrev}
						titular={g.titular}
						puesto={puesto && g.abrev === '9B'}
						senalado={senalado && g.abrev === '9B'}
						alto={s.selector.alto}
						ancho={s.selector.ancho}
					/>
				))}
			</div>

			<div style={{ position: 'absolute', top: s.arriba + s.pista, left: s.lados, fontSize: 17, color: TEXTO_TENUE, opacity: entra(frame, fps, 28, 12) }}>
				Elija un grupo para ver su disciplina.
			</div>

			<div style={{ position: 'absolute', top: s.arriba + s.pie, left: s.lados, display: 'flex', alignItems: 'center', gap: 16, fontSize: 16, whiteSpace: 'nowrap', opacity: entra(frame, fps, 34, 12), borderTop: `1px solid ${BORDE}`, paddingTop: 10 }}>
				<span style={{ color: TEXTO_TENUE }}>Informes · se abren en otra pestaña</span>
				<Boton tenue alto={34} icono={<IconoTabla />}>Situaciones por grupo</Boton>
				<span style={{ color: TEXTO_TENUE }}>Elija un grupo para ver sus observadores.</span>
			</div>
		</div>
	);
};
