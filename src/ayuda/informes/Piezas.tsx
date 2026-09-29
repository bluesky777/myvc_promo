import React from 'react';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS SUELTAS DE LA PANTALLA DE INFORMES (serie «informes»): iconos de Ant dibujados, el
 * botón, el desplegable, el segmentado (`myvc-segmentado`), el interruptor (`nz-switch`), el
 * plegable (`<details class="plegable">`) y el aviso (`nz-alert`). Sin fuente de iconos: todo SVG.
 *
 * Las letras van algo más grandes que en la aplicación (13-14 px allí): la cáscara se pinta al
 * 84 %, y un 13 a esa escala no se lee en un móvil.
 */

export const TENUE_FONDO = '#f5f5f5';
export const MESA = '#e9eef5';

type Rect = { x: number; y: number; ancho: number; alto: number };

/* ── Iconos ────────────────────────────────────────────────────────────────────────────────── */

const trazo = (color: string, w = 1.7) => ({ fill: 'none', stroke: color, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

export const Icono: React.FC<{ que: string; tam?: number; color?: string }> = ({ que, tam = 18, color = TEXTO_TENUE }) => {
	const s = trazo(color);
	return (
		<svg width={tam} height={tam} viewBox="0 0 20 20" style={{ flexShrink: 0, display: 'block' }} aria-hidden>
			{que === 'lupa' && (
				<>
					<circle cx="8.6" cy="8.6" r="5.4" {...s} />
					<path d="M12.6 12.6 L17 17" {...s} />
				</>
			)}
			{que === 'impresora' && (
				<>
					<path d="M5.5 7.5 V3 H14.5 V7.5" {...s} />
					<rect x="2.5" y="7.5" width="15" height="7" rx="1.5" {...s} />
					<path d="M5.5 12 H14.5 V17 H5.5 Z" {...s} />
				</>
			)}
			{que === 'recargar' && (
				<>
					<path d="M16 10 A6 6 0 1 1 13.8 5.4" {...s} />
					<path d="M14.5 2.5 V6 H11" {...s} />
				</>
			)}
			{que === 'engranaje' && (
				<>
					<circle cx="10" cy="10" r="2.6" {...s} />
					<path
						d="M10 2.5 L11.3 4.6 L13.7 4 L14.2 6.4 L16.5 7.3 L15.6 9.6 L17 11.6 L15 13 L15.2 15.5 L12.7 15.6 L11.4 17.6 L10 16.2 L8.6 17.6 L7.3 15.6 L4.8 15.5 L5 13 L3 11.6 L4.4 9.6 L3.5 7.3 L5.8 6.4 L6.3 4 L8.7 4.6 Z"
						{...s}
						strokeWidth={1.4}
					/>
				</>
			)}
			{que === 'completa' && <path d="M3 7.5 V3 H7.5 M12.5 3 H17 V7.5 M17 12.5 V17 H12.5 M7.5 17 H3 V12.5" {...s} />}
			{que === 'menu' && <path d="M3.5 5.5 H16.5 M3.5 10 H16.5 M3.5 14.5 H16.5" {...s} />}
			{que === 'arriba' && <path d="M4.5 12.5 L10 7 L15.5 12.5" {...s} />}
			{que === 'derecha' && <path d="M7.5 4.5 L13 10 L7.5 15.5" {...s} />}
			{que === 'abajo' && <path d="M5 7.5 L10 12.5 L15 7.5" {...s} />}
			{que === 'cerrar' && <path d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5" {...s} />}
			{que === 'mas' && <path d="M10 4 V16 M4 10 H16" {...s} />}
			{que === 'check' && <path d="M4 10.5 L8.2 14.5 L16 6" {...s} />}
			{que === 'izquierda' && <path d="M16 10 H4.5 M9 5 L4 10 L9 15" {...s} />}
			{que === 'reloj' && (
				<>
					<circle cx="10" cy="10" r="7" {...s} />
					<path d="M10 6 V10 L13 12" {...s} />
				</>
			)}
			{que === 'calendario' && (
				<>
					<rect x="3" y="4.5" width="14" height="12.5" rx="1.5" {...s} />
					<path d="M3 8.5 H17 M7 2.8 V6 M13 2.8 V6" {...s} />
				</>
			)}
			{que === 'formulario' && (
				<>
					<rect x="4" y="2.8" width="12" height="14.4" rx="1.5" {...s} />
					<path d="M7 7 H13 M7 10 H13 M7 13 H10.5" {...s} />
				</>
			)}
			{que === 'fondo' && (
				<>
					<rect x="3" y="3.5" width="14" height="13" rx="1.5" {...s} />
					<path d="M3.5 13.5 L8 9.5 L11.5 12.5 L13.5 11 L16.5 13.5" {...s} />
				</>
			)}
		</svg>
	);
};

/** Los círculos de color de `nz-alert` y del aviso, dibujados. */
export const IconoDeAlerta: React.FC<{ tipo: 'info' | 'warning' | 'error' | 'success'; tam?: number }> = ({ tipo, tam = 20 }) => {
	const color = tipo === 'info' ? ACENTO : tipo === 'warning' ? '#faad14' : tipo === 'error' ? '#ff4d4f' : '#52c41a';
	return (
		<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flexShrink: 0 }} aria-hidden>
			<circle cx="12" cy="12" r="11" fill={color} />
			{tipo === 'success' && <path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
			{tipo === 'info' && <path d="M12 10.5 V17 M12 7 V7.2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />}
			{(tipo === 'warning' || tipo === 'error') && <path d="M12 6.5 V13 M12 16.8 V17" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />}
		</svg>
	);
};

/* ── Botones ───────────────────────────────────────────────────────────────────────────────── */

export const Boton: React.FC<{
	r: Rect;
	tipo?: 'primario' | 'tenue' | 'normal';
	apagado?: boolean;
	encima?: boolean;
	pulsado?: boolean;
	tam?: number;
	children: React.ReactNode;
}> = ({ r, tipo = 'normal', apagado = false, encima = false, pulsado = false, tam = 16, children }) => {
	const primario = tipo === 'primario' && !apagado;
	const fondo = apagado ? TENUE_FONDO : primario ? (encima || pulsado ? '#4096ff' : ACENTO) : tipo === 'tenue' ? (encima ? '#eef4ff' : SUPERFICIE) : SUPERFICIE;
	return (
		<div
			style={{
				position: 'absolute',
				left: r.x,
				top: r.y,
				width: r.ancho,
				height: r.alto,
				boxSizing: 'border-box',
				borderRadius: 8,
				border: primario ? 'none' : `1px solid ${encima && !apagado ? '#4096ff' : BORDE}`,
				background: fondo,
				color: apagado ? 'rgba(0,0,0,.28)' : primario ? '#fff' : encima ? '#4096ff' : TEXTO,
				fontSize: tam,
				fontWeight: primario ? 600 : 500,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
				whiteSpace: 'nowrap',
				transform: pulsado ? 'scale(.97)' : undefined,
			}}
		>
			{children}
		</div>
	);
};

/** Un botón redondo de sólo icono, como «Recargar» e «Imprimir» de la cabecera del informe. */
export const BotonIcono: React.FC<{ r: Rect; que: string; primario?: boolean; encima?: boolean; puesto?: boolean; pulsado?: boolean }> = ({
	r,
	que,
	primario = false,
	encima = false,
	puesto = false,
	pulsado = false,
}) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			borderRadius: 8,
			background: primario ? (encima || pulsado ? '#4096ff' : ACENTO) : puesto ? '#e6f4ff' : encima ? '#f0f5ff' : SUPERFICIE,
			border: primario ? 'none' : `1px solid ${puesto || encima ? '#91caff' : BORDE}`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			transform: pulsado ? 'scale(.94)' : undefined,
		}}
	>
		<Icono que={que} tam={Math.round(r.alto * 0.52)} color={primario ? '#fff' : puesto || encima ? ACENTO : 'rgba(0,0,0,.65)'} />
	</div>
);

/* ── Campos ────────────────────────────────────────────────────────────────────────────────── */

/** `nz-select` cerrado: el valor o el marcador, y la flecha. */
export const Select: React.FC<{ r: Rect; valor: string | null; marcador: string; abierto?: boolean; encima?: boolean; tam?: number }> = ({
	r,
	valor,
	marcador,
	abierto = false,
	encima = false,
	tam = 16,
}) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 12px',
			borderRadius: 8,
			border: `1px solid ${abierto || encima ? '#4096ff' : BORDE}`,
			boxShadow: abierto ? '0 0 0 2px rgba(5,145,255,.1)' : undefined,
			background: SUPERFICIE,
			fontSize: tam,
			color: valor ? TEXTO : '#bfbfbf',
			whiteSpace: 'nowrap',
		}}
	>
		<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{valor ?? marcador}</span>
		<Icono que={abierto ? 'arriba' : 'abajo'} tam={14} color="#bfbfbf" />
	</div>
);

export const ALTO_OPCION = 36;

/** La lista abierta de un `nz-select`, por encima de todo. */
export const Desplegable: React.FC<{ bajo: Rect; opciones: string[]; senalada: number | null; elegida?: number | null; opacidad?: number; tam?: number }> = ({
	bajo,
	opciones,
	senalada,
	elegida = null,
	opacidad = 1,
	tam = 16,
}) => (
	<div
		style={{
			position: 'absolute',
			left: bajo.x,
			top: bajo.y + bajo.alto + 4,
			width: bajo.ancho,
			boxSizing: 'border-box',
			padding: 4,
			background: SUPERFICIE,
			borderRadius: 8,
			boxShadow: '0 6px 16px rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
			opacity: opacidad,
			zIndex: 20,
		}}
	>
		{opciones.map((o, i) => (
			<div
				key={o}
				style={{
					height: ALTO_OPCION,
					display: 'flex',
					alignItems: 'center',
					padding: '0 10px',
					borderRadius: 4,
					fontSize: tam,
					color: TEXTO,
					fontWeight: i === elegida ? 600 : 400,
					background: i === elegida ? '#e6f4ff' : i === senalada ? 'rgba(0,0,0,.04)' : 'transparent',
				}}
			>
				{o}
			</div>
		))}
	</div>
);

/** Dónde cae la opción `i` de un desplegable abierto bajo `bajo`. */
export function rectDeOpcion(bajo: Rect, i: number): Rect {
	return { x: bajo.x + 4, y: bajo.y + bajo.alto + 8 + i * ALTO_OPCION, ancho: bajo.ancho - 8, alto: ALTO_OPCION };
}

/** `myvc-segmentado`: las opciones en fila, la elegida rellena. */
export const Segmentado: React.FC<{ r: Rect; opciones: string[]; elegido: number; encima?: number | null; tam?: number }> = ({ r, opciones, elegido, encima = null, tam = 14.5 }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			display: 'flex',
			padding: 3,
			gap: 2,
			borderRadius: 8,
			background: '#f0f2f5',
		}}
	>
		{opciones.map((o, i) => (
			<div
				key={o}
				style={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 6,
					fontSize: tam,
					fontWeight: i === elegido ? 600 : 500,
					whiteSpace: 'nowrap',
					color: i === elegido ? TEXTO : i === encima ? ACENTO : 'rgba(0,0,0,.6)',
					background: i === elegido ? SUPERFICIE : 'transparent',
					boxShadow: i === elegido ? '0 1px 3px rgba(0,0,0,.12)' : undefined,
				}}
			>
				{o}
			</div>
		))}
	</div>
);

/** Dónde cae la opción `i` de un segmentado de `n`. */
export function rectDeSegmento(r: Rect, n: number, i: number): Rect {
	const ancho = (r.ancho - 6 - (n - 1) * 2) / n;
	return { x: r.x + 3 + i * (ancho + 2), y: r.y + 3, ancho, alto: r.alto - 6 };
}

/** `nz-switch` pequeño. `t` va de 0 (apagado) a 1 (encendido): se anima al pulsarlo. */
export const Interruptor: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: 34,
			height: 18,
			borderRadius: 9,
			background: t > 0.5 ? ACENTO : 'rgba(0,0,0,.25)',
		}}
	>
		<div style={{ position: 'absolute', top: 2, left: 2 + t * 16, width: 14, height: 14, borderRadius: 7, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
	</div>
);

/** `nz-input-number` pequeño, con su valor o el guion del marcador. */
export const CasillaNumero: React.FC<{ r: Rect; valor: string | null; conFoco?: boolean; cursor?: boolean }> = ({ r, valor, conFoco = false, cursor = false }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			padding: '0 8px',
			borderRadius: 6,
			border: `1px solid ${conFoco ? '#4096ff' : BORDE}`,
			boxShadow: conFoco ? '0 0 0 2px rgba(5,145,255,.1)' : undefined,
			background: SUPERFICIE,
			fontSize: 15,
			color: valor ? TEXTO : '#bfbfbf',
			fontVariantNumeric: 'tabular-nums',
		}}
	>
		{valor ?? '—'}
		{cursor && <span style={{ color: TEXTO, marginLeft: 1 }}>|</span>}
	</div>
);

/** `nz-alert` con título y descripción. */
export const Alerta: React.FC<{ tipo: 'info' | 'warning' | 'error' | 'success'; titulo: string; texto?: string; ancho: number; tam?: number; style?: React.CSSProperties }> = ({
	tipo,
	titulo,
	texto,
	ancho,
	tam = 15,
	style,
}) => {
	const [fondo, borde] =
		tipo === 'warning' ? ['#fffbe6', '#ffe58f'] : tipo === 'error' ? ['#fff2f0', '#ffccc7'] : tipo === 'success' ? ['#f6ffed', '#b7eb8f'] : ['#e6f4ff', '#91caff'];
	return (
		<div
			style={{
				width: ancho,
				boxSizing: 'border-box',
				display: 'flex',
				gap: 12,
				padding: '12px 16px',
				borderRadius: 8,
				background: fondo,
				border: `1px solid ${borde}`,
				...style,
			}}
		>
			<div style={{ paddingTop: 2 }}>
				<IconoDeAlerta tipo={tipo} tam={20} />
			</div>
			<div>
				<div style={{ fontSize: tam + 1, fontWeight: 600, color: TEXTO, lineHeight: 1.35 }}>{titulo}</div>
				{texto && <div style={{ fontSize: tam, color: 'rgba(0,0,0,.72)', lineHeight: 1.45, marginTop: 3 }}>{texto}</div>}
			</div>
		</div>
	);
};
