import { ALUMNOS, COLUMNAS, MINIMA_ACEPTADA, UNIDAD } from '../../notas/planilla';
import { BANDA } from '../encuadre';
import { RITMO_AYUDA } from '../planilla/guion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE SE VE EN «NIVELAR NO ES CORREGIR», Y DÓNDE CAE CADA COSA.
 *
 * LA MISMA PLANILLA DE LOS VÍDEOS ANTERIORES, UNA SEMANA DESPUÉS. 9°B Matemáticas con los tres
 * tecleos de `planilla-teclear` ya puestos: Valentina tiene 58 en el taller y 55 en el quiz, que son
 * las dos notas perdidas que salían en «Notas perdidas» (vídeo 1). Y el periodo 2 está en
 * «Nivelando», que es como lo dejó el vídeo 2: por eso arriba sale el aviso de la semana de
 * nivelaciones.
 *
 * SE NIVELA EL QUIZ, 55 -> 85, Y QUEDA 60. La regla es «topada», la de por defecto
 * (`years.regla_nivelacion`), con la mínima en 60 (`MINIMA_ACEPTADA`). Eso deja su total en
 * (58 + 60 + 62) / 3 = 60, que es la definitiva que el boletín del vídeo 4 imprime con el 58 tachado.
 *
 * LA PLANILLA SE DIBUJA AQUÍ Y NO SE REUSA `notas/Escena.tsx` porque aquélla es la escena de
 * teclear --monta las filas, teclea, espera el lote--, y ésta es otra cosa: la planilla quieta, con
 * el aviso del periodo, el «Modo nivelación» y un diálogo encima. Las medidas de la tabla son las
 * mismas (se copian abajo) para que las dos se vean iguales.
 */

/* ── La planilla, con las notas después del vídeo de teclear ──────────────────────────────── */

export const NOTAS: (number | null)[][] = ALUMNOS.map((a, fila) => {
	const t = RITMO_AYUDA.TECLEOS.find((x) => x.fila === fila);
	return a.notas.map((n, c) => (c === 1 && t ? Number(t.valor) : n));
});

export const VALENTINA = 4;
/** La que se nivela: el quiz de Valentina. */
export const COLUMNA_NIVELADA = COLUMNAS.indexOf('Quiz');
export const INICIAL = NOTAS[VALENTINA][COLUMNA_NIVELADA]!;

/** Lo que sacó en la nivelación, tecla a tecla. */
export const NIVELACION = '85';

/** La regla «topada» (`comunes/nivelacion.ts` y `Services/Nivelacion.php`, que dicen lo mismo). */
export function queda(nivelacion: number): number {
	return nivelacion < MINIMA_ACEPTADA ? nivelacion : MINIMA_ACEPTADA;
}
export const QUEDA = queda(Number(NIVELACION));
export const EXPLICACION = `Regla del colegio: la nivelación se topa en la mínima aprobatoria (${MINIMA_ACEPTADA}). Queda ${QUEDA}.`;

/** Las casillas nivelables: las perdidas. */
export const PERDIDAS = NOTAS.flatMap((f, fila) => f.map((n, c) => ({ fila, c, n })).filter((x) => x.n !== null && x.n < MINIMA_ACEPTADA));

export const TEXTOS = {
	aviso: 'Semana de nivelaciones del periodo 2: no puedes poner notas ni asistencia, pero sí puedes nivelar lo perdido y cambiar las definitivas.',
	modo: 'Modo nivelación',
	pistaModo: `Sólo se puede nivelar lo perdido: hay ${PERDIDAS.length} ${PERDIDAS.length === 1 ? 'casilla' : 'casillas'}. La valoración inicial no se pierde, quedan las dos.`,
	lista: 'Ver todo lo perdido del grupo en una lista',
	/* El diálogo (`dialogo-nivelacion.html`). */
	titulo: 'Registrar una nivelación',
	alumno: 'Escobar Lozano, Valentina',
	/** La definición del indicador, la misma que salía en «Notas perdidas». */
	indicador: 'Plantea ecuaciones a partir de un problema',
	/** La banda de la escala del colegio en la que cae el 55. */
	juicio: 'BAJO',
	notaNivelacion: 'Nota de la nivelación',
	fecha: 'Fecha de la nivelación',
	/** Por defecto, hoy. Inventada: el último día de la semana de nivelaciones. */
	fechaValor: '2026-06-26',
	actividad: 'Actividad de superación',
	actividadPlaceholder: 'Taller de refuerzo y sustentación oral',
	corregir: 'Corregir la valoración inicial',
	cancelar: 'Cancelar',
	registrar: 'Registrar nivelación',
	toast: 'Nivelación registrada.',
};

/* ── La geometría de la planilla (en coordenadas del panel, sin escalar) ───────────────────── */

/** Las mismas que `notas/Escena.tsx`. */
export const ANCHOS = { num: 64, alumno: 400, nota: 150, total: 120, falta: 88, relleno: 32 };
export const ALTO_FILA = 62;
export const ALTO_UNIDAD = 44;
export const ALTO_SUBCOLUMNA = 48;
export const ANCHO_TABLA = ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * COLUMNAS.length + ANCHOS.total + ANCHOS.falta * 2;
export const ANCHO_PANEL = ANCHO_TABLA + ANCHOS.relleno * 2;

export const PL = {
	titulo: 40,
	huecoTitulo: 18,
	aviso: 52,
	huecoAviso: 12,
	modo: 44,
	huecoModo: 14,
};

export const ARRIBA_AVISO = ANCHOS.relleno + PL.titulo + PL.huecoTitulo;
export const ARRIBA_MODO = ARRIBA_AVISO + PL.aviso + PL.huecoAviso;
export const ARRIBA_TABLA = ARRIBA_MODO + PL.modo + PL.huecoModo;
export const ALTO_PANEL = ARRIBA_TABLA + ALTO_UNIDAD + ALTO_SUBCOLUMNA + ALTO_FILA * ALUMNOS.length + ANCHOS.relleno;

export { UNIDAD };

/** A qué escala y dónde cae el panel en el fotograma: que quepa en la banda con aire. */
export const ENCUADRE_PL = (() => {
	const escala = Math.min((BANDA.alto - 36) / ALTO_PANEL, (1920 - 200) / ANCHO_PANEL);
	return {
		escala,
		x: (1920 - ANCHO_PANEL * escala) / 2,
		y: BANDA.arriba + (BANDA.alto - ALTO_PANEL * escala) / 2,
	};
})();

function alFotograma(r: { x: number; y: number; ancho: number; alto: number }, radio = 8) {
	const e = ENCUADRE_PL;
	return { x: e.x + r.x * e.escala, y: e.y + r.y * e.escala, ancho: r.ancho * e.escala, alto: r.alto * e.escala, radio };
}

/** La casilla (el hueco entero de la columna) de una fila, en el fotograma. */
export function casillaEnElFotograma(fila: number, c: number) {
	return alFotograma({
		x: ANCHOS.relleno + ANCHOS.num + ANCHOS.alumno + ANCHOS.nota * c,
		y: ARRIBA_TABLA + ALTO_UNIDAD + ALTO_SUBCOLUMNA + ALTO_FILA * fila,
		ancho: ANCHOS.nota,
		alto: ALTO_FILA,
	});
}

export function avisoEnElFotograma() {
	return alFotograma({ x: ANCHOS.relleno - 6, y: ARRIBA_AVISO - 6, ancho: ANCHO_TABLA + 12, alto: PL.aviso + 12 });
}

/** La casilla de «Modo nivelación» y su pista. */
export function modoEnElFotograma(ancho = 900) {
	return alFotograma({ x: ANCHOS.relleno - 8, y: ARRIBA_MODO - 4, ancho, alto: PL.modo + 8 });
}

/** El centro del cuadradito de la casilla de verificación. */
export function checkEnElFotograma() {
	const r = alFotograma({ x: ANCHOS.relleno + 14, y: ARRIBA_MODO + PL.modo / 2 - 11, ancho: 22, alto: 22 });
	return { x: r.x + r.ancho / 2, y: r.y + r.alto / 2 };
}

/** La cabecera de la unidad: «Logro 2 · Álgebra». */
export function unidadEnElFotograma() {
	return alFotograma({ x: ANCHOS.relleno + ANCHOS.num + ANCHOS.alumno, y: ARRIBA_TABLA, ancho: ANCHOS.nota * COLUMNAS.length, alto: ALTO_UNIDAD });
}

/* ── El diálogo, directamente en el fotograma ─────────────────────────────────────────────── */

export const DLG = {
	ancho: 800,
	titulo: 66,
	relleno: 28,
	dt: 230,
	fila: 38,
	etiqueta: 32,
	campo: 48,
	regla: 58,
	hueco: 12,
	enlace: 40,
	pie: 76,
};

const ALTO_CUERPO =
	DLG.relleno + DLG.fila * 3 + 14 +
	DLG.etiqueta + DLG.campo + 8 + DLG.regla + DLG.hueco +
	DLG.etiqueta + DLG.campo + DLG.hueco +
	DLG.etiqueta + DLG.campo + DLG.hueco +
	DLG.enlace + 14;

export const ALTO_DLG = DLG.titulo + ALTO_CUERPO + DLG.pie;
export const DLG_X = (1920 - DLG.ancho) / 2;
export const DLG_Y = BANDA.arriba + (BANDA.alto - ALTO_DLG) / 2;

/** Las alturas de cada cosa dentro del diálogo, en el fotograma. */
export const EN_DLG = (() => {
	let y = DLG_Y + DLG.titulo + DLG.relleno;
	const detalle = y;
	y += DLG.fila * 3 + 14;
	const etiquetaNota = y;
	y += DLG.etiqueta;
	const campoNota = y;
	y += DLG.campo + 8;
	const regla = y;
	y += DLG.regla + DLG.hueco;
	const etiquetaFecha = y;
	y += DLG.etiqueta + DLG.campo + DLG.hueco;
	const etiquetaActividad = y;
	y += DLG.etiqueta + DLG.campo + DLG.hueco;
	const enlace = y;
	return { detalle, etiquetaNota, campoNota, regla, etiquetaFecha, etiquetaActividad, enlace, pie: DLG_Y + ALTO_DLG - DLG.pie };
})();

const IZQ = DLG_X + DLG.relleno;
const ANCHO_UTIL = DLG.ancho - DLG.relleno * 2;

export const RECTS_DLG = {
	detalle: { x: IZQ - 8, y: EN_DLG.detalle - 6, ancho: ANCHO_UTIL + 16, alto: DLG.fila * 3 + 12, radio: 8 },
	inicial: { x: IZQ - 8, y: EN_DLG.detalle + DLG.fila * 2 - 4, ancho: 420, alto: DLG.fila + 8, radio: 8 },
	campo: { x: IZQ, y: EN_DLG.campoNota, ancho: 170, alto: DLG.campo },
	regla: { x: IZQ - 8, y: EN_DLG.regla - 4, ancho: ANCHO_UTIL + 16, alto: DLG.regla + 8, radio: 8 },
	enlace: { x: IZQ - 8, y: EN_DLG.enlace - 2, ancho: 330, alto: DLG.enlace + 4, radio: 8 },
	registrar: { x: DLG_X + DLG.ancho - DLG.relleno - 240, y: EN_DLG.pie + (DLG.pie - 48) / 2, ancho: 240, alto: 48 },
};
