import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { FUENTE } from '../tema';
import {
	B, CAB, COLOR_DE_MODO, CUENTA, ENTREGAS, EN, ESTADO, ESTADO_ENTREGA, FILAS, LADO, LIENZO, LINEA, MARIANA, Modo, NOMBRE_DE_MODO,
	PALETA, PERIODO, PG, PUNTO_DE_MODO, RESULTADOS, RS, Rect, SEMANA, SUAVE, TAREA, TAREA_SUB, TEXTOS, Y_DE,
	columnasDeFila, rectCampoNota, rectCifra, rectDetalle, rectDuplicar, rectFaltan, rectFila, rectFilaEntrega, rectLista,
	rectListaEntregas, rectPregunta, rectRespondieron, rectVolver,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LAS TRES PANTALLAS DE `/act`: la bandeja (`act-bandeja`), los resultados de un cuestionario
 * (`act-resultados`) y las entregas de una tarea (`act-entregas`). Todo en el lienzo gris de la
 * cáscara con `panelPropio`: cada bloque es su tarjeta blanca. Lo que el foco o el puntero señalan
 * se coloca con los `rect…` de `datos.ts`, los mismos números que usan el foco y el puntero.
 */

const F = PG.letra;
/** La columna de la nota: el campo y, debajo, «= 88 en la planilla (sobre 100)», que es más ancho. */
const ANCHO_NOTA = 262;

/* ── Piezas ──────────────────────────────────────────────────────────────────────────────── */

type Ico = 'plus' | 'down' | 'tarea' | 'cuestionario' | 'encuesta' | 'right' | 'copy' | 'arrow-left' | 'edit' | 'notification' | 'history' | 'arrow-right';

/** Los iconos de Ant que salen, a trazo (como `montar-el-ano/ant`). */
const Icono: React.FC<{ cual: Ico; tam?: number; color?: string }> = ({ cual, tam = 18, color = 'currentColor' }) => {
	const t = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
	return (
		<svg width={tam} height={tam} viewBox="0 0 24 24" style={{ flex: 'none' }}>
			{cual === 'plus' && <path d="M12 5v14M5 12h14" {...t} />}
			{cual === 'down' && <path d="M6 9l6 6 6-6" {...t} />}
			{cual === 'right' && <path d="M9 6l6 6-6 6" {...t} />}
			{cual === 'arrow-left' && <path d="M19 12H5M11 6l-6 6 6 6" {...t} />}
			{cual === 'arrow-right' && <path d="M5 12h14M13 6l6 6-6 6" {...t} />}
			{cual === 'tarea' && <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" {...t} />}
			{cual === 'cuestionario' && <path d="M4 4h16v16H4zM8 12l3 3 5-6" {...t} />}
			{cual === 'encuesta' && <path d="M4 5h16v11H9l-5 4z" {...t} />}
			{cual === 'copy' && <path d="M8 8h11v12H8zM5 16V4h11" {...t} />}
			{cual === 'edit' && <path d="M4 20h4l10.5-10.5-4-4L4 16v4zM13.5 6.5l4 4" {...t} />}
			{cual === 'notification' && <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" {...t} />}
			{cual === 'history' && <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4M12 8v4l3 2" {...t} />}
		</svg>
	);
};

const Tarjeta: React.FC<{ r: Rect; children?: React.ReactNode; relleno?: number }> = ({ r, children, relleno = PG.relleno }) => (
	<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', padding: relleno, background: SUPERFICIE, border: `1px solid ${LINEA}`, borderRadius: PG.radio }}>
		{children}
	</div>
);

const Boton: React.FC<{ texto: string; icono?: Ico; iconoDetras?: Ico; primario?: boolean; encima?: boolean; alto?: number; deshabilitado?: boolean }> = ({ texto, icono, iconoDetras, primario, encima, alto = PG.boton, deshabilitado }) => {
	const fondo = deshabilitado ? 'rgba(0,0,0,0.04)' : primario ? (encima ? '#4096ff' : ACENTO) : SUPERFICIE;
	const borde = deshabilitado ? BORDE : primario ? fondo : encima ? ACENTO : BORDE;
	const color = deshabilitado ? 'rgba(0,0,0,0.25)' : primario ? '#fff' : encima ? ACENTO : TEXTO;
	return (
		<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: alto, padding: '0 18px', boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${borde}`, background: fondo, color, fontSize: F, whiteSpace: 'nowrap', flex: 'none' }}>
			{icono && <Icono cual={icono} tam={F} />}
			{texto}
			{iconoDetras && <Icono cual={iconoDetras} tam={F - 2} />}
		</span>
	);
};

/** `myvc-segmentado`: el deslizante de vidrio, con la opción elegida en blanco y en negrita. */
const Segmentado: React.FC<{ opciones: string[]; elegida: number; alto?: number; letra?: number }> = ({ opciones, elegida, alto = 40, letra = F - 1 }) => (
	<span style={{ display: 'inline-flex', height: alto, padding: 3, boxSizing: 'border-box', borderRadius: 999, background: '#f0f0f0', flex: 'none' }}>
		{opciones.map((o, i) => (
			<span key={o} style={{ display: 'flex', alignItems: 'center', padding: '0 20px', borderRadius: 999, fontSize: letra, whiteSpace: 'nowrap', fontWeight: i === elegida ? 600 : 400, background: i === elegida ? SUPERFICIE : 'transparent', boxShadow: i === elegida ? '0 1px 3px rgba(0,0,0,.12)' : 'none', color: i === elegida ? TEXTO : SUAVE }}>{o}</span>
		))}
	</span>
);

const Azulejo: React.FC<{ modo: Modo; tam?: number }> = ({ modo, tam = B.azulejo }) => (
	<span style={{ width: tam, height: tam, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR_DE_MODO[modo].fondo, color: COLOR_DE_MODO[modo].texto, flex: 'none' }}>
		<Icono cual={modo} tam={tam * 0.46} />
	</span>
);

const Pastilla: React.FC<{ texto: string; fondo: string; color: string; alto?: number; letra?: number }> = ({ texto, fondo, color, alto = 28, letra = 16 }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', height: alto, padding: '0 11px', borderRadius: 999, background: fondo, color, fontSize: letra, fontWeight: 600, whiteSpace: 'nowrap', flex: 'none' }}>{texto}</span>
);

const ChipModo: React.FC<{ modo: Modo }> = ({ modo }) => (
	<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 30, padding: '0 12px', borderRadius: 999, background: COLOR_DE_MODO[modo].fondo, color: COLOR_DE_MODO[modo].texto, fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap' }}>
		<Icono cual={modo} tam={16} />{NOMBRE_DE_MODO[modo]}
	</span>
);

const Lienzo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div style={{ position: 'relative', width: PG.ancho, height: PG.alto, borderRadius: 14, background: LIENZO, boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)', fontFamily: FUENTE, color: TEXTO, overflow: 'hidden' }}>
		{children}
	</div>
);

const Cejilla: React.FC<{ texto: string; y?: number }> = ({ texto }) => (
	<div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: SUAVE, height: 22 }}>{texto}</div>
);

/* ── La bandeja ─────────────────────────────────────────────────────────────────────────── */

export const Bandeja: React.FC<{ encima: number | null }> = ({ encima }) => {
	const c = columnasDeFila();
	const lista = rectLista();
	return (
		<Lienzo>
			<div style={{ position: 'absolute', left: PG.lados, top: PG.arriba }}>
				<div style={{ fontSize: 36, fontWeight: 700, lineHeight: '44px' }}>{TEXTOS.titulo}</div>
				<div style={{ fontSize: F, color: SUAVE, marginTop: 4 }}>{TEXTOS.sub}</div>
			</div>
			<div style={{ position: 'absolute', right: PG.lados, top: 62 }}>
				<Boton texto={TEXTOS.nueva} icono="plus" iconoDetras="down" primario />
			</div>

			<Tarjeta r={lista} />
			<div style={{ position: 'absolute', left: lista.x + PG.relleno, top: Y_DE.mandos, width: lista.ancho - PG.relleno * 2, display: 'flex', justifyContent: 'space-between' }}>
				<Segmentado opciones={TEXTOS.pestanas} elegida={0} />
				<Segmentado opciones={TEXTOS.filtros} elegida={0} />
			</div>
			<div style={{ position: 'absolute', top: Y_DE.titulos, height: B.titulos, left: 0, right: 0, fontSize: 15, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: TEXTO_TENUE }}>
				<span style={{ position: 'absolute', left: c.x0 }}>{TEXTOS.columnas[0]}</span>
				<span style={{ position: 'absolute', left: c.cuanto }}>{TEXTOS.columnas[1]}</span>
				<span style={{ position: 'absolute', left: c.cierra }}>{TEXTOS.columnas[2]}</span>
			</div>
			{FILAS.map((a, i) => {
				const r = rectFila(i);
				const d = rectDuplicar(i);
				const pct = a.respondieron !== null && a.destinatarios > 0 ? (a.respondieron / a.destinatarios) * 100 : 0;
				return (
					<React.Fragment key={a.titulo}>
						<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, borderRadius: 18, background: encima === i ? '#f5f5f5' : 'transparent' }} />
						<div style={{ position: 'absolute', left: c.x0, top: r.y + (r.alto - B.azulejo) / 2 }}><Azulejo modo={a.modo} /></div>
						<div style={{ position: 'absolute', left: c.que, top: r.y + 12, width: c.anchoQue }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 30 }}>
								<strong style={{ fontSize: F, fontWeight: 600, whiteSpace: 'nowrap' }}>{a.titulo}</strong>
								<Pastilla texto={ESTADO[a.estado].nombre} fondo={ESTADO[a.estado].fondo} color={ESTADO[a.estado].texto} />
							</div>
							<div style={{ fontSize: 17, color: SUAVE, marginTop: 4, whiteSpace: 'nowrap' }}>{a.detalle}</div>
						</div>
						<div style={{ position: 'absolute', left: c.cuanto, top: r.y, width: B.col.cuanto, height: r.alto, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, fontSize: 18 }}>
							{a.respondieron === null ? (
								<span style={{ color: TEXTO_TENUE, fontSize: 17 }}>{TEXTOS.sinPublicar}</span>
							) : (
								<>
									<span><strong>{a.respondieron}</strong> de {a.destinatarios}</span>
									<span style={{ display: 'block', height: 8, borderRadius: 99, background: LINEA, overflow: 'hidden' }}>
										<span style={{ display: 'block', height: '100%', width: `${pct}%`, borderRadius: 99, background: ACENTO }} />
									</span>
								</>
							)}
						</div>
						<div style={{ position: 'absolute', left: c.cierra, top: r.y, width: B.col.cierra, height: r.alto, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 18 }}>
							{a.cierra ? (
								<>
									<strong style={{ fontWeight: 600 }}>{a.cierra.dia}</strong>
									<small style={{ fontSize: 16, color: SUAVE }}>{a.cierra.hora}</small>
								</>
							) : <span style={{ color: TEXTO_TENUE, fontSize: 17 }}>{TEXTOS.sinFecha}</span>}
						</div>
						<div style={{ position: 'absolute', left: c.flecha, top: r.y + (r.alto - 18) / 2, color: TEXTO_TENUE }}><Icono cual="right" tam={18} /></div>
						<div style={{ position: 'absolute', left: d.x, top: d.y, width: d.ancho, height: d.alto, display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXTO_TENUE }}><Icono cual="copy" tam={20} /></div>
					</React.Fragment>
				);
			})}

			<LadoDeLaBandeja />
		</Lienzo>
	);
};

const LadoDeLaBandeja: React.FC = () => {
	const x = B.lista.x + B.lista.ancho + 24;
	const ancho = PG.ancho - PG.lados - x;
	const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, height: 30, display: 'flex', alignItems: 'center' };
	return (
		<>
			<Tarjeta r={{ x, y: LADO.toca.y, ancho, alto: LADO.toca.alto }}>
				<div style={h2}>{TEXTOS.teToca}</div>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
					<strong style={{ fontSize: 38, fontWeight: 600, color: ACENTO, lineHeight: 1 }}>1</strong>
					<span style={{ fontSize: 18 }}>{TEXTOS.borradores}</span>
				</div>
			</Tarjeta>
			<Tarjeta r={{ x, y: LADO.semana.y, ancho, alto: LADO.semana.alto }}>
				<div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
					<div style={{ ...h2, flex: 1, whiteSpace: 'nowrap' }}>{TEXTOS.semana}</div>
					<span style={{ fontSize: 13, whiteSpace: 'nowrap', color: SUAVE, textDecoration: 'underline' }}>{TEXTOS.enCalendario}</span>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 10 }}>
					{SEMANA.map((d) => {
						const hoy = d.n === 28;
						return (
							<div key={d.nombre} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '9px 0', borderRadius: 14, background: hoy ? ACENTO : '#f5f5f5', color: hoy ? '#fff' : TEXTO }}>
								<span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', opacity: 0.75 }}>{d.nombre}</span>
								<strong style={{ fontSize: 21, fontWeight: 500 }}>{d.n}</strong>
								<span style={{ display: 'flex', gap: 3, height: 8 }}>
									{d.modos.map((m, k) => <b key={k} style={{ width: 8, height: 8, borderRadius: 99, background: PUNTO_DE_MODO[m] }} />)}
								</span>
							</div>
						);
					})}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 14 }}>
					{[FILAS[1], FILAS[0]].map((a) => (
						<div key={a.titulo} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, height: 26 }}>
							<b style={{ width: 8, height: 8, borderRadius: 99, background: PUNTO_DE_MODO[a.modo], flex: 'none' }} />
							<span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.titulo} cierra</span>
							<small style={{ fontSize: 14, color: SUAVE, whiteSpace: 'nowrap' }}>{a.cierra!.dia}</small>
						</div>
					))}
				</div>
			</Tarjeta>
			<Tarjeta r={{ x, y: LADO.antes.y, ancho, alto: LADO.antes.alto }}>
				<div style={h2}>{TEXTOS.antes}</div>
				<div style={{ fontSize: 17, color: SUAVE, lineHeight: 1.4, marginTop: 8 }}>{TEXTOS.antesTexto}</div>
				<div style={{ marginTop: 12 }}><Boton texto={TEXTOS.antesBoton} icono="history" alto={40} /></div>
			</Tarjeta>
		</>
	);
};

/* ── La cabecera de Resultados y de Entregas ────────────────────────────────────────────── */

const Cabecera: React.FC<{ titulo: string; modo: Modo; sub: string; acciones: React.ReactNode; volverEncima: boolean }> = ({ titulo, modo, sub, acciones, volverEncima }) => {
	const v = rectVolver();
	return (
		<>
			<Tarjeta r={CAB} />
			<div style={{ position: 'absolute', left: v.x, top: v.y, width: v.ancho, height: v.alto, display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: volverEncima ? ACENTO : SUAVE }}>
				<Icono cual="arrow-left" tam={18} />{TEXTOS.volver}
			</div>
			<div style={{ position: 'absolute', left: v.x + v.ancho + 24, top: CAB.y + 16 }}>
				<div style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', whiteSpace: 'nowrap' }}>{titulo}</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontSize: 17, color: SUAVE, whiteSpace: 'nowrap' }}>
					<ChipModo modo={modo} />{sub}
				</div>
			</div>
			<div style={{ position: 'absolute', right: PG.ancho - CAB.x - CAB.ancho + PG.relleno, top: CAB.y + (CAB.alto - PG.boton) / 2, display: 'flex', gap: 10 }}>{acciones}</div>
		</>
	);
};

/* ── Resultados del cuestionario ────────────────────────────────────────────────────────── */

export const Resultados: React.FC<{ volverEncima: boolean }> = ({ volverEncima }) => {
	const R = RESULTADOS;
	const izq = rectRespondieron();
	const der = rectFaltan();
	const pre = rectPregunta();
	const pct = Math.round((R.respondieron / R.destinatarios) * 100);
	const radio = (RS.anillo - 24) / 2;
	const vuelta = 2 * Math.PI * radio;
	return (
		<Lienzo>
			<Cabecera
				titulo={R.titulo}
				modo="cuestionario"
				sub={`${R.sub} ${R.cierra}`}
				volverEncima={volverEncima}
				acciones={<><Boton texto={TEXTOS.editar} icono="edit" /><Boton texto={TEXTOS.duplicar} icono="copy" /><Boton texto={TEXTOS.cerrar} primario /></>}
			/>
			<div style={{ position: 'absolute', left: PG.lados, top: RS.filtros, height: RS.alturaFiltros, display: 'flex', alignItems: 'center', gap: 12 }}>
				<span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: TEXTO_TENUE }}>{TEXTOS.ver}</span>
				<span style={{ height: 40, display: 'inline-flex', alignItems: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid #d9d9d9', background: SUPERFICIE, fontSize: 17 }}>{TEXTOS.todos}</span>
				<span style={{ fontSize: 16, color: TEXTO_TENUE }}>{TEXTOS.pista}</span>
			</div>

			<Tarjeta r={izq}>
				<Cejilla texto={TEXTOS.respondieron} />
				<div style={{ position: 'relative', width: RS.anillo, height: RS.anillo, margin: '10px auto 0' }}>
					<svg width={RS.anillo} height={RS.anillo} viewBox={`0 0 ${RS.anillo} ${RS.anillo}`}>
						<circle cx={RS.anillo / 2} cy={RS.anillo / 2} r={radio} fill="none" stroke={LINEA} strokeWidth={22} />
						<circle cx={RS.anillo / 2} cy={RS.anillo / 2} r={radio} fill="none" stroke="#2a78d6" strokeWidth={22} strokeLinecap="round"
							strokeDasharray={`${(vuelta * pct) / 100} ${vuelta}`} transform={`rotate(-90 ${RS.anillo / 2} ${RS.anillo / 2})`} />
					</svg>
					<span style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<strong style={{ fontSize: 32, lineHeight: 1 }}>{pct} %</strong>
						<small style={{ fontSize: 17, color: SUAVE, marginTop: 4 }}>{R.respondieron} de {R.destinatarios}</small>
					</span>
				</div>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12, textAlign: 'center' }}>
					{([['Promedio', R.notas.promedio], ['Aprobaron', R.notas.aprobaron], ['Reprobaron', R.notas.reprobaron]] as const).map(([t, n]) => (
						<div key={t}><div style={{ fontSize: 16, color: SUAVE }}>{t}</div><div style={{ fontSize: 27, fontWeight: 700 }}>{n}</div></div>
					))}
				</div>
			</Tarjeta>

			<Tarjeta r={der}>
				<Cejilla texto={TEXTOS.faltan} />
				<div style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', alignItems: 'center', gap: 14, marginTop: 12, padding: '8px 10px', fontSize: 19 }}>
					<strong>9B</strong>
					<span style={{ display: 'flex' }}><Avatar tipo="hombre" variante={R.falta} tam={34} /></span>
					<span>1 de {R.destinatarios}</span>
				</div>
				<div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
					<Boton texto={TEXTOS.recordar} icono="notification" primario />
				</div>
			</Tarjeta>

			<Tarjeta r={pre}>
				<div style={{ fontSize: 22, fontWeight: 700 }}>{R.pregunta}</div>
				<div style={{ fontSize: 17, color: SUAVE, marginTop: 6 }}>{R.meta}<strong style={{ color: TEXTO }}>{R.acertaron}</strong></div>
				<Columnas alto={pre.alto - 84} ancho={pre.ancho - PG.relleno * 2} />
			</Tarjeta>
		</Lienzo>
	);
};

/** `myvc-columnas-3d`, a lo sencillo: una columna por opción, con su cara de arriba y su lado. */
const Columnas: React.FC<{ alto: number; ancho: number }> = ({ alto, ancho }) => {
	const ops = RESULTADOS.opciones;
	const hueco = 60;
	const anchoCol = 110;
	const x0 = (ancho - ops.length * anchoCol - (ops.length - 1) * hueco) / 2;
	const pie = 26;
	const util = alto - pie - 28;
	return (
		<div style={{ position: 'relative', width: ancho, height: alto, marginTop: 8 }}>
			<div style={{ position: 'absolute', left: 0, right: 0, top: alto - pie, height: 1, background: LINEA }} />
			{ops.map((o, i) => {
				const h = Math.max(4, (util * o.pct) / 100);
				const x = x0 + i * (anchoCol + hueco);
				const color = PALETA[i % PALETA.length];
				return (
					<React.Fragment key={o.texto}>
						<div style={{ position: 'absolute', left: x, top: alto - pie - h - 24, width: anchoCol, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{o.pct} %</div>
						<div style={{ position: 'absolute', left: x, top: alto - pie - h, width: anchoCol, height: h, background: color, borderRadius: '4px 4px 0 0' }} />
						<div style={{ position: 'absolute', left: x + anchoCol * 0.72, top: alto - pie - h, width: anchoCol * 0.28, height: h, background: 'rgba(0,0,0,.14)', borderRadius: '0 4px 0 0' }} />
						<div style={{ position: 'absolute', left: x - 20, top: alto - pie + 4, width: anchoCol + 40, textAlign: 'center', fontSize: 16, color: SUAVE, whiteSpace: 'nowrap' }}>{o.texto}</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

/* ── Entregas de la tarea ───────────────────────────────────────────────────────────────── */

export const Entregas: React.FC<{ elegida: number; filaEncima: number | null; nota: string; notaActiva: boolean }> = ({ elegida, filaEncima, nota, notaActiva }) => {
	const t = FILAS[TAREA];
	const lista = rectListaEntregas();
	const det = rectDetalle();
	const e = ENTREGAS[elegida];
	const campo = rectCampoNota();
	const cifras: [string, React.ReactNode, string?][] = [
		[TEXTOS.cifras[0], <>{CUENTA.entregaron} <small style={{ fontSize: 18, color: SUAVE }}>de {CUENTA.total}</small></>],
		[TEXTOS.cifras[1], CUENTA.tarde, '#d46b08'],
		[TEXTOS.cifras[2], CUENTA.faltan, '#cf1322'],
		[TEXTOS.cifras[3], <>{CUENTA.calificadas} <small style={{ fontSize: 18, color: SUAVE }}>de {CUENTA.entregaron}</small></>],
	];
	const notaEscrita = elegida === MARIANA ? nota : String(e.nota ?? '');
	return (
		<Lienzo>
			<Cabecera
				titulo={t.titulo}
				modo="tarea"
				sub={TAREA_SUB}
				volverEncima={false}
				acciones={<><Boton texto={TEXTOS.editar} icono="edit" /><Boton texto={TEXTOS.duplicar} icono="copy" /></>}
			/>
			{cifras.map(([rotulo, n, color], i) => (
				<Tarjeta key={rotulo} r={rectCifra(i)} relleno={0}>
					<div style={{ padding: '18px 22px' }}>
						<div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: SUAVE }}>{rotulo}</div>
						<div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, marginTop: 10, color: color ?? TEXTO }}>{n}</div>
						{i === 2 && (
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, height: 28, padding: '0 10px', borderRadius: 999, background: '#fff1f0', color: '#cf1322', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
								<Icono cual="notification" tam={13} />{TEXTOS.recordarFaltan}
							</span>
						)}
					</div>
				</Tarjeta>
			))}
			<div style={{ position: 'absolute', left: rectCifra(4).x + 8, top: EN.cifras + 28, width: rectCifra(4).ancho - 8, fontSize: 17, lineHeight: 1.45 }}>
				<strong style={{ display: 'block' }}>{TEXTOS.planilla}</strong>
				<span style={{ color: SUAVE }}>Periodo {PERIODO} · indicador «{t.titulo}»</span>
			</div>

			<Tarjeta r={lista} relleno={17}>
				<Segmentado opciones={TEXTOS.filtrosEntregas} elegida={0} alto={EN.segmentado} letra={16} />
			</Tarjeta>
			{ENTREGAS.map((a, i) => {
				const r = rectFilaEntrega(i);
				const est = ESTADO_ENTREGA[a.estado];
				const sel = i === elegida;
				return (
					<div key={a.nombre} style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, boxSizing: 'border-box', padding: '0 10px', borderRadius: 12, background: sel ? '#e6f4ff' : filaEncima === i ? '#f5f5f5' : 'transparent', display: 'flex', alignItems: 'center', gap: 12 }}>
						<Avatar tipo={a.sexo} variante={i} tam={42} />
						<span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
							<strong style={{ fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</strong>
							<small style={{ fontSize: 14, color: SUAVE, whiteSpace: 'nowrap' }}>{a.cuando}</small>
						</span>
						<Pastilla texto={est.nombre} fondo={est.fondo} color={est.texto} alto={26} letra={14} />
						<span style={{ width: 30, textAlign: 'right', fontSize: 18, fontWeight: 600, color: a.nota === null ? TEXTO_TENUE : TEXTO }}>{a.nota ?? '—'}</span>
					</div>
				);
			})}

			<Tarjeta r={det} relleno={22}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
					<Avatar tipo={e.sexo} variante={elegida} tam={64} />
					<span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
						<strong style={{ fontSize: 22 }}>{e.nombre}</strong>
						<small style={{ fontSize: 16, color: SUAVE }}>{e.cuando} · 9B</small>
					</span>
					<Pastilla texto={ESTADO_ENTREGA[e.estado].nombre} fondo={ESTADO_ENTREGA[e.estado].fondo} color={ESTADO_ENTREGA[e.estado].texto} />
				</div>
				<div style={{ marginTop: 20 }}><Cejilla texto={TEXTOS.suTexto} /></div>
				<div style={{ fontSize: 18, lineHeight: 1.5, marginTop: 6, padding: '12px 16px', borderRadius: 10, background: '#fafafa', border: `1px solid ${LINEA}`, height: 88, boxSizing: 'border-box' }}>{e.texto}</div>
			</Tarjeta>
			{/* Calificar: la nota y el comentario lado a lado, y los botones debajo (`act-ent__calificar`). */}
			<div style={{ position: 'absolute', left: det.x + 22, top: campo.y - 50, width: det.ancho - 44, height: 1, background: LINEA }} />
			<div style={{ position: 'absolute', left: campo.x, top: campo.y - 30, fontSize: 17, fontWeight: 600 }}>{TEXTOS.nota}</div>
			<div style={{ position: 'absolute', left: campo.x, top: campo.y, width: campo.ancho, height: campo.alto, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${notaActiva ? ACENTO : BORDE}`, boxShadow: notaActiva ? '0 0 0 3px rgba(5,145,255,.1)' : 'none', background: SUPERFICIE, display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 24 }}>
				{notaEscrita}{notaActiva && <span style={{ width: 2, height: 26, background: TEXTO, marginLeft: 2 }} />}
			</div>
			{notaEscrita !== '' && (
				<div style={{ position: 'absolute', left: campo.x, top: campo.y + campo.alto + 6, fontSize: 15, color: SUAVE, whiteSpace: 'nowrap' }}>= {notaEscrita} en la planilla (sobre 100)</div>
			)}
			<div style={{ position: 'absolute', left: campo.x + ANCHO_NOTA, top: campo.y - 30, fontSize: 17, fontWeight: 600, whiteSpace: 'nowrap' }}>
				{TEXTOS.comentario} <small style={{ fontWeight: 400, color: SUAVE, fontSize: 15 }}>{TEXTOS.comentarioPista}</small>
			</div>
			<div style={{ position: 'absolute', left: campo.x + ANCHO_NOTA, top: campo.y, width: det.x + det.ancho - 22 - (campo.x + ANCHO_NOTA), height: 76, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${BORDE}`, background: SUPERFICIE }} />
			<div style={{ position: 'absolute', right: PG.ancho - (det.x + det.ancho - 22), top: campo.y + 96, display: 'flex', gap: 10 }}>
				<Boton texto={TEXTOS.guardar} deshabilitado={notaEscrita === ''} />
				<Boton texto={TEXTOS.guardarSiguiente} iconoDetras="arrow-right" primario deshabilitado={notaEscrita === ''} />
			</div>
		</Lienzo>
	);
};
