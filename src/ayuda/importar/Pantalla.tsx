import React from 'react';

import { BotonP, IconoP, Pagina, TEXTO, type Rect } from '../personas/comun';
import {
	A_IMPORTAR,
	ANCHO,
	COLUMNAS_DESTINO,
	CONSECUENCIA_PARAR,
	FICHERO,
	HECHOS,
	HUECO,
	L,
	LA_MALA,
	MOTIVO_BLOQUEO,
	POR_HOJA,
	TOTALES,
	TRUNCADOS,
	VACIOS,
	X,
	Y0,
	YEAR,
	hojasDe,
	pasosDe,
	pildoras,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE IMPORTAR, dibujada una vez para los dos vídeos. No sabe de tiempo: recibe el
 * estado, y `disposicion()` dice dónde cae cada bloque --lo mismo que usa el guion para el foco y
 * el puntero--.
 *
 * El orden es el de `importar-alumnos.html`: la cabecera, el aviso azul de «Lo que decidas aquí sí
 * se aplica» (sólo con el libro leído), los pasos, el contenido del paso y el pie con «Atrás» /
 * «Paso N de M» / «Siguiente». Entre bloque y bloque, 20 px (`.importar { gap: 20px }`).
 */

const SUAVE = 'rgba(0,0,0,0.65)';
const TENUE = 'rgba(0,0,0,0.45)';
const LINEA = '#e8e8e8';
const ZONA = '#f7f8fa';
const AZUL = '#1677ff';
const VERDE = '#52c41a';
const ROJO = '#ff4d4f';
const AMBAR = '#faad14';
const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

export type Fase = 'inicio' | 'leyendo' | 'ensayo';
export type Clave = 'archivo' | 'hojas' | 'columnas' | 'celdas' | 'valores' | 'resumen';

export interface EstadoImportar {
	fase: Fase;
	/** 0..100 mientras lee o importa. */
	progreso?: number;
	malaLaHoja: boolean;
	paso: Clave;
	desplazada?: number;
	encima?: string | null;
	/** Celdas vacías: la decisión de la primera fila (Barrio). */
	vacioConservar?: boolean;
	/** Valores: qué truncados ya tienen decisión. */
	elegidos?: [boolean, boolean];
	/** El desplegable abierto de un truncado, con la opción resaltada. */
	desplegable?: { cual: number; t: number; resaltada: number | null } | null;
	/** Hay decisiones que el plan todavía no refleja (el pie de «Volver a leer»). */
	planDeAntes?: boolean;
	releyendo?: boolean;
	importando?: { progreso: number; filas: number } | null;
	hecho?: boolean;
	opacidad?: number;
}

const INDICE: Record<Clave, number> = { archivo: 0, hojas: 1, columnas: 2, celdas: 3, valores: 4, resumen: 5 };

/* ── La disposición ────────────────────────────────────────────────────────────────────────── */

const ALTO_CABECERA = 52;
const ALTO_ALERTA = 124;
const ALTO_NAV = 34;
const ALTO_PIE = 47;
const TH = 36;

export const ALTO_SOLTAR = 300;
export const ALTO_LEYENDO = 128;

export const altoFilaHoja = (malaLaHoja: boolean, i: number) => (malaLaHoja && i === LA_MALA ? 104 : 40);
export const ALTO_FILA_COLUMNA = 58;
export const ALTO_FILA_VACIO = 74;
export const ALTO_FILA_TRUNCADO = 76;
export const ALTO_FILA_RESUMEN = 38;

export interface Disposicion {
	nav: number;
	contenido: number;
	/** Los bloques internos del paso, en coordenadas de la cáscara SIN desplazar. */
	tabla: number;
	altoTabla: number;
	bloqueo: number;
	pieAcciones: number;
	importando: number;
	hecho: number;
	pie: number;
	fin: number;
}

export function disposicion(e: EstadoImportar): Disposicion {
	const conEnsayo = e.fase === 'ensayo';
	const nav = Y0 + ALTO_CABECERA + HUECO + (conEnsayo ? ALTO_ALERTA + HUECO : 0);
	const contenido = conEnsayo ? nav + ALTO_NAV + HUECO : nav;
	let tabla = contenido;
	let altoTabla = 0;
	let bloqueo = 0;
	let pieAcciones = 0;
	let fin = contenido;
	let importando = 0;
	let hecho = 0;

	if (!conEnsayo) {
		fin = contenido + (e.fase === 'inicio' ? ALTO_SOLTAR : ALTO_LEYENDO);
	} else if (e.paso === 'archivo') {
		fin = contenido + 66;
	} else if (e.paso === 'hojas') {
		tabla = contenido + 22 + 12 + 42 + 12;
		altoTabla = TH + hojasDe(e.malaLaHoja).reduce((n, _h, i) => n + altoFilaHoja(e.malaLaHoja, i), 0);
		bloqueo = tabla + altoTabla + 12;
		fin = e.malaLaHoja ? bloqueo + 84 : tabla + altoTabla;
	} else if (e.paso === 'columnas') {
		tabla = contenido + 22 + 12 + 63 + 12;
		altoTabla = TH + COLUMNAS_DESTINO.length * ALTO_FILA_COLUMNA;
		fin = tabla + altoTabla;
	} else if (e.paso === 'celdas') {
		tabla = contenido + 22 + 12 + 42 + 12;
		altoTabla = TH + VACIOS.length * ALTO_FILA_VACIO;
		fin = tabla + altoTabla;
	} else if (e.paso === 'valores') {
		tabla = contenido + 22 + 12 + 21 + 12 + 63 + 12;
		altoTabla = TH + TRUNCADOS.length * ALTO_FILA_TRUNCADO;
		pieAcciones = tabla + altoTabla + 12;
		fin = e.planDeAntes ? pieAcciones + 62 : tabla + altoTabla;
	} else {
		const cifras = contenido + 22 + 12 + 21 + 12;
		tabla = cifras + 78 + 12;
		altoTabla = TH + POR_HOJA.length * ALTO_FILA_RESUMEN;
		const alerta = tabla + altoTabla + 12;
		fin = alerta + 100;
		if (e.importando) { importando = fin + HUECO; fin = importando + 150; }
		if (e.hecho) { hecho = fin + HUECO; fin = hecho + HECHO_ALTO; }
	}
	const pie = fin + HUECO;
	const conPie = conEnsayo && !e.hecho && !e.importando;
	return { nav, contenido, tabla, altoTabla, bloqueo, pieAcciones, importando, hecho, pie, fin: conPie ? pie + ALTO_PIE : fin };
}

/** Lo que mide «Lo que pasó» de arriba abajo. */
const HECHO = { h3: 22, alerta: 74, tabla: TH + 4 * ALTO_FILA_RESUMEN, correcciones: 74, obedecio: 22, ademas: 22, pie: 47 };
const HECHO_ALTO = HECHO.h3 + 12 + HECHO.alerta + 12 + HECHO.tabla + 12 + HECHO.correcciones + 12 + HECHO.obedecio + 12 + HECHO.ademas + 12 + HECHO.pie;

/* ── Rectángulos que el guion necesita (cáscara, YA desplazados) ──────────────────────────── */

export function rectPildora(e: EstadoImportar, clave: Clave): Rect {
	const d = disposicion(e);
	const r = pildoras(pasosDe(e.malaLaHoja), d.nav)[INDICE[clave]];
	return { ...r, y: r.y - (e.desplazada ?? 0) };
}
export function rectNav(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.nav - (e.desplazada ?? 0), ancho: ANCHO, alto: ALTO_NAV };
}
export const ANCHO_SIGUIENTE = 104;
export function rectSiguiente(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X + ANCHO - ANCHO_SIGUIENTE, y: d.pie + 14 - (e.desplazada ?? 0), ancho: ANCHO_SIGUIENTE, alto: 32 };
}
export function rectPie(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.pie - (e.desplazada ?? 0), ancho: ANCHO, alto: ALTO_PIE };
}
export const ANCHO_IMPORTAR = 190;
export function rectImportar(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X + ANCHO - ANCHO_IMPORTAR, y: d.pie + 14 - (e.desplazada ?? 0), ancho: ANCHO_IMPORTAR, alto: 32 };
}
export function rectContenido(e: EstadoImportar, alto: number): Rect {
	const d = disposicion(e);
	return { x: X, y: d.contenido - (e.desplazada ?? 0), ancho: ANCHO, alto };
}
export function rectTabla(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.tabla - (e.desplazada ?? 0), ancho: ANCHO, alto: d.altoTabla };
}
/** Una fila de la tabla del paso, por su índice. */
export function rectFila(e: EstadoImportar, i: number): Rect {
	const d = disposicion(e);
	let y = d.tabla + TH;
	const alto = (k: number) =>
		e.paso === 'hojas' ? altoFilaHoja(e.malaLaHoja, k)
			: e.paso === 'columnas' ? ALTO_FILA_COLUMNA
				: e.paso === 'celdas' ? ALTO_FILA_VACIO
					: e.paso === 'valores' ? ALTO_FILA_TRUNCADO
						: ALTO_FILA_RESUMEN;
	for (let k = 0; k < i; k++) { y += alto(k); }
	return { x: X, y: y - (e.desplazada ?? 0), ancho: ANCHO, alto: alto(i) };
}
export function rectBloqueo(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.bloqueo - (e.desplazada ?? 0), ancho: ANCHO, alto: 84 };
}
export const COL_VACIOS = [300, 150, 618];
export const COL_TRUNCADOS = [170, 110, 70, 400, 318];
export function rectIgnorar(e: EstadoImportar, i: number): Rect {
	const f = rectFila(e, i);
	return { x: X + COL_VACIOS[0] + COL_VACIOS[1] + 12, y: f.y + 9, ancho: 126, alto: 26 };
}
export function rectSelectTruncado(e: EstadoImportar, i: number): Rect {
	const f = rectFila(e, i);
	return { x: X + ANCHO - COL_TRUNCADOS[4] + 12, y: f.y + 9, ancho: 220, alto: 32 };
}
export function rectOpcionTruncado(e: EstadoImportar, i: number, k: number): Rect {
	const s = rectSelectTruncado(e, i);
	return { x: s.x + 4, y: s.y + 36 + 4 + k * 34, ancho: 252, alto: 34 };
}
export function rectPieAcciones(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.pieAcciones - (e.desplazada ?? 0), ancho: ANCHO, alto: 62 };
}
export const ANCHO_RELEER = 300;
export function rectReleer(e: EstadoImportar): Rect {
	const r = rectPieAcciones(e);
	return { x: X + ANCHO - ANCHO_RELEER, y: r.y + 14 + 8, ancho: ANCHO_RELEER, alto: 32 };
}
export function rectCifras(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.contenido + 22 + 12 + 21 + 12 - (e.desplazada ?? 0), ancho: ANCHO, alto: 78 };
}
export function rectHecho(e: EstadoImportar, cual: 'alerta' | 'tabla' | 'cuadra' | 'correcciones' | 'obedecio'): Rect {
	const d = disposicion(e);
	const y0 = d.hecho - (e.desplazada ?? 0);
	const alerta = y0 + HECHO.h3 + 12;
	const tabla = alerta + HECHO.alerta + 12;
	const correcciones = tabla + HECHO.tabla + 12;
	const obedecio = correcciones + HECHO.correcciones + 12;
	if (cual === 'alerta') { return { x: X, y: alerta, ancho: ANCHO, alto: HECHO.alerta }; }
	if (cual === 'tabla') { return { x: X, y: tabla, ancho: ANCHO, alto: HECHO.tabla }; }
	if (cual === 'cuadra') { return { x: X + ANCHO - 200, y: tabla, ancho: 200, alto: HECHO.tabla }; }
	if (cual === 'correcciones') { return { x: X, y: correcciones, ancho: ANCHO, alto: HECHO.correcciones }; }
	return { x: X, y: obedecio, ancho: ANCHO, alto: HECHO.obedecio };
}
export function rectImportando(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X, y: d.importando - (e.desplazada ?? 0), ancho: ANCHO, alto: 150 };
}
/** «Elegir fichero», en la zona de soltar. */
export function rectElegir(e: EstadoImportar): Rect {
	const d = disposicion(e);
	return { x: X + ANCHO / 2 - 95, y: d.contenido + 32 + 30 + 8 + 24 + 8 + 88 + 8 + 6 - (e.desplazada ?? 0), ancho: 190, alto: 40 };
}

/* ── La pantalla ───────────────────────────────────────────────────────────────────────────── */

export const PantallaImportar: React.FC<{ e: EstadoImportar }> = ({ e }) => {
	const d = disposicion(e);
	const conEnsayo = e.fase === 'ensayo';
	const pasos = pasosDe(e.malaLaHoja);
	const actual = INDICE[e.paso];
	return (
		<Pagina alto={d.fin - (Y0 - 32) + 32} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
			{/* ── Cabecera ── */}
			<Abs r={{ x: X, y: Y0, ancho: ANCHO, alto: ALTO_CABECERA }}>
				<div style={{ fontSize: L.h2, fontWeight: 600, color: TEXTO, lineHeight: '28px' }}>Importar alumnos desde Excel</div>
				<div style={{ fontSize: L.sub, color: SUAVE, marginTop: 4, lineHeight: '20px' }}>
					Lee tu fichero y te dice qué pasaría con cada columna. Todavía no escribe nada.
				</div>
				{conEnsayo && (
					<div style={{ position: 'absolute', right: 0, top: 0 }}>
						<BotonP texto="Otro fichero" icono="reload" ancho={138} />
					</div>
				)}
			</Abs>

			{conEnsayo && (
				<Abs r={{ x: X, y: Y0 + ALTO_CABECERA + HUECO, ancho: ANCHO, alto: ALTO_ALERTA }}>
					<AlertaAnt tipo="info" titulo="Lo que decidas aquí sí se aplica" alto={ALTO_ALERTA}>
						Las equivalencias de valores y lo que decidas sobre las celdas vacías, los posibles repetidos, los duplicados del propio libro y las
						hojas sin grupo viajan con el fichero, y el importador las usa tanto en el ensayo como en la importación. Al terminar te decimos
						cuáles se aplicaron y, si alguna se quedó fuera, por qué.
					</AlertaAnt>
				</Abs>
			)}

			{conEnsayo && <Nav pasos={pasos} actual={actual} y={d.nav} encima={e.encima} />}

			{e.fase === 'inicio' && <Soltar y={d.contenido} encima={e.encima === 'elegir'} />}
			{e.fase === 'leyendo' && <Leyendo y={d.contenido} progreso={e.progreso ?? 0} titulo={`Leyendo ${FICHERO}…`} ayuda="Se está leyendo el libro entero para poder decirte qué pasaría. No se escribe nada." />}

			{conEnsayo && e.paso === 'archivo' && (
				<Abs r={{ x: X, y: d.contenido, ancho: ANCHO, alto: 66 }}>
					<div style={{ height: 66, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', border: `1px solid ${VERDE}`, borderRadius: 8, background: '#f3faef' }}>
						<IconoP cual="bien" tam={24} color={VERDE} />
						<div>
							<div style={{ fontWeight: 600, fontSize: L.tabla, color: TEXTO }}>{FICHERO}</div>
							<div style={{ fontSize: L.menuda, color: SUAVE }}>Leído correctamente. Los pasos de arriba dicen qué pasaría con cada dato.</div>
						</div>
					</div>
				</Abs>
			)}

			{conEnsayo && e.paso === 'hojas' && <PasoHojas e={e} d={d} />}
			{conEnsayo && e.paso === 'columnas' && <PasoColumnas d={d} />}
			{conEnsayo && e.paso === 'celdas' && <PasoCeldas e={e} d={d} />}
			{conEnsayo && e.paso === 'valores' && <PasoValores e={e} d={d} />}
			{conEnsayo && e.paso === 'resumen' && <PasoResumen e={e} d={d} />}

			{conEnsayo && !e.hecho && !e.importando && (
				<Abs r={{ x: X, y: d.pie, ancho: ANCHO, alto: ALTO_PIE }} style={{ borderTop: `1px solid ${LINEA}`, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
					{actual > 0 && <BotonP texto="Atrás" ancho={82} />}
					<span style={{ flex: 1 }} />
					{e.paso === 'resumen' ? (
						<>
							<span style={{ fontSize: L.tabla, color: TEXTO, height: 32, display: 'flex', alignItems: 'center' }}>Esto es lo que va a pasar. Todavía no se ha escrito nada.</span>
							<BotonP texto={`Importar ${A_IMPORTAR} alumnos`} tipo="primary" ancho={ANCHO_IMPORTAR} encima={e.encima === 'importar'} />
						</>
					) : (
						<>
							<span style={{ fontSize: L.menuda, color: TENUE, height: 32, display: 'flex', alignItems: 'center' }}>Paso {actual + 1} de {pasos.length}</span>
							<BotonP texto="Siguiente" tipo="primary" ancho={ANCHO_SIGUIENTE} encima={e.encima === 'siguiente'} />
						</>
					)}
				</Abs>
			)}
		</Pagina>
	);
};

const Abs: React.FC<{ r: Rect; children?: React.ReactNode; style?: React.CSSProperties }> = ({ r, children, style }) => (
	<div style={{ position: 'absolute', left: r.x, top: r.y, width: r.ancho, height: r.alto, ...style }}>{children}</div>
);

export const AlertaAnt: React.FC<{ tipo: 'info' | 'error' | 'success' | 'warning'; titulo: string; alto: number; children?: React.ReactNode }> = ({ tipo, titulo, alto, children }) => {
	const c = {
		info: { fondo: '#e6f4ff', borde: '#91caff', icono: AZUL, cual: 'info' as const },
		error: { fondo: '#fff2f0', borde: '#ffccc7', icono: ROJO, cual: 'alerta' as const },
		success: { fondo: '#f6ffed', borde: '#b7eb8f', icono: VERDE, cual: 'bien' as const },
		warning: { fondo: '#fffbe6', borde: '#ffe58f', icono: AMBAR, cual: 'alerta' as const },
	}[tipo];
	return (
		<div style={{ height: alto, boxSizing: 'border-box', display: 'flex', gap: 14, padding: '15px 22px', background: c.fondo, border: `1px solid ${c.borde}`, borderRadius: 8, color: TEXTO }}>
			<IconoP cual={c.cual} tam={22} color={c.icono} />
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: 16.5, lineHeight: '24px' }}>{titulo}</div>
				{children && <div style={{ fontSize: L.tabla, lineHeight: '21px', marginTop: 5 }}>{children}</div>}
			</div>
		</div>
	);
};

const Nav: React.FC<{ pasos: { etiqueta: string; contador: number }[]; actual: number; y: number; encima?: string | null }> = ({ pasos, actual, y, encima }) => {
	const r = pildoras(pasos as never, y);
	return (
		<>
			{pasos.map((p, i) => {
				const esActual = i === actual;
				const hecho = i < actual;
				return (
					<React.Fragment key={p.etiqueta}>
						<Abs
							r={r[i]}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								boxSizing: 'border-box',
								padding: '0 12px 0 6px',
								borderRadius: 999,
								background: esActual ? '#e8f1ff' : encima === `paso-${i}` ? 'rgba(0,0,0,0.04)' : 'transparent',
								whiteSpace: 'nowrap',
							}}
						>
							<span
								style={{
									width: 22,
									height: 22,
									borderRadius: 999,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 12,
									fontWeight: 700,
									flex: 'none',
									background: esActual ? AZUL : hecho ? '#dbe9ff' : '#d9d9d9',
									color: esActual ? '#fff' : hecho ? AZUL : TENUE,
								}}
							>
								{hecho ? <IconoP cual="check" tam={12} color={AZUL} /> : i + 1}
							</span>
							<span style={{ fontSize: L.etiqueta, fontWeight: 600, color: esActual ? AZUL : hecho ? SUAVE : TENUE }}>{p.etiqueta}</span>
							{p.contador > 0 && (
								<span style={{ background: AMBAR, color: '#fff', fontSize: 12, fontWeight: 700, borderRadius: 999, padding: '1px 7px' }}>{p.contador}</span>
							)}
						</Abs>
						{i < pasos.length - 1 && (
							<Abs r={{ x: r[i].x + r[i].ancho + 2, y, ancho: 12, alto: 34 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: TENUE, fontSize: 14 }}>
								›
							</Abs>
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};

const Soltar: React.FC<{ y: number; encima: boolean }> = ({ y, encima }) => (
	<Abs
		r={{ x: X, y, ancho: ANCHO, alto: ALTO_SOLTAR }}
		style={{ boxSizing: 'border-box', border: '1px dashed #bfbfbf', borderRadius: 8, background: ZONA, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 32, gap: 8, textAlign: 'center' }}
	>
		<IconoP cual="excel" tam={30} color={TENUE} />
		<div style={{ fontSize: 17, fontWeight: 600, color: TEXTO, height: 24 }}>Elige el Excel del colegio</div>
		<div style={{ fontSize: L.sub, color: SUAVE, maxWidth: 520, lineHeight: '22px', height: 88 }}>
			Se sube para <b>leerlo</b>, no para importarlo: MyVc lo recorre entero y te enseña qué columnas reconoce, qué valores no entiende y qué se
			guardaría en cada caso. Nada se escribe hasta que lo confirmes.
		</div>
		<div style={{ marginTop: 6 }}>
			<BotonP texto="Elegir fichero" icono="subir" tipo="primary" ancho={190} alto={40} redondo tamLetra={16} encima={encima} />
		</div>
		<div style={{ fontSize: 13, color: TENUE }}>O suéltalo aquí · hasta 1 MB · .xls o .xlsx · año lectivo {YEAR}</div>
	</Abs>
);

export const Leyendo: React.FC<{ y: number; progreso: number; titulo: string; ayuda: string; x?: number; extra?: string }> = ({ y, progreso, titulo, ayuda, x = X, extra }) => (
	<Abs r={{ x, y, ancho: ANCHO, alto: extra ? 150 : ALTO_LEYENDO }} style={{ boxSizing: 'border-box', border: `1px solid ${LINEA}`, borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
		<div style={{ fontWeight: 600, fontSize: L.tabla + 1, color: TEXTO }}>{titulo}</div>
		<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
			<div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
				<div style={{ width: `${progreso}%`, height: '100%', background: progreso >= 100 ? VERDE : AZUL, borderRadius: 4 }} />
			</div>
			<span style={{ fontSize: 14, color: TEXTO, width: 44, fontVariantNumeric: 'tabular-nums' }}>{progreso >= 100 ? <IconoP cual="bien" tam={15} color={VERDE} /> : `${Math.round(progreso)}%`}</span>
		</div>
		{extra && <div style={{ fontSize: L.menuda, color: SUAVE }}>{extra}</div>}
		<div style={{ fontSize: L.menuda, color: SUAVE }}>{ayuda}</div>
	</Abs>
);

/* ── Tablas ────────────────────────────────────────────────────────────────────────────────── */

const Tabla: React.FC<{ y: number; columnas: { titulo: string; ancho: number; cifra?: boolean }[]; filas: { alto: number; celdas: React.ReactNode[]; pierde?: boolean }[] }> = ({ y, columnas, filas }) => {
	const alto = TH + filas.reduce((n, f) => n + f.alto, 0);
	return (
		<Abs r={{ x: X, y, ancho: ANCHO, alto }} style={{ boxSizing: 'border-box', border: `1px solid ${LINEA}`, borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
			<div style={{ display: 'flex', height: TH, alignItems: 'center', borderBottom: `1px solid ${LINEA}` }}>
				{columnas.map((c) => (
					<div key={c.titulo} style={{ width: c.ancho, padding: '0 12px', boxSizing: 'border-box', textAlign: c.cifra ? 'right' : 'left', fontSize: L.th, letterSpacing: '0.05em', textTransform: 'uppercase', color: TENUE, fontWeight: 600, whiteSpace: 'nowrap' }}>
						{c.titulo}
					</div>
				))}
			</div>
			{filas.map((f, i) => (
				<div key={i} style={{ display: 'flex', height: f.alto, boxSizing: 'border-box', borderBottom: i < filas.length - 1 ? `1px solid ${LINEA}` : 'none', background: f.pierde ? '#fff7e6' : 'transparent' }}>
					{f.celdas.map((c, k) => (
						<div key={k} style={{ width: columnas[k].ancho, padding: '9px 12px', boxSizing: 'border-box', fontSize: L.tabla, color: TEXTO, textAlign: columnas[k].cifra ? 'right' : 'left', fontVariantNumeric: 'tabular-nums', lineHeight: '21px', overflow: 'hidden' }}>
							{c}
						</div>
					))}
				</div>
			))}
		</Abs>
	);
};

const Menuda: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ display: 'block', color: TENUE, fontSize: L.menuda, marginTop: 2, lineHeight: '18px' }}>{children}</div>;
const Clave: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontFamily: MONO, fontSize: 14 }}>{children}</span>;
const Pild: React.FC<{ tono: 'bien' | 'mal' | 'aviso' | 'apagada'; children: React.ReactNode }> = ({ tono, children }) => {
	const color = tono === 'bien' ? VERDE : tono === 'mal' ? ROJO : tono === 'aviso' ? '#d48806' : TENUE;
	const borde = tono === 'bien' ? VERDE : tono === 'mal' ? ROJO : tono === 'aviso' ? AMBAR : '#bfbfbf';
	return <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 500, padding: '0 9px', borderRadius: 999, border: `1px solid ${borde}`, color, whiteSpace: 'nowrap', lineHeight: '20px' }}>{children}</span>;
};
const Encabezado: React.FC<{ y: number; titulo: string; children?: React.ReactNode; alto?: number }> = ({ y, titulo, children, alto = 42 }) => (
	<>
		<Abs r={{ x: X, y, ancho: ANCHO, alto: 22 }} style={{ fontSize: 17, fontWeight: 600, color: TEXTO }}>{titulo}</Abs>
		{children && <Abs r={{ x: X, y: y + 34, ancho: 640, alto }} style={{ fontSize: L.sub, color: SUAVE, lineHeight: '21px' }}>{children}</Abs>}
	</>
);

export const SelectAnt: React.FC<{ valor: string | null; marcador?: string; ancho: number; abierto?: boolean; encima?: boolean }> = ({ valor, marcador = 'Sin decidir', ancho, abierto = false, encima = false }) => (
	<div style={{ width: ancho, height: 32, boxSizing: 'border-box', border: `1px solid ${abierto || encima ? AZUL : '#d9d9d9'}`, boxShadow: abierto ? '0 0 0 2px rgba(5,145,255,0.1)' : 'none', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 11px', fontSize: L.tabla, background: '#fff', justifyContent: 'space-between' }}>
		<span style={{ color: valor ? TEXTO : 'rgba(0,0,0,0.3)', whiteSpace: 'nowrap', overflow: 'hidden' }}>{valor ?? marcador}</span>
		<IconoP cual="flecha" tam={12} color="rgba(0,0,0,0.3)" />
	</div>
);

const PasoHojas: React.FC<{ e: EstadoImportar; d: Disposicion }> = ({ e, d }) => {
	const hojas = hojasDe(e.malaLaHoja);
	return (
		<>
			<Encabezado y={d.contenido} titulo="Las hojas del libro">
				Cada pestaña es un grupo, y tiene que llamarse igual que su abreviatura en MyVc — no el nombre bonito del grupo.
			</Encabezado>
			<Tabla
				y={d.tabla}
				columnas={[{ titulo: 'Hoja', ancho: 190 }, { titulo: 'Filas', ancho: 90, cifra: true }, { titulo: 'Grupo de MyVc', ancho: 400 }, { titulo: 'Qué hacemos', ancho: ANCHO - 680 }]}
				filas={hojas.map((h, i) => ({
					alto: altoFilaHoja(e.malaLaHoja, i),
					celdas: [
						<Clave key="h">{h.nombre}</Clave>,
						h.filas,
						h.grupo ? (
							<Pild key="g" tono="bien">{h.grupo}</Pild>
						) : (
							<div key="g">
								<Pild tono="mal">No corresponde a ningún grupo de {YEAR}</Pild>
								<Menuda>Aunque esté vacía: el nombre se resuelve antes de mirar las filas.</Menuda>
							</div>
						),
						h.grupo ? (
							<span key="q" style={{ color: TENUE, fontSize: L.menuda }}>—</span>
						) : (
							<div key="q">
								<SelectAnt valor={null} ancho={230} encima={e.encima === 'hoja'} />
								<Menuda>{CONSECUENCIA_PARAR}</Menuda>
							</div>
						),
					],
				}))}
			/>
			{e.malaLaHoja && (
				<Abs r={{ x: X, y: d.bloqueo, ancho: ANCHO, alto: 84 }}>
					<AlertaAnt tipo="error" titulo="Este libro no se puede importar tal como está" alto={84}>
						{MOTIVO_BLOQUEO}
					</AlertaAnt>
				</Abs>
			)}
		</>
	);
};

const PasoColumnas: React.FC<{ d: Disposicion }> = ({ d }) => (
	<>
		<Encabezado y={d.contenido} titulo="Las columnas" alto={63}>
			Se buscan por nombre, no por posición. Que sobren no molesta; que falte una de las que MyVc lee, sí — y lo que se guarda entonces está en
			la tercera columna.
		</Encabezado>
		<Tabla
			y={d.tabla}
			columnas={[{ titulo: 'Columna de MyVc', ancho: 290 }, { titulo: 'En tu fichero', ancho: 250 }, { titulo: 'Si viene vacía, se guardaría', ancho: ANCHO - 540 }]}
			filas={COLUMNAS_DESTINO.map((c) => ({
				alto: ALTO_FILA_COLUMNA,
				pierde: Boolean(c.faltaEn),
				celdas: [
					<div key="a">
						{c.etiqueta}
						<Menuda>
							{c.obligatoria ? 'obligatoria' : 'opcional'}
							{c.longitud ? ` · ${c.longitud} caracteres` : ''}
						</Menuda>
					</div>,
					c.faltaEn ? (
						<div key="b">
							<Pild tono="mal">No está</Pild>
							<Menuda>falta en {c.faltaEn}</Menuda>
						</div>
					) : (
						<div key="b">
							<Pild tono="bien">Está</Pild>
							{c.vacias ? <Menuda>{c.vacias} celdas vacías</Menuda> : null}
						</div>
					),
					c.defecto ? (
						<div key="c">
							<Pild tono="aviso">{c.defecto.literal}</Pild>
							{c.defecto.soloAlCrear && <Menuda>al crear. Al actualizar, borra el que hubiera.</Menuda>}
						</div>
					) : (
						<Menuda key="c">{c.siFalta}</Menuda>
					),
				],
			}))}
		/>
	</>
);

const PasoCeldas: React.FC<{ e: EstadoImportar; d: Disposicion }> = ({ e, d }) => (
	<>
		<Encabezado y={d.contenido} titulo="Las celdas vacías">
			Al actualizar, MyVc escribe todas las columnas: <b style={{ color: TEXTO }}>una celda vacía borra lo que hubiera</b>. Aquí se decide columna por
			columna, y se aplica a todas sus filas.
		</Encabezado>
		<Tabla
			y={d.tabla}
			columnas={[{ titulo: 'Columna', ancho: COL_VACIOS[0] }, { titulo: 'Celdas vacías', ancho: COL_VACIOS[1], cifra: true }, { titulo: 'Qué hacer con la celda vacía', ancho: COL_VACIOS[2] }]}
			filas={VACIOS.map((v, i) => {
				const conservar = i === 0 && Boolean(e.vacioConservar);
				return {
					alto: ALTO_FILA_VACIO,
					pierde: true,
					celdas: [
						v.etiqueta,
						v.veces,
						<div key="d">
							<div style={{ display: 'flex', gap: 6 }}>
								<BotonP texto="Ignorar el Excel" pequeno tipo={conservar ? 'primary' : 'default'} ancho={126} encima={i === 0 && e.encima === 'ignorar'} />
								<BotonP texto="Borrar en MyVc" pequeno ancho={124} />
							</div>
							<div style={{ color: SUAVE, fontSize: 14, marginTop: 6, lineHeight: '19px' }}>{v.siFalta}</div>
						</div>,
					],
				};
			})}
		/>
	</>
);

const PasoValores: React.FC<{ e: EstadoImportar; d: Disposicion }> = ({ e, d }) => {
	const elegidos = e.elegidos ?? [false, false];
	const decisiones = (e.vacioConservar ? 1 : 0) + elegidos.filter(Boolean).length;
	return (
		<>
			<Abs r={{ x: X, y: d.contenido, ancho: ANCHO, alto: 22 }} style={{ fontSize: 17, fontWeight: 600, color: TEXTO }}>Los valores que MyVc no entiende</Abs>
			<Abs r={{ x: X, y: d.contenido + 34, ancho: 700, alto: 21 }} style={{ fontSize: L.sub, color: SUAVE }}>
				Cada renglón es una decisión, no una por fila: se aplica a todas las que traen ese valor.
			</Abs>
			<Abs r={{ x: X, y: d.contenido + 34 + 21 + 12, ancho: 700, alto: 63 }} style={{ fontSize: L.sub, color: SUAVE, lineHeight: '21px' }}>
				<b style={{ color: TEXTO }}>Estos avisos hacen falta aunque el plan diga que no cambia nada.</b> Cuando MyVc no entiende un valor guarda uno por
				defecto, y si ese defecto coincide con lo que el alumno ya tenía, no hay ninguna diferencia que ver — ni en el plan ni en la ficha. El error
				no deja rastro en ningún otro sitio: sólo aquí.
			</Abs>
			<Tabla
				y={d.tabla}
				columnas={[
					{ titulo: 'Columna', ancho: COL_TRUNCADOS[0] },
					{ titulo: 'Trae', ancho: COL_TRUNCADOS[1] },
					{ titulo: 'Filas', ancho: COL_TRUNCADOS[2], cifra: true },
					{ titulo: 'Y entonces', ancho: COL_TRUNCADOS[3] },
					{ titulo: 'Qué guardamos', ancho: COL_TRUNCADOS[4] },
				]}
				filas={TRUNCADOS.map((t, i) => ({
					alto: ALTO_FILA_TRUNCADO,
					celdas: [
						<div key="a">
							{t.etiqueta}
							<Menuda>caben {t.caben} caracteres</Menuda>
						</div>,
						<span key="b" style={{ fontFamily: MONO, fontSize: 14, padding: '0 5px', border: `1px solid ${LINEA}`, borderRadius: 4, background: ZONA }}>{t.valor}</span>,
						t.veces,
						<div key="c" style={{ color: SUAVE, fontSize: 14, lineHeight: '19px' }}>{t.consecuencia}</div>,
						<div key="d">
							<SelectAnt valor={elegidos[i] ? t.opciones[t.elegida] : null} ancho={220} abierto={e.desplegable?.cual === i && e.desplegable.t > 0.5} encima={e.encima === `select-${i}`} />
							<Menuda>se aplica a las {t.veces} filas</Menuda>
						</div>,
					],
				}))}
			/>
			{e.planDeAntes && (
				<Abs r={{ x: X, y: d.pieAcciones, ancho: ANCHO, alto: 62 }} style={{ borderTop: `1px solid ${LINEA}`, display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, boxSizing: 'border-box' }}>
					<div style={{ fontSize: L.sub, color: TEXTO, lineHeight: '21px', maxWidth: 700 }}>
						<b>{decisiones} {decisiones === 1 ? 'decisión tomada' : 'decisiones tomadas'}.</b> El plan de abajo todavía es el de antes de corregir: vuelve a
						leer el fichero para ver qué cambia.
					</div>
					<span style={{ flex: 1 }} />
					<BotonP texto="Volver a leer con estas correcciones" tipo="primary" ancho={ANCHO_RELEER} deshabilitado={e.releyendo} cargando={e.releyendo} encima={e.encima === 'releer'} />
				</Abs>
			)}
			{e.desplegable && e.desplegable.t > 0 && <PanelTruncado e={e} />}
		</>
	);
};

const PanelTruncado: React.FC<{ e: EstadoImportar }> = ({ e }) => {
	const dsp = e.desplegable!;
	const t = TRUNCADOS[dsp.cual];
	const s = rectSelectTruncado({ ...e, desplazada: 0 }, dsp.cual);
	const opciones = [...t.opciones, 'Dejarlo para revisar'];
	return (
		<div
			style={{
				position: 'absolute',
				left: s.x,
				top: s.y + 36,
				width: 260,
				padding: 4,
				boxSizing: 'border-box',
				background: '#fff',
				borderRadius: 8,
				boxShadow: '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
				opacity: dsp.t,
				transform: `scaleY(${0.85 + dsp.t * 0.15})`,
				transformOrigin: '50% 0',
				zIndex: 6,
			}}
		>
			{opciones.map((o, k) => (
				<div key={o} style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 12px', borderRadius: 4, fontSize: L.tabla, color: TEXTO, background: dsp.resaltada === k ? 'rgba(0,0,0,0.04)' : 'transparent', whiteSpace: 'nowrap' }}>
					{o}
				</div>
			))}
		</div>
	);
};

const PasoResumen: React.FC<{ e: EstadoImportar; d: Disposicion }> = ({ e, d }) => {
	const cifras = [
		{ k: 'Se actualizan', v: TOTALES.actualizar, n: 'ya están en MyVc' },
		{ k: 'Se crean', v: TOTALES.crear, n: 'con usuario y matrícula' },
		{ k: 'Ningún dato cambia', v: TOTALES.sin_cambios, n: 'se vuelven a guardar igual' },
		{ k: 'Se saltan', v: TOTALES.se_saltan, n: 'no hacen nada' },
		{ k: 'Se borran', v: TOTALES.borrar, n: 'importar nunca borra' },
	];
	const yCifras = d.contenido + 22 + 12 + 21 + 12;
	const yAlerta = d.tabla + d.altoTabla + 12;
	return (
		<>
			<Abs r={{ x: X, y: d.contenido, ancho: ANCHO, alto: 22 }} style={{ fontSize: 17, fontWeight: 600, color: TEXTO }}>Qué va a pasar</Abs>
			<Abs r={{ x: X, y: d.contenido + 34, ancho: 700, alto: 21 }} style={{ fontSize: L.sub, color: SUAVE }}>Leído contra la base, y todavía sin escribir nada.</Abs>
			<Abs r={{ x: X, y: yCifras, ancho: ANCHO, alto: 78 }} style={{ display: 'flex', gap: 1, background: LINEA, border: `1px solid ${LINEA}`, borderRadius: 8, overflow: 'hidden', boxSizing: 'border-box' }}>
				{cifras.map((c) => (
					<div key={c.k} style={{ flex: 1, background: '#fff', padding: '10px 14px', display: 'flex', flexDirection: 'column' }}>
						<span style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: TENUE, fontWeight: 600 }}>{c.k}</span>
						<span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: TEXTO }}>{c.v}</span>
						<span style={{ fontSize: 13, color: TENUE }}>{c.n}</span>
					</div>
				))}
			</Abs>
			<Tabla
				y={d.tabla}
				columnas={[
					{ titulo: 'Hoja', ancho: 140 },
					{ titulo: 'Grupo', ancho: 160 },
					{ titulo: 'Filas', ancho: 130, cifra: true },
					{ titulo: 'Crea', ancho: 130, cifra: true },
					{ titulo: 'Actualiza', ancho: 150, cifra: true },
					{ titulo: 'Se salta', ancho: 150, cifra: true },
					{ titulo: 'Documentos nuevos', ancho: ANCHO - 860, cifra: true },
				]}
				filas={POR_HOJA.map((h) => ({ alto: ALTO_FILA_RESUMEN, celdas: [<Clave key="h">{h.hoja}</Clave>, h.grupo, h.filas, h.crear, h.actualizar, h.se_saltan, h.nuevos] }))}
			/>
			<Abs r={{ x: X, y: yAlerta, ancho: ANCHO, alto: 100 }}>
				<AlertaAnt tipo="info" titulo="Y además, para que no haya sorpresas" alto={100}>
					Se crearían {TOTALES.crear} usuarios con la contraseña <span style={{ filter: 'blur(5px)' }}>000000</span> y {TOTALES.crear} matrículas en estado
					MATR. Nadie se retira de ningún grupo, y los grupos que no vienen en el libro se quedan igual.
				</AlertaAnt>
			</Abs>
			{e.importando && (
				<Leyendo
					y={d.importando}
					progreso={e.importando.progreso}
					titulo="Importando…"
					extra={`${e.importando.filas} de ${HECHOS.filas} filas`}
					ayuda="Ahora sí se está escribiendo. Si se corta, al volver a entrar se puede seguir donde se quedó."
				/>
			)}
			{e.hecho && <LoQuePaso d={d} />}
		</>
	);
};

const LoQuePaso: React.FC<{ d: Disposicion }> = ({ d }) => {
	const y0 = d.hecho;
	const yAlerta = y0 + HECHO.h3 + 12;
	const yTabla = yAlerta + HECHO.alerta + 12;
	const yCorr = yTabla + HECHO.tabla + 12;
	const yObed = yCorr + HECHO.correcciones + 12;
	const yAdemas = yObed + HECHO.obedecio + 12;
	const yPie = yAdemas + HECHO.ademas + 12;
	const filas = [
		{ c: 'Filas leídas', a: FILAS_DEL_LIBRO_, b: HECHOS.filas },
		{ c: 'Alumnos creados', a: TOTALES.crear, b: HECHOS.creados },
		{ c: 'Alumnos actualizados', a: TOTALES.actualizar + TOTALES.sin_cambios, b: HECHOS.actualizados },
		{ c: 'Filas que no hicieron nada', a: TOTALES.se_saltan, b: HECHOS.saltadas },
	];
	return (
		<>
			<Abs r={{ x: X, y: y0, ancho: ANCHO, alto: 22 }} style={{ fontSize: 17, fontWeight: 600, color: TEXTO }}>Lo que pasó</Abs>
			<Abs r={{ x: X, y: yAlerta, ancho: ANCHO, alto: HECHO.alerta }}>
				<AlertaAnt tipo="success" titulo="Pasó exactamente lo que se dijo que iba a pasar" alto={HECHO.alerta}>
					Los cuatro números del plan coinciden con los de la importación.
				</AlertaAnt>
			</Abs>
			<Tabla
				y={yTabla}
				columnas={[{ titulo: 'Concepto', ancho: 500 }, { titulo: 'Se dijo', ancho: 184, cifra: true }, { titulo: 'Pasó', ancho: 184, cifra: true }, { titulo: '', ancho: 200 }]}
				filas={filas.map((f) => ({ alto: ALTO_FILA_RESUMEN, celdas: [f.c, f.a, f.b, f.a === f.b ? <Pild key="p" tono="bien">Cuadra</Pild> : <Pild key="p" tono="mal">No cuadra</Pild>] }))}
			/>
			<Abs r={{ x: X, y: yCorr, ancho: ANCHO, alto: HECHO.correcciones }}>
				<AlertaAnt tipo="success" titulo="Se aplicaron las 2 correcciones que aprobaste" alto={HECHO.correcciones}>
					Se usaron en {HECHOS.celdas} celdas.
				</AlertaAnt>
			</Abs>
			<Abs r={{ x: X, y: yObed, ancho: ANCHO, alto: HECHO.obedecio }} style={{ fontSize: L.sub, color: SUAVE }}>
				El importador obedeció lo que decidiste en: <b style={{ color: TEXTO }}>vocabularios, vacios</b>.
			</Abs>
			<Abs r={{ x: X, y: yAdemas, ancho: ANCHO, alto: HECHO.ademas }} style={{ fontSize: L.sub, color: SUAVE }}>
				<b style={{ color: TEXTO }}>Y además:</b> se crearon {TOTALES.crear} usuarios y {TOTALES.crear} matrículas.
			</Abs>
			<Abs r={{ x: X, y: yPie, ancho: ANCHO, alto: HECHO.pie }} style={{ borderTop: `1px solid ${LINEA}`, display: 'flex', alignItems: 'flex-end' }}>
				<BotonP texto="Importar otro fichero" ancho={184} />
			</Abs>
		</>
	);
};
const FILAS_DEL_LIBRO_ = HECHOS.filas;
