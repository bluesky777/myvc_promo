import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { Avatar } from '../../comunes/Avatar';
import { MEDIDAS } from '../medidas';
import { FUENTE } from '../tema';
import { ACENTO, BORDE, Boton, Icono, LETRA, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE, type NombreIcono } from '../montar-el-ano/ant';
import { CONTENIDO, MAIN } from '../montar-el-ano/planoAsignaturas';
import { GRUPOS } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS PIEZAS QUE COMPARTEN LAS PANTALLAS DE SECRETARÍA, dibujadas una vez.
 *
 * El marco de la página (el lienzo gris y el panel blanco de `panel.scss`), la cabecera con su h1 y
 * sus botones, el selector de grupos (`comunes/selector-grupo`), la tira de botones de estado de
 * una matrícula, el diálogo de la aplicación con su velo, y el aviso de arriba (nz-message) en sus
 * tres tonos. Ninguna sabe de tiempo salvo el aviso: reciben el estado y lo pintan.
 *
 * TODO EN COORDENADAS DE LA PÁGINA: `x` e `y` cuentan desde la esquina de `MAIN`, el contenido
 * dentro del panel, y `enCascara()` las pasa a la cáscara con el desplazamiento de la página.
 */

export { CONTENIDO, MAIN };

export interface Rect { x: number; y: number; ancho: number; alto: number }

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/** De la página (con su desplazamiento vertical) a la cáscara. */
export const enCascara = (r: Rect, desplazada = 0): Rect => ({ x: MAIN.x + r.x, y: MAIN.y + r.y - desplazada, ancho: r.ancho, alto: r.alto });

/** Lo que mide un texto a esta letra, a ojo de la fuente del sistema. Sirve para dar ancho a un botón. */
export const anchoDeTexto = (texto: string, letra = LETRA) => Math.round(texto.length * letra * 0.55);

/** El ancho de un botón de Ant con ese texto: relleno de 15 a cada lado y el icono si lo lleva. */
export const anchoDeBoton = (texto: string, icono = false, pequeno = false) =>
	anchoDeTexto(texto, pequeno ? LETRA - 1 : LETRA) + (pequeno ? 18 : 32) + (icono ? 22 : 0);

/* ── El marco de la página ─────────────────────────────────────────────────────────────────── */

/**
 * EL LIENZO Y EL PANEL. `alto` es lo que mide el contenido; el panel blanco lo envuelve con su
 * relleno. `desplazada` es la página bajada con la rueda: todo sube a la vez.
 */
export const Pagina: React.FC<{ alto: number; desplazada?: number; opacidad?: number; children: React.ReactNode }> = ({
	alto, desplazada = 0, opacidad = 1, children,
}) => (
	<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f5f7fa', fontFamily: FUENTE }}>
		<div
			style={{
				position: 'absolute',
				left: CONTENIDO.x - MEDIDAS.menu,
				top: CONTENIDO.y - MEDIDAS.barra - desplazada,
				width: CONTENIDO.ancho,
				height: alto + (MAIN.y - CONTENIDO.y) * 2,
				background: '#fff',
				border: `1px solid ${BORDE}`,
				borderRadius: 10,
				boxSizing: 'border-box',
			}}
		/>
		<div
			style={{
				position: 'absolute',
				left: MAIN.x - MEDIDAS.menu,
				top: MAIN.y - MEDIDAS.barra - desplazada,
				width: MAIN.ancho,
				height: alto,
				opacity: opacidad,
				color: TEXTO,
			}}
		>
			{children}
		</div>
	</div>
);

/** Algo colocado en coordenadas de la página. */
export const En: React.FC<{ r: { x: number; y: number; ancho?: number; alto?: number }; children?: React.ReactNode; z?: number; opacidad?: number }> = ({
	r, children, z, opacidad,
}) => (
	<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, zIndex: z, opacity: opacidad }}>{children}</div>
);

/* ── La cabecera: h1 a la izquierda, botones a la derecha ─────────────────────────────────── */

export const ALTO_CABECERA = 40;

export interface BotonDeCabecera { texto: string; icono?: NombreIcono; tipo?: 'default' | 'primary' }

/** Dónde cae cada botón de la cabecera, de derecha a izquierda, con 8 entre ellos. */
export function botonesDeCabecera(botones: BotonDeCabecera[]): Rect[] {
	const rects: Rect[] = [];
	let x = MAIN.ancho;
	for (let i = botones.length - 1; i >= 0; i--) {
		const ancho = anchoDeBoton(botones[i].texto, Boolean(botones[i].icono));
		x -= ancho;
		rects[i] = { x, y: (ALTO_CABECERA - 32) / 2, ancho, alto: 32 };
		x -= 8;
	}
	return rects;
}

export const Cabecera: React.FC<{ titulo: string; botones?: BotonDeCabecera[]; encima?: number | null }> = ({ titulo, botones = [], encima = null }) => {
	const rects = botonesDeCabecera(botones);
	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: MAIN.ancho, height: ALTO_CABECERA }}>
			<div style={{ position: 'absolute', left: 0, top: 0, height: ALTO_CABECERA, display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 600 }}>{titulo}</div>
			{botones.map((b, i) => (
				<div key={b.texto} style={{ position: 'absolute', left: rects[i].x, top: rects[i].y }}>
					<Boton texto={b.texto} icono={b.icono} tipo={b.tipo} ancho={rects[i].ancho} encima={encima === i} />
				</div>
			))}
		</div>
	);
};

/* ── El selector de grupos: una fila de botones, el elegido en azul ───────────────────────── */

export const ANCHO_BOTON_GRUPO = (abrev: string) => anchoDeBoton(abrev) - 4;

/** Los quince del colegio, en orden, con su abreviatura (`etiquetaDe`: `abrev || nombre`). */
export const ABREVS = GRUPOS.map((g) => g.abrev);

export function rectBotonDeGrupo(abrev: string, y: number): Rect {
	let x = 0;
	for (const a of ABREVS) {
		const ancho = ANCHO_BOTON_GRUPO(a);
		if (a === abrev) { return { x, y, ancho, alto: 32 }; }
		x += ancho + 8;
	}
	throw new Error(`Selector: no hay grupo «${abrev}».`);
}

export const SelectorDeGrupos: React.FC<{ elegido: string | null; encima?: string | null }> = ({ elegido, encima = null }) => (
	<div style={{ display: 'flex', gap: 8 }}>
		{ABREVS.map((a) => (
			<Boton key={a} texto={a} tipo={a === elegido ? 'primary' : 'default'} ancho={ANCHO_BOTON_GRUPO(a)} encima={encima === a} />
		))}
	</div>
);

/* ── Una cara en una celda: el `conFoto()` de la rejilla ─────────────────────────────────── */

export const Cara: React.FC<{ tipo: 'mujer' | 'hombre'; variante: number; tam?: number }> = ({ tipo, variante, tam = 26 }) => (
	<div style={{ width: tam, height: tam, borderRadius: '50%', overflow: 'hidden', flex: 'none' }}>
		<Avatar tipo={tipo} variante={variante} tam={tam} />
	</div>
);

export const ConCara: React.FC<{ tipo: 'mujer' | 'hombre'; variante: number; texto: string }> = ({ tipo, variante, texto }) => (
	<span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
		<Cara tipo={tipo} variante={variante} />
		<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{texto}</span>
	</span>
);

/* ── La tira de estados de una matrícula: «Matr Asis Reti Dese …», el actual hundido ─────── */

export const ANCHO_ESTADO = (t: string, letra = LETRA - 1) => (t === '…' ? Math.round(letra * 1.7) : anchoDeTexto(t, letra) + 8);

export function rectDeEstado(botones: string[], cual: string, letra = LETRA - 1, hueco = 4): { x: number; ancho: number } {
	let x = 0;
	for (const b of botones) {
		const ancho = ANCHO_ESTADO(b, letra);
		if (b === cual) { return { x, ancho }; }
		x += ancho + hueco;
	}
	throw new Error(`Estados: no hay «${cual}».`);
}

export const anchoDeEstados = (botones: string[], letra = LETRA - 1, hueco = 4) =>
	botones.reduce((n, b) => n + ANCHO_ESTADO(b, letra), 0) + hueco * (botones.length - 1);

/**
 * LA TIRA DE ESTADOS. No son etiquetas de color: en `app2` el estado es el botón que está HUNDIDO
 * (sombra por dentro, más oscuro, en negrita), y los demás se pueden pulsar. Así lo pinta
 * `matriculas.ts` y así la rejilla de Alumnos.
 */
export const BotonesDeEstado: React.FC<{ botones: string[]; hundido?: string | null; encima?: string | null; letra?: number; hueco?: number }> = ({
	botones, hundido = null, encima = null, letra = LETRA - 1, hueco = 4,
}) => (
	<div style={{ display: 'flex', gap: hueco }}>
		{botones.map((b) => {
			const abajo = b === hundido;
			const sobre = b === encima;
			return (
				<div
					key={b}
					style={{
						width: ANCHO_ESTADO(b, letra),
						height: 26,
						boxSizing: 'border-box',
						borderRadius: 4,
						border: `1px solid ${abajo ? '#8c8c8c' : sobre ? ACENTO : BORDE}`,
						background: abajo ? '#e8e8e8' : SUPERFICIE,
						boxShadow: abajo ? 'inset 0 2px 4px rgba(0,0,0,0.18)' : 'none',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: letra,
						fontWeight: abajo ? 700 : 400,
						color: sobre && !abajo ? ACENTO : TEXTO,
						flex: 'none',
					}}
				>
					{b}
				</div>
			);
		})}
	</div>
);

/* ── El diálogo de la aplicación, sobre la cáscara entera y con su velo ───────────────────── */

export interface Caja { x: number; y: number; ancho: number; alto: number }

/** Un diálogo centrado en la cáscara, de ese ancho y alto. */
export const cajaCentrada = (ancho: number, alto: number, y?: number): Caja => ({
	x: (MEDIDAS.ancho - ancho) / 2,
	y: y ?? Math.max(70, (MEDIDAS.alto - alto) / 2),
	ancho,
	alto,
});

export const ALTO_TITULO_DIALOGO = 58;
export const ALTO_PIE_DIALOGO = 60;
export const RELLENO_DIALOGO = 24;

/**
 * EL DIÁLOGO. `t` es lo abierto (0..1) y `sale` lo cerrado (0..1). Se dibuja en coordenadas de la
 * cáscara, encima de todo. `pie` son los botones de abajo, ya colocados por quien lo usa.
 */
export const Dialogo: React.FC<{ caja: Caja; titulo: React.ReactNode; t: number; sale?: number; pie?: React.ReactNode; children?: React.ReactNode }> = ({
	caja, titulo, t, sale = 0, pie, children,
}) => {
	if (t <= 0 || sale >= 1) { return null; }
	const vis = t * (1 - sale);
	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: MEDIDAS.ancho, height: MEDIDAS.alto, fontFamily: FUENTE, color: TEXTO }}>
			<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: vis, borderRadius: 12 }} />
			<div
				style={{
					position: 'absolute',
					left: caja.x,
					top: caja.y,
					width: caja.ancho,
					height: caja.alto,
					boxSizing: 'border-box',
					background: SUPERFICIE,
					borderRadius: 10,
					boxShadow: '0 12px 40px rgba(0,0,0,.22)',
					opacity: vis,
					transform: `scale(${interpolate(t, [0, 1], [0.94, 1]) * (1 - sale * 0.04)})`,
					overflow: 'hidden',
				}}
			>
				<div style={{ height: ALTO_TITULO_DIALOGO, display: 'flex', alignItems: 'center', padding: `0 ${RELLENO_DIALOGO}px`, fontSize: 20, fontWeight: 700, boxShadow: `inset 0 -1px 0 #f0f0f0` }}>
					{titulo}
				</div>
				<div style={{ position: 'relative', padding: `18px ${RELLENO_DIALOGO}px 0`, height: caja.alto - ALTO_TITULO_DIALOGO - ALTO_PIE_DIALOGO, boxSizing: 'border-box', overflow: 'hidden', fontSize: LETRA }}>
					{children}
				</div>
				<div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: ALTO_PIE_DIALOGO, boxShadow: 'inset 0 1px 0 #f0f0f0' }}>{pie}</div>
			</div>
		</div>
	);
};

/** Los botones del pie de un diálogo, a la derecha, con 8 entre ellos. Devuelve dónde cae cada uno en la cáscara. */
export function botonesDelPie(caja: Caja, botones: { texto: string; icono?: boolean }[]): Rect[] {
	const rects: Rect[] = [];
	let x = caja.x + caja.ancho - RELLENO_DIALOGO;
	for (let i = botones.length - 1; i >= 0; i--) {
		const ancho = anchoDeBoton(botones[i].texto, botones[i].icono);
		x -= ancho;
		rects[i] = { x, y: caja.y + caja.alto - ALTO_PIE_DIALOGO + 14, ancho, alto: 32 };
		x -= 8;
	}
	return rects;
}

/* ── El aviso de arriba (nz-message), en grande como el de la planilla, con su tono ─────────── */

const TONOS = {
	exito: { fondo: '#52c41a', icono: 'bien' as const },
	info: { fondo: ACENTO, icono: 'info' as const },
	ojo: { fondo: '#faad14', icono: 'alerta' as const },
	fallo: { fondo: PELIGRO, icono: 'alerta' as const },
};

/**
 * EL AVISO. Es `notas/Aviso` con los otros tres tonos de la aplicación: `exito` (verde), `info`
 * (azul), `ojo` (ámbar). Va sobre el fotograma, no dentro de la cáscara, para salir al tamaño del
 * de los demás vídeos. `desde` y `dura` son relativos a la secuencia en que se monte.
 */
export const Mensaje: React.FC<{ texto: string; desde: number; dura: number; tono?: keyof typeof TONOS }> = ({ texto, desde, dura, tono = 'exito' }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame - desde;
	if (t < 0) { return null; }

	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	if (salida >= 1) { return null; }
	const y = interpolate(entrada, [0, 1], [-110, 0]) - salida * 40;
	const escala = interpolate(entrada, [0, 0.6, 1], [0.86, 1.04, 1]) * (1 - salida * 0.06);
	const c = TONOS[tono];

	return (
		<div style={{ position: 'absolute', top: 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${y}px) scale(${escala})`, opacity: entrada * (1 - salida), zIndex: 30 }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: '26px 52px',
					borderRadius: 18,
					background: '#fff',
					fontFamily: FUENTE,
					fontSize: 40,
					fontWeight: 600,
					color: TEXTO,
					boxShadow: '0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)',
				}}
			>
				<Icono cual={c.icono} tam={48} color={c.fondo} />
				<span>{texto}</span>
			</div>
		</div>
	);
};

/* ── Letra pequeña gris, la `.pista` de las pantallas ─────────────────────────────────────── */

export const Pista: React.FC<{ children: React.ReactNode; ancho?: number }> = ({ children, ancho }) => (
	<div style={{ fontSize: LETRA - 1, lineHeight: '21px', color: 'rgba(0,0,0,0.55)', width: ancho }}>{children}</div>
);

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ fontSize: LETRA + 2, fontWeight: 600, color: TEXTO, whiteSpace: 'nowrap' }}>{children}</div>
);

export { ACENTO, BORDE, LETRA, PELIGRO, SUPERFICIE, TEXTO, TEXTO_TENUE };
