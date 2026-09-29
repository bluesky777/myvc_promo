import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { entra } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { MINIMA_ACEPTADA } from '../../notas/planilla';
import { ALTO_DLG, DLG, DLG_X, DLG_Y, EN_DLG, INICIAL, NIVELACION, TEXTOS, queda as reglaTopada } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL DIÁLOGO «REGISTRAR UNA NIVELACIÓN» (`paginas/notas/dialogo-nivelacion.html`), en el orden de
 * la plantilla: de qué celda se habla (en lectura), la nota de la nivelación con la regla calculada
 * en vivo debajo, la fecha del acta, la actividad de superación y, aparte y cerrado, el enlace
 * «Corregir la valoración inicial», que es el otro gesto.
 *
 * Se dibuja directamente en el fotograma, encima de la planilla, con el velo de los modales.
 * «— vale el N % de la asignatura» no sale: la planilla dibujada no dice los pesos, y esa línea
 * sólo aparece cuando la asignatura los tiene.
 */

export const DialogoNivelacion: React.FC<{
	abre: number;
	/** La primera tecla de la nota de la nivelación, y cuánto hay entre teclas. */
	teclea: number;
	porTecla: number;
	pulsa: number;
	cierra: number;
}> = ({ abre, teclea, porTecla, pulsa, cierra }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame < abre) { return null; }

	const entrada = entra(frame, fps, abre, 12);
	const salida = interpolate(frame, [cierra, cierra + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (salida >= 1) { return null; }

	const teclas = frame < teclea ? 0 : Math.min(NIVELACION.length, Math.floor((frame - teclea) / porTecla) + 1);
	const escrito = NIVELACION.slice(0, teclas);
	const conFoco = frame >= teclea - 8 && frame < pulsa;
	const girando = frame >= pulsa;

	const etiqueta: React.CSSProperties = { height: DLG.etiqueta, display: 'flex', alignItems: 'center', fontSize: 18, color: TEXTO };
	const campo: React.CSSProperties = {
		height: DLG.campo,
		boxSizing: 'border-box',
		border: `1px solid ${BORDE}`,
		borderRadius: 7,
		display: 'flex',
		alignItems: 'center',
		padding: '0 14px',
		fontSize: 19,
		background: SUPERFICIE,
	};

	return (
		<div style={{ position: 'absolute', inset: 0 }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: entrada * (1 - salida) }} />

			<div
				style={{
					position: 'absolute',
					left: DLG_X,
					top: DLG_Y,
					width: DLG.ancho,
					height: ALTO_DLG,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					borderRadius: 12,
					boxShadow: '0 14px 48px rgba(0,0,0,.25)',
					color: TEXTO,
					opacity: entrada * (1 - salida),
					transform: `scale(${interpolate(entrada, [0, 1], [0.94, 1]) * (1 - salida * 0.04)})`,
					overflow: 'hidden',
				}}
			>
				<div style={{ height: DLG.titulo, display: 'flex', alignItems: 'center', padding: `0 ${DLG.relleno}px`, fontSize: 23, fontWeight: 700, boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{TEXTOS.titulo}
				</div>

				<div style={{ position: 'absolute', left: DLG.relleno, right: DLG.relleno, top: EN_DLG.detalle - DLG_Y }}>
					<Dato dt="Alumno"><b style={{ fontWeight: 600 }}>{TEXTOS.alumno}</b></Dato>
					<Dato dt="Indicador">{TEXTOS.indicador}</Dato>
					<Dato dt="Valoración inicial">
						<b style={{ fontWeight: 700 }}>{INICIAL}</b>
						<span style={{ marginLeft: 12, color: TEXTO_TENUE }}>{TEXTOS.juicio}</span>
					</Dato>
				</div>

				<div style={{ position: 'absolute', left: DLG.relleno, right: DLG.relleno, top: EN_DLG.etiquetaNota - DLG_Y }}>
					<div style={etiqueta}>{TEXTOS.notaNivelacion}</div>
					<div style={{ ...campo, width: 170, borderColor: conFoco ? ACENTO : BORDE, boxShadow: conFoco ? `0 0 0 3px ${ACENTO}22` : 'none', fontVariantNumeric: 'tabular-nums' }}>
						{escrito}
						{conFoco && <span style={{ width: 2, height: 22, marginLeft: 2, background: TEXTO, opacity: frame % 30 < 18 ? 1 : 0 }} />}
					</div>
				</div>

				{/* La regla, en vivo: sale en cuanto hay algo escrito. */}
				{escrito !== '' && (
					<div style={{ position: 'absolute', left: DLG.relleno, right: DLG.relleno, top: EN_DLG.regla - DLG_Y, height: DLG.regla, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 17.5, lineHeight: 1.4, paddingTop: 2 }}>
						<span style={{ paddingTop: 3 }}><Flecha /></span>
						<span>
							Va a quedar <b>{reglaTopada(Number(escrito))}</b>. {explicacionDe(escrito)}
						</span>
					</div>
				)}

				<div style={{ position: 'absolute', left: DLG.relleno, right: DLG.relleno, top: EN_DLG.etiquetaFecha - DLG_Y }}>
					<div style={etiqueta}>{TEXTOS.fecha}</div>
					<div style={{ ...campo, width: 230, justifyContent: 'space-between' }}>
						{TEXTOS.fechaValor}
						<Calendario />
					</div>
				</div>

				<div style={{ position: 'absolute', left: DLG.relleno, right: DLG.relleno, top: EN_DLG.etiquetaActividad - DLG_Y }}>
					<div style={etiqueta}>{TEXTOS.actividad}</div>
					<div style={{ ...campo, color: '#bfbfbf' }}>{TEXTOS.actividadPlaceholder}</div>
				</div>

				<div style={{ position: 'absolute', left: DLG.relleno, top: EN_DLG.enlace - DLG_Y, height: DLG.enlace, display: 'flex', alignItems: 'center', fontSize: 18, color: ACENTO }}>
					{TEXTOS.corregir}
				</div>

				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: EN_DLG.pie - DLG_Y,
						height: DLG.pie,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						gap: 12,
						padding: `0 ${DLG.relleno}px`,
						boxShadow: `inset 0 1px 0 ${BORDE}`,
					}}
				>
					<div style={{ height: 48, boxSizing: 'border-box', padding: '0 20px', border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', fontSize: 18 }}>
						{TEXTOS.cancelar}
					</div>
					<div
						style={{
							width: 240,
							height: 48,
							borderRadius: 7,
							background: ACENTO,
							opacity: girando ? 0.75 : 1,
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 10,
							fontSize: 18,
							fontWeight: 500,
						}}
					>
						{girando && <Rueda frame={frame} />}
						{TEXTOS.registrar}
					</div>
				</div>
			</div>
		</div>
	);
};

/* Mientras sólo hay un «8» escrito, la regla habla de un 8: se calcula con lo que hay, como la pantalla. */
function explicacionDe(escrito: string): string {
	return `Regla del colegio: la nivelación se topa en la mínima aprobatoria (${MINIMA_ACEPTADA}). Queda ${reglaTopada(Number(escrito))}.`;
}

const Dato: React.FC<{ dt: string; children: React.ReactNode }> = ({ dt, children }) => (
	<div style={{ display: 'flex', height: DLG.fila, alignItems: 'center', fontSize: 18 }}>
		<span style={{ width: DLG.dt, color: TEXTO_TENUE, flex: '0 0 auto' }}>{dt}</span>
		<span>{children}</span>
	</div>
);

const Flecha: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 18 18" style={{ flex: '0 0 auto' }}>
		<path d="M3 9 H14 M10 5 L14 9 L10 13" fill="none" stroke={TEXTO} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Calendario: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 16 16">
		<rect x="2" y="3.2" width="12" height="10.6" rx="1.6" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.4" />
		<path d="M2 6.6 H14 M5.2 1.8 V4.4 M10.8 1.8 V4.4" stroke={TEXTO_TENUE} strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);

const Rueda: React.FC<{ frame: number }> = ({ frame }) => (
	<svg width="18" height="18" viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 12}deg)` }}>
		<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="3" />
		<path d="M12 3 A9 9 0 0 1 21 12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
	</svg>
);
