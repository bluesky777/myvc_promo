/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS COLORES DEL PROGRAMA DE HORARIOS. Son **otra aplicación** --`myvc_horarios`, Tauri + Angular--
 * y no comparte paleta con MyVC: aquí no hay morado ni el acento del colegio, hay el azul de tinta
 * de una herramienta de escritorio. Copiarle el color a la otra sería enseñar un programa que no es.
 *
 * Salen de `escritorio/src/app/rejilla/rejilla.scss` y `datos/disponibilidad.scss`.
 */

export const TINTA = '#16202b';
export const TENUE = '#57626f';
export const APAGADO = '#a7b0bb';
export const AZUL = '#1b4d7a';
export const AZUL_TINTE = '#eaf2fa';
export const LINEA = '#dfe5ec';
export const PAPEL = '#ffffff';

/*
 * LAS TRES CLASES DE CASILLA AL LLEVAR UNA FICHA: verde es «cabe», ámbar es «cabe y cuesta»
 * --alguien marcó «?» ahí-- y rayado es «no cabe». Se pintan de una vez al coger, y eso es la mitad
 * de lo que hace útil la pantalla: **antes de soltar ya sabes dónde puedes**.
 */
export const LEGAL_FONDO = '#e8f6ec';
export const LEGAL_LINEA = '#b7dfc4';
export const CONDICIONAL_FONDO = '#fdf3e2';
export const CONDICIONAL_LINEA = '#efd6a6';
export const ILEGAL_RAYAS = 'repeating-linear-gradient(45deg, #f3e6e6, #f3e6e6 3px, #fbf5f5 3px, #fbf5f5 6px)';
export const FUERA_RAYAS = 'repeating-linear-gradient(45deg, #eef1f4, #eef1f4 3px, #f7f9fb 3px, #f7f9fb 6px)';

/** El hueco: una casilla vacía ENTRE dos clases del mismo día. No es lo mismo que estar libre. */
export const HUECO_FONDO = '#fdf4ec';
export const HUECO_PUNTO = '#c07d12';

/* Los dos estados que se marcan en la disponibilidad. */
export const CONDICIONAL = { fondo: '#fdf9ee', linea: '#e6d5a8', letra: '#8a6d1f' };
export const INADECUADO = { fondo: '#fdf3f2', linea: '#e8bcb7', letra: '#b3261e' };

/*
 * EL COLOR DE UNA FICHA SALE DEL DOCENTE, y el tono **se guarda, no se recalcula**: si saliera de la
 * posición en la lista, importar un docente le cambiaría el color a media plantilla. Y lo decide el
 * núcleo y no la pantalla porque **el papel y la rejilla tienen que colorear igual**.
 */
export function fichaFondo(tono: number): string { return `hsl(${tono} 62% 92%)`; }
export function fichaLinea(tono: number): string { return `hsl(${tono} 45% 48%)`; }
export function fichaLetra(tono: number): string { return `hsl(${tono} 45% 35%)`; }

export const FUENTE =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
