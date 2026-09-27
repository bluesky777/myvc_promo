import React from 'react';
import { interpolate } from 'remotion';

import { ACENTO } from '../../notas/tema';
import { Over } from '../piezas';
import { AZUL, MONO, PAPEL, RAYA, RAYA2, SANS, SERIF, TARJETA, TINTA, TINTA2, TINTA3, VERDE } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS FIGURAS DEL DIAGRAMA DE LA RED. Como en `ucn/piezas.tsx`, cada una acepta un `t` de 0 a 1 y
 * **aquí sólo se dibuja**: el ritmo se calcula en la escena, con el guion delante. Así se puede
 * mover un tiempo sin abrir este fichero y cambiar una forma sin tocar el ritmo.
 *
 * TODAS SON DE PAPEL, no de pizarra. Un diagrama con cajas grises y flechas negras se lee como un
 * esquema de ingeniería; éste tiene que leerse como la misma cosa que las seis pantallas de al lado,
 * porque cuenta lo que hace el mismo producto.
 */

/* ── LOS ICONOS. Del mismo trazo que los del rail: 1,6 de grosor y las puntas redondeadas. ─── */

const Trazo: React.FC<{ d: string; tam: number; color: string; grosor?: number }> = ({ d, tam, color, grosor = 1.6 }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: d }} />
);

const COLEGIO_D = '<path d="M2.5 21h19"></path><path d="M4.5 21V9.5L12 4l7.5 5.5V21"></path><path d="M9.5 21v-5.5h5V21"></path><path d="M9.5 11h1.2M13.3 11h1.2"></path>';

/** Los tres del historial, en el mismo orden que los nombra la voz. */
const HISTORIAL_D: Record<string, string> = {
	notas: '<path d="M6 3h9l3 3v15H6V3Z"></path><path d="M15 3v3.5h3"></path><path d="M9 12h6M9 16h4"></path>',
	convivencia: '<path d="M3 10.5v3a1 1 0 0 0 1 1h2l3.5 3v-11L6 9.5H4a1 1 0 0 0-1 1Z"></path><path d="M14 9a4 4 0 0 1 0 6"></path><path d="M17 6.5a8 8 0 0 1 0 11"></path>',
	certificados: '<circle cx="12" cy="9" r="5"></circle><path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8"></path>',
};

const Visto: React.FC<{ t: number; tam?: number; color?: string }> = ({ t, tam = 15, color = VERDE }) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: interpolate(t, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }) }}>
		<circle cx="12" cy="12" r="10.5" fill={color} opacity={0.12} />
		{/* El visto **se dibuja**, no aparece: es el gesto de comprobar, no el resultado. */}
		<path
			d="M7 12.4 10.6 16 17 8.8"
			fill="none"
			stroke={color}
			strokeWidth="2.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			pathLength={1}
			strokeDasharray={1}
			strokeDashoffset={1 - interpolate(t, [0.15, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
		/>
	</svg>
);

/* ── EL COLEGIO ────────────────────────────────────────────────────────────────────────────── */

export const ANCHO_COLEGIO = 380;
export const ALTO_COLEGIO = 336;
/** Dónde empieza el hueco de la ficha dentro de la tarjeta. La escena lo necesita para el viaje. */
export const HUECO = { x: 24, y: 108, ancho: 332, alto: 204 };

/**
 * UNA TARJETA DE COLEGIO CON UN HUECO DENTRO. **La ficha no se dibuja aquí**: vive en la escena,
 * suelta, y pasa por encima de los dos huecos. Si cada colegio dibujara su ficha habría dos fichas
 * --una que se va y otra que aparece-- y el traslado dejaría de ser un viaje para ser un corte.
 */
export const Colegio: React.FC<{ papel: string; nombre: string; color: string; t: number; nota?: string; tNota?: number }> = ({
	papel, nombre, color, t, nota, tNota = 0,
}) => (
	<div
		style={{
			width: ANCHO_COLEGIO,
			height: ALTO_COLEGIO,
			background: TARJETA,
			border: `1px solid ${RAYA}`,
			borderTop: `5px solid ${color}`,
			borderRadius: 8,
			boxSizing: 'border-box',
			padding: '20px 24px',
			position: 'relative',
			boxShadow: '0 18px 40px rgba(30,29,25,.10)',
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [26, 0])}px)`,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
			<div style={{ width: 44, height: 44, borderRadius: 9, background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
				<Trazo d={COLEGIO_D} tam={24} color={color} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
				<Over color={color}>{papel}</Over>
				<div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', color: TINTA, lineHeight: 1.1 }}>{nombre}</div>
			</div>
		</div>

		{/* El hueco. Con la raya discontinua se lee «aquí va una ficha» aunque esté vacío. */}
		<div
			style={{
				position: 'absolute',
				left: HUECO.x,
				top: HUECO.y,
				width: HUECO.ancho,
				height: HUECO.alto,
				border: `1.5px dashed ${RAYA2}`,
				borderRadius: 7,
				background: PAPEL,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{nota ? (
				<div style={{ fontSize: 13, color: TINTA3, fontStyle: 'italic', opacity: interpolate(tNota, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{nota}</div>
			) : null}
		</div>
	</div>
);

/* ── LA FICHA DE LA ALUMNA ─────────────────────────────────────────────────────────────────── */

export const ANCHO_FICHA = 300;

/**
 * LA FICHA QUE VIAJA: la alumna y su historial, en una sola cosa que se puede coger y mover. Ése es
 * el argumento entero del acto -- lo que cambia de colegio no es un nombre, es el expediente.
 *
 * `visto(i)` es lo que lleva dibujado el tic de cada carpeta: 0 mientras viaja, 1 cuando ya llegó.
 */
export const Ficha: React.FC<{
	nombre: string;
	grupo: string;
	avatar: React.ReactNode;
	t: number;
	tDoc: (i: number) => number;
	visto: (i: number) => number;
	docs: { clave: string; texto: string }[];
	/** Cuánto se ha despegado del papel, de 0 a 1: la sombra crece con el vuelo. */
	vuelo?: number;
}> = ({ nombre, grupo, avatar, t, tDoc, visto, docs, vuelo = 0 }) => (
	<div
		style={{
			width: ANCHO_FICHA,
			background: TARJETA,
			border: `1px solid ${RAYA2}`,
			borderRadius: 7,
			padding: '14px 16px',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			gap: 12,
			fontFamily: SANS,
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			boxShadow: `0 ${6 + vuelo * 26}px ${16 + vuelo * 44}px rgba(30,29,25,${0.10 + vuelo * 0.18})`,
		}}
	>
		<div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
			{avatar}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
				<div style={{ fontSize: 14, fontWeight: 600, color: TINTA, whiteSpace: 'nowrap' }}>{nombre}</div>
				<div style={{ fontSize: 11.5, color: TINTA3 }}>{grupo}</div>
			</div>
		</div>

		<div style={{ height: 1, background: RAYA }} />

		<div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
			{docs.map((d, i) => {
				const td = tDoc(i);
				return (
					<div
						key={d.clave}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 9,
							fontSize: 12.5,
							color: TINTA2,
							opacity: interpolate(td, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
							transform: `translateX(${interpolate(td, [0, 1], [-12, 0])}px)`,
						}}
					>
						<Trazo d={HISTORIAL_D[d.clave] ?? ''} tam={16} color={AZUL} />
						<span style={{ flexGrow: 1 }}>{d.texto}</span>
						<Visto t={visto(i)} />
					</div>
				);
			})}
		</div>
	</div>
);

/* ── EL CÓDIGO QR ──────────────────────────────────────────────────────────────────────────── */

const LADO_QR = 21;

/**
 * LA RETÍCULA DEL CÓDIGO. **Se calcula una sola vez, al cargar el módulo, y no dentro del
 * componente**: en Remotion cada fotograma se dibuja por separado, así que un patrón sacado de
 * `Math.random()` en el render saldría distinto en cada fotograma y el código herviría.
 *
 * No codifica nada --no es un QR que se pueda leer-- y no hace falta que lo sea: lleva sus tres ojos
 * y sus pautas de sincronía, que es lo que hace que a tamaño de vídeo se lea «esto es un QR».
 */
function reticula(): boolean[][] {
	const n = LADO_QR;
	const m: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
	const fijo: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false));

	const ojo = (ox: number, oy: number) => {
		for (let y = -1; y <= 7; y++) {
			for (let x = -1; x <= 7; x++) {
				const px = ox + x;
				const py = oy + y;
				if (px < 0 || py < 0 || px >= n || py >= n) { continue; }
				fijo[py][px] = true;
				const dentro = x >= 0 && x <= 6 && y >= 0 && y <= 6;
				const borde = x === 0 || x === 6 || y === 0 || y === 6;
				const centro = x >= 2 && x <= 4 && y >= 2 && y <= 4;
				m[py][px] = dentro && (borde || centro);
			}
		}
	};
	ojo(0, 0);
	ojo(n - 7, 0);
	ojo(0, n - 7);

	for (let i = 8; i < n - 8; i++) {
		m[6][i] = i % 2 === 0;
		fijo[6][i] = true;
		m[i][6] = i % 2 === 0;
		fijo[i][6] = true;
	}

	/* Lehmer, con el multiplicador clásico: cabe de sobra en un entero y sale igual en cada render. */
	let s = 20260904;
	for (let y = 0; y < n; y++) {
		for (let x = 0; x < n; x++) {
			if (fijo[y][x]) { continue; }
			s = (s * 16807) % 2147483647;
			m[y][x] = (s >> 5) % 100 < 47;
		}
	}
	return m;
}

const RETICULA = reticula();

/** El código, dibujándose en diagonal desde la esquina de arriba. `t` de 0 a 1. */
export const Qr: React.FC<{ t: number; tam: number; color?: string }> = ({ t, tam, color = TINTA }) => {
	const paso = tam / LADO_QR;
	const avance = interpolate(t, [0, 1], [0, LADO_QR * 2 + 8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} style={{ display: 'block' }}>
			<rect x="0" y="0" width={tam} height={tam} fill={TARJETA} />
			{RETICULA.map((fila, y) =>
				fila.map((on, x) => {
					if (!on) { return null; }
					const o = Math.max(0, Math.min(1, (avance - (x + y)) / 6));
					if (o <= 0.001) { return null; }
					return <rect key={`${x}-${y}`} x={x * paso} y={y * paso} width={paso + 0.4} height={paso + 0.4} fill={color} opacity={o} />;
				}),
			)}
		</svg>
	);
};

/* ── EL CERTIFICADO ────────────────────────────────────────────────────────────────────────── */

export const ANCHO_CERT = 420;
export const ALTO_CERT = 520;
/** Dónde queda el código dentro del papel. La escena apunta ahí el haz del teléfono. */
export const QR_EN_CERT = { x: 264, y: 336, tam: 124 };

export const Certificado: React.FC<{
	emisor: string;
	titulo: string;
	lineas: [string, string][];
	codigo: string;
	pie: string;
	t: number;
	tLinea: (i: number) => number;
	tQr: number;
}> = ({ emisor, titulo, lineas, codigo, pie, t, tLinea, tQr }) => (
	<div
		style={{
			width: ANCHO_CERT,
			height: ALTO_CERT,
			background: TARJETA,
			border: `1px solid ${RAYA2}`,
			borderRadius: 4,
			boxSizing: 'border-box',
			padding: '30px 34px',
			position: 'relative',
			fontFamily: SANS,
			boxShadow: '0 26px 60px rgba(30,29,25,.16)',
			opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
			transform: `translateY(${interpolate(t, [0, 1], [24, 0])}px)`,
		}}
	>
		{/* La orla: dos rayas finas que recorren el papel. Es lo que hace que se lea «documento». */}
		<div style={{ position: 'absolute', inset: 10, border: `1px solid ${RAYA}`, borderRadius: 2, pointerEvents: 'none' }} />

		<div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', textAlign: 'center' }}>
			<Over>{emisor}</Over>
			<div style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 600, letterSpacing: '-0.015em', color: TINTA }}>{titulo}</div>
			<div style={{ width: 64, height: 2, background: AZUL, borderRadius: 1, marginTop: 2 }} />
		</div>

		<div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 26 }}>
			{lineas.map(([etiqueta, valor], i) => {
				const tl = tLinea(i);
				return (
					<div key={etiqueta} style={{ display: 'flex', flexDirection: 'column', gap: 3, opacity: interpolate(tl, [0, 0.6], [0, 1], { extrapolateRight: 'clamp' }) }}>
						<Over>{etiqueta}</Over>
						<div style={{ fontSize: 15, color: TINTA, fontWeight: 500 }}>{valor}</div>
						<div style={{ height: 1, background: RAYA, width: `${interpolate(tl, [0, 1], [0, 100], { extrapolateRight: 'clamp' })}%` }} />
					</div>
				);
			})}
		</div>

		<div style={{ position: 'absolute', left: 34, bottom: 34, width: 190, display: 'flex', flexDirection: 'column', gap: 7 }}>
			<div style={{ fontFamily: MONO, fontSize: 12, color: TINTA2, letterSpacing: '0.02em', opacity: interpolate(tQr, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) }}>{codigo}</div>
			<div style={{ fontSize: 11, color: TINTA3, lineHeight: 1.4, opacity: interpolate(tQr, [0.3, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{pie}</div>
		</div>

		<div style={{ position: 'absolute', left: QR_EN_CERT.x, top: QR_EN_CERT.y }}>
			<Qr t={tQr} tam={QR_EN_CERT.tam} />
		</div>
	</div>
);

/* ── EL SELLO ──────────────────────────────────────────────────────────────────────────────── */

/** La orla dentada del sello: dos radios alternos y veintidós puntas. */
function roseta(cx: number, cy: number, r1: number, r2: number, puntas: number): string {
	const p: string[] = [];
	for (let i = 0; i < puntas * 2; i++) {
		const a = (Math.PI * i) / puntas - Math.PI / 2;
		const r = i % 2 === 0 ? r1 : r2;
		p.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
	}
	return `M${p.join('L')}Z`;
}

/**
 * EL SELLO CON SU VISTO. Sale **después** de que el teléfono confirme, nunca antes: un sello que
 * aparece a la vez que el barrido diría que el resultado estaba decidido de antemano, que es
 * justamente lo contrario de lo que el clip afirma.
 */
export const Sello: React.FC<{ t: number; tVisto: number; color?: string }> = ({ t, tVisto, color = VERDE }) => (
	<svg width="188" height="214" viewBox="0 0 188 214" style={{ display: 'block', overflow: 'visible' }}>
		{/* Las dos colas de la cinta, detrás del disco. */}
		<g opacity={interpolate(t, [0.25, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
			<path d="M70 128 L58 206 L86 188 L104 206 L118 128 Z" fill={color} opacity={0.85} />
			<path d="M70 128 L58 206 L86 188 L94 150 Z" fill="#0E6B54" />
		</g>
		<circle cx="94" cy="94" r="86" fill={color} opacity={0.10} />
		<path d={roseta(94, 94, 76, 68, 22)} fill={color} />
		<circle cx="94" cy="94" r="57" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" />
		<path
			d="M67 95.5 L86 114 L122 74"
			fill="none"
			stroke={TARJETA}
			strokeWidth="9"
			strokeLinecap="round"
			strokeLinejoin="round"
			pathLength={1}
			strokeDasharray={1}
			strokeDashoffset={1 - interpolate(tVisto, [0, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
		/>
	</svg>
);

/* ── LAS DOS INSIGNIAS Y LAS FLECHAS ───────────────────────────────────────────────────────── */

export const LADO_INSIGNIA = 210;

/**
 * MyVC VA CON EL AZUL DE LA APLICACIÓN (`notas/tema.ts`) Y NO CON EL DEL PORTAL, y es la misma
 * licencia que se toma el teléfono en `ucn/Movil.tsx`: aquí MyVC no es la piel del clip, **es uno de
 * los dos personajes**. Pintarlo del azul del portal lo confundiría con el fondo del que sale.
 *
 * SUNPLUS ES SU NOMBRE EN UNA TARJETA DE PAPEL, no una imitación de su logotipo: enseña «el otro
 * programa», que es lo único que hace falta decir, sin apropiarse de una marca ajena.
 */
export const Insignia: React.FC<{ texto: string; pie: string; t: number; golpe: number; propia?: boolean }> = ({ texto, pie, t, golpe, propia = false }) => (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: interpolate(t, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' }) }}>
		<div
			style={{
				width: LADO_INSIGNIA,
				height: LADO_INSIGNIA,
				borderRadius: 38,
				background: propia ? ACENTO : TARJETA,
				border: propia ? `1px solid ${ACENTO}` : `1px solid ${RAYA2}`,
				color: propia ? '#ffffff' : TINTA,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: propia ? SANS : SERIF,
				fontSize: propia ? 54 : 46,
				fontWeight: propia ? 700 : 500,
				letterSpacing: propia ? '-0.02em' : '-0.01em',
				boxSizing: 'border-box',
				/* Al recibir la flecha se hincha un poco y suelta un aro: acusa el golpe. */
				transform: `scale(${interpolate(t, [0, 1], [0.86, 1], { extrapolateRight: 'clamp' }) + golpe * 0.05})`,
				boxShadow: golpe > 0.001
					? `0 14px 34px rgba(30,29,25,.14), 0 0 0 ${golpe * 12}px ${propia ? 'rgba(22,119,255,' : 'rgba(18,135,107,'}${0.20 * (1 - golpe)})`
					: '0 14px 34px rgba(30,29,25,.14)',
			}}
		>
			{texto}
		</div>
		<div style={{ fontSize: 15, color: TINTA3 }}>{pie}</div>
	</div>
);

export type Punto = { x: number; y: number };

function bezier(a: Punto, c: Punto, b: Punto, t: number): Punto {
	const u = 1 - t;
	return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/**
 * LA FLECHA QUE SE LANZA. La punta va delante y la estela se dibuja detrás, **muestreando la misma
 * curva**: con `stroke-dasharray` sobre el trazo, la punta y el final de la estela se separan unos
 * píxeles --la longitud de arco no avanza como el parámetro de la curva-- y a cámara lenta se ve.
 */
export const Flecha: React.FC<{
	desde: Punto;
	control: Punto;
	hasta: Punto;
	t: number;
	color: string;
	etiqueta: string;
	/** Dónde se pone el texto respecto de la curva. */
	desvioEtiqueta: number;
}> = ({ desde, control, hasta, t, color, etiqueta, desvioEtiqueta }) => {
	if (t <= 0.001) { return null; }

	const pasos = 48;
	const puntos: string[] = [];
	for (let i = 0; i <= pasos; i++) {
		const p = bezier(desde, control, hasta, (t * i) / pasos);
		puntos.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
	}

	const punta = bezier(desde, control, hasta, t);
	const antes = bezier(desde, control, hasta, Math.max(0, t - 0.02));
	const angulo = (Math.atan2(punta.y - antes.y, punta.x - antes.x) * 180) / Math.PI;
	const medio = bezier(desde, control, hasta, 0.5);

	return (
		<g>
			<path d={`M${puntos.join('L')}`} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity={0.95} />
			<path d="M0 0 L-19 -9 L-13 0 L-19 9 Z" fill={color} transform={`translate(${punta.x} ${punta.y}) rotate(${angulo})`} />
			<text
				x={medio.x}
				y={medio.y + desvioEtiqueta}
				textAnchor="middle"
				fontFamily={SANS}
				fontSize="15"
				fill={TINTA2}
				opacity={interpolate(t, [0.35, 0.75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
			>
				{etiqueta}
			</text>
		</g>
	);
};
