import { MAIN, type Rect } from '../personas/comun';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * ALUMNOS DUPLICADOS (`paginas/duplicados/`), EN NÚMEROS.
 *
 * TODO INVENTADO: nombres, documentos, usuarios, fechas, grupos y cuentas de filas. Las tablas que
 * salen en «qué se mueve» son de verdad (`matriculas`, `notas`, `notas_finales`, `ausencias`,
 * `nota_comportamiento` existen en la base), pero sus números son del vídeo.
 *
 * Las medidas salen de `duplicados.scss`: `main` con 1rem × 1.2rem de relleno, el párrafo de
 * 62ch, los bloques con 2rem debajo, la cabeza del grupo sobre fondo gris y cada ficha con su foto
 * de 40 px. Aquí las fotos son el avatar dibujado.
 */

export interface FichaDup {
	id: number;
	nombres: string;
	apellidos: string;
	tipoDoc: string;
	documento: string;
	creada: string;
	matriculas: number;
	ultimoGrupo: string;
	ultimoYear: number;
	estado: string;
	notas: number;
	cara: { tipo: 'mujer' | 'hombre'; variante: number };
}

export const POR_DOCUMENTO: { clave: string; fichas: FichaDup[] } = {
	clave: '1093456781',
	fichas: [
		{ id: 2031, nombres: 'Samuel David', apellidos: 'Ortiz Pineda', tipoDoc: 'Tarjeta de identidad', documento: '1093456781', creada: '2018-01-22', matriculas: 2, ultimoGrupo: '3°A', ultimoYear: 2019, estado: 'retirado', notas: 52, cara: { tipo: 'hombre', variante: 3 } },
		{ id: 3187, nombres: 'Samuel David', apellidos: 'Ortiz Pineda', tipoDoc: 'Tarjeta de identidad', documento: '1093456781', creada: '2024-01-15', matriculas: 3, ultimoGrupo: '9°B', ultimoYear: 2026, estado: 'matriculado', notas: 138, cara: { tipo: 'hombre', variante: 3 } },
	],
};

export const POR_NOMBRE: { clave: string; fichas: FichaDup[] } = {
	clave: 'Juan José Cárdenas Vega',
	fichas: [
		{ id: 2477, nombres: 'Juan José', apellidos: 'Cárdenas Vega', tipoDoc: 'Tarjeta de identidad', documento: '1098712345', creada: '2021-01-18', matriculas: 6, ultimoGrupo: '7°A', ultimoYear: 2026, estado: 'matriculado', notas: 301, cara: { tipo: 'hombre', variante: 5 } },
		{ id: 2903, nombres: 'Juan José', apellidos: 'Cárdenas Vega', tipoDoc: 'Registro civil', documento: '1027654321', creada: '2023-01-16', matriculas: 4, ultimoGrupo: '3°A', ultimoYear: 2026, estado: 'matriculado', notas: 176, cara: { tipo: 'hombre', variante: 1 } },
	],
};

/** Cuál se queda: la de ahora. El diálogo no sugiere ninguna; la elige quien mira. */
export const SE_QUEDA = 1;
export const SE_VACIA = 0;

export const MUEVE = [
	{ tabla: 'matriculas', filas: 2 },
	{ tabla: 'notas', filas: 58 },
	{ tabla: 'notas_finales', filas: 44 },
	{ tabla: 'ausencias', filas: 21 },
	{ tabla: 'nota_comportamiento', filas: 6 },
];
export const FILAS_TOTALES = MUEVE.reduce((n, m) => n + m.filas, 0);
export const CUENTA = { queda: 'samuel.ortiz', otra: 'sortiz2018' };

export const deDonde = (f: FichaDup) => `(${f.ultimoGrupo} ${f.ultimoYear}, #${f.id})`;

/* ── La página ─────────────────────────────────────────────────────────────────────────────── */

export const X0 = MAIN.x + 19;
export const ANCHO = MAIN.ancho - 38;
const Y0 = MAIN.y + 16;

export const ALTO_CABEZA = 42;
export const ALTO_FICHA = 72;
export const ALTO_GRUPO = ALTO_CABEZA + ALTO_FICHA * 2 + 2;

export const Y = {
	cabecera: Y0,
	intro: Y0 + 46,
	bloque1: Y0 + 46 + 110 + 22,
	grupo1: Y0 + 46 + 110 + 22 + 26 + 4 + 22 + 13,
	bloque2: Y0 + 46 + 110 + 22 + 26 + 4 + 22 + 13 + ALTO_GRUPO + 32,
	nota2: Y0 + 46 + 110 + 22 + 26 + 4 + 22 + 13 + ALTO_GRUPO + 32 + 30,
	grupo2: Y0 + 46 + 110 + 22 + 26 + 4 + 22 + 13 + ALTO_GRUPO + 32 + 30 + 34 + 13,
};
export const ALTO_PAGINA = Y.grupo2 + ALTO_GRUPO + 32 - (MAIN.y - 16);

export const INTRO: Rect = { x: X0, y: Y.intro, ancho: 540, alto: 110 };
export const GRUPO1: Rect = { x: X0, y: Y.grupo1, ancho: ANCHO, alto: ALTO_GRUPO };
export const GRUPO2: Rect = { x: X0, y: Y.grupo2, ancho: ANCHO, alto: ALTO_GRUPO };
export const NOTA2: Rect = { x: X0, y: Y.nota2, ancho: 560, alto: 34 };
export const BOTON_UNIR = { ancho: 76, alto: 24 };
/** El «Unir» de la cabeza de un grupo: a la derecha, tras el «2 fichas» que empuja con `margin-right: auto`. */
export function rectUnir(grupo: Rect): Rect {
	return { x: grupo.x + grupo.ancho - 13 - BOTON_UNIR.ancho, y: grupo.y + (ALTO_CABEZA - BOTON_UNIR.alto) / 2, ...BOTON_UNIR };
}

/* ── El diálogo ────────────────────────────────────────────────────────────────────────────── */

export const DIALOGO_X = 300;
export const DIALOGO_ANCHO = 840;
export const DIALOGO_Y = 86;
export const GUIA = 26;
const TABLAS = 34;
export const ALTO_ELEGIR = 56 + 18 + GUIA + 14 + 2 * 76 + 8 + 24 + 60;
export const ALTO_REVISADO = 56 + 18 + GUIA + 14 + 70 + 14 + TABLAS + 14 + 40 + 14 + 46 + 24 + 60;
export const dialogo = (alto: number): Rect => ({ x: DIALOGO_X, y: DIALOGO_Y, ancho: DIALOGO_ANCHO, alto });

const CUERPO_X = DIALOGO_X + 24;
const CUERPO_Y = DIALOGO_Y + 56 + 18;
const CUERPO_ANCHO = DIALOGO_ANCHO - 48;

/** Las dos fichas del paso «elegir», bajo la guía de 48. */
export function rectFichaRadio(i: number): Rect {
	return { x: CUERPO_X, y: CUERPO_Y + GUIA + 14 + i * (76 + 8), ancho: CUERPO_ANCHO, alto: 76 };
}

/** Los bloques del paso «revisado». */
export const REVISADO = (() => {
	let y = CUERPO_Y;
	const b = (alto: number, hueco = 14) => { const r = { x: CUERPO_X, y, ancho: CUERPO_ANCHO, alto }; y += alto + hueco; return r; };
	return { guia: b(GUIA), cifra: b(70), tablas: b(TABLAS), cuenta: b(40), peligro: b(46) };
})();

/** Los botones del pie, de derecha a izquierda. */
export function rectPie(alto: number, anchos: number[], i: number): Rect {
	let x = DIALOGO_X + DIALOGO_ANCHO - 24;
	for (let k = anchos.length - 1; k >= i; k--) {
		x -= anchos[k];
		if (k > i) { x -= 8; }
	}
	return { x, y: DIALOGO_Y + alto - 60 + 14, ancho: anchos[i], alto: 32 };
}
export const PIE_ELEGIR = [100, 190];
export const PIE_REVISADO = [84, 156];
