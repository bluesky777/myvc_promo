import React from 'react';

import { Avatar } from '../../comunes/Avatar';
import { ACENTO, BORDE, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Icono } from '../montar-el-ano/ant';
import { NIVELES, TALLER } from '../rubricas-montar/datos';
import { Alerta, Btn } from '../rubricas-montar/Rubricas';
import { FUENTE } from '../tema';
import {
	ALTO_OPCION, COL, CRITERIOS, ESTUDIANTES, PG, TEXTOS, UTIL, X_NOTA, Y, notaDe, opcion, rectOpcion, rectSelector, xCriterio,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA PARRILLA DEL GRUPO (`calificar-grupo.html`), con el estado del fotograma ya calculado. Los
 * selectores son `<select>` NATIVOS en app2 --la pantalla lo explica: 45 × 3 desplegables de la
 * librería serían demasiados--, así que la lista abierta se dibuja como la de un nativo: blanca,
 * pegada debajo, con la opción de encima resaltada en azul.
 */

export interface EstadoGrupo {
	/** El nivel marcado en cada fila y criterio; `null` es «—». */
	marcas: (number | null)[][];
	/** El selector abierto y la opción que tiene el ratón encima (0 = «—»). */
	abierto: { fila: number; criterio: number; resaltada: number | null } | null;
	/** Después de guardar: la Nota enseña lo calculado. */
	calculadas: boolean;
	hayCambios: boolean;
	guardarEncima: boolean;
}

const F = PG.letra;

export const PantallaGrupo: React.FC<{ e: EstadoGrupo }> = ({ e }) => {
	const completos = e.marcas.filter((m, i) => !ESTUDIANTES[i].sinCasilla && notaDe(m) !== null).length;

	return (
		<div
			style={{
				position: 'relative',
				width: PG.ancho,
				height: Y.alto,
				borderRadius: 14,
				background: SUPERFICIE,
				boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)',
				fontFamily: FUENTE,
				color: TEXTO,
			}}
		>
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.titulo, height: PG.titulo, display: 'flex', alignItems: 'baseline', gap: 16 }}>
				<span style={{ fontSize: 32, fontWeight: 600 }}>{TALLER.indicador}</span>
				<span style={{ fontSize: F, color: TEXTO_TENUE }}>{TEXTOS.estudiantes}</span>
			</div>

			{/* Los dos momentos: cuál de las dos valoraciones se marca. */}
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.momentos, display: 'flex', border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden', height: PG.momentos }}>
				<div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: F - 1, background: ACENTO, color: '#fff' }}>{TEXTOS.inicial}</div>
				<div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontSize: F - 1, background: SUPERFICIE }}>{TEXTOS.nivelacion}</div>
			</div>

			<Alerta top={Y.alerta} tipo="warning" mensaje={TEXTOS.sinCasilla}>
				{TEXTOS.sinCasillaDetalle}
			</Alerta>

			<Tabla e={e} />

			<div style={{ position: 'absolute', left: PG.relleno, top: Y.pie, width: UTIL, height: PG.pie, display: 'flex', alignItems: 'center', fontSize: F - 3, color: TEXTO_TENUE }}>
				{TEXTOS.pie}
			</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: Y.mandos, display: 'flex', alignItems: 'center', gap: 18 }}>
				<Btn texto={e.hayCambios ? TEXTOS.guardar : TEXTOS.guardado} tipo="primary" deshabilitado={!e.hayCambios} encima={e.guardarEncima} ancho={300} />
				<span style={{ fontSize: F - 1, color: TEXTO_TENUE }}>{TEXTOS.completos(completos)}</span>
			</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: Y.notaAlPie, width: UTIL, fontSize: F - 3, lineHeight: 1.4, color: TEXTO_TENUE }}>
				{TEXTOS.notaAlPie}
			</div>

			{e.abierto && <Lista fila={e.abierto.fila} criterio={e.abierto.criterio} resaltada={e.abierto.resaltada} marcada={e.marcas[e.abierto.fila][e.abierto.criterio]} />}
		</div>
	);
};

const Tabla: React.FC<{ e: EstadoGrupo }> = ({ e }) => {
	const celda: React.CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', flex: 'none', borderRight: `1px solid ${BORDE}` };

	return (
		<div style={{ position: 'absolute', left: PG.relleno, top: Y.tabla, width: UTIL, border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden' }}>
			<div style={{ display: 'flex', height: PG.cabecera, background: 'rgb(128 128 128 / 8%)', borderBottom: `1px solid ${BORDE}`, fontSize: F - 1, fontWeight: 600 }}>
				<div style={{ ...celda, width: COL.estudiante, padding: '0 16px' }}>{TEXTOS.estudiante}</div>
				{CRITERIOS.map((c) => (
					<div key={c.definicion} style={{ ...celda, width: COL.criterio, padding: '0 14px', gap: 8 }}>
						{c.definicion}
						<span style={{ fontWeight: 400, color: TEXTO_TENUE }}>{c.peso} %</span>
					</div>
				))}
				<div style={{ ...celda, width: COL.nota, justifyContent: 'center', borderRight: 'none' }}>{TEXTOS.nota}</div>
			</div>

			{ESTUDIANTES.map((a, i) => {
				const nota = notaDe(e.marcas[i]);
				return (
					<div
						key={a.nombre}
						style={{
							display: 'flex',
							height: PG.fila,
							borderBottom: i === ESTUDIANTES.length - 1 ? 'none' : `1px solid ${BORDE}`,
							background: a.sinCasilla ? 'rgb(128 128 128 / 7%)' : 'transparent',
						}}
					>
						<div style={{ ...celda, width: COL.estudiante, padding: '0 16px', gap: 12, fontSize: F - 1, color: a.sinCasilla ? TEXTO_TENUE : TEXTO }}>
							<Avatar tipo={a.sexo} variante={i + 7} tam={34} />
							{a.nombre}
						</div>
						{CRITERIOS.map((c, j) => (
							<div key={c.definicion} style={{ ...celda, width: COL.criterio, padding: '0 14px' }}>
								{a.sinCasilla
									? <span style={{ color: TEXTO_TENUE, fontSize: F }}>—</span>
									: <Selector valor={e.marcas[i][j]} abierto={e.abierto?.fila === i && e.abierto.criterio === j} />}
							</div>
						))}
						<div style={{ ...celda, width: COL.nota, justifyContent: 'center', borderRight: 'none', fontSize: F }}>
							{a.sinCasilla || !e.calculadas
								? <span style={{ color: TEXTO_TENUE }}>—</span>
								: nota !== null
									? <strong style={{ fontSize: F + 2 }}>{nota}</strong>
									: <span style={{ color: TEXTO_TENUE, fontSize: F - 2 }}>{TEXTOS.incompleta}</span>}
						</div>
					</div>
				);
			})}
		</div>
	);
};

const Selector: React.FC<{ valor: number | null; abierto: boolean }> = ({ valor, abierto }) => (
	<div
		style={{
			width: COL.criterio - 28,
			height: PG.fila - 18,
			boxSizing: 'border-box',
			border: `1px solid ${abierto ? ACENTO : BORDE}`,
			boxShadow: abierto ? `0 0 0 2px ${ACENTO}22` : 'none',
			borderRadius: 6,
			background: SUPERFICIE,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 10px',
			fontSize: F - 2,
			color: valor === null ? TEXTO_TENUE : TEXTO,
		}}
	>
		{opcion(valor)}
		<Icono cual="flecha" tam={14} color={TEXTO_TENUE} />
	</div>
);

/* La lista abierta del `<select>`: «—» y los cuatro niveles. */
const Lista: React.FC<{ fila: number; criterio: number; resaltada: number | null; marcada: number | null }> = ({ fila, criterio, resaltada, marcada }) => {
	const r0 = rectOpcion(fila, criterio, 0);
	const s = rectSelector(fila, criterio);
	return (
		<div
			style={{
				position: 'absolute',
				left: r0.x,
				top: r0.y,
				width: s.ancho,
				boxSizing: 'border-box',
				background: SUPERFICIE,
				border: `1px solid ${BORDE}`,
				borderRadius: 6,
				boxShadow: '0 10px 28px rgba(15, 28, 52, .18)',
				padding: '2px 0',
				zIndex: 5,
			}}
		>
			{[null, ...NIVELES.map((_, k) => k)].map((n, k) => (
				<div
					key={k}
					style={{
						height: ALTO_OPCION,
						display: 'flex',
						alignItems: 'center',
						padding: '0 12px',
						fontSize: F - 2,
						background: resaltada === k ? ACENTO : 'transparent',
						color: resaltada === k ? '#fff' : TEXTO,
						fontWeight: n === marcada ? 600 : 400,
					}}
				>
					{opcion(n)}
				</div>
			))}
		</div>
	);
};

export { X_NOTA, xCriterio };
