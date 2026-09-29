import React from 'react';
import { useVideoConfig } from 'remotion';

import { entra, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { IMPRESOS, Impreso, Pide } from '../cierre-6/datos-catalogo';
import {
	ANCHO, Ajustes, CONF, DisposicionDePila, EstadoDelCatalogo, FilaDePila, INF, PILA, Rect, TEXTOS, X_CONFIG,
	disponer, disponerAjustes, loQueDiceElBoton, sePuedeApilar,
} from './datos';
import { Boton, Desplegable, Icono, Interruptor, Segmentado, Select } from './Piezas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES DESPLEGADO: la tira de la pila (si hay), la tarjeta del buscador con sus
 * pastillas, la lista por familias y el configurador de la derecha con sus campos y sus plegables.
 * `catalogo-informes.html`, secciones 1 y 3 (la 2, «Lo que sacaste esta semana», no sale: sólo
 * aparece si ese usuario sacó algo esta semana, y el de estos vídeos no).
 *
 * No guarda estado: el guion le dice en cada fotograma qué hay escrito, qué familia está puesta,
 * qué ficha y qué valores, y lo pinta. Las posiciones salen de `disponer()`, las mismas que usa el
 * guion para el foco y el puntero.
 */

export interface PropsCatalogo extends EstadoDelCatalogo {
	frame: number;
	/** Cuándo se monta la pantalla (entra en cascada). */
	entraEn?: number;
	/** Desde cuándo está la lista que se ve: cada tecla del buscador la vuelve a pintar. */
	listaDesde?: number;
	buscadorConFoco?: boolean;
	/** Desde cuándo está elegida la ficha: el configurador entra. */
	elegidaDesde?: number;
	/** Lo que el ratón tiene encima: `ficha-<clave>`, `pastilla-<clave>`, `campo-<pide>`, `cargar`, `apilar`, `ver-pila`, `vaciar`, `quitar-<i>`, `plegable-<que>`, `segmento-<que>-<i>`. */
	senal?: string | null;
	/** Lo recién pulsado, para el apretón del botón. */
	pulsado?: string | null;
	desplegable?: { campo: Pide; opciones: string[]; senalada: number | null; elegida?: number | null; desde: number } | null;
	yaEnLaPila?: boolean;
	/** Si la caja de la fecha de entrega tiene el cursor. */
	fechaConFoco?: boolean;
	/** Desde cuándo está cada fila de la pila, para que entren de una en una. */
	pilaDesde?: number[];
	opacidad?: number;
}

export const Catalogo: React.FC<PropsCatalogo> = (p) => {
	const { fps } = useVideoConfig();
	const f = p.frame;
	const d = disponer(p);
	const e0 = p.entraEn ?? 0;
	const aparece = entra(f, fps, e0, 14);
	const impreso = p.elegida ? IMPRESOS.find((i) => i.clave === p.elegida) ?? null : null;
	const listaDesde = p.listaDesde ?? e0 + 6;

	return (
		<div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: '100%', opacity: (p.opacidad ?? 1) * aparece }}>
			{/* ── 1. El buscador ─────────────────────────────────────────────────────────────── */}
			<Caja r={d.tarjeta}>
				<div style={{ position: 'absolute', left: INF.pad, top: INF.pad, height: INF.fila1, display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, color: TEXTO }}>
					{TEXTOS.titulo}
				</div>
				<div style={{ position: 'absolute', right: INF.pad, top: INF.pad, height: INF.fila1, display: 'flex', alignItems: 'center', fontSize: 16, color: TEXTO_TENUE, whiteSpace: 'pre' }}>
					Periodo <b style={{ color: TEXTO }}>{TEXTOS.periodo}</b> abierto · <b style={{ color: TEXTO }}>{TEXTOS.grupos}</b> grupos
				</div>
				<div
					style={{
						position: 'absolute',
						left: INF.pad,
						top: d.buscador.y - d.tarjeta.y,
						width: d.buscador.ancho,
						height: d.buscador.alto,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 16px',
						borderRadius: 10,
						border: `1px solid ${p.buscadorConFoco ? '#4096ff' : p.senal === 'buscador' ? '#4096ff' : BORDE}`,
						boxShadow: p.buscadorConFoco ? '0 0 0 2px rgba(5,145,255,.1)' : undefined,
						fontSize: 18,
						color: p.consulta ? TEXTO : '#a6a6a6',
						whiteSpace: 'pre',
					}}
				>
					<Icono que="lupa" tam={20} color="#8c8c8c" />
					<span>{p.consulta || TEXTOS.busqueda}</span>
					{p.buscadorConFoco && <span style={{ marginLeft: -12, opacity: f % 30 < 16 ? 1 : 0, color: TEXTO }}>|</span>}
					<div style={{ flex: 1 }} />
					{p.consulta && (
						<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
							<circle cx="10" cy="10" r="8" fill="rgba(0,0,0,.25)" />
							<path d="M7 7 L13 13 M13 7 L7 13" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
						</svg>
					)}
				</div>
			</Caja>
			{d.pastillas.map((ps, i) => {
				const puesta = p.familia === ps.clave;
				const encima = p.senal === `pastilla-${ps.clave}`;
				return (
					<div
						key={ps.clave}
						style={{
							position: 'absolute',
							left: ps.rect.x,
							top: ps.rect.y,
							width: ps.rect.ancho,
							height: ps.rect.alto,
							boxSizing: 'border-box',
							borderRadius: 999,
							border: `1px solid ${puesta || encima ? `${ACENTO}73` : BORDE}`,
							background: puesta ? `${ACENTO}14` : SUPERFICIE,
							color: puesta ? ACENTO : encima ? TEXTO : 'rgba(0,0,0,.6)',
							fontWeight: puesta ? 600 : 400,
							fontSize: 15,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							whiteSpace: 'nowrap',
							opacity: llega(f, fps, i, e0 + 10, 1).opacidad,
						}}
					>
						{ps.titulo}
						<span style={{ opacity: 0.6, marginLeft: 5, fontVariantNumeric: 'tabular-nums' }}>{ps.cuenta}</span>
					</div>
				);
			})}

			{/* ── 3a. La lista ───────────────────────────────────────────────────────────────── */}
			{d.vacio && (
				<div style={{ position: 'absolute', left: INF.lados, top: d.tarjeta.y + d.tarjeta.alto + INF.trasTarjeta, width: X_CONFIG - INF.lados - INF.huecoConfig, fontSize: 17, lineHeight: 1.5, color: TEXTO_TENUE, opacity: entra(f, fps, listaDesde, 8) }}>
					Nada se llama así. Prueba con <b style={{ color: TEXTO }}>boletín</b>, <b style={{ color: TEXTO }}>planilla</b>, <b style={{ color: TEXTO }}>certificado</b>,{' '}
					<b style={{ color: TEXTO }}>quién falta</b> o <b style={{ color: TEXTO }}>puestos</b>.
				</div>
			)}
			{d.secciones.map((s, k) => (
				<React.Fragment key={`${p.consulta}|${p.familia}|${s.clave}`}>
					<div style={{ position: 'absolute', left: INF.lados, top: s.y, opacity: entra(f, fps, listaDesde + k * 2, 8) }}>
						<div style={{ fontSize: 22, fontWeight: 700, color: TEXTO }}>{s.titulo}</div>
						<div style={{ fontSize: 16, color: TEXTO_TENUE, marginTop: 3 }}>{s.para}</div>
					</div>
					{s.fichas.map(({ impreso: im, rect }, i) => (
						<Ficha
							key={im.clave}
							impreso={im}
							r={rect}
							puesta={p.elegida === im.clave && f >= (p.elegidaDesde ?? 0)}
							encima={p.senal === `ficha-${im.clave}`}
							opacidad={entra(f, fps, listaDesde + k * 2 + Math.min(i, 6), 8)}
						/>
					))}
				</React.Fragment>
			))}

			{/* ── 3b. El configurador ────────────────────────────────────────────────────────── */}
			<Caja r={d.config} sombra>
				{!impreso && (
					<div style={{ position: 'absolute', inset: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', color: TEXTO_TENUE, fontSize: 16, lineHeight: 1.45 }}>
						<Icono que="impresora" tam={40} color="#bfbfbf" />
						<span>
							Elige un informe y aquí aparecen <i>sólo</i> los datos que ese papel necesita.
						</span>
					</div>
				)}
			</Caja>
			{impreso && d.conf && (
				<Configurador
					impreso={impreso}
					d={d}
					valores={p.valores}
					ajustes={p.ajustes}
					f={f}
					fps={fps}
					desde={p.elegidaDesde ?? 0}
					senal={p.senal ?? null}
					pulsado={p.pulsado ?? null}
					yaEnLaPila={p.yaEnLaPila ?? false}
					fechaConFoco={p.fechaConFoco ?? false}
				/>
			)}

			{/* ── La tira de la pila, pegada arriba ──────────────────────────────────────────── */}
			{d.pila && p.pila && <TiraDeLaPila d={d.pila} filas={p.pila} f={f} desde={p.pilaDesde} senal={p.senal ?? null} />}

			{/* El desplegable abierto va encima de todo, como el de Ant. */}
			{impreso && d.conf && p.desplegable && d.conf.campos[p.desplegable.campo] && f >= p.desplegable.desde && (
				<Desplegable
					bajo={d.conf.campos[p.desplegable.campo]!}
					opciones={p.desplegable.opciones}
					senalada={p.desplegable.senalada}
					elegida={p.desplegable.elegida ?? null}
					opacidad={entra(f, fps, p.desplegable.desde, 6)}
				/>
			)}
		</div>
	);
};

/* ── Las piezas ────────────────────────────────────────────────────────────────────────────── */

export const Caja: React.FC<{ r: Rect; sombra?: boolean; fondo?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ r, sombra = false, fondo = SUPERFICIE, children, style }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			background: fondo,
			border: `1px solid ${BORDE}`,
			borderRadius: 12,
			boxShadow: sombra ? '0 1px 2px rgba(0,0,0,.03), 0 2px 8px rgba(15,28,52,.04)' : undefined,
			...style,
		}}
	>
		{children}
	</div>
);

/** El icono de la ficha: la hoja en su papel --vertical o apaisada--, como `icono-informe`. */
export const IconoDeFicha: React.FC<{ papel: 'vertical' | 'apaisado' }> = ({ papel }) => (
	<svg width="44" height="44" viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
		<rect x="0" y="0" width="44" height="44" rx="10" fill={`${ACENTO}14`} />
		{papel === 'vertical' ? (
			<>
				<path d="M13 9 H27 L32 14 V35 H13 Z" fill="#fff" stroke={ACENTO} strokeWidth="1.6" strokeLinejoin="round" />
				<path d="M17 18 H28 M17 22 H28 M17 26 H24" stroke={ACENTO} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
			</>
		) : (
			<>
				<path d="M8 13 H31 L36 18 V31 H8 Z" fill="#fff" stroke={ACENTO} strokeWidth="1.6" strokeLinejoin="round" />
				<path d="M12 20 H31 M12 24 H31 M12 28 H24" stroke={ACENTO} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
			</>
		)}
	</svg>
);

export const NombreConRealce: React.FC<{ impreso: Impreso }> = ({ impreso }) => {
	const i = impreso.realce ? impreso.nombre.lastIndexOf(impreso.realce) : -1;
	if (i < 0 || !impreso.realce) { return <>{impreso.nombre}</>; }
	return (
		<>
			{impreso.nombre.slice(0, i)}
			<b style={{ fontWeight: 800 }}>{impreso.realce}</b>
			{impreso.nombre.slice(i + impreso.realce.length)}
		</>
	);
};

const Ficha: React.FC<{ impreso: Impreso; r: Rect; puesta: boolean; encima: boolean; opacidad: number }> = ({ impreso, r, puesta, encima, opacidad }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			padding: '12px 14px',
			display: 'flex',
			gap: 12,
			borderRadius: 10,
			border: `1px solid ${puesta || encima ? ACENTO : BORDE}`,
			boxShadow: puesta ? `0 0 0 3px ${ACENTO}22` : 'none',
			background: puesta ? '#f5f9ff' : SUPERFICIE,
			opacity: opacidad,
		}}
	>
		<IconoDeFicha papel={impreso.papel} />
		<div style={{ minWidth: 0 }}>
			<div style={{ fontSize: 17, fontWeight: 600, color: TEXTO, lineHeight: 1.22 }}>
				<NombreConRealce impreso={impreso} />
			</div>
			<div
				style={{
					fontSize: 14,
					color: TEXTO_TENUE,
					lineHeight: 1.3,
					marginTop: 3,
					display: lineasDePara(impreso, r.ancho) ? '-webkit-box' : 'none',
					WebkitBoxOrient: 'vertical',
					WebkitLineClamp: lineasDePara(impreso, r.ancho),
					overflow: 'hidden',
				}}
			>
				{impreso.para}
			</div>
			{impreso.estado && <Marca estado={impreso.estado} />}
		</div>
	</div>
);

/** Cuántos renglones del «para» caben: la tarjeta mide lo mismo, y un nombre de dos renglones o la marca le quitan sitio. */
function lineasDePara(impreso: Impreso, ancho: number) {
	const util = ancho - 28 - 44 - 12;
	const lineasNombre = Math.ceil((impreso.nombre.length * 17 * 0.56) / util);
	if (lineasNombre > 1) { return impreso.estado ? 0 : 1; }
	return impreso.estado ? 1 : 2;
}

export const Marca: React.FC<{ estado: 'fuera' | 'propuesto' }> = ({ estado }) => (
	<span
		style={{
			display: 'inline-block',
			marginTop: 4,
			fontSize: 12.5,
			fontWeight: 600,
			padding: '2px 8px',
			borderRadius: 999,
			color: estado === 'fuera' ? '#0958d9' : '#ad6800',
			background: estado === 'fuera' ? '#e6f4ff' : '#fff7e6',
			border: `1px solid ${estado === 'fuera' ? '#91caff' : '#ffd591'}`,
		}}
	>
		{estado === 'fuera' ? TEXTOS.vivefuera : TEXTOS.todaviaNo}
	</span>
);

const Rotulo: React.FC<{ r: Rect; texto: string }> = ({ r, texto }) => (
	<div style={{ position: 'absolute', left: r.x, top: r.y - CONF.rotulo, height: CONF.rotulo - 4, fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,.72)' }}>{texto}</div>
);

const Configurador: React.FC<{
	impreso: Impreso;
	d: ReturnType<typeof disponer>;
	valores: EstadoDelCatalogo['valores'];
	ajustes?: Ajustes;
	f: number;
	fps: number;
	desde: number;
	senal: string | null;
	pulsado: string | null;
	yaEnLaPila: boolean;
	fechaConFoco: boolean;
}> = ({ impreso, d, valores, ajustes, f, fps, desde, senal, pulsado, yaEnLaPila, fechaConFoco }) => {
	const c = d.conf!;
	const a = entra(f, fps, desde, 12);
	const boton = loQueDiceElBoton(impreso, valores);
	const x = X_CONFIG + CONF.pad;
	const aj = ajustes ?? { hoja: impreso.papel === 'apaisado' ? 1 : 0 };
	return (
		<div style={{ position: 'absolute', inset: 0, opacity: a }}>
			<div style={{ position: 'absolute', left: x, top: d.config.y + CONF.pad, width: INF.config - CONF.pad * 2 }}>
				<div style={{ fontSize: 21, fontWeight: 700, color: TEXTO, lineHeight: 1.25 }}>
					<NombreConRealce impreso={impreso} />
				</div>
				<div style={{ fontSize: 14.5, color: TEXTO_TENUE, lineHeight: 1.35, marginTop: 5 }}>{impreso.para}</div>
			</div>
			{c.campos.destinatario && (
				<>
					<Rotulo r={c.campos.destinatario} texto={TEXTOS.paraQuien} />
					<Segmentado r={c.campos.destinatario} opciones={TEXTOS.destinatarios} elegido={valores.destinatario ?? 0} tam={13.5} />
				</>
			)}
			{c.campos.grupo && (
				<>
					<Rotulo r={c.campos.grupo} texto={TEXTOS.grupo} />
					<Select r={c.campos.grupo} valor={valores.grupo ?? null} marcador={TEXTOS.eligeGrupo} encima={senal === 'campo-grupo'} />
				</>
			)}
			{c.campos.alumno && (
				<>
					<Rotulo r={c.campos.alumno} texto={TEXTOS.estudiante} />
					<Select r={c.campos.alumno} valor={valores.alumno ?? null} marcador={TEXTOS.eligeEstudiante} encima={senal === 'campo-alumno'} />
				</>
			)}
			{c.campos.profesor && (
				<>
					<Rotulo r={c.campos.profesor} texto={TEXTOS.profesor} />
					<Select r={c.campos.profesor} valor={valores.profesor ?? null} marcador={TEXTOS.eligeProfesor} encima={senal === 'campo-profesor'} />
				</>
			)}
			{c.campos.hasta && (
				<>
					<Rotulo r={c.campos.hasta} texto={TEXTOS.hasta} />
					<Select r={c.campos.hasta} valor={`Periodo ${valores.hasta ?? TEXTOS.periodo}`} marcador="" encima={senal === 'campo-hasta'} />
				</>
			)}
			{c.sinCampos && <div style={{ position: 'absolute', left: x, top: c.sinCampos.y, fontSize: 15, color: TEXTO_TENUE }}>{TEXTOS.sinCampos}</div>}

			<Plegables ajustes={aj} x={X_CONFIG} y={c.plegables[0]?.cabeza.y ?? 0} ancho={INF.config} enElPanel={false} senal={senal} f={f} fechaConFoco={fechaConFoco} />

			{c.nota && (
				<div
					style={{
						position: 'absolute',
						left: x,
						top: c.nota.y,
						width: c.nota.ancho,
						fontSize: 14.5,
						lineHeight: 1.45,
						color: 'rgba(0,0,0,.72)',
						padding: '8px 12px',
						boxSizing: 'border-box',
						borderRadius: 8,
						background: impreso.estado === 'fuera' ? '#f0f7ff' : '#fffbe6',
					}}
				>
					{impreso.estado === 'fuera' ? (
						<>
							Este papel ya se imprime, pero desde <b>{impreso.dondeVive}</b>. Se abre allí, y el catálogo se queda aquí esperándote.
						</>
					) : (
						'Está diseñado y todavía no construido. Sale en el catálogo para que se encuentre buscándolo y para no tener que preguntar si existe.'
					)}
				</div>
			)}
			<Boton r={c.cargar} tipo="primario" apagado={boton.apagado} encima={senal === 'cargar'} pulsado={pulsado === 'cargar'} tam={17}>
				{boton.texto}
			</Boton>
			{c.apilar && sePuedeApilar(impreso, valores) && (
				<Boton r={c.apilar} tipo="tenue" apagado={yaEnLaPila} encima={senal === 'apilar'} pulsado={pulsado === 'apilar'} tam={15.5}>
					<Icono que={yaEnLaPila ? 'check' : 'mas'} tam={16} color={yaEnLaPila ? 'rgba(0,0,0,.28)' : senal === 'apilar' ? '#4096ff' : TEXTO} />
					{yaEnLaPila ? TEXTOS.yaEsta : TEXTOS.pila}
				</Boton>
			)}
		</div>
	);
};

/**
 * LOS CUATRO PLEGABLES DE `ajustesDelInforme`, pintados desde `y`. Los mismos en el configurador
 * (cerrados, salvo casilla y fecha) y en el panel flotante del visor (abiertos): la plantilla de la
 * aplicación es una sola, y aquí también.
 */
export const Plegables: React.FC<{
	ajustes: Ajustes;
	x: number;
	y: number;
	ancho: number;
	enElPanel: boolean;
	senal: string | null;
	f: number;
	/** Un interruptor que se está moviendo: su índice y cuándo se pulsó. */
	moviendo?: { indice: number; desde: number } | null;
	/** Cuándo cambió el segmentado de la casilla, para el deslizado. */
	fechaConFoco?: boolean;
}> = ({ ajustes, x, y, ancho, enElPanel, senal, f, moviendo = null, fechaConFoco = false }) => {
	const d = disponerAjustes(ajustes, x, y, ancho, enElPanel);
	const inter = ajustes.interruptores ?? [];
	const encendidos = inter.filter((i) => i.encendido).length;
	return (
		<>
			{d.plegables.map((pl) => {
				const titulo = pl.que === 'como' ? TEXTOS.como : pl.que === 'casilla' ? TEXTOS.casilla : pl.que === 'fecha' ? TEXTOS.fecha : TEXTOS.hoja;
				const cuenta =
					pl.que === 'como' ? `${encendidos} de ${inter.length}` : pl.que === 'casilla' ? TEXTOS.casillas[ajustes.casilla ?? 0] : pl.que === 'hoja' ? TEXTOS.hojas[ajustes.hoja] : null;
				const encima = senal === `plegable-${pl.que}`;
				return (
					<React.Fragment key={pl.que}>
						<div
							style={{
								position: 'absolute',
								left: pl.cabeza.x,
								top: pl.cabeza.y,
								width: pl.cabeza.ancho,
								height: pl.cabeza.alto,
								boxSizing: 'border-box',
								borderTop: `1px solid ${BORDE}`,
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								padding: '0 16px',
								fontSize: 15,
								fontWeight: 600,
								color: encima ? ACENTO : TEXTO,
								background: encima ? '#f5f9ff' : 'transparent',
							}}
						>
							<div style={{ transform: pl.abierto ? 'rotate(90deg)' : undefined }}>
								<Icono que="derecha" tam={13} color="rgba(0,0,0,.45)" />
							</div>
							{titulo}
							<div style={{ flex: 1 }} />
							{cuenta && (
								<span
									style={{
										fontSize: 13.5,
										fontWeight: 600,
										padding: '1px 9px',
										borderRadius: 999,
										background: pl.que === 'como' ? '#f0f2f5' : '#e6f4ff',
										color: pl.que === 'como' ? 'rgba(0,0,0,.6)' : '#0958d9',
										fontVariantNumeric: 'tabular-nums',
									}}
								>
									{cuenta}
								</span>
							)}
						</div>
						{pl.abierto && pl.cuerpo && pl.que === 'como' &&
							inter.map((it, i) => {
								const r = pl.controles[i];
								const t = moviendo && moviendo.indice === i && f >= moviendo.desde ? Math.min(1, (f - moviendo.desde) / 6) : 1;
								const valor = moviendo && moviendo.indice === i ? (it.encendido ? t : 1 - t) : it.encendido ? 1 : 0;
								return (
									<React.Fragment key={it.etiqueta}>
										<Interruptor x={r.x} y={r.y + 7} t={valor} />
										<div style={{ position: 'absolute', left: r.x + 46, top: r.y, height: r.alto, display: 'flex', alignItems: 'center', fontSize: 15, color: senal === `interruptor-${i}` ? ACENTO : TEXTO }}>
											{it.etiqueta}
										</div>
									</React.Fragment>
								);
							})}
						{pl.abierto && pl.cuerpo && pl.que !== 'como' && (
							<>
								{pl.que === 'fecha' ? (
									<div
										style={{
											position: 'absolute',
											left: pl.controles[0].x,
											top: pl.controles[0].y,
											width: pl.controles[0].ancho,
											height: pl.controles[0].alto,
											boxSizing: 'border-box',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											padding: '0 10px',
											borderRadius: 6,
											border: `1px solid ${fechaConFoco || senal === 'fecha' ? '#4096ff' : BORDE}`,
											boxShadow: fechaConFoco ? '0 0 0 2px rgba(5,145,255,.1)' : undefined,
											fontSize: 15,
											color: TEXTO,
											fontVariantNumeric: 'tabular-nums',
											background: SUPERFICIE,
										}}
									>
										<span>
											{ajustes.fecha}
											{fechaConFoco && <span style={{ opacity: f % 30 < 16 ? 1 : 0 }}>|</span>}
										</span>
										<Icono que="calendario" tam={16} color="#bfbfbf" />
									</div>
								) : (
									<Segmentado
										r={pl.controles[0]}
										opciones={pl.que === 'casilla' ? TEXTOS.casillas : TEXTOS.hojas}
										elegido={pl.que === 'casilla' ? ajustes.casilla ?? 0 : ajustes.hoja}
										encima={senal?.startsWith(`segmento-${pl.que}-`) ? Number(senal.split('-')[2]) : null}
										tam={14}
									/>
								)}
								<div
									style={{
										position: 'absolute',
										left: pl.controles[0].x,
										top: pl.controles[0].y + CONF.segmento + 8,
										width: ancho - 32,
										fontSize: 13.5,
										lineHeight: '19px',
										color: TEXTO_TENUE,
									}}
								>
									{pl.que === 'casilla' ? TEXTOS.casillaPista : pl.que === 'fecha' ? TEXTOS.fechaPista : TEXTOS.hojaPista}
								</div>
							</>
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};

/** LA TIRA DE LA PILA: «La pila», las filas como pastillas con su aspa, la cuenta y los dos botones. */
export const TiraDeLaPila: React.FC<{ d: DisposicionDePila; filas: FilaDePila[]; f: number; desde?: number[]; senal: string | null; opacidad?: number }> = ({ d, filas, f, desde, senal, opacidad = 1 }) => {
	const { fps } = useVideoConfig();
	const primera = desde?.[0] ?? 0;
	const a = entra(f, fps, primera, 10);
	return (
		<div style={{ position: 'absolute', inset: 0, opacity: opacidad }}>
			<div
				style={{
					position: 'absolute',
					left: d.rect.x,
					top: d.rect.y,
					width: d.rect.ancho,
					height: d.rect.alto,
					boxSizing: 'border-box',
					borderRadius: 12,
					border: `1px solid ${ACENTO}66`,
					background: '#eef5ff',
					opacity: a,
					boxShadow: '0 4px 14px rgba(15,28,52,.06)',
				}}
			/>
			<div style={{ position: 'absolute', left: d.rotulo.x, top: d.rotulo.y, opacity: a, lineHeight: 1.3 }}>
				<div style={{ fontSize: 15, fontWeight: 700, color: TEXTO }}>{TEXTOS.pilaRotulo}</div>
				<div style={{ fontSize: 13, color: 'rgba(0,0,0,.6)' }}>{TEXTOS.pilaPista}</div>
			</div>
			{filas.map((fila, i) => {
				const c = d.chips[i];
				if (!c) { return null; }
				const e = entra(f, fps, desde?.[i] ?? primera, 8);
				return (
					<div
						key={`${fila.nombre}-${fila.etiquetas.join()}`}
						style={{
							position: 'absolute',
							left: c.rect.x,
							top: c.rect.y,
							width: c.rect.ancho,
							height: c.rect.alto,
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'center',
							gap: 7,
							padding: '0 4px 0 10px',
							borderRadius: 99,
							border: `1px solid ${senal === `quitar-${i}` ? '#ff7875' : BORDE}`,
							background: SUPERFICIE,
							fontSize: PILA.tam,
							whiteSpace: 'nowrap',
							opacity: e,
							transform: `scale(${0.9 + e * 0.1})`,
						}}
					>
						<span style={{ fontWeight: 600, color: TEXTO }}>{fila.nombre}</span>
						{fila.etiquetas.length > 0 && <span style={{ color: 'rgba(0,0,0,.58)' }}>{fila.etiquetas.join(' · ')}</span>}
						<div style={{ flex: 1 }} />
						<div style={{ width: 24, height: 24, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: senal === `quitar-${i}` ? '#fff1f0' : 'transparent' }}>
							<Icono que="cerrar" tam={12} color={senal === `quitar-${i}` ? '#ff4d4f' : 'rgba(0,0,0,.45)'} />
						</div>
					</div>
				);
			})}
			<div style={{ position: 'absolute', left: d.cuenta.x, top: d.cuenta.y, height: d.cuenta.alto, display: 'flex', alignItems: 'center', fontSize: 14, color: 'rgba(0,0,0,.6)', fontVariantNumeric: 'tabular-nums', opacity: a }}>
				{filas.length} de 20
			</div>
			<div style={{ opacity: a }}>
				<Boton r={d.vaciar} tipo="tenue" encima={senal === 'vaciar'} tam={15}>
					{TEXTOS.vaciar}
				</Boton>
				<Boton r={d.ver} tipo="primario" encima={senal === 'ver-pila'} tam={15}>
					<Icono que="impresora" tam={16} color="#fff" />
					{TEXTOS.verPila}
				</Boton>
			</div>
		</div>
	);
};
