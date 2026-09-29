import { RESPIRO_VOZ, RETRASO_VOZ, segundosDeVoz } from './voz';
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
	/**
	 * LO IRREVERSIBLE (PLAN §2.8): el rótulo sale en rojo y **se queda un segundo más** de lo que su
	 * texto necesita. `compruebaElGuion` lo exige. Sin esto, el rótulo es el de siempre.
	 */
	rojo?: boolean;
	/** Lo que dice la voz, si no es el rótulo tal cual (un rótulo con «Aus, Tard» no se lee en voz alta). */
	voz?: string;
}

/**
 * LA PUERTA. Comprueba que cada paso dura lo que su texto necesita, y que el guion va en orden.
 * Se llama al cargar el módulo del guion, así que falla en `npm run studio` y no en el render.
 */
export function compruebaElGuion(pasos: Paso[], fps: number, final: number): void {
	/* `tools/voz.mjs` carga los guiones sólo para sacar sus textos: ahí no hay puerta que valga. */
	if ((globalThis as { SIN_PUERTA_DE_VOZ?: boolean }).SIN_PUERTA_DE_VOZ) { return; }
	pasos.forEach((paso, i) => {
		const acaba = i + 1 < pasos.length ? pasos[i + 1].desde : final;
		const dura = acaba - paso.desde;
		const voz = segundosDeVoz(paso.voz ?? paso.texto);
		const hace_falta =
			(voz === null ? fotogramasDeLectura(paso.texto, fps) : RETRASO_VOZ + Math.ceil(voz * fps) + RESPIRO_VOZ) + (paso.rojo ? fps : 0);

		if (dura < 0) {
			throw new Error(`Guion: el paso ${i + 1} empieza en ${paso.desde} y el siguiente antes.`);
		}
		if (dura < hace_falta) {
			throw new Error(
				`Guion: el paso ${i + 1} dura ${dura} fotogramas y su texto necesita ${hace_falta} ` +
					`(${voz === null ? `${palabras(paso.texto)} palabras` : `${voz} s de voz`}). Alarga el paso o recorta el texto:\n  «${paso.texto}»`,
			);
		}
	});
}

/*
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * LOS CAPÍTULOS. **No son los pasos.**
 *
 * Un vídeo de dieciocho pasos no tiene dieciocho capítulos: tiene cuatro o cinco momentos, y un
 * índice de dieciocho renglones no se lee. Los capítulos son para dos cosas de la aplicación, las
 * dos de `catalogo-de-ayuda.ts` en el front:
 *
 *   1. el índice que se pinta al lado del vídeo, para saltar;
 *   2. el `?start=` de los «?» pegados a un mando concreto -- un vídeo de 109 s con cinco
 *      capítulos sirve a cinco botones de ayuda sin grabar cinco vídeos.
 *
 * Van en fotogramas, como todo lo demás del guion, y `CATALOGO-AYUDA.json` los publica en segundos.
 */
export interface Capitulo {
	/** Fotograma en el que empieza. */
	desde: number;
	/** Cómo se lee en el índice. Corto: es una entrada de lista, no un rótulo. */
	titulo: string;
}

/**
 * LA PUERTA DE LOS CAPÍTULOS: en orden, dentro del vídeo, y ni demasiados ni uno solo. Falla en el
 * estudio, como la de los rótulos.
 */
export function compruebaLosCapitulos(capitulos: Capitulo[], duracion: number): void {
	/* Entre 2 y 6: es lo que cabe en el índice del panel de ayuda de la aplicación sin hacer scroll. */
	if (capitulos.length < 2 || capitulos.length > 6) {
		throw new Error(`Capítulos: son ${capitulos.length}, y un índice se lee con entre 2 y 6.`);
	}
	if (capitulos[0].desde !== 0) {
		throw new Error('Capítulos: el primero tiene que empezar en 0, o el índice arranca a mitad.');
	}
	capitulos.forEach((c, i) => {
		if (c.desde >= duracion) {
			throw new Error(`Capítulos: «${c.titulo}» empieza en ${c.desde} y el vídeo dura ${duracion}.`);
		}
		if (i > 0 && c.desde <= capitulos[i - 1].desde) {
			throw new Error(`Capítulos: «${c.titulo}» no va después del anterior.`);
		}
	});
}

/** En qué paso estamos. Devuelve `-1` antes del primero. */
export function pasoEn(pasos: Paso[], frame: number): number {
	let cual = -1;
	pasos.forEach((p, i) => { if (frame >= p.desde) { cual = i; } });
	return cual;
}
