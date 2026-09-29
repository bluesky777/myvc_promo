import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

import { entra, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { BoletinPeriodo } from './BoletinPeriodo';
import {
	ANCHO_CONFIG, ANCHO_CONTENIDO, ARRIBA_FAMILIA, ARRIBA_PASTILLAS, CFG, COLUMNA_DERECHA, EN_CFG, GRUPO, HOJA, INF, PERIODO,
	TEXTOS_INF, VISOR, rectDeLaFicha, rectDeLaOpcion, rectDelSelect,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES (`informes/catalogo/catalogo-informes.html`), sólo lo que este vídeo
 * recorre: la tarjeta del buscador con su línea de contexto --«Periodo 2 abierto · 13 grupos»--, las
 * pastillas de familias, la familia «Para la familia» con sus fichas, y el configurador de la
 * derecha, que no pinta nada hasta que se elige una ficha.
 *
 * Y DESPUÉS, EL VISOR: al pulsar «Cargar el informe» el catálogo se recoge y el informe se abre en
 * la misma página, con la tira «Buscar otro informe» arriba. Es la pantalla «Boletines de periodo»:
 * su título, cuántos boletines, y los dos botones de icono (recargar e imprimir). La impresión no
 * se abre sola: se pulsa la impresora.
 */

const T = {
	titulo: 4,
};

export const Informes: React.FC<{
	/** Todo relativo al inicio de la secuencia. */
	eligeFicha: number;
	abreSelect: number;
	eligeGrupo: number;
	/** El clic en «Cargar el informe»: desde aquí se ve el visor. */
	carga: number;
	/** «Trayendo los boletines…» hasta aquí. */
	trae: number;
	senalada: 'ficha' | 'select' | 'opcion' | 'cargar' | 'imprimir' | null;
}> = ({ eligeFicha, abreSelect, eligeGrupo, carga, trae, senalada }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	if (frame >= carga) { return <Visor desde={carga} trae={trae} senalada={senalada} />; }

	const aparece = entra(frame, fps, T.titulo, 14);
	const elegida = frame >= eligeFicha;
	const abierto = frame >= abreSelect && frame < eligeGrupo;
	const conGrupo = frame >= eligeGrupo;
	const cfg = entra(frame, fps, eligeFicha, 12);

	return (
		<div style={{ position: 'relative', width: ANCHO_CONTENIDO, height: '100%', color: TEXTO }}>
			{/* ── La tarjeta del buscador ── */}
			<div style={{ position: 'absolute', left: INF.lados, top: INF.arriba, width: INF.izquierda, height: INF.buscador, boxSizing: 'border-box', padding: '16px 14px', borderRadius: 10, border: `1px solid ${BORDE}`, background: SUPERFICIE, opacity: aparece }}>
				<div style={{ fontSize: 28, fontWeight: 700, height: 40 }}>{TEXTOS_INF.titulo}</div>
				<div style={{ height: 46, marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderRadius: 8, border: `1px solid ${BORDE}`, fontSize: 16, color: '#bfbfbf' }}>
					<Lupa />
					{TEXTOS_INF.busqueda}
				</div>
				<div style={{ marginTop: 12, fontSize: 15, color: TEXTO_TENUE }}>
					Periodo <b style={{ color: TEXTO }}>{PERIODO}</b> abierto · <b style={{ color: TEXTO }}>{TEXTOS_INF.grupos}</b> grupos
				</div>
			</div>

			{/* ── Las pastillas de familias ── */}
			<div style={{ position: 'absolute', left: INF.lados, top: ARRIBA_PASTILLAS, width: INF.izquierda, height: INF.pastillas, display: 'flex', gap: 8, overflow: 'hidden', opacity: aparece }}>
				{TEXTOS_INF.pastillas.map(([p, n], i) => (
					<div key={p} style={{ height: 34, flex: '0 0 auto', padding: '0 12px', borderRadius: 999, border: `1px solid ${i === 0 ? ACENTO : BORDE}`, background: i === 0 ? `${ACENTO}12` : SUPERFICIE, color: i === 0 ? ACENTO : TEXTO, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
						{p} <span style={{ color: TEXTO_TENUE, fontSize: 13 }}>{n}</span>
					</div>
				))}
			</div>

			{/* ── La familia «Para la familia» ── */}
			<div style={{ position: 'absolute', left: INF.lados, top: ARRIBA_FAMILIA, opacity: aparece }}>
				<div style={{ fontSize: 19, fontWeight: 700 }}>{TEXTOS_INF.familia}</div>
				<div style={{ fontSize: 14, color: TEXTO_TENUE, marginTop: 4 }}>{TEXTOS_INF.familiaPara}</div>
			</div>

			{TEXTOS_INF.fichas.map((f, i) => {
				const r = rectDeLaFicha(i);
				const puesta = elegida && i === 0;
				const nace = llega(frame, fps, i, T.titulo + 12, 5);
				return (
					<div
						key={f.nombre}
						style={{
							position: 'absolute',
							left: r.x,
							top: r.y,
							width: r.ancho,
							height: r.alto,
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							padding: '0 16px',
							borderRadius: 10,
							border: `1px solid ${puesta ? ACENTO : BORDE}`,
							boxShadow: puesta ? `0 0 0 3px ${ACENTO}22` : senalada === 'ficha' && i === 0 ? '0 2px 10px rgba(0,0,0,.08)' : 'none',
							background: SUPERFICIE,
							opacity: nace.opacidad,
							transform: `translateY(${nace.y}px)`,
						}}
					>
						<IconoHoja />
						<div>
							<div style={{ fontSize: 16.5, fontWeight: 700 }}>{f.nombre}</div>
							<div style={{ fontSize: 13.5, color: TEXTO_TENUE, marginTop: 4, lineHeight: 1.3 }}>{f.para}</div>
						</div>
					</div>
				);
			})}

			{/* La familia siguiente asoma por abajo: la lista sigue. */}
			<div style={{ position: 'absolute', left: INF.lados, top: rectDeLaFicha(3).y + INF.ficha + 26, fontSize: 19, fontWeight: 700, opacity: aparece * 0.9 }}>
				{TEXTOS_INF.siguienteFamilia}
			</div>

			{/* ── El configurador ── */}
			<div
				style={{
					position: 'absolute',
					left: COLUMNA_DERECHA,
					top: INF.arriba,
					width: ANCHO_CONFIG,
					height: EN_CFG.fin - INF.arriba,
					boxSizing: 'border-box',
					borderRadius: 10,
					border: `1px solid ${BORDE}`,
					background: SUPERFICIE,
					opacity: aparece,
				}}
			>
				{!elegida && (
					<div style={{ padding: CFG.relleno, fontSize: 15, color: TEXTO_TENUE, lineHeight: 1.4 }}>
						Elige un informe y aquí aparecen <i>sólo</i> los datos que ese papel necesita.
					</div>
				)}
			</div>

			{elegida && (
				<div style={{ position: 'absolute', left: COLUMNA_DERECHA + CFG.relleno, top: 0, width: ANCHO_CONFIG - CFG.relleno * 2, opacity: cfg }}>
					<div style={{ position: 'absolute', top: EN_CFG.cabeza, width: '100%' }}>
						<div style={{ fontSize: 19, fontWeight: 700 }}>{TEXTOS_INF.fichas[0].nombre}</div>
						<div style={{ fontSize: 14, color: TEXTO_TENUE, marginTop: 6, lineHeight: 1.35 }}>{TEXTOS_INF.fichas[0].para}</div>
					</div>

					<div style={{ position: 'absolute', top: EN_CFG.paraQuien, width: '100%' }}>
						<Etiqueta>{TEXTOS_INF.paraQuien}</Etiqueta>
						<div style={{ display: 'flex', marginTop: 6, height: CFG.segmento, borderRadius: 8, border: `1px solid ${BORDE}`, overflow: 'hidden' }}>
							{TEXTOS_INF.destinatarios.map((o, i) => (
								<div key={o} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8px', fontSize: 14, lineHeight: 1.2, fontWeight: 600, color: i === 0 ? '#fff' : TEXTO_TENUE, background: i === 0 ? ACENTO : SUPERFICIE }}>
									{o}
								</div>
							))}
						</div>
					</div>

					<div style={{ position: 'absolute', top: EN_CFG.grupo, width: '100%' }}>
						<Etiqueta>{TEXTOS_INF.grupo}</Etiqueta>
					</div>

					<Plegable arriba={EN_CFG.comoSale} texto={TEXTOS_INF.comoSale} cuenta={TEXTOS_INF.comoSaleCuenta} />
					<Plegable arriba={EN_CFG.laHoja} texto={TEXTOS_INF.laHoja} />

					<div style={{ position: 'absolute', top: EN_CFG.cargar, width: '100%', height: CFG.boton, borderRadius: 8, background: conGrupo ? ACENTO : '#f5f5f5', border: conGrupo ? 'none' : `1px solid ${BORDE}`, boxSizing: 'border-box', color: conGrupo ? '#fff' : 'rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}>
						{conGrupo ? TEXTOS_INF.cargar : TEXTOS_INF.elige}
					</div>
					<div style={{ position: 'absolute', top: EN_CFG.pila, width: '100%', height: CFG.boton, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${BORDE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
						{TEXTOS_INF.pila}
					</div>
				</div>
			)}

			{/* El desplegable del grupo va encima de lo demás, como en Ant. */}
			{elegida && <Select abierto={abierto} conGrupo={conGrupo} opacidad={cfg} marcada={senalada === 'opcion'} />}
		</div>
	);
};

const Select: React.FC<{ abierto: boolean; conGrupo: boolean; opacidad: number; marcada: boolean }> = ({ abierto, conGrupo, opacidad, marcada }) => {
	const r = rectDelSelect();
	const elegida = TEXTOS_INF.grupos_lista.indexOf(GRUPO);
	return (
		<>
			<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${abierto ? ACENTO : BORDE}`, boxShadow: abierto ? `0 0 0 3px ${ACENTO}22` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 16, color: conGrupo ? TEXTO : '#bfbfbf', background: SUPERFICIE, opacity: opacidad }}>
				{conGrupo ? GRUPO : TEXTOS_INF.grupoPlaceholder}
				<Chevron />
			</div>
			{abierto && (
				<div style={{ position: 'absolute', left: r.x, top: r.y + r.alto + 4, width: r.ancho, boxSizing: 'border-box', padding: 4, borderRadius: 8, background: SUPERFICIE, boxShadow: '0 6px 16px rgba(0,0,0,.12), 0 3px 6px -4px rgba(0,0,0,.16)', zIndex: 5 }}>
					{TEXTOS_INF.grupos_lista.map((g, i) => {
						const o = rectDeLaOpcion(i);
						return (
							<div key={g} style={{ height: o.alto, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 6, fontSize: 16, background: marcada && i === elegida ? `${ACENTO}14` : 'transparent' }}>
								{g}
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};

const Chevron: React.FC = () => (
	<svg width="12" height="12" viewBox="0 0 24 24">
		<path d="M5 9l7 7 7-7" fill="none" stroke={TEXTO_TENUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Plegable: React.FC<{ arriba: number; texto: string; cuenta?: string }> = ({ arriba, texto, cuenta }) => (
	<div style={{ position: 'absolute', top: arriba, width: '100%', height: CFG.plegable, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, borderTop: `1px solid ${BORDE}` }}>
		<span style={{ transform: 'rotate(-90deg)', display: 'flex' }}><Chevron /></span>
		<span style={{ flex: 1 }}>{texto}</span>
		{cuenta && <span style={{ color: TEXTO_TENUE, fontSize: 13 }}>{cuenta}</span>}
	</div>
);

const Etiqueta: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ height: CFG.etiqueta, display: 'flex', alignItems: 'center', fontSize: 15, fontWeight: 600 }}>{children}</div>
);

/* ── El visor: la tira de arriba, la cabecera de «Boletines de periodo» y la primera hoja ─── */

const Visor: React.FC<{ desde: number; trae: number; senalada: string | null }> = ({ desde, trae, senalada }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const a = entra(frame, fps, desde, 12);
	const trayendo = frame < trae;
	const hoja = entra(frame, fps, trae, 16);

	return (
		<div style={{ position: 'relative', width: ANCHO_CONTENIDO, height: '100%', color: TEXTO, opacity: a }}>
			<div style={{ position: 'absolute', left: INF.lados, right: INF.lados, top: INF.arriba, height: VISOR.tira, display: 'flex', alignItems: 'center', gap: 10 }}>
				<Boton>← Buscar otro informe</Boton>
				<Boton>Mostrar opciones</Boton>
			</div>

			<div style={{ position: 'absolute', left: INF.lados, right: INF.lados, top: INF.arriba + VISOR.tira + 12, height: VISOR.cabecera, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div>
					<div style={{ fontSize: 26, fontWeight: 700 }}>Boletines de periodo</div>
					<div style={{ fontSize: 15, color: TEXTO_TENUE, marginTop: 4, opacity: trayendo ? 0 : 1 }}>6 boletines del grupo {GRUPO}</div>
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<Icono><Recargar /></Icono>
					<Icono marcado={senalada === 'imprimir'}><Impresora /></Icono>
				</div>
			</div>

			{trayendo ? (
				<div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, fontSize: 16, color: ACENTO }}>
					<Rueda frame={frame} />
					Trayendo los boletines…
				</div>
			) : (
				/* La primera hoja, a escala de pantalla: el papel entero se ve después, a pantalla completa. */
				<div style={{ position: 'absolute', left: (ANCHO_CONTENIDO - HOJA.ancho * 0.9) / 2, top: INF.arriba + VISOR.tira + VISOR.cabecera + 26, transformOrigin: '0 0', transform: `scale(0.9) translateY(${(1 - hoja) * 16}px)`, opacity: hoja }}>
					<BoletinPeriodo />
				</div>
			)}
		</div>
	);
};

const Boton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ height: 34, padding: '0 14px', border: `1px solid ${BORDE}`, borderRadius: 6, background: SUPERFICIE, display: 'flex', alignItems: 'center', fontSize: 14.5 }}>{children}</div>
);

const Icono: React.FC<{ marcado?: boolean; children: React.ReactNode }> = ({ marcado = false, children }) => (
	<div style={{ width: VISOR.icono, height: VISOR.icono, boxSizing: 'border-box', border: `1px solid ${marcado ? ACENTO : BORDE}`, borderRadius: 8, background: SUPERFICIE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		{children}
	</div>
);

const Impresora: React.FC = () => (
	<svg width="20" height="20" viewBox="0 0 18 18">
		<path d="M5.2 7.2 V3.4 H12.8 V7.2" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinejoin="round" />
		<path d="M3.4 7.2 H14.6 V11.6 H3.4 Z" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinejoin="round" />
		<path d="M5.6 11.8 H12.4 V15 H5.6 Z" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinejoin="round" />
	</svg>
);

const Recargar: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 18 18">
		<path d="M14 9 A5 5 0 1 1 12.5 5.4" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinecap="round" />
		<path d="M12.8 2.6 V5.8 H9.6" fill="none" stroke={TEXTO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const Lupa: React.FC = () => (
	<svg width="18" height="18" viewBox="0 0 20 20">
		<circle cx="8.6" cy="8.6" r="5.4" fill="none" stroke="#8c8c8c" strokeWidth="1.7" />
		<path d="M12.6 12.6 L17 17" stroke="#8c8c8c" strokeWidth="1.7" strokeLinecap="round" />
	</svg>
);

/* El icono de la ficha: una hoja vertical con renglones. */
const IconoHoja: React.FC = () => (
	<svg width="40" height="48" viewBox="0 0 40 48" style={{ flex: '0 0 auto' }}>
		<rect x="6" y="3" width="28" height="42" rx="3" fill={`${ACENTO}10`} stroke={ACENTO} strokeWidth="1.6" />
		<path d="M12 13 H28 M12 19 H28 M12 25 H24 M12 31 H28" stroke={ACENTO} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
	</svg>
);

const Rueda: React.FC<{ frame: number }> = ({ frame }) => (
	<svg width="30" height="30" viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 12}deg)` }}>
		<circle cx="12" cy="12" r="9" fill="none" stroke={ACENTO} strokeOpacity="0.25" strokeWidth="3" />
		<path d="M12 3 A9 9 0 0 1 21 12" fill="none" stroke={ACENTO} strokeWidth="3" strokeLinecap="round" />
	</svg>
);
