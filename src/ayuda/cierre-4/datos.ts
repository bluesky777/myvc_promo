import { ALUMNOS } from '../../notas/planilla';
import { ALMENDROS, COLEGIO, nombreDe } from '../colegio';
import { DEFINITIVAS, LA_RECUPERADA } from '../cierre-1/datos';
import { INICIAL, QUEDA, VALENTINA } from '../cierre-3/datos';
import { MANDOS } from '../BarraDeHoy';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «SACAR LOS BOLETINES DEL PERIODO», Y DÓNDE CAE CADA COSA.
 *
 * LA DUDA, CORREGIDA CONTRA EL CÓDIGO. El catálogo decía «el periodo no se elige: es el que el
 * colegio tiene abierto». No es exacto: Informes no pregunta el periodo, **sale el de la sesión**
 * (`catalogo-informes.ts:1701`, `sesion.usuario().numero_periodo`), que es el que la persona tiene
 * puesto en el selector de arriba --«2026 · Periodo 2»--. Casi siempre coincide con el abierto,
 * pero quien lo cambió arriba saca el boletín de otro periodo. El vídeo dice lo verdadero.
 *
 * EL MISMO MOMENTO QUE LOS VÍDEOS 1-3: 9°B, periodo 2 cerrado y nivelado. La hoja es la de
 * Valentina, porque es la que lleva la nivelación del vídeo 3: Matemáticas sale 58 tachado y 60, y
 * el quiz 55 tachado y 60. Sus definitivas del periodo 1 (60, recuperada y a mano) y del 2 salen de
 * `cierre-1/datos.ts`; sus faltas (A:3 / T:1) de la planilla.
 *
 * QUIÉN LA SACA: coordinación (menú de rector). Con un usuario que no es docente la hoja lleva el
 * membrete oficial, las firmas y la leyenda; a un docente director de grupo le sale sin ellos
 * (`oficial = !esDocente(usuario)`), y eso no se cuenta aquí.
 */

export { COLEGIO };

export const GRUPO = '9°B';
export const GRUPO_ID = 57;
export const PERIODO = 2;

/* ── El catálogo de Informes, en coordenadas del contenido ─────────────────────────────────── */

export const ANCHO_CONTENIDO = MEDIDAS.ancho - MEDIDAS.menu;

export const INF = {
	lados: 28,
	arriba: 20,
	izquierda: 772,
	hueco: 20,
	buscador: 150,
	pastillas: 38,
	familia: 54,
	ficha: 96,
	huecoFicha: 14,
};

export const TEXTOS_INF = {
	titulo: 'Informes',
	busqueda: '¿Qué necesitas imprimir? Boletines, certificado, planilla, quién falta…',
	grupos: 13, // los mismos 13 que el cierre 6 y el 7
	pastillas: [['Todo', 32], ['Para la familia', 4], ['Para el aula', 6], ['Cómo va el grupo', 5], ['Cifras y tendencias', 4], ['Quién vino', 3]] as [string, number][],
	familia: 'Para la familia',
	familiaPara: 'Lo que sale del colegio en un sobre.',
	fichas: [
		{ nombre: 'Boletín del periodo', para: 'El detallado, con la gráfica. Es el que recibe la familia al cerrar el periodo.' },
		{ nombre: 'Boletín con definitivas por periodo', para: 'Corto, con la columna de cada periodo. No lleva la leyenda del pie.' },
		{ nombre: 'Boletín descriptivo de preescolar', para: 'Sin gráfica y sin rojos: valoraciones en palabras.' },
	],
	siguienteFamilia: 'Para el aula',
	vacio: 'Elige un informe y aquí aparecen sólo los datos que ese papel necesita.',
	paraQuien: '¿Para quién?',
	destinatarios: ['Todo el grupo', 'Los alumnos que marque'],
	grupo: 'Grupo',
	grupoPlaceholder: 'Elige un grupo',
	grupos_lista: ['8°A', '8°B', '9°A', '9°B', '10°A'],
	comoSale: 'Cómo sale este informe',
	comoSaleCuenta: '5 de 7',
	laHoja: 'La hoja',
	cargar: 'Cargar el informe',
	elige: 'Elige un grupo',
	pila: 'Añadir a la pila de impresión',
};

export const COLUMNA_DERECHA = INF.lados + INF.izquierda + INF.hueco;
export const ANCHO_CONFIG = ANCHO_CONTENIDO - COLUMNA_DERECHA - INF.lados;
export const ARRIBA_PASTILLAS = INF.arriba + INF.buscador + 14;
export const ARRIBA_FAMILIA = ARRIBA_PASTILLAS + INF.pastillas + 18;
export const ARRIBA_REJILLA = ARRIBA_FAMILIA + INF.familia;
export const ANCHO_FICHA = (INF.izquierda - INF.huecoFicha) / 2;

export function rectDeLaFicha(i: number) {
	return {
		x: INF.lados + (i % 2) * (ANCHO_FICHA + INF.huecoFicha),
		y: ARRIBA_REJILLA + Math.floor(i / 2) * (INF.ficha + INF.huecoFicha),
		ancho: ANCHO_FICHA,
		alto: INF.ficha,
	};
}

/** La línea «Periodo 2 abierto · 13 grupos», debajo del buscador. */
export function rectDelContexto() {
	return { x: INF.lados + 6, y: INF.arriba + 117, ancho: 270, alto: 32 };
}

/* El configurador: cada cosa a una altura fija, para que el puntero sepa a dónde ir. */
export const CFG = {
	relleno: 20,
	cabeza: 110,
	etiqueta: 26,
	segmento: 50,
	select: 42,
	plegable: 40,
	boton: 44,
};

export const EN_CFG = (() => {
	let y = INF.arriba + CFG.relleno;
	const cabeza = y;
	y += CFG.cabeza;
	const paraQuien = y;
	y += CFG.etiqueta + 6 + CFG.segmento + 16;
	const grupo = y;
	y += CFG.etiqueta + 6;
	const select = y;
	y += CFG.select + 16;
	const comoSale = y;
	y += CFG.plegable;
	const laHoja = y;
	y += CFG.plegable + 18;
	const cargar = y;
	y += CFG.boton + 10;
	const pila = y;
	y += CFG.boton + CFG.relleno;
	return { cabeza, paraQuien, grupo, select, comoSale, laHoja, cargar, pila, fin: y };
})();

export function rectDelSelect() {
	return { x: COLUMNA_DERECHA + CFG.relleno, y: EN_CFG.select, ancho: ANCHO_CONFIG - CFG.relleno * 2, alto: CFG.select };
}
export function rectDeLaOpcion(i: number) {
	const s = rectDelSelect();
	return { x: s.x, y: s.y + s.alto + 4 + 4 + i * 36, ancho: s.ancho, alto: 36 };
}
export function rectDeCargar() {
	return { x: COLUMNA_DERECHA + CFG.relleno, y: EN_CFG.cargar, ancho: ANCHO_CONFIG - CFG.relleno * 2, alto: CFG.boton };
}
export function rectDelConfigurador() {
	return { x: COLUMNA_DERECHA, y: INF.arriba, ancho: ANCHO_CONFIG, alto: EN_CFG.fin - INF.arriba };
}

/* ── El visor, después de «Cargar el informe» ──────────────────────────────────────────────── */

export const VISOR = {
	tira: 50,
	cabecera: 76,
	/** Los dos botones de icono, a la derecha de la cabecera: recargar e imprimir. */
	icono: 40,
};

export function rectDeImprimir() {
	return {
		x: ANCHO_CONTENIDO - INF.lados - VISOR.icono,
		y: INF.arriba + VISOR.tira + 12 + (VISOR.cabecera - VISOR.icono) / 2,
		ancho: VISOR.icono,
		alto: VISOR.icono,
	};
}

/** La barra de arriba: «2026 · Periodo 2». Sale del mismo número con el que `BarraDeHoy` lo dibuja. */
export const SELECTOR_DE_LA_BARRA = MANDOS.selector;

/* ── El boletín tipo 1 de Valentina ───────────────────────────────────────────────────────── */

export const HOJA = { ancho: 740, alto: 980 };

export interface Subunidad { texto: string; porc: number; nota: number; original?: number }
export interface Materia {
	materia: string;
	profesor: string;
	a: number;
	t: number;
	nota: number;
	original?: number;
	per: (number | null)[];
	perMarcas?: string[][];
	def: number;
	unidad: { texto: string; porc: number; nota: number };
	subunidades: Subunidad[];
	area?: string;
}

const val = ALUMNOS[VALENTINA];
const defs = DEFINITIVAS[LA_RECUPERADA].periodos;

/** Las bandas de la escala del colegio: las mismas que la leyenda de competencias. */
export const BANDAS: [string, number, number][] = [['BAJO', 0, 59], ['BÁSICO', 60, 79], ['ALTO', 80, 94], ['SUPERIOR', 95, 100]];
export function banda(n: number): string {
	return BANDAS.find(([, a, b]) => n >= a && n <= b)![0];
}

const MATE_P1 = defs[0].final!;
/** La definitiva del periodo 2 antes de nivelar (la de «Definitivas»: 58) y después (60). */
const MATE_ANTES = defs[1].final!;
const MATE_DESPUES = Math.round((val.notas[0]! + QUEDA + val.notas[2]!) / 3);

export const MATERIAS: Materia[] = [
	{
		materia: 'Matemáticas',
		profesor: 'Ana María Herrera Lugo',
		a: val.ausencias,
		t: val.tardanzas,
		nota: MATE_DESPUES,
		original: MATE_ANTES,
		per: [MATE_P1, MATE_DESPUES, null, null],
		perMarcas: [['R', 'M'], [], [], []],
		def: Math.round((MATE_P1 + MATE_DESPUES) / 2),
		unidad: { texto: 'Resuelve problemas con ecuaciones lineales', porc: 100, nota: MATE_DESPUES },
		subunidades: [
			{ texto: 'Resuelve ecuaciones lineales con una incógnita', porc: 33, nota: val.notas[0]! },
			{ texto: 'Plantea ecuaciones a partir de un problema', porc: 33, nota: QUEDA, original: INICIAL },
			{ texto: 'Interpreta la solución de un sistema de ecuaciones', porc: 34, nota: val.notas[2]! },
		],
	},
	{
		materia: 'Ciencias Naturales', profesor: 'Carlos Alberto Muñoz Rendón', a: 1, t: 0, nota: 84, per: [80, 84, null, null], def: 82,
		unidad: { texto: 'Relaciona la estructura de la célula con sus funciones', porc: 100, nota: 84 },
		subunidades: [
			{ texto: 'Explica el transporte a través de la membrana', porc: 50, nota: 82 },
			{ texto: 'Compara la célula animal y la vegetal', porc: 50, nota: 86 },
		],
	},
	{
		area: 'HUMANIDADES',
		materia: 'Lengua Castellana', profesor: 'Lucía Fernanda Arango Vélez', a: 2, t: 1, nota: 76, per: [74, 76, null, null], def: 75,
		unidad: { texto: 'Produce textos argumentativos', porc: 100, nota: 76 },
		subunidades: [
			{ texto: 'Sostiene una tesis con argumentos', porc: 50, nota: 74 },
			{ texto: 'Revisa la coherencia de su escrito', porc: 50, nota: 78 },
		],
	},
	{
		area: 'HUMANIDADES',
		materia: 'Inglés', profesor: 'Diego Armando Salazar Pinto', a: 0, t: 0, nota: 88, per: [86, 88, null, null], def: 87,
		unidad: { texto: 'Describe experiencias pasadas', porc: 100, nota: 88 },
		subunidades: [
			{ texto: 'Usa el pasado simple en textos cortos', porc: 50, nota: 90 },
			{ texto: 'Comprende relatos orales sencillos', porc: 50, nota: 86 },
		],
	},
	{
		materia: 'Ciencias Sociales', profesor: 'Marta Cecilia Quintero Gil', a: 1, t: 1, nota: 72, per: [70, 72, null, null], def: 71,
		unidad: { texto: 'Analiza procesos de independencia en América', porc: 100, nota: 72 },
		subunidades: [
			{ texto: 'Ubica en el tiempo los hechos principales', porc: 50, nota: 70 },
			{ texto: 'Explica causas y consecuencias', porc: 50, nota: 74 },
		],
	},
	{
		materia: 'Educación Física', profesor: 'Hernán Darío Cárdenas Ríos', a: 0, t: 0, nota: 96, per: [94, 96, null, null], def: 95,
		unidad: { texto: 'Mejora su condición física', porc: 100, nota: 96 },
		subunidades: [
			{ texto: 'Sigue un plan de resistencia', porc: 50, nota: 95 },
			{ texto: 'Trabaja en equipo en juegos de conjunto', porc: 50, nota: 97 },
		],
	},
];

export const ALUMNO = {
	nombre: 'ESCOBAR LOZANO VALENTINA',
	lomo: 'Escobar Lozano Valentina',
	titular: 'Ana María Herrera Lugo',
	rector: nombreDe(ALMENDROS.rector),
	puntaje: (() => {
		const p = Math.round(MATERIAS.reduce((s, m) => s + m.nota, 0) / MATERIAS.length);
		return `Puntaje: ${p} ${banda(p)} - Puesto: 5/${ALUMNOS.length}`;
	})(),
	tituloHoja: `BOLETIN PERIODO ${PERIODO} - 2026`,
	comportamiento: { desempenio: 'ALTO', nota: 86 },
	faltas: {
		tardeInstitucion: 1,
		ausenciasEntrada: 0,
		tardanzasClases: MATERIAS.reduce((s, m) => s + m.t, 0),
		ausenciasClases: MATERIAS.reduce((s, m) => s + m.a, 0),
	},
};

export const LEYENDA_NIVELADA =
	'El número tachado es la valoración inicial del periodo; la que va al lado es la que quedó después de la nivelación, según la regla del colegio.';

/*
 * LAS ALTURAS DE LA HOJA, para los acercamientos. Se fijan en el dibujo (cada bloque lleva su alto)
 * y se suman aquí: el plano corto de Matemáticas y el del pie salen de estos números.
 */
export const H = {
	arriba: 22,
	membrete: 78,
	franja: 50,
	areaTitulo: 18,
	materiaCabeza: 20,
	tira: 16,
	unidad: 16,
	subunidad: 15,
	huecoMateria: 9,
	comportamiento: 74,
	leyendaNivelada: 30,
};

export function altoDeMateria(m: Materia) {
	return H.materiaCabeza + H.tira + H.unidad + m.subunidades.length * H.subunidad + H.huecoMateria;
}

export const ARRIBA_MATERIAS = H.arriba + H.membrete + H.franja;

/** Dónde empieza la materia i (su cabecera), con los títulos de área que tenga delante. */
export function arribaDeMateria(i: number): number {
	let y = ARRIBA_MATERIAS;
	for (let k = 0; k <= i; k++) {
		const m = MATERIAS[k];
		if (m.area && (k === 0 || MATERIAS[k - 1].area !== m.area)) { y += H.areaTitulo; }
		if (k < i) { y += altoDeMateria(m); }
	}
	return y;
}

export const ARRIBA_COMPORTAMIENTO = arribaDeMateria(MATERIAS.length - 1) + altoDeMateria(MATERIAS[MATERIAS.length - 1]) + 4;
export const ARRIBA_LEYENDA = ARRIBA_COMPORTAMIENTO + H.comportamiento + 6;
export const ARRIBA_PIE = ARRIBA_LEYENDA + H.leyendaNivelada + 8;

/** Los dos planos cortos: Matemáticas entera, y el final de la hoja con la leyenda y las firmas. */
export const FRANJA_MATEMATICAS = { y: ARRIBA_MATERIAS - 50, alto: altoDeMateria(MATERIAS[0]) + 70 };
export const FRANJA_PIE = { y: ARRIBA_COMPORTAMIENTO - 10, alto: HOJA.alto - ARRIBA_COMPORTAMIENTO - 6 };
