import React from 'react';
import { interpolate } from 'remotion';

import { PALETA_CLARA, PaletaCascara } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';
import { FUENTE } from '../tema';
import { Rect } from './comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CAJÓN «ASPECTO» (`app2/src/app/cascara/mandos-aspecto/mandos-aspecto.html` y
 * `core/tema/tema-usuario.ts`): lo abre el engranaje de la barra, sale por la derecha, y en este
 * orden lleva Tema, Color, Modo, El menú (Estilo y Dónde va el menú), Densidad de las tablas y
 * Detalles. Abajo del todo, la nota que mata la duda de `a-tu-gusto`:
 *
 *     «Lo que elijas se guarda en este navegador y se aplica al momento.»
 *
 * Las siete cosas van a `localStorage` (`myvc_tema_*`, `tema-usuario.ts:495-513`): no viajan con la
 * cuenta. Es lo contrario del año y el periodo, que sí (`selector-academico.html:131-134`).
 *
 * EL TEMA ELEGIDO EN LOS VÍDEOS ES «DOCUMENTACIÓN» («Claro, plano y minimalista») y el menú, claro:
 * es lo que dibujan todos los vídeos de ayuda. Con «Cristal», el de fábrica, el color, el estilo del
 * menú y la densidad salen apagados con su porqué debajo; con Documentación están vivos.
 *
 * En la aplicación el cajón mide 340 px; aquí 440, a letra de vídeo. Es más alto que la pantalla y
 * se desplaza, como en la aplicación: `scroll` dice cuánto.
 */

export type Tema = 'cristal' | 'gaceta' | 'documentacion' | 'tinta';
export type Modo = 'sistema' | 'claro' | 'oscuro';

export const TEMAS: { valor: Tema; nombre: string; resumen: string }[] = [
	{ valor: 'cristal', nombre: 'Cristal', resumen: 'Suelo claro y paneles translúcidos.' },
	{ valor: 'gaceta', nombre: 'Gaceta', resumen: 'Cromo oscuro y titulares en serif.' },
	{ valor: 'documentacion', nombre: 'Documentación', resumen: 'Claro, plano y minimalista.' },
	{ valor: 'tinta', nombre: 'Tinta', resumen: 'Plano, con el color elegido.' },
];

export const NOTA = 'Lo que elijas se guarda en este navegador y se aplica al momento.';

export interface EstadoAspecto {
	tema: Tema;
	modo: Modo;
	estiloMenu: 'oscuro' | 'claro';
	disposicion: 'lateral' | 'superior';
	densidad: 'comoda' | 'compacta';
}

export const POR_DEFECTO_EN_LOS_VIDEOS: EstadoAspecto = {
	tema: 'documentacion',
	modo: 'claro',
	estiloMenu: 'claro',
	disposicion: 'lateral',
	densidad: 'comoda',
};

/* ── Geometría, en coordenadas de la cáscara (con `scroll` = 0) ───────────────────────────── */

export const CAJON = { ancho: 440, cabecera: 60, relleno: 22 };
const X = MEDIDAS.ancho - CAJON.ancho;
const IZQ = X + CAJON.relleno;
const ANCHO_UTIL = CAJON.ancho - CAJON.relleno * 2;
const H3 = 32;
const SECCION = 20;
const RADIO_ALTO = 38;

const Y = (() => {
	let y = CAJON.cabecera + 16;
	const tema = y; y += H3 + 2 * 124 + 12 + SECCION;
	const color = y; y += H3 + 42 + 42 + SECCION;
	const modo = y; y += 40 + RADIO_ALTO + SECCION;
	const menu = y; y += H3 + 26 + RADIO_ALTO + 12 + 26 + RADIO_ALTO + SECCION;
	const densidad = y; y += H3 + RADIO_ALTO + SECCION;
	const detalles = y; y += H3 + 30 + 44 + SECCION;
	const nota = y; y += 60;
	return { tema, color, modo, menu, densidad, detalles, nota, fin: y };
})();

/** Cuánto hay que bajar para ver la nota del final entera. */
export const SCROLL_MAXIMO = Y.fin - MEDIDAS.alto + 40;

const mitad = (ANCHO_UTIL - 10) / 2;

export const ASPECTO = {
	tema: (s = 0): Rect => ({ x: IZQ - 6, y: Y.tema - 4 - s, ancho: ANCHO_UTIL + 12, alto: H3 + 2 * 124 + 12 + 8, radio: 10 }),
	modo: (s = 0): Rect => ({ x: IZQ - 6, y: Y.modo - 4 - s, ancho: ANCHO_UTIL + 12, alto: 40 + RADIO_ALTO + 10, radio: 10 }),
	oscuro: (s = 0): Rect => ({ x: IZQ + mitad + 10, y: Y.modo + 40 - s, ancho: mitad, alto: RADIO_ALTO, radio: 6 }),
	menu: (s = 0): Rect => ({ x: IZQ - 6, y: Y.menu - 4 - s, ancho: ANCHO_UTIL + 12, alto: H3 + 26 + RADIO_ALTO + 12 + 26 + RADIO_ALTO + 10, radio: 10 }),
	disposicion: (s = 0): Rect => ({ x: IZQ - 6, y: Y.menu + H3 + 26 + RADIO_ALTO + 12 - 4 - s, ancho: ANCHO_UTIL + 12, alto: 26 + RADIO_ALTO + 10, radio: 10 }),
	densidad: (s = 0): Rect => ({ x: IZQ - 6, y: Y.densidad - 4 - s, ancho: ANCHO_UTIL + 12, alto: H3 + RADIO_ALTO + 10, radio: 10 }),
	compacta: (s = 0): Rect => ({ x: IZQ + mitad + 10, y: Y.densidad + H3 - s, ancho: mitad, alto: RADIO_ALTO, radio: 6 }),
	nota: (s = 0): Rect => ({ x: IZQ - 6, y: Y.nota - 2 - s, ancho: ANCHO_UTIL + 12, alto: 66, radio: 10 }),
};

/* ── El dibujo ─────────────────────────────────────────────────────────────────────────────── */

export const Aspecto: React.FC<{
	abierto: number;
	estado: EstadoAspecto;
	scroll?: number;
	p?: PaletaCascara;
	/** Lo que el ratón tiene encima: `'oscuro'`, `'compacta'`… */
	senalado?: string | null;
}> = ({ abierto, estado, scroll = 0, p = PALETA_CLARA, senalado = null }) => {
	if (abierto <= 0.001) { return null; }
	const oscuro = p !== PALETA_CLARA;
	const linea = oscuro ? '#303030' : '#f0f0f0';
	const suave = oscuro ? 'rgba(255,255,255,.65)' : '#595959';
	const colorAplica = estado.tema !== 'cristal';

	return (
		<>
			<div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.45 * abierto})`, borderRadius: 12, zIndex: 11 }} />
			<div
				style={{
					position: 'absolute',
					left: X,
					top: 0,
					width: CAJON.ancho,
					height: MEDIDAS.alto,
					background: p.superficie,
					color: p.texto,
					fontFamily: FUENTE,
					boxShadow: '-6px 0 16px rgba(0,0,0,.08), -12px 0 48px rgba(0,0,0,.05)',
					transform: `translateX(${interpolate(abierto, [0, 1], [CAJON.ancho, 0])}px)`,
					overflow: 'hidden',
					borderRadius: '0 12px 12px 0',
					zIndex: 12,
				}}
			>
				{/* El cuerpo, desplazable. Las `top` son las de `Y`, menos lo desplazado. */}
				<div style={{ position: 'absolute', left: 0, top: -scroll, width: CAJON.ancho, height: Y.fin }}>
					<Titulo3 y={Y.tema}>Tema</Titulo3>
					{TEMAS.map((t, i) => {
						const col = i % 2;
						const fila = Math.floor(i / 2);
						const elegido = estado.tema === t.valor;
						return (
							<div
								key={t.valor}
								style={{
									position: 'absolute',
									left: CAJON.relleno + col * (mitad + 10),
									top: Y.tema + H3 + fila * 130,
									width: mitad,
									height: 124,
									boxSizing: 'border-box',
									border: `${elegido ? 2 : 1}px solid ${elegido ? p.acento : oscuro ? '#424242' : '#e5e5e5'}`,
									borderRadius: 10,
									padding: 8,
								}}
							>
								<Mini tema={t.valor} />
								<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 15, fontWeight: 600 }}>
									{t.nombre}
									{elegido && (
										<svg width="15" height="15" viewBox="0 0 16 16">
											<circle cx="8" cy="8" r="7.2" fill={p.acento} />
											<path d="M4.8 8.2 L7 10.4 L11.2 6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</div>
								<div style={{ fontSize: 12.5, color: suave, marginTop: 2, lineHeight: 1.3 }}>{t.resumen}</div>
							</div>
						);
					})}

					<Titulo3 y={Y.color}>Color</Titulo3>
					<div style={{ position: 'absolute', left: CAJON.relleno, top: Y.color + H3, display: 'flex', gap: 14, opacity: colorAplica ? 1 : 0.4 }}>
						{['#1677ff', '#389e0d', '#722ed1', '#fa8c16'].map((c, i) => (
							<div key={c} style={{ width: 32, height: 32, borderRadius: '50%', background: c, boxShadow: i === 0 ? `0 0 0 3px ${p.superficie}, 0 0 0 5px ${c}` : 'none' }} />
						))}
					</div>
					<div style={{ position: 'absolute', left: CAJON.relleno, width: ANCHO_UTIL, top: Y.color + H3 + 44, fontSize: 13.5, color: suave }}>
						Tiñe lo que se pulsa y dónde estás, no el tema entero.
					</div>

					<div style={{ position: 'absolute', left: CAJON.relleno, width: ANCHO_UTIL, top: Y.modo, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<span style={{ fontSize: 17, fontWeight: 600 }}>Modo</span>
						<Pastilla texto="Como el sistema" activa={estado.modo === 'sistema'} p={p} />
					</div>
					<Par y={Y.modo + 40} opciones={['Claro', 'Oscuro']} elegida={estado.modo === 'claro' ? 0 : estado.modo === 'oscuro' ? 1 : -1} encima={senalado === 'oscuro' ? 1 : -1} p={p} />

					<Titulo3 y={Y.menu}>El menú</Titulo3>
					<Subcampo y={Y.menu + H3}>Estilo</Subcampo>
					<Par y={Y.menu + H3 + 26} opciones={['Oscuro', 'Claro']} elegida={estado.estiloMenu === 'oscuro' ? 0 : 1} p={p} />
					<Subcampo y={Y.menu + H3 + 26 + RADIO_ALTO + 12}>Dónde va el menú</Subcampo>
					<Par y={Y.menu + H3 + 26 + RADIO_ALTO + 12 + 26} opciones={['Lateral', 'Superior']} elegida={estado.disposicion === 'lateral' ? 0 : 1} p={p} />

					<Titulo3 y={Y.densidad}>Densidad de las tablas</Titulo3>
					<Par y={Y.densidad + H3} opciones={['Cómoda', 'Compacta']} elegida={estado.densidad === 'comoda' ? 0 : 1} encima={senalado === 'compacta' ? 1 : -1} p={p} />

					<Titulo3 y={Y.detalles}>Detalles</Titulo3>
					<div style={{ position: 'absolute', left: CAJON.relleno, top: Y.detalles + H3, height: 30, display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
						<div style={{ width: 40, height: 22, borderRadius: 11, background: oscuro ? '#434343' : '#bfbfbf', position: 'relative' }}>
							<div style={{ position: 'absolute', left: 2, top: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
						</div>
						Efecto alegre al pulsar
					</div>
					<div style={{ position: 'absolute', left: CAJON.relleno, width: ANCHO_UTIL, top: Y.detalles + H3 + 34, fontSize: 13.5, color: suave }}>
						En vez de la onda de siempre, el botón da un bote y salen chispas.
					</div>

					<div style={{ position: 'absolute', left: CAJON.relleno, width: ANCHO_UTIL, top: Y.nota, paddingTop: 12, borderTop: `1px solid ${linea}`, fontSize: 15, color: suave, lineHeight: 1.4 }}>
						{NOTA}
					</div>
				</div>

				{/* LA CABECERA DEL CAJÓN, fija: el título y la equis. */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: CAJON.ancho,
						height: CAJON.cabecera,
						boxSizing: 'border-box',
						background: p.superficie,
						borderBottom: `1px solid ${linea}`,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: `0 ${CAJON.relleno}px`,
						fontSize: 18,
						fontWeight: 600,
					}}
				>
					<svg width="14" height="14" viewBox="0 0 14 14">
						<path d="M2 2 L12 12 M12 2 L2 12" stroke={suave} strokeWidth="1.6" strokeLinecap="round" />
					</svg>
					Aspecto
				</div>
			</div>
		</>
	);
};

const Titulo3: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
	<div style={{ position: 'absolute', left: CAJON.relleno, top: y, height: H3, fontSize: 17, fontWeight: 600 }}>{children}</div>
);

const Subcampo: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
	<div style={{ position: 'absolute', left: CAJON.relleno, top: y, height: 24, fontSize: 14, opacity: 0.75 }}>{children}</div>
);

/** Dos botones de radio de Ant, estilo «solid»: el elegido, lleno del color de acento. */
const Par: React.FC<{ y: number; opciones: string[]; elegida: number; encima?: number; p: PaletaCascara }> = ({ y, opciones, elegida, encima = -1, p }) => (
	<div style={{ position: 'absolute', left: CAJON.relleno, top: y, width: ANCHO_UTIL, height: RADIO_ALTO, display: 'flex', gap: 10 }}>
		{opciones.map((o, i) => (
			<div
				key={o}
				style={{
					flex: 1,
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 6,
					border: `1px solid ${i === elegida || i === encima ? p.acento : p.borde}`,
					background: i === elegida ? p.acento : 'transparent',
					color: i === elegida ? '#fff' : i === encima ? p.acento : p.texto,
					fontSize: 15,
					fontWeight: i === elegida ? 600 : 400,
				}}
			>
				{o}
			</div>
		))}
	</div>
);

const Pastilla: React.FC<{ texto: string; activa: boolean; p: PaletaCascara }> = ({ texto, activa, p }) => (
	<div
		style={{
			height: 30,
			padding: '0 12px',
			display: 'flex',
			alignItems: 'center',
			borderRadius: 6,
			border: `1px solid ${activa ? p.acento : p.borde}`,
			background: activa ? `${p.acento}1a` : 'transparent',
			color: activa ? p.acento : p.texto,
			fontSize: 13.5,
		}}
	>
		{texto}
	</div>
);

/** La miniatura de cada tema: el lado (el menú), la barra y un panel. */
const Mini: React.FC<{ tema: Tema }> = ({ tema }) => {
	const c = {
		cristal: { fondo: 'linear-gradient(135deg, #eef3fb, #e3ecf8)', lado: 'rgba(255,255,255,.7)', barra: 'rgba(255,255,255,.8)', panel: 'rgba(255,255,255,.75)' },
		gaceta: { fondo: '#f4f1ea', lado: '#1f2329', barra: '#1f2329', panel: '#ffffff' },
		documentacion: { fondo: '#f5f7fa', lado: '#ffffff', barra: '#ffffff', panel: '#ffffff' },
		tinta: { fondo: '#ffffff', lado: '#e8f1ff', barra: '#1677ff', panel: '#f7f9fc' },
	}[tema];
	return (
		<div style={{ position: 'relative', height: 50, borderRadius: 6, background: c.fondo, border: '1px solid rgba(0,0,0,.08)', overflow: 'hidden' }}>
			<span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, background: c.lado, borderRight: '1px solid rgba(0,0,0,.06)' }} />
			<span style={{ position: 'absolute', left: 30, right: 0, top: 0, height: 11, background: c.barra, borderBottom: '1px solid rgba(0,0,0,.06)' }} />
			<span style={{ position: 'absolute', left: 38, right: 8, top: 18, bottom: 7, borderRadius: 4, background: c.panel, border: '1px solid rgba(0,0,0,.06)' }} />
		</div>
	);
};
