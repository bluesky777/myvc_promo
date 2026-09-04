/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL CLIP LARGO: **TRES PANTALLAS Y UN DIÁLOGO**, encadenados.
 *
 *     ACTO 1  COMPORTAMIENTO   se abre la pestaña del último periodo y se escribe en el libro
 *     ACTO 2  DISCIPLINA       la rejilla; un distintivo dice que hay una situación, y se despliega
 *     ACTO 3  EL DIÁLOGO       se abre CON TODO PUESTO menos la descripción, que es lo que se teclea
 *     ACTO 4  LA VUELTA        se guarda, y la nueva situación aparece **debajo de la que ya estaba**
 *
 * Cada pantalla entra y sale con el principio de `comunes/movimiento.ts`: se monta escribiéndose y
 * se va fila a fila. Entre acto y acto hay un hueco corto -- lo justo para que se lean como momentos
 * distintos y no como capas superpuestas.
 */

export const FPS = 30;

/* ── ACTO 1: comportamiento ───────────────────────────────────────────────────────────────── */

export const C_TITULO = 8;
export const C_FICHAS = 26;
export const C_PASO_FICHA = 9;

export const C_CURSOR = 76;
/** El puntero llega a la pestaña del último periodo y la pulsa. */
export const C_PESTANA = 96;
export const C_CLIC_PESTANA = 100;
/** Va al campo del libro, lo pulsa y escribe. */
export const C_CAMPO = 122;
export const C_CLIC_CAMPO = 126;
export const C_ESCRIBE = 132;
export const C_POR_TECLA = 2;
/** Y el distintivo de la pestaña sube: ahora ese periodo tiene algo escrito. */
export const C_DISTINTIVO = 264;

export const C_SALIDA = 286;
export const C_PASO_SALIDA = 5;

/* ── ACTO 2: la rejilla de disciplina ─────────────────────────────────────────────────────── */

export const D_PANEL = 322;
export const D_TITULO = 328;
export const D_CABECERAS = 346;
export const D_PASO_CABECERA = 5;
export const D_FILAS = 368;
export const D_PASO_FILA = 6;

export const D_CURSOR = 408;
/** Pulsa el distintivo que dice que hay una situación. */
export const D_CLIC_CONTADOR = 428;
/** Y el detalle se despliega debajo, dentro de la misma celda. */
export const D_DETALLE = 432;
/** Pulsa el detalle: eso abre el diálogo. */
export const D_CLIC_DETALLE = 470;

/* ── ACTO 3: el diálogo ───────────────────────────────────────────────────────────────────── */

export const M_ABRE = 478;
export const M_CAMPOS = 490;
export const M_PASO_CAMPO = 5;
export const M_CURSOR = 536;
export const M_CLIC_DESCRIPCION = 552;
export const M_ESCRIBE = 558;
export const M_POR_TECLA = 2;
export const M_CLIC_GUARDAR = 640;
export const M_CIERRA = 648;

/* ── ACTO 4: la nueva situación, debajo de la que ya estaba ───────────────────────────────── */

export const N_APARECE = 664;

export const SALIDA = 740;
export const PASO_SALIDA = 4;

export const DURACION = 800;
