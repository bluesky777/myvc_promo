import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { AvisoBajoLaCabecera } from '../disciplina/AvisoBajoLaCabecera';
import { ACADEMICO, MEDIDAS, MIS_ASIGNATURAS } from '../medidas';
import { ESCALA_CASCARA, ORIGEN } from '../encuadre';
import { Cascara } from '../Cascara';
import { Foco } from '../Foco';
import { Marco } from '../Marco';
import { Tarjeta } from '../Tarjeta';
import { FONDO, FUENTE } from '../tema';
import { pasoEn } from '../tiempos';
import { MisAsignaturas } from '../planilla/MisAsignaturas';
import { LA_QUE_SE_ABRE } from '../planilla/datos';
import { PUNTOS_LLEGADA } from '../planilla-nota-rapida/Llegada';
import { MENU } from '../mis-desempenos/datos';
import { CAMPOS, EstadoCopiar, PantallaCopiar, UnidadesEnCascara } from './Pantallas';
import { DESTINO, DOCENTE, ELEGIDA, ENCUADRE, PG, TEXTOS, botonDeUnidades, rectBotonCopiar, rectControl, rectOpcion } from './datos';
import { Efecto } from '../voz';
import { AVISO, BAJA, BOTON_UNIDADES, CIERRE, COPIADO, ELIGE, ENTRA, LLEGADA, PANEL, PASOS, TARJETA } from './guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * COPIAR UNIDADES: la cáscara con Mis asignaturas y luego Unidades de 9°B; al pulsar «Copiar a otra
 * asignatura» la cáscara se acerca y se apaga, y la pantalla de copiar sale a pantalla completa.
 */

const centro = (r: { x: number; y: number; ancho: number; alto: number }) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

export const EscenaCopiarUnidades: React.FC = () => {
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
			<AvisoBajoLaCabecera texto={TEXTOS.toast} desde={AVISO.desde} dura={AVISO.dura} />
			<Efecto cual="aviso" en={AVISO.desde} />
			<Marco pasos={PASOS} final={TARJETA} />
			<Tarjeta cierre={CIERRE} desde={TARJETA} />
		</AbsoluteFill>
	);
};

const EnLaCascara: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
	const t = LLEGADA;
	const academico = entra(frame, fps, t.abreAcademico, 16);
	const senalada = frame >= t.llegaAcademico && frame < t.pulsaAcademico + 10
		? { seccion: ACADEMICO, hija: null }
		: frame >= t.llegaMisAsignaturas && frame < t.pulsaMisAsignaturas + 10 ? { seccion: ACADEMICO, hija: MIS_ASIGNATURAS } : null;
	const filaSenalada = frame >= t.llegaBoton && frame < t.pulsaBoton + 10 ? LA_QUE_SE_ABRE : null;
	const aparece = entra(frame, fps, 0, 14);
	const seVa = interpolate(frame, [t.seVaLaCascara, t.entraLaPlanilla], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const copiar = centro(botonDeUnidades(2));

	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ORIGEN.x, top: ORIGEN.y, width: MEDIDAS.ancho * ESCALA_CASCARA, height: MEDIDAS.alto * ESCALA_CASCARA, transformOrigin: '50% 45%', transform: `scale(${1 + seVa * 0.07})`, opacity: aparece * (1 - seVa) }}>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU} academico={academico} senalada={senalada}>
						{frame >= t.montaLista && frame < t.montaUnidades && (
							<Sequence from={t.montaLista}>
								<MisAsignaturas salidaEn={t.pulsaBoton - t.montaLista} senalada={filaSenalada} />
							</Sequence>
						)}
						{frame >= t.montaUnidades && (
							<Sequence from={t.montaUnidades}>
								<UnidadesEnCascara copiarEncima={frame >= t.llegaCopiar - 4} />
							</Sequence>
						)}
					</Cascara>
					<Cursor
						puntos={[
							{ frame: t.cursorEntra, ...PUNTOS_LLEGADA.entrada },
							{ frame: t.llegaAcademico, ...PUNTOS_LLEGADA.academico },
							{ frame: t.llegaMisAsignaturas, ...PUNTOS_LLEGADA.misAsignaturas },
							{ frame: t.llegaBoton - 60, ...PUNTOS_LLEGADA.misAsignaturas },
							{ frame: t.llegaBoton, ...centro(BOTON_UNIDADES) },
							{ frame: t.pulsaBoton + 20, ...centro(BOTON_UNIDADES) },
							{ frame: t.llegaCopiar - 30, x: copiar.x + 300, y: copiar.y + 200 },
							{ frame: t.llegaCopiar, ...copiar },
						]}
						clics={[t.pulsaAcademico, t.pulsaMisAsignaturas, t.pulsaBoton, t.pulsaCopiar]}
						aparece={t.cursorEntra}
						sale={t.cursorSale}
						tam={34}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

function estadoEn(f: number): EstadoCopiar {
	const destino: EstadoCopiar['destino'] = {};
	let abierto: EstadoCopiar['abierto'] = null;
	const valor = { docente: DOCENTE, anio: DESTINO.anio, periodo: DESTINO.periodo, asignatura: DESTINO.asignatura };
	CAMPOS.forEach((c, i) => {
		const p = PANEL.pulsaCampo[i];
		if (f >= p + ELIGE) { destino[c] = valor[c]; }
		else if (f >= p) { abierto = { campo: c, resaltada: f >= p + BAJA ? ELEGIDA[c] : null }; }
	});
	return { destino, abierto, copiado: f >= COPIADO, botonEncima: f >= PANEL.llegaCopiar - 4 && f < PANEL.pulsaCopiar + 10 };
}

const Panel: React.FC = () => {
	const f = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(f, fps, 0, 14);
	const puntos = [{ frame: PANEL.cursorEntra, x: PG.ancho - 300, y: 700 }];
	CAMPOS.forEach((c, i) => {
		const p = PANEL.pulsaCampo[i];
		const ctl = rectControl(1, i);
		const op = rectOpcion(1, i, ELEGIDA[c]);
		puntos.push({ frame: p - 8, x: ctl.x + ctl.ancho - 90, y: centro(ctl).y });
		puntos.push({ frame: p + BAJA, x: op.x + op.ancho - 90, y: centro(op).y });
		puntos.push({ frame: p + ELIGE + 4, x: op.x + op.ancho - 90, y: centro(op).y });
	});
	const b = rectBotonCopiar();
	puntos.push({ frame: PANEL.llegaCopiar - 60, x: b.x + b.ancho / 2, y: b.y - 120 });
	puntos.push({ frame: PANEL.llegaCopiar, ...centro(b) });
	puntos.push({ frame: PANEL.pulsaCopiar + 16, ...centro(b) });
	puntos.push({ frame: PANEL.cursorSale, x: b.x + b.ancho / 2 - 200, y: b.y - 200 });
	return (
		<AbsoluteFill>
			<div style={{ position: 'absolute', left: ENCUADRE.x, top: ENCUADRE.y, transformOrigin: '0 0', transform: `scale(${ENCUADRE.escala * interpolate(a, [0, 1], [0.985, 1])})`, opacity: a }}>
				<PantallaCopiar e={estadoEn(f)} />
				<Cursor
					puntos={puntos}
					clics={[...PANEL.pulsaCampo.flatMap((p) => [p, p + ELIGE]), PANEL.pulsaCopiar]}
					aparece={PANEL.cursorEntra}
					sale={PANEL.cursorSale}
					tam={34}
				/>
			</div>
		</AbsoluteFill>
	);
};
