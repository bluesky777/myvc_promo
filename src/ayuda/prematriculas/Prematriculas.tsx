import React from 'react';

import { Alerta, Boton, Icono } from '../montar-el-ano/ant';
import { Corte, type Columna } from '../montar-el-ano/Rejilla';
import { avatarDe, type Alumno } from '../secretaria/personas';
import {
	ACENTO, BORDE, BotonesDeEstado, ConCara, En, LETRA, MAIN, Pagina, Pista, TEXTO, TEXTO_TENUE,
	anchoDeBoton, anchoDeEstados, botonesDeCabecera, enCascara, rectDeEstado, type BotonDeCabecera, type Rect,
} from '../secretaria/piezas';
import { CABECERA, FILA, Tabla } from '../secretaria/Tabla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ PREMATRÍCULAS (`/prematriculas`, `paginas/prematriculas`). Textos de
 * `prematriculas.html`; estados y colores de `prematriculas.ts:1363-1371` y del `.scss`.
 *
 * De arriba abajo: la cabecera «Prematrículas 2027», el resumen del colegio, el PASO 1 (el tablero
 * de grupos, que es el selector) y el PASO 2 (la vía del grupo, las dos bandejas de pendientes y la
 * lista «Alumnos de 10°A» con «Va por» y «Cambiar de escalón»). No sabe de tiempo.
 */

export const ANIO = 2027;

export type Estado = 'FORM' | 'PREM' | 'PREA' | 'ASIS' | 'MATR';

/** El rótulo y el color de cada estado, como los pinta «Va por». */
export const ESTADOS: Record<Estado, { texto: string; color: string }> = {
	FORM: { texto: 'Llevó formulario', color: '#595959' },
	PREM: { texto: 'Prematriculado', color: '#0958d9' },
	PREA: { texto: 'Prematriculó la familia', color: '#0958d9' },
	ASIS: { texto: 'Asistente', color: TEXTO },
	MATR: { texto: 'Matriculado', color: '#237804' },
};

/* ── La cabecera ───────────────────────────────────────────────────────────────────────────── */

const BOTONES: BotonDeCabecera[] = [
	{ texto: 'Crear alumno', icono: 'user-add', tipo: 'primary' },
	{ texto: 'Requisitos', icono: 'file-done' },
	{ texto: 'Formularios', icono: 'printer' },
	{ texto: 'Recargar', icono: 'reload' },
	{ texto: 'A CSV', icono: 'download' },
];

/* ── El tablero ───────────────────────────────────────────────────────────────────────────── */

export interface FilaTablero { nombre: string; abrev: string; formul: number; prem: number; asis: number; matric: number; sinPasar: number; cupo: number }

const COLS_TABLERO = [
	{ clave: 'grupo', titulo: 'Grupo', ancho: 200 },
	{ clave: 'formul', titulo: 'Formul', ancho: 110 },
	{ clave: 'prem', titulo: 'Prematr', ancho: 110 },
	{ clave: 'asis', titulo: 'Asis', ancho: 100 },
	{ clave: 'matric', titulo: 'Matric', ancho: 100 },
	{ clave: 'sinPasar', titulo: 'Sin pasar', ancho: 120 },
	{ clave: 'cupo', titulo: 'Cupo', ancho: 100 },
	{ clave: 'ocupacion', titulo: 'Ocupación', ancho: 272 },
];

const FILA_TABLERO = 38;
const CABEZA_TABLERO = 40;

/* ── La lista del grupo ───────────────────────────────────────────────────────────────────── */

export const ESCALONES = ['Form', 'Prem', 'Asis', 'Matr', 'Otro grupo…', 'Reti', 'Dese'];
const LETRA_ESCALONES = 12;
const HUECO_ESCALONES = 3;

export const COLUMNAS_LISTA: Columna[] = [
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: 210, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: 160, filtro: true },
	{ clave: 'va', titulo: 'Va por', ancho: 200, filtro: true },
	{ clave: 'escalon', titulo: 'Cambiar de escalón', ancho: 320, alinear: 'centro' },
	{ clave: 'acudientes', titulo: 'Acudientes', ancho: 116, alinear: 'centro' },
	{ clave: 'ficha', titulo: 'Ficha', ancho: 106, alinear: 'centro' },
];

export const ALTO_LISTA = 450;

/* ── La disposición ──────────────────────────────────────────────────────────────────────── */

export interface Disposicion {
	resumen: number;
	paso1: number;
	tablero: number;
	paso2: number;
	via: number;
	ocupacion: number;
	formularios: number;
	familia: number | null;
	listado: number;
	lista: number;
	fin: number;
}

const ALTO_BANDEJA_FORM = 26 + 26 + 36 + 2 * FILA_TABLERO;
const ALTO_BANDEJA_FAM = 26 + 48 + 36 + FILA_TABLERO;

export function disposicion(filasTablero: number, conFamilia: boolean): Disposicion {
	const resumen = 100;
	const paso1 = resumen + 110 + 24;
	const tablero = paso1 + 40;
	const paso2 = tablero + CABEZA_TABLERO + (filasTablero + 1) * FILA_TABLERO + 24;
	const via = paso2 + 52;
	const ocupacion = via + 92 + 12;
	const formularios = ocupacion + 44 + 16;
	const familia = conFamilia ? formularios + ALTO_BANDEJA_FORM + 16 : null;
	const listado = (familia !== null ? familia + ALTO_BANDEJA_FAM : formularios + ALTO_BANDEJA_FORM) + 16;
	const lista = listado + 26 + 26;
	return { resumen, paso1, tablero, paso2, via, ocupacion, formularios, familia, listado, lista, fin: lista + ALTO_LISTA };
}

export const filaTableroEn = (d: Disposicion, i: number, desplazada: number): Rect =>
	enCascara({ x: 0, y: d.tablero + CABEZA_TABLERO + i * FILA_TABLERO, ancho: MAIN.ancho, alto: FILA_TABLERO }, desplazada);

export const botonGrupoEn = (d: Disposicion, i: number, desplazada: number): Rect => {
	const f = filaTableroEn(d, i, desplazada);
	return { x: f.x + 8, y: f.y + 5, ancho: 110, alto: 28 };
};

export const resumenEn = (d: Disposicion, desplazada: number): Rect => enCascara({ x: 0, y: 0, ancho: MAIN.ancho, alto: d.resumen + 110 }, desplazada);

export const viaEn = (d: Disposicion, desplazada: number): Rect => enCascara({ x: 0, y: d.via, ancho: MAIN.ancho, alto: 92 }, desplazada);

/** El segundo escalón de la vía, «Prematriculados», con su pista. */
export const escalonPremEn = (d: Disposicion, desplazada: number): Rect => {
	const ancho = (MAIN.ancho - 3 * 12) / 4;
	return enCascara({ x: ancho + 12, y: d.via, ancho, alto: 92 }, desplazada);
};

export const bandejaFamiliaEn = (d: Disposicion, desplazada: number): Rect =>
	enCascara({ x: 0, y: d.familia!, ancho: MAIN.ancho, alto: ALTO_BANDEJA_FAM }, desplazada);

const ANCHO_REVISADA = anchoDeBoton('Revisada', false, true);

export const revisadaEn = (d: Disposicion, desplazada: number): Rect =>
	enCascara({ x: MAIN.ancho - 12 - anchoDeBoton('Matricular', false, true) - 6 - ANCHO_REVISADA, y: d.familia! + 26 + 48 + 36 + 6, ancho: ANCHO_REVISADA, alto: 26 }, desplazada);

/** Las papeleras de «Llevaron formulario»: la única operación de la pantalla que borra. */
export const papelerasEn = (d: Disposicion, desplazada: number): Rect =>
	enCascara({ x: MAIN.ancho - 52, y: d.formularios + 26 + 26 + 36, ancho: 52, alto: 2 * FILA_TABLERO }, desplazada);

export const columnaVaPorEn = (d: Disposicion, filas: number, desplazada: number): Rect =>
	enCascara({ x: 210 + 160, y: d.lista, ancho: 200, alto: CABECERA * 2 + filas * FILA }, desplazada);

export const filaListaEn = (d: Disposicion, i: number, desplazada: number): Rect =>
	enCascara({ x: 0, y: d.lista + CABECERA * 2 + i * FILA, ancho: MAIN.ancho, alto: FILA }, desplazada);

/* ── El dibujo ─────────────────────────────────────────────────────────────────────────────── */

export interface FilaGrupo { alumno: Alumno; estado: Estado; celular?: string; fondo?: string }

export interface EstadoPrematriculas {
	tablero: FilaTablero[];
	elegido: string | null;
	encimaGrupo?: string | null;
	via: { formularios: number; prematriculados: number; familia: number; asistentes: number; matriculados: number; ocupados: number; cupo: number };
	formularios: FilaGrupo[];
	familia: FilaGrupo[];
	lista: FilaGrupo[];
	encimaRevisada?: boolean;
	totales: { formularios: number; prematriculados: number; asistentes: number; matriculados: number; sinPasar: number; ocupados: number; cupo: number };
	desplazada?: number;
	opacidad?: number;
}

const Paso: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: LETRA + 3, fontWeight: 600, height: 32 }}>
		<span style={{ width: 26, height: 26, borderRadius: '50%', background: ACENTO, color: '#fff', fontSize: LETRA, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
		{children}
	</div>
);

const Barra: React.FC<{ pct: number; ancho: number | string }> = ({ pct, ancho }) => (
	<div style={{ width: ancho, height: 8, borderRadius: 4, background: '#f0f0f0', overflow: 'hidden' }}>
		<div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: ACENTO }} />
	</div>
);

const Cuantos: React.FC<{ n: number }> = ({ n }) => (
	<span style={{ fontSize: LETRA - 2, fontWeight: 600, padding: '1px 8px', borderRadius: 10, background: '#f0f0f0', color: TEXTO_TENUE, marginLeft: 8 }}>{n}</span>
);

const TablaSimple: React.FC<{ columnas: { titulo: string; ancho: number | string }[]; filas: React.ReactNode[][] }> = ({ columnas, filas }) => (
	<div style={{ border: `1px solid #f0f0f0`, borderRadius: 6, overflow: 'hidden', fontSize: LETRA - 0.5 }}>
		<div style={{ display: 'flex', height: 36, alignItems: 'center', background: '#fafafa', boxShadow: 'inset 0 -1px 0 #f0f0f0', fontWeight: 600 }}>
			{columnas.map((c, i) => <div key={i} style={{ width: c.ancho, flex: c.ancho === '*' ? 1 : 'none', padding: '0 12px', boxSizing: 'border-box' }}>{c.titulo}</div>)}
		</div>
		{filas.map((f, k) => (
			<div key={k} style={{ display: 'flex', height: FILA_TABLERO, alignItems: 'center', boxShadow: 'inset 0 -1px 0 #f5f5f5' }}>
				{f.map((celda, i) => (
					<div key={i} style={{ width: columnas[i].ancho, flex: columnas[i].ancho === '*' ? 1 : 'none', padding: '0 12px', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden' }}>{celda}</div>
				))}
			</div>
		))}
	</div>
);

export const PantallaPrematriculas: React.FC<{ estado: EstadoPrematriculas }> = ({ estado: e }) => {
	const d = disposicion(e.tablero.length, e.familia.length > 0);
	const botones = e.elegido ? BOTONES : BOTONES.slice(0, 3);
	const rects = botonesDeCabecera(botones);
	const t = e.totales;
	const v = e.via;
	const pctColegio = t.cupo ? (t.ocupados / t.cupo) * 100 : 0;
	const pctGrupo = v.cupo ? (v.ocupados / v.cupo) * 100 : 0;
	const anchoEscalon = (MAIN.ancho - 3 * 12) / 4;

	return (
		<Pagina alto={e.elegido ? d.fin : d.paso2 + 40} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
			{/* La cabecera: título, la frase de debajo y los botones. */}
			<En r={{ x: 0, y: 0 }}>
				<div style={{ fontSize: 26, fontWeight: 600, height: 40, display: 'flex', alignItems: 'center' }}>Prematrículas {ANIO}</div>
				<div style={{ fontSize: LETRA - 1, color: TEXTO_TENUE, width: 600, lineHeight: '19px' }}>
					La campaña del año que viene, grupo a grupo: quién llevó formulario, quién está prematriculado y quién ya tiene la matrícula completa.
				</div>
			</En>
			{botones.map((b, i) => (
				<En key={b.texto} r={{ x: rects[i].x, y: rects[i].y }}>
					<Boton texto={b.texto} icono={b.icono} tipo={b.tipo} ancho={rects[i].ancho} />
				</En>
			))}

			{/* El resumen del colegio. */}
			<En r={{ x: 0, y: d.resumen, ancho: MAIN.ancho }}>
				<div style={{ display: 'flex', gap: 40 }}>
					{([[t.formularios, 'Formularios'], [t.prematriculados, 'Prematriculados'], [t.asistentes, 'Asistentes'], [t.matriculados, 'Matriculados'], [t.sinPasar, 'Sin pasar del año en curso']] as [number, string][]).map(([n, nombre]) => (
						<div key={nombre} style={{ display: 'flex', flexDirection: 'column' }}>
							<span style={{ fontSize: 28, fontWeight: 700, lineHeight: '34px' }}>{n}</span>
							<span style={{ fontSize: LETRA - 2, color: TEXTO_TENUE }}>{nombre}</span>
						</div>
					))}
				</div>
				<div style={{ marginTop: 16, fontSize: LETRA }}>
					<b>{t.ocupados}</b> de {t.cupo} plazas del {ANIO} <span style={{ color: TEXTO_TENUE }}>· faltan {t.cupo - t.ocupados}</span>
				</div>
				<div style={{ marginTop: 8 }}><Barra pct={pctColegio} ancho={520} /></div>
			</En>

			{/* PASO 1: el tablero. */}
			<En r={{ x: 0, y: d.paso1 }}><Paso n={1}>Elige el grupo</Paso></En>
			<En r={{ x: 0, y: d.tablero, ancho: MAIN.ancho }}>
				<div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden', fontSize: LETRA - 0.5 }}>
					<div style={{ display: 'flex', height: CABEZA_TABLERO, alignItems: 'center', background: '#fafafa', fontWeight: 600, boxShadow: 'inset 0 -1px 0 #f0f0f0' }}>
						{COLS_TABLERO.map((c) => <div key={c.clave} style={{ width: c.ancho, padding: '0 12px', boxSizing: 'border-box' }}>{c.titulo}</div>)}
					</div>
					{[...e.tablero, null].map((g, i) => {
						const elegida = g !== null && g.abrev === e.elegido;
						const fila = g ?? e.tablero.reduce<FilaTablero>((a, b) => ({ ...a, formul: a.formul + b.formul, prem: a.prem + b.prem, asis: a.asis + b.asis, matric: a.matric + b.matric, sinPasar: a.sinPasar + b.sinPasar, cupo: a.cupo + b.cupo }), { nombre: '', abrev: '', formul: 0, prem: 0, asis: 0, matric: 0, sinPasar: 0, cupo: 0 });
						const num = (n: number) => <span style={{ color: n === 0 ? '#bfbfbf' : TEXTO }}>{n}</span>;
						const ocup = fila.prem + fila.matric;
						return (
							<div key={i} style={{ display: 'flex', height: FILA_TABLERO, alignItems: 'center', background: elegida ? '#e6f4ff' : g === null ? '#fafafa' : 'transparent', boxShadow: 'inset 0 -1px 0 #f5f5f5', fontWeight: g === null ? 600 : 400 }}>
								<div style={{ width: COLS_TABLERO[0].ancho, padding: '0 8px', boxSizing: 'border-box' }}>
									{g ? (
										<span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '3px 8px', borderRadius: 4, color: elegida ? ACENTO : TEXTO, fontWeight: elegida ? 600 : 400, border: `1px solid ${e.encimaGrupo === g.abrev ? ACENTO : 'transparent'}` }}>
											{g.nombre}<span style={{ fontSize: LETRA - 3, color: TEXTO_TENUE }}>{g.abrev}</span>
										</span>
									) : <span style={{ paddingLeft: 8 }}>Todo el colegio</span>}
								</div>
								{(['formul', 'prem', 'asis', 'matric', 'sinPasar', 'cupo'] as const).map((k, j) => (
									<div key={k} style={{ width: COLS_TABLERO[j + 1].ancho, padding: '0 12px', boxSizing: 'border-box' }}>{num(fila[k])}</div>
								))}
								<div style={{ width: COLS_TABLERO[7].ancho, padding: '0 12px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10 }}>
									<Barra pct={fila.cupo ? (ocup / fila.cupo) * 100 : 0} ancho={140} />
									<span style={{ fontSize: LETRA - 2, color: TEXTO_TENUE }}>{ocup}/{fila.cupo}</span>
								</div>
							</div>
						);
					})}
				</div>
			</En>

			{!e.elegido && (
				<En r={{ x: 0, y: d.paso2 - 8, ancho: MAIN.ancho }}>
					<Alerta tipo="info" mensaje="Elige un grupo del tablero para ver y matricular a sus alumnos." ancho={MAIN.ancho} alto={40} />
				</En>
			)}

			{/* PASO 2: el grupo elegido. */}
			{e.elegido && (
				<>
					<En r={{ x: 0, y: d.paso2, ancho: MAIN.ancho }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
							<Paso n={2}>10°A · {ANIO}</Paso>
							<Boton texto="Renovación de 10°A" icono="printer" pequeno ancho={anchoDeBoton('Renovación de 10°A', true, true)} />
						</div>
					</En>
					<En r={{ x: 0, y: d.via, ancho: MAIN.ancho }}>
						<div style={{ display: 'flex', gap: 12 }}>
							{([[v.formularios, 'Llevaron formulario', 'se llevaron el papel a casa'], [v.prematriculados + v.familia, 'Prematriculados', v.familia > 0 ? `${v.familia} los apuntó su familia` : 'tienen el sitio reservado'], [v.asistentes, 'Asistentes', 'vienen a clase sin matrícula'], [v.matriculados, 'Matriculados', 'matrícula completa']] as [number, string, string][]).map(([n, nombre, pista], i) => (
								<div key={nombre} style={{ width: anchoEscalon, height: 92, boxSizing: 'border-box', padding: '10px 14px', border: `1px solid ${i === 3 ? '#b7eb8f' : '#f0f0f0'}`, background: i === 3 ? '#f6ffed' : '#fafafa', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
									<span style={{ fontSize: 26, fontWeight: 700, lineHeight: '30px', color: n === 0 ? '#bfbfbf' : TEXTO }}>{n}</span>
									<span style={{ fontWeight: 600, fontSize: LETRA }}>{nombre}</span>
									<span style={{ fontSize: LETRA - 2, color: TEXTO_TENUE }}>{pista}</span>
								</div>
							))}
						</div>
					</En>
					<En r={{ x: 0, y: d.ocupacion }}>
						<div style={{ fontSize: LETRA }}>
							<b>{v.ocupados}</b> de {v.cupo} plazas de 10°A <span style={{ color: TEXTO_TENUE }}>· faltan {v.cupo - v.ocupados}</span>
						</div>
						<div style={{ marginTop: 8 }}><Barra pct={pctGrupo} ancho={520} /></div>
					</En>

					<En r={{ x: 0, y: d.formularios, ancho: MAIN.ancho }}>
						<div style={{ fontSize: LETRA + 1, fontWeight: 600, height: 26, display: 'flex', alignItems: 'center' }}>Llevaron formulario<Cuantos n={e.formularios.length} /></div>
						<div style={{ height: 26 }}><Pista>Se llevaron el papel a casa y todavía no están prematriculados.</Pista></div>
						<TablaSimple
							columnas={[{ titulo: 'Alumno', ancho: 360 }, { titulo: 'Celular', ancho: 200 }, { titulo: 'Qué hacer', ancho: '*' }]}
							filas={e.formularios.map((f) => [
								`${f.alumno.apellidos} ${f.alumno.nombres}`,
								f.alumno.celular,
								<div key="a" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
									<Boton texto="Prematricular" pequeno ancho={anchoDeBoton('Prematricular', false, true)} />
									<Boton texto="Matricular" pequeno ancho={anchoDeBoton('Matricular', false, true)} />
									<Boton icono="delete" pequeno peligro ancho={30} />
								</div>,
							])}
						/>
					</En>

					{d.familia !== null && (
						<En r={{ x: 0, y: d.familia, ancho: MAIN.ancho }}>
							<div style={{ fontSize: LETRA + 1, fontWeight: 600, height: 26, display: 'flex', alignItems: 'center' }}>Los prematriculó su familia<Cuantos n={e.familia.length} /></div>
							<div style={{ height: 48 }}>
								<Pista ancho={900}>Lo hicieron desde el panel de la familia, sin pasar por secretaría. Están también en la lista de abajo; aquí salen juntos porque son los que hay que revisar.</Pista>
							</div>
							<TablaSimple
								columnas={[{ titulo: 'Alumno', ancho: 300 }, { titulo: 'Documento', ancho: 170 }, { titulo: 'Celular', ancho: 150 }, { titulo: '¿Nuevo?', ancho: 100 }, { titulo: 'Qué hacer', ancho: '*' }]}
								filas={e.familia.map((f) => [
									`${f.alumno.apellidos} ${f.alumno.nombres}`,
									f.alumno.documento,
									f.alumno.celular,
									'No',
									<div key="a" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
										<Boton texto="Revisada" pequeno ancho={ANCHO_REVISADA} encima={e.encimaRevisada} />
										<Boton texto="Matricular" pequeno ancho={anchoDeBoton('Matricular', false, true)} />
									</div>,
								])}
							/>
						</En>
					)}

					<En r={{ x: 0, y: d.listado, ancho: MAIN.ancho }}>
						<div style={{ fontSize: LETRA + 1, fontWeight: 600, height: 26, display: 'flex', alignItems: 'center' }}>Alumnos de 10°A<Cuantos n={e.lista.length} /></div>
						<div style={{ height: 26 }}><Pista>Los prematriculados, los asistentes y los matriculados. La fecha de matrícula y el tipo de documento se editan haciendo clic en la celda.</Pista></div>
					</En>
					<En r={{ x: 0, y: d.lista }}>
						<Tabla
							columnas={COLUMNAS_LISTA}
							ancho={MAIN.ancho}
							alto={ALTO_LISTA}
							filas={e.lista.map((f) => ({
								clave: String(f.alumno.id),
								fondo: f.fondo,
								celdas: {
									apellidos: <ConCara {...avatarDe(f.alumno)} texto={f.alumno.apellidos} />,
									nombres: <Corte>{f.alumno.nombres}</Corte>,
									va: <span style={{ color: ESTADOS[f.estado].color, fontWeight: 500 }}>{ESTADOS[f.estado].texto}</span>,
									escalon: (
										<BotonesDeEstado
											botones={ESCALONES}
											hundido={f.estado === 'PREA' ? 'Prem' : ({ FORM: 'Form', PREM: 'Prem', ASIS: 'Asis', MATR: 'Matr' } as Record<string, string>)[f.estado]}
											letra={LETRA_ESCALONES}
											hueco={HUECO_ESCALONES}
										/>
									),
									acudientes: <Icono cual="usergroup-add" tam={17} color={TEXTO} />,
									ficha: <Icono cual="idcard" tam={17} color={TEXTO} />,
								},
							}))}
						/>
					</En>
				</>
			)}
		</Pagina>
	);
};

export { BORDE, anchoDeEstados, rectDeEstado };
