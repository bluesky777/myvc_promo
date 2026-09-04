import React from 'react';
import { interpolate } from 'remotion';

import { AZUL, AZUL_SUAVE, MONO, PAPEL, RAYA, RAYA2, RELLENO, SANS, SERIF, TARJETA, TINTA, TINTA2, TINTA3, TINTA_AZUL } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS DEL PORTAL. Las mismas seis o siete formas se repiten en las veinte pantallas del
 * diseño --tarjeta, cifra grande, píldora, barra, chip de estado, aviso azul-- y aquí están una
 * sola vez para que los seis clips no se separen entre sí.
 *
 * Cada una acepta un `t` de 0 a 1: **lo que la anima**. Se calcula fuera, en la escena, con las
 * funciones de `comunes/movimiento.ts`; aquí sólo se dibuja. Así el ritmo vive en el guion del clip
 * y la forma vive aquí, que es lo que permite cambiar uno sin tocar el otro.
 */

/** El texto pequeño en versalitas que encabeza cada bloque del portal. */
export const Over: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = TINTA3 }) => (
	<div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color, fontWeight: 500 }}>{children}</div>
);

/** Una tarjeta: papel, raya fina, titular serif y su subtítulo. */
export const Tarjeta: React.FC<{
	titulo: string;
	sub?: string;
	t?: number;
	ancho?: number | string;
	leyenda?: React.ReactNode;
	children: React.ReactNode;
}> = ({ titulo, sub, t = 1, ancho, leyenda, children }) => (
	<div
		style={{
			width: ancho,
			background: TARJETA,
			border: `1px solid ${RAYA}`,
			borderRadius: 6,
			padding: '22px 24px 18px',
			display: 'flex',
			flexDirection: 'column',
			gap: 16,
			boxSizing: 'border-box',
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [22, 0])}px)`,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
				<div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', color: TINTA }}>{titulo}</div>
				{sub ? <div style={{ fontSize: 12, color: TINTA3 }}>{sub}</div> : null}
			</div>
			{leyenda ? <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0, paddingTop: 2 }}>{leyenda}</div> : null}
		</div>
		{children}
	</div>
);

/** La marca de color con su etiqueta, para las leyendas de los gráficos. */
export const Muestra: React.FC<{ color: string; children: React.ReactNode; redondo?: boolean }> = ({ color, children, redondo = false }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TINTA2 }}>
		<span style={{ width: 11, height: 11, borderRadius: redondo ? '50%' : 2, background: color }} />
		{children}
	</div>
);

/*
 * UNA CIFRA QUE SUBE. **No es un adorno**: una cifra que aparece ya puesta se lee como un rótulo,
 * y una que sube se lee como una medición. En un portal cuya gracia es decir «subió o bajó», esa
 * diferencia es el argumento entero.
 *
 * Cuenta desde el 0 hasta su valor y se formatea a la española --punto de millar, coma decimal--,
 * que es como lo escribe el portal.
 */
export const Cifra: React.FC<{
	valor: number;
	t: number;
	decimales?: number;
	sufijo?: string;
	tam?: number;
	color?: string;
}> = ({ valor, t, decimales = 0, sufijo = '', tam = 36, color = TINTA }) => {
	const v = valor * interpolate(t, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const texto = v.toLocaleString('es-ES', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
	return (
		<span
			style={{
				fontFamily: SERIF,
				fontVariantNumeric: 'tabular-nums',
				fontSize: tam,
				fontWeight: 500,
				lineHeight: 1,
				letterSpacing: '-0.02em',
				color,
			}}
		>
			{texto}{sufijo}
		</span>
	);
};

/** El triangulito verde de «sube», el rojo de «baja» y el plano sin flecha. */
export const Delta: React.FC<{ sentido: 'sube' | 'baja' | 'plano'; texto: string; extra?: string; bueno?: boolean }> = ({
	sentido, texto, extra, bueno = false,
}) => {
	const color = sentido === 'sube' ? '#12876B' : sentido === 'baja' ? (bueno ? '#12876B' : '#C0521C') : TINTA2;
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color, fontWeight: 600 }}>
			{sentido !== 'plano' ? (
				<svg width="11" height="11" viewBox="0 0 12 12" fill={color}>
					<path d={sentido === 'sube' ? 'M6 1.5 10.5 9h-9L6 1.5Z' : 'M6 10.5 1.5 3h9L6 10.5Z'} />
				</svg>
			) : null}
			<span style={{ fontVariantNumeric: 'tabular-nums' }}>{texto}</span>
			{extra ? <span style={{ color: TINTA3, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{extra}</span> : null}
		</div>
	);
};

export interface DatoKpi {
	etiqueta: string;
	valor: number;
	decimales?: number;
	sufijo?: string;
	delta?: React.ReactNode;
	pie: string;
}

/** La fila de cifras grandes de la cabecera, separadas por rayas verticales. */
export const FilaKpi: React.FC<{ datos: DatoKpi[]; t: (i: number) => number }> = ({ datos, t }) => (
	<div style={{ display: 'grid', gridTemplateColumns: `repeat(${datos.length}, minmax(0, 1fr))` }}>
		{datos.map((d, i) => (
			<div
				key={d.etiqueta}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 6,
					paddingRight: i === datos.length - 1 ? 0 : 22,
					paddingLeft: i === 0 ? 0 : 22,
					borderLeft: i === 0 ? 'none' : `1px solid ${RAYA}`,
					opacity: interpolate(t(i), [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }),
				}}
			>
				<Over>{d.etiqueta}</Over>
				<Cifra valor={d.valor} t={t(i)} decimales={d.decimales} sufijo={d.sufijo} />
				{d.delta}
				<div style={{ fontSize: 11, color: TINTA3 }}>{d.pie}</div>
			</div>
		))}
	</div>
);

/** Una píldora de filtro. Encendida es tinta azul; apagada, papel con su raya. */
export const Pildora: React.FC<{ on?: boolean; children: React.ReactNode; icono?: React.ReactNode }> = ({ on = false, children, icono }) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 7,
			borderRadius: 20,
			padding: '8px 15px',
			fontSize: 12.5,
			background: on ? TINTA_AZUL : PAPEL,
			color: on ? TARJETA : TINTA2,
			border: `1px solid ${on ? TINTA_AZUL : RAYA2}`,
			fontWeight: on ? 600 : 500,
			whiteSpace: 'nowrap',
		}}
	>
		{icono}
		{children}
	</div>
);

/** El chip de estado con borde de color: «Evento», «Abierta», «en meta». */
export const Chip: React.FC<{ color: string; children: React.ReactNode; icono?: React.ReactNode }> = ({ color, children, icono }) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 5,
			border: `1px solid ${color}`,
			color,
			borderRadius: 12,
			padding: '2px 9px',
			fontSize: 10.5,
			fontWeight: 600,
			whiteSpace: 'nowrap',
		}}
	>
		{icono}
		{children}
	</span>
);

/** Una barra horizontal que crece. `t` la llena; el fondo siempre está. */
export const Barra: React.FC<{ pct: number; t: number; color?: string; alto?: number; fondo?: string }> = ({
	pct, t, color = AZUL, alto = 16, fondo = RELLENO,
}) => (
	<span style={{ flexGrow: 1, height: alto, background: fondo, borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
		<span style={{ width: `${pct * Math.min(1, Math.max(0, t))}%`, background: color, borderRadius: 4 }} />
	</span>
);

/** El aviso azul de pie de tarjeta: lo que el portal quiere que se entienda, dicho con palabras. */
export const Aviso: React.FC<{ icono?: React.ReactNode; children: React.ReactNode; fondo?: string; t?: number }> = ({
	icono, children, fondo = AZUL_SUAVE, t = 1,
}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 10,
			background: fondo,
			borderRadius: 5,
			padding: '12px 14px',
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [10, 0])}px)`,
		}}
	>
		{icono ? <span style={{ flexShrink: 0, display: 'flex' }}>{icono}</span> : null}
		<div style={{ fontSize: 11.5, color: TINTA2, lineHeight: 1.45 }}>{children}</div>
	</div>
);

/** Un botón. El primario es tinta azul llena; el secundario, papel con raya. */
export const Boton: React.FC<{ primario?: boolean; children: React.ReactNode; icono?: React.ReactNode; resalte?: number }> = ({
	primario = false, children, icono, resalte = 0,
}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 8,
			background: primario ? TINTA_AZUL : TARJETA,
			color: primario ? TARJETA : TINTA,
			border: primario ? `1px solid ${TINTA_AZUL}` : `1px solid ${RAYA2}`,
			borderRadius: 5,
			padding: primario ? '13px 24px' : '12px 20px',
			fontSize: primario ? 13.5 : 13,
			fontWeight: primario ? 600 : 500,
			whiteSpace: 'nowrap',
			/* Al pulsarlo se hunde un poco: es lo que hace que el clic se vea y no sólo se deduzca. */
			transform: `scale(${1 - resalte * 0.035})`,
			boxShadow: resalte > 0 ? `0 0 0 ${resalte * 6}px rgba(32,115,174,${0.18 * (1 - resalte)})` : 'none',
		}}
	>
		{icono}
		{children}
	</div>
);

/** Texto monoespaciado con cifras de ancho fijo, como lo escribe el portal. */
export const Num: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
	<span style={{ fontFamily: MONO, fontVariantNumeric: 'tabular-nums', ...style }}>{children}</span>
);

export const FUENTE_BASE: React.CSSProperties = { fontFamily: SANS, color: TINTA, WebkitFontSmoothing: 'antialiased' };
