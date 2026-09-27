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

/* ── LA TARJETA DEL TRATO ─────────────────────────────────────────────────────────────────── */

export const DESCUENTO = 30;

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * QUÉ DICE LA TARJETA, Y POR QUÉ HA CAMBIADO DOS VECES. La historia importa: quien toque estas
 * cuatro cadenas está cambiando **la oferta**, no la redacción.
 *
 *   3 sep 2026   Él dijo «un 30 % de descuento a cada colegio que me consigan ellos», y se entendió
 *                que la Unión se descontaba un 30 % de lo suyo por cada colegio que trajera.
 *   4 sep 2026   CORREGIDO, y está en `MENSAJES-PENDIENTES.md` y en `myvc_ucn/docs/03-decisiones.md`:
 *                el 30 % es **de lo que paguen sus colegios** y **vuelve a la Unión**, sin que ella
 *                tenga que traer a nadie. La condición es que adopten el ecosistema como el oficial.
 *   6 sep 2026   El guion del vídeo (punto 7) ya lo dice así, y esta tarjeta se pone al día con él.
 *
 * DOS PALABRAS QUE NO VUELVEN. «Descuento» no, porque **a la Unión no se le puede descontar nada:
 * la Unión no paga nada**, y un descuento sólo significa algo para quien tiene una factura delante.
 * Y la mecánica --si el colegio le paga a él y él le devuelve, o al revés-- **no sale en el vídeo**:
 * es fiscal y está abierta. Lo que el vídeo dice es a quién le llega el dinero.
 */
export const TARJETA_TITULAR = 'de lo que paguen sus colegios vuelve a la Unión';
export const TARJETA_CONDICION = 'Si adoptan el ecosistema como el oficial de la UCN';
export const TARJETA_PIE = 'Y el portal administrativo no se cobra: es lo que reciben por hacer suyo el sistema';

/* ── EL TRATO: LAS TRES RAZONES ───────────────────────────────────────────────────────────── */

/*
 * LAS TRES COSAS QUE NO TRAE NINGÚN OTRO SOBRE. Son las del punto 7 del guion, en su orden y sin
 * añadir ninguna: **la fuerza del bloque está en que sean tres**, y una cuarta razón --por buena que
 * sea-- convierte una lista que se recuerda en una lista que se olvida.
 *
 * NINGUNA LLEVA UNA CIFRA DE COLEGIOS, por lo mismo que no la lleva la portada: en los documentos de
 * la UCN conviven «dieciséis» y «trece», y una cifra equivocada delante de la propia Unión se lleva
 * por delante lo demás.
 */
export const TRATO_ENCABEZADO = 'Tres cosas que no vienen en ningún otro sobre';

export interface Razon {
	numero: string;
	icono: 'colegio' | 'horario' | 'portal';
	titulo: string;
	pie: string;
}

export const TRATO_RAZONES: Razon[] = [
	{
		numero: '01',
		icono: 'colegio',
		titulo: 'Nació en un colegio adventista',
		pie: 'No se adaptó a uno: nació dentro. Y sigue evolucionando con lo que piden los colegios.',
	},
	{
		numero: '02',
		icono: 'horario',
		titulo: 'El horario va incluido y con licencia',
		pie: 'Hoy no lo trae nadie más. Y la aplicación completa, en Play Store y App Store.',
	},
	{
		numero: '03',
		icono: 'portal',
		titulo: 'El portal es de la Unión',
		pie: 'Su mano derecha. Hoy no lo tiene ninguna otra Unión.',
	},
];

/* ── EL CIERRE ─────────────────────────────────────────────────────────────────────────────── */

/**
 * PUESTOS EL 2026-09-04, salidos del guion. **No hay teléfono**, y es una decisión suya: el cierre
 * lleva sólo la web y el correo. Si algún día hace falta, `valor: null` se dibuja como hueco rayado
 * en vez de con un número inventado -- un teléfono falso en una tarjeta terminada se cuela en el
 * montaje y acaba delante de la Unión.
 */
export const CONTACTO: { etiqueta: string; valor: string | null }[] = [
	{ etiqueta: 'Web', valor: 'micolevirtual.com' },
	{ etiqueta: 'Correo', valor: 'admin@micolevirtual.com' },
];

/**
 * LA ÚLTIMA FRASE DEL VÍDEO, y por eso no es comercial. «Educar para la eternidad» es la forma en
 * que la educación adventista se nombra a sí misma; dicha aquí, el vídeo no termina pidiendo una
 * reunión, termina en el terreno común. Pedido por él el 2026-09-04: nada de «sin compromiso».
 */
export const CIERRE_REMATE = 'Los esperamos, para educar juntos para la eternidad';
