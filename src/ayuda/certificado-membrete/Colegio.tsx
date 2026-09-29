import React from 'react';
import { interpolate } from 'remotion';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { ALMENDROS, Membrete, MEMBRETE } from '../colegio';
import {
	ANCHO_CONTENIDO,
	CUERPO,
	EstadoPantalla,
	G,
	PESTANAS,
	PLANTILLAS,
	POPCONFIRM,
	Plantilla,
	TEXTOS,
	Trozo,
	YEAR,
	disposicion,
	rectEditor,
	rectPestana,
	rectPopconfirm,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL COLEGIO» DEL AÑO, CON LA PESTAÑA «CERTIFICADOS» (`colegio.html` + `colegio-certificados.html`).
 *
 * UNA SOLA PANTALLA PARA LOS DOS VÍDEOS, y todo lo que cambia llega por props desde la escena: qué
 * pestaña está puesta, cuánto se ha bajado, qué panel está abierto, qué se ha tecleado. La
 * geometría no se decide aquí: sale de `disposicion()` en `datos.ts`, que es la misma que usa el
 * guion para el foco y el puntero.
 *
 * LO QUE NO SE DIBUJA: el cuerpo de la pestaña «Periodos». El vídeo pasa por ella medio segundo
 * --es la que abre por defecto un admin (`colegio.ts`)-- y lo que importa de ese medio segundo es
 * la tira de pestañas, no los periodos. Se ve la pestaña marcada y el cuerpo aún sin llegar.
 */

export interface PropsColegio {
	/** Qué pestaña está marcada. */
	pestana: number;
	/** 0..1: cuánto ha llegado el cuerpo de «Certificados». */
	cuerpo: number;
	/** Cuánto se ha bajado la página, en píxeles de la cáscara. */
	scroll: number;
	estado: EstadoPantalla;
	/** Qué plantilla imprime 2026 (índice en `PLANTILLAS`). */
	puesta: number;
	/** Lo tecleado en «Altura encabezado» de la membretada, o `null` si no se ha tocado. */
	alturaTecleada?: string | null;
	/** Si la casilla de altura tiene el foco (y su cursor). */
	alturaConFoco?: boolean;
	/** Qué plantillas tienen algo sin guardar. */
	sucias?: boolean[];
	/** El «Texto bajo el membrete» tal como está ahora mismo. */
	textoEncabezado: string;
	textoConFoco?: boolean;
	/** Si el texto difiere del guardado: chip «sin guardar» en su rótulo. */
	textoSucio?: boolean;
	/** El popconfirm de borrar, sobre la plantilla `i`, con su 0..1. */
	popconfirm?: { i: number; t: number } | null;
	/** Algo bajo el ratón: una pestaña, un botón del año, el nombre de una plantilla… */
	senalado?: string | null;
	/** Para los parpadeos del cursor de texto. */
	frame: number;
}

export const Colegio: React.FC<PropsColegio> = (p) => {
	const d = disposicion(p.estado);

	return (
		<div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
			<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO_CONTENIDO, transform: `translateY(${-p.scroll}px)` }}>
				<Navegacion pestana={p.pestana} senalado={p.senalado ?? null} />

				<div style={{ opacity: p.cuerpo, transform: `translateY(${(1 - p.cuerpo) * 14}px)` }}>
					<PanelDelAnio {...p} />
					<PanelDeTextos {...p} />
					<Membretes r={d.c} />
					{PLANTILLAS.map((pl, i) =>
						p.estado.vivas[i] > 0.001 ? (
							<PanelDePlantilla key={pl.id} i={i} plantilla={pl} props={p} rect={d.plantillas[i]} />
						) : null,
					)}
				</div>
			</div>

			{p.popconfirm && p.popconfirm.t > 0 && (
				<Popconfirm rect={rectPopconfirm(p.estado, p.popconfirm.i)} scroll={p.scroll} t={p.popconfirm.t} />
			)}
		</div>
	);
};

/* ── Piezas comunes ───────────────────────────────────────────────────────────────────────── */

const Panel: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; borde?: string; children: React.ReactNode }> = ({ r, borde, children }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			padding: G.relleno,
			background: SUPERFICIE,
			border: `1px solid ${borde ?? '#e8e8e8'}`,
			borderRadius: 10,
			overflow: 'hidden',
		}}
	>
		{children}
	</div>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ fontSize: 21, fontWeight: 700, color: TEXTO, height: 30, lineHeight: '30px' }}>{children}</div>
);

const Pista: React.FC<{ trozos: Trozo[]; tam?: number; estilo?: React.CSSProperties }> = ({ trozos, tam = 15.5, estilo }) => (
	<div style={{ fontSize: tam, lineHeight: 1.45, color: TEXTO_TENUE, ...estilo }}>
		{trozos.map((t, i) => (typeof t === 'string' ? <span key={i}>{t}</span> : <b key={i} style={{ color: '#595959' }}>{t.b}</b>))}
	</div>
);

const Boton: React.FC<{ texto: string; primario?: boolean; ancho?: number; alto?: number; icono?: React.ReactNode; peligro?: boolean }> = ({
	texto, primario = false, ancho, alto = 36, icono, peligro = false,
}) => (
	<div
		style={{
			width: ancho,
			height: alto,
			boxSizing: 'border-box',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			padding: '0 16px',
			borderRadius: 7,
			border: `1px solid ${primario ? (peligro ? '#ff4d4f' : ACENTO) : BORDE}`,
			background: primario ? (peligro ? '#ff4d4f' : ACENTO) : SUPERFICIE,
			color: primario ? '#fff' : TEXTO,
			fontSize: 15,
			fontWeight: primario ? 600 : 500,
			whiteSpace: 'nowrap',
		}}
	>
		{icono}
		{texto}
	</div>
);

const Lapiz: React.FC<{ color?: string }> = ({ color = ACENTO }) => (
	<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
		<path d="M3 13 L3.6 10.2 L10.8 3 L13 5.2 L5.8 12.4 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
	</svg>
);

const Check: React.FC<{ color?: string; tam?: number }> = ({ color = ACENTO, tam = 16 }) => (
	<svg width={tam} height={tam} viewBox="0 0 16 16" aria-hidden>
		<path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/* ── La cabecera del año y la tira de pestañas ────────────────────────────────────────────── */

const Navegacion: React.FC<{ pestana: number; senalado: string | null }> = ({ pestana, senalado }) => {
	const r = disposicion({ abiertas: [0, 0, 0], pies: [0, 0, 0], barraTextos: 0, vivas: [1, 1, 1] }).nav;
	return (
		<Panel r={r}>
			<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
				<div>
					<div style={{ fontSize: 26, fontWeight: 700, color: TEXTO, lineHeight: 1.2 }}>{ALMENDROS.nombrePapel}</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: 16, color: TEXTO_TENUE }}>
						Año {YEAR}
						<span style={{ fontSize: 13, padding: '1px 8px', borderRadius: 4, border: '1px solid #91caff', background: '#e6f4ff', color: '#0958d9' }}>
							el año en curso
						</span>
					</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div
						style={{
							width: 190,
							height: 36,
							boxSizing: 'border-box',
							border: `1px solid ${BORDE}`,
							borderRadius: 7,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 12px',
							fontSize: 15,
							color: TEXTO,
						}}
					>
						{YEAR} · en curso
						<span style={{ color: TEXTO_TENUE, fontSize: 12 }}>▾</span>
					</div>
					{['lista', 'recargar', 'historial'].map((k) => (
						<div key={k} style={{ width: 36, height: 36, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<IconoPequeno cual={k} />
						</div>
					))}
				</div>
			</div>

			{/* LA TIRA DE PESTAÑAS: enlaces con un subrayado de 2 px que sólo cambia de color. */}
			<div
				style={{
					position: 'absolute',
					left: G.relleno,
					right: G.relleno,
					top: G.navPestanas,
					height: G.pestana,
					display: 'flex',
					gap: 4,
					boxShadow: 'inset 0 -1px 0 rgb(128 128 128 / 25%)',
				}}
			>
				{PESTANAS.map((t, i) => {
					const puesta = i === pestana;
					const encima = senalado === `pestana-${i}`;
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
								fontSize: 15.5,
								whiteSpace: 'nowrap',
								color: puesta || encima ? ACENTO : TEXTO,
								fontWeight: puesta ? 600 : 400,
								borderBottom: `2px solid ${puesta ? ACENTO : 'transparent'}`,
							}}
						>
							<IconoPestana i={i} color={puesta || encima ? ACENTO : TEXTO_TENUE} />
							{t.etiqueta}
						</div>
					);
				})}
			</div>
		</Panel>
	);
};

/** Comprobación de que la tira cabe: la última pestaña no puede salirse del panel. */
const ultima = rectPestana(PESTANAS.length - 1);
if (ultima.x + ultima.ancho > ANCHO_CONTENIDO - G.lado - G.relleno) {
	throw new Error('Colegio: la tira de pestañas no cabe en el panel.');
}

/* ── «Lo que imprime 2026» ────────────────────────────────────────────────────────────────── */

const PanelDelAnio: React.FC<PropsColegio> = (p) => {
	const d = disposicion(p.estado);
	return (
		<Panel r={d.a}>
			<H2>Lo que imprime {YEAR}</H2>
			<Pista trozos={TEXTOS.pistaDelAnio} estilo={{ marginTop: 10 }} />
			<div style={{ position: 'absolute', left: G.relleno, top: G.aBotones, display: 'flex', flexWrap: 'wrap', gap: G.boton.hueco, width: G.boton.ancho * 2 + G.boton.hueco }}>
				{PLANTILLAS.map((pl, i) => {
					const puesta = i === p.puesta;
					const encima = p.senalado === `op-${i}`;
					return (
						<div
							key={pl.id}
							style={{
								width: G.boton.ancho,
								height: G.boton.alto,
								boxSizing: 'border-box',
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '0 12px 0 10px',
								borderRadius: 8,
								border: `1px solid ${puesta || encima ? ACENTO : BORDE}`,
								boxShadow: puesta ? `inset 0 0 0 1px ${ACENTO}` : undefined,
								opacity: p.estado.vivas[i],
							}}
						>
							<span style={{ width: 18, flex: 'none' }}>{puesta && <Check />}</span>
							<span style={{ minWidth: 0 }}>
								<span style={{ display: 'block', fontSize: 15, color: TEXTO, whiteSpace: 'nowrap' }}>{pl.nombre}</span>
								<span style={{ display: 'block', fontSize: 13, color: TEXTO_TENUE, whiteSpace: 'nowrap', marginTop: 2 }}>
									{pl.membrete ? `membrete: ${pl.membrete}` : 'sin membrete'}
								</span>
							</span>
						</div>
					);
				})}
			</div>
		</Panel>
	);
};

/* ── «Los textos de 2026» ─────────────────────────────────────────────────────────────────── */

const PanelDeTextos: React.FC<PropsColegio> = (p) => {
	const d = disposicion(p.estado);
	const ed = rectEditor(p.estado);
	const cursor = p.textoConFoco && p.frame % 30 < 16;

	return (
		<Panel r={d.b}>
			<H2>Los textos de {YEAR}</H2>

			<Etiqueta texto={TEXTOS.textoBajo} sucio={p.textoSucio} arriba={G.bEditor - 30} />
			{/* EL EDITOR: barra «básica» (negrita, cursiva, subrayado, listas, enlace) y tres renglones. */}
			<div
				style={{
					position: 'absolute',
					left: G.relleno,
					top: ed.y - d.b.y,
					width: ed.ancho,
					height: ed.alto,
					boxSizing: 'border-box',
					border: `1px solid ${p.textoConFoco ? ACENTO : BORDE}`,
					boxShadow: p.textoConFoco ? `0 0 0 3px ${ACENTO}22` : undefined,
					borderRadius: 7,
					overflow: 'hidden',
				}}
			>
				<div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 16, padding: '0 12px', borderBottom: `1px solid ${BORDE}`, fontSize: 15, color: '#444' }}>
					<b>B</b>
					<i>I</i>
					<u>U</u>
					<span style={{ fontSize: 14 }}>≡</span>
					<span style={{ fontSize: 14 }}>1.</span>
					<span style={{ fontSize: 14 }}>🔗︎</span>
				</div>
				<div style={{ padding: '10px 12px', fontSize: 15.5, lineHeight: 1.45, color: TEXTO, whiteSpace: 'pre-wrap' }}>
					{p.textoEncabezado}
					<span style={{ opacity: cursor ? 1 : 0, color: ACENTO }}>|</span>
				</div>
			</div>
			<Extra texto={TEXTOS.textoBajoExtra} arriba={ed.y - d.b.y + ed.alto + 6} />

			<Etiqueta texto={TEXTOS.tituloFinal} arriba={262} />
			<Entrada valor={TEXTOS.tituloFinalValor} arriba={290} />
			<Extra texto={TEXTOS.tituloFinalExtra} arriba={332} />

			<Etiqueta texto={TEXTOS.tituloPeriodo} arriba={380} />
			<Entrada valor={TEXTOS.tituloPeriodoValor} arriba={408} />
			<Extra texto={TEXTOS.tituloPeriodoExtra} arriba={450} />

			{p.estado.barraTextos > 0.001 && (
				<div
					style={{
						position: 'absolute',
						left: G.relleno,
						right: G.relleno,
						top: G.b - G.relleno + 4,
						height: G.bBarra - 12,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						padding: '0 12px',
						border: `1px solid ${ACENTO}`,
						borderRadius: 8,
						fontSize: 15,
						color: TEXTO,
						opacity: p.estado.barraTextos,
					}}
				>
					<Lapiz />
					{TEXTOS.pendiente}
					<span style={{ flex: 1 }} />
					<Boton texto={TEXTOS.descartar} />
					<Boton texto={TEXTOS.guardarTextos} primario ancho={176} />
				</div>
			)}
		</Panel>
	);
};

const Etiqueta: React.FC<{ texto: string; arriba: number; sucio?: boolean }> = ({ texto, arriba, sucio = false }) => (
	<div style={{ position: 'absolute', left: G.relleno, top: arriba, height: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: TEXTO }}>
		{texto}
		{sucio && (
			<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: ACENTO }}>
				<Lapiz /> sin guardar
			</span>
		)}
	</div>
);

const Entrada: React.FC<{ valor: string; arriba: number }> = ({ valor, arriba }) => (
	<div
		style={{
			position: 'absolute',
			left: G.relleno,
			right: G.relleno,
			top: arriba,
			height: 36,
			boxSizing: 'border-box',
			border: `1px solid ${BORDE}`,
			borderRadius: 7,
			display: 'flex',
			alignItems: 'center',
			padding: '0 12px',
			fontSize: 15,
			color: TEXTO,
			whiteSpace: 'nowrap',
		}}
	>
		{valor}
	</div>
);

const Extra: React.FC<{ texto: string; arriba: number }> = ({ texto, arriba }) => (
	<div style={{ position: 'absolute', left: G.relleno, right: G.relleno, top: arriba, fontSize: 13.5, lineHeight: 1.35, color: TEXTO_TENUE }}>{texto}</div>
);

/* ── «Los membretes del colegio» ──────────────────────────────────────────────────────────── */

/*
 * «LOS MEMBRETES DEL COLEGIO». Su `y` depende de la fila de arriba (la barra de «sin guardar» de
 * los textos la empuja), así que llega de `disposicion()` como todo lo demás.
 */
export const Membretes: React.FC<{ r: { x: number; y: number; ancho: number; alto: number } }> = ({ r }) => (
	<Panel r={r}>
		<H2>Los membretes del colegio</H2>
		<Pista trozos={[...TEXTOS.pistaMembretes, ...TEXTOS.pistaMembretesFinal]} estilo={{ marginTop: 10 }} />
		<Pista trozos={TEXTOS.pistaImagenes} estilo={{ marginTop: 10 }} />
		<div style={{ position: 'absolute', left: G.relleno, bottom: G.relleno, display: 'flex', alignItems: 'center', gap: 12 }}>
			<Boton texto={TEXTOS.crear} icono={<span style={{ fontSize: 18, lineHeight: 1 }}>+</span>} />
			<span style={{ fontSize: 13.5, color: TEXTO_TENUE }}>{TEXTOS.crearPista}</span>
		</div>
	</Panel>
);

/* ── Un panel por plantilla ───────────────────────────────────────────────────────────────── */

const PanelDePlantilla: React.FC<{
	i: number;
	plantilla: Plantilla;
	props: PropsColegio;
	rect: { x: number; y: number; ancho: number; alto: number };
}> = ({ i, plantilla, props: p, rect }) => {
	const abierta = p.estado.abiertas[i];
	const pie = p.estado.pies[i];
	const sucia = p.sucias?.[i] ?? false;
	const usan = plantilla.usanOtros.length + (p.puesta === i ? 1 : 0);
	const encimaNombre = p.senalado === `abrir-${i}`;
	const encimaPapelera = p.senalado === `papelera-${i}`;
	const apagada = usan > 0;

	return (
		<div
			style={{
				position: 'absolute',
				left: rect.x,
				top: rect.y,
				width: rect.ancho,
				height: rect.alto,
				boxSizing: 'border-box',
				padding: `0 ${G.relleno}px`,
				background: SUPERFICIE,
				border: `1px solid ${sucia ? ACENTO : '#e8e8e8'}`,
				borderRadius: 10,
				overflow: 'hidden',
				opacity: Math.min(1, p.estado.vivas[i] * 1.4),
			}}
		>
			{/* LA CABECERA, siempre a la vista. */}
			<div style={{ height: G.cab, display: 'flex', alignItems: 'center', gap: 12 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 280 }}>
					<svg width="14" height="14" viewBox="0 0 16 16" style={{ transform: `rotate(${abierta * 90}deg)` }} aria-hidden>
						<path d="M6 3 L11 8 L6 13" fill="none" stroke={TEXTO_TENUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span style={{ fontSize: 17, fontWeight: 600, color: encimaNombre ? ACENTO : TEXTO, whiteSpace: 'nowrap' }}>{plantilla.nombre}</span>
				</div>
				{p.puesta === i && (
					<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '2px 8px', borderRadius: 4, background: ACENTO, color: '#fff' }}>
						<Check color="#fff" tam={13} /> imprime {YEAR}
					</span>
				)}
				{sucia && <span style={{ fontSize: 13, padding: '1px 7px', borderRadius: 4, border: `1px solid ${ACENTO}`, color: ACENTO }}>sin guardar</span>}
				{abierta < 0.5 && (
					<span style={{ fontSize: 14, color: '#aaa', whiteSpace: 'nowrap' }}>{plantilla.membrete ?? 'sin membrete'}</span>
				)}
				{usan > 0 && (
					<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: TEXTO_TENUE }}>
						<IconoPequeno cual="impresora" />
						la usan {usan} {usan === 1 ? 'año' : 'años'}
					</span>
				)}
				<span style={{ flex: 1 }} />
				<div
					style={{
						width: 34,
						height: 34,
						borderRadius: 6,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: encimaPapelera && !apagada ? '#fff1f0' : 'transparent',
						opacity: apagada ? 0.35 : 1,
					}}
				>
					<Papelera color={encimaPapelera && !apagada ? '#ff4d4f' : TEXTO_TENUE} />
				</div>
			</div>

			{abierta > 0.001 && (
				<div style={{ opacity: interpolate(abierta, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
					<CuerpoDePlantilla i={i} plantilla={plantilla} p={p} />
				</div>
			)}

			{pie > 0.001 && (
				<div
					style={{
						position: 'absolute',
						left: G.relleno,
						right: G.relleno,
						bottom: 16,
						height: G.pie - 12,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 12px',
						border: `1px solid ${ACENTO}`,
						borderRadius: 8,
						fontSize: 15,
						opacity: pie,
						background: SUPERFICIE,
					}}
				>
					{usan > 1 && <span style={{ color: TEXTO_TENUE }}>Al guardar cambia lo que imprimen {usan} años.</span>}
					<span style={{ flex: 1 }} />
					<Boton texto={TEXTOS.descartar} />
					<Boton texto={TEXTOS.guardarPlantilla} primario ancho={190} />
				</div>
			)}
		</div>
	);
};

/*
 * EL CUERPO ABIERTO: el nombre, las dos cajas de campos a la izquierda en 404 px y la hoja a la
 * derecha. Las medidas de cada campo son las de `SECCIONES` en `colegio-certificados.ts`.
 */
const CuerpoDePlantilla: React.FC<{ i: number; plantilla: Plantilla; p: PropsColegio }> = ({ i, plantilla, p }) => {
	const m = plantilla.medidas;
	const altura = i === 0 && p.alturaTecleada != null ? p.alturaTecleada : String(m.alturaEncabezado);
	const conFoco = i === 0 && (p.alturaConFoco ?? false);

	return (
		<div style={{ height: G.cuerpo }}>
			<div style={{ height: CUERPO.campos, boxSizing: 'border-box', paddingTop: CUERPO.nombre }}>
				<div style={{ fontSize: 13, lineHeight: '18px', color: TEXTO_TENUE }}>Nombre de la plantilla</div>
				<div style={{ width: 400, height: 34, marginTop: 4, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 15, color: TEXTO }}>
					{plantilla.nombre}
				</div>
			</div>

			<div style={{ display: 'flex', gap: 16 }}>
				<div style={{ width: CUERPO.izquierda, display: 'flex', flexDirection: 'column', gap: 10 }}>
					<Caja titulo="Encabezado">
						<div style={{ gridColumn: '1 / -1' }}>
							<div style={{ fontSize: 13, lineHeight: '18px', color: TEXTO_TENUE }}>Imagen</div>
							<div style={{ height: 40, marginTop: 4, boxSizing: 'border-box', border: `1px solid ${BORDE}`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', fontSize: 14.5, color: plantilla.membrete ? TEXTO : TEXTO_TENUE }}>
								{plantilla.membrete ? (
									<span style={{ width: 54, height: 28, overflow: 'hidden', border: `1px solid ${BORDE}`, borderRadius: 3, display: 'flex', alignItems: 'flex-start' }}>
										<Membrete ancho={54} />
									</span>
								) : null}
								{plantilla.membrete ?? '(sin imagen)'}
							</div>
						</div>
						<Campo etiqueta="Altura encabezado" valor={altura} foco={conFoco} frame={p.frame} pista="A qué altura del papel empieza el cuerpo. Es el alto de la franja dibujada en la imagen." />
						<Campo etiqueta="Margen izquierda" valor={String(m.encIzquierda)} pista="Dónde empieza el TEXTO del encabezado: el título y el «Texto bajo el membrete»." />
						<Campo etiqueta="Margen derecha" valor={String(m.encDerecha)} pista="Dónde acaba ese mismo texto, desde el filo derecho." />
					</Caja>
					<Caja titulo="Cuerpo">
						<Campo etiqueta="Margen izquierda" valor={String(m.cuerpoIzquierda)} pista="Dónde empieza la tabla de notas y lo que va debajo, desde el filo izquierdo." />
						<Campo etiqueta="Margen derecha" valor={String(m.cuerpoDerecha)} pista="Dónde acaba, desde el filo derecho." />
						<Campo etiqueta="Altura pie" valor={String(m.alturaPie)} pista="A qué distancia del filo de abajo acaba el cuerpo. Deja sitio al pie dibujado en la imagen." />
					</Caja>
				</div>

				<VistaPrevia plantilla={plantilla} altura={Number(altura) || 0} texto={p.textoEncabezado} />
			</div>
		</div>
	);
};

const Caja: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
	<div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: '7px 10px 10px' }}>
		<div style={{ fontSize: 13, lineHeight: '22px', letterSpacing: 0.4, textTransform: 'uppercase', color: TEXTO_TENUE, height: 22 }}>{titulo}</div>
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>
	</div>
);

const Campo: React.FC<{ etiqueta: string; valor: string; pista: string; foco?: boolean; frame?: number }> = ({ etiqueta, valor, pista, foco = false, frame = 0 }) => (
	<div>
		<div style={{ fontSize: 13, lineHeight: '18px', color: TEXTO_TENUE, whiteSpace: 'nowrap' }}>{etiqueta} (px)</div>
		<div
			style={{
				width: 140,
				height: 36,
				marginTop: 4,
				boxSizing: 'border-box',
				border: `1px solid ${foco ? ACENTO : BORDE}`,
				boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : undefined,
				borderRadius: 7,
				display: 'flex',
				alignItems: 'center',
				padding: '0 10px',
				fontSize: 15.5,
				color: TEXTO,
				fontVariantNumeric: 'tabular-nums',
			}}
		>
			{valor}
			<span style={{ opacity: foco && frame % 30 < 16 ? 1 : 0, color: ACENTO }}>|</span>
		</div>
		<div style={{ fontSize: 11.5, lineHeight: 1.3, color: '#aaa', marginTop: 4 }}>{pista}</div>
	</div>
);

/*
 * LA VISTA PREVIA (`vista-previa-membrete`): el papel elegido --carta, por defecto--, dentro la
 * hoja de 21 × 27 cm que pinta el certificado, la imagen de filo a filo arriba y la caja del cuerpo
 * con sus bandas. A 0,34 no se lee una letra, y no hace falta: enseña DÓNDE cae cada cosa.
 */
const E = 0.34;
const PAPEL = { ancho: 816, alto: 1056 };
const HOJA = { ancho: 794, alto: 1020 };

const VistaPrevia: React.FC<{ plantilla: Plantilla; altura: number; texto: string }> = ({ plantilla, altura }) => {
	const m = plantilla.medidas;
	const arriba = Math.max(38, altura);
	const cm = (px: number) => (px / 37.8).toFixed(1).replace('.', ',');
	const lineas: Trozo[][] = plantilla.membrete
		? [
				['La cabecera ocupa ', { b: `${MEMBRETE.alto} px` }, ` de alto (${cm(MEMBRETE.alto)} cm), el ${Math.round((MEMBRETE.alto / HOJA.alto) * 100)} % de la hoja, y va de filo a filo: ningún número la mueve.`],
				[`El texto empieza por debajo de la cabecera, con ${arriba - MEMBRETE.alto} px de aire.`],
			]
		: [['Sin imagen de membrete. Las medidas de abajo ', { b: 'se imprimen igual' }, ': si el colegio compra la hoja ya membretada, son lo único que coloca las letras dentro del dibujo.']];

	const banda = 'repeating-linear-gradient(45deg, rgb(120 134 150 / 22%) 0 4px, transparent 4px 9px)';

	return (
		<div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '10px 18px', alignItems: 'flex-start', alignContent: 'flex-start' }}>
			<div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 10 }}>
				<span style={{ fontSize: 12.5, letterSpacing: 0.4, textTransform: 'uppercase', color: TEXTO_TENUE }}>Papel</span>
				<div style={{ display: 'flex', border: `1px solid ${BORDE}`, borderRadius: 7, overflow: 'hidden', fontSize: 14 }}>
					<span style={{ padding: '4px 12px', background: ACENTO, color: '#fff' }}>Carta</span>
					<span style={{ padding: '4px 12px', color: TEXTO }}>Oficio</span>
				</div>
				<span style={{ fontSize: 12.5, color: '#aaa' }}>215,9 × 279,4 mm</span>
			</div>

			<div style={{ position: 'relative', width: PAPEL.ancho * E, height: PAPEL.alto * E, border: '1px dashed #aab4c0', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', background: '#fafbfc' }}>
				<div style={{ position: 'relative', width: HOJA.ancho * E, height: HOJA.alto * E, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.12)', overflow: 'hidden' }}>
					{plantilla.membrete && (
						<div style={{ position: 'absolute', left: 0, top: 0 }}>
							<Membrete ancho={HOJA.ancho * E} />
						</div>
					)}
					{/* Las cuatro bandas de la caja del cuerpo, desde el filo del papel. */}
					<div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: arriba * E, background: banda, zIndex: 2 }} />
					<div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: Math.max(38, m.alturaPie) * E, background: banda }} />
					<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.max(38, m.cuerpoIzquierda) * E, background: banda }} />
					<div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: Math.max(38, m.cuerpoDerecha) * E, background: banda }} />
					<div style={{ position: 'absolute', left: '50%', top: arriba * E - 16, transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, color: '#556', background: '#fff', padding: '0 3px', zIndex: 3 }}>
						{arriba}
					</div>
					{/* El texto dibujado: renglones grises donde caerán el título, la tabla y las firmas. */}
					<div style={{ position: 'absolute', left: Math.max(38, m.cuerpoIzquierda) * E + 4, right: Math.max(38, m.cuerpoDerecha) * E + 4, top: arriba * E + 6 }}>
						<div style={{ height: 6, width: '60%', margin: '0 auto', background: '#9aa7b4', borderRadius: 2 }} />
						<div style={{ height: 4, width: '80%', margin: '5px auto 0', background: '#cfd6dd', borderRadius: 2 }} />
						<div style={{ marginTop: 10 }}>
							{[0, 1, 2, 3, 4, 5, 6].map((k) => (
								<div key={k} style={{ height: 4, marginTop: 6, background: '#dde3e9', borderRadius: 2 }} />
							))}
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 26 }}>
							<div style={{ width: '32%', height: 2, background: '#9aa7b4' }} />
							<div style={{ width: '32%', height: 2, background: '#9aa7b4' }} />
						</div>
					</div>
				</div>
			</div>

			<div style={{ flex: 1, minWidth: 220, fontSize: 13, lineHeight: 1.4, color: TEXTO_TENUE }}>
				<div style={{ fontSize: 14.5, fontWeight: 600, color: TEXTO, marginBottom: 6 }}>Así sale la hoja</div>
				{lineas.map((l, k) => (
					<Pista key={k} trozos={l} tam={13} estilo={{ marginBottom: 6 }} />
				))}
			</div>
		</div>
	);
};

/* ── El popconfirm de borrar ──────────────────────────────────────────────────────────────── */

const Popconfirm: React.FC<{ rect: { x: number; y: number; ancho: number; alto: number }; scroll: number; t: number }> = ({ rect, scroll, t }) => (
	<div
		style={{
			position: 'absolute',
			left: rect.x,
			top: rect.y - scroll,
			width: POPCONFIRM.ancho,
			height: POPCONFIRM.alto,
			boxSizing: 'border-box',
			padding: 16,
			background: SUPERFICIE,
			borderRadius: 10,
			boxShadow: '0 6px 16px rgba(0,0,0,.12), 0 3px 6px -4px rgba(0,0,0,.18), 0 9px 28px 8px rgba(0,0,0,.06)',
			opacity: t,
			transform: `scale(${0.9 + 0.1 * t})`,
			transformOrigin: '92% 100%',
			zIndex: 5,
		}}
	>
		<div style={{ display: 'flex', gap: 10, fontSize: 15, color: TEXTO, lineHeight: 1.4 }}>
			<span style={{ width: 18, height: 18, borderRadius: 9, background: '#faad14', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>!</span>
			{TEXTOS.popconfirm}
		</div>
		<div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 8 }}>
			<Boton texto={TEXTOS.dejarla} alto={34} />
			<Boton texto={TEXTOS.eliminar} primario peligro alto={34} ancho={92} />
		</div>
		{/* La flecha, bajo la esquina derecha: apunta a la papelera. */}
		<div style={{ position: 'absolute', right: 16, bottom: -6, width: 12, height: 12, background: SUPERFICIE, transform: 'rotate(45deg)' }} />
	</div>
);

/* ── Iconos ───────────────────────────────────────────────────────────────────────────────── */

const Papelera: React.FC<{ color: string }> = ({ color }) => (
	<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
		<path d="M3.5 5 H14.5 M7 5 V3.2 H11 V5 M5 5 L5.8 15 H12.2 L13 5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconoPequeno: React.FC<{ cual: string }> = ({ cual }) => {
	const t = { fill: 'none', stroke: TEXTO_TENUE, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
			{cual === 'lista' && <path d="M5 4 H13 M5 8 H13 M5 12 H13 M2.5 4 H2.6 M2.5 8 H2.6 M2.5 12 H2.6" {...t} />}
			{cual === 'recargar' && <path d="M13 8 A5 5 0 1 1 11.5 4.5 M13 2.5 V5 H10.5" {...t} />}
			{cual === 'historial' && (
				<>
					<circle cx="8" cy="8" r="5.5" {...t} />
					<path d="M8 5 V8 L10 9.5" {...t} />
				</>
			)}
			{cual === 'impresora' && <path d="M4.5 6 V2.5 H11.5 V6 M3 6 H13 V11 H3 Z M5 9.5 H11 V13.5 H5 Z" {...t} />}
		</svg>
	);
};

const IconoPestana: React.FC<{ i: number; color: string }> = ({ i, color }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
			{i === 0 && <path d="M2.5 4 H13.5 V13.5 H2.5 Z M2.5 7 H13.5 M5.5 2.5 V5 M10.5 2.5 V5" {...t} />}
			{i === 1 && <path d="M2 4 H14 V12 H2 Z M4.5 7 H7.5 M4.5 9.5 H7.5 M9.5 6.5 H12 V9.5 H9.5 Z" {...t} />}
			{i === 2 && (
				<>
					<circle cx="8" cy="8" r="2.2" {...t} />
					<path d="M8 2.5 V4 M8 12 V13.5 M2.5 8 H4 M12 8 H13.5 M4.1 4.1 L5.2 5.2 M10.8 10.8 L11.9 11.9 M11.9 4.1 L10.8 5.2 M5.2 10.8 L4.1 11.9" {...t} />
				</>
			)}
			{i === 3 && <path d="M8 2 L13 4 V8 C13 11 10.8 12.8 8 14 C5.2 12.8 3 11 3 8 V4 Z M5.8 8 L7.4 9.6 L10.4 6.4" {...t} />}
			{i === 4 && <path d="M3 3 H11 L13 5 V13 H3 Z M5.5 7 H10.5 M5.5 9.5 H10.5" {...t} />}
			{i === 5 && <path d="M3 2.5 H10.5 L13 5 V13.5 H3 Z M5.5 9 L7 10.5 L10.5 7" {...t} />}
		</svg>
	);
};
