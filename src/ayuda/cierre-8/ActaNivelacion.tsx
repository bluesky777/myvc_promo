import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, escribiendo, escrito } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { HojaNivelacion } from './HojaNivelacion';
import { ANCHO_CONTENIDO, ANCHO_UTIL, HOJA_NIV, PN, TEXTOS } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DEL ACTA DE NIVELACIÓN: la barra de arriba (título, resumen, «Qué se nivela», N.º,
 * Fecha, Hora, recargar e imprimir), el aviso amarillo «Antes de firmarla» --que NO se imprime--,
 * y el papel debajo. **No hay selector de periodo**: sale el del colegio.
 */

export const ActaNivelacion: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = TEXTOS.pantalla;

	return (
		<div style={{ width: ANCHO_CONTENIDO, height: '100%', position: 'relative' }}>
			<div style={{ position: 'absolute', left: PN.lados, top: PN.arriba, width: ANCHO_UTIL, height: PN.barra, display: 'flex', alignItems: 'center', gap: 14 }}>
				<div>
					<div style={{ fontSize: 24, fontWeight: 700, color: TEXTO, whiteSpace: 'pre' }}>
						{escrito(frame, t, 4, 2)}
						<span style={{ opacity: escribiendo(frame, t, 4, 2) && frame % 20 < 12 ? 1 : 0 }}>|</span>
					</div>
					<div style={{ fontSize: 14, color: TEXTO_TENUE, opacity: entra(frame, fps, 14, 10) }}>{TEXTOS.resumen}</div>
				</div>
				<div style={{ flex: 1 }} />
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: entra(frame, fps, 16, 10) }}>
					<Campo rotulo={TEXTOS.queSeNivela} valor={TEXTOS.lasDos} ancho={130} desplegable />
					<Campo rotulo="N.º" valor="" ancho={70} />
					<Campo rotulo="Fecha" valor={TEXTOS.fecha} ancho={130} />
					<Campo rotulo="Hora" valor="" ancho={80} />
					<Icono><path d="M19 12 a7 7 0 1 1 -2.05 -4.95 M19 4.5 V8 H15.5" fill="none" stroke={TEXTO} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></Icono>
					<Icono primario><path d="M7 9 V4 H17 V9 M5 9 H19 V16 H5 Z M8 14 H16 V20 H8 Z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" /></Icono>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: PN.lados,
					top: PN.arriba + PN.barra,
					width: ANCHO_UTIL,
					height: PN.aviso,
					boxSizing: 'border-box',
					padding: '14px 18px 14px 52px',
					borderRadius: 8,
					border: '1px solid #ffe58f',
					background: '#fffbe6',
					opacity: entra(frame, fps, 22, 12),
				}}
			>
				<svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', left: 18, top: 16 }} aria-hidden>
					<circle cx="12" cy="12" r="11" fill="#faad14" />
					<path d="M12 6.5 V13.5 M12 16.8 V17.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
				</svg>
				<div style={{ fontSize: 18, fontWeight: 600, color: TEXTO }}>{TEXTOS.antes}</div>
				<div style={{ fontSize: 15.5, lineHeight: 1.4, color: TEXTO, marginTop: 4 }}>{TEXTOS.antesTexto}</div>
			</div>

			<div style={{ position: 'absolute', left: PN.lados, top: PN.arriba + PN.barra + PN.aviso + PN.trasAviso, transformOrigin: '0 0', transform: `scale(${ANCHO_UTIL / HOJA_NIV.ancho})` }}>
				<HojaNivelacion desde={20} />
			</div>
		</div>
	);
};

const Campo: React.FC<{ rotulo: string; valor: string; ancho: number; desplegable?: boolean }> = ({ rotulo, valor, ancho, desplegable = false }) => (
	<div>
		<div style={{ fontSize: 12, color: TEXTO_TENUE, marginBottom: 2 }}>{rotulo}</div>
		<div style={{ width: ancho, height: 32, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 6, background: SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontSize: 14, color: TEXTO }}>
			<span>{valor}</span>
			{desplegable && <span style={{ fontSize: 11, color: TEXTO_TENUE }}>▾</span>}
		</div>
	</div>
);

const Icono: React.FC<{ primario?: boolean; children: React.ReactNode }> = ({ primario = false, children }) => (
	<div style={{ width: 40, height: 36, marginTop: 16, borderRadius: 7, border: `1px solid ${primario ? ACENTO : BORDE}`, background: primario ? ACENTO : SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>{children}</svg>
	</div>
);
