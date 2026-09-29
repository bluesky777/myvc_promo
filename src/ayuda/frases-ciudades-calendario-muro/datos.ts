import { ALTO_CONTROL } from '../montar-el-ano/ant';
import { CABECERA, FILA, altoDeLaRejilla, type Columna } from '../montar-el-ano/Rejilla';
import { MAIN, type Rect } from '../comun-directivo/lugar';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * «FRASES, CIUDADES, CALENDARIO Y MURO»: LO QUE SE VE Y DÓNDE CAE CADA MANDO.
 *
 * Cuatro pantallas pequeñas (`paginas/frases`, `paginas/ciudades`, `paginas/calendario` y
 * `paginas/panel/publicaciones`), con los textos de sus plantillas. Todo inventado: las frases, los
 * eventos, los cumpleaños y quién publica. Las ciudades son las de verdad de Norte de Santander,
 * que es un catálogo público y no un dato de nadie.
 *
 * Coordenadas de la cáscara (1440 × 900). Los rectángulos de aquí son los que usan a la vez el
 * dibujo, el foco y el puntero.
 */

const DERECHA = MAIN.x + MAIN.ancho;
const ARRIBA = MAIN.y;

/* ════════════════════════════ FRASES ════════════════════════════ */

export const FRASES = {
	recargar: { x: DERECHA - 136 - 8 - 116, y: ARRIBA + 4, ancho: 116, alto: ALTO_CONTROL },
	crearNueva: { x: DERECHA - 136, y: ARRIBA + 4, ancho: 136, alto: ALTO_CONTROL },
	ficha: { x: MAIN.x, y: ARRIBA + 56, ancho: MAIN.ancho, alto: 248 },
};

/** Dentro de la ficha «Nueva frase»: formulario vertical, Frase arriba y Tipo debajo. */
export const FICHA_FRASE = {
	frase: { x: MAIN.x + 13, y: FRASES.ficha.y + 40 + 12 + 30, ancho: 700, alto: ALTO_CONTROL },
	tipo: { x: MAIN.x + 13, y: FRASES.ficha.y + 40 + 12 + 30 + 32 + 12 + 30, ancho: 240, alto: ALTO_CONTROL },
	crear: { x: MAIN.x + 13, y: FRASES.ficha.y + 40 + 12 + 30 + 32 + 12 + 30 + 32 + 16, ancho: 72, alto: ALTO_CONTROL },
	/** El `Tipo` con su etiqueta: lo que señala el foco. */
	tipoConEtiqueta: { x: MAIN.x + 13, y: FRASES.ficha.y + 40 + 12 + 32 + 12 + 30, ancho: 240, alto: 30 + ALTO_CONTROL },
};

export const COLUMNAS_FRASES: Columna[] = [
	{ clave: 'id', titulo: 'Id', ancho: 80, filtro: true },
	{ clave: 'borrar', titulo: '', ancho: 56, alinear: 'centro' },
	{ clave: 'tipo', titulo: 'Tipo', ancho: 150, filtro: true },
	{ clave: 'frase', titulo: 'Frase', ancho: MAIN.ancho - 80 - 56 - 150 - 2, filtro: true },
];

export interface Frase { id: number; tipo: 'Fortaleza' | 'Debilidad' | 'Oportunidad' | 'Amenaza'; frase: string }

export const LAS_FRASES: Frase[] = [
	{ id: 412, tipo: 'Fortaleza', frase: 'Cumple puntualmente con sus compromisos.' },
	{ id: 413, tipo: 'Fortaleza', frase: 'Trabaja bien en equipo y ayuda a sus compañeros.' },
	{ id: 414, tipo: 'Debilidad', frase: 'Debe mejorar la presentación de sus trabajos.' },
	{ id: 415, tipo: 'Oportunidad', frase: 'Puede apoyarse en las tutorías de la tarde.' },
	{ id: 416, tipo: 'Amenaza', frase: 'Las ausencias frecuentes afectan su proceso.' },
	{ id: 417, tipo: 'Debilidad', frase: 'Le cuesta mantener la atención en clase.' },
];

export const LA_NUEVA: Frase = { id: 418, tipo: 'Fortaleza', frase: 'Participa con entusiasmo en clase.' };

/** Lo que empuja la ficha abierta (0..1): su alto más el hueco. */
export const empujeDeLaFicha = (t: number) => (FRASES.ficha.alto + 16) * t;

export const pistaFrases = (t: number) => ARRIBA + 56 + empujeDeLaFicha(t);
export const rejillaFrases = (t: number, filas: number): Rect => ({ x: MAIN.x, y: pistaFrases(t) + 30, ancho: MAIN.ancho, alto: altoDeLaRejilla(filas) });

/** Una celda (o varias columnas seguidas) de la fila `i`. */
export function rectCeldaFrase(t: number, i: number, desde: string, hasta = desde): Rect {
	const r = rejillaFrases(t, 7);
	let x = r.x;
	let ancho = 0;
	let dentro = false;
	for (const c of COLUMNAS_FRASES) {
		if (c.clave === desde) { dentro = true; }
		if (dentro) { ancho += c.ancho; } else { x += c.ancho; }
		if (c.clave === hasta) { break; }
	}
	return { x, y: r.y + CABECERA * 2 + i * FILA, ancho, alto: FILA };
}

/* ════════════════════════════ CIUDADES ════════════════════════════ */

export const CIUDADES = {
	crearCiudad: { x: DERECHA - 262, y: ARRIBA + 4, ancho: 262, alto: ALTO_CONTROL },
	crearPais: { x: DERECHA - 262 - 8 - 140, y: ARRIBA + 4, ancho: 140, alto: ALTO_CONTROL },
	pais: { x: MAIN.x, y: ARRIBA + 56 + 30, ancho: 320, alto: ALTO_CONTROL },
	departamento: { x: MAIN.x + 336, y: ARRIBA + 56 + 30, ancho: 320, alto: ALTO_CONTROL },
	titulo: { x: MAIN.x, y: ARRIBA + 148, alto: 32 },
	lista: { x: MAIN.x, y: ARRIBA + 192 },
};

export const FILA_CIUDAD = 44;
export const ANCHO_NOMBRE_CIUDAD = 210;
export const ANCHO_DEPARTAMENTO = 206;

export const DEPARTAMENTOS = ['ANTIOQUIA', 'ATLÁNTICO', 'BOYACÁ', 'CUNDINAMARCA', 'NORTE DE SANTANDER', 'SANTANDER'];
export const EL_DEPARTAMENTO = DEPARTAMENTOS.indexOf('NORTE DE SANTANDER');

export const LAS_CIUDADES = ['ÁBREGO', 'CHINÁCOTA', 'CÚCUTA', 'EL ZULIA', 'LOS PATIOS', 'OCAÑA', 'PAMPLONA', 'VILLA DEL ROSARIO'];

export const rectOpcionDepartamento = (i: number): Rect => ({
	x: CIUDADES.departamento.x + 4, y: CIUDADES.departamento.y + ALTO_CONTROL + 4 + 4 + i * 34, ancho: CIUDADES.departamento.ancho - 8, alto: 34,
});

/** Los tres botones redondos de una fila: lápiz de la ciudad, papelera, y lápiz del departamento. */
export function rectBotonCiudad(i: number, cual: 'editar' | 'papelera' | 'departamento'): Rect {
	const y = CIUDADES.lista.y + i * FILA_CIUDAD + (FILA_CIUDAD - 32) / 2;
	const x0 = CIUDADES.lista.x + ANCHO_NOMBRE_CIUDAD;
	const x = cual === 'editar' ? x0 : cual === 'papelera' ? x0 + 32 : x0 + 64 + 8 + ANCHO_DEPARTAMENTO;
	return { x, y, ancho: 32, alto: 32 };
}

/* ════════════════════════════ CALENDARIO ════════════════════════════ */

export const CALENDARIO = {
	nuevoEvento: { x: DERECHA - 124 - 8 - 156, y: ARRIBA + 84, ancho: 156, alto: ALTO_CONTROL },
	actualizar: { x: DERECHA - 124, y: ARRIBA + 84, ancho: 124, alto: ALTO_CONTROL },
	mesY: ARRIBA + 84,
	diasY: ARRIBA + 132,
	rejillaY: ARRIBA + 162,
	celdaAlto: 86,
	celdaAncho: MAIN.ancho / 7,
};

/** Septiembre de 2026 empieza en martes: la primera casilla es el lunes 31 de agosto. */
export const PRIMERA_CASILLA = { mes: 8, dia: 31 };
export const HOY = 28;

export interface Evento { titulo: string; soloPersonal?: boolean }

export const EVENTOS: Record<number, Evento[]> = {
	7: [{ titulo: 'Izada de bandera' }],
	11: [{ titulo: 'Consejo académico', soloPersonal: true }],
	18: [{ titulo: 'Entrega de boletines' }],
	22: [{ titulo: 'Reunión de docentes', soloPersonal: true }],
	25: [{ titulo: 'Día de la familia' }],
	30: [{ titulo: 'Simulacro de evacuación' }],
};

export const CUMPLEANOS: Record<number, number> = { 3: 1, 9: 2, 15: 1, 22: 1, 29: 3 };

/** La casilla del día `d` de septiembre: índice `d`, porque el lunes 31 de agosto es el 0. */
export function rectDia(d: number): Rect {
	const i = d;
	return { x: MAIN.x + (i % 7) * CALENDARIO.celdaAncho, y: CALENDARIO.rejillaY + Math.floor(i / 7) * CALENDARIO.celdaAlto, ancho: CALENDARIO.celdaAncho, alto: CALENDARIO.celdaAlto };
}

/** La pieza verde «N cumpleaños» dentro de su casilla. */
export function rectCumple(d: number): Rect {
	const c = rectDia(d);
	return { x: c.x + 6, y: c.y + 28, ancho: c.ancho - 12, alto: 22 };
}

export const rectRejillaCalendario = (): Rect => ({ x: MAIN.x, y: CALENDARIO.diasY, ancho: MAIN.ancho, alto: CALENDARIO.rejillaY - CALENDARIO.diasY + 6 * CALENDARIO.celdaAlto });

/* ════════════════════════════ PUBLICACIONES ════════════════════════════ */

export const MURO = {
	recargar: { x: DERECHA - 116, y: ARRIBA + 4, ancho: 116, alto: ALTO_CONTROL },
	escribir: { x: DERECHA - 116 - 8 - 236, y: ARRIBA + 4, ancho: 236, alto: ALTO_CONTROL },
	editor: { x: MAIN.x, y: ARRIBA + 84, ancho: 760, alto: 392 },
	tarjeta: 720,
};

/** Dentro del editor. `y` relativa al editor. */
export const EDITOR = { relleno: 16, titulo: 32, etiqueta: 26, texto: 124, imagen: 32, leyenda: 28, radios: 30, botones: 32 };

export const rectQuienLaVe = (): Rect => {
	const e = MURO.editor;
	const y = e.y + EDITOR.relleno + EDITOR.titulo + 8 + EDITOR.etiqueta + EDITOR.texto + 12 + EDITOR.imagen + 16;
	return { x: e.x + EDITOR.relleno, y, ancho: 420, alto: EDITOR.leyenda + EDITOR.radios };
};

export const empujeDelEditor = (t: number) => (MURO.editor.alto + 16) * t;
export const misPublicacionesY = (t: number) => ARRIBA + 84 + empujeDelEditor(t);
export const tarjetasY = (t: number) => misPublicacionesY(t) + 44;

export interface Publicacion { autor: string; tipo: 'mujer' | 'hombre'; variante: number; fecha: string; titulo: string; texto: string; dirigida?: boolean; comentarios: number }

export const PUBLICACIONES: Publicacion[] = [
	{
		autor: 'Luz Marina Ortega Pabón', tipo: 'mujer', variante: 4, fecha: '25 sep 2026, 7:15 a. m.',
		titulo: 'Día de la familia', texto: 'el viernes 2 de octubre, desde las 8:00 a. m., en el coliseo. ¡Los esperamos!', comentarios: 4,
	},
	{
		autor: 'Diego Alejandro Rincón Duarte', tipo: 'hombre', variante: 1, fecha: '22 sep 2026, 3:40 p. m.', dirigida: true,
		titulo: 'Acudientes de noveno', texto: 'la entrega de boletines del segundo periodo es el martes a las 6:30 a. m.', comentarios: 0,
	},
];

export const ALTO_TARJETA = 176;

export const rectTarjeta = (t: number, i: number): Rect => ({ x: MAIN.x, y: tarjetasY(t) + i * (ALTO_TARJETA + 16), ancho: MURO.tarjeta, alto: ALTO_TARJETA });

/** El botón rojo de la papelera, arriba a la derecha de la tarjeta («Quitar del muro»). */
export const rectQuitar = (t: number, i: number): Rect => {
	const c = rectTarjeta(t, i);
	return { x: c.x + c.ancho - 16 - 32, y: c.y + 14, ancho: 32, alto: 32 };
};
