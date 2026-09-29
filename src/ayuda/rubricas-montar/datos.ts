import { BANDA } from '../encuadre';
import { ASIGNATURAS } from '../planilla/datos';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN LAS DOS PANTALLAS DE RÚBRICAS, Y DÓNDE CAE. Lo comparten «montar la matriz» y
 * «calificar».
 *
 * SE HACE EN MATEMÁTICAS 9°A Y NO EN 9°B, Y ES A PROPÓSITO: calificar con rúbrica ESCRIBE la nota
 * del indicador, y las notas de 9°B son las que cuenta la serie del cierre (el 58 y el 55 de
 * Valentina, los totales de Definitivas). Una rúbrica sobre el taller de 9°B las cambiaría. 9°A es
 * la tercera fila de Mis asignaturas, y la misma materia.
 *
 * LAS PALABRAS SON LAS DE app2 (`paginas/rubricas/rubricas.html` y `calificar-grupo.html`). Los
 * niveles son los que siembra «Sembrar niveles desde la escala del colegio»: los de la escala, el
 * mejor a la izquierda, con el PUNTO MEDIO de cada tramo como puntaje (`datos/rubricas.ts`,
 * `nivelesDeLaEscala`). La escala del colegio de demostración es la de la planilla: pierde por
 * debajo de 60 y es Superior de 90 para arriba.
 */

export const LA_DE_RUBRICAS = ASIGNATURAS.findIndex((a) => a.materia === 'Matemáticas' && a.grupo === '9°A');
export const ASIGNATURA_ID = 1223;

export interface Nivel {
	nombre: string;
	puntaje: number;
}

/** Bajo 0–59, Básico 60–79, Alto 80–89, Superior 90–100: el punto medio de cada tramo, redondeado. */
export const NIVELES: Nivel[] = [
	{ nombre: 'Superior', puntaje: 95 },
	{ nombre: 'Alto', puntaje: 85 },
	{ nombre: 'Básico', puntaje: 70 },
	{ nombre: 'Bajo', puntaje: 30 },
];

export interface Criterio {
	definicion: string;
	peso: number;
	descriptores: string[];
}

/*
 * LA QUE YA ESTÁ EN USO: la enlazó el indicador «Taller» de 9°A. Es la que se abre al final de
 * «montar» (para ver el aviso de «ya está en uso») y con la que se califica en «calificar».
 */
export const TALLER = {
	nombre: 'Taller de ecuaciones',
	indicador: 'Taller',
	criterios: [
		{ definicion: 'Planteamiento', peso: 40, descriptores: ['Plantea la ecuación y la justifica', 'Plantea la ecuación', 'La plantea con ayuda', 'No la plantea'] },
		{ definicion: 'Procedimiento', peso: 40, descriptores: ['Despeja sin errores y lo explica', 'Despeja con un error menor', 'Despeja a medias', 'No despeja'] },
		{ definicion: 'Resultado', peso: 20, descriptores: ['Correcto y comprobado', 'Correcto', 'Casi correcto', 'Incorrecto'] },
	] as Criterio[],
};

/* ── La nueva, la que se monta en «montar» ─────────────────────────────────────────────────── */

export const NUEVA = {
	nombre: 'Resolución de problemas',
	/** Los tres criterios, con el peso que se teclea primero. El tercero entra con 40 y se corrige a 30. */
	criterios: [
		{ definicion: 'Comprensión', peso: '30' },
		{ definicion: 'Estrategia', peso: '40' },
		{ definicion: 'Comunicación', peso: '40', corregido: '30' },
	],
	/** Los descriptores que se escriben: los de la primera fila. El resto se deja para luego. */
	descriptores: ['Explica el problema con sus palabras', 'Identifica datos y pregunta', 'Identifica sólo los datos', 'No identifica qué se pide'],
};

export const TEXTOS = {
	titulo: 'Rúbricas',
	materia: 'Matemáticas',
	nueva: 'Nueva rúbrica',
	vacioListado: 'Todavía no hay rúbricas para esta materia',
	volver: 'Todas las rúbricas',
	nombre: 'Nombre',
	nombrePlaceholder: 'Ensayo argumentativo',
	descripcion: 'Descripción',
	opcional: '(opcional)',
	descripcionPlaceholder: 'Para qué sirve y cuándo se usa',
	plantilla: 'Reutilizable en otras asignaturas',
	plantillaDetras: '— aparece al elegir rúbrica en cualquier indicador del año',
	enUso: 'Esta rúbrica ya está en uso',
	pesos: 'Los pesos no suman 100',
	sinNiveles: 'Esta rúbrica todavía no tiene niveles',
	sinNivelesDetalle: 'Siémbralos desde la escala del colegio para que los nombres y los rangos sean los mismos que ya usan los boletines.',
	criterio: 'Criterio',
	peso: 'Peso',
	criterioPlaceholder: 'Argumentación',
	nivelPlaceholder: 'Nivel',
	suma: 'Suma de los pesos',
	masCriterio: 'Criterio',
	masNivel: 'Nivel',
	sembrar: 'Sembrar niveles desde la escala del colegio',
	guardar: 'Guardar',
	guardado: 'Guardado',
	papelera: 'A la papelera',
	toastGuardada: 'Rúbrica guardada',
};

/** `avisoPesos()` de `rubricas.ts`, letra por letra. `null` cuando cuadra o no hay criterios. */
export function avisoDePesos(suma: number, filas: number): string | null {
	if (!filas || suma === 100) { return null; }
	return suma < 100
		? `Los pesos suman ${suma} de 100. Con esta rúbrica la nota máxima posible es ${suma}.`
		: `Los pesos suman ${suma}, más de 100. Con esta rúbrica se puede pasar de 100.`;
}

/** Lo que dice el listado de cada rúbrica: «3 criterios × 4 niveles · en uso en 1 indicador». */
export function datosDeLista(criterios: number, niveles: number, suma: number, enUso: number): string {
	let s = `${criterios} ${criterios === 1 ? 'criterio' : 'criterios'} × ${niveles} ${niveles === 1 ? 'nivel' : 'niveles'}`;
	if (suma !== 100) { s += ` · pesos: ${suma}`; }
	if (enUso) { s += ` · en uso en ${enUso} ${enUso === 1 ? 'indicador' : 'indicadores'}`; }
	return s;
}

/* ═══ LA GEOMETRÍA, en coordenadas del PANEL (la tarjeta blanca de la pantalla) ═══════════════ */

export const PG = {
	ancho: 1500,
	relleno: 36,
	letra: 21,
	titulo: 44,
	huecoTitulo: 20,
	boton: 44,
	huecoBoton: 18,
	/** La ficha: dos campos en fila (etiqueta + campo) y la casilla de «Reutilizable». */
	etiqueta: 30,
	campo: 46,
	casilla: 36,
	huecoFicha: 18,
	alerta: 92,
	huecoAlerta: 14,
	/** La matriz. */
	cabecera: 84,
	fila: 72,
	pie: 50,
	huecoMatriz: 18,
	/** El listado. */
	filaLista: 78,
};

export const UTIL = PG.ancho - PG.relleno * 2;
export const COL = { criterio: 330, peso: 120, nivel: (UTIL - 330 - 120) / 4 };
export const ALTO_FICHA = PG.etiqueta + PG.campo + 12 + PG.casilla;

export type Alertas = { enUso: boolean; pesos: boolean; sinNiveles: boolean };

/** Dónde empieza cada bloque del editor, según qué avisos hay y cuántos criterios. */
export function planoEditor(a: Alertas, filas: number) {
	let y = PG.relleno;
	const titulo = y;
	y += PG.titulo + PG.huecoTitulo;
	const volver = y;
	y += PG.boton + PG.huecoBoton;
	const ficha = y;
	y += ALTO_FICHA + PG.huecoFicha;
	const alertas: Partial<Record<keyof Alertas, number>> = {};
	for (const k of ['enUso', 'pesos', 'sinNiveles'] as const) {
		if (a[k]) { alertas[k] = y; y += PG.alerta + PG.huecoAlerta; }
	}
	const matriz = y;
	y += PG.cabecera + filas * PG.fila + PG.pie + PG.huecoMatriz;
	const mandos = y;
	y += PG.boton + PG.huecoBoton;
	const guardar = y;
	y += PG.boton + PG.relleno;
	return { titulo, volver, ficha, alertas, matriz, mandos, guardar, alto: y };
}

/** El alto fijo del panel: el del editor más lleno que sale (un aviso y tres criterios). */
export const ALTO_PANEL = Math.max(
	planoEditor({ enUso: true, pesos: false, sinNiveles: false }, 3).alto,
	planoEditor({ enUso: false, pesos: true, sinNiveles: true }, 1).alto,
	planoEditor({ enUso: false, pesos: true, sinNiveles: false }, 3).alto,
);

/** El panel en el fotograma: cabe en la banda entre la cabecera y el rótulo. */
export const ENCUADRE = (() => {
	const escala = Math.min((BANDA.alto - 24) / ALTO_PANEL, (1920 - 160) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - ALTO_PANEL * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

export const centro = (r: Rect) => ({ x: r.x + r.ancho / 2, y: r.y + r.alto / 2 });

/* Las piezas, en coordenadas del panel. */

export const X_MATRIZ = PG.relleno;
export const xDeNivel = (j: number) => X_MATRIZ + COL.criterio + COL.peso + j * COL.nivel;

export function rectCriterio(matriz: number, i: number): Rect {
	return { x: X_MATRIZ, y: matriz + PG.cabecera + i * PG.fila, ancho: COL.criterio, alto: PG.fila };
}
export function rectPeso(matriz: number, i: number): Rect {
	return { x: X_MATRIZ + COL.criterio, y: matriz + PG.cabecera + i * PG.fila, ancho: COL.peso, alto: PG.fila };
}
export function rectCelda(matriz: number, i: number, j: number): Rect {
	return { x: xDeNivel(j), y: matriz + PG.cabecera + i * PG.fila, ancho: COL.nivel, alto: PG.fila };
}
/** La columna de pesos entera, de la cabecera al pie. */
export function rectColumnaPesos(matriz: number, filas: number): Rect {
	return { x: X_MATRIZ + COL.criterio, y: matriz, ancho: COL.peso, alto: PG.cabecera + filas * PG.fila + PG.pie };
}
export function rectCabeceraNiveles(matriz: number, niveles: number): Rect {
	return { x: xDeNivel(0), y: matriz, ancho: COL.nivel * niveles, alto: PG.cabecera };
}
export function rectPie(matriz: number, filas: number): Rect {
	return { x: X_MATRIZ, y: matriz + PG.cabecera + filas * PG.fila, ancho: COL.criterio + COL.peso, alto: PG.pie };
}
export function rectAlerta(y: number): Rect {
	return { x: PG.relleno, y, ancho: UTIL, alto: PG.alerta };
}
/** Los campos de la ficha: el nombre a la izquierda y la descripción a la derecha. */
export const ANCHO_CAMPO = (UTIL - 24) / 2;
export function rectNombre(ficha: number): Rect {
	return { x: PG.relleno, y: ficha + PG.etiqueta, ancho: ANCHO_CAMPO, alto: PG.campo };
}

/* Los botones de la fila de mandos, con su ancho de dibujo (el texto a 21 px más el icono). */
export const BOTONES_MANDOS = [
	{ clave: 'criterio', texto: TEXTOS.masCriterio, icono: true, ancho: 130 },
	{ clave: 'nivel', texto: TEXTOS.masNivel, icono: true, ancho: 104 },
	{ clave: 'sembrar', texto: TEXTOS.sembrar, icono: false, ancho: 470 },
] as const;
export const HUECO_BOTONES = 14;

export function rectMando(mandos: number, clave: 'criterio' | 'nivel' | 'sembrar'): Rect {
	let x = PG.relleno;
	for (const b of BOTONES_MANDOS) {
		if (b.clave === clave) { return { x, y: mandos, ancho: b.ancho, alto: PG.boton }; }
		x += b.ancho + HUECO_BOTONES;
	}
	throw new Error(clave);
}
export function rectGuardar(guardar: number): Rect {
	return { x: PG.relleno, y: guardar, ancho: 150, alto: PG.boton };
}
export function rectVolver(volver: number): Rect {
	return { x: PG.relleno, y: volver, ancho: 250, alto: PG.boton };
}

/* El listado. */
export const PLANO_LISTADO = { titulo: PG.relleno, nueva: PG.relleno + PG.titulo + PG.huecoTitulo, lista: PG.relleno + PG.titulo + PG.huecoTitulo + PG.boton + 22 };
export function rectBotonNueva(): Rect {
	return { x: PG.relleno, y: PLANO_LISTADO.nueva, ancho: 220, alto: PG.boton };
}
export function rectFilaLista(i: number): Rect {
	return { x: PG.relleno, y: PLANO_LISTADO.lista + i * (PG.filaLista + 10), ancho: UTIL, alto: PG.filaLista };
}
