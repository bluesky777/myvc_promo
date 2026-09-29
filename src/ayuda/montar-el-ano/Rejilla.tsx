import React from 'react';

import { BORDE, LETRA, SUPERFICIE, TEXTO } from './ant';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LA REJILLA (`comunes/rejilla`): AG Grid con el tema Quartz, como la pintan Asignaturas y Grupos.
 *
 * LAS MEDIDAS SON LAS SUYAS Y ESTÁN MEDIDAS EN LA APLICACIÓN (`rejilla.ts`, `altoDeFilas`): dos filas
 * de cabecera de 49 --los títulos y, debajo, los buscadores de `floatingFilter`--, filas de 42, y
 * 20 px de propina para la barra horizontal. El alto es `max(55vh, eso con hasta quince filas)`.
 *
 * Y LOS ANCHOS DE COLUMNA TAMBIÉN, porque deciden lo que se ve: con el menú desplegado, en 1440 no
 * caben todas y la rejilla se desplaza de lado. Los días de Asignaturas y la IH de Grupos quedan a
 * la derecha, fuera, y el vídeo que los necesita **desplaza la rejilla**, como hay que hacer allí.
 */

export const CABECERA = 49;
export const FILA = 42;
export const BARRA_H = 20;

/** `max(55vh, 2 cabeceras + min(filas, 15) × 42 + 20)`, con la ventana de 900 de la cáscara. */
export const altoDeLaRejilla = (filas: number) => Math.max(Math.round(900 * 0.55), CABECERA * 2 + Math.min(filas, 15) * FILA + BARRA_H);

export interface Columna {
	clave: string;
	titulo: string;
	ancho: number;
	/** Si lleva buscador en la segunda fila de la cabecera. */
	filtro?: boolean;
	alinear?: 'izquierda' | 'centro' | 'derecha';
}

export interface FilaDeRejilla {
	clave: string;
	celdas: Record<string, React.ReactNode>;
	/** Para las que entran o se van: 0..1. */
	opacidad?: number;
	x?: number;
	/** Fondo de la fila: la que está señalada, o la que acaba de entrar. */
	fondo?: string;
	/** Celdas que se pintan con fondo gris (la de «% del área» bloqueada). */
	grises?: string[];
}

export const anchoTotal = (columnas: Columna[]) => columnas.reduce((n, c) => n + c.ancho, 0);

/** Dónde empieza una columna, contando desde el borde izquierdo de la rejilla y sin desplazar. */
export function izquierdaDeColumna(columnas: Columna[], clave: string): number {
	let x = 0;
	for (const c of columnas) {
		if (c.clave === clave) { return x; }
		x += c.ancho;
	}
	throw new Error(`Rejilla: no hay columna «${clave}».`);
}

export const anchoDeColumna = (columnas: Columna[], clave: string) => {
	const c = columnas.find((x) => x.clave === clave);
	if (!c) { throw new Error(`Rejilla: no hay columna «${clave}».`); }
	return c.ancho;
};

export const Rejilla: React.FC<{
	columnas: Columna[];
	filas: FilaDeRejilla[];
	ancho: number;
	alto: number;
	/** Cuánto está desplazada de lado. */
	desplazada?: number;
}> = ({ columnas, filas, ancho, alto, desplazada = 0 }) => {
	const total = anchoTotal(columnas);
	const sobra = Math.max(0, total - ancho);
	const conBarra = sobra > 0;

	return (
		<div
			style={{
				width: ancho,
				height: alto,
				boxSizing: 'border-box',
				border: `1px solid ${BORDE}`,
				borderRadius: 8,
				background: SUPERFICIE,
				overflow: 'hidden',
				position: 'relative',
				fontSize: LETRA - 0.5,
				color: TEXTO,
			}}
		>
			<div style={{ position: 'absolute', left: -desplazada, top: 0, width: total }}>
				{/* Los títulos. */}
				<div style={{ display: 'flex', height: CABECERA, background: '#f8f8f8', boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{columnas.map((c) => (
						<div
							key={c.clave}
							style={{
								width: c.ancho,
								flex: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: c.alinear === 'centro' ? 'center' : 'flex-start',
								padding: '0 14px',
								boxSizing: 'border-box',
								fontWeight: 600,
								whiteSpace: 'nowrap',
								overflow: 'hidden',
							}}
						>
							{c.titulo}
						</div>
					))}
				</div>

				{/* Los buscadores de columna: una caja vacía donde hay filtro, nada donde no. */}
				<div style={{ display: 'flex', height: CABECERA, background: '#f8f8f8', boxShadow: `inset 0 -1px 0 ${BORDE}` }}>
					{columnas.map((c) => (
						<div key={c.clave} style={{ width: c.ancho, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 10px', boxSizing: 'border-box' }}>
							{c.filtro && <div style={{ width: '100%', height: 28, border: `1px solid ${BORDE}`, borderRadius: 4, background: SUPERFICIE }} />}
						</div>
					))}
				</div>

				{filas.map((f) => (
					<div
						key={f.clave}
						style={{
							display: 'flex',
							height: FILA,
							boxShadow: `inset 0 -1px 0 #eceef1`,
							background: f.fondo ?? 'transparent',
							opacity: f.opacidad ?? 1,
							transform: f.x ? `translateX(${f.x}px)` : undefined,
						}}
					>
						{columnas.map((c) => (
							<div
								key={c.clave}
								style={{
									width: c.ancho,
									flex: 'none',
									display: 'flex',
									alignItems: 'center',
									justifyContent: c.alinear === 'centro' ? 'center' : c.alinear === 'derecha' ? 'flex-end' : 'flex-start',
									padding: c.alinear === 'centro' ? 0 : '0 14px',
									boxSizing: 'border-box',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									background: f.grises?.includes(c.clave) ? 'rgba(0,0,0,0.035)' : 'transparent',
								}}
							>
								{f.celdas[c.clave]}
							</div>
						))}
					</div>
				))}
			</div>

			{filas.length === 0 && (
				/* `noRowsToShow` de `rejilla-textos.ts`: la lista llegó vacía y no hay filtro de columna. */
				<div style={{ position: 'absolute', left: 0, right: 0, top: CABECERA * 2, bottom: BARRA_H, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.45)' }}>
					No hay datos que mostrar.
				</div>
			)}

			{conBarra && (
				<div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: BARRA_H - 4, background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
					<div
						style={{
							position: 'absolute',
							top: 4,
							height: 8,
							borderRadius: 4,
							background: 'rgba(0,0,0,0.28)',
							width: (ancho * ancho) / total,
							left: (desplazada / total) * ancho,
						}}
					/>
				</div>
			)}
		</div>
	);
};

/** Un texto de celda que se corta con puntos suspensivos, como en AG Grid. */
export const Corte: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
	<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color }}>{children}</span>
);
