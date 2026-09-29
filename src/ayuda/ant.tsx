import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PIEZAS DE ANT DIBUJADAS QUE SE REPITEN EN VARIAS PANTALLAS: la casilla de verificación, el
 * desplegable cerrado, la píldora de estado, el aviso (`nz-alert`), el radio y la barra de
 * progreso. Van aquí y no en cada vídeo porque son **la misma pieza de la aplicación**: si cada
 * vídeo dibujara su casilla, las casillas de dos vídeos seguidos no se parecerían.
 *
 * Los colores son los de `app2/src/styles.scss` (`--paleta-exito-*`, `--paleta-aviso-*`,
 * `--paleta-peligro-*`), en claro.
 */

export const PALETA = {
	exitoTinte: '#f6ffed', exitoBorde: '#b7eb8f', exitoLegible: '#237804', exito: '#52c41a',
	avisoTinte: '#fffbe6', avisoBorde: '#ffe58f', avisoLegible: '#874d00', aviso: '#faad14',
	peligroTinte: '#fff1f0', peligroBorde: '#ffccc7', peligroLegible: '#a8071a', peligro: '#ff4d4f',
	infoTinte: '#e6f4ff', infoBorde: '#91caff',
	zona: '#fafafa', zonaMarcada: '#f5f5f5', linea: '#f0f0f0', textoSuave: '#595959',
};

/** La casilla de verificación de Ant: azul con su visto cuando está marcada. */
export const Casilla: React.FC<{ marcada: boolean; tam?: number; senalada?: boolean; roja?: boolean }> = ({ marcada, tam = 20, senalada = false, roja = false }) => {
	const color = roja ? PALETA.peligro : ACENTO;
	return (
		<span
			style={{
				width: tam,
				height: tam,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 4,
				boxSizing: 'border-box',
				border: `1px solid ${marcada || senalada ? color : '#bfbfbf'}`,
				background: marcada ? color : SUPERFICIE,
				flexShrink: 0,
			}}
		>
			{marcada && (
				<svg width={tam * 0.7} height={tam * 0.7} viewBox="0 0 24 24" aria-hidden>
					<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)}
		</span>
	);
};

/** El radio de Ant. */
export const Radio: React.FC<{ puesto: boolean; tam?: number }> = ({ puesto, tam = 20 }) => (
	<span
		style={{
			width: tam,
			height: tam,
			borderRadius: '50%',
			boxSizing: 'border-box',
			border: `1px solid ${puesto ? ACENTO : '#bfbfbf'}`,
			background: puesto ? ACENTO : SUPERFICIE,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
		}}
	>
		{puesto && <span style={{ width: tam * 0.4, height: tam * 0.4, borderRadius: '50%', background: '#fff' }} />}
	</span>
);

/** Un `nz-select` cerrado: el valor (o el marcador en gris) y la flecha. */
export const Desplegable: React.FC<{
	valor: string | null;
	marcador?: string;
	ancho: number | string;
	alto?: number;
	tam?: number;
	abierto?: boolean;
	senalado?: boolean;
	apagado?: boolean;
}> = ({ valor, marcador = '', ancho, alto = 38, tam = 17, abierto = false, senalado = false, apagado = false }) => (
	<div
		style={{
			width: ancho,
			height: alto,
			boxSizing: 'border-box',
			border: `1px solid ${abierto || senalado ? ACENTO : BORDE}`,
			boxShadow: abierto ? `0 0 0 2px ${ACENTO}22` : 'none',
			borderRadius: 6,
			background: apagado ? '#f5f5f5' : SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 8,
			padding: '0 12px',
			fontSize: tam,
			color: valor ? TEXTO : '#bfbfbf',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			flexShrink: 0,
		}}
	>
		<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{valor ?? marcador}</span>
		<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0, transform: abierto ? 'rotate(180deg)' : undefined }}>
			<path d="M5 9l7 7 7-7" fill="none" stroke={TEXTO_TENUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</div>
);

/** La lista abierta de un `nz-select`, colgando debajo del mando. */
export const ListaDesplegada: React.FC<{ opciones: string[]; ancho: number; marcada?: number; encima?: number | null; tam?: number; alto?: number }> = ({
	opciones, ancho, marcada = -1, encima = null, tam = 17, alto = 38,
}) => (
	<div
		style={{
			width: ancho,
			boxSizing: 'border-box',
			padding: 4,
			borderRadius: 8,
			background: SUPERFICIE,
			boxShadow: '0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
		}}
	>
		{opciones.map((o, i) => (
			<div
				key={o}
				style={{
					height: alto,
					display: 'flex',
					alignItems: 'center',
					padding: '0 12px',
					borderRadius: 4,
					fontSize: tam,
					color: TEXTO,
					fontWeight: i === marcada ? 600 : 400,
					background: i === encima ? '#f5f5f5' : i === marcada ? '#e6f4ff' : 'transparent',
					whiteSpace: 'nowrap',
				}}
			>
				{o}
			</div>
		))}
	</div>
);

export type TonoDePildora = 'bien' | 'aviso' | 'mal' | 'gris' | 'nada';

/** La píldora redonda de estado (`.pildora` / `.pastilla` de app2). */
export const Pildora: React.FC<{ tono: TonoDePildora; children: React.ReactNode; tam?: number }> = ({ tono, children, tam = 16 }) => {
	const c = {
		bien: [PALETA.exitoTinte, PALETA.exitoLegible, PALETA.exitoBorde],
		aviso: [PALETA.avisoTinte, PALETA.avisoLegible, PALETA.avisoBorde],
		mal: [PALETA.peligroTinte, PALETA.peligroLegible, PALETA.peligroBorde],
		gris: ['#f5f5f5', PALETA.textoSuave, '#d9d9d9'],
		nada: ['transparent', TEXTO, 'transparent'],
	}[tono];
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				minWidth: 36,
				height: tam + 12,
				padding: '0 10px',
				boxSizing: 'border-box',
				borderRadius: 999,
				background: c[0],
				color: c[1],
				border: `1px solid ${c[2]}`,
				fontSize: tam,
				fontWeight: 600,
				fontVariantNumeric: 'tabular-nums',
				whiteSpace: 'nowrap',
			}}
		>
			{children}
		</span>
	);
};

export type TonoDeAlerta = 'info' | 'exito' | 'aviso' | 'error';

/** Un `nz-alert` con icono, título y descripción. */
export const Alerta: React.FC<{ tono: TonoDeAlerta; titulo: string; texto?: React.ReactNode; tam?: number; ancho?: number | string }> = ({
	tono, titulo, texto, tam = 17, ancho = '100%',
}) => {
	const c = {
		info: [PALETA.infoTinte, PALETA.infoBorde, ACENTO],
		exito: [PALETA.exitoTinte, PALETA.exitoBorde, PALETA.exito],
		aviso: [PALETA.avisoTinte, PALETA.avisoBorde, PALETA.aviso],
		error: [PALETA.peligroTinte, PALETA.peligroBorde, PALETA.peligro],
	}[tono];
	return (
		<div
			style={{
				width: ancho,
				boxSizing: 'border-box',
				display: 'flex',
				gap: 12,
				alignItems: 'flex-start',
				padding: texto ? '14px 18px' : '10px 16px',
				borderRadius: 8,
				background: c[0],
				border: `1px solid ${c[1]}`,
				color: TEXTO,
			}}
		>
			<IconoDeAlerta tono={tono} color={c[2]} tam={texto ? tam + 7 : tam + 1} />
			<div style={{ flex: 1, minWidth: 0 }}>
				<div style={{ fontSize: texto ? tam + 1 : tam, fontWeight: texto ? 600 : 400, lineHeight: 1.35 }}>{titulo}</div>
				{texto && <div style={{ fontSize: tam - 1, lineHeight: 1.45, marginTop: 4, color: PALETA.textoSuave }}>{texto}</div>}
			</div>
		</div>
	);
};

const IconoDeAlerta: React.FC<{ tono: TonoDeAlerta; color: string; tam: number }> = ({ tono, color, tam }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0, marginTop: 1 }}>
		<circle cx="12" cy="12" r="11" fill={color} />
		{tono === 'exito' && <path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
		{tono === 'info' && <><circle cx="12" cy="7.2" r="1.4" fill="#fff" /><path d="M12 10.5v7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></>}
		{(tono === 'aviso' || tono === 'error') && <><path d="M12 6.5v7" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /><circle cx="12" cy="17" r="1.4" fill="#fff" /></>}
	</svg>
);

/** La barra de `nz-progress`. `t` entre 0 y 1. */
export const Progreso: React.FC<{ t: number; ancho: number | string }> = ({ t, ancho }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 12, width: ancho }}>
		<div style={{ flex: 1, height: 8, borderRadius: 99, background: 'rgba(0,0,0,.06)', overflow: 'hidden' }}>
			<div style={{ width: `${Math.round(Math.max(0, Math.min(1, t)) * 100)}%`, height: '100%', borderRadius: 99, background: ACENTO }} />
		</div>
		<span style={{ fontSize: 15, color: TEXTO, width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(Math.max(0, Math.min(1, t)) * 100)}%</span>
	</div>
);

/** El giro de «cargando» de Ant. `frame` lo hace girar. */
export const Girando: React.FC<{ frame: number; tam?: number; color?: string }> = ({ frame, tam = 18, color = '#fff' }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden style={{ transform: `rotate(${frame * 14}deg)` }}>
		<path d="M12 3a9 9 0 1 0 9 9" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
	</svg>
);

/* ── Iconos de Ant que faltaban, dibujados ───────────────────────────────────────────────── */

const trazo = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconoSubir: React.FC<{ tam?: number }> = ({ tam = 17 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M7 18h-.5a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.6 1.5A3.8 3.8 0 0 1 17.5 18H17" {...trazo} /><path d="M12 20v-8M9 14.5l3-3 3 3" {...trazo} /></svg>
);
export const IconoBajar: React.FC<{ tam?: number }> = ({ tam = 17 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" {...trazo} /></svg>
);
export const IconoExcel: React.FC<{ tam?: number; color?: string }> = ({ tam = 40, color = '#389e0d' }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden>
		<path d="M6 2.5h8.5L19 7v14.5H6z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
		<path d="M14.5 2.5V7H19" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
		<path d="M9.5 11l5 6M14.5 11l-5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
	</svg>
);
export const IconoFlechaIzq: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M19 12H5M11 6l-6 6 6 6" {...trazo} /></svg>
);
export const IconoDerecha: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" {...trazo} /></svg>
);
export const IconoReloj: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="8.5" {...trazo} /><path d="M12 7.5V12l3 2" {...trazo} /></svg>
);
export const IconoVistoRedondo: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="8.5" {...trazo} /><path d="M8.2 12.3l2.6 2.6 5-5.2" {...trazo} /></svg>
);
export const IconoImpresora: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M7 9V4h10v5" {...trazo} /><path d="M5 9h14v7H5z" {...trazo} /><path d="M8 14h8v6H8z" {...trazo} /></svg>
);
export const IconoEngranaje: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="3" {...trazo} /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" {...trazo} /></svg>
);
export const IconoDocumento: React.FC<{ tam?: number }> = ({ tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden><path d="M6 3h9l4 4v14H6z" {...trazo} /><path d="M9 13l2 2 4-4" {...trazo} /></svg>
);

/*
 * EL AVISO AZUL DE `Avisos.open()` SIN ACCIÓN: un `NzMessage` de tipo `info` (el círculo azul con
 * la «i»), no el verde de `exito()`. Es `notas/Aviso` con otro icono, y bajado para no tapar la
 * cabecera, como `disciplina/AvisoBajoLaCabecera`.
 */
export const AvisoInfo: React.FC<{ texto: string; desde: number; dura: number }> = ({ texto, desde, dura }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame - desde;
	if (t < 0 || t > dura + 14) { return null; }
	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const y = interpolate(entrada, [0, 1], [-110, 0]) - salida * 40;
	const escala = interpolate(entrada, [0, 0.6, 1], [0.86, 1.04, 1]) * (1 - salida * 0.06);
	return (
		<div style={{ position: 'absolute', top: 126, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${y}px) scale(${escala})`, opacity: entrada * (1 - salida), zIndex: 35 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '26px 52px', borderRadius: 18, background: '#fff', fontSize: 44, fontWeight: 600, color: TEXTO, boxShadow: '0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)' }}>
				<svg width="50" height="50" viewBox="0 0 24 24" aria-hidden>
					<circle cx="12" cy="12" r="11" fill={ACENTO} />
					<circle cx="12" cy="7.2" r="1.5" fill="#fff" />
					<path d="M12 10.6v7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
				</svg>
				<span>{texto}</span>
			</div>
		</div>
	);
};
