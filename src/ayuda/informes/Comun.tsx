import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor, Punto } from '../../comunes/Cursor';
import { entra } from '../../comunes/movimiento';
import { Cascara } from '../Cascara';
import { BANDA, ESCALA_CASCARA, ORIGEN, enElFotograma } from '../encuadre';
import { MEDIDAS, MENU_DIRECTIVO, alturaEnMenu, entradaDe } from '../medidas';
import { Rect, enLaCascara } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE COMPARTEN LOS NUEVE VÍDEOS DE LA SERIE «INFORMES»: el camino de llegada (menú cerrado →
 * Informes → la pantalla se monta, PLAN §2.2), la cáscara de rectoría a su escala y el puntero
 * dentro de ella. «Informes» es una entrada suelta del menú, sin hijas, en los dos menús.
 */

export const LLEGADA = { cursorEntra: 20, llegaInformes: 58, pulsaInformes: 66, monta: 72 };

export const INFORMES = entradaDe(MENU_DIRECTIVO, 'Informes').seccion;
const yInformes = alturaEnMenu(MENU_DIRECTIVO, INFORMES, null, null);

export const FOCO_INFORMES = enElFotograma({ x: 0, y: yInformes, ancho: MEDIDAS.menu, alto: MEDIDAS.seccion });
export const PUNTO_INFORMES = { x: 150, y: yInformes + MEDIDAS.seccion / 2 };
export const PUNTO_ENTRADA = { x: MEDIDAS.menu + 380, y: MEDIDAS.alto - 140 };

export const EN_EL_MENU = { ubicacion: 'Menú ▸ Informes', url: 'micolegio.micolevirtual.com/up2/' };
export const EN_INFORMES = { ubicacion: 'Menú ▸ Informes', url: '/informes' };

/** Un rectángulo del contenido, en el fotograma: es lo que come el foco. */
export const foco = (r: Rect, radio = 10) => ({ ...enElFotograma(enLaCascara(r)), radio });
/** Un punto del contenido, en coordenadas de la cáscara: es lo que come el puntero. */
export const punto = (r: Rect, dx = 0, dy = 0) => ({ x: enLaCascara(r).x + r.ancho / 2 + dx, y: enLaCascara(r).y + r.alto / 2 + dy });
/** Varios rectángulos en uno: el que los abraza a todos. */
export function union(...rs: Rect[]): Rect {
	const x = Math.min(...rs.map((r) => r.x));
	const y = Math.min(...rs.map((r) => r.y));
	return { x, y, ancho: Math.max(...rs.map((r) => r.x + r.ancho)) - x, alto: Math.max(...rs.map((r) => r.y + r.alto)) - y };
}
export const holgura = (r: Rect, h: number): Rect => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2 });

/**
 * LA CÁSCARA A SU ESCALA, con el puntero dentro. `seVa` la acerca un poco y la apaga (para pasar a
 * un papel a pantalla completa); `vuelve` la trae otra vez.
 */
export const Pantalla: React.FC<{
	children: React.ReactNode;
	puntos: Punto[];
	clics: number[];
	sale: number;
	periodo?: string;
	seVa?: { desde: number; hasta: number } | null;
	vuelve?: { desde: number; hasta: number } | null;
	/** Si se va y vuelve más de una vez: cuánto está fuera en este fotograma (0..1). Manda sobre los dos de arriba. */
	fuera?: number;
}> = ({ children, puntos, clics, sale, periodo = '2026 · Periodo 3', seVa = null, vuelve = null, fuera: fueraDado }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const aparece = entra(frame, fps, 0, 14);
	const ida = seVa ? interpolate(frame, [seVa.desde, seVa.hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
	const regreso = vuelve ? interpolate(frame, [vuelve.desde, vuelve.hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
	const fuera = fueraDado ?? (vuelve && frame >= vuelve.desde ? 1 - regreso : ida);
	if (fuera >= 1) { return null; }
	const senalada = frame >= LLEGADA.llegaInformes && frame < LLEGADA.pulsaInformes + 10 ? { seccion: INFORMES, hija: null } : null;
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
					transform: `scale(${1 + fuera * 0.07})`,
					opacity: aparece * (1 - fuera),
				}}
			>
				<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
					<Cascara menu={MENU_DIRECTIVO} abierta={null} senalada={senalada} periodo={periodo}>
						{children}
					</Cascara>
					<Cursor puntos={puntos} clics={clics} aparece={LLEGADA.cursorEntra} sale={sale} tam={34} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Los tres primeros puntos del puntero, que son los mismos en los nueve: entra y pulsa Informes. */
export const PUNTOS_DE_LLEGADA: Punto[] = [
	{ frame: LLEGADA.cursorEntra, ...PUNTO_ENTRADA },
	{ frame: LLEGADA.llegaInformes, ...PUNTO_INFORMES },
	{ frame: LLEGADA.pulsaInformes + 24, ...PUNTO_INFORMES },
];

/* ── Los planos quietos del papel, a pantalla completa ─────────────────────────────────────── */

export type Encuadre = { escala: number; x: number; y: number };

/** 0→1 entre dos fotogramas, sin salirse. */
export const rampa = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** Un rectángulo del papel, en el fotograma, a la escala de ese plano: es lo que come el foco. */
export const enElPlano = (p: Encuadre, r: Rect, radio = 8) => ({ x: p.x + r.x * p.escala, y: p.y + r.y * p.escala, ancho: r.ancho * p.escala, alto: r.alto * p.escala, radio });

/**
 * UN PLANO QUIETO DEL PAPEL, recortado a la banda entre la cabecera y el rótulo. Se encadenan dos
 * --de lejos y de cerca-- con un fundido, nunca se reescala uno poco a poco (RELEVO §4).
 */
export const Plano: React.FC<{ p: Encuadre; opacidad: number; children: React.ReactNode }> = ({ p, opacidad, children }) => (
	<AbsoluteFill style={{ clipPath: `inset(${BANDA.arriba}px 0 ${1080 - BANDA.arriba - BANDA.alto}px 0)`, opacity: opacidad }}>
		<div style={{ position: 'absolute', left: p.x, top: p.y, transformOrigin: '0 0', transform: `scale(${p.escala})` }}>{children}</div>
	</AbsoluteFill>
);
