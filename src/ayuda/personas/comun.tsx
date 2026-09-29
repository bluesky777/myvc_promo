import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { Cursor, type Punto } from '../../comunes/Cursor';
import { Cascara } from '../Cascara';
import { ESCALA_CASCARA, ORIGEN, enElFotograma } from '../encuadre';
import { MEDIDAS, MENU_SECRETARIA, type Seccion, alturaEnMenu, entradaDe } from '../medidas';
import { FUENTE } from '../tema';
import { BORDE, Boton, Icono, LETRA, TEXTO, TEXTO_TENUE, type NombreIcono } from '../montar-el-ano/ant';
import { CONTENIDO, MAIN } from '../montar-el-ano/planoAsignaturas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE COMPARTEN LOS SIETE VÍDEOS DE «PERSONAS» (cartera, duplicados, las dos de importar,
 * acudientes, editar docentes y certificados de un alumno): la cáscara con la sección Personas
 * abierta, el panel blanco de la página, la cabecera con su título, el aviso de Ant y el diálogo.
 *
 * TODO VA EN COORDENADAS DE LA CÁSCARA (1440 × 900), como en `montar-el-ano/`. El panel de la
 * página es el de `panel.scss` --lienzo gris de 24 y relleno de 16--, y por eso se reutilizan
 * `CONTENIDO` y `MAIN` de allí en vez de volver a contarlos.
 */

export { CONTENIDO, MAIN };

export interface Rect { x: number; y: number; ancho: number; alto: number }
export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });
export const crece = (r: Rect, n: number): Rect => ({ x: r.x - n, y: r.y - n, ancho: r.ancho + n * 2, alto: r.alto + n * 2 });
/** Un rectángulo de la cáscara al fotograma, con su radio: lo que come `Paso.foco`. */
export const foco = (r: Rect, radio = 10) => ({ ...enElFotograma(r), radio });

/* EL MENÚ DE LA SECRETARIA: el de `medidas.ts`, que es donde viven los menús. */
export { MENU_SECRETARIA };

/** La entrada del menú --«Personas» o una hija suya-- en coordenadas de la cáscara. */
export function rectDelMenu(menu: Seccion[], hija: string | null, abierta: boolean): Rect {
	const e = hija === null ? entradaDe(menu, 'Personas') : entradaDe(menu, 'Personas', hija);
	return {
		x: 0,
		y: alturaEnMenu(menu, e.seccion, e.hija, abierta ? e.seccion : null),
		ancho: MEDIDAS.menu,
		alto: hija === null ? MEDIDAS.seccion : MEDIDAS.hija,
	};
}

export const puntoDelMenu = (menu: Seccion[], hija: string | null, abierta: boolean) => {
	const r = rectDelMenu(menu, hija, abierta);
	return { x: 150, y: r.y + r.alto / 2 };
};

export const senaladaDelMenu = (menu: Seccion[], hija: string | null) => {
	const e = hija === null ? entradaDe(menu, 'Personas') : entradaDe(menu, 'Personas', hija);
	return { seccion: e.seccion, hija: e.hija };
};

/** De dónde sale el puntero al empezar: abajo, sobre la pantalla vacía. */
export const ENTRADA_DEL_PUNTERO = { x: MEDIDAS.menu + 420, y: MEDIDAS.alto - 150 };

/*
 * LA LLEGADA POR EL MENÚ. Los mismos tiempos que `cierre-1` y `montar-el-ano`: los primeros cinco
 * segundos de todos los vídeos de la ayuda tienen el mismo pulso.
 */
export const LLEGADA = {
	cursorEntra: 20,
	llegaPersonas: 58,
	pulsaPersonas: 64,
	abrePersonas: 66,
	llegaEntrada: 150,
	pulsaEntrada: 162,
	monta: 166,
};

export const entre = (f: number, desde: number, hasta: number) => f >= desde && f < hasta;
export const avance = (f: number, desde: number, hasta: number) =>
	interpolate(f, [desde, hasta], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** El 0..1 con el que entra una pantalla o un bloque. */
export const aparece = (f: number, fps: number, desde: number, dur = 14) => {
	if (f < desde) { return 0; }
	return spring({ frame: f - desde, fps, config: { damping: 16, mass: 0.5 }, durationInFrames: dur });
};

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA APLICACIÓN EN EL FOTOGRAMA, con Personas abierta. `encima` es lo que va sobre toda la
 * cáscara --el diálogo con su máscara, o un aviso--; `cursor` va encima de todo.
 */
export const EnPersonas: React.FC<{
	menu: Seccion[];
	/** Cuánto está desplegada Personas (0..1). */
	personas: number;
	senalada: { seccion: number; hija: number | null } | null;
	opacidad?: number;
	acercamiento?: number;
	children?: React.ReactNode;
	encima?: React.ReactNode;
	cursor: { puntos: Punto[]; clics: number[]; aparece: number; sale: number };
}> = ({ menu, personas, senalada, opacidad = 1, acercamiento = 0, children, encima, cursor }) => (
	<AbsoluteFill>
		<div
			style={{
				position: 'absolute',
				left: ORIGEN.x,
				top: ORIGEN.y,
				width: MEDIDAS.ancho * ESCALA_CASCARA,
				height: MEDIDAS.alto * ESCALA_CASCARA,
				transformOrigin: '50% 45%',
				transform: acercamiento ? `scale(${1 + acercamiento * 0.07})` : undefined,
				opacity: opacidad,
			}}
		>
			<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
				<Cascara menu={menu} abierta={{ seccion: entradaDe(menu, 'Personas').seccion, t: personas }} senalada={senalada}>
					{children}
				</Cascara>
				{encima}
				<Cursor puntos={cursor.puntos} clics={cursor.clics} aparece={cursor.aparece} sale={cursor.sale} tam={34} />
			</div>
		</div>
	</AbsoluteFill>
);

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA PÁGINA: el lienzo gris, el panel blanco y lo de dentro, que se coloca en coordenadas de la
 * cáscara. `desplazada` es el scroll de la página; `opacidad` la de lo de dentro (el panel se queda).
 */
export const Pagina: React.FC<{ alto: number; desplazada?: number; opacidad?: number; children?: React.ReactNode }> = ({
	alto, desplazada = 0, opacidad = 1, children,
}) => (
	<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f5f7fa' }}>
		<div
			style={{
				position: 'absolute',
				left: CONTENIDO.x - MEDIDAS.menu,
				top: CONTENIDO.y - MEDIDAS.barra - desplazada,
				width: CONTENIDO.ancho,
				height: alto,
				background: '#fff',
				border: `1px solid ${BORDE}`,
				borderRadius: 10,
				boxSizing: 'border-box',
			}}
		/>
		<div style={{ position: 'absolute', left: -MEDIDAS.menu, top: -MEDIDAS.barra - desplazada, width: MEDIDAS.ancho, height: 4000, opacity: opacidad }}>
			{children}
		</div>
	</div>
);

/** Un bloque colocado en coordenadas de la cáscara, dentro de `Pagina`. */
export const En: React.FC<{ r: { x: number; y: number; ancho?: number; alto?: number }; opacidad?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
	r, opacidad = 1, children, style,
}) => (
	<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, opacity: opacidad, ...style }}>{children}</div>
);

/** El título de la página (`<h1>` dentro del panel). */
export const Titulo: React.FC<{ texto: string; tam?: number }> = ({ texto, tam = 26 }) => (
	<div style={{ fontSize: tam, fontWeight: 600, color: TEXTO, whiteSpace: 'nowrap', lineHeight: 1.2 }}>{texto}</div>
);

/** El texto gris de ayuda (`nz-typography nzType="secondary"`). */
export const Pista: React.FC<{ children: React.ReactNode; tam?: number; style?: React.CSSProperties }> = ({ children, tam = LETRA - 0.5, style }) => (
	<div style={{ fontSize: tam, color: 'rgba(0,0,0,0.45)', lineHeight: 1.45, ...style }}>{children}</div>
);

export { Boton, Icono, LETRA, TEXTO, TEXTO_TENUE, BORDE };
export type { NombreIcono };

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL AVISO DE LA APLICACIÓN (`comunes/avisos`, el `nz-message` de Ant): arriba, centrado y grande
 * --sobre el borde de arriba de la aplicación y no sobre la cabecera, que no se tapa nunca--,
 * como el de `notas/Aviso.tsx`, pero con los tres iconos que usan estas pantallas: el de hecho, el
 * informativo (azul) y el de ojo (amarillo). Va sobre el fotograma, no dentro de la cáscara.
 */
export const AvisoApp: React.FC<{ texto: string; desde: number; dura: number; tipo?: 'exito' | 'info' | 'ojo' }> = ({ texto, desde, dura, tipo = 'exito' }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame - desde;
	if (t < 0 || t > dura + 14) { return null; }
	const entrada = spring({ frame: t, fps, config: { damping: 15, mass: 0.5 }, durationInFrames: 16 });
	const salida = interpolate(t - dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const y = interpolate(entrada, [0, 1], [-110, 0]) - salida * 40;
	const escala = interpolate(entrada, [0, 0.6, 1], [0.86, 1.04, 1]) * (1 - salida * 0.06);
	const color = tipo === 'exito' ? '#52c41a' : tipo === 'info' ? '#1677ff' : '#faad14';
	const icono: NombreIcono = tipo === 'exito' ? 'bien' : tipo === 'info' ? 'info' : 'alerta';
	return (
		<div style={{ position: 'absolute', top: 128, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${y}px) scale(${escala})`, opacity: entrada * (1 - salida), zIndex: 45 }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: '26px 52px',
					borderRadius: 18,
					background: '#fff',
					fontFamily: FUENTE,
					fontSize: 44,
					fontWeight: 600,
					color: TEXTO,
					boxShadow: '0 12px 34px rgba(15,28,52,.14), 0 4px 10px -4px rgba(15,28,52,.18), 0 20px 60px 12px rgba(15,28,52,.07)',
				}}
			>
				<Icono cual={icono} tam={50} color={color} />
				<span style={{ fontVariantNumeric: 'tabular-nums' }}>{texto}</span>
			</div>
		</div>
	);
};

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL DIÁLOGO (`comunes/modal`): máscara, caja blanca con título, cuerpo y pie. Se coloca en
 * coordenadas de la cáscara, encima de todo (`EnPersonas.encima`).
 */
export const Dialogo: React.FC<{ r: Rect; titulo: string; aparece: number; pie?: React.ReactNode; children?: React.ReactNode }> = ({ r, titulo, aparece, pie, children }) => (
	<div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
		<div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * aparece})`, borderRadius: 12 }} />
		<div
			style={{
				position: 'absolute',
				left: r.x,
				top: r.y,
				width: r.ancho,
				height: r.alto,
				boxSizing: 'border-box',
				background: '#fff',
				borderRadius: 8,
				boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)',
				opacity: aparece,
				transform: `scale(${0.92 + aparece * 0.08})`,
				color: TEXTO,
				fontSize: LETRA,
				fontFamily: FUENTE,
				overflow: 'hidden',
			}}
		>
			<div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 19, fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>{titulo}</div>
			<div style={{ position: 'absolute', left: 24, right: 24, top: 56 + 18 }}>{children}</div>
			{pie && (
				<div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '0 24px', borderTop: '1px solid #f0f0f0' }}>
					{pie}
				</div>
			)}
		</div>
	</div>
);

/** El interruptor pequeño de `comunes/interruptor-si-no`: `nz-switch` con «Sí» / «No» dentro. */
export const SiNo: React.FC<{ encendido: boolean; apagado?: boolean }> = ({ encendido, apagado = false }) => (
	<div
		style={{
			width: 46,
			height: 18,
			borderRadius: 9,
			background: encendido ? '#1677ff' : 'rgba(0,0,0,0.25)',
			position: 'relative',
			flex: 'none',
			opacity: apagado ? 0.45 : 1,
			fontSize: 11,
			color: '#fff',
		}}
	>
		<span style={{ position: 'absolute', top: 1, left: encendido ? 7 : 20, lineHeight: '16px' }}>{encendido ? 'Sí' : 'No'}</span>
		<div style={{ position: 'absolute', top: 2, left: encendido ? 30 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 4px rgba(0,35,11,0.2)' }} />
	</div>
);

/** La casilla de selección de AG Grid (columna de marcar filas). */
export const Marca: React.FC<{ marcada: boolean; encima?: boolean }> = ({ marcada, encima = false }) => (
	<div
		style={{
			width: 16,
			height: 16,
			boxSizing: 'border-box',
			borderRadius: 3,
			border: `1px solid ${marcada || encima ? '#1677ff' : '#b8b8b8'}`,
			background: marcada ? '#1677ff' : '#fff',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{marcada && <Icono cual="check" tam={12} color="#fff" />}
	</div>
);

/** Una pastilla de estado (`.pastilla.bien / .mal / .aviso / .apagada` de importar). */
export const Pastilla: React.FC<{ tono: 'bien' | 'mal' | 'aviso' | 'apagada'; children: React.ReactNode }> = ({ tono, children }) => {
	const c = {
		bien: { fondo: '#f6ffed', borde: '#b7eb8f', letra: '#389e0d' },
		mal: { fondo: '#fff1f0', borde: '#ffa39e', letra: '#cf1322' },
		aviso: { fondo: '#fffbe6', borde: '#ffe58f', letra: '#ad6800' },
		apagada: { fondo: '#fafafa', borde: '#d9d9d9', letra: 'rgba(0,0,0,0.45)' },
	}[tono];
	return (
		<span style={{ display: 'inline-block', padding: '1px 9px', borderRadius: 4, background: c.fondo, border: `1px solid ${c.borde}`, color: c.letra, fontSize: LETRA - 1.5, whiteSpace: 'nowrap', lineHeight: '20px' }}>
			{children}
		</span>
	);
};

/** El punto de la esquina que no se ve: sirve de ancla para focos de elementos del fotograma. */
export const HOJA_DEL_FOTOGRAMA = { ancho: 1920, alto: 1080 };

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LOS ICONOS DE ESTAS PANTALLAS QUE `ant.tsx` NO TRAE, a trazo como aquellos, y el botón que los
 * lleva. `BotonP` es el `Boton` de Ant con el icono como pieza: mismos colores, alto y radio.
 */
export type IconoP =
	| NombreIcono
	| 'subir' | 'bajar' | 'imprimir' | 'unir' | 'excel' | 'ficha' | 'llave' | 'usuario-mas' | 'certificado'
	| 'usuario' | 'contactos' | 'usuario-menos' | 'maletin' | 'reloj' | 'megafono';

export const IconoP: React.FC<{ cual: IconoP; tam?: number; color?: string }> = ({ cual, tam = 16, color = 'currentColor' }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	const propias: Record<string, React.ReactNode> = {
		subir: <path d="M7 18a5 5 0 0 1-.5-9.97A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 9.5M12 12v8M9 15l3-3 3 3" {...t} />,
		bajar: <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14" {...t} />,
		imprimir: <path d="M7 9V4h10v5M5 9h14v7H5zM7.5 14h9v6h-9z" {...t} />,
		unir: <path d="M4 5v14M20 5v14M8 12h8M11 9l-3 3 3 3M13 9l3 3-3 3" {...t} />,
		excel: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12l5 6M14 12l-5 6" {...t} />,
		ficha: <path d="M3 6h18v12H3zM7 10.5a1.8 1.8 0 1 0 0 .01M5.5 15c.4-1.5 2.6-1.5 3 0M12 10h6M12 13.5h5" {...t} />,
		llave: <path d="M14.5 9.5a4 4 0 1 1-1 1L6 18v2H4v-2l7.5-7.5M17 6l1.5 1.5" {...t} />,
		'usuario-mas': <path d="M10 8a3.5 3.5 0 1 1 0 .01M3.5 20c0-3.6 2.9-5.5 6.5-5.5 1.3 0 2.5.2 3.5.7M18 14v6M15 17h6" {...t} />,
		certificado: <path d="M5 3h14v12H5zM8 7h8M8 10h5M12 15v6l2-1.5 2 1.5v-6" {...t} />,
		usuario: <path d="M12 8a3.5 3.5 0 1 1 0 .01M5 20c0-3.6 3-5.5 7-5.5s7 1.9 7 5.5" {...t} />,
		contactos: <path d="M5 4h14v16H5zM12 9.5a2 2 0 1 1 0 .01M8.5 16c.6-2 6.4-2 7 0M3 8h2M3 12h2M3 16h2" {...t} />,
		'usuario-menos': <path d="M10 8a3.5 3.5 0 1 1 0 .01M3.5 20c0-3.6 2.9-5.5 6.5-5.5 1.3 0 2.5.2 3.5.7M15 17h6" {...t} />,
		maletin: <path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16" {...t} />,
		reloj: <path d="M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17M12 7.5V12l3 2" {...t} />,
		megafono: <path d="M4 10v4h3l7 4V6l-7 4zM17 9.5a3.5 3.5 0 0 1 0 5" {...t} />,
	};
	if (cual in propias) {
		return (
			<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flex: 'none' }}>
				{propias[cual]}
			</svg>
		);
	}
	return <Icono cual={cual as NombreIcono} tam={tam} color={color} />;
};

export const BotonP: React.FC<{
	texto?: string;
	icono?: IconoP;
	tipo?: 'default' | 'primary' | 'link';
	peligro?: boolean;
	pequeno?: boolean;
	deshabilitado?: boolean;
	cargando?: boolean;
	encima?: boolean;
	ancho?: number;
	alto?: number;
	redondo?: boolean;
	tamLetra?: number;
}> = ({ texto, icono, tipo = 'default', peligro = false, pequeno = false, deshabilitado = false, cargando = false, encima = false, ancho, alto, redondo = false, tamLetra }) => {
	const color = peligro ? '#ff4d4f' : '#1677ff';
	const h = alto ?? (pequeno ? 24 : 32);
	const lleno = tipo === 'primary';
	const plano = tipo === 'link';
	const fondo = deshabilitado ? 'rgba(0,0,0,0.04)' : lleno ? (encima ? (peligro ? '#ff7875' : '#4096ff') : color) : plano ? 'transparent' : '#fff';
	const borde = deshabilitado ? BORDE : plano ? 'transparent' : lleno ? fondo : encima ? color : peligro ? '#ff4d4f' : BORDE;
	const letra = deshabilitado ? 'rgba(0,0,0,0.25)' : lleno ? '#fff' : plano ? (encima ? '#69b1ff' : color) : peligro ? '#ff4d4f' : encima ? color : TEXTO;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 7,
				height: h,
				width: ancho,
				padding: plano ? '0 4px' : pequeno ? '0 8px' : '0 15px',
				boxSizing: 'border-box',
				borderRadius: redondo ? h / 2 : pequeno ? 4 : 6,
				border: `1px solid ${borde}`,
				background: fondo,
				color: letra,
				fontSize: tamLetra ?? (pequeno ? LETRA - 1 : LETRA),
				whiteSpace: 'nowrap',
				boxShadow: lleno && !deshabilitado ? '0 2px 0 rgba(5,145,255,0.1)' : 'none',
				flex: 'none',
			}}
		>
			{cargando && <Icono cual="cargando" tam={pequeno ? 13 : 15} />}
			{!cargando && icono && <IconoP cual={icono} tam={pequeno ? 14 : 16} />}
			{texto}
		</div>
	);
};
