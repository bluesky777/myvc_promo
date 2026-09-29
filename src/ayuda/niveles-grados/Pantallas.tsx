import React from 'react';

import { Boton, Campo, Etiqueta, Ficha, Panel, Selector } from '../montar-el-ano/ant';
import { Corte } from '../montar-el-ano/Rejilla';
import { Caja } from '../el-ano/plan';
import { IconoEditar, IconoQuitar, PaginaRejilla } from '../el-ano/pagina';
import {
	ALTO_FICHA, BOTONES_GRADOS, BOTONES_NIVELES, CAMPOS, COL_GRADOS, COL_NIVELES, GRADOS, NIVELES, TEXTOS, rectCampo,
} from './datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * NIVELES Y GRADOS, dibujados. No saben de tiempo.
 */

export const PantallaNiveles: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => (
	<PaginaRejilla
		titulo={TEXTOS.niveles}
		botones={BOTONES_NIVELES}
		columnas={COL_NIVELES}
		opacidad={opacidad}
		filas={NIVELES.map((n) => ({ clave: n.nombre, celdas: { nombre: n.nombre, abrev: n.abrev, orden: n.orden } }))}
	/>
);

export interface FichaGrado {
	abierta: number;
	nombre: string;
	nivel: string | null;
	activo: 'nombre' | 'nivel' | null;
	cursor: boolean;
	encimaCrear: boolean;
}

export const PantallaGrados: React.FC<{ ficha: FichaGrado; encimaCrearGrado?: boolean; opacidad?: number; conNuevo?: boolean }> = ({
	ficha, encimaCrearGrado = false, opacidad = 1, conNuevo = false,
}) => {
	const lista = conNuevo ? [...GRADOS, { nombre: 'Aceleración', abrev: '', orden: 1, nivel: 'Básica primaria' }] : GRADOS;
	return (
		<PaginaRejilla
			titulo={TEXTOS.grados}
			botones={BOTONES_GRADOS.map((b, i) => (i === 1 ? { ...b, encima: encimaCrearGrado } : b))}
			altoFicha={ALTO_FICHA}
			fichaAbierta={ficha.abierta}
			ficha={<FichaNueva ficha={ficha} />}
			columnas={COL_GRADOS}
			opacidad={opacidad}
			cuantas={lista.length}
			filas={lista.map((g) => ({
				clave: g.nombre,
				celdas: {
					editar: <IconoEditar />,
					quitar: <IconoQuitar />,
					nombre: <Corte>{g.nombre}</Corte>,
					abrev: g.abrev,
					orden: g.orden,
					nivel: <Corte>{g.nivel}</Corte>,
				},
			}))}
		/>
	);
};

const FichaNueva: React.FC<{ ficha: FichaGrado }> = ({ ficha }) => (
	<Ficha titulo={TEXTOS.nuevoGrado} edicion ancho="100%">
		<div style={{ display: 'flex', gap: 16 }}>
			{CAMPOS.map((c) => (
				<div key={c.clave} style={{ width: c.ancho }}>
					<Etiqueta texto={c.etiqueta} obligatorio={c.obligatorio} />
					{c.clave === 'nombre' && <Campo valor={ficha.nombre} foco={ficha.activo === 'nombre'} cursor={ficha.activo === 'nombre' && ficha.cursor} />}
					{c.clave === 'abrev' && <Campo />}
					{c.clave === 'orden' && <Campo valor="1" />}
					{c.clave === 'nivel' && <Selector valor={ficha.nivel} marcador="" abierto={ficha.activo === 'nivel'} />}
				</div>
			))}
		</div>
		<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
			<Boton texto="Crear" tipo="primary" ancho={72} encima={ficha.encimaCrear} />
			<Boton texto="Ocultar" ancho={90} />
		</div>
	</Ficha>
);

/** El desplegable de «Nivel educativo», encima de la rejilla. */
export const DesplegableNivel: React.FC<{ aparece: number; resaltada: number | null; elegida: number | null }> = ({ aparece, resaltada, elegida }) => {
	const c = rectCampo('nivel');
	return (
		<Caja r={{ x: c.x, y: c.y + c.alto + 4, ancho: c.ancho, alto: 150 }}>
			<Panel opciones={NIVELES.map((n) => ({ texto: n.nombre }))} resaltada={resaltada} elegida={elegida} ancho={c.ancho} aparece={aparece} />
		</Caja>
	);
};
