import type { Rect } from '../el-ano/Aplicacion';
import { PL, type PestanaPlan } from '../el-ano/plan';
import { MAIN } from '../montar-el-ano/planoAsignaturas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «PLAN DE EVALUACIÓN ▸ ② PLANTILLA DE NOTAS»: LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`plantilla.html`, `plantilla.ts`, `sembrar-plantilla.html`): el
 * párrafo de arriba, la línea del reparto («todas las asignaturas · 2 filas · 75 %»), el aviso
 * «Hay repartos que no suman 100 %», la forma de cada fila (número, texto, %, alcance, iconos), las
 * filas de añadir con sus marcadores, «¿Se puede traer la plantilla de otro año?», el botón
 * «Aplicar la plantilla a las asignaturas» con su motivo cuando está apagado, y el diálogo entero:
 * la pregunta con su casilla y el resumen con sus diez cifras.
 *
 * LO INVENTADO: los criterios, las columnas y las cifras del resumen. Las palabras «criterio» y
 * «columna» son las de esta pantalla: aquí no se leen los nombres que el colegio pone a sus
 * unidades (`plantilla.html` las escribe fijas).
 *
 * EN COORDENADAS DE LA CÁSCARA. Toda la geometría es una función del estado, como en los demás.
 */

export const YEAR = 2026;

export interface Columna { definicion: string; porcentaje: number }
export interface Criterio { definicion: string; porcentaje: number; columnas: Columna[] }

export const CRITERIOS: Criterio[] = [
	{ definicion: 'Cognitivo', porcentaje: 40, columnas: [{ definicion: 'Evaluaciones escritas', porcentaje: 50 }, { definicion: 'Talleres', porcentaje: 50 }] },
	{ definicion: 'Procedimental', porcentaje: 35, columnas: [{ definicion: 'Trabajo en clase', porcentaje: 60 }, { definicion: 'Tareas', porcentaje: 40 }] },
	{ definicion: 'Actitudinal', porcentaje: 25, columnas: [] },
];

export const NUEVO = CRITERIOS[2];

export const TEXTOS = {
	intro1: ['El molde con el que nacen las asignaturas del año. ', { b: 'Vale para los cuatro periodos' }, ', así que aquí no se elige ninguno.'],
	intro2: 'Cambiar algo de aquí no mueve ninguna nota ya puesta: se aplica con el botón del final.',
	alcance: 'todas las asignaturas',
	avisoTitulo: 'Hay repartos que no suman 100 %',
	avisoPorque: ['La plantilla ', { b: 'multiplica' }, ': lo que se escriba aquí se copia a todas las asignaturas que se siembren. Se puede guardar así —hace falta para llegar a 100— pero no se puede aplicar.'],
	marcadorColumna: 'Añadir una columna: «Examen», «Taller»…',
	marcadorCriterio: 'Añadir un criterio: «Cognitivo», «Procedimental», «Actitudinal»…',
	anadirColumna: 'Añadir columna',
	anadirCriterio: 'Añadir criterio',
	herencia: '¿Se puede traer la plantilla de otro año?',
	aplicar: 'Aplicar la plantilla a las asignaturas',
	porqueApagado: 'Cuadra primero los porcentajes: aplicar un reparto que no suma 100 se lo lleva a todas las asignaturas del colegio.',

	dialogoTitulo: 'Aplicar la plantilla a las asignaturas',
	casilla: ['También en las que ', { b: 'ya tienen columnas' }, ', aunque tengan notas puestas.'],
	casillaApunte: ['Les cambia el peso de las columnas que ya están —sin borrar ninguna nota— y les crea las que falten. ', { b: 'Eso mueve la definitiva' }, ' de quien ya esté calificado.'],
	limites: ['Nunca se tocan: los periodos cerrados, ', { b: 'las columnas que haya añadido el docente' }, ', ni las columnas propias de un estudiante con boletín aparte.'],
	aplicada: 'Plantilla aplicada',
	apunte: 'Son asignaturas × periodos, no asignaturas.',
};

export type Trozo = string | { b: string };

/** El resumen: 154 asignaturas × 4 periodos. 76 ya estaban montadas; las 540 restantes reciben las 4 columnas. */
export const CONTEO: [string, number, boolean][] = [
	['revisadas', 616, true],
	['sembradas', 540, true],
	['columnas actualizadas', 0, false],
	['columnas creadas', 2160, false],
	['ya montadas', 76, false],
	['periodo cerrado', 0, false],
	['sin plantilla que les toque', 0, false],
	['boletín aparte, respetadas', 0, false],
	['del docente, respetadas', 0, false],
	['huérfanas, con su peso', 0, false],
];

export function pestanas(suma: number): PestanaPlan[] {
	return [
		{ clave: 'modelo', numero: '①', etiqueta: 'Modelo', marca: { tono: 'resuelto', glifo: '✓', texto: 'Ponderado' } },
		{ clave: 'plantilla', numero: '②', etiqueta: 'Plantilla de notas', marca: suma === 100 ? { tono: 'resuelto', glifo: '✓' } : { tono: 'aviso', glifo: '!', texto: `${suma} %` } },
		{ clave: 'reparto', numero: '④', etiqueta: 'Reparto de notas' },
		{ clave: 'frases', numero: '⑤', etiqueta: 'Escalas de valoración' },
	];
}

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const G = {
	intro: 46,
	reparto: 30,
	aviso: 100,
	criterio: 40,
	columna: 32,
	anadirColumna: 42,
	entreCriterios: 10,
	anadirCriterio: 46,
	herencia: 26,
	aplicar: 34,
	hueco: 12,
};

export interface EstadoPlantilla {
	/** 0..1: el aviso amarillo (se pliega al llegar a 100). */
	aviso: number;
	/** 0..1: la tercera fila, que entra al añadirla. */
	tercera: number;
}

const altoCriterio = (c: Criterio) => G.criterio + c.columnas.length * G.columna + G.anadirColumna;

export function disposicion(e: EstadoPlantilla) {
	const x = MAIN.x;
	const ancho = MAIN.ancho;
	let y = PL.cuerpo;
	const intro = { x, y, ancho, alto: G.intro };
	y += G.intro + G.hueco;
	const reparto = { x, y, ancho, alto: G.reparto };
	y += G.reparto + G.hueco;
	const aviso = { x, y, ancho, alto: G.aviso * e.aviso };
	y += (G.aviso + G.hueco) * e.aviso;
	const criterios = CRITERIOS.map((c, i) => {
		const t = i === 2 ? e.tercera : 1;
		const r = { x, y, ancho, alto: altoCriterio(c) * t };
		y += (altoCriterio(c) + G.entreCriterios) * t;
		return r;
	});
	const anadir = { x, y, ancho, alto: G.anadirCriterio };
	y += G.anadirCriterio + G.hueco;
	const herencia = { x, y, ancho, alto: G.herencia };
	y += G.herencia + G.hueco;
	const aplicar = { x, y, ancho, alto: G.aplicar };
	return { intro, reparto, aviso, criterios, anadir, herencia, aplicar };
}

export const ANCHO_PORCENTAJE = 70;
export const ANCHO_BOTON_CRITERIO = 150;

/** El campo de texto de «Añadir un criterio». */
export function rectCampoCriterio(e: EstadoPlantilla): Rect {
	const a = disposicion(e).anadir;
	return { x: a.x + 30, y: a.y + 7, ancho: a.ancho - 30 - ANCHO_PORCENTAJE - ANCHO_BOTON_CRITERIO - 20, alto: 32 };
}
export function rectPorcentajeCriterio(e: EstadoPlantilla): Rect {
	const c = rectCampoCriterio(e);
	return { x: c.x + c.ancho + 10, y: c.y, ancho: ANCHO_PORCENTAJE, alto: 32 };
}
export function rectBotonCriterio(e: EstadoPlantilla): Rect {
	const p = rectPorcentajeCriterio(e);
	return { x: p.x + p.ancho + 10, y: p.y, ancho: ANCHO_BOTON_CRITERIO, alto: 32 };
}
export const ANCHO_APLICAR = 300;
export function rectAplicar(e: EstadoPlantilla): Rect {
	const a = disposicion(e).aplicar;
	return { x: a.x, y: a.y + 1, ancho: ANCHO_APLICAR, alto: 32 };
}

/* ── El diálogo (560 de ancho, como `nzWidth`) ─────────────────────────────────────────────── */

export const DIALOGO = { ancho: 560, y: 150 };
export const DX = (1440 - DIALOGO.ancho) / 2;
/** Dentro del diálogo de la pregunta: el párrafo, la casilla y los límites. */
export const DG = { titulo: 46, parrafo: 50, casilla: 112, limites: 50, pie: 52, relleno: 24 };

export function rectParrafo(): Rect {
	return { x: DX + DG.relleno, y: DIALOGO.y + DG.relleno + DG.titulo, ancho: DIALOGO.ancho - DG.relleno * 2, alto: DG.parrafo };
}
export function rectCasilla(): Rect {
	const p = rectParrafo();
	return { x: p.x, y: p.y + p.alto + 10, ancho: p.ancho, alto: DG.casilla };
}
export function rectLimites(): Rect {
	const c = rectCasilla();
	return { x: c.x, y: c.y + c.alto + 10, ancho: c.ancho, alto: DG.limites };
}
export function rectBotonAplicarDialogo(): Rect {
	const l = rectLimites();
	return { x: DX + DIALOGO.ancho - DG.relleno - 80, y: l.y + l.alto + 16, ancho: 80, alto: 32 };
}
export function rectDialogoPregunta(): Rect {
	const b = rectBotonAplicarDialogo();
	return { x: DX, y: DIALOGO.y, ancho: DIALOGO.ancho, alto: b.y + b.alto + DG.relleno - DIALOGO.y };
}
export function rectConteo(): Rect {
	return { x: DX + DG.relleno, y: DIALOGO.y + DG.relleno + DG.titulo, ancho: DIALOGO.ancho - DG.relleno * 2, alto: 5 * 34 + 30 };
}
