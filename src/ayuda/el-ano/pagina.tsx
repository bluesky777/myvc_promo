import React from 'react';

import { MEDIDAS } from '../medidas';
import { Boton, Icono, LETRA, PELIGRO, TEXTO, TEXTO_TENUE, type NombreIcono } from '../montar-el-ano/ant';
import { MAIN } from '../montar-el-ano/planoAsignaturas';
import { CABECERA, FILA, Rejilla, altoDeLaRejilla, izquierdaDeColumna, anchoDeColumna, type Columna, type FilaDeRejilla } from '../montar-el-ano/Rejilla';
import type { Rect } from './Aplicacion';
import { Caja, PanelDePagina } from './plan';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * UNA PÁGINA DE CATÁLOGO DE REFERENCIAS: título y botones, la ficha de alta (si está abierta), la
 * pista de la rejilla y la rejilla. Es la forma de Niveles, Grados, Áreas y Materias en app2 (una
 * `myvc-rejilla` que guarda al salir de la celda, con la pista «Haz clic en una celda para
 * editarla. Se guarda al salir.»). EN COORDENADAS DE LA CÁSCARA.
 */

export const PISTA_REJILLA = 'Haz clic en una celda para editarla. Se guarda al salir.';

export interface BotonDePagina { texto: string; icono?: NombreIcono; tipo?: 'default' | 'primary'; ancho: number; encima?: boolean }

export const PG = { cabecera: 40, hueco: 16, pista: 22 };

/** Dónde cae cada bloque con la ficha abierta `t` (0..1) de alto `altoFicha`, y `antes` de otras cosas encima de la rejilla. */
export function disposicionPagina(altoFicha: number, t: number, filas: number, antes = 0) {
	let y = MAIN.y;
	const cabecera: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: PG.cabecera };
	y += PG.cabecera + PG.hueco;
	const ficha: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: altoFicha * t };
	y += (altoFicha + PG.hueco) * t;
	const encima: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: antes };
	y += antes ? antes + PG.hueco : 0;
	const pista: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: PG.pista };
	y += PG.pista + 8;
	const rejilla: Rect = { x: MAIN.x, y, ancho: MAIN.ancho, alto: altoDeLaRejilla(filas) };
	return { cabecera, ficha, encima, pista, rejilla };
}

/** El botón `i` de la cabecera, contando de izquierda a derecha, pegados a la derecha. */
export function rectBotonDePagina(botones: BotonDePagina[], i: number): Rect {
	const derecha = MAIN.x + MAIN.ancho;
	const despues = botones.slice(i + 1).reduce((n, b) => n + b.ancho + 8, 0);
	return { x: derecha - despues - botones[i].ancho, y: MAIN.y + 4, ancho: botones[i].ancho, alto: 32 };
}

/** Unas celdas de la rejilla (filas `i` a `i + n - 1`, columnas `desde` a `hasta`). */
export function rectCeldas(rejilla: Rect, columnas: Columna[], i: number, desde: string, hasta = desde, n = 1): Rect {
	const x = izquierdaDeColumna(columnas, desde);
	const x2 = izquierdaDeColumna(columnas, hasta) + anchoDeColumna(columnas, hasta);
	return { x: rejilla.x + 1 + x, y: rejilla.y + 1 + CABECERA * 2 + i * FILA, ancho: x2 - x, alto: FILA * n };
}

export const PaginaRejilla: React.FC<{
	titulo: string;
	botones: BotonDePagina[];
	altoFicha?: number;
	fichaAbierta?: number;
	ficha?: React.ReactNode;
	/** Lo que va entre la ficha y la pista (el panel «Ordenar» de Materias). */
	antes?: number;
	encima?: React.ReactNode;
	columnas: Columna[];
	filas: FilaDeRejilla[];
	opacidad?: number;
	/** Para el alto de la rejilla: cuántas filas tiene de verdad (las que no caben se desplazan). */
	cuantas?: number;
	/** Cuánto está bajada la página (px de la cáscara). */
	bajada?: number;
}> = ({ titulo, botones, altoFicha = 0, fichaAbierta = 0, ficha, antes = 0, encima, columnas, filas, opacidad = 1, cuantas, bajada = 0 }) => {
	const d = disposicionPagina(altoFicha, fichaAbierta, cuantas ?? filas.length, antes);
	return (
		<PanelDePagina alto={d.rejilla.y + d.rejilla.alto + 40 - MEDIDAS.barra} opacidad={opacidad}>
			<div style={{ position: 'absolute', inset: 0, transform: `translateY(${-bajada}px)` }}>
				<Caja r={d.cabecera} estilo={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontSize: 26, fontWeight: 600, color: TEXTO }}>{titulo}</div>
					<div style={{ display: 'flex', gap: 8 }}>
						{botones.map((b) => <Boton key={b.texto} texto={b.texto} icono={b.icono} tipo={b.tipo} ancho={b.ancho} encima={b.encima} />)}
					</div>
				</Caja>
				{ficha && fichaAbierta > 0.001 && (
					<Caja r={{ ...d.ficha, alto: altoFicha }} estilo={{ opacity: fichaAbierta, transform: `translateY(${(1 - fichaAbierta) * -10}px)` }}>{ficha}</Caja>
				)}
				{antes > 0 && <Caja r={d.encima}>{encima}</Caja>}
				<Caja r={d.pista} estilo={{ fontSize: LETRA - 1, color: TEXTO_TENUE, display: 'flex', alignItems: 'center' }}>{PISTA_REJILLA}</Caja>
				<Caja r={d.rejilla}>
					<Rejilla columnas={columnas} filas={filas} ancho={d.rejilla.ancho} alto={d.rejilla.alto} />
				</Caja>
			</div>
		</PanelDePagina>
	);
};

/** Los dos iconos de fila: editar (azul) y quitar (rojo), en sus celdas de 56. */
export const IconoEditar: React.FC<{ encima?: boolean }> = ({ encima = false }) => <Icono cual="edit" tam={16} color={encima ? '#4096ff' : '#1677ff'} />;
export const IconoQuitar: React.FC<{ encima?: boolean }> = ({ encima = false }) => <Icono cual="aspa" tam={16} color={encima ? '#ff7875' : PELIGRO} />;
