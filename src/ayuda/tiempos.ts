/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * CUÁNTO TIENE QUE DURAR UN RÓTULO. **La regla de los vídeos sin audio, en un solo sitio.**
 *
 * En un clip promocional el texto acompaña; aquí el texto ES la voz. Si un rótulo se va antes de
 * que dé tiempo a leerlo, el vídeo no explica nada -- y el que mira no puede rebobinar medio
 * segundo, retrocede diez y se pierde.
 *
 * LA CUENTA: 2,5 palabras por segundo más un segundo. Las 2,5 son lectura cómoda en pantalla, no
 * lectura rápida: quien mira esto está además **mirando la pantalla**, no sólo leyendo. El segundo
 * de más es el que se va en darse cuenta de que el texto cambió.
 *
 * Y NO ES UN CONSEJO, ES UNA PUERTA: `compruebaElGuion()` revienta en el estudio si un paso dura
 * menos de lo que su texto necesita. Un guion que no cumple no llega a renderizarse, que es la
 * única forma de que la regla siga viva dentro de tres meses y ochenta vídeos.
 */

/** Palabras por segundo. Lectura en pantalla mientras además se mira lo que pasa. */
export const PALABRAS_POR_SEGUNDO = 2.5;

/** Lo que se va en notar que el texto cambió, antes de empezar a leerlo. */
export const SEGUNDOS_DE_ARRANQUE = 1;

/** Ningún rótulo baja de aquí, por corto que sea. «Guarda» son dos palabras de nada y aun así se lee. */
export const SEGUNDOS_MINIMOS = 2;

export function palabras(texto: string): number {
	return texto.trim().split(/\s+/).filter(Boolean).length;
}

/** Los segundos que ese texto necesita en pantalla. */
export function segundosDeLectura(texto: string): number {
	return Math.max(SEGUNDOS_MINIMOS, palabras(texto) / PALABRAS_POR_SEGUNDO + SEGUNDOS_DE_ARRANQUE);
}

/** Lo mismo en fotogramas, redondeando hacia arriba: siempre a favor de quien lee. */
export function fotogramasDeLectura(texto: string, fps: number): number {
	return Math.ceil(segundosDeLectura(texto) * fps);
}

/*
 * UN PASO DEL GUION. Lo que cambia entre un paso y el siguiente es **lo que se está contando**, no
 * lo que se ve: la ubicación puede seguir siendo la misma tres pasos seguidos, y de hecho lo es.
 */
export interface Paso {
	/** Fotograma en el que este rótulo sustituye al anterior. */
	desde: number;
	/** El texto de abajo. Uno solo a la vez; si hacen falta dos ideas, son dos pasos. */
	texto: string;
	/**
	 * Dónde está quien mira, escrito como el camino del menú. Se pinta arriba y **no desaparece
	 * nunca**: quien caiga en el segundo 40 tiene que saber en qué pantalla está.
	 */
	ubicacion: string;
	/** La dirección de la barra del navegador. Sin `/panel`: en la aplicación nueva ya no lo lleva. */
	url: string;
	/** Lo que hay que mirar, en coordenadas del fotograma. Sin esto, el velo no se pinta. */
	foco?: { x: number; y: number; ancho: number; alto: number; radio?: number };
	/**
	 * CUÁNDO SE APAGA EL FOCO, si tiene que apagarse **antes** de que acabe el paso. Hace falta
	 * cuando la pantalla cambia a mitad del rótulo: un recuadro que sigue encendido sobre la
	 * pantalla siguiente señala un sitio que ya no existe, y eso se ve como un fallo de dibujo.
	 */
	focoHasta?: number;
}

/**
 * LA PUERTA. Comprueba que cada paso dura lo que su texto necesita, y que el guion va en orden.
 * Se llama al cargar el módulo del guion, así que falla en `npm run studio` y no en el render.
 */
export function compruebaElGuion(pasos: Paso[], fps: number, final: number): void {
	pasos.forEach((paso, i) => {
		const acaba = i + 1 < pasos.length ? pasos[i + 1].desde : final;
		const dura = acaba - paso.desde;
		const hace_falta = fotogramasDeLectura(paso.texto, fps);

		if (dura < 0) {
			throw new Error(`Guion: el paso ${i + 1} empieza en ${paso.desde} y el siguiente antes.`);
		}
		if (dura < hace_falta) {
			throw new Error(
				`Guion: el paso ${i + 1} dura ${dura} fotogramas y su texto necesita ${hace_falta} ` +
					`(${palabras(paso.texto)} palabras). Alarga el paso o recorta el texto:\n  «${paso.texto}»`,
			);
		}
	});
}

/** En qué paso estamos. Devuelve `-1` antes del primero. */
export function pasoEn(pasos: Paso[], frame: number): number {
	let cual = -1;
	pasos.forEach((p, i) => { if (frame >= p.desde) { cual = i; } });
	return cual;
}
