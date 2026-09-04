/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL CLIP DE RÚBRICAS. **DOS PANTALLAS**, y por eso hace falta el principio entero de
 * `comunes/movimiento.ts`: la primera se monta, se usa y se va; la segunda entra igual que entró
 * la primera. Ningún corte seco.
 *
 *     ACTO A   la planilla, con el botón «Calificar con rúbrica» apareciendo en la casilla
 *     PASO     la planilla se va fila a fila y entra la rúbrica
 *     ACTO B   la matriz: se marca un nivel por criterio y **el desglose se va llenando solo**
 *     ACTO C   sale la nota que calcula la rúbrica, y todo se va
 */

export const FPS = 30;

/* ── ACTO A: la planilla y el botón de rúbrica ────────────────────────────────────────────── */

export const A_TITULO = 8;
export const A_CABECERAS = 16;
export const A_FILAS = 36;
export const A_PASO_FILA = 5;

/** El puntero entra y va hacia la casilla. Al llegar aparece el botón: es lo que lo hace aparecer. */
export const A_CURSOR = 54;
export const A_LLEGA = 72;
export const A_BOTON = 74;
/** Y pulsa el botón. */
export const A_CLIC = 96;

export const A_SALIDA = 104;
export const A_PASO_SALIDA = 4;

/* ── ACTO B: la matriz de la rúbrica ──────────────────────────────────────────────────────── */

export const B_PANEL = 128;
export const B_TITULO = 134;
export const B_CABECERAS = 152;
export const B_PASO_CABECERA = 5;
export const B_FILAS = 170;
export const B_PASO_FILA = 6;

/** El desglose aparece con las tres líneas «sin marcar»: dice desde el principio de dónde saldrá la nota. */
export const B_DESGLOSE = 198;

/** Cuándo se marca cada criterio. Cada marca llena su línea del desglose. */
export const B_MARCAS = [216, 246, 276];

/** Y cuándo sale la nota, que es lo que cierra la historia. */
export const B_NOTA = 294;

/* ── ACTO C: todo se va ───────────────────────────────────────────────────────────────────── */

export const SALIDA = 340;
export const PASO_SALIDA = 4;

export const DURACION = 396;
