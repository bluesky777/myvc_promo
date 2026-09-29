import { VOCABULARIO } from '../../comunes/vocabulario';
import { MEDIDAS } from '../medidas';
import { ASIGNATURAS } from '../planilla/asignaturas';
import { MIGAS_ALTO, Miga, Rect } from '../moverse/comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «MIS ASIGNATURAS» COMO ES HOY EN app2, Y DÓNDE CAE CADA COSA.
 *
 * Sacada de `paginas/mis-asignaturas/mis-asignaturas.html` y de la fila compartida
 * `comunes/fila-asignatura/` (html, scss y ts). Es la de TODOS los vídeos desde el 2026-09-28:
 * `planilla/MisAsignaturas.tsx` la envuelve para los que sólo pasan por ella. Lo que la distinguía
 * del dibujo viejo:
 *
 *   - el bloque del grupo es una franja de lado a lado de la fila, no un cuadrado dentro;
 *   - el grupo va DEBAJO de la materia, primero en la línea de datos, con el icono de equipo;
 *   - el primer botón es el de las unidades con la palabra del colegio («Logros») y es el ÚNICO
 *     azul; Planilla, Definitivas y Rúbricas van apagados (`boton-tenue`), y detrás «Cerrar»;
 *   - **LA PLANEACIÓN INCOMPLETA SE VE**: el bloque del grupo lleva un marco rojo por dentro
 *     (`fila--incompleta`, scss:81) y la línea de datos dice qué falta en etiquetas ámbar
 *     (`fila__aviso`). Es la duda que mata el vídeo `mis-asignaturas`.
 *
 * LA CONDICIÓN DEL MARCO ROJO (`fila-asignatura.ts:158-165`, copiada de la vieja):
 *
 *     hay unidades  Y  suman 100  Y  no hay subunidades mal repartidas  Y  no faltan notas
 *
 * Si algo de eso falla, marco rojo. Las etiquetas son las banderas que manda el servidor, una a una.
 *
 * LAS MISMAS CUATRO ASIGNATURAS Y LOS MISMOS COLORES que la planilla y la portada
 * (`planilla/datos.ts`): 9°B es la que se califica en esos vídeos y está completa. Las incompletas
 * son 9°A (sobra porcentaje y un Logro tiene los Indicadores mal repartidos: es la que arregla
 * `unidades-100`) y 10°A, que todavía no tiene Logros.
 */

const U = VOCABULARIO.unidades;
const S = VOCABULARIO.subunidades;

export interface FilaAsignatura {
	materia: string;
	grupo: string;
	sigla: string;
	color: string;
	/** `nombre_grupo`: lo que sale con el icono de equipo. */
	nombreGrupo: string;
	ih: number;
	/** Cuántas unidades («Logros») tiene en el periodo. */
	logros: number;
	/** Las banderas del servidor, ya en palabras de pantalla. */
	avisos: string[];
}

const de = (materia: string, grupo: string) => ASIGNATURAS.find((a) => a.materia === materia && a.grupo === grupo)!;

/** Los textos de las etiquetas, tal cual (`fila-asignatura.html:48-65`). */
export const AVISOS = {
	sinLogros: `Sin ${U} en este periodo`,
	sinSumar: `${U} sin sumar 100`,
	/* `genero_subunidad` 'M' --«el Indicador»-- da «incorrectos» (`fila-asignatura.ts:135`). */
	malRepartidos: `${U} con ${S} incorrectos`,
	sinNotas: 'notas NO agregadas',
};

export const FILAS: FilaAsignatura[] = [
	{ ...pick(de('Ciencias Naturales', '8°A')), nombreGrupo: 'Octavo A', ih: 4, logros: 3, avisos: [] },
	{ ...pick(de('Matemáticas', '9°B')), nombreGrupo: 'Noveno B', ih: 5, logros: 3, avisos: [] },
	{ ...pick(de('Matemáticas', '9°A')), nombreGrupo: 'Noveno A', ih: 5, logros: 3, avisos: [AVISOS.sinSumar, AVISOS.malRepartidos] },
	{ ...pick(de('Estadística', '10°A')), nombreGrupo: 'Décimo A', ih: 2, logros: 0, avisos: [] },
];

function pick(a: { materia: string; grupo: string; sigla: string; color: string }) {
	return { materia: a.materia, grupo: a.grupo, sigla: a.sigla, color: a.color };
}

export const incompleta = (f: FilaAsignatura) => f.logros === 0 || f.avisos.length > 0;

/** La de 9°A: la que tiene los dos avisos y la que se abre en `unidades-100`. */
export const LA_DE_9A = FILAS.findIndex((f) => f.grupo === '9°A');
export const LA_DE_10A = FILAS.findIndex((f) => f.grupo === '10°A');

export const MIGAS_MIS_ASIGNATURAS: Miga[] = [
	{ etiqueta: 'Panel', enlace: true },
	{ etiqueta: 'Académico', enlace: false },
	{ etiqueta: 'Mis asignaturas', enlace: false },
];

/* ── La geometría, en coordenadas de la pantalla de dentro (sin menú ni barra) ─────────────── */

export const MA = {
	lados: 32,
	arriba: 6,
	titulo: 48,
	subtitulo: 36,
	hueco: 14,
	fila: 84,
	entre: 12,
	/** La franja del grupo, pegada al borde izquierdo de la fila. */
	franja: 62,
	boton: { alto: 34, hueco: 8 },
	/** «Grupos titularía», debajo. */
	titularia: 46,
};

export const ANCHO = MEDIDAS.ancho - MEDIDAS.menu;

/** Los botones de la fila, en su orden (`fila-asignatura.html:81-173`). */
export const BOTONES = [
	{ texto: U, ancho: 116, primario: true },
	{ texto: 'Planilla', ancho: 110, primario: false },
	{ texto: 'Definitivas', ancho: 128, primario: false },
	{ texto: 'Rúbricas', ancho: 112, primario: false },
	{ texto: 'Cerrar', ancho: 96, primario: false },
];

export const arribaDeLasFilas = () => MA.arriba + MIGAS_ALTO + MA.titulo + MA.subtitulo + MA.hueco;

/** Lo que ocupa a lo ancho un texto a esa letra: estimado por lo alto, para que siempre quepa. */
export const anchoDe = (texto: string, letra: number) => Math.ceil(texto.length * letra * 0.56);

const ANCHO_FILA = ANCHO - MA.lados * 2;
const ANCHO_BOTONES = BOTONES.reduce((n, b) => n + b.ancho, 0) + MA.boton.hueco * (BOTONES.length - 1);
/** Donde empieza el cuerpo (materia y datos) dentro de la fila, y lo que tiene de ancho. */
export const CUERPO = { x: MA.franja + 18, ancho: ANCHO_FILA - 14 - ANCHO_BOTONES - 16 - (MA.franja + 18) };
const RENGLON = 32;

/*
 * LA LÍNEA DE DATOS SE PARTE EN RENGLONES, como en la aplicación (`.fila__resumen` lleva
 * `flex-wrap: wrap`): con dos etiquetas no cabe en un renglón al lado de los cinco botones, y en la
 * aplicación lo que pasa es que baja al siguiente y la fila crece. Aquí se hace la misma cuenta, y
 * la fila mide lo que le salga.
 */
export function piezasColocadas(f: FilaAsignatura) {
	let x = 0;
	let linea = 0;
	return piezasDelResumen(f).map((p) => {
		if (x > 0 && x + p.ancho > CUERPO.ancho) { x = 0; linea++; }
		const r = { ...p, x, linea };
		x += p.ancho + 10;
		return r;
	});
}

export const altoDeFila = (f: FilaAsignatura) => {
	const lineas = Math.max(...piezasColocadas(f).map((p) => p.linea)) + 1;
	return Math.max(MA.fila, 46 + lineas * RENGLON + 8);
};

export const arribaDeLaFila = (i: number, filas = FILAS) =>
	arribaDeLasFilas() + filas.slice(0, i).reduce((n, f) => n + altoDeFila(f) + MA.entre, 0);
export const arribaDeTitularia = (filas = FILAS) => arribaDeLaFila(filas.length, filas) + 10;

/** «Grupos titularía»: el rótulo, la fila y su botón «Comportamiento». */
export const TITULARIA = { rotulo: 46, fila: 76, ancho: 620, boton: { ancho: 164, alto: 34, derecha: 16 } };

/** La sección «Grupos titularía» y su botón, en coordenadas de la CÁSCARA (como `geometriaDeLaFila`). */
export function geometriaDeTitularia(izquierda = MEDIDAS.menu, arriba = MEDIDAS.barra, filas = FILAS) {
	const x = izquierda + MA.lados;
	const y = arriba + arribaDeTitularia(filas);
	const fila: Rect = { x, y: y + TITULARIA.rotulo, ancho: TITULARIA.ancho, alto: TITULARIA.fila, radio: 8 };
	const b = TITULARIA.boton;
	return {
		seccion: { x, y, ancho: TITULARIA.ancho, alto: TITULARIA.rotulo + TITULARIA.fila, radio: 8 } as Rect,
		fila,
		boton: { x: x + TITULARIA.ancho - b.derecha - b.ancho, y: fila.y + (TITULARIA.fila - b.alto) / 2, ancho: b.ancho, alto: b.alto, radio: 6 } as Rect,
	};
}

/** Dónde cae cada cosa de una fila, en coordenadas de la CÁSCARA (con barra y menú contados). */
export function geometriaDeLaFila(i: number, izquierda = MEDIDAS.menu, arriba = MEDIDAS.barra, filas = FILAS) {
	const f = filas[i];
	const alto = altoDeFila(f);
	const y = arriba + arribaDeLaFila(i, filas);
	const x = izquierda + MA.lados;
	const derecha = x + ANCHO_FILA - 14;

	const botones: Rect[] = [];
	let bx = derecha;
	for (let b = BOTONES.length - 1; b >= 0; b--) {
		bx -= BOTONES[b].ancho;
		botones[b] = { x: bx, y: y + (alto - MA.boton.alto) / 2, ancho: BOTONES[b].ancho, alto: MA.boton.alto, radio: 6 };
		bx -= MA.boton.hueco;
	}

	const avisos: Rect[] = piezasColocadas(f)
		.filter((p) => p.aviso)
		.map((p) => ({ x: x + CUERPO.x + p.x, y: y + 46 + p.linea * RENGLON, ancho: p.ancho, alto: 26, radio: 6 }));

	return {
		fila: { x, y, ancho: ANCHO_FILA, alto, radio: 8 } as Rect,
		franja: { x, y, ancho: MA.franja, alto, radio: 8 } as Rect,
		botones,
		avisos,
	};
}

export const RENGLON_DEL_RESUMEN = RENGLON;

/** Las piezas de la línea de datos, en orden, con su ancho fijo (así el foco sabe dónde caen). */
export function piezasDelResumen(f: FilaAsignatura): { texto: string; ancho: number; aviso: boolean; grupo?: boolean; icono?: 'fall' }[] {
	const piezas: { texto: string; ancho: number; aviso: boolean; grupo?: boolean; icono?: 'fall' }[] = [
		{ texto: f.nombreGrupo, ancho: 24 + anchoDe(f.nombreGrupo, 16), aviso: false, grupo: true },
		{ texto: `· IH ${f.ih}`, ancho: anchoDe(`· IH ${f.ih}`, 16), aviso: false },
	];
	if (f.logros === 0) {
		piezas.push({ texto: AVISOS.sinLogros, ancho: 40 + Math.ceil(AVISOS.sinLogros.length * 15 * 0.5), aviso: true, icono: 'fall' });
	} else {
		piezas.push({ texto: `· ${f.logros} ${U}`, ancho: anchoDe(`· ${f.logros} ${U}`, 16), aviso: false });
	}
	f.avisos.forEach((a) => piezas.push({ texto: a, ancho: 20 + Math.ceil(a.length * 15 * 0.5), aviso: true }));
	return piezas;
}
