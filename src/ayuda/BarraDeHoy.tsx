import React from 'react';

import { Avatar } from '../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../notas/tema';
import { Escudo, VERDE } from './colegio';
import { MEDIDAS } from './medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA BARRA DE ARRIBA COMO ESTÁ HOY EN app2, y los colores de la cáscara.
 *
 * Es la barra de todos los vídeos desde el 2026-09-28 (antes era «Navegar… Ctrl K» y un selector
 * de texto, y sólo la llevaban los de «Moverse por MyVC»). Es la de
 * `app2/src/app/paginas/panel/panel.html:4-132`:
 *
 *     [plegar] [logo del colegio] [🔍 Buscador mágico…  /]  ·····  [📅 2026 | Periodo 2 ⌄] [⚙] [▶] [🔔] [cara]
 *
 *   - el buscador dice «Buscador mágico…» desde el 2026-09-26 y su tecla escrita es «/»
 *     (`cascara/buscador/buscador.html:28-30`); Ctrl K también lo abre, pero no está escrito;
 *   - el selector es una píldora con calendario, el año, un tajo vertical y «Periodo N»
 *     (`cascara/selector-academico/selector-academico.html:23-54`);
 *   - el engranaje abre «Aspecto» (`cascara/mandos-aspecto/`), el ▶ es la ayuda en vídeo y la
 *     campana, los pendientes.
 *
 * LA GEOMETRÍA VA ESCRITA, y el dibujo coloca cada mando en absoluto con esos números: el foco y el
 * puntero salen de `rectanguloDeMando()` y no de medir el resultado.
 */

export interface PaletaCascara {
	fondo: string;
	superficie: string;
	borde: string;
	texto: string;
	tenue: string;
	acento: string;
}

/** Los de siempre: con esta paleta la cáscara sale idéntica a como salía antes de existir. */
export const PALETA_CLARA: PaletaCascara = {
	fondo: '#f5f7fa',
	superficie: SUPERFICIE,
	borde: BORDE,
	texto: TEXTO,
	tenue: TEXTO_TENUE,
	acento: ACENTO,
};

/** El modo oscuro: la hoja oscura de Ant (fondo #141414, superficies #1f1f1f, primario #1668dc). */
export const PALETA_OSCURA: PaletaCascara = {
	fondo: '#141414',
	superficie: '#1f1f1f',
	borde: '#424242',
	texto: 'rgba(255, 255, 255, 0.85)',
	tenue: 'rgba(255, 255, 255, 0.45)',
	acento: '#1668dc',
};

export const EstiloCascara = React.createContext<{ p: PaletaCascara; plegado: number }>({ p: PALETA_CLARA, plegado: 0 });

export const MEDIDAS_HOY = {
	/** Plegado a iconos: `ANCHO_ICONOS`, `cascara/menu/estado-menu.ts:82`. */
	menuPlegado: 64,
};

/** El estilo de la columna del menú. Con `plegado = 0` y la paleta clara, el de siempre. */
export function estiloDelMenu({ p, plegado }: { p: PaletaCascara; plegado: number }): React.CSSProperties {
	return {
		width: MEDIDAS.menu - (MEDIDAS.menu - MEDIDAS_HOY.menuPlegado) * plegado,
		background: p.superficie,
		borderRight: `1px solid ${p.borde}`,
		paddingTop: MEDIDAS.menuArriba,
		...(plegado ? { overflow: 'hidden', flexShrink: 0 } : {}),
	};
}

/** Donde va el logo del colegio: pegado al botón de plegar, y el buscador detrás. */
const MARCA = { x: 56, ancho: 132 };

export type MandoDeLaBarra = 'plegar' | 'buscador' | 'selector' | 'aspecto' | 'ayuda' | 'campana' | 'cara';

const Y = (alto: number) => (MEDIDAS.barra - alto) / 2;
const DERECHA = MEDIDAS.ancho - 14;

/** Dónde cae cada mando de la barra, en coordenadas de la cáscara. */
export const MANDOS: Record<MandoDeLaBarra, { x: number; y: number; ancho: number; alto: number }> = {
	plegar: { x: 10, y: Y(36), ancho: 36, alto: 36 },
	buscador: { x: MARCA.x + MARCA.ancho + 8, y: Y(34), ancho: 320, alto: 34 },
	cara: { x: DERECHA - 32, y: Y(32), ancho: 32, alto: 32 },
	campana: { x: DERECHA - 32 - 8 - 36, y: Y(36), ancho: 36, alto: 36 },
	ayuda: { x: DERECHA - 32 - 8 - 36 * 2 - 8, y: Y(36), ancho: 36, alto: 36 },
	aspecto: { x: DERECHA - 32 - 8 - 36 * 3 - 16, y: Y(36), ancho: 36, alto: 36 },
	selector: { x: DERECHA - 32 - 8 - 36 * 3 - 16 - 12 - 208, y: Y(34), ancho: 208, alto: 34 },
};

export function rectanguloDeMando(cual: MandoDeLaBarra) {
	return { ...MANDOS[cual], radio: cual === 'selector' ? 17 : 8 };
}

export interface BarraDeHoyProps {
	anio: string;
	periodo: number;
	/** El mando que el ratón tiene encima o que está pulsado. */
	senalado?: MandoDeLaBarra | null;
	/** El selector con su desplegable abierto (el desplegable lo pinta el vídeo, encima). */
	selectorAbierto?: boolean;
	/** El menú plegado, para el icono del botón (menu-fold / menu-unfold). */
	plegado?: boolean;
}

export const BarraDeHoy: React.FC<BarraDeHoyProps> = ({ anio, periodo, senalado = null, selectorAbierto = false, plegado = false }) => {
	const { p } = React.useContext(EstiloCascara);
	const encima = (c: MandoDeLaBarra) => senalado === c;
	const fondoDe = (c: MandoDeLaBarra) => (encima(c) ? `${p.acento}14` : 'transparent');

	const abs = (c: MandoDeLaBarra): React.CSSProperties => ({
		position: 'absolute',
		left: MANDOS[c].x,
		top: MANDOS[c].y,
		width: MANDOS[c].ancho,
		height: MANDOS[c].alto,
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
	});

	const selector = encima('selector') || selectorAbierto;

	return (
		<div style={{ position: 'relative', height: MEDIDAS.barra, background: p.superficie, borderBottom: `1px solid ${p.borde}` }}>
			<div style={{ ...abs('plegar'), justifyContent: 'center', borderRadius: 8, background: fondoDe('plegar') }}>
				<IconoPlegar color={p.texto} plegado={plegado} />
			</div>

			{/*
			  * EL LOGO DEL COLEGIO, no el de MyVC (`cascara/marca/`: «el logo del colegio», el de MyVC
			  * sólo si el colegio no ha subido uno). Es el de Los Almendros: escudo y nombre.
			  */}
			<div style={{ position: 'absolute', left: MARCA.x, top: 0, width: MARCA.ancho, height: MEDIDAS.barra, display: 'flex', alignItems: 'center', gap: 8 }}>
				<Escudo tam={34} />
				<span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.05, color: p === PALETA_CLARA ? VERDE : p.texto }}>
					Los
					<br />
					Almendros
				</span>
			</div>

			<div
				style={{
					...abs('buscador'),
					gap: 10,
					padding: '0 10px 0 12px',
					borderRadius: 8,
					border: `1px solid ${encima('buscador') ? p.acento : p.borde}`,
					background: encima('buscador') ? `${p.acento}0d` : p.superficie,
					color: p.tenue,
					fontSize: 14,
				}}
			>
				<IconoLupa color={p.tenue} />
				<span style={{ flex: 1 }}>Buscador mágico…</span>
				<span
					style={{
						fontSize: 12,
						fontFamily: 'ui-monospace, Menlo, monospace',
						border: `1px solid ${p.borde}`,
						borderBottomWidth: 2,
						borderRadius: 5,
						padding: '0 7px',
						lineHeight: '18px',
						color: p.texto,
					}}
				>
					/
				</span>
			</div>

			<div
				style={{
					...abs('selector'),
					gap: 9,
					padding: '0 14px',
					borderRadius: 999,
					border: `1px solid ${selector ? p.acento : p.borde}`,
					background: selector ? `${p.acento}14` : p.superficie,
					color: p.texto,
					fontSize: 14,
					fontWeight: 600,
					fontVariantNumeric: 'tabular-nums',
					whiteSpace: 'nowrap',
				}}
			>
				<IconoCalendario color={selector ? p.acento : p.tenue} />
				<span>{anio}</span>
				<span style={{ width: 1, height: 16, background: p.borde }} />
				<span style={{ flex: 1 }}>Periodo {periodo}</span>
				<svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: `rotate(${selectorAbierto ? 180 : 0}deg)` }}>
					<path d="M2.5 4.5 L6 8 L9.5 4.5" fill="none" stroke={p.tenue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			<div style={{ ...abs('aspecto'), justifyContent: 'center', borderRadius: 8, background: fondoDe('aspecto') }}>
				<IconoEngranaje color={encima('aspecto') ? p.acento : p.texto} />
			</div>
			<div style={{ ...abs('ayuda'), justifyContent: 'center', borderRadius: 8, background: fondoDe('ayuda') }}>
				<IconoPlay color={p.acento} />
			</div>
			<div style={{ ...abs('campana'), justifyContent: 'center', borderRadius: 8, background: fondoDe('campana') }}>
				<IconoCampana color={p.texto} />
			</div>
			<div style={{ ...abs('cara') }}>
				<Avatar tipo="hombre" variante={2} tam={32} />
			</div>
		</div>
	);
};

const trazo = (color: string) => ({ fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

/** `menu-fold` / `menu-unfold` de Ant: tres rayas y una flecha que dice hacia dónde va. */
export const IconoPlegar: React.FC<{ color: string; plegado: boolean }> = ({ color, plegado }) => (
	<svg width="20" height="20" viewBox="0 0 20 20">
		<path d="M3 4.5 H17 M8.5 8.5 H17 M8.5 11.5 H17 M3 15.5 H17" {...trazo(color)} />
		<path d={plegado ? 'M3.2 7.6 L5.8 10 L3.2 12.4' : 'M5.8 7.6 L3.2 10 L5.8 12.4'} {...trazo(color)} />
	</svg>
);

export const IconoLupa: React.FC<{ color: string; tam?: number }> = ({ color, tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 16 16">
		<circle cx="7" cy="7" r="4.6" {...trazo(color)} />
		<path d="M10.4 10.4 L14 14" {...trazo(color)} />
	</svg>
);

const IconoCalendario: React.FC<{ color: string }> = ({ color }) => (
	<svg width="16" height="16" viewBox="0 0 16 16">
		<path d="M2.5 3.8 H13.5 V13.5 H2.5 Z M2.5 6.8 H13.5 M5.4 2.2 V5 M10.6 2.2 V5" {...trazo(color)} />
	</svg>
);

const IconoEngranaje: React.FC<{ color: string }> = ({ color }) => (
	<svg width="20" height="20" viewBox="0 0 18 18">
		<circle cx="9" cy="9" r="2.4" {...trazo(color)} />
		<path d="M9 2.6 V4.4 M9 13.6 V15.4 M2.6 9 H4.4 M13.6 9 H15.4 M4.6 4.6 L5.9 5.9 M12.1 12.1 L13.4 13.4 M13.4 4.6 L12.1 5.9 M5.9 12.1 L4.6 13.4" {...trazo(color)} />
	</svg>
);

const IconoPlay: React.FC<{ color: string }> = ({ color }) => (
	<svg width="20" height="20" viewBox="0 0 20 20">
		<circle cx="10" cy="10" r="8" fill={color} />
		<path d="M8.2 6.6 L13.6 10 L8.2 13.4 Z" fill="#fff" />
	</svg>
);

const IconoCampana: React.FC<{ color: string }> = ({ color }) => (
	<svg width="20" height="20" viewBox="0 0 20 20">
		<path d="M5 14 V9 C5 6.2 7.2 4 10 4 C12.8 4 15 6.2 15 9 V14 L16.2 15.4 H3.8 Z M8.4 16.8 C8.8 17.6 9.3 18 10 18 C10.7 18 11.2 17.6 11.6 16.8" {...trazo(color)} />
	</svg>
);
