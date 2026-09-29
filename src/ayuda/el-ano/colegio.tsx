import React from 'react';

import { COLEGIO } from '../colegio';
import { MEDIDAS } from '../medidas';
import { ACENTO, AVISO_AMARILLO, BORDE, Boton, Icono, LETRA, Panel as PanelDeOpciones, SUPERFICIE, TEXTO, TEXTO_TENUE, type Opcion } from '../montar-el-ano/ant';
import type { Rect } from './Aplicacion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «CONFIGURACIÓN ▸ EL COLEGIO»: LA CABECERA DEL AÑO Y SU TIRA DE PESTAÑAS, y dónde cae cada cosa.
 *
 * La comparten los vídeos de ajustes, ficha, compromiso y el mapa. Los textos son los de
 * `app2/src/app/paginas/colegio/colegio.html`: el nombre del colegio del año, «Año 2026» con su
 * etiqueta «el año en curso», el selector «Año lectivo» («2026 · en curso»), «Todos los años»,
 * «Recargar» e «Historial de cambios», el aviso de año que no es el de curso y las seis pestañas.
 *
 * TODO VA EN COORDENADAS DEL CONTENIDO (a la derecha del menú, debajo de la barra) y con el scroll
 * de la página aparte: el guion y el dibujo llaman a las mismas funciones.
 */

export const NOMBRE_COLEGIO = COLEGIO.nombre;
export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;

export const CG = {
	lado: 24,
	arriba: 20,
	hueco: 16,
	relleno: 20,
	/** El panel de navegación sin el aviso de año viejo. */
	nav: 150,
	/** Lo que crece el panel con el aviso amarillo («Estás en un año que no es…»). */
	aviso: 76,
	pestanas: 102,
	pestana: 46,
};

export const ANCHO_PANEL = ANCHO_CONTENIDO - CG.lado * 2;

export const PESTANAS = [
	{ etiqueta: 'Periodos', ancho: 132 },
	{ etiqueta: 'Ficha del colegio', ancho: 186 },
	{ etiqueta: 'Ajustes del año', ancho: 172 },
	{ etiqueta: 'Certificados', ancho: 160 },
	{ etiqueta: 'Compromisos', ancho: 160 },
	{ etiqueta: 'Plantilla del compromiso', ancho: 246 },
];
export const P_PERIODOS = 0;
export const P_FICHA = 1;
export const P_AJUSTES = 2;
export const P_CERTIFICADOS = 3;
export const P_COMPROMISOS = 4;
export const P_PLANTILLA = 5;

/** El panel de la cabecera, con o sin el aviso (0..1: crece al aparecer). */
export function rectNav(aviso = 0): Rect {
	return { x: CG.lado, y: CG.arriba, ancho: ANCHO_PANEL, alto: CG.nav + CG.aviso * aviso };
}

/** Donde empiezan los paneles de la pestaña. */
export function arribaDelCuerpo(aviso = 0): number {
	const n = rectNav(aviso);
	return n.y + n.alto + CG.hueco;
}

export function rectPestana(i: number, aviso = 0): Rect {
	const x = CG.lado + CG.relleno + PESTANAS.slice(0, i).reduce((n, p) => n + p.ancho + 4, 0);
	return { x, y: CG.arriba + CG.pestanas + CG.aviso * aviso, ancho: PESTANAS[i].ancho, alto: CG.pestana };
}

/* Los mandos de la derecha, de derecha a izquierda. Anchos fijos: el puntero va a ellos. */
export const MANDOS = { historial: 186, recargar: 112, todos: 150, selector: 176, hueco: 8 };

export function rectSelector(): Rect {
	const derecha = CG.lado + ANCHO_PANEL - CG.relleno;
	const x = derecha - MANDOS.historial - MANDOS.recargar - MANDOS.todos - MANDOS.selector - MANDOS.hueco * 3;
	return { x, y: CG.arriba + CG.relleno + 2, ancho: MANDOS.selector, alto: 32 };
}

export function rectAvisoViejo(): Rect {
	return { x: CG.lado + CG.relleno, y: CG.arriba + 88, ancho: ANCHO_PANEL - CG.relleno * 2, alto: 64 };
}

/** El enlace «Ir a 2026» dentro del aviso. */
export function rectIrAlActual(): Rect {
	const a = rectAvisoViejo();
	return { x: a.x + 590, y: a.y + 34, ancho: 70, alto: 22 };
}

/** De coordenadas del contenido a coordenadas de la cáscara, con el scroll puesto. */
export function enLaCascara(r: Rect, scroll = 0): Rect {
	return { x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra - scroll, ancho: r.ancho, alto: r.alto };
}

/* ── El dibujo ────────────────────────────────────────────────────────────────────────────── */

export interface AnioDelSelector { year: number; enCurso: boolean }

export const CabeceraDelColegio: React.FC<{
	/** El año que se está mirando. */
	year: number;
	enCurso: boolean;
	/** El año que el colegio tiene en curso, para el aviso. */
	actual: number;
	/** 0..1: cuánto asoma el aviso amarillo del año que no es el de curso. */
	aviso?: number;
	pestana: number;
	/** Algo bajo el ratón: `pestana-3`, `selector`… */
	senalado?: string | null;
}> = ({ year, enCurso, actual, aviso = 0, pestana, senalado = null }) => {
	const r = rectNav(aviso);
	const sel = rectSelector();
	return (
		<div
			style={{
				position: 'absolute',
				left: r.x,
				top: r.y,
				width: r.ancho,
				height: r.alto,
				boxSizing: 'border-box',
				background: SUPERFICIE,
				border: '1px solid #e8e8e8',
				borderRadius: 10,
				overflow: 'hidden',
			}}
		>
			<div style={{ position: 'absolute', left: CG.relleno, top: CG.relleno - 2 }}>
				<div style={{ fontSize: 24, fontWeight: 700, color: TEXTO, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{NOMBRE_COLEGIO}</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: LETRA, color: TEXTO_TENUE }}>
					Año {year}
					{enCurso && (
						<span style={{ fontSize: 13, padding: '1px 8px', borderRadius: 4, border: '1px solid #91caff', background: '#e6f4ff', color: '#0958d9' }}>
							el año en curso
						</span>
					)}
				</div>
			</div>

			<div style={{ position: 'absolute', left: sel.x - CG.lado, top: sel.y - CG.arriba, display: 'flex', gap: MANDOS.hueco }}>
				<div
					style={{
						width: MANDOS.selector,
						height: 32,
						boxSizing: 'border-box',
						border: `1px solid ${senalado === 'selector' ? ACENTO : BORDE}`,
						borderRadius: 6,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 11px',
						fontSize: LETRA,
						color: TEXTO,
						background: SUPERFICIE,
					}}
				>
					{year}{enCurso ? ' · en curso' : ''}
					<Icono cual="flecha" tam={13} color="rgba(0,0,0,0.3)" />
				</div>
				<BotonTenue ancho={MANDOS.todos} icono={<IconoLista />} texto="Todos los años" />
				<BotonTenue ancho={MANDOS.recargar} icono={<Icono cual="reload" tam={15} />} texto="Recargar" />
				<BotonTenue ancho={MANDOS.historial} icono={<IconoReloj />} texto="Historial de cambios" />
			</div>

			{aviso > 0.001 && (
				<div
					style={{
						position: 'absolute',
						left: rectAvisoViejo().x - CG.lado,
						top: rectAvisoViejo().y - CG.arriba,
						width: rectAvisoViejo().ancho,
						height: rectAvisoViejo().alto,
						boxSizing: 'border-box',
						opacity: Math.min(1, aviso * 1.4),
						background: AVISO_AMARILLO.fondo,
						border: `1px solid ${AVISO_AMARILLO.borde}`,
						borderRadius: 8,
						padding: '9px 14px',
						display: 'flex',
						gap: 10,
						fontSize: LETRA,
						color: TEXTO,
					}}
				>
					<div style={{ marginTop: 2 }}><Icono cual="alerta" tam={16} color={AVISO_AMARILLO.icono} /></div>
					<div>
						<div style={{ fontWeight: 500 }}>Estás en un año que no es el que el colegio tiene en curso.</div>
						<div style={{ marginTop: 4, fontSize: LETRA - 0.5 }}>
							Lo que cambies aquí no afecta a lo que profesores y alumnos ven hoy. <span style={{ color: ACENTO }}>Ir a {actual}</span>
						</div>
					</div>
				</div>
			)}

			<div
				style={{
					position: 'absolute',
					left: CG.relleno,
					right: CG.relleno,
					top: CG.pestanas + CG.aviso * aviso,
					height: CG.pestana,
					display: 'flex',
					gap: 4,
					boxShadow: 'inset 0 -1px 0 rgb(128 128 128 / 25%)',
				}}
			>
				{PESTANAS.map((t, i) => {
					const puesta = i === pestana;
					const encima = senalado === `pestana-${i}`;
					const color = puesta || encima ? ACENTO : TEXTO_TENUE;
					return (
						<div
							key={t.etiqueta}
							style={{
								width: t.ancho,
								boxSizing: 'border-box',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 7,
								fontSize: LETRA + 0.5,
								whiteSpace: 'nowrap',
								color: puesta || encima ? ACENTO : TEXTO,
								fontWeight: puesta ? 600 : 400,
								borderBottom: `2px solid ${puesta ? ACENTO : 'transparent'}`,
							}}
						>
							<IconoPestana i={i} color={color} />
							{t.etiqueta}
						</div>
					);
				})}
			</div>
		</div>
	);
};

/** El desplegable del selector de años, debajo de él. */
export const DesplegableDeAnios: React.FC<{ anios: AnioDelSelector[]; resaltada: number | null; aparece: number; scroll?: number }> = ({ anios, resaltada, aparece }) => {
	const s = rectSelector();
	const opciones: Opcion[] = anios.map((a) => ({ texto: a.enCurso ? `${a.year} · en curso` : String(a.year) }));
	return (
		<div style={{ position: 'absolute', left: s.x, top: s.y + s.alto + 4, zIndex: 5 }}>
			<PanelDeOpciones opciones={opciones} resaltada={resaltada} ancho={s.ancho} aparece={aparece} />
		</div>
	);
};

export function rectOpcionDeAnio(i: number): Rect {
	const s = rectSelector();
	return { x: s.x + 4, y: s.y + s.alto + 4 + 4 + i * 34, ancho: s.ancho - 8, alto: 34 };
}

const BotonTenue: React.FC<{ ancho: number; icono: React.ReactNode; texto: string }> = ({ ancho, icono, texto }) => (
	<div
		style={{
			width: ancho,
			height: 32,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 7,
			borderRadius: 6,
			border: `1px solid ${BORDE}`,
			fontSize: LETRA - 0.5,
			color: TEXTO_TENUE,
			background: SUPERFICIE,
			whiteSpace: 'nowrap',
		}}
	>
		{icono}
		{texto}
	</div>
);

const IconoLista: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
		<path d="M9 6h11M9 12h11M9 18h11M4 6h.5M4 12h.5M4 18h.5" />
	</svg>
);

const IconoReloj: React.FC = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 7.5V12l3 2" />
	</svg>
);

/** Los iconos de las seis pestañas: calendar, idcard, setting, safety-certificate, solution, file-done. */
export const IconoPestana: React.FC<{ i: number; color: string }> = ({ i, color }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden style={{ flex: 'none' }}>
			{i === 0 && (<><rect x="2" y="3" width="12" height="11" rx="1.5" {...t} /><path d="M2 6.5 H14 M5 1.8 V4 M11 1.8 V4" {...t} /></>)}
			{i === 1 && (<><rect x="1.5" y="3" width="13" height="10" rx="1.5" {...t} /><circle cx="5.5" cy="7.3" r="1.6" {...t} /><path d="M9 6.5 H12.5 M9 9.2 H12.5 M3.3 11 C3.8 9.6 7.2 9.6 7.7 11" {...t} /></>)}
			{i === 2 && (<><circle cx="8" cy="8" r="2.2" {...t} /><path d="M8 1.8 V3.4 M8 12.6 V14.2 M1.8 8 H3.4 M12.6 8 H14.2 M3.6 3.6 L4.7 4.7 M11.3 11.3 L12.4 12.4 M12.4 3.6 L11.3 4.7 M4.7 11.3 L3.6 12.4" {...t} /></>)}
			{i === 3 && (<><path d="M8 1.6 L13.6 3.6 V7.8 C13.6 11 11.2 13.2 8 14.4 C4.8 13.2 2.4 11 2.4 7.8 V3.6 Z" {...t} /><path d="M5.6 8 L7.4 9.8 L10.6 6.4" {...t} /></>)}
			{i === 4 && (<><path d="M3 2.5 H10.5 L13 5 V13.5 H3 Z" {...t} /><path d="M5.5 7 H10.5 M5.5 9.5 H9" {...t} /></>)}
			{i === 5 && (<><path d="M3 2 H10 L13 5 V14 H3 Z" {...t} /><path d="M5.6 9.2 L7.4 11 L10.6 7.4" {...t} /></>)}
		</svg>
	);
};

/* ── Piezas que repiten las pestañas ──────────────────────────────────────────────────────── */

/** Un panel blanco de la página, en coordenadas del contenido. `destacado` es el borde azul. */
export const Bloque: React.FC<{ r: Rect; titulo?: string; destacado?: boolean; peligro?: boolean; children?: React.ReactNode; opacidad?: number }> = ({
	r, titulo, destacado = false, peligro = false, children, opacidad = 1,
}) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			padding: CG.relleno,
			background: SUPERFICIE,
			border: `1px solid ${destacado ? ACENTO : peligro ? '#ffccc7' : '#e8e8e8'}`,
			borderRadius: 10,
			overflow: 'hidden',
			opacity: opacidad,
			color: TEXTO,
			fontSize: LETRA,
		}}
	>
		{titulo && <div style={{ fontSize: 17, fontWeight: 700, color: peligro ? '#e61900' : TEXTO, height: 26, lineHeight: '26px', marginBottom: 8 }}>{titulo}</div>}
		{children}
	</div>
);

/** El texto gris de ayuda de la aplicación (`nz-typography nzType="secondary"`). */
export const Pista: React.FC<{ children: React.ReactNode; tam?: number; estilo?: React.CSSProperties }> = ({ children, tam = LETRA - 1, estilo }) => (
	<div style={{ fontSize: tam, lineHeight: 1.45, color: TEXTO_TENUE, ...estilo }}>{children}</div>
);

/** La barra de abajo de «sin guardar» (ficha y compromisos): pegada al pie de lo que se ve. */
export const BarraSinGuardar: React.FC<{ texto: string; guardar: string; aparece: number; encima?: boolean; cargando?: boolean; anchoGuardar?: number; frame?: number }> = ({ texto, guardar, aparece, encima = false, cargando = false, anchoGuardar, frame = 0 }) => (
	<div
		style={{
			position: 'absolute',
			left: CG.lado,
			width: ANCHO_PANEL,
			bottom: 16,
			height: 60,
			boxSizing: 'border-box',
			padding: '0 18px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			background: SUPERFICIE,
			border: `1px solid ${ACENTO}`,
			borderRadius: 10,
			boxShadow: '0 -4px 18px rgba(0,0,0,0.08)',
			opacity: aparece,
			transform: `translateY(${(1 - aparece) * 30}px)`,
			fontSize: LETRA,
			color: TEXTO,
			zIndex: 4,
		}}
	>
		<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			<Icono cual="edit" tam={15} color={ACENTO} />
			{texto}
		</span>
		<span style={{ display: 'flex', gap: 8 }}>
			<Boton texto="Descartar" />
			<Boton texto={guardar} tipo="primary" encima={encima} cargando={cargando} ancho={anchoGuardar} giroCarga={(frame * 24) % 360} />
		</span>
	</div>
);

/** Donde cae el botón de guardar de la barra, en coordenadas del contenido (la barra no scrolla). */
export function rectGuardarDeLaBarra(anchoBoton: number): Rect {
	const alto = MEDIDAS.alto - MEDIDAS.barra;
	return { x: CG.lado + ANCHO_PANEL - 18 - anchoBoton, y: alto - 16 - 60 + 14, ancho: anchoBoton, alto: 32 };
}

/** «✎ sin guardar» junto a la etiqueta de un campo tocado. */
export const SinGuardar: React.FC = () => (
	<span style={{ marginLeft: 8, fontSize: 12.5, color: ACENTO, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
		<Icono cual="edit" tam={12} color={ACENTO} /> sin guardar
	</span>
);
