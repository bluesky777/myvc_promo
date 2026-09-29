import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Escena as EscenaPlanilla } from '../../notas/Escena';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { NOTAS_DE_PARTIDA } from '../planilla-nota-rapida/datos';
import { Periodos } from '../cierre-2/Periodos';
import { EL_QUE_SE_CIERRA } from '../cierre-2/datos';
import { AvisoInfo } from './AvisoInfo';
import { LlegadaA } from './Llegada';
import { AJUSTE, AVISOS, CAJA_AVISO, ENCIMA, FILA_MODO, MODO_NIVELACION, GEOMETRIA, MATEO, QUIZ, SELECTOR } from './datos';
import {
	ADMIN, CIERRE, ENTRA, HIJA_EL_COLEGIO, LLEGADA, PARADA, PASOS, PLANILLA, PUNTOS_ADMIN, RELEVO, RITMO_CERRADA,
	SECCION_CONFIG, TARJETA, casoAnterior, casoEn,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NO ME DEJA ESCRIBIR»: encadena, no dibuja. La llegada de los vídeos de la planilla, la planilla
 * de siempre con el aviso encima y las casillas apagadas, y al final la cáscara del administrador
 * con la pestaña Periodos de `cierre-2`.
 *
 * CUANDO EL CASO PASA DE «NO ESCRIBE» A «ESCRIBE» las casillas cambian de gris a blanco: se hace
 * con una segunda planilla encima que se enciende en `RELEVO` fotogramas, y la de debajo se quita
 * cuando la de encima ya tapa entera. Las dos son la misma escena con las mismas notas.
 */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

const ESTADO = () => ({ notas: NOTAS_DE_PARTIDA });

export const EscenaNoMeDeja: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	const selector = centro(SELECTOR);
	const abre = ENTRA + PLANILLA.admin;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < ENTRA && (
				<LlegadaA
					frame={frame}
					fps={fps}
					t={LLEGADA}
					paradas={[
						{ frame: PARADA.llega, ...selector },
						{ frame: PARADA.sale, ...selector },
					]}
				/>
			)}

			{frame >= ENTRA && frame < abre + RELEVO && (
				<Sequence from={ENTRA}>
					<Planilla cerrada puntero />
				</Sequence>
			)}
			{frame >= abre && frame < ADMIN.aparece && (
				<AbsoluteFill style={{ opacity: interpolate(frame, [abre, abre + RELEVO], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
					<Sequence from={ENTRA}>
						<Planilla cerrada={false} puntero={false} />
					</Sequence>
				</AbsoluteFill>
			)}

			{frame >= ADMIN.aparece && <EnPeriodos frame={frame} fps={fps} />}

			<Foco recorte={paso?.foco ?? null} desde={paso?.desde ?? 0} hasta={paso?.focoHasta ?? acabaElPaso - 10} />

			<Marco pasos={PASOS} final={TARJETA} />

			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

/*
 * «MODO NIVELACIÓN», debajo del aviso. En «Nivelando» se puede marcar; con el periodo cerrado sale
 * apagada, con su explicación en gris al lado (texto de app2).
 */
const ModoNivelacion: React.FC<{ apagado: boolean }> = ({ apagado }) => (
	<div style={{ position: 'absolute', left: 4, right: 0, top: FILA_MODO.y - CAJA_AVISO.y, height: FILA_MODO.alto, display: 'flex', alignItems: 'center', gap: 12, fontSize: 20 }}>
		<span style={{ width: 22, height: 22, borderRadius: 4, boxSizing: 'border-box', border: '1px solid #d9d9d9', background: apagado ? '#f5f5f5' : '#fff' }} />
		<span style={{ color: apagado ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.88)' }}>{MODO_NIVELACION.etiqueta}</span>
		{apagado && <span style={{ marginLeft: 10, color: '#8c8c8c', fontSize: 18 }}>{MODO_NIVELACION.bloqueado}</span>}
	</div>
);

/* ── La planilla, en fotogramas locales ───────────────────────────────────────────────────── */

const Planilla: React.FC<{ cerrada: boolean; puntero: boolean }> = ({ cerrada, puntero }) => {
	const f = useCurrentFrame();
	const caso = casoEn(f);
	const antes = casoAnterior(f);
	const cambio = antes === null ? 1 : (f - [PLANILLA.nivelando, PLANILLA.admin].filter((c) => c <= f).pop()!) / RELEVO;


	return (
		<EscenaPlanilla
			ritmo={RITMO_CERRADA}
			ajuste={AJUSTE}
			quieta
			cerrada={cerrada}
			estado={ESTADO}
			encima={{
				alto: ENCIMA,
				nodo: (
					<>
						<AvisoInfo alto={CAJA_AVISO.alto} texto={AVISOS[caso]} antes={antes === null ? null : AVISOS[antes]} t={cambio} />
						<ModoNivelacion apagado={caso !== 'nivelando'} />
					</>
				),
			}}
			sobre={puntero ? <Puntero /> : null}
		/>
	);
};

const P = {
	entrada: { x: GEOMETRIA.ancho - 140, y: GEOMETRIA.alto - 60 },
	nota: centro(GEOMETRIA.casilla(MATEO, QUIZ)),
	aus: centro(GEOMETRIA.celda(MATEO, 'ausencias')),
};

const Puntero: React.FC = () => (
	<Cursor
		puntos={[
			{ frame: PLANILLA.cursorEntra, ...P.entrada },
			{ frame: PLANILLA.llegaNota, ...P.nota },
			{ frame: PLANILLA.pulsaNota + 14, ...P.nota },
			{ frame: PLANILLA.llegaAus, ...P.aus },
			{ frame: PLANILLA.pulsaAus + 14, ...P.aus },
			{ frame: PLANILLA.cursorSale, x: P.aus.x + 60, y: P.aus.y + 160 },
		]}
		clics={[PLANILLA.pulsaNota, PLANILLA.pulsaAus]}
		aparece={PLANILLA.cursorEntra}
		sale={PLANILLA.cursorSale}
		tam={30}
	/>
);

/* ── La cáscara del administrador: Configuración -> El colegio -> Periodos ────────────────── */

const EnPeriodos: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const a = ADMIN;
	const config = entra(frame, fps, a.abreConfig, 16);
	const aparece = entra(frame, fps, a.aparece, 14);

	const senalada = frame >= a.llegaConfig && frame < a.pulsaConfig + 10
		? { seccion: SECCION_CONFIG, hija: null }
		: frame >= a.llegaColegio && frame < a.pulsaColegio + 10
			? { seccion: SECCION_CONFIG, hija: HIJA_EL_COLEGIO }
			: null;

	const senalado = frame >= a.llegaCalificando && frame < a.cursorSale
		? { fila: EL_QUE_SE_CIERRA, tramo: 'calificando' as const }
		: null;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: ORIGEN.x,
					top: ORIGEN.y,
					width: MEDIDAS.ancho * ESCALA_CASCARA,
					height: MEDIDAS.alto * ESCALA_CASCARA,
					opacity: aparece,
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: SECCION_CONFIG, t: config }} senalada={senalada}>
						{frame >= a.montaColegio && (
							<Sequence from={a.montaColegio}>
								<Periodos tramoDelQueSeCierra="cerrado" senalado={senalado} />
							</Sequence>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: a.cursorEntra, ...PUNTOS_ADMIN.entrada },
							{ frame: a.llegaConfig, ...PUNTOS_ADMIN.config },
							{ frame: a.llegaColegio, ...PUNTOS_ADMIN.colegio },
							{ frame: a.llegaCalificando - 20, ...PUNTOS_ADMIN.colegio },
							{ frame: a.llegaCalificando, ...PUNTOS_ADMIN.calificando },
						]}
						clics={[a.pulsaConfig, a.pulsaColegio]}
						aparece={a.cursorEntra}
						sale={a.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
