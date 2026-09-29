import type { Rect } from '../el-ano/Aplicacion';
import { disposicionPagina, rectBotonDePagina, rectCeldas, type BotonDePagina } from '../el-ano/pagina';
import { ALTO_CABECERA_FICHA, ALTO_CONTROL, ALTO_ETIQUETA, RELLENO_FICHA } from '../montar-el-ano/ant';
import { MAIN } from '../montar-el-ano/planoAsignaturas';
import type { Columna } from '../montar-el-ano/Rejilla';
import { GRUPOS } from '../montar-el-ano/reparto';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «NIVELES, GRADOS Y GRUPOS»: LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`niveles.html/.ts`, `grados.html/.ts`): los títulos («Niveles
 * educativos», «Grados»), los botones (Niveles sólo tiene «Recargar»: no hay alta ni baja), las
 * columnas, la ficha «Nuevo grado» con sus cuatro campos, el aviso «Elige el nivel educativo: el
 * grado no se puede crear sin él» y «Grado … creado». Grupos es la pantalla ya dibujada de
 * `montar-el-ano/Grupos.tsx`.
 *
 * LO INVENTADO: los nombres de los niveles, las abreviaturas y el grado nuevo. Los grados y los
 * grupos son los de `montar-el-ano/reparto.ts`, para que Grupos diga lo mismo que en sus vídeos.
 */

export const NIVELES = [
	{ nombre: 'Preescolar', abrev: 'PRE', orden: 1 },
	{ nombre: 'Básica primaria', abrev: 'BP', orden: 2 },
	{ nombre: 'Básica secundaria', abrev: 'BS', orden: 3 },
	{ nombre: 'Media', abrev: 'MED', orden: 4 },
];

const nivelDe = (grado: string) =>
	['Prejardín', 'Jardín', 'Transición'].includes(grado) ? 'Preescolar'
		: ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto'].includes(grado) ? 'Básica primaria'
			: ['Décimo', 'Undécimo'].includes(grado) ? 'Media'
				: 'Básica secundaria';

const ABREV: Record<string, string> = {
	Prejardín: 'PJ', Jardín: 'J', Transición: 'T', Primero: '1', Segundo: '2', Tercero: '3', Cuarto: '4', Quinto: '5',
	Sexto: '6', Séptimo: '7', Octavo: '8', Noveno: '9', Décimo: '10', Undécimo: '11',
};

export const GRADOS = GRUPOS.map((g) => g.grado)
	.filter((g, i, xs) => xs.indexOf(g) === i)
	.map((g, i) => ({ nombre: g, abrev: ABREV[g], orden: i + 1, nivel: nivelDe(g) }));

/** El grado que se crea. «Aceleración» es un grado que algunos colegios abren para extraedad. */
export const NUEVO = { nombre: 'Aceleración', nivel: 'Básica primaria' };

/** El grado que se señala para decir que no se borra: tiene grupo (1°A). */
export const CON_GRUPOS = GRADOS.findIndex((g) => g.nombre === 'Primero');
export const CON_GRADOS_Y = CON_GRUPOS;

export const TEXTOS = {
	niveles: 'Niveles educativos',
	grados: 'Grados',
	nuevoGrado: 'Nuevo grado',
	sinNivel: 'Elige el nivel educativo: el grado no se puede crear sin él',
	creado: `Grado ${NUEVO.nombre} creado`,
};

/* ── Las columnas ─────────────────────────────────────────────────────────────────────────── */

export const COL_NIVELES: Columna[] = [
	{ clave: 'nombre', titulo: 'Nombre', ancho: 520, filtro: true },
	{ clave: 'abrev', titulo: 'Abreviatura', ancho: 300, filtro: true },
	{ clave: 'orden', titulo: 'Orden', ancho: 288, filtro: true },
];

export const COL_GRADOS: Columna[] = [
	{ clave: 'editar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'quitar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'nombre', titulo: 'Nombre', ancho: 390, filtro: true },
	{ clave: 'abrev', titulo: 'Abreviatura', ancho: 200, filtro: true },
	{ clave: 'orden', titulo: 'Orden', ancho: 150, filtro: true },
	{ clave: 'nivel', titulo: 'Nivel educativo', ancho: 256, filtro: true },
];

export const BOTONES_NIVELES: BotonDePagina[] = [{ texto: 'Recargar', icono: 'reload', ancho: 116 }];
export const BOTONES_GRADOS: BotonDePagina[] = [
	{ texto: 'Recargar', icono: 'reload', ancho: 116 },
	{ texto: 'Crear grado', icono: 'plus', tipo: 'primary', ancho: 136 },
];

/* ── La ficha de alta: los cuatro campos en una fila, y los botones debajo ─────────────────── */

export const ALTO_FICHA = ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_ETIQUETA + ALTO_CONTROL + 12 + ALTO_CONTROL + RELLENO_FICHA;
export const CAMPOS = [
	{ clave: 'nombre', etiqueta: 'Nombre', obligatorio: true, ancho: 330 },
	{ clave: 'abrev', etiqueta: 'Abreviatura', obligatorio: false, ancho: 170 },
	{ clave: 'orden', etiqueta: 'Orden', obligatorio: false, ancho: 120 },
	{ clave: 'nivel', etiqueta: 'Nivel educativo', obligatorio: true, ancho: 330 },
] as const;

export function rectCampo(clave: string): Rect {
	const f = disposicionPagina(ALTO_FICHA, 1, GRADOS.length).ficha;
	let x = f.x + RELLENO_FICHA + 1;
	for (const c of CAMPOS) {
		if (c.clave === clave) { return { x, y: f.y + ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_ETIQUETA, ancho: c.ancho, alto: ALTO_CONTROL }; }
		x += c.ancho + 16;
	}
	throw new Error(`Grados: no hay campo «${clave}».`);
}

export function rectBotonFicha(cual: 'crear' | 'ocultar'): Rect {
	const f = disposicionPagina(ALTO_FICHA, 1, GRADOS.length).ficha;
	const y = f.y + ALTO_CABECERA_FICHA + RELLENO_FICHA + ALTO_ETIQUETA + ALTO_CONTROL + 12;
	return cual === 'crear' ? { x: f.x + RELLENO_FICHA + 1, y, ancho: 72, alto: 32 } : { x: f.x + RELLENO_FICHA + 1 + 80, y, ancho: 90, alto: 32 };
}

export function rectOpcionNivel(i: number): Rect {
	const c = rectCampo('nivel');
	return { x: c.x + 4, y: c.y + c.alto + 8 + i * 34, ancho: c.ancho - 8, alto: 34 };
}

export const rectCrearGrado = () => rectBotonDePagina(BOTONES_GRADOS, 1);

export const rejillaNiveles = () => disposicionPagina(0, 0, NIVELES.length).rejilla;
export const rejillaGrados = (ficha: number) => disposicionPagina(ALTO_FICHA, ficha, GRADOS.length).rejilla;
export const celdasGrados = (ficha: number, i: number, desde: string, hasta?: string, n?: number) => rectCeldas(rejillaGrados(ficha), COL_GRADOS, i, desde, hasta, n);
export const celdasNiveles = (i: number, desde: string, hasta?: string, n?: number) => rectCeldas(rejillaNiveles(), COL_NIVELES, i, desde, hasta, n);

export { MAIN };
