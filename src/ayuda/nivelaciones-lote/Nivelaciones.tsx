import React from 'react';

import { ACENTO, BORDE, PERDIDA_LETRA, SUPERFICIE, TEXTO, TEXTO_TENUE } from '../../notas/tema';
import { Icono } from '../montar-el-ano/ant';
import { FUENTE } from '../tema';
import { COL, INICIAL, INICIAL_TALLER, PG, QUEDA, TEXTOS, UTIL, Y, rectBoton } from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA LISTA DE NIVELACIONES DEL GRUPO (`paginas/nivelaciones/nivelaciones.html`): la barra con la
 * cuenta y «Registrar N nivelaciones», y una tabla con un `<tbody>` por alumno --su nombre en una
 * fila y debajo sus indicadores--. La Inicial va en rojo, que es como la lee el docente en la
 * planilla; nivelada, el par: la vieja tachada y la que quedó.
 */

export interface EstadoNivelaciones {
	/** Lo escrito en Nivelación y Actividad del quiz, y qué campo tiene el foco. */
	nivelacion: string;
	actividad: string;
	foco: 'nivelacion' | 'actividad' | null;
	/** Ya volvió el lote: el quiz enseña 55 tachado y 60, y el borrador se vacía. */
	registrada: boolean;
	botonEncima: boolean;
}

const F = PG.letra;

export const PantallaNivelaciones: React.FC<{ e: EstadoNivelaciones }> = ({ e }) => {
	const escritas = !e.registrada && e.nivelacion !== '' ? 1 : 0;
	return (
		<div style={{ position: 'relative', width: PG.ancho, height: Y.alto, borderRadius: 14, background: SUPERFICIE, boxShadow: '0 24px 64px rgba(15, 28, 52, .16), 0 2px 8px rgba(15, 28, 52, .06)', fontFamily: FUENTE, color: TEXTO }}>
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.titulo, fontSize: 32, fontWeight: 700 }}>{TEXTOS.titulo}</div>
			<div style={{ position: 'absolute', left: PG.relleno, top: Y.pista + 4, fontSize: F - 1, color: TEXTO_TENUE }}>{TEXTOS.pista}</div>

			<div style={{ position: 'absolute', left: PG.relleno, top: Y.barra, width: UTIL, height: PG.barra, display: 'flex', alignItems: 'center', fontSize: F }}>
				{TEXTOS.porNivelar(2)}
				{escritas > 0 && <b style={{ marginLeft: 6 }}>{TEXTOS.escritas(escritas)}</b>}
			</div>
			<Boton texto={TEXTOS.registrar(escritas)} habilitado={escritas > 0} encima={e.botonEncima} />

			<div style={{ position: 'absolute', left: PG.relleno, top: Y.tabla, width: UTIL, border: `1px solid ${BORDE}`, borderRadius: 8, overflow: 'hidden' }}>
				<div style={{ display: 'flex', height: PG.cabecera, background: 'rgb(128 128 128 / 8%)', borderBottom: `1px solid ${BORDE}`, fontSize: F - 1, fontWeight: 600 }}>
					{TEXTOS.columnas.map((t, c) => (
						<div key={t} style={{ width: [COL.indicador, COL.inicial, COL.nivelacion, COL.actividad][c], boxSizing: 'border-box', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: c === 1 || c === 2 ? 'center' : 'flex-start', borderRight: c < 3 ? `1px solid ${BORDE}` : 'none' }}>{t}</div>
					))}
				</div>
				<div style={{ height: PG.alumno, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: 'rgb(128 128 128 / 5%)', borderBottom: `1px solid ${BORDE}`, fontSize: F, fontWeight: 600 }}>
					{TEXTOS.alumno}
					<span style={{ fontSize: F - 4, fontWeight: 600, color: TEXTO_TENUE, background: 'rgba(0,0,0,0.06)', borderRadius: 10, padding: '1px 9px' }}>2</span>
				</div>
				<Fila indicador={TEXTOS.indicadores[0]} inicial={<Perdida n={INICIAL_TALLER} />} nivelacion="" actividad="" foco={null} ultima={false} />
				<Fila
					indicador={TEXTOS.indicadores[1]}
					inicial={e.registrada ? <><s style={{ color: TEXTO_TENUE, marginRight: 10 }}>{INICIAL}</s><Perdida n={QUEDA} /></> : <Perdida n={INICIAL} />}
					nivelacion={e.registrada ? '' : e.nivelacion}
					actividad={e.registrada ? '' : e.actividad}
					foco={e.registrada ? null : e.foco}
					ultima
				/>
			</div>
		</div>
	);
};

/*
 * LA CLASE `perdida` VA SIEMPRE, también sobre la que quedó después de nivelar: en la plantilla es
 * un `<span class="perdida">` sin condición. Por eso el 60 sale en rojo igual que el 55.
 */
const Perdida: React.FC<{ n: number }> = ({ n }) => (
	<span style={{ color: PERDIDA_LETRA, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
);

const Fila: React.FC<{ indicador: string; inicial: React.ReactNode; nivelacion: string; actividad: string; foco: 'nivelacion' | 'actividad' | null; ultima: boolean }> = ({
	indicador, inicial, nivelacion, actividad, foco, ultima,
}) => {
	const celda: React.CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', borderRight: `1px solid ${BORDE}`, padding: '0 14px' };
	return (
		<div style={{ display: 'flex', height: PG.fila, borderBottom: ultima ? 'none' : `1px solid ${BORDE}`, fontSize: F }}>
			<div style={{ ...celda, width: COL.indicador, paddingLeft: 16 }}>{indicador}</div>
			<div style={{ ...celda, width: COL.inicial, justifyContent: 'center', fontSize: F + 1 }}>{inicial}</div>
			<div style={{ ...celda, width: COL.nivelacion }}><Campo valor={nivelacion} foco={foco === 'nivelacion'} derecha /></div>
			<div style={{ ...celda, width: COL.actividad, borderRight: 'none' }}><Campo valor={actividad} marcador={TEXTOS.placeholder} foco={foco === 'actividad'} /></div>
		</div>
	);
};

const Campo: React.FC<{ valor: string; marcador?: string; foco: boolean; derecha?: boolean }> = ({ valor, marcador = '', foco, derecha = false }) => (
	<div
		style={{
			width: '100%',
			height: 42,
			boxSizing: 'border-box',
			border: `1px solid ${foco ? ACENTO : BORDE}`,
			boxShadow: foco ? `0 0 0 3px ${ACENTO}22` : 'none',
			borderRadius: 6,
			display: 'flex',
			alignItems: 'center',
			justifyContent: derecha ? 'flex-end' : 'flex-start',
			padding: '0 12px',
			fontSize: F - 1,
			color: valor ? TEXTO : 'rgba(0,0,0,0.3)',
			whiteSpace: 'pre',
			fontVariantNumeric: 'tabular-nums',
		}}
	>
		{valor || (foco ? '' : marcador)}
		{foco && <span style={{ color: TEXTO }}>|</span>}
	</div>
);

const Boton: React.FC<{ texto: string; habilitado: boolean; encima: boolean }> = ({ texto, habilitado, encima }) => {
	const r = rectBoton();
	return (
		<div
			style={{
				position: 'absolute',
				left: r.x,
				top: r.y,
				width: r.ancho,
				height: r.alto,
				boxSizing: 'border-box',
				borderRadius: 8,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 9,
				fontSize: F - 1,
				border: `1px solid ${habilitado ? (encima ? '#4096ff' : ACENTO) : BORDE}`,
				background: habilitado ? (encima ? '#4096ff' : ACENTO) : 'rgba(0,0,0,0.04)',
				color: habilitado ? '#fff' : 'rgba(0,0,0,0.25)',
			}}
		>
			<Icono cual="check" tam={19} />
			{texto}
		</div>
	);
};
