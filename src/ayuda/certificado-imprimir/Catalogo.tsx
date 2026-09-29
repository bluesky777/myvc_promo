import React from 'react';
import { useVideoConfig } from 'remotion';

import { entra, llega } from '../../comunes/movimiento';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import {
	ANCHO_CONTENIDO,
	BUSCADOR,
	CAMPO,
	CAT,
	CATALOGO,
	CONFIG,
	Ficha,
	LISTA,
	camposDe,
	rectFicha,
	rectOpcion,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL CATÁLOGO DE INFORMES (`/informes`): el buscador con sus pastillas, la lista por familias y el
 * configurador de la derecha. **Sólo lo que estos vídeos usan**: con una búsqueda escrita, la lista
 * enseña las fichas que casan y nada más, que es lo que hace la aplicación. La tira de «Lo que
 * sacaste esta semana» no sale: sólo aparece si ese usuario sacó algo esta semana.
 *
 * El configurador pinta los campos que pide la ficha elegida (`pide`), en su orden, con el botón
 * grande diciendo lo que falta --«Elige un grupo»-- hasta que no falta nada, como en la aplicación.
 */

export interface PropsCatalogo {
	frame: number;
	/** Lo que lleva escrito el buscador. */
	busqueda: string;
	buscadorConFoco: boolean;
	/** Las fichas que casan, y desde cuándo se ven. */
	resultados: Ficha[];
	resultadosDesde: number;
	/** La ficha elegida (índice en `resultados`) y desde cuándo. */
	elegida: number | null;
	elegidaDesde: number;
	/** Lo elegido en cada campo, o null. */
	valores: { grupo?: string | null; alumno?: string | null; hasta?: string | null };
	/** El desplegable abierto, si lo hay. */
	desplegable?: { campo: 'grupo' | 'alumno' | 'hasta'; opciones: string[]; senalada: number | null; t: number } | null;
	/** Lo que el ratón tiene encima: `ficha-N`, `cargar`, un campo… */
	senalado?: string | null;
	/** Cuántos interruptores tiene «Cómo sale este informe» para este papel. */
	interruptores: number;
}

export const Catalogo: React.FC<PropsCatalogo> = (p) => {
	const { fps } = useVideoConfig();
	const f = p.frame;
	const ficha = p.elegida !== null ? p.resultados[p.elegida] : null;
	const conf = ficha ? camposDe(ficha) : null;
	const cuantas = p.busqueda && f >= p.resultadosDesde ? p.resultados.length : 0;
	const configEntra = ficha ? entra(f, fps, p.elegidaDesde, 14) : 0;

	return (
		<div style={{ position: 'absolute', inset: 0, width: ANCHO_CONTENIDO }}>
			{/* ── 1. El buscador ─────────────────────────────────────────────────────────────── */}
			<Tarjeta r={{ x: CAT.lado, y: CAT.arriba, ancho: ANCHO_CONTENIDO - CAT.lado * 2, alto: CAT.buscadorAlto }}>
				<div style={{ position: 'absolute', left: CAT.relleno, top: 16, height: CAT.fila, display: 'flex', alignItems: 'center', fontSize: 27, fontWeight: 700, color: TEXTO }}>
					{CATALOGO.titulo}
				</div>
				<div
					style={{
						position: 'absolute',
						left: BUSCADOR.x - CAT.lado,
						top: 16,
						width: BUSCADOR.ancho,
						height: BUSCADOR.alto,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 16px',
						borderRadius: 10,
						border: `1px solid ${p.buscadorConFoco ? 'transparent' : BORDE}`,
						outline: p.buscadorConFoco ? `2px solid ${ACENTO}` : undefined,
						outlineOffset: -1,
						fontSize: 17,
						color: p.busqueda ? TEXTO : '#a6a6a6',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}
				>
					<Lupa />
					<span>{p.busqueda || CATALOGO.marcador}</span>
					{p.buscadorConFoco && <span style={{ marginLeft: -10, opacity: f % 30 < 16 ? 1 : 0, color: TEXTO }}>|</span>}
				</div>
				<div style={{ position: 'absolute', right: CAT.relleno, top: 16, height: CAT.fila, display: 'flex', alignItems: 'center', fontSize: 15, color: '#8c8c8c' }}>
					Periodo&nbsp;<b style={{ color: TEXTO }}>{CATALOGO.periodo}</b>&nbsp;abierto ·&nbsp;<b style={{ color: TEXTO }}>{CATALOGO.grupos}</b>&nbsp;grupos
				</div>
				{/* Las pastillas: «Todo» y sólo las familias que tienen algo. */}
				<div style={{ position: 'absolute', left: CAT.relleno, top: 16 + CAT.fila + 16, display: 'flex', gap: 8 }}>
					<Pastilla texto="Todo" cuenta={p.busqueda ? cuantas : undefined} puesta />
					{p.busqueda ? (
						cuantas > 0 && <Pastilla texto={CATALOGO.familia} cuenta={cuantas} />
					) : (
						['Para la familia', 'Para el aula', 'Cómo va el grupo', 'Cifras y tendencias', 'Quién vino'].map((t) => <Pastilla key={t} texto={t} />)
					)}
				</div>
			</Tarjeta>

			{/* ── 2. La lista ────────────────────────────────────────────────────────────────── */}
			<Tarjeta r={{ x: LISTA.x, y: LISTA.y, ancho: LISTA.ancho, alto: 844 - LISTA.y - 20 }}>
				{/*
				  SIN BÚSQUEDA, EL CATÁLOGO ENTERO: aquí va apenas esbozado --fichas sin texto--, porque el
				  vídeo pasa por él un segundo camino del buscador y no afirma cuáles son ni cuántas.
				*/}
				{!p.busqueda &&
					[0, 1, 2, 3, 4, 5].map((i) => {
						const r = rectFicha(i);
						return (
							<div key={i} style={{ position: 'absolute', left: r.x - LISTA.x, top: r.y - LISTA.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', borderRadius: 10, border: `1px solid ${BORDE}`, padding: '18px 16px', display: 'flex', gap: 14, opacity: 0.55 }}>
								<div style={{ width: 40, height: 48, borderRadius: 4, background: '#eef1f5' }} />
								<div style={{ flex: 1 }}>
									<div style={{ height: 12, width: '60%', background: '#e3e7ec', borderRadius: 3 }} />
									<div style={{ height: 9, width: '90%', background: '#eef1f5', borderRadius: 3, marginTop: 12 }} />
									<div style={{ height: 9, width: '70%', background: '#eef1f5', borderRadius: 3, marginTop: 8 }} />
								</div>
							</div>
						);
					})}
				{cuantas > 0 && (
					<>
						<div style={{ position: 'absolute', left: CAT.relleno, top: CAT.relleno, display: 'flex', alignItems: 'baseline', gap: 10, opacity: entra(f, fps, p.resultadosDesde, 12) }}>
							<span style={{ fontSize: 17.5, fontWeight: 700, color: TEXTO }}>{CATALOGO.familia}</span>
							<span style={{ fontSize: 15, color: '#8c8c8c' }}>{CATALOGO.familiaPara}</span>
						</div>
						{p.resultados.map((r, i) => {
							const rect = rectFicha(i);
							const l = llega(f, fps, i, p.resultadosDesde + 4, 5);
							const puesta = p.elegida === i && f >= p.elegidaDesde;
							const encima = p.senalado === `ficha-${i}`;
							return (
								<div
									key={r.clave}
									style={{
										position: 'absolute',
										left: rect.x - LISTA.x,
										top: rect.y - LISTA.y,
										width: rect.ancho,
										height: rect.alto,
										boxSizing: 'border-box',
										display: 'flex',
										gap: 14,
										padding: '14px 16px',
										borderRadius: 10,
										border: `1px solid ${puesta ? ACENTO : encima ? '#8fbcfb' : BORDE}`,
										background: puesta ? '#e6f4ff' : encima ? '#f5f9ff' : SUPERFICIE,
										boxShadow: puesta ? `inset 3px 0 0 ${ACENTO}` : undefined,
										opacity: l.opacidad,
										transform: `translateY(${l.y}px)`,
									}}
								>
									<IconoHoja firma={r.clave === 'constancia'} />
									<div style={{ minWidth: 0 }}>
										<div style={{ fontSize: 17, fontWeight: 600, color: TEXTO, lineHeight: 1.25 }}>{r.nombre}</div>
										<div style={{ fontSize: 14.5, color: '#8c8c8c', lineHeight: 1.35, marginTop: 4 }}>{r.para}</div>
									</div>
								</div>
							);
						})}
					</>
				)}
			</Tarjeta>

			{/* ── 3. El configurador ─────────────────────────────────────────────────────────── */}
			<Tarjeta r={{ x: CONFIG.x, y: CONFIG.y, ancho: CONFIG.ancho, alto: conf ? conf.fin - CONFIG.y : 240 }}>
				{!ficha && (
					<div style={{ position: 'absolute', inset: CAT.relleno, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', color: '#8c8c8c', fontSize: 15.5, lineHeight: 1.4 }}>
						<Impresora />
						{CATALOGO.vacio}
					</div>
				)}
				{ficha && conf && (
					<div style={{ opacity: configEntra, transform: `translateY(${(1 - configEntra) * 10}px)` }}>
						<div style={{ position: 'absolute', left: CAT.relleno, right: CAT.relleno, top: CAT.relleno }}>
							<div style={{ fontSize: 19, fontWeight: 700, color: TEXTO }}>{ficha.nombre}</div>
							<div style={{ fontSize: 14.5, color: '#8c8c8c', lineHeight: 1.35, marginTop: 6 }}>{ficha.para}</div>
						</div>
						{ficha.pide.map((que) => {
							/* «Estudiante» cuelga del grupo: no sale hasta que hay grupo (y su hueco espera). */
							if (que === 'alumno' && !p.valores.grupo) { return null; }
							const r = conf.campos[que];
							const top = r.y - CONFIG.y;
							return (
								<React.Fragment key={que}>
									<div style={{ position: 'absolute', left: CAT.relleno, top: top - CAMPO.rotulo, height: CAMPO.rotulo - 4, fontSize: 13.5, fontWeight: 700, letterSpacing: 0.5, color: '#8c8c8c', textTransform: 'uppercase' }}>
										{que === 'destinatario' ? CATALOGO.paraQuien : que === 'grupo' ? CATALOGO.grupo : que === 'alumno' ? CATALOGO.estudiante : CATALOGO.hasta}
									</div>
									{que === 'destinatario' ? (
										<div style={{ position: 'absolute', left: CAT.relleno, top, width: r.ancho, height: r.alto, display: 'flex', borderRadius: 8, border: `1px solid ${BORDE}`, overflow: 'hidden', boxSizing: 'border-box' }}>
											{CATALOGO.destinatarios.map((o, i) => (
												<div key={o} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14.5, fontWeight: 600, color: i === 0 ? '#fff' : TEXTO_TENUE, background: i === 0 ? ACENTO : SUPERFICIE }}>
													{o}
												</div>
											))}
										</div>
									) : (
										<Select
											top={top}
											ancho={r.ancho}
											valor={p.valores[que] ?? null}
											marcador={que === 'grupo' ? CATALOGO.grupoMarcador : que === 'alumno' ? CATALOGO.estudianteMarcador : ''}
											abierto={p.desplegable?.campo === que && p.desplegable.t > 0.5}
											encima={p.senalado === `campo-${que}`}
										/>
									)}
								</React.Fragment>
							);
						})}

						<div style={{ position: 'absolute', left: CAT.relleno, top: conf.como.y - CONFIG.y, height: conf.como.alto, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: TEXTO }}>
							<span style={{ color: '#8c8c8c', fontSize: 12 }}>▶</span>
							{CATALOGO.como}
							<span style={{ fontSize: 13.5, color: '#8c8c8c' }}>
								{p.interruptores} de {p.interruptores}
							</span>
						</div>

						<BotonGrande r={conf.cargar} falta={faltaDe(ficha, p.valores)} encima={p.senalado === 'cargar'} />
						<div
							style={{
								position: 'absolute',
								left: CAT.relleno,
								top: conf.pila.y - CONFIG.y,
								width: conf.pila.ancho,
								height: conf.pila.alto,
								boxSizing: 'border-box',
								border: `1px solid ${BORDE}`,
								borderRadius: 8,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 15,
								color: TEXTO,
							}}
						>
							{CATALOGO.pila}
						</div>
					</div>
				)}
			</Tarjeta>

			{/* El desplegable abierto va encima de todo, como el de Ant. */}
			{ficha && conf && p.desplegable && p.desplegable.t > 0 && (
				<Desplegable control={conf.campos[p.desplegable.campo]} opciones={p.desplegable.opciones} senalada={p.desplegable.senalada} t={p.desplegable.t} />
			)}
		</div>
	);
};

/** Lo que dice el botón grande: lo que falta, o «Cargar el informe». */
export function faltaDe(ficha: Ficha, valores: PropsCatalogo['valores']): string | null {
	if (ficha.pide.includes('grupo') && !valores.grupo) { return CATALOGO.grupoMarcador; }
	if (ficha.pide.includes('alumno') && !valores.alumno) { return CATALOGO.estudianteMarcador; }
	return null;
}

const Tarjeta: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; children?: React.ReactNode }> = ({ r, children }) => (
	<div
		style={{
			position: 'absolute',
			left: r.x,
			top: r.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			background: SUPERFICIE,
			border: '1px solid #ececec',
			borderRadius: 12,
			boxShadow: '0 1px 2px rgba(0,0,0,.04)',
		}}
	>
		{children}
	</div>
);

const Pastilla: React.FC<{ texto: string; cuenta?: number; puesta?: boolean }> = ({ texto, cuenta, puesta = false }) => (
	<div
		style={{
			padding: '5px 14px',
			borderRadius: 999,
			border: `1px solid ${puesta ? '#8fbcfb' : BORDE}`,
			background: puesta ? '#e6f4ff' : SUPERFICIE,
			color: puesta ? ACENTO : TEXTO_TENUE,
			fontWeight: puesta ? 600 : 400,
			fontSize: 15,
			whiteSpace: 'nowrap',
		}}
	>
		{texto}
		{cuenta !== undefined && <span style={{ opacity: 0.6, marginLeft: 5 }}>{cuenta}</span>}
	</div>
);

const Select: React.FC<{ top: number; ancho: number; valor: string | null; marcador: string; abierto: boolean; encima: boolean }> = ({
	top, ancho, valor, marcador, abierto, encima,
}) => (
	<div
		style={{
			position: 'absolute',
			left: CAT.relleno,
			top,
			width: ancho,
			height: CAMPO.control,
			boxSizing: 'border-box',
			border: `1px solid ${abierto || encima ? ACENTO : BORDE}`,
			boxShadow: abierto ? `0 0 0 3px ${ACENTO}22` : undefined,
			borderRadius: 8,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 14px',
			fontSize: 17,
			color: valor ? TEXTO : '#a6a6a6',
		}}
	>
		{valor ?? marcador}
		<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
			<path d="M5 9l7 7 7-7" fill="none" stroke="#a6a6a6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</div>
);

const Desplegable: React.FC<{ control: { x: number; y: number; ancho: number; alto: number }; opciones: string[]; senalada: number | null; t: number }> = ({
	control, opciones, senalada, t,
}) => {
	const r0 = rectOpcion(control, 0);
	return (
		<div
			style={{
				position: 'absolute',
				left: control.x,
				top: r0.y - 4,
				width: control.ancho,
				boxSizing: 'border-box',
				padding: 4,
				background: SUPERFICIE,
				borderRadius: 8,
				boxShadow: '0 6px 16px rgba(0,0,0,.12), 0 3px 6px -4px rgba(0,0,0,.18), 0 9px 28px 8px rgba(0,0,0,.06)',
				opacity: t,
				transform: `translateY(${(1 - t) * -6}px)`,
				zIndex: 5,
			}}
		>
			{opciones.map((o, i) => (
				<div
					key={o}
					style={{
						height: 44,
						display: 'flex',
						alignItems: 'center',
						padding: '0 12px',
						borderRadius: 5,
						fontSize: 16.5,
						color: TEXTO,
						background: senalada === i ? '#e6f4ff' : 'transparent',
						fontWeight: senalada === i ? 600 : 400,
					}}
				>
					{o}
				</div>
			))}
		</div>
	);
};

const BotonGrande: React.FC<{ r: { x: number; y: number; ancho: number; alto: number }; falta: string | null; encima: boolean }> = ({ r, falta, encima }) => (
	<div
		style={{
			position: 'absolute',
			left: CAT.relleno,
			top: r.y - CONFIG.y,
			width: r.ancho,
			height: r.alto,
			boxSizing: 'border-box',
			borderRadius: 8,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: 17,
			fontWeight: 600,
			background: falta ? '#f5f5f5' : encima ? '#4096ff' : ACENTO,
			border: falta ? `1px solid ${BORDE}` : 'none',
			color: falta ? 'rgba(0,0,0,.25)' : '#fff',
		}}
	>
		{falta ?? 'Cargar el informe'}
	</div>
);

const Lupa: React.FC = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
		<circle cx="8.6" cy="8.6" r="5.4" fill="none" stroke="#8c8c8c" strokeWidth="1.7" />
		<path d="M12.6 12.6 L17 17" stroke="#8c8c8c" strokeWidth="1.7" strokeLinecap="round" />
	</svg>
);

const Impresora: React.FC = () => (
	<svg width="44" height="44" viewBox="0 0 18 18" aria-hidden>
		<path d="M5.2 7.2 V3.4 H12.8 V7.2 M3.4 7.2 H14.6 V11.6 H3.4 Z M5.6 11.8 H12.4 V15 H5.6 Z" fill="none" stroke="#bfbfbf" strokeWidth="1.2" strokeLinejoin="round" />
	</svg>
);

/* El icono de la ficha: una hoja vertical; la de la constancia lleva la firma. */
const IconoHoja: React.FC<{ firma: boolean }> = ({ firma }) => (
	<svg width="40" height="48" viewBox="0 0 40 48" style={{ flex: 'none' }} aria-hidden>
		<rect x="5" y="3" width="30" height="42" rx="3" fill="#f0f6ff" stroke={ACENTO} strokeWidth="1.6" />
		<path d="M11 12 H29 M11 18 H29 M11 24 H23" stroke={ACENTO} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
		{firma ? (
			<path d="M11 37 C14 31 16 31 17 36 C18 40 21 33 24 35 C26 36 27 37 30 34" fill="none" stroke={ACENTO} strokeWidth="1.6" strokeLinecap="round" />
		) : (
			<path d="M11 31 H29 M11 36 H29" stroke={ACENTO} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
		)}
	</svg>
);
