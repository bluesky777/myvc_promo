/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL CLIP DEL MÓVIL. **CUATRO PANTALLAS**, y las tres últimas entran deslizando desde la
 * derecha, que es como navega un teléfono. El principio de la casa se cumple igual: nada aparece de
 * golpe, y dentro de cada pantalla las filas van llegando.
 *
 *     1  MIS ACUDIDOS   el acudiente ve a sus dos hijos y abre a uno
 *     2  LAS NOTAS      mientras las mira, **llega el aviso**
 *     3  LA ASISTENCIA  toca el aviso y cae aquí: dos ausencias frente al colegio
 *     4  EL DETALLE     qué dos días fueron
 *
 * QUE EL AVISO LLEGUE MIENTRAS MIRA OTRA COSA es la mitad del argumento: el acudiente no estaba
 * buscando esto. Si el clip empezara en la pantalla de asistencia, lo que se vería es a alguien
 * comprobando algo que ya sabía.
 */

export const FPS = 30;

/* ── 1: los dos hijos ─────────────────────────────────────────────────────────────────────── */

export const A_TELEFONO = 0;
export const A_TITULO = 12;
export const A_TARJETAS = 34;
export const A_PASO = 10;
export const A_DEDO = 72;
export const A_TOCA = 90;

/*
 * ── 2: las notas, y el aviso ───────────────────────────────────────────────────────────────
 *
 * LAS FILAS EMPIEZAN A LLEGAR CASI PEGADAS A LA ENTRADA DE LA PANTALLA, y eso está medido en un
 * fotograma: con treinta de separación se veía **la pantalla vacía** un segundo entero después de
 * deslizar. En una tabla de escritorio ese hueco se lee como que está cargando; en un móvil, donde
 * la pantalla ES la lista, se lee como que no hay nada.
 */

export const B_ENTRA = 98;
export const B_FILAS = 118;
export const B_PASO = 6;

/** Llega el aviso. Baja desde arriba, encima de lo que se esté mirando. */
export const PUSH = 206;
export const PUSH_DEDO = 258;
export const PUSH_TOCA = 272;

/* ── 3: la asistencia ─────────────────────────────────────────────────────────────────────── */

export const C_ENTRA = 280;
export const C_FILAS = 294;
export const C_PASO = 8;
export const C_DEDO = 366;
export const C_TOCA = 380;

/* ── 4: el detalle de los dos días ────────────────────────────────────────────────────────── */

export const D_ENTRA = 388;
export const D_FILAS = 402;
export const D_PASO = 10;

export const SALIDA = 500;
export const DURACION = 560;

/** Cuándo entra cada pantalla. El índice es la posición en la pila de navegación. */
export const PANTALLAS = [A_TELEFONO, B_ENTRA, C_ENTRA, D_ENTRA];
