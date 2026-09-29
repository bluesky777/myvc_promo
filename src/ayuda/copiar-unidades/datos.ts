import { VOCABULARIO } from '../../comunes/vocabulario';
import { COLUMNAS } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import { MEDIDAS } from '../medidas';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «COPIAR UNIDADES A OTRA ASIGNATURA», Y DÓNDE CAE.
 *
 * SE ENTRA POR LA ÚNICA PUERTA QUE TIENE: el botón «Copiar a otra asignatura» de la pantalla de
 * Unidades (`paginas/unidades/unidades.html`), que deja el ORIGEN ya elegido. La pantalla es
 * `paginas/copiar-unidades` y sus palabras dicen el nombre que el colegio da a las unidades
 * (`UNIDADES()`, aquí «Logros») sin concordar: «A copiar: 1 de 1 — Logros».
 *
 * SE COPIA EL LOGRO DE 9°B, PERIODO 2 (Álgebra, con sus tres indicadores de la planilla) AL PERIODO
 * 3 DE 9°A, que todavía no tiene nada: es planear el periodo que viene con lo que ya funcionó. Como
 * el destino es de OTRO GRUPO, el interruptor de las notas no sale y en su sitio va la etiqueta
 * «Las notas no se copian: el destino es de otro grupo» (`notasBloqueadas`).
 *
 * El docente es el de Matemáticas de los demás vídeos: Hernando Pabón Rivera (la cara de la barra).
 */

export const U = VOCABULARIO.unidades;
export const S = VOCABULARIO.subunidades;
export const DOCENTE = 'Hernando Pabón Rivera';
export const LOGRO = 'Álgebra';
export const INDICADORES = COLUMNAS;
export const ORIGEN = { anio: '2026', periodo: 'Periodo 2', asignatura: 'Matemáticas — Noveno B' };
export const DESTINO = { anio: '2026', periodo: 'Periodo 3', asignatura: 'Matemáticas — Noveno A' };
/** Las opciones de los desplegables del destino, con la que se elige. */
export const OPCIONES = {
	docente: ['Ana María Herrera Lugo', DOCENTE, 'Diego Ocampo Ruiz', 'Luisa Bernal Pino'],
	anio: ['2026', '2025'],
	periodo: ['Periodo 1', 'Periodo 2', 'Periodo 3', 'Periodo 4'],
	asignatura: ['Ciencias Naturales — Octavo A', 'Matemáticas — Noveno A', 'Matemáticas — Noveno B', 'Estadística — Décimo A'],
};
export const ELEGIDA = {
	docente: OPCIONES.docente.indexOf(DOCENTE),
	anio: OPCIONES.anio.indexOf(DESTINO.anio),
	periodo: OPCIONES.periodo.indexOf(DESTINO.periodo),
	asignatura: OPCIONES.asignatura.indexOf(DESTINO.asignatura),
};

export const TEXTOS = {
	titulo: `Copiar ${U}`,
	recargar: 'Recargar',
	origen: 'Origen — de dónde se copia',
	destino: 'Destino — a dónde se copia',
	campos: ['Docente', 'Año', 'Periodo', 'Asignatura'],
	marcadores: ['Elige un docente', 'Elige un año', 'Elige un periodo', 'Elige una asignatura'],
	aCopiar: `A copiar: 1 de 1 — ${U}`,
	todas: 'Todas',
	ninguna: 'Ninguna',
	datosLogro: `100% · ${INDICADORES.length} de ${S}`,
	pista: 'Elige docente, año, periodo y asignatura.',
	vacioDestino: `El destino no tiene ${U} todavía.`,
	yaTiene: `El destino ya tiene 1 — ${U}`,
	conSub: `Copiar con ${S}`,
	notasNo: 'Las notas no se copian: el destino es de otro grupo',
	copiar: 'Copiar lo marcado (1)',
	resultado: `Se copiaron: 1 — ${U} · ${INDICADORES.length} — ${S} · 0 notas`,
	toast: 'Copiado con éxito',
};

/* ═══ LA PANTALLA DE UNIDADES, dentro de la cáscara (coordenadas de la CÁSCARA) ═══════════════ */

export const UN = { arriba: 26, lados: 32, cabecera: 44, acciones: { y: 60, alto: 36 }, tarjeta: { y: 118 } };
export const BOTONES_UNIDADES = [
	{ texto: 'Planilla', ancho: 118 },
	{ texto: 'Rúbricas', ancho: 118 },
	{ texto: 'Copiar a otra asignatura', ancho: 250 },
];
export function botonDeUnidades(i: number) {
	let x = MEDIDAS.menu + UN.lados;
	for (let k = 0; k < i; k++) { x += BOTONES_UNIDADES[k].ancho + 10; }
	return { x, y: MEDIDAS.barra + UN.arriba + UN.acciones.y, ancho: BOTONES_UNIDADES[i].ancho, alto: UN.acciones.alto };
}

/* ═══ LA PANTALLA DE COPIAR, a pantalla completa (coordenadas del PANEL) ══════════════════════ */

export const PG = {
	ancho: 1600,
	relleno: 32,
	letra: 21,
	titulo: 44,
	hueco: 16,
	cabeceraTarjeta: 50,
	rellenoTarjeta: 18,
	etiqueta: 28,
	control: 44,
	huecoCampo: 12,
	lista: 120,
	mandos: 72,
	resultado: 52,
};
export const UTIL = PG.ancho - PG.relleno * 2;
export const ANCHO_TARJETA = (UTIL - 24) / 2;
export const ALTO_CAMPO = PG.etiqueta + PG.control + PG.huecoCampo;
export const ALTO_TARJETA = PG.cabeceraTarjeta + PG.rellenoTarjeta + 4 * ALTO_CAMPO + PG.lista + PG.rellenoTarjeta;

export const Y = (() => {
	let y = PG.relleno;
	const titulo = y; y += PG.titulo + PG.hueco;
	const tarjetas = y; y += ALTO_TARJETA + PG.hueco;
	const mandos = y; y += PG.mandos + 8 + PG.resultado + PG.relleno;
	return { titulo, tarjetas, mandos, alto: y };
})();

export const ENCUADRE = (() => {
	const escala = Math.min((BANDA.alto - 24) / Y.alto, (1920 - 120) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - Y.alto * escala) / 2 };
})();

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };
export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

export const xTarjeta = (lado: 0 | 1) => PG.relleno + lado * (ANCHO_TARJETA + 24);
export function rectTarjeta(lado: 0 | 1): Rect {
	return { x: xTarjeta(lado), y: Y.tarjetas, ancho: ANCHO_TARJETA, alto: ALTO_TARJETA };
}
/** El control del campo `i` (0 docente … 3 asignatura) de una tarjeta. */
export function rectControl(lado: 0 | 1, i: number): Rect {
	return {
		x: xTarjeta(lado) + PG.rellenoTarjeta,
		y: Y.tarjetas + PG.cabeceraTarjeta + PG.rellenoTarjeta + i * ALTO_CAMPO + PG.etiqueta,
		ancho: ANCHO_TARJETA - PG.rellenoTarjeta * 2,
		alto: PG.control,
	};
}
export const ALTO_OPCION = 40;
export function rectOpcion(lado: 0 | 1, i: number, k: number): Rect {
	const c = rectControl(lado, i);
	return { x: c.x, y: c.y + c.alto + 4 + 4 + k * ALTO_OPCION, ancho: c.ancho, alto: ALTO_OPCION };
}
export function rectLista(lado: 0 | 1): Rect {
	return { x: xTarjeta(lado) + PG.rellenoTarjeta, y: Y.tarjetas + PG.cabeceraTarjeta + PG.rellenoTarjeta + 4 * ALTO_CAMPO, ancho: ANCHO_TARJETA - PG.rellenoTarjeta * 2, alto: PG.lista };
}
export function rectMandos(): Rect {
	return { x: PG.relleno, y: Y.mandos, ancho: UTIL, alto: PG.mandos };
}
export const ANCHO_BOTON_COPIAR = 290;
export function rectBotonCopiar(): Rect {
	return { x: PG.relleno + UTIL - 20 - ANCHO_BOTON_COPIAR, y: Y.mandos + (PG.mandos - 44) / 2, ancho: ANCHO_BOTON_COPIAR, alto: 44 };
}
export function rectEtiquetaNotas(): Rect {
	return { x: PG.relleno + 20 + 300, y: Y.mandos + (PG.mandos - 38) / 2, ancho: 470, alto: 38 };
}
