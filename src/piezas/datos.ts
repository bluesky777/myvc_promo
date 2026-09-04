/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LO QUE DICEN LAS TRES PIEZAS. **Todo el texto del vídeo que no sale de una pantalla está aquí.**
 *
 * DOS COSAS ESTÁN PENDIENTES DE JOSETH y se dibujan como hueco rayado, a propósito: una tarjeta con
 * un teléfono inventado es peor que una tarjeta que se ve sin terminar -- la primera se cuela en el
 * montaje y acaba en el vídeo que ve la Unión.
 */

export const PRODUCTO = 'Mi Cole Virtual';

/* ── LA PORTADA ────────────────────────────────────────────────────────────────────────────── */

/**
 * NO LLEVA NINGÚN NÚMERO DE COLEGIOS, y es deliberado: en los documentos de la UCN conviven «los
 * dieciséis colegios de MyVc» y «trece en territorio UCN», y una cifra equivocada en la primera
 * pantalla, delante de la propia Unión, cuesta la credibilidad del resto del vídeo. Las cifras van
 * en los clips del portal, que sí están medidas.
 */
export const PORTADA_TITULO = PRODUCTO;
export const PORTADA_BAJADA = 'El sistema con el que un colegio lleva su día';

/** Las cuatro palabras son, en este orden, los cuatro clips que vienen detrás. Es el índice. */
export const PORTADA_PILDORAS = ['Notas', 'Disciplina', 'Asistencia', 'Horarios'];

/* ── LA TARJETA DEL DESCUENTO ──────────────────────────────────────────────────────────────── */

export const DESCUENTO = 30;

/**
 * CONFIRMADO POR ÉL EL 2026-09-03, y conviene que quede dicho cuál de las dos era. Sus palabras
 * originales --«dándoles un 30 % de descuento a cada colegio que me consigan ellos»-- admitían dos
 * lecturas que no valen lo mismo:
 *
 *   a) el colegio NUEVO entra con 30 % de descuento;
 *   b) quien TRAE al colegio nuevo se gana un 30 % en lo suyo.   ← ESTA
 *
 * Es la (b): **la Unión se descuenta un 30 % de lo suyo por cada colegio que consiga**, que es la
 * que la convierte en vendedora. Si alguien cambia este texto, que sepa que está cambiando la
 * oferta y no la redacción.
 */
export const TARJETA_TITULAR = 'de descuento';
export const TARJETA_CONDICION = 'por cada colegio que la Unión traiga';
export const TARJETA_PIE = 'Sin tope: se acumula colegio a colegio';

/* ── EL CIERRE ─────────────────────────────────────────────────────────────────────────────── */

/**
 * PENDIENTE: los datos de contacto. `null` se dibuja como un hueco rayado con su etiqueta, para que
 * quien vea el borrador sepa qué falta y para que **nadie pueda montar el vídeo sin darse cuenta**.
 */
export const CONTACTO: { etiqueta: string; valor: string | null }[] = [
	{ etiqueta: 'Teléfono', valor: null },
	{ etiqueta: 'Correo', valor: null },
	{ etiqueta: 'Web', valor: null },
];

export const CIERRE_REMATE = 'Una demostración en su colegio, sin compromiso';
