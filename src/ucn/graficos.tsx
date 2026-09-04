import React from 'react';
import { interpolate } from 'remotion';

import { MONO, RAYA, RAYA2, TINTA, TINTA2, TINTA3 } from './tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS GRÁFICOS DEL PORTAL, DIBUJADOS PARA MOVERSE.
 *
 * Son los mismos cuatro que usan las veinte pantallas del diseño --barras de pie, barras de lado,
 * una línea de años y el enjambre de puntos-- y están aquí una vez para que los cuatro clips de
 * cifras no se separen entre sí.
 *
 * TODOS RECIBEN UN `t` DE 0 A 1 Y CRECEN. No es adorno: una barra que aparece con su altura puesta
 * se lee como un dibujo, y una que crece se lee como una medición. En un portal cuya gracia es decir
 * «subió o bajó», eso es la mitad de lo que hay que enseñar.
 *
 * Y CRECEN EN CASCADA, no a la vez: el ojo recorre la serie en el orden en que hay que leerla. Cada
 * gráfico calcula el `t` de cada elemento con `paso`, igual que las filas de una tabla.
 */

/** El `t` de un elemento de una serie que entra en cascada. */
export function tSerie(frame: number, desde: number, indice: number, paso = 4, dur = 18): number {
	return interpolate(frame, [desde + indice * paso, desde + indice * paso + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

/**
 * CIFRAS A LA ESPAÑOLA: punto de millar y coma decimal, **también en los cuatro dígitos**. El
 * `toLocaleString` de `es-ES` deja «3716» sin punto, y el portal escribe «3.716»: dos cifras juntas
 * con dos criterios distintos --11.008 y 3716-- se leen como un error de la pantalla.
 */
export function num(v: number, decimales = 0): string {
	const partes = v.toLocaleString('es-ES', { minimumFractionDigits: decimales, maximumFractionDigits: decimales, useGrouping: false }).split(',');
	partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return partes.join(',');
}

/* ── Barras de pie, con su eje y su rejilla ────────────────────────────────────────────────── */

export const BarrasVerticales: React.FC<{
	datos: { etiqueta: string; valor: number; color?: string; tenue?: boolean; fuerte?: boolean }[];
	frame: number;
	desde: number;
	ancho: number;
	alto: number;
	color: string;
	max?: number;
	rejilla?: number[];
	decimales?: number;
	pie?: string;
	nota?: { x: number; y: number; texto: string };
}> = ({ datos, frame, desde, ancho, alto, color, max, rejilla = [], decimales = 0, pie, nota }) => {
	const tope = max ?? Math.max(...datos.map((d) => d.valor));
	const izq = 46;
	const base = alto - 42;
	const util = ancho - izq - 16;
	const paso = util / datos.length;
	const anchoBarra = Math.min(46, paso * 0.62);

	return (
		<svg width="100%" viewBox={`0 0 ${ancho} ${alto}`} fill="none" style={{ display: 'block' }}>
			{rejilla.map((v) => {
				const y = base - (v / tope) * (base - 24);
				return (
					<g key={v}>
						<line x1={izq} y1={y} x2={ancho - 16} y2={y} stroke={RAYA} strokeWidth="1" />
						<text x={izq - 8} y={y + 3.5} textAnchor="end" fontFamily={MONO} fontSize="10" fill={TINTA3}>{num(v)}</text>
					</g>
				);
			})}
			<line x1={izq} y1={base} x2={ancho - 16} y2={base} stroke={RAYA2} strokeWidth="1" />

			{datos.map((d, i) => {
				const t = tSerie(frame, desde, i, 3.5, 16);
				const h = (d.valor / tope) * (base - 24) * t;
				const x = izq + paso * i + (paso - anchoBarra) / 2;
				return (
					<g key={d.etiqueta}>
						<rect x={x} y={base - h} width={anchoBarra} height={Math.max(0, h)} rx="4" fill={d.color ?? color} opacity={d.tenue ? 0.45 : 1} />
						<text x={x + anchoBarra / 2} y={base - h - 8} textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight={d.fuerte ? 600 : 500} fill={d.fuerte ? (d.color ?? color) : TINTA2} opacity={t}>
							{num(Math.round(d.valor * t), decimales)}
						</text>
						<text x={x + anchoBarra / 2} y={base + 18} textAnchor="middle" fontFamily={MONO} fontSize="10.5" fontWeight={d.fuerte ? 600 : 400} fill={d.fuerte ? TINTA : TINTA3}>
							{d.etiqueta}
						</text>
					</g>
				);
			})}

			{nota ? <text x={nota.x} y={nota.y} fontSize="10.5" fill={TINTA3} fontStyle="italic">{nota.texto}</text> : null}
			{pie ? <text x={izq} y={alto - 6} fontSize="10.5" fill={TINTA3}>{pie}</text> : null}
		</svg>
	);
};

/* ── Barras de lado, con el nombre a la izquierda ──────────────────────────────────────────── */

export const BarrasHorizontales: React.FC<{
	datos: { etiqueta: string; valor: number; texto?: string; color?: string; extra?: string }[];
	frame: number;
	desde: number;
	ancho: number;
	altoFila?: number;
	anchoEtiqueta: number;
	color: string;
	max?: number;
	sufijo?: string;
	decimales?: number;
	referencia?: { valor: number; texto: string; color: string };
	pie?: string;
}> = ({ datos, frame, desde, ancho, altoFila = 26, anchoEtiqueta, color, max, sufijo = '', decimales = 0, referencia, pie }) => {
	const tope = max ?? Math.max(...datos.map((d) => d.valor));
	const util = ancho - anchoEtiqueta - 110;
	const alto = datos.length * altoFila + (pie || referencia ? 26 : 10) + 12;

	return (
		<svg width="100%" viewBox={`0 0 ${ancho} ${alto}`} fill="none" style={{ display: 'block' }}>
			{referencia ? (
				<>
					<line
						x1={anchoEtiqueta + 8 + (referencia.valor / tope) * util}
						y1={2}
						x2={anchoEtiqueta + 8 + (referencia.valor / tope) * util}
						y2={datos.length * altoFila + 2}
						stroke={referencia.color}
						strokeWidth="1.3"
						strokeDasharray="4 3"
					/>
					{/*
					 * EL RÓTULO DE LA REFERENCIA VA DEBAJO, no arriba: en un panel estrecho la línea cae
					 * justo donde termina la barra más larga, y arriba se le monta encima a su cifra.
					 */}
					<text
						x={anchoEtiqueta + 8 + (referencia.valor / tope) * util}
						y={datos.length * altoFila + 22}
						textAnchor="middle"
						fontSize="10.5"
						fontWeight="600"
						fill={referencia.color}
					>
						{referencia.texto}
					</text>
				</>
			) : null}

			{datos.map((d, i) => {
				const t = tSerie(frame, desde, i, 4, 16);
				const y = 14 + i * altoFila;
				const w = (d.valor / tope) * util * t;
				return (
					<g key={d.etiqueta}>
						<text x={anchoEtiqueta} y={y + 4} textAnchor="end" fontSize="11.5" fill={TINTA}>{d.etiqueta}</text>
						<rect x={anchoEtiqueta + 8} y={y - 8} width={Math.max(0, w)} height="16" rx="4" fill={d.color ?? color} />
						<text x={anchoEtiqueta + 16 + w} y={y + 4} fontFamily={MONO} fontSize="11.5" fontWeight="500" fill={TINTA} opacity={t}>
							{num(d.valor * t, decimales)}{sufijo}
						</text>
						{d.extra ? (
							<text x={anchoEtiqueta + 16 + w + 46} y={y + 4} fontFamily={MONO} fontSize="10.5" fill={TINTA3} opacity={t}>{d.extra}</text>
						) : null}
					</g>
				);
			})}

			{pie ? <text x={anchoEtiqueta + 8} y={alto - 6} fontSize="10.5" fill={TINTA3}>{pie}</text> : null}
		</svg>
	);
};

/* ── Una línea de años que se dibuja sola ──────────────────────────────────────────────────── */

export const Linea: React.FC<{
	valores: number[];
	anios: number[];
	frame: number;
	desde: number;
	dur?: number;
	ancho: number;
	alto: number;
	color: string;
	min: number;
	max: number;
	meta?: { valor: number; texto: string; color: string };
	pie?: string;
}> = ({ valores, anios, frame, desde, dur = 46, ancho, alto, color, min, max, meta, pie }) => {
	const izq = 46;
	const base = alto - 46;
	const util = ancho - izq - 30;
	const paso = util / (valores.length - 1);
	const y = (v: number) => base - ((v - min) / (max - min)) * (base - 22);
	const x = (i: number) => izq + i * paso;

	/*
	 * LA LÍNEA SE DIBUJA DE IZQUIERDA A DERECHA, año a año, en vez de aparecer entera: es una serie
	 * temporal, y verla avanzar en el tiempo es exactamente lo que dice el gráfico.
	 */
	const avance = interpolate(frame, [desde, desde + dur], [0, valores.length - 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const puntos: string[] = [];
	for (let i = 0; i < valores.length; i++) {
		if (i <= Math.floor(avance)) {
			puntos.push(`${x(i)},${y(valores[i]).toFixed(1)}`);
		} else if (i - 1 < avance) {
			const f = avance - (i - 1);
			const xi = x(i - 1) + paso * f;
			const yi = y(valores[i - 1]) + (y(valores[i]) - y(valores[i - 1])) * f;
			puntos.push(`${xi.toFixed(1)},${yi.toFixed(1)}`);
		}
	}

	return (
		<svg width="100%" viewBox={`0 0 ${ancho} ${alto}`} fill="none" style={{ display: 'block' }}>
			<line x1={izq} y1={base} x2={ancho - 30} y2={base} stroke={RAYA2} strokeWidth="1" />
			{meta ? (
				<>
					<rect x={izq} y={y(max)} width={util} height={Math.max(0, y(meta.valor) - y(max))} fill={meta.color} opacity="0.06" />
					<line x1={izq} y1={y(meta.valor)} x2={ancho - 30} y2={y(meta.valor)} stroke={meta.color} strokeWidth="1.6" strokeDasharray="5 3" />
					<text x={ancho - 30} y={y(meta.valor) - 7} textAnchor="end" fontSize="11" fontWeight="600" fill={meta.color}>{meta.texto}</text>
				</>
			) : null}

			{puntos.length > 1 ? <polyline points={puntos.join(' ')} stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : null}

			{valores.map((v, i) => (
				i <= avance ? <circle key={anios[i]} cx={x(i)} cy={y(v)} r="3.6" fill={color} /> : null
			))}

			{anios.map((a, i) => (
				/* Ocho años en un panel estrecho: a 10 px los rótulos se tocan. */
				<text key={a} x={x(i)} y={base + 20} textAnchor="middle" fontFamily={MONO} fontSize="9" fill={TINTA3}>{a}</text>
			))}

			{/* El primero y el último llevan su cifra: son los dos que se comparan. */}
			<text x={x(0)} y={y(valores[0]) - 10} textAnchor="middle" fontFamily={MONO} fontSize="10.5" fill={TINTA2} opacity={avance > 0 ? 1 : 0}>
				{num(valores[0], 1)}
			</text>
			<text x={x(valores.length - 1)} y={y(valores[valores.length - 1]) + 18} textAnchor="middle" fontFamily={MONO} fontSize="11.5" fontWeight="600" fill={color} opacity={avance >= valores.length - 1 ? 1 : 0}>
				{num(valores[valores.length - 1], 1)}
			</text>

			{pie ? <text x={izq} y={alto - 6} fontSize="10.5" fill={TINTA3}>{pie}</text> : null}
		</svg>
	);
};
