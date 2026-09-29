import { ALUMNOS as ALUMNOS_PLANILLA } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import { MEDIDAS } from '../medidas';
import { geometriaDeTitularia } from '../mis-asignaturas/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «COMPORTAMIENTO» (`paginas/comportamiento-notas/` de app2), Y DÓNDE CAE.
 *
 *   · se llega por Académico ▸ Mis asignaturas ▸ «Grupos titularía» ▸ «Comportamiento» (sólo el
 *     titular tiene esa fila; también hay «Ir a comportamiento» en Disciplina);
 *   · una ficha por alumno: arriba la nota «Comportamiento» y el bloque «Compromiso familiar»
 *     (Nota, Ausencias) --el nombre del bloque lo pone el colegio--; se guardan solos medio
 *     segundo después de la última tecla («Dato cambiado: …»);
 *   · a la izquierda, «Libro rojo»: cuatro pestañas «Periodo 1…4», **que abren siempre en Periodo 1**
 *     (no en el periodo en curso), con un número que cuenta cuántas de las tres filas tienen algo;
 *     las tres filas se llaman **Convivencia, Académico y Acuerdos** (fijas en app2); el texto se
 *     guarda solo dos segundos después de la última tecla («Cambios guardados»);
 *   · a la derecha, «Frases del boletín».
 *
 * EL CLIP PROMOCIONAL (`src/disciplina/Comportamiento.tsx`) llama «Compromiso» a la tercera
 * columna; app2 la renombró a «Acuerdos» el 22 sep 2026. Aquí va la de app2.
 *
 * LOS ALUMNOS SON LOS DE 9°B de `notas/planilla.ts`; lo escrito, inventado, y coincide con lo que
 * el observador enseña de Sara en su vídeo.
 */

export const GRUPO = { nombre: 'Noveno B', abrev: '9B' };

export const COLUMNAS_DEL_LIBRO = ['Convivencia', 'Académico', 'Acuerdos'];
export const PERIODOS = [1, 2, 3, 4];

export interface Ficha {
	nombre: string;
	sexo: 'mujer' | 'hombre';
	nota: string;
	familiar: { nota: string; ausencias: string };
	libro: Record<number, [string, string, string]>;
	frases: { tipo: string; frase: string }[];
}

const nombre = (i: number) => ALUMNOS_PLANILLA[i].nombre.replace(', ', ' ');

export const FICHAS: Ficha[] = [
	{
		nombre: nombre(0),
		sexo: ALUMNOS_PLANILLA[0].sexo,
		nota: '88',
		familiar: { nota: '90', ausencias: '0' },
		libro: {
			1: ['Buen trato con sus compañeras.', 'Participa en clase con buenas preguntas.', ''],
			2: ['', 'Subió dos puntos el promedio.', ''],
			3: ['', '', ''],
			4: ['', '', ''],
		},
		frases: [{ tipo: 'Fortaleza', frase: 'Lidera el trabajo en equipo con respeto.' }],
	},
	{
		nombre: nombre(1),
		sexo: ALUMNOS_PLANILLA[1].sexo,
		nota: '80',
		familiar: { nota: '85', ausencias: '1' },
		libro: {
			1: ['Mejoró el trato con sus compañeros.', '', 'Cumplió el acuerdo de junio.'],
			2: ['', '', ''],
			3: ['', '', ''],
			4: ['', '', ''],
		},
		frases: [],
	},
];

export const NOTA_NUEVA = '95';
export const LO_QUE_SE_ESCRIBE = 'Resolvió con calma un conflicto en el descanso.';
/** Donde se escribe: periodo 2, Convivencia. */
export const PERIODO_DEL_LIBRO = 2;

export function escritas(f: Ficha, periodo: number, extra = 0): number {
	return (f.libro[periodo] ?? ['', '', '']).filter((t) => t.trim() !== '').length + extra;
}

/* ── «Grupos titularía», debajo de las asignaturas (coordenadas de la CÁSCARA) ─────────────── */
/* Es la de «Mis asignaturas» de hoy (`mis-asignaturas/datos.ts`), que ya la pinta. */

export function botonComportamiento() {
	return geometriaDeTitularia().boton;
}

export function seccionTitularia() {
	const s = geometriaDeTitularia().seccion;
	return { x: s.x - 8, y: s.y - 8, ancho: s.ancho + 16, alto: s.alto + 16 };
}

/* ── La pantalla a pantalla completa (coordenadas del FOTOGRAMA) ────────────────────────────── */

export const P = {
	x: 120,
	y: BANDA.arriba + 6,
	ancho: 1680,
	relleno: 28,
	titulo: 40,
	grupo: 30,
	barra: 64,
	hueco: 16,
	/* La ficha */
	fichaRelleno: 20,
	cabecera: 84,
	entreCabeceraYCuerpo: 14,
	h3: 30,
	pestanas: 42,
	anchoPestana: 150,
	huecoPestanas: 12,
	campo: 56,
	huecoCampo: 8,
	etiquetaCampo: 118,
	huecoColumnas: 24,
	numero: { ancho: 84, alto: 38 },
};

export const Y_FICHA0 = P.y + P.relleno + P.titulo + P.grupo + P.hueco + P.barra + P.hueco;
export const X_FICHA = P.x + P.relleno;
export const ANCHO_FICHA = P.ancho - P.relleno * 2;
const DENTRO = ANCHO_FICHA - P.fichaRelleno * 2;
export const ANCHO_IZQ = ((DENTRO - P.huecoColumnas) * 1.3) / 2.3;
export const ANCHO_DER = DENTRO - P.huecoColumnas - ANCHO_IZQ;

const CUERPO_Y = Y_FICHA0 + P.fichaRelleno + P.cabecera + P.entreCabeceraYCuerpo;
const PESTANAS_Y = CUERPO_Y + P.h3;
const CAMPOS_Y = PESTANAS_Y + P.pestanas + P.huecoPestanas;

export const ALTO_FICHA = P.fichaRelleno * 2 + P.cabecera + P.entreCabeceraYCuerpo + P.h3 + P.pestanas + P.huecoPestanas + P.campo * 3 + P.huecoCampo * 2;

/** La casilla de la nota de Comportamiento de la primera ficha. */
export function casillaNota() {
	return { x: X_FICHA + ANCHO_FICHA - P.fichaRelleno - 420, y: Y_FICHA0 + P.fichaRelleno + 18 + 26, ancho: P.numero.ancho, alto: P.numero.alto };
}

export function pestana(periodo: number) {
	return { x: X_FICHA + P.fichaRelleno + (periodo - 1) * P.anchoPestana, y: PESTANAS_Y, ancho: P.anchoPestana, alto: P.pestanas };
}

export function todasLasPestanas() {
	return { x: X_FICHA + P.fichaRelleno, y: PESTANAS_Y, ancho: P.anchoPestana * 4, alto: P.pestanas };
}

export function campo(c: number) {
	return { x: X_FICHA + P.fichaRelleno + P.etiquetaCampo, y: CAMPOS_Y + c * (P.campo + P.huecoCampo), ancho: ANCHO_IZQ - P.etiquetaCampo, alto: P.campo };
}

export function lasTresFilas() {
	const a = campo(0);
	const c = campo(2);
	return { x: X_FICHA + P.fichaRelleno, y: a.y, ancho: ANCHO_IZQ, alto: c.y + c.alto - a.y };
}

/** El número de la pestaña (el distintivo), a la derecha de «Periodo N». */
export function distintivo(periodo: number) {
	const p = pestana(periodo);
	return { x: p.x + 98, y: p.y + (P.pestanas - 24) / 2, ancho: 24, alto: 24 };
}
