import { interpolate, spring } from 'remotion';

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CÓMO ENTRA Y CÓMO SE VA UNA PANTALLA. **ESTO VALE PARA TODOS LOS CLIPS**, no sólo para el de notas.
 *
 * EL PRINCIPIO, dicho una vez y respetado en todos:
 *
 *   · UNA PANTALLA NO APARECE DE GOLPE NI CON UN FUNDIDO. Se construye delante de quien mira: los
 *     títulos **se escriben**, las filas **van llegando** una detrás de otra. Un fundido enseña una
 *     foto; esto enseña una pantalla montándose, y de paso obliga al ojo a recorrerla en el orden
 *     en que hay que leerla -- primero qué es, luego las columnas, luego los datos.
 *
 *   · Y SE VA IGUAL. Cada fila sale por su cuenta, escalonada, pero con las salidas solapadas para
 *     que el conjunto se lea como **un solo movimiento** y no como seis despedidas.
 *
 *   · SI EL CLIP CAMBIA DE PANTALLA, la nueva entra con esto mismo. No hay cortes secos.
 *
 * TODO SALE DE FUNCIONES Y NO DE CSS: un render por fotogramas no ejecuta animaciones de CSS -- cada
 * fotograma es una foto suelta, así que la posición de cada cosa hay que calcularla.
 */

/** Lo que se lleva escrito de un texto en este fotograma. Es la máquina de escribir de los títulos. */
export function escrito(frame: number, texto: string, desde: number, porTecla = 2): string {
	if (frame < desde) { return ''; }
	const letras = Math.floor((frame - desde) / porTecla);
	return texto.slice(0, Math.min(texto.length, letras));
}

/** Si el cursor de escritura tiene que verse: mientras se escribe, y un momento después. */
export function escribiendo(frame: number, texto: string, desde: number, porTecla = 2): boolean {
	const fin = desde + texto.length * porTecla;
	return frame >= desde && frame < fin + 10;
}

/** Un 0→1 con muelle. Devuelve 0 limpio antes de tiempo, sin pedirle a `spring` fotogramas negativos. */
export function entra(frame: number, fps: number, desde: number, dur = 16): number {
	if (frame < desde) { return 0; }
	return spring({ frame: frame - desde, fps, config: { damping: 16, mass: 0.5 }, durationInFrames: dur });
}

/**
 * LA LLEGADA DE UN ELEMENTO DE UNA LISTA. `indice` es su sitio en la lista y `paso` lo que espera
 * cada uno respecto al anterior: eso es lo que hace que las filas **caigan en cascada** en vez de
 * aparecer todas a la vez.
 */
export function llega(frame: number, fps: number, indice: number, desde: number, paso = 6, dur = 18) {
	const t = entra(frame, fps, desde + indice * paso, dur);
	return {
		opacidad: interpolate(t, [0, 0.55], [0, 1], { extrapolateRight: 'clamp' }),
		/* Sube desde abajo y entra un poco desde la izquierda: la lectura natural de una tabla. */
		y: interpolate(t, [0, 1], [26, 0]),
		x: interpolate(t, [0, 1], [-18, 0]),
	};
}

/**
 * LA SALIDA, escalonada igual que la llegada pero **más rápida y más apretada**: irse tiene que
 * costar menos que llegar, o el final del clip se hace largo. Devuelve 0 (quieto) → 1 (fuera).
 */
export function seVa(frame: number, indice: number, desde: number, paso = 4, dur = 14): number {
	return interpolate(frame - desde - indice * paso, [0, dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

/** Lo que hay que aplicarle a una fila que se va: se aparta a la derecha y se apaga. */
export function estiloDeSalida(fuera: number) {
	return {
		opacidad: 1 - fuera,
		x: fuera * 64,
		escala: 1 - fuera * 0.04,
	};
}
