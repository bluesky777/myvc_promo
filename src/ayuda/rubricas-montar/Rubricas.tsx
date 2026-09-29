import React from 'react';

import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Icono, NombreIcono } from '../montar-el-ano/ant';
import { FUENTE } from '../tema';
import {
	ALTO_FICHA, ALTO_PANEL, ANCHO_CAMPO, Alertas, BOTONES_MANDOS, COL, HUECO_BOTONES, Nivel, PG, PLANO_LISTADO, TALLER,
	TEXTOS, UTIL, X_MATRIZ, avisoDePesos, planoEditor, rectFilaLista,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PANTALLA DE RÚBRICAS DE app2 (`paginas/rubricas/rubricas.html`): el listado de la materia y la
 * matriz de una rúbrica. Dos estados de la MISMA pantalla, como en la aplicación.
 *
 * No sabe de tiempo: recibe el estado del fotograma ya calculado (`EstadoRubricas`), y la geometría
 * sale de `datos.ts`, que es de donde la sacan también el foco y el puntero.
 *
 * SE PINTA COMO LA PLANILLA: a pantalla completa, sin la cáscara, porque la matriz es ancha y dentro
 * de la cáscara al 84 % sus celdas no se leerían.
 */

export interface FilaDelBorrador {
	definicion: string;
	peso: string;
	focoDef?: boolean;
	focoPeso?: boolean;
}

export interface EstadoEditor {
	nombre: string;
	nombreFoco?: boolean;
	columnas: Nivel[];
	filas: FilaDelBorrador[];
	celdas: string[][];
	celdaFoco?: [number, number] | null;
	enUso: boolean;
	/** Ya guardada alguna vez: sale «A la papelera». */
	conId: boolean;
	hayCambios: boolean;
	encima?: 'criterio' | 'nivel' | 'sembrar' | 'guardar' | 'volver' | 'enlace' | null;
}

export interface EstadoRubricas {
	vista: 'listado' | 'editor';
	listado: { nombre: string; datos: string }[];
	filaEncima?: number | null;
	nuevaEncima?: boolean;
	editor?: EstadoEditor;
}

const F = PG.letra;

export function alertasDe(e: EstadoEditor): Alertas {
	const suma = sumaDe(e);
	return { enUso: e.enUso, pesos: avisoDePesos(suma, e.filas.length) !== null, sinNiveles: e.columnas.length === 0 };
}

export function sumaDe(e: EstadoEditor): number {
	return e.filas.reduce((s, f) => s + (Number(f.peso) || 0), 0);
}

export const PantallaRubricas: React.FC<{ estado: EstadoRubricas }> = ({ estado }) => (
	<div
		style={{
			position: 'relative',
			width: PG.ancho,
			height: ALTO_PANEL,
			borderRadius: 14,
			background: SUPERFICIE,
			boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
			fontFamily: FUENTE,
			color: TEXTO,
			overflow: 'hidden',
		}}
	>
		<div style={{ position: 'absolute', left: PG.relleno, top: PG.relleno, height: PG.titulo, display: 'flex', alignItems: 'baseline', gap: 16 }}>
			<span style={{ fontSize: 32, fontWeight: 600 }}>{TEXTOS.titulo}</span>
			<span style={{ fontSize: F, color: TEXTO_TENUE }}>{TEXTOS.materia}</span>
		</div>

		{estado.vista === 'listado' ? <Listado e={estado} /> : estado.editor ? <Editor e={estado.editor} /> : null}
	</div>
);

/* ── El listado ───────────────────────────────────────────────────────────────────────────── */

const Listado: React.FC<{ e: EstadoRubricas }> = ({ e }) => (
	<>
		<div style={{ position: 'absolute', left: PG.relleno, top: PLANO_LISTADO.nueva }}>
			<Btn texto={TEXTOS.nueva} icono="plus" tipo="primary" encima={e.nuevaEncima} />
		</div>
		{e.listado.map((r, i) => {
			const rr = rectFilaLista(i);
			return (
				<div
					key={r.nombre}
					style={{
						position: 'absolute',
						left: rr.x,
						top: rr.y,
						width: rr.ancho,
						height: rr.alto,
						boxSizing: 'border-box',
						padding: '0 20px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						gap: 4,
						border: `1px solid ${e.filaEncima === i ? ACENTO : '#f0f0f0'}`,
						borderRadius: 10,
						background: e.filaEncima === i ? `${ACENTO}0d` : SUPERFICIE,
					}}
				>
					<span style={{ fontSize: F + 1, fontWeight: 600, color: e.filaEncima === i ? ACENTO : TEXTO }}>{r.nombre}</span>
					<span style={{ fontSize: F - 2, color: TEXTO_TENUE }}>{r.datos}</span>
				</div>
			);
		})}
	</>
);

/* ── El editor ────────────────────────────────────────────────────────────────────────────── */

const Editor: React.FC<{ e: EstadoEditor }> = ({ e }) => {
	const a = alertasDe(e);
	const p = planoEditor(a, e.filas.length);
	const suma = sumaDe(e);

	return (
		<>
			<div style={{ position: 'absolute', left: PG.relleno, top: p.volver }}>
				<Btn texto={TEXTOS.volver} icono="arrow-left" encima={e.encima === 'volver'} />
			</div>

			{/* La ficha: nombre, descripción y «Reutilizable». */}
			<div style={{ position: 'absolute', left: PG.relleno, top: p.ficha, width: UTIL, height: ALTO_FICHA }}>
				<div style={{ display: 'flex', gap: 24 }}>
					<div style={{ width: ANCHO_CAMPO }}>
						<div style={{ height: PG.etiqueta, fontSize: F - 1, color: TEXTO_TENUE }}>{TEXTOS.nombre}</div>
						<Entrada valor={e.nombre} marcador={TEXTOS.nombrePlaceholder} foco={e.nombreFoco} ancho={ANCHO_CAMPO} />
					</div>
					<div style={{ width: ANCHO_CAMPO }}>
						<div style={{ height: PG.etiqueta, fontSize: F - 1, color: TEXTO_TENUE }}>
							{TEXTOS.descripcion} <span style={{ opacity: 0.8 }}>{TEXTOS.opcional}</span>
						</div>
						<Entrada valor="" marcador={TEXTOS.descripcionPlaceholder} ancho={ANCHO_CAMPO} />
					</div>
				</div>
				<div style={{ marginTop: 12, height: PG.casilla, display: 'flex', alignItems: 'center', gap: 10, fontSize: F - 1 }}>
					<Marca puesta={false} />
					<span>{TEXTOS.plantilla}</span>
					<span style={{ color: TEXTO_TENUE }}>{TEXTOS.plantillaDetras}</span>
				</div>
			</div>

			{p.alertas.enUso !== undefined && (
				<Alerta top={p.alertas.enUso} tipo="warning" mensaje={TEXTOS.enUso}>
					La usan 1 indicador:{' '}
					<span style={{ color: ACENTO, textDecoration: e.encima === 'enlace' ? 'underline' : 'none' }}>{TALLER.indicador}</span>. Cambiar pesos o
					puntajes <strong>no cambia las notas ya calificadas</strong>: esas se escribieron con los valores de entonces.
				</Alerta>
			)}
			{p.alertas.pesos !== undefined && (
				<Alerta top={p.alertas.pesos} tipo="warning" mensaje={TEXTOS.pesos}>
					{avisoDePesos(suma, e.filas.length)}
				</Alerta>
			)}
			{p.alertas.sinNiveles !== undefined && (
				<Alerta top={p.alertas.sinNiveles} tipo="info" mensaje={TEXTOS.sinNiveles}>
					{TEXTOS.sinNivelesDetalle}
				</Alerta>
			)}

			<Matriz e={e} top={p.matriz} suma={suma} />

			<div style={{ position: 'absolute', left: PG.relleno, top: p.mandos, display: 'flex', gap: HUECO_BOTONES }}>
				{BOTONES_MANDOS.map((b) => (
					<Btn key={b.clave} texto={b.texto} icono={b.icono ? 'plus' : undefined} ancho={b.ancho} encima={e.encima === b.clave} />
				))}
			</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: p.guardar, display: 'flex', gap: 14 }}>
				<Btn
					texto={e.hayCambios ? TEXTOS.guardar : TEXTOS.guardado}
					tipo="primary"
					deshabilitado={!e.hayCambios}
					ancho={150}
					encima={e.encima === 'guardar'}
				/>
				{e.conId && <Btn texto={TEXTOS.papelera} icono="delete" tipo="text" peligro />}
			</div>
		</>
	);
};

const Matriz: React.FC<{ e: EstadoEditor; top: number; suma: number }> = ({ e, top, suma }) => {
	const n = e.columnas.length;
	const ancho = COL.criterio + COL.peso + COL.nivel * n;
	const celda: React.CSSProperties = { boxSizing: 'border-box', borderRight: `1px solid ${BORDE}`, padding: '0 10px', display: 'flex', alignItems: 'center', flex: 'none' };

	return (
		<div style={{ position: 'absolute', left: X_MATRIZ, top, width: ancho, border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', boxSizing: 'content-box' }}>
			{/* La cabecera. */}
			<div style={{ display: 'flex', height: PG.cabecera, background: 'rgb(128 128 128 / 8%)', borderBottom: `1px solid ${BORDE}`, fontSize: F - 1, fontWeight: 600 }}>
				<div style={{ ...celda, width: COL.criterio }}>{TEXTOS.criterio}</div>
				<div style={{ ...celda, width: COL.peso, justifyContent: 'center' }}>{TEXTOS.peso}</div>
				{e.columnas.map((c, j) => (
					<div key={j} style={{ ...celda, width: COL.nivel, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', gap: 6, borderRight: j === n - 1 ? 'none' : celda.borderRight }}>
						<Entrada valor={c.nombre} marcador={TEXTOS.nivelPlaceholder} alto={32} letra={F - 2} negrita />
						<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<Entrada valor={String(c.puntaje)} alto={30} letra={F - 3} ancho={80} />
							<Icono cual="delete" tam={17} color={TEXTO_TENUE} />
						</div>
					</div>
				))}
			</div>

			{/* Los criterios. */}
			{e.filas.map((f, i) => (
				<div key={i} style={{ display: 'flex', height: PG.fila, borderBottom: `1px solid ${BORDE}` }}>
					<div style={{ ...celda, width: COL.criterio, gap: 8, background: 'rgb(128 128 128 / 4%)' }}>
						<Entrada valor={f.definicion} marcador={TEXTOS.criterioPlaceholder} foco={f.focoDef} ancho={COL.criterio - 50} negrita />
						<Icono cual="delete" tam={18} color={TEXTO_TENUE} />
					</div>
					<div style={{ ...celda, width: COL.peso, justifyContent: 'center' }}>
						<Entrada valor={f.peso} foco={f.focoPeso} ancho={80} derecha />
					</div>
					{e.columnas.map((_, j) => {
						const texto = e.celdas[i]?.[j] ?? '';
						const foco = e.celdaFoco?.[0] === i && e.celdaFoco?.[1] === j;
						return (
							<div key={j} style={{ ...celda, width: COL.nivel, borderRight: j === n - 1 ? 'none' : celda.borderRight, padding: '6px 8px' }}>
								<div
									style={{
										width: '100%',
										height: '100%',
										boxSizing: 'border-box',
										border: `1px solid ${foco ? ACENTO : BORDE}`,
										boxShadow: foco ? `0 0 0 2px ${ACENTO}22` : 'none',
										borderRadius: 6,
										padding: '4px 8px',
										fontSize: F - 4,
										lineHeight: 1.25,
										color: texto ? TEXTO : 'rgba(0,0,0,0.3)',
										overflow: 'hidden',
									}}
								>
									{texto || (foco ? '' : '—')}
									{foco && <span style={{ color: TEXTO }}>|</span>}
								</div>
							</div>
						);
					})}
				</div>
			))}

			{/* El pie: la suma, en rojo cuando no cuadra (`matriz__peso--descuadrado`). */}
			<div style={{ display: 'flex', height: PG.pie, fontSize: F - 1 }}>
				<div style={{ ...celda, width: COL.criterio, fontWeight: 600 }}>{TEXTOS.suma}</div>
				<div style={{ ...celda, width: COL.peso, justifyContent: 'center', fontWeight: 700, color: suma === 100 ? TEXTO : '#cf1322', fontVariantNumeric: 'tabular-nums' }}>
					{suma}
				</div>
				{e.columnas.map((_, j) => (
					<div key={j} style={{ ...celda, width: COL.nivel, borderRight: j === n - 1 ? 'none' : celda.borderRight }} />
				))}
			</div>
		</div>
	);
};

/* ── Las piezas, a la letra de esta pantalla ──────────────────────────────────────────────── */

export const Btn: React.FC<{
	texto: string;
	icono?: NombreIcono;
	tipo?: 'default' | 'primary' | 'text';
	encima?: boolean;
	deshabilitado?: boolean;
	peligro?: boolean;
	ancho?: number;
}> = ({ texto, icono, tipo = 'default', encima = false, deshabilitado = false, peligro = false, ancho }) => {
	const lleno = tipo === 'primary';
	const plano = tipo === 'text';
	const fondo = deshabilitado ? 'rgba(0,0,0,0.04)' : lleno ? (encima ? '#4096ff' : ACENTO) : plano ? 'transparent' : SUPERFICIE;
	const borde = deshabilitado ? BORDE : plano ? 'transparent' : lleno ? fondo : encima ? ACENTO : BORDE;
	const letra = deshabilitado ? 'rgba(0,0,0,0.25)' : lleno ? '#fff' : peligro ? '#ff4d4f' : encima ? ACENTO : TEXTO;
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 9,
				height: PG.boton,
				width: ancho,
				padding: '0 18px',
				boxSizing: 'border-box',
				borderRadius: 8,
				border: `1px solid ${borde}`,
				background: fondo,
				color: letra,
				fontSize: F,
				whiteSpace: 'nowrap',
				flex: 'none',
			}}
		>
			{icono && <Icono cual={icono} tam={19} />}
			{texto}
		</div>
	);
};

export const Entrada: React.FC<{
	valor: string;
	marcador?: string;
	foco?: boolean;
	ancho?: number | string;
	alto?: number;
	letra?: number;
	derecha?: boolean;
	negrita?: boolean;
}> = ({ valor, marcador = '', foco = false, ancho = '100%', alto = PG.campo, letra = F, derecha = false, negrita = false }) => (
	<div
		style={{
			width: ancho,
			height: alto,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : 'none',
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: derecha ? 'flex-end' : 'flex-start',
			padding: '0 10px',
			fontSize: letra,
			fontWeight: negrita && valor ? 600 : 400,
			color: valor ? TEXTO : 'rgba(0,0,0,0.3)',
			whiteSpace: 'pre',
			overflow: 'hidden',
			fontVariantNumeric: 'tabular-nums',
			flex: 'none',
		}}
	>
		{valor || (foco ? '' : marcador)}
		{foco && <span style={{ color: TEXTO, fontWeight: 400 }}>|</span>}
	</div>
);

export const Marca: React.FC<{ puesta: boolean }> = ({ puesta }) => (
	<span
		style={{
			width: 22,
			height: 22,
			boxSizing: 'border-box',
			borderRadius: 5,
			border: `1.5px solid ${puesta ? ACENTO : BORDE}`,
			background: puesta ? ACENTO : SUPERFICIE,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			flex: 'none',
		}}
	>
		{puesta && <Icono cual="check" tam={15} color="#fff" />}
	</span>
);

const COLORES_ALERTA = {
	warning: { fondo: '#fffbe6', borde: '#ffe58f', icono: '#faad14' },
	info: { fondo: '#e6f4ff', borde: '#91caff', icono: ACENTO },
};

export const Alerta: React.FC<{ top: number; tipo: 'warning' | 'info'; mensaje: string; alto?: number; ancho?: number; children?: React.ReactNode }> = ({ top, tipo, mensaje, alto = PG.alerta, ancho = UTIL, children }) => {
	const c = COLORES_ALERTA[tipo];
	return (
		<div
			style={{
				position: 'absolute',
				left: PG.relleno,
				top,
				width: ancho,
				height: alto,
				boxSizing: 'border-box',
				display: 'flex',
				gap: 14,
				padding: '14px 20px',
				background: c.fondo,
				border: `1px solid ${c.borde}`,
				borderRadius: 8,
				overflow: 'hidden',
			}}
		>
			<Icono cual={tipo === 'warning' ? 'alerta' : 'info'} tam={24} color={c.icono} />
			<div style={{ flex: 1 }}>
				<div style={{ fontSize: F, fontWeight: 600, lineHeight: '26px' }}>{mensaje}</div>
				<div style={{ fontSize: F - 2, lineHeight: 1.35, marginTop: 4 }}>{children}</div>
			</div>
		</div>
	);
};
