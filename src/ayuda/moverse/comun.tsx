import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { ESCALA_CASCARA, ORIGEN, enElFotograma } from '../encuadre';
import { MEDIDAS, Seccion, alturaEnMenu, entradaDe } from '../medidas';
import { FUENTE } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE COMPARTEN LOS VÍDEOS DE «MOVERSE POR MyVC» Y LOS DOS DEL DOCENTE QUE VAN CON ELLOS
 * (`periodo-arriba`, `buscar-escribiendo`, `menu-secciones`, `volver-rastro`, `a-tu-gusto`,
 * `mis-asignaturas`, `unidades-100`).
 *
 * Todo lo que se dibuja dentro de la aplicación va en COORDENADAS DE LA CÁSCARA (1440 × 900); el
 * foco y el puntero se pasan al fotograma con `enElFotograma`. Un desplegable, el buscador o el
 * cajón de «Aspecto» se pintan ENCIMA de la cáscara y dentro del mismo lienzo escalado: así caen
 * donde caen en la aplicación sin que la cáscara tenga que saber que existen.
 */

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/**
 * UNA ENTRADA DEL MENÚ, en coordenadas de la cáscara: la sección, o una hija suya con la sección
 * `abierta` desplegada. Sale de `alturaEnMenu`, igual que lo que pinta la cáscara.
 */
export function rectDeEntrada(menu: Seccion[], seccion: string, hija?: string, ancho = MEDIDAS.menu): Rect {
	const e = entradaDe(menu, seccion, hija);
	const y = alturaEnMenu(menu, e.seccion, e.hija, hija === undefined ? null : e.seccion);
	return { x: 0, y, ancho, alto: hija === undefined ? MEDIDAS.seccion : MEDIDAS.hija, radio: 6 };
}

/** Un rectángulo de la cáscara, en el fotograma, con su radio. */
export const alFotograma = (r: Rect, radio = 8): Rect => ({ ...enElFotograma(r), radio });

/** Un rectángulo agrandado por igual en los cuatro lados (para que el aro no pise el borde). */
export const holgura = (r: Rect, h: number): Rect => ({ x: r.x - h, y: r.y - h, ancho: r.ancho + h * 2, alto: r.alto + h * 2, radio: r.radio });

/** La unión de dos rectángulos. */
export const union = (a: Rect, b: Rect): Rect => {
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	return { x, y, ancho: Math.max(a.x + a.ancho, b.x + b.ancho) - x, alto: Math.max(a.y + a.alto, b.y + b.alto) - y, radio: a.radio };
};

/**
 * EL LIENZO DE LA APLICACIÓN: la cáscara y lo que va encima, en el sitio y a la escala de todos los
 * vídeos de ayuda (`encuadre.ts`). El puntero va dentro, en coordenadas de la cáscara.
 */
export const Lienzo: React.FC<{ opacidad?: number; children: React.ReactNode }> = ({ opacidad = 1, children }) => (
	<div
		style={{
			position: 'absolute',
			left: ORIGEN.x,
			top: ORIGEN.y,
			width: MEDIDAS.ancho * ESCALA_CASCARA,
			height: MEDIDAS.alto * ESCALA_CASCARA,
			opacity: opacidad,
		}}
	>
		<div style={{ position: 'relative', width: MEDIDAS.ancho, height: MEDIDAS.alto, transformOrigin: '0 0', transform: `scale(${ESCALA_CASCARA})` }}>
			{children}
		</div>
	</div>
);

/** Lo que tarda en abrirse algo que se despliega (un desplegable de Ant, un cajón): 0 → 1. */
export function abre(frame: number, fps: number, desde: number, hasta = 1e9, dur = 10): number {
	if (frame < desde) { return 0; }
	const a = spring({ frame: frame - desde, fps, config: { damping: 20, mass: 0.5 }, durationInFrames: dur });
	const b = interpolate(frame, [hasta, hasta + 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	return a * b;
}

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LOS MENSAJES DE ARRIBA (`nz-message`): «Periodo cambiado al 4.», «Año cambiado a 2025.»…
 *
 * En la aplicación son pequeños y salen arriba en el centro. Aquí salen en el mismo sitio --arriba
 * de la aplicación, centrados en ella-- pero a letra de vídeo, como el aviso de la planilla: si el
 * mensaje es lo que el vídeo explica, tiene que poder leerse en un móvil. Se apilan hacia abajo, uno
 * por renglón, como los de Ant.
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */

export interface Mensaje {
	texto: string;
	tipo: 'exito' | 'info';
	desde: number;
	/** Cuánto se queda. En Ant, 3 s por defecto. */
	dura: number;
}

export const Mensajes: React.FC<{
	mensajes: Mensaje[];
	/** Dónde se centran, en x del fotograma. Por defecto, en el centro de la aplicación. */
	centroX?: number;
	/** El ancho máximo de uno: si el texto no cabe, parte en dos renglones. */
	anchoMax?: number;
	letra?: number;
}> = ({ mensajes, centroX, anchoMax = 1100, letra = 32 }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const vivos = mensajes.filter((m) => frame >= m.desde && frame < m.desde + m.dura + 14);

	return (
		<div
			style={{
				position: 'absolute',
				left: (centroX ?? ORIGEN.x + (MEDIDAS.ancho * ESCALA_CASCARA) / 2) - 700,
				width: 1400,
				top: ORIGEN.y + 14,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				zIndex: 25,
				pointerEvents: 'none',
			}}
		>
			{vivos.map((m) => {
				const t = spring({ frame: frame - m.desde, fps, config: { damping: 16, mass: 0.5 }, durationInFrames: 14 });
				const fuera = interpolate(frame - m.desde - m.dura, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
				/*
				 * EL QUE SE VA CEDE SU SITIO POCO A POCO, como en Ant: si se quitara de golpe, el de debajo
				 * subiría en un fotograma (la pasada de glitches lo marca como GOLPE). El hueco entre avisos va
				 * DENTRO de cada uno (paddingBottom) y no en el `gap`: con `gap`, el alto tenía que restar 12 y
				 * se hacía negativo al final de la salida -- el navegador lo ignora, el aviso recupera su alto
				 * entero un fotograma, y eso era un PARPADEO.
				 */
				const alto = letra * 1.25 + 36;
				return (
					<div key={`${m.desde}-${m.texto}`} style={{ height: fuera > 0 ? (alto + 12) * (1 - fuera) : undefined, paddingBottom: fuera > 0 ? 0 : 12, display: 'flex', justifyContent: 'center', overflow: 'visible' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '18px 34px',
							borderRadius: 14,
							background: '#fff',
							fontFamily: FUENTE,
							fontSize: letra,
							maxWidth: anchoMax,
							boxSizing: 'border-box',
							lineHeight: 1.25,
							fontWeight: 600,
							color: 'rgba(0,0,0,.88)',
							boxShadow: '0 12px 34px rgba(15,28,52,.16), 0 4px 10px -4px rgba(15,28,52,.2)',
							opacity: t * (1 - fuera),
							transform: `translateY(${interpolate(t, [0, 1], [-40, 0]) - fuera * 24}px)`,
						}}
					>
						{m.tipo === 'exito' ? (
							<svg width="36" height="36" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
								<circle cx="12" cy="12" r="11" fill="#52c41a" />
								<path d="M6.8 12.3l3.4 3.4 6.9-7.1" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						) : (
							<svg width="36" height="36" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
								<circle cx="12" cy="12" r="11" fill="#1677ff" />
								<circle cx="12" cy="7.4" r="1.5" fill="#fff" />
								<path d="M12 10.8 V17.4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
							</svg>
						)}
						<span style={{ fontVariantNumeric: 'tabular-nums' }}>{m.texto}</span>
					</div>
					</div>
				);
			})}
		</div>
	);
};

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * LA TECLA. No es de la aplicación: es de la capa de ayuda, como el puntero. Sin ella, un atajo de
 * teclado en un vídeo mudo es un cuadro que aparece solo y nadie sabe por qué.
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */
export const Teclas: React.FC<{ teclas: string[]; desde: number; hasta: number; pulsa: number }> = ({ teclas, desde, hasta, pulsa }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (frame < desde || frame > hasta + 10) { return null; }
	const a = spring({ frame: frame - desde, fps, config: { damping: 16, mass: 0.5 }, durationInFrames: 12 });
	const b = interpolate(frame, [hasta, hasta + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const hundida = interpolate(frame - pulsa, [0, 3, 9], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 640,
				display: 'flex',
				justifyContent: 'center',
				gap: 18,
				opacity: a * b,
				transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`,
				zIndex: 26,
				fontFamily: FUENTE,
			}}
		>
			{teclas.map((t, i) => (
				<React.Fragment key={t}>
					{i > 0 && <span style={{ fontSize: 56, fontWeight: 700, color: '#0f1c34', alignSelf: 'center' }}>+</span>}
					<div
						style={{
							minWidth: 120,
							height: 120,
							padding: '0 28px',
							boxSizing: 'border-box',
							borderRadius: 20,
							background: '#fff',
							border: '2px solid #c9d2e0',
							borderBottomWidth: 2 + 8 * (1 - hundida),
							marginTop: 8 * hundida,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 60,
							fontWeight: 700,
							color: '#0f1c34',
							boxShadow: '0 16px 40px rgba(15,28,52,.22)',
						}}
					>
						{t}
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

/*
 * ────────────────────────────────────────────────────────────────────────────────────────────
 * EL RASTRO (`cascara/migas/migas.html`): «Panel › Académico › Mis asignaturas». Las migas con
 * destino son enlaces, la sección («Académico») y la última no. A la derecha, en la misma fila,
 * «Volver a la primera versión» (`paginas/panel/panel.html:200-203`). En la portada no se pinta.
 * ────────────────────────────────────────────────────────────────────────────────────────────
 */
export interface Miga {
	etiqueta: string;
	enlace: boolean;
}

export const MIGAS_ALTO = 40;
export const MIGA_LETRA = 15;

/** Lo que ocupa una miga a lo ancho (letra de 15 px). Lo usa el guion para señalarla. */
export function anchoDeTexto(texto: string, letra = MIGA_LETRA): number {
	return texto.length * letra * 0.54;
}
const SEPARADOR = 26;

/** Dónde cae cada miga, en coordenadas de la pantalla de dentro (desde `izquierda`). */
export function posicionesDeMigas(migas: Miga[], izquierda: number) {
	let x = izquierda;
	return migas.map((m) => {
		const r = { x, ancho: anchoDeTexto(m.etiqueta) };
		x += r.ancho + SEPARADOR;
		return r;
	});
}

export const Migas: React.FC<{
	migas: Miga[];
	izquierda: number;
	derecha: number;
	colores: { texto: string; tenue: string; acento: string };
	/** La miga que el ratón tiene encima. */
	senalada?: number | null;
}> = ({ migas, izquierda, derecha, colores, senalada = null }) => {
	return (
		<div style={{ position: 'relative', height: MIGAS_ALTO, fontSize: MIGA_LETRA, fontFamily: FUENTE }}>
			{/* EN FILA NATURAL, no en absoluto: el ancho estimado sólo lo usa el guion para apuntar. */}
			<div style={{ position: 'absolute', left: izquierda, top: 0, height: MIGAS_ALTO, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
				{migas.map((m, i) => (
					<React.Fragment key={`${m.etiqueta}-${i}`}>
						<span
							style={{
								color: i === migas.length - 1 ? colores.texto : m.enlace ? colores.acento : colores.tenue,
								fontWeight: i === migas.length - 1 ? 600 : 400,
								textDecoration: senalada === i ? 'underline' : 'none',
							}}
						>
							{m.etiqueta}
						</span>
						{i < migas.length - 1 && (
							<svg width="10" height="10" viewBox="0 0 10 10" style={{ margin: `0 ${(SEPARADOR - 10) / 2}px` }}>
								<path d="M3.5 1.8 L6.8 5 L3.5 8.2" fill="none" stroke={colores.tenue} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						)}
					</React.Fragment>
				))}
			</div>
			<span
				style={{
					position: 'absolute',
					right: derecha,
					top: 0,
					height: MIGAS_ALTO,
					display: 'flex',
					alignItems: 'center',
					fontSize: 14,
					color: colores.tenue,
				}}
			>
				Volver a la primera versión
			</span>
		</div>
	);
};
