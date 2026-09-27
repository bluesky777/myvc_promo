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
export function textoDelAviso(tecleos: Tecleo[] = TECLEOS): string {
	const valores = tecleos.map((t) => t.valor);
	const verbo = valores.length === 1 ? 'Cambiada' : 'Cambiadas';
	return `${verbo}: ${valores.join(', ')}`;
}

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * EL RITMO, SUELTO DEL DIBUJO. **Para que la misma planilla pueda contarse a dos velocidades.**
 *
 * Lo de arriba es el ritmo del clip PROMOCIONAL, con su licencia declarada: entre la última tecla
 * y el aviso pasan 0,4 s en vez de los hasta tres segundos de la aplicación, porque tres segundos
 * de pantalla quieta en un promocional son tres segundos donde se pierde a quien mira.
 *
 * UN VÍDEO DE AYUDA QUIERE LO CONTRARIO. Ahí esos segundos **son el contenido**: «tarda un par de
 * segundos porque está juntando la tanda» es justo la frase que evita la llamada de «se quedó
 * pensando». Así que el clip de ayuda pasa su propio `Ritmo` con los tiempos de verdad.
 *
 * Y POR ESO ESTO ES UN PARÁMETRO Y NO UNA COPIA DE LA ESCENA. `combinado/Escena.tsx` explica por
 * qué allí NO se parametrizó nada y se usó `<Sequence>`: porque el clip de rúbricas suelto y su
 * segunda mitad **tienen que ser el mismo vídeo**, y dos guiones separados se habrían ido
 * distanciando. Aquí la exigencia es al revés: los dos vídeos tienen que enseñar la misma pantalla
 * **a distinta velocidad**, a propósito. Lo que no puede haber es dos planillas.
 */

export interface Ritmo {
	TITULO: number;
	CABECERAS: number;
	PASO_CABECERA: number;
	FILAS: number;
	PASO_FILA: number;
	POR_TECLA: number;
	FOCO_ANTES: number;
	TECLEOS: Tecleo[];
	CONFIRMA: number;
	SALIDA: number;
	PASO_SALIDA: number;
}

/** El del clip promocional: el que lleva el vídeo que ya está hecho. Es el de por defecto. */
export const RITMO: Ritmo = {
	TITULO, CABECERAS, PASO_CABECERA, FILAS, PASO_FILA, POR_TECLA, FOCO_ANTES,
	TECLEOS, CONFIRMA, SALIDA, PASO_SALIDA,
};
