import type { Rect } from '../el-ano/Aplicacion';
import { ANCHO_PANEL, CG, arribaDelCuerpo } from '../el-ano/colegio';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «EL COLEGIO ▸ AJUSTES DEL AÑO» (`/colegio/:yearId/ajustes`): LO QUE SE VE Y DÓNDE CAE.
 *
 * LO QUE ES DE LA APLICACIÓN (`colegio-ajustes.html` y `.ts`): el panel «El año en curso» con sus
 * dos caras (el año en curso / «Poner 2027 como año en curso» con su popconfirm), los cuatro
 * paneles de interruptores con sus etiquetas y ayudas literales, los avisos de cada interruptor
 * (el texto que devuelve `YearsController`) y «Ahora es año actual.». Cada interruptor se guarda
 * solo (`conmutar`); sólo el año en curso pregunta antes.
 *
 * LO INVENTADO: los ids de los años y qué interruptores están encendidos.
 */

export const Y2026 = { year: 2026, id: 14 };
export const Y2027 = { year: 2027, id: 15 };

export interface Interruptor { etiqueta: string; ayuda: string; lineas: number; encendido: boolean; numero?: string }
export interface Grupo { titulo: string; interruptores: Interruptor[] }

/* Los cuatro paneles, en el orden de `grupos` (colegio-ajustes.ts:112-214). */
export const GRUPOS: Grupo[] = [
	{
		titulo: 'La campaña de prematrícula',
		interruptores: [
			{ etiqueta: 'Abierta para estudiantes nuevos', ayuda: 'Enciende el enlace público «Prematricular» en la pantalla de entrada, para familias que todavía no son del colegio.', lineas: 2, encendido: false },
			{ etiqueta: 'Abierta para los que ya están', ayuda: 'Cada acudiente ve en su portada si su hijo continúa el año que viene, y puede decirlo desde ahí.', lineas: 2, encendido: false },
			{ etiqueta: 'días como máximo en prematrícula o asistente', ayuda: 'Desde el segundo periodo, quien lleve más días así sale en Pendientes para que se matricule o se retire.', lineas: 2, encendido: false, numero: '10' },
		],
	},
	{
		titulo: 'El boletín',
		interruptores: [
			{ etiqueta: 'Mostrar el puesto', ayuda: 'Imprime en qué lugar del grupo quedó el alumno.', lineas: 1, encendido: false },
			{ etiqueta: 'Mostrar la nota de comportamiento', ayuda: 'La nota de comportamiento sale como una asignatura más.', lineas: 1, encendido: true },
			{ etiqueta: 'Mostrar el año pasado', ayuda: 'Añade al boletín las notas del año anterior, para comparar.', lineas: 1, encendido: false },
		],
	},
	{
		titulo: 'Quién puede ver y tocar qué',
		interruptores: [
			{ etiqueta: 'Los alumnos ven sus notas', ayuda: 'Apagado, cada alumno ve en su lugar el mensaje de la ficha del colegio.', lineas: 2, encendido: true },
			{ etiqueta: 'Los profesores pueden editar alumnos', ayuda: 'Corregir nombres, fotos y datos de la matrícula desde la ficha del alumno.', lineas: 2, encendido: false },
		],
	},
	{
		titulo: 'Cómo se califica',
		interruptores: [
			{ etiqueta: 'Sólo escalas valorativas', ayuda: 'El boletín enseña la escala (Alto, Básico…) en vez del número.', lineas: 1, encendido: false },
			{ etiqueta: 'Ignorar notas perdidas al recuperar', ayuda: 'Si el alumno recupera la asignatura, sus indicadores perdidos dejan de contar.', lineas: 2, encendido: true },
		],
	},
];

/** El que se pulsa: «Mostrar el puesto», el primero de «El boletín». */
export const EL_BOLETIN = 1;
export const EL_PUESTO = 0;

export const TEXTOS = {
	tituloAnio: 'El año en curso',
	pistaActual: 'Para cambiarlo, ve al año que quieras poner en curso y púlsalo allí. Sólo puede haber uno.',
	popconfirm: (y: number) =>
		`El colegio entero pasa a ${y}: es el año que verán profesores y alumnos, y del que salen los boletines. El que esté en curso ahora deja de estarlo.`,
	ok: (y: number) => `Sí, poner ${y} en curso`,
	cancelar: 'Dejarlo como está',
	boton: (y: number) => `Poner ${y} como año en curso`,
	avisoPuesto: 'Ahora se mostrarán los puestos en el boletín.',
	avisoActual: 'Ahora es año actual.',
	/* La zona de riesgo del final de la página (`colegio-ajustes.html:232-248`). */
	papelera: (y: number) => `Enviar ${y} a la papelera`,
	papeleraPista: 'Deja de salir en la lista de años y en el selector de arriba. No se borra: se recupera desde la papelera.',
	papeleraActual: 'Es el año en curso',
	papeleraActualResto: ', así que el colegio se quedaría sin año en el que trabajar.',
	papeleraBoton: 'Enviar a la papelera',
};

/*
 * LOS PANELES DE DEBAJO, sólo con su título y su primera ayuda (literales de `colegio-ajustes.html`):
 * el vídeo pasa por ellos camino de la papelera y no los explica. Los altos son aproximados.
 */
export const ABAJO: { titulo: string; pista: string; alto: number }[] = [
	{ titulo: 'La regla de nivelación', pista: 'Qué nota queda cuando un docente registra una superación de debilidades. La escribe el SIEE del colegio, no el sistema.', alto: 260 },
	{ titulo: 'La definitiva a mano, mientras se nivela', pista: 'Con un periodo abierto a nivelar, ¿puede el docente además cambiar la definitiva a mano?', alto: 180 },
	{ titulo: 'Al cerrar un periodo, lo que nadie calificó', pista: 'Qué se hace con las casillas que quedaron vacías el día que se cierra un periodo. Lo escribe el SIEE del colegio.', alto: 200 },
];

/* ── La geometría, en coordenadas del contenido ───────────────────────────────────────────── */

export const AJ = {
	/** Alto del panel «El año en curso», igual con las dos caras para que nada salte. */
	anio: 142,
	cabecera: 34,
	fila: 26,
	linea: 19,
	entre: 14,
	/** Donde empieza la ayuda de un interruptor, a la derecha del mando (2,9rem). */
	sangria: 46,
	boton: 262,
};

export const ANCHO_COLUMNA = (ANCHO_PANEL - CG.hueco) / 2;

const altoDelItem = (i: Interruptor) => AJ.fila + i.lineas * AJ.linea;
const altoDelGrupo = (g: Grupo) =>
	CG.relleno * 2 + AJ.cabecera + g.interruptores.reduce((n, i) => n + altoDelItem(i), 0) + AJ.entre * (g.interruptores.length - 1);

export function rectAnio(aviso: number): Rect {
	return { x: CG.lado, y: arribaDelCuerpo(aviso), ancho: ANCHO_PANEL, alto: AJ.anio };
}

/** Los cuatro paneles en rejilla de dos columnas; cada fila mide lo del más alto. */
export function rectGrupo(g: number, aviso: number): Rect {
	const fila = Math.floor(g / 2);
	const col = g % 2;
	const arriba0 = rectAnio(aviso).y + AJ.anio + CG.hueco;
	const altoFila = (f: number) => Math.max(altoDelGrupo(GRUPOS[f * 2]), altoDelGrupo(GRUPOS[f * 2 + 1]));
	const y = arriba0 + (fila === 0 ? 0 : altoFila(0) + CG.hueco);
	return { x: CG.lado + col * (ANCHO_COLUMNA + CG.hueco), y, ancho: ANCHO_COLUMNA, alto: altoFila(fila) };
}

/** La fila de un interruptor (mando + etiqueta + ayuda). */
export function rectInterruptor(g: number, i: number, aviso: number): Rect {
	const r = rectGrupo(g, aviso);
	const antes = GRUPOS[g].interruptores.slice(0, i).reduce((n, x) => n + altoDelItem(x) + AJ.entre, 0);
	return { x: r.x + CG.relleno, y: r.y + CG.relleno + AJ.cabecera + antes, ancho: r.ancho - CG.relleno * 2, alto: altoDelItem(GRUPOS[g].interruptores[i]) };
}

/** Sólo el mando. */
export function rectMando(g: number, i: number, aviso: number): Rect {
	const r = rectInterruptor(g, i, aviso);
	return { x: r.x, y: r.y + 2, ancho: 44, alto: 22 };
}

export function rectBotonAnio(aviso: number): Rect {
	const r = rectAnio(aviso);
	return { x: r.x + CG.relleno, y: r.y + CG.relleno + AJ.cabecera + 30, ancho: AJ.boton, alto: 32 };
}

/** Los paneles de debajo de los interruptores, uno bajo otro. */
export function rectAbajo(k: number, aviso: number): Rect {
	const g = rectGrupo(3, aviso);
	let y = g.y + g.alto + CG.hueco;
	for (let i = 0; i < k; i++) { y += ABAJO[i].alto + CG.hueco; }
	return { x: CG.lado, y, ancho: ANCHO_PANEL, alto: ABAJO[k].alto };
}

/** La zona de riesgo: separada por 2rem (`colegio.scss`, `.bloque--riesgo`). */
export function rectPapelera(aviso: number): Rect {
	const u = rectAbajo(ABAJO.length - 1, aviso);
	return { x: CG.lado, y: u.y + u.alto + 32, ancho: ANCHO_PANEL, alto: 168 };
}
