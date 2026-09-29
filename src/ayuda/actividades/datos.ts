import { ALUMNOS } from '../../notas/planilla';
import { BANDA } from '../encuadre';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «ACTIVIDADES» (`/act`), Y DÓNDE CAE.
 *
 * TRES PANTALLAS DE app2, las del módulo nuevo:
 *
 *   `paginas/act-bandeja`     la bandeja: «Las que creé», una fila por actividad (azulejo del modo,
 *                             título con su estado, «Respuestas» N de M, «Cierra»), y a la derecha
 *                             «Te toca a ti», «Esta semana» y «Las de antes».
 *   `paginas/act-resultados`  lo de un cuestionario: «Respondieron» (anillo y notas), «Faltan, por
 *                             grupo», y un bloque por pregunta.
 *   `paginas/act-entregas`    lo de una tarea: las cuatro cifras, la lista de alumnos y la entrega
 *                             del elegido con su nota.
 *
 * LA FILA ENTERA ES EL ENLACE (`act-bandeja.ts`, `destino()`): un borrador abre sus preguntas; una
 * tarea publicada, sus Entregas; lo demás, sus Resultados. No depende de a quién va dirigida.
 *
 * `/act` VA DENTRO DE LA CÁSCARA con `panelPropio`: sin el marco blanco único, cada bloque es su
 * propia tarjeta blanca sobre el gris. Aquí se dibuja ese lienzo gris con sus tarjetas, acercado.
 *
 * Tamaños: los de las `.scss` de app2 por 1,4 (el panel es de 1400 y la pantalla de ~1000 px útiles).
 *
 * LAS ACTIVIDADES, LAS FECHAS Y LAS RESPUESTAS SON INVENTADAS. Hoy es el lunes 28 de septiembre; el
 * grupo es 9B, con los seis de siempre (`notas/planilla`).
 */

export const HOY = { dia: 28, nombre: 'lun' };

export type Modo = 'tarea' | 'cuestionario' | 'encuesta';
export type Estado = 'borrador' | 'abierta' | 'cerrada';

export interface FilaAct {
	modo: Modo;
	titulo: string;
	estado: Estado;
	detalle: string;
	respondieron: number | null;
	destinatarios: number;
	cierra: { dia: string; hora: string } | null;
}

export const FILAS: FilaAct[] = [
	{ modo: 'tarea', titulo: 'Taller: sistemas de ecuaciones', estado: 'abierta', detalle: 'Tarea · Matemáticas · 9B', respondieron: 4, destinatarios: 6, cierra: { dia: 'vie 2 oct', hora: '11:59 p. m.' } },
	{ modo: 'cuestionario', titulo: 'Repaso de álgebra para el examen', estado: 'abierta', detalle: 'Cuestionario · Matemáticas · 9B · Se califica solo', respondieron: 5, destinatarios: 6, cierra: { dia: 'mié 30 sep', hora: '6:00 p. m.' } },
	{ modo: 'cuestionario', titulo: 'Quiz: ecuaciones de primer grado', estado: 'borrador', detalle: 'Cuestionario · Matemáticas · 9A · Se califica solo', respondieron: null, destinatarios: 0, cierra: null },
	{ modo: 'tarea', titulo: 'Guía: la célula y sus partes', estado: 'cerrada', detalle: 'Tarea · Ciencias Naturales · 8A', respondieron: 27, destinatarios: 29, cierra: { dia: 'vie 25 sep', hora: '11:59 p. m.' } },
];
export const TAREA = 0;
export const CUESTIONARIO = 1;
export const BORRADOR = 2;

/* `comunes/act/chapas.scss` y `textos.ts`. */
export const COLOR_DE_MODO: Record<Modo, { fondo: string; texto: string }> = {
	tarea: { fondo: '#e2f4f1', texto: '#0b5e53' },
	cuestionario: { fondo: '#f1eafa', texto: '#5b3494' },
	encuesta: { fondo: '#fff1d6', texto: '#7a4f00' },
};
export const NOMBRE_DE_MODO: Record<Modo, string> = { tarea: 'Tarea', cuestionario: 'Cuestionario', encuesta: 'Encuesta' };
export const ESTADO: Record<Estado, { nombre: string; fondo: string; texto: string }> = {
	borrador: { nombre: 'Borrador', fondo: '#f5f5f5', texto: '#595959' },
	abierta: { nombre: 'Abierta', fondo: '#eefbe3', texto: '#2b6b0b' },
	cerrada: { nombre: 'Cerrada', fondo: '#f5f5f5', texto: '#595959' },
};
export const PUNTO_DE_MODO: Record<Modo, string> = { tarea: '#0f7a6c', cuestionario: '#7a4bb5', encuesta: '#b27400' };

export const SEMANA = [
	{ nombre: 'lun', n: 28, modos: [] as Modo[] },
	{ nombre: 'mar', n: 29, modos: [] as Modo[] },
	{ nombre: 'mié', n: 30, modos: ['cuestionario'] as Modo[] },
	{ nombre: 'jue', n: 1, modos: [] as Modo[] },
	{ nombre: 'vie', n: 2, modos: ['tarea'] as Modo[] },
	{ nombre: 'sáb', n: 3, modos: [] as Modo[] },
	{ nombre: 'dom', n: 4, modos: [] as Modo[] },
];

export const TEXTOS = {
	titulo: 'Actividades',
	sub: 'Tareas, cuestionarios y encuestas: las que creas y las que te toca responder.',
	nueva: 'Nueva',
	pestanas: ['Las que creé · 4', 'Para responder · 0'],
	filtros: ['Todas', 'Tareas', 'Cuestionarios', 'Encuestas'],
	columnas: ['Actividad', 'Respuestas', 'Cierra'],
	sinPublicar: 'sin publicar',
	sinFecha: 'sin fecha',
	teToca: 'Te toca a ti',
	borradores: 'borrador sin publicar',
	semana: 'Esta semana',
	enCalendario: 'sale también en el calendario',
	antes: 'Las de antes',
	antesTexto: 'Las actividades que armaste con la herramienta anterior siguen donde estaban.',
	antesBoton: 'Ver las actividades de antes',
	volver: 'Actividades',
	editar: 'Editar',
	duplicar: 'Duplicar',
	cerrar: 'Cerrar…',
	ver: 'Ver',
	todos: 'Todos',
	pista: 'Clic en una columna para ver sólo ese grado o grupo · menos de 5 respuestas no se desglosan',
	respondieron: 'Respondieron',
	faltan: 'Faltan, por grupo',
	recordar: 'Recordar a el que falta',
	cifras: ['Entregaron', 'Tarde', 'Sin entregar', 'Calificadas'],
	recordarFaltan: 'Recordar a los 2 que faltan',
	planilla: 'La nota se escribe sola en la planilla',
	filtrosEntregas: ['Todas', 'Por calificar', 'Sin entregar', 'Calificadas'],
	suTexto: 'Su texto',
	nota: 'Nota (sobre 100)',
	comentario: 'Comentario de vuelta',
	comentarioPista: '(lo ven el alumno y su acudiente)',
	guardar: 'Guardar',
	guardarSiguiente: 'Guardar y siguiente',
};

/* ── Resultados del cuestionario ─────────────────────────────────────────────────────────── */

export const RESULTADOS = {
	titulo: FILAS[CUESTIONARIO].titulo,
	sub: 'Matemáticas · 9B',
	cierra: '· cierra mié 30 sep, 6:00 p. m.',
	respondieron: 5,
	destinatarios: 6,
	notas: { promedio: 78, aprobaron: 4, reprobaron: 1 },
	/** Falta Tomás Andrés, el sexto. */
	falta: 5,
	pregunta: '1. ¿Cuál es la solución de 2x + 3 = 11?',
	meta: 'Opción única · 5 respuestas · ',
	acertaron: '4 acertaron',
	opciones: [
		{ texto: 'x = 7', pct: 20 },
		{ texto: '✓ x = 4', pct: 80 },
		{ texto: 'x = 3', pct: 0 },
		{ texto: 'x = 8', pct: 0 },
	],
};
/* `act-resultados.scss`: la paleta de las columnas. */
export const PALETA = ['#2a78d6', '#eb6834', '#1baf7a', '#e87ba4', '#4a3aa7'];

/* ── Entregas de la tarea ────────────────────────────────────────────────────────────────── */

export type EstadoEntrega = 'calificada' | 'entregada' | 'sin_entregar';
export const ESTADO_ENTREGA: Record<EstadoEntrega, { nombre: string; fondo: string; texto: string }> = {
	calificada: { nombre: 'Calificada', fondo: '#f6ffed', texto: '#389e0d' },
	entregada: { nombre: 'Por calificar', fondo: '#e6f4ff', texto: '#0958d9' },
	sin_entregar: { nombre: 'Sin entregar', fondo: '#fff1f0', texto: '#cf1322' },
};

/** El nombre como lo trae `act/{id}/entregas`: apellidos y nombres, sin coma. */
const sinComa = (n: string) => n.replace(',', '');
export const ENTREGAS: { nombre: string; sexo: 'mujer' | 'hombre'; cuando: string; estado: EstadoEntrega; nota: number | null; texto: string }[] = [
	{ nombre: sinComa(ALUMNOS[0].nombre), sexo: ALUMNOS[0].sexo, cuando: 'entregó jue 24 sep, 7:40 p. m.', estado: 'calificada', nota: 92, texto: 'Los tres por igualación. Comprobé cada solución reemplazándola en las dos ecuaciones.' },
	{ nombre: sinComa(ALUMNOS[1].nombre), sexo: ALUMNOS[1].sexo, cuando: 'entregó vie 25 sep, 9:15 p. m.', estado: 'calificada', nota: 85, texto: '' },
	{ nombre: sinComa(ALUMNOS[2].nombre), sexo: ALUMNOS[2].sexo, cuando: 'entregó sáb 26 sep, 4:02 p. m.', estado: 'entregada', nota: null, texto: 'Resolví los tres sistemas por sustitución. En el tercero me dio x = 2, y = −1, y lo comprobé en las dos ecuaciones.' },
	{ nombre: sinComa(ALUMNOS[3].nombre), sexo: ALUMNOS[3].sexo, cuando: 'entregó dom 27 sep, 8:12 p. m.', estado: 'entregada', nota: null, texto: '' },
	{ nombre: sinComa(ALUMNOS[4].nombre), sexo: ALUMNOS[4].sexo, cuando: 'sin entregar', estado: 'sin_entregar', nota: null, texto: '' },
	{ nombre: sinComa(ALUMNOS[5].nombre), sexo: ALUMNOS[5].sexo, cuando: 'sin entregar', estado: 'sin_entregar', nota: null, texto: '' },
];
/** La que se elige y se califica. */
export const MARIANA = 2;
export const NOTA_DE_MARIANA = '88';
export const CUENTA = { entregaron: 4, total: 6, tarde: 0, faltan: 2, calificadas: 2 };
export const TAREA_SUB = 'Matemáticas · 9B · cierra vie 2 oct, 11:59 p. m.';
export const PERIODO = 2;

/* ═══ LA GEOMETRÍA, en coordenadas del PANEL (el lienzo gris con sus tarjetas) ══════════════ */

export const PG = { ancho: 1400, alto: 780, lados: 28, arriba: 24, hueco: 20, relleno: 20, letra: 19, radio: 16, boton: 44 };
export const LIENZO = '#f0f2f5';
export const LINEA = '#f0f0f0';
export const SUAVE = '#595959';

export type Rect = { x: number; y: number; ancho: number; alto: number; radio?: number };

/* La bandeja. */
export const B = {
	cuerpo: 124,
	lista: { x: PG.lados, ancho: 964 },
	lado: { x: PG.lados + 964 + 24, ancho: 356 },
	mandos: 40,
	titulos: 26,
	fila: 80,
	huecoFila: 3,
	azulejo: 52,
	duplicar: 48,
	/** Las columnas de la fila: azulejo | qué | respuestas | cierra | flecha. */
	col: { gap: 18, cuanto: 150, cierra: 120, flecha: 18 },
};
const X_FILAS = B.lista.x + PG.relleno;
const ANCHO_FILA = B.lista.ancho - PG.relleno * 2 - B.duplicar - 10;
const Y_MANDOS = B.cuerpo + PG.relleno;
const Y_TITULOS = Y_MANDOS + B.mandos + 20;
const Y_FILAS = Y_TITULOS + B.titulos + 6;

export function rectFila(i: number): Rect {
	return { x: X_FILAS, y: Y_FILAS + i * (B.fila + B.huecoFila), ancho: ANCHO_FILA, alto: B.fila };
}
export function rectDuplicar(i: number): Rect {
	const f = rectFila(i);
	return { x: f.x + f.ancho + 10, y: f.y + (B.fila - B.duplicar) / 2, ancho: B.duplicar, alto: B.duplicar };
}
/** Dónde empieza cada columna dentro de la fila (el relleno de la fila es 17). */
export function columnasDeFila() {
	const r = 17;
	const x0 = X_FILAS + r;
	const fin = X_FILAS + ANCHO_FILA - r;
	const flecha = fin - B.col.flecha;
	const cierra = flecha - B.col.gap - B.col.cierra;
	const cuanto = cierra - B.col.gap - B.col.cuanto;
	const que = x0 + B.azulejo + B.col.gap;
	return { x0, que, anchoQue: cuanto - B.col.gap - que, cuanto, cierra, flecha };
}
export const Y_DE = { mandos: Y_MANDOS, titulos: Y_TITULOS, filas: Y_FILAS };
export function rectLista(): Rect {
	const ultima = rectFila(FILAS.length - 1);
	return { x: B.lista.x, y: B.cuerpo, ancho: B.lista.ancho, alto: ultima.y + ultima.alto + PG.relleno - B.cuerpo };
}
/** La columna «Respuestas», del título a la última fila. */
export function rectColumnaRespuestas(): Rect {
	const c = columnasDeFila();
	const ultima = rectFila(FILAS.length - 1);
	return { x: c.cuanto - 10, y: Y_TITULOS - 4, ancho: B.col.cuanto + 20, alto: ultima.y + ultima.alto - Y_TITULOS + 4 };
}
export const LADO = {
	toca: { y: B.cuerpo, alto: 124 },
	semana: { y: B.cuerpo + 124 + 20, alto: 228 },
	antes: { y: B.cuerpo + 124 + 20 + 228 + 20, alto: 176 },
};

/* Las cabeceras de Resultados y de Entregas: la misma tarjeta. */
export const CAB = { x: PG.lados, y: PG.arriba, ancho: PG.ancho - PG.lados * 2, alto: 100 };
export function rectVolver(): Rect {
	return { x: CAB.x + PG.relleno, y: CAB.y + (CAB.alto - 30) / 2, ancho: 150, alto: 30 };
}

/* Resultados. */
export const RS = { filtros: 136, alturaFiltros: 42, arriba: 190, alturaArriba: 282, izquierda: 448, anillo: 150 };
export function rectRespondieron(): Rect {
	return { x: PG.lados, y: RS.arriba, ancho: RS.izquierda, alto: RS.alturaArriba };
}
export function rectFaltan(): Rect {
	const x = PG.lados + RS.izquierda + PG.hueco;
	return { x, y: RS.arriba, ancho: PG.ancho - PG.lados - x, alto: RS.alturaArriba };
}
export function rectPregunta(): Rect {
	const y = RS.arriba + RS.alturaArriba + PG.hueco;
	return { x: PG.lados, y, ancho: PG.ancho - PG.lados * 2, alto: PG.alto - 24 - y };
}

/* Entregas. */
export const EN = { cifras: 140, alturaCifras: 146, hueco: 17, cuerpo: 302, izquierda: 520, fila: 60, huecoFila: 2, segmentado: 40 };
export function rectCifra(i: number): Rect {
	const unidad = (PG.ancho - PG.lados * 2 - EN.hueco * 4) / 5.3;
	return { x: PG.lados + i * (unidad + EN.hueco), y: EN.cifras, ancho: i === 4 ? unidad * 1.3 : unidad, alto: EN.alturaCifras };
}
export function rectCifras(): Rect {
	const a = rectCifra(0);
	const d = rectCifra(3);
	return { x: a.x, y: a.y, ancho: d.x + d.ancho - a.x, alto: a.alto };
}
export function rectListaEntregas(): Rect {
	return { x: PG.lados, y: EN.cuerpo, ancho: EN.izquierda, alto: PG.alto - 24 - EN.cuerpo };
}
export function rectDetalle(): Rect {
	const x = PG.lados + EN.izquierda + PG.hueco;
	return { x, y: EN.cuerpo, ancho: PG.ancho - PG.lados - x, alto: PG.alto - 24 - EN.cuerpo };
}
export function rectCuerpoEntregas(): Rect {
	const l = rectListaEntregas();
	const d = rectDetalle();
	return { x: l.x, y: l.y, ancho: d.x + d.ancho - l.x, alto: l.alto };
}
export function rectFilaEntrega(i: number): Rect {
	const l = rectListaEntregas();
	return { x: l.x + 17, y: l.y + 17 + EN.segmentado + 14 + i * (EN.fila + EN.huecoFila), ancho: l.ancho - 34, alto: EN.fila };
}
/** El campo de la nota, en la tarjeta del detalle. */
export function rectCampoNota(): Rect {
	const d = rectDetalle();
	return { x: d.x + 22, y: d.y + 290, ancho: 154, alto: 52 };
}

export const ENCUADRE = (() => {
	const escala = Math.min(1.1, (BANDA.alto - 24) / PG.alto, (1920 - 160) / PG.ancho);
	return { escala, x: (1920 - PG.ancho * escala) / 2, y: BANDA.arriba + (BANDA.alto - PG.alto * escala) / 2 };
})();

export function alFotograma(r: Rect, radio = 8): Rect {
	const e = ENCUADRE;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

/* Que nada se salga del panel. */
for (const r of [rectLista(), rectPregunta(), rectCuerpoEntregas()]) {
	if (r.y + r.alto > PG.alto - 8) { throw new Error('Actividades: una tarjeta se sale del panel.'); }
}
if (rectFilaEntrega(ENTREGAS.length - 1).y + EN.fila > rectListaEntregas().y + rectListaEntregas().alto - 8) {
	throw new Error('Actividades: la lista de entregas no cabe en su tarjeta.');
}
if (LADO.antes.y + LADO.antes.alto > PG.alto - 8) { throw new Error('Actividades: la columna de la derecha se sale del panel.'); }
