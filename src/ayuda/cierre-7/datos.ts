import { ALUMNOS } from '../../notas/planilla';
import { MEDIDAS } from '../medidas';
import { PROMOCION_9B } from '../cierre-6/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL ACTA DE EVALUACIÓN Y PROMOCIÓN (`/informes/acta-evaluacion-promocion`): la pantalla con sus
 * opciones de impresión, el encabezado del acta con el aviso de descuadre, y la hoja de 9°B.
 *
 * LO QUE ESTE VÍDEO CORRIGE DEL CATÁLOGO: «tarda minuto y medio» **no es el acta**. El acta es una
 * sola llamada y abre en seguida (`acta-evaluacion.ts`); lo que tarda es la «Hoja académica por
 * grupo», que va apagada por defecto y trae las notas del año con una llamada por grupo, de unos
 * 8 s cada una: «Con trece grupos es casi minuto y medio». Eso es lo que el vídeo enseña, con el
 * ritmo de la primera llamada entero y un corte dicho para las otras doce.
 *
 * LOS DATOS DE 9°B SALEN DEL VÍDEO 6: la columna «Promovido» del listado dice «Sí» o «Pendiente»
 * según la decisión de la hoja de promovidos, y el cuadro las cuenta.
 */

export const ACTA_TEXTOS = {
	h1: 'Acta de evaluación y promoción 2026',
	opcionesTitulo: 'Qué incluir al imprimir',
	casillas: [
		{ texto: 'Listado de alumnos por grupo', puesta: true },
		{ texto: 'Hoja académica por grupo (qué queda debiendo cada alumno)', puesta: false },
		{ texto: 'Cuadro de movimiento y promoción', puesta: true },
		{ texto: 'Movimiento por periodo', puesta: false },
		{ texto: 'Causas de retiro', puesta: false },
		{ texto: 'Perfil del grupo', puesta: false },
		{ texto: 'Consolidado institucional', puesta: true },
		{ texto: 'Firmas de la comisión', puesta: true },
	],
	pista: 'Lo que se ve en pantalla es lo que sale impreso.',
	traer: 'Traer las columnas académicas',
	trayendo: 'Trayendo…',
	volver: 'Volver a traer',
	descuadreTitulo: 'Grupos con cifras que no cuadran',
	descuadreGrupos: '10°A',
};

export const LA_ACADEMICA = 1;
export const GRUPOS = 13;
/** Unos 8 segundos por llamada (7,1 · 8,7 · 8,4 medidos, según el comentario de `acta-evaluacion.ts`). */
export const SEGUNDOS_POR_GRUPO = 8;

export const AC = {
	lados: 28,
	arriba: 18,
	mandos: 56,
	pad: 18,
	opTitulo: 30,
	casilla: 34,
	pista: 30,
	academico: 50,
	trasOpciones: 18,
};

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;
export const ANCHO_UTIL = ANCHO_CONTENIDO - AC.lados * 2;
const COL = (ANCHO_UTIL - AC.pad * 2) / 2;
const Y_OPCIONES = AC.arriba + AC.mandos;
const Y_CASILLAS = Y_OPCIONES + AC.pad + AC.opTitulo;

export function rectanguloDeCasilla(i: number) {
	return { x: AC.lados + AC.pad + (i % 2) * COL, y: Y_CASILLAS + Math.floor(i / 2) * AC.casilla, ancho: COL - 10, alto: AC.casilla };
}

export const ALTO_OPCIONES = (conAcademico: boolean) => AC.pad * 2 + AC.opTitulo + AC.casilla * 4 + AC.pista + (conAcademico ? AC.academico : 0);

export function rectanguloDeOpciones(conAcademico: boolean) {
	return { x: AC.lados, y: Y_OPCIONES, ancho: ANCHO_UTIL, alto: ALTO_OPCIONES(conAcademico) };
}

export const ANCHO_TRAER = 330;
export function rectanguloDeTraer() {
	return { x: AC.lados + AC.pad, y: Y_CASILLAS + AC.casilla * 4 + AC.pista + 4, ancho: ANCHO_TRAER, alto: 40 };
}

/** El encabezado del acta, en pantalla, debajo de las opciones. */
export const Y_PAPEL = (conAcademico: boolean) => Y_OPCIONES + ALTO_OPCIONES(conAcademico) + AC.trasOpciones;
export const PAPEL_EN_PANTALLA = { pad: 26, titulos: 116, preambulo: 96, aviso: 70 };

export function rectanguloDelDescuadre(conAcademico: boolean) {
	const p = PAPEL_EN_PANTALLA;
	return { x: AC.lados + p.pad, y: Y_PAPEL(conAcademico) + p.pad + p.titulos + p.preambulo, ancho: ANCHO_UTIL - p.pad * 2, alto: p.aviso };
}

export const enLaCascara = (r: { x: number; y: number; ancho: number; alto: number }) => ({ ...r, x: r.x + MEDIDAS.menu, y: r.y + MEDIDAS.barra });

/* ── La hoja de 9°B ───────────────────────────────────────────────────────────────────────── */

export const COLUMNAS_LISTADO = [
	'No', 'Alumnos', 'Nro matrícula', 'Sexo', 'Edad', 'Ingreso', 'Retiro', 'Deserción', 'Causa de retiro', 'Estrato',
	'¿Finalizó año?', 'Promedio %', 'Promovido', 'Años en la institución', 'Religión',
];
export const ANCHOS_LISTADO = [24, 186, 58, 34, 34, 64, 44, 56, 64, 44, 58, 56, 64, 72, 78];
export const PROMOVIDO = COLUMNAS_LISTADO.indexOf('Promovido');

const SEXO = ['F', 'M', 'F', 'M', 'F', 'M'];
const EDAD = [14, 15, 14, 15, 14, 14];
const ESTRATO = [3, 2, 3, 2, 2, 3];
const ANOS = [8, 3, 6, 5, 2, 7];

export const LISTADO_9B = ALUMNOS.map((a, i) => ({
	celdas: [
		String(i + 1),
		a.nombre,
		String(2026180 + i * 7),
		SEXO[i],
		String(EDAD[i]),
		'20/01/2026',
		'',
		'',
		'',
		String(ESTRATO[i]),
		'Sí',
		PROMOCION_9B[i].prom,
		PROMOCION_9B[i].decision === 'Promovido' ? 'Sí' : 'Pendiente',
		String(ANOS[i]),
		'',
	],
}));

const cuenta = (f: (i: number) => boolean) => {
	let m = 0; let fe = 0;
	ALUMNOS.forEach((_, i) => { if (f(i)) { if (SEXO[i] === 'M') { m++; } else { fe++; } } });
	return { total: m + fe, m, f: fe };
};

const promovido = (i: number) => PROMOCION_9B[i].decision === 'Promovido';
const pendiente = (i: number) => PROMOCION_9B[i].decision === 'Promoción pendiente';
const nadie = () => false;

export interface FilaCuadro { etiqueta: string; c: { total: number; m: number; f: number }; fuerte?: boolean }

/** El cuadro de promoción de 9°B: las filas de aviso sólo salen si su cuenta pasa de 0 (`acta-cuadro.ts`). */
export const CUADRO_PROMOCION_9B: FilaCuadro[] = [
	{ etiqueta: 'Promovidos con cero (0) asignaturas pendientes', c: cuenta(promovido) },
	{ etiqueta: 'Promovidos con una (1) asignatura pendiente', c: cuenta(nadie) },
	{ etiqueta: 'Total estudiantes PROMOVIDOS', c: cuenta(promovido), fuerte: true },
	{ etiqueta: 'No promovidos con dos (2) asignaturas pendientes', c: cuenta(nadie) },
	{ etiqueta: 'No promovidos con tres (3) asignaturas pendientes', c: cuenta(nadie) },
	{ etiqueta: 'No promovidos con cuatro (4) o más asignaturas pendientes', c: cuenta(nadie) },
	{ etiqueta: 'Total estudiantes NO PROMOVIDOS', c: cuenta(nadie), fuerte: true },
	{ etiqueta: 'Estudiantes con PROMOCIÓN PENDIENTE', c: cuenta(pendiente), fuerte: true },
];

const todos = () => true;
export const CUADRO_MOVIMIENTO_9B: FilaCuadro[] = [
	{ etiqueta: 'Total estudiantes que iniciaron el año escolar', c: cuenta(todos) },
	{ etiqueta: 'Estudiantes que ingresaron durante el año escolar', c: cuenta(nadie) },
	{ etiqueta: 'Estudiantes retirados (retiraron documentación)', c: cuenta(nadie) },
	{ etiqueta: 'Estudiantes desertores (no retiraron documentación)', c: cuenta(nadie) },
	{ etiqueta: 'Estudiantes que terminaron el año escolar', c: cuenta(todos), fuerte: true },
];

export const HOJA_ACTA = { ancho: 980, alto: 740 };

/** Las medidas de la hoja que el foco necesita. Coordenadas de la hoja. */
export const HA = { pad: 22, membrete: 56, titulo: 30, cab: 34, fila: 24, hueco: 22, tituloCuadro: 28, cabCuadro: 22, filaCuadro: 21, entreCuadros: 10 };
export const Y_LISTADO = HA.pad + HA.membrete + 12 + HA.titulo;
export const Y_CUADRO = Y_LISTADO + HA.cab + HA.fila * LISTADO_9B.length + HA.hueco;

/** Los dos acercamientos: el listado, y el cuadro. */
export const CERCA_LISTADO = { y: Y_LISTADO - 50, alto: HA.cab + HA.fila * 6 + 80 };
/** El cuadro de promoción, el segundo: debajo del de movimiento (cinco filas). */
export const Y_PROMOCION = Y_CUADRO + HA.tituloCuadro + HA.cabCuadro + HA.filaCuadro * 5 + HA.entreCuadros + HA.tituloCuadro;
export const CERCA_CUADRO = { y: Y_PROMOCION - 30, alto: HA.cabCuadro + HA.filaCuadro * 8 + 60 };
