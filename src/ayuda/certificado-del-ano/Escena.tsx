import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Aviso } from '../../notas/Aviso';
import { MEDIDAS, MENU_DIRECTIVO } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE, TINTA, TINTA_SUAVE } from '../tema';
import { pasoEn } from '../tiempos';
import { Efecto } from '../voz';
import { ALMENDROS } from '../colegio';
import { Colegio } from '../certificado-membrete/Colegio';
import { CERTIFICADOS, EN_BLANCO, EstadoPantalla, MEMBRETADA, PLANTILLAS } from '../certificado-membrete/datos';
import { Certificado } from '../certificado-imprimir/Certificado';
import { NUMERO_TRAS_CARGAR } from '../certificado-imprimir/datos';
import {
	ANADIDO,
	AVISO_CAMBIA,
	AVISO_GUARDADOS,
	CABECERAS,
	CIERRE,
	CONFIG,
	E0,
	EL_COLEGIO,
	FOCOS,
	PASOS,
	PUNTOS,
	T,
	TARJETA,
} from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CERTIFICADOS 2: la misma pantalla que el vídeo de los membretes, pero arriba --lo del año--, y
 * al final UN plano quieto con las dos cabeceras del certificado lado a lado. No se reescala nada:
 * cada hoja se pinta a su escala fija y se recorta por abajo.
 */

export const EscenaCertificadoDelAno: React.FC = () => {
	const frame = useCurrentFrame();

	const cual = pasoEn(PASOS, frame);
	const paso = cual >= 0 ? PASOS[cual] : null;
	const acabaElPaso = cual >= 0 && cual + 1 < PASOS.length ? PASOS[cual + 1].desde : TARJETA;

	return (
		<AbsoluteFill style={{ background: FONDO, fontFamily: FUENTE }}>
			{frame < T.entranLasHojas && <EnLaCascara frame={frame} />}
			{frame >= T.entranLasHojas - 10 && <LasCabeceras />}

			{/* El rótulo del papel empieza mientras se va la cáscara; el foco espera a que la hoja haya entrado. */}
			<Foco
				recorte={paso?.foco ?? null}
				desde={paso?.foco === FOCOS.conMembrete ? T.entranLasHojas + 16 : paso?.desde ?? 0}
				hasta={paso?.focoHasta ?? acabaElPaso - 10}
			/>

			<Sequence from={AVISO_CAMBIA.desde} durationInFrames={AVISO_CAMBIA.dura + 20}>
				<Aviso texto={`${ALMENDROS.year} imprime ahora con «${PLANTILLAS[MEMBRETADA].nombre}».`} desde={0} dura={AVISO_CAMBIA.dura} />
			</Sequence>
			<Sequence from={AVISO_GUARDADOS.desde} durationInFrames={AVISO_GUARDADOS.dura + 20}>
				<Aviso texto="Guardados los textos del certificado." desde={0} dura={AVISO_GUARDADOS.dura} />
			</Sequence>

			{/* El tecleo del NIT: una tecla que suena de cada dos. */}
			{Array.from({ length: Math.ceil(ANADIDO.length / 2) }, (_, i) => (
				<Efecto key={i} cual={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} en={T.teclea + i * 2 * T.porTecla} />
			))}
			<Efecto cual="aviso" en={AVISO_CAMBIA.desde} />
			<Efecto cual="aviso" en={AVISO_GUARDADOS.desde} />

			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const LasCabeceras: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const texto = ALMENDROS.encabezado + ANADIDO;
	return (
		<>
			{[
				{ conMembrete: true, nombre: PLANTILLAS[MEMBRETADA].nombre, nota: 'con membrete' },
				{ conMembrete: false, nombre: PLANTILLAS[EN_BLANCO].nombre, nota: 'sin membrete' },
			].map((h, i) => {
				const a = entra(frame, fps, T.entranLasHojas + i * 8, 16);
				return (
					<div key={h.nombre} style={{ position: 'absolute', left: CABECERAS.x[i], top: CABECERAS.y - 52, width: CABECERAS.ancho, opacity: a }}>
						<div style={{ height: 44, display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: FUENTE }}>
							<span style={{ fontSize: 26, fontWeight: 700, color: TINTA }}>«{h.nombre}»</span>
							<span style={{ fontSize: 22, color: TINTA_SUAVE }}>{h.nota}</span>
						</div>
						<div style={{ marginTop: 8, width: CABECERAS.ancho, height: CABECERAS.alto, overflow: 'hidden', borderRadius: 4, boxShadow: '0 18px 48px rgba(15, 28, 52, .16)' }}>
							<div style={{ transformOrigin: '0 0', transform: `scale(${CABECERAS.escala})` }}>
								<Certificado conMembrete={h.conMembrete} hastaPeriodo={2} numero={NUMERO_TRAS_CARGAR} encabezado={texto} desde={-100} />
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
};

const EnLaCascara: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();
	const abierta = entra(frame, fps, T.abreConfig, 16);
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [T.seVaLaCascara, T.entranLasHojas], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	const senaladaMenu =
		frame >= T.llegaConfig && frame < T.pulsaConfig + 10
			? { seccion: CONFIG.seccion, hija: null }
			: frame >= T.llegaColegio && frame < T.pulsaColegio + 10
				? { seccion: EL_COLEGIO.seccion, hija: EL_COLEGIO.hija }
				: null;
	const senalado =
		frame >= T.llegaPestana && frame < T.pulsaPestana + 10
			? `pestana-${CERTIFICADOS}`
			: frame >= T.llegaOpcion && frame < T.pulsaOpcion + 10
				? `op-${MEMBRETADA}`
				: null;

	const barra = interpolate(frame, [T.barraDesde, T.barraHasta, T.guardados, T.guardados + 14], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const estado: EstadoPantalla = { ...E0, barraTextos: barra };

	const letras = frame >= T.teclea ? Math.min(ANADIDO.length, Math.floor((frame - T.teclea) / T.porTecla) + 1) : 0;
	const texto = ALMENDROS.encabezado + ANADIDO.slice(0, letras);

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
					<Cascara menu={MENU_DIRECTIVO} abierta={{ seccion: CONFIG.seccion, t: abierta }} senalada={senaladaMenu}>
						{frame >= T.montaColegio && (
							<div style={{ position: 'absolute', inset: 0, opacity: entra(frame, fps, T.montaColegio, 12) }}>
								<Colegio
									frame={frame}
									pestana={frame >= T.pulsaPestana ? CERTIFICADOS : 0}
									cuerpo={entra(frame, fps, T.montaCertificados, 16)}
									scroll={0}
									estado={estado}
									puesta={frame >= T.cambia ? MEMBRETADA : EN_BLANCO}
									textoEncabezado={texto}
									textoConFoco={frame >= T.pulsaEditor && frame < T.pulsaGuardar}
									textoSucio={letras > 0 && frame < T.guardados}
									senalado={senalado}
								/>
							</div>
						)}
					</Cascara>

					<Cursor
						puntos={[
							{ frame: T.cursorEntra, ...PUNTOS.entrada },
							{ frame: T.llegaConfig, ...PUNTOS.config },
							{ frame: T.llegaColegio, ...PUNTOS.colegio },
							{ frame: T.llegaPestana - 24, ...PUNTOS.colegio },
							{ frame: T.llegaPestana, ...PUNTOS.pestana },
							{ frame: T.llegaOpcion - 60, ...PUNTOS.pestana },
							{ frame: T.llegaOpcion, ...PUNTOS.opcion },
							{ frame: T.llegaEditor - 60, ...PUNTOS.opcion },
							{ frame: T.llegaEditor, ...PUNTOS.editor },
							{ frame: T.pulsaEditor + 8, ...PUNTOS.editor },
							{ frame: T.teclea - 4, x: PUNTOS.editor.x + 40, y: PUNTOS.editor.y + 60 },
							{ frame: T.llegaGuardar - 50, x: PUNTOS.editor.x + 40, y: PUNTOS.editor.y + 60 },
							{ frame: T.llegaGuardar, ...PUNTOS.guardar },
						]}
						clics={[T.pulsaConfig, T.pulsaColegio, T.pulsaPestana, T.pulsaOpcion, T.pulsaEditor, T.pulsaGuardar]}
						aparece={T.cursorEntra}
						sale={T.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
