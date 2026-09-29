import React from 'react';

import { Boton, Campo, Selector } from '../montar-el-ano/ant';
import { Corte, type Columna } from '../montar-el-ano/Rejilla';
import { DOCENTES } from '../montar-el-ano/reparto';
import { avatarDe, type Alumno } from '../secretaria/personas';
import {
	ACENTO, BotonesDeEstado, Cabecera, ConCara, En, H2, LETRA, MAIN, Pagina, Pista, TEXTO_TENUE,
	anchoDeBoton, enCascara, rectDeEstado, anchoDeEstados, type Rect,
} from '../secretaria/piezas';
import { Icono } from '../montar-el-ano/ant';
import { CABECERA, FILA, Tabla } from '../secretaria/Tabla';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * PERSONAS ▸ MATRICULAR (`/matriculas`, `paginas/matriculas`). Textos de `matriculas.html` y columnas
 * de `matriculas.ts:212-260`. No sabe de tiempo.
 *
 * Tres bloques: «Ya en 9°B» (los matriculados, con la tira Matr/Asis/Reti/Dese/…), «Del grado
 * anterior, sin matricular en este grupo» (los de 8° del año pasado, con Asis/Matric/…) y «Buscar en
 * todo el sistema». No hay colores por fila: en qué tabla está una fila ya dice si está en el grupo
 * (`matriculas.html:56-60`).
 */

export const GRUPO = { nombre: '9°B', titular: 'herrera' as const };

const HUECO = 16;
export const ANCHO_SELECTOR = 380;

/* Las columnas: fijas las de ancho declarado, y el resto se reparte por `flex` sobre 1112. */
const reparto = (fijas: number, unidades: number) => Math.floor((MAIN.ancho - fijas) / unidades);
const U1 = reparto(56 + 80 + 172, 7);
const U2 = reparto(56 + 80 + 200, 7);

export const COLUMNAS_EN_EL_GRUPO: Columna[] = [
	{ clave: 'detalle', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'no', titulo: '# matrícula', ancho: U1, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: U1 * 2, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: U1 * 2, filtro: true },
	{ clave: 'sexo', titulo: 'Sex', ancho: 80, filtro: true },
	{ clave: 'estado', titulo: 'Estado', ancho: 172, alinear: 'centro' },
	{ clave: 'retirado', titulo: 'Retirado', ancho: U1, filtro: true },
	{ clave: 'matriculado', titulo: 'Matriculado', ancho: MAIN.ancho - 56 - U1 * 6 - 80 - 172, filtro: true },
];

export const COLUMNAS_CANDIDATOS: Columna[] = [
	{ clave: 'detalle', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'no', titulo: '# matrícula', ancho: U2, filtro: true },
	{ clave: 'apellidos', titulo: 'Apellidos', ancho: U2 * 2, filtro: true },
	{ clave: 'nombres', titulo: 'Nombres', ancho: U2 * 2, filtro: true },
	{ clave: 'sexo', titulo: 'Sex', ancho: 80, filtro: true },
	{ clave: 'acciones', titulo: 'Matricular', ancho: 200, alinear: 'centro' },
	{ clave: 'retirado', titulo: 'Retirado', ancho: U2, filtro: true },
	{ clave: 'matriculado', titulo: 'Matriculado', ancho: MAIN.ancho - 56 - U2 * 6 - 80 - 200, filtro: true },
];

export const ESTADOS_GRUPO = ['Matr', 'Asis', 'Reti', 'Dese', '…'];
export const LETRA_ESTADOS = 12;
export const ESTADOS_CANDIDATO = ['Asis', 'Matric', '…'];
export const LETRA_CANDIDATO = 13;

export const ALTO_REJILLA = 360;

export const D = (() => {
	const etiqueta = 40 + HUECO;
	const selector = etiqueta + 26;
	const seccion1 = selector + 32 + HUECO;
	const rejilla1 = seccion1 + 32 + 21 + 4;
	const seccion2 = rejilla1 + ALTO_REJILLA + HUECO;
	const rejilla2 = seccion2 + 32;
	const buscar = rejilla2 + ALTO_REJILLA + HUECO;
	return { etiqueta, selector, seccion1, rejilla1, seccion2, rejilla2, buscar, fin: buscar + 32 + 32 };
})();

const xDe = (columnas: Columna[], clave: string) => {
	let x = 0;
	for (const c of columnas) { if (c.clave === clave) { return { x, ancho: c.ancho }; } x += c.ancho; }
	throw new Error(`Matricular: no hay columna «${clave}».`);
};

/** Un botón de la tira de una fila de candidatos (`i` desde 0), en la cáscara. */
export function rectBotonCandidato(i: number, boton: string, desplazada: number): Rect {
	const c = xDe(COLUMNAS_CANDIDATOS, 'acciones');
	const total = anchoDeEstados(ESTADOS_CANDIDATO, LETRA_CANDIDATO);
	const r = rectDeEstado(ESTADOS_CANDIDATO, boton, LETRA_CANDIDATO);
	return enCascara({ x: c.x + (c.ancho - total) / 2 + r.x, y: D.rejilla2 + CABECERA * 2 + i * FILA + 8, ancho: r.ancho, alto: 26 }, desplazada);
}

/** Un botón de la tira «Estado» de una fila de «Ya en…», en la cáscara. */
export function rectEstadoEnElGrupo(i: number, boton: string, desplazada: number, bajada: number): Rect {
	const c = xDe(COLUMNAS_EN_EL_GRUPO, 'estado');
	const total = anchoDeEstados(ESTADOS_GRUPO, LETRA_ESTADOS, 3);
	const r = rectDeEstado(ESTADOS_GRUPO, boton, LETRA_ESTADOS, 3);
	return enCascara({ x: c.x + (c.ancho - total) / 2 + r.x, y: D.rejilla1 + CABECERA * 2 + i * FILA - bajada + 8, ancho: r.ancho, alto: 26 }, desplazada);
}

export const rectFilaCandidato = (i: number, desplazada: number): Rect =>
	enCascara({ x: 0, y: D.rejilla2 + CABECERA * 2 + i * FILA, ancho: MAIN.ancho, alto: FILA }, desplazada);

/** Una fila visible de «Ya en…», con las filas bajadas `bajada` píxeles dentro de la rejilla. */
export const rectFilaEnElGrupo = (i: number, desplazada: number, bajada: number): Rect =>
	enCascara({ x: 0, y: D.rejilla1 + CABECERA * 2 + i * FILA - bajada, ancho: MAIN.ancho, alto: FILA }, desplazada);

export const rectRejilla = (cual: 1 | 2, desplazada: number): Rect =>
	enCascara({ x: 0, y: cual === 1 ? D.rejilla1 : D.rejilla2, ancho: MAIN.ancho, alto: ALTO_REJILLA }, desplazada);

export const rectSeccion2 = (desplazada: number, filas: number): Rect =>
	enCascara({ x: 0, y: D.seccion2, ancho: MAIN.ancho, alto: D.rejilla2 - D.seccion2 + CABECERA * 2 + filas * FILA }, desplazada);

export const rectSelector = (desplazada: number): Rect =>
	enCascara({ x: 0, y: D.etiqueta, ancho: ANCHO_SELECTOR, alto: D.selector + 32 - D.etiqueta }, desplazada);

/* ── El dibujo ─────────────────────────────────────────────────────────────────────────────── */

export interface FilaMatricula {
	alumno: Alumno;
	fecha?: string;
	encima?: string | null;
	opacidad?: number;
	fondo?: string;
}

export interface EstadoMatricular {
	enElGrupo: FilaMatricula[];
	candidatos: FilaMatricula[];
	bajada1?: number;
	desplazada?: number;
	opacidad?: number;
}

const Detalle: React.FC = () => <Icono cual="idcard" tam={17} color={TEXTO_TENUE} />;

export const PantallaMatricular: React.FC<{ estado: EstadoMatricular }> = ({ estado: e }) => (
	<Pagina alto={D.fin} desplazada={e.desplazada ?? 0} opacidad={e.opacidad ?? 1}>
		<Cabecera titulo="Matricular" botones={[{ texto: 'Crear alumno', icono: 'user-add' }, { texto: 'Recargar', icono: 'reload' }]} />

		<En r={{ x: 0, y: D.etiqueta }}>
			<div style={{ fontSize: LETRA, color: 'rgba(0,0,0,0.88)' }}>Grupo en el cual matricular</div>
		</En>
		<En r={{ x: 0, y: D.selector }}>
			<Selector marcador="Grupo a matricular" valor={GRUPO.nombre} cara={GRUPO.titular} detras={DOCENTES[GRUPO.titular].nombre} ancho={ANCHO_SELECTOR} />
		</En>

		<En r={{ x: 0, y: D.seccion1 }}>
			<H2>Ya en {GRUPO.nombre}</H2>
			<div style={{ height: 8 }} />
			<Pista>Las dos fechas se editan haciendo clic; la de retiro sólo cuando el alumno está retirado o desertado.</Pista>
		</En>
		<En r={{ x: 0, y: D.rejilla1 }}>
			<Tabla
				columnas={COLUMNAS_EN_EL_GRUPO}
				ancho={MAIN.ancho}
				alto={ALTO_REJILLA}
				bajada={e.bajada1 ?? 0}
				filas={e.enElGrupo.map((f) => ({
					clave: String(f.alumno.id),
					opacidad: f.opacidad,
					fondo: f.fondo,
					celdas: {
						detalle: <Detalle />,
						no: f.alumno.matricula,
						apellidos: <ConCara {...avatarDe(f.alumno)} texto={f.alumno.apellidos} />,
						nombres: <Corte>{f.alumno.nombres}</Corte>,
						sexo: f.alumno.sexo,
						estado: <BotonesDeEstado botones={ESTADOS_GRUPO} hundido="Matr" encima={f.encima ?? null} letra={LETRA_ESTADOS} hueco={3} />,
						retirado: '',
						matriculado: f.fecha ?? '2026-01-20',
					},
				}))}
			/>
		</En>

		<En r={{ x: 0, y: D.seccion2 }}>
			<H2>Del grado anterior, sin matricular en este grupo</H2>
		</En>
		<En r={{ x: 0, y: D.rejilla2 }}>
			<Tabla
				columnas={COLUMNAS_CANDIDATOS}
				ancho={MAIN.ancho}
				alto={ALTO_REJILLA}
				filas={e.candidatos.map((f) => ({
					clave: String(f.alumno.id),
					opacidad: f.opacidad,
					celdas: {
						detalle: <Detalle />,
						no: f.alumno.matricula,
						apellidos: <ConCara {...avatarDe(f.alumno)} texto={f.alumno.apellidos} />,
						nombres: <Corte>{f.alumno.nombres}</Corte>,
						sexo: f.alumno.sexo,
						acciones: <BotonesDeEstado botones={ESTADOS_CANDIDATO} encima={f.encima ?? null} letra={LETRA_CANDIDATO} />,
						retirado: '',
						matriculado: '',
					},
				}))}
			/>
		</En>

		<En r={{ x: 0, y: D.buscar }}>
			<H2>Buscar en todo el sistema</H2>
		</En>
		<En r={{ x: 0, y: D.buscar + 32 }}>
			<div style={{ display: 'flex', gap: 8 }}>
				<Campo marcador="Buscar…" ancho={360} />
				<Boton texto="Por nombre" icono="search" ancho={anchoDeBoton('Por nombre', true)} />
				<Boton texto="Por apellido" icono="search" ancho={anchoDeBoton('Por apellido', true)} />
			</div>
		</En>
	</Pagina>
);

export { ACENTO };
