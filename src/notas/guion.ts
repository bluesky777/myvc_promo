/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL GUION DEL CLIP: cuándo se monta la pantalla, qué se teclea, cuándo vuelve el lote y cuándo se
 * va todo. Un solo sitio, para poder mover el ritmo sin tocar el dibujo.
 *
 * TRES ACTOS, y el primero y el tercero son **el principio de la casa** (ver `comunes/movimiento.ts`):
 *
 *     1. SE MONTA    los títulos se escriben, las columnas salen una a una, las filas van llegando
 *     2. SE TRABAJA  se teclean tres notas -> aro ámbar -> el lote vuelve -> UN aviso
 *     3. SE VA       cada fila se aparta por su cuenta, escalonadas, y el conjunto se lee como uno
 */

export const FPS = 30;

/* ── ACTO 1: la pantalla se monta ─────────────────────────────────────────────────────────── */

/** El panel entra: es lo único que sí aparece de golpe, porque es el marco, no el contenido. */
export const PANEL = 0;

/** El título se escribe, con su cursor. */
export const TITULO = 8;

/** Las cabeceras, una detrás de otra y escribiéndose cada una. */
export const CABECERAS = 18;
export const PASO_CABECERA = 5;

/** Y las filas van cayendo. `PASO_FILA` es lo que espera cada una respecto a la anterior. */
export const FILAS = 40;
export const PASO_FILA = 5;

/* ── ACTO 2: se teclean tres notas ────────────────────────────────────────────────────────── */

export interface Tecleo {
	fila: number;
	valor: string;
	/** Fotograma de la PRIMERA tecla. El aro se enciende aquí. */
	empieza: number;
}

export const COLUMNA_TECLEADA = 1;
export const POR_TECLA = 5;
export const FOCO_ANTES = 8;

export const TECLEOS: Tecleo[] = [
	{ fila: 1, valor: '92', empieza: 100 },
	{ fila: 3, valor: '78', empieza: 130 },
	{ fila: 4, valor: '55', empieza: 160 },
];

/*
 * EL LOTE VUELVE, y aquí el clip **se aparta a propósito de los tiempos de la aplicación**.
 *
 * De verdad son hasta tres segundos (1 s de espera de la celda + 2 s de ventana del lote + la ida y
 * vuelta), y así estaba el primer montaje. Pero en un vídeo promocional esos tres segundos son tres
 * segundos de pantalla quieta, que es donde se pierde a quien mira. Aquí van 12 fotogramas --0,4 s--
 * desde la última tecla: lo justo para que el aro se vea encendido y se entienda que estaba pendiente.
 *
 * **Lo que NO se toca es el orden ni el desenlace**: los tres aros se apagan a la vez y sale UN
 * aviso con las tres notas, porque eso sí es lo que hace la aplicación.
 */
export const CONFIRMA = 177;

/* ── ACTO 3: todo se va ───────────────────────────────────────────────────────────────────── */

/** Cuándo empieza a irse. Entre el aviso y esto hay 2,4 s: lo que se tarda en leerlo. */
export const SALIDA = 250;
export const PASO_SALIDA = 4;

export const DURACION = 296;

/** Lo que el aviso dura en pantalla: desde que vuelve el lote hasta que la pantalla se va. */
export const AVISO_DURA = SALIDA - CONFIRMA;

/** Lo que el aviso dice, armado como lo arma `loQueSeGuardo()` en `planilla-notas.ts`. */
export function textoDelAviso(): string {
	const valores = TECLEOS.map((t) => t.valor);
	const verbo = valores.length === 1 ? 'Cambiada' : 'Cambiadas';
	return `${verbo}: ${valores.join(', ')}`;
}
