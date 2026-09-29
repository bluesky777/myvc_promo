import { ALUMNOS } from '../../notas/planilla';
import { geometriaDePlanilla, planillaEnElFotograma } from '../../notas/Escena';
import { SUBE_LA_PANTALLA } from '../tema';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE AL PASAR ASISTENCIA EN LA PLANILLA, Y DÓNDE CAE.
 *
 * LAS COLUMNAS SON LAS DE app2 (`paginas/notas/planilla-notas.html`, `td.faltas`): una casilla con
 * el número del periodo y, detrás, **un botón por falta con su fecha**, el mes en dos letras
 * («18 ag»). La columna mide 250 px en la aplicación y ahí se para; aquí también es la más ancha,
 * y para que quepa se estrechan el nombre y las notas.
 *
 * LOS NÚMEROS SON LOS DE `notas/planilla.ts` (Mateo 2 ausencias, Valentina 3 y 1 tardanza…): lo
 * que se inventa aquí son sólo las fechas, que aquella planilla no pinta. Y las notas son las que
 * dejó `planilla-teclear`.
 *
 * HOY ES EL 28 DE SEPTIEMBRE. La fecha de la falta nueva la pone el servidor (`Carbon::now()` si
 * no se manda), y el aviso la dice con tres letras: «Ausencia del 28 sep anotada».
 */

export const HOY = { boton: '28 se', aviso: '28 sep' };

/** Las fechas de las faltas que ya había, en el orden en que se anotaron. */
export const FECHAS: Record<string, { ausencias: string[]; tardanzas: string[] }> = {
	'Acosta Rivera, Sara Isabel': { ausencias: [], tardanzas: ['3 se'] },
	'Rojas Valencia, Mateo David': { ausencias: ['14 ag', '9 se'], tardanzas: [] },
	'Cardona Ruiz, Mariana': { ausencias: [], tardanzas: [] },
	'Delgado Peña, Samuel': { ausencias: ['21 ag'], tardanzas: ['4 ag', '16 se'] },
	'Escobar Lozano, Valentina': { ausencias: ['6 ag', '18 ag', '22 se'], tardanzas: ['11 se'] },
	'Fajardo Mejía, Tomás Andrés': { ausencias: [], tardanzas: [] },
};

/* Que las fechas cuadren con los números de la planilla: si alguien los cambia allí, esto avisa. */
ALUMNOS.forEach((a) => {
	const f = FECHAS[a.nombre];
	if (!f || f.ausencias.length !== a.ausencias || f.tardanzas.length !== a.tardanzas) {
		throw new Error(`Datos: las fechas de «${a.nombre}» no cuadran con sus Aus y Tard de notas/planilla.ts.`);
	}
});

export const TOMAS = ALUMNOS.findIndex((a) => a.nombre.startsWith('Fajardo Mejía'));
export const MARIANA = ALUMNOS.findIndex((a) => a.nombre.startsWith('Cardona Ruiz'));
export const VALENTINA = ALUMNOS.findIndex((a) => a.nombre.startsWith('Escobar Lozano'));

/* ── La geometría ─────────────────────────────────────────────────────────────────────────── */

export const ANCHOS = { alumno: 370, nota: 112, total: 100, falta: 236 };

/** El aviso del periodo cerrado, encima de la tabla en el segundo plano. */
export const ENCIMA_CERRADA = 70;

export const GEOMETRIA = geometriaDePlanilla({ anchos: ANCHOS });
export const GEOMETRIA_CERRADA = geometriaDePlanilla({ anchos: ANCHOS, encima: ENCIMA_CERRADA });

export const AJUSTE = { escala: 0.82, y: SUBE_LA_PANTALLA };

/** Dentro de la celda: la casilla del número y los botones, de izquierda a derecha. */
export const CAJA = { izquierda: 12, cuenta: { ancho: 54, alto: 38 }, boton: { ancho: 50, alto: 32 }, hueco: 5 };

type Rect = { x: number; y: number; ancho: number; alto: number };

export function cuentaDe(g: typeof GEOMETRIA, fila: number, cual: 'ausencias' | 'tardanzas'): Rect {
	const c = g.celda(fila, cual);
	return { x: c.x + CAJA.izquierda, y: c.y + (c.alto - CAJA.cuenta.alto) / 2, ancho: CAJA.cuenta.ancho, alto: CAJA.cuenta.alto };
}

export function botonDe(g: typeof GEOMETRIA, fila: number, cual: 'ausencias' | 'tardanzas', i: number): Rect {
	const c = cuentaDe(g, fila, cual);
	return {
		x: c.x + c.ancho + CAJA.hueco + i * (CAJA.boton.ancho + CAJA.hueco),
		y: c.y + (CAJA.cuenta.alto - CAJA.boton.alto) / 2,
		ancho: CAJA.boton.ancho,
		alto: CAJA.boton.alto,
	};
}

/** Las dos columnas enteras, de la cabecera a la última fila. */
export function columnasDeFaltas(g: typeof GEOMETRIA): Rect {
	const aus = g.celda(0, 'ausencias');
	const ultima = g.celda(ALUMNOS.length - 1, 'tardanzas');
	const arriba = aus.y - 93;
	return { x: aus.x, y: arriba, ancho: aus.ancho * 2, alto: ultima.y + ultima.alto - arriba };
}

export const fotograma = (g: typeof GEOMETRIA, r: Rect) => planillaEnElFotograma(g, r, AJUSTE);

/* Que los botones de la fila más cargada quepan en su columna, como en app2 (hasta 250 px). */
{
	const mas = Math.max(...Object.values(FECHAS).map((f) => Math.max(f.ausencias.length, f.tardanzas.length + 0)));
	const ultimo = botonDe(GEOMETRIA, 0, 'ausencias', mas - 1);
	const celda = GEOMETRIA.celda(0, 'ausencias');
	if (ultimo.x + ultimo.ancho > celda.x + celda.ancho - 4) {
		throw new Error('Datos: los botones de fecha no caben en la columna de Aus.');
	}
}
